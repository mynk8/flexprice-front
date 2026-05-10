import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SortDropdown from './SortDropdown';
import { SortOption, SortDirection } from '@/types/common/QueryBuilder';

const meta: Meta<typeof SortDropdown> = {
	title: 'Molecules/QueryBuilder/SortDropdown',
	component: SortDropdown,
	parameters: {
		layout: 'centered',
		backgrounds: {
			default: 'light',
		},
		docs: {
			description: {
				component:
					'Sort configuration panel with multi-field support, drag-to-reorder (via dnd-kit sortable), and per-field asc/desc direction. Used in query builder toolbars.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		disabled: { control: 'boolean' },
		maxSorts: { control: 'number' },
		className: { control: false },
	},
};

export default meta;
type Story = StoryObj<typeof SortDropdown>;

const options: SortOption[] = [
	{ field: 'name', label: 'Name' },
	{ field: 'created_at', label: 'Created At' },
	{ field: 'updated_at', label: 'Updated At' },
	{ field: 'status', label: 'Status' },
	{ field: 'priority', label: 'Priority' },
	{ field: 'est_hours', label: 'Est. Hours' },
	{ field: 'assigned_to', label: 'Assigned To' },
	{ field: 'due_date', label: 'Due Date' },
];

const DefaultStory = () => {
	const [sorts, setSorts] = useState<SortOption[]>([]);

	return (
		<div className='p-10'>
			<SortDropdown options={options} value={sorts} onChange={setSorts} />
		</div>
	);
};

const WithInitialSortsStory = () => {
	const [sorts, setSorts] = useState<SortOption[]>([
		{ field: 'created_at', label: 'Created At', direction: SortDirection.DESC },
		{ field: 'priority', label: 'Priority', direction: SortDirection.ASC },
	]);

	return (
		<div className='p-10'>
			<SortDropdown options={options} value={sorts} onChange={setSorts} />
		</div>
	);
};

export const Default: Story = {
	render: () => <DefaultStory />,
};

export const WithInitialSorts: Story = {
	render: () => <WithInitialSortsStory />,
};
