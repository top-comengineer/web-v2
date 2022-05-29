import	{ContractInterface, ethers} from	'ethers';
import	KEEP3RV2_ABI				from	'utils/abi/keep3rv2.abi';

export async function	unbondLiquidityFromJob(
	provider: ethers.providers.Web3Provider,
	jobAddress: string,
	liquidityTokenAddress: string,
	liquidityAmount: ethers.BigNumber
): Promise<boolean> {
	const	signer = provider.getSigner();

	try {
		const	contract = new ethers.Contract(
			process.env.KEEP3R_V2_ADDR as string,
			KEEP3RV2_ABI as ContractInterface,
			signer
		);
		const	transaction = await contract.unbondLiquidityFromJob(
			jobAddress,
			liquidityTokenAddress,
			liquidityAmount
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
