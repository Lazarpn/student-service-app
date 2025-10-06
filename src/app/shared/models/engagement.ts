import { TeachingForm } from '../enums/teaching-form.enum';

export interface EngagementModel {
  id: string;
  brojCasova: number;
  uloga: TeachingForm;
  akademskaGodina: number | Date;
  predmetNaziv: string;
  zaposleniIme: string;
  predmetId: string;
  zaposleniId: string;
}

export interface EngagementUpsertModel {
  brojCasova: number;
  uloga: TeachingForm;
  akademskaGodina: number;
  predmetId: string;
  zaposleniId: string;
}
