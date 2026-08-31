import { Component, input } from '@angular/core';
import { SectionSettings } from '../../library/site-settings.models';

@Component({
  selector: 'app-pricing',
  standalone: true,
  templateUrl: './pricing.component.html',
})
export class PricingComponent {
  public readonly Settings = input.required<SectionSettings>();
}