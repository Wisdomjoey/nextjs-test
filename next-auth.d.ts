import "next-auth";
import "next-auth/jwt";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
	interface Session {
		user: {
			role: UserRole;
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role: UserRole;
	}
}