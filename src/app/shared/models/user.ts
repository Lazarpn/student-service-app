export interface UserMeModel extends UserInitialsModel {
  id: string;
  email: string;
  emailConfirmed: boolean;
  // dateVerificationCodeExpires: Date;
  createdAt: string;
}

export interface UserShortModel extends UserInitialsModel {
  id: string;
  email: string;
}

export interface UserAdminModel extends UserMeModel {
  active: boolean;
  roles: string[];
}

export interface UserAdminCreateModel extends UserAdminModel {
  avatarFile: File;
  shouldClearAvatar: boolean;
  password: string;
  confirmPassword: string;
}

export interface UserAdminUpdateModel extends UserAdminModel {
  avatarFile: File;
  shouldClearAvatar: boolean;
  password: string;
}

export interface UserInitialsModel {
  thumbUrl: string;
  firstName: string;
  lastName: string;
  initials: string;
}

export interface AuthResponseModel {
  token: string;
}

export interface FirebaseLoginModel {
  idToken: string;
  refreshToken: string | null;
}

export interface UserConfirmEmailModel {
  emailVerificationCode: string;
}

export interface SignInModel {
  email: string;
  password: string;
}

export interface SignUpModel {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ChangeEmailModel {
  newEmail: string;
}

export interface ForgotPasswordModel {
  email: string;
}

export interface ResentEmailResponseModel {
  newCodeExpiryDate: Date;
}

export interface ResetPasswordModel {
  token: string;
  userId: string;
  password: string;
}

export enum SocialAccountType {
  Google = 'Google',
}
