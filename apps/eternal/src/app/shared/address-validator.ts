import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AddressValidator {
  isValid(value: string): boolean {
    const shortPattern = /^([\w\s]+)\s(\d+)$/;
    const longPattern = /^([\w\s]+)\s(\d+),\s(\d+)\s([\w\s]+)$/;
    let match: string[] | null = value.match(shortPattern);

    if (match) {
      return true;
    } else {
      match = value.match(longPattern);
      if (match) {
        return true;
      }
    }

    return false;
  }
}
