import	React, {ReactElement}					from	'react';
import	{BigNumber, ethers}						from	'ethers';
import	{Button}								from	'@yearn/web-lib/components';
import	{useWeb3}								from	'@yearn/web-lib/contexts';
import	{format, Transaction, defaultTxStatus}	from	'@yearn/web-lib/utils';
import	useJob									from	'contexts/useJob';
import	usePairs								from	'contexts/usePairs';
import	Input									from	'components/Input';
import	Line									from	'components/Line';
import	TokenPairDropdown						from	'components/TokenPairDropdown';
import	{unbondLiquidityFromJob}				from	'utils/actions/unbondLiquidityFromJob';
import	{withdrawLiquidityFromJob}				from	'utils/actions/withdrawLiquidityFromJob';
import	{burn, simulateBurn}					from	'utils/actions/burn';

function	PanelUnbondTokens(): ReactElement {
	const	{provider, address, isActive} = useWeb3();
	const	{pairs, getPairs} = usePairs();
	const	{jobStatus, getJobStatus} = useJob();
	const	[amountLpToken, set_amountLpToken] = React.useState('');
	const	[pair, set_pair] = React.useState(pairs[process.env.KLP_KP3R_WETH_ADDR as string]);
	const	[txStatusUnbond, set_txStatusUnbond] = React.useState(defaultTxStatus);

	React.useEffect((): void => {
		set_pair(pairs[process.env.KLP_KP3R_WETH_ADDR as string]);
	}, [pairs]);

	async function	onUnbondLiquidityFromJob(pairAddress: string, amount: BigNumber): Promise<void> {
		if (!isActive || txStatusUnbond.pending)
			return;
		new Transaction(provider, unbondLiquidityFromJob, set_txStatusUnbond)
			.populate(jobStatus.address, pairAddress, amount)
			.onSuccess(async (): Promise<void> => {
				await Promise.all([getJobStatus(), getPairs()]);
			})
			.perform();
	}

	function	renderUnbondButton(): ReactElement {
		const	isAmountOverflow = (amountLpToken !== '' && (!Number(amountLpToken) || Number(amountLpToken) > Number(format.units(jobStatus?.liquidityAmount || 0, 18))));

		return (
			<Button
				onClick={(): void => {
					onUnbondLiquidityFromJob(
						pair.addressOfPair,
						format.toSafeAmount(amountLpToken, jobStatus?.liquidityAmount)
					);
				}}
				isBusy={txStatusUnbond.pending}
				isDisabled={
					!isActive
					|| isAmountOverflow
					|| ethers.utils.parseUnits(amountLpToken || '0', 18).isZero()
					|| jobStatus.jobOwner !== address
				}>
				{txStatusUnbond.error ? 'Transaction failed' : txStatusUnbond.success ? 'Transaction successful' : 'Unbond'}
			</Button>
		);
	}

	return (
		<div aria-label={'Unbond'} className={'flex flex-col mb-10'}>
			<b className={'text-lg'}>{'Unbond'}</b>
			<div className={'mt-8 space-y-6'}>
				<div>
					<div className={'grid grid-cols-1 gap-4 mb-4 md:grid-cols-2'}>
						<div className={'space-y-2'}>
							<TokenPairDropdown name={'kLP-KP3R/WETH'} />
						</div>
						<Input.BigNumber
							label={''}
							value={amountLpToken}
							onSetValue={(s: string): void => set_amountLpToken(s)}
							maxValue={jobStatus?.liquidityAmount || 0}
							decimals={18} />
					</div>
					<div className={'mb-6 space-y-2'}>
						<b>
							{jobStatus.canWithdraw ? 'Pending unbond' : `Pending unbond (${jobStatus.canWithdrawIn})`}
						</b>
						<dl className={'space-y-2 w-full'}>
							<div className={'flex overflow-hidden relative flex-row justify-between items-center w-full'}>
								<dt className={'pr-2 text-black-1 whitespace-nowrap bg-white'}>{'kLP-KP3R/WETH'}</dt>
								<dd className={'w-full font-bold'}>
									<div className={'absolute bottom-1.5 w-full'}>
										<Line />
									</div>
									<div className={'flex justify-end'}>
										<p className={'z-10 pl-1 text-right text-black-1 bg-white'}>
											{format.toNormalizedAmount(jobStatus?.pendingUnbonds || 0, 18)}
										</p>
									</div>
								</dd>
							</div>
						</dl>
					</div>
					<div>
						{renderUnbondButton()}
					</div>
				</div>
			</div>
		</div>
	);
}

