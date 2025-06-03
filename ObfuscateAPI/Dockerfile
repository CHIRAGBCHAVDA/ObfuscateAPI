# Use the official .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
# This layer is cached if project dependencies haven't changed
COPY ["ObfuscateAPI.csproj", "."]
RUN dotnet restore

# Copy the rest of the application code
COPY . .

# Publish the application for release
RUN dotnet publish "ObfuscateAPI.csproj" -c Release -o /app/publish

# Use a smaller .NET runtime image for the final application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose the port your ASP.NET Core app listens on (default is 80 for HTTP)
EXPOSE 80

# Command to run the application
ENTRYPOINT ["dotnet", "ObfuscateAPI.dll"]