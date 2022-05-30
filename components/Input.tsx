import	React, {ReactElement}					from	'react';
import	{BigNumber, ethers}						from	'ethers';
import	{format, performBatchedUpdates}			from	'@yearn/web-lib/utils';

type 		TInput = {
	value: string,
	onChange: (s: string) => void
	onSearch?: (s: string) => void
	ariaLabel?: string
	withMax?: boolean
	onMaxClick?: () => void
} & React.ComponentPropsWithoutRef<'input'>
function	InputBase({
	value,
	onChange,
	onSearch,
	ariaLabel = 'Search',
	withMax,
	onMaxClick,
	className,
	...props
}: TInput): ReactElement {
	return (
		<form
			name={ariaLabel}
			onSubmit={(e): void => {
				e.preventDefault();
				if (onSearch)
					onSearch(value);
			}}>
			<div
				aria-label={ariaLabel}
				className={`flex flex-row items-center py-2 h-12 px-4 w-full text-black bg-grey-3 border-2 border-grey-3 focus-within:border-black transition-colors ${className}`}>
				<span className={'sr-only'}>{ariaLabel}</span>
				<input
					value={value}
					onChange={(e): void => onChange(e.target.value)}
					type={'text'}
					className={'p-0 w-full bg-white/0 border-none focus:border-none outline-none focus:outline-none focus:ring-0'}
					{...props} />
				{withMax ? <div
					className={'ml-2 cursor-pointer'}
					onClick={(): void => onMaxClick ? onMaxClick() : undefined}>
					{'MAX'}
				</div> : null}
			</div>
		</form>
	);
}


type		TInputBigNumber = {
	label?: string
	value: string,
	onSetValue: (s: string) => void,
	maxValue?: BigNumber,
	decimals?: number,
	onValueChange?: (s: string) => void,
	shouldHideBalance?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>;

function	InputBigNumber({
	label,
	value,
	onSetValue,
	maxValue = ethers.constants.Zero,
	decimals = 18,
	onValueChange,
	shouldHideBalance,
	...props
}: TInputBigNumber): ReactElement {
	function	onChange(s: string): void {
		performBatchedUpdates((): void => {
			onSetValue(s);
			if (onValueChange)
				onValueChange(s);
		});
	}
	return (
		<label
			aria-invalid={(value !== '' && (!Number(value) || Number(value) > format.toNormalizedValue(maxValue, decimals)))}
			className={'space-y-2'}>
			{label ? <p>{label}</p> : null}
			<Input
				value={value}
				type={'number'}
				min={0}
				onChange={(s: unknown): void => onChange(s as string)}
				onSearch={(s: unknown): void => onChange(s as string)}
				aria-label={'amountToken1'}
				placeholder={'0.00000000'}
				max={format.toNormalizedValue(maxValue, decimals)}
				onMaxClick={(): void => {
					if (!maxValue.isZero()) {
						const	valueAsString = format.toNormalizedValue(maxValue, decimals).toString();
						if (valueAsString.includes('e')) {
							return;
						}
						onChange(valueAsString);
					}
				}}
				withMax
				disabled={props.disabled} />
			{shouldHideBalance ? null : <p
				className={'text-xs cursor-pointer'}
				onClick={(): void => {
					if (!maxValue.isZero()) {
						const	valueAsString = format.toNormalizedValue(maxValue, decimals).toString();
						if (valueAsString.includes('e')) {
							return;
						}
						onChange(valueAsString);
					}
				}}>
				{`Balance: ${format.toNormalizedAmount(maxValue, decimals)}`}
			</p>}
		</label>
	);
}

const Input = Object.assign(InputBase, {BigNumber: InputBigNumber});
export default Input;
