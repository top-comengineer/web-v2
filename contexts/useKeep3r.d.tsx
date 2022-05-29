import 	{BigNumber}		from	'ethers';

export type	TJobData = {
	name: string;
	address: string;
	totalCredits: BigNumber;
	totalCreditsNormalized: number;
}

export type	TJobStats = {
	governance: string;
	slashers: string[];
	disputers: string[];
	keepers: number;
	bonded: BigNumber;
}

export type	TKeeperStatus = {
	balanceOf: BigNumber,
	allowance: BigNumber,
	bonds: BigNumber,
	pendingBonds: BigNumber,
	pendingUnbonds: BigNumber,
	canActivateAfter: BigNumber,
	canWithdrawAfter: BigNumber,
	hasBonded: boolean,
	hasDispute: boolean,
	isDisputer: boolean,
	isSlasher: boolean,
	isGovernance: boolean,
	bondTime: BigNumber,
	unbondTime: BigNumber,
	hasPendingActivation: boolean,
	canActivate: boolean,
	canActivateIn: string,
	canWithdraw: boolean,
	canWithdrawIn: string,
}

export type	TKeep3rContext = {
	jobs: TJobData[],
	keeperStatus: TKeeperStatus,
	getJobs: () => Promise<void>,
	getKeeperStatus: () => Promise<void>,
}

export type	TJobStatus = {
	jobOwner: string,
	jobLiquidityCredits: BigNumber,
	jobPeriodCredits: BigNumber,
	jobTokenCredits: BigNumber,
	liquidityAmount: BigNumber,
	totalJobCredits: BigNumber,
	pendingUnbonds: BigNumber,
	canWithdrawAfter: BigNumber,
	canWithdraw: boolean,
	canWithdrawIn: string,
}