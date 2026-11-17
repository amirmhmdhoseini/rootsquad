<script setup>
const projects = [1, 2, 3, 4, 5, 6]
</script>

<template>
  <section id="work" class="stage showcase-stage work-stage" data-stage="2">
    <div class="panel showcase-panel">
      <div class="section-heading">
        <p class="eyebrow" data-i18n="workEyebrow">02 / نمونه‌کارها</p>
        <h2 data-i18n="workTitle">نمونه‌کارهای طراحی سایت؛ راهکارهای اجراشده</h2>
        <p data-i18n="workLead">از مدیریت سفارش‌ها و اعضا تا رزرو وقت و فروش آنلاین؛ با نیاز هر پروژه، راهکار ما و امکانات پیاده‌سازی‌شده آشنا شوید.</p>
      </div>
      <ol id="projectList" class="project-list">
        <li v-for="(project, index) in projects" :key="project">
          <button type="button" :data-h="index">
            <span class="project-no">{{ String(project).padStart(2, '0') }}</span>
            <span>
              <strong :data-i18n="`project${project}`">عنوان پروژه</strong>
              <small :data-i18n="`project${project}Short`">&nbsp;</small>
            </span>
            <em data-i18n="viewDetails">جزئیات پروژه</em>
          </button>
        </li>
      </ol>
    </div>
  </section>
</template>