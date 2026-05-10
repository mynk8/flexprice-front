import { useEffect, useState, type ReactNode } from 'react';
import { BarChart3, CodeXml, GalleryHorizontalEnd, Home, Landmark, Layers2, Puzzle, Settings } from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
	useSidebar,
} from '@/components/ui/sidebar';
import SidebarMenu, { type NavItem } from '@/components/molecules/Sidebar/SidebarMenu';
import { cn } from '@/lib/utils';

export const sidebarNavItems: NavItem[] = [
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
			{ title: 'Cost Sheets', url: '/cost-sheets' },
			{ title: 'Price Units', url: '/price-units' },
			{ title: 'Groups', url: '/groups' },
		],
	},
	{
		title: 'Billing',
		url: '/customers',
		icon: Landmark,
		items: [
			{ title: 'Customers', url: '/customers' },
			{ title: 'Subscriptions', url: '/subscriptions' },
			{ title: 'Taxes', url: '/taxes' },
			{ title: 'Invoices', url: '/invoices' },
			{ title: 'Credit Notes', url: '/credit-notes' },
			{ title: 'Payments', url: '/payments' },
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
			{ title: 'Service Accounts', url: '/service-accounts' },
			{ title: 'Webhooks', url: '/webhooks' },
			{ title: 'Workflows', url: '/workflows' },
		],
	},
	{ title: 'Integrations', url: '/integrations', icon: Puzzle },
	{ title: 'Pricing Widget', url: '/pricing', icon: GalleryHorizontalEnd },
];

export interface SidebarNavProps {
	/** Array of navigation items to display in the sidebar. */
	items?: NavItem[];
	/** Controlled collapsed state of the sidebar. */
	collapsed?: boolean;
	/** Default collapsed state for uncontrolled usage. */
	defaultCollapsed?: boolean;
	/** Callback function triggered when the collapsed state changes. */
	onCollapsedChange?: (collapsed: boolean) => void;
	/** Additional CSS classes for the sidebar container. */
	className?: string;
	/** Optional custom header element. */
	header?: ReactNode;
	/** Optional custom footer element. */
	footer?: ReactNode;
}

const SidebarNavHeader = () => {
	const { open } = useSidebar();

	return (
		<div className='mt-1 w-full'>
			<div className={cn('w-full mt-2 flex items-center gap-2', open ? 'justify-between' : 'justify-center')}>
				<div className={cn('items-center text-start gap-2 min-w-0', open ? 'flex' : 'hidden')}>
					<span className='size-7 bg-black text-white flex justify-center items-center rounded-[6px] text-xs font-semibold'>AC</span>
					<div className='text-start min-w-0'>
						<p className='font-medium text-[16px] leading-snug truncate'>Acme Corp</p>
					</div>
				</div>
				<SidebarTrigger className='h-7 w-7 shrink-0' />
			</div>

			<div className={cn(open ? '' : 'hidden')}>
				<div className='w-full mt-3.5 flex items-center justify-between h-10 px-2 py-[10px] rounded-[6px] border border-blue-200 text-primary bg-blue-50'>
					<div className='flex items-center gap-2 min-w-0'>
						<span className='block size-2 rounded-full bg-primary' />
						<span className='block text-[14px] font-normal truncate max-w-[120px]'>Production</span>
					</div>
				</div>
			</div>
		</div>
	);
};

const SidebarNavFooter = () => {
	const { open } = useSidebar();

	return (
		<div className='flex flex-col gap-2 w-full'>
			<button className='w-full flex items-center justify-between h-10 rounded-[6px] gap-2 px-2 hover:bg-muted transition-colors'>
				<div className='flex items-center gap-1 min-w-0 flex-1'>
					<div className='size-5 text-xs bg-primary text-primary-foreground flex justify-center items-center rounded-full flex-shrink-0 font-medium'>
						A
					</div>
					<div className={cn('min-w-0 flex-1 text-left', open ? '' : 'hidden')}>
						<p className='text-xs text-muted-foreground truncate'>admin@acme.com</p>
					</div>
				</div>
			</button>
		</div>
	);
};

/**
 * SidebarNav is the main navigation component for the FlexPrice application.
 * Supports collapsible sections, nested items, and active route highlighting.
 * Built on top of Shadcn UI Sidebar components.
 *
 * @example
 * <SidebarNav items={navItems} />
 */
const SidebarNav = ({
	items = sidebarNavItems,
	collapsed,
	defaultCollapsed = false,
	onCollapsedChange,
	className,
	header,
	footer,
}: SidebarNavProps) => {
	const controlled = collapsed !== undefined;
	const [localCollapsed, setLocalCollapsed] = useState(defaultCollapsed);
	const isCollapsed = controlled ? collapsed : localCollapsed;

	useEffect(() => {
		if (!controlled) {
			setLocalCollapsed(defaultCollapsed);
		}
	}, [defaultCollapsed, controlled]);

	const setOpen = (open: boolean) => {
		const next = !open;
		if (!controlled) {
			setLocalCollapsed(next);
		}
		onCollapsedChange?.(next);
	};

	return (
		<SidebarProvider open={!isCollapsed} onOpenChange={setOpen}>
			<Sidebar collapsible='icon' className={cn('border-r-[1.5px] border-border py-1 bg-muted/40', className)}>
				<SidebarHeader>{header ?? <SidebarNavHeader />}</SidebarHeader>
				<SidebarContent className='gap-0 mt-1'>
					<SidebarMenu items={items} />
				</SidebarContent>
				<SidebarFooter>{footer ?? <SidebarNavFooter />}</SidebarFooter>
				<SidebarRail />
			</Sidebar>
		</SidebarProvider>
	);
};

export default SidebarNav;
