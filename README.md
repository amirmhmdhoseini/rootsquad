# Root Squad

سایت Vue همراه با بک‌اند Django برای دریافت و مدیریت پیام‌های تماس. متن‌ها، خدمات، اعضا و نمونه‌کارها همچنان در فرانت نگهداری می‌شوند. پیام‌ها در دیتابیس ذخیره می‌شوند؛ این نسخه ایمیل یا پیام تلگرام ارسال نمی‌کند.

## ساختار

```text
src/                         فرانت Vue
  services/contactApi.js     ارتباط با API و دریافت CSRF
  services/contactForm.js    وضعیت ارسال و بازخورد فرم
backend/
  venv/                      محیط مجازی محلی؛ داخل Git قرار نمی‌گیرد
  manage.py
  config/settings/           تنظیمات مشترک، توسعه و تولید
  contact/                   پیام‌ها، فرم، API، پنل و تست‌ها
  requirements.txt           وابستگی اجرای محلی
  requirements-production.txt وابستگی‌های اضافی دیپلوی
deploy/                      نمونهٔ تنظیمات Nginx و systemd
```

## اجرای محلی

پیش‌نیازها: Python 3.12 یا جدیدتر و Node.js سازگار با Vite فعلی پروژه.

از ریشهٔ پروژه:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 127.0.0.1:8000
```

محیط `backend/venv` در این نسخه ساخته شده است؛ روی دستگاه یا سرور دیگر آن را دوباره بسازید و کپی نکنید. پنل مدیریت: `http://127.0.0.1:8000/admin/`. حساب مدیر و رمز پیش‌فرض وجود ندارد؛ با دستور بالا خودتان ایجاد کنید.

در ترمینالی جدا، از ریشهٔ پروژه:

```bash
npm ci
npm run dev
```

سایت را از آدرسی که Vite نمایش می‌دهد باز کنید؛ مسیر `/api/` به Django پروکسی می‌شود. برای حفظ کوکی مدیر بین راه‌اندازی‌های مجدد، یک کلید محلی ثابت بسازید و در محیط قرار دهید:

