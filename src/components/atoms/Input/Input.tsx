import * as React from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils';
import Label from '../Label';
import { sizes, SizeVariant } from '@/lib/sizing';

type InputVariant = 'text' | 'number' | 'formatted-number' | 'integer';

export interface NumberFormatOptions {
	allowNegative?: boolean;
	allowDecimals?: boolean;
	thousandSeparator: string;
	decimalSeparator: string;
}

const DEFAULT_FORMAT_OPTIONS: NumberFormatOptions = {
	allowNegative: false,
	allowDecimals: true,
	thousandSeparator: ',',
	decimalSeparator: '.',
};

export const formatAmount = (amount: string, options: NumberFormatOptions = DEFAULT_FORMAT_OPTIONS): string => {
	if (!amount) return '';

	const { allowNegative, allowDecimals, thousandSeparator, decimalSeparator } = {
		...DEFAULT_FORMAT_OPTIONS,
		...options,
	};

	// Handle negative numbers
	const isNegative = allowNegative && amount.startsWith('-');
	const absAmount = isNegative ? amount.slice(1) : amount;

	const parts = absAmount.split(decimalSeparator);
	const integerPart = parts[0] || '';
	const decimalPart = parts[1];

	// Format integer part with separators
	const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

	// Combine parts
	let result = formattedInteger;
	if (allowDecimals && decimalPart !== undefined) {
		result += decimalSeparator + decimalPart;
	}

	return isNegative ? '-' + result : result;
};

export const removeFormatting = (amount: string, options: NumberFormatOptions = DEFAULT_FORMAT_OPTIONS): string => {
	const { thousandSeparator } = { ...DEFAULT_FORMAT_OPTIONS, ...options };
	const escapedSeparator = thousandSeparator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return amount.replace(new RegExp(escapedSeparator, 'g'), '');
};

const getInputPattern = (variant: InputVariant, options: NumberFormatOptions = DEFAULT_FORMAT_OPTIONS): RegExp => {
	const { allowNegative, allowDecimals, decimalSeparator } = { ...DEFAULT_FORMAT_OPTIONS, ...options };

	switch (variant) {
		case 'integer':
			return allowNegative ? /^-?\d*$/ : /^\d*$/;
		case 'number':
		case 'formatted-number':
			return allowNegative
				? new RegExp(`^-?\\d*${allowDecimals ? `\\${decimalSeparator}?\\d*` : ''}$`)
				: new RegExp(`^\\d*${allowDecimals ? `\\${decimalSeparator}?\\d*` : ''}$`);
		default:
			return /.*/;
	}
};

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
	/** Optional label for the input. */
	label?: string;
	/** Optional helper text or node to display below the input. */
	description?: React.ReactNode;
	/** Error message to display below the input. Highlights the border in destructive color. */
	error?: string;
	/** HTML input type (e.g., 'text', 'password', 'email'). Defaults to 'text'. */
	type?: React.HTMLInputTypeAttribute;
	/** Callback function triggered when the value changes. Receives the raw string value. */
	onChange?: (value: string) => void;
	/** Whether the input is disabled. */
	disabled?: boolean;
	/** Optional element to display at the end of the input (e.g., currency suffix). */
	suffix?: React.ReactNode;
	/** Additional CSS classes for the input container. */
	className?: string;
	/** Input placeholder text. */
	placeholder?: string;
	/** Unique ID for the input. Used for labels and accessibility. */
	id?: string;
	/** Optional element to display at the start of the input (e.g., an icon or currency symbol). */
	inputPrefix?: React.ReactNode;
	/** Additional CSS classes for the label. */
	labelClassName?: string;
	/** Visual and functional variant of the input. Handles formatting for numbers. */
	variant?: InputVariant;
	/** Options for number formatting (separators, decimals, etc.) when using 'formatted-number' variant. */
	formatOptions?: NumberFormatOptions;
	/** Size variant of the input (sm, md, lg, default). */
	size?: SizeVariant;
}

