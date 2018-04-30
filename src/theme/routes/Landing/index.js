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

    return (
      <div className={`landingVideo p-8 lg:p-16 ${hover && "hover"} ${videoLoaded && 'loaded'}`}>
        <Helmet>
          <title>{"NIMA CPH"}</title>
          <meta name="description" content={"NIMA COPENHAGEN"} />
        </Helmet>
        <div className={`overflow-hidden w-full h-full grey`}>
          <video 
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
          </video>
        </div>
        <div className="absolute pin flex justify-center items-center flex-col">
          <Logo 
          color={'white'} 
          shadow />
          <h1 className="mb-16 text-white text-shadow">
            NIMA COPENHAGEN
          </h1>
          <Link
            to="/shop"
            onMouseEnter={()=>this.setState({hover:true})}
            onMouseLeave={()=>this.setState({hover:false})}
            className={`landing-button bg-transparent hover:bg-white  text-white font-medium hover:text-black py-4 lg:px-24 px-12 border-2 border-white hover:border-transparent`}>
              WEBSHOP
          </Link>
        </div>
      </div>
    );
  }
}

export default Landing;
