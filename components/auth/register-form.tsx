"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
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
import { register } from "@/actions/register";
import { useState, useTransition } from "react";

function RegisterForm() {
	const [error, setError] = useState<string>();
	const [success, setSuccess] = useState<string>();
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
		setError(undefined);
		setSuccess(undefined);

		startTransition(() => {
			register(values).then((data) => {
				setError(data.error);
				setSuccess(data.success);
			});
		});
	};

	return (
		<CardWrapper
			headerLabel="Create an account"
			backBtnLabel="Already have an account?"
			backBtnHref="/auth/login"
			showSocial
		>
			<Form {...form}>
				<form
					action=""
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>

									<FormControl>
										<Input
											{...field}
											disabled={isPending}
											placeholder="John Doe"
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

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

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormError message={error} />
					<FormSuccess message={success} />

					<Button type="submit" disabled={isPending} className="w-full">
						Create an account
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
}

export default RegisterForm;
