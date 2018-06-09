import fs from 'fs-extra';
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
const domain = "https://api.unifaun.com/rs-extapi/v1";
const key = "XJ522I4AVICQFOVX-IIWR2XMRK5JS5SOD7TA2PEE5";

// Shipment status
// printed (Shipment is printed. Intial status).
// delivering (Shipment has arrived to a pickup location).
// dispatching (Shipment is en route).
// outfordelivery (Shipment is loaded on truck, en route to final destination).
// delivered (Shipment has been delivered).
// partdelivered (Shipment has been partly delivered).
// cancelled (Shipment is cancelled).
// returned (Shipment is returned to sender).

const orderToShipping = (order) => {
  const {
    items,
    orderID,
    delivery
  } = order;

  return {
    "pdfConfig": {
      "target4XOffset": 0,
      "target2YOffset": 0,
      "target1Media": "laser-2a5",
      "target1YOffset": 0,
      "target3YOffset": 0,
      "target2Media": "laser-2a5",
      "target4YOffset": 0,
      "target4Media": null,
      "target3XOffset": 0,
      "target3Media": null,
      "target1XOffset": 0,
      "target2XOffset": 0
    },
    "shipment": {
      "freeText1": JSON.parse(items).map(i => `${i.quantity}x${i.SKU}`).join(', '),
      "sender": {
        "phone": "+46 29 70 65 68",
        "email": "nimacph@gmail.com",
        "zipcode": "2200",
        "name": "Nima Copenhagen I/S",
        "address1": "Odins Tværgade 4",
        "country": "DK",
        "city": "KØBENHAVN N",
      },
      "parcels": [{
        "copies": "1",
        "weight": "0",
        "contents": "Clothes",
        "valuePerParcel": true
      }],
      "orderNo": "order number "+orderID,
      "receiver": {
        "phone": order.phone,
        "email": order.email,
        "zipcode": delivery.zip,
        "name":  `${delivery.firstName} ${delivery.lastName}`,
        "address1": delivery.address,
        "country": "DK",
        "city": delivery.city
      },
      "senderPartners": [{
        "id": "PDK",
        "custNo": "220000787"
      }],
      "service": {
        "id": delivery.type.pacsoftCode, // Collect eller til dør
        "addons": [{
          "id": "NOTEMAIL", // Email notification
          "custNo": "220000787"
        }]
      }
    }
  }  
} 

const saveLabel = async (orderID, data) => {
  
}

const getOrderShipment =  async (order) => {
  const shipment = orderToShipping(order);
  try {
    const result = await fetch(domain+'/shipments?inlinePdf=true', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key,
      },
      body: JSON.stringify(shipment)
    })
    const d = await result.json();
    if(!result.ok){
      throw new Error(JSON.stringify(d));
    }else{ 
      const data = d[0];
      const labelBase64 = data.pdfs[0].pdf;
      const basePath = `/labels/${order._id}.pdf`;
      await fs.outputFile(`${publicPath}${basePath}`, labelBase64, {encoding: 'base64'});
      const labelLink = process.env.PUBLIC_URL+basePath;
      return {
        id: data.id,
        label: labelLink
      }
    }
  } catch (error) {
    throw error;
  }
} 

const getOrderShippingStatus = (order) => {

}


const getShippings = () => {
  return fetch(domain+'/shipments?fetchId=0', {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + key,
    })
  }).then(result => result.json());
} 

const getShipping = (id) => {
  return fetch("https://api.unifaun.com/rs-extapi/v1/shipments/5571604/pdfs?inlinePdf=true", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + key,
    }
  }).then(result => result.json());
}


export{
  getOrderShipment,
  getShipping,
  getShippings
}