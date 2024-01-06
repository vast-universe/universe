import { defineConfig, squooshImageService } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	base: './',
	site: "https://vast-universe.github.io/universe/",
	trailingSlash: 'never',
	integrations: [tailwind()],
	image: {
		service: squooshImageService(),
	},
});
