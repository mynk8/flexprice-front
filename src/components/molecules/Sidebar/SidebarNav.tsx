import React, { useState } from 'react';
import { Home, Layers2, Landmark, BarChart3, Settings, CodeXml, Puzzle, GalleryHorizontalEnd } from 'lucide-react';

interface NavSubItem {
	title: string;
	url: string;
	isActive?: boolean;
}

interface NavItem {
	title: string;
	url: string;
	icon: React.ElementType;
	items?: NavSubItem[];
	isActive?: boolean;
}

const NAV_ITEMS: NavItem[] = [
	{ title: 'Home', url: '/', icon: Home },
	{
		title: 'Product Catalog',
		url: '/features',
		icon: Layers2,
		items: [
			{ title: 'Features', url: '/features' },
			{ title: 'Plans', url: '/plans' },
			{ title: 'Coupons', url: '/coupons' },
			{ title: 'Addons', url: '/addons' },
			{ title: 'Price Units', url: '/price-units' },
		],
	},
	{
		title: 'Billing',
		url: '/customers',
		icon: Landmark,
		items: [
			{ title: 'Customers', url: '/customers' },
			{ title: 'Subscriptions', url: '/subscriptions' },
			{ title: 'Invoices', url: '/invoices' },
			{ title: 'Credit Notes', url: '/credit-notes' },
			{ title: 'Taxes', url: '/taxes' },
		],
	},
	{ title: 'Revenue', url: '/revenue', icon: BarChart3 },
	{
		title: 'Tools',
		url: '/imports',
		icon: Settings,
		items: [
			{ title: 'Imports', url: '/imports' },
			{ title: 'Exports', url: '/exports' },
		],
	},
	{
		title: 'Developers',
		url: '/events',
		icon: CodeXml,
		items: [
			{ title: 'Events Debugger', url: '/events' },
			{ title: 'API Keys', url: '/api-keys' },
			{ title: 'Webhooks', url: '/webhooks' },
		],
	},
	{ title: 'Integrations', url: '/integrations', icon: Puzzle },
	{ title: 'Pricing Widget', url: '/pricing', icon: GalleryHorizontalEnd },
];

export interface SidebarNavProps {
	activeRoute?: string;
	collapsed?: boolean;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ activeRoute = '/customers', collapsed = false }) => {
	const [openSections, setOpenSections] = useState<string[]>(['Billing']);

	const toggleSection = (title: string) => {
		setOpenSections((prev) => (prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]));
	};

	return (
		<nav
			className={`h-screen flex flex-col bg-[#f9f9f9] border-r border-gray-300 transition-all duration-200 ${collapsed ? 'w-[60px] px-2' : 'w-[220px] px-3'} py-4`}>
			<div className={`flex items-center gap-2 mb-4 px-1 ${collapsed ? 'justify-center' : ''}`}>
				<div className='w-7 h-7 bg-[#092E44] rounded-md flex items-center justify-center flex-shrink-0'>
					<span className='text-white text-xs font-bold'>FP</span>
				</div>
				{!collapsed && <span className='text-sm font-semibold text-gray-800'>FlexPrice</span>}
			</div>

			<div className='flex-1 space-y-0.5 overflow-y-auto'>
				{NAV_ITEMS.map((item) => {
					const Icon = item.icon;
					const hasChildren = item.items && item.items.length > 0;
					const isOpen = openSections.includes(item.title);
					const isActive = activeRoute === item.url || item.items?.some((sub) => sub.url === activeRoute);

					return (
						<div key={item.title}>
							<button
								onClick={() => hasChildren && toggleSection(item.title)}
								title={collapsed ? item.title : undefined}
								className={`w-full flex items-center gap-2 h-10 px-2 py-2 rounded-[6px] text-sm transition-all duration-200 text-left
									${isActive ? 'bg-zinc-200 border border-zinc-300 shadow-sm font-medium' : 'hover:bg-zinc-100 font-light text-gray-700'}
									${collapsed ? 'justify-center' : ''}`}>
								<Icon className={`size-5 stroke-[1.5px] flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-[#3F3F46]'}`} />
								{!collapsed && <span className='truncate text-[14px]'>{item.title}</span>}
							</button>

							{hasChildren && isOpen && !collapsed && (
								<div className='ml-7 mt-1 mb-2 space-y-0.5 border-l border-gray-200 pl-2'>
									{item.items!.map((sub) => {
										const subActive = activeRoute === sub.url;
										return (
											<a
												key={sub.url}
												href={sub.url}
												onClick={(e) => e.preventDefault()}
												className={`block px-2 py-1.5 text-[13px] rounded-[5px] transition-colors ${
													subActive ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
												}`}>
												{sub.title}
											</a>
										);
									})}
								</div>
							)}
						</div>
					);
				})}
			</div>

			<div className={`pt-3 border-t border-gray-200 ${collapsed ? 'flex justify-center' : 'flex items-center gap-2 px-1'}`}>
				<div className='w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0'>
					<span className='text-white text-xs font-bold'>A</span>
				</div>
				{!collapsed && (
					<div className='flex-1 min-w-0'>
						<div className='text-xs font-medium text-gray-800 truncate'>Admin User</div>
						<div className='text-xs text-gray-500 truncate'>admin@acme.com</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default SidebarNav;
