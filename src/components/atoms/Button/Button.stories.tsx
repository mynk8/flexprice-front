import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Plus, Download, Trash2, ArrowRight } from 'lucide-react';
import Button from './Button';

/**
 * ## Button
 *
 * The primary interactive element in FlexPrice. Built on Radix UI Slot with
 * `class-variance-authority` for variant management.
 *
 * ### Props
 * - `variant` — `default` | `black` | `destructive` | `outline` | `secondary` | `ghost` | `link`
 * - `size` — `xs` | `sm` | `default` | `lg` | `icon`
 * - `isLoading` — shows an animated spinner and disables the button
 * - `disabled` — greys out the button and prevents interaction
 * - `prefixIcon` / `suffixIcon` — ReactNode icons placed before/after the label
 * - `asChild` — renders as the child element (Radix Slot pattern)
 */
const meta = {
	title: 'Atoms/Button',
	component: Button,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Primary interactive element used throughout FlexPrice. Supports multiple visual variants, sizes, and loading/disabled states.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'black', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
			description: 'Visual style variant',
			table: { defaultValue: { summary: 'default' } },
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'default', 'lg', 'icon'],
			description: 'Button size',
			table: { defaultValue: { summary: 'default' } },
		},
		isLoading: {
			control: 'boolean',
			description: 'Shows spinner and disables interaction',
		},
		disabled: {
			control: 'boolean',
			description: 'Prevents interaction',
		},
		asChild: {
			control: 'boolean',
			description: 'Applies button styling to the direct child element using Radix Slot',
		},
		onClick: { action: 'clicked' },
		children: { control: 'text' },
	},
	args: {
		onClick: fn(),
		children: 'Button',
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		variant: 'default',
		size: 'default',
		children: 'Create Plan',
		isLoading: false,
		asChild: false,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: /Create Plan/i });
		await userEvent.click(button);
		await expect(args.onClick).toHaveBeenCalled();
	},
};

export const Primary: Story = {
	args: { variant: 'default', children: 'Add Customer' },
};

export const Secondary: Story = {
	args: { variant: 'secondary', children: 'Cancel' },
};

export const Ghost: Story = {
	args: { variant: 'ghost', children: 'View Details' },
};

export const Outline: Story = {
	args: { variant: 'outline', children: 'Export' },
};

export const Destructive: Story = {
	args: {
		variant: 'destructive',
		children: 'Delete',
		disabled: false,
		isLoading: false,
	},
};

export const LinkVariant: Story = {
	name: 'Link',
	args: {
		variant: 'link',
		children: 'See all invoices',
		isLoading: false,
	},
};

export const ExtraSmall: Story = {
	args: { size: 'xs', children: 'XS Button' },
};

export const Small: Story = {
	args: { size: 'sm', children: 'Small Button' },
};

export const Large: Story = {
	args: { size: 'lg', children: 'Large Button' },
};

export const IconSize: Story = {
	args: { size: 'icon', children: <Plus className='size-4' /> },
};

export const Loading: Story = {
	args: {
		isLoading: true,
		children: 'Saving...',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		children: 'Disabled',
	},
};

export const WithPrefixIcon: Story = {
	args: {
		prefixIcon: <Plus className='size-4' />,
		children: 'Add Feature',
	},
};

export const WithSuffixIcon: Story = {
	args: {
		suffixIcon: <ArrowRight className='size-4' />,
		children: 'Continue',
	},
};

export const AsChildLink: Story = {
	name: 'As Child Link',
	args: {
		asChild: true,
		suffixIcon: <ArrowRight className='size-4' />,
		children: <a href='#storybook-link'>Open billing guide</a>,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const link = canvas.getByRole('link', { name: /Open billing guide/i });
		await expect(link).toHaveAttribute('href', '#storybook-link');
	},
};

export const DownloadButton: Story = {
	args: {
		variant: 'outline',
		prefixIcon: <Download className='size-4' />,
		children: 'Download Invoice',
	},
};

export const DangerWithIcon: Story = {
	args: {
		variant: 'destructive',
		prefixIcon: <Trash2 className='size-4' />,
		children: 'Delete Plan',
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className='flex flex-wrap gap-3 p-4'>
			<Button variant='default'>Default</Button>
			<Button variant='secondary'>Secondary</Button>
			<Button variant='outline'>Outline</Button>
			<Button variant='ghost'>Ghost</Button>
			<Button variant='destructive'>Destructive</Button>
			<Button variant='link'>Link</Button>
		</div>
	),
};

export const AllSizes: Story = {
	render: () => (
		<div className='flex flex-wrap items-center gap-3 p-4'>
			<Button size='xs'>Extra Small</Button>
			<Button size='sm'>Small</Button>
			<Button size='default'>Default</Button>
			<Button size='lg'>Large</Button>
			<Button size='icon'>
				<Plus className='size-4' />
			</Button>
		</div>
	),
};
