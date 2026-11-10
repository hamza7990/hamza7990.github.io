window.LEVELS = window.LEVELS || {};
window.LEVELS["algo/a6"] = {
  slides: [
    {
      kicker: "الفكرة",
      title: "الـ graph: عقد وروابط، وكل حاجة تقريبا graph",
      en: "Graphs as adjacency lists and grids as graphs",
      body: "<p>الـ graph هو مجموعة <b>عقد</b> (nodes) وبينهم <b>روابط</b> (edges). خريطة طرق، صحاب على فيسبوك، ملفات بتعتمد على بعض، وكمان أي <b>grid</b> (لوحة، متاهة، صورة) هي graph: كل خانة عقدة، وجيرانها الأربعة (فوق/تحت/يمين/شمال) هما الروابط. لما تشوف المسألة بالشكل ده، نص مسائل الإنترفيو بتبقى نفس الكود.</p><p>الشكل الأشهر للتخزين هو <b>adjacency list</b>: لكل عقدة قايمة بجيرانها. مساحته O(V + E) (V عدد العقد وE عدد الروابط)، وبيخليك تلف على جيران عقدة في وقت يساوي عددهم بالظبط. البديل adjacency matrix (جدول V × V) مساحته O(V^2) ومناسب بس للـ graph الكثيف جدا.</p><p>الـ graph الـ <b>undirected</b> بنضيف فيه الرابط في الاتجاهين، والـ <b>directed</b> بنضيفه في اتجاه واحد.</p>",
      code: {
        lang: "dart",
        title: "من edge list لـ adjacency list، وجيران الخانة في grid",
        src: `void main() {
  final n = 6;
  final edges = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]];
  final adj = List.generate(n, (_) => <int>[]);
  for (final e in edges) {
    adj[e[0]].add(e[1]);
    adj[e[1]].add(e[0]);      // undirected: both directions
  }
  print(adj);   // [[1, 2], [0, 3], [0, 3], [1, 2, 4], [3], []]

  // a grid cell has up to 4 neighbours
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  final rows = 3, cols = 4;
  final r = 0, c = 0;
  final inside = <List<int>>[];
  for (final d in dirs) {
    final nr = r + d[0], nc = c + d[1];
    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
    inside.add([nr, nc]);
  }
  print(inside);   // [[1, 0], [0, 1]]
}`,
        note: "العقدة 5 معزولة (مالهاش جيران) وده طبيعي: قايمتها فاضية. وخانة الركن (0,0) ليها جارين بس لأن الباقي برا الحدود.",
      },
      terms: [
        ["adjacency list", "قايمة الجيران", "لكل عقدة قايمة بالعقد المتصلة بيها. مساحة O(V + E)."],
        ["directed / undirected", "موجه / غير موجه", "الرابط في اتجاه واحد أو في الاتجاهين."],
      ],
    },
    {
      kicker: "BFS",
      title: "BFS: امشي طبقة طبقة بـ queue",
      en: "Breadth-first search with a queue",
      body: "<p>الـ BFS بيبدأ من عقدة، يزورها، وبعدين يزور كل جيرانها، وبعدين جيران جيرانها... يعني <b>الأقرب الأول</b>. الأداة هي الـ <b>queue</b> (الأول يدخل الأول يخرج): بنشيل عقدة من الأول ونحط جيرانها الجداد في الآخر. فالعقد القريبة دايما قدام البعيدة.</p><p>القاعدة المهمة: نعلّم العقدة كـ <code>seen</code> <b>وقت ما ندخلها الـ queue</b> (مش وقت ما نشيلها)، علشان متدخلش مرتين.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

List<int> bfs(List<List<int>> adj, int start) {
  final order = <int>[];
  final seen = List<bool>.filled(adj.length, false);
  final q = Queue<int>();
  seen[start] = true;
  q.add(start);
  while (q.isNotEmpty) {
    final u = q.removeFirst();
    order.add(u);
    for (final v in adj[u]) {
      if (!seen[v]) {
        seen[v] = true;        // mark when pushing
        q.add(v);
      }
    }
  }
  return order;
}

void main() {
  final List<List<int>> adj = [[1, 2], [0, 3], [0, 3], [1, 2, 4], [3], []];
  print(bfs(adj, 0));   // [0, 1, 2, 3, 4]
  print(bfs(adj, 5));   // [5]
  print(bfs([[]], 0));  // [0]
}`,
        note: "<code>Queue</code> جاية من <code>dart:collection</code>. <code>removeFirst</code> و<code>add</code> كلهم O(1). متستخدمش <code>list.removeAt(0)</code> كـ queue لأنها O(n).",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع bfs(adj, 0) على نفس الـ graph",
          src: `pop 0   add [1, 2]   queue: [1, 2]
pop 1   add [3]      queue: [2, 3]
pop 2   add []       queue: [3]        (3 already seen)
pop 3   add [4]      queue: [4]
pop 4   add []       queue: []
order: 0, 1, 2, 3, 4          node 5 never reached`,
        },
      ],
      focus: [{ label: "احفظها", text: "BFS = queue + seen. علّم seen وقت الإدخال. العقد بتخرج بترتيب بعدها عن البداية." }],
      interview: [
        { q: "اشرح BFS وإيه الـ data structure اللي بتحتاجها؟", a: "BFS بيزور العقد بترتيب بعدها عن نقطة البداية (بعدد الروابط). بحط البداية في queue وأعلّمها seen، وفي كل لفة بشيل عقدة من الأول، وكل جار مش seen أعلّمه وأحطه في الآخر. الزمن O(V + E) لأن كل عقدة بتدخل مرة وكل رابط بيتفحص مرة (أو مرتين في undirected)، والمساحة O(V) للـ queue والـ seen.",
        },
      ],
    },
    {
      kicker: "أقصر مسار",
      title: "BFS بيدّيك أقصر مسار في graph من غير أوزان",
      en: "Shortest path in an unweighted graph",
      body: "<p>لأن الـ queue بتخلي العقد تتزار بترتيب بعدها، <b>أول مرة توصل فيها لعقدة هي بأقل عدد روابط</b>. محتاجين بس نسجل مين وصّلنا لكل عقدة (<code>parent</code>) وبعدين نرجع من الهدف للبداية. نفس الفكرة لو عايز العدد بس: <code>dist[v] = dist[u] + 1</code>.</p><p>لو فيه أكتر من نقطة بداية في نفس الوقت (زي كذا مصدر عدوى) حط <b>كلهم</b> في الـ queue من الأول بمسافة 0: ده <b>multi-source BFS</b> وهنستخدمه في تاسك التفاح الفاسد.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

// fewest edges from s to t, or [] if t is unreachable
List<int> shortestPath(List<List<int>> adj, int s, int t) {
  final parent = List<int>.filled(adj.length, -2);   // -2 = not seen
  final q = Queue<int>()..add(s);
  parent[s] = -1;                                    // -1 = the start
  while (q.isNotEmpty) {
    final u = q.removeFirst();
    if (u == t) break;
    for (final v in adj[u]) {
      if (parent[v] == -2) {
        parent[v] = u;
        q.add(v);
      }
    }
  }
  if (parent[t] == -2) return [];
  final path = <int>[];
  for (var x = t; x != -1; x = parent[x]) {
    path.add(x);
  }
  return path.reversed.toList();
}

void main() {
  final List<List<int>> adj = [[1, 2], [0, 3], [0, 3], [1, 2, 4], [3], []];
  print(shortestPath(adj, 0, 4));   // [0, 1, 3, 4]
  print(shortestPath(adj, 4, 0));   // [4, 3, 1, 0]
  print(shortestPath(adj, 2, 2));   // [2]
  print(shortestPath(adj, 0, 5));   // []
}`,
        note: "المسار [0, 1, 3, 4] فيه 3 روابط. لو فيه أكتر من مسار بنفس الطول، بنرجع اللي اتلاقى الأول (الجار الأقدم في القايمة).",
      },
      codes: [
        {
          lang: "text",
          title: "المسافات من العقدة 0 (طبقة طبقة)",
          src: `distance 0:  [0]
distance 1:  [1, 2]
distance 2:  [3]
distance 3:  [4]
node 5:      unreachable (parent stays -2)`,
        },
      ],
      pitfall: "BFS بيدّي أقصر مسار <b>بعدد الروابط</b> بس. لو كل رابط له تكلفة مختلفة (كيلومترات، ثواني) BFS بيدّيك الإجابة الغلط، وتحتاج Dijkstra (المستوى الجاي).",
      interview: [
        { q: "ليه BFS بيلاقي أقصر مسار في graph من غير أوزان؟", a: "لأن الـ queue بتفضل ترتب العقد بحسب بعدها عن البداية: كل عقد المسافة d بتخرج قبل أي عقدة مسافتها d+1. فلما أوصل لعقدة أول مرة، مستحيل يكون فيه مسار أقصر منه، وإلا كنت وصلتلها قبل كده. وأسجل parent لكل عقدة علشان أرجع بالمسار. الزمن O(V + E).",
        },
      ],
    },
    {
      kicker: "DFS",
      title: "DFS: انزل لأبعد نقطة وارجع",
      en: "Depth-first search, recursive and iterative",
      body: "<p>الـ DFS بيمشي في مسار واحد لأبعد ما يقدر، ولما يخلص (مفيش جيران جداد) بيرجع خطوة ويجرب الفرع التاني. الأداة هي الـ <b>stack</b>: بالـ recursion بيبقى الـ call stack هو اللي بيتولى ده، وبالنسخة اليدوية بنستخدم <code>List</code> بـ <code>add</code> و<code>removeLast</code>.</p><p>النسخة اليدوية مهمة لو العمق كبير (آلاف الخانات): الـ recursion العميق جدا ممكن يرمي <code>StackOverflowError</code>. ولو عايز نفس ترتيب النسخة الـ recursive لازم تدفع الجيران بالعكس (<code>reversed</code>).</p>",
      code: {
        lang: "dart",
        src: `List<int> dfsRec(List<List<int>> adj, int start) {
  final order = <int>[];
  final seen = List<bool>.filled(adj.length, false);
  void go(int u) {
    seen[u] = true;
    order.add(u);
    for (final v in adj[u]) {
      if (!seen[v]) go(v);
    }
  }
  go(start);
  return order;
}

List<int> dfsStack(List<List<int>> adj, int start) {
  final order = <int>[];
  final seen = List<bool>.filled(adj.length, false);
  final stack = <int>[start];
  while (stack.isNotEmpty) {
    final u = stack.removeLast();
    if (seen[u]) continue;           // may be pushed twice
    seen[u] = true;
    order.add(u);
    for (final v in adj[u].reversed) {
      if (!seen[v]) stack.add(v);
    }
  }
  return order;
}

void main() {
  final List<List<int>> adj = [[1, 2], [0, 3], [0, 3], [1, 2, 4], [3], []];
  print(dfsRec(adj, 0));     // [0, 1, 3, 2, 4]
  print(dfsStack(adj, 0));   // [0, 1, 3, 2, 4]
}`,
        note: "الترتيب [0, 1, 3, 2, 4] مختلف عن BFS ([0, 1, 2, 3, 4]): DFS نزل من 0 لـ 1 لـ 3 قبل ما يرجع للعقدة 2.",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع dfsRec(adj, 0)",
          src: `go(0)  visit 0
  go(1)  visit 1
    go(3)  visit 3        neighbours of 3: 1 (seen), 2, 4
      go(2)  visit 2      neighbours: 0, 3 both seen -> return
      go(4)  visit 4      neighbour 3 seen -> return
order: 0, 1, 3, 2, 4`,
        },
      ],
      interview: [
        { q: "إيه الفرق بين DFS بالـ recursion وDFS بـ stack يدوي؟ وامتى تفضل الثاني؟", a: "الاتنين نفس الخوارزمية وبنفس الزمن O(V + E). الـ recursion أقصر وأوضح، والـ call stack هو الـ stack. بس عمق الـ recursion في Dart محدود (عشرات الآلاف من النداءات تقريبا)، فلو الـ graph أو الـ grid عميق جدا (زي سلسلة طويلة أو grid كبيرة كلها 1) بستخدم stack يدوي أو BFS علشان أتفادى StackOverflowError.",
        },
      ],
    },
    {
      kicker: "visited",
      title: "الـ visited: من غيره البرنامج يلف للأبد",
      en: "The visited set and why forgetting it loops forever",
      body: "<p>الـ graph فيه cycles (أ جاره ب، وب جاره أ). من غير <code>seen</code>، كل عقدة بتفتح جيرانها، وجيرانها بيفتحوها تاني، وهكذا بلا نهاية. في الـ recursion ده <code>StackOverflowError</code>، وفي الـ queue ده لوب لا نهائي والـ queue بتكبر لحد ما الذاكرة تخلص. حتى لو مفيش cycles، العقدة اللي ليها أكتر من أب هتتزار مرات كتير (إهدار أسي في بعض الأشكال).</p><p>القواعد: <b>(1)</b> علّم العقدة قبل ما تفتح جيرانها. <b>(2)</b> في BFS علّمها وقت الإدخال. <b>(3)</b> في DFS اليدوي (stack) لازم تفحص <code>seen</code> وقت الخروج لأن العقدة ممكن تتدفع أكتر من مرة. <b>(4)</b> في grid ممكن تستخدم الـ grid نفسها كـ visited (تحويل 1 لـ 0) لو مسموح تعدّلها.</p>",
      code: {
        lang: "dart",
        title: "عقدتين متصلتين من غير seen، مع حد أمان",
        src: `void main() {
  final adj = [[1], [0]];     // 0 <-> 1
  var steps = 0;
  void go(int u) {
    steps++;
    if (steps > 10) return;   // safety cap, otherwise it never ends
    for (final v in adj[u]) {
      go(v);
    }
  }
  go(0);
  print(steps);   // 11: only the cap stopped it
}`,
        note: "من غير الـ cap كان هيرمي <code>StackOverflowError</code>. العلاج سطر واحد: <code>seen</code>.",
      },
      codes: [
        {
          lang: "text",
          title: "تعليم seen وقت الإخراج بدل الإدخال (غلطة شائعة في BFS)",
          src: `graph: 0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3

mark when pushing:   queue 0 | 1 2 | 2 3 | 3      node 3 enters once
mark when popping:   queue 0 | 1 2 | 2 3 | 3 3   node 3 enters twice
(without a seen check at pop time, it is also processed twice)`,
        },
      ],
      pitfall: "نسيان <code>seen</code> أو تعليمه بعد ما تفتح الجيران بيخلي النتيجة مكررة أو البرنامج يلف. اسأل نفسك دايما: «إيه اللي بيمنع العقدة دي تتزار تاني؟».",
      interview: [
        { q: "إيه اللي بيحصل لو نسيت الـ visited في BFS أو DFS؟", a: "لو الـ graph فيه cycle، الخوارزمية بتلف في الـ cycle للأبد: stack overflow في الـ recursion أو queue بتكبر بلا نهاية. وحتى من غير cycles العقدة اللي ليها أكتر من أب بتتعالج أكتر من مرة. الحل set أو مصفوفة bool، وأعلّم العقدة وقت ما أدخلها (BFS) أو أول ما أزورها (DFS).",
        },
      ],
    },
    {
      kicker: "المكونات",
      title: "Connected components: كام «جزيرة» منفصلة",
      en: "Connected components",
      body: "<p>مكوّن متصل هو مجموعة عقد تقدر توصل من أي واحدة فيها لأي واحدة تانية. الطريقة: لف على كل العقد، ولما تلاقي عقدة لسه <code>seen</code> مش متعلمة، ده معناه مكوّن جديد (زوّد العداد)، وبعدين شغّل DFS أو BFS من العقدة دي يعلّم المكوّن كله. كل عقدة وكل رابط بيتزار مرة واحدة فالزمن O(V + E).</p>",
      code: {
        lang: "dart",
        src: `int countComponents(int n, List<List<int>> edges) {
  final adj = List.generate(n, (_) => <int>[]);
  for (final e in edges) {
    adj[e[0]].add(e[1]);
    adj[e[1]].add(e[0]);
  }
  final seen = List<bool>.filled(n, false);
  void dfs(int u) {
    seen[u] = true;
    for (final v in adj[u]) {
      if (!seen[v]) dfs(v);
    }
  }

  var count = 0;
  for (var i = 0; i < n; i++) {
    if (!seen[i]) {
      count++;          // a new component starts here
      dfs(i);           // mark all of it
    }
  }
  return count;
}

void main() {
  print(countComponents(6, [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]]));  // 2
  print(countComponents(5, [[0, 1], [1, 2], [3, 4]]));                  // 2
  print(countComponents(4, []));                                        // 4
  print(countComponents(0, []));                                        // 0
}`,
        note: "الحالة الأولى: {0,1,2,3,4} و{5}. من غير أي رابط، كل عقدة مكوّن لوحدها.",
      },
    },
    {
      kicker: "grid",
      title: "Number of Islands و Flood Fill",
      en: "Number of islands and flood fill",
      body: "<p>نفس فكرة المكونات لكن على grid. <b>Number of Islands</b>: الخانة <code>1</code> أرض والـ <code>0</code> ميه، الجزيرة هي أرض متصلة أفقيا ورأسيا. لف على الخانات، وعند أول <code>1</code> زوّد العداد و«غرّق» الجزيرة كلها (حوّلها لـ 0) بـ DFS علشان متتعدش تاني. التغريق هو الـ visited.</p><p><b>Flood Fill</b> (أداة التعبئة في الرسام): غيّر لون خانة وكل الخانات المتصلة بيها من نفس اللون القديم. لازم تفحص إن اللون الجديد مختلف عن القديم، وإلا هتلف للأبد (نفس الغلطة: مفيش visited).</p>",
      codes: [
        {
          lang: "dart",
          title: "numIslands (بتعدّل الـ grid)",
          src: `int numIslands(List<List<int>> g) {
  if (g.isEmpty) return 0;
  final rows = g.length, cols = g[0].length;
  void sink(int r, int c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (g[r][c] != 1) return;
    g[r][c] = 0;                       // mark visited by sinking
    sink(r + 1, c);
    sink(r - 1, c);
    sink(r, c + 1);
    sink(r, c - 1);
  }

  var count = 0;
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (g[r][c] == 1) {
        count++;
        sink(r, c);
      }
    }
  }
  return count;
}

void main() {
  final g = [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
  print(numIslands(g));      // 3
  print(numIslands([]));     // 0
  print(numIslands([[0]]));  // 0
  print(numIslands([[1]]));  // 1
}`,
        },
        {
          lang: "dart",
          title: "floodFill",
          src: `List<List<int>> floodFill(List<List<int>> img, int sr, int sc, int color) {
  final old = img[sr][sc];
  if (old == color) return img;            // otherwise: infinite recursion
  void fill(int r, int c) {
    if (r < 0 || c < 0 || r >= img.length || c >= img[0].length) return;
    if (img[r][c] != old) return;
    img[r][c] = color;
    fill(r + 1, c);
    fill(r - 1, c);
    fill(r, c + 1);
    fill(r, c - 1);
  }
  fill(sr, sc);
  return img;
}

void main() {
  final img = [
    [1, 1, 1],
    [1, 1, 0],
    [1, 0, 1],
  ];
  print(floodFill(img, 1, 1, 2));
  // [[2, 2, 2], [2, 2, 0], [2, 0, 1]]
  print(floodFill([[0, 0], [0, 0]], 0, 0, 0));   // [[0, 0], [0, 0]]
}`,
        },
      ],
      pitfall: "على grid كبيرة (مثلا 1000 × 1000 كلها 1) الـ DFS الـ recursive بيعمل مليون نداء متداخل ويرمي <code>StackOverflowError</code>. استخدم BFS أو stack يدوي. وخد بالك إن numIslands بتخرب الـ grid الأصلية: انسخها لو محتاجها بعد كده.",
      interview: [
        { q: "حل Number of Islands وقول التعقيد.", a: "بلف على كل الخانات، وعند أي <code>1</code> بزوّد العداد وأعمل DFS (أو BFS) يحوّل كل الأرض المتصلة بيها لـ 0 علشان متتعدش تاني. كل خانة بتتزار مرة تقريبا فالزمن O(R × C). المساحة O(R × C) في الأسوأ لعمق الـ recursion، أو O(min(R, C)) لو BFS. لو مينفعش أعدّل الـ grid بستخدم مصفوفة visited.",
        },
      ],
    },
    {
      kicker: "cycle",
      title: "كشف الـ cycle في graph غير موجه",
      en: "Cycle detection in an undirected graph",
      body: "<p>في graph غير موجه، الرابط <code>u - v</code> بيظهر مرتين (من u لـ v ومن v لـ u). فلما DFS يدخل <code>v</code> من <code>u</code> ويلاقي <code>u</code> في جيرانه و<code>u</code> seen، ده <b>مش cycle</b>: ده نفس الرابط اللي جه منه. فبنمرر <code>parent</code> ونتجاهله. لو لاقينا جار <b>seen</b> وهو <b>مش الأب</b>، يبقى وصلنا لنفس العقدة بمسارين مختلفين = <b>cycle</b>.</p><p>بنلف على كل العقد لأن الـ graph ممكن يكون أكتر من مكوّن والـ cycle في أي واحد.</p>",
      code: {
        lang: "dart",
        src: `bool hasCycle(int n, List<List<int>> edges) {
  final adj = List.generate(n, (_) => <int>[]);
  for (final e in edges) {
    adj[e[0]].add(e[1]);
    adj[e[1]].add(e[0]);
  }
  final seen = List<bool>.filled(n, false);

  bool dfs(int u, int parent) {
    seen[u] = true;
    for (final v in adj[u]) {
      if (v == parent) continue;       // the edge we came through
      if (seen[v]) return true;        // reached again by another path
      if (dfs(v, u)) return true;
    }
    return false;
  }

  for (var i = 0; i < n; i++) {
    if (!seen[i] && dfs(i, -1)) return true;
  }
  return false;
}

void main() {
  print(hasCycle(3, [[0, 1], [1, 2], [2, 0]]));        // true
  print(hasCycle(4, [[0, 1], [1, 2], [2, 3]]));        // false
  print(hasCycle(5, [[0, 1], [2, 3], [3, 4], [4, 2]])); // true
  print(hasCycle(1, [[0, 0]]));                        // true (self loop)
  print(hasCycle(0, []));                              // false
}`,
        note: "القاعدة المختصرة: graph غير موجه من V عقدة بدون cycles (غابة) عدد روابطه V - (عدد المكونات) على الأكتر. أي رابط زيادة = cycle.",
      },
      pitfall: "الكود ده بيتجاهل الـ parent بالعقدة، فلو فيه رابطين متوازيين بين نفس العقدتين (multi-edge) هيفوتهم. الحل البسيط: مرر رقم الرابط بدل الأب. وللـ graph <b>الموجه</b> الطريقة مختلفة تماما (مستوى الترتيب الطوبولوجي).",
      interview: [
        { q: "إزاي تكتشف cycle في graph غير موجه؟", a: "DFS مع تمرير الـ parent. لما أكون في العقدة u وألاقي جار seen وهو مش الأب، يبقى فيه cycle. تجاهل الأب ضروري لأن رابط undirected بيظهر في الاتجاهين. بلف على كل العقد علشان أغطي كل المكونات. الزمن O(V + E). بديل: union-find، لو الرابط بيربط عقدتين في نفس المجموعة أصلا يبقى cycle.",
        },
      ],
    },
    {
      kicker: "الشجرة",
      title: "Level order traversal لشجرة",
      en: "Level-order traversal of a tree",
      body: "<p>الشجرة هي graph خاص (من غير cycles وكل عقدة ليها أب واحد)، فمفيش داعي لـ <code>seen</code>. المطلوب هنا: الأرقام مجمعة <b>طبقة طبقة</b>. نفس BFS بس بحيلة صغيرة: في بداية كل لفة نمسك <code>size = q.length</code> (عدد عقد الطبقة الحالية بالظبط) ونشيل <code>size</code> عنصر بس قبل ما نكتب الطبقة. اللي بيتضاف جوه اللف ده هو الطبقة اللي بعدها.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

class TreeNode {
  int val;
  TreeNode? left, right;
  TreeNode(this.val, [this.left, this.right]);
}

List<List<int>> levelOrder(TreeNode? root) {
  final res = <List<int>>[];
  if (root == null) return res;
  final q = Queue<TreeNode>()..add(root);
  while (q.isNotEmpty) {
    final size = q.length;            // nodes in this level
    final level = <int>[];
    for (var i = 0; i < size; i++) {
      final node = q.removeFirst();
      level.add(node.val);
      final l = node.left, r = node.right;
      if (l != null) q.add(l);
      if (r != null) q.add(r);
    }
    res.add(level);
  }
  return res;
}

void main() {
  //     3
  //    / \\
  //   9   20
  //      /  \\
  //     15   7
  final root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)));
  print(levelOrder(root));   // [[3], [9, 20], [15, 7]]
  print(levelOrder(null));   // []
  print(levelOrder(TreeNode(1)));  // [[1]]
}`,
        note: "الزمن O(n) والمساحة O(w) حيث w أعرض طبقة. نفس القالب بيحل: الشجرة من اليمين، متوسط كل طبقة، وأقصر عمق.",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع levelOrder للشجرة فوق",
          src: `queue [3]            size 1 -> level [3]       adds 9, 20
