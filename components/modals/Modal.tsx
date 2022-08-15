import	React, {ReactElement, useRef}	from	'react';
import	{Dialog, Transition}			from	'@headlessui/react';

type		TModal = {
	isOpen: boolean,
	onClose: () => void
	children: ReactElement,
}
function	Modal({isOpen, onClose, children}: TModal): ReactElement {
	const	ref = useRef() as React.MutableRefObject<HTMLDivElement>;

	return (
		<Transition.Root show={isOpen} as={React.Fragment}>
			<Dialog
				as={'div'}
				className={'fixed inset-0 overflow-y-auto'}
				style={{zIndex: 9999}}
				initialFocus={ref}
				onClose={onClose}>
				<div className={'flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0'}>
					<Transition.Child
						as={React.Fragment}
						enter={'ease-out duration-300'} enterFrom={'opacity-0'} enterTo={'opacity-100'}
						leave={'ease-in duration-200'} leaveFrom={'opacity-100'} leaveTo={'opacity-0'}>
						<Dialog.Overlay className={'fixed inset-0 z-10 bg-black/50 transition-opacity'} />
					</Transition.Child>

					<span className={'hidden sm:inline-block sm:h-screen sm:align-middle'} aria-hidden={'true'}>
						&#8203;
					</span>
					<Transition.Child
						as={React.Fragment}
						enter={'ease-out duration-300'}
						enterFrom={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}
						enterTo={'opacity-100 translate-y-0 sm:scale-100'}
						leave={'ease-in duration-200'}
						leaveFrom={'opacity-100 translate-y-0 sm:scale-100'}
						leaveTo={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}>
						<div ref={ref} className={'relative z-50 inline-block overflow-hidden bg-grey-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle md:mb-96'}>
							{children}
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
}

export {Modal};