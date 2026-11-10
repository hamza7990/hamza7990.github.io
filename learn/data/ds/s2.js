window.LEVELS = window.LEVELS || {};
window.LEVELS["ds/s2"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "القايمة المتصلة: عناصر متفرقة بتشاور على بعض",
      en: "Why linked lists",
      body: "<p>الـ linked list من أكتر الأسئلة تكرارا في الإنترفيو، مش لأنها بتتستخدم كتير في الشغل، لكن لأنها بتختبر حاجة واحدة: هل بتفهم <b>المؤشرات (references)</b> وبتعرف تعدلها من غير ما تضيع جزء من القايمة. كل سؤال فيها بيدور على نفس الأخطاء: قايمة فاضية، عنصر واحد، نسيان تحديث الـ head أو الـ tail.</p><p>في المستوى ده هنفهم شكلها في الذاكرة وليه عملياتها بالتكلفة اللي ليها، هنكتبها بإيدينا، ونحل المسائل الكلاسيك: عكس القايمة، النص، اكتشاف الدايرة، دمج قايمتين، ومسح العنصر رقم n من الآخر.</p>",
      points: [
        "على عكس الـ array، العناصر هنا <b>مش متجاورة</b> في الذاكرة. كل عنصر (node) بيشيل قيمته ومؤشر للعنصر اللي بعده.",
        "ده بيدي إدراج ومسح رخيصين عند مكان معروف، وبياخد في المقابل وصول بالرقم غالي.",
        "في الواقع الـ array بتكسب في أغلب الحالات. هنشوف ليه في آخر المستوى.",
      ],
    },
    {
      title: "الـ node والمؤشر في الذاكرة",
      en: "Nodes and pointers",
      body: "<p>كل عنصر object منفصل (node) اتحجز في أي مكان فاضي في الذاكرة. الـ node فيه حقلين: <code>value</code> و<code>next</code> (مؤشر لعنوان الـ node اللي بعده). القايمة كلها بنمسكها من مؤشر واحد اسمه <b>head</b>، وآخر node الـ <code>next</code> بتاعه <code>null</code>.</p>",
      code: {
        lang: "text",
        title: "list 10 -> 20 -> 30",
        src: `head
 |
 v
+----+------+      +----+------+      +----+------+
| 10 | next-+----->| 20 | next-+----->| 30 | null |
+----+------+      +----+------+      +----+------+
 @4096               @1280              @9000

addresses are unrelated: the nodes can sit anywhere in memory.
to reach the 3rd node you must follow two arrows from head.`,
        note: "العناوين عشوائية، فمفيش معادلة تحسب مكان العنصر رقم i زي الـ array. الطريق الوحيد إنك تمشي من الـ head خطوة خطوة.",
      },
      terms: [
        ["node", "عقدة", "object فيه قيمة + مؤشر للعقدة اللي بعدها."],
        ["head", "رأس القايمة", "مؤشر لأول node. لو ضاع الـ head ضاعت القايمة كلها."],
        ["tail", "ذيل القايمة", "مؤشر لآخر node (اختياري) بيخلي الإضافة في الآخر O(1)."],
        ["pointer / reference", "مؤشر", "في Dart هو الـ reference اللي بيشاور على object."],
      ],
      interview: [
        { q: "إيه الفرق بين array و linked list في الذاكرة؟", a: "الـ array عناصرها متجاورة في كتلة واحدة فالعنوان بيتحسب بمعادلة (الوصول O(1)). الـ linked list كل عنصر node منفصل في أي مكان، وبيشاور على اللي بعده بمؤشر، فمفيش وصول مباشر ولازم تمشي من الـ head. المقابل إن إدراج أو مسح node عند مكان معروف بيغير مؤشرين بس من غير زحزحة. وكمان كل node بيدفع تكلفة مؤشر زيادة وهيدر الـ object." },
      ],
    },
    {
      title: "Singly و Doubly، والـ head والـ tail",
      en: "Singly vs doubly linked, head and tail",
      body: "<p>في الـ <b>singly linked list</b> كل node بيشاور للأمام بس (<code>next</code>). في الـ <b>doubly linked list</b> كل node بيشاور للأمام وللخلف (<code>next</code> و<code>prev</code>). التانية بتكلف مؤشر زيادة لكل node، وبتديك حاجتين: المشي في الاتجاهين، ومسح node لو معاك هو نفسه من غير ما تدور على اللي قبله.</p>",
      code: {
        lang: "dart",
        src: `class DNode<T> {
  T value;
  DNode<T>? prev;
  DNode<T>? next;
  DNode(this.value);
}

// O(1): we hold the node, so we know both neighbours.
// (A real list would also fix its head and tail here.)
void unlink<T>(DNode<T> n) {
  n.prev?.next = n.next;
  n.next?.prev = n.prev;
  n.prev = null;
  n.next = null;
}

void main() {
  final a = DNode(1);
  final b = DNode(2);
  final c = DNode(3);
  a.next = b;
  b.prev = a;
  b.next = c;
  c.prev = b;

  unlink(b);
  print(a.next!.value);   // 3
  print(c.prev!.value);   // 1
}`,
        note: "من غير <code>prev</code> كنا هنحتاج نمشي من الـ head لحد ما نلاقي اللي قبل b عشان نعدل مؤشره: O(n). مع <code>prev</code> هي أربع تعيينات.",
      },
      points: [
        "<b>الـ tail</b>: لو بتحتفظ بمؤشر للآخر، <code>addLast</code> بتبقى O(1). من غيره لازم تمشي القايمة كلها O(n).",
        "مسح الـ tail في singly list O(n) حتى مع وجود tail pointer، لأنك محتاج الـ node اللي قبله. في doubly بتبقى O(1).",
        "الاستخدام الشهير للـ doubly list: LRU cache (مع hash map)، وتاريخ المتصفح (back/forward).",
      ],
    },
    {
      title: "تكلفة كل عملية وليه",
      en: "Cost of every operation",
      code: {
        lang: "text",
        src: `Operation                         Singly   Why
access the k-th element           O(k)     follow k arrows from head
search by value                   O(n)     walk until found
addFirst                          O(1)     new node points to old head
addLast (with tail pointer)       O(1)     tail.next = new node
addLast (head only)               O(n)     must walk to the last node
insert after a node you hold      O(1)     rewire two pointers
remove first                      O(1)     head = head.next
remove a node you hold            O(n)*    need the previous node (*O(1) in doubly)
remove by value                   O(n)     search first, then rewire
length (no counter)               O(n)     count the nodes`,
        note: "القاعدة: اللي رخيص هو التعديل <b>بعد</b> ما توصل للمكان. الوصول للمكان نفسه O(n). عشان كده «الإدراج في النص O(1)» ناقصة: هي O(1) لو معاك الـ node فعلا.",
      },
      focus: [{ label: "احفظها", text: "الـ linked list بتكسب في الإدراج والمسح من <b>الأول</b> (والآخر لو فيه tail أو doubly). بتخسر في كل حاجة محتاجة وصول بالرقم أو بحث." }],
      pitfall: "المقارنة الشهيرة «linked list إدراج O(1) و array إدراج O(n)» مضللة في الإنترفيو. لازم تضيف: «بعد ما توصل للمكان». لو كنت بتدور عليه بالقيمة، الاتنين O(n).",
    },
    {
      title: "نكتب singly linked list",
      en: "Implementing a singly linked list",
      body: "<p>الكلاس بيحتفظ بـ <code>head</code> و<code>tail</code> وعدّاد الطول. أهم حاجة: كل عملية تتحقق من الحالات الحدية (قايمة فاضية، عنصر واحد، مسح الأول، مسح الآخر).</p>",
      code: {
        lang: "dart",
        src: `class Node<T> {
  T value;
  Node<T>? next;
  Node(this.value, [this.next]);
}

class SinglyList<T> {
  Node<T>? _head;
  Node<T>? _tail;
  int _length = 0;

  int get length => _length;
  bool get isEmpty => _length == 0;

  void addFirst(T value) {
    final node = Node<T>(value, _head);
    _head = node;
    _tail ??= node;
    _length++;
  }

  void addLast(T value) {
    final node = Node<T>(value);
    if (_tail == null) {
      _head = node;
    } else {
      _tail!.next = node;
    }
    _tail = node;
    _length++;
  }

  T removeFirst() {
    final first = _head;
    if (first == null) throw StateError('empty list');
    _head = first.next;
    if (_head == null) _tail = null;
    _length--;
    return first.value;
  }

  bool remove(T value) {
    Node<T>? prev;
    var cur = _head;
    while (cur != null) {
      if (cur.value == value) {
        if (prev == null) {
          _head = cur.next;
        } else {
          prev.next = cur.next;
        }
        if (identical(cur, _tail)) _tail = prev;
        _length--;
        return true;
      }
      prev = cur;
      cur = cur.next;
    }
    return false;
  }

  List<T> toList() {
    final out = <T>[];
    for (var cur = _head; cur != null; cur = cur.next) {
      out.add(cur.value);
    }
    return out;
  }
}

void main() {
  final list = SinglyList<int>();
  list.addLast(2);
  list.addLast(3);
  list.addFirst(1);
  print(list.toList());       // [1, 2, 3]
  print(list.remove(3));      // true  (it was the tail)
  list.addLast(9);            // tail must still be correct
  print(list.toList());       // [1, 2, 9]
  print(list.removeFirst());  // 1
  print(list.remove(42));     // false
  print(list.length);         // 2
}`,
        note: "لاحظ تحديث الـ tail في حالتين: لما نضيف في قايمة فاضية (<code>addFirst</code> بتحط الـ tail)، ولما نمسح آخر node. نسيان أي واحدة منهم بيخلي <code>addLast</code> بعد كده تكتب على node اتمسحت.",
      },
      interview: [
        { q: "اكتب singly linked list فيها addFirst و addLast و remove. إيه الحالات الحدية؟", a: "بحتفظ بـ head و tail وlength. <code>addFirst</code>: الـ node الجديدة next بتاعها هو الـ head القديم، ولو القايمة كانت فاضية الـ tail كمان بيبقى هي. <code>addLast</code>: لو فاضية head و tail = node، غير كده <code>tail.next = node</code> وبعدين <code>tail = node</code>. <code>remove</code>: بمشي ومعايا prev؛ لو الـ node هي الـ head بحرك الـ head، غير كده <code>prev.next = cur.next</code>، ولو كانت الـ tail بحرك الـ tail لـ prev. والحالات الحدية: فاضية، عنصر واحد، مسح الأول، مسح الآخر." },
      ],
    },
    {
      title: "عكس القايمة: iterative و recursive",
      en: "Reverse a linked list",
      body: "<p>السؤال الأشهر. الفكرة: كل node نخلي <code>next</code> بتاعها يشاور على اللي قبلها بدل اللي بعدها. في الحل الـ iterative بنمشي مرة واحدة ومعانا مؤشرين. في الـ recursive بنعكس الباقي الأول، وبعدين نربط الـ node الحالية في آخره.</p>",
      code: {
        lang: "dart",
        src: `class Node<T> {
  T value;
  Node<T>? next;
  Node(this.value, [this.next]);
}

Node<int>? build(List<int> xs) {
  Node<int>? head;
  for (var i = xs.length - 1; i >= 0; i--) {
    head = Node(xs[i], head);
  }
  return head;
}

List<int> toList(Node<int>? head) {
  final out = <int>[];
  for (var cur = head; cur != null; cur = cur.next) {
    out.add(cur.value);
  }
  return out;
}

// O(n) time, O(1) space
Node<int>? reverseIterative(Node<int>? head) {
  Node<int>? prev;
  var cur = head;
  while (cur != null) {
    final next = cur.next;   // save before overwriting
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}

// O(n) time, O(n) space (call stack)
Node<int>? reverseRecursive(Node<int>? head) {
  if (head == null || head.next == null) return head;
  final newHead = reverseRecursive(head.next);
  head.next!.next = head;   // the node after us now points back to us
  head.next = null;
  return newHead;
}

void main() {
  print(toList(reverseIterative(build([1, 2, 3, 4]))));  // [4, 3, 2, 1]
  print(toList(reverseRecursive(build([1, 2, 3, 4]))));  // [4, 3, 2, 1]
  print(toList(reverseIterative(build([]))));            // []
  print(toList(reverseRecursive(build([7]))));           // [7]
}`,
        note: "الـ recursive أنيق لكن عمقه n: قايمة طويلة جدا ممكن تعمل stack overflow. في الإنترفيو اكتب الـ iterative الأول واشرح إن الـ recursive بتستهلك O(n) من الـ call stack.",
      },
      pitfall: "في الحل الـ iterative لو كتبت <code>cur.next = prev</code> قبل ما تحفظ <code>cur.next</code> في متغير، فقدت باقي القايمة. السطر الأول دايما: <code>final next = cur.next</code>.",
      interview: [
        { q: "اعكس linked list. وإيه الفرق بين الحل الـ iterative والـ recursive؟", a: "الـ iterative: مؤشرين prev (بيبدأ null) و cur (بيبدأ head). في كل خطوة بحفظ cur.next، وأخلي cur.next = prev، وبحرك prev و cur لقدام. في الآخر prev هو الـ head الجديد. O(n) زمن و O(1) مساحة. الـ recursive: بعكس الباقي (head.next) وبعدين أخلي <code>head.next.next = head</code> و <code>head.next = null</code>. نفس الزمن لكن O(n) مساحة من الـ call stack، وفيه خطر stack overflow على القوايم الطويلة." },
      ],
    },
    {
      title: "النص والدايرة: slow و fast pointers",
      en: "Middle of a list and Floyd cycle detection",
      body: "<p>أسلوب المؤشرين السريع والبطيء: <code>slow</code> بيتحرك خطوة و<code>fast</code> بيتحرك خطوتين. لما fast يوصل للآخر، slow يكون في النص (لأنه قطع نص المسافة). ونفس الفكرة بتكشف الدايرة: لو فيه cycle، fast هيلف جواها ويلحق slow من ورا (الفرق بينهم بيقل بواحد كل خطوة) فهيتقابلوا. لو مفيش، fast هيوصل لـ null.</p>",
      code: {
        lang: "dart",
        src: `class Node<T> {
  T value;
  Node<T>? next;
  Node(this.value, [this.next]);
}

// For an even length this returns the second of the two middles.
Node<int>? middle(Node<int>? head) {
  var slow = head;
  var fast = head;
  while (fast != null && fast.next != null) {
    slow = slow!.next;
    fast = fast.next!.next;
  }
  return slow;
}

bool hasCycle(Node<int>? head) {
  var slow = head;
  var fast = head;
  while (fast != null && fast.next != null) {
    slow = slow!.next;
    fast = fast.next!.next;
    if (identical(slow, fast)) return true;
  }
  return false;
}

void main() {
  final a = Node(1, Node(2, Node(3, Node(4, Node(5)))));
  print(middle(a)!.value);        // 3
  final b = Node(1, Node(2, Node(3, Node(4))));
  print(middle(b)!.value);        // 3  (second middle)
  print(middle(null));            // null
  print(hasCycle(a));             // false

  var last = a;
  while (last.next != null) {
    last = last.next!;
  }
  last.next = a.next;             // 5 -> 2 closes a cycle
  print(hasCycle(a));             // true
}`,
        note: "المقارنة بـ <code>identical</code> مش بالقيمة: ممكن تتكرر نفس القيمة في nodes مختلفة من غير cycle. الوقت O(n) والمساحة O(1). البديل بـ Set من الـ nodes اللي شفناها بيشتغل لكن بمساحة O(n).",
      },
      interview: [
        { q: "إزاي تكتشف إن linked list فيها cycle من غير مساحة إضافية؟", a: "بخوارزمية Floyd: مؤشر slow بيتحرك خطوة وfast خطوتين. لو فيه cycle، لما الاتنين يدخلوا فيها المسافة بينهم بتقل بواحد كل خطوة فلازم يتقابلوا. لو fast وصل لـ null أو <code>fast.next</code> بقت null يبقى مفيش cycle. O(n) زمن و O(1) مساحة. الحل البديل بـ Set من الـ nodes بيحتاج O(n) مساحة." },
        { q: "إزاي تلاقي نص linked list في مرور واحد؟", a: "slow و fast pointers. fast بيمشي ضعف سرعة slow، فلما fast يوصل للآخر slow يكون في النص. للطول الزوجي بنرجع النص التاني بالشرط ده (<code>fast != null &amp;&amp; fast.next != null</code>). من غير الحيلة دي كنا هنعد الطول في مرور وبعدين نمشي نصه في مرور تاني." },
      ],
    },
    {
      title: "دمج قايمتين مرتبتين، ومسح العنصر رقم n من الآخر",
      en: "Merge two sorted lists, remove n-th from the end",
      body: "<p>الحيلة المشتركة في المسألتين: <b>dummy node</b> (node وهمية قبل الـ head). هي بتخلي مسح أو إضافة الـ node الأولى زي أي node تانية من غير <code>if</code> خاصة بالـ head.</p><p>للدمج: مؤشر <code>tail</code> بيبني القايمة الناتجة بسحب الأصغر من الرأسين. للمسح من الآخر: مؤشرين بينهم فرق n خطوة؛ لما الأمامي يوصل للآخر، الخلفي يكون واقف قبل الـ node المطلوبة مباشرة.</p>",
      code: {
        lang: "dart",
        src: `class Node<T> {
  T value;
  Node<T>? next;
  Node(this.value, [this.next]);
}

Node<int>? build(List<int> xs) {
  Node<int>? head;
  for (var i = xs.length - 1; i >= 0; i--) {
    head = Node(xs[i], head);
  }
  return head;
}

List<int> toList(Node<int>? head) {
  final out = <int>[];
  for (var cur = head; cur != null; cur = cur.next) {
    out.add(cur.value);
  }
  return out;
}

Node<int>? mergeSorted(Node<int>? a, Node<int>? b) {
  final dummy = Node<int>(0);
  var tail = dummy;
  while (a != null && b != null) {
    if (a.value <= b.value) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next!;
  }
  tail.next = a ?? b;   // append whatever is left
  return dummy.next;
}

Node<int>? removeNthFromEnd(Node<int>? head, int n) {
  if (n < 1) return head;
  final dummy = Node<int>(0, head);
  Node<int>? fast = dummy;
  for (var i = 0; i < n && fast != null; i++) {
    fast = fast.next;
  }
  if (fast == null) return head;   // n is bigger than the length
  var slow = dummy;
  while (fast!.next != null) {
    fast = fast.next;
    slow = slow.next!;
  }
  slow.next = slow.next!.next;
  return dummy.next;
}

void main() {
  print(toList(mergeSorted(build([1, 3, 5]), build([2, 3, 4, 6]))));
  // [1, 2, 3, 3, 4, 5, 6]
  print(toList(mergeSorted(build([]), build([1]))));   // [1]
  print(toList(removeNthFromEnd(build([1, 2, 3, 4, 5]), 2)));  // [1, 2, 3, 5]
  print(toList(removeNthFromEnd(build([1, 2]), 2)));           // [2]
  print(toList(removeNthFromEnd(build([1]), 1)));              // []
}`,
        note: "الدمج مبيعملش nodes جديدة، بيعيد ربط الموجودة: O(n + m) زمن و O(1) مساحة. بدون الـ dummy كان محتاج حالة خاصة لتحديد أول node في النتيجة، وكذلك مسح الـ head في المسألة التانية.",
      },
      interview: [
        { q: "دمج قايمتين مرتبتين في قايمة مرتبة واحدة. ليه بنستخدم dummy node؟", a: "بعمل dummy node ومؤشر tail بيبدأ عندها. في كل خطوة بقارن رأسي القايمتين وبربط tail بالأصغر وبحرك المؤشر. لما واحدة تخلص بربط الباقي من التانية مرة واحدة. الـ dummy بتوفر حالة خاصة لأول node في النتيجة، والإجابة هي <code>dummy.next</code>. O(n + m) زمن و O(1) مساحة لأنه بيعيد استخدام الـ nodes." },
        { q: "إزاي تمسح العنصر رقم n من آخر القايمة في مرور واحد؟", a: "بحط dummy قبل الـ head، ومؤشر fast بيتحرك n خطوة الأول، وبعدين fast و slow (بيبدأ من الـ dummy) بيتحركوا مع بعض لحد ما <code>fast.next</code> تبقى null. وقتها slow واقف قبل الـ node المطلوبة مباشرة فبعمل <code>slow.next = slow.next.next</code>. الـ dummy بتخلي مسح الـ head نفسه شغال من غير حالة خاصة. O(n) زمن و O(1) مساحة." },
      ],
    },
    {
      title: "إمتى تكسب الـ linked list؟ (نادرا)",
      en: "When a linked list beats an array in practice",
      body: "<p>في الكتب الـ linked list بتكسب في الإدراج والمسح. في الواقع الـ array (أو <code>List</code>) بتكسب في أغلب الحالات حتى لما الحسابات النظرية تقول العكس، وده لأسباب عملية:</p>",
      points: [
        "<b>الـ cache</b>: عناصر الـ array متجاورة فالـ CPU بيجيب مجموعة منها في قراءة واحدة. عناصر الـ linked list متفرقة فكل خطوة ممكن تبقى cache miss، وده أغلى بكتير من نسخ شوية عناصر.",
        "<b>الذاكرة</b>: كل node ليه object header ومؤشر (أو اتنين) زيادة على القيمة. قايمة أرقام ممكن تستهلك أضعاف الـ array.",
        "<b>الإدراج «O(1)»</b> محتاج توصل للمكان الأول، وده O(n) إلا لو معاك الـ node. فالمكسب الحقيقي مرتبط بوجود مؤشر على المكان.",
        "<b>بتكسب فعلا</b> لما بتبني حاجات فوقها: queue (مسح من الأول وإضافة في الآخر)، LRU cache (نقل node لأول القايمة في O(1) مع hash map)، وlists اللي بتتقسم وتتدمج كتير. وكمان لما التعديل عند الـ head بس.",
        "في Dart فيه <code>LinkedList</code> في <code>dart:collection</code> (doubly، والعناصر لازم تكون <code>LinkedListEntry</code>) لكنها نادرة جدا، و<code>Queue</code> في نفس المكتبة أنسب للـ queue.",
      ],
      pitfall: "قول «الـ linked list أسرع في الإدراج» في الإنترفيو من غير قيود غلط بيتصيد. الإجابة الصح: «O(1) لو معايا الـ node، لكن الـ array غالبا أسرع في الواقع بسبب الـ cache locality، ومش هستخدم linked list إلا لو عندي سبب واضح».",
      interview: [
        { q: "لو الـ linked list إدراجها O(1) والـ array O(n)، ليه الـ List هي الافتراضية في Dart وكل اللغات؟", a: "لأن الإدراج O(1) في الـ linked list بيفترض إني واصل للمكان بالفعل، والوصول O(n). وكمان الـ array متجاورة في الذاكرة فالـ cache بيخلي المرور عليها أسرع بكتير، والـ node في الـ linked list بتدفع تكلفة مؤشر وheader وتخصيص ذاكرة لكل عنصر. فالـ array تكسب عمليا حتى في عمليات زي الإدراج في النص على قوايم متوسطة الحجم. الـ linked list بستخدمها لما أبني queue أو LRU cache أو لما محتاج أنقل nodes من غير ما أنسخ." },
      ],
    },
    {
      title: "أخطاء شائعة في مسائل الـ linked list",
      en: "Pitfalls",
      points: [
        "<b>null checks</b>: افحص <code>head == null</code> و<code>head.next == null</code> قبل ما تفك أي مؤشر. جرب كل حل على: قايمة فاضية، عنصر واحد، اتنين.",
        "<b>فقد الباقي</b>: قبل ما تغير <code>cur.next</code> احفظ القديم في متغير.",
        "<b>تحديث الـ head والـ tail</b>: مسح أو إضافة أول أو آخر node بيغير أحدهم. الـ dummy node بتحل أغلب ده.",
        "<b>المقارنة بالـ identity</b>: لاكتشاف الدايرة قارن الـ nodes بـ <code>identical</code> مش بالقيمة.",
        "<b>الطباعة في لوب بلا نهاية</b>: لو عملت cycle بالغلط، <code>toList</code> مش هتخلص أبدا. ارسم المؤشرات على ورقة قبل الكود.",
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: Node وطول القايمة",
      lang: "dart",
      code: `class Node<T> {
  T value;
  Node<T>? next;
  Node(this.value, [this.next]);
}

int length(Node<int>? head) {
  var count = 0;
  for (var cur = head; cur != null; cur = cur.next) {
    count++;
  }
  return count;
}`,
    },
    {
      title: "اكتب: عكس القايمة",
      lang: "dart",
      code: `Node<int>? reverse(Node<int>? head) {
  Node<int>? prev;
  var cur = head;
  while (cur != null) {
    final next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}`,
      note: "محتاج كلاس Node من الدريل اللي فات.",
    },
    {
      title: "اكتب: اكتشاف الدايرة",
      lang: "dart",
      code: `bool hasCycle(Node<int>? head) {
  var slow = head;
  var fast = head;
  while (fast != null && fast.next != null) {
    slow = slow!.next;
    fast = fast.next!.next;
    if (identical(slow, fast)) return true;
  }
  return false;
}`,
    },
  ],

  tasks: [
    {
      title: "نص القايمة",
      lang: "dart",
      prompt: "<p>معاك الكلاس <code>Node&lt;int&gt;</code>. اكتب <code>Node&lt;int&gt;? middle(Node&lt;int&gt;? head)</code> بترجع الـ node اللي في نص القايمة في مرور واحد. لو الطول زوجي رجع النص <b>التاني</b>. لو القايمة فاضية رجع <code>null</code>.</p>",
      examples: [
        { in: "1 -> 2 -> 3 -> 4 -> 5", out: "node 3" },
        { in: "1 -> 2 -> 3 -> 4", out: "node 3" },
        { in: "(empty)", out: "null" },
      ],
      starter: `class Node<T> {
  T value;
  Node<T>? next;
  Node(this.value, [this.next]);
}

Node<int>? middle(Node<int>? head) {
  // your code
}`,
      hints: [
        "مؤشرين: <code>slow</code> بخطوة و<code>fast</code> بخطوتين، الاتنين بيبدأوا من head.",
        "كمل طول ما <code>fast != null &amp;&amp; fast.next != null</code>، وارجع slow.",
      ],
      solution: `Node<int>? middle(Node<int>? head) {
  var slow = head;
  var fast = head;
  while (fast != null && fast.next != null) {
    slow = slow!.next;
    fast = fast.next!.next;
  }
  return slow;
}`,
      explain: "O(n) زمن و O(1) مساحة. الشرط على <code>fast.next</code> هو اللي بيخلي الطول الزوجي يرجع النص التاني. على قايمة فاضية اللوب مبتشتغلش وبترجع slow اللي هو null. <code>slow!</code> آمنة لأن slow مش null طول ما fast مش null.",
    },
    {
      title: "دمج قايمتين مرتبتين",
      lang: "dart",
      prompt: "<p>معاك <code>Node&lt;int&gt;</code>. اكتب <code>Node&lt;int&gt;? mergeSorted(Node&lt;int&gt;? a, Node&lt;int&gt;? b)</code> بتاخد قايمتين مرتبتين تصاعديا وترجع head قايمة واحدة مرتبة بتعيد ربط نفس الـ nodes (من غير nodes جديدة). أي قايمة منهم ممكن تكون فاضية.</p>",
      examples: [
        { in: "[1, 3, 5] و [2, 3, 4, 6]", out: "[1, 2, 3, 3, 4, 5, 6]" },
        { in: "[] و [1]", out: "[1]" },
        { in: "[] و []", out: "[]" },
      ],
      starter: `class Node<T> {
  T value;
  Node<T>? next;
  Node(this.value, [this.next]);
}

Node<int>? mergeSorted(Node<int>? a, Node<int>? b) {
  // your code
}`,
      hints: [
        "استخدم dummy node ومؤشر tail بيبدأ منها.",
        "قارن <code>a.value</code> و<code>b.value</code>، اربط الأصغر في <code>tail.next</code> وحرك مؤشره وحرك tail. في الآخر اربط اللي فاضل.",
      ],
      solution: `Node<int>? mergeSorted(Node<int>? a, Node<int>? b) {
  final dummy = Node<int>(0);
  var tail = dummy;
  while (a != null && b != null) {
    if (a.value <= b.value) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next!;
  }
  tail.next = a ?? b;
  return dummy.next;
}`,
      explain: "O(n + m) زمن و O(1) مساحة. استخدام <code>&lt;=</code> بيخلي الدمج stable (القيم المتساوية من a الأول). <code>a ?? b</code> بيربط الباقي من اللي لسه فيها عناصر، ولو الاتنين فاضيين بتبقى null.",
    },
    {
      title: "امسح العنصر رقم n من الآخر",
      lang: "dart",
      prompt: "<p>معاك <code>Node&lt;int&gt;</code>. اكتب <code>Node&lt;int&gt;? removeNthFromEnd(Node&lt;int&gt;? head, int n)</code> بتمسح الـ node رقم <code>n</code> من آخر القايمة (n = 1 معناها الأخيرة) وترجع الـ head. في مرور واحد. لو <code>n</code> أكبر من الطول أو أقل من 1 رجع القايمة زي ما هي.</p>",
      examples: [
        { in: "[1, 2, 3, 4, 5], n = 2", out: "[1, 2, 3, 5]" },
        { in: "[1, 2], n = 2", out: "[2]" },
        { in: "[1], n = 1", out: "[]" },
      ],
      starter: `class Node<T> {
  T value;
  Node<T>? next;
  Node(this.value, [this.next]);
}

Node<int>? removeNthFromEnd(Node<int>? head, int n) {
  // your code
}`,
      hints: [
        "حط dummy قبل الـ head عشان مسح الـ head ميبقاش حالة خاصة.",
        "حرك fast بمقدار n خطوة، وبعدين حرك fast و slow مع بعض لحد ما <code>fast.next</code> تبقى null. slow دلوقتي قبل الـ node المطلوبة.",
      ],
      solution: `Node<int>? removeNthFromEnd(Node<int>? head, int n) {
  if (n < 1) return head;
  final dummy = Node<int>(0, head);
  Node<int>? fast = dummy;
  for (var i = 0; i < n && fast != null; i++) {
    fast = fast.next;
  }
  if (fast == null) return head;
  var slow = dummy;
  while (fast!.next != null) {
    fast = fast.next;
    slow = slow.next!;
  }
  slow.next = slow.next!.next;
  return dummy.next;
}`,
      explain: "الفجوة بين fast و slow ثابتة n خطوة، فلما fast على آخر node، slow على اللي قبل المطلوبة. الـ dummy بتخلي مسح الـ head نفسه (n = الطول) يشتغل بنفس الكود. O(n) زمن و O(1) مساحة.",
    },
  ],

  quiz: [
    {
      q: "تكلفة <code>addFirst</code> في singly linked list؟",
      options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      answer: 2,
      why: "الـ node الجديدة بتشاور على الـ head القديم والـ head بيشاور عليها. من غير لف ولا زحزحة.",
    },
    {
      q: "عندك مؤشر على node في وسط singly linked list (من غير مؤشر على اللي قبلها). تكلفة مسحها؟",
      options: [
        "O(n) لأنك محتاج اللي قبلها عشان تعدل مؤشره، وبتدور عليه من الـ head",
        "O(1) دايما لأنك معاك الـ node",
        "O(log n)",
        "مستحيل مسحها",
      ],
      answer: 0,
      why: "المسح يعني تغيير <code>prev.next</code>، ومن غير <code>prev</code> لازم تمشي من الـ head. في doubly list هتبقى O(1) لأن الـ node نفسها بتعرف prev.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final head = Node(1, Node(2, Node(3, Node(4))));
print(middle(head)!.value);` },
      answer: ["3"],
      why: "الطول 4 (زوجي) فالدالة بترجع النص التاني، وهو الـ node اللي قيمتها 3.",
    },
    {
      q: "ليه الـ array غالبا أسرع من linked list في المرور على كل العناصر حتى لو الاتنين O(n)؟",
      options: [
        "لأن Dart بتحسّن الـ array بس",
        "لأن الـ array متجاورة فالـ CPU cache بيجيب عناصر كتير مع بعض، والـ nodes متفرقة وكل خطوة ممكن تكون cache miss",
        "لأن الـ linked list بتعمل sort في الخلفية",
        "لأن الـ array مفيهاش مؤشرات خالص",
      ],
      answer: 1,
      why: "الـ Big O بيتجاهل الثوابت، لكن الـ cache locality بتعمل فرق كبير في الواقع. الخيار الأخير غلط: الـ array فيها عناوين لكن بتتحسب بمعادلة.",
    },
    {
      q: "ليه الـ fast و slow pointers بيتقابلوا لو فيه cycle؟",
      options: [
        "لأن fast بيقفز على slow ويرجع",
        "لأن الاتنين بيبدأوا من الـ tail",
        "لأن slow بيسرّع في الدايرة",
        "لأن الفرق بينهم بيقل بواحد في كل خطوة جوه الدايرة لحد ما يبقى صفر",
      ],
      answer: 3,
      why: "fast بيقرب من slow بخطوة واحدة صافية في كل دورة، فمش ممكن يعدي من فوقه من غير ما يقف عليه.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final head = build([1, 2, 3, 4, 5]);
print(toList(removeNthFromEnd(head, 2)));` },
      answer: ["[1, 2, 3, 5]", "[1,2,3,5]"],
      why: "العنصر رقم 2 من الآخر هو 4، فبيتمسح وباقي القايمة زي ما هي.",
    },
    {
      q: "إيه مساحة الـ call stack في عكس linked list بالـ recursion؟",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      answer: 1,
      why: "كل node بتعمل استدعاء ومبيرجعش إلا لما اللي بعده يخلص، فالعمق n. الـ iterative بتستخدم مؤشرين بس: O(1).",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final a = build([1, 3, 5]);
final b = build([2, 3, 4]);
print(toList(mergeSorted(a, b)));` },
      options: ["[1, 2, 3, 3, 4, 5]", "[1, 3, 5, 2, 3, 4]", "[1, 2, 3, 4, 5]", "[5, 4, 3, 3, 2, 1]"],
      answer: 0,
      why: "الدمج بيسحب الأصغر من الرأسين كل مرة. الـ 3 المكررة بتفضل مرتين لأن الدمج مبيشيلش التكرار.",
    },
    {
      q: "عندك singly list فيها head و tail. أي عملية منهم لسه O(n)؟",
      options: ["<code>addFirst</code>", "<code>addLast</code>", "<code>removeFirst</code>", "<code>removeLast</code>"],
      answer: 3,
      why: "مسح آخر node محتاج تعدل <code>next</code> للـ node اللي قبلها، والـ tail pointer مش بيديك مؤشر لها فلازم تمشي من الـ head. الباقي O(1).",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final head = build([1, 2, 3]);
final r = reverseIterative(head);
print(r!.value);
print(head!.next);` },
      options: ["3 ثم null", "3 ثم Instance of 'Node&lt;int&gt;'", "1 ثم null", "1 ثم Instance of 'Node&lt;int&gt;'"],
      answer: 0,
      why: "بعد العكس الـ head القديم (القيمة 1) بقى هو آخر node وال next بتاعه null. المتغير head لسه بيشاور عليه، لكنه مبقاش بداية القايمة. الرأس الجديد هو r وقيمته 3.",
    },
  ],
};
