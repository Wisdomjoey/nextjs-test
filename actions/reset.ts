"use server";

import { getUserByEmail } from "@/data/user";
import { sendResetEmail } from "@/lib/mail";
import { generateResetToken } from "@/lib/token";
import { ResetSchema } from "@/schemas";
import * as z from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
	const validatedFields = ResetSchema.safeParse(values);

	if (!validatedFields.success) return { error: "Invalid email" };

	const { email } = validatedFields.data;
	const existingUser = await getUserByEmail(email);

	if (!existingUser) return { error: "Email not found" };

	const resetToken = await generateResetToken(email);
	await sendResetEmail(resetToken.email, resetToken.token);

	return { success: "Reset email sent" };
};
