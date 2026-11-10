window.LEVELS = window.LEVELS || {};
window.LEVELS["php/p5"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "أغلب الـ bugs في PHP من مقارنة أو null أو خطأ مش متعالج",
      en: "Why this level matters",
      body: "<p>التلات حاجات دول بيطلعوا في أي مقابلة PHP: إزاي تتعامل مع الأخطاء، وليه <code>==</code> خطر، وإزاي تتعامل مع <code>null</code> بأمان. وفي Laravel بتشوفهم يوميا: <code>try/catch</code> حوالين الـ transaction، و<code>$user?->name</code>، و<code>$request->input('x') ?? 'default'</code>، و<code>match</code> في الـ enums.</p>",
      points: [
        "الاستثناء (exception) بيوقف التنفيذ العادي وبيطلع لحد ما حد يمسكه.",
        "<code>==</code> بتقارن بعد تحويل الأنواع، و<code>===</code> بتقارن النوع والقيمة.",
        "PHP 8 صلّحت أغرب سلوك قديم (<code>0 == \"abc\"</code>) لكن لسه فيه مصايد.",
      ],
    },
    {
      title: "try و catch و finally",
      en: "Exceptions",
      body: "<p>بنحط الكود اللي ممكن يفشل في <code>try</code>، ونمسك الخطأ في <code>catch</code> حسب نوعه. الـ <code>finally</code> بيشتغل دايما، سواء حصل خطأ أو لأ (وحتى لو فيه <code>return</code>)، وبنحط فيه التنضيف. والـ <code>throw</code> بيرمي استثناء.</p>",
      code: {
        lang: "php",
        src: `<?php
declare(strict_types=1);

function divide(int $a, int $b): int
{
    if ($b === 0) {
        throw new InvalidArgumentException("b must not be zero");
    }
    return intdiv($a, $b);
}

try {
    echo divide(10, 2), "\\n";    // 5
    echo divide(1, 0), "\\n";
    echo "not reached\\n";
} catch (InvalidArgumentException $e) {
    echo "Caught: ", $e->getMessage(), "\\n";
} finally {
    echo "always runs\\n";
}`,
        note: "الناتج: <code>5</code> ثم <code>Caught: b must not be zero</code> ثم <code>always runs</code>. أول ما حصل الاستثناء، السطر اللي بعده اتخطى.",
      },
      interview: [
        { q: "إيه اللي بيحصل في <code>finally</code> لو الـ try فيه <code>return</code>؟", a: "الـ <code>finally</code> بيتنفذ قبل ما الدالة ترجع فعلا. يعني الـ <code>return</code> بيتحسب قيمته، بعدين <code>finally</code> بيشتغل، بعدين الدالة ترجع. وبنستخدمه للتنضيف اللي لازم يحصل في كل الحالات زي قفل ملف. (لو الـ <code>finally</code> نفسه فيه <code>return</code> هيكتب فوق القيمة، وده بنتجنبه.)" },
      ],
    },
    {
      title: "Exception مقابل Error مقابل Throwable",
      en: "The hierarchy",
      body: "<p>في PHP 7+ كل حاجة ممكن تترمي بتنفذ الـ interface <code>Throwable</code>، وليه فرعين: <code>Exception</code> (أخطاء المنطق اللي تتوقعها وتتعالج) و<code>Error</code> (أخطاء جاية من اللغة نفسها زي <code>TypeError</code> و<code>DivisionByZeroError</code> و<code>ValueError</code>). <code>catch (Exception $e)</code> <b>مش بتمسك</b> الـ <code>Error</code>.</p>",
      code: {
        lang: "php",
        src: `<?php
declare(strict_types=1);

class OutOfStockException extends RuntimeException
{
    public function __construct(
        public readonly string $sku,
        ?Throwable $previous = null,
    ) {
        parent::__construct("Out of stock: $sku", 0, $previous);
    }
}

try {
    echo 1 % 0;
} catch (Exception $e) {
    echo "exception\\n";
} catch (DivisionByZeroError $e) {
    echo "error: ", $e->getMessage(), "\\n";   // error: Modulo by zero
}

try {
    try {
        throw new OutOfStockException("A-1");
    } catch (OutOfStockException $e) {
        echo "log: ", $e->getMessage(), "\\n";
        throw $e;                              // rethrow
    }
} catch (Throwable $t) {
    echo get_class($t), " for ", $t->sku, "\\n";   // OutOfStockException for A-1
}`,
        note: "الـ custom exception بيمتد من <code>Exception</code> أو من فرع مناسب زي <code>RuntimeException</code> أو <code>InvalidArgumentException</code>. و<code>throw $e</code> بيعيد رمي نفس الاستثناء. و<code>$previous</code> بيحفظ الاستثناء الأصلي لما تغلّفه في واحد جديد.",
      },
      terms: [
        ["Throwable", "أي حاجة تترمي", "الـ interface اللي Exception و Error بينفذوه، ومينفعش تنفذه بنفسك."],
        ["rethrow", "إعادة الرمي", "تمسك الخطأ، تسجله، وتعيد رميه لمستوى أعلى."],
      ],
      interview: [
        { q: "إيه الفرق بين <code>Error</code> و <code>Exception</code> في PHP؟", a: "الاتنين بينفذوا <code>Throwable</code>. <code>Exception</code> للحالات اللي التطبيق ممكن يتوقعها ويتعامل معاها (ملف مش موجود، مخزون خلص)، وبنعمل لها custom classes. <code>Error</code> بيرميه PHP نفسه لما يحصل مشكلة في الكود أو اللغة: <code>TypeError</code> و<code>DivisionByZeroError</code> و<code>ValueError</code>. <code>catch (Exception)</code> مبتمسكش الـ <code>Error</code>، فلو عايز الاتنين تستخدم <code>Throwable</code>، لكن ده يتحط في حدود التطبيق (global handler) مش في كل مكان." },
        { q: "إمتى تعمل custom exception؟", a: "لما الـ caller محتاج يفرق بين نوع خطأ ونوع تاني ويتصرف مختلف، مثلا <code>InsufficientBalanceException</code> يرجع 422 للمستخدم، و<code>PaymentGatewayDown</code> يرجع 503. الاسم بيعبر عن المشكلة في لغة الدومين، وبنحط فيه البيانات المفيدة (الـ sku، المبلغ). وبنمتد من فرع مناسب عشان الـ catch العام يفضل شغال." },
      ],
    },
    {
      title: "== مقابل === ومصايد الـ type juggling",
      en: "Loose vs strict comparison",
      body: "<p><code>===</code> بتقارن النوع والقيمة وبس. <code>==</code> بتحول الأنواع الأول. <b>في PHP 8</b> اتغيرت قاعدة مقارنة الرقم بالنص: لو النص رقمي (<code>\"1e1\"</code>) بيتقارن كأرقام، ولو النص مش رقمي بيتحول الرقم لنص وبتتقارن كنصوص. عشان كده <code>0 == \"abc\"</code> بقت <code>false</code> (كانت <code>true</code> قبل PHP 8).</p>",
      code: {
        lang: "php",
        src: `<?php
var_dump(0 == "abc");        // false  (PHP 8; was true in PHP 7)
var_dump(0 == "");           // false  (PHP 8; was true in PHP 7)
var_dump("1" == "01");       // true   (both numeric strings)
var_dump("10" == "1e1");     // true   (numeric: 10 == 10)
var_dump(100 == "1e2");      // true
var_dump("abc" == "ABC");    // false
var_dump(null == false);     // true
var_dump(null == 0);         // true
var_dump("0" == false);      // true
var_dump([] == false);       // true
var_dump(null === false);    // false
var_dump("1" === "01");      // false`,
        note: "الدرس: لو بتقارن حاجة جاية من المستخدم أو من الداتابيز استخدم <code>===</code> وحوّل النوع صراحة، وخصوصا في الـ ids والـ tokens.",
      },
      pitfall: "<code>\"0e123\" == \"0e456\"</code> بترجع <code>true</code> لأن الاتنين رقمين (صفر × 10 أُس حاجة). ده كان سبب ثغرات في مقارنة الـ hashes. استخدم <code>===</code> أو <code>hash_equals</code> للـ hashes والـ tokens.",
      interview: [
        { q: "إيه الفرق بين <code>==</code> و <code>===</code>؟ وإيه اتغير في PHP 8؟", a: "<code>===</code> تساوي في النوع والقيمة من غير تحويل. <code>==</code> بتحول الأنواع قبل المقارنة فبتطلع نتايج غريبة زي <code>null == false</code> و<code>\"0\" == false</code>. في PHP 8 مقارنة رقم بنص بقت أمنطقية: لو النص رقمي بيتقارن كرقم، وإلا الرقم بيتحول لنص، فـ <code>0 == \"abc\"</code> بقت false بعد ما كانت true في PHP 7. أنا بستخدم <code>===</code> كقاعدة، و<code>==</code> بس لما أقصد المرونة." },
      ],
    },
    {
      title: "التعامل مع null",
      en: "??, ??=, ?->",
      body: "<p>تلات عوامل بتخلي كود الـ null قصير وآمن: <code>??</code> بتديك قيمة بديلة لو الشمال <code>null</code> أو مش موجود (من غير warning)، <code>??=</code> بتعيّن بس لو المتغير null، و<code>?-></code> (nullsafe، من PHP 8.0) بتوقف السلسلة وترجع null لو أي حلقة null.</p>",
      code: {
        lang: "php",
        src: `<?php
class Profile
{
    public function __construct(public ?string $city = null)
    {
    }
}
class User
{
    public function __construct(public ?Profile $profile = null)
    {
    }
}

$user = new User();
echo $user->profile?->city ?? 'unknown', "\\n";   // unknown

$data = ['page' => 0];
echo $data['page'] ?? 1, "\\n";            // 0   (0 is not null)
echo $data['limit'] ?? 10, "\\n";          // 10
echo $data['page'] ?: 1, "\\n";            // 1   (?: treats 0 as falsy)

$cache = null;
$cache ??= 'computed';
$cache ??= 'ignored';
echo $cache, "\\n";                        // computed`,
        note: "<code>??</code> بتفحص null فقط، و<code>?:</code> (Elvis) بتفحص الـ falsy كله. ودي مصيدة: <code>$page ?: 1</code> بتحوّل <code>0</code> لـ 1.",
      },
      interview: [
        { q: "إيه الفرق بين <code>??</code> و <code>?:</code>؟", a: "<code>$a ?? $b</code> بترجع <code>$b</code> لو <code>$a</code> مش معرّفة أو null بس، وبتسكت أي warning. <code>$a ?: $b</code> بترجع <code>$b</code> لو <code>$a</code> falsy (صفر، نص فاضي، <code>'0'</code>، array فاضية، null). فلو القيمة 0 صحيحة (صفحة، كمية) استخدم <code>??</code>." },
      ],
    },
    {
      title: "match مقابل switch",
      en: "match expressions",
      body: "<p>الـ <code>match</code> (PHP 8.0) تعبير بيرجع قيمة، وبيقارن بـ <code>===</code> (strict)، ومفيهوش fallthrough فمش محتاج <code>break</code>. ولو مفيش arm مطابق بيرمي <code>UnhandledMatchError</code>. أما <code>switch</code> فبتقارن بـ <code>==</code> المرنة وبتكمل للـ case اللي بعده لو نسيت <code>break</code>.</p>",
      code: {
        lang: "php",
        src: `<?php
declare(strict_types=1);

function label(int|string $code): string
{
    return match ($code) {
        200, 201 => 'ok',
        404 => 'not found',
        500 => 'server error',
        default => 'other',
    };
}
echo label(201), " ", label("404"), " ", label(500), "\\n";  // ok other server error

function oldLabel(string $code): string
{
    switch ($code) {
        case "1":
            return "one";
        default:
            return "other";
    }
}
echo oldLabel("01"), "\\n";   // one  (switch used ==)

try {
    echo match (99) {
        1 => 'a',
    };
} catch (\\UnhandledMatchError $e) {
    echo get_class($e), "\\n";
}

$age = 20;
echo match (true) {
    $age < 18 => 'minor',
    $age < 65 => 'adult',
    default => 'senior',
}, "\\n";   // adult`,
        note: "<code>label(\"404\")</code> رجعت <code>other</code> لأن <code>\"404\"</code> نص و<code>404</code> رقم، والـ match strict. أما <code>switch</code> مع <code>\"01\"</code> طابقت <code>\"1\"</code> بالمقارنة المرنة.",
      },
      interview: [
        { q: "إمتى تفضل <code>match</code> على <code>switch</code>؟", a: "تقريبا دايما لما أحتاج قيمة ترجع: الـ <code>match</code> تعبير فبكتب <code>return match(...)</code> مباشرة، والمقارنة strict فمفيش مفاجآت type juggling، ومفيش break ولا fallthrough، ولو نسيت حالة بيرمي <code>UnhandledMatchError</code> بدل ما يسكت (وده بيحمي مع الـ enums). الـ <code>switch</code> أقتصرها على لما محتاج fallthrough أو تنفيذ كذا statement لكل case." },
      ],
    },
    {
      title: "truthy و falsy و empty و isset",
      en: "Truthiness",
      body: "<p>القيم الـ <b>falsy</b> في PHP: <code>false</code> و<code>0</code> و<code>0.0</code> و<code>\"\"</code> و<code>\"0\"</code> و<code>[]</code> و<code>null</code>. كل ما عداها <b>truthy</b>، يعني <code>\"0.0\"</code> و<code>\"false\"</code> و<code>\" \"</code> و<code>[0]</code> كلها truthy.</p>",
      code: {
        lang: "php",
        src: `<?php
$values = [0, "0", "", "0.0", " ", [], [0], null, "false", 0.0];
foreach ($values as $v) {
    echo json_encode($v), " => ", $v ? "truthy" : "falsy", "\\n";
}

$a = ['x' => null, 'y' => 0];
var_dump(isset($a['x']));     // false (null counts as not set)
var_dump(isset($a['y']));     // true
var_dump(empty($a['y']));     // true  (0 is falsy)
var_dump(empty($a['z']));     // true  (missing key, no warning)
var_dump(array_key_exists('x', $a));   // true`,
        note: "<code>isset($x)</code> = معرّف وليس null. <code>empty($x)</code> = مش معرّف أو falsy (يعني <code>!isset($x) || !$x</code>). التلات حالات <code>0</code> و<code>\"0\"</code> و<code>\"\"</code> كلها empty.",
      },
      pitfall: "<code>if (empty($qty))</code> بترفض الكمية <code>0</code> و<code>\"0\"</code> وهي ممكن تبقى قيمة صحيحة. استخدم <code>$qty === null</code> أو <code>isset</code> لما الصفر قيمة مقبولة، و<code>empty</code> بس لما فعلا «أي حاجة فاضية» تعني نفس الشيء.",
      interview: [
        { q: "إيه الفرق بين <code>isset</code> و <code>empty</code>؟", a: "<code>isset($x)</code> true لو المتغير معرّف وقيمته مش null. <code>empty($x)</code> true لو المتغير مش معرّف أو قيمته falsy (0، '0'، ''، [], null, false). الاتنين مبيطلعوش warning على متغير أو مفتاح مش موجود. الفرق العملي: القيمة <code>0</code> هي <code>isset</code>=true و<code>empty</code>=true، فمتستخدمش <code>empty</code> للكميات والأرقام." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: try و catch و finally",
      lang: "php",
      code: `<?php
declare(strict_types=1);

function parsePort(string $v): int
{
    if (!ctype_digit($v)) {
        throw new InvalidArgumentException("bad port: $v");
    }
    return (int) $v;
}

try {
    echo parsePort("8080"), "\\n";
    echo parsePort("80a"), "\\n";
} catch (InvalidArgumentException $e) {
    echo "error: ", $e->getMessage(), "\\n";
} finally {
    echo "done\\n";
}`,
    },
    {
      title: "اكتب: عوامل الـ null",
      lang: "php",
      code: `<?php
$config = ['debug' => false, 'name' => null];

$name = $config['name'] ?? 'app';
$mode = $config['mode'] ?? 'prod';
$config['limit'] ??= 50;

echo $name, " ", $mode, " ", $config['limit'], "\\n";
echo $config['user']?->id ?? 'no user', "\\n";`,
    },
    {
      title: "اكتب: match و custom exception",
      lang: "php",
      code: `<?php
declare(strict_types=1);

function statusText(int $code): string
{
    return match ($code) {
        200 => 'OK',
        404 => throw new RuntimeException('page missing'),
        default => 'Other',
    };
}

try {
    echo statusText(200), "\\n";
    echo statusText(404), "\\n";
} catch (RuntimeException $e) {
    echo get_class($e), ": ", $e->getMessage(), "\\n";
}`,
      note: "في <code>match</code> الـ arm ممكن يرمي exception لأن <code>throw</code> بقت تعبير في PHP 8.",
    },
  ],

  tasks: [
    {
      title: "قسمة آمنة بـ exception",
      lang: "php",
      prompt: "<p>اكتب exception class اسمه <code>ZeroDivisionException</code> بيمتد من <code>InvalidArgumentException</code>، ودالة <code>safeDivide(float $a, float $b): float</code> بترميه لو <code>$b == 0.0</code>. وبعدها اكتب <code>tryDivide</code> بتنادي <code>safeDivide</code> وترجع النتيجة، أو <code>null</code> لو حصل الاستثناء.</p>",
      examples: [
        { in: "tryDivide(10.0, 4.0)", out: "2.5" },
        { in: "tryDivide(1.0, 0.0)", out: "null" },
      ],
      starter: `<?php
declare(strict_types=1);

class ZeroDivisionException extends InvalidArgumentException
{
}

function safeDivide(float $a, float $b): float
{
    // your code
}

function tryDivide(float $a, float $b): ?float
{
    // your code
}`,
      hints: [
        "ارمي بـ <code>throw new ZeroDivisionException('...')</code> قبل ما تقسم.",
        "<code>tryDivide</code> بتحط النداء في <code>try</code> وتمسك <code>ZeroDivisionException</code> وترجع <code>null</code>.",
      ],
      solution: `<?php
declare(strict_types=1);

class ZeroDivisionException extends InvalidArgumentException
{
}

function safeDivide(float $a, float $b): float
{
    if ($b === 0.0) {
        throw new ZeroDivisionException("Cannot divide $a by zero");
    }
    return $a / $b;
}

function tryDivide(float $a, float $b): ?float
{
    try {
        return safeDivide($a, $b);
    } catch (ZeroDivisionException) {
        return null;
    }
}

var_dump(tryDivide(10.0, 4.0));
var_dump(tryDivide(1.0, 0.0));`,
      explain: "من PHP 8.0 تقدر تكتب <code>catch (ZeroDivisionException)</code> من غير متغير لو مش محتاجه. بنمسك النوع المحدد بس، مش <code>Throwable</code>، عشان ميخفيش أخطاء تانية. ولاحظ إن PHP 8 أصلا بترمي <code>DivisionByZeroError</code> عند <code>/ 0</code>، لكن الاستثناء المخصص بيعبر عن قاعدة التطبيق.",
    },
    {
      title: "قراءة آمنة من config متداخل",
      lang: "php",
      prompt: "<p>اكتب دالة <code>cityOf(array $user): string</code> بترجع <code>$user['address']['city']</code> لو موجودة، وإلا <code>'unknown'</code>. القيمة <code>0</code> أو <code>'0'</code> لازم تتحسب كمدينة صحيحة (متستخدمش <code>empty</code>). المفاتيح ممكن تكون ناقصة في أي مستوى.</p>",
      examples: [
        { in: "cityOf(['address' => ['city' => 'Cairo']])", out: "Cairo" },
        { in: "cityOf([])", out: "unknown" },
        { in: "cityOf(['address' => ['city' => '0']])", out: "0" },
      ],
      hints: [
        "<code>??</code> شغالة على مفاتيح متداخلة من غير warning حتى لو مستوى منهم مش موجود.",
        "<code>return $user['address']['city'] ?? 'unknown';</code>",
      ],
      solution: `<?php
declare(strict_types=1);

function cityOf(array $user): string
{
    return (string) ($user['address']['city'] ?? 'unknown');
}

echo cityOf(['address' => ['city' => 'Cairo']]), "\\n";
echo cityOf([]), "\\n";
echo cityOf(['address' => ['city' => '0']]), "\\n";`,
      explain: "<code>??</code> بتفحص كل مستوى وبترجع الـ default لو أي واحد مش موجود أو null، ومن غير warning. ومبتعتبرش <code>'0'</code> فاضية زي ما <code>empty</code> بتعمل. الـ <code>(string)</code> للأمان لو القيمة جاية رقم.",
    },
    {
      title: "تصنيف باستخدام match",
      lang: "php",
      prompt: "<p>اكتب دالة <code>bucket(int $score): string</code> بترجع <code>'A'</code> لو الدرجة 90 أو أكتر، <code>'B'</code> لو 80 لـ 89، <code>'C'</code> لو 70 لـ 79، وإلا <code>'F'</code>. استخدم <code>match(true)</code>.</p>",
      examples: [
        { in: "bucket(95)", out: "A" },
        { in: "bucket(80)", out: "B" },
        { in: "bucket(10)", out: "F" },
      ],
      hints: [
        "<code>match (true) { $score >= 90 => 'A', ... }</code>",
        "حط <code>default => 'F'</code> في الآخر.",
      ],
      solution: `<?php
declare(strict_types=1);

function bucket(int $score): string
{
    return match (true) {
        $score >= 90 => 'A',
        $score >= 80 => 'B',
        $score >= 70 => 'C',
        default => 'F',
    };
}

echo bucket(95), bucket(80), bucket(75), bucket(10), "\\n";`,
      explain: "<code>match(true)</code> بتجرّب كل arm بالترتيب وأول شرط بيرجع <code>true</code> (بالمقارنة الصارمة <code>===</code> مع <code>true</code>) بيكسب. فالترتيب مهم: الأعلى الأول. الـ <code>default</code> بيحمي من <code>UnhandledMatchError</code>.",
    },
  ],

  quiz: [
    {
      q: "الناتج في PHP 8؟",
      code: { lang: "php", src: `<?php
var_dump(0 == "abc");` },
      options: ["bool(true)", "bool(false)", "Warning", "TypeError"],
      answer: 1,
      why: "في PHP 8 لما بتقارن رقم بنص مش رقمي، الرقم بيتحول لنص وبتتقارن كنصوص (<code>\"0\" == \"abc\"</code>) فالنتيجة false. في PHP 7 كانت true لأن النص بيتحول لصفر.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
var_dump("10" == "1e1");` },
      options: ["bool(true)", "bool(false)", "Warning", "NULL"],
      answer: 0,
      why: "الاتنين نصوص رقمية، فـ PHP بتقارنهم كأرقام: 10 == 10. وده سبب إننا نستخدم <code>===</code> مع الـ ids والـ tokens.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
$page = 0;
echo $page ?? 1;
echo $page ?: 1;` },
      answer: ["01"],
      why: "<code>??</code> بتفحص null بس والصفر مش null فبتطبع 0. <code>?:</code> بتعتبر الصفر falsy فبترجع 1.",
    },
    {
      q: "أنهي catch بيمسك <code>DivisionByZeroError</code>؟",
      options: [
        "<code>catch (Exception $e)</code>",
        "<code>catch (RuntimeException $e)</code>",
        "<code>catch (Throwable $e)</code>",
        "<code>catch (InvalidArgumentException $e)</code>",
      ],
      answer: 2,
      why: "<code>DivisionByZeroError</code> امتداد لـ <code>Error</code> مش <code>Exception</code>، فالـ catch للـ Exception وفروعها مبتمسكهوش. <code>Throwable</code> بتغطي الاتنين.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
function f(): string
{
    try {
        return "try";
    } finally {
        echo "finally ";
    }
}
echo f();` },
      options: ["try", "finally", "finally try", "try finally"],
      answer: 2,
      why: "قيمة الـ return بتتحسب، بس قبل ما الدالة ترجع الـ <code>finally</code> بيشتغل ويطبع <code>finally </code>، وبعدها <code>echo f()</code> تطبع <code>try</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
$v = "0";
echo empty($v) ? "empty" : "not empty";` },
      options: ["empty", "not empty", "Warning", "خطأ"],
      answer: 0,
      why: "النص <code>\"0\"</code> falsy في PHP، فـ <code>empty('0')</code> بترجع true. لكن <code>\"0.0\"</code> مثلا truthy.",
    },
    {
      q: "إيه اللي بيحصل هنا؟",
      code: { lang: "php", src: `<?php
$x = 3;
echo match ($x) {
    1 => 'one',
    2 => 'two',
};` },
      options: ["بيطبع نص فاضي", "بيطبع null", "UnhandledMatchError", "بيطبع one"],
      answer: 2,
      why: "الـ match ملزوم يغطي كل القيم، ولو مفيش arm بيطابق ومفيش default بيرمي <code>UnhandledMatchError</code>. ده عكس switch اللي بيسكت.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
$a = ['x' => null];
var_dump(isset($a['x']), array_key_exists('x', $a));` },
      options: [
        "bool(true) bool(true)",
        "bool(false) bool(true)",
        "bool(true) bool(false)",
        "bool(false) bool(false)",
      ],
      answer: 1,
      why: "<code>isset</code> بترجع false لو القيمة null حتى لو المفتاح موجود، و<code>array_key_exists</code> بتفحص وجود المفتاح بس فبترجع true.",
    },
    {
      q: "أنهي سطر أنسب لقراءة <code>$user->profile->city</code> لو <code>profile</code> ممكن يبقى null؟",
      options: [
        "<code>$user->profile->city</code> من غير أي حماية",
        "<code>$user->profile?->city ?? 'x'</code>",
        "<code>$user?->profile->city</code>",
        "<code>empty($user->profile) ?: $user->profile->city</code>",
      ],
      answer: 1,
      why: "<code>?-></code> بتوقف السلسلة وترجع null لو <code>profile</code> null، و<code>??</code> بتديك القيمة البديلة. الاختيار التالت بيحمي <code>$user</code> بس مش <code>profile</code>.",
    },
  ],
};
