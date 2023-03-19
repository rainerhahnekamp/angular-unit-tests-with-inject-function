import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'eternal-home',
  template: `<h2 data-testid="greeting">Welcome to Eternal</h2>
    <p data-testid="txt-greeting-1">
      Eternal is an imaginary travel agency and is used as training application for Angular
      developers.
    </p>
    <p data-testid="txt-greeting-2">
      You can click around, do whatever you want but don't expect to be able to book a real holiday
      😉.
    </p>`,
  standalone: true,
  imports: [ReactiveFormsModule, MatSlideToggleModule]
})
export class HomeComponent {}
