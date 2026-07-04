"use client";
import { useMemo, useState } from "react";
import type { FormData as FormDef, FormField } from "@/lib/directus/types";
import styles from "./DynamicForm.module.css";

export interface FormUiStrings {
	sending: string;
	successTitle: string;
	errorTitle: string;
	errorText: string;
	next: string;
	back: string;
}

type Values = Record<string, string | string[] | File | null>;

/** Split fields into wizard steps on `divider`. */
function toSteps(fields: FormField[]): FormField[][] {
	const steps: FormField[][] = [[]];
	for (const f of fields) {
		if (f.type === "divider") steps.push([]);
		else steps[steps.length - 1].push(f);
	}
	return steps.filter((s) => s.length > 0);
}

export default function DynamicForm({ form, ui }: { form: FormDef; ui: FormUiStrings }) {
	const steps = useMemo(() => toSteps(form.fields), [form.fields]);
	const [step, setStep] = useState(0);
	const [values, setValues] = useState<Values>({});
	const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

	const set = (name: string, value: Values[string]) => setValues((v) => ({ ...v, [name]: value }));

	const toggleMulti = (name: string, option: string) => {
		const cur = Array.isArray(values[name]) ? (values[name] as string[]) : [];
		set(name, cur.includes(option) ? cur.filter((x) => x !== option) : [...cur, option]);
	};

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setStatus("sending");
		const payload: Record<string, unknown> = {};
		const fd = new FormData();
		for (const f of form.fields) {
			if (f.type === "divider" || f.type === "hidden") continue;
			const v = values[f.name];
			if (f.type === "file" && v instanceof File) fd.append(`file_${f.name}`, v, v.name);
			else if (v != null) payload[f.name] = v;
		}
		fd.append("formId", form.id);
		fd.append("payload", JSON.stringify(payload));
		try {
			const res = await fetch("/api/forms/submit", { method: "POST", body: fd });
			if (!res.ok) throw new Error(await res.text());
			setStatus("success");
		} catch {
			setStatus("error");
		}
	}

	if (status === "success") {
		return (
			<div className={styles.form}>
				<div className={styles.header}>
					<h2>{ui.successTitle}</h2>
					<p className={styles.subtitle}>{form.success_message}</p>
				</div>
			</div>
		);
	}
	if (status === "sending") {
		return (
			<div className={styles.state}>
				<div className={styles.loader} />
				<h3>{ui.sending}</h3>
			</div>
		);
	}

	const isLast = step === steps.length - 1;
	const multiStep = steps.length > 1;

	return (
		<form className={styles.form} onSubmit={submit}>
			{(form.title || multiStep) && (
				<div className={styles.header}>
					{form.title && <h2 className={styles.title}>{form.title}</h2>}
					{multiStep && (
						<div className={styles.steps} aria-hidden>
							{steps.map((_, i) => (
								<span key={i} className={`${styles.stepDot} ${i <= step ? styles.stepDotActive : ""}`} />
							))}
						</div>
					)}
				</div>
			)}

			<div className={styles.fields}>
				{steps[step].map((f) => (
					<Field key={f.name} field={f} value={values[f.name]} set={set} toggleMulti={toggleMulti} />
				))}
			</div>

			{status === "error" && <p className={styles.error}>{ui.errorText}</p>}

			<div className={styles.actions}>
				{step > 0 && (
					<button type="button" className={styles.btnGhost} onClick={() => setStep(step - 1)}>
						{ui.back}
					</button>
				)}
				{!isLast ? (
					<button type="button" className={`${styles.btnPrimary} ${styles.pushRight}`} onClick={() => setStep(step + 1)}>
						{ui.next}
					</button>
				) : (
					<button type="submit" className={`${styles.btnPrimary} ${styles.pushRight}`}>
						{form.submit_label || "Submit"}
					</button>
				)}
			</div>
		</form>
	);
}

function Field({
	field,
	value,
	set,
	toggleMulti,
}: {
	field: FormField;
	value: Values[string];
	set: (name: string, value: Values[string]) => void;
	toggleMulti: (name: string, option: string) => void;
}) {
	const half = field.width === "half";
	const wrapCls = `${styles.field} ${half ? styles.half : ""}`;
	const common = { name: field.name, required: field.required, placeholder: field.placeholder ?? field.label, "aria-label": field.label };

	const Label = () =>
		field.label ? (
			<span className={styles.label}>
				{field.label}
				{field.required && <span className={styles.req}>*</span>}
			</span>
		) : null;

	switch (field.type) {
		case "textarea":
			return (
				<label className={wrapCls}>
					<Label />
					<textarea className={styles.control} {...common} value={(value as string) ?? ""} onChange={(e) => set(field.name, e.target.value)} />
				</label>
			);
		case "select":
			return (
				<label className={wrapCls}>
					<Label />
					<select className={styles.control} name={field.name} required={field.required} value={(value as string) ?? ""} onChange={(e) => set(field.name, e.target.value)}>
						<option value="">{field.placeholder ?? field.label}</option>
						{field.choices?.map((c) => (
							<option key={c.value} value={c.value}>{c.label}</option>
						))}
					</select>
				</label>
			);
		case "radio":
			return (
				<fieldset className={styles.field}>
					{field.label && <legend className={styles.legend}>{field.label}</legend>}
					<div className={styles.chips}>
						{field.choices?.map((c) => (
							<label key={c.value} className={styles.chip}>
								<input type="radio" name={field.name} required={field.required} checked={value === c.value} onChange={() => set(field.name, c.value)} />
								{c.label}
							</label>
						))}
					</div>
				</fieldset>
			);
		case "checkbox_group":
			return (
				<fieldset className={styles.field}>
					{field.label && <legend className={styles.legend}>{field.label}</legend>}
					<div className={styles.chips}>
						{field.choices?.map((c) => {
							const checked = Array.isArray(value) && value.includes(c.value);
							return (
								<label key={c.value} className={styles.chip}>
									<input type="checkbox" checked={checked} onChange={() => toggleMulti(field.name, c.value)} />
									{c.label}
								</label>
							);
						})}
					</div>
				</fieldset>
			);
		case "file":
			return (
				<label className={wrapCls}>
					<Label />
					<span className={styles.file}>
						<input type="file" name={field.name} required={field.required} onChange={(e) => set(field.name, e.target.files?.[0] ?? null)} />
						{(value instanceof File ? value.name : field.help_text) ?? field.placeholder ?? "…"}
					</span>
				</label>
			);
		default:
			return (
				<label className={wrapCls}>
					<Label />
					<input className={styles.control} type={field.type} {...common} value={(value as string) ?? ""} onChange={(e) => set(field.name, e.target.value)} />
				</label>
			);
	}
}
