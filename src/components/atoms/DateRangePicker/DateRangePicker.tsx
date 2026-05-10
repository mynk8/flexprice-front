import { useCallback, useEffect, useState } from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import type { CalendarTimezone } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { startOfMonth } from 'date-fns';
import {
	formatDateInZone,
	startOfDayInZone,
	convertDateToTimezone,
	toCalendarDisplayDate,
	type DateTimezone,
} from '@/utils/common/format_date';

export interface DateRangePickerProps {
	/** Optional start date for the range. */
	startDate?: Date;
	/** Optional end date for the range. */
	endDate?: Date;
	/** Placeholder text shown when no range is selected. Defaults to 'Select Range'. */
	placeholder?: string;
	/** Whether the picker is disabled. */
	disabled?: boolean;
	/** Optional title or label displayed above the picker. */
	title?: string;
	/** Earliest selectable date. */
	minDate?: Date;
	/** Latest selectable date. */
	maxDate?: Date;
	/** Callback function triggered when the date range changes. */
	onChange: (dates: { startDate?: Date; endDate?: Date }) => void;
	/** Additional CSS classes for the container. */
	className?: string;
	/** Additional CSS classes for the title label. */
	labelClassName?: string;
	/** Additional CSS classes for the popover component. */
	popoverClassName?: string;
	/** Additional CSS classes for the popover trigger button. */
	popoverTriggerClassName?: string;
	/** Additional CSS classes for the popover content. */
	popoverContentClassName?: string;
}

/**
 * DateRangePicker allows users to select a date range using a calendar popover.
 * Supports timezones (local/UTC), min/max date constraints, and clearing the selection.
 *
 * @example
 * <DateRangePicker
 *   title="Billing Period"
 *   onChange={({ startDate, endDate }) => console.log(startDate, endDate)}
 * />
 */
const DateRangePicker = ({
	startDate,
	endDate,
	onChange,
	placeholder = 'Select Range',
	disabled,
	title,
	minDate,
	maxDate,
	className,
	labelClassName,
	popoverClassName,
	popoverTriggerClassName,
	popoverContentClassName,
}: DateRangePickerProps) => {
	const [open, setOpen] = useState(false);
	const [selectedRange, setSelectedRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined);
	const [timezone, setTimezone] = useState<CalendarTimezone>('local');

	const currentMonth = startOfMonth(new Date());

	const toRangeInZone = useCallback(
		(from: Date, to: Date) => {
			const fromValue = timezone === 'utc' ? startOfDayInZone(from.getFullYear(), from.getMonth(), from.getDate(), 'utc') : from;
			const toValue = timezone === 'utc' ? startOfDayInZone(to.getFullYear(), to.getMonth(), to.getDate(), 'utc') : to;
			return { from: fromValue, to: toValue };
		},
		[timezone],
	);

	const handleSelect = useCallback(
		(date: { from?: Date; to?: Date } | undefined) => {
			if (!date) return;
			if (date.from && date.to) {
				const range = toRangeInZone(date.from, date.to);
				setSelectedRange(range);
				onChange({ startDate: range.from, endDate: range.to });
			} else {
				setSelectedRange(date);
				onChange({ startDate: date.from, endDate: date.to });
			}
		},
		[onChange, toRangeInZone],
	);

	const handleTimezoneChange = useCallback(
		(newTz: CalendarTimezone) => {
			if (selectedRange?.from && selectedRange?.to) {
				const fromConverted = convertDateToTimezone(selectedRange.from, timezone as DateTimezone, newTz as DateTimezone);
				const toConverted = convertDateToTimezone(selectedRange.to, timezone as DateTimezone, newTz as DateTimezone);
				setSelectedRange({ from: fromConverted, to: toConverted });
				onChange({ startDate: fromConverted, endDate: toConverted });
			}
			setTimezone(newTz);
		},
		[selectedRange, timezone, onChange],
	);

	useEffect(() => {
		if (startDate || endDate) {
			setSelectedRange({ from: startDate, to: endDate });
		} else {
			setSelectedRange(undefined);
		}
	}, [startDate, endDate]);

	const displayRange =
		selectedRange?.from || selectedRange?.to
			? {
					from: selectedRange.from ? toCalendarDisplayDate(selectedRange.from, timezone as DateTimezone) : undefined,
					to: selectedRange.to ? toCalendarDisplayDate(selectedRange.to, timezone as DateTimezone) : undefined,
				}
			: undefined;

	const displayLabel =
		selectedRange?.from && selectedRange?.to
			? `${formatDateInZone(selectedRange.from, timezone as DateTimezone)} - ${formatDateInZone(selectedRange.to, timezone as DateTimezone)}`
			: selectedRange?.from
				? `${formatDateInZone(selectedRange.from, timezone as DateTimezone)} - Select end date`
				: placeholder;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<div className='flex flex-col'>
				{title && <div className={cn('text-sm font-medium mb-1 w-full text-start', labelClassName)}>{title}</div>}
				<div className='relative'>
					<PopoverTrigger asChild className={popoverTriggerClassName} disabled={disabled}>
						<Button
							variant='outline'
							disabled={disabled}
							className={cn(
								' justify-start text-left font-normal !h-10',
								!selectedRange?.from || !selectedRange?.to
									? 'text-muted-foreground opacity-70 hover:text-muted-foreground'
									: 'text-foreground',
								!className && (selectedRange?.from && selectedRange?.to ? 'w-[260px]' : 'w-[240px]'),
								'transition-all duration-300 ease-in-out',
								className,
							)}>
							<CalendarIcon className='mr-0 h-4 w-4' />
							<span>{displayLabel}</span>
						</Button>
					</PopoverTrigger>
					{selectedRange?.from && selectedRange?.to && (
						<button
							type='button'
							aria-label='Clear date range'
							className='absolute right-2 top-[12px] rounded-[4px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							onClick={(e) => {
								e.stopPropagation();
								setSelectedRange(undefined);
								onChange({ startDate: undefined, endDate: undefined });
							}}>
							<X className='h-4 w-4' />
						</button>
					)}
				</div>
			</div>

			<PopoverContent className={cn('w-auto flex gap-4 p-2', popoverClassName, popoverContentClassName)} align='start'>
				<Calendar
					disabled={disabled}
					mode='range'
					selected={displayRange}
					onSelect={handleSelect}
					fromDate={minDate}
					toDate={maxDate}
					defaultMonth={currentMonth}
					numberOfMonths={2}
					timezone={timezone}
					onTimezoneChange={handleTimezoneChange}
				/>
			</PopoverContent>
		</Popover>
	);
};

export default DateRangePicker;
