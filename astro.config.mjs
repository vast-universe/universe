import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	site: "https://vast-universe.github.io/universe/",
	output: "server",
	integrations: [tailwind()],
});
