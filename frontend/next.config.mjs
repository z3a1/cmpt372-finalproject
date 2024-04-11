/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        SERVER_URL: process.env.SERVER_URL,
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
        optimizePackageImports: [
            '@mantine/core',
            '@mantine/hooks'
        ],
    },
    trailingSlash: true,
    
};

export default nextConfig;