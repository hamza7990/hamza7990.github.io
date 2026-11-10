window.LEVELS = window.LEVELS || {};
window.LEVELS["algo/a1"] = {
  slides: [
    {
      kicker: "ليه نحلل بدقة",
      title: "عدّ العمليات بدل التخمين",
      en: "Counting operations precisely",
      body: "<p>في w10 اتعلمت الأشكال العامة. هنا هنتعلم تعدّ فعلا: تاخد الكود، تقرر إيه هي «العملية الأساسية»، وتحسب كام مرة بتتنفذ كدالة في <code>n</code>. بعد كده بس تشيل الثوابت والحدود الصغيرة. المقابل في الإنترفيو مش عايز تقول «n تربيع» وخلاص، عايز تقول <i>ليه</i>.</p><p>الخطوات: (1) حدد العملية اللي بتتعد (مقارنة، زيادة عداد). (2) اكتب كام مرة بتتنفذ في كل لفة من اللوب الخارجي. (3) اجمع على كل اللفات. (4) شيل الثوابت والحد الأصغر.</p>",
      code: {
        lang: "dart",
        title: "عدّاد بسيط جوه لوب متداخل",
        src: `int pairs(int n) {
  var count = 0;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < i; j++) {
      count++;
    }
  }
  return count;
}

void main() {
  print(pairs(1));     // 0
  print(pairs(5));     // 10
  print(pairs(100));   // 4950
}`,
        note: "اللوب الداخلي بيلف <code>i</code> مرة، و<code>i</code> بتاخد 0 و1 و2 ... n-1. هنفصّل المجموع في شريحة اللوبات المتداخلة.",
      },
      focus: [{ label: "احفظها", text: "التحليل = عدّ العملية الأساسية كدالة في n، وبعدين شيل الثوابت والحدود الأصغر. مش تخمين من شكل الكود." }],
    },
    {
      kicker: "لوجاريتم",
      title: "لوب بيقسم أو بيضاعف = log n",
      en: "Halving and doubling loops",
      body: "<p>لو المتغير بيتقسم على 2 في كل لفة (أو بيتضرب في 2)، عدد اللفات هو عدد المرات اللي تقدر تقسم فيها <code>n</code> لحد ما توصل لـ 1، وده <code>log₂ n</code>. الضرب والقسمة بأي ثابت (2 أو 3 أو 10) كلها log، وأساس اللوغاريتم مجرد ثابت بيتشال.</p>",
      code: {
        lang: "dart",
        src: `int halve(int n) {
  var steps = 0;
  while (n > 1) {
    n ~/= 2;
    steps++;
  }
  return steps;
}

int doubling(int n) {
  var steps = 0;
  for (var i = 1; i < n; i *= 2) {
    steps++;
  }
  return steps;
}

void main() {
  print(halve(16));          // 4
  print(halve(1000));        // 9
  print(halve(1000000));     // 19
  print(doubling(16));       // 4
  print(doubling(1000));     // 10
}`,
        note: "تتبع <code>doubling(16)</code>: i = 1, 2, 4, 8 يعني 4 لفات، وبعدها i = 16 فالشرط يفشل. لما n زاد من ألف لمليون (1000 ضعف) اللفات زادت من 9 لـ 19 بس.",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع halve(1000)",
          src: `n:     1000 500 250 125 62 31 15 7 3 1
step:     1   2   3   4  5  6  7 8 9
(integer division drops the remainder; stop when n == 1)`,
        },
      ],
      pitfall: "لوب <code>for (i = 1; i * i &lt;= n; i++)</code> مش log، ده <b>O(√n)</b> لأن i بتزيد بواحد وبتقف عند الجذر. اللي بيحدد النوع هو إزاي المتغير بيتحرك، مش شكل الشرط.",
      interview: [
        { q: "ليه لوب بيضاعف المتغير في كل لفة تعقيده O(log n)؟", a: "لأن بعد k لفة قيمة المتغير بقت 2^k، واللوب بيقف لما 2^k توصل لـ n، يعني k = log₂ n. مثلا لـ n = 1000 اللفات 10. نفس الكلام لو بيقسم على 2، وأساس اللوغاريتم ثابت فبيتشال من الـ Big-O.",
        },
      ],
    },
    {
      kicker: "لوبات متداخلة",
      title: "لوب داخلي حدّه معتمد على الخارجي",
      en: "Dependent nested loops",
      body: "<p>لما حد اللوب الداخلي بيتغير مع الخارجي لازم تجمع. في <code>pairs</code> فوق: اللفة رقم i بتعد i مرة، فالمجموع <code>0 + 1 + 2 + ... + (n-1) = n(n-1)/2</code>. ده حوالي <code>n²/2</code> فالتعقيد O(n²) برضه. لكن الثابت 1/2 حقيقي: مقارنة كل زوج مرة واحدة أسرع بالنص من مقارنة الكل بالكل.</p>",
      codes: [
        {
          lang: "text",
          title: "pairs(5) لفة لفة",
          src: `i=0  inner runs 0 times  total 0
i=1  inner runs 1 time   total 1
i=2  inner runs 2 times  total 3
i=3  inner runs 3 times  total 6
i=4  inner runs 4 times  total 10   = 5*4/2`,
        },
        {
          lang: "text",
          title: "أرقام تحتاج تعرفها",
          src: `n          n(n-1)/2
10         45
100        4,950
1,000      499,500
100,000    about 5 billion  (too slow)`,
        },
      ],
      points: [
        "مجموع 1 لـ n هو <code>n(n+1)/2</code>، ومجموع 0 لـ n-1 هو <code>n(n-1)/2</code>.",
        "لوب خارجي n مرة وداخلي ثابت (مثلا 3) = <code>3n</code> = O(n)، مش O(n²).",
        "لوب خارجي n مرة وداخلي بيضاعف = O(n log n).",
      ],
      interview: [
        { q: "لوب خارجي i من 0 لـ n، وداخلي j من 0 لـ i. كام مرة الجسم بينفذ، وإيه الـ Big-O؟", a: "اللفة i بتنفذ الجسم i مرة، فالمجموع 0 + 1 + ... + (n-1) = n(n-1)/2. ده n²/2 - n/2، وبنشيل الثابت والحد الأصغر فالتعقيد O(n²). لو n = 100 الجسم بينفذ 4950 مرة.",
        },
      ],
    },
    {
      kicker: "الـ recursion",
      title: "حل المعادلات بتتبع شجرة النداءات",
      en: "Recurrences by drawing the tree",
      body: "<p>مش لازم تحفظ نظريات. ارسم شجرة النداءات واسأل سؤالين: كام مستوى؟ وكام شغل في كل مستوى؟ التعقيد = مجموع الشغل على كل المستويات.</p><p><b>T(n) = T(n-1) + 1</b>: نداء واحد في كل مرة وشغل ثابت. الشجرة سلسلة طولها n، يبقى O(n). <b>T(n) = 2T(n-1) + 1</b>: كل نداء بيطلّع نداءين على مدخل أصغر بواحد فقط. المستوى k فيه 2^k نداء والعمق n، فالمجموع 2^(n+1) - 1: O(2ⁿ).</p>",
      code: {
        lang: "dart",
        src: `int calls = 0;

int linear(int n) {
  calls++;
  if (n == 0) return 0;
  return linear(n - 1) + 1;
}

int twoWay(int n) {
  calls++;
  if (n == 0) return 0;
  return twoWay(n - 1) + twoWay(n - 1);
}

void main() {
  calls = 0; linear(10); print(calls);    // 11
  calls = 0; twoWay(3); print(calls);     // 15
  calls = 0; twoWay(10); print(calls);    // 2047
}`,
        note: "<code>linear(10)</code> عمل 11 نداء (n+1). <code>twoWay(3)</code> عمل 15 = 2⁴ - 1. و<code>twoWay(10)</code> عمل 2047 = 2¹¹ - 1.",
      },
      codes: [
        {
          lang: "text",
          title: "شجرة twoWay(3): عدد النداءات في كل مستوى",
          src: `level 0:   1 call    (n=3)
level 1:   2 calls   (n=2)
level 2:   4 calls   (n=1)
level 3:   8 calls   (n=0)
total = 1 + 2 + 4 + 8 = 15 = 2^4 - 1`,
        },
      ],
      focus: [{ label: "احفظها", text: "T(n)=T(n-1)+1 هو O(n). T(n)=2T(n-1)+1 هو O(2ⁿ). الفرق إن نداءين على مدخل بيصغر بواحد بس بيدّوا أُس." }],
    },
    {
      kicker: "قسّم وحل",
      title: "T(n) = 2T(n/2) + n هو n log n",
      en: "Divide and conquer recurrence",
      body: "<p>ده شكل merge sort: بتقسم المدخل نصين، بتحل كل نصف، وبتدمج في شغل خطي. ارسم الشجرة: المستوى 0 فيه نداء واحد حجمه n وشغله n. المستوى 1 فيه نداءين حجم كل واحد n/2 فالشغل الكلي n. المستوى 2: أربعة نداءات حجم n/4 والشغل n. كل مستوى شغله n، وعدد المستويات <code>log₂ n</code> لأن الحجم بيتقسم لحد ما يوصل 1. الناتج <code>n log n</code>.</p>",
      codes: [
        {
          lang: "text",
          title: "شجرة n = 8، الشغل في كل مستوى",
          src: `level 0:  1 node  of size 8     work 8
level 1:  2 nodes of size 4     work 8
level 2:  4 nodes of size 2     work 8
level 3:  8 nodes of size 1     work 8
levels = log2(8) + 1 = 4  -> total about 8 * 3 = n log n`,
        },
        {
          lang: "dart",
          title: "التحقق: عدد النداءات لو الشغل ثابت في كل نداء",
          src: `int calls = 0;

int halfWork(int n) {
  calls++;
  if (n <= 1) return 1;
  return halfWork(n ~/ 2) + halfWork(n ~/ 2);
}

void main() {
  calls = 0; halfWork(8); print(calls);    // 15
  calls = 0; halfWork(16); print(calls);   // 31
}`,
          note: "لو الشغل في كل نداء ثابت (T(n)=2T(n/2)+1) العدد حوالي 2n، يعني O(n). الشغل الخطي في الدمج هو اللي بيخلي merge sort بـ n log n.",
        },
      ],
      pitfall: "T(n) = 2T(n/2) + 1 هو O(n) مش O(n log n). الشغل جوه النداء هو اللي بيحدد: ثابت يبقى O(n)، خطي يبقى O(n log n).",
      interview: [
        { q: "ليه merge sort تعقيده O(n log n)؟", a: "لأنه بيقسم المصفوفة نصين في كل مرة فعدد المستويات log₂ n. في كل مستوى الدمج بيلمس كل العناصر مرة واحدة فالشغل n. شغل n × log n مستوى = O(n log n)، وده في كل الحالات (أحسن وأسوأ).",
        },
      ],
    },
    {
      kicker: "الأداء الموزع",
      title: "Amortized: التكلفة موزعة على العمليات",
      en: "Amortized analysis",
      body: "<p>الـ <code>List.add</code> في Dart معظم الوقت O(1). أحيانا الـ buffer الداخلي بيمتلي فبيتعمل buffer أكبر وبتتنسخ العناصر كلها: O(n) مرة واحدة. لو السعة بتتضاعف في كل مرة، النسخ الكبير بيحصل بعد عدد كبير من الإضافات الرخيصة. مجموع النسخ لـ n إضافة <code>1 + 2 + 4 + ... &lt; 2n</code>، فمتوسط الإضافة الواحدة ثابت: <b>O(1) amortized</b>.</p><p>amortized مش متوسط احتمالي: هو ضمان على أسوأ تسلسل عمليات، إن مجموع التكلفة مقسوم على عددها ثابت.</p>",
      code: {
        lang: "dart",
        title: "محاكاة تضاعف السعة",
        src: `class Grow {
  int capacity = 1;
  int size = 0;
  int copies = 0;

  void add() {
    if (size == capacity) {
      copies += size;     // copy everything to a bigger buffer
      capacity *= 2;
    }
    size++;
  }
}

void main() {
  final g = Grow();
  for (var i = 0; i < 1000; i++) {
    g.add();
  }
  print(g.size);       // 1000
  print(g.capacity);   // 1024
  print(g.copies);     // 1023
}`,
        note: "1000 إضافة كلفت 1023 نسخة فقط، يعني تقريبا نسخة واحدة لكل إضافة. لو زودنا السعة بـ 10 كل مرة (جمع مش ضرب) كان المجموع O(n²).",
      },
      pitfall: "O(1) amortized مش معناها إن كل إضافة O(1). إضافة واحدة ممكن تبقى O(n). ده بيهم لو بتبني نظام real-time وكل عملية لازم تخلص في وقت محدود.",
      interview: [
        { q: "ليه إضافة عنصر لـ list في Dart بتعتبر O(1) amortized؟", a: "لأن الـ list لما بتمتلي بتكبّر الـ buffer بضرب السعة في عامل ثابت وبتنسخ العناصر مرة. النسخات بتبقى 1 و2 و4 و8 ... ومجموعها أقل من 2n لـ n إضافة. يعني التكلفة الكلية O(n) موزعة على n عملية، فكل عملية O(1) في المتوسط حتى لو واحدة منهم كلفتها O(n).",
        },
      ],
    },
    {
      kicker: "المساحة",
      title: "التعقيد المكاني يشمل الـ call stack",
      en: "Space complexity",
      body: "<p>المساحة الإضافية اللي بتستخدمها (من غير المدخل نفسه). بتعدّ: القوايم والـ Maps اللي بتبنيها، <b>و</b> عمق الـ call stack لأن كل نداء بيحجز frame. دالة recursive بعمق n مساحتها O(n) حتى لو مبتعملش أي list.</p>",
      code: {
        lang: "dart",
        src: `int sumRec(List<int> a, int i) {
  if (i == a.length) return 0;
  return a[i] + sumRec(a, i + 1);   // depth n, space O(n)
}

int sumLoop(List<int> a) {
  var s = 0;
  for (final x in a) {
    s += x;                          // space O(1)
  }
  return s;
}

void main() {
  print(sumRec([1, 2, 3], 0));   // 6
  print(sumLoop([1, 2, 3]));     // 6
  print(sumLoop([]));            // 0
}`,
        note: "الاتنين O(n) زمن، والمساحة هي الفرق. في تجربة على الجهاز هنا، <code>sumRec</code> على مليون عنصر رمت <code>StackOverflowError</code>.",
      },
      points: [
        "binary search بالـ recursion: مساحة O(log n). باللوب: O(1).",
        "merge sort: O(n) للمصفوفة المؤقتة + O(log n) stack.",
        "quick sort: O(log n) stack في المتوسط، وO(n) في أسوأ حالة.",
      ],
      interview: [
        { q: "هل الـ recursion بتستهلك مساحة حتى لو مفيش قوايم؟", a: "أيوه. كل نداء بيحجز frame على الـ call stack فيه المتغيرات المحلية وعنوان الرجوع، والـ frames بتتراكم لحد ما نوصل للـ base case. فمساحة الـ recursion = أقصى عمق. دالة جمع recursive لـ n عنصر مساحتها O(n) والنسخة اللي بلوب O(1). وDart مبتعملش tail-call optimization.",
        },
      ],
    },
    {
      kicker: "أحسن ومتوسط وأسوأ",
      title: "نفس الخوارزمية، أكتر من تعقيد",
      en: "Best, average and worst case",
      body: "<p>تعقيد الخوارزمية ممكن يتغير حسب شكل المدخل. <b>الأسوأ</b> ضمان إنه مفيش أبطأ منه. <b>المتوسط</b> على مدخلات عشوائية. في الإنترفيو قول الاتنين. مثلين حقيقيين:</p><p><b>Quick sort</b> بيختار pivot ويقسم. لو الـ pivot دايما أصغر عنصر (مصفوفة مرتبة وبناخد أول عنصر) كل تقسيمة بتشيل عنصر واحد بس: (n-1) + (n-2) + ... = n(n-1)/2 مقارنة. لو الـ pivot في النص بيبقى n log n.</p><p><b>Hash map</b>: البحث O(1) في المتوسط لو الـ hash موزع كويس. لو كل المفاتيح اتصادمت في نفس الخانة بيبقى O(n) في الأسوأ.</p>",
      code: {
        lang: "dart",
        title: "عدّ مقارنات quick sort بـ pivot = أول عنصر",
        src: `int cmp = 0;

void quick(List<int> a, int lo, int hi) {
  if (lo >= hi) return;
  final p = a[lo];
  var i = lo;
  for (var j = lo + 1; j <= hi; j++) {
    cmp++;
    if (a[j] < p) {
      i++;
      final t = a[i]; a[i] = a[j]; a[j] = t;
    }
  }
  final t = a[lo]; a[lo] = a[i]; a[i] = t;
  quick(a, lo, i - 1);
  quick(a, i + 1, hi);
}

void main() {
  final sorted = List.generate(10, (i) => i);
  cmp = 0; quick(sorted, 0, 9); print(cmp);   // 45
  final mixed = [5, 2, 8, 1, 9, 3, 7, 4, 6, 0];
  cmp = 0; quick(mixed, 0, 9); print(cmp);    // 21
}`,
        note: "المدخل المرتب أخد 45 = 10 × 9 / 2 مقارنة (الأسوأ)، والمدخل المختلط أخد 21 بس.",
      },
      interview: [
        { q: "إيه أسوأ حالة لـ quick sort وإزاي تتجنبها؟", a: "لما الـ pivot بيطلع دايما أصغر أو أكبر عنصر، زي مصفوفة مرتبة وpivot = أول عنصر. كل تقسيمة بتصغّر المسألة بواحد بس فالتعقيد O(n²) ومساحة الـ stack O(n). بتجنبها باختيار pivot عشوائي أو median-of-three، فاحتمال الأسوأ يبقى ضعيف جدا.",
        },
        { q: "قول لي عن Hash map: متوسط وأسوأ.", a: "الإدخال والبحث O(1) في المتوسط لو دالة الـ hash بتوزع المفاتيح كويس. في الأسوأ كل المفاتيح بتتصادم في نفس الـ bucket فالبحث بيبقى O(n). عمليا بنعتبرها O(1).",
        },
      ],
    },
    {
      kicker: "في الواقع",
      title: "10^5 و 10^6 تسمح بإيه، وادعاءات غلط",
      en: "Input sizes and common wrong claims",
      body: "<p>الحاسوب بيعمل تقريبا <code>10^8</code> عملية بسيطة في الثانية (تقدير خشن). من حجم المدخل تعرف أقصى تعقيد مقبول قبل ما تكتب أي كود:</p>",
      codes: [
        {
          lang: "text",
          title: "حجم المدخل مقابل التعقيد المسموح (حوالي ثانية)",
          src: `n <= 20          O(2^n), O(n!)   brute force, backtracking
n <= 500         O(n^3)
n <= 5,000       O(n^2)
n <= 100,000     O(n log n) or O(n)
n <= 1,000,000   O(n) or O(n log n) with a small constant
n up to 10^9     O(log n) or O(1)`,
        },
        {
          lang: "dart",
          src: `int two(int n) {
  var c = 0;
  for (var i = 0; i < n; i++) { c++; }
  for (var j = 0; j < n; j++) { c++; }
  return c;                          // 2n: O(n)
}

int nLogN(int n) {
  var c = 0;
  for (var i = 0; i < n; i++) {
    for (var j = 1; j < n; j *= 2) { c++; }
  }
  return c;                          // n * log n
}

void main() {
  print(two(10));        // 20
  print(nLogN(16));      // 64
  print(nLogN(1000));    // 10000
}`,
          note: "لوبين متتاليين = 2n. اللوب الداخلي بيضاعف فهو log n، والمجموع n log n: 16 × 4 = 64.",
        },
      ],
      points: [
        "<b>«لوبين يعني n تربيع»</b> غلط. لوبين ورا بعض = O(n). لوبين متداخلين وكل واحد بيلف على n = O(n²). ولوب داخلي ثابت = O(n).",
        "<b>«O(n log n) أسرع من O(n)»</b> غلط، العكس: n log n أبطأ. والثوابت بتفرق لما n صغير.",
        "<b>«شيل الثوابت يعني تتجاهلها»</b>: O(100n) و O(n) نفس الفئة لكن فرق 100 ضعف فعلا في الوقت.",
      ],
      interview: [
        { q: "المدخل 10^5 عنصر. مين من O(n²) وO(n log n) مناسب؟", a: "O(n²) هيعمل 10^10 عملية، وده عشرات الثواني. O(n log n) هيعمل حوالي 10^5 × 17 = 1.7 مليون عملية، سريع جدا. فقيد حجم المدخل بيوجهني لاختيار الخوارزمية قبل ما أكتب كود.",
        },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: لوب القسمة",
      lang: "dart",
      code: `int halve(int n) {
  var steps = 0;
  while (n > 1) {
    n ~/= 2;
    steps++;
  }
  return steps;
}

void main() {
  print(halve(1000));
}`,
      note: "الناتج 9.",
    },
    {
      title: "اكتب: عدّ الأزواج",
      lang: "dart",
      code: `int pairs(int n) {
  var count = 0;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < i; j++) {
      count++;
    }
  }
  return count;
}

void main() {
  print(pairs(5));
}`,
      note: "الناتج 10 = 5 × 4 / 2.",
    },
    {
      title: "اكتب: محاكاة تضاعف السعة",
      lang: "dart",
      code: `class Grow {
  int capacity = 1;
  int size = 0;
  int copies = 0;

  void add() {
    if (size == capacity) {
      copies += size;
      capacity *= 2;
    }
    size++;
  }
}`,
      note: "كلاس بتحسب بيه كام نسخة اتعملت.",
    },
  ],

  tasks: [
    {
      title: "عدد خطوات القسمة",
      lang: "dart",
      prompt: "<p>اكتب <code>int stepsToOne(int n)</code> ترجع كام مرة تقدر تقسم n على 2 (قسمة صحيحة) لحد ما توصل لـ 1. بعدين قول التعقيد.</p>",
      examples: [
        { in: "stepsToOne(1)", out: "0" },
        { in: "stepsToOne(16)", out: "4" },
        { in: "stepsToOne(1000)", out: "9" },
      ],
      starter: `int stepsToOne(int n) {
  // your code
}`,
      hints: [
        "لوب <code>while (n &gt; 1)</code>.",
        "في كل لفة <code>n ~/= 2</code> وزوّد عداد.",
      ],
      solution: `int stepsToOne(int n) {
  var steps = 0;
  while (n > 1) {
    n ~/= 2;
    steps++;
  }
  return steps;
}`,
      explain: "التعقيد O(log n) لأن n بتتقسم على 2 في كل لفة، ومساحة O(1). لـ n = 1 اللوب مبيشتغلش فبيرجع 0.",
    },
    {
      title: "عدد نداءات twoWay",
      lang: "dart",
      prompt: "<p>الدالة <code>twoWay(n)</code> بتنادي نفسها مرتين على <code>n - 1</code> وبترجع لما n = 0. اكتب <code>int countCalls(int n)</code> ترجع إجمالي عدد النداءات (بما فيها الأول) <b>من غير ما تستخدم الأُس</b>، بمعادلة recursive، وقول تعقيد دالتك.</p>",
      examples: [
        { in: "countCalls(0)", out: "1" },
        { in: "countCalls(3)", out: "15" },
        { in: "countCalls(10)", out: "2047" },
      ],
      starter: `int countCalls(int n) {
  // your code
}`,
      hints: [
        "الـ base case: n == 0 فيه نداء واحد.",
        "النداء الحالي (1) + نداءين كل واحد حجمه n - 1.",
      ],
      solution: `int countCalls(int n) {
  if (n == 0) return 1;
  return 1 + 2 * countCalls(n - 1);
}`,
      explain: "المعادلة C(n) = 1 + 2C(n-1) بتدّي 2^(n+1) - 1. دالتك بتنادي نفسها مرة واحدة فتعقيدها O(n)، بينما twoWay الأصلية O(2ⁿ).",
    },
    {
      title: "نسخ الـ dynamic array",
      lang: "dart",
      prompt: "<p>list بتبدأ بسعة 1، وكل ما تمتلي بتضاعف السعة وتنسخ كل عناصرها. اكتب <code>int totalCopies(int n)</code> ترجع إجمالي عدد العناصر المنسوخة بعد <code>n</code> إضافة. وبعدين اشرح ليه الإضافة O(1) amortized.</p>",
      examples: [
        { in: "totalCopies(0)", out: "0" },
        { in: "totalCopies(8)", out: "7" },
        { in: "totalCopies(1000)", out: "1023" },
      ],
      starter: `int totalCopies(int n) {
  // your code
}`,
      hints: [
        "احتفظ بـ <code>size</code> و<code>capacity</code> و<code>copies</code>.",
        "قبل كل إضافة: لو <code>size == capacity</code> زوّد copies بـ size وضاعف capacity.",
      ],
      solution: `int totalCopies(int n) {
  var capacity = 1;
  var size = 0;
  var copies = 0;
  for (var i = 0; i < n; i++) {
    if (size == capacity) {
      copies += size;
      capacity *= 2;
    }
    size++;
  }
  return copies;
}`,
      explain: "النسخات بتحصل عند 1 و2 و4 و8 ... فالمجموع أقل من 2n. n إضافة كلفتها O(n) كلية، فكل إضافة O(1) amortized.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `int pairs(int n) {
  var count = 0;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < i; j++) {
      count++;
    }
  }
  return count;
}

