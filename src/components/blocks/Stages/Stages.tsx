import Image from "next/image";
import { stageIcon } from "../icons";
import type { StagesBlock } from "@/lib/directus/types";
import styles from "./Stages.module.css";

export default function Stages({ data }: { data: StagesBlock }) {
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				{data.heading && <h2 className={styles.heading}>{data.heading}</h2>}
				<div className={styles.content}>
					{data.items.map((item, i) => (
						<div key={i} className={styles.card}>
							<div className={styles.icon}>
								<Image src={stageIcon(item.icon)} width={24} height={24} alt="" />
							</div>
							<div className={styles.text}>
								<h3>{item.title}</h3>
								{item.text && <p>{item.text}</p>}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
