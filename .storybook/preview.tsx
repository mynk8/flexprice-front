import 'tailwindcss/tailwind.css';
import '../src/index.css';
import type { Preview } from '@storybook/react';

const preview: Preview = {
	globalTypes: {
		theme: {
			name: 'Theme',
			description: 'Global theme for stories',
			defaultValue: 'light',
			toolbar: {
				icon: 'mirror',
				items: [
					{ value: 'light', title: 'Light' },
					{ value: 'dark', title: 'Dark' },
				],
				dynamicTitle: true,
			},
		},
	},
	decorators: [
		(Story, context) => {
			const isDark = context.globals.theme === 'dark';
			return (
				<div
					className={
						isDark ? 'dark min-h-screen bg-background text-foreground font-inter' : 'min-h-screen bg-white text-foreground font-inter'
					}>
					<Story />
				</div>
			);
		},
	],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		docs: {
			toc: true,
		},
		backgrounds: {
			default: 'white',
			values: [
				{ name: 'white', value: '#ffffff' },
				{ name: 'surface', value: '#f8fafc' },
				{ name: 'ink', value: '#09090b' },
			],
		},
		viewport: {
			viewports: {
				mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' } },
				tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
				desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' } },
				sidebar: { name: 'Sidebar width', styles: { width: '240px', height: '900px' } },
			},
		},
		// Hide the right sidebar (controls + docs panel). Left nav only.
		layout: 'fullscreen',
	},
};

export default preview;