function	SectionActionsWithdrawLiquidity(): ReactElement {
	const	{provider, address, isActive} = useWeb3();
	const	{pairs, getPairs} = usePairs();
	const	{jobStatus, getJobStatus} = useJob();
	const	[amountLpToken, set_amountLpToken] = React.useState('');
	const	[expectedUnderlyingAmount, set_expectedUnderlyingAmount] = React.useState({
		token1: ethers.constants.Zero,
		token2: ethers.constants.Zero
	});
	const	[pair, set_pair] = React.useState(pairs[process.env.KLP_KP3R_WETH_ADDR as string]);
	const	[txStatus, set_txStatus] = React.useState(defaultTxStatus);
	const	[txStatusBurn, set_txStatusBurn] = React.useState(defaultTxStatus);

	React.useEffect((): void => {
		set_pair(pairs[process.env.KLP_KP3R_WETH_ADDR as string]);
	}, [pairs]);

	React.useEffect((): void => {
		if (provider) {
			simulateBurn(
				provider as ethers.providers.Web3Provider,
				pair.addressOfPair,
				format.toSafeAmount(amountLpToken, pair.balanceOfPair)
			).then((result): void => {
				set_expectedUnderlyingAmount({
					token1: result[0],
					token2: result[1]
				});
			});
		}
	}, [pair.addressOfPair, pair.balanceOfPair, provider, amountLpToken]);

	async function	onWithdrawLiquidityFromJob(pairAddress: string): Promise<void> {
		if (!isActive || txStatus.pending)
			return;
		new Transaction(provider, withdrawLiquidityFromJob, set_txStatus)
			.populate(jobStatus.address, pairAddress)
			.onSuccess(async (): Promise<void> => {
				await Promise.all([getJobStatus(), getPairs()]);
			})
			.perform();
	}
	function	renderWithdrawButton(): ReactElement {
		return (
			<Button
				onClick={(): void => {
					onWithdrawLiquidityFromJob(pair.addressOfPair);
				}}
				isBusy={txStatus.pending}
				isDisabled={
					!isActive
					|| !jobStatus.canWithdraw
					|| jobStatus.pendingUnbonds.isZero()
					|| jobStatus.jobOwner !== address
				}>
				{txStatus.error ? 'Transaction failed' : txStatus.success ? 'Transaction successful' : jobStatus.canWithdraw ? 'Withdraw' : `Withdraw (${jobStatus.canWithdrawIn})`}
			</Button>
		);
	}

	async function	onBurn(pairAddress: string, amount: BigNumber): Promise<void> {
		if (!isActive || txStatusBurn.pending)
			return;
		new Transaction(provider, burn, set_txStatusBurn)
			.populate(pairAddress, amount)
			.onSuccess(async (): Promise<void> => {
				await Promise.all([getJobStatus(), getPairs()]);
				set_amountLpToken('');
			})
			.perform();
	}
	function	renderBurnButton(): ReactElement {
		return (
			<Button
				onClick={(): void => {
					onBurn(pair.addressOfPair, format.toSafeAmount(amountLpToken, pair.balanceOfPair));
				}}
				isBusy={txStatusBurn.pending}
				isDisabled={
					!isActive
					|| ethers.utils.parseUnits(amountLpToken || '0', 18).isZero()
					|| jobStatus.jobOwner !== address
				}>
				{txStatusBurn.error ? 'Transaction failed' : txStatusBurn.success ? 'Transaction successful' : 'Burn'}
			</Button>
		);
	}

	return (
		<div aria-label={'Withdraw and Burn'} className={'flex flex-col'}>
			<b className={'text-lg'}>{'Withdraw and Burn'}</b>
			<div className={'mt-8 space-y-6'}>
				<div>
					<div className={'grid grid-cols-1 gap-4 mb-4 md:grid-cols-2'}>
						<div className={'space-y-2'}>
							<TokenPairDropdown name={'kLP-KP3R/WETH'} />
						</div>
						<Input.BigNumber
							label={''}
							value={amountLpToken}
							onSetValue={(s: string): void => set_amountLpToken(s)}
							maxValue={pair?.balanceOfPair || 0}
							decimals={18} />
					</div>
					<div className={'mb-6 space-y-2'}>
						<b>{'You will receive'}</b>
						<dl className={'space-y-2 w-full'}>
							<div className={'flex overflow-hidden relative flex-row justify-between items-center w-full'}>
								<dt className={'pr-2 text-black-1 whitespace-nowrap bg-white'}>{'KP3R'}</dt>
								<dd className={'w-full font-bold'}>
									<div className={'absolute bottom-1.5 w-full'}>
										<Line />
									</div>
									<div className={'flex justify-end'}>
										<p className={'z-10 pl-1 text-right text-black-1 bg-white'}>
											{format.toNormalizedAmount(expectedUnderlyingAmount?.token1 || 0, 18)}
										</p>
									</div>
								</dd>
							</div>

							<div className={'flex overflow-hidden relative flex-row justify-between items-center w-full'}>
								<dt className={'pr-2 text-black-1 whitespace-nowrap bg-white'}>{'wETH'}</dt>
								<dd className={'w-full font-bold'}>
									<div className={'absolute bottom-1.5 w-full'}>
										<Line />
									</div>
									<div className={'flex justify-end'}>
										<p className={'z-10 pl-1 text-right text-black-1 bg-white'}>
											{format.toNormalizedAmount(expectedUnderlyingAmount?.token2 || 0, 18)}
										</p>
									</div>
								</dd>
							</div>
						</dl>
					</div>
					<div className={'grid grid-cols-2 gap-4'}>
						{renderWithdrawButton()}
						{renderBurnButton()}
					</div>
				</div>
			</div>
		</div>
	);
}

function	Wrapper(): ReactElement {
	return (
		<div className={'flex flex-col p-6'}>
			<section aria-label={'WITHDRAW LIQUIDITY'}>
				<PanelUnbondTokens />
				<SectionActionsWithdrawLiquidity />
			</section>
		</div>
	);
}

export default Wrapper;