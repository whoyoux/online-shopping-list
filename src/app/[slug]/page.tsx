import { db } from "@/db";
import { notFound } from "next/navigation";

const ShoppingListPage = async ({ params }: { params: { slug: string } }) => {
	if (params.slug.length !== 36) return notFound();
	const list = await db.query.shoppingLists.findFirst({
		where: (shoppingLists, { eq }) => eq(shoppingLists.id, params.slug),
		with: {
			items: true,
		},
	});

	if (!list) return notFound();

	return (
		<div>
			{list.id} Please save this link. Otherwise you will lose this page.
		</div>
	);
};

export default ShoppingListPage;
