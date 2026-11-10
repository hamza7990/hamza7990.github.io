window.LEVELS = window.LEVELS || {};
window.LEVELS["dart/d4"] = {
  slides: [
    {
      kicker: "ليه الكلاسات",
      title: "كل widget وكل موديل في تطبيقك كلاس",
      en: "Classes and constructors",
      body: "<p>الـ <code>Text</code> و <code>Scaffold</code> و موديل <code>Office</code> اللي جاي من الـ API كلهم كلاسات. اللي بيفرّق كود Dart المتقن عن الكود الضعيف هو الـ constructors: إزاي تبني الـ object بأمان، وإزاي تخليه ثابت (immutable) وتنسخه بتعديل صغير.</p><p>المستوى ده بيغطي: الـ fields، أنواع الـ constructors، الـ initializer list، الخصوصية بـ <code>_</code>، الـ getters والـ setters، الـ static، <code>toString</code>، الـ cascade، و <code>copyWith</code>.</p>",
      points: [
        "الإنترفيو في Flutter بيسأل على <code>const</code> constructor، <code>factory</code>، <code>copyWith</code>، <code>fromJson</code>، والفرق بين <code>final</code> field و getter.",
        "كل ده هتشوفه تاني في كل موديل و state class بتكتبه.",
      ],
    },
    {
      title: "الـ fields والـ constructor الأساسي",
      en: "Fields and initializing formals",
      body: "<p>الـ constructor بيحط قيم الـ fields. بدل ما تكتب <code>this.name = name</code> في الجسم، اكتب <code>this.name</code> مباشرة في قايمة الـ parameters (<b>initializing formal</b>). وتقدر تعملها positional أو named بـ <code>required</code>.</p>",
      code: {
        lang: "dart",
        src: `class Office {
  final String name;      // set once, in the constructor
  final int rating;
  String? phone;          // can change later, may be null

  Office({required this.name, this.rating = 0, this.phone});
}

class Point {
  final double x, y;
  Point(this.x, this.y);  // positional version
}

void main() {
  final o = Office(name: 'Nile', rating: 5);
  o.phone = '0100';
  print('\${o.name} \${o.rating} \${o.phone}');   // Nile 5 0100
  // o.name = 'x';       // error: final field
  final p = Point(1, 2);
  print(p.x + p.y);                              // 3.0
}`,
        note: "من غير <code>new</code>: <code>Office(...)</code> بس. و Dart بتفرض إن كل field non-nullable يتحط له قيمة قبل ما الـ object يتبني.",
      },
      focus: [{ label: "في Flutter", text: "<code>const MyCard({super.key, required this.title})</code>: نفس الشكل بالظبط. كل widget بتكتبه constructor بـ named parameters و <code>required this.x</code>." }],
    },
    {
      title: "Named وredirecting وinitializer list",
      en: "Named constructors, initializer list, redirecting",
      body: "<p>Dart مفيهاش overloading، يعني مينفعش constructor باسم الكلاس مرتين. بدل كده بتعمل <b>named constructors</b> زي <code>Office.fromJson</code>. و<b>initializer list</b> (بعد <code>:</code>) بتحط قيم fields قبل ما جسم الـ constructor يشتغل، وبتقدر تحط <code>assert</code>. والـ <b>redirecting</b> constructor بيحيل لـ constructor تاني بـ <code>this(...)</code>.</p>",
      code: {
        lang: "dart",
        src: `class Range {
  final int min;
  final int max;
  final int size;

  Range(this.min, this.max)
      : assert(min <= max),
        size = max - min;

  Range.single(int value) : this(value, value);      // redirecting

  Range.fromList(List<int> v)
      : min = v.first,
        max = v.last,
        size = v.last - v.first;
}

void main() {
  print(Range(2, 5).size);              // 3
  print(Range.single(4).size);          // 0
  print(Range.fromList([1, 9]).size);   // 8
}`,
        note: "الـ initializer list مينفعش تستخدم <code>this</code> فيها (الـ object لسه بيتبني)، ولكن تقدر تستخدم الـ parameters. وهي الطريقة الوحيدة لتعيين <code>final</code> field محسوب.",
      },
      terms: [
        ["initializer list", "قايمة التهيئة", "بعد <code>:</code> وبتشتغل قبل جسم الـ constructor، لتعيين الـ fields والـ assert."],
        ["redirecting constructor", "constructor بيحيل", "جسمه فاضي وبينفذ <code>: this(...)</code> على constructor تاني في نفس الكلاس."],
      ],
      interview: [
        { q: "ليه Dart فيها named constructors؟ وإيه اللي بيتحط في الـ initializer list؟", a: "لأن Dart مفيهاش overloading، مينفعش تعرّف constructor باسم الكلاس بأنواع parameters مختلفة. فبنعمل named constructors زي <code>Office.fromJson</code> و <code>Office.empty()</code> بتوضح النية. و الـ initializer list بتتنفذ قبل جسم الـ constructor، وبنحط فيها تعيين الـ fields الـ <code>final</code> المحسوبة، والـ <code>assert</code>، والنداء على <code>super</code>. مينفعش أستخدم <code>this</code> فيها لأن الـ object لسه مخلصش." },
      ],
    },
    {
      title: "const وfactory",
      en: "const and factory constructors",
      body: "<p><b>const constructor</b>: بيخلي الـ object ثابت وقت الكومبايل، وشرطه إن كل الـ fields <code>final</code>. نفس القيم الثابتة بتتشارك نسخة واحدة. و<b>factory</b>: constructor مش لازم يعمل object جديد، ممكن يرجّع واحد موجود (cache) أو subtype، ومفيهوش <code>this</code>.</p>",
      code: {
        lang: "dart",
        src: `class Tag {
  final String label;
  const Tag(this.label);
}

class Logger {
  static final Map<String, Logger> _cache = {};
  final String name;

  Logger._(this.name);                      // private constructor

  factory Logger(String name) {
    return _cache.putIfAbsent(name, () => Logger._(name));
  }
}

void main() {
  const a = Tag('x');
  const b = Tag('x');
  final c = Tag('x');                       // not const: a new object
  print(identical(a, b));                   // true
  print(identical(a, c));                   // false
  print(identical(Logger('app'), Logger('app')));   // true
}`,
        note: "<code>final c = Tag('x')</code> من غير <code>const</code> بيعمل object جديد. تحط <code>const</code> بنفسك أو في سياق const.",
      },
      pitfall: "<code>const</code> constructor مع field مش <code>final</code> هيدي خطأ كومبايل، لأن الـ const object مفروض مبيتغيرش. وأي field جواه لازم قيمته نفسها const.",
      interview: [
        { q: "إيه الفرق بين generative constructor و factory constructor؟", a: "الـ generative (العادي) دايما بيبني object جديد من الكلاس ويهيئ الـ fields بتاعته. الـ factory بيتكتب بـ <code>factory</code> وجسمه عادي بيرجّع object: ممكن موجود في cache (singleton)، أو subtype، أو نتيجة قرار حسب parameter، زي <code>factory Shape.fromJson(map)</code> بترجّع Circle أو Square. وهو مفيهوش <code>this</code> ومبيعملش initializer list." },
        { q: "ليه بنقول الـ <code>const</code> widgets أسرع في Flutter؟", a: "لأن الـ const constructor بيبني object واحد وقت الكومبايل ونفس النسخة بتتشارك في كل مكان بنفس القيم. فمفيش allocation جديدة في كل build، و Flutter بيقدر يعرف إن الـ widget هو هو فيتخطى إعادة بنائه. وشرط ده إن كل الـ fields final وقيمها const." },
      ],
    },
    {
      title: "الخصوصية والـ getters والـ setters",
      en: "Private members, getters, setters",
      body: "<p>أي اسم يبدأ بـ <code>_</code> يبقى <b>private</b>. لكن في Dart الخصوصية على مستوى <b>الملف (library)</b> مش الكلاس: أي كود في نفس الملف يشوف الـ <code>_x</code>. الـ <b>getter</b> بيتقرا كأنه field، ويقدر يتحسب. الـ <b>setter</b> بيعمل تحقق قبل التعيين.</p>",
      code: {
        lang: "dart",
        src: `class Account {
  double _balance = 0;                       // private field

  double get balance => _balance;            // read like a field
  bool get isEmpty => _balance == 0;         // computed, no storage

  set balance(double value) {
    if (value < 0) throw ArgumentError('balance cannot be negative');
    _balance = value;
  }

  void deposit(double amount) => _balance += amount;
}

void main() {
  final acc = Account();
  acc.deposit(50);
  acc.balance = 80;
  print(acc.balance);       // 80.0
  print(acc.isEmpty);       // false
  // acc.balance(5);        // error: a getter is not a method
}`,
      },
      pitfall: "لو عايز field للقراءة بس من برا، سيبه private واعمل له getter من غير setter. وخد بالك إن الـ getters بتتنادي من غير أقواس: <code>acc.balance</code> مش <code>acc.balance()</code>.",
      interview: [
        { q: "إيه الفرق بين field و getter؟ وإمتى أفضّل getter؟", a: "الـ field بيخزن قيمة فعلا، والـ getter دالة بتتنادي بنفس شكل الـ field. بفضّل getter لما القيمة محسوبة من حاجات تانية (<code>bool get isEmpty =&gt; items.isEmpty</code>) فمتتخزنش تاني وتبقى out-of-date، ولما عايز أعرض قيمة private للقراءة بس. وممكن أبدل field بـ getter و setter بعدين من غير ما أغير الكود اللي بيستخدمه." },
        { q: "الـ <code>_</code> بتخلي الـ member private على مستوى إيه في Dart؟", a: "على مستوى الـ library، يعني الملف، مش الكلاس. فكلاسين في نفس الملف يشوفوا private members بعض. مفيش keyword اسمه <code>private</code> في Dart. الدرس العملي: لو عايز تحمي حاجة فعلا حطها في ملف لوحدها." },
      ],
    },
    {
      title: "Static members",
      en: "static fields and methods",
      body: "<p>الـ <code>static</code> تابع للكلاس نفسه مش لـ object معين، وبتنادي عليه بـ <code>ClassName.member</code>. بنستخدمه لثوابت مرتبطة بالكلاس، وعدّادات مشتركة، وأدوات مساعدة. الـ static مفيهوش <code>this</code> ومينفعش يلمس الـ instance fields.</p>",
      code: {
        lang: "dart",
        src: `class Ids {
  static const prefix = 'GR-';
  static int _next = 1;

  static String next() => '$prefix\${_next++}';
}

void main() {
  print(Ids.next());   // GR-1
  print(Ids.next());   // GR-2
  print(Ids.prefix);   // GR-
}`,
        note: "في Flutter: <code>Colors.red</code> و <code>Navigator.of(context)</code> و <code>Duration.zero</code> كلها static.",
      },
      pitfall: "الـ static state بيعيش طول عمر البرنامج ومشترك بين كل الـ objects، وبيصعّب الاختبار. استخدمه للثوابت أكتر من الـ state المتغير.",
    },
    {
      title: "toString والـ cascade",
      en: "toString and the cascade operator ..",
      body: "<p>أي object لو طبعته من غير <code>toString</code> هتشوف <code>Instance of 'Item'</code> وده مش بيفيدك في الـ debugging. اعمل override لـ <code>toString</code>. والـ <b>cascade</b> <code>..</code> بينفذ عدة عمليات على نفس الـ object وبيرجع الـ object نفسه مش نتيجة آخر عملية.</p>",
      code: {
        lang: "dart",
        src: `class Item {
  String name = '';
  int qty = 0;

  @override
  String toString() => 'Item($name x$qty)';
}

void main() {
  final it = Item()
    ..name = 'tea'
    ..qty = 2;
  print(it);                          // Item(tea x2)

  final list = <int>[]..add(1)..add(2);
  print(list);                        // [1, 2]

  Item? maybe;
  maybe
    ?..name = 'x'
    ..qty = 1;                        // skipped: maybe is null
  print(maybe);                       // null
}`,
        note: "<code>?..</code> هي cascade آمنة من null: لو الـ receiver null بتتخطى كل السلسلة.",
      },
    },
    {
      title: "copyWith: نسخة بتعديل واحد",
      en: "Immutable classes and copyWith",
      body: "<p>الـ object اللي كل fields بتاعته <code>final</code> مبيتغيرش (immutable)، وده بيخلي الـ state أسهل في الفهم والاختبار. لما تحتاج نسخة بتغيير حاجة واحدة بتكتب <code>copyWith</code>: كل parameter اختياري nullable، ولو مبعتش قيمة بنستخدم القديمة.</p>",
      code: {
        lang: "dart",
        src: `class User {
  final String name;
  final int age;

  const User({required this.name, required this.age});

  User copyWith({String? name, int? age}) {
    return User(name: name ?? this.name, age: age ?? this.age);
  }

  @override
  String toString() => 'User($name, $age)';
}

void main() {
  const u = User(name: 'Ali', age: 20);
  final older = u.copyWith(age: 21);
  print(u);                           // User(Ali, 20)
  print(older);                       // User(Ali, 21)
  print(u.copyWith(age: null));       // User(Ali, 20): null means "keep"
}`,
        note: "الحد الأساسي: مع <code>?? this.x</code> مينفعش تستخدم <code>copyWith</code> عشان تحط قيمة <code>null</code> صراحة لـ field nullable. المشروعات الكبيرة بتحل ده بـ sentinel أو بـ code generation (freezed).",
      },
      pitfall: "كلاسين بنفس القيم مش <code>==</code> افتراضيا، المقارنة بالـ identity. لو عايز مقارنة بالقيمة لازم تعمل override لـ <code>==</code> و <code>hashCode</code> (أو تستخدم package زي equatable).",
      interview: [
        { q: "ليه بنعمل <code>copyWith</code> بدل ما نعدّل الـ object مباشرة؟", a: "لأن الـ immutable objects أأمن: مفيش حد يغير state من مكان بعيد، وFlutter (بـ Provider أو Bloc أو Riverpod) بيكتشف التغيير بمقارنة المرجع القديم بالجديد، فلازم الـ state الجديد يبقى object جديد. <code>copyWith</code> بيعمل نسخة بنفس القيم ما عدا اللي اتبعت، فالكود قصير وبيعبر عن النية." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: كلاس بـ named parameters",
      lang: "dart",
      code: `class Office {
  final String name;
  final int rating;
  String? phone;

  Office({required this.name, this.rating = 0, this.phone});

  bool get isTop => rating >= 4;
}

void main() {
  final o = Office(name: 'Nile', rating: 5);
  print('\${o.name} top=\${o.isTop}');
}`,
    },
    {
      title: "اكتب: fromJson وtoString",
      lang: "dart",
      code: `class Ad {
  final String title;
  final double price;

  const Ad(this.title, this.price);

  Ad.fromJson(Map<String, dynamic> json)
      : title = json['title'] as String,
        price = (json['price'] as num).toDouble();

  @override
  String toString() => 'Ad($title, $price)';
}

void main() {
  print(Ad.fromJson({'title': 'Flat', 'price': 900}));
}`,
    },
    {
      title: "اكتب: copyWith وstatic",
      lang: "dart",
      code: `class User {
  static int count = 0;
  final String name;
  final int age;

  User({required this.name, required this.age}) {
    count++;
  }

  User copyWith({String? name, int? age}) {
    return User(name: name ?? this.name, age: age ?? this.age);
  }
}

void main() {
  final a = User(name: 'Ali', age: 20);
  final b = a.copyWith(age: 21);
  print('\${b.name} \${b.age} \${User.count}');
}`,
    },
  ],

  tasks: [
    {
      title: "حساب بنكي",
      lang: "dart",
      prompt: "<p>اكتب كلاس <code>BankAccount</code>:</p><ul><li>الرصيد private وبيبدأ من <code>0</code>، وله getter اسمه <code>balance</code> للقراءة بس.</li><li><code>deposit(double amount)</code>: بتزود الرصيد، وترمي <code>ArgumentError</code> لو المبلغ صفر أو سالب.</li><li><code>withdraw(double amount)</code>: بتنقص الرصيد، وترمي <code>StateError</code> لو الرصيد مش كفاية.</li></ul>",
      examples: [
        { in: "final a = BankAccount(); a.deposit(100); a.withdraw(30); a.balance", out: "70.0" },
      ],
      hints: [
        "<code>double _balance = 0;</code> و <code>double get balance =&gt; _balance;</code>.",
        "افحص الشرط الأول وارمي: <code>if (amount &lt;= 0) throw ArgumentError(...)</code>، وبعدين نفذ التعديل.",
      ],
      solution: `class BankAccount {
  double _balance = 0;

  double get balance => _balance;

  void deposit(double amount) {
    if (amount <= 0) throw ArgumentError('amount must be positive');
    _balance += amount;
  }

  void withdraw(double amount) {
    if (amount > _balance) throw StateError('insufficient funds');
    _balance -= amount;
  }
}`,
      explain: "الرصيد private فمحدش يغيره من برا غير من خلال الدوال اللي بتتحقق. الـ getter من غير setter يعني قراءة بس. ده الـ encapsulation: الكلاس بيحمي شرطه الداخلي (الرصيد مش سالب).",
    },
    {
      title: "درجة الحرارة بـ named constructors",
      lang: "dart",
      prompt: "<p>اكتب كلاس <code>Temperature</code> بيخزن <code>final double celsius</code> وفيه:</p><ul><li><code>Temperature.celsius(this.celsius)</code>.</li><li><code>Temperature.fahrenheit(double f)</code> بتحول لمئوي في الـ initializer list: <code>(f - 32) * 5 / 9</code>.</li><li><code>Temperature.boiling()</code> redirecting على <code>celsius(100)</code>.</li><li><code>double toFahrenheit()</code>.</li></ul>",
      examples: [
        { in: "Temperature.fahrenheit(212).celsius", out: "100.0" },
        { in: "Temperature.celsius(0).toFahrenheit()", out: "32.0" },
        { in: "Temperature.boiling().celsius", out: "100.0" },
      ],
      hints: [
        "الـ initializer list: <code>Temperature.fahrenheit(double f) : celsius = (f - 32) * 5 / 9;</code>.",
        "الـ redirecting: <code>Temperature.boiling() : this.celsius(100);</code> وجسمه فاضي.",
      ],
      solution: `class Temperature {
  final double celsius;

  Temperature.celsius(this.celsius);

  Temperature.fahrenheit(double f) : celsius = (f - 32) * 5 / 9;

  Temperature.boiling() : this.celsius(100);

  double toFahrenheit() => celsius * 9 / 5 + 32;
}`,
      explain: "التلات constructors بيشتغلوا على نفس الـ field من طرق مختلفة، ودي فايدة الـ named constructors: الاسم بيقول الوحدة. الـ <code>final</code> field اتعين في الـ initializer list لأنه محسوب من parameter مش field.",
    },
    {
      title: "Todo ثابت بـ copyWith",
      lang: "dart",
      prompt: "<p>اكتب كلاس <code>Todo</code> immutable:</p><ul><li>fields: <code>String title</code> و <code>bool done</code> (الافتراضي <code>false</code>)، بـ <code>const</code> constructor و named parameters.</li><li><code>Todo.fromJson(Map&lt;String, dynamic&gt; json)</code>: المفاتيح <code>title</code> و <code>done</code> (الـ <code>done</code> ممكن تكون مش موجودة يبقى false).</li><li><code>copyWith({String? title, bool? done})</code>.</li><li><code>toString()</code> بترجع <code>Todo(title, done)</code>.</li><li>Getter <code>Todo toggled</code> بيرجع نسخة فيها <code>done</code> معكوسة.</li></ul>",
      examples: [
        { in: "Todo.fromJson({'title': 'Study'})", out: "Todo(Study, false)" },
        { in: "Todo(title: 'A').toggled", out: "Todo(A, true)" },
      ],
      hints: [
        "<code>const Todo({required this.title, this.done = false});</code> و fields الاتنين <code>final</code>.",
        "<code>done = json['done'] as bool? ?? false</code> في الـ initializer list.",
        "<code>toggled</code> يقدر يستخدم <code>copyWith(done: !done)</code>.",
      ],
      solution: `class Todo {
  final String title;
  final bool done;

  const Todo({required this.title, this.done = false});

  Todo.fromJson(Map<String, dynamic> json)
      : title = json['title'] as String,
        done = json['done'] as bool? ?? false;

  Todo copyWith({String? title, bool? done}) {
    return Todo(title: title ?? this.title, done: done ?? this.done);
  }

  Todo get toggled => copyWith(done: !done);

  @override
  String toString() => 'Todo($title, $done)';
}`,
      explain: "الـ <code>as bool?</code> بتحول القيمة الغامضة لـ nullable bool، و <code>?? false</code> بتدي الافتراضي لو المفتاح مش موجود. الكلاس كله immutable فكل تغيير بينتج object جديد، وده نفس شكل state classes في Flutter.",
    },
  ],

  quiz: [
    {
      q: "أنهي سطر فيه خطأ كومبايل؟",
      code: { lang: "dart", src: `class P {
  final int x;
  P(this.x);
}

void main() {
  final p = P(1);       // 1
  print(p.x);           // 2
  p.x = 5;              // 3
  final q = P(2);       // 4
}` },
      options: ["السطر 1", "السطر 2", "السطر 3", "السطر 4"],
      answer: 2,
      why: "<code>x</code> هي <code>final</code> field، فتعيين قيمة تانية لها بعد الإنشاء خطأ. باقي السطور عادية.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `class Tag {
  final String label;
  const Tag(this.label);
}

void main() {
  const a = Tag('x');
  final b = Tag('x');
  print(identical(a, b));
}` },
      options: ["true", "false", "خطأ وقت الكومبايل", "خطأ وقت التشغيل"],
      answer: 1,
      why: "<code>b</code> اتعمل من غير <code>const</code> فهو object جديد في الميموري، حتى لو القيم نفسها. بس لو كان <code>const b = Tag('x')</code> كان هيبقى <code>true</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `class Logger {
  static final _cache = <String, Logger>{};
  final String name;
  Logger._(this.name);
  factory Logger(String name) =>
      _cache.putIfAbsent(name, () => Logger._(name));
}

void main() {
  print(identical(Logger('a'), Logger('a')));
}` },
      answer: ["true"],
      why: "الـ factory constructor بيرجّع الـ object المخزن في الـ cache لو الاسم موجود، فالاستدعاءين بيرجعوا نفس الـ object.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final x = <int>[]..add(1)..add(2);
print(x.length);` },
      answer: ["2"],
      why: "الـ cascade <code>..</code> بينفذ <code>add</code> مرتين على نفس القايمة، والتعبير كله بيرجع القايمة نفسها، فـ <code>x.length</code> = 2.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `class User {
  final String name;
  final int age;
  const User({required this.name, required this.age});
  User copyWith({String? name, int? age}) =>
      User(name: name ?? this.name, age: age ?? this.age);
}

void main() {
  const u = User(name: 'A', age: 20);
  print(u.copyWith(age: null).age);
}` },
      options: ["<code>null</code>", "<code>0</code>", "<code>20</code>", "خطأ وقت الكومبايل"],
      answer: 2,
      why: "<code>age: null</code> بتخلي الـ parameter nullable يبقى null، فـ <code>age ?? this.age</code> بترجع القيمة القديمة 20. ودي حدود النمط ده: مينفعش تصفّر field عن طريق copyWith.",
    },
    {
      q: "الـ <code>_</code> قبل اسم member في Dart بتخليه private على مستوى إيه؟",
      options: [
        "الكلاس بس، حتى الكلاس اللي في نفس الملف مش هيشوفه",
        "الملف (library) كله",
        "الـ package كله",
        "الـ object الواحد، كل object يشوف بتاعه بس",
      ],
      answer: 1,
      why: "الخصوصية في Dart على مستوى الـ library، وهو الملف. أي كلاس تاني في نفس الملف يقدر يشوف <code>_x</code>، وأي ملف تاني مش هيشوفه.",
    },
    {
      q: "أنهي استخدام صح؟",
      code: { lang: "dart", src: `class Ids {
  static int _next = 1;
  static int next() => _next++;
  int get current => _next;
}` },
      options: [
        "<code>Ids().next()</code>",
        "<code>Ids.next()</code>",
        "<code>Ids.current</code>",
        "<code>Ids.current()</code>",
      ],
      answer: 1,
      why: "الـ static بيتنادي على اسم الكلاس: <code>Ids.next()</code>. <code>current</code> getter عادي (instance) فمحتاج object، ومينفعش يتنادي بأقواس أصلا.",
    },
    {
      q: "ليه الكلاس ده مش هيعدي من الكومبايل؟",
      code: { lang: "dart", src: `class Config {
  String env;
  const Config(this.env);
}` },
      options: [
        "لأن <code>const</code> constructor ممنوع على الـ String",
        "لأن اسم الـ field لازم يبدأ بـ underscore",
        "لأن الـ const constructor محتاج كل الـ fields تبقى <code>final</code>",
        "لأن الـ constructor لازم يكون named",
      ],
      answer: 2,
      why: "الـ object الـ const لازم ميتغيرش أبدا، فكل fields الكلاس لازم تبقى <code>final</code>. الحل: <code>final String env;</code>.",
    },
    {
      q: "أنهي طريقة صح لتعيين <code>final int size</code> محسوبة من parameters الـ constructor؟",
      options: [
        "جسم الـ constructor: <code>Range(int a, int b) { size = b - a; }</code>",
        "الـ initializer list: <code>Range(int a, int b) : size = b - a;</code>",
        "<code>Range(int a, int b) =&gt; size = b - a;</code>",
        "<code>Range(int a, int b) { this.size() = b - a; }</code>",
      ],
      answer: 1,
      why: "الـ final field لازم يتعين قبل ما جسم الـ constructor يشتغل، والمكان لده هو الـ initializer list بعد <code>:</code>. التعيين في الجسم متأخر عن اللازم.",
    },
  ],
};
