import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { delay } from 'rxjs/operators';
import { AddressValidator } from '../../../../apps/eternal/src/app/shared/address-validator';
import { AddressLookuper } from '../../../../apps/eternal/src/app/shared/address-lookuper.service';
import { clearMock, mockDi } from '../../../../apps/eternal/src/app/shared/di';

describe('Address Lookuper', () => {
  const setupWithDI = (httpClient: unknown, validator: unknown) =>
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClient },
        { provide: AddressValidator, useValue: validator }
      ]
    }).inject(AddressLookuper);

  beforeEach(() => {
    clearMock();
  });

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

  it('should call nominatim with right parameters', waitForAsync(() => {
    const httpClient = { get: jasmine.createSpy() };
    httpClient.get.and.returnValue(of([]));
    const validator: AddressValidator = { isValid: () => true };

    const lookuper = setup(httpClient, validator);

    lookuper.lookup('Domgasse 5');

    expect(httpClient.get).toHaveBeenCalledWith('https://nominatim.openstreetmap.org/search.php', {
      params: new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5')
    });
  }));

  it('should throw an error on an invalid address', () => {
    const validator: AddressValidator = { isValid: () => false };

    const lookuper = setup(null, validator);

    expect(() => lookuper.lookup('invalid address')).toThrowError(
      'Address is not in the required format.'
    );
  });

  it('should count the lookups', () => {
    const httpClient = { get: jasmine.createSpy() };
    httpClient.get.and.returnValue(of());
    const validator: AddressValidator = { isValid: () => true };

    const lookuper = setup(httpClient, validator);

    lookuper.lookup('Domgasse 5');
    lookuper.lookup('Domgasse 6');
    lookuper.lookup('Domgasse 7');

    expect(lookuper.counter).toBe(3);
  });
});
