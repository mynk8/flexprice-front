import { describe, it, expect } from 'vitest';
import { toSentenceCase, getCurrencySymbol, formatBillingModel } from './helper_functions';

describe('helper_functions utilities', () => {
	describe('toSentenceCase', () => {
		it('should capitalize the first letter and lowercase the rest', () => {
			expect(toSentenceCase('HELLO')).toBe('Hello');
			expect(toSentenceCase('world')).toBe('World');
			expect(toSentenceCase('pRaCtIcE')).toBe('Practice');
		});

		it('should handle empty strings', () => {
			expect(toSentenceCase('')).toBe('');
		});
	});

	describe('getCurrencySymbol', () => {
		it('should return $ for USD', () => {
			expect(getCurrencySymbol('USD')).toBe('$');
		});

		it('should return ₹ for INR', () => {
			expect(getCurrencySymbol('INR')).toBe('₹');
		});

		it('should return the input if not found', () => {
			expect(getCurrencySymbol('XYZ')).toBe('XYZ');
		});
	});

	describe('formatBillingModel', () => {
		it('should format known models', () => {
			expect(formatBillingModel('FLAT_FEE')).toBe('Flat Fee');
			expect(formatBillingModel('TIERED')).toBe('Tiered');
		});

		it('should return -- for unknown models', () => {
			expect(formatBillingModel('INVALID')).toBe('--');
		});
	});
});
