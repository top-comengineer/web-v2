import	React, {ReactElement}				from	'react';
import	Head								from	'next/head';
import	{Toaster}							from	'react-hot-toast';
import	Link								from	'next/link';
import	{AppProps}							from	'next/app';
import	{DefaultSeo}						from	'next-seo';
import	NProgress							from	'nprogress';
import	{WithYearn, usePrices, useWeb3}		from	'@yearn/web-lib/contexts';
import	{format, truncateHex}				from	'@yearn/web-lib/utils';
import	{Keep3rContextApp}					from	'contexts/useKeep3r';
import	{TreasuryContextApp}				from	'contexts/useTreasury';
import	{PairsContextApp}					from	'contexts/usePairs';
import	{JobContextApp}						from	'contexts/useJob';
import	{ModalLogin}						from	'components/modals/ModalLogin';
import	Footer								from	'components/Footer';
import	LogoKeep3r							from	'components/icons/Keep3r';

import	'../style.css';

/* 📰 - Keep3r *****************************************************************
** Setup the Head part of for the website, aka the meta elements, the favicons
** and all other related stuff.
******************************************************************************/
function	AppHead(): ReactElement {
	return (
		<>
			<Head>
				<title>{process.env.WEBSITE_NAME}</title>
				<meta httpEquiv={'X-UA-Compatible'} content={'IE=edge'} />
				<meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
				<meta name={'description'} content={process.env.WEBSITE_NAME} />

				<link rel={'apple-touch-icon'} sizes={'57x57'} href={'/favicons/apple-icon-57x57.png'} />
				<link rel={'apple-touch-icon'} sizes={'60x60'} href={'/favicons/apple-icon-60x60.png'} />
				<link rel={'apple-touch-icon'} sizes={'72x72'} href={'/favicons/apple-icon-72x72.png'} />
				<link rel={'apple-touch-icon'} sizes={'76x76'} href={'/favicons/apple-icon-76x76.png'} />
				<link rel={'apple-touch-icon'} sizes={'114x114'} href={'/favicons/apple-icon-114x114.png'} />
				<link rel={'apple-touch-icon'} sizes={'120x120'} href={'/favicons/apple-icon-120x120.png'} />
				<link rel={'apple-touch-icon'} sizes={'144x144'} href={'/favicons/apple-icon-144x144.png'} />
				<link rel={'apple-touch-icon'} sizes={'152x152'} href={'/favicons/apple-icon-152x152.png'} />
				<link rel={'apple-touch-icon'} sizes={'180x180'} href={'/favicons/apple-icon-180x180.png'} />
				<link rel={'icon'} type={'image/png'} sizes={'192x192'}  href={'/favicons/android-icon-192x192.png'} />
				<link rel={'icon'} type={'image/png'} sizes={'32x32'} href={'/favicons/favicon-32x32.png'} />
				<link rel={'icon'} type={'image/png'} sizes={'96x96'} href={'/favicons/favicon-96x96.png'} />
				<link rel={'icon'} type={'image/png'} sizes={'16x16'} href={'/favicons/favicon-16x16.png'} />
				<link rel={'manifest'} href={'/favicons/manifest.json'} />
				<meta name={'msapplication-TileColor'} content={'#ffffff'} />
				<meta name={'msapplication-TileImage'} content={'/favicons/ms-icon-144x144.png'} />
				<meta name={'theme-color'} content={'#ffffff'} />

				<meta name={'robots'} content={'index,nofollow'} />
				<meta name={'googlebot'} content={'index,nofollow'} />
				<meta charSet={'utf-8'} />
			</Head>
			<DefaultSeo
				title={process.env.WEBSITE_NAME}
				defaultTitle={process.env.WEBSITE_NAME}
				description={process.env.WEBSITE_DESCRIPTION}
				openGraph={{
					type: 'website',
					locale: 'en_US',
					url: process.env.WEBSITE_URI,
					site_name: process.env.WEBSITE_NAME,
					title: process.env.WEBSITE_NAME,
					description: process.env.WEBSITE_DESCRIPTION,
					images: [
						{
							url: `${process.env.WEBSITE_URI}og.png`,
							width: 1500,
							height: 500,
							alt: '@thekeep3r'
						}
					]
				}}
				twitter={{
					handle: '@thekeep3r',
					site: '@thekeep3r',
					cardType: 'summary_large_image'
				}} />
		</>
	);
}

/* 📰 - Keep3r *****************************************************************
** Little hack in order to get the correct context based on the page. In short,
** if the router is on the /jobs pages, we need to get the jobContext.
******************************************************************************/
function	AppWithContexts(props: AppProps): ReactElement {
	const	{Component, pageProps, router} = props;

	React.useEffect((): (() => void) => {
		const handleStart = (): void => NProgress.start();
		const handleStop = (): void => NProgress.done();
	
		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleStop);
		router.events.on('routeChangeError', handleStop);

		return (): void => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleStop);
			router.events.off('routeChangeError', handleStop);
		};
	}, [router]);

	if (router.asPath.startsWith('/jobs/')) {
		return (
			<JobContextApp jobAddress={router?.query?.address as string}>
				<Component {...pageProps} />
			</JobContextApp>
		);
	}
	return (
		<Component {...pageProps} />
	);
}

