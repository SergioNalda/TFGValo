import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/auth.interceptor';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';  // Asegúrate de importar RouterModule

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    importProvidersFrom(RouterModule),  // Asegúrate de importar RouterModule aquí
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ]
});
