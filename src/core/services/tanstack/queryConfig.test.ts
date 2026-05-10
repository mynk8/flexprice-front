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

	describe('presets', () => {
		it('REALTIME has zero stale time for live data', () => {
			expect(QUERY_PRESETS.REALTIME.staleTime).toBe(0);
			expect(QUERY_PRESETS.REALTIME.gcTime).toBe(QUERY_CACHE_TIME.defaultGcTime);
			expect(QUERY_PRESETS.REALTIME.refetchOnMount).toBe(true);
		});

		it('DEFAULT has 5-minute stale time and 10-minute gc time', () => {
			expect(QUERY_PRESETS.DEFAULT.staleTime).toBe(5 * 60 * 1000);
			expect(QUERY_PRESETS.DEFAULT.gcTime).toBe(10 * 60 * 1000);
			expect(QUERY_PRESETS.DEFAULT.refetchOnWindowFocus).toBe(false);
			expect(QUERY_PRESETS.DEFAULT.refetchOnMount).toBe(false);
		});

		it('STATIC has 30-minute stale time and 60-minute gc time for rarely-changing data', () => {
			expect(QUERY_PRESETS.STATIC.staleTime).toBe(30 * 60 * 1000);
			expect(QUERY_PRESETS.STATIC.gcTime).toBe(60 * 60 * 1000);
		});
	});

	describe('override behavior', () => {
		it('merges overrides over preset values', () => {
			const result = createQueryConfig('STATIC', { staleTime: 0, refetchOnWindowFocus: true });
			expect(result.staleTime).toBe(0);
			expect(result.refetchOnWindowFocus).toBe(true);
			// gcTime should still come from STATIC
			expect(result.gcTime).toBe(QUERY_CACHE_TIME.staticGcTime);
		});

		it('partial overrides only change specified fields', () => {
			const result = createQueryConfig('DEFAULT', { staleTime: 0 });
			expect(result.staleTime).toBe(0);
			expect(result.refetchOnWindowFocus).toBe(false); // from DEFAULT preset
			expect(result.gcTime).toBe(QUERY_CACHE_TIME.defaultGcTime); // from DEFAULT preset
		});
	});
});
