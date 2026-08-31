import { Injectable, signal } from '@angular/core';
import { DraftUser } from '../library/draft-auth.models';

const _DraftUsers: readonly DraftUser[] = [
  { username: 'admin', password: 'admin', role: 'admin' },
  { username: 'manager', password: 'manager', role: 'manager' },
  { username: 'user', password: 'user', role: 'user' },
];

@Injectable({ providedIn: 'root' })
export class DraftAuthService {
  private readonly _CurrentUser = signal<DraftUser | null>(null);
  public readonly CurrentUser = this._CurrentUser.asReadonly();

  public SignIn(p_Username: string, p_Password: string): boolean {
    const _User = _DraftUsers.find((_Item) => _Item.username === p_Username.trim() && _Item.password === p_Password);
    this._CurrentUser.set(_User ?? null);
    return _User !== undefined;
  }

  public SignOut(): void {
    this._CurrentUser.set(null);
  }
}