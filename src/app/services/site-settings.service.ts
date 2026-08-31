import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { SiteSettings } from '../library/site-settings.models';

const _StorageKey = 'application-site-settings';

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
      admin: this._HttpClient.get<SiteSettings['admin']>('assets/settings/admin.settings.json'),
      navigation: this._HttpClient.get<SiteSettings['navigation']>('assets/settings/navigation.settings.json'),
      about: this._HttpClient.get<SiteSettings['about']>('assets/settings/about.settings.json'),
      pricing: this._HttpClient.get<SiteSettings['pricing']>('assets/settings/pricing.settings.json'),
      contact: this._HttpClient.get<SiteSettings['contact']>('assets/settings/contact.settings.json'),
    }).subscribe((_Settings) => this._Settings.set(this.CreatePageLoadSettings(this.GetSavedSettings() ?? _Settings)));
  }

  public ApplySettings(p_Settings: SiteSettings): void {
    this._Settings.set(p_Settings);
  }

  public SaveSettings(p_Settings: SiteSettings): void {
    localStorage.setItem(_StorageKey, JSON.stringify(p_Settings));
    this._Settings.set(p_Settings);
  }

  private CreatePageLoadSettings(p_Settings: SiteSettings): SiteSettings {
    const _PageLoadItem = {
      id: `application-admin-page-load-setting-${Date.now()}`,
      label: 'New setting item for this page load',
      enabled: true,
    };

    return {
      ...p_Settings,
      admin: {
        ...p_Settings.admin,
        pageLoadItems: [_PageLoadItem],
      },
    };
  }

  private GetSavedSettings(): SiteSettings | null {
    const _SavedSettings = localStorage.getItem(_StorageKey);
    return _SavedSettings ? JSON.parse(_SavedSettings) as SiteSettings : null;
  }
}