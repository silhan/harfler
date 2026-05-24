/**
 * Doğru / yanlış tıklama ses ve görsel efektleri
 */
class EfektYoneticisi {
  constructor(katmanEl) {
    this.katman = katmanEl;
    this.audioCtx = null;
  }

  sesBaglami() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  tonCal(freq, baslangic, sure, tip = 'sine', ses = 0.22) {
    const ctx = this.sesBaglami();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = freq;
    o.type = tip;
    const t = ctx.currentTime + baslangic;
    g.gain.setValueAtTime(ses, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + sure);
    o.start(t);
    o.stop(t + sure);
  }

  olumluSes() {
    this.tonCal(523.25, 0, 0.1);
    this.tonCal(659.25, 0.1, 0.1);
    this.tonCal(783.99, 0.2, 0.22);
  }

  olumsuzSes() {
    const ctx = this.sesBaglami();
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(220, t);
    o.frequency.exponentialRampToValueAtTime(90, t + 0.35);
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    o.start(t);
    o.stop(t + 0.36);
  }

  parcaciklar(x, y, renkler, adet = 14) {
    if (!this.katman) return;
    for (let i = 0; i < adet; i += 1) {
      const p = document.createElement('span');
      const aci = (i / adet) * Math.PI * 2;
      const mesafe = 40 + Math.random() * 50;
      const tx = Math.cos(aci) * mesafe;
      const ty = Math.sin(aci) * mesafe;
      p.className = 'efekt-parcacik';
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.background = renkler[i % renkler.length];
      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      this.katman.appendChild(p);
      setTimeout(() => p.remove(), 650);
    }
  }

  olumluGorsel(harfEl, ekranEl) {
    if (!harfEl) return;
    const rect = harfEl.getBoundingClientRect();
    const katmanRect = this.katman.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - katmanRect.left;
    const cy = rect.top + rect.height / 2 - katmanRect.top;

    harfEl.classList.remove('olumlu-patla');
    void harfEl.offsetWidth;
    harfEl.classList.add('olumlu-patla');

    if (ekranEl) {
      ekranEl.classList.remove('dogru-flash');
      void ekranEl.offsetWidth;
      ekranEl.classList.add('dogru-flash');
    }

    this.parcaciklar(cx, cy, ['#fff59d', '#81c784', '#4fc3f7', '#ff8a65', '#fff']);
  }

  olumsuzGorsel(harfEl, ekranEl) {
    if (harfEl) {
      harfEl.classList.remove('olumsuz-sars');
      void harfEl.offsetWidth;
      harfEl.classList.add('olumsuz-sars');
    }
    if (ekranEl) {
      ekranEl.classList.remove('yanlis-flash', 'yanlis-sars');
      void ekranEl.offsetWidth;
      ekranEl.classList.add('yanlis-flash', 'yanlis-sars');
      setTimeout(() => ekranEl.classList.remove('yanlis-sars'), 500);
    }
  }
}
