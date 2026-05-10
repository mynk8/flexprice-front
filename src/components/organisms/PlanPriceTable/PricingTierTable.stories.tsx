import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import PricingTierTable, { type TierRow } from './PricingTierTable';

/**
 * ## PricingTierTable
 *
 * Displays structured pricing information for a plan's charges in a readable table format.
 * Covers flat-rate, volume-based, graduated, and package pricing models.
 * Used on Plan detail pages and pricing configuration screens.
 *
 * This story demonstrates various pricing tier configurations using the same
 * DataTable pattern used in production.
 */

const flatRateTiers: TierRow[] = [
	{
		name: 'Base Subscription',
		chargeType: 'Flat Rate',
		billingPeriod: 'Monthly',
		billingTiming: 'Advance',
		status: 'active',
		value: '$99.00',
	},
	{
		name: 'Add-on Storage',
		chargeType: 'Flat Rate',
		billingPeriod: 'Monthly',
		billingTiming: 'Advance',
		status: 'active',
		value: '$19.00',
	},
];

const mixedPricingTiers: TierRow[] = [
	{
		name: 'Platform Fee',
		chargeType: 'Flat Rate',
		billingPeriod: 'Monthly',
		billingTiming: 'Advance',
		status: 'active',
		value: '$299.00',
	},
	{
		name: 'API Calls',
		chargeType: 'Usage Based',
		billingPeriod: 'Monthly',
		billingTiming: 'Arrears',
		status: 'active',
		value: '$0.001 / call',
	},
	{
		name: 'Data Storage',
		chargeType: 'Graduated',
		billingPeriod: 'Monthly',
		billingTiming: 'Arrears',
		status: 'active',
		value: 'Tiered',
	},
	{
		name: 'Support Seats',
		chargeType: 'Package',
		billingPeriod: 'Annual',
		billingTiming: 'Advance',
		status: 'active',
		value: '$500 / 5 seats',
	},
	{
		name: 'Legacy Plan',
		chargeType: 'Flat Rate',
		billingPeriod: 'Monthly',
		billingTiming: 'Advance',
		status: 'inactive',
		value: '$149.00',
	},
	{
		name: 'New Feature Access',
		chargeType: 'Flat Rate',
		billingPeriod: 'Monthly',
		billingTiming: 'Advance',
		status: 'upcoming',
		value: '$49.00',
	},
];

const meta = {
	title: 'Organisms/PricingTierTable',
	component: PricingTierTable,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					"Displays a plan's pricing charges in a structured table. Supports flat-rate, usage-based, graduated, and package pricing models with status indicators.",
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' },
		onAddCharge: { action: 'add-charge-clicked' },
	},
	args: {
		onAddCharge: fn(),
	},
} satisfies Meta<typeof PricingTierTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		tiers: flatRateTiers,
		title: 'Charges',
	},
};

export const MixedPricingModels: Story = {
	name: 'Mixed Pricing Models',
	args: {
		tiers: mixedPricingTiers,
		title: 'Enterprise Plan Charges',
	},
};

export const WithStatusVariants: Story = {
	name: 'All Status States',
	args: {
		tiers: [
			{
				name: 'Active Charge',
				chargeType: 'Flat Rate',
				billingPeriod: 'Monthly',
				billingTiming: 'Advance',
				status: 'active',
				value: '$50.00',
			},
			{
				name: 'Upcoming Change',
				chargeType: 'Flat Rate',
				billingPeriod: 'Monthly',
				billingTiming: 'Advance',
				status: 'upcoming',
				value: '$60.00',
			},
			{
				name: 'Expired Price',
				chargeType: 'Flat Rate',
				billingPeriod: 'Monthly',
				billingTiming: 'Advance',
				status: 'inactive',
				value: '$40.00',
			},
		],
		title: 'Charge Status Demo',
	},
};

export const EmptyState: Story = {
	args: {
		tiers: [],
		title: 'New Plan Charges',
	},
};

export const UsageBasedPlan: Story = {
	name: 'Usage-Based Plan',
	args: {
		tiers: [
			{
				name: 'API Requests',
				chargeType: 'Usage Based',
				billingPeriod: 'Monthly',
				billingTiming: 'Arrears',
				status: 'active',
				value: '$0.0001 / req',
			},
			{
				name: 'Data Transfer',
				chargeType: 'Volume',
				billingPeriod: 'Monthly',
				billingTiming: 'Arrears',
				status: 'active',
				value: 'Volume',
			},
			{
				name: 'Storage',
				chargeType: 'Graduated',
				billingPeriod: 'Monthly',
				billingTiming: 'Arrears',
				status: 'active',
				value: 'Graduated',
			},
		],
		title: 'Developer API Plan Charges',
	},
};
