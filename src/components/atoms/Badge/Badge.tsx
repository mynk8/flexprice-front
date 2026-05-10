import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
	'inline-flex items-center justify-center rounded-[6px] border px-2 py-0.5 text-[12px] font-medium transition-colors select-none',
	{
		variants: {
			variant: {
				default: 'border-transparent bg-primary text-primary-foreground',
				success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
				warning: 'border-amber-200 bg-amber-50 text-amber-700',
				destructive: 'border-red-200 bg-red-50 text-red-600',
				info: 'border-blue-200 bg-blue-50 text-blue-600',
				outline: 'border-[#d1d5db] bg-transparent text-foreground',
				secondary: 'border-transparent bg-secondary text-secondary-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = 'default', ...props }, ref) => (
	<div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
));
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
