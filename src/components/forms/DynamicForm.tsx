"use client";
import { useMemo, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import type { FormData as FormDef, FormField } from "@/lib/directus/types";

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

export default function DynamicForm({
	form,
	ui,
}: {
	form: FormDef;
	ui: FormUiStrings;
}) {
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
			<div className="contact-form">
				<div className="flex flex-col gap-20">
					<header className="contact-form-header">
						<h2>{ui.successTitle}</h2>
						<p>{form.success_message}</p>
					</header>
				</div>
			</div>
		);
	}
	if (status === "sending") {
		return (
			<div className="flex flex-col gap-20 py-4 text-center justify-around items-center">
				<h3>{ui.sending}</h3>
				<div className="loader" />
			</div>
		);
	}

	const isLast = step === steps.length - 1;

	return (
		<div className="contact-form">
			<form className="flex flex-col gap-4" onSubmit={submit}>
				{steps[step].map((f) => (
					<Field key={f.name} field={f} value={values[f.name]} set={set} toggleMulti={toggleMulti} />
				))}
				{status === "error" && <p className="text-red-600">{ui.errorText}</p>}
				<div className="flex gap-3 justify-between">
					{step > 0 && (
						<button type="button" className="form-button" onClick={() => setStep(step - 1)}>
							{ui.back}
						</button>
					)}
					{!isLast ? (
						<button type="button" className="form-button secondary-btn ml-auto" onClick={() => setStep(step + 1)}>
							{ui.next}
						</button>
					) : (
						<button type="submit" className="form-button secondary-btn ml-auto">
							{form.submit_label || "Submit"}
						</button>
					)}
				</div>
			</form>
		</div>
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
	const common = { name: field.name, required: field.required, placeholder: field.placeholder, "aria-label": field.label };
	switch (field.type) {
		case "textarea":
			return (
				<label className="input-container flex-1">
					<textarea {...common} value={(value as string) ?? ""} onChange={(e) => set(field.name, e.target.value)} />
					<span>{field.label}</span>
				</label>
			);
		case "select":
			return (
				<label className="input-container flex-1">
					<select name={field.name} required={field.required} value={(value as string) ?? ""} onChange={(e) => set(field.name, e.target.value)}>
						<option value="">{field.placeholder ?? field.label}</option>
						{field.choices?.map((c) => (
							<option key={c.value} value={c.value}>{c.label}</option>
						))}
					</select>
					<span>{field.label}</span>
				</label>
			);
		case "checkbox_group":
			return (
				<fieldset className="flex flex-col gap-2">
					{field.label && <legend className="font-medium mb-2">{field.label}</legend>}
					<div className="checkbox-grid">
						{field.choices?.map((c) => {
							const checked = Array.isArray(value) && value.includes(c.value);
							return (
								<div key={c.value} className="checkbox-item">
									<input type="checkbox" id={`${field.name}-${c.value}`} checked={checked} onChange={() => toggleMulti(field.name, c.value)} />
									<label htmlFor={`${field.name}-${c.value}`}>{c.label}</label>
								</div>
							);
						})}
					</div>
				</fieldset>
			);
		case "file":
			return (
				<label className="input-container flex-1">
					<input type="file" name={field.name} required={field.required} onChange={(e) => set(field.name, e.target.files?.[0] ?? null)} />
					<span>{field.label}{field.help_text ? ` (${field.help_text})` : ""}</span>
				</label>
			);
		default:
			return (
				<label className="input-container flex-1">
					<input type={field.type} {...common} value={(value as string) ?? ""} onChange={(e) => set(field.name, e.target.value)} />
					<span>{field.label}</span>
				</label>
			);
	}
}
