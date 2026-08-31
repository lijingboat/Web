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
    }).subscribe((_Settings) => this._Settings.set(this.MergeSavedSettings(_Settings, this.GetSavedSettings())));
  }

  public ApplySettings(p_Settings: SiteSettings): void {
    this._Settings.set(p_Settings);
  }

  public SaveSettings(p_Settings: SiteSettings): void {
    localStorage.setItem(_StorageKey, JSON.stringify(p_Settings));
    this._Settings.set(p_Settings);
  }

  private GetSavedSettings(): SiteSettings | null {
    const _SavedSettings = localStorage.getItem(_StorageKey);
    return _SavedSettings ? JSON.parse(_SavedSettings) as SiteSettings : null;
  }

  private MergeSavedSettings(p_DefaultSettings: SiteSettings, p_SavedSettings: SiteSettings | null): SiteSettings {
    if (!p_SavedSettings) {
      return p_DefaultSettings;
    }

    return {
      ...p_DefaultSettings,
      ...p_SavedSettings,
      general: { ...p_DefaultSettings.general, ...p_SavedSettings.general, style: { ...p_DefaultSettings.general.style, ...p_SavedSettings.general?.style } },
      about: { ...p_DefaultSettings.about, ...p_SavedSettings.about, style: { ...p_DefaultSettings.about.style, ...p_SavedSettings.about?.style } },
      pricing: { ...p_DefaultSettings.pricing, ...p_SavedSettings.pricing, style: { ...p_DefaultSettings.pricing.style, ...p_SavedSettings.pricing?.style } },
      contact: { ...p_DefaultSettings.contact, ...p_SavedSettings.contact, style: { ...p_DefaultSettings.contact.style, ...p_SavedSettings.contact?.style } },
      admin: {
        ...p_DefaultSettings.admin,
        ...p_SavedSettings.admin,
        contentLayout: p_SavedSettings.admin?.contentLayout ?? p_DefaultSettings.admin.contentLayout,
      },
    };
  }
}