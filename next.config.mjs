/** @type {import('next').NextConfig} */
const nextConfig = {
	// Lean, self-contained server bundle for Docker (node .next/standalone/server.js).
	output: "standalone",
	// Assets are proxied through /api/assets, so no external image hosts needed.
	reactStrictMode: true,
};

export default nextConfig;
