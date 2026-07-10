/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      const extraIgnored = ['**/.git/**', '**/data/vault/**', '**/data/intake/**'];
      const current = config.watchOptions?.ignored;

      if (Array.isArray(current)) {
        config.watchOptions.ignored = [
          ...current.filter((item) => typeof item === 'string' && item.length > 0),
          ...extraIgnored,
        ];
      } else if (typeof current === 'string' && current.length > 0) {
        config.watchOptions.ignored = [current, ...extraIgnored];
      } else {
        config.watchOptions = {
          ...config.watchOptions,
          ignored: ['**/node_modules/**', ...extraIgnored],
        };
      }
    }

    return config;
  },
};

export default nextConfig;
