import { relations, sql } from 'drizzle-orm';
import {
    AnySQLiteColumn, integer, primaryKey, real, sqliteTable, text
} from 'drizzle-orm/sqlite-core';

import { STORE_CURRENCY_OPTIONS } from '@/app/_shared/constant';


const curr = STORE_CURRENCY_OPTIONS.map((currency) => currency.value) as [string, ...string[]];

// Shop table
export const shops = sqliteTable("shop", {
  id: text("id").primaryKey(),
  shopName: text("shop_name").notNull(),
  description: text("description").notNull(),
  socialUrlFacebook: text("social_url_facebook"),
  socialUrlInstagram: text("social_url_instagram"),
  socialUrlLinkedin: text("social_url_linkedin"),
  address: text("address"),
  currency: text("currency", {
    enum: curr,
  }),
  isShopOnline: integer("is_shop_online", { mode: "boolean" }).default(false),
  stripeAccountId: text("stripe_account_id"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
});

//order table
export const orderRecord = sqliteTable("order_record", {
  id: text("id").primaryKey(),
  orderStatus: text("order_status").notNull(),
  customerId: text("customer_id").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  paymentStatus: text("payment_status"),
});

//order item table
export const orderRecordProduct = sqliteTable(
  "order_record_product",
  {
    orderRecordId: text("order_record_id")
      .notNull()
      .references(() => orderRecord.id, { onDelete: "cascade" }),
    productPricingId: text("product_pricing_id")
      .notNull()
      .references(() => productPricing.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.orderRecordId, table.productPricingId] }),
  }),
);

// Admin table
export const admins = sqliteTable("admin", {
  id: text("id").primaryKey(),
  clerkUserId: text("clerk_user_id"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// Category table
export const categories = sqliteTable("category", {
  id: text("id").primaryKey(),
  categoryName: text("category_name").notNull(),
  description: text("description").notNull(),
  parentCategoryId: text("parent_category_id").references((): AnySQLiteColumn => categories.id, {
    onDelete: "cascade",
  }),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
});

// Tag table
export const tags = sqliteTable("tag", {
  id: text("id").primaryKey(),
  tagName: text("tag_name").notNull(),
  description: text("description").notNull(),
  status: text("status", { length: 50 }).notNull().default("not_valid"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
});

// Product Status table
export const productStatus = sqliteTable("product_status", {
  id: text("id").primaryKey(),
  status: text("status", { length: 50 }).notNull().unique(),
});

// Product table
export const products = sqliteTable("product", {
  id: text("id").primaryKey(),
  productName: text("product_name").notNull(),
  description: text("description").notNull(),
  hasVariants: integer("has_variants", { mode: "boolean" }).default(false),
  productStatusId: text("product_status_id")
    .references(() => productStatus.id)
    .default("1"),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "cascade" }),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
});

// Product Pricing table
export const productPricing = sqliteTable("product_pricing", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  isDefault: integer("is_default", { mode: "boolean" }).default(true),
  isArchived: integer("is_archived", { mode: "boolean" }).default(false),
  price: real("price").notNull(),
  stock: integer("stock").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
});

// Shopping Cart table
export const shoppingCart = sqliteTable("shopping_cart", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  variantPricingId: text("variant_pricing_id").references(() => productPricing.id, {
    onDelete: "cascade",
  }),
  quantity: integer("quantity").notNull(),
  customerId: text("customer_id").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
});

// Product Image table
export const productImages = sqliteTable("product_image", {
  id: text("id").primaryKey(),
  url: text("url", { length: 300 }).notNull(),
  productId: text("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
});

// Variant Type table
export const variantTypes = sqliteTable("variant_type", {
  id: text("id").primaryKey(),
  variantTypeName: text("variant_type_name").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
});

// Variant Value table
export const variantValues = sqliteTable("variant_value", {
  id: text("id").primaryKey(),
  variantValueName: text("variant_value_name").notNull(),
  variantTypeId: text("variant_type_id")
    .references(() => variantTypes.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
});

// Product Pricing Value table
export const productPricingValues = sqliteTable(
  "product_pricing_value",
  {
    variantValueId: text("variant_value_id")
      .references(() => variantValues.id, { onDelete: "cascade" })
      .notNull(),
    productPricingId: text("product_pricing_id")
      .references(() => productPricing.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.variantValueId, table.productPricingId] }),
  }),
);

