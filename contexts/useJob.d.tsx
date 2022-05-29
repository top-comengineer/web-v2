import 	{BigNumber}		from	'ethers';

export type	TJobStatus = {
	name: string,
	address: string,
	jobOwner: string,
	pendingJobMigrations: string,
	jobLiquidityCredits: BigNumber,
	jobPeriodCredits: BigNumber,
	jobTokenCredits: BigNumber,
	liquidityAmount: BigNumber,
	totalJobCredits: BigNumber,
	pendingUnbonds: BigNumber,
	canWithdrawAfter: BigNumber,
	canWithdrawIn: string,
	canWithdraw: boolean,
	hasDispute: boolean,
	isVerified: boolean,
	isLoaded: boolean,
	//From the DB for stats
	workDone: number,
	lastWork: string, //date
	totalFees: number,
	averageWorkDonePerDay: number,
	averageFees: number,
	averageEarned: number,
	uniqueKeepers: number,
	workPerKeeper: number,
	works: any[]
}

export type	TJobContext = {
	jobStatus: TJobStatus,
	getJobStatus: () => Promise<void>,
}