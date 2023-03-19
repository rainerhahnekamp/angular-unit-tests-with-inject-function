import { inject, InjectFlags, InjectOptions, ProviderToken } from '@angular/core';

const mocks = new Map<ProviderToken<unknown>, unknown>();
export function mockDi(providerToken: ProviderToken<unknown>, value: unknown) {
  mocks.set(providerToken, value);
}
export function clearMock() {
  mocks.clear();
}

export function di<T>(token: ProviderToken<T>): T;
export function di<T>(
  token: ProviderToken<T>,
  options: InjectOptions & {
    optional?: false;
  }
): T;
export function di<T>(token: ProviderToken<T>, options: InjectOptions): T | null;
export function di<T>(providerToken: ProviderToken<T>, options: InjectOptions = {}): T | null {
  if (mocks.has(providerToken)) {
    return mocks.get(providerToken) as T;
  }
  return inject(providerToken, options);
}
