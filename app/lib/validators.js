import { z } from "zod";

export const ProjectSchema = z.object({
    name:z.string().min(1,"Project name is required").max(30,"Project name must be 30 characters or less"),
    key:z.string().min(2,"Project key must be atleast 2 characters").max(10,"Project key must be 10 characters or less"),
    description: z.string().max(500, "Description must be 500 characters or less").optional()
})

export const SprintSchema = z.object({
    name:z.string().min(1,"Sprint name is required"),
    startDate: z.date(),
    endDate: z.date()
})

export const IssueSchema = z.object({
    title: z.string().min(1, "Title is required"),
    assigneeId: z.string().cuid("Please select assignee"),
    description: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
})