export type QuickscanDomain =
  | "Doelgroep & Focus"
  | "Positionering"
  | "Instroom"
  | "Conversie"
  | "Sturing";

export type QuickscanQuestion = {
  id: number;
  domain: QuickscanDomain;
  statement: string;
};

export type QuickscanAction = {
  title: string;
  what: string;
  why: string;
  result: string;
};

export type QuickscanResult = {
  scores: Record<QuickscanDomain, number>;
  lowestDomain: QuickscanDomain;
  summary: string;
  priorityTitle: string;
  actions: QuickscanAction[];
  avoid: string;
};

export const likertOptions = [
  { label: "Helemaal niet van toepassing", value: 1 },
  { label: "Beperkt van toepassing", value: 2 },
  { label: "Deels van toepassing", value: 3 },
  { label: "Goed van toepassing", value: 4 },
  { label: "Helemaal van toepassing", value: 5 },
];

export const quickscanQuestions: QuickscanQuestion[] = [
  {
    id: 1,
    domain: "Doelgroep & Focus",
    statement: "Mijn gym richt zich duidelijk op één type klant.",
  },
  {
    id: 2,
    domain: "Doelgroep & Focus",
    statement: "In mijn marketing spreek ik een specifieke doelgroep aan.",
  },
  {
    id: 3,
    domain: "Doelgroep & Focus",
    statement: "Mensen herkennen zichzelf direct in mijn communicatie.",
  },
  {
    id: 4,
    domain: "Doelgroep & Focus",
    statement: "Ik trek vooral leads aan die goed passen bij mijn gym.",
  },
  {
    id: 5,
    domain: "Doelgroep & Focus",
    statement:
      "Mijn marketingboodschap is specifiek genoeg om niet te blijven hangen in algemene teksten.",
  },

  {
    id: 6,
    domain: "Positionering",
    statement:
      "Het is voor nieuwe mensen direct duidelijk waar mijn gym voor staat.",
  },
  {
    id: 7,
    domain: "Positionering",
    statement:
      "Mijn communicatie gaat verder dan alleen wat we aanbieden (fitness, lessen, etc.).",
  },
  {
    id: 8,
    domain: "Positionering",
    statement: "Ik laat duidelijk zien wat iemand bij ons kan bereiken.",
  },
  {
    id: 9,
    domain: "Positionering",
    statement:
      "Mijn uitstraling op website, socials en in de club voelt overal hetzelfde.",
  },
  {
    id: 10,
    domain: "Positionering",
    statement:
      "Mensen kiezen bewust voor mijn gym en niet alleen op prijs of locatie.",
  },

  {
    id: 11,
    domain: "Instroom",
    statement: "Ik krijg structureel nieuwe leads binnen.",
  },
  {
    id: 12,
    domain: "Instroom",
    statement:
      "Ik ben niet afhankelijk van losse acties of seizoensmomenten voor nieuwe instroom.",
  },
  {
    id: 13,
    domain: "Instroom",
    statement: "Mijn marketing levert regelmatig nieuwe leads op.",
  },
  {
    id: 14,
    domain: "Instroom",
    statement: "Mensen kunnen makkelijk contact opnemen of zich aanmelden.",
  },
  {
    id: 15,
    domain: "Instroom",
    statement: "Mijn instroom voelt voorspelbaar en stabiel.",
  },

  {
    id: 16,
    domain: "Conversie",
    statement: "De meeste leads leiden tot een afspraak of intake.",
  },
  {
    id: 17,
    domain: "Conversie",
    statement: "Mensen komen daadwerkelijk opdagen op afspraken.",
  },
  {
    id: 18,
    domain: "Conversie",
    statement: "Een groot deel van mijn leads wordt uiteindelijk lid.",
  },
  {
    id: 19,
    domain: "Conversie",
    statement: "Ik volg nieuwe leads snel en consequent op.",
  },
  {
    id: 20,
    domain: "Conversie",
    statement: "Ik weet waar leads afhaken tussen aanvraag en inschrijving.",
  },

  {
    id: 21,
    domain: "Sturing",
    statement:
      "Ik heb duidelijk overzicht van mijn leads, afspraken en nieuwe leden.",
  },
  {
    id: 22,
    domain: "Sturing",
    statement: "Ik weet welke cijfers belangrijk zijn voor mijn groei.",
  },
  {
    id: 23,
    domain: "Sturing",
    statement: "Ik kijk regelmatig naar mijn cijfers en resultaten.",
  },
  {
    id: 24,
    domain: "Sturing",
    statement: "Ik gebruik mijn cijfers om beslissingen te nemen.",
  },
  {
    id: 25,
    domain: "Sturing",
    statement: "Ik weet waar ik moet bijsturen als resultaten tegenvallen.",
  },
];

