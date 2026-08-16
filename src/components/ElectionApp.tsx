import { useMemo, useState } from "react";
import { CandidatePanel } from "@/components/CandidatePanel";
import { ElectionHeader } from "@/components/ElectionHeader";
import { ResultModal } from "@/components/ResultModal";
import { ResultsFooter } from "@/components/ResultsFooter";
import { VoteForm } from "@/components/VoteForm";
import {
  createInitialState,
  getResult,
  vote,
  type TCandidate,
  type TVoters,
} from "@/lib/election";

export function ElectionApp() {
  const [state, setState] = useState(createInitialState);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("");
  const [resultsOpen, setResultsOpen] = useState(false);

  const alreadyVoted = useMemo(
    () =>
      (Object.keys(state.votes) as TVoters[]).filter(
        (voter) => state.votes[voter],
      ),
    [state.votes],
  );

  const handleVote = (voter: TVoters, candidate: TCandidate) => {
    const outcome = vote(state, voter, candidate);

    if (!outcome.ok) {
      setFeedback(outcome.error);
      setFeedbackType("error");
      return;
    }

    setState(outcome.state);
    setFeedback(`${voter} voted for ${candidate}`);
    setFeedbackType("success");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <section className="w-full rounded-2xl border border-base-300 bg-base-200/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
        <ElectionHeader />
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <VoteForm
            alreadyVoted={alreadyVoted}
            feedback={feedback}
            feedbackType={feedbackType}
            onVote={handleVote}
          />
          <CandidatePanel poll={state.poll} total={state.total} />
        </div>
      </section>

      <ResultsFooter
        poll={state.poll}
        onOpenResults={() => setResultsOpen(true)}
      />

      <ResultModal
        open={resultsOpen}
        result={getResult(state)}
        onClose={() => setResultsOpen(false)}
      />
    </main>
  );
}
