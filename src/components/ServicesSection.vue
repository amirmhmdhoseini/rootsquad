<script setup>
// Order: build (website, UX/UI, mobile) -> manage (CMS, support) -> data (analysis, ML).
// Texts live in src/composables/useSiteInteractions.js (service1..service7, fa / ar / en).
const services = [
  { n: 1, main: true, title: 'طراحی سایت', text: 'برای سایت شرکتی، فروشگاه اینترنتی یا پنل اختصاصی، ساختار و امکاناتی طراحی می‌کنیم که با نیاز مشتریان و فرایند فروش کسب‌وکارتان هماهنگ باشد.',
    icon: '<rect x="3" y="4" width="18" height="14" rx="1.5"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01M8 21h8M12 18v3"/>' },
  { n: 2, title: 'طراحی UX/UI', text: 'از مسیر حرکت کاربر تا ساختار صفحات و جزئیات رابط، تجربه‌ای طراحی می‌کنیم که در آن پیدا کردن خدمات و استفاده از محصول روشن و روان باشد.',
    icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>' },
  { n: 3, title: 'اپلیکیشن موبایل', text: 'برای خدماتی که به تجربهٔ کاربری در موبایل نیاز دارند، اپلیکیشن‌هایی طراحی و توسعه می‌دهیم که مسیر استفادهٔ مشخصی داشته باشند و با سامانه‌های کسب‌وکارتان یکپارچه شوند.',
    icon: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>' },
  { n: 4, title: 'مدیریت محتوا (CMS)', text: 'صفحات، نوشته‌ها و محصولات سایت را از یک پنل مدیریت کنید؛ به‌روزرسانی محتوای روزمره، بدون نیاز به ویرایش کد.',
    icon: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>' },
  { n: 5, title: 'پشتیبانی و مدیریت سایت', text: 'از به‌روزرسانی و پشتیبان‌گیری تا رفع خطا و تغییر امکانات، پشتیبانی سایت را متناسب با نیاز و شرایط هر پروژه پیش می‌بریم.',
    icon: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L3.5 17.2a1.8 1.8 0 0 0 2.5 2.5l5.8-5.8a4 4 0 0 0 5.1-5.4l-2.6 2.6-2.2-.5-.5-2.2z"/>' },
  { n: 6, title: 'تحلیل داده', text: 'داده‌های پراکندهٔ فروش و فعالیت‌های کسب‌وکار را به گزارش‌ها و داشبوردهای روشن تبدیل می‌کنیم تا روندها و فرصت‌های بهبود را دقیق‌تر ببینید.',
    icon: '<path d="M3 21h18M7 21v-8M12 21V4M17 21v-5"/>' },
  { n: 7, title: 'یادگیری ماشین', text: 'پس از ارزیابی کیفیت داده‌ها و امکان‌سنجی، در مسئله‌های مناسب از یادگیری ماشین برای دسته‌بندی، پیش‌بینی و شناسایی الگوها استفاده می‌کنیم.',
    icon: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7.8 6.5l8.4 1M7.2 7.7l3.8 8.6M16.9 9.8l-3.9 6.5"/>' },
]
const subs = [
  { n: 1, title: 'WordPress', text: 'طراحی سایت‌های شرکتی و فروشگاهی با امکان مدیریت محتوا و امکانات متناسب با نیاز کسب‌وکار.' },
  { n: 2, title: 'کدنویسی اختصاصی', text: 'توسعهٔ فرانت‌اند و بک‌اند اختصاصی برای پنل‌های مدیریت، سامانه‌های سفارش و اتصال فرایندهای کسب‌وکار.' },
  { n: 3, title: 'Bubble.io', text: 'ساخت وب‌اپلیکیشن و پیاده‌سازی فرایندهای کسب‌وکار با پلتفرم کم‌کد Bubble، در پروژه‌هایی که این انتخاب با نیازهای فنی آن‌ها سازگار است.' },
]
</script>

<template>
  <section id="services" class="stage showcase-stage services-stage" data-stage="1">
    <div class="panel showcase-panel services-panel">
      <div class="section-heading">
        <p class="eyebrow" data-i18n="servicesEyebrow">01 / خدمات</p>
        <h2 data-i18n="servicesTitle">خدمات طراحی سایت و نرم‌افزار برای کسب‌وکار شما</h2>
        <p data-i18n="servicesLead">از طراحی حضور حرفه‌ای شما در وب تا سامان‌دهی اطلاعات و فرایندها، راهکار را بر اساس نیاز واقعی پروژه و متناسب با هدف و بودجهٔ شما انتخاب می‌کنیم.</p>
      </div>

      <ol id="serviceList" class="service-list">
        <li v-for="(s, i) in services" :key="s.n" :class="{ 'is-main': s.main }" :style="{ '--j': i }">
          <article>
            <span class="svc-hex" aria-hidden="true"><svg viewBox="0 0 24 24" v-html="s.icon"></svg></span>
            <span class="service-no">{{ String(s.n).padStart(2, '0') }}</span>
            <div class="svc-body">
              <h3 :data-i18n="`service${s.n}`">{{ s.title }}</h3>
              <p :data-i18n="`service${s.n}Text`">{{ s.text }}</p>
            </div>
            <ul v-if="s.main" class="svc-sub">
              <li v-for="b in subs" :key="b.n">
                <strong :data-i18n="`svcSub${b.n}Title`">{{ b.title }}</strong>
                <span :data-i18n="`svcSub${b.n}Text`">{{ b.text }}</span>
              </li>
            </ul>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>