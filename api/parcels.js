module.exports = (request, response) => {
  let data;
  // data = { "CANADA_POST": [{ "timestamp": "2020-09-14T19:25:43-06:00", "status": "Electronic information submitted by shipper", "location": { "city": "", "state": "", "postalCode": "" } }, { "timestamp": "2020-09-14T19:41:54-06:00", "status": "Item processed", "location": { "city": "CALGARY", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-14T22:01:08-06:00", "status": "Item in transit", "location": { "city": "CALGARY", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-15T07:24:58-06:00", "status": "Item processed", "location": { "city": "LETHBRIDGE", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-15T10:40:49-06:00", "status": "Item out for delivery", "location": { "city": "LETHBRIDGE", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-15T13:59:36-06:00", "status": "Notice card left indicating where and when to pick up item", "location": { "city": "LETHBRIDGE", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-15T19:23:39-06:00", "status": "Item available for pickup at Post Office", "location": { "city": "LETHBRIDGE", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-17T11:36:57-06:00", "status": "Delivered", "location": { "city": "LETHBRIDGE", "state": "AB", "country": "Canada", "postalCode": "" } }] };

  console.log(request);

  // fetch("https://package.place/api/track/")
  //   .then((data) => response.status(200).send(data))
  //   .catch((error) => response.status(500).send(error));
  response.status(200).send({ "data": undefined });
};