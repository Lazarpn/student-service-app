export interface DepartmentModel {
  id: string;
  naziv: string;
  sifra: string;
}

export interface DepartmentUpsertModel {
  naziv: string;
  sifra: string;
}
