import type { Meta, StoryObj } from '@storybook/react';
import UsageBar from './UsageBar';

/**
 * ## UsageBar / MeterProgress
 *
 * A labelled meter showing used vs. entitled units for a feature or credit.
 * Wraps the `Progress` atom with usage-specific labelling and colour semantics:
 * - Green (0–60%): healthy usage
 * - Yellow (60–80%): approaching limit
 * - Orange (80–95%): high usage
 * - Red (>95%): at or over limit
 *
 * Used in subscription entitlement views and wallet balance cards.
 */
const meta = {
	title: 'Molecules/UsageBar',
	component: UsageBar,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Semantic usage meter with adaptive colours. Green → yellow → orange → red as usage approaches the limit. Used in subscription entitlement dashboards.',
			},
		},
	},
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<div className='w-96'>
				<Story />
			</div>
		),
	],
	argTypes: {
		featureName: { control: 'text' },
		used: { control: 'number' },
		limit: { control: 'number' },
		unit: { control: 'text' },
		showPercentage: { control: 'boolean' },
	},
	args: {
		featureName: 'API Calls',
		used: 5000,
		limit: 10000,
		unit: 'calls',
	},
} satisfies Meta<typeof UsageBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		featureName: 'API Calls',
		used: 5000,
		limit: 10000,
		unit: 'calls',
	},
};

export const LowUsage: Story = {
	name: 'Low Usage (25%)',
	args: {
		featureName: 'Data Storage',
		used: 2.5,
		limit: 10,
		unit: 'GB',
	},
};

export const ApproachingLimit: Story = {
	name: 'Approaching Limit (75%)',
	args: {
		featureName: 'Monthly Reports',
		used: 75,
		limit: 100,
		unit: 'reports',
	},
};

export const HighUsage: Story = {
	name: 'High Usage (90%)',
	args: {
		featureName: 'Webhook Calls',
		used: 9000,
		limit: 10000,
		unit: 'calls',
		showPercentage: true,
	},
};

export const AtLimit: Story = {
	name: 'At Limit (100%)',
	args: {
		featureName: 'Active Users',
		used: 50,
		limit: 50,
		unit: 'users',
		showPercentage: true,
	},
};

export const LargeNumbers: Story = {
	name: 'Large Numbers (formatted)',
	args: {
		featureName: 'Events Ingested',
		used: 850_000,
		limit: 1_000_000,
		unit: 'events',
		showPercentage: true,
	},
};

export const EntitlementsDashboard: Story = {
	name: 'Subscription Entitlements',
	render: () => (
		<div className='space-y-5 w-96 p-6 border border-border rounded-lg bg-card'>
			<div className='flex justify-between items-baseline mb-2'>
				<h3 className='text-sm font-semibold text-foreground'>Feature Usage</h3>
				<span className='text-xs text-muted-foreground'>Growth Plan</span>
			</div>
			<UsageBar featureName='API Calls' used={2500} limit={10000} unit='calls' />
			<UsageBar featureName='Data Storage' used={6.8} limit={10} unit='GB' showPercentage />
			<UsageBar featureName='Active Users' used={40} limit={50} unit='seats' showPercentage />
			<UsageBar featureName='Webhook Endpoints' used={9500} limit={10000} unit='calls' showPercentage />
			<UsageBar featureName='Reports' used={100} limit={100} unit='reports' showPercentage />
		</div>
	),
};