const domainOutputs: Record<
  QuickscanDomain,
  Omit<QuickscanResult, "scores" | "lowestDomain">
> = {
  "Doelgroep & Focus": {
    summary:
      "Op dit moment richt je je waarschijnlijk vooral op mensen die al gemotiveerd zijn om te sporten. De grootste groeikans zit juist bij de groep die weet dat ze iets moeten doen, maar de stap nog niet zet. Denk aan mensen die zich niet comfortabel voelen in een sportschool, niet weten waar ze moeten beginnen of het simpelweg uitstellen.",
    priorityTitle: "Jouw grootste aandachtspunt: Doelgroep & Focus",
    actions: [
      {
        title: "Richt je marketing op mensen die nog niet zijn begonnen",
        what:
          "Maak je marketing specifiek voor mensen die twijfelen om te starten en benoem situaties zoals uitstellen, onzekerheid of niet weten waar te beginnen.",
        why:
          "Deze groep is groot, maar reageert alleen als ze zich echt begrepen voelen.",
        result:
          "Meer instroom van mensen die je nu nog niet bereikt.",
      },
      {
        title: "Laat zien dat beginnen spannend mag zijn",
        what:
          "Benoem in je communicatie dat starten met sporten lastig en spannend kan zijn en dat dat normaal is.",
        why:
          "Veel mensen haken af voordat ze beginnen, puur omdat de drempel te hoog voelt.",
        result: "Meer vertrouwen en een lagere instapdrempel.",
      },
      {
        title: "Positioneer jezelf als begeleider, niet alleen als sportschool",
        what:
          "Laat duidelijk zien dat je mensen helpt op weg met begeleiding, structuur en aandacht vanaf het begin.",
        why:
          "Mensen zoeken geen fitnessruimte, maar houvast om vol te houden.",
        result:
          "Betere aansluiting met de juiste doelgroep en meer betrokken leden.",
      },
    ],
    avoid:
      "Blijf je marketing niet richten op iedereen of vooral op fitte mensen. Daarmee spreek je vooral mensen aan die de stap toch al zouden zetten.",
  },

  Positionering: {
    summary:
      "Op dit moment is het voor een potentiële klant niet direct duidelijk waarom hij juist voor jouw gym moet kiezen. De kans is groot dat je vooral laat zien wat je hebt, zoals apparatuur, lessen of de ruimte. Dat draagt bij aan de beleving, maar is zelden de reden waarom iemand de stap zet om te beginnen. Juist herkenning en gevoel maken het verschil.",
    priorityTitle: "Jouw grootste aandachtspunt: Positionering",
    actions: [
      {
        title: "Maak duidelijk waar je voor staat",
        what:
          "Laat in je communicatie zien voor wie jouw gym bedoeld is en waar je mensen mee helpt.",
        why:
          "Mensen kiezen geen sportschool op basis van apparatuur, maar op basis van gevoel en herkenning.",
        result: 'Meer mensen die denken: "dit past bij mij".',
      },
      {
        title: "Zorg dat jouw verhaal overal hetzelfde voelt",
        what:
          "Zorg dat website, socials, advertenties en clubbeleving hetzelfde gevoel en dezelfde boodschap uitstralen.",
        why:
          "Als online beeld en echte ervaring overeenkomen, ontstaat direct vertrouwen.",
        result: "Minder twijfel en een sterkere eerste indruk bij nieuwe leads.",
      },
      {
        title: "Laat zien hoe jij het anders doet dan anderen",
        what:
          "Maak concreet waarin jij verschilt van andere clubs in jouw omgeving, vooral in begeleiding en aanpak.",
        why:
          "Zonder duidelijk verschil is er geen reden om voor jou te kiezen.",
        result: "Minder prijsvergelijking en meer keuze op basis van waarde.",
      },
    ],
    avoid:
      "Blijf niet focussen op apparatuur, faciliteiten of de mooiste gym als hoofdboodschap. Dat maakt indruk, maar zorgt zelden voor echte keuze of betrokkenheid.",
  },

  Instroom: {
    summary:
      "Je instroom van nieuwe leads is op dit moment niet stabiel genoeg om structureel te groeien. Waarschijnlijk heb je wel momenten waarop er leads binnenkomen, maar dit is niet iets waar je op kunt rekenen. Groei blijft daardoor afhankelijk van acties, seizoenen of toeval.",
    priorityTitle: "Jouw grootste aandachtspunt: Instroom",
    actions: [
      {
        title: "Zorg voor één vaste manier om nieuwe leads te krijgen",
        what:
          "Kies één kanaal of aanpak waarmee je structureel leads wilt genereren en focus daar eerst op.",
        why:
          "Zolang je afhankelijk bent van losse dingen, bouw je nergens echt volume op.",
        result: "Meer voorspelbaarheid in het aantal leads.",
      },
      {
        title: "Werk met een instapaanbod dat leidt tot echte betrokkenheid",
        what:
          "Werk met een duidelijk instapaanbod voor een vaste periode en een vast bedrag, met actieve begeleiding in de eerste weken.",
        why:
          "De eerste weken bepalen of iemand sporten onderdeel maakt van zijn ritme of niet.",
        result:
          "Meer betrokkenheid in de eerste weken en een hogere kans op doorstroom naar lidmaatschap.",
      },
      {
        title: "Maak reageren en aanmelden zo makkelijk mogelijk",
        what:
          "Zorg dat iemand direct een aanvraag kan doen via een simpele route, zonder onnodige drempels.",
        why:
          "Hoe meer stappen iemand moet zetten, hoe groter de kans dat hij afhaakt.",
        result: "Meer leads uit hetzelfde bereik.",
      },
    ],
    avoid:
      "Blijf niet werken met losse proeflessen of korte acties zonder vervolg en begeleiding. Dat levert wel interesse op, maar te weinig binding.",
  },

  Conversie: {
    summary:
      "Op dit moment laat je vooral resultaat liggen in wat er gebeurt na een lead. De kans is groot dat je wel leads binnenkrijgt, maar dat te veel mensen afhaken tussen eerste contact en inschrijving. Daardoor voelt het alsof je meer leads nodig hebt, terwijl de grootste winst zit in wat je al binnenkrijgt.",
    priorityTitle: "Jouw grootste aandachtspunt: Conversie",
    actions: [
      {
        title: "Maak je intake concreet en duidelijk vooraf",
        what:
          "Leg vooraf helder uit wat iemand kan verwachten van een intake: wat gaan jullie doen, hoe lang duurt het en wat levert het op.",
        why:
          "Hoe duidelijker het is, hoe groter de kans dat iemand ook daadwerkelijk komt opdagen en serieus meedoet.",
        result:
          "Meer mensen die verschijnen en betere gesprekken tijdens de intake.",
      },
      {
        title: "Zorg voor snelle en consistente opvolging",
        what:
          "Reageer snel op nieuwe leads en werk met een vaste manier van opvolgen.",
        why:
          "De eerste uren na een lead bepalen vaak of iemand bij jou instapt of ergens anders.",
        result: "Meer afspraken uit hetzelfde aantal leads.",
      },
      {
        title: "Breng in kaart waar leads afhaken",
        what:
          "Kijk stap voor stap waar leads afhaken: na aanvraag, na eerste contact, na intake of na een proefperiode.",
        why:
          "Vaak verlies je op één specifiek punt de meeste mensen, zonder dat je dat doorhebt.",
        result: "Je weet precies waar je moet verbeteren.",
      },
    ],
    avoid:
      "Stop voorlopig niet meer budget in advertenties zolang je huidige proces nog niet optimaal is. Extra instroom levert dan relatief weinig op.",
  },

  Sturing: {
    summary:
      "Op dit moment heb je waarschijnlijk geen duidelijk en vast overzicht van wat er precies gebeurt binnen je instroom en nieuwe leden. Sommige sportscholen werken met systemen en dashboards, anderen houden het meer handmatig bij, maar in beide gevallen ontbreekt vaak de vertaalslag naar wat er beter kan.",
    priorityTitle: "Jouw grootste aandachtspunt: Sturing",
    actions: [
      {
        title: "Maak je proces inzichtelijk op jouw manier",
        what:
          "Zorg dat je overzicht hebt van leads, afspraken en nieuwe leden in een systeem, sheet of handmatig, zolang het maar duidelijk en consistent is.",
        why:
          "Zonder overzicht weet je niet waar je winst laat liggen.",
        result: "Meer grip op je groei, ongeacht hoe je het bijhoudt.",
      },
      {
        title: "Begrijp wat je cijfers betekenen",
        what:
          "Kijk niet alleen naar cijfers, maar vraag jezelf af wat ze zeggen. Kom je er niet uit, spar dan met je softwareleverancier, een collega of iemand uit je netwerk.",
        why:
          "Cijfers op zich zeggen weinig, het gaat om de betekenis erachter.",
        result: "Betere beslissingen en minder twijfel.",
      },
      {
        title: "Gebruik je inzicht om bij te sturen",
        what:
          "Koppel je overzicht direct aan acties. Weinig leads vraagt iets anders dan veel leads maar weinig leden.",
        why:
          "Zo voorkom je dat je overal tegelijk aan gaat sleutelen.",
        result: "Gerichte verbeteringen die echt effect hebben.",
      },
    ],
    avoid:
      "Werk niet zonder vast overzicht en ga niet alleen af op gevoel. En heb je wel cijfers, laat ze dan niet ongebruikt. In beide gevallen blijft groei vooral toeval.",
  },
};

