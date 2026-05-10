import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createFilterFingerprint, getFilterFingerprintParam, getFilterStorageKey, syncFilterFingerprintToUrl } from './useFilterStore';

describe('useFilterStore helpers', () => {
	it('creates a stable fingerprint independent of filter key order', () => {
		const first = createFilterFingerprint({ status: 'active', search: 'acme' });
		const second = createFilterFingerprint({ search: 'acme', status: 'active' });

		expect(first).toBe(second);
	});

	it('changes the fingerprint when filters change', () => {
		const active = createFilterFingerprint({ status: 'active' });
		const inactive = createFilterFingerprint({ status: 'inactive' });

		expect(active).not.toBe(inactive);
	});

	it('uses route-scoped storage and compact URL param keys', () => {
		expect(getFilterStorageKey('billing/invoices')).toBe('filters:billing/invoices');
		expect(getFilterFingerprintParam('billing/invoices')).toBe('billinginvoicesFp');
	});
});

describe('useFilterStore URL sync', () => {
	let replaceStateSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		window.history.replaceState(null, '', '/customers?tab=active');
		replaceStateSpy = vi.spyOn(history, 'replaceState');
	});

	afterEach(() => {
		replaceStateSpy.mockRestore();
		vi.restoreAllMocks();
	});

	it('writes only the compact fingerprint and preserves unrelated URL params', () => {
		const filters = { search: 'acme', status: 'active' as const };

		syncFilterFingerprintToUrl('customers', filters);

		const url = new URL(window.location.href);
		expect(url.searchParams.get('tab')).toBe('active');
		expect(url.searchParams.get('customersFp')).toBe(createFilterFingerprint(filters));
		expect(url.searchParams.get('search')).toBeNull();
		expect(replaceStateSpy).toHaveBeenCalledTimes(1);
	});

	it('removes the route fingerprint when filters reset', () => {
		syncFilterFingerprintToUrl('customers', { status: 'active' });
		syncFilterFingerprintToUrl('customers', {});

		const url = new URL(window.location.href);
		expect(url.searchParams.get('tab')).toBe('active');
		expect(url.searchParams.get('customersFp')).toBeNull();
	});
});
