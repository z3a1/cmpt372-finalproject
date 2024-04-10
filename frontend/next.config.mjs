/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        SERVER_URL: process.env.SERVER_URL,
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
    },
    output: 'export',
    experimental: {
        missingSuspenseWithCSRBailout: false,
        optimizePackageImports: [
            '@mantine/core',
            '@mantine/hooks'
        ],
    },
    trailingSlash: true,
    
    async headers() {
        return [
          {
            // Routes this applies to
            source: "/api/(.*)",
            // Headers
            headers: [
              // Allow for specific domains to have access or * for all
              {
                key: "Access-Control-Allow-Origin",
                value: "*",
                // DOES NOT WORK
                // value: process.env.ALLOWED_ORIGIN,
              },
              // Allows for specific methods accepted
              {
                key: "Access-Control-Allow-Methods",
                value: "GET, POST, PUT, DELETE, OPTIONS",
              },
              // Allows for specific headers accepted (These are a few standard ones)
              {
                key: "Access-Control-Allow-Headers",
                value: "Content-Type, Authorization",
              },
            ],
          },
        ];
      },
};

export default nextConfig;