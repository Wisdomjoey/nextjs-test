"use server";

import { getResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";

export const newPassword = async (
	values: z.infer<typeof NewPasswordSchema>,
	token?: string | null
) => {
	if (!token) return { error: "Missing token" };

	const validatedFields = NewPasswordSchema.safeParse(values);

	if (!validatedFields.success) return { error: "Invalid fields" };

	const { password } = validatedFields.data;
	const existingToken = await getResetTokenByToken(token);

	if (!existingToken) return { error: "Invalid token" };

	const hasExpired = new Date(existingToken.expires) < new Date();

	if (hasExpired) return { error: "This token has expired." };

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) return { error: "The email does not exist" };

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	await db.user.update({
		where: { id: existingUser.id },
		data: { password: hashedPassword },
	});
	await db.passwordResetToken.delete({ where: { id: existingToken.id } });

	return { success: "Password updated" };
};
