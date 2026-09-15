import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  agentRules: false, // the repo-root CLAUDE.md is the agent guide; no generated AGENTS.md here
  serverExternalPackages: ["@electric-sql/pglite"],
  images: { remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }] },
};

export default nextConfig;
