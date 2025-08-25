// new URL(url) only takes valid url as input

export const isValidUrl = url => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
