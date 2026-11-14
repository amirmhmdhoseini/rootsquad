<script setup>
import { siteConfig } from '../data/siteConfig.js'
const c = siteConfig.contact
</script>

<template>
  <section id="contact" class="stage end contact-stage" data-stage="4">
    <div class="panel contact-panel">
      <div class="contact-copy">
        <p class="eyebrow" data-i18n="contactEyebrow">04 / تماس با ما</p>
        <h2 data-i18n="contactTitle">دربارهٔ نیاز پروژه‌تان گفت‌وگو کنیم</h2>
        <p class="lead" data-i18n="contactLead">از کسب‌وکارتان، مسئله‌ای که می‌خواهید حل کنید و امکاناتی که در نظر دارید برایمان بگویید تا با هم مسیر مناسب اجرای پروژه را بررسی کنیم.</p>
        <ul class="contact-links">
          <li><span data-i18n="contactPhoneLabel">تلفن</span><a :href="c.phoneHref" dir="ltr">{{ c.phoneDisplay }}</a></li>
          <li><span data-i18n="contactEmailLabel">ایمیل</span><a :href="c.emailHref" dir="ltr">{{ c.email }}</a></li>
          <li v-if="!c.telegramHref.includes('your_')"><span data-i18n="contactTelegramLabel">تلگرام</span><a :href="c.telegramHref" target="_blank" rel="noopener noreferrer" dir="ltr">{{ c.telegram }}</a></li>
          <li v-if="!c.instagramHref.includes('your_')"><span data-i18n="contactInstagramLabel">اینستاگرام</span><a :href="c.instagramHref" target="_blank" rel="noopener noreferrer" dir="ltr">{{ c.instagram }}</a></li>
        </ul>
      </div>

      <form id="contactForm" class="contact-form">
        <label>
          <span data-i18n="formName">نام</span>
          <input type="text" name="name" autocomplete="name" required maxlength="120" placeholder="نام و نام خانوادگی شما" data-i18n-placeholder="formNamePlaceholder" />
        </label>
        <label>
          <span data-i18n="formEmail">ایمیل</span>
          <input type="email" name="email" autocomplete="email" required maxlength="254" placeholder="name@example.com" data-i18n-placeholder="formEmailPlaceholder" />
        </label>
        <label class="contact-brief">
          <span data-i18n="formProject">شرح پروژه</span>
          <textarea name="project" rows="4" required minlength="12" maxlength="5000" placeholder="کمی از کسب‌وکارتان، نیاز اصلی پروژه، امکانات مدنظر و زمان‌بندی احتمالی برایمان بنویسید." data-i18n-placeholder="formProjectPlaceholder"></textarea>
        </label>
        <button type="submit"><span data-i18n="formSubmit">ارسال پیام</span> <span aria-hidden="true">↗</span></button>
        <p id="formStatus" class="form-status" aria-live="polite" data-i18n="formStatus"></p>
      </form>

      <!-- <footer class="mini-footer">
        <span>ROOT SQUAD</span>
        <span data-i18n="footerServices">وردپرس · کدنویسی اختصاصی · Bubble</span>
      </footer> -->
    </div>
  </section>
</template>
