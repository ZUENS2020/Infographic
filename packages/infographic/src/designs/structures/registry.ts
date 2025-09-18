import { ListColumn } from './list-column';
import type { Structure } from './types';

const STRUCTURE_REGISTRY = new Map<string, Structure>();

export function registerStructure(type: string, structure: Structure) {
  STRUCTURE_REGISTRY.set(type, structure);
}

export function getStructure(type: string): Structure | undefined {
  return STRUCTURE_REGISTRY.get(type);
}

registerStructure('list-column', { component: ListColumn });
