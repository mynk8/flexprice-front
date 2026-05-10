import { useEffect, useMemo } from 'react';
import { create } from 'zustand';

export type PersistedFilterValue = string | number | boolean | null | string[] | number[] | Record<string, unknown>;
export type RouteFilterState = Readonly<Record<string, PersistedFilterValue>>;

interface FilterStoreState {
	filtersByRoute: Record<string, RouteFilterState>;
	hydrateRoute: (routeKey: string) => void;
	syncFromUrl: (routeKey: string) => void;
	setFilter: (routeKey: string, key: string, value: PersistedFilterValue) => void;
	resetFilters: (routeKey: string) => void;
	getFilters: (routeKey: string) => RouteFilterState;
}

const EMPTY_FILTERS: Record<string, PersistedFilterValue> = Object.freeze({});
const debounceTimers: Record<string, ReturnType<typeof setTimeout>> = {};

const canUseBrowserStorage = () => typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

export const getFilterStorageKey = (routeKey: string) => `filters:${routeKey}`;
export const getFilterFingerprintParam = (routeKey: string) => `${routeKey.replace(/[^a-zA-Z0-9]/g, '') || 'filters'}Fp`;

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
	value !== null && typeof value === 'object' && !Array.isArray(value);

const isFilterValue = (value: unknown): value is PersistedFilterValue => {
	if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return true;
	if (Array.isArray(value)) return value.every((item) => typeof item === 'string' || typeof item === 'number');
	return isPlainRecord(value);
};

const toFilterState = (value: unknown): RouteFilterState => {
	if (!isPlainRecord(value)) return EMPTY_FILTERS;
	return Object.entries(value).reduce(
		(filters, [key, filterValue]) => {
			if (isFilterValue(filterValue)) filters[key] = filterValue;
			return filters;
		},
		{} as Record<string, PersistedFilterValue>,
	);
};

const stableStringify = (value: unknown): string => {
	if (value === null || typeof value !== 'object') return JSON.stringify(value);
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
	const record = value as Record<string, unknown>;
	return `{${Object.keys(record)
		.sort()
		.map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
		.join(',')}}`;
};

export const createFilterFingerprint = (filters: RouteFilterState) => {
	const serialized = stableStringify(filters);
	let hash = 5381;
	for (let i = 0; i < serialized.length; i += 1) {
		hash = (hash * 33) ^ serialized.charCodeAt(i);
	}
	return `${Object.keys(filters).length}-${(hash >>> 0).toString(36)}`;
};

export const readFingerprintFromUrl = (routeKey: string): string | null => {
	if (typeof window === 'undefined') return null;
	try {
		return new URL(window.location.href).searchParams.get(getFilterFingerprintParam(routeKey)) ?? null;
	} catch {
		return null;
	}
};

const readFromSession = (routeKey: string): RouteFilterState => {
	if (!canUseBrowserStorage()) return EMPTY_FILTERS;
	try {
		const stored = window.sessionStorage.getItem(getFilterStorageKey(routeKey));
		if (!stored) return EMPTY_FILTERS;
		return toFilterState(JSON.parse(stored));
	} catch {
		return EMPTY_FILTERS;
	}
};

const writeToSession = (routeKey: string, filters: RouteFilterState) => {
	if (!canUseBrowserStorage()) return;
	try {
		window.sessionStorage.setItem(getFilterStorageKey(routeKey), JSON.stringify(filters));
	} catch {
		// Keep the in-memory store authoritative when storage is unavailable.
	}
};

const buildNext = (current: RouteFilterState, key: string, value: PersistedFilterValue): RouteFilterState => {
	const next = { ...current };
	if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
		delete next[key];
		return next;
	}
	next[key] = value;
	return next;
};

