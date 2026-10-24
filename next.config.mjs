/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow next/image to optimize the mock image/video posters served by the
  // dummy backend. These are the only external hosts the app references.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // Tailwind v4 is processed by Turbopack's CSS loader (set up by
  // create-next-app for this Next version). Keep this rule — removing it
  // leaves the global stylesheet unprocessed.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
