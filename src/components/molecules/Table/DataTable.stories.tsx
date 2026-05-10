import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { useMemo, useState } from 'react';
import DataTable, { ColumnData, DataTableProps } from './Table';
import Chip from '@/components/atoms/Chip';
import { Button } from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import useFilterStore from '@/store/useFilterStore';
import { cn } from '@/lib/utils';

/**
 * ## DataTable
 *
 * A feature-rich data table used throughout FlexPrice for displaying customers,
 * invoices, subscriptions, plans, and more. Supports:
 * - Typed column definitions with `render` functions or `fieldName` accessors
 * - Row click handlers (smart — ignores clicks on interactive children)
 * - Empty row state
 * - Sortable headers
 * - Loading skeleton rows
 * - Pagination controls
 * - Bordered and borderless variants
 * - Flexible column widths (flex or fixed)
 * - Optional virtualization for large row sets
 *
 * ### Column Props
 * - `title` — Column header content
 * - `fieldName` — Key of the data object to display directly
 * - `render` — Custom render function `(row: T) => ReactNode`
 * - `width` — Fixed width (number = px, string = any CSS)
 * - `flex` — Flex grow factor
 * - `align` — `left` | `center` | `right`
 * - `fieldVariant` — `default` | `title` | `link` | `icon` | `interactive`
 * - `sortable` / `sortKey` — Enables controlled sort headers
 */
const meta = {
	title: 'Molecules/DataTable',
	component: DataTable as React.ComponentType<DataTableProps<Customer>>,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Core data table component. Handles row click suppression for interactive elements, flexible columns, and empty states.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'no-bordered'],
		},
		showEmptyRow: { control: 'boolean' },
		hideBottomBorder: { control: 'boolean' },
		onRowClick: { action: 'row-clicked' },
		virtualization: { control: false },
		isLoading: { control: 'boolean' },
		loadingRowCount: { control: 'number' },
		sort: { control: false },
		pagination: { control: false },
	},
} satisfies Meta<DataTableProps<Customer>>;

export default meta;
type CustomerStory = StoryObj<DataTableProps<Customer>>;
type InvoiceStory = StoryObj<DataTableProps<Invoice>>;

interface Customer {
	id: string;
	name: string;
	email: string;
	plan: string;
	status: 'active' | 'inactive' | 'trial';
	mrr: string;
	createdAt: string;
}

const customerData: Customer[] = [
	{
		id: 'cust_001',
		name: 'Acme Corp',
		email: 'billing@acme.com',
		plan: 'Growth',
		status: 'active',
		mrr: '$1,250',
		createdAt: 'Jan 15, 2025',
	},
	{
		id: 'cust_002',
		name: 'TechStart Inc',
		email: 'admin@techstart.io',
		plan: 'Starter',
		status: 'trial',
		mrr: '$0',
		createdAt: 'Feb 3, 2025',
	},
	{
		id: 'cust_003',
		name: 'GlobalPay Ltd',
		email: 'finance@globalpay.com',
		plan: 'Enterprise',
		status: 'active',
		mrr: '$8,400',
		createdAt: 'Mar 22, 2025',
	},
	{
		id: 'cust_004',
		name: 'DataFlow Systems',
		email: 'ops@dataflow.io',
		plan: 'Growth',
		status: 'inactive',
		mrr: '$0',
		createdAt: 'Nov 5, 2024',
	},
	{
		id: 'cust_005',
		name: 'CloudNine SaaS',
		email: 'hello@cloudnine.app',
		plan: 'Starter',
		status: 'active',
		mrr: '$99',
		createdAt: 'Apr 1, 2025',
	},
];

const statusVariantMap = {
	active: 'success' as const,
	inactive: 'default' as const,
	trial: 'info' as const,
};

const customerColumns = [
	{
		title: 'Name',
		fieldVariant: 'title',
		render: (row) => (
			<div>
				<div className='font-medium text-foreground'>{row.name}</div>
				<div className='text-xs text-muted-foreground'>{row.id}</div>
			</div>
		),
	},
	{
		title: 'Email',
		fieldName: 'email',
	},
	{
		title: 'Plan',
		render: (row) => <span className='font-medium'>{row.plan}</span>,
	},
	{
		title: 'Status',
		align: 'center',
		width: 120,
		render: (row) => <Chip label={row.status.charAt(0).toUpperCase() + row.status.slice(1)} variant={statusVariantMap[row.status]} />,
	},
	{
		title: 'MRR',
		align: 'right',
		render: (row) => <span className='font-medium'>{row.mrr}</span>,
	},
	{
		title: 'Created',
		fieldName: 'createdAt',
	},
] satisfies ColumnData<Customer>[];

