import "server-only";

/**
 * Server-side Directus access. All content reads and submission writes go
 * through here with the limited "Website Service" static token — the browser
 * never talks to Directus directly.
 *
 * DIRECTUS_INTERNAL_URL is the in-network docker URL in production
 * (http://directus:8055) and the public URL for local development.
 */
const DIRECTUS_URL = process.env.DIRECTUS_INTERNAL_URL;
const TOKEN = process.env.DIRECTUS_SERVICE_TOKEN;

if (!DIRECTUS_URL || !TOKEN) {
	throw new Error("DIRECTUS_INTERNAL_URL and DIRECTUS_SERVICE_TOKEN must be set");
}

type GqlResult<T> = { data?: T; errors?: { message: string }[] };

/** Run a GraphQL query against Directus. Not cached — maximum SSR. */
export async function directusQuery<T>(
	query: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	const res = await fetch(`${DIRECTUS_URL}/graphql`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TOKEN}`,
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

export { DIRECTUS_URL, TOKEN };
