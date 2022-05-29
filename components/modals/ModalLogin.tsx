import	React, {ReactElement}					from	'react';
import	toast									from	'react-hot-toast';
import	{useWeb3}								from	'@yearn/web-lib/contexts';
import	{WalletMetamask, WalletWalletConnect}	from	'@yearn/web-lib/icons';
import	{Modal}									from	'components/modals/Modal';

type		TModalLogin = {
	isOpen: boolean,
	onClose: () => void
}
function	ModalLogin({isOpen, onClose}: TModalLogin): ReactElement {
	const	{onConnect} = useWeb3();

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}>
			<div className={'p-6 space-y-4'}>
				<div
					onClick={(): void => {
						onConnect(
							0,
							(): string => toast.error('Unsupported network. Please use Ethereum mainnet.'),
							(): void => onClose()
						);
					}}
					className={'flex flex-col justify-center items-center p-6 text-center bg-white hover:bg-grey-3 transition-colors cursor-pointer'}>
					<div className={'w-12 h-12'}>
						<WalletMetamask className={'w-12 h-12'} />
					</div>
					<b className={'mt-2 text-2xl text-black'}>{'Metamask'}</b>
					<p className={'typo-secondary'}>{'Connect with Metamask'}</p>
				</div>
				<div
					onClick={(): void => {
						onConnect(
							1,
							(): string => toast.error('Invalid chain'),
							(): void => onClose()
						);
					}}
					className={'flex flex-col justify-center items-center p-6 text-center bg-white hover:bg-grey-3 transition-colors cursor-pointer'}>
					<div className={'w-12 h-12'}>
						<WalletWalletConnect className={'w-12 h-12'} />
					</div>
					<b className={'text-2xl text-black'}>{'WalletConnect'}</b>
					<p className={'typo-secondary'}>{'Scan with WalletConnect to connect'}</p>
				</div>
			</div>
		</Modal>
	);
}

export {ModalLogin};