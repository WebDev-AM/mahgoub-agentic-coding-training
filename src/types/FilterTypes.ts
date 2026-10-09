export type FilterParamsState = {
  search?: string;
  filters?: Record<string, string | number | boolean>;
  page: number;
  size?: number;
  sort?: string; // Format: "field-dir"
};

export type FilterRow = {
  key: string;
  operator: ">" | "<" | "=" | ">=" | "<=";
  value: string;
};

export const AMENITY_KEYS = [
  "rooms",
  "beds",
  "bathrooms",
  "kitchens",
  "pools",
] as const;

/* ----------------------------------
   Dispatch Actions
---------------------------------- */
export type FilterDispatchAction =
  | {
      type: "SET_SEARCH";
      payload: string;
    }
  | {
      type: "ADD_FILTERS";
      payload: FilterRow;
    }
  | {
      type: "ADD_FILTERS_BATCH";
      payload: FilterRow[];
    }
  | {
      type: "RESET_AMENITIES"; // ✅ NEW
    }
  | {
      type: "SET_PAGE";
      payload: number;
    }
  | {
      type: "SET_ROWS_PER_PAGE";
      payload: number;
    }
  | {
      type: "SET_SORT";
      payload: string;
    }
  | {
      type: "RESET_FILTERS";
    }
  | {
      type: "RESET_PARAMS";
    }
  | {
      type: "SET_FROM_URL";
      payload: {
        search?: string;
        city?: string;
        start?: string;
        end?: string;
        numberOfGuests?: string;
      };
    };
