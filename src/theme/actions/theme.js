import ReactGA from 'react-ga'

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
  document.body.classList.add("newsletter-showing");
  setTimeout(() => {
    const scrolltop = document.body.scrollHeight;
    window.scroll({top: scrolltop, left:0, behavior: "smooth"});
  }, 300);
  ReactGA.modalview(window.location.pathname + "#newsletter");

  return { type: SHOW_NEWSLETTER }
}
export function hideNewsletter() {
  document.body.classList.remove("newsletter-showing");

  return { type: HIDE_NEWSLETTER }
}