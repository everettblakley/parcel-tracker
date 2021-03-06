export function doAPICall(args) {
  const { isDev } = args || false;
  const { trackingNumber } = args;
  if (!isDev) {
    return fetch("https://package.place/api/track/" + trackingNumber);
  }

  if (trackingNumber === "4337360760364248") {
    return new Promise((resolve) => resolve({
      status: 200,
      json: () => ({
        "CANADA_POST": [{ "timestamp": "2020-08-31T19:36:04-04:00", "status": "Electronic information submitted by shipper", "location": { "city": "", "state": "", "postalCode": "" } }, { "timestamp": "2020-09-03T11:48:33-05:00", "status": "Item processed", "location": { "city": "WINNIPEG", "state": "MB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-03T21:02:03-05:00", "status": "Item departed", "location": { "city": "WINNIPEG", "state": "MB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-04T06:07:00-06:00", "status": "Item arrived", "location": { "city": "REGINA", "state": "SK", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-04T06:16:02-06:00", "status": "Item departed", "location": { "city": "REGINA", "state": "SK", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-04T15:18:04-06:00", "status": "Item arrived", "location": { "city": "CALGARY", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-05T18:34:09-06:00", "status": "Item processed", "location": { "city": "CALGARY", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-06T17:04:25-04:00", "status": "Shipment received at originating postal facility", "location": { "city": "TORONTO", "state": "ON", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-07T01:24:26-06:00", "status": "Item departed", "location": { "city": "CALGARY", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-07T08:30:59-06:00", "status": "Item arrived", "location": { "city": "LETHBRIDGE", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-07T12:05:02-06:00", "status": "Item processed", "location": { "city": "LETHBRIDGE", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-08T09:39:01-06:00", "status": "Item out for delivery", "location": { "city": "LETHBRIDGE", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-08T13:18:47-06:00", "status": "Delivered to your community mailbox, parcel locker or apt./condo mailbox", "location": { "city": "LETHBRIDGE", "state": "AB", "country": "Canada", "postalCode": "" } }]
      })
    }));
  } else if (trackingNumber === "4010765063638021") {
    return new Promise((resolve) => resolve({
      status: 200,
      json: () => ({
        "CANADA_POST": [{ "timestamp": "2020-09-14T19:25:43-06:00", "status": "Electronic information submitted by shipper", "location": { "city": "", "state": "", "postalCode": "" } }, { "timestamp": "2020-09-14T19:41:54-06:00", "status": "Item processed", "location": { "city": "CALGARY", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-14T22:01:08-06:00", "status": "Item in transit", "location": { "city": "CALGARY", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-15T07:24:58-06:00", "status": "Item processed", "location": { "city": "LETHBRIDGE", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-15T10:40:49-06:00", "status": "Item out for delivery", "location": { "city": "LETHBRIDGE", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-15T13:59:36-06:00", "status": "Notice card left indicating where and when to pick up item", "location": { "city": "LETHBRIDGE", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-15T19:23:39-06:00", "status": "Item available for pickup at Post Office", "location": { "city": "LETHBRIDGE", "state": "AB", "country": "Canada", "postalCode": "" } }, { "timestamp": "2020-09-17T11:36:57-06:00", "status": "Delivered", "location": { "city": "LETHBRIDGE", "state": "AB", "country": "Canada", "postalCode": "" } }]
      })
    }));
  } else if (trackingNumber === "392404625680") {
    return new Promise((resolve) => resolve({
      status: 200,
      json: () => ({
        "FEDEX": [{ "timestamp": "2020-05-01T13:59:00+00:00", "status": "Delivered", "location": "LETHBRIDGE, AB" }]
      })
    }));
  } else {
    return new Promise((resolve, reject) => reject({ status: 404 }));
  }
}