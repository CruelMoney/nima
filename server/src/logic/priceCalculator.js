
const getTotalPrice = ({items, initial, coupon}) => {
  const price = items.reduce((acc, i)=>acc+i.price, 0);
  return addCoupon({price, coupon}) + initial;
}

const addCoupon = ({price, coupon}) => {
  if(!coupon) return price;
  const value = coupon.discount;

  switch (coupon.type) {
    case "Percentage":
      price -= (price/100*value);
      break;
    case "Value":
      price -= value;
      break;
    default:
      break;
  }
  if(price < 0){price = 0;}
  return price;
}

export {
  getTotalPrice
}