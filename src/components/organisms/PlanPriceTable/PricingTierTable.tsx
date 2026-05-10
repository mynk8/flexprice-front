import { Plus } from 'lucide-react';
import Chip from '@/components/atoms/Chip';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader } from '@/components/atoms';
import { DataTable, ColumnData } from '@/components/molecules';

export interface TierRow {
	id?: string;
	name: string;
	chargeType: 'Flat Rate' | 'Usage Based' | 'Graduated' | 'Package' | 'Volume';
	billingPeriod: string;
	billingTiming: string;
	status: 'active' | 'upcoming' | 'inactive';
	value: string;
}

const statusMap = {
	active: { label: 'Active', variant: 'success' },
	upcoming: { label: 'Upcoming', variant: 'info' },
	inactive: { label: 'Inactive', variant: 'default' },
} as const;

export interface PricingTierTableProps {
	/** Array of tier rows to display in the table. */
	tiers: TierRow[];
	/** Optional title for the table section. Defaults to 'Charges'. */
	title?: string;
	/** Callback function triggered when the 'Add Charge' button is clicked. */
	onAddCharge?: () => void;
}

const columns: ColumnData<TierRow>[] = [
	{
		title: 'Display Name',
		render: (row) => <span className='font-medium text-foreground'>{row.name}</span>,
	},
	{
		title: 'Charge Type',
		render: (row) => <span>{row.chargeType}</span>,
	},
	{
		title: 'Billing Timing',
		render: (row) => <span>{row.billingTiming}</span>,
	},
	{
		title: 'Billing Period',
		render: (row) => <span>{row.billingPeriod}</span>,
	},
	{
		title: 'Status',
		render: (row) => {
			const state = statusMap[row.status];
			return <Chip label={state.label} variant={state.variant} />;
		},
	},
	{
		title: 'Value',
		align: 'right',
		render: (row) => <span className='font-medium text-foreground font-mono'>{row.value}</span>,
	},
];

/**
 * PricingTierTable displays the different pricing tiers or charges for a plan.
 * Used in plan details and creation flows to show flat rates, usage fees, and billing cycles.
 *
 * @example
 * <PricingTierTable
 *   tiers={[
 *     { name: 'Base Fee', chargeType: 'Flat Rate', billingPeriod: 'Monthly', status: 'active', value: '$50.00' }
 *   ]}
 *   onAddCharge={() => openDrawer()}
 * />
 */
const PricingTierTable = ({ tiers, title = 'Charges', onAddCharge }: PricingTierTableProps) => {
	return (
		<Card variant='notched'>
			<CardHeader
				title={title}
				cta={
					onAddCharge ? (
						<Button prefixIcon={<Plus />} onClick={onAddCharge}>
							Add
						</Button>
					) : undefined
				}
			/>
			<div className='mt-4'>
				<DataTable columns={columns} data={tiers} showEmptyRow />
			</div>
		</Card>
	);
};

export default PricingTierTable;
