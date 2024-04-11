"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";
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
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";

function NewPasswordForm() {
	const params = useSearchParams();
	const token = params.get("token");
	const [error, setError] = useState<string>();
	const [success, setSuccess] = useState<string>();
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: "",
		},
	});

	const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
		setError(undefined);
		setSuccess(undefined);

		startTransition(() => {
			newPassword(values, token).then((data) => {
				setError(data?.error);
				setSuccess(data?.success);
			});
		});
	};

	return (
		<CardWrapper
			headerLabel="Enter new password?"
			backBtnLabel="Back to login"
			backBtnHref="/auth/login"
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
						Reset password
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
}

export default NewPasswordForm;
