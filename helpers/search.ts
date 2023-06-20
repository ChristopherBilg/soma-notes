export const matchesSearch = (search: string, text: string): boolean => {
  if (search.length === 0) {
    return true;
  }

  const searchWords = search.split(" ");
  const textWords = text.split(" ");

  return searchWords.every((searchWord) => {
    return textWords.some((textWord) => {
      return textWord.toLowerCase().includes(searchWord.toLowerCase());
    });
  });
};
