import 'tailwindcss/tailwind.css';
import '../src/index.css';
import type { Preview } from '@storybook/react';

const preview: Preview = {
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
				{ name: 'light gray', value: '#f9f9f9' },
				{ name: 'dark', value: '#1a1a2e' },
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
