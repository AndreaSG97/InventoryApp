FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src
COPY productManagement.csproj .
RUN dotnet restore
COPY . .

RUN dotnet build "productManagement.csproj" -c Release -o /app/build

RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/sdk:9.0
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "productManagement.dll"]