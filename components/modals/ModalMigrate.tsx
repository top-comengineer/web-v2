import	React, {ReactElement}					from	'react';
import	{useRouter}								from	'next/router';
import	{ethers}								from	'ethers';
import	{Contract}								from	'ethcall';
import	{Button, Modal}							from	'@yearn-finance/web-lib/components';
import	{useWeb3}								from	'@yearn-finance/web-lib/contexts';
import	{isZeroAddress, toAddress, providers,
	Transaction, defaultTxStatus}				from	'@yearn-finance/web-lib/utils';
import	{Cross}									from	'@yearn-finance/web-lib/icons';
import	useKeep3r								from	'contexts/useKeep3r';
import	useJob									from	'contexts/useJob';
import	Input									from	'components/Input';
import	KEEP3RV2_ABI							from	'utils/abi/keep3rv2.abi';
import	{migrateJob}							from	'utils/actions/migrateJob';
import	{acceptJobMigration}					from	'utils/actions/acceptJobMigration';

type		TJobToStatus = {hasDispute: boolean, owner: string}
type		TModalMigrate = {
	currentAddress: string,
	isOpen: boolean,
	onClose: () => void,
}

const		defaultJobToStatus = {hasDispute: false, owner: ethers.constants.AddressZero};
function	ModalMigrate({currentAddress, isOpen, onClose}: TModalMigrate): ReactElement {
	const	router = useRouter();
	const	{provider, address, isActive} = useWeb3();
	const	{jobStatus, getJobStatus} = useJob();
	const	{getJobs, getKeeperStatus} = useKeep3r();
	const	[newAddress, set_newAddress] = React.useState('');
	const	[jobToStatus, set_jobToStatus] = React.useState<TJobToStatus>(defaultJobToStatus);
	const	[txStatusMigrate, set_txStatusMigrate] = React.useState(defaultTxStatus);
	const	[txStatusAccept, set_txStatusAccept] = React.useState(defaultTxStatus);
	const	[time, set_time] = React.useState(0);

	const goDown = React.useCallback(async (): Promise<void> => {
		if (time > 0) {
			setTimeout((): void => {
				set_time(time - 1);
			}, 1000);
		}
	}, [time]);

	React.useEffect((): void => {
		goDown();
	}, [goDown]);

	async function getMigrationDestination(migrationAddress: string): Promise<void> {
		const	_provider = provider || providers.getProvider(1);
		const	ethcallProvider = await providers.newEthCallProvider(_provider);
		const	keep3rV2 = new Contract(process.env.KEEP3R_V2_ADDR as string, KEEP3RV2_ABI);
		const	calls = [
			keep3rV2.disputes(migrationAddress),
			keep3rV2.jobOwner(migrationAddress)
		];
		const	results = await ethcallProvider.tryAll(calls) as unknown[]; 
		const	[hasDispute, owner] = results;
		set_jobToStatus({hasDispute: hasDispute as boolean, owner: owner as string});
	}
	
	React.useEffect((): void => {
		if (!isZeroAddress(jobStatus.pendingJobMigrations)) {
			set_newAddress(jobStatus.pendingJobMigrations);
			getMigrationDestination(jobStatus.pendingJobMigrations);
		}
	}, [jobStatus.pendingJobMigrations]); // eslint-disable-line react-hooks/exhaustive-deps

	async function	onMigrateJob(): Promise<void> {
		if (!isActive || txStatusMigrate.pending)
			return;
		const	transaction = (
			new Transaction(provider, migrateJob, set_txStatusMigrate).populate(
				currentAddress,
				newAddress
			).onSuccess(async (): Promise<void> => {
				await Promise.all([getJobStatus(), getKeeperStatus()]);
				set_time(60);
			})
		);

		await transaction.perform();
	}

	async function	onAcceptMigration(): Promise<void> {
		if (!isActive || txStatusAccept.pending)
			return;
		const	transaction = (
			new Transaction(provider, acceptJobMigration, set_txStatusAccept).populate(
				currentAddress,
				newAddress
			).onSuccess(async (): Promise<void> => {
				await Promise.all([getJobStatus(), getJobs(), getKeeperStatus()]);
			})
		);

		const	isSuccessful = await transaction.perform();
		if (isSuccessful) {
			set_newAddress('');
			onClose();
			router.push(`/jobs/${newAddress}`);
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}>
			<div className={'space-y-4 p-6'}>
				<div className={'mb-4 flex items-center justify-between'}>
					<h2 className={'text-xl font-bold'}>{'Migrate job'}</h2>
					<Cross className={'h-6 w-6 cursor-pointer text-black'} onClick={onClose} />
				</div>

				<div className={'flex flex-col'}>
					<div className={'mb-6 space-y-6'}>
						<p>
							{'A proper migration implies current job state – tokens, liquidities, period credits - is transferred from current to new job.'}
						</p>
						<div>
							<p>{'This process requires 2 steps:'}</p>
							<p>{'1. Initiate job migration – done by current job owner.'}</p>
							<p>{'2. Accept job migration – done by new job owner.'}</p>
						</div>
						<p>
							<b>{'Note:'}</b>
							{' Neither of the jobs should be disputed. There should be at least one minute pause between migration steps.'}
						</p>
					</div>
					<div className={'mb-6 space-y-2'}>
						<b className={'text-black-1'}>{'Current address'}</b>
						<div className={'overflow-hidden border border-grey-1 py-3 px-4'}>
							<p className={'overflow-hidden text-ellipsis text-grey-1'}>{currentAddress}</p>
						</div>
					</div>
					<label
						className={'space-y-2'}
						aria-invalid={
							newAddress !== '' && isZeroAddress(newAddress)
							|| toAddress(newAddress) === toAddress(currentAddress)
						}>
						<b className={'text-black-1'}>{'New address'}</b>
						<Input
							value={newAddress}
							onChange={(s: unknown): void => set_newAddress(s as string)}
							onSearch={(s: unknown): void => set_newAddress(s as string)}
							aria-label={'new address'}
							placeholder={'0x...'} />
					</label>
					<div className={'mt-8 grid grid-cols-2 gap-4'}>
						<Button
							onClick={onMigrateJob}
							isBusy={txStatusMigrate.pending}
							isDisabled={
								isZeroAddress(newAddress)
								|| jobStatus.jobOwner !== address
								|| toAddress(newAddress) === toAddress(jobStatus.pendingJobMigrations)
								|| toAddress(newAddress) === toAddress(currentAddress)
							}>
							{txStatusMigrate.error ? 'Migration failed' : txStatusMigrate.success ? 'Migration initialized' : 'Initiate migration'}
						</Button>

						<Button
							onClick={onAcceptMigration}
							isBusy={txStatusAccept.pending}
							isDisabled={
								isZeroAddress(jobStatus.pendingJobMigrations)
								|| jobToStatus.owner !== address
								|| jobToStatus.hasDispute || jobStatus.hasDispute
								|| time > 0
							}>
							{time > 0 ? time : txStatusAccept.error ? 'Migration failed' : txStatusAccept.success ? 'Migration successful' : 'Accept'}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}

export {ModalMigrate};