queue [9, 20]        size 2 -> level [9, 20]   adds 15, 7
queue [15, 7]        size 2 -> level [15, 7]   adds nothing
queue []             stop       result [[3], [9, 20], [15, 7]]`,
        },
      ],
    },
    {
      kicker: "الاختيار",
      title: "BFS ولا DFS؟ ونعرف المسألة من وصفها",
      en: "Choosing between BFS and DFS",
      body: "<p>الاتنين O(V + E) زمن وO(V) مساحة. الفرق في <b>النتيجة اللي بتحتاجها</b>:</p>",
      points: [
        "<b>BFS</b>: أقصر مسار / أقل عدد خطوات في graph من غير أوزان، المستويات (level order)، «أقرب» حاجة، multi-source (كل المصادر مع بعض). المساحة O(عرض الـ graph).",
        "<b>DFS</b>: «هل فيه مسار؟»، المكونات والجزر، كشف cycles، الـ backtracking (a5)، الترتيب الطوبولوجي، أي حاجة محتاجة تستكشف فرع للآخر. المساحة O(العمق).",
        "كلمات في المسألة: «<b>أقل عدد</b> خطوات/حركات/تحويلات» ← BFS. «<b>كام</b> مجموعة/جزيرة/مكوّن» أو «هل <b>موجود</b>» ← أي واحد (DFS أقصر في الكود).",
        "الـ state ممكن يكون أي حاجة مش بس عقدة رقمها: (الصف، العمود)، أو (الموضع، عدد الحركات). لو تقدر تكتب «من الحالة دي أروح لإيه»، يبقى ده graph.",
      ],
      codes: [
        {
          lang: "text",
          title: "مقارنة سريعة",
          src: `              BFS                    DFS
