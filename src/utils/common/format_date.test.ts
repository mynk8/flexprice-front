import { describe, it, expect } from 'vitest';
import formatDate, { formatDateTime } from './format_date';

describe('format_date utilities', () => {
	describe('formatDate', () => {
		it('should format a valid date string correctly', () => {
			const date = '2025-05-10T12:00:00Z';
			expect(formatDate(date)).toBe('May 10, 2025');
		});

		it('should handle Date objects', () => {
			const date = new Date('2025-12-25');
			expect(formatDate(date)).toBe('Dec 25, 2025');
		});

		it('should return "Invalid Date" for bad inputs', () => {
			expect(formatDate('not-a-date')).toBe('Invalid Date');
		});

		it('should support custom locales', () => {
			const date = '2025-05-10';
			// In many European locales, it's day/month/year
			expect(formatDate(date, 'en-GB')).toBe('10 May 2025');
		});
	});

	describe('formatDateTime', () => {
		it('should include time for valid strings', () => {
			const date = '2025-05-10T15:30:00Z';
			// Note: result depends on runner timezone, but usually includes AM/PM for en-US
			const result = formatDateTime(date);
			expect(result).toContain('2025');
			expect(result).toContain('May 10');
			// Time part check - partial match to be safe across timezones
			expect(result).toMatch(/\d{1,2}:\d{2}/);
		});
	});
});
