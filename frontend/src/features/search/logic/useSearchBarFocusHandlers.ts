// src/features/search/logic/useSearchBarFocusHandlers.ts

interface UseSearchBarFocusHandlersParams {
  interactionsFocus: () => void
  interactionsBlur: () => void
  searchLogicFocus: () => void
  searchBarStateBlur: () => void
}

export function useSearchBarFocusHandlers({
  interactionsFocus,
  interactionsBlur,
  searchLogicFocus,
  searchBarStateBlur
}: UseSearchBarFocusHandlersParams) {
  const handleFocus = () => {
    interactionsFocus()
    searchLogicFocus()
  }

  const handleBlur = () => {
    searchBarStateBlur()
    interactionsBlur()
  }

  return { handleFocus, handleBlur }
}