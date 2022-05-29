import	React, {ReactElement}		from	'react';
import	{Chevron}					from	'@yearn/web-lib/icons';
import	LogoConvex					from	'components/icons/LogoConvex';
import	LogoLido					from	'components/icons/LogoLido';
import	IconKeep3r					from	'components/icons/IconKeep3r';
import	IconWEth					from	'components/icons/IconWEth';
import	{Listbox, Transition}		from	'@headlessui/react';

const	keeperToken = {
	name: 'kLP-KP3R/WETH',
	address: process.env.KLP_KP3R_WETH_ADDR as string,
	icon: <IconKeep3r className={'w-8 h-8'}/>
};

const 	tokenList = [
	{name: 'CVX', address: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b', icon: <LogoConvex className={'w-8 h-8'}/>},
	{name: 'Lido', address: '0x5a98fcbea516cf06857215779fd812ca3bef1b32', icon: <LogoLido className={'w-8 h-8'}/>}
	// {name: 'WTF', address: '0xA68Dd8cB83097765263AdAD881Af6eeD479c4a33', icon: <IconKeep3r className={'w-8 h-8'}/>} //DEBUG

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
					<Listbox.Button className={'flex flex-row justify-between items-center p-2 bg-grey-3 hover:bg-grey-4'}>
						<div className={'flex flex-row items-center space-x-2'}>
							{selected.address === '0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44' ? (
								<div className={'flex flex-row -space-x-4 w-12 h-8'}>
									<IconWEth className={'w-8 h-8'} />
									<IconKeep3r className={'w-8 h-8'} />
								</div>
							) : (
								<div className={'w-8 h-8'}>
									{selected.icon}
								</div>
							)}
							<b className={'text-base'}>{selected.name}</b>
						</div>
						<span className={'flex absolute inset-y-0 right-0 items-center pr-2 pointer-events-none'}>
							<Chevron className={`text-black transition-transform ${open ? '-rotate-90' : '-rotate-180'}`}/>
						</span>
					</Listbox.Button>
					<Transition
						as={React.Fragment}
						leave={'transition ease-in duration-100'}
						leaveFrom={'opacity-100'}
						leaveTo={'opacity-0'}>
						<Listbox.Options className={'overflow-auto absolute z-10 mt-1 w-full max-h-60 bg-grey-3'}>
							{(withKeeper ? [keeperToken, ...tokenList] : tokenList).map((token, tokenIdx): ReactElement => (
								<Listbox.Option
									key={tokenIdx}
									className={'relative p-2 bg-grey-3 hover:bg-grey-4 transition-colors cursor-pointer select-none'}
									value={token}>
									<div className={'flex flex-row items-center space-x-2'}>
										{token.address === '0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44' ? (
											<div className={'flex flex-row -space-x-4 w-12 h-8'}>
												<IconWEth className={'w-8 h-8'} />
												<IconKeep3r className={'w-8 h-8'} />
											</div>
										) : (
											<div className={'w-8 h-8'}>
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
		<div className={'flex flex-row justify-between items-center p-2 bg-grey-3'}>
			<div className={'flex flex-row items-center space-x-2'}>
				<div className={'w-8 h-8 bg-black rounded-full'}>
					<IconKeep3r className={'w-8 h-8'} />
				</div>
				<b className={'text-base'}>{name}</b>
			</div>
			<Chevron className={'opacity-0 -rotate-90'}/>
		</div>
	);
}

const TokenDropdown = Object.assign(TokenDropdownBase, {Fake: TokenDropdownFake});
export default TokenDropdown;