structure     queue                  stack / recursion
order         by distance            deep first
shortest      yes (no weights)       no
memory        O(width)               O(depth)
risk          big queue              StackOverflowError`,
        },
      ],
      pitfall: "استخدام DFS لإيجاد «أقصر مسار» بيرجع أي مسار مش الأقصر. ولو الروابط ليها أوزان مختلفة حتى BFS غلط: Dijkstra.",
      interview: [
        { q: "امتى تستخدم BFS وامتى DFS؟", a: "BFS لما محتاج الأقرب: أقصر مسار أو أقل خطوات في graph من غير أوزان، أو معالجة طبقة طبقة. DFS لما يكفيني أعرف إن فيه مسار أو أعد مكونات وجزر أو أكشف cycle أو أعمل backtracking، وكودها أقصر بالـ recursion ومساحتها بتتناسب مع العمق. لو العمق ممكن يوصل آلاف بحول DFS لـ stack يدوي.",
        },
        { q: "إزاي تحل مسألة «أقل عدد خطوات من خانة لخانة» في متاهة؟", a: "أحوّلها لـ graph: كل خانة فاضية عقدة وجيرانها الأربعة روابط. أشغل BFS من خانة البداية بـ <code>dist</code> أو بعدّ الطبقات، وأول ما أوصل للهدف أرجع المسافة. لو ماوصلتش أرجع -1. الزمن والمساحة O(R × C).",
        },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: DFS بالـ recursion",
      lang: "dart",
      code: `void dfs(List<List<int>> adj, int u, List<bool> seen) {
  seen[u] = true;
  for (final v in adj[u]) {
    if (!seen[v]) dfs(adj, v, seen);
  }
}

