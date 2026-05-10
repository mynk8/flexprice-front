import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { FC, ReactNode } from 'react';

const chipVariants = cva(
	'inline-flex items-center justify-center rounded-[8px] border px-2 py-0.5 font-normal transition-all select-none',
	{
		variants: {
			variant: {
				success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
				default: 'border-muted bg-muted text-muted-foreground',
				failed: 'border-red-200 bg-red-50 text-red-600',
				info: 'border-blue-200 bg-blue-50 text-blue-600',
				warning: 'border-amber-200 bg-amber-50 text-amber-700',
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

/**
 * Chip component used for status indicators, badges, and small labels.
 * Supports multiple semantic variants (success, failed, info, warning) and custom colors.
 * Can be made interactive with an onClick handler.
 *
 * @example
 * <Chip variant="success" label="Active" />
 * <Chip variant="info" label="Draft" icon={<FileIcon />} />
 */
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
