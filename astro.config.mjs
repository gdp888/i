// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://itr-montazh.ru',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
