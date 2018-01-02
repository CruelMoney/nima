import React, { Component } from 'react';
import {Animate} from 'cude-animations'
import './index.css';


class Logo extends Component {
  
  interval = null

  startAnimation = () => {
      this.p1.setAttribute('stroke-dashoffset', `300px`);
      this.p2.setAttribute('stroke-dashoffset', `116px`);
      this.p3.setAttribute('stroke-dashoffset', `218px`);
      this.c1.setAttribute('opacity', `0`);
      this.c2.setAttribute('opacity', `0`);
      this.c3.setAttribute('opacity', `0`);

      const manipulator = (el, val) => { 
          el.setAttribute('stroke-dashoffset', `${val}px`);
      }
      const man2 = (el, val) => {
        el.setAttribute('opacity', val)
      } 

      const p1 = {
        manipulator: (val) => manipulator(this.p1, val),
        start: 300,
        end: 0,
        easing: 'easeInQuad',
        duration: 400
      }
      const p2 = {
        manipulator: (val) => manipulator(this.p2, val),
        start: 116,
        end: 0,
        easing: 'linear',
        duration: 400
      }
      const p3 = {
        manipulator: (val) => manipulator(this.p3, val),
        start: 218,
        end: 0,
        easing: 'easeOutQuad',
        duration: 400
      }
      const c1 = {
        manipulator: (val) => man2(this.c1, val),
        start: 0,
        end: 10,
        duration: 333
      }
      const c2 = {
        manipulator: (val) => man2(this.c2, val),
        start: 0,
        end: 10,
        duration: 333
      }
      const c3 = {
        manipulator: (val) => man2(this.c3, val),
        start: 0,
        end: 10,
        duration: 333
      }
      
      const ap1 = new Animate(p1)
      const ap2 = new Animate(p2)
      const ap3 = new Animate(p3)
      const ac1 = new Animate(c1)
      const ac2 = new Animate(c2)
      const ac3 = new Animate(c3)

      ap1.start()
      .then(ap2.start)
      .then(ap3.start)
      .then(ac3.start)
      .then(ac2.start)
      .then(ac1.start)
      
  }

  componentWillReceiveProps(nextprops){
    if(nextprops.loadAnimation && !this.interval){
      this.startAnimation();
      this.interval = setInterval(this.startAnimation, 2500);
    }
  }

  render() {
    return (
      <svg 
      width="220px" height="170px" viewBox="0 0 220 170"
      {...this.props}>
        <title>Logo</title>
        <defs>
          <filter
            x="-11.2%"
            y="-11.8%"
            width="122.4%"
            height="128.3%"
            filterUnits="objectBoundingBox"
            id="a"
          >
            <feOffset dy={2} in="SourceAlpha" result="shadowOffsetOuter1" />
            <feGaussianBlur
              stdDeviation={7.5}
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
              in="shadowBlurOuter1"
              result="shadowMatrixOuter1"
            />
            <feMerge>
              <feMergeNode in="shadowMatrixOuter1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        <g 
        fill="none" 
        fillRule="evenodd"
        transform="translate(-611.000000, -279.000000)"
        >
        <g
         transform="translate(623.000000, 282.000000)"
         filter={this.props.shadow ? "url(#a)" : ""}
        >

        <g 
        stroke={this.props.color || "#111"}
        fill={this.props.color || "#111"}
        fillRule="nonzero"
       
        className="logo-circles">
            <path
            ref={r => this.c1 = r}
            d="M153.502949,15 C163.491151,15 163.50688,0 153.502949,0 C143.499017,0 143.499017,15 153.502949,15"></path>
            <path 
            ref={r => this.c2 = r}
            d="M28.5029487,24 C38.4911508,24 38.5068803,9 28.5029487,9 C18.4990171,9 18.4990171,24 28.5029487,24" ></path>
            <path 
            ref={r => this.c3 = r}
            d="M14.5,33 C24.4921306,33 24.5078663,18 14.5,18 C4.49213373,18 4.50786937,33 14.5,33"></path>
        </g>
        <g 
        className="logo-paths">
          <path
            ref={r => this.p1 = r}
            d="M181.276 26.373c10.85 15.529 31.731 95.42-62.33 54.539 5.002-4.509 29.617-23.019 33.21-29.718 3.249 22.93-5.436 67.9-40.794 60.423"
            stroke={this.props.color || "#000"}
            strokeWidth={15}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="300px"    
          />
          <path
            ref={r => this.p2 = r}
            d="M97.552 101.318c6.21 6.396 12.924 15.291 16.195 22.933 5.19 12.127-.789 16.65-1.761 17.469-3.53 5.26-13.632 1.684-17.47-2.866-7.296-8.651-11.883-23.21-3.343-45.937"
            stroke={this.props.color || "#000"}
            strokeWidth={18}
            strokeLinecap="round"
            strokeLinejoin="bevel"
            strokeDasharray="116px"
          />
          <path
            ref={r => this.p3 = r}
            d="M101.053 102.72c-32.839 6.307-52.17 4.32-57.886-7.06-4.643-12.175 4.717-34.876 4.717-40.093-14.526-1.444-28.798 4.791-37 12.019-8.202 7.227-1.173 40.034 53.405 6.37"
            stroke={this.props.color || "#000"}
            strokeWidth={16}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="218px"
          />
        </g>
        </g>
        </g>
      </svg>
    );
  }
}

export default Logo;

