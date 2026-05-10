import type { Meta, StoryObj } from '@storybook/react';
import MetricCard from './MetricCard';

/**
 * ## MetricCard
 *
 * A KPI summary card displaying a metric label, a formatted value, and an optional
 * trend indicator. Used on the FlexPrice dashboard to surface key billing metrics like
 * MRR, total customers, active subscriptions, and outstanding invoices.
 *
 * ### Props
 * - `title` — The metric label (e.g. "Monthly Revenue")
 * - `value` — Numeric value to display (formatted with `formatNumber`)
 * - `currency` — If provided, prepends the currency symbol (e.g. `USD` → `$`)
 * - `isPercent` — Formats value as a percentage
 * - `showChangeIndicator` — Shows a trending arrow icon
 * - `isNegative` — Renders the trend as red/down instead of green/up
 */
const meta = {
	title: 'Molecules/MetricCard',
	component: MetricCard,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'KPI card displayed on the dashboard. Supports currency values, percentages, and optional trend direction indicators.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' },
		value: { control: 'number' },
		currency: {
			control: 'select',
			options: [undefined, 'USD', 'EUR', 'GBP', 'INR'],
		},
		isPercent: { control: 'boolean' },
		showChangeIndicator: { control: 'boolean' },
		isNegative: { control: 'boolean' },
	},
	decorators: [
		(Story) => (
			<div className='w-64'>
				<Story />
			</div>
		),
	],
	args: {
		title: 'Total Revenue',
		value: 24500,
		currency: 'USD',
	},
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
	args: {
		title: 'Monthly Revenue',
		value: 24500,
		currency: 'USD',
	},
};

// ─── Currency Variants ────────────────────────────────────────────────────────

export const EuroCurrency: Story = {
	args: {
		title: 'Total Invoiced',
		value: 18750,
		currency: 'EUR',
	},
};

// ─── Percentage ───────────────────────────────────────────────────────────────

export const Percentage: Story = {
	args: {
		title: 'Churn Rate',
		value: 3.2,
		isPercent: true,
	},
};

// ─── With Positive Trend ──────────────────────────────────────────────────────

export const PositiveTrend: Story = {
	args: {
		title: 'New Subscriptions',
		value: 142,
		showChangeIndicator: true,
		isNegative: false,
	},
};

// ─── With Negative Trend ──────────────────────────────────────────────────────

export const NegativeTrend: Story = {
	args: {
		title: 'Churn Rate',
		value: 5.8,
		isPercent: true,
		showChangeIndicator: true,
		isNegative: true,
	},
};

// ─── Count (no currency) ──────────────────────────────────────────────────────

export const CountValue: Story = {
	args: {
		title: 'Active Customers',
		value: 1234,
	},
};

// ─── Zero Value ───────────────────────────────────────────────────────────────

export const ZeroValue: Story = {
	args: {
		title: 'Outstanding Credits',
		value: 0,
		currency: 'USD',
	},
};

// ─── Dashboard Grid ───────────────────────────────────────────────────────────

export const DashboardGrid: Story = {
	name: 'Dashboard KPI Grid',
	render: () => (
		<div className='grid grid-cols-2 gap-4 w-[560px]'>
			<MetricCard title='Monthly Revenue' value={48250} currency='USD' showChangeIndicator isNegative={false} />
			<MetricCard title='Active Subscriptions' value={312} showChangeIndicator isNegative={false} />
			<MetricCard title='Churn Rate' value={2.4} isPercent showChangeIndicator isNegative={true} />
			<MetricCard title='Outstanding Invoices' value={7840} currency='USD' showChangeIndicator isNegative={true} />
		</div>
	),
};
