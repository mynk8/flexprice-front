import type { ReactNode } from 'react';
import Button from '@/components/atoms/Button/Button';
import { cn } from '@/lib/utils';
import { getTypographyClass } from '@/lib/typography';

export interface EmptyStateProps {
	/** Large icon to display above the heading. */
	icon?: ReactNode;
	/** Primary headline text. */
	heading?: string;
	/** Descriptive subtext guiding the user. */
	description?: string;
	/** Text for the CTA button. */
	buttonLabel?: string;
	/** Click handler for the CTA button. */
	buttonAction?: () => void;
}

/**
 * EmptyState is a full-section component displayed when a page or table has no data.
 * It provides a clear headline, descriptive text, and a Call to Action (CTA).
 *
 * @example
 * <EmptyState
 *   icon={<Users size={60} />}
 *   heading="No customers yet"
 *   description="Add your first customer to get started."
 *   buttonLabel="Add Customer"
 *   buttonAction={() => setDrawerOpen(true)}
 * />
 */
const EmptyState = ({ icon, heading, description, buttonLabel, buttonAction }: EmptyStateProps) => {
	return (
		<div className='bg-white border border-border rounded-[6px] w-full h-[360px] flex flex-col items-center justify-center mx-auto shadow-sm'>
			{icon && <div className='mb-8 text-zinc-400'>{icon}</div>}
			{heading && <h2 className={cn(getTypographyClass('form-title'), 'mb-2 text-center text-zinc-950')}>{heading}</h2>}
			{description && <p className={cn(getTypographyClass('body-large'), 'text-zinc-500 mb-8 text-center max-w-[450px]')}>{description}</p>}
			{buttonAction && buttonLabel && (
				<Button variant='outline' onClick={buttonAction} className='px-6 h-10 border-zinc-200 text-zinc-950 hover:bg-zinc-50'>
					{buttonLabel}
				</Button>
			)}
		</div>
	);
};

export default EmptyState;
