import { Component, inject } from '@angular/core';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { PricingComponent } from '../pricing/pricing.component';
import { SiteSettingsService } from '../../services/site-settings.service';

@Component({
  selector: 'app-public-page',
  imports: [NavigationComponent, AboutComponent, PricingComponent, ContactComponent],
  standalone: true,
  templateUrl: './public-page.component.html',
})
export class PublicPageComponent {
  protected readonly SiteSettingsService = inject(SiteSettingsService);
}