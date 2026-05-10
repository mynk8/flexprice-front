import type { ReactNode } from 'react';
import Chip from '@/components/atoms/Chip';
import { CheckCircle2, FileText, XCircle, Clock, AlertCircle, RefreshCw, Ban } from 'lucide-react';

/**
 * The canonical set of invoice statuses used in FlexPrice.
 */
export type InvoiceStatus = 'paid' | 'draft' | 'void' | 'overdue' | 'pending' | 'finalized' | 'uncollectible';

interface StatusConfig {
	label: string;
	variant: 'success' | 'info' | 'failed' | 'warning' | 'default';
	icon: ReactNode;
}

const STATUS_CONFIG: Record<InvoiceStatus, StatusConfig> = {
	paid: {
		label: 'Paid',
		variant: 'success',
		icon: <CheckCircle2 size={14} />,
	},
	draft: {
		label: 'Draft',
		variant: 'info',
		icon: <FileText size={14} />,
	},
	finalized: {
		label: 'Finalized',
		variant: 'info',
		icon: <FileText size={14} />,
	},
	void: {
		label: 'Void',
		variant: 'default',
		icon: <Ban size={14} />,
	},
	overdue: {
		label: 'Overdue',
		variant: 'failed',
		icon: <AlertCircle size={14} />,
	},
	pending: {
		label: 'Pending',
		variant: 'warning',
		icon: <Clock size={14} />,
	},
	uncollectible: {
		label: 'Uncollectible',
		variant: 'failed',
		icon: <XCircle size={14} />,
	},
};

export interface InvoiceStatusBadgeProps {
	/** Invoice status string from the API */
	status: InvoiceStatus;
	/** Whether to show the leading icon */
	showIcon?: boolean;
	/** Additional CSS classes */
	className?: string;
}

/**
 * ## InvoiceStatusBadge
 *
 * Maps an invoice status string to a colour-coded Chip with an associated icon.
 * This is the canonical way to display invoice status throughout the FlexPrice UI.
 *
 * ### Status → Colour Mapping
 * - `paid` → green (success)
 * - `draft` / `finalized` → blue (info)
 * - `pending` → orange (warning)
 * - `overdue` / `uncollectible` → red (failed)
 * - `void` → gray (default)
 */
const InvoiceStatusBadge = ({ status, showIcon = true, className }: InvoiceStatusBadgeProps) => {
	const config = STATUS_CONFIG[status] ?? {
		label: status,
		variant: 'default' as const,
		icon: <RefreshCw size={14} />,
	};

	return <Chip label={config.label} variant={config.variant} icon={showIcon ? config.icon : undefined} className={className} />;
};

export default InvoiceStatusBadge;
