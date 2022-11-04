/**
 * @type {import('next').NextConfig}
 * */
module.exports = (phase, { defaultConfig }) => {
  return {
    ...defaultConfig,
    reactStrictMode: true,
    experimental: { appDir: true },
  };
};
