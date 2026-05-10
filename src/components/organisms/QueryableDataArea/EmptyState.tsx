import { Button } from '@/components/atoms';
import { ApiDocsContent } from '@/components/molecules';
import type { EmptyStateConfig } from './QueryableDataArea';
import TutorialCards from './TutorialCards';
import { cn } from '@/lib/utils';
import { getTypographyClass } from '@/lib/typography';

interface EmptyStateProps {
	config: EmptyStateConfig;
}

const EmptyState = ({ config }: EmptyStateProps) => {
	if (config.customComponent) {
		return (
			<div className='space-y-6'>
				{config.customComponent}
				{config.tags && <ApiDocsContent tags={config.tags} />}
				{config.tutorials && config.tutorials.length > 0 && <TutorialCards tutorials={config.tutorials} />}
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='bg-white border border-border rounded-[6px] w-full h-[360px] flex flex-col items-center justify-center mx-auto shadow-sm'>
				{config.icon && <div className='mb-6 text-zinc-400'>{config.icon}</div>}
				{config.heading && <h2 className={cn(getTypographyClass('form-title'), 'mb-2 text-center text-zinc-950')}>{config.heading}</h2>}
				{config.description && (
					<p className={cn(getTypographyClass('body-large'), 'text-zinc-500 mb-8 text-center max-w-[450px]')}>{config.description}</p>
				)}
				{config.buttonAction && config.buttonLabel && (
					<Button
						variant='outline'
						onClick={config.buttonAction}
						className='px-6 h-10 border-zinc-200 text-zinc-950 hover:bg-zinc-50 font-medium'>
						{config.buttonLabel}
					</Button>
				)}
			</div>
			{config.tags && <ApiDocsContent tags={config.tags} />}
			{config.tutorials && config.tutorials.length > 0 && <TutorialCards tutorials={config.tutorials} />}
		</div>
	);
};

export default EmptyState;
