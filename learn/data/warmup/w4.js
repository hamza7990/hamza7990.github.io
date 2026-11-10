window.LEVELS = window.LEVELS || {};
window.LEVELS["warmup/w4"] = {
  slides: [
    {
      kicker: "ليه نتتبع الكود بإيدينا",
      title: "لو مقدرتش تتخيل الكود بيعمل إيه، مش هتعرف تصلحه",
      en: "Tracing code by hand",
      body: "<p>في الإنترفيو بيديك snippet صغير ويسألك «بيطبع إيه؟». وفي الشغل، أي bug هتصلحه بتبدأ فيه بنفس المهارة: تمشي على الكود سطر سطر زي الكمبيوتر بالظبط، مش زي ما <i>إنت</i> فاكر إنه بيشتغل.</p><p>المستوى ده بيرجعلك الإحساس ده. من غير ما تشغل الكود: ورقة وقلم.</p>",
      points: [
        "الكمبيوتر مبيفهمش نيتك؛ بينفذ سطر واحد في المرة بالترتيب.",
        "التتبع هو أسرع طريقة تلاقي بيها bug منطقي (off-by-one، شرط معكوس).",
        "كل أسئلة «هيطبع إيه؟» بتتحل بنفس الأداة: <b>جدول التتبع</b>.",
      ],
    },
    {
      title: "جدول التتبع",
      en: "The trace table",
      body: "<p>اعمل جدول: عمود لكل متغير، وصف جديد كل ما قيمة تتغير (أو كل لفة في loop). اكتب القيم بعد تنفيذ كل سطر. أي <code>print</code> اكتب ناتجه على جنب.</p>",
      code: {
        lang: "dart",
        title: "مثال",
        src: `var total = 0;
for (var i = 1; i <= 4; i++) {
  total += i * 2;
}
print(total);

// i | total after the line
// 1 | 2
// 2 | 6
// 3 | 12
// 4 | 20
// prints 20`,
        note: "كل لفة صف. لما شرط <code>i &lt;= 4</code> يفشل (i=5) اللوب يوقف وبعدها السطر اللي بعد الـ loop يتنفذ.",
      },
      focus: [{ label: "القاعدة", text: "متحسبش في دماغك. اكتب كل قيمة. معظم الأخطاء بتيجي من متغير نسيت تحدثه." }],
      interview: [
        { q: "المقابِل ادّاك snippet وطلب منك تقول الناتج. إزاي تتعامل؟", a: "مبخمنش. بكتب جدول تتبع: عمود لكل متغير وصف لكل لفة أو تغيير. بنفذ سطر سطر وأنطق اللي بعمله بصوت عالي. وبعد ما أوصل للناتج أراجع الحدود: أول لفة وآخر لفة وهل الشرط بيستخدم &lt; ولا &lt;=. ده بيبين للمقابل طريقة تفكيري حتى لو غلطت في رقم." },
      ],
    },
    {
      title: "ترتيب التنفيذ في الإسناد",
      en: "Assignment order",
      body: "<p><code>x = x + 1</code> مش معادلة رياضية؛ هي أمر: «احسب اليمين بالقيمة الحالية، وبعدها حطه في x». ولو غيرت متغير في سطر، السطر اللي بعده بيشوف القيمة الجديدة.</p>",
      code: {
        lang: "dart",
        title: "تبديل قيمتين",
        src: `var a = 3;
var b = 4;
var t = a;    // t = 3
a = b;        // a = 4
b = t;        // b = 3
print('$a $b');  // 4 3

// Wrong swap:
var x = 3, y = 4;
x = y;        // x = 4
y = x;        // y = 4   (the old x is lost)
print('$x $y');  // 4 4`,
        note: "من غير متغير مؤقت بتضيع القيمة الأولى. في Dart فيه كمان <code>(a, b) = (b, a);</code> لكن فهم الطريقة الأولى هو المهم.",
      },
      terms: [
        ["increment", "زيادة بمقدار 1", "<code>i++</code> بترجع القيمة القديمة ثم تزود. <code>++i</code> بتزود ثم ترجع الجديدة."],
      ],
      pitfall: "<code>var y = x++ + 2;</code> بتستخدم x بالقيمة القديمة في الجمع وبعدين تزودها. لو x=5 يبقى y=7 و x=6.",
    },
    {
      title: "if و else if و else",
      en: "Branches",
      body: "<p>السلسلة <code>if / else if / else</code> بتنفذ <b>أول</b> فرع شرطه true وبتتخطى الباقي. أما كذا <code>if</code> متتالية منفصلة، فكل واحدة بتتفحص لوحدها.</p>",
      codes: [
        {
          lang: "dart",
          title: "سلسلة واحدة",
          src: `var score = 95;
var r = '';
if (score >= 90) {
  r = 'A';
} else if (score >= 70) {
  r = 'B';
}
print(r);  // A  (second branch skipped)`,
        },
        {
          lang: "dart",
          title: "if منفصلة",
          src: `var score = 95;
var r = '';
if (score >= 90) r += 'A';
if (score >= 70) r += 'B';
print(r);  // AB  (both ran)`,
        },
      ],
      pitfall: "ترتيب الشروط في السلسلة مهم: لو كتبت <code>score &gt;= 50</code> قبل <code>score &gt;= 90</code> الفرع الأول هياخد كل الدرجات العالية.",
      interview: [
        { q: "إيه الفرق بين سلسلة <code>if / else if</code> وكذا <code>if</code> متتالية؟", a: "في السلسلة بيتنفذ أول فرع شرطه true وباقي الفروع بتتخطى. في الـ <code>if</code> المتتالية كل واحدة بتتفحص لوحدها فممكن يتنفذ أكتر من فرع. مثلا <code>score = 95</code> مع شرطين <code>&gt;= 90</code> و <code>&gt;= 70</code> بيدي A في السلسلة، و AB في الـ if المنفصلين." },
      ],
    },
    {
      title: "حلقة for و while",
      en: "Loops",
      body: "<p><code>for (init; condition; update)</code>: التهيئة مرة واحدة، وبعدين كل لفة: افحص الشرط، نفّذ الجسم، نفّذ التحديث. في <code>while</code> انت اللي بتحدّث بنفسك داخل الجسم، فلو نسيت اللوب مبيخلصش.</p>",
      code: {
        lang: "dart",
        title: "Collatz",
        src: `var n = 6;
var steps = 0;
while (n != 1) {
  if (n % 2 == 0) {
    n = n ~/ 2;
  } else {
    n = 3 * n + 1;
  }
  steps++;
}
print(steps);  // 8   (6,3,10,5,16,8,4,2,1)`,
        note: "اتبع: n بتمر بـ 6 ثم 3 ثم 10 ثم 5 ثم 16 ثم 8 ثم 4 ثم 2 ثم 1. تمام 8 خطوات.",
      },
      terms: [
        ["do-while", "نفّذ ثم افحص", "الجسم بيتنفذ مرة على الأقل، حتى لو الشرط false من الأول."],
      ],
    },
    {
      title: "حلقات متداخلة",
      en: "Nested loops",
      body: "<p>اللوب الداخلي بيشتغل <b>كله</b> مع كل لفة من الخارجي، ومتغيره بيرجع للبداية. عدد اللفات الكلي = لفات الخارجي × لفات الداخلي (لو الداخلي ثابت).</p>",
      code: {
        lang: "dart",
        title: "تتبع",
        src: `var c = 0;
for (var i = 0; i < 3; i++) {
  for (var j = i; j < 3; j++) {
    c++;
  }
}
print(c);  // 6

// i=0: j = 0,1,2  -> 3 times
// i=1: j = 1,2    -> 2 times
// i=2: j = 2      -> 1 time`,
        note: "الداخلي بيبدأ من <code>i</code> فعدد لفاته بيقل. لو ثابت كان الناتج 9.",
      },
      pitfall: "متفترضش إن عدد اللفات دايما ضرب. لو حد المتغير الداخلي بيعتمد على الخارجي، اكتب كل صف.",
    },
    {
      title: "القسمة والباقي في Dart",
      en: "Division and modulo",
      body: "<p>تلات حاجات لازم تعرفها:</p>",
      points: [
        "<code>/</code> بترجع <code>double</code> دايما: <code>10 / 2</code> بتطبع <code>5.0</code>.",
        "<code>~/</code> قسمة صحيحة بتقطع الكسر ناحية الصفر: <code>7 ~/ 2 = 3</code> و <code>-7 ~/ 2 = -3</code>.",
        "<code>%</code> الباقي في Dart دايما <b>غير سالب</b> لو المقسوم عليه موجب: <code>-7 % 3 = 2</code>. لكن <code>(-7).remainder(3)</code> بيرجع <code>-1</code>.",
      ],
      code: {
        lang: "dart",
        src: `print(7 ~/ 2 + 7 / 2);   // 3 + 3.5 = 6.5
print(10 / 2);           // 5.0
print(-7 % 3);           // 2
print(-7 ~/ 2);          // -3
print((-7).remainder(3)); // -1`,
        note: "الأولوية: <code>*</code> و <code>/</code> و <code>~/</code> و <code>%</code> في نفس المستوى، من الشمال لليمين، قبل <code>+</code> و <code>-</code>.",
      },
      interview: [
        { q: "إيه الفرق بين <code>/</code> و <code>~/</code> في Dart؟ وإيه ناتج <code>-7 % 3</code>؟", a: "<code>/</code> بترجع double دايما، يعني <code>7 / 2 = 3.5</code>، و <code>~/</code> قسمة صحيحة بتقطع الجزء الكسري ناحية الصفر، <code>7 ~/ 2 = 3</code>. وناتج <code>-7 % 3</code> في Dart هو 2 لأن الباقي بيطلع غير سالب (عكس لغات تانية زي Java)، ولو عايز الباقي بإشارة المقسوم أستخدم <code>remainder</code> فتديني -1." },
      ],
    },
    {
      title: "break و continue",
      en: "break and continue",
      body: "<p><code>break</code> بيخرج من اللوب بالكامل. <code>continue</code> بيتخطى باقي اللفة الحالية ويروح للفة اللي بعدها (وفي <code>for</code> التحديث بيتنفذ).</p>",
      code: {
        lang: "dart",
        src: `var s = 0;
for (var i = 1; i <= 5; i++) {
  if (i % 2 == 0) continue;   // skip even i
  s += i;
}
print(s);   // 1 + 3 + 5 = 9

var total = 0, i = 1;
while (true) {
  total += i;
  if (total > 10) break;
  i++;
}
print('$i $total');   // 5 15`,
        note: "في المثال التاني: 1 ثم 3 ثم 6 ثم 10 ثم 15. وقف عند 15 و i=5.",
      },
      interview: [
        { q: "اتبع الكود ده: <code>var i = 5; print(i++); print(++i);</code> بيطبع إيه ولماذا؟", a: "بيطبع 5 ثم 7. <code>i++</code> بترجع القيمة الحالية (5) وبعدين تزود i لـ 6. بعدها <code>++i</code> بتزود الأول (7) وترجع القيمة الجديدة. الفرق بين post و pre increment هو متى القيمة بتتزود بالنسبة للتعبير." },
        { q: "إزاي بتلاقي bug في loop مش مديك الناتج المتوقع؟", a: "بكتب جدول تتبع بعدد قليل من الأرقام (حالات صغيرة زي n=0 و1 و2)، وبقارن كل صف بالقيمة اللي كنت متوقعها. أول صف يختلف هو مكان الـ bug. وبركز على الحدود: القيمة الأولى والأخيرة في الـ loop وشرط التوقف (&lt; ولا &lt;=)." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: تبديل قيمتين",
      lang: "dart",
      code: `void main() {
  var a = 3;
  var b = 4;
  final temp = a;
  a = b;
  b = temp;
  print('$a $b');
}`,
      note: "بيطبع <code>4 3</code>.",
    },
    {
      title: "اكتب: جدول تتبع بالكود",
      lang: "dart",
      code: `void main() {
  var total = 0;
  for (var i = 1; i <= 5; i++) {
    total += i * i;
    print('i=$i total=$total');
  }
  print(total % 7);
}`,
      note: "المجموع 55، وباقيه على 7 هو 6. حاول تتوقع كل سطر قبل ما تشغل.",
    },
  ],

  tasks: [
    {
      title: "تتبع الكود بإيدك",
      lang: "dart",
      prompt: "<p>الكود الموجود تحت لازم تتبعه بجدول من غير ما تشغله. اكتب قيمة <code>a</code> بعد كل لفة وإيه اللي بيطبعه. بعدها شغله وقارن.</p>",
      starter: `void main() {
  var a = 2;
  for (var i = 1; i <= 4; i++) {
    if (i % 2 == 0) {
      a = a * i;
    } else {
      a = a + i;
    }
    print(a);
  }
}`,
      examples: [{ in: "run main()", out: "3\n6\n9\n36" }],
      hints: [
        "ابدأ بـ a=2. في اللفة الفردية (i=1) بتتجمع، وفي الزوجية بتتضرب.",
        "اكتب جدول بأعمدة: i، الشرط (زوجي؟)، العملية، a الجديدة.",
      ],
      solution: `// i | even? | operation  | a
// 1 | no    | 2 + 1      | 3
// 2 | yes   | 3 * 2      | 6
// 3 | no    | 6 + 3      | 9
// 4 | yes   | 9 * 4      | 36
// output: 3, 6, 9, 36

void main() {
  var a = 2;
  for (var i = 1; i <= 4; i++) {
    if (i % 2 == 0) {
      a = a * i;
    } else {
      a = a + i;
    }
    print(a);
  }
}`,
      explain: "كل لفة بتستخدم قيمة a الناتجة من اللفة اللي قبلها، فلازم تكتب القيمة بعد كل صف مش تحسب من الأول. الاختبار الحقيقي هو إنك تجيب نفس الناتج قبل ما تشغل.",
    },
    {
      title: "خطوات Collatz",
      lang: "dart",
      prompt: "<p>اكتب دالة <code>collatzSteps(int n)</code> ترجع عدد الخطوات لحد ما n يوصل 1: لو n زوجي اقسمه على 2، ولو فردي اضربه في 3 وزود 1. افترض n &gt;= 1.</p>",
      examples: [
        { in: "collatzSteps(6)", out: "8" },
        { in: "collatzSteps(1)", out: "0" },
        { in: "collatzSteps(7)", out: "16" },
      ],
      hints: [
        "استخدم <code>while (n != 1)</code> ومتغير <code>steps</code> بيزيد في كل لفة.",
        "جوا اللوب: <code>if (n % 2 == 0) n = n ~/ 2; else n = 3 * n + 1;</code>.",
      ],
      solution: `int collatzSteps(int n) {
  var steps = 0;
  while (n != 1) {
    if (n % 2 == 0) {
      n = n ~/ 2;
    } else {
      n = 3 * n + 1;
    }
    steps++;
  }
  return steps;
}`,
      explain: "نفس تتبع الدرس: كل لفة بتغير n وبتعد خطوة. لما n=1 من الأول اللوب مبيشتغلش وترجع 0. استخدمنا <code>~/</code> عشان n تفضل int.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `var a = 3;
var b = 4;
a = a + b;
b = a - b;
a = a - b;
print('$a $b');` },
      answer: ["4 3", "4  3"],
      why: "a=7 ثم b=7-4=3 ثم a=7-3=4. يعني تبديل بدون متغير مؤقت: الناتج <code>4 3</code>.",
    },
    {
      q: "الناتج إيه؟ (اكتب القيمتين بمسافة)",
      code: { lang: "dart", src: `var x = 5;
var y = x++ + 2;
print('$x $y');` },
      answer: ["6 7"],
      why: "<code>x++</code> بترجع 5 (القيمة القديمة) فـ <code>y = 5 + 2 = 7</code>، وبعدها x بتبقى 6.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `var s = 0;
for (var i = 1; i <= 5; i++) {
  if (i % 2 == 0) continue;
  s += i;
}
print(s);` },
      answer: ["9"],
      why: "<code>continue</code> بيتخطى الأرقام الزوجية (2 و4)، فبنجمع 1 + 3 + 5 = 9.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `var n = 6;
var steps = 0;
while (n != 1) {
  if (n % 2 == 0) {
    n = n ~/ 2;
  } else {
    n = 3 * n + 1;
  }
  steps++;
}
print(steps);` },
      answer: ["8"],
      why: "n بتمر بـ 6 ثم 3 ثم 10 ثم 5 ثم 16 ثم 8 ثم 4 ثم 2 ثم 1: ثماني خطوات.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `var c = 0;
for (var i = 0; i < 3; i++) {
  for (var j = i; j < 3; j++) {
    c++;
  }
}
print(c);` },
      answer: ["6"],
      why: "الداخلي بيشتغل 3 مرات لما i=0، و2 لما i=1، و1 لما i=2: <code>3+2+1 = 6</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print(-7 % 3);` },
      options: ["-1", "1", "2", "-2"],
      answer: 2,
      why: "في Dart الباقي من <code>%</code> غير سالب لما المقسوم عليه موجب. <code>-7 = 3 × (-3) + 2</code> فالباقي 2. القيمة <code>-1</code> هي ناتج <code>(-7).remainder(3)</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print(7 ~/ 2 + 7 / 2);` },
      answer: ["6.5"],
      why: "<code>7 ~/ 2 = 3</code> و <code>7 / 2 = 3.5</code> والجمع <code>6.5</code>. وجود double في الجمع بيخلي الناتج double.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `var score = 95;
var r = '';
if (score >= 90) r += 'A';
if (score >= 70) r += 'B';
print(r);` },
      options: ["A", "B", "AB", "BA"],
      answer: 2,
      why: "الاتنين <code>if</code> منفصلين فكل واحد بيتفحص. الاتنين true فبنضيف A وبعدين B. لو كانت الثانية <code>else if</code> كان الناتج A بس.",
    },
    {
      q: "الناتج إيه؟ (القيمتين بمسافة)",
      code: { lang: "dart", src: `var total = 0, i = 1;
while (true) {
  total += i;
  if (total > 10) break;
  i++;
}
print('$i $total');` },
      answer: ["5 15"],
      why: "total بتبقى 1 ثم 3 ثم 6 ثم 10 (مش أكبر من 10) ثم 15 عند i=5 فبيعمل break قبل ما يزود i. الناتج <code>5 15</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `var a = 0, b = 1;
for (var i = 0; i < 5; i++) {
  var t = a + b;
  a = b;
  b = t;
}
print(a);` },
      answer: ["5"],
      why: "الأزواج (a,b) بعد كل لفة: (1,1) ثم (1,2) ثم (2,3) ثم (3,5) ثم (5,8). بعد 5 لفات a=5.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `var i = 10;
do {
  i++;
} while (i < 5);
print(i);` },
      options: ["10", "11", "5", "اللوب مبيشتغلش خالص"],
      answer: 1,
      why: "<code>do-while</code> بينفذ الجسم مرة على الأقل قبل ما يفحص الشرط: i بتبقى 11 والشرط false فيخرج.",
    },
  ],
};
