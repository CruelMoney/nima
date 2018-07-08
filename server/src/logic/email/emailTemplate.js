var fs = require('fs');

const getTemplate = async ({
  type,
  order,
  items,
  coupon,
  shipping
}) => {
  switch (type) {
    case "ORDER_CONFIRMATION":
      return {
        html: await _getHTML("ORDER_CONFIRMATION").then( e => _interpolateEmail(e, order, items, shipping)),
        subject: "Tak for din ordre!"
      }
    
    case "SHIPPING_CONFIRMATION":
      return{
        html: await _getHTML("SHIPPING_CONFIRMATION").then( e => _interpolateDeliveryEmail(e, order)),
        subject: "Din nimacph ordre er afsendt"
      }

    case "COUPON":
      return{
        html: await _getHTML("COUPON").then( e => _interpolateCouponEmail(e, order, coupon)),
        subject: "Din nimacph. rabatkode"
      }

    default:
      break;
  }
}


const _getHTML = (template) => {
  return new Promise((resolve, reject)=>{
    fs.readFile(__dirname + '/templates/'+template+'.html', 'utf8', function(err, html){
      if(err){return reject(err)}
      resolve(html);
    });
  })
}

const _interpolateCouponEmail = (html, order, coupon) => {
  const {
    delivery,
    orderID
  } = order;

  const {
    code,
    discount,
    uses
  } = coupon;

  html = html.replace("{{name}}", (!!delivery && !!delivery.firstName ? delivery.firstName : "there"));
  html = html.replace("{{coupon_code}}", code);
  html = html.replace("{{discount}}", discount);
  html = html.replace("{{uses}}", uses);

  return html;
}

const _interpolateDeliveryEmail = (html, order) => {
  const {
    delivery,
    orderID,
  } = order;

  const {
    estimatedDelivery,
    trackingCode
  } = delivery;

  html = html.replace("{{order_number}}", orderID)
  html = html.replace("{{name}}", (!!delivery && !!delivery.firstName ? delivery.firstName : "there"));
  html = html.replace("{{tracking_code}}", trackingCode);
  html = html.replace("{{estimated_delivery}}", estimatedDelivery);

  return html;
}

const _interpolateEmail = (html, order, items, shipping) => {
  const {
    delivery,
    orderID
  } = order;

  html = html.replace("{{name}}", (!!delivery && !!delivery.firstName ? delivery.firstName : "there"));
  html = html.replace("{{address_name}}", (delivery.firstName + " " + delivery.lastName))
  html = html.replace("{{address_street}}", delivery.address)
  html = html.replace("{{address_city}}", delivery.city)
  html = html.replace("{{address_zip}}", delivery.zip)
  html = html.replace("{{delivery_type}}", shipping.name)
  html = html.replace("{{expected_delivery}}", shipping.deliveryDescription)
  html = html.replace("{{order_number}}", orderID)
  html = html.replace("{{order_items}}", _orderToHtml(order, items, shipping.price))

  return html;
}

const _orderToHtml = (order, items, shippingPrice) => {
  const {
    usedCouponCode,
    totalPrice
  } = order;

  return `
  <table>
    <tr>
      <th>Beskrivelse</th>
      <th>Kvantitet</th> 
      <th>Pris pr. stk</th>
    </tr>

    ${
      items.reduce((acc, item) => {
        return acc + `
          <tr class="order-item">
            <td>
              <a href="${item.link}">
                ${item.description} (${item.variation.combination.map(c => c.label).join(', ')})
              </a>
            </td>
            <td>
              ${item.quantity}
            </td> 
            <td>
              ${item.price} DKK
            </td>
          </tr>
          `;
      }, "")
    }

    <tr class="table-footer">
      <td></td>
      <td></td>
      <td>
        ${!!usedCouponCode && usedCouponCode !== "false" ? `<p>Brugt coupon: ${usedCouponCode}</p>` : ''}
        <p>Levering ${shippingPrice} DKK</p>
        <p>
          <strong>
            Total ${totalPrice} DKK
          </strong>
        </p>
      </td>
    </tr>

  </table>
  `;
}

export {
  getTemplate
}