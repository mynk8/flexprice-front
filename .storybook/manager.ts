import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const flexpriceTheme = create({
	base: 'light',
	brandTitle: 'FlexPrice UI',
	brandTarget: '_self',
	fontBase: '"Inter", sans-serif',
	fontCode: '"Fira Code", monospace',
	colorPrimary: '#3293D9',
	colorSecondary: '#3293D9',
	appBg: '#f8fafc',
	appContentBg: '#ffffff',
	appBorderColor: '#e4e4e7',
	appBorderRadius: 6,
	barBg: '#ffffff',
	barTextColor: '#3f3f46',
	barSelectedColor: '#3293D9',
	textColor: '#18181b',
	textInverseColor: '#ffffff',
	inputBg: '#ffffff',
	inputBorder: '#e4e4e7',
	inputTextColor: '#18181b',
	inputBorderRadius: 6,
});

addons.setConfig({
	theme: flexpriceTheme,
	showPanel: true,
	panelPosition: 'right',
});
