window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l10"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "Laravel كله مبني على الـ container، بس اتقال لك \"سحر\"",
      en: "Why dependency injection",
      body: "<p>لما بتكتب <code>public function store(Request $request, ListingService $service)</code> وتشتغل من غير ما تعمل <code>new</code>، مفيش سحر: ده الـ <b>service container</b>. فاهمه يعني تفهم إزاي الـ controllers والـ middleware والـ jobs والـ facades كلها بتتبني، وتكتب كود قابل للاختبار.</p><p>المشكلة اللي بيحلها: كلاس بيعمل <code>new</code> لاعتماديته جواه بيتربط بيها للأبد.</p>",
      codes: [
        {
          lang: "php",
          title: "مربوط: صعب يتختبر",
          src: `class ListingService
{
    public function describe(string $address): string
    {
        $geo = new HttpGeocoder('real-api-key');   // hard-coded
        [$lat, $lng] = $geo->locate($address);     // calls the network
        return "$address @ $lat,$lng";
    }
}`,
        },
        {
          lang: "php",
          title: "محقون (injected): سهل يتبدل",
          src: `class ListingService
{
    public function __construct(private Geocoder $geocoder)
    {
    }

    public function describe(string $address): string
    {
        [$lat, $lng] = $this->geocoder->locate($address);
        return "$address @ $lat,$lng";
    }
}`,
          note: "في الاختبار تحقن <code>FakeGeocoder</code> من غير شبكة، وفي production <code>HttpGeocoder</code>. الكلاس معرفش ولا يهمه.",
        },
      ],
      interview: [
        { q: "إيه هو الـ dependency injection وليه نستخدمه؟", a: "بدل ما الكلاس يعمل <code>new</code> لاعتمادياته جواه، بيستلمها من برا (غالبا في الـ constructor). الفايدة: الكلاس مبقاش مربوط بتنفيذ معين، فأقدر أبدّل التنفيذ (fake في الاختبار، تنفيذ تاني في production)، وبيبان إيه اللي الكلاس محتاجه من الـ constructor، والتغيير في تنفيذ بيتم في مكان واحد. وفي Laravel الـ container هو اللي بيعمل الحقن لوحده." },
      ],
    },
    {
      title: "الـ container وحل الاعتماديات تلقائي",
      en: "The service container and auto-resolution",
      body: "<p>الـ container هو object كبير مهمته: <i>\"اديني كلاس، وأنا أبنيه لك مع كل اللي محتاجه\"</i>. بيقرا الـ type hints في الـ constructor بالـ reflection، ويبني كل اعتماد (وهكذا بشكل متداخل) من غير أي إعداد، طالما الأنواع كلاسات عادية ليها constructor يتبني.</p>",
      code: {
        lang: "php",
        src: `class PriceFormatter
{
    public function sar(int $n): string
    {
        return number_format($n) . ' SAR';
    }
}

class ListingService
{
    public function __construct(
        private HttpGeocoder $geocoder,
        private PriceFormatter $fmt,
    ) {
    }
}

$service = app(ListingService::class);   // builds geocoder + formatter
$same = resolve(ListingService::class);  // same thing, helper name
$again = app()->make(ListingService::class);`,
        note: "الـ container هنا بني <code>HttpGeocoder</code> و<code>PriceFormatter</code> تلقائي وحقنهم. بتعرف الأنواع الأساسية (string, int) من غير default؟ لأ، هيرمي خطأ لأنه مش عارف يديها قيمة (محتاج binding بـ closure).",
      },
      points: [
        "الحقن شغال في: constructors الـ controllers والـ middleware والـ jobs والـ listeners، وفي <b>methods</b> الـ controller (method injection)، وفي <code>app()->call($callable)</code>.",
        "حسب الـ type hint: اكتب <code>Request $request</code> أو <code>ListingService $service</code> في الـ method وهيتحقنوا.",
      ],
      interview: [
        { q: "إزاي Laravel بيعرف يبني الـ controller بكل اعتمادياته من غير ما تعمل <code>new</code>؟", a: "الـ service container بيستخدم الـ reflection: بيقرا الـ type hints في constructor أو method، ولكل نوع بيدور على binding مسجل، وإذا مفيش بيبنيه هو بشكل متداخل (recursively) لو كلاس عادي. ده اسمه automatic resolution (auto-wiring). الأنواع اللي مش كلاسات (primitives) أو الـ interfaces محتاجة binding صريح." },
      ],
    },
    {
      title: "ربط الـ interface بتنفيذ: bind",
      en: "Binding an interface to an implementation",
      body: "<p>الـ container مش عارف يبني interface (مفيهاش كود)، فبيرمي خطأ. بتقوله إنهي تنفيذ يستخدم بـ <code>bind</code>، عادة في <code>AppServiceProvider::register</code>:</p>",
      code: {
        lang: "php",
        title: "app/Providers/AppServiceProvider.php",
        src: `public function register(): void
{
    $this->app->bind(Geocoder::class, HttpGeocoder::class);

    // with a closure when the constructor needs a value
    $this->app->bind(Geocoder::class, function ($app) {
        return new HttpGeocoder(config('services.geo.key'));
    });
}

// before binding:
// BindingResolutionException: Target [Geocoder] is not instantiable
// while building [ListingService].

// in a test: swap it for a fake
$this->app->instance(Geocoder::class, new FakeGeocoder());`,
        note: "اتجرب: قبل الـ bind الخطأ بالنص ده (في تطبيق عادي)، وبعده <code>ListingService</code> اتبنى وشغّال. وفي الاختبار <code>instance</code> بتحط object جاهز مكان التنفيذ الحقيقي.",
      },
      focus: [{ label: "الفكرة", text: "الكود بيطلب <b>الـ interface</b> (<code>Geocoder</code>)، وملف واحد بس (الـ provider) بيقرر التنفيذ. تبدّل المزود (Google مكان Nominatim) من غير ما تلمس أي كلاس تاني." }],
      interview: [
        { q: "إزاي تربط interface بتنفيذ في Laravel وفين؟", a: "في service provider (عادة <code>AppServiceProvider::register</code>) بـ <code>$this->app->bind(Interface::class, Implementation::class)</code>، أو بـ closure لو التنفيذ محتاج قيم من الـ config. بعدها أي كلاس بيطلب الـ interface في الـ constructor بياخد التنفيذ المربوط. وفي الاختبارات بستبدله بـ <code>$this->app->instance(...)</code> أو بـ <code>swap</code>." },
      ],
    },
    {
      title: "bind و singleton و scoped و instance",
      en: "bind vs singleton vs scoped vs instance",
      body: "<p>الأربعة بتختلف في <b>كام مرة</b> الـ container يبني الكلاس. جربنا كل واحد وعدينا كام مرة اتعمل <code>new HttpGeocoder</code> بعد 3 طلبات:</p>",
      code: {
        lang: "php",
        src: `$this->app->bind(Geocoder::class, HttpGeocoder::class);
// resolve 3 times => constructor ran 3 times (new object every time)

$this->app->singleton(Geocoder::class, HttpGeocoder::class);
// resolve 3 times => constructor ran 1 time (same object forever)

$this->app->scoped(Geocoder::class, HttpGeocoder::class);
// same object within one "lifecycle", fresh one after the container
// calls forgetScopedInstances() (new request in Octane, new job)

$this->app->instance(Geocoder::class, new HttpGeocoder('k'));
// you built the object yourself; the container just hands it back`,
        note: "الأرقام اتجربت: <code>bind</code> بنى 3 مرات، و<code>singleton</code> مرة واحدة، و<code>scoped</code> نفس الـ object لحد ما اتعمل reset فبنى واحد جديد.",
      },
      points: [
        "<b>bind</b>: object جديد كل مرة. الافتراضي الآمن للكلاسات اللي فيها state.",
        "<b>singleton</b>: مرة واحدة طول عمر الـ process. للأشياء اللي مبتحملش state خاص بريكويست (كلاينت لـ API بيتبني غالي، مدير اتصال).",
        "<b>scoped</b>: singleton بس بيتصفّر مع بداية كل ريكويست (Octane) أو كل job (queue worker). للـ state الخاص بالريكويست.",
        "<b>instance</b>: بتديه object جاهز بنفسك.",
      ],
      interview: [
        { q: "إيه الفرق بين <code>bind</code> و<code>singleton</code> في الـ container؟", a: "<code>bind</code> بيبني object جديد في كل مرة بتطلب فيها الكلاس. <code>singleton</code> بيبنيه أول مرة بس وبعد كده بيرجع نفس الـ instance طول حياة الـ process. بستخدم singleton للحاجات الغالية في البناء أو اللي المفروض تكون نسخة واحدة (مدير اتصال)، وbind للافتراضي. و<code>scoped</code> زي singleton لكن بيتصفّر مع كل ريكويست/job في بيئات الـ long-running." },
      ],
    },
    {
      title: "Contextual binding",
      en: "Contextual binding",
      body: "<p>أحيانا كلاسين بيطلبوا نفس الـ interface وعايز كل واحد ياخد تنفيذ مختلف. مثلا إعلانات الـ API تستخدم Geocoder حقيقي وكلاس الاستيراد المجمّع يستخدم واحد بيعمل cache. بدل ما تعمل if، بتقول للـ container \"لما تبني X، ادّيه Y\":</p>",
      code: {
        lang: "php",
        src: `$this->app->bind(Geocoder::class, HttpGeocoder::class);

$this->app->when(BulkImporter::class)
    ->needs(Geocoder::class)
    ->give(CachedGeocoder::class);

// primitive values too
$this->app->when(HttpGeocoder::class)
    ->needs('$apiKey')
    ->give(config('services.geo.key'));`,
        note: "اتجرب: كلاس عنده اعتماد على <code>Geocoder</code> اتحقن بالتنفيذ الخاص بيه، وباقي الكلاسات خدت التنفيذ العام. القيمة البدائية بتتحدد باسم الـ parameter مع <code>$</code>.",
      },
      interview: [
        { q: "إمتى تستخدم contextual binding؟", a: "لما كلاسين مختلفين بيعتمدوا على نفس الـ interface أو نفس النوع ومحتاج كل واحد تنفيذ أو قيمة مختلفة. بكتب <code>$this->app->when(A::class)->needs(Interface::class)->give(Impl::class)</code> فمحتاجش شروط جوه الكلاسات. وكمان بيستخدم لتمرير قيمة بسيطة (string/int) لـ parameter باسمه." },
      ],
    },
    {
      kicker: "الـ providers",
      title: "Service Providers: register ثم boot",
      en: "Service providers",
      body: "<p>الـ provider هو المكان الرسمي اللي بتسجل فيه الـ bindings وبتعمل إعداد التطبيق. في Laravel 11 قايمة الـ providers في <code>bootstrap/providers.php</code> (وده اللي <code>make:provider</code> بيضيف فيه). كل provider له method من اتنين:</p>",
      points: [
        "<code>register()</code>: <b>بس</b> تسجّل bindings في الـ container (<code>bind</code> و<code>singleton</code>). متستخدمش فيها خدمات تانية: ممكن لسه متسجلتش.",
        "<code>boot()</code>: بتتنفذ <b>بعد</b> ما كل الـ providers اتعملهم register. هنا بتستخدم الخدمات: routes، view composers، <code>Gate::before</code>، <code>Model::preventLazyLoading</code>، rate limiters.",
      ],
      code: {
        lang: "php",
        src: `class ProviderA extends ServiceProvider
{
    public function register(): void
    {
        // is B's binding there yet? no, B has not been registered
        var_dump($this->app->bound('b.service'));   // false
    }

    public function boot(): void
    {
        var_dump($this->app->bound('b.service'));   // true
    }
}

class ProviderB extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton('b.service', fn () => new stdClass());
    }
}
// order of calls: A register, B register, A boot, B boot`,
        note: "اتجرب بالترتيب ده بالظبط. لو استخدمت في <code>register</code> binding بتاع provider جاي بعدك هتلاقيه مش موجود، وده سبب باگ بيظهر لما ترتيب الـ providers يتغير.",
      },
      interview: [
        { q: "إيه الفرق بين <code>register</code> و<code>boot</code> في الـ service provider؟ وليه الترتيب مهم؟", a: "<code>register</code> بنسجل فيها bindings في الـ container بس، ولازم متعتمدش على أي خدمة تانية لأن باقي الـ providers ممكن لسه ماتسجلوش. <code>boot</code> بتتنفذ بعد ما كل الـ providers اتعملهم register، فآمن أستخدم فيها أي خدمة (routes، events، gates). الفصل ده بيخلي ترتيب الـ providers مايكسرش الـ bindings." },
      ],
    },
    {
      title: "الـ Facades: static proxy مش static فعلا",
      en: "Facades",
      body: "<p><code>Cache::get('k')</code> تبان static لكن مش كده. الـ facade كلاس صغير عنده method واحدة مهمة <code>getFacadeAccessor()</code> بترجّع اسم الـ binding في الـ container. وعند أي call static، الـ facade بيعمل resolve للـ object الحقيقي من الـ container ويبعتله الـ call. يعني <code>Cache::get()</code> = <code>app('cache')->get()</code>.</p>",
      code: {
        lang: "php",
        src: `use Illuminate\\Support\\Facades\\Facade;

class GeoFacade extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return Geocoder::class;       // the container key
    }
}

GeoFacade::locate('Olaya');           // = app(Geocoder::class)->locate('Olaya')

GeoFacade::swap(new FakeGeocoder());  // replace the object behind it
GeoFacade::getFacadeRoot();           // FakeGeocoder instance

// the real ones
Cache::getFacadeRoot();   // Illuminate\\Cache\\CacheManager
DB::getFacadeRoot();      // Illuminate\\Database\\DatabaseManager`,
        note: "كله اتجرب. وعشان كده الـ facades قابلة للاختبار: <code>Cache::shouldReceive('get')</code> أو <code>swap</code> بيبدّلوا الـ object اللي ورا الـ facade.",
      },
      pitfall: "الـ facade مش سحر ولا global state: هي بوابة لنفس الـ container. المشكلة فيها إنها بتخفي اعتماديات الكلاس (مفيش constructor يقولك الكلاس ده محتاج Cache)، فسهل تعمل كلاس بيعتمد على 8 facades من غير ما تحس.",
      interview: [
        { q: "إيه هو الـ facade في Laravel وإزاي بيشتغل؟", a: "كلاس static واجهة للـ container. بيحدد اسم الـ binding في <code>getFacadeAccessor()</code>، وعند أي static call (<code>__callStatic</code>) بيعمل resolve للـ instance من الـ container ويمرر الـ call له. فمفيش static فعلي: <code>Cache::get()</code> هو <code>app('cache')->get()</code>. فايدته اختصار الكتابة، وبيتختبر بسهولة بـ <code>shouldReceive</code> و<code>swap</code>." },
      ],
    },
    {
      title: "Helper أم facade أم injection؟",
      en: "Helpers vs facades vs injection",
      body: "<p>نفس الخدمة ممكن توصلها بتلات طرق. مفيش واحدة \"صح\" دايما:</p>",
      code: {
        lang: "php",
        src: `use Illuminate\\Support\\Facades\\Cache;
use Illuminate\\Contracts\\Cache\\Repository;

// 1. facade: shortest, hides the dependency
Cache::put('k', 'v', 60);

// 2. helper: global function (cache(), app(), config(), auth())
cache()->put('k', 'v', 60);

// 3. injection: dependency visible in the constructor
class ListingStats
{
    public function __construct(private Repository $cache)
    {
    }
}`,
        note: "اتجرب إن <code>cache()</code> والـ <code>Cache</code> facade و<code>app('cache')</code> بيرجعوا نفس الـ object. الثلاثة نفس الـ container في الآخر.",
      },
      points: [
        "في الـ controllers والـ routes والـ closures: الـ facades والـ helpers مريحة ومقبولة.",
        "في كلاس الـ business logic (services): الأفضل الحقن في الـ constructor، لأن الاعتماديات واضحة والاختبار أسهل.",
        "<code>app()</code> و<code>resolve()</code> (service locator) استخدمهم بس لما الحقن مش متاح (مثلا داخل helper أو command قديم)، لأنهم بيخبوا الاعتماد.",
      ],
      interview: [
        { q: "بتفضل facade ولا injection؟ وليه؟", a: "الاتنين بيوصلوا لنفس الـ container. في الـ controllers والكود السريع الـ facade مريحة. في كلاسات الـ domain/services بفضل الحقن في الـ constructor لأنه بيظهر الاعتماديات صراحة ويسهّل الاختبار بحقن fake. والـ facades برضه تتختبر (<code>shouldReceive</code>/<code>swap</code>)، فالقرار مش عن القدرة، عن وضوح الكود." },
      ],
    },
    {
      title: "خطر الـ singleton: state بيتسرّب",
      en: "Singleton dangers in long-running processes",
      body: "<p>في PHP-FPM العادية كل ريكويست process جديد والـ container بيتبني من الصفر، فالـ singleton عمره ريكويست واحد. لكن في <b>queue workers</b> و<b>Octane</b> الـ process بيفضل شغال ويخدم آلاف الطلبات/الـ jobs بنفس الـ container. أي singleton فيه state بيفضل مخزّن للريكويست/job اللي بعده!</p>",
      code: {
        lang: "php",
        src: `class CurrentOffice
{
    public ?int $id = null;
}

$this->app->singleton(CurrentOffice::class);

// request / job 1
app(CurrentOffice::class)->id = 7;

// request / job 2, same process
app(CurrentOffice::class)->id;      // 7  <- leaked from before!

// fix: scoped is reset between requests (Octane) and jobs
$this->app->scoped(CurrentOffice::class);
app(CurrentOffice::class)->id = 7;
app()->forgetScopedInstances();     // done by the worker per job
app(CurrentOffice::class)->id;      // null`,
        note: "اتجرب: مع singleton الريكويست التاني شاف <code>7</code>، ومع scoped بعد الـ reset طلع <code>null</code>. الـ queue worker في Laravel بيستدعي <code>forgetScopedInstances()</code> بين الـ jobs.",
      },
      pitfall: "مفيش خطر لو الـ singleton من غير state خاص بالمستخدم أو الريكويست (مدير اتصال، config). الخطر لما تخزن فيه \"المستخدم الحالي\" أو \"المكتب الحالي\" أو cache جوه property. ومتخزنش الـ <code>Request</code> أو المستخدم في property لـ singleton. اقراه وقت الحاجة.",
      interview: [
        { q: "إمتى الـ singleton يبقى خطر؟ وإيه البديل؟", a: "في العمليات الطويلة (queue workers، Octane) لأن الـ container والـ singletons بيعيشوا بين الطلبات، فأي state جوه singleton (مستخدم حالي، بيانات ريكويست، نتائج متراكمة) بيتسرّب للريكويست أو job اللي بعده. الحل إما نتجنب الـ state في الـ singleton، أو نستخدم <code>scoped</code> اللي بيتصفّر مع كل ريكويست/job، أو نمرر البيانات كـ parameters بدل ما نخزنها." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: interface وتنفيذ وحقن",
      lang: "php",
      code: `<?php
interface Geocoder
{
    public function locate(string $address): array;
}

class FakeGeocoder implements Geocoder
{
    public function locate(string $address): array
    {
        return [24.7, 46.7];
    }
}

class ListingService
{
    public function __construct(private Geocoder $geocoder)
    {
    }
}`,
    },
    {
      title: "اكتب: provider بـ bind و singleton",
      lang: "php",
      code: `<?php
namespace App\\Providers;

use Illuminate\\Support\\ServiceProvider;

class GeoServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(Geocoder::class, HttpGeocoder::class);
        $this->app->singleton(PriceFormatter::class);
    }
}`,
    },
    {
      title: "اكتب: facade وcontextual binding",
      lang: "php",
      code: `<?php
class GeoFacade extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return Geocoder::class;
    }
}

$this->app->when(BulkImporter::class)
    ->needs(Geocoder::class)
    ->give(CachedGeocoder::class);`,
    },
  ],

  tasks: [
    {
      title: "اربط interface واختبرها بـ fake",
      lang: "php",
      prompt: "<p>عندك <code>interface SmsGateway { public function send(string $to, string $text): bool; }</code> وكلاس <code>TwilioSmsGateway</code> بياخد <code>string $sid</code> في الـ constructor. اكتب: (1) provider <code>register()</code> يربط <code>SmsGateway</code> بـ <code>TwilioSmsGateway</code> بـ closure بتقرا <code>config('services.twilio.sid')</code>، ويكون <b>singleton</b>. (2) كلاس <code>FakeSmsGateway</code> بيخزن الرسايل في array public <code>$sent</code> ويرجع true. (3) سطر الاختبار اللي يبدّل الحقيقي بالـ fake.</p>",
      hints: [
        "<code>$this->app->singleton(SmsGateway::class, function ($app) { return new TwilioSmsGateway(...); })</code>.",
        "الـ fake: <code>public array $sent = [];</code> و<code>$this->sent[] = [$to, $text]; return true;</code>.",
        "في الاختبار: <code>$this->app->instance(SmsGateway::class, $fake)</code>.",
      ],
      solution: `<?php
// AppServiceProvider::register()
$this->app->singleton(SmsGateway::class, function ($app) {
    return new TwilioSmsGateway(config('services.twilio.sid'));
});

class FakeSmsGateway implements SmsGateway
{
    public array $sent = [];

    public function send(string $to, string $text): bool
    {
        $this->sent[] = [$to, $text];
        return true;
    }
}

// inside a test
$fake = new FakeSmsGateway();
$this->app->instance(SmsGateway::class, $fake);
// ... act ...
// $this->assertCount(1, $fake->sent);`,
      explain: "الكود بيطلب <code>SmsGateway</code> بس، والـ container بيدّيه الحقيقي في production والـ fake في الاختبار. الـ closure ضرورية لأن الـ constructor بياخد string مش كلاس يتبني تلقائي. و<code>instance</code> بتحط نفس الـ object للجميع.",
    },
    {
      title: "تنفيذ مختلف لكل كلاس",
      lang: "php",
      prompt: "<p>عندك <code>interface Storage { public function put(string $path): string; }</code> وتنفيذين <code>LocalStorage</code> و<code>S3Storage</code>. الـ <code>PhotoUploader</code> محتاج <code>S3Storage</code>، و<code>InvoiceExporter</code> محتاج <code>LocalStorage</code>، وأي كلاس تاني ياخد <code>LocalStorage</code> افتراضي. اكتب الـ bindings اللازمة في <code>register()</code>.</p>",
      hints: [
        "ابدأ بالـ bind العام: <code>Storage::class</code> إلى <code>LocalStorage::class</code>.",
        "بعدين <code>$this->app->when(PhotoUploader::class)->needs(Storage::class)->give(S3Storage::class)</code>.",
        "<code>InvoiceExporter</code> محتاجش حاجة: هيخد الافتراضي.",
      ],
      solution: `<?php
public function register(): void
{
    $this->app->bind(Storage::class, LocalStorage::class);

    $this->app->when(PhotoUploader::class)
        ->needs(Storage::class)
        ->give(S3Storage::class);
}`,
      explain: "الـ binding العام هو الافتراضي، وكل <code>when(...)->needs(...)->give(...)</code> بيعمل استثناء لكلاس واحد. <code>InvoiceExporter</code> مش محتاج سطر لأن الافتراضي بيناسبه. أبسط من <code>if</code> جوه الكلاسات.",
    },
    {
      title: "صلّح تسرّب الـ state",
      lang: "php",
      prompt: "<p>الكلاس ده متسجل <code>singleton</code> وبيستخدم في middleware بيحدد المكتب الحالي. تحت Octane (أو queue worker) بيسرّب المكتب بين الطلبات. عدّل التسجيل (سطر واحد) وبعدين اشرح بجملة ليه ده بيحل المشكلة. وعدّل الكلاس كمان بحيث يقدر يتصفّر لو حد قرأه قبل ما يتحدد (<code>current()</code> ترمي <code>LogicException</code> لو مفيش مكتب).</p>",
      starter: `<?php
class CurrentOffice
{
    public ?int $id = null;
}

// AppServiceProvider::register()
$this->app->singleton(CurrentOffice::class);`,
      hints: [
        "<code>scoped</code> بدل <code>singleton</code>.",
        "خلي الـ property private وادي methods <code>set(int $id)</code> و<code>current(): int</code>.",
      ],
      solution: `<?php
class CurrentOffice
{
    private ?int $id = null;

    public function set(int $id): void
    {
        $this->id = $id;
    }

    public function current(): int
    {
        if ($this->id === null) {
            throw new LogicException('No office selected for this request.');
        }

        return $this->id;
    }
}

// AppServiceProvider::register()
$this->app->scoped(CurrentOffice::class);`,
      explain: "<code>scoped</code> بيدّي نفس الـ instance جوه الريكويست/job الواحد (فالـ middleware والـ controller بيشاركوه) لكن الـ container بيمسحه بين الطلبات (Octane) والـ jobs (queue worker)، فمفيش تسرّب. التغليف بـ <code>set/current</code> بيخلي القراءة قبل التحديد خطأ واضح بدل null صامت.",
    },
  ],

  quiz: [
    {
      q: "عدّد كام مرة بيتنفذ constructor الـ <code>HttpGeocoder</code>؟",
      code: { lang: "php", src: `app()->singleton(Geocoder::class, HttpGeocoder::class);
app(Geocoder::class);
app(Geocoder::class);
app(Geocoder::class);` },
      answer: ["1", "مرة واحدة"],
      why: "الـ singleton بيبني الـ instance أول مرة بس وبعد كده بيرجع نفسه. مع <code>bind</code> كانت هتبقى 3 مرات.",
    },
    {
      q: "الكلاس ده بيطلب interface غير مربوطة. إيه اللي بيحصل؟",
      code: { lang: "php", src: `class ListingService
{
    public function __construct(private Geocoder $geocoder) {}
}

app(ListingService::class);` },
      options: [
        "بيشتغل بـ null",
        "بيبني أول كلاس بيلاقيه بينفذ Geocoder",
        "بيرمي BindingResolutionException: Target [Geocoder] is not instantiable",
        "بيرمي TypeError من PHP",
      ],
      answer: 2,
      why: "الـ container مبيخمنش التنفيذ. الـ interface مش ينفع تتبني، فبيرمي <code>BindingResolutionException</code> وبيقولك إنت محتاج <code>bind</code>.",
    },
    {
      q: "أنهي سطر من دول مكانه <code>boot()</code> مش <code>register()</code>؟",
      options: [
        "<code>$this->app->singleton(Geocoder::class, HttpGeocoder::class)</code>",
        "<code>$this->app->bind(PriceFormatter::class)</code>",
        "<code>$this->app->when(A::class)->needs(B::class)->give(C::class)</code>",
        "<code>Gate::before(fn (User $u) => $u->is_admin ? true : null)</code>",
      ],
      answer: 3,
      why: "الـ bindings بتتسجل في <code>register</code>. <code>Gate::before</code> بتستخدم خدمة (الـ Gate) وغيرها من الـ providers، فمكانها <code>boot</code> بعد ما كل الـ providers اتسجلوا.",
    },
    {
      q: "إيه اللي بيحصل تحت الغطا في <code>Cache::get('k')</code>؟",
      options: [
        "method static فعلية في كلاس Cache",
        "الـ facade بيعمل resolve للـ binding من <code>getFacadeAccessor()</code> وبينادي <code>get</code> عليه",
        "بيعمل <code>new Cache()</code> كل مرة",
        "بيقرا global variable",
      ],
      answer: 1,
      why: "الـ facade بيستخدم <code>__callStatic</code>: بيجيب الـ instance الحقيقي (<code>CacheManager</code>) من الـ container ويمرر الـ call. مفيش static فعلية ولا global.",
    },
    {
      q: "الناتج إيه؟ (<code>CurrentOffice</code> فيه property <code>id</code> افتراضي null)",
      code: { lang: "php", src: `app()->scoped(CurrentOffice::class);
app(CurrentOffice::class)->id = 7;
app()->forgetScopedInstances();
var_dump(app(CurrentOffice::class)->id);` },
      answer: ["NULL", "null"],
      why: "<code>forgetScopedInstances()</code> بتمسح الـ instance، فالطلب بعده بيبني واحد جديد وـ id فيه null. ده اللي بيعمله الـ queue worker بين jobs. مع singleton كانت هتطبع <code>int(7)</code>.",
    },
    {
      q: "عايز كلاس واحد بس ياخد تنفيذ مختلف من الـ interface. إيه الأنسب؟",
      options: [
        "تعمل <code>if</code> جوه الكلاس تقرا نوعه",
        "<code>when(ThatClass::class)->needs(Interface::class)->give(Other::class)</code>",
        "تغيّر الـ bind العام",
        "تعمل facade جديدة",
      ],
      answer: 1,
      why: "ده بالظبط الـ contextual binding. تغيير الـ bind العام هيأثر على كل الكلاسات، والـ <code>if</code> بيخلط المسؤوليات.",
    },
    {
      q: "ليه الـ singleton اللي فيه \"المستخدم الحالي\" خطر تحت Octane أو queue worker؟",
      options: [
        "لأنه أبطأ",
        "لأن الـ process بيعيش بين الطلبات، فالـ state بيتسرّب للطلب/job اللي بعده",
        "لأن PHP مبتدعمش singleton",
        "لأنه بيعمل memory leak دايما",
      ],
      answer: 1,
      why: "في FPM كل ريكويست process جديد، لكن في العمليات الطويلة الـ container ثابت. الـ state جوه singleton بيفضل. الحل scoped أو مفيش state.",
    },
    {
      q: "أنهي سطر في الاختبار بيبدّل <code>Geocoder</code> بنسخة fake؟",
      options: [
        "<code>$this->app->bind(Geocoder::class, new FakeGeocoder())</code> بعد ما الكود اشتغل",
        "<code>$this->app->forgetInstance(Geocoder::class)</code>",
        "<code>$this->app->instance(Geocoder::class, new FakeGeocoder())</code>",
        "<code>new FakeGeocoder()</code> بس",
      ],
      answer: 2,
      why: "<code>instance</code> بتحط الـ object الجاهز مكان الـ binding، وأي كلاس بيطلب <code>Geocoder</code> هياخده. <code>new</code> لوحدها مبتأثرش على الـ container، و<code>forgetInstance</code> بتمسح بس.",
    },
    {
      q: "في الـ <code>register()</code> بتاعة provider A كتبت <code>$this->app->make('b.service')</code> و<code>b.service</code> متسجل في provider B. إيه المشكلة؟",
      options: [
        "ممكن يفشل لو B بيتسجل بعد A، لأن الـ <code>register</code> بتتنفذ provider ورا التاني بترتيب القايمة، والـ <code>boot</code> بس بتبدأ بعد ما كلهم يخلصوا",
        "مفيش مشكلة أبدا",
        "الـ make مبتشتغلش في register",
        "لازم تستخدم facade",
      ],
      answer: 0,
      why: "اتجرب: A شاف <code>bound('b.service')</code> بـ false في register وtrue في boot. استخدام خدمة من provider تاني في register بيعتمد على الترتيب. استخدمها في boot.",
    },
  ],
};
