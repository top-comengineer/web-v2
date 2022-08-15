import	React, {ReactElement, useContext, createContext}		from	'react';
import	{Contract}												from	'ethcall';
import 	{BigNumber, ethers}										from	'ethers';
import	axios													from	'axios';
import	{useWeb3}												from	'@yearn-finance/web-lib/contexts';
import	{providers, performBatchedUpdates, format, toAddress}	from	'@yearn-finance/web-lib/utils';
import	KEEP3RV2_ABI											from	'utils/abi/keep3rv2.abi';
import	REGISTRY												from	'utils/registry';
import type * as TJobTypes										from	'contexts/useJob.d';

const	defaultProps = {
	jobStatus: {
		name: 'Unverified job',
		address: ethers.constants.AddressZero,
		pendingJobMigrations: ethers.constants.AddressZero,
		jobLiquidityCredits: ethers.constants.Zero,
		jobOwner: ethers.constants.AddressZero,
		jobPeriodCredits: ethers.constants.Zero,
		jobTokenCredits: ethers.constants.Zero,
		liquidityAmount: ethers.constants.Zero,
		totalJobCredits: ethers.constants.Zero,
		pendingUnbonds: ethers.constants.Zero,
		canWithdrawAfter: ethers.constants.Zero,
		canWithdrawIn: '',
		canWithdraw: false,
		hasDispute: false,
		isVerified: false,
		isLoaded: false,
		//
		workDone: 0,
		lastWork: 'Never', //date
		totalFees: 0,
		averageWorkDonePerDay: 0,
		averageFees: 0,
		averageEarned: 0,
		uniqueKeepers: 0,
		workPerKeeper: 0,
		works: []
	},
	getJobStatus: async (): Promise<void> => undefined
};
const	JobContext = createContext<TJobTypes.TJobContext>(defaultProps);
export const JobContextApp = (
	{jobAddress, children}: {jobAddress: string, children: ReactElement}
): ReactElement => {
	const	{provider} = useWeb3();
	const	[jobStatus, set_jobStatus] = React.useState<TJobTypes.TJobStatus>(defaultProps.jobStatus);
	const	[, set_nonce] = React.useState(0);

	/* 📰 - Keep3r *************************************************************
	**	If the user's navigate to a page inside the `pages/jobs` directory, we
	**	need to fetch a bunch of data related to this job.
	**	Data includes some on-chain related ones, but also some off-chain
	**	(stats) related ones, fetched from our backend
	***************************************************************************/
	const getJobStatus = React.useCallback(async (): Promise<void> => {
		if (!jobAddress) {
			return;
		}
		const	_provider = provider || providers.getProvider(1);
		const	{timestamp} = await _provider.getBlock('latest');
		const	ethcallProvider = await providers.newEthCallProvider(_provider);
		const	keep3rV2 = new Contract(process.env.KEEP3R_V2_ADDR as string, KEEP3RV2_ABI);
		const	calls = [
			keep3rV2.jobLiquidityCredits(jobAddress),
			keep3rV2.jobOwner(jobAddress),
			keep3rV2.jobPeriodCredits(jobAddress),
			keep3rV2.jobTokenCredits(jobAddress, process.env.KLP_KP3R_WETH_ADDR as string),
			keep3rV2.liquidityAmount(jobAddress, process.env.KLP_KP3R_WETH_ADDR as string),
			keep3rV2.totalJobCredits(jobAddress),
			keep3rV2.pendingUnbonds(jobAddress, process.env.KLP_KP3R_WETH_ADDR as string),
			keep3rV2.canWithdrawAfter(jobAddress, process.env.KLP_KP3R_WETH_ADDR as string),
			keep3rV2.unbondTime(),
			keep3rV2.pendingJobMigrations(jobAddress),
			keep3rV2.disputes(jobAddress)
		];
		const	[results, works] = await Promise.all([
			ethcallProvider.tryAll(calls),
			axios.get(`${process.env.BACKEND_URI as string}/job/${jobAddress}`)
		]) as [never[], any];
	
		const	[
			jobLiquidityCredits, jobOwner, jobPeriodCredits,
			jobTokenCredits, liquidityAmount, totalJobCredits,
			pendingUnbonds, canWithdrawAfter, unbondTime,
			pendingJobMigrations, disputes
		] = results;

		const	allWorks = works.data || [];
		const	lastWork = allWorks?.[0]?.time;
		const	totalFees = format.toNormalizedValue((allWorks || []).reduce((acc: BigNumber, work: {fees: string}): BigNumber => acc.add(format.BN(work?.fees)), ethers.constants.Zero));
		const	totalEarned = format.toNormalizedValue((allWorks || []).reduce((acc: BigNumber, work: {earned: string}): BigNumber => acc.add(format.BN(work?.earned)), ethers.constants.Zero));
		const	uniqueKeepers = [...new Set((allWorks || []).map((e: {keeper: string}): string => e.keeper))];
		const	perDay: {[v: string]: number} = {};
		for (const work of allWorks) {
			const	date = new Date(work.time * 1000);
			const	day = date.getDate();
			const	month = date.getMonth();
			const	year = date.getFullYear();
			const	dayKey = `${year}-${month}-${day}`;
			if (!perDay[dayKey]) {
				perDay[dayKey] = 0;
			}
			perDay[dayKey] += 1;
		}
		const	averageWorkPerDay = Object.values(perDay).reduce((acc: number, v: number): number => acc + v, 0) / Object.keys(perDay).length;

		performBatchedUpdates((): void => {
			set_jobStatus({
				name: REGISTRY[toAddress(jobAddress)]?.name || 'Unverified job',
				address: toAddress(jobAddress),
				pendingJobMigrations: toAddress(pendingJobMigrations),
				jobLiquidityCredits,
				jobOwner,
				jobPeriodCredits,
				jobTokenCredits,
				liquidityAmount,
				totalJobCredits,
				pendingUnbonds,
				canWithdrawAfter,
				canWithdrawIn: format.duration((Number(unbondTime) + Number(canWithdrawAfter) * 1000) - (timestamp * 1000), true),
				canWithdraw: ((timestamp * 1000) - (Number(unbondTime) + Number(canWithdrawAfter) * 1000)) > 0,
				hasDispute: disputes,
				isVerified: REGISTRY[toAddress(jobAddress)]?.name ? true : false,
				isLoaded: true,
				workDone: allWorks.length,
				averageWorkDonePerDay: averageWorkPerDay,
				lastWork: lastWork ? format.date(Number(lastWork) * 1000, true) : 'Never', //date
				totalFees: totalFees,
				averageFees: totalFees / allWorks.length,
				averageEarned: totalEarned / allWorks.length,
				uniqueKeepers: uniqueKeepers.length,
				workPerKeeper: allWorks.length / uniqueKeepers.length,
				works: works.data
			});
			set_nonce((n: number): number => n + 1);
		});
	}, [jobAddress, provider]);
	React.useEffect((): void => {
		getJobStatus();
	}, [getJobStatus]);

	/* 📰 - Keep3r *************************************************************
	**	Setup and render the Context provider to use in the app.
	***************************************************************************/
	return (
		<JobContext.Provider value={{jobStatus, getJobStatus}}>
			{children}
		</JobContext.Provider>
	);
};


export const useJob = (): TJobTypes.TJobContext => useContext(JobContext);
export default useJob;