void main() {
  final adj = [[1, 2], [0], [0]];
  final seen = List<bool>.filled(3, false);
  dfs(adj, 0, seen);
  print(seen);
}`,
      note: "علّم قبل ما تفتح الجيران. الناتج [true, true, true].",
    },
    {
      title: "اكتب: BFS بـ queue",
      lang: "dart",
      code: `import 'dart:collection';

List<int> bfs(List<List<int>> adj, int s) {
  final order = <int>[];
  final seen = List<bool>.filled(adj.length, false);
  final q = Queue<int>()..add(s);
  seen[s] = true;
  while (q.isNotEmpty) {
    final u = q.removeFirst();
    order.add(u);
    for (final v in adj[u]) {
      if (seen[v]) continue;
      seen[v] = true;
      q.add(v);
    }
  }
  return order;
}`,
      note: "علّم seen وقت الإدخال في الـ queue.",
    },
    {
      title: "اكتب: عدد المكونات المتصلة",
      lang: "dart",
      code: `int countComponents(List<List<int>> adj) {
  final seen = List<bool>.filled(adj.length, false);
  void dfs(int u) {
    seen[u] = true;
    for (final v in adj[u]) {
      if (!seen[v]) dfs(v);
    }
  }

  var count = 0;
  for (var i = 0; i < adj.length; i++) {
    if (seen[i]) continue;
    count++;
    dfs(i);
  }
  return count;
}`,
      note: "كل عقدة مش seen في اللف الخارجي = مكوّن جديد.",
    },
  ],

  tasks: [
    {
      title: "أقل عدد خطوات في متاهة",
      lang: "dart",
      prompt: "<p>اكتب <code>int minSteps(List&lt;List&lt;int&gt;&gt; grid)</code>: الـ grid فيها <code>0</code> خانة فاضية و<code>1</code> حيطة. ابدأ من الخانة <code>(0, 0)</code> وروح لآخر خانة (الركن اللي تحت يمين) بالحركة فوق/تحت/يمين/شمال. رجّع أقل عدد خطوات، أو <code>-1</code> لو مستحيل (أو لو البداية أو النهاية حيطة، أو الـ grid فاضية).</p>",
      examples: [
        { in: "minSteps([[0, 0, 0], [1, 1, 0], [0, 0, 0]])", out: "4" },
        { in: "minSteps([[0, 1], [1, 0]])", out: "-1" },
        { in: "minSteps([[0]])", out: "0" },
      ],
      starter: `int minSteps(List<List<int>> grid) {
  // your code
}`,
      hints: [
        "ده أقصر مسار من غير أوزان: BFS. الـ state هو (الصف، العمود).",
        "حط <code>[r, c]</code> في الـ queue، ومصفوفة <code>dist</code> بنفس حجم الـ grid مليانة -1 (يعني لسه مزرناش).",
        "لكل جار جوه الحدود، مش حيطة، ولسه dist بتاعه -1: خليه <code>dist[r][c] + 1</code> وحطه في الـ queue. لما تشيل الهدف رجّع dist بتاعه.",
      ],
      solution: `import 'dart:collection';

