import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { MAX_ALLOWED_RESPONSE_TOKENS } from "~/pages";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const exampleRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getCompletion: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
        max_tokens: z.number().max(MAX_ALLOWED_RESPONSE_TOKENS),
        temperature: z.number(),
      })
    )
    .query(async ({ input }) => {
      return "hit";
      // const response = await openai.createCompletion({
      //   model: "text-davinci-003",
      //   prompt: input.prompt,
      //   max_tokens: input.max_tokens,
      //   temperature: input.temperature,
      // });
      // console.log(response.data.choices[0]?.text);
      // return response.data.choices;
    }),
});
