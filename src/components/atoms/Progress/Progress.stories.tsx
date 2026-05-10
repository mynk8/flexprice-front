import type { Meta, StoryObj } from '@storybook/react';
import Progress from './Progress';

/**
 * ## Progress / UsageBar / MeterProgress
 *
 * A labelled progress bar for visualising usage against an entitlement limit.
 * Built on Radix UI ProgressPrimitive, supporting custom indicator colors,
 * background colors, and an optional label below the bar.
 *
 * ### Props
 * - `value` — Current value (0–100)
 * - `label` — Optional text shown below the bar (accepts ReactNode)
 * - `indicatorColor` — Tailwind class for the filled bar (e.g. `bg-blue-500`)
 * - `backgroundColor` — Tailwind class for the track background (e.g. `bg-gray-100`)
 * - `labelColor` — Tailwind class for the label text color
 */
const meta = {
	title: 'Atoms/Progress',
	component: Progress,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Usage/meter progress bar. Used in subscription dashboards to visualise feature entitlement consumption, credit usage, and storage meters.',
			},
		},
	},
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<div className='w-80'>
				<Story />
			</div>
		),
	],
	argTypes: {
		value: {
			control: { type: 'range', min: 0, max: 100, step: 1 },
			description: 'Progress value 0–100',
		},
		label: { control: 'text' },
		indicatorColor: { control: 'text', description: 'Tailwind bg class for the filled portion' },
		backgroundColor: { control: 'text', description: 'Tailwind bg class for the track' },
		labelColor: { control: 'text', description: 'Tailwind text class for the label' },
	},
	args: {
		value: 50,
	},
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
	args: { value: 50 },
};

// ─── With Label ───────────────────────────────────────────────────────────────

export const WithLabel: Story = {
	args: {
		value: 75,
		label: '750 / 1,000 API calls used',
	},
};

// ─── Usage Levels ─────────────────────────────────────────────────────────────

export const LowUsage: Story = {
	name: 'Low Usage (25%)',
	args: {
		value: 25,
		label: '250 / 1,000 units',
		indicatorColor: 'bg-green-500',
	},
};

export const MediumUsage: Story = {
	name: 'Medium Usage (60%)',
	args: {
		value: 60,
		label: '600 / 1,000 units',
		indicatorColor: 'bg-yellow-500',
	},
};

export const HighUsage: Story = {
	name: 'High Usage (90%)',
	args: {
		value: 90,
		label: '900 / 1,000 units',
		indicatorColor: 'bg-orange-500',
	},
};

export const FullUsage: Story = {
	name: 'Full Usage (100%)',
	args: {
		value: 100,
		label: '1,000 / 1,000 units — Limit reached',
		indicatorColor: 'bg-red-500',
		labelColor: 'text-red-600',
	},
};

export const Empty: Story = {
	name: 'No Usage (0%)',
	args: {
		value: 0,
		label: '0 / 1,000 units',
	},
};

// ─── Credit Usage ─────────────────────────────────────────────────────────────

export const CreditUsage: Story = {
	name: 'Credit Balance',
	args: {
		value: 40,
		label: '$400.00 remaining of $1,000.00',
		indicatorColor: 'bg-blue-500',
		backgroundColor: 'bg-blue-100',
		labelColor: 'text-blue-700',
	},
};

// ─── Multiple Meters ──────────────────────────────────────────────────────────

export const MultipleMeters: Story = {
	name: 'Multiple Usage Meters',
	render: () => (
		<div className='space-y-5 w-80 p-5 border rounded-lg bg-white'>
			<h3 className='font-semibold text-sm text-gray-800 mb-3'>Feature Entitlements</h3>

			<div className='space-y-1'>
				<div className='flex justify-between text-xs text-gray-600'>
					<span>API Calls</span>
					<span className='font-medium'>8,500 / 10,000</span>
				</div>
				<Progress value={85} indicatorColor='bg-orange-500' />
			</div>

			<div className='space-y-1'>
				<div className='flex justify-between text-xs text-gray-600'>
					<span>Data Storage</span>
					<span className='font-medium'>2.4 / 5 GB</span>
				</div>
				<Progress value={48} indicatorColor='bg-blue-500' />
			</div>

			<div className='space-y-1'>
				<div className='flex justify-between text-xs text-gray-600'>
					<span>Active Users</span>
					<span className='font-medium'>12 / 50</span>
				</div>
				<Progress value={24} indicatorColor='bg-green-500' />
			</div>

			<div className='space-y-1'>
				<div className='flex justify-between text-xs text-gray-600'>
					<span>Reports Generated</span>
					<span className='font-medium'>100 / 100</span>
				</div>
				<Progress value={100} indicatorColor='bg-red-500' label='Limit reached' labelColor='text-red-600 text-right' />
			</div>
		</div>
	),
};
