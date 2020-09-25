jest.mock("mapbox-gl");
jest.mock("@mapbox/mapbox-sdk");
jest.mock("@mapbox/mapbox-sdk/services/geocoding");

import * as utils from "../utilities/dataUtilities";
import * as testData from "./testData.json";

describe("getLocation", () => {
  test("returns undefined for no input", () => {
    let data = { location: undefined };
    let result = utils.getLocation(data);
    expect(result).toBeUndefined();
  });

  test("returns the string if given a string", () => {
    let data = { location: "some string" };
    let result = utils.getLocation(data);
    expect(result).toEqual("some string");
  });

  test("returns a location object", () => {
    let data = {
      location: {
        city: "some city",
        state: "Some state",
        country: "some country",
        postalCode: "H0H 0H0"
      }
    };
    let result = utils.getLocation(data)
    expect(result).toHaveProperty("city", "Some City");
    expect(result).toHaveProperty("state", "Some state");
    expect(result).toHaveProperty("country", "Some Country");
    expect(result).toHaveProperty("postalCode", "H0H 0H0");
  });
});

// describe("compareLocations", () => {
//   test("works for string locations", () => {
//     let location1 : LocationOrString = "some location";
//     let location2 : LocationOrString = "some location";
//     let result = utils.compareLocations([location1, location2]);
//     expect(result).toBeTruthy();

//     location2 = "some other location";
//     result = utils.compareLocations([location1, location2]);
//     expect(result).toBeFalsy();
//   });

//   test("works for Location objects", () => {
//     let location1 = new Location("city", "state", "country");
//     let location2 = new Location("city", "state", "country");
//     let result = utils.compareLocations([location1, location2]);
//     expect(result).toBeTruthy();

//     location2 = new Location("some other city", "state", "country");
//     result = utils.compareLocations([location1, location2]);
//   });
// });

describe("combineLocations", () => {
  beforeEach(() => {
    utils.lib.init = jest.fn(() => ({ geocodingClient: undefined }));
  });

  test("can parse malformed data", async () => {
    const data = testData.data[0]["CANADA_POST"];
    const parsedData: any[] = await utils.combineLocations(data);
    expect(parsedData).toHaveLength(4);
  });

  test("can parse normal data", async () => {
    const data = testData.data[1]["CANADA_POST"];
    const parsedData: any[] = await utils.combineLocations(data);
    expect(parsedData).toHaveLength(6);
  });

  test("can parse only one data point", async () => {
    const data = testData.data[2]["FEDEX"];
    const parsedData: any[] = await utils.combineLocations(data);
    expect(parsedData).toHaveLength(1);
  });

});