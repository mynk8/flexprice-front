import { Page, AddButton, Card } from '@/components/atoms';
import { FC, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { ApiDocsContent } from '@/components/molecules/ApiDocs/ApiDocs';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import EmptyState from './EmptyState';

interface EmptyStateCardItem {
	icon?: ReactNode;
	heading?: string;
	description?: string;
	buttonLabel?: string;
	buttonAction?: () => void;
}

export interface CardItem {
	imageUrl?: string;
	heading?: string;
	description?: string;
	onClick?: () => void;
}

export interface TutorialItem {
	imageUrl?: string;
	title?: string;
	description?: string;
	onClick?: () => void;
}

export interface EmptyPageProps {
	/** Callback function triggered when the 'Add' button in the header is clicked. */
	onAddClick?: () => void;
	/** Array of tags for API documentation context. */
	tags?: string[];
	/** Primary heading text for the page. */
	heading?: string;
	/** Optional child elements to render below the empty state card. */
	children?: ReactNode;
	/** Custom label for the 'Add' button in the header. */
	addButtonLabel?: string;
	/** Configuration for the central empty state card. */
	emptyStateCard?: EmptyStateCardItem;
	/** Array of tutorial items to display as cards below the empty state. */
	tutorials?: TutorialItem[];
}

/**
 * EmptyPage is a high-level organism used to represent a page with no data.
 * It combines a page header, an EmptyState card, API documentation links, and tutorial cards.
 *
 * @example
 * <EmptyPage
 *   heading="Invoices"
 *   emptyStateCard={{
 *     heading: "No invoices yet",
 *     description: "Invoices will appear here once subscriptions are billed.",
 *     buttonLabel: "Create Customer",
 *     buttonAction: () => navigate('/customers')
 *   }}
 *   tutorials={GUIDES.invoices.tutorials}
 * />
 */
const EmptyPage: FC<EmptyPageProps> = ({ onAddClick, tags, heading, children, addButtonLabel, emptyStateCard, tutorials }) => {
	const card = emptyStateCard;
	const documentTitle = typeof heading === 'string' ? heading : undefined;

	return (
		<Page
			heading={heading}
			documentTitle={documentTitle}
			headingCTA={
				onAddClick && (
					<AddButton
						label={addButtonLabel}
						onClick={() => {
							if (onAddClick) {
								onAddClick();
							}
						}}
					/>
				)
			}>
			{card && (
				<EmptyState
					icon={card.icon}
					heading={card.heading}
					description={card.description}
					buttonLabel={card.buttonLabel}
					buttonAction={card.buttonAction}
				/>
			)}
			<ApiDocsContent tags={tags} />
			{children}

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10'>
				{tutorials?.map((item, index) => {
					const imageUrl =
						item.imageUrl && item.imageUrl.trim() !== ''
							? item.imageUrl
							: 'https://mintlify.s3.us-west-1.amazonaws.com/flexprice/UsageBaseMetering(1).jpg';
					return (
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} key={index}>
							<Card
								className={cn(
									'h-full group bg-white border border-slate-100 rounded-[6px] shadow-sm hover:border-blue-100 hover:bg-slate-50 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-blue-500/5 flex flex-col max-w-[280px] mx-auto p-4',
									'!aspect-auto bg-gradient-to-r from-[#ffffff] to-[#fcfcfc]',
								)}
								onClick={item.onClick}>
								<div className='w-full h-[80px] aspect-video rounded-t-[6px] overflow-hidden bg-muted flex items-center justify-center'>
									<img src={imageUrl} loading='lazy' className='object-cover bg-gray-100 w-full h-full' alt={' '} />
								</div>
								<div className='flex-1 flex flex-col justify-between mt-4'>
									<div>
										<h3 className='text-slate-800 text-base font-medium group-hover:text-gray-600 transition-colors duration-200 text-left'>
											{item.title}
										</h3>
									</div>
									<div className='flex items-center gap-1 mt-8 text-slate-400 group-hover:text-gray-500 transition-all duration-200 text-left'>
										<span className='text-xs font-regular'>Learn More</span>
										<ArrowRight className='w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200' />
									</div>
								</div>
							</Card>
						</motion.div>
					);
				})}
			</div>
		</Page>
	);
};

export default EmptyPage;
