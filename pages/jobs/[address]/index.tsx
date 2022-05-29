import	React, {ReactElement}						from	'react';
import	Link										from	'next/link';
import	{Button}									from	'@yearn/web-lib/components';
import	{Copy, LinkOut}								from	'@yearn/web-lib/icons';
import	{truncateHex, copyToClipboard, toAddress}	from	'@yearn/web-lib/utils';
import	useJob										from	'contexts/useJob';
import	IconBadgeCheck								from	'components/icons/IconBadgeCheck';
import	{ModalMigrate}								from	'components/modals/ModalMigrate';
import	SectionStatus								from	'components/sections/jobs/SectionStatus';
import	SectionActions								from	'components/sections/jobs/SectionActions';
import	SectionDocumentation						from	'components/sections/jobs/SectionDocumentation';
import	REGISTRY									from	'utils/registry';
import	type {TJobIndexData, TJobIndex}				from	'utils/types.d';

function	StatsJob({stats}: TJobIndex): ReactElement {
	const	{jobStatus} = useJob();
	const	[isModalMigrateOpen, set_isModalMigrateOpen] = React.useState(false);

	return (
		<main className={'flex flex-col col-span-12 px-4 mx-auto mt-6 mb-10 w-full max-w-6xl min-h-[100vh]'}>
			<div className={'flex flex-row items-center mb-6 space-x-2'}>
				<p>
					<Link href={'/'}>{'Jobs / '}</Link>
					<b>{stats.shortName}</b>
				</p>
			</div>

			<div className={'grid grid-cols-1 gap-4 mb-12 md:grid-cols-2'}>
				<div className={'grid grid-cols-1 gap-4'}>
					<div className={'flex flex-col p-6 bg-white'}>
						<div className={'flex flex-row items-center mb-2 space-x-4'}>
							<h2 className={'text-2xl font-bold'}>
								{stats.name}
							</h2>
							{stats.isVerified ? <IconBadgeCheck className={'w-6 h-6'} /> : null}
						</div>

						<div className={'flex flex-row items-center space-x-2'}>
							<b>{truncateHex(stats.job, 5)}</b>
							<div><Copy onClick={(): void => copyToClipboard(stats.job)} className={'w-6 h-6 text-black cursor-pointer'} /></div>
							<div>
								<a href={`https://etherscan.io/address/${stats.job}`} target={'_blank'} rel={'noopener noreferrer'}>
									<LinkOut className={'w-6 h-6 text-black cursor-pointer'} />
								</a>
							</div>
						</div>
					</div>
					<SectionStatus />
				</div>
				<div className={'flex flex-col space-y-4'}>
					<div className={'bg-white'}>
						<SectionActions />
					</div>
					<div className={'flex justify-center py-6 px-8 space-x-4 h-full bg-white flex-center'}>
						<Button
							onClick={(): void => set_isModalMigrateOpen(true)}
							variant={'reverted'}>
							{'Migrate'}
						</Button>
						<Link href={`/jobs/${jobStatus.address}/calls`}>
							<Button variant={'reverted'}>{'View calls'}</Button>
						</Link>
					</div>
				</div>
			</div>

			<SectionDocumentation />

			<ModalMigrate
				currentAddress={jobStatus.address as string}
				isOpen={isModalMigrateOpen}
				onClose={(): void => set_isModalMigrateOpen(false)} />
		</main>
	);
}

export async function getServerSideProps({params}: {params: {address: string}}): Promise<unknown> {
	const	address = params.address;
	const	jobStats: TJobIndexData = {
		job: address,
		name: REGISTRY[toAddress(address)]?.name || 'Unverified job',
		shortName: REGISTRY[toAddress(address)]?.name || truncateHex(address, 5),
		isVerified: REGISTRY[toAddress(address)]?.name ? true : false
	};
	return {props: {stats: jobStats}};
}

export default StatsJob;
