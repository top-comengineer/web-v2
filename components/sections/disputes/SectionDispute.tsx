import	React, {ReactElement}							from	'react';
import	{Button}										from	'@yearn/web-lib/components';
import	{isZeroAddress, Transaction, defaultTxStatus}	from	'@yearn/web-lib/utils';
import	{useWeb3}										from	'@yearn/web-lib/contexts';
import	useKeep3r										from	'contexts/useKeep3r';
import	Input											from	'components/Input';
import	{dispute}										from	'utils/actions/dispute';
import	{resolve}										from	'utils/actions/resolve';

function	SectionDispute(): ReactElement {
	const	{provider, isActive} = useWeb3();
	const	{keeperStatus, getKeeperStatus} = useKeep3r();
	const	[disputeAddress, set_disputeAddress] = React.useState('');
	const	[resolveAddress, set_resolveAddress] = React.useState('');
	const	[txStatusDispute, set_txStatusDispute] = React.useState(defaultTxStatus);
	const	[txStatusResolve, set_txStatusResolve] = React.useState(defaultTxStatus);

	async function	onDispute(): Promise<void> {
		if (!isActive || txStatusDispute.pending)
			return;
		new Transaction(provider, dispute, set_txStatusDispute)
			.populate(disputeAddress)
			.onSuccess(async (): Promise<void> => {
				await getKeeperStatus();
				set_disputeAddress('');
			})
			.perform();
	}

	async function	onResolve(): Promise<void> {
		if (!isActive || txStatusResolve.pending)
			return;
		new Transaction(provider, resolve, set_txStatusResolve)
			.populate(resolveAddress)
			.onSuccess(async (): Promise<void> => {
				await getKeeperStatus();
				set_resolveAddress('');
			})
			.perform();
	}

	return (
		<div className={'flex flex-col'}>
			<h2 className={'mb-4 text-xl font-bold'}>{'DISPUTES'}</h2>
			<p>{'If your job isn\'t necessary anymore, you are able to unbond your kLPs from it and withdraw the underlying tokens after the unbonding period has passed (default 14 days).'}</p>
			<div className={'mt-6'}>
				<b className={'text-black-1'}>{'Dispute keeper or job'}</b>
				<div className={'grid grid-cols-5 gap-4 mt-2 mb-8'}>
					<label
						aria-invalid={disputeAddress !== '' && isZeroAddress(disputeAddress)}
						className={'col-span-3'}>
						<Input
							value={disputeAddress}
							onChange={(s: unknown): void => set_disputeAddress(s as string)}
							onSearch={(s: unknown): void => set_disputeAddress(s as string)}
							aria-label={'Dispute keeper or job'}
							placeholder={'0x...'} />
					</label>
					<div className={'col-span-2'}>
						<Button
							onClick={onDispute}
							isBusy={txStatusDispute.pending}
							isDisabled={!isActive || !keeperStatus.isDisputer || isZeroAddress(disputeAddress)}>
							{txStatusDispute.error ? 'Dispute failed' : txStatusDispute.success ? 'Dispute successful' : 'Dispute'}
						</Button>
					</div>
				</div>

				<b className={'text-black-1'}>{'Resolve a dispute'}</b>
				<div className={'grid grid-cols-5 gap-4 mt-2 mb-8'}>
					<label
						aria-invalid={resolveAddress !== '' && isZeroAddress(resolveAddress)}
						className={'col-span-3'}>
						<Input
							value={resolveAddress}
							onChange={(s: unknown): void => set_resolveAddress(s as string)}
							onSearch={(s: unknown): void => set_resolveAddress(s as string)}
							aria-label={'Resolve a dispute'}
							placeholder={'0x...'} />
					</label>
					<div className={'col-span-2'}>
						<Button
							onClick={onResolve}
							isBusy={txStatusResolve.pending}
							isDisabled={!isActive || !keeperStatus.isDisputer || isZeroAddress(resolveAddress)}>
							{txStatusResolve.error ? 'Resolve failed' : txStatusResolve.success ? 'Resolve successful' : 'Resolve'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SectionDispute;