window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l1"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "Laravel مش سحر: ريكويست داخل وريسبونس خارج",
      en: "Why the request lifecycle matters",
      body: "<p>أي حاجة بتحصل في Laravel بتبدأ بريكويست HTTP وتنتهي بريسبونس. لو عارف الطريق اللي بينهم، هتعرف فين تحط الكود (middleware ولا controller ولا provider) وفين تدور لما حاجة تتكسر. وسؤال «إيه اللي بيحصل من أول ما الريكويست يوصل لحد ما الريسبونس يرجع؟» من أكتر الأسئلة تكرارا في إنترفيو Laravel.</p><p>في كل المستوى ده هنشتغل على نفس المثال: <b>API لإعلانات عقارية</b> فيه User و Office و Listing و Photo و Tag و Inquiry. هتشوفهم يكبروا من مستوى للتاني.</p>",
      points: [
        "الدخول دايما من ملف واحد: <code>public/index.php</code>.",
        "الريكويست بيعدي على pipeline من الـ middleware قبل ما يوصل لأي controller.",
        "Laravel 11 فرق عن الإصدارات القديمة في شكل المشروع: ملفات أقل وإعداد مركزي في <code>bootstrap/app.php</code>.",
      ],
    },
    {
      title: "نقطة الدخول: public/index.php",
      en: "The single entry point",
      body: "<p>الـ web server (Nginx أو Apache أو <code>php artisan serve</code>) بيوجّه كل الطلبات لملف واحد هو <code>public/index.php</code>. مجلد <code>public</code> هو الوحيد المفروض يبقى مكشوف للإنترنت، وباقي المشروع (الكود و <code>.env</code>) برا الـ document root.</p>",
      code: {
        lang: "php",
        title: "public/index.php (Laravel 11)",
        src: `<?php

use Illuminate\\Http\\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
(require_once __DIR__.'/../bootstrap/app.php')
    ->handleRequest(Request::capture());`,
        note: "تلات حاجات: يحمّل الـ autoloader بتاع Composer، ويبني الـ application من <code>bootstrap/app.php</code>، ويسلّم له ريكويست اتعمل من متغيرات PHP (<code>Request::capture()</code>) عشان يرجّع ريسبونس.",
      },
      pitfall: "لو رفعت المشروع على سيرفر وخليت الـ document root هو جذر المشروع بدل <code>public</code>، ملف <code>.env</code> (فيه أسرار الداتابيز) ممكن يتحمّل من المتصفح. الـ root لازم يشاور على <code>public</code> بس.",
    },
    {
      title: "الرحلة كاملة خطوة خطوة",
      en: "The request lifecycle",
      body: "<p>بعد ما <code>handleRequest</code> تستلم الريكويست، دي الخطوات بالترتيب:</p>",
      code: {
        lang: "text",
        title: "request -> response",
        src: `1. public/index.php           autoload + build the app
2. bootstrap/app.php          configure routing, middleware, exceptions
3. Service providers          register() on all, then boot() on all
4. Global middleware          (trust proxies, maintenance, ...)
5. Router matches the URL     finds the route + its middleware group
6. Route middleware           auth, throttle, ...
7. Controller method          your code: validate, query, return
8. Response is built          array/model -> JSON, view -> HTML
9. Middleware (on the way out)  response goes back through them
10. Response is sent          then terminate() callbacks run`,
        note: "الـ middleware زي بصل: الريكويست بيدخل طبقة طبقة لحد الـ controller، والريسبونس بيخرج من نفس الطبقات بالعكس. أي طبقة تقدر توقف الرحلة وترجّع ريسبونس من عندها (مثلا 401 من auth قبل ما الـ controller يشتغل).",
      },
      interview: [
        { q: "اشرح لي إيه اللي بيحصل في Laravel من لحظة وصول الريكويست لحد الريسبونس.", a: "الريكويست يدخل <code>public/index.php</code> اللي بيحمّل الـ autoloader ويبني الـ application من <code>bootstrap/app.php</code>. الـ application بيشغّل الـ service providers (كلها <code>register</code> الأول وبعدين كلها <code>boot</code>)، وبعدين الريكويست بيعدي على الـ global middleware، والـ router بيطابق الـ URL على route. الـ route middleware بتشتغل، وبعدين الـ controller method، وبيرجّع الريسبونس بالعكس عبر نفس الـ middleware ويتبعت للمتصفح." },
      ],
    },
    {
      title: "bootstrap/app.php في Laravel 11",
      en: "The slim application skeleton",
      body: "<p>من Laravel 11 المشروع بقى «نحيف». الإعداد اللي كان موزع على ملفات كتير بقى في ملف واحد <code>bootstrap/app.php</code> بثلاث methods: <code>withRouting</code> و <code>withMiddleware</code> و <code>withExceptions</code>.</p>",
      code: {
        lang: "php",
        title: "bootstrap/app.php",
        src: `<?php

use Illuminate\\Foundation\\Application;
use Illuminate\\Foundation\\Configuration\\Exceptions;
use Illuminate\\Foundation\\Configuration\\Middleware;
use Illuminate\\Http\\Request;
use Symfony\\Component\\HttpKernel\\Exception\\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(at: '*');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Not found'], 404);
            }
        });
    })->create();`,
        note: "الـ <code>api:</code> مش موجودة في مشروع Laravel 11 الجديد، بتتضاف لما تشغّل <code>php artisan install:api</code> (هنشوفها في المستوى الجاي). و <code>health: '/up'</code> بتعمل route جاهز لفحص إن التطبيق شغال.",
      },
      focus: [{ label: "احفظها", text: "في Laravel 11: الـ routes والـ middleware والـ exception handling كلهم بيتظبطوا من <code>bootstrap/app.php</code>. الـ service providers بتتسجل في <code>bootstrap/providers.php</code>." }],
      interview: [
        { q: "إيه اللي اتغير في هيكل المشروع في Laravel 11 مقارنة بالإصدارات القديمة؟", a: "الإصدارات القديمة (لحد 10) كان فيها <code>app/Http/Kernel.php</code> بقوائم الـ middleware، و <code>app/Console/Kernel.php</code>، و <code>app/Exceptions/Handler.php</code>، و <code>RouteServiceProvider</code> وكذا provider تاني، وقايمة providers في <code>config/app.php</code>. في Laravel 11 كل ده اتشال: الـ routing والـ middleware والـ exceptions بقوا في <code>bootstrap/app.php</code>، وقايمة الـ providers في <code>bootstrap/providers.php</code> ومعاها provider واحد بس افتراضي وهو <code>AppServiceProvider</code>. النتيجة مشروع أنضف وفيه ملفات أقل. المشاريع القديمة لسه بتشتغل لو اترقّت." },
      ],
    },
    {
      title: "الـ Service Provider: register ثم boot",
      en: "Service providers",
      body: "<p>الـ service provider هو المكان اللي بتجهّز فيه التطبيق: بتسجّل خدمات في الـ container أو بتظبط حاجات عامة. فيه method اسمها <code>register</code> وواحدة اسمها <code>boot</code>، والفرق بينهم مهم.</p><p>Laravel بتنادي <code>register</code> على <b>كل</b> الـ providers الأول، وبعدها بتنادي <code>boot</code> على كلهم. ليه؟ عشان وقت <code>boot</code> تكون كل الخدمات اتسجلت وينفع تستخدم أي واحدة منها.</p>",
      code: {
        lang: "php",
        title: "app/Providers/AppServiceProvider.php",
        src: `<?php

namespace App\\Providers;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Support\\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // only bind things here, never use other services
        $this->app->bind('greeting', fn () => 'hello');
    }

    public function boot(): void
    {
        // everything is registered, so it is safe to use it now
        Model::preventLazyLoading(! $this->app->isProduction());
    }
}`,
        note: "لو عندك providerين A و B الترتيب هيبقى: <code>A register</code> ثم <code>B register</code> ثم <code>A boot</code> ثم <code>B boot</code>. جربته بنفسي وده اللي بيطبع. الـ providers بتتحمّل من <code>bootstrap/providers.php</code>.",
      },
      pitfall: "متنادّيش على خدمة تانية جوه <code>register</code>: ممكن تكون لسه ما اتسجلتش. حط الربط (bindings) في <code>register</code> وأي حاجة بتستخدم خدمات (زي إعدادات الـ Eloquent أو الـ View) في <code>boot</code>.",
      interview: [
        { q: "إيه الفرق بين <code>register</code> و <code>boot</code> في الـ service provider؟", a: "<code>register</code> وظيفتها الوحيدة تسجّل bindings في الـ service container، ومينفعش تعتمد على أي خدمة تانية لأن باقي الـ providers لسه ما اتسجلوش. <code>boot</code> بتتنادى بعد ما كل الـ providers عملوا <code>register</code>، فتقدر تستخدم أي خدمة: تسجّل routes أو view composers أو تظبط إعدادات الـ Eloquent." },
      ],
    },
    {
      title: "Artisan: أداة الـ CLI",
      en: "Artisan commands",
      body: "<p><code>artisan</code> ملف في جذر المشروع بيشغّل كل أوامر الـ CLI. الأوامر دي بتولّد الكود وبتشغّل المايجريشن وبتفحص التطبيق، وإنت هتستخدمها طول اليوم.</p>",
      code: {
        lang: "bash",
        src: `php artisan serve                  # dev server on port 8000
php artisan list                   # every available command
php artisan make:model Listing -mf # model + migration + factory
php artisan make:controller ListingController --api
php artisan make:request StoreListingRequest
php artisan migrate                # run pending migrations
php artisan route:list             # every route in the app
php artisan tinker                 # PHP REPL with the app loaded
php artisan config:clear           # drop the config cache
php artisan optimize:clear         # clear all cached files`,
        note: "الـ flags اللي على <code>make:model</code>: <code>-m</code> مايجريشن، <code>-f</code> فاكتوري، <code>-c</code> كنترولر، <code>-a</code> كل حاجة. و <code>php artisan tinker</code> بتخليك تجرب الكود على الداتابيز الحقيقية من غير ما تعمل route.",
      },
      terms: [
        ["artisan", "أداة الأوامر", "CLI جاهزة مع Laravel لتوليد الكود وإدارة التطبيق."],
        ["tinker", "REPL", "بتشغّل كود PHP تفاعلي جوه التطبيق، مفيدة لتجربة الـ Eloquent."],
      ],
    },
    {
      title: ".env و config() ولماذا env() في ملفات config بس",
      en: "Environment and configuration",
      body: "<p>الإعدادات اللي بتتغير من بيئة لبيئة (باسورد الداتابيز، مفاتيح الـ API) بتتحط في ملف <code>.env</code> وهو <b>مش بيتعمله commit</b>. وملفات <code>config/*.php</code> هي اللي بتقرأ منه بـ <code>env()</code> وتحط له قيمة افتراضية. والكود بتاعك بيقرأ الإعدادات بـ <code>config('app.name')</code> (الاسم الأول هو اسم الملف).</p>",
      code: {
        lang: "php",
        title: "config/listings.php",
        src: `<?php

return [
    'per_page' => (int) env('LISTINGS_PER_PAGE', 15),
    'max_photos' => 10,
];

// anywhere in the app:
// config('listings.per_page');          // 15
// config('listings.missing', 'x');      // 'x' (default)`,
        note: "الملف <code>.env</code> فيه سطر <code>LISTINGS_PER_PAGE=20</code>، فـ <code>config('listings.per_page')</code> هترجع 20. لو السطر مش موجود هترجع 15.",
      },
      pitfall: "متستخدمش <code>env()</code> برا ملفات <code>config</code>. في الـ production بنشغّل <code>php artisan config:cache</code> فـ Laravel بتجمّع كل الإعدادات في ملف واحد ومبتحملش <code>.env</code> تاني، و<code>env()</code> وقتها بترجع <code>null</code>. جربتها: بعد <code>config:cache</code> كان <code>env('APP_NAME')</code> بترجع <code>NULL</code> و <code>config('app.name')</code> بترجع القيمة صح. الحل: <code>env</code> في config، و <code>config()</code> في الباقي.",
      interview: [
        { q: "ليه المفروض نستخدم <code>env()</code> جوه ملفات config بس ونقرأ بـ <code>config()</code> في باقي الكود؟", a: "لأن الـ production بيشغّل <code>config:cache</code> اللي بيدمج الإعدادات في ملف واحد، وبعدها Laravel مبتحملش ملف <code>.env</code>، فأي <code>env()</code> برا ملفات config بترجع <code>null</code>. ولو قريت من <code>config()</code> الكود بيشتغل في الحالتين، وكمان الإعدادات بتبقى في مكان واحد واضح وسهل اختباره (<code>config(['x' => 1])</code> في الاختبارات)." },
      ],
    },
    {
      title: "خريطة الفولدرات",
      en: "Project folders",
      points: [
        "<code>app/</code>: كودك: <code>Models</code> و <code>Http/Controllers</code> و <code>Http/Requests</code> و <code>Providers</code> وبعدين أي فولدر تضيفه (Enums, Rules, Services).",
        "<code>routes/</code>: <code>web.php</code> و <code>api.php</code> و <code>console.php</code>. مين بيدخل على أنهي الـ URL.",
        "<code>database/</code>: <code>migrations</code> و <code>factories</code> و <code>seeders</code>. شكل الداتابيز وبيانات التجربة.",
        "<code>resources/</code>: <code>views</code> (Blade) والـ JS و CSS قبل البناء.",
        "<code>storage/</code>: ملفات بيكتبها التطبيق: <code>logs</code> و <code>framework</code> (cache, sessions) و <code>app</code> (الملفات المرفوعة). لازم يبقى writable.",
        "<code>public/</code>: الـ document root: <code>index.php</code> والأصول المبنية. الوحيد المكشوف.",
        "<code>config/</code> و <code>bootstrap/</code> و <code>tests/</code> و <code>vendor/</code> (حزم Composer، مبنعدّلش فيها ومبنعملهاش commit).",
      ],
      focus: [{ label: "قاعدة بسيطة", text: "لو سألت نفسك «أحط الكود فين؟»: بيانات وقواعد في <code>app/Models</code>، التعامل مع الريكويست في <code>app/Http</code>، شكل الجداول في <code>database/migrations</code>، وتوزيع الـ URLs في <code>routes</code>." }],
      interview: [
        { q: "إيه الفرق بين <code>routes/web.php</code> و <code>routes/api.php</code> في الإعداد الافتراضي؟", a: "<code>web.php</code> بيتحمّل مع group الـ <code>web</code> middleware (session و cookies و CSRF)، ومناسب لصفحات المتصفح. <code>api.php</code> بيتحمّل مع group الـ <code>api</code>، من غير session أو CSRF، وكل الـ URIs فيه بتبدأ تلقائي بـ <code>/api</code>، ومناسب لتطبيقات الموبايل والـ SPA. في Laravel 11 ملف الـ api مش بيتعمل لوحده، بنضيفه بـ <code>php artisan install:api</code>." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: route بسيط يرجّع JSON",
      lang: "php",
      code: `<?php

use Illuminate\\Support\\Facades\\Route;

Route::get('/ping', function () {
    return response()->json(['ok' => true]);
});`,
    },
    {
      title: "اكتب: ملف config بقيم من env",
      lang: "php",
      code: `<?php

return [
    'name' => env('APP_NAME', 'Laravel'),
    'debug' => (bool) env('APP_DEBUG', false),
    'per_page' => (int) env('LISTINGS_PER_PAGE', 15),
    'timezone' => 'UTC',
];`,
    },
    {
      title: "اكتب: bootstrap/app.php",
      lang: "php",
      code: `<?php

use Illuminate\\Foundation\\Application;
use Illuminate\\Foundation\\Configuration\\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(at: '*');
    })
    ->create();`,
    },
  ],

  tasks: [
    {
      title: "route يقرأ إعداد من config",
      lang: "php",
      prompt: "<p>في <code>routes/web.php</code> اكتب route على <code>GET /about</code> بيرجّع JSON فيه مفتاحين: <code>app</code> (قيمة <code>config('app.name')</code>) و <code>per_page</code> (قيمة <code>config('listings.per_page')</code> ولو مش موجودة ترجع 15). ما تستخدمش <code>env()</code> هنا.</p>",
      examples: [{ in: "GET /about", out: "{\"app\":\"Laravel\",\"per_page\":15}" }],
      hints: [
        "<code>config('key', $default)</code> بتاخد قيمة افتراضية كـ argument تاني.",
        "<code>response()->json([...])</code> أو ترجّع array مباشرة وLaravel هتحوله JSON.",
      ],
      solution: `<?php

use Illuminate\\Support\\Facades\\Route;

Route::get('/about', function () {
    return response()->json([
        'app' => config('app.name'),
        'per_page' => config('listings.per_page', 15),
    ]);
});`,
      explain: "الكود بيقرأ من <code>config()</code> مش <code>env()</code> عشان يفضل شغال بعد <code>config:cache</code>. الـ argument التاني قيمة احتياطية لو الملف <code>config/listings.php</code> مش موجود أو المفتاح ناقص.",
    },
    {
      title: "ملف config لإعدادات الإعلانات",
      lang: "php",
      prompt: "<p>اكتب محتوى <code>config/listings.php</code> بيرجّع array فيها: <code>per_page</code> (رقم صحيح، من <code>LISTINGS_PER_PAGE</code> والافتراضي 15)، و <code>featured_limit</code> (رقم صحيح، من <code>FEATURED_LIMIT</code> والافتراضي 10)، و <code>allow_guest_inquiries</code> (boolean، من <code>ALLOW_GUEST_INQUIRIES</code> والافتراضي true). وبعدها اكتب كمان سطر واحد بيقرأ <code>featured_limit</code>.</p>",
      hints: [
        "ملف config بيعمل <code>return [...]</code> بس.",
        "القيم في <code>.env</code> دايما نصوص، فاعمل cast: <code>(int)</code> و <code>(bool)</code>.",
      ],
      solution: `<?php

return [
    'per_page' => (int) env('LISTINGS_PER_PAGE', 15),
    'featured_limit' => (int) env('FEATURED_LIMIT', 10),
    'allow_guest_inquiries' => (bool) env('ALLOW_GUEST_INQUIRIES', true),
];

// reading it elsewhere:
// $limit = config('listings.featured_limit');`,
      explain: "كل قيمة في <code>.env</code> نص. الـ <code>env()</code> في Laravel بتحوّل النصوص <code>true</code> و <code>false</code> و <code>null</code> لقيمها الحقيقية، لكن الـ cast الصريح بيوضح النوع للي بيقرأ. القراءة من باقي التطبيق بتتم بـ <code>config('listings.featured_limit')</code>.",
    },
    {
      title: "رد JSON لأي 404 تحت /api",
      lang: "php",
      prompt: "<p>اكتب الـ callback اللي بيتحط جوه <code>withExceptions</code> في <code>bootstrap/app.php</code>، بحيث لو الـ exception من نوع <code>NotFoundHttpException</code> والريكويست رايح لمسار بيبدأ بـ <code>api/</code> يرجّع JSON <code>{\"message\": \"Not found\"}</code> بكود 404. اكتب الـ <code>use</code> statements اللازمة كمان.</p>",
      hints: [
        "<code>$exceptions->render(function (NotFoundHttpException $e, Request $request) {...})</code>.",
        "<code>$request->is('api/*')</code> بتفحص المسار. لو ما رجّعتش حاجة Laravel بتكمل بالـ handler الافتراضي.",
      ],
      solution: `<?php

use Illuminate\\Foundation\\Configuration\\Exceptions;
use Illuminate\\Http\\Request;
use Symfony\\Component\\HttpKernel\\Exception\\NotFoundHttpException;

// inside ->withExceptions(function (Exceptions $exceptions) { ... })
$exceptions->render(function (NotFoundHttpException $e, Request $request) {
    if ($request->is('api/*')) {
        return response()->json(['message' => 'Not found'], 404);
    }
});`,
      explain: "<code>render</code> بتاخد closure، ونوع الـ exception في الـ type hint هو اللي بيحدد إمتى تتنادى. لو الـ closure مرجّعتش ريسبونس (زي حالة الصفحات العادية) بنكمل بالـ rendering الافتراضي (صفحة 404 HTML). جربت الكود ده فعلا: طلب لـ <code>/api/nothing-here</code> رجّع JSON.",
    },
  ],

  quiz: [
    {
      q: "أنهي ملف هو نقطة الدخول الوحيدة لكل ريكويست HTTP في Laravel؟",
      options: [
        "<code>artisan</code>",
        "<code>public/index.php</code>",
        "<code>routes/web.php</code>",
        "<code>bootstrap/app.php</code>",
      ],
      answer: 1,
      why: "<code>public/index.php</code> هو اللي الـ web server بيوجّه له الطلبات. <code>bootstrap/app.php</code> بيتحمّل منه عشان يبني الـ application، و<code>routes/web.php</code> بيتقرأ بعد كده، و<code>artisan</code> للـ CLI مش للـ HTTP.",
    },
    {
      q: "عندك providerين A و B، وكل واحد بيطبع في <code>register</code> و <code>boot</code>. الترتيب الصح للطباعة؟",
      options: [
        "A register، A boot، B register، B boot",
        "A boot، B boot، A register، B register",
        "A register، B register، A boot، B boot",
        "B register، A register، B boot، A boot",
      ],
      answer: 2,
      why: "Laravel بتنادي <code>register</code> على كل الـ providers الأول وبعدين <code>boot</code> على كلهم، عشان وقت <code>boot</code> كل الخدمات تكون اتسجلت. الاختيار الأول هو الفخ الشائع: تفتكر إن كل provider بيخلص لوحده.",
    },
    {
      q: "عندك <code>$title = env('APP_NAME');</code> جوه controller. الموقع شغال كويس محليا، وبعد النشر مع <code>php artisan config:cache</code> ظهرت <code>null</code>. السبب؟",
      options: [
        "ملف <code>.env</code> اتمسح من السيرفر",
        "<code>config:cache</code> بيمنع قراءة أي إعدادات",
        "بعد الكاش Laravel مبتحملش <code>.env</code> فـ <code>env()</code> برا ملفات config بترجع null",
        "<code>env()</code> بترجع null في الـ controllers دايما",
      ],
      answer: 2,
      why: "بعد <code>config:cache</code> الإعدادات كلها في ملف واحد ومفيش تحميل لـ <code>.env</code>. الحل إن <code>env</code> تتنادى في ملف config والكود يقرأ بـ <code>config('app.name')</code>. محليا من غير كاش بتشتغل، وده اللي بيخلي المشكلة تبان في الـ production بس.",
    },
    {
      q: "إيه اللي بيرجع من السطر ده لو مفيش ملف <code>config/listings.php</code>؟",
      code: { lang: "php", src: `<?php
echo config('listings.per_page', 15);` },
      answer: ["15"],
      why: "الـ argument التاني في <code>config()</code> هو القيمة الافتراضية وبيرجع لما المفتاح مش موجود. اطبع <code>15</code>.",
    },
    {
      q: "في Laravel 11، فين بتعرّف إن الـ route الـ api موجود وتظبط الـ middleware والـ exception handling؟",
      options: [
        "<code>app/Http/Kernel.php</code>",
        "<code>app/Exceptions/Handler.php</code> و <code>RouteServiceProvider</code>",
        "<code>config/app.php</code> في مفتاح <code>providers</code>",
        "<code>bootstrap/app.php</code>",
      ],
      answer: 3,
      why: "من Laravel 11 الـ <code>withRouting</code> و <code>withMiddleware</code> و <code>withExceptions</code> كلهم في <code>bootstrap/app.php</code>. الخيارات التانية هي شكل الإصدارات اللي قبل 11 (Kernel و Handler و RouteServiceProvider).",
    },
    {
      q: "أنهي واحد من دول <b>مينفعش</b> يتحط في <code>register()</code> بتاع provider؟",
      options: [
        "<code>$this->app->bind('greeting', fn () => 'hello');</code>",
        "<code>$this->app->singleton(Clock::class, SystemClock::class);</code>",
        "استدعاء خدمة اتسجلت في provider تاني واستخدامها",
        "<code>$this->mergeConfigFrom(...)</code> لدمج ملف إعدادات",
      ],
      answer: 2,
      why: "جوه <code>register</code> مضمونش إن الـ providers التانية اتسجلت. تسجيل bindings ودمج الإعدادات تمام، لكن استخدام خدمة من provider تاني لازم يتأجل لـ <code>boot</code>.",
    },
    {
      q: "أنهي أمر artisan بيولّد model ومعاه migration وfactory في خطوة واحدة؟",
      options: [
        "<code>php artisan make:model Listing -mf</code>",
        "<code>php artisan make:model Listing --route</code>",
        "<code>php artisan model:create Listing</code>",
        "<code>php artisan make:listing --full</code>",
      ],
      answer: 0,
      why: "الـ flags <code>-m</code> للمايجريشن و <code>-f</code> للفاكتوري (و <code>-a</code> لكل حاجة). الأمرين التانيين مش موجودين أصلا في Laravel.",
    },
    {
      q: "ليه المفروض الـ document root على السيرفر يشاور على فولدر <code>public</code> مش على جذر المشروع؟",
      options: [
        "لأن <code>index.php</code> بس يقدر يشتغل من جذر المشروع",
        "عشان باقي الملفات، زي <code>.env</code> والكود، متبقاش قابلة للتحميل من المتصفح",
        "لأن Composer بيحتاج كده",
        "لأن <code>artisan</code> بيتطلب ده",
      ],
      answer: 1,
      why: "<code>public</code> هو المجلد الوحيد المفروض يتشاف من برا. لو الـ root هو جذر المشروع، ممكن حد يكتب <code>/.env</code> في المتصفح ويشوف الأسرار. الأسباب الباقية مش حقيقية.",
    },
    {
      q: "فحص «لو الـ token مش موجود رجّع 401 قبل ما الـ controller يشتغل» الأنسب يتحط فين؟",
      options: [
        "في الـ controller نفسه فقط",
        "في الـ migration",
        "في <code>AppServiceProvider::register</code>",
        "في middleware، لأنه بيتنفذ قبل الـ controller ويقدر يوقف الريكويست",
      ],
      answer: 3,
      why: "الـ middleware بيتنفذ على الريكويست قبل الـ controller وممكن يرجّع ريسبونس مباشرة. ممكن تكتب الفحص في الـ controller، لكن تكراره في كل method غلط، والـ middleware بيطبقه على مجموعة routes كاملة.",
    },
  ],
};
