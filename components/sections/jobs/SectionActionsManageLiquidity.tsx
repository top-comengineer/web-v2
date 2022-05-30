import	React, {ReactElement}					from	'react';
import	{ethers}								from	'ethers';
import	{Contract}								from	'ethcall';
import	{Button}								from	'@yearn/web-lib/components';
import	{useWeb3}								from	'@yearn/web-lib/contexts';
import	{isZeroAddress, providers, format,
	performBatchedUpdates, Transaction,
	defaultTxStatus}							from	'@yearn/web-lib/utils';
import	Input									from	'components/Input';
import	TokenDropdown							from	'components/TokenDropdown';
import	useKeep3r								from	'contexts/useKeep3r';
import	useJob									from	'contexts/useJob';
import	{approveERC20}							from	'utils/actions/approveToken';
import	{addTokenCreditsToJob}					from	'utils/actions/addTokenCreditsToJob';
import	{withdrawTokenCreditsFromJob}			from	'utils/actions/withdrawTokenCreditsFromJob';
import	ERC20_ABI								from	'utils/abi/keep3rv1.abi';
import	KEEP3RV2_ABI							from	'utils/abi/keep3rv2.abi';

function	SectionAddToken(): ReactElement {
	const	{provider, isActive, address} = useWeb3();
	const	{getJobs, getKeeperStatus} = useKeep3r();
	const	{jobStatus, getJobStatus} = useJob();
	const	[txStatusApprove, set_txStatusApprove] = React.useState(defaultTxStatus);
	const	[txStatusAddCredits, set_txStatusAddCredits] = React.useState(defaultTxStatus);
	const	[tokenToAdd, set_tokenToAdd] = React.useState('');
	const	[amountTokenToAdd, set_amountTokenToAdd] = React.useState('');
	const	[tokenToAddData, set_tokenToAddData] = React.useState({
		balanceOf: ethers.constants.Zero,
		allowance: ethers.constants.Zero,
		decimals: 18,
		symbol: ''
	});

	async function	getTokenToAdd(_tokenToAdd: string): Promise<void> {
		const	_provider = provider || providers.getProvider(1);
		const	ethcallProvider = await providers.newEthCallProvider(_provider);
		const	tokenToAddContract = new Contract(_tokenToAdd as string, ERC20_ABI);
		const	results = await ethcallProvider.tryAll([
			tokenToAddContract.balanceOf(address),
			tokenToAddContract.allowance(address, process.env.KEEP3R_V2_ADDR as string),
			tokenToAddContract.decimals(),
			tokenToAddContract.symbol()
		]) as unknown[];

		performBatchedUpdates((): void => {
			const	[balanceOf, allowance, decimals, symbol] = results;
			set_tokenToAddData({
				balanceOf: balanceOf as ethers.BigNumber,
				allowance: allowance as ethers.BigNumber,
				decimals: decimals as number,
				symbol: symbol as string
			});
		});
	}

	React.useEffect((): void => {
		if (provider) {
			if (!isZeroAddress(tokenToAdd)) {
				getTokenToAdd(tokenToAdd);
			} else {
				performBatchedUpdates((): void => {
					set_amountTokenToAdd('');
					set_tokenToAddData({
						balanceOf: ethers.constants.Zero,
						allowance: ethers.constants.Zero,
						decimals: 18,
						symbol: ''
					});
				});
			}
		}
	}, [tokenToAdd, provider]); // eslint-disable-line react-hooks/exhaustive-deps

	async function	onApprove(): Promise<void> {
		if (!isActive || txStatusApprove.pending)
			return;
		new Transaction(provider, approveERC20, set_txStatusApprove)
			.populate(
				tokenToAdd,
				process.env.KEEP3R_V2_ADDR as string,
				format.toSafeAmount(amountTokenToAdd, tokenToAddData?.balanceOf || 0, tokenToAddData?.decimals || 18)
			).onSuccess(async (): Promise<void> => {
				await getTokenToAdd(tokenToAdd);
			}).perform();
	}

	async function	onAddTokenCreditsToJob(): Promise<void> {
		if (!isActive || txStatusAddCredits.pending)
			return;
		new Transaction(provider, addTokenCreditsToJob, set_txStatusAddCredits)
			.populate(
				jobStatus.address,
				tokenToAdd,
				format.toSafeAmount(amountTokenToAdd, tokenToAddData?.balanceOf || 0, tokenToAddData?.decimals || 18)
			).onSuccess(async (): Promise<void> => {
				await Promise.all([getJobs(), getJobStatus(), getKeeperStatus(), getTokenToAdd(tokenToAdd)]);
				set_amountTokenToAdd('');
			}).perform();
		
	}

	function	addButton(): ReactElement {
		const	allowance = ethers.utils.formatUnits(tokenToAddData?.allowance || 0, tokenToAddData?.decimals || 18);
		if (Number(allowance) < Number(amountTokenToAdd)) {
			return (
				<Button
					onClick={onApprove}
					isBusy={txStatusApprove.pending}
					isDisabled={
						!isActive
						|| isZeroAddress(tokenToAdd)
						|| amountTokenToAdd === '' || Number(amountTokenToAdd) === 0 
						|| Number(amountTokenToAdd) > Number(format.units(tokenToAddData?.balanceOf || 0, tokenToAddData?.decimals || 18))
					}>
					{txStatusApprove.error ? 'Transaction failed' : txStatusApprove.success ? 'Transaction successful' : 'Approve'}
				</Button>
			);
		}
	
		return (
			<Button
				onClick={onAddTokenCreditsToJob}
				isBusy={txStatusAddCredits.pending}
				isDisabled={
					!isActive
					|| tokenToAddData.balanceOf.eq(0)
					|| Number(amountTokenToAdd) === 0
					|| !Number(amountTokenToAdd)
				}>
				{txStatusAddCredits.error ? 'Transaction failed' : txStatusAddCredits.success ? 'Transaction successful' : 'Add'}
			</Button>
		);
	}

	return (
		<section aria-label={'Add tokens directly'}>
			<b className={'text-lg'}>{'Add tokens directly'}</b>
			<div aria-label={'Add tokens directly'} className={'mt-8 mb-10 space-y-6'}>
				<div>
					<div className={'grid relative grid-cols-1 gap-4 my-4 md:grid-cols-2'}>
						<div className={'relative space-y-2'}>
							<TokenDropdown
								onSelect={(s: string): void => {
									performBatchedUpdates((): void => {
										set_tokenToAdd(s);
										set_amountTokenToAdd('');
									});
								}} />
							<p className={'hidden text-xs text-black-1/0 md:block'}>{'-'}</p>
						</div>
						<Input.BigNumber
							label={''}
							value={amountTokenToAdd}
							onSetValue={(s: string): void => set_amountTokenToAdd(s)}
							maxValue={tokenToAddData?.balanceOf || 0}
							decimals={tokenToAddData?.decimals || 18} />
					</div>
					<div>
						{addButton()}
					</div>
				</div>
			</div>
		</section>
	);
}

