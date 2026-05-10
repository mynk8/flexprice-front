import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import SidebarNav from './SidebarNav';

/**
 * ## SidebarNav
 *
 * The primary navigation sidebar for FlexPrice. Features:
 * - Icon + label navigation items
 * - Collapsible sub-menus (Product Catalog, Billing, Tools, Developers)
 * - Active route highlighting with navy background
 * - Collapsed icon-only mode with tooltips
 *
 * Since the full sidebar uses Radix UI's Sidebar context and react-router hooks,
 * this story demonstrates the nav pattern using a standalone implementation
 * that mirrors the FlexPrice sidebar structure.
 */
const meta = {
	title: 'Organisms/SidebarNav',
	component: SidebarNav,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'The primary navigation sidebar. Features collapsible sections, active route highlighting, icon-only collapsed mode, and a user profile footer.',
			},
		},
	},
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
	argTypes: {
		activeRoute: {
			control: 'select',
			options: ['/', '/features', '/plans', '/customers', '/subscriptions', '/invoices', '/revenue', '/events'],
			description: 'Currently active route URL',
		},
		collapsed: {
			control: 'boolean',
			description: 'Toggle icon-only collapsed mode',
		},
	},
	args: {
		activeRoute: '/customers',
		collapsed: false,
	},
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		activeRoute: '/customers',
		collapsed: false,
	},
};

export const HomeActive: Story = {
	args: {
		activeRoute: '/',
	},
};

export const PlansActive: Story = {
	args: {
		activeRoute: '/plans',
	},
};

export const Collapsed: Story = {
	args: {
		collapsed: true,
		activeRoute: '/customers',
	},
};

export const ExpandedVsCollapsed: Story = {
	name: 'Expanded vs Collapsed',
	render: () => (
		<div className='flex'>
			<SidebarNav activeRoute='/customers' collapsed={false} />
			<SidebarNav activeRoute='/customers' collapsed={true} />
		</div>
	),
};
