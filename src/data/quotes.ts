export interface Quote {
  text: string;
  author: string;
  textNl: string;
}

export const quotes: Quote[] = [
  {
    text: "A system that works for everyone is not charity—it's justice.",
    author: "Adapted from bell hooks",
    textNl: "Een systeem dat voor iedereen werkt is geen liefdadigheid—het is gerechtigheid."
  },
  {
    text: "We ask to be seen as we are, not as they fear we might be.",
    author: "Zora Neale Hurston",
    textNl: "We vragen gezien te worden zoals we zijn, niet zoals zij vrezen dat we zouden kunnen zijn."
  },
  {
    text: "Caring for myself is not self-indulgence, it is self-preservation, and that is an act of political warfare.",
    author: "Audre Lorde",
    textNl: "Voor mezelf zorgen is geen zelfzucht, het is zelfbehoud, en dat is een daad van politieke strijd."
  },
  {
    text: "There is no such thing as a single-issue struggle because we do not live single-issue lives.",
    author: "Audre Lorde",
    textNl: "Er bestaat niet zoiets als een strijd voor één kwestie, omdat we geen levens leiden met één kwestie."
  },
  {
    text: "Single mothers are not a burden on society. We ARE society.",
    author: "momslikeme",
    textNl: "Alleenstaande moeders zijn geen last voor de maatschappij. Wij ZIJN de maatschappij."
  },
  {
    text: "The system was not broken. It was built this way. Time to rebuild.",
    author: "momslikeme",
    textNl: "Het systeem was niet kapot. Het was zo gebouwd. Tijd om opnieuw te bouwen."
  },
  {
    text: "They tried to bury us. They didn't know we were seeds.",
    author: "Mexican Proverb",
    textNl: "Ze probeerden ons te begraven. Ze wisten niet dat wij zaden waren."
  },
  {
    text: "I raise up my voice—not so I can shout, but so that those without a voice can be heard.",
    author: "Malala Yousafzai",
    textNl: "Ik verhef mijn stem—niet om te schreeuwen, maar zodat zij zonder stem gehoord kunnen worden."
  },
  {
    text: "No mother should have to choose between bureaucracy and feeding her child.",
    author: "momslikeme",
    textNl: "Geen moeder zou moeten kiezen tussen bureaucratie en haar kind voeden."
  }
];

export const getRandomQuote = (): Quote => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};
