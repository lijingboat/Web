import { Component, input } from '@angular/core';
import { NavigationSettings } from '../../library/site-settings.models';

@Component({
  selector: 'app-navigation',
  standalone: true,
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  public readonly Settings = input.required<NavigationSettings>();
}