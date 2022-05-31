import	React, {ReactElement}	from	'react';
import Image from 'next/image';

function	IconGem(props: React.SVGProps<SVGSVGElement>): ReactElement {
	return (
		<svg {...props} width={'16'} height={'16'} viewBox={'0 0 16 16'} fill={'none'} xmlns={'http://www.w3.org/2000/svg'}>
			<path d={'M8 0L16 8L8 16L0 8L8 0Z'} fill={'black'}/>
		</svg>
	);
}

function	LogoFont(): ReactElement {
	return (
		<svg width={'159'} height={'39'} viewBox={'0 0 159 39'} fill={'none'} xmlns={'http://www.w3.org/2000/svg'}>
			<path d={'M18.24 0.239998L7.72 6.68C8.76 4.96 10.24 3.6 12 2.68L11.6 2.12C5.8 4.08 0.68 9.76 0.68 17.2C0.68 24.84 6.68 31.72 14.32 31.72C20.52 31.72 25.32 27.4 25.6 21.4H24.84C23.44 24.2 20.72 26.64 16.96 27.12C16.96 19.96 16.96 12.8 16.96 5.64C18.52 6.52 20.16 7.32 21.84 8L26.6 3.04L26.28 2.64L25 3.68C22.44 2.88 20.24 1.72 18.24 0.239998ZM6.64 21.08C5.96 19.32 5.6 17.28 5.6 15.12C5.6 12.68 6 10.52 6.76 8.64L8.88 7.32C8.88 11.6 8.88 15.84 8.88 20.12L6.64 21.08ZM7.08 22.04L14.04 19.12V4.16L14.36 4C14.84 4.32 15.32 4.64 15.8 4.96C15.8 12.36 15.8 19.8 15.8 27.2C15.76 27.2 15.68 27.2 15.6 27.2C11.52 27.2 8.68 25.16 7.08 22.04ZM36.0262 26.24V16.36L38.2262 14.28L40.6262 16.28V26.44C40.6262 30.6 39.1862 34.48 36.2263 34.48V35.44C36.6263 35.48 37.0263 35.52 37.4662 35.52C44.4263 35.52 45.7863 30.56 45.7863 26.44V15.04L47.5063 13.64L46.8263 12.76L45.2263 14.04L40.9863 10.52L36.0262 15.2V0.360001H35.2662L28.7463 4.96V5.52C30.6662 6.12 30.6662 7 30.6662 7.64V25.84L27.9462 27.56L28.6663 28.48L30.1863 27.52L34.3063 31.04L39.2662 27.56L38.5463 26.68L37.3063 27.52L36.0262 26.24ZM55.7531 24.88V13.4L60.3531 16.44V27.96L55.7531 24.88ZM49.2331 28.32L50.9131 26.96L56.5131 31.04L65.3531 25.64V14.72L59.5931 10.32L50.5931 15.48C50.5931 18.92 50.5931 22.36 50.5931 25.8L48.5531 27.44L49.2331 28.32ZM87.0438 28.04L84.9637 26.2V15.52L87.0838 14.24L89.8438 16.76V26.6L88.1638 28.16L92.1238 31.6L98.0438 27.76V26.28L96.3238 27.56L94.4437 25.68V15.64L96.4438 14L95.7238 13.16L94.4037 14.2L90.2438 10.64L84.7638 14.04L80.7638 10.64L75.5238 13.92L72.6038 10.64L67.0438 14.44L67.6037 15.24L69.1237 14.28L70.6837 16V26.6L69.1237 27.96L73.7237 31.6L77.5638 28.16L75.8438 26.6V15.28L77.6038 14.24L80.3637 16.76V26.6L78.6838 28.16L82.6438 31.6L87.0438 28.04ZM101.703 33.12L102.103 32.04C101.783 31.88 101.543 31.52 101.543 31.08C101.543 30.08 102.463 29.56 103.423 29.56C104.822 29.56 105.823 30.48 106.382 31.4L114.263 26.6V20.56L110.823 18.04C113.062 15.96 113.983 13.68 114.303 10.6H113.182C113.182 10.64 113.182 10.64 113.182 10.64V10.6C113.062 11.56 112.223 12.28 111.183 12.28C109.823 12.28 108.823 11.4 108.263 10.52L99.9825 15.32V20.92L103.023 23.32C99.8625 26.24 99.2225 27.72 99.2225 29.36C99.2225 31.24 100.342 32.56 101.703 33.12ZM106.903 21.4L109.103 23.2V28.4C108.383 26.76 106.743 25.32 104.423 25.32C103.383 25.32 102.383 25.68 101.623 26.28C102.622 25.04 104.023 23.88 105.463 22.64L106.903 21.4ZM106.783 20.04L105.143 18.32V13.12C105.943 15.16 107.703 16.08 109.463 16.08C110.142 16.08 110.823 15.92 111.463 15.64C110.903 16.44 110.302 17 109.743 17.48L106.783 20.04ZM118.78 7.64V25.84L116.1 27.56L116.66 28.36L118.18 27.4L122.42 31.04L127.38 27.56L126.82 26.8L125.66 27.76L124.14 26.24V0.360001H123.38L116.86 4.96V5.52C117.86 5.84 118.78 6.28 118.78 7.64ZM132.26 16.44C135.5 16.44 136.78 13.56 137.18 10.72H136.42C135.94 11.52 135.02 12.24 133.82 12.24C132.62 12.24 131.7 11.52 131.22 10.72H130.86L124.9 19.92L132.78 31.4L138.9 27.4L138.14 26.44L136.42 27.56L128.54 15.88L128.94 15.12C129.74 15.88 130.82 16.44 132.26 16.44ZM144.043 36.16C142.963 36.16 141.883 36.52 141.043 37.16L140.482 36.8C141.363 34.4 143.723 32.36 146.842 32.36C148.683 32.36 150.523 33.16 151.763 34.48C152.643 34.4 153.243 33.68 153.243 32.72C153.243 31.04 152.202 30.92 151.923 28.4L148.123 31.04L142.402 27V15.8L140.923 14.04L139.322 15.04L138.723 14.28L144.123 10.6L147.163 14.28V24.52L151.843 27.44C151.843 27.28 151.843 27.08 151.843 26.92L151.803 15.8L149.643 13.24L153.523 10.6L157.163 14.92V25.48C157.163 28.76 158.282 28.76 158.282 30.24C158.282 32 156.602 32.4 155.563 33.12L148.163 38.36C147.283 37.08 145.923 36.16 144.043 36.16Z'} fill={'black'}/>
		</svg>

	);
}

