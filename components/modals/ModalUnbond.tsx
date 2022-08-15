import	React, {ReactElement}					from	'react';
import	{Button, Modal}							from	'@yearn-finance/web-lib/components';
import	{Cross}									from	'@yearn-finance/web-lib/icons';
import	{format, Transaction, defaultTxStatus}	from	'@yearn-finance/web-lib/utils';
import	{useWeb3}								from	'@yearn-finance/web-lib/contexts';
import	useKeep3r								from	'contexts/useKeep3r';
import	Input									from	'components/Input';
import	TokenDropdown							from	'components/TokenDropdown';
import	{unbond}								from	'utils/actions/unbond';
import	{withdraw}								from	'utils/actions/withdraw';

type		TModalUnbond = {
	isOpen: boolean,
	onClose: () => void,
	tokenBonded: string,
}
function	ModalUnbond({isOpen, onClose, tokenBonded}: TModalUnbond): ReactElement {
	const	{provider, isActive} = useWeb3();
	const	{keeperStatus, getKeeperStatus} = useKeep3r();
	const	[amount, set_amount] = React.useState('');
	const	[txStatusUnbond, set_txStatusUnbond] = React.useState(defaultTxStatus);
	const	[txStatusWithdraw, set_txStatusWithdraw] = React.useState(defaultTxStatus);

	async function	onUnbond(): Promise<void> {
		if (!isActive || txStatusUnbond.pending)
			return;
		const	transaction = (
			new Transaction(provider, unbond, set_txStatusUnbond).populate(
				tokenBonded,
				format.toSafeAmount(amount, keeperStatus.bonds)
			).onSuccess(async (): Promise<void> => {
				await getKeeperStatus();
			})
		);

		const	isSuccessful = await transaction.perform();
		if (isSuccessful) {
			set_amount('');
		}
	}

	async function	onWithdraw(): Promise<void> {
		if (!isActive || txStatusWithdraw.pending || keeperStatus.hasDispute)
			return;
		const	transaction = (
			new Transaction(provider, withdraw, set_txStatusWithdraw)
				.populate(tokenBonded)
				.onSuccess(async (): Promise<void> => {
					await getKeeperStatus();
				})
		);

		const	isSuccessful = await transaction.perform();
		if (isSuccessful) {
			onClose();
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}>
			<div className={'space-y-4 p-6'}>
				<div className={'mb-4 flex items-center justify-between'}>
					<h2 className={'text-xl font-bold'}>{'Unbond'}</h2>
					<Cross className={'h-6 w-6 cursor-pointer text-black'} onClick={onClose} />
				</div>
				
				<div className={'mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'}>
					<div className={'space-y-6'}>
						<p>
							{'If you no longer wish to be a keeper you have to call '}
							<code className={'inline text-grey-2'}>{'unbond(address,uint)'}</code>
							{' and deactivate your account.'}
						</p>
						<p>
							{'There is an unbond time (default 14-day) delay before you can withdraw any bonded assets. Once this delay has passed, you will have to call '}
							<code className={'inline text-grey-2'}>{'withdraw(address)'}</code>
							{' and claim the assets.'}
						</p>
					</div>
					<div className={'space-y-10 bg-white p-6'}>
						<div>
							<p className={'mb-2'}>{'Balance, KP3R'}</p>
							<b className={'text-xl'}>{format.toNormalizedAmount(keeperStatus.balanceOf, 18)}</b>
						</div>
						<div>
							<p className={'mb-2'}>{'Pending, KP3R'}</p>
							<b className={'text-xl'}>{format.toNormalizedAmount(keeperStatus.pendingUnbonds, 18)}</b>
						</div>
						<div>
							<p className={'mb-2'}>{'Bonded, KP3R'}</p>
							<b className={'text-xl'}>{format.toNormalizedAmount(keeperStatus.bonds, 18)}</b>
						</div>
					</div>
				</div>

				<div className={'mb-4 grid grid-cols-2 gap-4'}>
					<div className={'mb-4 space-y-2'}>
						<b>{'Token'}</b>
						<TokenDropdown.Fake name={'KP3R'} />
					</div>
					<div className={'space-y-2'}>
						<b>{'Amount'}</b>
						<Input
							value={amount}
							type={'number'}
							min={0}
							onChange={(s: unknown): void => set_amount(s as string)}
							onSearch={(s: unknown): void => set_amount(s as string)}
							aria-label={'amount'}
							placeholder={'0.00000000'}
							onMaxClick={(): void => set_amount(format.units(keeperStatus.bonds, 18))}
							withMax />
					</div>
				</div>

				<div className={'mb-4 grid grid-cols-2 gap-4'}>
					<div>
						<Button
							onClick={onUnbond}
							isBusy={txStatusUnbond.pending}
							isDisabled={!isActive || keeperStatus.hasDispute}>
							{txStatusUnbond.error ? 'Transaction failed' : txStatusUnbond.success ? 'Transaction successful' : 'Unbond'}
						</Button>
					</div>
					<div>
						<Button
							onClick={onWithdraw}
							isBusy={txStatusWithdraw.pending}
							isDisabled={!keeperStatus.canWithdraw || keeperStatus.pendingUnbonds.eq(0)}>
							{txStatusWithdraw.error ? 'Transaction failed' : txStatusWithdraw.success ? 'Transaction successful' : keeperStatus.canWithdraw ? 'Withdraw' : `Withdraw (${keeperStatus.canWithdrawIn})`}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}

export {ModalUnbond};