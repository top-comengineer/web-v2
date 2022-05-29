import	React, {ReactElement}			from	'react';
import	Link							from	'next/link';
import	{truncateHex, toAddress}		from	'@yearn/web-lib/utils';
import	Input							from	'components/Input';
import	LogsForJobCalls					from	'components/logs/LogsForJobCalls';
import	REGISTRY						from	'utils/registry';
import	type {TJobCallsData, TJobCalls}	from	'utils/types.d';

function	StatsCall({stats}: TJobCalls): ReactElement {
	const	[searchTerm, set_searchTerm] = React.useState('');

	return (
		<main className={'flex flex-col col-span-12 px-4 mx-auto mt-6 mb-10 w-full max-w-6xl min-h-[100vh]'}>
			<div className={'flex flex-row items-center mb-6 space-x-2'}>
				<p>
					<Link href={'/'}>{'Jobs / '}</Link>
					<Link href={`/jobs/${stats.job}`}>
						{`${stats.shortName} /`}
					</Link>
					<b>{'Calls'}</b>
				</p>
			</div>

			<div className={'flex flex-col'}>
				<div className={'mb-8 space-y-2'}>
					<b>{'Find a call'}</b>
					<Input
						value={searchTerm}
						onChange={(s: unknown): void => set_searchTerm(s as string)}
						onSearch={(s: unknown): void => set_searchTerm(s as string)}
						aria-label={'Find a call'}
						placeholder={'Find a call'} />
				</div>
				<div>
					<LogsForJobCalls jobAddress={stats.job} searchTerm={searchTerm} />
				</div>
			</div>

		</main>
	);
}

export async function getServerSideProps({params}: {params: {address: string}}): Promise<unknown> {
	const	address = params.address;
	const	jobStats: TJobCallsData = {
		job: address,
		shortName: REGISTRY[toAddress(address)]?.name || truncateHex(address, 5)
	};
	
	return {props: {stats: jobStats}};
}
export default StatsCall;