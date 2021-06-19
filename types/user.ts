export enum IdType {
  IC = 'ic',
  PASSPORT = 'passport'
}

export interface CreateUserInterface {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  idType: IdType;
  idNumber: string;
  password: string;
}

export enum ROLES {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  AGENT = 'agent',
  DEVELOPER = 'developer',
  UNKNOWN = 'unknown'
}
