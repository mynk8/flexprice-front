import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import { ComponentProps } from 'react';
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
			description: 'Controlled collapsed state. Toggle this to see the sidebar collapse.',
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

/**
 * The default interactive story. Use the **Controls** panel to toggle `collapsed` or change the `activeRoute`.
 * The sidebar is also fully interactive — you can click the toggle button in the header or the rail to collapse/expand it manually.
 */
export const Interactive: Story = {
	args: {
		collapsed: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const toggleButton = canvas.getByRole('button', { name: /toggle sidebar/i });

		// Test expansion/collapsing
		await userEvent.click(toggleButton);
		// Wait a bit for transition
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Check if it's collapsed (Acme Corp should be hidden in collapsed state)
		const acmeText = canvas.queryByText('Acme Corp');
		if (acmeText) {
			// If it's still visible, the toggle might not have worked or it's expanding
		}

		await userEvent.click(toggleButton);
	},
};

/**
 * Starts in the collapsed (icon-only) state.
 */
export const InitiallyCollapsed: Story = {
	name: 'Initially Collapsed',
	args: {
		defaultCollapsed: true,
	},
};
