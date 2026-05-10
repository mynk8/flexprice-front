import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button Component', () => {
	it('should render the button with children', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
	});

	it('should handle click events', () => {
		const onClickMock = vi.fn();
		render(<Button onClick={onClickMock}>Click me</Button>);
		fireEvent.click(screen.getByRole('button'));
		expect(onClickMock).toHaveBeenCalledTimes(1);
	});

	it('should show a spinner when loading', () => {
		render(<Button isLoading>Submit</Button>);
		// Spinner is an SVG, usually with animate-spin class
		const spinner = document.querySelector('.animate-spin');
		expect(spinner).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeDisabled();
	});

	it('should be disabled when the disabled prop is true', () => {
		render(<Button disabled>Disabled</Button>);
		expect(screen.getByRole('button')).toBeDisabled();
	});

	it('should apply the correct variant classes', () => {
		const { rerender } = render(<Button variant='outline'>Outline</Button>);
		expect(screen.getByRole('button')).toHaveClass('border-input');

		rerender(<Button variant='destructive'>Delete</Button>);
		expect(screen.getByRole('button')).toHaveClass('bg-destructive');
	});
});
