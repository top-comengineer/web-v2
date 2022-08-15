import	React, {ReactElement}					from	'react';
import	{Contract}								from	'ethcall';
import	axios									from	'axios';
import	{Copy}									from	'@yearn-finance/web-lib/icons';
import	{copyToClipboard, providers, toAddress}	from	'@yearn-finance/web-lib/utils';
import	LogsDispute								from	'components/logs/LogsDispute';
import	SectionDispute							from	'components/sections/disputes/SectionDispute';
import	SectionSlash							from	'components/sections/disputes/SectionSlash';
import	SectionBlacklist						from	'components/sections/disputes/SectionBlacklist';
import	KEEP3RV2_ABI							from	'utils/abi/keep3rv2.abi';
import	type {TDisputeData, TDispute}			from	'utils/types.d';

function	Disputes({stats}: TDispute): ReactElement {
	return (
		<main className={'col-span-12 mx-auto mt-6 mb-10 flex min-h-[100vh] w-full max-w-6xl flex-col px-4'}>
			<div className={'mb-14 grid grid-cols-1 gap-8 md:grid-cols-2'}>
				<div className={'flex flex-col space-y-12 pt-6'}>
					<SectionDispute />
					<SectionSlash />
					<SectionBlacklist />
				</div>
				<div className={'flex flex-col space-y-10 bg-white p-6'}>
					<div className={'flex flex-col'}>
						<h2 className={'mb-4 text-xl font-bold'}>{'DISPUTERS'}</h2>
						<p>{'Disputers are governance-approved addresses with permission to dispute keepers or jobs that may have acted in bad faith. Once a dispute has started, a slasher will be in charge of evaluating what measures to take.'}</p>
						<div className={'flex flex-col space-y-4'}>
							{stats.disputers.map((s: string, i: number): ReactElement => (
								<div key={s} className={`flex flex-row space-x-2 ${i === 0 ? 'mt-6' : ''}`}>
									<code>{s}</code>
									<Copy
										onClick={(): void => copyToClipboard(s)}
										className={'h-6 w-6 cursor-pointer text-black'} />
								</div>
							))}
						</div>
					</div>
				
					<div className={'flex flex-col'}>
						<h2 className={'mb-4 text-xl font-bold'}>{'SLASHERS'}</h2>
						<p>{'Slashers are governance-approved addresses with permission to exercise last resort punishments over keepers and jobs that act in bad faith. '}</p>
						<div className={'flex flex-col space-y-4'}>
							{stats.slashers.map((s: string, i: number): ReactElement => (
								<div key={s} className={`flex flex-row space-x-2 ${i === 0 ? 'mt-6' : ''}`}>
									<code>{s}</code>
									<Copy
										onClick={(): void => copyToClipboard(s)}
										className={'h-6 w-6 cursor-pointer text-black'} />
								</div>
							))}
						</div>
					</div>

					<div className={'flex flex-col'}>
						<h2 className={'mb-4 text-xl font-bold'}>{'GOVERNANCE'}</h2>
						<p>{'Keep3r governance focus is mostly put on reviewing jobs. However, it can perform other tasks:'}</p>
						<ul>
							<li>{'- Manage slashers and disputers'}</li>
							<li>{'- Adjust protocol parameters'}</li>
							<li>{'- Manage approved liquidities'}</li>
							<li>{'- Force-mint credits to a job'}</li>
						</ul>
						<div className={'mt-6 flex flex-row space-x-2'}>
							<code className={'overflow-hidden text-ellipsis'}>{stats.governance}</code>
							<Copy
								onClick={(): void => copyToClipboard(stats.governance)}
								className={'h-6 w-6 cursor-pointer text-black'} />
						</div>
					</div>
				</div>

				<div className={'col-span-2 mt-0 md:mt-8'}>
					<div className={'flex flex-col'}>
						<h2 className={'mb-4 text-xl font-bold'}>{'HISTORY'}</h2>
						<LogsDispute />
					</div>
				</div>
			</div>
		</main>
	);
}

export async function getServerSideProps(): Promise<unknown> {
	//Initial values
	let		slashersList: string[] = [];
	let		disputersList: string[] = [];
	let		governance = '';

	//Actual action
	const	ethcallProvider = await providers.newEthCallProvider(providers.getProvider(1));
	const	keep3rV2 = new Contract(process.env.KEEP3R_V2_ADDR as string, KEEP3RV2_ABI);
	const	[slashers, disputers, results] = await Promise.allSettled([
		axios.get(`${process.env.BACKEND_URI as string}/slashers`),
		axios.get(`${process.env.BACKEND_URI as string}/disputers`),
		ethcallProvider.tryAll([keep3rV2.governance()])
	]);

	//Safechecks
	if (slashers.status === 'fulfilled')
		slashersList = slashers.value.data.map((s: string): string => toAddress(s));
	if (disputers.status === 'fulfilled')
		disputersList = disputers.value.data.map((s: string): string => toAddress(s));
	if (results.status === 'fulfilled')
		governance = toAddress(results.value[0] as string);

	//Assignation
	const	disputeStats: TDisputeData = {
		slashers: slashersList,
		disputers: disputersList,
		governance: governance
	};
	return {props: {
		stats: disputeStats
	}};
}
	
export default Disputes;
