window.LEVELS = window.LEVELS || {};
window.LEVELS["core/cb"] = {
  boss: [
    {
      q: "<b>1. التعريف بالنفس.</b> «Tell me about yourself» (دقيقة تقريبا).",
      a: "الهيكل: <b>مين أنا الآن</b> (طالب سنة رابعة علوم حاسب وfreelance developer بـ Flutter وLaravel)، <b>أقوى دليل</b> (منصة عقارات لعميل سعودي: تطبيق Flutter على App Store وGoogle Play، وLaravel API، ولوحة تحكم بـ Inertia وVue، وبقول دوري بالظبط)، <b>مشاريع تانية بجملة</b> (موقع Odoo مع أتمتة CRM لمصنع سعودي)، <b>ليه الوظيفة دي</b> (سبب محدد من الإعلان). مثال: «I'm a fourth-year CS student and a freelance developer. My main project is a real-estate platform for a client in Saudi Arabia, with a Flutter app on both stores, a Laravel API and an Inertia + Vue admin panel. I'm looking for a junior [role] where I can [grow in X].» ومحطش رقم مش حقيقي: مكانه [عدد المستخدمين] تملاه لو تعرفه.",
    },
    {
      q: "<b>2. المشروع.</b> احكيلي عن مشروع اشتغلت عليه، وإيه كان دورك؟",
      a: "خمس نقاط: <b>المشكلة</b> (عميل سعودي محتاج منصة لنشر وتصفح إعلانات عقارية من الموبايل مع لوحة إدارة)، <b>دوري</b> (أقول بدقة أنهي أجزاء عملتها بنفسي وأنهي استعنت فيها بأدوات أو شخص)، <b>المعمارية</b> (تطبيق Flutter يكلم Laravel REST API، واللوحة بـ Inertia وVue جوه نفس تطبيق Laravel)، <b>مشكلة صعبة حقيقية</b> بتفاصيلها: العرض، اللي فحصته، السبب، الحل [املاها بقصتك]، و<b>إيه اللي هغيره</b> (مثلا اختبارات آلية أبكر أو cache لشاشة القايمة). الصدق هنا أهم من الإبهار، وأكون جاهز لسؤال «ليه اخترت كده؟» على أي جزء.",
    },
    {
      q: "<b>3. سلوكي.</b> احكيلي عن تحدي تقني واجهته وإزاي حليته.",
      a: "بجاوب بـ STAR. <b>Situation</b> سطرين: المشروع والمشكلة. <b>Task</b>: المطلوب مني أنا. <b>Action</b> وهي أطول جزء: أعدت إنتاج المشكلة بمثال واضح، فحصت الـ logs أو الـ response أو الاستعلام، عزلت السبب، صلحته، وأضفت اختبار أو فحص يمنع رجوعها، وليه اخترت الحل ده. <b>Result</b>: إيه اللي اتحسن (برقم لو قستُه فعلا) والدرس. مثال ممكن أبني عليه من شغلي: نشر التطبيق على المتجرين. أحط بدل الأقواس اللي حصل فعلا ومقولش أي حاجة ما حصلتش.",
    },
    {
      q: "<b>4. سلوكي.</b> احكيلي عن غلطة عملتها أو خلاف حصل في الشغل.",
      a: "اختار غلطة حقيقية متوسطة وأقول إنها غلطتي من غير تبرير: «عدلت على [حاجة] من غير backup/اختبار فحصل [الأثر]». أوضح بإيجاز إزاي كشفتها وإيه اللي صلحته، وإيه العادة اللي اتغيرت (backup قبل أي تغيير، تجربة على بيئة تانية، مراجعة قبل النشر). ولو الخلاف: اختلاف في قرار مع عميل أو زميل، سمعت وجهة نظره، عرضت بيانات أو جربنا، وانتهينا لحل ودرس. من غير لوم لحد.",
    },
    {
      q: "<b>5. Git.</b> إيه الفرق بين <code>merge</code> و<code>rebase</code>؟ وعملت commit على <code>main</code> بالغلط، تعمل إيه؟",
      a: "الـ <code>merge</code> بيدمج فرعين وبينتج merge commit والتاريخ بيحتفظ بالتفرع كما حصل. الـ <code>rebase</code> بيعيد تركيب commits فرعي فوق آخر main فالتاريخ خطي، لكن بيغير الـ hashes فمبعملوش على فرع شاركت فيه غيري. للـ commit الغلط على main (لسه محلي): <code>git branch fix/x</code> عشان أحتفظ بالشغل، وبعدين <code>git reset --hard origin/main</code> على main، وأكمل على الفرع الجديد. ولو كان اتعمل push فأستخدم <code>git revert</code> بدل إعادة كتابة التاريخ.",
    },
    {
      q: "<b>6. SQL.</b> الفرق بين <code>INNER JOIN</code> و<code>LEFT JOIN</code>؟ واستعلام بطيء تعمل فيه إيه؟",
      a: "الـ <code>INNER JOIN</code> بيرجع الصفوف اللي ليها تطابق في الجدولين بس. الـ <code>LEFT JOIN</code> بيرجع كل صفوف الجدول الشمال وفي حالة مفيش تطابق الأعمدة اليمين بتبقى <code>NULL</code>، مثلا كل المكاتب مع عدد إعلاناتها حتى اللي صفر. للبطيء: أشغّل <code>EXPLAIN</code> وأشوف هل فيه full scan، وأضيف index مناسب (أعمدة المساواة الأول وبعدها الـ range)، وأتجنب <code>SELECT *</code> والـ N+1، وأقيس تاني بعد كل تعديل.",
    },
    {
      q: "<b>7. HTTP وREST.</b> إيه الفرق بين <code>401</code> و<code>403</code>؟ وبين <code>PUT</code> و<code>PATCH</code>؟ وإيه معنى idempotent؟",
      a: "<code>401</code>: مش authenticated (مفيش توكن أو غلط). <code>403</code>: authenticated لكن مش مسموح ليك بالفعل ده. <code>PUT</code> بيستبدل المورد كله، و<code>PATCH</code> بيعدل حقول محددة. الـ idempotent معناه إن تكرار نفس الطلب بيدي نفس الأثر: <code>GET</code> و<code>PUT</code> و<code>DELETE</code> idempotent، و<code>POST</code> مش كده، فتكرار POST ممكن ينشئ نسختين، وده مهم لإعادة المحاولة عند ضعف الشبكة.",
    },
    {
      q: "<b>8. هياكل بيانات.</b> متى تستخدم array ومتى hash map؟ وإيه تعقيد البحث في كل منهما؟",
      a: "الـ array (list) البحث عن قيمة فيها O(n) لأني بعدي عليها واحدة واحدة، والوصول بالـ index O(1). الـ hash map البحث بالمفتاح O(1) في المتوسط، لكن مبتحافظش على ترتيب مفيد للبحث بالنطاق وبتاخد ذاكرة أكتر. بستخدم map لما أبحث كتير بمفتاح، أو أعد أو أجمع (زي حل two-sum في O(n) بدل O(n²))، وlist لما الترتيب أو الوصول بالـ index هو المهم. أذكر كمان إن أسوأ حالة للـ hash map O(n) لو الاصطدامات كتير لكنها نادرة.",
    },
    {
      q: "<b>9. OOP وSOLID.</b> اشرح Dependency Inversion وDependency Injection بمثال، وإمتى تفضل composition على inheritance؟",
      a: "الـ DIP: الكلاس الأساسي يعتمد على interface مش على تنفيذ. الـ DI: الاعتماد بيتمرر من برا (constructor) بدل <code>new</code> جوه. مثال: <code>OfferService</code> بياخد <code>Clock</code> فالاختبار يحقن <code>FixedClock</code> بتاريخ ثابت والـ production بيحقن <code>SystemClock</code>. بفضل composition لأن الوراثة بتربطني بالأب، بتغير الاعتماد بسهولة، وبستخدم الوراثة بس لما العلاقة is-a حقيقية (يقدر الابن يحل محل الأب في أي مكان، وده Liskov).",
    },
    {
      q: "<b>10. Flutter.</b> الفرق بين <code>StatelessWidget</code> و<code>StatefulWidget</code>؟ وإيه اللي بيحصل لما تنادي <code>setState</code>؟ وليه نكتب <code>const</code> قدام الـ widgets؟",
      a: "الـ Stateless مفيهوش حالة تتغير جواه، بيتبني من الـ parameters. الـ Stateful ليه كلاس <code>State</code> بيحتفظ بحالة بتتغير مع الوقت. <code>setState</code> بتعدّل الحالة وبتعلّم الـ widget إنه محتاج rebuild، فـ Flutter ينادي <code>build</code> تاني ويعيد رسم اللي اتغير. الـ <code>const</code> بتخلي الـ widget يتبني مرة واحدة وتتشارك نسخته، فـ Flutter يتخطى إعادة بناء الجزء ده، وبكده نقلل الشغل على كل rebuild. وبحاول أحط <code>setState</code> على أصغر widget ممكن.",
    },
    {
      q: "<b>11. Dart.</b> إيه الفرق بين <code>Future</code> و<code>Stream</code>؟ وإزاي <code>async/await</code> بيشتغل؟",
      a: "الـ <code>Future</code> قيمة واحدة هتوصل في المستقبل (نتيجة طلب HTTP مثلا)، والـ <code>Stream</code> سلسلة قيم أو أحداث على مدار الوقت (تحديثات مباشرة، تغييرات state). الـ <code>async</code> بتخلي الدالة ترجع Future، و<code>await</code> بيستنى الـ Future من غير ما يقفل الـ thread: الـ event loop بيكمل يشتغل على حاجات تانية والدالة بتكمل لما النتيجة توصل. وبتتعامل مع الأخطاء بـ <code>try/catch</code>، وفي Flutter بنعرضهم بـ <code>FutureBuilder</code> و<code>StreamBuilder</code>.",
    },
    {
      q: "<b>12. Laravel.</b> إيه مشكلة الـ N+1؟ وإزاي تحلها؟",
      a: "لما أجيب 50 إعلان بـ query واحدة وبعدين أعدي على كل إعلان وأقرأ علاقة (مثلا صوره أو مكتبه) فـ Eloquent بينفذ query منفصلة لكل إعلان: 1 + 50 استعلام. الحل <b>eager loading</b>: <code>Listing::with('images', 'office')-&gt;get()</code> فبتتنفذ query واحدة للإعلانات وواحدة لكل علاقة. بكشفها بـ query log أو Telescope/Debugbar، وفي التطوير ممكن أفعّل <code>Model::preventLazyLoading()</code> عشان ترمي خطأ لو حصل lazy loading بالغلط.",
    },
    {
      q: "<b>13. Laravel.</b> المستخدم بيعمل إجراء بيحتاج يبعت إشعارات وإيميلات، وبياخد وقت. إزاي تتعامل معاه؟",
      a: "مبخليش الـ request يستنى. بعمل <b>Job</b> وأرميه في الـ queue (<code>dispatch</code>) وأرد على الـ client فورا، وworker يشتغل في الخلفية. الفوايد: رد سريع، وإعادة محاولة تلقائية عند الفشل، وأقدر أزود الـ workers. لازم الـ job يكون <b>idempotent</b> لأنه ممكن يتنفذ مرتين، وأراقب الـ failed jobs. مبحطش في الـ queue الحاجات اللي رد الطلب معتمد عليها، زي التحقق من الصلاحية. وأستخدم Redis أو database كـ queue driver حسب الحجم.",
    },
    {
      q: "<b>14. تصميم صغير.</b> إزاي تصمم رفع صور الإعلان من تطبيق الموبايل؟",
      a: "بدأ بالمتطلبات: كام صورة للإعلان، حجمها، والعرض على قايمة وتفاصيل. التصميم: الـ client يطلب من الـ API <b>presigned URL</b> (رابط مؤقت) ويرفع الملف مباشرة على <b>object storage</b>، فالـ API server مبيتحملش حجم الملفات ويفضل stateless. بعدين الـ client يبلّغ الـ API بالمسار، والـ API تسجله في جدول <code>listing_images</code> وترمي job في الـ queue لتصغير الصورة (thumbnails)، والعرض يتم عن طريق <b>CDN</b>. أتحقق من النوع والحجم، ولو الرفع فشل أعيد المحاولة، وأنضف الملفات اللي ملهاش صف.",
    },
    {
      q: "<b>15. اكتب دالة.</b> اكتب بـ Dart دالة <code>twoSum(List&lt;int&gt; nums, int target)</code> ترجع أول زوج index مجموع قيمتيهم يساوي <code>target</code>، أو <code>null</code> لو مفيش. وإيه تعقيدها؟",
      a: "أبدأ بالتوضيح: هل ممكن تكرار؟ وإيه المطلوب لو مفيش زوج؟ الحل البسيط loop داخل loop بـ O(n²). الأحسن hash map: لكل رقم أحسب المكمل <code>target - nums[i]</code> وأشوف هل شفته قبل كده، ولو أيوه أرجع index بتاعه مع الحالي، ولو لأ أخزن الرقم. تعقيد الوقت O(n) والمساحة O(n).<pre dir='ltr'><code>List&lt;int&gt;? twoSum(List&lt;int&gt; nums, int target) {\n  final seen = &lt;int, int&gt;{};\n  for (var i = 0; i &lt; nums.length; i++) {\n    final need = target - nums[i];\n    final j = seen[need];\n    if (j != null) return [j, i];\n    seen[nums[i]] = i;\n  }\n  return null;\n}</code></pre>بجربه على: <code>[2, 7, 11, 15]</code> و9 يرجع <code>[0, 1]</code>، و<code>[1, 2]</code> و10 يرجع <code>null</code>، وقايمة فاضية ترجع <code>null</code>.",
    },
    {
      q: "<b>16. آخر المقابلة.</b> «Do you have any questions for us؟»",
      a: "أجهز 3 أسئلة حقيقية وأسأل اتنين منهم على الأقل: «إيه شكل أول 3 شهور لحد جديد وإيه اللي بيعتبروه نجاح؟»، «إزاي بتعملوا code review وإيه عملية الـ deployment والاختبارات؟»، «إيه أكبر تحدي تقني الفريق بيواجهه؟». ولو الدور remote: «إيه ساعات الشغل المتوقعة ومدى التداخل مع توقيت الفريق؟». وأقفل بـ «Could you tell me about the next steps?» وأشكرهم، وأبعت رسالة شكر قصيرة ومحددة خلال 24 ساعة. مبسألش في أول مقابلة عن إجازات أو أسئلة تدل على قلة اهتمام.",
    },
  ],
};
