import { FC } from 'react';
import { SubscriptionUsage } from '@/models/Subscription';
import { ColumnData, DataTable } from '@/components/molecules';
import { FormHeader } from '@/components/atoms';

export interface UsageTableProps {
	data: SubscriptionUsage;
}

interface UsageRow {
	name: string;
	quantity: number;
	amount: string;
}

const UsageTable: FC<UsageTableProps> = ({ data }) => {
	const mappedData: UsageRow[] = (data?.charges ?? []).map((usage) => ({
		name: usage.meter_display_name,
		quantity: usage.quantity,
		amount: usage.display_amount,
	}));

	const columns: ColumnData<UsageRow>[] = [
		{
			fieldName: 'name',
			title: 'Feature Name',
		},
		{
			fieldName: 'quantity',
			title: 'Quantity',
		},
		{
			fieldName: 'amount',
			title: 'Amount',
		},
	];

	return (
		<div className='rounded-[6px] border border-gray-300  mt-2 p-4'>
			<FormHeader title='Current Meter Usage' variant='sub-header' />
			<div className='rounded-[6px] border border-gray-300  mt-2 '>
				<DataTable columns={columns} data={mappedData} />
			</div>
		</div>
	);
};

export default UsageTable;
