window.LEVELS = window.LEVELS || {};
window.LEVELS["algo/a5"] = {
  slides: [
    {
      kicker: "العقد",
      title: "ثلاث قواعد لأي recursion",
      en: "The recursion contract",
      body: "<p>في w9 عرفت الأساس. هنا هنثبته بقاعدة تفكير تقدر تطبقها على أي مسألة، وبعدين نبني عليه الـ backtracking. عقد الدالة الـ recursive:</p>",
      points: [
        "<b>1. Base case</b>: أبسط مدخل بتعرف إجابته من غير نداء ذاتي (قايمة فاضية، n = 0، وصلت لآخر الحروف).",
        "<b>2. مسألة أصغر</b>: كل نداء ذاتي بيتعمل على مدخل أقرب للـ base case (n-1، نص القايمة، index+1).",
        "<b>3. ثق في النداء</b> (leap of faith): افترض إن الدالة بتشتغل صح على المدخل الأصغر، وركز بس على إزاي تبني إجابة المدخل الحالي منها. متحاولش تتبع كل النداءات في دماغك.",
      ],
      code: {
        lang: "dart",
        title: "تتبع فعلي بالطباعة: fact(3)",
        src: `int depth = 0;

int fact(int n) {
  print('\${'  ' * depth}fact(\$n)');
  if (n <= 1) {
    print('\${'  ' * depth}-> 1');
    return 1;
  }
  depth++;
  final r = n * fact(n - 1);
  depth--;
  print('\${'  ' * depth}-> \$r');
  return r;
}

void main() {
  print(fact(3));
}`,
        note: "الناتج (الإزاحة بتبين مستوى النداء):",
      },
      codes: [
        {
          lang: "text",
          title: "الناتج الفعلي",
          src: `fact(3)
  fact(2)
    fact(1)
    -> 1
  -> 2
-> 6
6`,
        },
      ],
      focus: [{ label: "احفظها", text: "قبل ما تكتب: (1) إيه الـ base case؟ (2) إيه المدخل الأصغر؟ (3) لو افترضت إن النداء الأصغر صح، إزاي أبني منه الإجابة؟" }],
    },
    {
      kicker: "الـ stack",
      title: "الـ call stack والترتيب قبل وبعد النداء",
      en: "The call stack traced",
      body: "<p>كل نداء بيحط frame على الـ stack، والنداء اللي فوق هو اللي بيشتغل. أي كود <b>قبل</b> النداء الذاتي بيتنفذ وإحنا نازلين، وأي كود <b>بعده</b> بيتنفذ وإحنا طالعين بالعكس. فهم ده هو مفتاح الـ backtracking (الـ un-choose بيحصل بعد النداء).</p>",
      code: {
        lang: "dart",
        src: `String f(int n) {
  if (n == 0) return '';
  return '\$n' + f(n - 1) + '\$n';
}

void main() {
  print(f(3));   // 321123
  print(f(1));   // 11
  print(f(0));   // (empty line)
}`,
        note: "الرقم الأول بيتكتب وإحنا نازلين (3 ثم 2 ثم 1)، والتاني وإحنا طالعين (1 ثم 2 ثم 3).",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع f(3)",
          src: `f(3): '3' + f(2)  + '3'
f(2): '2' + f(1)  + '2'
f(1): '1' + f(0)  + '1'      f(0) = ''
f(1) = '11'
f(2) = '2' + '11' + '2' = '2112'
f(3) = '3' + '2112' + '3' = '321123'`,
        },
      ],
      pitfall: "نسيان الـ base case أو نداء بنفس المدخل (<code>f(n)</code> بدل <code>f(n - 1)</code>) بيرمي <code>StackOverflowError</code>. وكل نداء بياخد مساحة: عمق n يعني مساحة O(n).",
      interview: [
        { q: "إيه اللي لازم يتوفر في دالة recursive علشان تشتغل صح؟", a: "base case بيرجع إجابة من غير نداء ذاتي، وكل نداء ذاتي لازم يكون على مدخل أصغر أو أقرب للـ base case علشان نضمن إننا نوصله، وإن نبني إجابة المدخل الحالي من إجابة المدخل الأصغر (نثق إن النداء الأصغر صح). من غير الأول الدالة بتنادي نفسها للأبد (StackOverflowError).",
        },
      ],
    },
    {
      kicker: "قسّم وحل",
      title: "Divide and conquer",
      en: "Divide and conquer",
      body: "<p>بدل ما تقلل المسألة بواحد، قسمها نصين (أو أكتر)، حل كل نصف بنفس الدالة، وادمج. ده بيدّيك عمق <code>log n</code> بدل <code>n</code>. أمثلة: merge sort، binary search، quick sort، والأس السريع. هنا مثال بسيط: أكبر عنصر في قايمة بالتقسيم.</p>",
      code: {
        lang: "dart",
        src: `int maxDC(List<int> a, int lo, int hi) {
  if (lo == hi) return a[lo];                 // one element
  final mid = lo + (hi - lo) ~/ 2;
  final l = maxDC(a, lo, mid);
  final r = maxDC(a, mid + 1, hi);
  return l > r ? l : r;                       // combine
}

void main() {
  print(maxDC([3, 9, 2, 7], 0, 3));   // 9
  print(maxDC([5], 0, 0));            // 5
}`,
        note: "الزمن O(n) (T(n) = 2T(n/2) + 1 كما في a1) والمساحة O(log n). مش أحسن من لوب بسيط لكن الهيكل هو نفسه merge sort.",
      },
      codes: [
        {
          lang: "text",
          title: "شجرة maxDC على [3, 9, 2, 7]",
          src: `            [3, 9, 2, 7] -> 9
           /                \\
     [3, 9] -> 9        [2, 7] -> 7
      /     \\            /     \\
  [3] -> 3  [9] -> 9  [2] -> 2  [7] -> 7`,
        },
      ],
      interview: [
        { q: "إيه الفرق بين divide and conquer والـ backtracking؟", a: "divide and conquer بتقسم المسألة لمسائل فرعية مستقلة وتدمج إجاباتها (merge sort)، وكل جزء بيتحل مرة. backtracking بتستكشف كل القرارات الممكنة خطوة خطوة وتتراجع لما قرار يطلع غلط، وبتدور على كل الحلول أو واحد منها. الأولى غالبا بتديك O(n log n)، التانية غالبا أسية.",
        },
      ],
    },
    {
      kicker: "القالب",
      title: "Backtracking: choose, explore, un-choose",
      en: "The backtracking template",
      body: "<p>الـ backtracking هو DFS على «شجرة قرارات». في كل خطوة عندك اختيارات. بتجرب اختيار، بتكمل بعده، وبترجع لورا وتجرب التاني. القالب:</p>",
      codes: [
        {
          lang: "text",
          title: "الهيكل العام (pseudo)",
          src: `void explore(state):
  if state is a complete answer:
    save a COPY of it
    return
  for each choice available now:
    if choice is not allowed: continue      // pruning
    choose(choice)         // add to the current path
    explore(next state)    // go deeper
    unchoose(choice)       // undo it: the path is back to what it was`,
        },
      ],
      points: [
        "<b>choose</b> بيعدل الحالة الحالية (<code>cur.add(x)</code>، <code>used[i] = true</code>).",
        "<b>un-choose</b> بيرجّعها بالظبط. لازم بعد النداء الذاتي مباشرة، علشان الاختيار التاني يبدأ من نفس الحالة.",
        "لما بتحفظ حل: احفظ <b>نسخة</b> (<code>List.of(cur)</code>) مش المرجع نفسه، لأن <code>cur</code> هيتغير بعد كده.",
        "الـ pruning: لو الحالة الحالية مفيش أمل تكمل لحل صحيح، متدخلش (<code>continue</code> أو <code>break</code>) قبل ما تنزل.",
      ],
      pitfall: "نسيان النسخة هو أشهر bug: لو عملت <code>res.add(cur)</code> فكل عناصر <code>res</code> بتشاور على نفس القايمة، وفي الآخر كلها فاضية (لأن الـ un-choose فضّاها). الحل <code>res.add(List&lt;int&gt;.of(cur))</code>.",
      interview: [
        { q: "اشرح قالب الـ backtracking.", a: "هو DFS على شجرة القرارات: في كل خطوة أجرب اختيار (choose)، وأنادي نفسي على الحالة اللي بعده (explore)، وبعدين أرجّع الحالة زي ما كانت (un-choose) علشان أجرب الاختيار التاني. لما أوصل لحل كامل أحفظ نسخة منه. وبضيف pruning: لو الاختيار مش ممكن يوصل لحل أتخطاه قبل ما أنزل، وده بيقلل الشغل جدا.",
        },
      ],
    },
    {
      kicker: "المجموعات الفرعية",
      title: "Subsets: كل المجموعات الجزئية",
      en: "Generating subsets",
      body: "<p>قايمة أرقام مختلفة، هات كل المجموعات الفرعية (<code>2^n</code> منها). الحل: كل حالة (<code>cur</code>) هي مجموعة صالحة، فنسجلها فورا. وبعدين نجرب نضيف كل عنصر من <code>start</code> للآخر، وننادي بـ <code>i + 1</code> (علشان مفيش عنصر يتكرر ومفيش نفس المجموعة بترتيب تاني).</p>",
      code: {
        lang: "dart",
        src: `List<List<int>> subsets(List<int> nums) {
  final res = <List<int>>[];
  final cur = <int>[];
  void go(int start) {
    res.add(List<int>.of(cur));         // every path is an answer
    for (var i = start; i < nums.length; i++) {
      cur.add(nums[i]);                 // choose
      go(i + 1);                        // explore
      cur.removeLast();                 // un-choose
    }
  }
  go(0);
  return res;
}

void main() {
  print(subsets([1, 2, 3]));
  // [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]
  print(subsets([]));          // [[]]
}`,
        note: "القايمة الفاضية ليها مجموعة فرعية واحدة: المجموعة الفاضية.",
      },
      codes: [
        {
          lang: "text",
          title: "شجرة subsets([1, 2, 3])",
          src: `[]
 +-- [1]
 |    +-- [1, 2]
 |    |    +-- [1, 2, 3]
 |    +-- [1, 3]
 +-- [2]
 |    +-- [2, 3]
 +-- [3]
(each node is saved when first reached: 8 nodes = 2^3)`,
        },
      ],
      interview: [
        { q: "اكتب كل المجموعات الفرعية لقايمة. وإيه التعقيد؟", a: "backtracking: كل مسار هو مجموعة صالحة فأحفظ نسخة منه، وبعدين لكل عنصر من start أضيفه وأنادي بـ i+1 وأشيله. عدد المجموعات 2^n وكل نسخة O(n) فالزمن O(n × 2^n). والمساحة الإضافية غير الناتج O(n) للـ stack والمسار. التعقيد الأسي طبيعي لأن الناتج نفسه أسي.",
        },
      ],
    },
    {
      kicker: "الترتيبات",
      title: "Permutations و Combinations",
      en: "Permutations and combinations",
      body: "<p><b>Permutations</b>: كل ترتيبات القايمة (n! منها). في كل مستوى بنجرب أي عنصر لسه مستخدمش (مصفوفة <code>used</code>)، والحل لما المسار يوصل طول القايمة. <b>Combinations</b> (n اختر k): نفس فكرة subsets بس بنسجل لما الطول يساوي k فقط، ومفيش ترتيب (بنمشي لقدام بـ <code>i + 1</code>).</p>",
      codes: [
        {
          lang: "dart",
          title: "permutations",
          src: `List<List<int>> permutations(List<int> nums) {
  final res = <List<int>>[];
  final cur = <int>[];
  final used = List<bool>.filled(nums.length, false);
  void go() {
    if (cur.length == nums.length) {
      res.add(List<int>.of(cur));
      return;
    }
    for (var i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      cur.add(nums[i]);
      go();
      cur.removeLast();
      used[i] = false;
    }
  }
  go();
  return res;
}
// permutations([1, 2, 3]) =>
// [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
// permutations([]) => [[]]   permutations([1]).length => 1`,
        },
        {
          lang: "dart",
          title: "combinations: n choose k",
          src: `List<List<int>> combine(int n, int k) {
  final res = <List<int>>[];
  final cur = <int>[];
  void go(int start) {
    if (cur.length == k) {
      res.add(List<int>.of(cur));
      return;
    }
    for (var i = start; i <= n; i++) {
      cur.add(i);
      go(i + 1);
      cur.removeLast();
    }
  }
  go(1);
  return res;
}
// combine(4, 2) =>
// [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
// combine(3, 3) => [[1,2,3]]    combine(3, 0) => [[]]`,
        },
      ],
      pitfall: "القايمة لو فيها تكرارات (مثلا [1, 1, 2]) الكود ده بيطلع ترتيبات مكررة. الحل: رتب القايمة، وفي كل مستوى تخطى العنصر لو بيساوي اللي قبله ولسه اللي قبله مستخدمش.",
      interview: [
        { q: "إيه الفرق بين permutation وcombination، وإزاي الكود بيختلف؟", a: "permutation الترتيب فيها بيفرق ([1,2] غير [2,1]) فبنبدأ كل مستوى من الأول ونتخطى المستخدم بـ used، وعددها n!. combination الترتيب مبيفرقش فبنمشي لقدام بـ i+1 وبنسجل لما الطول يبقى k، وعددها n!/(k!(n-k)!). الاتنين بيستخدموا نفس قالب choose/explore/un-choose.",
        },
      ],
    },
    {
      kicker: "التقليم",
      title: "Combination Sum والـ pruning",
      en: "Combination sum and pruning",
      body: "<p>أرقام مختلفة وهدف: هات كل التركيبات اللي مجموعها الهدف، وتقدر تستخدم نفس الرقم أكتر من مرة. الفرق عن combine: ننادي بـ <code>i</code> (مش <code>i + 1</code>) علشان نسمح بالتكرار. الـ pruning: رتّب القايمة الأول، ولما <code>c[i] &gt; remain</code> اعمل <code>break</code> لأن اللي بعده أكبر منه كمان.</p>",
      code: {
        lang: "dart",
        src: `List<List<int>> combinationSum(List<int> cands, int target) {
  final c = List<int>.of(cands)..sort();
  final res = <List<int>>[];
  final cur = <int>[];
  void go(int start, int remain) {
    if (remain == 0) {
      res.add(List<int>.of(cur));
      return;
    }
    for (var i = start; i < c.length; i++) {
      if (c[i] > remain) break;       // prune: sorted, so the rest too
      cur.add(c[i]);
      go(i, remain - c[i]);           // i, not i + 1: reuse allowed
      cur.removeLast();
    }
  }
  go(0, target);
  return res;
}

void main() {
  print(combinationSum([2, 3, 6, 7], 7));   // [[2, 2, 3], [7]]
  print(combinationSum([2, 3, 5], 8));      // [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
  print(combinationSum([2], 1));            // []
}`,
        note: "الـ break بيعمل فرق: على [2, 3, 6, 7] والهدف 7 اتعملت 10 نداءات go بالـ pruning، و28 نداء لو سبنا النداء يدخل ويفشل (remain &lt; 0) من غير تقليم.",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع الحل لـ [2, 3, 6, 7] والهدف 7",
          src: `[]            remain 7
[2]           remain 5
[2,2]         remain 3
[2,2,2]       remain 1: next candidate 2 > 1 -> break, dead end
[2,2,3]       remain 0 -> save [2,2,3]   (then 6 > 3 -> break)
[2,3]         remain 2: 3 > 2 -> break, dead end
[3]           remain 4: [3,3] remain 1 dead end, then 6 > 4 -> break
[6]           remain 1: dead end
[7]           remain 0 -> save [7]`,
        },
      ],
      interview: [
        { q: "إيه هو الـ pruning وإزاي استخدمته في Combination Sum؟", a: "هو إنك توقف فرع من شجرة البحث بدري لما تتأكد إنه مش هيوصل لحل. في Combination Sum برتب الأرقام، ولما أول رقم أكبر من الباقي (remain) كل اللي بعده أكبر منه برضه فبعمل break وأوفر كل الفروع دي. ده مش بيغير التعقيد في الأسوأ لكن بيقلل الشغل الفعلي كتير.",
        },
      ],
    },
    {
      kicker: "أمثلة كلاسيكية",
      title: "N-Queens: قيد على كل خطوة",
      en: "N-Queens",
      body: "<p>حط n ملكة على لوحة n×n بحيث ولا ملكتين يهاجموا بعض (نفس العمود أو القطر). نحط ملكة واحدة في كل صف: الصف <code>row</code> بنجرب فيه كل عمود <code>c</code>. بدل ما نفحص اللوحة كلها بنحتفظ بـ 3 Sets: الأعمدة المستخدمة، والأقطار من النوع <code>row - c</code>، والأقطار الثانية <code>row + c</code> (كل قطر له رقم ثابت). الفحص O(1).</p>",
      code: {
        lang: "dart",
        src: `int totalNQueens(int n) {
  final cols = <int>{}, d1 = <int>{}, d2 = <int>{};
  var count = 0;
  void go(int row) {
    if (row == n) {
      count++;
      return;
    }
    for (var c = 0; c < n; c++) {
      if (cols.contains(c) || d1.contains(row - c) || d2.contains(row + c)) {
        continue;                     // attacked: skip (pruning)
      }
      cols.add(c);
      d1.add(row - c);
      d2.add(row + c);
      go(row + 1);
      cols.remove(c);
      d1.remove(row - c);
      d2.remove(row + c);
    }
  }
  go(0);
  return count;
}

void main() {
  print(totalNQueens(1));   // 1
  print(totalNQueens(2));   // 0
  print(totalNQueens(3));   // 0
  print(totalNQueens(4));   // 2
  print(totalNQueens(6));   // 4
  print(totalNQueens(8));   // 92
}`,
        note: "لـ n=4 الحل الأول: الأعمدة لكل صف [1, 3, 0, 2].",
      },
      codes: [
        {
          lang: "text",
          title: "حل n = 4 (Q هي الملكة)",
          src: `. Q . .      row 0 -> col 1
. . . Q      row 1 -> col 3
Q . . .      row 2 -> col 0
. . Q .      row 3 -> col 2`,
          note: "المحاولة بملكة في (0, 0) بتفشل: صف 1 بيقبل عمود 2 أو 3، وفي الحالتين مفيش مكان للصف 2 أو 3 فبنرجع (backtrack).",
        },
      ],
      interview: [
        { q: "إزاي تفحص إن ملكتين على نفس القطر في O(1)؟", a: "كل قطر من النوع «\\» فيه كل الخانات اللي <code>row - col</code> فيها ثابت، وكل قطر «/» فيه الخانات اللي <code>row + col</code> فيها ثابت. فبحتفظ بـ Set لكل نوع، وفحص الملكة الجديدة هو 3 عمليات contains. ده مع إني بحط ملكة واحدة في كل صف، فمفيش داعي لفحص الصف.",
        },
      ],
    },
    {
      kicker: "على شبكة",
      title: "Word Search في grid",
      en: "Word search in a grid",
      body: "<p>لوحة حروف وكلمة: هل الكلمة موجودة بمسار من حروف متجاورة (فوق/تحت/يمين/شمال) من غير استخدام نفس الخانة مرتين؟ ابدأ من كل خانة، وفي كل خطوة طابق الحرف رقم <code>i</code>. علّم الخانة كمستخدمة (استبدل حرفها بـ <code>#</code>)، جرب الأربع اتجاهات، وبعدين رجّع الحرف (un-choose).</p>",
      code: {
        lang: "dart",
        src: `bool exist(List<List<String>> board, String word) {
  final rows = board.length;
  if (rows == 0) return false;
  final cols = board[0].length;

  bool dfs(int r, int c, int i) {
    if (i == word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (board[r][c] != word[i]) return false;
    final saved = board[r][c];
    board[r][c] = '#';                          // choose: mark visited
    final found = dfs(r + 1, c, i + 1) ||
        dfs(r - 1, c, i + 1) ||
        dfs(r, c + 1, i + 1) ||
        dfs(r, c - 1, i + 1);
    board[r][c] = saved;                        // un-choose
    return found;
  }

  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}

// board: ABCE / SFCS / ADEE
// exist(board, 'ABCCED') => true
// exist(board, 'SEE')    => true
// exist(board, 'ABCB')   => false  (B would be reused)
// exist([], 'A') => false     exist([['A']], 'A') => true`,
        note: "نتائج الأمثلة اتجربت. الـ <code>||</code> بتوقف عند أول اتجاه ينجح (short-circuit).",
      },
      pitfall: "نسيان استرجاع الحرف بعد النداء (<code>board[r][c] = saved</code>) بيبوظ المحاولات اللي بعدها: خانات هتفضل علامتها # وكلمات هتتفقد.",
      interview: [
        { q: "إزاي بتحل Word Search؟ وإيه التعقيد؟", a: "backtracking على الـ grid: من كل خانة أبدأ DFS بالـ index 0. لو الحرف مطابق أعلّم الخانة (أبدلها بـ #)، وأجرب الأربع اتجاهات بـ index+1، وأرجّع الحرف. لو index وصل لطول الكلمة فيه حل. الزمن O(R × C × 4^L) في الأسوأ (L طول الكلمة)، لكن عمليا أقل بكتير لأن المطابقة بتقص الفروع.",
        },
      ],
    },
    {
      kicker: "التكلفة",
      title: "التكلفة الأسية وامتى نوقف ونفكر في DP",
      en: "Exponential cost and when to switch to DP",
      body: "<p>الـ backtracking بيدور على <b>كل</b> الحلول فتكلفته غالبا أسية: subsets هي 2^n، permutations هي n!، N-Queens حوالي n! قبل الـ pruning. مع n حوالي 20 (للـ subsets) أو 10 (للـ permutations) خلاص هتوصل لحدود الوقت. الـ pruning بيحسن الفعلي مش الأسوأ.</p><p><b>امتى توقف وتدور على DP؟</b> لو المسألة بتسأل عن <i>عدد</i> أو <i>أفضل قيمة</i> (مش بتطلب تطبع كل الحلول)، ولو نفس الحالة الفرعية بتتكرر في أكتر من فرع. وقتها memoization أو DP بيحول الأسي لـ polynomial.</p>",
      codes: [
        {
          lang: "text",
          title: "الأرقام الفعلية",
          src: `subsets of 10 items             1,024 results (2^10)
permutations of 8 items         40,320 results (8!)
fib(20) naive recursion         21,891 calls
fib(20) with memo (a1/w9)       about 39 calls`,
        },
      ],
      points: [
        "لازم تطبع/ترجع <b>كل</b> الحلول (كل المجموعات، كل الترتيبات، كل الأماكن): backtracking هو الأداة، والتكلفة أسية بطبيعة الناتج.",
        "بتسأل <b>كام حل</b> أو <b>أفضل</b> حل، والحالات الفرعية بتتكرر (زي fib أو Coin Change): memoization / DP.",
        "بتسأل عن حل <b>واحد</b> بس: وقف عند أول حل (رجّع true واقطع باقي الفروع).",
        "عمق الـ recursion كبير جدا (آلاف): حوّل لـ loop أو stack يدوي.",
      ],
      pitfall: "backtracking على مسألة «عدد الطرق» من غير memoization بيعمل نفس الحسبة مليون مرة. اسأل نفسك: لو الحالة (index، المتبقي) اتكررت، هل نتيجتها واحدة؟ لو أيوه، خزّنها.",
      interview: [
        { q: "امتى تستخدم backtracking وامتى DP؟", a: "backtracking لما محتاج أطلّع كل الحلول (أو أدور على حل واحد مع قيود)، والتكلفة أسية بطبيعتها. DP لما بسأل عن عدد الحلول أو أحسن قيمة، وفيه حالات فرعية بتتكرر (overlapping subproblems)، فبخزن نتيجة كل حالة مرة. مثلا: «اطبع كل تركيبات العملات» backtracking، و«أقل عدد عملات» DP.",
        },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: أكبر عنصر بالتقسيم",
      lang: "dart",
      code: `int maxDC(List<int> a, int lo, int hi) {
  if (lo == hi) return a[lo];
  final mid = lo + (hi - lo) ~/ 2;
  final l = maxDC(a, lo, mid);
  final r = maxDC(a, mid + 1, hi);
  return l > r ? l : r;
}

void main() {
  print(maxDC([3, 9, 2, 7], 0, 3));
}`,
      note: "الناتج 9.",
    },
    {
      title: "اكتب: combinations",
      lang: "dart",
      code: `List<List<int>> combine(int n, int k) {
  final res = <List<int>>[];
  final cur = <int>[];
  void go(int start) {
    if (cur.length == k) {
      res.add(List<int>.of(cur));
      return;
    }
    for (var i = start; i <= n; i++) {
      cur.add(i);
      go(i + 1);
      cur.removeLast();
    }
  }
  go(1);
  return res;
}`,
      note: "choose ثم explore ثم un-choose.",
    },
    {
      title: "اكتب: subsets",
      lang: "dart",
      code: `List<List<int>> subsets(List<int> nums) {
  final res = <List<int>>[];
  final cur = <int>[];
  void go(int start) {
    res.add(List<int>.of(cur));
    for (var i = start; i < nums.length; i++) {
      cur.add(nums[i]);
      go(i + 1);
      cur.removeLast();
    }
  }
  go(0);
  return res;
}`,
      note: "لاحظ <code>List&lt;int&gt;.of(cur)</code> لحفظ نسخة.",
    },
  ],

  tasks: [
    {
      title: "كل الترتيبات",
      lang: "dart",
      prompt: "<p>اكتب <code>List&lt;List&lt;int&gt;&gt; permutations(List&lt;int&gt; nums)</code> ترجع كل ترتيبات قايمة أرقام مختلفة (بالترتيب المعجمي لو القايمة مرتبة). القايمة الفاضية ترجع <code>[[]]</code>.</p>",
      examples: [
        { in: "permutations([1, 2, 3])", out: "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]" },
        { in: "permutations([1])", out: "[[1]]" },
        { in: "permutations([])", out: "[[]]" },
      ],
      starter: `List<List<int>> permutations(List<int> nums) {
  // your code
}`,
      hints: [
        "مصفوفة <code>used</code> بحجم القايمة، ومسار <code>cur</code>.",
        "الحل لما <code>cur.length == nums.length</code>: احفظ نسخة.",
        "جوه اللوب: تخطى المستخدم، علّم، أضف، نادي، شيل، فك العلامة.",
      ],
      solution: `List<List<int>> permutations(List<int> nums) {
  final res = <List<int>>[];
  final cur = <int>[];
  final used = List<bool>.filled(nums.length, false);

  void go() {
    if (cur.length == nums.length) {
      res.add(List<int>.of(cur));
      return;
    }
    for (var i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      cur.add(nums[i]);
      go();
      cur.removeLast();
      used[i] = false;
    }
  }

  go();
  return res;
}`,
      explain: "عدد النتايج n! وكل نسخة O(n) فالزمن O(n × n!). في الفاضية الشرط <code>0 == 0</code> يتحقق فورا فبنسجل [] مرة واحدة. فك <code>used[i]</code> هو الـ un-choose التاني، ومن غيره الفروع التانية هتشوف عناصر مستخدمة غلط.",
    },
    {
      title: "Combination Sum",
      lang: "dart",
      prompt: "<p>اكتب <code>List&lt;List&lt;int&gt;&gt; combinationSum(List&lt;int&gt; cands, int target)</code> (أرقام موجبة مختلفة) ترجع كل التركيبات اللي مجموعها <code>target</code>، ويجوز استخدام نفس الرقم أكتر من مرة. استخدم pruning بعد ترتيب القايمة.</p>",
      examples: [
        { in: "combinationSum([2, 3, 6, 7], 7)", out: "[[2, 2, 3], [7]]" },
        { in: "combinationSum([2, 3, 5], 8)", out: "[[2, 2, 2, 2], [2, 3, 3], [3, 5]]" },
        { in: "combinationSum([2], 1)", out: "[]" },
      ],
      starter: `List<List<int>> combinationSum(List<int> cands, int target) {
  // your code
}`,
      hints: [
        "رتب نسخة من القايمة الأول.",
        "<code>go(start, remain)</code>: لو remain صفر احفظ نسخة. غير كده لف من start، وbreak لو العنصر أكبر من remain.",
        "النداء الذاتي بـ <code>i</code> مش <code>i + 1</code> علشان التكرار مسموح.",
      ],
      solution: `List<List<int>> combinationSum(List<int> cands, int target) {
  final c = List<int>.of(cands)..sort();
  final res = <List<int>>[];
  final cur = <int>[];

  void go(int start, int remain) {
    if (remain == 0) {
      res.add(List<int>.of(cur));
      return;
    }
    for (var i = start; i < c.length; i++) {
      if (c[i] > remain) break;
      cur.add(c[i]);
      go(i, remain - c[i]);
      cur.removeLast();
    }
  }

  go(0, target);
  return res;
}`,
      explain: "البداية من <code>start</code> بتمنع التركيبات المكررة بترتيب مختلف ([2,3] و [3,2]). الـ break صح بس بعد الترتيب. الزمن أسي، والعمق الأقصى target ÷ أصغر رقم.",
    },
    {
      title: "N-Queens: عدد الحلول",
      lang: "dart",
      prompt: "<p>اكتب <code>int totalNQueens(int n)</code> ترجع عدد طرق وضع n ملكة على لوحة n×n بحيث مفيش اتنين يهاجموا بعض.</p>",
      examples: [
        { in: "totalNQueens(1)", out: "1" },
        { in: "totalNQueens(4)", out: "2" },
        { in: "totalNQueens(6)", out: "4" },
        { in: "totalNQueens(8)", out: "92" },
      ],
      starter: `int totalNQueens(int n) {
  // your code
}`,
      hints: [
        "ملكة واحدة في كل صف. <code>go(row)</code> بتجرب كل الأعمدة.",
        "ثلاث Sets: الأعمدة، والأقطار <code>row - c</code>، والأقطار <code>row + c</code>.",
        "لما <code>row == n</code> زوّد العداد. وفك الثلاث Sets بعد النداء.",
      ],
      solution: `int totalNQueens(int n) {
  final cols = <int>{}, d1 = <int>{}, d2 = <int>{};
  var count = 0;

  void go(int row) {
    if (row == n) {
      count++;
      return;
    }
    for (var c = 0; c < n; c++) {
      if (cols.contains(c) || d1.contains(row - c) || d2.contains(row + c)) {
        continue;
      }
      cols.add(c);
      d1.add(row - c);
      d2.add(row + c);
      go(row + 1);
      cols.remove(c);
      d1.remove(row - c);
      d2.remove(row + c);
    }
  }

  go(0);
  return count;
}`,
      explain: "الفحص O(1) بفضل الـ Sets. الزمن أسي (أقل بكتير من n^n بفضل الـ pruning). المساحة O(n). لـ n = 2 و 3 مفيش حل فبترجع 0.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `String f(int n) {
  if (n == 0) return '';
  return '\$n' + f(n - 1) + '\$n';
}

void main() {
  print(f(3));
}` },
      answer: ["321123"],
      why: "الرقم الأول بيتكتب وإحنا نازلين: 3 ثم 2 ثم 1. وبعدين f(0) فاضية، والرقم التاني بيتكتب وإحنا طالعين: 1 ثم 2 ثم 3. يبقى 3 2 1 1 2 3.",
    },
    {
      q: "إيه اللي هيحصل؟",
      code: { lang: "dart", src: `int total(int n) {
  return n + total(n - 1);
}

void main() {
  print(total(3));
}` },
      options: [
        "بيرجع 6",
        "بيرمي <code>StackOverflowError</code> لأن مفيش base case",
        "بيرجع 0",
        "بيرمي <code>RangeError</code>",
      ],
      answer: 1,
      why: "من غير <code>if (n == 0) return 0;</code> النداء بيكمل لأرقام سالبة للأبد لحد ما الـ stack يتملي.",
    },
    {
      q: "كام مجموعة فرعية (بما فيها الفاضية) لقايمة فيها 3 عناصر مختلفة؟",
      answer: ["8"],
      why: "كل عنصر إما يتحط أو لأ: 2 × 2 × 2 = 8. بشكل عام 2^n.",
    },
    {
      q: "في قالب الـ backtracking، ليه بنعمل <code>cur.removeLast()</code> بعد النداء الذاتي؟",
      options: [
        "علشان نوفر ذاكرة بس",
        "علشان نمنع StackOverflow",
        "لأن Dart بتطلب كده",
        "علشان نرجّع الحالة زي ما كانت قبل الاختيار، فالاختيار اللي بعده يبدأ من نفس النقطة",
      ],
      answer: 3,
      why: "من غير الـ un-choose، كل اختيار بعده هيلاقي العناصر القديمة لسه في المسار فالنتايج هتكون غلط. ده قلب الـ backtracking.",
    },
    {
      q: "كام ترتيب (permutation) لـ 4 عناصر مختلفة؟",
      answer: ["24"],
      why: "4! = 4 × 3 × 2 × 1 = 24.",
    },
    {
      q: "في Combination Sum بعد ترتيب الأرقام، ليه <code>break</code> مش <code>continue</code> لما <code>c[i] &gt; remain</code>؟",
      options: [
        "لأن كل الأرقام اللي بعده أكبر منه كمان، فمفيش فايدة نفحصها",
        "لأن break أسرع من continue في Dart",
        "لأن continue هتعمل خطأ",
        "لأن الأرقام مرتبة تنازليا",
      ],
      answer: 0,
      why: "بعد الترتيب التصاعدي أي رقم بعد الحالي أكبر منه، فلو الحالي أكبر من الباقي فكلهم كده. continue كانت هتدّي نفس النتيجة بس هتفحص بلا داعي.",
    },
    {
      q: "كام حل لـ 6-Queens؟",
      answer: ["4"],
      why: "عدد الحلول: n=4 اتنين، n=5 عشرة، n=6 أربعة، n=8 اتنين وتسعين. ملاحظة إن العدد مش بيزيد بانتظام.",
    },
    {
      q: "في Word Search، ليه بنرجّع الحرف الأصلي (<code>board[r][c] = saved</code>) بعد النداءات؟",
      options: [
        "علشان نطبع اللوحة في الآخر",
        "علشان نوفر ذاكرة",
        "علشان المحاولات التانية (من بدايات أو اتجاهات تانية) تشوف الخانة سليمة وتقدر تستخدمها",
        "علشان نمنع الدخول في نفس الخانة مرتين في نفس المسار",
      ],
      answer: 2,
      why: "العلامة # هي اللي بتمنع إعادة استخدام الخانة في نفس المسار (الخيار الرابع ده شغل العلامة نفسها مش الاسترجاع). الاسترجاع هو الـ un-choose علشان باقي المسارات تشوفها.",
    },
    {
      q: "نداء <code>fib(20)</code> بالـ recursion العادي بيعمل 21891 نداء. إيه الحل لو السؤال طلب بس قيمة fib(n) (مش كل الحلول)؟",
      options: [
        "backtracking مع pruning",
        "memoization أو DP: الحالات الفرعية بتتكرر",
        "ترتيب المدخلات الأول",
        "binary search",
      ],
      answer: 1,
      why: "نفس القيم الفرعية (زي fib(10)) بتتحسب آلاف المرات. تخزينها بيحول التعقيد الأسي لخطي. backtracking بيفيد لما محتاج كل الحلول.",
    },
    {
      q: "تعقيد توليد كل ترتيبات n عنصر وحفظها؟",
      options: [
        "O(n²)",
        "O(2ⁿ)",
        "O(n × n!)",
        "O(n log n)",
      ],
      answer: 2,
      why: "عدد الترتيبات n!، وكل ترتيب نسخة بطول n. فالزمن O(n × n!)، وده أكبر من الأسي العادي بكتير.",
    },
  ],
};
