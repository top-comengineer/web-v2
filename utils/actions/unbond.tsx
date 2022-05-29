import	{ContractInterface, ethers} from	'ethers';
import	KEEP3RV2_ABI				from	'utils/abi/keep3rv2.abi';

export async function	unbond(
	provider: ethers.providers.Web3Provider,
	tokenBondedAddress: string,
	amountBonded: ethers.BigNumber
): Promise<boolean> {
	const	signer = provider.getSigner();

	try {
		const	contract = new ethers.Contract(
			process.env.KEEP3R_V2_ADDR as string,
			KEEP3RV2_ABI as ContractInterface,
			signer
		);
		const	transaction = await contract.unbond(tokenBondedAddress, amountBonded);
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