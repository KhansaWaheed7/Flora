const { z } = require("zod");

const cycleSchema = z.object({
  periodStart: z.coerce.date(),

  periodEnd: z.coerce.date(),

  symptoms: z.array(z.string()).optional(),

  notes: z.string().optional(),
});

module.exports = {
  cycleSchema,
};