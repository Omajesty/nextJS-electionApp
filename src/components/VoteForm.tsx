import { FormEvent, useMemo, useState } from "react";
import {
  candidates,
  voters,
  type TCandidate,
  type TVoters,
} from "@/lib/election";
import {
  createVoteSchema,
  getVoteFieldErrors,
  type VoteFormErrors,
} from "@/lib/vote-schema";

type VoteFormProps = {
  alreadyVoted: readonly TVoters[];
  feedback: string;
  feedbackType: "success" | "error" | "";
  onVote: (voter: TVoters, candidate: TCandidate) => void;
};

export function VoteForm({
  alreadyVoted,
  feedback,
  feedbackType,
  onVote,
}: VoteFormProps) {
  const [voter, setVoter] = useState("");
  const [candidate, setCandidate] = useState("");
  const [errors, setErrors] = useState<VoteFormErrors>({});

  const remainingVoters = voters.length - alreadyVoted.length;
  const allVoted = remainingVoters === 0;

  const schema = useMemo(
    () => createVoteSchema(alreadyVoted),
    [alreadyVoted],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = schema.safeParse({ voter, candidate });

    if (!parsed.success) {
      setErrors(getVoteFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    onVote(parsed.data.voter, parsed.data.candidate);
    setVoter("");
    setCandidate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card border border-base-300 bg-base-200/80 shadow-lg"
    >
      <div className="card-body">
        <h2 className="card-title text-xl">Vote Now</h2>
        <p className="text-sm text-base-content/60">
          {remainingVoters} of {voters.length} registered voters remaining
        </p>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Voter&apos;s Names</legend>
          <select
            id="voter-name"
            className={`select select-lg w-full ${errors.voter ? "select-error" : ""}`}
            value={voter}
            disabled={allVoted}
            onChange={(event) => {
              setVoter(event.target.value);
              setErrors((current) => ({ ...current, voter: undefined }));
            }}
          >
            <option value="" disabled>
              Select your name
            </option>
            {voters.map((name) => {
              const voted = alreadyVoted.includes(name);
              return (
                <option key={name} value={name} disabled={voted}>
                  {voted ? `${name} (already voted)` : name}
                </option>
              );
            })}
          </select>
          {errors.voter ? (
            <p className="label text-error">{errors.voter}</p>
          ) : (
            <p className="label">Only registered voters can cast a ballot</p>
          )}
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Choose Candidate</legend>
          <select
            id="candidate-select"
            className={`select select-lg w-full ${errors.candidate ? "select-error" : ""}`}
            value={candidate}
            disabled={allVoted}
            onChange={(event) => {
              setCandidate(event.target.value);
              setErrors((current) => ({ ...current, candidate: undefined }));
            }}
          >
            <option value="" disabled>
              Select a candidate
            </option>
            {candidates.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          {errors.candidate ? (
            <p className="label text-error">{errors.candidate}</p>
          ) : (
            <p className="label">You can only vote for an official candidate</p>
          )}
        </fieldset>

        {feedback ? (
          <div
            role="alert"
            className={`alert alert-soft ${
              feedbackType === "error" ? "alert-error" : "alert-success"
            }`}
          >
            <span>{feedback}</span>
          </div>
        ) : null}

        {allVoted ? (
          <div role="alert" className="alert alert-info alert-soft">
            <span>Every registered voter has already voted.</span>
          </div>
        ) : null}

        <button
          type="submit"
          className="btn btn-primary btn-lg mt-2 w-full"
          disabled={allVoted}
        >
          Submit Vote
        </button>
      </div>
    </form>
  );
}
