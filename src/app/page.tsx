import ModeToggle from "@/components/ui/themeToggle";
import Image from "next/image";

export default function Home() {
  return (
   <div className="flex">
    <h1 className="text-3xl font-bold underline">Hello world</h1>
    <ModeToggle/>
   </div>
  );
}
