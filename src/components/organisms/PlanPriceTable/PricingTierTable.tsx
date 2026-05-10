import React from 'react';
import Chip from '@/components/atoms/Chip';

export interface TierRow {
	name: string;
	chargeType: 'Flat Rate' | 'Usage Based' | 'Graduated' | 'Package' | 'Volume';
	billingPeriod: string;
	billingTiming: string;
	status: 'active' | 'upcoming' | 'inactive';
	value: string;
}

const statusVariantMap = {
	active: 'success' as const,
	upcoming: 'info' as const,
	inactive: 'default' as const,
};

export interface PricingTierTableProps {
	tiers: TierRow[];
	title?: string;
	onAddCharge?: () => void;
}

const PricingTierTable: React.FC<PricingTierTableProps> = ({ tiers, title = 'Charges', onAddCharge }) => {
	return (
		<div className='border border-[#E2E8F0] rounded-[6px] overflow-hidden'>
			<div className='flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] bg-white'>
				<h3 className='font-medium text-[14px] text-gray-900'>{title}</h3>
				{onAddCharge && (
					<button
						onClick={onAddCharge}
						className='inline-flex items-center gap-1 px-3 py-1.5 bg-[#092E44] text-white text-xs font-medium rounded-[6px] hover:opacity-90 transition-opacity'>
						<span>+</span>
						<span>Add Charge</span>
					</button>
				)}
			</div>

			<table className='w-full text-sm'>
				<thead className='bg-gray-50 border-b border-[#E2E8F0]'>
					<tr>
						{['Display Name', 'Charge Type', 'Billing Timing', 'Billing Period', 'Status', 'Value'].map((h) => (
							<th key={h} className='px-4 py-3 text-left text-[13px] font-medium text-[#64748B] first:pl-5'>
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{tiers.length === 0 ? (
						<tr>
							<td colSpan={6} className='px-4 py-8 text-center text-sm text-gray-400'>
								No charges added yet. Click <strong>Add Charge</strong> to get started.
							</td>
						</tr>
					) : (
						tiers.map((tier, i) => (
							<tr key={i} className='border-b border-[#E2E8F0] last:border-b-0 hover:bg-gray-50/50 transition-colors'>
								<td className='px-4 py-3 pl-5 font-medium text-gray-800'>{tier.name}</td>
								<td className='px-4 py-3 text-gray-600'>{tier.chargeType}</td>
								<td className='px-4 py-3 text-gray-600'>{tier.billingTiming}</td>
								<td className='px-4 py-3 text-gray-600'>{tier.billingPeriod}</td>
								<td className='px-4 py-3'>
									<Chip label={tier.status.charAt(0).toUpperCase() + tier.status.slice(1)} variant={statusVariantMap[tier.status]} />
								</td>
								<td className='px-4 py-3 font-medium text-gray-800 font-mono text-right pr-6'>{tier.value}</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};

export default PricingTierTable;