void main() {
  print(pairs(5));
}` },
      answer: ["10"],
      why: "اللفات الداخلية: 0 + 1 + 2 + 3 + 4 = 10، وهو 5 × 4 / 2. التعقيد O(n²) لكن بثابت 1/2.",
    },
    {
      q: "الدالة دي تعقيدها إيه؟",
      code: { lang: "dart", src: `int work(List<int> a) {
  var s = 0;
  for (final x in a) { s += x; }
  for (final x in a) { s += x * 2; }
  return s;
}` },
      options: [
        "O(n²) لأن فيها لوبين",
        "O(log n) لأن اللوب التاني بيعيد الشغل",
        "O(n): لوبين ورا بعض يعني 2n والثابت بيتشال",
        "O(2ⁿ) لأن العمل متكرر",
      ],
      answer: 2,
      why: "لوبين متتاليين بيتجمعوا: n + n = 2n = O(n). التربيع بيحصل بس لما لوب يبقى جوه التاني.",
    },
    {
      q: "الناتج إيه؟ (عدد لفات اللوب)",
      code: { lang: "dart", src: `int halve(int n) {
  var steps = 0;
  while (n > 1) {
    n ~/= 2;
    steps++;
  }
  return steps;
}

void main() {
  print(halve(1000));
}` },
      answer: ["9"],
      why: "1000 ثم 500 ثم 250 ثم 125 ثم 62 ثم 31 ثم 15 ثم 7 ثم 3 ثم 1: تسع قسمات. وده log₂(1000) تقريبا 9.97 بعد ما نشيل الجزء الكسري.",
    },
    {
      q: "المعادلة T(n) = 2T(n-1) + 1 (نداءين على n-1 وشغل ثابت) تعقيدها إيه؟",
      options: [
        "O(2ⁿ): كل مستوى بيضاعف عدد النداءات والعمق n",
        "O(n): في النهاية بنعدّ n نداء",
        "O(n log n) زي merge sort",
        "O(n²) لأن فيه نداءين",
      ],
      answer: 0,
      why: "الشجرة فيها 1 + 2 + 4 + ... + 2ⁿ نداء = 2ⁿ⁺¹ - 1. merge sort مختلفة لأن المدخل بيتقسم على 2 مش بيصغر بواحد.",
    },
    {
      q: "كام نداء بيحصل (بما فيها الأول)؟",
      code: { lang: "dart", src: `int calls = 0;

