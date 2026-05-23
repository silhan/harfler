# Harfler — Ses Harf Oyunu

Türkçe harfleri sesle eşleştiren, mobil uyumlu bir web oyunu.

> GitHub Pages ile yayınladıktan sonra oyun adresi: `https://KULLANICI_ADIN.github.io/harfler/`

## GitHub’a yükleme (ilk kez)

Bilgisayarda [Git for Windows](https://git-scm.com/download/win) kurulu olmalı.

1. [github.com/new](https://github.com/new) adresinde yeni depo oluşturun:
   - **Repository name:** `harfler`
   - Public seçin, README eklemeyin (projede zaten var)

2. PowerShell’de proje klasöründe:

```powershell
cd "c:\Users\silha\OneDrive\Belgeler\Codes\SesHarfOyunu"

git init
git add .
git commit -m "İlk sürüm: Ses Harf Oyunu"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/harfler.git
git push -u origin main
```

`KULLANICI_ADIN` yerine kendi GitHub kullanıcı adınızı yazın. İlk `push` sırasında giriş istenir.

### İnternette oynatmak (GitHub Pages)

1. Depoda **Settings** → **Pages**
2. **Build and deployment** → Source: **Deploy from a branch**
3. Branch: `main`, Folder: `/ (root)` → **Save**
4. Birkaç dakika sonra oyun `https://KULLANICI_ADIN.github.io/harfler/` adresinde açılır.

Ayrıntılı adımlar: [YAYINLA.md](YAYINLA.md)
## Nasıl oynanır?

1. **Harf Seç ve Oyna** → öğrenmek istediğin harfleri işaretle (en az 2).
2. **Büyük / Küçük / Karışık** modundan birini seç.
3. Oyun bir harf sesi çalar; iki harf aşağı kayar.
4. Doğru harfe veya ses düğmesine tıkla → yeni tur. Yanlış seçimde oyun biter.

Yeni başlayanlar için varsayılan: **A** ve **E**. `Başlangıç (5)` ile A, E, L, M, K seçilir.

## Hemen çalıştırma

`index.html` dosyasını çift tıklayın veya bir yerel sunucu ile açın:

```powershell
cd "c:\Users\silha\OneDrive\Belgeler\Codes\SesHarfOyunu"
python -m http.server 8080
```

Tarayıcıda: http://localhost:8080

## Geliştirme

| Ne değiştirmek istiyorsunuz? | Dosya |
|------------------------------|--------|
| Harf listesi, başlangıç seti | `js/config.js` |
| Seçim ekranı, büyük/küçük  | `js/game.js` + ayarlar ekranı |
| Oyun mantığı                 | `js/game.js` |
| Ses çalma                   | `js/ses.js` |
| Görünüm                     | `css/style.css` |
| Harf sesleri (MP3)          | `sounds/*.mp3` |

### Mod: harfe tıklama

`config.js` içinde `sesDugmeleriModu: false` yapın — o zaman düşen harfe tıklanır, ses düğmeleri gizlenir.

## Android’e taşıma

### Seçenek A — PWA (en kolay)

1. Oyunu bir web sunucusuna yükleyin veya telefonda yerel sunucu kullanın.
2. Chrome’da menü → **Ana ekrana ekle**.

### Seçenek B — Capacitor APK

Node.js kurduktan sonra:

```powershell
npm install -g @capacitor/cli
cd SesHarfOyunu
npm init -y
npm install @capacitor/core @capacitor/android
npx cap init "Ses Harf" com.example.sesharf --web-dir .
npx cap add android
npx cap open android
```

Android Studio’da **Run** ile telefona yükleyin.

### Seçenek C — WebView sarmalayıcı

[Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/) veya basit bir WebView uygulaması ile `index.html` yolunu gösterin.

## Ses dosyaları

`sounds/` klasörüne MP3 ekleyin. Ayrıntılar: `sounds/README.md`.
