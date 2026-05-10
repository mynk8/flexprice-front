import { useEffect } from 'react';
import { create } from 'zustand';

/**
 * useFilterStore — A route-scoped filter persistence hook.
 * Stores filters in memory (Zustand) + sessionStorage (persistence)
 * and syncs a shallow fingerprint to the URL (bookmarkable).
 */

export type FilterValue = string | number | boolean | null | string[];
export type RouteFilters = Record<string, FilterValue>;

interface FilterStore {
	routes: Record<string, RouteFilters>;
	setFilter: (route: string, key: string, value: FilterValue) => void;
	resetFilters: (route: string) => void;
	hydrate: (route: string, initial: RouteFilters) => void;
}

export const useInternalFilterStore = create<FilterStore>((set) => ({
	routes: {},
	setFilter: (route, key, value) =>
		set((state) => {
			const routeFilters = { ...(state.routes[route] || {}) };
			if (value === null || value === '') {
				delete routeFilters[key];
			} else {
				routeFilters[key] = value;
			}
			return { routes: { ...state.routes, [route]: routeFilters } };
		}),
	resetFilters: (route) =>
		set((state) => ({
			routes: { ...state.routes, [route]: {} },
		})),
	hydrate: (route, initial) =>
		set((state) => ({
			routes: { ...state.routes, [route]: { ...initial, ...(state.routes[route] || {}) } },
		})),
}));

const EMPTY_FILTERS: RouteFilters = {};

export const useFilterStore = (routeKey: string) => {
	const filters = useInternalFilterStore((state) => state.routes[routeKey] || EMPTY_FILTERS);
	const { setFilter, resetFilters, hydrate } = useInternalFilterStore();

	const storageKey = `filters:${routeKey}`;
	const urlParam = `${routeKey}Fp`;

	// 1. Hydrate from sessionStorage on mount
	useEffect(() => {
		const saved = sessionStorage.getItem(storageKey);
		if (saved) {
			try {
				hydrate(routeKey, JSON.parse(saved));
			} catch (e) {
				console.error('Failed to parse filters', e);
			}
		}
	}, [routeKey, hydrate, storageKey]);

	// 2. Persist to sessionStorage and URL fingerprint on change
	useEffect(() => {
		if (Object.keys(filters).length > 0) {
			sessionStorage.setItem(storageKey, JSON.stringify(filters));

			// Simple stable hash function for the keys
			const hash = Object.keys(filters)
				.sort()
				.join(',')
				.split('')
				.reduce((a, b) => {
					a = (a << 5) - a + b.charCodeAt(0);
					return a & a;
				}, 0);
			const fingerprint = `${Object.keys(filters).length}-${Math.abs(hash).toString(36)}`;
			const url = new URL(window.location.href);
			url.searchParams.set(urlParam, fingerprint);
			window.history.replaceState(null, '', url.pathname + url.search + url.hash);
		} else {
			sessionStorage.removeItem(storageKey);
			const url = new URL(window.location.href);
			url.searchParams.delete(urlParam);
			window.history.replaceState(null, '', url.pathname + url.search + url.hash);
		}
	}, [filters, storageKey, urlParam]);

	return {
		filters,
		setFilter: (key: string, value: FilterValue) => setFilter(routeKey, key, value),
		resetFilters: () => resetFilters(routeKey),
		fingerprint: `${Object.keys(filters).length}`, // Exposed for UI if needed
		storageKey,
		urlParam,
	};
};

export default useFilterStore;
