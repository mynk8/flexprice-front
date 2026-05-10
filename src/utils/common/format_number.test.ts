import { describe, it, expect } from 'vitest';
import formatNumber, { formatCompactNumber } from './format_number';

describe('formatNumber utility', () => {
	describe('formatNumber', () => {
		it('should format a standard number with thousands separators', () => {
			expect(formatNumber(1000)).toBe('1,000');
			expect(formatNumber(1234567)).toBe('1,234,567');
		});

		it('should handle decimal places correctly', () => {
			expect(formatNumber(1000.5, 2)).toBe('1,000.50');
			expect(formatNumber(1000.555, 2)).toBe('1,000.56'); // Should round up
		});

		it('should clamp decimals to a maximum of 20', () => {
			// Testing the internal clamp Math.min(20, decimals)
			const result = formatNumber(1, 25);
			expect(result.split('.')[1].length).toBe(20);
		});

		it('should return "-" for falsy values like 0 or undefined', () => {
			expect(formatNumber(0)).toBe('-');
			// @ts-expect-error testing invalid input
			expect(formatNumber(undefined)).toBe('-');
		});
	});

	describe('formatCompactNumber', () => {
		it('should format thousands with "k"', () => {
			expect(formatCompactNumber(1000)).toBe('1k');
			expect(formatCompactNumber(1500)).toBe('1.5k');
			expect(formatCompactNumber(999900)).toBe('999.9k');
		});

		it('should format millions with "M"', () => {
			expect(formatCompactNumber(1000000)).toBe('1M');
			expect(formatCompactNumber(2500000)).toBe('2.5M');
		});

		it('should format billions with "B"', () => {
			expect(formatCompactNumber(1000000000)).toBe('1B');
			expect(formatCompactNumber(1500000000)).toBe('1.5B');
		});

		it('should return locale string for values under 1000', () => {
			expect(formatCompactNumber(999)).toBe('999');
			expect(formatCompactNumber(50)).toBe('50');
		});
	});
});
