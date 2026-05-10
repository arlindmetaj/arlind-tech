#!/bin/sh
set -e
npx prisma db push --accept-data-loss --url="$DATABASE_URL"
exec node server.js
