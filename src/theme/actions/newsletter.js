
import ReactGA from 'react-ga'

/*
 * action types
 */

export function signup(data) {
  return fetch('/api/newsletter',{
      method: 'POST',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(data)
    })
    .then(result => result.json())
    .then(data => {
      if(!!data.error){
        throw data.error;
      }else{
        ReactGA.event({
          category: 'User',
          action: 'Newsletter signup'
        });
        return data;
      }
    })
    .catch((error)=>{
      throw error
    })
}
