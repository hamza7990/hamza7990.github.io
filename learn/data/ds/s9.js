window.LEVELS = window.LEVELS || {};
window.LEVELS["ds/s9"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "هيكلين متخصصين: Trie و Union-Find",
      en: "Why tries and disjoint sets",
      body: "<p>الـ hash map والـ tree والـ heap بيغطوا أغلب الاحتياج. لكن فيه سؤالين بيتكرروا وبيعجزوا عنهم الهياكل دي أو بيعملوهم بتكلفة عالية:</p><p><b>1) «كل الكلمات اللي بتبدأ بـ ...»:</b> autocomplete، التحقق من prefix، قاموس كلمات. الـ hash set بتجاوب «الكلمة دي موجودة؟» لكن «فيه كلمة بتبدأ بـ pre؟» بتضطر تمسح كل الكلمات. الحل هو الـ <b>Trie</b> (prefix tree).</p><p><b>2) «A و B في نفس المجموعة؟» ومعاها «ادمج مجموعة A مع مجموعة B»:</b> شبكة بتتوصل، دوائر أصدقاء، صفحات مربوطة. الـ DFS بيجاوب مرة واحدة، لكن لو الـ edges بتتضاف على مدار الوقت هتعيد الشغل كل مرة. الحل هو <b>Union-Find</b> (disjoint set union): عمليتين بتكلفة تقريبا ثابتة.</p>",
      points: [
        "الـ Trie: بيحول «prefix query» من مسح كل الكلمات O(N·L) لمشي بطول الـ prefix بس O(L).",
        "الـ Union-Find: بيفضل يدمج مجموعات ويجاوب «نفس المجموعة؟» في وقت تقريبا ثابت.",
        "الاتنين صغيرين في الكود (20 سطر) ومنتشرين في الإنترفيو، فاكتبهم من الذاكرة.",
      ],
    },
    {
      title: "الـ Trie: كل حرف node",
      en: "The trie structure",
      body: "<p>الـ trie شجرة كل node فيها تمثل <b>prefix</b>، وكل edge بتمثل حرف. الكلمات اللي بتبدأ بنفس الحروف <b>بتتشارك نفس الطريق</b> من الـ root. كل node فيها: <code>children</code> (Map من حرف لـ node) وعلم <code>isEnd</code> بيقول «في كلمة بتخلص هنا». العلم ضروري: <code>car</code> هي prefix من <code>cart</code>، ولازم نفرق بين «car كلمة محفوظة» و«car مجرد prefix».</p>",
      code: {
        lang: "text",
        title: "words: car, cart, cat, dog",
        src: `(root)
  |-- c
  |   \`-- a
  |       |-- r  (end: "car")
  |       |   \`-- t  (end: "cart")
  |       \`-- t  (end: "cat")
  \`-- d
      \`-- o
          \`-- g  (end: "dog")

13 letters in the words, 8 nodes in the trie (c, a, r are shared).
to find "ca": follow c -> a (2 steps), the node exists -> prefix found
to find "cab": c -> a -> no child 'b' -> not found`,
        note: "عدد الخطوات في أي عملية = طول الكلمة (L) مهما كان عدد الكلمات المخزنة. ده الفرق الأساسي عن الـ BST اللي بتقارن كلمات كاملة.",
      },
      terms: [
        ["prefix", "بادئة", "بداية الكلمة: 'ca' بادئة 'car' و'cat'."],
        ["trie / prefix tree", "شجرة البادئات", "شجرة كل node فيها حرف، والطريق من الـ root هو الـ prefix."],
        ["isEnd", "علم النهاية", "بيقول إن في كلمة مخزنة بتنتهي عند الـ node دي."],
      ],
    },
    {
      title: "نكتب Trie: insert و search و startsWith",
      en: "Implementing a trie",
      body: "<p>الثلاث عمليات كلها بتمشي على حروف الكلمة. <b>insert</b>: امش، وأنشئ node لأي حرف ناقص، وعلّم الأخيرة <code>isEnd</code>. <b>search</b>: امش، لو وقفت (حرف ناقص) يبقى مش موجودة، ولو وصلت لازم <code>isEnd == true</code>. <b>startsWith</b>: نفس المشي لكن مش محتاجين <code>isEnd</code>. بنفصل المشي المشترك في <code>_find</code>.</p>",
      code: {
        lang: "dart",
        src: `class TrieNode {
  final Map<String, TrieNode> children = {};
  bool isEnd = false;
}

class Trie {
  final TrieNode _root = TrieNode();

  void insert(String word) {
    var node = _root;
    for (final ch in word.split('')) {
      node = node.children.putIfAbsent(ch, () => TrieNode());
    }
    node.isEnd = true;
  }

  TrieNode? _find(String prefix) {
    var node = _root;
    for (final ch in prefix.split('')) {
      final next = node.children[ch];
      if (next == null) return null;
      node = next;
    }
    return node;
  }

  bool search(String word) => _find(word)?.isEnd ?? false;
  bool startsWith(String prefix) => _find(prefix) != null;

  // up to \`limit\` words with this prefix, in alphabetical order
  List<String> withPrefix(String prefix, {int limit = 10}) {
    final start = _find(prefix);
    final out = <String>[];
    if (start == null) return out;

    void walk(TrieNode n, String acc) {
      if (out.length >= limit) return;
      if (n.isEnd) out.add(acc);
      for (final ch in n.children.keys.toList()..sort()) {
        walk(n.children[ch]!, acc + ch);
      }
    }

    walk(start, prefix);
    return out;
  }

  int get nodeCount {
    int count(TrieNode n) =>
        1 + n.children.values.fold(0, (s, c) => s + count(c));
    return count(_root) - 1;   // do not count the root
  }
}

void main() {
  final t = Trie();
  for (final w in ['car', 'cart', 'cat', 'dog']) {
    t.insert(w);
  }
  print(t.search('car'));          // true
  print(t.search('ca'));           // false: only a prefix
  print(t.startsWith('ca'));       // true
  print(t.startsWith('x'));        // false
  print(t.withPrefix('ca'));       // [car, cart, cat]
  print(t.withPrefix('ca', limit: 2));   // [car, cart]
  print(t.withPrefix('z'));        // []
  print(t.withPrefix('').length);  // 4
  print(t.nodeCount);              // 8
  print(t.search(''));             // false: the empty word was not inserted
  t.insert('');
  print(t.search(''));             // true
}`,
        note: "الزمن O(L) لـ insert و search و startsWith، حيث L طول الكلمة، مش عدد الكلمات. <code>split('')</code> بتقسم لوحدات UTF-16 فالكود سليم للحروف العربية واللاتينية، لكن مش للإيموجي (وحدتين). في الإنتاج ممكن تستخدم <code>runes</code>.",
      },
      interview: [
        { q: "اشرح الـ trie وتكلفة العمليات. إيه دور isEnd؟", a: "الـ trie شجرة كل node فيها Map من حرف لـ node ابن وعلم <code>isEnd</code>. الكلمات بتتشارك الـ prefix. insert و search و startsWith كلهم O(L) حيث L طول الكلمة (مش بيعتمد على عدد الكلمات). الـ <code>isEnd</code> مهم لأنه بيفرق كلمة مخزنة عن مجرد prefix: 'car' و 'cart' لو أدخلت 'cart' بس، search('car') لازم ترجع false رغم إن الطريق موجود. الـ startsWith بتتجاهل العلم." },
      ],
    },
    {
      title: "Autocomplete، والـ Trie مقابل HashSet",
      en: "Autocomplete and the memory trade-off",
      body: "<p><b>autocomplete:</b> بنمشي على الـ prefix (O(L)) ونوصل لـ node الـ prefix، وبعدين بنعمل DFS على الـ subtree تحتها لتجميع الكلمات (زي <code>withPrefix</code> اللي فوق). التكلفة O(L + حجم الـ subtree المفحوص)، وبنقف بدري بـ <code>limit</code>. وبالمرور على الأحرف بترتيب أبجدي النتيجة بتطلع مرتبة من غير sort إضافي.</p><p><b>الثمن:</b> الـ trie بتاكل ذاكرة. كل حرف node كاملة (object + Map كاملة بـ overhead)، وفي أسوأ حالة (كلمات مفيهاش prefixes مشتركة) عدد الـ nodes = مجموع أطوال الكلمات. الـ hash set بتخزن كل كلمة مرة واحدة كـ string. الـ trie بتكسب لما فيه prefixes كتير مشتركة وأسئلة prefix كتير، وبتخسر لو الأسئلة exact match بس.</p>",
      code: {
        lang: "text",
        src: `                       Trie                    HashSet<String>
insert one word        O(L)                    O(L) average (hashing reads the word)
exact search           O(L)                    O(L) average
"any word starting     O(L)  startsWith        O(N * L)  scan every word
 with pre?"
all words with prefix  O(L + result size)      O(N * L)
sorted output          free (visit keys in     needs a sort
                       order)
memory                 many nodes, one Map     one entry per word
                       each (heavy)            (light)`,
        note: "N عدد الكلمات و L طول الكلمة. لو كل اللي محتاجه «الكلمة دي موجودة؟» فالـ HashSet أبسط وأرخص. الـ Trie لـ prefix queries.",
      },
      focus: [{ label: "احفظها", text: "الـ Trie بتشتري <b>prefix queries في O(L)</b> بثمن <b>ذاكرة أكبر</b> من الـ hash set. لو مفيش prefix queries متستخدمهاش." }],
      interview: [
        { q: "إمتى تستخدم trie بدل hash set؟", a: "لما محتاج prefix queries: autocomplete، «في كلمة بتبدأ بـ كذا؟»، أو كل الكلمات تحت prefix معين، لأنها O(L) بدل ما أمسح كل الكلمات O(N·L) في الـ set. وكمان بتديني ترتيب أبجدي مجانا. الثمن ذاكرة أكبر لأن كل حرف node بـ Map. لو بس بسأل «الكلمة موجودة؟» فالـ hash set أخف وأبسط وبنفس التكلفة O(L) متوسط." },
      ],
    },
    {
      title: "الـ Union-Find: مجموعات منفصلة بتندمج",
      en: "Union-Find (disjoint set union)",
      body: "<p>عندك n عنصر، كل واحد في مجموعة لوحده. عمليتين: <b>find(x)</b>: مين «ممثل» (root) مجموعة x؟ و<b>union(a, b)</b>: ادمج مجموعتي a و b. وبعدها «a و b في نفس المجموعة؟» = <code>find(a) == find(b)</code>.</p><p>التخزين: array اسمها <code>parent</code>. كل عنصر بيشاور على «أبوه»، وممثل المجموعة هو اللي بيشاور على نفسه. المجموعة شجرة (مش binary) ومعلقة من الـ root. <b>find</b> = اطلع لحد ما توصل للـ root. <b>union</b> = خلّي root مجموعة تشاور على root التانية.</p>",
      code: {
        lang: "text",
        title: "n = 6, union steps",
        src: `start             parent = [0, 1, 2, 3, 4, 5]   six sets, each its own root

union(0, 1)       parent = [0, 0, 2, 3, 4, 5]   1 now points to 0
union(2, 3)       parent = [0, 0, 2, 2, 4, 5]
union(1, 3)       find(1) = 0, find(3) = 2
                  parent = [0, 0, 0, 2, 4, 5]   root 2 points to root 0

tree of set {0,1,2,3}:        0
                             / \\
                            1   2
                                |
                                3

find(3): 3 -> 2 -> 0  (the root)
connected(1, 3)? find(1) = 0 = find(3) -> yes
connected(3, 4)? 0 vs 4 -> no
sets left: {0,1,2,3}, {4}, {5}  -> 3 components`,
        note: "لو ربطنا بشكل أعمى ممكن الشجرة تطلع سلسلة طويلة (find بتبقى O(n)). التحسينين في الشريحة الجاية بيمنعوا ده.",
      },
    },
    {
      title: "نكتب Union-Find: path compression و union by size",
      en: "Path compression and union by size",
      body: "<p><b>Path compression:</b> أثناء <code>find</code>، كل node على الطريق للـ root بنخليها تشاور على الـ root مباشرة. المرة الجاية الطريق ده يبقى خطوة واحدة. <b>Union by size:</b> لما ندمج مجموعتين، نعلق الأصغر تحت الأكبر (مش العكس)، فالشجرة تفضل قليلة الارتفاع.</p><p>الاتنين مع بعض بيخلوا التكلفة <b>amortized O(α(n))</b> للعملية الواحدة، حيث α هي معكوس دالة Ackermann: دالة بتكبر ببطء مرعب لدرجة إنها ما بتعديش 4 لأي n ممكن يتخزن في الدنيا. فبنقول «تقريبا ثابت»، لكن مش O(1) بالمعنى الحرفي. بإحدى التحسينين لوحده التكلفة O(log n) amortized.</p>",
      code: {
        lang: "dart",
        src: `class UnionFind {
  final List<int> _parent;
  final List<int> _size;
  int components;

  UnionFind(int n)
      : _parent = List.generate(n, (i) => i),
        _size = List.filled(n, 1),
        components = n;

  int find(int x) {
    var root = x;
    while (_parent[root] != root) {
      root = _parent[root];
    }
    while (_parent[x] != root) {      // path compression
      final next = _parent[x];
      _parent[x] = root;
      x = next;
    }
    return root;
  }

  // true if a and b were in different sets and are now merged
  bool union(int a, int b) {
    var ra = find(a);
    var rb = find(b);
    if (ra == rb) return false;
    if (_size[ra] < _size[rb]) {      // attach the smaller under the bigger
      final t = ra;
      ra = rb;
      rb = t;
    }
    _parent[rb] = ra;
    _size[ra] += _size[rb];
    components--;
    return true;
  }

  bool connected(int a, int b) => find(a) == find(b);
  int sizeOf(int x) => _size[find(x)];
}

void main() {
  final uf = UnionFind(6);
  print(uf.components);          // 6
  print(uf.union(0, 1));         // true
  print(uf.union(2, 3));         // true
  print(uf.union(1, 3));         // true
  print(uf.union(0, 2));         // false: already together
  print(uf.connected(1, 3));     // true
  print(uf.connected(3, 4));     // false
  print(uf.sizeOf(0));           // 4
  print(uf.components);          // 3
  print(uf.union(5, 5));         // false: same element
}`,
        note: "<code>find</code> بتمشي مرتين: مرة تلاقي الـ root، ومرة تضغط الطريق. ممكن تعملها recursive بسطر: <code>if (parent[x] != x) parent[x] = find(parent[x]); return parent[x];</code> (بسيط لكن عمق الـ recursion = ارتفاع الشجرة، وعلى الأغلب صغير بفضل union by size). <code>components</code> بتقل واحد مع كل دمج حقيقي.",
      },
      interview: [
        { q: "اشرح Union-Find وإيه تحسيناته؟ وإيه تكلفته؟", a: "array <code>parent</code> بتمثل غابة: ممثل كل مجموعة هو اللي بيشاور على نفسه. <code>find</code> بيطلع للـ root، و<code>union</code> بيعلّق root مجموعة تحت root التانية. تحسينين: path compression (أثناء find أخلي كل node على الطريق تشاور على الـ root) و union by size أو rank (أعلّق الأصغر تحت الأكبر). مع الاتنين التكلفة amortized O(α(n)) للعملية، α معكوس Ackermann ولا تتعدى 4 عمليا، فبنقول تقريبا ثابتة، مش O(1) بالظبط. بدون تحسينات find ممكن تبقى O(n)." },
      ],
    },
    {
      title: "إمتى نستخدم Union-Find؟",
      en: "Use cases: components, cycles, Kruskal",
      body: "<p>لما السؤال هو <b>الاتصال</b> والـ edges بتتضاف على مراحل (أو محتاج تجاوب «نفس المجموعة؟» كتير):</p>",
      points: [
        "<b>عدد الـ connected components:</b> ابدأ بـ n مجموعة، وكل edge بتدمج مجموعتين بتنقص العدد واحد. في الآخر العدد هو الإجابة. (<code>uf.components</code>)",
        "<b>كشف cycle في undirected graph:</b> لو edge <code>(u, v)</code> والاتنين بالفعل في نفس المجموعة (<code>union</code> رجعت false) يبقى الـ edge دي بتقفل cycle.",
        "<b>Kruskal's MST</b> (أقل شجرة تغطي): رتب الـ edges بالوزن، وخد كل edge لو <code>union</code> نجحت (مش بتعمل cycle). بنتعمق في stage الخوارزميات.",
        "<b>دمج الحسابات / دوائر الأصدقاء / الصور المتصلة:</b> أي حاجة «لو A مرتبط بـ B و B بـ C يبقى A و C في نفس المجموعة».",
        "<b>مقابل DFS/BFS:</b> لو الـ graph ثابت وسؤال واحد، DFS كفاية. لو الـ edges بتتضاف على الوقت والأسئلة بتتكرر، الـ UF بتجاوب في كل مرة من غير ما تعيد المرور.",
        "<b>حدودها:</b> بتدمج بس. مفيش حذف edge ولا بتديك المسار نفسه، بتقولك بس هل متصلين.",
      ],
      interview: [
        { q: "إمتى تفضل Union-Find على DFS لمسائل الاتصال؟", a: "لما الـ edges بتتضاف تدريجيا وبسأل «هل a و b متصلين؟» أو «كام component؟» بعد كل إضافة، لأن كل union و find تقريبا ثابتة والـ DFS هيعيد المرور O(V + E) كل مرة. وكمان لكشف cycle في undirected graph وفي Kruskal. لو الـ graph ثابت وسؤال واحد، DFS/BFS كفاية وأبسط. وعيب الـ UF إنها بتدمج فقط: مفيش مسح edge ومفيش المسار." },
      ],
    },
    {
      title: "مسائل كلاسيك (1): عدد الـ components، والـ edge الزايدة",
      en: "Number of components and redundant connection",
      body: "<p><b>عدد الـ components:</b> n عقدة وقايمة edges: ننشئ UF ونعمل union لكل edge، والإجابة <code>components</code>.</p><p><b>Redundant connection:</b> شجرة فيها n عقدة (1..n) اتضاف لها edge زيادة فعملت cycle. ارجع الـ edge اللي لو شلتها ترجع شجرة. نمر على الـ edges بالترتيب بـ UF، والـ edge اللي <code>union</code> بتاعتها بترجع false (الطرفين أصلا متصلين) هي اللي بتقفل الـ cycle، فهي الإجابة.</p>",
      code: {
        lang: "dart",
        title: "assumes the UnionFind class from the previous slide",
        src: `int countComponents(int n, List<List<int>> edges) {
  final uf = UnionFind(n);
  for (final e in edges) {
    uf.union(e[0], e[1]);
  }
  return uf.components;
}

// nodes are 1..n; returns the edge that closes the first cycle
List<int> findRedundantConnection(List<List<int>> edges) {
  final uf = UnionFind(edges.length + 1);
  for (final e in edges) {
    if (!uf.union(e[0], e[1])) return e;
  }
  return [];
}

void main() {
  print(countComponents(5, [[0, 1], [1, 2], [3, 4]]));    // 2
  print(countComponents(5, [[0, 1], [1, 2], [2, 3], [3, 4]]));  // 1
  print(countComponents(3, []));                           // 3
  print(countComponents(0, []));                           // 0
  print(findRedundantConnection([[1, 2], [1, 3], [2, 3]]));  // [2, 3]
  print(findRedundantConnection(
      [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]));            // [1, 4]
  print(findRedundantConnection([]));                       // []
}`,
        note: "الاتنين تقريبا O(E · α(n)). في الـ redundant connection بنعمل UF بحجم <code>edges.length + 1</code> لأن الأرقام من 1 (الخانة 0 مش مستخدمة). بدون UF كنت هتعمل DFS لكل edge جديدة (O(E²)).",
      },
      interview: [
        { q: "لاقي الـ edge الزايدة اللي بتعمل cycle في شجرة اتضاف لها edge. إزاي؟", a: "Union-Find. بمشي على الـ edges بالترتيب وبعمل union لكل واحدة. لو الـ union رجعت false يبقى الطرفين كانوا أصلا في نفس المكوّن، فالـ edge دي هي اللي بتقفل cycle وهي الإجابة. التكلفة تقريبا O(E) بفضل path compression وunion by size، مقابل O(E²) لو عملت DFS لكشف cycle بعد كل إضافة." },
      ],
    },
    {
      title: "مسائل كلاسيك (2): دمج الحسابات",
      en: "Accounts merge",
      body: "<p>كل حساب فيه اسم وكذا إيميل. حسابين فيهم إيميل مشترك يبقوا نفس الشخص (والاتصال متعدّي: لو A يشارك B وB يشارك C فالتلاتة واحد). المطلوب: ادمج الحسابات المترابطة، وارجع لكل شخص اسمه ومعاه إيميلاته مرتبة. الفكرة: كل حساب عقدة (رقمه). نفتكر أول حساب شاف كل إيميل في Map، ولما إيميل يظهر في حساب تاني نعمل union بين الحسابين. في الآخر نجمع إيميلات كل مجموعة تحت root الخاص بيها.</p>",
      code: {
        lang: "dart",
        title: "assumes the UnionFind class from the previous slides",
        src: `List<List<String>> accountsMerge(List<List<String>> accounts) {
  final uf = UnionFind(accounts.length);
  final owner = <String, int>{};          // email -> first account with it
  for (var i = 0; i < accounts.length; i++) {
    for (var j = 1; j < accounts[i].length; j++) {
      final email = accounts[i][j];
      final seen = owner[email];
      if (seen == null) {
        owner[email] = i;
      } else {
        uf.union(i, seen);
      }
    }
  }
  final groups = <int, Set<String>>{};
  owner.forEach((email, acc) {
    groups.putIfAbsent(uf.find(acc), () => <String>{}).add(email);
  });
  final out = <List<String>>[];
  groups.forEach((root, emails) {
    out.add([accounts[root][0], ...(emails.toList()..sort())]);
  });
  return out;
}

void main() {
  final merged = accountsMerge([
    ['John', 'a@x.com', 'b@x.com'],
    ['Mary', 'm@x.com'],
    ['John', 'b@x.com', 'c@x.com'],
    ['John', 'z@x.com'],
  ]);
  for (final m in merged) {
    print(m);
  }
  // [John, a@x.com, b@x.com, c@x.com]
  // [Mary, m@x.com]
  // [John, z@x.com]    (same name, but no shared email: a different person)
  print(accountsMerge([]));            // []
}`,
        note: "الاسم من أي حساب في المجموعة (كلهم نفس الاسم). مش بنربط بالاسم أبدا: ناس مختلفة ممكن يشتركوا في الاسم. الزمن تقريبا O(M log M) حيث M عدد الإيميلات (الترتيب هو الأغلى)، والـ UF نفسها شبه خطية.",
      },
      pitfall: "ربط الحسابات بالاسم. اتنين اسمهم John مش بالضرورة نفس الشخص. الرابط الوحيد هو الإيميل المشترك. وكمان متنساش الاتصال المتعدّي: لازم UF (أو DFS)، مش مقارنة كل حساب بالتالي له بس.",
      interview: [
        { q: "دمج الحسابات اللي بتشارك إيميلات: إزاي تحلها؟", a: "كل حساب عقدة في Union-Find. بمشي على الإيميلات وبحتفظ بـ Map من الإيميل لأول حساب ظهر فيه؛ لو الإيميل ظهر في حساب تاني بعمل union بين الحسابين. بعد كده أجمّع كل إيميل تحت root حسابه (<code>find</code>) في Map من root لـ Set إيميلات، وأطلع لكل مجموعة الاسم + الإيميلات مرتبة. الاتصال المتعدّي بيتحل لوحده لأن UF بتدمج المجموعات. الاسم مش بيستخدم للربط." },
      ],
    },
    {
      title: "أخطاء شائعة",
      en: "Pitfalls",
      points: [
        "<b>Trie: نسيان isEnd.</b> من غيره 'ca' هتبان كلمة موجودة لو 'car' اتضافت.",
        "<b>Trie: search بدل startsWith.</b> search بتتحقق من <code>isEnd</code>، و startsWith لا.",
        "<b>Trie: الذاكرة.</b> استخدام Map لكل node غالي. لو الأبجدية صغيرة ومعروفة (a-z) بعض الناس بيستخدموا array من 26. اذكر ده كـ trade-off.",
        "<b>UF: ربط الـ nodes بدل الـ roots.</b> لازم <code>find</code> الأول، وبعدين اربط root بـ root. ربط <code>parent[a] = b</code> مباشرة بيكسر الشجرة.",
        "<b>UF: نسيان path compression أو union by size.</b> الكود يشتغل بس ممكن يبقى بطيء O(n) على الـ find.",
        "<b>UF: ترقيم من 1.</b> لو الـ nodes من 1 لـ n اعمل UF بحجم n + 1.",
        "<b>UF: «O(1)».</b> متقولش O(1) في الإنترفيو، قول amortized O(α(n)) أي تقريبا ثابتة.",
      ],
      interview: [
        { q: "إيه اللي ممكن يغلط في تنفيذ Union-Find؟", a: "أشهر خطأ إني أربط عناصر مش roots: لازم أعمل find للاتنين وأربط root بـ root. التاني نسيان التحسينات فالـ find تتحول O(n) على سلسلة. التالت الترقيم: لو العناصر من 1 لازم الـ array بحجم n + 1. والرابع إني ما أرجّعش flag من union يقول هل حصل دمج فعلا، وده اللي بيخلي كشف الـ cycle والعد سهل." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: TrieNode و insert",
      lang: "dart",
      code: `class TrieNode {
  final Map<String, TrieNode> children = {};
  bool isEnd = false;
}

void insert(TrieNode root, String word) {
  var node = root;
  for (final ch in word.split('')) {
    node = node.children.putIfAbsent(ch, () => TrieNode());
  }
  node.isEnd = true;
}`,
    },
    {
      title: "اكتب: find و search في الـ trie",
      lang: "dart",
      code: `TrieNode? find(TrieNode root, String prefix) {
  var node = root;
  for (final ch in prefix.split('')) {
    final next = node.children[ch];
    if (next == null) return null;
    node = next;
  }
  return node;
}

bool search(TrieNode root, String w) => find(root, w)?.isEnd ?? false;`,
      note: "محتاج TrieNode من الدريل اللي فات.",
    },
    {
      title: "اكتب: Union-Find بـ path compression",
      lang: "dart",
      code: `class UnionFind {
  final List<int> parent;

  UnionFind(int n) : parent = List.generate(n, (i) => i);

  int find(int x) {
    if (parent[x] != x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }

  bool connected(int a, int b) => find(a) == find(b);
}`,
    },
  ],

  tasks: [
    {
      title: "Trie بسيط",
      lang: "dart",
      prompt: "<p>اكتب كلاس <code>Trie</code> فيه: <code>void insert(String word)</code> و<code>bool search(String word)</code> (الكلمة كلها اتضافت) و<code>bool startsWith(String prefix)</code> (فيه كلمة بتبدأ بالـ prefix ده). كل عملية O(L). استخدم <code>Map&lt;String, ...&gt;</code> للأولاد.</p>",
      examples: [
        { in: "insert('car'), search('car'), search('ca')", out: "true, false" },
        { in: "insert('car'), startsWith('ca'), startsWith('cb')", out: "true, false" },
        { in: "insert('car'), insert('cart'), search('car')", out: "true" },
      ],
      starter: `class TrieNode {
  final Map<String, TrieNode> children = {};
  bool isEnd = false;
}

class Trie {
  final TrieNode _root = TrieNode();

  void insert(String word) {
    // your code
  }

  bool search(String word) {
    // your code
  }

  bool startsWith(String prefix) {
    // your code
  }
}`,
      hints: [
        "مشي واحد على الحروف بيكفي للتلاتة. اكتب دالة مساعدة <code>_find(String s)</code> بترجع الـ node اللي بتنتهي عندها الحروف أو null.",
        "search = <code>_find(word)?.isEnd ?? false</code>. startsWith = <code>_find(prefix) != null</code>. insert بيستخدم <code>putIfAbsent</code> وبعدين <code>isEnd = true</code>.",
      ],
      solution: `class TrieNode {
  final Map<String, TrieNode> children = {};
  bool isEnd = false;
}

class Trie {
  final TrieNode _root = TrieNode();

  void insert(String word) {
    var node = _root;
    for (final ch in word.split('')) {
      node = node.children.putIfAbsent(ch, () => TrieNode());
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

  bool search(String word) => _find(word)?.isEnd ?? false;

  bool startsWith(String prefix) => _find(prefix) != null;
}`,
      explain: "كل عملية بتمشي على حروف الكلمة فقط: O(L). الفرق الوحيد بين search و startsWith هو فحص <code>isEnd</code>. الكلمة الفاضية: لو اتضافت علّمت الـ root، فـ <code>search('')</code> true وإلا false، وstartsWith('') دايما true.",
    },
    {
      title: "Union-Find من الصفر",
      lang: "dart",
      prompt: "<p>اكتب كلاس <code>UnionFind(int n)</code> فيه: <code>int find(int x)</code> بـ path compression، و<code>bool union(int a, int b)</code> بـ union by size (ترجع true لو الاتنين كانوا في مجموعتين مختلفتين واتدمجوا، وfalse لو كانوا أصلا مع بعض)، و<code>int get components</code> (عدد المجموعات الحالي).</p>",
      examples: [
        { in: "n = 4: union(0,1) ثم union(1,0)", out: "true ثم false" },
        { in: "n = 4: union(0,1), union(2,3)", out: "components = 2" },
        { in: "n = 3 من غير union", out: "components = 3" },
      ],
      starter: `class UnionFind {
  UnionFind(int n) {
    // your code
  }

  int find(int x) {
    // your code
  }

  bool union(int a, int b) {
    // your code
  }

  int get components => 0;
}`,
      hints: [
        "حقول: <code>parent</code> (كل عنصر في الأول أبو نفسه) و<code>size</code> (1 لكل واحد) وعدّاد المجموعات (n في الأول).",
        "union: اعمل find للاتنين. لو نفس الـ root رجع false. وإلا علّق الـ root الأصغر تحت الأكبر، زوّد الحجم، ونقّص العدّاد.",
      ],
      solution: `class UnionFind {
  final List<int> _parent;
  final List<int> _size;
  int _components;

  UnionFind(int n)
      : _parent = List.generate(n, (i) => i),
        _size = List.filled(n, 1),
        _components = n;

  int find(int x) {
    if (_parent[x] != x) {
      _parent[x] = find(_parent[x]);
    }
    return _parent[x];
  }

  bool union(int a, int b) {
    var ra = find(a);
    var rb = find(b);
    if (ra == rb) return false;
    if (_size[ra] < _size[rb]) {
      final t = ra;
      ra = rb;
      rb = t;
    }
    _parent[rb] = ra;
    _size[ra] += _size[rb];
    _components--;
    return true;
  }

  int get components => _components;
}`,
      explain: "amortized O(α(n)) للعملية بفضل التحسينين. الـ recursive find بتضغط الطريق وهي راجعة. union by size بتخلي ارتفاع الشجرة O(log n) في أسوأ حالة فالـ recursion مش بتبقى عميقة. <code>List.generate</code> لازم تستخدمها لـ parent (كل خانة قيمتها index بتاعها).",
    },
    {
      title: "الـ edge الزايدة",
      lang: "dart",
      prompt: "<p>افترض إن عندك كلاس <code>UnionFind</code> (من التاسك اللي فات، <code>union</code> بترجع false لو الطرفين متصلين أصلا). اكتب <code>List&lt;int&gt; findRedundantConnection(List&lt;List&lt;int&gt;&gt; edges)</code>: شجرة عقدها مرقمة من 1 لـ n اتضاف ليها edge واحدة زيادة (فعملت cycle). رجّع أول edge (بترتيب الـ input) بتقفل cycle. لو القايمة فاضية رجع قايمة فاضية.</p>",
      examples: [
        { in: "[[1,2],[1,3],[2,3]]", out: "[2, 3]" },
        { in: "[[1,2],[2,3],[3,4],[1,4],[1,5]]", out: "[1, 4]" },
        { in: "[]", out: "[]" },
      ],
      starter: `List<int> findRedundantConnection(List<List<int>> edges) {
  // your code
}`,
      hints: [
        "عدد العقد = عدد الـ edges (شجرة + edge واحدة). اعمل UF بحجم <code>edges.length + 1</code> لأن الأرقام من 1.",
        "مر على الـ edges بالترتيب. أول <code>union</code> ترجع false، الـ edge دي هي الإجابة.",
      ],
      solution: `List<int> findRedundantConnection(List<List<int>> edges) {
  final uf = UnionFind(edges.length + 1);
  for (final e in edges) {
    if (!uf.union(e[0], e[1])) return e;
  }
  return [];
}`,
      explain: "كل edge بتعمل union واحدة: تقريبا O(E). الـ union اللي بترجع false معناها إن e[0] و e[1] كانوا أصلا متصلين بمسار، فإضافة e بتقفل cycle. بدون UF كنت محتاج DFS كل مرة: O(E²).",
    },
  ],

  quiz: [
    {
      q: "عندك trie فيها مليون كلمة، وبتدور على كلمة طولها 6 حروف. تكلفة <code>search</code>؟",
      options: ["O(1,000,000)", "O(log 1,000,000)", "O(6) أي O(L)", "O(1,000,000 × 6)"],
      answer: 2,
      why: "الـ trie بتمشي على حروف الكلمة بس: L خطوة، مهما كان عدد الكلمات المخزنة. ده الفرق عن مسح كل الكلمات.",
    },
    {
      q: "إيه الناتج؟",
      code: { lang: "dart", src: `final t = Trie();
t.insert('cart');
print(t.search('car'));` },
      answer: ["false"],
      why: "الطريق c ← a ← r موجود، لكن الـ node بتاعة r مش معلّمة <code>isEnd</code> لأن الكلمة المخزنة 'cart' بس. وده سبب وجود العلم. <code>startsWith('car')</code> كانت true.",
    },
    {
      q: "أنهي هيكل أنسب لـ «رجّعلي كل الكلمات في القاموس اللي بتبدأ بـ pre»؟",
      options: ["HashSet&lt;String&gt;", "min-heap", "Trie", "Stack"],
      answer: 2,
      why: "الـ Trie بتوصل لـ node الـ prefix في O(L) وبعدين تجمع الـ subtree. الـ HashSet هتمسح كل الكلمات O(N·L).",
    },
    {
      q: "ليه الـ trie محتاجة <code>isEnd</code> في كل node؟",
      options: [
        "عشان تعرف عدد الأولاد",
        "عشان تعمل resize للـ Map",
        "عشان تحسب الـ hash",
        "عشان تفرق كلمة مخزنة (car) عن مجرد prefix لكلمة تانية (cart)",
      ],
      answer: 3,
      why: "الـ node نفسها بتبقى موجودة في الحالتين. بدون العلم search('car') هترجع true لو خزنت 'cart' بس.",
    },
    {
      q: "إيه اللي بيعمله <b>path compression</b> في <code>find</code>؟",
      options: [
        "بيرتب الـ parent array",
        "بيخلي كل node على الطريق للـ root تشاور عليه مباشرة فالـ finds الجاية أسرع",
        "بيدمج المجموعات الأصغر الأول",
        "بيحذف المجموعات الفاضية",
      ],
      answer: 1,
      why: "الضغط بيقصر الشجرة. الخيار التالت هو union by size/rank (تحسين تاني)، مش path compression.",
    },
    {
      q: "تكلفة find/union مع path compression و union by size؟",
      options: [
        "O(1) بالظبط دايما",
        "O(n) في أسوأ حالة دايما",
        "O(log n) بالظبط دايما",
        "amortized O(α(n)) أي تقريبا ثابتة (α معكوس Ackermann)",
      ],
      answer: 3,
      why: "α(n) بتكبر ببطء شديد (≤ 4 عمليا) فبنقول «تقريبا ثابتة». مش O(1) حرفيا. وبتحسين واحد بس بتبقى O(log n) amortized.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final uf = UnionFind(5);
uf.union(0, 1);
uf.union(1, 2);
uf.union(3, 4);
uf.union(0, 2);
print(uf.components);` },
      answer: ["2"],
      why: "بعد التلات unions الأولى المجموعات: {0,1,2} و{3,4} = 2. الـ union الأخيرة (0, 2) كانوا أصلا مع بعض (رجعت false) فالعدد ثابت.",
    },
    {
      q: "بتفحص edges بالترتيب بـ Union-Find لكشف cycle في undirected graph. إمتى تعرف إن edge بتقفل cycle؟",
      options: [
        "لما <code>union(u, v)</code> ترجع false لأن الطرفين أصلا في نفس المجموعة",
        "لما يكون degree بتاع u أكبر من 2",
        "لما <code>find(u) != find(v)</code>",
        "لما u و v أرقامهم مختلفة",
      ],
      answer: 0,
      why: "لو الطرفين متصلين أصلا بمسار، الـ edge الجديدة بتعمل مسار تاني بينهم، يعني cycle. <code>find(u) != find(v)</code> هي الحالة العادية اللي بتدمج.",
    },
    {
      q: "فين الـ Union-Find بتتفوق على DFS؟",
      options: [
        "لما محتاج أقصر مسار",
        "لما الـ edges بتتضاف على الوقت وبتسأل كتير «a و b متصلين؟»",
        "لما محتاج تمسح edge",
        "لما محتاج ترتيب topological",
      ],
      answer: 1,
      why: "كل find/union تقريبا ثابتة، والـ DFS هتعيد المرور O(V + E) كل مرة. الـ UF مش بتعمل مسارات ولا مسح ولا ترتيب.",
    },
    {
      q: "في Kruskal (أقل شجرة تغطي) إيه دور Union-Find؟",
      options: [
        "ترتيب الـ edges بالوزن",
        "حساب مجموع الأوزان",
        "تعرف إن الـ edge الجاية بتربط مجموعتين مختلفتين (تتاخد) أو بتقفل cycle (تتجاهل)",
        "إيجاد أقصر مسار بين عقدتين",
      ],
      answer: 2,
      why: "Kruskal بيرتب الـ edges بالـ sort العادي. الـ UF هي اللي بتفحص بسرعة هل الـ edge بتعمل cycle، وبتدمج الطرفين لو لأ.",
    },
  ],
};
