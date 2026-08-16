import { candidates, type TPoll } from "@/lib/election";

type CandidatePanelProps = {
  poll: TPoll;
  total: number;
};

export function CandidatePanel({ poll, total }: CandidatePanelProps) {
  return (
    <section className="card image-full h-full min-h-80 overflow-hidden border border-base-300 shadow-lg">
      <figure className="bg-gradient-to-br from-primary/40 via-base-300 to-base-100">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,oklch(70%_0.14_240_/_0.35),transparent_45%)]" />
      </figure>
      <div className="card-body justify-between">
        <div>
          <p className="badge badge-primary badge-outline mb-3">
            Official candidates
          </p>
          <h2 className="card-title text-2xl">Head of House</h2>
          <p className="max-w-sm text-sm text-base-content/80">
            Only Registered Candidates can receive votes in this election.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {candidates.map((candidate) => {
            const votes = poll[candidate];
            const share = total === 0 ? 0 : Math.round((votes / total) * 100);

            return (
              <article
                key={candidate}
                className="rounded-2xl border border-base-100/20 bg-base-100/70 p-4 backdrop-blur"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="avatar avatar-placeholder">
                    <div className="w-12 rounded-full bg-primary text-xl font-bold text-primary-content">
                      {candidate.slice(0, 1)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{candidate}</h3>
                    <p className="text-xs text-base-content/60">
                      {votes} {votes === 1 ? "vote" : "votes"}
                    </p>
                  </div>
                </div>
                <progress
                  className="progress progress-primary w-full"
                  value={share}
                  max={100}
                />
                <p className="mt-1 text-right text-xs text-base-content/60">
                  {share}%
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
