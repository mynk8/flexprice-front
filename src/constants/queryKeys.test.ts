import { describe, expect, it } from 'vitest';
import { QUERY_KEYS } from '@/constants/queryKeys';

describe('QUERY_KEYS factory', () => {
	it('environments has no nested keys', () => {
		const key = QUERY_KEYS.environments.all();
		expect(key).toEqual(['environments']);
	});

	it('customers forms a hierarchy from all to list and detail', () => {
		const all = QUERY_KEYS.customers.all();
		const list = QUERY_KEYS.customers.list({ status: 'active' }, 2);
		const detail = QUERY_KEYS.customers.detail('cust_abc');

		expect(list.slice(0, all.length)).toEqual(all);
		expect(detail.slice(0, all.length)).toEqual(all);
		expect(list).not.toEqual(detail);
	});

	it('subscriptions detail is a prefix of entitlements and usage', () => {
		const detail = QUERY_KEYS.subscriptions.detail('sub_123');
		const entitlements = QUERY_KEYS.subscriptions.entitlements('sub_123');
		const usage = QUERY_KEYS.subscriptions.usage('sub_123');

		expect(entitlements.slice(0, detail.length)).toEqual(detail);
		expect(usage.slice(0, detail.length)).toEqual(detail);
	});

	it('list keys omit filters/page params when not provided', () => {
		const minimal = QUERY_KEYS.invoices.list();
		const withFilters = QUERY_KEYS.invoices.list({ status: 'DRAFT' });

		expect(minimal).toEqual(['invoices', 'list']);
		expect(withFilters).toEqual(['invoices', 'list', { status: 'DRAFT' }]);
	});

	it('metrics keys are orgId-scoped and derive from the dashboard key', () => {
		const dashboard = QUERY_KEYS.metrics.dashboard('org_xyz');
		const mrr = QUERY_KEYS.metrics.mrr('org_xyz');
		const usage = QUERY_KEYS.metrics.usage('org_xyz', '30d');

		expect(mrr.slice(0, dashboard.length)).toEqual(dashboard);
		expect(usage.slice(0, dashboard.length)).toEqual(dashboard);
	});
});
