import { Component, input, output } from '@angular/core';
import { ContentSectionId, SectionStyleSettings, SiteSettings } from '../../library/site-settings.models';

export interface LayoutMoveRequest {
  readonly index: number;
  readonly direction: number;
}

export interface LayoutReorderRequest {
  readonly sourceIndex: number;
  readonly targetIndex: number;
}

@Component({
  selector: 'app-content-layout-preview',
  standalone: true,
  templateUrl: './content-layout-preview.component.html',
})
export class ContentLayoutPreviewComponent {
  public readonly Settings = input.required<SiteSettings>();
  public readonly Toggle = output<number>();
  public readonly Move = output<LayoutMoveRequest>();
  public readonly Reorder = output<LayoutReorderRequest>();
  private _DraggedLayoutIndex: number | null = null;

  protected StartDragging(p_Index: number): void {
    this._DraggedLayoutIndex = p_Index;
  }

  protected DropLayoutItem(p_TargetIndex: number): void {
    const _SourceIndex = this._DraggedLayoutIndex;
    this._DraggedLayoutIndex = null;
    if (_SourceIndex !== null) {
      this.Reorder.emit({ sourceIndex: _SourceIndex, targetIndex: p_TargetIndex });
    }
  }

  protected GetSectionStyle(p_SectionId: string): SectionStyleSettings {
    return this.Settings()[p_SectionId as ContentSectionId].style;
  }
}