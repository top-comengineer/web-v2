import	React, {ReactElement, useContext, createContext}		from	'react';
import	{BigNumber}												from	'ethers';
import	{Contract}												from	'ethcall';
import	{useWeb3}												from	'@yearn/web-lib/contexts';
import	{providers, performBatchedUpdates, format}				from	'@yearn/web-lib/utils';
import	CONVEX_REWARDS_ABI										from	'utils/abi/convexRewards.abi';
import	YEARN_VAULT_ABI											from	'utils/abi/yearnVault.abi';
import	LENS_PRICE_ABI											from	'utils/abi/lens.abi';
import	CVX_ABI													from	'utils/abi/cvx.abi';

export type	TTreasury = {
	name: string;
	protocol: string;
	rewards: string;
	tokenStaked: number;
	tokenStakedUSD: number;
	unclaimedRewards: number;
	unclaimedRewardsUSD: number;
	hasNoRewards?: boolean;
}
type	TTreasuryContext = {
	treasury: TTreasury[],
}

const	TreasuryContext = createContext<TTreasuryContext>({treasury: []});
export const TreasuryContextApp = ({children}: {children: ReactElement}): ReactElement => {
	const	{provider, isActive} = useWeb3();
	const	[treasury, set_treasury] = React.useState<TTreasury[]>([]);
	const	[, set_nonce] = React.useState(0);

	const getTreasury = React.useCallback(async (): Promise<void> => {
		const	ethcallProvider = await providers.newEthCallProvider(provider && isActive ? provider : providers.getProvider(1));
		const	lensPriceContract = new Contract('0x83d95e0D5f402511dB06817Aff3f9eA88224B030', LENS_PRICE_ABI);
		const	ibaudUsdcContract = new Contract('0xbAFC4FAeB733C18411886A04679F11877D8629b1', CONVEX_REWARDS_ABI);
		const	ibchfUsdcContract = new Contract('0x9BEc26bDd9702F4e0e4de853dd65Ec75F90b1F2e', CONVEX_REWARDS_ABI);
		const	ibeurUsdcContract = new Contract('0xAab7202D93B5633eB7FB3b80873C817B240F6F44', CONVEX_REWARDS_ABI);
		const	ibgbpUsdcContract = new Contract('0x8C87E32000ADD1a7D7D69a1AE180C415AF769361', CONVEX_REWARDS_ABI);
		const	ibjpyUsdcContract = new Contract('0x58563C872c791196d0eA17c4E53e77fa1d381D4c', CONVEX_REWARDS_ABI);
		const	ibkrwUsdcContract = new Contract('0x1900249c7a90D27b246032792004FF0E092Ac2cE', CONVEX_REWARDS_ABI);
		const	kp3rEthContract = new Contract('0x0c2da920E577960f39991030CfBdd4cF0a0CfEBD', CONVEX_REWARDS_ABI);
		const	mim3CrvContract = new Contract('0xFd5AbF66b003881b88567EB9Ed9c651F14Dc4771', CONVEX_REWARDS_ABI);
		const	yvEthContract = new Contract('0xa258C4606Ca8206D8aA700cE2143D7db854D168c', YEARN_VAULT_ABI);
		const	cvxContract = new Contract('0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B', CVX_ABI);

		const	jobsCalls = [
			cvxContract.totalSupply(),
			cvxContract.reductionPerCliff(),
			cvxContract.totalCliffs(),
			lensPriceContract.getPriceUsdcRecommended('0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B'),
			lensPriceContract.getPriceUsdcRecommended('0xd533a949740bb3306d119cc777fa900ba034cd52'),

			ibaudUsdcContract.balanceOf(process.env.THE_KEEP3R as string),
			ibaudUsdcContract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0x5b692073F141C31384faE55856CfB6CBfFE91E60'),

			ibchfUsdcContract.balanceOf(process.env.THE_KEEP3R as string),
			ibchfUsdcContract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0x6Df0D77F0496CE44e72D695943950D8641fcA5Cf'),
			
			ibeurUsdcContract.balanceOf(process.env.THE_KEEP3R as string),
			ibeurUsdcContract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0x1570af3dF649Fc74872c5B8F280A162a3bdD4EB6'),
			
			ibgbpUsdcContract.balanceOf(process.env.THE_KEEP3R as string),
			ibgbpUsdcContract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0xAcCe4Fe9Ce2A6FE9af83e7CF321a3fF7675e0AB6'),
			
			ibjpyUsdcContract.balanceOf(process.env.THE_KEEP3R as string),
			ibjpyUsdcContract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0x5555f75e3d5278082200fb451d1b6ba946d8e13b'),
			
			ibkrwUsdcContract.balanceOf(process.env.THE_KEEP3R as string),
			ibkrwUsdcContract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0xef04f337fCB2ea220B6e8dB5eDbE2D774837581c'),
			
			kp3rEthContract.balanceOf(process.env.THE_KEEP3R as string),
			kp3rEthContract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0x21410232B484136404911780bC32756D5d1a9Fa9'),
			
			mim3CrvContract.balanceOf(process.env.THE_KEEP3R as string),
			mim3CrvContract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0x5a6A4D54456819380173272A5E8E9B9904BdF41B'),
			
			yvEthContract.balanceOf(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0xa258C4606Ca8206D8aA700cE2143D7db854D168c'),
			
			yvEthContract.pricePerShare(),
			lensPriceContract.getPriceUsdcRecommended('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')

		];
		const	resultsJobsCall = await ethcallProvider.tryAll(jobsCalls);

		let	rIndex = 0;
		const	_treasury: TTreasury[] = [];
		// cvxStuffs //
		const	cvxTotalSupply = resultsJobsCall[rIndex++] as BigNumber;
		const	cvxReductionPerCliff = resultsJobsCall[rIndex++] as BigNumber;
		const	cvxTotalCliffs = resultsJobsCall[rIndex++] as BigNumber;
		const	reduction = cvxTotalCliffs.sub(cvxTotalSupply.div(cvxReductionPerCliff));
		const	cvxPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		const	crvPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);

		// ibAUD //
		const	ibAUDStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	ibAUDEarned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibAUDPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'ibAUD + USDC',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(ibAUDStacked),
			tokenStakedUSD: Number(ibAUDStacked) * Number(ibAUDPrice),
			unclaimedRewards: Number(ibAUDEarned),
			unclaimedRewardsUSD: (
				Number(format.units(ibAUDEarned, 18)) * Number(crvPrice)
				+
				Number(format.units(ibAUDEarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// ibCHF //
		const	ibCHFStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	ibCHFEarned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibCHFPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'ibCHF + USDC',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(ibCHFStacked),
			tokenStakedUSD: Number(ibCHFStacked) * Number(ibCHFPrice),
			unclaimedRewards: Number(ibCHFEarned),
			unclaimedRewardsUSD: (
				Number(format.units(ibCHFEarned, 18)) * Number(crvPrice)
				+
				Number(format.units(ibCHFEarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// ibEUR //
		const	ibEURStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	ibEUREarned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibEURPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'ibEUR + USDC',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(ibEURStacked),
			tokenStakedUSD: Number(ibEURStacked) * Number(ibEURPrice),
			unclaimedRewards: Number(ibEUREarned),
			unclaimedRewardsUSD: (
				Number(format.units(ibEUREarned, 18)) * Number(crvPrice)
				+
				Number(format.units(ibEUREarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// ibGBP //
		const	ibGBPStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	ibGBPEarned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibGBPPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'ibGBP + USDC',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(ibGBPStacked),
			tokenStakedUSD: Number(ibGBPStacked) * Number(ibGBPPrice),
			unclaimedRewards: Number(ibGBPEarned),
			unclaimedRewardsUSD: (
				Number(format.units(ibGBPEarned, 18)) * Number(crvPrice)
				+
				Number(format.units(ibGBPEarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// ibJPY //
		const	ibJPYStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	ibJPYEarned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibJPYPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'ibJPY + USDC',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(ibJPYStacked),
			tokenStakedUSD: Number(ibJPYStacked) * Number(ibJPYPrice),
			unclaimedRewards: Number(ibJPYEarned),
			unclaimedRewardsUSD: (
				Number(format.units(ibJPYEarned, 18)) * Number(crvPrice)
				+
				Number(format.units(ibJPYEarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// ibKRW //
		const	ibKRWStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	ibKRWEarned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibKRWPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'ibKRW + USDC',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(ibKRWStacked),
			tokenStakedUSD: Number(ibKRWStacked) * Number(ibKRWPrice),
			unclaimedRewards: Number(ibKRWEarned),
			unclaimedRewardsUSD: (
				Number(format.units(ibKRWEarned, 18)) * Number(crvPrice)
				+
				Number(format.units(ibKRWEarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// kp3rEth //
		const	kp3rEthStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	kp3rEthCrvEarned = resultsJobsCall[rIndex++] as BigNumber;
		const	kp3rEthPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'kp3rEth',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(kp3rEthStacked),
			tokenStakedUSD: Number(kp3rEthStacked) * Number(kp3rEthPrice),
			unclaimedRewards: Number(format.units(kp3rEthCrvEarned, 18)),
			unclaimedRewardsUSD: (
				Number(format.units(kp3rEthCrvEarned, 18)) * Number(crvPrice)
				+
				Number(format.units(kp3rEthCrvEarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// mim3Crv //
		const	mim3CrvStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	mim3CrvEarned = resultsJobsCall[rIndex++] as BigNumber;
		const	mim3CrvPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'mim3Crv',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(mim3CrvStacked),
			tokenStakedUSD: Number(mim3CrvStacked) * Number(mim3CrvPrice),
			unclaimedRewards: Number(mim3CrvEarned),
			unclaimedRewardsUSD: (
				Number(format.units(mim3CrvEarned, 18)) * Number(crvPrice)
				+
				Number(format.units(mim3CrvEarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// yvEth //
		const	yvEthStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		// const	pricePerShare = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		// const	ethPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		const	yvEthPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'yvEth',
			protocol: 'Yearn',
			rewards: 'ETH',
			tokenStaked: Number(yvEthStacked),
			tokenStakedUSD: Number(yvEthStacked) * Number(yvEthPrice),
			unclaimedRewards: 0,
			unclaimedRewardsUSD: 0,
			hasNoRewards: true
			// unclaimedRewards: (Number(yvEthStacked) * Number(pricePerShare)) - Number(yvEthStacked),
			// unclaimedRewardsUSD: (Number(yvEthStacked) * Number(yvEthPrice)) - (Number(yvEthStacked) * Number(ethPrice))
		});

		performBatchedUpdates((): void => {
			set_treasury(_treasury);
			set_nonce((n: number): number => n + 1);
		});
	}, [provider, isActive]);

	React.useEffect((): void => {
		getTreasury();
	}, [getTreasury]);

	return (
		<TreasuryContext.Provider value={{treasury}}>
			{children}
		</TreasuryContext.Provider>
	);
};


export const useTreasury = (): TTreasuryContext => useContext(TreasuryContext);
export default useTreasury;

