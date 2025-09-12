import type { JSXElement, TextProps } from '../types';

export function Text(props: TextProps): JSXElement {
  const { x = 0, y = 0, width = 0, height = 0 } = props;
  const node: JSXElement = {
    type: 'text',
    props: {
      x,
      y,
      width,
      height,
      ...props,
    },
  };
  return node;
}
