/**
 * Oyun ayarları — yeni harf veya ses eklemek için burayı düzenleyin.
 * Ses dosyaları: sounds/{küçük harf}.mp3  (ör. sounds/a.mp3)
 */
window.OYUN_AYARLARI = {
  harfler: ['A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'],

  /** İlk açılışta seçili harfler (yeni başlayanlar için az sayıda) */
  varsayilanSecili: ['A', 'E'],

  /** "Başlangıç" hızlı seçim seti */
  baslangicSeti: ['A', 'E', 'L', 'M', 'K'],

  minHarfSayisi: 2,

  /** Harflerin saniyede kayma hızı (piksel) */
  dusmeHizi: 120,

  /** Yeni tur başlamadan önce bekleme (ms) */
  turArasiBekleme: 400,

  sesKlasoru: 'sounds/',
};
