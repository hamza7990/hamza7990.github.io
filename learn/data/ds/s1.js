window.LEVELS = window.LEVELS || {};
window.LEVELS["ds/s1"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "المصفوفة هي أساس كل الباقي",
      en: "Why arrays come first",
      body: "<p>أغلب هياكل البيانات اللي هتتعلمها بعد كده (stack, queue, hash table, heap) متبنية من جوه على <b>مصفوفة</b>. فلو فهمت المصفوفة صح، وفهمت ليه عمليات معينة فيها رخيصة وعمليات تانية غالية، الباقي هيبقى منطقي. وفي الإنترفيو أول سؤال غالبا: «إيه الفرق بين array و list؟» و«ليه الإضافة في الآخر O(1) والإضافة في الأول O(n)؟».</p><p>في المستوى ده هنشوف: الذاكرة بتتوزع إزاي، التكلفة والسبب، إزاي الـ list بتكبر، إزاي Dart بتقدمها لك، وهنكتب <code>DynamicArray</code> صغيرة بإيدينا، ونحل مسائل in-place و prefix sums.</p>",
      points: [
        "<b>array</b>: عناصر من نفس النوع في مكان متصل في الذاكرة، حجمها ثابت.",
        "<b>dynamic array</b> (اسمها <code>List</code> في Dart و<code>ArrayList</code> في Java و<code>vector</code> في C++): array جوه بتتبدل بأكبر منها لما تمتلي.",
        "كل تكلفة هنذكرها، هنقولك <b>ليه</b> كده، لأن الإنترفيو بيسأل عن السبب مش الرقم.",
      ],
    },
    {
      title: "الذاكرة: عناصر ورا بعض",
      en: "Contiguous memory and O(1) indexing",
      body: "<p>لما تعمل array من 5 أرقام، النظام بيحجز <b>كتلة واحدة متصلة</b> في الذاكرة، وكل عنصر ليه نفس الحجم. عشان كده الوصول للعنصر رقم <code>i</code> مش محتاج بحث: الجهاز بيحسب العنوان بمعادلة واحدة وبيروح له على طول.</p>",
      code: {
        lang: "text",
        title: "5 integers, each 8 bytes, starting at address 1000",
        src: `index:     0     1     2     3     4
         +-----+-----+-----+-----+-----+
value:   | 10  | 20  | 30  | 40  | 50  |
         +-----+-----+-----+-----+-----+
address: 1000  1008  1016  1024  1032

address of a[i] = start + i * elementSize
a[3] -> 1000 + 3 * 8 = 1024   (one multiplication, one add)`,
        note: "الحساب نفسه بياخد نفس الوقت لو المصفوفة 5 عناصر أو 5 مليون. ده معنى <code>O(1)</code> random access.",
      },
      points: [
        "<b>الـ index بيبدأ من 0</b> لأنه «الإزاحة» (offset) عن أول عنصر، العنصر الأول إزاحته صفر.",
        "<b>cache-friendly</b>: لما تقرا عنصر، الـ CPU بيجيب معاه جيرانه في الـ cache، فالمرور على array بالترتيب سريع جدا في الواقع.",
        "الثمن: لازم الكتلة تكون متصلة، فتكبير المصفوفة مش مجاني (هنشوفه بعد شوية).",
      ],
      interview: [
        { q: "ليه الوصول لعنصر في array بالـ index هو O(1)؟", a: "لأن العناصر متجاورة وكلها بنفس الحجم، فعنوان العنصر رقم i = عنوان البداية + i × حجم العنصر. ده حساب واحد مفيش فيه لف ولا بحث، فالوقت ثابت مهما كبرت المصفوفة. وده بالظبط اللي linked list مش بتقدر تعمله لأن عناصرها مش متجاورة." },
      ],
    },
    {
      title: "تكلفة كل عملية وليه",
      en: "Cost of every operation",
      body: "<p>الجدول ده أهم حاجة في المستوى. اقراه مع السبب، مش كأرقام.</p>",
      code: {
        lang: "text",
        src: `Operation              Cost      Why
a[i] read / write      O(1)      address arithmetic
append at the end      O(1)*     a free slot is waiting (*amortized)
removeLast             O(1)      just shrink the length
insert at the front    O(n)      every element shifts one slot right
insert in the middle   O(n)      the elements after it shift
removeAt(0) / middle   O(n)      the elements after it shift left
search by value        O(n)      no shortcut, scan one by one
search in sorted array O(log n)  binary search (needs a[i] access)`,
        note: "الزحزحة هي سر التكلفة: الكتلة متصلة فمفيش «فاصل» في النص. لو دخلت عنصر في الأول لازم كل اللي بعده يتحرك خطوة عشان يفضي مكان.",
      },
      codes: [
        {
          lang: "text",
          title: "insert 15 at index 1",
          src: `before:  [10][20][30][40]
step 1:  [10][20][30][40][  ]    <- make room (grow if full)
step 2:  [10][20][20][30][40]    <- shift 40, 30, 20 right
step 3:  [10][15][20][30][40]    <- write the new value`,
          note: "بتحرك كل العناصر اللي بعد المكان، وصفر عناصر لو الإدراج في الآخر.",
        },
      ],
      focus: [{ label: "احفظها", text: "الوصول بالـ index والإضافة في الآخر رخيصين. الإدراج أو المسح من الأول أو الوسط بيزحزح العناصر: <code>O(n)</code>. البحث بالقيمة من غير ترتيب: <code>O(n)</code>." }],
    },
    {
      title: "إزاي الـ list بتكبر",
      en: "Capacity doubling and amortized O(1)",
      body: "<p>الـ array الحقيقية حجمها ثابت. فالـ dynamic list بتمسك array جواها بحجم اسمه <b>capacity</b> (السعة)، وعدد العناصر الفعلي اسمه <b>length</b>. طول ما <code>length &lt; capacity</code> الإضافة بتحط العنصر في الخانة الفاضية: O(1). لما تمتلي، بتحجز array <b>أكبر بالضعف</b>، بتنسخ فيها كل العناصر (O(n))، وتكمل.</p><p>ليه الضعف مش «زيادة خانة واحدة»؟ لأن زيادة واحدة معناها نسخ كامل كل إضافة: n إضافة = حوالي n²/2 نسخة. أما الضعف فالنسخ نادر: النسخ بتحصل عند 1 و2 و4 و8... فمجموع كل النسخ حوالي <code>2n</code>، يعني في المتوسط <b>نسخة واحدة أو اتنين لكل إضافة</b>. ده معنى <b>amortized O(1)</b>: عملية واحدة ممكن تبقى غالية، لكن متوسط التكلفة على سلسلة عمليات ثابت.</p>",
      code: {
        lang: "dart",
        title: "simulate 1000 appends with doubling",
        src: `void main() {
  var capacity = 1;
  var length = 0;
  var copies = 0;
  for (var i = 0; i < 1000; i++) {
    if (length == capacity) {
      copies += length;   // copy everything into a bigger block
      capacity *= 2;
    }
    length++;
  }
  print(capacity);   // 1024
  print(copies);     // 1023 (1 + 2 + 4 + ... + 512)
}`,
        note: "ألف إضافة كلفت 1023 نسخة بس، أقل من نسخة لكل إضافة. ولو كنا بنزود خانة واحدة كانت النسخ هتبقى حوالي نص مليون. (الـ VM بتاعت Dart بتكبّر بنسبة قريبة من الضعف، والرقم بالظبط تفصيلة داخلية متعتمدش عليها.)",
      },
      pitfall: "O(1) amortized مش معناها إن كل عملية سريعة. الإضافة اللي بتفجر النسخة بتاخد O(n) فعلا. في تطبيق real-time ممكن تحس بتقطيعة، والحل لو عارف الحجم مقدما إنك تحجزه من الأول.",
      interview: [
        { q: "يعني إيه amortized O(1) في إضافة عنصر لـ dynamic array؟", a: "يعني لو عملت n إضافة ورا بعض، مجموع الشغل O(n)، فالمتوسط لكل إضافة ثابت. أغلب الإضافات بتحط العنصر في خانة فاضية، وكل فترة بتحصل إضافة واحدة غالية بتنسخ كل العناصر لـ array بضعف الحجم. بما إن الحجم بيتضاعف، النسخ الغالية بتبقى متباعدة أكتر وأكتر ومجموعها حوالي 2n. لو كنا بنزود خانة واحدة بس كل مرة كان هيبقى O(n) لكل إضافة." },
      ],
    },
    {
      title: "الـ List في Dart",
      en: "Dart List: growable, fixed-length, generate, sublist",
      body: "<p>الـ <code>List</code> في Dart هي dynamic array. فيه أشكال لازم تفرقها:</p>",
      code: {
        lang: "dart",
        src: `void main() {
  final fixed = List<int>.filled(3, 0);
  fixed[0] = 9;
  print(fixed);                   // [9, 0, 0]
  try {
    fixed.add(1);
  } on UnsupportedError {
    print('fixed length: no add');
  }

  final squares = List.generate(5, (i) => i * i);
  squares.add(100);               // generate is growable by default
  print(squares);                 // [0, 1, 4, 9, 16, 100]

  final part = squares.sublist(1, 4);   // copy of [1, 4)
  part[0] = -1;
  print(part);                    // [-1, 4, 9]
  print(squares[1]);              // 1: the original is untouched

  const frozen = [1, 2];
  try {
    frozen.add(3);
  } on UnsupportedError {
    print('const list: read only');
  }
}`,
        note: "<code>[]</code> و<code>List.generate</code> و<code>toList()</code> growable. <code>List.filled(n, v)</code> طولها ثابت إلا لو مررت <code>growable: true</code>. الـ <code>const</code> list مقفولة تماما.",
      },
      points: [
        "<code>sublist(a, b)</code> بتعمل <b>نسخة</b> O(b - a). لو عايز عرض من غير نسخة فيه <code>getRange(a, b)</code> وهي iterable كسولة.",
        "<code>add</code> و<code>removeLast</code> رخاص. <code>insert(0, x)</code> و<code>removeAt(0)</code> بيزحزحوا: O(n).",
        "<code>contains</code> و<code>indexOf</code> بيمسحوا القايمة: O(n).",
      ],
      interview: [
        { q: "إيه الفرق بين growable list و fixed-length list في Dart؟", a: "الـ growable (الافتراضية في <code>[]</code> و<code>List.generate</code> و<code>toList()</code>) تقدر تعمل لها <code>add</code> و<code>insert</code> و<code>remove</code> وطولها بيتغير. الـ fixed-length (زي <code>List.filled(3, 0)</code> من غير growable) تقدر تغير قيم عناصرها بس، وأي <code>add</code> أو <code>removeLast</code> بيرمي <code>UnsupportedError</code>. الـ fixed أخف شوية ومناسبة لما تعرف الحجم مقدما." },
      ],
    },
    {
      title: "فخ List.filled و القوائم ثنائية الأبعاد",
      en: "The shared-reference trap and 2D lists",
      body: "<p><code>List.filled(n, value)</code> بتحط <b>نفس الـ value</b> في كل الخانات. مع الأرقام والنصوص ده عادي لأنها immutable، لكن لو الـ value هي object أو list، كل الخانات بتشاور على <b>نفس الـ object</b>. عدّل في واحدة تتغير في كل الخانات. ده أشهر bug في الـ grids (جداول 2D).</p>",
      codes: [
        {
          lang: "dart",
          title: "wrong: one inner list shared by every row",
          src: `void main() {
  final bad = List.filled(3, <int>[]);
  bad[0].add(1);
  print(bad);      // [[1], [1], [1]]
}`,
        },
        {
          lang: "dart",
          title: "right: generate builds a new list per row",
          src: `void main() {
  final good = List.generate(3, (_) => <int>[]);
  good[0].add(1);
  print(good);     // [[1], [], []]

  final grid = List.generate(2, (_) => List.filled(3, 0));
  grid[1][2] = 7;
  print(grid);     // [[0, 0, 0], [0, 0, 7]]
  print(grid.length);      // 2 rows
  print(grid[0].length);   // 3 columns
}`,
          note: "الـ callback بتاع <code>generate</code> بيتنده مرة لكل صف، فكل صف list جديدة. الصف الداخلي <code>List.filled(3, 0)</code> سليم لأن 0 رقم immutable.",
        },
      ],
      focus: [{ label: "القاعدة", text: "لو الـ value اللي هتحطها mutable (list, map, object) استخدم <code>List.generate</code>. <code>List.filled</code> للأرقام والنصوص والـ bool بس." }],
      interview: [
        { q: "عملت grid بـ List.filled(3, List.filled(3, 0)) وغيرت خانة واحدة فاتغير عمود كامل. ليه؟", a: "لأن <code>List.filled</code> بتقيّم القيمة الأولى مرة واحدة وتحط نفس الـ reference في كل الصفوف، فالصفوف التلاتة هي list واحدة. الحل: <code>List.generate(3, (_) =&gt; List.filled(3, 0))</code> عشان الـ callback يتنده لكل صف ويبني list جديدة." },
      ],
    },
    {
      title: "خوارزميات in-place",
      en: "In-place algorithms: reverse, rotate, remove duplicates",
      body: "<p>الـ <b>in-place</b> معناه تعدل المصفوفة نفسها بمساحة إضافية ثابتة O(1)، من غير ما تبني نسخة. الإنترفيو بيحب ده. الأداتين الأساسيتين: السواب (swap) بين مكانين، وطريقة المؤشرين (two pointers).</p>",
      code: {
        lang: "dart",
        src: `void reverseRange(List<int> a, int from, int to) {
  while (from < to) {
    final t = a[from];
    a[from] = a[to];
    a[to] = t;
    from++;
    to--;
  }
}

// Rotate right by k using three reversals: O(n) time, O(1) space.
void rotate(List<int> a, int k) {
  if (a.isEmpty) return;
  k %= a.length;
  reverseRange(a, 0, a.length - 1);
  reverseRange(a, 0, k - 1);
  reverseRange(a, k, a.length - 1);
}

// Sorted input: keep the first of each value. Returns the new length.
int removeDuplicates(List<int> a) {
  if (a.isEmpty) return 0;
  var write = 1;
  for (var read = 1; read < a.length; read++) {
    if (a[read] != a[write - 1]) {
      a[write] = a[read];
      write++;
    }
  }
  return write;
}

void main() {
  final r = [1, 2, 3, 4, 5];
  rotate(r, 2);
  print(r);                       // [4, 5, 1, 2, 3]

  final d = [1, 1, 2, 2, 2, 3];
  final n = removeDuplicates(d);
  print(n);                       // 3
  print(d.sublist(0, n));         // [1, 2, 3]
}`,
        note: "الدوران: اعكس الكل ثم اعكس أول k ثم اعكس الباقي. في removeDuplicates مؤشر <code>read</code> بيجري وراه <code>write</code> بيكتب. الدالة بترجع الطول الجديد، وباقي المصفوفة بعده بيتجاهل (أو <code>removeRange</code>).",
      },
      pitfall: "نسيان <code>k %= a.length</code> في rotate. لو k أكبر من الطول هتعدي حدود المصفوفة، ولو القايمة فاضية القسمة على صفر. افحص الفاضية الأول.",
      interview: [
        { q: "اعمل rotate لـ array بمقدار k من غير مساحة إضافية.", a: "بعمل <code>k %= n</code> وبعدين ثلاث عمليات reverse: أعكس المصفوفة كلها، وبعدين أعكس أول k عنصر، وبعدين أعكس الباقي. مثلا [1,2,3,4,5] و k=2: بعد العكس [5,4,3,2,1]، بعد عكس أول 2 [4,5,3,2,1]، بعد عكس الباقي [4,5,1,2,3]. الوقت O(n) والمساحة O(1). الحل البسيط بنسخة جديدة O(n) مساحة." },
        { q: "إزاي تشيل التكرار من sorted array in-place؟", a: "بمؤشرين: <code>read</code> بيمشي على كل العناصر و<code>write</code> بيشاور على أول مكان فاضي للكتابة. لو العنصر الحالي مختلف عن آخر عنصر اتكتب (<code>a[write-1]</code>) بنكتبه ونزود write. في الآخر write هو الطول الجديد. O(n) زمن و O(1) مساحة، وبيشتغل لأن التكرارات في المرتب متجاورة." },
      ],
    },
    {
      title: "Prefix sums: مجموع أي نطاق في O(1)",
      en: "Prefix sums",
      body: "<p>لو هتسأل كتير «مجموع العناصر من l لـ r» على نفس المصفوفة، حساب كل مرة بلف O(n). الحل: تحسب مرة واحدة مصفوفة <b>prefix</b> فيها <code>prefix[i]</code> = مجموع أول i عناصر. بعدها أي مجموع نطاق هو طرح رقمين.</p>",
      code: {
        lang: "dart",
        src: `class RangeSum {
  final List<int> _prefix;

  RangeSum(List<int> a) : _prefix = List.filled(a.length + 1, 0) {
    for (var i = 0; i < a.length; i++) {
      _prefix[i + 1] = _prefix[i] + a[i];
    }
  }

  // sum of a[l..r], both ends included
  int sum(int l, int r) => _prefix[r + 1] - _prefix[l];
}

void main() {
  final rs = RangeSum([2, 4, 6, 8, 10]);
  print(rs.sum(1, 3));   // 18  (4 + 6 + 8)
  print(rs.sum(0, 4));   // 30
  print(rs.sum(2, 2));   // 6
}`,
        note: "المصفوفة prefix فيها <code>[0, 2, 6, 12, 20, 30]</code>. بنزود خانة صفر في الأول عشان <code>sum(0, r)</code> متحتاجش حالة خاصة. البناء O(n) مرة واحدة، وكل سؤال O(1).",
      },
      points: [
        "الفكرة بتتكرر في مسائل كتير: subarray sum equals k في مستوى الـ hash tables، وحساب المتوسطات المتحركة، والـ 2D prefix sums للصور.",
        "الثمن: مساحة O(n) إضافية. وبتشتغل لو المصفوفة <b>مش بتتغير</b> بين الأسئلة.",
      ],
      interview: [
        { q: "عندك مصفوفة وآلاف الأسئلة «مجموع من l لـ r». إزاي تحلها بسرعة؟", a: "بحسب prefix sums مرة واحدة في O(n): <code>prefix[i+1] = prefix[i] + a[i]</code>، وبعدها كل سؤال هو <code>prefix[r+1] - prefix[l]</code> في O(1). المجموع الكلي O(n + q) بدل O(n × q). لازم المصفوفة متتغيرش، ولو بتتغير بتحتاج Fenwick tree أو segment tree (خارج المستوى ده)." },
      ],
    },
    {
      title: "نبني DynamicArray بإيدينا",
      en: "Implementing a tiny DynamicArray",
      body: "<p>أحسن طريقة تفهم الـ list إنك تبنيها فوق array ثابتة: <code>List.filled</code> هنا بتلعب دور الـ array الخام (مش بنستخدم <code>add</code> أبدا)، وإحنا اللي ندير الـ capacity والزحزحة.</p>",
      code: {
        lang: "dart",
        src: `class DynamicArray<T> {
  List<T?> _data = List.filled(2, null);
  int _length = 0;

  int get length => _length;
  int get capacity => _data.length;

  T operator [](int i) {
    RangeError.checkValidIndex(i, this, 'index', _length);
    return _data[i] as T;
  }

  void add(T value) {
    if (_length == _data.length) _grow();
    _data[_length++] = value;
  }

  void insert(int index, T value) {
    RangeError.checkValueInInterval(index, 0, _length, 'index');
    if (_length == _data.length) _grow();
    for (var i = _length; i > index; i--) {
      _data[i] = _data[i - 1];   // shift right
    }
    _data[index] = value;
    _length++;
  }

  T removeAt(int index) {
    final value = this[index];
    for (var i = index; i < _length - 1; i++) {
      _data[i] = _data[i + 1];   // shift left
    }
    _data[--_length] = null;     // let the old value be collected
    return value;
  }

  void _grow() {
    final bigger = List<T?>.filled(_data.length * 2, null);
    for (var i = 0; i < _length; i++) {
      bigger[i] = _data[i];
    }
    _data = bigger;
  }
}

void main() {
  final a = DynamicArray<String>();
  a.add('a');
  a.add('b');
  a.add('c');            // triggers the first growth
  print(a.capacity);     // 4
  a.insert(1, 'x');
  print(a.removeAt(0));  // a
  print(a[0]);           // x
  print(a.length);       // 3
  try {
    a[10];
  } on RangeError {
    print('out of range');
  }
}`,
        note: "<code>_grow</code> هي النسخة الغالية O(n) وبتحصل نادر. <code>insert</code> و<code>removeAt</code> فيهم اللفة اللي بتزحزح: O(n). بنصفّر الخانة الأخيرة بعد المسح عشان الـ object القديم ميفضلش محجوز. (<code>checkValidIndex</code> محتاجة object عنده <code>length</code>، وإحنا عندنا getter بالاسم ده.)",
      },
      interview: [
        { q: "اكتب dynamic array من الصفر. إيه اللي بيحصل لما تمتلي؟", a: "بحتفظ بـ array خام و<code>length</code> منفصل عن <code>capacity</code>. <code>add</code> بتحط العنصر في <code>data[length]</code> وتزود length. لو length == capacity بنعمل <code>_grow</code>: array جديدة بضعف الحجم، ننسخ العناصر، ونبدل المرجع. ده O(n) لكنه نادر فالإضافة amortized O(1). <code>insert</code> و<code>removeAt</code> بيزحزحوا العناصر فهم O(n)، وبنفحص الـ index ونرمي <code>RangeError</code> لو برة الحدود." },
      ],
    },
    {
      title: "أخطاء شائعة وسؤال الإنترفيو",
      en: "Pitfalls and interview checklist",
      body: "<p>قبل ما تقول «خلصت» في أي سؤال array، اسأل نفسك الأسئلة دي:</p>",
      points: [
        "<b>القايمة فاضية؟</b> عنصر واحد؟ كل العناصر متكررة؟ (<code>a.first</code> على فاضية بترمي <code>StateError</code>.)",
        "<b>تعدّل وإنت بتلف عليها:</b> <code>for (final x in list) list.remove(x)</code> بترمي <code>ConcurrentModificationError</code>. لف على نسخة أو استخدم <code>removeWhere</code>.",
        "<b>off-by-one:</b> الـ index الأخير هو <code>length - 1</code> مش <code>length</code>. وفي <code>sublist(a, b)</code> النهاية b مش داخلة.",
        "<b>الـ reference:</b> <code>final b = a;</code> مش بتنسخ. النسخة هي <code>List.of(a)</code> أو <code>a.toList()</code> (وهي نسخة سطحية shallow: العناصر الـ mutable لسه مشتركة).",
        "<b>الإدراج في الأول جوه لوب:</b> n عملية × O(n) = O(n²). لو محتاج تضيف في الأول كتير فكر في Queue أو اعكس القايمة في الآخر.",
      ],
      pitfall: "<code>list.removeAt(0)</code> جوه while loop لتفريغ القايمة هي O(n²) ومستخدمة كتير بالغلط. لو بتستهلك من الأول استخدم <code>Queue</code> (المستوى s4) أو index بيتحرك.",
    },
  ],

  drills: [
    {
      title: "اكتب: reverseRange",
      lang: "dart",
      code: `void reverseRange(List<int> a, int from, int to) {
  while (from < to) {
    final t = a[from];
    a[from] = a[to];
    a[to] = t;
    from++;
    to--;
  }
}`,
      note: "ده السواب اللي بيتكرر في reverse و rotate.",
    },
    {
      title: "اكتب: grid من غير فخ الـ reference",
      lang: "dart",
      code: `List<List<int>> makeGrid(int rows, int cols) {
  return List.generate(rows, (_) => List.filled(cols, 0));
}

void main() {
  final grid = makeGrid(2, 3);
  grid[1][2] = 7;
  print(grid);
  print(grid.length);
  print(grid[0].length);
}`,
      note: "الناتج [[0, 0, 0], [0, 0, 7]] ثم 2 ثم 3.",
    },
    {
      title: "اكتب: prefix sums",
      lang: "dart",
      code: `List<int> buildPrefix(List<int> a) {
  final prefix = List.filled(a.length + 1, 0);
  for (var i = 0; i < a.length; i++) {
    prefix[i + 1] = prefix[i] + a[i];
  }
  return prefix;
}

int rangeSum(List<int> prefix, int l, int r) {
  return prefix[r + 1] - prefix[l];
}`,
    },
  ],

  tasks: [
    {
      title: "مجموع النطاق بسرعة",
      lang: "dart",
      prompt: "<p>اكتب كلاس <code>RangeSum</code> بـ constructor ياخد <code>List&lt;int&gt;</code>، وميثود <code>int sum(int l, int r)</code> بترجع مجموع العناصر من <code>l</code> لـ <code>r</code> (الاتنين داخلين). كل سؤال لازم يكون O(1).</p>",
      examples: [
        { in: "RangeSum([3, 1, 4, 1, 5]).sum(1, 3)", out: "6" },
        { in: "RangeSum([3, 1, 4, 1, 5]).sum(0, 4)", out: "14" },
        { in: "RangeSum([7]).sum(0, 0)", out: "7" },
      ],
      starter: `class RangeSum {
  RangeSum(List<int> a) {
    // your code
  }

  int sum(int l, int r) {
    // your code
  }
}`,
      hints: [
        "ابني مصفوفة prefix طولها <code>n + 1</code>، وأول خانة فيها صفر.",
        "<code>prefix[i + 1] = prefix[i] + a[i]</code> والنتيجة <code>prefix[r + 1] - prefix[l]</code>.",
      ],
      solution: `class RangeSum {
  final List<int> _prefix;

  RangeSum(List<int> a) : _prefix = List.filled(a.length + 1, 0) {
    for (var i = 0; i < a.length; i++) {
      _prefix[i + 1] = _prefix[i] + a[i];
    }
  }

  int sum(int l, int r) => _prefix[r + 1] - _prefix[l];
}`,
      explain: "البناء O(n) والسؤال O(1). الخانة الصفرية في الأول بتخلي <code>sum(0, r)</code> تشتغل من غير <code>if</code>. الـ initializer list (<code>: _prefix = ...</code>) ضروري عشان الحقل <code>final</code>.",
    },
    {
      title: "شيل التكرار من مصفوفة مرتبة",
      lang: "dart",
      prompt: "<p>اكتب <code>int removeDuplicates(List&lt;int&gt; a)</code> بتاخد مصفوفة <b>مرتبة تصاعديا</b>، وتخلي أول نسخة من كل قيمة في بداية المصفوفة نفسها (in-place، من غير list جديدة) وترجع عدد القيم الفريدة. اللي بعد الطول الجديد مش مهم.</p>",
      examples: [
        { in: "[1, 1, 2]", out: "2  (والمصفوفة تبدأ بـ 1, 2)" },
        { in: "[0, 0, 1, 1, 1, 2, 2, 3]", out: "4  (0, 1, 2, 3)" },
        { in: "[]", out: "0" },
      ],
      starter: `int removeDuplicates(List<int> a) {
  // your code
}`,
      hints: [
        "مؤشرين: <code>read</code> بيمشي على الكل، و<code>write</code> مكان الكتابة الجاي.",
        "قارن <code>a[read]</code> بآخر عنصر اتكتب <code>a[write - 1]</code>، وافتكر القايمة الفاضية.",
      ],
      solution: `int removeDuplicates(List<int> a) {
  if (a.isEmpty) return 0;
  var write = 1;
  for (var read = 1; read < a.length; read++) {
    if (a[read] != a[write - 1]) {
      a[write] = a[read];
      write++;
    }
  }
  return write;
}`,
      explain: "O(n) زمن و O(1) مساحة. بيشتغل بس لأن المصفوفة مرتبة: التكرارات متجاورة. لو مش مرتبة محتاج Set.",
    },
    {
      title: "Rotate array",
      lang: "dart",
      prompt: "<p>اكتب <code>void rotate(List&lt;int&gt; a, int k)</code> بتدور المصفوفة لليمين بمقدار <code>k</code> خانة، in-place بمساحة O(1). <code>k</code> ممكن يكون أكبر من الطول، والمصفوفة ممكن تكون فاضية.</p>",
      examples: [
        { in: "[1, 2, 3, 4, 5], k = 2", out: "[4, 5, 1, 2, 3]" },
        { in: "[1, 2, 3], k = 4", out: "[3, 1, 2]" },
        { in: "[], k = 3", out: "[]" },
      ],
      starter: `void rotate(List<int> a, int k) {
  // your code
}`,
      hints: [
        "قلل k: <code>k %= a.length</code> (بعد فحص الفاضية).",
        "اعكس المصفوفة كلها، وبعدين اعكس أول k، وبعدين اعكس الباقي. اكتب دالة صغيرة تعكس نطاق.",
      ],
      solution: `void rotate(List<int> a, int k) {
  if (a.isEmpty) return;
  k %= a.length;
  void reverseRange(int from, int to) {
    while (from < to) {
      final t = a[from];
      a[from] = a[to];
      a[to] = t;
      from++;
      to--;
    }
  }

  reverseRange(0, a.length - 1);
  reverseRange(0, k - 1);
  reverseRange(k, a.length - 1);
}`,
      explain: "كل عنصر بيتلمس مرتين تقريبا: O(n) وقت و O(1) مساحة. لما k = 0 المرة التانية <code>reverseRange(0, -1)</code> مبتعملش حاجة لأن الشرط <code>from &lt; to</code> بيفشل.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final rows = List.filled(3, <int>[]);
rows[0].add(1);
print(rows);` },
      answer: ["[[1], [1], [1]]", "[[1],[1],[1]]"],
      why: "<code>List.filled</code> حطت نفس الـ list الفاضية في الخانات التلاتة، فالإضافة على واحدة ظاهرة في الكل. الحل <code>List.generate(3, (_) =&gt; &lt;int&gt;[])</code>.",
    },
    {
      q: "ليه <code>a[i]</code> في array هي O(1)؟",
      options: [
        "لأن Dart بتعمل cache لكل عنصر",
        "لأن العناصر مرتبة فالبحث ثنائي",
        "لأن العنوان = البداية + i × حجم العنصر، حساب واحد من غير بحث",
        "لأن كل عنصر ماسك مؤشر للعنصر اللي بعده",
      ],
      answer: 2,
      why: "العناصر متجاورة بنفس الحجم فالموقع بيتحسب مباشرة. الترتيب مش شرط (البحث الثنائي حاجة تانية)، والمؤشرات للعنصر التالي هي linked list.",
    },
    {
      q: "تكلفة <code>list.insert(0, x)</code> على list فيها n عنصر؟",
      options: ["O(n)، بتزحزح كل العناصر خانة", "O(1) لأن الأول مكان معروف", "O(log n)", "O(n²)"],
      answer: 0,
      why: "عشان تفضي الخانة 0 لازم كل n عنصر يتحرك خطوة لقدام. معرفة المكان مش كفاية، المشكلة في الزحزحة مش في الوصول.",
    },
    {
      q: "ليه الـ dynamic array بتضاعف الـ capacity بدل ما تزودها خانة واحدة؟",
      options: [
        "عشان الذاكرة بتتحجز بقوى الـ 2 بس",
        "عشان النسخ الغالية تبقى نادرة ويطلع متوسط الإضافة O(1)",
        "عشان تمنع الـ index من الخروج برة الحدود",
        "عشان الإضافة في الآخر تبقى O(log n)",
      ],
      answer: 1,
      why: "مع الضعف مجموع النسخ لـ n إضافة حوالي 2n. مع زيادة خانة واحدة كل مرة هتنسخ كل العناصر عند كل إضافة (حوالي n²/2 إجمالي).",
    },
    {
      q: "إيه اللي هيحصل هنا؟",
      code: { lang: "dart", src: `final a = List<int>.filled(3, 0);
a.add(5);` },
      options: [
        "a بتبقى [0, 0, 0, 5]",
        "a بتبقى [5, 0, 0]",
        "الـ list بتتحول لـ growable أوتوماتيك",
        "بيرمي <code>UnsupportedError</code> لأن الطول ثابت",
      ],
      answer: 3,
      why: "<code>List.filled</code> من غير <code>growable: true</code> بتدي list طولها ثابت. التعديل على القيم مسموح لكن add و remove بيرموا UnsupportedError.",
    },
    {
      q: "عندك <code>prefix = [0, 2, 6, 12, 20, 30]</code> (للمصفوفة [2, 4, 6, 8, 10]). قيمة <code>prefix[4] - prefix[1]</code> إيه؟",
      answer: ["18"],
      why: "20 - 2 = 18، ودي مجموع العناصر من index 1 لـ 3: 4 + 6 + 8.",
    },
    {
      q: "الناتج إيه؟ (rotate بتدور لليمين)",
      code: { lang: "dart", src: `final a = [1, 2, 3, 4, 5];
rotate(a, 2);
print(a);` },
      options: ["[3, 4, 5, 1, 2]", "[5, 4, 3, 2, 1]", "[4, 5, 1, 2, 3]", "[2, 1, 5, 4, 3]"],
      answer: 2,
      why: "الدوران لليمين بمقدار 2 بيجيب آخر عنصرين للأول: [4, 5, 1, 2, 3]. الاختيار الأول هو الدوران لليسار.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final a = [1, 2, 3, 4];
final b = a.sublist(1, 3);
b[0] = 99;
print(a[1]);` },
      answer: ["2"],
      why: "<code>sublist</code> بتعمل نسخة جديدة، فتعديل b مبيأثرش على a. a[1] لسه 2.",
    },
    {
      q: "عدد القيم الفريدة اللي ترجعها <code>removeDuplicates</code> للمصفوفة المرتبة <code>[1, 1, 2, 2, 3]</code>؟",
      answer: ["3"],
      why: "القيم الفريدة 1 و2 و3، فالدالة بترجع 3 والمصفوفة تبقى تبدأ بـ [1, 2, 3].",
    },
    {
      q: "إيه الأنسب لـ queue فيها 100 ألف مهمة بنسحب منها من الأول؟",
      options: [
        "<code>list.removeAt(0)</code> كل مرة، لأنها بسيطة",
        "<code>Queue</code> من dart:collection أو index بيتحرك، لأن <code>removeAt(0)</code> بتزحزح كل العناصر",
        "<code>list.sort()</code> كل مرة",
        "<code>list.insert(0, x)</code> للإضافة",
      ],
      answer: 1,
      why: "<code>removeAt(0)</code> O(n) فسحب 100 ألف مهمة بيعمل حوالي 5 مليار حركة. <code>Queue</code> بتسحب من الأول O(1).",
    },
  ],
};
