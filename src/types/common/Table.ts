import type { Key, MouseEvent, ReactNode } from 'react';

export type ColumnAlign = 'left' | 'center' | 'right' | 'justify';
export type ColumnVariant = 'default' | 'title' | 'link' | 'icon' | 'interactive' | (string & {});
export type SortDirection = 'asc' | 'desc';

interface BaseColumnData<T> {
	title?: ReactNode;
	flex?: number;
	width?: number | string;
	color?: string;
	textColor?: string;
	suffixIcon?: ReactNode;
	align?: ColumnAlign;
	className?: string;
	fieldVariant?: ColumnVariant;
	hideOnEmpty?: boolean;
	onCellClick?: (row: T, e: MouseEvent) => void;
	children?: ReactNode;
	sortable?: boolean;
	sortKey?: string;
}

export type FieldNameColumn<T> = BaseColumnData<T> & {
	// Extract<string> narrows from keyof T to only string-keyed fields,
	// preventing numeric index signatures from leaking in.
	fieldName: Extract<keyof T, string>;
	render?: never;
};

export type RenderColumn<T> = BaseColumnData<T> & {
	fieldName?: never;
	render: (rowData: Readonly<T>) => ReactNode;
};

export type ColumnData<T = unknown> = FieldNameColumn<T> | RenderColumn<T>;

export interface TableVirtualizationConfig<T> {
	enabled?: boolean;
	threshold?: number;
	height?: number | string;
	estimateRowHeight?: number;
	overscan?: number;
	getRowKey?: (row: T, index: number) => Key;
	/** Enables automatic row height measurement after render. Use when row heights vary (e.g. multi-line content). */
	enableAutoHeight?: boolean;
}

export interface TableSortState {
	key?: string;
	direction?: SortDirection;
	onSortChange?: (key: string, direction: SortDirection) => void;
}

export interface TablePaginationConfig {
	page: number;
	pageSize: number;
	totalItems: number;
	onPageChange: (page: number) => void;
	unit?: string;
	showPageInfo?: boolean;
}

export interface DataTableProps<T> {
	columns: ColumnData<T>[];
	data: T[];
	onRowClick?: (row: T) => void;
	showEmptyRow?: boolean;
	hideBottomBorder?: boolean;
	variant?: 'default' | 'no-bordered';
	/** Applied to the inner `<table>`, for example `table-fixed`. */
	tableClassName?: string;
	virtualization?: TableVirtualizationConfig<T>;
	isLoading?: boolean;
	loadingRowCount?: number;
	sort?: TableSortState;
	pagination?: TablePaginationConfig;
}
