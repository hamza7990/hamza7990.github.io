window.LEVELS = window.LEVELS || {};
window.LEVELS["php/pb"] = {
  boss: [
    {
      q: "إيه اللي بيغيره <code>declare(strict_types=1)</code> بالظبط؟ وإيه اللي مبيغيرهوش؟",
      a: `<p>من غيره PHP بتعمل coercion للأنواع في استدعاء الدوال: <code>"5"</code> بتتحول 5 لـ <code>int $n</code>، والـ <code>5.5</code> لـ <code>int</code> بتتقطع لـ 5 مع Deprecated من PHP 8.1. معاه (<code>strict_types=1</code>) نفس الاستدعاءات بترمي <code>TypeError</code>. الاستثناء الوحيد المسموح هو <code>int</code> لـ <code>float</code> (<code>half(5)</code> شغالة لأن 5 ممكن تتمثل float من غير خسارة).</p><p>نقطتين بيتنسوا: (1) الـ directive بيتطبق على <b>الملف اللي فيه الاستدعاء</b> مش الملف اللي فيه تعريف الدالة، فكل ملف لازم يكتبه. (2) هو بيأثر على الـ scalar types في الاستدعاءات والـ return بس، مش على <code>==</code> ولا على عمليات مثل <code>"5" + 1</code>. الـ union types (<code>int|string</code>) بتشتغل بنفس الفكرة. في Laravel ملفات الـ framework كلها strict، وأنا بكتبه في أي ملف جديد.</p>`,
    },
    {
      q: "إيه ناتج الكود ده في PHP 8، وليه؟<pre dir='ltr'><code>var_dump(0 == \"a\");\nvar_dump(\"1\" == \"01\");\nvar_dump(\"10\" == \"1e1\");\nvar_dump(null === false);</code></pre>",
      a: `<p>الناتج: <code>bool(false)</code> ثم <code>bool(true)</code> ثم <code>bool(true)</code> ثم <code>bool(false)</code>.</p><p>القاعدة في PHP 8: لما أقارن <b>رقم</b> بنص، لو النص رقمي (<code>"1e1"</code>) بيتحول لرقم ويتقارن عددياً، ولو مش رقمي (<code>"a"</code>) الرقم بيتحول لنص ويتقارن كنصين، فـ <code>"0" == "a"</code> هي false. في PHP 7 كانت <code>0 == "a"</code> بترجع true وده كان مصدر باجات أمنية. وقارن نصين رقميين (<code>"1" == "01"</code> و<code>"10" == "1e1"</code>) بيتحولوا لأرقام فيطلعوا متساويين رغم إن النصين مختلفين. أما <code>===</code> فبتقارن النوع والقيمة، فـ <code>null === false</code> هي false. عشان كده الافتراضي عندي <code>===</code>، وخصوصا مع الباسوردات والـ tokens.</p>`,
    },
    {
      q: "إيه ناتج الكود ده وليه؟ (دي من أشهر الأسئلة)<pre dir='ltr'><code>$a = [1, 2, 3];\nforeach ($a as &amp;$v) {}\nforeach ($a as $v) {}\necho implode(',', $a);</code></pre>",
      a: `<p>الناتج: <code>1,2,2</code>.</p><p>بعد اللوب الأول، <code>$v</code> لسه <b>reference</b> على آخر عنصر في المصفوفة (<code>$a[2]</code>). اللوب التاني بيعمل <code>$v = $a[0]</code> وبعدين <code>$v = $a[1]</code>، وكل إسناد بيكتب فعليا على <code>$a[2]</code> لأن $v مربوط بيه. فلما يوصل للعنصر الأخير بيقرا $a[2] اللي بقت 2 بالفعل. فالمصفوفة بقت 1,2,2.</p><p>الحل: أعمل <code>unset($v)</code> بعد اللوب اللي بيستخدم reference، أو أتجنب الـ reference وأكتب <code>$a[$k] = ...</code> أو أستخدم <code>array_map</code>. وده كمان سبب إني مش بحب الـ references إلا لو لازم.</p>`,
    },
    {
      q: "اكتب دالة <code>totalsByUser(array $orders): array</code>: بتاخد طلبات كل واحد فيها <code>user</code> و<code>total</code>، وترجع مجموع كل مستخدم مرتب من الأكبر للأصغر (المفتاح اسم المستخدم).",
      a: `<p>الخطة: لف على الطلبات وأجمّع في مصفوفة associative مفتاحها اسم المستخدم. استخدم <code>??</code> عشان أول مرة يظهر فيها المستخدم يبدأ من 0 من غير <code>isset</code>. وبعد ما أخلص أرتب بالقيمة تنازلياً مع الحفاظ على المفاتيح بـ <code>arsort</code> (مش <code>rsort</code> لأنها بتضيّع المفاتيح). من PHP 8.0 الترتيب stable، فالمتساويين بيفضلوا بترتيب ظهورهم.</p><pre dir='ltr'><code>function totalsByUser(array $orders): array
{
    $totals = [];
    foreach ($orders as $order) {
        $user = $order['user'];
        $totals[$user] = ($totals[$user] ?? 0) + $order['total'];
    }
    arsort($totals);
    return $totals;
}</code></pre><p>التعقيد O(n + u log u) حيث u عدد المستخدمين. المصفوفة الفاضية بترجع <code>[]</code>. نفس الحل بـ <code>array_reduce</code> أقصر لكنه أصعب في القراءة.</p>`,
    },
    {
      q: "إيه الفرق بين <code>function () use ($n)</code> و<code>use (&amp;$n)</code> و<code>fn() =&gt; $n</code>؟ وإيه ناتج الكود ده؟<pre dir='ltr'><code>$n = 1;\n$a = function () use ($n) { return $n; };\n$b = function () use (&amp;$n) { return $n; };\n$c = fn() =&gt; $n;\n$n = 2;\necho $a(), $b(), $c();</code></pre>",
      a: `<p>الناتج: <code>121</code>.</p><p>الـ closure العادية مبتشوفش متغيرات الخارج إلا لو كتبتها في <code>use</code>. <code>use ($n)</code> بتنسخ القيمة <b>وقت إنشاء</b> الـ closure فبتفضل 1 حتى لو $n اتغير بعد كده. <code>use (&$n)</code> بتربط بالمتغير نفسه فبتشوف 2. والـ arrow function <code>fn</code> بتلقط من الخارج أوتوماتيك لكن <b>بالقيمة</b> وقت الإنشاء، فبتطلع 1 زي الأولى، ومينفعش تعدّل بيها المتغير الخارجي. وكمان arrow function جملة return واحدة بس.</p><p>استخدامي: <code>fn</code> للـ callbacks القصيرة (<code>array_map(fn($x) => $x * 2, $xs)</code>)، وclosure عادية لو محتاج أكتر من سطر، و<code>&</code> نادراً (مثلا counter).</p>`,
    },
    {
      q: "امتى تستخدم interface وامتى abstract class وامتى trait؟ ولو الـ trait فيه method بنفس اسم method في trait تاني؟",
      a: `<p><b>Interface</b> هي عقد: أسماء methods وأنواعها من غير تنفيذ ولا حالة (state)، والكلاس يقدر يطبق أكتر من واحد، وبتستخدم لما أكتر من كلاس مختلف لازم يتعاملوا معاه بنفس الشكل (<code>PaymentGateway</code>). <b>Abstract class</b> بتحط تنفيذ مشترك وحالة (properties) وبتجبر الكلاسات الفرعية تكمل methods معينة، لكن الكلاس يرث من واحدة بس، وبتناسب علاقة «is a» حقيقية. <b>Trait</b> هي نسخ كود جاهز جوه الكلاس بـ <code>use</code>، مفيهاش نوع (مش بتتكتب كـ type hint) وبتستخدم لسلوك مشترك بين كلاسات مش بيرثوا من بعض (<code>HasTimestamps</code>).</p><p>لو trait-ين فيهم method بنفس الاسم، PHP بترمي fatal error لحد ما أحل التعارض صراحة:</p><pre dir='ltr'><code>class Greeter
{
    use Hello, Hi {
        Hello::say insteadof Hi;
        Hi::say as sayHi;
    }
}</code></pre><p>يعني آخد <code>say</code> من Hello وأدي نسخة Hi اسم تاني. القاعدة: لو العلاقة «is a» → abstract، لو «can do» → interface، ولو بس عايز أعيد استخدام كود → trait (أو composition لو ممكن).</p>`,
    },
    {
      q: "إيه الفرق بين <code>self</code> و<code>static</code> (late static binding)؟ وإيه ناتج الكود ده؟<pre dir='ltr'><code>class Model {\n    public static function create(): static { return new static(); }\n    public static function make(): self { return new self(); }\n}\nclass User extends Model {}\necho get_class(User::create()), ' ', get_class(User::make());</code></pre>",
      a: `<p>الناتج: <code>User Model</code>.</p><p><code>self</code> بتشاور على الكلاس اللي <b>كُتب فيه</b> الكود (Model) وبتتحدد وقت الكتابة. <code>static</code> بتتحدد وقت <b>التشغيل</b> حسب الكلاس اللي اتنادى عليه فعلا، وده اسمه late static binding. فـ <code>User::create()</code> بترجع User، و<code>User::make()</code> بترجع Model.</p><p>ده اللي بيخلي factory methods في الـ base class ترجع الكلاس الفرعي الصح، وLaravel بتستخدمه في <code>Model::create()</code> و<code>Model::query()</code>. نوع الإرجاع <code>static</code> متاح من PHP 8.0.</p>`,
    },
    {
      q: "اكتب enum اسمه <code>Status</code> (pending, paid, shipped) وكلاس <code>Order</code> غير قابل للتعديل، بحيث الانتقال بين الحالات يكون بس <code>pending → paid → shipped</code>، وأي انتقال غلط يرمي exception.",
      a: `<p>أستخدم <b>backed enum</b> (string) عشان أخزنه في الداتابيز وأقراه بـ <code>from</code> / <code>tryFrom</code>، وأحط قواعد الانتقال في الـ enum نفسه بـ <code>match</code>. الـ <code>Order</code> فيه properties <code>readonly</code> (PHP 8.1) فمينفعش تتعدل بعد الإنشاء، وبدل التعديل بنرجع نسخة جديدة. ده بيخلي الكود أبسط في الاختبار وبيمنع حالة غلط.</p><pre dir='ltr'><code>enum Status: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Shipped = 'shipped';

    public function label(): string
    {
        return ucfirst($this->value);
    }

    public function canMoveTo(self $next): bool
    {
        return match ($this) {
            self::Pending => $next === self::Paid,
            self::Paid => $next === self::Shipped,
            self::Shipped => false,
        };
    }
}

final class Order
{
    public function __construct(
        public readonly int $id,
        public readonly Status $status = Status::Pending,
    ) {}

    public function moveTo(Status $next): self
    {
        if (!$this->status->canMoveTo($next)) {
            throw new DomainException(
                "Cannot go from {$this->status->value} to {$next->value}"
            );
        }
        return new self($this->id, $next);
    }
}</code></pre><p>الـ <code>match</code> هنا exhaustive، لو نسيت حالة بيرمي <code>UnhandledMatchError</code>. والـ <code>Status::from('x')</code> بترمي <code>ValueError</code> أما <code>tryFrom('x')</code> فبترجع null.</p>`,
    },
    {
      q: "عملت deploy لمشروع Laravel على سيرفر Linux فظهر <code>Class not found</code> لكلاس شغال على جهازك (Windows). إيه أسباب الغلطة المحتملة، وإيه أوامر الـ Composer اللي بتشغلها في الـ production؟",
      a: `<p>الأسباب: (1) <b>حالة الحروف</b>: Windows مبتفرقش بين <code>User.php</code> و<code>user.php</code> لكن Linux بيفرق، وPSR-4 بتربط الـ namespace باسم الملف بالظبط. (2) الـ namespace مش مطابق لمسار المجلد المتسجل في <code>autoload.psr-4</code> في <code>composer.json</code>. (3) الـ autoloader القديم (classmap مخزن) ومحتاج <code>composer dump-autoload</code>. (4) package اتحط في <code>require-dev</code> وإحنا مشغلين <code>--no-dev</code>.</p><p>في الـ production بشغل <code>composer install --no-dev --optimize-autoloader</code> على نفس <code>composer.lock</code> اللي اتعمل له commit، عشان نفس الإصدارات بالظبط تتثبت. مبشغلش <code>composer update</code> على السيرفر لأنه بيغير الإصدارات من غير ما حد يراجعها. الـ <code>composer.lock</code> بيتعمل له commit في الـ applications (مش بالضرورة في الـ libraries).</p>`,
    },
    {
      q: "إيه الفرق بين <code>Exception</code> و<code>Error</code>؟ وإزاي تلف exception في custom exception من غير ما تضيع الأصل؟ وإيه ناتج <code>g()</code> هنا؟<pre dir='ltr'><code>function g() {\n    try { return 'try'; }\n    finally { return 'finally'; }\n}\necho g();</code></pre>",
      a: `<p>الاتنين بيطبقوا <code>Throwable</code>. <code>Exception</code> للأخطاء اللي التطبيق ممكن يتعامل معاها (ملف مش موجود، validation)، و<code>Error</code> للأخطاء اللي PHP نفسها بترميها وغالبا مشكلة في الكود (<code>TypeError</code>, <code>DivisionByZeroError</code>). لو عملت <code>catch (Exception $e)</code> مش هتمسك <code>TypeError</code>، لازم <code>Throwable</code>.</p><p>للف exception بحط الأصل في الـ <code>previous</code> (الباراميتر التالت):</p><pre dir='ltr'><code>try {
    intdiv(1, 0);
} catch (DivisionByZeroError $e) {
    throw new AppException('Report failed', 0, $e);
}</code></pre><p>وبعدين <code>$e->getPrevious()</code> بترجع الأصل فالـ stack trace مبيضيعش. ناتج <code>g()</code> هو <code>finally</code>: الـ <code>finally</code> بيشتغل دايما، ولو فيه <code>return</code> جواه فبيلغي الـ return اللي في try (وبيبلع أي exception كمان)، فنتجنب <code>return</code> جوه finally.</p>`,
    },
    {
      q: "إزاي تتعامل مع null في PHP 8 بشكل نضيف؟ إيه الفرق بين <code>??</code> و<code>?:</code> و<code>?-&gt;</code> و<code>??=</code>؟ وإيه ناتج <code>$user?-&gt;profile-&gt;city ?? 'unknown'</code> لو <code>$user</code> هو null؟",
      a: `<p><code>??</code> بترجع الطرف اليمين لو الشمال <b>null أو مش معرّف</b> (من غير warning)، وده الأنسب للمفاتيح اللي ممكن تكون ناقصة: <code>$data['name'] ?? 'guest'</code>. <code>?:</code> (Elvis) بترجع اليمين لو الشمال <b>falsy</b> (صفر، نص فاضي، <code>"0"</code>، array فاضية)، فمع <code>0</code> بتدي نتيجة مختلفة. <code>??=</code> بتسند بس لو المتغير null أو مش موجود. و<code>?-></code> (nullsafe) بتوقف السلسلة وترجع null لو الجسم قبلها null.</p><p>الناتج هنا: <code>unknown</code>. لأن <code>$user?->profile</code> لما $user يبقى null بتقطع <b>السلسلة كلها</b> (short-circuit) فـ <code>->city</code> مبتتنفذش، والـ <code>??</code> بتدي القيمة البديلة. لكن لو $user موجود و<code>profile</code> هو null، لازم أكتب <code>?-></code> قبل city كمان (<code>$user?->profile?->city</code>) وإلا هتاخد warning. وفي الدوال بفضل أنواع nullable (<code>?User</code>) وأتعامل معاها صراحة.</p>`,
    },
    {
      q: "اشرح الـ session والـ cookie في PHP، وإزاي تأمّن session تسجيل الدخول (session fixation و cookie flags)؟",
      a: `<p>HTTP مبيفتكرش حاجة بين ريكويست والتاني (stateless). الـ session بتخزن البيانات على <b>السيرفر</b> (ملف أو Redis أو داتابيز)، وكل اللي بيروح للمتصفح cookie فيها <b>session id</b> عشوائي. الـ cookie العادية بتخزن البيانات في المتصفح نفسه فمينفعش أحط فيها حاجة حساسة من غير توقيع أو تشفير.</p><p>أمان الـ session: (1) أنادي <code>session_regenerate_id(true)</code> بعد تسجيل الدخول مباشرة، عشان لو المهاجم زرع id معروف (session fixation) يبطل ينفع. (2) أضبط cookie flags: <code>httponly</code> عشان JavaScript مايقراهاش (يقلل أثر XSS)، و<code>secure</code> عشان تروح على HTTPS بس، و<code>samesite</code> (Lax أو Strict) عشان تقلل CSRF. (3) أمسح الـ session كلها عند الخروج.</p><pre dir='ltr'><code>session_set_cookie_params([
    'lifetime' =&gt; 0,
    'path' =&gt; '/',
    'secure' =&gt; true,
    'httponly' =&gt; true,
    'samesite' =&gt; 'Lax',
]);
session_start();
// after a successful login:
session_regenerate_id(true);
$_SESSION['user_id'] = $user['id'];</code></pre><p>في Laravel ده كله جاهز في <code>config/session.php</code> والـ framework بيعمل regenerate عند الـ login.</p>`,
    },
    {
      q: "عندك الكود ده في صفحة بحث وحذف. لقّط كل المشاكل الأمنية وإزاي تصلحها:<pre dir='ltr'><code>session_start();\n$q = $_GET['q'];\n$rows = $pdo-&gt;query(\"SELECT * FROM posts WHERE title LIKE '%$q%'\");\necho \"&lt;h1&gt;Results for $q&lt;/h1&gt;\";\n\nif (md5($_POST['password']) === $user['password']) {\n    $_SESSION['user_id'] = $user['id'];\n}\nif ($_SERVER['REQUEST_METHOD'] === 'POST') {\n    deletePost($_POST['id']);\n}</code></pre>",
      a: `<p>فيه أربع مشاكل أساسية:</p><p><b>1) SQL injection</b>: الـ <code>$q</code> متحط في الاستعلام مباشرة. الحل prepared statement والـ wildcards تتضاف للقيمة مش للـ SQL: <code>$s = $pdo->prepare('SELECT * FROM posts WHERE title LIKE :q'); $s->execute(['q' => '%' . $q . '%']);</code></p><p><b>2) XSS</b>: بطبع input المستخدم في HTML. الحل <code>htmlspecialchars($q, ENT_QUOTES, 'UTF-8')</code> عند الطباعة (أو Blade <code>{{ }}</code>).</p><p><b>3) الباسورد</b>: <code>md5</code> سريع جدا وبيتكسر بالـ rainbow tables ومفيهوش salt. الحل <code>password_hash</code> وقت التسجيل و<code>password_verify</code> وقت الدخول. كمان بعد نجاح الدخول لازم <code>session_regenerate_id(true)</code>.</p><p><b>4) CSRF وصلاحيات</b>: الحذف بيتم بـ POST من غير token، وكمان مفيش فحص إن المستخدم يملك البوست. الحل: CSRF token عشوائي في الـ session يتبعت مع الفورم ويتقارن بـ <code>hash_equals</code>، وفحص صلاحية (authorization) قبل الحذف (ويفضل DELETE method). المبدأ العام: لا تثق في أي input، واعمل escape عند الإخراج، وparameterize عند الاستعلام.</p>`,
    },
    {
      q: "إزاي تخزن الباسوردات في PHP؟ ولو الداتابيز اتسربت، إيه اللي يحمي المستخدمين؟",
      a: `<p>مخزنش الباسورد نفسه ولا hash سريع (<code>md5</code>, <code>sha1</code>, <code>sha256</code> عادي): الـ hashes دي مصممة للسرعة فالمهاجم يجرب مليارات التخمينات في الثانية. باستخدم <code>password_hash($pw, PASSWORD_DEFAULT)</code> اللي بتعمل hash بطيء عمدا (bcrypt حاليا) وبتولد <b>salt</b> عشوائي وتحطه جوه الناتج نفسه (حوالي 60 حرف بيبدأ بـ <code>$2y$</code>)، فنفس الباسورد بيدي hash مختلف كل مرة. وللتحقق <code>password_verify($input, $hash)</code>، وبتقارن بطريقة آمنة من الـ timing attacks.</p><pre dir='ltr'><code>$hash = password_hash($password, PASSWORD_DEFAULT);
// store $hash in the users table (column length 255)

if (password_verify($input, $user['password'])) {
    if (password_needs_rehash($user['password'], PASSWORD_DEFAULT)) {
        // save password_hash($input, PASSWORD_DEFAULT) instead
    }
    session_regenerate_id(true);
}</code></pre><p>الـ <code>password_needs_rehash</code> بتخليني أرقّي الـ cost أو الخوارزمية بعد ما المستخدم يدخل. ولو الداتابيز اتسربت، الـ hash البطيء والـ salt بيخلوا كسر الباسوردات الضعيفة بس هو اللي ممكن، ومحدش بيقدر يرجع الباسورد الأصلي. وأضيف حماية تانية: rate limiting على الـ login وعمل 2FA.</p>`,
    },
    {
      q: "اكتب دالة PDO <code>transfer($pdo, $from, $to, $amount)</code> بتحول مبلغ بين حسابين، وبتضمن إن الحسابين يتغيروا مع بعض أو مفيش حاجة تتغير، ومتسمحش بالرصيد السالب.",
      a: `<p>أحتاج <b>transaction</b>: عمليتين (خصم وإضافة) لازم يحصلوا كوحدة واحدة. ببدأ بـ <code>beginTransaction</code>، وأنفذ الخصم بـ prepared statement وشرط <code>balance >= :min</code> في نفس الـ UPDATE عشان الفحص والخصم يبقوا atomic ومفيش race condition بين قراءة الرصيد وكتابته. لو <code>rowCount()</code> مش 1 يبقى الرصيد مش كفاية أو الحساب مش موجود فأرمي exception. بعدها الإضافة. لو أي حاجة فشلت، <code>rollBack()</code> وأعيد رمي الخطأ. ولازم الاتصال يكون <code>ERRMODE_EXCEPTION</code> عشان الأخطاء تظهر كـ exceptions.</p><pre dir='ltr'><code>function transfer(PDO $pdo, int $from, int $to, int $amount): void
{
    $pdo-&gt;beginTransaction();
    try {
        $debit = $pdo-&gt;prepare(
            'UPDATE accounts SET balance = balance - :amount
             WHERE id = :id AND balance &gt;= :min'
        );
        $debit-&gt;execute(['amount' =&gt; $amount, 'id' =&gt; $from, 'min' =&gt; $amount]);
        if ($debit-&gt;rowCount() !== 1) {
            throw new RuntimeException('Insufficient funds or unknown account');
        }

        $credit = $pdo-&gt;prepare(
            'UPDATE accounts SET balance = balance + :amount WHERE id = :id'
        );
        $credit-&gt;execute(['amount' =&gt; $amount, 'id' =&gt; $to]);
        if ($credit-&gt;rowCount() !== 1) {
            throw new RuntimeException('Unknown destination account');
        }

        $pdo-&gt;commit();
    } catch (Throwable $e) {
        $pdo-&gt;rollBack();
        throw $e;
    }
}</code></pre><p>لو الحساب المستلم مش موجود، الخصم بيتلغى بالـ rollback. في Laravel ده <code>DB::transaction(function () { ... })</code> وبتعمل commit وrollback لوحدها. وبكتب اسم المتغير في الـ placeholder مرة واحدة (لذلك <code>:min</code> منفصلة عن <code>:amount</code>) عشان بعض الـ drivers مبتسمحش بتكرار نفس الاسم.</p>`,
    },
  ],
};
