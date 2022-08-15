/* eslint-disable @typescript-eslint/explicit-function-return-type */
const {join} = require('path');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	presets: [
		require('@yearn-finance/web-lib/config/tailwind.config.cjs')
	],
	content: [
		join(__dirname, 'pages', '**', '*.{js,jsx,ts,tsx}'),
		join(__dirname, 'components', 'icons', '**', '*.{js,jsx,ts,tsx}'),
		join(__dirname, 'components', '**', '*.{js,jsx,ts,tsx}'),
		join(__dirname, 'node_modules', '@yearn-finance', 'web-lib', 'dist', 'layouts', '**', '*.js'),
		join(__dirname, 'node_modules', '@yearn-finance', 'web-lib', 'dist', 'components', '**', '*.js'),
		join(__dirname, 'node_modules', '@yearn-finance', 'web-lib', 'dist', 'contexts', '**', '*.js'),
		join(__dirname, 'node_modules', '@yearn-finance', 'web-lib', 'dist', 'icons', '**', '*.js'),
		join(__dirname, 'node_modules', '@yearn-finance', 'web-lib', 'dist', 'utils', '**', '*.js')
	],
	theme: {
		fontFamily: {
			roboto: ['Roboto Slab', ...defaultTheme.fontFamily.sans],
			'roboto-base': ['Roboto', ...defaultTheme.fontFamily.sans],
			mono: ['Roboto Mono', ...defaultTheme.fontFamily.mono]
		},
		extend: {
			fontSize: {
				'3xl': ['32px', '40px'],
				'6xl': ['56px', '72px']
			},
			colors: {
				'black': '#000000',
				'black-1': '#131313',
				'black-2': '#2B2B2B',
				'grey-1': '#4F4F4F',
				'grey-2': '#828282',
				'grey-3': '#E0E0E0',
				'grey-4': '#F0F0F0',
				'grey-5': '#F4F4F4',
				'white': '#FFFFFF'
			}
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/line-clamp')
	]
};