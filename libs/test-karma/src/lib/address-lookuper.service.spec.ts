import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { waitForAsync } from '@angular/core/testing';
import { delay } from 'rxjs/operators';
import { AddressValidator } from '../../../../apps/eternal/src/app/shared/address-validator';
import { AddressLookuper } from '../../../../apps/eternal/src/app/shared/address-lookuper.service';
import * as diObject from '../../../../apps/eternal/src/app/shared/di';
import { mockDi } from '../../../../apps/eternal/src/app/shared/di';
// import * as angularCore from '@angular/core';

describe('Address Lookuper', () => {
  // const injectSpy = spyOnProperty(diObject, 'di', 'get');

  const setup = (httpClient: unknown, validator: unknown) => {
    mockDi(HttpClient, httpClient);
    mockDi(AddressValidator, validator);
    return new AddressLookuper();
  };

  for (const { query, expected, response } of [
    { query: 'Domgasse 5', response: ['Domgasse 5'], expected: true },
    { query: 'Domgasse 15', response: [], expected: false }
  ]) {
    it(`should return ${expected} for ${query}`, async () => {
      const httpClient = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
      httpClient.get.and.returnValue(of(response).pipe(delay(0)));

      const validator: AddressValidator = { isValid: () => true };
      const lookuper = setup(httpClient, validator);

      const isValid = await firstValueFrom(lookuper.lookup(query));
      expect(isValid).toBe(expected);
    });
  }
});
