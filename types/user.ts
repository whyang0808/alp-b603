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
