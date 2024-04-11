import * as z from "zod";

export const NewPasswordSchema = z.object({
	password: z.string().min(6, { message: "Minimun of 6 characters required" }),
	// conformPassword: z.string().min(6, { message: "Minimun of 6 characters required" }),
});

export const ResetSchema = z.object({
	email: z.string().min(1, { message: "Email is required" }).email(),
});

export const LoginSchema = z.object({
	email: z.string().min(1, { message: "Email is required" }).email(),
	password: z.string(),
	code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	email: z.string().min(1, { message: "Email is required" }).email(),
	password: z.string().min(6, { message: "Minimun of 6 characters required" }),
});
