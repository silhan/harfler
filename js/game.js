/**
 * Ses–harf eşleştirme oyunu
 */
class SesHarfOyunu {
  constructor(ayarlar) {
    this.ayarlar = ayarlar;
    this.ses = new SesYoneticisi(ayarlar);
    this.durum = 'menu';
    this.skor = 0;
    this.animasyonId = null;
    this.sonZaman = 0;
    this.turToken = 0;

    this.seciliHarfler = [...ayarlar.varsayilanSecili];
    this.harfBoyutu = 'buyuk';

    this.dogruHarf = null;
    this.yanlisHarf = null;
    this.solHarf = null;
    this.sagHarf = null;

    this.harfKonumlari = { sol: 0, sag: 0 };
    this.harfHedefY = 0;

    this.el = {
      ekran: document.getElementById('oyun'),
      skor: document.getElementById('skor'),
      hedefMesaj: document.getElementById('hedefMesaj'),
      harfSol: document.getElementById('harfSol'),
      harfSag: document.getElementById('harfSag'),
      menu: document.getElementById('menu'),
      kurulum: document.getElementById('kurulum'),
      harfIzgarasi: document.getElementById('harfIzgarasi'),
      seciliSayac: document.getElementById('seciliSayac'),
      kurulumUyari: document.getElementById('kurulumUyari'),
      gameOver: document.getElementById('gameOver'),
      finalSkor: document.getElementById('finalSkor'),
      btnMenuDevam: document.getElementById('btnMenuDevam'),
      btnGeri: document.getElementById('btnGeri'),
      btnOyunaBasla: document.getElementById('btnOyunaBasla'),
      btnBaslangic: document.getElementById('btnBaslangic'),
      btnTumunu: document.getElementById('btnTumunu'),
      btnTemizle: document.getElementById('btnTemizle'),
      btnTekrar: document.getElementById('btnTekrar'),
      btnAyarlar: document.getElementById('btnAyarlar'),
      btnDinle: document.getElementById('btnDinle'),
    };

    this.kurulumHarfleriniOlustur();
    this.yerelAyarlariYukle();
    this.baglaOlaylar();
    this.kurulumGuncelle();
  }

  normalizeHarf(harf) {
    return harf.toLocaleUpperCase('tr-TR');
  }

  harfGoster(harf) {
    const temel = this.normalizeHarf(harf);
    if (this.harfBoyutu === 'buyuk') {
      return temel.toLocaleUpperCase('tr-TR');
    }
    if (this.harfBoyutu === 'kucuk') {
      return temel.toLocaleLowerCase('tr-TR');
    }
    return Math.random() < 0.5
      ? temel.toLocaleUpperCase('tr-TR')
      : temel.toLocaleLowerCase('tr-TR');
  }

  harfEsit(a, b) {
    return this.normalizeHarf(a) === this.normalizeHarf(b);
  }

