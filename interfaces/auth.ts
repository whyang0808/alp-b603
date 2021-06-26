export interface CreateForgotPasswordInterface {
  userId: string;
  createdAt: Date;
  tokenHash: string;
  expirationDate: Date;
  used: boolean;
}
