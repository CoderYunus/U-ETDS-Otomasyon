FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Kütüphane dosyalarını kopyala ve geri yükle (restore)
COPY *.csproj ./
RUN dotnet restore

# Tüm kodları kopyala ve derle
COPY . ./
RUN dotnet publish -c Release -o out

# Çalıştırma aşaması (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Render'ın atayacağı portu dinle (Varsayılan 8080)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "backend.dll"]
