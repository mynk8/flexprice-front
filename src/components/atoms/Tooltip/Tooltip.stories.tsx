import type { Meta, StoryObj } from '@storybook/react';
import { Info, HelpCircle, AlertCircle, Zap } from 'lucide-react';
import Tooltip from './Tooltip';
import Button from '../Button/Button';

/**
 * ## Tooltip
 *
 * An informational overlay that appears on hover/focus of a trigger element.
 * Built on Radix UI TooltipProvider for accessibility compliance.
 *
 * ### Props
 * - `children` — The trigger element (must be a single focusable/hoverable element)
 * - `content` — The content displayed in the tooltip (accepts ReactNode)
 * - `delayDuration` — Milliseconds before showing (default: 700ms from Radix)
 * - `side` — `top` | `right` | `bottom` | `left`
 * - `align` — `start` | `center` | `end`
 * - `sideOffset` — Pixel distance from the trigger (default: 4)
 * - `className` — Custom classes for the tooltip content box
 */
const meta = {
	title: 'Atoms/Tooltip',
	component: Tooltip,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Informational tooltip for contextual help text. Used throughout FlexPrice on pricing tables, feature flags, and form fields.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		side: {
			control: 'select',
			options: ['top', 'right', 'bottom', 'left'],
			table: { defaultValue: { summary: 'top' } },
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
			table: { defaultValue: { summary: 'center' } },
		},
		delayDuration: {
			control: { type: 'range', min: 0, max: 1000, step: 100 },
			description: 'Delay in ms before tooltip appears',
			table: { defaultValue: { summary: '700' } },
		},
		sideOffset: {
			control: { type: 'range', min: 0, max: 20 },
			table: { defaultValue: { summary: '4' } },
		},
		content: { control: 'text' },
	},
	args: {
		content: 'Helpful information about this field',
		children: <Button variant='outline'>Hover me</Button>,
		side: 'top',
		align: 'center',
		sideOffset: 4,
	},
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<Tooltip {...args}>
			<Button variant='outline' size='icon'>
				<Info className='size-4' />
			</Button>
		</Tooltip>
	),
};

export const TopSide: Story = {
	name: 'Side: Top',
	args: { side: 'top', content: 'Tooltip on top' },
	render: (args) => (
		<Tooltip {...args}>
			<Button variant='outline'>Hover me</Button>
		</Tooltip>
	),
};

export const RightSide: Story = {
	name: 'Side: Right',
	args: { side: 'right', content: 'Tooltip on right' },
	render: (args) => (
		<Tooltip {...args}>
			<Button variant='outline'>Hover me</Button>
		</Tooltip>
	),
};

export const BottomSide: Story = {
	name: 'Side: Bottom',
	args: { side: 'bottom', content: 'Tooltip on bottom' },
	render: (args) => (
		<Tooltip {...args}>
			<Button variant='outline'>Hover me</Button>
		</Tooltip>
	),
};

export const LeftSide: Story = {
	name: 'Side: Left',
	args: { side: 'left', content: 'Tooltip on left' },
	render: (args) => (
		<Tooltip {...args}>
			<Button variant='outline'>Hover me</Button>
		</Tooltip>
	),
};

export const NoDelay: Story = {
	args: {
		delayDuration: 0,
		content: 'Instant tooltip',
	},
	render: (args) => (
		<Tooltip {...args}>
			<Button variant='ghost' size='icon'>
				<Zap className='size-4' />
			</Button>
		</Tooltip>
	),
};

export const WithDelay: Story = {
	args: {
		delayDuration: 600,
		content: 'Delayed tooltip (600ms)',
	},
	render: (args) => (
		<Tooltip {...args}>
			<Button variant='ghost' size='icon'>
				<HelpCircle className='size-4' />
			</Button>
		</Tooltip>
	),
};

export const RichContent: Story = {
	name: 'Rich Content Tooltip',
	args: {
		delayDuration: 0,
		content: (
			<div className='space-y-1'>
				<p className='font-medium'>Graduated Pricing</p>
				<p className='text-xs text-gray-400'>
					Each unit tier is priced independently. The first 100 units are $0.01 each, the next 900 units are $0.008 each.
				</p>
			</div>
		),
	},
	render: (args) => (
		<Tooltip {...args} className='bg-white border border-gray-200 shadow-lg text-sm text-gray-900 px-4 py-3 rounded-[6px] max-w-[280px]'>
			<Button variant='outline' size='sm'>
				<Info className='size-3.5 mr-1' />
				What is graduated pricing?
			</Button>
		</Tooltip>
	),
};

export const OnFormLabel: Story = {
	name: 'Attached to Form Label',
	args: {
		content: 'Alert sent when usage exceeds this percentage of the entitled amount',
		children: <button type='button'>Usage threshold help</button>,
	},
	render: () => (
		<div className='flex items-center gap-1'>
			<label className='text-sm font-medium'>Usage Threshold</label>
			<Tooltip content='Alert sent when usage exceeds this percentage of the entitled amount' delayDuration={100} side='right'>
				<button type='button' className='text-gray-400 hover:text-gray-600'>
					<HelpCircle className='size-3.5' />
				</button>
			</Tooltip>
		</div>
	),
};

export const WarningTooltip: Story = {
	name: 'Warning / Alert Tooltip',
	args: {
		delayDuration: 0,
		side: 'right',
		content: 'This action cannot be undone. The price will be permanently terminated.',
	},
	render: (args) => (
		<Tooltip {...args} className='bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-md text-xs max-w-[220px]'>
			<button type='button' className='text-red-500 hover:text-red-700'>
				<AlertCircle className='size-4' />
			</button>
		</Tooltip>
	),
};
