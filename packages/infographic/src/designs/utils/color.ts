import type { ParsedInfographicOptions } from '../../options';

export function getColorPrimary(options: ParsedInfographicOptions) {
  return options?.themeConfig?.colorPrimary || '#1890FF';
}
