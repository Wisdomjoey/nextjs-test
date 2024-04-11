"use server";

import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/token";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) return { error: "Invalid fields" };

	const { email, password, code } = validatedFields.data;
	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.password)
		return { error: "Email does not exis" };

	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(email);

		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token
		);

		return { success: "Confirmation email has been sent" };
	}

	if (existingUser.isTwoFactorEnabled && existingUser.email) {
		if (code) {
			const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

			if (!twoFactorToken || twoFactorToken.token !== code)
				return { error: "Invalid code" };

			const hasExpired = new Date(twoFactorToken.expires) < new Date();

			if (hasExpired) return { error: "Code has expired" };

			await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });

			const existingConfirmation = await getTwoFactorConfirmationByUserId(
				existingUser.id
			);

			if (existingConfirmation)
				await db.twoFactorConfirmation.delete({
					where: { id: existingConfirmation.id },
				});

			await db.twoFactorConfirmation.create({
				data: { userId: existingUser.id },
			});
		} else {
			const twoFactorToken = await generateTwoFactorToken(existingUser.email);

			await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

			return { twoFactor: true };
		}
	}

	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials" };
					break;

				default:
					return { error: "Something went wrong" };
					break;
			}
		}

		throw error;
	}
};
