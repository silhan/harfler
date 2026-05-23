/**
 * Harf seslerini çalar. Önce mp3 dener, yoksa Web Speech API kullanır.
 */
class SesYoneticisi {
  constructor(ayarlar) {
    this.ayarlar = ayarlar;
    this.onbellek = new Map();
    this.speech = window.speechSynthesis;
  }

  dosyaYolu(harf) {
    const kucuk = harf.toLocaleUpperCase('tr-TR').toLocaleLowerCase('tr-TR');
    return `${this.ayarlar.sesKlasoru}${kucuk}.mp3`;
  }

  async yukle(harf) {
    if (this.onbellek.has(harf)) return this.onbellek.get(harf);

    const audio = new Audio(this.dosyaYolu(harf));
    audio.preload = 'auto';

    const yuklendi = await new Promise((resolve) => {
      const bitir = (ok) => {
        audio.removeEventListener('canplaythrough', onOk);
        audio.removeEventListener('error', onErr);
        resolve(ok);
      };
      const onOk = () => bitir(true);
      const onErr = () => bitir(false);
      audio.addEventListener('canplaythrough', onOk, { once: true });
      audio.addEventListener('error', onErr, { once: true });
      setTimeout(() => bitir(false), 400);
      audio.load();
    });

    if (yuklendi) {
      const kopya = audio.cloneNode();
      this.onbellek.set(harf, { tip: 'dosya', ses: kopya });
      return this.onbellek.get(harf);
    }

    this.onbellek.set(harf, { tip: 'tts' });
    return this.onbellek.get(harf);
  }

  async cal(harf) {
    const kayit = await this.yukle(harf);

    if (kayit.tip === 'dosya') {
      const a = kayit.ses.cloneNode();
      a.currentTime = 0;
      try {
        await a.play();
      } catch {
        this.ttsCal(harf);
      }
      return;
    }

    this.ttsCal(harf);
  }

  ttsCal(harf) {
    if (!this.speech) return;
    this.speech.cancel();
    const utter = new SpeechSynthesisUtterance(harf);
    utter.lang = 'tr-TR';
    utter.rate = 0.85;
    this.speech.speak(utter);
  }

  durdur() {
    this.onbellek.forEach((k) => {
      if (k.tip === 'dosya') {
        k.ses.pause();
        k.ses.currentTime = 0;
      }
    });
    if (this.speech) this.speech.cancel();
  }
}