int minSteps(List<List<int>> grid) {
  final rows = grid.length;
  if (rows == 0) return -1;
  final cols = grid[0].length;
  if (grid[0][0] == 1 || grid[rows - 1][cols - 1] == 1) return -1;
  final dist = List.generate(rows, (_) => List<int>.filled(cols, -1));
  final q = Queue<List<int>>()..add([0, 0]);
  dist[0][0] = 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.isNotEmpty) {
    final cur = q.removeFirst();
    final r = cur[0], c = cur[1];
    if (r == rows - 1 && c == cols - 1) return dist[r][c];
    for (final d in dirs) {
      final nr = r + d[0], nc = c + d[1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (grid[nr][nc] == 1 || dist[nr][nc] != -1) continue;
      dist[nr][nc] = dist[r][c] + 1;
      q.add([nr, nc]);
    }
  }
  return -1;
}`,
      explain: "الـ <code>dist</code> بتعمل شغلين: المسافة، وعلامة الـ visited (-1 يعني لسه). كل خانة بتدخل الـ queue مرة فالزمن والمساحة O(R × C). حالة الخانة الواحدة <code>[[0]]</code> بترجع 0 لأن البداية هي الهدف.",
    },
    {
      title: "أكبر مساحة جزيرة",
      lang: "dart",
      prompt: "<p>اكتب <code>int maxAreaOfIsland(List&lt;List&lt;int&gt;&gt; grid)</code>: <code>1</code> أرض و<code>0</code> ميه. الجزيرة أرض متصلة أفقيا ورأسيا. رجّع عدد خانات أكبر جزيرة (0 لو مفيش). مسموح تعدّل الـ grid.</p>",
      examples: [
        { in: "maxAreaOfIsland([[1, 1, 0], [0, 1, 0], [0, 0, 1]])", out: "3" },
        { in: "maxAreaOfIsland([[0, 0]])", out: "0" },
        { in: "maxAreaOfIsland([])", out: "0" },
      ],
      starter: `int maxAreaOfIsland(List<List<int>> grid) {
  // your code
}`,
      hints: [
        "نفس numIslands، بس بدل العداد خلي DFS ترجع حجم الجزيرة.",
        "<code>area(r, c)</code>: لو برا الحدود أو مش 1 رجّع 0. غير كده غرّق الخانة وارجع <code>1 + </code> مجموع الأربع اتجاهات.",
        "خد أكبر قيمة رجعت من أي نداء من اللف الخارجي.",
      ],
      solution: `int maxAreaOfIsland(List<List<int>> grid) {
  if (grid.isEmpty) return 0;
  final rows = grid.length, cols = grid[0].length;

  int area(int r, int c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return 0;
    if (grid[r][c] != 1) return 0;
    grid[r][c] = 0;
    return 1 + area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1);
  }

  var best = 0;
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      final a = area(r, c);
      if (a > best) best = a;
    }
  }
  return best;
}`,
      explain: "التغريق بيمنع عد الخانة مرتين وبيمنع اللف للأبد. الزمن O(R × C) لأن كل خانة بتتزار مرة، والمساحة O(R × C) في الأسوأ لعمق الـ recursion. استدعاء <code>area</code> على خانة ماية بيرجع 0 فمفيش داعي لفحص قبله.",
    },
    {
      title: "التفاح الفاسد (multi-source BFS)",
      lang: "dart",
      prompt: "<p>الـ grid فيها <code>0</code> خانة فاضية، <code>1</code> تفاحة سليمة، <code>2</code> تفاحة فاسدة. كل دقيقة، كل تفاحة سليمة مجاورة (فوق/تحت/يمين/شمال) لتفاحة فاسدة بتفسد. اكتب <code>int orangesRotting(List&lt;List&lt;int&gt;&gt; grid)</code> ترجع عدد الدقايق اللازمة لفساد كل التفاح، أو <code>-1</code> لو تفاحة مش هتفسد أبدا. لو مفيش تفاح سليم من الأول ارجع 0.</p>",
      examples: [
        { in: "orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]])", out: "4" },
        { in: "orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]])", out: "-1" },
        { in: "orangesRotting([[0, 2]])", out: "0" },
      ],
      starter: `int orangesRotting(List<List<int>> grid) {
  // your code
}`,
      hints: [
        "كل التفاح الفاسد بيبدأ يفسد في نفس الوقت: حطهم كلهم في الـ queue من الأول (multi-source BFS).",
        "عدّ التفاح السليم من الأول. كل ما واحدة تفسد، قلل العداد.",
        "اشتغل بطبقات (<code>size = q.length</code>): كل طبقة دقيقة. في الآخر لو لسه فيه سليم رجّع -1.",
      ],
      solution: `import 'dart:collection';

