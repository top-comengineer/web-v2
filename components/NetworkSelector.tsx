import	React, {ReactElement}	from	'react';
import	{Menu, Transition}		from	'@headlessui/react';
import	{Chevron}				from	'@yearn/web-lib/icons';
import	{useWeb3}				from	'@yearn/web-lib/contexts';

function	NetworkSelector(): ReactElement {
	const	{chainID, onSwitchChain} = useWeb3();
	const	options = [
		{label: 'Ethereum Mainnet', value: 1},
		{label: 'Fantom Opera', value: 250}
	];
	const	selected = options.find((e): boolean => e.value === Number(chainID)) || options[0];
	const	defaultOption = options[0];
	
	return (
		<Menu as={'menu'} className={'inline-block relative text-left'}>
			{({open}): ReactElement => (
				<>
					<Menu.Button className={'flex justify-between items-center p-0 h-auto hover:bg-black'}>
						<b className={'text-grey-2'}>{selected?.label || defaultOption.label}</b>
						<Chevron className={`text-grey-2 ml-3 w-4 h-4 transition-transform transform ${open ? '-rotate-90' : '-rotate-180'}`} />
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
						<Menu.Items className={'flex overflow-y-scroll absolute left-0 flex-col mt-4 w-full min-w-fit max-h-60 bg-black-2 border-0'}>
							{options.map((option): ReactElement => (
								<Menu.Item key={option.value}>
									{({active}): ReactElement => (
										<div
											onClick={(): void => onSwitchChain(option.value)}
											className={`flex flex-row items-center text-grey-2 font-bold cursor-pointer py-2 pr-4 pl-3 transition-colors ${active ? 'text-white' : ''}`}>
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