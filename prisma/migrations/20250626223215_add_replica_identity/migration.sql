-- This is an empty migration.
-- Set replica identity for Session table
ALTER TABLE "Session" REPLICA IDENTITY USING INDEX "Session_pkey";