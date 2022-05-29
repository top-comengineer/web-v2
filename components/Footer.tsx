import	React, {ReactElement}		from	'react';
import	IconTwitter					from	'components/icons/IconTwitter';
import	IconMedium					from	'components/icons/IconMedium';
// import	IconDiscord					from	'components/icons/IconDiscord';
import	IconDiscourse				from	'components/icons/IconDiscourse';

function	Footer(): ReactElement {
	return (
		<footer className={'py-7 mt-auto w-full bg-grey-3'}>
			<div className={'hidden flex-row items-center mx-auto w-full max-w-6xl md:flex'}>
				<div className={'space-y-1'}>
					<b className={''}>
						{'This project is in beta. Use at your own risk.'}
					</b>
					<div className={'flex flex-row items-center'}>
						{/* <div className={'mr-2 w-2 h-2 bg-black rounded-full'} />
						<p className={'text-xs'}>{'Disconnected'}</p> */}
						<div className={'mr-2 w-2 h-2 bg-transparent rounded-full border border-black'} />
						<p className={'text-xs'}>{'Connected'}</p>
					</div>
				</div>

				<div className={'px-2 ml-auto text-black hover:text-black-2 transition-colors cursor-pointer'}>
					<a href={'https://twitter.com/thekeep3r'} target={'_blank'} rel={'noreferrer'}>
						<IconTwitter className={'w-8 h-8'} />
					</a>
				</div>
				<div className={'px-2 text-black hover:text-black-2 transition-colors cursor-pointer'}>
					<a href={'https://medium.com/iearn'} target={'_blank'} rel={'noreferrer'}>
						<IconMedium className={'w-8 h-8'} />
					</a>
				</div>
				{/* <div className={'px-2 text-black hover:text-black-2 transition-colors cursor-pointer'}>
					<a href={'https://discord.com/invite/9JBxTWR4nZ'} target={'_blank'} rel={'noreferrer'}>
						<IconDiscord className={'w-8 h-8'} />
					</a>
				</div> */}
				<div className={'px-2 text-black hover:text-black-2 transition-colors cursor-pointer'}>
					<a href={'https://gov.yearn.finance/c/projects/keep3r/20'} target={'_blank'} rel={'noreferrer'}>
						<IconDiscourse className={'w-8 h-8'} />
					</a>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
