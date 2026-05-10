import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { CheckCircle, AlertCircle, Info as InfoIcon, Clock } from 'lucide-react';
import Chip from './Chip';

/**
 * ## Chip / StatusBadge
 *
 * A compact, pill-shaped element for communicating status, categories, or tags.
 * Used throughout FlexPrice for plan status (active, archived), subscription status,
 * invoice status, price status (active, upcoming, inactive), and more.
 *
 * ### Props
 * - `label` — Main text content (accepts ReactNode)
 * - `variant` — `default` | `success` | `warning` | `failed` | `info`
 * - `icon` — Optional leading icon (ReactNode)
 * - `childrenAfter` — Optional trailing content (ReactNode)
 * - `onClick` — Makes the chip interactive with hover/focus effects
 * - `disabled` — Reduces opacity and prevents interaction
 * - `bgColor` / `textColor` / `borderColor` — Custom color overrides
 */
const meta = {
	title: 'Atoms/Chip',
	component: Chip,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Compact status indicator used for plan status, invoice status, subscription state, and other categorical labels throughout FlexPrice.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'success', 'warning', 'failed', 'info'],
			description: 'Predefined color scheme variant',
			table: { defaultValue: { summary: 'default' } },
		},
		label: {
			control: 'text',
			description: 'Main content of the chip',
		},
		disabled: {
			control: 'boolean',
			description: 'Reduces opacity and prevents click events',
		},
		bgColor: { control: 'color', description: 'Custom background color override' },
		textColor: { control: 'color', description: 'Custom text color override' },
		borderColor: { control: 'color', description: 'Custom border color override' },
		onClick: { action: 'chip-clicked' },
	},
	args: {
		label: 'Active',
		variant: 'success',
	},
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Default',
		variant: 'default',
	},
};

export const Success: Story = {
	args: { label: 'Active', variant: 'success' },
};

export const Warning: Story = {
	args: { label: 'Expiring Soon', variant: 'warning' },
};

export const Failed: Story = {
	args: { label: 'Overdue', variant: 'failed' },
};

export const InfoVariant: Story = {
	name: 'Info',
	args: { label: 'Draft', variant: 'info' },
};

export const WithIconSuccess: Story = {
	name: 'With Icon — Active',
	args: {
		label: 'Active',
		variant: 'success',
		icon: <CheckCircle size={14} />,
	},
};

export const WithIconFailed: Story = {
	name: 'With Icon — Failed',
	args: {
		label: 'Payment Failed',
		variant: 'failed',
		icon: <AlertCircle size={14} />,
	},
};

export const WithIconInfo: Story = {
	name: 'With Icon — Draft',
	args: {
		label: 'Draft',
		variant: 'info',
		icon: <InfoIcon size={14} />,
	},
};

export const WithIconWarning: Story = {
	name: 'With Icon — Upcoming',
	args: {
		label: 'Upcoming',
		variant: 'warning',
		icon: <Clock size={14} />,
	},
};

export const Disabled: Story = {
	args: {
		label: 'Archived',
		variant: 'default',
		disabled: true,
		onClick: fn(),
	},
};

export const Clickable: Story = {
	args: {
		label: 'Click me',
		variant: 'info',
		onClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const chip = canvas.getByRole('button');
		await userEvent.click(chip);
		await expect(args.onClick).toHaveBeenCalledOnce();
	},
};

export const PlanStatuses: Story = {
	name: 'Plan Status Variants',
	render: () => (
		<div className='flex flex-wrap gap-2 p-4'>
			<Chip label='Active' variant='success' icon={<CheckCircle size={14} />} />
			<Chip label='Draft' variant='info' icon={<InfoIcon size={14} />} />
			<Chip label='Archived' variant='default' />
		</div>
	),
};

export const InvoiceStatuses: Story = {
	name: 'Invoice Status Variants',
	render: () => (
		<div className='flex flex-wrap gap-2 p-4'>
			<Chip label='Paid' variant='success' />
			<Chip label='Draft' variant='info' />
			<Chip label='Overdue' variant='failed' />
			<Chip label='Void' variant='default' />
			<Chip label='Pending' variant='warning' />
		</div>
	),
};

export const SubscriptionStatuses: Story = {
	name: 'Subscription Status Variants',
	render: () => (
		<div className='flex flex-wrap gap-2 p-4'>
			<Chip label='Active' variant='success' />
			<Chip label='Scheduled' variant='info' />
			<Chip label='Cancelled' variant='failed' />
			<Chip label='Expired' variant='default' />
			<Chip label='Paused' variant='warning' />
		</div>
	),
};

export const PriceStatuses: Story = {
	name: 'Price Status Variants',
	render: () => (
		<div className='flex flex-wrap gap-2 p-4'>
			<Chip label='Active' variant='success' />
			<Chip label='Upcoming' variant='info' />
			<Chip label='Inactive' variant='default' />
		</div>
	),
};
