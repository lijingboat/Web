import { Component, input } from '@angular/core';
import { SiteSettings } from '../../library/site-settings.models';

@Component({
  selector: 'app-content-layout-preview',
  standalone: true,
  templateUrl: './content-layout-preview.component.html',
})
export class ContentLayoutPreviewComponent {
  public readonly Settings = input.required<SiteSettings>();
}