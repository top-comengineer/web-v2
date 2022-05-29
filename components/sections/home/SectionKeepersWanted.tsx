import	React, {ReactElement}	from	'react';
import	{Button}				from	'@yearn/web-lib/components';
import	{format}				from	'@yearn/web-lib/utils';
import	Line					from	'components/Line';
import	TokenDropdown			from	'components/TokenDropdown';
import	{ModalBond}				from	'components/modals/ModalBond';
import	{ModalUnbond}			from	'components/modals/ModalUnbond';
import	useKeep3r				from	'contexts/useKeep3r';

function	SectionKeepersWanted(): ReactElement {
	const	{keeperStatus} = useKeep3r();
	const	[selectedToken] = React.useState(process.env.KP3R_TOKEN_ADDR as string);
	const	[isModalBondOpen, set_isModalBondOpen] = React.useState(false);
	const	[isModalUnBondOpen, set_isModalUnBondOpen] = React.useState(false);

	return (
		<section aria-label={'KEEPERS WANTED'}>
			<h2 className={'text-xl font-bold'}>{'KEEPERS WANTED'}</h2>
			<div className={'mt-4 mb-6'}>
				<p>{'Join '}<a className={'underline'} href={'#'}>{'keep3r.network'}</a>{' as a keeper, help running decentralized infrastructures and get paid for this. '}</p>
			</div>

			<TokenDropdown.Fake name={'KP3R'} />

			<div className={'my-4'}>
				<dl className={'space-y-4 w-full'}>
					<div className={'flex overflow-hidden relative flex-row justify-between items-center w-full'}>
						<dt className={'pr-2 whitespace-nowrap bg-grey-5'}>{'Balance'}</dt>
						<dd className={'w-full font-bold'}>
							<div className={'absolute bottom-1.5 -z-10 w-full'}>
								<Line />
							</div>
							<div className={'flex justify-end'}>
								<p className={'pl-1 text-right bg-grey-5'}>
									{`${format.toNormalizedAmount(keeperStatus?.balanceOf, 18)} KP3R`}
								</p>
							</div>
						</dd>
					</div>

					<div className={'flex overflow-hidden relative flex-row justify-between items-center w-full'}>
						<dt className={'pr-2 whitespace-nowrap bg-grey-5'}>{'Bonds'}</dt>
						<dd className={'w-full font-bold'}>
							<div className={'absolute bottom-1.5 -z-10 w-full'}>
								<Line />
							</div>
							<div className={'flex justify-end'}>
								<p className={'pl-1 text-right bg-grey-5'}>
									{`${format.toNormalizedAmount(keeperStatus.bonds, 18)} KP3R`}
								</p>
							</div>
						</dd>
					</div>

					<div className={'flex overflow-hidden relative flex-row justify-between items-center w-full'}>
						<dt className={'pr-2 whitespace-nowrap bg-grey-5'}>{'Work Completed'}</dt>
						<dd className={'w-full font-bold'}>
							<div className={'absolute bottom-1.5 -z-10 w-full'}>
								<Line />
							</div>
							<div className={'flex justify-end'}>
								<p className={'pl-1 text-right bg-grey-5'}>{'0'}</p>
							</div>
						</dd>
					</div>
				</dl>
			</div>

			<div className={'mb-10'}>
				<div className={'grid grid-cols-2 gap-2 w-full'}>
					<Button onClick={(): void => set_isModalBondOpen(true)}>{'Bond'}</Button>
					<Button onClick={(): void => set_isModalUnBondOpen(true)}>{'Unbond'}</Button>
				</div>
			</div>
			<ModalBond
				isOpen={isModalBondOpen}
				onClose={(): void => set_isModalBondOpen(false)}
				tokenBonded={selectedToken} />
			<ModalUnbond
				isOpen={isModalUnBondOpen}
				onClose={(): void => set_isModalUnBondOpen(false)}
				tokenBonded={selectedToken} />
		</section>
	);
}

export default SectionKeepersWanted;
