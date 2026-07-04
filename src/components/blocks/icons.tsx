import { Clock, Award, Lock, type LucideIcon } from "lucide-react";

/** Stage icons live as SVGs in /public (e.g. "loop" → /loop.svg). */
export const stageIcon = (key?: string) => (key ? `/${key}.svg` : "/loop.svg");

/** Card icons live in /public/icons (e.g. "human-resources" → /icons/human-resources.svg). */
export const cardIcon = (key?: string) => (key ? `/icons/${key}.svg` : "");

/** Feature icons are lucide-react icons, chosen by a stable key. */
const FEATURE_ICONS: Record<string, LucideIcon> = {
	individual: Clock,
	quality: Award,
	confidential: Lock,
};

export function FeatureIcon({ name, size = 22 }: { name?: string; size?: number }) {
	const Icon = (name && FEATURE_ICONS[name]) || Clock;
	return <Icon size={size} strokeWidth={1.75} />;
}
