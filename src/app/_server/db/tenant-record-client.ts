import { createClient } from '@libsql/client';


// this is the driver for the tenant record database
// which store only the info for connection of each individual tenant database
export const TenantRecordClient = createClient({
  url: process.env.TURSO_TENANT_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
