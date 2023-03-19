import { expect } from '@jest/globals';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { delay } from 'rxjs/operators';
import { AddressValidator } from '../../../../apps/eternal/src/app/shared/address-validator';
import { AddressLookuper } from '../../../../apps/eternal/src/app/shared/address-lookuper.service';
import * as diObject from '../../../../apps/eternal/src/app/shared/di';

describe('Address Lookuper', () => {
  const setupWithDI = (httpClient: unknown, validator: unknown) =>
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClient },
        { provide: AddressValidator, useValue: validator }
      ]
    }).inject(AddressLookuper);

  const injectSpy = jest.spyOn(diObject, 'di');

  afterAll(() => {
    injectSpy.mockRestore();
  });

  beforeEach(() => {
    injectSpy.mockReset();
  });

  const setup = (httpClient: unknown, validator: unknown) => {
    injectSpy.mockImplementation((providerToken: unknown) => {
      if (providerToken === HttpClient) {
        return httpClient;
      } else {
        return validator;
      }
    });
    return new AddressLookuper();
  };

  for (const { query, expected, response } of [
    { query: 'Domgasse 5', response: ['Domgasse 5'], expected: true },
    { query: 'Domgasse 15', response: [], expected: false }
  ]) {
    it(`should return ${expected} for ${query}`, async () => {
      const httpClient = {
        get: () => of(response).pipe(delay(0))
      };

      const validator: AddressValidator = { isValid: () => true };
      const lookuper = setup(httpClient, validator);

      const isValid = await firstValueFrom(lookuper.lookup(query));
      expect(isValid).toBe(expected);
    });
  }
});
