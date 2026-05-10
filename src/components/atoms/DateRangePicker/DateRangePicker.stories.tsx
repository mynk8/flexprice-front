import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import DateRangePicker from './DateRangePicker';
import { subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';

/**
 * ## DateRangePicker
 *
 * A popover-based date range selector that supports timezone-aware selection
 * (local or UTC). Used for analytics filtering, report generation, and
 * subscription date range configuration in FlexPrice.
 *
 * ### Props
 * - `startDate` / `endDate` — Controlled date values
 * - `onChange` — Called with `{ startDate, endDate }` when a range is selected
 * - `placeholder` — Shown when no range is selected (default: "Select Range")
 * - `title` — Label text displayed above the picker button
 * - `disabled` — Prevents opening the calendar
 * - `minDate` / `maxDate` — Constrains selectable dates
 * - `className` — Custom classes for the trigger button width
 */
const meta = {
	title: 'Molecules/DateRangePicker',
	component: DateRangePicker,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Timezone-aware date range picker with two-month calendar view. Supports local and UTC timezone modes. Used for analytics date filtering throughout FlexPrice.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		placeholder: { control: 'text' },
		title: { control: 'text' },
		disabled: { control: 'boolean' },
		startDate: { control: 'date' },
		endDate: { control: 'date' },
		onChange: { action: 'range-changed' },
	},
	args: {
		onChange: fn(),
		placeholder: 'Select Range',
	},
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// Harness for interactive demonstration
const InteractivePickerHarness = (props: React.ComponentProps<typeof DateRangePicker>) => {
	const [start, setStart] = useState<Date | undefined>(props.startDate);
	const [end, setEnd] = useState<Date | undefined>(props.endDate);
	return (
		<DateRangePicker
			{...props}
			startDate={start}
			endDate={end}
			onChange={({ startDate, endDate }) => {
				setStart(startDate);
				setEnd(endDate);
				props.onChange?.({ startDate, endDate });
			}}
		/>
	);
};

export const Default: Story = {
	render: (args) => <InteractivePickerHarness {...args} />,
};

export const WithTitle: Story = {
	args: {
		title: 'Date Range',
	},
};

export const PreSelected: Story = {
	name: 'Pre-selected: Last 30 Days',
	args: {
		title: 'Analytics Period',
		startDate: subDays(new Date(), 30),
		endDate: new Date(),
	},
};

export const ThisMonth: Story = {
	name: 'Pre-selected: Current Month',
	args: {
		title: 'Billing Period',
		startDate: startOfMonth(new Date()),
		endDate: endOfMonth(new Date()),
	},
};

export const Disabled: Story = {
	args: {
		title: 'Date Range',
		disabled: true,
		startDate: subDays(new Date(), 7),
		endDate: new Date(),
	},
};

export const WithDateConstraints: Story = {
	name: 'With Min/Max Constraints',
	render: (args) => (
		<div className='space-y-2'>
			<InteractivePickerHarness
				{...args}
				title='Report Period'
				minDate={subMonths(new Date(), 3)}
				maxDate={new Date()}
				placeholder='Last 3 months only'
			/>
			<p className='text-xs text-gray-500'>Only dates within the last 3 months are selectable.</p>
		</div>
	),
};

export const InAnalyticsToolbar: Story = {
	name: 'Analytics Toolbar (Interactive)',
	render: () => {
		const [start, setStart] = useState<Date>(subDays(new Date(), 30));
		const [end, setEnd] = useState<Date>(new Date());

		return (
			<div className='flex items-end gap-4 p-4 border rounded-lg bg-white'>
				<div>
					<label className='block text-xs font-medium text-gray-600 mb-1'>Metric</label>
					<select className='h-8 px-3 text-sm border rounded-[6px] text-gray-700'>
						<option>Revenue</option>
						<option>Usage</option>
						<option>MRR</option>
					</select>
				</div>
				<DateRangePicker
					title='Period'
					startDate={start}
					endDate={end}
					onChange={({ startDate, endDate }) => {
						if (startDate) setStart(startDate);
						if (endDate) setEnd(endDate);
					}}
				/>
				<button className='h-8 px-4 bg-[#092E44] text-white text-sm rounded-[6px] whitespace-nowrap'>Apply Filter</button>
			</div>
		);
	},
};
