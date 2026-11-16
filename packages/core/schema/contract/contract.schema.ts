import { z } from "zod";

const simpleTypePropSchema = z.discriminatedUnion("type", [
  z.strictObject({
    required: z.boolean(),
    type: z.literal("string"),
    default: z.string().optional(),
  }),
  z.strictObject({
    required: z.boolean(),
    type: z.literal("number"),
    default: z.number().optional(),
  }),
  z.strictObject({
    required: z.boolean(),
    type: z.literal("boolean"),
    default: z.boolean().optional(),
  }),
]);

const complexTypePropSchema = z
  .strictObject({
    required: z.boolean(),
    values: z.array(z.string()).min(1),
    default: z.string().optional(),
  })
  .refine(
    (data) => data.default === undefined || data.values.includes(data.default),
    {
      error: "Default value must be one of the values",
      path: ["default"],
    },
  );

export const contractSchemaV1 = z.strictObject({
  schemaVersion: z.literal(1),
  resolve: z.strictObject({
    source: z.string(),
    exportName: z.string(),
    propsType: z.string(),
  }),
  props: z.looseRecord(
    z.string(),
    z.union([simpleTypePropSchema, complexTypePropSchema]),
  ),
});

export type ContractV1 = z.infer<typeof contractSchemaV1>;
