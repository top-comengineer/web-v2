import	React, {ReactElement}					from	'react';
import	{ethers}								from	'ethers';
import	{Cross}									from	'@yearn/web-lib/icons';
import	{Button}								from	'@yearn/web-lib/components';
import	{useWeb3}								from	'@yearn/web-lib/contexts';
import	{format, Transaction, defaultTxStatus}	from	'@yearn/web-lib/utils';
import	useKeep3r								from	'contexts/useKeep3r';
import	{Modal}									from	'components/modals/Modal';
import	Input									from	'components/Input';
import	TokenDropdown							from	'components/TokenDropdown';
import	{bond}									from	'utils/actions/bond';
import	{approveERC20}							from	'utils/actions/approveToken';
import	{activate}								from	'utils/actions/activate';

type		TModalBond = {
	isOpen: boolean,
	onClose: () => void,
	tokenBonded: string,
}
function	ModalBond({isOpen, onClose, tokenBonded}: TModalBond): ReactElement {
	const	{provider, isActive} = useWeb3();
	const	{keeperStatus, getKeeperStatus} = useKeep3r();
	const	[amount, set_amount] = React.useState('');
	const	[txStatusBond, set_txStatusBond] = React.useState(defaultTxStatus);
	const	[txStatusApprove, set_txStatusApprove] = React.useState(defaultTxStatus);
	const	[txStatusActivate, set_txStatusActivate] = React.useState(defaultTxStatus);

	async function	onBond(): Promise<void> {
		if (!isActive || txStatusBond.pending || keeperStatus.hasDispute)
			return;
		const	transaction = (
			new Transaction(provider, bond, set_txStatusBond).populate(
				tokenBonded,
				format.toSafeAmount(amount, keeperStatus.balanceOf)
			).onSuccess(async (): Promise<void> => {
				await getKeeperStatus();
			})
		);

		const	isSuccessful = await transaction.perform();
		if (isSuccessful) {
			set_amount('');
		}
	}

	async function	onApprove(): Promise<void> {
		if (!isActive || txStatusApprove.pending || keeperStatus.hasDispute)
			return;
		const	transaction = (
			new Transaction(provider, approveERC20, set_txStatusApprove).populate(
				tokenBonded,
				process.env.KEEP3R_V2_ADDR as string,
				format.toSafeAmount(amount, keeperStatus.balanceOf)
			).onSuccess(async (): Promise<void> => {
				await getKeeperStatus();
			})
		);

		await transaction.perform();
	}
	
	async function	onActivate(): Promise<void> {
		if (!isActive || txStatusActivate.pending || keeperStatus.hasDispute)
			return;
		const	transaction = (
			new Transaction(provider, activate, set_txStatusActivate).populate(
				tokenBonded
			).onSuccess(async (): Promise<void> => {
				await getKeeperStatus();
			})
		);

		const	isSuccessful = await transaction.perform();
		if (isSuccessful) {
			set_amount('');
		}
	}

	function		bondButton(): ReactElement {
		const	allowance = ethers.utils.formatUnits(keeperStatus.allowance, 18);
		if (Number(allowance) < Number(amount)) {
			return (
				<Button
					onClick={onApprove}
					isBusy={txStatusApprove.pending}
					isDisabled={!isActive || keeperStatus.hasDispute}>
					{txStatusApprove.error ? 'Transaction failed' : txStatusApprove.success ? 'Transaction successful' : 'Approve'}
				</Button>
			);
		}
	
		return (
			<Button
				onClick={onBond}
				isBusy={txStatusBond.pending}
				isDisabled={!isActive || keeperStatus.hasDispute}>
				{txStatusBond.error ? 'Transaction failed' : txStatusBond.success ? 'Transaction successful' : 'Bond'}
			</Button>
		);
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}>
			<div className={'p-6 space-y-4'}>
				<div className={'flex justify-between items-center mb-4'}>
					<h2 className={'text-xl font-bold'}>{'Bond'}</h2>
					<Cross className={'w-6 h-6 text-black cursor-pointer'} onClick={onClose} />
				</div>
				
				<div className={'grid grid-cols-1 gap-4 mb-4 md:grid-cols-2'}>
					<div className={'space-y-6'}>
						<p>
							{'To become a keeper, you simply need to call '}
							<code className={'inline text-grey-2'}>{'bond(address,uint)'}</code>
							{'. No funds are required to become a keeper, however, certain jobs might require a minimum amount of funds.'}
						</p>
						<p>
							{'There is a bond time (default 3-day) delay before you can become an active keeper. Once this delay has passed, you will have to call '}
							<code className={'inline text-grey-2'}>{'activate()'}</code>
							{'.'}
						</p>
					</div>
					<div className={'p-6 space-y-10 bg-white'}>
						<div>
							<p className={'mb-2'}>{'Balance, KP3R'}</p>
							<b className={'text-xl'}>{format.toNormalizedAmount(keeperStatus.balanceOf, 18)}</b>
						</div>
						<div>
							<p className={'mb-2'}>{'Pending, KP3R'}</p>
							<b className={'text-xl'}>{format.toNormalizedAmount(keeperStatus.pendingBonds, 18)}</b>
						</div>
						<div>
							<p className={'mb-2'}>{'Bonded, KP3R'}</p>
							<b className={'text-xl'}>{format.toNormalizedAmount(keeperStatus.bonds, 18)}</b>
						</div>
					</div>
				</div>

				<div className={'grid grid-cols-2 gap-4 mb-4'}>
					<div className={'mb-4 space-y-2'}>
						<b>{'Token'}</b>
						<TokenDropdown.Fake name={'KP3R'} />
					</div>
					<div className={'space-y-2'}>
						<b>{'Amount'}</b>
						<div>
							<Input.BigNumber
								value={amount}
								onSetValue={(s: string): void => set_amount(s)}
								maxValue={keeperStatus?.balanceOf || 0}
								decimals={18}
								shouldHideBalance/>
						</div>
					</div>
				</div>

				<div className={'grid grid-cols-2 gap-4 mb-4'}>
					<div>
						{bondButton()}
					</div>
					<div>
						<Button
							onClick={onActivate}
							isBusy={txStatusActivate.pending}
							isDisabled={!keeperStatus.canActivate}>
							{
								txStatusActivate.error ? 'Transaction failed' :
									txStatusActivate.success ? 'Transaction successful' :
										keeperStatus.hasPendingActivation ? 
											keeperStatus.canActivate || keeperStatus.canActivateIn === 'Now' ? 'Activate' : `Activate (${keeperStatus.canActivateIn})`
											: 'Activate'
							}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}

export {ModalBond};