/**
 * Standard Input component for forms.
 * Supports labels, descriptions, error states, prefixes, and suffixes.
 * Includes built-in formatting for numbers and integers.
 *
 * @example
 * <Input label="Email" placeholder="Enter your email" type="email" />
 * <Input label="Price" variant="formatted-number" inputPrefix="$" suffix="USD" />
 * <Input label="Password" type="password" error="Password is required" />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			type,
			label,
			description,
			error,
			onChange,
			disabled,
			placeholder,
			suffix,
			id: propsId,
			value,
			inputPrefix,
			labelClassName,
			variant = 'text',
			size = 'default',
			formatOptions = DEFAULT_FORMAT_OPTIONS,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const id = propsId || generatedId;
		const inputRef = React.useRef<HTMLInputElement | null>(null);
		const [cursorPosition, setCursorPosition] = React.useState<number | null>(null);

		const isFormattedVariant = variant === 'formatted-number' || variant === 'integer';
		const pattern = React.useMemo(() => getInputPattern(variant, formatOptions), [variant, formatOptions]);

		// Handle cursor position after formatting
		React.useEffect(() => {
			if (cursorPosition !== null && inputRef.current) {
				inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
				setCursorPosition(null);
			}
		}, [cursorPosition]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			let newValue = e.target.value;
			const oldValue = (value as string) || '';
			const currentCursorPosition = e.target.selectionStart || 0;

			// For number variants, validate and format
			if (variant !== 'text') {
				// Remove formatting before validation
				if (isFormattedVariant) {
					newValue = removeFormatting(newValue, formatOptions);
				}

				// Validate against pattern
				if (!pattern.test(newValue)) {
					return;
				}

				// Handle cursor position for formatted variants
				if (isFormattedVariant) {
					const oldFormatCharCount = (oldValue.slice(0, currentCursorPosition).match(/,/g) || []).length;
					const newFormatCharCount = (formatAmount(newValue, formatOptions).slice(0, currentCursorPosition).match(/,/g) || []).length;
					const cursorAdjustment = newFormatCharCount - oldFormatCharCount;
					setCursorPosition(currentCursorPosition + cursorAdjustment);
				}
			}

			if (onChange) {
				onChange(newValue);
			}
		};

		const getValue = () => {
			if (isFormattedVariant && value) {
				return formatAmount(value as string, {
					...formatOptions,
					allowDecimals: variant !== 'integer',
				});
			}
			return value;
		};

		return (
			<div className='space-y-1 w-full flex flex-col'>
				{/* Label */}
				{label && <Label label={label} disabled={disabled} labelClassName={labelClassName} htmlFor={id} />}
				{/* Input */}
				<div
					className={cn(
						sizes[size].height,
						sizes[size].padding,
						sizes[size].text,
						sizes[size].display,
						'w-full flex h-full group items-center rounded-[6px] border bg-background ring-offset-background placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed',
						error ? 'border-destructive' : 'border-input focus-within:ring-ring focus-within:ring-offset-2',
						'focus-within:border-black',
						className,
					)}>
					{inputPrefix && <div className='mr-2'>{inputPrefix}</div>}
					<input
						{...props}
						id={id}
						type={type}
						value={getValue()}
						disabled={disabled}
						placeholder={placeholder}
						className={cn(
							'peer relative min-h-0 min-w-0 flex-1 bg-transparent outline-none ring-0 focus:outline-none placeholder:text-muted-foreground',
							disabled && 'text-zinc-500',
							className,
						)}
						onChange={handleChange}
						ref={(element) => {
							inputRef.current = element;
							if (typeof ref === 'function') {
								ref(element);
							} else if (ref) {
								ref.current = element;
							}
						}}
					/>
					{suffix && (
						<div className='ml-2 flex shrink-0 items-center self-stretch pl-2 text-sm tabular-nums leading-none text-muted-foreground'>
							{suffix}
						</div>
					)}
				</div>
				{/* Description */}
				{description && <p className={cn('text-sm', disabled ? 'text-zinc-500' : 'text-muted-foreground')}>{description}</p>}
				{/* Error Message */}
				{error && <p className='text-sm text-destructive'>{error}</p>}
			</div>
		);
	},
);

Input.displayName = 'Input';

export default Input;
