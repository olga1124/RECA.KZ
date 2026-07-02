import type { RichTextBlock } from "@/lib/directus/types";
import styles from "./RichText.module.css";

export default function RichText({ data }: { data: RichTextBlock }) {
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<div className={styles.content}>
					{data.heading && <h2>{data.heading}</h2>}
					<div className={styles.body} dangerouslySetInnerHTML={{ __html: data.content }} />
				</div>
			</div>
		</section>
	);
}
