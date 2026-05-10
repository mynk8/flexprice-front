import { Plus } from 'lucide-react';
import Chip from '@/components/atoms/Chip';
import { Button } from '@/components/atoms/Button';

export interface TierRow {
	id?: string;
	name: string;
	chargeType: 'Flat Rate' | 'Usage Based' | 'Graduated' | 'Package' | 'Volume';
	billingPeriod: string;
	billingTiming: string;
	status: 'active' | 'upcoming' | 'inactive';
	value: string;
}

const status = {
	active: { label: 'Active', variant: 'success' },
	upcoming: { label: 'Upcoming', variant: 'info' },
	inactive: { label: 'Inactive', variant: 'default' },
} as const;

const headers = ['Display Name', 'Charge Type', 'Billing Timing', 'Billing Period', 'Status', 'Value'] as const;

export interface PricingTierTableProps {
	/** Array of tier rows to display in the table. */
	tiers: TierRow[];
	/** Optional title for the table section. Defaults to 'Charges'. */
	title?: string;
	/** Callback function triggered when the 'Add Charge' button is clicked. */
	onAddCharge?: () => void;
}

const getTierKey = (tier: TierRow) => tier.id ?? `${tier.name}-${tier.chargeType}-${tier.billingPeriod}-${tier.value}`;

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
		<div className='border border-border rounded-[6px] overflow-hidden bg-card'>
			<div className='flex items-center justify-between px-4 py-3 border-b border-border bg-card'>
				<h3 className='font-medium text-[14px] text-foreground'>{title}</h3>
				{onAddCharge && (
					<Button onClick={onAddCharge} size='sm'>
						<Plus className='size-4' aria-hidden />
						<span>Add Charge</span>
					</Button>
				)}
			</div>

			<table className='w-full text-sm'>
				<thead className='bg-muted/40 border-b border-border'>
					<tr>
						{headers.map((h) => (
							<th key={h} className='px-4 py-3 text-left text-[13px] font-medium text-muted-foreground first:pl-5'>
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{tiers.length === 0 ? (
						<tr>
							<td colSpan={6} className='px-4 py-8 text-center text-sm text-muted-foreground'>
								No charges added yet. Click <strong>Add Charge</strong> to get started.
							</td>
						</tr>
					) : (
						tiers.map((tier) => {
							const state = status[tier.status];

							return (
								<tr key={getTierKey(tier)} className='border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors'>
									<td className='px-4 py-3 pl-5 font-medium text-foreground'>{tier.name}</td>
									<td className='px-4 py-3 text-muted-foreground'>{tier.chargeType}</td>
									<td className='px-4 py-3 text-muted-foreground'>{tier.billingTiming}</td>
									<td className='px-4 py-3 text-muted-foreground'>{tier.billingPeriod}</td>
									<td className='px-4 py-3'>
										<Chip label={state.label} variant={state.variant} />
									</td>
									<td className='px-4 py-3 font-medium text-foreground font-mono text-right pr-6'>{tier.value}</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
};

export default PricingTierTable;
