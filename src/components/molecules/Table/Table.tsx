import * as React from 'react';
import { useRef, type ReactNode } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ColumnAlign, ColumnData, DataTableProps, SortDirection } from '@/types/common/Table';

export type { ColumnData, DataTableProps, TablePaginationConfig, TableSortState, TableVirtualizationConfig } from '@/types/common/Table';

const isInteractiveElement = (element: HTMLElement | null): boolean => {
	if (!element) return false;

	if (element.getAttribute('data-interactive') === 'true') return true;

	const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];
	if (element.tagName && interactiveElements.includes(element.tagName.toLowerCase())) return true;

	return element.closest('[data-interactive="true"]') !== null;
};

const textAlign: Record<ColumnAlign, string> = {
	left: 'text-left',
	center: 'text-center',
	right: 'text-right',
	justify: 'text-justify',
};

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
	wrapperRef?: React.Ref<HTMLDivElement>;
	wrapperClassName?: string;
	wrapperStyle?: React.CSSProperties;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ className, wrapperRef, wrapperClassName, wrapperStyle, ...props }, ref) => (
	<div ref={wrapperRef} className={cn('relative w-full overflow-auto', wrapperClassName)} style={wrapperStyle}>
		<table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
	</div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />,
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />,
);
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
	<tr
		ref={ref}
		className={cn('border-b border-border h-[36px] transition-colors hover:bg-muted/50', 'align-middle', className)}
		{...props}
	/>
));
TableRow.displayName = 'TableRow';

interface CustomThHTMLAttributes extends React.ThHTMLAttributes<HTMLTableCellElement> {
	width?: number | string;
}

const TableHead = React.forwardRef<
	HTMLTableCellElement,
	Omit<CustomThHTMLAttributes, 'align'> & { align?: 'left' | 'center' | 'right' | 'justify'; variant?: 'default' | 'no-bordered' }
