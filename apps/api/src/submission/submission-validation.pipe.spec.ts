import { BadRequestException } from '@nestjs/common';
import { SubmissionValidationPipe } from './submission-validation.pipe';
import { buildArticleSubmissionRequest } from './submission.test-fixtures';

describe('SubmissionValidationPipe', () => {
  const pipe = new SubmissionValidationPipe();

  it('returns validated article submissions', () => {
    const req = buildArticleSubmissionRequest();

    expect(pipe.transform(req)).toEqual(req);
  });

  it('throws BadRequestException for invalid payloads', () => {
    const req = buildArticleSubmissionRequest({
      payload: {
        title: '   ',
      },
    });

    try {
      pipe.transform(req);
      fail('Expected transform to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toEqual({
        errors: [
          {
            type: 'field',
            field: 'payload.title',
            message: 'Title is required',
          },
        ],
      });
    }
  });

  it('throws BadRequestException for invalid resource-link URLs', () => {
    const req = buildArticleSubmissionRequest({
      payload: {
        resourceLinks: ['example.org/source'],
      },
    });

    try {
      pipe.transform(req);
      fail('Expected transform to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toEqual({
        errors: [
          {
            type: 'field',
            field: 'payload.resourceLinks[0]',
            message: 'Resource link must be a valid URL',
          },
        ],
      });
    }
  });
});
