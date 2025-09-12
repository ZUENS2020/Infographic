import { describe, it, expect } from 'vitest';
import { isJSXElement } from '../../../src/utils/is-jsx-element';
import type { JSXElement } from '../../../src/types';

describe('is-jsx-element utils', () => {
  describe('isJSXElement', () => {
    it('should return true for valid JSXElement objects', () => {
      const element: JSXElement = {
        type: 'div',
        props: {},
      };
      expect(isJSXElement(element)).toBe(true);
    });

    it('should return true for JSXElement with function type', () => {
      const MockComponent = () => ({ type: 'div', props: {} });
      const element: JSXElement = {
        type: MockComponent,
        props: { someProp: 'value' },
      };
      expect(isJSXElement(element)).toBe(true);
    });

    it('should return true for JSXElement with additional properties', () => {
      const element: JSXElement = {
        type: 'rect',
        props: { x: 10, y: 20, width: 100, height: 50 },
        key: 'unique-key',
      };
      expect(isJSXElement(element)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isJSXElement(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isJSXElement(undefined)).toBe(false);
    });

    it('should return false for strings', () => {
      expect(isJSXElement('Hello World')).toBe(false);
      expect(isJSXElement('')).toBe(false);
    });

    it('should return false for numbers', () => {
      expect(isJSXElement(42)).toBe(false);
      expect(isJSXElement(0)).toBe(false);
      expect(isJSXElement(-1)).toBe(false);
    });

    it('should return false for booleans', () => {
      expect(isJSXElement(true)).toBe(false);
      expect(isJSXElement(false)).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isJSXElement([])).toBe(false);
      expect(isJSXElement([1, 2, 3])).toBe(false);
      expect(isJSXElement([{ type: 'div', props: {} }])).toBe(false);
    });

    it('should return false for objects without type property', () => {
      expect(isJSXElement({})).toBe(false);
      expect(isJSXElement({ props: {} })).toBe(false);
      expect(isJSXElement({ children: [] })).toBe(false);
    });

    it('should return true for objects with type property even if missing props', () => {
      const element = { type: 'div' };
      expect(isJSXElement(element)).toBe(true);
    });

    it('should return false for functions', () => {
      const fn = () => {};
      expect(isJSXElement(fn)).toBe(false);
    });

    it('should return false for dates', () => {
      expect(isJSXElement(new Date())).toBe(false);
    });

    it('should return false for regular expressions', () => {
      expect(isJSXElement(/test/)).toBe(false);
    });

    it('should handle JSXElement with symbol type', () => {
      const symbolType = Symbol('test');
      const element = {
        type: symbolType,
        props: {},
      };
      expect(isJSXElement(element)).toBe(true);
    });

    it('should handle nested objects that are not JSXElements', () => {
      const nestedObject = {
        level1: {
          level2: {
            type: 'div',
            props: {},
          }
        }
      };
      expect(isJSXElement(nestedObject)).toBe(false);
      expect(isJSXElement(nestedObject.level1)).toBe(false);
      expect(isJSXElement(nestedObject.level1.level2)).toBe(true);
    });
  });
});