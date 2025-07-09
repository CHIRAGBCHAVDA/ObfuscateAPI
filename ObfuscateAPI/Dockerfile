# Use the official .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 

WORKDIR /app

COPY publish/ ./

ENTRYPOINT [ "dotnet", "ObfuscateAPI.dll" ]
