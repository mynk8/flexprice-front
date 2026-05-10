import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilterStore, useInternalFilterStore } from './useFilterStore';

describe('useFilterStore', () => {
	let replaceStateSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		// Reset Zustand store
		useInternalFilterStore.setState({ routes: {} });

		// Mock sessionStorage
		const storage: Record<string, string> = {};
		vi.stubGlobal('sessionStorage', {
			getItem: (key: string) => storage[key] || null,
			setItem: (key: string, value: string) => {
				storage[key] = value;
			},
			removeItem: (key: string) => {
				delete storage[key];
			},
			clear: () => {
				for (const key in storage) delete storage[key];
			},
		});

		window.history.replaceState(null, '', '/customers');
		replaceStateSpy = vi.spyOn(history, 'replaceState');
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it('initializes with empty filters', () => {
		const { result } = renderHook(() => useFilterStore('customers'));
		expect(result.current.filters).toEqual({});
	});

	it('updates filters and persists to sessionStorage', () => {
		const { result } = renderHook(() => useFilterStore('customers'));

		act(() => {
			result.current.setFilter('search', 'acme');
		});

		expect(result.current.filters).toEqual({ search: 'acme' });
		expect(sessionStorage.getItem('filters:customers')).toContain('"search":"acme"');
	});

	it('syncs a compact fingerprint to the URL', () => {
		const { result } = renderHook(() => useFilterStore('customers'));

		act(() => {
			result.current.setFilter('search', 'acme');
			result.current.setFilter('status', 'active');
		});

		const url = new URL(window.location.href);
		const fp = url.searchParams.get('customersFp');
		expect(fp).toBeDefined();
		expect(fp?.startsWith('2-')).toBe(true); // 2 filters
		expect(replaceStateSpy).toHaveBeenCalled();
	});

	it('removes filters and storage when set to null/empty', () => {
		const { result } = renderHook(() => useFilterStore('customers'));

		act(() => {
			result.current.setFilter('search', 'acme');
		});
		expect(sessionStorage.getItem('filters:customers')).toBeDefined();

		act(() => {
			result.current.setFilter('search', null);
		});

		expect(result.current.filters).toEqual({});
		expect(sessionStorage.getItem('filters:customers')).toBeNull();
		const url = new URL(window.location.href);
		expect(url.searchParams.get('customersFp')).toBeNull();
	});

	it('resets all filters for a route', () => {
		const { result } = renderHook(() => useFilterStore('customers'));

		act(() => {
			result.current.setFilter('search', 'acme');
			result.current.setFilter('status', 'active');
			result.current.resetFilters();
		});

		expect(result.current.filters).toEqual({});
		expect(sessionStorage.getItem('filters:customers')).toBeNull();
	});
});
