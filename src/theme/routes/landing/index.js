import React, { Component } from 'react';
import Logo from '../../components/Logo';
import { Link } from 'react-router-dom';

import './index.css';

class Landing extends Component {
  state={
    hover:false
  }

  render() {
    return (
      <div className={`landingVideo p-16 ${this.state.hover && "hover"}`}>
        <div className={`overflow-hidden w-full h-full`}>
          <video 
            autoPlay 
            loop 
            playsInline 
            muted 
            preload="metadata"
            className="object-fit-cover w-full h-full"
            >
            <source src="https://d1235ca2z646oc.cloudfront.net/videos/processed/256/KingdomofDust-HD.mp4-mobile.mp4#t=0.1" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="absolute pin flex justify-center items-center flex-col">
          <Logo shadow />
          <h1 className="mb-6 text-white text-shadow">
            NIMA COPENHAGEN
          </h1>
          <Link
            to="/shop"
            onMouseEnter={()=>this.setState({hover:true})}
            onMouseLeave={()=>this.setState({hover:false})}
            className={`bg-transparent hover:bg-white  text-white font-medium hover:text-black py-4 px-10 border-2 border-white hover:border-transparent`}>
              WEBSHOP
          </Link>
        </div>
      </div>
    );
  }
}

export default Landing;