export const productPricingImages = sqliteTable(
  "product_pricing_images",
  {
    productImageId: text("product_image_id")
      .references(() => productImages.id, { onDelete: "cascade" })
      .notNull(),
    productPricingId: text("product_pricing_id")
      .references(() => productPricing.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.productImageId, table.productPricingId] }),
  }),
);

// Tag Product junction table
export const tagProducts = sqliteTable(
  "tag_product",
  {
    tagId: text("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
    productId: text("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.tagId, table.productId] }),
  }),
);

export const activities = sqliteTable("activities", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  type: text({ enum: ["stock adjustment"] }),
  content: text(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const orderRecordRelations = relations(orderRecord, ({ many }) => ({
  products: many(orderRecordProduct),
}));

export const orderRecordProductRelations = relations(orderRecordProduct, ({ one }) => ({
  orderRecord: one(orderRecord, {
    fields: [orderRecordProduct.orderRecordId],
    references: [orderRecord.id],
  }),
  productPricing: one(productPricing, {
    fields: [orderRecordProduct.productPricingId],
    references: [productPricing.id],
  }),
}));

export const shopsRelations = relations(shops, ({ many }) => ({
  products: many(products),
}));

export const adminsRelations = relations(admins, ({ many }) => ({
  shops: many(shops),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parentCategory: one(categories, {
    fields: [categories.parentCategoryId],
    references: [categories.id],
  }),
  childCategories: many(categories),
  products: many(products),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  products: many(tagProducts),
}));

export const productStatusRelations = relations(productStatus, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  status: one(productStatus, {
    fields: [products.productStatusId],
    references: [productStatus.id],
  }),
  images: many(productImages),
  pricing: many(productPricing),
  tags: many(tagProducts),
  cartItems: many(shoppingCart),
}));

export const productPricingRelations = relations(productPricing, ({ one, many }) => ({
  product: one(products, {
    fields: [productPricing.productId],
    references: [products.id],
  }),
  variantValues: many(productPricingValues),
  cartItems: many(shoppingCart),
  images: many(productPricingImages),
}));

export const shoppingCartRelations = relations(shoppingCart, ({ one }) => ({
  product: one(products, {
    fields: [shoppingCart.productId],
    references: [products.id],
  }),
  variantPricing: one(productPricing, {
    fields: [shoppingCart.variantPricingId],
    references: [productPricing.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one, many }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  productPricing: many(productPricingImages),
}));

export const productPricingImagesRelations = relations(productPricingImages, ({ one }) => ({
  productImage: one(productImages, {
    fields: [productPricingImages.productImageId],
    references: [productImages.id],
  }),
  productPricing: one(productPricing, {
    fields: [productPricingImages.productPricingId],
    references: [productPricing.id],
  }),
}));

export const variantTypesRelations = relations(variantTypes, ({ many }) => ({
  values: many(variantValues),
}));

export const variantValuesRelations = relations(variantValues, ({ one, many }) => ({
  type: one(variantTypes, {
    fields: [variantValues.variantTypeId],
    references: [variantTypes.id],
  }),
  productPricing: many(productPricingValues),
}));

export const productPricingValuesRelations = relations(productPricingValues, ({ one }) => ({
  variantValue: one(variantValues, {
    fields: [productPricingValues.variantValueId],
    references: [variantValues.id],
  }),
  productPricing: one(productPricing, {
    fields: [productPricingValues.productPricingId],
    references: [productPricing.id],
  }),
}));

export const tagProductsRelations = relations(tagProducts, ({ one }) => ({
  tag: one(tags, {
    fields: [tagProducts.tagId],
    references: [tags.id],
  }),
  product: one(products, {
    fields: [tagProducts.productId],
    references: [products.id],
  }),
}));
