# Harfler — GitHub yayın rehberi

Bu klasörün tamamı `harfler` adlı GitHub deposu olacak.

## 1. Git kurulumu

1. https://git-scm.com/download/win adresinden indirin ve kurun.
2. Kurulumda varsayılan seçenekler yeterli.
3. PowerShell’i **kapatıp yeniden açın**.
4. Kontrol: `git --version`

## 2. GitHub’da depo oluşturma

1. https://github.com adresine giriş yapın.
2. Sağ üst **+** → **New repository**
3. Ayarlar:
   - **Repository name:** `harfler`
   - **Public**
   - "Add a README file" **işaretli olmasın**
4. **Create repository**

## 3. Dosyaları yükleme (komut satırı)

PowerShell:

```powershell
cd "c:\Users\silha\OneDrive\Belgeler\Codes\SesHarfOyunu"

git init
git add .
git status
git commit -m "İlk sürüm: Ses Harf Oyunu"
git branch -M main
```

`KULLANICI_ADIN` yerine kendi kullanıcı adınızı yazın:

```powershell
git remote add origin https://github.com/KULLANICI_ADIN/harfler.git
git push -u origin main
```

### Giriş sorunları

- **HTTPS:** GitHub artık şifre kabul etmez. [Personal Access Token](https://github.com/settings/tokens) oluşturup şifre yerine token yapıştırın.
- **SSH:** SSH anahtarınız varsa:  
  `git remote add origin git@github.com:KULLANICI_ADIN/harfler.git`

## 4. GitHub Pages (ücretsiz canlı oyun)

1. `https://github.com/KULLANICI_ADIN/harfler` → **Settings**
2. Sol menü **Pages**
3. **Branch:** `main`, **Folder:** `/ (root)` → **Save**
4. Yeşil kutuda çıkan link: `https://KULLANICI_ADIN.github.io/harfler/`

Telefonda bu linki açıp tarayıcıdan **Ana ekrana ekle** ile uygulama gibi kullanabilirsiniz.

## 5. Sonraki güncellemeler

Kod değiştirdikten sonra:

```powershell
cd "c:\Users\silha\OneDrive\Belgeler\Codes\SesHarfOyunu"
git add .
git commit -m "Değişiklik açıklaması"
git push
```

Pages birkaç dakika içinde güncellenir.

## Alternatif: GitHub Desktop

Komut satırı istemezseniz:

1. https://desktop.github.com kurun
2. **File → Add local repository** → bu klasörü seçin
3. **Publish repository** → ad: `harfler`
