import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { fn } from '@storybook/test';
import Modal, { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './Modal';
import Button from '../Button/Button';
import Card, { CardHeader } from '../Card';

/**
 * ## Modal
 *
 * A centered dialog overlay built on Radix UI Dialog primitives via `ui/dialog`.
 * Now uses proper compound component composition — `DialogHeader`, `DialogFooter`,
 * `DialogClose` can be used directly within `children`.
 *
 * ### Props
 * - `isOpen` — Controls visibility
 * - `onOpenChange` — Callback when dialog opens/closes
 * - `showOverlay` — Whether to show the dark backdrop (default: true)
 * - `showCloseButton` — Whether to show the built-in close button (default: true)
 * - `size` — Width preset (default: `max-w-lg`)
 * - `className` — Applied to the content wrapper
 *
 * ### Compound Components (use inside children)
 * - `DialogHeader` — Title + description wrapper
 * - `DialogTitle` — Large dialog title
 * - `DialogDescription` — Supporting description text
 * - `DialogFooter` — Action buttons wrapper
 * - `DialogClose` — Accessible close button
 */
const meta = {
	title: 'Atoms/Modal',
	component: Modal,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Radix-based dialog modal using compound component pattern. Built on `ui/dialog`. Use `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, and `DialogClose` inside children for structured content.',
			},
			story: { inline: false, iframeHeight: 500 },
		},
	},
	tags: ['autodocs'],
	argTypes: {
		isOpen: { control: 'boolean' },
		showOverlay: { control: 'boolean' },
		showCloseButton: { control: 'boolean' },
		size: {
			control: 'select',
			options: ['max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-full'],
		},
	},
	args: {
		isOpen: false,
		onOpenChange: fn(),
		showOverlay: true,
		showCloseButton: true,
		size: 'max-w-lg',
	},
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

type InteractiveModalHarnessProps = Omit<React.ComponentProps<typeof Modal>, 'children' | 'isOpen' | 'onOpenChange'> & {
	triggerLabel: string;
	children: ReactNode;
};

const InteractiveModalHarness = ({ triggerLabel, children, ...modalProps }: InteractiveModalHarnessProps) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div>
			<Button onClick={() => setIsOpen(true)}>{triggerLabel}</Button>
			<Modal {...modalProps} isOpen={isOpen} onOpenChange={setIsOpen}>
				{children}
			</Modal>
		</div>
	);
};

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
	render: (args) => (
		<Modal {...args} className='bg-card rounded-lg shadow-xl'>
			<Card noPadding className='border-none'>
				<div className='p-6'>
					<CardHeader title='Confirm Deletion' />
					<p className='text-sm text-muted-foreground mb-6 mt-2'>
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

// ─── With Compound Components ────────────────────────────────────────────────

export const WithCompoundComponents: Story = {
	name: 'With Compound Components',
	render: (args) => (
		<Modal {...args} className='bg-card rounded-lg shadow-xl'>
			<DialogHeader>
				<DialogTitle>Create new API Key</DialogTitle>
				<DialogDescription>Generate a secure API key for authenticating requests to the FlexPrice API.</DialogDescription>
			</DialogHeader>
			<div className='space-y-4 py-4'>
				<div>
					<label className='block text-sm font-medium text-foreground mb-1'>Key Name</label>
					<input
						type='text'
						className='w-full border border-input rounded-md px-3 py-2 text-sm bg-background'
						placeholder='e.g. Production Billing'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-foreground mb-1'>Environment</label>
					<select className='w-full border border-input rounded-md px-3 py-2 text-sm bg-background'>
						<option>Production</option>
						<option>Sandbox</option>
					</select>
				</div>
			</div>
			<DialogFooter>
				<Button variant='outline'>Cancel</Button>
				<Button>Generate Key</Button>
			</DialogFooter>
		</Modal>
	),
	args: {
		isOpen: true,
		showCloseButton: false,
	},
};

// ─── Interactive Example ──────────────────────────────────────────────────────

export const InteractiveExample: Story = {
	name: 'Interactive Trigger Example',
	render: (args) => (
		<InteractiveModalHarness triggerLabel='Open Modal' showOverlay={args.showOverlay} className='bg-card rounded-lg shadow-xl w-[400px]'>
			<>
				<DialogHeader>
					<DialogTitle>Interactive Modal</DialogTitle>
					<DialogDescription>Controlled by local state in the harness.</DialogDescription>
				</DialogHeader>
				<div className='py-4'>
					<p className='text-sm text-muted-foreground'>
						This modal is controlled by local React state. Close by clicking the X button, the overlay, or the Cancel button.
					</p>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant='outline'>Close</Button>
					</DialogClose>
				</DialogFooter>
			</>
		</InteractiveModalHarness>
	),
	args: {
		showOverlay: true,
	},
};
