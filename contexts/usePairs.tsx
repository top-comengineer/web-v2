import	React, {ReactElement, useContext, createContext}		from	'react';
import	{Contract}												from	'ethcall';
import	{request}												from	'graphql-request';
import	{useWeb3}												from	'@yearn-finance/web-lib/contexts';
import	{toAddress, providers, performBatchedUpdates, format}	from	'@yearn-finance/web-lib/utils';
import	KEEP3RV1_ABI											from	'utils/abi/keep3rv1.abi';
import	UNI_V3_PAIR_ABI											from	'utils/abi/univ3Pair.abi';
import 	{BigNumber, ethers}										from	'ethers';
import type * as TPairsTypes									from	'contexts/usePairs.d';

const	defaultProps = {
	pairs: {
		[toAddress(process.env.KLP_KP3R_WETH_ADDR as string)]: {
			addressOfUni: toAddress(process.env.UNI_KP3R_WETH_ADDR as string),
			addressOfPair: toAddress(process.env.KLP_KP3R_WETH_ADDR as string),
			nameOfPair: 'kLP-KP3R/WETH',
			balanceOfPair: ethers.constants.Zero,
			allowanceOfPair: ethers.constants.Zero,
			addressOfToken1: toAddress(process.env.KP3R_TOKEN_ADDR as string),
			nameOfToken1: 'KP3R',
			balanceOfToken1: ethers.constants.Zero,
			allowanceOfToken1: ethers.constants.Zero,
			addressOfToken2: toAddress(process.env.WETH_TOKEN_ADDR as string),
			nameOfToken2: 'WETH',
			balanceOfToken2: ethers.constants.Zero,
			allowanceOfToken2: ethers.constants.Zero,
			priceOfToken1: 0,
			priceOfToken2: 0,
			position: {
				liquidity: ethers.constants.Zero,
				tokensOwed0: ethers.constants.Zero,
				tokensOwed1: ethers.constants.Zero
			}
		}
	},
	getPairs: async (): Promise<void> => undefined
};
const	Pairs = createContext<TPairsTypes.TPairsContext>(defaultProps);
export const PairsContextApp = ({children}: {children: ReactElement}): ReactElement => {
	const	{provider, isActive, address} = useWeb3();
	const	[pairs, set_pairs] = React.useState<TPairsTypes.TKeeperPairs>(defaultProps.pairs);
	const	[, set_nonce] = React.useState(0);

	/* 📰 - Keep3r *************************************************************
	**	Keeper is working with a bunch of approved pairs. Right now, only one
	**	pair is activated, the KEEP3R - WETH pair. We need to get a bunch of
	**	data to correctly display and enable the actions for the user.
	***************************************************************************/
	const getPairs = React.useCallback(async (): Promise<void> => {
		if (!provider || !isActive)
			return;
		const	ethcallProvider = await providers.newEthCallProvider(provider);
		for (const pair of Object.values(defaultProps.pairs)) {
			const	token1Contract = new Contract(pair.addressOfToken1 as string, KEEP3RV1_ABI);
			const	token2Contract = new Contract(pair.addressOfToken2, KEEP3RV1_ABI);
			const	pairContract = new Contract(pair.addressOfPair as string, UNI_V3_PAIR_ABI);	
			const	calls = [
				token2Contract.balanceOf(address),
				token2Contract.allowance(address, pair.addressOfPair),
				token1Contract.balanceOf(address),
				token1Contract.allowance(address, pair.addressOfPair),
				pairContract.balanceOf(address),
				pairContract.allowance(address, process.env.KEEP3R_V2_ADDR as string),
				pairContract.position()
			];
			const	[results, {pool}] = await Promise.all([
				ethcallProvider.tryAll(calls),
				request('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3', `{
					pool(id: "${pair.addressOfUni.toLowerCase()}"){
						token0Price
						token1Price
					}
				}`)
			]);

			performBatchedUpdates((): void => {
				const	[
					balanceOfToken2, allowanceOfToken2,
					balanceOfToken1, allowanceOfToken1,
					balanceOfPair, allowanceOfPair,
					position 
				] = results;
				const	liquidity = (position as {liquidity: BigNumber}).liquidity;
				const	tokensOwed0 = (position as {tokensOwed0: BigNumber}).tokensOwed0;
				const	tokensOwed1 = (position as {tokensOwed1: BigNumber}).tokensOwed1;
				const	_pair = {
					addressOfUni: toAddress(pair.addressOfUni),
					addressOfPair: toAddress(pair.addressOfPair),
					nameOfPair: 'kLP-KP3R/WETH',
					balanceOfPair: format.BN(balanceOfPair as BigNumber),
					allowanceOfPair: format.BN(allowanceOfPair as BigNumber),
					addressOfToken1: toAddress(pair.addressOfToken1),
					nameOfToken1: 'KP3R',
					balanceOfToken1: format.BN(balanceOfToken1 as BigNumber),
					allowanceOfToken1: format.BN(allowanceOfToken1 as BigNumber),
					addressOfToken2: toAddress(pair.addressOfToken2),
					nameOfToken2: 'WETH',
					balanceOfToken2: format.BN(balanceOfToken2 as BigNumber),
					allowanceOfToken2: format.BN(allowanceOfToken2 as BigNumber),
					priceOfToken1: pool.token0Price,
					priceOfToken2: pool.token1Price,
					position: {
						liquidity: format.BN(liquidity as BigNumber),
						tokensOwed0: format.BN(tokensOwed0 as BigNumber),
						tokensOwed1: format.BN(tokensOwed1 as BigNumber)
					}
				};
				set_pairs((o: TPairsTypes.TKeeperPairs): TPairsTypes.TKeeperPairs => ({
					...o,
					[pair.addressOfPair]: _pair
				}));
				set_nonce((n: number): number => n + 1);
			});
		}
	}, [address, provider, isActive]);
	React.useEffect((): void => {
		getPairs();
	}, [getPairs]);

	/* 📰 - Keep3r *************************************************************
	**	Setup and render the Context provider to use in the app.
	***************************************************************************/
	return (
		<Pairs.Provider value={{pairs, getPairs}}>
			{children}
		</Pairs.Provider>
	);
};

export const usePairs = (): TPairsTypes.TPairsContext => useContext(Pairs);
export default usePairs;
