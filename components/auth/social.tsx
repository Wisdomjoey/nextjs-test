"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

function Social() {
	const onClick = (provider: "google" | "github") => {
		signIn(provider, {
			callbackUrl: DEFAULT_LOGIN_REDIRECT,
		});
	};

	return (
		<div className="w-full flex items-center gap-x-2">
			<Button
				size={"lg"}
				className="w-full"
				variant={"outline"}
				onClick={(e) => onClick("google")}
			>
				<FcGoogle className="w-5 h-5" />
			</Button>

			<Button
				size={"lg"}
				className="w-full"
				variant={"outline"}
				onClick={(e) => onClick("github")}
			>
				<FaGithub className="w-5 h-5" />
			</Button>
		</div>
	);
}

export default Social;
