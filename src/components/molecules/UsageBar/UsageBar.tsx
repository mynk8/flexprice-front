import React from 'react';
import Progress from '@/components/atoms/Progress';

export interface UsageBarProps {
	featureName: string;
	used: number;
	limit: number;
	unit?: string;
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
	return 'text-gray-600';
};

const formatUsage = (value: number): string => {
	if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
	if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
	return value.toLocaleString();
};

const UsageBar: React.FC<UsageBarProps> = ({ featureName, used, limit, unit = '', showPercentage = false }) => {
	const percent = Math.min(100, Math.round((used / limit) * 100));
	const indicatorColor = getIndicatorColor(percent);
	const labelColor = getLabelColor(percent);
	const isAtLimit = percent >= 100;

	return (
		<div className='space-y-1.5'>
			<div className='flex justify-between items-baseline'>
				<span className='text-sm font-medium text-gray-700'>{featureName}</span>
				<span className={`text-xs font-medium ${labelColor}`}>
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
