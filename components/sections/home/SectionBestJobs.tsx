import	React, {ReactElement}	from	'react';
import	Link					from	'next/link';
import	{Button}				from	'@yearn-finance/web-lib/components';
import	{ArrowDown}				from	'@yearn-finance/web-lib/icons';
import	* as utils				from	'@yearn-finance/web-lib/utils';
import	IconLoader				from	'components/icons/IconLoader';
import	IconBadgeCheck			from	'components/icons/IconBadgeCheck';
import	Input					from	'components/Input';
import	{ModalRegisterJobs}		from	'components/modals/ModalRegisterJobs';
import	useKeep3r				from	'contexts/useKeep3r';
import	{TJobData}				from	'contexts/useKeep3r.d';

function	deepFind(job: TJobData, term: string): boolean {
	if (term.length === 0)
		return true;
	return (
		(job?.name || '').toLowerCase().includes(term.toLowerCase()) ||
		(job?.address || '').toLowerCase().includes(term.toLowerCase())
	);
}

function	SectionBestJobs(): ReactElement {
	const	{jobs} = useKeep3r();
	const	[jobsWithOrder, set_jobsWithOrder] = React.useState<TJobData[]>([]);
	const	[sortBy, set_sortBy] = React.useState<'totalCredits'|'-totalCredits'>('-totalCredits');
	const	[searchTerm, set_searchTerm] = React.useState('');
	const	[, set_nonce] = React.useState(0);
	const	[isModalRegisterJobOpen, set_isModalRegisterJobOpen] = React.useState(false);

	React.useEffect((): void => {
		const	_jobsWithOrder = jobs.sort((a: TJobData, b: TJobData): number => {
			if (sortBy === '-totalCredits')
				return b.totalCreditsNormalized - a.totalCreditsNormalized;
			else
				return a.totalCreditsNormalized - b.totalCreditsNormalized;
		});
		utils.performBatchedUpdates((): void => {
			set_jobsWithOrder(_jobsWithOrder.filter((job): boolean => deepFind(job, searchTerm)));
			set_nonce((n: number): number => n + 1);
		});
	}, [jobs, sortBy, searchTerm]);

	return (
		<section aria-label={'BEST JOBS IN THE NETWORK'}>
			<h2 className={'text-xl font-bold'}>{'BEST JOBS IN THE NETWORK'}</h2>
			<div className={'mt-4 mb-6 flex flex-col gap-4 md:flex-row'}>
				<Input
					className={'min-w-[336px]'}
					value={searchTerm}
					onChange={(s: unknown): void => set_searchTerm(s as string)}
					onSearch={(s: unknown): void => set_searchTerm(s as string)}
					aria-label={'Find a Job (0x...)'}
					placeholder={'Find a Job (0x...)'}
				/>
				<div className={'w-full'}>
					<Button onClick={(): void => set_isModalRegisterJobOpen(true)}>
						{'+ Register job'}
					</Button>
				</div>
			</div>

			<div className={'grid grid-cols-4 px-4 pb-2 md:grid-cols-3'}>
				<p className={'col-span-2'}>{'Jobs'}</p>
				<div
					onClick={(): void => set_sortBy(sortBy === 'totalCredits' ? '-totalCredits' : 'totalCredits')}
					className={'col-span-2 flex cursor-pointer flex-row space-x-2 md:col-span-1'}>
					<p>{'Total credits'}</p>
					<ArrowDown className={`h-6 w-6 transition-transform ${sortBy === 'totalCredits' ? 'rotate-180' : 'rotate-0'}`}/>
				</div>
			</div>
			<div className={'col-span-2 flex min-h-[112px] flex-col md:col-span-1'}>
				{searchTerm === '' && jobsWithOrder.length === 0 ? (
					<div className={'flex h-full min-h-[112px] items-center justify-center bg-white'}>
						<IconLoader className={'h-6 w-6 animate-spin'} />
					</div>
				) : null}
				{jobsWithOrder.map((job, index): ReactElement => (
					<Link href={`/jobs/${job.address}`} key={index}>
						<div className={'grid cursor-pointer grid-cols-3 gap-4 bg-white py-6 px-4 transition-colors hover:bg-grey-4 md:gap-2'}>
							<div className={'col-span-2 space-y-2'}>
								<div className={'flex flex-row items-center'}>
									<b className={'overflow-hidden text-ellipsis pr-2 text-xl md:pr-0'}>
										{job.name || 'Unverified job'}
									</b>
									{job.name ? <IconBadgeCheck className={'ml-auto h-4 min-h-[16px] w-4 min-w-[16px] md:ml-4 md:h-6 md:min-h-[24px] md:w-6 md:min-w-[24px]'} /> : null}
								</div>
								<p className={'text-grey-1'}>
									{utils.truncateHex(job.address, 5)}
								</p>
							</div>
							<div className={'space-y-2'}>
								<b className={'text-xl'}>
									{utils.format.bigNumberAsAmount(job.totalCredits, 18, 2)}
								</b>
								<p className={'text-grey-1'}>{'KP3R'}</p>
							</div>
						</div>
					</Link>
				))}
			</div>
			<ModalRegisterJobs
				isOpen={isModalRegisterJobOpen}
				onClose={(): void => set_isModalRegisterJobOpen(false)} />
		</section>
	);
}

export default SectionBestJobs;
