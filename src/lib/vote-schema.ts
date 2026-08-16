import { z } from "zod";
import { candidates, voters, type TVoters } from "@/lib/election";

export const createVoteSchema = (alreadyVoted: readonly TVoters[]) =>
  z
    .object({
      voter: z.enum(voters, { error: "Select a registered voter" }),
      candidate: z.enum(candidates, {
        error: "Select an official candidate",
      }),
    })
    .superRefine((value, ctx) => {
      if (alreadyVoted.includes(value.voter)) {
        ctx.addIssue({
          code: "custom",
          path: ["voter"],
          message: `${value.voter} has already voted`,
          input: value.voter,
        });
      }
    });

export type VoteFormInput = {
  voter: string;
  candidate: string;
};

export type VoteFormErrors = Partial<Record<keyof VoteFormInput, string>>;

export const getVoteFieldErrors = (
  error: z.ZodError,
): VoteFormErrors => {
  const fieldErrors: VoteFormErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (field === "voter" || field === "candidate") {
      fieldErrors[field] ??= issue.message;
    }
  }

  return fieldErrors;
};
