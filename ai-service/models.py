from pydantic import BaseModel, Field
from typing import List

class Passenger(BaseModel):
    tc_no: str = Field(description="TC Kimlik Numarası veya Pasaport Numarası")
    first_name: str = Field(description="Yolcunun adı")
    last_name: str = Field(description="Yolcunun soyadı")
    nationality: str = Field(description="Uyruk (TR veya yabancı ülke kodu)")
    phone: str = Field(description="Telefon numarası")

class TripDetails(BaseModel):
    departure_city: str = Field(description="Başlangıç İli (Örn: İstanbul, Ankara). Bilinmiyorsa boş bırak.")
    departure_district: str = Field(description="Başlangıç İlçesi. Bilinmiyorsa boş bırak.")
    arrival_city: str = Field(description="Bitiş İli (Örn: İstanbul, Ankara). Bilinmiyorsa boş bırak.")
    arrival_district: str = Field(description="Bitiş İlçesi. Bilinmiyorsa boş bırak.")
    description: str = Field(description="Sefer açıklaması veya özet metin. Bilinmiyorsa boş bırak.")

class PassengersResult(BaseModel):
    passengers: List[Passenger]
    trip_details: TripDetails

class AnalyzeRequest(BaseModel):
    text: str
