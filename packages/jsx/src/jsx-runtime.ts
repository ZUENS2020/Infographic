import type { FragmentProps, JSXElement } from './types';

export const Fragment = Symbol('Fragment');

export function jsx(
  type: string | Function | Symbol,
  props: any = {},
): JSXElement {
  return { type, props, key: props.key || null };
}

export function createFragment(props: FragmentProps = {}): JSXElement {
  return jsx(Fragment, props);
}

export const jsxs = jsx;
export const jsxDEV = jsx;
