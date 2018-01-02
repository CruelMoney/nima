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

export function beginLoading() {
  return { type: BEGIN_LOADING }
}

export function endLoading() {
  return { type: END_LOADING }
}