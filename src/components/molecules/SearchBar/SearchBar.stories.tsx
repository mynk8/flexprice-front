import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import SearchBar from './SearchBar';

/**
 * ## SearchBar
 *
 * A molecule composing Input with a search icon, clear button, and built-in debounce.
 * Used on tables and lists throughout FlexPrice (customers, plans, invoices, events).
 *
 * ### Props
 * - `value` — Controlled input value
 * - `onChange` — Called with the debounced search query
 * - `placeholder` — Input placeholder text
 * - `debounceMs` — Debounce delay in milliseconds (default: 300)
 * - `isLoading` — Shows a loading spinner in the suffix position
 * - `disabled` — Disables the input
 * - `className` — Additional wrapper classes
 */
const meta = {
	title: 'Molecules/SearchBar',
	component: SearchBar,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'Search input with debounce, clear button, and loading state. Used for filtering tables and lists throughout FlexPrice.',
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
		debounceMs: {
			control: { type: 'range', min: 0, max: 1000, step: 50 },
			description: 'Debounce delay in milliseconds',
			table: { defaultValue: { summary: '300' } },
		},
		isLoading: { control: 'boolean' },
		disabled: { control: 'boolean' },
		onChange: { action: 'search-changed' },
	},
	args: {
		placeholder: 'Search...',
		onChange: fn(),
	},
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SearchBarWithValueDemo = () => {
	const [query, setQuery] = useState('Acme Corp');
	return (
		<div className='w-72'>
			<SearchBar value={query} onChange={setQuery} placeholder='Search customers...' />
			{query && <p className='mt-2 text-xs text-muted-foreground'>Query: "{query}"</p>}
		</div>
	);
};

const SearchBarDebounceDemo = () => {
	const [input, setInput] = useState('');
	const [debounced] = useDebounce(input, 300);

	return (
		<div className='w-80 space-y-3'>
			<SearchBar value={input} onChange={setInput} placeholder='Type to see debounce...' />
			<div className='text-xs space-y-1 p-3 bg-muted/40 rounded border border-border'>
				<div>
					<span className='text-muted-foreground'>Immediate: </span>
					<span className='font-mono'>{input || '(empty)'}</span>
				</div>
				<div>
					<span className='text-muted-foreground'>Debounced: </span>
					<span className='font-mono text-blue-600'>{debounced || '(empty)'}</span>
				</div>
			</div>
		</div>
	);
};

const SearchBarTableContextDemo = () => {
	const [query, setQuery] = useState('');
	const allData = ['Acme Corp', 'TechStart Inc', 'GlobalPay Ltd', 'DataFlow Systems', 'CloudNine SaaS'];
	const filtered = allData.filter((name) => name.toLowerCase().includes(query.toLowerCase()));

	return (
		<div className='w-96 space-y-3'>
			<div className='flex justify-between items-center'>
				<h3 className='text-sm font-semibold text-foreground'>Customers ({filtered.length})</h3>
				<div className='w-48'>
					<SearchBar placeholder='Search customers...' onChange={setQuery} />
				</div>
			</div>
			<div className='border rounded-lg overflow-hidden'>
				{filtered.length > 0 ? (
					filtered.map((name) => (
						<div key={name} className='px-4 py-2.5 border-b border-border last:border-b-0 text-sm text-foreground'>
							{name}
						</div>
					))
				) : (
					<div className='px-4 py-6 text-center text-sm text-muted-foreground'>No customers found</div>
				)}
			</div>
		</div>
	);
};

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
	args: { placeholder: 'Search customers...' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.type(input, 'Acme');
		await expect(input).toHaveValue('Acme');
	},
};

// ─── With Value ───────────────────────────────────────────────────────────────

export const WithValue: Story = {
	render: () => <SearchBarWithValueDemo />,
};

// ─── Loading State ────────────────────────────────────────────────────────────

export const Loading: Story = {
	args: {
		isLoading: true,
		placeholder: 'Searching...',
	},
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
	args: {
		disabled: true,
		placeholder: 'Search disabled',
	},
};

// ─── With Debounce Demo ───────────────────────────────────────────────────────

export const DebounceDemo: Story = {
	name: 'Debounce Demo (300ms)',
	render: () => <SearchBarDebounceDemo />,
};

// ─── In Table Context ─────────────────────────────────────────────────────────

export const InTableContext: Story = {
	name: 'With Table Toolbar',
	render: () => <SearchBarTableContextDemo />,
};
