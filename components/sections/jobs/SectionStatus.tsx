import	React, {ReactElement}					from	'react';
import	{Copy, LinkOut}							from	'@yearn/web-lib/icons';
import	{format, truncateHex, copyToClipboard}	from	'@yearn/web-lib/utils';
import	useJob									from	'contexts/useJob';
import	{usePrices}								from	'@yearn/web-lib';

function	SectionStatus(): ReactElement {
	const	{jobStatus} = useJob();
	const	{prices} = usePrices();

	return (
		<div className={'flex flex-col p-6 space-y-6 bg-white'}>
			<b className={'text-xl'}>{'STATUS'}</b>
			<div className={'space-y-2'}>
				<b>{'Credits'}</b>
				<dl className={'space-y-2'}>
					<div className={'flex flex-row'}>
						<dt className={'w-1/2'}>{'Current credits, KP3R'}</dt>
						<dd>
							{!jobStatus.isLoaded ? '-' : format.toNormalizedAmount(jobStatus?.jobLiquidityCredits || 0, 18)}
						</dd>
					</div>
					<div className={'flex flex-row'}>
						<dt className={'w-1/2'}>{'Pending credits, KP3R'}</dt>
						<dd>
							{!jobStatus.isLoaded ? '-' : format.toNormalizedAmount(jobStatus?.totalJobCredits || 0, 18)}
						</dd>
					</div>
					<div className={'flex flex-row'}>
						<dt className={'w-1/2'}>{'Per call, KP3R'}</dt>
						<dd>
							{!jobStatus.isLoaded ? '-' : format.amount(jobStatus.averageEarned, 6, 6)}
						</dd>
					</div>
					<div className={'flex flex-row'}>
						<dt className={'w-1/2'}>{'Refill schedule, KP3R/Days'}</dt>
						<dd>
							{!jobStatus.isLoaded ? '-' : format.amount(Number(format.units(jobStatus.jobPeriodCredits, 18)) / 5, 6, 6)}
						</dd>
					</div>
				</dl>
			</div>

			<div className={'space-y-2'}>
				<b>{'Liquidity'}</b>
				<dl className={'space-y-2'}>
					<div className={'flex flex-row'}>
						<dt className={'w-1/2'}>{'Total, kLP-KP3R/WETH'}</dt>
						<dd>
							{!jobStatus.isLoaded ? '-' : format.toNormalizedAmount(jobStatus?.liquidityAmount || 0, 18)}
						</dd>
					</div>
				</dl>
			</div>

			<div className={'space-y-2'}>
				<b>{'Function calls'}</b>
				<dl className={'space-y-2'}>
					<div className={'flex flex-row'}>
						<dt className={'w-1/2'}>{'Total, #'}</dt>
						<dd>
							{!jobStatus.isLoaded ? '-' : jobStatus.workDone}
						</dd>
					</div>
					<div className={'flex flex-row'}>
						<dt className={'w-1/2'}>{'Per day, #'}</dt>
						<dd>
							{!jobStatus.isLoaded ? '-' : format.amount(jobStatus.averageWorkDonePerDay, 2, 2)}
						</dd>
					</div>
					<div className={'flex flex-row'}>
						<dt className={'w-1/2'}>{'Last'}</dt>
						<dd>
							{!jobStatus.isLoaded ? '-' : jobStatus?.lastWork}
						</dd>
					</div>
				</dl>
			</div>

			<div className={'space-y-2'}>
				<b>{'Fees'}</b>
				<dl className={'space-y-2'}>
					<div className={'flex flex-row'}>
						<dt className={'w-1/2'}>{'Total, $'}</dt>
						<dd>
							{!jobStatus.isLoaded ? '-' : format.amount(jobStatus.totalFees * Number(prices?.ethereum?.usd || 0), 2, 2)}
						</dd>
					</div>
					<div className={'flex flex-row'}>
						<dt className={'w-1/2'}>{'Per call, $'}</dt>
						<dd>
							{!jobStatus.isLoaded ? '-' : format.amount(jobStatus.averageFees * Number(prices?.ethereum?.usd || 0), 2, 2)}
						</dd>
					</div>
				</dl>
			</div>

			<div className={'space-y-2'}>
				<b>{'Keepers'}</b>
				<dl className={'space-y-2'}>
					<div className={'flex flex-row'}>
						<dt className={'w-1/2'}>{'Active keepers, #'}</dt>
						<dd>
							{!jobStatus.isLoaded ? '-' : format.amount(jobStatus.uniqueKeepers, 0, 0)}
						</dd>
					</div>
					<div className={'flex flex-row'}>
						<dt className={'w-1/2'}>{'Calls per keeper, #'}</dt>
						<dd>
							{!jobStatus.isLoaded ? '-' : format.amount(jobStatus.workPerKeeper, 2, 2)}
						</dd>
					</div>
				</dl>
			</div>

			<div>
				<dl>
					<div className={'flex flex-row'}>
						<dt className={'w-1/2'}>{'Owner'}</dt>
						<dd className={'flex flex-row items-center space-x-2'}>
							<b>{truncateHex(jobStatus.jobOwner, 5)}</b>
							<div><Copy onClick={(): void => copyToClipboard(jobStatus.jobOwner)} className={'w-6 h-6 text-black cursor-pointer'} /></div>
							<div>
								<a href={`https://etherscan.io/address/${jobStatus.jobOwner}`} target={'_blank'} rel={'noopener noreferrer'}>
									<LinkOut className={'w-6 h-6 text-black cursor-pointer'} />
								</a>
							</div>
						</dd>
					</div>
				</dl>
			</div>
		</div>
	);
}

export default SectionStatus;