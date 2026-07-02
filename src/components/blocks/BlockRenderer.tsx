import type { BlockData } from "@/lib/directus/types";
import type { Locale } from "@/lib/i18n/config";
import Hero from "./Hero/Hero";
import Cards from "./Cards/Cards";
import Stages from "./Stages/Stages";
import Reviews from "./Reviews/Reviews";
import RichText from "./RichText/RichText";
import FounderProfile from "./FounderProfile/FounderProfile";
import FeatureList from "./FeatureList/FeatureList";
import Contact from "./Contact/Contact";

/**
 * Renders a page's blocks in order. Adding a block type = a new case here + a
 * component (Open/Closed): existing blocks are untouched.
 */
export default function BlockRenderer({ blocks, locale }: { blocks: BlockData[]; locale: Locale }) {
	return (
		<>
			{blocks.map((block, i) => {
				switch (block.collection) {
					case "block_hero":
						return <Hero key={i} data={block.data} locale={locale} />;
					case "block_cards":
						return <Cards key={i} data={block.data} locale={locale} />;
					case "block_stages":
						return <Stages key={i} data={block.data} />;
					case "block_reviews":
						return <Reviews key={i} data={block.data} locale={locale} />;
					case "block_richtext":
						return <RichText key={i} data={block.data} />;
					case "block_founder_profile":
						return <FounderProfile key={i} data={block.data} />;
					case "block_feature_list":
						return <FeatureList key={i} data={block.data} />;
					case "block_contact":
						return <Contact key={i} data={block.data} locale={locale} />;
					default:
						return null;
				}
			})}
		</>
	);
}
