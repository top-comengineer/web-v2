import	React, {ReactElement}		from	'react';
import	{Chevron}					from	'@yearn-finance/web-lib/icons';
import	LogoConvex					from	'components/icons/LogoConvex';
import	LogoLido					from	'components/icons/LogoLido';
import	IconKeep3r					from	'components/icons/IconKeep3r';
import	IconWEth					from	'components/icons/IconWEth';
import	{Listbox, Transition}		from	'@headlessui/react';

const	keeperToken = {
	name: 'kLP-KP3R/WETH',
	address: process.env.KLP_KP3R_WETH_ADDR as string,
	icon: <IconKeep3r className={'h-8 w-8'}/>
};

const 	tokenList = [
	{name: 'CVX', address: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b', icon: <LogoConvex className={'h-8 w-8'}/>},
	{name: 'Lido', address: '0x5a98fcbea516cf06857215779fd812ca3bef1b32', icon: <LogoLido className={'h-8 w-8'}/>}
];

type		TTokenDropdown = {
	onSelect: (s: string) => void,
	withKeeper?: boolean
}
function	TokenDropdownBase({onSelect, withKeeper}: TTokenDropdown): ReactElement {
	const [selected, set_selected] = React.useState(withKeeper ? keeperToken : tokenList[0]);
  
	React.useEffect((): void => {
		if (withKeeper) {
			onSelect(keeperToken.address);
		} else {
			onSelect(tokenList[0].address);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<Listbox
			value={selected}
			onChange={(v): void => {
				set_selected(v);
				onSelect(v.address);
			}}>
			{({open}): ReactElement => (
				<div className={'relative'}>
					<Listbox.Button className={'flex w-full flex-row items-center justify-between !bg-grey-3 p-2 hover:!bg-grey-4'}>
						<div className={'flex flex-row items-center space-x-2'}>
							{selected.address === '0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44' ? (
								<div className={'flex h-8 w-12 flex-row -space-x-4'}>
									<IconWEth className={'h-8 w-8'} />
									<IconKeep3r className={'h-8 w-8'} />
								</div>
							) : (
								<div className={'h-8 w-8'}>
									{selected.icon}
								</div>
							)}
							<b className={'text-base'}>{selected.name}</b>
						</div>
						<span className={'pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'}>
							<Chevron className={`text-black transition-transform ${open ? '-rotate-90' : '-rotate-180'}`}/>
						</span>
					</Listbox.Button>
					<Transition
						as={React.Fragment}
						leave={'transition ease-in duration-100'}
						leaveFrom={'opacity-100'}
						leaveTo={'opacity-0'}>
						<Listbox.Options className={'absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-grey-3'}>
							{(withKeeper ? [keeperToken, ...tokenList] : tokenList).map((token, tokenIdx): ReactElement => (
								<Listbox.Option
									key={tokenIdx}
									className={'relative cursor-pointer select-none bg-grey-3 p-2 transition-colors hover:bg-grey-4'}
									value={token}>
									<div className={'flex flex-row items-center space-x-2'}>
										{token.address === '0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44' ? (
											<div className={'flex h-8 w-12 flex-row -space-x-4'}>
												<IconWEth className={'h-8 w-8'} />
												<IconKeep3r className={'h-8 w-8'} />
											</div>
										) : (
											<div className={'h-8 w-8'}>
												{token.icon}
											</div>
										)}
										<b>{token.name}</b>
									</div>
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			)}
		</Listbox>
	);
}
  

type		TTokenDropdownFake = {name: string}
function	TokenDropdownFake({name}: TTokenDropdownFake): ReactElement {
	return (
		<div className={'flex flex-row items-center justify-between bg-grey-3 p-2'}>
			<div className={'flex flex-row items-center space-x-2'}>
				<div className={'h-8 w-8 rounded-full bg-black'}>
					<IconKeep3r className={'h-8 w-8'} />
				</div>
				<b className={'text-base'}>{name}</b>
			</div>
			<Chevron className={'-rotate-90 opacity-0'}/>
		</div>
	);
}

const TokenDropdown = Object.assign(TokenDropdownBase, {Fake: TokenDropdownFake});
export default TokenDropdown;
