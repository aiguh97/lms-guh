"use client";

import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

interface iAppProps{
  value?:string;
  onChange?:(value:string)=>void
}

export function Uploader({onChange,value}:iAppProps) {
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: "image",
    key:value
  });

  // =========================
  // UPLOAD FILE
  // =========================
  const uploadFile = useCallback(async (file: File) => {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      const presignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      if (!presignedResponse.ok) {
        toast.error("Failed to get presigned URL");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
        return;
      }

      const { presignedUrl, key } = await presignedResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          const percentage = Math.round((event.loaded / event.total) * 100);

          setFileState((prev) => ({
            ...prev,
            progress: percentage,
          }));
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              progress: 100,
              uploading: false,
              key,
            }));

            onChange?.(key);

            toast.success("File uploaded successfully");
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Upload error"));

        xhr.open("PUT", presignedUrl); // 👍 sekarang dijamin terpanggil dulu
        // xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file); // 👍 tidak akan lagi error "must be OPENED"
      });
    } catch (error) {
      toast.error(`Something went wrong during upload ${error}`);
      setFileState((prev) => ({
        ...prev,
        progress: 0,
        uploading: false,
        error: true,
      }));
    }
  }, []);

  // =========================
  // DROPZONE
  // =========================

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      // revoke previous object url
      if (fileState.objectUrl) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      setFileState({
        file,
        uploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(file),
        error: false,
        id: uuidv4(),
        isDeleting: false,
        fileType: "image",
      });

      uploadFile(file);
    },
    [uploadFile, fileState.objectUrl]
  );

  async function handleRemoveFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: fileState.key,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to remove file from storage");

        setFileState((prev) => ({
          ...prev,
          isDeleting: false, // ⬅️ jangan tetap true
          error: true,
        }));

        return;
      }

      // Revoke only for local blob URLs
      if (fileState.objectUrl && fileState.objectUrl.startsWith("blob:")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.("");

      // Full reset state
      setFileState((prev) => ({
        ...prev,
        file: null,
        key: undefined,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        id: null,
        isDeleting: false,
        error: false,
      }));

      toast.success("File removed successfully");
    } catch (err) {
      console.error(err);

      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));

      toast.error("Error removing file. please try again");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  }

  const rejectedFiles = (fileRejection: FileRejection[]) => {
    if (!fileRejection.length) return;

    const tooManyFiles = fileRejection.find(
      (r) => r.errors[0].code === "too-many-files"
    );
    const fileSizeTooBig = fileRejection.find(
      (r) => r.errors[0].code === "file-too-large"
    );

    if (tooManyFiles) toast.error("Too many files selected, max is 1");
    if (fileSizeTooBig) toast.error("File size too big");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  // =========================
  // RENDER CONTENT
  // =========================

  function renderContent() {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          file={fileState.file as File}
          progress={fileState.progress}
        />
      );
    }

    if (fileState.error) {
      return <RenderErrorState />;
    }

    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          handleRemoveFile={handleRemoveFile}
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  return (
    <Card
      {...getRootProps()}
      className={cn(
        `relative border-2 border-dashed transition-colors duration-200 
        ease-in-out w-full h-64
        ${
          isDragActive
            ? "border-primary/10 bg-primary/10 border-solid"
            : "border-border hover:border-primary"
        }`
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
