import	React, {ReactElement}					from	'react';

function	SectionDocumentation(): ReactElement {
	return (
		<div className={'grid grid-cols-2 gap-10'}>
			<section aria-label={'ADD LIQUIDITY'}>
				<b className={'text-xl'}>{'ADD LIQUIDITY'}</b>
				<div aria-label={'Mint tokens (Optional)'} className={'mt-4 mb-10 space-y-4'}>
					<b className={'text-intermediate'}>{'Mint tokens (Optional)'}</b>
					<p>{'Provide liquidity to Uniswap v3 full-range position to mint kLP tokens. kLP tokens represent your position in the pool and can be redeemed for underlying assets.'}</p>
					<p>
						{'Choose maximum desired amount of each asset to provide, and '}
						<a href={'https://docs.keep3r.network/registry#pair-managers'} target={'_blank'} className={'underline'} rel={'noreferrer'}>{'Pair Manager'}</a>
						{' will calculate the exact input amount of each token.'}
					</p>
					<p>
						<b>{'Note: '}</b>
						{'Minimum amount of underlying tokens (3 KP3R) is necessary for the liquidity to generate credits.'}
					</p>
				</div>

				<div aria-label={'Add liquidity'} className={'mb-10 space-y-4'}>
					<b className={'mb-4 text-intermediate'}>{'Add liquidity'}</b>

					<p>{'As a job owner, you have to ensure your job has enough liquidity credits. Take your time to calculate necessary amount of governance approved kLPs. Only then, mint and add kLP tokens to your job.'}</p>

					<p>{'Once kLPs are added, job will generate KP3R credits. These credits will be later used to reward keepers working on your job.'}</p>

					<p>{'Credits minting rate is proportional to underlying KP3Rs in kLPs, and relation between rewards length and inflation periods.'}</p>

					<p>
						<b>{'Note: '}</b>
						{'If you add credits to job which is considered malicious, your kLP tokens might get slashed. Read '}
						<a href={'https://docs.keep3r.network/'} target={'_blank'} className={'underline'} rel={'noreferrer'}>{'docs'}</a>
						{' for more info.'}
					</p>
				</div>
			</section>

			<section aria-label={'WITHDRAW LIQUIDITY'}>
				<b className={'text-xl'}>{'WITHDRAW LIQUIDITY'}</b>
				<div aria-label={'Unbond and Withdraw'} className={'mt-4 mb-[42px] space-y-4'}>
					<b className={'text-intermediate'}>{'Unbond and Withdraw'}</b>
					<p>{'If your job isn\'t necessary anymore, you are able to unbond your kLPs from it and withdraw the underlying tokens after the unbonding period has passed (default 14 days).'}</p>
					<p className={'pb-6'}>
						<b>{'Note: '}</b>
						{'Minimum amount of underlying tokens (3 KP3R) is necessary for the liquidity to generate credits. You must unbond all kLPs and can\'t stay below minimum.'}
					</p>
					<b className={'text-intermediate'}>{'Burn'}</b>
					<p>{'Burn your kLP to withdraw underlying tokens.'}</p>
				</div>

				<div aria-label={'MANAGE DIRECTLY'} className={'mb-10 space-y-4'}>
					<b className={'text-xl'}>{'MANAGE DIRECTLY'}</b>
					<div aria-label={'Add tokens directly'} className={'mt-4 mb-[42px] space-y-4'}>
						<b className={'text-intermediate'}>{'Add tokens directly'}</b>
						<p>{'Pay keepers directly by sending tokens. This method is direct expense – consider providing liquidity cause you will get your liquidity back once you are done paying keepers.'}</p>
						<p className={'pb-6'}>
							<b>{'Note: '}</b>
							{'It is impossible to add KP3R tokens this way, provide liquidity to have KP3R minted.'}
						</p>
						<b className={'text-intermediate'}>{'Withdraw tokens'}</b>
						<p>{'Pull all unspent tokens from job.'}</p>
					</div>
				</div>
			</section>

		</div>
	);
}

export default SectionDocumentation;