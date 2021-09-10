
export const ADD_ACTIVE_QUERY =
  'ACTIVE_QUERIES/ADD_ACTIVE_QUERY';
export const REMOVE_ACTIVE_QUERY =
  'ACTIVE_QUERIES/REMOVE_ACTIVE_QUERY';


export const addActiveQuery = query => ({
  type: ADD_ACTIVE_QUERY,
  query
});

export const removeActiveQuery = query => ({
  type: REMOVE_ACTIVE_QUERY,
  query
});

export default function reducer(
  state = {
    active_queries: []
  },
  action
) {
  console.log("reducer starts for Active query:", state, action);
  switch (action.type) {
    case ADD_ACTIVE_QUERY:
      console.log("Adding query to active list:", action.query)
      return {
        ...state,
        active_queries: [...state.active_queries, action.query]
      };
    case REMOVE_ACTIVE_QUERY:
      console.log("Removing query from active list:", action.query)
      return {
        ...state,
        active_queries: state.active_queries.filter(query => query !== action.query)
      };
    default:
      break;
  }
  return state;
}