import	{ContractInterface, ethers} from	'ethers';
import	{providers}					from	'@yearn-finance/web-lib/utils';
import	UNI_V3_PAIR_ABI				from	'utils/abi/univ3Pair.abi';

export async function	simulateBurn(
	provider: ethers.providers.Web3Provider,
	pair: string,
	liquidity: ethers.BigNumber
): Promise<[ethers.BigNumber, ethers.BigNumber]> {
	const	signer = provider.getSigner();
	const	address = await signer.getAddress();

	try {
		const	contract = new ethers.Contract(
			pair,
			UNI_V3_PAIR_ABI as ContractInterface,
			providers.getProvider(1)
		);
		try {
			const	simulation = await contract.callStatic.burn(
				liquidity, //liquidity
				ethers.constants.Zero, //amount0Min
				ethers.constants.Zero, //amount1Min
				address, //to
				{from: address}
			);
			const	amount0Min = Number(ethers.utils.formatUnits(simulation.amount0, 18));
			const	amount1Min = Number(ethers.utils.formatUnits(simulation.amount1, 18));
			return ([
				ethers.utils.parseUnits((amount0Min - (amount0Min * 0.99)).toFixed(18), 18),
				ethers.utils.parseUnits((amount1Min - (amount1Min * 0.99)).toFixed(18), 18)

			]);
		} catch (error) {
			return ([ethers.constants.Zero, ethers.constants.Zero]);
		}
	
	} catch(error) {
		return ([ethers.constants.Zero, ethers.constants.Zero]);
	}
}

export async function	burn(
	provider: ethers.providers.Web3Provider,
	pair: string,
	liquidity: ethers.BigNumber
): Promise<boolean> {
	const	signer = provider.getSigner();
	const	address = await signer.getAddress();

	try {
		const	contract = new ethers.Contract(
			pair,
			UNI_V3_PAIR_ABI as ContractInterface,
			signer
		);
		const	simulation = await contract.callStatic.burn(
			liquidity, //liquidity
			ethers.constants.Zero, //amount0Min
			ethers.constants.Zero, //amount1Min
			address //to
		);

		const	amount0Min = Number(ethers.utils.formatUnits(simulation.amount0, 18));
		const	amount1Min = Number(ethers.utils.formatUnits(simulation.amount1, 18));
		const	transaction = await contract.burn(
			liquidity, //liquidity
			ethers.utils.parseUnits((amount0Min - (amount0Min * 0.99)).toFixed(18), 18),
			ethers.utils.parseUnits((amount1Min - (amount1Min * 0.99)).toFixed(18), 18),
			address //to
		);

		const	transactionResult = await transaction.wait();
		if (transactionResult.status === 0) {
			console.error('Fail to perform transaction');
			return false;
		}

		return true;
	} catch(error) {
		console.error(error);
		return false;
	}
}
