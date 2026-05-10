import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Sheet from './Sheet';
import Button from '../Button/Button';
import Input from '../Input/Input';

/**
 * ## Sheet (Drawer)
 *
 * A slide-out drawer built on top of Radix UI and Shadcn.
 * Slides out from the right side of the screen by default. Used for complex
 * forms, details panes, and settings that require more space than a Modal
 * but shouldn't navigate away from the current context.
 *
 * It features an automatic scroll detection mechanism that adjusts padding
 * to prevent content from hiding behind the header/footer when overflowing.
 *
 * ### Props
 * - `trigger` — Optional ReactNode to automatically handle open state internally
 * - `isOpen` / `onOpenChange` — For controlled usage
 * - `title` / `description` — Standard header elements
 * - `size` — Width of the sheet: `sm` | `md` | `lg` | `xl` | `2xl` | `3xl` | `full`
 */
const meta = {
	title: 'Atoms/Sheet',
	component: Sheet,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'Slide-out panel from the edge of the screen. Ideal for detailed forms or inspecting complex records.',
			},
			story: { inline: false, iframeHeight: 600 },
		},
	},
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'],
			table: { defaultValue: { summary: 'sm' } },
		},
		title: { control: 'text' },
		description: { control: 'text' },
		isOpen: { control: 'boolean' },
	},
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const ControlledSheetDemo = (args: React.ComponentProps<typeof Sheet>) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
			<Button variant='outline' onClick={() => setIsOpen(true)}>
				Open Controlled Sheet
			</Button>
			<Sheet
				{...args}
				isOpen={isOpen}
				onOpenChange={setIsOpen}
				title='Controlled Sheet'
				description='This sheet is managed via external state.'>
				<div className='py-6 flex flex-col items-center justify-center h-full text-center'>
					<p className='text-muted-foreground mb-4'>You can close this programmatically or by user action.</p>
					<Button onClick={() => setIsOpen(false)}>Close Programmatically</Button>
				</div>
			</Sheet>
		</div>
	);
};

export const Default: Story = {
	render: (args) => (
		<Sheet
			{...args}
			trigger={<Button>Open Sheet</Button>}
			title='Edit Customer'
			description="Make changes to the customer profile here. Click save when you're done.">
			<div className='space-y-4 py-4'>
				<Input label='Name' placeholder='Acme Corp' id='sheet-name' />
				<Input label='Email' placeholder='billing@acme.com' id='sheet-email' />
				<Input label='Tax ID' placeholder='US123456789' id='sheet-tax' />
			</div>
			<div className='flex justify-end gap-3 pt-6'>
				<Button variant='outline'>Cancel</Button>
				<Button>Save Changes</Button>
			</div>
		</Sheet>
	),
	args: {
		size: 'md',
	},
};

export const Controlled: Story = {
	render: (args) => <ControlledSheetDemo {...args} />,
	args: {
		size: 'sm',
	},
};

export const ScrollableContent: Story = {
	name: 'With Scrolling Content',
	render: (args) => (
		<Sheet {...args} trigger={<Button>View Terms</Button>} title='Terms of Service' description='Please review our long terms of service.'>
			<div className='py-4 space-y-4 text-sm text-muted-foreground'>
				{Array.from({ length: 20 }).map((_, i) => (
					<p key={i}>
						Section {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
						magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
					</p>
				))}
			</div>
		</Sheet>
	),
	args: {
		size: 'md',
	},
};

export const SizeComparison: Story = {
	name: 'All Sizes',
	render: () => (
		<div className='flex flex-wrap gap-4'>
			{(['sm', 'md', 'lg', 'xl', 'full'] as const).map((size) => (
				<Sheet key={size} trigger={<Button variant='outline'>Size: {size}</Button>} title={`Sheet Size: ${size}`} size={size}>
					<div className='py-4'>
						<p className='text-sm text-muted-foreground'>
							This sheet demonstrates the <code>{size}</code> width setting.
						</p>
					</div>
				</Sheet>
			))}
		</div>
	),
};
