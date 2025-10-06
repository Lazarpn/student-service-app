export interface SubjectModel {
  id: string;
  naziv: string;
  espb: number;
  sifra: string;
  katedraId: string;
}

export interface SubjectUpsertModel {
  naziv: string;
  espb: number;
  sifra: string;
  katedraId: string;
}
