window.LEVELS = window.LEVELS || {};
window.LEVELS["core/c5"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "أغلب مسائل الإنترفيو بتتحل بحوالي 10 أنماط",
      en: "Algorithm patterns",
      body: "<p>مسائل الـ coding في الإنترفيو (للـ junior و mid) نادرا ما تكون جديدة تماما. هي غالبا نمط معروف في لبس جديد. لو اتعلمت تتعرف على النمط من شكل المسألة، نص الشغل خلص. في المستوى ده 10 أنماط، كل واحد بمثال واحد بـ Dart وتعقيده، وفي الآخر طريقة تشتغل بيها على مسألة وإنت بتتكلم بصوت عالي.</p>",
      points: [
        "<b>Two pointers</b>: مؤشرين بيمشوا على array مرتب. <b>Sliding window</b>: نافذة بتتحرك. <b>Hash map</b>: بدل لفة جوه لفة.",
        "<b>Prefix sums</b>: مجاميع جاهزة. <b>Binary search</b>: نقسم المساحة. <b>Sort then scan</b>: رتب الأول.",
        "<b>Recursion/backtracking</b>: جرب وارجع. <b>BFS/DFS</b>: تجول في graph. <b>DP</b>: متحسبش نفس الحاجة مرتين. <b>Greedy</b>: خد الأحسن دلوقتي.",
        "كل الأمثلة اتشغلت بـ Dart 3 واتأكد من ناتجها.",
      ],
    },
    {
      kicker: "النمط 1",
      title: "Two pointers: مؤشرين على array مرتب",
      en: "Two pointers",
      body: "<p>المسألة: array مرتب، هل فيه رقمين مجموعهم <code>target</code>؟ الحل الساذج لفتين O(n²). لكن لأنه مرتب: مؤشر من الأول (<code>left</code>) ومؤشر من الآخر (<code>right</code>). لو المجموع صغير، حرك left لقدام (محتاج رقم أكبر). لو كبير، حرك right لورا. كل خطوة بتستبعد عنصر، فمرور واحد.</p>",
      code: {
        lang: "dart",
        src: `bool hasPairWithSum(List<int> sorted, int target) {
  var left = 0;
  var right = sorted.length - 1;
  while (left < right) {
    final sum = sorted[left] + sorted[right];
    if (sum == target) return true;
    if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return false;
}

void main() {
  print(hasPairWithSum([1, 3, 4, 6, 9], 10));  // true (1 + 9)
  print(hasPairWithSum([1, 3, 4, 6, 9], 2));   // false
}`,
        note: "<b>O(n)</b> وقت، <b>O(1)</b> مساحة. علامات النمط: array/string مرتب، أو سؤال عن «زوج»، أو palindrome (مؤشر من كل طرف).",
      },
      pitfall: "النمط ده بيشتغل بس لو الـ array مرتب (أو لو تقدر ترتبه من غير ما يفرق، زي لو بتسأل عن قيم مش indices).",
    },
    {
      kicker: "النمط 2",
      title: "Sliding window: نافذة بتتحرك",
      en: "Sliding window",
      body: "<p>لما المسألة عن «subarray أو substring متتالي»، بدل ما تحسب كل نافذة من الصفر، بتحافظ على نافذة وبتحدثها: عنصر بيدخل من اليمين وعنصر بيطلع من الشمال. المثال: أكبر مجموع لأي 3 عناصر متتالية.</p>",
      code: {
        lang: "dart",
        src: `int maxSumOfWindow(List<int> nums, int k) {
  var window = 0;
  for (var i = 0; i < k; i++) {
    window += nums[i];
  }
  var best = window;
  for (var i = k; i < nums.length; i++) {
    window += nums[i] - nums[i - k];   // add new, drop old
    if (window > best) best = window;
  }
  return best;
}

void main() {
  print(maxSumOfWindow([2, 1, 5, 1, 3, 2], 3));  // 9  (5 + 1 + 3)
}`,
        note: "<b>O(n)</b> بدل O(n·k). النوافذ: 8، 7، 9، 6 والأكبر 9. افترضنا إن <code>k &lt;= nums.length</code>.",
      },
      codes: [
        {
          lang: "dart",
          title: "نافذة متغيرة الحجم: أطول substring من غير تكرار",
          src: `int longestUnique(String s) {
  final lastSeen = <String, int>{};
  var start = 0;
  var best = 0;
  for (var i = 0; i < s.length; i++) {
    final ch = s[i];
    final last = lastSeen[ch];
    if (last != null && last >= start) start = last + 1;
    lastSeen[ch] = i;
    if (i - start + 1 > best) best = i - start + 1;
  }
  return best;
}

void main() {
  print(longestUnique('abcabcbb'));  // 3 (abc)
  print(longestUnique('bbbbb'));     // 1
  print(longestUnique('pwwkew'));    // 3 (wke)
}`,
          note: "<code>start</code> هو بداية النافذة، وبننقله بعد آخر ظهور للحرف المكرر. كل حرف بيتزار مرة: O(n).",
        },
      ],
      interview: [
        { q: "إيه علامات إن المسألة sliding window؟", a: "لما بتسأل عن subarray أو substring متتالي (أكبر مجموع، أطول جزء بشرط معين، أقل طول يحقق شرط)، وإن الشرط ممكن يتحدث بدخول عنصر وخروج عنصر. بدل ما أعيد حساب كل جزء من الصفر O(n·k) أحافظ على النافذة وأحركها فبتبقى O(n). في النافذة الثابتة بضيف الجديد وأشيل القديم، وفي المتغيرة بوسع من اليمين وبضيق من الشمال لما الشرط يتكسر." },
      ],
    },
    {
      kicker: "النمط 3",
      title: "Hash map: بدل اللفة الجوانية",
      en: "Hash map lookup",
      body: "<p>أي مرة تلاقي نفسك بتدور على عنصر بقيمته جوه لفة، اسأل: أقدر أخزن اللي شفته في <code>Map</code> أو <code>Set</code> عشان البحث يبقى O(1)؟ المثال الكلاسيكي: <b>Two Sum</b> على array غير مرتب، رجّع indices الرقمين اللي مجموعهم target.</p>",
      code: {
        lang: "dart",
        src: `List<int> twoSum(List<int> nums, int target) {
  final indexOf = <int, int>{};
  for (var i = 0; i < nums.length; i++) {
    final need = target - nums[i];
    final j = indexOf[need];
    if (j != null) return [j, i];
    indexOf[nums[i]] = i;
  }
  return [];
}

void main() {
  print(twoSum([2, 7, 11, 15], 9));   // [0, 1]
  print(twoSum([3, 2, 4], 6));        // [1, 2]
}`,
        note: "الفكرة: لكل رقم، المكمل بتاعه <code>target - x</code>. هل شفناه قبل كده؟ لو آه خلصنا. <b>O(n)</b> وقت، <b>O(n)</b> مساحة (قايضنا مساحة بوقت). الحل الساذج O(n²).",
      },
      interview: [
        { q: "حل Two Sum بطريقتين وقارن بينهم.", a: "الساذجة: لفتين متداخلتين على كل زوج، O(n²) وقت و O(1) مساحة. الأحسن: لفة واحدة وعند كل رقم x أبحث في Map عن المكمل target - x. لو لقيته أرجع indices، وإلا أخزن x مع index بتاعه. وقتها O(n) ومساحة O(n). ولو الـ array مرتب بقدر أستخدم two pointers بوقت O(n) ومساحة O(1)." },
      ],
    },
    {
      kicker: "النمط 4",
      title: "Prefix sums: مجاميع جاهزة",
      en: "Prefix sums",
      body: "<p>لو هتسأل «مجموع العناصر من index a لـ b» مرات كتير، متجمعش كل مرة O(n). جهّز مرة واحدة array <code>prefix</code> بحيث <code>prefix[i]</code> هو مجموع أول <code>i</code> عناصر، وبعدها أي مجموع هو طرح اتنين: O(1).</p>",
      code: {
        lang: "dart",
        src: `List<int> buildPrefix(List<int> nums) {
  final prefix = <int>[0];
  for (final n in nums) {
    prefix.add(prefix.last + n);
  }
  return prefix;
}

// sum of nums[from..to], both inclusive
int rangeSum(List<int> prefix, int from, int to) =>
    prefix[to + 1] - prefix[from];

void main() {
  final prefix = buildPrefix([3, 1, 4, 1, 5]);
  print(prefix);                   // [0, 3, 4, 8, 9, 14]
  print(rangeSum(prefix, 1, 3));   // 6  (1 + 4 + 1)
  print(rangeSum(prefix, 0, 4));   // 14
}`,
        note: "البناء <b>O(n)</b> مرة واحدة، وكل استعلام <b>O(1)</b>. الصفر في أول الـ prefix بيخلي الحالة <code>from = 0</code> تشتغل من غير شرط خاص.",
      },
      pitfall: "الـ off-by-one: <code>prefix</code> أطول من <code>nums</code> بواحد، فالمجموع الشامل لـ <code>to</code> هو <code>prefix[to + 1] - prefix[from]</code>. اكتب مثال صغير على ورقة وتأكد.",
    },
    {
      kicker: "النمط 5",
      title: "Binary search وفخاخ الـ off-by-one",
      en: "Binary search",
      body: "<p>على array <b>مرتب</b>، بدل ما تمسح كل العناصر، بتبص على اللي في النص: لو هو الهدف خلاص، لو أصغر من الهدف يبقى الهدف في النص اليمين، لو أكبر يبقى في الشمال. كل خطوة بتنصف المساحة: <b>O(log n)</b>.</p>",
      code: {
        lang: "dart",
        src: `int binarySearch(List<int> sorted, int target) {
  var low = 0;
  var high = sorted.length - 1;
  while (low <= high) {
    final mid = low + (high - low) ~/ 2;
    if (sorted[mid] == target) return mid;
    if (sorted[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}

void main() {
  final data = [1, 3, 5, 7, 9, 11];
  print(binarySearch(data, 7));   // 3
  print(binarySearch(data, 4));   // -1
  print(binarySearch([], 4));     // -1
}`,
        note: "<code>low + (high - low) ~/ 2</code> بدل <code>(low + high) ~/ 2</code>: عادة بتمنع overflow في لغات الـ 32-bit. في Dart الـ int 64-bit على الـ VM فمش هتحصل، لكن العادة سليمة.",
      },
      points: [
        "<b>الشرط <code>low &lt;= high</code></b> (مش <code>&lt;</code>): لو استخدمت <code>&lt;</code> هتفوت الحالة اللي فيها عنصر واحد باقي.",
        "<b>التحريك <code>mid + 1</code> و <code>mid - 1</code></b> (مش <code>mid</code>): لو حركت لـ <code>mid</code> نفسه ممكن تلف للأبد.",
        "المدخل الفاضي: <code>high = -1</code> فاللفة مبتدخلش وبيرجع -1.",
        "الاستخدامات التانية: «أول موضع أكبر من أو يساوي x»، أو أصغر قيمة بتحقق شرط (نفس الفكرة على إجابات مش array).",
      ],
      interview: [
        { q: "اكتب binary search وقولي الأخطاء الشائعة فيه.", a: "بحافظ على <code>low</code> و<code>high</code> وأحسب <code>mid</code>، لو القيمة في mid هي الهدف أرجع، لو أصغر أحرك low إلى mid + 1، لو أكبر أحرك high إلى mid - 1، والشرط <code>low &lt;= high</code>. تعقيده O(log n). الأخطاء: استخدام <code>&lt;</code> بدل <code>&lt;=</code> فأفوت عنصر، أو تحريك low/high لـ mid بدل mid±1 فأدخل في loop لا نهائي، وطبعا تطبيقه على array مش مرتب." },
      ],
    },
    {
      kicker: "النمط 6",
      title: "رتّب الأول وبعدين امسح",
      en: "Sort, then scan",
      body: "<p>كتير من المسائل بتبقى أسهل بعد الترتيب لأن العناصر المرتبطة بتتجمع جنب بعض. المثال: <b>دمج الفترات المتداخلة</b> (حجوزات، مواعيد معاينة). رتب بالبداية وبعدين امسح مرة: لو الفترة الحالية بدأت قبل ما اللي قبلها تنتهي، دمجهم.</p>",
      code: {
        lang: "dart",
        src: `List<List<int>> mergeIntervals(List<List<int>> intervals) {
  if (intervals.isEmpty) return [];
  final sorted = [...intervals]..sort((a, b) => a[0].compareTo(b[0]));
  final merged = <List<int>>[[...sorted.first]];
  for (final current in sorted.skip(1)) {
    final last = merged.last;
    if (current[0] <= last[1]) {
      if (current[1] > last[1]) last[1] = current[1];
    } else {
      merged.add([...current]);
    }
  }
  return merged;
}

void main() {
  final slots = [[1, 3], [8, 10], [2, 6], [15, 18]];
  print(mergeIntervals(slots));   // [[1, 6], [8, 10], [15, 18]]
}`,
        note: "<b>O(n log n)</b> من الترتيب، والمسح O(n). عملنا نسخة <code>[...intervals]</code> قبل الترتيب عشان منعدلش في الـ input الأصلي.",
      },
      points: [
        "<code>list.sort()</code> في Dart بترتب الـ list نفسها (in place) بدون ما ترجع حاجة. بتاخد comparator: دالة ترجع سالب/صفر/موجب، زي <code>a.compareTo(b)</code>.",
        "التعقيد المتوقع <b>O(n log n)</b>. و<code>List.sort</code> في Dart <b>مش مضمونة تكون stable</b> (العناصر المتساوية ممكن يتغير ترتيبها). لو محتاج stable استخدم <code>mergeSort</code> من <code>package:collection</code>.",
        "الترتيب بمعيارين: <code>(a, b) =&gt; a.city != b.city ? a.city.compareTo(b.city) : b.price.compareTo(a.price)</code>.",
      ],
    },
    {
      kicker: "النمط 7",
      title: "Recursion و backtracking",
      en: "Recursion and backtracking",
      body: "<p>الـ <b>recursion</b>: دالة بتنادي نفسها على نسخة أصغر من المسألة، ولازم يكون ليها <b>base case</b> توقفها وإلا stack overflow. الـ <b>backtracking</b> هو recursion بيجرب اختيار، ويكمل، وبعدين <b>يلغي</b> الاختيار ويجرب البديل. المثال: كل الـ subsets لمجموعة.</p>",
      code: {
        lang: "dart",
        src: `List<List<int>> subsets(List<int> nums) {
  final result = <List<int>>[];

  void walk(int index, List<int> current) {
    if (index == nums.length) {
      result.add([...current]);   // copy: current keeps changing
      return;
    }
    walk(index + 1, current);     // skip nums[index]
    current.add(nums[index]);     // choose it
    walk(index + 1, current);
    current.removeLast();         // undo (backtrack)
  }

  walk(0, []);
  return result;
}

void main() {
  print(subsets([1, 2, 3]));
  print(subsets([1, 2, 3, 4]).length);   // 16
}`,
        note: "لكل عنصر قرارين (ياخده أو لأ) فالعدد <b>2ⁿ</b> والتعقيد <b>O(n · 2ⁿ)</b> (النسخ). الناتج: <code>[[], [3], [2], [2, 3], [1], [1, 3], [1, 2], [1, 2, 3]]</code>.",
      },
      pitfall: "نسيان النسخة: <code>result.add(current)</code> بتضيف نفس الـ list كل مرة، وفي الآخر كلها فاضية بسبب <code>removeLast</code>. لازم <code>[...current]</code>. وفخ تاني: base case ناقصة = stack overflow.",
    },
    {
      kicker: "النمط 8",
      title: "BFS و DFS على graph و grid",
      en: "Breadth-first and depth-first search",
      body: "<p>الاتنين بيزوروا كل العقد، الفرق في الترتيب:</p><ul><li><b>BFS</b> (queue): طبقة طبقة، الأقرب الأول. هو الحل لـ <b>أقصر طريق في graph من غير أوزان</b> (أقل عدد خطوات).</li><li><b>DFS</b> (stack أو recursion): بيغوص لآخر الفرع الأول وبعدها يرجع. مناسب لـ «هل فيه طريق؟»، وعد المناطق المتصلة، وbacktracking.</li></ul><p>وفي الاتنين لازم تسجل المزارة (visited) وإلا لو فيه دايرة هتلف للأبد. التعقيد: <b>O(V + E)</b>.</p>",
      codes: [
        {
          lang: "dart",
          title: "BFS: أقل عدد خطوات بين شاشتين",
          src: `import 'dart:collection';

int shortestHops(Map<String, List<String>> graph, String start, String goal) {
  final queue = Queue<String>()..add(start);
  final dist = <String, int>{start: 0};
  while (queue.isNotEmpty) {
    final node = queue.removeFirst();
    if (node == goal) return dist[node]!;
    for (final next in graph[node] ?? const <String>[]) {
      if (!dist.containsKey(next)) {
        dist[next] = dist[node]! + 1;
        queue.add(next);
      }
    }
  }
  return -1;
}

void main() {
  final routes = {
    'home': ['search', 'profile'],
    'search': ['details'],
    'details': ['inquiry'],
    'profile': <String>[],
    'inquiry': <String>[],
  };
  print(shortestHops(routes, 'home', 'inquiry'));      // 3
  print(shortestHops(routes, 'profile', 'inquiry'));   // -1
}`,
          note: "الـ <code>dist</code> بتشتغل كـ visited وكمان بتحفظ المسافة. -1 يعني مفيش طريق.",
        },
        {
          lang: "dart",
          title: "DFS: عدد الجزر في grid (1 = أرض)",
          src: `int countIslands(List<List<int>> grid) {
  final rows = grid.length;
  final cols = grid.isEmpty ? 0 : grid[0].length;
  final seen = List.generate(rows, (_) => List.filled(cols, false));

  void sink(int r, int c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (grid[r][c] == 0 || seen[r][c]) return;
    seen[r][c] = true;
    sink(r + 1, c);
    sink(r - 1, c);
    sink(r, c + 1);
    sink(r, c - 1);
  }

  var count = 0;
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (grid[r][c] == 1 && !seen[r][c]) {
        count++;
        sink(r, c);
      }
    }
  }
  return count;
}

void main() {
  print(countIslands([
    [1, 1, 0, 0],
    [0, 1, 0, 1],
    [0, 0, 0, 1],
    [1, 0, 0, 0],
  ]));   // 3
}`,
          note: "الـ grid كأنها graph: كل خلية جيرانها الأربعة. أول ما نلاقي أرض جديدة نعد جزيرة ونغطس كل المتصل بيها.",
        },
      ],
      interview: [
        { q: "إيه الفرق بين BFS و DFS؟ وإمتى تستخدم كل واحد؟", a: "BFS بيستخدم queue وبيزور العقد طبقة طبقة من الأقرب للأبعد، فهو الأنسب لأقصر طريق (بعدد الخطوات) في graph بدون أوزان. DFS بيستخدم stack أو recursion وبيغوص لآخر الفرع قبل ما يرجع، وأنسب لاكتشاف إن فيه طريق، وعد المكونات المتصلة، والـ backtracking، ومساحته أقل في الـ graphs العريضة. الاتنين O(V+E) ولازم أسجل العقد المزارة." },
      ],
    },
    {
      kicker: "النمط 9 و 10",
      title: "Dynamic programming و greedy",
      en: "A first look at DP and greedy",
      body: "<p>الـ <b>DP</b> بتنفع لما المسألة بتتقسم لمسائل فرعية <b>متكررة</b>. المثال: سلم فيه n درجة، تطلع درجة أو درجتين كل مرة، فيه كام طريقة؟ <code>ways(n) = ways(n-1) + ways(n-2)</code>. الـ recursion العادية بتحسب نفس القيم ملايين المرات (أُسّي)، والحل <b>memoization</b>: خزن كل نتيجة بعد أول حساب.</p>",
      code: {
        lang: "dart",
        src: `int climb(int n, [Map<int, int>? memo]) {
  memo ??= {};
  if (n <= 2) return n;
  return memo[n] ??= climb(n - 1, memo) + climb(n - 2, memo);
}

int climbBottomUp(int n) {
  if (n <= 2) return n;
  var a = 1;
  var b = 2;
  for (var i = 3; i <= n; i++) {
    final c = a + b;
    a = b;
    b = c;
  }
  return b;
}

void main() {
  print(climb(5));            // 8
  print(climb(10));           // 89
  print(climbBottomUp(10));   // 89
}`,
        note: "من غير memo: وقت أُسّي تقريبا O(2ⁿ). مع memo: <b>O(n)</b> وقت و O(n) مساحة. النسخة bottom-up بتحتفظ بآخر قيمتين بس: O(n) وقت و O(1) مساحة.",
      },
      points: [
        "<b>طريقة التفكير في DP</b>: (1) عرّف المسألة الفرعية، (2) اكتب العلاقة بينها، (3) حدد الحالات الأساسية، (4) حسّن بـ memo أو جدول.",
        "<b>Greedy</b>: في كل خطوة خد الاختيار الأحسن دلوقتي من غير ما ترجع. بيشتغل في مسائل معينة بس (صرف الباقي بعملة 25/10/5/1). مثال إنه بيفشل: العملات <code>[1, 3, 4]</code> والمبلغ 6: الـ greedy يديك 4+1+1 (3 عملات) بينما الأمثل 3+3 (عملتين).",
      ],
      interview: [
        { q: "إيه الـ dynamic programming وإزاي تعرف إن المسألة تحتاجه؟", a: "هو تحويل مسألة لمسائل فرعية متكررة وتخزين نتيجة كل واحدة مرة واحدة بدل ما تتحسب كذا مرة. بعرف إنه مناسب لما أشوف overlapping subproblems (نفس الحساب بيتكرر) و optimal substructure (الحل الأمثل مبني على حلول مثلى لمسائل أصغر). مثال Fibonacci أو سلم n درجة: الـ recursion بتاخد وقت أُسّي، وبعد memoization بتبقى O(n)." },
      ],
    },
    {
      kicker: "الإنترفيو نفسه",
      title: "إزاي تشتغل على مسألة وإنت بتتكلم",
      en: "How to work a problem aloud",
      body: "<p>الإنترفيور مش بس عايز الحل، عايز يشوف إزاي بتفكر. خمس خطوات تمشي عليهم كل مرة:</p>",
      points: [
        "<b>1. وضّح (Clarify)</b>: اسأل: حجم الداتا؟ ممكن تكون فاضية؟ فيها تكرار؟ negative؟ مرتبة؟ إيه الـ output لو مفيش حل؟ (دقيقتين أسئلة بتوفر عليك ربع ساعة غلط.)",
        "<b>2. أمثلة</b>: ارسم مثال عادي ومثال حدّي (قايمة فاضية، عنصر واحد، كلهم متساويين) وقول الناتج المتوقع.",
        "<b>3. Brute force الأول</b>: قول الحل الساذج وتعقيده بصوت عالي (لفتين O(n²))، حتى لو مش هتكتبه. ده بيثبت إن عندك حل شغال.",
        "<b>4. حسّن</b>: اسأل نفسك أنهي نمط: مرتب؟ two pointers أو binary search. بحث متكرر؟ hash map. مجاميع نطاقات؟ prefix. أقول التعقيد الجديد وقبل ما أكتب.",
        "<b>5. اكتب ثم اختبر</b>: اكتب بخطوات نضيفة بأسماء واضحة، وبعد كده شغّل المثال بإيدك على الكود سطر سطر، وجرب الحالات الحدية. وقول تعقيد الوقت والمساحة في الآخر.",
      ],
      focus: [{ label: "لو علقت", text: "متسكتش. قول اللي في دماغك: «أنا بفكر في hash map عشان…». الإنترفيور غالبا هيدي تلميح، والصمت التام هو الأسوأ." }],
      pitfall: "تبدأ تكتب كود فورا من غير ما تفهم المسألة، أو تحسّن قبل ما يبقى عندك حل شغال. ابدأ بالبسيط الصح، وبعدين الأسرع.",
      interview: [
        { q: "إزاي بتتعامل مع مسألة coding جديدة في الإنترفيو؟", a: "بسأل أسئلة توضيحية (حجم الداتا، الحالات الحدية، شكل الـ output)، وبجرب مثال أو اتنين بإيدي. بقول الحل الساذج وتعقيده الأول، وبعدين بدور على نمط يحسنه: ترتيب، hash map، two pointers، binary search. بأقول الفكرة الجديدة وتعقيدها وأتأكد إن الإنترفيور موافق قبل ما أكتب. بكتب كود نضيف، وبختبره على المثال سطر سطر وعلى الحالات الحدية، وفي الآخر بذكر التعقيد." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: binary search",
      lang: "dart",
      code: `int binarySearch(List<int> sorted, int target) {
  var low = 0;
  var high = sorted.length - 1;
  while (low <= high) {
    final mid = low + (high - low) ~/ 2;
    if (sorted[mid] == target) return mid;
    if (sorted[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`,
    },
    {
      title: "اكتب: Two Sum بـ Map",
      lang: "dart",
      code: `List<int> twoSum(List<int> nums, int target) {
  final indexOf = <int, int>{};
  for (var i = 0; i < nums.length; i++) {
    final need = target - nums[i];
    final j = indexOf[need];
    if (j != null) return [j, i];
    indexOf[nums[i]] = i;
  }
  return [];
}`,
    },
    {
      title: "اكتب: prefix sums",
      lang: "dart",
      code: `List<int> buildPrefix(List<int> nums) {
  final prefix = <int>[0];
  for (final n in nums) {
    prefix.add(prefix.last + n);
  }
  return prefix;
}

int rangeSum(List<int> prefix, int from, int to) =>
    prefix[to + 1] - prefix[from];`,
    },
  ],

  tasks: [
    {
      title: "أول حرف مش متكرر",
      lang: "dart",
      prompt: "<p>اكتب <code>int firstUniqueChar(String s)</code> بترجع index أول حرف ظهر مرة واحدة بس في النص، أو <code>-1</code> لو مفيش.</p>",
      examples: [
        { in: "firstUniqueChar('leetcode')", out: "0" },
        { in: "firstUniqueChar('loveleetcode')", out: "2" },
        { in: "firstUniqueChar('aabb')", out: "-1" },
      ],
      starter: `int firstUniqueChar(String s) {
  // your code
}`,
      hints: [
        "عد كل حرف في Map في لفة أولى.",
        "لفة تانية على الحروف بالترتيب: أول حرف عدّه 1 هو الجواب.",
      ],
      solution: `int firstUniqueChar(String s) {
  final counts = <String, int>{};
  for (var i = 0; i < s.length; i++) {
    counts[s[i]] = (counts[s[i]] ?? 0) + 1;
  }
  for (var i = 0; i < s.length; i++) {
    if (counts[s[i]] == 1) return i;
  }
  return -1;
}`,
      explain: "لفتين متتاليتين (مش متداخلتين): <b>O(n)</b> وقت و O(k) مساحة (k = عدد الحروف المختلفة). الساذجة: لكل حرف تدور على باقي النص: O(n²). النمط: hash map للعد.",
    },
    {
      title: "موضع الإدراج",
      lang: "dart",
      prompt: "<p>اكتب <code>int searchInsert(List&lt;int&gt; sorted, int target)</code> على array مرتب بدون تكرار: ترجع index الهدف لو موجود، أو الـ index اللي لازم يتحط فيه عشان الترتيب يفضل سليم. لازم <b>O(log n)</b>.</p>",
      examples: [
        { in: "searchInsert([1, 3, 5, 6], 5)", out: "2" },
        { in: "searchInsert([1, 3, 5, 6], 2)", out: "1" },
        { in: "searchInsert([1, 3, 5, 6], 7)", out: "4" },
        { in: "searchInsert([1, 3, 5, 6], 0)", out: "0" },
      ],
      starter: `int searchInsert(List<int> sorted, int target) {
  // your code
}`,
      hints: [
        "binary search عادي، بس لما اللفة تخلص من غير ما تلاقي، رجّع حاجة بدل -1.",
        "في نهاية اللفة <code>low</code> بتكون بالظبط أول موضع قيمته أكبر من الهدف.",
      ],
      solution: `int searchInsert(List<int> sorted, int target) {
  var low = 0;
  var high = sorted.length - 1;
  while (low <= high) {
    final mid = low + (high - low) ~/ 2;
    if (sorted[mid] == target) return mid;
    if (sorted[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return low;
}`,
      explain: "نفس binary search بالظبط، والتغيير الوحيد: <code>return low</code> بدل <code>-1</code>. لما اللفة تنتهي <code>low</code> بيشاور على أول عنصر أكبر من الهدف (أو آخر الـ array)، وده مكان الإدراج. وقت O(log n).",
    },
    {
      title: "أفضل ربح من شراء وبيع",
      lang: "dart",
      prompt: "<p>معاك <code>List&lt;int&gt; prices</code> أسعار سهم يوم بيوم. اكتب <code>int maxProfit(List&lt;int&gt; prices)</code> بترجع أكبر ربح ممكن من شراء في يوم وبيع في يوم <b>بعده</b>. لو مفيش ربح ممكن ارجع 0. حلها في مرور واحد.</p>",
      examples: [
        { in: "maxProfit([7, 1, 5, 3, 6, 4])", out: "5" },
        { in: "maxProfit([7, 6, 4, 3, 1])", out: "0" },
      ],
      starter: `int maxProfit(List<int> prices) {
  // your code
}`,
      hints: [
        "لو بتبيع النهارده، أفضل شراء كان في أقل سعر شفته قبل كده.",
        "حافظ على متغيرين وإنت ماشي: أقل سعر لحد دلوقتي، وأكبر ربح لحد دلوقتي.",
      ],
      solution: `int maxProfit(List<int> prices) {
  if (prices.isEmpty) return 0;
  var lowest = prices.first;
  var best = 0;
  for (final price in prices.skip(1)) {
    if (price - lowest > best) best = price - lowest;
    if (price < lowest) lowest = price;
  }
  return best;
}`,
      explain: "في كل يوم بنحسب «لو بعت النهارده» = السعر ناقص أقل سعر قبله. مرور واحد <b>O(n)</b> ومساحة O(1). الحل الساذج لفتين O(n²). ده مزيج من greedy (أقل سعر لحد دلوقتي) و DP بسيط.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final data = [1, 3, 5, 7, 9, 11];
print(binarySearch(data, 7));` },
      answer: ["3"],
      why: "الـ low=0, high=5 ← mid=2 (القيمة 5 أصغر من 7) ← low=3 ← mid=4 (9 أكبر) ← high=3 ← mid=3 (7 = الهدف). الـ index هو 3.",
    },
    {
      q: "أي تعديل على binary search ده بيعمل bug؟",
      options: [
        "<code>while (low &lt;= high)</code>",
        "<code>low = mid + 1</code> لما القيمة أصغر من الهدف",
        "<code>high = mid - 1</code> لما القيمة أكبر",
        "<code>low = mid</code> لما القيمة أصغر من الهدف",
      ],
      answer: 3,
      why: "لو low = mid ممكن mid ميتحركش أبدا (مثلا لما low و high متجاورين) فتدخل في loop لا نهائي. التحريك الصح <code>mid + 1</code>. الباقي كله من النسخة الصحيحة.",
    },
    {
      q: "عندك array غير مرتب كبير وعايز تلاقي رقمين مجموعهم target بأسرع طريقة. أنسب نمط وتعقيد؟",
      options: [
        "two pointers مباشرة بدون ترتيب، O(n)",
        "binary search، O(log n)",
        "hash map، O(n) وقت و O(n) مساحة",
        "لفتين متداخلتين، O(n)",
      ],
      answer: 2,
      why: "الـ two pointers بتحتاج array مرتب، والـ binary search كذلك. لفتين متداخلتين = O(n²). الـ hash map بتحل في مرور واحد وبتقايض مساحة بوقت.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final prefix = buildPrefix([3, 1, 4, 1, 5]);
print(rangeSum(prefix, 1, 3));` },
      answer: ["6"],
      why: "prefix = [0, 3, 4, 8, 9, 14]. المجموع من index 1 لـ 3 شامل = prefix[4] - prefix[1] = 9 - 3 = 6 (يعني 1 + 4 + 1).",
    },
    {
      q: "أقصر طريق بعدد الخطوات في graph من غير أوزان. أنسب خوارزمية؟",
      options: ["BFS", "DFS", "Binary search", "Sorting"],
      answer: 0,
      why: "الـ BFS بتزور العقد طبقة طبقة، فأول مرة توصل فيها للهدف تكون بأقل عدد خطوات. الـ DFS ممكن توصل بطريق أطول.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print(maxSumOfWindow([2, 1, 5, 1, 3, 2], 3));` },
      options: ["7", "8", "9", "10"],
      answer: 2,
      why: "النوافذ الثلاثية: 2+1+5=8، 1+5+1=7، 5+1+3=9، 1+3+2=6. الأكبر 9.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print(climb(5));   // ways to climb 5 stairs, 1 or 2 steps
// climb(n) = climb(n-1) + climb(n-2), climb(1)=1, climb(2)=2` },
      answer: ["8"],
      why: "climb(3)=3، climb(4)=5، climb(5)=8. نفس متتابعة Fibonacci مزاحة.",
    },
    {
      q: "ليه الـ memoization بتحسن الـ recursion في مسألة السلم؟",
      options: [
        "بتقلل عدد المتغيرات",
        "بتحول الـ recursion لـ loop بدون تخزين",
        "بتخلي كل مسألة فرعية تتحسب مرة واحدة بدل ما تتكرر بشكل أُسّي",
        "بتخلي الـ compiler يحذف الـ base case",
      ],
      answer: 2,
      why: "نفس القيمة (مثلا climb(3)) كانت بتتحسب مرات كتير. بتخزينها في Map بتتحسب مرة واحدة فينزل التعقيد من أُسّي إلى O(n).",
    },
    {
      q: "عدد عناصر <code>subsets([1, 2, 3, 4])</code> (كل المجموعات الفرعية بما فيها الفاضية)؟",
      options: ["8", "16", "24", "10"],
      answer: 1,
      why: "لكل عنصر اختيارين (يتاخد ولا لأ) فالعدد 2⁴ = 16. الـ 24 هي عدد الترتيبات (permutations) لأربع عناصر، حاجة تانية.",
    },
    {
      q: "العملات [1, 3, 4] والمبلغ 6. ليه الـ greedy (خد أكبر عملة تنفع) مش دايما صح هنا؟",
      options: [
        "مفيش مشكلة، greedy بيدي الأقل دايما",
        "بيدي 4+1+1 (3 عملات) بينما الأمثل 3+3 (عملتين)",
        "بيرجع خطأ لأن 6 مش من العملات",
        "بيدي 3+3 لكن بيبقى بطيء",
      ],
      answer: 1,
      why: "الـ greedy بيمسك أكبر عملة (4) فيتبقى 2 يحتاج 1+1. الحل الأمثل 3+3. ده مثال إن greedy بيشتغل في مسائل معينة بس، وغيره محتاج DP.",
    },
  ],
};
