import React from "react";
import './icon.css';

const Bag = props => {
  // const showCircle = props.itemsCount > 0

  return(
  <svg className={"bag-icon " + props.className} width={26} height={31} viewBox="0 0 26 31">
    <title>Bag</title>
    <g fill="#111" fillRule="nonzero">
      <path d="M2.294 5A2.291 2.291 0 0 0 0 7.294v21.412A2.291 2.291 0 0 0 2.294 31h21.412A2.291 2.291 0 0 0 26 28.706V7.294A2.291 2.291 0 0 0 23.706 5H2.294zm22.177 23.706a.757.757 0 0 1-.765.765H2.294a.757.757 0 0 1-.765-.765V7.294c0-.428.337-.765.765-.765h21.412c.428 0 .765.337.765.765v21.412z" />
      <path d="M19 7H6v-.778C6 2.38 9.379 0 12.5 0S19 2.38 19 6.222V7zM7.576 5.444h9.848C17 3.018 14.682 1.556 12.5 1.556c-2.182 0-4.5 1.462-4.924 3.888z" />
        {/* <circle className={`${showCircle ? "active" : ""} ${props.bulge ? "bulge" : ""}`} id="Oval" fill="#8D0E20" cx="13" cy="18" r="7">
        </circle> */}
    </g>
  </svg>
)};

export default Bag;