/* 📰 - Keep3r *****************************************************************
** Add some layout to our app, aka a header with the token price and the
** current wallet (network selector later too), the footer and some extra
** elements.
******************************************************************************/
function	AppWithLayout(props: AppProps): ReactElement {
	const	{Component, pageProps, router} = props;
	const	{pathname} = router;
	const	{prices} = usePrices();
	const	{isActive, hasProvider, onSwitchChain, address, ens, onDesactivate} = useWeb3();
	const	[tokenPrice, set_tokenPrice] = React.useState('0');
	const	[walletIdentity, set_walletIdentity] = React.useState('Connect wallet');
	const	[isOpenModalLogin, set_isOpenModalLogin] = React.useState(false);

	React.useEffect((): void => {
		set_tokenPrice(format.amount(Number(prices?.keep3rv1?.usd || 0), 2));
	}, [prices]);

	React.useEffect((): void => {
		if (!isActive && !hasProvider) {
			set_walletIdentity('Connect wallet');
		} else if (!isActive && hasProvider) {
			set_walletIdentity('Switch chain');
		} else if (ens) {
			set_walletIdentity(ens);
		} else if (address) {
			set_walletIdentity(truncateHex(address, 5));
		} else {
			set_walletIdentity('Connect wallet');
		}
	}, [ens, address, isActive, hasProvider]);

	function	onLoginClick(): void {
		if (!isActive && !hasProvider) {
			set_isOpenModalLogin(true);
		} else if (!isActive && hasProvider) {
			onSwitchChain(1, true);
		} else {
			onDesactivate();
		}
	}

	return (
		<>
			<AppHead />
			<div className={'px-4 bg-black'}>
				<Link href={'/'}>
					<div className={'flex justify-center items-center h-32'}>
						<LogoKeep3r />
					</div>
				</Link>
			</div>
			<div className={'sticky top-0 z-50 bg-black'}>
				<div className={'hidden flex-row justify-between mx-auto w-full max-w-6xl h-14 md:flex'}>
					<nav className={'flex flex-row items-end'}>
						<Link href={'/'}>
							<div aria-selected={pathname === '/'} className={'pr-5 menu_item'}>
								<b>{'Jobs'}</b>
								<div />
							</div>
						</Link>
						<Link href={'/stats'}>
							<div aria-selected={pathname.startsWith('/stats')} className={'px-5 menu_item'}>
								<b>{'Stats'}</b>
								<div />
							</div>
						</Link>
						<Link href={'/treasury'}>
							<div aria-selected={pathname === '/treasury'} className={'px-5 menu_item'}>
								<b>{'Treasury'}</b>
								<div />
							</div>
						</Link>
						{/* <div aria-selected={pathname === '/about'} className={'px-5 menu_item'}>
							<b>{'About'}</b>
							<div />
						</div> */}
						<Link href={'/disputes'}>
							<div aria-selected={pathname === '/disputes'} className={'px-5 menu_item'}>
								<b>{'Disputes'}</b>
								<div />
							</div>
						</Link>
						<a href={'https://v1.keep3r.network/'} target={'_blank'} rel={'noopener noreferrer'}>
							<div aria-selected={pathname === 'v1'} className={'pl-5 menu_item'}>
								<b>{'v1'}</b>
								<div />
							</div>
						</a>
					</nav>
					<div className={'flex flex-row items-end'}>
						<div className={'flex flex-col mr-5 space-y-3'}>
							<a
								className={'font-bold text-grey-2 underline'}
								target={'_blank'}
								href={'https://cowswap.exchange/#/swap?outputCurrency=0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44&referral=0x0D5Dc686d0a2ABBfDaFDFb4D0533E886517d4E83'} rel={'noreferrer'}>
								{`KP3R: $${tokenPrice}`}
							</a>
							<div className={'w-full h-1 bg-transparent'} />
						</div>
						<div className={'flex flex-col space-y-3'}>
							<button
								onClick={onLoginClick}
								className={`text-intermediate p-0 h-auto font-bold truncate min-w-[147px] hover:bg-black ${walletIdentity !== 'Connect wallet' ? 'text-white' : 'text-grey-2'}`}>
								{walletIdentity}
							</button>
							<div className={'w-full h-1 bg-transparent'} />
						</div>
					</div>
				</div>
			</div>
			<AppWithContexts Component={Component} pageProps={pageProps} router={router} />
			<Footer />
			<ModalLogin
				isOpen={isOpenModalLogin}
				onClose={(): void => set_isOpenModalLogin(false)} />
		</>
	);
}

/* 📰 - Keep3r *****************************************************************
** Context wrapper for our app.
** WithYearn handles the connection to the blockchain and the wallet.
** Keep3rContext handles some specific keep3r elements
** PairContext handles the data for the supported pairs by Keep3r
** Treasury handles the info needed for the treasury page
******************************************************************************/
function	MyApp(props: AppProps): ReactElement {
	const	{Component, pageProps} = props;
	const	toasterOptions = {
		success: {
			iconTheme: {
				primary: 'black',
				secondary: 'white'
			}
		},
		error: {
			iconTheme: {
				primary: 'black',
				secondary: 'white'
			}
		},
		className: 'text-sm text-typo-primary',
		style: {borderRadius: '0', maxWidth: 500}
	};
	
	return (
		<WithYearn
			options={{
				ui: {
					shouldUseDefaultToaster: false,
					shouldUseTheme: false
				},
				web3: {
					shouldUseStrictChainMode: false,
					defaultChainID: 1,
					supportedChainID: [1, 1337]
				}
			}}>
			<>
				<Toaster
					position={'bottom-right'}
					containerClassName={'!z-[1000000]'}
					containerStyle={{zIndex: 1000000}}
					toastOptions={toasterOptions} />
				<Keep3rContextApp>
					<PairsContextApp>
						<TreasuryContextApp>
							<AppWithLayout
								Component={Component}
								pageProps={pageProps}
								router={props.router} />
						</TreasuryContextApp>
					</PairsContextApp>
				</Keep3rContextApp>
			</>
		</WithYearn>
	);
}

export default MyApp;
