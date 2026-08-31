import { Component, input, signal } from '@angular/core';
import { NavigationSettings } from '../../library/site-settings.models';

@Component({
  selector: 'app-navigation',
  standalone: true,
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  public readonly Settings = input.required<NavigationSettings>();

  protected readonly _IsMenuOpen = signal(false);

  protected ToggleMenu(): void {
    this._IsMenuOpen.update((_Open) => !_Open);
  }

  protected CloseMenu(): void {
    this._IsMenuOpen.set(false);
  }
}