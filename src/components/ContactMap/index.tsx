import { KZ_PATHS, KZ_TRANSFORM, KZ_VIEWBOX } from "./kz-path";
import styles from "./ContactMap.module.css";

/**
 * Decorative dotted map of Kazakhstan: the silhouette clips a dot grid,
 * with a soft solid underlay. Colors come from design tokens via CSS.
 */
export default function ContactMap({ note, regions }: { note?: string; regions?: string }) {
	const chips = (regions ?? "").split("·").map((s) => s.trim()).filter(Boolean);

	return (
		<figure className={styles.map}>
			<svg viewBox={KZ_VIEWBOX} role="img" aria-label="Kazakhstan" className={styles.svg}>
				<defs>
					<pattern id="kz-dots" width="13" height="13" patternUnits="userSpaceOnUse">
						<circle cx="4" cy="4" r="2" fill="currentColor" />
					</pattern>
					<clipPath id="kz-clip">
						{KZ_PATHS.map((d, i) => (
							<path key={i} d={d} transform={KZ_TRANSFORM} />
						))}
					</clipPath>
				</defs>
				<g className={styles.land}>
					{KZ_PATHS.map((d, i) => (
						<path key={i} d={d} transform={KZ_TRANSFORM} />
					))}
				</g>
				<rect x="0" y="222" width="1024" height="580" fill="url(#kz-dots)" clipPath="url(#kz-clip)" className={styles.dots} />
			</svg>
			{(note || chips.length > 0) && (
				<figcaption className={styles.caption}>
					{note && <p className={styles.note}>{note}</p>}
					{chips.length > 0 && (
						<span className={styles.chips}>
							{chips.map((c) => (
								<span key={c} className={styles.chip}>{c}</span>
							))}
						</span>
					)}
				</figcaption>
			)}
		</figure>
	);
}
