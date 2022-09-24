import	React, {ReactElement}					from	'react';
import	Link									from	'next/link';
import	{Contract}								from	'ethcall';
import	axios									from	'axios';
import	{BigNumber}								from	'ethers';
import	{Button}								from	'@yearn-finance/web-lib/components';
import	{Copy, LinkOut}							from	'@yearn-finance/web-lib/icons';
import	{format, truncateHex, copyToClipboard,
	providers, toAddress}						from	'@yearn-finance/web-lib/utils';
import	Input									from	'components/Input';
import	{ModalBond}								from	'components/modals/ModalBond';
import	LogsStatsForKeeper						from	'components/logs/LogsStatsForKeeper';
import	KEEP3RV1_ABI							from	'utils/abi/keep3rv1.abi';
import	KEEP3RV2_ABI							from	'utils/abi/keep3rv2.abi';
import	type {TStatsAddressData, TStatsAddress}	from	'utils/types.d';

function	StatsKeeper({stats, prices}: TStatsAddress): ReactElement {
	const	[selectedToken] = React.useState(process.env.KP3R_TOKEN_ADDR as string);
	const	[searchTerm, set_searchTerm] = React.useState('');
	const	[isModalBondOpen, set_isModalBondOpen] = React.useState(false);

	return (
		<main className={'col-span-12 mx-auto mt-6 mb-10 flex min-h-[100vh] w-full max-w-6xl flex-col px-4'}>
			<div className={'mb-6 flex flex-row items-center space-x-2'}>
				<p>
					<Link href={'/stats'}>{'Keepers / '}</Link>
					<b>{`Keeper ${truncateHex(stats.keeper, 5)}`}</b>
				</p>
				<div><Copy onClick={(): void => copyToClipboard(stats.keeper)} className={'h-6 w-6 cursor-pointer text-black'} /></div>
				<div>
					<a href={`https://etherscan.io/address/${stats.keeper}`} target={'_blank'} rel={'noopener noreferrer'}>
						<LinkOut className={'h-6 w-6 cursor-pointer text-black'} />
					</a>
				</div>
			</div>
			<div className={'mb-6 grid grid-cols-2 gap-4 md:grid-cols-4'}>
				<div className={'flex flex-col space-y-2 bg-white p-6'}>
					<p>{'Earned, KP3R'}</p>
					<div><b className={'text-xl'}>{!stats.isSuccessful ? '-' : format.amount(Number(stats.earned), 2, 2)}</b></div>
					<p className={'text-xs'}>{`Earned, $: ${!stats.isSuccessful ? '-' : format.amount(Number(stats.earned), 2, 2)}`}</p>
				</div>

				<div className={'flex flex-col space-y-2 bg-white p-6'}>
					<p>{'TX fees, ETH'}</p>
					<div><b className={'text-xl'}>{!stats.isSuccessful ? '-' : format.amount(Number(stats.fees), 2, 2)}</b></div>
					<p className={'text-xs'}>{`TX fees, $: ${!stats.isSuccessful ? '-' : format.amount(Number(stats.fees), 2, 2)}`}</p>
				</div>

				<div className={'flex flex-col space-y-2 bg-white p-6'}>
					<p>{'Net earnings, $'}</p>
					<div>
						<b className={'text-xl'}>
							{!stats.isSuccessful ? '-' : format.amount(Number(stats.earned) - Number(stats.fees), 2, 2)}
						</b>
					</div>
				</div>

				<div className={'flex flex-col space-y-2 bg-white p-6'}>
					<p>{'Function calls'}</p>
					<div><b className={'text-xl'}>{!stats.isSuccessful ? '-' : Number(stats.workDone)}</b></div>
				</div>

				<div className={'flex flex-col space-y-2 bg-white p-6'}>
					<p>{'KP3R per call'}</p>
					<div><b className={'text-xl'}>{!stats.isSuccessful ? '-' : format.amount(Number(stats.earned) / stats.workDone, 2, 2)}</b></div>
					<p className={'text-xs'}>{`$ per call ${!stats.isSuccessful ? '-' : format.amount(Number(stats.earned) / stats.workDone, 2, 2)}`}</p>
				</div>

				<div className={'flex flex-col space-y-2 bg-white p-6'}>
					<p>{'Bonded, KP3R'}</p>
					<div><b className={'text-xl'}>{format.toNormalizedAmount(stats.bonds, 18)}</b></div>
					<p className={'text-xs'}>{`Bonded, $: ${format.amount(format.toNormalizedValue(stats.bonds, 18) * prices.keep3rv1, 2, 2)}`}</p>
				</div>

				<div className={'flex flex-col space-y-2 bg-white p-6'}>
					<p>{'Balance, KP3R'}</p>
					<div>
						<b className={'text-xl'}>{format.toNormalizedAmount(stats.balanceOf, 18)}</b>
					</div>
				</div>

				<div className={'flex flex-col items-center justify-center bg-white p-6'}>
					<Button
						onClick={(): void => set_isModalBondOpen(true)}
						variant={'reverted'}>
						{'Become a Keeper'}
					</Button>
				</div>

			</div>
			<div className={'mb-6 space-y-2'}>
				<b className={'text-black-1'}>{'Find a Job'}</b>
				<Input
					value={searchTerm}
					onChange={(s: unknown): void => set_searchTerm(s as string)}
					onSearch={(s: unknown): void => set_searchTerm(s as string)}
					aria-label={'Find a Job'}
					placeholder={'Find a Job'} />
			</div>
			<div>
				<LogsStatsForKeeper
					searchTerm={searchTerm}
					keeperAddress={stats.keeper}
					prices={prices} />
			</div>
			<ModalBond
				isOpen={isModalBondOpen}
				onClose={(): void => set_isModalBondOpen(false)}
				tokenBonded={selectedToken} />
		</main>
	);
}

