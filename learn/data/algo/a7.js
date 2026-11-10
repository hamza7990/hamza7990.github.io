window.LEVELS = window.LEVELS || {};
window.LEVELS["algo/a7"] = {
  slides: [
    {
      kicker: "المشكلة",
      title: "لما الروابط ليها وزن، BFS مش كفاية",
      en: "Weighted graphs and why BFS is not enough",
      body: "<p>في a6 كان كل رابط بيكلف «خطوة» واحدة. في الواقع الرابط ليه <b>تكلفة</b>: كيلومترات، ثواني، فلوس. الـ graph اللي فيه تكلفة على الروابط اسمه <b>weighted graph</b>، وبنخزنه كـ adjacency list بس كل جار معاه وزنه: <code>(to, weight)</code>. في Dart الـ record <code>(int, int)</code> مناسب جدا لده.</p><p>BFS بيدّيك أقل عدد روابط، مش أقل تكلفة. في المثال تحت: الطريق المباشر من 0 لـ 3 رابط واحد بتكلفة 10، والطريق اللي من تلات روابط تكلفته 3. BFS هيختار الأول وده غلط.</p>",
      code: {
        lang: "dart",
        src: `void main() {
  // direct road 0-3 costs 10, the long way 0-1-2-3 costs 1+1+1
  final edges = [[0, 3, 10], [0, 1, 1], [1, 2, 1], [2, 3, 1]];
  final adj = List.generate(4, (_) => <(int, int)>[]);
  for (final e in edges) {
    adj[e[0]].add((e[1], e[2]));      // (neighbour, weight)
    adj[e[1]].add((e[0], e[2]));
  }
  print(adj[0]);   // [(3, 10), (1, 1)]
  print(adj[3]);   // [(0, 10), (2, 1)]
}`,
        note: "BFS من 0 يوصل لـ 3 في خطوة واحدة (تكلفة 10). الأرخص هو 0,1,2,3 بتكلفة 3. لازم خوارزمية بتفهم الأوزان.",
      },
      terms: [
        ["weighted graph", "graph موزون", "كل رابط ليه تكلفة (رقم). أقصر مسار هنا يعني أقل مجموع تكلفة، مش أقل عدد روابط."],
      ],
    },
    {
      kicker: "Dijkstra",
      title: "Dijkstra: دايما افتح أقرب عقدة لسه ما اتأكدتش",
      en: "Dijkstra's idea and a trace",
      body: "<p>الفكرة (جشعة): احتفظ بأفضل مسافة معروفة لكل عقدة (<code>dist</code>)، في الأول 0 للبداية و<code>inf</code> للباقي. كل مرة <b>اسحب العقدة اللي أقل مسافة حاليا</b> من الـ priority queue، وده معناه إن مسافتها نهائية (لأن أي طريق تاني ليها لازم يعدي بعقدة أبعد، والأوزان مش سالبة فمش هيبقى أرخص). بعدين «حسّن» جيرانها (relax): لو <code>dist[u] + w &lt; dist[v]</code> حدّث <code>dist[v]</code> وحط (المسافة الجديدة، v) في الـ queue.</p><p>هي BFS لكن الـ queue العادية استبدلناها بـ <b>priority queue</b> (أقل مسافة تطلع الأول). ولأن مفيش طريقة عملية لتعديل عنصر جوه الـ heap، بنسيب النسخ القديمة وبنتجاهلها لما تطلع: <code>if (d &gt; dist[u]) continue</code> (lazy deletion).</p>",
      codes: [
        {
          lang: "text",
          title: "الـ graph (غير موجه) والتتبع من العقدة 0",
          src: `edges: 0-1:4   0-2:1   2-1:2   1-3:1   2-3:5   3-4:3

pop (0, 0)   dist[1]=4   dist[2]=1
pop (1, 2)   dist[1]=3   dist[3]=6        (1 is cheaper through 2)
pop (3, 1)   dist[3]=4
pop (4, 1)   stale: 4 > dist[1]=3, skip
pop (4, 3)   dist[4]=7
pop (6, 3)   stale: 6 > dist[3]=4, skip
pop (7, 4)   nothing to improve

dist = [0, 3, 1, 4, 7]`,
          note: "كل سطر pop هو (المسافة، العقدة). لاحظ إن العقدة 1 دخلت الـ queue مرتين (4 ثم 3) والنسخة القديمة اتجاهلت.",
        },
      ],
      focus: [{ label: "احفظها", text: "Dijkstra = BFS + priority queue بالتكلفة المتراكمة. اسحب الأقل، تجاهل النسخة القديمة (d > dist[u])، حسّن الجيران. شرطه: مفيش أوزان سالبة." }],
      interview: [
        { q: "اشرح Dijkstra بكلامك.", a: "بحتفظ بأقل مسافة معروفة لكل عقدة وبحط البداية بصفر. في priority queue بسحب منها العقدة ذات أقل مسافة، وده معناه إن مسافتها نهائية لأن أي طريق تاني لازم يعدي بعقدة أبعد ومفيش أوزان سالبة تنزّله. بعدين أحسّن جيرانها (relax)، وأي تحسين بحطه في الـ queue. بتجاهل أي عنصر قديم لما يطلع (d &gt; dist[u]). الزمن O((V + E) log V).",
        },
      ],
    },
    {
      kicker: "الـ heap",
      title: "الـ priority queue: heap بسيط بإيدك",
      en: "A simple binary heap, and what Dart offers",
      body: "<p>مكتبة Dart الأساسية (<code>dart:collection</code>) فيها <code>Queue</code> لكن <b>مفيهاش priority queue</b>. الجاهز موجود في package اسمه <code>collection</code> (package:collection) فيه <code>PriorityQueue</code> و<code>HeapPriorityQueue</code>، بتضيفه في <code>pubspec.yaml</code>. في الإنترفيو غالبا هيطلبوا منك تفهم الـ heap أو تكتبه، فخليه في إيدك.</p><p>الـ min-heap هو شجرة ثنائية مخزنة في list: الأب أصغر من ولاده، عنصر <code>i</code> ولاده <code>2i+1</code> و<code>2i+2</code> وأبوه <code>(i-1) ~/ 2</code>. <code>push</code> يضيف في الآخر ويطلّعه لفوق (sift up). <code>pop</code> ياخد الجذر ويحط آخر عنصر مكانه وينزّله لتحت (sift down). الاتنين O(log n).</p>",
      codes: [
        {
          lang: "dart",
          title: "MinHeap على (المسافة، العقدة)",
          src: `class MinHeap {
  final List<(int, int)> _a = [];       // (distance, node)

  bool get isEmpty => _a.isEmpty;

  void push((int, int) x) {
    _a.add(x);
    var i = _a.length - 1;
    while (i > 0) {                      // sift up
      final p = (i - 1) ~/ 2;
      if (_a[p].$1 <= _a[i].$1) break;
      final t = _a[p];
      _a[p] = _a[i];
      _a[i] = t;
      i = p;
    }
  }

  (int, int) pop() {
    final top = _a.first;
    final last = _a.removeLast();
    if (_a.isNotEmpty) {
      _a[0] = last;
      var i = 0;
      while (true) {                     // sift down
        final l = 2 * i + 1, r = l + 1;
        var m = i;
        if (l < _a.length && _a[l].$1 < _a[m].$1) m = l;
        if (r < _a.length && _a[r].$1 < _a[m].$1) m = r;
        if (m == i) break;
        final t = _a[m];
        _a[m] = _a[i];
        _a[i] = t;
        i = m;
      }
    }
    return top;
  }
}

void main() {
  final h = MinHeap();
  for (final d in [5, 3, 8, 1, 9, 2]) {
    h.push((d, d * 10));
  }
  final out = <int>[];
  while (!h.isEmpty) {
    out.add(h.pop().$1);
  }
  print(out);   // [1, 2, 3, 5, 8, 9]
}`,
          note: "الـ record بيتقارن بالحقل الأول <code>$1</code> بس. <code>pop</code> على heap فاضية بترمي خطأ، فاتأكد من <code>isEmpty</code> قبلها.",
        },
        {
          lang: "dart",
          title: "الجاهز من package:collection (لازم تضيفه في pubspec.yaml)",
          src: `import 'package:collection/collection.dart';

void main() {
  final pq = PriorityQueue<(int, int)>((a, b) => a.$1.compareTo(b.$1));
  pq.add((5, 0));
  pq.add((2, 1));
  pq.add((9, 2));
  print(pq.removeFirst());   // (2, 1)
  print(pq.length);          // 2
}`,
          note: "الـ <code>comparison</code> بتحدد مين «الأصغر». نفس الـ Dijkstra بيشتغل بـ <code>add</code> و<code>removeFirst</code> بدل <code>push</code> و<code>pop</code>.",
        },
      ],
      interview: [
        { q: "إيه الـ data structure اللي Dijkstra بيحتاجها، وفي Dart بتجيبها منين؟", a: "بيحتاج priority queue (min-heap) علشان يسحب أقل مسافة في O(log n). <code>dart:collection</code> مفيهاش واحدة، فإما أستخدم <code>PriorityQueue</code> من package:collection، أو أكتب heap بسيط على list: push بيعمل sift up وpop بيعمل sift down، والاتنين O(log n).",
        },
      ],
    },
    {
      kicker: "الكود",
      title: "Dijkstra كامل وتعقيده",
      en: "Dijkstra in code and its complexity",
      body: "<p>بعد ما بقى عندنا الـ <code>MinHeap</code> (من الشريحة اللي فاتت) الباقي قصير. المسافات بتبدأ بـ <code>inf</code>: رقم أكبر من أي مسافة ممكنة. استخدمنا <code>1 &lt;&lt; 30</code> لأنه آمن على الموبايل والويب. العقدة اللي مفيش وصول ليها بتفضل <code>inf</code>.</p><p><b>التعقيد:</b> كل رابط ممكن يضيف عنصر للـ queue مرة على الأكتر، فالـ queue فيها حتى E عنصر، وكل push/pop بـ O(log E) = O(log V). الزمن الكلي O((V + E) log V) والمساحة O(V + E).</p>",
      code: {
        lang: "dart",
        src: `// uses MinHeap from the previous slide
List<int> dijkstra(int n, List<List<(int, int)>> adj, int src) {
  const inf = 1 << 30;                  // bigger than any real distance
  final dist = List<int>.filled(n, inf);
  dist[src] = 0;
  final pq = MinHeap()..push((0, src));
  while (!pq.isEmpty) {
    final (d, u) = pq.pop();
    if (d > dist[u]) continue;           // stale entry
    for (final (v, w) in adj[u]) {
      if (d + w < dist[v]) {
        dist[v] = d + w;
        pq.push((dist[v], v));
      }
    }
  }
  return dist;
}

void main() {
  final n = 6;     // node 5 is not connected
  final edges = [[0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 1], [2, 3, 5], [3, 4, 3]];
  final adj = List.generate(n, (_) => <(int, int)>[]);
  for (final e in edges) {
    adj[e[0]].add((e[1], e[2]));
    adj[e[1]].add((e[0], e[2]));
  }
  print(dijkstra(n, adj, 0));   // [0, 3, 1, 4, 7, 1073741824]
  print(dijkstra(n, adj, 4));   // [7, 4, 6, 3, 0, 1073741824]
  print(dijkstra(1, [<(int, int)>[]], 0));   // [0]
}`,
        note: "1073741824 هي <code>inf</code>: العقدة 5 مش واصلها حاجة. في كود حقيقي ترجّع -1 أو null بدل ما تعرض inf.",
      },
      pitfall: "غلطتين شائعتين: (1) تنسى <code>if (d &gt; dist[u]) continue</code> فالكود لسه صح لكن بيعمل شغل زيادة كتير. (2) تحط في الـ queue العقدة بس من غير مسافتها، فالترتيب مش بالتكلفة. العنصر لازم يشيل المسافة معاه.",
      interview: [
        { q: "إيه تعقيد Dijkstra بالـ heap؟ وإيه اللي بيعمل الـ log؟", a: "O((V + E) log V). كل رابط ممكن يعمل push واحد، وكل عقدة بتتعالج مرة، وكل push وpop في الـ heap بـ O(log). لو الـ graph كثيف جدا (E قريبة من V^2) نسخة المصفوفة بدون heap وبـ O(V^2) ممكن تبقى أبسط وأسرع.",
        },
      ],
    },
    {
      kicker: "السالب",
      title: "ليه Dijkstra بيفشل مع الأوزان السالبة، و Bellman-Ford",
      en: "Negative edges and Bellman-Ford",
      body: "<p>برهان Dijkstra كله قايم على: «لما أسحب العقدة، مفيش طريق تاني أرخص». ده صح بس لو إضافة رابط عمرها ما بتنزّل التكلفة. مع رابط بوزن سالب ممكن طريق أطول يوصلك أرخص. مثال: <code>0→1</code> بـ 2، <code>0→2</code> بـ 5، <code>2→1</code> بـ <b>-4</b>. Dijkstra بيسحب 1 الأول (مسافتها 2) ويعتبرها نهائية، لكن الطريق 0→2→1 تكلفته 1. ولو فيه <b>cycle سالب</b> مفيش أقصر مسار أصلا (كل لفة بتنزّل أكتر).</p><p><b>Bellman-Ford</b> بيتعامل مع السالب: كرر <code>n - 1</code> مرة «حسّن كل الرابطات». أي أقصر مسار فيه n-1 رابط على الأكتر فبعد n-1 لفة كل المسافات نهائية. لفة زيادة لو لسه فيها تحسين = <b>cycle سالب</b>. الزمن O(V × E).</p>",
      code: {
        lang: "dart",
        src: `// edges are [from, to, weight]; returns null on a negative cycle
List<int>? bellmanFord(int n, List<List<int>> edges, int s) {
  const inf = 1 << 30;
  final dist = List<int>.filled(n, inf);
  dist[s] = 0;
  for (var i = 0; i < n - 1; i++) {
    var changed = false;
    for (final e in edges) {
      if (dist[e[0]] == inf) continue;
      if (dist[e[0]] + e[2] < dist[e[1]]) {
        dist[e[1]] = dist[e[0]] + e[2];
        changed = true;
      }
    }
    if (!changed) break;                // early exit
  }
  for (final e in edges) {              // one more pass
    if (dist[e[0]] != inf && dist[e[0]] + e[2] < dist[e[1]]) return null;
  }
  return dist;
}

void main() {
  print(bellmanFord(3, [[0, 1, 2], [0, 2, 5], [2, 1, -4]], 0));
  // [0, 1, 5]
  print(bellmanFord(3, [[0, 1, 1], [1, 2, -3], [2, 1, 1]], 0));
  // null   (1 -> 2 -> 1 costs -2 every lap)
  print(bellmanFord(3, [[0, 1, 1]], 0));
  // [0, 1, 1073741824]
}`,
        note: "الوزن السالب موجود في حالات حقيقية (مثلا فرق أسعار صرف في arbitrage)، لكن نادر في الإنترفيو. اعرف الفكرة وإن التكلفة O(V × E).",
      },
      codes: [
        {
          lang: "text",
          title: "ليه Dijkstra يغلط على 0→1:2, 0→2:5, 2→1:-4",
          src: `pop (0, 0)   dist[1]=2   dist[2]=5
pop (2, 1)   node 1 is "final" with 2
pop (5, 2)   relax 2->1: 5 + (-4) = 1 < 2   too late, 1 was already final
true answer: dist[1] = 1  (0 -> 2 -> 1)`,
          note: "نسخة lazy اللي فوق (من غير done flags) هتحسّن dist[1] لـ 1 تاني، لكنها بتتحول لتعدد أسي في الأسوأ، وبتلف للأبد مع cycle سالب. فالقاعدة: سالب = Bellman-Ford.",
        },
      ],
      interview: [
        { q: "ليه Dijkstra مبيشتغلش مع الأوزان السالبة؟ وإيه البديل؟", a: "لأن Dijkstra بيعتبر العقدة نهائية أول ما تتسحب، على أساس إن أي طريق تاني هيعدي بعقدة أبعد ولا يقدر ينزل التكلفة. رابط سالب بيكسر الافتراض ده: طريق أطول ممكن يطلع أرخص. ولو فيه cycle سالب مفيش أقصر مسار أصلا. البديل Bellman-Ford: n-1 لفة بتحسّن كل الروابط، ولفة زيادة بتكشف الـ cycle السالب. الزمن O(V × E).",
        },
      ],
    },
    {
      kicker: "الترتيب",
      title: "الترتيب الطوبولوجي: Kahn's algorithm",
      en: "Topological sort with in-degrees",
      body: "<p>عندك مهام وفيه اعتماديات: «أ لازم قبل ب». ده <b>directed graph</b> (رابط من أ لـ ب). الترتيب الطوبولوجي هو ترتيب للعقد بحيث كل رابط بيروح من عقدة قبلية لعقدة بعدية. بيوجد بس لو الـ graph <b>من غير cycle</b> (DAG).</p><p><b>Kahn:</b> احسب <b>in-degree</b> لكل عقدة (عدد الروابط الداخلة ليها). العقد اللي in-degree بتاعها 0 مفيش حاجة مطلوبة قبلها، فحطها في queue. كل ما تشيل عقدة، حطها في الناتج، وقلّل in-degree لكل جيرانها بواحد، واللي يوصل لصفر ادخله الـ queue. في الآخر لو الناتج أقل من n يبقى فيه <b>cycle</b> (العقد اللي فيه عمرها ما وصلت لصفر).</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

// edge [a, b] means a must come before b; null = there is a cycle
List<int>? topoSort(int n, List<List<int>> edges) {
  final adj = List.generate(n, (_) => <int>[]);
  final indeg = List<int>.filled(n, 0);
  for (final e in edges) {
    adj[e[0]].add(e[1]);
    indeg[e[1]]++;
  }
  final q = Queue<int>();
  for (var i = 0; i < n; i++) {
    if (indeg[i] == 0) q.add(i);
  }
  final order = <int>[];
  while (q.isNotEmpty) {
    final u = q.removeFirst();
    order.add(u);
    for (final v in adj[u]) {
      indeg[v]--;
      if (indeg[v] == 0) q.add(v);
    }
  }
  return order.length == n ? order : null;
}

void main() {
  final e = [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]];
  print(topoSort(6, e));                       // [4, 5, 2, 0, 3, 1]
  print(topoSort(3, [[0, 1], [1, 2], [2, 0]])); // null
  print(topoSort(3, []));                      // [0, 1, 2]
  print(topoSort(0, []));                      // []
}`,
        note: "الترتيب مش وحيد: أي ترتيب بيحترم كل الروابط صح. الزمن O(V + E) والمساحة O(V + E).",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع Kahn: in-degree = [2, 2, 1, 1, 0, 0]",
          src: `queue [4, 5]                    (in-degree 0)
pop 4   order [4]               0: 2->1   1: 2->1
pop 5   order [4, 5]            2: 1->0 add 2     0: 1->0 add 0
pop 2   order [4, 5, 2]         3: 1->0 add 3
pop 0   order [4, 5, 2, 0]
pop 3   order [4, 5, 2, 0, 3]   1: 1->0 add 1
pop 1   order [4, 5, 2, 0, 3, 1]   length 6 == n, no cycle`,
        },
      ],
      interview: [
        { q: "اشرح الترتيب الطوبولوجي (Kahn).", a: "بحسب in-degree لكل عقدة وأحط اللي in-degree بتاعها صفر في queue. كل مرة بشيل عقدة، أضيفها للناتج، وأنقّص in-degree جيرانها، واللي بيوصل لصفر أضيفه. لو الناتج في الآخر أصغر من n يبقى فيه cycle ومفيش ترتيب. الزمن O(V + E).",
        },
      ],
    },
    {
      kicker: "DFS",
      title: "النسخة التانية بالـ DFS، وكشف cycle في graph موجه",
      en: "DFS topological sort and directed cycle detection",
      body: "<p>بـ DFS: بعد ما نخلص كل أولاد عقدة نضيفها في آخر قايمة (post-order). القايمة معكوسة هي الترتيب الطوبولوجي (العقدة بتيجي قبل كل اللي بيعتمدوا عليها).</p><p>الكشف عن الـ cycle في graph <b>موجه</b> أدق من غير الموجه: مش كفاية إن الجار seen. لازم <b>3 حالات</b>: <code>0</code> لسه ما اتزارتش، <code>1</code> <b>على المسار الحالي</b> (لسه بنعالج أولادها)، <code>2</code> خلصت. لو لقينا جار حالته 1 يبقى رجعنا لعقدة على نفس المسار = cycle. جار حالته 2 مش مشكلة (مثلا شكل الماسة: اتنين بيشاوروا على نفس العقدة).</p>",
      code: {
        lang: "dart",
        src: `// edge [a, b]: a before b. returns null when there is a cycle
List<int>? topoDfs(int n, List<List<int>> edges) {
  final adj = List.generate(n, (_) => <int>[]);
  for (final e in edges) {
    adj[e[0]].add(e[1]);
  }
  final state = List<int>.filled(n, 0);   // 0 new, 1 on path, 2 done
  final post = <int>[];

  bool dfs(int u) {                        // false = cycle found
    state[u] = 1;
    for (final v in adj[u]) {
      if (state[v] == 1) return false;     // back to the current path
      if (state[v] == 0 && !dfs(v)) return false;
    }
    state[u] = 2;
    post.add(u);
    return true;
  }

  for (var i = 0; i < n; i++) {
    if (state[i] == 0 && !dfs(i)) return null;
  }
  return post.reversed.toList();
}

void main() {
  final e = [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]];
  print(topoDfs(6, e));                         // [5, 4, 2, 3, 1, 0]
  print(topoDfs(3, [[0, 1], [1, 2], [2, 0]]));  // null
  // diamond: 0->1, 0->2, 1->3, 2->3 is NOT a cycle
  print(topoDfs(4, [[0, 1], [0, 2], [1, 3], [2, 3]])); // [0, 2, 1, 3]
  print(topoDfs(1, [[0, 0]]));                  // null (self loop)
}`,
        note: "ترتيب مختلف عن Kahn لكنه صحيح برضه: كل رابط بيروح من عقدة سابقة للاحقة. زمن O(V + E).",
      },
      pitfall: "استخدام <code>seen</code> boolean واحد في graph موجه بيعتبر الماسة (0→1→3 و0→2→3) cycle غلط. لازم تفرق بين «على المسار الحالي» و«خلصت».",
      interview: [
        { q: "إزاي تكتشف cycle في graph موجه؟", a: "أحد طريقين: Kahn، لو الناتج أقصر من n يبقى فيه cycle. أو DFS بثلاث حالات: لسه، على المسار الحالي، وخلصت. لو وصلت لجار حالته «على المسار الحالي» يبقى رجعت لنفسي = cycle. جار «خلصت» مش cycle. الاتنين O(V + E). ملاحظة: الحل بالـ seen boolean بس بيطلع false positives في الشكل الماسي.",
        },
      ],
    },
    {
      kicker: "تطبيق",
      title: "Course Schedule وأين تظهر دي في الواقع",
      en: "Course schedule and real systems",
      body: "<p><b>Course Schedule:</b> فيه <code>n</code> مادة، وكل زوج <code>[a, b]</code> معناه «لازم تاخد b قبل a». هل تقدر تخلص كلهم؟ ده بالظبط: هل الـ graph (b ← a) من غير cycle؟ يبقى Kahn: لو اتعالجت n مادة، أيوه.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

bool canFinish(int n, List<List<int>> prereq) {
  final adj = List.generate(n, (_) => <int>[]);
  final indeg = List<int>.filled(n, 0);
  for (final p in prereq) {
    adj[p[1]].add(p[0]);          // take p[1] first, then p[0]
    indeg[p[0]]++;
  }
  final q = Queue<int>();
  for (var i = 0; i < n; i++) {
    if (indeg[i] == 0) q.add(i);
  }
  var done = 0;
  while (q.isNotEmpty) {
    final u = q.removeFirst();
    done++;
    for (final v in adj[u]) {
      if (--indeg[v] == 0) q.add(v);
    }
  }
  return done == n;
}

void main() {
  print(canFinish(2, [[1, 0]]));            // true
  print(canFinish(2, [[1, 0], [0, 1]]));    // false
  print(canFinish(4, [[1, 0], [2, 0], [3, 1], [3, 2]]));   // true
  print(canFinish(3, []));                  // true
  print(canFinish(1, [[0, 0]]));            // false
}`,
        note: "انتبه لاتجاه الرابط: <code>[a, b]</code> معناها b قبل a، فالرابط في الـ graph من b لـ a. عكسه بيدّي نفس الجواب لـ canFinish لكن ترتيب غلط لو طلبت الترتيب.",
      },
      points: [
        "<b>ترتيب البناء</b>: npm و Gradle و make بيبنوا الحزم بترتيب طوبولوجي، وبيرفضوا لو فيه dependency دايرية.",
        "<b>Migrations والـ imports</b>: ترتيب تنفيذ الـ migrations اللي بتعتمد على بعض، أو ترتيب تحميل الـ modules.",
        "<b>Spreadsheet</b>: حساب الخلايا اللي بتعتمد على بعضها، و«circular reference» هي cycle.",
        "<b>Routing</b>: بروتوكولات زي OSPF بتحسب أقصر مسار بنفس فكرة Dijkstra، وخرائط الطرق بتستخدم A* (Dijkstra + تقدير للمسافة المتبقية). RIP بتستخدم فكرة Bellman-Ford.",
      ],
      interview: [
        { q: "حل Course Schedule: هل ينفع تخلص كل المواد؟", a: "بحوّلها لـ directed graph: من b لـ a لكل شرط «b قبل a». ينفع لو الـ graph من غير cycle. بشغل Kahn وأعد المواد اللي اتعالجت، لو العدد يساوي n يبقى ينفع. بديل DFS بثلاث حالات. الزمن O(V + E).",
        },
        { q: "امتى تختار BFS، Dijkstra أو Bellman-Ford؟", a: "BFS لما كل الروابط بنفس التكلفة (أو من غير أوزان). Dijkstra لما الأوزان موجبة (الأشهر، O((V + E) log V)). Bellman-Ford لما فيه أوزان سالبة أو محتاج أكشف cycle سالب (O(V × E)). ولو الـ graph DAG ممكن أحسب أقصر مسار بالترتيب الطوبولوجي في O(V + E).",
        },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: Bellman-Ford",
      lang: "dart",
      code: `List<int> bellmanFord(int n, List<List<int>> edges, int s) {
  const inf = 1 << 30;
  final dist = List<int>.filled(n, inf);
  dist[s] = 0;
  for (var i = 0; i < n - 1; i++) {
    for (final e in edges) {
      if (dist[e[0]] == inf) continue;
      if (dist[e[0]] + e[2] < dist[e[1]]) {
        dist[e[1]] = dist[e[0]] + e[2];
      }
    }
  }
  return dist;
}`,
      note: "n - 1 لفة، وفي كل لفة حسّن كل الروابط.",
    },
    {
      title: "اكتب: Kahn (الترتيب الطوبولوجي)",
      lang: "dart",
      code: `List<int>? topoSort(List<List<int>> adj, List<int> indeg) {
  final q = <int>[
    for (var i = 0; i < adj.length; i++)
      if (indeg[i] == 0) i
  ];
  for (var h = 0; h < q.length; h++) {
    for (final v in adj[q[h]]) {
      if (--indeg[v] == 0) q.add(v);
    }
  }
  return q.length == adj.length ? q : null;
}`,
      note: "الـ queue هنا list ومؤشر <code>h</code> للرأس، فمفيش import. لو الطول أقل من n يبقى فيه cycle.",
    },
    {
      title: "اكتب: Dijkstra",
      lang: "dart",
      code: `List<int> dijkstra(int n, List<List<(int, int)>> adj, int s) {
  const inf = 1 << 30;
  final dist = List<int>.filled(n, inf);
  dist[s] = 0;
  final pq = MinHeap()..push((0, s));
  while (!pq.isEmpty) {
    final (d, u) = pq.pop();
    if (d > dist[u]) continue;
    for (final (v, w) in adj[u]) {
      if (d + w < dist[v]) {
        dist[v] = d + w;
        pq.push((dist[v], v));
      }
    }
  }
  return dist;
}`,
      note: "بتفترض إن <code>MinHeap</code> من الشريحة التالتة موجود.",
    },
  ],

  tasks: [
    {
      title: "Network Delay Time",
      lang: "dart",
      prompt: "<p>شبكة فيها <code>n</code> عقدة مرقمة من 1 لـ n. كل عنصر في <code>times</code> هو <code>[u, v, w]</code>: إشارة من u لـ v بتاخد w (اتجاه واحد). بتتبعت إشارة من العقدة <code>k</code>. اكتب <code>int networkDelayTime(List&lt;List&lt;int&gt;&gt; times, int n, int k)</code> ترجع الوقت اللازم لوصول الإشارة لكل العقد، أو <code>-1</code> لو عقدة مش هتوصلها.</p>",
      examples: [
        { in: "networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2)", out: "2" },
        { in: "networkDelayTime([[1, 2, 1]], 2, 1)", out: "1" },
        { in: "networkDelayTime([[1, 2, 1]], 2, 2)", out: "-1" },
      ],
      starter: `int networkDelayTime(List<List<int>> times, int n, int k) {
  // your code
}`,
      hints: [
        "ده أقصر مسار من k لكل العقد بأوزان موجبة: Dijkstra. الإجابة هي أكبر مسافة.",
        "العقد من 1 لـ n: اعمل المصفوفات بحجم n + 1 وتجاهل index 0.",
        "لو أي مسافة فضلت inf رجّع -1. وتحتاج heap: استخدم MinHeap من الشريحة (انسخه في الحل) أو PriorityQueue.",
      ],
      solution: `class MinHeap {
  final List<(int, int)> _a = [];
  bool get isEmpty => _a.isEmpty;

  void push((int, int) x) {
    _a.add(x);
    var i = _a.length - 1;
    while (i > 0) {
      final p = (i - 1) ~/ 2;
      if (_a[p].$1 <= _a[i].$1) break;
      final t = _a[p];
      _a[p] = _a[i];
      _a[i] = t;
      i = p;
    }
  }

  (int, int) pop() {
    final top = _a.first;
    final last = _a.removeLast();
    if (_a.isNotEmpty) {
      _a[0] = last;
      var i = 0;
      while (true) {
        final l = 2 * i + 1, r = l + 1;
        var m = i;
        if (l < _a.length && _a[l].$1 < _a[m].$1) m = l;
        if (r < _a.length && _a[r].$1 < _a[m].$1) m = r;
        if (m == i) break;
        final t = _a[m];
        _a[m] = _a[i];
        _a[i] = t;
        i = m;
      }
    }
    return top;
  }
}

int networkDelayTime(List<List<int>> times, int n, int k) {
  const inf = 1 << 30;
  final adj = List.generate(n + 1, (_) => <(int, int)>[]);
  for (final t in times) {
    adj[t[0]].add((t[1], t[2]));
  }
  final dist = List<int>.filled(n + 1, inf);
  dist[k] = 0;
  final pq = MinHeap()..push((0, k));
  while (!pq.isEmpty) {
    final (d, u) = pq.pop();
    if (d > dist[u]) continue;
    for (final (v, w) in adj[u]) {
      if (d + w < dist[v]) {
        dist[v] = d + w;
        pq.push((dist[v], v));
      }
    }
  }
  var best = 0;
  for (var i = 1; i <= n; i++) {
    if (dist[i] == inf) return -1;
    if (dist[i] > best) best = dist[i];
  }
  return best;
}`,
      explain: "الإشارة بتوصل لكل عقدة في أقصر وقت ممكن (Dijkstra)، والوقت الكلي هو لحظة وصولها لآخر عقدة = أكبر مسافة. الزمن O((V + E) log V). لو n = 1 و times فاضية الجواب 0.",
    },
    {
      title: "ترتيب المواد",
      lang: "dart",
      prompt: "<p>فيه <code>n</code> مادة مرقمة من 0 لـ n-1، و<code>prereq</code> أزواج <code>[a, b]</code> معناها «لازم b قبل a». اكتب <code>List&lt;int&gt; findOrder(int n, List&lt;List&lt;int&gt;&gt; prereq)</code> ترجع ترتيب ممكن لدراسة كل المواد، أو قايمة فاضية لو مستحيل (فيه cycle). استخدم Kahn بـ queue بحيث العقد اللي in-degree بتاعها صفر تدخل بترتيب رقمها.</p>",
      examples: [
        { in: "findOrder(2, [[1, 0]])", out: "[0, 1]" },
        { in: "findOrder(4, [[1, 0], [2, 0], [3, 1], [3, 2]])", out: "[0, 1, 2, 3]" },
        { in: "findOrder(2, [[1, 0], [0, 1]])", out: "[]" },
      ],
      starter: `List<int> findOrder(int n, List<List<int>> prereq) {
  // your code
}`,
      hints: [
        "الرابط من b لـ a (b الأول). زوّد in-degree بتاع a.",
        "حط كل المواد اللي in-degree بتاعها 0 في queue، وكل ما تشيل واحدة نقّص جيرانها.",
        "لو طول الناتج أقل من n ارجع قايمة فاضية.",
      ],
      solution: `import 'dart:collection';

List<int> findOrder(int n, List<List<int>> prereq) {
  final adj = List.generate(n, (_) => <int>[]);
  final indeg = List<int>.filled(n, 0);
  for (final p in prereq) {
    adj[p[1]].add(p[0]);
    indeg[p[0]]++;
  }
  final q = Queue<int>();
  for (var i = 0; i < n; i++) {
    if (indeg[i] == 0) q.add(i);
  }
  final order = <int>[];
  while (q.isNotEmpty) {
    final u = q.removeFirst();
    order.add(u);
    for (final v in adj[u]) {
      if (--indeg[v] == 0) q.add(v);
    }
  }
  return order.length == n ? order : <int>[];
}`,
      explain: "نفس Kahn بالظبط. الفرق الوحيد اتجاه الرابط (b ← a) والرجوع بقايمة فاضية بدل null. الزمن O(V + E). لو n = 0 بيرجع [] لأن الطول 0 يساوي n.",
    },
    {
      title: "أرخص رحلة بعدد محدود من التوقفات",
      lang: "dart",
      prompt: "<p>فيه <code>n</code> مدينة (0 لـ n-1) و<code>flights</code> كل عنصر فيه <code>[from, to, price]</code> (اتجاه واحد). اكتب <code>int findCheapestPrice(int n, List&lt;List&lt;int&gt;&gt; flights, int src, int dst, int k)</code> ترجع أرخص سعر من src لـ dst بـ <b>k توقفات كحد أقصى</b> (يعني k + 1 رحلة على الأكتر)، أو <code>-1</code> لو مستحيل.</p>",
      examples: [
        { in: "findCheapestPrice(3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1)", out: "200" },
        { in: "findCheapestPrice(3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0)", out: "500" },
        { in: "findCheapestPrice(2, [[0, 1, 5]], 1, 0, 3)", out: "-1" },
      ],
      starter: `int findCheapestPrice(int n, List<List<int>> flights, int src, int dst, int k) {
  // your code
}`,
      hints: [
        "Dijkstra العادي ميعرفش يحد عدد الرحلات. استخدم فكرة Bellman-Ford: لفة واحدة = رحلة واحدة زيادة.",
        "كرر k + 1 مرة. في كل لفة احسب المسافات الجديدة من نسخة المسافات القديمة (<code>prev</code>) بحيث رحلة واحدة بس تتضاف في اللفة.",
        "لو dist[dst] لسه inf رجّع -1.",
      ],
      solution: `int findCheapestPrice(
    int n, List<List<int>> flights, int src, int dst, int k) {
  const inf = 1 << 30;
  var dist = List<int>.filled(n, inf);
  dist[src] = 0;
  for (var i = 0; i <= k; i++) {
    final next = List<int>.of(dist);
    for (final f in flights) {
      if (dist[f[0]] == inf) continue;
      if (dist[f[0]] + f[2] < next[f[1]]) {
        next[f[1]] = dist[f[0]] + f[2];
      }
    }
    dist = next;
  }
  return dist[dst] == inf ? -1 : dist[dst];
}`,
      explain: "لو حدّثنا <code>dist</code> مباشرة جوه اللفة، رحلتين ورا بعض ممكن يحصلوا في لفة واحدة ونكسر حد التوقفات. النسخة <code>next</code> بتضمن إن كل لفة بتضيف رحلة واحدة بس. الزمن O(k × E) والمساحة O(V).",
    },
  ],

  quiz: [
    {
      q: "أقصر مسافة من 0 لـ 3 في الـ graph ده (غير موجه)؟",
      code: { lang: "text", src: `0-1 : 4
0-2 : 1
2-1 : 2
1-3 : 1
2-3 : 5` },
      answer: ["4"],
      why: "الطريق 0→2→1→3 تكلفته 1+2+1 = 4. الطريق 0→2→3 تكلفته 6، و0→1→3 تكلفته 5. المهم إننا نمر بـ 2 الأول لأنه رخيص.",
    },
    {
      q: "ليه BFS مش مناسب لأقصر مسار في graph موزون؟",
      options: [
        "لأنه أبطأ من Dijkstra دايما",
        "لأنه بيعد عدد الروابط مش مجموع التكلفة، فمسار قليل الروابط ممكن يكون غالي",
        "لأنه بيحتاج stack",
        "لأنه مبيشتغلش مع الـ cycles",
      ],
      answer: 1,
      why: "BFS بيشتغل صح مع الـ cycles ويستخدم queue. المشكلة الوحيدة إن مقياسه عدد الروابط، فرابط واحد بتكلفة 10 بيكسب على تلات روابط بتكلفة 3.",
    },
    {
      q: "تعقيد Dijkstra بـ binary heap؟",
      options: [
        "O(V^2)",
        "O(V + E)",
        "O(V × E)",
        "O((V + E) log V)",
      ],
      answer: 3,
      why: "كل رابط ممكن يعمل push (O(log V)) وكل عقدة بتتعالج مرة. O(V + E) هو BFS، وO(V × E) هو Bellman-Ford، وO(V^2) نسخة المصفوفة من غير heap.",
    },
    {
      q: "إيه سبب فشل Dijkstra مع رابط وزنه سالب؟",
      options: [
        "بيعتبر العقدة نهائية أول ما تتسحب، ورابط سالب ممكن يخلي طريق أطول يوصل لها أرخص بعد كده",
        "الـ heap مبيقبلش أرقام سالبة",
        "الـ graph مبقاش connected",
        "الـ queue بتتفرغ بسرعة",
      ],
      answer: 0,
      why: "الـ heap بيقبل أي رقم. المشكلة في برهان الخوارزمية نفسها: افتراض إن إضافة رابط ما بتنزّلش التكلفة.",
    },
    {
      q: "الناتج إيه؟ (Kahn بـ queue)",
      code: { lang: "dart", src: `import 'dart:collection';

void main() {
  final edges = [[0, 1], [0, 2], [1, 3], [2, 3]];
  final adj = List.generate(4, (_) => <int>[]);
  final indeg = List<int>.filled(4, 0);
  for (final e in edges) {
    adj[e[0]].add(e[1]);
    indeg[e[1]]++;
  }
  final q = Queue<int>()..add(0);
  final order = <int>[];
  while (q.isNotEmpty) {
    final u = q.removeFirst();
    order.add(u);
    for (final v in adj[u]) {
      if (--indeg[v] == 0) q.add(v);
    }
  }
  print(order);
}` },
      answer: ["[0, 1, 2, 3]", "0, 1, 2, 3", "0 1 2 3"],
      why: "0 يخرج ويضيف 1 و2 (in-degree كل واحد بقى 0). بعد 1: in-degree بتاع 3 بقى 1. بعد 2: بقى 0 فيدخل. الترتيب 0 1 2 3.",
    },
    {
      q: "في Kahn، لو الناتج النهائي طوله أقل من n، ده معناه إيه؟",
      options: [
        "فيه عقد معزولة",
        "الـ graph بيحتوي على cycle (ومفيش ترتيب طوبولوجي)",
        "لازم نبدأ من عقدة تانية",
        "الـ queue فاضية بالغلط",
      ],
      answer: 1,
      why: "عقد الـ cycle كل واحدة منتظرة التانية، فـ in-degree بتاعها عمره ما بيوصل لصفر وبتفضل برا الناتج. العقد المعزولة in-degree بتاعها صفر وبتدخل عادي.",
    },
    {
      q: "في DFS لـ graph موجه، متى بنقول فيه cycle؟",
      options: [
        "لما نلاقي جار seen",
        "لما نلاقي جار حالته «خلصت»",
        "لما نلاقي جار على المسار الحالي (لسه بنعالج أولاده)",
        "لما نرجع للعقدة الأولى بس",
      ],
      answer: 2,
      why: "جار «خلصت» ممكن يكون وصلتله من فرع تاني (الشكل الماسي) ومش cycle. الـ cycle هو بس لما ترجع لعقدة لسه على نفس المسار.",
    },
    {
      q: "كام لفة على كل الروابط محتاجها Bellman-Ford (من غير الفحص الأخير للـ cycle السالب) في graph فيه 6 عقد؟",
      answer: ["5"],
      why: "أطول أقصر مسار بدون cycles فيه 5 روابط (n - 1)، فبعد 5 لفات كل المسافات نهائية. اللفة السادسة بنستخدمها بس للكشف عن cycle سالب.",
    },
    {
      q: "أي مشكلة من دول هي ترتيب طوبولوجي؟",
      options: [
        "إيجاد أرخص طريق بين مدينتين",
        "ترتيب بناء مشاريع بعضها بيعتمد على بعض في build system",
        "عد الجزر في خريطة",
        "إيجاد أقل عدد خطوات في متاهة",
      ],
      answer: 1,
      why: "الاعتماديات (أ قبل ب) هي directed graph، وترتيب البناء هو ترتيبها الطوبولوجي. الأرخص طريق Dijkstra، والجزر DFS، والمتاهة BFS.",
    },
  ],
};
