window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l3"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "أي input جاي من برا فيه شك لحد ما نثبت العكس",
      en: "Why validation matters",
      body: "<p>الـ API بتاعك بتستقبل أي حاجة: نصوص غلط، أرقام سالبة، حقول مش المفروض تتبعت أصلا. الـ validation هو أول خط دفاع، وهو كمان اللي بيخلي الأخطاء واضحة للـ client (الموبايل أو الـ frontend) بدل 500 غامضة.</p><p>الأسئلة المعتادة: إيه اللي بيحصل لما الـ validation يفشل؟ ليه Form Request؟ الفرق بين <code>validated()</code> و <code>all()</code>؟ وده مرتبط مباشرة بالـ mass assignment.</p>",
      points: [
        "الريكويست بيوصلك في object اسمه <code>Illuminate\\Http\\Request</code> بتقرأ منه كل حاجة.",
        "تتحقق منه بـ <code>$request->validate([...])</code> أو الأحسن: Form Request class.",
        "الأخطاء: ويب بيعمل redirect للصفحة اللي قبلها، وJSON بيرجّع <b>422</b> مع الأخطاء.",
      ],
    },
    {
      title: "الـ Request object: تقرأ منه إيه؟",
      en: "Reading input",
      body: "<p>الـ <code>Request</code> بيجمع الـ query string والـ body والملفات. بتاخده كـ parameter في الـ controller وLaravel بتحقنه لوحدها.</p>",
      code: {
        lang: "php",
        title: "POST /x?page=2  with name=Ali&active=on",
        src: `<?php

$request->input('name');            // 'Ali'  (body OR query)
$request->input('missing', 'def');  // 'def'  (default value)
$request->query('page');            // '2'    (query string only)
$request->post('name');             // 'Ali'  (body only)
$request->only('name', 'page');     // ['name' => 'Ali', 'page' => '2']
$request->except('page');           // everything but page
$request->boolean('active');        // true   ('on', '1', 'true', 'yes' -> true)
$request->integer('page');          // 2
$request->has('empty');             // true even if it is ''
$request->filled('empty');          // false when '' or null
$request->input('items.*.sku');     // ['1', '2'] for a nested array
$request->file('photo');            // UploadedFile or null
$request->hasFile('photo');         // bool
$request->user();                   // logged-in user or null
$request->method();                 // 'POST'
$request->isMethod('post');         // true`,
        note: "الفرق المهم: <code>has</code> بتشوف المفتاح موجود، و<code>filled</code> بتشوف إنه موجود وله قيمة. و<code>boolean</code> بتحوّل القيم النصية الشائعة. جربت كل السطور دي على ريكويست حقيقي.",
      },
      pitfall: "<code>$request->all()</code> بترجع كل حاجة المستخدم بعتها، بما فيها حقول ما كانتش متوقعة. متبعتهاش مباشرة لـ <code>create()</code> أو <code>update()</code> (هنشوف ليه في آخر المستوى).",
    },
    {
      title: "validate(): وإيه اللي بيحصل لما يفشل",
      en: "Inline validation and failure behaviour",
      body: "<p><code>$request->validate($rules)</code> بترجّع الداتا اللي عدّت الفحص لو نجح. لو فشل بترمي <code>ValidationException</code> وLaravel بتتعامل معاها حسب نوع الريكويست.</p>",
      code: {
        lang: "php",
        src: `<?php

public function store(Request $request): JsonResponse
{
    $data = $request->validate([
        'title' => ['required', 'string', 'max:120'],
        'price' => ['required', 'integer', 'min:1'],
    ]);

    // only reached when validation passed
    $listing = Listing::create($data + ['office_id' => 1]);

    return response()->json($listing, 201);
}

// JSON request that fails -> HTTP 422:
// {
//   "message": "The title field is required. (and 1 more error)",
//   "errors": {
//     "title": ["The title field is required."],
//     "price": ["The price field must be an integer."]
//   }
// }`,
        note: "نفس الكود لو الريكويست جاي من فورم عادي (مش بيطلب JSON): Laravel بترجّع <b>302 redirect</b> للصفحة اللي كان فيها المستخدم، وبتحط الأخطاء في الـ session (<code>$errors</code> في Blade) والقيم القديمة (<code>old()</code>). جربتها: بيرجع 302 مع <code>Location</code> للصفحة السابقة.",
      },
      focus: [{ label: "احفظها", text: "JSON (أو <code>Accept: application/json</code>) → 422 + شكل <code>{message, errors}</code>. فورم عادي → redirect back + session errors. لازم الـ client يبعت <code>Accept: application/json</code> وإلا هيجيله redirect بدل JSON." }],
      interview: [
        { q: "إيه اللي بيحصل لما الـ validation يفشل في Laravel؟", a: "الـ <code>validate()</code> بترمي <code>ValidationException</code>. لو الريكويست بيتوقع JSON (header اسمه Accept فيه application/json أو AJAX) الريسبونس بيكون <b>422</b> وجسمه <code>message</code> و <code>errors</code> (مفتاح لكل حقل وجواه array رسائل). لو ريكويست ويب عادي، الريسبونس redirect للصفحة السابقة والأخطاء محفوظة في session والقيم القديمة متاحة بـ <code>old()</code>، والكود بعد <code>validate()</code> مش بيتنفذ." },
      ],
    },
    {
      title: "Form Request: الفاليديشن في كلاس لوحده",
      en: "Form Request classes",
      body: "<p>لما القواعد تكبر، بنطلعها من الـ controller لكلاس مخصص: <code>php artisan make:request StoreListingRequest</code>. بتحقنه في الـ method بدل <code>Request</code> وLaravel بتشغّل الفحص <b>قبل</b> ما الـ method تتنادى. لو فشل مبتوصلش للـ controller أصلا.</p>",
      code: {
        lang: "php",
        title: "app/Http/Requests/StoreListingRequest.php",
        src: `<?php

namespace App\\Http\\Requests;

use App\\Enums\\ListingStatus;
use Illuminate\\Foundation\\Http\\FormRequest;
use Illuminate\\Validation\\Rule;

class StoreListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'title' => trim((string) $this->input('title')),
        ]);
    }

    public function rules(): array
    {
        return [
            'office_id' => ['required', 'integer', 'exists:offices,id'],
            'title' => ['required', 'string', 'max:120'],
            'price' => ['required', 'integer', 'min:1'],
            'status' => ['sometimes', Rule::enum(ListingStatus::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'price.min' => 'The price must be at least 1.',
        ];
    }
}`,
        note: "<code>authorize()</code> بترجع true/false: لو false الريسبونس 403. <code>prepareForValidation()</code> بتنضّف الداتا قبل الفحص. <code>messages()</code> بتغيّر نص الخطأ لقاعدة معينة بصيغة <code>field.rule</code>.",
      },
      pitfall: "الـ stub اللي بيولّده <code>make:request</code> فيه <code>authorize()</code> بترجع <b>false</b> افتراضيا. لو نسيت تغيّرها لـ <code>true</code> (أو تحط منطق صلاحيات) كل ريكويست هيرجع 403 وإنت مش فاهم ليه. اتأكدت من ده بنفسي.",
      interview: [
        { q: "ليه تستخدم Form Request بدل <code>$request->validate()</code> في الـ controller؟", a: "بيفصل القواعد عن منطق الـ controller فيفضل نضيف، وبيتعاد استخدامه بين <code>store</code> و <code>update</code> مثلا، وفيه أماكن جاهزة لـ <code>authorize()</code> (الصلاحيات) و <code>prepareForValidation()</code> (تنضيف قبل الفحص) و <code>messages()</code> (رسائل مخصصة). والفحص بيتم قبل ما الـ method تتنادى، فالـ controller بيشوف داتا سليمة بس." },
      ],
    },
    {
      title: "القواعد الأكثر استخداما",
      en: "Common rules",
      body: "<p>القاعدة تتكتب كـ array (الأفضل) أو نص بفواصل <code>'required|string'</code>. دول اللي هتستخدمهم 90% من الوقت:</p>",
      code: {
        lang: "php",
        src: `<?php

return [
    'title' => ['required', 'string', 'max:120'],
    'description' => ['nullable', 'string'],
    'nick' => ['sometimes', 'string'],
    'price' => ['required', 'integer', 'min:1'],
    'bedrooms' => ['required', 'integer', 'between:0,20'],
    'email' => ['required', 'email'],
    'status' => ['required', 'in:draft,published,sold'],
    'office_id' => ['required', 'exists:offices,id'],
    'is_featured' => ['boolean'],
    'password' => ['required', 'min:8', 'confirmed'],
];`,
        note: "<code>confirmed</code> بتدور على حقل اسمه <code>password_confirmation</code> وتقارنه. <code>exists:offices,id</code> بتتأكد إن القيمة موجودة في عمود <code>id</code> في جدول <code>offices</code> (query فعلي في الداتابيز).",
      },
      terms: [
        ["nullable", "مسموح تكون null", "الحقل ممكن يوصل null أو فاضي من غير ما يفشل باقي القواعد."],
        ["sometimes", "افحصه لو موجود", "لو الحقل مش موجود في الريكويست خالص تجاهل قواعده. لو موجود افحصه عادي."],
      ],
      pitfall: "<code>nullable</code> و<code>sometimes</code> مش نفس الحاجة. <code>sometimes</code> لوحدها مع <code>string</code>: لو الحقل موجود وقيمته <code>null</code> (أو نص فاضي لأن Laravel بتحوّل الفاضي لـ null) الفحص <b>يفشل</b>. جربتها. استخدم <code>nullable</code> لو القيمة ممكن تكون null، و<code>sometimes</code> للـ PATCH لما الحقل ممكن ميتبعتش. وكمان <code>between</code> و <code>min</code> و <code>max</code> لازم يتحطوا مع <code>integer</code> أو <code>string</code>، وإلا بتتحسب على طول النص: <code>25</code> مع <code>between:0,20</code> وحدها بتعدي!",
      interview: [
        { q: "إيه الفرق بين <code>nullable</code> و <code>sometimes</code> و <code>required</code>؟", a: "<code>required</code>: لازم يكون موجود ومش فاضي. <code>nullable</code>: مسموح بـ null (ويبقى باقي القواعد متتفحصش على null). <code>sometimes</code>: لو الحقل مش موجود في الريكويست اتجاهله، ولو موجود طبّق باقي القواعد عليه (حتى لو null، ويفشل لو معاه <code>string</code> وهو null). في PATCH بنستخدم <code>sometimes</code> للحقول الاختيارية و<code>nullable</code> لو العمود نفسه يقبل null." },
      ],
    },
    {
      title: "Arrays المتداخلة و unique و exists",
      en: "Nested arrays, unique with ignore, exists",
      body: "<p>لما الحقل array من objects (زي مميزات الإعلان أو عناصر طلب) بنستخدم <code>*</code>. ولما نعدّل سجل موجود لازم <code>unique</code> يتجاهل السجل نفسه وإلا هيقول «اتاخد قبل كده» لأن القيمة بتاعتك أنت.</p>",
      code: {
        lang: "php",
        title: "UpdateOfficeRequest + nested example",
        src: `<?php

use App\\Rules\\ValidLicenseNo;
use Illuminate\\Validation\\Rule;

public function rules(): array
{
    return [
        'name' => ['sometimes', 'string', 'max:100'],
        'license_no' => [
            'sometimes',
            new ValidLicenseNo,
            Rule::unique('offices', 'license_no')
                ->ignore($this->route('office')),
        ],
        'amenities' => ['nullable', 'array'],
        'amenities.*' => ['string', 'in:pool,garden,parking,elevator'],
        'items' => ['required', 'array', 'min:1'],
        'items.*.sku' => ['required', 'string'],
        'items.*.qty' => ['required', 'integer', 'min:1'],
    ];
}`,
        note: "الخطأ في الـ array المتداخل بيجي بمفتاح بالـ index: <code>items.1.qty</code> مثلا لو العنصر التاني كميته 0. و<code>ignore($this->route('office'))</code> بتاخد الـ model اللي اتحقن من الـ route وتتجاهل الـ id بتاعه.",
      },
      pitfall: "لو نسيت <code>ignore</code> في الـ update، المستخدم مش هيقدر يحفظ سجله من غير ما يغيّر الحقل الـ unique لأن القيمة بتاعته موجودة فعلا. ومتحطش <code>ignore($request->input('id'))</code> بقيمة جاية من المستخدم: ممكن يتلاعب بيها. خدها من الـ route.",
      interview: [
        { q: "إزاي بتعمل validation لحقل unique وقت التعديل؟", a: "بستخدم <code>Rule::unique('offices', 'license_no')->ignore($office)</code> (أو الـ id بتاعه)، عشان الفحص يتجاهل السجل اللي بعدّله، وإلا هيفشل لأن القيمة موجودة عنده. الـ id بيجي من الـ route المحقون (<code>$this->route('office')</code>) مش من بيانات المستخدم." },
      ],
    },
    {
      title: "الملفات",
      en: "File validation",
      body: "<p>الملف بيوصل في <code>multipart/form-data</code> وبتقرأه بـ <code>$request->file('photo')</code>. القواعد الأساسية: <code>file</code> (لازم يكون ملف مرفوع)، <code>image</code> (صورة)، <code>mimes</code> (امتدادات مسموحة)، و<code>max</code> (الحجم الأقصى بالـ <b>كيلوبايت</b>).</p>",
      code: {
        lang: "php",
        src: `<?php

public function store(Request $request): array
{
    $request->validate([
        'photo' => ['required', 'file', 'mimes:jpg,png', 'max:2048'],
        'photos' => ['sometimes', 'array', 'max:10'],
        'photos.*' => ['image', 'max:2048'],
    ]);

    return [
        'name' => $request->file('photo')->getClientOriginalName(),
        'has' => $request->hasFile('photo'),
    ];
}`,
        note: "جربتها: صورة jpg بتعدي، وملف pdf بيرجع «must be a file of type: jpg, png»، وملف 5000 كيلوبايت بيرجع «must not be greater than 2048 kilobytes». حفظ الملف نفسه (<code>store()</code>) هنشوفه في مستوى الـ storage.",
      },
      pitfall: "الـ <code>max:2048</code> للملفات معناها 2048 كيلوبايت (2MB) مش بايت. وتأكد إن الفورم <code>enctype=multipart/form-data</code> والـ JSON مبيبعتش ملفات. وحدود الرفع في PHP نفسها (<code>upload_max_filesize</code> و<code>post_max_size</code> في php.ini) ممكن تقطع الملف قبل ما Laravel تشوفه.",
    },
    {
      title: "Custom Rule objects",
      en: "Custom validation rules",
      body: "<p>لما قاعدة مش موجودة جاهزة (رقم ترخيص بشكل معين مثلا)، بتعمل Rule object: <code>php artisan make:rule ValidLicenseNo</code>. الـ method اسمها <code>validate</code> وبتاخد اسم الحقل والقيمة و closure اسمها <code>$fail</code> بتناديها برسالة الخطأ لو القيمة غلط.</p>",
      code: {
        lang: "php",
        title: "app/Rules/ValidLicenseNo.php",
        src: `<?php

namespace App\\Rules;

use Closure;
use Illuminate\\Contracts\\Validation\\ValidationRule;

class ValidLicenseNo implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! preg_match('/^LIC-\\d{5}$/', (string) $value)) {
            $fail('The :attribute must look like LIC-12345.');
        }
    }
}

// usage in rules():
// 'license_no' => ['required', new ValidLicenseNo],
// or a one-off closure:
// 'code' => [function ($attr, $value, $fail) { ... }],`,
        note: "الـ rule بيعدي لو ما ناديتش <code>$fail</code>. <code>:attribute</code> بيتبدل باسم الحقل. جربته: <code>ABC</code> بترجع «The l must look like LIC-12345.» و<code>LIC-12345</code> بتعدي.",
      },
    },
    {
      title: "validated() مقابل all() ومشكلة الـ mass assignment",
      en: "validated() and mass assignment",
      body: "<p>المستخدم ممكن يبعت حقول إنت ما طلبتهاش. لو عملت <code>Model::create($request->all())</code> وكان الـ model بيسمح بالـ mass assignment، ممكن حد يبعت <code>is_admin=true</code> أو <code>price=1</code> أو <code>office_id</code> بتاع مكتب تاني ويتخزنوا. الحل: متستخدمش <code>all()</code> مع الكتابة أبدا. استخدم <code>validated()</code> اللي بترجّع الحقول اللي ليها قواعد بس.</p>",
      code: {
        lang: "php",
        src: `<?php

// Request body: listing_id, message, is_admin=true
// rules() only knows listing_id and message

$request->all();         // ['listing_id' => 1, 'message' => '...', 'is_admin' => true]
$request->validated();   // ['listing_id' => 1, 'message' => '...']

// good:
Inquiry::create($request->validated());

// also fine for a subset of the validated data:
$request->safe()->only(['message']);
$request->safe()->except(['listing_id']);

// BAD: the user decides which columns get written
Inquiry::create($request->all());`,
        note: "جربت ريكويست فيه حقل زيادة <code>is_admin</code>: <code>validated()</code> مرجعتوش و<code>all()</code> رجّعته. حتى لو الـ model عنده <code>$fillable</code> بيحميك، استخدام <code>validated()</code> هو الطبقة الأولى والـ <code>$fillable</code> التانية.",
      },
      focus: [{ label: "احفظها", text: "الكتابة في الداتابيز دايما من <code>$request->validated()</code> (أو <code>safe()</code>) مش <code>all()</code>. الحقل اللي ملوش rule مبيوصلش." }],
      interview: [
        { q: "إيه الفرق بين <code>$request->validated()</code> و <code>$request->all()</code> وليه ده مهم؟", a: "<code>all()</code> بترجع كل اللي المستخدم بعته، بما فيه حقول مش متوقعة. <code>validated()</code> بترجع الحقول اللي ليها rules وعدّت الفحص بس. لو مررت <code>all()</code> لـ <code>create</code> أو <code>update</code> ممكن مستخدم يبعت <code>is_admin</code> أو <code>office_id</code> غلط ويتكتبوا (mass assignment vulnerability). فبستخدم <code>validated()</code> وبحدد <code>$fillable</code> في الـ model كطبقة حماية تانية." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: قواعد الفاليديشن",
      lang: "php",
      code: `<?php

public function rules(): array
{
    return [
        'title' => ['required', 'string', 'max:120'],
        'price' => ['required', 'integer', 'min:1'],
        'office_id' => ['required', 'exists:offices,id'],
        'description' => ['nullable', 'string'],
        'amenities' => ['nullable', 'array'],
        'amenities.*' => ['string', 'in:pool,garden'],
    ];
}`,
    },
    {
      title: "اكتب: Form Request",
      lang: "php",
      code: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class StoreInquiryRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'listing_id' => ['required', 'exists:listings,id'],
            'message' => ['required', 'string', 'min:10'],
        ];
    }
}`,
      note: "في الكود الحقيقي لازم تضيف <code>authorize()</code> بترجع true. هنا بنتمرن على الشكل بس.",
    },
    {
      title: "اكتب: Custom Rule",
      lang: "php",
      code: `<?php

