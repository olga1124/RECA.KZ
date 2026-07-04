# Runtime-only image. The app is already built in CI (Next.js standalone output);
# this image just runs it — no npm install, no next build on the server.
#
# node:20-slim (glibc) matches the GitHub Actions runner that produced the
# traced node_modules, so any native modules stay ABI-compatible.
FROM node:20-slim
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# `context` is the CI-assembled bundle: standalone app + .next/static + public.
COPY . ./

EXPOSE 3000
CMD ["node", "server.js"]
