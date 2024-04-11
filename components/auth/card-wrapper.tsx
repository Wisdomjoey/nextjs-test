"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import BackButton from "./back-button";
import Header from "./header";
import Social from "./social";

interface CardWrapperProps {
	children: React.ReactNode;
	headerLabel: string;
	backBtnLabel: string;
	backBtnHref: string;
	showSocial?: boolean;
}

function CardWrapper({
	children,
	headerLabel,
	backBtnLabel,
	backBtnHref,
	showSocial,
}: CardWrapperProps) {
	return (
		<Card className="w-[400px] shadow-md">
			<CardHeader>
				<Header label={headerLabel} />
			</CardHeader>

			<CardContent>{children}</CardContent>

			{showSocial && (
				<CardFooter>
					<Social />
				</CardFooter>
			)}

			<CardFooter>
				<BackButton href={backBtnHref} label={backBtnLabel}></BackButton>
			</CardFooter>
		</Card>
	);
}

export default CardWrapper;
