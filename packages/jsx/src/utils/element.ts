import { JSXElement, JSXNode, RenderableNode } from '../types';
import { isJSXElement } from './is-jsx-element';

export function nodeToElements(node: JSXNode): JSXElement[] {
  return nodeToRenderableNodes(node).filter(isJSXElement);
}

export function nodeToRenderableNodes(
  node: JSXNode,
  result: RenderableNode[] = [],
): RenderableNode[] {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return result;
  }

  if (Array.isArray(node)) {
    node.forEach((child) => nodeToRenderableNodes(child, result));
  } else {
    if (typeof node === 'object') result.push(node);
    else result.push(node);
  }
  return result;
}
