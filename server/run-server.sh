#!/bin/bash

# Set .NET 6 environment
export PATH="/opt/homebrew/opt/dotnet@6/bin:$PATH"
export DOTNET_ROOT="/opt/homebrew/opt/dotnet@6/libexec"

# Run the server
echo "Starting .NET 6 Web API Server..."
echo "Server will be available at:"
echo "  - HTTPS: https://localhost:5001"
echo "  - HTTP: http://localhost:5000"
echo "  - Swagger: https://localhost:5001/swagger"
echo ""

dotnet run --project BackendApi.csproj

