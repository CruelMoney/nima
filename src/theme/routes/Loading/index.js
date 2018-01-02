import React, { Component } from 'react';
import Logo from '../../components/Logo'
import {Animate} from 'cude-animations'
import './index.css';

class Loading extends Component {

  bg = null
  logoOverflow = null
  logo = null

  state={
    logoAnimate:false
  }

  componentDidMount(){
    this.bg = document.querySelector('#loading-bg');
    this.logoOverflow = document.querySelector('#loading-logo-wrapper');
    this.logo = document.querySelector('#loading-logo');    
  }

  startAnimation = () => {
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
        setTimeout(() => {
          if(this.props.active){
            this.setState({logoAnimate:true})            
          }
        }, 200);
      });
  }
  endAnimation = () => {
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
    animation.start();
  }

  componentWillReceiveProps(nextprops){
    if(nextprops.active && !this.props.active){
      this.startAnimation();
    }else if(!nextprops.active && this.props.active){
      this.endAnimation();
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
          <Logo
            loadAnimation={this.state.logoAnimate}
            id="loading-logo"
            className="absolute pin"
            color="#111111"
            />
       </div>
       <div 
        id={'loading-bg'}
        className={`loading-bg absolute pin ${this.props.transparent ? 'transparent' : ''}`}>
       </div>
      </div>
    );
  }
}

export default Loading;