import { Select, SelectContent, SelectGroup, SelectItem as ShadcnSelect, SelectTrigger } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Circle } from 'lucide-react';
import React, { useId } from 'react';

export interface SelectOption {
	value: string;
	label: string;
	suffixIcon?: React.ReactNode;
	prefixIcon?: React.ReactNode;
	description?: string;
	disabled?: boolean;
}

export interface SelectProps {
	/** Array of options to display in the dropdown. */
	options: SelectOption[];
	/** Currently selected value. */
	value?: string;
	/** Whether the select should be open by default. */
	defaultOpen?: boolean;
	/** Placeholder text shown when no value is selected. */
	placeholder?: string;
	/** Label text displayed above the select. */
	label?: string;
	/** Unique ID for the select. Used for labels and accessibility. */
	id?: string;
	/** Whether the field is required (displays a red asterisk). */
	required?: boolean;
	/** Helper text displayed below the select. */
	description?: string;
	/** Error message displayed below the select. Highlights the border in destructive color. */
	error?: string;
	/** Callback function triggered when the selection changes. */
	onChange?: (value: string) => void;
	/** Whether the select is disabled. */
	disabled?: boolean;
	/** If true, uses a radio-style indicator instead of a checkmark for the selected item. */
	isRadio?: boolean;
	/** Additional CSS classes for the container. */
	className?: string;
	/** Text to display when there are no options. */
	noOptionsText?: string;
	/** Whether to hide the default checkmark icon for the selected item. */
	hideSelectedTick?: boolean;
	/** Optional custom trigger element. */
	trigger?: React.ReactNode;
	/** Additional CSS classes for the dropdown content. */
	contentClassName?: string;
}

const RadioSelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className,
		)}
		{...props}>
		<span className='absolute left-2 top-[10px] flex h-4 w-4  justify-center'>
			<SelectPrimitive.ItemIndicator className='flex items-center justify-center w-full h-full'>
				<Circle className='size-2 text-black fill-current' />
			</SelectPrimitive.ItemIndicator>
			<Circle className='size-4 text-gray-400 absolute' />
		</span>

		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
));
RadioSelectItem.displayName = 'RadioSelectItem';

/**
 * Custom Select component built on top of Shadcn UI and Radix UI.
 * Supports labels, error states, radio-style options, and custom triggers.
 *
 * @example
 * <Select
 *   label="Status"
 *   options={[{ label: 'Active', value: 'active' }, { label: 'Archived', value: 'archived' }]}
 *   onChange={(val) => console.log(val)}
 * />
 */
const FlexPriceSelect: React.FC<SelectProps> = ({
	disabled = false,
	options,
	value,
	placeholder = 'Select an option',
	label = '',
	id: propsId,
	required = false,
	description,
	onChange,
	error,
	isRadio,
	className,
	noOptionsText,
	defaultOpen,
	hideSelectedTick = true,
	trigger,
	contentClassName,
}) => {
	const generatedId = useId();
	const id = propsId || generatedId;

	return (
		<div className={cn('space-y-1 ', className)}>
			{/* Label */}
			{label && (
				<label
					htmlFor={id}
					className={cn(' block text-sm font-medium text-zinc break-words', disabled ? 'text-zinc-500' : 'text-zinc-950')}>
					{label}
					{required && <span className='text-destructive'> *</span>}
				</label>
			)}

			<Select
				defaultOpen={defaultOpen}
				defaultValue={value || ''}
				onValueChange={(newValue) => {
					if (onChange) {
						onChange(newValue === value ? '' : newValue);
					}
				}}
				value={value}
				disabled={disabled}>
				<SelectTrigger id={id} className={cn(disabled && 'cursor-not-allowed', className)}>
					{trigger ? (
						trigger
					) : (
						<span className={cn('truncate', value ? '' : 'text-muted-foreground')}>
							{value ? options.find((option) => option.value === value)?.label.trim() : placeholder}
						</span>
					)}
				</SelectTrigger>
				<SelectContent className={cn('w-[var(--radix-select-trigger-width)]', contentClassName)}>
					<SelectGroup>
						{options.length > 0 &&
							options.map((option) => {
								if (isRadio) {
									return (
										<RadioSelectItem
											className={cn(option.disabled && 'select-none cursor-not-allowed')}
											disabled={option.disabled}
											key={option.value}
											value={option.value}>
											<div className='flex items-center space-x-2 w-full'>
												<div className='flex flex-col mr-2 w-full'>
													<span className='break-words'>{option.label}</span>
													{option.description && (
														<span className='text-sm text-gray-500 break-words whitespace-normal'>{option.description}</span>
													)}
												</div>
											</div>
										</RadioSelectItem>
									);
								} else {
									return (
										<ShadcnSelect
											className={cn(
												'w-full',
												'cursor-pointer',
												option.disabled && 'select-none cursor-not-allowed',
												'flex items-center space-x-2 justify-between w-full',
											)}
											disabled={option.disabled}
											key={option.value}
											value={option.value}>
											<div
												className={cn(
													'flex w-full items-center space-x-2 justify-between',
													option.disabled && 'opacity-50 pointer-events-none',
													option.suffixIcon && 'pr-8',
													hideSelectedTick && '!pl-0',
												)}>
												{option.prefixIcon && option.prefixIcon}

												<div className={cn('flex flex-col w-full', !hideSelectedTick && 'mr-0')}>
													<span className='break-words'>{option.label}</span>
													{option.description && (
														<span className='text-sm text-gray-500 break-words whitespace-normal'>{option.description}</span>
													)}
												</div>
												{option.suffixIcon && <span className='absolute right-2 top-1/2 -translate-y-1/2'>{option.suffixIcon}</span>}
											</div>
										</ShadcnSelect>
									);
								}
							})}
						{options.length === 0 && noOptionsText && (
							<ShadcnSelect value='no-items' disabled>
								<div className='flex items-center space-x-2 w-full'>
									<div className='flex flex-col mr-2 w-full'>
										<span className='break-words'>{noOptionsText}</span>
									</div>
								</div>
							</ShadcnSelect>
						)}
					</SelectGroup>
				</SelectContent>
			</Select>
			{/* Description */}
			{description && <p className='text-sm text-muted-foreground break-words'>{description}</p>}

			{/* Error Message */}
			{error && <p className='text-sm text-destructive break-words'>{error}</p>}
		</div>
	);
};

export default FlexPriceSelect;
