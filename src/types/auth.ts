export interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponseData {
  token: string;
  user: UserProfile;
}
