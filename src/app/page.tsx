import { createList } from "@/actions/list";
import { Button } from "@/components/ui/button";
import { db } from "@/db";

export default async function Home() {
	return (
		<main>
			<section className="flex flex-col items-center gap-4 pt-20">
				<h1 className="text-4xl font-extrabold">Online Shopping List</h1>
				<p className="text-xl font-medium">
					Create and share yours shopping list with your friends and family
				</p>
				<form action={createList}>
					<Button size="lg" type="submit">
						Create!
					</Button>
				</form>
			</section>
		</main>
	);
}
