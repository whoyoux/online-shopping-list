import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<main>
			<section className="flex flex-col items-center gap-4 pt-20">
				<h1 className="text-4xl font-extrabold">Online Shopping List</h1>
				<p className="text-xl font-medium">
					Create and share yours shopping list with your friends and family
				</p>
				<Button size="lg">Create!</Button>
			</section>
		</main>
	);
}
