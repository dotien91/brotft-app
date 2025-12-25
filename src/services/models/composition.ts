export interface ICompositionUnitItemDetail {
  id: string;
  apiName: string;
  name: string;
  icon: string;
  tag: string | null;
  unique: boolean;
}

export interface ICompositionUnit {
  championId: string;
  championKey: string;
  name: string;
  cost: number;
  star: number;
  carry: boolean;
  need3Star: boolean;
  needUnlock?: boolean;
  position: {
    row: number;
    col: number;
  };
  image: string;
  items: string[]; // Array of item IDs
  itemsDetails: ICompositionUnitItemDetail[];
}

export interface ICompositionSynergy {
  name: string;
  count: number;
}

export interface IComposition {
  id: string;
  compId: string;
  name: string;
  plan: string;
  difficulty: string;
  tier?: string; // S, A, B, C, D
  metaDescription: string;
  isLateGame: boolean;
  boardSize: {
    rows: number;
    cols: number;
  };
  synergies: ICompositionSynergy[];
  units: ICompositionUnit[];
  earlyGame?: ICompositionUnit[];
  midGame?: ICompositionUnit[];
  notes: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICompositionsQueryParams {
  page?: number;
  limit?: number;
  tier?: string; // S, A, B, C, D
  units?: string; // Comma-separated units: "garen,jarvaniv"
  searchInAllArrays?: boolean;
}

export interface ICompositionsResponse {
  data: IComposition[];
  hasNextPage: boolean;
}

export interface ISearchByUnitsDto {
  units: string[];
  searchInAllArrays?: boolean;
}

