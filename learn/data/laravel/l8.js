window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l8"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "الـ API عقد بينك وبين تطبيق الموبايل",
      en: "JSON API conventions",
      body: "<p>تطبيق Flutter اللي بيكلم الـ API بتاعك مبيقراش الكود بتاعك، بيعتمد على <b>شكل الرد</b>. لو endpoint رجّع حقل مرة اسمه <code>price</code> ومرة <code>amount</code>، أو رجّع الأخطاء مرة نص ومرة array، التطبيق بيقع. المستوى ده عن تثبيت الشكل ده: URLs متوقعة، status codes صح، أخطاء بنفس الشكل، وحقول معروفة بدل ما نرمي الموديل خام.</p><p>الاتفاق الشائع (REST):</p>",
      points: [
        "الـ URL بيسمّي <b>شيء</b> (اسم جمع) مش فعل: <code>/api/v1/listings</code> مش <code>/getListings</code>.",
        "الـ verb هو الفعل: <code>GET</code> قراءة، <code>POST</code> إنشاء، <code>PUT</code> و<code>PATCH</code> تعديل، <code>DELETE</code> حذف.",
        "علاقة تابعة: <code>/listings/5/photos</code> أو <code>/listings/5/inquiries</code>.",
        "الـ status code هو أول حاجة العميل بيقراها، فمتبعتش <code>200</code> مع <code>{\"error\": ...}</code>.",
      ],
      interview: [
        { q: "إيه أهم قواعد تصميم REST API؟", a: "الـ URLs بتمثل resources بأسماء جمع (<code>/listings/5</code>) والـ HTTP verb هو اللي بيحدد العملية، والـ status codes بتعبّر عن النتيجة بصدق (201 للإنشاء، 204 للحذف، 404 و422 و401 و403 للأخطاء)، والرد بشكل ثابت (JSON بنفس الهيكل)، مع pagination وversioning (<code>/api/v1</code>). وكمان الـ GET لازم يكون safe (مبيغيّرش حاجة) والـ PUT والـ DELETE يكونوا idempotent." },
      ],
    },
    {
      title: "الـ status codes اللي لازم تحفظها",
      en: "HTTP status codes in an API",
      body: "<p>كل كود له معنى ثابت، والتطبيق بيبني عليه قراراته (يعرض رسالة؟ يرجّع لشاشة الدخول؟ يعيد المحاولة؟):</p>",
      points: [
        "<code>200 OK</code>: قراءة أو تعديل نجح ومعاه body. <code>201 Created</code>: إنشاء نجح (ومعاه <code>Location</code> header ورابط المورد الجديد غالبا).",
        "<code>204 No Content</code>: نجح ومفيش body (الحذف عادة).",
        "<code>401 Unauthorized</code>: مش مسجل دخول (أو التوكن غلط/منتهي). <code>403 Forbidden</code>: مسجل دخول بس معندكش صلاحية.",
        "<code>404 Not Found</code>: المورد مش موجود. <code>422 Unprocessable Content</code>: الداتا اتبعتت بس فاليديشن رفضها.",
        "<code>429 Too Many Requests</code>: عدّيت حد الـ rate limit. <code>500</code>: خطأ عندنا، ومفروض ميحصلش.",
      ],
      code: {
        lang: "php",
        title: "ListingController.php",
        src: `public function store(Request $request)
{
    $data = $request->validate([
        'office_id' => ['required', 'exists:offices,id'],
        'title' => ['required', 'string', 'max:120'],
        'price' => ['required', 'integer', 'min:1'],
        'city' => ['required', 'string'],
    ]);

    $listing = Listing::create($data);

    return (new ListingResource($listing))
        ->response()
        ->setStatusCode(201)
        ->header('Location', url('/api/v1/listings/'.$listing->id));
}

public function destroy(Listing $listing)
{
    $listing->delete();

    return response()->noContent();     // 204
}`,
        note: "اتجرب: بيانات ناقصة بترجع 422، والإنشاء 201، وحذف id مش موجود 404 (من route model binding)، والحذف الناجح 204. ولو استخدمت verb مش معرّف على الـ route بترجع <code>405</code>.",
      },
      pitfall: "الفرق بين 401 و403 بيتلغبط كتير: <b>401 = إنت مين؟</b> (مفيش هوية)، <b>403 = أنا عارفك بس لأ</b>. وكمان متستخدمش 200 للأخطاء ولا 500 لأخطاء المستخدم.",
      interview: [
        { q: "إيه الفرق بين 401 و403 و422؟", a: "401: الريكويست من غير هوية صالحة (مفيش توكن أو منتهي) فالعميل يروح يسجل دخول. 403: الهوية معروفة لكن المستخدم ملوش صلاحية على الحاجة دي (مثلا بيعدل إعلان مكتب تاني). 422: الهوية والصلاحية تمام لكن الداتا اللي بعتها مش صالحة (فاليديشن)، والرد فيه <code>errors</code> لكل حقل." },
      ],
    },
    {
      kicker: "الشكل الثابت للرد",
      title: "API Resources: الشكل بتاعك مش شكل الجدول",
      en: "API Resources",
      body: "<p>الـ <b>Resource</b> كلاس بيحوّل موديل لـ array تتحول لـ JSON. فايدته إنك بتتحكم في الحقول والأسماء والـ format، والداتابيز تتغير من غير ما الـ API يتكسر. بتعمله بـ <code>php artisan make:resource ListingResource</code>.</p><p>للعنصر الواحد <code>new ListingResource($listing)</code>، ولقايمة <code>ListingResource::collection($listings)</code>. وبشكل افتراضي الرد بيتلف في مفتاح <code>data</code>.</p>",
      code: {
        lang: "php",
        title: "app/Http/Resources/OfficeResource.php",
        src: `class OfficeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'city' => $this->city,
            'is_verified' => $this->is_verified,
        ];
    }
}

// in a controller
return new OfficeResource($office);
// {"data": {"id": 1, "name": "...", "city": "Riyadh", ...}}

// remove the "data" wrapper for the whole app (AppServiceProvider::boot)
JsonResource::withoutWrapping();`,
        note: "جوه <code>toArray</code>، <code>$this->id</code> بتوصل لخاصية الموديل. تقدر تضيف meta من برا بـ <code>->additional(['meta' => [...]])</code>.",
      },
      pitfall: "بتسيب الـ wrapping زي ما هو غالبا (<code>data</code>) لأنه بيسيب مكان للـ <code>meta</code> و<code>links</code>. لو قفلته غيّر ده قبل ما التطبيق يتبني عليه، لأنه تغيير بيكسر العملاء.",
      interview: [
        { q: "ليه نستخدم API Resource بدل <code>return $model</code> أو <code>toArray()</code>؟", a: "الـ Resource بيفصل شكل الـ API عن شكل الجدول: بحدد الحقول المسموحة بالاسم، وأعيد تسميتها وأنسقها (تواريخ ISO مثلا)، وأحمّل حقول بشروط، وأضمن إن عمود جديد في الجدول (أو حقل حساس) مايظهرش في الـ API من غير ما أقرر. ورجوع الموديل خام بيكشف كل الأعمدة غير المخفية وبيربط العملاء بتصميم الداتابيز." },
      ],
    },
    {
      title: "حقول بشروط: whenLoaded و when و whenCounted",
      en: "Conditional attributes in resources",
      body: "<p>أخطر غلطة في الـ Resource إنك تكتب <code>'office' => new OfficeResource($this->office)</code> من غير أي شرط: ده بيعمل lazy load (N+1) لو الـ relation مش محمّل. استخدم <code>whenLoaded</code>: الحقل بيظهر بس لو الـ controller عمل <code>with(...)</code>، وإلا بيتشال من الـ JSON بدل ما يعمل استعلام.</p>",
      code: {
        lang: "php",
        src: `public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'title' => $this->title,
        'published_at' => $this->published_at?->toIso8601String(),

        // only if with('office') was called
        'office' => new OfficeResource($this->whenLoaded('office')),
        'photos' => PhotoResource::collection($this->whenLoaded('photos')),

        // only if withCount('photos') was called
        'photos_count' => $this->whenCounted('photos'),

        // only for admins
        'units_left' => $this->when($request->user()?->is_admin, $this->units_left),

        // several fields together
        $this->mergeWhen($request->routeIs('listings.show'), [
            'description' => $this->description,
        ]),
    ];
}`,
        note: "اتجرب: قايمة الإعلانات (with office و withCount) رجّعت <code>office</code> و<code>photos_count</code> من غير <code>photos</code>، وصفحة التفاصيل رجّعت <code>photos</code> و<code>description</code>. كله من نفس الـ Resource.",
      },
      focus: [{ label: "احفظها", text: "في الـ Resource: أي relation يتكتب بـ <code>whenLoaded</code> و<code>whenCounted</code>، والـ controller هو اللي يقرر يحمّل إيه بـ <code>with</code>. كده الـ Resource مبيعملش استعلامات أبدا." }],
      interview: [
        { q: "إيه وظيفة <code>whenLoaded</code> في الـ Resource؟", a: "بتضمن إن الـ relation مايظهرش في الـ JSON إلا لو اتحمّل فعلا (<code>with</code> أو <code>load</code>)، فبتمنع الـ N+1 اللي بيحصل لو كتبت <code>$this->office</code> مباشرة، وبتخلي نفس الـ Resource يشتغل في القايمة (خفيف) وفي التفاصيل (كامل). وبنفس الفكرة <code>whenCounted</code> للـ <code>withCount</code> و<code>when</code> لأي شرط عشوائي." },
      ],
    },
    {
      title: "الـ pagination في الـ JSON",
      en: "Paginated responses",
      body: "<p>لما تسلّم <code>paginate()</code> للـ <code>ListingResource::collection(...)</code> Laravel بيضيف لوحده <code>links</code> و<code>meta</code> بجانب <code>data</code>. التطبيق بيستخدم <code>next</code> لتحميل الصفحة التالية و<code>meta.total</code> لعرض العدد.</p>",
      code: {
        lang: "json",
        title: "GET /api/v1/listings?per_page=2",
        src: `{
  "data": [
    { "id": 1, "title": "...", "price": 206000, "photos_count": 3 },
    { "id": 2, "title": "...", "price": 457000, "photos_count": 3 }
  ],
  "links": {
    "first": "http://localhost/api/v1/listings?per_page=2&page=1",
    "last": "http://localhost/api/v1/listings?per_page=2&page=10",
    "prev": null,
    "next": "http://localhost/api/v1/listings?per_page=2&page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 10,
    "path": "http://localhost/api/v1/listings",
    "per_page": 2,
    "to": 2,
    "total": 20
  }
}`,
        note: "ده الرد الحقيقي (مختصر: <code>meta.links</code> فيها كمان قايمة أزرار الصفحات). لو عايز تحتفظ بالفلاتر في روابط الصفحات استخدم <code>paginate()->withQueryString()</code>.",
      },
      pitfall: "متسيبش <code>per_page</code> من غير حد أقصى: لو العميل بعت <code>per_page=100000</code> رجعت لـ <code>all()</code>. فاليدّه بـ <code>max:50</code> أو اقطعه بـ <code>min($request->integer('per_page', 15), 50)</code>.",
      interview: [
        { q: "إيه اللي بيرجعه <code>paginate()</code> لما يتحول لـ JSON، وإيه الفرق بينه وبين <code>cursorPaginate</code>؟", a: "بيرجع <code>data</code> (العناصر) و<code>links</code> (first/last/prev/next) و<code>meta</code> (current_page, per_page, total, last_page...). <code>paginate</code> بتعمل count query كمان عشان تعرف الإجمالي، وبتشتغل بـ page number. <code>cursorPaginate</code> بتشتغل بـ cursor وبتتفادى الـ count والـ offset، فأسرع وأثبت في الجداول الكبيرة، لكن ملهاش أرقام صفحات." },
      ],
    },
    {
      kicker: "الأخطاء",
      title: "ردود الأخطاء بشكل واحد",
      en: "Consistent error responses",
      body: "<p>Laravel بيحوّل الـ exceptions لـ JSON لوحده <b>لو الريكويست بيطلب JSON</b> (header <code>Accept: application/json</code>) وبـ status code مناسب. اللي شغّلناه فعلا:</p>",
      points: [
        "فاليديشن: <code>422</code> و<code>{\"message\": \"...\", \"errors\": {\"title\": [\"The title field is required.\"]}}</code>.",
        "<code>findOrFail</code> أو route model binding على id مش موجود: <code>404</code> بالرسالة <code>No query results for model [App\\Models\\Listing] 9999</code>. لاحظ إنها بتكشف اسم الكلاس الداخلي.",
        "مش مسجل دخول: <code>401</code> و<code>{\"message\": \"Unauthenticated.\"}</code>. ومن غير صلاحية (<code>AuthorizationException</code>): <code>403</code>.",
        "مسار مش موجود: <code>404</code>. وverb غلط: <code>405</code>. وحد الـ throttle: <code>429</code>.",
      ],
      code: {
        lang: "php",
        title: "bootstrap/app.php (Laravel 11)",
        src: `->withMiddleware(function (Middleware $middleware) {
    $middleware->redirectGuestsTo(
        fn (Request $request) => $request->is('api/*') ? null : route('login')
    );
})
->withExceptions(function (Exceptions $exceptions) {
    // api/* is always JSON, even without the Accept header
    $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
        return $request->is('api/*') || $request->expectsJson();
    });

    // friendlier 404 that hides internal class names
    $exceptions->render(function (NotFoundHttpException $e, Request $request) {
        if ($request->is('api/*')) {
            return response()->json(['message' => 'Not found.'], 404);
        }
    });
})`,
        note: "من غير <code>redirectGuestsTo</code> وبدون <code>Accept: application/json</code>، ريكويست على route محمي بـ <code>auth:sanctum</code> بيحاول يعمل redirect لـ <code>route('login')</code> ومش لاقيه فبيرجع <b>500</b> بدل 401. جرّبناها قبل وبعد.",
      },
      pitfall: "لو الـ <code>render</code> callback رجّع <code>null</code> (زي لما الريكويست مش على api) Laravel بيكمل للمعالجة الافتراضية، فمتحتاجش <code>else</code>. وفي production اتأكد إن <code>APP_DEBUG=false</code> عشان الـ stack trace مايتعرضش.",
      interview: [
        { q: "إزاي تخلي كل الأخطاء في الـ API ترجع JSON بنفس الشكل في Laravel 11؟", a: "في <code>bootstrap/app.php</code> جوه <code>withExceptions</code>: بستخدم <code>shouldRenderJsonWhen</code> عشان أي ريكويست على <code>api/*</code> يرجع JSON حتى من غير Accept header، و<code>$exceptions->render(fn (NotFoundHttpException $e, Request $request) => ...)</code> أخصص رد نوع معين. ولازم أظبط <code>redirectGuestsTo</code> عشان الـ API مايحاولش يعمل redirect لـ login. الـ 422 بتاع الفاليديشن شكله ثابت أصلا: <code>message</code> و<code>errors</code>." },
      ],
    },
    {
      title: "فلترة وترتيب وبحث من غير ثغرات",
      en: "Filtering, sorting, searching safely",
      body: "<p>التطبيق بيبعت <code>?city=Riyadh&min_price=100000&sort=-price&q=villa&per_page=10</code>. القاعدة: <b>أي حاجة جاية من query string مش موثوقة</b>. القيم بتتبعت للداتابيز كـ bindings فمفيش SQL injection فيها، لكن الخطر في:</p>",
      points: [
        "<b>أسماء الأعمدة</b> في <code>orderBy($request->sort)</code>: مستخدم يطلب ترتيب بعمود حساس أو غلط. اعمل whitelist بـ <code>in:price,-price,...</code>.",
        "<code>per_page</code> من غير حد أقصى.",
        "<code>where($request->all())</code> أو <code>Listing::create($request->all())</code> (mass assignment). خد بس الحقول اللي فاليدتها.",
        "علامات <code>%</code> و<code>_</code> في <code>like</code> بتشتغل كـ wildcards لو المستخدم كتبها: مش ثغرة أمنية لكن ممكن تعمل نتائج غريبة أو استعلامات بطيئة.",
      ],
      code: {
        lang: "php",
        src: `$data = $request->validate([
    'city' => ['sometimes', 'string', 'max:50'],
    'min_price' => ['sometimes', 'integer', 'min:0'],
    'q' => ['sometimes', 'string', 'max:100'],
    'sort' => ['sometimes', 'in:price,-price,published_at,-published_at'],
    'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
]);

$sort = $data['sort'] ?? '-published_at';
$direction = str_starts_with($sort, '-') ? 'desc' : 'asc';

$listings = Listing::query()
    ->with('office')
    ->when($data['city'] ?? null, fn ($q, $city) => $q->where('city', $city))
    ->when($data['min_price'] ?? null, fn ($q, $v) => $q->where('price', '>=', $v))
    ->when($data['q'] ?? null, fn ($q, $t) => $q->where('title', 'like', "%$t%"))
    ->orderBy(ltrim($sort, '-'), $direction)
    ->paginate($data['per_page'] ?? 15)
    ->withQueryString();

return ListingResource::collection($listings);`,
        note: "<code>when($value, $callback)</code> بتنفذ الشرط بس لو القيمة موجودة. اتجرب: <code>?sort=password</code> رجعت 422، والفلتر والترتيب والـ pagination شغالين مع بعض.",
      },
      interview: [
        { q: "عايز endpoint بفلترة وترتيب من query string. إيه المخاطر وإزاي تتفاداها؟", a: "أفاليد كل باراميتر، وأعمل whitelist لأعمدة الترتيب (<code>in:price,-price</code>) بدل ما أمرر اسم العمود من المستخدم لـ <code>orderBy</code>، وأحط حد أقصى لـ <code>per_page</code>، ومبستخدمش <code>request()->all()</code> في where أو create. قيم الـ where بتتبعت كـ bindings فمحمية من SQL injection، لكن أسماء الأعمدة والـ raw SQL لأ. وبستخدم <code>when()</code> عشان الفلاتر الاختيارية." },
      ],
    },
    {
      title: "الـ versioning و PUT مقابل POST",
      en: "Versioning and idempotency",
      body: "<p><b>Versioning:</b> لما تغيّر شكل الرد بطريقة تكسر العملاء، مينفعش تكسر التطبيقات القديمة (تطبيقات الموبايل مبتتحدثش كلها مع بعض). فبتحط الإصدار في الـ URL: <code>/api/v1/listings</code>، وتطلق <code>/api/v2</code> للشكل الجديد وتسيب v1 شغال لحد ما يخلص استخدامه. في Laravel 11 ملف <code>routes/api.php</code> بياخد prefix <code>/api</code> تلقائي، فبتضيف <code>v1</code> بنفسك.</p>",
      code: {
        lang: "php",
        title: "routes/api.php",
        src: `Route::prefix('v1')->group(function () {
    Route::get('listings', [ListingController::class, 'index']);
    Route::get('listings/{listing}', [ListingController::class, 'show']);
    Route::post('listings', [ListingController::class, 'store']);
    Route::put('listings/{listing}', [ListingController::class, 'update']);
    Route::delete('listings/{listing}', [ListingController::class, 'destroy']);
});
// => /api/v1/listings   (the "api" prefix comes from bootstrap/app.php)`,
      },
      points: [
        "<b>Idempotent</b> يعني تكرار نفس الريكويست 10 مرات نتيجته زي مرة واحدة. <code>GET</code> و<code>PUT</code> و<code>DELETE</code> idempotent.",
        "<code>PUT /listings/5</code> بيستبدل الإعلان بالبيانات المبعوتة (الحالة النهائية واحدة لو اتكرر). <code>PATCH</code> تعديل جزئي.",
        "<code>POST /listings</code> مش idempotent: كل ضغطة (مثلا ضغط مرتين على زرار بسبب نت بطيء) بتعمل إعلان جديد. للدفع والحجز بنضيف <code>Idempotency-Key</code> header أو unique constraint.",
        "<code>DELETE</code> idempotent بمعنى الأثر: التكرار يسيبه محذوف (حتى لو الريسبونس التاني 404).",
      ],
      interview: [
        { q: "إيه معنى idempotent، وإيه الفرق بين PUT و POST؟", a: "الـ idempotent معناه إن تكرار نفس الطلب مرات متعددة بيسيب النظام في نفس الحالة اللي كان هيسيبه فيها لو اتنفذ مرة. <code>PUT</code> بيحدد الحالة النهائية للمورد فهو idempotent، أما <code>POST</code> بيعمل مورد جديد في كل مرة فمش idempotent. عملياً بقلل ضغطتين مكررتين على POST بـ unique constraint أو مفتاح idempotency في الريكويست." },
      ],
    },
    {
      title: "متبعتش الموديل خام",
      en: "Never return a raw model",
      body: "<p><code>return User::find($id)</code> بيحوّل الموديل لـ JSON بكل أعمدته الغير مخفية. اتجرب عندنا: الرد طلع فيه <code>email</code> و<code>is_admin</code> وتواريخ داخلية، لأن الـ <code>$hidden</code> بتخفي <code>password</code> و<code>remember_token</code> بس. أي عمود تضيفه بعدين في migration (رقم تليفون، توكن، ملاحظة داخلية) هيتسرّب لحد ما تفتكر.</p>",
      codes: [
        {
          lang: "php",
          title: "غلط",
          src: `Route::get('users/{id}', fn ($id) => User::findOrFail($id));
// {"id":1,"name":"...","email":"...","is_admin":false,...}`,
        },
        {
          lang: "php",
          title: "صح",
          src: `class PublicUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['id' => $this->id, 'name' => $this->name];
    }
}

Route::get('users/{id}', fn ($id) => new PublicUserResource(User::findOrFail($id)));`,
          note: "الـ Resource whitelist: اللي مكتوب بس يطلع. و<code>$hidden</code> blacklist: اللي نسيت تكتبه يطلع.",
        },
      ],
      pitfall: "<code>$hidden</code> أو <code>makeHidden()</code> مش بديل للـ Resource لأنها blacklist. ومتكتبش <code>$guarded = []</code>. والـ response لازم يتراجع مع كل migration جديد: السؤال \"هل العمود ده يتعرض للعميل؟\" يتسأل مرة واحدة في الـ Resource.",
      interview: [
        { q: "ليه رجوع موديل Eloquent مباشرة من الـ controller فكرة وحشة؟", a: "لأن <code>toJson</code> بيطلّع كل الأعمدة اللي مش في <code>$hidden</code>، فأي عمود جديد أو حساس (إيميل، is_admin، ملاحظات داخلية) بيتسرّب من غير ما أقرر، وكمان بيربط الـ API بأسماء الأعمدة فتغيير الجدول يكسر العملاء. باستخدام Resource بحدد بالاسم الحقول المسموحة (whitelist) وبقدر أغيّر الجدول من غير ما أغيّر العقد." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: Resource بحقول بشروط",
      lang: "php",
      code: `<?php
class ListingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'office' => new OfficeResource($this->whenLoaded('office')),
            'photos_count' => $this->whenCounted('photos'),
            'units_left' => $this->when(
                $request->user()?->is_admin,
                $this->units_left
            ),
        ];
    }
}`,
    },
    {
      title: "اكتب: routes الـ v1",
      lang: "php",
      code: `<?php
use App\\Http\\Controllers\\ListingController;
use Illuminate\\Support\\Facades\\Route;

Route::prefix('v1')
  ->controller(ListingController::class)
  ->group(function () {
    Route::get('listings', 'index');
    Route::post('listings', 'store');
    Route::get('listings/{listing}', 'show');
    Route::delete('listings/{listing}', 'destroy');
  });`,
    },
    {
      title: "اكتب: رد 404 مخصص",
      lang: "php",
      code: `<?php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->shouldRenderJsonWhen(
        fn (Request $r, Throwable $e) => $r->is('api/*')
    );

    $exceptions->render(function (NotFoundHttpException $e, $r) {
        if ($r->is('api/*')) {
            return response()->json(['message' => 'Not found'], 404);
        }
    });
})`,
    },
  ],

  tasks: [
    {
      title: "Resource للمكتب مع الإعلانات",
      lang: "php",
      prompt: "<p>اكتب <code>OfficeResource</code> بالحقول <code>id</code> و<code>name</code> و<code>city</code> و<code>is_verified</code>، وحقل <code>listings</code> (collection من <code>ListingResource</code>) يظهر بس لو الـ relation متحمّل، وحقل <code>listings_count</code> يظهر بس لو اتعمل <code>withCount</code>، وحقل <code>owner_email</code> يظهر <b>للأدمن بس</b> (<code>$request->user()?->is_admin</code>).</p>",
      examples: [
        { in: "Office::first()  // من غير with", out: "{ id, name, city, is_verified }" },
        { in: "Office::with('listings')->withCount('listings')->first()", out: "{ ..., listings: [...], listings_count: 5 }" },
      ],
      starter: `<?php
class OfficeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            // your code
        ];
    }
}`,
      hints: [
        "<code>ListingResource::collection($this->whenLoaded('listings'))</code>.",
        "<code>$this->whenCounted('listings')</code> للعدد.",
        "الإيميل: بتحتاج تحمّل الـ owner؟ اكتب <code>$this->when($request->user()?->is_admin, fn () => $this->owner->email)</code> عشان الـ closure تتنفذ بس للأدمن.",
      ],
      solution: `<?php
class OfficeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'city' => $this->city,
            'is_verified' => $this->is_verified,
            'listings' => ListingResource::collection(
                $this->whenLoaded('listings')
            ),
            'listings_count' => $this->whenCounted('listings'),
            'owner_email' => $this->when(
                $request->user()?->is_admin,
                fn () => $this->owner->email
            ),
        ];
    }
}`,
      explain: "بمرر closure لـ <code>when</code> عشان قيمة <code>$this->owner->email</code> ما تتحسبش (ومتعملش lazy load) إلا لو الشرط اتحقق. والـ <code>whenLoaded</code> و<code>whenCounted</code> بيخلوا الـ Resource مبيعملش استعلامات من عنده.",
    },
    {
      title: "endpoint قايمة آمن",
      lang: "php",
      prompt: "<p>اكتب method <code>index(Request $request)</code> لـ <code>OfficeController</code> بترجع <code>OfficeResource::collection</code> مقسّمة صفحات. الباراميترات: <code>city</code> (اختياري، مطابقة تامة)، <code>verified</code> (اختياري، boolean)، <code>sort</code> وبتقبل بس <code>name</code> أو <code>-name</code> أو <code>created_at</code> أو <code>-created_at</code>، و<code>per_page</code> (من 1 لـ 50، الافتراضي 15). فاليد كل حاجة، وخلي روابط الصفحات تحتفظ بالفلاتر.</p>",
      examples: [
        { in: "GET /offices?sort=owner_id", out: "422" },
        { in: "GET /offices?verified=1&sort=-name&per_page=5", out: "200 مع 5 مكاتب" },
      ],
      hints: [
        "<code>'sort' => ['sometimes', 'in:name,-name,created_at,-created_at']</code> و<code>'verified' => ['sometimes', 'boolean']</code>.",
        "اقرا الاتجاه من أول حرف: <code>str_starts_with($sort, '-')</code> وشيل الشرطة بـ <code>ltrim</code>.",
        "<code>$request->boolean('verified')</code> أو <code>$data['verified']</code>. وفي الآخر <code>paginate(...)->withQueryString()</code>.",
      ],
      solution: `<?php
public function index(Request $request)
{
    $data = $request->validate([
        'city' => ['sometimes', 'string', 'max:50'],
        'verified' => ['sometimes', 'boolean'],
        'sort' => ['sometimes', 'in:name,-name,created_at,-created_at'],
        'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
    ]);

    $sort = $data['sort'] ?? 'name';
    $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';

    $offices = Office::query()
        ->when($data['city'] ?? null, fn ($q, $city) => $q->where('city', $city))
        ->when(isset($data['verified']), fn ($q) => $q->where('is_verified', $request->boolean('verified')))
        ->orderBy(ltrim($sort, '-'), $direction)
        ->paginate($data['per_page'] ?? 15)
        ->withQueryString();

    return OfficeResource::collection($offices);
}`,
      explain: "نلاحظ إن <code>verified=0</code> فلتر صالح، فاستخدمنا <code>isset</code> بدل الاعتماد على truthiness في <code>when</code> (لأن <code>0</code> و<code>false</code> قيم falsy فالـ <code>when</code> كانت هتتجاهل الفلتر). الـ whitelist بيمنع ترتيب بعمود غير مقصود، و<code>withQueryString</code> بيحافظ على الفلاتر في الروابط.",
    },
    {
      title: "رد 422 و 404 موحّد",
      lang: "php",
      prompt: "<p>في <code>withExceptions</code> في <code>bootstrap/app.php</code>: اضبط إن أي ريكويست على <code>api/*</code> يرجع JSON دايما. وبعدين خصص <code>ModelNotFoundException</code> (اللي بيتحول لـ <code>NotFoundHttpException</code>) بحيث على <code>api/*</code> يرجع <code>{\"message\": \"Listing not found.\"}</code> بالـ 404 (اسم الموديل من الـ exception، مش مكتوب ثابت)، وأي <code>NotFoundHttpException</code> تاني يرجع <code>{\"message\": \"Resource not found.\"}</code>.</p>",
      hints: [
        "الـ <code>ModelNotFoundException</code> بتبقى في <code>$e->getPrevious()</code> بعد ما Laravel يحوّلها.",
        "<code>class_basename($previous->getModel())</code> بتعطيك اسم الكلاس من غير الـ namespace.",
      ],
      solution: `<?php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->shouldRenderJsonWhen(
        fn (Request $request, Throwable $e) => $request->is('api/*')
            || $request->expectsJson()
    );

    $exceptions->render(function (NotFoundHttpException $e, Request $request) {
        if (! $request->is('api/*')) {
            return null;
        }

        $previous = $e->getPrevious();
        $model = $previous instanceof ModelNotFoundException
            ? class_basename($previous->getModel())
            : 'Resource';

        return response()->json(['message' => "$model not found."], 404);
    });
})`,
      explain: "Laravel بيحوّل <code>ModelNotFoundException</code> لـ <code>NotFoundHttpException</code> ويحط الأصلية في <code>getPrevious()</code> (جربناها: النتيجة <code>Listing not found.</code>). رجوع <code>null</code> بيخلي المعالجة الافتراضية تكمل لباقي الصفحات.",
    },
  ],

  quiz: [
    {
      q: "المستخدم عمل login صح وبيحاول يعدّل إعلان مكتب تاني. الكود الصح؟",
      options: ["401", "403", "404", "422"],
      answer: 1,
      why: "هو معروف (مسجل دخول) فمش 401، لكن مفيش صلاحية على المورد ده فهي 403. (بعض الـ APIs بترجع 404 عشان تخفي وجود المورد، لكن القاعدة العامة 403.) 422 معناها الداتا نفسها مرفوضة.",
    },
    {
      q: "إنشاء إعلان ناجح من <code>POST /api/v1/listings</code> المفروض يرجع كام؟",
      answer: ["201"],
      why: "<code>201 Created</code> للإنشاء الناجح، مع <code>Location</code> header للمورد الجديد. 200 مقبولة تقنيا لكن 201 هي الاتفاق، و204 معناها مفيش body.",
    },
    {
      q: "إيه اللي ناقص عشان الـ Resource ده ميعملش N+1؟",
      code: { lang: "php", src: `return [
    'id' => $this->id,
    'office' => new OfficeResource($this->office),
];` },
      options: [
        "كتابة <code>$this->office()</code> بالأقواس",
        "<code>JsonResource::withoutWrapping()</code>",
        "استبدال الـ Resource بـ <code>toArray()</code> على الموديل",
        "<code>new OfficeResource($this->whenLoaded('office'))</code> والـ controller يعمل <code>with('office')</code>",
      ],
      answer: 3,
      why: "<code>$this->office</code> بتعمل lazy load لكل عنصر في القايمة. <code>whenLoaded</code> بتتجاهل الحقل لو الـ relation مش محمّل، والـ controller هو اللي يقرر التحميل بـ <code>with</code>. الأقواس بتعمل استعلام أكتر.",
    },
    {
      q: "ريكويست على route محمي بـ <code>auth:sanctum</code> من غير <code>Accept: application/json</code> وبدون أي ضبط في bootstrap/app.php رجّع 500. السبب؟",
      options: [
        "الـ middleware بيحاول يعمل redirect لـ <code>route('login')</code> وهو مش موجود في الـ API",
        "التوكن منتهي",
        "Sanctum مش متثبت",
        "الـ CSRF مفعل على الـ API",
      ],
      answer: 0,
      why: "من غير Accept JSON، Laravel بيعتبر الريكويست صفحة ويحاول يرجّع المستخدم لـ <code>login</code>، ولو الـ route ده مش معرّف بيرمي خطأ فيطلع 500. الحل <code>redirectGuestsTo</code> بيرجع null على <code>api/*</code> مع <code>shouldRenderJsonWhen</code>.",
    },
    {
      q: "أنهي سطر فيه ثغرة؟",
      options: [
        "<code>$q->where('city', $request->city)</code>",
        "<code>$q->where('title', 'like', '%'.$term.'%')</code>",
        "<code>$q->orderBy($request->input('sort'), 'asc')</code>",
        "<code>$q->paginate(min($request->integer('per_page', 15), 50))</code>",
      ],
      answer: 2,
      why: "القيم (الخيارين 1 و3) بتتبعت كـ bindings فآمنة من الـ injection. اسم العمود اللي المستخدم بيمرره لـ <code>orderBy</code> محتاج whitelist وإلا ممكن يرتب بأي عمود (أو يرمي خطأ يكشف هيكل الجدول). والرابع بيحط حد أقصى.",
    },
    {
      q: "إيه الفرق في الرد بين الاتنين؟ (الأول من غير <code>with</code>، التاني بـ <code>with('office')</code>، والـ Resource فيه <code>whenLoaded('office')</code>)",
      options: [
        "الأول فيه <code>office: null</code> والتاني فيه الكائن",
        "الأول بيعمل استعلام لكل عنصر",
        "مفيش فرق",
        "الأول مفيهوش مفتاح <code>office</code> خالص والتاني فيه الكائن",
      ],
      answer: 3,
      why: "<code>whenLoaded</code> بتشيل المفتاح من الـ JSON نهائيا لو الـ relation مش محمّل (مش بتحط null). وبالتالي مفيش lazy load.",
    },
    {
      q: "أنهي verb مش idempotent؟",
      options: ["GET", "PUT", "POST", "DELETE"],
      answer: 2,
      why: "<code>POST</code> بينشئ مورد جديد في كل مرة. GET و PUT و DELETE تكرارهم بيسيب النظام في نفس الحالة النهائية.",
    },
    {
      q: "عندك route <code>Route::prefix('v1')</code> جوه <code>routes/api.php</code> في Laravel 11 والـ route <code>listings</code>. الـ URL الفعلي؟",
      answer: ["/api/v1/listings", "api/v1/listings"],
      why: "Laravel 11 بيضيف prefix <code>/api</code> لملف routes/api.php لوحده (من <code>withRouting</code> في bootstrap/app.php)، وبعده الـ <code>v1</code> من الـ group.",
    },
    {
      q: "ليه <code>return User::findOrFail($id)</code> خطر في الـ API؟",
      options: [
        "لأنه بيرجع كل الأعمدة اللي مش في <code>$hidden</code> (زي <code>email</code> و<code>is_admin</code>) وأي عمود جديد هيتسرّب",
        "لأنه أبطأ من الـ Resource",
        "لأنه مبيرجعش JSON",
        "لأن <code>findOrFail</code> مش مسموحة في الـ API",
      ],
      answer: 0,
      why: "الموديل بيتحول لـ JSON بكل أعمدته ما عدا المخفية. اتجرب: ظهر <code>email</code> و<code>is_admin</code>. الـ Resource whitelist بيحدد الحقول بالاسم.",
    },
  ],
};
