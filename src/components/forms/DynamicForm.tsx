"use client";
import { useMemo, useRef, useState } from "react";
import { Paperclip, Upload } from "lucide-react";
import PhoneInput, { isValidPhoneNumber, type Value as PhoneValue } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import ruLabels from "react-phone-number-input/locale/ru.json";
import enLabels from "react-phone-number-input/locale/en.json";
import type { FormData as FormDef, FormField } from "@/lib/directus/types";
import type { Locale } from "@/lib/i18n/config";
import styles from "./DynamicForm.module.css";

export interface FormUiStrings {
	locale: Locale;
	sending: string;
	successTitle: string;
	errorTitle: string;
	errorText: string;
	phoneInvalid: string;
	next: string;
	back: string;
}

// Kazakhstan first, then a divider, then every other country (sorted by the
// localized name). No Kazakh country-name pack in the library — KZ falls back
// to the Russian labels.
const COUNTRY_ORDER: ("KZ" | "|" | "...")[] = ["KZ", "|", "..."];
const countryLabels = (locale: Locale) => (locale === "en" ? enLabels : ruLabels);

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
	const [phoneErrors, setPhoneErrors] = useState<string[]>([]);
	const [honeypot, setHoneypot] = useState("");
	// When the form was first rendered — used server-side as a bot time-trap.
	const mountedAt = useRef(Date.now());

	const set = (name: string, value: Values[string]) => setValues((v) => ({ ...v, [name]: value }));

	const toggleMulti = (name: string, option: string) => {
		const cur = Array.isArray(values[name]) ? (values[name] as string[]) : [];
		set(name, cur.includes(option) ? cur.filter((x) => x !== option) : [...cur, option]);
	};

	async function submit(e: React.FormEvent) {
		e.preventDefault();

		// libphonenumber check: PhoneInput's inner input always shows the dial
		// code, so HTML5 `required` can't catch an empty or invalid number.
		const badPhones = form.fields
			.filter((f) => f.type === "tel")
			.filter((f) => {
				const v = typeof values[f.name] === "string" ? (values[f.name] as string) : "";
				return f.required ? !isValidPhoneNumber(v || "") : Boolean(v) && !isValidPhoneNumber(v);
			})
			.map((f) => f.name);
		if (badPhones.length > 0) {
			setPhoneErrors(badPhones);
			return;
		}

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
		fd.append("_hp", honeypot);
		fd.append("_ts", String(Date.now() - mountedAt.current));
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
			{/* Honeypot: off-screen, hidden from AT and tab order; bots fill it. */}
			<input
				type="text"
				name="_hp"
				tabIndex={-1}
				autoComplete="off"
				aria-hidden="true"
				value={honeypot}
				onChange={(e) => setHoneypot(e.target.value)}
				style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
			/>
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
					<Field
						key={f.name}
						field={f}
						value={values[f.name]}
						set={set}
						toggleMulti={toggleMulti}
						ui={ui}
						phoneInvalid={phoneErrors.includes(f.name)}
						onPhoneEdit={() => phoneErrors.length > 0 && setPhoneErrors((p) => p.filter((n) => n !== f.name))}
					/>
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
	ui,
	phoneInvalid,
	onPhoneEdit,
}: {
	field: FormField;
	value: Values[string];
	set: (name: string, value: Values[string]) => void;
	toggleMulti: (name: string, option: string) => void;
	ui: FormUiStrings;
	phoneInvalid: boolean;
	onPhoneEdit: () => void;
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
		case "tel":
			return (
				<label className={wrapCls}>
					<Label />
					<PhoneInput
						international
						countryCallingCodeEditable={false}
						defaultCountry="KZ"
						countryOptionsOrder={COUNTRY_ORDER}
						flags={flags}
						labels={countryLabels(ui.locale)}
						className={`${styles.phone} ${phoneInvalid ? styles.phoneBad : ""}`}
						value={((value as string) || undefined) as PhoneValue | undefined}
						onChange={(v) => {
							set(field.name, v ?? "");
							onPhoneEdit();
						}}
						numberInputProps={{ className: styles.control, "aria-label": field.label, "aria-invalid": phoneInvalid }}
					/>
					{phoneInvalid && <span className={styles.fieldError}>{ui.phoneInvalid}</span>}
				</label>
			);
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
					<span className={`${styles.file} ${value instanceof File ? styles.fileFilled : ""}`}>
						<input type="file" name={field.name} required={field.required} onChange={(e) => set(field.name, e.target.files?.[0] ?? null)} />
						<span className={styles.fileIcon}>{value instanceof File ? <Paperclip size={18} /> : <Upload size={18} />}</span>
						<span className={styles.fileText}>
							{(value instanceof File ? value.name : field.help_text) ?? field.placeholder ?? "…"}
						</span>
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
