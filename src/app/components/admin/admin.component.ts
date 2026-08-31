import { Component, effect, signal } from '@angular/core';
import { ContentLayoutItem, SiteSettings } from '../../library/site-settings.models';
import { DraftAuthService } from '../../services/draft-auth.service';
import { SiteSettingsService } from '../../services/site-settings.service';
import { ContentLayoutPreviewComponent } from '../content-layout-preview/content-layout-preview.component';

@Component({
  selector: 'app-admin',
  imports: [ContentLayoutPreviewComponent],
  standalone: true,
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  protected readonly _DraftSettings = signal<SiteSettings | null>(null);

  public constructor(
    protected readonly SiteSettingsService: SiteSettingsService,
    protected readonly DraftAuthService: DraftAuthService,
  ) {
    effect(() => this._DraftSettings.set(this.CloneSettings(this.SiteSettingsService.Settings())));
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
  }

  private CloneSettings(p_Settings: SiteSettings | null): SiteSettings | null {
    return p_Settings ? structuredClone(p_Settings) : null;
  }

  private UpdateLayout(p_Settings: SiteSettings, p_ContentLayout: ContentLayoutItem[]): void {
    this._DraftSettings.set({
      ...p_Settings,
      admin: {
        ...p_Settings.admin,
        contentLayout: p_ContentLayout,
      },
    });
  }
}