import { ComponentType } from '@antv/infographic-jsx';
import type { Data } from '../../types';

export interface BaseItemProps {
  id?: string;
  indexKey: string;
  datum: Data['items'][number];
  x?: number;
  y?: number;
  positionH?: 'normal' | 'flipped' | 'center';
  positionV?: 'normal' | 'flipped' | 'center';
  [key: string]: any;
}

export interface ItemOptions {
  coloredArea?: ('icon' | 'label' | 'desc' | 'value')[];
  [key: string]: any;
}

export interface Item<T extends BaseItemProps = BaseItemProps> {
  component: ComponentType<T>;
  options?: ItemOptions;
}
