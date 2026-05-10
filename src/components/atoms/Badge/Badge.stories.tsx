import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

/**
 * ## Badge
 *
 * A lightweight, CVA-powered status indicator — follows the shadcn/ui pattern exactly:
 * extends `HTMLDivElement` attributes and `VariantProps` only. No magic state, no slots,
 * no interactive props. For badges with icons or interactive behavior, compose a molecule
 * that wraps this atom.
 *
 * ### Props
 * - `variant` — `default` | `success` | `warning` | `destructive` | `info` | `outline` | `secondary`
 * - `className` — Additional CSS classes
 * - All standard `div` HTML attributes (`children`, `style`, `onClick`, etc.)
 */
const meta = {
	title: 'Atoms/Badge',
	component: Badge,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'CVA-powered status indicator following the shadcn/ui `Badge` pattern. Pure, reusable, and extensible — no internal state or magic hooks. For icon slots or interactive behavior, compose a molecule wrapper.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'success', 'warning', 'destructive', 'info', 'outline', 'secondary'],
			description: 'Predefined color scheme variant',
			table: { defaultValue: { summary: 'default' } },
		},
		className: { control: false },
	},
	args: {
		children: 'Active',
		variant: 'default',
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'Default',
		variant: 'default',
	},
};

export const Success: Story = {
	args: { children: 'Active', variant: 'success' },
};

export const Warning: Story = {
	args: { children: 'Expiring Soon', variant: 'warning' },
};

export const Destructive: Story = {
	args: { children: 'Overdue', variant: 'destructive' },
};

export const Info: Story = {
	args: { children: 'Draft', variant: 'info' },
};

export const Outline: Story = {
	args: { children: 'Pending', variant: 'outline' },
};

export const Secondary: Story = {
	args: { children: 'Beta', variant: 'secondary' },
};

export const StatusOverview: Story = {
	name: 'Status Overview',
	render: () => (
		<div className='flex flex-wrap gap-2 p-4'>
			<Badge variant='default'>Archived</Badge>
			<Badge variant='secondary'>Beta</Badge>
			<Badge variant='outline'>Pending</Badge>
			<Badge variant='info'>Draft</Badge>
			<Badge variant='success'>Active</Badge>
			<Badge variant='warning'>Expiring Soon</Badge>
			<Badge variant='destructive'>Overdue</Badge>
		</div>
	),
};
