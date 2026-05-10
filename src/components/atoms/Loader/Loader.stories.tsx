import type { Meta, StoryObj } from '@storybook/react';
import Loader, { PageLoader } from './Loader';

/**
 * ## Loader
 *
 * An engaging loading state component that cycles through randomized,
 * context-aware loading quotes. Used for asynchronous operations that
 * take longer than a few seconds (like report generation or heavy data fetching).
 *
 * Provides both a standard `Loader` that fills its container, and a
 * `PageLoader` wrapper that centers the loader in a full-screen height container.
 */
const meta = {
	title: 'Atoms/Loader',
	component: Loader,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Animated loading spinner with cycling witty quotes to keep users engaged during long operations.',
			},
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className='h-[400px] border border-dashed border-border rounded-lg relative bg-muted/30'>
			<Loader />
		</div>
	),
};

export const FullPageLoader: Story = {
	name: 'PageLoader (Full Screen)',
	render: () => (
		<div className='border border-dashed border-border rounded-lg relative overflow-hidden h-[600px] bg-card'>
			<div className='absolute top-4 left-4 font-mono text-xs text-muted-foreground'>Mock Browser Window</div>
			<PageLoader />
		</div>
	),
};
