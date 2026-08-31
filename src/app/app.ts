import { Component, inject } from '@angular/core';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { SiteSettingsService } from './services/site-settings.service';

@Component({
  imports: [NavigationComponent, AboutComponent, PricingComponent, ContactComponent],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly SiteSettingsService = inject(SiteSettingsService);
}
