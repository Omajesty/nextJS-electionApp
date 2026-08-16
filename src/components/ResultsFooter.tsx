import { candidates, type TPoll } from "@/lib/election";

type ResultsFooterProps = {
  poll: TPoll;
  onOpenResults: () => void;
};

export function ResultsFooter({ poll, onOpenResults }: ResultsFooterProps) {
  return (
    <footer className="mt-6 flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-200/90 p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <button
        type="button"
        className="btn btn-outline btn-primary"
        onClick={onOpenResults}
      >
        Check Result
      </button>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="font-medium text-primary">Results:</span>
        {candidates.map((candidate) => (
          <span key={candidate} className="badge badge-lg badge-neutral">
            {candidate}:{" "}
            <span className="ml-1 font-semibold text-base-content">
              {poll[candidate]}
            </span>
          </span>
        ))}
      </div>
    </footer>
  );
}
