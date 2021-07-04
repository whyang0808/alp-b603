export enum IdType {
  IC = 'IC',
  PASSPORT = 'PASSPORT'
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
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  DEVELOPER = 'DEVELOPER',
  UNKNOWN = 'UNKNOWN'
}
