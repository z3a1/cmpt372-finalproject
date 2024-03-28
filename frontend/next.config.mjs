/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        SERVER_URL: process.env.SERVER_URL
    },
     output: 'export',
    //  experimental: {
    //     missingSuspenseWithCSRBailout: false,
    // },
    
};

export default nextConfig;
