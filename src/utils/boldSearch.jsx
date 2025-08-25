const boldSearch = (text, query) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  const slice = text.split(regex);

  return slice.map((slice, index) =>
    regex.test(slice) ? (
      <span key={index} style={{ fontWeight: 'bold' }}>
        {slice}
      </span>
    ) : (
      slice
    )
  );
};

export default boldSearch;
