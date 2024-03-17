import { z } from "zod";

export const SignUpSchema = z
	.object({
		username: z.string().min(4, { message: "Minimum 4 characters!" }).max(20),
		password: z.string().min(8, { message: "Minimum 8 characters!" }).max(100),
		confirmPassword: z
			.string()
			.min(8, { message: "Minimum 8 characters!" })
			.max(100),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const SignInSchema = z.object({
	username: z.string().min(4, { message: "Minimum 4 characters!" }).max(20),
	password: z.string().min(8, { message: "Minimum 8 characters!" }).max(100),
});
