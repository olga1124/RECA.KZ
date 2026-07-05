"use client";
import Image, { type ImageProps } from "next/image";
import loader from "@/lib/directus/imageLoader";

/**
 * next/image bound to the Directus /api/assets resize proxy. A thin client
 * wrapper so Server Components can render an optimized Directus image without
 * passing the loader function across the RSC boundary.
 */
export default function DirectusImage(props: Omit<ImageProps, "loader">) {
	return <Image loader={loader} {...props} />;
}
