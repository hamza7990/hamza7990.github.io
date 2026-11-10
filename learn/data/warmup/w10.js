window.LEVELS = window.LEVELS || {};
window.LEVELS["warmup/w10"] = {
  slides: [
    {
      kicker: "ليه نقيس",
      title: "Big-O بيقيس نمو الشغل مش الثواني",
      en: "Big-O notation",
      body: "<p>حلّين صح ممكن يفرقوا بين ثانية وساعة لما الداتا تكبر. Big-O مش بيقيس الوقت بالثواني (ده بيتغير حسب الجهاز)، هو بيقول: <b>لما حجم المدخل n يكبر، عدد الخطوات اللي الكود بيعملها بيكبر بأي معدل؟</b></p><p>بنهتم بالمعدل لأن n الصغيرة مفيش فيها مشكلة. الفرق بيظهر لما n تبقى عشرات الآلاف أو الملايين، زي قايمة منتجات أو جدول مستخدمين.</p>",
      points: [
        "n = حجم المدخل (عدد عناصر القايمة، طول النص).",
        "بنعد <b>العمليات الأساسية</b> (مقارنة، جمع، قراءة عنصر) كدالة في n.",
        "بنقول الشكل العام للنمو، مش الرقم بالظبط.",
      ],
      code: {
        lang: "text",
        title: "تقريبا كام خطوة لما n = 1,000",
        src: `O(1)         1
O(log n)     10
O(n)         1,000
O(n log n)   10,000
O(n^2)       1,000,000
O(2^n)       more than the atoms in the universe`,
        note: "الجدول ده هو سبب إن المُقابِل يسألك «ممكن تحسّنها؟». الفرق بين O(n) وO(n²) على مليون عنصر هو الفرق بين ثانية وأيام.",
      },
      focus: [{ label: "احفظها", text: "Big-O = معدل نمو الخطوات مع زيادة n. مش ثواني ومش عدد أسطر." }],
    },
    {
      title: "O(1) و O(log n)",
      en: "Constant and logarithmic",
      body: "<p><b>O(1)</b> ثابت: عدد الخطوات مبيتغيرش مهما كبر n. زي القراءة بـ index، أو البحث في <code>Map</code> (متوسط). <b>O(log n)</b> لوغاريتمي: كل خطوة بتقسم المسألة على اتنين (أو بتضاعف حاجة)، فحتى مليون عنصر محتاج حوالي 20 خطوة بس.</p>",
      code: {
        lang: "dart",
        src: `int first(List<int> a) => a[0];                     // O(1)

bool hasKey(Map<String, int> m, String k) {
  return m.containsKey(k);                          // O(1) average
}

int halvingSteps(int n) {                           // O(log n)
  var steps = 0;
  while (n > 1) {
    n ~/= 2;
    steps++;
  }
  return steps;
}

void main() {
  print(first([7, 8, 9]));          // 7
  print(halvingSteps(1000));        // 9
  print(halvingSteps(1000000));     // 19
}`,
        note: "زودنا n ألف مرة (من ألف لمليون) والخطوات زادت من 9 لـ 19 بس. ده هو سحر log. البحث الثنائي (w9) هو نفس الفكرة.",
      },
      interview: [
        { q: "إيه المثال اللي بتعتبره O(log n)؟ وليه سريع؟", a: "البحث الثنائي في قايمة مرتبة: كل مقارنة بترمي نص العناصر، فمليون عنصر محتاج حوالي 20 مقارنة. أي لوب بيقسم أو بيضاعف المتغير (<code>n ~/= 2</code> أو <code>i *= 2</code>) هو O(log n). السرعة جاية من إن المسألة بتصغر للنص في كل خطوة بدل ما تنقص بواحد.",
        },
      ],
    },
    {
      title: "O(n) و O(n log n)",
      en: "Linear and linearithmic",
      body: "<p><b>O(n)</b> خطي: لوب واحد على كل العناصر مرة (مجموع، أكبر قيمة، عدّ). كمان البحث العادي في قايمة (<code>contains</code>, <code>indexOf</code>) خطي. <b>O(n log n)</b>: ترتيب قايمة بخوارزمية كويسة (<code>list.sort()</code>، merge sort): بتقسم لنصين (log n مستوى) وبتشتغل على n عنصر في كل مستوى. ده أسرع تعقيد ممكن للترتيب بالمقارنة.</p>",
      code: {
        lang: "dart",
        src: `int sum(List<int> a) {                  // O(n): one pass
  var total = 0;
  for (final x in a) {
    total += x;
  }
  return total;
}

int medianish(List<int> a) {            // O(n log n): the sort dominates
  final copy = [...a]..sort();          // O(n) copy + O(n log n) sort
  return copy[copy.length ~/ 2];
}

void main() {
  print(sum([1, 2, 3, 4]));             // 10
  print(medianish([9, 1, 5, 3, 7]));    // 5
}`,
        note: "لما بتجمع أجزاء، الأكبر هو اللي بيحكم: O(n) + O(n log n) = O(n log n).",
      },
      interview: [
        { q: "إيه تعقيد الترتيب، وليه مش O(n)؟", a: "الترتيب بالمقارنة محتاج على الأقل O(n log n) مقارنة: فيه n! ترتيب ممكن، وكل مقارنة بتستبعد نص الاحتمالات تقريبا فمحتاجين log(n!) وده حوالي n log n. <code>List.sort()</code> في Dart بتعمل بالتعقيد ده. لو الداتا ليها شكل خاص (أرقام صغيرة المدى) ممكن counting sort تعمله O(n)، لكن ده حالة خاصة.",
        },
      ],
    },
    {
      title: "O(n²): لوب جوه لوب وعدّ العمليات",
      en: "Quadratic and counting operations",
      body: "<p>لوب جوه لوب كل واحد على n: الخطوات n × n = n². الطريقة الأصح هي إنك <b>تعد</b> عدد مرات تنفيذ السطر الداخلي. لو اللوب الداخلي بيبدأ من <code>i + 1</code> (كل زوج مرة واحدة) العدد <code>n(n-1)/2</code> وهو برضه O(n²) لأن القسمة على 2 ثابت.</p>",
      code: {
        lang: "dart",
        src: `int fullSquare(int n) {
  var ops = 0;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      ops++;
    }
  }
  return ops;
}

int allPairs(int n) {
  var ops = 0;
  for (var i = 0; i < n; i++) {
    for (var j = i + 1; j < n; j++) {
      ops++;
    }
  }
  return ops;
}

void main() {
  print(fullSquare(10));     // 100
  print(allPairs(10));       // 45 = 10 * 9 / 2
  print(allPairs(100));      // 4950
  print(fullSquare(1000));   // 1000000
}`,
        note: "لما n زادت 10 أضعاف (10 إلى 100) الخطوات زادت حوالي 100 ضعف (45 إلى 4950). ده شكل التربيع.",
      },
      pitfall: "مش كل لوبين متداخلين O(n²). لو اللوب الداخلي دايما 5 مرات (<code>for j &lt; 5</code>) فالإجمالي 5n = O(n). اعد الخطوات الفعلية مش عدد كلمات <code>for</code>.",
      interview: [
        { q: "إزاي تحسب تعقيد لوبين متداخلين؟", a: "بعد كام مرة السطر الجوه بيتنفذ. لو اللوب الخارجي n مرة والداخلي n مرة فالإجمالي n². لو الداخلي بيبدأ من <code>i + 1</code> فالإجمالي <code>n(n-1)/2</code> وده برضه O(n²) لأن الثوابت بتتشال. لو الداخلي عدد ثابت (زي 5) فالتعقيد O(n). ولو اللوبين على مدخلين مختلفين n وm فالتعقيد O(n × m).",
        },
      ],
    },
    {
      title: "O(2ⁿ): كل خطوة بتضاعف الشغل",
      en: "Exponential",
      body: "<p>الأسي (exponential) بيظهر لما كل نداء بيطلع نداءين على مسألة أصغر بواحد بس: العدد بيتضاعف مع كل زيادة في n. أشهر أمثلته fibonacci الساذج (w9) وتوليد كل المجموعات الجزئية لعناصر (كل عنصر: داخل أو لا). مقبول لـ n صغيرة (حتى 20 أو 25) وبعدها مستحيل.</p>",
      code: {
        lang: "dart",
        src: `// How many ways to choose a subset of n items: each item is in or out
int subsetCount(int n) {
  if (n == 0) return 1;
  return subsetCount(n - 1) + subsetCount(n - 1);
}

void main() {
  print(subsetCount(5));    // 32
  print(subsetCount(10));   // 1024
  print(subsetCount(20));   // 1048576
}`,
        note: "كل +1 في n بتضاعف عدد النداءات. عند n=30 هتبقى المليار، وعند n=60 مستحيل. العلاج عادة memoization لو فيه تكرار، أو خوارزمية مختلفة.",
      },
      interview: [
        { q: "إيه التعقيد الزمني لـ fibonacci الـ recursive العادي وليه؟", a: "حوالي O(2ⁿ) أسي: كل نداء بيطلع نداءين على n-1 وn-2، فشجرة النداءات بتتضاعف تقريبا مع كل مستوى. (التحليل الدقيق O(φⁿ) حيث φ ≈ 1.618، لكن بنقول أسي.) بأحسنه بالـ memoization لـ O(n) زمن وO(n) مساحة، أو بلوب لـ O(n) زمن وO(1) مساحة.",
        },
      ],
    },
    {
      title: "نشيل الثوابت والحدود الصغيرة",
      en: "Dropping constants",
      body: "<p>Big-O بيبص على الأكبر نمواً فقط عندما n تكبر جدا. فنطبق قاعدتين:</p>",
      points: [
        "<b>نشيل الثوابت</b>: <code>3n</code> و <code>n/2</code> و <code>100n</code> كلهم O(n). لوبين خطيين ورا بعض = <code>2n</code> = O(n).",
        "<b>نشيل الحدود الصغيرة</b>: <code>n² + n + 5</code> هو O(n²). <code>n + log n</code> هو O(n).",
        "<b>متتابعين نجمع، متداخلين نضرب</b>: لوب n ثم لوب m = O(n + m). لوب n جواه لوب m = O(n × m).",
        "<b>مدخلين مختلفين متخلطوش</b>: دمج قايمتين طولهم n وm هو O(n + m)، مش O(n) ولا O(n²).",
      ],
      code: {
        lang: "dart",
        src: `// O(n): three passes is still linear (3n)
void threePasses(List<int> a) {
  var min = a[0], max = a[0], sum = 0;
  for (final x in a) { if (x < min) min = x; }
  for (final x in a) { if (x > max) max = x; }
  for (final x in a) { sum += x; }
  print('$min $max $sum');
}

// O(n * m): nested over two different inputs
int commonCount(List<int> a, List<int> b) {
  var c = 0;
  for (final x in a) {
    for (final y in b) {
      if (x == y) c++;
    }
  }
  return c;
}

void main() {
  threePasses([4, 1, 9]);                 // 1 9 14
  print(commonCount([1, 2, 3], [2, 3]));  // 2
}`,
        note: "الدالة التانية بتتحسن لـ O(n + m) لو حطيت b في Set الأول.",
      },
      pitfall: "غلطة شائعة: تقول «التعقيد O(2n) أحسن من O(n²)» وتكتب 2n. اكتبها O(n). الثابت 2 بيهم في الواقع لكن مش في Big-O.",
      interview: [
        { q: "ليه بنشيل الثوابت في Big-O؟ ومش ممكن O(100n) تبقى أبطأ من O(n²)؟", a: "لأن Big-O بتتكلم عن سلوك النمو لما n تكبر، والثابت مبيغيرش شكل النمو. وأيوه ممكن لـ n صغيرة جدا الحل O(n²) يبقى أسرع من 100n، لكن لما n تكبر الـ n² هيكسب دايما. عشان كده في الواقع بقيس الأداء الفعلي لو الداتا صغيرة، وبستخدم Big-O للمقارنة النظرية والداتا الكبيرة.",
        },
      ],
    },
    {
      title: "الوقت والمساحة",
      en: "Time vs space",
      body: "<p>فيه تعقيدين: <b>زمني</b> (time) عدد الخطوات، و<b>مساحي</b> (space) كمية الذاكرة الإضافية اللي بتحتاجها بالنسبة لـ n. المساحة بتشمل: القوايم والـ Maps اللي بتبنيها، وكمان مساحة الـ call stack في الـ recursion. المدخل نفسه عادة مش بيتعد.</p>",
      code: {
        lang: "dart",
        src: `// Time O(n), extra space O(1)
int maxOf(List<int> a) {
  var m = a[0];
  for (final x in a) {
    if (x > m) m = x;
  }
  return m;
}

// Time O(n), extra space O(n): builds a new list
List<int> doubled(List<int> a) {
  final out = <int>[];
  for (final x in a) {
    out.add(x * 2);
  }
  return out;
}

// Time O(n), extra space O(n): n frames on the call stack
int sumTo(int n) => n == 0 ? 0 : n + sumTo(n - 1);

void main() {
  print(maxOf([3, 8, 2]));     // 8
  print(doubled([1, 2, 3]));   // [2, 4, 6]
  print(sumTo(100));           // 5050
}`,
        note: "الكتير من تحسينات السرعة بتيجي على حساب الذاكرة: Two Sum بالـ Map أسرع (O(n)) لكن بيدفع O(n) مساحة.",
      },
      interview: [
        { q: "إيه الفرق بين التعقيد الزمني والمساحي؟ وهل ممكن تحسن الاتنين مع بعض؟", a: "الزمني بيقيس عدد الخطوات، والمساحي بيقيس الذاكرة الإضافية، وكلهم بدالة في n. كتير من الوقت بيحصل تبادل: Map بتسرّع Two Sum من O(n²) لـ O(n) بس بتكلف O(n) ذاكرة. أحيانا ممكن تكسب الاتنين بخوارزمية أذكى، مثلا فيبوناتشي بلوب ومتغيرين هو O(n) زمن وO(1) مساحة. وبحسب مساحة الـ call stack في الـ recursion كمان.",
        },
      ],
    },
    {
      title: "أفضل وأسوأ ومتوسط",
      en: "Best, average and worst case",
      body: "<p>نفس الكود ممكن يكون سريع أو بطيء حسب المدخل. بنفرق بين: <b>best</b> (أحسن مدخل)، <b>worst</b> (أسوأ مدخل)، <b>average</b> (المتوسط). لما الناس تقول «التعقيد» من غير تحديد، يقصدوا غالبا <b>الأسوأ</b>، لأنه الضمان. الاستثناء هو لما نقول «Map lookup O(1) متوسط»، لأنه ممكن يبقى O(n) في أسوأ حالة.</p>",
      code: {
        lang: "dart",
        src: `int indexOfValue(List<int> a, int target) {
  for (var i = 0; i < a.length; i++) {
    if (a[i] == target) return i;
  }
  return -1;
}

void main() {
  final xs = [5, 8, 3, 9];
  print(indexOfValue(xs, 5));   // 0   best case: first element, 1 check
  print(indexOfValue(xs, 9));   // 3   last element, 4 checks
  print(indexOfValue(xs, 7));   // -1  worst case: not found, 4 checks
}`,
        note: "الأفضل O(1)، الأسوأ O(n)، المتوسط حوالي n/2 يعني O(n). فنقول البحث الخطي O(n).",
      },
      interview: [
        { q: "لما تقول الـ complexity بتاعة خوارزمية O(n)، تقصد أنهي case؟", a: "غالبا الأسوأ (worst case) لأنه الضمان على أي مدخل. البحث الخطي مثلا: الأفضل O(1) لو العنصر الأول، والأسوأ O(n)، فبقول O(n). ولو الخوارزمية بتفرق بين الحالات بشكل مهم بذكرها صراحة، زي Map lookup متوسط O(1) وأسوأ O(n)، أو quicksort متوسط O(n log n) وأسوأ O(n²).",
        },
      ],
    },
    {
      title: "تحليل حلول المستويات اللي فاتت",
      en: "Analysing earlier solutions",
      body: "<p>دلوقتي نقدر نحط أرقام على اللي كتبناه:</p>",
      points: [
        "<b>Two Sum غاشم</b>: O(n²) زمن، O(1) مساحة. <b>بالـ Map</b>: O(n) زمن، O(n) مساحة.",
        "<b>fibonacci ساذج</b>: O(2ⁿ) زمن. <b>مع memo</b>: O(n) زمن وO(n) مساحة. <b>بلوب</b>: O(n) و O(1).",
        "<b>حذف المكرر بـ Set</b>: O(n) زمن. <b>بمقارنة كل زوج</b>: O(n²).",
        "<b>binary search</b>: O(log n). <b>البحث الخطي</b>: O(n).",
        "<b>Group Anagrams</b>: O(n × k log k) لأن كل كلمة بنرتب حروفها (k طول الكلمة).",
        "<b>عكس نص بـ <code>+=</code> في لوب</b>: ممكن O(n²) لأن كل <code>+=</code> بينسخ النص (w6).",
      ],
      code: {
        lang: "dart",
        src: `void main() {
  // No pair sums to the target: the worst case for both solutions
  final nums = List.generate(1000, (i) => 2 * i);
  const target = 1;

  var brute = 0;
  for (var i = 0; i < nums.length; i++) {
    for (var j = i + 1; j < nums.length; j++) {
      brute++;
    }
  }

  var withSet = 0;
  final seen = <int>{};
  for (final n in nums) {
    withSet++;
    seen.contains(target - n);
    seen.add(n);
  }

  print(brute);     // 499500
  print(withSet);   // 1000
}`,
        note: "نفس المدخل: نصف مليون خطوة مقابل ألف. ولو n بقت مليون الفرق هيبقى نص تريليون مقابل مليون.",
      },
      interview: [
        { q: "قارن بين حلين لـ Two Sum من ناحية الزمن والمساحة.", a: "الغاشم لوب جوه لوب: O(n²) زمن وO(1) مساحة. بالـ Map: بمر مرة واحدة وأخزن اللي شفته فبقى O(n) زمن بس بكلفة O(n) مساحة. لو القايمة مرتبة أقدر أستخدم مؤشرين من الطرفين: O(n) زمن وO(1) مساحة. بختار حسب القيود: لو الذاكرة ضيقة أو الداتا مرتبة فالمؤشرين، غير كده الـ Map.",
        },
      ],
    },
    {
      title: "إزاي تتكلم عن التعقيد في الإنترفيو",
      en: "Talking about complexity",
      body: "<p>المُقابِل مش بيسأل عن الحفظ. بيشوف إنك بتفكر في الأداء. تمشي على الترتيب ده:</p>",
      points: [
        "<b>عرّف المتغيرات</b>: «n هو طول القايمة، k هو طول أطول كلمة». متقولش O(n) من غير ما تقول n إيه.",
        "<b>ابدأ بالغاشم</b> وقول تعقيده بصوت عالي، وبعدين قول إيه اللي بتقدر تحسنه.",
        "<b>قول الزمن والمساحة</b> الاتنين: «O(n) زمن، O(n) مساحة».",
        "<b>اسأل عن حجم المدخل</b>: n=100 يتحمل O(n²). n=100,000 محتاج O(n log n) أو أحسن. n=20 يتحمل O(2ⁿ).",
        "<b>نبه للحالات</b>: «في أسوأ حالة»، «في المتوسط»، «القايمة المرتبة».",
        "<b>لو مش متأكد</b> اعد الخطوات على مثال صغير بصوت عالي. دي أحسن من التخمين.",
      ],
      code: {
        lang: "text",
        title: "مثال لإجابة مرتبة",
        src: `"Let n be the length of the list.
First idea: check every pair. That is O(n^2) time, O(1) space.
We can do better: keep a Set of values seen so far, and for each
number ask if its partner is in the Set. One pass, so O(n) time,
and the Set costs O(n) extra space. If the list were already
sorted, two pointers would give O(n) time and O(1) space."`,
      },
      interview: [
        { q: "لو حلك O(n²) والمُقابِل قال «ممكن أحسن؟»، تعمل إيه؟", a: "أسأل نفسي فين الشغل المتكرر. غالبا لوب جوه لوب بيدور على حاجة. بفكر: ممكن أخزنها في Set أو Map عشان البحث يبقى O(1)؟ ممكن أرتب الأول وأستخدم مؤشرين؟ فيه جزء بيتحسب مرتين ويتخزن (memoization)؟ وبقول للمُقابِل التبادل بصراحة: الحل الأسرع غالبا بياخد مساحة أكتر.",
        },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: عدّ خطوات التربيع",
      lang: "dart",
      code: `int allPairs(int n) {
  var ops = 0;
  for (var i = 0; i < n; i++) {
    for (var j = i + 1; j < n; j++) {
      ops++;
    }
  }
  return ops;
}

void main() {
  print(allPairs(10));
}`,
      note: "الناتج 45.",
    },
    {
      title: "اكتب: خطوات التنصيف",
      lang: "dart",
      code: `int halvingSteps(int n) {
  var steps = 0;
  while (n > 1) {
    n ~/= 2;
    steps++;
  }
  return steps;
}

void main() {
  print(halvingSteps(1000));
  print(halvingSteps(1000000));
}`,
      note: "9 ثم 19: ألف ضعف في n، تقريبا الضعف في الخطوات.",
    },
    {
      title: "اكتب: مكرر بطيء ومكرر سريع",
      lang: "dart",
      code: `bool dupSlow(List<int> a) {
  for (var i = 0; i < a.length; i++) {
    for (var j = i + 1; j < a.length; j++) {
      if (a[i] == a[j]) return true;
    }
  }
  return false;
}

bool dupFast(List<int> a) {
  final seen = <int>{};
  for (final n in a) {
    if (!seen.add(n)) return true;
  }
  return false;
}`,
      note: "الأول O(n²) زمن O(1) مساحة. التاني O(n) زمن O(n) مساحة.",
    },
  ],

  tasks: [
    {
      title: "حسّن من O(n²) لـ O(n)",
      lang: "dart",
      prompt: "<p>الدالة دي بتفحص هل فيه رقمين في القايمة الفرق بينهم بالظبط <code>d</code> (<code>d &gt;= 0</code>)، بطريقة O(n²). اكتب <code>bool hasPairWithDiff(List&lt;int&gt; a, int d)</code> بتعمل نفس الشغل في O(n) زمن بـ <code>Set</code>. (لـ d=0 يعني فيه عنصر مكرر.)</p>",
      examples: [
        { in: "hasPairWithDiff([1, 7, 5, 9], 2)", out: "true" },
        { in: "hasPairWithDiff([1, 7, 5, 9], 3)", out: "false" },
        { in: "hasPairWithDiff([4, 4], 0)", out: "true" },
      ],
      starter: `// Slow version (O(n^2)):
bool slow(List<int> a, int d) {
  for (var i = 0; i < a.length; i++) {
    for (var j = i + 1; j < a.length; j++) {
      if ((a[i] - a[j]).abs() == d) return true;
    }
  }
  return false;
}

bool hasPairWithDiff(List<int> a, int d) {
  // your code
}`,
      hints: [
        "لكل n اسأل: هل شفت قبل كده <code>n + d</code> أو <code>n - d</code>؟",
        "افحص الأول وبعدين ضيف n للـ Set، عشان العنصر ميقارنش نفسه (إلا لو d=0 وده مقصود بوجود تكرار).",
      ],
      solution: `bool hasPairWithDiff(List<int> a, int d) {
  final seen = <int>{};
  for (final n in a) {
    if (seen.contains(n + d) || seen.contains(n - d)) return true;
    seen.add(n);
  }
  return false;
}`,
      explain: "الفرق <code>|x - y| = d</code> معناه y = x + d أو y = x - d. بنسأل عن الاتنين في الـ Set اللي فيه اللي فات. لو d=0 فالفحص بيلاقي العنصر نفسه لو كان اتضاف قبل كده يعني مكرر، والفحص قبل الإضافة بيمنع مقارنة العنصر بنفسه. O(n) زمن وO(n) مساحة.",
    },
    {
      title: "عدد مرات التنصيف",
      lang: "dart",
      prompt: "<p>اكتب <code>int halvingSteps(int n)</code> ترجع كام مرة تقدر تقسم n على 2 (قسمة صحيحة) قبل ما توصل لـ 1. (n &gt;= 1.) وفي تعليق فوق الدالة اكتب تعقيدها.</p>",
      examples: [
        { in: "halvingSteps(1)", out: "0" },
        { in: "halvingSteps(8)", out: "3" },
        { in: "halvingSteps(1000)", out: "9" },
      ],
      starter: `int halvingSteps(int n) {
  // your code
}`,
      hints: [
        "عدّاد steps يبدأ 0، وطول ما <code>n &gt; 1</code> قسم n على 2 بـ <code>~/=</code> وزود العدّاد.",
        "ده بالظبط عدد خطوات binary search في الأسوأ تقريبا: log₂ n.",
      ],
      solution: `// Time O(log n), space O(1): n is halved each time
int halvingSteps(int n) {
  var steps = 0;
  while (n > 1) {
    n ~/= 2;
    steps++;
  }
  return steps;
}`,
      explain: "لوب بيقسم المتغير على 2 كل لفة هو O(log n). مفيش مساحة إضافية فهي O(1). النتيجة هي ⌊log₂ n⌋.",
    },
    {
      title: "عدد المقارنات: محاكاة ومعادلة",
      lang: "dart",
      prompt: "<p>اكتب دالتين: <code>int pairChecks(int n)</code> بتحاكي لوب الأزواج (<code>j</code> من <code>i + 1</code>) وترجع عدد مرات تنفيذ السطر الداخلي، و<code>int pairChecksFormula(int n)</code> بتحسبه بالمعادلة. الاتنين لازم يدوا نفس الرقم.</p>",
      examples: [
        { in: "pairChecks(5)", out: "10" },
        { in: "pairChecksFormula(5)", out: "10" },
        { in: "pairChecksFormula(1000)", out: "499500" },
      ],
      starter: `int pairChecks(int n) {
  // your code
}

int pairChecksFormula(int n) {
  // your code
}`,
      hints: [
        "في المحاكاة: عدّاد يزيد جوه اللوب الداخلي.",
        "المعادلة: n × (n - 1) / 2. استخدم <code>~/</code> للقسمة الصحيحة.",
      ],
      solution: `int pairChecks(int n) {
  var ops = 0;
  for (var i = 0; i < n; i++) {
    for (var j = i + 1; j < n; j++) {
      ops++;
    }
  }
  return ops;
}

int pairChecksFormula(int n) => n * (n - 1) ~/ 2;`,
      explain: "الصف i بيعمل n-1-i مقارنة، والمجموع (n-1) + (n-2) + ... + 0 = n(n-1)/2. ده تقريبا n²/2 فالتعقيد O(n²). لما n=0 أو 1 المعادلة بترجع 0 وده صح.",
    },
  ],

  quiz: [
    {
      q: "إيه تعقيد الدالة دي؟",
      code: { lang: "dart", src: `int firstItem(List<int> a) {
  return a[0];
}` },
      answer: ["O(1)", "o(1)", "1", "constant"],
      why: "عدد الخطوات ثابت مهما كان طول القايمة: قراءة عنصر بـ index.",
    },
    {
      q: "إيه تعقيد اللوب ده بالنسبة لـ n؟",
      code: { lang: "dart", src: `var count = 0;
for (var i = 1; i < n; i *= 2) {
  count++;
}` },
      answer: ["O(log n)", "o(log n)", "O(logn)", "O(log(n))", "log n", "logn"],
      why: "i بيتضاعف كل لفة (1, 2, 4, 8...) فيوصل لـ n في حوالي log₂ n لفة.",
    },
    {
      q: "إيه تعقيد الكود ده؟",
      code: { lang: "dart", src: `for (final x in a) {
  print(x);
}
for (final x in a) {
  print(x * 2);
}` },
      options: [
        "O(1)",
        "O(n)",
        "O(n²)",
        "O(2n) وده أحسن من O(n)",
      ],
      answer: 1,
      why: "لوبين ورا بعض = n + n = 2n، والثابت 2 بيتشال فهي O(n). اللوبين مش متداخلين فمش بيتضربوا. و«O(2n)» مش صيغة صح في Big-O.",
    },
    {
      q: "إيه تعقيد الدالة دي؟",
      code: { lang: "dart", src: `int count(List<int> a) {
  var c = 0;
  for (var i = 0; i < a.length; i++) {
    for (var j = 0; j < a.length; j++) {
      if (a[i] < a[j]) c++;
    }
  }
  return c;
}` },
      answer: ["O(n^2)", "O(n²)", "o(n^2)", "O(n2)", "O(n*n)", "n^2", "n²"],
      why: "اللوب الخارجي n مرة وجواه لوب n مرة، فالسطر الداخلي بيتنفذ n × n.",
    },
    {
      q: "إيه تعقيد الكود ده؟",
      code: { lang: "dart", src: `for (var i = 0; i < n; i++) {
  for (var j = 0; j < 5; j++) {
    print(i + j);
  }
}` },
      options: [
        "O(n²)",
        "O(5)",
        "O(log n)",
        "O(n)",
      ],
      answer: 3,
      why: "اللوب الداخلي عدد ثابت (5 مرات) فالإجمالي 5n والثابت بيتشال: O(n). لوبين متداخلين مش دايما O(n²).",
    },
    {
      q: "إيه تعقيد الدالة دي؟ (a قايمة <code>List&lt;int&gt;</code> طولها n)",
      code: { lang: "dart", src: `int solve(List<int> a) {
  final sorted = [...a]..sort();
  var total = 0;
  for (final x in sorted) {
    total += x;
  }
  return total;
}` },
      answer: ["O(n log n)", "o(n log n)", "O(nlogn)", "O(n log(n))", "n log n", "nlogn"],
      why: "النسخ O(n)، الترتيب O(n log n)، واللوب O(n). الأكبر هو اللي بيحكم: O(n log n).",
    },
    {
      q: "إيه تعقيد الكود ده؟ (<code>a</code> قايمة طولها n و<code>b</code> قايمة عادية <code>List</code>)",
      code: { lang: "dart", src: `var common = 0;
for (final x in a) {
  if (b.contains(x)) common++;
}` },
      options: [
        "O(n) لأن فيه لوب واحد",
        "O(1)",
        "O(log n)",
        "O(n × m) حيث m طول b، لأن <code>contains</code> على قايمة بتلف على عناصرها",
      ],
      answer: 3,
      why: "<code>List.contains</code> خطي. فاللوب الواحد بيخفي لوب تاني. لو حولت b لـ Set (<code>b.toSet()</code>) الأول يبقى <code>contains</code> متوسط O(1) والإجمالي O(n + m).",
    },
    {
      q: "إيه تعقيد المساحة الإضافية (space) لدالة الـ recursion دي بالنسبة لـ n؟",
      code: { lang: "dart", src: `int sumTo(int n) {
  if (n == 0) return 0;
  return n + sumTo(n - 1);
}` },
      answer: ["O(n)", "o(n)", "n"],
      why: "الدالة بتنادي نفسها n مرة قبل ما ترجع، فعلى الـ call stack n إطار في نفس الوقت: مساحة O(n)، حتى لو مفيش قايمة جديدة. النسخة اللوب بتاخد O(1).",
    },
    {
      q: "إيه تعقيد الدالة دي بالنسبة لـ n؟ (النداء الأول <code>f(n)</code>)",
      code: { lang: "dart", src: `int f(int n) {
  if (n <= 1) return 1;
  return f(n - 1) + f(n - 1);
}` },
      answer: ["O(2^n)", "O(2ⁿ)", "o(2^n)", "2^n", "O(2**n)"],
      why: "كل نداء بيطلع نداءين على n-1. شجرة النداءات بتتضاعف في كل مستوى فعدد النداءات حوالي 2ⁿ. نفس تعقيد fibonacci الساذج.",
    },
    {
      q: "قايمة فيها مليون عنصر، وعندك حلين: O(n²) وO(n log n). ليه الأول غالبا مرفوض؟",
      options: [
        "لأنه بياخد مساحة أكبر",
        "لأن مليون تربيع = تريليون خطوة تقريبا (آلاف الثواني)، والتاني حوالي 20 مليون",
        "لأن الأول مش بيشتغل في Dart",
        "الاتنين نفس السرعة عمليا",
      ],
      answer: 1,
      why: "10⁶ × 10⁶ = 10¹² عملية، والكمبيوتر بيعمل حوالي 10⁸ إلى 10⁹ عملية بسيطة في الثانية، يعني ساعات. n log n ≈ 2×10⁷ بتخلص في أجزاء من الثانية. الفرق ده هو سبب السؤال عن التحسين.",
    },
  ],
};
