import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { fn } from '@storybook/test';
import Modal from './Modal';
import Button from '../Button/Button';
import Card, { CardHeader } from '../Card/Card';

/**
 * ## Modal
 *
 * A centered dialog overlay that renders into a portal (`#modal-root`).
 * Used for focused tasks like confirming deletions, adding new items,
 * or displaying detailed information that requires breaking out of the page flow.
 *
 * ### Props
 * - `isOpen` — Controls visibility
 * - `onOpenChange` — Callback when the modal attempts to close (e.g. clicking overlay or X button)
 * - `showOverlay` — Whether to show the dark backdrop (default: true)
 * - `className` — Applied to the inner content wrapper
 */
const meta = {
	title: 'Atoms/Modal',
	component: Modal,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'Portal-based centered dialog modal for focused interactions.',
			},
			// The modal renders into a portal, which can sometimes be tricky in docs view.
			// Setting a min-height ensures we can see it if it renders inline.
			story: { inline: false, iframeHeight: 500 },
		},
	},
	tags: ['autodocs'],
	argTypes: {
		isOpen: { control: 'boolean' },
		showOverlay: { control: 'boolean' },
	},
	args: {
		isOpen: false,
		onOpenChange: fn(),
		showOverlay: true,
	},
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

type InteractiveModalHarnessProps = Omit<React.ComponentProps<typeof Modal>, 'children' | 'isOpen' | 'onOpenChange'> & {
	triggerLabel: string;
	children: (setIsOpen: (open: boolean) => void) => ReactNode;
};

const InteractiveModalHarness = ({ triggerLabel, children, ...modalProps }: InteractiveModalHarnessProps) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div>
			<Button onClick={() => setIsOpen(true)}>{triggerLabel}</Button>
			<Modal {...modalProps} isOpen={isOpen} onOpenChange={setIsOpen}>
				{children(setIsOpen)}
			</Modal>
		</div>
	);
};

export const Default: Story = {
	render: (args) => (
		<Modal {...args} className='bg-white rounded-lg shadow-xl w-[400px]'>
			<Card noPadding className='border-none'>
				<div className='p-6'>
					<CardHeader title='Confirm Deletion' />
					<p className='text-sm text-gray-600 mb-6 mt-2'>
						Are you sure you want to delete this customer? This action cannot be undone and will immediately cancel all their active
						subscriptions.
					</p>
					<div className='flex justify-end gap-3'>
						<Button variant='outline'>Cancel</Button>
						<Button variant='destructive'>Delete Customer</Button>
					</div>
				</div>
			</Card>
		</Modal>
	),
	args: {
		isOpen: true,
		onOpenChange: fn(),
		showOverlay: true,
	},
};

export const ComplexForm: Story = {
	name: 'With Form Content',
	render: (args) => (
		<Modal {...args} className='bg-white rounded-lg shadow-xl w-[500px]'>
			<div className='p-6'>
				<h3 className='text-lg font-semibold mb-4 text-gray-900'>Create new API Key</h3>
				<div className='space-y-4 mb-6'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>Key Name</label>
						<input
							type='text'
							className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm'
							placeholder='e.g. Production Billing'
						/>
					</div>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>Environment</label>
						<select className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm'>
							<option>Production</option>
							<option>Sandbox</option>
						</select>
					</div>
				</div>
				<div className='flex justify-end gap-3 pt-4 border-t border-gray-100'>
					<Button variant='outline'>Cancel</Button>
					<Button>Generate Key</Button>
				</div>
			</div>
		</Modal>
	),
	args: {
		isOpen: true,
		onOpenChange: fn(),
		showOverlay: true,
	},
};

export const InteractiveExample: Story = {
	name: 'Interactive Trigger Example',
	render: (args) => (
		<InteractiveModalHarness triggerLabel='Open Modal' showOverlay={args.showOverlay} className='bg-white rounded-lg shadow-xl w-[400px]'>
			{(setIsOpen: (open: boolean) => void) => (
				<div className='p-6'>
					<h3 className='text-lg font-semibold mb-4'>Interactive Modal</h3>
					<p className='text-sm text-gray-600 mb-6'>This modal is controlled by local state in the harness.</p>
					<div className='flex justify-end gap-3'>
						<Button variant='outline' onClick={() => setIsOpen(false)}>
							Close
						</Button>
					</div>
				</div>
			)}
		</InteractiveModalHarness>
	),
	args: {
		showOverlay: true,
	},
};
