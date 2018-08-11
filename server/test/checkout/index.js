require('dotenv').config();
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const domain = process.env.PUBLIC_URL;

describe('Checkout API', async () => {
  let order;
  beforeEach(async () => {
    order = {
      "first_name": "Christopher",
      "last_name": "Dengsø",
      "email": "chrdengso@gmail.com",
      "phone": "+4424658061",
      "newsletter_subscribe": false,
      "address": "Østerbrogade 147",
      "city": "København Ø",
      "zip": "2100",
      "country": "Danmark",
      "items": [{
        "_id": "5b0e9ca262d36a246f64abba",
        "__v": 1,
        "description": "Rød sweatshirt med hvid brodering. Den er lavet på 100% økologisk bomuld, og brushed på indersiden. Produceret i Portugal.",
        "price": 650,
        "SKU": "SWEATB",
        "variation": {
          "id": "MEDIUM_RED",
          "sort": 5,
          "sku": "SWEATB_MEDIUM_RED",
          "price": 650,
          "inventory": 3,
          "used": true,
          "combination": [{
            "id": 2,
            "color": "rgba(229, 89, 52, 1)",
            "label": "medium"
          }, {
            "id": 6,
            "color": "rgba(91, 192, 235, 1)",
            "label": "red"
          }],
          "combinationIds": [2, 6]
        },
        "quantity": 1
      }],
      "shipping": {
        "_id": "5a50d12438804e181f59055c",
        "name": "Standard delivery",
        "deliveryDescription": "Delivered within 20 working days.",
        "description": "No delivery on Public Holidays. All orders are subject to Customs and Duty charges, payable by the recipient of the order.",
        "price": 50,
        "pacsoftCode": "PDK17",
        "pickupPoint": false
      },
      "coupon_code": false,
      "total_price": 700,
      "card_token": "tok_visa"
    };
  });

  describe('POST /api/checkout', () => {
    it('should create a new order when request is ok', () => {
      return request(domain)
        .post('/api/checkout')
       // .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(order)
        .expect(httpStatus.CREATED)
        .then((res) => {
          console.log(res)
        });
    });
  });

  // describe('POST /api/confirm', () => {
  //   it('should create a new order when request is ok', () => {
  //     return request(domain)
  //       .post('/api/confirm')
  //      // .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send(order)
  //       .expect(httpStatus.CREATED)
  //       .then((res) => {
  //         console.log(res)
  //       });
  //   });
  // });

});