export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface User {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}
