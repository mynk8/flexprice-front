import React from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/atoms/Button/Button';

export interface EmptyStateProps {
	icon?: React.ReactNode;
	heading?: string;
	description?: string;
	buttonLabel?: string;
	buttonAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, heading, description, buttonLabel, buttonAction }) => {
	return (
		<div className='bg-[#fafafa] border border-[#E9E9E9] rounded-[6px] w-full h-[360px] flex flex-col items-center justify-center mx-auto'>
			{icon && <div className='mb-8 text-gray-300'>{icon}</div>}
			{heading && <div className='font-medium text-[20px] leading-normal text-gray-700 mb-4 text-center'>{heading}</div>}
			{description && (
				<div className='font-normal bg-[#F9F9F9] text-[16px] leading-normal text-gray-400 mb-8 text-center max-w-[350px]'>
					{description}
				</div>
			)}
			{buttonAction && buttonLabel && (
				<Button variant='outline' onClick={buttonAction} className='!p-5 !bg-[#fbfbfb] !border-[#CFCFCF]'>
					<Plus className='size-4 mr-1' />
					{buttonLabel}
				</Button>
			)}
		</div>
	);
};

export default EmptyState;