>(({ className, style, align = 'left', width, variant = 'default', ...props }, ref) => (
	<th
		ref={ref}
		style={{ textAlign: align, width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined, ...style }}
		className={cn(
			'h-12 px-4 text-[14px] font-medium text-muted-foreground',
			textAlign[align],
			'align-middle',
			className,
			variant === 'default' && 'border-b border-border',
		)}
		{...props}
	/>
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
	HTMLTableCellElement,
	Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'> & { align?: 'left' | 'center' | 'right' | 'justify' }
>(({ className, style, align = 'left', width, ...props }, ref) => (
	<td
		ref={ref}
		style={{ textAlign: align, width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined, ...style }}
		className={cn('px-4 py-2 !max-h-9 text-[14px] font-medium', textAlign[align], 'align-middle', className)}
		{...props}
	/>
));
TableCell.displayName = 'TableCell';

const getColumnKey = <T,>(column: ColumnData<T>, index: number): React.Key => {
	if ('fieldName' in column && column.fieldName) return column.fieldName;
	if (typeof column.title === 'string') return column.title;
	return `column-${index}`;
};

const getColumnSortKey = <T,>(column: ColumnData<T>, index: number): string => {
	if (column.sortKey) return column.sortKey;
	if ('fieldName' in column && column.fieldName) return column.fieldName;
	return String(getColumnKey(column, index));
};

const CellContent = <T,>({
	row,
	column,
	colIndex,
	onCellClick,
}: {
	row: T;
	column: ColumnData<T>;
	colIndex: number;
	onCellClick?: (row: T, e: React.MouseEvent) => void;
}) => {
	const { fieldName: name, render, suffixIcon, fieldVariant = 'default' } = column;

	const contentWrapperClasses = cn(
		onCellClick && 'cursor-pointer',
		fieldVariant === 'link' && 'cursor-pointer hover:underline',
		colIndex === 0 && '!pl-2',
	);

	if (render) {
		return (
			<div data-interactive={fieldVariant === 'interactive'} className={contentWrapperClasses}>
				{render(row)}
				{suffixIcon && suffixIcon}
			</div>
		);
	}

	const value = name ? row[name] : null;
	return <div className={contentWrapperClasses}>{value as ReactNode}</div>;
};

/**
 * DataTable is a powerful, customizable data table component.
 * Supports virtualization, sorting, pagination, loading states, and custom cell rendering.
 * Built with @tanstack/react-virtual for high-performance rendering of large datasets.
 *
 * @template T - The data type of each row.
 *
 * @example
 * <DataTable
 *   data={customers}
 *   columns={[
 *     { fieldName: 'name', title: 'Name' },
 *     { fieldName: 'email', title: 'Email' },
 *     { title: 'Actions', render: (row) => <button>Edit</button> }
 *   ]}
 *   pagination={{ page: 1, pageSize: 10, totalItems: 100, onPageChange: (p) => setPage(p) }}
 * />
 */
const DataTable = <T,>({
	onRowClick,
	columns,
	data,
	showEmptyRow,
	hideBottomBorder = true,
	variant = 'default',
	tableClassName,
	virtualization,
	isLoading = false,
	loadingRowCount = 5,
	sort,
	pagination,
}: DataTableProps<T>) => {
	const parentRef = useRef<HTMLDivElement>(null);
	const virtualizationThreshold = virtualization?.threshold ?? 100;

	const shouldVirtualize = Boolean(
		!isLoading &&
		virtualization &&
		virtualization.enabled !== false &&
		(virtualization.enabled === true || data.length >= virtualizationThreshold),
	);

	const virtualizer = useVirtualizer({
		count: shouldVirtualize ? data.length : 0,
		getScrollElement: () => parentRef.current,
		estimateSize: () => virtualization?.estimateRowHeight ?? 44,
		overscan: virtualization?.overscan || 10,
		measureElement: virtualization?.enableAutoHeight ? (element) => element?.getBoundingClientRect().height : undefined,
	});

	const handleRowClick = (row: T, e: React.MouseEvent) => {
		const target = e.target as HTMLElement;

		if (isInteractiveElement(target)) {
			return;
		}

		onRowClick?.(row);
	};

	const handleCellClick = (e: React.MouseEvent, row: T, onCellClick?: (row: T, e: React.MouseEvent) => void) => {
		const target = e.target as HTMLElement;

		if (isInteractiveElement(target)) {
			return;
		}

		if (onCellClick) {
			e.stopPropagation();
			onCellClick(row, e);
		}
	};

	const handleSortChange = (column: ColumnData<T>, index: number) => {
		if (!column.sortable || !sort?.onSortChange) return;

		const sortKey = getColumnSortKey(column, index);
		const nextDirection: SortDirection = sort.key === sortKey && sort.direction === 'asc' ? 'desc' : 'asc';
		sort.onSortChange(sortKey, nextDirection);
	};

	const renderSortIcon = (sortKey: string) => {
		if (sort?.key !== sortKey) return <ArrowUpDown className='size-3.5 text-muted-foreground' />;
		if (sort.direction === 'asc') return <ArrowUp className='size-3.5 text-foreground' />;
		return <ArrowDown className='size-3.5 text-foreground' />;
	};

	const renderTableHeader = () => (
		<TableHeader
			className={cn(
				variant === 'default' ? 'h-8 bg-muted border-b border-border rounded-t-[6px]' : 'h-8',
				variant === 'no-bordered' && 'bg-transparent',
				shouldVirtualize && 'sticky top-0 z-10 bg-muted/95 shadow-sm',
			)}>
			<TableRow
				className={cn(variant === 'default' ? 'rounded-t-[6px] border-b border-border' : '', variant === 'no-bordered' && 'border-b-0')}>
				{columns.map((column, index) => {
					const { title, flex = 1, width, color, align = 'left', className, children } = column;
					const content = children ? children : title;
					const sortKey = getColumnSortKey(column, index);

					return (
						<TableHead
							variant={variant}
							key={getColumnKey(column, index)}
							aria-sort={column.sortable && sort?.key === sortKey ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
							style={{ flex: width ? undefined : flex, color }}
							width={width}
							align={align}
							className={cn(
								!color && 'text-muted-foreground',
								'font-sans font-medium px-3',
								variant === 'default' && index === 0 ? 'rounded-tl-[6px]' : '',
								variant === 'default' && index === columns.length - 1 ? 'rounded-tr-[6px]' : '',
								variant === 'no-bordered' && 'border-b-0',
								className,
							)}>
							{column.sortable ? (
								<button
									type='button'
									className={cn('inline-flex items-center gap-1.5 text-left', index === 0 && 'pl-2')}
									onClick={() => handleSortChange(column, index)}>
									<span>{content}</span>
									{renderSortIcon(sortKey)}
								</button>
							) : (
								<span className={cn(index === 0 && 'pl-2')}>{content}</span>
							)}
						</TableHead>
					);
				})}
			</TableRow>
		</TableHeader>
	);

	const renderTableRow = (row: T, rowIndex: number, measureRef?: (node: Element | null) => void) => {
		const lastRow = rowIndex === data.length - 1;
		const rowKey = virtualization?.getRowKey ? virtualization.getRowKey(row, rowIndex) : rowIndex;

		return (
			<TableRow
				ref={measureRef}
				onClick={(e) => handleRowClick(row, e)}
				className={cn(
					'transition-colors hover:bg-muted/50',
					variant === 'default' && !lastRow && 'border-b border-border',
					onRowClick && 'cursor-pointer hover:bg-muted/50',
					lastRow && hideBottomBorder && 'border-b-0',
					'!py-1',
				)}
				key={rowKey}>
				{columns.map((column, colIndex) => {
					const { flex = 1, width, textColor = 'inherit', align = 'left', onCellClick, fieldVariant = 'default' } = column;

					return (
						<TableCell
							onClick={(e) => handleCellClick(e, row, onCellClick)}
							key={getColumnKey(column, colIndex)}
							data-interactive={fieldVariant === 'interactive'}
							className={cn(
								textColor ? '' : 'text-muted-foreground',
								variant === 'default' ? 'font-normal' : 'font-light',
								'!max-h-8 px-3 py-3 text-[14px]',
								onCellClick && 'cursor-pointer hover:bg-muted/50',
								fieldVariant === 'title' ? 'font-regular text-foreground' : '!font-light text-muted-foreground',
								fieldVariant === 'link' && 'cursor-pointer text-primary hover:underline',
								fieldVariant === 'icon' && 'w-10',
								fieldVariant === 'interactive' && 'cursor-default',
							)}
							style={{ flex: width ? undefined : flex, color: textColor !== 'inherit' ? textColor : undefined }}
							width={width}
							align={align}>
							<CellContent row={row} column={column} colIndex={colIndex} onCellClick={onCellClick} />
						</TableCell>
					);
				})}
			</TableRow>
		);
	};

	const renderEmptyRow = () => {
		if (!showEmptyRow || data.length > 0) return null;

		return (
			<TableRow className={cn(hideBottomBorder && 'border-b-0', variant === 'no-bordered' && 'border-b-0')}>
				{columns.map(({ flex = 1, width, textColor = 'inherit', align = 'left', hideOnEmpty }, colIndex) => {
					const lastRow = colIndex === columns.length - 1;
					return (
						<TableCell
							key={getColumnKey(columns[colIndex], colIndex)}
							className={cn(
								textColor ? '' : 'text-foreground w-full ',
								'font-normal',
								'!max-h-8 px-4 py-2 text-[14px]',
								lastRow ? 'text-center' : '',
							)}
							style={{ flex: width ? undefined : flex, color: textColor !== 'inherit' ? textColor : undefined }}
							width={width}
							align={align}>
							{lastRow && hideOnEmpty ? '' : '--'}
						</TableCell>
					);
				})}
			</TableRow>
		);
	};

	const renderLoadingRows = () =>
		Array.from({ length: loadingRowCount }, (_, rowIndex) => (
			<TableRow key={`loading-${rowIndex}`} className={cn(hideBottomBorder && rowIndex === loadingRowCount - 1 && 'border-b-0')}>
				{columns.map((column, colIndex) => (
					<TableCell key={getColumnKey(column, colIndex)} className='px-3 py-3'>
						<div className='h-4 w-full max-w-[180px] animate-pulse rounded bg-muted' />
					</TableCell>
				))}
			</TableRow>
		));

	const renderBodyContent = () => {
		if (isLoading) return renderLoadingRows();
		if (data.length === 0) return renderEmptyRow();

		if (shouldVirtualize) {
			const virtualItems = virtualizer.getVirtualItems();
			if (virtualItems.length === 0) return null;

			const paddingTop = virtualItems[0].start;
			const paddingBottom = virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end;

			return (
				<>
					{paddingTop > 0 && (
						<tr>
							<td style={{ height: `${paddingTop}px` }} colSpan={columns.length} />
						</tr>
					)}
					{virtualItems.map((virtualRow) => renderTableRow(data[virtualRow.index], virtualRow.index, virtualizer.measureElement))}
					{paddingBottom > 0 && (
						<tr>
							<td style={{ height: `${paddingBottom}px` }} colSpan={columns.length} />
						</tr>
					)}
				</>
			);
		}

		return data.map((row, rowIndex) => renderTableRow(row, rowIndex));
	};

	const renderPagination = () => {
		if (!pagination) return null;

		const { page, pageSize, totalItems, onPageChange, unit = 'items', showPageInfo = true } = pagination;
		const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
		const clampedPage = Math.min(Math.max(page, 1), totalPages);
		const startItem = totalItems === 0 ? 0 : (clampedPage - 1) * pageSize + 1;
		const endItem = Math.min(clampedPage * pageSize, totalItems);

		return (
			<div className='flex items-center justify-between border-t border-border px-3 py-3 text-sm text-muted-foreground'>
				<div>
					Showing <span className='font-medium text-foreground'>{startItem}</span> to{' '}
					<span className='font-medium text-foreground'>{endItem}</span> of{' '}
					<span className='font-medium text-foreground'>{totalItems}</span> {unit}
				</div>
				<div className='flex items-center gap-2'>
					{showPageInfo && (
						<span>
							Page {clampedPage} of {totalPages}
						</span>
					)}
					<button
						type='button'
						className='inline-flex size-8 items-center justify-center rounded-md border border-input bg-background disabled:cursor-not-allowed disabled:opacity-50'
						disabled={clampedPage <= 1}
						onClick={() => onPageChange(clampedPage - 1)}
						aria-label='Previous page'>
						<ChevronLeft className='size-4' />
					</button>
					<button
						type='button'
						className='inline-flex size-8 items-center justify-center rounded-md border border-input bg-background disabled:cursor-not-allowed disabled:opacity-50'
						disabled={clampedPage >= totalPages}
						onClick={() => onPageChange(clampedPage + 1)}
						aria-label='Next page'>
						<ChevronRight className='size-4' />
					</button>
				</div>
			</div>
		);
	};

	return (
		<div
			className={cn(
				'overflow-hidden',
				variant === 'default' && 'rounded-[6px] border border-border',
				variant === 'default' && !hideBottomBorder && 'border-b border-border',
				variant === 'no-bordered' && 'border-0',
			)}>
			<Table
				wrapperRef={parentRef}
				className={tableClassName}
				wrapperStyle={shouldVirtualize && virtualization?.height ? { maxHeight: virtualization.height } : undefined}>
				{renderTableHeader()}
				<TableBody>{renderBodyContent()}</TableBody>
			</Table>
			{renderPagination()}
		</div>
	);
};

export default DataTable;
export { DataTable, Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
