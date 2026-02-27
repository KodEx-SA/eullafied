export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: {
    id: string;
    name: string;
  };
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}