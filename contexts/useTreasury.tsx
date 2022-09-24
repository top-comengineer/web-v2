import	React, {ReactElement, useContext, createContext}		from	'react';
import	{BigNumber, ethers}												from	'ethers';
import	{Contract}												from	'ethcall';
import	{useWeb3}												from	'@yearn-finance/web-lib/contexts';
import	{providers, performBatchedUpdates, format}				from	'@yearn-finance/web-lib/utils';
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
		const	currentProvider = provider && isActive ? provider : providers.getProvider(1);
		const	ethcallProvider = await providers.newEthCallProvider(currentProvider);
		const	lensPriceContract = new Contract('0x83d95e0D5f402511dB06817Aff3f9eA88224B030', LENS_PRICE_ABI);
		const	ibaudUsdcContract = new Contract('0xbAFC4FAeB733C18411886A04679F11877D8629b1', CONVEX_REWARDS_ABI);
		const	ibchfUsdcContract = new Contract('0x9BEc26bDd9702F4e0e4de853dd65Ec75F90b1F2e', CONVEX_REWARDS_ABI);
		const	ibeurUsdcContract = new Contract('0xAab7202D93B5633eB7FB3b80873C817B240F6F44', CONVEX_REWARDS_ABI);
		const	ibgbpUsdcContract = new Contract('0x8C87E32000ADD1a7D7D69a1AE180C415AF769361', CONVEX_REWARDS_ABI);
		const	ibjpyUsdcContract = new Contract('0x58563C872c791196d0eA17c4E53e77fa1d381D4c', CONVEX_REWARDS_ABI);
		const	ibkrwUsdcContract = new Contract('0x1900249c7a90D27b246032792004FF0E092Ac2cE', CONVEX_REWARDS_ABI);

		const	ibeurAgeurContract = new Contract('0x769499A7B4093b2AA35E3F3C00B1ab5dc8EF7146', CONVEX_REWARDS_ABI); // ibeur-ageur
		const	ibeurAgeurExtraRewards1Contract = new Contract('0x92dFd397b6d0B878126F5a5f6F446ae9Fc8A8356', CONVEX_REWARDS_ABI); // ANGLE
		const	ibeurAgeurExtraRewards2Contract = new Contract('0x19Ba12D57aD7B126dE898706AA6dBF7d6DC85FF8', CONVEX_REWARDS_ABI); // KP3R

		const	ibaudSaudContract = new Contract('0xb1Fae59F23CaCe4949Ae734E63E42168aDb0CcB3', CONVEX_REWARDS_ABI); // ibAUD+sAUD
		const	ibaudSaudExtraRewards1Contract = new Contract('0x91ad51F0897552ce77f76B44e9a86B4Ad2B28c25', CONVEX_REWARDS_ABI); // KP3R
		const	ibaudSaudExtraRewards2Contract = new Contract('0x040A6Ae6314e190974ee4839f3c2FBf849EF54Eb', CONVEX_REWARDS_ABI); // CVX

		const	ibchfSchfContract = new Contract('0xa5A5905efc55B05059eE247d5CaC6DD6791Cfc33', CONVEX_REWARDS_ABI); // ibCHF+sCHF
		const	ibchfSchfExtraRewards1Contract = new Contract('0x9D9EBCc8E7B4eF061C0F7Bab532d1710b874f789', CONVEX_REWARDS_ABI); // KP3R
		const	ibchfSchfExtraRewards2Contract = new Contract('0x1c86460640457466E2eC86916B4a91ED86CE0D1E', CONVEX_REWARDS_ABI); // CVX

		const	ibeurSeurContract = new Contract('0xCd0559ADb6fAa2fc83aB21Cf4497c3b9b45bB29f', CONVEX_REWARDS_ABI); // ibEUR+sEUR
		const	ibeurSeurExtraRewards1Contract = new Contract('0x21034ccc4f8D07d0cF8998Fdd4c45e426540dEc1', CONVEX_REWARDS_ABI); // KP3R
		const	ibeurSeurExtraRewards2Contract = new Contract('0xbA5eF047ce02cc0096DB3Bc8ED84aAD14291f8a0', CONVEX_REWARDS_ABI); // CVX

		const	ibgbpSgbpContract = new Contract('0x51a16DA36c79E28dD3C8c0c19214D8aF413984Aa', CONVEX_REWARDS_ABI); // ibGBP+sGBP
		const	ibgbpSgbpExtraRewards1Contract = new Contract('0xE689DB5D753abc411ACB8a3fEf226C08ACDAE13f', CONVEX_REWARDS_ABI); // KP3R
		const	ibgbpSgbpExtraRewards2Contract = new Contract('0x00A4f5d12E3FAA909c53CDcC90968F735633e988', CONVEX_REWARDS_ABI); // CVX

		const	ibjpySjpyContract = new Contract('0xbA8fE590498ed24D330Bb925E69913b1Ac35a81E', CONVEX_REWARDS_ABI); // ibJPY+sJPY
		const	ibjpySjpyExtraRewards1Contract = new Contract('0x771bc5c888d1B318D0c5b177e4F996d3D5fd3d18', CONVEX_REWARDS_ABI); // KP3R
		const	ibjpySjpyExtraRewards2Contract = new Contract('0x8a3F52c2Eb02De2d8356a8286c96909352c62B10', CONVEX_REWARDS_ABI); // CVX

		const	ibkrwSkrwContract = new Contract('0x8F18C0AF0d7d511E8Bdc6B3c64926B04EDfE4892', CONVEX_REWARDS_ABI); // ibKRW+sKRW
		const	ibkrwSkrwExtraRewards1Contract = new Contract('0xE3A64E08EEbf38b19a3d9fec51d8cD5A8898Dd5e', CONVEX_REWARDS_ABI); // KP3R
		const	ibkrwSkrwExtraRewards2Contract = new Contract('0x93649cd43635bC5F7Ad8fA2fa27CB9aE765Ec58A', CONVEX_REWARDS_ABI); // CVX

		const	cvxcrvCrvContract = new Contract('0x3Fe65692bfCD0e6CF84cB1E7d24108E434A7587e', CONVEX_REWARDS_ABI); // cvxCRV+CRV
		const	cvxcrvCrvExtraRewards1Contract = new Contract('0x7091dbb7fcbA54569eF1387Ac89Eb2a5C9F6d2EA', CONVEX_REWARDS_ABI); // 3CRV

		const	kp3rEthContract = new Contract('0x0c2da920E577960f39991030CfBdd4cF0a0CfEBD', CONVEX_REWARDS_ABI);
		const	mim3CrvContract = new Contract('0xFd5AbF66b003881b88567EB9Ed9c651F14Dc4771', CONVEX_REWARDS_ABI);
		const	yvEthContract = new Contract('0xa258C4606Ca8206D8aA700cE2143D7db854D168c', YEARN_VAULT_ABI);
		const	cvxContract = new Contract('0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B', CVX_ABI);
		const	crvSusdContract = new Contract('0x22eE18aca7F3Ee920D01F25dA85840D12d98E8Ca', CONVEX_REWARDS_ABI);
		const	crvSusdExtraRewardsContract = new Contract('0x81fCe3E10D12Da6c7266a1A169c4C96813435263', CONVEX_REWARDS_ABI); //SNX
		const	veCRVContract = new Contract('0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2', CVX_ABI);

		const	veCRVContractRegular = new ethers.Contract(
			'0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc',
			['function claim(address) public returns (uint256)'],
			currentProvider
		);

		const	jobsCalls = [
			cvxContract.totalSupply(),
			cvxContract.reductionPerCliff(),
			cvxContract.totalCliffs(),
			lensPriceContract.getPriceUsdcRecommended('0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B'), //CVX
			lensPriceContract.getPriceUsdcRecommended('0xd533a949740bb3306d119cc777fa900ba034cd52'), //CRV
			lensPriceContract.getPriceUsdcRecommended('0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44'), //KP3R
			lensPriceContract.getPriceUsdcRecommended('0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490'), //3CRV

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

			crvSusdContract.balanceOf(process.env.THE_KEEP3R as string),
			crvSusdContract.earned(process.env.THE_KEEP3R as string),
			crvSusdExtraRewardsContract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0xC25a3A3b969415c80451098fa907EC722572917F'),
			lensPriceContract.getPriceUsdcRecommended('0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'), //SNX

			ibeurAgeurContract.balanceOf(process.env.THE_KEEP3R as string),
			ibeurAgeurContract.earned(process.env.THE_KEEP3R as string),
			ibeurAgeurExtraRewards1Contract.earned(process.env.THE_KEEP3R as string),
			ibeurAgeurExtraRewards2Contract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0xB37D6c07482Bc11cd28a1f11f1a6ad7b66Dec933'),
			lensPriceContract.getPriceUsdcRecommended('0x31429d1856aD1377A8A0079410B297e1a9e214c2'), //ANGLE
			
			ibaudSaudContract.balanceOf(process.env.THE_KEEP3R as string), // ibAUD+sAUD
			ibaudSaudContract.earned(process.env.THE_KEEP3R as string),
			ibaudSaudExtraRewards1Contract.earned(process.env.THE_KEEP3R as string),
			ibaudSaudExtraRewards2Contract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0x3F1B0278A9ee595635B61817630cC19DE792f506'),
			
			ibchfSchfContract.balanceOf(process.env.THE_KEEP3R as string), // ibCHF+sCHF
			ibchfSchfContract.earned(process.env.THE_KEEP3R as string),
			ibchfSchfExtraRewards1Contract.earned(process.env.THE_KEEP3R as string),
			ibchfSchfExtraRewards2Contract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0x9c2C8910F113181783c249d8F6Aa41b51Cde0f0c'),
			
			ibeurSeurContract.balanceOf(process.env.THE_KEEP3R as string), // ibEUR+sEUR
			ibeurSeurContract.earned(process.env.THE_KEEP3R as string),
			ibeurSeurExtraRewards1Contract.earned(process.env.THE_KEEP3R as string),
			ibeurSeurExtraRewards2Contract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0x19b080FE1ffA0553469D20Ca36219F17Fcf03859'),
			
			ibgbpSgbpContract.balanceOf(process.env.THE_KEEP3R as string), // ibGBP+sGBP
			ibgbpSgbpContract.earned(process.env.THE_KEEP3R as string),
			ibgbpSgbpExtraRewards1Contract.earned(process.env.THE_KEEP3R as string),
			ibgbpSgbpExtraRewards2Contract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0xD6Ac1CB9019137a896343Da59dDE6d097F710538'),
			
			ibjpySjpyContract.balanceOf(process.env.THE_KEEP3R as string), // ibJPY+sJPY
			ibjpySjpyContract.earned(process.env.THE_KEEP3R as string),
			ibjpySjpyExtraRewards1Contract.earned(process.env.THE_KEEP3R as string),
			ibjpySjpyExtraRewards2Contract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0x8818a9bb44Fbf33502bE7c15c500d0C783B73067'),
			
			ibkrwSkrwContract.balanceOf(process.env.THE_KEEP3R as string), // ibKRW+sKRW
			ibkrwSkrwContract.earned(process.env.THE_KEEP3R as string),
			ibkrwSkrwExtraRewards1Contract.earned(process.env.THE_KEEP3R as string),
			ibkrwSkrwExtraRewards2Contract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0x8461A004b50d321CB22B7d034969cE6803911899'),

			cvxcrvCrvContract.balanceOf(process.env.THE_KEEP3R as string), // cvxCRV+CRV
			cvxcrvCrvContract.earned(process.env.THE_KEEP3R as string),
			cvxcrvCrvExtraRewards1Contract.earned(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0x9D0464996170c6B9e75eED71c68B99dDEDf279e8'),

			yvEthContract.balanceOf(process.env.THE_KEEP3R as string),
			lensPriceContract.getPriceUsdcRecommended('0xa258C4606Ca8206D8aA700cE2143D7db854D168c'),
			yvEthContract.pricePerShare(),
			lensPriceContract.getPriceUsdcRecommended('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'),
			veCRVContract.balanceOf(process.env.THE_KEEP3R as string)
		];
		const	promise = await Promise.allSettled([
			ethcallProvider.tryAll(jobsCalls),
			veCRVContractRegular.callStatic.claim(process.env.THE_KEEP3R as string)
		]);

		let		resultsJobsCall: unknown[] = [];
		let		claimable = ethers.constants.Zero;
		if (promise[0].status === 'fulfilled')
			resultsJobsCall = promise[0].value;
		if (promise[1].status === 'fulfilled')
			claimable = promise[1].value;

		let	rIndex = 0;
		const	_treasury: TTreasury[] = [];
		// cvxStuffs //
		const	cvxTotalSupply = resultsJobsCall[rIndex++] as BigNumber;
		const	cvxReductionPerCliff = resultsJobsCall[rIndex++] as BigNumber;
		const	cvxTotalCliffs = resultsJobsCall[rIndex++] as BigNumber;
		const	reduction = cvxTotalCliffs.sub(cvxTotalSupply.div(cvxReductionPerCliff));
		const	cvxPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		const	crvPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		const	kp3rPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		const	threeCRVPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);

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

		// crvSUSD //
		const	crvSUSDStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	crvSUSDEarned = resultsJobsCall[rIndex++] as BigNumber;
		const	crvSUSDExtra0Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	crvSUSDPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		const	crvSUSDExtra0Price = format.units(resultsJobsCall[rIndex++] as BigNumber, 6); //SNX
		_treasury.push({
			name: 'crvSUSD',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(crvSUSDStacked),
			tokenStakedUSD: Number(crvSUSDStacked) * Number(crvSUSDPrice),
			unclaimedRewards: Number(crvSUSDEarned),
			unclaimedRewardsUSD: (
				Number(format.units(crvSUSDEarned, 18)) * Number(crvPrice)
				+
				Number(format.units(crvSUSDExtra0Earned, 18)) * Number(crvSUSDExtra0Price)
				+
				Number(format.units(crvSUSDEarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// ibeur-ageur //
		const	ibEURAgEURStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	ibEURAgEUREarned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibEURAgEURExtra1Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibEURAgEURExtra2Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibEURAgEURPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		const	ibEURAgEURExtra1Price = format.units(resultsJobsCall[rIndex++] as BigNumber, 6); //ANGLE
		_treasury.push({
			name: 'ibEUR + AgEUR',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(ibEURAgEURStacked),
			tokenStakedUSD: Number(ibEURAgEURStacked) * Number(ibEURAgEURPrice),
			unclaimedRewards: Number(ibEURAgEUREarned),
			unclaimedRewardsUSD: (
				Number(format.units(ibEURAgEUREarned, 18)) * Number(crvPrice)
				+
				Number(format.units(ibEURAgEURExtra1Earned, 18)) * Number(ibEURAgEURExtra1Price)
				+
				Number(format.units(ibEURAgEURExtra2Earned, 18)) * Number(kp3rPrice)
				+
				Number(format.units(ibEURAgEUREarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// ibAUD+sAUD
		const	ibAUDsAUDStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	ibAUDsAUDEarned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibAUDsAUDExtra1Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibAUDsAUDExtra2Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibAUDsAUDPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'ibAUD + sAUD',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(ibAUDsAUDStacked),
			tokenStakedUSD: Number(ibAUDsAUDStacked) * Number(ibAUDsAUDPrice),
			unclaimedRewards: Number(ibAUDsAUDEarned),
			unclaimedRewardsUSD: (
				Number(format.units(ibAUDsAUDEarned, 18)) * Number(crvPrice)
				+
				Number(format.units(ibAUDsAUDExtra1Earned, 18)) * Number(kp3rPrice)
				+
				Number(format.units(ibAUDsAUDExtra2Earned, 18)) * Number(cvxPrice)
				+
				Number(format.units(ibAUDsAUDEarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// ibCHF+sCHF
		const	ibCHFsCHFStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	ibCHFsCHFEarned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibCHFsCHFExtra1Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibCHFsCHFExtra2Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibCHFsCHFPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'ibCHF + sCHF',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(ibCHFsCHFStacked),
			tokenStakedUSD: Number(ibCHFsCHFStacked) * Number(ibCHFsCHFPrice),
			unclaimedRewards: Number(ibCHFsCHFEarned),
			unclaimedRewardsUSD: (
				Number(format.units(ibCHFsCHFEarned, 18)) * Number(crvPrice)
				+
				Number(format.units(ibCHFsCHFExtra1Earned, 18)) * Number(kp3rPrice)
				+
				Number(format.units(ibCHFsCHFExtra2Earned, 18)) * Number(cvxPrice)
				+
				Number(format.units(ibCHFsCHFEarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// ibEUR+sEUR
		const	ibEURsEURStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	ibEURsEUREarned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibEURsEURExtra1Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibEURsEURExtra2Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibEURsEURPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'ibEUR + sEUR',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(ibEURsEURStacked),
			tokenStakedUSD: Number(ibEURsEURStacked) * Number(ibEURsEURPrice),
			unclaimedRewards: Number(ibEURsEUREarned),
			unclaimedRewardsUSD: (
				Number(format.units(ibEURsEUREarned, 18)) * Number(crvPrice)
				+
				Number(format.units(ibEURsEURExtra1Earned, 18)) * Number(kp3rPrice)
				+
				Number(format.units(ibEURsEURExtra2Earned, 18)) * Number(cvxPrice)
				+
				Number(format.units(ibEURsEUREarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// ibGBP+sGBP
		const	ibGBPsGBPStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	ibGBPsGBPEarned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibGBPsGBPExtra1Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibGBPsGBPExtra2Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibGBPsGBPPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'ibGBP + sGBP',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(ibGBPsGBPStacked),
			tokenStakedUSD: Number(ibGBPsGBPStacked) * Number(ibGBPsGBPPrice),
			unclaimedRewards: Number(ibGBPsGBPEarned),
			unclaimedRewardsUSD: (
				Number(format.units(ibGBPsGBPEarned, 18)) * Number(crvPrice)
				+
				Number(format.units(ibGBPsGBPExtra1Earned, 18)) * Number(kp3rPrice)
				+
				Number(format.units(ibGBPsGBPExtra2Earned, 18)) * Number(cvxPrice)
				+
				Number(format.units(ibGBPsGBPEarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// ibJPY+sJPY
		const	ibJPYsJPYStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	ibJPYsJPYEarned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibJPYsJPYExtra1Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibJPYsJPYExtra2Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibJPYsJPYPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'ibJPY + sJPY',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(ibJPYsJPYStacked),
			tokenStakedUSD: Number(ibJPYsJPYStacked) * Number(ibJPYsJPYPrice),
			unclaimedRewards: Number(ibJPYsJPYEarned),
			unclaimedRewardsUSD: (
				Number(format.units(ibJPYsJPYEarned, 18)) * Number(crvPrice)
				+
				Number(format.units(ibJPYsJPYExtra1Earned, 18)) * Number(kp3rPrice)
				+
				Number(format.units(ibJPYsJPYExtra2Earned, 18)) * Number(cvxPrice)
				+
				Number(format.units(ibJPYsJPYEarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// ibKRW+sKRW
		const	ibKRWsKRWStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	ibKRWsKRWEarned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibKRWsKRWExtra1Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibKRWsKRWExtra2Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	ibKRWsKRWPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'ibKRW + sKRW',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(ibKRWsKRWStacked),
			tokenStakedUSD: Number(ibKRWsKRWStacked) * Number(ibKRWsKRWPrice),
			unclaimedRewards: Number(ibKRWsKRWEarned),
			unclaimedRewardsUSD: (
				Number(format.units(ibKRWsKRWEarned, 18)) * Number(crvPrice)
				+
				Number(format.units(ibKRWsKRWExtra1Earned, 18)) * Number(kp3rPrice)
				+
				Number(format.units(ibKRWsKRWExtra2Earned, 18)) * Number(cvxPrice)
				+
				Number(format.units(ibKRWsKRWEarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// cvxCRV+CRV
		const	cvxCRVCRVStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		const	cvxCRVCRVEarned = resultsJobsCall[rIndex++] as BigNumber;
		const	cvxCRVCRVExtra1Earned = resultsJobsCall[rIndex++] as BigNumber;
		const	cvxCRVCRVPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'cvxCRV + CRV',
			protocol: 'Convex',
			rewards: 'CVX',
			tokenStaked: Number(cvxCRVCRVStacked),
			tokenStakedUSD: Number(cvxCRVCRVStacked) * Number(cvxCRVCRVPrice),
			unclaimedRewards: Number(cvxCRVCRVEarned),
			unclaimedRewardsUSD: (
				Number(format.units(cvxCRVCRVEarned, 18)) * Number(crvPrice)
				+
				Number(format.units(cvxCRVCRVExtra1Earned, 18)) * Number(threeCRVPrice)
				+
				Number(format.units(cvxCRVCRVEarned.mul(reduction).div(cvxTotalCliffs), 18)) * Number(cvxPrice)
			)
		});

		// yvEth //
		const	yvEthStacked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		rIndex++; // const	pricePerShare = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		rIndex++; // const	ethPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
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

		//Locked CRV
		const	crvLocked = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		console.log(crvLocked.toString());
		const	crvLockedExtraEarned = claimable;
		// const	pricePerShare = format.units(resultsJobsCall[rIndex++] as BigNumber, 18);
		// const	ethPrice = format.units(resultsJobsCall[rIndex++] as BigNumber, 6);
		_treasury.push({
			name: 'Locked CRV',
			protocol: 'Curve',
			rewards: '3CRV',
			tokenStaked: Number(crvLocked),
			tokenStakedUSD: Number(crvLocked) * Number(crvPrice),
			unclaimedRewards: Number(format.units(crvLockedExtraEarned, 18)),
			unclaimedRewardsUSD: (
				Number(format.units(crvLockedExtraEarned, 18)) * Number(threeCRVPrice)
			)
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

