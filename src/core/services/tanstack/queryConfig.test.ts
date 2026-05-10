import { describe, expect, it } from 'vitest';
import { createQueryClientConfig, createQueryConfig, QUERY_CACHE_TIME, QUERY_PRESETS } from './queryConfig';

describe('queryConfig', () => {
	it('uses five minute stale time and ten minute gc time for DEFAULT queries', () => {
		expect(QUERY_PRESETS.DEFAULT.staleTime).toBe(5 * 60 * 1000);
		expect(QUERY_PRESETS.DEFAULT.gcTime).toBe(10 * 60 * 1000);
	});

	it('allows call sites to override cache timings declaratively', () => {
		expect(createQueryConfig('DEFAULT', { staleTime: 0 })).toMatchObject({
			staleTime: 0,
			gcTime: QUERY_CACHE_TIME.defaultGcTime,
		});
	});

	it('creates the global QueryClient default cache policy', () => {
		expect(createQueryClientConfig().defaultOptions?.queries).toMatchObject({
			staleTime: QUERY_CACHE_TIME.defaultStaleTime,
			gcTime: QUERY_CACHE_TIME.defaultGcTime,
			refetchOnWindowFocus: false,
		});
	});
});
