import { useId, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Search, X } from 'lucide-react';
import Input from '@/components/atoms/Input';

export interface SearchBarProps {
	/** Initial search value. */
	value?: string;
	/** Callback triggered when the search value changes (debounced). */
	onChange?: (value: string) => void;
	/** Placeholder text for the search input. */
	placeholder?: string;
	/** Debounce delay in milliseconds. Defaults to 300. */
	debounceMs?: number;
	/** Whether the search is in a loading state. Shows a spinner in the suffix. */
	isLoading?: boolean;
	/** Whether the search input is disabled. */
	disabled?: boolean;
	/** Additional CSS classes for the input container. */
	className?: string;
	/** Accessible label for the search input. Defaults to 'Search'. */
	'aria-label'?: string;
}

/**
 * SearchBar component with built-in debounce and clear button.
 * Used for filtering tables and lists.
 *
 * @example
 * <SearchBar
 *   placeholder="Search customers..."
 *   onChange={(val) => handleSearch(val)}
 * />
 */
const SearchBar = ({
	value = '',
	onChange,
	placeholder = 'Search...',
	debounceMs = 300,
	isLoading = false,
	disabled = false,
	className,
	'aria-label': ariaLabel = 'Search',
}: SearchBarProps) => {
	const generatedId = useId();
	const [localValue, setLocalValue] = useState(value);

	// Sync prop to state if it changes externally
	const prevValueRef = useRef(value);
	if (prevValueRef.current !== value) {
		setLocalValue(value);
		prevValueRef.current = value;
	}

	const debouncedOnChange = useDebouncedCallback((val: string) => {
		onChange?.(val);
	}, debounceMs);

	const handleChange = (next: string) => {
		setLocalValue(next);
		debouncedOnChange(next);
	};

	const handleClear = () => {
		setLocalValue('');
		onChange?.('');
		debouncedOnChange.cancel();
	};

	const suffixContent = isLoading ? (
		<div className='w-3.5 h-3.5 border-2 border-muted-foreground/50 border-t-transparent rounded-full animate-spin' />
	) : localValue ? (
		<button
			type='button'
			onClick={handleClear}
			className='text-muted-foreground hover:text-foreground transition-colors'
			aria-label='Clear search'>
			<X className='size-3.5' aria-hidden />
		</button>
	) : (
		<Search className='size-3.5 text-muted-foreground' aria-hidden />
	);

	return (
		<Input
			value={localValue}
			onChange={handleChange}
			placeholder={placeholder}
			disabled={disabled}
			suffix={suffixContent}
			className={className}
			id={generatedId}
			aria-label={ariaLabel}
		/>
	);
};

export default SearchBar;
