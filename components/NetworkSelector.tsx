import	React, {ReactElement}	from	'react';
import	{Menu, Transition}		from	'@headlessui/react';
import	{Chevron}				from	'@yearn-finance/web-lib/icons';
import	{useWeb3}				from	'@yearn-finance/web-lib/contexts';

function	NetworkSelector(): ReactElement {
	const	{chainID, onSwitchChain} = useWeb3();
	const	options = [
		{label: 'Ethereum Mainnet', value: 1},
		{label: 'Fantom Opera', value: 250}
	];
	const	selected = options.find((e): boolean => e.value === Number(chainID)) || options[0];
	const	defaultOption = options[0];
	
	return (
		<Menu as={'menu'} className={'relative inline-block text-left'}>
			{({open}): ReactElement => (
				<>
					<Menu.Button className={'flex h-auto items-center justify-between p-0 hover:bg-black'}>
						<b className={'text-grey-2'}>{selected?.label || defaultOption.label}</b>
						<Chevron className={`ml-3 h-4 w-4 text-grey-2 transition-transform${open ? '-rotate-90' : '-rotate-180'}`} />
					</Menu.Button>
					<Transition
						as={React.Fragment}
						show={open}
						enter={'transition duration-100 ease-out'}
						enterFrom={'transform scale-95 opacity-0'}
						enterTo={'transform scale-100 opacity-100'}
						leave={'transition duration-75 ease-out'}
						leaveFrom={'transform scale-100 opacity-100'}
						leaveTo={'transform scale-95 opacity-0'}>
						<Menu.Items className={'absolute left-0 mt-4 flex max-h-60 w-full min-w-fit flex-col overflow-y-scroll border-0 bg-black-2'}>
							{options.map((option): ReactElement => (
								<Menu.Item key={option.value}>
									{({active}): ReactElement => (
										<div
											onClick={(): void => onSwitchChain(option.value)}
											className={`flex cursor-pointer flex-row items-center py-2 pr-4 pl-3 font-bold text-grey-2 transition-colors ${active ? 'text-white' : ''}`}>
											<p className={'text-inherit'}>{option.label}</p>
										</div>
									)}
								</Menu.Item>
							))}
						</Menu.Items>
					</Transition>
				</>
			)}
		</Menu>
	);
}

export default NetworkSelector;