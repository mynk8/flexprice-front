import { describe, it, expect } from 'vitest';
import { calculateTieredPrice } from './price_helpers';

describe('price_helpers utilities', () => {
	describe('calculateTieredPrice', () => {
		const tiers = [
			{ up_to: 100, unit_amount: '10' },
			{ up_to: 500, unit_amount: '8' },
			{ up_to: null, unit_amount: '5' },
		];

		it('should calculate price for volume model (all units at same rate)', () => {
			// Volume model: if usage is 600, all 600 units are charged at $5
			expect(calculateTieredPrice(600, tiers, 'volume')).toBe(3000);
			// if usage is 250, all 250 units are charged at $8
			expect(calculateTieredPrice(250, tiers, 'volume')).toBe(2000);
		});

		it('should calculate price for graduated model (brackets)', () => {
			// Graduated: first 100 @ 10, next 400 @ 8, remaining @ 5
			// Usage 600: (100 * 10) + (400 * 8) + (100 * 5) = 1000 + 3200 + 500 = 4700
			expect(calculateTieredPrice(600, tiers, 'graduated')).toBe(4700);

			// Usage 50: (50 * 10) = 500
			expect(calculateTieredPrice(50, tiers, 'graduated')).toBe(500);
		});

		it('should return 0 for zero usage', () => {
			expect(calculateTieredPrice(0, tiers, 'volume')).toBe(0);
			expect(calculateTieredPrice(0, tiers, 'graduated')).toBe(0);
		});
	});
});
