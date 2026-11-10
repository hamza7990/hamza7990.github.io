window.LEVELS = window.LEVELS || {};
window.LEVELS["ds/s4"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "الـ Queue: الدور بالترتيب",
      en: "Why queues",
      body: "<p>الـ queue زي طابور في البنك: أول واحد وصل هو أول واحد يتخدم. اسمها <b>FIFO</b>: First In, First Out. أي وقت عندك شغل مستني دوره (طلبات، رسايل، مهام، خطوات في خوارزمية BFS) بتحتاج queue.</p><p>الفخ اللي بيقع فيه الناس: بناء queue على <code>List</code> وسحب العنصر الأول بـ <code>removeAt(0)</code>، وده O(n). في المستوى ده هنفهم ليه، ونبني queue بـ circular buffer بإيدينا، ونبنيها من stackين، ونشوف الـ <code>Queue</code> الجاهزة في Dart، ونتعامل مع الـ deque (queue من الطرفين) ونحل مسألة sliding window maximum.</p>",
      points: [
        "<b>enqueue</b> بيضيف في الآخر (back/tail)، <b>dequeue</b> بيشيل من الأول (front/head).",
        "الهدف: الاتنين <code>O(1)</code>. ده بيحتاج هيكل بيوصل للطرفين، مش List بسيطة.",
        "<b>الـ deque</b> (double-ended queue) بتضيف وتشيل من الطرفين الاتنين.",
      ],
    },
    {
      title: "الشكل والتكلفة، وليه removeAt(0) غالية",
      en: "FIFO and why removeAt(0) is O(n)",
      code: {
        lang: "text",
        src: `enqueue(10) enqueue(20) enqueue(30)        dequeue() -> 10

front                          back          front            back
  v                             v              v                v
[ 10 ][ 20 ][ 30 ]                           [ 20 ][ 30 ]

On a plain List the front element lives at index 0.
removeAt(0) must slide every remaining element one slot left:

before: [10][20][30][40][50]
after:  [20][30][40][50]       <- 4 elements moved for 1 removal`,
        note: "لو عندك 100 ألف عنصر، كل dequeue بيحرك 100 ألف عنصر. تفريغ الـ queue كلها بالطريقة دي حوالي 5 مليار حركة (O(n²)). الحل إننا مش نحرك العناصر، نحرك مؤشر الـ front.",
      },
      points: [
        "<code>list.add(x)</code> للـ enqueue رخيصة، <code>list.removeAt(0)</code> للـ dequeue غالية O(n) لأنها بتزحزح الباقي.",
        "حل ساذج: متشيلش العنصر، حرك <code>head</code> index. لكن المساحة اللي قبل الـ head بتفضل محجوزة ومبتتنضفش.",
        "الحل الحقيقي: <b>circular buffer</b> (الشريحة الجاية)، أو linked list فيها head و tail.",
      ],
      interview: [
        { q: "ليه استخدام List.removeAt(0) في بناء queue فكرة سيئة؟", a: "لأن List عناصرها متجاورة في array، فمسح العنصر الأول بيزحزح كل العناصر اللي بعده خطوة، يعني O(n) لكل dequeue. على queue كبيرة تفريغها كلها O(n²). البدائل: circular buffer (أو <code>Queue</code> من dart:collection) فيها dequeue بـ O(1) لأنها بتحرك مؤشر الـ head بدل ما تحرك العناصر، أو linked list بـ head و tail." },
      ],
    },
    {
      title: "Circular buffer: الـ array اللي بتلف",
      en: "Circular buffer implementation",
      body: "<p>الفكرة: array حجمها ثابت و<code>head</code> (مكان أول عنصر) و<code>size</code> (عدد العناصر). مكان الإضافة الجاية هو <code>(head + size) % capacity</code>. الـ <code>%</code> هي اللي بتخلي الـ index يرجع للصفر لما يوصل للآخر، فنستغل الخانات الفاضية اللي قدام الـ head.</p>",
      code: {
        lang: "text",
        title: "capacity 5, after a few enqueue and dequeue",
        src: `index:   0    1    2    3    4
       [ 60 ][ 70 ][    ][ 40 ][ 50 ]
                       ^    ^
                       |    head = 3, size = 4
                       next write = (3 + 4) % 5 = 2

order of the queue: 40, 50, 60, 70   (it wraps around the end)
dequeue: head = (3 + 1) % 5 = 4, size = 3`,
        note: "لما الـ array تمتلي (<code>size == capacity</code>) بنعمل grow: نحجز array بضعف الحجم وننسخ العناصر <b>بالترتيب المنطقي</b> (من الـ head) لأول الـ array الجديدة ونصفّر الـ head.",
      },
      codes: [
        {
          lang: "dart",
          src: `class RingQueue<T> {
  List<T?> _data = List.filled(4, null);
  int _head = 0;
  int _size = 0;

  int get length => _size;
  bool get isEmpty => _size == 0;

  void enqueue(T value) {
    if (_size == _data.length) _grow();
    _data[(_head + _size) % _data.length] = value;
    _size++;
  }

  T dequeue() {
    if (_size == 0) throw StateError('empty queue');
    final value = _data[_head] as T;
    _data[_head] = null;
    _head = (_head + 1) % _data.length;
    _size--;
    return value;
  }

  T get peek {
    if (_size == 0) throw StateError('empty queue');
    return _data[_head] as T;
  }

  void _grow() {
    final bigger = List<T?>.filled(_data.length * 2, null);
    for (var i = 0; i < _size; i++) {
      bigger[i] = _data[(_head + i) % _data.length];
    }
    _data = bigger;
    _head = 0;
  }
}

void main() {
  final q = RingQueue<int>();
  for (final n in [1, 2, 3, 4]) {
    q.enqueue(n);
  }
  print(q.dequeue());   // 1
  print(q.dequeue());   // 2
  q.enqueue(5);
  q.enqueue(6);         // wraps around the end of the array
  q.enqueue(7);         // full: grows, keeps the order
  final out = <int>[];
  while (!q.isEmpty) {
    out.add(q.dequeue());
  }
  print(out);           // [3, 4, 5, 6, 7]
}`,
          note: "كل عملية O(1) (الـ enqueue amortized بسبب الـ grow). لاحظ إننا مبننسخش بالترتيب الفيزيائي بل بالمنطقي <code>(head + i) % length</code> وإلا الترتيب هيبوظ بعد الـ wrap.",
        },
      ],
      interview: [
        { q: "إيه هو الـ circular buffer وإزاي بتتنفذ queue عليه؟", a: "array حجمها ثابت مع مؤشر head وعدّاد size. الـ enqueue بتكتب في <code>(head + size) % capacity</code> وتزود size، والـ dequeue بتقرا من head وتحرك <code>head = (head + 1) % capacity</code> وتنقص size. الـ modulo بتخلي الـ index يلف للأول فمنستخدمش مساحة ضايعة. الاتنين O(1) ومن غير ما نحرك العناصر. لو الـ array امتلت، نكبرها بالضعف وننسخ العناصر بالترتيب المنطقي من الـ head." },
      ],
    },
    {
      title: "Queue من stackين",
      en: "Queue with two stacks",
      body: "<p>سؤال إنترفيو كلاسيك: ابني queue باستخدام stackين بس. الفكرة: <code>in</code> لاستقبال الـ enqueue. ولما نيجي نعمل dequeue نسحب من <code>out</code>، ولو فاضية نفرغ كل <code>in</code> فيها. التفريغ بيعكس الترتيب، فأقدم عنصر دخل (اللي كان تحت في in) بيبقى فوق <code>out</code> بالظبط.</p>",
      code: {
        lang: "dart",
        src: `class TwoStackQueue<T> {
  final List<T> _in = [];
  final List<T> _out = [];

  bool get isEmpty => _in.isEmpty && _out.isEmpty;

  void enqueue(T value) => _in.add(value);

  T dequeue() {
    if (_out.isEmpty) {
      while (_in.isNotEmpty) {
        _out.add(_in.removeLast());   // reverses the order
      }
    }
    if (_out.isEmpty) throw StateError('empty queue');
    return _out.removeLast();
  }
}

void main() {
  final q = TwoStackQueue<int>();
  q.enqueue(1);
  q.enqueue(2);
  q.enqueue(3);
  print(q.dequeue());   // 1  (moves 1, 2, 3 to out)
  q.enqueue(4);
  print(q.dequeue());   // 2  (out still has items, no move)
  print(q.dequeue());   // 3
  print(q.dequeue());   // 4  (out empty: moves 4 over)
}`,
        note: "الـ dequeue الواحدة ممكن تكلف O(n) (وقت النقل)، لكن كل عنصر بيتنقل مرة واحدة بس في حياته، فمجموع n عملية O(n): يعني <b>amortized O(1)</b>. الغلطة الشائعة: تنقل من in لـ out حتى لو out مش فاضية، وده بيبوظ الترتيب.",
      },
      interview: [
        { q: "إزاي تبني queue باستخدام stackين؟ وإيه التعقيد؟", a: "stack للإدخال (in) وstack للإخراج (out). الـ enqueue بتعمل push على in. الـ dequeue: لو out فاضية بنفرغ كل in فيها (pop من in و push في out)، وده بيعكس الترتيب فأقدم عنصر بيبقى فوق out، وبعدين بنعمل pop من out. مهم ننقل بس لما out تبقى فاضية. كل عنصر بيتنقل مرة واحدة فالعمليات amortized O(1) رغم إن dequeue معينة ممكن تكون O(n)." },
      ],
    },
    {
      title: "Queue في Dart (dart:collection)",
      en: "Dart Queue and what it is internally",
      body: "<p>Dart فيها <code>Queue&lt;E&gt;</code> في <code>dart:collection</code>. هي في الحقيقة <b>double-ended queue</b>: بتضيف وتشيل من الطرفين. الـ constructor العادي <code>Queue()</code> بيرجع <code>ListQueue</code> اللي هي <b>circular buffer</b> جوه (نفس الفكرة اللي بنيناها)، وفيه نسخة تانية <code>DoubleLinkedQueue</code> مبنية على nodes.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

void main() {
  final q = Queue<int>();
  q.add(1);            // same as addLast
  q.add(2);
  q.addFirst(0);       // deque: add at the front too
  print(q);            // {0, 1, 2}
  print(q.first);      // 0
  print(q.last);       // 2
  print(q.removeFirst());   // 0
  print(q.removeLast());    // 2
  print(q.length);          // 1

  final jobs = Queue<String>.from(['a', 'b']);
  while (jobs.isNotEmpty) {
    print(jobs.removeFirst());   // a, then b
  }

  try {
    jobs.removeFirst();
  } on StateError {
    print('empty queue');
  }
}`,
        note: "<code>add</code> و<code>addFirst</code> و<code>removeFirst</code> و<code>removeLast</code> كلها O(1) (amortized في الإضافة). مفيش <code>q[0]</code> بالـ index كأنها List. بتتطبع بأقواس معقوصة <code>{}</code>. <code>removeFirst</code> على فاضية بترمي <code>StateError</code>.",
      },
      pitfall: "متنساش الـ <code>import 'dart:collection';</code>. من غيره <code>Queue</code> مش معرفة. وفي Flutter نفس الـ import بيشتغل عادي.",
      interview: [
        { q: "إيه الـ Queue الجاهزة في Dart، وهي متنفذة إزاي؟", a: "<code>Queue</code> من <code>dart:collection</code> هي double-ended queue. الـ <code>Queue()</code> الافتراضية بترجع <code>ListQueue</code> المبنية على circular buffer جوه array، فالإضافة والمسح من الطرفين O(1) (amortized في الإضافة بسبب إعادة تخصيص الـ array). فيه كمان <code>DoubleLinkedQueue</code> مبنية على doubly linked list. الاتنين أحسن من <code>List.removeAt(0)</code> للـ queues." },
      ],
    },
    {
      title: "BFS محتاج queue",
      en: "BFS needs a queue",
      body: "<p>الـ BFS (breadth-first search) بيزور الـ graph <b>طبقة طبقة</b>: كل الجيران المباشرين الأول، وبعدين جيرانهم. ده بالظبط سلوك FIFO: اللي اتكتشف أول هو اللي يتزار أول. لو استخدمت stack بدل الـ queue هتبقى DFS (بتنزل عميق الأول).</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

List<String> bfsOrder(Map<String, List<String>> graph, String start) {
  final seen = <String>{start};
  final queue = Queue<String>()..add(start);
  final order = <String>[];
  while (queue.isNotEmpty) {
    final current = queue.removeFirst();
    order.add(current);
    for (final next in graph[current] ?? const <String>[]) {
      if (seen.add(next)) queue.add(next);   // add() is false if seen
    }
  }
  return order;
}

void main() {
  final graph = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['D', 'E'],
    'D': ['F'],
    'E': ['F'],
    'F': <String>[],
  };
  print(bfsOrder(graph, 'A'));   // [A, B, C, D, E, F]
}`,
        note: "بنعلّم الـ node بأنها شوفت <b>وقت ما نحطها في الـ queue</b> مش وقت ما نسحبها، عشان نفس الـ node متتحطش مرتين (D بتيجي من B وC). الـ BFS بيلاقي أقصر طريق (بعدد الخطوات) في graph من غير أوزان. هنفصله في مستوى الـ graphs.",
      },
      interview: [
        { q: "ليه الـ BFS بيستخدم queue والـ DFS بيستخدم stack؟", a: "الـ BFS محتاج يزور الـ nodes بترتيب اكتشافها، الأقرب الأول، وده FIFO فبيستخدم queue. الـ DFS محتاج يكمل في آخر فرع اتفتح ويرجع لما يخلص، وده LIFO فبيستخدم stack (أو الـ recursion اللي هي الـ call stack). نتيجة كده BFS بيلاقي أقصر مسار بعدد الـ edges في graph من غير أوزان." },
      ],
    },
    {
      title: "Deque و Sliding Window Maximum",
      en: "Deque and the sliding window maximum",
      body: "<p>مطلوب: لكل نافذة بطول k على مصفوفة، أكبر قيمة فيها. الغاشم: لكل نافذة ندور على الأكبر، O(n × k). الحل بـ <b>deque من الـ indexes</b> قيمها متناقصة: الأكبر دايما في الأمام. عند عنصر جديد: (1) نشيل من الأمام أي index خرج برة النافذة. (2) نشيل من الخلف أي index قيمته <b>أصغر أو تساوي</b> الجديد (عمره ملوش لازمة: الجديد أكبر ويعيش أطول). (3) نضيف الجديد في الخلف. (4) الإجابة هي القيمة عند الأمام.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

List<int> maxSliding(List<int> nums, int k) {
  if (k <= 0 || nums.isEmpty) return [];
  final window = Queue<int>();   // indexes, values decreasing
  final out = <int>[];
  for (var i = 0; i < nums.length; i++) {
    if (window.isNotEmpty && window.first <= i - k) {
      window.removeFirst();      // slid out of the window
    }
    while (window.isNotEmpty && nums[window.last] <= nums[i]) {
      window.removeLast();       // can never be a maximum again
    }
    window.addLast(i);
    if (i >= k - 1) out.add(nums[window.first]);
  }
  return out;
}

void main() {
  print(maxSliding([1, 3, -1, -3, 5, 3, 6, 7], 3));
  // [3, 3, 5, 5, 6, 7]
  print(maxSliding([4, 2], 1));    // [4, 2]
  print(maxSliding([9, 9, 9], 2)); // [9, 9]
  print(maxSliding([1], 3));       // []
}`,
        note: "كل index بيدخل الـ deque مرة ويخرج مرة، فالمجموع <b>O(n)</b> زمن، والمساحة O(k). ده نفس منطق الـ monotonic stack، بس بيشيل من الطرفين لأن النافذة بتنزلق.",
      },
      points: [
        "نخزن الـ <b>indexes</b> مش القيم، عشان نعرف إمتى العنصر خرج من النافذة.",
        "استخدمنا <code>&lt;=</code> في الشيل من الخلف عشان القيم المتساوية: نحتفظ بالأحدث لأنه يعيش أطول.",
      ],
      interview: [
        { q: "حل Sliding Window Maximum في O(n).", a: "بستخدم deque من الـ indexes قيم عناصرها متناقصة من الأمام للخلف، فالأكبر في الأمام. لكل i: أشيل من الأمام لو الـ index خرج من النافذة (<code>&lt;= i - k</code>)، وأشيل من الخلف كل index قيمته أصغر أو تساوي <code>nums[i]</code>، وبعدين أضيف i في الخلف. لما <code>i &gt;= k - 1</code> بسجل <code>nums[front]</code>. كل index يدخل ويخرج مرة واحدة فالزمن O(n) بدل O(n × k)." },
      ],
    },
    {
      title: "الـ queues في الأنظمة الحقيقية",
      en: "Task and message queues in real systems",
      body: "<p>الـ queue مش بس تمرين، هي أساس معماري:</p>",
      points: [
        "<b>Job queues</b>: في Laravel لما ترسل إيميل أو تعالج صورة، الـ request بيحط job في queue (Redis أو database) وترجع للمستخدم فورا، و worker منفصل بيسحب الـ jobs بالترتيب. بيفصل سرعة الاستجابة عن الشغل التقيل، وبيسمح بإعادة المحاولة.",
        "<b>Message brokers</b> (RabbitMQ و Kafka و SQS): نفس الفكرة بين خدمات مختلفة. المنتج (producer) بيكتب والمستهلك (consumer) بيقرا بمعدل يناسبه، ولو المستهلك وقع الرسايل مستنية.",
        "<b>Backpressure</b>: لو الإنتاج أسرع من الاستهلاك الـ queue بتكبر. لازم حد أقصى للحجم أو استراتيجية (رفض، إسقاط الأقدم).",
        "<b>في Dart نفسها</b>: الـ event loop فيه event queue وmicrotask queue. لما بتكتب <code>Future</code> أو <code>await</code> الكود بيتحط في queue وبيتنفذ بالدور لما الـ main يفضى.",
        "<b>Flutter</b>: طابور رسم الـ frames، وطابور الـ HTTP requests، وطابور الإشعارات.",
      ],
      pitfall: "queue من غير حد أقصى + مستهلك أبطأ من المنتج = الذاكرة بتكبر لحد ما التطبيق يقع. حدد capacity أو راقب طول الـ queue.",
      interview: [
        { q: "ليه بنستخدم queue بين الـ API وعملية تقيلة زي إرسال إيميل؟", a: "عشان نفصل الاستجابة عن الشغل. الـ API بيحط job في queue ويرد فورا، وworker في الخلفية بيسحبها بالترتيب ويعالجها. الفوايد: الـ request سريع، الشغل يتحمل الأعطال ويتعاد بعد الفشل (retry)، وممكن نزود عدد الـ workers وقت الضغط من غير ما نغير الـ API. المقابل: الشغل بقى غير متزامن فالمستخدم مش بياخد النتيجة فورا، ولازم نراقب طول الـ queue." },
      ],
    },
    {
      title: "أخطاء شائعة",
      en: "Pitfalls",
      points: [
        "<b>removeAt(0) على List</b> في loop: O(n²). استخدم <code>Queue</code>.",
        "<b>تعديل الـ queue وإنت بتلف عليها بـ for-in</b> بيرمي <code>ConcurrentModificationError</code>. استخدم <code>while (q.isNotEmpty) { q.removeFirst(); ... }</code>.",
        "<b>removeFirst على فاضية</b> بيرمي <code>StateError</code>. افحص <code>isNotEmpty</code>.",
        "<b>في الـ BFS:</b> علّم الـ node أنها شوفت وقت الإضافة، مش وقت السحب.",
        "<b>في الـ circular buffer:</b> الفرق بين «فاضية» و«ممتلئة» لما head == tail. عدّاد <code>size</code> بيحلها وبيبسط الكود.",
        "<b>في الـ two stacks:</b> انقل بس لما out تبقى فاضية.",
      ],
      interview: [
        { q: "إيه الفرق بين Queue و Deque و Stack؟ ومتى كل واحد؟", a: "الـ stack LIFO: بتتعامل مع طرف واحد (undo, recursion, أقواس). الـ queue FIFO: بتضيف من طرف وتشيل من الطرف التاني (طوابير مهام، BFS). الـ deque بتضيف وتشيل من الطرفين: بتتصرف كـ stack أو queue حسب حاجتك، وبتتستخدم في sliding window وفي خوارزميات زي 0-1 BFS. في Dart الـ <code>Queue</code> من dart:collection هي deque فعلا." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: استخدام Queue",
      lang: "dart",
      code: `import 'dart:collection';

void main() {
  final jobs = Queue<String>();
  jobs.add('email');
  jobs.add('resize');
  jobs.addFirst('urgent');
  while (jobs.isNotEmpty) {
    print(jobs.removeFirst());
  }
}`,
      note: "الناتج: urgent ثم email ثم resize.",
    },
    {
      title: "اكتب: Queue من stackين",
      lang: "dart",
      code: `class TwoStackQueue<T> {
  final List<T> _in = [];
  final List<T> _out = [];

  void enqueue(T value) => _in.add(value);

  T dequeue() {
    if (_out.isEmpty) {
      while (_in.isNotEmpty) {
        _out.add(_in.removeLast());
      }
    }
    return _out.removeLast();
  }
}`,
    },
    {
      title: "اكتب: قلب الـ circular buffer",
      lang: "dart",
      code: `class Ring {
  final List<int?> _data = List.filled(4, null);
  int _head = 0;
  int _size = 0;

  void enqueue(int v) {
    _data[(_head + _size) % _data.length] = v;
    _size++;
  }

  int dequeue() {
    final v = _data[_head]!;
    _head = (_head + 1) % _data.length;
    _size--;
    return v;
  }
}`,
      note: "من غير فحص الامتلاء والفراغ، ده الجوهر بس.",
    },
  ],

  tasks: [
    {
      title: "Queue بـ stackين",
      lang: "dart",
      prompt: "<p>اكتب كلاس <code>MyQueue</code> فيه: <code>void push(int x)</code> (يضيف في الآخر)، <code>int pop()</code> (يشيل ويرجع الأول)، <code>int peek()</code> (يرجع الأول من غير ما يشيله)، <code>bool get empty</code>. ممنوع تستخدم غير <code>List</code> كـ stack (<code>add</code> و<code>removeLast</code> و<code>last</code> بس). المطلوب amortized O(1).</p>",
      examples: [
        { in: "push 1, push 2, peek", out: "1" },
        { in: "push 1, push 2, pop, push 3, pop, pop", out: "1, 2, 3" },
        { in: "empty (queue جديدة)", out: "true" },
      ],
      starter: `class MyQueue {
  void push(int x) {
    // your code
  }

  int pop() {
    // your code
  }

  int peek() {
    // your code
  }

  bool get empty {
    // your code
  }
}`,
      hints: [
        "استخدم stackين: واحدة للإدخال وواحدة للإخراج.",
        "اكتب دالة خاصة تنقل من الإدخال للإخراج <b>بس لما الإخراج فاضية</b>، وناديها من pop و peek.",
      ],
      solution: `class MyQueue {
  final List<int> _in = [];
  final List<int> _out = [];

  void push(int x) => _in.add(x);

  void _move() {
    if (_out.isEmpty) {
      while (_in.isNotEmpty) {
        _out.add(_in.removeLast());
      }
    }
  }

  int pop() {
    _move();
    return _out.removeLast();
  }

  int peek() {
    _move();
    return _out.last;
  }

  bool get empty => _in.isEmpty && _out.isEmpty;
}`,
      explain: "كل عنصر بيتنقل من in لـ out مرة واحدة، فالعمليات amortized O(1). النقل بس لما out فاضية هو اللي بيحافظ على الترتيب الصح. <code>empty</code> لازم تفحص الاتنين.",
    },
    {
      title: "Circular queue بسعة ثابتة",
      lang: "dart",
      prompt: "<p>اكتب <code>CircularQueue</code> بسعة ثابتة <code>k</code> (تتحدد في الـ constructor): <code>bool enqueue(int v)</code> (ترجع false لو ممتلئة)، <code>bool dequeue()</code> (ترجع false لو فاضية)، <code>int front()</code> و<code>int rear()</code> (ترجع -1 لو فاضية)، <code>bool get isEmpty</code>، <code>bool get isFull</code>. كله O(1) ومن غير ما تحرك العناصر.</p>",
      examples: [
        { in: "k = 3: enqueue 1, 2, 3 ثم enqueue 4", out: "true, true, true, false" },
        { in: "ثم rear()", out: "3" },
        { in: "dequeue ثم enqueue 4 ثم rear() و front()", out: "4 و 2" },
      ],
      starter: `class CircularQueue {
  CircularQueue(int k) {
    // your code
  }

  bool enqueue(int v) {
    // your code
  }

  bool dequeue() {
    // your code
  }

  int front() {
    // your code
  }

  int rear() {
    // your code
  }

  bool get isEmpty {
    // your code
  }

  bool get isFull {
    // your code
  }
}`,
      hints: [
        "احتفظ بـ array ثابتة و<code>head</code> و<code>size</code>. عدّاد size بيفرق بين الفاضية والممتلئة.",
        "الكتابة في <code>(head + size) % capacity</code>، والـ rear في <code>(head + size - 1) % capacity</code>.",
      ],
      solution: `class CircularQueue {
  final List<int> _data;
  int _head = 0;
  int _size = 0;

  CircularQueue(int k) : _data = List.filled(k, 0);

  bool get isEmpty => _size == 0;
  bool get isFull => _size == _data.length;

  bool enqueue(int v) {
    if (isFull) return false;
    _data[(_head + _size) % _data.length] = v;
    _size++;
    return true;
  }

  bool dequeue() {
    if (isEmpty) return false;
    _head = (_head + 1) % _data.length;
    _size--;
    return true;
  }

  int front() => isEmpty ? -1 : _data[_head];

  int rear() => isEmpty ? -1 : _data[(_head + _size - 1) % _data.length];
}`,
      explain: "الفحص <code>isFull</code> قبل أي <code>%</code> بيحمي من القسمة على صفر لو k = 0. بدون عدّاد size مش هتعرف تفرق بين فاضية وممتلئة لأن head == tail في الحالتين.",
    },
    {
      title: "أكبر قيمة في كل نافذة",
      lang: "dart",
      prompt: "<p>اكتب <code>List&lt;int&gt; maxSliding(List&lt;int&gt; nums, int k)</code> بترجع أكبر قيمة في كل نافذة متتالية بطول <code>k</code>. لو k أكبر من الطول أو القايمة فاضية رجع <code>[]</code>. المطلوب O(n) باستخدام <code>Queue</code> من dart:collection.</p>",
      examples: [
        { in: "[1, 3, -1, -3, 5, 3, 6, 7], k = 3", out: "[3, 3, 5, 5, 6, 7]" },
        { in: "[4, 2], k = 1", out: "[4, 2]" },
        { in: "[1], k = 3", out: "[]" },
      ],
      starter: `import 'dart:collection';

List<int> maxSliding(List<int> nums, int k) {
  // your code
}`,
      hints: [
        "deque من الـ indexes، قيمها متناقصة من الأمام للخلف.",
        "لكل i: شيل من الأمام لو خرج من النافذة، شيل من الخلف كل اللي قيمته <= الجديد، ضيف i، وسجل الأمام لما <code>i &gt;= k - 1</code>.",
      ],
      solution: `import 'dart:collection';

List<int> maxSliding(List<int> nums, int k) {
  if (k <= 0 || nums.isEmpty) return [];
  final window = Queue<int>();
  final out = <int>[];
  for (var i = 0; i < nums.length; i++) {
    if (window.isNotEmpty && window.first <= i - k) {
      window.removeFirst();
    }
    while (window.isNotEmpty && nums[window.last] <= nums[i]) {
      window.removeLast();
    }
    window.addLast(i);
    if (i >= k - 1) out.add(nums[window.first]);
  }
  return out;
}`,
      explain: "كل index بيدخل ويخرج مرة: O(n). الأمام دايما هو أكبر قيمة في النافذة الحالية. لو k أكبر من الطول الشرط <code>i &gt;= k - 1</code> مبيتحققش أبدا فبترجع [] من غير حالة خاصة.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `import 'dart:collection';

void main() {
  final q = Queue<int>();
  q.add(1);
  q.add(2);
  q.add(3);
  q.removeFirst();
  print(q.first);
}` },
      answer: ["2"],
      why: "الـ queue FIFO: <code>removeFirst</code> شالت 1 (أول داخل)، فالأول دلوقتي 2.",
    },
    {
      q: "ليه <code>list.removeAt(0)</code> بتكلف O(n)؟",
      options: [
        "لأنها بتدور على العنصر بالقيمة الأول",
        "لأنها بتزحزح كل العناصر اللي بعد الأول خطوة لورا",
        "لأنها بتنسخ الـ list كلها لـ list جديدة وتفرغ القديمة",
        "لأنها بترتب الـ list بعد المسح",
      ],
      answer: 1,
      why: "العناصر متجاورة في array، فمسح الخانة 0 يعني نقل كل اللي بعدها. مفيش بحث (الـ index معروف) ومفيش sort.",
    },
    {
      q: "في الـ circular buffer، سعتها capacity والـ head عند 3 وفيها size = 4 وcapacity = 5. أنهي index هيتكتب فيه الـ enqueue الجاي؟",
      options: ["7", "4", "0", "2"],
      answer: 3,
      why: "<code>(head + size) % capacity = (3 + 4) % 5 = 2</code>. الـ modulo بترجع الـ index للأول بعد ما يعدي آخر الـ array.",
    },
    {
      q: "في الـ queue المبنية من stackين، متى ننقل العناصر من in لـ out؟",
      options: [
        "بس لما out تكون فاضية ونحتاج dequeue أو peek",
        "عند كل enqueue",
        "عند كل dequeue، حتى لو out فيها عناصر",
        "لما in تمتلي",
      ],
      answer: 0,
      why: "لو نقلنا وout فيها عناصر بنحط عناصر أحدث تحت الأقدم أو بنبوظ الترتيب. النقل مرة واحدة لكل عنصر هو اللي بيدي amortized O(1).",
    },
    {
      q: "<code>Queue()</code> من dart:collection متنفذة جوه إزاي؟",
      options: [
        "singly linked list من غير tail",
        "<code>List</code> عادية بتستخدم removeAt(0)",
        "<code>ListQueue</code>: circular buffer على array",
        "hash table",
      ],
      answer: 2,
      why: "<code>Queue()</code> بترجع <code>ListQueue</code> اللي هي circular buffer فالإضافة والمسح من الطرفين O(1). مفيش removeAt(0).",
    },
    {
      q: "أنهي هيكل بيحتاجه الـ BFS عشان يزور الـ nodes طبقة طبقة؟",
      options: ["Stack", "Queue", "Min-heap", "Hash set بس"],
      answer: 1,
      why: "الـ BFS بيزور الأقرب الأول بترتيب اكتشافه: FIFO. الـ stack بتديك DFS. الـ Set بنستخدمه كمان لعلامة «اتزار» لكنه مش بيحدد الترتيب.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print(maxSliding([1, 3, -1, -3, 5, 3, 6, 7], 3));` },
      answer: ["[3, 3, 5, 5, 6, 7]", "[3,3,5,5,6,7]"],
      why: "النوافذ: [1,3,-1]=3، [3,-1,-3]=3، [-1,-3,5]=5، [-3,5,3]=5، [5,3,6]=6، [3,6,7]=7.",
    },
    {
      q: "الناتج إيه؟ (كل dequeue بتضيف لـ out)",
      code: { lang: "dart", src: `final q = TwoStackQueue<int>();
final out = <int>[];
q.enqueue(1);
q.enqueue(2);
out.add(q.dequeue());
q.enqueue(3);
out.add(q.dequeue());
out.add(q.dequeue());
print(out);` },
      answer: ["[1, 2, 3]", "[1,2,3]"],
      why: "الـ dequeue الأولى نقلت 1 و2 لـ out وطلعت 1. بعد enqueue(3) الـ out لسه فيها 2 فطلع 2، وبعدين out فاضية فنقلنا 3 وطلع 3.",
    },
    {
      q: "إيه اللي بيحصل لو عملت <code>removeFirst()</code> على <code>Queue</code> فاضية؟",
      options: ["بترجع null", "بترجع 0", "بتتجاهل وبترجع void", "بترمي <code>StateError</code>"],
      answer: 3,
      why: "النوع اللي بيرجع من <code>removeFirst</code> هو E (مش nullable)، فمفيش عنصر يتحط. بترمي StateError، فافحص <code>isNotEmpty</code> الأول.",
    },
    {
      q: "في sliding window maximum بالـ deque، لما يجي عنصر جديد أكبر من آخر index في الـ deque، نعمل إيه؟",
      options: [
        "نشيل الـ index ده من الأمام",
        "نضيف الجديد في الأمام",
        "نشيل الـ index من الخلف (ونكرر) لأنه عمره مش هيبقى الأكبر",
        "نمسح الـ deque كلها دايما",
      ],
      answer: 2,
      why: "الجديد أكبر ويعيش في النافذة أكتر، فالقديم الأصغر مستحيل يبقى maximum. بنشيل من الخلف لحد ما نلاقي أكبر منه، ومش بنمسح الكل لأن اللي أكبر لازم يفضل.",
    },
  ],
};
