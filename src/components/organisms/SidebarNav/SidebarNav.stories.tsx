import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState, type ComponentProps } from 'react';
import { MemoryRouter } from 'react-router';
import SidebarNav from './SidebarNav';

/**
 * ## SidebarNav
 *
 * Product navigation organism composed from the same sidebar molecules used by
 * the FlexPrice app: `SidebarMenu`, `SidebarItem`, and the shadcn sidebar
 * primitives. It preserves the production child spacing, active states,
 * vertical guide line, icon sizing, and collapsed icon-only behavior.
 *
 * ### Props
 * - `items` - Navigation tree rendered by the real sidebar menu molecule.
 * - `collapsed` / `onCollapsedChange` - Controlled collapse state.
 * - `defaultCollapsed` - Initial uncontrolled collapse state.
 * - `header` / `footer` - Optional slots for product chrome around the menu.
 */
type StoryArgs = ComponentProps<typeof SidebarNav> & {
	activeRoute: string;
};

const meta = {
	title: 'Organisms/SidebarNav',
	component: SidebarNav,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Primary FlexPrice navigation built from the production sidebar molecules. Use this story as the platform guide for sidebar spacing, active route styling, nested item behavior, and interactive collapse/expand behavior.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		activeRoute: {
			control: 'select',
			options: ['/', '/features', '/plans', '/customers', '/subscriptions', '/invoices', '/revenue', '/events', '/api-keys'],
			description: 'Initial route used by the MemoryRouter so the real sidebar molecules can compute active state.',
		},
		collapsed: {
			control: 'boolean',
			description: 'Controlled collapsed state.',
		},
		defaultCollapsed: {
			control: 'boolean',
			description: 'Initial uncontrolled collapsed state.',
		},
		items: {
			control: false,
		},
		header: {
			control: false,
		},
		footer: {
			control: false,
		},
	},
	args: {
		activeRoute: '/customers',
	},
	render: ({ activeRoute, ...args }) => (
		<MemoryRouter key={activeRoute} initialEntries={[activeRoute]}>
			<div className='min-h-screen bg-background'>
				<SidebarNav {...args} />
			</div>
		</MemoryRouter>
	),
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		collapsed: false,
	},
};

const ControlledDemo = ({ activeRoute, collapsed: initialCollapsed = false }: StoryArgs) => {
	const [collapsed, setCollapsed] = useState(initialCollapsed);

	return (
		<MemoryRouter key={activeRoute} initialEntries={[activeRoute]}>
			<div className='min-h-screen bg-background'>
				<SidebarNav collapsed={collapsed} onCollapsedChange={setCollapsed} />
			</div>
		</MemoryRouter>
	);
};

export const Collapsed: Story = {
	args: {
		activeRoute: '/customers',
		defaultCollapsed: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /toggle sidebar/i }));
		await expect(canvas.getByText('Acme Corp')).toBeInTheDocument();
	},
};

export const Controlled: Story = {
	args: {
		activeRoute: '/customers',
		collapsed: false,
	},
	render: (args) => <ControlledDemo {...args} />,
};

export const ExpandedVsCollapsed: Story = {
	name: 'Expanded vs Collapsed',
	render: ({ activeRoute }) => (
		<div className='flex min-h-screen bg-background'>
			<MemoryRouter initialEntries={[activeRoute]}>
				<SidebarNav collapsed={false} />
			</MemoryRouter>
			<MemoryRouter initialEntries={[activeRoute]}>
				<SidebarNav defaultCollapsed />
			</MemoryRouter>
		</div>
	),
	args: {
		activeRoute: '/customers',
	},
};
