import type { JSXElement, PathProps } from '../types';

export function Path(props: PathProps): JSXElement {
  const node: JSXElement = {
    type: 'path',
    props,
  };
  // TODO scale path to fit width/height
  return node;
}
