import { BadRequestException } from '@nestjs/common';
import {
  OptionalEntityStatusQueryPipe,
  OptionalSubmissionTypeQueryPipe,
  SubmissionStatusQueryPipe,
} from './admin-query-validation.pipe';

describe('admin query validation pipes', () => {
  describe('OptionalEntityStatusQueryPipe', () => {
    const pipe = new OptionalEntityStatusQueryPipe();

    it('returns null when the query is missing', () => {
      expect(pipe.transform(undefined)).toBeNull();
    });

    it('returns a valid entity status', () => {
      expect(pipe.transform('PUBLISHED')).toBe('PUBLISHED');
      expect(pipe.transform('DRAFT')).toBe('DRAFT');
    });

    it('rejects invalid values', () => {
      expect(() => pipe.transform('ARCHIVED')).toThrow(BadRequestException);
    });
  });

  describe('SubmissionStatusQueryPipe', () => {
    const pipe = new SubmissionStatusQueryPipe();

    it('defaults to pending when the query is missing', () => {
      expect(pipe.transform(undefined)).toBe('PENDING');
    });

    it('returns a valid submission status', () => {
      expect(pipe.transform('APPROVED')).toBe('APPROVED');
      expect(pipe.transform('REJECTED')).toBe('REJECTED');
    });

    it('rejects invalid values', () => {
      expect(() => pipe.transform('DRAFT')).toThrow(BadRequestException);
    });
  });

  describe('OptionalSubmissionTypeQueryPipe', () => {
    const pipe = new OptionalSubmissionTypeQueryPipe();

    it('returns undefined when the query is missing', () => {
      expect(pipe.transform(undefined)).toBeUndefined();
    });

    it('returns a valid submission type', () => {
      expect(pipe.transform('ARTICLE')).toBe('ARTICLE');
      expect(pipe.transform('EVENT')).toBe('EVENT');
    });

    it('rejects invalid values', () => {
      expect(() => pipe.transform('ACTION')).toThrow(BadRequestException);
    });
  });
});
