import Progress from '@/components/atoms/Progress';
import { cn } from '@/lib/utils';

export interface UsageBarProps {
	/** The name of the feature or metric being metered. */
	featureName: string;
	/** Current usage count. */
	used: number;
	/** Maximum entitlement or limit for this feature. */
	limit: number;
	/** Unit name for the metric (e.g., 'API calls', 'seats'). */
	unit?: string;
	/** Whether to display the percentage value in the label. */
	showPercentage?: boolean;
}

const getIndicatorColor = (percent: number): string => {
	if (percent >= 95) return 'bg-red-500';
	if (percent >= 80) return 'bg-orange-500';
	if (percent >= 60) return 'bg-yellow-500';
	return 'bg-green-500';
};

const getLabelColor = (percent: number): string => {
	if (percent >= 95) return 'text-red-600';
	if (percent >= 80) return 'text-orange-600';
	return 'text-muted-foreground';
};

const formatUsage = (value: number): string => {
	if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
	if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
	return value.toLocaleString();
};

/**
 * UsageBar displays metered consumption against a limit using a progress bar.
 * Colors change from green to red as usage approaches or exceeds the limit.
 *
 * @example
 * <UsageBar
 *   featureName="API Requests"
 *   used={8500}
 *   limit={10000}
 *   unit="requests"
 *   showPercentage
 * />
 */
const UsageBar = ({ featureName, used, limit, unit = '', showPercentage = false }: UsageBarProps) => {
	const percent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
	const indicatorColor = getIndicatorColor(percent);
	const labelColor = getLabelColor(percent);
	const isAtLimit = percent >= 100;

	return (
		<div className='space-y-1.5'>
			<div className='flex justify-between items-baseline'>
				<span className='text-sm font-medium text-foreground'>{featureName}</span>
				<span className={cn('text-xs font-medium', labelColor)}>
					{formatUsage(used)}
					{unit && ` ${unit}`} / {formatUsage(limit)}
					{unit && ` ${unit}`}
					{showPercentage && ` (${percent}%)`}
				</span>
			</div>
			<Progress
				value={percent}
				indicatorColor={indicatorColor}
				label={isAtLimit ? 'Limit reached — overage charges may apply' : undefined}
				labelColor={isAtLimit ? 'text-red-500 text-right text-xs' : undefined}
			/>
		</div>
	);
};

export default UsageBar;
