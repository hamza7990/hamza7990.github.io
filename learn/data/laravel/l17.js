window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l17"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "الأمان مش feature: هو طبقات",
      en: "Security mindset",
      body: "<p>أي input جاي من برا (URL، body، header، ملف) ممكن يكون هجوم، وأي endpoint بيشوفه حد مش مفروض يشوفه. Laravel بتديك حماية جاهزة ضد أغلب الهجمات الشهيرة (OWASP Top 10)، بس كل حماية بتتكسر لو استخدمتها غلط. الإنترفيو بيسأل: «إيه الثغرات اللي ممكن تلاقيها في الكود ده؟» وبتشوف هل بتعرف الأمثلة الحقيقية.</p>",
      points: [
        "<b>Mass assignment:</b> <code>$fillable</code> + <code>validated()</code>، مش <code>$request-&gt;all()</code> (المستوى 3 و5).",
        "<b>SQL injection:</b> bindings دايما، مش دمج نصوص.",
        "<b>XSS:</b> <code>{{ }}</code> مش <code>{!! !!}</code> على بيانات المستخدم (المستوى 15).",
        "<b>CSRF:</b> <code>@csrf</code> في فورمز الـ web.",
        "<b>IDOR / authorization:</b> كل endpoint يتأكد إن المستخدم مسموح له بالمورد ده (المستوى 9).",
        "<b>الأسرار والإعدادات:</b> <code>.env</code> برا git و<code>APP_DEBUG=false</code>.",
        "<b>الاعتماديات:</b> تحديثات الأمان (<code>composer audit</code>).",
      ],
      interview: [
        { q: "إيه أهم ثغرات الويب اللي لازم تحمي منها تطبيق Laravel؟", a: "الـ mass assignment، والـ SQL injection، والـ XSS، والـ CSRF، والـ IDOR أو نقص الـ authorization. Laravel بتحمي افتراضيا من أغلبهم: <code>$fillable</code> وbindings في الـ query builder وescape في Blade وCSRF middleware. شغلي إني ما أكسرش الحماية دي: ما أستخدمش <code>$request->all()</code>، ولا أدمج مدخلات في SQL، ولا <code>{!! !!}</code> على داتا مستخدم، وأحط authorization على كل endpoint." },
      ],
    },
    {
      title: "SQL injection: الـ bindings",
      en: "SQL injection",
      body: "<p>الهجوم إن المستخدم يكتب SQL جوه مدخل، فلو دمجته في نص الـ query بيتنفذ كأمر. الحماية: <b>الـ bindings</b>: بتبعت الـ SQL بعلامات <code>?</code> والقيم منفصلة، فالداتابيز تعتبر القيمة بيانات مهما كان فيها. Eloquent والـ query builder بيعملوا كده تلقائي. الخطر بيجي لما تكتب SQL خام.</p>",
      codes: [
        {
          lang: "php",
          title: "vulnerable",
          src: `<?php

$evil = "x' OR '1'='1";

DB::select("select * from listings where title = '$evil'");
// -> where title = 'x' OR '1'='1'   returns EVERY row

Listing::whereRaw("title = '$evil'")->get();   // same hole`,
        },
        {
          lang: "php",
          title: "safe",
          src: `<?php

DB::select('select * from listings where title = ?', [$evil]);
DB::select('select * from listings where title = :t', ['t' => $evil]);
Listing::where('title', $evil)->get();                  // bindings built in
Listing::whereRaw('price > ?', [$min])->get();          // raw WITH bindings

// column names cannot be bound -> whitelist them
$sort = in_array($request->query('sort'), ['price', 'created_at'], true)
    ? $request->query('sort')
    : 'created_at';
Listing::orderBy($sort)->get();`,
          note: "جربتها على داتا فيها 3 إعلانات: النسخة المدموجة رجّعت 3 صفوف (الهجوم نجح)، والنسخ بـ bindings رجّعت 0 (القيمة اتعاملت كنص عادي)، وأي <code>orderBy</code> بعد whitelist ما أثرتش على الجدول لما بعتّ <code>sort=price;drop table listings</code>.",
        },
      ],
      pitfall: "الـ binding بيحمي <b>القيم</b> بس، مش أسماء الأعمدة والجداول ولا اتجاه الترتيب (<code>asc</code>/<code>desc</code>). لو بتاخد اسم عمود من المستخدم (<code>orderBy($request->sort)</code>) لازم whitelist. وكمان <code>DB::raw()</code> و<code>selectRaw()</code> و<code>orderByRaw()</code> نفس القاعدة: أي مدخل جواهم لازم يتبعت كـ binding.",
      interview: [
        { q: "إزاي تحمي من SQL injection في Laravel؟", a: "باستخدام الـ query builder أو Eloquent اللي بيستخدموا PDO prepared statements: القيم بتتبعت منفصلة عن نص الـ SQL كـ bindings فالداتابيز تعاملها كبيانات. لو كتبت SQL خام (<code>DB::select</code> أو <code>whereRaw</code>) بكتب <code>?</code> وبمرر القيم في array تاني، مش بدمج المتغيرات في النص. وأسماء الأعمدة اللي بتيجي من المستخدم (sort) بعملها whitelist لأن الـ bindings ما تنفعش معاها." },
      ],
    },
    {
      title: "XSS و CSRF في Laravel: الحماية الافتراضية وإزاي بتتكسر",
      en: "XSS and CSRF",
      body: "<p>الاتنين اتشرحوا في المستوى 15، دي الخلاصة اللي بتتسأل عنها (والفرق بينهم مهم):</p>",
      points: [
        "<b>XSS (Cross-Site Scripting):</b> المهاجم يحقن JavaScript في صفحة بيشوفها ضحية (في وصف إعلان مثلا)، فينفذ بصلاحية الضحية ويسرق الجلسة أو يعمل أفعال. الحماية: <code>{{ }}</code> بتعمل escape. بتتكسر بـ <code>{!! !!}</code> أو بدمج بيانات في <code>&lt;script&gt;</code> أو في attribute من غير <code>@json</code> أو escape.",
        "<b>CSRF (Cross-Site Request Forgery):</b> موقع خبيث يخلي متصفح الضحية (المسجل عندك) يبعت POST لموقعك، والمتصفح بيبعت الـ cookie لوحده. الحماية: token عشوائي (<code>@csrf</code>) بيتحقق منه middleware في group الـ web. الـ API بـ Bearer token (Sanctum) مش معرّضة لـ CSRF لأن التوكن بيتبعت يدويا مش تلقائي.",
        "الفرق: XSS = كود خبيث <b>بيشتغل عندك</b> في صفحتك. CSRF = ريكويست خبيث <b>بيتبعت لك</b> من برا بهوية الضحية.",
        "حماية إضافية: cookies بـ <code>HttpOnly</code> و<code>SameSite</code> (الافتراضي Laravel)، وCSP header.",
      ],
      code: {
        lang: "blade",
        src: `{{-- safe: the script tag is shown as text --}}
<p>{{ $listing->description }}</p>

{{-- DANGEROUS if description comes from users --}}
<p>{!! $listing->description !!}</p>

{{-- safe way to hand data to JavaScript --}}
<script>const listing = @json($listing->only('id', 'title'));</script>`,
        note: "جربت: نص <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> طلع escaped مع <code>{{ }}</code> وخام مع <code>{!! !!}</code>.",
      },
      pitfall: "استثناء route من CSRF (<code>$middleware-&gt;validateCsrfTokens(except: ['webhook/*'])</code>) للـ webhooks مقبول، بس لازم تتأكد من توقيع الـ webhook بنفسك بدل ما تسيبه من غير تحقق.",
      interview: [
        { q: "إيه الفرق بين XSS و CSRF؟", a: "الـ XSS إن مهاجم يحقن JavaScript في صفحتي فينفذ في متصفح المستخدم بصلاحياته؛ بحميها بـ escape للمخرجات (<code>{{ }}</code> في Blade) وتجنب <code>{!! !!}</code>. الـ CSRF إن موقع تاني يخلي متصفح المستخدم المسجل يبعت ريكويست لموقعي مستغلا الـ cookie؛ بحميها بـ token عشوائي لكل session (<code>@csrf</code>) بيتحقق منه middleware. الأول عن ما بيتعرض للمستخدم، والتاني عن ما بيتقبل من المتصفح." },
      ],
    },
    {
      title: "IDOR والـ authorization على كل endpoint",
      en: "IDOR and authorization",
      body: "<p><b>IDOR</b> (Insecure Direct Object Reference): endpoint بياخد id (<code>/api/inquiries/57</code>) والكود مبيتأكدش إن الـ 57 تخص المستخدم. المهاجم يجرب 58 و59 ويشوف داتا الناس. ده من أشهر الثغرات الحقيقية، وأي endpoint فيه id لازم يتأكد من الملكية. الـ authentication («إنت مين؟») مش كفاية، لازم authorization («مسموح لك؟»).</p>",
      codes: [
        {
          lang: "php",
          title: "vulnerable: any logged-in user can read any inquiry",
          src: `<?php

public function show(int $id): JsonResponse
{
    return response()->json(Inquiry::findOrFail($id));
}`,
        },
        {
          lang: "php",
          title: "fixed: scope the query to the user's office",
          src: `<?php

public function show(Request $request, int $id): JsonResponse
{
    $inquiry = Inquiry::whereHas('listing', function ($q) use ($request) {
        $q->where('office_id', $request->user()->office_id);
    })->findOrFail($id);          // someone else's id -> 404

    return response()->json($inquiry);
}

// or with a policy (403 instead of 404)
public function showWithPolicy(Inquiry $inquiry): JsonResponse
{
    Gate::authorize('view', $inquiry);
    return response()->json($inquiry);
}`,
          note: "جربت النسخة المقيدة بالمكتب: استفسار مكتبي رجع 200، واستفسار مكتب تاني رجع 404. الـ 404 بيخبي حتى وجود المورد، والـ 403 بتؤكد وجوده. اختار حسب الحساسية.",
        },
      ],
      focus: [{ label: "احفظها", text: "كل endpoint فيه id أو بيرجع داتا: اسأل «لو مستخدم تاني بعت id ده، إيه اللي هيحصل؟». وتست بيثبت إن مستخدم من مكتب تاني بياخد 403 أو 404 (المستوى 16)." }],
      pitfall: "الـ ids المتسلسلة (1, 2, 3) بتسهّل التخمين، لكن استخدام UUID <b>مش حماية</b>: ده يصعّب التخمين بس مش بيغني عن الـ authorization. وكمان متعتمدش على إخفاء الزرار في الواجهة؛ الـ API لازم تتأكد دايما (الواجهة ممكن تتتخطى بـ curl).",
      interview: [
        { q: "إيه هو IDOR وإزاي تمنعه؟", a: "ثغرة إن endpoint يقبل id لمورد (استفسار، عقد) ويرجّعه من غير ما يتأكد إنه يخص المستخدم، فأي مستخدم مسجل يغيّر الرقم ويشوف داتا غيره. بمنعه بـ authorization على كل endpoint: policy (<code>Gate::authorize</code>) أو تقييد الـ query بالمالك (<code>whereHas</code> أو علاقة المستخدم)، وبكتب تست بمستخدم من مكتب تاني يتأكد إنه بيتمنع. الـ UUID لا يغني عن ده." },
      ],
    },
    {
      title: "حماية البيانات الحساسة: الاستجابات والملفات",
      en: "Hiding sensitive data",
      body: "<p>أي حاجة بترجعها في JSON ممكن حد يشوفها. ثلاث نقاط:</p>",
      points: [
        "<b>الأعمدة الحساسة:</b> <code>protected $hidden = ['password', 'remember_token']</code> في الموديل بتخفيها من <code>toArray</code> و<code>toJson</code> (موجودة في الـ User الافتراضي). وللتحكم الكامل ارجع <b>API Resource</b> (المستوى 8) بحقول محددة بدل الموديل.",
        "<b>الباسوردات:</b> cast <code>'hashed'</code> أو <code>Hash::make()</code>، ومتخزنهاش خام ولا تسجلها في logs.",
        "<b>رفع الملفات:</b> فاليديشن النوع والحجم والأبعاد، واسم هاش، والملفات الخاصة على disk خاص (المستوى 14).",
        "<b>Rate limiting</b> على login والاستفسارات (المستوى 13) ضد brute force والسبام.",
        "<b>الرسائل:</b> متقولش «الإيميل ده مش مسجل» في login (تسرّب مين عندك)؛ رسالة عامة «بيانات غلط».",
      ],
      code: {
        lang: "php",
        src: `<?php

$user = User::factory()->create();

$user->toArray();                       // no 'password' key ($hidden)
$user->makeVisible('password')->toArray();   // only if you really need it

Log::info('login', ['user_id' => $user->id]);   // an id, never the password`,
        note: "جربت: <code>toArray()</code> ما فيهاش <code>password</code>، و<code>makeVisible('password')</code> رجّعتها. فكر في <code>$hidden</code> كشبكة أمان، مش بديل عن Resources.",
      },
      pitfall: "تسجيل <code>$request-&gt;all()</code> في الـ logs بيكتب الباسوردات والتوكنز في ملف نصي. سجّل ids وأسماء أحداث، مش الـ payload الكامل.",
    },
    {
      title: ".env والأسرار و APP_DEBUG و HTTPS",
      en: "Secrets, debug mode and HTTPS",
      body: "<p>الـ <code>.env</code> فيه مفاتيح قاعدة البيانات والـ API keys و<code>APP_KEY</code> (اللي بيشفّر الـ cookies والـ sessions). ثلاث قواعد:</p>",
      points: [
        "<b>.env مش في git أبدا</b>: موجود في <code>.gitignore</code> (تأكدت إنه فيه). بتحط <code>.env.example</code> بقيم فاضية. لو اترفع بالغلط: امسحه من التاريخ <b>و</b> غيّر كل الأسرار (اعتبرها اتسربت).",
        "<b>الـ web root هو <code>public/</code></b> فقط. لو الدومين بيشاور على جذر المشروع، <code>.env</code> ممكن يتحمّل من المتصفح.",
        "<b>APP_DEBUG=false في production.</b> مع <code>true</code> أي exception بيعرض stack trace بمسارات الملفات وكود وأحيانا قيم من الإعدادات والـ env (صفحة الـ debug).",
        "<b>HTTPS:</b> كل حاجة على TLS. ومعاه header اسمه HSTS (<code>Strict-Transport-Security</code>) يخلي المتصفح يرفض HTTP تماما للدومين. بتضبطه في الويب سيرفر (nginx) عادة. وخلف load balancer اضبط <code>trustProxies</code> فتتعرف Laravel على HTTPS.",
        "<code>APP_ENV=production</code>. وما تغيّرش <code>APP_KEY</code> بعد ما يبقى فيه sessions أو بيانات مشفرة (هتبوّظها).",
      ],
      code: {
        lang: "bash",
        src: `# .gitignore (already in a fresh Laravel project)
.env
.env.backup
.env.production

# production .env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://app.example.com`,
        note: "جربت الفرق: route بيرمي exception برسالة سرية. مع <code>APP_DEBUG=true</code> الرد JSON رجّع <code>message</code> بالرسالة السرية و<code>exception</code> و<code>file</code> و<code>line</code> و<code>trace</code>. مع <code>false</code> رجّع <code>{\"message\": \"Server Error\"}</code> بس.",
      },
      interview: [
        { q: "ليه لازم <code>APP_DEBUG=false</code> في production؟", a: "لأن وضع الـ debug بيعرض لأي مستخدم عند أي خطأ stack trace كامل: مسارات الملفات، أجزاء من الكود، استعلامات SQL، وأحيانا قيم من الإعدادات. ده معلومات ثمينة للمهاجم وتسريب أسرار محتمل. مع <code>false</code> المستخدم بيشوف «Server Error» عامة، والتفاصيل بتتسجل في <code>storage/logs</code> أنا بس اللي بشوفها." },
      ],
    },
    {
      title: "قايمة النشر (deploy checklist)",
      en: "Deploy checklist",
      body: "<p>النشر مش بس «ارفع الملفات». ترتيب ثابت بتعمله كل مرة، والأفضل تتحول لسكريبت:</p>",
      code: {
        lang: "bash",
        title: "deploy.sh (run from the project folder)",
        src: `set -e                                   # stop at the first error

git pull origin main

composer install --no-dev --optimize-autoloader --no-interaction

php artisan migrate --force              # no prompt in production
php artisan optimize                     # config + events + routes + views
php artisan storage:link                 # first deploy only (idempotent)
php artisan queue:restart                # workers reload the new code

# then reload php-fpm so OPcache picks up the new files`,
        note: "جربت <code>optimize</code> وطلع فعلا يبني الأربعة: config و events و routes و views، و<code>optimize:clear</code> يمسحهم (ويمسح كمان كاش التطبيق، فمتناديهوش بالغلط على production شغال). وجربت <code>bash -n</code> على السكريبت للتأكد من الـ syntax.",
      },
      points: [
        "<code>--no-dev</code>: من غير حزم التطوير (PHPUnit, Faker). أسرع وأأمن، بس لو seeder بيستخدم <code>fake()</code> في production هيقع.",
        "<code>--optimize-autoloader</code>: ملف classmap جاهز فتحميل الكلاسات أسرع.",
        "<code>migrate --force</code>: من غير <code>--force</code> الأمر بيسألك تأكيد في production وبيعلّق السكريبت.",
        "<code>queue:restart</code>: الـ workers شغالين بنسخة الكود القديمة في الذاكرة؛ الأمر بيخليهم يخرجوا بعد الـ job الحالي ويبدأوا بالجديد (Supervisor يعيد تشغيلهم).",
      ],
      pitfall: "بعد <code>config:cache</code> (جزء من <code>optimize</code>) ملف <code>.env</code> مبيتقراش، فأي <code>env('X')</code> برا ملفات <code>config/</code> بيرجّع <code>null</code>. جربتها: بعد <code>config:cache</code> رجّعت <code>env('APP_NAME')</code> الـ <code>null</code> و<code>config('app.name')</code> رجّعت <code>Laravel</code>. القاعدة: <code>env()</code> جوه config بس. وأي تعديل في <code>.env</code> بعد كده محتاج إعادة <code>config:cache</code>.",
      interview: [
        { q: "إيه الخطوات اللي بتعملها وإنت بتنشر تطبيق Laravel على production؟", a: "أسحب الكود، وأعمل <code>composer install --no-dev --optimize-autoloader</code>، وأشغّل <code>php artisan migrate --force</code> (بعد backup للداتابيز)، وأعمل cache للإعدادات والـ routes والـ views بـ <code>php artisan optimize</code>، و<code>storage:link</code> أول مرة، و<code>queue:restart</code> عشان الـ workers تاخد الكود الجديد، وأعمل reload لـ php-fpm. وأتأكد إن <code>APP_DEBUG=false</code> والـ .env مضبوط. وأنتبه لـ <code>env()</code> برا ملفات config لأنها بترجع null بعد config:cache." },
      ],
    },
    {
      title: "النشر بدون توقف، والـ backups، والـ maintenance mode",
      en: "Zero-downtime, backups and maintenance mode",
      body: "<p>الطريقة البسيطة (git pull على نفس الفولدر) فيها نافذة بتبقى فيها الملفات نص قديمة ونص جديدة. الفكرة الأشيك: <b>release folders + symlink</b>. كل نشر في فولدر جديد بتجهزه بالكامل (composer، build) وبعدين بتبدّل رابط <code>current</code> في خطوة واحدة.</p>",
      code: {
        lang: "bash",
        title: "layout and the switch",
        src: `/var/www/app/
  releases/20261110-1200/    # old, kept for rollback
  releases/20261110-1530/    # new, fully prepared
  shared/.env                # linked into every release
  shared/storage/            # logs, uploads: NOT per release
  current -> releases/20261110-1530      # nginx root: current/public

# prepare the new release, then switch atomically
ln -s /var/www/app/releases/20261110-1530 /var/www/app/current.tmp
mv -Tf /var/www/app/current.tmp /var/www/app/current

# rollback = point current back to the previous release folder`,
      },
      points: [
        "الـ <code>.env</code> والـ <code>storage</code> (الملفات المرفوعة واللوجز) في <code>shared</code> ومربوطين بكل release، عشان ميتفقدوش مع كل نشر.",
        "أدوات جاهزة بتعمل ده: Deployer أو Laravel Envoyer، أو CI/CD بتكتبه.",
        "<b>الـ migrations لازم تكون متوافقة مع الكود القديم والجديد</b> أثناء النشر (أضف عمود nullable أولا، وامسح القديم في نشر لاحق).",
        "<b>Backup قبل الـ migrate</b>: <code>mysqldump</code> أو <code>pg_dump</code>. الـ <code>migrate:rollback</code> مش backup (ما يرجعش داتا اتمسحت). و<code>migrate:fresh</code> يمسح كل الجداول: ممنوع على production (ولو عايز تمنعه: <code>DB::prohibitDestructiveCommands(app()-&gt;isProduction())</code> في الـ AppServiceProvider).",
        "<b>Maintenance mode:</b> <code>php artisan down</code> يرد 503 للزوار. <code>--retry=60</code> يحط header <code>Retry-After</code>، و<code>--secret=كلمة</code> يخليك تدخل بنفسك عن <code>/كلمة</code> وانت مفعّل المود، و<code>--render</code> لقالب مخصص. و<code>php artisan up</code> يفتح. جربتها: ظهر «Application is now in maintenance mode» ورابط الـ secret، وبعد <code>up</code> رجع «live».",
      ],
      pitfall: "الـ symlink لازم يتبدّل بشكل atomic (<code>mv -T</code> على رابط مؤقت)، وبعدها اعمل reload لـ php-fpm لأن OPcache ممكن يفضل مكاشّي مسارات الـ release القديم. ومتحطش الـ <code>storage</code> جوه الـ release وإلا الملفات المرفوعة تختفي مع كل نشر.",
    },
    {
      title: "اللوجز: تدور فين لما حاجة تقع",
      en: "Logs",
      body: "<p>لما production يرمي 500، المستخدم يشوف رسالة عامة، والتفاصيل في اللوج. الافتراضي ملف <code>storage/logs/laravel.log</code> (لازم الفولدر يكون قابل للكتابة من مستخدم الويب سيرفر، وإلا ما يتسجلش حاجة ويبان 500 غريب). الإعداد في <code>config/logging.php</code> و<code>.env</code>:</p>",
      points: [
        "<code>LOG_CHANNEL=stack</code> بيجمّع قنوات، و<code>LOG_STACK=single</code> (ملف واحد). القنوات الجاهزة: <code>single</code>، و<code>daily</code> (ملف لكل يوم ويتمسح بعد <code>LOG_DAILY_DAYS</code> افتراضي 14 يوم)، و<code>stderr</code> (للـ containers)، و<code>slack</code>، و<code>syslog</code>.",
        "<code>LOG_LEVEL</code>: debug أدنى مستوى بيتسجل. في production خليها <code>warning</code> أو <code>error</code> فاللوج ميكبرش.",
        "<code>Log::info('msg', ['user_id' => 1])</code> و<code>Log::warning</code> و<code>Log::error</code>. السياق (context) بيتكتب JSON جنب الرسالة.",
        "ابحث بـ <code>tail -f storage/logs/laravel.log</code> أو <code>grep ERROR</code>. وفي الـ queue: جدول <code>failed_jobs</code> و<code>queue:failed</code> (المستوى 12).",
      ],
      code: {
        lang: "php",
        src: `<?php

use Illuminate\\Support\\Facades\\Log;

Log::info('listing published', ['listing_id' => $listing->id]);
Log::warning('geocoder is slow', ['ms' => 4200]);
Log::error('payment failed', ['order_id' => 77, 'reason' => $e->getMessage()]);

// a specific channel
Log::channel('daily')->info('nightly import finished');`,
        note: "جربت <code>Log::info('hello', ['user_id' => 1])</code>: ظهر في الملف بالشكل <code>testing.INFO: hello {\"user_id\":1}</code>.",
      },
      pitfall: "لوج ملفات على سيرفر واحد بيكبر لحد ما يملا الـ disk لو مفيش rotation: استخدم <code>daily</code> أو logrotate. وفي أكتر من سيرفر، اللوج لازم يتجمع في مكان مركزي (خدمة log) وإلا هتدور على الخطأ في السيرفر الغلط.",
    },
    {
      title: "تحديث الاعتماديات وانتهاء دعم الأمان",
      en: "Dependencies and end of security support",
      body: "<p>تطبيقك هو كودك + مئات الحزم (<code>vendor/</code>). ثغرة في أي واحدة ثغرة عندك. <code>composer audit</code> بيقارن النسخ المثبتة في <code>composer.lock</code> بقاعدة بيانات الثغرات المعروفة وبيطبع اللي متأثر وإيه النسخة المصلّحة. بتشغّله في الـ CI وبشكل دوري، و<code>composer update</code> (أو <code>composer outdated</code> تشوف اللي قديم) للتحديثات.</p>",
      points: [
        "<b>نسخ الـ framework لها عمر:</b> كل major version بتاخد فترة bug fixes (حوالي 18 شهر) وبعدها فترة security fixes فقط (لحد حوالي سنتين من الإصدار). بعد كده <b>end of security support</b>: لو اتكتشفت ثغرة جديدة <b>مفيش حد هيصلحها في النسخة دي</b>، وبتفضل مفتوحة عندك لحد ما تعمل upgrade لنسخة مدعومة.",
        "نفس الفكرة لنسخة PHP نفسها (8.1 مثلا انتهى دعمها). فالنسخة اللي على السيرفر لازم تكون مدعومة.",
        "جدول الدعم الحالي موجود في توثيق Laravel (صفحة Release Notes / Support Policy)؛ تواريخه بتتغير فراجعه، ومتحفظش أرقام.",
        "ترقيت نسخة كبيرة بتتعمل على مراحل: اقرأ upgrade guide، شغّل التستات (دي ميزة وجودها!)، جرب على staging.",
      ],
      code: {
        lang: "bash",
        src: `composer audit              # known vulnerabilities in installed versions
composer audit --format=json
composer outdated           # what has newer versions
composer update vendor/pkg  # update one package (read its changelog)

# in CI: fail the build when an advisory exists
composer audit || exit 1`,
        note: "شغّلت <code>composer audit</code> على مشروع التجربة (Laravel 11.57.1): رجّع 5 تحذيرات على <code>laravel/framework</code> بدرجات منخفضة لعالية (منها تجاوز authentication في الـ TokenGuard وCRLF injection في قاعدة email). ولاحظ النقطة المهمة: الإصدارات المصلّحة المكتوبة كلها في الفرعين 12.x و13.x، ومفيش نسخة مصلّحة في 11.x. ده بالظبط معنى «انتهاء دعم الأمان» عمليا: الحل الوحيد ترقية الإصدار الرئيسي. الأرقام دي بتتغير مع الوقت.",
      },
      pitfall: "ترك <code>composer.lock</code> برا git أو عمل <code>composer update</code> مباشرة على السيرفر بيخلي الإنتاج يختلف عن اللي اتجرّب. الـ lock يتحط في git، والنشر بـ <code>composer install</code> (مش update) فيثبت نفس النسخ بالظبط.",
      interview: [
        { q: "إيه معنى «end of security support» لإصدار Laravel، وإيه المفروض تعمله؟", a: "معناها إن فريق Laravel بطّل ينزل تصليحات أمان لإصدار الـ major ده. لو اتكتشفت ثغرة جديدة (مثلا في الـ authentication)، الإصلاح بينزل في الإصدارات المدعومة بس، ومشروعي على النسخة القديمة يفضل مكشوف. المفروض أتابع جدول الدعم، أشغّل <code>composer audit</code> في الـ CI، وأخطط ترقية قبل ما الدعم ينتهي، بالاعتماد على الاختبارات عشان الترقية تكون آمنة." },
        { q: "ليه بنشر بـ <code>composer install</code> وليس <code>composer update</code>؟", a: "لأن <code>install</code> بيثبت النسخ الموجودة في <code>composer.lock</code> بالظبط، فالإنتاج بيشتغل بنفس الحزم اللي اتجربت في التطوير والاختبارات. أما <code>update</code> بيحدّث لأحدث نسخ مسموحة ويغيّر الـ lock، فممكن ينزل نسخة بتكسر حاجة أو نسخة لسه ما اتجربتش. التحديث قرار واعي في بيئة التطوير مع اختبارات." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: استعلامات آمنة بـ bindings",
      lang: "php",
      code: `<?php

$rows = DB::select(
    'select * from listings where title = ? and price > ?',
    [$title, $min]
);

$count = Listing::whereRaw('price > ?', [$min])->count();

$one = Listing::where('title', $title)->first();`,
    },
    {
      title: "اكتب: سكريبت النشر",
      lang: "bash",
      code: `set -e

git pull origin main
composer install --no-dev --optimize-autoloader --no-interaction

php artisan migrate --force
php artisan optimize
php artisan storage:link
php artisan queue:restart`,
    },
    {
      title: "اكتب: endpoint مقيّد بالمكتب",
      lang: "php",
      code: `<?php

public function show(Request $request, int $id): JsonResponse
{
    $office = $request->user()->office_id;

    $inquiry = Inquiry::whereHas('listing', fn ($q) =>
        $q->where('office_id', $office)
    )->findOrFail($id);

    return response()->json($inquiry);
}`,
    },
  ],

  tasks: [
    {
      title: "صلّح SQL injection والترتيب",
      lang: "php",
      prompt: "<p>الـ endpoint ده بيبحث في الإعلانات بعنوان وبيرتب بعمود المستخدم. فيه ثغرتين. اكتب نسخة آمنة <code>search(Request $request)</code>: بحث <code>LIKE</code> في <code>title</code> بالـ binding، والترتيب بـ whitelist (<code>price</code> أو <code>created_at</code>، والافتراضي <code>created_at</code>)، وحد أقصى 50 نتيجة.</p><pre dir='ltr'><code>public function search(Request $request)\n{\n    $q = $request-&gt;query('q');\n    $sort = $request-&gt;query('sort', 'price');\n    return DB::select(\n        \"select * from listings where title like '%$q%' order by $sort\"\n    );\n}</code></pre>",
      hints: [
        "الـ Eloquent: <code>Listing::where('title', 'like', '%'.$q.'%')</code>. القيمة بتتبعت binding.",
        "اسم العمود مش بيتعمله binding: <code>in_array($sort, ['price', 'created_at'], true)</code>.",
      ],
      solution: `<?php

public function search(Request $request)
{
    $q = (string) $request->query('q', '');
    $sort = $request->query('sort');
    $column = in_array($sort, ['price', 'created_at'], true)
        ? $sort
        : 'created_at';

    return Listing::where('title', 'like', '%'.$q.'%')
        ->orderBy($column)
        ->limit(50)
        ->get();
}`,
      explain: "القيمة <code>$q</code> بقت binding فالداتابيز بتعاملها بيانات. اسم العمود مش ممكن يتعمله binding، فعملنا whitelist بمقارنة صارمة (<code>true</code>) وافتراضي آمن. اتجربت: <code>q=x' OR '1'='1&sort=price;drop</code> رجّع 0 نتيجة وما أثرش على الجدول. ملحوظة: علامات <code>%</code> و<code>_</code> اللي يكتبها المستخدم بتشتغل كـ wildcards في LIKE (مش خطر أمني لكن ممكن تبطّئ).",
    },
    {
      title: "صلّح IDOR في endpoint الاستفسارات",
      lang: "php",
      prompt: "<p>الـ endpoint <code>GET /api/inquiries/{id}</code> وراه <code>auth:sanctum</code> لكن بيرجّع أي استفسار لأي مستخدم مسجل. عدّل الـ controller: المستخدم يشوف بس استفسارات إعلانات <b>مكتبه</b> (<code>users.office_id</code> = <code>listings.office_id</code>)، وأي id تاني يرجع 404. واكتب في تعليق إزاي الـ policy بديل (403).</p>",
      hints: [
        "<code>Inquiry::whereHas('listing', fn ($q) =&gt; $q-&gt;where('office_id', ...))</code>.",
        "<code>findOrFail($id)</code> بتحول لـ 404 تلقائي.",
      ],
      solution: `<?php

public function show(Request $request, int $id): JsonResponse
{
    $inquiry = Inquiry::whereHas('listing', function ($q) use ($request) {
        $q->where('office_id', $request->user()->office_id);
    })->findOrFail($id);

    return response()->json($inquiry);
}

// policy alternative (403 for foreign ids):
//   $inquiry = Inquiry::findOrFail($id);
//   Gate::authorize('view', $inquiry);`,
      explain: "التقييد في الـ query معناه إن الصف الغريب مش بيتلقي أصلا، فمفيش طريق للتسريب حتى لو نسيت check. جربته: استفسار مكتب المستخدم رجع 200 واستفسار مكتب تاني رجع 404. الـ policy أوضح في الكود ومركزي، والـ 404 بيخبي وجود المورد.",
    },
    {
      title: "سكريبت نشر آمن مع maintenance mode",
      lang: "bash",
      prompt: "<p>اكتب <code>deploy.sh</code>: يقف عند أول خطأ، يفتح maintenance mode بـ <code>--retry=60</code> و<code>--secret</code>، يسحب الكود، يعمل <code>composer install</code> للإنتاج، يشغّل الـ migrations بدون سؤال، يعمل cache للإعدادات والـ routes والـ views، يعيد تشغيل الـ workers، وفي الآخر يفتح الموقع. ولو أي خطوة فشلت المفروض الموقع <b>ما يفضلش</b> في maintenance mode من غير ما تعرف (استخدم <code>trap</code>).</p>",
      hints: [
        "<code>set -e</code> في أول السكريبت.",
        "<code>trap 'php artisan up' EXIT</code> بيشغّل الأمر عند أي خروج، حتى لو بسبب خطأ (وفكّر: ده بيفتح الموقع حتى لو الـ migration فشلت، ده قرار).",
      ],
      solution: `set -e

php artisan down --retry=60 --secret=deploy-secret
trap 'php artisan up' EXIT

git pull origin main
composer install --no-dev --optimize-autoloader --no-interaction

php artisan migrate --force
php artisan optimize
php artisan queue:restart`,
      explain: "<code>set -e</code> بيوقف السكريبت عند أول أمر فاشل، و<code>trap ... EXIT</code> بيضمن إن <code>up</code> بيتنفذ في كل الحالات. بس انتبه: لو الـ migration فشلت في النص، فتح الموقع على كود جديد وداتابيز نص-متغيرة قد يكون أسوأ من البقاء في maintenance mode؛ في الواقع كتير بيفضلوا ما يفتحوش تلقائي عند الفشل ويتدخلوا يدويا. وفي بيئة بتبني release folders الأحسن تتجنب maintenance mode خالص. الـ syntax اتفحص بـ <code>bash -n</code> ولم أشغّل النشر الفعلي.",
    },
  ],

  quiz: [
    {
      q: "أنهي سطر فيه SQL injection؟",
      options: [
        "<code>DB::select('select * from listings where id = ?', [$id]);</code>",
        "<code>Listing::where('title', $title)-&gt;get();</code>",
        "<code>DB::select(\"select * from listings where title = '$title'\");</code>",
        "<code>Listing::whereRaw('price &gt; ?', [$min])-&gt;get();</code>",
      ],
      answer: 2,
      why: "السطر الثالث بيدمج المتغير في نص الـ SQL. باقي الأسطر بتستخدم bindings (علامة <code>?</code> والقيمة في array أو query builder اللي بيعمل ده تلقائي).",
    },
    {
      q: "عندك <code>Listing::orderBy($request-&gt;query('sort'))-&gt;get();</code>. هل الـ bindings بتحميك هنا؟",
      options: [
        "أيوه، Eloquent بتعمل binding لكل حاجة",
        "لأ، أسماء الأعمدة مش بتتعمل لها binding، لازم whitelist",
        "أيوه لو استخدمت <code>orderByRaw</code>",
        "لأ، وكمان الحل إنك تستخدم <code>DB::raw</code>",
      ],
      answer: 1,
      why: "الـ binding بيحمي القيم بس. اسم العمود بيدخل في الـ SQL نفسه، فلازم تتأكد إنه من قايمة مسموحة. الـ <code>raw</code> بيزود الخطر ولا يحله.",
    },
    {
      q: "مستخدم مسجل غيّر الرقم في <code>/api/inquiries/57</code> لـ <code>58</code> وشاف استفسار مكتب تاني. اسم الثغرة؟",
      answer: ["IDOR", "idor", "Insecure Direct Object Reference"],
      why: "ده IDOR: الـ endpoint بيقبل id ومبيتأكدش من الملكية. الحل authorization (policy أو تقييد الـ query بالمكتب) على كل endpoint فيه id.",
    },
    {
      q: "أنهي واحد بالظبط هو XSS؟",
      options: [
        "موقع خبيث يخلي متصفحك يبعت POST لموقعك بالـ cookie",
        "مهاجم يخمّن باسوردات بسرعة",
        "المستخدم يكتب <code>&lt;script&gt;</code> في وصف إعلان والصفحة تطبعه بـ <code>{!! !!}</code> فينفذ عند الزوار",
        "ملف PDF كبير جدا يتحمّل",
      ],
      answer: 2,
      why: "XSS = كود JavaScript خبيث بيتنفذ في صفحتك لأن مخرجاتك مش بتتعمل لها escape. الأول CSRF، والتاني brute force، والرابع مشكلة حجم.",
    },
    {
      q: "عملت <code>php artisan config:cache</code> على production، وبعدها <code>env('PAYMENT_KEY')</code> المكتوب جوه service class رجّع <code>null</code>. إيه الصح؟",
      options: [
        "نشغّل <code>php artisan cache:clear</code>",
        "نحط المفتاح في <code>config/services.php</code> بـ <code>env()</code> ونقراه بـ <code>config('services.payment.key')</code>",
        "نكتب <code>env()</code> مرتين",
        "نرجع <code>APP_DEBUG=true</code>",
      ],
      answer: 1,
      why: "بعد <code>config:cache</code> مفيش تحميل لـ <code>.env</code>، فـ <code>env()</code> برا ملفات config بتبقى null. القراءة الصح عن طريق <code>config()</code> من ملف config فيه <code>env()</code>.",
    },
    {
      q: "ليه الأمر <code>php artisan migrate</code> ممكن يعلّق سكريبت النشر في production؟",
      options: [
        "لأنه بيسأل تأكيد في production، والحل <code>--force</code>",
        "لأنه محتاج internet",
        "لأنه بيعمل rollback تلقائي",
        "لأن PHP-FPM لازم يتوقف الأول",
      ],
      answer: 0,
      why: "في بيئة production الأمر بيطلب تأكيد (عشان الخطر)، وفي سكريبت أوتوماتيك مفيش حد يرد. <code>--force</code> بتتخطى السؤال، وعشان كده لازم backup قبلها.",
    },
    {
      q: "ما معنى إن <code>composer audit</code> بيقول إن ثغرة إصلاحها موجود بس في الإصدار 12.x والمشروع على 11.x؟",
      options: [
        "كل شيء تمام، 11 أحدث",
        "نسخة 11 خرجت من فترة دعم الأمان، فالحل الوحيد ترقية الإصدار الرئيسي",
        "تعمل <code>composer install</code> مرة تانية وتتحل",
        "تعمل <code>config:cache</code>",
      ],
      answer: 1,
      why: "لما الإصلاحات بتنزل بس لنسخ أحدث، معناه إن نسختك مش مدعومة أمنيا. الحل ترقية الـ major (بعد قراءة upgrade guide وتشغيل الاختبارات). إعادة التثبيت بتجيب نفس النسخ من الـ lock.",
    },
    {
      q: "الأمر اللي يحط الموقع في maintenance mode (503) هو؟",
      answer: ["php artisan down", "artisan down", "down"],
      why: "<code>php artisan down</code> بيحط الموقع في وضع الصيانة، ومعاه <code>--retry</code> و<code>--secret</code> و<code>--render</code>. و<code>php artisan up</code> بيفتحه.",
    },
    {
      q: "اكتشفت إن ملف <code>.env</code> اترفع على repo على GitHub (حتى لو private) من أسبوع. أنهي خطوة أهم؟",
      options: [
        "أمسح الملف في commit جديد وأكمل",
        "أخلي الـ repo private وأنساها",
        "أغيّر <code>APP_DEBUG</code> بس",
        "أغيّر كل الأسرار اللي فيه (باسورد الداتابيز، API keys، APP_KEY بحذر) لأن التاريخ لسه فيه، وبعدين أشيله من التاريخ",
      ],
      answer: 3,
      why: "الملف بيفضل في تاريخ git حتى بعد حذفه، فأي حد عنده نسخة أو وصول ممكن يكون شافه. الأسرار لازم تتغيّر دايما، ده الأساس، وإزالة الملف من التاريخ خطوة إضافية.",
    },
  ],
};
