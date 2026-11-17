import { siteConfig } from '../data/siteConfig.js';
import { bindContactForm } from '../services/contactForm.js';

export function initSiteInteractions() {
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stages = Array.prototype.slice.call(document.querySelectorAll('.stage'));
  var copies = {
    fa: {
      pageTitle: 'طراحی سایت و نرم‌افزار اختصاصی | روت اسکواد', navLabel: 'بخش‌های صفحه', languageLabel: 'انتخاب زبان', close: 'بستن',
      brandTag: 'وب · طراحی · توسعه', navHome: 'خانه', navWork: 'نمونه‌کارها', navTeam: 'تیم ما', navContact: 'تماس', marquee: 'GROW FROM THE ROOT', heroIndex: '00 / معرفی روت اسکواد', systemOnline: 'سیستم فعال است', webSystems: 'سیستم‌های وب', creativeEngineering: 'مهندسی خلاق', capDesign: 'طراحی وب', capDevelopment: 'توسعه', capEngineering: 'مهندسی کامپیوتر', footerServices: 'وردپرس · کدنویسی اختصاصی · Bubble',
      heroKicker: 'طراحی سایت، نرم‌افزار و راهکارهای داده‌محور', heroH1: 'طراحی سایت و نرم‌افزار اختصاصی', heroStatement: "از شناخت نیاز کسب‌وکار شما تا ساخت یک راهکار دیجیتال کاربردی.", heroLead: "روت اسکواد، تیمی چهار نفره از مهندسان کامپیوتر با تخصص‌های مکمل است. وب‌سایت، فروشگاه اینترنتی و نرم‌افزار اختصاصی طراحی و توسعه می‌دهیم تا خدماتتان را بهتر معرفی کنید، سفارش‌ها را منظم‌تر مدیریت کنید و فرایندهای روزمرهٔ کسب‌وکارتان را ساده‌تر پیش ببرید.", ctaStart: "گفت‌وگو دربارهٔ پروژه", ctaWork: "مشاهدهٔ نمونه‌کارها", scrollExplore: "برای آشنایی بیشتر اسکرول کنید", mindsRoot: 'ذهن / یک ریشه',
      workEyebrow: '02 / نمونه‌کارها', workTitle: "نمونه‌کارهای طراحی سایت؛ راهکارهای اجراشده", workLead: "از مدیریت سفارش‌ها و اعضا تا رزرو وقت و فروش آنلاین؛ با نیاز هر پروژه، راهکار ما و امکانات پیاده‌سازی‌شده آشنا شوید.", viewDetails: "جزئیات پروژه",
      project1: 'Sanaa Online Shop', project2: 'Delyar NGO', project3: 'Jenna Brides', project4: 'Hafezi Architects', project6: 'Manamehr',
      navServices: 'خدمات', servicesEyebrow: '01 / خدمات', servicesTitle: "خدمات طراحی سایت و نرم‌افزار برای کسب‌وکار شما", servicesLead: "از طراحی حضور حرفه‌ای شما در وب تا سامان‌دهی اطلاعات و فرایندها، راهکار را بر اساس نیاز واقعی پروژه و متناسب با هدف و بودجهٔ شما انتخاب می‌کنیم.", service1: 'طراحی سایت', service1Text: "برای سایت شرکتی، فروشگاه اینترنتی یا پنل اختصاصی، ساختار و امکاناتی طراحی می‌کنیم که با نیاز مشتریان و فرایند فروش کسب‌وکارتان هماهنگ باشد.", service2: 'طراحی UX/UI', service2Text: "از مسیر حرکت کاربر تا ساختار صفحات و جزئیات رابط، تجربه‌ای طراحی می‌کنیم که در آن پیدا کردن خدمات و استفاده از محصول روشن و روان باشد.", service3: 'اپلیکیشن موبایل', service3Text: "برای خدماتی که به تجربهٔ کاربری در موبایل نیاز دارند، اپلیکیشن‌هایی طراحی و توسعه می‌دهیم که مسیر استفادهٔ مشخصی داشته باشند و با سامانه‌های کسب‌وکارتان یکپارچه شوند.",
      teamEyebrow: '03 / تیم ما', teamTitle: "تیم روت اسکواد؛ مهندسان پشت پروژهٔ شما", teamLead: "چهار مهندس کامپیوتر با تخصص‌های مکمل در توسعه، طراحی رابط کاربری و هماهنگی پروژه. با اعضای تیم و نقش هرکدام در اجرای پروژه‌ها آشنا شوید.", viewProfile: "معرفی عضو",
      member1: 'امیر محمد حسینی نژاد ', member2: 'بهار همتی', member3: 'فاطمه کاظمی مقدم', member4: 'محمدرضا نادری',
      contactEyebrow: '04 / تماس با ما', contactTitle: "دربارهٔ نیاز پروژه‌تان گفت‌وگو کنیم", contactLead: "از کسب‌وکارتان، مسئله‌ای که می‌خواهید حل کنید و امکاناتی که در نظر دارید برایمان بگویید تا با هم مسیر مناسب اجرای پروژه را بررسی کنیم.", formName: 'نام', formEmail: 'ایمیل', formProject: "شرح پروژه", formNamePlaceholder: "نام و نام خانوادگی شما", formEmailPlaceholder: 'name@example.com', formProjectPlaceholder: "کمی از کسب‌وکارتان، نیاز اصلی پروژه، امکانات مدنظر و زمان‌بندی احتمالی برایمان بنویسید.", formSubmit: "ارسال پیام", formStatus: '',
      modalFeaturesTitle: "امکانات و جزئیات اجرا", modalReviewTitle: 'نظر کارفرما', modalProjectLabel: 'پروژه', modalTeamLabel: 'عضو تیم',
      contactPhoneLabel: 'تلفن',
      contactEmailLabel: 'ایمیل',
      contactTelegramLabel: 'تلگرام',
      contactInstagramLabel: 'اینستاگرام',
      formInvalid: "لطفاً نام، ایمیل و شرح پروژه را بررسی کنید؛ شرح پروژه باید بین ۱۲ تا ۵۰۰۰ نویسه باشد.",
      formRateLimited: "تعداد ارسال‌ها از حد مجاز بیشتر شده است. لطفاً چند دقیقهٔ دیگر تلاش کنید.",
      formSessionExpired: "اعتبار ارسال تأیید نشد. لطفاً دوباره تلاش کنید یا صفحه را تازه کنید.",
      formTooLarge: "حجم پیام بیش از حد مجاز است. لطفاً شرح پروژه را کوتاه‌تر کنید.",
      formTimeout: "دریافت پاسخ طول کشید و وضعیت ارسال مشخص نیست. پیش از ارسال دوباره کمی صبر کنید یا از طریق ایمیل و تلفن با ما در ارتباط باشید.",
      formSending: 'در حال ارسال…',
      formSuccess: "پیامتان ارسال شد. به‌زودی برای ادامهٔ گفت‌وگو با شما تماس می‌گیریم.",
      formError: "پیامتان ارسال نشد. لطفاً دوباره تلاش کنید یا از طریق ایمیل یا تلفن با ما در ارتباط باشید.",
      project1Short: "مدیریت سفارش‌ها و اطلاع‌رسانی خودکار به مشتریان",
      project1Summary: "ثنا در زمینهٔ تهیهٔ محصولات برندهای معتبر خارجی فعالیت می‌کند. برای این مجموعه، سامانهٔ مدیریت سفارش، پنل مدیریتی و فرایندهای خودکار طراحی و پیاده‌سازی کردیم. تمرکز سایت بر مدیریت سفارش‌هاست و بخش فروشگاه ندارد.",
      project1Features: ["پنل اختصاصی برای هر مشتری", "پیگیری وضعیت سفارش‌ها", "فاکتورهای اختصاصی برای مشتری و مدیر سامانه", "گزارش‌های ماهانه و سالانه از سود، اقلام و کاربران جدید", "ارسال فاکتور و اعلان وضعیت سفارش با ربات تلگرام", "مدیریت یکپارچهٔ سفارش‌ها، فاکتورها و کاربران"],
      project1Note: 'فناوری: Django · HTML / SCSS / JavaScript (کدنویسی اختصاصی)',
      project2Short: "مدیریت اعضا و دسترسی به اطلاعات ضروری با کد QR",
      project2Summary: "دلیار، انجمنی برای حمایت از افراد مبتلا به دیابت است. در کنار معرفی انجمن و فعالیت‌هایش، سامانه‌ای اختصاصی برای مدیریت اعضا پیاده‌سازی کردیم که امکان شناسایی سریع اعضا و مشاهدهٔ نوع دیابت آن‌ها را با اسکن کد QR در شرایط اضطراری فراهم می‌کند.",
      project2Features: ["معرفی انجمن، فعالیت‌ها و خدمات آن", "ثبت‌نام اعضا و ایجاد پروفایل اختصاصی", "کد QR اختصاصی برای هر عضو", "نمایش نوع دیابت با اسکن کد", "پنل مدیریت اطلاعات اعضا", "امکان دریافت خروجی از فهرست اعضا"],
      project2Note: 'فناوری: WordPress',
      project3Short: "معرفی خدمات سالن و رزرو آنلاین وقت",
      project3Summary: "برای سالن زیبایی جنا، وب‌سایتی هماهنگ با هویت برند طراحی کردیم تا خدمات و جزئیات هرکدام به‌روشنی معرفی شوند و مشتریان امکان رزرو آنلاین وقت داشته باشند.",
      project3Features: ["طراحی هماهنگ با هویت برند", "ساختار صفحات متناسب با نیاز سالن", "معرفی خدمات سالن", "ارائهٔ جزئیات هر خدمت", "امکان رزرو آنلاین وقت", "طراحی واکنش‌گرا برای نمایش در اندازه‌های مختلف صفحه"],
      project3Note: 'فناوری: WordPress',
      project4Short: "معرفی پروژه‌های معماری در صفحات اختصاصی",
      project4Summary: "برای دفتر معماری حافظی، وب‌سایتی با تمرکز بر معرفی حرفه‌ای پروژه‌ها و خدمات مجموعه طراحی کردیم. هر پروژه در صفحه‌ای اختصاصی ارائه می‌شود تا آثار دفتر، ساختاری منظم و مشخص برای نمایش داشته باشند.",
      project4Features: ["طراحی متناسب با هویت برند و حوزهٔ معماری", "ساختار صفحات با تمرکز بر نمایش پروژه‌ها", "ارائهٔ پروژه‌های اجراشده", "معرفی خدمات مجموعه", "صفحهٔ اختصاصی برای هر پروژه", "طراحی واکنش‌گرا برای نمایش در اندازه‌های مختلف صفحه"],
      project4Note: 'فناوری: WordPress',
      project6Short: "فروشگاه آنلاین با مدیریت سفارش‌ها، مشتریان و موجودی",
      project6Summary: "برای مانامهر، مجموعه‌ای در حوزهٔ شیمی ساختمان، وب‌سایت و فروشگاهی پویا با پنل مدیریت اختصاصی ساختیم. این سامانه، معرفی شرکت و محصولات را در کنار مدیریت سفارش‌ها، مشتریان و موجودی انبار در یک ساختار قرار می‌دهد.",
      project6Features: ["طراحی اختصاصی هماهنگ با هویت برند", "معرفی شرکت، محصولات و پروژه‌ها", "مدیریت پویای فروشگاه و پروژه‌ها", "قابلیت نصب به‌صورت وب‌اپلیکیشن", "پنل اختصاصی مدیریت مشتریان، محصولات، سفارش‌ها و موجودی انبار", "تخفیف‌های عمومی و اختصاصی، همراه با گزارش فروش و سود"],
      project6Note: "فناوری: Bubble.io · وضعیت: مجموعه فعالیت سایت را متوقف کرده و سایت در حال حاضر غیرفعال است.",
      modalSkillsTitle: 'مهارت‌ها',
      member1Role: 'Technical Lead',
      member1Secondary: 'Backend Developer',
      member1Roles: 'Technical Lead · Backend Developer',
      member1Bio: "امیر محمد، راهبری فنی پروژه‌ها و توسعهٔ بک‌اند را بر عهده دارد. تمرکز او بر طراحی و پیاده‌سازی راهکارهای نرم‌افزاری، حل چالش‌های فنی و بهبود کیفیت کد است. تجربهٔ کار با فناوری‌های مختلف، به او در انتخاب راهکار متناسب با هر پروژه و ساخت محصولات قابل‌اعتماد کمک می‌کند.",
      member1Skills: ['Python', 'Django', 'JavaScript', 'Node.js', 'WordPress', 'Bubble.io'],
      member2Role: 'Project Manager',
      member2Secondary: 'Frontend Developer',
      member2Roles: 'Project Manager · Frontend Developer',
      member2Bio: "بهار، مدیریت و هماهنگی پروژه‌ها و ارتباط میان تیم و کارفرما را بر عهده دارد. او با تکیه بر تجربهٔ توسعهٔ فرانت‌اند و مدیریت فرایند اجرا، نیازهای کارفرما را پیگیری می‌کند و فعالیت اعضای تیم را در مسیر اجرای پروژه هماهنگ نگه می‌دارد.",
      member2Skills: ['Project Management', 'Client Communication', 'JavaScript', 'Vue.js', 'Python', 'WordPress', 'Bubble.io'],
      member3Role: 'Frontend Developer',
      member3Secondary: 'Social Media Specialist',
      member3Roles: 'Frontend Developer · Social Media Specialist',
      member3Bio: "فاطمه، در توسعهٔ فرانت‌اند و پیاده‌سازی رابط‌های کاربری فعالیت می‌کند و بر تجربهٔ استفاده از محصولات دیجیتال تمرکز دارد. تجربهٔ او در مدیریت شبکه‌های اجتماعی و تولید محتوا نیز به شکل‌گیری حضور آنلاین منسجم‌تر و ارتباط بهتر برندها با مخاطبانشان کمک می‌کند.",
      member3Skills: ['JavaScript', 'React.js', 'Python', 'Bubble.io', 'Social Media Management', 'Content Creation'],
      member4Role: 'Team Lead',
      member4Secondary: 'Full-Stack Developer',
      member4Roles: 'Team Lead · Full-Stack Developer',
      member4Bio: "محمدرضا، هماهنگی تیم توسعه، تقسیم مسئولیت‌ها و پیگیری اجرای کارها را بر عهده دارد. در کنار راهبری تیم، با فناوری‌های مختلف در توسعهٔ نرم‌افزار فعالیت می‌کند و از مهارت‌های او می‌توان به یادگیری ماشین اشاره کرد.",
      member4Skills: ['Team Coordination', 'Task Management', 'Python', 'JavaScript', 'React.js', 'Machine Learning', 'Bubble.io'],
      project5: 'Monplus',
      project5Short: "فروش آنلاین پوشاک با فیلتر محصولات و پرداخت آنلاین",
      project5Summary: "مون‌پلاس، برندی در زمینهٔ پوشاک لینن ایتالیایی است. فروشگاه آنلاین این برند را از طراحی لوگو و انتخاب رنگ و تایپوگرافی تا ساخت صفحات و راه‌اندازی پرداخت آنلاین، هماهنگ با هویت و فضای برند طراحی و اجرا کردیم.",
      project5Features: ["طراحی اختصاصی فروشگاه و لوگوی برند", "رنگ‌بندی و تایپوگرافی متناسب با پوشاک لینن ایتالیایی", "جست‌وجو و فیلتر محصولات بر اساس سایز، رنگ و قیمت", "صفحهٔ محصول با امکان انتخاب رنگ و مشخصات", "حساب کاربری، فهرست علاقه‌مندی‌ها و سبد خرید", "امکان استفاده از کد تخفیف و پرداخت آنلاین"],
      project5Note: 'فناوری: WordPress',
      svcSub1Title: 'WordPress',
      svcSub1Text: "طراحی سایت‌های شرکتی و فروشگاهی با امکان مدیریت محتوا و امکانات متناسب با نیاز کسب‌وکار.",
      svcSub2Title: 'کدنویسی اختصاصی',
      svcSub2Text: "توسعهٔ فرانت‌اند و بک‌اند اختصاصی برای پنل‌های مدیریت، سامانه‌های سفارش و اتصال فرایندهای کسب‌وکار.",
      svcSub3Title: 'Bubble.io',
      svcSub3Text: "ساخت وب‌اپلیکیشن و پیاده‌سازی فرایندهای کسب‌وکار با پلتفرم کم‌کد Bubble، در پروژه‌هایی که این انتخاب با نیازهای فنی آن‌ها سازگار است.",
      service4: 'مدیریت محتوا (CMS)',
      service4Text: "صفحات، نوشته‌ها و محصولات سایت را از یک پنل مدیریت کنید؛ به‌روزرسانی محتوای روزمره، بدون نیاز به ویرایش کد.",
      service5: 'پشتیبانی و مدیریت سایت',
      service5Text: "از به‌روزرسانی و پشتیبان‌گیری تا رفع خطا و تغییر امکانات، پشتیبانی سایت را متناسب با نیاز و شرایط هر پروژه پیش می‌بریم.",
      service6: 'تحلیل داده',
      service6Text: "داده‌های پراکندهٔ فروش و فعالیت‌های کسب‌وکار را به گزارش‌ها و داشبوردهای روشن تبدیل می‌کنیم تا روندها و فرصت‌های بهبود را دقیق‌تر ببینید.",
      service7: 'یادگیری ماشین',
      service7Text: "پس از ارزیابی کیفیت داده‌ها و امکان‌سنجی، در مسئله‌های مناسب از یادگیری ماشین برای دسته‌بندی، پیش‌بینی و شناسایی الگوها استفاده می‌کنیم."
    },
    ar: {
      pageTitle: 'تصميم المواقع وتطوير البرمجيات | روت سكواد', navLabel: 'أقسام الصفحة', languageLabel: 'اختيار اللغة', close: 'إغلاق',
      brandTag: 'الويب · التصميم · التطوير', navHome: 'الرئيسية', navWork: 'أعمالنا', navTeam: 'فريقنا', navContact: 'تواصل', marquee: "GROW FROM THE ROOT", heroIndex: '00 / التعريف بروت سكواد', systemOnline: 'النظام متصل', webSystems: 'أنظمة الويب', creativeEngineering: 'هندسة إبداعية', capDesign: 'تصميم الويب', capDevelopment: 'التطوير', capEngineering: 'هندسة الحاسوب', footerServices: 'ووردبريس · برمجة مخصصة · Bubble',
      heroKicker: 'مواقع إلكترونية وبرمجيات مخصصة وحلول بيانات', heroH1: 'تصميم المواقع وتطوير البرمجيات المخصصة', heroStatement: "من فهم احتياجات عملك إلى بناء حلول رقمية عملية.", heroLead: "روت سكواد فريق من أربعة مهندسي حاسوب بتخصصات متكاملة. نصمم ونطور المواقع والمتاجر الإلكترونية والبرمجيات المخصصة لمساعدتك على عرض خدماتك وإدارة الطلبات وتبسيط العمليات اليومية في عملك.", ctaStart: "لنتحدث عن مشروعك", ctaWork: "اطّلع على أعمالنا", scrollExplore: 'مرّر للاستكشاف', mindsRoot: 'عقول / جذر واحد',
      workEyebrow: '02 / أعمالنا', workTitle: "نماذج أعمال تصميم المواقع وحلول نفّذناها", workLead: "من إدارة الطلبات والأعضاء إلى حجز المواعيد والبيع عبر الإنترنت؛ تعرّف على احتياجات كل مشروع والحلول والميزات التي نفّذناها.", viewDetails: "تفاصيل المشروع",
      project1: 'Sanaa Online Shop', project2: 'Delyar NGO', project3: 'Jenna Brides', project4: 'Hafezi Architects', project6: 'Manamehr',
      navServices: 'خدماتنا', servicesEyebrow: '01 / خدماتنا', servicesTitle: 'خدمات تصميم المواقع والبرمجيات لعملك', servicesLead: "من بناء حضور احترافي على الويب إلى تنظيم البيانات والعمليات، نختار الحل وفق احتياجات المشروع الفعلية وبما يتناسب مع أهدافك وميزانيتك.", service1: 'تصميم المواقع', service1Text: "سواء احتجت إلى موقع لشركتك أو متجر إلكتروني أو لوحة إدارة مخصصة، نصمم البنية والميزات بما يلائم عملاءك وآلية البيع في نشاطك.", service2: 'تصميم UX/UI', service2Text: "نصمم رحلة المستخدم وبنية الصفحات وتفاصيل الواجهة لتكون خدماتك سهلة الوصول ومنتجاتك واضحة الاستخدام.", service3: 'تطبيقات الجوال', service3Text: "للخدمات التي تحتاج إلى تجربة على الهاتف، نصمم ونطور تطبيقات بمسارات استخدام واضحة وتكامل مع أنظمة عملك.",
      teamEyebrow: '03 / فريقنا', teamTitle: "فريق روت سكواد: المهندسون خلف مشروعك", teamLead: "أربعة مهندسي حاسوب بتخصصات متكاملة في التطوير وتصميم الواجهات وتنسيق المشاريع. تعرّف على أعضاء الفريق ودور كل منهم في تنفيذ المشاريع.", viewProfile: "تعرّف على العضو",
      member1: 'أمير محمد حسيني نژاد ', member2: 'بهار همتي', member3: 'فاطمة كاظمي مقدم', member4: 'محمدرضا نادري',
      contactEyebrow: '04 / تواصل معنا', contactTitle: "لنتحدث عن احتياجات مشروعك", contactLead: "أخبرنا عن طبيعة عملك والمشكلة التي تريد حلها والميزات التي تفكر فيها، لنبحث معاً عن المسار المناسب لتنفيذ مشروعك.", formName: 'الاسم', formEmail: 'البريد الإلكتروني', formProject: 'عن المشروع', formNamePlaceholder: "اسمك الكامل", formEmailPlaceholder: 'name@example.com', formProjectPlaceholder: "اكتب لنا عن نشاطك واحتياجات مشروعك الأساسية والميزات المطلوبة والجدول الزمني المتوقع.", formSubmit: "إرسال الرسالة", formStatus: '',
      modalFeaturesTitle: "الميزات وتفاصيل التنفيذ", modalReviewTitle: 'رأي العميل', modalProjectLabel: 'مشروع', modalTeamLabel: 'عضو الفريق',
      contactPhoneLabel: 'الهاتف',
      contactEmailLabel: 'البريد الإلكتروني',
      contactTelegramLabel: 'تيليجرام',
      contactInstagramLabel: 'إنستغرام',
      formInvalid: "يُرجى مراجعة الاسم والبريد الإلكتروني ووصف المشروع. يجب أن يتراوح الوصف بين 12 و5000 حرف.",
      formRateLimited: "تجاوزت عدد محاولات الإرسال المسموح. يُرجى المحاولة مجدداً بعد بضع دقائق.",
      formSessionExpired: "تعذّر التحقق من صلاحية الإرسال. يُرجى المحاولة مرة أخرى أو تحديث الصفحة.",
      formTooLarge: "حجم الرسالة أكبر من المسموح. يُرجى اختصار وصف المشروع.",
      formTimeout: "تأخر الرد ولم يتضح ما إذا أُرسلت الرسالة. انتظر قليلاً قبل إعادة الإرسال، أو تواصل معنا بالبريد الإلكتروني أو الهاتف.",
      formSending: 'جارٍ الإرسال…',
      formSuccess: "أُرسلت رسالتك. سنتواصل معك قريباً لمتابعة الحديث عن مشروعك.",
      formError: "تعذّر إرسال رسالتك. يُرجى المحاولة مرة أخرى أو التواصل معنا عبر البريد الإلكتروني أو الهاتف.",
      project1Short: "إدارة الطلبات وإشعارات تلقائية للعملاء",
      project1Summary: "تعمل ثنا على توفير منتجات من علامات تجارية أجنبية موثوقة. صممنا ونفّذنا لها نظام إدارة الطلبات ولوحة الإدارة وأتمتة العمليات. يركز الموقع على إدارة الطلبات ولا يتضمن متجراً إلكترونياً.",
      project1Features: ["لوحة مخصصة لكل عميل", "متابعة حالة الطلبات", "فواتير مخصصة للعملاء ومدير النظام", "تقارير شهرية وسنوية عن الأرباح والأصناف والمستخدمين الجدد", "إرسال الفواتير وإشعارات حالة الطلب عبر بوت تيليجرام", "إدارة موحدة للطلبات والفواتير والمستخدمين"],
      project1Note: 'التقنية: Django · HTML / SCSS / JavaScript (برمجة مخصصة)',
      project2Short: "إدارة الأعضاء والوصول إلى المعلومات الأساسية عبر رمز QR",
      project2Summary: "دليار جمعية لدعم المصابين بالسكري. إلى جانب التعريف بالجمعية وأنشطتها، نفّذنا نظاماً مخصصاً لإدارة الأعضاء. يتيح رمز QR الخاص بكل عضو التعرف عليه والاطلاع على نوع السكري لديه بسرعة في الحالات الطارئة.",
      project2Features: ["التعريف بالجمعية وأنشطتها وخدماتها", "تسجيل الأعضاء وإنشاء ملفات شخصية مخصصة", "رمز QR خاص بكل عضو", "عرض نوع السكري عند مسح الرمز", "لوحة إدارة بيانات الأعضاء", "إمكانية تصدير قائمة الأعضاء"],
      project2Note: 'التقنية: WordPress',
      project3Short: "عرض خدمات الصالون وحجز المواعيد عبر الإنترنت",
      project3Summary: "صممنا لصالون جنا موقعاً ينسجم مع هوية العلامة التجارية، ويعرض خدمات الصالون وتفاصيلها بوضوح، مع إتاحة حجز المواعيد عبر الإنترنت.",
      project3Features: ["تصميم منسجم مع هوية العلامة التجارية", "بنية صفحات تناسب احتياجات الصالون", "عرض خدمات الصالون", "تقديم تفاصيل كل خدمة", "إمكانية حجز المواعيد عبر الإنترنت", "تصميم متجاوب مع أحجام الشاشات المختلفة"],
      project3Note: 'التقنية: WordPress',
      project4Short: "عرض المشاريع المعمارية في صفحات مخصصة",
      project4Summary: "صممنا لمكتب حافظي للهندسة المعمارية موقعاً يركز على تقديم مشاريعه وخدماته باحترافية. ولكل مشروع صفحة مخصصة تمنح أعمال المكتب بنية واضحة ومنظمة للعرض.",
      project4Features: ["تصميم يناسب هوية العلامة ومجال الهندسة المعمارية", "بنية صفحات تركز على عرض المشاريع", "عرض المشاريع المنفّذة", "التعريف بخدمات المكتب", "صفحة مخصصة لكل مشروع", "تصميم متجاوب مع أحجام الشاشات المختلفة"],
      project4Note: 'التقنية: WordPress',
      project6Short: "متجر إلكتروني مع إدارة الطلبات والعملاء والمخزون",
      project6Summary: "بنينا لمانامهر، وهي شركة في مجال كيماويات البناء، موقعاً ومتجراً إلكترونياً ديناميكياً بلوحة إدارة مخصصة. يجمع النظام بين التعريف بالشركة ومنتجاتها وإدارة الطلبات والعملاء والمخزون.",
      project6Features: ["تصميم مخصص ينسجم مع هوية العلامة", "التعريف بالشركة والمنتجات والمشاريع", "إدارة ديناميكية للمتجر والمشاريع", "إمكانية التثبيت كتطبيق ويب", "لوحة مخصصة لإدارة العملاء والمنتجات والطلبات والمخزون", "خصومات عامة وخاصة مع تقارير المبيعات والأرباح"],
      project6Note: "التقنية: Bubble.io · الحالة: أوقفت الشركة تشغيل الموقع، وهو غير نشط حالياً.",
      modalSkillsTitle: 'المهارات',
      member1Role: 'Technical Lead',
      member1Secondary: 'Backend Developer',
      member1Roles: 'Technical Lead · Backend Developer',
      member1Bio: "يتولى أمير محمد القيادة التقنية للمشاريع وتطوير الأنظمة الخلفية. يركز عمله على تصميم الحلول البرمجية وتنفيذها وحل التحديات التقنية وتحسين جودة الشيفرة. وتساعده خبرته في تقنيات متنوعة على اختيار الحل الملائم لكل مشروع وبناء منتجات موثوقة.",
      member1Skills: ['Python', 'Django', 'JavaScript', 'Node.js', 'WordPress', 'Bubble.io'],
      member2Role: 'Project Manager',
      member2Secondary: 'Frontend Developer',
      member2Roles: 'Project Manager · Frontend Developer',
      member2Bio: "تتولى بهار إدارة المشاريع وتنسيق تنفيذها والتواصل بين الفريق والعميل. وبالاستناد إلى خبرتها في تطوير الواجهات الأمامية وإدارة التنفيذ، تتابع احتياجات العميل وتحافظ على تنسيق العمل بين أعضاء الفريق طوال المشروع.",
      member2Skills: ['Project Management', 'Client Communication', 'JavaScript', 'Vue.js', 'Python', 'WordPress', 'Bubble.io'],
      member3Role: 'Frontend Developer',
      member3Secondary: 'Social Media Specialist',
      member3Roles: 'Frontend Developer · Social Media Specialist',
      member3Bio: "تعمل فاطمة على تطوير الواجهات الأمامية، مع التركيز على تجربة استخدام المنتجات الرقمية. كما تساعدها خبرتها في إدارة شبكات التواصل الاجتماعي وإنتاج المحتوى على دعم حضور أكثر اتساقاً للعلامات التجارية وتواصل أفضل مع جمهورها.",
      member3Skills: ['JavaScript', 'React.js', 'Python', 'Bubble.io', 'Social Media Management', 'Content Creation'],
      member4Role: 'Team Lead',
      member4Secondary: 'Full-Stack Developer',
      member4Roles: 'Team Lead · Full-Stack Developer',
      member4Bio: "يتولى محمدرضا تنسيق فريق التطوير وتوزيع المسؤوليات ومتابعة تقدم العمل. وإلى جانب قيادة الفريق، يطوّر البرمجيات باستخدام تقنيات متنوعة، وتشمل مهاراته تعلّم الآلة.",
      member4Skills: ['Team Coordination', 'Task Management', 'Python', 'JavaScript', 'React.js', 'Machine Learning', 'Bubble.io'],
      project5: 'Monplus',
      project5Short: "متجر ملابس إلكتروني مع تصفية المنتجات والدفع عبر الإنترنت",
      project5Summary: "مون بلس علامة تجارية لملابس الكتان الإيطالي. صممنا ونفّذنا متجرها الإلكتروني بما ينسجم مع هوية العلامة، من الشعار والألوان والخطوط إلى تصميم الصفحات وإتاحة الدفع عبر الإنترنت.",
      project5Features: ["تصميم مخصص للمتجر وشعار العلامة", "ألوان وخطوط تناسب ملابس الكتان الإيطالي", "بحث وتصفية المنتجات حسب المقاس واللون والسعر", "صفحات منتجات مع اختيار اللون والمواصفات", "حساب مستخدم وقائمة مفضلة وسلة تسوق", "رموز خصم ودفع عبر الإنترنت"],
      project5Note: 'التقنية: WordPress',
      svcSub1Title: 'WordPress',
      svcSub1Text: "مواقع شركات ومتاجر إلكترونية بإدارة محتوى وميزات تتناسب مع احتياجات عملك.",
      svcSub2Title: 'برمجة مخصصة',
      svcSub2Text: "تطوير واجهات أمامية وخلفية مخصصة للوحات الإدارة وأنظمة الطلبات وربط عمليات العمل.",
      svcSub3Title: 'Bubble.io',
      svcSub3Text: "بناء تطبيقات الويب وتنفيذ عمليات العمل باستخدام منصة Bubble منخفضة البرمجة، عندما تتناسب مع المتطلبات التقنية للمشروع.",
      service4: 'إدارة المحتوى (CMS)',
      service4Text: "أدِر الصفحات والمقالات والمنتجات من لوحة واحدة، دون الحاجة إلى تعديل الشيفرة لإجراء تحديثات المحتوى اليومية.",
      service5: 'دعم وإدارة الموقع',
      service5Text: "من التحديثات والنسخ الاحتياطي إلى معالجة الأخطاء وتعديل الميزات، نقدم دعماً للموقع يتناسب مع احتياجات كل مشروع.",
      service6: 'تحليل البيانات',
      service6Text: "نحوّل بيانات المبيعات والعمليات المتفرقة إلى تقارير ولوحات معلومات واضحة تساعدك على فهم الاتجاهات وتحديد فرص التحسين.",
      service7: 'تعلّم الآلة',
      service7Text: "بعد تقييم جودة البيانات والجدوى، نستخدم تعلّم الآلة في المسائل المناسبة للتصنيف والتنبؤ واكتشاف الأنماط."
    },
    en: {
      pageTitle: 'Custom Websites & Software Development | Root Squad', navLabel: 'Page sections', languageLabel: 'Choose language', close: 'Close',
      brandTag: 'WEB · DESIGN · DEV', navHome: 'Home', navWork: 'Our Work', navTeam: 'Our Team', navContact: 'Contact', marquee: "GROW FROM THE ROOT", heroIndex: '00 / INTRODUCING ROOT SQUAD', systemOnline: 'System online', webSystems: 'Web systems', creativeEngineering: 'Creative engineering', capDesign: 'WEB DESIGN', capDevelopment: 'DEVELOPMENT', capEngineering: 'COMPUTER ENGINEERING', footerServices: 'WORDPRESS · CUSTOM CODE · BUBBLE',
      heroKicker: 'Websites, custom software and data solutions', heroH1: 'Custom website & software development', heroStatement: "From understanding your business needs to building practical digital solutions.", heroLead: "Root Squad brings together four computer engineers with complementary skills. We design and develop websites, online stores and custom software to help you present your services, manage orders and simplify day-to-day business processes.", ctaStart: "Discuss Your Project", ctaWork: "View Our Work", scrollExplore: 'Scroll to explore', mindsRoot: 'Minds / one root',
      workEyebrow: '02 / Our Work', workTitle: "Website projects: real challenges, working solutions", workLead: "From order and member management to appointment booking and online sales, explore the needs behind each project and the features we built to address them.", viewDetails: 'View details',
      project1: 'Sanaa Online Shop', project2: 'Delyar NGO', project3: 'Jenna Brides', project4: 'Hafezi Architects', project6: 'Manamehr',
      navServices: 'Services', servicesEyebrow: '01 / Services', servicesTitle: 'Web design & software services for your business', servicesLead: "From establishing a professional web presence to organising workflows and data, we choose an approach that suits your project’s needs, goals and budget.", service1: 'Website Design', service1Text: "Whether you need a company website, an online store or a custom dashboard, we design the structure and features around your customers and sales process.", service2: 'UX / UI Design', service2Text: "We design user journeys, page structures and interface details that make your services easy to find and your product straightforward to use.", service3: 'Mobile Apps', service3Text: "For services that need a mobile experience, we design and develop apps with clear user journeys and integration with your business systems.",
      teamEyebrow: '03 / Our Team', teamTitle: 'Root Squad team: the engineers behind your project', teamLead: "Four computer engineers with complementary skills in development, interface design and project coordination. Meet the people behind our projects and explore their roles.", viewProfile: 'View profile',
      member1: 'Amirmohammad Hosseininejad', member2: 'Bahar Hemati', member3: 'Fatemeh Kazemi Moghaddam', member4: 'Mohammadreza Naderi',
      contactEyebrow: '04 / Contact Us', contactTitle: "Let’s discuss what your project needs", contactLead: "Tell us about your business, the problem you want to solve and the features you have in mind. Together, we can explore a suitable approach to your project.", formName: 'Name', formEmail: 'Email', formProject: 'About the project', formNamePlaceholder: "Your full name", formEmailPlaceholder: 'name@example.com', formProjectPlaceholder: "Tell us about your business, your project’s main needs, the features you have in mind and your expected timeline.", formSubmit: "Send Message", formStatus: '',
      modalFeaturesTitle: "Features & implementation", modalReviewTitle: 'Client feedback', modalProjectLabel: 'Project', modalTeamLabel: 'Team member',
      contactPhoneLabel: 'Phone',
      contactEmailLabel: 'Email',
      contactTelegramLabel: 'Telegram',
      contactInstagramLabel: 'Instagram',
      formInvalid: "Please check your name, email and project description. The description must contain 12–5000 characters.",
      formRateLimited: "Too many submission attempts. Please try again in a few minutes.",
      formSessionExpired: "We could not verify the submission. Please try again or refresh the page.",
      formTooLarge: "Your message is too large. Please shorten the project description.",
      formTimeout: "The response took too long, so delivery could not be confirmed. Please wait before sending again, or contact us by email or phone.",
      formSending: 'Sending…',
      formSuccess: "Your message has been sent. We’ll be in touch soon to continue the conversation.",
      formError: "Your message could not be sent. Please try again or contact us by email or phone.",
      project1Short: 'Order management and automated customer updates',
      project1Summary: "Sanaa sources products from reputable international brands. We designed and built its order management system, admin dashboard and automated workflows. The website focuses on managing orders and does not include an online store.",
      project1Features: ["A dedicated dashboard for each customer", "Order status tracking", "Custom invoices for customers and administrators", "Monthly and annual reports on profit, items and new users", "Invoices and order status notifications via a Telegram bot", "Centralised management of orders, invoices and users"],
      project1Note: 'Technology: Django · HTML / SCSS / JavaScript (custom code)',
      project2Short: "Member management and essential information via QR codes",
      project2Summary: "Delyar is an association supporting people with diabetes. Alongside presenting the association and its activities, we built a dedicated member management system. Each member’s QR code provides quick access to their identity and diabetes type in an emergency.",
      project2Features: ["An introduction to the association, its activities and services", "Member registration and individual profiles", "A unique QR code for each member", "Diabetes type displayed when the code is scanned", "An admin dashboard for member information", "Member list export"],
      project2Note: 'Technology: WordPress',
      project3Short: 'Salon services and online appointment booking',
      project3Summary: "For Jenna Brides beauty salon, we designed a website that reflects the brand’s identity, presents its services clearly and lets clients book appointments online.",
      project3Features: ["Design aligned with the brand identity", "Page structure suited to the salon’s needs", "An overview of salon services", "Details for each service", "Online appointment booking", "Responsive design across screen sizes"],
      project3Note: 'Technology: WordPress',
      project4Short: 'Dedicated pages for architecture projects',
      project4Summary: "For Hafezi Architects, we designed a website focused on presenting the practice’s projects and services professionally. Each project has a dedicated page, giving the portfolio a clear and organised structure.",
      project4Features: ["Design suited to the brand and architecture practice", "A page structure focused on presenting projects", "A showcase of completed projects", "An overview of the practice’s services", "A dedicated page for each project", "Responsive design across screen sizes"],
      project4Note: 'Technology: WordPress',
      project6Short: "An online store with order, customer and inventory management",
      project6Summary: "For Manamehr, a construction chemicals company, we built a dynamic website and online store with a custom admin dashboard. The system brings together company and product information with order, customer and inventory management.",
      project6Features: ["Custom design aligned with the brand identity", "Company, product and project information", "Dynamic management of the store and projects", "Installable as a web application", "A custom dashboard for customers, products, orders and inventory", "General and customer-specific discounts, with sales and profit reports"],
      project6Note: "Technology: Bubble.io · Status: the company has stopped operating the website, which is currently inactive.",
      modalSkillsTitle: 'Skills',
      member1Role: 'Technical Lead',
      member1Secondary: 'Backend Developer',
      member1Roles: 'Technical Lead · Backend Developer',
      member1Bio: "Amir leads the technical direction of projects and develops backend systems. His work spans software design and implementation, technical problem-solving and code quality. Experience with a range of technologies helps him choose an approach suited to each project and build reliable products.",
      member1Skills: ['Python', 'Django', 'JavaScript', 'Node.js', 'WordPress', 'Bubble.io'],
      member2Role: 'Project Manager',
      member2Secondary: 'Frontend Developer',
      member2Roles: 'Project Manager · Frontend Developer',
      member2Bio: "Bahar manages projects, coordinates delivery and keeps communication clear between the team and the client. Drawing on her frontend development and project management experience, she follows up on client needs and keeps the team’s work aligned throughout the project.",
      member2Skills: ['Project Management', 'Client Communication', 'JavaScript', 'Vue.js', 'Python', 'WordPress', 'Bubble.io'],
      member3Role: 'Frontend Developer',
      member3Secondary: 'Social Media Specialist',
      member3Roles: 'Frontend Developer · Social Media Specialist',
      member3Bio: "Fatemeh develops frontend interfaces with a focus on how people experience digital products. Her experience in social media management and content creation also helps brands build a more consistent online presence and connect with their audiences.",
      member3Skills: ['JavaScript', 'React.js', 'Python', 'Bubble.io', 'Social Media Management', 'Content Creation'],
      member4Role: 'Team Lead',
      member4Secondary: 'Full-Stack Developer',
      member4Roles: 'Team Lead · Full-Stack Developer',
      member4Bio: "Mohammadreza coordinates the development team, assigns responsibilities and tracks progress. Alongside leading the team, he develops software using a range of technologies, with machine learning among his skills.",
      member4Skills: ['Team Coordination', 'Task Management', 'Python', 'JavaScript', 'React.js', 'Machine Learning', 'Bubble.io'],
      project5: 'Monplus',
      project5Short: "An online clothing store with product filters and online payment",
      project5Summary: "Monplus is a clothing brand specialising in Italian linen. We designed and built its online store to reflect the brand’s identity, from the logo, colour palette and typography to the pages and online payment flow.",
      project5Features: ["Custom store design and brand logo", "Colours and typography suited to Italian linen clothing", "Product search and filters by size, colour and price", "Product pages with colour and specification selection", "Customer accounts, wishlists and a shopping cart", "Discount codes and online payment"],
      project5Note: 'Technology: WordPress',
      svcSub1Title: 'WordPress',
      svcSub1Text: "Company websites and online stores with content management and features tailored to your business needs.",
      svcSub2Title: 'Custom code',
      svcSub2Text: "Custom frontend and backend development for admin dashboards, order management systems and connected business workflows.",
      svcSub3Title: 'Bubble.io',
      svcSub3Text: "Web applications and business workflows built with the low-code Bubble platform, where it suits the project’s technical requirements.",
      service4: 'Content Management',
      service4Text: "Manage pages, articles and products from a single dashboard, without editing code for everyday content updates.",
      service5: 'Support & Management',
      service5Text: "From updates and backups to resolving issues and adapting features, we provide website support suited to the needs of each project.",
      service6: 'Data Analysis',
      service6Text: "We turn scattered sales and operational data into clear reports and dashboards, helping you understand trends and identify opportunities for improvement.",
      service7: 'Machine Learning',
      service7Text: "After assessing data quality and feasibility, we use machine learning where it fits the problem: classification, forecasting or identifying patterns."
    }
  };
  var currentLang = 'fa', currentCopy = copies.fa;

  function splitHeadings() {
    document.querySelectorAll('.panel h1:not([data-no-split]), .panel h2:not([data-no-split])').forEach(function (h) {
      var words = h.textContent.trim().split(/\s+/);
      h.textContent = '';
      words.forEach(function (w, i) {
        var s = document.createElement('span');
        s.className = 'w'; s.style.setProperty('--w', i); s.textContent = w;
        h.appendChild(s);
        if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
      });
    });
  }

  function applyLanguage(lang, persist) {
    if (!copies[lang]) lang = 'fa';
    currentLang = lang; currentCopy = copies[lang];
    window.RootSquadLanguage = lang; window.RootSquadCopy = currentCopy;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.title = currentCopy.pageTitle;
    var metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.content = ({
      fa: 'طراحی و توسعهٔ سایت‌های شرکتی و فروشگاهی، نرم‌افزار اختصاصی، رابط کاربری و تحلیل داده با تیم روت اسکواد. نمونه‌کارهای ما را ببینید و دربارهٔ نیاز پروژه‌تان گفت‌وگو کنیم.',
      en: 'Root Squad designs and develops business websites, online stores and custom software, with UX/UI design and data services. Explore our work and discuss your project.',
      ar: 'روت سكواد لتصميم وتطوير مواقع الشركات والمتاجر الإلكترونية والبرمجيات المخصصة، مع خدمات تصميم الواجهات وحلول البيانات. اطّلع على أعمالنا ولنتحدث عن مشروعك.'
    })[lang];
    document.querySelector('.hero-wordmark').setAttribute('aria-label', currentCopy.pageTitle);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var value = currentCopy[el.dataset.i18n];
      if (typeof value === 'string') el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var value = currentCopy[el.dataset.i18nPlaceholder];
      if (typeof value === 'string') el.setAttribute('placeholder', value);
    });
    document.querySelector('.rail').setAttribute('aria-label', currentCopy.navLabel);
    document.querySelector('.lang-switch').setAttribute('aria-label', currentCopy.languageLabel);
    document.querySelector('.modal-close').setAttribute('aria-label', currentCopy.close);
    document.querySelectorAll('.lang-switch button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false'); });
    splitHeadings();
    if (activeDetail) renderModal(activeDetail);
    if (persist && location.hash) requestAnimationFrame(function () { requestAnimationFrame(function () {
      var activeSection = document.querySelector(location.hash);
      if (activeSection) window.scrollTo(0, activeSection.offsetTop);
    }); });
    if (persist) try { localStorage.setItem('root-squad-language', lang); } catch (err) {}
    window.dispatchEvent(new CustomEvent('rootsquad:language', { detail: { language: lang, copy: currentCopy } }));
  }

  var savedLanguage = 'fa';
  try { savedLanguage = localStorage.getItem('root-squad-language') || 'fa'; } catch (err) {}
  document.querySelectorAll('.lang-switch button').forEach(function (button) { button.addEventListener('click', function () { applyLanguage(button.dataset.lang, true); }); });
  applyLanguage(savedLanguage, false);
  // stagger index for every block inside a panel
  stages.forEach(function (st) {
    Array.prototype.forEach.call(st.querySelectorAll('.panel > *'), function (el, i) { el.style.setProperty('--i', i); });
    Array.prototype.forEach.call(st.querySelectorAll('.project-list li, .team-list li'), function (el, i) { el.style.setProperty('--j', i); });
  });

  // the section nearest the middle of the screen gets .on and plays its entrance
  var cur = -1;
  function pick() {
    var mid = window.innerHeight / 2, best = 0, bd = 1e9;
    stages.forEach(function (st, i) {
      var r = st.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bd) { bd = d; best = i; }
    });
    if (window.innerWidth <= 760) {
      // phones: sections are taller than the screen, so each one plays its entrance once, when it first comes into view
      var vh = window.innerHeight;
      stages.forEach(function (st) {
        if (st.classList.contains('on')) return;
        var r = st.getBoundingClientRect();
        if (r.top < vh * 0.7 && r.bottom > vh * 0.1) st.classList.add('on');
      });
      return;
    }
    if (best !== cur) {
      cur = best;
      stages.forEach(function (st, i) { st.classList.toggle('on', i === best); });
    }
  }
  window.addEventListener('scroll', pick, { passive: true });
  window.addEventListener('resize', pick);
  pick();

  // Deterministic in-page navigation; native smooth scrolling can bounce in embedded browsers.
  var navFrame = 0;
  function scrollToSection(target) {
    if (navFrame) cancelAnimationFrame(navFrame);
    var from = window.scrollY;
    var to = target.offsetTop;
    var started = performance.now();
    var duration = reduce ? 0 : 760;
    function tick(now) {
      var progress = duration ? Math.min(1, (now - started) / duration) : 1;
      var eased = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, from + (to - from) * eased);
      if (progress < 1) navFrame = requestAnimationFrame(tick);
      else navFrame = 0;
    }
    navFrame = requestAnimationFrame(tick);
  }
  // hamburger menu (phones)
  var menuBtn = document.querySelector('.menu-toggle');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function (e) { e.stopPropagation(); setMenu(!document.body.classList.contains('menu-open')); });
    document.addEventListener('click', function (e) {
      if (document.body.classList.contains('menu-open') && !(e.target.closest && e.target.closest('.rail, .menu-toggle'))) setMenu(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 760) setMenu(false); });
  }
  document.querySelectorAll('.rail a, .hero-cta').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      scrollToSection(target);
      try { history.replaceState(null, '', id); } catch (err) {}
    });
  });

  // Project and team detail panels share one accessible modal shell.
  var modal = document.getElementById('detailModal');
  var modalCard = modal.querySelector('.modal-card');
  var modalTitle = document.getElementById('modalTitle');
  var modalKicker = document.getElementById('modalKicker');
  var modalSummary = document.getElementById('modalSummary');
  var modalFeaturesTitle = document.getElementById('modalFeaturesTitle');
  var modalFeatures = document.getElementById('modalFeatures');
  var modalNote = document.getElementById('modalNote');
  var modalRole = document.getElementById('modalRole');
  var modalLink = document.getElementById('modalLink');
  var modalReview = document.getElementById('modalReview');
  var modalReviewTitle = document.getElementById('modalReviewTitle');
  var modalReviewText = document.getElementById('modalReviewText');
  var modalReviewBy = document.getElementById('modalReviewBy');
  var activeDetail = null, lastDetailTrigger = null, closeTimer = 0;

  function renderModal(detail) {
    if (!detail) return;
    var number = String(detail.index + 1).padStart(2, '0');
    var isProject = detail.type === 'project';
    modalKicker.textContent = (isProject ? currentCopy.modalProjectLabel : currentCopy.modalTeamLabel) + ' / ' + number;
    var n = detail.index + 1;
    modalTitle.textContent = currentCopy[(isProject ? 'project' : 'member') + n];
    modalSummary.textContent = currentCopy[(isProject ? 'project' : 'member') + n + (isProject ? 'Summary' : 'Bio')];
    modalRole.textContent = isProject ? '' : currentCopy['member' + n + 'Roles'];
    modalRole.hidden = isProject;
    modalFeaturesTitle.textContent = isProject ? currentCopy.modalFeaturesTitle : currentCopy.modalSkillsTitle;
    modalFeatures.classList.toggle('skills', !isProject);
    modalNote.textContent = isProject ? currentCopy['project' + n + 'Note'] : '';
    modalNote.hidden = !isProject;
    modalFeatures.textContent = '';
    currentCopy[(isProject ? 'project' : 'member') + n + (isProject ? 'Features' : 'Skills')].forEach(function (feature) {
      var li = document.createElement('li'); li.textContent = feature; modalFeatures.appendChild(li);
    });
    // optional external link (project site / member profile), set in src/data/siteConfig.js
    var entry = (isProject ? siteConfig.projects : siteConfig.team)[detail.index] || {};
    var link = entry.url || entry.link || '';
    // client review (projects only): shown only when siteConfig.projects[i].review.text is filled in
    var rv = isProject ? entry.review : null;
    var rvPick = function (v) { return v && typeof v === 'object' ? (v[currentLang] || v.fa || '') : (v || ''); };
    var rvText = rv ? rvPick(rv.text) : '';
    modalReview.hidden = !rvText;
    if (rvText) {
      modalReviewTitle.textContent = currentCopy.modalReviewTitle;
      modalReviewText.textContent = rvText;
      var by = [rvPick(rv.name), rvPick(rv.role)].filter(Boolean).join(' — ');
      modalReviewBy.textContent = by; modalReviewBy.hidden = !by;
    }
    if (link) {
      modalLink.href = /^https?:\/\//.test(link) ? link : 'https://' + link;
      modalLink.textContent = link.replace(/^https?:\/\//, '') + ' ↗';
      modalLink.hidden = false;
    } else {
      modalLink.hidden = true; modalLink.removeAttribute('href');
    }
  }

  function openModal(type, index, trigger) {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = 0; }
    activeDetail = { type: type, index: index }; lastDetailTrigger = trigger;
    renderModal(activeDetail);
    modal.hidden = false; document.body.classList.add('modal-open');
    requestAnimationFrame(function () { modal.classList.add('open'); modalCard.focus(); });
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.classList.remove('open'); document.body.classList.remove('modal-open');
    activeDetail = null;
    var finish = function () { modal.hidden = true; closeTimer = 0; if (lastDetailTrigger) lastDetailTrigger.focus(); };
    if (reduce) finish(); else closeTimer = setTimeout(finish, 260);
  }

  document.querySelectorAll('#projectList button').forEach(function (button) { button.addEventListener('click', function () { openModal('project', +button.dataset.h, button); }); });
  document.querySelectorAll('#teamList button').forEach(function (button) { button.addEventListener('click', function () { openModal('team', +button.dataset.h, button); }); });
  document.querySelectorAll('[data-modal-close]').forEach(function (button) { button.addEventListener('click', closeModal); });
  modal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') { e.preventDefault(); modal.querySelector('.modal-close').focus(); }
  });

  bindContactForm(document.getElementById('contactForm'), document.getElementById('formStatus'), function () { return currentCopy; }, {
    endpoint: siteConfig.formEndpoint,
    csrfEndpoint: siteConfig.csrfEndpoint,
  });

  // cursor ring and panel tilt (mouse devices only)
  if (reduce || !window.matchMedia('(hover: hover)').matches) return;
  var cursor = document.getElementById('cur'), mainEl = document.querySelector('main');
  var mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, tx = 0, ty = 0, ox = 0, oy = 0, big = false;
  window.addEventListener('pointermove', function (e) {
    mx = e.clientX; my = e.clientY; cursor.style.opacity = 1;
    tx = (mx / innerWidth - 0.5) * 2; ty = (my / innerHeight - 0.5) * 2;
    var t = e.target.closest && e.target.closest('button, a');
    if (!!t !== big) { big = !!t; cursor.classList.toggle('big', big); }
  }, { passive: true });
  document.addEventListener('pointerleave', function () { cursor.style.opacity = 0; });
  (function frame() {
    cx += (mx - cx) * 0.16; cy += (my - cy) * 0.16;
    ox += (tx - ox) * 0.06; oy += (ty - oy) * 0.06;
    cursor.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
    mainEl.style.setProperty('--mx', ox.toFixed(3)); mainEl.style.setProperty('--my', oy.toFixed(3));
    requestAnimationFrame(frame);
  })();
}
