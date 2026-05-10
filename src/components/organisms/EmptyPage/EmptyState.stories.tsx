import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FileText, Users, Layers2, Zap } from 'lucide-react';
import EmptyState from './EmptyState';

/**
 * ## EmptyState
 *
 * A full-section empty state component shown when a data table has no content.
 * Used throughout FlexPrice on Plans, Customers, Invoices, Credits, and Events pages.
 *
 * ### Structure
 * - Large illustrated icon (60–80px)
 * - Bold headline text
 * - Muted descriptive subtext (max 350px width)
 * - Optional CTA button
 *
 * ### Props
 * - `icon` — React node (typically a Lucide icon at 60px)
 * - `heading` — Primary headline
 * - `description` — Subtext describing what to do next
 * - `buttonLabel` — CTA button text
 * - `buttonAction` — CTA click handler
 */
const meta = {
	title: 'Organisms/EmptyState',
	component: EmptyState,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Full-section empty state displayed when a page has no data. Guides users to create their first resource with a clear headline, description, and CTA.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		heading: { control: 'text' },
		description: { control: 'text' },
		buttonLabel: { control: 'text' },
		buttonAction: { action: 'cta-clicked' },
	},
	args: {
		buttonAction: fn(),
	},
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		icon: <FileText size={60} strokeWidth={1} />,
		heading: 'No invoices yet',
		description:
			'Invoices are generated automatically when a subscription is billed. Create a customer and add a subscription to get started.',
		buttonLabel: 'Create Customer',
	},
};

export const PlansEmpty: Story = {
	name: 'Plans — No Data',
	args: {
		heading: 'No plans created yet',
		description: 'Plans define the pricing structure for your product. Create your first plan to start billing customers.',
		buttonLabel: 'Create Plan',
	},
};

export const CustomersEmpty: Story = {
	name: 'Customers — No Data',
	args: {
		heading: 'No customers yet',
		description: 'Add your first customer to start creating subscriptions and generating invoices.',
		buttonLabel: 'Add Customer',
	},
};

export const CreditsEmpty: Story = {
	name: 'Credits — No Data',
	args: {
		heading: 'No credit grants',
		description:
			"Grant credits to customers to offset future invoices. Credits are applied automatically before charging a customer's payment method.",
		buttonLabel: 'Grant Credits',
	},
};

export const EventsEmpty: Story = {
	name: 'Events — No Data',
	args: {
		heading: 'No usage events received',
		description: "Send usage events to FlexPrice via the API or SDK to start metering your customers' consumption.",
		buttonLabel: 'View API Docs',
	},
};

export const WithoutCTA: Story = {
	name: 'Without CTA Button',
	args: {
		heading: 'No data available',
		description: 'There are no records matching your current filters. Try adjusting your search or date range.',
	},
};

export const MinimalHeadingOnly: Story = {
	name: 'Minimal (heading only)',
	args: {
		heading: 'No results found',
	},
};

export const AllPagesShowcase: Story = {
	name: 'Empty States — All Pages',
	render: () => (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
			<div>
				<p className='text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide'>Plans</p>
				<EmptyState
					icon={<Layers2 size={48} strokeWidth={1} className='text-zinc-400' />}
					heading='No plans yet'
					description='Create your first pricing plan.'
					buttonLabel='Create Plan'
					buttonAction={fn()}
				/>
			</div>
			<div>
				<p className='text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide'>Customers</p>
				<EmptyState
					icon={<Users size={48} strokeWidth={1} className='text-zinc-400' />}
					heading='No customers yet'
					description='Add customers to manage subscriptions.'
					buttonLabel='Add Customer'
					buttonAction={fn()}
				/>
			</div>
			<div>
				<p className='text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide'>Invoices</p>
				<EmptyState
					icon={<FileText size={48} strokeWidth={1} className='text-zinc-400' />}
					heading='No invoices yet'
					description='Invoices appear after billing runs.'
				/>
			</div>
			<div>
				<p className='text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide'>Events</p>
				<EmptyState
					icon={<Zap size={48} strokeWidth={1} className='text-zinc-400' />}
					heading='No events received'
					description='Send usage events via the API.'
					buttonLabel='View Docs'
					buttonAction={fn()}
				/>
			</div>
		</div>
	),
};
