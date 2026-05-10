import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
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
}: SearchBarProps) => {
	const [localValue, setLocalValue] = useState(value);
	const [debouncedValue] = useDebounce(localValue, debounceMs);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	useEffect(() => {
		onChange?.(debouncedValue);
	}, [debouncedValue, onChange]);

	const handleChange = (next: string) => {
		setLocalValue(next);
	};

	const handleClear = () => {
		setLocalValue('');
		onChange?.('');
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
			id='search-bar'
		/>
	);
};

export default SearchBar;
