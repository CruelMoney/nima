/*
 * action types
 */

export const BEGIN_LOADING = 'BEGIN_LOADING'
export const END_LOADING = 'END_LOADING'

/*
 * other constants
 */


/*
 * action creators
 */

export function beginLoading(transparent=false) {
  return { type: BEGIN_LOADING, transparentLoading: transparent  }
}

export function endLoading() {
  return { type: END_LOADING }
}