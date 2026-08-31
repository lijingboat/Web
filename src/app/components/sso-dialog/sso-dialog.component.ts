import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-sso-dialog',
  standalone: true,
  templateUrl: './sso-dialog.component.html',
})
export class SsoDialogComponent {
  public readonly IsOpen = input.required<boolean>();
  public readonly Close = output<void>();

  protected CloseDialog(): void {
    this.Close.emit();
  }
}