"use server";

import { createClient } from "@libsql/client";

import { isUserSignedIn } from "../admin-actions/auth/user-auth";
import { DatabaseError } from "../utils/errors";
import { TenantRecordClient } from "./tenant-record-client";

async function getDbUrl(subdomain: string) {
  const { rows } = await TenantRecordClient.execute({
    sql: `select db_url from tenant_record where subdomain = ?`,
    args: [subdomain],
  });
  if (rows.length === 0 || rows.length > 1) return null;
  return rows[0].db_url?.toString();
}

export async function getTenantDbBySubdomain(subdomain: string) {
  const db_url = await getDbUrl(subdomain);
  if (!db_url) {
    return null;
  }
  return createClient({
    url: `libsql://${db_url}`,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
}

export async function getTenantDbClientByUserId() {
  const userId = await isUserSignedIn();
  const { rows } = await TenantRecordClient.execute({
    sql: `select db_url from tenant_record where owner_clerk_id = ?`,
    args: [userId],
  });
  if (rows.length === 0 || rows.length > 1) {
    return null;
  }
  return createClient({
    url: `libsql://${rows[0].db_url?.toString()}`,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
}

export async function getTenantDbByAdmin() {
  const db = await getTenantDbClientByUserId();
  if (!db) {
    throw new DatabaseError("Database not found");
  }
  return db;
}
