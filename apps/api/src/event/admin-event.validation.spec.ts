import { BadRequestException } from '@nestjs/common';
import { validateAdminEventRequest } from './admin-event.validation';

describe('validateAdminEventRequest', () => {
  it('accepts a valid request', () => {
    expect(
      validateAdminEventRequest({
        title: 'Town Hall',
        summary: 'Summary',
        description: 'Description',
        eventType: 'RALLY',
        startTime: '2026-01-01T12:00:00.000Z',
        endTime: null,
        locationName: 'City Hall',
        publicLocationDescription: null,
        addressLine1: null,
        addressLine2: null,
        city: 'Boston',
        region: 'MA',
        country: 'USA',
        postalCode: '02108',
        website: 'https://example.org/event',
        topicSlugs: ['democracy'],
        status: 'DRAFT',
      }),
    ).toEqual(
      expect.objectContaining({
        title: 'Town Hall',
        website: 'https://example.org/event',
      }),
    );
  });

  it('rejects invalid requests with structured errors', () => {
    expect(() =>
      validateAdminEventRequest({
        title: '',
        summary: '',
        description: '',
        eventType: 'RALLY',
        startTime: 'invalid',
        locationName: '',
        city: '',
        region: '',
        country: '',
        postalCode: '',
        topicSlugs: [],
        status: 'DRAFT',
      }),
    ).toThrow(BadRequestException);
  });
});
