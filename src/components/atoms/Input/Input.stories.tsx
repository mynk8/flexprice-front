import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { DollarSign, Search, Percent } from 'lucide-react';
import Input from './Input';

/**
 * ## Input
 *
 * A versatile text/number input component with built-in label, description, error, and
 * prefix/suffix support. Handles formatted numbers (with thousand separators), integers,
 * and raw text.
 *
 * ### Props
 * - `variant` — `text` | `number` | `formatted-number` | `integer`
 * - `label` — Label text displayed above the input
 * - `description` — Helper text below the input
 * - `error` — Error message; also applies destructive border styling
 * - `inputPrefix` — ReactNode displayed before the input (e.g. currency symbol)
 * - `suffix` — ReactNode displayed after the input (e.g. units, icons)
 * - `disabled` — Greys out and prevents input
 * - `size` — `xs` | `sm` | `default` | `lg` (affects height and padding)
 * - `onChange` — Callback with the raw string value (no event object)
 */
const meta = {
	title: 'Atoms/Input',
	component: Input,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Versatile input with built-in label, error state, number formatting, and prefix/suffix support. The onChange callback receives a plain string value.',
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
		variant: {
			control: 'select',
			options: ['text', 'number', 'formatted-number', 'integer'],
			description: 'Input type variant affecting validation and formatting',
			table: { defaultValue: { summary: 'text' } },
		},
		label: { control: 'text' },
		description: { control: 'text' },
		error: { control: 'text' },
		disabled: { control: 'boolean' },
		placeholder: { control: 'text' },
		size: {
			control: 'select',
			options: ['xs', 'sm', 'default', 'lg'],
			table: { defaultValue: { summary: 'default' } },
		},
		value: { control: 'text' },
	},
	args: {
		placeholder: 'Enter value',
		variant: 'text',
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Controlled wrapper helper for interactive stories
const InteractiveInputHarness = (props: React.ComponentProps<typeof Input>) => {
	const [value, setValue] = useState(props.value || '');
	return <Input {...props} value={value} onChange={setValue} />;
};

export const Default: Story = {
	render: (args) => <InteractiveInputHarness {...args} />,
	args: {
		placeholder: 'Enter text here',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.type(input, 'FlexPrice');
		await expect(input).toHaveValue('FlexPrice');
	},
};

export const WithLabel: Story = {
	args: {
		label: 'Customer Name',
		placeholder: 'Enter customer name',
		id: 'customer-name',
	},
};

export const WithDescription: Story = {
	args: {
		label: 'Plan Name',
		placeholder: 'e.g. Growth Plan',
		description: 'A descriptive name shown to customers on invoices.',
		id: 'plan-name',
	},
};

export const WithError: Story = {
	args: {
		label: 'Email Address',
		placeholder: 'your@email.com',
		error: 'Please enter a valid email address.',
		value: 'not-an-email',
		id: 'email-error',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Account ID',
		placeholder: 'Auto-generated',
		disabled: true,
		value: 'acc_7xk9mB2pQR',
		id: 'account-id',
	},
};

export const WithCurrencyPrefix: Story = {
	name: 'With Currency Prefix ($)',
	args: {
		label: 'Price',
		variant: 'formatted-number',
		inputPrefix: <DollarSign className='size-3.5 text-muted-foreground' />,
		placeholder: '0.00',
		id: 'price-input',
		value: '100',
	},
};

export const WithPercentSuffix: Story = {
	name: 'With Percent Suffix (%)',
	args: {
		label: 'Discount',
		variant: 'number',
		suffix: <Percent className='size-3 text-muted-foreground' />,
		placeholder: '10',
		id: 'discount-input',
		value: '15',
	},
};

export const SearchInput: Story = {
	args: {
		placeholder: 'Search customers...',
		suffix: <Search className='size-3.5 text-muted-foreground' />,
		id: 'search',
	},
};

export const NumberInput: Story = {
	args: {
		label: 'Usage Units',
		variant: 'number',
		placeholder: '0',
		id: 'usage-units',
		value: '42',
	},
};

export const FormattedNumberInput: Story = {
	name: 'Formatted Number (with thousands separator)',
	args: {
		label: 'Credit Amount',
		variant: 'formatted-number',
		inputPrefix: <DollarSign className='size-3.5 text-muted-foreground' />,
		placeholder: '1,000.00',
		id: 'credit-amount',
		value: '1000000',
	},
};

export const IntegerInput: Story = {
	args: {
		label: 'Quantity',
		variant: 'integer',
		placeholder: '1',
		id: 'quantity',
		value: '10',
	},
};

export const Sizes: Story = {
	render: () => (
		<div className='space-y-4 w-80'>
			{(['xs', 'sm', 'default', 'lg'] as const).map((size) => (
				<Input key={size} size={size} placeholder={`Size: ${size}`} label={`${size} input`} id={`size-${size}`} />
			))}
		</div>
	),
};

export const FormExample: Story = {
	name: 'Usage in a Form (Interactive)',
	render: () => <InputFormDemo />,
};

const InputFormDemo = () => {
	const [values, setValues] = useState({ name: '', email: '', amount: '' });
	return (
		<div className='space-y-4 w-80 p-6 border rounded-lg'>
			<h3 className='font-semibold text-sm text-foreground'>Add Credit Grant</h3>
			<Input
				label='Display Name'
				placeholder='e.g. Welcome Bonus'
				value={values.name}
				onChange={(v) => setValues((p) => ({ ...p, name: v }))}
				id='grant-name'
			/>
			<Input
				label='Amount'
				variant='formatted-number'
				inputPrefix={<DollarSign className='size-3.5 text-muted-foreground' />}
				placeholder='100.00'
				value={values.amount}
				onChange={(v) => setValues((p) => ({ ...p, amount: v }))}
				id='grant-amount'
			/>
			<Input
				label='Customer Email'
				placeholder='customer@example.com'
				value={values.email}
				onChange={(v) => setValues((p) => ({ ...p, email: v }))}
				id='grant-email'
			/>
		</div>
	);
};
