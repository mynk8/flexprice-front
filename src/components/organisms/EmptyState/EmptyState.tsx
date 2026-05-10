import Button from '@/components/atoms/Button/Button';

export interface EmptyStateProps {
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
 *   heading="No customers yet"
 *   description="Add your first customer to get started."
 *   buttonLabel="Add Customer"
 *   buttonAction={() => setDrawerOpen(true)}
 * />
 */
const EmptyState = ({ heading, description, buttonLabel, buttonAction }: EmptyStateProps) => {
	return (
		<div className='bg-[#fafafa] border border-[#E9E9E9] rounded-[6px] w-full h-[360px] flex flex-col items-center justify-center mx-auto'>
			{heading && <div className='font-medium text-[20px] leading-normal text-gray-700 mb-4 text-center'>{heading}</div>}
			{description && (
				<div className='font-normal bg-[#F9F9F9] text-[16px] leading-normal text-gray-400 mb-8 text-center max-w-[350px]'>
					{description}
				</div>
			)}
			{buttonAction && buttonLabel && (
				<Button
					variant='outline'
					onClick={buttonAction}
					className='!p-5 !bg-[#fbfbfb] !border-[#CFCFCF] text-gray-700 font-medium hover:bg-gray-50'>
					{buttonLabel}
				</Button>
			)}
		</div>
	);
};

export default EmptyState;
