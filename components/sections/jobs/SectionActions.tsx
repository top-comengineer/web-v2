import	React, {ReactElement}					from	'react';
import	{Tab}									from	'@headlessui/react';
import	SectionActionsAddLiquidity				from	'components/sections/jobs/SectionActionsAddLiquidity';
import	SectionActionsWithdrawLiquidity			from	'components/sections/jobs/SectionActionsWithdrawLiquidity';
import	SectionActionsManageLiquidity			from	'components/sections/jobs/SectionActionsManageLiquidity';

function	SectionActions(): ReactElement {
	return (
		<div>
			<Tab.Group>
				<Tab.List className={'flex w-full flex-row'}>
					<Tab
						className={({selected}): string => `hover:bg-grey-4 focus:outline-none w-full h-20 border-b-4 flex-center cursor-pointer p-0 ${selected ? 'border-black font-bold text-black' : 'text-grey-2 border-0 border-grey-3 transition-colors font-normal'}`}>
						<p className={'text-center text-lg text-inherit'}>{'Add liquidity'}</p>
					</Tab>
					<Tab
						className={({selected}): string => `hover:bg-grey-4 focus:outline-none w-full h-20 border-b-4 flex-center cursor-pointer p-0 ${selected ? 'border-black font-bold text-black' : 'text-grey-2 border-0 border-grey-3 transition-colors font-normal'}`}>
						<p className={'text-center text-lg text-inherit'}>{'Withdraw liquidity'}</p>
					</Tab>
					<Tab
						className={({selected}): string => `hover:bg-grey-4 focus:outline-none w-full h-20 border-b-4 flex-center cursor-pointer p-0 ${selected ? 'border-black font-bold text-black' : 'text-grey-2 border-0 border-grey-3 transition-colors font-normal'}`}>
						<p className={'text-center text-lg text-inherit'}>{'Manage directly'}</p>
					</Tab>
				</Tab.List>
				<Tab.Panels className={'w-full rounded-t-none'}>
					<Tab.Panel>
						<SectionActionsAddLiquidity />
					</Tab.Panel>
					<Tab.Panel>
						<SectionActionsWithdrawLiquidity />
					</Tab.Panel>
					<Tab.Panel>
						<SectionActionsManageLiquidity />
					</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
}

export default SectionActions;