import React from "react";

const Discounts = props => (
  <svg width={20} height={20} viewBox="0 0 20 20" {...props}>
    <g fill="none" fillRule="evenodd">
      <path
        fill="#87BBFD"
        d="M9.668 9.846V12H2c-.552 0-1-.413-1-.923V4.923C1 4.413 1.448 4 2 4h12.002c.553 0 1 .413 1 .923v4.923H9.669zM8.006 6A2.003 2.003 0 1 0 8 10.006 2.003 2.003 0 0 0 8.006 6z"
      />
      <path
        fill="#6772E5"
        d="M18 16H6c-.552 0-1-.413-1-.923V8.923C5 8.413 5.448 8 6 8h12c.552 0 1 .413 1 .923v6.154c0 .51-.448.923-1 .923zm-5.994-6A2.003 2.003 0 1 0 12 14.006 2.003 2.003 0 0 0 12.006 10z"
      />
    </g>
  </svg>
);

export default Discounts;