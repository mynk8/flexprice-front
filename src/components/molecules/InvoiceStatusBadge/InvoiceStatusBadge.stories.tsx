import type { Meta, StoryObj } from '@storybook/react';
import InvoiceStatusBadge, { InvoiceStatus } from './InvoiceStatusBadge';

/**
 * ## InvoiceStatusBadge
 *
 * Displays an invoice's lifecycle status as a colour-coded chip with an associated icon.
 * This component encapsulates the status-to-colour mapping logic for consistent use
 * across all invoice tables, detail pages, and email previews.
 *
 * ### Status Lifecycle
 * `draft` → `finalized` → `paid` | `overdue` | `uncollectible` | `void`
 */
const meta = {
	title: 'Molecules/InvoiceStatusBadge',
	component: InvoiceStatusBadge,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Maps invoice status strings to consistently styled colour chips with icons. Covers the complete invoice lifecycle from draft through payment.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		status: {
			control: 'select',
			options: ['paid', 'draft', 'void', 'overdue', 'pending', 'finalized', 'uncollectible'],
			description: 'Invoice status from the API',
		},
		showIcon: {
			control: 'boolean',
			description: 'Whether to show the leading status icon',
			table: { defaultValue: { summary: 'true' } },
		},
		className: { control: false },
	},
	args: {
		status: 'paid',
		showIcon: true,
	},
} satisfies Meta<typeof InvoiceStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
	args: { status: 'paid' },
};

// ─── All Statuses ─────────────────────────────────────────────────────────────

export const Paid: Story = {
	args: { status: 'paid' },
};

export const Draft: Story = {
	args: { status: 'draft' },
};

export const Finalized: Story = {
	args: { status: 'finalized' },
};

export const Pending: Story = {
	args: { status: 'pending' },
};

export const Overdue: Story = {
	args: { status: 'overdue' },
};

export const Void: Story = {
	args: { status: 'void' },
};

export const Uncollectible: Story = {
	args: { status: 'uncollectible' },
};

// ─── Without Icon ─────────────────────────────────────────────────────────────

export const WithoutIcon: Story = {
	args: { status: 'paid', showIcon: false },
};

// ─── All Statuses Showcase ────────────────────────────────────────────────────

export const AllStatuses: Story = {
	name: 'All Status Variants',
	render: () => {
		const statuses: InvoiceStatus[] = ['paid', 'draft', 'finalized', 'pending', 'overdue', 'void', 'uncollectible'];
		return (
			<div className='flex flex-wrap gap-3 p-4'>
				{statuses.map((status) => (
					<InvoiceStatusBadge key={status} status={status} />
				))}
			</div>
		);
	},
};

// ─── In a Table Row ───────────────────────────────────────────────────────────

export const InTableContext: Story = {
	name: 'In an Invoice Table',
	render: () => {
		const invoices = [
			{ id: 'INV-2025-001', customer: 'Acme Corp', amount: '$1,250.00', status: 'paid' as InvoiceStatus, date: 'May 1, 2025' },
			{ id: 'INV-2025-002', customer: 'TechStart Inc', amount: '$99.00', status: 'draft' as InvoiceStatus, date: 'May 15, 2025' },
			{ id: 'INV-2025-003', customer: 'GlobalPay Ltd', amount: '$8,400.00', status: 'overdue' as InvoiceStatus, date: 'Apr 1, 2025' },
			{ id: 'INV-2025-004', customer: 'DataFlow Sys', amount: '$320.00', status: 'void' as InvoiceStatus, date: 'Mar 22, 2025' },
			{ id: 'INV-2025-005', customer: 'CloudNine', amount: '$599.00', status: 'pending' as InvoiceStatus, date: 'May 20, 2025' },
		];

		return (
			<div className='border rounded-[6px] overflow-hidden'>
				<table className='w-full text-sm'>
					<thead className='bg-muted/40 border-b border-border'>
						<tr>
							{['Invoice', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
								<th key={h} className='px-4 py-3 text-left font-medium text-muted-foreground'>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{invoices.map((inv, i) => (
							<tr key={inv.id} className={`border-b border-border ${i % 2 === 0 ? 'bg-card' : 'bg-muted/20'}`}>
								<td className='px-4 py-3 font-medium text-foreground'>{inv.id}</td>
								<td className='px-4 py-3 text-muted-foreground'>{inv.customer}</td>
								<td className='px-4 py-3 font-medium'>{inv.amount}</td>
								<td className='px-4 py-3'>
									<InvoiceStatusBadge status={inv.status} />
								</td>
								<td className='px-4 py-3 text-muted-foreground'>{inv.date}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	},
};
