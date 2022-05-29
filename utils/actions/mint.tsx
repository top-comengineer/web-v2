import	{ContractInterface, ethers} from	'ethers';
import	UNI_V3_PAIR_ABI				from	'utils/abi/univ3Pair.abi';

export async function	mint(
	provider: ethers.providers.Web3Provider,
	pair: string,
	amountToken1: ethers.BigNumber,
	amountToken2: ethers.BigNumber
): Promise<boolean> {
	const	signer = provider.getSigner();
	const	address = await signer.getAddress();

	try {
		const	contract = new ethers.Contract(
			pair,
			UNI_V3_PAIR_ABI as ContractInterface,
			signer
		);
		const	amountToken1String = Number(ethers.utils.formatUnits(amountToken1, 18));
		const	amountToken2String = Number(ethers.utils.formatUnits(amountToken2, 18));
		const	transaction = await contract.mint(
			amountToken1, //amount0Desired
			amountToken2, //amount1Desired
			ethers.utils.parseUnits((amountToken1String - (amountToken1String * 0.99)).toFixed(18), 18),
			ethers.utils.parseUnits((amountToken2String - (amountToken2String * 0.99)).toFixed(18), 18),
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
