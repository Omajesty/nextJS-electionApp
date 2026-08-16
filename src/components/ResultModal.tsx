import { useEffect, useRef } from "react";
import { candidates, voters, type Result } from "@/lib/election";

type ResultModalProps = {
  open: boolean;
  result: Result;
  onClose: () => void;
};

export function ResultModal({ open, result, onClose }: ResultModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const winnerLabel = result.isTie
    ? "It's a tie"
    : result.winner
      ? `Our Winner is: ${result.winner}`
      : "No votes have been cast yet";

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box border border-base-300">
        <form method="dialog">
          <button
            type="submit"
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
            aria-label="Close results"
          >
            ✕
          </button>
        </form>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-base-content/70">
          Election Result
        </p>
        <div className="mt-6 rounded-xl border border-base-300 bg-base-200 p-5 text-center">
          <p className="text-2xl font-semibold">{winnerLabel}</p>
          <p className="mt-2 text-sm text-base-content/60">
            {result.total} of {voters.length} votes counted
          </p>
        </div>
        <div className="mt-4 grid gap-3">
          {candidates.map((candidate) => (
            <div
              key={candidate}
              className="flex items-center justify-between rounded-xl bg-base-200 px-4 py-3"
            >
              <span>{candidate}</span>
              <span className="font-semibold">{result.poll[candidate]}</span>
            </div>
          ))}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit">close</button>
      </form>
    </dialog>
  );
}
