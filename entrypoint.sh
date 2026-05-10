#!/bin/sh
set -e
DATABASE_URL="$DATABASE_URL" npx prisma db push --accept-data-loss --schema=prisma/schema.prisma
exec node server.js