int orangesRotting(List<List<int>> grid) {
  final rows = grid.length;
  if (rows == 0) return 0;
  final cols = grid[0].length;
  final g = [for (final row in grid) List<int>.of(row)];
  final q = Queue<List<int>>();
  var fresh = 0;
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (g[r][c] == 2) q.add([r, c]);
      if (g[r][c] == 1) fresh++;
    }
  }
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  var minutes = 0;
  while (q.isNotEmpty && fresh > 0) {
    minutes++;
    for (var i = q.length; i > 0; i--) {
      final cur = q.removeFirst();
      for (final d in dirs) {
        final nr = cur[0] + d[0], nc = cur[1] + d[1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (g[nr][nc] != 1) continue;
        g[nr][nc] = 2;
        fresh--;
        q.add([nr, nc]);
      }
    }
  }
  return fresh == 0 ? minutes : -1;
}`,
      explain: "كل طبقة من الـ BFS هي دقيقة. اللف بيقف لما مفيش سليم، علشان منعدش دقيقة زيادة. بنشتغل على نسخة من الـ grid. الزمن والمساحة O(R × C).",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `import 'dart:collection';

List<int> bfs(List<List<int>> adj, int start) {
  final order = <int>[];
  final seen = List<bool>.filled(adj.length, false);
  final q = Queue<int>()..add(start);
  seen[start] = true;
  while (q.isNotEmpty) {
    final u = q.removeFirst();
    order.add(u);
    for (final v in adj[u]) {
      if (!seen[v]) {
        seen[v] = true;
        q.add(v);
      }
    }
  }
  return order;
}

