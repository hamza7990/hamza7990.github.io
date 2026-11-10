window.LEVELS = window.LEVELS || {};
window.LEVELS["dart/d2"] = {
  slides: [
    {
      kicker: "ليه الدوال مهمة",
      title: "في Dart الدالة هي object زيها زي أي قيمة",
      en: "Functions are first-class objects",
      body: "<p>في Dart تقدر تحط دالة في متغير، تبعتها كـ parameter لدالة تانية، وترجعها من دالة. ده مش تفصيلة نظرية: كل <code>onPressed:</code> و <code>builder:</code> و <code>map(...)</code> و <code>where(...)</code> بتشوفها في Flutter هي بالظبط كده.</p><p>وتاني حاجة: شكل الـ parameters في Dart (positional و named و required) هو اللي بيدّي الـ widgets شكلها المعروف <code>Text('hi', style: ...)</code>. لو فهمت الشكل ده كويس نص كود Flutter بيبقى مقروء.</p>",
      points: [
        "الإنترفيو بيسأل: إيه الفرق بين positional و named؟ إيه الـ closure؟ إيه الفرق بين <code>=&gt;</code> والـ block؟",
        "المستوى ده بيغطي: الـ parameters بأنواعها، arrow syntax، الدوال كقيم، الـ closures، <code>typedef</code>، و tear-offs.",
      ],
    },
    {
      title: "تعريف دالة و arrow syntax",
      en: "Return type, positional parameters, =>",
      body: "<p>الدالة بتبدأ بنوع الرجوع، بعدين الاسم، بعدين الـ parameters. لو الدالة جسمها <b>تعبير واحد</b> ممكن تكتبها بـ <code>=&gt;</code> بدل الأقواس و <code>return</code>. نوع الرجوع <code>void</code> معناه مفيش قيمة راجعة.</p>",
      code: {
        lang: "dart",
        src: `int add(int a, int b) {
  return a + b;
}

int square(int x) => x * x;          // same as { return x * x; }

void greet(String name) => print('Hi $name');

void main() {
  print(add(2, 3));    // 5
  print(square(4));    // 16
  greet('Hamza');      // Hi Hamza
}`,
        note: "الـ parameters الأساسية اسمها <b>positional</b>: الترتيب هو اللي بيحدد أنهي قيمة لأنهي parameter، ومفيش مفر منها: لازم تتبعت كلها.",
      },
      pitfall: "<code>=&gt;</code> بتقبل تعبير واحد بس، مش جمل. مينفعش تكتب <code>=&gt; if (...) ...</code> ولا تحط فيها <code>return</code>. لو محتاج أكتر من تعبير استخدم الأقواس.",
    },
    {
      title: "Optional positional: [ ]",
      en: "Optional positional parameters",
      body: "<p>لو parameter ممكن يتساب، حطه جوه <code>[ ]</code> في آخر القايمة. له حلين: يا <b>nullable</b> (بيبقى <code>null</code> لو مبعتوش)، يا يكون له <b>default value</b>.</p>",
      code: {
        lang: "dart",
        src: `String label(String text, [String? suffix]) {
  return suffix == null ? text : '$text $suffix';
}

String pad(String s, [int width = 5]) => s.padLeft(width, '*');

void main() {
  print(label('Total'));          // Total
  print(label('Total', 'EGP'));   // Total EGP
  print(pad('7'));                // ****7
  print(pad('7', 3));             // **7
}`,
        note: "الـ default لازم يكون <code>const</code> (قيمة معروفة وقت الكومبايل). ولو الـ parameter مش nullable ومفيش له default الـ compiler هيرفض.",
      },
      pitfall: "الـ optional positional صعب يتقرا عند الاستدعاء: <code>draw(10, 20, true, false)</code> مين فيهم إيه؟ لو عندك أكتر من parameter اختياري، روح للـ named.",
    },
    {
      title: "Named parameters: { } و required",
      en: "Named and required named parameters",
      body: "<p>جوه <code>{ }</code> الـ parameters بتتبعت بالاسم والترتيب مش مهم. الأصل إنها <b>اختيارية</b>، فلازم تعمل واحدة من ثلاثة: تخليها nullable، أو تدّيها default، أو تكتب <code>required</code> قدامها فيبقى إجباري.</p>",
      code: {
        lang: "dart",
        src: `String buildUrl(
  String host, {
  int port = 80,
  bool secure = false,
  required String path,
  int? limit,
}) {
  final scheme = secure ? 'https' : 'http';
  final query = limit == null ? '' : '?limit=$limit';
  return '$scheme://$host:$port$path$query';
}

void main() {
  print(buildUrl('example.com', path: '/offices'));
  print(buildUrl('example.com', path: '/map', secure: true, port: 443));
  print(buildUrl('example.com', limit: 10, path: '/ads'));
}`,
        note: "الناتج: <code>http://example.com:80/offices</code> ثم <code>https://example.com:443/map</code> ثم <code>http://example.com:80/ads?limit=10</code>. الترتيب بين الـ named حر.",
      },
      focus: [{ label: "في Flutter", text: "كل widget constructor بيستخدم الشكل ده: <code>Padding(padding: ..., child: ...)</code>. و <code>required this.child</code> هي بالظبط <code>required</code> اللي شفتها. مينفعش تخلط <code>[ ]</code> و <code>{ }</code> في نفس الدالة." }],
      interview: [
        { q: "إيه الفرق بين positional و named parameters؟ وإمتى تستخدم كل واحد؟", a: "الـ positional بيتحدد بالترتيب، والـ named بيتحدد بالاسم عند الاستدعاء والترتيب مش مهم. بستخدم positional لما الـ parameters قليلة وواضحة من الاسم (<code>add(2, 3)</code>)، و named لما فيه أكتر من اتنين أو فيه قيم bool/اختيارية، لأن <code>buildUrl(secure: true)</code> بتتقرا من نفسها. و <code>required</code> بتخلي named parameter إجباري، والـ compiler بيرفض الاستدعاء من غيره." },
        { q: "ليه الكود ده بيدي خطأ؟ <code>void show({int count}) {}</code>", a: "لأن الـ named parameter اختياري افتراضيا، فلو مبعتش قيمة هيبقى <code>null</code>، و <code>int</code> مش nullable. الحل واحد من ثلاثة: <code>{int? count}</code> أو <code>{int count = 0}</code> أو <code>{required int count}</code>." },
      ],
    },
    {
      title: "دالة تتحط في متغير: anonymous functions",
      en: "Functions as values",
      body: "<p>اسم الدالة من غير أقواس هو الدالة نفسها (قيمة). و<b>الدالة المجهولة</b> (anonymous function أو lambda) هي دالة من غير اسم بتكتبها في مكانها. شكلها: <code>(params) =&gt; expression</code> أو <code>(params) { statements }</code>.</p>",
      code: {
        lang: "dart",
        src: `int twice(int x) => x * 2;

void main() {
  final f = twice;                  // no (): this is the function itself
  print(f(4));                      // 8

  int Function(int) g = (x) => x + 1;   // anonymous, type written out
  print(g(4));                      // 5

  final nums = [1, 2, 3];
  nums.forEach((n) {
    print(n * 10);                  // 10, 20, 30 (one per line)
  });
  print(nums.map((n) => n * 2).toList());   // [2, 4, 6]
}`,
        note: "نوع الدالة بيتكتب <code>int Function(int)</code>: نوع الرجوع، كلمة <code>Function</code>، وأنواع الـ parameters. <code>f(4)</code> بتنادي، و <code>f</code> لوحدها بتشاور على الدالة من غير ما تشغلها.",
      },
      terms: [
        ["anonymous function", "دالة مجهولة (lambda)", "دالة من غير اسم بتتكتب في مكان استخدامها."],
        ["first-class", "قيمة عادية", "الدالة تتخزن وتتبعت وترجع زي أي object."],
      ],
    },
    {
      title: "الـ closure: الدالة بتفتكر اللي حواليها",
      en: "Closures",
      body: "<p>لما دالة بتتعمل جوه دالة تانية وبتستخدم متغير من برّاها، الدالة دي بتشيل المتغير ده معاها حتى بعد ما الدالة الأم تخلص. ده الـ <b>closure</b>. مهم تفهم إنها بتمسك <b>المتغير نفسه</b> مش نسخة من قيمته.</p>",
      codes: [
        {
          lang: "dart",
          title: "كل استدعاء ليه عداد خاص",
          src: `int Function() makeCounter() {
  var count = 0;
  return () {
    count++;
    return count;
  };
}

void main() {
  final a = makeCounter();
  final b = makeCounter();
  print(a());   // 1
  print(a());   // 2
  print(b());   // 1  (its own count)
}`,
        },
        {
          lang: "dart",
          title: "بتشوف آخر قيمة للمتغير",
          src: `void main() {
  var x = 1;
  final show = () => x;
  x = 2;
  print(show());   // 2, not 1
}`,
        },
      ],
      pitfall: "الـ closure مش بتاخد snapshot من القيمة وقت ما اتعملت. لو المتغير اتغير بعدها هتشوف القيمة الجديدة. ده سبب bugs في callbacks بتتنفذ بعد ثواني.",
      interview: [
        { q: "يعني إيه closure؟ مثال.", a: "هو دالة بتفتكر المتغيرات اللي كانت في النطاق اللي اتعرفت فيه حتى بعد ما النطاق ده يخلص. مثال: <code>makeCounter()</code> بترجع دالة بتزود <code>count</code> المعرّف جوا <code>makeCounter</code>، وكل استدعاء بيعمل <code>count</code> مستقل. وبتمسك المتغير نفسه مش قيمته، فلو اتغير بعد كده الـ closure تشوف التغيير." },
      ],
    },
    {
      title: "typedef والدوال العليا",
      en: "typedef and higher-order functions",
      body: "<p>الدالة اللي بتاخد دالة كـ parameter أو بترجع دالة اسمها <b>higher-order function</b>. ولما نوع الدالة يطول ويتكرر نديه اسم بـ <code>typedef</code>.</p>",
      code: {
        lang: "dart",
        src: `typedef IntTest = bool Function(int value);
typedef Json = Map<String, dynamic>;

List<int> keep(List<int> items, IntTest test) {
  final out = <int>[];
  for (final item in items) {
    if (test(item)) out.add(item);
  }
  return out;
}

int Function(int) multiplier(int k) => (x) => x * k;

void main() {
  print(keep([1, 2, 3, 4], (n) => n.isEven));   // [2, 4]
  final triple = multiplier(3);
  print(triple(5));                              // 15
}`,
        note: "<code>keep</code> بتاخد دالة (<code>test</code>) وبتسيبها هي تقرر. و <code>multiplier</code> بترجع دالة جديدة (وده closure على <code>k</code>). نفس فكرة <code>list.where(...)</code>.",
      },
      focus: [{ label: "في Flutter", text: "<code>VoidCallback</code> هو <code>typedef VoidCallback = void Function()</code>، و <code>ValueChanged&lt;T&gt;</code> هو <code>void Function(T value)</code>. لما تشوف <code>final VoidCallback onTap</code> في widget، ده نفس الكلام." }],
      interview: [
        { q: "إيه هو الـ higher-order function؟ اديني مثال من اللغة نفسها.", a: "دالة بتاخد دالة كـ parameter أو بترجع دالة. في Dart مثال جاهز: <code>list.where((n) =&gt; n.isEven)</code> بتاخد الشرط كدالة، و <code>map</code> و <code>fold</code> و <code>sort</code> كمان. الفايدة إني بفصل «الحلقة» عن «القرار»: الدالة العليا بتلف، وأنا بديها القرار." },
      ],
    },
    {
      title: "Tear-offs: الاسم بدل الـ lambda",
      en: "Tear-offs",
      body: "<p>لو الـ lambda بتاخد نفس الـ parameters وبتنادي دالة تانية بالظبط، اكتب اسم الدالة بس. ده الـ <b>tear-off</b>. بيشتغل مع الدوال، الـ methods، الـ static، وحتى الـ constructors (<code>User.new</code>، من Dart 2.15).</p>",
      code: {
        lang: "dart",
        src: `class User {
  final String name;
  User(this.name);
  @override
  String toString() => 'User($name)';
}

void main() {
  final names = ['Ali', 'Sara'];

  names.forEach(print);                    // = (n) => print(n)
  print(['1', '2'].map(int.parse).toList());   // [1, 2]
  print(names.map(User.new).toList());     // [User(Ali), User(Sara)]

  final up = 'abc'.toUpperCase;            // bound to this string
  print(up());                             // ABC
}`,
        note: "الـ tear-off على method بيفضل مربوط بالـ object اللي اتاخد منه (<code>up</code> فوق مربوطة بـ <code>'abc'</code>).",
      },
      pitfall: "الفرق بين <code>onPressed: save</code> و <code>onPressed: save()</code>: التانية بتنادي الدالة فورا وبتبعت نتيجتها، مش الدالة. وفي الـ lambda <code>() =&gt; save(x)</code> بتتنادي لما الحدث يحصل بس.",
      interview: [
        { q: "إيه الفرق بين <code>onTap: _save</code> و <code>onTap: () =&gt; _save()</code>؟", a: "الاتنين بيدّوا نفس النتيجة لما شكل <code>_save</code> يطابق نوع الـ callback. الأولى tear-off: بتبعت الدالة نفسها. التانية بتلف الدالة في lambda جديدة. الـ tear-off أقصر، واللامدا لازم لما أعدّل الـ arguments، زي <code>() =&gt; _save(id)</code>. وأخطر غلطة <code>onTap: _save()</code> لأنها بتشغل الدالة وقت البناء." },
        { q: "إيه شروط الـ default value في parameter؟", a: "لازم تكون قيمة <code>const</code> معروفة وقت الكومبايل، يعني رقم أو نص أو <code>const []</code> أو <code>null</code>. مينفعش تكون <code>DateTime.now()</code> أو متغير عادي. لو محتاج قيمة محسوبة وقت التشغيل خلي الـ parameter nullable واحسبها جوه الدالة بـ <code>??</code>." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: positional و optional",
      lang: "dart",
      code: `int add(int a, int b) => a + b;

String label(String text, [String? suffix]) {
  return suffix == null ? text : '$text $suffix';
}

void main() {
  print(add(2, 3));
  print(label('Total', 'EGP'));
  print(label('Total'));
}`,
    },
    {
      title: "اكتب: named و required",
      lang: "dart",
      code: `String buildUrl(
  String host, {
  int port = 80,
  bool secure = false,
  required String path,
}) {
  final scheme = secure ? 'https' : 'http';
  return '$scheme://$host:$port$path';
}

void main() {
  print(buildUrl('example.com', path: '/map'));
  print(buildUrl('example.com', path: '/map', secure: true));
}`,
      note: "خد بالك من الفاصلة بعد آخر parameter (trailing comma): الـ formatter بيحبها وهي الشكل المعتاد في Flutter.",
    },
    {
      title: "اكتب: closure و typedef",
      lang: "dart",
      code: `typedef IntTest = bool Function(int value);

int Function() makeCounter() {
  var count = 0;
  return () => ++count;
}

List<int> keep(List<int> items, IntTest test) {
  return items.where(test).toList();
}

void main() {
  final next = makeCounter();
  next();
  print(next());
  print(keep([1, 2, 3, 4], (n) => n.isEven));
}`,
    },
  ],

  tasks: [
    {
      title: "دالة بترجع دالة",
      lang: "dart",
      prompt: "<p>اكتب دالتين:</p><ul><li><code>int applyTwice(int Function(int) f, int x)</code> بتطبق <code>f</code> مرتين: <code>f(f(x))</code>.</li><li><code>int Function(int) multiplier(int k)</code> بترجع دالة بتضرب أي رقم في <code>k</code>.</li></ul>",
      examples: [
        { in: "applyTwice((n) => n + 3, 10)", out: "16" },
        { in: "multiplier(3)(5)", out: "15" },
        { in: "applyTwice(multiplier(2), 5)", out: "20" },
      ],
      hints: [
        "<code>applyTwice</code> سطر واحد: نادي <code>f</code> على نتيجة <code>f</code>.",
        "<code>multiplier</code> بترجع lambda: <code>(x) =&gt; x * k</code>. الـ <code>k</code> هتتفضل متخزنة فيها (closure).",
      ],
      solution: `int applyTwice(int Function(int) f, int x) => f(f(x));

int Function(int) multiplier(int k) => (x) => x * k;`,
      explain: "<code>applyTwice</code> هي higher-order function: بتاخد سلوك كـ parameter. و <code>multiplier</code> بترجع closure بتفتكر <code>k</code>. استدعاء <code>multiplier(3)(5)</code> معناه: نادي <code>multiplier(3)</code> الأول، وبعدين نادي الدالة الراجعة بـ 5.",
    },
    {
      title: "تنسيق السعر بـ named parameters",
      lang: "dart",
      prompt: "<p>اكتب <code>String formatPrice(double amount, {String currency = 'SAR', int decimals = 2, bool showCurrency = true})</code>. بترجع الرقم بعدد الخانات العشرية المطلوب، وبعده مسافة والعملة لو <code>showCurrency</code> صح.</p>",
      examples: [
        { in: "formatPrice(12.5)", out: "12.50 SAR" },
        { in: "formatPrice(3, currency: 'EGP', decimals: 0)", out: "3 EGP" },
        { in: "formatPrice(9.99, showCurrency: false)", out: "9.99" },
      ],
      starter: `String formatPrice(
  double amount, {
  String currency = 'SAR',
  int decimals = 2,
  bool showCurrency = true,
}) {
  // your code
}`,
      hints: [
        "الرقم بخانات محددة: <code>amount.toStringAsFixed(decimals)</code>.",
        "ابني النص الأول، وبعدين ضيف العملة بـ <code>if</code> أو بـ ternary.",
      ],
      solution: `String formatPrice(
  double amount, {
  String currency = 'SAR',
  int decimals = 2,
  bool showCurrency = true,
}) {
  final number = amount.toStringAsFixed(decimals);
  return showCurrency ? '$number $currency' : number;
}`,
      explain: "كل named parameter ليه default فمفيش داعي للـ <code>required</code> ولا nullable. لاحظ إن <code>formatPrice(3)</code> مقبولة رغم إن 3 literal من نوع int، لأن Dart بتحول literal الرقم الصحيح لـ double لما النوع المتوقع double.",
    },
    {
      title: "retry: دالة تاخد دالة",
      lang: "dart",
      prompt: "<p>اكتب <code>int retry(int times, bool Function() action)</code>: بتنادي <code>action</code> لحد <code>times</code> مرات، وأول ما ترجع <code>true</code> تقف وترجع رقم المحاولة اللي نجحت (يبدأ من 1). لو كل المحاولات فشلت ترجع <code>-1</code>.</p>",
      examples: [
        { in: "retry(3, () => true)", out: "1" },
        { in: "retry(2, () => false)", out: "-1" },
      ],
      hints: [
        "<code>for</code> من 1 لحد <code>times</code>، وجواها <code>if (action()) return attempt;</code>.",
        "لو اللفة خلصت من غير return، يبقى كلهم فشلوا: <code>return -1;</code>.",
      ],
      solution: `int retry(int times, bool Function() action) {
  for (var attempt = 1; attempt <= times; attempt++) {
    if (action()) return attempt;
  }
  return -1;
}

void main() {
  var calls = 0;
  print(retry(5, () => ++calls == 3));   // 3
  print(retry(2, () => false));          // -1
}`,
      explain: "الـ lambda جوه <code>main</code> بتعمل closure على <code>calls</code>: كل استدعاء بيزود العداد، فالمحاولة التالتة هي اللي ترجع true. نفس الفكرة بتتستخدم في إعادة محاولة طلبات الشبكة.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `String label(String text, [String? suffix]) {
  return suffix == null ? text : '$text $suffix';
}

void main() {
  print(label('A'));
  print(label('A', 'B'));
}` },
      options: ["A ثم A B", "A ثم A", "خطأ وقت الكومبايل", "A null ثم A B"],
      answer: 0,
      why: "<code>suffix</code> optional ومش متبعت في المرة الأولى فبيبقى null، والشرط بيرجع <code>text</code> لوحده. المرة التانية بيدخل في النص الاتنين بمسافة.",
    },
    {
      q: "أنهي استدعاء صح لـ <code>void show(String title, {required int id, bool bold = false})</code>؟",
      options: [
        "<code>show('A', 7)</code>",
        "<code>show(id: 7, 'A')</code>",
        "<code>show('A', bold: true)</code>",
        "<code>show('A', bold: true, id: 7)</code>",
      ],
      answer: 3,
      why: "<code>id</code> مطلوب بالاسم فلازم يتبعت. الأول بيبعته positional (غلط)، والتاني بيحط positional بعد named، والتالت ناسي <code>id</code>. الرابع الوحيد الصح، والترتيب بين الـ named حر.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `int Function() makeCounter() {
  var count = 0;
  return () => ++count;
}

void main() {
  final a = makeCounter();
  final b = makeCounter();
  a();
  a();
  print(b() + a());
}` },
      answer: ["4"],
      why: "كل <code>makeCounter()</code> بيعمل <code>count</code> مستقل. <code>a</code> اتنادت مرتين فـ <code>count</code> بتاعها 2، وفي الآخر <code>b()</code> بترجع 1 و <code>a()</code> بترجع 3، والمجموع 4.",
    },
    {
      q: "أنهي تعريف هيدي خطأ كومبايل؟",
      options: [
        "<code>void f({int? count}) {}</code>",
        "<code>void f({int count = 0}) {}</code>",
        "<code>void f({int count}) {}</code>",
        "<code>void f({required int count}) {}</code>",
      ],
      answer: 2,
      why: "الـ named parameter اختياري، فلو مبعتش قيمة هيبقى null، و <code>int</code> مش nullable ومفيش default. باقي الاختيارات كل واحد بيحل المشكلة بطريقة: nullable أو default أو required.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `void main() {
  var x = 1;
  final show = () => x;
  x = 2;
  print(show());
}` },
      options: ["1", "2", "null", "خطأ وقت الكومبايل"],
      answer: 1,
      why: "الـ closure بتمسك المتغير <code>x</code> نفسه مش نسخة من قيمته وقت التعريف. لما <code>show()</code> اتنادت كان <code>x</code> بـ 2.",
    },
    {
      q: "أنهي سطر بيعمل نفس شغل <code>names.forEach((n) =&gt; print(n));</code>؟",
      options: [
        "<code>names.forEach(print());</code>",
        "<code>names.forEach(() =&gt; print);</code>",
        "<code>names.forEach(print);</code>",
        "<code>names.forEach(print(n));</code>",
      ],
      answer: 2,
      why: "<code>print</code> من غير أقواس هي الدالة نفسها (tear-off) وبتتنادي على كل عنصر. <code>print()</code> بتشغلها فورا من غير arguments وبتبعت نتيجتها (void)، وده غلط.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `int Function(int) multiplier(int k) => (x) => x * k;

void main() {
  final f = multiplier(3);
  print(f(f(2)));
}` },
      answer: ["18"],
      why: "<code>f(2)</code> = 6، و <code>f(6)</code> = 18. الـ <code>k</code> بتفضل 3 جوه الـ closure.",
    },
    {
      q: "ليه الـ <code>=&gt;</code> مش مناسبة للدالة دي؟",
      code: { lang: "dart", src: `// Needs: print the value, then return it doubled
int show(int v) {
  print(v);
  return v * 2;
}` },
      options: [
        "لأن الـ arrow مينفعش تكون مع int",
        "لأن الـ arrow بتقبل تعبير واحد بس، والدالة فيها جملتين",
        "لأن الدوال اللي بتطبع لازم تكون void",
        "لأن الـ arrow بتغير نوع الرجوع",
      ],
      answer: 1,
      why: "<code>=&gt;</code> اختصار لـ <code>{ return expression; }</code> فيها تعبير واحد بس. الدالة هنا فيها جملتين (طباعة ثم return) فمحتاجة الأقواس.",
    },
    {
      q: "إيه اللي بيحصل هنا في Flutter؟ <code>onPressed: save()</code>",
      options: [
        "بتبعت الدالة <code>save</code> وتتنادي عند الضغط",
        "بتنادي <code>save</code> فورا وقت البناء وبتبعت نتيجتها للـ onPressed",
        "بتتنادي مرتين",
        "مفيش فرق بينها وبين <code>onPressed: save</code>",
      ],
      answer: 1,
      why: "الأقواس معناها استدعاء. الدالة هتشتغل فورا ومش عند الضغط، وغالبا هيطلع خطأ نوع لأن <code>onPressed</code> مستني دالة مش <code>void</code>. الصح <code>onPressed: save</code> أو <code>() =&gt; save()</code>.",
    },
  ],
};
