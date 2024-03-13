"use server";

import { db } from "@/db";
import { shoppingLists } from "@/db/schema";
import { redirect } from "next/navigation";

export const createList = async () => {
	const list = await db.insert(shoppingLists).values({}).returning();
	redirect(`/${list[0].id}`);
};
