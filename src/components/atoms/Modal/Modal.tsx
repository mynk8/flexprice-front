import * as React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
	DialogOverlay,
	DialogPortal,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface ModalProps {
	/** Controls whether the modal is visible */
	isOpen?: boolean;
	/** Called when the modal attempts to close */
	onOpenChange?: (open: boolean) => void;
	/** Child content — typically composed with DialogHeader, body, DialogFooter */
	children?: ReactNode;
	/** Additional CSS classes applied to the content wrapper */
	className?: string;
	/** Whether to render the backdrop overlay (default: true) */
	showOverlay?: boolean;
	/** Whether to show the built-in close button in the top-right corner */
	showCloseButton?: boolean;
	/** Width preset passed directly to max-w- class (default: 'max-w-lg') */
	size?: 'max-w-sm' | 'max-w-md' | 'max-w-lg' | 'max-w-xl' | 'max-w-2xl' | 'max-w-full';
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onOpenChange,
	children,
	className,
	showOverlay = true,
	showCloseButton = true,
	size = 'max-w-lg',
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogPortal>
				{showOverlay && <DialogOverlay />}
				<DialogContent showCloseButton={showCloseButton} className={cn(size !== 'max-w-lg' ? size : '', className)}>
					{children}
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
};

export default Modal;

// Compound components for flexible composition
export { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose };
