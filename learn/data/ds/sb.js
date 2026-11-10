window.LEVELS = window.LEVELS || {};
window.LEVELS["ds/sb"] = {
  boss: [
    {
      q: "قارن الـ array (<code>List</code>) بالـ linked list: تكلفة الوصول بالرقم، والبحث، والإدراج، والمسح. ولو الـ linked list إدراجها O(1)، ليه الـ List هي الافتراضية؟",
      a: "<p>الوصول بالرقم: array O(1) لأن العناصر متجاورة والعنوان بيتحسب بمعادلة، linked list O(n) لأنك بتمشي من الـ head. البحث بالقيمة O(n) في الاتنين. الإدراج والمسح: في الآخر array amortized O(1)، وفي الأول أو النص array O(n) لأنها بتزحزح العناصر، أما linked list فـ O(1) <b>لو معاك الـ node</b> بس (الوصول للمكان نفسه O(n)).</p><p>الـ List هي الافتراضية لأن الـ array متجاورة فالـ CPU cache بيشتغل كويس، وكل node في الـ linked list بتدفع header ومؤشر زيادة وتخصيص ذاكرة. فعمليا الـ array بتكسب حتى في عمليات «المفروض» تكسب فيها الـ linked list. بستخدم linked list لما أبني queue أو LRU cache، أو لما أنقل nodes بدون نسخ.</p>",
    },
    {
      q: "إيه اللي بيحصل لما <code>List</code> في Dart تمتلي وتضيف عنصر جديد؟ ولو الـ resize O(n) ليه بنقول <code>add</code> amortized O(1)؟",
      a: "<p>الـ list بتحجز array داخلية بسعة (capacity) أكبر من الطول. لما السعة تخلص، بتحجز array جديدة بسعة أكبر (تقريبا الضعف)، وبتنسخ كل العناصر القديمة ليها، وبعدين بتكمل الإضافة. النسخ ده O(n) لكنه نادر.</p><p>لو السعة بتتضاعف، النسخات بتحصل عند 1 و2 و4 و8... يعني مجموع شغل النسخ لحد n عنصر أقل من 2n. موزع على n إضافة ده ثابت لكل إضافة، فبنقول amortized O(1) (متوسط على سلسلة عمليات، وإضافة واحدة ممكن تبقى O(n)). الإدراج في الأول بيفضل O(n) لأنه بيزحزح كل العناصر.</p>",
    },
    {
      q: "إيه الفرق بين الـ stack والـ queue؟ وفين كل واحدة بتتستخدم؟ وإزاي تنفذهم في Dart؟",
      a: "<p>الـ stack LIFO: آخر عنصر دخل هو أول واحد يخرج؛ العمليات push و pop و peek كلها O(1). الـ queue FIFO: أول عنصر دخل أول واحد يخرج؛ enqueue و dequeue O(1) لو منفذة صح.</p><p>الـ stack للـ undo، وتوازن الأقواس، والـ call stack، وDFS، وتقييم التعبيرات. الـ queue للـ BFS، وطوابير المهام والرسايل، والـ buffers. في Dart الـ stack بتتنفذ على <code>List</code> بـ <code>add</code> و<code>removeLast</code> (الاتنين O(1))، والـ queue بـ <code>Queue</code> من <code>dart:collection</code> مع <code>addLast</code> و<code>removeFirst</code>. متستخدمش <code>list.removeAt(0)</code> للـ queue لأنها O(n).</p>",
    },
    {
      q: "اشرح إزاي الـ hash map بتشتغل من جوه. إيه الـ collision وإزاي تتحل؟ ولماذا بنقول O(1) في المتوسط مش دايما؟",
      a: "<p>array من الـ buckets. دالة hash بتحول المفتاح (<code>hashCode</code>) لرقم، والرقم modulo عدد الـ buckets بيحدد الخانة. بعدين بقارن المفتاح الفعلي بـ <code>==</code> داخل الخانة. الـ collision هو إن مفتاحين مختلفين يروحوا لنفس الخانة، وبيتحل بالـ chaining (كل خانة قايمة) أو open addressing (تدور على خانة فاضية تانية).</p><p>الـ load factor (العناصر ÷ الخانات) لما يعدي حوالي 0.75 الجدول بيكبر بالضعف ويعيد توزيع كل العناصر، وده O(n) نادر فالإضافة amortized O(1). والمتوسط O(1) مش مضمون لأن لو كل المفاتيح وقعت في خانة واحدة (hash سيء أو هجوم) البحث بيبقى O(n). وعشان المفتاح يشتغل لازم <code>==</code> و<code>hashCode</code> متسقين والمفتاح immutable.</p>",
    },
    {
      q: "Hash map ولا tree map (<code>SplayTreeMap</code> في Dart)؟ إمتى تختار كل واحدة؟",
      a: "<p>الـ hash map: lookup وإدراج ومسح O(1) في المتوسط، من غير ترتيب مفيد (الافتراضي بيحفظ ترتيب الإضافة). الـ tree map: كل عملية O(log n) (amortized في الـ splay tree) لكن المفاتيح <b>مرتبة دايما</b>.</p><p>باختار الـ hash map لمجرد الـ lookup بالمفتاح أو العدّ أو الـ cache، وهي الأغلب. باختار الـ tree map لما أحتاج الترتيب: المرور على المفاتيح بترتيبها، أصغر وأكبر مفتاح (<code>firstKey</code> و<code>lastKey</code>)، أو أقرب مفتاح قبل أو بعد قيمة (<code>lastKeyBefore</code> و<code>firstKeyAfter</code>) زي حجز مواعيد أو نطاقات أسعار. الترتيب في الـ hash map يحتاج sort O(n log n).</p>",
    },
    {
      q: "اختار الهيكل المناسب وبرر، لكل سيناريو: (1) زر Undo. (2) أعلى 10 نتايج من مليون نتيجة. (3) اقتراحات كتابة (autocomplete). (4) «هل المستخدمين A و B في نفس المجموعة» مع دمج مجموعات على الوقت. (5) أقصر عدد خطوات في متاهة. (6) تنفيذ LRU cache.",
      a: "<p>(1) <b>Stack</b>: آخر عملية هي أول ما نتراجع عنها (LIFO). (2) <b>min-heap بحجم 10</b>: لو الرقم الجديد أكبر من الـ root يستبدله؛ O(n log 10) ومساحة O(10) وبيشتغل على stream. (3) <b>Trie</b>: بنمشي على الـ prefix في O(L) ونجمع الكلمات تحته بترتيب أبجدي. (4) <b>Union-Find</b>: union و find تقريبا ثابتتين. (5) <b>graph ضمني + BFS بـ queue</b>: أول وصول للهدف هو أقصر مسار. (6) <b>hash map + doubly linked list</b>: الـ map بتدي lookup في O(1)، والـ list بتحافظ على ترتيب الاستخدام، فتحريك node لأول القايمة ومسح الأقدم من الآخر كلهم O(1).</p>",
    },
    {
      q: "عملت class اسمه <code>Point</code> واستخدمته مفتاح في <code>Map</code>. بعد كده الـ <code>containsKey</code> بترجع false لـ Point بنفس الإحداثيات، وفي مرة تانية entry اختفت بعد ما غيّرت حقل. إيه اللي حصل؟",
      a: "<p>الحالة الأولى: الـ class مفيهاش override لـ <code>==</code> و<code>hashCode</code> (الافتراضي بيقارن بالـ identity)، أو عملت override لـ <code>==</code> بس. الـ Map بتحسب الخانة من <code>hashCode</code> وتتأكد بـ <code>==</code>، فلازم الاتنين متسقين: لو a == b يبقى نفس الـ hashCode. الحل: override للاتنين على نفس الحقول، مثلا <code>Object.hash(x, y)</code>، أو استخدام record.</p><p>الحالة التانية: المفتاح mutable. لو غيرت حقل داخل في الـ hash بعد التخزين، الـ entry بتفضل في الخانة القديمة والبحث بيروح لخانة جديدة فمش بيلاقيها، وكمان الـ entry بتفضل محتلة مكان. الحل: خلي حقول المفتاح <code>final</code> أو متغيرش المفتاح بعد إدخاله.</p>",
    },
    {
      q: "ليه الـ BST ممكن تبقى O(n)؟ وإزاي الأشجار المتوازنة (AVL / red-black) بتحل ده؟ وإمتى أفضل hash map؟",
      a: "<p>تكلفة عمليات الـ BST هي O(h) الارتفاع. لو الإدراج مرتب (1، 2، 3...) كل node بتروح لنفس الجنب وبتبقى الشجرة سلسلة ارتفاعها n، فكل عملية O(n). الأشجار المتوازنة ذاتيا (AVL بتوازن صارم، red-black بتوازن مرن بالألوان) بتعمل rotations بعد كل إدراج أو مسح لتحافظ على الارتفاع O(log n) مضمون. الـ rotation تغيير كام مؤشر من غير ما تبوظ ترتيب الـ in-order.</p><p>الـ tree بتديني الترتيب وعمليات النطاق (أول، آخر، أقرب) بتكلفة O(log n)، لكن لو مش محتاج الترتيب فالـ hash map أسرع (O(1) متوسط). وفي Dart النسخة الجاهزة هي <code>SplayTreeMap</code> و<code>SplayTreeSet</code>.</p>",
    },
    {
      q: "عايز priority queue. ليه heap وليس array مرتبة أو BST؟ وإيه تكلفة كل عملية؟ وإزاي أبني heap من n عنصر؟",
      a: "<p>الـ heap شجرة كاملة بقاعدة «كل node أصغر من أولادها» (min-heap) مخزنة في array، والأب <code>(i-1)~/2</code> والأولاد <code>2i+1</code> و<code>2i+2</code>. الأصغر في <code>a[0]</code> فـ peek O(1)، والإدراج (sift up) والإخراج (sift down) O(log n). Array مرتبة: الإخراج من الأول سريع لكن الإدراج O(n). BST متوازنة: O(log n) للكل لكن أثقل وبمساحة مؤشرات، والـ heap أخف وأسهل وأحسن للـ cache.</p><p>بناء heap من n عنصر: بحط العناصر في array وأعمل sift down من آخر parent لورا لحد الـ root، وده O(n) (مش O(n log n)) لأن نص الـ nodes leaves وقليل جدا هو اللي بيتحرك مسافة كبيرة. الـ heap بتعجز عن البحث بقيمة (O(n)). في Dart الجاهز هو <code>PriorityQueue</code> من package اسمه <code>collection</code>، مش من الـ SDK الأساسي.</p>",
    },
    {
      q: "عندك مسألة بتتكلم عن علاقات بين حاجات. إزاي تقرر إنها graph؟ وإزاي تخزنه؟ وإمتى BFS وإمتى DFS؟",
      a: "<p>لو فيه كيانات وعلاقات بينها ومفيش هرم واضح (أصدقاء، طرق، متطلبات كورسات، خريطة، grid) فأنمذجها كـ graph: الكيانات vertices والعلاقات edges. بسأل: directed؟ weighted؟ فيه cycles؟ متصل؟</p><p>التخزين: الافتراضي adjacency list (<code>Map&lt;int, List&lt;int&gt;&gt;</code> أو <code>List&lt;List&lt;int&gt;&gt;</code>) بمساحة O(V + E). الـ adjacency matrix بمساحة O(V²) بتنفع للـ dense أو V صغير وفحص edge في O(1). الـ edge list لما بس بلف على الـ edges. الـ grid بتتعامل معاه كـ graph ضمني. BFS (queue) لأقصر مسار بعدد الـ edges من غير أوزان وللمستويات، DFS (stack أو recursion) للـ components وكشف cycles والـ topological sort. الاتنين O(V + E) ولازم seen set.</p>",
    },
    {
      q: "قارن الـ Union-Find بالـ DFS لمسائل الاتصال، وقارن الـ Trie بالـ HashSet للكلمات. وإيه تكلفة الـ Union-Find بالظبط؟",
      a: "<p>الـ DFS كويس لو الـ graph ثابت وسؤال واحد (كام component). الـ Union-Find أحسن لما الـ edges بتتضاف على الوقت وبتسأل «متصلين؟» كتير، لأن كل find/union تقريبا ثابتة، وهي كمان بتكشف إن edge بتقفل cycle (لما union ترجع false) وبتتستخدم في Kruskal. عيبها إنها بتدمج بس: مفيش مسح ولا مسارات. تكلفتها مع path compression و union by size هي amortized O(α(n)) حيث α معكوس Ackermann وما بتتعداش 4 عمليا، فتقريبا ثابتة بس مش O(1) حرفيا.</p><p>الـ Trie بتدي prefix queries في O(L) (طول الكلمة) وترتيب أبجدي مجانا، لكن بتاكل ذاكرة أكتر (node و Map لكل حرف). الـ HashSet أخف وبنفس O(L) لبحث الكلمة الكاملة، لكن «كل الكلمات تحت prefix» فيه بيتطلب مسح كل الكلمات.</p>",
    },
    {
      q: "اكتب دالة <code>bool isBalanced(String s)</code> بتتحقق إن الأقواس <code>()[]{}</code> متوازنة. اشرح الفكرة والتكلفة.",
      a: `<p>أستخدم stack: كل قوس فتح بيتحط فيه، وكل قوس قفل لازم يلاقي في قمة الـ stack قوس الفتح المطابق وإلا الجواب false. في الآخر الـ stack لازم تكون فاضية (وإلا فيه أقواس فتح من غير قفل). الأخطاء اللي بتتفحص: قفل على stack فاضية، وفتح من غير قفل. O(n) زمن و O(n) مساحة.</p>
<pre dir='ltr'><code>bool isBalanced(String s) {
  const pairs = {')': '(', ']': '[', '}': '{'};
  final stack = &lt;String&gt;[];
  for (final ch in s.split('')) {
    if (pairs.containsValue(ch)) {
      stack.add(ch);
    } else if (pairs.containsKey(ch)) {
      if (stack.isEmpty || stack.removeLast() != pairs[ch]) return false;
    }
  }
  return stack.isEmpty;
}

void main() {
  print(isBalanced('{[()]}'));   // true
  print(isBalanced('(]'));       // false
  print(isBalanced('(('));       // false
  print(isBalanced(')'));        // false
  print(isBalanced(''));         // true
}</code></pre>`,
    },
    {
      q: "اعكس linked list (singly). اكتب الكود واشرح الحالات الحدية.",
      a: `<p>بمشي مرة واحدة ومعايا مؤشرين: <code>prev</code> (بيبدأ null) و<code>cur</code> (بيبدأ head). في كل خطوة أحفظ <code>cur.next</code> في متغير قبل ما أغيره (وإلا أفقد باقي القايمة)، وأخلي <code>cur.next = prev</code>، وأحرك المؤشرين. في الآخر <code>prev</code> هو الـ head الجديد. الحالات الحدية: قايمة فاضية (بترجع null) وعنصر واحد. O(n) زمن و O(1) مساحة. النسخة الـ recursive أنيقة لكن بتستهلك O(n) من الـ call stack.</p>
<pre dir='ltr'><code>class Node {
  int val;
  Node? next;
  Node(this.val, [this.next]);
}

Node? reverse(Node? head) {
  Node? prev;
  var cur = head;
  while (cur != null) {
    final next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}

List&lt;int&gt; toList(Node? n) {
  final out = &lt;int&gt;[];
  for (var c = n; c != null; c = c.next) {
    out.add(c.val);
  }
  return out;
}

void main() {
  print(toList(reverse(Node(1, Node(2, Node(3))))));  // [3, 2, 1]
  print(toList(reverse(Node(7))));                    // [7]
  print(toList(reverse(null)));                       // []
}</code></pre>`,
    },
    {
      q: "Two Sum: عندك <code>List&lt;int&gt;</code> وقيمة target. رجّع indexes عنصرين مجموعهم target. حل في O(n) واشرح ليه بتفحص قبل ما تخزن.",
      a: `<p>الحل الغاشم لفتين O(n²). بدله بـ hash map من القيمة لـ index: لكل عنصر <code>x</code> بسأل الـ Map هل <code>target - x</code> اتشاف قبل كده؟ لو أيوه خلصت، وإلا بخزن x بمكانه. بفحص <b>قبل</b> التخزين عشان العنصر ميتحسبش شريك لنفسه (target 6 وفيه 3 واحدة بس). O(n) زمن و O(n) مساحة، وده نموذج لتحويل بحث O(n) داخل لوب لـ lookup O(1).</p>
<pre dir='ltr'><code>List&lt;int&gt; twoSum(List&lt;int&gt; nums, int target) {
  final seen = &lt;int, int&gt;{};   // value -&gt; index
  for (var i = 0; i &lt; nums.length; i++) {
    final j = seen[target - nums[i]];
    if (j != null) return [j, i];
    seen[nums[i]] = i;
  }
  return [];
}

void main() {
  print(twoSum([2, 7, 11, 15], 9));   // [0, 1]
  print(twoSum([3, 2, 4], 6));        // [1, 2]
  print(twoSum([3, 3], 6));           // [0, 1]
  print(twoSum([3], 6));              // []
  print(twoSum([], 1));               // []
}</code></pre>`,
    },
    {
      q: "اكتب <code>bool isValidBST(TreeNode? root)</code>. ما هو الغلط الشائع؟",
      a: `<p>الغلط الشائع إني أقارن كل node بأولادها المباشرين بس، وده بيعدي شجرة فيها node في يمين جد وهي أصغر منه. القاعدة على <b>كل</b> النسل. الحل: recursion ومعاها نطاق مسموح <code>(lo, hi)</code> أضيقه وأنا نازل: شمال الحد الأعلى بقى قيمة الـ node، ويمين الحد الأدنى بقى قيمتها. الحدود nullable بدل قيمة سحرية. المقارنة صارمة فالتكرار مرفوض. O(n) زمن و O(h) مساحة. بديل: in-order والتأكد إنه متزايد بالضبط.</p>
<pre dir='ltr'><code>class TreeNode {
  int val;
  TreeNode? left;
  TreeNode? right;
  TreeNode(this.val, [this.left, this.right]);
}

bool isValidBST(TreeNode? n, [int? lo, int? hi]) {
  if (n == null) return true;
  if (lo != null &amp;&amp; n.val &lt;= lo) return false;
  if (hi != null &amp;&amp; n.val &gt;= hi) return false;
  return isValidBST(n.left, lo, n.val) &amp;&amp; isValidBST(n.right, n.val, hi);
}

void main() {
  final good = TreeNode(8, TreeNode(3), TreeNode(10));
  final bad = TreeNode(5, TreeNode(1), TreeNode(6, TreeNode(3), TreeNode(7)));
  print(isValidBST(good));   // true
  print(isValidBST(bad));    // false: 3 is in the right subtree of 5
  print(isValidBST(null));   // true
}</code></pre>`,
    },
    {
      q: "اكتب Trie فيها <code>insert</code> و<code>search</code> و<code>startsWith</code>. ما تكلفتها؟ ولماذا نحتاج علم <code>isEnd</code>؟",
      a: `<p>كل node فيها Map من حرف لـ node ابن وعلم <code>isEnd</code>. العمليات الثلاث بتمشي على حروف الكلمة: <code>insert</code> بتنشئ الـ nodes الناقصة وتعلّم الأخيرة، <code>search</code> بتتأكد إن الطريق موجود وإن <code>isEnd</code> true، و<code>startsWith</code> بتتأكد إن الطريق موجود بس. الكل O(L) حيث L طول الكلمة، مش بيعتمد على عدد الكلمات. العلم مهم لأن 'car' لو مجرد prefix من 'cart' لازم search('car') ترجع false. الثمن ذاكرة أكبر من hash set.</p>
<pre dir='ltr'><code>class TrieNode {
  final Map&lt;String, TrieNode&gt; children = {};
  bool isEnd = false;
}

class Trie {
  final TrieNode _root = TrieNode();

  void insert(String word) {
    var node = _root;
    for (final ch in word.split('')) {
      node = node.children.putIfAbsent(ch, () =&gt; TrieNode());
    }
    node.isEnd = true;
  }

  TrieNode? _find(String s) {
    var node = _root;
    for (final ch in s.split('')) {
      final next = node.children[ch];
      if (next == null) return null;
      node = next;
    }
    return node;
  }

  bool search(String word) =&gt; _find(word)?.isEnd ?? false;
  bool startsWith(String prefix) =&gt; _find(prefix) != null;
}

void main() {
  final t = Trie();
  t.insert('cart');
  print(t.search('cart'));       // true
  print(t.search('car'));        // false
  print(t.startsWith('car'));    // true
  print(t.startsWith('cat'));    // false
  t.insert('car');
  print(t.search('car'));        // true
}</code></pre>`,
    },
  ],
};
