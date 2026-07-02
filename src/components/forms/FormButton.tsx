"use client";
import { useModal } from "@/components/modal/ModalProvider";
import DynamicForm, { type FormUiStrings } from "./DynamicForm";
import type { FormData as FormDef } from "@/lib/directus/types";

/** A CTA button that opens the given form in the app-wide modal. */
export default function FormButton({
	form,
	label,
	className = "hero-cta",
	ui,
}: {
	form: FormDef | null;
	label?: string;
	className?: string;
	ui: FormUiStrings;
}) {
	const { open } = useModal();
	if (!label) return null;

	return (
		<button
			type="button"
			className={className}
			onClick={() => form && open(<DynamicForm form={form} ui={ui} />)}
		>
			{label}
		</button>
	);
}
