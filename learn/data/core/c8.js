window.LEVELS = window.LEVELS || {};
window.LEVELS["core/c8"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "الإنترفيو بيمشي على مراحل، وكل مرحلة بتقيس حاجة مختلفة",
      en: "How these interviews usually run",
      body: "<p>الترتيب بيختلف من شركة لشركة، لكن غالبا هتقابل أغلب المراحل دي. لو عرفت كل مرحلة بتدور على إيه، بتحضّر للمطلوب بدل ما تذاكر كل حاجة بنفس الدرجة.</p>",
      points: [
        "<b>1. مكالمة الـ screening (HR أو recruiter)</b>: 15 إلى 30 دقيقة. بتقيس: بتتكلم كويس؟ إنجليزيتك مفهومة؟ إيه خبرتك باختصار؟ متاح إمتى؟ توقعك للمرتب؟ هنا بتدخل التعريف بنفسك.",
        "<b>2. أسئلة تقنية</b>: أساسيات اللغة والإطار (Dart/Flutter أو PHP/Laravel)، Git وSQL وHTTP، OOP. شفوي غالبا. بتقيس هل فاهم ولا حافظ.",
        "<b>3. live coding أو take-home task</b>: الـ live بتحل مشكلة صغيرة وهم بيشوفوا طريقة تفكيرك. الـ take-home مهمة تعملها في البيت (ساعات أو يومين) وبتتناقش بعدين: جودة الكود، الـ README، الاختبارات، وهل بتفهم اللي كتبته.",
        "<b>4. مناقشة المشاريع والتصميم</b>: «احكيلي عن مشروع عملته»، «لو الحمل زاد هتعمل إيه؟». بتقيس العمق الحقيقي والصدق.",
        "<b>5. HR أو مقابلة مع المدير</b>: ثقافة الشغل، أسئلة سلوكية (behavioural)، المرتب، العقد، ظروف الـ remote (التوقيت، العملة).",
      ],
      focus: [{ label: "احفظها", text: "في كل مرحلة اسأل نفسك: هم عايزين يعرفوا إيه؟ المرحلة الأولى: هل أنا مفهوم ومناسب؟ التقنية: هل فاهم؟ المشاريع: هل أنت صادق وعندك عمق؟ HR: هل هتتعامل معانا بسهولة؟" }],
      pitfall: "تذاكر تقنيات بس وتروح لأول مكالمة من غير تعريف جاهز. أول 90 ثانية بتحدد نبرة المقابلة كلها، وهي أسهل حاجة تجهزها.",
    },
    {
      title: "التعريف بنفسك في 60 إلى 90 ثانية",
      en: "Tell me about yourself",
      body: "<p>أول سؤال في تقريبا كل مقابلة: «Tell me about yourself». مش عايزين سيرتك الذاتية من أول يوم. عايزين <b>3 حاجات</b> في دقيقة: <b>إنت مين دلوقتي</b> (الحاضر)، <b>إيه أقوى حاجة عملتها</b> (الدليل)، و<b>ليه الوظيفة دي</b> (المستقبل). اكتبه مرة، اتمرن عليه بصوت عالي لحد ما يطلع طبيعي مش محفوظ.</p>",
      codes: [
        {
          lang: "text",
          title: "قالب بالعربي (املا الفراغات)",
          src: `أنا [اسمك]، طالب في السنة الرابعة علوم حاسب في [الجامعة]،
وبشتغل freelance developer. تخصصي تطبيقات الموبايل بـ Flutter
والـ backend بـ Laravel.

أهم مشروع عملته منصة عقارات لعميل في السعودية: تطبيق Flutter
منشور على App Store وGoogle Play، وAPI بـ Laravel، ولوحة تحكم
بـ Inertia وVue. [جملة عن دورك بالظبط، وعن رقم حقيقي لو عندك،
مثل عدد المستخدمين: [عدد المستخدمين]].

اشتغلت كمان على موقع Odoo مع أتمتة CRM لمصنع في السعودية.

أكتر حاجة بحبها [مثال: أحول متطلب مش واضح لفيتشر شغال].
وبدور على وظيفة [junior/mid] [Flutter/Laravel] أتعلم فيها
[حاجة محددة]، والوظيفة دي مناسبة لأن [سبب من إعلان الوظيفة].`,
        },
        {
          lang: "text",
          title: "English version (fill in the brackets)",
          src: `Hi, I'm [Name]. I'm a fourth-year computer science student at
[University] and a freelance developer. I mostly build mobile apps
with Flutter and backends with Laravel.

My main project is a real-estate platform for a client in Saudi
Arabia: a Flutter app published on the App Store and Google Play,
a Laravel API, and an admin panel built with Inertia and Vue.
[One sentence about your own part, and a real number if you have one.]

I also built an Odoo website with CRM automation for a factory in
Saudi Arabia.

What I enjoy most is [for example: turning an unclear requirement
into a working feature]. I'm looking for a [junior/mid] [Flutter/
Laravel] role where I can [learn / grow in something specific],
and this one fits because [a reason from the job post].`,
          note: "حوالي 80 ثانية بصوت طبيعي. ماتحفظش الكلمات، احفظ الترتيب: مين أنا، دليل، ليه هنا.",
        },
      ],
      pitfall: "الرقم أو الاسم اللي ملوش أصل. لو مفيش عندك عدد مستخدمين تعرفه فعلا، شيل الجملة. محدش هيحاسبك على رقم مش موجود، لكن هيحاسبك لو قلت رقم ومعرفتش تشرحه.",
      interview: [
        { q: "Tell me about yourself.", a: "بلتزم بالترتيب: (1) مين أنا الآن: طالب سنة رابعة وfreelance developer بـ Flutter وLaravel. (2) أقوى دليل: منصة العقارات اللي على المتجرين مع الـ API ولوحة التحكم، وبقول دوري بوضوح. (3) ليه هنا: ربط الوظيفة بحاجة محددة في الإعلان. في حدود 60 إلى 90 ثانية، ومن غير ما أحكي تاريخ حياتي أو أعدد كل تقنية سمعت عنها." },
      ],
    },
    {
      title: "STAR: إزاي تحكي قصة سلوكية بحيث تتفهم",
      en: "The STAR method",
      body: "<p>الأسئلة السلوكية («احكيلي عن موقف...») بتدور على دليل من حياتك مش رأي نظري. الـ <b>STAR</b> هيكل بسيط يمنعك من الحكي المتشعب:</p>",
      terms: [
        ["Situation", "الموقف", "السياق في جملتين: إيه المشروع، إيه المشكلة. من غير تفاصيل زيادة."],
        ["Task", "المهمة", "إيه المطلوب منك <b>إنت</b> بالذات."],
        ["Action", "اللي عملته", "الجزء الأكبر (حوالي 60%): الخطوات اللي <b>إنت</b> عملتها، بـ «أنا» مش «إحنا»، ومعاها ليه اخترت كده."],
        ["Result", "النتيجة", "إيه اللي حصل، مقاس لو تقدر، وإيه اللي اتعلمته."],
      ],
      points: [
        "حضّر 4 إلى 5 قصص حقيقية مرة واحدة: تحدي تقني، خطأ عملته، خلاف أو اختلاف في الرأي، شغل تحت ضغط وقت، حاجة اتعلمتها بسرعة. القصة الواحدة تنفع لأكتر من سؤال.",
        "التحضير بالكتابة: كل قصة 5 أسطر. وبعدين احكيها بصوت عالي بدقيقتين.",
        "الصدق أهم من الإبهار. قصة صغيرة حقيقية بتفاصيلها أحسن من قصة كبيرة مبهمة، لأن المحاور بيسأل «ليه؟» و«وبعدين؟».",
      ],
    },
    {
      title: "مثالين لقصة STAR مبنيين على شغلك",
      en: "Two worked STAR stories",
      body: "<p>الحقائق الوحيدة المأخوذة من شغلك: منصة العقارات (Flutter على المتجرين، Laravel API، لوحة Inertia وVue، عميل سعودي). باقي التفاصيل بين الأقواس <b>[ ]</b> لازم تملاها بالحقيقة. لو حاجة منها مش حصلت، <b>امسحها</b> واحكي اللي حصل فعلا.</p>",
      codes: [
        {
          lang: "text",
          title: "قصة 1: تحدي (نشر التطبيق على المتجرين)",
          src: `Situation: The real-estate app had to go live on the App Store and
Google Play for our client in Saudi Arabia, [deadline or date].

Task: I was responsible for [the release builds and the store
submissions - confirm what you did yourself].

Action: I [prepared the store listing, screenshots and privacy
details]. When [a rejection, a build error or a review comment
happened], I [read the exact message, fixed that one thing, and
tested the new build on a real device before resubmitting].
I [kept the client updated on the status after each step].

Result: The app was approved and published on both stores
[after N rounds / in N days]. I learned to [for example: start the
store setup earlier and keep a release checklist].`,
          note: "الأفعال هنا أمثلة لشكل الـ Action. استبدلها بما فعلته أنت.",
        },
        {
          lang: "text",
          title: "قصة 2: تواصل مع العميل (تغيير في المتطلبات)",
          src: `Situation: During the real-estate project the client asked for
[a change] after the first scope was agreed.

Task: Keep delivering on time without breaking what already worked,
and keep the client happy.

Action: I wrote the request down in my own words and sent it back to
make sure we understood each other. I estimated the effect on the
work [in days], and proposed what goes into the current release and
what moves to the next one. I [updated the API and the admin panel
together so the app and the panel stayed consistent].

Result: [what happened: the client agreed / the release date moved
by N days / ...]. I now [for example: confirm requirements in
writing and keep a small change list].`,
          note: "قصة التواصل بتنفع لأسئلة «خلاف مع عميل»، «ضغط وقت»، «غيروا المتطلبات».",
        },
      ],
      pitfall: "تقول «إحنا» طول القصة. المحاور بيقيّمك إنت. لو اشتغلت مع فريق قول صراحة إيه اللي عملته بنفسك وإيه اللي عمله غيرك.",
    },
    {
      title: "قدّم مشروعك: المشكلة، دورك، المعمارية، مشكلة صعبة، وإيه اللي كنت هتغيره",
      en: "Presenting a project",
      body: "<p>«احكيلي عن مشروع» أهم سؤال في المقابلة التقنية. خمس نقاط بالترتيب، دقيقتين إلى ثلاث:</p>",
      points: [
        "<b>المشكلة</b>: العميل كان محتاج إيه؟ بجملتين، بلغة الشغل مش التقنية.",
        "<b>دورك</b>: قول بدقة إيه اللي عملته إنت وإيه اللي اتعمل بمساعدة (أدوات أو شخص). ده بيبني الثقة.",
        "<b>المعمارية</b>: رسمة من 3 صناديق بالكلام: الـ client، الـ API، الـ database، وأي حاجة مهمة (admin panel، storage، push).",
        "<b>مشكلة صعبة حليتها</b>: bug أو قرار. بتبين تفكيرك: إيه العرض؟ إيه فرضياتك؟ إزاي عزلت السبب؟ إيه الحل؟",
        "<b>إيه اللي هتغيره</b>: حاجة حقيقية، زي اختبارات آلية أو cache أو تقسيم أفضل. بتبين نضجك.",
      ],
      code: {
        lang: "text",
        title: "نموذج لمشروع المنصة العقارية (املا الأقواس)",
        src: `Problem: A client in Saudi Arabia needed a platform to publish and
browse real-estate listings from a mobile app, with an admin panel
to manage content. [one line about the business need]

My role: I built [the Flutter app / the Laravel API / the admin
panel - say which parts you did yourself]. I used [tools/AI/a
teammate] for [what exactly], and I reviewed and understood the
code I shipped.

Architecture: The Flutter app talks to a Laravel REST API over
HTTPS. The API uses [database] and [storage for images]. The
admin panel is built with Inertia and Vue inside the Laravel app.

A hard problem: [describe ONE real bug or decision: the symptom,
what you checked, the cause, the fix, and how you made sure it
did not come back].

What I would do differently: [one true thing, for example: add
automated tests earlier, add caching for the listings screen,
write API documentation from the start].`,
      },
      pitfall: "قصة المشكلة الصعبة المخترعة أو المبهمة. لو قلت «واجهتني مشكلة performance» لازم تعرف تشرح: قستها إزاي؟ إيه كان السبب؟ لو مفيش عندك قصة، اختار مشكلة أصغر حقيقية.",
      interview: [
        { q: "احكيلي عن أكبر مشروع اشتغلت عليه.", a: "بمشي على خمس نقاط: المشكلة اللي العميل كان عنده، دوري أنا بالظبط، المعمارية (Flutter client، Laravel API، لوحة Inertia وVue)، مشكلة صعبة حليتها بالتفصيل من العرض للسبب للحل، وإيه اللي كنت هعمله مختلف لو بدأت من جديد. وبكون صريح في اللي عملته بنفسي واللي استعنت فيه بأدوات، وجاهز أشرح أي جزء بالتفصيل." },
      ],
    },
    {
      title: "الأسئلة السلوكية الشائعة وإزاي تفكر فيها",
      en: "Common behavioural questions",
      body: "<p>كل سؤال تحت له غرض. جاوب الغرض مش الصياغة.</p>",
      points: [
        "<b>«حاجة صعبة واجهتك / challenge»</b>: دليل على حل المشاكل. STAR مع Action تقنية واضحة.",
        "<b>«خلاف أو conflict»</b>: دليل على نضج. اختار خلاف بسيط على قرار (تقني أو متطلب)، مش على شخص. وضّح إنك سمعت الطرف التاني، جبت بيانات أو جربت، وانتهى بحل. متشتمش حد قديم.",
        "<b>«غلطة عملتها / mistake»</b>: دليل على المسؤولية. غلطة حقيقية متوسطة، بتقول إنها غلطتك، وإيه اللي صلحته وإيه العادة اللي غيرتها بعدها (مثلا: backup قبل أي تغيير على production). متقولش «بشتغل زيادة عن اللزوم» كغلطة.",
        "<b>«ليه نوظفك / why should we hire you»</b>: ربط بين طلبهم وإثباتك: «انتوا محتاجين Flutter وLaravel مع تسليم لعميل حقيقي، وأنا نشرت تطبيق على المتجرين بالـ API ولوحة التحكم، وبشتغل مع عملاء بشكل مباشر». من غير مقارنة بغيرك.",
        "<b>«فين شايف نفسك بعد خمس سنين»</b>: عايزين اتجاه مش وعد. «أبقى مطور أقوى في [Flutter/backend]، أتحمل مسؤولية تصميم features كاملة، وأساعد المطورين الأصغر». مفيش «مكانك».",
        "<b>«نقطة ضعف»</b>: حاجة حقيقية بتشتغل عليها فعلا مع إثبات: «في الأول كنت بتجنب كتابة الاختبارات، فبدأت أكتب اختبار لكل endpoint جديد».",
      ],
      interview: [
        { q: "احكيلي عن غلطة عملتها وإيه اللي اتعلمته.", a: "بختار غلطة حقيقية صغيرة ومتوسطة، بقول إنها غلطتي من غير تبرير، وأوضح التأثير بإيجاز، وإيه اللي عملته عشان أصلحها، وإيه العادة اللي اتغيرت بعدها بحيث متتكررش. الجزء الأهم هو التغيير في طريقة شغلي، مش الغلطة نفسها." },
        { q: "ليه نوظفك إنت؟", a: "مبقارنش بغيري. بربط بين اللي هم محتاجينه من إعلان الوظيفة واللي أثبته: لو محتاجين Flutter وLaravel، فأنا نشرت تطبيق على App Store وGoogle Play مع Laravel API ولوحة تحكم لعميل حقيقي، وبشتغل بشكل مباشر مع عملاء وبتعلم بسرعة. وبقول إني عارف إني لسه في بداية الطريق وجاهز أتعلم من الفريق." },
      ],
    },
    {
      title: "الصدق: اللي عملته بنفسك واللي عملته بأدوات أو بفريق",
      en: "Honesty and depth",
      body: "<p>أغلب المشاريع النهاردة بتتعمل بمساعدة أدوات (IDE ذكي، AI، مكتبات، templates) أو فريق. ده طبيعي، ومحدش بيحاسبك عليه. اللي بيحاسبوك عليه إنك <b>تدّعي إنك كتبت حاجة مش فاهمها</b>. الإنترفيو بيكتشف ده بسؤال «ليه؟» واحد زيادة.</p>",
      points: [
        "قول الحقيقة بثقة: «استخدمت أدوات AI عشان أسرّع الكتابة، وأنا اللي بحدد المعمارية وأراجع الكود وأختبره وأصلح.»",
        "اختار 3 إلى 4 أجزاء في مشروعك <b>تقدر تشرحها سطر سطر وتعيد كتابتها لايف</b>: مثلا: الـ auth، صفحة قايمة الإعلانات مع الفلاتر، رفع الصور، جدول واحد في الـ database. دي نقطة قوتك.",
        "للأجزاء اللي مش متأكد منها قول: «ده الجزء اللي كتبته بمساعدة وأنا فاهم فكرته العامة، لكن مش هقدر أشرح تفاصيله دلوقتي.» ده بيحافظ على مصداقيتك في باقي الكلام.",
        "العمق مش معناه أسماء تقنيات. العمق إنك تشرح <b>ليه</b>: ليه Inertia للوحة؟ ليه token؟ ليه index هنا؟ وإيه البديل وليه رفضته.",
      ],
      focus: [{ label: "جملة جاهزة", text: "«ده الجزء اللي اشتغلت عليه بنفسي بالكامل، وده الجزء اللي استعنت فيه بـ [أداة/زميل] وراجعته، وأقدر أشرحلك أيهم تحب.»" }],
      pitfall: "الإنكار الكامل («عملت كل حاجة بإيدي من غير مساعدة») وهو مش حقيقي. لو المحاور سأل سؤال عميق في الجزء ده هتقع، ويفقد الثقة في كل كلامك. الصراحة أقوى.",
      interview: [
        { q: "استخدمت AI في المشروع ده؟ وكنت هتعمله من غيره؟", a: "أيوه استخدمت أدوات AI لتسريع الكتابة والمراجعة، وده جزء من شغلي حاليا. أنا اللي بحدد المتطلبات والمعمارية وبراجع كل حاجة وبختبرها. وأنا بشتغل حاليا على تقوية الأساسيات بإيدي (Dart وPHP وSQL وGit) عشان أكتب وأشرح من غير أداة. وجاهز أعيد كتابة أي جزء من [الأجزاء اللي بتقدر عليها] قدامكم لايف." },
      ],
    },
    {
      title: "لما متعرفش الإجابة، والـ live coding",
      en: "When you do not know, and live coding habits",
      body: "<p>مش هتعرف كل حاجة، والمحاور عارف. اللي بيتقيّم هو <b>إزاي تتصرف</b> لما متعرفش.</p>",
      points: [
        "<b>متخمنش بثقة</b>. قول: «مش متأكد، لكن فهمي إن...» وجرب تستنتج من اللي تعرفه، وقول إنك هتتأكد بعدها.",
        "<b>اسأل سؤال توضيحي</b>: ساعات بتكتشف إنك فاهم السؤال غلط.",
        "<b>قول اللي تعرفه الأول</b>: «معملتش ده في production، لكن في مشروع مشابه عملت كذا، وأفتكر إن الفكرة كذا».",
      ],
      codes: [
        {
          lang: "text",
          title: "عادات الـ live coding (بالترتيب)",
          src: `1. Repeat the problem in your own words.
2. Ask: input size? duplicates? empty input? what to return on error?
3. Work through ONE small example by hand, out loud.
4. Say the simple approach first, then its cost (O(n^2)).
5. Improve it if needed (hash map, sorting, two pointers).
6. Write the code in small pieces and name things clearly.
7. Test with your example, an empty input, and one edge case.
8. State the final time and space complexity.`,
          note: "كل خطوة بصوت عالي. الصمت 3 دقايق وإنت بتكتب مخيف للمحاور، وكلامك بيدّيه فرصة يساعدك.",
        },
      ],
      pitfall: "إنك تقف عند أول عقبة وتسكت. لو علقت قول: «أنا علقت في [النقطة]. جربت [كذا]. أفكر في [كذا]، تحب أكمل في الاتجاه ده؟» ده بيبين مهارة المطور الحقيقي.",
      interview: [
        { q: "لو سألوك عن حاجة متعرفهاش، تعمل إيه؟", a: "مبتظاهرش. بقول إني مش متأكد، وبقول اللي أعرفه من حاجات قريبة وأحاول أستنتج بصوت عالي: «فهمي إن ده بيشتغل كذا لأن...». ولو لسه مش عارف أقول: «مش عارف دي، وكنت هدور عليها في الـ docs وأجربها». وبعد المقابلة فعلا أذاكرها. ده بيبين إني أمين وبتعلم، وده أحسن من إجابة غلط بثقة." },
      ],
    },
    {
      title: "أسئلة تسألها، وكلام المرتب، وبعد المقابلة",
      en: "Questions to ask, salary talk, follow-up",
      body: "<p>في آخر المقابلة هيقولوا «Do you have any questions for us؟». لو قلت «لأ» ده بيدل على قلة اهتمام. جهّز 3 أسئلة حقيقية:</p>",
      points: [
        "«إيه شكل أول 3 شهور لحد جديد في الفريق؟» و«إيه اللي يعتبروه نجاح في الفترة دي؟»",
        "«إزاي بتعملوا code review؟ وإيه الأدوات اللي بتستخدموها في الـ deployment والاختبارات؟»",
        "«إيه أكبر تحدي تقني الفريق بيواجهه حاليا؟» و«إزاي بيتوزع الشغل والـ priorities؟»",
        "للـ remote: «إيه ساعات الشغل المتوقعة ومدى التداخل مع توقيت الفريق؟ وبتتواصلوا إزاي؟»",
      ],
      codes: [
        {
          lang: "text",
          title: "كلام المرتب: مبادئ بدل أرقام",
          src: `1. Research first: similar roles, your market (remote vs local), your
   level. Ask people in the field. Know your own minimum number.
2. If they ask first: "What is the budget for this role?" is fair.
3. If you must answer, give a RANGE where the bottom is a number you
   would really accept, not your lowest hope:
   "Based on the scope and my research, I am looking at [X] to [Y]
   per month."
4. Do not anchor low: the first number often sets the conversation.
5. Always say the currency and the basis: [USD/SAR/EGP], gross or
   net, monthly or hourly, and who pays taxes or insurance (for a
   contractor vs an employee).
6. Ask about the rest: probation period, paid leave, equipment,
   payment method and date, review after [6] months.
7. You may ask for time: "Thank you, I would like to review the
   offer and reply by [day]."`,
          note: "مفيش أرقام هنا عمدا. الرقم بتحدده إنت بعد بحثك. لو أول مرة، اسأل أصحاب في المجال عن نطاق مناسب.",
        },
        {
          lang: "text",
          title: "بعد المقابلة (خلال 24 ساعة)",
          src: `Subject: Thank you - [Role] interview

Hi [Name],

Thank you for your time today. I enjoyed learning about [one
specific thing from the interview]. Our discussion about [topic]
made me even more interested in the role.

[Optional: one point you want to add or correct from the interview.]

I look forward to the next steps. Please let me know if you need
anything else from me.

Best regards,
[Your name]`,
          note: "قصيرة ومحددة. لو معاد القرار عدّى بيومين، رسالة تانية مهذبة تسأل عن الموقف.",
        },
      ],
      interview: [
        { q: "توقعك للمرتب إيه؟", a: "لو قدروا يقولوا الميزانية الأول بسأل: «إيه الـ range المخصص للدور ده؟». لو لازم أجاوب بقول نطاق مبني على بحثي ونطاق الشغل، والحد الأدنى فيه رقم أقبله فعلا، مع تحديد العملة والفترة (شهري) وهل قبل الضريبة. وبسأل عن باقي العرض (فترة التجربة، الإجازات، طريقة الدفع) قبل ما أرد." },
      ],
    },
    {
      title: "جمل إنجليزي بتفرق في المقابلة",
      en: "English phrases that help",
      body: "<p>مش لازم إنجليزي بلاغي. جمل بسيطة ومظبوطة وواضحة أحسن من جمل معقدة فيها أخطاء. احفظ دي واتدرب عليها في الـ drills.</p>",
      code: {
        lang: "text",
        src: `Buying time
  Could you repeat the question, please?
  Let me think about that for a moment.
  Just to make sure I understand: you are asking about [topic], right?

Not knowing
  I have not used that in production, but I understand the idea.
  I am not sure, but my understanding is that it works like this.
  I would look it up in the docs and test it.

Explaining a decision
  I chose X because Y. The trade-off is Z.
  The alternative was A, but it would have cost us B.

Live coding
  Let me start with a simple example.
  The simple approach is O(n squared); we can improve it with a map.
  Let me test it with an empty input and one edge case.

Your work
  I built the Flutter app and the Laravel API for the client.
  I worked on this part myself, and I used [tool] for that part.
  A mistake I made was X. Now I always do Y.

Closing
  Could you tell me about the next steps in the process?
  Thank you for your time. I enjoyed the conversation.`,
      },
      focus: [{ label: "نصيحة عملية", text: "سجّل نفسك بصوتك وإنت بتقول التعريف بنفسك بالإنجليزي. اسمعه وصحح النطق والوقفات. بعد 3 مرات هتحس بفرق كبير." }],
    },
  ],

  drills: [
    {
      title: "اكتب: جمل كسب الوقت وعدم المعرفة",
      lang: "text",
      code: `Could you repeat the question, please?
Let me think about that for a moment.
I have not used that in production, but I understand the idea.
My understanding is that it works like this.
Can I check one assumption before I start?
I would test it with a few examples first.`,
    },
    {
      title: "اكتب: شرح قرار وغلطة",
      lang: "text",
      code: `I chose Laravel for the API because I know it well.
The trade-off is that it needs a PHP server.
The simple approach is O(n squared).
We can improve it with a hash map, so it becomes O(n).
A mistake I made was changing production without a backup.
Now I always take a backup before any change.
Could you tell me about the next steps?
Thank you for your time.`,
    },
    {
      title: "اكتب: التعريف بنفسك بالإنجليزي",
      lang: "text",
      code: `Hi, I'm [Name]. I'm a fourth-year computer science student
and a freelance developer. I mostly build mobile apps with
Flutter and backends with Laravel.
My main project is a real-estate platform for a client in
Saudi Arabia: a Flutter app on the App Store and Google Play,
a Laravel API, and an admin panel built with Inertia and Vue.
I also built an Odoo website with CRM automation for a factory.
I'm looking for a junior role where I can grow in [skill].
Thank you for your time.`,
      note: "اكتبه كما هو مرة، وبعدين غيّر الأقواس بكلامك وسجله بصوتك.",
    },
  ],

  tasks: [
    {
      title: "اكتب تعريفك بنفسك (60 إلى 90 ثانية)",
      lang: "text",
      prompt: "<p>اكتب تعريفك الحقيقي بالإنجليزي بالهيكل: مين أنا، أقوى دليل، ليه الوظيفة دي. استخدم الحقائق دي بس لو حقيقية: منصة العقارات (Flutter على المتجرين، Laravel API، لوحة Inertia وVue، عميل سعودي)، موقع Odoo مع أتمتة CRM لمصنع سعودي. حط أقواس لأي رقم أو اسم مش عندك.</p>",
      hints: [
        "ابدأ بجملة حاضر: سنة الدراسة + نوع الشغل + التقنيات.",
        "جملة واحدة قوية للمشروع الرئيسي، وجملة للباقي. اختم بسبب محدد للوظيفة.",
        "عدّ الكلمات: 150 إلى 200 كلمة تقريبا = 60 إلى 90 ثانية.",
      ],
      solution: `Hi, I'm [Name]. I'm a fourth-year computer science student at
[University] and a freelance developer. I mostly build mobile apps
with Flutter and backends with Laravel.

My main project is a real-estate platform for a client in Saudi
Arabia. It has a Flutter app published on the App Store and Google
Play, a Laravel API, and an admin panel built with Inertia and Vue.
I [designed the API endpoints and built the screens / describe your
real part], and I use AI tools to move faster but I review and
understand what I ship.

I also built an Odoo website with CRM automation for a factory in
Saudi Arabia.

I enjoy [what you really enjoy]. I'm looking for a junior [Flutter /
Laravel] role where I can learn from an experienced team, and this
one fits because [a reason from the job post].`,
      explain: "الحقائق الوحيدة هي المشاريع التلاتة. الأقواس لازم تتملى بالحقيقة. الجملة عن الأدوات صادقة وبتقفل سؤال «استخدمت AI؟» قبل ما يتسأل. حوالي 150 كلمة، وده في حدود 60 إلى 80 ثانية بصوت طبيعي.",
    },
    {
      title: "حضّر قصة STAR واحدة",
      lang: "text",
      prompt: "<p>اختار موقف <b>حقيقي</b> واحد من شغلك على أي سؤال: «احكيلي عن تحدي» أو «غلطة». اكتبه بالإنجليزي بالأربع حروف S وT وA وR، من 6 إلى 10 أسطر. الـ Action أطول جزء. ضيف جملة «اتعلمت».</p>",
      hints: [
        "الـ Situation سطرين بحد أقصى: المشروع والمشكلة.",
        "في الـ Action استخدم «I» وقول ليه اخترت الحل ده.",
        "الـ Result لازم يقول إيه اللي حصل فعلا، حتى لو كان صغير.",
      ],
      solution: `Situation: In the real-estate project, [a problem in your project:
for example, a screen was slow / an API returned wrong data].
Task: I had to find the cause and fix it before [a date or release].
Action: First I [reproduced it with a clear example]. Then I [checked
the logs / the network response / the database query]. I found that
[the cause]. I fixed it by [your change] and I [added a test or a
check] so it would not come back. I also [told the client what
happened and what changed].
Result: [what improved, with a number only if you really measured it].
I learned to [a new habit: for example, reproduce first, then change].`,
      explain: "نموذج بيحافظ على الهيكل: العرض، التحقق، السبب، الحل، منع التكرار. مفيش تفاصيل مخترعة: كلها بين أقواس لتملاها بقصتك. القصة الحقيقية بتفاصيلها هي اللي بتتصدق.",
    },
    {
      title: "اكتب شرح المشروع (دقيقتين)",
      lang: "text",
      prompt: "<p>اكتب بالإنجليزي شرح منصة العقارات (أو مشروعك الأقوى) بالنقاط الخمس: Problem، My role، Architecture، A hard problem، What I would do differently. 120 إلى 200 كلمة. اكتب بين أقواس أي معلومة مش متأكد منها.</p>",
      hints: [
        "في My role قول بوضوح: اللي عملته بنفسك واللي استعنت فيه بأداة أو شخص.",
        "الـ Architecture: client → API → database + أي مكونات مهمة. جملتين.",
        "في What I would do differently اختار حاجة صادقة وصغيرة قابلة للتنفيذ.",
      ],
      solution: `Problem: A client in Saudi Arabia needed a platform to publish and
browse real-estate listings from a mobile app, with an admin panel
to manage the content.

My role: I built [the Flutter app, the Laravel API and the admin
panel - say what you did yourself]. I used [tools] for [what], and I
reviewed and tested what I shipped.

Architecture: The Flutter app (on the App Store and Google Play)
talks to a Laravel REST API over HTTPS. The API stores data in
[database] and [files/images in storage]. The admin panel is built
with Inertia and Vue inside the Laravel app, so one deployment
serves both the API and the panel.

A hard problem: [one real bug: symptom, what I checked, the cause,
the fix, how I prevented it].

What I would do differently: [one true thing, for example: write
automated tests earlier and document the API from day one].`,
      explain: "الهيكل هو المهم: مشكلة بلغة الشغل، دورك بصدق، معمارية بجمل بسيطة، مشكلة صعبة حقيقية، وتحسين واقعي. الجملة الأخيرة في الـ Architecture حقيقية لأن Inertia بتشتغل جوه تطبيق Laravel. باقي التفاصيل بتملاها بشغلك الفعلي.",
    },
  ],

  quiz: [
    {
      q: "سألوك «Tell me about yourself». أنهي بداية هي الأقوى؟",
      options: [
        "«ولدت في... ودرست في المدرسة... وبعدين دخلت الجامعة...» وتكمل تاريخ حياتك",
        "«أنا طالب سنة رابعة وfreelance developer بـ Flutter وLaravel، وأهم مشروع نشرته تطبيق عقارات على المتجرين مع API ولوحة تحكم، وبدور على دور junior أتعلم فيه [مجال محدد]»",
        "«أنا بعرف Dart وPHP وJS وPython وC++ وJava وSQL وGit وDocker وغيرهم»",
        "«معنديش خبرة كبيرة بس هحاول»",
      ],
      answer: 1,
      why: "التعريف الجيد: حاضر + دليل + ليه الوظيفة، في دقيقة. الأول تاريخ حياة غير مرتبط، والتالت قايمة أسماء من غير دليل، والرابع بيقلل من قيمتك قبل ما تبدأ.",
    },
    {
      q: "«احكيلي عن غلطة عملتها». أقوى إجابة؟",
      options: [
        "«أنا بشتغل زيادة عن اللزوم وبتعب نفسي»",
        "«مفيش غلطات كبيرة عملتها»",
        "«كان الغلط من العميل لأنه غيّر المتطلبات»",
        "«عدلت على الـ production من غير backup فحصل [مشكلة]. صلحتها بـ [كذا]، ودلوقتي بعمل backup وبجرب على staging قبل أي تغيير»",
      ],
      answer: 3,
      why: "غلطة حقيقية، مسؤولية واضحة، إصلاح، وعادة اتغيرت. الأولى «نقطة ضعف مقنعة» ومحدش بيصدقها، والتانية بتبين قلة وعي، والتالتة بتلوم غيرك.",
    },
    {
      q: "سألوك عن حاجة مش بتعرفها بدقة (مثلا: قاعدة data بتتصرف إزاي في حالة معينة). أفضل رد؟",
      options: [
        "تخمن بثقة عالية عشان متبانش جاهل",
        "تقول «معرفش» وتسكت",
        "«مش متأكد، لكن فهمي إن ده بيشتغل كذا بسبب كذا. كنت هتأكد من الـ docs وأجربه»",
        "تغير الموضوع لحاجة تانية تعرفها",
      ],
      answer: 2,
      why: "الصراحة مع استنتاج منطقي وخطة تأكد بتبين طريقة تفكيرك. التخمين بثقة ممكن يكشفك، و«معرفش» وبس بتقفل الحوار، وتغيير الموضوع باين.",
    },
    {
      q: "في live coding اتعرضت عليك مشكلة. إيه أحسن أول خطوة؟",
      options: [
        "تبدأ تكتب الكود فورا عشان تبين سرعتك",
        "تعيد المشكلة بكلامك وتسأل عن الحالات الحدية وتجرب مثال صغير بصوت عالي",
        "تسكت وتفكر خمس دقايق",
        "تطلب لغة تانية",
      ],
      answer: 1,
      why: "فهم المشكلة أول خطوة، والأمثلة بتكشف الحالات الحدية، والكلام بصوت عالي بيخلي المحاور يشوف تفكيرك ويساعدك. الكتابة المتسرعة والسكوت الطويل من أشهر الأخطاء.",
    },
    {
      q: "المحاور سألك مبكرا: «توقعك للمرتب إيه؟» وإنت معندكش فكرة عن ميزانيتهم. الأنسب؟",
      options: [
        "تقول أقل رقم عشان تتأكد إنهم هيوافقوا",
        "تقول «اللي تدفعوه كويس»",
        "تقول رقم عالي جدا من غير سبب",
        "تسأل عن range الدور الأول، ولو لازم تجاوب تدي نطاق مبني على بحثك مع العملة والفترة",
      ],
      answer: 3,
      why: "السؤال عن الميزانية معقول. النطاق المبني على بحث بيحميك من الـ anchoring المنخفض (أول رقم بيحدد الحوار). «اللي تدفعوه» بتضيع قوتك التفاوضية، والرقم العالي من غير أساس بينفّر.",
    },
    {
      q: "سألوك عن خلاف في الشغل. أنهي إجابة الأفضل؟",
      options: [
        "«كان عندي زميل صعب وبعد كده مشي»",
        "«ماليش خلافات أبدا»",
        "«كان فيه اختلاف في الرأي على [قرار]. سمعت وجهة نظره، جربنا الحلين أو راجعنا البيانات، واتفقنا على [حل]، وعرفت إن [درس]»",
        "«أنا عادة بكون صح وبقنعهم»",
      ],
      answer: 2,
      why: "خلاف على قرار، استماع، دليل، حل. بتبين نضجك. الإجابات التانية إما بتلوم شخص أو بتنكر أو بتدل على عدم مرونة.",
    },
    {
      q: "المحاور سألك: «إنت كتبت كل الكود ده بنفسك؟» وإنت استخدمت أدوات AI. أنهي رد الأقوى؟",
      options: [
        "«أيوه كله بإيدي من غير أي مساعدة»",
        "«لأ، الأدوات هي اللي عملت كل حاجة»",
        "«مفيش داعي أجاوب على ده»",
        "«استخدمت أدوات AI لتسريع الكتابة. أنا حددت المعمارية وراجعت واختبرت، وأقدر أشرحلك وأعيد كتابة [جزء محدد] دلوقتي»",
      ],
      answer: 3,
      why: "الصراحة مع دليل إنك فاهم وقادر تعيد الكتابة هي اللي بتبني ثقة. الإنكار هيتكشف بسؤال «ليه» واحد، والتقليل من دورك بيضيع قيمتك، ورفض الإجابة بيدل على إخفاء.",
    },
    {
      q: "في آخر المقابلة: «Do you have any questions?». أنهي سؤال الأقوى؟",
      options: [
        "«لأ، شكرا»",
        "«إزاي شكل أول 3 شهور لحد جديد في الفريق وإيه اللي بيعتبر نجاح؟»",
        "«ممكن أروح إجازة بعد أسبوع؟»",
        "«إنتوا اشتغلتوا مع شركات كبيرة؟»",
      ],
      answer: 1,
      why: "سؤال بيبين اهتمامك بالشغل الفعلي والنجاح فيه. «لأ» بتدل على قلة اهتمام، والإجازة في الأول بتدي انطباع سيء، والتالت مش مفيد ليك.",
    },
    {
      q: "بتحكي قصة STAR. إيه الجزء اللي المفروض ياخد أكبر وقت؟",
      options: [
        "Situation: شرح تاريخ المشروع بالتفصيل",
        "Result: الفخر بالنتيجة",
        "Action: إيه اللي عملته إنت بالظبط وليه",
        "Task: تعريف المسؤوليات",
      ],
      answer: 2,
      why: "الـ Action هو اللي بيبين مهارتك وطريقة تفكيرك، فياخد حوالي 60% من الوقت. الـ Situation والـ Task مختصرين، والـ Result بيتقال بوضوح بدون إطالة.",
    },
  ],
};
