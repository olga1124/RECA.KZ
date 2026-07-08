import { FeatureIcon } from "../icons";
import type { FeatureListBlock } from "@/lib/directus/types";
import styles from "./FeatureList.module.css";

export default function FeatureList({ data }: { data: FeatureListBlock }) {

	return (
		<section className={styles.section}>
			<div className={styles.container}>
				{data.heading && (
					<h2>
						{data.heading}
					</h2>
				)}
				<div className={styles.content}>
					{data.items.map((item, i) => (
						<div key={i} className={styles.item}>
							<div className={styles.iconLabel}>
								<FeatureIcon name={item.icon} />
								<h3 className={styles.title}>{item.title}</h3>
							</div>
							{item.text && <p>{item.text}</p>}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
