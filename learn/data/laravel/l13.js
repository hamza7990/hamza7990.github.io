window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l13"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "الكاش: احسب مرة واحدة، واقرا ألف مرة",
      en: "Why cache and what to cache",
      body: "<p>الكاش مكان تخزين سريع بتحط فيه نتيجة حاجة غالية (query تقيلة، استدعاء API خارجي، حسبة معقدة) عشان الريكويست الجاية تاخدها جاهزة. الداتابيز بتاخد ملي ثانية، والكاش في الذاكرة بياخد جزء من ملي ثانية. بس الكاش بيجيب مشكلة جديدة: <b>البيانات ممكن تبقى قديمة (stale)</b>. عشان كده السؤال الأهم في الإنترفيو مش «إزاي أكاشّي» لكن «إمتى أمسح الكاش».</p>",
      points: [
        "<b>كاشّي</b> اللي بيتقرا كتير ويتغير قليل: قايمة المدن، الإعلانات المميزة في الصفحة الرئيسية، عدّادات، نتيجة API خارجي.",
        "<b>متكاشّيش</b> اللي لازم يبقى لحظي: الرصيد، حالة الدفع، بيانات خاصة بكل مستخدم من غير ما المفتاح يحمل الـ user id.",
        "قبل ما تضيف كاش: قيس الأول. غالبا الـ query محتاجة index أو eager loading (المستوى 7) مش كاش. الكاش بيخبّي المشكلة ومش بيحلها.",
        "كل كاش ليه تمن: كود إضافي للمسح، وخطر بيانات قديمة، وحالات اختبار أكتر.",
      ],
      focus: [{ label: "احفظها", text: "الكاش = سرعة مقابل freshness. كل مفتاح كاش لازم يبقى ليه إجابة لسؤالين: <b>بينتهي إمتى؟</b> و<b>مين بيمسحه لما البيانات تتغير؟</b>" }],
      interview: [
        { q: "إمتى تستخدم الكاش، وإيه المخاطر؟", a: "بستخدمه لما نتيجة غالية بتتقرا كتير وبتتغير قليل، زي قايمة الإعلانات المميزة أو نتيجة API خارجي. المخاطر: البيانات القديمة لو ما مسحتش الكاش عند التغيير، وتعقيد الكود، وإن الكاش ممكن يخبّي query بطيئة كان الأولى تتصلح بـ index. فبقيس الأول، وبحط TTL قصير كشبكة أمان حتى لو عندي مسح صريح." },
      ],
    },
    {
      title: "الـ Cache facade: الأوامر الأساسية",
      en: "Cache facade basics",
      body: "<p>كل التعامل بيتم من خلال <code>Cache</code> facade، وبنفس الأوامر مهما كان الـ driver (ملف، داتابيز، Redis). الـ TTL (مدة الصلاحية) بتتكتب بالثواني أو كـ <code>DateTimeInterface</code> (من Laravel 5.8 بقت بالثواني مش بالدقايق).</p>",
      code: {
        lang: "php",
        src: `<?php

use Illuminate\\Support\\Facades\\Cache;

Cache::put('city:list', ['Riyadh', 'Jeddah'], 3600);   // 1 hour
Cache::put('ttl:date', 1, now()->addMinutes(10));      // DateTime works
Cache::put('forever', 1);                              // no ttl = forever

Cache::get('city:list');                // the array, or null if missing/expired
Cache::get('nope', 'default');          // default value
Cache::get('nope', fn () => 'lazy');    // default from a closure
Cache::has('city:list');                // true (false if the value is null)

Cache::add('job:lock', 1, 30);          // true; only stores if missing
Cache::add('job:lock', 1, 30);          // false the second time
Cache::pull('job:lock');                // get + delete in one step
Cache::forget('city:list');             // delete one key

Cache::increment('visits');             // 1 (a missing key starts at 0)
Cache::increment('visits', 5);          // 6
Cache::decrement('visits');             // 5`,
        note: "جربتها كلها على Laravel 11.57. تفاصيل لقيتها بالتجربة: <code>increment</code> على مفتاح مش موجود بترجّع <code>1</code>، و<code>put('k', null)</code> بعدها <code>has('k')</code> بترجّع <code>false</code>، و<code>add</code> بترجّع <code>false</code> لو المفتاح موجود فتنفع كـ «خد الدور» بسيط.",
      },
      pitfall: "<code>Cache::put('k', $v)</code> من غير TTL معناها <b>للأبد</b> مش «افتراضي ساعة». لو نسيت الـ TTL الكاش مش هيتمسح لوحده أبدا إلا لو مسحته إنت.",
    },
    {
      title: "remember: النمط اللي هتكتبه 90% من الوقت",
      en: "remember and rememberForever",
      body: "<p><code>Cache::remember($key, $ttl, $callback)</code> بتعمل تلات حاجات في سطر: لو المفتاح موجود بترجّعه، ولو مش موجود بتشغّل الـ closure، وتخزّن النتيجة، وترجّعها. <code>rememberForever</code> نفس الفكرة من غير انتهاء، وده مناسب لحاجة بتتمسح صراحة عند التغيير (config من الداتابيز مثلا).</p>",
      code: {
        lang: "php",
        title: "app/Http/Controllers/FeaturedListingsController.php",
        src: `<?php

use App\\Models\\Listing;
use Illuminate\\Support\\Facades\\Cache;

public function __invoke(): JsonResponse
{
    $data = Cache::remember('listings:featured', 600, function () {
        return Listing::published()
            ->where('is_featured', true)
            ->orderBy('price')
            ->limit(10)
            ->get()
            ->toArray();          // cache plain arrays, not models
    });

    return response()->json($data);
}

// no expiry: you delete it yourself when it changes
$cities = Cache::rememberForever('cities', fn () => City::pluck('name'));`,
        note: "جربت إن الـ closure اتنفذت مرة واحدة بس في نداءين متتاليين لـ <code>remember</code>. الـ closure ما بتتنفذش لو الكاش موجود، فالـ query اللي جواها ما بتروحش للداتابيز.",
      },
      pitfall: "كاشّي <b>arrays أو أرقام بسيطة</b> أكتر من موديلات Eloquent كاملة. الموديل بيتعمل له serialize مع علاقاته، وده بيكبّر الكاش، وبيبوظ لو غيرت الكلاس بعد كده. ومتكاشّيش حاجة فيها بيانات خاصة بمستخدم في مفتاح عام.",
      interview: [
        { q: "إيه الفرق بين <code>Cache::put</code> و <code>Cache::remember</code>؟", a: "<code>put</code> بتكتب القيمة دايما وإنت اللي بتقرر تقرا إمتى. <code>remember</code> بتقرا الأول: لو موجودة بترجعها من غير ما تنفذ الـ closure، ولو لأ بتنفذ الـ closure وبتخزن النتيجة بالـ TTL وبترجعها. فهي الأنسب لنمط cache-aside: اسأل الكاش، ولو فاضي هات من المصدر وخزّن." },
      ],
    },
    {
      title: "الـ drivers: تختار إيه؟",
      en: "Cache drivers",
      body: "<p>الـ driver بيتحدد بـ <code>CACHE_STORE</code> في <code>.env</code> (في Laravel 10 وقبله كان اسمه <code>CACHE_DRIVER</code>)، والإعدادات في <code>config/cache.php</code>. الكود بتاعك مش بيتغير لما تبدل.</p>",
      points: [
        "<b>file</b>: بسيط، من غير أي خدمة. كويس للتطوير والمشاريع الصغيرة على سيرفر واحد. بطيء نسبيا، وما بيشتغلش صح لو عندك أكتر من سيرفر.",
        "<b>database</b>: جدول <code>cache</code> (من <code>php artisan make:cache-table</code>). مفيد لو مش عايز خدمة زيادة. أبطأ من الذاكرة.",
        "<b>redis</b>: في الذاكرة، سريع، مشترك بين كل السيرفرات، وبيدعم tags و atomic locks. ده اختيار الـ production لما الحمل يكبر.",
        "<b>array</b>: في ذاكرة الريكويست الحالية بس وبيضيع بعدها. ده اللي بتستخدمه الاختبارات (<code>CACHE_STORE=array</code> في <code>phpunit.xml</code>).",
        "<b>memcached</b> و <b>dynamodb</b> موجودين كمان، وتقدر تعرّف أكتر من store وتختار بـ <code>Cache::store('redis')-&gt;get(...)</code>.",
      ],
      pitfall: "الـ tags <b>مش مدعومة</b> في driver الـ file والـ database (ولا dynamodb)، فلو كودك بيستخدم tags وبدلت لواحد منهم هيرمي exception. وفي بيئة فيها أكتر من سيرفر، driver الـ file يعني كل سيرفر عنده كاش لوحده ومختلف.",
      interview: [
        { q: "إزاي تختار cache driver؟", a: "للتطوير والاختبارات: file أو array. لسيرفر واحد صغير: file أو database. في الـ production مع أكتر من سيرفر أو حمل عالي: Redis لأنه في الذاكرة، مشترك بين السيرفرات، وبيدعم tags و atomic locks. بغيّر الـ driver من <code>.env</code> من غير ما أغير الكود، بس لازم أنتبه لأي ميزة مش كل الـ drivers بتدعمها زي الـ tags." },
      ],
    },
    {
      title: "المفاتيح وإبطال الكاش (invalidation)",
      en: "Cache keys and invalidation",
      body: "<p>«في علم الحاسب في حاجتين صعبين: تسمية الحاجات وإبطال الكاش». اسم المفتاح لازم يبقى <b>مميز وواضح وفيه كل اللي بيغيّر النتيجة</b>: <code>listings:office:5:page:2</code>. وفي تلات استراتيجيات للمسح:</p>",
      points: [
        "<b>انتهاء بالوقت (TTL)</b>: أبسط شيء، بتقبل إن البيانات تتأخر شوية. مناسب للإحصائيات.",
        "<b>مسح عند الكتابة</b>: عند save أو delete للموديل تمسح المفتاح (<code>Cache::forget</code>) من observer أو من الـ service. بيانات طازجة بس لازم تفتكر كل مكان بيكتب.",
        "<b>Tags</b> (Redis و memcached): بتحط مجموعة مفاتيح تحت tag وتمسحها كلها بـ <code>flush()</code>.",
        "<b>مفتاح بنسخة (versioned key)</b>: تحط رقم نسخة في اسم المفتاح، وتزوّده عشان كل المفاتيح القديمة تبقى «يتيمة» وتنتهي لوحدها بالـ TTL. بيشتغل على أي driver.",
      ],
      code: {
        lang: "php",
        src: `<?php

use App\\Models\\Listing;
use Illuminate\\Support\\Facades\\Cache;

// 1) clear on write (Listing model)
protected static function booted(): void
{
    static::saved(fn () => Cache::forget('listings:featured'));
    static::deleted(fn () => Cache::forget('listings:featured'));
}

// 2) tags (redis / memcached only)
Cache::tags(['listings', 'office:5'])->put('page:1', $data, 600);
Cache::tags(['listings'])->flush();      // removes everything tagged listings

// 3) versioned key (any driver)
$v = Cache::get('listings:version', 0);
$data = Cache::remember("listings:index:v{$v}", 600, fn () => $query());
Cache::increment('listings:version');    // old v0 keys are never read again`,
        note: "جربت الثلاثة. نقطة مهمة في النسخ: خلّي القيمة الافتراضية <code>0</code> في <code>get</code>، لأن <code>increment</code> على مفتاح مش موجود بيبدأ من 0 وبيرجّع 1. لو خليت الافتراضي 1 هتقرا نفس النسخة القديمة بعد أول increment وتشوف بيانات قديمة. الـ tags اشتغلت في الاختبار على driver الـ array.",
      },
      pitfall: "المسح عند الكتابة بيفوتك لما حد يعدّل بـ <code>Listing::where(...)-&gt;update([...])</code> لأنها بتتخطى model events (المستوى 5). في الحالة دي امسح الكاش يدويا بعدها، أو استخدم TTL قصير كشبكة أمان.",
      interview: [
        { q: "إزاي بتتعامل مع إبطال الكاش (cache invalidation)؟", a: "بدمج استراتيجيتين: TTL كشبكة أمان، ومسح صريح عند الكتابة من observer أو service لما الطزاجة مهمة. لو عندي مجموعة مفاتيح مرتبطة (كل صفحات قايمة الإعلانات) بستخدم tags لو الـ driver بيدعمها (Redis)، أو مفتاح بنسخة بزوّد رقمها فكل القديم يتجاهل. وبسمي المفاتيح بشكل يحمل كل اللي بيغيّر النتيجة (office id، page)." },
      ],
    },
    {
      title: "Cache stampede والـ atomic locks",
      en: "Stampede and Cache::lock",
      body: "<p>تخيل مفتاح مشهور (الصفحة الرئيسية) بيخلص. في نفس اللحظة 500 ريكويست بتلاقيه فاضي، وكلهم بينفذوا الـ query التقيلة مع بعض ويضربوا الداتابيز. ده اسمه <b>cache stampede</b>. الحل على مستوى junior هو <b>lock ذري (atomic lock)</b>: واحد بس هو اللي يبني الكاش، والباقي يستنوا أو ياخدوا النتيجة.</p>",
      code: {
        lang: "php",
        src: `<?php

use Illuminate\\Support\\Facades\\Cache;

$data = Cache::get('home:stats');

if ($data === null) {
    // wait up to 5 seconds for the lock, hold it for at most 10
    $data = Cache::lock('home:stats:build', 10)->block(5, function () {
        // somebody else may have built it while we waited
        return Cache::remember('home:stats', 600, fn () => $this->heavyQuery());
    });
}

// non-blocking version: do the job only if nobody else is
$result = Cache::lock('reports:daily', 60)->get(function () {
    return 'ran';                 // lock is released after the closure
});                               // returns false if the lock was taken`,
        note: "جربت: <code>lock()-&gt;get()</code> رجّعت <code>true</code> أول مرة و<code>false</code> لما حد تاني حاول ياخد نفس الـ lock قبل ما يتحرر، و<code>block(2, fn)</code> رجّعت نتيجة الـ closure. الـ locks محتاجة driver بيدعمها: redis أو memcached أو database أو file أو array. الأفضل في production Redis.",
      },
      focus: [{ label: "احفظها", text: "الـ lock له <b>مدة</b> (الرقم التاني). لو السيرفر وقع وهو ماسكه، الـ lock بيتحرر لوحده بعد المدة دي. ودايما نفس الـ lock يتستخدم لمنع شغل متكرر: تقرير يومي، payment callback." }],
      interview: [
        { q: "إيه هو الـ cache stampede وإزاي تتجنبه؟", a: "لما مفتاح كاش مشهور بيخلص وعدد كبير من الريكويستات تلاقيه فاضي في نفس اللحظة فكلهم يعيدوا بناءه ويضغطوا على الداتابيز. بتجنبه بـ <code>Cache::lock</code> يخلي ريكويست واحد بس يبني القيمة والباقي ينتظر بـ <code>block</code>. تقنيات تانية: TTL عشوائي بسيط عشان المفاتيح ما تخلصش كلها مع بعض، أو تجديد الكاش في الخلفية قبل ما ينتهي." },
      ],
    },
    {
      title: "كاش التطبيق مقابل كاش الـ config والـ routes والـ views",
      en: "Application cache vs framework caches",
      body: "<p>لفظة «cache» في Laravel ليها معنيين مختلفين، وبيتلخبطوا في الإنترفيو:</p>",
      points: [
        "<b>كاش التطبيق (Cache facade)</b>: بيانات إنت بتخزنها في الـ runtime (نتيجة query). بتمسحه بـ <code>php artisan cache:clear</code>.",
        "<b>كاش الإطار (framework caches)</b>: ملفات بتتولد وقت النشر عشان Laravel تبدأ أسرع: <code>config:cache</code> (كل ملفات config في ملف واحد)، <code>route:cache</code> (الـ routes)، <code>view:cache</code> (تجميع قوالب Blade)، <code>event:cache</code>. والأمر <code>php artisan optimize</code> بيعمل config و events و routes و views مرة واحدة، و<code>optimize:clear</code> بيمسحهم (وكمان بيمسح كاش التطبيق، جربتها: ظهر <code>cache</code> في القايمة).",
        "ده مش بيتغير وقت التشغيل، فبعد أي تعديل في config أو routes لازم تعيد الأمر (أو تمسحه في التطوير).",
      ],
      pitfall: "بعد <code>config:cache</code> ملف <code>.env</code> مش بيتقرا خالص، فأي <code>env('X')</code> مكتوب خارج ملفات <code>config/</code> هيرجّع <code>null</code>. القاعدة (المستوى 1): <code>env()</code> جوه config بس، وفي الكود <code>config('app.x')</code>. وجربتها: بعد <code>config:cache</code> رجّعت <code>env('APP_NAME')</code> الـ <code>null</code> بينما <code>config('app.name')</code> رجّعت القيمة.",
      interview: [
        { q: "إيه الفرق بين <code>cache:clear</code> و <code>config:clear</code>؟ ولماذا نعمل <code>config:cache</code> في الـ production؟", a: "<code>cache:clear</code> بيمسح كاش التطبيق (القيم اللي خزّنتها بـ <code>Cache::put</code>). <code>config:clear</code> بيمسح ملف الإعدادات المجمّع. بنعمل <code>config:cache</code> و <code>route:cache</code> و <code>view:cache</code> وقت النشر عشان Laravel ما تقراش وتحلل عشرات الملفات في كل ريكويست. والتحذير: بعد <code>config:cache</code> الـ <code>env()</code> برا ملفات config بيرجّع null." },
      ],
    },
    {
      title: "Redis في شريحة واحدة",
      en: "Redis in one slide",
      body: "<p>Redis قاعدة بيانات <b>في الذاكرة</b> من نوع key-value، بتتميز بالسرعة وبإنها بتدعم هياكل بيانات مش بس نصوص: strings، hashes، lists، sets، sorted sets. في Laravel بتخدم أربع أدوار بإعداد واحد:</p>",
      points: [
        "<b>Cache</b>: <code>CACHE_STORE=redis</code>. سريع ومشترك بين السيرفرات، وبيدعم tags و locks.",
        "<b>Queues</b>: <code>QUEUE_CONNECTION=redis</code> (المستوى 12). الـ jobs في list بيسحب منها الـ worker.",
        "<b>Sessions</b>: <code>SESSION_DRIVER=redis</code>.",
        "<b>Rate limiting</b>: العدّادات بتتخزن في الكاش، فمع Redis بتكون سريعة ومشتركة بين السيرفرات.",
        "بتتصل بيه من Laravel عن طريق الـ phpredis extension أو package اسمه <code>predis/predis</code>، وإعدادات الاتصال في <code>config/database.php</code> تحت <code>redis</code> (<code>REDIS_HOST</code> و <code>REDIS_PORT</code>).",
      ],
      pitfall: "Redis في الذاكرة، فلو اتعمله restart من غير persistence هتخسر الكاش (وده مقبول) لكن كمان الـ queues والـ sessions. متفترضش إنه مخزن دائم للبيانات المهمة. ومفتاح الـ <code>CACHE_PREFIX</code> مهم لو أكتر من تطبيق على نفس Redis عشان ما يتخبطوش في بعض.",
      interview: [
        { q: "إيه هو Redis وفين بتستخدمه في Laravel؟", a: "Redis مخزن key-value في الذاكرة بيدعم هياكل بيانات زي lists و sets و hashes، وسريع جدا. في Laravel بستخدمه كـ cache driver، وكـ queue connection، وكـ session store، ومعاه بيتخزن عدّادات rate limiting. ميزته إنه سريع ومشترك بين كل السيرفرات، فالكاش والـ sessions والـ queue كلها تبقى متسقة لما أشغّل أكتر من سيرفر." },
      ],
    },
    {
      title: "Rate limiting: 429 و Retry-After",
      en: "Rate limiting",
      body: "<p>الـ rate limiting بيحمي الـ API من الإساءة (brute force على login، سبام استفسارات): بتحدد كام ريكويست مسموح في الدقيقة لكل مستخدم أو IP. بتعرّف الـ limiter باسم في <code>boot()</code> بتاع <code>AppServiceProvider</code>، وبتربطه بالـ route بـ middleware اسمه <code>throttle:اسم</code>. لما المستخدم يعدي الحد بياخد <code>429 Too Many Requests</code> ومعاه header اسمه <code>Retry-After</code> بالثواني.</p>",
      code: {
        lang: "php",
        src: `<?php

// app/Providers/AppServiceProvider.php  ->  boot()
use Illuminate\\Cache\\RateLimiting\\Limit;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\RateLimiter;

RateLimiter::for('inquiries', function (Request $request) {
    return $request->user()
        ? Limit::perMinute(30)->by($request->user()->id)
        : Limit::perMinute(5)->by($request->ip());
});

// routes/api.php
Route::post('/inquiries', [InquiryController::class, 'store'])
    ->middleware('throttle:inquiries');

Route::get('/ping', fn () => 'ok')->middleware('throttle:60,1'); // inline`,
        note: "جربت الـ limiter بحد 2 في الدقيقة: الريكويست الأول رجّع <code>X-RateLimit-Remaining: 1</code>، والتالت رجّع <code>429</code> ومعاه <code>Retry-After: 60</code> و<code>X-RateLimit-Limit: 2</code>، وبعد مرور الدقيقة رجع يشتغل. تقدر تخصص الرد بـ <code>Limit::perMinute(1)-&gt;response(fn ($request, array $headers) =&gt; response()-&gt;json([...], 429, $headers))</code>. وللتحكم اليدوي: <code>RateLimiter::hit($key, 60)</code> و<code>tooManyAttempts($key, 5)</code> و<code>availableIn($key)</code> و<code>clear($key)</code>.",
      },
      pitfall: "العدّادات بتتخزن في الـ cache، فالـ limiter بيشتغل زي ما الـ cache driver بتاعك بيشتغل: مع driver الـ file وأكتر من سيرفر كل سيرفر بيعد لوحده. وفي Laravel 11 الدالة <code>$middleware-&gt;throttleApi()</code> في <code>bootstrap/app.php</code> بتفعّل throttle على group الـ api باسم limiter هو <code>api</code>، بس الـ framework نفسه مبيعرّفش limiter بالاسم ده (بحثت في الـ source)، فعرّفه إنت بـ <code>RateLimiter::for('api', ...)</code> زي فوق.",
      interview: [
        { q: "إزاي بتحمي endpoint زي login من brute force؟", a: "بحط عليه rate limit: <code>RateLimiter::for('login', ...)</code> بحد صغير بالـ IP مع الإيميل (<code>by($request->ip() . $request->email)</code>) وبربطه بـ <code>throttle:login</code>. لما يعدي الحد بيرجع <code>429</code> و<code>Retry-After</code> بيقول للعميل يستنى كام ثانية. ده بيكمّل (مش بيبدّل) الـ validation وقفل الحساب المؤقت." },
      ],
    },
    {
      title: "الـ Sessions: أماكن التخزين",
      en: "Session drivers",
      body: "<p>الـ session بيحفظ حالة المستخدم بين الريكويستات (في تطبيقات الـ web؛ الـ API بـ token مش بتحتاجه). المتصفح بيحتفظ بـ cookie فيها id بس، والبيانات الفعلية بتتخزن عند السيرفر في المكان اللي بيحدده <code>SESSION_DRIVER</code>:</p>",
      points: [
        "<b>file</b>: ملفات في <code>storage/framework/sessions</code>. بسيط، لسيرفر واحد.",
        "<b>database</b>: جدول <code>sessions</code> (<code>php artisan make:session-table</code>). افتراضي في Laravel 11. بيشتغل مع أكتر من سيرفر.",
        "<b>redis</b> / <b>memcached</b>: سريع ومشترك. الأنسب للحمل العالي.",
        "<b>cookie</b>: البيانات كلها (مشفرة) في الـ cookie نفسها، محدودة الحجم (حوالي 4KB). <b>array</b>: للاختبارات بس، بيضيع بعد الريكويست.",
        "<code>SESSION_LIFETIME</code> بالدقايق (افتراضي 120).",
      ],
      pitfall: "لو شغّلت التطبيق على سيرفرين خلف load balancer بـ <code>SESSION_DRIVER=file</code>، المستخدم هيتسجل خروج فجأة كل ما الريكويست يروح للسيرفر التاني. الحل: driver مشترك (database أو redis) أو sticky sessions.",
    },
  ],

  drills: [
    {
      title: "اكتب: أوامر الـ Cache الأساسية",
      lang: "php",
      code: `<?php

use Illuminate\\Support\\Facades\\Cache;

Cache::put('visits', 0, 3600);
Cache::increment('visits');
$n = Cache::get('visits', 0);
$free = Cache::add('job:lock', 1, 30);
Cache::forget('visits');`,
    },
    {
      title: "اكتب: remember في controller",
      lang: "php",
      code: `<?php

public function __invoke(): JsonResponse
{
    $data = Cache::remember('listings:featured', 600, function () {
        return Listing::where('is_featured', true)
            ->orderBy('price')
            ->limit(10)
            ->get()
            ->toArray();
    });

    return response()->json($data);
}`,
    },
    {
      title: "اكتب: RateLimiter وربطه بـ route",
      lang: "php",
      code: `<?php

use Illuminate\\Cache\\RateLimiting\\Limit;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\RateLimiter;

RateLimiter::for('inquiries', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip());
});

Route::post('/inquiries', [InquiryController::class, 'store'])
    ->middleware('throttle:inquiries');`,
    },
  ],

  tasks: [
    {
      title: "كاش الإعلانات المميزة مع المسح عند الكتابة",
      lang: "php",
      prompt: "<p>اكتب دالة <code>featuredListings(): array</code> بترجّع أرخص 10 إعلانات منشورة ومميزة (<code>is_featured = true</code>) كـ array، وتكاشّيها 10 دقايق بالمفتاح <code>listings:featured</code>. وبعدين أضف في <code>Listing::booted()</code> كود يمسح المفتاح ده لما أي إعلان يتحفظ أو يتمسح.</p>",
      examples: [{ in: "featuredListings(); featuredListings();", out: "الـ query بتتنفذ مرة واحدة بس" }],
      hints: [
        "<code>Cache::remember('listings:featured', 600, fn () =&gt; ...)</code> واحفظ النتيجة بـ <code>toArray()</code>.",
        "في الموديل: <code>protected static function booted(): void</code> وجواها <code>static::saved(...)</code> و<code>static::deleted(...)</code>.",
      ],
      solution: `<?php

use App\\Models\\Listing;
use Illuminate\\Support\\Facades\\Cache;

function featuredListings(): array
{
    return Cache::remember('listings:featured', 600, function () {
        return Listing::published()
            ->where('is_featured', true)
            ->orderBy('price')
            ->limit(10)
            ->get()
            ->toArray();
    });
}

// inside the Listing model
protected static function booted(): void
{
    $forget = fn () => Cache::forget('listings:featured');

    static::saved($forget);
    static::deleted($forget);
}`,
      explain: "الـ TTL (600) شبكة أمان، والمسح من <code>saved</code> و<code>deleted</code> بيخلي البيانات طازجة. لاحظ إن <code>saved</code> بتغطي الإنشاء والتعديل. وده مش بيشتغل مع <code>Listing::where(...)-&gt;update()</code> الجماعية لأنها بتتخطى الـ model events، فهناك لازم تمسح المفتاح يدويا.",
    },
    {
      title: "Limiter للاستفسارات يفرّق بين المسجل والزائر",
      lang: "php",
      prompt: "<p>عرّف limiter باسم <code>inquiries</code>: المستخدم المسجل بياخد 30 ريكويست في الدقيقة (بيتعد بالـ user id)، والزائر 5 في الدقيقة (بيتعد بالـ IP). ثم اربطه بـ <code>POST /inquiries</code>. اذكر في تعليق إيه اللي يرجع للعميل لما يعدي الحد.</p>",
      hints: [
        "<code>RateLimiter::for('inquiries', function (Request $request) { ... })</code> في <code>boot()</code>.",
        "<code>$request-&gt;user()</code> بترجّع <code>null</code> للزائر. استخدم <code>Limit::perMinute(n)-&gt;by(...)</code>.",
      ],
      solution: `<?php

use Illuminate\\Cache\\RateLimiting\\Limit;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\RateLimiter;
use Illuminate\\Support\\Facades\\Route;

// AppServiceProvider::boot()
RateLimiter::for('inquiries', function (Request $request) {
    return $request->user()
        ? Limit::perMinute(30)->by($request->user()->id)
        : Limit::perMinute(5)->by($request->ip());
});

// routes/api.php
Route::post('/inquiries', [InquiryController::class, 'store'])
    ->middleware('throttle:inquiries');

// over the limit: 429 Too Many Requests + Retry-After header (seconds)`,
      explain: "الـ closure بيتنفذ في كل ريكويست وبيرجّع <code>Limit</code> (أو array من Limits). الـ <code>by()</code> هو المفتاح اللي بيتعد عليه: لو ما حطيتوش كل الناس بيتعدوا مع بعض. للـ user مسجل الـ <code>user()</code> بتشتغل لو الـ route وراه middleware auth أو الـ guard محدد.",
    },
    {
      title: "منع شغل متكرر بـ lock",
      lang: "php",
      prompt: "<p>اكتب دالة <code>buildDailyReport(): string</code> بتبني تقرير تقيل. لو حد تاني بيبنيه دلوقتي (على سيرفر تاني) ما تبنيهوش تاني: ارجع <code>'busy'</code>. لو أخدت الـ lock ابنيه وارجع <code>'built'</code>. الـ lock يتحرر لوحده بعد 60 ثانية لو حصلت مشكلة.</p>",
      examples: [{ in: "الدالة اتنادت من سيرفرين في نفس اللحظة", out: "واحد 'built' والتاني 'busy'" }],
      hints: [
        "<code>Cache::lock('reports:daily', 60)-&gt;get(function () { ... })</code> بترجّع <code>false</code> لو الـ lock مأخوذ.",
        "نتيجة الـ closure هي اللي بترجع من <code>get</code> لو الـ lock اتاخد.",
      ],
      solution: `<?php

use Illuminate\\Support\\Facades\\Cache;

function buildDailyReport(): string
{
    $result = Cache::lock('reports:daily', 60)->get(function () {
        // ... heavy work here ...
        return 'built';
    });

    return $result === false ? 'busy' : $result;
}`,
      explain: "<code>get(callback)</code> بتاخد الـ lock، وتنفذ الـ closure، وتحرر الـ lock تلقائي، وترجّع نتيجة الـ closure. لو الـ lock مأخوذ بترجّع <code>false</code> من غير ما تنتظر (عكس <code>block</code> اللي بتنتظر). الـ 60 ثانية صلاحية الـ lock لو السيرفر وقع وهو ماسكه.",
    },
  ],

  quiz: [
    {
      q: "الكود ده بيطبع إيه؟",
      code: { lang: "php", src: `<?php
Cache::forget('hits');
echo Cache::increment('hits');` },
      answer: ["1"],
      why: "المفتاح مش موجود، فـ <code>increment</code> بتبدأ من 0 وبتزوّد 1 وترجّع <code>1</code> (جربتها). مش بترمي خطأ.",
    },
    {
      q: "الـ closure في <code>remember</code> بتتنفذ كام مرة في الكود ده؟",
      code: { lang: "php", src: `<?php
$f = function () { return Listing::count(); };
Cache::remember('n', 60, $f);
Cache::remember('n', 60, $f);
Cache::remember('n', 60, $f);` },
      options: [
        "3 مرات، لأن كل نداء بيجدد الكاش",
        "مرتين",
        "مرة واحدة بس، في النداء الأول",
        "ولا مرة، لازم تنادي <code>put</code> الأول",
      ],
      answer: 2,
      why: "النداء الأول لقى المفتاح فاضي فنفذ الـ closure وخزّن. النداءين اللي بعده لقوا القيمة فرجّعوها من غير تنفيذ. جربتها بعدّاد وطلع 1.",
    },
    {
      q: "إيه اللي بترجّعه <code>Cache::add('k', 1, 60)</code> لو المفتاح <code>k</code> موجود بالفعل؟",
      options: [
        "<code>false</code> ومبتغيّرش القيمة الموجودة",
        "<code>true</code> وبتستبدل القيمة",
        "<code>null</code>",
        "بترمي exception",
      ],
      answer: 0,
      why: "<code>add</code> بتخزن فقط لو المفتاح غير موجود، وبترجّع <code>true</code> لو خزّنت و<code>false</code> لو لأ. عشان كده بتنفع كـ lock بسيط. اللي بتستبدل دايما هي <code>put</code>.",
    },
    {
      q: "أي driver من دول <b>مش</b> بيدعم الـ cache tags؟",
      options: [
        "redis",
        "memcached",
        "array",
        "database",
      ],
      answer: 3,
      why: "الـ tags مدعومة في redis و memcached و array (اللي اتجربت في الاختبار)، لكن مش في file و database و dynamodb. استخدامها على driver غير مدعوم بيرمي exception.",
    },
    {
      q: "عملت <code>Cache::put('featured', $list, 3600)</code> لإعلانات الصفحة الرئيسية. بعدها المكتب عدّل سعر إعلان وفضل العملاء يشوفوا السعر القديم ساعة. أنهي حل صح؟",
      options: [
        "تخلي الـ TTL يوم عشان يتحدث مرة كل فترة",
        "تمسح المفتاح (<code>Cache::forget</code>) من observer أو من الكود اللي بيحفظ الإعلان",
        "تنقل لـ driver الـ file",
        "تشيل الكاش خالص من المشروع",
      ],
      answer: 1,
      why: "المشكلة بيانات قديمة بعد الكتابة، فالحل مسح المفتاح لما البيانات تتغير (مع TTL كشبكة أمان). تطويل الـ TTL بيزوّد المشكلة، وتغيير الـ driver ما بيمسحش حاجة. الكاش نفسه مش الغلط.",
    },
    {
      q: "عملت <code>php artisan config:cache</code> في الـ production، وبعدها <code>env('STRIPE_KEY')</code> المكتوبة جوه controller رجّعت <code>null</code>. السبب؟",
      options: [
        "المفتاح ناقص من الـ .env",
        "الـ cache driver مش Redis",
        "الـ route cache بيمنع القراءة",
        "ملف .env مبقاش بيتقرا بعد config:cache، فالـ env() برا ملفات config بترجع null",
      ],
      answer: 3,
      why: "بعد <code>config:cache</code> كل الإعدادات اتجمعت في ملف واحد و<code>.env</code> مبيتحملش. لازم تعرّف المفتاح في <code>config/services.php</code> بـ <code>env()</code> وتقراه بـ <code>config('services.stripe.key')</code>.",
    },
    {
      q: "إيه الـ header اللي بيقول للعميل يستنى قد إيه بعد ما ياخد <code>429</code>؟",
      options: [
        "Retry-After",
        "X-Wait",
        "Expires",
        "Cache-Control",
      ],
      answer: 0,
      why: "<code>Retry-After</code> (بالثواني) هو اللي بيحطه الـ throttle middleware مع الـ 429. الـ <code>Expires</code> و<code>Cache-Control</code> بتخص كاش المتصفح، و<code>X-Wait</code> مش موجود.",
    },
    {
      q: "مفتاح الصفحة الرئيسية بيخلص، و500 ريكويست كلهم نفذوا الـ query التقيلة مع بعض ووقعوا الداتابيز. اسم المشكلة والحل المناسب؟",
      options: [
        "N+1: eager loading",
        "Cache stampede: lock ذري (<code>Cache::lock</code>) يخلي واحد بس يبني القيمة",
        "Deadlock: transaction أقصر",
        "Memory leak: restart للـ worker",
      ],
      answer: 1,
      why: "ده بالظبط cache stampede (أو thundering herd): كل الريكويستات لقت الكاش فاضي مرة واحدة. الـ N+1 عدد queries كتير في ريكويست واحد، والـ deadlock مشكلة قفل في الداتابيز، وكلاهما حاجة تانية.",
    },
    {
      q: "تطبيقك على سيرفرين خلف load balancer، والمستخدمين بيتسجل خروجهم فجأة. الإعداد الأرجح؟",
      options: [
        "<code>SESSION_DRIVER=redis</code>",
        "<code>SESSION_DRIVER=database</code>",
        "<code>SESSION_DRIVER=file</code> على كل سيرفر",
        "<code>SESSION_LIFETIME=120</code>",
      ],
      answer: 2,
      why: "driver الـ file بيحفظ الـ session على قرص السيرفر نفسه، فلو الريكويست التاني راح للسيرفر التاني ما يلاقيش الـ session. redis و database مخزنين مشتركين. والـ lifetime بيحدد المدة بس.",
    },
  ],
};
