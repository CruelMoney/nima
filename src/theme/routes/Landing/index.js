import React, { Component } from 'react';
import Logo from '../../components/Logo';
import { Link } from 'react-router-dom';
import {Helmet} from 'react-helmet';
import './index.css';

class Landing extends Component {
  state = {
    hover: false,
    videoLoaded: false
  }

  onVideoLoaded = () => {
    this.setState({
      videoLoaded:true
    })
  }

  render() {
    const { videoLoaded, hover } = this.state;
    const description = "The blessing of organic clothing";
    return (
      <div className={`landingVideo p-8 lg:p-16 ${hover && "hover"} ${videoLoaded && 'loaded'}`}>
        <Helmet>
          <title>{"Nimacph - Webshop"}</title>
          <meta name="description" content={description} />
          <meta name="og:description" content={description} />
          <meta name="og:image" content={"https://nimacph.dk/uploads/files/Nima_Cph_labels.jpg"} />
        </Helmet>
        <div className={`overflow-hidden w-full h-full grey`}>
          {/* <video 
            autoPlay 
            loop 
            playsInline 
            muted 
            preload="auto"
            onCanPlayThrough={this.onVideoLoaded}
            className={`object-fit-cover w-full h-full`}
            >
            <source src="/uploads/files/landing-video.mp4#t=0.1" type="video/mp4" />
            Your browser does not support the video tag.
          </video> */}

          <img src="/uploads/files/front_bg.jpg" alt=""/>

        </div>
        <div className="absolute pin flex justify-center items-center flex-col">
          <Logo 
          color={'white'} 
          shadow />
          <h1 className="sm:mb-16 mb-0 text-white text-shadow">
          nimacph.
          </h1>
          <Link
            to="/shop"
            onMouseEnter={()=>this.setState({hover:true})}
            onMouseLeave={()=>this.setState({hover:false})}
            className={`mb-16 sm:mb-0 landing-button bg-transparent hover:bg-white  text-white font-medium hover:text-black py-4 lg:px-24 px-12 border-2 border-white hover:border-transparent`}>
              GÅ TIL WEBSHOP
              <span>
                BRUG KODEN "RELEASE" OG FÅ 25%
              </span>
          </Link>
        </div>
      </div>
    );
  }
}

export default Landing;
