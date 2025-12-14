export interface Quote {
  text: string;
  author: string;
  textNl: string;
}

export const quotes: Quote[] = [
  {
    text: "No mother should have to choose between bureaucracy and feeding her child.",
    author: "momslikeme",
    textNl: "Geen moeder zou moeten kiezen tussen bureaucratie en haar kind voeden."
  }
];

export const getRandomQuote = (): Quote => {
  return quotes[0];
};
