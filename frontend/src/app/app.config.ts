import { type ApplicationConfig, provideZoneChangeDetection } from "@angular/core"
import { provideRouter } from "@angular/router"
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async"
import { providePrimeNG } from "primeng/config"
import Aura from "@primeng/themes/aura"
import { MessageService } from "primeng/api"

import { routes } from "./app.routes"
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http"
import { provideAnimations } from "@angular/platform-browser/animations"
import { credentialsInterceptor } from "./interceptors/credentials.interceptor" 

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([credentialsInterceptor])),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideAnimations(),
  ],
}