void main() {
  print(bfs([[2, 1], [3], [3], []], 0));
}` },
      answer: ["[0, 2, 1, 3]", "0, 2, 1, 3", "0 2 1 3"],
      why: "جيران 0 مكتوبين [2, 1] فالـ queue بعد 0 هي [2, 1]. بيطلع 2 ثم 1، والعقدة 3 بتدخل من 2 أول واحد. الترتيب 0 2 1 3. ترتيب الجيران في القايمة هو اللي بيحدد ترتيب الزيارة.",
    },
    {
      q: "ليه BFS بيلاقي أقصر مسار (بعدد الروابط) في graph من غير أوزان؟",
      options: [
        "لأنه بيجرب كل المسارات الممكنة ويختار الأقصر",
        "لأنه بيستخدم stack فبيرجع أسرع",
        "لأن الـ queue بتخلي العقد تتزار بترتيب بعدها عن البداية، فأول وصول لعقدة هو الأقرب",
        "لأنه بيتجاهل العقد اللي زارها قبل كده بس",
      ],
      answer: 2,
      why: "الإجابة الأولى بتوصف brute force ومش ده اللي بيحصل. BFS بيستخدم queue مش stack. وتجاهل المزارة موجود في الاتنين لكنه مش سبب أقصر مسار. السبب هو ترتيب الـ queue حسب المسافة.",
    },
    {
      q: "إيه اللي هيحصل لو شلت <code>seen</code> من DFS على graph فيه cycle؟",
      options: [
        "DFS هيلف في الـ cycle للأبد (stack overflow في الـ recursion)",
        "هيشتغل عادي لكن أبطأ شوية",
        "هيرجع النتيجة صح لكن بترتيب مختلف",
        "هيتجاهل الـ cycle تلقائيا",
      ],
      answer: 0,
      why: "كل عقدة في الـ cycle بتنادي اللي بعدها وهي تنادي اللي قبلها بلا نهاية. مفيش حاجة تلقائية بتوقف ده غير seen.",
    },
    {
      q: "كام connected component في graph فيه 7 عقد (0 لـ 6) والروابط: <code>[0,1] [1,2] [3,4]</code>؟",
      answer: ["4"],
      why: "المكونات: {0,1,2} و{3,4} و{5} و{6}. العقد المعزولة (5 و6) كل واحدة مكوّن لوحدها. يعني 4.",
    },
    {
      q: "كام جزيرة هنا (الأرض = 1، الاتصال أفقي ورأسي بس)؟",
      code: { lang: "dart", src: `// 1 1 0 1