use Closure;
use Illuminate\\Contracts\\Validation\\ValidationRule;

class EvenPrice implements ValidationRule
{
    public function validate(
        string $attribute,
        mixed $value,
        Closure $fail,
    ): void {
        if ((int) $value % 2 !== 0) {
            $fail('The :attribute must be even.');
        }
    }
}`,
    },
  ],

  tasks: [
    {
      title: "قواعد إرسال استفسار",
      lang: "php",
      prompt: "<p>اكتب method <code>rules()</code> لـ <code>StoreInquiryRequest</code>: <code>listing_id</code> مطلوب integer وموجود في جدول <code>listings</code> عمود <code>id</code>. <code>message</code> مطلوب نص من 10 لـ 1000 حرف. <code>email</code> اختياري لكن لو موجود لازم يكون إيميل صحيح.</p>",
      hints: [
        "<code>exists:listings,id</code> للتأكد من وجود السجل.",
        "الاختياري مع احتمال null: <code>nullable</code> + <code>email</code>.",
      ],
      solution: `<?php

public function rules(): array
{
    return [
        'listing_id' => ['required', 'integer', 'exists:listings,id'],
        'message' => ['required', 'string', 'min:10', 'max:1000'],
        'email' => ['nullable', 'email'],
    ];
}`,
      explain: "<code>min</code>/<code>max</code> مع <code>string</code> بتتحسب بعدد الحروف. <code>nullable</code> هنا بتسمح بغياب القيمة أو null فمتفشلش <code>email</code>. الكود ده اتجرب فعلا: رسائل الأخطاء طلعت لكل حقل.",
    },
    {
      title: "UpdateOfficeRequest مع unique ومعالجة قبل الفحص",
      lang: "php",
      prompt: "<p>اكتب كلاس <code>UpdateOfficeRequest</code> كامل (<code>authorize</code> ترجع true). في <code>prepareForValidation</code> لو <code>license_no</code> موجود حوّله لحروف كبيرة وشيل المسافات من الأطراف. في <code>rules</code>: <code>name</code> بـ <code>sometimes</code> نص أقصاه 100، و<code>license_no</code> بـ <code>sometimes</code> وunique في جدول <code>offices</code> عمود <code>license_no</code> مع تجاهل المكتب الحالي (الـ route بيحقن <code>{office}</code>).</p>",
      hints: [
        "<code>$this->merge([...])</code> داخل <code>prepareForValidation</code>.",
        "<code>Rule::unique('offices', 'license_no')->ignore($this->route('office'))</code>.",
      ],
      solution: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;
use Illuminate\\Validation\\Rule;

class UpdateOfficeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('license_no')) {
            $this->merge([
                'license_no' => strtoupper(trim($this->input('license_no'))),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:100'],
            'license_no' => [
                'sometimes',
                'string',
                Rule::unique('offices', 'license_no')
                    ->ignore($this->route('office')),
            ],
        ];
    }
}`,
      explain: "التنضيف قبل الفحص مهم عشان <code>unique</code> تقارن بالقيمة النظيفة. <code>ignore</code> بتاخد الـ model المحقون (أو id) فبتتجاهل سجل المكتب نفسه. جربنا: تعديل الاسم بس بيعدي، وتعديل الترخيص لقيمة مكتب تاني بيرجع 422.",
    },
    {
      title: "controller آمن للاستفسارات",
      lang: "php",
      prompt: "<p>اكتب <code>InquiryController::store(StoreInquiryRequest $request)</code> اللي بينشئ <code>Inquiry</code> من الداتا المفحوصة بس وبيرجّع JSON بكود 201. وبعدها اشرح في تعليق ليه استخدمت <code>validated()</code> مش <code>all()</code>، ولو مستخدم بعت <code>user_id=99</code> إيه اللي هيحصل.</p>",
      hints: [
        "<code>Inquiry::create($request->validated())</code>.",
        "الحقول اللي مالهاش rule مبتظهرش في <code>validated()</code>.",
      ],
      solution: `<?php

namespace App\\Http\\Controllers;

use App\\Http\\Requests\\StoreInquiryRequest;
use App\\Models\\Inquiry;
use Illuminate\\Http\\JsonResponse;

class InquiryController extends Controller
{
    public function store(StoreInquiryRequest $request): JsonResponse
    {
        // validated() holds only listing_id, message, email.
        // A client-supplied user_id or read_at is dropped here,
        // so nobody can create an inquiry as someone else.
        $inquiry = Inquiry::create($request->validated());

        return response()->json($inquiry, 201);
    }
}`,
      explain: "اتجرب: ريكويست فيه <code>user_id=99</code> و <code>read_at</code> اتخزن بدونهم (<code>user_id</code> طلع null). الـ model بيحمي برضه بـ <code>$fillable</code> لكن الطبقة الأولى هي إنك متعدّيش غير المفحوص. ملحوظة: <code>email</code> هتتفحص بس مش هتتخزن لأن الجدول ملوش العمود ولا هو في <code>$fillable</code>.",
    },
  ],

  quiz: [
    {
      q: "ريكويست JSON فشل في الـ validation. إيه كود الحالة اللي Laravel بترجّعه تلقائيا؟",
      answer: ["422"],
      why: "<code>422 Unprocessable Entity</code> مع جسم فيه <code>message</code> و <code>errors</code>. لو الريكويست مش JSON بيحصل redirect (302) بدل كده، وده اللي بيلخبط ناس كتير لما العميل مبيبعتش <code>Accept: application/json</code>.",
    },
    {
      q: "إيه اللي بيحصل في الكود ده لو جه <code>{\"nick\": null}</code>؟",
      code: { lang: "php", src: `<?php
$rules = ['nick' => ['sometimes', 'string']];` },
      options: [
        "بيعدي لأن الحقل اختياري",
        "بيتجاهل الحقل كأنه مش موجود",
        "بيرمي Exception مش validation error",
        "بيفشل لأن <code>sometimes</code> مبتسمحش بـ null (محتاج nullable)",
      ],
      answer: 3,
      why: "<code>sometimes</code> معناها «لو الحقل موجود طبّق القواعد». الحقل موجود (قيمته null) فبتتطبق <code>string</code> وتفشل. الحل <code>nullable</code>. لو الحقل مش مبعوت أصلا كان هيعدي.",
    },
    {
      q: "إيه الناتج؟ (الحقل رقم ومعاه rule واحدة)",
      code: { lang: "php", src: `<?php
$v = Validator::make(['bedrooms' => 25], ['bedrooms' => 'between:0,20']);
echo $v->passes() ? 'pass' : 'fail';` },
      answer: ["pass"],
      why: "من غير <code>integer</code> أو <code>numeric</code>، Laravel بتتعامل مع القيمة كنص وبتقيس طولها (حرفين) فتعدي بين 0 و20. لازم <code>['integer', 'between:0,20']</code>. جربتها بنفسي وطبعت pass.",
    },
    {
      q: "عندك <code>Listing::create($request->all())</code> وبعت مستخدم حقل <code>is_featured=1</code> ما كانش في الـ rules. إيه الأقرب للصح؟",
      options: [
        "الحقل مش هيتخزن لأن الـ validation حذفه",
        "الحقل ممكن يتخزن لو كان في <code>$fillable</code> للموديل، لأن <code>all()</code> بترجع كل المدخلات",
        "الحقل بيتخزن دايما حتى لو مش في <code>$fillable</code>",
        "Laravel بترمي exception لأي حقل مش متوقع",
      ],
      answer: 1,
      why: "<code>all()</code> مبتفلترش. اللي بيحمي هو <code>$fillable</code> لو الحقل مش فيه. الحل الأمثل <code>validated()</code>. مفيش exception بتترمي لحقول زيادة (إلا لو ظبطت الإعداد الصارم)، والحقول خارج <code>$fillable</code> بتتجاهل بصمت.",
    },
    {
      q: "في Form Request اتولد بـ <code>make:request</code> وإنت لسه ما غيّرتش حاجة، كل الريكويستات بترجع 403. السبب؟",
      options: [
        "الـ <code>authorize()</code> في الـ stub بترجع false",
        "قواعد <code>rules()</code> فاضية فبتفشل",
        "لازم تسجل الـ Form Request في <code>bootstrap/app.php</code>",
        "الـ middleware <code>auth</code> مفعّل افتراضيا",
      ],
      answer: 0,
      why: "الـ stub بيجي بـ <code>authorize(): bool { return false; }</code> ولازم تغيّرها لـ true أو تحط منطق الصلاحيات. القواعد الفاضية معناها كل حاجة تعدي. ومفيش تسجيل للـ Form Requests.",
    },
    {
      q: "أنهي توقيع صح لـ Custom Rule في Laravel 11؟",
      options: [
        "<code>public function passes($attribute, $value): bool</code>",
        "<code>public function validate(string $attribute, mixed $value, Closure $fail): void</code>",
        "<code>public function check($value): bool</code>",
        "<code>public function __invoke($value): string</code>",
      ],
      answer: 1,
      why: "الـ rule بتنفذ <code>ValidationRule</code> وبتعرّف <code>validate</code> وبتنادي <code>$fail('msg')</code> عند الخطأ. الاختيار الأول هو شكل الإصدارات القديمة (interface <code>Rule</code>).",
    },
    {
      q: "الخطأ اللي بيرجع لعنصر فيه كمية 0 في الـ array التاني من <code>items</code> (مع rule <code>items.*.qty</code> بـ <code>min:1</code>) هيبقى تحت أنهي مفتاح في <code>errors</code>؟",
      answer: ["items.1.qty"],
      why: "الـ index بيبدأ من صفر، فالعنصر التاني هو <code>items.1.qty</code> (المفاتيح بصيغة dot notation). جربتها وطلع بالظبط الشكل ده.",
    },
    {
      q: "بتعدّل مكتب وعايز الـ <code>license_no</code> يفضل unique. أنهي كود صح؟",
      options: [
        "<code>'license_no' => 'unique:offices'</code> وبس",
        "<code>Rule::unique('offices', 'license_no')->ignore($request->input('id'))</code>",
        "<code>Rule::unique('offices', 'license_no')->ignore($this->route('office'))</code>",
        "<code>'license_no' => 'exists:offices,license_no'</code>",
      ],
      answer: 2,
      why: "لازم تتجاهل السجل الحالي، والـ id يجي من الـ route المحقون مش من input المستخدم. الاختيار الأول هيفشل لأن المكتب نفسه عنده القيمة، والتاني ممكن يتلاعب بيه المستخدم، والرابع عكس المطلوب (بيشترط الوجود).",
    },
    {
      q: "أنهي واحد من دول صحيح عن <code>$request->validated()</code>؟",
      options: [
        "بترجع كل المدخلات لكن مع تنضيفها",
        "بتشتغل بس مع Form Request ومينفعش مع <code>validate()</code>",
        "بتجيب القيم من الداتابيز بعد الحفظ",
        "بترجع المدخلات اللي ليها rules وعدّت الفحص بس",
      ],
      answer: 3,
      why: "<code>validated()</code> فيها الحقول المعرّفة في rules بعد نجاح الفحص بس. <code>$request->validate([...])</code> برضه بترجع نفس النتيجة، و<code>validated()</code> متاحة على Form Request.",
    },
    {
      q: "ملف مرفوع حجمه 3 ميجا، والقاعدة <code>'max:2048'</code>. إيه النتيجة؟",
      options: [
        "بيفشل لأن 2048 بتتحسب بالكيلوبايت = حوالي 2MB",
        "بيعدي لأن 2048 بالميجا",
        "بيعدي لأن max بتتجاهل الملفات",
        "بيفشل لأن max للنصوص بس",
      ],
      answer: 0,
      why: "في الملفات <code>max</code> و<code>min</code> بالكيلوبايت. 3 ميجا = 3072 كيلوبايت أكبر من 2048 فيفشل. جربتها بملف 5000 كيلوبايت وطلع «must not be greater than 2048 kilobytes».",
    },
  ],
};
