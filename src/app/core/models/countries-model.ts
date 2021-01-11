export interface CountriesModel {
  init?: boolean;
  data: Array<CountryData> | null;
}

export interface CountryData {
  code: string | null;
  name: string | null;
}