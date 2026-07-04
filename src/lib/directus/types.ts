/**
 * Flattened content types the components consume. Query functions collapse
 * Directus `translations: [{...}]` arrays (filtered to one locale) into plain
 * fields, so components receive ready-to-render objects — not raw i18n shapes.
 */

export type BlockType =
	| "block_hero"
	| "block_cards"
	| "block_stages"
	| "block_reviews"
	| "block_richtext"
	| "block_founder_profile"
	| "block_feature_list"
	| "block_contact"
	| "block_cta"
	| "block_form";

export interface HeroBlock {
	title: string;
	suptitle?: string;
	descr?: string;
	secondary_text?: string;
	button_label?: string;
	formId?: string | null;
}

export interface Card {
	icon?: string;
	linkPermalink?: string | null;
	formId?: string | null;
	title: string;
	text?: string;
	text_under?: string;
	button_label?: string;
}
export interface CardsBlock {
	heading?: string;
	cards: Card[];
}

export interface StageItem {
	icon?: string;
	title: string;
	text?: string;
}
export interface StagesBlock {
	heading?: string;
	items: StageItem[];
}

export interface ReviewsBlock {
	heading?: string;
	limit: number;
}

export interface RichTextBlock {
	heading?: string;
	content: string;
}

export interface Principle {
	title: string;
	points?: string;
}
export interface FounderProfileBlock {
	photoId?: string | null;
	eyebrow_title?: string;
	name?: string;
	intro_content?: string;
	principles_heading?: string;
	principles: Principle[];
}

export interface Feature {
	icon?: string;
	title: string;
	text?: string;
}
export interface FeatureListBlock {
	heading?: string;
	items: Feature[];
}

export interface ContactBlock {
	heading?: string;
	show_map: boolean;
	formId?: string | null;
}

export interface CtaBlock {
	eyebrow?: string;
	heading?: string;
	subheading?: string;
	button_label?: string;
	formId?: string | null;
}

export interface FormBlock {
	heading?: string;
	subheading?: string;
	formId?: string | null;
}

export type BlockData =
	| { collection: "block_hero"; data: HeroBlock }
	| { collection: "block_cards"; data: CardsBlock }
	| { collection: "block_stages"; data: StagesBlock }
	| { collection: "block_reviews"; data: ReviewsBlock }
	| { collection: "block_richtext"; data: RichTextBlock }
	| { collection: "block_founder_profile"; data: FounderProfileBlock }
	| { collection: "block_feature_list"; data: FeatureListBlock }
	| { collection: "block_contact"; data: ContactBlock }
	| { collection: "block_cta"; data: CtaBlock }
	| { collection: "block_form"; data: FormBlock };

export interface PageSeo {
	title?: string;
	meta_description?: string;
	ogImageId?: string | null;
	no_index?: boolean;
}

export interface PageData {
	id: string;
	permalink: string;
	title: string;
	seo?: PageSeo;
	blocks: BlockData[];
}

export interface Review {
	company: string;
	director: string;
	full_text: string;
	rating: number;
}

export interface NavItem {
	title: string;
	link_type: "page" | "anchor" | "external";
	permalink?: string | null;
	anchor?: string | null;
	external_url?: string | null;
	open_in_new_tab?: boolean;
}

export interface FooterSection {
	title: string;
	links: NavItem[];
}

export interface SocialLink {
	platform: string;
	url: string;
}
export interface SiteSettings {
	site_name?: string;
	footer_text?: string;
	logoId?: string | null;
	logoDarkId?: string | null;
	email?: string;
	phone?: string;
	address?: string;
	social_links?: SocialLink[];
}

export interface FormField {
	name: string;
	type: string;
	required: boolean;
	width: "full" | "half";
	label?: string;
	placeholder?: string;
	help_text?: string;
	choices?: { label: string; value: string }[];
}
export interface FormData {
	id: string;
	target_collection: "leads" | "applicants";
	title?: string;
	submit_label?: string;
	success_message?: string;
	fields: FormField[];
}
