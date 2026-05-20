/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['source.unsplash.com', 'lh3.googleusercontent.com'],
    },
};

export default nextConfig;