int twoWay(int n) {
  calls++;
  if (n == 0) return 0;
  return twoWay(n - 1) + twoWay(n - 1);
}

void main() {
  twoWay(3);
  print(calls);
}` },
      answer: ["15"],
      why: "المستويات: 1 + 2 + 4 + 8 = 15 = 2⁴ - 1.",
    },
    {
      q: "ليه إضافة عنصر في dynamic array تعتبر O(1) amortized؟",
      options: [
        "لأن الإضافة بتتم دايما في وقت ثابت من غير استثناء",
        "لأن النسخ بيحصل في thread تاني",
        "لأن متوسط الاحتمالات على مدخل عشوائي ثابت",
        "لأن النسخ الكبيرة نادرة: مجموعها لـ n إضافة أقل من 2n، فمتوسط الإضافة ثابت",
      ],
      answer: 3,
      why: "amortized ضمان على أسوأ تسلسل عمليات: مجموع التكلفة مقسوم على العدد. إضافة معينة ممكن تكلف O(n) فالخيار الأول غلط، وده مش متوسط احتمالي.",
    },
    {
      q: "المساحة الإضافية لدالة recursive بتجمع قايمة طولها n (من غير أي قايمة جديدة)؟",
      options: [
        "O(1) لأنها مبتعملش list جديدة",
        "O(n) لأن عمق الـ call stack n",
        "O(log n) لأن الـ recursion بتقسم",
        "O(n²) لأن كل نداء بينسخ القايمة",
      ],
      answer: 1,
      why: "كل نداء بيحجز frame على الـ stack والعمق n. التمرير بالـ index مش بينسخ القايمة. اللوب العادي هو اللي مساحته O(1).",
    },
    {
      q: "المدخل مليون عنصر وعندك ثانية تقريبا. أنهي تعقيد مقبول؟",
      options: [
        "O(n²)",
        "O(2ⁿ)",
        "O(n log n)",
        "O(n³)",
      ],
      answer: 2,
      why: "n log n لمليون = حوالي 20 مليون عملية، سهل. n² = 10¹² عملية، مستحيل في ثانية. الباقي أسوأ.",
    },
    {
      q: "تعقيد الدالة دي إيه؟",
      code: { lang: "dart", src: `int f(int n) {
  var c = 0;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < 3; j++) {
      c++;
    }
  }
  return c;
}` },
      options: [
        "O(n²)",
        "O(n)",
        "O(n log n)",
        "O(1)",
      ],
      answer: 1,
      why: "اللوب الداخلي ثابت (3 لفات) فالمجموع 3n = O(n). عدد اللوبات المتداخلة لوحده مش بيحدد التعقيد، لازم نعرف حد كل لوب.",
    },
    {
      q: "الناتج إيه؟ (قيمة c لما n = 16)",
      code: { lang: "dart", src: `int g(int n) {
  var c = 0;
  for (var i = 0; i < n; i++) {
    for (var j = 1; j < n; j *= 2) {
      c++;
    }
  }
  return c;
}

void main() {
  print(g(16));
}` },
      answer: ["64"],
      why: "اللوب الداخلي بيلف j = 1, 2, 4, 8 يعني 4 مرات (log₂ 16). الخارجي 16 مرة. 16 × 4 = 64. التعقيد O(n log n).",
    },
  ],
};
