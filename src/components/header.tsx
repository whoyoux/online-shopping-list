import { signOut } from "@/actions/auth";
import { validateRequest } from "@/lib/auth";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Header = async () => {
	const { user } = await validateRequest();
	return (
		<header className="w-full py-4 px-2 md:px-8 flex justify-between items-center bg-white border-b">
			<Link href="/">
				<h1 className="font-medium">OSL</h1>
			</Link>
			{user ? (
				<div className="flex gap-2">
					<Button>Dashboard</Button>
					<SignOutButton />
				</div>
			) : (
				<div className="flex gap-2">
					<Link href="/sign-in">
						<Button variant="secondary">Log in</Button>
					</Link>
					<Link href="/sign-up">
						<Button>Sign up</Button>
					</Link>
				</div>
			)}
		</header>
	);
};

const SignOutButton = () => {
	return (
		<form action={signOut}>
			<Button variant="secondary" type="submit">
				Sign Out
			</Button>
		</form>
	);
};

export default Header;
