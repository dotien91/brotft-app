import React from 'react';
import { View } from 'react-native';
import RNIcon, { IconType } from 'react-native-dynamic-vector-icons';

// Attempt to load phosphor-react-native at runtime. If not installed, fall back to RNIcon.
let Phosphor: any = null;
try {
	// eslint-disable-next-line global-require
	Phosphor = require('phosphor-react-native');
} catch (e) {
	Phosphor = null;
}

export { IconType };

// Mapping from common icon names to Phosphor icon names
const iconMapping: Record<string, string> = {
	// Navigation icons
	home: 'House',
	'home-outline': 'House',
	book: 'Book',
	'book-outline': 'BookOpen',
	settings: 'Gear',
	'settings-outline': 'Gear',
	// Common icons
	heart: 'Heart',
	shield: 'Shield',
	sparkles: 'Sparkle',
	'color-wand': 'MagicWand',
	'radio-button-on': 'Target',
	water: 'Drop',
	fitness: 'Gauge',
	flash: 'Lightning',
	chevronForward: 'CaretRight',
	'chevron-forward': 'CaretRight',
	chevronBack: 'CaretLeft',
	'chevron-back': 'CaretLeft',
	informationCircleOutline: 'Info',
	'information-circle-outline': 'Info',
	chatbubbleEllipses: 'ChatCircleDots',
	'chatbubble-ellipses': 'ChatCircleDots',
	documentText: 'FileText',
	'document-text': 'FileText',
	shieldCheckmark: 'ShieldCheck',
	'shield-checkmark': 'ShieldCheck',
	code: 'Code',
	star: 'Star',
	'star-o': 'Star',
	codeFork: 'GitFork',
	'code-fork': 'GitFork',
	checkmarkCircle: 'CheckCircle',
	'checkmark-circle': 'CheckCircle',
	close: 'X',
	search: 'MagnifyingGlass',
	menu: 'List',
	grid: 'GridFour',
	filter: 'Funnel',
	sort: 'SortAscending',
	refresh: 'ArrowClockwise',
	share: 'Share',
	download: 'Download',
	upload: 'Upload',
	edit: 'Pencil',
	delete: 'Trash',
	add: 'Plus',
	remove: 'Minus',
	play: 'Play',
	pause: 'Pause',
	stop: 'Stop',
	// Stat icons
	sword: 'Sword',
	magicWand: 'MagicWand',
	'magic-wand': 'MagicWand',
	drop: 'Drop',
	gauge: 'Gauge',
	lightning: 'Lightning',
	heart: 'Heart',
	shield: 'Shield',
	sparkle: 'Sparkle',
	target: 'Target',
	coin: 'Coin',
	money: 'CurrencyCircleDollar',
	clock: 'Clock',
	arrowUp: 'CaretUp',
	'arrow-up': 'CaretUp',
	arrowDown: 'CaretDown',
	'arrow-down': 'CaretDown',
	arrowLeft: 'CaretLeft',
	'arrow-left': 'CaretLeft',
	arrowRight: 'CaretRight',
	'arrow-right': 'CaretRight',
};

const toPascalCase = (name: string) => {
	if (!name) return '';
	return name
		.replace(/[-_]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
		.replace(/^(.)/, (m) => m.toUpperCase());
};

type IconProps = React.ComponentProps<typeof RNIcon> & {
	weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
};

const Icon: React.FC<IconProps> = ({name, size = 20, color = '#000', weight = 'bold', ...rest}) => {
	// If Phosphor is available, try to render a matching icon by name.
	if (Phosphor) {
		// First, check if there's a direct mapping
		let phosphorName = iconMapping[String(name || '')] || String(name || '');
		// Convert to PascalCase for Phosphor component name
		const pascal = toPascalCase(phosphorName);
		const PhosphorComp = (Phosphor && Phosphor[pascal]) || null;
		if (PhosphorComp) {
			// phosphor icons accept size, color, weight props
			return <PhosphorComp size={size} color={color} weight={weight} {...rest} />;
		}
	}

	// Final fallback to existing icon implementation
	return <RNIcon name={String(name)} size={size} color={color} {...rest} />;
};

export default Icon;
