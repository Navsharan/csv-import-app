export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  weapon?: string;
  vehicle?: string;
  locations: Location[];
  affiliations: Affiliation[];
}

export interface Location {
  id: number;
  name: string;
}

export interface Affiliation {
  id: number;
  name: string;
}

export interface PaginatedResponse {
  total: number;
  pages: number;
  currentPage: number;
  data: Person[];
}
