import { Injectable, signal } from '@angular/core';
import { DraftUser, DraftUserRequest } from '../library/draft-auth.models';

const _StorageKey = 'application-draft-users';
const _DefaultUsers: readonly DraftUser[] = [
  { username: 'admin', password: 'admin', role: 'admin' },
  { username: 'manager', password: 'manager', role: 'manager' },
  { username: 'user', password: 'user', role: 'user' },
];

@Injectable({ providedIn: 'root' })
export class DraftAuthService {
  private readonly _CurrentUser = signal<DraftUser | null>(null);
  private readonly _Users = signal<DraftUser[]>(this.GetStoredUsers());
  public readonly CurrentUser = this._CurrentUser.asReadonly();
  public readonly Users = this._Users.asReadonly();

  public SignIn(p_Username: string, p_Password: string): boolean {
    const _User = this._Users().find((_Item) => _Item.username === p_Username.trim() && _Item.password === p_Password);
    this._CurrentUser.set(_User ?? null);
    return _User !== undefined;
  }

  public SignOut(): void {
    this._CurrentUser.set(null);
  }

  public SaveUser(p_Request: DraftUserRequest): string | null {
    const _Username = p_Request.username.trim();
    if (!_Username || !p_Request.password) {
      return 'Username and password are required.';
    }
    const _Users = this._Users();
    const _ExistingUser = _Users.find((_User) => _User.username === _Username);
    const _UpdatedUsers = _ExistingUser
      ? _Users.map((_User) => _User.username === _Username ? { ...p_Request, username: _Username } : _User)
      : [..._Users, { ...p_Request, username: _Username }];
    this.UpdateUsers(_UpdatedUsers);
    return null;
  }

  public RemoveUser(p_Username: string): string | null {
    if (this._CurrentUser()?.username === p_Username) {
      return 'The signed-in user cannot be removed.';
    }
    this.UpdateUsers(this._Users().filter((_User) => _User.username !== p_Username));
    return null;
  }

  private GetStoredUsers(): DraftUser[] {
    const _StoredUsers = localStorage.getItem(_StorageKey);
    return _StoredUsers ? JSON.parse(_StoredUsers) as DraftUser[] : [..._DefaultUsers];
  }

  private UpdateUsers(p_Users: DraftUser[]): void {
    this._Users.set(p_Users);
    localStorage.setItem(_StorageKey, JSON.stringify(p_Users));
  }
}