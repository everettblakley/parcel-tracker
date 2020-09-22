export const toSentenceCase = (text: string) => {
  return text.replace(/\w\S*/g, function (text) {
    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  });
};

export const replaceUnderScores = (text: string) => {
  return text.replace(/_/g, " ");
};