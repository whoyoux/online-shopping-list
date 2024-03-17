import { relations } from "drizzle-orm";
import {
	boolean,
	pgTableCreator,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const pgTable = pgTableCreator((name) => `osl_${name}`);

export const users = pgTable("user", {
	id: text("id").primaryKey(),
	username: text("username").notNull().unique(),
	hashedPassword: text("hashed_password").notNull(),
});

export const sessions = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const shoppingLists = pgTable("shopping_list", {
	id: uuid("id").primaryKey().defaultRandom().unique(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const shoppingListItems = pgTable("shopping_list_item", {
	id: uuid("id").primaryKey().defaultRandom().unique(),
	listId: uuid("list_id")
		.references(() => shoppingLists.id)
		.notNull(),
	label: text("label").notNull(),
	isDone: boolean("is_done").notNull().default(false),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const shoppingListRelations = relations(shoppingLists, ({ many }) => ({
	items: many(shoppingListItems),
}));

export const shoppingListItemRelations = relations(
	shoppingListItems,
	({ one }) => ({
		list: one(shoppingLists, {
			fields: [shoppingListItems.listId],
			references: [shoppingLists.id],
		}),
	}),
);