const sortableCustomerColumns = customerColumns.map((column) => ({
	...column,
	sortable: true,
	sortKey: typeof column.title === 'string' ? column.title.toLowerCase().replace(/[^a-z0-9]+/g, '') : undefined,
})) satisfies ColumnData<Customer>[];

const sortCustomers = (rows: Customer[], sortKey: string | undefined, direction: 'asc' | 'desc' | undefined) => {
	if (!sortKey || !direction) return rows;

	const getSortValue = (customer: Customer) => {
		switch (sortKey) {
			case 'name':
				return customer.name;
			case 'email':
				return customer.email;
			case 'plan':
				return customer.plan;
			case 'status':
				return customer.status;
			case 'mrr':
				return Number(customer.mrr.replace(/[^0-9.-]/g, ''));
			case 'created':
				return new Date(customer.createdAt).getTime();
			default:
				return '';
		}
	};

	return [...rows].sort((first, second) => {
		const firstValue = getSortValue(first);
		const secondValue = getSortValue(second);
		const result =
			typeof firstValue === 'number' && typeof secondValue === 'number'
				? firstValue - secondValue
				: String(firstValue).localeCompare(String(secondValue));
		return direction === 'asc' ? result : -result;
	});
};

// Invoice data for variety
interface Invoice {
	id: string;
	customer: string;
	amount: string;
	status: string;
	dueDate: string;
}

const invoiceData: Invoice[] = [
	{ id: 'INV-001', customer: 'Acme Corp', amount: '$2,500.00', status: 'Paid', dueDate: 'May 1, 2025' },
	{ id: 'INV-002', customer: 'TechStart Inc', amount: '$99.00', status: 'Draft', dueDate: 'May 15, 2025' },
	{ id: 'INV-003', customer: 'GlobalPay Ltd', amount: '$8,400.00', status: 'Overdue', dueDate: 'Apr 1, 2025' },
];

const invoiceStatusMap: Record<string, 'success' | 'info' | 'failed' | 'warning' | 'default'> = {
	Paid: 'success',
	Draft: 'info',
	Overdue: 'failed',
	Void: 'default',
};

const invoiceColumns = [
	{ title: 'Invoice #', fieldName: 'id', fieldVariant: 'title' },
	{ title: 'Customer', fieldName: 'customer' },
	{ title: 'Amount', fieldName: 'amount', align: 'right' },
	{
		title: 'Status',
		render: (row) => <Chip label={row.status} variant={invoiceStatusMap[row.status] ?? 'default'} />,
	},
	{ title: 'Due Date', fieldName: 'dueDate' },
] satisfies ColumnData<Invoice>[];

export const Default: CustomerStory = {
	args: {
		columns: customerColumns,
		data: customerData,
		onRowClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const rows = canvas.getAllByRole('row');
		await userEvent.click(rows[1]);
		await expect(args.onRowClick).toHaveBeenCalled();
	},
};

export const InvoicesTable: InvoiceStory = {
	name: 'Invoice Table with Status Chips',
	args: {
		columns: invoiceColumns,
		data: invoiceData,
	},
};

export const EmptyState: CustomerStory = {
	args: {
		columns: customerColumns,
		data: [],
		showEmptyRow: true,
	},
};

export const LoadingSkeleton: CustomerStory = {
	name: 'Loading Skeleton',
	args: {
		columns: customerColumns,
		data: [],
		isLoading: true,
		loadingRowCount: 5,
	},
};

