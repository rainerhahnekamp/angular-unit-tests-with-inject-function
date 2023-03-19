import { inject, ProviderToken } from '@angular/core';

export const di = <T>(providerToken: ProviderToken<T>): T => {
  return inject(providerToken);
};
