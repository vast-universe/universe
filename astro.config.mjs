import { defineConfig, squooshImageService } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
	//   site: "https://www.universe-hub.cn/",
	trailingSlash: 'never',
	integrations: [tailwind(), preact(), mdx()],
	image: {
		service: squooshImageService()
	}
});