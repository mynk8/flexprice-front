import type { QueryClientConfig } from '@tanstack/react-query';

export const QUERY_CACHE_TIME = {
	realtimeStaleTime: 0,
	defaultStaleTime: 5 * 60 * 1000,
	defaultGcTime: 10 * 60 * 1000,
	staticStaleTime: 30 * 60 * 1000,
	staticGcTime: 60 * 60 * 1000,
} as const;

export interface QueryCachePreset {
	staleTime: number;
	gcTime: number;
	refetchOnWindowFocus: boolean;
	refetchOnMount: boolean;
	refetchOnReconnect: boolean;
}

export const QUERY_PRESETS = {
	REALTIME: {
		staleTime: QUERY_CACHE_TIME.realtimeStaleTime,
		gcTime: QUERY_CACHE_TIME.defaultGcTime,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		refetchOnReconnect: true,
	},
	DEFAULT: {
		staleTime: QUERY_CACHE_TIME.defaultStaleTime,
		gcTime: QUERY_CACHE_TIME.defaultGcTime,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	},
	STATIC: {
		staleTime: QUERY_CACHE_TIME.staticStaleTime,
		gcTime: QUERY_CACHE_TIME.staticGcTime,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	},
} as const satisfies Record<string, QueryCachePreset>;

export type QueryPresetName = keyof typeof QUERY_PRESETS;

export type QueryConfigOverrides = Partial<QueryCachePreset>;

export const createQueryConfig = (preset: QueryPresetName = 'DEFAULT', overrides: QueryConfigOverrides = {}) => ({
	...QUERY_PRESETS[preset],
	...overrides,
});

export const createQueryClientConfig = (): QueryClientConfig => ({
	defaultOptions: {
		queries: {
			...createQueryConfig('DEFAULT'),
			refetchInterval: false,
			refetchIntervalInBackground: false,
		},
		mutations: {
			retry: false,
		},
	},
});
