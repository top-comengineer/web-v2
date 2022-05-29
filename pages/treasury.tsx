import	React, {ReactElement}		from	'react';
import	{format}					from	'@yearn/web-lib/utils';
import	useTreasury					from	'contexts/useTreasury';
import	LogoConvex					from	'components/icons/LogoConvex';
import	LogoYearn					from	'components/icons/LogoYearn';

function	Treasury(): ReactElement {
	const	{treasury} = useTreasury();
	const	[tvlUSD, set_tvlUSD] = React.useState<number>(0);

	React.useEffect((): void => {
		const	totalUSD = treasury.reduce((acc, curr): number => acc + curr.tokenStakedUSD, 0);
		set_tvlUSD(totalUSD);
	}, [treasury]);

	return (
		<>
			<section aria-label={'general statistics'} className={'mb-6 bg-grey-3'}>
				<div className={'flex justify-center items-center py-6 px-4 md:px-0'}>
					<div className={'space-y-2 text-center'}>
						<p>{'TVL'}</p>
						<div><b className={'text-2xl'}>
							{`$ ${format.amount(tvlUSD, 2, 2)}`}
						</b></div>
					</div>
				</div> 
			</section>
			<main className={'flex flex-col col-span-12 px-4 mx-auto mb-10 w-full max-w-6xl min-h-[100vh]'}>
				<div className={'flex flex-col space-y-6'}>
					{treasury.sort((a, b): number => b.tokenStakedUSD - a.tokenStakedUSD).map((treasure): ReactElement => (
						<div key={treasure.name} className={'p-6 bg-white'}>
							<p>{'Protocol'}</p>
							<div className={'flex items-center mt-2 space-x-2'}>
								{
									treasure.protocol === 'Convex' ?
										<LogoConvex /> :
										treasure.protocol === 'Yearn' ?
											<LogoYearn /> : <div />
								}
								<h3 className={'text-2xl font-bold'}>{treasure.protocol}</h3>
							</div>
							<div className={'grid grid-cols-1 gap-4 mt-6 md:grid-cols-3 md:mt-10'}>
								<div>
									<p>{'Token staked'}</p>
									<div className={'py-0 md:pt-2 md:pb-1'}><b className={'text-2xl'}>{format.amount(treasure.tokenStaked, 2, 2)}</b></div>
									<p className={'text-xs'}>{treasure.name}</p>
								</div>

								<div>
									<p>{'Token staked, $'}</p>
									<div className={'py-0 md:pt-2 md:pb-1'}><b className={'text-2xl'}>{format.amount(treasure.tokenStakedUSD, 2, 2)}</b></div>
								</div>

								{treasure.hasNoRewards ? 
									<div /> :
									<>
										{/* <div>
											<p>{'Unclaimed rewards'}</p>
											<div className={'py-0 md:pt-2 md:pb-1'}><b className={'text-2xl'}>{format.amount(treasure.unclaimedRewards, 2, 2)}</b></div>
											<p className={'text-xs'}>{treasure.rewards}</p>
										</div> */}

										<div>
											<p>{'Unclaimed rewards, $'}</p>
											<div className={'py-0 md:pt-2 md:pb-1'}><b className={'text-2xl'}>{format.amount(treasure.unclaimedRewardsUSD, 2, 2)}</b></div>
										</div>
									</>
								}
							</div>
						</div>
					))}
				</div>
			</main>
		</>
	);
}

export default Treasury;
