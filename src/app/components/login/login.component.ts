import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DraftAuthService } from '../../services/draft-auth.service';
import { SsoDialogComponent } from '../sso-dialog/sso-dialog.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, SsoDialogComponent],
  standalone: true,
  templateUrl: './login.component.html',
})
export class LoginComponent {
  protected _Username = '';
  protected _Password = '';
  protected readonly _ErrorMessage = signal<string | null>(null);
  protected readonly _IsSsoDialogOpen = signal(false);

  public constructor(
    private readonly AuthService: DraftAuthService,
    private readonly Router: Router,
  ) {}

  protected SignIn(): void {
    const _IsSignedIn = this.AuthService.SignIn(this._Username, this._Password);
    this._ErrorMessage.set(_IsSignedIn ? null : 'Enter one of the configured draft username and password pairs.');
    if (_IsSignedIn) {
      void this.Router.navigateByUrl('/admin');
    }
  }

  protected OpenSsoDialog(): void {
    this._IsSsoDialogOpen.set(true);
  }

  protected CloseSsoDialog(): void {
    this._IsSsoDialogOpen.set(false);
  }
}