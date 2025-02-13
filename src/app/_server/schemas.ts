import { z } from "zod";

// Common UUID and Timestamp schema
const zUUID = z.string().uuid();
const zTimestamp = z.string();

// Shop Schema
const shopSchema = z.object({
  id: zUUID,
  shop_name: z.string().max(200),
  description: z.string(),
  address: z.string().max(200).nullable(),
  social_url_facebook: z.string().max(200).nullable(),
  social_url_instagram: z.string().max(200).nullable(),
  social_url_linkedin: z.string().max(200).nullable(),
  created_at: zTimestamp.nullable(),
  updated_at: zTimestamp.nullable(),
  created_by: zUUID.nullable(),
  updated_by: zUUID.nullable(),
});

// Admin Schema
const adminSchema = z.object({
  id: zUUID,
  clerk_user_id: z.string(),
  created_at: zTimestamp,
});

// Category Schema
const categorySchema = z.object({
  id: zUUID,
  category_name: z.string().max(200),
  description: z.string(),
  parent_category_id: zUUID.nullable(),
  created_at: zTimestamp,
  updated_at: zTimestamp.nullable(),
  created_by: zUUID.nullable(),
  updated_by: zUUID.nullable(),
});

// Tag Schema
const tagSchema = z.object({
  id: zUUID,
  tag_name: z.string().max(200),
  description: z.string(),
  status: z.enum(["not_valid", "valid"]).default("not_valid"),
  created_at: zTimestamp.nullable(),
  updated_at: zTimestamp.nullable(),
  created_by: zUUID.nullable(),
  updated_by: zUUID.nullable(),
});

// Product Status Schema
const productStatusSchema = z.object({
  id: zUUID,
  status: z.string().max(50), // Enum constraint can be handled elsewhere
});

// Product Schema
const productSchema = z.object({
  id: zUUID,
  product_name: z.string().max(200),
  description: z.string(),
  default_price: z.coerce.number().min(0).nullable(),
  default_stock: z.coerce.number().nullable(),
  has_variants: z
    .union([z.literal(0), z.literal(1), z.boolean()])
    .transform((val) => (typeof val === "boolean" ? (val ? 1 : 0) : val))
    .default(0),
  product_status_id: z.string().default("1"),
  category_id: zUUID.nullable(),
  created_at: zTimestamp,
  updated_at: zTimestamp.nullable(),
  created_by: zUUID.nullable(),
  updated_by: zUUID.nullable(),
});

// Shopping Cart Schema
const shoppingCartSchema = z.object({
  id: zUUID,
  product_id: zUUID,
  variant_pricing_id: zUUID.nullable(),
  quantity: z.coerce.number().min(1),
  customer_id: z.string(),
  created_at: zTimestamp,
  updated_at: zTimestamp.nullable(),
  created_by: zUUID.nullable(),
  updated_by: zUUID.nullable(),
});

// Product Image Schema
const productImageSchema = z.object({
  id: zUUID,
  url: z.string().url().max(300),
  product_id: zUUID,
  display_order: z.number().default(0),
  created_at: zTimestamp,
  updated_at: zTimestamp.nullable(),
  created_by: zUUID.nullable(),
  updated_by: zUUID.nullable(),
});

// Variant Type Schema
const variantTypeSchema = z.object({
  id: zUUID,
  variant_type_name: z.string().max(200),
  created_at: zTimestamp,
  updated_at: zTimestamp.nullable(),
  created_by: zUUID.nullable(),
  updated_by: zUUID.nullable(),
});

// Variant Value Schema
const variantValueSchema = z.object({
  id: zUUID,
  variant_value_name: z.string().max(200),
  variant_type_id: zUUID,
  created_at: zTimestamp,
  updated_at: zTimestamp.nullable(),
  created_by: zUUID.nullable(),
  updated_by: zUUID.nullable(),
});

// Variant Pricing Schema
const variantPricingSchema = z.object({
  id: zUUID,
  price: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
  product_id: zUUID,
  created_at: zTimestamp,
  updated_at: zTimestamp.nullable(),
  created_by: zUUID.nullable(),
  updated_by: zUUID.nullable(),
});

// Variant Combination Pricing Schema
const variantCombinationPricingSchema = z.object({
  variant_value_id: zUUID,
  variant_pricing_id: zUUID,
  created_at: zTimestamp,
  updated_at: zTimestamp.nullable(),
  created_by: zUUID.nullable(),
  updated_by: zUUID.nullable(),
});

// Tag Product Schema
const tagProductSchema = z.object({
  tag_id: zUUID,
  product_id: zUUID,
  created_at: zTimestamp,
  updated_at: zTimestamp.nullable(),
  created_by: zUUID.nullable(),
  updated_by: zUUID.nullable(),
});

// Export all schemas together for convenience
export const databaseSchemas = {
  shopSchema,
  adminSchema,
  categorySchema,
  tagSchema,
  productStatusSchema,
  productSchema,
  shoppingCartSchema,
  productImageSchema,
  variantTypeSchema,
  variantValueSchema,
  variantPricingSchema,
  variantCombinationPricingSchema,
  tagProductSchema,
};
