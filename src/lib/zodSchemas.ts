import { object, z } from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archived"] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters length" })
    .max(100, { message: "Tittle must be at most 100 characters length" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters length" }),
  fileKey: z.string().min(1, { message: "File is required" }),
  price: z.number({ message: "Price is required" }),
  duration: z.number({ message: "Duration is required" }),
  level: z.enum(courseLevels, { message: "Level is required" }),
  category: z.string(),
  smallDescription: z
    .string()
    .min(3, { message: "description must be at least 3 characters length" })
    .max(200),
  slug: z
    .string()
    .min(3, { message: "slug must be at least 3 characters length" }),
  status: z.enum(courseStatus, { message: "status is required" }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
