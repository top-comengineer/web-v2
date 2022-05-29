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
	}
};

export type {TRegistry};
export default REGISTRY;