import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Layers2, Users, FileText, Zap } from 'lucide-react';
import EmptyPage, { type EmptyPageProps } from './EmptyPage';
import GUIDES from '@/constants/guides';

/**
 * ## EmptyPage
 *
 * A high-level organism used to represent a page with no data.
 * It combines a page header, an EmptyState card, API documentation links, and tutorial cards.
 *
 * This component is the standard way to implement "empty" views for main entities
 * (Customers, Plans, Invoices, etc.) in the FlexPrice application.
 */
const meta = {
	title: 'Organisms/EmptyPage',
	component: EmptyPage,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Complete page template for empty states. Includes header with CTA, central empty state illustration, API documentation integration, and tutorial resource cards.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		heading: { control: 'text' },
		addButtonLabel: { control: 'text' },
		onAddClick: { action: 'add-clicked' },
	},
	args: {
		onAddClick: fn(),
	},
} satisfies Meta<EmptyPageProps>;

export default meta;
type Story = StoryObj<EmptyPageProps>;

export const Plans: Story = {
	name: 'Plans Empty Page',
	args: {
		heading: 'Plans',
		addButtonLabel: 'Create Plan',
		emptyStateCard: {
			icon: <Layers2 size={60} strokeWidth={1} />,
			heading: 'No plans created yet',
			description: 'Plans define the pricing structure for your product. Create your first plan to start billing customers.',
			buttonLabel: 'Create Plan',
			buttonAction: fn(),
		},
		tutorials: GUIDES.plans.tutorials,
		tags: ['Plans'],
	},
};

export const Customers: Story = {
	name: 'Customers Empty Page',
	args: {
		heading: 'Customers',
		addButtonLabel: 'Add Customer',
		emptyStateCard: {
			icon: <Users size={60} strokeWidth={1} />,
			heading: 'No customers yet',
			description: 'Add your first customer to start creating subscriptions and generating invoices.',
			buttonLabel: 'Add Customer',
			buttonAction: fn(),
		},
		tutorials: GUIDES.customers.tutorials,
		tags: ['Customers'],
	},
};

export const Invoices: Story = {
	name: 'Invoices Empty Page',
	args: {
		heading: 'Invoices',
		emptyStateCard: {
			icon: <FileText size={60} strokeWidth={1} />,
			heading: 'No invoices yet',
			description: 'Invoices are generated automatically when a subscription is billed.',
		},
		tutorials: GUIDES.invoices.tutorials,
		tags: ['Invoices'],
	},
};

export const Events: Story = {
	name: 'Events Empty Page',
	args: {
		heading: 'Events Debugger',
		emptyStateCard: {
			icon: <Zap size={60} strokeWidth={1} />,
			heading: 'No usage events received',
			description: "Send usage events to FlexPrice via the API or SDK to start metering your customers' consumption.",
			buttonLabel: 'View API Docs',
			buttonAction: fn(),
		},
		tutorials: GUIDES.events.tutorials,
		tags: ['Events'],
	},
};
