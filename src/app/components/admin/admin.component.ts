import { Component, effect, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountRole, IdentityProvider, PasswordRecoveryChallenge } from '../../library/account-access.models';
import { SiteSettings } from '../../library/site-settings.models';
import { AccountAccessPrototypeService } from '../../services/account-access-prototype.service';
import { SiteSettingsService } from '../../services/site-settings.service';

@Component({
  selector: 'app-admin',
  imports: [DatePipe, FormsModule],
  standalone: true,
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  protected readonly _DraftSettings = signal<SiteSettings | null>(null);
  protected _AccountName = '';
  protected _AccountRole: AccountRole = 'User';
  protected _RecoveryEmail = '';
  protected _RecoveryCode = '';
  protected _RecoveryChallenge = signal<PasswordRecoveryChallenge | null>(null);
  protected _AccountMessage = signal<string | null>(null);
  protected _AccountError = signal<string | null>(null);
  protected _RecoveryMessage = signal<string | null>(null);
  protected _RecoveryError = signal<string | null>(null);

  public constructor(
    protected readonly SiteSettingsService: SiteSettingsService,
    private readonly AccountAccessService: AccountAccessPrototypeService,
  ) {
    effect(() => this._DraftSettings.set(this.CloneSettings(this.SiteSettingsService.Settings())));
  }

  protected CreateAccount(): void {
    this._AccountMessage.set(null);
    this._AccountError.set(null);
    this.AccountAccessService.CreateAccount({ accountName: this._AccountName, role: this._AccountRole }).subscribe({
      next: (_Account) => this._AccountMessage.set(`Account created for ${_Account.accountName} with the ${_Account.role} role.`),
      error: (_Error: Error) => this._AccountError.set(_Error.message),
    });
  }

  protected StartPasswordRecovery(): void {
    this._RecoveryMessage.set(null);
    this._RecoveryError.set(null);
    this.AccountAccessService.StartPasswordRecovery({ email: this._RecoveryEmail }).subscribe({
      next: (_Challenge) => {
        this._RecoveryChallenge.set(_Challenge);
        this._RecoveryMessage.set('A six-digit verification code is ready for this prototype and expires in two hours.');
      },
      error: (_Error: Error) => this._RecoveryError.set(_Error.message),
    });
  }

  protected VerifyPasswordRecoveryCode(): void {
    const _Challenge = this._RecoveryChallenge();
    if (!_Challenge) {
      this._RecoveryError.set('Request a verification code before attempting recovery.');
      return;
    }

    this.AccountAccessService.VerifyPasswordRecoveryCode(_Challenge.email, this._RecoveryCode).subscribe((_IsValid) => {
      this._RecoveryError.set(_IsValid ? null : 'The verification code is invalid or has expired.');
      this._RecoveryMessage.set(_IsValid ? 'Verification accepted. A password-reset flow can now be connected to an API.' : null);
    });
  }

  protected RegisterWithProvider(p_Provider: IdentityProvider): void {
    this._AccountError.set(null);
    this.AccountAccessService.RegisterWithProvider(p_Provider).subscribe((_Message) => this._AccountMessage.set(_Message));
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
}