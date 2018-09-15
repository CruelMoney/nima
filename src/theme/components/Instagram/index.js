import React, {PureComponent} from 'react';
import {fetcher, LoadingImage, Icons} from 'cude-cms';
import './index.css'

class Instagram extends PureComponent{
  state = {
    instas: []
  }


  render(){
    const instas = this.props.data;
    const show = instas.length > 0;
    if(!show) return null;

    return(
      <section className="instagram-wrapper">
        <hr/>
        <div className="center">
        <a href="https://www.instagram.com/nimacph">
           <h3>
              BLIV EN DEL AF FAMILIEN
          </h3>
          <p>
            Del dit look ved at tagge #nimacph på instagram.
          </p>
          </a>
        </div>
      <div className="instagram">
        { instas.slice(0, 4).map(insta => {
          return (
          <div className="insta">
            <a href={`https://www.instagram.com/p/${insta.shortcode}`} target="_blank" rel="noopener">
            <div className="info">
              <p>
                    <span
                        className="icon"
                        style={{backgroundImage:`url(${Icons.InstaHeartFilled})`}}
                    />
                    {insta.likeCount}
                    <span
                       className="icon"
                        style={{backgroundImage:`url(${Icons.InstaCommentFilled})`}} 
                    />
                    {insta.commentCount}
                </p>
                <p className="caption" >
                    {insta.caption}
                </p>
              </div>
            <LoadingImage draggable={false} className="image-cover" src={insta.thumbnail_src} />
            </a>
          </div>
          )
        })
        }
      </div>
      <hr className="bottom"/>
      </section>
    )
  }
}

export default fetcher(
  Instagram, 
  '/api/instagram',
  false
);;