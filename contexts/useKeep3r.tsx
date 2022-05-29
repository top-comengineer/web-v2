import	React, {ReactElement, useContext, createContext}		from	'react';
import	{Contract}												from	'ethcall';
import	{useWeb3}												from	'@yearn/web-lib/contexts';
import	{toAddress, providers, performBatchedUpdates, format}	from	'@yearn/web-lib/utils';
import	KEEP3RV1_ABI											from	'utils/abi/keep3rv1.abi';
import	KEEP3RV2_ABI											from	'utils/abi/keep3rv2.abi';
import	REGISTRY												from	'utils/registry';
import 	{BigNumber, ethers}										from	'ethers';
import type * as TKeep3rTypes									from	'contexts/useKeep3r.d';

const	defaultProps = {
	jobs: [],
	keeperStatus: {
		wEthBalanceOf: ethers.constants.Zero,
		wEthAllowance: ethers.constants.Zero,
		balanceOf: ethers.constants.Zero,
		allowance: ethers.constants.Zero,
		bonds: ethers.constants.Zero,
		pendingBonds: ethers.constants.Zero,
		pendingUnbonds: ethers.constants.Zero,
		canActivateAfter: ethers.constants.Zero,
		canWithdrawAfter: ethers.constants.Zero,
		hasBonded: false,
		hasDispute: false,
		isDisputer: false,
		isSlasher: false,
		isGovernance: false,
		bondTime: format.BN(259200),
		unbondTime: format.BN(1209600),
		hasPendingActivation: false,
		canActivate: false,
		canActivateIn: 'Now',
		canWithdraw: false,
		canWithdrawIn: 'Now'
	},
	getJobs: async (): Promise<void> => undefined,
	getKeeperStatus: async (): Promise<void> => undefined
};
const	Keep3rContext = createContext<TKeep3rTypes.TKeep3rContext>(defaultProps);
export const Keep3rContextApp = ({children}: {children: ReactElement}): ReactElement => {
	const	{provider, isActive, isDisconnected, address} = useWeb3();
	const	[jobs, set_jobs] = React.useState<TKeep3rTypes.TJobData[]>(defaultProps.jobs);
	const	[keeperStatus, set_keeperStatus] = React.useState<TKeep3rTypes.TKeeperStatus>(defaultProps.keeperStatus);
	const	[, set_nonce] = React.useState(0);

	/* 📰 - Keep3r *************************************************************
	**	On disconnect, status
	***************************************************************************/
	React.useEffect((): void => {
		if (isDisconnected) {
			set_keeperStatus(defaultProps.keeperStatus);
		}
	}, [isDisconnected]);

	/* 📰 - Keep3r *************************************************************
	**	Find all the jobs currently set on the Keep3r SmartContract. First, we
	**	need to fetch the list of jobs, then we need to find, for each one,
	**	the associated credits.
	***************************************************************************/
	const getJobs = React.useCallback(async (): Promise<void> => {
		const	jobData = [] as TKeep3rTypes.TJobData[];
		const	ethcallProvider = await providers.newEthCallProvider(provider && isActive ? provider : providers.getProvider(1));
		const	keep3rV2 = new Contract(process.env.KEEP3R_V2_ADDR as string, KEEP3RV2_ABI);
		const	resultsJobsCall = await ethcallProvider.tryAll([keep3rV2.jobs()]) as never[];
		const	calls = [];
		for (const job of resultsJobsCall[0] as string[]) {
			calls.push(keep3rV2.totalJobCredits(job));
		}

		const	results = await ethcallProvider.tryAll(calls) as never[];
		for (let i = 0; i < results.length; i++) {
			jobData[i] = {
				name: REGISTRY[toAddress(resultsJobsCall[0][i])]?.name || '',
				address: toAddress(resultsJobsCall[0][i]),
				totalCredits: format.BN(results[i]),
				totalCreditsNormalized: Number(format.units(results[i], 18))
			};
		}

		performBatchedUpdates((): void => {
			set_jobs(jobData);
			set_nonce((n: number): number => n + 1);
		});
	}, [provider, isActive]);
	React.useEffect((): void => {
		getJobs();
	}, [getJobs]);

	/* 📰 - Keep3r *************************************************************
	**	Once the wallet is connected and a provider is available, we can fetch
	**	the informations for a specific keeper. We are getting a lot of info
	**	there that can be used accross the app.
	***************************************************************************/
	const getKeeperStatus = React.useCallback(async (): Promise<void> => {
		if (!provider || !isActive)
			return;
		const	{timestamp} = await provider.getBlock('latest');
		const	ethcallProvider = await providers.newEthCallProvider(provider);
		const	keep3rV1 = new Contract(process.env.KEEP3R_V1_ADDR as string, KEEP3RV1_ABI);
		const	keep3rV2 = new Contract(process.env.KEEP3R_V2_ADDR as string, KEEP3RV2_ABI);

		const	calls = [
			keep3rV1.balanceOf(address),
			keep3rV1.allowance(address, process.env.KEEP3R_V2_ADDR as string),
			keep3rV2.bonds(address, process.env.KP3R_TOKEN_ADDR as string),
			keep3rV2.pendingBonds(address, process.env.KP3R_TOKEN_ADDR as string),
			keep3rV2.pendingUnbonds(address, process.env.KP3R_TOKEN_ADDR as string),
			keep3rV2.canActivateAfter(address, process.env.KP3R_TOKEN_ADDR as string),
			keep3rV2.canWithdrawAfter(address, process.env.KP3R_TOKEN_ADDR as string),
			keep3rV2.disputes(address),
			keep3rV2.disputers(address),
			keep3rV2.slashers(address),
			keep3rV2.governance(),
			keep3rV2.hasBonded(address),
			keep3rV2.bondTime(),
			keep3rV2.unbondTime()
		];
		const	results = await ethcallProvider.tryAll(calls) as never[];
		performBatchedUpdates((): void => {
			const	[
				kp3rBalance, kp3rAllowance, bonds,
				pendingBonds, pendingUnbonds, canActivateAfter,
				canWithdrawAfter, disputes, disputers, slashers, governance,
				hasBonded, bondTime, unbondTime
			] = results;

			set_keeperStatus({
				balanceOf: kp3rBalance,
				allowance: kp3rAllowance,
				bonds: bonds,
				pendingBonds: pendingBonds,
				pendingUnbonds: pendingUnbonds,
				canActivateAfter: canActivateAfter,
				canWithdrawAfter: canWithdrawAfter,
				isDisputer: disputers,
				isSlasher: slashers,
				isGovernance: governance === address,
				hasDispute: disputes,
				hasBonded: hasBonded,
				bondTime: bondTime,
				unbondTime: unbondTime,
				hasPendingActivation: !(canActivateAfter as BigNumber).isZero(),
				canActivate: !(canActivateAfter as BigNumber).isZero() && ((timestamp * 1000) - (Number(bondTime) + Number(canActivateAfter) * 1000)) > 0,
				canActivateIn: format.duration((Number(bondTime) + Number(canActivateAfter) * 1000) - (timestamp * 1000), true),
				canWithdraw: ((timestamp * 1000) - (Number(unbondTime) + Number(canWithdrawAfter) * 1000)) > 0,
				canWithdrawIn: format.duration((Number(unbondTime) + Number(canWithdrawAfter) * 1000) - (timestamp * 1000), true)
			});
			set_nonce((n: number): number => n + 1);
		});
	}, [address, provider, isActive]);
	React.useEffect((): void => {
		getKeeperStatus();
	}, [getKeeperStatus]);

	/* 📰 - Keep3r *************************************************************
	**	Setup and render the Context provider to use in the app.
	***************************************************************************/
	return (
		<Keep3rContext.Provider
			value={{
				jobs,
				keeperStatus,
				getJobs,
				getKeeperStatus
			}}>
			{children}
		</Keep3rContext.Provider>
	);
};


export const useKeep3r = (): TKeep3rTypes.TKeep3rContext => useContext(Keep3rContext);
export default useKeep3r;
