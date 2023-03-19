import { enableProdMode, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimations } from '@angular/platform-browser/animations';
import localeDe from '@angular/common/locales/de-AT';
import { registerLocaleData } from '@angular/common';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { deAT } from 'date-fns/locale';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeDe, 'de-AT');

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter([]),
    importProvidersFrom([MatDateFnsModule]),
    {
      provide: MAT_DATE_LOCALE,
      useValue: deAT
    },

    { provide: LOCALE_ID, useValue: 'de-AT' },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    }
  ]
});
