type	TRegistry = {
	[key: string]: {
		[key: string]: string;
	};
}
const	REGISTRY: TRegistry = {
	'0x28937B751050FcFd47Fd49165C6E1268c296BA19': {
		'name':'MakerDAOUpkeep',
		'repository':'https://github.com/defi-wonderland/keep3r-cli-job-maker'
	},
	'0x5D469E1ef75507b0E0439667ae45e280b9D81B9C': {
		'name':'MakerDAOUpkeep',
		'repository':'https://github.com/defi-wonderland/keep3r-cli-job-maker'
	},
	'0x2DFb2C5C013826a0728440D8036305b254Ad9cCE': {
		'name':'DCAKeep3rJob',
		'repository':'https://github.com/Mean-Finance/keep3r-cli-jobs'
	},
	'0xE6DD4B94B0143142E6d7ef3110029c1dcE8215cb': {
		'name':'YearnHarvestV2',
		'repository':'https://github.com/yearn/keep3r-cli-jobs'
	},
	'0xcD7f72F12c4b87dAbd31d3aa478A1381150c32b3': {
		'name':'YearnTendV2',
		'repository':'https://github.com/yearn/keep3r-cli-jobs'
	},
	'0x656027367B5e27dC21984B546e64dC24dBFaA187': {
		'name':'PhutureRebalancing',
		'repository':'https://github.com/Phuture-Finance/keep3r-cli-job-phuture'
	},
	'0xa61d82a9127B1c1a34Ce03879A068Af5b786C835': {
		'name':'PhutureDepositManager',
		'repository':'https://github.com/Phuture-Finance/keep3r-cli-deposit-manager-job'
	},
	'0xEC771dc7Bd0aA67a10b1aF124B9b9a0DC4aF5F9B': {
		'name':'PhutureHarvesting',
		'repository':'https://github.com/Phuture-Finance/keep3r-cli-job-phuture-savings-vault'
	}
};

export type {TRegistry};
export default REGISTRY;
