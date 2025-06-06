import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { SecureApiClientService, KEY_PASSPHRASE} from 'secure-api-client'; // Also import the service if not done already for clarity


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(),
    {
      provide: KEY_PASSPHRASE,
      useValue: "ENCRYPTION_PASSPHRASE"
    }
  ]
};
