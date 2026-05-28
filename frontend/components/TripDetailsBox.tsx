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
    <div className="glass-panel p-6 md:p-8 mt-6 relative overflow-hidden group">
      {/* Dekoratif Işık Efekti */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative z-10">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6 flex items-center tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center mr-3 shadow-lg shadow-primary-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          Yapay Zeka Hedef Çıkarımı
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-all group-hover:border-primary-200/50">
            <span className="flex items-center text-xs font-bold uppercase tracking-wider text-primary-600 mb-2">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Kalkış Noktası
            </span>
            <div className="text-gray-800 font-semibold text-lg">{tripDetails.departureCity || 'Belirtilmedi'}</div>
            <div className="text-gray-500 text-sm mt-0.5">{tripDetails.departureDistrict ? `${tripDetails.departureDistrict}` : 'İlçe bilgisi yok'}</div>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-all group-hover:border-purple-200/50">
            <span className="flex items-center text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
              Varış Noktası
            </span>
            <div className="text-gray-800 font-semibold text-lg">{tripDetails.arrivalCity || 'Belirtilmedi'}</div>
            <div className="text-gray-500 text-sm mt-0.5">{tripDetails.arrivalDistrict ? `${tripDetails.arrivalDistrict}` : 'İlçe bilgisi yok'}</div>
          </div>
          
          {tripDetails.description && (
            <div className="col-span-1 md:col-span-2 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm mt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Ek Açıklamalar</span>
              <div className="text-gray-700 text-sm leading-relaxed italic border-l-4 border-primary-300 pl-3">
                "{tripDetails.description}"
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-primary-50 to-purple-50 p-5 rounded-2xl border border-primary-100/50 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 mb-1 flex items-center">
              <span className="text-xl mr-2">⚡</span> U-ETDS Otomatik Doldurucu
            </h4>
            <p className="text-sm text-gray-600 font-medium">Bu butonu tarayıcınızın <strong>Yer İmleri (Sık Kullanılanlar)</strong> çubuğuna sürükleyin. U-ETDS panelindeyken tıkladığınızda tüm form otomatik dolar.</p>
          </div>
          <a 
            href={bookmarklet}
            onClick={(e) => e.preventDefault()}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-semibold rounded-xl cursor-grab active:cursor-grabbing whitespace-nowrap transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transform hover:-translate-y-0.5 flex items-center justify-center"
            title="Sürükle ve Yer İmlerine Bırak!"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            Sürükle & Bırak
          </a>
        </div>
      </div>
    </div>
  );
}