```bash
cd backend
cp .env.example .env
source venv/bin/activate
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

خروجی را به شکل `DJANGO_SECRET_KEY='کلید تولیدشده'` در `.env` بگذارید؛ سپس:

```bash
set -a
source .env
set +a
python manage.py runserver 127.0.0.1:8000
```

فایل‌های `.env` خودکار خوانده نمی‌شوند؛ shell یا مدیر سرویس باید آن‌ها را وارد محیط کند. بدون کلید محلی، تنظیمات توسعه در هر پردازش یک کلید موقتی می‌سازد. `DEBUG=True` فقط برای توسعه است.

## تست و بررسی

از ریشه:

```bash
backend/venv/bin/python backend/manage.py test contact --verbosity 2
backend/venv/bin/python backend/manage.py makemigrations --check --dry-run
backend/venv/bin/python backend/manage.py check
npm test
npm run build
```

تست‌های بک‌اند درخواست‌های واقعی Django را با دیتابیس آزمایشی مستقل اجرا می‌کنند؛ دیتابیس محلی و پیام‌های شما پاک نمی‌شوند. CSRF، ورودی نامعتبر، سقف حجم، محدودیت ارسال، جعل IP، دسترسی مدیر، نمایش امن متن و تنظیمات تولید بررسی می‌شوند. تست‌های Node ارتباط HTTP را شبیه‌سازی و ترتیب CSRF/ارسال و رفتار فرم را بررسی می‌کنند؛ جای تست مرورگر روی سرور واقعی را نمی‌گیرند.

محیط اجرای این کار دسترسی شبکه برای pip ندارد. Django **5.2.17**، asgiref **3.12.1** و sqlparse **0.6.0** از کش محلی نصب شدند. وابستگی تولید حداقل Django **5.2.19** می‌خواهد؛ نصب محلی کش‌شده جایگزین این شرط دیپلوی نیست. پیش از دیپلوی، `pip install --upgrade -r requirements-production.txt` را در محیط متصل اجرا و تست‌ها را با همان نسخه‌های نصب‌شده تکرار کنید. نصب و اجرای Gunicorn، درایور PostgreSQL و ارتباط با PostgreSQL در این محیط قابل تأیید نیست. نسخهٔ دقیق وابستگی‌های تست‌شده در سرور را با `python -m pip freeze` ثبت کنید.

اجرای بررسی کامل `check --deploy` در این محیط به‌دلیل نبود درایور PostgreSQL متوقف شد؛ تست مستقل سیاست امنیتی تولید اجرا شده و تنها هشدار عمدی `security.W021` را دارد. همچنین محیط اجازهٔ بازکردن پورت محلی را نداد، بنابراین تست زندهٔ HTTP/مرورگر اجرا نشده است. تست‌های درخواست Django و دیتابیس و تست‌های منطق فرانت اجرا شده‌اند. این تفاوت‌ها باید پیش از انتشار روی سرور واقعی بررسی شوند.

## قرارداد API

- `GET /api/csrf/`: کوکی HTTP-only و پاسخ `{"csrfToken":"..."}`؛ پاسخ کش نمی‌شود.
- `POST /api/contact/`: فیلدهای `name`، `email` و `project` به شکل multipart یا URL-encoded؛ هدر `X-CSRFToken` و کوکی همان نشست الزامی است.
- نام: ۱ تا ۱۲۰ نویسه؛ ایمیل معتبر: حداکثر ۲۵۴؛ شرح پروژه: ۱۲ تا ۵۰۰۰. فاصلهٔ ابتدا و انتها حذف می‌شود.
- موفقیت: `201 {"ok":true}`، تنها پس از ذخیره. اطلاعات پیام یا شناسهٔ آن به عموم برگردانده نمی‌شود.
- خطاها: `400 validation_error` با کدهای خطای فیلدها، `400 invalid_payload`، `403 csrf_failed`، `413 payload_too_large`، `415 unsupported_media_type` و `429 rate_limited` با هدر `Retry-After`.
- `GET /api/health/`: پاسخ `200 {"status":"ok"}` پس از پرس‌وجوی دیتابیس؛ خطای دیتابیس `503` است.
- API عمومی برای خواندن، ویرایش یا حذف پیام‌ها وجود ندارد.

سقف درخواست ۳۲ کیبی‌بایت است و آپلود فایل مجاز نیست. پیش‌فرض محدودیت داخلی، ۱۰ تلاش در هر پنجرهٔ ثابت ۱۰ دقیقه‌ای به ازای IP است؛ تلاش‌های با فرم نامعتبر هم شمرده می‌شوند. شناسهٔ IP به‌شکل HMAC ذخیره می‌شود. شمارنده‌ها در دیتابیس مشترک‌اند و با چند پردازش مستقل نمی‌شوند. پنجرهٔ ثابت می‌تواند در مرز دو پنجره دو سهمیهٔ متوالی بدهد. برای مقابله با حمله‌های حجیم، محدودیت Nginx هم در نمونهٔ دیپلوی موجود است.

فرم هنگام درخواست غیرفعال می‌شود و فقط پس از تأیید سرور پاک می‌شود. زمان انتظار حداکثر ۱۵ ثانیه است. درخواست POST خودکار تکرار نمی‌شود؛ قطع ارتباط پس از ذخیره می‌تواند نتیجه را برای کاربر نامشخص کند، پس پیش از ارسال دوباره بررسی کنید. تضمین حذف پیام‌های مشابه میان درخواست‌های جدا وجود ندارد.

## مدیریت پیام‌ها

مدیر می‌تواند پیام‌ها را جست‌وجو کند، بر اساس زمان و وضعیت فیلتر کند و وضعیت بررسی را تغییر دهد. اطلاعات اصلی پیام از پنل قابل بازنویسی نیست؛ حذف با مجوز Django امکان‌پذیر است. برای همکاران حساب staff با مجوزهای متناسب بسازید و حساب superuser را مشترک استفاده نکنید.

شمارنده‌های منقضی‌شده را روزانه پاک کنید:

```bash
cd backend
source venv/bin/activate
python manage.py cleanup_contact_limits
```

این دستور پیام‌ها را حذف نمی‌کند. برای خود پیام‌ها، مدت نگهداری و حذف دوره‌ای را متناسب با نیاز مجموعه تعیین کنید و پشتیبان‌گیری دیتابیس را در نظر بگیرید.

## دیپلوی روی سرور لینوکسی

فایل‌های `deploy/` نمونهٔ قابل تنظیم برای یک سرور با Nginx، systemd و PostgreSQL هستند. پیش از استفاده، دامنه، مسیرها، گواهی TLS و دسترسی کاربر سرویس را با سرور خودتان تطبیق دهید. این پروژه در این مرحله روی سرور منتشر نشده است.

۱. پروژه را مثلاً در `/srv/root-squad/root-squad-vue` قرار دهید. کاربر محدود `rootsquad` و دیتابیس PostgreSQL با کاربر اختصاصی و مجوز فقط دیتابیس خودش ایجاد کنید. محیط مجازی را روی همان سرور بسازید:

```bash
cd /srv/root-squad/root-squad-vue/backend
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade -r requirements-production.txt
```

۲. بر اساس `.env.production.example` فایل خصوصی `/etc/root-squad.env` بسازید. برای مدیر سرویس قابل خواندن باشد و دسترسی عمومی نداشته باشد، مثلاً مالک `root:rootsquad` و مجوز `640`. دامنه‌ها باید دقیق باشند؛ wildcard پذیرفته نیست. کلید مستقل و تصادفی با دستور تولید کلید بالا بسازید. رمز دیتابیس را در URL encode کنید. `sslmode=require` پیش‌فرض اتصال است؛ برای دیتابیس محلی بدون TLS فقط در صورت اطمینان از اتصال loopback آن را صریحاً تغییر دهید.

۳. محیط تولید را برای دستورات مدیریتی هم وارد کنید:

```bash
set -a
source /etc/root-squad.env
set +a
python manage.py migrate --noinput
python manage.py createsuperuser
python manage.py collectstatic --noinput
python manage.py check --deploy --fail-level WARNING
DJANGO_SETTINGS_MODULE=config.settings.development python manage.py test contact
python -m pip check
```

`SECRET_KEY` و دامنه و URL PostgreSQL نامعتبر باعث توقف تنظیمات تولید می‌شوند. HTTPS، کوکی امن، HSTS یک‌ساله شامل زیردامنه‌ها و محافظت CSRF فعال‌اند. **پیش از فعال‌کردن HSTS، همهٔ زیردامنه‌های مورد استفاده باید HTTPS داشته باشند.** عضویت در فهرست preload مرورگر فعال نشده است؛ اگر `security.W021` دربارهٔ preload ظاهر شد، این انتخاب عمدی است و باید متناسب با دامنه بررسی شود. هیچ هشدار امنیتی دیگری را بدون بررسی کنار نگذارید.

۴. فرانت را بسازید:

```bash
cd /srv/root-squad/root-squad-vue
npm ci
npm test
npm run build
```

۵. فایل `deploy/nginx-proxy.conf` را در `/etc/nginx/snippets/root-squad-proxy.conf` و نمونهٔ `nginx.conf` را پس از اصلاح دامنه و گواهی در تنظیمات سایت Nginx قرار دهید. کاربر Nginx باید به `dist` و `backend/staticfiles` دسترسی خواندن داشته باشد. تنظیمات میزبان پیش‌فرض Nginx را طوری نگه دارید که میزبان ناشناخته را رد کند.

۶. فایل‌های سرویس و timer را در `/etc/systemd/system/` قرار دهید. پس از بررسی:

```bash
sudo nginx -t
sudo systemctl daemon-reload
sudo systemctl enable --now root-squad.service root-squad-cleanup.timer
sudo systemctl reload nginx
sudo systemctl status root-squad.service
sudo journalctl -u root-squad.service -n 50
```

پورت Gunicorn فقط روی `127.0.0.1:8000` گوش می‌دهد و نباید مستقیم در اینترنت باز شود. `DJANGO_TRUST_PROXY_HEADERS=true` و `CONTACT_TRUSTED_PROXIES` فقط با پراکسی کنترل‌شده‌ای استفاده شوند که هدرها را مانند نمونه **بازنویسی** می‌کند. در Docker یا سرویس ابری، آدرس peer پراکسی و مسیرها متفاوت‌اند؛ این نمونه را عیناً استفاده نکنید. `runserver` و `vite preview` برای محیط تولید نیستند.

۷. بعد از راه‌اندازی HTTPS، فرم را در مرورگر ارسال کنید و ذخیرهٔ همان پیام را در پنل بررسی کنید. CSRF، ورود مدیر، محدودیت ارسال، بارگذاری CSS پنل، `/api/health/` و گزارش خطاهای سرور را بررسی کنید. PostgreSQL و Nginx/systemd باید در همان محیط واقعی آزمایش شوند.

برای به‌روزرسانی ابتدا پشتیبان دیتابیس بگیرید؛ سپس وابستگی‌های به‌روز، تست‌ها، migration، ساخت فرانت و restart سرویس را انجام دهید. نگهداری نسخه‌های امنیتی Django و نظارت بر دسترسی پنل بخشی از نگهداری سرور است.

مبنای تنظیمات: [راهنمای رسمی دیپلوی Django](https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/) و [محافظت CSRF در درخواست‌های AJAX](https://docs.djangoproject.com/en/5.2/howto/csrf/).
