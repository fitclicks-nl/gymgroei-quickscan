type ResultScreenProps = {
  gymName: string;
  result: any;
};

const ResultScreen = ({ gymName, result }: ResultScreenProps) => {
  const {
    scores,
    lowestDomain,
    summary,
    priorityTitle,
    actions,
    avoid,
  } = result;

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-start justify-center px-6 pt-28 pb-16 sm:pt-32 sm:pb-16">
        <div className="w-full max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#EB7F4B]">
            Jouw resultaat
          </p>

          <h1 className="text-3xl font-bold leading-[1.1] tracking-[-0.03em] sm:text-4xl md:text-5xl">
            {gymName}, hier ligt jouw grootste groeikans
          </h1>

          <p className="mt-4 text-base leading-7 text-white/65">
            Op basis van jouw antwoorden komt één duidelijk aandachtspunt naar
            voren waar je op dit moment het meeste resultaat kunt behalen.
          </p>

          {/* Scores */}
          <div className="mt-8 rounded-3xl border border-white/8 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold mb-4">
              Overzicht per onderdeel
            </h2>

            <div className="space-y-4">
              {Object.entries(scores).map(([domain, score]) => (
                <div key={domain}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-white/80">{domain}</span>
                    <span className="text-white/60">{score}/5</span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#EB7F4B]"
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="mt-8 rounded-3xl border border-[#EB7F4B]/20 bg-[#EB7F4B]/5 p-6">
            <h2 className="text-xl font-semibold text-[#EB7F4B]">
              {priorityTitle}
            </h2>

            <p className="mt-3 text-white/70 leading-7">{summary}</p>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-4">
            {actions.map((action: any, index: number) => (
              <div
                key={index}
                className="rounded-3xl border border-white/8 bg-white/[0.03] p-6"
              >
                <h3 className="text-lg font-semibold text-white">
                  {index + 1}. {action.title}
                </h3>

                <p className="mt-3 text-sm text-white/65">
                  <strong>Wat je moet doen:</strong> {action.what}
                </p>

                <p className="mt-2 text-sm text-white/55">
                  <strong>Waarom dit belangrijk is:</strong> {action.why}
                </p>

                <p className="mt-2 text-sm text-white/55">
                  <strong>Wat dit oplevert:</strong> {action.result}
                </p>
              </div>
            ))}
          </div>

          {/* Avoid */}
          <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-6">
            <h3 className="text-lg font-semibold text-red-400">
              Wat je nu beter niet kunt doen
            </h3>

            <p className="mt-3 text-sm text-white/65 leading-7">{avoid}</p>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <p className="mb-4 text-sm text-white/50">
              Dit is jouw startpunt. Wil je dit samen concreet maken?
            </p>

            <a
              href="https://calendly.com/fitclicks/kickstart"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 items-center justify-center rounded-2xl px-6 text-base font-semibold text-white transition hover:scale-[1.01]"
              style={{
                background:
                  "linear-gradient(135deg, hsl(18 80% 60%), hsl(24 85% 55%))",
              }}
            >
              Plan een kennismaking
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