const SortablePaginatedDemo = () => {
	const [sortState, setSortState] = useState<{ key?: string; direction?: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
	const [page, setPage] = useState(1);
	const pageSize = 3;
	const sortedRows = useMemo(() => sortCustomers(customerData, sortState.key, sortState.direction), [sortState]);
	const pageRows = useMemo(() => sortedRows.slice((page - 1) * pageSize, page * pageSize), [page, sortedRows]);

	return (
		<DataTable
			columns={sortableCustomerColumns}
			data={pageRows}
			sort={{
				key: sortState.key,
				direction: sortState.direction,
				onSortChange: (key, direction) => {
					setSortState({ key, direction });
					setPage(1);
				},
			}}
			pagination={{
				page,
				pageSize,
				totalItems: sortedRows.length,
				onPageChange: setPage,
				unit: 'customers',
			}}
		/>
	);
};

export const SortableWithPagination: CustomerStory = {
	name: 'Sortable with Pagination',
	args: {
		columns: sortableCustomerColumns,
		data: [],
	},
	render: () => <SortablePaginatedDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /MRR/i }));
		await expect(canvas.getByText(/Page 1 of 2/i)).toBeInTheDocument();
	},
};

export const NoBorderVariant: InvoiceStory = {
	name: 'Borderless Variant',
	args: {
		columns: invoiceColumns,
		data: invoiceData,
		variant: 'no-bordered',
	},
};

const generateLargeDataset = (count: number): Customer[] =>
	Array.from({ length: count }, (_, i) => ({
		id: `cust_${String(i + 1).padStart(4, '0')}`,
		name: `Customer ${i + 1}`,
		email: `customer${i + 1}@example.com`,
		plan: ['Starter', 'Growth', 'Enterprise'][i % 3],
		status: (['active', 'inactive', 'trial'] as const)[i % 3],
		mrr: `$${((i * 137) % 10000).toLocaleString()}`,
		createdAt: `${['Jan', 'Feb', 'Mar', 'Apr', 'May'][i % 5]} ${(i % 28) + 1}, 2025`,
	}));

const handleLargeRowClick = fn();
const handleVirtualRowClick = fn();

export const LargeDataset: CustomerStory = {
	name: 'Large Dataset (100 rows)',
	args: {
		columns: customerColumns,
		data: [],
	},
	render: () => (
		<div className='max-h-96 overflow-y-auto border rounded-lg'>
			<DataTable columns={customerColumns} data={generateLargeDataset(100)} onRowClick={handleLargeRowClick} />
		</div>
	),
};

const VirtualizedTableDemo = () => {
	const rows = useMemo(() => generateLargeDataset(10000), []);

	return (
		<DataTable
			columns={customerColumns}
			data={rows}
			virtualization={{
				enabled: true,
				height: 420,
				estimateRowHeight: 56,
				overscan: 12,
				getRowKey: (row: Customer) => row.id,
			}}
			onRowClick={handleVirtualRowClick}
		/>
	);
};

export const VirtualizedTenThousandRows: CustomerStory = {
	name: 'Virtualized 10,000 Rows',
	args: {
		columns: customerColumns,
		data: [],
	},
	parameters: {
		docs: {
			description: {
				story: 'Uses @tanstack/react-virtual to mount only visible rows plus overscan while preserving the DataTable column API.',
			},
		},
	},
	render: () => <VirtualizedTableDemo />,
};

interface RichInvoice {
	id: string;
	customer: string;
	plan: string;
	notes: string;
	amount: string;
	status: string;
}

const richInvoices: RichInvoice[] = Array.from({ length: 500 }, (_, i) => ({
	id: `INV-${String(i + 1).padStart(4, '0')}`,
	customer: ['Acme Corp', 'TechStart Inc', 'GlobalPay Ltd', 'CloudNine SaaS'][i % 4],
	plan: ['Starter', 'Growth', 'Enterprise'][i % 3],
	notes:
		i % 3 === 0
			? 'Customer requested extended billing terms. Approved by finance team. Reference: PO-2024-1132'
			: i % 3 === 1
				? 'Multi-line item: platform fee, API overage charges, and seat-based licensing.'
				: '',
	amount: `$${((i + 1) * 137).toLocaleString()}.00`,
	status: ['Paid', 'Draft', 'Overdue', 'Void'][i % 4],
}));

const richInvoiceColumns: ColumnData<RichInvoice>[] = [
	{ title: 'Invoice #', fieldName: 'id', fieldVariant: 'title', width: 120 },
	{ title: 'Customer', fieldName: 'customer' },
	{
		title: 'Notes',
		flex: 2,
		render: (row: RichInvoice) => (
			<span className={cn('text-[14px]', row.notes ? 'text-foreground' : 'text-muted-foreground italic')}>{row.notes || 'No notes'}</span>
		),
	},
	{ title: 'Amount', fieldName: 'amount', align: 'right' as const, width: 100 },
];