export function calculateQuickscanScores(
  answers: number[]
): Record<QuickscanDomain, number> {
  const domains: QuickscanDomain[] = [
    "Doelgroep & Focus",
    "Positionering",
    "Instroom",
    "Conversie",
    "Sturing",
  ];

  const scores: Record<QuickscanDomain, number> = {
    "Doelgroep & Focus": 0,
    Positionering: 0,
    Instroom: 0,
    Conversie: 0,
    Sturing: 0,
  };

  domains.forEach((domain) => {
    const domainQuestions = quickscanQuestions.filter((q) => q.domain === domain);
    const domainAnswers = domainQuestions.map((q) => {
      const answer = answers[q.id - 1];
      return typeof answer === "number" ? answer : 0;
    });

    const total = domainAnswers.reduce((sum, value) => sum + value, 0);
    const average = total / domainAnswers.length;

    scores[domain] = Number(average.toFixed(1));
  });

  return scores;
}

export function getLowestScoringDomain(
  scores: Record<QuickscanDomain, number>
): QuickscanDomain {
  return Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0] as QuickscanDomain;
}

export function generateQuickscanResult(answers: number[]): QuickscanResult {
  const scores = calculateQuickscanScores(answers);
  const lowestDomain = getLowestScoringDomain(scores);
  const output = domainOutputs[lowestDomain];

  return {
    scores,
    lowestDomain,
    summary: output.summary,
    priorityTitle: output.priorityTitle,
    actions: output.actions,
    avoid: output.avoid,
  };
}