function	SectionActionsManageLiquidity(): ReactElement {
	const	{provider, isActive, address} = useWeb3();
	const	{getJobs, getKeeperStatus} = useKeep3r();
	const	{jobStatus, getJobStatus} = useJob();
	const	[txStatusWithdrawCredits, set_txStatusWithdrawCredits] = React.useState(defaultTxStatus);
	const	[tokenToWithdraw, set_tokenToWithdraw] = React.useState('');
	const	[amountTokenToWithdraw, set_amountTokenToWithdraw] = React.useState('');
	const	[receiver, set_receiver] = React.useState('');
	const	[tokenToWithdrawData, set_tokenToWithdrawData] = React.useState({
		balanceOf: ethers.constants.Zero,
		decimals: 18,
		symbol: ''
	});

	React.useEffect((): void => {
		set_receiver(address || '');
	}, [address]);

	async function	getTokenToWithdraw(_tokenToWithdraw: string): Promise<void> {
		const	_provider = provider || providers.getProvider(1);
		const	ethcallProvider = await providers.newEthCallProvider(_provider);
		const	contract = new Contract(process.env.KEEP3R_V2_ADDR as string, KEEP3RV2_ABI);
		const	tokenToWithdrawContract = new Contract(_tokenToWithdraw, ERC20_ABI);
		const	results = await ethcallProvider.tryAll([
			contract.jobTokenCredits(jobStatus.address, _tokenToWithdraw),
			tokenToWithdrawContract.decimals(),
			tokenToWithdrawContract.symbol()
		]) as unknown[];
		performBatchedUpdates((): void => {
			const	[balanceOf, decimals, symbol] = results;
			set_tokenToWithdrawData({
				balanceOf: balanceOf as ethers.BigNumber,
				decimals: decimals as number,
				symbol: symbol as string
			});
		});
	}

	React.useEffect((): void => {
		if (provider) {
			if (!isZeroAddress(tokenToWithdraw)) {
				getTokenToWithdraw(tokenToWithdraw);
			} else {
				performBatchedUpdates((): void => {
					set_amountTokenToWithdraw('');
					set_tokenToWithdrawData({
						balanceOf: ethers.constants.Zero,
						decimals: 18,
						symbol: ''
					});
				});
			}
		}
	}, [tokenToWithdraw, provider]); // eslint-disable-line react-hooks/exhaustive-deps

	async function	onWithdrawTokenCreditsFromJob(): Promise<void> {
		if (!isActive || txStatusWithdrawCredits.pending)
			return;
		new Transaction(provider, withdrawTokenCreditsFromJob, set_txStatusWithdrawCredits)
			.populate(
				jobStatus.address,
				tokenToWithdraw,
				format.toSafeAmount(amountTokenToWithdraw, tokenToWithdrawData?.balanceOf || 0, tokenToWithdrawData?.decimals || 18),
				receiver
			).onSuccess(async (): Promise<void> => {
				await Promise.all([getJobs(), getJobStatus(), getKeeperStatus(), getTokenToWithdraw(tokenToWithdraw)]);
				set_amountTokenToWithdraw('');
			}).perform();
		
	}

	function	withdrawButton(): ReactElement {
		return (
			<Button
				onClick={onWithdrawTokenCreditsFromJob}
				isBusy={txStatusWithdrawCredits.pending}
				isDisabled={
					!isActive
					|| tokenToWithdrawData.balanceOf.eq(0)
					|| Number(amountTokenToWithdraw) === 0
					|| !Number(amountTokenToWithdraw)
				}>
				{txStatusWithdrawCredits.error ? 'Transaction failed' : txStatusWithdrawCredits.success ? 'Transaction successful' : 'Withdraw'}
			</Button>
		);
	}

	return (
		<section aria-label={'Withdraw tokens directly'}>
			<b className={'text-lg'}>{'Withdraw tokens'}</b>
			<div aria-label={'Withdraw tokens'} className={'mt-8 space-y-6'}>
				<div>
					<div className={'grid grid-cols-1 gap-4 my-4 md:grid-cols-2'}>
						<div className={'space-y-2'}>
							<TokenDropdown onSelect={(s: string): void => set_tokenToWithdraw(s)} />
							<p className={'hidden text-xs text-black-1/0 md:block'}>{'-'}</p>
						</div>
						<Input.BigNumber
							label={''}
							value={amountTokenToWithdraw}
							onSetValue={(s: string): void => set_amountTokenToWithdraw(s)}
							maxValue={tokenToWithdrawData?.balanceOf || 0}
							decimals={tokenToWithdrawData?.decimals || 18} />
					</div>

					<label
						className={'space-y-2'}
						aria-invalid={receiver !== '' && isZeroAddress(receiver)}>
						<p className={'text-black-1'}>{'Receiver'}</p>
						<Input
							value={receiver}
							onChange={(s: unknown): void => set_receiver(s as string)}
							onSearch={(s: unknown): void => set_receiver(s as string)}
							aria-label={'receiver'}
							placeholder={'0x...'} />
					</label>

					<div className={'mt-6'}>
						{withdrawButton()}
					</div>

				</div>
			</div>
		</section>
	);
}

function	PanelManageLiquidity(): ReactElement {
	return (
		<div className={'flex flex-col p-6'}>
			<SectionAddToken />
			<SectionActionsManageLiquidity />
		</div>
	);
}


export default PanelManageLiquidity;