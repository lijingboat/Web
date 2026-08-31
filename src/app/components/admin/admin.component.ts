import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateContentLayoutHtml, ParseContentLayoutHtml } from '../../library/content-layout-html.library';
import { DraftUserRole } from '../../library/draft-auth.models';
import { ContentLayoutItem, ContentSectionId, SectionStyleSettings, SiteSettings } from '../../library/site-settings.models';
import { DraftAuthService } from '../../services/draft-auth.service';
import { SiteSettingsService } from '../../services/site-settings.service';
import { ContentLayoutPreviewComponent } from '../content-layout-preview/content-layout-preview.component';

@Component({
  selector: 'app-admin',
  imports: [ContentLayoutPreviewComponent, FormsModule],
  standalone: true,
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  protected readonly _DraftSettings = signal<SiteSettings | null>(null);
  protected _LayoutHtml = '';
  protected readonly _LayoutHtmlError = signal<string | null>(null);
  protected _ManagedUsername = '';
  protected _ManagedPassword = '';
  protected _ManagedRole: DraftUserRole = 'user';
  protected readonly _UserManagementMessage = signal<string | null>(null);

  public constructor(
    protected readonly SiteSettingsService: SiteSettingsService,
    protected readonly DraftAuthService: DraftAuthService,
  ) {
    effect(() => {
      const _Settings = this.SiteSettingsService.Settings();
      this._DraftSettings.set(this.CloneSettings(_Settings));
      this._LayoutHtml = _Settings ? CreateContentLayoutHtml(_Settings) : '';
      this._LayoutHtmlError.set(null);
    });
  }

  protected MoveLayoutItem(p_Index: number, p_Direction: number): void {
    const _Settings = this._DraftSettings();
    const _TargetIndex = p_Index + p_Direction;
    if (!_Settings || _TargetIndex < 0 || _TargetIndex >= _Settings.admin.contentLayout.length) {
      return;
    }

    const _ContentLayout = [..._Settings.admin.contentLayout];
    const _CurrentItem = _ContentLayout[p_Index];
    _ContentLayout[p_Index] = _ContentLayout[_TargetIndex];
    _ContentLayout[_TargetIndex] = _CurrentItem;
    this.UpdateLayout(_Settings, _ContentLayout);
  }

  protected ToggleLayoutItem(p_Index: number): void {
    const _Settings = this._DraftSettings();
    if (!_Settings) {
      return;
    }

    const _ContentLayout = _Settings.admin.contentLayout.map((_Item, _ItemIndex) => _ItemIndex === p_Index
      ? { ..._Item, enabled: !_Item.enabled }
      : _Item);
    this.UpdateLayout(_Settings, _ContentLayout);
  }

  protected ReorderLayoutItems(p_SourceIndex: number, p_TargetIndex: number): void {
    const _Settings = this._DraftSettings();
    if (!_Settings || p_SourceIndex === p_TargetIndex) {
      return;
    }

    const _ContentLayout = [..._Settings.admin.contentLayout];
    const [_DraggedItem] = _ContentLayout.splice(p_SourceIndex, 1);
    _ContentLayout.splice(p_TargetIndex, 0, _DraggedItem);
    this.UpdateLayout(_Settings, _ContentLayout);
  }

  protected SignOut(): void {
    this.DraftAuthService.SignOut();
  }

  protected ApplyHtmlLayout(): void {
    const _Settings = this._DraftSettings();
    if (!_Settings) {
      return;
    }

    const _Result = ParseContentLayoutHtml(this._LayoutHtml, _Settings);
    this._LayoutHtmlError.set(_Result.errorMessage);
    if (_Result.contentLayout && _Result.generalStyle && _Result.sectionStyles) {
      this.UpdateLayout(_Settings, _Result.contentLayout, _Result.sectionStyles, _Result.generalStyle);
    }
  }

  protected SaveManagedUser(): void {
    this._UserManagementMessage.set(this.DraftAuthService.SaveUser({
      username: this._ManagedUsername,
      password: this._ManagedPassword,
      role: this._ManagedRole,
    }));
    if (this._UserManagementMessage() === null) {
      this._UserManagementMessage.set(`Saved ${this._ManagedUsername.trim()}.`);
      this._ManagedUsername = '';
      this._ManagedPassword = '';
      this._ManagedRole = 'user';
    }
  }

  protected EditManagedUser(p_Username: string, p_Password: string, p_Role: DraftUserRole): void {
    this._ManagedUsername = p_Username;
    this._ManagedPassword = p_Password;
    this._ManagedRole = p_Role;
    this._UserManagementMessage.set(null);
  }

  protected RemoveManagedUser(p_Username: string): void {
    const _Message = this.DraftAuthService.RemoveUser(p_Username);
    this._UserManagementMessage.set(_Message ?? `Removed ${p_Username}.`);
  }

  protected Apply(): void {
    const _Settings = this._DraftSettings();
    if (_Settings) {
      this.SiteSettingsService.ApplySettings(_Settings);
    }
  }

  protected Save(): void {
    const _Settings = this._DraftSettings();
    if (_Settings) {
      this.SiteSettingsService.SaveSettings(_Settings);
    }
  }

  protected Cancel(): void {
    this._DraftSettings.set(this.CloneSettings(this.SiteSettingsService.Settings()));
    const _Settings = this._DraftSettings();
    this._LayoutHtml = _Settings ? CreateContentLayoutHtml(_Settings) : '';
    this._LayoutHtmlError.set(null);
  }

  private CloneSettings(p_Settings: SiteSettings | null): SiteSettings | null {
    return p_Settings ? structuredClone(p_Settings) : null;
  }

  private UpdateLayout(
    p_Settings: SiteSettings,
    p_ContentLayout: ContentLayoutItem[],
    p_SectionStyles?: Record<ContentSectionId, SectionStyleSettings>,
    p_GeneralStyle: SectionStyleSettings = p_Settings.general.style,
  ): void {
    const _UpdatedSettings = {
      ...p_Settings,
      general: { ...p_Settings.general, style: p_GeneralStyle },
      about: { ...p_Settings.about, style: p_SectionStyles?.['about'] ?? p_Settings.about.style },
      pricing: { ...p_Settings.pricing, style: p_SectionStyles?.['pricing'] ?? p_Settings.pricing.style },
      contact: { ...p_Settings.contact, style: p_SectionStyles?.['contact'] ?? p_Settings.contact.style },
      admin: {
        ...p_Settings.admin,
        contentLayout: p_ContentLayout,
      },
    };
    this._DraftSettings.set(_UpdatedSettings);
    this._LayoutHtml = CreateContentLayoutHtml(_UpdatedSettings);
    this._LayoutHtmlError.set(null);
  }
}