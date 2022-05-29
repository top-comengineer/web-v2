import	React, {ReactElement}					from	'react';
import	{BigNumber, ethers}						from	'ethers';
import	{Button}								from	'@yearn/web-lib/components';
import	{useWeb3}								from	'@yearn/web-lib/contexts';
import	{format, performBatchedUpdates,
	Transaction, defaultTxStatus}				from	'@yearn/web-lib/utils';
import	usePairs								from	'contexts/usePairs';
import	useJob									from	'contexts/useJob';
import	Input									from	'components/Input';
import	TokenPairDropdown						from	'components/TokenPairDropdown';
import	{approveERC20}							from	'utils/actions/approveToken';
import	{addLiquidityToJob}						from	'utils/actions/addLiquidityToJob';
import	{mint}									from	'utils/actions/mint';

function	PanelMintTokens(): ReactElement {
	const	{provider, isActive} = useWeb3();
	const	{pairs, getPairs} = usePairs();
	const	[amountToken1, set_amountToken1] = React.useState('');
	const	[amountToken2, set_amountToken2] = React.useState('');
	const	[pair, set_pair] = React.useState(pairs[process.env.KLP_KP3R_WETH_ADDR as string]);
	const	[txStatusApproveToken1, set_txStatusApproveToken1] = React.useState(defaultTxStatus);
	const	[txStatusApproveToken2, set_txStatusApproveToken2] = React.useState(defaultTxStatus);
	const	[txStatusMint, set_txStatusMint] = React.useState(defaultTxStatus);

	React.useEffect((): void => {
		set_pair(pairs[process.env.KLP_KP3R_WETH_ADDR as string]);
	}, [pairs]);

	async function	onApproveToken1(token: string, spender: string, amount: BigNumber): Promise<void> {
		if (!isActive || txStatusApproveToken1.pending)
			return;
		new Transaction(provider, approveERC20, set_txStatusApproveToken1)
			.populate(token, spender, amount)
			.onSuccess(async (): Promise<void> => {
				await getPairs();
			})
			.perform();
	}

	async function	onApproveToken2(token: string, spender: string, amount: BigNumber): Promise<void> {
		if (!isActive || txStatusApproveToken2.pending)
			return;
		new Transaction(provider, approveERC20, set_txStatusApproveToken2)
			.populate(token, spender, amount)
			.onSuccess(async (): Promise<void> => {
				await getPairs();
			})
			.perform();
	}

	async function	onMint(pairAddress: string, amount1: BigNumber, amount2: BigNumber): Promise<void> {
		if (!isActive || txStatusMint.pending)
			return;
		new Transaction(provider, mint, set_txStatusMint)
			.populate(pairAddress, amount1, amount2)
			.onSuccess(async (): Promise<void> => {
				await getPairs();
				performBatchedUpdates((): void => {
					set_amountToken1('');
					set_amountToken2('');
				});
			})
			.perform();
	}

	function	renderApproveOrMintButton(): ReactElement {
		const	allowance1 = ethers.utils.formatUnits(pair?.allowanceOfToken1 || 0, 18);
		const	allowance2 = ethers.utils.formatUnits(pair?.allowanceOfToken2 || 0, 18);
		const	isAmountOverflow = (
			!Number(amountToken1) || !Number(amountToken2)
			|| Number(amountToken1) > Number(format.units(pair?.balanceOfToken1 || 0, 18))
			|| Number(amountToken2) > Number(format.units(pair?.balanceOfToken2 || 0, 18))
		);

		if (Number(allowance1) < Number(amountToken1)) {
			return (
				<Button
					onClick={(): void => {
						onApproveToken1(
							pair.addressOfToken1,
							pair.addressOfPair,
							format.toSafeAmount(amountToken1, pair.balanceOfToken1)
						);
					}}
					isBusy={txStatusApproveToken1.pending}
					isDisabled={!isActive || isAmountOverflow}>
					{txStatusApproveToken1.error ? 'Transaction failed' : txStatusApproveToken1.success ? 'Transaction successful' : `Approve ${pair?.nameOfToken1 || ''}`}
				</Button>
			);
		} else if (Number(allowance2) < Number(amountToken2)) {
			return (
				<Button
					onClick={(): void => {
						onApproveToken2(
							pair.addressOfToken2,
							pair.addressOfPair,
							format.toSafeAmount(amountToken2, pair.balanceOfToken2)
						);
					}}
					isBusy={txStatusApproveToken2.pending}
					isDisabled={!isActive || isAmountOverflow}>
					{txStatusApproveToken2.error ? 'Transaction failed' : txStatusApproveToken2.success ? 'Transaction successful' : `Approve ${pair?.nameOfToken2 || ''}`}
				</Button>
			);
		}
		return (
			<Button
				onClick={(): void => {
					onMint(
						pair.addressOfPair,
						format.toSafeAmount(amountToken1, pair.balanceOfToken1),
						format.toSafeAmount(amountToken2, pair.balanceOfToken2)
					);
				}}
				isBusy={txStatusMint.pending}
				isDisabled={!isActive || isAmountOverflow}>
				{txStatusMint.error ? 'Transaction failed' : txStatusMint.success ? 'Transaction successful' : 'Mint'}
			</Button>
		);
	}

	return (
		<div aria-label={'Mint tokens (Optional)'} className={'flex flex-col'}>
			<b className={'text-lg'}>{'Mint tokens (Optional)'}</b>
			<div className={'mt-8 mb-10 space-y-6'}>
				<TokenPairDropdown name={'kLP-KP3R/WETH'} />
				<div>
					<div className={'grid grid-cols-1 gap-4 mb-4 md:grid-cols-2'}>
						<Input.BigNumber
							label={'KP3R'}
							value={amountToken1}
							onSetValue={(s: string): void => set_amountToken1(s)}
							onValueChange={(s: string): void => set_amountToken2(s === '' ? '' : (Number(s) * pair.priceOfToken2).toString())}
							maxValue={pair?.balanceOfToken1 || 0}
							decimals={18} />
						<Input.BigNumber
							label={'WETH'}
							value={amountToken2}
							onSetValue={(s: string): void => set_amountToken2(s)}
							onValueChange={(s: string): void => set_amountToken1(s === '' ? '' : (Number(s) * pair.priceOfToken1).toString())}
							maxValue={pair?.balanceOfToken2 || 0}
							decimals={18} />
					</div>
					<div>
						{renderApproveOrMintButton()}
					</div>
				</div>
			</div>
		</div>
	);
}

