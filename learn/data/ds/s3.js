window.LEVELS = window.LEVELS || {};
window.LEVELS["ds/s3"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "الـ Stack: أبسط هيكل وأكتر واحد ظاهر في الإنترفيو",
      en: "Why stacks",
      body: "<p>الـ stack زي كوم أطباق: بتحط طبق جديد فوق، ولما تاخد طبق بتاخد اللي فوق. اسمه <b>LIFO</b>: Last In, First Out. بسيط لدرجة إنك هتستغرب ليه بيتسأل عليه كتير، والسبب إن مسائل كتير بتحتاج «ارجع لآخر حاجة فتحتها»: الأقواس، التعبيرات الحسابية، الـ undo، الـ recursion، الـ DFS.</p><p>في المستوى ده هنفهم العمليات وتكلفتها، نبني stack بطريقتين، نشوف إزاي الـ call stack في Dart هو stack فعلا، ونحل المسائل الكلاسيك: الأقواس المتوازنة، reverse Polish notation، min stack، next greater element بالـ monotonic stack، وundo/redo.</p>",
      points: [
        "<b>push</b> بيضيف فوق، <b>pop</b> بيشيل ويرجع اللي فوق، <b>peek</b> بيرجع اللي فوق من غير ما يشيله.",
        "التلات عمليات <code>O(1)</code> لأنهم بيلمسوا طرف واحد بس.",
        "أي وقت تحس إنك محتاج «أرجع لآخر حاجة اتأجلت»، فكر في stack.",
      ],
    },
    {
      title: "شكله والعمليات وليه O(1)",
      en: "LIFO, push, pop, peek",
      code: {
        lang: "text",
        src: `push(1)   push(2)   push(3)   pop() -> 3   peek() -> 2

                      +---+
                      | 3 | <- top
            +---+     +---+     +---+
            | 2 |     | 2 |     | 2 | <- top
  +---+     +---+     +---+     +---+
  | 1 |     | 1 |     | 1 |     | 1 |
  +---+     +---+     +---+     +---+

Everything happens at the top. Nothing in the middle is touched.`,
        note: "الـ stack مش بتسمح بالوصول للعناصر اللي في النص، وده مش عيب: القيد ده هو اللي بيخلي كل العمليات O(1) وبيعبر عن نية الكود («أنا بتعامل مع آخر عنصر بس»).",
      },
      points: [
        "<b>ليه O(1)؟</b> على array: <code>add</code> و<code>removeLast</code> (amortized في الإضافة). على linked list: تعديل الـ head بس.",
        "<b>pop/peek على stack فاضية</b> خطأ: لازم تفحص <code>isEmpty</code> أو ترمي exception واضحة.",
        "البحث عن عنصر جوه الـ stack O(n)، لو محتاجه كتير يبقى الـ stack مش الهيكل المناسب.",
      ],
      interview: [
        { q: "إيه هو الـ stack وإيه تكلفة عملياته؟", a: "هيكل LIFO: آخر عنصر دخل هو أول واحد يخرج. العمليات الأساسية push و pop و peek كلها O(1) لأنها بتشتغل على الطرف العلوي بس. بيتنفذ على array/list (إضافة ومسح من الآخر) أو على linked list (تعديل الـ head). ومن استخداماته: الـ call stack، والـ undo، ومطابقة الأقواس، وتقييم التعبيرات، والـ DFS." },
      ],
    },
    {
      title: "نبني Stack على List وعلى Linked List",
      en: "Implementation on a List and on a linked list",
      body: "<p>الاتنين بيدوا نفس الواجهة. الـ List أبسط وأسرع عمليا (cache). الـ linked list بتتجنب النسخة الدورية لما الـ array تكبر، وبتدي O(1) حقيقي (مش amortized) لكل push.</p>",
      code: {
        lang: "dart",
        src: `class ArrayStack<T> {
  final List<T> _items = [];

  int get length => _items.length;
  bool get isEmpty => _items.isEmpty;

  void push(T value) => _items.add(value);

  T pop() {
    if (_items.isEmpty) throw StateError('empty stack');
    return _items.removeLast();
  }

  T get peek {
    if (_items.isEmpty) throw StateError('empty stack');
    return _items.last;
  }
}

class _Node<T> {
  T value;
  _Node<T>? next;
  _Node(this.value, this.next);
}

class LinkedStack<T> {
  _Node<T>? _top;
  int _length = 0;

  int get length => _length;
  bool get isEmpty => _top == null;

  void push(T value) {
    _top = _Node(value, _top);   // new node points to the old top
    _length++;
  }

  T pop() {
    final top = _top;
    if (top == null) throw StateError('empty stack');
    _top = top.next;
    _length--;
    return top.value;
  }

  T get peek {
    final top = _top;
    if (top == null) throw StateError('empty stack');
    return top.value;
  }
}

void main() {
  final a = ArrayStack<int>();
  final b = LinkedStack<int>();
  for (final n in [1, 2, 3]) {
    a.push(n);
    b.push(n);
  }
  print(a.pop());     // 3
  print(b.pop());     // 3
  print(a.peek);      // 2
  print(b.length);    // 2
  try {
    ArrayStack<int>().pop();
  } on StateError catch (e) {
    print(e.message);   // empty stack
  }
}`,
        note: "في الـ linked stack بنضيف ونشيل من الـ head، لأن الـ head هو الطرف الوحيد اللي بنوصله في O(1) في singly list. مفيش طريقة نشيل بيها من الذيل بسهولة.",
      },
      interview: [
        { q: "إزاي تبني stack؟ array ولا linked list، وإيه الفرق؟", a: "الاتنين بيدوا push و pop و peek بـ O(1). على array/List بستخدم add و removeLast: بسيط وسريع عمليا بسبب الـ cache، والـ push amortized O(1) لأن الـ array ممكن تتنسخ لما تكبر. على linked list بحط الـ node الجديدة قدام الـ head وبشيل من الـ head: O(1) حقيقي لكن كل عنصر ليه node ومؤشر وتخصيص ذاكرة. في الأغلب بختار الـ List. المهم أحط فحص للـ underflow (pop على فاضية)." },
      ],
    },
    {
      title: "الـ call stack هو stack فعلا",
      en: "The call stack and stack overflow",
      body: "<p>لما دالة تنادي دالة تانية، البرنامج بيحتفظ بـ <b>frame</b> لكل نداء فيه الـ arguments والمتغيرات المحلية ومكان الرجوع. الـ frames دي بتتحط فوق بعض: آخر دالة اتنادت هي أول واحدة بتخلص. ده stack بالظبط، والـ recursion بتستخدمه.</p>",
      code: {
        lang: "text",
        title: "factorial(3) while it runs",
        src: `call factorial(3)       call factorial(1)       return chain
+--------------+        +--------------+        factorial(1) -> 1
| factorial(1) |  <-top | factorial(1) |        factorial(2) -> 2 * 1 = 2
| factorial(2) |        | factorial(2) |        factorial(3) -> 3 * 2 = 6
| factorial(3) |        | factorial(3) |
| main         |        | main         |        frames pop in reverse order.
+--------------+        +--------------+`,
      },
      codes: [
        {
          lang: "dart",
          src: `int factorial(int n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

int forever(int n) => forever(n + 1) + 1;   // no base case

void main() {
  print(factorial(5));   // 120
  try {
    forever(0);
  } on StackOverflowError {
    print('stack overflow caught');
  }
}`,
          note: "الـ call stack ليه حجم محدود. recursion من غير base case (أو عميقة جدا، مثلا على قايمة مليون عنصر) بتملاه فيرمي Dart الـ <code>StackOverflowError</code>. وبعد ما بيحصل، الأفضل تصلح الكود مش تمسك الـ error.",
        },
      ],
      points: [
        "أي recursion ممكن تتحول لـ loop بـ stack بتاعك إنت (<code>List</code>) بدل الـ call stack. ده بيعدي حد العمق، وبنعمله في DFS على graphs عميقة.",
        "الـ recursion بتكلف O(عمق الاستدعاء) مساحة حتى لو مفيش حاجة بتتحجز صراحة.",
      ],
      interview: [
        { q: "إيه هو stack overflow وإزاي بيحصل؟", a: "كل نداء دالة بيحجز frame على الـ call stack، وحجم الـ stack محدود. لو الـ recursion مفيهاش base case صح، أو عمقها كبير جدا، الـ frames بتتراكم لحد ما المساحة تخلص فالبرنامج يرمي StackOverflowError (في Dart). الحل: أصلح الـ base case، أو حول الـ recursion لـ loop بـ stack explicit بتبنيه من <code>List</code>، أو استخدم حل iterative." },
      ],
    },
    {
      title: "الأقواس المتوازنة",
      en: "Balanced brackets",
      body: "<p>أول مسألة stack. كل قوس مفتوح لازم يتقفل بنفس النوع وبالترتيب الصح (آخر واحد اتفتح هو أول واحد يتقفل: LIFO بالظبط). حيلة نضيفة: بدل ما نحط القوس المفتوح، نحط <b>القوس المقفول المتوقع</b>. وقتها أي قوس مقفول جاي لازم يساوي اللي فوق الـ stack.</p>",
      code: {
        lang: "dart",
        src: `bool isBalanced(String s) {
  const pairs = {'(': ')', '[': ']', '{': '}'};
  final expected = <String>[];
  for (final ch in s.split('')) {
    if (pairs.containsKey(ch)) {
      expected.add(pairs[ch]!);
    } else if (pairs.containsValue(ch)) {
      if (expected.isEmpty || expected.removeLast() != ch) return false;
    }
  }
  return expected.isEmpty;
}

void main() {
  print(isBalanced('{[()]}'));     // true
  print(isBalanced('([)]'));       // false: wrong order
  print(isBalanced('(()'));        // false: left open
  print(isBalanced(')('));         // false: closes before opening
  print(isBalanced(''));           // true
  print(isBalanced('a(b)c'));      // true: other characters are ignored
}`,
        note: "O(n) زمن، و O(n) مساحة في أسوأ حالة (كل النص أقواس مفتوحة). الحالتين اللي بتتنسى: stack فاضية وجه قوس مقفول، وأقواس مفتوحة فاضلة في الآخر.",
      },
      interview: [
        { q: "اكتب فحص الأقواس المتوازنة، وليه stack؟", a: "لأن آخر قوس اتفتح لازم يكون أول واحد يتقفل، وده LIFO. بلف على النص: القوس المفتوح بحط مقابله المقفول في الـ stack. القوس المقفول لازم الـ stack تكون مش فاضية والقيمة اللي فوقها تساويه، غير كده false. في الآخر النص متوازن لو الـ stack فاضية. O(n) زمن و O(n) مساحة. وبحط في بالي الحالات: نص فاضي، أقواس فاضلة، وقوس مقفول في الأول." },
      ],
    },
    {
      title: "Reverse Polish Notation",
      en: "Evaluating reverse Polish notation",
      body: "<p>في الـ RPN (postfix) العملية بتيجي <b>بعد</b> أرقامها: <code>3 4 +</code> يعني 3 + 4. فمفيش حاجة اسمها أقواس أو أولوية عمليات. التقييم بيستخدم stack: الرقم يتحط، والعملية تسحب آخر رقمين وتحط النتيجة. الحذر: الرقم اللي اتسحب <b>أول</b> هو الطرف الأيمن (<code>b</code>) والتاني هو الأيسر (<code>a</code>).</p>",
      code: {
        lang: "dart",
        src: `int evalRpn(List<String> tokens) {
  const ops = {'+', '-', '*', '/'};
  final stack = <int>[];
  for (final t in tokens) {
    if (ops.contains(t)) {
      final b = stack.removeLast();   // right operand comes off first
      final a = stack.removeLast();
      stack.add(switch (t) {
        '+' => a + b,
        '-' => a - b,
        '*' => a * b,
        _ => a ~/ b,                  // truncates toward zero
      });
    } else {
      stack.add(int.parse(t));
    }
  }
  return stack.removeLast();
}

void main() {
  print(evalRpn(['2', '1', '+', '3', '*']));        // 9   ((2 + 1) * 3)
  print(evalRpn(['4', '13', '5', '/', '+']));       // 6   (4 + 13 / 5)
  print(evalRpn(['10', '3', '-']));                 // 7
  print(evalRpn(['7']));                            // 7
  print(evalRpn(['-7', '2', '/']));                 // -3
}`,
        note: "القسمة على صفر هتبوظ البرنامج بـ exception، فاسأل المُقابِل لو المدخلات مضمونة. مدخلات المسألة غالبا صحيحة، فمبنفحصش الـ underflow هنا.",
      },
      pitfall: "عكس ترتيب الـ operands في الطرح والقسمة: <code>a - b</code> مش <code>b - a</code>. في الجمع والضرب مفيش فرق فالغلط بيستخبى.",
      interview: [
        { q: "إزاي تقيّم تعبير postfix (RPN)؟", a: "بلف على الـ tokens: لو رقم بحطه في stack. لو عملية بسحب رقمين: الأول اللي يخرج هو الطرف الأيمن والتاني الأيسر، بحسب النتيجة وبحطها تاني. في الآخر الـ stack فيها رقم واحد هو الناتج. O(n) زمن. الميزة إن RPN مفيهاش أقواس ولا أولويات، وده سبب إن الـ compilers والآلات الحاسبة بتحول التعبير العادي لـ postfix الأول." },
      ],
    },
    {
      title: "Min Stack: أصغر قيمة في O(1)",
      en: "Min stack",
      body: "<p>مطلوب stack بتضيف وتشيل وتعرف <b>أصغر عنصر فيها</b> كل ده في O(1). المشكلة: لو شلنا الأصغر محتاجين نعرف التاني الأصغر. الحل: stack تانية موازية بتحفظ «الأصغر لحد هنا» عند كل مستوى. لما نشيل من الاتنين مع بعض، الأصغر بيرجع لقيمته السابقة أوتوماتيك.</p>",
      code: {
        lang: "dart",
        src: `class MinStack {
  final List<int> _items = [];
  final List<int> _mins = [];   // _mins[i] = smallest of _items[0..i]

  void push(int value) {
    _items.add(value);
    _mins.add(_mins.isEmpty || value < _mins.last ? value : _mins.last);
  }

  int pop() {
    _mins.removeLast();
    return _items.removeLast();
  }

  int get peek => _items.last;
  int get min => _mins.last;
}

void main() {
  final s = MinStack();
  for (final v in [5, 3, 7, 3]) {
    s.push(v);
  }
  print(s.min);   // 3
  s.pop();
  print(s.min);   // 3  (the other 3 is still there)
  s.pop();
  print(s.min);   // 3
  s.pop();
  print(s.min);   // 5
}`,
        note: "الزمن O(1) لكل عملية، والمساحة O(n) إضافية. وبنخزن الأصغر حتى لو القيمة الجديدة بتساويه، فالتكرار (3 مرتين) مبيبوظش الحساب.",
      },
      interview: [
        { q: "صمم stack فيها getMin بـ O(1).", a: "باحتفظ بـ stack تانية موازية فيها أصغر قيمة لحد كل مستوى. عند push بحط القيمة في الأولى، وبحط في التانية الأصغر بين القيمة الجديدة وآخر قيمة في التانية. عند pop بشيل من الاتنين. <code>getMin</code> هي آخر عنصر في التانية. كل العمليات O(1) والمساحة O(n) زيادة. لازم أحط في الحسبان التكرار: لو مخزنتش غير القيم الأصغر بس لازم أتعامل مع التساوي." },
      ],
    },
    {
      title: "Monotonic stack: next greater element",
      en: "Monotonic stack",
      body: "<p>لكل عنصر في مصفوفة عايزين <b>أول عنصر أكبر منه على يمينه</b>. الحل الغاشم لفتين: O(n²). الحل بالـ stack: نمشي على المصفوفة مرة واحدة ونحتفظ بـ stack فيها <b>index العناصر اللي لسه ملقتش لها أكبر</b>، وقيمها دايما متناقصة من تحت لفوق (عشان كده اسمها monotonic). لما يجي عنصر أكبر من اللي فوق الـ stack، يبقى هو الإجابة لكل العناصر الأصغر منه فنسحبهم.</p>",
      code: {
        lang: "dart",
        src: `List<int> nextGreater(List<int> a) {
  final result = List.filled(a.length, -1);
  final stack = <int>[];   // indexes still waiting, values decreasing
  for (var i = 0; i < a.length; i++) {
    while (stack.isNotEmpty && a[stack.last] < a[i]) {
      result[stack.removeLast()] = a[i];
    }
    stack.add(i);
  }
  return result;
}

void main() {
  print(nextGreater([2, 1, 2, 4, 3]));   // [4, 2, 4, -1, -1]
  print(nextGreater([5, 4, 3]));         // [-1, -1, -1]
  print(nextGreater([1, 2, 3]));         // [2, 3, -1]
  print(nextGreater([]));                // []
}`,
        note: "اللي لسه في الـ stack في الآخر ملقاش أكبر منه فبيفضل -1. كل index بيتحط مرة وبيتسحب مرة على الأكتر، فالمجموع <b>O(n)</b> رغم إن فيه while جوه for.",
      },
      points: [
        "نفس الفكرة بتحل: Daily Temperatures، Stock Span، أكبر مستطيل في histogram.",
        "الدليل إنها O(n): while مش بتتكرر أكتر من عدد الـ push الكلي.",
      ],
      interview: [
        { q: "ليه الحل بالـ monotonic stack هو O(n) مع إن فيه while جوه for؟", a: "لأن كل عنصر بيدخل الـ stack مرة واحدة ويخرج مرة واحدة على الأكتر. مجموع مرات تنفيذ جسم الـ while على كل الـ for هو عدد الـ pops، وده مش أكتر من n. فالمجموع O(n) (amortized) مش O(n²). الـ stack بتحتفظ بالعناصر اللي لسه مستنية أول عنصر أكبر منها، وقيمها متناقصة، لأن أي عنصر أكبر بيسحب كل الأصغر." },
      ],
    },
    {
      title: "Undo / Redo وزر Back",
      en: "Undo, redo and browser back",
      body: "<p>الـ undo و redo من أحسن أمثلة الـ stack: stack للحالات السابقة وstack للحالات اللي اتلغت. لما تكتب حاجة جديدة بتمسح الـ redo (التاريخ اتفرع). نفس النموذج هو زر Back و Forward في المتصفح، وكمان الـ Navigator في Flutter (كل شاشة <code>push</code> وزر الرجوع <code>pop</code>).</p>",
      code: {
        lang: "dart",
        src: `class Editor {
  String text = '';
  final List<String> _undo = [];
  final List<String> _redo = [];

  void type(String s) {
    _undo.add(text);
    _redo.clear();      // a new edit invalidates the redo history
    text += s;
  }

  void undo() {
    if (_undo.isEmpty) return;
    _redo.add(text);
    text = _undo.removeLast();
  }

  void redo() {
    if (_redo.isEmpty) return;
    _undo.add(text);
    text = _redo.removeLast();
  }
}

void main() {
  final e = Editor();
  e.type('He');
  e.type('llo');
  print(e.text);   // Hello
  e.undo();
  print(e.text);   // He
  e.redo();
  print(e.text);   // Hello
  e.undo();
  e.type('y');     // clears redo
  e.redo();        // nothing to redo
  print(e.text);   // Hey
}`,
        note: "الـ editors الحقيقية مبتخزنش النص كله كل مرة، بتخزن الفرق (command أو diff). الفكرة (stackين) واحدة.",
      },
      interview: [
        { q: "إزاي تبني undo/redo؟", a: "بستخدم stackين: undo فيها الحالات السابقة، و redo فيها الحالات اللي اتلغت. أي تعديل جديد بيحط الحالة الحالية في undo ويمسح redo. الـ undo بتنقل الحالة الحالية لـ redo وترجع آخر حالة من undo، والـ redo بالعكس. نفس الفكرة في back/forward في المتصفح." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: Stack على List",
      lang: "dart",
      code: `class Stack<T> {
  final List<T> _items = [];

  bool get isEmpty => _items.isEmpty;
  int get length => _items.length;

  void push(T value) => _items.add(value);

  T pop() {
    if (_items.isEmpty) throw StateError('empty stack');
    return _items.removeLast();
  }
}`,
    },
    {
      title: "اكتب: Min stack",
      lang: "dart",
      code: `class MinStack {
  final List<int> _items = [];
  final List<int> _mins = [];

  void push(int value) {
    _items.add(value);
    _mins.add(_mins.isEmpty || value < _mins.last ? value : _mins.last);
  }

  int pop() {
    _mins.removeLast();
    return _items.removeLast();
  }

  int get min => _mins.last;
}`,
    },
    {
      title: "اكتب: الأقواس المتوازنة",
      lang: "dart",
      code: `bool isBalanced(String s) {
  const pairs = {'(': ')', '[': ']', '{': '}'};
  final expected = <String>[];
  for (final ch in s.split('')) {
    if (pairs.containsKey(ch)) {
      expected.add(pairs[ch]!);
    } else if (pairs.containsValue(ch)) {
      if (expected.isEmpty) return false;
      if (expected.removeLast() != ch) return false;
    }
  }
  return expected.isEmpty;
}`,
    },
  ],

  tasks: [
    {
      title: "الأقواس المتوازنة مع تجاهل الباقي",
      lang: "dart",
      prompt: "<p>اكتب <code>bool isBalanced(String s)</code> بترجع <code>true</code> لو كل قوس من <code>( [ {</code> ليه قوس إغلاق من نفس النوع وبالترتيب الصح. أي حرف تاني يتجاهل. نص فاضي = <code>true</code>.</p>",
      examples: [
        { in: "isBalanced('{[()]}')", out: "true" },
        { in: "isBalanced('f(a[0], {b})')", out: "true" },
        { in: "isBalanced('(]')", out: "false" },
        { in: "isBalanced('(()')", out: "false" },
      ],
      starter: `bool isBalanced(String s) {
  // your code
}`,
      hints: [
        "استخدم List كـ stack. كل قوس مفتوح حط مكانه القوس المقفول المتوقع.",
        "القوس المقفول لازم الـ stack تكون مش فاضية وآخر قيمة فيها تساويه. وفي الآخر الـ stack فاضية.",
      ],
      solution: `bool isBalanced(String s) {
  const pairs = {'(': ')', '[': ']', '{': '}'};
  final expected = <String>[];
  for (final ch in s.split('')) {
    if (pairs.containsKey(ch)) {
      expected.add(pairs[ch]!);
    } else if (pairs.containsValue(ch)) {
      if (expected.isEmpty || expected.removeLast() != ch) return false;
    }
  }
  return expected.isEmpty;
}`,
      explain: "O(n) زمن و O(n) مساحة. الشرط <code>expected.isEmpty ||</code> لازم يجي الأول عشان <code>removeLast</code> على فاضية ترمي error (short-circuit بيحمينا). والنقطة اللي بتتنسى: في الآخر لازم نفحص إن الـ stack فاضية.",
    },
    {
      title: "تقييم RPN",
      lang: "dart",
      prompt: "<p>اكتب <code>int evalRpn(List&lt;String&gt; tokens)</code> بتقيّم تعبير postfix فيه الأرقام الصحيحة و <code>+ - * /</code>. القسمة بتقطع ناحية الصفر (<code>~/</code>). المدخلات صحيحة دايما ومفيش قسمة على صفر.</p>",
      examples: [
        { in: "['2', '1', '+', '3', '*']", out: "9" },
        { in: "['4', '13', '5', '/', '+']", out: "6" },
        { in: "['10', '3', '-']", out: "7" },
      ],
      starter: `int evalRpn(List<String> tokens) {
  // your code
}`,
      hints: [
        "لو الـ token رقم حطه في stack. لو عملية اسحب رقمين.",
        "اللي يطلع الأول هو <code>b</code> (يمين) والتاني <code>a</code> (شمال). الطرح <code>a - b</code>.",
      ],
      solution: `int evalRpn(List<String> tokens) {
  const ops = {'+', '-', '*', '/'};
  final stack = <int>[];
  for (final t in tokens) {
    if (ops.contains(t)) {
      final b = stack.removeLast();
      final a = stack.removeLast();
      stack.add(switch (t) {
        '+' => a + b,
        '-' => a - b,
        '*' => a * b,
        _ => a ~/ b,
      });
    } else {
      stack.add(int.parse(t));
    }
  }
  return stack.removeLast();
}`,
      explain: "O(n) زمن و O(n) مساحة في أسوأ حالة. ترتيب السحب (b قبل a) هو اللي بيحافظ على معنى الطرح والقسمة. <code>~/</code> بتقطع ناحية الصفر زي ما المسألة بتطلب (-7 ~/ 2 = -3).",
    },
    {
      title: "Daily Temperatures",
      lang: "dart",
      prompt: "<p>معاك درجات حرارة كل يوم. اكتب <code>List&lt;int&gt; dailyTemperatures(List&lt;int&gt; temps)</code> بترجع لكل يوم <b>كام يوم لازم تستنى</b> لحد يوم أدفى. لو مفيش يوم أدفى بعده رجع 0. المطلوب O(n).</p>",
      examples: [
        { in: "[73, 74, 75, 71, 69, 72, 76, 73]", out: "[1, 1, 4, 2, 1, 1, 0, 0]" },
        { in: "[30, 40, 50]", out: "[1, 1, 0]" },
        { in: "[]", out: "[]" },
      ],
      starter: `List<int> dailyTemperatures(List<int> temps) {
  // your code
}`,
      hints: [
        "monotonic stack من الـ indexes اللي لسه مستنية يوم أدفى.",
        "لما اليوم الحالي أدفى من اللي فوق الـ stack، اسحبه وسجل <code>i - index</code>.",
      ],
      solution: `List<int> dailyTemperatures(List<int> temps) {
  final result = List.filled(temps.length, 0);
  final stack = <int>[];
  for (var i = 0; i < temps.length; i++) {
    while (stack.isNotEmpty && temps[stack.last] < temps[i]) {
      final j = stack.removeLast();
      result[j] = i - j;
    }
    stack.add(i);
  }
  return result;
}`,
      explain: "نفس فكرة next greater لكن بنسجل الفرق في الـ index بدل القيمة. O(n) لأن كل index بيتسحب مرة. المقارنة <code>&lt;</code> الصارمة لأن المطلوب يوم <b>أدفى</b> مش مساوي. اللي يفضل في الـ stack بيفضل 0.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final s = <int>[];
s.add(1);
s.add(2);
s.add(3);
s.removeLast();
s.removeLast();
print(s.last);` },
      answer: ["1"],
      why: "الإضافة والمسح من الآخر = stack. بعد مسح 3 ثم 2 فاضل 1 بس.",
    },
    {
      q: "إيه اللي بيحصل لو عملت <code>removeLast()</code> على List فاضية؟",
      options: ["بترجع null", "بترجع 0", "بترمي <code>StateError</code>", "مبتعملش حاجة وبترجع void"],
      answer: 2,
      why: "<code>removeLast</code> بترجع عنصر من نوع T (مش nullable)، فعلى قايمة فاضية بترمي StateError. عشان كده الـ stack بتاعتك لازم تفحص <code>isEmpty</code> قبل pop.",
    },
    {
      q: "أنسب هيكل لـ undo في محرر نصوص؟",
      options: ["Queue", "Hash set", "Linked list بتتمشى من الأول", "Stack"],
      answer: 3,
      why: "آخر تعديل هو أول واحد يتلغي: LIFO. الـ queue كانت هتلغي أقدم تعديل.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print(nextGreater([2, 1, 2, 4, 3]));` },
      answer: ["[4, 2, 4, -1, -1]", "[4,2,4,-1,-1]"],
      why: "الأول (2): أول أكبر منه على يمينه 4 (مش التاني 2 لأنه مساوي مش أكبر). الثاني (1): 2. الثالث (2): 4. والـ 4 والـ 3 ملهمش أكبر منهم فـ -1.",
    },
    {
      q: "ليه الـ monotonic stack في next greater element هي O(n)؟",
      options: [
        "عشان كل عنصر بيدخل الـ stack مرة ويخرج مرة على الأكتر",
        "عشان الـ while بتتنفذ مرة واحدة بس في الكل",
        "عشان المصفوفة بتتقسم نصين كل مرة",
        "عشان الـ stack بتفضل دايما فيها عنصر واحد",
      ],
      answer: 0,
      why: "مجموع كل الـ pops مش بيعدي n. الـ while جوه for بتبان O(n²) لكنها amortized O(n). الاختيار التاني غلط: الـ while ممكن تتنفذ أكتر من مرة في الدورة الواحدة.",
    },
    {
      q: "الناتج إيه؟ (RPN)",
      code: { lang: "dart", src: `print(evalRpn(['2', '1', '+', '3', '*']));` },
      answer: ["9"],
      why: "2 1 + = 3، وبعدين 3 3 * = 9. أي (2 + 1) * 3.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print(isBalanced('{[]}('));` },
      options: ["true", "false لأن فيه قوس مفتوح فاضل في الآخر", "false لأن الأقواس اتداخلت غلط", "بيرمي exception"],
      answer: 1,
      why: "الجزء <code>{[]}</code> متوازن، لكن آخر <code>(</code> اتفتح ومحدش قفله، فالـ stack مش فاضية في الآخر والنتيجة false.",
    },
    {
      q: "إيه سبب <code>StackOverflowError</code> في دالة recursive؟",
      options: [
        "الدالة بتستهلك رام كتير من الـ heap",
        "العدد بيعدي حجم int",
        "الـ frames متراكمة على الـ call stack (مفيش base case أو العمق كبير) لحد ما تخلص مساحتها",
        "الدالة بتنادي نفسها مرتين في الدورة",
      ],
      answer: 2,
      why: "كل نداء بيحجز frame على الـ call stack المحدودة. النداء مرتين (زي fibonacci) بيبطأ بس مش هو سبب الـ overflow؛ العمق هو السبب.",
    },
    {
      q: "الناتج إيه؟ (MinStack اتحط فيها 5 ثم 3 ثم 7 ثم 3، وبعدين اتعمل pop مرتين)",
      code: { lang: "dart", src: `final s = MinStack();
for (final v in [5, 3, 7, 3]) {
  s.push(v);
}
s.pop();
s.pop();
print(s.min);` },
      answer: ["3"],
      why: "بعد pop للـ 3 وال 7 فاضل 5 و 3، فالأصغر 3.",
    },
    {
      q: "في الـ linked stack ليه بنضيف ونشيل من الـ head مش من الذيل؟",
      options: [
        "عشان الذيل ممنوع في Dart",
        "عشان الـ head بيتخزن في cache أسرع",
        "عشان الـ stack لازم تكون معكوسة",
        "عشان الـ head هو الطرف الوحيد اللي بنضيف ونشيل منه في O(1) في singly list",
      ],
      answer: 3,
      why: "مسح آخر node في singly list محتاج المشي على القايمة O(n) عشان نوصل للي قبله. تعديل الـ head دايما O(1).",
    },
  ],
};
