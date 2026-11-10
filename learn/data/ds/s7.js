window.LEVELS = window.LEVELS || {};
window.LEVELS["ds/s7"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "الـ Heap: «إدّيني الأصغر (أو الأهم) حالا»",
      en: "Why heaps",
      body: "<p>أحيانا مش محتاج كل البيانات مرتبة، محتاج بس <b>الأهم واحد دلوقتي</b>: أقرب موعد، أعلى أولوية، أقصر طريق لسه مزرتوش، أكبر 10 قيم. لو بتعمل sort كل مرة هتدفع O(n log n)، ولو بتدور على الأصغر بمسح خطي هتدفع O(n). الـ <b>heap</b> بيديك الأصغر في O(1) وبيشيله ويضيف عنصر جديد في O(log n).</p><p>الـ heap هو التنفيذ الشائع لـ <b>priority queue</b> (طابور الأولوية): queue لكن اللي بيخرج أول هو صاحب أعلى أولوية مش اللي دخل أول. في المستوى ده هنفهم شكله جوه array، ونتتبع الـ sift up والـ sift down خطوة خطوة، ونكتب MinHeap بإيدينا، وبعدين المسائل الكلاسيك: أكبر K عناصر، الأكتر تكرارا، دمج K قوايم، والـ median الجاري.</p>",
      points: [
        "الـ heap هيكل مرتب <b>جزئيا</b> بس: الأصغر (أو الأكبر) دايما في القمة، والباقي مش مرتب.",
        "الترتيب الجزئي ده هو سر الرخص: إدراج وإخراج O(log n) بدل O(n) للقايمة المرتبة.",
        "Dart مفيهاش heap في المكتبة الأساسية. فيه <code>PriorityQueue</code> في package اسمه <code>collection</code>، وفي الإنترفيو مطلوب تكتب heap بإيدك.",
      ],
    },
    {
      title: "قاعدة الـ heap، وتمثيله في array",
      en: "Heap property and array representation",
      body: "<p><b>القاعدة (min-heap):</b> كل node أصغر من أو تساوي أولادها. فالأصغر في الـ root. الشجرة كمان <b>complete</b>: كل المستويات ممتلية ما عدا الأخير، واللي فيه بيتملي من الشمال. الشكل ده بيسمح بحاجة ذكية: منحتاجش مؤشرات خالص، نخزن الشجرة في <b>array عادية</b> مستوى بمستوى، ونحسب مكان الأب والأولاد بمعادلة.</p>",
      code: {
        lang: "text",
        title: "min-heap and its array",
        src: `            1
          /   \\
         3     2
        / \\   / \\
       7   4 5   6

index   0  1  2  3  4  5  6
value   1  3  2  7  4  5  6

parent(i) = (i - 1) ~/ 2
left(i)   = 2 * i + 1
right(i)  = 2 * i + 2

check: i = 4 (value 4) -> parent (4 - 1) ~/ 2 = 1 (value 3)
       i = 2 (value 2) -> children at 5 and 6 (values 5 and 6)`,
        note: "الإخوة (3 و 2) مش مرتبين بالنسبة لبعض. القاعدة بين الأب وأولاده بس. عشان كده الـ heap مش sorted array، وعشان كده البحث عن قيمة معينة فيه O(n).",
      },
      terms: [
        ["heap property", "قاعدة الـ heap", "min-heap: كل node أصغر من أولادها. max-heap: أكبر منهم."],
        ["complete binary tree", "شجرة كاملة", "كل المستويات ممتلية إلا الأخير، وبيتملي من الشمال لليمين. بتضمن إن الارتفاع log n."],
        ["priority queue", "طابور الأولوية", "واجهة: add و removeFirst (الأهم). الـ heap هو أشهر تنفيذ ليها."],
      ],
      interview: [
        { q: "إيه هو الـ heap؟ وإزاي بيتخزن في array من غير مؤشرات؟", a: "الـ heap شجرة ثنائية كاملة (complete) بقاعدة: كل node أصغر من أولادها في min-heap أو أكبر في max-heap، فالأصغر أو الأكبر دايما في الـ root. عشان هي كاملة بنخزنها في array مستوى بمستوى، وبالـ 0-based index: الأب <code>(i-1) ~/ 2</code> والولد الشمال <code>2i+1</code> واليمين <code>2i+2</code>. ده بيوفر مؤشرات وبيدي cache locality كويسة. الترتيب بين الإخوة مش مضمون." },
      ],
    },
    {
      title: "الإدراج: sift up خطوة بخطوة",
      en: "Insert and sift up",
      body: "<p>نحط العنصر الجديد في <b>آخر الـ array</b> (أول مكان فاضي في الشجرة الكاملة، فالشكل بيفضل صح). ممكن يبقى أصغر من أبوه، فبنقارنه بأبوه ونبدل لو أصغر، ونكرر لفوق. كل خطوة بتطلع مستوى، والارتفاع log n، فالتكلفة <b>O(log n)</b>. بنقف لما الأب أصغر منه أو نوصل للـ root.</p>",
      code: {
        lang: "text",
        title: "insert 1 into [2, 5, 3, 9, 6]",
        src: `start        [2, 5, 3, 9, 6]
step 0       append 1 at the end        [2, 5, 3, 9, 6, 1]     i = 5
step 1       parent(5) = 2 (value 3)
             1 < 3, swap                [2, 5, 1, 9, 6, 3]     i = 2
step 2       parent(2) = 0 (value 2)
             1 < 2, swap                [1, 5, 2, 9, 6, 3]     i = 0
step 3       i = 0 is the root: stop

tree before:     2            tree after:      1
               /   \\                         /   \\
              5     3                       5     2
             / \\                           / \\   /
            9   6   + 1 here               9   6 3`,
        note: "الـ 1 طلعت لفوق مرتين لأنها أصغر من كل أجدادها. لو كنا أدخلنا 8 كانت هتقف في الخطوة 0 (8 > 3) من غير ولا swap.",
      },
      focus: [{ label: "احفظها", text: "الإدراج = <b>ضيف في الآخر ثم sift up</b>. الأسوأ log n swap. المتوسط لقيم عشوائية أقل بكتير." }],
    },
    {
      title: "الإخراج: sift down خطوة بخطوة",
      en: "Extract the root and sift down",
      body: "<p>الأصغر في الـ root. لو شلناه هيبقى فيه فجوة. الحيلة: نحفظ الـ root كإجابة، ونحط <b>آخر عنصر في الـ array</b> مكانه (فالشكل الكامل يفضل سليم)، وبعدين نعمل <b>sift down</b>: نقارنه بأولاده، ونبدله بالـ<b>أصغر</b> فيهم لو كان أكبر منه، ونكرر لتحت. لازم نبدل مع الأصغر من الاتنين، لأنه هيبقى أب للتاني فلازم يبقى أصغر منه. التكلفة O(log n).</p>",
      code: {
        lang: "text",
        title: "extract the min from [1, 3, 2, 7, 4, 5, 6]",
        src: `step 0   save the root: answer = 1
step 1   move the last element (6) to the root, shrink
         [6, 3, 2, 7, 4, 5]               i = 0
step 2   children of 0: index 1 (3) and 2 (2)
         the smaller is 2; 6 > 2, swap
         [2, 3, 6, 7, 4, 5]               i = 2
step 3   children of 2: index 5 (5) and 6 (none)
         5 < 6, swap
         [2, 3, 5, 7, 4, 6]               i = 5
step 4   index 5 has no children: stop
result   answer 1, heap [2, 3, 5, 7, 4, 6]`,
        note: "لو بدلنا مع الأكبر (3 مثلا) كان الـ 3 هيبقى أب للـ 2 والقاعدة تتكسر. وكمان لازم نتأكد إن الـ index لسه جوه الـ array (<code>&lt; n</code>) قبل ما نقرا الأولاد.",
      },
      pitfall: "أخطاء الـ sift down: (1) التبديل مع الولد الشمال دايما بدل الأصغر، (2) نسيان فحص إن الولد اليمين موجود، (3) نسيان حالة الـ heap اللي فيه عنصر واحد (الشيل بيسيبها فاضية، متكتبش <code>_a[0] = last</code> وهي فاضية).",
    },
    {
      title: "التكلفة، وبناء heap من array في O(n)",
      en: "Costs and building a heap in O(n)",
      code: {
        lang: "text",
        src: `Operation              Cost       Why
peek min/max           O(1)       it is a[0]
insert                 O(log n)   sift up at most height levels
extract min/max        O(log n)   sift down at most height levels
build from n items     O(n)       bottom-up heapify (see below)
build by n inserts     O(n log n) each insert may climb
search a value         O(n)       siblings are not ordered
remove arbitrary item  O(n)       find it first, then O(log n)
height                 floor(log2 n)   because the tree is complete`,
        note: "الـ heap بتكسب في «الأصغر دلوقتي» وبتخسر في أي حاجة محتاجة بحث أو ترتيب كامل.",
      },
      body: "<p><b>بناء heap من n عنصر:</b> أبسط طريقة n إدراج = O(n log n). لكن فيه طريقة أسرع: حط العناصر في array زي ما هي، وابدأ من آخر node ليها أولاد (index <code>n ~/ 2 - 1</code>) وروح لورا لحد 0 وعمل <b>sift down</b> لكل واحدة. النتيجة <b>O(n)</b> مش O(n log n).</p><p><b>الحدس:</b> حوالي نص الـ nodes leaves، ومفيش ليها شغل. ربع الـ nodes على المستوى اللي فوقهم بيتحركوا خطوة واحدة على الأكتر، والثمن اللي بعده خطوتين، وهكذا. يعني الشغل المجموع هو n × (0·½ + 1·¼ + 2·⅛ + ...) والمجموع ده بيقارب ثابت، فالكل O(n). السبب إن عدد الـ nodes اللي بتتحرك مسافة كبيرة قليل جدا.</p>",
      interview: [
        { q: "ليه بناء heap من array بيكون O(n) مش O(n log n)؟", a: "بنعمل sift down لكل node ليها أولاد من الأخيرة للأولى. الـ node على ارتفاع h بتتحرك h خطوات على الأكتر، وعدد الـ nodes على الارتفاع ده حوالي <code>n / 2^(h+1)</code>. فالشغل المجموع هو مجموع <code>h × n / 2^(h+1)</code> وده متسلسلة بتتقارب لـ O(n). الحدس: نص الـ nodes leaves ومبتتحركش، وقليل جدا هو اللي بيتحرك مسافة كبيرة. الطريقة البديلة (n إدراج) هي O(n log n)." },
        { q: "ليه البحث عن قيمة جوه الـ heap O(n)؟", a: "لأن القاعدة بين الأب والأولاد بس، والإخوة مش مرتبين. لو القيمة اللي بدور عليها أكبر من الأب مقدرش أعرف أروح شمال ولا يمين، فمضطر أفحص الاتنين. فالـ heap مش بتنفع للبحث. لو محتاج بحث وترتيب مع بعض استخدم BST متوازنة (SplayTreeMap في Dart)." },
      ],
    },
    {
      title: "نكتب MinHeap بإيدينا",
      en: "Implementing a MinHeap",
      body: "<p>الكلاس generic بياخد <code>compare</code> زي <code>sort</code>: دالة بترجع سالب لو الأول <b>أولى</b> يطلع قبل التاني. بكده نفس الكلاس بيعمل min-heap أو max-heap (بعكس الـ comparator) أو heap على objects.</p>",
      code: {
        lang: "dart",
        src: `class MinHeap<T> {
  final List<T> _a = [];
  final int Function(T, T) _cmp;

  MinHeap(this._cmp);

  // O(n) build: heapify from the last parent up to the root
  MinHeap.from(Iterable<T> items, this._cmp) {
    _a.addAll(items);
    for (var i = _a.length ~/ 2 - 1; i >= 0; i--) {
      _siftDown(i);
    }
  }

  int get length => _a.length;
  bool get isEmpty => _a.isEmpty;

  T get first {
    if (_a.isEmpty) throw StateError('empty heap');
    return _a[0];
  }

  List<T> toList() => List.of(_a);

  void add(T v) {
    _a.add(v);
    _siftUp(_a.length - 1);
  }

  T removeFirst() {
    if (_a.isEmpty) throw StateError('empty heap');
    final top = _a[0];
    final last = _a.removeLast();
    if (_a.isNotEmpty) {
      _a[0] = last;
      _siftDown(0);
    }
    return top;
  }

  void _siftUp(int i) {
    while (i > 0) {
      final p = (i - 1) ~/ 2;
      if (_cmp(_a[i], _a[p]) >= 0) break;
      _swap(i, p);
      i = p;
    }
  }

  void _siftDown(int i) {
    final n = _a.length;
    while (true) {
      var best = i;
      final l = 2 * i + 1;
      final r = 2 * i + 2;
      if (l < n && _cmp(_a[l], _a[best]) < 0) best = l;
      if (r < n && _cmp(_a[r], _a[best]) < 0) best = r;
      if (best == i) return;
      _swap(i, best);
      i = best;
    }
  }

  void _swap(int i, int j) {
    final t = _a[i];
    _a[i] = _a[j];
    _a[j] = t;
  }
}

void main() {
  final h = MinHeap<int>((a, b) => a.compareTo(b));
  for (final x in [2, 5, 3, 9, 6]) {
    h.add(x);
  }
  h.add(1);
  print(h.toList());          // [1, 5, 2, 9, 6, 3]  (the insert trace)
  print(h.removeFirst());     // 1
  print(h.first);             // 2
  print(h.length);            // 5

  final b = MinHeap<int>.from([1, 3, 2, 7, 4, 5, 6], (a, b) => a - b);
  print(b.removeFirst());     // 1
  print(b.toList());          // [2, 3, 5, 7, 4, 6]  (the extract trace)

  final maxHeap = MinHeap<int>((a, b) => b.compareTo(a));
  maxHeap.add(4);
  maxHeap.add(10);
  maxHeap.add(7);
  print(maxHeap.removeFirst());   // 10: reversed comparator = max-heap

  final empty = MinHeap<int>((a, b) => a.compareTo(b));
  try {
    empty.removeFirst();
  } on StateError catch (e) {
    print(e.message);         // empty heap
  }
}`,
        note: "الـ <code>toList()</code> بترجع ترتيب الـ array الداخلي مش sorted، ولاحظ إنه نفس نتيجة الـ trace اللي فوق بالظبط. الشيء المضمون هو القاعدة بس. <code>removeFirst</code> بتحمي حالة الـ heap اللي فيه عنصر واحد: بعد <code>removeLast</code> الـ array فاضية فمنكتبش في <code>_a[0]</code>.",
      },
      interview: [
        { q: "اكتب MinHeap. إيه العمليات الأساسية وتكلفتها؟", a: "array جواها والـ comparator. <code>add</code>: بضيف في الآخر وبعمل sift up (أقارن مع الأب <code>(i-1)~/2</code> وأبدل لو أصغر). <code>removeFirst</code>: بحفظ الـ root، وآخر عنصر ينقل للـ root، وبعمل sift down بالتبديل مع أصغر ولد لحد ما القاعدة تتحقق (مع الانتباه لحالة العنصر الواحد). <code>first</code> هو <code>a[0]</code>. add و removeFirst هم O(log n)، و first هو O(1)، والـ build من n عنصر O(n) بـ sift down من آخر parent لورا." },
      ],
    },
    {
      title: "min-heap مقابل max-heap، و PriorityQueue في Dart",
      en: "Min vs max heap, and Dart's PriorityQueue",
      body: "<p>الفرق مجرد <b>اتجاه المقارنة</b>. تقدر تعمل max-heap بعكس الـ comparator (<code>(a, b) =&gt; b.compareTo(a)</code>) أو بتخزين <code>-x</code>. الاختيار: تحتاج الأصغر؟ min-heap. تحتاج الأكبر؟ max-heap. وفي مسائل «أكبر K عناصر» هنستخدم min-heap حجمه K (هنشوف ليه).</p><p>Dart نفسها مفيهاش heap في <code>dart:core</code> ولا <code>dart:collection</code>. اللي موجود هو <code>PriorityQueue</code> في package اسمه <code>collection</code> (من فريق Dart): لازم تضيفه في <code>pubspec.yaml</code> تحت <code>dependencies</code> وتعمل <code>import 'package:collection/collection.dart';</code>. بيشتغل زي اللي كتبناه: <code>add</code> و<code>removeFirst</code> و<code>first</code>، وبياخد comparator اختياري (الافتراضي ترتيب طبيعي، يعني min-heap).</p>",
      code: {
        lang: "dart",
        title: "needs collection in pubspec.yaml",
        src: `import 'package:collection/collection.dart';

void main() {
  final minQ = PriorityQueue<int>();            // natural order
  minQ.addAll([5, 1, 4]);
  print(minQ.first);                            // 1
  print(minQ.removeFirst());                    // 1
  print(minQ.length);                           // 2

  final maxQ = PriorityQueue<int>((a, b) => b.compareTo(a));
  maxQ.addAll([5, 1, 4]);
  print(maxQ.removeFirst());                    // 5

  // a task queue: lowest number = most urgent
  final tasks = PriorityQueue<(int, String)>(
    (a, b) => a.$1.compareTo(b.$1),
  );
  tasks.add((3, 'email'));
  tasks.add((1, 'call'));
  print(tasks.removeFirst().$2);                // call
}`,
        note: "لا تعتمد على ترتيب <code>toList()</code> أو التكرار على الـ <code>PriorityQueue</code> (مش مضمون إنه sorted). الطريقة الصحيحة لتفريغها بالترتيب هي <code>removeFirst</code> في loop.",
      },
      pitfall: "الـ <code>PriorityQueue</code> مش stable: عنصرين بنفس الأولوية ممكن يطلعوا بأي ترتيب. لو محتاج FIFO بين المتساويين، ضيف رقم تسلسلي كمعيار تاني في الـ comparator.",
      interview: [
        { q: "هل Dart فيها priority queue جاهزة؟ إزاي تعمل max-heap؟", a: "مش في المكتبة الأساسية. فيه <code>PriorityQueue</code> في package <code>collection</code> بيتضاف في pubspec، وبياخد comparator. الافتراضي min-heap، ولعمل max-heap بعكس المقارنة: <code>PriorityQueue&lt;int&gt;((a, b) =&gt; b.compareTo(a))</code>. وفي الإنترفيو المتوقع إنك تكتب الـ sift up و sift down بنفسك لأنهم بيختبروا فهمك للهيكل." },
      ],
    },
    {
      title: "حالات الاستخدام، و heap sort",
      en: "Use cases and heap sort",
      body: "<p><b>فين بتستخدم:</b> (1) <b>جدولة المهام</b> حسب الأولوية أو الموعد (OS scheduler، timers). (2) <b>Dijkstra</b> و A*: كل مرة محتاج أقرب node لسه مزرتهاش. (3) <b>Top-K</b>: أكبر K قيمة من stream كبير من غير ما تخزنه كله. (4) <b>دمج K مصادر مرتبة</b>. (5) <b>الـ median الجاري</b> بـ heapين. (6) محاكاة أحداث (event simulation).</p><p><b>Heap sort:</b> ابني max-heap من الـ array (O(n)) في مكانها، وبعدين كرر: بدّل الـ root (الأكبر) مع آخر عنصر في الجزء اللي لسه heap، قلّل حجم الـ heap بواحد، وأعمل sift down للـ root. الأكبر بيستقر في آخر الـ array، وفي النهاية الـ array كلها مرتبة. O(n log n) في كل الحالات، ومساحة O(1) إضافية (in-place)، لكنها مش stable، وعمليا الـ quicksort الحديثة أسرع بسبب الـ cache.</p>",
      code: {
        lang: "dart",
        src: `void siftDown(List<int> a, int i, int n) {
  while (true) {
    var big = i;
    final l = 2 * i + 1;
    final r = 2 * i + 2;
    if (l < n && a[l] > a[big]) big = l;
    if (r < n && a[r] > a[big]) big = r;
    if (big == i) return;
    final t = a[i];
    a[i] = a[big];
    a[big] = t;
    i = big;
  }
}

void heapSort(List<int> a) {
  final n = a.length;
  for (var i = n ~/ 2 - 1; i >= 0; i--) {
    siftDown(a, i, n);               // build a max-heap in O(n)
  }
  for (var end = n - 1; end > 0; end--) {
    final t = a[0];
    a[0] = a[end];                   // the max goes to its final place
    a[end] = t;
    siftDown(a, 0, end);             // the heap is now a[0 .. end)
  }
}

void main() {
  final xs = [5, 2, 9, 1, 5, 6];
  heapSort(xs);
  print(xs);                         // [1, 2, 5, 5, 6, 9]
  final one = [7];
  heapSort(one);
  print(one);                        // [7]
  final none = <int>[];
  heapSort(none);
  print(none);                       // []
  final dup = [3, 3, 3, 1];
  heapSort(dup);
  print(dup);                        // [1, 3, 3, 3]
}`,
        note: "هنا استخدمنا max-heap لأن الأكبر لازم يروح آخر الـ array. الجزء الأول (build) O(n)، والتاني n مرة sift down بـ O(log n) فالمجموع O(n log n).",
      },
      interview: [
        { q: "إزاي بيشتغل heap sort؟ وإيه مميزاته وعيوبه؟", a: "بابني max-heap من الـ array في مكانها (O(n))، وبعدين n-1 مرة بدّل الـ root (الأكبر) مع آخر عنصر في الجزء الـ heap وبصغّر الـ heap بواحد وأعمل sift down. الأكبر بيستقر في مكانه الأخير. الميزة: O(n log n) مضمونة حتى في أسوأ حالة، ومساحة O(1). العيوب: مش stable، وسيئة مع الـ cache فعمليا أبطأ من quicksort و merge sort في أغلب الحالات." },
      ],
    },
    {
      title: "مسائل كلاسيك (1): أكبر K عناصر، والأكتر تكرارا",
      en: "Top-K problems",
      body: "<p>الفكرة المعاكسة اللي بتتوه الناس: لأكبر K عناصر بنستخدم <b>min-heap</b> حجمه K، مش max-heap. الـ root بتاعها هو أصغر واحد في «أكبر K لحد دلوقتي». أي عنصر جديد أكبر من الـ root يستحق مكانه: نشيل الـ root ونضيفه. في النهاية الـ heap فيها أكبر K. الزمن O(n log K) والمساحة O(K)، وده أحسن من sort كامل O(n log n) لما K صغير، وبيشتغل على stream.</p><p>الأكتر تكرارا: نعد بـ Map، وبعدين نفس الحيلة بـ min-heap حجمه K على الـ <b>counts</b>.</p>",
      code: {
        lang: "dart",
        title: "assumes the MinHeap class from the previous slides",
        src: `List<int> kLargest(List<int> nums, int k) {
  if (k <= 0) return [];
  final heap = MinHeap<int>((a, b) => a.compareTo(b));
  for (final x in nums) {
    if (heap.length < k) {
      heap.add(x);
    } else if (x > heap.first) {
      heap.removeFirst();          // drop the smallest of the top k
      heap.add(x);
    }
  }
  final out = <int>[];
  while (!heap.isEmpty) {
    out.add(heap.removeFirst());
  }
  return out.reversed.toList();    // largest first
}

List<int> topKFrequent(List<int> nums, int k) {
  final counts = <int, int>{};
  for (final x in nums) {
    counts[x] = (counts[x] ?? 0) + 1;
  }
  final heap = MinHeap<MapEntry<int, int>>(
    (a, b) => a.value.compareTo(b.value),
  );
  for (final e in counts.entries) {
    heap.add(e);
    if (heap.length > k) heap.removeFirst();   // evict the least frequent
  }
  final out = <int>[];
  while (!heap.isEmpty) {
    out.add(heap.removeFirst().key);
  }
  return out.reversed.toList();
}

void main() {
  print(kLargest([3, 1, 5, 12, 2, 11], 3));   // [12, 11, 5]
  print(kLargest([4, 4, 4], 2));              // [4, 4]
  print(kLargest([1, 2], 5));                 // [2, 1]
  print(kLargest([], 3));                     // []
  print(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // [1, 2]
  print(topKFrequent([7], 1));                // [7]
}`,
        note: "في <code>kLargest</code> التكرار مسموح (القيم المتساوية بتتعد كل واحدة). لو K أكبر من الطول بتاخد كل العناصر. الزمن O(n log K) والمساحة O(K).",
      },
      pitfall: "استخدام max-heap لأكبر K بيخليك تحتاج heap حجمه n (O(n) مساحة و O(n log n) زمن). الحيلة هي min-heap صغير: بيطرد أصغر واحد كل مرة.",
      interview: [
        { q: "لاقي أكبر K عناصر في array. ليه min-heap مش max-heap؟", a: "باحتفظ بـ min-heap حجمه K. لكل عنصر: لو الـ heap لسه أقل من K أضيفه، وإلا لو العنصر أكبر من الـ root (أصغر واحد من أكبر K الحاليين) أشيل الـ root وأضيف العنصر. الـ root بتقولي مين اللي يتطرد أول. الزمن O(n log K) والمساحة O(K)، وبيشتغل على stream مش لازم أخزنه كله. Max-heap كانت هتحتاجني أبني heap بكل n عنصر. وبالنسبة للأكتر تكرارا بعد قبل بـ Map وبعدين نفس الفكرة على الـ counts." },
      ],
    },
    {
      title: "مسائل كلاسيك (2): دمج K قوايم، و median جاري",
      en: "Merge k sorted lists and the running median",
      body: "<p><b>دمج K قوايم مرتبة:</b> نحط في min-heap أول عنصر من كل قايمة (مع رقم القايمة ومكانه فيها). نشيل الأصغر ونحطه في الناتج، وبعدين نضيف العنصر التالي من نفس القايمة. الـ heap حجمها K فكل عنصر من N عنصر بيكلف log K: O(N log K) بدل O(N log N).</p><p><b>Median جاري:</b> عايز تعرف الـ median بعد كل رقم جديد. فكرة <b>heapين</b>: max-heap فيها النص الأصغر، min-heap فيها النص الأكبر، بحجمين متقاربين (الأولى أكبر بواحد على الأكتر). الـ median هو الـ root بتاعها أو متوسط الـ rootين. الإضافة O(log n) والـ median O(1).</p>",
      code: {
        lang: "dart",
        title: "assumes the MinHeap class from the previous slides",
        src: `List<int> mergeK(List<List<int>> lists) {
  // entries: (value, which list, index inside that list)
  final heap = MinHeap<(int, int, int)>((a, b) => a.$1.compareTo(b.$1));
  for (var i = 0; i < lists.length; i++) {
    if (lists[i].isNotEmpty) heap.add((lists[i][0], i, 0));
  }
  final out = <int>[];
  while (!heap.isEmpty) {
    final (v, li, idx) = heap.removeFirst();
    out.add(v);
    if (idx + 1 < lists[li].length) {
      heap.add((lists[li][idx + 1], li, idx + 1));
    }
  }
  return out;
}

class MedianFinder {
  final MinHeap<int> _low = MinHeap<int>((a, b) => b.compareTo(a));
  final MinHeap<int> _high = MinHeap<int>((a, b) => a.compareTo(b));

  void add(int x) {
    if (_low.isEmpty || x <= _low.first) {
      _low.add(x);
    } else {
      _high.add(x);
    }
    if (_low.length > _high.length + 1) {
      _high.add(_low.removeFirst());
    } else if (_high.length > _low.length) {
      _low.add(_high.removeFirst());
    }
  }

  double median() {
    if (_low.isEmpty) throw StateError('no numbers yet');
    if (_low.length > _high.length) return _low.first.toDouble();
    return (_low.first + _high.first) / 2;
  }
}

void main() {
  print(mergeK([[1, 4, 5], [1, 3, 4], [2, 6]]));  // [1, 1, 2, 3, 4, 4, 5, 6]
  print(mergeK([[], [3], []]));                   // [3]
  print(mergeK([]));                              // []

  final m = MedianFinder();
  for (final x in [5, 2, 8, 1]) {
    m.add(x);
    print(m.median());   // 5.0, 3.5, 5.0, 3.5
  }
}`,
        note: "لو القوايم linked lists بدل <code>List</code> الفكرة نفسها: الـ heap بتشيل الـ node الحالية لكل قايمة، وكل ما تطلع واحدة بتضيف <code>node.next</code>. ملاحظة: الـ median الأولى 5.0 (عنصر واحد)، والتانية (2+5)/2 = 3.5.",
      },
      interview: [
        { q: "ادمج K قوايم مرتبة. وإيه التكلفة؟", a: "بحط في min-heap أول عنصر من كل قايمة مع هويتها ومكانه. بشيل الأصغر وأضيفه للناتج وأضيف العنصر اللي بعده من نفس القايمة. الـ heap مش بتكبر عن K فكل خطوة log K، وعدد الخطوات N (مجموع العناصر) فالتكلفة O(N log K) والمساحة O(K). الدمج واحدة واحدة (قايمتين في المرة) هيكلف O(N·K) في أسوأ حالة." },
        { q: "إزاي تحسب الـ median لـ stream من الأرقام؟", a: "بحتفظ بـ heapين: max-heap للنص الأصغر و min-heap للنص الأكبر، وبخلي الفرق في الحجم بينهم لا يزيد عن واحد. الرقم الجديد بيروح لحد منهم حسب مقارنته بـ root الـ max-heap، وبعدين بوازن الحجمين بنقل root. الـ median هو root الأكبر حجما أو متوسط الـ rootين. الإضافة O(log n) والقراءة O(1)، بدل ما أرتب كل مرة O(n log n)." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: معادلات الـ index",
      lang: "dart",
      code: `int parent(int i) => (i - 1) ~/ 2;
int left(int i) => 2 * i + 1;
int right(int i) => 2 * i + 2;

void swap(List<int> a, int i, int j) {
  final t = a[i];
  a[i] = a[j];
  a[j] = t;
}`,
    },
    {
      title: "اكتب: إدراج في min-heap (sift up)",
      lang: "dart",
      code: `void heapAdd(List<int> a, int v) {
  a.add(v);
  var i = a.length - 1;
  while (i > 0) {
    final p = (i - 1) ~/ 2;
    if (a[p] <= a[i]) break;
    swap(a, i, p);
    i = p;
  }
}`,
      note: "محتاج دالة swap من الدريل اللي فات.",
    },
    {
      title: "اكتب: إخراج الأصغر (sift down)",
      lang: "dart",
      code: `int heapPop(List<int> a) {
  final top = a.first;
  final last = a.removeLast();
  if (a.isEmpty) return top;
  a[0] = last;
  var i = 0;
  while (true) {
    var m = i;
    final l = 2 * i + 1, r = 2 * i + 2;
    if (l < a.length && a[l] < a[m]) m = l;
    if (r < a.length && a[r] < a[m]) m = r;
    if (m == i) return top;
    swap(a, i, m);
    i = m;
  }
}`,
    },
  ],

  tasks: [
    {
      title: "MinHeap من الصفر",
      lang: "dart",
      prompt: "<p>اكتب كلاس <code>MinHeap</code> للأرقام الصحيحة بدون أي package. العمليات: <code>add(int)</code>، و<code>removeFirst()</code> بترجع الأصغر وتشيله وبترمي <code>StateError</code> لو فاضي، و<code>first</code> بترجع الأصغر من غير شيل، و<code>length</code> و<code>isEmpty</code>. استخدم array داخلية والـ sift up / sift down. add و removeFirst لازم يكونوا O(log n).</p>",
      examples: [
        { in: "add 5, 2, 8, 1 ثم removeFirst ثلاث مرات", out: "1, 2, 5" },
        { in: "heap فيها عنصر واحد، removeFirst", out: "العنصر، والـ heap بقت فاضية" },
      ],
      starter: `class MinHeap {
  final List<int> _a = [];

  int get length => _a.length;
  bool get isEmpty => _a.isEmpty;

  int get first {
    // your code
  }

  void add(int v) {
    // your code
  }

  int removeFirst() {
    // your code
  }
}`,
      hints: [
        "الأب <code>(i-1) ~/ 2</code> والأولاد <code>2i+1</code> و<code>2i+2</code>. add: ضيف في الآخر وطلّع لفوق طول ما أصغر من أبوه.",
        "removeFirst: احفظ <code>_a[0]</code>، شيل آخر عنصر وحطه في الـ 0 (لو لسه فيه عناصر)، ونزّله بالتبديل مع أصغر ولد.",
      ],
      solution: `class MinHeap {
  final List<int> _a = [];

  int get length => _a.length;
  bool get isEmpty => _a.isEmpty;

  int get first {
    if (_a.isEmpty) throw StateError('empty heap');
    return _a[0];
  }

  void add(int v) {
    _a.add(v);
    var i = _a.length - 1;
    while (i > 0) {
      final p = (i - 1) ~/ 2;
      if (_a[p] <= _a[i]) break;
      _swap(i, p);
      i = p;
    }
  }

  int removeFirst() {
    if (_a.isEmpty) throw StateError('empty heap');
    final top = _a[0];
    final last = _a.removeLast();
    if (_a.isNotEmpty) {
      _a[0] = last;
      var i = 0;
      while (true) {
        var m = i;
        final l = 2 * i + 1;
        final r = 2 * i + 2;
        if (l < _a.length && _a[l] < _a[m]) m = l;
        if (r < _a.length && _a[r] < _a[m]) m = r;
        if (m == i) break;
        _swap(i, m);
        i = m;
      }
    }
    return top;
  }

  void _swap(int i, int j) {
    final t = _a[i];
    _a[i] = _a[j];
    _a[j] = t;
  }
}`,
      explain: "كل من add و removeFirst بيتحرك على طول ارتفاع الشجرة الكاملة (log n). الحالة الحدية: لما الـ heap فيها عنصر واحد، <code>removeLast</code> بيشيله وبتبقى فاضية فمنكتبش في <code>_a[0]</code>. لازم نختار أصغر ولد في sift down، ونتأكد إن الـ index جوه الـ array.",
    },
    {
      title: "أكبر K عناصر",
      lang: "dart",
      prompt: "<p>افترض إن عندك كلاس <code>MinHeap&lt;int&gt;</code> بالشكل: <code>MinHeap&lt;int&gt;((a, b) =&gt; a.compareTo(b))</code> و<code>add</code> و<code>removeFirst</code> و<code>first</code> و<code>length</code> و<code>isEmpty</code>. اكتب <code>List&lt;int&gt; kLargest(List&lt;int&gt; nums, int k)</code> بترجع أكبر k قيمة مرتبة من الأكبر للأصغر في O(n log k) ومساحة O(k). لو k أقل من 1 رجع قايمة فاضية، ولو أكبر من الطول رجع الكل.</p>",
      examples: [
        { in: "[3, 1, 5, 12, 2, 11], k = 3", out: "[12, 11, 5]" },
        { in: "[4, 4, 4], k = 2", out: "[4, 4]" },
        { in: "[], k = 3", out: "[]" },
      ],
      starter: `List<int> kLargest(List<int> nums, int k) {
  // your code
}`,
      hints: [
        "استخدم min-heap حجمه k مش max-heap. الـ root فيها هي أصغر واحد من «أكبر k لحد دلوقتي».",
        "لو العنصر أكبر من <code>heap.first</code> (والـ heap ممتلية) شيل الـ root وضيف العنصر. في الآخر فرّغها واعكس الترتيب.",
      ],
      solution: `List<int> kLargest(List<int> nums, int k) {
  if (k <= 0) return [];
  final heap = MinHeap<int>((a, b) => a.compareTo(b));
  for (final x in nums) {
    if (heap.length < k) {
      heap.add(x);
    } else if (x > heap.first) {
      heap.removeFirst();
      heap.add(x);
    }
  }
  final out = <int>[];
  while (!heap.isEmpty) {
    out.add(heap.removeFirst());
  }
  return out.reversed.toList();
}`,
      explain: "كل عنصر بيكلف log k على الأكتر فالمجموع O(n log k). المساحة O(k). الـ heap بتطلع من الأصغر للأكبر فبنعكس القايمة في الآخر. حالة <code>k &lt;= 0</code> لازم تتفحص لأن <code>heap.first</code> هترمي على heap فاضية.",
    },
    {
      title: "دمج K قوايم مرتبة",
      lang: "dart",
      prompt: "<p>افترض نفس <code>MinHeap&lt;T&gt;</code> (بتاخد comparator). اكتب <code>List&lt;int&gt; mergeK(List&lt;List&lt;int&gt;&gt; lists)</code> بتاخد K قايمة مرتبة تصاعديا (بعضها ممكن يبقى فاضي) وترجع قايمة واحدة مرتبة فيها كل العناصر. التكلفة المطلوبة O(N log K) حيث N مجموع العناصر. تلميح: الـ record <code>(int, int, int)</code> بيشيل (القيمة، رقم القايمة، مكانها).</p>",
      examples: [
        { in: "[[1, 4, 5], [1, 3, 4], [2, 6]]", out: "[1, 1, 2, 3, 4, 4, 5, 6]" },
        { in: "[[], [3], []]", out: "[3]" },
        { in: "[]", out: "[]" },
      ],
      starter: `List<int> mergeK(List<List<int>> lists) {
  // your code
}`,
      hints: [
        "ابدأ بإضافة أول عنصر من كل قايمة مش فاضية في الـ heap، مع رقم القايمة ومكان العنصر.",
        "كل مرة شيل الأصغر، ضيفه للناتج، وضيف العنصر اللي بعده من نفس القايمة (لو موجود).",
      ],
      solution: `List<int> mergeK(List<List<int>> lists) {
  final heap = MinHeap<(int, int, int)>((a, b) => a.$1.compareTo(b.$1));
  for (var i = 0; i < lists.length; i++) {
    if (lists[i].isNotEmpty) heap.add((lists[i][0], i, 0));
  }
  final out = <int>[];
  while (!heap.isEmpty) {
    final (v, li, idx) = heap.removeFirst();
    out.add(v);
    if (idx + 1 < lists[li].length) {
      heap.add((lists[li][idx + 1], li, idx + 1));
    }
  }
  return out;
}`,
      explain: "الـ heap فيها عنصر واحد على الأكتر من كل قايمة، فحجمها K وكل عملية log K. N عنصر × log K = O(N log K). مساحة إضافية O(K) غير الناتج. القوايم الفاضية بتتخطى في الأول فمفيش حالة خاصة بعد كده.",
    },
  ],

  quiz: [
    {
      q: "في heap مخزنة في array (0-based)، index الأب للـ node اللي في index 7؟",
      answer: ["3", "٣"],
      why: "الأب = <code>(7 - 1) ~/ 2 = 3</code>. والعكس: أولاد index 3 هم 7 و 8.",
    },
    {
      q: "في min-heap مخزنة في array (0-based)، أولاد الـ node اللي في index 2 هم في أنهي indexes؟",
      options: ["1 و 2", "4 و 5", "5 و 6", "3 و 4"],
      answer: 2,
      why: "الولد الشمال <code>2·2+1 = 5</code> واليمين <code>2·2+2 = 6</code>. الاختيار «3 و 4» هم أولاد index 1.",
    },
    {
      q: "تكلفة إخراج الأصغر من min-heap فيها n عنصر؟",
      options: ["O(1)", "O(n)", "O(n log n)", "O(log n)"],
      answer: 3,
      why: "القراءة O(1) لكن الإخراج بيحتاج sift down على طول الارتفاع (log n). الـ O(1) هي تكلفة <code>first</code> بس.",
    },
    {
      q: "بناء heap من array فيها n عنصر بـ heapify (sift down من آخر parent لـ 0) تكلفته؟",
      options: ["O(n)", "O(n log n)", "O(log n)", "O(n²)"],
      answer: 0,
      why: "نص الـ nodes leaves ومبتتحركش، وقليلين بس هم اللي بيتحركوا مسافة كبيرة، فالمجموع O(n). n إدراج منفصلين هما اللي بـ O(n log n).",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final h = MinHeap<int>((a, b) => a.compareTo(b));
for (final x in [5, 3, 8, 1]) {
  h.add(x);
}
h.removeFirst();
print(h.first);` },
      answer: ["3", "٣"],
      why: "removeFirst بتشيل الأصغر (1) فالأصغر الجديد هو 3.",
    },
    {
      q: "عايز أكبر 3 قيم من stream ضخم من غير ما تخزنه كله. إيه الأنسب؟",
      options: [
        "ترتب الـ stream كله وتاخد آخر 3",
        "min-heap حجمه 3: لو الرقم الجديد أكبر من الـ root تشيل الـ root وتضيفه",
        "max-heap فيها كل الأرقام",
        "تدور على الأكبر 3 مرات بمسح خطي",
      ],
      answer: 1,
      why: "الـ min-heap بحجم K بيحتفظ بأكبر K لحد دلوقتي والـ root هو اللي يتطرد. مساحة O(K) وزمن O(n log K). الباقي بيحتاج تخزين كل الـ stream أو مرور متكرر.",
    },
    {
      q: "إيه اللي بيخلي heap sort مش مفضلة عادة على quicksort رغم إنها O(n log n) مضمونة؟",
      options: [
        "مساحتها O(n)",
        "مش بتشتغل على بيانات مكررة",
        "بتقفز في الذاكرة (parent/children بعيدين) فالـ cache بيشتغل أسوأ، ومش stable",
        "مش in-place",
      ],
      answer: 2,
      why: "Heap sort in-place (مساحة O(1)) وبتشتغل على التكرار. عيبها العملي قفزات الـ index وعدم الـ stability.",
    },
    {
      q: "فين تلاقي <code>PriorityQueue</code> في Dart؟",
      options: [
        "في <code>dart:core</code> جاهزة",
        "في <code>dart:collection</code> جاهزة",
        "في package اسمه <code>collection</code> بتضيفه في pubspec",
        "مفيش في Dart خالص",
      ],
      answer: 2,
      why: "<code>PriorityQueue</code> جزء من <code>package:collection</code> (مش من SDK الأساسي)، فتحتاج dependency و import. وفي الإنترفيو غالبا هيطلبوا تكتبها بنفسك.",
    },
    {
      q: "ضفنا 1 على min-heap الحالية <code>[2, 5, 3, 9, 6]</code> (sift up). شكل الـ array النهائي؟",
      answer: ["[1, 5, 2, 9, 6, 3]", "[1,5,2,9,6,3]"],
      why: "الـ 1 تتحط في index 5، أبوها index 2 (القيمة 3) فتتبدل، وبعدين أبوها index 0 (القيمة 2) فتتبدل أيضا فتبقى في الـ root.",
    },
    {
      q: "عايز تدور على قيمة معينة جوه min-heap. تكلفة ده؟",
      options: [
        "O(log n) لأنها شجرة",
        "O(n) لأن الإخوة مش مرتبين فمفيش طريقة نستبعد بيها نص الشجرة",
        "O(1) لأن الـ array بتدعم الوصول المباشر",
        "O(n log n)",
      ],
      answer: 1,
      why: "القاعدة بتربط الأب بالأولاد بس. من غير ترتيب بين الشمال واليمين لازم تفحص الاتنين. للبحث استخدم Map أو شجرة BST.",
    },
  ],
};
