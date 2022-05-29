const Dotenv = require('dotenv-webpack');

module.exports = ({
	experimental: {
		concurrentFeatures: true
	},
	plugins: [new Dotenv()],
	images: {
		domains: [
			'rawcdn.githack.com'
		]
	},
	env: {
		/* 📰 - Keep3r *********************************************************
		** Stuff used for the SEO or some related elements, like the title, the
		** github url etc.
		**********************************************************************/
		WEBSITE_URI: 'https://keep3r.network/',
		WEBSITE_NAME: 'The Keep3r Network',
		WEBSITE_TITLE: 'The Keep3r Network',
		WEBSITE_DESCRIPTION: 'All the Jobs That’s Fit to Network.',
		PROJECT_GITHUB_URL: 'https://github.com/keep3r-network/',
		BACKEND_URI: 'https://api.keep3r.network',
		// BACKEND_URI: 'http://localhost:8080',

		/* 📰 - Keep3r *********************************************************
		** Some config used to control the behaviour of the web library. By
		** default, all of theses are set to false.
		** USE_WALLET: should we allow the user to connect a wallet via
		**             metamask or wallet connect?
		** USE_PRICES: should we fetch the prices for a list of tokens? If true
		**             the CG_IDS array should be populated with the tokens
		**             to fetch.
		** USE_PRICE_TRI_CRYPTO: should we fetch the special Tri Crypto token
		** 			   price? (require blockchain call)
		** USE_FEEDBACKS: should we enable the feedback button?
		**********************************************************************/
		USE_WALLET: true,
		USE_PRICES: true,
		USE_PRICE_TRI_CRYPTO: false,
		CG_IDS: ['ethereum', 'keep3rv1'],
		TOKENS: [
			['0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44', 18, 1],
			['0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44', 18, 1337]
		],
		RPC_URL: {1: process.env.RPC_URL_MAINNET},
		ALCHEMY_KEY: process.env.ALCHEMY_KEY,
		INFURA_KEY: process.env.INFURA_KEY,

		/* 📰 - Keep3r *********************************************************
		** Keep3r specific stuffs
		**********************************************************************/
		THE_KEEP3R: '0x0D5Dc686d0a2ABBfDaFDFb4D0533E886517d4E83',
		KEEP3R_V1_ADDR: '0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44',
		KEEP3R_V2_ADDR: '0xeb02addcfd8b773a5ffa6b9d1fe99c566f8c44cc',
		KP3R_TOKEN_ADDR: '0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44',
		WETH_TOKEN_ADDR: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		KLP_KP3R_WETH_ADDR: '0x3f6740b5898c5D3650ec6eAce9a649Ac791e44D7',
		UNI_KP3R_WETH_ADDR: '0x11B7a6bc0259ed6Cf9DB8F499988F9eCc7167bf5'
	}
});
