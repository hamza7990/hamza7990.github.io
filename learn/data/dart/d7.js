window.LEVELS = window.LEVELS || {};
window.LEVELS["dart/d7"] = {
  slides: [
    {
      kicker: "ليه Dart 3 غيّرت الطريقة",
      title: "كود أقصر، وCompiler بيتأكد إنك غطيت كل الحالات",
      en: "Records and pattern matching",
      body: "<p>قبل Dart 3 لو دالة محتاجة ترجع قيمتين كنت بتعمل كلاس صغير أو <code>List</code>. ولو عندك JSON متداخل كنت بتكتب سلسلة <code>is</code> وcasts. وسلسلة <code>if / else if</code> على أنواع كانت بتنسى حالة. في Dart 3 اتضافت <b>records</b> و<b>patterns</b> وحلوا الثلاثة.</p><p>هتشوف الكود ده في أي مشروع حديث، خصوصا مع الـ <code>sealed</code> classes اللي شفتها في المستوى اللي فات.</p>",
      points: [
        "الإنترفيو بيسأل: إيه الـ record؟ إيه الفرق بين switch statement و switch expression؟ يعني إيه exhaustive؟",
        "مهم تكتب بإيدك: الشكل (<code>=&gt;</code> و <code>when</code> و <code>:final</code>) محتاج تعود.",
      ],
    },
    {
      title: "Records: قيم مركبة خفيفة",
      en: "Records",
      body: "<p>الـ record مجموعة قيم بأقواس عادية، من غير ما تعرّف كلاس. فيه fields <b>positional</b> بتتقرا بـ <code>$1</code> و <code>$2</code>، و<b>named</b> بتتقرا بالاسم. وهو immutable، والمقارنة بين اتنين بتكون <b>بالقيمة</b>.</p>",
      code: {
        lang: "dart",
        src: `void main() {
  (int, String) pair = (1, 'a');
  print(pair.\$1);                  // 1
  print(pair.\$2);                  // a

  ({String name, int age}) user = (name: 'Ali', age: 20);
  print(user.name);                // Ali

  final mixed = (42, label: 'answer');   // positional + named
  print(mixed.\$1);                 // 42
  print(mixed.label);              // answer

  print((1, 2) == (1, 2));         // true: compared by value
  print(pair);                     // (1, a)
}`,
        note: "الـ named fields بين <code>{ }</code> في نوع الـ record. و<code>$1</code> بتبدأ من 1 مش 0، والـ positional بس هو اللي بيتعدّ.",
      },
      focus: [{ label: "احفظها", text: "record = قيم صغيرة مجمعة لحظيا من غير كلاس. لو القيم ليها سلوك (methods) أو بتتستخدم في أماكن كتير أو محتاجة اسم، اعمل كلاس." }],
      interview: [
        { q: "إيه الـ record في Dart 3؟ وإمتى أفضله على كلاس صغير؟", a: "هو نوع مركب خفيف بيجمع أكتر من قيمة بأقواس <code>(1, 'a')</code> أو بأسماء <code>(name: 'Ali', age: 20)</code>، immutable، ومقارنته (<code>==</code>) بالقيمة تلقائيا. بفضله لما أرجّع قيمتين أو تلاتة من دالة أو أجمع بيانات مؤقتة. لو محتاج methods أو validation أو هستخدمه في API عام أو في كذا ملف، بعمل كلاس لأنه بيدّي اسم ومكان للسلوك." },
      ],
    },
    {
      title: "إرجاع أكتر من قيمة وفك الـ record",
      en: "Returning several values and destructuring",
      body: "<p>أشهر استخدام للـ record: دالة بترجع أكتر من حاجة. وتفك الـ record لمتغيرات في سطر واحد بـ <b>destructuring</b>: <code>final (a, b) = ...</code>. وللـ named بتكتب <code>:name</code> قدام اسم المتغير.</p>",
      code: {
        lang: "dart",
        src: `(int, int) minMax(List<int> xs) {
  var lo = xs.first;
  var hi = xs.first;
  for (final x in xs) {
    if (x < lo) lo = x;
    if (x > hi) hi = x;
  }
  return (lo, hi);
}

({String city, int zip}) address() => (city: 'Riyadh', zip: 11564);

void main() {
  final (lo, hi) = minMax([3, 9, 1]);
  print('$lo..$hi');                    // 1..9

  final (:city, :zip) = address();
  print('$city $zip');                  // Riyadh 11564

  var (a, b) = (1, 2);
  (a, b) = (b, a);                      // swap, no temp variable
  print('$a $b');                       // 2 1
}`,
        note: "<code>(:city, :zip)</code> اختصار لـ <code>(city: city, zip: zip)</code>: بتاخد القيمة وتسميها بنفس اسم الـ field.",
      },
      interview: [
        { q: "إزاي ترجّع أكتر من قيمة من دالة في Dart؟ وإيه الفرق عن الطريقة القديمة؟", a: "بـ record: <code>(int, int) minMax(...) =&gt; (lo, hi)</code> وأفكه عند الاستدعاء بـ <code>final (lo, hi) = minMax(xs);</code>. قبل Dart 3 كنت بعمل كلاس صغير مخصوص أو أرجّع <code>List</code> أو <code>Map</code> وأفقد الأنواع (<code>result[0] as int</code>). الـ record بيحافظ على نوع كل قيمة وبيتفك بسطر واحد، من غير boilerplate." },
      ],
    },
    {
      title: "switch جديد: expression وstatement",
      en: "Switch expressions and patterns",
      body: "<p>الـ <b>switch expression</b> بترجع قيمة: <code>switch (x) { pattern =&gt; value, ... }</code>. كل <code>case</code> فيه <b>pattern</b> مش قيمة بس: ثابت، أو مقارنة (<code>&gt;= 90</code>)، أو <code>||</code> بين اختيارات، أو <code>_</code> لأي حاجة. والـ switch statement في Dart 3 <b>مفيهوش fall-through</b>: مفيش <code>break</code> محتاجه.</p>",
      codes: [
        {
          lang: "dart",
          title: "switch expression",
          src: `String grade(int score) => switch (score) {
  >= 90 => 'A',
  >= 80 => 'B',
  >= 70 => 'C',
  _ => 'F',
};

String fizz(int n) => switch ((n % 3, n % 5)) {
  (0, 0) => 'FizzBuzz',
  (0, _) => 'Fizz',
  (_, 0) => 'Buzz',
  _ => '$n',
};

void main() {
  print(grade(85));      // B
  print(fizz(15));       // FizzBuzz
  print(fizz(7));        // 7
}`,
        },
        {
          lang: "dart",
          title: "switch statement (no break)",
          src: `void main() {
  final cmd = 'start';
  switch (cmd) {
    case 'go' || 'start':
      print('running');
    case 'stop':
      print('stopped');
    default:
      print('unknown');
  }
}`,
        },
      ],
      pitfall: "الـ cases بتتفحص من فوق لتحت وأول واحد يطابق يكسب. فاكتب الأخص قبل الأعم، و<code>_</code> دايما في الآخر، وإلا هتخلي الحالات اللي بعدها مبتتوصلش.",
    },
    {
      title: "if-case وفك البيانات",
      en: "Patterns in if-case and declarations",
      body: "<p>مش بس في الـ switch: تقدر تستخدم pattern في <code>if (value case pattern)</code> فتفحص وتفك في خطوة واحدة. لو الـ pattern مطابق المتغيرات اللي فيه بتتعرف جوه الـ <code>if</code> بس. و<code>pattern?</code> بيتأكد إنه مش null.</p>",
      code: {
        lang: "dart",
        src: `void shout(String? text) {
  if (text case var s?) {
    print(s.toUpperCase());             // s is a non-null String here
  }
}

void main() {
  final Object? data = {'name': 'Ali', 'age': 20};

  if (data case {'name': String name, 'age': int age}) {
    print('$name is $age');             // Ali is 20
  }

  Object? n = 7;
  if (n case int v when v > 5) {
    print('big $v');                    // big 7
  }

  shout('hi');                          // HI
  shout(null);                          // prints nothing

  final [first, second] = [10, 20];     // destructure a list
  print(first + second);                // 30
}`,
        note: "لو الـ pattern مش مطابق، الـ <code>if</code> ببساطة مش بيتنفذ (أو بيروح لـ <code>else</code>)، ومفيش exception.",
      },
    },
    {
      title: "List وMap وObject patterns",
      en: "List, map and object patterns",
      body: "<p>الـ pattern بيطابق <b>شكل</b> البيانات: قايمة بعدد عناصر معين (<code>[a, b]</code>)، أو بـ rest (<code>[first, ..., last]</code>)، أو map فيها مفاتيح معينة (<code>{'k': v}</code>)، أو object بحقوله (<code>Point(x: 0)</code>). ده الأساس لقراءة JSON وللتعامل مع كلاسات.</p>",
      code: {
        lang: "dart",
        src: `String describe(List<int> xs) => switch (xs) {
  [] => 'empty',
  [var only] => 'one: $only',
  [var a, var b] => 'two: $a, $b',
  [var first, ..., var last] => '$first to $last',
};

class Point {
  final int x, y;
  const Point(this.x, this.y);
}

String where(Point p) => switch (p) {
  Point(x: 0, y: 0) => 'origin',
  Point(x: 0) => 'on y axis',
  Point(y: 0) => 'on x axis',
  Point(:final x, :final y) => '($x, $y)',
};

void main() {
  print(describe([]));                  // empty
  print(describe([5]));                 // one: 5
  print(describe([1, 2, 3, 4]));        // 1 to 4
  print(where(const Point(0, 0)));      // origin
  print(where(const Point(0, 7)));      // on y axis
  print(where(const Point(3, 4)));      // (3, 4)
}`,
        note: "<code>Point(:final x, :final y)</code> بتسحب القيم من الـ getters. شغالة مع أي كلاس عنده getters بالأسماء دي.",
      },
    },
    {
      title: "Guards: when",
      en: "Guard clauses",
      body: "<p>لو الـ pattern مطابق لكن محتاج شرط إضافي، حط <code>when</code> بعده. الـ case بينجح بس لو الـ pattern طابق <b>و</b> الشرط true. الشرط يقدر يستخدم المتغيرات اللي الـ pattern عرّفها.</p>",
      code: {
        lang: "dart",
        src: `String size(int n) => switch (n) {
  < 0 => 'negative',
  0 => 'zero',
  int k when k.isEven => 'even $k',
  _ => 'odd',
};

String route(Object? input) => switch (input) {
  null => 'nothing',
  String s when s.isEmpty => 'empty string',
  String s => 'text: $s',
  int n when n > 100 => 'huge',
  int() => 'number',
  _ => 'unknown',
};

void main() {
  print(size(-3));        // negative
  print(size(4));         // even 4
  print(size(7));         // odd
  print(route(''));       // empty string
  print(route('hi'));     // text: hi
  print(route(500));      // huge
}`,
      },
      pitfall: "الـ compiler مبيفهمش الشرط اللي بعد <code>when</code> وهو بيفحص الـ exhaustiveness. لو عندك <code>int k when k &gt;= 0</code> و <code>int k when k &lt; 0</code> بس، هيقولك ناقص حالة، لازم <code>_</code> أو case من غير guard في الآخر.",
      interview: [
        { q: "إيه الـ guard clause (<code>when</code>) في الـ switch؟ وإمتى أحتاجها؟", a: "هي شرط إضافي بعد الـ pattern: <code>int n when n &gt; 100 =&gt; 'huge'</code>. بحتاجها لما الـ pattern لوحده (النوع أو الشكل) مش كفاية وأحتاج شرط على القيمة. تنبيه مهم: الـ compiler لا يعتبر الـ guard وهو بيحسب الـ exhaustiveness، فلازم أحط case عام في الآخر." },
      ],
    },
    {
      title: "Exhaustiveness مع sealed classes",
      en: "Exhaustive switch over a sealed hierarchy",
      body: "<p>هنا بتكتمل الصورة: الـ <code>sealed</code> بتخلي الـ compiler يعرف كل الأبناء، والـ pattern matching بيفحص كل واحد، فلو نسيت حالة ده <b>خطأ كومبايل</b> مش bug بيطلع عند المستخدم.</p>",
      code: {
        lang: "dart",
        src: `sealed class Shape {}

class Circle extends Shape {
  final double r;
  Circle(this.r);
}

class Square extends Shape {
  final double side;
  Square(this.side);
}

class Rect extends Shape {
  final double w, h;
  Rect(this.w, this.h);
}

double area(Shape s) => switch (s) {
  Circle(:final r) => 3.14 * r * r,
  Square(:final side) => side * side,
  Rect(:final w, :final h) => w * h,
};

void main() {
  print(area(Rect(2, 3)));      // 6.0
  print(area(Square(3)));       // 9.0
}`,
        note: "لو ضفت <code>class Triangle extends Shape</code> ومعدلتش <code>area</code>، هتاخد خطأ كومبايل في كل switch عليها. جرب تمسح سطر وشوف الرسالة.",
      },
      focus: [{ label: "في Flutter", text: "<code>switch (state) { Loading() =&gt; Spinner(), Loaded(:final items) =&gt; ListView(...), Failed(:final message) =&gt; ErrorText(message) }</code> هو شكل أغلب شاشات الـ state management الحديثة." }],
      interview: [
        { q: "يعني إيه switch exhaustive؟ وإزاي بيفيدك مع sealed class؟", a: "معناه إن الـ compiler بيتأكد إن الـ switch بيغطي كل القيم أو الأنواع الممكنة. مع <code>sealed class</code> هو يعرف كل الأبناء لأنهم لازم يتعرفوا في نفس الملف، فلو ضفت ابن جديد وفي switch ناقصه، الكود مش بيتكومبايل. كده التعديل بيوصلني لكل مكان محتاج يتحدث، ومحتاجش <code>default</code> اللي بيخبي النسيان." },
      ],
    },
    {
      title: "فين بيستبدل الكود القديم",
      en: "Where this replaces older code",
      body: "<p>أوضح مثال هو قراءة JSON متداخل. بدل سلسلة فحوصات <code>is</code> وcasts، pattern واحد يتأكد من الشكل والأنواع ويفك القيم.</p>",
      codes: [
        {
          lang: "dart",
          title: "قبل Dart 3",
          src: `void main() {
  Object? json = {'user': {'name': 'Ali', 'age': 20}};
  if (json is Map<String, dynamic>) {
    final user = json['user'];
    if (user is Map<String, dynamic>) {
      final name = user['name'];
      final age = user['age'];
      if (name is String && age is int) {
        print('$name $age');
      }
    }
  }
}`,
        },
        {
          lang: "dart",
          title: "Dart 3",
          src: `void main() {
  Object? json = {'user': {'name': 'Ali', 'age': 20}};
  if (json case {'user': {'name': String name, 'age': int age}}) {
    print('$name $age');
  }
}`,
        },
      ],
      points: [
        "دالة بترجع قيمتين: كان كلاس صغير أو List، دلوقتي record.",
        "سلسلة <code>if (x is A) ... else if (x is B)</code>: دلوقتي switch exhaustive على sealed.",
        "قراءة JSON متداخل بـ casts: دلوقتي pattern واحد.",
        "<code>enum</code> + switch بـ <code>break</code> ونسيان حالة: دلوقتي switch expression مفيهوش fall-through ومفيهوش حالة ناقصة.",
      ],
      interview: [
        { q: "إيه التحسينات الأساسية اللي جابها Dart 3 في الـ control flow؟", a: "تلاتة مرتبطين: <b>records</b> لإرجاع وتجميع أكتر من قيمة من غير كلاس، و<b>patterns</b> لفحص شكل البيانات وفكها (في switch و if-case والتعريفات)، و<b>exhaustive switch</b> على sealed classes و enums اللي بيخلي الـ compiler يمسك الحالات الناقصة. النتيجة كود أقصر وأمان أكتر، خصوصا في قراءة JSON وإدارة الـ state." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: record وdestructuring",
      lang: "dart",
      code: `(int, int) minMax(List<int> xs) {
  var lo = xs.first;
  var hi = xs.first;
  for (final x in xs) {
    if (x < lo) lo = x;
    if (x > hi) hi = x;
  }
  return (lo, hi);
}

void main() {
  final (lo, hi) = minMax([3, 9, 1]);
  print('$lo..$hi');
}`,
    },
    {
      title: "اكتب: switch وif-case",
      lang: "dart",
      code: `String grade(int score) {
  return switch (score) {
    >= 90 => 'A',
    >= 80 => 'B',
    _ => 'F',
  };
}

void main() {
  final Object? data = {'name': 'Ali', 'age': 20};
  if (data case {'name': String name, 'age': int age}) {
    print('$name is $age');
  }
  print(grade(85));
}`,
    },
    {
      title: "اكتب: sealed وobject patterns",
      lang: "dart",
      code: `sealed class Shape {}

class Circle extends Shape {
  final double r;
  Circle(this.r);
}

class Rect extends Shape {
  final double w, h;
  Rect(this.w, this.h);
}

double area(Shape s) => switch (s) {
  Circle(:final r) => 3.14 * r * r,
  Rect(:final w, :final h) => w * h,
};`,
      note: "من غير <code>default</code> ولا <code>_</code>: لو ضفت ابن جديد للـ sealed الـ compiler هو اللي يفكرك.",
    },
  ],

  tasks: [
    {
      title: "إحصائيات بـ named record",
      lang: "dart",
      prompt: "<p>اكتب <code>({int min, int max, double avg}) stats(List&lt;int&gt; xs)</code> بترجع أقل قيمة وأكبر قيمة والمتوسط. (القايمة مش فاضية.) وبعدين اكتب في <code>main</code> سطر بيفك النتيجة بـ destructuring.</p>",
      examples: [
        { in: "stats([1, 2, 3, 6]).max", out: "6" },
        { in: "stats([1, 2, 3]).avg", out: "2.0" },
      ],
      starter: `({int min, int max, double avg}) stats(List<int> xs) {
  // your code
}`,
      hints: [
        "ممكن تلف مرة واحدة وتحسب الأقل والأكبر والمجموع.",
        "الـ record بترجعه هكذا: <code>return (min: lo, max: hi, avg: sum / xs.length);</code>",
        "للفك: <code>final (:min, :max, :avg) = stats(xs);</code>",
      ],
      solution: `({int min, int max, double avg}) stats(List<int> xs) {
  var lo = xs.first;
  var hi = xs.first;
  var sum = 0;
  for (final x in xs) {
    if (x < lo) lo = x;
    if (x > hi) hi = x;
    sum += x;
  }
  return (min: lo, max: hi, avg: sum / xs.length);
}

void main() {
  final (:min, :max, :avg) = stats([1, 2, 3, 6]);
  print('$min $max $avg');   // 1 6 3.0
}`,
      explain: "الـ named record مقروء أكتر من <code>(int, int, double)</code> لأن كل قيمة ليها اسم. وبنلف مرة واحدة O(n). <code>sum / xs.length</code> بترجع double.",
    },
    {
      title: "describe بـ switch وguards",
      lang: "dart",
      prompt: "<p>اكتب <code>String describe(Object? x)</code> بـ switch expression:</p><ul><li><code>null</code> ترجع <code>null value</code>.</li><li>int سالب: <code>negative</code>، والصفر: <code>zero</code>، وغير كده: <code>positive</code>.</li><li>String فاضي: <code>empty text</code>، وغير كده: <code>text of N</code> (N الطول).</li><li>List: <code>list of N</code>.</li><li>أي حاجة تانية: <code>other</code>.</li></ul>",
      examples: [
        { in: "describe(-4)", out: "negative" },
        { in: "describe('abc')", out: "text of 3" },
        { in: "describe([1, 2])", out: "list of 2" },
        { in: "describe(2.5)", out: "other" },
      ],
      hints: [
        "ابدأ بـ <code>null =&gt; ...</code> وبعدين الأنواع: <code>int n when n &lt; 0 =&gt; ...</code>.",
        "الصفر ممكن تكتبه <code>0 =&gt; 'zero'</code> أو <code>int n when n == 0</code>.",
        "للقايمة: <code>List l =&gt; 'list of ${l.length}'</code>.",
      ],
      solution: `String describe(Object? x) => switch (x) {
  null => 'null value',
  int n when n < 0 => 'negative',
  0 => 'zero',
  int() => 'positive',
  String s when s.isEmpty => 'empty text',
  String s => 'text of \${s.length}',
  List l => 'list of \${l.length}',
  _ => 'other',
};`,
      explain: "الترتيب مهم: الـ guard الأخص (<code>int n when n &lt; 0</code>) قبل <code>0</code> و<code>int()</code>. الحالة <code>String s when s.isEmpty</code> قبل <code>String s</code> العامة. و<code>_</code> في الآخر لأن النوع <code>Object?</code> مش sealed.",
    },
    {
      title: "حاسبة تعبيرات",
      lang: "dart",
      prompt: "<p>اكتب <code>sealed class Expr</code> وأبناءه: <code>Num(double value)</code> و <code>Add(Expr left, Expr right)</code> و <code>Mul(Expr left, Expr right)</code> و <code>Neg(Expr inner)</code>. وبعدين <code>double eval(Expr e)</code> بـ switch exhaustive (recursive) من غير <code>default</code>.</p>",
      examples: [
        { in: "eval(Add(Num(2), Mul(Num(3), Num(4))))", out: "14.0" },
        { in: "eval(Neg(Num(5)))", out: "-5.0" },
      ],
      hints: [
        "كل ابن <code>final</code> fields بأسماء واضحة (<code>left</code>, <code>right</code>, <code>inner</code>, <code>value</code>).",
        "في الـ switch: <code>Add(:final left, :final right) =&gt; eval(left) + eval(right)</code>.",
      ],
      solution: `sealed class Expr {}

class Num extends Expr {
  final double value;
  Num(this.value);
}

class Add extends Expr {
  final Expr left, right;
  Add(this.left, this.right);
}

class Mul extends Expr {
  final Expr left, right;
  Mul(this.left, this.right);
}

class Neg extends Expr {
  final Expr inner;
  Neg(this.inner);
}

double eval(Expr e) => switch (e) {
  Num(:final value) => value,
  Add(:final left, :final right) => eval(left) + eval(right),
  Mul(:final left, :final right) => eval(left) * eval(right),
  Neg(:final inner) => -eval(inner),
};`,
      explain: "ده الاستخدام الكلاسيكي للـ sealed + patterns: شجرة تعبيرات وتقييم recursive. لو ضفت <code>Sub</code> ومعدلتش <code>eval</code>، الكومبايل يوقفك. ولاحظ إن الدالة بتتعامل مع <code>Expr</code> وكل حالة بتفك حقولها في نفس السطر.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final r = (1, 'a', flag: true);
print('\${r.\$2} \${r.flag}');` },
      answer: ["a true"],
      why: "الـ positional fields بتتقرا بـ <code>$1</code> و <code>$2</code> (من 1)، فـ <code>r.$2</code> هو <code>'a'</code>، والـ named بالاسم: <code>r.flag</code> = true.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `var (a, b) = (1, 2);
(a, b) = (b, a);
print('$a$b');` },
      answer: ["21"],
      why: "التعيين بـ record بيقيّم الطرف اليمين كله (2, 1) وبعدين يوزعه، فمفيش متغير مؤقت: a بقت 2 و b بقت 1.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `void main() {
  switch (2) {
    case 1:
      print('one');
    case 2:
      print('two');
    case 3:
      print('three');
  }
}` },
      options: ["<code>two</code>", "<code>two</code> ثم <code>three</code>", "خطأ كومبايل: ناقص <code>break</code>", "<code>one</code> ثم <code>two</code> ثم <code>three</code>"],
      answer: 0,
      why: "في Dart 3 كل case بينتهي لوحده (مفيش fall-through). مش محتاج <code>break</code>، والتنفيذ ما بيكملش للـ case اللي بعده.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `String size(int n) => switch (n) {
  < 0 => 'negative',
  0 => 'zero',
  int k when k.isEven => 'even $k',
  _ => 'odd',
};

void main() {
  print(size(7));
}` },
      answer: ["odd"],
      why: "7 مش سالب ومش صفر ومش زوجي، فالـ guard <code>k.isEven</code> بيفشل والتنفيذ بيروح لـ <code>_</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `String describe(List<int> xs) => switch (xs) {
  [] => 'empty',
  [var only] => 'one: $only',
  [var a, var b] => 'two: $a, $b',
  [var first, ..., var last] => '$first to $last',
};

void main() {
  print(describe([1, 2, 3]));
}` },
      answer: ["1 to 3"],
      why: "القايمة فيها 3 عناصر فمش مطابقة لـ <code>[]</code> ولا <code>[only]</code> ولا <code>[a, b]</code>، والـ pattern الأخير <code>[first, ..., last]</code> بيطابق وياخد الأول والأخير.",
    },
    {
      q: "ليه الـ compiler بيرفض الـ switch ده؟",
      code: { lang: "dart", src: `String f(int n) => switch (n) {
  int k when k >= 0 => 'non-negative',
  int k when k < 0 => 'negative',
};` },
      options: [
        "لأن <code>when</code> مش مسموحة مع int",
        "لأن اسم المتغير <code>k</code> متكرر",
        "لأن الـ compiler بيتجاهل شروط <code>when</code> في حساب الـ exhaustiveness فشايف إن في حالات ممكن متتغطاش",
        "لأن الـ switch expression لازم تبقى على enum",
      ],
      answer: 2,
      why: "الـ guards مبتتحسبش في الفحص. الحل: شيل الشرط من آخر case (<code>int k =&gt; ...</code>) أو حط <code>_ =&gt; ...</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `void main() {
  final Object? json = {'x': 'a'};
  if (json case {'x': int x}) {
    print(x);
  } else {
    print('no');
  }
}` },
      answer: ["no"],
      why: "الـ pattern بيطلب إن <code>x</code> يكون <code>int</code> لكن القيمة <code>'a'</code> نص، فالمطابقة بتفشل ويروح لـ <code>else</code> من غير exception.",
    },
    {
      q: "إمتى الأنسب تعمل كلاس بدل record؟",
      options: [
        "لما أرجّع قيمتين من دالة خاصة",
        "لما أجمّع قيمتين مؤقتا لـ destructuring",
        "لما محتاج methods وvalidation على البيانات وهتتستخدم في كذا ملف",
        "لما عايز مقارنة بالقيمة",
      ],
      answer: 2,
      why: "الـ record مناسب للتجميع الخفيف المؤقت وبيدّيك مقارنة بالقيمة مجانا. لما البيانات ليها سلوك أو قواعد أو اسم مشترك على مستوى المشروع، الكلاس أوضح وأسهل في الصيانة.",
    },
    {
      q: "ضفت ابن جديد لـ <code>sealed class Shape</code>. إيه اللي بيحصل في <code>switch (s)</code> بدون <code>default</code> في ملف تاني؟",
      options: [
        "ولا حاجة، الابن الجديد بيتخطى",
        "<code>MatchError</code> وقت التشغيل بس",
        "خطأ كومبايل لحد ما تغطي الحالة الجديدة",
        "بيروح تلقائي لأول case",
      ],
      answer: 2,
      why: "ده بالظبط سبب وجود sealed: الـ compiler يعرف الأبناء كلهم، فأي switch ناقص بيطلع عليه خطأ كومبايل في كل مكان.",
    },
  ],
};
