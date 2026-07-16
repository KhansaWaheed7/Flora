const { z } = require("zod");

const cycleSchema = z.object({
  periodStart: z.coerce.date(),

  periodEnd: z.coerce.date(),

  cycleLength: z.number().min(15).max(60),

  periodLength: z.number().min(1).max(10),

  symptoms: z.array(z.string()).optional(),

  notes: z.string().optional(),
});

module.exports = {
  cycleSchema,
};