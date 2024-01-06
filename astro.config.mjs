import { defineConfig, squooshImageService } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	site: "https://www.universe-hub.cn/",
	trailingSlash: 'never',
	integrations: [tailwind()],
	image: {
		service: squooshImageService(),
	},
});
