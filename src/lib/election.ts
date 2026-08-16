export type PTypes = string | number | number[] | boolean;

export type TCandidate = "Augustine" | "Kosisochukwu";

export const candidates = ["Augustine", "Kosisochukwu"] as const;

export const voters = [
  "Stephanie",
  "Rita",
  "James",
  "Peter",
  "Victor",
  "Anthony",
  "Charles",
  "Augustine",
  "Lillian",
  "Gabriel",
  "Christopher",
  "Kosisochukwu",
  "Bonaventure",
  "Abigail",
  "David",
  "Amarachi",
  "Loveth",
  "Chidimma",
  "Ifeanyi",
  "Majesty",
] as const;

export type TVoters = (typeof voters)[number];

export type TPoll = Record<TCandidate, number>;

export interface Result {
  total: number;
  winner?: TCandidate;
  poll: TPoll;
  isTie: boolean;
}

export type VotingRecord = Partial<Record<TVoters, TCandidate>>;

export interface ElectionState extends Result {
  votes: VotingRecord;
}

export const emptyPoll = (): TPoll => ({
  Augustine: 0,
  Kosisochukwu: 0,
});

export const createInitialState = (): ElectionState => ({
  total: 0,
  poll: emptyPoll(),
  winner: undefined,
  isTie: false,
  votes: {},
});

export const isRegisteredVoter = (value: string): value is TVoters =>
  (voters as readonly string[]).includes(value);

export const isOfficialCandidate = (value: string): value is TCandidate =>
  (candidates as readonly string[]).includes(value);

export const hasVoted = (state: ElectionState, voter: TVoters): boolean =>
  Boolean(state.votes[voter]);

export const determineWinner = (
  poll: TPoll,
): Pick<Result, "winner" | "isTie"> => {
  const entries = Object.entries(poll) as [TCandidate, number][];
  const maxVotes = Math.max(...entries.map(([, votes]) => votes));

  if (maxVotes <= 0) {
    return { winner: undefined, isTie: false };
  }

  const leaders = entries
    .filter(([, votes]) => votes === maxVotes)
    .map(([candidate]) => candidate);

  if (leaders.length > 1) {
    return { winner: undefined, isTie: true };
  }

  return { winner: leaders[0], isTie: false };
};

export const getResult = (state: ElectionState): Result => ({
  total: state.total,
  winner: state.winner,
  poll: state.poll,
  isTie: state.isTie,
});

export const getWinner = (state: ElectionState): TCandidate | undefined =>
  state.winner;

export const checkResult = (
  state: ElectionState,
  candidate: TCandidate,
): number => state.poll[candidate];

export type VoteOutcome =
  | { ok: true; state: ElectionState }
  | { ok: false; error: string };

export const vote = (
  state: ElectionState,
  voter: TVoters,
  selectedCandidate: TCandidate,
): VoteOutcome => {
  if (!isRegisteredVoter(voter)) {
    return { ok: false, error: "Only registered voters can vote." };
  }

  if (!isOfficialCandidate(selectedCandidate)) {
    return { ok: false, error: "You can only vote for an official candidate." };
  }

  if (hasVoted(state, voter)) {
    return { ok: false, error: `${voter} has already voted.` };
  }

  const poll: TPoll = {
    ...state.poll,
    [selectedCandidate]: state.poll[selectedCandidate] + 1,
  };
  const total = state.total + 1;
  const { winner, isTie } = determineWinner(poll);

  return {
    ok: true,
    state: {
      poll,
      total,
      winner,
      isTie,
      votes: {
        ...state.votes,
        [voter]: selectedCandidate,
      },
    },
  };
};

export const election = (
  votersList: readonly TVoters[],
  ballot: Record<TVoters, TCandidate>,
  initialState: ElectionState = createInitialState(),
): ElectionState =>
  votersList.reduce((current, voter) => {
    const outcome = vote(current, voter, ballot[voter]);
    return outcome.ok ? outcome.state : current;
  }, initialState);
