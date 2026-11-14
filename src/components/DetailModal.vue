<template>
  <div id="detailModal" class="detail-modal" hidden>
    <div class="modal-backdrop" data-modal-close></div>
    <article class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle" tabindex="-1">
      <button class="modal-close" type="button" data-modal-close aria-label="بستن">×</button>
      <p id="modalKicker" class="modal-kicker">PROJECT / 01</p>
      <h3 id="modalTitle">عنوان پروژه</h3>
      <p id="modalRole" class="modal-role" dir="ltr" hidden></p>
      <p id="modalSummary" class="modal-summary"></p>
      <h4 id="modalFeaturesTitle">ویژگی‌ها</h4>
      <ul id="modalFeatures" class="modal-features"></ul>
      <section id="modalReview" class="modal-review" hidden>
        <h4 id="modalReviewTitle">نظر کارفرما</h4>
        <blockquote id="modalReviewText"></blockquote>
        <p id="modalReviewBy" class="modal-review-by"></p>
      </section>
      <p id="modalNote" class="modal-note"></p>
      <a id="modalLink" class="modal-link" target="_blank" rel="noopener noreferrer" dir="ltr" hidden></a>
    </article>
  </div>
</template>