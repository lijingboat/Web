import { Component, input } from '@angular/core';
import { SectionSettings } from '../../library/site-settings.models';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  public readonly Settings = input.required<SectionSettings>();
}