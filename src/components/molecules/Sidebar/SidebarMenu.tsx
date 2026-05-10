'use client';

import { FC, useState } from 'react';
import { SidebarGroup, SidebarMenu, useSidebar } from '@/components/ui/sidebar';
import SidebarItem from './SidebarItem';
import { useLocation } from 'react-router';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavItem = {
	title: string;
	url: string;
	icon?: LucideIcon;
	isActive?: boolean;
	disabled?: boolean;
	items?: {
		title: string;
		url: string;
		icon?: LucideIcon;
	}[];
	isOpen?: boolean;
	onToggle?: (isOpen: boolean) => void;
};

const SidebarNav: FC<{ items: NavItem[] }> = ({ items }) => {
	const location = useLocation();
	const { state } = useSidebar();
	const isCollapsed = state === 'collapsed';

	const [openItemTitle, setOpenItemTitle] = useState<string | null>(() => {
		// Initialize the open section based on the current route
		for (const item of items) {
			if (item.items && item.items.length > 0) {
				const isMainItemActive = location.pathname.startsWith(item.url) && item.url !== '#';
				const isSubItemActive = item.items?.some((subItem) => location.pathname.startsWith(subItem.url));
				if (isMainItemActive || isSubItemActive) return item.title;
			}
		}
		return null;
	});

	const handleToggle = (itemTitle: string, isOpen: boolean) => {
		if (isOpen) {
			setOpenItemTitle(itemTitle);
		} else {
			setOpenItemTitle(null);
		}
	};

	return (
		<SidebarGroup className='mb-0'>
			<SidebarMenu className={cn('gap-1', isCollapsed && 'gap-4')}>
				{items.map((item) => {
					// Check if current path matches the main item URL or any of its sub-items
					const isMainItemActive = location.pathname.startsWith(item.url) && item.url !== '#';
					const isSubItemActive = item.items?.some((subItem) => location.pathname.startsWith(subItem.url));
					const isActive = isMainItemActive || isSubItemActive;

					item.isActive = isActive;

					const isOpen = openItemTitle === item.title;
					const hasChildren = item.items && item.items.length > 0;

					return (
						<SidebarItem
							key={item.title}
							{...item}
							isOpen={hasChildren ? isOpen : undefined}
							onToggle={hasChildren ? (open) => handleToggle(item.title, open) : undefined}
						/>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
};

export default SidebarNav;
