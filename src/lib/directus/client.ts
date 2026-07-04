import "server-only";

/**
 * Server-side Directus access. All content reads and submission writes go
 * through here with the limited "Website Service" static token — the browser
 * never talks to Directus directly.
 *
 * Env is read LAZILY (at call time), not at module load: `next build` collects
 * page data with no runtime env set, so a top-level throw would fail the build.
 * At runtime the container has the vars (injected via env_file).
 *
 * DIRECTUS_INTERNAL_URL is the in-network docker URL in production
 * (http://directus:8055) and the public URL for local development.
 */
function required(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`${name} must be set`);
	return value;
}

export const directusUrl = () => required("DIRECTUS_INTERNAL_URL");
export const directusToken = () => required("DIRECTUS_SERVICE_TOKEN");

type GqlResult<T> = { data?: T; errors?: { message: string }[] };

/** Run a GraphQL query against Directus. Not cached — maximum SSR. */
export async function directusQuery<T>(
	query: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	const res = await fetch(`${directusUrl()}/graphql`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${directusToken()}`,
		},
		body: JSON.stringify({ query, variables }),
		cache: "no-store",
	});
	if (!res.ok) {
		throw new Error(`Directus GraphQL ${res.status}: ${await res.text()}`);
	}
	const json = (await res.json()) as GqlResult<T>;
	if (json.errors?.length) {
		throw new Error(`Directus GraphQL errors: ${json.errors.map((e) => e.message).join("; ")}`);
	}
	return json.data as T;
}
