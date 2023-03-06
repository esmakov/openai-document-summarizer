import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

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

  getFiles: publicProcedure.query(async () => {
    const response = await openai.listFiles();

    return response;
  }),

  getCompletion: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .query(async ({ input }) => {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: input.prompt,
        max_tokens: 100,
        temperature: 0.6,
      });

      return response.data.choices;
    }),
});
