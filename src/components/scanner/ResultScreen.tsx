type ResultScreenProps = {
  gymName: string;
  result: any;
};

const ResultScreen = ({ gymName, result }: ResultScreenProps) => {
  const { scores, lowestDomain, summary, priorityTitle, actions, avoid } = result;

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-start justify-center px-6 pt-28 pb-16 sm:pt-32 sm:pb-16">
        <div className="w-full max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#EB7F4B]">
            Jouw Quickscan resultaat
          </p>

          <h1 className="text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-4xl md:text-5xl">
            {gymName}, hier laat je nu het meeste resultaat liggen
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
            De meeste gyms denken dat ze meer leads nodig hebben. In de praktijk
            zit de grootste winst vaak ergens anders.
          </p>

          <div className="mt-3 max-w-2xl rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm leading-6 text-white/55">
            Als je dit niet oplost, blijf je afhankelijk van losse acties, toeval
            en onnodige ruis in je marketing.
          </div>

          <div className="mt-8 rounded-3xl border border-[#EB7F4B]/20 bg-[#EB7F4B]/5 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.20)]">
            <p className="text-sm font-medium text-[#EB7F4B]">
              Dit is waar je nu structureel winst laat liggen
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
              {priorityTitle}
            </h2>

            <p className="mt-4 leading-7 text-white/75">{summary}</p>

            <p className="mt-4 leading-7 text-white/65">
              Daardoor laat je nu waarschijnlijk structureel nieuwe leden liggen,
              zonder dat je dat elke dag direct doorhebt.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.20)]">
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">
              Dit ga je de komende 30 dagen doen
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
              Niet alles tegelijk. Dit zijn de eerste stappen die het meeste
              verschil maken.
            </p>

            <div className="mt-6 space-y-5">
              {actions.map((action: any, index: number) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
                >
                  <h3 className="text-lg font-semibold">
                    {index + 1}. {action.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/70">
                    <span className="font-medium text-white">Dit ga je doen:</span>{" "}
                    {action.what}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    <span className="font-medium text-white">
                      Waarom dit belangrijk is:
                    </span>{" "}
                    {action.why}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    <span className="font-medium text-white">
                      Wat dit oplevert:
                    </span>{" "}
                    {action.result}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.20)]">
            <h3 className="text-lg font-semibold text-red-400">
              Wat je nu beter niet kunt doen
            </h3>

            <p className="mt-3 leading-7 text-white/70">{avoid}</p>
          </div>

          <div className="mt-8 rounded-3xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.20)]">
            <h3 className="text-xl font-semibold">Bekijk je scores per onderdeel</h3>

            <div className="mt-5 space-y-4">
              {Object.entries(scores).map(([domain, score]) => {
                const isLowest = domain === lowestDomain;

                return (
                  <div key={domain}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span
                        className={
                          isLowest ? "font-medium text-[#EB7F4B]" : "text-white/80"
                        }
                      >
                        {domain}
                      </span>
                      <span
                        className={
                          isLowest ? "font-medium text-[#EB7F4B]" : "text-white/55"
                        }
                      >
                        {score}/5
                      </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${
                          isLowest ? "bg-[#EB7F4B]" : "bg-white/35"
                        }`}
                        style={{ width: `${(Number(score) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-5 text-sm leading-6 text-white/55">
              Je laagste score ligt bij{" "}
              <span className="font-medium text-white">{lowestDomain}</span>. Daar
              zit op dit moment je grootste aandachtspunt.
            </p>
          </div>

          <div className="mt-10 text-center">
            <p className="mb-4 text-sm text-white/50">
              Dit is je startpunt. Wil je dit concreet vertalen naar jouw gym?
            </p>

            <a
              href="https://calendly.com/fitclicks/kickstart"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 items-center justify-center rounded-2xl px-7 text-base font-semibold text-white transition duration-300 hover:scale-[1.01]"
              style={{
                background:
                  "linear-gradient(135deg, hsl(18 80% 60%), hsl(24 85% 55%))",
              }}
            >
              Plan een kennismaking en maak dit concreet
            </a>

            <p className="mt-4 text-sm text-white/40">
              Dan kijken we samen waar je nu concreet leden laat liggen en wat je
              als eerste moet aanscherpen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;