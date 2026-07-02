import { FaRegClock, FaRegHandRock, FaRegAddressBook } from "react-icons/fa";
import type { IconType } from "react-icons";

/** Stage icons live as SVGs in /public (e.g. "loop" → /loop.svg). */
export const stageIcon = (key?: string) => (key ? `/${key}.svg` : "/loop.svg");

/** Card icons live in /public/icons (e.g. "human-resources" → /icons/human-resources.svg). */
export const cardIcon = (key?: string) => (key ? `/icons/${key}.svg` : "");

/** Feature icons are react-icons, chosen by a stable key. */
const FEATURE_ICONS: Record<string, IconType> = {
	individual: FaRegClock,
	quality: FaRegHandRock,
	confidential: FaRegAddressBook,
};

export function FeatureIcon({ name, size = 30 }: { name?: string; size?: number }) {
	const Icon = (name && FEATURE_ICONS[name]) || FaRegClock;
	return <Icon size={size} />;
}
