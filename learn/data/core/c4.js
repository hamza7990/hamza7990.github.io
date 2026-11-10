window.LEVELS = window.LEVELS || {};
window.LEVELS["core/c4"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "اختيار الـ data structure هو نص حل المشكلة",
      en: "Why data structures, and Big O in one minute",
      body: "<p>الإنترفيو بيسأل «إيه الفرق بين list و linked list؟» و«ليه الـ Map أسرع من البحث في List؟» مش عشان يعذبك، لكن لأن اختيار هيكل البيانات هو اللي بيحدد هل التطبيق سريع ولا بطيء لما الداتا تكبر. وإنت بتستخدم الهياكل دي كل يوم: <code>List</code> و<code>Map</code> و<code>Set</code>، والـ Navigator في Flutter stack، وشجرة الـ widgets tree.</p><p>لكل هيكل هتعرف 3 حاجات: بيخزن إزاي، تكلفة العمليات (بـ Big O)، وبيظهر فين في تطبيق حقيقي.</p>",
      points: [
        "<b>Big O</b> بتقول إزاي الوقت بيزيد مع حجم الداتا <code>n</code>، مش الثواني بالظبط.",
        "<code>O(1)</code> ثابت، <code>O(log n)</code> يزيد ببطء شديد (مليون عنصر = حوالي 20 خطوة)، <code>O(n)</code> يزيد بنفس النسبة، <code>O(n log n)</code> زي الترتيب الكويس، <code>O(n²)</code> لفة جوه لفة.",
        "بنحسب غالبا <b>average</b> وفي بعض الهياكل <b>worst case</b> بيفرق (هنوضحه).",
      ],
    },
    {
      title: "الـ Array / List",
      en: "Array and dynamic list",
      body: "<p>الـ array بيخزن العناصر <b>جنب بعض في الذاكرة</b>، فالوصول لأي عنصر بالرقم (index) مباشر. الـ <code>List</code> في Dart هي dynamic array: بتكبر لوحدها، وبتضاعف مساحتها لما تمتلي، فالإضافة في الآخر رخيصة في المتوسط.</p>",
      code: {
        lang: "dart",
        src: `void main() {
  final ids = <int>[10, 20, 30];
  print(ids[1]);          // 20      O(1) access by index
  ids.add(40);            //         O(1) amortized
  ids.insert(0, 5);       //         O(n): shifts everything right
  ids.removeAt(0);        //         O(n): shifts everything left
  print(ids.contains(30)); // true   O(n): scans the list
  print(ids);             // [10, 20, 30, 40]
}`,
        note: "الإضافة في الآخر O(1) <b>amortized</b> يعني في المتوسط (أحيانا بتحصل نسخة كاملة لما المساحة تخلص، لكنها نادرة). الإدراج أو المسح من الأول أو الوسط O(n) لأنهم بيزحزحوا باقي العناصر.",
      },
      points: [
        "<b>تستخدمها</b> لقوايم العرض (إعلانات، رسائل)، وأي حاجة بتوصلها بالرقم أو بتلف عليها بالترتيب.",
        "<b>مش مناسبة</b> للبحث المتكرر عن عنصر بقيمته (O(n) كل مرة) ولا للإدخال من الأول.",
      ],
      interview: [
        { q: "إيه الفرق بين array و linked list؟ وإمتى تستخدم كل واحد؟", a: "الـ array عناصره متجاورة في الذاكرة، فالوصول بالـ index هو O(1)، لكن الإدراج أو المسح من الوسط O(n) لأنه بيزحزح العناصر. الـ linked list كل عنصر (node) فيه قيمة ومؤشر للتالي، فالإدراج والمسح عند مكان معروف O(1) من غير زحزحة، لكن الوصول للعنصر رقم k محتاج تمشي عليه من الأول O(k). عمليا الـ array (List) هو الافتراضي في أغلب الحالات لأنه أسرع في الوصول وأوفر في الذاكرة وأحسن في الـ cache، والـ linked list بتظهر لما ببني حاجات زي queue أو LRU cache." },
      ],
    },
    {
      title: "Linked List",
      en: "Linked list: node + next pointer",
      body: "<p>كل عنصر <b>node</b> فيه قيمة ومؤشر <code>next</code> للـ node اللي بعده، والـ node الأخير <code>next</code> بتاعه <code>null</code>. بتمسك أول node (الـ head) وبتمشي منه.</p>",
      code: {
        lang: "dart",
        src: `class Node<T> {
  T value;
  Node<T>? next;
  Node(this.value, [this.next]);
}

void printList(Node<int>? head) {
  var current = head;
  while (current != null) {
    print(current.value);
    current = current.next;
  }
}

void main() {
  final head = Node(1, Node(2, Node(3)));
  printList(head);          // 1, 2, 3 (one per line)
  head.next = head.next!.next;   // remove 2: O(1) once you hold node 1
  printList(head);          // 1, 3
}`,
        note: "الدور في الـ <code>while</code> بيمشي على كل الـ nodes: O(n). مسح node تاني بيحتاج بس نغير مؤشر واحد. لكن عشان توصل للـ node ده لازم تمشي عليه O(n).",
      },
      terms: [
        ["node", "عقدة", "كائن فيه قيمة + مؤشر للعقدة التالية."],
        ["head", "رأس القايمة", "أول node، ومنه بتبدأ أي عملية."],
        ["singly vs doubly", "أحادية أو ثنائية", "الثنائية كل node فيها <code>next</code> و<code>prev</code>، فتقدر تمشي للخلف."],
      ],
      pitfall: "نسيان حالة القايمة الفاضية (<code>head == null</code>) وحالة العنصر الأول والأخير. في أي سؤال linked list، جرب على قايمة فاضية وعنصر واحد قبل ما تقول خلصت.",
    },
    {
      title: "Stack: آخر داخل أول خارج",
      en: "Stack (LIFO)",
      body: "<p>الـ <b>stack</b> زي كوم أطباق: بتحط فوق وبتاخد من فوق. <b>LIFO</b>: Last In First Out. عمليتين أساسيتين <code>push</code> و<code>pop</code> وكلتيهم O(1). في Dart بتتبنى فوق <code>List</code> بسهولة: الإضافة والمسح من الآخر.</p>",
      code: {
        lang: "dart",
        src: `class Stack<T> {
  final List<T> _items = [];

  void push(T value) => _items.add(value);
  T pop() => _items.removeLast();
  T get peek => _items.last;
  bool get isEmpty => _items.isEmpty;
  int get length => _items.length;
}

void main() {
  final s = Stack<int>();
  s.push(1);
  s.push(2);
  s.push(3);
  print(s.pop());   // 3
  print(s.peek);    // 2
  print(s.length);  // 2
}`,
        note: "<code>pop</code> و<code>peek</code> على stack فاضي بيرموا <code>StateError</code>، فافحص <code>isEmpty</code> قبل كده.",
      },
      points: [
        "<b>في التطبيقات</b>: الـ Navigator في Flutter (كل شاشة جديدة <code>push</code> و<code>pop</code> للرجوع)، زر Back في المتصفح، Undo/Redo، call stack بتاع الدوال (وده سبب الـ stack overflow في الـ recursion اللانهائية)، ومطابقة الأقواس.",
      ],
      interview: [
        { q: "إيه الفرق بين stack و queue؟ مثال لكل واحد من تطبيق حقيقي؟", a: "الـ stack LIFO: آخر عنصر دخل هو أول واحد يخرج، زي Navigator في Flutter (الشاشة الأخيرة اللي فتحتها هي اللي بتتقفل لما ترجع)، أو Undo. الـ queue FIFO: أول واحد دخل هو أول واحد يخرج، زي طابور jobs في الـ Laravel (الشغل بيتنفذ بترتيب وصوله)، أو طلبات الطباعة. العمليات الأساسية في الاتنين O(1)." },
      ],
    },
    {
      title: "Queue: أول داخل أول خارج",
      en: "Queue (FIFO)",
      body: "<p>الـ <b>queue</b> زي طابور في بنك. <b>FIFO</b>: <code>enqueue</code> بتضيف من الآخر، و<code>dequeue</code> بتاخد من الأول. الفخ: لو بنيتها على <code>List</code> وعملت <code>removeAt(0)</code> بتبقى O(n) لأن باقي العناصر بتتزحزح.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

class SimpleQueue<T> {
  final List<T> _items = [];

  void enqueue(T value) => _items.add(value);
  T dequeue() => _items.removeAt(0);   // O(n): shifts the rest
  bool get isEmpty => _items.isEmpty;
}

void main() {
  final q = SimpleQueue<String>();
  q.enqueue('a');
  q.enqueue('b');
  print(q.dequeue());   // a

  final fast = Queue<int>();   // from dart:collection, O(1) both ends
  fast.add(1);
  fast.add(2);
  print(fast.removeFirst());   // 1
}`,
        note: "للإنترفيو: اشرح إن <code>removeAt(0)</code> غالية، وإن الحل الجاهز في Dart هو <code>Queue</code> من <code>dart:collection</code> (إضافة وحذف من الطرفين O(1))، أو index للـ head.",
      },
      points: [
        "<b>في التطبيقات</b>: طابور المهام (jobs/queues في Laravel وأي message broker)، طلبات الشبكة المنتظرة، وطابور الطباعة، وخوارزمية BFS (هنشوفها في المستوى الجاي).",
      ],
    },
    {
      title: "Hash Map و Hash Set",
      en: "Hashing and collisions",
      body: "<p>الـ <b>Map</b> بيخزن أزواج مفتاح ← قيمة. الفكرة: دالة <b>hash</b> بتحول المفتاح لرقم، والرقم ده بيحدد أنهي «خانة» (bucket) في array داخلي نخزن فيها. فالبحث عن مفتاح مش بيمشي على كل العناصر: بنحسب الخانة ونروحلها على طول. وده بيدي <b>O(1) في المتوسط</b> للبحث والإضافة والمسح.</p><p>لما مفتاحين مختلفين يطلعوا نفس الخانة ده <b>collision</b>. الحل الشائع: كل خانة بتشيل قايمة صغيرة (chaining)، أو بندور على خانة فاضية تانية. لو الـ collisions كتير الأداء بيقع لـ O(n) في أسوأ حالة، والـ implementation الجيدة بتوسّع الجدول لما يمتلي.</p>",
      code: {
        lang: "dart",
        src: `int bucketOf(String key, int buckets) {
  var sum = 0;
  for (final unit in key.codeUnits) {
    sum += unit;
  }
  return sum % buckets;
}

void main() {
  print(bucketOf('ab', 8));   // 3
  print(bucketOf('ba', 8));   // 3  -> collision with 'ab'

  final prices = <String, int>{'villa': 1500000, 'flat': 600000};
  print(prices['flat']);                 // 600000   O(1) average
  prices['land'] = 900000;
  print(prices.containsKey('office'));   // false

  final seen = <int>{};
  print(seen.add(7));   // true  (new)
  print(seen.add(7));   // false (already there)
}`,
        note: "دالة الـ hash هنا مبسطة جدا لتوضيح الفكرة (جمع أكواد الحروف). الدوال الحقيقية بتوزع أحسن بكتير. <code>Set</code> هو Map من غير قيم: بيجاوب «موجود ولا لأ؟» في O(1)، و<code>add</code> بترجع <code>false</code> لو العنصر كان موجود.",
      },
      points: [
        "<b>في التطبيقات</b>: الـ cache (مفتاح ← نتيجة)، فهرس الإعلانات بالـ id، عد التكرارات، وإزالة التكرار بـ <code>Set</code>. وJSON نفسه خريطة (<code>Map&lt;String, dynamic&gt;</code>).",
        "المفاتيح لازم تكون ثابتة: لو غيرت قيمة object بعد ما حطيته مفتاح، الـ hash بتاعه هيتغير ومش هتلاقيه.",
        "في Dart الـ Map العادية بتحافظ على <b>ترتيب الإضافة</b> عند التكرار عليها.",
      ],
      interview: [
        { q: "إزاي بيشتغل الـ hash map؟ وإيه الـ collision؟", a: "بياخد المفتاح ويمرره على دالة hash تدي رقم، والرقم ده (modulo عدد الخانات) بيحدد الخانة اللي بنخزن فيها. فالبحث بيروح للخانة مباشرة بدل ما يفحص كل العناصر، وده O(1) في المتوسط. الـ collision لما مفتاحين مختلفين يروحوا لنفس الخانة، بيتحل بإن الخانة تشيل قايمة، أو نجرب خانة تانية. ولو الـ collisions كتير الأداء بيتدهور لـ O(n)، عشان كده الجدول بيكبر لما يمتلي ودالة الـ hash لازم توزع كويس." },
      ],
    },
    {
      title: "Tree و Binary Search Tree",
      en: "Trees and BST",
      body: "<p>الـ <b>tree</b> هيكل هرمي: node واحد في القمة (root)، وكل node ليه أبناء (children). في الـ <b>binary tree</b> كل node له ابنين على الأكتر. وفي الـ <b>BST</b> (binary search tree) كل قيمة في الابن الشمال <b>أصغر</b> من الـ node، وفي اليمين <b>أكبر</b>. فالبحث بيقسم الاحتمالات على نصين كل خطوة.</p>",
      code: {
        lang: "dart",
        src: `class TreeNode {
  int value;
  TreeNode? left;
  TreeNode? right;
  TreeNode(this.value);
}

TreeNode insert(TreeNode? root, int value) {
  if (root == null) return TreeNode(value);
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else if (value > root.value) {
    root.right = insert(root.right, value);
  }
  return root;
}

bool contains(TreeNode? root, int value) {
  if (root == null) return false;
  if (value == root.value) return true;
  return value < root.value
      ? contains(root.left, value)
      : contains(root.right, value);
}

void main() {
  TreeNode? root;
  for (final v in [5, 3, 8, 1, 4]) {
    root = insert(root, v);
  }
  print(contains(root, 4));   // true
  print(contains(root, 7));   // false
}`,
        note: "الشجرة هنا: 5 هو الجذر، 3 و8 تحته، و1 و4 تحت 3. البحث عن 4: 5 ← شمال 3 ← يمين 4. لاحظ إن القيم المتكررة بتتجاهل.",
      },
      points: [
        "<b>التكلفة</b>: البحث والإدراج والمسح <code>O(log n)</code> لو الشجرة <b>متوازنة</b>، لكن <code>O(n)</code> لو اتحطت قيم مرتبة (1, 2, 3, 4, 5) لأنها بتتحول لخط (linked list).",
        "الأشجار المتوازنة ذاتيا (AVL و Red-Black) بتحافظ على التوازن تلقائيا. وفي الإنترفيو يكفي إنك تعرف المشكلة والحل.",
        "<b>في التطبيقات</b>: Flutter widget tree و DOM (أشجار عامة مش BST)، شجرة الفولدرات، قواعد البيانات (B-tree للـ index، شفنا ده في مستوى SQL).",
      ],
      interview: [
        { q: "إيه تعقيد البحث في BST؟ وإمتى بيبقى أسوأ حاجة؟", a: "بيتراوح حسب ارتفاع الشجرة h: البحث والإدراج O(h). لو الشجرة متوازنة h حوالي log n فبيبقى O(log n)، ولو الداتا اتحطت مرتبة (1،2،3،4،5) الشجرة بتبقى خط واحد فالارتفاع n والبحث O(n). عشان كده بنستخدم أشجار متوازنة ذاتيا زي AVL و Red-Black، أو B-tree في قواعد البيانات." },
      ],
    },
    {
      title: "Heap / Priority Queue",
      en: "Heap and priority queue",
      body: "<p>الـ <b>priority queue</b> زي الطابور، لكن اللي بيخرج أول هو صاحب <b>أعلى أولوية</b> مش أول واحد دخل (زي طوارئ المستشفى). بتتبنى غالبا بـ <b>heap</b>: شجرة ثنائية شبه كاملة بتتخزن في array عادي، وفيها كل node أصغر من أبنائه (min-heap) فالأصغر دايما في القمة.</p>",
      code: {
        lang: "text",
        title: "min-heap مخزن في array",
        src: `index:  0  1  2  3  4
value:  1  3  2  7  4

        1
      /   \\
     3     2
    / \\
   7   4

children of i: 2*i+1 and 2*i+2
parent of i:   (i-1) ~/ 2`,
        note: "القيمة الأصغر (1) في القمة. إضافة أو سحب الأصغر <code>O(log n)</code> (تعديل مسار واحد في الشجرة)، والاطلاع على الأصغر <code>O(1)</code>.",
      },
      points: [
        "<b>في التطبيقات</b>: جدولة المهام حسب الأولوية، أقرب مكتب لموقعك (أصغر مسافة)، أعلى 10 نتايج (top-K)، وخوارزميات الطرق (Dijkstra).",
        "Dart مفيهاش priority queue جاهزة في المكتبة القياسية. الحزمة الرسمية <code>package:collection</code> فيها <code>PriorityQueue</code>. في الإنترفيو اشرح الفكرة، ولو طلبوا كود هتبني بس push/pop بسيطين.",
      ],
      interview: [
        { q: "إيه الـ priority queue وإزاي تتنفذ؟", a: "queue بيخرج منها العنصر ذو الأولوية الأعلى مش الأقدم. بتتنفذ بـ heap: شجرة ثنائية مخزنة في array وكل node أصغر من أبنائه (min-heap). الإضافة والسحب O(log n) لأنهم بيعدلوا مسار واحد، والاطلاع على الأصغر O(1). استخدامها: جدولة المهام، وأقرب عنصر، وأعلى K عنصر." },
      ],
    },
    {
      title: "Graph: العقد والروابط",
      en: "Graph and adjacency list",
      body: "<p>الـ <b>graph</b> مجموعة نقاط (vertices) بينها روابط (edges). أي شبكة: مدن وطرق، صفحات وروابط، أصحاب وصداقات، شاشات التطبيق والانتقالات بينها (routes). الاتجاه: الرابط ممكن يبقى في اتجاه واحد (directed) أو الاتنين.</p><p>أشهر تمثيل: <b>adjacency list</b>: كل vertex ومعاه قايمة جيرانه. حجمه <code>O(V + E)</code>.</p>",
      code: {
        lang: "dart",
        src: `void main() {
  final Map<String, List<String>> routes = {
    'home': ['search', 'profile'],
    'search': ['details'],
    'details': ['inquiry'],
    'profile': [],
    'inquiry': [],
  };

  print(routes['home']);                     // [search, profile]
  print(routes['search']!.contains('details')); // true
  var edges = 0;
  for (final neighbours in routes.values) {
    edges += neighbours.length;
  }
  print(edges);                              // 4
}`,
        note: "الرسم ده directed: من <code>home</code> نروح <code>search</code> أو <code>profile</code>. لو عايز تعرف الجيران: O(عدد الجيران). التمثيل التاني matrix (جدول V×V) أسرع في «فيه رابط بين A و B؟» لكنه أكبر في الذاكرة (V²).",
      },
      terms: [
        ["vertex / node", "عقدة", "نقطة في الـ graph (شاشة، مدينة، شخص)."],
        ["edge", "رابط", "اتصال بين عقدتين، ممكن يكون باتجاه أو بوزن (مسافة)."],
        ["adjacency list", "قايمة الجيران", "لكل عقدة قايمة العقد المتصلة بيها."],
      ],
      interview: [
        { q: "إزاي تمثل graph في الكود؟", a: "الأشهر adjacency list: Map من كل عقدة لقايمة جيرانها، المساحة O(V+E) ومناسبة للـ graphs الخفيفة (أغلب الحالات)، وبسهولة أمشي على جيران عقدة. البديل adjacency matrix: جدول V×V، التحقق من وجود رابط بين اتنين O(1) لكن المساحة V² فبيناسب الـ graphs الكثيفة بس." },
      ],
    },
    {
      title: "جدول التعقيدات وإزاي تختار",
      en: "Complexity cheat sheet",
      body: "<p>احفظ الجدول ده كسياق، مش كأرقام مجردة. (n = عدد العناصر، avg = في المتوسط.)</p>",
      code: {
        lang: "text",
        src: `Structure        Access    Search    Insert         Delete
Array / List     O(1)      O(n)      O(1) end*      O(n) middle
Linked list      O(n)      O(n)      O(1) at node   O(1) at node
Stack            -         -         push O(1)      pop O(1)
Queue (good)     -         -         enqueue O(1)   dequeue O(1)
Hash map/set     -         O(1) avg  O(1) avg       O(1) avg
BST (balanced)   -         O(log n)  O(log n)       O(log n)
BST (worst)      -         O(n)      O(n)           O(n)
Heap             peek O(1) O(n)      O(log n)       pop O(log n)
Graph (adj list) space O(V + E); neighbours of v: O(degree)
* amortized. O(n) at the start or in the middle (shifting).`,
        note: "الـ O(1) avg في الـ hash map ممكن يبقى O(n) في أسوأ حالة (collisions كتير). وفي linked list الإدراج عند node معروف بس، الوصول للـ node نفسه O(n).",
      },
      focus: [{ label: "القاعدة العملية", text: "محتاج بحث بالقيمة؟ <code>Map</code> أو <code>Set</code>. بالترتيب والـ index؟ <code>List</code>. آخر داخل أول خارج؟ stack. بالدور؟ <code>Queue</code>. أصغر أو أكبر عنصر باستمرار؟ heap. علاقات بين حاجات؟ graph." }],
      interview: [
        { q: "عندك قايمة 100 ألف إعلان وبتبحث عن إعلان بالـ id كتير. تعمل إيه؟", a: "لو بدور في List كل مرة هتبقى O(n) في كل بحث، فبحول الداتا مرة واحدة لـ <code>Map&lt;int, Listing&gt;</code> مفتاحها id، وبكده كل بحث O(1) في المتوسط. تمن التحويل O(n) مرة واحدة والذاكرة الزيادة. ولو القايمة صغيرة أو البحث مرة واحدة، الـ List كفاية." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: Stack على List",
      lang: "dart",
      code: `class Stack<T> {
  final List<T> _items = [];

  void push(T value) => _items.add(value);
  T pop() => _items.removeLast();
  T get peek => _items.last;
  bool get isEmpty => _items.isEmpty;
}`,
    },
    {
      title: "اكتب: Node ومرور على Linked List",
      lang: "dart",
      code: `class Node<T> {
  T value;
  Node<T>? next;
  Node(this.value, [this.next]);
}

int length(Node<int>? head) {
  var count = 0;
  var current = head;
  while (current != null) {
    count++;
    current = current.next;
  }
  return count;
}`,
    },
    {
      title: "اكتب: BST insert و contains",
      lang: "dart",
      code: `class TreeNode {
  int value;
  TreeNode? left;
  TreeNode? right;
  TreeNode(this.value);
}

TreeNode insert(TreeNode? root, int value) {
  if (root == null) return TreeNode(value);
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else if (value > root.value) {
    root.right = insert(root.right, value);
  }
  return root;
}`,
    },
  ],

  tasks: [
    {
      title: "الأقواس المتوازنة",
      lang: "dart",
      prompt: "<p>اكتب دالة <code>bool isBalanced(String s)</code> بترجع <code>true</code> لو كل قوس مفتوح من <code>( [ {</code> ليه قوس إغلاق مطابق بالترتيب الصح. استخدم stack (List).</p>",
      examples: [
        { in: "isBalanced('([]{})')", out: "true" },
        { in: "isBalanced('([)]')", out: "false" },
        { in: "isBalanced('((')", out: "false" },
      ],
      starter: `bool isBalanced(String s) {
  // your code
}`,
      hints: [
        "كل ما تشوف قوس مفتوح، حطه في الـ stack.",
        "كل ما تشوف قوس مقفول، لازم آخر قوس مفتوح (فوق الـ stack) يكون مطابق له. وفي الآخر الـ stack لازم تكون فاضية.",
      ],
      solution: `bool isBalanced(String s) {
  const pairs = {')': '(', ']': '[', '}': '{'};
  final stack = <String>[];
  for (final ch in s.split('')) {
    if (pairs.containsValue(ch)) {
      stack.add(ch);
    } else if (pairs.containsKey(ch)) {
      if (stack.isEmpty || stack.removeLast() != pairs[ch]) {
        return false;
      }
    }
  }
  return stack.isEmpty;
}`,
      explain: "كل قوس بيتدفع مرة وبيتسحب مرة على الأكتر: O(n) وقت، O(n) مساحة. حالات الحافة: stack فاضية وجه قوس إغلاق (<code>')'</code>)، أو نص فيه أقواس مفتوحة زيادة في الآخر (<code>'(('</code>).",
    },
    {
      title: "عكس Linked List",
      lang: "dart",
      prompt: "<p>معاك الكلاس <code>Node&lt;T&gt;</code> (<code>value</code> و<code>next</code>). اكتب <code>Node&lt;int&gt;? reverse(Node&lt;int&gt;? head)</code> بترجع head القايمة بعد عكسها (بتغير المؤشرات، من غير ما تعمل قايمة جديدة).</p>",
      examples: [{ in: "1 -> 2 -> 3", out: "3 -> 2 -> 1" }],
      starter: `class Node<T> {
  T value;
  Node<T>? next;
  Node(this.value, [this.next]);
}

Node<int>? reverse(Node<int>? head) {
  // your code
}`,
      hints: [
        "محتاج مؤشرين: <code>previous</code> (بيبدأ null) و<code>current</code> (بيبدأ head).",
        "في كل خطوة: احفظ <code>current.next</code> في متغير، وبعدين خلي <code>current.next = previous</code>، وبعدين اتحرك للأمام.",
      ],
      solution: `Node<int>? reverse(Node<int>? head) {
  Node<int>? previous;
  var current = head;
  while (current != null) {
    final next = current.next;
    current.next = previous;
    previous = current;
    current = next;
  }
  return previous;
}`,
      explain: "بنمشي مرة واحدة: O(n) وقت، O(1) مساحة. لازم نحفظ <code>next</code> قبل ما نكتب فوق المؤشر وإلا هنفقد باقي القايمة. في الآخر <code>previous</code> هو الـ head الجديد.",
    },
    {
      title: "BST: ترتيب القيم و ارتفاع الشجرة",
      lang: "dart",
      prompt: "<p>معاك <code>TreeNode</code> (<code>value</code>, <code>left</code>, <code>right</code>). اكتب دالتين: <code>List&lt;int&gt; inorder(TreeNode? root)</code> بترجع القيم من الأصغر للأكبر (شمال ثم الجذر ثم يمين)، و<code>int height(TreeNode? root)</code> بترجع عدد المستويات (شجرة فاضية = 0، جذر لوحده = 1).</p>",
      examples: [
        { in: "insert 5, 3, 8, 1, 4 ثم inorder", out: "[1, 3, 4, 5, 8]" },
        { in: "نفس الشجرة height", out: "3" },
      ],
      starter: `class TreeNode {
  int value;
  TreeNode? left;
  TreeNode? right;
  TreeNode(this.value);
}`,
      hints: [
        "الاتنين recursion: الحالة الأساسية لما <code>root == null</code>.",
        "inorder: نتيجة الشمال ثم الجذر ثم نتيجة اليمين. height: <code>1 + max(ارتفاع الشمال, ارتفاع اليمين)</code>.",
      ],
      solution: `import 'dart:math';

List<int> inorder(TreeNode? root) {
  if (root == null) return [];
  return [...inorder(root.left), root.value, ...inorder(root.right)];
}

int height(TreeNode? root) {
  if (root == null) return 0;
  return 1 + max(height(root.left), height(root.right));
}`,
      explain: "الـ inorder على BST بيدي القيم مرتبة، وده السبب إنها خاصية مفيدة للـ BST. التعقيد O(n) لأن كل node بيتزار مرة. الـ height هي اللي بتحدد تكلفة البحث: متوازنة حوالي log n، ومرتبة n.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final s = <int>[];
s.add(1);
s.add(2);
s.add(3);
print(s.removeLast());
print(s.last);` },
      options: ["3 ثم 2", "1 ثم 2", "3 ثم 1", "1 ثم 3"],
      answer: 0,
      why: "الإضافة والمسح من الآخر = سلوك stack (LIFO). <code>removeLast</code> بترجع آخر عنصر دخل (3)، وبعدها آخر عنصر باقي هو 2.",
    },
    {
      q: "أنهي عملية على <code>List</code> في Dart تكلفتها O(n)؟",
      options: ["<code>list[5]</code>", "<code>list.add(x)</code> (في المتوسط)", "<code>list.removeLast()</code>", "<code>list.insert(0, x)</code>"],
      answer: 3,
      why: "الإدراج في الأول بيزحزح كل العناصر خطوة لقدام: O(n). الوصول بالرقم O(1)، والإضافة والمسح من الآخر O(1) (amortized في الإضافة).",
    },
    {
      q: "عايز تعرف بسرعة لو id موجود بين 200 ألف id وبتسأل كتير. أنسب هيكل؟",
      options: ["<code>List&lt;int&gt;</code> و<code>contains</code> كل مرة", "<code>Set&lt;int&gt;</code>", "Linked list", "Stack"],
      answer: 1,
      why: "الـ Set (hash set) بتجاوب «موجود ولا لأ؟» في O(1) في المتوسط. الـ List و linked list بيمسحوا كل العناصر O(n).",
    },
    {
      q: "الناتج إيه؟ (الدالة بتجمع أكواد الحروف وبتقسم على عدد الخانات)",
      code: { lang: "dart", src: `int bucketOf(String key, int buckets) {
  var sum = 0;
  for (final unit in key.codeUnits) {
    sum += unit;
  }
  return sum % buckets;
}

print(bucketOf('ab', 8));` },
      answer: ["3"],
      why: "كود a هو 97 و b هو 98، المجموع 195، و195 % 8 = 3. وده نفس ناتج 'ba' (collision) لأن الجمع مبيفرقش الترتيب.",
    },
    {
      q: "حطينا القيم 1، 2، 3، 4، 5 بالترتيب ده في BST عادي (من غير موازنة). إيه تكلفة البحث عن 5؟",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      answer: 2,
      why: "كل قيمة أكبر من اللي قبلها فبتتحط على يمين اللي قبلها، فالشجرة بتبقى خط واحد (زي linked list) وارتفاعها n. عشان كده بنحتاج أشجار متوازنة.",
    },
    {
      q: "الناتج إيه؟ (BST اتبنت بإدراج 5، 3، 8، 1، 4 بالترتيب)",
      code: { lang: "dart", src: `// inorder: left subtree, root, right subtree
print(inorder(root));` },
      options: ["[5, 3, 8, 1, 4]", "[1, 3, 4, 5, 8]", "[1, 4, 3, 8, 5]", "[8, 5, 4, 3, 1]"],
      answer: 1,
      why: "الـ inorder على BST بيعدي الشمال (الأصغر) ثم الجذر ثم اليمين، فبيطلع القيم مرتبة تصاعديا: 1، 3، 4، 5، 8.",
    },
    {
      q: "أنسب هيكل لـ «زر Back» اللي بيرجع للشاشة السابقة؟",
      options: ["Queue", "Stack", "Hash set", "Min-heap"],
      answer: 1,
      why: "آخر شاشة دخلتها هي أول واحدة بترجع منها: LIFO. وده بالظبط الـ Navigator stack في Flutter.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final seen = <int>{};
final dups = [1, 2, 2, 3, 1].where((x) => !seen.add(x)).toList();
print(dups);` },
      options: ["[1, 2, 3]", "[2, 1]", "[1, 2]", "[2, 2]"],
      answer: 1,
      why: "<code>seen.add(x)</code> بترجع false لو العنصر كان موجود، فالـ <code>!</code> بتخلي where تمسك التكرارات بس: التكرار التاني لـ 2 ثم التاني لـ 1. الناتج [2, 1] بترتيب ظهور التكرارات.",
    },
    {
      q: "ليه <code>removeAt(0)</code> على List مش مناسبة لبناء queue كبيرة؟",
      options: [
        "لأنها بترمي exception لو القايمة فيها أكتر من 1000 عنصر",
        "لأنها بتغير ترتيب باقي العناصر",
        "لأنها O(n): بتزحزح باقي العناصر كل مرة، فالـ dequeue يبطأ مع حجم الـ queue",
        "لأنها بترجع null دايما",
      ],
      answer: 2,
      why: "العنصر الأول بيتشال وكل اللي بعده بيتحرك خطوة. للـ queue الكبيرة استخدم <code>Queue</code> من dart:collection (O(1)) أو احتفظ بـ index للـ head.",
    },
    {
      q: "لما الـ hash map تلاقي collision (مفتاحين لنفس الخانة) إيه اللي بيحصل في الأغلب؟",
      options: [
        "تمسح المفتاح القديم",
        "ترفض المفتاح الجديد",
        "بتحط الاتنين في نفس الخانة (قايمة صغيرة) أو تدور على خانة تانية، وبتقارن المفتاح الفعلي وقت البحث",
        "بتحول الـ map كلها لـ linked list",
      ],
      answer: 2,
      why: "الـ collision طبيعي ومتوقع. الحل chaining أو probing، والبحث بعد الوصول للخانة بيقارن المفتاح نفسه. لو الـ collisions كترت الأداء بيقع لـ O(n)، فالجدول بيكبر.",
    },
  ],
};
