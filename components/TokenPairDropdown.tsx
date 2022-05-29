import	React, {ReactElement}		from	'react';
import	{Chevron}					from	'@yearn/web-lib/icons';
import	IconKeep3r					from	'components/icons/IconKeep3r';
import	IconWEth						from	'components/icons/IconWEth';

type		TTokenPairDropdown = {
	name: string,
}
function	TokenPairDropdown({name}: TTokenPairDropdown): ReactElement {
	return (
		<div className={'flex flex-row justify-between items-center p-2 bg-grey-3'}>
			<div className={'flex flex-row items-center space-x-2'}>
				<div className={'flex flex-row -space-x-4 w-12 h-8'}>
					<IconWEth className={'w-8 h-8'} />
					<IconKeep3r className={'w-8 h-8'} />
				</div>
				<b>{name}</b>
			</div>
			<Chevron className={'opacity-0 -rotate-90'}/>
		</div>
	);
}

export default TokenPairDropdown;
