import	React, {ReactElement}		from	'react';
import	{Chevron}					from	'@yearn-finance/web-lib/icons';
import	IconKeep3r					from	'components/icons/IconKeep3r';
import	IconWEth						from	'components/icons/IconWEth';

type		TTokenPairDropdown = {
	name: string,
}
function	TokenPairDropdown({name}: TTokenPairDropdown): ReactElement {
	return (
		<div className={'flex flex-row items-center justify-between bg-grey-3 p-2'}>
			<div className={'flex flex-row items-center space-x-2'}>
				<div className={'flex h-8 w-12 flex-row -space-x-4'}>
					<IconWEth className={'h-8 w-8'} />
					<IconKeep3r className={'h-8 w-8'} />
				</div>
				<b>{name}</b>
			</div>
			<Chevron className={'-rotate-90 opacity-0'}/>
		</div>
	);
}

export default TokenPairDropdown;
