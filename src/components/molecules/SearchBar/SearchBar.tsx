import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Search, X } from 'lucide-react';
import Input from '@/components/atoms/Input';

export interface SearchBarProps {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	debounceMs?: number;
	isLoading?: boolean;
	disabled?: boolean;
	className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
	value = '',
	onChange,
	placeholder = 'Search...',
	debounceMs = 300,
	isLoading = false,
	disabled = false,
	className,
}) => {
	const [localValue, setLocalValue] = useState(value);
	const [debouncedValue] = useDebounce(localValue, debounceMs);

	useEffect(() => {
		onChange?.(debouncedValue);
	}, [debouncedValue, onChange]);

	const handleChange = (newVal: string) => {
		setLocalValue(newVal);
	};

	const handleClear = () => {
		setLocalValue('');
		onChange?.('');
	};

	const suffixContent = isLoading ? (
		<div className='w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin' />
	) : localValue ? (
		<button type='button' onClick={handleClear} className='text-gray-400 hover:text-gray-600 transition-colors'>
			<X className='size-3.5' />
		</button>
	) : (
		<Search className='size-3.5 text-gray-400' />
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
