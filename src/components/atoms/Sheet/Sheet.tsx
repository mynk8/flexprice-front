import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Sheet as ShadcnSheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export interface SheetProps {
	trigger?: ReactNode;
	children?: ReactNode;
	title?: string | ReactNode;
	description?: string | ReactNode;
	isOpen?: boolean;
	onOpenChange?: (isOpen: boolean) => void;
	className?: string;
	size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

const Sheet: FC<SheetProps> = ({ children, trigger, description, title, isOpen, onOpenChange, className, size = 'sm' }) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const [isScrollable, setIsScrollable] = useState(false);

	useEffect(() => {
		if (isOpen && contentRef.current) {
			const checkScrollability = () => {
				if (contentRef.current) {
					const isScrollableContent = contentRef.current.scrollHeight > contentRef.current.clientHeight;
					setIsScrollable(isScrollableContent);
				}
			};

			checkScrollability();
			const timeoutId = setTimeout(checkScrollability, 100);
			const resizeObserver = new ResizeObserver(checkScrollability);
			resizeObserver.observe(contentRef.current);

			return () => {
				clearTimeout(timeoutId);
				resizeObserver.disconnect();
			};
		} else {
			setIsScrollable(false);
		}
	}, [isOpen, children]);

	return (
		<ShadcnSheet open={isOpen} onOpenChange={onOpenChange}>
			{trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
			<SheetContent
				ref={contentRef}
				className={cn('h-screen overflow-y-auto rounded-[10px]', className, {
					'sm:max-w-sm': size === 'sm',
					'sm:max-w-md': size === 'md',
					'sm:max-w-lg': size === 'lg',
					'sm:max-w-xl': size === 'xl',
					'sm:max-w-2xl': size === '2xl',
					'sm:max-w-3xl': size === '3xl',
					'sm:max-w-full': size === 'full',
				})}>
				{(title || description) && (
					<SheetHeader>
						{title && <SheetTitle>{title}</SheetTitle>}
						{description && <SheetDescription>{description}</SheetDescription>}
					</SheetHeader>
				)}
				{isScrollable && !(title || description) ? <div className='mt-9'>{children}</div> : children}
			</SheetContent>
		</ShadcnSheet>
	);
};

export default Sheet;
