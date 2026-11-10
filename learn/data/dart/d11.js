window.LEVELS = window.LEVELS || {};
window.LEVELS["dart/d11"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "async مش معناها «شغل متوازي»",
      en: "Why isolates, equality and immutability",
      body: "<p><code>await</code> بتحل مشكلة <b>الانتظار</b> (شبكة، ملفات). لكن لو عندك شغل <b>بيأكل CPU</b>، زي parsing لملف JSON حجمه 10MB أو معالجة صورة، الـ <code>async</code> مش هتنفع: الحسابات نفسها بتحصل على نفس الـ thread اللي بيرسم الشاشة، فالـ UI هتتجمد. الحل: <b>isolate</b>.</p><p>وفي النص التاني من المستوى: إزاي Dart بتقرر إن object «يساوي» التاني، وليه الـ immutable state هو أساس الـ state management في Flutter.</p>",
      points: [
        "الإنترفيو بيسأل: isolate إيه؟ إمتى تحتاجه؟ ليه لازم تعمل override لـ <code>==</code> و <code>hashCode</code> مع بعض؟",
        "وليه Bloc و Provider بيطلبوا state جديد في كل تغيير؟",
      ],
    },
    {
      title: "إيه هو الـ Isolate",
      en: "What an isolate is",
      body: "<p>الـ <b>isolate</b> هو «عالم» مستقل: ليه <b>ميموري خاصة بيه</b> و<b>event loop خاص بيه</b> و thread خاص. مفيش ميموري مشتركة بين isolate وتاني، فمفيش مشاكل race conditions ولا locks. التواصل الوحيد بيحصل بـ <b>إرسال رسايل</b> (message passing) بتتنسخ من جهة للتانية. تطبيقك بيبدأ بـ isolate واحد اسمه <b>main isolate</b>، وده اللي بيرسم الـ UI.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:isolate';

int counter = 0;

Future<void> main() async {
  final result = await Isolate.run(() {
    counter = 100;               // changes the isolate's own copy
    return counter + 1;
  });
  print(result);                 // 101
  print(counter);                // 0: main's memory was not touched
}`,
        note: "المتغير العام <code>counter</code> في كل isolate نسخة لوحدها. اللي اتغير هناك ما أثرش هنا.",
      },
      terms: [
        ["isolate", "عالم معزول", "ميموري وevent loop خاصين. بيتواصل برسايل بس."],
        ["message passing", "تبادل رسايل", "البيانات بتتنسخ من isolate لـ isolate بدل ما تتشارك."],
      ],
      interview: [
        { q: "إيه هو الـ isolate في Dart؟ وإيه الفرق بينه وبين thread عادي؟", a: "الـ isolate وحدة تنفيذ ليها ميموري خاصة وevent loop خاص، ومفيش ميموري مشتركة بين isolates، بتتواصل بإرسال رسايل بس. الـ thread العادي في لغات تانية بيشارك الميموري مع باقي الـ threads، وده بيخلق race conditions وبيحتاج locks. في Dart العزل ده بيمنع النوع ده من المشاكل أصلا." },
      ],
    },
    {
      title: "Isolate.run و compute",
      en: "Isolate.run and compute",
      body: "<p><code>Isolate.run(() =&gt; ...)</code> (من Dart 2.19) أبسط طريقة: بتعمل isolate جديد، بتشغّل الدالة جواه، بترجّع النتيجة كـ <code>Future</code>، وبتقفله لوحدها. لو الدالة رمت exception بيوصل للي بيعمل <code>await</code>. وفي Flutter فيه <code>compute(function, message)</code> بتعمل نفس الفكرة، لكن الدالة لازم تكون top-level أو static. والأحدث والأبسط هو <code>Isolate.run</code>.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:convert';
import 'dart:isolate';

List<Object?> parseNumbers(String json) {
  return jsonDecode(json) as List<Object?>;
}

Future<void> main() async {
  final raw = jsonEncode(List.generate(5, (i) => i * i));

  final parsed = await Isolate.run(() => parseNumbers(raw));
  print(parsed);                          // [0, 1, 4, 9, 16]

  try {
    await Isolate.run(() => throw FormatException('inside'));
  } on FormatException catch (e) {
    print('caught: \${e.message}');       // caught: inside
  }
}`,
        note: "هنا المثال صغير للتوضيح. الفايدة الحقيقية لما الـ JSON كبير (آلاف العناصر) وبياخد عشرات الملي ثانية على الـ main isolate.",
      },
      focus: [{ label: "القاعدة", text: "شغل بيستنى (شبكة، ملف) = <code>async/await</code> كفاية. شغل بيحسب بقوة (CPU) ولو اتعمل على الـ main isolate هيتجمد معاه الـ UI = <code>Isolate.run</code> / <code>compute</code>." }],
      interview: [
        { q: "إمتى تحتاج isolate؟ وإمتى async كفاية؟", a: "الـ async/await بتحل الانتظار على I/O زي الشبكة والملفات، لأن الـ thread بيكون فاضي أثناء الانتظار. لكن لو فيه حسابات تقيلة (parse لـ JSON كبير، تشفير، معالجة صور) فهي بتحجز الـ thread نفسه والـ UI بتتجمد حتى لو الدالة async. وقتها بشغّل الشغل ده في isolate بـ <code>Isolate.run</code> أو <code>compute</code> في Flutter، وأستلم النتيجة كـ Future." },
      ],
    },
    {
      title: "إيه اللي ينفع يتبعت وبكام",
      en: "Sendable data and the cost of an isolate",
      body: "<p>الرسايل بتتنسخ، فينفع تبعت الأنواع البسيطة (<code>int</code>, <code>String</code>, <code>bool</code>, <code>null</code>)، والـ <code>List</code> و<code>Map</code> و<code>Set</code> اللي جواها حاجات تتبعت، والـ records، وأغلب objects الكلاسات اللي بتعملها. مينفعش تبعت objects بتمسك resources من النظام زي <code>ReceivePort</code> أو sockets، ولو حصل بيرمي <code>ArgumentError</code>. والـ closure بتاخد معاها المتغيرات اللي حواليها، فخلي بالك مما تتقفل عليه.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:isolate';

Future<void> unsendable() async {
  final port = ReceivePort();
  try {
    await Isolate.run(() => port);        // returns an unsendable object
  } catch (e) {
    print(e.runtimeType);                 // ArgumentError
  }
  port.close();
}

Future<void> main() async {
  await unsendable();

  final names = ['a', 'b', 'c'];          // plain data is fine
  final upper = await Isolate.run(
    () => names.map((n) => n.toUpperCase()).toList(),
  );
  print(upper);                           // [A, B, C]
}`,
        note: "الأفضل تعمل الـ isolate يشتغل على دالة top-level بتاخد المدخلات كـ parameters، فتتأكد إنه مبياخدش معاه غير اللي محتاجه.",
      },
      pitfall: "عمل isolate مش مجاني: بيحتاج وقت تشغيل وميموري، وبتتنسخ البيانات رايح جاي. لو الشغل أخف من حوالي frame واحد (16ms) غالبا العمل isolate هيكلفك أكتر ما هيوفر. وفي الـ isolate الخلفي plugins كتير مش بتشتغل مباشرة لأنها مرتبطة بالـ main isolate.",
      interview: [
        { q: "إيه التكلفة وإيه حدود استخدام الـ isolate؟", a: "إنشاء isolate بياخد وقت وميموري، والبيانات بتتنسخ في الإرسال والاستقبال، فلو الشغل خفيف مش هيستاهل. ومينفعش تبعت objects مربوطة بموارد النظام زي <code>ReceivePort</code> أو sockets (بيرمي <code>ArgumentError</code>). فبشغّل isolate للشغل التقيل فعلا وبمرّر له بيانات بسيطة وبرجّع نتيجة صغيرة." },
      ],
    },
    {
      title: "== و identical",
      en: "Equality: identical vs ==",
      body: "<p><code>identical(a, b)</code> بتسأل: «هل الاتنين نفس الـ object في الميموري؟». و<code>a == b</code> بتسأل: «هل متساويين»، وتعريف التساوي بتاع كل كلاس. الـ <code>==</code> الافتراضي في <code>Object</code> بيعمل نفس الحاجة بتاعة <code>identical</code>، فاتنين objects من كلاسك بنفس البيانات <b>مش</b> متساويين غير لو عملت override. (الأنواع الجاهزة زي <code>int</code> و<code>String</code> عاملة override وبتقارن بالقيمة.)</p>",
      code: {
        lang: "dart",
        src: `class Point {
  final int x;
  final int y;
  const Point(this.x, this.y);
}

void main() {
  final a = Point(1, 2);
  final b = Point(1, 2);
  print(a == b);                 // false: default == is identity
  print(identical(a, a));        // true
  print('ab' == 'a' + 'b');      // true: String compares by value
  print([1] == [1]);             // false: List compares by identity
}`,
        note: "حتى الـ <code>List</code> و<code>Map</code> بيقارنوا بالـ identity في <code>==</code>. للمقارنة بالمحتوى استخدم <code>package:collection</code> (مثلا <code>ListEquality</code>) أو <code>listEquals</code> في Flutter.",
      },
    },
    {
      title: "override لـ == و hashCode مع بعض",
      en: "Overriding == and hashCode",
      body: "<p>لو عملت override لـ <code>==</code> لازم تعمل <code>hashCode</code> بنفس الحقول. القاعدة (العقد): <b>لو <code>a == b</code> يبقى لازم <code>a.hashCode == b.hashCode</code></b>. الـ <code>Set</code> و<code>Map</code> بيستخدموا <code>hashCode</code> الأول عشان يلاقوا المكان، وبعدين <code>==</code>. فلو الـ hash مختلف، هيعتبروهم عنصرين مختلفين حتى لو <code>==</code> بترجّع true. وللتجميع في <code>hashCode</code> استخدم <code>Object.hash(a, b, ...)</code>.</p>",
      codes: [
        {
          lang: "dart",
          title: "== من غير hashCode: bug",
          src: `class Bad {
  final int x;
  Bad(this.x);

  @override
  bool operator ==(Object other) => other is Bad && other.x == x;
}

void main() {
  print(Bad(1) == Bad(1));            // true
  print({Bad(1), Bad(1)}.length);     // 2 (not 1!)
}`,
          note: "الـ Set شايفهم مختلفين لأن الـ hashCode الافتراضي بيعتمد على الـ identity.",
        },
        {
          lang: "dart",
          title: "الشكل الصح",
          src: `class Point {
  final int x;
  final int y;
  const Point(this.x, this.y);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Point && other.x == x && other.y == y;

  @override
  int get hashCode => Object.hash(x, y);
}

void main() {
  print(Point(1, 2) == Point(1, 2));        // true
  print({Point(1, 2), Point(1, 2)}.length); // 1
  final m = {Point(0, 0): 'origin'};
  print(m[Point(0, 0)]);                    // origin
}`,
        },
      ],
      focus: [{ label: "احفظها", text: "<code>==</code> و<code>hashCode</code> دايما سوا وبنفس الحقول. والـ lint <code>hash_and_equals</code> بيفكرك." }],
      interview: [
        { q: "ليه لازم تعمل override لـ <code>hashCode</code> لما تعمل override لـ <code>==</code>؟", a: "لأن الـ <code>Set</code> و<code>Map</code> بيحسبوا <code>hashCode</code> الأول عشان يحددوا المكان، فلو اتنين objects متساويين بـ <code>==</code> وليهم hash مختلف هيتخزنوا في أماكن مختلفة، فالـ Set هيفضل فيه تكرار وبحث الـ Map بالمفتاح مش هيلاقيه. العقد: لو <code>a == b</code> لازم نفس الـ <code>hashCode</code>. بحسبه بـ <code>Object.hash(x, y)</code> من نفس الحقول اللي في <code>==</code>." },
        { q: "إزاي بتتجنب كتابة == و hashCode بإيدك؟", a: "ممكن أستخدم package زي <code>equatable</code> (بحدد قايمة <code>props</code> وهو يعمل الاتنين)، أو code generation زي <code>freezed</code>، أو أستخدم records لو البيانات بسيطة لأن الـ records ليها تساوي بالقيمة جاهز. المهم أفهم إيه اللي بيحصل تحتها." },
      ],
    },
    {
      title: "const و records: تساوي بالقيمة",
      en: "const canonicalization and records",
      body: "<p>القيم الـ <code>const</code> المتطابقة بتتشارك نسخة واحدة (<b>canonicalization</b>): <code>identical(const Point(1, 2), const Point(1, 2))</code> بترجع <code>true</code> من غير أي override. لكن ده مش بديل للـ <code>==</code>، لأن <code>Point(1, 2)</code> من غير const بتعمل object جديد. أما الـ <b>records</b> فمتساوية بالقيمة جاهز: نفس الشكل ونفس القيم.</p>",
      code: {
        lang: "dart",
        src: `class Point {
  final int x;
  final int y;
  const Point(this.x, this.y);
}

void main() {
  print(identical(const Point(1, 2), const Point(1, 2)));  // true
  print(identical(Point(1, 2), Point(1, 2)));              // false

  print((1, 'a') == (1, 'a'));                  // true
  print((x: 1, y: 2) == (x: 1, y: 2));          // true
  print((1, 2) == (2, 1));                      // false: order matters
  print({(1, 2), (1, 2)}.length);               // 1: records work in a Set
}`,
        note: "الـ record مناسب كمفتاح في <code>Map</code> أو عنصر في <code>Set</code> من غير ما تكتب <code>==</code> و <code>hashCode</code>.",
      },
      interview: [
        { q: "إيه الـ const canonicalization؟ وهل بيغني عن override لـ <code>==</code>؟", a: "يعني إن القيم الـ const المتطابقة بتتشارك نسخة واحدة في الميموري، فـ <code>identical</code> بترجع true. لكن ده بيشتغل مع الـ const بس، لو بنيت الـ object وقت التشغيل من غير const بيبقى object جديد، فعشان <code>==</code> تشتغل بالقيمة لازم أعمل override لها. أما الـ records فليها تساوي بالقيمة جاهز." },
      ],
    },
    {
      title: "Immutability: final و copyWith",
      en: "Immutable objects",
      body: "<p>الـ object الـ <b>immutable</b> مبيتغيرش بعد ما يتبني. بتعمله بـ <code>final</code> fields، و<code>const</code> constructor، ولما تحتاج تغيير بتعمل <b>نسخة جديدة</b> بـ <code>copyWith</code>. نقطة خطيرة: <code>final List</code> بتمنع إنك تغيّر المتغير، لكن مبتمنعش <code>add</code> على القايمة نفسها. للقوايم اعمل نسخة غير قابلة للتعديل بـ <code>List.unmodifiable</code> (بتاخد نسخة) أو <code>const</code>.</p>",
      code: {
        lang: "dart",
        src: `class Cart {
  final List<String> items;

  Cart([List<String> items = const []])
      : items = List.unmodifiable(items);

  Cart add(String item) => Cart([...items, item]);   // new object
}

void main() {
  final a = Cart();
  final b = a.add('shirt');
  print(a.items.length);                 // 0: a never changes
  print(b.items);                        // [shirt]

  try {
    b.items.add('shoes');
  } on UnsupportedError {
    print('cannot modify');
  }

  final source = [1, 2];
  final frozen = List.unmodifiable(source);
  source.add(3);
  print(frozen.length);                  // 2: it is a copy
}`,
        note: "<code>List.unmodifiable</code> بتعمل <b>نسخة</b>، فتغيير الأصل بعد كده مبيأثرش. الـ <code>add</code> عليها بيرمي <code>UnsupportedError</code>.",
      },
      pitfall: "كلاس كل fields فيه <code>final</code> لكن فيه <code>List</code> أو <code>Map</code> عادية جواه مش immutable فعلا: أي حد يقدر يعمل <code>state.items.add(x)</code> ويبوظ الحالة من غير ما حد يحس.",
      interview: [
        { q: "ليه الـ immutability مهمة؟ وإزاي بتعمل object immutable في Dart؟", a: "لأن الـ object اللي مبيتغيرش آمن تتشاركه بين أماكن كتير من غير مفاجآت، وسهل تتبع الـ bugs، وتقدر تقارن القديم بالجديد. بعمله بـ <code>final</code> fields و<code>const</code> constructor، وبرجّع نسخة جديدة بـ <code>copyWith</code> بدل ما أعدل. وبحط القوايم والـ maps جواه كنسخة <code>List.unmodifiable</code> لأن <code>final</code> لوحدها مبتمنعش <code>add</code>." },
      ],
    },
    {
      title: "ليه الـ state لازم يبقى immutable",
      en: "Immutable state and state management",
      body: "<p>أغلب أدوات state management (Bloc، Provider، Riverpod) بتقرر تعيد بناء الـ UI بمقارنة الـ state <b>القديم</b> بالـ <b>الجديد</b>: لو متساويين، مفيش rebuild. لو عدّلت نفس الـ object من جواه (<code>state.items.add(...)</code>) وبعدين بعتّه تاني، المقارنة هتلاقيه نفس الـ object بالظبط، فالـ UI مش بتتحدث. أما لو كل تغيير بيطلع <b>object جديد</b> (<code>copyWith</code>)، المقارنة بتشوف الفرق وبتتحدث، وكمان بيبقى عندك تاريخ للحالات (undo) وتتبع أسهل.</p>",
      code: {
        lang: "dart",
        src: `class CartState {
  final List<String> items;
  const CartState(this.items);
}

bool shouldRebuild(CartState old, CartState next) => !identical(old, next);

void main() {
  final s1 = CartState(['a']);

  s1.items.add('b');                        // mutated in place
  print(shouldRebuild(s1, s1));             // false: the UI stays stale

  final s2 = CartState([...s1.items, 'c']); // new state object
  print(shouldRebuild(s1, s2));             // true: the UI updates
  print(s1.items);                          // [a, b]
  print(s2.items);                          // [a, b, c]
}`,
        note: "ده نفس السبب اللي بيخلي Bloc يتجاهل <code>emit</code> لو الـ state الجديد <code>==</code> القديم. ولازم تعمل <code>==</code> (أو Equatable) عشان الـ states المتساوية فعلا ميعملوش rebuild زيادة.",
      },
      focus: [{ label: "احفظها", text: "في Bloc و Provider: متعدلش الـ state، <b>ابني state جديد</b> بـ <code>copyWith</code>. وعرّف <code>==</code> و<code>hashCode</code> للـ state عشان المقارنة تشتغل صح." }],
      interview: [
        { q: "ليه الـ state في Bloc لازم يبقى immutable؟ وإيه اللي بيحصل لو عدّلت القايمة اللي جواه؟", a: "لأن Bloc بيقارن الـ state الجديد بالقديم بـ <code>==</code> عشان يقرر يعمل emit ويعيد بناء الـ UI. لو عدّلت نفس القايمة اللي جوه الـ state وبعتّ نفس الـ object، هيعتبره متغيرش فمفيش rebuild والـ UI تفضل بالحالة القديمة. الصح إني ابني state جديد بـ <code>copyWith</code> وقايمة جديدة (<code>[...old, item]</code>)، وأعرّف <code>==</code> بالقيمة (بـ Equatable مثلا) عشان الـ states المتساوية فعلا مبيعيدوش البناء." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: == و hashCode",
      lang: "dart",
      code: `class Point {
  final int x;
  final int y;
  const Point(this.x, this.y);

  @override
  bool operator ==(Object other) =>
      other is Point && other.x == x && other.y == y;

  @override
  int get hashCode => Object.hash(x, y);
}`,
    },
    {
      title: "اكتب: copyWith",
      lang: "dart",
      code: `class User {
  final String name;
  final int age;
  const User({required this.name, required this.age});

  User copyWith({String? name, int? age}) {
    return User(name: name ?? this.name, age: age ?? this.age);
  }
}

void main() {
  const u = User(name: 'Hamza', age: 22);
  print(u.copyWith(age: 23).age);
}`,
    },
    {
      title: "اكتب: Isolate.run",
      lang: "dart",
      code: `import 'dart:isolate';

int sumSquares(List<int> numbers) {
  var total = 0;
  for (final n in numbers) {
    total += n * n;
  }
  return total;
}

Future<void> main() async {
  final data = List.generate(1000, (i) => i);
  final result = await Isolate.run(() => sumSquares(data));
  print(result);
}`,
    },
  ],

  tasks: [
    {
      title: "فلوس بالقيمة",
      lang: "dart",
      prompt: "<p>اكتب كلاس <code>Money</code> فيه <code>int cents</code> و<code>String currency</code> (الاتنين final، const constructor). اعمل override لـ <code>==</code> و<code>hashCode</code> بالحقلين، و<code>toString</code> بترجّع مثلا <code>150 EGP</code>.</p>",
      examples: [
        { in: "Money(150, 'EGP') == Money(150, 'EGP')", out: "true" },
        { in: "{Money(1, 'USD'), Money(1, 'USD')}.length", out: "1" },
      ],
      hints: [
        "<code>other is Money &amp;&amp; other.cents == cents &amp;&amp; other.currency == currency</code>",
        "<code>Object.hash(cents, currency)</code> للـ hashCode.",
      ],
      solution: `class Money {
  final int cents;
  final String currency;
  const Money(this.cents, this.currency);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Money &&
          other.cents == cents &&
          other.currency == currency;

  @override
  int get hashCode => Object.hash(cents, currency);

  @override
  String toString() => '$cents $currency';
}`,
      explain: "الحقلين نفسهم في <code>==</code> و<code>hashCode</code>، وده العقد. <code>identical</code> في الأول اختصار سريع لنفس الـ object. بالـ override ده <code>Set</code> و<code>Map</code> بيشتغلوا صح.",
    },
    {
      title: "سلة immutable",
      lang: "dart",
      prompt: "<p>اكتب كلاس <code>Basket</code> immutable: فيه <code>List&lt;String&gt; items</code> (لازم تكون غير قابلة للتعديل من برا، حتى لو اللي اتبعت للـ constructor قايمة عادية)، وميثود <code>Basket add(String item)</code> بترجّع Basket جديدة فيها العنصر، وميثود <code>Basket remove(String item)</code> بترجّع Basket جديدة من غير أول ظهور للعنصر (ولو مش موجود ترجّع نفس الـ Basket).</p>",
      examples: [
        { in: "Basket(['a']).add('b').items", out: "[a, b]" },
        { in: "Basket(['a']).items.add('x')", out: "UnsupportedError" },
      ],
      hints: [
        "في الـ initializer list: <code>: items = List.unmodifiable(items)</code>.",
        "<code>add</code> بتبني <code>Basket([...items, item])</code>. في <code>remove</code> اعمل <code>final copy = [...items]; copy.remove(item)</code>.",
      ],
      solution: `class Basket {
  final List<String> items;

  Basket([List<String> items = const []])
      : items = List.unmodifiable(items);

  Basket add(String item) => Basket([...items, item]);

  Basket remove(String item) {
    if (!items.contains(item)) return this;
    final copy = [...items];
    copy.remove(item);
    return Basket(copy);
  }
}`,
      explain: "<code>List.unmodifiable</code> بتاخد نسخة، فحتى لو اللي بعت القايمة غيّر فيها بعدين، الـ Basket مبتتأثرش. <code>remove</code> بتعدّل في نسخة محلية بس وبترجّع object جديد. وارجاع <code>this</code> لو مفيش تغيير مقبول لأن الـ object ميتغيرش أصلا.",
    },
    {
      title: "مجموع المربعات بعيد عن الـ UI",
      lang: "dart",
      prompt: "<p>اكتب <code>Future&lt;int&gt; sumOfSquares(List&lt;int&gt; numbers)</code> بتحسب مجموع مربعات الأرقام <b>جوه isolate منفصل</b> باستخدام <code>Isolate.run</code>، وترجّع النتيجة. الدالة اللي بتتشغل جوه الـ isolate لازم تكون top-level.</p>",
      examples: [{ in: "await sumOfSquares([1, 2, 3])", out: "14" }],
      hints: [
        "اكتب دالة عادية top-level <code>int _sumSquares(List&lt;int&gt; numbers)</code> بتلف وتجمع.",
        "وبعدين <code>return Isolate.run(() =&gt; _sumSquares(numbers));</code>",
      ],
      solution: `import 'dart:isolate';

int _sumSquares(List<int> numbers) {
  var total = 0;
  for (final n in numbers) {
    total += n * n;
  }
  return total;
}

Future<int> sumOfSquares(List<int> numbers) {
  return Isolate.run(() => _sumSquares(numbers));
}`,
      explain: "الـ closure بتاخد <code>numbers</code> بس (قايمة أرقام تتنسخ للـ isolate). الدالة التقيلة منفصلة وبتاخد المدخلات كـ parameters. في تطبيق حقيقي مفروض الشغل يكون أتقل بكتير عشان الـ isolate يستاهل تكلفته.",
    },
  ],

  quiz: [
    {
      q: "أنهي شغل بيستاهل isolate؟",
      options: [
        "طلب GET لـ API",
        "decode لملف JSON حجمه 20MB",
        "قراءة قيمة من SharedPreferences",
        "<code>await Future.delayed(...)</code> قبل عرض splash",
      ],
      answer: 1,
      why: "الـ decode عملية CPU تقيلة هتحجز الـ main isolate وتجمّد الـ UI. الباقي انتظار I/O أو timer، وده بيتحل بـ async من غير isolate.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `import 'dart:isolate';

int counter = 0;

Future<void> main() async {
  final r = await Isolate.run(() {
    counter = 100;
    return counter + 1;
  });
  print('$r $counter');
}`,
      },
      options: ["101 101", "101 0", "1 100", "101 100"],
      answer: 1,
      why: "كل isolate ليه نسخة خاصة من المتغيرات العامة. التعديل جوه الـ isolate الجديد مأثرش على <code>counter</code> في الـ main isolate.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `class P {
  final int x;
  P(this.x);
}

void main() {
  print(P(1) == P(1));
}`,
      },
      answer: ["false"],
      why: "الـ <code>==</code> الافتراضي بيقارن بالـ identity. اتنين objects اتبنوا بنفس القيمة هما object مختلفين، إلا لو عملت override.",
    },
    {
      q: "عملت override لـ <code>==</code> بس من غير <code>hashCode</code>. إيه المشكلة؟",
      options: [
        "الكود مش بيتكومبايل",
        "<code>a == b</code> هترجّع دايما false",
        "<code>Set</code> و<code>Map</code> ممكن يعتبروا الـ objects المتساوية مختلفين فيبقى فيه تكرار وبحث فاشل",
        "مفيش مشكلة، الـ hashCode بيتحسب من <code>==</code> أوتوماتيك",
      ],
      answer: 2,
      why: "الـ Set والـ Map بيبدأوا بالـ hashCode. الافتراضي بيعتمد على الـ identity فالمتساويين بالـ <code>==</code> بيختلفوا في الـ hash ويتخزنوا في أماكن مختلفة.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `class P {
  final int x;
  const P(this.x);
}

void main() {
  print(identical(const P(1), const P(1)));
  print(identical(P(1), P(1)));
}`,
      },
      options: ["true ثم true", "false ثم false", "false ثم true", "true ثم false"],
      answer: 3,
      why: "القيم الـ const المتطابقة بتتشارك نسخة واحدة (canonicalization). من غير <code>const</code> كل استدعاء بيبني object جديد.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `void main() {
  print((1, 'a') == (1, 'a'));
}`,
      },
      answer: ["true"],
      why: "الـ records متساوية بالقيمة: نفس الشكل ونفس القيم بنفس الترتيب.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `void main() {
  final source = [1, 2];
  final frozen = List.unmodifiable(source);
  source.add(3);
  print(frozen.length);
}`,
      },
      options: ["2", "3", "UnsupportedError", "0"],
      answer: 0,
      why: "<code>List.unmodifiable</code> بتعمل <b>نسخة</b> غير قابلة للتعديل، فتغيير الأصل بعد كده مبيأثرش عليها. الخطأ كان هيحصل لو عملت <code>frozen.add(...)</code>.",
    },
    {
      q: "أنهي كلاس ده فعلا immutable؟",
      options: [
        "كل fields فيه <code>final</code> بس واحد منهم <code>List</code> عادية بتتبعت من برا",
        "كل fields فيه <code>final</code> وبيحول القوايم لـ <code>List.unmodifiable</code> في الـ constructor",
        "فيه field واحد من غير final بس له getter فقط",
        "كلاس عادي بس بنقول في الكومنت إنه ميتعدلش",
      ],
      answer: 1,
      why: "<code>final</code> بتثبت المتغير مش محتواه. القايمة العادية لسه ينفع حد يعمل عليها <code>add</code>. التحويل لـ unmodifiable بيقفل الثغرة دي.",
    },
    {
      q: "ليه الـ UI مش بتتحدث هنا؟ (بافتراض إن الـ UI بتقارن الـ state بالـ identity)",
      code: {
        lang: "dart",
        src: `void addItem(CartState state, String item) {
  state.items.add(item);     // mutate
  emit(state);               // same object
}`,
      },
      options: [
        "لأن <code>emit</code> لازم تتنادى مرتين",
        "لأن الـ list ليها حجم ثابت",
        "لأن الـ state لازم يكون <code>const</code>",
        "لأن الـ object الجديد هو نفسه القديم، فالمقارنة مش بتلاقي فرق",
      ],
      answer: 3,
      why: "المقارنة بين القديم والجديد بتلاقيهم نفس الـ object فمفيش rebuild. الحل: <code>emit(CartState([...state.items, item]))</code> يعني state جديد.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `void main() {
  print({(1, 2), (1, 2), (2, 1)}.length);
}`,
      },
      answer: ["2"],
      why: "<code>(1, 2)</code> مرتين متساويين بالقيمة فبيتحسبوا عنصر واحد، و<code>(2, 1)</code> مختلف لأن الترتيب مهم. الإجمالي 2.",
    },
  ],
};
