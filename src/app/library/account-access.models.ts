import { Observable } from 'rxjs';

export type AccountRole = 'Admin' | 'Manager' | 'User';
export type IdentityProvider = 'Google' | 'Microsoft' | 'Facebook';

export interface AccountCreationRequest {
  readonly accountName: string;
  readonly role: AccountRole;
}

export interface AccountRecord extends AccountCreationRequest {
  readonly id: string;
  readonly createdAt: Date;
}

export interface PasswordRecoveryRequest {
  readonly email: string;
}

export interface PasswordRecoveryChallenge {
  readonly email: string;
  readonly expiresAt: Date;
  readonly previewCode: string;
}

export abstract class AccountAccessApi {
  public abstract CreateAccount(p_Request: AccountCreationRequest): Observable<AccountRecord>;
  public abstract StartPasswordRecovery(p_Request: PasswordRecoveryRequest): Observable<PasswordRecoveryChallenge>;
  public abstract VerifyPasswordRecoveryCode(p_Email: string, p_Code: string): Observable<boolean>;
  public abstract RegisterWithProvider(p_Provider: IdentityProvider): Observable<string>;
}