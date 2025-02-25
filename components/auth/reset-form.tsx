"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas";
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
import { reset } from "@/actions/reset";
import { useState, useTransition } from "react";

function ResetForm() {
	const [error, setError] = useState<string>();
	const [success, setSuccess] = useState<string>();
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = (values: z.infer<typeof ResetSchema>) => {
		setError(undefined);
		setSuccess(undefined);

		startTransition(() => {
			reset(values).then((data) => {
				setError(data?.error);
				setSuccess(data?.success);
			});
		});
	};

	return (
		<CardWrapper
			headerLabel="Forgot your password?"
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
					</div>

					<FormError message={error} />

					<FormSuccess message={success} />

					<Button type="submit" disabled={isPending} className="w-full">
						Send reset email
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
}

export default ResetForm;
