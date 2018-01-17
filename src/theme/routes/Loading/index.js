import React, { Component } from 'react';
import Logo from '../../components/Logo'
import {Animate} from 'cude-animations'
import './index.css';

class Loading extends Component {

  bg = null
  logoOverflow = null
  logo = null
  animating = false

  state={
    logoAnimate:false
  }

  componentDidMount(){
    this.bg = document.querySelector('#loading-bg');
    this.logoOverflow = document.querySelector('#loading-logo-wrapper');
    this.logo = document.querySelector('#loading-screen-content');    
  }

  startAnimation = () => {
    this.animating = true;

    const manipulator = (val) => {
      if(val < 100){
        this.bg.style.opacity = 1;
        this.logoOverflow.style.opacity = 1;
      } 
      this.bg.style.transform = `translateY(${val}vh)`;
      this.logoOverflow.style.transform = `translateY(${val}vh)`;
      this.logo.style.transform = `translateY(-${val}vh) translateX(-50%)`;        
    }

    const options = {
      manipulator: manipulator,
      start: 100,
      end: 0,
      duration: 750
    }
    
    const animation = new Animate(options)
    animation.start()
    .then(()=>{
      this.animating = false;
      setTimeout(() => {
        if(this.props.active){
          this.setState({logoAnimate:true})            
        }
      }, 200);
    });
  }
  endAnimation = () => {
    this.animating = true;

    this.setState({
      logoAnimate:false
    });

    const manipulator = (val) => {          
      this.bg.style.transform = `translateY(${val}vh)`;
      this.logoOverflow.style.transform = `translateY(${val}vh)`;
      this.logo.style.transform = `translateY(${-val}vh) translateX(-50%)`;
      if(val <= -99){
        this.bg.style.opacity = 0;
        this.logoOverflow.style.opacity = 0;
      }
    }

    const options = {
      manipulator: manipulator,
      start: 0,
      end: -100,
      duration: 750
    }
    
    const animation = new Animate(options);
    animation.start()
    .then(()=>{this.animating = false});
  }

  // Contains logic for not starting animation unless the previous has finished
  componentWillReceiveProps(nextprops){
    let animation = ()=>{};

    if(nextprops.active && !this.props.active){
      animation = this.startAnimation;

    }else if(!nextprops.active && this.props.active){
      animation = this.endAnimation;
    }

    // animate if nothing else is going on
    if(!this.animating){ 
      animation();
    }else{
      // Check every 100 ms to see if animation is finished yet
      const endInterval = setInterval(() => {
        if(!this.animating){
          animation();
          clearInterval(endInterval);
        }
      }, 100);
    }
  }

  render() {    
    return (
      <div 
      id="loading-screen"
      className={`fixed pin`}>
      <div 
      id="loading-logo-wrapper"
      className="logo-wrapper relative pin h-full">
        <div id="loading-screen-content" className="absolute h-full w-full flex justify-center items-center flex-col">
          <Logo
              loadAnimation={this.state.logoAnimate}
              id="loading-logo"
              className=""
              color="#111111"
              />
           
            {this.props.text ?
               <span className="loading-text">
               {this.props.text}
              </span>
              : null}
        </div>
         
        </div>
       <div 
        id={'loading-bg'}
        className={`loading-bg absolute pin ${this.props.transparent ? 'transparent' : ''}`}>
       </div>
      </div>
    );
  }
}


export function LoadingComponent(props) {
  if (props.error) {
    // When the loader has errored
    return <Loading 
              text={"ERROR. PLEASE REFRESH."}
              active />
  } else if (props.timedOut) {
    // When the loader has taken longer than the timeout
    return <Loading 
              text={"STILL LOADING"}
              active />
  } else if (props.pastDelay) {
    // When the loader has taken longer than the delay
    return  <Loading 
              text={"NIMA COPENHAGEN"}
              active />
  } else {
    // When the loader has just started
    return null;
  }
}


export default Loading;