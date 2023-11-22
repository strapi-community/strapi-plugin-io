import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'Strapi Plugin IO',
	lastUpdated: true,
	description: 'A plugin for Socket IO integration with Strapi CMS.',
	themeConfig: {
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Examples', link: '/examples/index' },
		],

		sidebar: [
			{
				text: 'Guide',
				items: [{ text: 'Getting Started', link: '/guide/getting-started' }],
			},
			{
				text: 'API',
				items: [
					{ text: 'Plugin Configruation Options', link: '/api/plugin-config' },
					{ text: 'IO Class', link: '/api/io-class' },
				],
			},
			{
				text: 'Examples',
				items: [
					{ text: 'Events', link: '/examples/events' },
					{ text: 'Content Types', link: '/examples/content-types' },
					{ text: 'Hooks', link: '/examples/hooks' },
				],
			},
		],

		socialLinks: [{ icon: 'github', link: 'https://github.com/ComfortablyCoding/strapi-plugin-io' }],
	},
});
