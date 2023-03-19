import { AddressLookuper } from './address-lookuper.service';
import { expect } from '@jest/globals';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { waitForAsync } from '@angular/core/testing';
import { delay } from 'rxjs/operators';
import { AddressValidator } from './address-validator';

describe('Address Lookuper', () => {
  for (const { query, expected, response } of [
    { query: 'Domgasse 5', response: ['Domgasse 5'], expected: true },
    { query: 'Domgasse 15', response: [], expected: false }
  ]) {
    it(`should return ${expected} for ${query}`, async () => {
      const httpClient = {
        get: () => of(response).pipe(delay(0))
      };

      const validator: AddressValidator = { isValid: () => true };
      const lookuper = new AddressLookuper(httpClient as unknown as HttpClient, validator);

      const isValid = await firstValueFrom(lookuper.lookup(query));
      expect(isValid).toBe(expected);
    });
  }

  it('should call nominatim with right parameters', waitForAsync(() => {
    const httpClient = { get: jest.fn(() => of([])) };
    const validator: AddressValidator = { isValid: () => true };

    const lookuper = new AddressLookuper(httpClient as unknown as HttpClient, validator);

    lookuper.lookup('Domgasse 5');

    expect(httpClient.get).toHaveBeenCalledWith('https://nominatim.openstreetmap.org/search.php', {
      params: new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5')
    });
  }));

  it('should throw an error on an invalid address', () => {
    const validator: AddressValidator = { isValid: () => false };

    const lookuper = new AddressLookuper(null as unknown as HttpClient, validator);

    expect(() => lookuper.lookup('invalid address')).toThrow(
      'Address is not in the required format.'
    );
  });

  it('should count the lookups', () => {
    const httpClient = { get: jest.fn(() => of([])) };
    const validator: AddressValidator = { isValid: () => true };

    const lookuper = new AddressLookuper(httpClient as unknown as HttpClient, validator);

    lookuper.lookup('Domgasse 5');
    lookuper.lookup('Domgasse 6');
    lookuper.lookup('Domgasse 7');

    expect(lookuper.counter).toBe(3);
  });
});
