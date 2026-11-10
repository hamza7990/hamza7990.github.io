window.LEVELS = window.LEVELS || {};
window.LEVELS["warmup/w2"] = {
  slides: [
    {
      kicker: "ليه المنطق",
      title: "كل if في الكود هو جملة منطقية",
      en: "Logic and deduction",
      body: "<p>الكود كله قرارات: <code>if (age &gt;= 18 &amp;&amp; hasTicket)</code>. لو دماغك متعودة تفكك الجمل المنطقية صح، هتكتب شروط أقل أخطاء وتلاقي الـ bug اللي في شرط معكوس بسرعة. المستوى ده بيدربك على الاستنتاج خطوة بخطوة، من غير ما تخمّن.</p>",
      points: [
        "ألغاز الاستنتاج ليها دايما حل واحد: لو وصلت لحلين يبقى فيه معلومة ضيعتها.",
        "الطريقة: اكتب المعلومات، استبعد المستحيل، جرّب فرضية وشوف هل بتتناقض.",
        "في الآخر هنحول نفس التفكير لـ AND و OR و NOT في الكود.",
      ],
    },
    {
      title: "جدول الاستبعاد",
      en: "Elimination grid",
      body: "<p>لو فيه ناس وحاجات (أسماء وهوايات مثلا)، ارسم جدول صفوفه الناس وأعمدته الحاجات. كل معلومة «مش» بتحط ✗ في خانة. لما صف أو عمود يفضل فيه خانة واحدة، دي ✓، وتشطب باقي صفها وعمودها.</p>",
      code: {
        lang: "dart",
        title: "ليلى وندى وعمر: كلب وقطة وطائر",
        src: `// Clues:
//  1. Layla has no cat.
//  2. Layla has no bird.
//  3. Nada has no dog.
//  4. Omar has no cat.
//
//          cat   dog   bird
// Layla     x     ?     x     -> Layla has the dog
// Nada      ?     x     ?
// Omar      x     x     ?     -> cat is only left for Nada
//
// Result: Layla=dog, Nada=cat, Omar=bird`,
        note: "المعلومتين 1 و2 بيخلوا ليلى مع الكلب، والتالتة بتشيل الكلب من ندى. عمر مبيمتلكش قطة، فالطائر عند عمر والقطة عند ندى.",
      },
      focus: [{ label: "القاعدة", text: "ابدأ من أكتر معلومة بتقيّد: اللي بتشطب أكبر عدد من الاحتمالات." }],
    },
    {
      title: "الصادق والكدّاب",
      en: "Truth-tellers and liars",
      body: "<p>في الألغاز دي، الصادق كلامه كله حقيقي والكدّاب كلامه كله غلط. الطريقة الوحيدة المضمونة: <b>افترض</b> حاجة عن شخص، تتبع النتيجة، وشوف هل في تناقض. التناقض معناه الفرضية غلط.</p>",
      code: {
        lang: "dart",
        title: "ثلاثة أشخاص",
        src: `// A says: "B is a liar."
// B says: "C is a liar."
// C says: "A and B are both liars."
//
// Assume A is truthful:
//   B is a liar, so B's statement is false, so C is truthful.
//   But C says A is a liar -> contradiction. So A lies.
//
// A is a liar:
//   "B is a liar" is false, so B is truthful.
//   B says C is a liar, true, so C is a liar.
//   Check C: "A and B both liars" is false because B is truthful. OK.
//
// Answer: only B is truthful.`,
        note: "مشي بافتراض واحد، وصلنا لتناقض في فرضية والفرضية العكسية رجعت متسقة. كده الحل اتحدد.",
      },
      pitfall: "متنساش تتحقق من كلام <b>كل</b> شخص في الآخر، مش اللي بدأت بيه بس. الحل لازم يخلي الصادق كلامه صح والكدّاب كلامه غلط.",
      interview: [
        { q: "قدامك لغز فيه 3 أشخاص بعضهم بيكذب. إزاي تمشي في الحل بشكل منظم؟", a: "أفترض حاجة عن شخص واحد (إنه صادق مثلا) وأتتبع النتائج: لو وصلت لتناقض أعرف إن الفرضية غلط وأجرب العكس. في الآخر أتحقق من كلام كل واحد على الحل. ولو الأشخاص قليلين أقدر أجرب كل التركيبات (2 أس عدد الأشخاص) بالكود كطريقة brute force للتأكد." },
      ],
    },
    {
      title: "لو ... يبقى",
      en: "If-then and contrapositive",
      body: "<p>الجملة «لو P يبقى Q» معناها إن P تكفي لـ Q. تقدر تستنتج منها حاجتين بس:</p>",
      points: [
        "لو P حصل → Q حصل (ده الأصل).",
        "لو Q ما حصلش → P ما حصلش (<b>العكس المعاكس</b>، contrapositive، وهو مكافئ للأصل).",
        "لكن لو Q حصل، مينفعش تقول P حصل. ولو P ما حصلش، مينفعش تقول Q ما حصلش. ده الغلط الشائع.",
      ],
      code: {
        lang: "dart",
        title: "مثال",
        src: `// Rule: if a student studies, the student passes.
//
// Ali studied        => Ali passed          (valid)
// Sami did not pass  => Sami did not study  (valid, contrapositive)
// Omar passed        => ???                 (cannot say; maybe luck)
// Nour did not study => ???                 (cannot say)`,
        note: "الفرق بين «Sami ما نجحش» و «Omar نجح» هو بالظبط الفرق بين الاستنتاج الصحيح والغلط.",
      },
      focus: [{ label: "احفظها", text: "الأصل والـ contrapositive مكافئين. الـ converse (عكس الاتجاه) مش مكافئ." }],
    },
    {
      title: "القياس المنطقي",
      en: "Syllogisms",
      body: "<p>جملتين ينتجوا استنتاج. اللعبة: ارسم دواير (Venn) بدل ما تعتمد على إحساسك.</p><p>«كل A هو B» يعني دايرة A جوا دايرة B. «بعض B هو C» يعني الدايرتين بيتقاطعوا في حتة، بس مش بالضرورة عند A.</p>",
      code: {
        lang: "dart",
        title: "مثال",
        src: `// All cats are animals.         (cats inside animals)
// Some animals are fast.         (animals and fast overlap)
// So: some cats are fast?        NOT guaranteed.
//
// The overlap between animals and fast may sit outside the cats circle.
//
// All cats are animals + all animals breathe
// => all cats breathe             (guaranteed: circle inside circle)`,
        note: "الاستنتاج «بعض القطط سريعة» ممكن يطلع صح في الواقع لكن مش لازم منطقيا من الجملتين. السؤال دايما: هل بيلزم؟",
      },
      pitfall: "«بعض» في المنطق معناها «واحد على الأقل». ومتسخدمش معلومتك عن العالم الحقيقي؛ اشتغل بس على اللي في الجمل.",
      interview: [
        { q: "«كل مبرمج بيشرب قهوة» و«أحمد بيشرب قهوة». هل أحمد مبرمج؟", a: "لا يلزم. الجملة الأولى بتقول إن المبرمجين جوا مجموعة شاربي القهوة، مش إن كل شاربي القهوة مبرمجين. أحمد ممكن يكون برا دايرة المبرمجين. ده هو غلط الـ converse: عكس اتجاه الجملة بدون مبرر. اللي يتستنتج بس: لو أحمد ما بيشربش قهوة فهو مش مبرمج." },
      ],
    },
    {
      title: "المنطق البولياني",
      en: "Boolean logic",
      body: "<p>في الكود عندك <code>&amp;&amp;</code> (AND) و <code>||</code> (OR) و <code>!</code> (NOT). الـ AND بيطلع true بس لو الاتنين true. الـ OR بيطلع true لو واحد على الأقل true.</p>",
      code: {
        lang: "dart",
        title: "جدول الحقيقة",
        src: `// a      b      a && b   a || b   !a
// true   true   true     true     false
// true   false  false    true     false
// false  true   false    true     true
// false  false  false    false    true

void main() {
  final a = true, b = false;
  print(a && b);  // false
  print(a || b);  // true
  print(!a);      // false
}`,
        note: "الأولوية: <code>!</code> الأول، بعده <code>&amp;&amp;</code>، بعده <code>||</code>. يعني <code>a || b &amp;&amp; c</code> = <code>a || (b &amp;&amp; c)</code>.",
      },
      terms: [
        ["short-circuit", "قطع التقييم", "في <code>a &amp;&amp; b</code> لو a كانت false مش بيشوف b أصلا. نفس الشيء مع <code>||</code> لما a تبقى true."],
      ],
    },
    {
      title: "De Morgan: إزاي تعكس شرط",
      en: "De Morgan's laws",
      body: "<p>لما تعكس شرط فيه AND أو OR، الاتنين بيتبادلوا وكل جزء بيتعكس:</p>",
      code: {
        lang: "dart",
        title: "قانونين",
        src: `// !(a && b)  ==  !a || !b
// !(a || b)  ==  !a && !b

// Real example: valid input is 1..100
bool invalid1(int x) => !(x >= 1 && x <= 100);
bool invalid2(int x) => x < 1 || x > 100;   // same meaning`,
        note: "عكس <code>&gt;=</code> هو <code>&lt;</code> وعكس <code>&lt;=</code> هو <code>&gt;</code>. الشرطين فوق بيدوا نفس النتيجة لأي رقم.",
      },
      focus: [{ label: "احفظها", text: "عكس «الاتنين» هو «واحد على الأقل مش متحقق». وعكس «واحد على الأقل» هو «ولا واحد»." }],
      pitfall: "غلطة مشهورة: تعكس العلامات وتنسى تبدل <code>&amp;&amp;</code> بـ <code>||</code>. النتيجة شرط يرفض كل حاجة أو يقبل كل حاجة.",
    },
    {
      title: "من الألغاز إلى شروط الكود",
      en: "From puzzles to conditions",
      body: "<p>ثلاث عادات بتنقلك من لغز لكود نضيف:</p>",
      points: [
        "<b>XOR</b> (واحد بس صح): في Dart اكتبها <code>a != b</code> للـ bool.",
        "<b>الـ early return</b>: بدل if متداخلة، تفحص الحالة المستبعدة وترجع منها، والباقي يبقى بسيط.",
        "<b>جدول الحقيقة للتحقق</b>: لو مش متأكد إن شرطين متكافئين، جرب كل التركيبات (أو اكتب loop صغير يجربها).",
      ],
      code: {
        lang: "dart",
        title: "تحقق من De Morgan بكود",
        src: `void main() {
  var same = true;
  for (final a in [true, false]) {
    for (final b in [true, false]) {
      if (!(a && b) != (!a || !b)) same = false;
    }
  }
  print(same);  // true
}`,
        note: "الكود بيجرب الأربع تركيبات للقيمتين ويقارن الطرفين. لو في تركيبة اختلفت <code>same</code> هتبقى false.",
      },
      interview: [
        { q: "إيه الفرق بين <code>a &amp;&amp; b</code> و <code>a &amp; b</code> في Dart، ومعنى short-circuit؟", a: "في Dart <code>&amp;&amp;</code> عامل منطقي للـ bool وبيقطع التقييم: لو <code>a</code> false مش بيحسب <code>b</code> أصلا. ده مفيد مثلا في <code>x != null &amp;&amp; x.length &gt; 3</code> عشان مفيش خطأ. أما <code>&amp;</code> فهو bitwise على الأرقام ومبيعملش short-circuit. للشروط استخدم دايما <code>&amp;&amp;</code> و <code>||</code>." },
        { q: "اكتب عكس الشرط <code>age &gt;= 18 &amp;&amp; hasId</code> من غير <code>!</code> قدام القوس.", a: "بتطبيق De Morgan: عكس AND هو OR مع عكس كل جزء، فالنتيجة <code>age &lt; 18 || !hasId</code>. يعني الشخص مرفوض لو أقل من 18 أو معهوش هوية. أتأكد بتجربة حالة: age=20 و hasId=false، الأصل false والعكس true." },
        { q: "حد قالك: كل اللي بيذاكر بينجح، وفلان ما نجحش. تستنتج إيه؟ وليه مينفعش تستنتج لو فلان نجح؟", a: "أستنتج إن فلان ما ذاكرش، لأن ده الـ contrapositive للجملة، وهو مكافئ لها منطقيا. لو فلان نجح مقدرش أقول إنه ذاكر، لأن الجملة بتقول إن المذاكرة كافية للنجاح مش إنها الطريقة الوحيدة، ممكن ينجح بسبب تاني." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: شرط AND",
      lang: "dart",
      code: `bool canEnter(int age, bool hasTicket) {
  return age >= 18 && hasTicket;
}

void main() {
  print(canEnter(20, true));
  print(canEnter(16, true));
}`,
      note: "الأولى true والتانية false. خد بالك إن الشرط بيرجع قيمة bool على طول.",
    },
    {
      title: "اكتب: اختبار De Morgan",
      lang: "dart",
      code: `void main() {
  var same = true;
  for (final a in [true, false]) {
    for (final b in [true, false]) {
      final left = !(a && b);
      final right = !a || !b;
      if (left != right) same = false;
    }
  }
  print(same);
}`,
      note: "بيطبع true لأن الشرطين متكافئين في الأربع حالات.",
    },
  ],

  tasks: [
    {
      title: "اختبار كل الاحتمالات للصادق والكدّاب",
      lang: "dart",
      prompt: "<p>ثلاثة أشخاص A و B و C. A بيقول «B كدّاب». B بيقول «C كدّاب». C بيقول «A و B الاتنين كدّابين». كل واحد إما صادق دايما أو كدّاب دايما.</p><p>اشرح الحل بالفرضيات، وبعدها اكتب برنامج Dart يجرب الـ 8 احتمالات (كل شخص صادق أو كدّاب) ويطبع الاحتمالات المتسقة بس. الشخص الصادق لازم كلامه يطلع صح، والكدّاب لازم كلامه يطلع غلط.</p>",
      examples: [{ in: "run main()", out: "A=false B=true C=false" }],
      hints: [
        "عرّف الاحتمال بتلات متغيرات bool: <code>a</code> و <code>b</code> و <code>c</code> (true يعني صادق). استخدم تلات loops متداخلة على <code>[true, false]</code>.",
        "كلام A: «B كدّاب» = <code>!b</code>. الشخص متسق لو (هو صادق) == (كلامه صح).",
      ],
      solution: `// By hand:
//  If A tells the truth, B lies, so "C is a liar" is false -> C tells the
//  truth. But C says A lies. Contradiction. So A lies, B is truthful, C lies.

void main() {
  for (final a in [true, false]) {
    for (final b in [true, false]) {
      for (final c in [true, false]) {
        final aSays = !b;            // "B is a liar"
        final bSays = !c;            // "C is a liar"
        final cSays = !a && !b;      // "A and B are liars"
        if (a == aSays && b == bSays && c == cSays) {
          print('A=$a B=$b C=$c');
        }
      }
    }
  }
}`,
      explain: "القاعدة: الشخص صادق (true) بالظبط لما كلامه يطلع صح، يعني <code>a == aSays</code>. البرنامج بيجرب كل التركيبات (brute force) وبيطبع الوحيدة المتسقة: <code>A=false B=true C=false</code>. دي نفس نتيجة الاستنتاج اليدوي، والبروت فورس مفيد كطريقة للتحقق من حلك.",
    },
    {
      title: "عكس شرط من غير !",
      lang: "dart",
      prompt: "<p>الدالة دي بترفض الإدخال الصحيح: <code>bool invalid(int x) =&gt; !(x &gt;= 1 &amp;&amp; x &lt;= 100);</code></p><p>اكتب <code>invalid2</code> بنفس المعنى من غير ما تستخدم <code>!</code>، وبعدها اكتب <code>main</code> تجرب بيها الاتنين على الأرقام من -5 لـ 105 وتطبع <code>true</code> لو دايما النتيجتين متطابقتين.</p>",
      starter: `bool invalid(int x) => !(x >= 1 && x <= 100);

bool invalid2(int x) {
  // your code
}`,
      hints: [
        "طبّق De Morgan: عكس AND هو OR وكل جزء بيتعكس.",
        "عكس <code>x &gt;= 1</code> هو <code>x &lt; 1</code>، وعكس <code>x &lt;= 100</code> هو <code>x &gt; 100</code>.",
      ],
      solution: `bool invalid(int x) => !(x >= 1 && x <= 100);

bool invalid2(int x) {
  return x < 1 || x > 100;
}

void main() {
  var same = true;
  for (var x = -5; x <= 105; x++) {
    if (invalid(x) != invalid2(x)) same = false;
  }
  print(same);
}`,
      explain: "De Morgan: <code>!(A &amp;&amp; B) == !A || !B</code>. الاختبار على مدى أرقام بيغطي الحدود (0 و1 و100 و101) وهي أكتر أماكن الأخطاء. اللعب بالحدود هو أهم جزء في اختبار الشروط.",
    },
  ],

  quiz: [
    {
      q: "ثلاثة أصدقاء (أحمد وبسمة وكريم) في صف من 3 كراسي مرقمة من الشمال لليمين (1 و2 و3). أحمد قاعد على الكرسي اللي بعد كرسي بسمة مباشرة، وكريم مش على الكرسي رقم 1. مين في النص؟",
      answer: ["أحمد", "احمد", "Ahmed", "ahmed"],
      why: "أحمد بعد بسمة مباشرة، فالاحتمالات: (بسمة 1، أحمد 2، كريم 3) أو (كريم 1، بسمة 2، أحمد 3). الثاني مرفوض لأن كريم مش على 1. الحل: بسمة 1، أحمد 2، كريم 3.",
    },
    {
      q: "A بيقول: «B كدّاب». B بيقول: «A وأنا الاتنين صادقين». مين الصادق؟",
      options: ["A بس", "B بس", "الاتنين صادقين", "الاتنين كدّابين"],
      answer: 0,
      why: "لو B صادق، يبقى A صادق، فكلام A «B كدّاب» حقيقي، تناقض. فـ B كدّاب. كلام A «B كدّاب» صح، فـ A صادق. وبنتحقق: كلام B «الاتنين صادقين» غلط وهو كدّاب، متسق.",
    },
    {
      q: "A بيقول «B كدّاب»، B بيقول «C كدّاب»، C بيقول «A و B الاتنين كدّابين». كام واحد صادق؟",
      answer: ["1", "واحد"],
      why: "لو A صادق يطلع C صادق وكلامه بيكذّب A، تناقض. فـ A كدّاب، يبقى B صادق وبالتالي C كدّاب. صادق واحد فقط: B.",
    },
    {
      q: "القاعدة: «كل من يذاكر بينجح». سامي ما نجحش. إيه الاستنتاج اللازم؟",
      options: [
        "سامي ذاكر بس حظه وحش",
        "سامي ما ذاكرش",
        "سامي ممكن ذاكر وممكن لا، مفيش استنتاج",
        "أي حد مش بيذاكر مش هينجح",
      ],
      answer: 1,
      why: "الـ contrapositive لـ «لو ذاكر نجح» هو «لو ما نجحش يبقى ما ذاكرش». الاختيار الأخير هو الـ inverse، وهو مش مكافئ ومينفعش نستنتجه.",
    },
    {
      q: "المعلومات: «كل القطط حيوانات» و«بعض الحيوانات سريعة». أنهي استنتاج بيلزم منطقيا؟",
      options: [
        "بعض القطط سريعة",
        "كل القطط سريعة",
        "لا قطة سريعة",
        "مفيش استنتاج من الاتنين عن سرعة القطط",
      ],
      answer: 3,
      why: "السريعين ممكن يكونوا حيوانات غير القطط، فمفيش ضمان إن قطة منهم، ولا ضمان إنها مفيش. الاستنتاجات التلاتة التانية محتاجة معلومة زيادة.",
    },
    {
      q: "ليلى وندى وعمر عندهم كلب وقطة وطائر (كل واحد حاجة). ليلى مفيش عندها قطة ولا طائر. ندى مفيش عندها كلب. عمر مفيش عنده قطة. مين عنده الطائر؟",
      answer: ["عمر", "Omar", "omar"],
      why: "ليلى ليها الكلب (استبعدنا القطة والطائر). ندى مفيش عندها كلب وهو أصلا عند ليلى، فقطة أو طائر. عمر مفيش عنده قطة فالطائر. ندى القطة.",
    },
    {
      q: "أحمد أكبر من بسمة. كريم أصغر من بسمة. دينا أكبر من أحمد. مين الأصغر؟",
      answer: ["كريم", "Karim", "karim"],
      why: "الترتيب من الأكبر: دينا &gt; أحمد &gt; بسمة &gt; كريم. إذن كريم أصغرهم.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final a = true, b = false;
print(!(a && b));` },
      answer: ["true"],
      why: "<code>a &amp;&amp; b</code> = false، وعكسها true. وبـ De Morgan: <code>!a || !b</code> = false || true = true.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final a = false, b = true, c = true;
print(a || b && c);` },
      answer: ["true"],
      why: "<code>&amp;&amp;</code> أولى من <code>||</code>، فالتعبير هو <code>a || (b &amp;&amp; c)</code> = false || true = true. لو قريتها من الشمال لليمين غلط (a || b) &amp;&amp; c هتطلع true بالصدفة؛ جرب بـ a=true, b=false, c=false وشوف الفرق: الصح true، والخطأ false.",
    },
    {
      q: "أنهي شرط بيساوي <code>!(age &gt;= 18 &amp;&amp; hasId)</code>؟",
      options: [
        "<code>age &lt; 18 &amp;&amp; !hasId</code>",
        "<code>age &lt; 18 || !hasId</code>",
        "<code>age &lt;= 18 || !hasId</code>",
        "<code>age &lt; 18 || hasId</code>",
      ],
      answer: 1,
      why: "De Morgan: عكس AND هو OR وعكس الجزئين. عكس <code>&gt;=</code> هو <code>&lt;</code> (مش <code>&lt;=</code>، فده بيغير حالة 18 بالظبط) وعكس <code>hasId</code> هو <code>!hasId</code>.",
    },
    {
      q: "من بين الأربع تركيبات الممكنة للـ <code>a</code> و <code>b</code> (bool)، كام تركيبة بيطلع فيها <code>a != b</code> قيمة true؟",
      answer: ["2", "اتنين"],
      why: "<code>a != b</code> هي XOR: true لما القيمتين مختلفتين، يعني (true,false) و(false,true). الاتنين تركيبتين.",
    },
    {
      q: "أنهي شرط بيطلع true لما <code>x</code> خارج المدى من 0 لـ 9 (شامل)؟",
      options: [
        "<code>x &lt; 0 &amp;&amp; x &gt; 9</code>",
        "<code>x &lt;= 0 || x &gt;= 9</code>",
        "<code>x &lt; 0 || x &gt; 9</code>",
        "<code>!(x &lt; 0 || x &gt; 9)</code>",
      ],
      answer: 2,
      why: "خارج المدى يعني أقل من 0 أو أكبر من 9. الأول مستحيل (مفيش رقم بيحقق الاتنين). التاني بيعتبر 0 و9 خارج المدى غلط. الرابع هو «داخل المدى».",
    },
  ],
};
