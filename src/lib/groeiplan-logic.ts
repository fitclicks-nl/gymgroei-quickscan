export type ScannerData = {
  gymName: string;
  email: string;
  gymType: string;
  memberCount: string;
  mainGoal: string;
  biggestChallenge: string;
  currentMarketing: string;
  hasStructure: string;
  marketingBudget: string;
};

export type GroeiplanStep = {
  title: string;
  description: string;
};

export type GroeiplanResult = {
  phase: string;
  bottleneckTitle: string;
  bottleneckDescription: string;
  steps: GroeiplanStep[];
  impactText: string;
};

const getPhase = (memberCount: string): string => {
  switch (memberCount) {
    case "< 150":
      return "Opbouwfase";
    case "150-300":
    case "150–300":
      return "Groeifase";
    case "300-600":
    case "300–600":
    case "600+":
      return "Optimalisatiefase";
    default:
      return "Groeifase";
  }
};

const getImpactText = (
  memberCount: string,
  marketingBudget: string,
  biggestChallenge: string,
  mainGoal: string
): string => {
  if (mainGoal === "Meer leden uit mijn huidige leads halen") {
    if (memberCount === "< 150") {
      return "Met betere opvolging haal je direct meer uit de leads die nu al binnenkomen.";
    }
    if (memberCount === "150-300" || memberCount === "150–300") {
      return "In de stap van lead naar lid laat je nu structureel kansen liggen.";
    }
    return "De grootste winst zit hier niet in meer leads, maar in meer leden uit wat al binnenkomt.";
  }

  if (mainGoal === "Betere kwaliteit leads") {
    return "De grootste winst zit aan de voorkant: duidelijker aantrekken wie wel past en sneller uitsluiten wie niet past.";
  }

  if (mainGoal === "Meer structuur en rust in mijn marketing") {
    return "Meer structuur zorgt niet alleen voor rust, maar maakt je groei ook beter voorspelbaar.";
  }

  if (biggestChallenge === "Lage conversie naar lid") {
    if (memberCount === "< 150") {
      return "Je laat ongeveer 4 tot 8 leden per maand liggen.";
    }
    if (memberCount === "150-300" || memberCount === "150–300") {
      return "Je laat ongeveer 8 tot 15 leden per maand liggen.";
    }
    return "Je laat ongeveer 12 tot 25 leden per maand liggen.";
  }

  if (biggestChallenge === "Slechte leads") {
    if (marketingBudget === "< €500") {
      return "Je rendement gaat nu vooral verloren doordat de verkeerde leads binnenkomen.";
    }
    if (marketingBudget === "€500-€1500" || marketingBudget === "€500–€1500") {
      return "Een deel van je budget gaat naar leads die uiteindelijk niet passen.";
    }
    return "Je verliest hier niet alleen potentiële leden, maar ook een deel van je advertentiebudget.";
  }

  if (biggestChallenge === "Geen structuur in marketing") {
    return "Zonder vaste aanpak blijft je groei afhankelijk van losse acties en toeval.";
  }

  if (biggestChallenge === "Te weinig leads") {
    if (marketingBudget === "< €500") {
      return "De grootste winst zit eerst in focus en structuur, niet in meer losse acties.";
    }
    return "Je campagnes en zichtbaarheid zijn nog niet scherp genoeg om consistent nieuwe leads aan te trekken.";
  }

  return "Je laat momenteel waarschijnlijk meer groeipotentieel liggen dan nodig is.";
};

