import React, { useEffect, useMemo, useState } from 'https://esm.sh/react@18';

// --- Simple Haversine distance calculator ---
function haversine(lat1, lon1, lat2, lon2, unit = "km") {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = unit === "km" ? 6371 : 3958.8; // km or miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// --- Demo shop list (approximate coordinates). Replace/add your own entries easily. ---
const DEFAULT_SHOPS = [
  // Bangkok (BKK)
  { id: 1, name: "Hair of the Dog (Phloen Chit)", city: "Bangkok", lat: 13.743, lng: 100.549, address: "Ploenchit Center, BTS Phloen Chit", url: "https://maps.google.com/?q=Hair+of+the+Dog+Bangkok" },
  { id: 2, name: "Mikkeller Bangkok", city: "Bangkok", lat: 13.7276, lng: 100.5848, address: "Ekkamai Soi 10", url: "https://maps.google.com/?q=Mikkeller+Bangkok" },
  { id: 3, name: "CRAFT Sukhumvit 23", city: "Bangkok", lat: 13.739, lng: 100.562, address: "Sukhumvit 23", url: "https://maps.google.com/?q=CRAFT+Sukhumvit+23" },
  { id: 4, name: "Brewski (Radisson Blu)", city: "Bangkok", lat: 13.7367, lng: 100.5606, address: "Sukhumvit 27 Rooftop", url: "https://maps.google.com/?q=Brewski+Bangkok" },
  { id: 5, name: "Beer Belly (Thonglor)", city: "Bangkok", lat: 13.734, lng: 100.581, address: "72 Courtyard, Thonglor", url: "https://maps.google.com/?q=Beer+BelLY+Thonglor" },
  { id: 6, name: "Pijiu Bar (Chinatown)", city: "Bangkok", lat: 13.7399, lng: 100.509, address: "Chinatown / Yaowarat", url: "https://maps.google.com/?q=Pijiu+Bar+Bangkok" },
  { id: 7, name: "The Beer Cap (The Commons)", city: "Bangkok", lat: 13.7339, lng: 100.5799, address: "The Commons Thonglor", url: "https://maps.google.com/?q=The+Beer+Cap+Bangkok" },
  { id: 8, name: "Taproom Sala Daeng", city: "Bangkok", lat: 13.728, lng: 100.534, address: "Sala Daeng / Silom", url: "https://maps.google.com/?q=Taproom+Sala+Daeng" },
  { id: 9, name: "Londoner Brew Pub (Pattanakarn)", city: "Bangkok", lat: 13.7262, lng: 100.6478, address: "Pattanakarn Rd.", url: "https://maps.google.com/?q=The+Londoner+Brew+Pub" },
  { id: 10, name: "Chitbeer (Ko Kret)", city: "Nonthaburi", lat: 13.93, lng: 100.491, address: "Ko Kret, Nonthaburi", url: "https://maps.google.com/?q=Chitbeer" },

  // Chiang Mai
  { id: 11, name: "Beer Lab Nimman", city: "Chiang Mai", lat: 18.796, lng: 98.9696, address: "Nimmanahaeminda Rd.", url: "https://maps.google.com/?q=Beer+Lab+Nimman" },
  { id: 12, name: "My Beer Friend (Taproom)", city: "Chiang Mai", lat: 18.795, lng: 98.966, address: "Nimman / Old City area", url: "https://maps.google.com/?q=My+Beer+Friend+Chiang+Mai" },
  { id: 13, name: "Chit Hole CNX", city: "Chiang Mai", lat: 18.7908, lng: 98.9986, address: "Old City area", url: "https://maps.google.com/?q=Chit+Hole+Chiang+Mai" },

  // Phuket
  { id: 14, name: "Full Moon Brewworks (Taproom)", city: "Phuket", lat: 7.884, lng: 98.39, address: "Phuket Old Town", url: "https://maps.google.com/?q=Full+Moon+Brewworks+Phuket" },
  { id: 15, name: "BrewBridge Craft Beer Bar", city: "Phuket", lat: 8.005, lng: 98.305, address: "Choeng Thale area", url: "https://maps.google.com/?q=BrewBridge+Phuket" },

  // Pattaya / Chonburi
  { id: 16, name: "Hops Brewhouse (Pattaya)", city: "Pattaya", lat: 12.929, lng: 100.883, address: "Pattaya Beach Rd.", url: "https://maps.google.com/?q=Hops+Brewhouse+Pattaya" },
  { id: 17, name: "Wizard Brewery (Pattaya)", city: "Pattaya", lat: 12.9303, lng: 100.8836, address: "Central Pattaya", url: "https://maps.google.com/?q=Wizard+Brewery+Pattaya" },

  // Isan / North-East
  { id: 18, name: "24 Taps (Khon Kaen)", city: "Khon Kaen", lat: 16.4419, lng: 102.835, address: "Khon Kaen City", url: "https://maps.google.com/?q=24+Taps+Khon+Kaen" },
  { id: 19, name: "Hop Beer House Korat", city: "Nakhon Ratchasima", lat: 14.973, lng: 102.083, address: "Korat City", url: "https://maps.google.com/?q=Hop+Beer+House+Korat" },

  // Islands / South
  { id: 20, name: "Rimzra Brewhouse (Samui)", city: "Koh Samui", lat: 9.534, lng: 100.055, address: "Koh Samui", url: "https://maps.google.com/?q=Rimzra+Brewhouse+Samui" },

  // Others
  { id: 21, name: "Outlaw Brewing (Loei)", city: "Loei", lat: 17.488, lng: 101.736, address: "Phu Ruea / Loei", url: "https://maps.google.com/?q=Outlaw+Brewing+Loei" },
  { id: 22, name: "Beer Hubb (Pattaya)", city: "Pattaya", lat: 12.935, lng: 100.889, address: "Beach Rd.", url: "https://maps.google.com/?q=Beer+Hubb+Pattaya" },
  { id: 23, name: "The Beer Cap (Saladaeng)", city: "Bangkok", lat: 13.7249, lng: 100.5396, address: "Saladaeng", url: "https://maps.google.com/?q=The+Beer+Cap+Saladaeng" },
  { id: 24, name: "Taproom Ari (Dok Kaew House Bar)", city: "Bangkok", lat: 13.7792, lng: 100.543, address: "Ari", url: "https://maps.google.com/?q=Dok+Kaew+House+Bar" },
  { id: 25, name: "Pijiu Bar (Old Town)", city: "Bangkok", lat: 13.7439, lng: 100.496, address: "Old Town", url: "https://maps.google.com/?q=Pijiu+Bar+Old+Town" },
];

export default function CraftBeerDistanceApp() {
  const [unit, setUnit] = useState("km"); // "km" | "mi"
  const [shops, setShops] = useState(DEFAULT_SHOPS);
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [sortKey, setSortKey] = useState("distance"); // "distance" | "name"
  const [myLoc, setMyLoc] = useState(null); // {lat, lng} | null
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    // Try get geolocation silently on load
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
    );
  }, []);

  const cities = useMemo(() => {
    const s = new Set(shops.map((s) => s.city).filter(Boolean));
    return ["all", ...Array.from(s).sort()];
  }, [shops]);

  const computed = useMemo(() => {
    return shops
      .map((s) => {
        let distance = null;
        if (myLoc) {
          distance = haversine(myLoc.lat, myLoc.lng, s.lat, s.lng, unit);
        }
        return { ...s, distance };
      })
      .filter((s) => {
        const byCity = cityFilter === "all" || s.city === cityFilter;
        const byQuery =
          query.trim() === "" ||
          [s.name, s.city, s.address].join(" ").toLowerCase().includes(query.toLowerCase());
        return byCity && byQuery;
      })
      .sort((a, b) => {
        if (sortKey === "name") return a.name.localeCompare(b.name);
        // default: distance (nulls go last)
        if (a.distance == null && b.distance == null) return a.name.localeCompare(b.name);
        if (a.distance == null) return 1;
        if (b.distance == null) return -1;
        return a.distance - b.distance;
      });
  }, [shops, myLoc, unit, query, cityFilter, sortKey]);

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง (Geolocation)");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setMyLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => alert("เปิดตำแหน่งไม่สำเร็จ: " + err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const setManualLocation = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setMyLoc({ lat, lng });
    } else {
      alert("กรุณากรอกพิกัดละติจูด/ลองจิจูดให้ถูกต้อง");
    }
  };

  const clearLocation = () => setMyLoc(null);

  const openDirections = (shop) => {
    if (myLoc) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${myLoc.lat},${myLoc.lng}&destination=${shop.lat},${shop.lng}`;
      window.open(url, "_blank");
    } else {
      window.open(shop.url || `https://www.google.com/maps?q=${encodeURIComponent(shop.name)}` , "_blank");
    }
  };

  const exportJSON = async () => {
    const payload = shops.map(({ id, ...rest }) => rest);
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      alert("คัดลอก JSON รายชื่อร้านไปยังคลิปบอร์ดแล้ว");
    } catch (e) {
      alert("คัดลอกไม่สำเร็จ คุณสามารถเปิดคอนโซลและคัดลอกเองได้");
      console.log(JSON.stringify(payload, null, 2));
    }
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) throw new Error("รูปแบบไม่ใช่ Array");
      const normalized = parsed.map((s, idx) => ({
        id: Date.now() + idx,
        name: s.name ?? "Unnamed",
        city: s.city ?? "",
        lat: Number(s.lat),
        lng: Number(s.lng),
        address: s.address ?? "",
        url: s.url ?? "",
      })).filter(s => Number.isFinite(s.lat) && Number.isFinite(s.lng));
      if (normalized.length === 0) throw new Error("ไม่พบรายการที่มีพิกัดถูกต้อง");
      setShops(normalized);
      setShowImport(false);
      setImportText("");
    } catch (err) {
      alert("นำเข้าไม่สำเร็จ: " + err.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">🍺 Craft Beer Distance Finder (TH)</h1>
            <p className="text-sm text-neutral-600">หา/จัดลำดับร้านคราฟต์เบียร์จากตำแหน่งของคุณแบบง่าย ๆ – ใช้พิกัดปัจจุบันหรือกรอกเองได้</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportJSON} className="rounded-xl px-3 py-2 bg-white shadow border hover:bg-neutral-50">Export JSON</button>
            <button onClick={() => setShowImport(v => !v)} className="rounded-xl px-3 py-2 bg-white shadow border hover:bg-neutral-50">{showImport ? "ปิด Import" : "Import JSON"}</button>
          </div>
        </header>

        {showImport && (
          <div className="mb-6 rounded-2xl border bg-white p-4 shadow">
            <h2 className="font-semibold mb-2">นำเข้ารายชื่อร้าน (JSON)</h2>
            <p className="text-sm text-neutral-600 mb-2">รูปแบบตัวอย่าง: [{{name, city, lat, lng, address, url}}, ...]</p>
            <textarea value={importText} onChange={(e) => setImportText(e.target.value)} className="w-full h-40 rounded-xl border p-2 font-mono text-sm" placeholder='[
  {"name":"Your Taproom","city":"Bangkok","lat":13.75,"lng":100.5,"address":"...","url":"https://..."}
]'></textarea>
            <div className="mt-3 flex gap-2">
              <button onClick={handleImport} className="rounded-xl px-3 py-2 bg-neutral-900 text-white">นำเข้า</button>
              <button onClick={() => { setImportText(""); setShowImport(false); }} className="rounded-xl px-3 py-2 bg-neutral-200">ยกเลิก</button>
            </div>
          </div>
        )}

        <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Controls */}
          <div className="md:col-span-7 rounded-2xl border bg-white p-4 shadow">
            <h2 className="font-semibold mb-3">ตำแหน่งของฉัน</h2>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex gap-2">
                <button onClick={useMyLocation} className="rounded-xl px-3 py-2 bg-neutral-900 text-white">ใช้ตำแหน่งปัจจุบัน</button>
                <button onClick={clearLocation} className="rounded-xl px-3 py-2 bg-neutral-200">ล้างตำแหน่ง</button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input value={manualLat} onChange={(e) => setManualLat(e.target.value)} className="w-36 rounded-xl border px-3 py-2" placeholder="ละติจูด (13.75)" />
                <input value={manualLng} onChange={(e) => setManualLng(e.target.value)} className="w-36 rounded-xl border px-3 py-2" placeholder="ลองจิจูด (100.5)" />
                <button onClick={setManualLocation} className="rounded-xl px-3 py-2 bg-white shadow border hover:bg-neutral-50">ตั้งพิกัดเอง</button>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-neutral-600">หน่วย</span>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="rounded-xl border px-2 py-2">
                  <option value="km">กม.</option>
                  <option value="mi">ไมล์</option>
                </select>
              </div>
            </div>
            {myLoc && (
              <p className="mt-2 text-sm text-neutral-700">พิกัดปัจจุบัน: <span className="font-mono">{myLoc.lat.toFixed(5)}, {myLoc.lng.toFixed(5)}</span></p>
            )}
          </div>

          <div className="md:col-span-5 rounded-2xl border bg-white p-4 shadow">
            <h2 className="font-semibold mb-3">ค้นหา/กรอง/เรียง</h2>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 rounded-xl border px-3 py-2" placeholder="ค้นหาชื่อร้าน / เมือง / ที่อยู่" />
              <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="rounded-xl border px-2 py-2 w-full md:w-auto">
                {cities.map((c) => (
                  <option key={c} value={c}>{c === "all" ? "ทุกเมือง" : c}</option>
                ))}
              </select>
              <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="rounded-xl border px-2 py-2 w-full md:w-auto">
                <option value="distance">เรียงตามระยะทาง</option>
                <option value="name">เรียงตามชื่อ</option>
              </select>
            </div>
            <p className="mt-2 text-xs text-neutral-500">* หากไม่อนุญาตการระบุตำแหน่ง ระบบจะยังทำงานได้ แต่ไม่สามารถคำนวณระยะทางได้จนกว่าจะระบุตำแหน่ง</p>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">ผลลัพธ์ ({computed.length} ร้าน)</h2>
            <p className="text-sm text-neutral-600">คลิก "เส้นทาง" เพื่อเปิด Google Maps</p>
          </div>

          {computed.map((shop) => (
            <div key={shop.id} className="rounded-2xl border bg-white p-4 shadow">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{shop.name}</h3>
                  <p className="text-sm text-neutral-600">{shop.city}{shop.address ? ` • ${shop.address}` : ""}</p>
                  {shop.distance != null ? (
                    <p className="text-sm"><span className="font-medium">ระยะทาง:</span> {shop.distance.toFixed(2)} {unit}</p>
                  ) : (
                    <p className="text-sm text-neutral-500">(ยังไม่ทราบระยะทาง — โปรดตั้งค่าตำแหน่งของคุณ)</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openDirections(shop)} className="rounded-xl px-3 py-2 bg-neutral-900 text-white">เส้นทาง</button>
                  <a href={shop.url || `https://www.google.com/maps?q=${encodeURIComponent(shop.name)}`} target="_blank" rel="noreferrer" className="rounded-xl px-3 py-2 bg-white shadow border hover:bg-neutral-50">เปิดแผนที่</a>
                </div>
              </div>
            </div>
          ))}

          {computed.length === 0 && (
            <div className="rounded-2xl border bg-white p-6 text-center text-neutral-600">ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา</div>
          )}
        </section>

        <footer className="mt-10 text-xs text-neutral-500">
          <p>หมายเหตุ: พิกัดร้านในลิสต์นี้เป็นค่าโดยประมาณเพื่อการสาธิต ● คุณสามารถกด "Import JSON" เพื่อแทนที่ด้วยรายชื่อร้านของคุณเองที่มีพิกัดจริง</p>
        </footer>
      </div>
    </div>
  );
}
