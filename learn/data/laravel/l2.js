window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l2"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "الـ route هو الباب، والـ controller هو الموظف",
      en: "Routing and controllers overview",
      body: "<p>الـ routing بيجاوب سؤال واحد: «الـ URL ده مع الـ HTTP verb ده يروح لأنهي كود؟». وبعده الـ controller بياخد الريكويست ويرجّع ريسبونس. أغلب إنترفيوهات الـ back-end بتسأل: الفرق بين <code>web.php</code> و <code>api.php</code>، وإيه الـ resource controller، وإيه الـ route model binding.</p><p>بنبني هنا API لإعلانات عقارية: <code>/api/listings</code> و <code>/api/offices</code>.</p>",
      points: [
        "<code>routes/web.php</code>: للصفحات، فيه session و CSRF. <code>routes/api.php</code>: للـ API، من غير session وكل الـ URIs بتبدأ بـ <code>/api</code>.",
        "في Laravel 11 ملف الـ api مش موجود في مشروع جديد: بتشغّل <code>php artisan install:api</code> فيتضاف الملف ومعاه Sanctum وجدول tokens.",
        "الـ controller كلاس عادي في <code>app/Http/Controllers</code> اتولد بـ <code>php artisan make:controller</code>.",
      ],
      pitfall: "<code>install:api</code> بيعدّل <code>bootstrap/app.php</code> (بيضيف سطر <code>api:</code> في <code>withRouting</code>) وبيعمل migration لجدول <code>personal_access_tokens</code> ويشغّله. شغلتها في مشروع تجربة وكانت بتخلّص من غير أسئلة لما استخدمت <code>--no-interaction</code>.",
    },
    {
      title: "الـ verbs والـ routes الأساسية",
      en: "HTTP verbs",
      body: "<p>كل verb معناه عملية، وده اللي بنبني عليه REST: <code>GET</code> قراءة (من غير تغيير بيانات)، <code>POST</code> إنشاء، <code>PUT</code> و <code>PATCH</code> تعديل (<code>PUT</code> استبدال كامل، <code>PATCH</code> تعديل جزئي)، <code>DELETE</code> مسح.</p>",
      code: {
        lang: "php",
        title: "routes/api.php",
        src: `<?php

use App\\Http\\Controllers\\ListingController;
use Illuminate\\Support\\Facades\\Route;

Route::get('/listings', [ListingController::class, 'index']);
Route::post('/listings', [ListingController::class, 'store']);
Route::get('/listings/{listing}', [ListingController::class, 'show']);
Route::put('/listings/{listing}', [ListingController::class, 'update']);
Route::patch('/listings/{listing}', [ListingController::class, 'update']);
Route::delete('/listings/{listing}', [ListingController::class, 'destroy']);

// a closure works too, but controllers are what you ship
Route::get('/ping', fn () => ['ok' => true]);`,
        note: "الـ array <code>[ListingController::class, 'index']</code> معناها: الكلاس والـ method. ولو رجّعت array من closure أو controller، Laravel بتحوّله JSON تلقائيا. الـ prefix <code>/api</code> بيتضاف لوحده للملف ده.",
      },
      interview: [
        { q: "إيه الفرق بين PUT و PATCH؟", a: "<code>PUT</code> معناها استبدال الـ resource كله بالبيانات المبعوتة، فالمفروض تبعت كل الحقول. <code>PATCH</code> تعديل جزئي: تبعت اللي اتغير بس. في Laravel الاتنين بيروحوا لنفس method عادة (<code>update</code>) والـ resource routes بتسجّلهم مع بعض، والفرق بتفرضه إنت من خلال قواعد الـ validation (<code>required</code> للـ PUT و <code>sometimes</code> للـ PATCH مثلا)." },
      ],
    },
    {
      title: "بارامترات الـ route والقيود عليها",
      en: "Route parameters and constraints",
      body: "<p>أي حاجة بين أقواس <code>{ }</code> في الـ URL بتتحول لبارامتر وبتتمرر لدالتك. بتقدر تخليه اختياري بـ <code>?</code> وتحدد شكله بـ constraint، فالـ route ميطابقش غير لو الشكل صح.</p>",
      code: {
        lang: "php",
        src: `<?php

use Illuminate\\Support\\Facades\\Route;

Route::get('/offices/{office}', function (string $office) {
    return "office $office";
})->whereNumber('office');

Route::get('/search/{city?}', function (string $city = 'Riyadh') {
    return "city: $city";
});

Route::get('/offices/{office}/listings/{listing}', function ($office, $listing) {
    return "$office / $listing";   // matched by position, not by name
})->where('listing', '[0-9]+');`,
        note: "لو بعت <code>/offices/abc</code> للـ route الأول، مفيش route بيطابق فيرجع 404 (مش خطأ في الكود). الـ constraint بيشتغل قبل ما الكنترولر يتنادى.",
      },
      pitfall: "البارامترات بتتحقن بالترتيب مش بالاسم، وبيجيوا بعد أي dependencies بتحقنها (زي <code>Request</code>). الـ optional parameter لازم يكون له قيمة افتراضية في الدالة (<code>$city = 'Riyadh'</code>).",
    },
    {
      title: "الأسماء والـ groups",
      en: "Named routes and groups",
      body: "<p>الـ <b>named route</b> بيخليك تولّد الـ URL من اسمه بدل ما تكتبه بإيدك، فلو غيرت الـ URL بعدين مفيش حاجة تتكسر. والـ <b>group</b> بيحط إعدادات مشتركة (prefix، middleware، name) على مجموعة routes مرة واحدة.</p>",
      code: {
        lang: "php",
        src: `<?php

use App\\Http\\Controllers\\OfficeController;
use Illuminate\\Support\\Facades\\Route;

Route::prefix('offices')->name('offices.')->group(function () {
    Route::get('/', [OfficeController::class, 'index'])->name('index');
    Route::get('/{office}', [OfficeController::class, 'show'])
        ->whereNumber('office')
        ->name('show');
});

// middleware on a whole group
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/ping', fn () => ['ok' => true])->name('ping');
});

route('offices.show', 5);              // http://localhost/api/offices/5
route('offices.show', 5, false);       // /api/offices/5  (relative)
route('offices.show', ['office' => 5, 'ref' => 'x']);   // ...?ref=x`,
        note: "الاسم النهائي = <code>name('offices.')</code> بتاع الـ group + اسم الـ route نفسه. وأي بارامتر زيادة مش في الـ URL بيتحول لـ query string.",
      },
      interview: [
        { q: "إيه فايدة الـ named routes؟", a: "بتخليني أولّد الـ URL بـ <code>route('offices.show', $office)</code> بدل ما أكتب النص بإيدي في كل مكان (redirects، الـ views، الـ API resources). لو غيرت شكل الـ URL بعدين أغير في تعريف الـ route بس. وكمان بتتعامل مع البارامترات والـ query string بشكل صح." },
      ],
    },
    {
      title: "الـ Resource و API Resource controllers",
      en: "Resource controllers",
      body: "<p>أغلب الـ CRUD بيتكرر بنفس الشكل، فـ Laravel بتوفر سطر واحد يسجّل كل الـ routes. <code>Route::resource</code> بيسجّل <b>7</b> actions، و <code>Route::apiResource</code> بيسجّل <b>5</b> (من غير <code>create</code> و <code>edit</code> لأنهم صفحات فورم ومالهمش لازمة في API).</p>",
      code: {
        lang: "text",
        title: "Route::apiResource('listings', ListingController::class)",
        src: `GET|HEAD   api/listings                  index    list
POST       api/listings                  store    create
GET|HEAD   api/listings/{listing}        show     one
PUT|PATCH  api/listings/{listing}        update   change
DELETE     api/listings/{listing}        destroy  remove

Route::resource also adds:
GET|HEAD   listings/create               create   form
GET|HEAD   listings/{listing}/edit       edit     form`,
        note: "الأسماء بتتولّد لوحدها: <code>listings.index</code> و <code>listings.store</code> وهكذا. تقدر تحدد اللي عايزه: <code>->only(['index', 'show'])</code> أو <code>->except(['destroy'])</code>.",
      },
      terms: [
        ["resource controller", "كنترولر الموارد", "كنترولر بالـ methods المعيارية index/store/show/update/destroy (وcreate/edit للصفحات)."],
        ["invokable controller", "كنترولر بـ method واحدة", "كلاس فيه <code>__invoke</code> بس، لـ action واحدة."],
      ],
      interview: [
        { q: "إيه الـ actions اللي بيعملها <code>Route::resource</code> وإيه الفرق بينه وبين <code>apiResource</code>؟", a: "<code>resource</code> بيعمل سبع routes: <code>index</code> و <code>create</code> و <code>store</code> و <code>show</code> و <code>edit</code> و <code>update</code> و <code>destroy</code>. <code>apiResource</code> بيحذف <code>create</code> و <code>edit</code> لأنهم بيعرضوا فورم HTML، فبيطلع خمسة. الأمر <code>php artisan make:controller ListingController --api</code> بيولّد كنترولر بالخمس methods دول." },
      ],
    },
    {
      title: "الـ controller: كلاس بيرجّع ريسبونس",
      en: "A controller class",
      body: "<p>الـ controller بياخد الريكويست (والـ model لو فيه binding)، بيعمل الشغل، وبيرجّع ريسبونس. المنطق الثقيل مش مكانه هنا لما المشروع يكبر، لكن دلوقتي هنبقيه صغير.</p>",
      code: {
        lang: "php",
        title: "app/Http/Controllers/ListingController.php",
        src: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Listing;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class ListingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $listings = Listing::query()
            ->published()
            ->when($request->query('max_price'), fn ($q, $max) => $q->where('price', '<=', $max))
            ->latest()
            ->get();

        return response()->json($listings);
    }

    public function show(Listing $listing): JsonResponse
    {
        return response()->json($listing);
    }

    public function destroy(Listing $listing): JsonResponse
    {
        $listing->delete();

        return response()->json(null, 204);
    }
}`,
        note: "<code>$request->query('max_price')</code> بتقرأ من الـ query string. <code>when(...)</code> بتضيف الشرط بس لو القيمة موجودة. و <code>published()</code> هو local scope هنتكلم عنه في Eloquent. الـ <code>204</code> معناها «نجح ومفيش جسم»."
      },
      pitfall: "الـ route بيتسجل حتى لو الـ controller غلط، والفشل بيظهر وقت الطلب. ولو كتبت <code>ListingController::class</code> في ملف الـ routes من غير <code>use</code> للكلاس هيطلع خطأ إن الكلاس مش موجود. اعمل <code>use</code> دايما واكتب الـ route بـ <code>::class</code>.",
    },
    {
      title: "Invokable controller",
      en: "Single action controllers",
      body: "<p>لو الكنترولر بيعمل حاجة واحدة بس، حط فيه method واسمها <code>__invoke</code> وسجّله من غير اسم method. مفيد لإجراءات زي «الإعلانات المميزة» أو «تسجيل الخروج».</p>",
      code: {
        lang: "php",
        src: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Listing;
use Illuminate\\Http\\JsonResponse;

class FeaturedListingsController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json(
            Listing::where('is_featured', true)->limit(10)->get()
        );
    }
}

// routes/api.php  (BEFORE the apiResource line!)
// Route::get('/listings/featured', FeaturedListingsController::class);`,
        note: "الـ route بيتسجل بالكلاس بس من غير array. تولّده بـ <code>php artisan make:controller FeaturedListingsController --invokable</code>.",
      },
      pitfall: "الترتيب مهم. لو سجلت <code>apiResource('listings')</code> قبل <code>/listings/featured</code>، الـ URL <code>/listings/featured</code> هيطابق <code>/listings/{listing}</code> الأول و<code>featured</code> هتتعامل كأنها id وتطلع 404. حط الـ routes الثابتة قبل اللي فيها بارامترات.",
    },
    {
      title: "Route model binding",
      en: "Implicit, custom-key and scoped binding",
      body: "<p>بدل ما تاخد <code>$id</code> وتعمل <code>Listing::findOrFail($id)</code> بإيدك، لو سمّيت البارامتر نفس اسم الـ variable واكتبت نوع الـ model، Laravel بتجيب السجل لوحدها. ولو مالقتوش بترجّع 404 تلقائي. ده اسمه <b>implicit binding</b>.</p>",
      code: {
        lang: "php",
        src: `<?php

use App\\Http\\Controllers\\OfficeController;
use App\\Http\\Controllers\\OfficeListingController;
use Illuminate\\Support\\Facades\\Route;

// implicit: {listing} + Listing $listing
// public function show(Listing $listing) { ... }

// custom key: search by license_no instead of id
Route::get('/offices/by-license/{office:license_no}', [OfficeController::class, 'show']);

// scoped: the listing must belong to that office, otherwise 404
Route::get('/offices/{office}/listings/{listing}', [OfficeListingController::class, 'show'])
    ->scopeBindings();`,
        note: "من غير <code>scopeBindings()</code>، الـ route الأخير هيرجّع إعلان تابع لمكتب تاني لو الـ id بتاعه موجود. جربتها: مع المكتب الغلط من غير scope النتيجة 200، ومعاه 404. تقدر كمان تغيّر المفتاح الافتراضي من الـ model بـ <code>getRouteKeyName()</code>.",
      },
      focus: [{ label: "احفظها", text: "implicit binding بيحتاج تطابق اسم البارامتر مع اسم الـ variable (<code>{listing}</code> و <code>$listing</code>). المفتاح الافتراضي <code>id</code>، و <code>{office:license_no}</code> بيغيّره، و <code>scopeBindings()</code> بيضمن إن الابن تابع للأب." }],
      interview: [
        { q: "إيه هو route model binding وإيه فرق implicit عن explicit؟", a: "الـ implicit binding إن الـ route فيه <code>{listing}</code> والـ controller عنده <code>Listing $listing</code> فـ Laravel بتعمل query بالـ id وبتحقن الـ model، ولو مش موجود 404 تلقائي. الـ explicit بتعرّفه بنفسك في <code>Route::model('listing', Listing::class)</code> أو <code>Route::bind</code> لما تحتاج منطق مخصص في إيجاد السجل. وبنغيّر المفتاح بـ <code>{listing:slug}</code> أو <code>getRouteKeyName()</code>." },
        { q: "عندي route متداخل <code>/offices/{office}/listings/{listing}</code>. إيه المشكلة الأمنية لو ما استخدمتش scoped bindings؟", a: "من غير scope، Laravel بتجيب الـ Listing بالـ id بس من غير ما تتأكد إنه تابع للـ Office في الـ URL. ممكن أي مستخدم يقرأ إعلان مكتب تاني بتغيير الـ office id. بنضيف <code>->scopeBindings()</code> فتتأكد إن الإعلان تابع للمكتب (عن طريق علاقة <code>listings</code>) وإلا 404، ولازم برضه policies للصلاحيات." },
      ],
    },
    {
      title: "الريسبونس: JSON وأكواد الحالة",
      en: "JSON responses and status codes",
      body: "<p>كود الحالة جزء من عقد الـ API. أكتر الأكواد استخداما: <b>200</b> نجاح، <b>201</b> اتعمل سجل جديد، <b>204</b> نجح ومفيش جسم (بعد الحذف)، <b>401</b> مش مسجّل دخول، <b>403</b> مسجّل بس مالوش صلاحية، <b>404</b> مش موجود، <b>422</b> بيانات غلط، <b>429</b> زيادة طلبات، و <b>500</b> خطأ سيرفر.</p>",
      code: {
        lang: "php",
        src: `<?php

// array or Eloquent model/collection -> JSON automatically
return ['ok' => true];
return $listing;

// explicit status codes
return response()->json($listing, 201);
return response()->json(null, 204);
return response()->json(['message' => 'Not yours'], 403);

// stop and return 404 from anywhere
abort(404);
abort(403, 'Not your listing');

// a model that is not found
Listing::findOrFail(999);   // ModelNotFoundException -> 404`,
        note: "الـ <code>findOrFail</code> بترمي exception وLaravel بتحوله لـ 404. لو الريكويست JSON (<code>Accept: application/json</code>) بيرجع JSON، ولو لا بيرجع صفحة HTML. الـ API clients لازم يبعتوا الـ header ده.",
      },
      pitfall: "لو الـ client مبعتش <code>Accept: application/json</code> وحصل خطأ، هيجيله redirect أو صفحة HTML بدل JSON (خصوصا مع الـ validation). في الـ API اتأكد إن الـ client بيبعت الـ header، أو ظبط <code>shouldRenderJsonWhen</code> للمسارات <code>api/*</code> في <code>bootstrap/app.php</code>.",
      interview: [
        { q: "إيه الكود المناسب لـ: إنشاء سجل، حذف سجل، بيانات غلط، مستخدم من غير صلاحية؟", a: "الإنشاء <b>201 Created</b> ومعاه السجل الجديد (والأفضل header اسمه Location). الحذف <b>204 No Content</b>. البيانات الغلط <b>422 Unprocessable Entity</b> ومعاها الأخطاء لكل حقل. من غير صلاحية: <b>403 Forbidden</b> لو مسجّل دخول، و<b>401 Unauthorized</b> لو مش مسجّل أصلا." },
      ],
    },
    {
      title: "route:list والكاش",
      en: "route:list and route caching",
      body: "<p><code>php artisan route:list</code> بتطبع كل الـ routes: الـ verb والـ URI والاسم والـ controller والـ middleware. هي أول حاجة تعملها لما route مش بيشتغل.</p><p>وفي الـ production بنشغّل <code>php artisan route:cache</code> عشان Laravel تجمّع كل التسجيل في ملف واحد وتتخطى قراءة ملفات الـ routes وتطابق أسرع.</p>",
      code: {
        lang: "bash",
        src: `php artisan route:list
php artisan route:list --except-vendor        # hide vendor routes
php artisan route:list --path=offices         # filter by URI
php artisan route:list --name=listings        # filter by route name
php artisan route:list --json

php artisan route:cache     # production: build the cache
php artisan route:clear     # after changing routes, drop the cache`,
        note: "بعد <code>route:cache</code> أي تعديل في ملفات الـ routes مش هيظهر لحد ما تشغّل <code>route:cache</code> تاني أو <code>route:clear</code>. وعمليا بنشغّل <code>php artisan optimize</code> في النشر وهو بيعمل كاش للـ config والـ routes والـ views والـ events.",
      },
      interview: [
        { q: "ليه بنعمل <code>route:cache</code> في الـ production، وإيه الحاجة اللي لازم نحذر منها؟", a: "بيحوّل تسجيل كل الـ routes لملف PHP واحد جاهز فمفيش parsing لملفات الـ routes في كل ريكويست، وده بيسرّع التطبيق خصوصا مع routes كتير. التحذير: التعديلات في ملفات الـ routes مش بتتشاف إلا بعد إعادة الكاش، فلازم يبقى جزء من خطوات النشر، ومحلياً لازم تعمل <code>route:clear</code> لو شغلته بالغلط." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: group بـ prefix وأسماء",
      lang: "php",
      code: `<?php

use Illuminate\\Support\\Facades\\Route;

Route::prefix('offices')->name('offices.')->group(function () {
    Route::get('/', [OfficeController::class, 'index'])->name('index');
    Route::get('/{office}', [OfficeController::class, 'show'])
        ->whereNumber('office')
        ->name('show');
});`,
    },
    {
      title: "اكتب: controller بـ route model binding",
      lang: "php",
      code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Listing;
use Illuminate\\Http\\JsonResponse;

class ListingController extends Controller
{
    public function show(Listing $listing): JsonResponse
    {
        return response()->json($listing);
    }
}`,
    },
    {
      title: "اكتب: ملف routes كامل",
      lang: "php",
      code: `<?php

use App\\Http\\Controllers\\FeaturedListingsController;
use App\\Http\\Controllers\\ListingController;
use Illuminate\\Support\\Facades\\Route;

Route::get('/ping', fn () => ['ok' => true])->name('ping');

Route::get('/listings/featured', FeaturedListingsController::class)
    ->name('listings.featured');

Route::apiResource('listings', ListingController::class);`,
    },
  ],

  tasks: [
    {
      title: "route بـ constraint واسم",
      lang: "php",
      prompt: "<p>سجّل route على <code>GET /listings/{listing}/summary</code> باسم <code>listings.summary</code>. الـ <code>{listing}</code> لازم يطابق أرقام بس (<code>whereNumber</code>) وتستخدم implicit binding على الـ model <code>Listing</code>. الـ closure يرجّع array فيها <code>id</code> و <code>title</code> و <code>price</code>.</p>",
      examples: [{ in: "GET /api/listings/5/summary", out: "{\"id\":5,\"title\":\"...\",\"price\":900000}" }],
      hints: [
        "الـ closure: <code>function (Listing $listing) { ... }</code>، واسم البارامتر في الـ URI لازم يكون <code>{listing}</code>.",
        "السلسلة: <code>Route::get(...)->whereNumber('listing')->name('listings.summary')</code>.",
      ],
      solution: `<?php

use App\\Models\\Listing;
use Illuminate\\Support\\Facades\\Route;

Route::get('/listings/{listing}/summary', function (Listing $listing) {
    return [
        'id' => $listing->id,
        'title' => $listing->title,
        'price' => $listing->price,
    ];
})->whereNumber('listing')->name('listings.summary');`,
      explain: "الـ binding بيحصل من اسم البارامتر و type hint معًا. لو الـ id مش موجود → 404 من غير ما تكتب سطر. و<code>whereNumber</code> بتمنع الـ URLs الغريبة قبل ما نوصل للداتابيز أصلا.",
    },
    {
      title: "store و destroy بأكواد الحالة الصح",
      lang: "php",
      prompt: "<p>في <code>ListingController</code> اكتب <code>store(Request $request)</code> اللي بيعمل <code>Listing::create(...)</code> من الحقول <code>office_id</code> و <code>title</code> و <code>price</code> فقط (<code>$request->only(...)</code>) وبيرجّع JSON بكود <b>201</b>. واكتب <code>destroy(Listing $listing)</code> اللي بيحذف وبيرجّع <b>204</b> من غير جسم. (الـ validation هنضيفه في المستوى الجاي.)</p>",
      hints: [
        "<code>response()->json($listing, 201)</code> و <code>response()->json(null, 204)</code>.",
        "<code>$request->only(['office_id', 'title', 'price'])</code> بترجع الحقول دي بس.",
      ],
      solution: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Listing;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class ListingController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $listing = Listing::create(
            $request->only(['office_id', 'title', 'price'])
        );

        return response()->json($listing, 201);
    }

    public function destroy(Listing $listing): JsonResponse
    {
        $listing->delete();

        return response()->json(null, 204);
    }
}`,
      explain: "استخدام <code>only</code> بدل <code>all()</code> مهم عشان الـ mass assignment (هنشوفه). الـ 201 للإنشاء والـ 204 للحذف بيخلوا الـ client يعرف النتيجة من الكود من غير ما يقرأ الجسم.",
    },
    {
      title: "ملف routes منظّم بإصدار v1",
      lang: "php",
      prompt: "<p>اكتب محتوى <code>routes/api.php</code> بحيث: كل الـ routes تحت group بـ prefix <code>v1</code> واسم يبدأ بـ <code>v1.</code>. جواه: <code>apiResource</code> للـ <code>listings</code> من غير <code>destroy</code>، و route على <code>GET /offices/{office}/listings/{listing}</code> باستخدام <code>OfficeListingController::show</code> مع <code>scopeBindings()</code> واسمه <code>offices.listings.show</code>. فاكر ترتيب الـ routes الثابتة (<code>/listings/featured</code> بـ invokable <code>FeaturedListingsController</code>) إنه قبل الـ resource.</p>",
      hints: [
        "<code>Route::prefix('v1')->name('v1.')->group(function () { ... });</code>",
        "<code>Route::apiResource('listings', ListingController::class)->except(['destroy'])</code>.",
      ],
      solution: `<?php

use App\\Http\\Controllers\\FeaturedListingsController;
use App\\Http\\Controllers\\ListingController;
use App\\Http\\Controllers\\OfficeListingController;
use Illuminate\\Support\\Facades\\Route;

Route::prefix('v1')->name('v1.')->group(function () {
    Route::get('/listings/featured', FeaturedListingsController::class)
        ->name('listings.featured');

    Route::apiResource('listings', ListingController::class)
        ->except(['destroy']);

    Route::get('/offices/{office}/listings/{listing}', [OfficeListingController::class, 'show'])
        ->scopeBindings()
        ->name('offices.listings.show');
});`,
      explain: "الـ prefix النهائي هيبقى <code>/api/v1/...</code> (الـ <code>api</code> من Laravel والـ <code>v1</code> منك). أسماء الـ resource هتبقى <code>v1.listings.index</code> وهكذا لأن الـ <code>name('v1.')</code> بيتضاف قدامها. الـ route الثابت <code>featured</code> قبل الـ resource عشان ما يتاخدش كـ id.",
    },
  ],

  quiz: [
    {
      q: "كام route بيسجّلها <code>Route::apiResource('listings', ListingController::class)</code>؟",
      code: { lang: "php", src: `<?php
Route::apiResource('listings', ListingController::class);` },
      answer: ["5", "خمسة"],
      why: "<code>index</code> و <code>store</code> و <code>show</code> و <code>update</code> (PUT و PATCH بيتحسبوا route واحد بيطابق verbين) و <code>destroy</code>. أما <code>Route::resource</code> فبيزود <code>create</code> و <code>edit</code> فيبقى 7.",
    },
    {
      q: "الـ routes دي مسجلة بالترتيب ده. إيه اللي بيحصل لما تطلب <code>GET /api/listings/featured</code>؟",
      code: { lang: "php", src: `<?php
Route::apiResource('listings', ListingController::class);
Route::get('/listings/featured', FeaturedListingsController::class);` },
      options: [
        "بيشتغل <code>FeaturedListingsController</code> عادي",
        "بيطابق <code>/listings/{listing}</code> الأول فتتعامل <code>featured</code> كأنها id وتطلع 404",
        "Laravel بتختار الـ route الأكثر تحديدا تلقائيا",
        "خطأ 500 لأن فيه تعارض بين الـ routes",
      ],
      answer: 1,
      why: "الـ router بياخد أول route بيطابق بالترتيب مش الأكثر تحديدا. <code>featured</code> بتطابق <code>{listing}</code>، والـ binding مالقاش Listing بالـ id ده فيرجع 404. الحل: الـ route الثابت قبل الـ resource.",
    },
    {
      q: "إيه اللي بيرجعه السطر ده؟",
      code: { lang: "php", src: `<?php
Route::get('/offices/{office}', [OfficeController::class, 'show'])
    ->name('offices.show');

echo route('offices.show', 5, false);` },
      options: [
        "<code>offices.show</code>",
        "<code>/offices/5</code>",
        "<code>/api/offices/5</code>",
        "<code>http://localhost/api/offices/5</code>",
      ],
      answer: 2,
      why: "الـ argument التالت <code>false</code> معناه URL نسبي من غير الدومين، والـ route ده في <code>routes/api.php</code> فبيتضاف له <code>/api</code> تلقائيا. من غير الـ <code>false</code> كان هيرجع الاختيار الرابع. (الاختيار التاني الفخ: نسيان prefix الـ api.)",
    },
    {
      q: "عندك <code>/offices/{office}/listings/{listing}</code> من غير <code>scopeBindings()</code>. المستخدم طلب إعلان تابع لمكتب 1 لكن كتب في الـ URL مكتب 2 (موجود). النتيجة؟",
      options: [
        "404 دايما لأن الإعلان مش تابع للمكتب",
        "403 تلقائي",
        "200 والإعلان بيرجع عادي (الـ binding مبيتأكدش من العلاقة)",
        "500 لأن الـ binding فشل",
      ],
      answer: 2,
      why: "كل binding بيتحل لوحده بالـ id، فالمكتب موجود والإعلان موجود وبيرجع 200. جربتها بنفسي. لازم <code>->scopeBindings()</code> (أو <code>{listing:id}</code> بمفتاح مخصص) عشان تتأكد من العلاقة.",
    },
    {
      q: "أنهي كود حالة هو الأنسب بعد <b>حذف</b> سجل بنجاح في API؟",
      options: [
        "204",
        "200 مع رسالة نصية فقط",
        "201",
        "202",
      ],
      answer: 0,
      why: "<code>204 No Content</code> معناها نجح ومفيش جسم. 201 للإنشاء، 202 معناها «اتقبل وهيتنفذ بعدين» (queue مثلا). 200 مقبولة لكن 204 هي المعتادة للحذف.",
    },
    {
      q: "ما الفرق الأساسي بين <code>routes/web.php</code> و <code>routes/api.php</code>؟",
      options: [
        "الـ web للـ GET بس والـ api لباقي الـ verbs",
        "الـ web بتحمّل session وCSRF، والـ api من غيرهم وكل URIs فيها بتبدأ بـ <code>/api</code>",
        "الـ web بتتعامل مع HTML بس والـ api مش بتدعم الـ controllers",
        "الـ api مش بتدعم route model binding",
      ],
      answer: 1,
      why: "الاختلاف في الـ middleware group (<code>web</code> فيه session وcookies وCSRF و<code>api</code> لأ) وفي الـ prefix. الاتنين بيدعموا كل الـ verbs والـ binding. الاتنين بيستخدموا controllers عادي، والـ web مش مقصورة على HTML.",
    },
    {
      q: "الـ route ده مكتوب كويس لكن الـ controller بيستقبل <code>Listing $item</code>. إيه اللي هيحصل؟",
      code: { lang: "php", src: `<?php
// routes/api.php
Route::get('/listings/{listing}', [ListingController::class, 'show']);

// ListingController.php
class ListingController extends Controller
{
    public function show(Listing $item) { /* ... */ }
}` },
      options: [
        "بيشتغل عادي لأن النوع <code>Listing</code> كافي",
        "بيجيب أول Listing في الجدول",
        "الـ implicit binding مش هيشتغل لأن الاسم مختلف، و<code>$item</code> هتبقى instance فاضية بدل ما تتجاب بالـ id",
        "Laravel بتعمل الربط بالترتيب فيشتغل",
      ],
      answer: 2,
      why: "الـ implicit binding بيطابق اسم البارامتر <code>{listing}</code> مع اسم الـ variable <code>$listing</code>. لو الاسم مختلف Laravel بتحاول تعمل instance جديدة من الكلاس بالـ container (فاضية) مش بتجيبه من الداتابيز، فتتفاجئ بسجل فاضي. الحل: سمّيهم نفس الاسم.",
    },
    {
      q: "في Laravel 11 مشروع جديد، مفيش <code>routes/api.php</code>. إيه الأمر اللي بيضيفه؟",
      options: [
        "<code>php artisan make:api</code>",
        "<code>php artisan route:api</code>",
        "<code>php artisan serve --api</code>",
        "<code>php artisan install:api</code>",
      ],
      answer: 3,
      why: "<code>install:api</code> بيعمل ملف <code>routes/api.php</code> وبيضيفه في <code>bootstrap/app.php</code> وبيركّب Sanctum (أو Passport) وبيشغّل migration للـ tokens. باقي الأوامر مش موجودة.",
    },
    {
      q: "أنهي سطر بيعمل route لـ invokable controller صح؟",
      options: [
        "لازم تكتب اسم الـ method دايما: <code>[FeaturedListingsController::class, '__invoke']</code> ومفيش شكل غيره",
        "<code>Route::get('/featured', FeaturedListingsController::class);</code>",
        "<code>Route::invoke('/featured', FeaturedListingsController::class);</code>",
        "<code>Route::get('/featured', new FeaturedListingsController);</code>",
      ],
      answer: 1,
      why: "لو الكلاس فيه <code>__invoke</code> بنمرر اسم الكلاس بس. الشكل الأول بيشتغل تقنيا لكن مش لازم، لأن Laravel بتعرف إن الكلاس invokable وبتنادي <code>__invoke</code> لوحدها. <code>Route::invoke</code> مش موجودة.",
    },
  ],
};