const getScenario = (
  data: ScannerData
): Omit<GroeiplanResult, "phase" | "impactText"> => {
  const {
    biggestChallenge,
    currentMarketing,
    hasStructure,
    gymType,
    mainGoal,
  } = data;

  // 1. Lage conversie
  if (biggestChallenge === "Lage conversie naar lid") {
    if (mainGoal === "Meer leden uit mijn huidige leads halen") {
      return {
        bottleneckTitle: "Je haalt wel leads binnen, maar te weinig mensen worden lid",
        bottleneckDescription:
          "Je probleem zit waarschijnlijk niet in het aantal leads, maar in wat er daarna gebeurt. Er is interesse, maar te weinig mensen zetten de stap naar een lidmaatschap.",
        steps: [
          {
            title: "Je intake stuurt nog te weinig richting een duidelijke beslissing",
            description:
              "Het eerste gesprek werkt nu nog te weinig toe naar een concrete volgende stap, waardoor interesse te vrijblijvend blijft.",
          },
          {
            title: "Je opvolging is niet snel en consistent genoeg",
            description:
              "Hoe langer een lead blijft liggen, hoe kleiner de kans dat iemand nog instapt.",
          },
          {
            title: "Er ontbreekt een vaste structuur in je opvolging",
            description:
              "Zonder een vaste aanpak blijft te veel afhangen van losse momenten en toeval.",
          },
        ],
      };
    }

    return {
      bottleneckTitle: "Je haalt wel leads binnen, maar te weinig mensen worden lid",
      bottleneckDescription:
        "Er komt al interesse binnen, maar het rendement blijft achter in de stap daarna. Een deel van je leads haakt af voordat ze echt in beweging komen.",
      steps: [
        {
          title: "Je intake stuurt nog te weinig richting een beslissing",
          description:
            "Het eerste contact werkt nog onvoldoende toe naar een duidelijke vervolgstap.",
        },
        {
          title: "Je opvolging is niet snel genoeg",
          description:
            "Juist in de eerste fase na een aanvraag zit veel winst.",
        },
        {
          title: "Je mist een duidelijke structuur na de aanvraag",
          description:
            "Zonder vaste opvolging wordt de stap naar inschrijving te afhankelijk van toeval.",
        },
      ],
    };
  }

  // 2. Slechte leads + geen structuur
  if (
    biggestChallenge === "Slechte leads" &&
    (hasStructure === "Nee" || hasStructure === "Geen idee")
  ) {
    return {
      bottleneckTitle: "Er komen leads binnen, maar ze passen niet goed bij je gym",
      bottleneckDescription:
        "Het probleem zit niet in het aantal leads, maar in de kwaliteit. Zonder duidelijke selectie aan de voorkant komen er te veel mensen binnen die uiteindelijk niet passen.",
      steps: [
        {
          title: "Je doelgroep is nog te breed",
          description:
            "Daardoor trek je ook mensen aan die niet goed aansluiten op je gym.",
        },
        {
          title: "Aan de voorkant wordt nog onvoldoende gefilterd",
          description:
            "De stap van interesse naar aanvraag laat nu te veel mensen door die niet passen.",
        },
        {
          title: "Je maakt nog niet duidelijk genoeg voor wie je aanbod bedoeld is",
          description:
            "Daardoor komen ook de verkeerde mensen binnen.",
        },
      ],
    };
  }

  // 3. Slechte leads + wel structuur
  if (
    biggestChallenge === "Slechte leads" &&
    (hasStructure === "Ja, maar niet optimaal" || hasStructure === "Ja")
  ) {
    return {
      bottleneckTitle: "Je trekt nog niet de juiste mensen aan",
      bottleneckDescription:
        "De opvolging staat, maar aan de voorkant komt nog te veel verkeer binnen dat niet goed aansluit.",
      steps: [
        {
          title: "Je maakt nog niet duidelijk genoeg wat jouw gym uniek maakt",
          description:
            "Daardoor trek je ook mensen aan die minder goed passen.",
        },
        {
          title: "Je campagnes sluiten nog niet goed genoeg aan op je doelgroep",
          description:
            "De boodschap en de doelgroep liggen nog niet volledig in lijn.",
        },
        {
          title: "Je hebt nog onvoldoende inzicht in welke leads echt waardevol zijn",
          description:
            "Daardoor stuur je nog niet op de juiste kwaliteit.",
        },
      ],
    };
  }

  // 4. Te weinig leads + weinig marketing
  if (
    biggestChallenge === "Te weinig leads" &&
    (currentMarketing === "Vrijwel niets" || currentMarketing === "Ik doe alles zelf")
  ) {
    return {
      bottleneckTitle: "Er komen te weinig nieuwe mensen binnen",
      bottleneckDescription:
        "Je grootste probleem zit in de instroom. Er komen simpelweg te weinig nieuwe mensen binnen die geïnteresseerd zijn in jouw gym.",
      steps: [
        {
          title: "Je zichtbaarheid in je regio is nog te beperkt",
          description:
            "Daardoor mis je kansen bij mensen die je gym interessant zouden vinden.",
        },
        {
          title: "Je aanbod is nog niet duidelijk genoeg",
          description:
            "Nieuwe leads zien nog niet direct waarom ze moeten instappen.",
        },
        {
          title: "De stap naar een aanvraag is nog niet eenvoudig genoeg",
          description:
            "Als de volgende stap niet duidelijk is, haken mensen sneller af.",
        },
      ],
    };
  }

  // 5. Te weinig leads + ads zonder structuur
  if (
    biggestChallenge === "Te weinig leads" &&
    currentMarketing === "We draaien ads, maar zonder duidelijke structuur"
  ) {
    return {
      bottleneckTitle: "Je campagnes draaien, maar leveren te weinig op",
      bottleneckDescription:
        "Je bent al actief met marketing, maar het rendement blijft achter. Zonder duidelijke structuur blijven resultaten wisselend.",
      steps: [
        {
          title: "Je campagnes zijn nog niet logisch opgebouwd",
          description:
            "Daardoor is het lastig om te sturen op resultaat.",
        },
        {
          title: "Je aanbod en instapmoment zijn nog niet duidelijk genoeg",
          description:
            "Leads moeten direct begrijpen wat ze krijgen.",
        },
        {
          title: "Je bouwt nog te weinig voort op wat al werkt",
          description:
            "Daardoor blijft groei minder voorspelbaar.",
        },
      ],
    };
  }

  // 6. Geen structuur
  if (biggestChallenge === "Geen structuur in marketing") {
    return {
      bottleneckTitle: "Je marketing kost tijd, maar levert te weinig op",
      bottleneckDescription:
        "Er is geen duidelijk systeem. Daardoor gaat er vooral na de eerste stap veel rendement verloren.",
      steps: [
        {
          title: "Er is geen vaste structuur van lead naar lid",
          description:
            "De route van interesse naar inschrijving is niet vast ingericht.",
        },
        {
          title: "Campagnes zijn niet voorspelbaar ingericht",
          description:
            "Resultaten wisselen daardoor te veel.",
        },
        {
          title: "Opvolging en inzicht zijn nog niet strak genoeg",
          description:
            "Daar gaat vaak ongemerkt rendement verloren.",
        },
      ],
    };
  }

  // 7. Bureau
  if (currentMarketing === "Ik werk met een bureau") {
    return {
      bottleneckTitle: "Je bent al actief met marketing, maar het rendement blijft achter",
      bottleneckDescription:
        "Er draaien campagnes, maar dat betekent niet dat de hele route klopt.",
      steps: [
        {
          title: "De klantreis is nog niet goed op elkaar afgestemd",
          description:
            "Daardoor gaat er rendement verloren tussen stappen.",
        },
        {
          title: "Leadkwaliteit en conversie worden nog niet apart bekeken",
          description:
            "Je ziet daardoor niet waar het echt misgaat.",
        },
        {
          title: "De focus ligt nog niet op het belangrijkste knelpunt",
          description:
            "Daardoor pak je niet de grootste winst.",
        },
      ],
    };
  }

  // fallback
  return {
    bottleneckTitle: "Je verliest nu op meerdere punten rendement",
    bottleneckDescription:
      "Er gaat op meerdere momenten in je marketing rendement verloren, waardoor groei minder voorspelbaar is dan nodig.",
    steps: [
      {
        title: "Het is nog niet duidelijk waar je de meeste winst laat liggen",
        description:
          "Daardoor is het lastig om gericht te verbeteren.",
      },
      {
        title: "Je marketing mist een vaste structuur",
        description:
          "Resultaten blijven daardoor wisselend.",
      },
      {
        title: "Je stuurt nog te veel op leads in plaats van op leden",
        description:
          "Daardoor lijkt het goed te gaan, maar blijft echte groei achter.",
      },
    ],
  };
};

export const generateGroeiplan = (data: ScannerData): GroeiplanResult => {
  const phase = getPhase(data.memberCount);
  const scenario = getScenario(data);
  const impactText = getImpactText(
    data.memberCount,
    data.marketingBudget,
    data.biggestChallenge,
    data.mainGoal
  );

  return {
    phase,
    bottleneckTitle: scenario.bottleneckTitle,
    bottleneckDescription: scenario.bottleneckDescription,
    steps: scenario.steps,
    impactText,
  };
};
