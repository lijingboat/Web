export type DraftUserRole = 'admin' | 'manager' | 'user';

export interface DraftUser {
  readonly username: string;
  readonly password: string;
  readonly role: DraftUserRole;
}

export interface DraftUserRequest {
  readonly username: string;
  readonly password: string;
  readonly role: DraftUserRole;
}