export async function getServerSideProps({params}: {params: {address: string}}): Promise<unknown> {
	const	address = params.address;
	const	ethcallProvider = await providers.newEthCallProvider(providers.getProvider(1));
	const	keep3rV1 = new Contract(process.env.KEEP3R_V1_ADDR as string, KEEP3RV1_ABI);
	const	keep3rV2 = new Contract(process.env.KEEP3R_V2_ADDR as string, KEEP3RV2_ABI);
	let		balanceOf = '';
	let		bonds = '';

	const	[data, results] = await Promise.allSettled([
		axios.get(`${process.env.BACKEND_URI as string}/works/keeper/${address}`),
		ethcallProvider.tryAll([
			keep3rV1.balanceOf(address),
			keep3rV2.bonds(address, process.env.KP3R_TOKEN_ADDR as string)
		])
	]);
	if (results.status === 'fulfilled') {
		balanceOf = (results.value[0] as BigNumber).toString();
		bonds = (results.value[1] as BigNumber).toString();
	}
	if (data.status === 'rejected') {
		const	keeperStats: TStatsAddressData = {
			balanceOf: balanceOf,
			bonds: bonds,
			keeper: toAddress(address),
			earned: '',
			fees: '',
			gwei: '',
			workDone: 0,
			isSuccessful: false
		};
		return {props: {stats: keeperStats, prices: {keep3rv1: 0, ethereum: 0}}};
	}

	const	keeperDetails = data.value.data.works[0];
	const	prices = data.value.data.prices;
	const	keeperStats: TStatsAddressData = {
		balanceOf: balanceOf,
		bonds: bonds,
		keeper: keeperDetails.keeper,
		earned: keeperDetails.earned,
		fees: keeperDetails.fees,
		gwei: keeperDetails.gwei,
		workDone: keeperDetails.workDone,
		isSuccessful: true
	};
	
	return {props: {stats: keeperStats, prices: {keep3rv1: prices.keep3r, ethereum: prices.ethereum}}};
}
export default StatsKeeper;
