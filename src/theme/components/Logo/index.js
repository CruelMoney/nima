import React from "react";
import './index.css';

const Logo = props => (
  <svg width={230} height={182} viewBox="0 0 230 182" {...props}>
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
      filter={props.shadow ? "url(#a)" : ""}
      transform="translate(-8 13)"
      fillRule="nonzero"
      stroke={props.color || "#FFF"}
      fill={props.color || "#FFF"}
    >
      <path className="logo-path" d="M144.28 118.86c1.857 4.126 3.162 8.364 3.612 12.616 1.36 13.265-10.327 23.536-24.154 19.718-17.871-4.946-24.39-21.71-23.687-38.202-1.84.022-3.683 0-5.525-.07-9.152-.472-20.108-1.328-28.157-6.006-7.587-4.427-10.21-12.218-9.495-20.555a174.072 174.072 0 0 1 6.976-33.424l5.515 9.592c-7.214-2.273-13.728.339-20.197 3.63-5.023 2.567-15.666 7.422-6.976 13.089 6.171 4.058 16.486-.148 22.567-2.568a97.788 97.788 0 0 0 19.184-10.536c8.347-5.726 16.098 7.88 7.81 13.576-16.903 11.628-55.702 29.764-67.194 1.815-4.874-11.894 2.355-20.85 12.342-26.562 11.15-6.39 23.774-11.613 36.653-7.526 4.144 1.21 6.58 5.447 5.515 9.592a210.016 210.016 0 0 0-5.5 23.36c-1.238 7.245-2.877 12.617 5.634 14.756 7.722 1.938 15.741 2.557 23.716 2.147 1.276-3.84 2.935-7.403 4.908-10.488l.015.075c5.537-8.718 18.038-1.22 16.573 7.217a8.716 8.716 0 0 0-2.15.267 106.316 106.316 0 0 1-10.985 2.13c2.577-5.205 10.581-8.144 15.799-2.338l.694.778c1.68.9 2.921 2.44 3.61 4.198a131.927 131.927 0 0 1 3.186 3.989c.47.054.957.156 1.46.31 10.946 3.355 21.46-4.041 26.487-13.57 6.35-11.93 5.592-26.528 5.25-39.725l12.522 5.204a175.637 175.637 0 0 1-34.92 30.868l-1.754-13.421c15.72 5.622 39.158 18.446 55.22 7.903 8.462-5.547 8.432-16.418 7.659-25.514a58.067 58.067 0 0 0-8.775-26.304l.045.015c-5.057-8.068 7.644-15.45 12.67-7.456 11.378 18.088 18.71 51.908.685 68.31-20.494 18.626-49.45 5.07-71.386-2.773a7.45 7.45 0 0 1-5.156-6.148 7.463 7.463 0 0 1 3.401-7.272 161.372 161.372 0 0 0 31.945-28.616c4.343-5.026 12.374-.76 12.523 5.204.446 17.7.49 37.384-10.604 52.296-6.712 8.922-16.725 15.403-27.562 16.42zm-26.547-7.5l.566-.1c-.627 6.45.832 13.052 5.005 18.389 2.126 2.725 5.872 6.288 5.568.958-.115-2.17-2.661-6.063-3.688-7.95a89.427 89.427 0 0 0-7.45-11.298zM184.503 15c9.988 0 10.004-15 0-15s-10.004 15 0 15M45.5 33c9.992 0 10.008-15 0-15s-9.992 15 0 15M59.503 24c9.988 0 10.004-15 0-15s-10.004 15 0 15" />
    </g>
  </svg>
);

export default Logo;
