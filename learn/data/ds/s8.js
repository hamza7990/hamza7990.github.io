window.LEVELS = window.LEVELS || {};
window.LEVELS["ds/s8"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "الـ Graph: لما العلاقات هي الموضوع",
      en: "Why graphs",
      body: "<p>الشجرة بتفترض إن لكل حاجة «أب» واحد. الواقع مش كده: صديق عنده أصدقاء كتير وبعضهم أصدقاء بعض، مدينة فيها طرق لمدن كتير، كورس ليه كورسات لازم تتاخد قبله، صفحة ويب فيها لينكات لصفحات تانية. الـ <b>graph</b> هو الهيكل العام اللي بيمثل «حاجات» (vertices) و«علاقات بينها» (edges). الشجرة، والـ linked list، حالات خاصة منه.</p><p>الـ graph من أكتر المواضيع في الإنترفيو لأن أغلب المسائل فيه عبارة عن <b>نمذجة</b>: تشوف الجملة العادية وتقول «ده graph، النقط هي كذا والخطوط هي كذا»، وبعدين تطبق BFS أو DFS. المستوى ده بيركز على الهيكل نفسه: المصطلحات، تمثيله في الذاكرة بتكلفة كل طريقة، بناؤه في Dart، والنمذجة. وخوارزميات الـ graph بعمقها (Dijkstra، topological sort، إلخ) في stage الخوارزميات.</p>",
      points: [
        "<b>Vertex</b> (أو node): نقطة. <b>Edge</b>: خط بين نقطتين.",
        "أغلب مسائل الـ graph = اتفهم المسألة كـ graph + اختار التمثيل + BFS أو DFS.",
        "في الإنترفيو: السؤال الأول دايما «directed ولا undirected؟ weighted؟ فيه cycles؟ كام vertex وكام edge؟»",
      ],
    },
    {
      title: "المصطلحات: directed و weighted و degree و path و cycle",
      en: "Graph vocabulary",
      code: {
        lang: "text",
        src: `undirected (friendship)         directed (follows / prerequisite)

   A ---- B                        A ----> B
   |      |                        ^       |
   |      |                        |       v
   C ---- D      E                 C <---- D      E (isolated)

weighted (road lengths, km):  A --5-- B --2-- D

degree(A) = 2           directed: out-degree(A) = 1, in-degree(A) = 1
path A -> B -> D        cycle: A, B, D, C, A  (a path that returns to its start)
{A,B,C,D} and {E} are two connected components`,
        note: "في الـ undirected الـ edge بتتحسب مرة واحدة لكن بتزود degree الطرفين. مجموع الـ degrees = 2 × عدد الـ edges.",
      },
      body: "<p>الـ <b>edge</b> ممكن يكون <b>undirected</b> (صداقة: لو A صاحب B يبقى B صاحب A) أو <b>directed</b> (follow: A بيتابع B مش بالضرورة العكس). ممكن يكون ليه <b>وزن</b> (weight): مسافة، تكلفة، وقت.</p>",
      terms: [
        ["degree", "درجة الـ vertex", "عدد الـ edges المتصلة بيه. في الـ directed: in-degree للداخل و out-degree للخارج."],
        ["path", "مسار", "تسلسل vertices كل اتنين ورا بعض بينهم edge."],
        ["cycle", "دورة", "مسار بيرجع لنفس الـ vertex اللي بدأ منه."],
        ["connected component", "مكوّن متصل", "مجموعة vertices كل واحد فيها يقدر يوصل للتاني."],
        ["DAG", "directed acyclic graph", "directed من غير cycles. مثال: الكورسات ومتطلباتها."],
      ],
      interview: [
        { q: "إيه الفرق بين directed و undirected graph؟ وإيه هو الـ degree؟", a: "في الـ undirected الـ edge بيربط الطرفين بالتساوي (صداقة)، وفي الـ directed له اتجاه من vertex لتاني (follow، أو «كورس A لازم قبل B»). الـ degree هو عدد الـ edges المتصلة بالـ vertex؛ في الـ directed بنفرق in-degree (الداخل) و out-degree (الخارج). في الـ undirected مجموع الـ degrees يساوي ضعف عدد الـ edges." },
      ],
    },
    {
      title: "التمثيل: adjacency list و matrix و edge list",
      en: "Representations",
      body: "<p>فيه تلات طرق لتخزين نفس الـ graph. الاختيار بيعتمد على عدد الـ edges E مقارنة بالـ vertices V: graph <b>sparse</b> (E قريب من V، زي شبكة طرق وأصدقاء) ولا <b>dense</b> (E قريب من V²).</p>",
      code: {
        lang: "text",
        title: "edges: 0-1, 0-2, 1-2, 2-3 (undirected)",
        src: `adjacency list           adjacency matrix        edge list
0: [1, 2]                   0 1 2 3             [(0,1), (0,2),
1: [0, 2]                0  . 1 1 .              (1,2), (2,3)]
2: [0, 1, 3]             1  1 . 1 .
3: [2]                   2  1 1 . 1
                         3  . . 1 .

                        Adj. list     Adj. matrix   Edge list
space                   O(V + E)      O(V^2)        O(E)
is there edge u-v?      O(deg(u))     O(1)          O(E)
neighbors of u          O(deg(u))     O(V)          O(E)
iterate all edges       O(V + E)      O(V^2)        O(E)
add an edge             O(1)          O(1)          O(1)
remove an edge          O(deg(u))     O(1)          O(E)`,
        note: "الـ matrix بتحجز V² خانة حتى لو الـ edges قليلة: 100,000 vertex = 10 مليار خانة. عشان كده الـ adjacency list هي الافتراضية تقريبا. الـ matrix بتكسب لما الـ graph dense أو محتاج تسأل «فيه edge بين u و v؟» في O(1) كتير، أو لـ V صغير.",
      },
      focus: [{ label: "احفظها", text: "الافتراضي: <b>adjacency list</b> (Map من vertex لقايمة جيرانه). مساحة O(V + E) ومرور على الجيران بتكلفة تساوي عددهم بالظبط. الـ matrix للـ dense أو الـ V الصغير، والـ edge list لما محتاج تعدي على كل الـ edges بس (زي Kruskal)." }],
      interview: [
        { q: "قارن adjacency list بـ adjacency matrix. إمتى تختار كل واحدة؟", a: "الـ list: مساحة O(V + E)، والمرور على جيران vertex بتكلفة عددهم، لكن فحص وجود edge معين O(degree). الـ matrix: مساحة O(V²)، وفحص edge في O(1)، لكن المرور على الجيران O(V) حتى لو عددهم قليل. بختار list لأغلب الحالات لأن الـ graphs الحقيقية sparse (شبكة طرق، أصدقاء)، والـ matrix لو الـ graph dense أو V صغير وبسأل عن edges محددة كتير. الـ edge list لما بس محتاج أعدي على كل الـ edges." },
      ],
    },
    {
      title: "نبني graph في Dart",
      en: "Building a graph in Dart",
      body: "<p>الـ adjacency list في Dart هي ببساطة <code>Map&lt;int, List&lt;int&gt;&gt;</code> (أو <code>Map&lt;String, ...&gt;</code> لو الـ vertices أسماء). في الـ undirected بنضيف الـ edge في الاتجاهين. وفي الـ weighted بنخزن <b>record</b> <code>(vertex, weight)</code> بدل رقم.</p>",
      code: {
        lang: "dart",
        src: `class Graph {
  final bool directed;
  final Map<int, List<int>> _adj = {};

  Graph({this.directed = false});

  void addVertex(int v) => _adj.putIfAbsent(v, () => []);

  void addEdge(int u, int v) {
    addVertex(u);
    addVertex(v);
    _adj[u]!.add(v);
    if (!directed) _adj[v]!.add(u);
  }

  Iterable<int> get vertices => _adj.keys;
  List<int> neighbors(int v) => _adj[v] ?? const [];
  bool hasEdge(int u, int v) => neighbors(u).contains(v);

  // out-degree when the graph is directed
  int degree(int v) => neighbors(v).length;

  int inDegree(int v) =>
      _adj.values.fold(0, (s, ns) => s + ns.where((x) => x == v).length);
}

void main() {
  final g = Graph();
  g.addEdge(0, 1);
  g.addEdge(0, 2);
  g.addEdge(1, 2);
  g.addEdge(2, 3);
  g.addVertex(9);                 // a vertex with no edges
  print(g.neighbors(2));          // [0, 1, 3]
  print(g.degree(2));             // 3
  print(g.hasEdge(3, 2));         // true  (undirected)
  print(g.neighbors(9));          // []
  print(g.neighbors(42));         // []  (unknown vertex)

  final d = Graph(directed: true);
  d.addEdge(1, 2);
  d.addEdge(3, 2);
  print(d.hasEdge(2, 1));         // false
  print(d.inDegree(2));           // 2
  print(d.degree(2));             // 0

  // weighted: city -> (neighbour, km)
  final roads = <String, List<(String, int)>>{};
  void addRoad(String a, String b, int km) {
    roads.putIfAbsent(a, () => []).add((b, km));
    roads.putIfAbsent(b, () => []).add((a, km));
  }

  addRoad('Riyadh', 'Qassim', 350);
  addRoad('Riyadh', 'Dammam', 400);
  addRoad('Qassim', 'Hail', 280);
  print(roads['Riyadh']);         // [(Qassim, 350), (Dammam, 400)]
}`,
        note: "<code>addVertex</code> مهمة: vertex من غير edges لازم تبقى مفتاح في الـ Map وإلا هتختفي من أي مرور (مثلا في عد الـ components). و<code>neighbors</code> بترجع قايمة فاضية للـ vertex المجهول بدل ما ترمي exception.",
      },
      pitfall: "في الـ undirected لو نسيت تضيف الـ edge في الاتجاه التاني، <code>neighbors</code> هتبقى غير متماثلة وحلول الـ BFS/DFS هتدي نتايج غلط من غير أي error.",
    },
    {
      title: "الـ Grid كـ graph ضمني",
      en: "Grids as implicit graphs",
      body: "<p>كتير من مسائل الـ graph مبيديكش edges: بيديك <b>grid</b> (متاهة، خريطة جزر، لوحة لعبة). كل خانة <code>(r, c)</code> هي vertex، وجيرانها هي الخانات اللي فوق وتحت وشمال ويمين (4 اتجاهات). منبنيش adjacency list: بنحسب الجيران لحظيا بقايمة اتجاهات. اسمه <b>implicit graph</b>. لازم دايما نتأكد إن الجار جوه الحدود وإنه مش حيطة.</p>",
      code: {
        lang: "dart",
        src: `const dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)];

List<(int, int)> openNeighbors(List<List<int>> g, int r, int c) {
  final out = <(int, int)>[];
  for (final (dr, dc) in dirs) {
    final nr = r + dr;
    final nc = c + dc;
    final inside = nr >= 0 && nr < g.length && nc >= 0 && nc < g[nr].length;
    if (inside && g[nr][nc] == 0) out.add((nr, nc));   // 0 = open, 1 = wall
  }
  return out;
}

// islands: 1 = land. Each flood fill visits one whole island.
int numIslands(List<List<int>> grid) {
  if (grid.isEmpty) return 0;
  final rows = grid.length;
  final cols = grid[0].length;
  final seen = <int>{};                  // r * cols + c
  var count = 0;

  void fill(int r, int c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (grid[r][c] == 0 || !seen.add(r * cols + c)) return;
    fill(r + 1, c);
    fill(r - 1, c);
    fill(r, c + 1);
    fill(r, c - 1);
  }

  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (grid[r][c] == 1 && !seen.contains(r * cols + c)) {
        count++;
        fill(r, c);
      }
    }
  }
  return count;
}

void main() {
  final maze = [
    [0, 0, 1],
    [1, 0, 1],
    [0, 0, 0],
  ];
  print(openNeighbors(maze, 1, 1));    // [(2, 1), (0, 1)]
  print(openNeighbors(maze, 0, 0));    // [(0, 1)]
  print(numIslands([
    [1, 1, 0, 0],
    [1, 0, 0, 1],
    [0, 0, 1, 1],
  ]));                                  // 2
  print(numIslands([]));                // 0
  print(numIslands([[0, 0]]));          // 0
}`,
        note: "الزمن O(R × C) لأن كل خانة بتتزار مرة. المساحة O(R × C) للـ seen، وعمق الـ recursion ممكن يوصل لعدد الخانات في أسوأ حالة، فعلى grid ضخمة استخدم BFS بـ queue أو stack بإيدك. للقطر ضيف 4 اتجاهات للـ <code>dirs</code>.",
      },
      interview: [
        { q: "إزاي تتعامل مع grid كـ graph؟ وإزاي تعد الجزر (number of islands)؟", a: "كل خانة vertex وجيرانها الأربعة (فوق وتحت وشمال ويمين) هي الـ edges، بحسبهم بقايمة اتجاهات (dr, dc) وبفحص الحدود. لعد الجزر: بلف على كل الخانات، ولما ألاقي أرض (1) لسه مزرتهاش بزود العداد وبعمل flood fill (DFS أو BFS) بيعلّم الجزيرة كلها كمزارة. الزمن والمساحة O(R × C)." },
      ],
    },
    {
      title: "BFS و DFS: بالقدر اللي نحتاجه",
      en: "BFS and DFS, just enough",
      body: "<p>الاتنين بيزوروا كل vertex يوصل لها من نقطة البداية مرة واحدة: O(V + E) مع adjacency list. الفرق في الترتيب. <b>BFS</b> بتخلص المستوى الأقرب الأول باستخدام <b>queue</b>، فبتدي <b>أقصر مسار (بعدد الـ edges)</b> في graph من غير أوزان. <b>DFS</b> بتغوص لآخرها وترجع باستخدام recursion (أو stack)، ومناسبة للـ components وكشف الـ cycles والـ backtracking.</p><p>القاعدة اللي بتفرق بين الـ graph والشجرة: لازم <b>set اسمه seen</b>. الـ graph فيه cycles (وكل edge في undirected رايح جاي)، فمن غير seen هتلف للأبد.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

// distance (in edges) from start to every reachable vertex
Map<int, int> bfs(Map<int, List<int>> g, int start) {
  final dist = {start: 0};
  final q = Queue<int>()..add(start);
  while (q.isNotEmpty) {
    final v = q.removeFirst();
    for (final n in g[v] ?? const <int>[]) {
      if (dist.containsKey(n)) continue;   // mark when we enqueue
      dist[n] = dist[v]! + 1;
      q.add(n);
    }
  }
  return dist;
}

void dfs(Map<int, List<int>> g, int v, Set<int> seen, List<int> order) {
  if (!seen.add(v)) return;
  order.add(v);
  for (final n in g[v] ?? const <int>[]) {
    dfs(g, n, seen, order);
  }
}

void main() {
  final g = <int, List<int>>{
    0: [1, 2],
    1: [0, 3],
    2: [0, 3],
    3: [1, 2, 4],
    4: [3],
    5: [6],
    6: [5],
  };
  print(bfs(g, 0));        // {0: 0, 1: 1, 2: 1, 3: 2, 4: 3}
  final order = <int>[];
  dfs(g, 0, <int>{}, order);
  print(order);            // [0, 1, 3, 2, 4]
  print(bfs(g, 5));        // {5: 0, 6: 1}
  print(bfs({}, 7));       // {7: 0}
}`,
        note: "الـ BFS بتعلّم الـ vertex كـ seen لحظة ما تدخل الـ queue مش لما تطلع، عشان ميدخلش مرتين. ومفاتيح الـ dist بترجع بترتيب الاكتشاف. الـ vertices 5 و 6 مش واصلة من 0 فمش ظاهرة في النتيجة.",
      },
      interview: [
        { q: "إمتى تستخدم BFS وإمتى DFS؟", a: "BFS لما محتاج أقصر مسار بعدد الـ edges في graph من غير أوزان، أو أي حاجة بالمستويات (أقرب جار، degrees of separation). DFS للمرور الكامل: components، كشف cycles، topological sort، الـ backtracking. الاتنين O(V + E) ولازم seen set. الفرق العملي: BFS بتستخدم queue ومساحتها بحجم أعرض مستوى، DFS بتستخدم stack/recursion ومساحتها بعمق المسار (وممكن تعمل stack overflow في graph عميق)." },
      ],
    },
    {
      title: "الـ components وكشف الـ cycle في undirected graph",
      en: "Connected components and cycle detection",
      body: "<p><b>عدد الـ components:</b> لف على كل الـ vertices، ولما تلاقي واحد لسه مزرتوش زود العداد وعمل traversal يعلّم كل المتصل بيه. <b>الـ cycle في undirected:</b> أثناء الـ DFS لو لقيت جار مزور <b>وهو مش الـ parent</b> اللي جيت منه، يبقى فيه cycle. (الـ parent مستثنى لأن كل edge رايح جاي، فالرجوع للـ parent مش cycle.)</p>",
      code: {
        lang: "dart",
        src: `int countComponents(Map<int, List<int>> g) {
  final seen = <int>{};
  var count = 0;
  for (final v in g.keys) {
    if (seen.contains(v)) continue;
    count++;
    final stack = [v];
    seen.add(v);
    while (stack.isNotEmpty) {
      final cur = stack.removeLast();
      for (final n in g[cur] ?? const <int>[]) {
        if (seen.add(n)) stack.add(n);
      }
    }
  }
  return count;
}

// undirected graph, no parallel edges
bool hasCycle(Map<int, List<int>> g) {
  final seen = <int>{};

  bool dfs(int v, int parent) {
    seen.add(v);
    for (final n in g[v] ?? const <int>[]) {
      if (n == parent) continue;
      if (seen.contains(n)) return true;
      if (dfs(n, v)) return true;
    }
    return false;
  }

  for (final v in g.keys) {
    if (!seen.contains(v) && dfs(v, -1)) return true;
  }
  return false;
}

void main() {
  final path = <int, List<int>>{0: [1], 1: [0, 2], 2: [1], 3: []};
  final ring = <int, List<int>>{0: [1, 2], 1: [0, 2], 2: [0, 1]};
  print(countComponents(path));   // 2
  print(countComponents(ring));   // 1
  print(countComponents({}));     // 0
  print(hasCycle(path));          // false
  print(hasCycle(ring));          // true
  print(hasCycle({}));            // false
}`,
        note: "الاتنين O(V + E). بنعمل loop على كل <code>g.keys</code> عشان الـ graph ممكن يكون مش متصل. القيمة <code>-1</code> كـ parent للبداية آمنة لأن مفيش vertex رقمه -1 هنا. لو فيه edges متكررة بين نفس الاتنين الاستثناء بالـ parent بيفوّت cycle (استخدم edge id).",
      },
      interview: [
        { q: "إزاي تعد الـ connected components وتكشف cycle في undirected graph؟", a: "للـ components: بلف على الـ vertices، ولكل واحد لسه مش seen بزود العداد وبعمل DFS أو BFS يعلّم المتصل بيه كله. O(V + E). للـ cycle: DFS بمرر الـ parent، ولو لقيت جار seen مش هو الـ parent يبقى فيه cycle، لأن كل edge رايح جاي فالـ parent طبيعي. بديل أسهل: Union-Find (المستوى الجاي) بيكشف إن edge بتربط vertexين أصلا في نفس المكوّن." },
      ],
    },
    {
      title: "نمذجة (1): شبكة الأصدقاء وخريطة المدن",
      en: "Modelling: friends network and map of cities",
      body: "<p><b>شبكة الأصدقاء:</b> undirected، الـ vertices ناس والـ edges صداقة. «اقتراح أصدقاء» = أصدقاء الأصدقاء اللي مش أصحابك لسه (مسافة 2). «درجة الانفصال» = BFS distance. الـ degree = عدد الأصدقاء.</p><p><b>خريطة المدن:</b> الـ vertices مدن والـ edges طرق وليها وزن (كم). «هل أقدر أوصل من A لـ B؟» = BFS/DFS ويتجاهل الوزن. «أقصر مسافة» = Dijkstra (stage الخوارزميات). الـ graph هنا sparse فبنستخدم adjacency list بأزواج (جار، وزن).</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

// friends of friends who are not already friends (and not me)
Set<int> suggestions(Map<int, List<int>> g, int me) {
  final friends = (g[me] ?? const <int>[]).toSet();
  final out = <int>{};
  for (final f in friends) {
    for (final ff in g[f] ?? const <int>[]) {
      if (ff != me && !friends.contains(ff)) out.add(ff);
    }
  }
  return out;
}

// how many hops between a and b (-1 if not connected)
int separation(Map<int, List<int>> g, int a, int b) {
  if (a == b) return 0;
  final dist = {a: 0};
  final q = Queue<int>()..add(a);
  while (q.isNotEmpty) {
    final v = q.removeFirst();
    for (final n in g[v] ?? const <int>[]) {
      if (dist.containsKey(n)) continue;
      dist[n] = dist[v]! + 1;
      if (n == b) return dist[n]!;
      q.add(n);
    }
  }
  return -1;
}

void main() {
  final friends = {
    1: [2, 3],
    2: [1, 4],
    3: [1, 4, 5],
    4: [2, 3],
    5: [3],
    6: [7],
    7: [6],
  };
  print(suggestions(friends, 1));    // {4, 5}
  print(suggestions(friends, 6));    // {}
  print(separation(friends, 1, 4));  // 2
  print(separation(friends, 2, 5));  // 3
  print(separation(friends, 1, 7));  // -1
  print(separation(friends, 3, 3));  // 0

  // cities: sort the roads of a city from nearest to farthest
  final roads = {
    'Riyadh': [('Qassim', 350), ('Dammam', 400), ('Kharj', 80)],
  };
  final sorted = [...roads['Riyadh']!]..sort((a, b) => a.$2.compareTo(b.$2));
  print(sorted.first.$1);            // Kharj
}`,
        note: "اللي بيفرق في النمذجة هو السؤال: «إيه هما الـ vertices وإيه معنى الـ edge؟». لاحظ إن الـ separation بتحتاج graph undirected: لو الصداقة كانت directed (follow) النتيجة بتتغير.",
      },
    },
    {
      title: "نمذجة (2): متطلبات الكورسات (directed graph)",
      en: "Modelling: course prerequisites",
      body: "<p>«ينفع تخلص كل الكورسات؟» الـ vertices كورسات، والـ edge من <code>A</code> لـ <code>B</code> معناها «A لازم قبل B». ينفع تخلص لو وبس لو الـ graph مفيهوش <b>cycle</b> (DAG): لو A محتاج B و B محتاج A مستحيل تبدأ بأي واحد. طريقة <b>Kahn</b> بتكشف ده وبتدي ترتيب مقبول: احسب in-degree لكل كورس، ابدأ بالكورسات اللي in-degree بتاعها 0 (من غير متطلبات) في queue، وكل ما تخلص كورس نقّص in-degree للكورسات اللي بعده وضيف اللي بقى صفر. لو خلصنا كل الكورسات يبقى ينفع، وإلا فيه cycle.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

// prerequisites: [course, mustTakeFirst]
List<int> courseOrder(int n, List<List<int>> prerequisites) {
  final adj = List.generate(n, (_) => <int>[]);
  final indegree = List.filled(n, 0);
  for (final p in prerequisites) {
    adj[p[1]].add(p[0]);
    indegree[p[0]]++;
  }
  final q = Queue<int>();
  for (var i = 0; i < n; i++) {
    if (indegree[i] == 0) q.add(i);
  }
  final order = <int>[];
  while (q.isNotEmpty) {
    final c = q.removeFirst();
    order.add(c);
    for (final next in adj[c]) {
      indegree[next]--;
      if (indegree[next] == 0) q.add(next);
    }
  }
  return order.length == n ? order : [];   // [] means a cycle
}

bool canFinish(int n, List<List<int>> prerequisites) =>
    n == 0 || courseOrder(n, prerequisites).isNotEmpty;

void main() {
  print(courseOrder(4, [[1, 0], [2, 0], [3, 1], [3, 2]]));  // [0, 1, 2, 3]
  print(canFinish(2, [[1, 0]]));            // true
  print(canFinish(2, [[1, 0], [0, 1]]));    // false
  print(canFinish(3, []));                  // true
  print(canFinish(0, []));                  // true
  print(canFinish(1, [[0, 0]]));            // false (needs itself)
}`,
        note: "O(V + E) زمن ومساحة. الـ <code>List.generate</code> مهمة: <code>List.filled(n, [])</code> كانت هتشارك قايمة واحدة بين كل الـ vertices (الفخ اللي شفناه في s1). فيه ترتيب مقبول أكتر من واحد، والكود بيرجع واحد منهم.",
      },
      interview: [
        { q: "كورسات ومتطلبات: إزاي تعرف إن ينفع تخلصهم كلهم؟", a: "بنمذجها كـ directed graph (edge من المتطلب للكورس) وبسأل: هل فيه cycle؟ بطريقة Kahn: بحسب in-degree لكل كورس، وبحط اللي in-degree بتاعه 0 في queue، وبعدين كل ما أشيل كورس بنقّص in-degree جيرانه وبضيف اللي بقى 0. لو عدد الكورسات اللي اتشالت يساوي n يبقى مفيش cycle وترتيب الشيل هو topological order، وإلا فيه cycle ومستحيل. O(V + E). بديل: DFS بثلاث ألوان لكشف cycle في directed graph." },
      ],
    },
    {
      title: "اختيار التمثيل، وأخطاء شائعة",
      en: "Choosing a representation and pitfalls",
      code: {
        lang: "text",
        src: `Situation                                    Choose
sparse graph, walk neighbours (BFS/DFS)      adjacency list  (default)
V small or graph dense, ask "edge u-v?"      adjacency matrix
only loop over all edges (Kruskal, sort)     edge list
vertices are 0..n-1 integers                 List<List<int>> instead of Map
vertices are strings / objects               Map<String, List<String>>
grid / board                                 implicit: compute neighbours`,
        note: "لو الـ vertices أرقام من 0 لـ n-1 فـ <code>List.generate(n, (_) =&gt; &lt;int&gt;[])</code> أسرع وأبسط من Map. لو أسماء استخدم Map.",
      },
      points: [
        "<b>نسيان seen set:</b> أي traversal على graph بدونه ممكن يلف للأبد أو يكرر الشغل بشكل أسي. علّم الـ vertex لحظة اكتشافه مش لحظة معالجته.",
        "<b>undirected = edge في الاتجاهين:</b> ضيفها في قايمتين، وإلا الـ graph هتبقى directed بالغلط.",
        "<b>graph مش متصل:</b> traversal واحد من vertex واحد مش هيوصل لكل حاجة. لف على كل الـ vertices وابدأ traversal جديد من أي واحد مش seen.",
        "<b>vertex من غير edges:</b> لو حطيت الـ vertices في Map عن طريق الـ edges بس، الـ vertex المعزول مش هتتحسب. استخدم <code>addVertex</code>.",
        "<b>الـ self-loop والـ edges المتكررة:</b> اسأل المحاور هل موجودة. هتأثر على الـ degree وكشف الـ cycle.",
        "<b>عمق الـ recursion:</b> DFS recursive على graph عميق جدا (سلسلة بمئة ألف vertex) ممكن stack overflow. اكتب نسخة iterative بـ stack.",
      ],
      interview: [
        { q: "مسألة بتديك edges. إيه الأسئلة اللي تسألها قبل ما تبدأ؟", a: "directed ولا undirected؟ فيه أوزان؟ ممكن cycles؟ ممكن self-loops أو edges مكررة؟ الـ graph متصل ولا ممكن يكون فيه أكتر من component؟ كام vertex وكام edge (sparse ولا dense)؟ الـ vertices أرقام من 0 لـ n-1 ولا أسماء؟ الإجابات بتحدد التمثيل (غالبا adjacency list) والخوارزمية (BFS لأقصر مسار من غير أوزان، DFS للـ components والـ cycles، وبعدين Dijkstra لو فيه أوزان)." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: كلاس Graph بسيط",
      lang: "dart",
      code: `class Graph {
  final Map<int, List<int>> adj = {};

  void addEdge(int u, int v) {
    adj.putIfAbsent(u, () => []).add(v);
    adj.putIfAbsent(v, () => []).add(u);
  }

  List<int> neighbors(int v) => adj[v] ?? [];
  int degree(int v) => neighbors(v).length;
}`,
    },
    {
      title: "اكتب: BFS بالمسافات",
      lang: "dart",
      code: `import 'dart:collection';

Map<int, int> bfs(Map<int, List<int>> g, int start) {
  final dist = {start: 0};
  final q = Queue<int>()..add(start);
  while (q.isNotEmpty) {
    final v = q.removeFirst();
    for (final n in g[v] ?? <int>[]) {
      if (dist.containsKey(n)) continue;
      dist[n] = dist[v]! + 1;
      q.add(n);
    }
  }
  return dist;
}`,
    },
    {
      title: "اكتب: DFS بـ seen",
      lang: "dart",
      code: `void dfs(
  Map<int, List<int>> g,
  int v,
  Set<int> seen,
  List<int> order,
) {
  if (!seen.add(v)) return;
  order.add(v);
  for (final n in g[v] ?? <int>[]) {
    dfs(g, n, seen, order);
  }
}`,
    },
  ],

  tasks: [
    {
      title: "ابني الـ graph من قايمة edges",
      lang: "dart",
      prompt: "<p>اكتب <code>List&lt;List&lt;int&gt;&gt; buildGraph(int n, List&lt;List&lt;int&gt;&gt; edges)</code> بترجع adjacency list لـ undirected graph فيها الـ vertices من <code>0</code> لـ <code>n - 1</code>. كل عنصر في <code>edges</code> هو <code>[u, v]</code>. الـ vertices اللي من غير edges لازم يبقى ليها قايمة فاضية. وبعدين اكتب <code>int maxDegree(List&lt;List&lt;int&gt;&gt; g)</code> بترجع أكبر degree (0 لو الـ graph فاضي).</p>",
      examples: [
        { in: "n = 4, edges = [[0,1],[0,2],[2,3]]", out: "[[1, 2], [0], [0, 3], [2]]" },
        { in: "n = 3, edges = []", out: "[[], [], []]" },
        { in: "maxDegree لأول مثال", out: "2" },
      ],
      starter: `List<List<int>> buildGraph(int n, List<List<int>> edges) {
  // your code
}

int maxDegree(List<List<int>> g) {
  // your code
}`,
      hints: [
        "اعمل <code>List.generate(n, (_) =&gt; &lt;int&gt;[])</code> مش <code>List.filled(n, [])</code> عشان كل vertex تاخد قايمة خاصة بيها.",
        "كل edge <code>[u, v]</code> بتتضاف في قايمة u وقايمة v. الـ maxDegree هي أكبر <code>length</code> بين القوايم.",
      ],
      solution: `List<List<int>> buildGraph(int n, List<List<int>> edges) {
  final g = List.generate(n, (_) => <int>[]);
  for (final e in edges) {
    g[e[0]].add(e[1]);
    g[e[1]].add(e[0]);
  }
  return g;
}

int maxDegree(List<List<int>> g) {
  var best = 0;
  for (final ns in g) {
    if (ns.length > best) best = ns.length;
  }
  return best;
}`,
      explain: "O(n + E) زمن ومساحة. الـ <code>List.generate</code> بتعمل قايمة جديدة لكل vertex، وده بيتجنب فخ المشاركة اللي بتحصل مع <code>List.filled</code>. الـ vertex من غير edges بتفضل بقايمتها الفاضية.",
    },
    {
      title: "عدد الجزر",
      lang: "dart",
      prompt: "<p>اكتب <code>int numIslands(List&lt;List&lt;int&gt;&gt; grid)</code>. الـ grid فيها <code>1</code> (أرض) و<code>0</code> (ماية). الجزيرة هي مجموعة أراضي متصلة من فوق وتحت وشمال ويمين (مش قطري). رجّع عدد الجزر. الـ grid ممكن تكون فاضية.</p>",
      examples: [
        { in: "[[1,1,0,0],[1,0,0,1],[0,0,1,1]]", out: "2" },
        { in: "[[1,0,1],[0,1,0],[1,0,1]]", out: "5" },
        { in: "[]", out: "0" },
      ],
      starter: `int numIslands(List<List<int>> grid) {
  // your code
}`,
      hints: [
        "لف على كل الخانات. لما تلاقي 1 لسه مزرتهاش، زوّد العداد وعمل DFS أو BFS يعلّم الجزيرة كلها.",
        "استخدم Set للمزار (مثلا <code>r * cols + c</code>) ومتنساش فحص الحدود قبل ما تقرا الخانة.",
      ],
      solution: `int numIslands(List<List<int>> grid) {
  if (grid.isEmpty) return 0;
  final rows = grid.length;
  final cols = grid[0].length;
  final seen = <int>{};
  var count = 0;

  void fill(int r, int c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (grid[r][c] == 0 || !seen.add(r * cols + c)) return;
    fill(r + 1, c);
    fill(r - 1, c);
    fill(r, c + 1);
    fill(r, c - 1);
  }

  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (grid[r][c] == 1 && !seen.contains(r * cols + c)) {
        count++;
        fill(r, c);
      }
    }
  }
  return count;
}`,
      explain: "كل خانة بتتزار مرة: O(R × C) زمن ومساحة. الـ <code>seen.add</code> بترجع false لو الخانة مزورة فبتخدم كفحص وتعليم في خطوة. على grid ضخمة حوّل الـ fill لـ BFS لتجنب stack overflow.",
    },
    {
      title: "هل ينفع تخلص الكورسات؟",
      lang: "dart",
      prompt: "<p>عندك <code>n</code> كورس مرقمين من 0 لـ n-1، و<code>prerequisites</code> قايمة من أزواج <code>[a, b]</code> معناها «لازم تاخد b قبل a». اكتب <code>bool canFinish(int n, List&lt;List&lt;int&gt;&gt; prerequisites)</code> بترجع true لو ينفع تخلص كل الكورسات. حل في O(n + E).</p>",
      examples: [
        { in: "n = 2, [[1,0]]", out: "true" },
        { in: "n = 2, [[1,0],[0,1]]", out: "false" },
        { in: "n = 3, []", out: "true" },
      ],
      starter: `bool canFinish(int n, List<List<int>> prerequisites) {
  // your code
}`,
      hints: [
        "ابني adjacency list (من b لـ a) واحسب in-degree لكل كورس.",
        "ابدأ بالكورسات اللي in-degree بتاعها 0 في queue، وكل ما تطلع واحدة نقّص in-degree جيرانها. لو عدد اللي اتعالجوا يساوي n يبقى ينفع.",
      ],
      solution: `import 'dart:collection';

