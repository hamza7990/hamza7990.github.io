window.LEVELS = window.LEVELS || {};
window.LEVELS["dart/d5"] = {
  slides: [
    {
      kicker: "ليه الوراثة والـ mixins",
      title: "مفيش widget في Flutter من غير extends وwith",
      en: "Inheritance, mixins and extensions",
      body: "<p>أول سطر في أي شاشة بتكتبها: <code>class HomeScreen extends StatelessWidget</code>. وفي الـ animations هتشوف <code>with SingleTickerProviderStateMixin</code>. وكل ما تكتب <code>context.theme</code> غالبا ده extension. تلات أدوات مختلفة لحاجة واحدة: إعادة استخدام السلوك من غير تكرار.</p><p>المستوى ده بيرتبهم: امتى <code>extends</code>، امتى <code>implements</code>، امتى <code>with</code>، امتى extension، وإمتى تسيب الوراثة كلها وتستخدم composition.</p>",
      points: [
        "سؤال إنترفيو كلاسيكي: «إيه الفرق بين extends و implements و with؟» ولازم تجاوب بمثال.",
        "Dart 3 ضافت class modifiers (<code>interface</code> و <code>base</code> و <code>final</code> و <code>sealed</code>) هتشوفها في الـ packages الحديثة.",
      ],
    },
    {
      title: "extends وsuper وoverride",
      en: "Inheritance",
      body: "<p><code>extends</code> بتخلي الكلاس الابن ياخد كل حاجة من الأب. الابن يقدر يغير سلوك method بـ <code>@override</code>، وينادي نسخة الأب بـ <code>super</code>. وفي Dart <b>وراثة واحدة بس</b>: كلاس واحد بس تقدر تعمل له extends.</p>",
      code: {
        lang: "dart",
        src: `class Animal {
  final String name;
  Animal(this.name);

  String sound() => '...';
  String describe() => '$name says \${sound()}';
}

class Dog extends Animal {
  Dog(super.name);                      // passes name up to Animal

  @override
  String sound() => 'woof';

  @override
  String describe() => '\${super.describe()}!';
}

void main() {
  final Animal a = Dog('Rex');          // a Dog is an Animal
  print(a.describe());                  // Rex says woof!
  print(a is Dog);                      // true
}`,
        note: "<code>a.describe()</code> اتنفذت نسخة <code>Dog</code> رغم إن نوع المتغير <code>Animal</code>: ده الـ polymorphism. وفي <code>Dog(super.name)</code> الـ <code>super.name</code> بتمرر القيمة للأب (Dart 2.17+).",
      },
      pitfall: "لو الأب فيه constructor بـ parameters، الابن لازم ينادي عليه (<code>super(...)</code> أو <code>super.x</code>). وكتابة <code>@override</code> مش اختيارية في الممارسة: بتمسكلك غلطة في اسم الـ method.",
    },
    {
      title: "Abstract classes",
      en: "Abstract classes",
      body: "<p>الكلاس <code>abstract</code> مينفعش تعمل منه object. بيشيل methods من غير جسم (لازم الأبناء يكتبوها) وممكن يشيل methods كاملة يرثوها. هو «العقد + شوية كود مشترك».</p>",
      code: {
        lang: "dart",
        src: `abstract class Shape {
  String get label;                 // no body: children must provide it
  double area();

  String describe() => '$label with area \${area().toStringAsFixed(1)}';
}

class Circle extends Shape {
  final double r;
  Circle(this.r);

  @override
  String get label => 'Circle';
  @override
  double area() => 3.14 * r * r;
}

class Rect extends Shape {
  final double w, h;
  Rect(this.w, this.h);

  @override
  String get label => 'Rect';
  @override
  double area() => w * h;
}

void main() {
  final shapes = <Shape>[Circle(1), Rect(2, 3)];
  for (final s in shapes) {
    print(s.describe());            // Circle with area 3.1, then Rect with area 6.0
  }
  // Shape();                       // error: abstract classes can't be instantiated
}`,
      },
      interview: [
        { q: "إيه الفرق بين abstract class و concrete class؟ وإمتى أستخدم abstract؟", a: "الـ abstract مينفعش أعمل منه object مباشرة، وممكن يشيل members من غير تنفيذ لازم الأبناء يكتبوها. بستخدمه لما عندي عقد مشترك لعدة أنواع وعايز أعالجهم بنفس النوع (<code>List&lt;Shape&gt;</code>)، ومعاه شوية كود مشترك أحبه يتورث (زي <code>describe</code>). لو مفيش كود مشترك وهو عقد بس، بستخدم <code>abstract interface class</code>." },
      ],
    },
    {
      title: "implements: كل كلاس هو interface",
      en: "implements and interfaces",
      body: "<p>Dart مفيهاش keyword اسمه <code>interface</code> قديما: <b>كل كلاس بيعمل interface ضمني</b>. لما تكتب <code>implements X</code> إنت بتوعد إنك هتكتب <b>كل</b> أعضاء X بنفسك، ومبتورثش أي كود. وتقدر تعمل implements لأكتر من كلاس.</p><p>ده أساس الـ dependency injection والاختبار: الكود بيعتمد على <code>Storage</code> (العقد)، وفي الاختبار تحط بدله fake.</p>",
      code: {
        lang: "dart",
        src: `abstract class Storage {
  void save(String key, String value);
  String? read(String key);
}

class MemoryStorage implements Storage {
  final _data = <String, String>{};

  @override
  void save(String key, String value) => _data[key] = value;

  @override
  String? read(String key) => _data[key];
}

class Greeter {
  final Storage storage;
  Greeter(this.storage);

  String greet() => 'Hi \${storage.read('name') ?? 'guest'}';
}

void main() {
  final s = MemoryStorage();
  print(Greeter(s).greet());     // Hi guest
  s.save('name', 'Hamza');
  print(Greeter(s).greet());     // Hi Hamza
}`,
        note: "<code>Greeter</code> مبتعرفش إن فيه <code>MemoryStorage</code>. تقدر تبدلها بـ <code>FileStorage</code> أو fake في الاختبار من غير ما تغير فيها حرف.",
      },
      terms: [
        ["extends", "يرث", "ياخد كود الأب ويقدر يعدل عليه. أب واحد بس."],
        ["implements", "ينفذ العقد", "يوعد بكل الأعضاء ومبيورثش كود. أكتر من واحد ممكن."],
        ["with", "يدمج mixin", "ياخد كود من mixin من غير ما يبقى ابن له."],
      ],
      interview: [
        { q: "إيه الفرق بين <code>extends</code> و <code>implements</code>؟", a: "<code>extends</code> بترث الكود الموجود في الأب، وتغير اللي تحتاجه بـ override، والكلاس يرث من أب واحد بس. <code>implements</code> بتاخد الشكل (أسماء الأعضاء وأنواعها) بس، ولازم تكتب كل عضو بنفسك حتى لو كان له تنفيذ في الأصل، ومسموح تعمل implements لأكتر من كلاس. بستخدم <code>extends</code> لإعادة استخدام كود، و <code>implements</code> لما أعمل بديل أو fake لعقد معين." },
      ],
    },
    {
      title: "Mixins: كود مشترك من غير أب",
      en: "mixin, with, on",
      body: "<p>الـ <code>mixin</code> مجموعة fields و methods تقدر «تحقنها» في أي كلاس بـ <code>with</code> من غير ما الكلاس يبقى ابنها. الكلاس يقدر ياخد أكتر من mixin، بينما الأب واحد بس. الـ mixin مفيهوش constructor. و<code>on</code> بتحصر الـ mixin على كلاسات من نوع معين.</p>",
      code: {
        lang: "dart",
        src: `mixin Logs {
  final List<String> _log = [];
  void log(String message) => _log.add(message);
  List<String> get history => List.unmodifiable(_log);
}

mixin Flies {
  String fly() => 'flying';
}

class Bird with Logs, Flies {}

class Base {
  String id = 'b1';
}

mixin Tagged on Base {               // only usable with Base subclasses
  String tag() => 'tag-$id';         // can use Base members
}

class Item extends Base with Tagged {}

void main() {
  final b = Bird();
  b.log('hi');
  print(b.history);                  // [hi]
  print(b.fly());                    // flying
  print(Item().tag());               // tag-b1
}`,
        note: "لو mixin-ين فيهم نفس اسم الـ method، <b>آخر واحد في <code>with</code> بيكسب</b>.",
      },
      focus: [{ label: "في Flutter", text: "<code>class _MyState extends State&lt;MyWidget&gt; with SingleTickerProviderStateMixin</code>: الـ mixin بيدّيك <code>vsync</code> للـ animations من غير ما تكتبه. وكمان <code>WidgetsBindingObserver</code>." }],
      interview: [
        { q: "إيه الـ mixin؟ ومتى أفضله على الوراثة؟", a: "الـ mixin طريقة لإعادة استخدام كود (fields و methods) في كلاسات مش بينها علاقة وراثة، بتتحقن بـ <code>with</code>. بفضله لما السلوك «قدرة» تتشارك بين كلاسات مختلفة (log، animation ticker، validation) ومش علاقة «is-a»، وعشان Dart فيها وراثة واحدة بس. القيود: مفيهوش constructor، ولو تعارض اسمين آخر mixin بيكسب. و<code>on</code> بتخلي الـ mixin يشترط أب معين ويقدر يستخدم أعضاءه." },
      ],
    },
    {
      title: "Extension methods",
      en: "Extensions",
      body: "<p>الـ extension بيضيف methods أو getters لنوع موجود (<code>String</code> أو <code>int</code> أو كلاس مش بتاعك) من غير ما تعدل عليه ولا تورث منه. بيخلي الكود يتقرا زي ما إنت متخيله.</p>",
      code: {
        lang: "dart",
        src: `extension StringX on String {
  String get capitalized {
    if (isEmpty) return this;
    return this[0].toUpperCase() + substring(1);
  }

  bool get looksLikeEmail => contains('@') && contains('.');
}

extension DurationX on int {
  Duration get seconds => Duration(seconds: this);
}

void main() {
  print('hamza'.capitalized);           // Hamza
  print('a@b.com'.looksLikeEmail);      // true
  print(5.seconds);                     // 0:00:05.000000
}`,
        note: "جوه الـ extension <code>this</code> هي القيمة اللي إنت بتنادي عليها، وتقدر تنادي أعضاء النوع من غير <code>this.</code>.",
      },
      pitfall: "الـ extension بيتحل وقت الكومبايل على النوع الظاهر (static): مينفعش يضيف fields ولا ينعمله override، ومع متغير <code>dynamic</code> مش هيشتغل. ولازم يتعمله import في الملف اللي بيستخدمه لو في ملف تاني.",
      focus: [{ label: "في Flutter", text: "<code>extension on BuildContext { ThemeData get theme =&gt; Theme.of(this); }</code> هو اللي بيدّيك <code>context.theme</code>. أغلب الـ packages بتستخدمه بنفس الطريقة." }],
      interview: [
        { q: "إيه حدود الـ extension methods؟", a: "بتتحل وقت الكومبايل حسب النوع الظاهر للمتغير، فمش بتتغير بالـ polymorphism ومينفعش تعمل override لـ method موجودة (لو النوع عنده method بنفس الاسم، بتاعته هي اللي بتتنفذ). مينفعش تضيف fields أو تخزن state. ومبتشتغلش على <code>dynamic</code>. فايدتها في قراءة الكود والـ utilities، مش تغيير سلوك الكلاس." },
      ],
    },
    {
      title: "Class modifiers في Dart 3",
      en: "interface, base, final, sealed",
      body: "<p>Dart 3 ضافت كلمات قبل <code>class</code> بتحدد <b>مين ممكن يورث أو يعمل implements</b> للكلاس. القيود دي بتتطبق على الكود <b>برا الـ library</b> (ملف/package تاني)، وجوه نفس الملف كله مسموح. مهمة لمصممي الـ packages، وهتشوفها كتير في الكود الحديث.</p>",
      code: {
        lang: "dart",
        src: `// Outside the declaring library:
interface class Reader {}        // can implement, cannot extend
base class Entity {}             // can extend, cannot implement
final class Config {}            // neither (and subclasses stay in this file)
sealed class Result {}           // abstract + all subtypes known here
abstract interface class Api {}  // a pure contract, most common form

void main() {}`,
      },
      points: [
        "<code>interface class</code>: بتتعمل لها implements بس، مفيش extends من برا.",
        "<code>base class</code>: بتتعمل لها extends بس (والابن لازم يبقى <code>base</code> أو <code>final</code> أو <code>sealed</code>)، مفيش implements.",
        "<code>final class</code>: لا extends ولا implements من برا.",
        "<code>sealed class</code>: abstract، وأبناؤها كلهم لازم يتعرفوا في نفس الملف، فالـ compiler يعرف القايمة الكاملة ويفحص الـ switch (المستوى ٦).",
        "<code>abstract interface class</code>: العقد النقي. الشكل الأشهر لتعريف Repository أو Service.",
      ],
      interview: [
        { q: "إيه معنى <code>sealed</code> و <code>final</code> و <code>interface</code> قبل الكلاس في Dart 3؟", a: "هي class modifiers بتتحكم في الوراثة من برا الـ library. <code>interface</code>: يتعمل له implements بس. <code>final</code>: مفيش extends ولا implements. <code>base</code>: extends بس. <code>sealed</code>: كلاس abstract أبناؤه معروفين كلهم في نفس الملف، فالـ compiler بيجبرك تغطي كل الحالات في الـ switch. الهدف حماية تصميم الـ package ومنع الاستخدامات اللي المصمم مش قاصدها." },
      ],
    },
    {
      title: "Composition أم inheritance؟",
      en: "Composition over inheritance",
      body: "<p>الوراثة علاقة «is-a»، والـ composition علاقة «has-a»: الكلاس بيشيل object تاني ويستخدمه. الوراثة بتربط الابن بتفاصيل الأب وتخلي الهرم صعب التغيير. الـ composition أخف وأسهل في الاختبار، والـ Flutter نفسه مبني عليها: <code>Container</code> بتشيل <code>child</code>، مش بتورث كل أنواع الـ widgets.</p>",
      code: {
        lang: "dart",
        src: `class Engine {
  void start() => print('engine on');
}

class Car {
  final Engine engine;               // has-a, injected from outside
  Car(this.engine);

  void drive() {
    engine.start();
    print('driving');
  }
}

void main() {
  Car(Engine()).drive();             // engine on, then driving
}`,
        note: "لو بعدين عايز <code>ElectricEngine</code>، تعمل <code>Engine</code> abstract وتحقن اللي تحتاجه، من غير ما تلمس <code>Car</code>.",
      },
      focus: [{ label: "قاعدة عملية", text: "<code>extends</code> لما فعلا «ابن من نفس النوع» ومحتاج كود الأب. <code>implements</code> لما تحتاج العقد بس. <code>with</code> لما تحتاج قدرة مشتركة. وأي حاجة تانية: composition." }],
      interview: [
        { q: "ليه بنقول «composition over inheritance»؟ وفين بتشوفها في Flutter؟", a: "لأن الوراثة بتربط الابن بتنفيذ الأب فأي تغيير في الأب بيكسر الأبناء، والهرم بيكبر ويتعقد، وDart فيها وراثة واحدة. الـ composition بتبني السلوك من أجزاء صغيرة قابلة للتبديل والاختبار. في Flutter بتبني الـ UI بتداخل widgets (<code>Padding(child: Text(...))</code>) مش بإنك تعمل <code>MyButton extends ElevatedButton</code> وتعدل فيه." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: extends وoverride",
      lang: "dart",
      code: `class Animal {
  final String name;
  Animal(this.name);

  String sound() => '...';
}

class Dog extends Animal {
  Dog(super.name);

  @override
  String sound() => 'woof';
}

void main() {
  final d = Dog('Rex');
  print('\${d.name}: \${d.sound()}');
}`,
    },
    {
      title: "اكتب: abstract وimplements",
      lang: "dart",
      code: `abstract class Storage {
  void save(String key, String value);
  String? read(String key);
}

class MemoryStorage implements Storage {
  final _data = <String, String>{};
  @override
  void save(String key, String value) => _data[key] = value;
  @override
  String? read(String key) => _data[key];
}

void main() {
  final s = MemoryStorage()..save('a', '1');
  print(s.read('a'));
}`,
    },
    {
      title: "اكتب: mixin وextension",
      lang: "dart",
      code: `mixin Logs {
  final List<String> history = [];
  void log(String m) => history.add(m);
}

class Service with Logs {
  void run() => log('run');
}

extension StringX on String {
  String get shout => toUpperCase();
}

void main() {
  final s = Service()..run()..run();
  print(s.history.length);
  print('hi'.shout);
}`,
    },
  ],

  tasks: [
    {
      title: "أشكال بمساحات",
      lang: "dart",
      prompt: "<p>اكتب <code>abstract class Shape</code> فيها <code>double area()</code> بدون تنفيذ. وكلاس <code>Circle(double r)</code> و <code>Rect(double w, double h)</code> يورثوا منها. وبعدين دالة <code>double totalArea(List&lt;Shape&gt; shapes)</code> بترجع مجموع المساحات. استخدم <code>pi</code> من <code>dart:math</code>.</p>",
      examples: [
        { in: "totalArea([Rect(2, 3), Rect(1, 1)])", out: "7.0" },
        { in: "Circle(1).area()", out: "3.141592653589793" },
      ],
      hints: [
        "<code>import 'dart:math';</code> في أول الملف، و <code>pi</code> بتيجي منها.",
        "الجمع: <code>fold(0.0, (sum, s) =&gt; sum + s.area())</code> أو حلقة <code>for</code>.",
      ],
      solution: `import 'dart:math';

abstract class Shape {
  double area();
}

class Circle extends Shape {
  final double r;
  Circle(this.r);

  @override
  double area() => pi * r * r;
}

class Rect extends Shape {
  final double w, h;
  Rect(this.w, this.h);

  @override
  double area() => w * h;
}

double totalArea(List<Shape> shapes) {
  return shapes.fold(0.0, (sum, s) => sum + s.area());
}`,
      explain: "<code>totalArea</code> بتتعامل مع <code>Shape</code> بس ومبتعرفش الأنواع، فلو ضفت <code>Triangle</code> بعدين مفيش تعديل فيها. ده الـ polymorphism. والـ <code>0.0</code> في <code>fold</code> عشان نوع المجموع <code>double</code>.",
    },
    {
      title: "extension على String",
      lang: "dart",
      prompt: "<p>اكتب extension اسمه <code>TextTools</code> على <code>String</code> فيه:</p><ul><li>getter <code>bool isPalindrome</code>: بيقرا بنفس الشكل من الاتجاهين، من غير حساسية لحالة الحروف.</li><li>method <code>String truncate(int max)</code>: لو النص أطول من <code>max</code> يقصه عند <code>max</code> حرف ويضيف <code>...</code>، وإلا يرجعه زي ما هو.</li></ul>",
      examples: [
        { in: "'Abba'.isPalindrome", out: "true" },
        { in: "'Hello world'.truncate(5)", out: "Hello..." },
        { in: "'Hi'.truncate(5)", out: "Hi" },
      ],
      hints: [
        "اقلب النص: <code>split('').reversed.join()</code>، وقارنه بعد <code>toLowerCase()</code> للاتنين.",
        "<code>substring(0, max)</code> بتقص أول <code>max</code> حرف.",
      ],
      solution: `extension TextTools on String {
  bool get isPalindrome {
    final s = toLowerCase();
    return s == s.split('').reversed.join();
  }

  String truncate(int max) {
    if (length <= max) return this;
    return '\${substring(0, max)}...';
  }
}`,
      explain: "جوه الـ extension نادينا <code>toLowerCase</code> و <code>length</code> و <code>substring</code> مباشرة لأنها على <code>this</code>. ولاحظ إن الـ extension ماقدرش يضيف field، فكل حاجة محسوبة من النص نفسه.",
    },
    {
      title: "mixin للإشعارات",
      lang: "dart",
      prompt: "<p>اكتب <code>mixin Notifier</code> فيه: <code>addListener(void Function(String) listener)</code> بتخزن الـ listener، و <code>notify(String event)</code> بتنادي كل الـ listeners بالـ event. وبعدين كلاس <code>Cart with Notifier</code> فيه <code>items</code> و <code>add(String item)</code> بتضيف العنصر وتعمل <code>notify('added $item')</code>.</p>",
      examples: [
        { in: "final c = Cart(); c.addListener(print); c.add('tea');", out: "added tea" },
      ],
      hints: [
        "جوه الـ mixin خزن الـ listeners في <code>final List&lt;void Function(String)&gt; _listeners = [];</code>.",
        "<code>notify</code> بتلف على القايمة وتنادي كل واحد: <code>for (final l in _listeners) l(event);</code>.",
      ],
      solution: `mixin Notifier {
  final List<void Function(String)> _listeners = [];

  void addListener(void Function(String) listener) {
    _listeners.add(listener);
  }

  void notify(String event) {
    for (final l in _listeners) {
      l(event);
    }
  }
}

class Cart with Notifier {
  final List<String> items = [];

  void add(String item) {
    items.add(item);
    notify('added $item');
  }
}`,
      explain: "ده شكل <code>ChangeNotifier</code> في Flutter مبسط. الـ mixin بيدي أي كلاس قدرة الإشعار من غير ما يرث من حاجة، والـ listener دالة (higher-order من المستوى ٢). <code>c.addListener(print)</code> استخدم tear-off.",
    },
  ],

  quiz: [
    {
      q: "إيه اللي هيحصل مع الكود ده؟",
      code: { lang: "dart", src: `class Animal {
  String sound() => '...';
}

class Quiet implements Animal {}` },
      options: [
        "يتكومبايل عادي، <code>Quiet</code> بترث <code>sound</code>",
        "خطأ كومبايل: <code>implements</code> بتطلب كتابة <code>sound</code> في <code>Quiet</code>",
        "يتكومبايل لكن <code>sound()</code> بترمي exception",
        "خطأ لأن <code>Animal</code> مش abstract",
      ],
      answer: 1,
      why: "<code>implements</code> بتاخد الشكل بس ومبتورثش أي كود حتى لو الأصل له تنفيذ. لو عايز تورث <code>sound</code> استخدم <code>extends</code>. وأي كلاس ممكن يتعمله implements مش لازم يبقى abstract.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `class Animal {
  final String name;
  Animal(this.name);
  String sound() => '...';
  String describe() => '$name says \${sound()}';
}

class Dog extends Animal {
  Dog(super.name);
  @override
  String sound() => 'woof';
  @override
  String describe() => '\${super.describe()}!';
}

void main() {
  print(Dog('Rex').describe());
}` },
      answer: ["Rex says woof!"],
      why: "<code>super.describe()</code> نفذت describe الأب، وجواها <code>sound()</code> اتنفذت نسخة <code>Dog</code> (woof) لأن الـ object فعلا Dog. وبعدين الابن ضاف <code>!</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `mixin A { String hello() => 'A'; }
mixin B { String hello() => 'B'; }
class C with A, B {}

void main() {
  print(C().hello());
}` },
      options: ["A", "AB", "خطأ كومبايل بسبب التعارض", "B"],
      answer: 3,
      why: "لما mixin-ين يعرّفوا نفس الـ method، آخر واحد في قايمة <code>with</code> هو اللي بيكسب، وده <code>B</code>. مفيش خطأ.",
    },
    {
      q: "أنهي حاجة مينفعش تعملها في extension؟",
      options: [
        "إضافة getter",
        "إضافة method بـ parameters",
        "إضافة field بيخزن قيمة",
        "إضافة operator",
      ],
      answer: 2,
      why: "الـ extension مجرد syntax إضافي بيتحل وقت الكومبايل ومفيهوش مكان يخزن state. تقدر تضيف getters و methods و operators، لكن مش fields.",
    },
    {
      q: "أنهي سطر فيه خطأ كومبايل؟",
      code: { lang: "dart", src: `abstract class Shape {
  double area();
}

class Sq extends Shape {
  @override
  double area() => 4;
}

void main() {
  final a = Sq();       // 1
  final b = Shape();    // 2
  final Shape c = Sq(); // 3
  print(a.area() + c.area());  // 4
}` },
      options: ["السطر 1", "السطر 2", "السطر 3", "السطر 4"],
      answer: 1,
      why: "الكلاس abstract مينفعش يتعمل منه object. السطر 3 سليم لأن النوع الظاهر <code>Shape</code> والـ object الفعلي <code>Sq</code>.",
    },
    {
      q: "يعني إيه <code>sealed class Result</code>؟",
      options: [
        "كلاس مينفعش حد يورث منه خالص",
        "كلاس مينفعش يتعمل منه object بس الأبناء بتتعرف في أي ملف",
        "كلاس abstract وكل أبناءه لازم يتعرفوا في نفس الملف، فالـ compiler يفحص الـ switch عليه",
        "كلاس immutable كل fields بتاعته final",
      ],
      answer: 2,
      why: "الـ sealed هو abstract + قايمة أبناء مقفولة في نفس الـ library. الأول وصف <code>final class</code>، والرابع مفيش keyword بيعمله. فايدة الـ sealed: exhaustive switch.",
    },
    {
      q: "إيه اللي هيحصل وقت التشغيل؟",
      code: { lang: "dart", src: `extension on String {
  String get shout => toUpperCase();
}

void main() {
  dynamic s = 'hi';
  print(s.shout);
}` },
      options: [
        "يطبع <code>HI</code>",
        "يطبع <code>hi</code>",
        "خطأ وقت الكومبايل",
        "<code>NoSuchMethodError</code> وقت التشغيل",
      ],
      answer: 3,
      why: "الـ extension بتتحل على النوع الظاهر وقت الكومبايل، و <code>dynamic</code> مفيهوش حل ثابت، فالنداء بيتحول لـ lookup وقت التشغيل ومبيلاقيش <code>shout</code> على String. لو كتبت <code>String s = 'hi'</code> هيشتغل.",
    },
    {
      q: "إيه اللي ميتعملش في الـ mixin؟",
      options: [
        "يحتوي fields",
        "يحتوي methods كاملة",
        "يحتوي constructor",
        "يشترط أب معين بـ <code>on</code>",
      ],
      answer: 2,
      why: "الـ mixin مفيهوش constructors لأنه بيتحقن في كلاس مش بيتعمل منه object لوحده. الباقي كله مسموح.",
    },
    {
      q: "عايز تعمل زرار مخصص لتطبيقك بألوان ثابتة. إيه الأنسب في Flutter؟",
      options: [
        "<code>class AppButton extends ElevatedButton</code> وتعدل في الأب",
        "<code>class AppButton extends StatelessWidget</code> وتبني جواه <code>ElevatedButton(...)</code> (composition)",
        "تنسخ كود <code>ElevatedButton</code> في ملفك",
        "تعمل mixin اسمه <code>Button</code>",
      ],
      answer: 1,
      why: "الـ composition هي أسلوب Flutter: widget صغير بيبني widgets جاهزة جواه بالألوان اللي تحتاجها. الوراثة من widget كبير بتربطك بتفاصيله الداخلية وبتتكسر مع أي تحديث.",
    },
  ],
};
