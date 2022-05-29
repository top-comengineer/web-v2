import 	{BigNumber}		from	'ethers';

export type	TKeeperPair = {
	addressOfUni: string,
	addressOfPair: string,
	nameOfPair: string,
	balanceOfPair: BigNumber,
	allowanceOfPair: BigNumber,
	nameOfToken1: string,
	addressOfToken1: string,
	balanceOfToken1: BigNumber,
	allowanceOfToken1: BigNumber,
	nameOfToken2: string,
	addressOfToken2: string
	balanceOfToken2: BigNumber,
	allowanceOfToken2: BigNumber,
	priceOfToken1: number,
	priceOfToken2: number,
	position: {
		liquidity: BigNumber,
		tokensOwed0: BigNumber,
		tokensOwed1: BigNumber
	}
}
export type	TKeeperPairs = {
	[key: string]: TKeeperPair
}

export type	TPairsContext = {
	pairs: TKeeperPairs,
	getPairs: () => Promise<void>,
}