bool canFinish(int n, List<List<int>> prerequisites) {
  final adj = List.generate(n, (_) => <int>[]);
  final indegree = List.filled(n, 0);
  for (final p in prerequisites) {
    adj[p[1]].add(p[0]);
    indegree[p[0]]++;
  }
  final q = Queue<int>();
  for (var i = 0; i < n; i++) {
    if (indegree[i] == 0) q.add(i);
  }
  var done = 0;
  while (q.isNotEmpty) {
    final c = q.removeFirst();
    done++;
    for (final next in adj[c]) {
      indegree[next]--;
      if (indegree[next] == 0) q.add(next);
    }
  }
  return done == n;
}`,
      explain: "Kahn's algorithm: لو فيه cycle فالكورسات اللي فيها عمر in-degree بتاعها ما بيوصلش صفر، فمبتدخلش الـ queue و<code>done</code> بتفضل أقل من n. O(n + E). لو n = 0 النتيجة true لأن <code>done == n == 0</code>.",
    },
  ],

  quiz: [
    {
      q: "undirected graph فيها 5 edges. مجموع الـ degrees لكل الـ vertices؟",
      answer: ["10", "١٠"],
      why: "كل edge بتزود degree الطرفين بواحد، فمجموع الـ degrees = 2 × عدد الـ edges = 10.",
    },
    {
      q: "عندك graph فيها 100,000 vertex و300,000 edge فقط. أنسب تمثيل؟",
      options: [
        "adjacency matrix",
        "adjacency list",
        "قايمة edges فقط ونبحث فيها كل مرة",
        "matrix من bool عشان أوفر مساحة",
      ],
      answer: 1,
      why: "الـ graph sparse. الـ matrix هتحجز 10 مليار خانة (V²) والـ list O(V + E) = 400 ألف تقريبا. الـ edge list وحدها بتخلي كل سؤال «جيران vertex» O(E).",
    },
    {
      q: "تكلفة فحص «فيه edge بين u و v؟» في adjacency matrix؟",
      options: ["O(V)", "O(V + E)", "O(1)", "O(E)"],
      answer: 2,
      why: "قراءة <code>m[u][v]</code> مباشرة. ده أهم مميزات الـ matrix. في الـ list لازم تفحص قايمة جيران u.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final d = Graph(directed: true);
d.addEdge(1, 2);
d.addEdge(3, 2);
print(d.inDegree(2));` },
      answer: ["2", "٢"],
      why: "edge من 1 لـ 2 ومن 3 لـ 2: اتنين داخلين على 2. الـ out-degree بتاعتها 0.",
    },
    {
      q: "ليه BFS/DFS على graph محتاجين set اسمه seen؟",
      options: [
        "عشان نوفر ذاكرة",
        "عشان نرتب الجيران",
        "عشان الـ graph غير متصل",
        "لأن فيه cycles (وكل edge undirected رايحة جاية) فمن غير seen هنلف للأبد أو نكرر الـ vertices",
      ],
      answer: 3,
      why: "الشجرة مفيهاش cycles فمفيش حاجة للـ seen. في الـ graph الرجوع للـ vertex اللي جيت منه ممكن وطبيعي. الـ graph غير المتصل بيتحل بحلقة على كل الـ vertices مش بالـ seen.",
    },
    {
      q: "عايز أقل عدد edges بين شخصين في شبكة أصدقاء (من غير أوزان). إيه الأنسب؟",
      options: ["BFS", "DFS", "الترتيب بالـ sort", "Heap sort"],
      answer: 0,
      why: "الـ BFS بتزور الـ vertices بترتيب بعدها عن البداية، فأول مرة تصل فيها لـ vertex هي بأقصر مسار. الـ DFS ممكن توصل بمسار طويل.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print(canFinish(2, [[1, 0], [0, 1]]));` },
      answer: ["false"],
      why: "الكورس 1 محتاج 0 والـ 0 محتاج 1: cycle. ما فيش كورس in-degree بتاعه صفر فالـ queue فاضية و<code>done = 0 != 2</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print(numIslands([
  [1, 1, 0, 0],
  [1, 0, 0, 1],
  [0, 0, 1, 1],
]));` },
      answer: ["2"],
      why: "جزيرة فوق شمال (3 خانات)، وجزيرة تحت يمين (الخانات (1,3) و(2,2) و(2,3) متصلة). مفيش اتصال قطري.",
    },
    {
      q: "تعريف الشجرة كـ graph؟",
      options: [
        "graph فيها cycle واحد بس",
        "graph directed فقط",
        "graph متصل، من غير cycles، وعدد edges فيه V - 1",
        "graph كل vertex فيها degree اتنين",
      ],
      answer: 2,
      why: "الشجرة connected و acyclic، وده يتبعه إن عدد الـ edges V - 1. ولو شلت أي edge اتفصلت، ولو زودت واحدة ظهر cycle.",
    },
    {
      q: "خطوة ناقصة في الكود ده؟ مفروض يبني undirected graph.",
      code: { lang: "dart", src: `void addEdge(Map<int, List<int>> g, int u, int v) {
  g.putIfAbsent(u, () => []).add(v);
}` },
      options: [
        "ناقصة تضيف u في قايمة v كمان",
        "ناقصة <code>sort</code> للقايمة",
        "ناقصة تفحص إن u != v",
        "مفيش حاجة ناقصة",
      ],
      answer: 0,
      why: "في الـ undirected الـ edge لازم تتسجل في الاتجاهين. من غيرها v مش هتشوف u كجار، فالـ BFS من v مش هيوصل لـ u.",
    },
  ],
};
