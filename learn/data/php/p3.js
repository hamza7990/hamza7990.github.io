window.LEVELS = window.LEVELS || {};
window.LEVELS["php/p3"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "Laravel كله كلاسات: Controller و Model و Job",
      en: "Why OOP matters for Laravel",
      body: "<p>كل حاجة في Laravel كلاس: الـ controller والـ model والـ middleware والـ job والـ policy والـ form request. والـ framework نفسه بيعتمد على interfaces وdependency injection. لو مش مرتاح مع الـ OOP، الـ framework هيبان سحر. ولو مرتاح، هتفهم الكود قبل ما تشغله.</p>",
      points: [
        "الكلاس قالب، والـ object نسخة منه فيها بيانات خاصة بيها.",
        "الـ interface عقد: بيقول إيه الـ methods اللي لازم تكون موجودة من غير ما يقول إزاي.",
        "الـ trait بيشارك كود بين كلاسات مش بينهم وراثة. الـ enum بيمثل مجموعة قيم ثابتة.",
      ],
    },
    {
      title: "الكلاس والـ constructor والـ visibility",
      en: "Classes and constructor property promotion",
      body: "<p>من PHP 8.0 تقدر تعرّف الـ property وتعيّنها من الـ constructor في سطر واحد، بحط الـ visibility قدام الـ parameter. ده اسمه <b>constructor property promotion</b> وهو الشكل المعتاد في الكود الحديث.</p>",
      code: {
        lang: "php",
        title: "Account.php",
        src: `<?php
declare(strict_types=1);

class Account
{
    private array $log = [];

    public function __construct(
        public readonly string $owner,
        private float $balance = 0.0,
    ) {
    }

    public function deposit(float $amount): void
    {
        $this->balance += $amount;
        $this->log[] = "deposit $amount";
    }

    public function balance(): float
    {
        return $this->balance;
    }
}

$acc = new Account('Hamza', 100.0);
$acc->deposit(50.0);
echo $acc->owner, " ", $acc->balance(), "\\n";   // Hamza 150
// echo $acc->balance;   // Error: cannot access private property`,
        note: "<code>$this</code> هو الـ object الحالي. الـ visibility: <code>public</code> من أي مكان، <code>protected</code> للكلاس والـ children، <code>private</code> للكلاس نفسه بس.",
      },
      terms: [
        ["constructor promotion", "تعريف الـ property داخل الـ constructor", "<code>public string $name</code> في الـ parameters بتعمل الـ property وتعيّنها."],
        ["encapsulation", "التغليف", "نخبي الـ state (private) ونسيب methods تتحكم فيه، عشان محدش يكسر القواعد."],
      ],
      interview: [
        { q: "إيه هو constructor property promotion؟", a: "من PHP 8.0 بدل ما تكتب property وتعيّنها بإيدك في الـ constructor، بتحط الـ visibility قدام الـ parameter: <code>public function __construct(private string $name) {}</code>. PHP بتعمل الـ property وتعيّن القيمة تلقائيا. بيقلل الـ boilerplate، وأغلب الـ classes الحديثة في Laravel بتستخدمه لحقن الـ dependencies." },
      ],
    },
    {
      title: "static و self و static",
      en: "Static members and late static binding",
      body: "<p>الـ <code>static</code> property أو method تخص الكلاس مش الـ object، وبتتنادى بـ <code>Class::name</code>. جوه الكلاس: <code>self::</code> بتشاور على الكلاس اللي كتبت فيه الكود، و<code>static::</code> بتشاور على الكلاس اللي اتنادى فعلا وقت التشغيل (<b>late static binding</b>).</p>",
      code: {
        lang: "php",
        src: `<?php
class Model
{
    protected static string $table = 'models';

    public static function table(): string
    {
        return static::$table;       // resolved at run time
    }

    public static function selfTable(): string
    {
        return self::$table;         // always Model::$table
    }

    public static function make(): static
    {
        return new static();         // creates the called class
    }
}

class User extends Model
{
    protected static string $table = 'users';
}

echo User::table(), "\\n";         // users
echo User::selfTable(), "\\n";     // models
echo get_class(User::make()), "\\n";   // User`,
        note: "ده بالظبط اللي بيخلي <code>User::find(1)</code> في Eloquent تعرف إنها بتشتغل على جدول users: الـ base Model بتستخدم <code>static</code>.",
      },
      interview: [
        { q: "إيه الفرق بين <code>self</code> و <code>static</code>؟", a: "<code>self</code> بتتحدد وقت الكتابة: دايما الكلاس اللي الكود مكتوب فيه. <code>static</code> بتتحدد وقت التشغيل: الكلاس اللي اتنادى عليه فعلا، وده اسمه late static binding. لو الـ parent عنده <code>new self()</code> هيرجع دايما الـ parent، لكن <code>new static()</code> هيرجع الـ child لو اتنادى منه. وبيستخدمه الـ factory methods و Eloquent." },
      ],
    },
    {
      title: "الـ interface: عقد من غير تنفيذ",
      en: "Interfaces",
      body: "<p>الـ interface بيعدد الـ methods اللي لازم أي كلاس بينفذه يعملها. الكلاس ممكن ينفذ أكتر من interface. والكود اللي بيستخدمه بيعتمد على الـ interface مش على كلاس معين، فتقدر تبدّل التنفيذ (مثلا بوابة دفع حقيقية بوحدة تجريبية للاختبار).</p>",
      code: {
        lang: "php",
        src: `<?php
interface PaymentGateway
{
    public function charge(int $cents): bool;
}

class StripeGateway implements PaymentGateway
{
    public function charge(int $cents): bool
    {
        return $cents > 0;           // pretend to call the API
    }
}

class FakeGateway implements PaymentGateway
{
    public function charge(int $cents): bool
    {
        return true;
    }
}

class Checkout
{
    public function __construct(private PaymentGateway $gateway)
    {
    }

    public function pay(int $cents): string
    {
        return $this->gateway->charge($cents) ? 'paid' : 'failed';
    }
}

echo (new Checkout(new StripeGateway()))->pay(500), "\\n";   // paid
echo (new Checkout(new FakeGateway()))->pay(0), "\\n";       // paid`,
        note: "الـ <code>Checkout</code> مبتعرفش أي تنفيذ. ده أساس الـ dependency injection والـ service container في Laravel: بتربط interface بتنفيذ واحد في مكان واحد.",
      },
    },
    {
      title: "Abstract class مقابل interface",
      en: "Abstract classes",
      body: "<p>الـ <code>abstract class</code> مينفعش تعمل منه object مباشرة. بيحتوي كود مشترك جاهز وكمان methods مجردة (<code>abstract</code>) لازم الـ children تنفذها. الكلاس بيورّث من parent واحد بس (<code>extends</code>) لكن ينفذ interfaces كتير.</p>",
      code: {
        lang: "php",
        src: `<?php
abstract class Shape
{
    abstract public function area(): float;

    public function describe(): string
    {
        return static::class . " area " . round($this->area(), 2);
    }
}

class Circle extends Shape
{
    public function __construct(private float $r)
    {
    }

    public function area(): float
    {
        return M_PI * $this->r ** 2;
    }
}

class Rect extends Shape
{
    public function __construct(
        private float $w,
        private float $h,
    ) {
    }

    public function area(): float
    {
        return $this->w * $this->h;
    }
}

echo (new Circle(1.0))->describe(), "\\n";    // Circle area 3.14
echo (new Rect(2.0, 3.0))->describe(), "\\n"; // Rect area 6`,
      },
      focus: [{ label: "امتى أستخدم أنهي", text: "interface لما أبغى عقد بس ويتنفذ بكلاسات متفرقة. abstract class لما فيه كود مشترك وحالة (properties) والـ children كلها من نفس العيلة." }],
      interview: [
        { q: "إيه الفرق بين interface و abstract class؟", a: "الـ interface عقد بس: methods من غير جسم (وثوابت)، ومفيهوش state، والكلاس ينفذ أكتر من واحد. الـ abstract class ممكن يحتوي properties وmethods جاهزة وmethods مجردة، لكن الكلاس يورّث من واحد بس. بستخدم interface لتحديد «إيه اللي ينفع يتعمل» (مثلا <code>Payable</code>) وabstract class لما فيه جزء كود مشترك فعلا بين نوع واحد من الكلاسات." },
      ],
    },
    {
      title: "الـ trait: مشاركة كود بدون وراثة",
      en: "Traits",
      body: "<p>PHP مفيهاش multiple inheritance، فالـ <code>trait</code> بيحل مشكلة مشاركة كود (methods وproperties) بين كلاسات مش من نفس العيلة. بتحطه جوه الكلاس بـ <code>use</code>، وكأن الكود اتنسخ جواه.</p>",
      code: {
        lang: "php",
        src: `<?php
trait HasTimestamps
{
    private ?string $createdAt = null;

    public function touch(): void
    {
        $this->createdAt = "2026-01-01";
    }

    public function createdAt(): ?string
    {
        return $this->createdAt;
    }
}

class Post
{
    use HasTimestamps;
}

class Comment
{
    use HasTimestamps;
}

$p = new Post();
$p->touch();
echo $p->createdAt(), "\\n";          // 2026-01-01
echo (new Comment())->createdAt() ?? 'none', "\\n";   // none`,
        note: "في Laravel: <code>use HasFactory, SoftDeletes, Notifiable;</code> في الـ model كلها traits. الـ trait مش type: مينفعش تعمل type hint بيه.",
      },
      pitfall: "لو كلاسين فيهم نفس اسم الـ method من traits مختلفة هيحصل conflict، وتحله بـ <code>insteadof</code> أو <code>as</code>. ومتحطش في الـ trait منطق أعمال تقيل: بيصعّب التتبع والاختبار.",
    },
    {
      title: "الـ enum: قيم ثابتة بأمان",
      en: "Enums (PHP 8.1)",
      body: "<p>الـ <code>enum</code> (من PHP 8.1) بيعرّف نوع بعدد محدود من القيم. الـ pure enum قيمه من غير قيمة مخزنة. الـ <b>backed enum</b> كل case ليه قيمة <code>string</code> أو <code>int</code> بتتخزن في الداتابيز، وبنحوّل منها بـ <code>from</code> و<code>tryFrom</code>.</p>",
      code: {
        lang: "php",
        src: `<?php
enum Suit
{
    case Hearts;
    case Spades;
}

enum OrderStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Waiting',
            self::Paid => 'Done',
        };
    }
}

$s = OrderStatus::from('paid');
echo $s->name, " ", $s->value, " ", $s->label(), "\\n";   // Paid paid Done
var_dump(OrderStatus::tryFrom('nope'));                  // NULL
echo count(OrderStatus::cases()), "\\n";                 // 2
var_dump($s === OrderStatus::Paid);                      // true
echo Suit::Hearts->name, "\\n";                           // Hearts`,
        note: "<code>from('x')</code> بترمي <code>ValueError</code> لو القيمة غلط، و<code>tryFrom</code> بترجع <code>null</code>. في Eloquent تقدر تعمل cast لعمود لـ enum: <code>'status' => OrderStatus::class</code>.",
      },
      interview: [
        { q: "إيه الفرق بين pure enum و backed enum، وإيه الفرق بين <code>from</code> و <code>tryFrom</code>؟", a: "الـ pure enum بيعرّف cases من غير قيمة، بتقارنها بـ <code>===</code>. الـ backed enum (<code>enum Status: string</code>) كل case ليه قيمة scalar، وده اللي بيتخزن في الداتابيز أو JSON. <code>Status::from('paid')</code> بيحوّل القيمة لـ case وبيرمي <code>ValueError</code> لو مش موجودة، و<code>tryFrom</code> بيرجع <code>null</code> بدل الخطأ، فبنستخدمه مع input المستخدم." },
      ],
    },
    {
      title: "readonly و value objects و magic methods",
      en: "Readonly, value objects, __toString",
      body: "<p>الـ <code>readonly</code> property (من 8.1) بتتعيّن مرة واحدة وبعدها مينفعش تتغير. بيها نبني <b>value object</b>: object غير متغير بيتقارن بقيمته مش بهويته (زي مبلغ مالي أو إيميل). الـ magic methods زي <code>__construct</code> و<code>__toString</code> بتتنادى تلقائي في مواقف معينة.</p>",
      code: {
        lang: "php",
        src: `<?php
declare(strict_types=1);

final class Money
{
    public function __construct(
        public readonly int $cents,
        public readonly string $currency = 'SAR',
    ) {
    }

    public function plus(Money $other): static
    {
        return new static($this->cents + $other->cents, $this->currency);
    }

    public function __toString(): string
    {
        return sprintf("%.2f %s", $this->cents / 100, $this->currency);
    }
}

$a = new Money(1050);
$b = $a->plus(new Money(250));
echo $a, " | ", $b, "\\n";        // 10.50 SAR | 13.00 SAR
// $a->cents = 1;                 // Error: cannot modify readonly property

var_dump(new Money(100) == new Money(100));    // true  (same values)
var_dump(new Money(100) === new Money(100));   // false (different objects)`,
        note: "<code>plus</code> مبتعدّلش الأصل، بترجع object جديد. <code>==</code> بتقارن الـ properties، و<code>===</code> بتقارن الهوية (نفس الـ instance).",
      },
      terms: [
        ["__construct", "الـ constructor", "بيتنادى مرة واحدة وقت <code>new</code>."],
        ["__toString", "التحويل لنص", "بيتنادى لما الـ object يتستخدم كنص: <code>echo $obj</code>."],
        ["value object", "كائن قيمة", "غير متغير، وبيتقارن بالمحتوى، وبيعبر عن مفهوم صغير (Money, Email)."],
      ],
      pitfall: "الـ <code>readonly</code> property لازم يكون ليها نوع (<code>public readonly string $x</code>) ومينفعش تتعيّن غير من داخل الكلاس. وتغيير القيمة بيرمي <code>Error</code>. ومتفرطش في الـ magic methods (<code>__get</code> و<code>__call</code>): بتخبي الكود عن الـ IDE، مع إن Laravel بتستخدمها بكتير.",
      interview: [
        { q: "إيه هو الـ value object وليه نستخدمه؟", a: "كائن غير متغير (immutable) بيمثل قيمة زي <code>Money</code> أو <code>Email</code>، ومتساويه بتتحدد بمحتواه مش بهويته. بنبنيه بـ <code>readonly</code> properties. فايدته إنه بيحط قواعد التحقق في مكان واحد (الـ constructor بيرفض إيميل غلط) ومحدش يقدر يعدله بالغلط بعد كده، فبيقلل bugs التعديل المفاجئ." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: كلاس بـ constructor promotion",
      lang: "php",
      code: `<?php
declare(strict_types=1);

class Product
{
    public function __construct(
        public readonly string $name,
        private int $price,
    ) {
    }

    public function price(): int
    {
        return $this->price;
    }
}`,
    },
    {
      title: "اكتب: interface و implements",
      lang: "php",
      code: `<?php
interface Notifier
{
    public function send(string $msg): string;
}

class EmailNotifier implements Notifier
{
    public function send(string $msg): string
    {
        return "email: $msg";
    }
}

$n = new EmailNotifier();
echo $n->send("hello"), "\\n";`,
    },
    {
      title: "اكتب: backed enum و match",
      lang: "php",
      code: `<?php
enum Status: string
{
    case Pending = 'pending';
    case Paid = 'paid';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Waiting',
            self::Paid => 'Done',
        };
    }
}

echo Status::from('paid')->label(), "\\n";
echo Status::tryFrom('x')?->label() ?? 'unknown', "\\n";`,
    },
  ],

  tasks: [
    {
      title: "كلاس Counter بسيط",
      lang: "php",
      prompt: "<p>اكتب كلاس <code>Counter</code> بـ constructor property promotion: <code>private int $count = 0</code>. فيه method <code>increment(): static</code> بتزود واحد وترجع <code>$this</code> (عشان التسلسل)، و<code>value(): int</code>.</p>",
      examples: [
        { in: "(new Counter())->increment()->increment()->value()", out: "2" },
        { in: "(new Counter(10))->increment()->value()", out: "11" },
      ],
      starter: `<?php
declare(strict_types=1);

class Counter
{
    // your code
}`,
      hints: [
        "الـ constructor: <code>public function __construct(private int $count = 0) {}</code>.",
        "ارجع <code>$this</code> من <code>increment</code> وخلي نوع الإرجاع <code>static</code>.",
      ],
      solution: `<?php
declare(strict_types=1);

class Counter
{
    public function __construct(private int $count = 0)
    {
    }

    public function increment(): static
    {
        $this->count++;
        return $this;
    }

    public function value(): int
    {
        return $this->count;
    }
}

echo (new Counter())->increment()->increment()->value(), "\\n";
echo (new Counter(10))->increment()->value(), "\\n";`,
      explain: "إرجاع <code>$this</code> بيسمح بالتسلسل (fluent interface) اللي بتشوفه في Laravel: <code>$query->where(...)->orderBy(...)</code>. النوع <code>static</code> بيضمن إن الـ child classes ترجع نفسها مش الـ parent.",
    },
    {
      title: "interface و كلاسين",
      lang: "php",
      prompt: "<p>عرّف <code>interface Discount</code> فيه <code>apply(int $cents): int</code>. اعمل كلاس <code>PercentDiscount</code> (constructor بياخد <code>int $percent</code>، وبيرجع المبلغ بعد الخصم) وكلاس <code>NoDiscount</code>. وبعدين دالة <code>finalPrice(int $cents, Discount $d): int</code> بتستخدمه. لف المبلغ لأقرب رقم صحيح بـ <code>intdiv</code> أو <code>(int) round(...)</code>.</p>",
      examples: [
        { in: "finalPrice(2000, new PercentDiscount(25))", out: "1500" },
        { in: "finalPrice(2000, new NoDiscount())", out: "2000" },
      ],
      hints: [
        "الـ interface بتحط الـ signature بس من غير جسم.",
        "الخصم: <code>$cents - intdiv($cents * $this->percent, 100)</code>.",
      ],
      solution: `<?php
declare(strict_types=1);

interface Discount
{
    public function apply(int $cents): int;
}

class PercentDiscount implements Discount
{
    public function __construct(private int $percent)
    {
    }

    public function apply(int $cents): int
    {
        return $cents - intdiv($cents * $this->percent, 100);
    }
}

class NoDiscount implements Discount
{
    public function apply(int $cents): int
    {
        return $cents;
    }
}

function finalPrice(int $cents, Discount $d): int
{
    return $d->apply($cents);
}

echo finalPrice(2000, new PercentDiscount(25)), "\\n";
echo finalPrice(2000, new NoDiscount()), "\\n";`,
      explain: "<code>finalPrice</code> بتعتمد على الـ interface فتقدر تضيف أنواع خصم جديدة من غير ما تلمسها (open/closed principle). بنشتغل بالـ cents كأعداد صحيحة عشان نتجنب مشاكل الـ float في الفلوس.",
    },
    {
      title: "enum بحالات وانتقالات",
      lang: "php",
      prompt: "<p>اعمل <code>enum OrderStatus: string</code> بالحالات <code>Pending='pending'</code> و<code>Paid='paid'</code> و<code>Shipped='shipped'</code>. أضف method <code>canMoveTo(self $next): bool</code> بترجع true بس لو الانتقال Pending ثم Paid، أو Paid ثم Shipped. استخدم <code>match</code>.</p>",
      examples: [
        { in: "OrderStatus::Pending->canMoveTo(OrderStatus::Paid)", out: "true" },
        { in: "OrderStatus::Pending->canMoveTo(OrderStatus::Shipped)", out: "false" },
      ],
      hints: [
        "<code>match ($this)</code> وكل case يرجع شرط على <code>$next</code>.",
        "المقارنة بين cases بـ <code>===</code> أو <code>match(true)</code>.",
      ],
      solution: `<?php
declare(strict_types=1);

enum OrderStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Shipped = 'shipped';

    public function canMoveTo(self $next): bool
    {
        return match ($this) {
            self::Pending => $next === self::Paid,
            self::Paid => $next === self::Shipped,
            self::Shipped => false,
        };
    }
}

var_dump(OrderStatus::Pending->canMoveTo(OrderStatus::Paid));
var_dump(OrderStatus::Pending->canMoveTo(OrderStatus::Shipped));`,
      explain: "الـ enum cases هي singleton فالمقارنة بـ <code>===</code> آمنة. الـ <code>match</code> بيرمي <code>UnhandledMatchError</code> لو نسيت case، فبيحميك لما تضيف حالة جديدة وتنسى تعالجها.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
class A
{
    public static function make(): string
    {
        return static::class;
    }
}
class B extends A {}
echo B::make();` },
      options: [
        "A",
        "static",
        "B",
        "خطأ",
      ],
      answer: 2,
      why: "<code>static::class</code> بتحل على الكلاس اللي اتنادى فعلا (B) وقت التشغيل (late static binding). <code>self::class</code> كانت هتطبع A.",
    },
    {
      q: "إيه اللي بيحصل؟",
      code: { lang: "php", src: `<?php
class P
{
    public function __construct(public readonly int $x)
    {
    }
}
$p = new P(1);
$p->x = 2;` },
      options: [
        "Error: Cannot modify readonly property",
        "x بتفضل 1 من غير خطأ",
        "x بتبقى 2",
        "Warning بس",
      ],
      answer: 0,
      why: "الـ <code>readonly</code> property بتتعيّن مرة واحدة، وأي محاولة تعديل (حتى من برا الكلاس) بترمي <code>Error</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
enum S: string
{
    case A = 'a';
    case B = 'b';
}
var_dump(S::tryFrom('z'));` },
      answer: ["NULL", "null"],
      why: "<code>tryFrom</code> بترجع <code>null</code> لو القيمة مش موجودة، و<code>from</code> هي اللي كانت هترمي <code>ValueError</code>. الـ <code>var_dump</code> بتطبع <code>NULL</code>.",
    },
    {
      q: "ليه الكود ده بيفشل؟",
      code: { lang: "php", src: `<?php
interface Logger
{
    public function log(string $m): void;
}
class FileLogger implements Logger
{
    public function write(string $m): void
    {
    }
}
new FileLogger();` },
      options: [
        "لأن الـ interface لازم يتنفذ بـ extends",
        "لأن الـ constructor مش موجود",
        "لأن void مش مسموحة في interface",
        "لأن FileLogger مش بتنفذ method الـ log الموجودة في الـ interface",
      ],
      answer: 3,
      why: "الكلاس اللي بينفذ interface لازم يعرّف كل methods العقد. هنا <code>log</code> مش موجودة، فبيحصل Fatal error وقت تحميل الكلاس. والكلمة الصح هي <code>implements</code> والاستخدام سليم.",
    },
    {
      q: "أنهي واحدة صح عن الـ trait؟",
      options: [
        "ينفع أعمل <code>new</code> من trait",
        "الكلاس ينفع يستخدم أكتر من trait",
        "الـ trait هو type ينفع أستخدمه كـ type hint",
        "الـ trait بيعمل وراثة من الكلاس",
      ],
      answer: 1,
      why: "الكلاس يقدر يعمل <code>use A, B;</code> لأكتر من trait. الـ trait مينفعش يتعمل منه object ومش type للـ hinting، وهو مجرد نسخ للكود جوه الكلاس مش وراثة.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
final class Money
{
    public function __construct(public readonly int $c)
    {
    }
}
var_dump(new Money(5) == new Money(5));
var_dump(new Money(5) === new Money(5));` },
      options: [
        "true ثم true",
        "false ثم false",
        "true ثم false",
        "false ثم true",
      ],
      answer: 2,
      why: "<code>==</code> بتقارن الكلاس وقيم الـ properties فبترجع true. <code>===</code> بتقارن الهوية (نفس الـ instance) وهم object-ين مختلفين فبترجع false.",
    },
    {
      q: "إيه الفرق الأساسي بين abstract class و interface؟",
      options: [
        "الـ interface بتقبل properties والـ abstract لأ",
        "مفيش فرق، الاتنين نفس الشيء",
        "الـ abstract class ينفع نعمل منها object",
        "الكلاس ينفذ أكتر من interface، لكن يورّث من abstract class واحد بس",
      ],
      answer: 3,
      why: "الـ interface عقد من غير state وممكن ننفذ منها كتير. الـ abstract class ممكن فيها properties وكود جاهز لكن وراثة واحدة. ومينفعش نعمل منها object.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
class P
{
    public static function create(): P
    {
        return new self();
    }
}
class C extends P {}
echo get_class(C::create());` },
      answer: ["P"],
      why: "<code>new self()</code> بتعمل object من الكلاس اللي الكود مكتوب فيه (P) حتى لو اتنادى من C. لو استخدمنا <code>new static()</code> كان هيطلع C.",
    },
    {
      q: "ليه بنفضل <code>private int $price</code> مع method بدل <code>public int $price</code>؟",
      options: [
        "لأن الـ object يحمي حالته ويتحكم في إزاي تتغير (encapsulation)",
        "لأن private أسرع",
        "لأن public مش مسموحة مع الأنواع",
        "لأن Laravel بتفرض كده",
      ],
      answer: 0,
      why: "التغليف بيخلي الكلاس هو المسؤول عن قواعد التغيير (مثلا السعر مينفعش يبقى سالب). ومش مسألة سرعة. و Laravel مبتفرضش ده، لكنه ممارسة OOP سليمة (والـ <code>readonly</code> بديل للحالات البسيطة).",
    },
  ],
};
