window.LEVELS = window.LEVELS || {};
window.LEVELS["core/c3"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "إيه اللي بيحصل لما تفتح URL",
      en: "What happens when you open a URL",
      body: "<p>«إيه اللي بيحصل لما تكتب <code>https://app.example.com/listings</code> وتدوس Enter؟» سؤال كلاسيكي في الإنترفيو، والمطلوب منك ترتب الخطوات وتعرف كل واحدة بتعمل إيه، مش تحفظ تفاصيل بروتوكولات. وتطبيق الـ Flutter بتاعك بيعمل نفس الشغل في كل مرة بتنادي فيها API.</p>",
      points: [
        "<b>1. DNS</b>: تحويل الاسم لـ IP. بيدور في cache المتصفح، وبعدها نظام التشغيل، وبعدها الـ resolver (عند الـ ISP أو 8.8.8.8) ولو مش لاقيه بيسأل سلسلة DNS (root ثم TLD زي <code>.com</code> ثم الـ authoritative server للدومين).",
        "<b>2. TCP</b>: فتح اتصال بالـ IP على بورت 443 بـ three-way handshake: SYN ثم SYN-ACK ثم ACK.",
        "<b>3. TLS</b>: لو https، الطرفين بيتفقوا على التشفير. السيرفر بيبعت شهادة (certificate) والمتصفح بيتأكد إنها صادرة من جهة موثوقة وبتخص الدومين ده، وبعدها بيتبادلوا مفاتيح الجلسة. من هنا الكلام مشفّر.",
        "<b>4. Request</b>: المتصفح بيبعت طلب HTTP (<code>GET /listings</code> مع headers).",
        "<b>5. Response</b>: السيرفر (غالبا وراه load balancer ثم تطبيق Laravel ثم الداتابيز) بيرد بـ status وheaders وbody.",
        "<b>6. Render</b>: المتصفح بيقرا الـ HTML ويطلب الـ CSS والـ JS والصور (طلبات HTTP تانية، وغالبا على نفس الاتصال)، وبيرسم الصفحة.",
      ],
      pitfall: "تقول «بيروح للسيرفر» وخلاص. المحاور عايز يسمع DNS و TCP و TLS بالترتيب. وتفصيلة تلمع بيها: HTTP/2 بيبعت طلبات كتير على اتصال واحد (multiplexing)، و HTTP/3 شغال فوق QUIC على UDP بدل TCP.",
      interview: [
        { q: "إيه اللي بيحصل لما تكتب URL في المتصفح وتدوس Enter؟", a: "أولا DNS يحول الدومين لعنوان IP، بيبدأ بالـ cache وبعدين الـ resolver. بعدها المتصفح يفتح اتصال TCP بالسيرفر (three-way handshake)، ولو https يعمل TLS handshake: يتأكد من شهادة السيرفر ويتفقوا على مفاتيح تشفير. بعدها يبعت HTTP request، والسيرفر يعالجه (load balancer، التطبيق، الداتابيز) ويرد بـ status code وheaders وbody. وأخيرا المتصفح يعالج الـ HTML ويطلب الموارد التانية ويرسم الصفحة." },
      ],
    },
    {
      title: "شكل الـ request والـ response",
      en: "Anatomy of an HTTP message",
      body: "<p>HTTP بروتوكول نصي بسيط: طلب ورد. كل واحد منهم: سطر أول، headers (سطر لكل واحد: <code>Name: value</code>)، سطر فاضي، وبعدين الـ body (اختياري).</p>",
      codes: [
        {
          lang: "text",
          title: "Request",
          src: `POST /api/v1/listings HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json
Accept: application/json

{"title":"Villa Yasmin","price":1500000}`,
          note: "السطر الأول: <b>method</b> + <b>path</b> + نسخة البروتوكول. الـ headers بتوصف الطلب. بعد السطر الفاضي الـ body.",
        },
        {
          lang: "text",
          title: "Response",
          src: `HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/v1/listings/15

{"id":15,"title":"Villa Yasmin","price":1500000}`,
          note: "السطر الأول: النسخة + <b>status code</b> + العبارة. <code>Location</code> بتقول فين المورد الجديد.",
        },
      ],
      terms: [
        ["method", "نوع العملية", "GET للقراءة، POST للإنشاء، PUT/PATCH للتعديل، DELETE للمسح."],
        ["header", "بيانات وصفية", "معلومات عن الطلب أو الرد: نوع المحتوى، الهوية، الكاش."],
        ["body", "المحتوى", "البيانات نفسها، غالبا JSON في الـ APIs."],
      ],
      focus: [{ label: "احفظها", text: "الـ URL بيقول «فين» (path + query)، والـ method بيقول «إيه العملية»، والـ status بيقول «نجحت ولا لأ وليه»." }],
    },
    {
      title: "الـ methods: safe و idempotent",
      en: "Safe and idempotent methods",
      body: "<p>مصطلحين لازم تفرق بينهم:</p><ul><li><b>Safe</b>: الطلب مبيغيرش حاجة على السيرفر (قراءة فقط).</li><li><b>Idempotent</b>: تكرار نفس الطلب مرة، 10 مرات، نتيجته على السيرفر زي مرة واحدة. ده بيهم لما الشبكة تقطع والتطبيق يعيد الطلب.</li></ul>",
      points: [
        "<code>GET</code>: safe و idempotent. بيقرا (قايمة، مورد واحد).",
        "<code>POST</code>: <b>مش</b> safe ولا idempotent. بيعمل مورد جديد، تكراره بيعمل نسخة تانية (إعلان مكرر!).",
        "<code>PUT</code>: idempotent. بيستبدل المورد كله بالمبعوت. نفس الـ PUT عشر مرات = نفس النتيجة.",
        "<code>PATCH</code>: تعديل جزئي. مش مضمون يكون idempotent (زي «زوّد السعر 1000»). لو بيحط قيمة محددة (<code>price = 900000</code>) بيبقى عمليا idempotent.",
        "<code>DELETE</code>: idempotent. مسحته مرة أو 5، النتيجة إنه مش موجود (الرد ممكن يتغير من 204 لـ 404).",
        "<code>HEAD</code> و <code>OPTIONS</code>: safe. الأول زي GET من غير body، والتاني بيسأل السيرفر إيه المسموح (وبيستخدمه المتصفح في CORS).",
      ],
      interview: [
        { q: "إيه الفرق بين PUT و PATCH و POST؟ وإيه معنى idempotent؟", a: "<code>POST</code> بينشئ مورد جديد وكل مرة بيعمل واحد جديد. <code>PUT</code> بيستبدل المورد كله بالنسخة المبعوتة. <code>PATCH</code> بيعدل حقول معينة بس. Idempotent معناها إن تكرار نفس الطلب ميغيرش النتيجة بعد أول مرة: PUT و DELETE و GET كده، و POST لأ. وده مهم في التطبيقات: لو الشبكة قطعت بعد POST مش عارف وصل ولا لأ، إعادته ممكن تعمل إعلان مكرر، فنحتاج idempotency key أو تحقق." },
      ],
    },
    {
      title: "Status codes: رقم يقولك إيه اللي حصل",
      en: "Status code families",
      body: "<p>أول رقم في الـ status بيقولك العيلة:</p>",
      points: [
        "<b>2xx نجاح</b>: <code>200 OK</code>، <code>201 Created</code> (اتعمل مورد جديد، مع <code>Location</code>)، <code>204 No Content</code> (نجح ومفيش body، شائع مع DELETE).",
        "<b>3xx إعادة توجيه / كاش</b>: <code>301</code> (انتقل نهائيا)، <code>302</code> (مؤقتا)، <code>304 Not Modified</code> (اللي عندك في الكاش لسه صالح).",
        "<b>4xx غلط من العميل</b>: <code>400 Bad Request</code> (طلب مش مفهوم)، <code>401 Unauthorized</code> (مش مسجّل دخول / التوكن ناقص أو غلط)، <code>403 Forbidden</code> (عارفك بس مش مسموحلك)، <code>404 Not Found</code>، <code>409 Conflict</code> (يتعارض مع الحالة الحالية، زي إيميل مكرر أو تعديل على نسخة قديمة)، <code>422</code> (الطلب مفهوم بس بياناته مرفوضة، زي validation. Laravel بيستخدمه)، <code>429 Too Many Requests</code> (rate limit).",
        "<b>5xx غلط من السيرفر</b>: <code>500</code> (خطأ غير متوقع في التطبيق)، <code>502 Bad Gateway</code> (البروكسي أو الـ load balancer جاله رد مش صالح من التطبيق)، <code>503 Service Unavailable</code> (السيرفر مش جاهز أو مشغول مؤقتا).",
      ],
      code: {
        lang: "json",
        title: "422 من Laravel عند فشل الـ validation",
        src: `{
  "message": "The price field is required.",
  "errors": {
    "price": ["The price field is required."]
  }
}`,
        note: "الشكل ده بيرجعه Laravel لوحده لما <code>validate()</code> تفشل في API request. التطبيق بيعرض كل رسالة جنب حقلها.",
      },
      pitfall: "401 و 403 بيتلخبطوا. <b>401</b>: «معرفش إنت مين» (سجل دخول). <b>403</b>: «عارفك لكن مش مسموحلك» (client بيحاول يمسح إعلان مكتب تاني). والغلط الشائع الأكبر: ترد 200 وفي الـ body <code>\"success\": false</code>. استخدم الـ status الصح.",
      interview: [
        { q: "إيه الفرق بين 401 و 403؟ و 400 و 422؟", a: "401 يعني الهوية مش متحققة (مفيش token أو منتهي)، والحل يسجل دخول. 403 يعني الهوية معروفة لكن مفيش صلاحية. 400 طلب غلط شكلا (JSON بايظ مثلا)، و 422 الطلب سليم شكلا لكن القيم مرفوضة بقواعد المشروع (price سالب) وده اللي بيستخدمه Laravel في الـ validation." },
      ],
    },
    {
      title: "Headers اللي تفرق + الكاش",
      en: "Content-Type, Accept, Authorization, Cache-Control, ETag",
      points: [
        "<code>Content-Type</code>: نوع الـ body اللي إنت بعتّه أو راجع (<code>application/json</code>). لو نسيته في POST بـ JSON، Laravel مش هيقرا الـ body صح.",
        "<code>Accept</code>: النوع اللي إنت عايزه في الرد. في Laravel، <code>Accept: application/json</code> بتخلي الأخطاء ترجع JSON مش صفحة HTML.",
        "<code>Authorization</code>: الهوية، شكلها <code>Bearer &lt;token&gt;</code>.",
        "<code>Cache-Control</code>: قواعد التخزين. <code>max-age=3600</code> يعني صالح ساعة من غير ما تسأل السيرفر. <code>no-store</code> يعني ممنوع يتخزن خالص (بيانات حساسة). <code>no-cache</code> يعني ممكن يتخزن لكن لازم تسأل السيرفر قبل ما تستخدمه (revalidate).",
        "<code>ETag</code>: بصمة لنسخة المورد. العميل بيرجع يبعتها في <code>If-None-Match</code>، فلو لسه زي ما هو السيرفر يرد <code>304 Not Modified</code> من غير body.",
      ],
      code: {
        lang: "bash",
        src: `curl -i https://api.example.com/api/v1/listings/15
# HTTP/1.1 200 OK
# ETag: "a1b2c3"
# Cache-Control: max-age=60

curl -i -H 'If-None-Match: "a1b2c3"' \\
  https://api.example.com/api/v1/listings/15
# HTTP/1.1 304 Not Modified`,
        note: "المثال توضيحي لشكل التبادل (مش ناتج تشغيل حقيقي): الـ 304 بيوفر نقل الـ body كله ولسه بيضمن إن العميل على آخر نسخة.",
      },
      focus: [{ label: "احفظها", text: "<code>no-cache</code> مش معناها «متخزنش»، معناها «اسأل قبل ما تستخدم». اللي معناها «متخزنش» هي <code>no-store</code>." }],
    },
    {
      title: "تصميم REST API",
      en: "Resources, nouns, filtering, pagination, versioning",
      body: "<p>REST أسلوب تصميم: بتفكر في «موارد» (resources) ليها عناوين، والـ HTTP method هو الفعل. القواعد العملية:</p>",
      points: [
        "<b>أسماء جمع، مش أفعال</b>: <code>/listings</code> مش <code>/getListings</code>. الفعل هو الـ method.",
        "<b>التداخل مستوى واحد</b>: <code>/offices/3/listings</code> إعلانات المكتب 3. أكتر من مستويين بيتعقد.",
        "<b>فلترة وترتيب بـ query string</b>: <code>?city=Riyadh&amp;status=active&amp;sort=-price</code>.",
        "<b>Pagination دايما</b> للقوايم: <code>?page=2&amp;per_page=20</code> (offset)، أو <code>?cursor=...</code> (cursor). الـ cursor أثبت لما الداتا بتتغير وأسرع على الصفحات البعيدة.",
        "<b>الـ versioning</b>: <code>/api/v1/...</code> أبسط طريقة، عشان تغير الشكل من غير ما تكسر تطبيقات قديمة (تطبيقات الموبايل المثبتة عند الناس مش بتتحدث فورا!).",
        "<b>أخطاء بشكل ثابت</b> ببنية JSON واحدة، و status صح.",
      ],
      code: {
        lang: "text",
        src: `GET    /api/v1/listings?city=Riyadh&sort=-price&page=2
GET    /api/v1/listings/15
POST   /api/v1/listings
PATCH  /api/v1/listings/15
DELETE /api/v1/listings/15
GET    /api/v1/offices/3/listings`,
        note: "أحيانا بنحتاج «فعل» مش CRUD (نشر إعلان). الحل العملي: اعتبره مورد فرعي: <code>POST /listings/15/publish</code>.",
      },
      interview: [
        { q: "صمم endpoints لإدارة الإعلانات. وإيه الـ pagination وإزاي تعمل versioning؟", a: "<code>GET /api/v1/listings</code> للقايمة (مع فلاتر وpagination)، <code>POST</code> للإنشاء، <code>GET/PATCH/DELETE /api/v1/listings/{id}</code>، و<code>GET /api/v1/offices/{id}/listings</code> لإعلانات مكتب. القوايم بتتقسم صفحات بـ page و per_page، أو cursor لو الداتا كبيرة ومتغيرة. الـ versioning في الـ path (<code>/v1</code>) عشان تطبيقات الموبايل القديمة تفضل شغالة لما أغير الشكل. والردود بـ status codes صحيحة وأخطاء JSON موحدة." },
      ],
    },
    {
      title: "Stateless والـ authentication: session ولا token",
      en: "Statelessness, sessions and bearer tokens",
      body: "<p>REST <b>stateless</b>: كل طلب لازم يحمل كل اللي السيرفر محتاجه ليفهمه (ومنها هوية المستخدم)، والسيرفر مبيحتفظش بحالة «المحادثة» بين طلبين. ده بيخلي أي سيرفر من 5 يرد على أي طلب، فسهل تكبّر بإضافة سيرفرات.</p>",
      points: [
        "<b>Session cookie</b>: بعد تسجيل الدخول السيرفر بيخزن session عنده (ملف أو DB أو Redis) ويبعت المتصفح cookie فيها رقم الجلسة. المتصفح بيبعتها تلقائيا مع كل طلب. مناسبة لمواقع الويب. محتاجة حماية من CSRF، وعلامات <code>HttpOnly</code> و <code>Secure</code> و <code>SameSite</code> على الـ cookie.",
        "<b>Bearer token</b>: بعد الدخول السيرفر يديك token، وإنت بتبعته في <code>Authorization: Bearer ...</code> في كل طلب. مفيش cookie تلقائية فمفيش CSRF بنفس الشكل. ده المناسب لتطبيقات الموبايل (Flutter) والـ SPAs.",
        "الـ token نوعين: <b>opaque</b> (نص عشوائي، السيرفر بيبحث عنه في الداتابيز، زي Laravel Sanctum) أو <b>self-contained</b> زي JWT (فيه البيانات وبيتحقق منه بتوقيع).",
      ],
      pitfall: "تخزين الـ token في مكان مكشوف. في الموبايل استخدم تخزين آمن (Keychain / Keystore عن طريق <code>flutter_secure_storage</code>) مش SharedPreferences. وفي المتصفح، لو حطيته في <code>localStorage</code> أي XSS يقدر يسرقه، والـ cookie الـ <code>HttpOnly</code> مبتتقراش من JavaScript.",
      interview: [
        { q: "إيه معنى إن REST stateless؟ وإيه الفرق بين session و token authentication؟", a: "Stateless يعني كل طلب بيحمل كل المعلومات اللازمة (منها الهوية)، والسيرفر مبيحفظش حالة جلسة بين الطلبات، فبسهولة أوزع الطلبات على سيرفرات كتير. في الـ session السيرفر بيحفظ الحالة والعميل بيحمل رقم الجلسة في cookie. في الـ token العميل بيبعت token في كل طلب في الـ Authorization header، والسيرفر بيتحقق منه (يبحث عنه أو يتحقق من توقيعه). الـ token أنسب للموبايل والـ APIs، والـ session cookie مريحة لمواقع الويب لكن محتاجة حماية CSRF." },
      ],
    },
    {
      title: "JWT و refresh token و OAuth2 في شريحة",
      en: "JWT structure, refresh tokens, OAuth2",
      body: "<p>الـ JWT نص من تلات أجزاء مفصولة بنقطة: <code>header.payload.signature</code>، كل جزء Base64URL.</p>",
      codes: [
        {
          lang: "text",
          title: "JWT (HS256) متفكك",
          src: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiI0MiIsInJvbGUiOiJjbGllbnQiLCJleHAiOjE4MDAwMDAwMDB9.
DoXRq2K-XtJI5ceU3PDf5tFm98i4OB9Px3lIqAvKAYU`,
          note: "الاتنين الأولانيين بيتفكوا بـ Base64URL.",
        },
        {
          lang: "json",
          title: "header ثم payload بعد الفك",
          src: `{"alg":"HS256","typ":"JWT"}
{"sub":"42","role":"client","exp":1800000000}`,
          note: "<code>sub</code> هوية المستخدم، <code>exp</code> وقت انتهاء بالثواني (Unix time). التوقيع هو HMAC-SHA256 لأول جزئين بمفتاح سري عند السيرفر.",
        },
      ],
      points: [
        "<b>مهم جدا</b>: الـ payload <b>متشفرش</b>، متسجّل بس. أي حد يقدر يقراه. متحطش فيه كلمة سر ولا بيانات حساسة. التوقيع بيضمن إنه مااتغيرش، مش إنه سري.",
        "<b>الميزة</b>: السيرفر يتحقق من غير ما يروح للداتابيز. <b>العيب</b>: صعب تلغيه قبل انتهاءه (لو اتسرق أو المستخدم اتحظر)، إلا لو عملت قائمة سودا في السيرفر، وبكده ضيعت جزء من الميزة.",
        "<b>الحل الشائع</b>: access token قصير العمر (مثلا 15 دقيقة) + <b>refresh token</b> طويل العمر (أيام) بيتخزن في السيرفر ويتجدد (rotation). لما الـ access ينتهي التطبيق يبعت الـ refresh ياخد access جديد من غير ما المستخدم يسجل تاني، ولو اتسرق الـ refresh نقدر نلغيه.",
        "<b>OAuth2</b>: بروتوكول تفويض. التطبيق (client) بياخد من authorization server (Google مثلا) access token بإذن المستخدم، يستخدمه على resource server. المستخدم بيدخل كلمة سره عند Google مش عند التطبيق. للموبايل والـ SPA بنستخدم Authorization Code flow مع PKCE. «Login with Google» هو OpenID Connect فوق OAuth2.",
      ],
      pitfall: "قبول أي <code>alg</code> مكتوب في الـ header. السيرفر لازم يحدد الخوارزمية اللي بيقبلها ويتحقق من التوقيع ومن <code>exp</code>، وميثقش في اللي مكتوب في الـ token نفسه.",
      interview: [
        { q: "إيه هو الـ JWT وإيه مميزاته وعيوبه؟ ولماذا refresh token؟", a: "JWT نص من 3 أجزاء: header و payload و signature. الـ payload فيه claims زي هوية المستخدم ووقت الانتهاء، والتوقيع بيضمن إن محدش عدّل فيه، لكنه مش مشفّر فمتحطش فيه أسرار. الميزة إن السيرفر يتحقق منه من غير ما يسأل الداتابيز. العيب إنه صعب يتلغى قبل انتهاءه. عشان كده بنخليه access token قصير العمر، ونعمل معاه refresh token طويل بنخزنه ونقدر نلغيه، فلو اتسرق access بيموت بسرعة." },
      ],
    },
    {
      title: "CORS و HTTPS",
      en: "CORS explained correctly",
      body: "<p>الـ <b>same-origin policy</b>: المتصفح بيمنع صفحة جاية من أصل (origin = بروتوكول + دومين + بورت) من قراءة ردود أصل تاني. <b>CORS</b> هو الطريقة اللي السيرفر بيقول بيها للمتصفح «أنا موافق إن الأصل ده يقرا ردودي».</p><p>النقاط اللي بتتغلط فيها:</p>",
      points: [
        "CORS <b>قاعدة بيطبقها المتصفح</b> مش السيرفر. السيرفر بيرد عادي، والمتصفح هو اللي يخفي الرد عن الـ JavaScript لو الـ headers مش مسموحة. عشان كده Postman و curl وتطبيق Flutter على الموبايل مبيتأثروش (فاشتغال الـ API من Postman مش معناه إنها هتشتغل من متصفح). لكن Flutter Web بيتأثر.",
        "CORS مش حماية للسيرفر من المهاجمين. هو حماية للمستخدم في المتصفح.",
        "<b>Preflight</b>: لطلبات «مش بسيطة» (PUT/DELETE، أو header زي <code>Authorization</code>، أو <code>Content-Type: application/json</code>) المتصفح الأول بيبعت <code>OPTIONS</code> يسأل «مسموح؟»، السيرفر يرد بـ <code>Access-Control-Allow-Origin</code> و <code>Access-Control-Allow-Methods</code> و <code>Access-Control-Allow-Headers</code>، وبعدها المتصفح يبعت الطلب الحقيقي.",
        "لو بتبعت cookies لازم <code>Access-Control-Allow-Credentials: true</code> ومينفعش <code>Allow-Origin: *</code> معاها، لازم origin محدد.",
        "<b>HTTPS</b> = HTTP فوق TLS: بيشفر الطلب والرد (محدش في الطريق يقرا الـ token)، وبيثبت هوية السيرفر بالشهادة، وبيمنع التعديل في الطريق. أي token أو كلمة سر على HTTP عادي = مكشوفة.",
      ],
      code: {
        lang: "text",
        title: "Preflight",
        src: `OPTIONS /api/v1/listings HTTP/1.1
Origin: https://web.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: authorization, content-type

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://web.example.com
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: authorization, content-type`,
      },
      interview: [
        { q: "إيه هو CORS ومين اللي بيطبقه؟ وإيه الـ preflight؟", a: "CORS آلية بتخلي السيرفر يحدد أنهي origins مسموح لها تقرا ردوده من JavaScript في المتصفح. اللي بيطبقها هو المتصفح مش السيرفر، عشان كده Postman والموبايل مبيتأثروش. لو الطلب غير بسيط (header زي Authorization، أو JSON، أو PUT/DELETE) المتصفح بيبعت طلب OPTIONS الأول (preflight) يسأل السيرفر هل الطلب ده مسموح، والسيرفر يرد بـ headers زي Access-Control-Allow-Origin. لو ردها مش مظبوط المتصفح بيمنع الطلب الحقيقي. الحل بيتظبط على السيرفر (في Laravel في config/cors.php)، مش في الكلاينت." },
      ],
    },
    {
      title: "Real-time: polling و WebSocket و SSE",
      en: "Polling vs WebSockets vs Server-Sent Events",
      body: "<p>HTTP العادي: العميل يسأل والسيرفر يرد. لو السيرفر عايز «يدفع» حاجة (رسالة جديدة، استفسار جديد على إعلان) فيه 3 اختيارات:</p>",
      points: [
        "<b>Polling</b>: التطبيق يسأل كل كام ثانية «فيه جديد؟». أبسط حاجة، بس بيستهلك طلبات كتير ومتأخر بمقدار الفاصل. <b>Long polling</b>: السيرفر يمسك الطلب مفتوح لحد ما يبقى فيه جديد.",
        "<b>WebSocket</b>: اتصال واحد مفتوح <b>في الاتجاهين</b> (بيبدأ بطلب HTTP Upgrade ورد <code>101 Switching Protocols</code>). مناسب للشات والألعاب والتتبع الحي. أصعب في الـ scaling لأن كل اتصال مفتوح بيستهلك موارد.",
        "<b>SSE (Server-Sent Events)</b>: اتصال HTTP مفتوح والسيرفر بيبعت events <b>في اتجاه واحد</b> بس (<code>text/event-stream</code>)، وبيعيد الاتصال تلقائيا. مناسب للإشعارات واللوحات الحية.",
        "في الموبايل لو التطبيق مقفول، مفيش ولا واحد منهم بيشتغل: بنستخدم push notifications (FCM / APNs).",
      ],
      focus: [{ label: "الاختيار", text: "محتاج اتجاهين وسرعة (شات)؟ WebSocket. السيرفر بس يبعت (إشعارات)؟ SSE. بسيط ومش لازم فوري؟ polling." }],
    },
    {
      title: "REST مقابل GraphQL",
      en: "REST vs GraphQL",
      body: "<p>في REST كل مورد له endpoint، والسيرفر هو اللي يحدد شكل الرد. المشكلتين: <b>over-fetching</b> (الرد فيه حقول مش محتاجها) و<b>under-fetching</b> (محتاج 3 طلبات عشان تجمع شاشة واحدة). <b>GraphQL</b> بيحلها: endpoint واحد (غالبا <code>POST /graphql</code>) والعميل بيكتب query بيحدد فيها الحقول بالظبط.</p>",
      code: {
        lang: "json",
        title: "طلب GraphQL (الـ body)",
        src: `{
  "query": "{ listing(id: 15) { title price office { name } } }"
}`,
        note: "طلب واحد بيجيب الإعلان ومكتبه بس بالحقول المطلوبة.",
      },
      points: [
        "<b>GraphQL أحسن في</b>: شاشات موبايل بتحتاج بيانات من أكتر من مورد، وفرق frontend كتير بتغير احتياجاتها.",
        "<b>تمنه</b>: الكاش على مستوى HTTP أصعب (كله POST على endpoint واحد)، والسيرفر لازم يحمي نفسه من queries ضخمة، والـ N+1 بيرجع في الـ resolvers، والتعلم أعلى.",
        "<b>REST أحسن في</b>: البساطة، كاش HTTP الجاهز، والأدوات المعروفة. وغالبية المشاريع (زي مشروعك) REST كفاية ومناسب.",
      ],
      interview: [
        { q: "إمتى تختار GraphQL بدل REST؟", a: "لما الـ clients (موبايل وويب) محتاجين أشكال مختلفة من نفس الداتا، وعايزين نتجنب over-fetching و under-fetching بطلب واحد مرن. بدفع تمن: تعقيد أكبر في السيرفر، كاش HTTP أصعب، ولازم أحمي من queries تقيلة وأحل N+1. لو الـ API بسيط ومعظم الشاشات واضحة، REST أبسط وأسهل في الكاش والمراقبة." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: GET بـ header",
      lang: "bash",
      code: `curl -i https://api.example.com/api/v1/listings \\
  -H 'Accept: application/json' \\
  -H 'Authorization: Bearer TOKEN'

curl -i https://api.example.com/api/v1/listings/15 \\
  -H 'Accept: application/json'`,
      note: "الـ <code>\\</code> في آخر السطر بتكمل الأمر على السطر اللي بعده.",
    },
    {
      title: "اكتب: POST بـ JSON",
      lang: "bash",
      code: `curl -X POST https://api.example.com/api/v1/listings \\
  -H 'Content-Type: application/json' \\
  -H 'Accept: application/json' \\
  -H 'Authorization: Bearer TOKEN' \\
  -d '{"title":"Villa Yasmin","price":1500000}'

curl -X DELETE https://api.example.com/api/v1/listings/15 \\
  -H 'Authorization: Bearer TOKEN'`,
    },
    {
      title: "اكتب: رد خطأ validation",
      lang: "json",
      code: `{
  "message": "The price field is required.",
  "errors": {
    "price": [
      "The price field is required."
    ],
    "city": [
      "The city field is required."
    ]
  }
}`,
    },
  ],

  tasks: [
    {
      title: "صمم endpoints",
      lang: "text",
      prompt: "<p>صمم الـ endpoints (method + path) للعمليات دي في API الإعلانات، بنسخة <code>v1</code>: (1) قايمة إعلانات الرياض النشطة مرتبة بالأرخص، الصفحة 3. (2) إنشاء إعلان. (3) تعديل سعر إعلان رقم 15 فقط. (4) مسح إعلان 15. (5) إعلانات المكتب رقم 3.</p>",
      hints: [
        "الأسماء جمع، والفلترة والترتيب والصفحة في query string.",
        "التعديل الجزئي method غير PUT.",
      ],
      solution: `GET    /api/v1/listings?city=Riyadh&status=active&sort=price&page=3
POST   /api/v1/listings
PATCH  /api/v1/listings/15
DELETE /api/v1/listings/15
GET    /api/v1/offices/3/listings`,
      explain: "<code>sort=price</code> تصاعدي (الأرخص أولا)، و<code>sort=-price</code> الأغلى. اختيار صيغة الـ sort اتفاق في الفريق. <code>PATCH</code> لتعديل جزئي مقابل <code>PUT</code> اللي بيستبدل المورد كله. الرد المتوقع: 200 للقراءة، 201 للإنشاء، 204 للمسح.",
    },
    {
      title: "اختار الـ status code",
      lang: "text",
      prompt: "<p>اكتب الـ status code الأنسب لكل حالة: (أ) إنشاء إعلان نجح. (ب) المستخدم مبعتش token. (ج) المستخدم عنده token بس بيحاول يمسح إعلان مكتب تاني. (د) السعر مبعوت سالب وفشل الـ validation. (هـ) التطبيق بعت أكتر من 60 طلب في الدقيقة والحد 60. (و) إعلان رقم 999 مش موجود. (ز) الـ Nginx مش قادر يوصل لتطبيق Laravel.</p>",
      hints: [
        "الفرق بين 401 و 403 هو «معرفش إنت مين» ضد «عارفك بس ممنوع».",
        "الـ validation في Laravel بيرجع كود معروف.",
      ],
      solution: `(a) 201 Created
(b) 401 Unauthorized
(c) 403 Forbidden
(d) 422 (validation; 400 also acceptable by some APIs)
(e) 429 Too Many Requests
(f) 404 Not Found
(g) 502 Bad Gateway (or 503 if the app is down for maintenance)`,
      explain: "401 للهوية الناقصة، 403 للصلاحية. الـ validation في Laravel بيرجع 422 افتراضيا. الـ 429 بتيجي غالبا مع header اسمه <code>Retry-After</code>. و502 لما البروكسي مش قادر ياخد رد صالح من التطبيق، 503 لو الخدمة غير متاحة مؤقتا.",
    },
    {
      title: "curl لإنشاء إعلان",
      lang: "bash",
      prompt: "<p>اكتب أمر <code>curl</code> بيعمل POST على <code>https://api.example.com/api/v1/listings</code> بجسم JSON فيه <code>title</code> بقيمة <code>Villa Yasmin</code> و<code>price</code> بقيمة <code>1500000</code>، ويبعت الـ token <code>TOKEN</code> كـ Bearer، ويطلب رد JSON، ويطبع الـ headers بتاعة الرد.</p>",
      hints: [
        "هتحتاج 3 headers: نوع المحتوى، النوع المطلوب، والهوية.",
        "الفلاج <code>-i</code> بيطبع الـ headers مع الرد.",
      ],
      solution: `curl -i -X POST https://api.example.com/api/v1/listings \\
  -H 'Content-Type: application/json' \\
  -H 'Accept: application/json' \\
  -H 'Authorization: Bearer TOKEN' \\
  -d '{"title":"Villa Yasmin","price":1500000}'`,
      explain: "<code>-d</code> لوحدها بتخلي curl يستخدم POST، فـ <code>-X POST</code> اختيارية هنا، لكن كتابتها بتوضح النية. من غير <code>Content-Type: application/json</code> الـ API ممكن مايقراش الـ body كـ JSON. الرد المتوقع <code>201 Created</code> مع <code>Location</code>.",
    },
  ],

  quiz: [
    {
      q: "أنهي method اللي تكراره بنفس الطلب 10 مرات بنفس النتيجة (idempotent) ويستبدل المورد كله؟",
      options: ["<code>POST</code>", "<code>PATCH</code> (دايما)", "<code>PUT</code>", "<code>CONNECT</code>"],
      answer: 2,
      why: "PUT بيستبدل المورد بالنسخة المبعوتة، فتكراره بيسيب نفس الحالة. POST بينشئ مورد جديد في كل مرة. PATCH ممكن يكون غير idempotent (زيادة قيمة).",
    },
    {
      q: "مستخدم مسجل دخول بشكل سليم، بس بيحاول يعدل إعلان تبع مكتب تاني. الرد الأنسب؟",
      options: ["403 Forbidden", "401 Unauthorized", "404 Not Found دايما", "500 Internal Server Error"],
      answer: 0,
      why: "السيرفر عارفه (فمش 401) لكن مفيش صلاحية: 403. (بعض الـ APIs بترد 404 عمدا عشان تخفي وجود المورد، لكن 403 هو الإجابة المباشرة.) والـ 500 معناه عطل في السيرفر مش خطأ صلاحيات.",
    },
    {
      q: "فرونت إند على <code>https://web.example.com</code> بيطلب API على <code>https://api.example.com</code> وطلعله خطأ CORS في الـ console. مين اللي منع الرد؟ وفين الحل؟",
      options: [
        "السيرفر رفض الطلب، والحل في كود الـ JavaScript",
        "الـ DNS، والحل نغير الدومين",
        "الـ firewall، والحل نفتح البورت",
        "المتصفح، والحل إن السيرفر يرد بـ headers <code>Access-Control-Allow-*</code> المناسبة",
      ],
      answer: 3,
      why: "السيرفر غالبا اتنفذ الطلب ورد، لكن المتصفح بيمنع الـ JavaScript من قراءة الرد لأن الـ headers مش بتسمح بالـ origin ده. الحل بيتظبط على السيرفر (في Laravel: config/cors.php). ومفيش طريقة تتخطاها من كود الـ frontend.",
    },
    {
      q: "قررنا نخزن <code>{\"sub\":\"42\",\"role\":\"client\",\"password\":\"123456\"}</code> جوه JWT عشان نوفر query. إيه المشكلة؟",
      options: [
        "الـ JWT بيقبل 2 claims بس",
        "الـ payload مش مشفّر، أي حد معاه الـ token يقدر يقراه",
        "التوقيع بيمنع القراءة فمفيش مشكلة",
        "الـ JWT لازم يكون كله أرقام",
      ],
      answer: 1,
      why: "الـ JWT موقّع مش مشفّر: الـ payload مجرد Base64URL ويتفك بسهولة. التوقيع بيمنع التعديل بس. فمنحطش فيه كلمات سر أو بيانات حساسة.",
    },
    {
      q: "إنشاء إعلان جديد نجح عن طريق POST. الـ status code المناسب (رقم)؟",
      answer: ["201"],
      why: "<code>201 Created</code> معناه إنه اتعمل مورد جديد، ومعاه عادة <code>Location</code> للمورد. 200 مقبولة لكن مش دقيقة.",
    },
    {
      q: "العميل بعت <code>If-None-Match</code> بقيمة الـ ETag اللي معاه، والمورد ما اتغيرش. السيرفر هيرد بـ:",
      options: ["200 OK مع الـ body كامل", "204 No Content", "304 Not Modified من غير body", "412 مع الـ body"],
      answer: 2,
      why: "الـ 304 معناه «اللي عندك في الكاش لسه صالح»، ومفيش body فبتوفر نقل البيانات. 204 معناها نجح ومفيش محتوى مش «ما اتغيرش».",
    },
    {
      q: "أنهي طلب <b>مش</b> idempotent؟",
      options: ["<code>GET /listings/15</code>", "<code>DELETE /listings/15</code>", "<code>PUT /listings/15</code> بنفس الجسم", "<code>POST /listings</code>"],
      answer: 3,
      why: "كل <code>POST /listings</code> بينشئ إعلان جديد، فتكراره بيعمل نسخ. GET و PUT و DELETE تكرارها بيسيب الحالة النهائية زي ما هي.",
    },
    {
      q: "الفرق بين <code>Cache-Control: no-cache</code> و <code>no-store</code>؟",
      options: [
        "نفس الشيء بأسماء مختلفة",
        "no-cache: ممكن يتخزن لكن لازم تسأل السيرفر قبل الاستخدام. no-store: ممنوع يتخزن",
        "no-cache: ممنوع يتخزن. no-store: يتخزن ويتحدث كل ساعة",
        "no-store بتشتغل على الصور بس",
      ],
      answer: 1,
      why: "<code>no-cache</code> اسمها مضلل: بتسمح بالتخزين مع revalidation في كل مرة (غالبا بـ ETag). <code>no-store</code> هي اللي بتمنع التخزين خالص، وبنستخدمها للبيانات الحساسة.",
    },
    {
      q: "أنهي طلب من المتصفح هيتعمله preflight (<code>OPTIONS</code>) قبل الطلب الحقيقي؟",
      options: [
        "<code>fetch</code> بـ <code>Authorization</code> header وبـ <code>Content-Type: application/json</code> لأصل تاني",
        "GET بسيط لصورة من أصل تاني",
        "أي طلب لنفس الأصل",
        "طلب من تطبيق Flutter على الموبايل",
      ],
      answer: 0,
      why: "الطلبات «غير البسيطة» (custom headers زي Authorization، أو JSON، أو methods زي PUT/DELETE) لأصل تاني بتعمل preflight. نفس الأصل مفيهوش CORS، والموبايل مفيهوش متصفح يطبق CORS.",
    },
    {
      q: "التطبيق بعت أكتر من الحد المسموح من الطلبات. الـ status code الأنسب (رقم)؟",
      answer: ["429"],
      why: "<code>429 Too Many Requests</code> هي كود الـ rate limiting، وبترجع غالبا مع <code>Retry-After</code> بيقول العميل يستنى قد إيه.",
    },
  ],
};
