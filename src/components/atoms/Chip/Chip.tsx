import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { FC, ReactNode } from 'react';

const chipVariants = cva(
	'inline-flex items-center justify-center rounded-[8px] border px-2 py-0.5 font-normal transition-all select-none',
	{
		variants: {
			variant: {
				success: 'border-[#d1e9ca] bg-[#ECFBE4] text-[#377E6A]',
				default: 'border-[#F0F2F5] bg-[#F0F2F5] text-[#57646E]',
				failed: 'border-[#FEE2E2] bg-[#FEE2E2] text-[#DC2626]',
				info: 'border-[#EFF8FF] bg-[#EFF8FF] text-[#2F6FE2]',
				warning: 'border-[#FFF7ED] bg-[#FFF7ED] text-[#C2410C]',
			},
			interactive: {
				true: 'cursor-pointer hover:opacity-90 active:scale-95',
				false: '',
			},
			disabled: {
				true: 'cursor-not-allowed opacity-50',
				false: '',
			},
		},
		defaultVariants: {
			variant: 'default',
			interactive: false,
			disabled: false,
		},
	},
);

export interface ChipProps extends VariantProps<typeof chipVariants> {
	/** The main content of the chip */
	label?: ReactNode;
	/** Custom text color (overrides variant) */
	textColor?: string;
	/** Custom background color (overrides variant) */
	bgColor?: string;
	/** Click handler for the chip */
	onClick?: () => void;
	/** Icon to display before the label */
	icon?: ReactNode;
	/** Additional content to display after the label */
	childrenAfter?: ReactNode;
	/** Additional CSS classes */
	className?: string;
	borderColor?: string;
}

const Chip: FC<ChipProps> = ({
	label,
	variant = 'default',
	textColor,
	bgColor,
	onClick,
	icon,
	childrenAfter,
	className,
	disabled = false,
	borderColor,
}) => {
	const hasCustomColor = Boolean(bgColor || textColor || borderColor);

	return (
		<span
			role={onClick ? 'button' : undefined}
			tabIndex={onClick && !disabled ? 0 : undefined}
			onClick={disabled ? undefined : onClick}
			onKeyDown={(e) => {
				if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
					e.preventDefault();
					onClick();
				}
			}}
			className={cn(
				chipVariants({ variant: hasCustomColor ? undefined : variant, interactive: Boolean(onClick && !disabled), disabled }),
				className,
			)}
			style={{
				backgroundColor: bgColor,
				color: textColor,
				borderColor,
			}}
			aria-disabled={disabled || undefined}>
			{icon && <span className='flex items-center text-[16px] leading-none'>{icon}</span>}
			{label && <span className={cn('leading-none text-[14px]', icon ? 'ml-1.5' : '', childrenAfter ? 'mr-1.5' : '')}>{label}</span>}
			{childrenAfter && <span className='flex items-center text-[16px] leading-none'>{childrenAfter}</span>}
		</span>
	);
};

export default Chip;
