import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { SiteSettings } from '../library/site-settings.models';

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  private readonly _HttpClient = inject(HttpClient);
  protected readonly _Settings = signal<SiteSettings | null>(null);
  public readonly Settings = this._Settings.asReadonly();

  public constructor() {
    this.LoadSettings();
  }

  private LoadSettings(): void {
    forkJoin({
      general: this._HttpClient.get<SiteSettings['general']>('assets/settings/general.settings.json'),
      navigation: this._HttpClient.get<SiteSettings['navigation']>('assets/settings/navigation.settings.json'),
      about: this._HttpClient.get<SiteSettings['about']>('assets/settings/about.settings.json'),
      pricing: this._HttpClient.get<SiteSettings['pricing']>('assets/settings/pricing.settings.json'),
      contact: this._HttpClient.get<SiteSettings['contact']>('assets/settings/contact.settings.json'),
    }).subscribe((_Settings) => this._Settings.set(_Settings));
  }
}