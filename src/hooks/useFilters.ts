import { useReducer } from "react";
import {
  AMENITY_KEYS,
  FilterDispatchAction,
  FilterParamsState,
  FilterRow,
} from "../types/FilterTypes";

// Initial state
const initialState: FilterParamsState = {
  search: "",
  filters: {},
  page: 0,
  size: 10,
  sort: "",
};

export const formatFilter = (filter: FilterRow) => {
  const formattedFilter: Record<string, string> = {};

  if (filter.key.trim()) {
    switch (filter.operator) {
      case "=":
        formattedFilter[filter.key] = `${filter.value}`; // Enclose value in double quotes
        break;
      case ">":
      case "<":
        formattedFilter[filter.key] = `${filter.operator}${filter.value}`; // Standard greater/less than
        break;
      case ">=":
        formattedFilter[filter.key] = `>:${filter.value}`; // Greater than or equal (":")
        break;
      case "<=":
        formattedFilter[filter.key] = `<:${filter.value}`; // Less than or equal (":")
        break;
      default: {
        // Ensures `operator` is treated as `never` if all cases are handled
        const unexpectedOperator: never = filter.operator;
        throw new Error(`Unexpected operator: ${unexpectedOperator}`);
      }
    }
  }

  return formattedFilter;
};
// Reducer function
const gridParamsReducer = (
  state: FilterParamsState,
  action: FilterDispatchAction
): FilterParamsState => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 0 };

    case "ADD_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...formatFilter(action.payload) },
        page: 0,
      };

    case "ADD_FILTERS_BATCH": {
      const newFilters = { ...state.filters };

      action.payload.forEach((filter) => {
        Object.assign(newFilters, formatFilter(filter));
      });

      return {
        ...state,
        filters: newFilters,
        page: 0,
      };
    }

    case "RESET_AMENITIES": {
      const newFilters = { ...state.filters };

      AMENITY_KEYS.forEach((key) => {
        delete newFilters[key];
      });

      return {
        ...state,
        filters: newFilters,
        page: 0,
      };
    }

    case "RESET_FILTERS":
      return {
        ...state,
        filters: {},
        page: 0,
      };

    case "SET_PAGE":
      return { ...state, page: action.payload };

    case "SET_ROWS_PER_PAGE":
      return { ...state, size: action.payload, page: 0 };

    case "SET_SORT":
      return { ...state, sort: action.payload, page: 0 };

    case "SET_FROM_URL":
      return {
        ...state,
        search: action.payload.search ?? state.search,
        filters: {
          ...state.filters,
          ...{ start: `${action.payload.start}` },
          ...{ end: `${action.payload.end}` },
          ...{
            numberOfGuests: `${action.payload.numberOfGuests}`,
            city: `${action.payload.city}`,
          },
        },
        page: 0,
      };

    case "RESET_PARAMS":
      return initialState;

    default:
      return state;
  }
};

// Utility function to transform state
const transformParams = (state: FilterParamsState) => {
  const { filters, ...rest } = state;

  // Remove empty values and flatten filters
  return Object.fromEntries(
    Object.entries({ ...rest, ...filters }).filter(
      ([, value]) =>
        !(typeof value === "string" && value.trim() === "") &&
        !(typeof value === "object" && Object.keys(value).length === 0)
    )
  ) as { [k: string]: string | number };
};

// Custom hook
export const useFilters = () => {
  const [state, dispatch] = useReducer(gridParamsReducer, initialState);

  const params = transformParams(state);

  return {
    params,
    dispatch,
  };
};
