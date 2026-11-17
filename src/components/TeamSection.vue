<script setup>
const members = [1, 2, 3, 4]
</script>

<template>
  <section id="team" class="stage showcase-stage team-stage" data-stage="3">
    <div class="panel showcase-panel team-panel">
      <div class="section-heading">
        <p class="eyebrow" data-i18n="teamEyebrow">03 / تیم ما</p>
        <h2 data-i18n="teamTitle">تیم روت اسکواد؛ مهندسان پشت پروژهٔ شما</h2>
        <p data-i18n="teamLead">چهار مهندس کامپیوتر با تخصص‌های مکمل در توسعه، طراحی رابط کاربری و هماهنگی پروژه. با اعضای تیم و نقش هرکدام در اجرای پروژه‌ها آشنا شوید.</p>
      </div>
      <ol id="teamList" class="team-list hex-list">
        <li v-for="(member, index) in members" :key="member">
          <button type="button" :data-h="index">
            <span class="member-no">{{ String(member).padStart(2, '0') }}</span>
            <span>
              <strong :data-i18n="`member${member}`">نام عضو</strong>
              <small :data-i18n="`member${member}Roles`">&nbsp;</small>
            </span>
            <em data-i18n="viewProfile">معرفی عضو</em>
          </button>
        </li>
      </ol>
    </div>
  </section>
</template>