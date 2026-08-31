import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
  AccountAccessApi,
  AccountCreationRequest,
  AccountRecord,
  IdentityProvider,
  PasswordRecoveryChallenge,
  PasswordRecoveryRequest,
} from '../library/account-access.models';

const _RecoveryCodeLifetimeMilliseconds = 2 * 60 * 60 * 1000;
const _EmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const _PhonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[\s.-]?[0-9\s.-]{6,}$/;

@Injectable({ providedIn: 'root' })
export class AccountAccessPrototypeService extends AccountAccessApi {
  private readonly _Accounts: AccountRecord[] = [];
  private _RecoveryChallenge: PasswordRecoveryChallenge | null = null;

  public CreateAccount(p_Request: AccountCreationRequest): Observable<AccountRecord> {
    const _AccountName = p_Request.accountName.trim();
    if (!this.IsEmailOrPhone(_AccountName)) {
      return throwError(() => new Error('Enter a valid email address or phone number.'));
    }

    const _Account: AccountRecord = {
      id: crypto.randomUUID(),
      accountName: _AccountName,
      role: p_Request.role,
      createdAt: new Date(),
    };
    this._Accounts.push(_Account);
    return of(_Account);
  }

  public StartPasswordRecovery(p_Request: PasswordRecoveryRequest): Observable<PasswordRecoveryChallenge> {
    const _Email = p_Request.email.trim();
    if (!_EmailPattern.test(_Email)) {
      return throwError(() => new Error('Enter a valid email address for password recovery.'));
    }

    this._RecoveryChallenge = {
      email: _Email,
      expiresAt: new Date(Date.now() + _RecoveryCodeLifetimeMilliseconds),
      previewCode: this.CreateRecoveryCode(),
    };
    return of(this._RecoveryChallenge);
  }

  public VerifyPasswordRecoveryCode(p_Email: string, p_Code: string): Observable<boolean> {
    const _Challenge = this._RecoveryChallenge;
    const _IsValid = _Challenge !== null
      && _Challenge.email === p_Email.trim()
      && _Challenge.previewCode === p_Code.trim()
      && _Challenge.expiresAt.getTime() > Date.now();
    return of(_IsValid);
  }

  public RegisterWithProvider(p_Provider: IdentityProvider): Observable<string> {
    return of(`${p_Provider} registration is ready to connect when provider credentials are available.`);
  }

  private IsEmailOrPhone(p_AccountName: string): boolean {
    return _EmailPattern.test(p_AccountName) || _PhonePattern.test(p_AccountName);
  }

  private CreateRecoveryCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}