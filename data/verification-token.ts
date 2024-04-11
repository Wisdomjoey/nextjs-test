import { db } from "@/lib/db";

export const getTokenByEmail = async (email: string) => {
	try {
		const verificationToken = await db.verificationToken.findFirst({
			where: { email },
		});

		return verificationToken;
	} catch (error) {
		return null;
	}
};

export const getTokenByToken = async (token: string) => {
	try {
		const verificationToken = await db.verificationToken.findUnique({
			where: { token },
		});

		return verificationToken;
	} catch (error) {
		return null;
	}
};
