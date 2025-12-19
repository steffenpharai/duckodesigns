/**
 * Cloud SQL connection utilities
 * 
 * For Cloud Run, use Unix socket connection (recommended):
 * DATABASE_URL=postgresql://user:password@localhost/dbname?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME
 * 
 * For local development with Cloud SQL Proxy:
 * DATABASE_URL=postgresql://user:password@127.0.0.1:5432/dbname
 */

/**
 * Builds a Cloud SQL connection string for Unix socket connection (Cloud Run)
 */
export function buildCloudSQLConnectionString(
  user: string,
  password: string,
  database: string,
  connectionName: string
): string {
  return `postgresql://${user}:${password}@localhost/${database}?host=${connectionName}`
}

/**
 * Builds a Cloud SQL connection string for TCP connection (local development with proxy)
 */
export function buildLocalConnectionString(
  user: string,
  password: string,
  database: string,
  host: string = '127.0.0.1',
  port: number = 5432
): string {
  return `postgresql://${user}:${password}@${host}:${port}/${database}`
}

/**
 * Checks if the current environment is Cloud Run
 */
export function isCloudRun(): boolean {
  return process.env.K_SERVICE !== undefined || process.env.K_REVISION !== undefined
}

/**
 * Gets the appropriate connection string based on environment
 */
export function getDatabaseUrl(): string {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  return dbUrl
}