function	SectionActionsAddLiquidity(): ReactElement {
	const	{provider, isActive} = useWeb3();
	const	{pairs, getPairs} = usePairs();
	const	{jobStatus, getJobStatus} = useJob();
	const	[amountLpToken, set_amountLpToken] = React.useState('');
	const	[pair, set_pair] = React.useState(pairs[process.env.KLP_KP3R_WETH_ADDR as string]);
	const	[txStatusAddLiquidity, set_txStatusAddLiquidity] = React.useState(defaultTxStatus);
	const	[txStatusApprove, set_txStatusApprove] = React.useState(defaultTxStatus);

	React.useEffect((): void => {
		set_pair(pairs[process.env.KLP_KP3R_WETH_ADDR as string]);
	}, [pairs]);

	async function	onApprove(token: string, spender: string, amount: BigNumber): Promise<void> {
		if (!isActive || txStatusApprove.pending)
			return;
		new Transaction(provider, approveERC20, set_txStatusApprove)
			.populate(token, spender, amount)
			.onSuccess(async (): Promise<void> => {
				await getPairs();
			})
			.perform();
	}

	async function	onAddLiquidityToJob(pairAddress: string, amount: BigNumber): Promise<void> {
		if (!isActive || txStatusAddLiquidity.pending)
			return;
		new Transaction(provider, addLiquidityToJob, set_txStatusAddLiquidity)
			.populate(jobStatus.address, pairAddress, amount)
			.onSuccess(async (): Promise<void> => {
				await Promise.all([getJobStatus(), getPairs()]);
			})
			.perform();
	}

	function	renderApproveOrAddLiquidityButton(): ReactElement {
		const	allowancePair = ethers.utils.formatUnits(pair?.allowanceOfPair || 0, 18);
		const	isAmountOverflow = (
			amountLpToken !== '' && (
				!Number(amountLpToken)
				|| Number(amountLpToken) > Number(format.units(pair?.balanceOfPair || 0, 18))
			)
		);

		if (Number(allowancePair) < Number(amountLpToken)) {
			return (
				<Button
					onClick={(): void => {
						onApprove(
							pair.addressOfPair,
							process.env.KEEP3R_V2_ADDR as string,
							format.toSafeAmount(amountLpToken, pair.balanceOfToken1)
						);
					}}
					isBusy={txStatusApprove.pending}
					isDisabled={!isActive || isAmountOverflow}>
					{txStatusApprove.error ? 'Transaction failed' : txStatusApprove.success ? 'Transaction successful' : 'Approve liquidity'}
				</Button>
			);
		}
		return (
			<Button
				onClick={(): void => {
					onAddLiquidityToJob(
						pair.addressOfPair,
						format.toSafeAmount(amountLpToken, pair.balanceOfPair)
					);
				}}
				isBusy={txStatusAddLiquidity.pending}
				isDisabled={
					!isActive
					|| !Number(amountLpToken)
					|| Number(amountLpToken) > Number(format.units(pair?.balanceOfPair || 0, 18))
				}>
				{txStatusAddLiquidity.error ? 'Transaction failed' : txStatusAddLiquidity.success ? 'Transaction successful' : 'Add liquidity to job'}
			</Button>
		);
	}

	return (
		<div aria-label={'Add liquidity'} className={'flex flex-col'}>
			<b className={'text-lg'}>{'Add liquidity'}</b>
			<div className={'mt-8 space-y-6'}>
				<div>
					<div className={'grid grid-cols-1 gap-4 mb-4 md:grid-cols-2'}>
						<div className={'space-y-2'}>
							<TokenPairDropdown name={'kLP-KP3R/WETH'} />
						</div>
						<Input.BigNumber
							value={amountLpToken}
							onSetValue={(s: string): void => set_amountLpToken(s)}
							maxValue={pair?.balanceOfPair || 0}
							decimals={18} />
					</div>
					<div>
						{renderApproveOrAddLiquidityButton()}
					</div>
				</div>
			</div>
		</div>
	);
}

function	Wrapper(): ReactElement {
	return (
		<div className={'flex flex-col p-6'}>
			<section aria-label={'ADD LIQUIDITY'}>
				<PanelMintTokens />
				<SectionActionsAddLiquidity />
			</section>
		</div>
	);
}

export default Wrapper;