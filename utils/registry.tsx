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
  '0x133A4273589c2eE5F9Fe28898B68aC1B4B1BA9B0': {
    'name':'PhutureRebalancing',
    'repository':'https://github.com/Phuture-Finance/keep3r-cli-job-phuture'
  }
};

export type {TRegistry};
export default REGISTRY;
