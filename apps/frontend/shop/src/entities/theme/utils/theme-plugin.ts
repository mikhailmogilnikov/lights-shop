import { type PluginOptions, tailwindThemePlugin } from '@blur-ui/tailwind-themes';

import { AppThemes } from '../config/themes-config';

const pluginOptions: PluginOptions = {
  removeTailwindColors: true,
};

export default tailwindThemePlugin(AppThemes, pluginOptions);
