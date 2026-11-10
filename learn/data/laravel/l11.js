window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l11"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "الـ middleware والـ events: كود بيتنفذ من غير ما حد ينادي عليه",
      en: "Why middleware and events",
      body: "<p>في المستوى ده بنشوف نوعين من الكود \"اللي بيتنفذ لوحده\": الـ <b>middleware</b> (فلتر حوالين كل ريكويست: مصادقة، تحقق من صلاحية، تسجيل وقت) والـ <b>events</b> (\"حاجة حصلت\"، وأي حد مهتم ينفذ ردة فعله: إيميل، إشعار، سجل مراجعة). الاتنين بيفصلوا الكود المتكرر عن الـ controller، لكن الاتنين كمان ممكن يخبوا السلوك ويصعّبوا التتبع لو اتبالغ فيهم.</p>",
      points: [
        "الـ middleware بيشتغل <b>حوالين</b> الريكويست: ممكن يوقفه قبل الـ controller، أو يعدّل الريسبونس بعده.",
        "الـ event بيعلن إن حاجة حصلت (<code>ListingPublished</code>)، والـ listeners (واحد أو أكتر) هما اللي بيردوا. مين بيعمل dispatch مبيعرفش مين بيسمع.",
        "الـ model events والـ observers هما events بتحصل أوتوماتيك على <code>create</code>/<code>update</code>/<code>delete</code> للـ Eloquent models، لكن لها حالات مش بتشتغل فيها.",
      ],
      interview: [
        { q: "إيه الفرق بين middleware و event؟", a: "الـ middleware طبقة حوالين الريكويست (HTTP): بيشوف الريكويست قبل الـ controller وممكن يرفضه أو يمرره، وبيشوف الريسبونس بعده. الـ event إشعار بإن حاجة حصلت في النظام (مش مرتبط بـ HTTP بالضرورة)، وبيتعامل معاه صفر أو أكتر listener من غير ما اللي أطلقه يعرفهم. الأول للـ cross-cutting concerns على الريكويست (auth، throttle، logging)، والتاني للتفاعلات بين أجزاء النظام (بعد النشر ابعت إشعار)." },
      ],
    },
    {
      title: "الـ middleware: قبل وبعد الـ controller",
      en: "Middleware: before and after",
      body: "<p>تخيّل بصلة: الريكويست بيعدي على الطبقات من برا لجوه لحد الـ controller، والريسبونس بيرجع من جوه لبرا. كل middleware method اسمها <code>handle($request, Closure $next)</code>. اللي تكتبه <b>قبل</b> <code>$next($request)</code> بيشتغل قبل الـ controller، واللي بعده بيشتغل بعد ما الـ controller يرد.</p>",
      code: {
        lang: "php",
        title: "app/Http/Middleware/EnsureOfficeIsVerified.php",
        src: `class EnsureOfficeIsVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        // BEFORE the controller: may stop the request
        $user = $request->user();

        if (! $user || ! $user->offices()->where('is_verified', true)->exists()) {
            return response()->json(['message' => 'Your office is not verified yet.'], 403);
        }

        $response = $next($request);       // run the rest (controller included)

        // AFTER the controller: may change the response
        $response->headers->set('X-Office-Checked', '1');

        return $response;
    }
}`,
        note: "اتجرب: مستخدم من غير مكتب موثّق أخد <code>403</code> برسالتنا، وبعد توثيق المكتب أخد <code>200</code>. وتصنعه بـ <code>php artisan make:middleware EnsureOfficeIsVerified</code>.",
      },
      pitfall: "لازم ترجّع إما <code>$next($request)</code> (أو الريسبونس بتاعها) أو ريسبونس بتاعك. لو نسيت الـ return الريكويست هيوقف بخطأ غريب. ولو عايز توقف الريكويست رجّع ريسبونس مباشرة من غير ما تنادي <code>$next</code>.",
      interview: [
        { q: "إزاي تكتب middleware بيشتغل قبل وبعد الـ controller؟", a: "في الـ <code>handle(Request $request, Closure $next)</code>: الكود قبل <code>$next($request)</code> بيشتغل قبل الـ controller (وممكن أرجّع ريسبونس فورا وأوقف الريكويست)، والكود بعد ما آخد الريسبونس من <code>$next</code> بيشتغل بعده وأقدر أعدّل الـ headers أو الـ body. ولازم أرجّع الريسبونس في الآخر." },
      ],
    },
    {
      title: "Parameters و terminate",
      en: "Middleware parameters and terminate()",
      body: "<p><b>Parameters:</b> بتعدّي قيم للـ middleware بعد <code>:</code> وبفاصلة: <code>role:admin,editor</code>. الـ handle بتستقبلها كـ arguments إضافية بعد <code>$next</code>.</p><p><b>terminate:</b> لو الـ middleware فيه method اسمها <code>terminate($request, $response)</code>، Laravel بينفذها <b>بعد ما الريسبونس اتبعت للمستخدم</b>. مناسبة لشغل مش عايز تأخر بيه الرد (تسجيل إحصائيات).</p>",
      code: {
        lang: "php",
        src: `class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // $roles = ['admin', 'editor']      (before)
        $response = $next($request);
        // (after)
        return $response;
    }

    public function terminate(Request $request, Response $response): void
    {
        // runs after the response was sent to the client
    }
}

Route::get('role-test', fn () => response('ok'))
    ->middleware('role:admin,editor');`,
        note: "اتجرب الترتيب: <code>before > after > terminate</code>. و<code>terminate</code> بتتنفذ بعد ما الريسبونس يتبعت للمتصفح.",
      },
      interview: [
        { q: "إيه الـ <code>terminate</code> في الـ middleware؟", a: "method اختيارية <code>terminate($request, $response)</code> بينفذها Laravel بعد ما الريسبونس اتبعت للمتصفح (على FPM بيتم بعد <code>fastcgi_finish_request</code>). بستخدمها لشغل خفيف مش لازم المستخدم يستناه، زي تسجيل زمن أو إحصائيات. ومينفعش أعتمد عليها لشغل تقيل (ده مكانه الـ queue)." },
      ],
    },
    {
      kicker: "Laravel 11",
      title: "تسجيل الـ middleware في bootstrap/app.php",
      en: "Registering and aliasing middleware",
      body: "<p>في Laravel 11 مفيش <code>app/Http/Kernel.php</code>. كل حاجة في <code>bootstrap/app.php</code> جوه <code>withMiddleware</code>. وفي ثلاث مستويات:</p>",
      points: [
        "<b>Global</b>: بيشتغل على كل ريكويست. <code>$middleware->append(Foo::class)</code> أو <code>prepend</code>.",
        "<b>Group</b>: مجموعة مربوطة بملف الـ routes: <code>web</code> (لـ routes/web.php) و<code>api</code> (لـ routes/api.php). <code>$middleware->appendToGroup('api', Foo::class)</code> أو <code>prependToGroup</code>.",
        "<b>Route</b>: بتحط alias وبتستخدمه على route أو group معين: <code>->middleware('office.verified')</code>.",
      ],
      code: {
        lang: "php",
        title: "bootstrap/app.php",
        src: `->withMiddleware(function (Middleware $middleware) {
    // route middleware: give it a short name
    $middleware->alias([
        'office.verified' => EnsureOfficeIsVerified::class,
        'role' => CheckRole::class,
    ]);

    // every request
    $middleware->append(LogRequestTime::class);

    // every request on routes/api.php
    $middleware->appendToGroup('api', ForceJsonResponse::class);
})

// routes/api.php
Route::middleware(['auth:sanctum', 'office.verified'])->group(function () {
    Route::post('listings', [ListingController::class, 'store']);
});`,
        note: "الـ alias اتجرب فعلا واشتغل. وبتستخدم الـ class اسمه مباشرة برضه من غير alias: <code>->middleware(EnsureOfficeIsVerified::class)</code>.",
      },
      pitfall: "الترتيب مهم: <code>auth:sanctum</code> لازم يجي <b>قبل</b> أي middleware بيستخدم <code>$request->user()</code>. ومتحطش شغل تقيل في global middleware لأنه هيتنفذ حتى على الـ assets والـ health checks.",
      interview: [
        { q: "فين بتسجل middleware في Laravel 11 وإزاي تفرّق بين global و group و route؟", a: "في <code>bootstrap/app.php</code> جوه <code>withMiddleware(function (Middleware $middleware) {...})</code>. الـ global: <code>$middleware->append()</code> على كل الريكويستات. الـ group: <code>appendToGroup('web'|'api', ...)</code> على ريكويستات ملف routes معين. الـ route middleware: بسجل alias بـ <code>$middleware->alias([...])</code> وبستخدمه في <code>->middleware('name')</code> على route أو group محدد." },
      ],
    },
    {
      kicker: "الأحداث",
      title: "Events و Listeners",
      en: "Events and listeners",
      body: "<p>الـ <b>event</b> كلاس بسيط بيشيل بيانات اللي حصل (<code>ListingPublished</code> فيه الإعلان). الـ <b>listener</b> كلاس بـ method <code>handle(EventType $event)</code> بيرد على الـ event. بتعمل dispatch من أي مكان بـ <code>ListingPublished::dispatch($listing)</code> (من trait <code>Dispatchable</code>).</p><p>في Laravel 11 الـ listeners بتتسجل لوحدها: أي كلاس في <code>app/Listeners</code> فيه <code>handle()</code> أو <code>__invoke()</code> بيطلب event في الـ type hint بيتربط بيه (auto-discovery). مفيش <code>EventServiceProvider</code> تعدله.</p>",
      code: {
        lang: "php",
        src: `// php artisan make:event ListingPublished
class ListingPublished
{
    use Dispatchable, SerializesModels;

    public function __construct(public Listing $listing)
    {
    }
}

// php artisan make:listener AuditPublished --event=ListingPublished
class AuditPublished
{
    public function handle(ListingPublished $event): void
    {
        Log::info('Listing published', ['id' => $event->listing->id]);
    }
}

// anywhere
ListingPublished::dispatch($listing);
// or: event(new ListingPublished($listing));`,
        note: "اتجرب: <code>Event::getListeners(ListingPublished::class)</code> رجّعت 2 (الاتنين اتكتشفوا من غير تسجيل)، وعند الـ dispatch الـ listener اتنفذ. لو عايز تقفل الاكتشاف: <code>->withEvents(discover: false)</code> في bootstrap/app.php، وسجّل يدوي بـ <code>Event::listen()</code>.",
      },
      interview: [
        { q: "إزاي بتعمل event وlistener في Laravel 11؟ وفي إيه التسجيل؟", a: "<code>make:event</code> و<code>make:listener --event=...</code>، والـ event كلاس بيحمل البيانات في constructor، والـ listener فيه <code>handle(Event $event)</code>. بعمل dispatch بـ <code>Event::dispatch($data)</code> من trait <code>Dispatchable</code>. من Laravel 11 مفيش تسجيل يدوي لأن الـ listeners بتتكتشف تلقائي من الـ type hint في <code>app/Listeners</code>." },
      ],
    },
    {
      title: "الـ listener المتأجل: ShouldQueue",
      en: "Queued listeners",
      body: "<p>الـ listener العادي بيشتغل جوه الريكويست (synchronous)، فلو بيبعت إيميل المستخدم هيستنى. لو الكلاس <code>implements ShouldQueue</code> Laravel بيحط التنفيذ في الـ queue والـ worker يشغله بعدين. ده نفس الـ listener، بس بإضافة الـ interface:</p>",
      code: {
        lang: "php",
        src: `use Illuminate\\Contracts\\Queue\\ShouldQueue;

class SendPublishedNotice implements ShouldQueue
{
    public $afterCommit = true;      // wait for the DB transaction to commit

    public function handle(ListingPublished $event): void
    {
        // runs in a queue worker, not in the HTTP request
        Mail::to($event->listing->office->owner)->send(/* ... */);
    }
}`,
        note: "اتجرب: مع الـ queue بتاع الداتابيز، الـ dispatch بيضيف صف واحد في جدول <code>jobs</code> اسمه <code>App\\Listeners\\SendPublishedNotice</code> ومحدش اتنفذ لسه. ومع <code>sync</code> بيتنفذ فورا. الـ worker هو اللي بينفذ الباقي (المستوى الجاي).",
      },
      pitfall: "الـ event اللي فيه موديل بيتخزن في الـ queue كـ id (<code>SerializesModels</code>) ويتجاب من الداتابيز عند التنفيذ. فلو الإعلان اتمسح قبل ما الـ worker يوصله الـ job هيفشل. ومتمرر object تقيل أو غير قابل للتسلسل (زي connection أو closure).",
      interview: [
        { q: "إيه الفرق بين listener عادي و<code>ShouldQueue</code>؟", a: "العادي بيتنفذ فورا داخل نفس الريكويست، فبيبطّئ الرد ولو فشل بيفشل الريكويست. اللي بينفذ <code>ShouldQueue</code> بيتحط في الـ queue ويتنفذ في worker منفصل، فالرد سريع، وفيه retries وfailed jobs. بحطها للشغل البطيء أو اللي ممكن يفشل (إيميل، إشعار، API خارجي). ومع الـ transactions بستخدم <code>$afterCommit = true</code> عشان الـ job ميتنفذش قبل الـ commit." },
      ],
    },
    {
      title: "Model events و Observers",
      en: "Model events and observers",
      body: "<p>Eloquent بيطلق events على دورة حياة الموديل: <code>creating</code> / <code>created</code>، <code>updating</code> / <code>updated</code>، <code>saving</code> / <code>saved</code>، <code>deleting</code> / <code>deleted</code>، وغيرهم. الـ <b>Observer</b> كلاس بيجمع الـ handlers دي لموديل واحد، وبتربطه بـ attribute <code>#[ObservedBy]</code> على الموديل.</p>",
      code: {
        lang: "php",
        src: `// php artisan make:observer ListingObserver --model=Listing
class ListingObserver
{
    public function creating(Listing $listing): void
    {
        $listing->status ??= 'draft';     // set a default before the INSERT
    }

    public function deleted(Listing $listing): void
    {
        Log::info('Listing deleted', ['id' => $listing->id]);
    }
}

use Illuminate\\Database\\Eloquent\\Attributes\\ObservedBy;

#[ObservedBy([ListingObserver::class])]
class Listing extends Model
{
    // ...
}

// the old way, in AppServiceProvider::boot()
// Listing::observe(ListingObserver::class);`,
        note: "اتجرب: <code>Listing::create()</code> نفّذ <code>creating</code> ثم <code>created</code> والـ status بقت <code>draft</code>، و<code>$listing->update()</code> نفّذ <code>updating</code> ثم <code>updated</code>.",
      },
      points: [
        "الأحداث <code>-ing</code> (creating, updating, deleting) بتحصل <b>قبل</b> الكتابة وممكن توقفها لو رجّعت <code>false</code>.",
        "الأحداث <code>-ed</code> بتحصل <b>بعد</b> الكتابة (والـ transaction لسه ممكن متكونش اتعملها commit).",
      ],
      interview: [
        { q: "إيه الـ observer وإزاي تربطه بموديل؟", a: "كلاس فيه methods بأسماء أحداث الموديل (<code>creating</code>, <code>created</code>, <code>updated</code>, <code>deleted</code>...) بتتنفذ تلقائي مع دورة حياة الـ Eloquent model. بعمله بـ <code>make:observer --model=Listing</code> وبربطه بـ attribute <code>#[ObservedBy([ListingObserver::class])]</code> على الموديل، أو بـ <code>Listing::observe(...)</code> في الـ AppServiceProvider." },
      ],
    },
    {
      title: "إمتى الـ model events مبتشتغلش",
      en: "When model events do NOT fire",
      body: "<p>أخطر نقطة في الـ observers: الأحداث بتتطلق من <b>الموديل</b> (hydrated object)، فأي عملية بتتخطى الموديل وبتروح للداتابيز مباشرة مبتطلقش حاجة. جربنا كل حالة:</p>",
      code: {
        lang: "php",
        src: `$listing->update(['title' => 'a']);            // fires updating, updated
$listing->delete();                              // fires deleted
Listing::destroy($id);                           // fires (loads each model)
Listing::where('id', $id)->get()->each->update([...]);   // fires per model

// these do NOT fire any model event:
Listing::where('city', 'x')->update(['status' => 'archived']);   // mass update
Listing::where('city', 'x')->delete();                           // query delete
Listing::insert([...]);                          // bulk insert
DB::table('listings')->where(...)->update([...]);    // query builder
$listing->saveQuietly();                         // quiet on purpose
Listing::withoutEvents(fn () => /* ... */);      // quiet on purpose`,
        note: "الكل اتجرب والنتيجة زي المكتوب. يعني لو عندك logic في <code>deleted</code> (امسح الصور، حدّث العدّاد) وعملت <code>Listing::where(...)->delete()</code> الـ logic ده مش هيشتغل أبدا.",
      },
      pitfall: "الـ bug ده بيستخبى: كل الاختبارات اللي بتستخدم <code>$model->delete()</code> بتعدي، وفي production كود الـ cleanup اللي بيستخدم <code>where()->delete()</code> بيسيب بيانات يتيمة. لو الـ logic حرج، متعتمدش على الـ observer لوحده.",
      interview: [
        { q: "إمتى الـ model events (observers) مبتشتغلش؟", a: "لما العملية مبتعديش على instance من الموديل: mass update أو delete بالـ query (<code>Model::where(...)->update()</code> / <code>->delete()</code>)، والـ bulk <code>insert</code>/<code>upsert</code>، والـ <code>DB::table()</code> الـ query builder، وبرضه <code>saveQuietly()</code> و<code>withoutEvents()</code>. السبب إن الـ events بتتطلق من الموديل المحمّل، والاستعلامات دي بتروح للداتابيز مباشرة. فالـ logic المهم أحطه في service explicit أو أستخدم <code>each</code> على الموديلات." },
      ],
    },
    {
      title: "event مخفي ولا استدعاء صريح؟",
      en: "Explicit service call vs hidden events",
      body: "<p>الـ events والـ observers بتخلي الكود \"يحصل لوحده\"، وده ميزة وعيب. لما حد يقرا <code>$listing->update(['status' => 'published'])</code> مش هيعرف إن ده بيبعت إيميل ويحدّث الـ cache ويكتب audit. وبيحصل كمان لما بتعمل seeding أو import كبير فكل الأثار بتتنفذ.</p>",
      codes: [
        {
          lang: "php",
          title: "مخفي: observer",
          src: `class ListingObserver
{
    public function updated(Listing $listing): void
    {
        if ($listing->wasChanged('status') && $listing->status === 'published') {
            Mail::to($listing->office->owner)->send(new ListingLive($listing));
            Cache::forget('home.listings');
        }
    }
}`,
        },
        {
          lang: "php",
          title: "صريح: service",
          src: `class PublishListing
{
    public function __invoke(Listing $listing): void
    {
        $listing->update(['status' => 'published']);

        ListingPublished::dispatch($listing);   // one clear place
    }
}

// controller
public function publish(Listing $listing, PublishListing $publish)
{
    $publish($listing);
    return new ListingResource($listing);
}`,
          note: "مين بينادي إيه واضح من الكود. والـ listeners (إيميل، cache) لسه ممكن تفضل events، بس الـ dispatch صريح وفي مكان واحد.",
        },
      ],
      focus: [{ label: "قاعدة عملية", text: "الـ observer مناسب للحاجات الصغيرة الداخلية في الموديل (default value، slug، تنضيف). أي أثر خارجي أو business flow (إيميل، دفع، إشعارات) خليه في service صريح بينادي <code>dispatch</code>." }],
      interview: [
        { q: "إمتى تفضل استدعاء service صريح على event أو observer؟", a: "لما الفعل جزء من business flow مهم (نشر إعلان، دفع) ومحتاج أي مبرمج جديد يشوفه من الكود، ولما محتاج ضمان إنه يحصل أو ما يحصلش في سياق معين (import كبير، seeding، <code>where()->delete()</code> اللي مبتطلقش observers). الـ observers والـ events مناسبين للـ side effects الجانبية أو لما فيه كذا listener مستقل. وبحط الـ dispatch في service واحد بدل ما يستخبى في model hook." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: middleware بقبل وبعد",
      lang: "php",
      code: `<?php
class EnsureOfficeIsVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user?->offices()->where('is_verified', true)->exists()) {
            abort(403, 'Office not verified.');
        }

        $response = $next($request);
        $response->headers->set('X-Checked', '1');

        return $response;
    }
}`,
    },
    {
      title: "اكتب: تسجيل alias وgroup",
      lang: "php",
      code: `<?php
use Illuminate\\Foundation\\Configuration\\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'verified.office' => EnsureOfficeIsVerified::class,
        ]);
        $middleware->appendToGroup('api', ForceJson::class);
    })
    ->create();`,
    },
    {
      title: "اكتب: event وlistener وobserver",
      lang: "php",
      code: `<?php
class ListingPublished
{
    use Dispatchable, SerializesModels;

    public function __construct(public Listing $listing)
    {
    }
}

class AuditPublished implements ShouldQueue
{
    public function handle(ListingPublished $event): void
    {
        Log::info('published', ['id' => $event->listing->id]);
    }
}`,
    },
  ],

  tasks: [
    {
      title: "middleware بباراميتر",
      lang: "php",
      prompt: "<p>اكتب middleware اسمه <code>EnsureCity</code> بياخد اسم مدينة أو أكتر كـ parameters (<code>city:Riyadh,Jeddah</code>). لو الـ query string فيه <code>city</code> مش من القايمة المسموحة، رجّع JSON <code>{\"message\": \"City not supported.\"}</code> بـ 422. لو مفيش <code>city</code> خليه يعدي. وبعد الـ controller ضيف header <code>X-Cities</code> فيه القايمة المسموحة. وسجل alias <code>city</code> واستخدمه على route <code>GET /listings</code>.</p>",
      hints: [
        "<code>handle(Request $request, Closure $next, string ...$cities)</code>.",
        "<code>$request->query('city')</code> و<code>in_array($city, $cities, true)</code>.",
        "الـ header بعد <code>$response = $next($request)</code>: <code>$response->headers->set(...)</code>.",
      ],
      solution: `<?php
class EnsureCity
{
    public function handle(Request $request, Closure $next, string ...$cities): Response
    {
        $city = $request->query('city');

        if ($city !== null && ! in_array($city, $cities, true)) {
            return response()->json(['message' => 'City not supported.'], 422);
        }

        $response = $next($request);
        $response->headers->set('X-Cities', implode(',', $cities));

        return $response;
    }
}

// bootstrap/app.php
$middleware->alias(['city' => EnsureCity::class]);

// routes/api.php
Route::get('listings', [ListingController::class, 'index'])
    ->middleware('city:Riyadh,Jeddah');`,
      explain: "الـ parameters بتوصل كـ variadic بعد <code>$next</code>. الشرط قبل <code>$next</code> بيوقف الريكويست، والـ header بعده بيعدّل الريسبونس. المقارنة بـ <code>in_array(..., true)</code> strict.",
    },
    {
      title: "event وlistener مؤجل",
      lang: "php",
      prompt: "<p>اعمل event <code>InquiryReceived</code> بيشيل <code>Inquiry $inquiry</code>، وlistener <code>NotifyOfficeOwner</code> بينفذ <code>ShouldQueue</code> و<code>$afterCommit = true</code>، و<code>handle</code> بتكتب في اللوج <code>\"New inquiry {id} for listing {listing_id}\"</code>. وبعدين اكتب الكود اللي في الـ controller اللي بيحفظ الـ inquiry جوه <code>DB::transaction</code> وبيعمل dispatch للـ event.</p>",
      hints: [
        "الـ event: trait <code>Dispatchable</code> و<code>SerializesModels</code> وconstructor property promotion.",
        "الـ listener ملوش تسجيل: بيتكتشف تلقائي من الـ type hint.",
        "جوه transaction الـ dispatch + <code>afterCommit</code> بيضمنوا إن الـ job مايبدأش قبل الـ commit.",
      ],
      solution: `<?php
class InquiryReceived
{
    use Dispatchable, SerializesModels;

    public function __construct(public Inquiry $inquiry)
    {
    }
}

class NotifyOfficeOwner implements ShouldQueue
{
    public $afterCommit = true;

    public function handle(InquiryReceived $event): void
    {
        Log::info("New inquiry {$event->inquiry->id} for listing "
            . $event->inquiry->listing_id);
    }
}

// controller
public function store(Request $request, Listing $listing)
{
    $inquiry = DB::transaction(function () use ($request, $listing) {
        $inquiry = $listing->inquiries()->create([
            'user_id' => $request->user()->id,
            'message' => $request->validate(['message' => 'required'])['message'],
        ]);

        InquiryReceived::dispatch($inquiry);

        return $inquiry;
    });

    return response()->json(['id' => $inquiry->id], 201);
}`,
      explain: "الـ listener المؤجل ممكن يتحط في الـ queue قبل ما الـ transaction يعمل commit، فالـ worker لو كان سريع مش هيلاقي الـ inquiry. <code>$afterCommit = true</code> بتأخر الإرسال لحد الـ commit. وLaravel 11 بيكتشف <code>NotifyOfficeOwner</code> تلقائي.",
    },
    {
      title: "observer ولا service؟",
      lang: "php",
      prompt: "<p>الـ observer ده بيمسح الصور لما يتمسح إعلان: <code>deleted(Listing $listing) { $listing->photos()->delete(); }</code>. وفي مكان تاني في الكود فيه <code>Listing::where('office_id', $id)->delete();</code>. اشرح بجملة المشكلة، واكتب دالة <code>deleteOfficeListings(int $officeId): int</code> بتحل المشكلة بحيث الـ observer يشتغل لكل إعلان وترجع عدد الإعلانات اللي اتمسحت (من غير تحميل كلها في الذاكرة مرة واحدة).</p>",
      hints: [
        "<code>where(...)->delete()</code> مبتشغلش الـ observer.",
        "محتاج تلف على الموديلات: <code>chunkById</code> أو <code>lazyById</code>.",
        "جوه كل دفعة: <code>$listing->delete()</code>.",
      ],
      solution: `<?php
// Problem: where()->delete() runs one SQL DELETE and never loads the
// models, so the observer's deleted() (photo cleanup) does not fire.

function deleteOfficeListings(int $officeId): int
{
    $count = 0;

    Listing::where('office_id', $officeId)
        ->chunkById(200, function ($chunk) use (&$count) {
            foreach ($chunk as $listing) {
                $listing->delete();      // fires deleting/deleted
                $count++;
            }
        });

    return $count;
}`,
      explain: "كل <code>$listing->delete()</code> بيعدي على الموديل فبيطلق الأحداث. <code>chunkById</code> بيحمّل 200 كل مرة وآمن مع الحذف. بديل: تحط cascade على الـ foreign key في الداتابيز (<code>cascadeOnDelete()</code>) فالمسح مبيعتمدش على observer أصلا.",
    },
  ],

  quiz: [
    {
      q: "إيه ترتيب التنفيذ للـ middleware ده؟",
      code: { lang: "php", src: `public function handle(Request $request, Closure $next, string ...$roles): Response
{
    Log::info('A');
    $response = $next($request);
    Log::info('B');
    return $response;
}

public function terminate(Request $request, Response $response): void
{
    Log::info('C');
}
// the controller logs 'X'` },
      options: [
        "A, X, B, C",
        "A, B, X, C",
        "X, A, B, C",
        "A, X, C, B",
      ],
      answer: 0,
      why: "A قبل <code>$next</code>، بعدين الـ controller (X)، بعدين B، وبعد ما الريسبونس يتبعت يتنفذ <code>terminate</code> (C). اتجربت: <code>before > after > terminate</code>.",
    },
    {
      q: "كام listener بيتنفذ تلقائي في Laravel 11 من غير أي تسجيل لو في <code>app/Listeners</code> كلاسين <code>handle(ListingPublished $e)</code>؟",
      answer: ["2", "اتنين"],
      why: "الـ auto-discovery بيربط كل listener بالـ event من الـ type hint في <code>handle</code>. اتجرب: <code>Event::getListeners</code> رجّعت 2.",
    },
    {
      q: "أنهي واحدة <b>مش</b> بتطلق الـ <code>updated</code> event بتاع الـ observer؟",
      options: [
        "<code>$listing->update(['price' => 5])</code>",
        "<code>$listing->save()</code> بعد تعديل property",
        "<code>Listing::where('city', 'x')->update(['price' => 5])</code>",
        "<code>Listing::find(1)->update(['price' => 5])</code>",
      ],
      answer: 2,
      why: "الـ mass update بالـ query بيروح لـ SQL مباشرة من غير تحميل موديلات، فمفيش events. الباقي بيعدي على instance موديل.",
    },
    {
      q: "الناتج إيه؟ (فيه observer بيزود عدّاد في <code>deleted</code>)",
      code: { lang: "php", src: `$counter = 0; // incremented in ListingObserver::deleted
Listing::where('office_id', 3)->delete();   // deletes 4 rows
echo $counter;` },
      answer: ["0"],
      why: "<code>where()->delete()</code> استعلام DELETE مباشر من غير تحميل موديلات، فالـ <code>deleted</code> مش بتتنفذ. لو لفّينا على الموديلات وعملنا <code>delete()</code> لكل واحد كان هيبقى 4.",
    },
    {
      q: "عايز middleware يمنع المستخدم لو مكتبه مش موثّق. إيه الصح؟",
      options: [
        "يرمي exception من غير ريسبونس",
        "يرجّع ريسبونس (403) من غير ما ينادي <code>$next</code>",
        "ينادي <code>$next</code> الأول وبعدين يشيك",
        "يعمل <code>exit()</code>",
      ],
      answer: 1,
      why: "إرجاع ريسبونس قبل <code>$next($request)</code> بيوقف الريكويست قبل الـ controller. لو نادى <code>$next</code> الأول، الـ controller هيتنفذ فعلا (وممكن يعدّل بيانات) قبل المنع.",
    },
    {
      q: "فين بتسجل alias للـ middleware في Laravel 11؟",
      options: [
        "<code>app/Http/Kernel.php</code> في <code>$routeMiddleware</code>",
        "<code>config/app.php</code>",
        "<code>bootstrap/app.php</code> جوه <code>withMiddleware</code> بـ <code>$middleware->alias([...])</code>",
        "<code>routes/web.php</code>",
      ],
      answer: 2,
      why: "Laravel 11 شال الـ Kernel وبقت كل الإعدادات في <code>bootstrap/app.php</code>.",
    },
    {
      q: "listener بينفذ <code>ShouldQueue</code> بيتنفذ إمتى؟",
      options: [
        "فورا جوه الريكويست",
        "لما الـ worker يسحب الـ job من الـ queue (مع driver مش sync)",
        "كل دقيقة بالـ scheduler",
        "لما المستخدم يعمل logout",
      ],
      answer: 1,
      why: "الـ dispatch بيحط job في الـ queue (اتجرب: صف في جدول <code>jobs</code>) والـ queue worker هو اللي بينفذه. مع driver <code>sync</code> بيتنفذ فورا.",
    },
    {
      q: "أنهي استخدام للـ observer أنسب؟",
      options: [
        "إرسال إيميل ودفع فلوس عند نشر الإعلان",
        "تعيين قيمة افتراضية (<code>status = 'draft'</code>) قبل الإنشاء في <code>creating</code>",
        "تنفيذ import 50 ألف سجل",
        "تنظيف بيانات عبر <code>where()->delete()</code>",
      ],
      answer: 1,
      why: "الحاجات الصغيرة الداخلية في الموديل مناسبة للـ observer. الإيميل/الدفع business flow الأفضل يكون صريح في service، والـ import والـ query delete مش بيطلقوا events أصلا.",
    },
    {
      q: "ليه حطينا <code>public $afterCommit = true;</code> في الـ queued listener؟",
      options: [
        "عشان يتنفذ أسرع",
        "عشان يتنفذ مرة واحدة بس",
        "عشان يتخطى الـ retries",
        "عشان الـ job ميتنفذش قبل ما الـ transaction بتاعة الـ dispatch تعمل commit",
      ],
      answer: 3,
      why: "لو الـ worker سحب الـ job قبل الـ commit مش هيلاقي السجل الجديد في الداتابيز. <code>afterCommit</code> بتأجل الـ dispatch لحد ما الـ transaction تخلص.",
    },
  ],
};
