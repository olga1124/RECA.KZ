/**
 * Creates the limited "Website Service" role + policy + static token used by
 * the Next.js server at runtime. Idempotent.
 *
 *   node --env-file=.env.local scripts/directus/role.mjs
 *
 * Grants: read on all content collections + directus_files;
 *         create on leads, applicants, directus_files (form submissions/uploads).
 * Does NOT grant admin/app access, delete, or read on submissions.
 */
import { randomBytes } from "node:crypto";
import { api } from "./lib.mjs";

const POLICY_NAME = "Website Service";
const ROLE_NAME = "Website Service";
const USER_EMAIL = "service@reca.kz";
const CREATE_COLLECTIONS = ["leads", "applicants", "directus_files"];

async function findByName(path, name) {
	const rows = await api("GET", `${path}?filter[name][_eq]=${encodeURIComponent(name)}&limit=1`);
	return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function main() {
	// Content collections to grant read on (all user collections except submissions)
	const collections = await api("GET", "/collections?limit=-1");
	const contentReadable = collections
		.map((c) => c.collection)
		.filter((c) => !c.startsWith("directus_"))
		.filter((c) => !["leads", "applicants"].includes(c));
	contentReadable.push("directus_files");

	// 1. Policy
	let policy = await findByName("/policies", POLICY_NAME);
	if (!policy) {
		policy = await api("POST", "/policies", {
			name: POLICY_NAME,
			icon: "smart_toy",
			description: "Read content, create leads/applicants/files. Used by the website server.",
			admin_access: false,
			app_access: false,
			enforce_tfa: false,
		});
		console.log("+ policy", policy.id);
	} else {
		console.log("= policy (exists)", policy.id);
	}

	// 2. Permissions — wipe this policy's existing perms then recreate (keeps it declarative)
	const existingPerms = await api("GET", `/permissions?filter[policy][_eq]=${policy.id}&limit=-1`);
	for (const p of existingPerms || []) await api("DELETE", `/permissions/${p.id}`);

	for (const collection of contentReadable) {
		await api("POST", "/permissions", {
			policy: policy.id, collection, action: "read",
			fields: ["*"], permissions: {}, validation: {},
		});
	}
	for (const collection of CREATE_COLLECTIONS) {
		await api("POST", "/permissions", {
			policy: policy.id, collection, action: "create",
			fields: ["*"], permissions: {}, validation: {},
		});
	}
	console.log(`+ permissions: read×${contentReadable.length}, create×${CREATE_COLLECTIONS.length}`);

	// 3. Role
	let role = await findByName("/roles", ROLE_NAME);
	if (!role) {
		role = await api("POST", "/roles", { name: ROLE_NAME, icon: "smart_toy" });
		console.log("+ role", role.id);
	} else {
		console.log("= role (exists)", role.id);
	}

	// 4. Attach policy to role (via directus_access junction)
	const access = await api("GET", `/access?filter[role][_eq]=${role.id}&filter[policy][_eq]=${policy.id}&limit=1`);
	if (!access || access.length === 0) {
		await api("POST", "/access", { role: role.id, policy: policy.id });
		console.log("+ access role→policy");
	} else {
		console.log("= access role→policy (exists)");
	}

	// 5. Service user. Keep the existing token on re-runs (only permissions
	//    change); a brand-new user gets a fresh static token.
	const users = await api("GET", `/users?filter[email][_eq]=${encodeURIComponent(USER_EMAIL)}&limit=1`);
	let user = Array.isArray(users) && users.length ? users[0] : null;
	if (!user) {
		const token = randomBytes(24).toString("base64url");
		user = await api("POST", "/users", {
			first_name: "Website", last_name: "Service",
			email: USER_EMAIL, role: role.id, token, status: "active",
		});
		console.log("+ user", user.id);
		console.log("\n─────────────────────────────────────────────");
		console.log("DIRECTUS_SERVICE_TOKEN=" + token);
		console.log("─────────────────────────────────────────────");
		console.log("Put this in the frontend .env (server-side only).");
	} else {
		await api("PATCH", `/users/${user.id}`, { role: role.id, status: "active" });
		console.log("= user (token unchanged, permissions refreshed)", user.id);
	}
}

main().catch((err) => {
	console.error("\nFAILED:", err.message);
	process.exit(1);
});
