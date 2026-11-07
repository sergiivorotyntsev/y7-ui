// Pure chip and sheet logic for FilterBar. No React: runs in node --test.

export const removeChip = (chips, id) => (chips ?? []).filter((c) => c.id !== id);
export const clearAll = () => [];
export const countApplied = (chips) => (chips ?? []).length;

/** Narrow-width sheet state: edits are a draft; Apply commits, Cancel discards, Clear empties the draft only. */
export const initialSheet = (applied = {}) => ({ applied: { ...applied }, draft: { ...applied } });

export function sheetReducer(state, action) {
  switch (action.type) {
    case 'edit': return { ...state, draft: { ...state.draft, [action.key]: action.value } };
    case 'apply': return { applied: { ...state.draft }, draft: { ...state.draft } };
    case 'cancel': return { ...state, draft: { ...state.applied } };
    case 'clear': return { ...state, draft: {} };
    case 'reset': return initialSheet(action.applied);
    default: return state;
  }
}
