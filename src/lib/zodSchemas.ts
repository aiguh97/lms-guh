import { object, z } from "zod";


// export const courseStatus = ["Draft", "Published", "Archived"] as const;
// export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
// export const courseCategories =[
//   "Development",
//   "Business",
//   "Finance",
//   "It & Software",
//   "Office productivity",

//   "Design",
//   "Marketing",
//   "Music",
//   "Teaching & Academics"
// ]as const;
export const courseLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;

export const courseCategories = [
  "Development",
  "Business",
  "Finance",
  "It & Software",
  "Design",
  "Marketing",
  "Music",
  "Teaching & Academics",
] as const;

export const courseStatus = ["Draft", "Published"] as const;


export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters length" })
    .max(100, { message: "Tittle must be at most 100 characters length" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters length" }),
  fileKey: z.string().min(1, { message: "File is required" }),
 duration: z.coerce.number().min(1, "Duration is required"),
  price: z.coerce.number().min(1, "Price is required"),
  level: z.enum(courseLevels, { message: "Level is required" }),
  category: z.enum(courseCategories,{
    message:'Category is required'
  }),
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
