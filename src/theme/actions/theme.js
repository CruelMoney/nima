/*
 * action types
 */

export const BEGIN_LOADING = 'BEGIN_LOADING'
export const END_LOADING = 'END_LOADING'
export const SHOW_NEWSLETTER = 'SHOW_NEWSLETTER'
export const HIDE_NEWSLETTER = 'HIDE_NEWSLETTER'

/*
 * other constants
 */


/*
 * action creators
 */

export function beginLoading(transparent=false, text = false) {
  return { type: BEGIN_LOADING, transparentLoading: transparent, text:text }
}

export function endLoading() {
  return { type: END_LOADING }
}

export function showNewsletter() {
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const scrolltop = document.body.scrollHeight;
    window.scroll({top: scrolltop, left:0, behavior: "smooth"});
  }, 100);
  return { type: SHOW_NEWSLETTER }
}
export function hideNewsletter() {
  document.body.style.overflow = 'auto';
  return { type: HIDE_NEWSLETTER }
}