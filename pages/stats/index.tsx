import	React, {ReactElement}				from	'react';
import	axios								from	'axios';
import	{format}							from	'@yearn-finance/web-lib/utils';
import	Input								from	'components/Input';
import	LogsStatsPerKeeper					from	'components/logs/LogsStatsPerKeeper';
import	type {TStatsIndexData, TStatsIndex}	from	'utils/types.d';

function	Stats({stats, prices}: TStatsIndex): ReactElement {
	const	[searchTerm, set_searchTerm] = React.useState('');
	const	[localStats, set_localStats] = React.useState<TStatsIndexData>(stats);
	
	React.useEffect((): void => {
		set_localStats(stats);
	}, [stats]);

	return (
		<>
			<section aria-label={'general statistics'} className={'mb-4 bg-grey-3'}>
				<div className={'mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 py-6 px-4 md:grid-cols-5 md:gap-4'}>
					<div className={'space-y-2'}>
						<p>{'Function calls'}</p>
						<div>
							<b className={'text-2xl'}>{!localStats?.isSuccessful ? '-' : format.amount(localStats.workDone, 0, 0)}</b>
						</div>
					</div>
					<div className={'space-y-2'}>
						<p>{'Rewarded, KP3R'}</p>
						<div>
							<b className={'text-2xl'}>{!localStats?.isSuccessful ? '-' : format.amount(Number(format.units(localStats.rewardedKp3r, 18)), 2, 2)}</b>
						</div>
					</div>
					<div className={'space-y-2'}>
						<p>{'Keepers'}</p>
						<div>
							<b className={'text-2xl'}>{!localStats?.isSuccessful ? '-' : format.amount(localStats.keepers, 0, 0)}</b>
						</div>
					</div>
					<div className={'space-y-2'}>
						<p>{'Bonded, KP3R'}</p>
						<div>
							<b className={'text-2xl'}>{!localStats?.isSuccessful ? '-' : format.amount(Number(format.units(localStats.bondedKp3r, 18)), 2, 2)}</b>
						</div>
					</div>
					<div className={'space-y-2'}>
						<p>{'Bonded, $'}</p>
						<div>
							<b className={'text-2xl'}>
								{!localStats?.isSuccessful ? '-' : format.amount(Number(format.units(localStats.bondedKp3r, 18)) * Number(prices?.keep3rv1 || 0), 2, 2)}
							</b>
						</div>
					</div>
				</div> 
			</section>
			<main className={'col-span-12 mx-auto mb-10 flex min-h-[100vh] w-full max-w-6xl flex-col px-4'}>
				<div className={'mb-8 space-y-2'}>
					<b>{'Find a Keeper'}</b>
					<Input
						value={searchTerm}
						onChange={(s: unknown): void => set_searchTerm(s as string)}
						onSearch={(s: unknown): void => set_searchTerm(s as string)}
						aria-label={'find a Keeper'}
						placeholder={'0x...'} />
				</div>
				<div>
					<LogsStatsPerKeeper
						searchTerm={searchTerm}
						prices={prices} />
				</div>
			</main>
		</>
	);
}

export async function getServerSideProps(): Promise<unknown> {
	const	[data] = await Promise.allSettled([axios.get(`${process.env.BACKEND_URI as string}/stats`)]);
	if (data.status === 'rejected') {
		const	statData: TStatsIndexData = {
			bondedKp3r: '',
			jobs: 0,
			keepers: 0,
			workDone: 0,
			normalizedBondedKp3r: '',
			normalizedRewardedKp3r: '',
			rewardedKp3r: '',
			isSuccessful: false
		};
		return {props: {stats: statData, prices: {keep3rv1: 0, ethereum: 0}}};
	}
	const	stats = data.value.data.stats;
	const	prices = data.value.data.prices;

	const	statData: TStatsIndexData = {
		bondedKp3r: stats?.bondedKp3r || '0',
		jobs: stats?.jobs || 0,
		keepers: stats?.keepers || 0,
		workDone: stats?.workDone || 0,
		normalizedBondedKp3r: stats?.normalizedBondedKp3r || '0',
		normalizedRewardedKp3r: stats?.normalizedRewardedKp3r || '0',
		rewardedKp3r: stats?.rewardedKp3r || '0',
		isSuccessful: true
	};
	return {props: {stats: statData, prices: {keep3rv1: prices.keep3r, ethereum: prices.ethereum}}};
}
export default Stats;
