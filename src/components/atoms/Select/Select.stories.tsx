import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, screen, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { Globe } from 'lucide-react';
import FlexPriceSelect from './Select';
import SearchableSelect from './SearchableSelect';

/**
 * ## Select / Dropdown
 *
 * A single-select dropdown built on Radix UI Select primitive. Supports standard
 * and radio-style selection, option descriptions, disabled options, and custom icons.
 *
 * ### Props
 * - `options` — Array of `{ value, label, description?, prefixIcon?, suffixIcon?, disabled? }`
 * - `value` — Currently selected value
 * - `onChange` — Callback with new selected value string
 * - `label` — Label displayed above the dropdown
 * - `placeholder` — Displayed when no option is selected
 * - `description` — Helper text below the dropdown
 * - `error` — Error message (also applies destructive styling)
 * - `disabled` — Disables the entire dropdown
 * - `isRadio` — Shows radio-circle selection indicator style
 * - `noOptionsText` — Displayed when options array is empty
 * - `SearchableSelect` — Command + Popover variant for searchable dropdowns
 */
const meta = {
	title: 'Atoms/Select',
	component: FlexPriceSelect,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Single-select dropdown with support for descriptions, icons, radio style, and error states. Used for currency selection, billing period, plan status, etc.',
			},
		},
	},
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<div className='w-72'>
				<Story />
			</div>
		),
	],
	argTypes: {
		placeholder: { control: 'text' },
		label: { control: 'text' },
		description: { control: 'text' },
		error: { control: 'text' },
		disabled: { control: 'boolean' },
		isRadio: { control: 'boolean' },
		value: { control: 'text' },
		onChange: { action: 'changed' },
	},
	args: {
		onChange: fn(),
	},
} satisfies Meta<typeof FlexPriceSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const currencyOptions = [
	{ value: 'USD', label: 'US Dollar (USD)', prefixIcon: <Globe className='size-3.5' /> },
	{ value: 'EUR', label: 'Euro (EUR)', prefixIcon: <Globe className='size-3.5' /> },
	{ value: 'GBP', label: 'British Pound (GBP)', prefixIcon: <Globe className='size-3.5' /> },
	{ value: 'INR', label: 'Indian Rupee (INR)', prefixIcon: <Globe className='size-3.5' /> },
];

const billingPeriodOptions = [
	{ value: 'monthly', label: 'Monthly' },
	{ value: 'quarterly', label: 'Quarterly' },
	{ value: 'annual', label: 'Annual' },
	{ value: 'daily', label: 'Daily' },
	{ value: 'weekly', label: 'Weekly' },
	{ value: 'onetime', label: 'One-time' },
];

const planTypeOptions = [
	{
		value: 'flat',
		label: 'Flat Rate',
		description: 'A fixed price per billing period',
	},
	{
		value: 'usage',
		label: 'Usage Based',
		description: 'Price based on metered consumption',
	},
	{
		value: 'tiered',
		label: 'Tiered',
		description: 'Different rates at different usage levels',
	},
	{
		value: 'package',
		label: 'Package',
		description: 'Bundles of units at a fixed price',
	},
];

const InteractiveSelectHarness = (props: React.ComponentProps<typeof FlexPriceSelect>) => {
	const [value, setValue] = useState(props.value || '');
	return <FlexPriceSelect {...props} value={value} onChange={setValue} />;
};

const SearchableSelectHarness = (props: React.ComponentProps<typeof SearchableSelect>) => {
	const [value, setValue] = useState(props.value || '');

	return (
		<SearchableSelect
			{...props}
			value={value}
			onChange={(nextValue) => {
				setValue(nextValue);
				props.onChange?.(nextValue);
			}}
		/>
	);
};

export const Default: Story = {
	render: (args) => <InteractiveSelectHarness {...args} />,
	args: {
		options: billingPeriodOptions,
		placeholder: 'Select billing period',
	},
};

export const WithLabel: Story = {
	args: {
		options: billingPeriodOptions,
		label: 'Billing Period',
		placeholder: 'Select period',
		value: 'monthly',
	},
};

export const WithDescription: Story = {
	args: {
		options: currencyOptions,
		label: 'Currency',
		description: 'The currency used for all invoices in this plan.',
		placeholder: 'Select currency',
		value: 'USD',
	},
};

export const WithError: Story = {
	args: {
		options: billingPeriodOptions,
		label: 'Billing Period',
		error: 'Billing period is required to create a plan.',
		placeholder: 'Select period',
	},
};

export const Disabled: Story = {
	args: {
		options: billingPeriodOptions,
		label: 'Billing Period',
		disabled: true,
		placeholder: 'Select period',
		value: 'monthly',
	},
};

export const WithIcons: Story = {
	name: 'With Prefix Icons',
	args: {
		options: currencyOptions,
		label: 'Currency',
		placeholder: 'Select currency',
		value: 'EUR',
	},
};

export const WithDescriptions: Story = {
	name: 'With Option Descriptions',
	args: {
		options: planTypeOptions,
		label: 'Charge Type',
		placeholder: 'Select charge type',
		value: 'usage',
	},
};

export const RadioStyle: Story = {
	args: {
		options: billingPeriodOptions,
		label: 'Billing Period',
		isRadio: true,
		placeholder: 'Select period',
		value: 'monthly',
	},
};

export const SearchableDropdown: Story = {
	name: 'Searchable Dropdown',
	args: {
		options: currencyOptions,
		label: 'Currency',
		placeholder: 'Select currency',
	},
	render: (args) => (
		<SearchableSelectHarness {...args} searchPlaceholder='Search currency' emptyText='No currency found.' hideSelectedTick={false} />
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('combobox', { name: /Select currency/i }));
		await userEvent.type(screen.getByPlaceholderText(/Search currency/i), 'eur');
		await userEvent.click(screen.getByText(/Euro/i));
		await expect(args.onChange).toHaveBeenCalledWith('EUR');
	},
};

export const FormExample: Story = {
	name: 'Usage in a Form (Interactive)',
	args: {
		options: billingPeriodOptions,
	},
	render: () => {
		const [currency, setCurrency] = useState('');
		const [period, setPeriod] = useState('');
		const [chargeType, setChargeType] = useState('');

		return (
			<div className='space-y-4 w-80 p-6 border rounded-lg'>
				<h3 className='font-semibold text-sm text-gray-800'>Configure Plan Pricing</h3>
				<FlexPriceSelect options={currencyOptions} label='Currency' value={currency} onChange={setCurrency} placeholder='Select currency' />
				<FlexPriceSelect
					options={billingPeriodOptions}
					label='Billing Period'
					value={period}
					onChange={setPeriod}
					placeholder='Select period'
				/>
				<FlexPriceSelect
					options={planTypeOptions}
					label='Charge Type'
					value={chargeType}
					onChange={setChargeType}
					placeholder='Select charge type'
				/>
			</div>
		);
	},
};
