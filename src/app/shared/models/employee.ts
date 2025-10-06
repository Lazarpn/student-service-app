import { EmployeeTitle } from '../enums/employee-title.enum';

export interface EmployeeModel {
  id: string;
  ime: string;
  prezime: string;
  email: string;
  datumZaposlenja: Date | string;
  jmbg: string;
  zvanje: EmployeeTitle;
  katedraId: string;
}

export interface EmployeeUpsertModel {
  ime: string;
  prezime: string;
  email: string;
  jmbg: string;
  datumZaposlenja: Date | string;
  zvanje: EmployeeTitle;
  katedraId: string;
}