const richInvoiceStatusMap: Record<string, 'success' | 'info' | 'failed' | 'warning' | 'default'> = {
	Paid: 'success',
	Draft: 'info',
	Overdue: 'failed',
	Void: 'default',
};

const richInvoiceColumnsWithStatus: ColumnData<RichInvoice>[] = [
	...richInvoiceColumns,
	{
		title: 'Status',
		align: 'center' as const,
		width: 100,
		render: (row: RichInvoice) => <Chip label={row.status} variant={richInvoiceStatusMap[row.status] ?? 'default'} />,
	},
];

export const VirtualizedWithAutoHeight: CustomerStory = {
	name: 'Virtualized with Dynamic Row Height',
	args: {
		columns: customerColumns,
		data: [],
	},
	parameters: {
		docs: {
			description: {
				story:
					'Enables `enableAutoHeight` so rows with variable content (e.g. multi-line notes) are measured after render and the virtualizer adjusts scroll position accordingly. Useful for invoice tables with expandable or long-form notes.',
			},
		},
	},
	render: () => (
		<div className='max-h-[420px] overflow-y-auto rounded-md border border-border'>
			<DataTable
				columns={richInvoiceColumnsWithStatus}
				data={richInvoices}
				virtualization={{
					enabled: true,
					height: 420,
					estimateRowHeight: 44,
					overscan: 5,
					enableAutoHeight: true,
					getRowKey: (row: RichInvoice) => row.id,
				}}
			/>
		</div>
	),
};

const FilterPersistenceDemo = () => {
	const { filters, fingerprint, storageKey, urlParam, setFilter, resetFilters } = useFilterStore('customers');
	const search = typeof filters.search === 'string' ? filters.search : '';
	const status = typeof filters.status === 'string' ? filters.status : '';

	const filteredRows = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();
		return customerData.filter((customer) => {
			const matchesSearch =
				normalizedSearch.length === 0 ||
				customer.name.toLowerCase().includes(normalizedSearch) ||
				customer.email.toLowerCase().includes(normalizedSearch);
			const matchesStatus = !status || customer.status === status;
			return matchesSearch && matchesStatus;
		});
	}, [search, status]);

	return (
		<div className='space-y-4'>
			<div className='flex flex-wrap items-end gap-3 rounded-md border border-border bg-card p-3'>
				<div className='w-72'>
					<Input
						label='Customer search'
						placeholder='Search by name or email'
						value={search}
						onChange={(value) => setFilter('search', value)}
					/>
				</div>
				<label className='flex flex-col gap-2 text-sm font-medium text-foreground'>
					Status
					<select
						className='h-10 rounded-md border border-input bg-background px-3 text-sm'
						value={status}
						onChange={(event) => setFilter('status', event.target.value)}>
						<option value=''>All statuses</option>
						<option value='active'>Active</option>
						<option value='trial'>Trial</option>
						<option value='inactive'>Inactive</option>
					</select>
				</label>
				<Button variant='outline' onClick={resetFilters}>
					Reset
				</Button>
				<div className='ml-auto text-xs text-muted-foreground'>
					<div>storage: {storageKey}</div>
					<div>
						URL: {urlParam}={fingerprint}
					</div>
				</div>
			</div>
			<DataTable columns={customerColumns} data={filteredRows} showEmptyRow />
		</div>
	);
};

export const WithFilterPersistence: CustomerStory = {
	name: 'With Filter Persistence',
	args: {
		columns: customerColumns,
		data: [],
	},
	parameters: {
		docs: {
			description: {
				story:
					'Demonstrates the route-scoped Zustand filter store. Full filters persist to sessionStorage while the URL receives only a compact fingerprint.',
			},
		},
	},
	render: () => <FilterPersistenceDemo />,
};

export const ClickableRows: CustomerStory = {
	name: 'Clickable Rows (with hover)',
	args: {
		columns: customerColumns,
		data: customerData,
		onRowClick: fn(),
	},
};

export const SingleColumn: CustomerStory = {
	args: {
		columns: [{ title: 'Plan Name', fieldVariant: 'title', render: (row: Customer) => row.name }],
		data: customerData,
	},
};
