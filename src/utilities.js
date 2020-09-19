export const toSentenceCase = (text) => {
  return text.replace(/\w\S*/g, function (text) {
    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  });
}

export const replaceUnderScores = (text) => {
  return text.replace(/_/g, " ");
}

export const carrierName = (name) => {
  name = replaceUnderScores(name);
  name = toSentenceCase(name);
  return name;
}

export const initializeData = (data) => {
  Object.keys(data).forEach((key) => {
    data[key].forEach((value, index) => {

      // Sentence case the city names
      if (value.location && value.location.city) {
        data[key][index].location.city = toSentenceCase(data[key][index].location.city);
      }

      // Give each input a selected value
      data[key][index].selected = false;

      // Give each input an empty object for a feautre
      data[key][index].feature = undefined;
    });

    // Sort the data based on the timestamp
    data[key] = data[key].sort((a, b) => {
      return a.timestamp < b.timestamp
        ? -1
        : a.timestamp > b.timestamp
          ? 1
          : 0;
    })

    // Replace the keys with properly named keys
    const newKey = carrierName(key);
    data[newKey] = data[key];
    delete data[key];
  });

  return data;
}

