/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			transitionProperty: {
				'colors': 'color', // 将 'colors' 映射到 'color'，表示颜色过渡
			},
			transitionDuration: {
				'500': '500ms', // 配置颜色过渡的持续时间
			},
			transitionTimingFunction: {
				'ease-in-out': 'ease-in-out', // 配置颜色过渡的缓动函数
			},
		},
	},
}
