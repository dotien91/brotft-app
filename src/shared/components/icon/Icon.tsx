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

const toPascalCase = (name: string) => {
	if (!name) return '';
	return name
		.replace(/[-_]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
		.replace(/^(.)/, (m) => m.toUpperCase());
};

type IconProps = React.ComponentProps<typeof RNIcon> & {
	weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
};

const Icon: React.FC<IconProps> = ({name, size = 20, color = '#000', weight = 'regular', ...rest}) => {
	// If Phosphor is available, try to render a matching icon by name.
	if (Phosphor) {
		// Convert common icon names to PascalCase export names
		const pascal = toPascalCase(String(name || ''));
		const PhosphorComp = (Phosphor && Phosphor[pascal]) || null;
		if (PhosphorComp) {
			// phosphor icons accept size, color, weight props
			return <PhosphorComp size={size} color={color} weight={weight} {...rest} />;
		}
		// Fallback: try using 'ChartLine' style generic or return nothing
	}

	// Final fallback to existing icon implementation
	return <RNIcon name={String(name)} size={size} color={color} {...rest} />;
};

export default Icon;
