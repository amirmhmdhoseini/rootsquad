<template>
  <header class="bar">
    <svg class="brand-logo" viewBox="92 100 447 515" role="img" aria-label="Root Squad" overflow="hidden">
      <image href="/brand-green-white.png" width="1270" height="715" />
    </svg>


  <div class="lang-switch" role="group" aria-label="انتخاب زبان">
    <button type="button" data-lang="fa" aria-pressed="true">FA</button>
    <button type="button" data-lang="ar" aria-pressed="false">AR</button>
    <button type="button" data-lang="en" aria-pressed="false">EN</button>
  </div>

  <nav class="rail" aria-label="بخش‌های صفحه">
    <a href="#s0" data-i="0" aria-current="true"><span data-i18n="navHome">خانه</span></a>
    <a href="#services" data-i="1"><span data-i18n="navServices">خدمات</span></a>
    <a href="#work" data-i="2"><span data-i18n="navWork">نمونه‌کارها</span></a>
    <a href="#team" data-i="3"><span data-i18n="navTeam">تیم ما</span></a>
    <a href="#contact" data-i="4"><span data-i18n="navContact">تماس</span></a>
  </nav>
  </header>

  <div class="marquee" aria-hidden="true">
    <div class="track">
      <span data-i18n="marquee">GROW FROM THE ROOT</span>
      <span data-i18n="marquee">GROW FROM THE ROOT</span>
      <span data-i18n="marquee">GROW FROM THE ROOT</span>
      <span data-i18n="marquee">GROW FROM THE ROOT</span>
      <span data-i18n="marquee">GROW FROM THE ROOT</span>
      <span data-i18n="marquee">GROW FROM THE ROOT</span>
      <span data-i18n="marquee">GROW FROM THE ROOT</span>
      <span data-i18n="marquee">GROW FROM THE ROOT</span>
    </div>
  </div>

  <div id="cur" class="cursor" aria-hidden="true"></div>
</template>
