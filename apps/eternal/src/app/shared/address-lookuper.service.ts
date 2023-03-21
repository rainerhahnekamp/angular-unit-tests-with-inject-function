import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddressValidator } from './address-validator';
import { di } from './di';

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  httpClient = di(HttpClient);
  addressValidator = di(AddressValidator);

  #counter = 0;

  get counter() {
    return this.#counter;
  }

  lookup(query: string): Observable<boolean> {
    if (!this.addressValidator.isValid(query)) {
      throw new Error('Address is not in the required format.');
    }
    this.#counter++;

    return this.httpClient
      .get<string[]>('https://nominatim.openstreetmap.org/search.php', {
        params: new HttpParams().set('format', 'jsonv2').set('q', query)
      })
      .pipe(map((addresses) => addresses.length > 0));
  }
}
