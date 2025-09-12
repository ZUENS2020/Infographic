import { describe, it, expect } from 'vitest';
import { createDefaultContext } from '../../../src/utils/context';

describe('context utils', () => {
  describe('createDefaultContext', () => {
    it('should return a default RenderContext with empty defs array', () => {
      const context = createDefaultContext();
      
      expect(context).toEqual({
        defs: [],
      });
    });

    it('should return a new object on each call', () => {
      const context1 = createDefaultContext();
      const context2 = createDefaultContext();
      
      expect(context1).toEqual(context2);
      expect(context1).not.toBe(context2);
      expect(context1.defs).not.toBe(context2.defs);
    });

    it('should return an object with defs as an empty array', () => {
      const context = createDefaultContext();
      
      expect(Array.isArray(context.defs)).toBe(true);
      expect(context.defs.length).toBe(0);
    });

    it('should allow modification of the returned context without affecting future calls', () => {
      const context1 = createDefaultContext();
      context1.defs.push('test' as any);
      
      const context2 = createDefaultContext();
      
      expect(context1.defs).toEqual(['test']);
      expect(context2.defs).toEqual([]);
    });

    it('should have the expected structure', () => {
      const context = createDefaultContext();
      
      expect(context).toHaveProperty('defs');
      expect(Object.keys(context)).toEqual(['defs']);
    });
  });
});