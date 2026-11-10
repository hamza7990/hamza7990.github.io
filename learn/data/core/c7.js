window.LEVELS = window.LEVELS || {};
window.LEVELS["core/c7"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "إزاي تجاوب سؤال تصميم: خمس خطوات بالترتيب",
      en: "How to run a design answer",
      body: "<p>في إنترفيو junior/mid سؤال التصميم («صمم الـ backend لتطبيق عقارات») مش بيقيس إنك تعرف Kafka. بيقيس إنك <b>بتفكر بترتيب</b>، وبتسأل قبل ما تبني، وتعرف إن كل قرار له تمن. الإجابة اللي بتبدأ بـ «هستخدم microservices وRedis» من أول ثانية بتخسر.</p>",
      points: [
        "<b>1. المتطلبات (requirements)</b>: اسأل: مين المستخدمين؟ إيه أهم 3 ميزات؟ iOS وAndroid ولا ويب كمان؟ لازم realtime؟ قصة الدفع؟ ده بيحدد النطاق.",
        "<b>2. الأرقام (back-of-envelope)</b>: كام مستخدم؟ كام طلب في الثانية وقت الذروة؟ حجم الصور؟ قراءة أكتر ولا كتابة؟ لازم تعرف الحجم تقريبا قبل ما تقرر.",
        "<b>3. الـ API</b>: أهم endpoints، شكل الـ response، الـ auth والـ pagination.",
        "<b>4. الـ data model</b>: الجداول والعلاقات والـ indexes اللي الاستعلامات الرئيسية محتاجاها.",
        "<b>5. الـ bottlenecks</b>: إيه اللي هيقع أول لما الحمل يزيد؟ وبعدين الحل الأرخص أولا (index، cache، queue)، مش الأعقد.",
      ],
      code: {
        lang: "text",
        title: "مثال حساب سريع (أرقام افتراضية للتمرين)",
        src: `assume 50,000 monthly users, 20 API calls per user per day
50,000 x 20 = 1,000,000 requests / day
1,000,000 / 86,400 s = about 12 requests / second on average
peak is often 5x to 10x the average = about 60 to 120 req/s

conclusion: this is small. One decent server plus one database
can handle it. Measure first, then add pieces when numbers say so.`,
        note: "الأرقام دي افتراضات تقولها بصوت عالي وتخلي المحاور يصححها. الهدف تبين إنك بتحسب، مش تحفظ أرقام.",
      },
      pitfall: "إنك تقفز للحل المعقد. «أبدأ بسيرفر واحد وقاعدة بيانات واحدة وأقولك إمتى وليه هنكبّر» إجابة أقوى بكتير من رسمة فيها عشرة صناديق.",
      interview: [
        { q: "قالوا لك «صمم نظام X». تبدأ إزاي؟", a: "مبدأش بالتصميم. بسأل عن المتطلبات الأساسية والمستخدمين وأهم الميزات، وبعدين أقدّر الأرقام (مستخدمين، طلبات في الثانية، حجم الداتا) بافتراضات أقولها بصوت عالي. بعد كده API وdata model، وفي الآخر بدور على الـ bottlenecks وأقول إيه اللي هيتغير لما الحمل يكبر. بدأ بأبسط معمارية تفي بالأرقام وأكبّرها خطوة خطوة." },
      ],
    },
    {
      title: "الصورة الأساسية: client وserver وdatabase",
      en: "Client, server, database",
      body: "<p>أي تطبيق موبايل بيمشي على نفس المسار: الـ <b>client</b> (تطبيق Flutter) بيبعت طلب HTTP للـ <b>server</b> (Laravel API)، والـ server بيتكلم مع الـ <b>database</b> ويرجع JSON. باقي التصميم هو إضافات على المسار ده لما بنحتاجها.</p>",
      code: {
        lang: "text",
        title: "من واحد سيرفر لنظام أكبر",
        src: `v1 (start here)
  Flutter app --> HTTPS --> API server (Laravel) --> MySQL

v2 (when numbers ask for it)
  Flutter app --> CDN (images)
              --> Load balancer --> API server 1 --\\
                                --> API server 2 ----> MySQL primary
                                                 \\--> Redis (cache, queue)
                                    MySQL replica <-- (reads)
  Queue workers (same code) --> push, emails, image resizing
  Object storage (S3-style) <-- images`,
        note: "الـ v1 كافي لأغلب التطبيقات في أول سنة. بتنتقل لـ v2 حتة حتة، مش مرة واحدة.",
      },
      terms: [
        ["stateless", "من غير حالة", "السيرفر مبيحتفظش بحاجة خاصة بمستخدم في الميموري بين الطلبات، فأي سيرفر يرد على أي طلب."],
        ["bottleneck", "عنق الزجاجة", "الجزء الأبطأ اللي بيحدد سرعة النظام كله."],
      ],
    },
    {
      title: "التكبير: vertical وhorizontal، والـ load balancer، وفين الـ sessions",
      en: "Scaling, load balancer, stateless servers",
      body: "<p><b>Vertical scaling</b>: سيرفر أقوى (CPU وRAM أكتر). أسهل وأسرع، له سقف وتمنه بيزيد، ولو وقع كله وقع. <b>Horizontal scaling</b>: سيرفرات أكتر ورا <b>load balancer</b> بيوزع الطلبات. بيتحمل أكتر ولو سيرفر وقع الباقي بيكمل، لكن بيحتاج إن السيرفرات <b>stateless</b>.</p><p>المشكلة الكلاسيكية: لو الـ session متخزنة في ميموري السيرفر 1، والطلب التاني وصل السيرفر 2، المستخدم «اتلوج أوت». الحلول:</p>",
      points: [
        "<b>Token (Sanctum/JWT)</b> بيرجع للـ client ويتبعت مع كل طلب. السيرفر بيتحقق منه من الـ database أو من توقيعه، ومفيش حالة في ميموري السيرفر. ده الشائع في الـ APIs للموبايل.",
        "<b>Session store مشترك</b> (Redis أو database): كل السيرفرات بتقرا نفس المكان. مناسب لتطبيقات الويب.",
        "<b>Sticky sessions</b>: الـ load balancer يبعت نفس المستخدم لنفس السيرفر. بيشتغل لكن بيضيع فايدة التوزيع، وملجأ أخير.",
      ],
      focus: [{ label: "احفظها", text: "قبل ما تضيف سيرفر تاني اسأل: هل السيرفر stateless؟ الملفات المرفوعة والـ sessions والـ cache لازم تبقى برا السيرفر (storage مشترك، Redis، database)." }],
      interview: [
        { q: "إيه الفرق بين vertical وhorizontal scaling؟ وإيه اللي لازم يتظبط قبل الـ horizontal؟", a: "الـ vertical إني أقوّي السيرفر نفسه: بسيط لكن له سقف ونقطة فشل واحدة. الـ horizontal إني أضيف سيرفرات ورا load balancer: بيتحمل أكتر ومرن، لكن لازم التطبيق يبقى stateless. يعني الـ sessions في Redis أو tokens، والملفات المرفوعة في object storage بدل disk السيرفر، والـ cache مشترك. وعادة بدأ بـ vertical لأنه أرخص في الجهد وبنتقل لـ horizontal لما الأرقام تطلب." },
      ],
    },
    {
      title: "الـ database: indexes وreplicas وpagination",
      en: "Indexes, read replicas, pagination",
      body: "<p>غالبا الـ database هي أول bottleneck. أرخص حل: <b>index صح</b> للاستعلامات الرئيسية. في الـ composite index رتب الأعمدة: <b>المساواة (=) الأول وبعدين الـ range</b>، لأن الـ B-tree بتستفيد من range واحد بس.</p>",
      code: {
        lang: "sql",
        src: `CREATE TABLE listings (
  id INTEGER PRIMARY KEY,
  status VARCHAR(12) NOT NULL,
  city VARCHAR(60) NOT NULL,
  type VARCHAR(10) NOT NULL,
  price DECIMAL(12,2) NOT NULL
);

CREATE INDEX idx_listings_search
  ON listings (status, city, type, price);

-- equality first (status, city, type), range last (price)
SELECT id, price FROM listings
WHERE status = 'active' AND city = 'Riyadh' AND type = 'sale'
  AND price BETWEEN 500000 AND 1500000
ORDER BY price
LIMIT 20;`,
        note: "اتجرب في SQLite: <code>EXPLAIN QUERY PLAN</code> بيقول <code>SEARCH listings USING COVERING INDEX idx_listings_search (status=? AND city=? AND type=? AND price&gt;? AND price&lt;?)</code>. في MySQL استخدم <code>EXPLAIN</code> وانتبه لـ <code>key</code> و<code>rows</code>. الـ types تختلف بين المحركات (<code>id</code> في MySQL عادة <code>BIGINT UNSIGNED AUTO_INCREMENT</code>).",
      },
      points: [
        "<b>Read replica</b>: نسخة من الـ database بتستقبل القراءة بس. بتخفف الحمل عن الـ primary، لكن فيه <b>replication lag</b>: ممكن تكتب وبعدها تقرا من replica ملحقتش، فمتشوفش اللي كتبته. اقرا من الـ primary بعد الكتابة المباشرة.",
        "<b>Pagination</b>: <code>OFFSET 100000</code> بتبطأ لأنها بتعدي على كل الصفوف. <b>cursor/keyset pagination</b> (<code>WHERE id &lt; :last_id ORDER BY id DESC LIMIT 20</code>) ثابتة السرعة. أنسب لشاشات التمرير اللانهائي.",
        "الـ index بيسرّع القراءة ويبطّأ الكتابة ويحتل مساحة. متعملش index لكل عمود.",
      ],
      interview: [
        { q: "الاستعلام بطيء، إيه خطواتك؟", a: "أشغّل <code>EXPLAIN</code> على الاستعلام وأشوف هل بيعمل full scan، وأتأكد إن فيه index مناسب بترتيب أعمدة صح (المساواة قبل الـ range). وأشوف هل بيجيب أعمدة وصفوف أكتر من اللازم، وهل فيه N+1 queries في الكود. لو لسه بطيء أفكر في cache أو replica. وأتجنب تعدّد الحلول قبل ما أقيس." },
      ],
    },
    {
      title: "الـ caching: في أي طبقة، وإزاي تبطل القديم",
      en: "Caching layers and invalidation",
      body: "<p>الـ cache بيخزن نتيجة غالية عشان تتجاب بسرعة. بيبقى في أكتر من طبقة، من الأقرب للمستخدم:</p>",
      points: [
        "<b>Client cache</b>: التطبيق نفسه بيحفظ آخر قايمة (SQLite أو ملف) وصور بيحملها مرة. بيخلي الشاشة تفتح فورا وتشتغل أوفلاين.",
        "<b>CDN</b>: شبكة سيرفرات قريبة من المستخدم بتخدم الملفات الثابتة (الصور) بدل ما تروح لسيرفرك. بتتحكم فيها بـ header <code>Cache-Control</code>.",
        "<b>Application cache</b> (Redis أو غيره): نتائج استعلامات تقيلة أو بيانات بتتقرا كتير ونادرا بتتغير (قايمة المدن، نتيجة بحث شائع).",
        "<b>Database cache</b> (buffer pool وغيره): بيحصل لوحده، متتحكمش فيه كتير.",
      ],
      code: {
        lang: "php",
        title: "cache-aside + invalidation",
        src: `class Cache
{
    private array $data = [];

    public function get(string $key): mixed
    {
        return $this->data[$key] ?? null;
    }

    public function put(string $key, mixed $value): void
    {
        $this->data[$key] = $value;
    }

    public function forget(string $key): void
    {
        unset($this->data[$key]);
    }
}

$db = ['listing:1' => 900000];
$dbReads = 0;
$cache = new Cache();

function price(int $id, Cache $cache, array $db, int &$dbReads): int
{
    $key = "listing:$id";
    $hit = $cache->get($key);
    if ($hit !== null) {
        return $hit;
    }
    $dbReads++;
    $value = $db[$key];
    $cache->put($key, $value);
    return $value;
}

echo price(1, $cache, $db, $dbReads), PHP_EOL;
echo price(1, $cache, $db, $dbReads), PHP_EOL;
echo "db reads: $dbReads", PHP_EOL;

$db['listing:1'] = 950000;      // the owner edits the price
echo price(1, $cache, $db, $dbReads), PHP_EOL;   // still old!
$cache->forget('listing:1');    // invalidate on write
echo price(1, $cache, $db, $dbReads), PHP_EOL;`,
        note: "الناتج: <code>900000</code> <code>900000</code> <code>db reads: 1</code> <code>900000</code> <code>950000</code>. ثالث قراءة رجعت السعر القديم لحد ما عملنا <code>forget</code>. اتجرب.",
      },
      pitfall: "«في علم الكمبيوتر حاجتين صعبين: cache invalidation وتسمية الحاجات». القاعدة: كل cache لازم يتحدد له طريقة تبطل بيها: <b>TTL</b> (ينتهي بعد وقت)، أو <b>مسح صريح عند الكتابة</b> (زي <code>forget</code>)، أو الاتنين. cache من غير خطة إبطال = داتا قديمة تظهر للمستخدم.",
      interview: [
        { q: "إيه استراتيجية الـ cache invalidation اللي تستخدمها؟", a: "حسب الداتا. للحاجات اللي تقبل تبقى قديمة دقيقة (قايمة بحث شائع) بحط TTL قصير. للحاجات اللي لازم تتحدث فورا (سعر إعلان اتعدل) بمسح المفتاح عند الكتابة، يعني لما أحفظ التعديل أعمل <code>forget</code> للمفتاح. وأتجنب أحط في الـ cache داتا خاصة بمستخدم في مفتاح عام. وممكن أستخدم الاتنين: TTL كشبكة أمان ومسح صريح للسرعة." },
      ],
    },
    {
      title: "الـ queue والـ object storage والـ CDN",
      en: "Queues, object storage, CDN",
      body: "<p><b>Queue</b>: أي شغل بطيء أو مش لازم المستخدم يستناه يتحط في طابور وworker يعمله بعدين: إرسال push وإيميل، تصغير الصور، توليد PDF، تحديث search index. الـ API بترد فورا. بتنقص زمن الرد وبتتحمل الفشل (retry). <b>Object storage</b> (S3 أو شبيهه): مكان للملفات، مش disk السيرفر، فالسيرفرات تفضل stateless.</p><p>رفع الصور الأحسن: الـ client يرفع <b>مباشرة</b> للـ storage بـ <b>presigned URL</b> (رابط مؤقت بصلاحية رفع) بدل ما الصورة تعدي على الـ API server وتاخد عليه الميموري.</p>",
      codes: [
        {
          lang: "json",
          title: "1. الـ client يطلب رابط رفع",
          src: `{
  "upload_url": "https://storage.example.com/listings/12/a1b2.jpg?signature=...",
  "path": "listings/12/a1b2.jpg",
  "expires_in": 600
}`,
          note: "response لـ <code>POST /api/v1/listings/12/images/upload-url</code>. الـ client يرفع الملف على <code>upload_url</code> مباشرة.",
        },
        {
          lang: "json",
          title: "2. يسجل الصورة وبعدها الـ worker يصغّرها",
          src: `{
  "path": "listings/12/a1b2.jpg",
  "position": 1
}`,
          note: "<code>POST /api/v1/listings/12/images</code> بيحفظ صف في <code>listing_images</code> ويرمي job <code>ResizeImage</code> في الـ queue. الـ API بترد 201 فورا والـ thumbnails بتتولد بعدها.",
        },
      ],
      pitfall: "كل job لازم يكون <b>idempotent</b> (تشغيله مرتين مش بيعمل ضرر) لأن الـ queue ممكن تعيد المحاولة. وراقب الـ failed jobs وإلا الإشعارات تضيع من غير ما تعرف.",
      interview: [
        { q: "إيه اللي تحطه في الـ queue ومتحطوش؟ وإيه فايدتها؟", a: "بحط الشغل البطيء أو اللي مش لازم المستخدم يستناه: إشعارات push، إيميلات، معالجة الصور، تقارير. الفايدة: الـ API ترد بسرعة، والفشل بيتعاد (retry) من غير ما المستخدم يحس، وأقدر أزود workers لوحدهم. مبحطش الحاجات اللي النتيجة بتتحدد بيها استجابة الطلب مباشرة، زي التحقق من صلاحية أو حفظ بيانات الطلب نفسه. والـ jobs لازم تبقى idempotent." },
      ],
    },
    {
      title: "حماية وتشغيل: rate limiting وmonitoring وbackups",
      en: "Rate limiting, monitoring, logs, backups",
      body: "<p><b>Rate limiting</b>: تحديد عدد الطلبات لكل مستخدم أو IP في فترة، عشان تحمي من الإساءة وتخلي مستخدم واحد ميوقعش النظام. أبسط شكل «fixed window»: عداد لكل مفتاح لكل نافذة زمنية، وبعد الحد ترجع <code>429 Too Many Requests</code> مع header <code>Retry-After</code>.</p>",
      code: {
        lang: "php",
        src: `class RateLimiter
{
    private array $hits = [];

    public function __construct(private int $max, private int $windowSec)
    {
    }

    public function allow(string $key, int $now): bool
    {
        $window = intdiv($now, $this->windowSec);
        $k = "$key:$window";
        $this->hits[$k] = ($this->hits[$k] ?? 0) + 1;

        return $this->hits[$k] <= $this->max;
    }
}

$limiter = new RateLimiter(3, 60);
foreach ([100, 101, 102, 103] as $t) {
    echo $limiter->allow('user:5', $t) ? 'ok ' : 'blocked ';
}
echo $limiter->allow('user:5', 110) ? 'ok' : 'blocked', PHP_EOL;
echo $limiter->allow('user:5', 190) ? 'ok' : 'blocked', PHP_EOL;`,
        note: "الناتج: <code>ok ok ok blocked blocked</code> ثم <code>ok</code>. الطلب الرابع اتحجب، والتاني بعد 110 لسه في نفس النافذة (60 ثانية) فاتحجب، وبعد 190 نافذة جديدة. عيب الـ fixed window: ممكن تتضرب بحد مضاعف عند حدود النافذتين. في Laravel عندك <code>RateLimiter</code> وـ <code>throttle</code> middleware جاهزين وبيتخزنوا في الـ cache.",
      },
      points: [
        "<b>Logs</b>: سجلات منظمة للأخطاء والطلبات البطيئة، مع request id يربط السطور ببعض. تحتاجها للتحقيق بعد ما يحصل الحادث.",
        "<b>Monitoring وalerts</b>: تتابع نسبة الأخطاء 5xx، زمن الرد، استخدام CPU والميموري والـ disk، وطول الـ queue. تعرف إن فيه مشكلة قبل ما العميل يبلّغك. وendpoint بسيط <code>/health</code> تفحصه من برا.",
        "<b>Backups</b>: نسخة احتياطية دورية من الـ database وملفات الـ storage، <b>ومتجربة</b> إنك ترجعها فعلا. backup عمرك ما جربت تسترجعه مش مضمون. خزنه في مكان غير السيرفر نفسه.",
      ],
    },
    {
      title: "الـ consistency مقابل الـ availability: شريحة واحدة صادقة",
      en: "Consistency vs availability",
      body: "<p>لما النظام يتوزع على أكتر من جهاز، الشبكة بينهم ممكن تنقطع. ساعتها لازم تختار: <b>consistency</b> (كل القراءات تشوف آخر كتابة، حتى لو رفضت ترد وقت الانقطاع)، أو <b>availability</b> (تفضل ترد دايما، حتى لو بداتا قديمة شوية). ده مضمون نظرية الـ CAP، وده مش اختيار «اتنين من تلاتة» عشوائي، ده اختيار بيحصل وقت الانقطاع بس.</p>",
      points: [
        "<b>database واحدة (MySQL primary)</b>: consistency قوية لأن فيه مصدر حقيقة واحد. ده سبب كفاية الحل ده لأغلب التطبيقات.",
        "<b>read replicas وcache</b>: بتدّي <b>eventual consistency</b>: القراءة ممكن تكون قديمة لثواني، ومع الوقت تتطابق.",
        "<b>القرار لكل ميزة</b>: الدفع ورصيد المحفظة وحجز آخر وحدة لازم consistency (اقرا واكتب من الـ primary جوه transaction). عدد المشاهدات وقايمة «إعلانات شائعة» تتحمل داتا قديمة شوية.",
      ],
      focus: [{ label: "جملة تقولها في الإنترفيو", text: "«أنا هبدأ بـ database واحدة وconsistency قوية. وهقبل eventual consistency بس في الأماكن اللي بتتحمل، زي الـ cache وعدادات المشاهدات، ومش في الدفع أو الحجز.»" }],
      interview: [
        { q: "اشرح الفرق بين strong consistency وeventual consistency بمثال.", a: "strong: بعد ما أحفظ سعر جديد لإعلان، أي قراءة بعدها تشوف السعر الجديد (مثال database واحدة أو القراءة من primary). eventual: القراءة من replica أو cache ممكن تفضل تشوف القديم لثواني ثم تتحدث. بقبل الـ eventual في حاجات زي عدد المشاهدات، ومقبلوش في الدفع أو حجز وحدة، لأن الغلط هناك له تمن حقيقي." },
      ],
    },
    {
      kicker: "مثال متكامل 1/3",
      title: "تطبيق عقارات: المتطلبات والأرقام والـ data model",
      en: "Worked example: requirements and data model",
      body: "<p>السؤال: «صمم الـ backend لتطبيق إعلانات عقارية بتطبيق موبايل». نبدأ بالمتطلبات اللي تقولها وتتأكد منها:</p><ul><li>المستخدمين: زوار يتصفحوا ويبحثوا ويحفظوا مفضلة، ومكاتب/وسطاء ينشروا إعلانات، وأدمن يراجع.</li><li>الميزات: تسجيل دخول، قايمة إعلانات مع فلاتر (مدينة، نوع، سعر، غرف)، خريطة، تفاصيل مع صور، مفضلة، إشعارات push، لوحة أدمن للمراجعة.</li><li>القراءة أكتر بكتير من الكتابة (أغلب الناس بتتصفح). الصور هي أكبر حجم.</li><li>الأرقام: افتراض [عدد الإعلانات] إعلان و[عدد المستخدمين] مستخدم شهريا. بإعلانات بعشرات الآلاف وطلبات بعشرات في الثانية، سيرفر واحد يكفي في البداية.</li></ul><p>الـ data model (قلب التصميم):</p>",
      code: {
        lang: "sql",
        src: `CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  role VARCHAR(10) NOT NULL DEFAULT 'client'
);

CREATE TABLE offices (
  id INTEGER PRIMARY KEY,
  name VARCHAR(120) NOT NULL
);

CREATE TABLE listings (
  id INTEGER PRIMARY KEY,
  office_id INTEGER NOT NULL REFERENCES offices (id),
  title VARCHAR(160) NOT NULL,
  type VARCHAR(10) NOT NULL,
  city VARCHAR(60) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  rooms INTEGER,
  lat DECIMAL(9,6) NOT NULL,
  lng DECIMAL(9,6) NOT NULL,
  status VARCHAR(12) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_listings_search
  ON listings (status, city, type, price);
CREATE INDEX idx_listings_geo ON listings (lat, lng);

CREATE TABLE listing_images (
  id INTEGER PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings (id),
  path VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE favorites (
  user_id INTEGER NOT NULL REFERENCES users (id),
  listing_id INTEGER NOT NULL REFERENCES listings (id),
  PRIMARY KEY (user_id, listing_id)
);

CREATE TABLE device_tokens (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id),
  token VARCHAR(255) NOT NULL UNIQUE,
  platform VARCHAR(10) NOT NULL
);`,
        note: "الـ SQL اتجرب في SQLite. في MySQL غيّر الـ <code>id</code> لـ <code>BIGINT UNSIGNED AUTO_INCREMENT</code>. <code>status</code> (pending, active, rejected) هو اللي بيخلي الأدمن يراجع قبل ما الإعلان يظهر. الـ composite primary key في <code>favorites</code> بيمنع التكرار.",
      },
      pitfall: "تخزين الصور نفسها في الـ database أو في disk السيرفر. خزن بس الـ <code>path</code> في الجدول، والملف في object storage.",
    },
    {
      kicker: "مثال متكامل 2/3",
      title: "الـ endpoints والبحث بفلاتر وخريطة",
      en: "Worked example: API, search and map",
      body: "<p>الـ API versioned (<code>/api/v1</code>)، توكن في header <code>Authorization: Bearer</code>، وقايمة الإعلانات بـ cursor pagination. أهم الـ endpoints:</p>",
      codes: [
        {
          lang: "text",
          title: "الـ endpoints الرئيسية",
          src: `POST /api/v1/auth/login                 -> token
GET  /api/v1/listings?city=&type=&min_price=&max_price=&cursor=
GET  /api/v1/listings/map?north=&south=&east=&west=&type=
GET  /api/v1/listings/{id}
POST /api/v1/listings                   (office, status = pending)
POST /api/v1/listings/{id}/images/upload-url
POST /api/v1/listings/{id}/images
PUT  /api/v1/me/favorites/{listingId}
POST /api/v1/me/devices                 (push token)
GET  /api/v1/admin/listings?status=pending
POST /api/v1/admin/listings/{id}/approve`,
        },
        {
          lang: "json",
          title: "response القايمة",
          src: `{
  "data": [
    {
      "id": 412,
      "title": "Villa in Al Olaya",
      "price": 1250000,
      "type": "sale",
      "city": "Riyadh",
      "rooms": 5,
      "lat": 24.6937,
      "lng": 46.6853,
      "thumbnail": "https://cdn.example.com/listings/412/1_s.jpg"
    }
  ],
  "next_cursor": "eyJpZCI6NDEyfQ",
  "has_more": true
}`,
          note: "الـ response فيه الحقول اللازمة للكارت بس (thumbnail مش الصورة كاملة). الـ cursor قيمة مبهمة يعيدها الـ client كما هي.",
        },
        {
          lang: "sql",
          title: "استعلام الخريطة والبحث",
          src: `SELECT id, title, price, lat, lng
FROM listings
WHERE status = 'active' AND type = 'sale'
  AND lat BETWEEN 24.60 AND 24.80
  AND lng BETWEEN 46.60 AND 46.80
LIMIT 200;`,
          note: "اتجرب. الخريطة بتبعت حدود الشاشة (bounding box) والـ server بيرجع الإعلانات اللي جواها. الـ B-tree index على (lat, lng) بيستفيد من range واحد بس. لو الداتا كبرت استخدم spatial index (MySQL <code>POINT</code> مع <code>SPATIAL INDEX</code>، أو PostGIS). ومع زووم بعيد ارجع نتائج مجمعة (clusters) أو حد أقصى 200.",
        },
      ],
      points: [
        "<b>الفلاتر</b> بتتبني ديناميك (كل فلتر موجود يضيف شرط) والقيم bindings مش string concatenation.",
        "<b>الصلاحيات</b>: العميل يقرا <code>active</code> بس، المكتب يرى إعلاناته كلها، الأدمن يرى كله. تتفحص في كل endpoint مش في التطبيق بس.",
        "<b>الإشعارات</b>: لما الأدمن يوافق، بنرمي job في الـ queue يجيب <code>device_tokens</code> المهتمين ويبعت push عن طريق FCM/APNs، من غير ما request الموافقة يستنى.",
      ],
      interview: [
        { q: "إزاي تصمم البحث بفلاتر وخريطة؟", a: "جدول <code>listings</code> بـ composite index على الأعمدة اللي بتتفلتر بالمساواة الأول (status، city، type) والـ range آخر (price)، وcursor pagination. الخريطة بتبعت bounding box (north/south/east/west) والـ API بترجع الإعلانات جواه بحد أقصى. لو الحجم كبر أضيف spatial index أو محرك بحث مخصص زي Elasticsearch، لكن مش من الأول. والنتائج الشائعة بتتخزن في cache بـ TTL قصير." },
      ],
    },
    {
      kicker: "مثال متكامل 3/3",
      title: "من سيرفر واحد لعدة سيرفرات: إيه اللي بيتغير ومتى",
      en: "Worked example: what is cached, queued, and how it grows",
      body: "<p>الجزء الأهم في الإجابة: تبين إن عندك <b>خطة نمو مرتبطة بأعراض</b>، مش «هعمل كل حاجة من الأول».</p>",
      code: {
        lang: "text",
        title: "مراحل النمو",
        src: `Stage 1: one server (web + PHP + MySQL), one small queue worker
  - indexes on the search query
  - images in object storage + CDN from day one (cheap, and it keeps
    the server stateless)

Stage 2: symptom = pages slow at peak, DB CPU high
  - Redis: cache for hot reads (listing details, city list, popular
    searches with short TTL); queue moves from DB to Redis
  - move MySQL to its own machine

Stage 3: symptom = one API server is at its limit
  - 2+ API servers behind a load balancer (servers stateless,
    sessions as tokens, uploads in object storage)
  - read replica for the listing list and map queries
  - more queue workers for push and image jobs

Stage 4: symptom = search is slow even with indexes
  - search engine for text and geo queries (kept in sync by queue jobs)
  - rate limits, alerts on 5xx and queue length, tested restore of backups`,
        note: "كل مرحلة بتبدأ بـ <b>عرض</b> قستَه، مش بتخمين. وبترتيب التكلفة: index ثم cache ثم replica ثم محرك بحث.",
      },
      points: [
        "<b>اللي بيتخزن في الـ cache</b>: تفاصيل إعلان (مفتاح لكل إعلان، يتمسح عند التعديل)، قايمة المدن والأنواع، نتائج بحث شائعة بـ TTL قصير. مفيش cache لحاجات خاصة بمستخدم في مفتاح عام.",
        "<b>اللي بيروح لـ queue</b>: push notifications، تصغير الصور، إيميلات/SMS، تحديث الـ search index.",
        "<b>اللي لازم consistent</b>: حالة الإعلان وصلاحيات المستخدم تتقرا من الـ primary أو بـ cache قصير جدا.",
      ],
      interview: [
        { q: "التطبيق بطيء مع زيادة المستخدمين، إيه الترتيب اللي تشتغل بيه؟", a: "أقيس الأول (logs، زمن الاستعلامات، CPU) وأعرف الـ bottleneck. غالبا الـ database: indexes و<code>EXPLAIN</code> وتقليل N+1. بعدها cache للقراءات المتكررة. بعدها لو الـ API server ممتلئ أضيف سيرفر ورا load balancer بعد ما أتأكد إنه stateless، وأنقل الشغل البطيء للـ queue. replica وsearch engine آخر الخيارات لأنهم بيضيفوا تعقيد. كل خطوة مبررة برقم مش بإحساس." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: response لإعلان (JSON)",
      lang: "json",
      code: `{
  "data": {
    "id": 412,
    "title": "Villa in Al Olaya",
    "price": 1250000,
    "city": "Riyadh",
    "images": [
      "https://cdn.example.com/412/1.jpg",
      "https://cdn.example.com/412/2.jpg"
    ],
    "is_favorite": false
  }
}`,
    },
    {
      title: "اكتب: جدول المفضلة وindex",
      lang: "sql",
      code: `CREATE TABLE favorites (
  user_id INTEGER NOT NULL,
  listing_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, listing_id)
);

CREATE INDEX idx_fav_listing ON favorites (listing_id);

SELECT listing_id FROM favorites
WHERE user_id = 5
ORDER BY created_at DESC
LIMIT 20;`,
    },
    {
      title: "اكتب: health check وbackup",
      lang: "bash",
      code: `#!/bin/bash
set -e

code=$(curl -s -o /dev/null -w "%{http_code}" \\
  https://api.example.com/health)
echo "health: $code"

mysqldump --single-transaction app_db \\
  | gzip > "backup_$(date +%F).sql.gz"

ls -lh backup_*.sql.gz`,
      note: "الـ <code>\\</code> في آخر السطر بتكمل الأمر. <code>--single-transaction</code> بياخد نسخة متسقة من جداول InnoDB من غير ما يقفل الجداول.",
    },
  ],

  tasks: [
    {
      title: "مفضلة المستخدم بـ pagination",
      lang: "sql",
      prompt: "<p>عندك جدول <code>favorites(user_id, listing_id, created_at)</code> وجدول <code>listings(id, title, price)</code>. اكتب استعلام يرجع أحدث 20 إعلان مفضل للمستخدم رقم 5 (العنوان والسعر ووقت الإضافة)، ومعاه شرط الـ cursor: الصفحة اللي بعد وقت <code>'2026-11-01 10:00:00'</code>. واكتب index يخدم الاستعلام ده.</p>",
      hints: [
        "<code>JOIN listings l ON l.id = f.listing_id</code> وفلتر <code>f.user_id = 5</code>.",
        "الترتيب بـ <code>f.created_at DESC</code>، والـ cursor <code>AND f.created_at &lt; ...</code>.",
        "الـ index: (user_id, created_at): المساواة الأول ثم العمود اللي بنرتب بيه.",
      ],
      solution: `CREATE INDEX idx_fav_user_time
  ON favorites (user_id, created_at);

SELECT l.id, l.title, l.price, f.created_at
FROM favorites f
JOIN listings l ON l.id = f.listing_id
WHERE f.user_id = 5
  AND f.created_at < '2026-11-01 10:00:00'
ORDER BY f.created_at DESC
LIMIT 20;`,
      explain: "الـ index على (user_id, created_at) بيخلي القاعدة تروح لصفوف المستخدم مرتبة بالفعل، فمفيش sort إضافي. cursor على الوقت بدل OFFSET عشان السرعة تفضل ثابتة في الصفحات البعيدة. لو ممكن يتكرر نفس الوقت بالظبط، ضيف <code>listing_id</code> للترتيب وللـ cursor عشان مفيش صف يتخطى.",
    },
    {
      title: "cache بـ TTL: remember",
      lang: "php",
      prompt: "<p>اكتب كلاس <code>TtlCache</code> فيه method <code>remember(string $key, int $ttl, callable $compute, int $now): mixed</code>: لو المفتاح موجود ولسه صلاحيته ما خلصتش (<code>$now &lt; expiresAt</code>) يرجع القيمة المخزنة من غير ما ينادي <code>$compute</code>، غير كده ينادي <code>$compute</code> ويخزن النتيجة لحد <code>$now + $ttl</code> ويرجعها. الوقت بيتبعت كـ parameter عشان الاختبار.</p>",
      examples: [
        { in: "remember('k', 60, $calc, 100) ثم remember('k', 60, $calc, 120) ثم remember('k', 60, $calc, 161)", out: "الدالة اتنادت مرتين (الأولى والتالتة)" },
      ],
      hints: [
        "خزن لكل مفتاح <code>[قيمة, وقت_الانتهاء]</code>.",
        "الشرط: <code>isset($this->items[$key]) && $now &lt; $this->items[$key][1]</code>.",
      ],
      solution: `<?php
class TtlCache
{
    private array $items = [];

    public function remember(string $key, int $ttl, callable $compute, int $now): mixed
    {
        if (isset($this->items[$key]) && $now < $this->items[$key][1]) {
            return $this->items[$key][0];
        }

        $value = $compute();
        $this->items[$key] = [$value, $now + $ttl];

        return $value;
    }
}

$calls = 0;
$calc = function () use (&$calls) {
    $calls++;
    return 'value';
};

$cache = new TtlCache();
$cache->remember('k', 60, $calc, 100);
$cache->remember('k', 60, $calc, 120);
$cache->remember('k', 60, $calc, 161);
echo "computed $calls times", PHP_EOL;`,
      explain: "ده نفس فكرة <code>Cache::remember</code> في Laravel. الطلب الثاني (120) لسه قبل 160 فاتجاب من الـ cache، والتالت (161) بعد الانتهاء فاتحسب تاني: الناتج <code>computed 2 times</code>. لاحظ إن TTL وحده مش بيمنع إن القيمة تبقى قديمة لحد ما تنتهي، فللحاجات اللي لازم تتحدث فورا نضيف مسح صريح.",
    },
    {
      title: "اكتب إجابة تصميم: إشعارات البحث المحفوظ",
      lang: "text",
      prompt: "<p>المطلوب: المستخدم يحفظ بحث (مدينة، نوع، حد أقصى للسعر)، ولما إعلان جديد يتنشر ويطابقه يوصله push. اكتب إجابة من 6 إلى 10 أسطر بالخطوات: متطلبات وأرقام، جداول، مسار النشر، ما يروح للـ queue، وأول bottleneck محتمل.</p>",
      hints: [
        "جدول <code>saved_searches</code> بالفلاتر وuser_id، وجدول <code>device_tokens</code> موجود.",
        "التنفيذ في الـ queue: job لكل إعلان جديد. وبعدين اسأل نفسك: لو عندي 100 ألف بحث محفوظ، هل أفحصهم كلهم؟",
      ],
      solution: `Requirements: save a search; push when a new active listing matches.
Numbers (assumed): [saved searches] searches, [new listings per day] listings/day.
Data: saved_searches(id, user_id, city, type, max_price, created_at)
      index (city, type, max_price) to find candidates fast.
Flow: admin approves listing -> event ListingApproved -> queued job
  1. SELECT searches WHERE city = :city AND type = :type
     AND max_price >= :price
  2. join device_tokens for those users, send push in batches of 500
  3. save a notification row; make the job idempotent (unique user + listing)
Queue: all of it, the approve request must not wait for pushes.
Bottleneck: step 1 on a large table. The index handles it; if it grows,
  limit notifications per user per day and batch the sending.`,
      explain: "الإجابة ماشية بالترتيب: متطلبات، أرقام (مكتوبة كفتحات لازم تملاها بأرقامك)، data model، مسار، queue، bottleneck. النقطة القوية إن البحث عن المطابقين <b>بيتعمل بـ SQL بـ index</b> بدل ما نلف على كل البحوث في PHP، وإن الـ job idempotent بقيد unique. مفيش أرقام حقيقية هنا عمدا.",
    },
  ],

  quiz: [
    {
      q: "عايز تضيف سيرفر تاني ورا load balancer، لكن المستخدمين بيتسجل خروجهم عشوائيا. السبب الأرجح؟",
      options: [
        "الـ session متخزنة في ميموري كل سيرفر، فالطلب الجاي بيروح لسيرفر ميعرفهاش",
        "الـ database ضعيفة",
        "الـ load balancer بيقفل الاتصال",
        "الصور كبيرة",
      ],
      answer: 0,
      why: "ده الفرق بين stateless وstateful. الحل: tokens أو session store مشترك (Redis/database). الـ sticky sessions بتحل المشكلة مؤقتا وبتضيع فايدة التوزيع.",
    },
    {
      q: "المالك عدّل سعر إعلان، والتطبيق لسه بيعرض القديم لعشر دقايق. أنسب إصلاح؟",
      options: [
        "تشيل الـ cache كله",
        "تخلي TTL يوم كامل",
        "تعمل زيادة في سيرفرات الـ API",
        "تمسح مفتاح الإعلان من الـ cache عند حفظ التعديل (وتسيب TTL كشبكة أمان)",
      ],
      answer: 3,
      why: "ده invalidation عند الكتابة. إلغاء الـ cache كله بيخسرك الفايدة، وTTL أطول بيزود المشكلة، وسيرفرات أكتر مالهاش علاقة.",
    },
    {
      q: "أنهي واحد من دول <b>مينفعش</b> يتحط في queue؟",
      options: [
        "إرسال push بعد موافقة الأدمن",
        "التحقق من إن المستخدم عنده صلاحية يعدل الإعلان قبل ما الـ API ترد",
        "تصغير الصورة المرفوعة",
        "إرسال إيميل ترحيب",
      ],
      answer: 1,
      why: "التحقق من الصلاحية لازم يحصل داخل الطلب نفسه، لأن الرد (403 أو نجاح) بيعتمد عليه. الباقي شغل بعدي ممكن المستخدم ميستناهوش.",
    },
    {
      q: "كتبت بيانات في الـ primary وبعدها قريتها من replica فرجعت القديمة. التفسير؟",
      options: [
        "bug في Laravel",
        "الـ index ناقص",
        "الـ replication lag: الـ replica لسه ملحقتش",
        "الـ cache على الـ client",
      ],
      answer: 2,
      why: "الـ replication بيحصل بعد الكتابة بوقت قصير. القراءة اللي تعتمد على كتابة لسه حصلت تتقرا من الـ primary، والـ replicas للقراءات اللي تتحمل تأخير.",
    },
    {
      q: "الاستعلام: <code>WHERE status = 'active' AND city = 'Riyadh' AND price BETWEEN 1 AND 9</code>. أنهي index أنسب؟",
      options: [
        "<code>(price, status, city)</code>",
        "<code>(status, city, price)</code>",
        "<code>(city)</code> و<code>(price)</code> منفصلين فقط",
        "<code>(price)</code> فقط",
      ],
      answer: 1,
      why: "المساواة (status، city) الأول وبعدين الـ range (price). لو الـ range جه أولا الـ B-tree مش بيقدر يستفيد من باقي الأعمدة بعده بنفس الكفاءة.",
    },
    {
      q: "المستخدم بيرفع صورة 6MB من الموبايل. إيه أحسن تصميم؟",
      options: [
        "الصورة تتبعت لـ API server وتتحفظ على disk السيرفر",
        "الصورة تتحفظ كـ base64 في جدول listings",
        "الـ client يرفع مباشرة على object storage بـ presigned URL، والـ API تسجل المسار وتشغل job للتصغير",
        "الصورة تتبعت في email للأدمن",
      ],
      answer: 2,
      why: "كده الـ API servers مبتتحملش حجم الملفات وبتفضل stateless، والتصغير شغل بطيء مكانه الـ queue. disk السيرفر بيكسر التكبير الأفقي، والـ base64 في الـ database بيكبرها بدون داعي.",
    },
    {
      q: "عدد الطلبات في اليوم 1,200,000 تقريبا. المتوسط بالطلب في الثانية؟ (قرّب لأقرب رقم صحيح، اليوم 86,400 ثانية)",
      answer: ["14", "13.9", "13.89"],
      why: "1,200,000 ÷ 86,400 ≈ 13.9، يعني حوالي 14 طلب/ثانية كمتوسط. الذروة غالبا 5 إلى 10 أضعاف المتوسط، فبتصمم على الذروة مش المتوسط.",
    },
    {
      q: "في مقابلة، سألوك عن CAP. أنسب جملة صادقة؟",
      options: [
        "«أي نظام لازم يختار اتنين من تلاتة وخلاص»",
        "«وقت الانقطاع في الشبكة بين الأجهزة لازم أختار بين consistency وavailability، وأقرر لكل ميزة: الدفع والحجز consistent، والعدادات والـ cache تتحمل eventual»",
        "«أنا بستخدم NoSQL عشان أتجنب المشكلة»",
        "«المشكلة دي بتخص Google بس»",
      ],
      answer: 1,
      why: "الإجابة الأقوى بتوضح إن الاختيار بيحصل وقت partition وإنه قرار لكل ميزة. اختيار NoSQL مش بيلغي المفاضلة، وSQL وحده مش دايما الحل.",
    },
    {
      q: "أنهي أول خطوة عندك لو قالوا لك «صمم نظام لتطبيق عقارات»؟",
      options: [
        "ارسم load balancer وRedis وKafka",
        "اتكلم عن microservices",
        "اطلب المتطلبات وقدّر الأرقام الأول",
        "ابدأ بكتابة كود الـ models",
      ],
      answer: 2,
      why: "من غير متطلبات وأرقام مفيش أساس لأي قرار. التصميم المعقد من أول ثانية بيدل إنك مش بتفكر بحجم المشكلة.",
    },
  ],
};
