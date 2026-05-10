import { formatNumber } from '@/utils/common';
import { getCurrencySymbol } from '@/utils/common/helper_functions';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface MetricCardProps {
	/** The title or label of the metric. */
	title: string;
	/** The numeric value of the metric. */
	value: number;
	/** Optional currency code (e.g., 'USD') to format the value as currency. */
	currency?: string;
	/** Whether to format the value as a percentage. */
	isPercent?: boolean;
	/** Whether to show a trend indicator (arrow up/down). */
	showChangeIndicator?: boolean;
	/** Whether the trend is negative (red arrow down vs green arrow up). */
	isNegative?: boolean;
}

/**
 * MetricCard displays key performance indicators (KPIs) with an optional trend indicator.
 * Used on dashboards to show metrics like MRR, Active Subscriptions, etc.
 *
 * @example
 * <MetricCard title="MRR" value={12500} currency="USD" showChangeIndicator />
 * <MetricCard title="Churn Rate" value={2.5} isPercent isNegative showChangeIndicator />
 */
const MetricCard = ({ title, value, currency, isPercent = false, showChangeIndicator = false, isNegative = false }: MetricCardProps) => {
	const arrowColor = isNegative ? 'text-destructive' : 'text-emerald-600';

	const renderValue = () => {
		if (isPercent) {
			return `${formatNumber(value, 2)}%`;
		}
		if (currency) {
			return `${getCurrencySymbol(currency)} ${formatNumber(value, 2)}`;
		}
		return formatNumber(value, 2);
	};

	return (
		<div className='bg-card border border-border p-[25px] flex flex-col gap-3 rounded-md'>
			<p className='text-[14px] leading-[21px] text-muted-foreground font-normal'>{title}</p>
			<p className='text-[24px] leading-[28px] font-medium text-foreground flex items-center'>
				{renderValue()}
				{showChangeIndicator && (
					<span className={`inline-block ${arrowColor} ml-3`}>{isNegative ? <TrendingDown size={18} /> : <TrendingUp size={18} />}</span>
				)}
			</p>
		</div>
	);
};

export default MetricCard;
