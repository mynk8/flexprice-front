import type { Meta, StoryObj } from '@storybook/react';
import Card, { CardHeader } from './Card';
import Button from '../Button/Button';

/**
 * ## Card
 *
 * A versatile container component with multiple visual variants including default,
 * notched (with a colored side indicator), bordered, elevated, and warning states.
 *
 * It includes a companion `CardHeader` component for consistent title/subtitle/CTA
 * layouts across the application.
 */
const meta = {
	title: 'Atoms/Card',
	component: Card,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Surface container used to group related content. Supports custom notch indicators for visual hierarchy and status marking.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'notched', 'bordered', 'elevated', 'warning'],
			description: 'Visual style variant of the card',
		},
		notchColor: {
			control: 'select',
			options: ['zinc', 'primary'],
			description: 'Color of the notch (only applies when variant is "notched")',
		},
		notchPosition: {
			control: 'radio',
			options: ['left', 'right'],
		},
		notchSize: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		noPadding: {
			control: 'boolean',
			description: 'Removes the default 24px (p-6) padding',
		},
	},
	decorators: [
		(Story) => (
			<div className='w-[450px]'>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<Card {...args}>
			<CardHeader title='Subscription Details' subtitle='Manage your current plan and billing cycle.' />
			<div className='text-sm text-gray-600 mt-4'>
				Your current billing cycle ends on May 31, 2025. You will be charged $99.00 on the next invoice.
			</div>
		</Card>
	),
	args: {
		variant: 'default',
	},
};

export const WithHeaderCTA: Story = {
	render: (args) => (
		<Card {...args}>
			<CardHeader
				title='Payment Methods'
				cta={
					<Button variant='outline' size='sm'>
						Add Method
					</Button>
				}
			/>
			<div className='text-sm text-gray-500 mt-2'>No payment methods have been added yet.</div>
		</Card>
	),
	args: {
		variant: 'default',
	},
};

export const NotchedLeft: Story = {
	name: 'Notched (Left)',
	render: (args) => (
		<Card {...args}>
			<div className='font-medium text-gray-900 mb-1'>Attention Required</div>
			<div className='text-sm text-gray-600'>Please update your billing information to avoid service interruption.</div>
		</Card>
	),
	args: {
		variant: 'notched',
		notchPosition: 'left',
		notchColor: 'primary',
		notchSize: 'md',
	},
};

export const NotchedRight: Story = {
	name: 'Notched (Right)',
	render: (args) => (
		<Card {...args}>
			<div className='font-medium text-gray-900 mb-1'>Profile Complete</div>
			<div className='text-sm text-gray-600'>Your onboarding profile is 100% complete.</div>
		</Card>
	),
	args: {
		variant: 'notched',
		notchPosition: 'right',
		notchColor: 'zinc',
		notchSize: 'lg',
	},
};

export const Elevated: Story = {
	render: (args) => (
		<Card {...args}>
			<h3 className='font-medium mb-2'>Elevated Card</h3>
			<p className='text-sm text-gray-500'>Uses a shadow-lg to float above the page background. Good for modals or floating panels.</p>
		</Card>
	),
	args: {
		variant: 'elevated',
	},
};

export const Warning: Story = {
	render: (args) => (
		<Card {...args}>
			<h3 className='font-medium mb-2'>Warning Status</h3>
			<p className='text-sm'>This resource is currently experiencing degraded performance.</p>
		</Card>
	),
	args: {
		variant: 'warning',
	},
};

export const Bordered: Story = {
	render: (args) => (
		<Card {...args}>
			<h3 className='font-medium mb-2'>Bordered Style</h3>
			<p className='text-sm text-gray-500'>Uses a thicker 2px border for higher contrast against the background.</p>
		</Card>
	),
	args: {
		variant: 'bordered',
	},
};

export const NoPadding: Story = {
	name: 'No Padding (Custom Layout)',
	render: (args) => (
		<Card {...args}>
			<div className='bg-gray-100 p-4 border-b border-gray-200'>
				<h3 className='font-medium'>Card Header (Flush)</h3>
			</div>
			<div className='p-4'>
				<p className='text-sm text-gray-600'>Body content with its own custom padding.</p>
			</div>
		</Card>
	),
	args: {
		variant: 'default',
		noPadding: true,
	},
};