// 0 1 0 0
// 1 0 0 1
final grid = [
  [1, 1, 0, 1],
  [0, 1, 0, 0],
  [1, 0, 0, 1],
];` },
      answer: ["4"],
      why: "جزيرة من (0,0) و(0,1) و(1,1). و(0,3) لوحدها. و(2,0) لوحدها (مفيش اتصال بالقطر). و(2,3) لوحدها. المجموع 4.",
    },
    {
      q: "إيه الغلط في الكود ده اللي المفروض يعمل DFS بـ stack؟",
      code: { lang: "dart", src: `final stack = <int>[start];
while (stack.isNotEmpty) {
  final u = stack.removeAt(0);
  if (seen[u]) continue;
  seen[u] = true;
  for (final v in adj[u]) {
    if (!seen[v]) stack.add(v);
  }
}` },
      options: [
        "فحص seen لازم يتشال",
        "الجيران لازم يتضافوا قبل ما نشيل u",
        "لازم نستخدم Set بدل List",
        "<code>removeAt(0)</code> بتشيل من الأول وتضيف في الآخر، يعني ده queue (BFS)، والـ stack لازم <code>removeLast()</code>",
      ],
      answer: 3,
      why: "الإضافة في الآخر مع الشيل من الأول هي تعريف الـ queue، يعني الكود ده BFS. DFS محتاج الشيل من نفس الجهة اللي بتضيف فيها: <code>removeLast</code>.",
    },
    {
      q: "في cycle detection لـ graph غير موجه بـ DFS، ليه بنتجاهل الجار اللي هو الـ parent؟",
      options: [
        "علشان نسرّع الكود بس",
        "لأن الرابط u - v بيظهر في الاتجاهين، فالـ parent seen دايما وده نفس الرابط اللي جينا منه، مش cycle",
        "لأن الـ parent دايما مزار في BFS مش DFS",
        "علشان ميبقاش فيه recursion",
      ],
      answer: 1,
      why: "لو مفيش تجاهل، كل رابط هيتحسب cycle (u شايف v ومن v شايف u). الـ cycle الحقيقي هو جار seen مش الأب.",
    },
    {
      q: "أي مسألة من دول BFS هو الاختيار الطبيعي ليها؟",
      options: [
        "عد الجزر في خريطة",
        "أقل عدد حركات للوصول من خانة لخانة في لوحة",
        "التأكد إن فيه مسار بين مدينتين",
        "كشف cycle في graph غير موجه",
      ],
      answer: 1,
      why: "«أقل عدد» خطوات في graph من غير أوزان = BFS. الباقي بيتحل بـ DFS أو BFS بنفس الكفاءة، لكن مفيش فيهم ما يلزم BFS تحديدا.",
    },
    {
      q: "زمن BFS على grid أبعادها R × C؟",
      options: [
        "O(R × C)",
        "O(R + C)",
        "O((R × C)^2)",
        "O(R × C × 4^(R × C))",
      ],
      answer: 0,
      why: "كل خانة بتدخل الـ queue مرة، وبنفحص جيرانها الأربعة بس (ثابت). فالمجموع O(R × C). الأسي بيحصل في backtracking لما نلغي seen ونرجع الخانة.",
    },
    {
      q: "تفاحتين فاسدتين في grid، بتفسد كل دقيقة المجاور. إزاي تحسب الدقايق في O(R × C)؟",
      options: [
        "أشغل BFS من كل فاسدة لوحدها وأجمع النتايج",
        "أشغل DFS من أول فاسدة",
        "أحط كل الفاسد في الـ queue من الأول بمسافة 0 (multi-source BFS) وأعد الطبقات",
        "أجرب كل الترتيبات بـ backtracking",
      ],
      answer: 2,
      why: "الفساد بيبدأ من كل المصادر في نفس اللحظة، فالطبقة الأولى من الـ BFS هي كلهم. تشغيل BFS لكل مصدر هيكلف أكتر ومحتاج دمج. DFS مش بيدّي ترتيب الأقرب.",
    },
  ],
};
