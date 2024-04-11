"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import CardWrapper from "./card-wrapper";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
	const searchParams = useSearchParams();
	const urlError =
		searchParams.get("error") === "OAuthAccountNotLinked"
			? "Email already in use with a different provider"
			: "";
	const [show2FA, setShow2FA] = useState(false);
	const [error, setError] = useState<string>();
	const [success, setSuccess] = useState<string>();
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setError(undefined);
		setSuccess(undefined);

		startTransition(() => {
			login(values)
				.then((data) => {
					if (data?.error) {
						form.reset();
						setError(data.error);
					}

					if (data?.success) {
						form.reset();
						setSuccess(data?.success);
					}

					if (data?.twoFactor) setShow2FA(true);
				})
				.catch(() => setError("Something went wrong"));
		});
	};

	return (
		<CardWrapper
			headerLabel="Welcome back"
			backBtnLabel="Don't have an account?"
			backBtnHref="/auth/register"
			showSocial
		>
			<Form {...form}>
				<form
					action=""
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<div className="space-y-4">
						{!show2FA && (
							<>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>

											<FormControl>
												<Input
													{...field}
													disabled={isPending}
													placeholder="example@gmail.com"
													type="email"
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>

											<FormControl>
												<Input
													{...field}
													disabled={isPending}
													placeholder="Enter password"
													type="password"
												/>
											</FormControl>

											<Button
												size={"sm"}
												variant={"link"}
												asChild
												className="px-0 font-normal"
											>
												<Link href="/auth/reset">Forgot password?</Link>
											</Button>

											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}

						{show2FA && (
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Two Factor Code</FormLabel>

										<FormControl>
											<Input
												{...field}
												disabled={isPending}
												placeholder="123456"
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						)}
					</div>

					<FormError message={error || urlError} />

					<FormSuccess message={success} />

					<Button type="submit" disabled={isPending} className="w-full">
						{show2FA ? "Confirm" : "Login"}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
}

export default LoginForm;
