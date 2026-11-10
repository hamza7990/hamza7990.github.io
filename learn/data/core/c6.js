window.LEVELS = window.LEVELS || {};
window.LEVELS["core/c6"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "الـ encapsulation والـ abstraction: اخفي التفاصيل واكشف الضروري بس",
      en: "Encapsulation and abstraction",
      body: "<p>أي إنترفيو بيسألك «إيه هي أعمدة الـ OOP؟»، والإجابة الحفظية («أربعة: encapsulation وinheritance...») بتقع في أول سؤال متابعة. الفهم الحقيقي بيبدأ من الفرق بين أول فكرتين، لأن الناس بتخلطهم.</p><ul><li><b>Encapsulation</b>: الـ object يحمي <b>حالته (state)</b> من التغيير العشوائي. الـ field خاص، والتغيير بيعدي من methods بتتأكد إن القيمة سليمة.</li><li><b>Abstraction</b>: تكشف <b>إيه اللي الشيء بيعمله</b> وتخبي <b>إزاي</b> بيعمله. اللي بينادي يعرف الواجهة بس.</li></ul>",
      code: {
        lang: "dart",
        title: "encapsulation: السعر ميتغيرش لقيمة غلط",
        src: `class Listing {
  Listing(this.title, double price) : _price = price;

  final String title;
  double _price;

  double get price => _price;

  set price(double value) {
    if (value <= 0) throw ArgumentError('price must be positive');
    _price = value;
  }
}

void main() {
  final l = Listing('Villa', 900000);
  l.price = 950000;
  print(l.price);
  try {
    l.price = -1;
  } catch (e) {
    print(e);
  }
}`,
        note: "الناتج: <code>950000.0</code> ثم <code>Invalid argument(s): price must be positive</code>. اتجرب. في Dart الـ <code>_</code> بتخلي الاسم private على مستوى الـ <b>library (الملف)</b> مش الكلاس، وده فرق عن PHP وJava.",
      },
      terms: [
        ["encapsulation", "التغليف", "الـ state خاص، والتغيير بيعدي من methods بتفرض القواعد."],
        ["abstraction", "التجريد", "تكشف الواجهة (إيه) وتخبي التنفيذ (إزاي)."],
      ],
      pitfall: "إنك تعمل getter وsetter لكل field من غير أي منطق وتسمي ده encapsulation. لو الـ setter بيحط القيمة زي ما هي، مفيش حماية فعلية. التغليف الحقيقي إنك تحمي القواعد (السعر موجب، الحالة بتنتقل بترتيب معين).",
      interview: [
        { q: "إيه الفرق بين encapsulation وabstraction؟", a: "الـ encapsulation عن <b>حماية الـ state</b>: الـ fields خاصة والتغيير بيعدي من methods بتتحقق من القواعد، زي سعر مينفعش يبقى سالب. الـ abstraction عن <b>إخفاء التعقيد</b>: اللي بينادي بيشوف واجهة بسيطة زي <code>pay(amount)</code> ومش مهتم هل ورا الكواليس Stripe ولا بوابة تانية. الأولى بتحمي الداتا من جوه، والتانية بتبسط الاستخدام من برا." },
      ],
    },
    {
      title: "الـ inheritance والـ polymorphism",
      en: "Inheritance and polymorphism",
      body: "<p><b>Inheritance</b>: كلاس يرث state وسلوك من كلاس تاني ويضيف عليه أو يعدّل (علاقة «is-a»). <b>Polymorphism</b>: كود واحد بيتعامل مع نوع الأب، وكل object بيتصرف بطريقته هو. الفايدة الحقيقية مش الوراثة نفسها، الفايدة إنك تكتب <code>foreach</code> واحدة ومتحتاجش <code>if</code> على النوع.</p>",
      code: {
        lang: "php",
        src: `abstract class Notification
{
    public function __construct(protected string $to)
    {
    }

    abstract protected function body(): string;

    public function send(): string
    {
        return "to {$this->to}: " . $this->body();
    }
}

class OtpNotification extends Notification
{
    public function __construct(string $to, private string $code)
    {
        parent::__construct($to);
    }

    protected function body(): string
    {
        return "your code is {$this->code}";
    }
}

class OfferNotification extends Notification
{
    protected function body(): string
    {
        return 'a new listing matches your search';
    }
}

$all = [new OtpNotification('0501', '4821'), new OfferNotification('0502')];
foreach ($all as $n) {
    echo $n->send(), PHP_EOL;
}`,
        note: "الناتج سطرين: <code>to 0501: your code is 4821</code> و<code>to 0502: a new listing matches your search</code>. الـ loop بتنادي <code>send()</code> على النوع الأب، وكل واحد بينفذ <code>body()</code> بتاعه. ده الـ polymorphism.",
      },
      points: [
        "الـ <b>method overriding</b> هو شكل الـ polymorphism الشائع: الابن يعيد تعريف method الأب (runtime polymorphism).",
        "الـ polymorphism كمان بيتحقق بالـ interfaces: كلاسات مالهاش أب مشترك لكن بتنفذ نفس الواجهة.",
      ],
      pitfall: "وراثة عشان تعيد استخدام كود بس، من غير ما العلاقة «is-a» حقيقية. ساعتها أي تغيير في الأب بيكسر كل الأبناء. السؤال الاختباري: هل ينفع أستخدم الابن في أي مكان مستني الأب من غير ما يتفاجأ؟",
    },
    {
      title: "Composition أحسن من inheritance، وinterface مقابل abstract class",
      en: "Composition over inheritance, interface vs abstract class",
      body: "<p>الوراثة بتربط الابن بالأب ربط شديد (coupling) وبتدّيك شجرة واحدة بس. الـ <b>composition</b> إنك تخلي الكلاس <b>يحتوي</b> على object بيعمل الشغل («has-a») وتتكلم معاه من خلال interface. تبدّل الـ object من غير ما تغير الكلاس.</p>",
      codes: [
        {
          lang: "dart",
          title: "composition + interface",
          src: `abstract interface class Notifier {
  void send(String to, String text);
}

class SmsNotifier implements Notifier {
  @override
  void send(String to, String text) => print('SMS to $to: $text');
}

class PushNotifier implements Notifier {
  @override
  void send(String to, String text) => print('PUSH to $to: $text');
}

class OrderService {
  OrderService(this._notifier);

  final Notifier _notifier;

  void confirm(String user) => _notifier.send(user, 'order confirmed');
}

void main() {
  OrderService(SmsNotifier()).confirm('hamza');
  OrderService(PushNotifier()).confirm('hamza');
}`,
          note: "<code>OrderService</code> مبيرثش من حاجة. بياخد أي <code>Notifier</code> في الـ constructor. اتجرب: بيطبع <code>SMS to hamza: order confirmed</code> ثم <code>PUSH to hamza: order confirmed</code>.",
        },
        {
          lang: "dart",
          title: "mixin: سلوك مشترك من غير أب مشترك",
          src: `mixin Logs {
  void log(String m) => print('[LOG] $m');
}

class Downloader with Logs {
  void run() => log('download started');
}

void main() => Downloader().run();`,
          note: "الناتج: <code>[LOG] download started</code>. الـ mixin في Dart بيدّيك إعادة استخدام كود من غير شجرة وراثة.",
        },
      ],
      points: [
        "<b>Interface</b>: عقد فقط (أسماء methods وأنواعها). الكلاس ينفذ كذا interface. مفيش state ولا كود مشترك (في PHP الـ interface مفيهاش كود خالص).",
        "<b>Abstract class</b>: عقد + كود وstate مشترك. الكلاس يرث من واحد بس. استخدمه لما فيه تنفيذ جزئي حقيقي مشترك (مثل <code>send()</code> في الشريحة اللي فاتت).",
        "في Dart: <code>extends</code> وراثة، <code>implements</code> يلتزم بالعقد بس (كل كلاس له interface ضمني)، <code>with</code> يضيف mixin.",
      ],
      interview: [
        { q: "إمتى تفضل composition على inheritance؟ وإيه الفرق بين interface وabstract class؟", a: "الوراثة بتربطني بالأب وبتصعّب التغيير، فبفضل composition: الكلاس يحتوي على اعتماد من نوع interface ويتبدّل بسهولة (SMS مكان push مثلا) والاختبار بيبقى بـ fake. بستخدم الوراثة بس لما العلاقة is-a حقيقية. الـ interface عقد من غير كود وينفذ منه أي عدد، والـ abstract class بيشارك كود وstate لكن الكلاس يرث من واحد بس." },
      ],
    },
    {
      title: "Coupling وcohesion، وأول حرف في SOLID: SRP",
      en: "Coupling, cohesion and Single Responsibility",
      body: "<p><b>Cohesion</b> (الترابط الداخلي): الحاجات جوه الكلاس الواحد بتخدم غرض واحد. المطلوب <b>عالي</b>. <b>Coupling</b> (الاعتماد الخارجي): كام كلاس بيعرف تفاصيل كلاس تاني. المطلوب <b>منخفض</b>. SOLID كلها طرق تحقق ده.</p><p><b>SRP</b> (Single Responsibility): الكلاس له سبب واحد بس يتغير عشانه. مش «يعمل حاجة واحدة بس» حرفيا، لكن «كل اللي فيه بيتغير لنفس السبب».</p>",
      codes: [
        {
          lang: "php",
          title: "قبل: كلاس واحد بيعمل كل حاجة",
          src: `class ListingManager
{
    public function create(array $data): void
    {
        if (empty($data['title'])) {
            throw new InvalidArgumentException('title is required');
        }
        echo "INSERT INTO listings ({$data['title']})", PHP_EOL;
        echo "MAIL admin: new listing {$data['title']}", PHP_EOL;
    }
}

(new ListingManager())->create(['title' => 'Villa']);`,
          note: "قواعد التحقق وحفظ الداتا وإرسال الإيميل في مكان واحد. أي تغيير في واحدة فيهم بيفتح الكلاس ويخاطر بالباقي.",
        },
        {
          lang: "php",
          title: "بعد: كل مسؤولية في كلاس",
          src: `class ListingValidator
{
    public function check(array $data): void
    {
        if (empty($data['title'])) {
            throw new InvalidArgumentException('title is required');
        }
    }
}

class ListingStore
{
    public function save(array $data): void
    {
        echo "INSERT INTO listings ({$data['title']})", PHP_EOL;
    }
}

class AdminMailer
{
    public function newListing(string $title): void
    {
        echo "MAIL admin: new listing $title", PHP_EOL;
    }
}

class CreateListing
{
    public function __construct(
        private ListingValidator $validator,
        private ListingStore $store,
        private AdminMailer $mailer,
    ) {
    }

    public function handle(array $data): void
    {
        $this->validator->check($data);
        $this->store->save($data);
        $this->mailer->newListing($data['title']);
    }
}

$action = new CreateListing(new ListingValidator(), new ListingStore(), new AdminMailer());
$action->handle(['title' => 'Villa']);`,
          note: "نفس الناتج، لكن لو الإيميل اتغير لـ push notification تعدل <code>AdminMailer</code> بس. اتجرب.",
        },
      ],
      pitfall: "المبالغة: كلاس لكل سطر كود. SRP مش هدف في حد ذاته. لو ملقيتش سببين مختلفين للتغيير، سيب الكلاس واحد.",
    },
    {
      title: "Open/Closed: ضيف سلوك جديد من غير ما تعدل القديم",
      en: "Open/Closed Principle",
      body: "<p>الكلاس مفتوح للتوسعة ومقفول للتعديل. لو كل ميزة جديدة معناها تفتح دالة قديمة شغالة وتزود <code>case</code> أو <code>if</code>، فكل مرة بتخاطر بكسر اللي كان شغال. الحل إنك تعمل abstraction وتضيف تنفيذ جديد.</p>",
      codes: [
        {
          lang: "dart",
          title: "قبل: switch على النوع",
          src: `double finalPrice(double price, String type) {
  switch (type) {
    case 'none':
      return price;
    case 'percent':
      return price * 0.9;
    default:
      throw ArgumentError('unknown discount: $type');
  }
}

void main() {
  print(finalPrice(1000, 'percent'));
}`,
          note: "خصم جديد يعني تعديل <code>finalPrice</code>. الناتج <code>900.0</code>.",
        },
        {
          lang: "dart",
          title: "بعد: abstraction",
          src: `abstract interface class Discount {
  double apply(double price);
}

class PercentDiscount implements Discount {
  PercentDiscount(this.percent);

  final int percent;

  @override
  double apply(double price) => price * (100 - percent) / 100;
}

class FixedDiscount implements Discount {
  FixedDiscount(this.amount);

  final double amount;

  @override
  double apply(double price) => price - amount;
}

double finalPrice(double price, Discount d) => d.apply(price);

void main() {
  print(finalPrice(1000, PercentDiscount(10)));
  print(finalPrice(1000, FixedDiscount(150)));
}`,
          note: "<code>FixedDiscount</code> اتضاف من غير ما نلمس <code>finalPrice</code>. الناتج <code>900.0</code> ثم <code>850.0</code>. ده نفسه نمط الـ <b>Strategy</b> اللي جاي.",
        },
      ],
      interview: [
        { q: "اشرح الـ Open/Closed Principle بمثال.", a: "الكود يتوسع من غير ما نعدل اللي شغال. مثال: دالة حساب السعر فيها <code>switch</code> على نوع الخصم، وكل خصم جديد بيجبرني أفتحها. بدلها بـ interface اسمها <code>Discount</code> فيها <code>apply(price)</code>، وكل خصم كلاس، والدالة بتاخد <code>Discount</code> وخلاص. خصم جديد يعني كلاس جديد، والدالة القديمة متتلمسش ومتختبرة." },
      ],
    },
    {
      title: "Liskov وInterface Segregation",
      en: "LSP and ISP",
      body: "<p><b>LSP</b>: أي مكان بيستخدم الأب لازم يشتغل صح لو حطيت مكانه أي ابن. لو الابن بيرمي exception أو بيكسر توقعات الأب، الوراثة غلط. <b>ISP</b>: متجبرش كلاس يعتمد على methods مش محتاجها. interfaces صغيرة محددة أحسن من واحدة ضخمة.</p>",
      codes: [
        {
          lang: "dart",
          title: "LSP: الابن بيكسر وعد الأب",
          src: `class Bird {
  void fly() => print('flying');
}

class Penguin extends Bird {
  @override
  void fly() => throw UnsupportedError('penguins cannot fly');
}

void migrate(Bird b) => b.fly();

void main() {
  migrate(Bird());
  try {
    migrate(Penguin());
  } catch (e) {
    print('crashed: $e');
  }
}`,
          note: "<code>migrate</code> اشتغلت مع <code>Bird</code> ووقعت مع <code>Penguin</code>. الحل: <code>FlyingBird extends Bird</code> فيها <code>fly()</code>، والبطريق يرث من <code>Bird</code> بس.",
        },
        {
          lang: "php",
          title: "ISP: القراءة غير الكتابة",
          src: `interface ListingReader
{
    public function find(int $id): ?array;
}

interface ListingWriter
{
    public function save(array $listing): void;
}

class InMemoryListings implements ListingReader, ListingWriter
{
    private array $rows = [];

    public function find(int $id): ?array
    {
        return $this->rows[$id] ?? null;
    }

    public function save(array $listing): void
    {
        $this->rows[$listing['id']] = $listing;
    }
}

class ListingPage
{
    public function __construct(private ListingReader $listings)
    {
    }

    public function title(int $id): string
    {
        return $this->listings->find($id)['title'] ?? 'not found';
    }
}

$repo = new InMemoryListings();
$repo->save(['id' => 1, 'title' => 'Villa']);
echo (new ListingPage($repo))->title(1), PHP_EOL;
echo (new ListingPage($repo))->title(2), PHP_EOL;`,
          note: "الناتج <code>Villa</code> ثم <code>not found</code>. صفحة العرض مبتاخدش غير <code>ListingReader</code>، فمستحيل تعدل داتا بالغلط.",
        },
      ],
      focus: [{ label: "اختبار LSP", text: "لو محتاج <code>if (x is Penguin)</code> قبل ما تستخدم الأب، يبقى الوراثة دي بتخالف Liskov." }],
    },
    {
      title: "Dependency Inversion والـ dependency injection",
      en: "DIP and DI",
      body: "<p><b>DIP</b> (مبدأ): الكلاس الأعلى مستوى (منطق الشغل) يعتمد على <b>abstraction</b> مش على تنفيذ ملموس. <b>DI</b> (أسلوب): الاعتماد بيجيلك من برا بدل ما تعمل <code>new</code> جوه. <b>IoC container</b> (أداة): كلاس بيعمل الحقن لوحده، زي الـ container في Laravel.</p><p>أحسن مثال عملي: الوقت. كود بينادي <code>new DateTime()</code> جواه مستحيل تختبره بتاريخ ثابت.</p>",
      code: {
        lang: "php",
        src: `interface Clock
{
    public function now(): DateTimeImmutable;
}

class SystemClock implements Clock
{
    public function now(): DateTimeImmutable
    {
        return new DateTimeImmutable();
    }
}

class FixedClock implements Clock
{
    public function __construct(private DateTimeImmutable $at)
    {
    }

    public function now(): DateTimeImmutable
    {
        return $this->at;
    }
}

class OfferService
{
    public function __construct(private Clock $clock)
    {
    }

    public function isActive(DateTimeImmutable $endsAt): bool
    {
        return $this->clock->now() < $endsAt;
    }
}

$ends = new DateTimeImmutable('2026-12-01');
$test = new OfferService(new FixedClock(new DateTimeImmutable('2026-11-01')));
var_dump($test->isActive($ends));
$late = new OfferService(new FixedClock(new DateTimeImmutable('2026-12-02')));
var_dump($late->isActive($ends));`,
        note: "الناتج <code>bool(true)</code> ثم <code>bool(false)</code>، ثابت مهما اشتغل الاختبار إمتى. في production بتحقن <code>SystemClock</code>.",
      },
      interview: [
        { q: "إيه الفرق بين Dependency Inversion وDependency Injection؟", a: "الـ DIP مبدأ تصميم: المنطق الأساسي يعتمد على abstraction (interface) مش على تنفيذ بعينه. الـ DI تقنية: الاعتماد يتمرر للكلاس من برا (غالبا constructor) بدل ما الكلاس يعمل <code>new</code>. الـ DI هي الطريقة العملية لتحقيق DIP، والـ container (زي اللي في Laravel) أداة بتعمل الحقن أوتوماتيك. مثال: <code>OfferService</code> بياخد <code>Clock</code> فأقدر أختبره بوقت ثابت." },
      ],
    },
    {
      kicker: "الـ patterns",
      title: "Singleton وFactory وBuilder",
      en: "Singleton, Factory, Builder",
      body: "<p>الـ design pattern حل متكرر لمشكلة متكررة، له اسم عشان الفريق يتفاهم بسرعة. مش وصفة تطبقها غصب. هنمشي على اللي فعلا قابلته في Flutter وLaravel.</p>",
      codes: [
        {
          lang: "dart",
          title: "Singleton + Factory constructor",
          src: `class ApiClient {
  ApiClient._(this.baseUrl);

  static final ApiClient instance = ApiClient._('https://api.example.com');

  final String baseUrl;
}

class Listing {
  Listing({required this.title, required this.price});

  factory Listing.fromJson(Map<String, dynamic> json) => Listing(
        title: json['title'] as String,
        price: (json['price'] as num).toDouble(),
      );

  final String title;
  final double price;
}

void main() {
  print(identical(ApiClient.instance, ApiClient.instance));
  final l = Listing.fromJson({'title': 'Villa', 'price': 900000});
  print('\${l.title} \${l.price}');
}`,
          note: "الناتج <code>true</code> ثم <code>Villa 900000.0</code>. الـ constructor الخاص <code>_</code> بيمنع أي <code>new</code> من برا.",
        },
        {
          lang: "php",
          title: "Builder: سلسلة fluent",
          src: `class FilterBuilder
{
    private array $where = [];

    public function city(string $city): static
    {
        $this->where[] = "city = '$city'";
        return $this;
    }

    public function maxPrice(int $price): static
    {
        $this->where[] = "price <= $price";
        return $this;
    }

    public function build(): string
    {
        return 'SELECT * FROM listings WHERE ' . implode(' AND ', $this->where);
    }
}

echo (new FilterBuilder())->city('Riyadh')->maxPrice(900000)->build(), PHP_EOL;`,
          note: "الناتج: <code>SELECT * FROM listings WHERE city = 'Riyadh' AND price &lt;= 900000</code>. للشرح فقط: في الشغل الحقيقي القيم بتتبعت كـ bindings مش بتتركب في نص. الـ query builder في Laravel (<code>DB::table()->where()</code>) هو نفس الفكرة.",
        },
      ],
      points: [
        "<b>Singleton</b>: نسخة واحدة في التطبيق. عيوبه: global state مخفي، اختبار صعب (مبتبدلوش بـ fake بسهولة)، وفي الـ long-running processes (queue workers، Octane) أي state جواه بيتسرب بين الطلبات.",
        "<b>Factory</b>: بتبني الـ object من مكان واحد ومن شكل مختلف (JSON مثلا). <code>fromJson</code> هو أشهر مثال في Flutter.",
        "<b>Builder</b>: بتركب object معقد خطوة خطوة. في Dart غالبا named parameters بتكفي، وفي PHP/Laravel الـ fluent chain (query builder).",
      ],
      interview: [
        { q: "إيه مشاكل الـ Singleton؟ وإمتى تستخدمه؟", a: "هو global state بشكل تاني: كل كلاس بيوصله مباشرة فالاعتماد مخفي ومحدش يشوفه في الـ constructor، والاختبار صعب لأنه مينفعش أبدله بـ fake. وفي queue workers وOctane الـ process بيعيش بين الطلبات فأي state جواه بيتسرب. بستخدمه للحاجات من غير state خاص بالطلب، زي client لـ API أو مدير اتصال، والأحسن أسجله في الـ container كـ singleton وأحقنه بدل <code>Class.instance</code> في كل حتة." },
      ],
    },
    {
      title: "Repository وAdapter",
      en: "Repository and Adapter",
      body: "<p><b>Repository</b>: كلاس واحد بيخبي مصدر الداتا (API، SQLite، cache) ورا واجهة بسيطة. الـ UI أو الـ service بيسأل <code>repo.all()</code> ومش عارف الداتا جاية منين. <b>Adapter</b>: بيلف كلاس أو SDK تاني بواجهة غير متوافقة ويخليه يطابق الواجهة اللي تطبيقك عايزها.</p>",
      codes: [
        {
          lang: "dart",
          title: "Repository مع cache",
          src: `class ListingApi {
  int calls = 0;

  Future<List<String>> fetch() async {
    calls++;
    return ['Villa', 'Flat'];
  }
}

class ListingRepository {
  ListingRepository(this._api);

  final ListingApi _api;
  List<String>? _cache;

  Future<List<String>> all() async => _cache ??= await _api.fetch();
}

Future<void> main() async {
  final api = ListingApi();
  final repo = ListingRepository(api);
  await repo.all();
  await repo.all();
  print('network calls: \${api.calls}');
}`,
          note: "الناتج <code>network calls: 1</code>. الشاشة مبتعرفش إن فيه cache. تغيير المصدر لـ SQLite يتم جوه الـ repository بس.",
        },
        {
          lang: "dart",
          title: "Adapter حوالين SDK خارجي",
          src: `class VendorGeoSdk {
  Map<String, double> lookupAddress(String q) => {'lat': 24.7, 'lng': 46.7};
}

abstract interface class Geocoder {
  (double, double) locate(String address);
}

class VendorGeocoder implements Geocoder {
  VendorGeocoder(this._sdk);

  final VendorGeoSdk _sdk;

  @override
  (double, double) locate(String address) {
    final r = _sdk.lookupAddress(address);
    return (r['lat']!, r['lng']!);
  }
}

void main() {
  final Geocoder g = VendorGeocoder(VendorGeoSdk());
  final (lat, lng) = g.locate('Olaya');
  print('$lat, $lng');
}`,
          note: "الناتج <code>24.7, 46.7</code>. لو غيرت المزود تكتب adapter جديد ومتلمسش باقي التطبيق. اتجرب.",
        },
      ],
      interview: [
        { q: "إيه فايدة الـ Repository pattern؟ وفين استخدمته؟", a: "بيفصل مصدر الداتا عن باقي التطبيق. الـ UI أو الـ state management بتكلم <code>ListingRepository</code> وهو اللي يقرر يجيب من API ولا cache ولا database محلية. فالاختبار بيبدّله بـ fake، وتغيير المصدر ميلمسش الشاشات. في Flutter بيبقى بين الـ controller والـ API client، وفي Laravel بين الـ service وـ Eloquent لما المنطق يكبر. ومش بحطه لو التطبيق CRUD بسيط وEloquent كفاية." },
      ],
    },
    {
      title: "Strategy وObserver",
      en: "Strategy and Observer",
      body: "<p><b>Strategy</b>: عدة طرق لنفس الشغلانة (ترتيب، خصم، دفع) وتختار واحدة وقت التشغيل. في Dart الـ strategy ممكن تبقى مجرد دالة. <b>Observer</b>: object بيعلن عن تغيير، وأي عدد من المشتركين بيتبلغوا من غير ما هو يعرفهم. ده الـ Stream في Dart، والـ events وlisteners في Laravel.</p>",
      codes: [
        {
          lang: "dart",
          title: "Strategy كدالة",
          src: `typedef SortStrategy = List<int> Function(List<int> prices);

List<int> cheapFirst(List<int> p) => [...p]..sort();

List<int> expensiveFirst(List<int> p) => cheapFirst(p).reversed.toList();

void show(List<int> prices, SortStrategy sort) => print(sort(prices));

void main() {
  const prices = [500, 300, 900];
  show(prices, cheapFirst);
  show(prices, expensiveFirst);
}`,
          note: "الناتج <code>[300, 500, 900]</code> ثم <code>[900, 500, 300]</code>. زر «ترتيب» في الـ UI بيبدّل الدالة اللي بتتبعت.",
        },
        {
          lang: "dart",
          title: "Observer: broadcast stream",
          src: `import 'dart:async';

Future<void> main() async {
  final controller = StreamController<int>.broadcast();

  controller.stream.listen((p) => print('screen A: $p'));
  controller.stream.listen((p) => print('screen B: $p'));

  controller.add(950000);
  await controller.close();
}`,
          note: "الناتج: <code>screen A: 950000</code> ثم <code>screen B: 950000</code>. المصدر مبيعرفش مين بيسمع. في Laravel: <code>event(new ListingPublished($l))</code> وكل listener مسجل بيتنفذ.",
        },
      ],
      pitfall: "نسيان إلغاء الاشتراك. في Flutter أي <code>listen()</code> لازم ينتهي بـ <code>cancel()</code> (أو <code>StreamBuilder</code> بيعمله) وإلا فيه memory leak، والشاشة بتتحدث بعد ما اتقفلت.",
    },
    {
      title: "Facade وMVC وMVVM، وإزاي تجاوب «استخدمت patterns إيه؟»",
      en: "Facade, MVC vs MVVM and how to answer",
      body: "<p>الـ Facade الكلاسيكي (GoF) كلاس واجهة بسيط قدام نظام معقد من كذا كلاس. الـ <b>facade في Laravel</b> حاجة تانية: proxy static بيوصل لـ object من الـ container. الاسم متشابه والفكرة مختلفة.</p>",
      code: {
        lang: "php",
        title: "Facade الكلاسيكي",
        src: `class Pdf
{
    public function render(string $text): string
    {
        return "pdf($text)";
    }
}

class Mailer
{
    public function send(string $to, string $file): void
    {
        echo "sent $file to $to", PHP_EOL;
    }
}

class InvoiceFacade
{
    public function __construct(private Pdf $pdf, private Mailer $mailer)
    {
    }

    public function sendInvoice(string $to, string $text): void
    {
        $this->mailer->send($to, $this->pdf->render($text));
    }
}

(new InvoiceFacade(new Pdf(), new Mailer()))->sendInvoice('a@b.sa', 'total 500');`,
        note: "الناتج <code>sent pdf(total 500) to a@b.sa</code>. المستخدم نادى method واحدة بدل ما يعرف الاتنين.",
      },
      points: [
        "<b>MVC</b> (Laravel): الـ Controller بيستقبل الطلب ويكلم الـ Model ويرجع View. <b>MVVM</b> (شائع في Flutter مع Provider/Riverpod/Bloc): الـ View بتشترك في الـ ViewModel اللي بيحمل الـ state، ومفيش controller بيدفع الداتا للـ View.",
        "الفرق العملي: في MVC الـ Controller هو الوسيط وبيختار الـ View. في MVVM الـ ViewModel مبيعرفش حاجة عن الـ View، والـ View بتسمع على تغيير الـ state (observer).",
        "الـ facade في Laravel: <code>Cache::get()</code> = <code>app('cache')->get()</code>. بيستخدم الـ container، ومفيش كلاس بيلف نظام معقد بالمعنى الكلاسيكي.",
      ],
      focus: [{ label: "إزاي تجاوب «استخدمت patterns إيه؟»", text: "متقولش قايمة أسماء. اختار 2 أو 3 وكل واحد جملة: المشكلة، الـ pattern، فين في مشروعك. مثال: «كان عندي كذا مصدر داتا للإعلانات، فعملت <b>Repository</b> يخبي API والـ cache، والشاشات بتكلمه هو بس»." }],
      interview: [
        { q: "الـ facade في Laravel هو نفس الـ Facade pattern؟", a: "لأ. الـ Facade pattern (GoF) كلاس يبسط الاستخدام قدام نظام معقد من كذا كلاس. الـ facade في Laravel proxy static: بيعمل resolve لـ object من الـ container ويمرر الـ call له بـ <code>__callStatic</code>، فـ <code>Cache::get()</code> هو <code>app('cache')->get()</code>. الاسم متشابه بس الغرض مختلف، وده بيقابل أقرب لـ service locator ملفوف في static syntax." },
        { q: "استخدمت أنهي design patterns في مشاريعك؟", a: "بجاوب بأمثلة مش قايمة: <b>Repository</b> في تطبيق Flutter بيخبي الـ API ورا واجهة واحدة، <b>Observer</b> من خلال streams أو Provider عشان الشاشات تتحدث لما الـ state يتغير، <b>Factory</b> في <code>fromJson</code>، و<b>Strategy</b> في ترتيب وفلترة الإعلانات. وفي Laravel الـ <b>events/listeners</b> والـ <b>service container</b> (DI)، والـ query builder كـ builder. وبقول المشكلة اللي كل واحد حلها، مش الاسم بس." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: interface وتنفيذين",
      lang: "dart",
      code: `abstract interface class Discount {
  double apply(double price);
}

class PercentDiscount implements Discount {
  PercentDiscount(this.percent);

  final int percent;

  @override
  double apply(double price) => price * (100 - percent) / 100;
}`,
    },
    {
      title: "اكتب: Clock محقون",
      lang: "php",
      code: `<?php
interface Clock
{
    public function now(): DateTimeImmutable;
}

class FixedClock implements Clock
{
    public function __construct(private DateTimeImmutable $at)
    {
    }

    public function now(): DateTimeImmutable
    {
        return $this->at;
    }
}`,
    },
    {
      title: "اكتب: singleton وfactory",
      lang: "dart",
      code: `class ApiClient {
  ApiClient._(this.baseUrl);

  static final instance = ApiClient._('https://api.example.com');

  final String baseUrl;
}

class Listing {
  Listing({required this.title, required this.price});

  factory Listing.fromJson(Map<String, dynamic> json) => Listing(
        title: json['title'] as String,
        price: (json['price'] as num).toDouble(),
      );

  final String title;
  final double price;
}`,
      note: "خد بالك من <code>ApiClient._</code> (constructor خاص) ومن <code>factory</code> المكتوبة بسهم <code>=&gt;</code>.",
    },
  ],

  tasks: [
    {
      title: "خصومات متتابعة بـ Strategy",
      lang: "dart",
      prompt: "<p>اكتب <code>abstract interface class Discount</code> فيها <code>double apply(double price)</code>، وكلاسين: <code>PercentDiscount(int percent)</code> و<code>FixedDiscount(double amount)</code> (السعر مينزلش عن صفر أبدا). بعدين دالة <code>double totalAfter(double price, List&lt;Discount&gt; discounts)</code> بتطبق الخصومات بالترتيب. من غير <code>if</code> أو <code>switch</code> على نوع الخصم.</p>",
      examples: [
        { in: "totalAfter(1000, [PercentDiscount(10), FixedDiscount(50)])", out: "850.0" },
        { in: "totalAfter(100, [FixedDiscount(500)])", out: "0.0" },
      ],
      hints: [
        "الـ interface فيها method واحدة، وكل خصم بينفذها بطريقته.",
        "الدالة: <code>var p = price; for (final d in discounts) p = d.apply(p);</code>. والـ fixed: <code>max(0, ...)</code> من <code>dart:math</code> أو شرط.",
      ],
      solution: `import 'dart:math';

abstract interface class Discount {
  double apply(double price);
}

class PercentDiscount implements Discount {
  PercentDiscount(this.percent);

  final int percent;

  @override
  double apply(double price) => price * (100 - percent) / 100;
}

class FixedDiscount implements Discount {
  FixedDiscount(this.amount);

  final double amount;

  @override
  double apply(double price) => max(0.0, price - amount);
}

double totalAfter(double price, List<Discount> discounts) {
  var result = price;
  for (final d in discounts) {
    result = d.apply(result);
  }
  return result;
}

void main() {
  print(totalAfter(1000, [PercentDiscount(10), FixedDiscount(50)]));
  print(totalAfter(100, [FixedDiscount(500)]));
}`,
      explain: "<code>totalAfter</code> مبتعرفش أنواع الخصم، فخصم جديد كلاس جديد من غير ما تتعدل (Open/Closed). التعقيد O(n) على عدد الخصومات. الـ <code>max(0.0, ...)</code> بترجع <code>double</code> لأن الاتنين double.",
    },
    {
      title: "خدمة ترحيب قابلة للاختبار",
      lang: "php",
      prompt: "<p>عندك <code>interface Notifier { public function send(string $to, string $text): void; }</code>. اكتب: (1) <code>FakeNotifier</code> بيخزن الرسايل في <code>public array $sent</code>. (2) <code>WelcomeService</code> بياخد <code>Notifier</code> في الـ constructor وفيها <code>welcome(string $name, string $phone): void</code> بتبعت <code>Welcome, {name}</code> للرقم. (3) كود صغير يستخدم الـ fake ويطبع الرسالة اللي اتبعتت.</p>",
      hints: [
        "الـ service ماتعملش <code>new</code> لأي notifier. بتاخده في الـ constructor من النوع <code>Notifier</code>.",
        "الـ fake: <code>$this->sent[] = [$to, $text];</code>.",
      ],
      solution: `<?php
interface Notifier
{
    public function send(string $to, string $text): void;
}

class FakeNotifier implements Notifier
{
    public array $sent = [];

    public function send(string $to, string $text): void
    {
        $this->sent[] = [$to, $text];
    }
}

class WelcomeService
{
    public function __construct(private Notifier $notifier)
    {
    }

    public function welcome(string $name, string $phone): void
    {
        $this->notifier->send($phone, "Welcome, $name");
    }
}

$fake = new FakeNotifier();
(new WelcomeService($fake))->welcome('Hamza', '0501234567');
echo $fake->sent[0][0], ' <- ', $fake->sent[0][1], PHP_EOL;`,
      explain: "الـ service بتعتمد على الـ interface، فالاختبار بيحقن fake ويتأكد من اللي اتبعت من غير SMS حقيقي. ده DIP وDI في أصغر شكل. في Laravel الـ container بيحقن التنفيذ الحقيقي.",
    },
    {
      title: "Event bus صغير (Observer)",
      lang: "php",
      prompt: "<p>اكتب كلاس <code>EventBus</code> فيه <code>listen(string $event, callable $fn): void</code> و<code>dispatch(string $event, mixed $payload = null): int</code>. الـ dispatch بتنادي كل الـ listeners المسجلين على الحدث ده بالترتيب وترجع عددهم (0 لو مفيش). اختبره بحدث <code>listing.published</code> وlistenerين.</p>",
      examples: [
        { in: "dispatch('listing.published', 'Villa')", out: "2 (واتطبع سطرين)" },
      ],
      hints: [
        "خزن الـ listeners في array مفتاحه اسم الحدث: <code>$this->listeners[$event][] = $fn;</code>.",
        "في الـ dispatch: <code>foreach ($this->listeners[$event] ?? [] as $fn) { $fn($payload); }</code>.",
      ],
      solution: `<?php
class EventBus
{
    private array $listeners = [];

    public function listen(string $event, callable $fn): void
    {
        $this->listeners[$event][] = $fn;
    }

    public function dispatch(string $event, mixed $payload = null): int
    {
        $count = 0;
        foreach ($this->listeners[$event] ?? [] as $fn) {
            $fn($payload);
            $count++;
        }
        return $count;
    }
}

$bus = new EventBus();
$bus->listen('listing.published', fn ($l) => print("push: $l" . PHP_EOL));
$bus->listen('listing.published', fn ($l) => print("index: $l" . PHP_EOL));
echo $bus->dispatch('listing.published', 'Villa'), PHP_EOL;
echo $bus->dispatch('other'), PHP_EOL;`,
      explain: "المصدر (<code>dispatch</code>) مبيعرفش مين بيسمع ولا بيعمل إيه، وده الـ Observer. إضافة listener جديد من غير ما نلمس الكود اللي بيطلق الحدث. Laravel بيعمل نفس الفكرة بـ <code>event()</code> وـ listeners، ويقدر يحط الـ listener في queue.",
    },
  ],

  quiz: [
    {
      q: "أنهي جملة تعرّف الـ polymorphism صح؟",
      options: [
        "إن الكلاس يرث كل حاجة من الأب",
        "إن الـ fields تبقى private",
        "إن كود واحد يتعامل مع نوع عام وكل object ينفذ السلوك بطريقته",
        "إن الكلاس ميتعملش منه غير نسخة واحدة",
      ],
      answer: 2,
      why: "الـ polymorphism معناه «أشكال كتير» لنفس الواجهة: <code>foreach</code> واحدة تنادي <code>send()</code> وكل نوع ينفذها بطريقته. الوراثة وسيلة، والـ private هو encapsulation، والنسخة الواحدة هي singleton.",
    },
    {
      q: "الدالة دي بتخالف أنهي مبدأ في SOLID؟",
      code: { lang: "dart", src: `double fee(String type, double price) {
  if (type == 'sale') return price * 0.02;
  if (type == 'rent') return price * 0.05;
  throw ArgumentError(type);
}` },
      options: [
        "Open/Closed: نوع جديد يعني تعديل الدالة",
        "Liskov",
        "Interface Segregation",
        "مفيش مخالفة",
      ],
      answer: 0,
      why: "كل نوع جديد بيجبرنا نفتح الدالة ونزود <code>if</code>. الحل strategy لكل نوع أو map من النوع لدالة الحساب. Liskov عن الوراثة وISP عن interfaces ضخمة، ومفيش منهم هنا.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `abstract class Animal {
  String sound();
  String speak() => 'It says \${sound()}';
}

class Cat extends Animal {
  @override
  String sound() => 'meow';
}

void main() {
  Animal a = Cat();
  print(a.speak());
}` },
      answer: ["It says meow"],
      why: "<code>speak()</code> معرّفة في الأب لكنها بتنادي <code>sound()</code> اللي الابن عمل لها override، فبتشتغل نسخة <code>Cat</code> حتى لو المتغير نوعه <code>Animal</code>. ده polymorphism.",
    },
    {
      q: "<code>class Penguin extends Bird</code> وـ <code>Penguin.fly()</code> بترمي exception. ده كسر لأنهي مبدأ؟",
      options: [
        "Single Responsibility",
        "Dependency Inversion",
        "Open/Closed",
        "Liskov Substitution",
      ],
      answer: 3,
      why: "أي كود بيستخدم <code>Bird</code> متوقع إن <code>fly()</code> تشتغل. لما الابن يكسر ده مبقاش ينفع يحل محل الأب. الحل تقسيم التسلسل: <code>FlyingBird</code> منفصلة عن <code>Bird</code>.",
    },
    {
      q: "ليه الـ Singleton ممكن يبقى خطر في queue worker يشتغل ساعات؟",
      options: [
        "لأن PHP مبتدعمش نسخة واحدة",
        "لأن الـ process بيعيش بين الـ jobs فأي state جواه بيتسرب للـ job اللي بعده",
        "لأنه بيبطّأ كل job",
        "لأنه مبيتخزنش في الميموري",
      ],
      answer: 1,
      why: "في FPM كل ريكويست بيبدأ من الصفر، لكن الـ worker process بيعيش بين الـ jobs. الـ singleton اللي بيخزن «المستخدم الحالي» مثلا هيقدم القيمة القديمة لـ job مختلف. الحل: من غير state، أو scoped binding.",
    },
    {
      q: "الكلاس ده فيه مشكلة تصميم إيه بالظبط؟",
      code: { lang: "php", src: `class ReportService
{
    public function build(): string
    {
        $mailer = new SmtpMailer('smtp.example.com');
        return $mailer->preview() . ' ready';
    }
}` },
      options: [
        "مفيش مشكلة",
        "الكلاس بيعمل أكتر من حاجة بس",
        "الـ method لازم تبقى static",
        "الكلاس بيعمل <code>new</code> لاعتماده، فمربوط بـ SMTP ومستحيل يتختبر بـ fake",
      ],
      answer: 3,
      why: "لازم الاعتماد يتحقن من برا من نوع interface (<code>Mailer</code>) في الـ constructor. وقتها الاختبار يحقن fake والـ production يحقن SMTP. ده DIP/DI.",
    },
    {
      q: "عندك كلاس عايز يستخدم ميزة «تسجيل log» مشتركة مع كلاسات تانية مالهاش أب مشترك. أنسب حل في Dart؟",
      options: [
        "كلاس أب ضخم يرثوا منه كلهم",
        "<code>mixin Logs</code> وتستخدمه بـ <code>with</code>",
        "تكرار نفس الكود في كل كلاس",
        "كل كلاس يعمل <code>extends Object</code>",
      ],
      answer: 1,
      why: "الـ mixin بيدّيك إعادة استخدام كود من غير شجرة وراثة. الأب الضخم بيفرض علاقة is-a مش حقيقية، والتكرار بيخالف DRY، و<code>extends Object</code> مفيهاش أي فايدة.",
    },
    {
      q: "أنهي واحد من دول بيمثل Observer؟",
      options: [
        "<code>Listing.fromJson(map)</code>",
        "<code>controller.stream.listen((p) =&gt; ...)</code> على broadcast stream",
        "<code>ApiClient.instance</code>",
        "<code>DB::table('x')-&gt;where(...)</code>",
      ],
      answer: 1,
      why: "المصدر بيبعت أحداث وأي عدد مشتركين بيستقبلها من غير ما المصدر يعرفهم: ده Observer. الأولى factory، والتالتة singleton، والرابعة builder.",
    },
    {
      q: "عندك صفحة بتعرض إعلان بس ومبتعدلش حاجة. أنسب نوع تحقنه فيها؟",
      options: [
        "<code>ListingReader</code> (interface للقراءة بس)",
        "الـ Eloquent model كله",
        "<code>ListingWriter</code>",
        "كلاس ضخم فيه القراءة والكتابة والحذف",
      ],
      answer: 0,
      why: "ده Interface Segregation: الصفحة متعتمدش غير على اللي بتستخدمه. وبكده مستحيل تعدل داتا بالغلط والاختبار أسهل.",
    },
  ],
};
