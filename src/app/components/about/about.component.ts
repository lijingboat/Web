import { Component, input } from '@angular/core';
import { SectionSettings } from '../../library/site-settings.models';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
})
export class AboutComponent {
  public readonly Settings = input.required<SectionSettings>();
}