function	Index(): ReactElement {
	return (
		<main className={'flex flex-col col-span-12 px-4 my-10 mx-auto w-full max-w-6xl min-h-[100vh]'}>
			<section aria-label={'Press Kit'} className={'pl-8'}>
				<div className={'mb-8'}>
					<h2 className={'mb-2 text-6xl font-bold'}>{'Press Kit'}</h2>
					<p>
						{'Download '}
						<a download className={'underline'} href={'/presskit/PressKit.pdf'}>{'PDF'}</a>
					</p>
				</div>

				<section aria-label={'Assets'} className={'mb-20'}>
					<div className={'mb-10'}>
						<div className={'flex relative flex-row items-center mb-6 -ml-8'}>
							<div className={'flex items-center mr-4 w-4 min-w-[16px] h-10'}>
								<IconGem />
							</div>
							<h3 className={'text-3xl font-bold'}>{'Assets'}</h3>
						</div>
						<p>{'SVG assets don\'t lose quality when scaled but they might not be compatible with some platforms.'}</p>
						<p>{'PNG assets lose quality when scaled but they have wide compatibility across all platforms.'}</p>
					</div>

					<div className={'flex flex-row mb-10 space-x-8'}>
						<div className={'flex flex-col space-y-4'}>
							<b className={'text-lg'}>{'The Keep3r Logo'}</b>
							<div>
								<Image
									src={'/presskit/the_keep3r_black.png'}
									width={264}
									height={168} />
							</div>
							<p>
								{'Download '}
								<a download href={'/presskit/the_keep3r_black.svg'} className={'underline'}>{'SVG'}</a>
								{' '}
								<a download href={'/presskit/the_keep3r_black.png'} className={'underline'}>{'PNG'}</a>
							</p>
						</div>

						<div className={'flex flex-col space-y-4'}>
							<b className={'text-lg'}>{'The Keep3r Network Logo'}</b>
							<div>
								<Image
									src={'/presskit/the_keep3r_network_black.png'}
									width={474}
									height={168} />
							</div>
							<p>
								{'Download '}
								<a download href={'/presskit/the_keep3r_network_black.svg'} className={'underline'}>{'SVG'}</a>
								{' '}
								<a download href={'/presskit/the_keep3r_network_black.png'} className={'underline'}>{'PNG'}</a>
							</p>
						</div>

						<div className={'flex flex-col space-y-4'}>
							<b className={'text-lg'}>{'Mark'}</b>
							<div>
								<Image
									src={'/presskit/keep3r_mark_black.png'}
									width={168}
									height={168} />
							</div>
							<p>
								{'Download '}
								<a download href={'/presskit/keep3r_mark_black.svg'} className={'underline'}>{'SVG'}</a>
								{' '}
								<a download href={'/presskit/keep3r_mark_black.png'} className={'underline'}>{'PNG'}</a>
							</p>
						</div>
					</div>
					<div className={'flex flex-row space-x-8'}>
						<div className={'flex flex-col space-y-4'}>
							<b className={'text-lg'}>{'The Keep3r Logo'}</b>
							<div>
								<Image
									src={'/presskit/the_keep3r_white.png'}
									width={264}
									height={168} />
							</div>
							<p>
								{'Download '}
								<a download href={'/presskit/the_keep3r_white.svg'} className={'underline'}>{'SVG'}</a>
								{' '}
								<a download href={'/presskit/the_keep3r_white.png'} className={'underline'}>{'PNG'}</a>
							</p>
						</div>

						<div className={'flex flex-col space-y-4'}>
							<b className={'text-lg'}>{'The Keep3r Network Logo'}</b>
							<div>
								<Image
									src={'/presskit/the_keep3r_network_white.png'}
									width={474}
									height={168} />
							</div>
							<p>
								{'Download '}
								<a download href={'/presskit/the_keep3r_network_white.svg'} className={'underline'}>{'SVG'}</a>
								{' '}
								<a download href={'/presskit/the_keep3r_network_white.png'} className={'underline'}>{'PNG'}</a>
							</p>
						</div>

						<div className={'flex flex-col space-y-4'}>
							<b className={'text-lg'}>{'Mark'}</b>
							<div>
								<Image
									src={'/presskit/keep3r_mark_white.png'}
									width={168}
									height={168} />
							</div>
							<p>
								{'Download '}
								<a download href={'/presskit/keep3r_mark_white.svg'} className={'underline'}>{'SVG'}</a>
								{' '}
								<a download href={'/presskit/keep3r_mark_white.png'} className={'underline'}>{'PNG'}</a>
							</p>
						</div>
					</div>
				</section>

				<section aria-label={'Colors'} className={'mb-20'}>
					<div className={'mb-10'}>
						<div className={'flex relative flex-row items-center mb-6 -ml-8'}>
							<div className={'flex items-center mr-4 w-4 min-w-[16px] h-10'}>
								<IconGem />
							</div>
							<h3 className={'text-3xl font-bold'}>{'Colors'}</h3>
						</div>
						<p>{'These colors are used in the UI and identity. Grey 5 is the most common background color. Pure colors – for colors.'}</p>
					</div>

					<div className={'flex flex-row mb-10 space-x-4'}>
						<div className={'flex flex-col space-y-4'}>
							<b className={'text-lg'}>{'Black'}</b>
							<div>
								<div className={'mb-2 w-[120px] h-[120px] bg-black'} />
								<p className={'text-black-2'}>{'Pure Black'}</p>
								<p className={'text-xs text-grey-2'}>{'#000000'}</p>
							</div>
						</div>
						<div className={'flex flex-col space-y-4'}>
							<b className={'text-lg'}>&nbsp;</b>
							<div>
								<div className={'mb-2 w-[120px] h-[120px] bg-black-1'} />
								<p className={'text-black-2'}>{'Black 1'}</p>
								<p className={'text-xs text-grey-2'}>{'#131313'}</p>
							</div>
						</div>
						<div className={'flex flex-col space-y-4'}>
							<b className={'text-lg'}>&nbsp;</b>
							<div>
								<div className={'mb-2 w-[120px] h-[120px] bg-black-2'} />
								<p className={'text-black-2'}>{'Black 2'}</p>
								<p className={'text-xs text-grey-2'}>{'#2B2B2B'}</p>
							</div>
						</div>
						<div className={'flex invisible flex-col space-y-4'}>
							<b className={'text-lg'}>&nbsp;</b>
							<div>
								<div className={'mb-2 w-[120px] h-[120px] bg-black'} />
								<p className={'text-black-2'}>{'skippy'}</p>
								<p className={'text-xs text-grey-2'}>{'#000000'}</p>
							</div>
						</div>
						<div className={'flex flex-col space-y-4'}>
							<b className={'text-lg'}>{'White'}</b>
							<div>
								<div className={'mb-2 w-[120px] h-[120px] bg-white'} />
								<p className={'text-black-2'}>{'Pure White'}</p>
								<p className={'text-xs text-grey-2'}>{'#FFFFFF'}</p>
							</div>
						</div>
					</div>
					<div className={'flex flex-row space-x-4'}>
						<div className={'flex flex-col space-y-4'}>
							<b className={'text-lg'}>{'Grey'}</b>
							<div>
								<div className={'mb-2 w-[120px] h-[120px] bg-grey-1'} />
								<p className={'text-black-2'}>{'Grey 1'}</p>
								<p className={'text-xs text-grey-2'}>{'#4F4F4F'}</p>
							</div>
						</div>
						<div className={'flex flex-col space-y-4'}>
							<b className={'text-lg'}>&nbsp;</b>
							<div>
								<div className={'mb-2 w-[120px] h-[120px] bg-grey-2'} />
								<p className={'text-black-2'}>{'Grey 2'}</p>
								<p className={'text-xs text-grey-2'}>{'#828282'}</p>
							</div>
						</div>
						<div className={'flex flex-col space-y-4'}>
							<b className={'text-lg'}>&nbsp;</b>
							<div>
								<div className={'mb-2 w-[120px] h-[120px] bg-grey-3'} />
								<p className={'text-black-2'}>{'Grey 3'}</p>
								<p className={'text-xs text-grey-2'}>{'#E0E0E0'}</p>
							</div>
						</div>
						<div className={'flex flex-col space-y-4'}>
							<b className={'text-lg'}>&nbsp;</b>
							<div>
								<div className={'mb-2 w-[120px] h-[120px] bg-grey-4'} />
								<p className={'text-black-2'}>{'Grey 4'}</p>
								<p className={'text-xs text-grey-2'}>{'#FBFBFB'}</p>
							</div>
						</div>
						<div className={'flex flex-col space-y-4'}>
							<b className={'text-lg'}>&nbsp;</b>
							<div>
								<div className={'mb-2 w-[120px] h-[120px] bg-grey-5 border border-grey-3'} />
								<p className={'text-black-2'}>{'Grey 5'}</p>
								<p className={'text-xs text-grey-2'}>{'#F1F1F1'}</p>
							</div>
						</div>
					</div>
				</section>

				<section aria-label={'Fonts'} className={'mb-20'}>
					<div className={'mb-10'}>
						<div className={'flex relative flex-row items-center mb-6 -ml-8'}>
							<div className={'flex items-center mr-4 w-4 min-w-[16px] h-10'}>
								<IconGem />
							</div>
							<h3 className={'text-3xl font-bold'}>{'Fonts'}</h3>
						</div>
					</div>

					<div className={'grid grid-cols-5'}>
						<div className={'flex flex-col'}>
							<LogoFont />
							<div style={{marginTop: 1}}>
								<p className={'mb-[-4px] text-xs text-grey-2'}>{'For logo'}</p>
								<a className={'text-xs text-grey-2 underline'} href={'https://github.com/ctrlcctrlv/chomsky'} target={'_blank'} rel={'noreferrer'}>
									{'License'}
								</a>
							</div>
						</div>
						<div className={'flex flex-col'}>
							<p className={'flex items-end h-10 text-3xl'}>{'Roboto Slab'}</p>
							<div className={'mt-1'}>
								<p className={'text-xs text-grey-2'}>{'For texts'}</p>
								<p className={'mt-[-2px] text-xs text-grey-2'}>{'Free Google Font'}</p>
							</div>
						</div>
						<div className={'flex flex-col'}>
							<p className={'flex items-end h-10 font-mono text-3xl'}>{'Roboto Mono'}</p>
							<div className={'mt-1'}>
								<p className={'text-xs text-grey-2'}>{'For numbers and hashs'}</p>
								<p className={'mt-[-2px] text-xs text-grey-2'}>{'Free Google Font'}</p>
							</div>
						</div>
						<div className={'flex flex-col col-span-2 pl-8'}>
							<p className={'flex items-end h-10 font-roboto-base text-3xl'}>{'Roboto'}</p>
							<div className={'mt-1'}>
								<p className={'text-xs text-grey-2'}>{'For some captions'}</p>
								<p className={'mt-[-2px] text-xs text-grey-2'}>{'Free Google Font'}</p>
							</div>
						</div>
					</div>
				</section>
			</section>
		</main>
	);
}

export default Index;
