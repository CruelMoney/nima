import fs from 'fs-extra';
import { selectLimit } from 'async';
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
const domain = "https://api.unifaun.com/rs-extapi/v1";
const unifaunKey = "XJ522I4AVICQFOVX-IIWR2XMRK5JS5SOD7TA2PEE5";
const postNordKey = '69fdacac1f8eb433fe6dd0e10680cf90';
const postNordDomain = 'https://api2.postnord.com';
var cache = require('memory-cache');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
    delivery,
    pacsoftCode
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
        "country": delivery.countryCode,
        "city": delivery.city
      },
      "senderPartners": [{
        "id": "PDK",
        "custNo": "220000787"
      }],
      "service": {
        "id": pacsoftCode, // Collect eller til dør
        "addons": [
        {
          "id": "NOTEMAIL", // Email notification
          "custNo": "220000787"
        },
        {
          "id": "NOTSMS", // SMS notification
          "misc": order.phone,
          "custNo": "220000787"
        }]
      },
      "options":[
        {
          "id": "ENOT", // Pre notification email with tracking
        }
      ]
    }
  }  
} 

const getCacheElseFetch = async (url) => {
  let data = JSON.parse(cache.get(url));
  if(!!data){
    console.log("using shipping cache");
    return data;
  }
  console.log("Fetching shipping");
  data = await fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + unifaunKey,
    })
  }).then(result => result.json());
  return cache.put(url, JSON.stringify(data), 1000*60*10); // Save for 10 minutes
}

const getOrderShipment =  async (order) => {
  const shipment = orderToShipping(order);

  try {
    const result = await fetch(domain+'/shipments?inlinePdf=true', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + unifaunKey,
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
      
      const parcels = data.parcels;
      const parcelID = parcels.length !== 0 ? parcels[0].parcelNo : undefined;

      return {
        parcelID: parcelID,
        id: data.id,
        label: labelLink
      }
    }
  } catch (error) {
    throw error;
  }
} 


const getOrderShippingStatus = async (orderID, fetchId=0) => {
  const data = await getCacheElseFetch(domain+'/shipments?fetchId='+fetchId);
  if(!data.shipments){throw new Error('Shipment not found')};
  const shipment = data.shipments.find(s=>s.id === orderID);
  if(!!shipment && !!shipment.status){
    return shipment.status.toLowerCase();
  }
  if(!data.done && fetchId !== data.fetchId){
    if(data.minDelay){
      await sleep(data.minDelay);
    }
    return await getOrderShippingStatus(orderID, data.fetchId);
  }
}


const getShippings = () => {
  return fetch(domain+'/shipments?fetchId=0', {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + unifaunKey,
    })
  }).then(result => result.json());
} 

const getShipping = (id) => {
  return fetch(domain+'/shipments/'+id+'/pdfs', {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + unifaunKey,
    })
  }).then(result =>{
    return result.json()});
}


const getShippingStatus = async ({parcelID}) => {
  const requesturl =  
    postNordDomain +
    '/rest/shipment/v1/trackandtrace/findByIdentifier.json?' +
    'apikey=' + postNordKey + 
    '&id=' + encodeURI(parcelID) +
    '&locale=da';

    return fetch(requesturl ,{
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(result => result.json())
    .then(data => {
      const shipments = data.TrackingInformationResponse.shipments;
      if(shipments.length === 0){
        throw new Error("No shipments found");
      }
      return shipments[0];
    })
    .catch(error => error);
}

const getDeliveryPoints = ({zip, city, street, countryCode}) => {
  const requesturl =  
    postNordDomain +
    '/rest/businesslocation/v1/servicepoint/findNearestByAddress.json?'+
    'apikey=' + postNordKey +
    '&countryCode='+encodeURI(countryCode) +
    '&postalCode='+encodeURI(zip) +
    '&city='+encodeURI(city) +
    '&streetName='+encodeURI(street);

  return fetch(requesturl ,{
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(result => result.json())
    .catch(error => error);
}


export{
  getOrderShipment,
  getOrderShippingStatus,
  getShipping,
  getShippings,
  getShippingStatus,
  getDeliveryPoints
}