export const syncFilterFingerprintToUrl = (routeKey: string, filters: RouteFilterState) => {
	if (typeof window === 'undefined') return;
	const url = new URL(window.location.href);
	if (Object.keys(filters).length > 0) {
		url.searchParams.set(getFilterFingerprintParam(routeKey), createFilterFingerprint(filters));
	} else {
		url.searchParams.delete(getFilterFingerprintParam(routeKey));
	}
	const next = `${url.pathname}${url.search}${url.hash}`;
	const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
	if (next !== current) window.history.replaceState(window.history.state, '', next);
};

const debouncedSyncToUrl = (routeKey: string, filters: RouteFilterState, delayMs = 250) => {
	if (debounceTimers[routeKey]) clearTimeout(debounceTimers[routeKey]);
	debounceTimers[routeKey] = setTimeout(() => {
		delete debounceTimers[routeKey];
		syncFilterFingerprintToUrl(routeKey, filters);
	}, delayMs);
};

const internalFilterStore = create<FilterStoreState>((set, get) => ({
	filtersByRoute: {},

	hydrateRoute: (routeKey) => {
		set((state) => {
			if (state.filtersByRoute[routeKey]) return state;
			return { filtersByRoute: { ...state.filtersByRoute, [routeKey]: readFromSession(routeKey) } };
		});
	},

	syncFromUrl: (routeKey) => {
		if (typeof window === 'undefined') return;
		const fp = readFingerprintFromUrl(routeKey);
		if (!fp) return;
		const stored = readFromSession(routeKey);
		if (Object.keys(stored).length === 0) return;
		writeToSession(routeKey, stored);
		set((state) => ({ filtersByRoute: { ...state.filtersByRoute, [routeKey]: stored } }));
		debouncedSyncToUrl(routeKey, stored, 0);
	},

	setFilter: (routeKey, key, value) => {
		const current = get().filtersByRoute[routeKey] ?? readFromSession(routeKey);
		const next = buildNext(current, key, value);
		writeToSession(routeKey, next);
		debouncedSyncToUrl(routeKey, next);
		set((state) => ({ filtersByRoute: { ...state.filtersByRoute, [routeKey]: next } }));
	},

	resetFilters: (routeKey) => {
		if (canUseBrowserStorage()) {
			try {
				window.sessionStorage.removeItem(getFilterStorageKey(routeKey));
			} catch {
				// Keep the in-memory store authoritative when storage is unavailable.
			}
		}
		syncFilterFingerprintToUrl(routeKey, EMPTY_FILTERS);
		set((state) => {
			if (!state.filtersByRoute[routeKey]) return state;
			return { filtersByRoute: { ...state.filtersByRoute, [routeKey]: EMPTY_FILTERS } };
		});
	},

	getFilters: (routeKey) => get().filtersByRoute[routeKey] ?? readFromSession(routeKey),
}));

export const useFilterStore = (routeKey: string) => {
	const filters = internalFilterStore((state) => state.filtersByRoute[routeKey] ?? EMPTY_FILTERS);
	const hydrateRoute = internalFilterStore((s) => s.hydrateRoute);
	const syncFromUrl = internalFilterStore((s) => s.syncFromUrl);
	const setFilterForRoute = internalFilterStore((s) => s.setFilter);
	const resetFiltersForRoute = internalFilterStore((s) => s.resetFilters);

	useEffect(() => {
		hydrateRoute(routeKey);
		syncFromUrl(routeKey);
	}, [hydrateRoute, syncFromUrl, routeKey]);

	return useMemo(
		() => ({
			filters,
			fingerprint: createFilterFingerprint(filters),
			storageKey: getFilterStorageKey(routeKey),
			urlParam: getFilterFingerprintParam(routeKey),
			setFilter: (key: string, value: PersistedFilterValue) => setFilterForRoute(routeKey, key, value),
			resetFilters: () => resetFiltersForRoute(routeKey),
			getFilters: () => internalFilterStore.getState().getFilters(routeKey),
		}),
		[filters, resetFiltersForRoute, routeKey, setFilterForRoute],
	);
};

export default useFilterStore;
