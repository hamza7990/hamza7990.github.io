window.LEVELS = window.LEVELS || {};
window.LEVELS["algo/a2"] = {
  slides: [
    {
      kicker: "ليه الترتيب",
      title: "الترتيب أساس نص الخوارزميات",
      en: "Why sorting matters",
      body: "<p>لو الداتا مرتبة تقدر تعمل binary search، تلاقي التكرارات جنب بعض، تدمج قايمتين، وتحل مسائل كتير بمؤشرين. وسؤال الترتيب في الإنترفيو مش علشان تكتب sort بإيدك في الشغل (هتستخدم <code>list.sort()</code>)، لكن علشان يشوفوا هل فاهم القسمة، التعقيد، والفرق بين الخوارزميات.</p>",
      codes: [
        {
          lang: "text",
          title: "الخلاصة اللي تحفظها",
          src: `algorithm    best        average     worst       extra space  stable
bubble       O(n)        O(n^2)      O(n^2)      O(1)         yes
selection    O(n^2)      O(n^2)      O(n^2)      O(1)         no
insertion    O(n)        O(n^2)      O(n^2)      O(1)         yes
merge        O(n log n)  O(n log n)  O(n log n)  O(n)         yes
quick        O(n log n)  O(n log n)  O(n^2)      O(log n)     no
counting     O(n + k)    O(n + k)    O(n + k)    O(k)         (can be)`,
          note: "k = أكبر قيمة. الـ stable معناها إن العناصر المتساوية بتفضل بنفس ترتيبها الأصلي (شريحة قدام).",
        },
      ],
      focus: [{ label: "احفظها", text: "المقارنة في الإنترفيو: مين stable؟ مين in-place؟ مين أسوأ حالته O(n²)؟ الجدول ده بيجاوب الثلاثة." }],
    },
    {
      kicker: "البسيطة",
      title: "Bubble و Selection: ليه نعرفهم",
      en: "Bubble sort and selection sort",
      body: "<p><b>Bubble</b>: بتعدي على المصفوفة وتبدّل أي جارين بالترتيب الغلط. بعد كل pass أكبر عنصر ثبت في مكانه في الآخر. لو pass معملش أي تبديل يبقى مرتبة وتقف (فأحسن حالة O(n)).</p><p><b>Selection</b>: في كل مرة دور على أصغر عنصر في الباقي وحطه في أول المكان الغير مرتب. عدد المقارنات ثابت n(n-1)/2 مهما كان الشكل، لكن التبديلات قليلة (n-1 على الأكتر).</p>",
      codes: [
        {
          lang: "text",
          title: "bubble على [5, 1, 4, 2, 8]",
          src: `pass 1: [1, 4, 2, 5, 8]    (8 is already last, 5 bubbled up)
pass 2: [1, 2, 4, 5, 8]
pass 3: [1, 2, 4, 5, 8]    no swaps -> stop`,
        },
        {
          lang: "text",
          title: "selection على [64, 25, 12, 22, 11]",
          src: `i=0  min is 11  -> [11, 25, 12, 22, 64]
i=1  min is 12  -> [11, 12, 25, 22, 64]
i=2  min is 22  -> [11, 12, 22, 25, 64]
i=3  min is 25  -> [11, 12, 22, 25, 64]`,
        },
      ],
      pitfall: "الاتنين O(n²) فمبيتستخدموش على بيانات كبيرة. وselection مش stable لأن التبديل البعيد بيعدّي عنصر على نسخته المساوية. مفيش حد هيطلب منك تكتبهم، لكن هيسألك إيه الأسوأ ولو عارف الجدول تجاوب.",
      interview: [
        { q: "إيه الفرق بين bubble sort وselection sort؟", a: "الاتنين O(n²) و in-place. bubble بيبدل الجيران باستمرار وبيقدر يقف بدري لو معملش تبديل (O(n) على مدخل مرتب) وهو stable. selection بيختار أصغر عنصر في الباقي ويحطه في مكانه، فعدد المقارنات ثابت n(n-1)/2 لكن تبديلاته قليلة (n-1 على الأكتر)، ومش stable.",
        },
      ],
    },
    {
      kicker: "الصغيرة والشبه مرتبة",
      title: "Insertion sort: زي ترتيب ورق اللعب",
      en: "Insertion sort",
      body: "<p>الجزء اللي على الشمال مرتب دايما. خد العنصر اللي بعده (<code>key</code>)، وارجع بالعناصر الأكبر منه خطوة لقدام لحد ما تلاقي مكانه، وحطه. كل عنصر بيتحرك لورا بقدر عدد العناصر الأكبر منه قبله.</p><p><b>امتى هي الاختيار الصح؟</b> (1) مصفوفة صغيرة (عشرات العناصر). (2) مصفوفة شبه مرتبة: بتقرب من O(n) لأن شغل الإزاحة قليل. (3) بيانات بتيجي واحد واحد وعايزها مرتبة طول الوقت. وكتير من مكتبات الترتيب الحقيقية بتستخدمها للقطع الصغيرة.</p>",
      code: {
        lang: "dart",
        src: `List<int> insertionSort(List<int> input) {
  final a = List<int>.of(input);
  for (var i = 1; i < a.length; i++) {
    final key = a[i];
    var j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];     // shift right
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}

void main() {
  print(insertionSort([5, 2, 4, 6, 1, 3]));   // [1, 2, 3, 4, 5, 6]
  print(insertionSort([]));                    // []
  print(insertionSort([2, 2, 2]));             // [2, 2, 2]
}`,
        note: "الشرط <code>a[j] &gt; key</code> (مش <code>&gt;=</code>) هو اللي بيخليها stable: العنصر المساوي مش بيتعدّى.",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع [5, 2, 4, 6, 1, 3]",
          src: `start      [5 | 2, 4, 6, 1, 3]
i=1 key=2  [2, 5 | 4, 6, 1, 3]
i=2 key=4  [2, 4, 5 | 6, 1, 3]
i=3 key=6  [2, 4, 5, 6 | 1, 3]   no shift
i=4 key=1  [1, 2, 4, 5, 6 | 3]   shifts 4 elements
i=5 key=3  [1, 2, 3, 4, 5, 6]`,
          note: "الخط | يفصل المرتب عن الباقي.",
        },
      ],
      interview: [
        { q: "امتى تفضل insertion sort على merge sort أو quick sort؟", a: "لما المصفوفة صغيرة أو شبه مرتبة. تعقيدها O(n²) في الأسوأ لكن O(n + عدد المقلوبات) فلو المصفوفة شبه مرتبة بتبقى تقريبا O(n). ثابتها صغير وهي in-place و stable ومفيهاش recursion، فبتكسب على الخوارزميات الأسرع نظريا لما n صغير.",
        },
      ],
    },
    {
      kicker: "قسّم وادمج",
      title: "Merge sort: ثابتة ومضمونة",
      en: "Merge sort",
      body: "<p>(1) قسّم المصفوفة نصين. (2) رتب كل نصف بنفس الدالة. (3) ادمج النصين المرتبين بمؤشرين: قارن رأس كل نصف وخد الأصغر. الـ base case مصفوفة طولها 0 أو 1. مفيش أسوأ حالة: دايما O(n log n) (شريحة التعقيد في a1). بتحتاج مصفوفة إضافية فالمساحة O(n). وهي stable لو في التعادل أخدت من الشمال (<code>&lt;=</code>).</p>",
      code: {
        lang: "dart",
        src: `List<int> mergeSort(List<int> a) {
  if (a.length <= 1) return a;
  final mid = a.length ~/ 2;
  final left = mergeSort(a.sublist(0, mid));
  final right = mergeSort(a.sublist(mid));
  final out = <int>[];
  var i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      out.add(left[i++]);     // <= keeps it stable
    } else {
      out.add(right[j++]);
    }
  }
  while (i < left.length) out.add(left[i++]);
  while (j < right.length) out.add(right[j++]);
  return out;
}

void main() {
  print(mergeSort([38, 27, 43, 3, 9, 82, 10]));
  // [3, 9, 10, 27, 38, 43, 82]
  print(mergeSort([]));            // []
  print(mergeSort([1]));           // [1]
}`,
        note: "بعد الـ while الأولى واحد من النصين خلص، والتاني الباقي منه مرتب فبنضيفه كله.",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع [38, 27, 43, 3, 9, 82, 10]",
          src: `split   [38, 27, 43]        [3, 9, 82, 10]
split   [38] [27, 43]       [3, 9] [82, 10]
merge   [27, 38, 43]        [3, 9, 10, 82]
merge   [3, 9, 10, 27, 38, 43, 82]`,
        },
      ],
      interview: [
        { q: "اشرح merge sort وليه مساحتها O(n).", a: "بقسم المصفوفة نصين، برتب كل نصف recursively، وبدمجهم بمؤشرين في مصفوفة جديدة. الدمج مش ممكن in-place بسهولة فبحتاج مصفوفة مؤقتة بحجم n، وفوقها عمق الـ recursion log n. الزمن O(n log n) في كل الحالات والترتيب stable.",
        },
      ],
    },
    {
      kicker: "الأسرع عمليا",
      title: "Quick sort: partition حوالين pivot",
      en: "Quick sort",
      body: "<p>اختار pivot. أعد ترتيب المصفوفة بحيث كل اللي أصغر منه على شماله وكل اللي أكبر على يمينه (partition)، فالـ pivot بيبقى في مكانه النهائي. بعدين رتب الجزئين بنفس الطريقة. الشغل كله في الـ partition، وبعدها مفيش دمج. in-place، ومساحتها O(log n) للـ stack في المتوسط.</p>",
      code: {
        lang: "dart",
        src: `void quickSort(List<int> a, [int lo = 0, int? hi]) {
  final h = hi ?? a.length - 1;
  if (lo >= h) return;
  final p = partition(a, lo, h);
  quickSort(a, lo, p - 1);
  quickSort(a, p + 1, h);
}

int partition(List<int> a, int lo, int hi) {
  final mid = lo + (hi - lo) ~/ 2;
  swap(a, mid, hi);              // move the middle pivot to the end
  final pivot = a[hi];
  var i = lo;                    // next slot for a small element
  for (var j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      swap(a, i, j);
      i++;
    }
  }
  swap(a, i, hi);                // pivot into its final place
  return i;
}

void swap(List<int> a, int i, int j) {
  final t = a[i];
  a[i] = a[j];
  a[j] = t;
}

void main() {
  final q = [8, 3, 1, 7, 0, 10, 2];
  quickSort(q);
  print(q);   // [0, 1, 2, 3, 7, 8, 10]
}`,
        note: "الدالة اسمها Lomuto partition. i بيشاور على أول مكان بعد العناصر الأصغر من الـ pivot.",
      },
      codes: [
        {
          lang: "text",
          title: "partition على [8, 3, 1, 7, 0, 10, 2]، pivot = 7 (الأوسط)",
          src: `swap pivot to end    [8, 3, 1, 2, 0, 10, 7]
scan, 3 < 7 swap     [3, 8, 1, 2, 0, 10, 7]   i=1
1 < 7 swap           [3, 1, 8, 2, 0, 10, 7]   i=2
2 < 7 swap           [3, 1, 2, 8, 0, 10, 7]   i=3
0 < 7 swap           [3, 1, 2, 0, 8, 10, 7]   i=4
place pivot at i=4   [3, 1, 2, 0, 7, 10, 8]   returns 4`,
          note: "على شمال الـ index 4 كلهم أصغر من 7، وعلى يمينه أكبر. 7 في مكانه النهائي.",
        },
      ],
    },
    {
      kicker: "الأسوأ والـ pivot",
      title: "اختيار الـ pivot هو كل حاجة",
      en: "Pivot choice and the worst case",
      body: "<p>لو الـ pivot دايما أصغر أو أكبر عنصر، الـ partition بيشيل عنصر واحد بس والمسألة بتصغر بواحد: (n-1) + (n-2) + ... = n(n-1)/2 مقارنة، يعني O(n²)، وعمق الـ stack O(n). ده بيحصل لو بتاخد <b>أول</b> أو <b>آخر</b> عنصر كـ pivot والمصفوفة مرتبة أو معكوسة (حالة شائعة جدا في الداتا الحقيقية!). الحلول: pivot عشوائي، أو الأوسط، أو median-of-three (وسيط أول وأوسط وآخر عنصر).</p><p>كمان: العناصر المتساوية الكتير بتضرب lomuto (كلها على جنب واحد). اتفادى ده بـ three-way partition (أصغر، يساوي، أكبر).</p>",
      codes: [
        {
          lang: "text",
          title: "عدد المقارنات لـ n = 10 بـ pivot = أول عنصر (من a1)",
          src: `already sorted     45   (= 10*9/2, worst)
mixed order        21
the pivot in the middle every time: about n log2 n ~ 33`,
        },
      ],
      pitfall: "كتابة quick sort بـ pivot = أول عنصر على داتا جاية مرتبة هي أشهر سبب لـ stack overflow وبطء قاتل في الإنترفيو وفي الشغل.",
      interview: [
        { q: "ليه quick sort في الغالب أسرع من merge sort رغم إن أسوأ حالتها O(n²)؟", a: "الأسوأ نادر لو اخترت الـ pivot كويس (عشوائي أو median-of-three). والـ partition in-place وبيمشي على الذاكرة بالترتيب (cache friendly) ومفيش تخصيص مصفوفات جديدة، فالثابت صغير. merge sort أفضل لما محتاج ضمان O(n log n) أو stable أو ترتيب بيانات على disk.",
        },
      ],
    },
    {
      kicker: "الحد الأدنى",
      title: "Counting sort وليه n log n حد أدنى",
      en: "Counting sort and the comparison lower bound",
      body: "<p>أي خوارزمية ترتب <b>بالمقارنة</b> بين العناصر مش ممكن تكون أسرع من O(n log n) في الأسوأ. السبب ببساطة: فيه n! ترتيب محتمل، وكل مقارنة بتجاوب نعم/لا وبتستبعد نص الاحتمالات تقريبا، فمحتاج على الأقل log₂(n!) مقارنة، وده حوالي n log n.</p><p>لكن لو القيم أعداد صحيحة في مدى صغير k، تقدر تتخطى المقارنة: عدّ كام مرة ظهرت كل قيمة، وبعدين اطبعها بالترتيب. <b>Counting sort</b> زمنها O(n + k) ومساحتها O(k).</p>",
      code: {
        lang: "dart",
        src: `List<int> countingSort(List<int> a, int maxValue) {
  final counts = List<int>.filled(maxValue + 1, 0);
  for (final x in a) {
    counts[x]++;
  }
  final out = <int>[];
  for (var v = 0; v <= maxValue; v++) {
    for (var k = 0; k < counts[v]; k++) {
      out.add(v);
    }
  }
  return out;
}

void main() {
  print(countingSort([3, 1, 4, 1, 5, 2, 0, 3], 5));
  // [0, 1, 1, 2, 3, 3, 4, 5]
  print(countingSort([], 5));   // []
}`,
        note: "بتشتغل بس مع أرقام صحيحة غير سالبة ومدى معروف. لو k ضخم (مثلا قيم لحد مليار) المساحة بتبوظ الفايدة.",
      },
      interview: [
        { q: "ليه مينفعش نرتب أسرع من O(n log n)؟ وهل ده صحيح دايما؟", a: "ده حد أدنى لخوارزميات الترتيب <b>بالمقارنة</b> بس: فيه n! ترتيب ممكن وكل مقارنة بتفرق بين اتنين، فمحتاج log₂(n!) ≈ n log n مقارنة. خوارزميات مبتقارنش زي counting sort وradix sort بتوصل O(n + k) لو القيم أعداد صحيحة في مدى محدود.",
        },
      ],
    },
    {
      kicker: "الاستقرار",
      title: "Stability: ليه بيهم لما نرتب بمفتاحين",
      en: "Stable sorting",
      body: "<p>الترتيب stable معناه إن عنصرين متساويين في المفتاح بيفضلوا بنفس ترتيبهم الأصلي. ده بيهم لما ترتب بمفتاحين على مرحلتين: رتب بالاسم الأول، وبعدين رتب بالسن. لو الترتيب التاني stable، اللي سنهم واحد هيفضلوا مرتبين بالاسم. لو مش stable الترتيب الأول ممكن يضيع.</p><p><b>في Dart</b>: <code>List.sort</code> <b>مش مضمونة تكون stable</b> (التوثيق بيقول كده). على قوايم صغيرة ممكن تطلع stable بالصدفة، وعلى قوايم أكبر لأ. جربت قايمة 200 عنصر بمفتاح <code>age % 3</code> وطلع الترتيب بين المتساويين اتغير.</p>",
      code: {
        lang: "dart",
        title: "ترتيب stable مضمون: كسر التعادل بالـ index الأصلي",
        src: `class P {
  final String name;
  final int age;
  P(this.name, this.age);
  @override
  String toString() => '$name:$age';
}

void main() {
  final people = [P('Ali', 30), P('Sara', 25), P('Omar', 30), P('Dina', 25)];
  final idx = List<int>.generate(people.length, (i) => i);
  idx.sort((i, j) {
    final c = people[i].age.compareTo(people[j].age);
    return c != 0 ? c : i.compareTo(j);
  });
  print(idx.map((i) => people[i]).toList());
  // [Sara:25, Dina:25, Ali:30, Omar:30]
}`,
        note: "لما المفتاح يتساوى بنقارن بمكان العنصر الأصلي، فالنتيجة stable أكيد. أو اكتب merge sort بنفسك بـ <code>&lt;=</code>.",
      },
      focus: [{ label: "احفظها", text: "Dart List.sort مش مضمونة stable. لو محتاج stable ضيف كسر تعادل بالـ index الأصلي أو استخدم merge sort." }],
      interview: [
        { q: "يعني إيه stable sort وليه بيهم؟", a: "هو ترتيب بيحافظ على الترتيب النسبي للعناصر المتساوية في المفتاح. بيهم لما بترتب نفس القايمة بمفاتيح متتالية، زي جدول بيترتب بالتاريخ وبعدين بالقسم وعايز الترتيب بالتاريخ يفضل داخل كل قسم. merge sort وinsertion وbubble stable، و quick وselection مش stable.",
        },
      ],
    },
    {
      kicker: "في Dart",
      title: "List.sort والـ comparator",
      en: "List.sort and the comparator contract",
      body: "<p><code>list.sort()</code> من غير parameter بترتب بالترتيب الطبيعي (الأرقام بالقيمة، النصوص أبجديا بحسب أكواد الحروف). تقدر تدي دالة مقارنة <code>(a, b)</code> بترجع <code>int</code>: <b>سالب</b> لو a قبل b، <b>صفر</b> لو متساويين، <b>موجب</b> لو a بعد b. لازم تكون متسقة: لو a قبل b يبقى b بعد a، وتعدّي (transitive). كسر العقد ده بيدّي ترتيب غلط أو أخطاء غريبة.</p>",
      code: {
        lang: "dart",
        src: `void main() {
  final nums = [10, 9, 2, 33, 1];
  nums.sort();
  print(nums);                          // [1, 2, 9, 10, 33]

  final asText = [10, 9, 2, 33, 1].map((e) => '$e').toList();
  asText.sort();
  print(asText);                        // [1, 10, 2, 33, 9]

  nums.sort((a, b) => b.compareTo(a));  // descending
  print(nums);                          // [33, 10, 9, 2, 1]

  final words = ['banana', 'kiwi', 'apple', 'fig'];
  words.sort((a, b) => a.length.compareTo(b.length));
  print(words);                         // [fig, kiwi, apple, banana]
}`,
        note: "الأرقام كنص بتترتب أبجديا: '10' قبل '2'. استخدم <code>compareTo</code> بدل الطرح (<code>a - b</code>) لأن الطرح على <code>double</code> بيرجع double مش int، ومع أرقام كبيرة ممكن يعمل overflow في لغات تانية.",
      },
      pitfall: "comparator بيرجع <code>a.x &gt; b.x ? 1 : -1</code> من غير حالة التساوي بيكسر العقد (مفيش صفر). استخدم <code>compareTo</code> دايما.",
      interview: [
        { q: "إيه العقد اللي لازم الـ comparator يلتزم بيه في Dart؟", a: "بيرجع int: سالب لو a قبل b، صفر لو متساويين، موجب لو a بعد b. ولازم يكون متسق: compare(a,b) عكس إشارة compare(b,a)، ومتعدّي. ولو بيرجع قيمة غلط في التساوي أو بيعتمد على حاجة بتتغير، الترتيب بيطلع غير متوقع. الأسهل أستخدم <code>compareTo</code> الجاهزة.",
        },
      ],
    },
    {
      kicker: "عمليا",
      title: "ترتيب كائنات بأكتر من حقل",
      en: "Sorting objects by several fields",
      body: "<p>الأسلوب الصح: في دالة واحدة قارن بالحقل الأول، ولو النتيجة مش صفر ارجعها، وإلا انتقل للحقل التاني. ده أفضل من ترتيبين متتاليين لأنه مبيعتمدش على الـ stability. للترتيب التنازلي اقلب الطرفين (<code>b.compareTo(a)</code>).</p>",
      code: {
        lang: "dart",
        title: "السن تنازلي، ولو تساوى بالاسم تصاعدي",
        src: `class P {
  final String name;
  final int age;
  P(this.name, this.age);
  @override
  String toString() => '$name:$age';
}

void main() {
  final people = [P('Ali', 30), P('Sara', 25), P('Omar', 30), P('Dina', 25)];
  people.sort((a, b) {
    final c = b.age.compareTo(a.age);   // age descending
    if (c != 0) return c;
    return a.name.compareTo(b.name);    // then name ascending
  });
  print(people);
  // [Ali:30, Omar:30, Dina:25, Sara:25]
}`,
        note: "التعقيد O(n log n) مقارنات، وكل مقارنة بتخلص عند أول حقل مختلف.",
      },
      interview: [
        { q: "عندك قايمة موظفين، رتبها بالقسم ثم بالمرتب تنازليا ثم بالاسم.", a: "دالة comparator واحدة: <code>c = a.dept.compareTo(b.dept); if (c != 0) return c; c = b.salary.compareTo(a.salary); if (c != 0) return c; return a.name.compareTo(b.name);</code>. كل مرحلة بترجع لو لقت فرق، فالترتيب كامل من غير اعتماد على الـ stability. التعقيد O(n log n) مرات تكلفة المقارنة.",
        },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: insertion sort",
      lang: "dart",
      code: `List<int> insertionSort(List<int> input) {
  final a = List<int>.of(input);
  for (var i = 1; i < a.length; i++) {
    final key = a[i];
    var j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}`,
      note: "لاحظ <code>&gt;</code> مش <code>&gt;=</code>: ده اللي بيخليها stable.",
    },
    {
      title: "اكتب: ترتيب كائنات بمفتاحين",
      lang: "dart",
      code: `class P {
  final String name;
  final int age;
  P(this.name, this.age);
}

void main() {
  final xs = [P('Ali', 30), P('Sara', 25)];
  xs.sort((a, b) {
    final c = b.age.compareTo(a.age);
    if (c != 0) return c;
    return a.name.compareTo(b.name);
  });
  print(xs.map((p) => p.name).toList());
}`,
      note: "الناتج <code>[Ali, Sara]</code>.",
    },
    {
      title: "اكتب: swap و partition",
      lang: "dart",
      code: `void swap(List<int> a, int i, int j) {
  final t = a[i];
  a[i] = a[j];
  a[j] = t;
}

int partition(List<int> a, int lo, int hi) {
  final pivot = a[hi];
  var i = lo;
  for (var j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      swap(a, i, j);
      i++;
    }
  }
  swap(a, i, hi);
  return i;
}`,
      note: "نسخة بدون اختيار الـ pivot الأوسط (آخر عنصر هو الـ pivot).",
    },
  ],

  tasks: [
    {
      title: "Insertion sort",
      lang: "dart",
      prompt: "<p>اكتب <code>List&lt;int&gt; insertionSort(List&lt;int&gt; input)</code> ترجع قايمة مرتبة تصاعديا من غير ما تعدل على الأصل ومن غير <code>sort()</code>.</p>",
      examples: [
        { in: "insertionSort([5, 2, 4, 6, 1, 3])", out: "[1, 2, 3, 4, 5, 6]" },
        { in: "insertionSort([])", out: "[]" },
        { in: "insertionSort([3, -1, 3, 0, -1])", out: "[-1, -1, 0, 3, 3]" },
      ],
      starter: `List<int> insertionSort(List<int> input) {
  // your code
}`,
      hints: [
        "انسخ القايمة: <code>List&lt;int&gt;.of(input)</code>. وابدأ اللوب من 1.",
        "خد <code>key = a[i]</code> وازح العناصر الأكبر منه خطوة لليمين بـ while، وبعدها حط key.",
      ],
      solution: `List<int> insertionSort(List<int> input) {
  final a = List<int>.of(input);
  for (var i = 1; i < a.length; i++) {
    final key = a[i];
    var j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}`,
      explain: "O(n²) في الأسوأ (معكوسة) و O(n) لو مرتبة، مساحة إضافية O(1) غير النسخة. القايمة الفاضية واللي فيها عنصر مبيدخلوش اللوب.",
    },
    {
      title: "دمج قايمتين مرتبتين",
      lang: "dart",
      prompt: "<p>اكتب <code>List&lt;int&gt; mergeSorted(List&lt;int&gt; a, List&lt;int&gt; b)</code> بتدمج قايمتين مرتبتين في قايمة مرتبة واحدة في O(n + m)، من غير <code>sort()</code>. عند التساوي خد من <code>a</code> الأول.</p>",
      examples: [
        { in: "mergeSorted([1, 4, 7], [2, 3, 9, 10])", out: "[1, 2, 3, 4, 7, 9, 10]" },
        { in: "mergeSorted([], [5])", out: "[5]" },
        { in: "mergeSorted([1, 1], [1])", out: "[1, 1, 1]" },
      ],
      starter: `List<int> mergeSorted(List<int> a, List<int> b) {
  // your code
}`,
      hints: [
        "مؤشرين <code>i</code> و<code>j</code>، وقارن <code>a[i]</code> و<code>b[j]</code> طالما الاتنين فيهم عناصر.",
        "بعد اللوب الأولى، أضف الباقي من اللي لسه فيها عناصر.",
      ],
      solution: `List<int> mergeSorted(List<int> a, List<int> b) {
  final out = <int>[];
  var i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      out.add(a[i++]);
    } else {
      out.add(b[j++]);
    }
  }
  while (i < a.length) {
    out.add(a[i++]);
  }
  while (j < b.length) {
    out.add(b[j++]);
  }
  return out;
}`,
      explain: "كل عنصر بيتضاف مرة واحدة فالزمن O(n + m) والمساحة O(n + m) للناتج. ده هو قلب merge sort. <code>&lt;=</code> عند التساوي هي اللي بتخليه stable.",
    },
    {
      title: "ترتيب كلمات بالطول ثم أبجديا",
      lang: "dart",
      prompt: "<p>اكتب <code>List&lt;String&gt; sortWords(List&lt;String&gt; words)</code> ترجع نسخة مرتبة بالطول (الأقصر أولا)، ولو الطول واحد بالترتيب الأبجدي. استخدم <code>sort</code> مع comparator.</p>",
      examples: [
        { in: "sortWords(['banana', 'kiwi', 'apple', 'fig', 'date'])", out: "[fig, date, kiwi, apple, banana]" },
        { in: "sortWords([])", out: "[]" },
      ],
      starter: `List<String> sortWords(List<String> words) {
  // your code
}`,
      hints: [
        "انسخ القايمة بـ <code>List&lt;String&gt;.of(words)</code> قبل الترتيب.",
        "قارن الطول بـ <code>compareTo</code>، ولو النتيجة 0 قارن النصين.",
      ],
      solution: `List<String> sortWords(List<String> words) {
  final out = List<String>.of(words);
  out.sort((a, b) {
    final c = a.length.compareTo(b.length);
    if (c != 0) return c;
    return a.compareTo(b);
  });
  return out;
}`,
      explain: "الفرق بيتحسم في comparator واحد، فمبنعتمدش على الـ stability. التعقيد O(n log n) مقارنات، وكل مقارنة نصين ممكن تكلف طول النص.",
    },
  ],

  quiz: [
    {
      q: "إيه شكل المصفوفة بعد أول pass من bubble sort؟",
      code: { lang: "dart", src: `// a = [5, 1, 4, 2, 8]
for (var j = 0; j < a.length - 1; j++) {
  if (a[j] > a[j + 1]) {
    final t = a[j];
    a[j] = a[j + 1];
    a[j + 1] = t;
  }
}
print(a);` },
      answer: ["[1, 4, 2, 5, 8]", "1, 4, 2, 5, 8", "1 4 2 5 8"],
      why: "5 اتبدل مع 1 ثم 4 ثم 2، وبعدين 5 < 8 فمفيش تبديل. الناتج [1, 4, 2, 5, 8].",
    },
    {
      q: "أنهي خوارزمية من دول stable (بتحافظ على ترتيب المتساويين) وزمنها O(n log n) في كل الحالات؟",
      options: [
        "Quick sort بـ pivot عشوائي",
        "Selection sort",
        "Bubble sort",
        "Merge sort",
      ],
      answer: 3,
      why: "merge sort بس. quick مش stable وأسوأ حالتها O(n²). selection مش stable، و bubble stable لكنها O(n²).",
    },
    {
      q: "امتى insertion sort هي الاختيار الأنسب؟",
      options: [
        "لما المصفوفة صغيرة أو شبه مرتبة",
        "لما المصفوفة مليون عنصر عشوائي",
        "لما محتاج ضمان O(n log n) في الأسوأ",
        "لما القيم أعداد صحيحة في مدى ضيق",
      ],
      answer: 0,
      why: "على شبه المرتب بتقرب من O(n)، وثابتها صغير. على مليون عنصر عشوائي O(n²) كارثة. المدى الضيق للأرقام ده مكان counting sort.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `void main() {
  final xs = ['10', '9', '2', '33', '1'];
  xs.sort();
  print(xs);
}` },
      answer: ["[1, 10, 2, 33, 9]", "1, 10, 2, 33, 9"],
      why: "النصوص بتترتب أبجديا حرف حرف: '1' قبل '10' قبل '2' قبل '33' قبل '9'. لو عايز ترتيب بالقيمة حوّلها لأرقام.",
    },
    {
      q: "مصفوفة مرتبة بالفعل وquick sort بتاخد أول عنصر كـ pivot. تعقيد الزمن؟",
      options: [
        "O(n log n) لأن المصفوفة مرتبة",
        "O(n) لأن مفيش تبديلات",
        "O(n²) لأن كل partition بيشيل عنصر واحد بس",
        "O(log n) لأنها بتقسم",
      ],
      answer: 2,
      why: "الـ pivot هو أصغر عنصر، فالجزء الشمال فاضي واليمين n-1. المقارنات (n-1)+(n-2)+... = n(n-1)/2. الحل pivot عشوائي أو median-of-three.",
    },
    {
      q: "ليه merge sort مساحتها الإضافية O(n)؟",
      options: [
        "لأنها بتخزن كل مستوى من الـ recursion كاملا",
        "لأن الدمج بيحتاج مصفوفة مؤقتة بحجم المدخل",
        "لأنها بتنسخ المدخل مرة لكل مقارنة",
        "لأن عمق الـ recursion n",
      ],
      answer: 1,
      why: "الدمج بيكتب الناتج في مصفوفة جديدة بحجم n. عمق الـ recursion log n مش n، وكل مستوى بيستخدم نفس الـ n مرة واحدة مش n × عدد المستويات.",
    },
    {
      q: "إيه اللي لازم دالة المقارنة في <code>list.sort((a, b) =&gt; ...)</code> ترجعه؟",
      options: [
        "true لو a قبل b",
        "-1 أو 1 بس ومفيش صفر",
        "الفرق بين النوعين دايما",
        "int: سالب لو a قبل b، صفر لو متساويين، موجب لو a بعد b",
      ],
      answer: 3,
      why: "ده عقد الـ comparator. bool مش مقبول (خطأ compile). إرجاع 1 و -1 فقط بيكسر التساوي. والطرح بيشتغل مع int لكنه مش آمن لـ double.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `List<int> countingSort(List<int> a, int maxValue) {
  final counts = List<int>.filled(maxValue + 1, 0);
  for (final x in a) {
    counts[x]++;
  }
  final out = <int>[];
  for (var v = 0; v <= maxValue; v++) {
    for (var k = 0; k < counts[v]; k++) {
      out.add(v);
    }
  }
  return out;
}

void main() {
  print(countingSort([3, 1, 4, 1, 5, 2, 0, 3], 5));
}` },
      answer: ["[0, 1, 1, 2, 3, 3, 4, 5]", "0, 1, 1, 2, 3, 3, 4, 5"],
      why: "counts = [1, 2, 1, 2, 1, 1] للقيم 0..5. بنطبع كل قيمة بعدد مرات ظهورها بالترتيب.",
    },
    {
      q: "ليه counting sort تقدر تكسر حد O(n log n)؟",
      options: [
        "لأنها بتستخدم multithreading",
        "لأن الحد الأدنى n log n بينطبق بس على الترتيب بالمقارنة، وهي مبتقارنش",
        "لأن الحد الأدنى غلط في الحالات الصغيرة",
        "لأنها بتفترض إن المصفوفة مرتبة جزئيا",
      ],
      answer: 1,
      why: "الحد الأدنى مبني على إن كل خطوة هي مقارنة بنعم/لا. counting sort بتستخدم القيمة نفسها كـ index فمتعدش مقارنة، لكن بتحتاج أرقام صحيحة في مدى k معقول (O(n + k)).",
    },
    {
      q: "الدالة بترجع كام؟",
      code: { lang: "dart", src: `void swap(List<int> a, int i, int j) {
  final t = a[i];
  a[i] = a[j];
  a[j] = t;
}

int partition(List<int> a, int lo, int hi) {
  final mid = lo + (hi - lo) ~/ 2;
  swap(a, mid, hi);
  final pivot = a[hi];
  var i = lo;
  for (var j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      swap(a, i, j);
      i++;
    }
  }
  swap(a, i, hi);
  return i;
}

void main() {
  print(partition([8, 3, 1, 7, 0, 10, 2], 0, 6));
}` },
      answer: ["4"],
      why: "الـ pivot هو 7. العناصر الأصغر منه 3 و1 و2 و0: أربعة، فبيستقر 7 على index 4.",
    },
  ],
};
