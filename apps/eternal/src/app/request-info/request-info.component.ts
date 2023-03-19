import { Component, inject, Input, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AddressLookuper } from '../shared/address-lookuper.service';

@Component({
  selector: 'eternal-request-info',
  templateUrl: './request-info.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    NgIf,
    AsyncPipe
  ]
})
export class RequestInfoComponent implements OnInit {
  #lookuper = inject(AddressLookuper);
  #formBuilder = inject(NonNullableFormBuilder);

  formGroup = this.#formBuilder.group({
    address: ['']
  });
  @Input() address = '';

  submitter$ = new Subject<void>();
  lookupResult$: Observable<string> | undefined;

  ngOnInit(): void {
    if (this.address) {
      this.formGroup.setValue({ address: this.address });
    }

    this.lookupResult$ = this.submitter$.pipe(
      switchMap(() => {
        const { address } = this.formGroup.getRawValue();
        return this.#lookuper.lookup(address);
      }),
      map((found) => (found ? 'Brochure sent' : 'Address not found'))
    );
  }

  search(): void {
    this.submitter$.next();
  }
}
