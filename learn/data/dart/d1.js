window.LEVELS = window.LEVELS || {};
window.LEVELS["dart/d1"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "Dart لغة بتعرف نوع كل حاجة قبل ما تشتغل",
      en: "Static typing and sound null safety",
      body: "<p>Dart لغة <b>statically typed</b>: كل متغير له نوع معروف وقت الكتابة، والـ compiler بيرفض الكود لو النوع غلط قبل ما التطبيق يشتغل أصلا. وفوق ده عندها <b>sound null safety</b>: المتغير مينفعش يبقى <code>null</code> غير لو إنت قلت كده صراحة.</p><p>النتيجة: أغلب أخطاء «القيمة طلعت null» اللي بتوقع التطبيق عند المستخدم بتظهرلك وإنت بتكتب.</p>",
      points: [
        "أي سؤال إنترفيو في Flutter بيبدأ من هنا: <code>final</code> ولا <code>const</code>؟ إيه معنى <code>?</code> و <code>!</code> و <code>late</code>؟",
        "لو الأساس ده ثابت، باقي اللغة بيبقى سهل.",
      ],
    },
    {
      title: "var و final و const",
      en: "Declaring variables",
      body: "<p>تلات طرق تعرّف بيهم متغير، والفرق بينهم في «هل القيمة ينفع تتغير؟» و«القيمة بتتحدد إمتى؟».</p>",
      code: {
        lang: "dart",
        src: `var count = 0;            // type inferred as int, can change
count = 1;

final now = DateTime.now(); // set once, at run time
// now = DateTime.now();    // error: a final variable can only be set once

const pi = 3.14159;         // known at compile time, never changes
// const t = DateTime.now(); // error: not a compile-time constant`,
        note: "<code>var</code> بتستنتج النوع من أول قيمة وبعدها النوع ثابت: <code>count = 'hi'</code> غلط.",
      },
      terms: [
        ["var", "متغير", "النوع بيتستنتج من القيمة، والقيمة ينفع تتغير."],
        ["final", "بيتحدد مرة واحدة", "القيمة بتتحط مرة واحدة وقت التشغيل ومبتتغيرش بعدها."],
        ["const", "ثابت وقت الكومبايل", "القيمة لازم تكون معروفة قبل ما البرنامج يشتغل."],
      ],
      focus: [{ label: "القاعدة العملية", text: "استخدم <code>final</code> في كل حاجة مش هتتغير، و<code>const</code> لو القيمة معروفة وقت الكتابة، و<code>var</code> بس لما فعلا هتغير القيمة." }],
    },
    {
      title: "الأنواع الأساسية",
      en: "Built-in types",
      points: [
        "<code>int</code> للأعداد الصحيحة، <code>double</code> للكسور، و<code>num</code> الأب بتاع الاتنين.",
        "<code>String</code> للنصوص، وجواها تقدر تحط قيمة بـ <code>$name</code> أو تعبير كامل بـ <code>${...}</code>.",
        "<code>bool</code> قيمته <code>true</code> أو <code>false</code> بس. مفيش في Dart إن الرقم 0 أو النص الفاضي يتحسبوا false.",
      ],
      code: {
        lang: "dart",
        src: `int age = 22;
double price = 99.5;
String name = 'Hamza';
bool isReady = true;

print('Hi $name, next year you are \${age + 1}');
print(7 / 2);   // 3.5  (always a double)
print(7 ~/ 2);  // 3    (integer division)
print(7 % 2);   // 1`,
        note: "القسمة <code>/</code> بترجع <code>double</code> دايما حتى لو الطرفين <code>int</code>. للقسمة الصحيحة استخدم <code>~/</code>.",
      },
      interview: [
        { q: "إيه الفرق بين <code>var</code> و <code>dynamic</code>؟", a: "<code>var</code> بتستنتج النوع من أول قيمة وبعدها النوع ثابت، فـ <code>var x = 5; x = 'a';</code> خطأ وقت الكومبايل. <code>dynamic</code> بتلغي فحص النوع خالص: تقدر تحط أي قيمة وتنادي أي method، ولو مش موجودة الخطأ بيظهر وقت التشغيل. عشان كده <code>dynamic</code> بنستخدمها في أضيق الحدود، زي JSON لسه متحولش لموديل." },
      ],
    },
    {
      title: "المتغير مش null غير لو قلت",
      en: "Non-nullable by default",
      body: "<p>في Dart أي نوع عادي زي <code>String</code> <b>مينفعش</b> يشيل <code>null</code>. لو عايز المتغير يقبل <code>null</code> تحط <code>?</code> بعد النوع: <code>String?</code>.</p><p>والـ compiler مش هيسيبك تستخدم متغير nullable كأنه عادي غير لما تتأكد إنه مش <code>null</code>.</p>",
      code: {
        lang: "dart",
        src: `String name = 'Hamza';
// name = null;          // error: String can't be null

String? nickname;         // nullable, starts as null
print(nickname);          // null
// print(nickname.length); // error: nickname might be null`,
      },
      terms: [
        ["nullable type", "نوع بيقبل null", "أي نوع بعده <code>?</code> زي <code>int?</code>."],
        ["sound null safety", "أمان مضمون", "لو النوع مش nullable، مستحيل قيمته تبقى null وقت التشغيل."],
      ],
      interview: [
        { q: "يعني إيه sound null safety في Dart؟", a: "يعني الأنواع بتتقسم لـ nullable و non-nullable، والأصل إن المتغير مش nullable. كلمة sound معناها إن ده ضمان حقيقي: لو النوع <code>String</code> مستحيل يطلع <code>null</code> وقت التشغيل، فالـ compiler بيشيل فحوصات null من الكود الناتج، والأخطاء بتتمسك وقت الكتابة بدل ما تبقى crash عند المستخدم." },
      ],
    },
    {
      title: "أدوات التعامل مع null",
      en: "?.  ??  ??=  !",
      code: {
        lang: "dart",
        src: `String? city;

print(city?.length);        // null   (?. stops if city is null)
print(city ?? 'Unknown');   // Unknown (?? gives a default)

city ??= 'Cairo';           // assign only if city is null
print(city);                // Cairo

String sure = city!;        // ! says: trust me, it is not null
print(sure.length);         // 5`,
        note: "<code>!</code> مش بيحل المشكلة، هو بس بيسكّت الـ compiler. لو القيمة طلعت <code>null</code> فعلا البرنامج هيقع.",
      },
      terms: [
        ["?.", "الوصول الآمن", "لو اللي قبله null يرجع null وميكملش."],
        ["??", "القيمة البديلة", "لو الشمال null خد اليمين."],
        ["??=", "عيّن لو null", "بيحط القيمة بس لو المتغير null."],
        ["!", "تأكيد عدم الـ null", "بيحول <code>T?</code> لـ <code>T</code>، ويرمي خطأ لو القيمة null."],
      ],
      pitfall: "إنك ترش <code>!</code> في كل حتة عشان الخطأ الأحمر يختفي. كل <code>!</code> هي crash محتمل. الأحسن <code>??</code> بقيمة بديلة، أو <code>if (x != null)</code>.",
      interview: [
        { q: "إمتى تستخدم <code>!</code> وإمتى لأ؟", a: "استخدمها بس لما أكون متأكد منطقيا إن القيمة مش null والـ compiler مش قادر يثبت ده، زي قيمة اتأكدت منها في سطر قبله في مكان تاني. غير كده بفضل <code>??</code> بقيمة بديلة أو فحص <code>if (x != null)</code> عشان الـ type promotion يشتغل، لأن <code>!</code> على قيمة null بترمي exception وقت التشغيل." },
      ],
    },
    {
      title: "الـ compiler بيفهم الفحص بتاعك",
      en: "Type promotion",
      body: "<p>لما تفحص متغير محلي بـ <code>if (x != null)</code>، Dart بيعتبره جوه الـ <code>if</code> من النوع غير الـ nullable من غير ما تكتب <code>!</code>. ده اسمه <b>type promotion</b>.</p>",
      code: {
        lang: "dart",
        src: `int textLength(String? text) {
  if (text == null) return 0;
  return text.length;   // text is promoted to String here
}

void describe(Object value) {
  if (value is int) {
    print(value + 1);   // promoted to int
  }
}`,
        note: "الـ promotion بيشتغل على المتغيرات المحلية والـ parameters. الـ field العادي في كلاس مبيتعملوش promotion، وحله إنك تنسخه في متغير محلي الأول.",
      },
      interview: [
        { q: "ليه <code>if (user.name != null)</code> مش بيخليني أستخدم <code>user.name.length</code> على طول؟", a: "لأن <code>name</code> هنا field مش متغير محلي، والـ compiler مش ضامن إن قيمته متتغيرش بين الفحص والاستخدام (ممكن يكون getter بيرجع قيمة مختلفة كل مرة). الحل إني أنسخه في متغير محلي: <code>final name = user.name; if (name != null) ...</code> وساعتها الـ promotion يشتغل." },
      ],
    },
    {
      title: "late: هحط القيمة بعدين",
      en: "The late modifier",
      body: "<p><code>late</code> بتقول للـ compiler: المتغير ده مش nullable، بس أنا هحط قيمته بعد التعريف وقبل أول استخدام. مفيدة مع حاجات بتتجهز في <code>initState</code> أو قيمة حسابها تقيل ومش دايما هنحتاجها.</p>",
      code: {
        lang: "dart",
        src: `late String token;        // no value yet, but not nullable

void login() {
  token = 'abc123';
}

void main() {
  // print(token);        // LateInitializationError at run time
  login();
  print(token);           // abc123
}`,
        note: "<code>late</code> كمان بتأجل حساب القيمة: <code>late final data = loadBig();</code> مش هتنادي <code>loadBig</code> غير أول مرة تقرا <code>data</code>.",
      },
      pitfall: "<code>late</code> بتنقل الفحص من وقت الكومبايل لوقت التشغيل. لو قريت المتغير قبل ما يتحط له قيمة هتاخد <code>LateInitializationError</code>. لو مش متأكد إن القيمة هتتحط، خليه nullable أحسن.",
    },
    {
      title: "final مش معناها إن المحتوى ثابت",
      en: "final vs const, in depth",
      body: "<p><code>final</code> بتمنعك تغير المتغير نفسه (يشاور على حاجة تانية)، لكن اللي جواه ممكن يتغير. <code>const</code> بتخلي القيمة كلها ثابتة للأبد، وكل القيم الـ const المتطابقة بتبقى نفس النسخة في الميموري.</p>",
      code: {
        lang: "dart",
        src: `final a = [1, 2];
a.add(3);                    // fine: the list itself can change
// a = [9];                  // error: a is final

const b = [1, 2];
// b.add(3);                 // throws at run time: unmodifiable list

const c = [1, 2];
print(identical(b, c));      // true: one shared instance`,
        note: "عشان كده بنكتب <code>const</code> قدام الـ widgets في Flutter: نفس النسخة بتتستخدم تاني ومبتتبنيش من جديد.",
      },
      focus: [{ label: "احفظها", text: "<code>final</code>: التعيين مرة واحدة، وقت التشغيل. <code>const</code>: القيمة كلها ثابتة ومعروفة وقت الكومبايل." }],
      interview: [
        { q: "إيه الفرق بين <code>final</code> و <code>const</code>؟", a: "الاتنين مبيتغيروش بعد التعيين. <code>final</code> قيمتها بتتحدد مرة واحدة وقت التشغيل، زي <code>final now = DateTime.now()</code>. <code>const</code> لازم قيمتها تكون معروفة وقت الكومبايل، وبتبقى ثابتة بعمق: <code>const [1, 2]</code> مينفعش تضيف عليها. وكمان القيم الـ const المتطابقة بتتشارك نفس النسخة في الميموري، وده سبب إن <code>const</code> widgets أخف في Flutter." },
        { q: "ليه بنحط <code>const</code> قدام الـ widgets؟", a: "لأن الـ widget الـ const بيتبني مرة واحدة وقت الكومبايل ونفس النسخة بتتستخدم في كل build، فمفيش object جديد بيتعمل، و Flutter بيعرف إنه متغيرش فمبيعيدش بناء الجزء ده. ده بيقلل الشغل على الـ garbage collector وعدد الـ rebuilds." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: تلات أنواع تعريف",
      lang: "dart",
      code: `void main() {
  var count = 0;
  final name = 'Hamza';
  const maxItems = 20;

  count = count + 1;
  print('$name has $count of $maxItems');
}`,
    },
    {
      title: "اكتب: أدوات null",
      lang: "dart",
      code: `String greet(String? name) {
  final safe = name ?? 'guest';
  return 'Hello, $safe';
}

int textLength(String? text) {
  if (text == null) return 0;
  return text.length;
}

void main() {
  String? city;
  city ??= 'Cairo';
  print(greet(null));
  print(textLength(city));
}`,
    },
    {
      title: "اكتب: late و const",
      lang: "dart",
      code: `late String token;

const roles = ['admin', 'office', 'client'];

void login(String value) {
  token = value;
}

void main() {
  final picked = [...roles];
  picked.add('guest');
  login('abc123');
  print('\${picked.length} roles, token $token');
}`,
      note: "خد بالك من <code>[...roles]</code>: بتعمل نسخة جديدة تقدر تعدل فيها، لأن القايمة الـ const مبتتعدلش.",
    },
  ],

  tasks: [
    {
      title: "اسم العرض",
      lang: "dart",
      prompt: "<p>اكتب دالة <code>displayName</code> بتاخد <code>String? first</code> و <code>String? last</code> وترجع <code>String</code>:</p><ul><li>لو الاتنين موجودين: الاسمين وبينهم مسافة.</li><li>لو واحد بس موجود: هو لوحده.</li><li>لو الاتنين <code>null</code>: الكلمة <code>Guest</code>.</li></ul><p>من غير ما تستخدم <code>!</code> خالص.</p>",
      examples: [
        { in: "displayName('Hamza', 'Saied')", out: "Hamza Saied" },
        { in: "displayName(null, 'Saied')", out: "Saied" },
        { in: "displayName(null, null)", out: "Guest" },
      ],
      starter: `String displayName(String? first, String? last) {
  // your code
}`,
      hints: [
        "ابدأ بالحالة اللي فيها الاتنين <code>null</code> وارجع منها بدري.",
        "بعد <code>if (first == null) return ...</code> الـ compiler بيعتبر <code>first</code> من نوع <code>String</code> في باقي الدالة.",
      ],
      solution: `String displayName(String? first, String? last) {
  if (first == null && last == null) return 'Guest';
  if (first == null) return last!;
  if (last == null) return first;
  return '$first $last';
}

// Without any "!": use ?? so the compiler has nothing to doubt.
String displayName2(String? first, String? last) {
  if (first != null && last != null) return '$first $last';
  return first ?? last ?? 'Guest';
}`,
      explain: "النسخة الأولى بتوضح حدود الـ promotion: بعد الشرط الأول الـ compiler مش قادر يستنتج إن <code>last</code> مش null، فاحتجنا <code>!</code>. النسخة التانية هي المطلوبة: <code>first ?? last ?? 'Guest'</code> بتاخد أول قيمة مش null، ومفيهاش ولا <code>!</code>.",
    },
    {
      title: "متوسط الدرجات",
      lang: "dart",
      prompt: "<p>اكتب دالة <code>average</code> بتاخد <code>List&lt;int?&gt; marks</code> (فيها درجات وبعضها <code>null</code> يعني الطالب غاب) وترجع <code>double</code>: متوسط الدرجات الموجودة بس. لو مفيش ولا درجة ترجع <code>0</code>.</p>",
      examples: [
        { in: "average([10, null, 20])", out: "15.0" },
        { in: "average([null, null])", out: "0.0" },
      ],
      hints: [
        "لف على القايمة بـ <code>for</code>، وجوه اللفة افحص <code>if (m != null)</code> قبل ما تجمع.",
        "محتاج متغيرين: المجموع وعدد الدرجات الموجودة. وخد بالك من القسمة على صفر.",
      ],
      solution: `double average(List<int?> marks) {
  var sum = 0;
  var count = 0;
  for (final m in marks) {
    if (m != null) {
      sum += m;     // m is promoted to int here
      count++;
    }
  }
  if (count == 0) return 0;
  return sum / count;
}`,
      explain: "<code>m</code> متغير محلي، فالفحص <code>m != null</code> بيعمله promotion لـ <code>int</code> ومحتاجناش <code>!</code>. و <code>sum / count</code> بترجع <code>double</code> حتى لو الاتنين <code>int</code>. التعقيد O(n) لأننا بنعدي على القايمة مرة واحدة.",
    },
  ],

  quiz: [
    {
      q: "أنهي سطر فيه خطأ وقت الكومبايل؟",
      code: { lang: "dart", src: `var a = 5;        // 1
a = 6;            // 2
a = 'six';        // 3
final b = a + 1;  // 4` },
      options: ["السطر 1", "السطر 2", "السطر 3", "السطر 4"],
      answer: 2,
      why: "<code>var</code> استنتجت إن <code>a</code> من نوع <code>int</code>، فمينفعش يتحط فيها <code>String</code>. تغيير القيمة لرقم تاني في السطر 2 عادي.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `int? a;
print(a ?? 5);` },
      answer: ["5"],
      why: "<code>a</code> قيمتها <code>null</code> لأنها nullable ومتحطلهاش قيمة، فـ <code>??</code> بترجع الطرف اليمين.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final list = [1, 2];
list.add(3);
print(list.length);` },
      options: ["2", "3", "خطأ وقت الكومبايل", "خطأ وقت التشغيل"],
      answer: 1,
      why: "<code>final</code> بتمنع إن <code>list</code> تشاور على قايمة تانية، لكن القايمة نفسها تقدر تتعدل. اللي كان هيرمي خطأ وقت التشغيل هو <code>const [1, 2]</code>.",
    },
    {
      q: "أنهي تعريف صح؟",
      options: [
        "<code>const now = DateTime.now();</code>",
        "<code>final now = DateTime.now();</code>",
        "<code>String name = null;</code>",
        "<code>int? x = 'a';</code>",
      ],
      answer: 1,
      why: "<code>DateTime.now()</code> بتتحسب وقت التشغيل، فتنفع مع <code>final</code> ومتنفعش مع <code>const</code>. <code>String</code> مش nullable، و <code>int?</code> بتقبل <code>int</code> أو <code>null</code> بس.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `String? name;
print(name?.length);` },
      options: ["0", "null", "خطأ وقت الكومبايل", "LateInitializationError"],
      answer: 1,
      why: "<code>?.</code> بتلاقي <code>name</code> بـ <code>null</code> فبترجع <code>null</code> من غير ما تحاول تقرا <code>length</code>. لو كتبت <code>name.length</code> من غير <code>?</code> كان هيبقى خطأ كومبايل.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `const a = [1, 2];
const b = [1, 2];
print(identical(a, b));` },
      options: ["true", "false", "خطأ وقت الكومبايل", "حسب التشغيل"],
      answer: 0,
      why: "القيم الـ const المتطابقة بتتشارك نسخة واحدة في الميموري، فـ <code>identical</code> بترجع <code>true</code>. لو الاتنين <code>final</code> كانوا هيبقوا قايمتين مختلفتين والناتج <code>false</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print(7 ~/ 2);` },
      answer: ["3"],
      why: "<code>~/</code> قسمة صحيحة بترمي الكسر. <code>7 / 2</code> كانت هترجع <code>3.5</code>.",
    },
    {
      q: "إيه اللي بيحصل لو قريت متغير <code>late</code> على مستوى الملف قبل ما يتحط له قيمة؟",
      options: [
        "بيرجع <code>null</code>",
        "خطأ وقت الكومبايل دايما",
        "<code>LateInitializationError</code> وقت التشغيل",
        "بياخد القيمة الافتراضية للنوع",
      ],
      answer: 2,
      why: "<code>late</code> بتأجل الفحص لوقت التشغيل: المتغير مش nullable فمينفعش يرجع <code>null</code>، ومفيش في Dart قيم افتراضية للأنواع، فبيرمي <code>LateInitializationError</code>.",
    },
    {
      q: "أنهي واحدة أأمن طريقة تطبع طول <code>String? text</code> أو صفر لو مش موجود؟",
      options: [
        "<code>print(text!.length);</code>",
        "<code>print(text.length ?? 0);</code>",
        "<code>print(text?.length ?? 0);</code>",
        "<code>print(text.length);</code>",
      ],
      answer: 2,
      why: "<code>text?.length</code> بترجع <code>null</code> لو النص مش موجود، و <code>?? 0</code> بتحولها لصفر. <code>text!</code> هتقع لو القيمة null، والاختيارين التانيين مش هيعدوا من الكومبايل أصلا.",
    },
  ],
};
