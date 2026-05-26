import os
import json
import google.generativeai as genai
from models import PassengersResult

def analyze_text_with_gemini(text: str) -> dict:
    """
    Gönderilen serbest metni Gemini modeli kullanarak ayrıştırır ve JSON olarak döndürür.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key == "YOUR_GEMINI_API_KEY_HERE":
        raise ValueError("Lütfen .env dosyasına geçerli bir GEMINI_API_KEY girin.")

    genai.configure(api_key=api_key)

    # Sistem prompt'u, Gemini'ye kesin kurallarla sadece JSON dönmesini emreder
    system_prompt = (
        "Sen bir veri ayrıştırma (data parsing) uzmanısın. Kullanıcının gönderdiği serbest metindeki "
        "yolcu bilgilerini (Ad, Soyad, Uyruk, TC/Pasaport No, Telefon) bulup çıkaracaksın. "
        "Ayrıca metindeki güzergah bilgisini (Nereden Nereye gidildiği) tespit edip sefer bilgilerine (trip_details) ekleyeceksin. "
        "Uyruk belirtilmemişse varsayılan olarak 'TR' yazacaksın. "
        "Yanıtın kesinlikle belirtilen JSON şemasına uygun olmalıdır ve başka hiçbir metin/açıklama içermemelidir."
    )

    model = genai.GenerativeModel(
        model_name="gemini-flash-latest",
        system_instruction=system_prompt,
        generation_config={"response_mime_type": "application/json"}
    )

    prompt = f"""Aşağıdaki metni analiz et ve {PassengersResult.model_json_schema()} şemasına uygun bir JSON objesi döndür:
    
    METİN:
    {text}
    """

    response = model.generate_content(prompt)
    
    try:
        # JSON yanıtı sözlük nesnesine çeviriyoruz
        result_dict = json.loads(response.text)
        return result_dict
    except json.JSONDecodeError:
        raise ValueError("Modelden geçerli bir JSON yanıtı alınamadı.")
