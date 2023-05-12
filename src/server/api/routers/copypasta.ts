import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createId } from '@paralleldrive/cuid2'
import { createClient } from 'redis'

export const copypastaRouter = createTRPCRouter({
  stats: publicProcedure
    .query(async () => {
      const client = createClient({
        url: "redis://localhost:6379",
      })
      client.on('error', err => console.log('Redis client error', err))
      await client.connect();
      const multi = client.multi();
      multi.GET("reads")
      multi.GET("writes")
      const stats = await multi.exec(true)
      return {
        reads: Number(stats[0]),
        writes: Number(stats[1])
      }
    }),
  retrieve: publicProcedure
    .input(z.object({ id: z.string().min(1, "Must provide an ID") }))
    .query(async ({ input }) => {
      const client = createClient({
        url: "redis://localhost:6379",
      })

      client.on('error', err => console.log('Redis client error', err))

      await client.connect();

      const multi = client.multi()
      multi.GET(input.id)
      multi.TTL(input.id)
      multi.INCR("reads")
      const [text, ttl, incr] = await multi.exec(true)
      return {
        id: input.id,
        text,
        ttl
      }
    }),
  save: publicProcedure
    .input(z.object({ 
      text: z.string().min(1, "Must be at least one character"),
      ttl: z.number().min(1, "Min minutes to be stored 1").max(3600, "Max minutes to be stored 3600")
    }))
    .mutation(async ({ input }) => {
      const id = createId()
      const client = createClient({
        url: "redis://localhost:6379",
      })
      client.on('error', err => console.log('Redis client error', err))

      await client.connect();

      let multi = client.multi()
      multi.SET(id, input.text)
      multi.EXPIRE(id, input.ttl * 60) // TTL needs to be provided to REDIS in seconds
      multi.INCR("writes")

      await multi.exec(true)

      return {
        id,
        text: input.text
      };
    }),
});
