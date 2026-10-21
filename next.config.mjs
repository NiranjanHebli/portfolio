/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', 'gsap', 'postprocessing'],
  reactStrictMode: true,
  webpack: (config) => {
    // Allow importing raw shaders if needed alongside .glsl.ts modules
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
