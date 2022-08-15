const withPWA = require('next-pwa');

module.exports = withPWA({
	images: {
		domains: [
			'rawcdn.githack.com',
			'raw.githubusercontent.com'
		]
	},
	pwa: {
		dest: 'public'
	},
	env: {
		CG_IDS: ['ethereum', 'keep3rv1'],

		/* 📰 - Keep3r *********************************************************
		** Config over the RPC
		**********************************************************************/
		WEB_SOCKET_URL: {
			1: process.env.WS_URL_MAINNET,
			250: process.env.WS_URL_FANTOM,
			42161: process.env.WS_URL_ARBITRUM
		},
		JSON_RPC_URL: {
			1: process.env.RPC_URL_MAINNET,
			250: process.env.RPC_URL_FANTOM,
			42161: process.env.RPC_URL_ARBITRUM
		},
		ALCHEMY_KEY: process.env.ALCHEMY_KEY,
		INFURA_KEY: process.env.INFURA_KEY,

		/* 📰 - Keep3r *********************************************************
		** Keep3r specific stuffs
		**********************************************************************/
		BACKEND_URI: 'https://api.keep3r.network', //Only used for stats
		THE_KEEP3R: '0x0D5Dc686d0a2ABBfDaFDFb4D0533E886517d4E83',
		KEEP3R_V1_ADDR: '0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44',
		KEEP3R_V2_ADDR: '0xeb02addcfd8b773a5ffa6b9d1fe99c566f8c44cc',
		KP3R_TOKEN_ADDR: '0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44',
		WETH_TOKEN_ADDR: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		KLP_KP3R_WETH_ADDR: '0x3f6740b5898c5D3650ec6eAce9a649Ac791e44D7',
		UNI_KP3R_WETH_ADDR: '0x11B7a6bc0259ed6Cf9DB8F499988F9eCc7167bf5'
	}
});
