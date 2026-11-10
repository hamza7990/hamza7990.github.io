window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l9"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "إنت مين؟ وإنت مسموحلك؟ سؤالين مختلفين",
      en: "Authentication vs authorization",
      body: "<p>أي API فيه مستخدمين بيجاوب على سؤالين منفصلين، وكتير بيتلخبطوا بينهم:</p>",
      points: [
        "<b>Authentication (المصادقة)</b>: <i>إنت مين؟</i> تسجيل الدخول والتحقق من الهوية (إيميل وباسورد، أو توكن). لو فشلت: <code>401</code>.",
        "<b>Authorization (التصريح)</b>: <i>إنت مسموحلك تعمل ده؟</i> قواعد الصلاحيات بعد ما نعرف هويتك. لو فشلت: <code>403</code>.",
        "في مشروعنا: أي حد مسجل ممكن يشوف الإعلانات، لكن بس <b>صاحب المكتب</b> يعدّل إعلانه، والـ <b>أدمن</b> يعدّل أي حاجة.",
      ],
      focus: [{ label: "احفظها", text: "الهوية الأول وبعدين الصلاحية. الـ <code>auth:sanctum</code> middleware بيجاوب على الأول، و<b>policies</b> و<b>gates</b> بيجاوبوا على التاني." }],
      interview: [
        { q: "إيه الفرق بين authentication و authorization؟ وإيه الـ status code لكل واحدة؟", a: "الـ authentication هي التحقق من هوية المستخدم (إنت مين؟) وفشلها بيرجع <code>401 Unauthorized</code>. الـ authorization هي التحقق من صلاحيته بعد ما اتعرف (مسموحله بالعملية دي؟) وفشلها <code>403 Forbidden</code>. مثال: ريكويست من غير توكن 401، وتوكن صحيح لمستخدم بيحاول يعدل إعلان مكتب تاني 403." },
      ],
    },
    {
      title: "الـ guards والـ providers",
      en: "Guards and providers",
      body: "<p>Laravel بيفصل مسؤولية \"إزاي أعرف المستخدم\" عن \"منين أجيب بياناته\":</p>",
      points: [
        "<b>Guard</b>: بيحدد <i>إزاي</i> بنصادق على كل ريكويست. <code>session</code> بيعتمد على كوكي (المواقع)، و<code>sanctum</code> بيعتمد على توكن في <code>Authorization: Bearer ...</code> (الـ APIs).",
        "<b>Provider</b>: بيحدد <i>منين</i> نجيب المستخدمين: <code>eloquent</code> (موديل <code>User</code>) أو <code>database</code> (جدول مباشرة).",
        "<code>auth:sanctum</code> في الـ route معناها: استخدم guard اسمه <code>sanctum</code>. و<code>auth()->user()</code> أو <code>$request->user()</code> بترجّع المستخدم الحالي.",
      ],
      code: {
        lang: "php",
        title: "config/auth.php",
        src: `'defaults' => [
    'guard' => env('AUTH_GUARD', 'web'),
],

'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
],

'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => App\\Models\\User::class,
    ],
],`,
        note: "ده الـ config الافتراضي في Laravel 11. حزمة Sanctum بتسجل guard اسمه <code>sanctum</code> بنفسها، فمش بتلاقيه هنا. وتقدر تختار guard معين بـ <code>Auth::guard('web')</code>.",
      },
      interview: [
        { q: "إيه هو الـ guard والـ provider في Laravel؟", a: "الـ guard بيحدد طريقة التحقق من المستخدم في كل ريكويست (session بالكوكي، أو token لـ APIs)، والـ provider بيحدد مصدر بيانات المستخدمين (Eloquent model أو جدول). بيتظبطوا في <code>config/auth.php</code>، وبختار الـ guard في الـ route بـ <code>auth:guardName</code> أو برمجيا بـ <code>Auth::guard()</code>." },
      ],
    },
    {
      title: "الباسورد: Hash مش تشفير",
      en: "Password hashing",
      body: "<p>الباسورد مبيتخزنش أبدا نص عادي ولا مشفّر بمفتاح يتفك. بيتخزن <b>hash</b>: دالة في اتجاه واحد (bcrypt افتراضيا، أو argon2). مينفعش ترجعها للباسورد الأصلي، فبنقارن بـ <code>Hash::check</code> اللي بتعمل hash للمدخل وتقارن.</p><p>في Laravel 11 الـ <code>User</code> موديل فيه cast <code>'password' => 'hashed'</code> فمجرد <code>User::create([...,'password' => '123456'])</code> بيعمل hash لوحده، ومتعملش hash مرتين.</p>",
      code: {
        lang: "php",
        src: `use Illuminate\\Support\\Facades\\Hash;

$user = User::create([
    'name' => 'Sara',
    'email' => 'sara@example.com',
    'password' => 'secret-pass',      // hashed by the cast
]);

echo substr($user->password, 0, 7);   // $2y$12$   (bcrypt, cost 12)

Hash::check('secret-pass', $user->password);   // true
Hash::check('wrong', $user->password);         // false

$hash = Hash::make('secret-pass');             // when you hash by hand
Hash::needsRehash($hash);                      // false`,
        note: "اتجرب: الشكل <code>$2y$12$</code> يعني bcrypt بتكلفة 12. وكل <code>Hash::make</code> بنفس الباسورد بيطلع hash مختلف (فيه salt عشوائي)، عشان كده المقارنة بـ <code>check</code> لازم، مش <code>==</code>.",
      },
      pitfall: "متقارنش الـ hash بـ <code>==</code> ولا تعمل <code>md5</code> أو <code>sha1</code> للباسورد. ومتحطش الباسورد في لوج أو في رد JSON. وفي الـ <code>$hidden</code> لازم يفضل <code>password</code>.",
      interview: [
        { q: "إزاي بتخزن الباسورد؟ وليه bcrypt مش sha256؟", a: "مبخزنش الباسورد، بخزن hash منه بـ <code>Hash::make</code> (bcrypt) أو cast <code>hashed</code> في الموديل، وبتحقق بـ <code>Hash::check</code>. bcrypt بطيء عن قصد وفيه salt وcost قابل للزيادة، فالهجوم بالتخمين الجماعي (brute force) غالي. sha256 سريع جدا فالمهاجم يجرب مليارات احتمالات في الثانية لو سرّب الجدول." },
      ],
    },
    {
      kicker: "الـ API tokens",
      title: "Sanctum: توكن لكل جهاز",
      en: "Sanctum API tokens",
      body: "<p><b>Sanctum</b> (الحزمة الرسمية الخفيفة) بتديك توكنات بسيطة لتطبيقات الموبايل والـ SPA. بتثبتها في Laravel 11 بـ <code>php artisan install:api</code> (بتضيف Sanctum وجدول <code>personal_access_tokens</code> وملف <code>routes/api.php</code>)، وبتضيف <code>HasApiTokens</code> trait للـ <code>User</code>. التوكن بيتبعت في كل ريكويست: <code>Authorization: Bearer 3|abc...</code>.</p>",
      code: {
        lang: "php",
        src: `// create (the plain text is shown ONCE; only its sha256 is stored)
$token = $user->createToken('mobile', ['listings:read']);
$plain = $token->plainTextToken;          // "3|k8Jd..."

// with an expiry date
$user->createToken('mobile', ['*'], now()->addDays(30));

// inside a request
$request->user()->tokenCan('listings:write');   // true / false

// revoke
$request->user()->currentAccessToken()->delete();   // this device
$request->user()->tokens()->delete();               // all devices`,
        note: "اتجرب: القيمة بتبدأ برقم السجل (<code>3|...</code>)، والتوكن المنتهي (<code>expires_at</code> في الماضي) بيرجع 401. تقدر كمان تحط انتهاء عام لكل التوكنات بالدقائق من <code>'expiration'</code> في <code>config/sanctum.php</code>.",
      },
      pitfall: "الـ <b>abilities</b> بتتخزن مع التوكن، لكن مفيش حاجة بتفرضها لوحدها. لازم تتحقق منها (<code>tokenCan</code> أو middleware). وهي مش بديل للـ policies: التوكن بيقول \"التطبيق ده مسموحله يكتب إعلانات\"، والـ policy بتقول \"المستخدم ده مسموحله يعدل <i>الإعلان ده</i>\".",
      interview: [
        { q: "إزاي Sanctum بيخزن التوكنات؟ وإزاي تلغي توكن أو تخليه ينتهي؟", a: "<code>createToken</code> بيرجع النص الأصلي مرة واحدة بس، وبيتخزن في <code>personal_access_tokens</code> hash منه (sha256) مش النص نفسه، فتسريب الجدول مش بيسرّب توكنات صالحة. بلغي توكن بـ <code>currentAccessToken()->delete()</code> أو كل توكنات المستخدم بـ <code>tokens()->delete()</code>. وبحدد انتهاء بالـ third argument في <code>createToken</code> أو بـ <code>expiration</code> في <code>config/sanctum.php</code>." },
      ],
    },
    {
      title: "register و login و logout",
      en: "Auth endpoints",
      body: "<p>تطبيق الموبايل بيعمل <code>POST /login</code> ويحتفظ بالتوكن. للـ login تحقق بنفسك بـ <code>Hash::check</code> (من غير <code>Auth::attempt</code> لأنها مرتبطة بالـ session) وارمي <code>ValidationException</code> برسالة <b>عامة</b> لو غلط، عشان محدش يعرف هل الإيميل موجود ولا لأ.</p>",
      code: {
        lang: "php",
        title: "AuthController.php",
        src: `public function register(Request $request)
{
    $data = $request->validate([
        'name' => ['required', 'string', 'max:100'],
        'email' => ['required', 'email', 'unique:users,email'],
        'password' => ['required', 'confirmed', Password::min(8)],
    ]);

    $user = User::create($data);

    return response()->json([
        'token' => $user->createToken('mobile')->plainTextToken,
    ], 201);
}

public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required', 'string'],
    ]);

    $user = User::where('email', $credentials['email'])->first();

    if (! $user || ! Hash::check($credentials['password'], $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['These credentials do not match our records.'],
        ]);
    }

    return response()->json([
        'token' => $user->createToken('mobile', ['*'], now()->addDays(30))->plainTextToken,
    ]);
}

public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();

    return response()->noContent();     // 204
}`,
        note: "اتجرب كله: register رجّع 201 وlogin غلط رجّع 422 برسالة عامة، والـ logout 204 وبعده نفس التوكن بيرجع 401. المسارين <code>register</code> و<code>login</code> برا <code>auth:sanctum</code>، والـ logout جواه.",
      },
      interview: [
        { q: "ازاي تبني login لتطبيق موبايل بـ Laravel؟", a: "endpoint <code>POST /api/v1/login</code> بفاليد الإيميل والباسورد، بدوّر على المستخدم وبقارن بـ <code>Hash::check</code>، ولو غلط برمي <code>ValidationException</code> برسالة عامة، ولو صح برجّع <code>createToken(...)->plainTextToken</code>. التطبيق بيخزنه ويبعته في <code>Authorization: Bearer</code>. وللـ logout بمسح <code>currentAccessToken()</code>. وبحط على الـ login middleware <code>throttle</code> ضد التخمين." },
      ],
    },
    {
      title: "Sanctum للـ SPA: كوكي بدل التوكن",
      en: "Sanctum SPA cookie authentication",
      body: "<p>لو الـ frontend تطبيق ويب (Vue/React) على نفس الدومين الرئيسي لل API (مثلا <code>app.example.com</code> و<code>api.example.com</code>) متحطش توكن في الـ localStorage. Sanctum بيستخدم <b>session cookie</b> العادية مع حماية CSRF:</p>",
      points: [
        "في Laravel 11 بتفعّل الـ stateful بـ <code>$middleware->statefulApi()</code> في <code>bootstrap/app.php</code>، وبتحط دومين الـ SPA في <code>SANCTUM_STATEFUL_DOMAINS</code>.",
        "الـ SPA بيعمل الأول <code>GET /sanctum/csrf-cookie</code> (Sanctum بتسجل الـ route ده) عشان ياخد كوكي الـ CSRF.",
        "بعدين <code>POST /login</code> بيعمل <code>Auth::attempt</code> عادي ويفتح session. وكل ريكويست بعد كده بيروح بالكوكي، والـ route محمي بنفس <code>auth:sanctum</code>.",
        "الكوكي httpOnly فمش بيتسرق بـ JavaScript. ده الفرق الأمني عن التوكن في localStorage.",
      ],
      pitfall: "SPA على دومين مختلف تماما أو تطبيق موبايل؟ استخدم التوكنات، مش الكوكي. الكوكي محتاجة نفس الدومين الرئيسي وإعدادات CORS و<code>supports_credentials</code>. (الفرع ده مشرحناهوش بتنفيذ في المستوى لأنه محتاج متصفح، اقراه من وثائق Sanctum.)",
      interview: [
        { q: "إمتى تستخدم توكنات Sanctum وإمتى الـ SPA cookie auth؟", a: "الـ SPA cookie auth لما الـ frontend تطبيق ويب على نفس الدومين الرئيسي للـ API: بتستخدم session وCSRF وكوكي httpOnly فمفيش توكن في JavaScript. التوكنات لتطبيقات الموبايل أو أي client على دومين تاني أو طرف تالت: كل جهاز له توكن بـ abilities ممكن تلغيه لوحده." },
      ],
    },
    {
      kicker: "التصريح",
      title: "الـ Gates والـ Policies",
      en: "Gates and policies",
      body: "<p><b>Gate</b> closure بسيطة بتقول مسموح ولا لأ (<code>Gate::define('manage-offices', fn (User $u) => $u->is_admin)</code>). أما <b>Policy</b> فكلاس منظم لكل موديل، فيه method لكل عملية: <code>viewAny</code> و<code>view</code> و<code>create</code> و<code>update</code> و<code>delete</code>. ده الأنسب لما الصلاحية متعلقة بسجل معين (\"يعدّل <i>الإعلان ده</i>\").</p><p>بتعمله: <code>php artisan make:policy ListingPolicy --model=Listing</code>. وفي Laravel 11 مش محتاج تسجّله: بيتكتشف تلقائي لو الاسم <code>App\\Policies\\ListingPolicy</code> للموديل <code>App\\Models\\Listing</code>.</p>",
      code: {
        lang: "php",
        title: "app/Policies/ListingPolicy.php",
        src: `class ListingPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;                      // guests may list
    }

    public function create(User $user): bool
    {
        return $user->offices()->where('is_verified', true)->exists();
    }

    public function update(User $user, Listing $listing): bool
    {
        return $user->id === $listing->office->user_id;
    }

    public function delete(User $user, Listing $listing): Response
    {
        return $user->id === $listing->office->user_id
            ? Response::allow()
            : Response::deny('Only the owning office can delete a listing.');
    }
}`,
        note: "الـ <code>?User</code> معناها السماح للزائر (غير المسجل). والـ <code>Response::deny('...')</code> بترجّع رسالة مخصصة في الـ 403. لو الكلاس مش في المكان المتوقع: <code>Gate::policy(Listing::class, ListingPolicy::class)</code> في <code>AppServiceProvider::boot</code>.",
      },
      interview: [
        { q: "إيه الفرق بين Gate و Policy؟", a: "الاتنين بيطبقوا authorization. الـ Gate هو closure منفردة بتتعرف بـ <code>Gate::define</code> وتناسب الصلاحيات العامة (\"هل هو أدمن؟\"). الـ Policy كلاس مرتبط بموديل وفيه method لكل عملية (<code>update</code>, <code>delete</code>) وبتاخد المستخدم والسجل، فتناسب \"هل المستخدم ده يقدر يعدل الإعلان ده؟\". في Laravel 11 الـ policies بتتسجل تلقائي لو الاسم متبع الاتفاق." },
      ],
    },
    {
      title: "استخدام الصلاحيات: Gate::authorize و can و Gate::before",
      en: "Checking permissions",
      body: "<p>أربع طرق لنفس القاعدة:</p>",
      code: {
        lang: "php",
        src: `// 1. in a controller (throws AuthorizationException => 403)
use Illuminate\\Support\\Facades\\Gate;

public function update(Request $request, Listing $listing)
{
    Gate::authorize('update', $listing);
    // ...
}

// 2. as route middleware
Route::delete('listings/{listing}', [ListingController::class, 'destroy'])
    ->middleware('can:delete,listing');

// 3. anywhere, as a boolean
if ($request->user()->can('update', $listing)) { /* ... */ }

// 4. admins bypass everything (AppServiceProvider::boot)
Gate::before(function (User $user, string $ability) {
    if ($user->is_admin) {
        return true;
    }
});`,
        note: "اتجرب: صاحب المكتب بيعدل (200) والتاني بيتحط عليه 403 برسالة <code>This action is unauthorized.</code>، والأدمن بيعدل أي إعلان. لاحظ إن <code>Gate::before</code> لازم ترجّع <code>true</code> أو <code>null</code> (ملهاش else).",
      },
      pitfall: "في Laravel 11 الـ <code>Controller</code> الأساسي فاضي، ومفيهوش <code>$this->authorize()</code> (كان في الإصدارات القديمة). لو عايزها استخدم trait <code>AuthorizesRequests</code> أو <code>Gate::authorize</code> زي فوق. وخلي بالك: لو <code>Gate::before</code> رجّعت <code>false</code> لغير الأدمن هتمنع الكل.",
      interview: [
        { q: "إزاي تحمي endpoint تعديل إعلان بحيث صاحبه بس (والأدمن) يعدّله؟", a: "بعمل <code>ListingPolicy::update</code> بتقارن <code>$user->id</code> بمالك المكتب، وفي الـ controller بنادي <code>Gate::authorize('update', $listing)</code> أو بحط <code>->middleware('can:update,listing')</code> على الـ route. وللأدمن بعمل <code>Gate::before</code> بترجّع <code>true</code> لو <code>is_admin</code> وإلا <code>null</code> عشان تكمل للـ policy. النتيجة غير المصرح بيه 403 تلقائي." },
      ],
    },
    {
      title: "401 مقابل 403، والـ rate limiting على الـ login",
      en: "401 vs 403 and throttling logins",
      body: "<p>بنكرر الفرق لأنه سؤال إنترفيو ثابت. ومعاه نقطة أمنية: endpoint الـ login هو الهدف الأول للتخمين (brute force)، فبنحط عليه <b>rate limit</b>. الريكويست اللي يعدّي الحد بيرجع <code>429 Too Many Requests</code> مع <code>Retry-After</code> header.</p>",
      code: {
        lang: "php",
        src: `// AppServiceProvider::boot
use Illuminate\\Cache\\RateLimiting\\Limit;
use Illuminate\\Support\\Facades\\RateLimiter;

RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->input('email').'|'.$request->ip());
});

// routes/api.php
Route::post('login', [AuthController::class, 'login'])
    ->middleware('throttle:login');

// without a named limiter: 5 attempts per 1 minute
Route::post('login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');`,
        note: "اتجرب: بعد 5 محاولات الريكويست السادس رجّع <code>429</code> و<code>{\"message\": \"Too Many Attempts.\"}</code> و<code>Retry-After</code>. الـ <code>by(...)</code> بتفصل العدّاد لكل إيميل+IP بدل ما مستخدم يقفل الكل.",
      },
      focus: [{ label: "الخلاصة", text: "401 = مفيش هوية صالحة. 403 = هوية صالحة بس مفيش صلاحية. 429 = كتر الطلبات. ورسالة الـ login الغلط تكون عامة ومتقولش \"الإيميل مش موجود\"." }],
      interview: [
        { q: "إزاي تحمي endpoint الـ login من التخمين؟", a: "بحط عليه rate limiter (<code>throttle:login</code> مع <code>RateLimiter::for</code> بـ <code>Limit::perMinute(5)->by(email.ip)</code>) فالزيادة ترجع 429 مع Retry-After. وبرسالة خطأ عامة، وباسورد قوي (<code>Password::min(8)</code>)، وممكن قفل مؤقت للحساب أو CAPTCHA بعد محاولات كتير، وبراقب محاولات الفشل في اللوج." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: Policy بـ update و delete",
      lang: "php",
      code: `<?php
class ListingPolicy
{
    public function update(User $user, Listing $listing): bool
    {
        return $user->id === $listing->office->user_id;
    }

    public function delete(User $user, Listing $listing): Response
    {
        return $this->update($user, $listing)
            ? Response::allow()
            : Response::deny('Not your listing.');
    }
}`,
    },
    {
      title: "اكتب: login وإنشاء توكن",
      lang: "php",
      code: `<?php
public function login(Request $request)
{
    $data = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required', 'string'],
    ]);

    $user = User::where('email', $data['email'])->first();

    if (! $user || ! Hash::check($data['password'], $user->password)) {
        abort(422, 'Invalid credentials.');
    }

    return ['token' => $user->createToken('mobile')->plainTextToken];
}`,
    },
    {
      title: "اكتب: Gate::before و rate limiter",
      lang: "php",
      code: `<?php
public function boot(): void
{
    Gate::before(function (User $user, string $ability) {
        if ($user->is_admin) {
            return true;
        }
    });

    RateLimiter::for('login', function (Request $request) {
        return Limit::perMinute(5)->by($request->ip());
    });
}`,
    },
  ],

  tasks: [
    {
      title: "Policy للـ Inquiry",
      lang: "php",
      prompt: "<p>اكتب <code>InquiryPolicy</code> للـ <code>Inquiry</code> (فيه <code>user_id</code> للي بعتها، و<code>listing</code> تابع لـ <code>office</code> له <code>user_id</code>). القواعد: <code>view</code> مسموحة للي بعت الاستفسار أو لصاحب المكتب. <code>create</code> مسموحة لأي مستخدم مسجل. <code>delete</code> مسموحة للي بعت الاستفسار بس، وغير كده ترجع <code>Response::deny('Only the sender can delete an inquiry.')</code>.</p>",
      examples: [
        { in: "sender->can('delete', $inquiry)", out: "true" },
        { in: "officeOwner->can('delete', $inquiry)", out: "false (403 مع الرسالة)" },
      ],
      starter: `<?php
class InquiryPolicy
{
    // your code
}`,
      hints: [
        "كل method بتاخد <code>User $user</code> و<code>Inquiry $inquiry</code> (ما عدا <code>create</code>).",
        "صاحب المكتب: <code>$inquiry->listing->office->user_id</code>.",
        "<code>Response::allow()</code> و<code>Response::deny('...')</code> من <code>Illuminate\\Auth\\Access\\Response</code>.",
      ],
      solution: `<?php
use App\\Models\\Inquiry;
use App\\Models\\User;
use Illuminate\\Auth\\Access\\Response;

class InquiryPolicy
{
    public function view(User $user, Inquiry $inquiry): bool
    {
        return $user->id === $inquiry->user_id
            || $user->id === $inquiry->listing->office->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function delete(User $user, Inquiry $inquiry): Response
    {
        return $user->id === $inquiry->user_id
            ? Response::allow()
            : Response::deny('Only the sender can delete an inquiry.');
    }
}`,
      explain: "كل قاعدة صغيرة ومقروءة، وبترجع bool أو <code>Response</code> لو عايز رسالة مخصصة. الـ policy مش بتحط حاجة في الداتابيز، بس بتقرر. وبما إن اسمها <code>InquiryPolicy</code> لـ <code>Inquiry</code> فـ Laravel 11 بيكتشفها تلقائي.",
    },
    {
      title: "login بتوكن بـ abilities وانتهاء",
      lang: "php",
      prompt: "<p>اكتب method <code>login(Request $request)</code> بترجع JSON <code>{'token': ...}</code>. فاليد <code>email</code> و<code>password</code>. لو بيانات الدخول غلط ارمي <code>ValidationException</code> على حقل <code>email</code>. لو المستخدم <code>is_admin</code> اعمله توكن بـ abilities <code>['*']</code>، وغير كده <code>['listings:read', 'listings:write']</code>. التوكن ينتهي بعد 30 يوم، واسمه <code>'mobile'</code>. واحذف توكنات المستخدم القديمة اللي اسمها <code>'mobile'</code> الأول (جهاز واحد بس).</p>",
      hints: [
        "<code>$user->tokens()->where('name', 'mobile')->delete()</code>.",
        "<code>createToken('mobile', $abilities, now()->addDays(30))->plainTextToken</code>.",
        "اختار الـ abilities بـ ternary على <code>$user->is_admin</code>.",
      ],
      solution: `<?php
public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required', 'string'],
    ]);

    $user = User::where('email', $credentials['email'])->first();

    if (! $user || ! Hash::check($credentials['password'], $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['These credentials do not match our records.'],
        ]);
    }

    $user->tokens()->where('name', 'mobile')->delete();

    $abilities = $user->is_admin ? ['*'] : ['listings:read', 'listings:write'];

    return response()->json([
        'token' => $user->createToken('mobile', $abilities, now()->addDays(30))
            ->plainTextToken,
    ]);
}`,
      explain: "مسح التوكنات القديمة بيمنع تراكمها. والتحقق بـ <code>Hash::check</code> مع رسالة عامة ما بتكشفش هل الإيميل موجود. الـ abilities بتحدد إيه اللي التطبيق ده يعمله، وتتفرض بـ <code>tokenCan</code> أو middleware <code>ability:</code>.",
    },
    {
      title: "حماية route بـ can و abilities",
      lang: "php",
      prompt: "<p>اكتب routes في <code>routes/api.php</code> داخل group محمي بـ <code>auth:sanctum</code>: (1) <code>POST /listings</code> لازم المستخدم يقدر <code>create</code> على <code>Listing</code> (policy). (2) <code>PUT /listings/{listing}</code> بـ <code>can:update,listing</code> <b>و</b> التوكن لازم يكون فيه ability <code>listings:write</code>. (3) <code>DELETE /listings/{listing}</code> بـ <code>can:delete,listing</code>. وسجل alias الـ middleware بتاع Sanctum في <code>bootstrap/app.php</code>.</p>",
      hints: [
        "الـ middleware: <code>can:create,App\\Models\\Listing</code> للـ create لأن مفيش سجل بعد.",
        "<code>abilities:listings:write</code> بتتحقق إن التوكن عنده كل الـ abilities المذكورة (والـ <code>ability:</code> بتتحقق من واحدة على الأقل).",
        "الـ aliases: <code>CheckAbilities</code> و<code>CheckForAnyAbility</code> من <code>Laravel\\Sanctum\\Http\\Middleware</code>.",
      ],
      solution: `<?php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'abilities' => \\Laravel\\Sanctum\\Http\\Middleware\\CheckAbilities::class,
        'ability' => \\Laravel\\Sanctum\\Http\\Middleware\\CheckForAnyAbility::class,
    ]);
})

// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('listings', [ListingController::class, 'store'])
        ->middleware('can:create,App\\Models\\Listing');

    Route::put('listings/{listing}', [ListingController::class, 'update'])
        ->middleware(['can:update,listing', 'abilities:listings:write']);

    Route::delete('listings/{listing}', [ListingController::class, 'destroy'])
        ->middleware('can:delete,listing');
});`,
      explain: "في Laravel 11 مفيش Kernel، فالـ aliases بتتسجل في <code>bootstrap/app.php</code>. اتجرب: توكن من غير <code>listings:write</code> بيرجع 403 برسالة <code>Invalid ability provided.</code>. الـ <code>can:update,listing</code> بيستخدم route model binding للـ <code>{listing}</code> ويدخله للـ policy.",
    },
  ],

  quiz: [
    {
      q: "مستخدم مسجل دخول بتوكن صحيح حاول يمسح إعلان مكتب تاني. الـ policy رجّعت false. الرد؟",
      options: ["401", "404", "422", "403"],
      answer: 3,
      why: "الهوية معروفة (التوكن صحيح) فمش 401. الـ policy رفضت الصلاحية فـ <code>AuthorizationException</code> بتتحول لـ 403 تلقائي.",
    },
    {
      q: "ريكويست على route محمي بـ <code>auth:sanctum</code> ومعاه <code>Bearer garbage</code>. الرد؟",
      answer: ["401"],
      why: "التوكن مش موجود/غلط فالمصادقة فشلت: <code>401 Unauthenticated.</code> (اتجرب). 403 كان هيبقى لو الهوية صحيحة والصلاحية ناقصة.",
    },
    {
      q: "الكود ده بيعمل إيه في الـ User موديل؟",
      code: { lang: "php", src: `protected function casts(): array
{
    return ['password' => 'hashed'];
}

// somewhere:
User::create(['name' => 'A', 'email' => 'a@x.com', 'password' => '12345678']);` },
      options: [
        "بيخزن 12345678 زي ما هو",
        "بيرمي خطأ لأن الباسورد لازم تتعمل Hash::make",
        "بيعمل hash للباسورد قبل التخزين تلقائي",
        "بيشفّر الباسورد بمفتاح APP_KEY عشان يتفك بعدين",
      ],
      answer: 2,
      why: "الـ cast <code>hashed</code> (Laravel 10+) بيعمل hash عند التعيين. وهو hash في اتجاه واحد مش تشفير قابل للفك، فالمقارنة بـ <code>Hash::check</code>.",
    },
    {
      q: "عندك توكن اتعمل بـ <code>createToken('t', ['listings:read'])</code> وبتشغل route عليه <code>ability:listings:write</code> (الـ alias متسجل). النتيجة؟",
      options: [
        "200 لأن التوكن صالح",
        "401 لأن التوكن مش صالح",
        "422 فاليديشن",
        "403 بسبب الـ ability الناقصة",
      ],
      answer: 3,
      why: "التوكن صالح (هوية معروفة) لكن ناقصه الـ ability المطلوبة فبيرمي <code>MissingAbilityException</code> وده 403 (اتجرب: <code>Invalid ability provided.</code>).",
    },
    {
      q: "Gate::before ده فيه مشكلة. إيه هي؟",
      code: { lang: "php", src: `Gate::before(function (User $user, string $ability) {
    return $user->is_admin;
});` },
      options: [
        "مفيش مشكلة",
        "بترجّع false لغير الأدمن فبتمنع الكل من أي عملية حتى لو الـ policy تسمح",
        "لازم تكون في الـ Policy مش في الـ AppServiceProvider",
        "بتتجاهل لو المستخدم أدمن",
      ],
      answer: 1,
      why: "أي قيمة غير null بترجع من <code>before</code> بتحسم القرار. <code>false</code> لغير الأدمن معناها رفض نهائي قبل ما الـ policy تتفحص. المفروض ترجع <code>true</code> للأدمن و<code>null</code> للباقي.",
    },
    {
      q: "أنهي option بيخلي الـ policy تُكتشف تلقائي في Laravel 11 للموديل <code>App\\Models\\Listing</code>؟",
      options: [
        "كلاس اسمه <code>App\\Policies\\ListingPolicy</code>",
        "لازم <code>Gate::policy()</code> في كل الحالات",
        "تسجيلها في <code>Kernel.php</code>",
        "حطها في <code>config/auth.php</code>",
      ],
      answer: 0,
      why: "Laravel بيدوّر على <code>App\\Policies\\{Model}Policy</code> تلقائي. محتاج <code>Gate::policy</code> بس لو الاسم أو المكان مختلف. ومفيش Kernel في Laravel 11.",
    },
    {
      q: "عدّيت الحد على <code>throttle:login</code> (5 في الدقيقة). الريكويست السادس يرجع كام؟",
      answer: ["429"],
      why: "<code>429 Too Many Requests</code> مع <code>Retry-After</code> header. (اتجرب: الرد <code>{\"message\": \"Too Many Attempts.\"}</code>).",
    },
    {
      q: "أنهي طريقة تخزين صح لباسورد المستخدم؟",
      options: [
        "<code>md5($password)</code>",
        "<code>Crypt::encrypt($password)</code> عشان نقدر نفكه لو نسي",
        "<code>Hash::make($password)</code> أو cast <code>hashed</code>، والتحقق بـ <code>Hash::check</code>",
        "<code>sha256</code> مع APP_KEY",
      ],
      answer: 2,
      why: "الباسورد مبيتفكش أبدا. bcrypt/argon2 بطيئين ومعاهم salt. md5/sha سريعين فالتخمين سهل، والتشفير القابل للفك معناه إن اللي يسرق المفتاح يشوف كل الباسوردات.",
    },
    {
      q: "تطبيق Flutter بيكلم الـ API. إيه الأنسب؟",
      options: [
        "Sanctum SPA cookie auth لأن الكوكي أأمن",
        "توكنات Sanctum (Bearer) لكل جهاز",
        "إرسال الباسورد مع كل ريكويست",
        "Basic auth بإيميل وباسورد ثابت",
      ],
      answer: 1,
      why: "تطبيق الموبايل مش متصفح، مفيهوش cookie jar ولا CSRF وعلى دومين مختلف، فنستخدم توكنات بـ abilities ممكن تتلغي لكل جهاز. كوكي SPA للـ web على نفس الدومين الرئيسي.",
    },
  ],
};
