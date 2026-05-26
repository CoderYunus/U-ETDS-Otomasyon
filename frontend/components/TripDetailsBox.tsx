import React, { useEffect, useState } from "react";
import { TripDetails } from "../types";

interface TripDetailsBoxProps {
  tripDetails: TripDetails;
}

export default function TripDetailsBox({ tripDetails }: TripDetailsBoxProps) {
  const [bookmarklet, setBookmarklet] = useState<string>("");

  useEffect(() => {
    // Bookmarklet kodu
    // jQuery kullanan U-ETDS sistemi için select değerlerini option text'ine göre bulup seçer
    const code = `javascript:(function(){
      var t = ${JSON.stringify(tripDetails)};
      function normalize(str) {
        if(!str) return "";
        return str.toLocaleUpperCase('tr-TR')
                  .replace(/İ/g, 'I').replace(/Ö/g, 'O').replace(/Ü/g, 'U')
                  .replace(/Ş/g, 'S').replace(/Ğ/g, 'G').replace(/Ç/g, 'C')
                  .replace(/[^A-Z]/g, '').trim();
      }
      function getJQuery() {
        if (window.$) return window.$;
        for (var i = 0; i < window.frames.length; i++) {
          try { if (window.frames[i].$) return window.frames[i].$; } catch(e){}
        }
        return null;
      }
      var jq = getJQuery();
      function getElements(selector) {
        var els = [];
        var docs = [document];
        for(var i=0; i<window.frames.length; i++) {
          try { docs.push(window.frames[i].document); } catch(e){}
        }
        docs.forEach(function(d) {
           try {
             var nodes = d.querySelectorAll(selector);
             for(var j=0; j<nodes.length; j++) els.push(nodes[j]);
           } catch(e) {}
        });
        return els;
      }
      function fillSelect(selector, text) {
        if(!text) return;
        var search = normalize(text);
        var els = getElements(selector);
        els.forEach(function(el) {
          var val = null;
          if(jq) {
            var $s = jq(el);
            $s.find('option').each(function(){
              var optText = normalize(jq(this).text());
              if(optText === search || optText.indexOf(search) > -1 || search.indexOf(optText) > -1) {
                val = jq(this).val();
                return false;
              }
            });
            if(val) {
               $s.val(val).trigger('change').trigger('change.select2').trigger('chosen:updated');
               try { el.dispatchEvent(new Event('change', {bubbles: true})); } catch(e){}
            }
          } else {
            var opts = Array.from(el.options || []);
            var matched = opts.find(o => normalize(o.text).indexOf(search) > -1);
            if(matched) {
               el.value = matched.value;
               try { el.dispatchEvent(new Event('change', {bubbles: true})); } catch(e){}
            }
          }
        });
      }
      function fillInput(selector, text) {
        if(!text) return;
        var els = getElements(selector);
        els.forEach(function(el) {
          if(jq) {
             jq(el).val(text).trigger('input').trigger('change');
          } else {
             el.value = text;
             el.dispatchEvent(new Event('input', {bubbles: true}));
             el.dispatchEvent(new Event('change', {bubbles: true}));
          }
        });
      }
      
      fillSelect('select[name="baslangic_il"], select#baslangic_il', t.departureCity);
      fillSelect('select[name="bitis_il"], select#bitis_il', t.arrivalCity);
      
      setTimeout(function() {
        fillSelect('select[name="baslangic_ilce"], select#baslangic_ilce', t.departureDistrict);
        fillSelect('select[name="bitis_ilce"], select#bitis_ilce', t.arrivalDistrict);
      }, 1000);
      
      var depAdres = t.departureCity ? (t.departureCity + (t.departureDistrict ? ' ' + t.departureDistrict : '') + ' Merkez') : '';
      var arrAdres = t.arrivalCity ? (t.arrivalCity + (t.arrivalDistrict ? ' ' + t.arrivalDistrict : '') + ' Merkez') : '';
      
      fillInput('input[name="baslangic_adres"], input[name="baslangic_yer"], input[name="baslangic_nokta"]', depAdres);
      fillInput('input[name="bitis_adres"], input[name="bitis_yer"], input[name="bitis_nokta"]', arrAdres);
      fillInput('textarea[name="aciklama"], input[name="aciklama"], textarea.aciklama', t.description || 'Yapay zeka ile dolduruldu');
      
      alert('Sefer Bilgileri Dolduruldu!');
    })();`;
    
    // JS'i sıkıştır
    setBookmarklet(code.replace(/\n/g, '').replace(/\s+/g, ' '));
  }, [tripDetails]);

  if (!tripDetails) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200 mt-6 bg-blue-50">
      <h3 className="text-lg font-medium text-blue-800 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Yapay Zeka Tarafından Algılanan Sefer Bilgileri
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div className="bg-white p-3 rounded border border-blue-100">
          <span className="text-gray-500 block mb-1">Başlangıç</span>
          <strong>{tripDetails.departureCity || 'Belirtilmedi'}</strong> {tripDetails.departureDistrict ? `/ ${tripDetails.departureDistrict}` : ''}
        </div>
        <div className="bg-white p-3 rounded border border-blue-100">
          <span className="text-gray-500 block mb-1">Bitiş</span>
          <strong>{tripDetails.arrivalCity || 'Belirtilmedi'}</strong> {tripDetails.arrivalDistrict ? `/ ${tripDetails.arrivalDistrict}` : ''}
        </div>
        {tripDetails.description && (
          <div className="col-span-2 bg-white p-3 rounded border border-blue-100">
            <span className="text-gray-500 block mb-1">Açıklama</span>
            {tripDetails.description}
          </div>
        )}
      </div>

      <div className="bg-blue-100 p-4 rounded-md border border-blue-200 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-blue-900 mb-1">Otomatik Form Doldurucu</h4>
          <p className="text-sm text-blue-700">Aşağıdaki butonu tarayıcınızın <strong>Yer İmleri (Sık Kullanılanlar)</strong> çubuğuna sürükleyip bırakın. U-ETDS sayfasındayken bu yer imine tıklarsanız form otomatik dolar.</p>
        </div>
        <a 
          href={bookmarklet}
          onClick={(e) => e.preventDefault()}
          className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md cursor-grab active:cursor-grabbing whitespace-nowrap transition-colors"
          title="Beni Yer İmleri Çubuğuna Sürükle!"
        >
          🔖 U-ETDS Doldur
        </a>
      </div>
    </div>
  );
}
