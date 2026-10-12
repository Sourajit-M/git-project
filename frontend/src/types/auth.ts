export interface UserProfile {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  email: string;
  htmlUrl: string;
  publicRepos: number;
  privateRepos: number;
  createdAt: string;
  token?: string;
  connectedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  token: string | null;
}
