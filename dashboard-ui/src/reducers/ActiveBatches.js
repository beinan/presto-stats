export const TOGGLE_ACTIVE_BATCH =
  'ACTIVE_BATCHES/TOGGLE_ACTIVE_BATCH';
export const ADD_ACTIVE_BATCH =
  'ACTIVE_BATCHES/ADD_ACTIVE_BATCH';
export const REMOVE_ACTIVE_BATCH =
  'ACTIVE_BATCHES/REMOVE_ACTIVE_BATCH';

export const toggleActiveBatch = batch => ({
  type: TOGGLE_ACTIVE_BATCH,
  batch
});

export const addActiveBatch = batch => ({
  type: ADD_ACTIVE_BATCH,
  batch
});

export const removeActiveBatch = batch => ({
  type: REMOVE_ACTIVE_BATCH,
  batch
});

const addOrRemove = (arr, item) => arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

export default function reducer(
  state = {
    active_batches: []
  },
  action
) {
  console.log("reducer starts for active Batch:", state, action);
  switch (action.type) {
    case TOGGLE_ACTIVE_BATCH:
      console.log("Toggling batch to active list:", action.batch)
      return {
        ...state,
        active_batches: addOrRemove(state.active_batches, action.batch)
      };
    case ADD_ACTIVE_BATCH:
      console.log("Adding batch from active list:", action.batch)
      return {
        ...state,
        active_batches: [...state.active_batches, action.batch]
      };
    case REMOVE_ACTIVE_BATCH:
      console.log("Removing batch from active list:", action.batch)
      return {
        ...state,
        active_batches: state.active_batches.filter(batch => batch !== action.batch)
      };
    default:
      break;
  }
  return state;
}