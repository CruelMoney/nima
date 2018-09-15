import fetchInstas from '../instagram';

var fs = require('fs');

const getTemplate = async ({
  type,
  order,
  items,
  coupon,
  shipping
}) => {
  // fetch current instas
  
  try {
    const instas = await fetchInstas({tag: "nimacph", count: 4});
    order.instas = instas;
  } catch (error) {
    order.instas = [];
  }
 
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
    orderID,
    instas
  } = order;

  const {
    code,
    discount,
    uses
  } = coupon;

  html = html.replace(/{{name}}/g, (!!delivery && !!delivery.firstName ? delivery.firstName : "there"));
  html = html.replace(/{{coupon_code}}/g, code);
  html = html.replace(/{{discount}}/g, discount);
  html = html.replace(/{{uses}}/g, uses);
  html = html.replace(/{{instagram}}/g, _instagramToHtml(instas))

  return html;
}

const _interpolateDeliveryEmail = (html, order) => {
  const {
    delivery,
    orderID,
    instas
  } = order;

  const {
    estimatedDelivery,
    trackingCode
  } = delivery;

  html = html.replace(/{{order_number}}/g, orderID)
  html = html.replace(/{{name}}/g, (!!delivery && !!delivery.firstName ? delivery.firstName : "there"));
  html = html.replace(/{{tracking_code}}/g, trackingCode);
  html = html.replace(/{{estimated_delivery}}/g, estimatedDelivery);
  html = html.replace(/{{instagram}}/g, _instagramToHtml(instas))

  return html;
}

const _interpolateEmail = (html, order, items, shipping) => {
  const {
    delivery,
    orderID,
    instas
  } = order;

  html = html.replace(/{{name}}/g, (!!delivery && !!delivery.firstName ? delivery.firstName : "there"));
  html = html.replace(/{{address_name}}/g, (delivery.firstName + " " + delivery.lastName))
  html = html.replace(/{{address_street}}/g, delivery.address)
  html = html.replace(/{{address_city}}/g, delivery.city)
  html = html.replace(/{{address_zip}}/g, delivery.zip)
  html = html.replace(/{{delivery_type}}/g, shipping.name)
  html = html.replace(/{{expected_delivery}}/g, shipping.deliveryDescription)
  html = html.replace(/{{order_number}}/g, orderID)
  html = html.replace(/{{order_items}}/g, _orderToHtml(order, items, shipping.rateAmount))
  html = html.replace(/{{instagram}}/g, _instagramToHtml(instas))
  
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

const _instagramToHtml = (instas) => {
  return `
<style>
.instagram-wrapper{
  margin-left: -1em;
  margin-right: -1em;
}
.instagram-wrapper hr{
  margin: 2em 0.5em;
}
.instagram-wrapper .center{
  text-align: center;
  margin-bottom: 1em;
}
.instagram-wrapper h3{
  margin-bottom: 0.3em;
}
.instagram-wrapper .center a{
  color: #111 ;
  text-decoration: none;
}

.instagram{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.insta{
  position: relative;
  flex-basis: 25%;
}
.insta:first-child{
  margin-left: 0;
}
.insta:last-child{
  margin-right: 0;
}

.insta:before{
	content: "";
	display: block;
	padding-top: 100%; 	/* initial ratio of 1:1*/
}

.insta > *{
  position:  absolute;
	top: 0.5em;
	left: 0.5em;
	bottom: 0.5em;
	right: 0.5em;
}


@media only screen and (max-width:  768px){
  .insta{
    flex-basis: 50%;
  }
  .instagram-wrapper{
    margin: auto;
    max-width: 500px;
  }
}

@media only screen and (max-width:  375px){

  hr.bottom{
    display: none;
  }

}
</style>

    <section class="instagram-wrapper">
      <div class="center"><a href="https://www.instagram.com/nimacph">
          <h3>BLIV EN DEL AF FAMILIEN</h3>
          <p>Del dit look ved at tagge #nimacph på instagram.</p>
        </a></div>
      <div class="instagram">

      ${
        instas.reduce((acc, item) => {
          return acc + `
          <div class="insta">
          <a href="https://www.instagram.com/p/${item.shortcode}" target="_blank" rel="noopener">
          <img draggable="false" src="${item.thumbnail_src}">
          </a>
         </div>
            `;
        }, "")
      }

      </div>
      <hr class="bottom">
    </section>
  `;
}

export {
  getTemplate
}