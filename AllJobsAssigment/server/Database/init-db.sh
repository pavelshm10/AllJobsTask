#!/bin/bash

# Wait for SQL Server to be ready
echo "Waiting for SQL Server to start..."
sleep 30

# Run initialization scripts
echo "Running database initialization scripts..."

/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d master -i /docker-entrypoint-initdb.d/01-InitDatabase.sql
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d WeatherDB -i /docker-entrypoint-initdb.d/02-StoredProcedures.sql

echo "Database initialization completed!"

