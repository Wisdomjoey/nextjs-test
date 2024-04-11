"use client";

import { BeatLoader } from "react-spinners";
import CardWrapper from "@/components/auth/card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import FormSuccess from "@/components/form-success";
import FormError from "@/components/form-error";

function NewVerificationForm() {
	const [error, setError] = useState<string>();
	const [success, setSuccess] = useState<string>();
	const params = useSearchParams();
	const token = params.get("token");

	const onSubmit = useCallback(async () => {
		// if (success || error) return;
		if (!token) return setError("Missing token");

		await newVerification(token)
			.then((data) => {
				setError(data.error);
				setSuccess(data.success);
			})
			.catch(() => setError("Something went wrong"));
	}, [token]);

	useEffect(() => {
		onSubmit();
	}, [onSubmit]);

	return (
		<CardWrapper
			headerLabel="Confirming verification"
			backBtnHref="/auth/login"
			backBtnLabel="Back to login"
		>
			<div className="w-full flex items-center justify-center">
				{!success && !error && <BeatLoader />}

				<FormSuccess message={success} />

				<FormError message={error} />
			</div>
		</CardWrapper>
	);
}

export default NewVerificationForm;
