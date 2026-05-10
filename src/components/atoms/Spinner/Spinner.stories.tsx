import type { Meta, StoryObj } from '@storybook/react';
import Spinner from './Spinner';

/**
 * ## Spinner
 *
 * A circular SVG spinner animation used to indicate loading states.
 * Inherits `currentColor` so it automatically picks up the text color of its container.
 *
 * ### Props
 * - `size` — Pixel size of the spinner (width and height). Default: 24
 * - `className` — Additional CSS classes for color, positioning, etc.
 */
const meta = {
	title: 'Atoms/Spinner',
	component: Spinner,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'Circular loading indicator that inherits text color. Used inside buttons, table rows, and full-page loading states.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: { type: 'range', min: 12, max: 96, step: 4 },
			description: 'Width and height in pixels',
			table: { defaultValue: { summary: '24' } },
		},
		className: {
			control: 'text',
			description: 'Tailwind classes (e.g. text-blue-600)',
		},
	},
	args: {
		size: 24,
	},
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { size: 24 },
};

export const Small: Story = {
	args: { size: 16 },
};

export const Medium: Story = {
	args: { size: 32 },
};

export const Large: Story = {
	args: { size: 48 },
};

export const ExtraLarge: Story = {
	args: { size: 64 },
};

export const PrimaryColor: Story = {
	name: 'Color: Primary (Navy)',
	args: { size: 32, className: 'text-[#092E44]' },
};

export const BlueColor: Story = {
	name: 'Color: Blue',
	args: { size: 32, className: 'text-blue-600' },
};

export const GreenColor: Story = {
	name: 'Color: Success Green',
	args: { size: 32, className: 'text-green-600' },
};

export const RedColor: Story = {
	name: 'Color: Destructive Red',
	args: { size: 32, className: 'text-red-600' },
};

export const GrayColor: Story = {
	name: 'Color: Muted Gray',
	args: { size: 32, className: 'text-gray-400' },
};

export const InButton: Story = {
	name: 'Inside Button (loading state)',
	render: () => (
		<button
			disabled
			className='inline-flex items-center gap-2 px-4 py-2 bg-[#092E44] text-white rounded-[7px] text-sm font-medium opacity-70'>
			<Spinner size={16} className='text-white' />
			Saving...
		</button>
	),
};

export const FullPageLoading: Story = {
	name: 'Full-Page Loading State',
	render: () => (
		<div className='w-64 h-48 flex items-center justify-center bg-white border rounded-lg'>
			<div className='flex flex-col items-center gap-3'>
				<Spinner size={40} className='text-[#092E44]' />
				<p className='text-sm text-gray-500'>Loading customers...</p>
			</div>
		</div>
	),
};

export const AllSizes: Story = {
	name: 'All Sizes Showcase',
	render: () => (
		<div className='flex items-end gap-6'>
			{[16, 24, 32, 48, 64].map((size) => (
				<div key={size} className='flex flex-col items-center gap-2'>
					<Spinner size={size} className='text-[#092E44]' />
					<span className='text-xs text-gray-500'>{size}px</span>
				</div>
			))}
		</div>
	),
};
