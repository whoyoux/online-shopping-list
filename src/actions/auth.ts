"use server";

import { SignInSchema, SignUpSchema } from "@/types";
import { z } from "zod";

import { db } from "@/db";
import { users } from "@/db/schema";
import { lucia, validateRequest } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { Lucia, generateId } from "lucia";
import { cookies } from "next/headers";
import { Argon2id } from "oslo/password";

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
	const parsed = SignUpSchema.safeParse(values);
	if (!parsed.success) {
		throw new Error("Invalid form values");
	}

	const hashedPassword = await new Argon2id().hash(values.password);
	const userId = generateId(15);

	try {
		await db
			.insert(users)
			.values({
				id: userId,
				username: values.username,
				hashedPassword,
			})
			.returning({
				id: users.id,
				username: users.username,
			});

		const session = await lucia.createSession(userId, {
			expiresIn: 60 * 60 * 24 * 30,
		});

		const sessionCookie = lucia.createSessionCookie(session.id);

		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);

		return {
			success: true,
			data: {
				userId,
			},
		};
	} catch (err) {
		throw new Error(
			"Some error occurred while signing up. Please try again later.",
		);
	}
};

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
	const parsed = SignInSchema.safeParse(values);
	if (!parsed.success) {
		throw new Error("Invalid form values");
	}

	const existingUser = await db.query.users.findFirst({
		where: (table) => eq(table.username, values.username),
	});

	if (!existingUser) {
		throw new Error("User does not exist");
	}

	const isValidPassword = await new Argon2id().verify(
		existingUser.hashedPassword,
		values.password,
	);

	if (!isValidPassword) {
		throw new Error("Invalid username or password");
	}

	const session = await lucia.createSession(existingUser.id, {
		expiresIn: 60 * 60 * 24 * 30,
	});

	const sessionCookie = lucia.createSessionCookie(session.id);

	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);

	return {
		success: true,
		data: {
			userId: existingUser.id,
		},
	};
};

export const signOut = async () => {
	try {
		const { session } = await validateRequest();

		if (!session) {
			throw new Error("No session found");
		}

		await lucia.invalidateSession(session.id);

		const sessionCookie = lucia.createBlankSessionCookie();

		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
	} catch (err) {
		throw new Error(
			"Some error occurred while signing out. Please try again later.",
		);
	}
};