  kurulumHarfleriniOlustur() {
    this.el.harfIzgarasi.innerHTML = '';
    this.ayarlar.harfler.forEach((harf) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'harf-sec';
      btn.dataset.harf = harf;
      btn.textContent = harf;
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', () => this.harfSeciminiDegistir(harf));
      this.el.harfIzgarasi.appendChild(btn);
    });
  }

  harfSeciminiDegistir(harf) {
    const temel = this.normalizeHarf(harf);
    const idx = this.seciliHarfler.findIndex((h) => this.harfEsit(h, temel));
    if (idx >= 0) {
      this.seciliHarfler.splice(idx, 1);
    } else {
      this.seciliHarfler.push(temel);
    }
    this.kurulumGuncelle();
    this.yerelAyarlariKaydet();
  }

  harfleriAyarla(liste) {
    this.seciliHarfler = liste.map((h) => this.normalizeHarf(h));
    this.kurulumGuncelle();
    this.yerelAyarlariKaydet();
  }

  kurulumGuncelle() {
    const seciliSet = new Set(this.seciliHarfler.map((h) => this.normalizeHarf(h)));
    this.el.harfIzgarasi.querySelectorAll('.harf-sec').forEach((btn) => {
      const secili = seciliSet.has(btn.dataset.harf);
      btn.classList.toggle('secili', secili);
      btn.setAttribute('aria-pressed', secili ? 'true' : 'false');
    });

    const adet = this.seciliHarfler.length;
    const yeterli = adet >= this.ayarlar.minHarfSayisi;
    this.el.seciliSayac.textContent = `${adet} harf`;
    this.el.btnOyunaBasla.disabled = !yeterli;
    this.el.kurulumUyari.classList.toggle('gizli', yeterli);
  }

  harfBoyutunuOku() {
    const secilen = document.querySelector('input[name="harfBoyutu"]:checked');
    this.harfBoyutu = secilen ? secilen.value : 'buyuk';
  }

  yerelAyarlariKaydet() {
    try {
      localStorage.setItem(
        'sesHarfOyunu',
        JSON.stringify({
          seciliHarfler: this.seciliHarfler,
          harfBoyutu: this.harfBoyutu,
        }),
      );
    } catch {
      /* depolama kapalı olabilir */
    }
  }

  yerelAyarlariYukle() {
    try {
      const ham = localStorage.getItem('sesHarfOyunu');
      if (!ham) return;
      const veri = JSON.parse(ham);
      if (Array.isArray(veri.seciliHarfler) && veri.seciliHarfler.length >= this.ayarlar.minHarfSayisi) {
        this.seciliHarfler = veri.seciliHarfler.map((h) => this.normalizeHarf(h));
      }
      if (['buyuk', 'kucuk', 'karisik'].includes(veri.harfBoyutu)) {
        this.harfBoyutu = veri.harfBoyutu;
        const input = document.querySelector(`input[name="harfBoyutu"][value="${veri.harfBoyutu}"]`);
        if (input) input.checked = true;
      }
    } catch {
      /* geçersiz kayıt */
    }
  }

  baglaOlaylar() {
    this.el.btnMenuDevam.addEventListener('click', () => this.kurulumuAc());
    this.el.btnGeri.addEventListener('click', () => this.menuyuAc());
    this.el.btnOyunaBasla.addEventListener('click', () => this.basla());
    this.el.btnTekrar.addEventListener('click', () => this.basla());
    this.el.btnAyarlar.addEventListener('click', () => this.kurulumuAc());

    this.el.btnBaslangic.addEventListener('click', () => {
      this.harfleriAyarla(this.ayarlar.baslangicSeti);
    });
    this.el.btnTumunu.addEventListener('click', () => {
      this.harfleriAyarla(this.ayarlar.harfler);
    });
    this.el.btnTemizle.addEventListener('click', () => {
      this.harfleriAyarla([]);
    });

    document.querySelectorAll('input[name="harfBoyutu"]').forEach((input) => {
      input.addEventListener('change', () => {
        this.harfBoyutunuOku();
        this.yerelAyarlariKaydet();
      });
    });

    this.el.btnDinle.addEventListener('click', () => this.sesiTekrarCal());

    const cevapTik = (taraf) => {
      if (this.durum !== 'oynuyor') return;
      const harf = taraf === 'sol' ? this.solHarf : this.sagHarf;
      this.cevapKontrol(harf);
    };

    this.el.harfSol.addEventListener('click', (e) => {
      e.stopPropagation();
      cevapTik('sol');
    });
    this.el.harfSag.addEventListener('click', (e) => {
      e.stopPropagation();
      cevapTik('sag');
    });
  }

  hedefMesajYaz(metin) {
    this.el.hedefMesaj.textContent = metin;
  }

  animasyonuDurdur() {
    if (this.animasyonId) {
      cancelAnimationFrame(this.animasyonId);
      this.animasyonId = null;
    }
  }

  harfleriTiklanabilirYap(aktif) {
    this.el.harfSol.classList.toggle('tiklanabilir', aktif);
    this.el.harfSag.classList.toggle('tiklanabilir', aktif);
    this.el.ekran.classList.toggle('beklemede', !aktif);
  }

  async sesiTekrarCal() {
    if (!this.dogruHarf || (this.durum !== 'oynuyor' && this.durum !== 'dinliyor')) return;

    this.animasyonuDurdur();
    this.harfleriTiklanabilirYap(false);
    this.durum = 'dinliyor';
    this.hedefMesajYaz('Dinle…');

    await this.ses.cal(this.dogruHarf);

    if (this.durum !== 'dinliyor') return;

    this.akisiBaslat();
  }

  tumKatmanlariGizle() {
    this.el.menu.classList.add('gizli');
    this.el.kurulum.classList.add('gizli');
    this.el.ekran.classList.add('gizli');
    this.el.gameOver.classList.add('gizli');
  }

  menuyuAc() {
    this.durum = 'menu';
    this.turToken += 1;
    this.ses.durdur();
    this.animasyonuDurdur();
    document.body.classList.remove('kurulum-acik');
    this.tumKatmanlariGizle();
    this.el.menu.classList.remove('gizli');
  }

  kurulumuAc() {
    this.durum = 'kurulum';
    this.turToken += 1;
    this.ses.durdur();
    this.animasyonuDurdur();
    this.tumKatmanlariGizle();
    this.el.kurulum.classList.remove('gizli');
    document.body.classList.add('kurulum-acik');
    this.kurulumGuncelle();
  }

  rastgeleHarf(haric = []) {
    const haricSet = new Set(haric.map((h) => this.normalizeHarf(h)));
    const uygun = this.seciliHarfler.filter((h) => !haricSet.has(this.normalizeHarf(h)));
    if (uygun.length === 0) return this.seciliHarfler[0];
    return uygun[Math.floor(Math.random() * uygun.length)];
  }

  basla() {
    if (this.seciliHarfler.length < this.ayarlar.minHarfSayisi) {
      this.kurulumuAc();
      return;
    }

    this.harfBoyutunuOku();
    this.yerelAyarlariKaydet();
    this.ses.durdur();
    this.turToken += 1;
    this.durum = 'oynuyor';
    this.skor = 0;
    this.el.skor.textContent = '0';
    document.body.classList.remove('kurulum-acik');
    this.tumKatmanlariGizle();
    this.el.ekran.classList.remove('gizli');
    this.yeniTur();
  }

  turHazirla() {
    this.dogruHarf = this.rastgeleHarf();
    this.yanlisHarf = this.rastgeleHarf([this.dogruHarf]);

    if (this.harfEsit(this.dogruHarf, this.yanlisHarf) && this.seciliHarfler.length < 2) {
      this.oyunBitti('En az 2 farklı harf seçmelisin.');
      return false;
    }

    if (Math.random() < 0.5) {
      this.solHarf = this.dogruHarf;
      this.sagHarf = this.yanlisHarf;
    } else {
      this.solHarf = this.yanlisHarf;
      this.sagHarf = this.dogruHarf;
    }

    this.el.harfSol.textContent = this.harfGoster(this.solHarf);
    this.el.harfSag.textContent = this.harfGoster(this.sagHarf);

    const alan = this.el.ekran.getBoundingClientRect();
    const ust = 72;
    this.harfHedefY = alan.height - 80;
    this.harfKonumlari = { sol: ust, sag: ust };

    this.harfKonumGuncelle('sol', ust);
    this.harfKonumGuncelle('sag', ust);

    return true;
  }

  akisiBaslat() {
    this.durum = 'oynuyor';
    this.hedefMesajYaz('Doğru harfe tıkla!');
    this.harfleriTiklanabilirYap(true);
    this.sonZaman = performance.now();
    this.dongu();
  }

  async yeniTur() {
    const token = ++this.turToken;
    this.animasyonuDurdur();
    this.harfleriTiklanabilirYap(false);

    if (!this.turHazirla()) return;

    this.durum = 'dinliyor';
    this.hedefMesajYaz('Dinle…');

    await this.ses.cal(this.dogruHarf);

    if (token !== this.turToken || this.durum !== 'dinliyor') return;

    this.akisiBaslat();
  }

  dongu() {
    if (this.durum !== 'oynuyor') return;

    const simdi = performance.now();
    const dt = (simdi - this.sonZaman) / 1000;
    this.sonZaman = simdi;

    this.harfKonumlari.sol += this.ayarlar.dusmeHizi * dt;
    this.harfKonumlari.sag += this.ayarlar.dusmeHizi * dt;

    this.harfKonumGuncelle('sol', this.harfKonumlari.sol);
    this.harfKonumGuncelle('sag', this.harfKonumlari.sag);

    if (this.harfKonumlari.sol >= this.harfHedefY) {
      this.oyunBitti('Süre doldu! Harfler kaçtı.');
      return;
    }

    this.animasyonId = requestAnimationFrame(() => this.dongu());
  }

  cevapKontrol(secilen) {
    if (this.durum !== 'oynuyor') return;

    this.animasyonuDurdur();

    if (this.harfEsit(secilen, this.dogruHarf)) {
      this.skor += 1;
      this.el.skor.textContent = String(this.skor);
      this.el.ekran.classList.add('dogru-flash');
      setTimeout(() => {
        this.el.ekran.classList.remove('dogru-flash');
        if (this.durum === 'oynuyor') this.yeniTur();
      }, this.ayarlar.turArasiBekleme);
    } else {
      this.oyunBitti('Yanlış harf!');
    }
  }

  harfKonumGuncelle(taraf, y) {
    const el = taraf === 'sol' ? this.el.harfSol : this.el.harfSag;
    el.style.transform = `translateX(-50%) translateY(${y}px)`;
  }

  oyunBitti(mesaj) {
    this.durum = 'bitti';
    this.turToken += 1;
    this.harfleriTiklanabilirYap(false);
    this.ses.durdur();
    this.animasyonuDurdur();
    document.getElementById('gameOverMesaj').textContent = mesaj;
    this.el.finalSkor.textContent = String(this.skor);
    this.tumKatmanlariGizle();
    this.el.gameOver.classList.remove('gizli');
  }
}

function oyunuBaslat() {
  if (!window.OYUN_AYARLARI) {
    console.error('config.js yüklenemedi. index.html dosyasını klasöründen açın.');
    return;
  }
  if (window.__sesHarfOyunu) return;
  window.__sesHarfOyunu = new SesHarfOyunu(window.OYUN_AYARLARI);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', oyunuBaslat);
} else {
  oyunuBaslat();
}
