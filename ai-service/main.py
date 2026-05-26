from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import AnalyzeRequest, PassengersResult
from ai_engine import analyze_text_with_gemini

# Çevresel değişkenleri yükle
load_dotenv()

app = FastAPI(title="U-ETDS AI Service", version="1.0.0")

# C# sunucusundan gelecek isteklere izin veriyoruz
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Güvenlik için prodüksiyonda kısıtlanmalıdır
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-text", response_model=PassengersResult)
async def analyze_text(request: AnalyzeRequest):
    try:
        result = analyze_text_with_gemini(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
