window.LEVELS = window.LEVELS || {};
window.LEVELS["algo/a10"] = {
  slides: [
    {
      kicker: "الخريطة",
      title: "أنماط الـ DP: اعرف الشكل من وصف المسألة",
      en: "The catalogue of DP patterns",
      body: "<p>في a9 عملت DP على بُعد واحد. في الإنترفيو معظم مسائل DP بتيجي في <b>خمس أشكال</b>. لما تعرف الشكل، الـ state والـ transition بيجوا تقريبا لوحدهم. الجدول ده هو الخريطة اللي هنمشي عليها في المستوى:</p>",
      codes: [
        {
          lang: "text",
          title: "كتالوج الأنماط",
          src: `pattern        state                     typical problems
-------------  ------------------------  ---------------------------------
linear (1D)    dp[i]  prefix / amount    fib, stairs, house robber, LIS,
                                         coin change, decode ways
grid           dp[r][c]  cell            unique paths, min path sum
two strings    dp[i][j]  two prefixes    LCS, edit distance, common substring
knapsack       dp[i][c]  items, capacity 0/1 knapsack, subset sum, partition
interval       dp[i][j]  substring i..j  palindromic subsequence, burst balloons`,
        },
      ],
      points: [
        "<b>اتنين مدخلات بالتوازي</b> (سلسلتين) ← two strings، الجدول (m+1) × (n+1) و<code>dp[i][j]</code> هو أول i من الأولى وأول j من التانية.",
        "<b>شبكة وبتتحرك يمين/تحت</b> ← grid، كل خانة بتعتمد على اللي فوقها واللي شمالها.",
        "<b>اختيار عناصر بميزانية</b> (وزن/مبلغ/سعة) ← knapsack. كل عنصر إما خد أو ما خدش.",
        "<b>مدى [i, j] ينقسم</b> ← interval DP، مذكور بإيجاز في الشريحة 9.",
        "كل نمط ليه طريقة ثابتة في اتجاه الحساب وفي تقليل المساحة، وهنشوفهم واحد واحد.",
      ],
      focus: [{ label: "احفظها", text: "قبل الكود: «ده linear ولا grid ولا two strings ولا knapsack؟» وبعدين اكتب dp[...] = ... بالكلام." }],
      interview: [
        { q: "إزاي بتعرف إن المسألة DP، ونوعها إيه؟", a: "ببحث عن: سؤال عن أقل/أكبر قيمة أو عدد طرق، وقرارات متتالية، وحل ساذج أسي بحالات بتتكرر. بعدين بصنفها: عنصر واحد أو مبلغ ← linear، شبكة ← grid، سلسلتين ← two strings، اختيار بميزانية ← knapsack، مدى داخل مدى ← interval. التصنيف بيحدد شكل الجدول والـ transition.",
        },
      ],
    },
    {
      kicker: "شبكة",
      title: "Unique Paths: عدد الطرق في شبكة",
      en: "Unique paths in a grid",
      body: "<p>روبوت في ركن شبكة <code>m × n</code> بيتحرك يمين أو تحت بس، كام طريقة للركن التاني؟ <b>State:</b> <code>dp[r][c]</code> = عدد الطرق للوصول للخانة. <b>Transition:</b> وصلت إما من فوق أو من شمال: <code>dp[r][c] = dp[r-1][c] + dp[r][c-1]</code>. أول صف وأول عمود كلهم 1 (طريق واحد: بس يمين أو بس تحت). ممكن بعد كده نختصر لصف واحد لأن كل خانة محتاجة صفها وصف فوقها بس.</p>",
      code: {
        lang: "dart",
        src: `int uniquePaths(int m, int n) {
  final dp = List.generate(m, (_) => List<int>.filled(n, 1));
  for (var r = 1; r < m; r++) {
    for (var c = 1; c < n; c++) {
      dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
    }
  }
  return dp[m - 1][n - 1];
}

int uniquePathsRow(int m, int n) {
  final row = List<int>.filled(n, 1);        // one row at a time
  for (var r = 1; r < m; r++) {
    for (var c = 1; c < n; c++) {
      row[c] += row[c - 1];                  // row[c] was "from above"
    }
  }
  return row[n - 1];
}

void main() {
  print(uniquePaths(3, 7));      // 28
  print(uniquePaths(3, 4));      // 10
  print(uniquePaths(1, 1));      // 1
  print(uniquePathsRow(3, 7));   // 28
  print(uniquePathsRow(2, 2));   // 2
}`,
        note: "الزمن O(m × n)، والمساحة O(m × n) للنسخة الأولى وO(n) للتانية. الطريق رياضيا هو C(m+n-2, m-1) لكن الجدول هو اللي بيتعمم لو فيه عوائق.",
      },
      codes: [
        {
          lang: "text",
          title: "الجدول لـ 3 × 4",
          src: `1  1  1   1
1  2  3   4
1  3  6   10        answer dp[2][3] = 10

dp[1][1] = dp[0][1] + dp[1][0] = 1 + 1 = 2
dp[2][3] = dp[1][3] + dp[2][2] = 4 + 6 = 10`,
        },
      ],
    },
    {
      kicker: "شبكة",
      title: "Minimum Path Sum",
      en: "Minimum path sum",
      body: "<p>شبكة أرقام، تروح من فوق-شمال لتحت-يمين بحركة يمين أو تحت، وعايز أقل مجموع على الطريق. نفس شكل الشبكة بس <code>dp[r][c]</code> = أقل مجموع للوصول للخانة. <b>Transition:</b> <code>grid[r][c] + min(dp[r-1][c], dp[r][c-1])</code>. أول صف وأول عمود ليهم اتجاه واحد بس فبيتجمعوا تراكميا. المرة دي فيه حدود لازم تتفحص (خانة بدون «فوق» أو بدون «شمال»).</p>",
      code: {
        lang: "dart",
        src: `import 'dart:math';

int minPathSum(List<List<int>> g) {
  if (g.isEmpty || g[0].isEmpty) return 0;
  final m = g.length, n = g[0].length;
  final dp = List.generate(m, (_) => List<int>.filled(n, 0));
  for (var r = 0; r < m; r++) {
    for (var c = 0; c < n; c++) {
      if (r == 0 && c == 0) {
        dp[r][c] = g[r][c];
      } else if (r == 0) {
        dp[r][c] = dp[r][c - 1] + g[r][c];
      } else if (c == 0) {
        dp[r][c] = dp[r - 1][c] + g[r][c];
      } else {
        dp[r][c] = g[r][c] + min(dp[r - 1][c], dp[r][c - 1]);
      }
    }
  }
  return dp[m - 1][n - 1];
}

void main() {
  print(minPathSum([[1, 3, 1], [1, 5, 1], [4, 2, 1]]));   // 7
  print(minPathSum([[1, 2, 3], [4, 5, 6]]));              // 12
  print(minPathSum([[5]]));                               // 5
  print(minPathSum([]));                                  // 0
}`,
        note: "الزمن O(m × n)، والمساحة O(m × n) أو O(n) بصف واحد. الجواب 7 = 1 → 3 → 1 → 1 → 1.",
      },
      codes: [
        {
          lang: "text",
          title: "الجدول للشبكة [[1,3,1],[1,5,1],[4,2,1]]",
          src: `grid        dp
1 3 1       1  4  5
1 5 1       2  7  6
4 2 1       6  8  7        answer 7

dp[1][1] = 5 + min(dp[0][1]=4, dp[1][0]=2) = 7
dp[1][2] = 1 + min(dp[0][2]=5, dp[1][1]=7) = 6
dp[2][2] = 1 + min(dp[1][2]=6, dp[2][1]=8) = 7`,
        },
      ],
    },
    {
      kicker: "سلسلتين",
      title: "Longest Common Subsequence",
      en: "Longest common subsequence",
      body: "<p>أطول subsequence مشتركة بين نصين (حروف بنفس الترتيب بس مش لازم متجاورة). <b>State:</b> <code>dp[i][j]</code> = طول الـ LCS بين أول <code>i</code> حرف من a وأول <code>j</code> حرف من b. <b>Transition:</b> لو آخر حرفين متساويين (<code>a[i-1] == b[j-1]</code>): نضيف واحد على الحل اللي قبلهم <code>dp[i-1][j-1] + 1</code>. غير كده نتخلص من آخر حرف من واحد منهم ونأخد الأحسن: <code>max(dp[i-1][j], dp[i][j-1])</code>. الصف والعمود صفر (نص فاضي) كلهم 0.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:math';

int lcsLength(String a, String b) {
  final m = a.length, n = b.length;
  final dp = List.generate(m + 1, (_) => List<int>.filled(n + 1, 0));
  for (var i = 1; i <= m; i++) {
    for (var j = 1; j <= n; j++) {
      if (a[i - 1] == b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}

void main() {
  print(lcsLength('abcde', 'ace'));            // 3
  print(lcsLength('abc', 'def'));              // 0
  print(lcsLength('AGGTAB', 'GXTXAYB'));       // 4
  print(lcsLength('', 'abc'));                 // 0
  print(lcsLength('abc', 'abc'));              // 3
}`,
        note: "الزمن والمساحة O(m × n). المساحة بتتقلل لصفين لو محتاج الطول بس (ومش محتاج تبني الحل).",
      },
      codes: [
        {
          lang: "text",
          title: "الجدول لـ a = 'abcde' و b = 'ace' (الصف الأول والعمود الأول للنص الفاضي)",
          src: `        ""  a  c  e
""       0  0  0  0
a        0  1  1  1
b        0  1  1  1
c        0  1  2  2
d        0  1  2  2
e        0  1  2  3        answer dp[5][3] = 3

dp[3][2]: a[2]='c' == b[1]='c'  -> dp[2][1] + 1 = 2
dp[2][2]: 'b' != 'c'            -> max(dp[1][2], dp[2][1]) = 1`,
        },
      ],
      pitfall: "الخلط بين subsequence وsubstring. الـ substring لازم متجاورة (إذا الحرفين مختلفين الخانة بتتصفر)، والـ subsequence لا (الخانة بتاخد max من الجيران). التاسك التاني في المستوى ده بيطلب الـ substring.",
      interview: [
        { q: "اشرح Longest Common Subsequence.", a: "<code>dp[i][j]</code> هو طول الـ LCS لأول i حرف من الأولى وأول j من التانية. لو الحرفين الأخيرين متساويين: <code>dp[i-1][j-1] + 1</code>، وإلا <code>max(dp[i-1][j], dp[i][j-1])</code>. صف وعمود الصفر = 0. الزمن والمساحة O(m × n). وأقدر أستخرج النص نفسه بالمشي لورا في الجدول.",
        },
      ],
    },
    {
      kicker: "سلسلتين",
      title: "Edit Distance (Levenshtein)",
      en: "Edit distance",
      body: "<p>أقل عدد عمليات (إدراج حرف، حذف حرف، استبدال حرف) لتحويل كلمة لكلمة. <b>State:</b> <code>dp[i][j]</code> = أقل عدد عمليات لتحويل أول i حرف من a لأول j حرف من b. <b>Base:</b> <code>dp[i][0] = i</code> (احذف كل حاجة) و<code>dp[0][j] = j</code> (أدرج كل حاجة). <b>Transition:</b> لو الحرفين متساويين فمفيش عملية: <code>dp[i-1][j-1]</code>. غير كده <code>1 + min</code> من تلات جيران: <code>dp[i-1][j-1]</code> (استبدال)، <code>dp[i-1][j]</code> (حذف حرف من a)، <code>dp[i][j-1]</code> (إدراج حرف في a).</p>",
      code: {
        lang: "dart",
        src: `import 'dart:math';

int editDistance(String a, String b) {
  final m = a.length, n = b.length;
  final dp = List.generate(m + 1, (_) => List<int>.filled(n + 1, 0));
  for (var i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (var j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  for (var i = 1; i <= m; i++) {
    for (var j = 1; j <= n; j++) {
      if (a[i - 1] == b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + min(dp[i - 1][j - 1], min(dp[i - 1][j], dp[i][j - 1]));
      }
    }
  }
  return dp[m][n];
}

void main() {
  print(editDistance('horse', 'ros'));           // 3
  print(editDistance('kitten', 'sitting'));      // 3
  print(editDistance('', 'abc'));                // 3
  print(editDistance('same', 'same'));           // 0
  print(editDistance('intention', 'execution')); // 5
}`,
        note: "الزمن والمساحة O(m × n). 'horse' → 'ros': استبدل h بـ r، احذف r، احذف e (3 عمليات).",
      },
      codes: [
        {
          lang: "text",
          title: "الجدول لـ 'horse' → 'ros'",
          src: `        ""  r  o  s
""       0  1  2  3
h        1  1  2  3
o        2  2  1  2
r        3  2  2  2
s        4  3  3  2
e        5  4  4  3        answer 3

dp[1][1]: 'h' != 'r' -> 1 + min(dp[0][0]=0, dp[0][1]=1, dp[1][0]=1) = 1
dp[2][2]: 'o' == 'o' -> dp[1][1] = 1`,
        },
      ],
      interview: [
        { q: "اشرح Edit Distance وفين كل عملية في الجدول؟", a: "<code>dp[i][j]</code> أقل عمليات لتحويل أول i حرف من a لأول j من b. لو الحرفين متساويين ناخد <code>dp[i-1][j-1]</code>. وإلا واحد + أقل تلات: القطر (استبدال)، فوق (حذف من a)، شمال (إدراج). Base: <code>dp[i][0] = i</code> و<code>dp[0][j] = j</code>. الزمن والمساحة O(m × n).",
        },
      ],
    },
    {
      kicker: "knapsack",
      title: "0/1 Knapsack: خد العنصر مرة واحدة أو سيبه",
      en: "0/1 knapsack",
      body: "<p>عناصر ليها وزن وقيمة وشنطة بسعة معينة. كل عنصر تاخده مرة واحدة أو متاخدوش. أكبر قيمة ممكنة؟ <b>State:</b> <code>dp[i][c]</code> = أكبر قيمة باستخدام أول i عنصر وسعة c. <b>Transition:</b> للعنصر i: سيبه <code>dp[i-1][c]</code>، أو خده (لو وزنه يسمح) <code>dp[i-1][c - w] + v</code>. الأكبر فيهم. هو نفس «خد ولا سيب» بتاع House Robber بس مع ميزانية.</p><p>الجدول ممكن يبقى صف واحد (بُعد السعة): <code>dp[c]</code>. بس لازم نلف على السعة <b>من الكبير للصغير</b>، علشان <code>dp[c - w]</code> لسه هو اللي قبل العنصر الحالي. لو لفينا للأمام العنصر هيتاخد أكتر من مرة (ده unbounded knapsack، مسألة تانية).</p>",
      codes: [
        {
          lang: "dart",
          title: "النسختين",
          src: `import 'dart:math';

int knapsack2D(List<int> w, List<int> v, int cap) {
  final n = w.length;
  final dp = List.generate(n + 1, (_) => List<int>.filled(cap + 1, 0));
  for (var i = 1; i <= n; i++) {
    for (var c = 0; c <= cap; c++) {
      dp[i][c] = dp[i - 1][c];                      // skip item i
      if (w[i - 1] <= c) {
        dp[i][c] = max(dp[i][c], dp[i - 1][c - w[i - 1]] + v[i - 1]);
      }
    }
  }
  return dp[n][cap];
}

int knapsack1D(List<int> w, List<int> v, int cap) {
  final dp = List<int>.filled(cap + 1, 0);
  for (var i = 0; i < w.length; i++) {
    for (var c = cap; c >= w[i]; c--) {              // backwards!
      dp[c] = max(dp[c], dp[c - w[i]] + v[i]);
    }
  }
  return dp[cap];
}

void main() {
  final w = [1, 3, 4, 5], v = [1, 4, 5, 7];
  print(knapsack2D(w, v, 7));         // 9
  print(knapsack1D(w, v, 7));         // 9
  print(knapsack1D([3], [4], 7));     // 4  (one item, once)
  print(knapsack1D([], [], 7));       // 0
  print(knapsack1D([5], [10], 3));    // 0
}`,
          note: "الجواب 9 = العنصر 2 والعنصر 3 (وزن 3 + 4 = 7، قيمة 4 + 5). الزمن O(n × cap) والمساحة O(n × cap) أو O(cap).",
        },
        {
          lang: "text",
          title: "الجدول لـ w=[1,3,4,5], v=[1,4,5,7], cap=7 (صف لكل عنصر)",
          src: `cap        0  1  2  3  4  5  6  7
no items   0  0  0  0  0  0  0  0
item 1     0  1  1  1  1  1  1  1      (w1 v1)
item 2     0  1  1  4  5  5  5  5      (w3 v4)
item 3     0  1  1  4  5  6  6  9      (w4 v5)
item 4     0  1  1  4  5  7  8  9      (w5 v7)   answer 9

dp[3][7] = max(dp[2][7]=5, dp[2][3]+5 = 4+5) = 9`,
        },
      ],
      pitfall: "لف السعة للأمام في النسخة ذات البُعد الواحد: الكود <code>for (c = w; c &lt;= cap; c++)</code> على عنصر واحد (وزن 3، قيمة 4، سعة 7) بيرجع 8 (العنصر اتاخد مرتين) بدل 4. لو شغال بصف واحد ولف الأمام، فانت بتحل unbounded knapsack من غير ما تقصد.",
      interview: [
        { q: "اشرح 0/1 Knapsack وليه بنلف السعة بالعكس في نسخة الصف الواحد؟", a: "<code>dp[i][c]</code> أكبر قيمة بأول i عنصر وسعة c: إما أسيب العنصر (<code>dp[i-1][c]</code>) أو آخده (<code>dp[i-1][c-w] + v</code>). في نسخة الصف الواحد <code>dp[c-w]</code> لازم يكون قيمة «قبل» العنصر الحالي، فبلف السعة من الكبير للصغير علشان محدّثتش خانة صغيرة قبل ما أستخدمها. لو لفيت للأمام العنصر هيتاخد أكتر من مرة. الزمن O(n × cap).",
        },
      ],
    },
    {
      kicker: "knapsack",
      title: "Subset Sum و Partition Equal Subset Sum",
      en: "Subset sum and partition",
      body: "<p>نفس شكل knapsack لكن الجدول <b>boolean</b>: هل في مجموعة فرعية مجموعها بالظبط <code>target</code>؟ <code>dp[s]</code> = ممكن نكوّن مجموع s. <code>dp[0] = true</code> (المجموعة الفاضية). لكل رقم x نلف على s من target لـ x بالعكس: لو <code>dp[s - x]</code> true فـ <code>dp[s]</code> true.</p><p><b>Partition Equal Subset Sum:</b> هل تقدر تقسم القايمة نصين مجموعهم متساوي؟ لو المجموع الكلي فردي مستحيل، وغير كده ده subset sum بـ target = المجموع ÷ 2.</p>",
      code: {
        lang: "dart",
        src: `bool subsetSum(List<int> nums, int target) {
  if (target < 0) return false;
  final dp = List<bool>.filled(target + 1, false);
  dp[0] = true;
  for (final x in nums) {
    for (var s = target; s >= x; s--) {      // backwards: use x once
      if (dp[s - x]) dp[s] = true;
    }
  }
  return dp[target];
}

bool canPartition(List<int> nums) {
  final total = nums.fold<int>(0, (a, b) => a + b);
  if (total.isOdd) return false;
  return subsetSum(nums, total ~/ 2);
}

void main() {
  print(subsetSum([3, 34, 4, 12, 5, 2], 9));    // true  (4 + 5)
  print(subsetSum([3, 34, 4, 12, 5, 2], 30));   // false
  print(subsetSum([], 0));                      // true
  print(canPartition([1, 5, 11, 5]));           // true  (11 | 1+5+5)
  print(canPartition([1, 2, 3, 5]));            // false (sum 11 is odd)
  print(canPartition([1, 2, 5]));               // false (sum 8, no subset of 4)
}`,
        note: "الأرقام لازم تكون غير سالبة. الزمن O(n × target) والمساحة O(target). ده «pseudo-polynomial»: يعتمد على قيمة target مش بس على عدد الأرقام.",
      },
      codes: [
        {
          lang: "text",
          title: "dp لـ subsetSum([3, 4, 5], 9) بعد كل رقم (T = true)",
          src: `s          0 1 2 3 4 5 6 7 8 9
start      T . . . . . . . . .
after 3    T . . T . . . . . .
after 4    T . . T T . . T . .
after 5    T . . T T T . T T T      dp[9] = T  (4 + 5)`,
        },
      ],
      interview: [
        { q: "ازاي تحل Partition Equal Subset Sum؟", a: "لو المجموع الكلي فردي مستحيل. وإلا هل فيه مجموعة فرعية مجموعها <code>total / 2</code>؟ ده subset sum: مصفوفة boolean <code>dp[s]</code>، <code>dp[0] = true</code>، ولكل رقم x ألف s من target لـ x بالعكس وأضبط <code>dp[s] |= dp[s - x]</code>. الزمن O(n × target) والمساحة O(target).",
        },
      ],
    },
    {
      kicker: "الحل نفسه",
      title: "استخراج الحل من الجدول (reconstruction)",
      en: "Reconstructing the answer from the table",
      body: "<p>الجدول بيديك القيمة (طول، تكلفة، عدد). لو المحاور طلب <b>الحل نفسه</b> (النص المشترك، العناصر المختارة، الطريق) مفيش حاجة تتخزن زيادة: بنمشي <b>لورا من آخر خانة</b> ونسأل في كل خانة «إيه القرار اللي وصلني هنا؟» بنفس المقارنات اللي حسبنا بيها.</p><p>للـ LCS: لو الحرفين متساويين، الحرف ده في الحل ونروح للقطر. غير كده نروح للخانة الأكبر (فوق أو شمال). للـ knapsack: لو <code>dp[i][c] != dp[i-1][c]</code> يبقى العنصر i اتاخد وننقص السعة بوزنه. لازم نحتفظ بالجدول كله (مش صف واحد).</p>",
      codes: [
        {
          lang: "dart",
          title: "LCS كنص",
          src: `import 'dart:math';

String lcsString(String a, String b) {
  final m = a.length, n = b.length;
  final dp = List.generate(m + 1, (_) => List<int>.filled(n + 1, 0));
  for (var i = 1; i <= m; i++) {
    for (var j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] == b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  final out = <String>[];
  var i = m, j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] == b[j - 1]) {
      out.add(a[i - 1]);                 // part of the answer
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return out.reversed.join();
}

void main() {
  print(lcsString('abcde', 'ace'));            // ace
  print(lcsString('AGGTAB', 'GXTXAYB'));       // GTAB
  print(lcsString('abc', 'def') == '');        // true
}`,
          note: "بنجمع الحروف بالعكس (من الآخر) فلازم <code>reversed</code> في الآخر. لو فيه أكتر من LCS بنطول واحد بنرجع واحدة منهم.",
        },
        {
          lang: "dart",
          title: "العناصر المختارة في knapsack",
          src: `import 'dart:math';

List<int> chosenItems(List<int> w, List<int> v, int cap) {
  final n = w.length;
  final dp = List.generate(n + 1, (_) => List<int>.filled(cap + 1, 0));
  for (var i = 1; i <= n; i++) {
    for (var c = 0; c <= cap; c++) {
      dp[i][c] = dp[i - 1][c];
      if (w[i - 1] <= c) {
        dp[i][c] = max(dp[i][c], dp[i - 1][c - w[i - 1]] + v[i - 1]);
      }
    }
  }
  final items = <int>[];
  var c = cap;
  for (var i = n; i >= 1; i--) {
    if (dp[i][c] != dp[i - 1][c]) {      // item i changed the value: taken
      items.add(i - 1);
      c -= w[i - 1];
    }
  }
  return items.reversed.toList();
}

void main() {
  print(chosenItems([1, 3, 4, 5], [1, 4, 5, 7], 7));   // [1, 2]
  print(chosenItems([5], [10], 3));                    // []
}`,
          note: "النتيجة هي الـ indexes (من الصفر): العنصر 1 والعنصر 2 (وزن 3 و4، قيمة 4 و5 = 9).",
        },
      ],
      interview: [
        { q: "إزاي تطلّع الحل نفسه مش بس القيمة في DP؟", a: "بحتفظ بالجدول كله وبمشي لورا من آخر خانة بنفس منطق الحساب: في كل خانة أشوف أنهي خيار وصّلني لقيمتها. في LCS لو الحرفين متساويين الحرف في الحل وبروح للقطر، وإلا للأكبر من فوق وشمال. في knapsack لو القيمة اختلفت عن الصف اللي فوقها يبقى العنصر اتاخد. بجمع الاختيارات وأقلبها لو مشيت بالعكس.",
        },
      ],
    },
    {
      kicker: "interval",
      title: "Interval DP بإيجاز: الجدول على مدى [i, j]",
      en: "Interval DP in brief",
      body: "<p>في النمط الخامس الـ state هو <b>مدى</b> <code>[i, j]</code> جوه المدخل (substring، أو مجموعة بالونات). بنحل الأمدية القصيرة الأول وبنبني عليها الأطول، فلف <code>i</code> من النهاية للبداية و<code>j</code> للأمام. المثال الأشهر: <b>أطول palindromic subsequence</b>: لو الحرفين الطرفين <code>s[i] == s[j]</code> نضيف 2 على اللي جوّا <code>dp[i+1][j-1]</code>، وإلا ناخد الأكبر من تشيل حرف من واحد من الطرفين.</p><p>في الإنترفيو المتوسط هتشوفه نادرا؛ اعرف إن الشكل ده موجود وإنه O(n^2) حالة × تكلفة الـ transition.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:math';

int longestPalinSubseq(String s) {
  final n = s.length;
  if (n == 0) return 0;
  // dp[i][j] = longest palindromic subsequence inside s[i..j]
  final dp = List.generate(n, (_) => List<int>.filled(n, 0));
  for (var i = n - 1; i >= 0; i--) {
    dp[i][i] = 1;
    for (var j = i + 1; j < n; j++) {
      if (s[i] == s[j]) {
        dp[i][j] = dp[i + 1][j - 1] + 2;
      } else {
        dp[i][j] = max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[0][n - 1];
}

void main() {
  print(longestPalinSubseq('bbbab'));   // 4  (bbbb)
  print(longestPalinSubseq('cbbd'));    // 2  (bb)
  print(longestPalinSubseq('a'));       // 1
  print(longestPalinSubseq('abcd'));    // 1
  print(longestPalinSubseq(''));        // 0
}`,
        note: "لما <code>j = i + 1</code> الخانة <code>dp[i+1][j-1]</code> هي <code>dp[i+1][i]</code> وقيمتها 0 (مدى فاضي) فالحرفين المتساويين المتجاورين بيدّوا 2. الزمن والمساحة O(n^2).",
      },
    },
    {
      kicker: "الحدود",
      title: "امتى DP هي الأداة الغلط، وإزاي تشرح حلك",
      en: "When DP is the wrong tool, and how to explain a DP solution",
      body: "<p><b>مش كل مسألة أمثل DP:</b></p>",
      points: [
        "<b>greedy كفاية</b> (وبرهانها موجود): Activity Selection بـ O(n log n) بدل جدول O(n^2). لا تستخدم DP على Coin Change لعملات canonical لو الجشع مثبت.",
        "<b>مفيش overlapping subproblems</b>: merge sort أو binary search هي divide and conquer. الـ memo هنا بتاخد ذاكرة من غير فايدة.",
        "<b>محتاج كل الحلول</b> مش القيمة أو العدد (كل التركيبات، كل الترتيبات): backtracking، لأن مفيش جدول بيطلّع قايمة الحلول من غير ما يعدها واحد واحد.",
        "<b>الـ state كبير</b>: n = 10^5 مع جدول n × n = 10^10 خانة، مستحيل. فكّر في state أصغر أو في greedy/binary search.",
        "<b>القيم ضخمة</b>: subset sum بـ target = 10^9 جدوله ضخم (pseudo-polynomial). محتاج طريقة تانية.",
      ],
      codes: [
        {
          lang: "text",
          title: "قالب شرح الحل في الإنترفيو (60 ثانية)",
          src: `1. "The naive recursion tries every choice, so it is exponential,
    and the same (i, j) state is solved many times."
2. "Let dp[i][j] be <meaning in one sentence>."
3. "If a[i-1] == b[j-1] then <...> otherwise <min/max of ...>."
4. "Base cases: dp[0][*] = ..., dp[*][0] = ..."
5. "I fill rows top to bottom. Answer is dp[m][n]."
6. "Time O(m*n), space O(m*n), reducible to O(n) with two rows."
7. Walk a tiny example on the board; then edge cases:
   empty input, single element, impossible case.`,
        },
      ],
      pitfall: "كتابة الكود قبل تعريف الـ state بجملة. المحاور بيدوّر على الجملة دي: «dp[i][j] معناها...». لو بدأت بالكود فهو شايف إنك حافظ مش فاهم، ولو الـ state غلط هتضيع الوقت في تعديلات صغيرة بدل ما تصلحه من الجذر.",
      interview: [
        { q: "امتى مينفعش تستخدم DP؟", a: "لما الجشع مثبت (Activity Selection)، أو مفيش حالات فرعية متكررة (divide and conquer)، أو المطلوب كل الحلول (backtracking)، أو الـ state كبير جدا لدرجة إن الجدول مش هيتحمل، أو القيم ضخمة (subset sum بـ target بالمليارات). وأقول كده للمحاور: بحدد الأداة على حسب المسألة مش بحل كل حاجة بـ DP.",
        },
        { q: "إزاي تشرح حل DP للمحاور؟", a: "أبدأ بالـ recursion الساذجة وأوريه إنها أسية بسبب التكرار. بعدين أعرّف الـ state بجملة، والـ transition والـ base cases، وأختار top-down أو bottom-up. أرسم الجدول على مثال صغير، وأقول الزمن والمساحة وإمكانية تقليلها، وأختم بحالات الحافة (فاضي، عنصر واحد، مستحيل).",
        },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: knapsack بصف واحد",
      lang: "dart",
      code: `import 'dart:math';

int knapsack(List<int> w, List<int> v, int cap) {
  final dp = List<int>.filled(cap + 1, 0);
  for (var i = 0; i < w.length; i++) {
    for (var c = cap; c >= w[i]; c--) {
      dp[c] = max(dp[c], dp[c - w[i]] + v[i]);
    }
  }
  return dp[cap];
}`,
      note: "السعة بتتلف من الكبير للصغير علشان العنصر يتاخد مرة.",
    },
    {
      title: "اكتب: Unique Paths",
      lang: "dart",
      code: `int uniquePaths(int m, int n) {
  final dp = List.generate(m, (_) => List<int>.filled(n, 1));
  for (var r = 1; r < m; r++) {
    for (var c = 1; c < n; c++) {
      dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
    }
  }
  return dp[m - 1][n - 1];
}`,
      note: "أول صف وأول عمود = 1، والباقي فوق + شمال.",
    },
    {
      title: "اكتب: Longest Common Subsequence",
      lang: "dart",
      code: `import 'dart:math';

int lcsLength(String a, String b) {
  final dp = List.generate(
      a.length + 1, (_) => List<int>.filled(b.length + 1, 0));
  for (var i = 1; i <= a.length; i++) {
    for (var j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] == b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}`,
      note: "متساويين: القطر + 1. مختلفين: max(فوق، شمال).",
    },
  ],

  tasks: [
    {
      title: "Unique Paths مع عوائق",
      lang: "dart",
      prompt: "<p>شبكة <code>grid</code> فيها <code>0</code> خانة فاضية و<code>1</code> عائق. روبوت من فوق-شمال لتحت-يمين بحركة يمين أو تحت، ومينفعش يدخل خانة عائق. اكتب <code>int uniquePathsWithObstacles(List&lt;List&lt;int&gt;&gt; grid)</code> ترجع عدد الطرق (0 لو البداية أو النهاية عائق).</p>",
      examples: [
        { in: "uniquePathsWithObstacles([[0, 0, 0], [0, 1, 0], [0, 0, 0]])", out: "2" },
        { in: "uniquePathsWithObstacles([[0, 1], [0, 0]])", out: "1" },
        { in: "uniquePathsWithObstacles([[1]])", out: "0" },
      ],
      starter: `int uniquePathsWithObstacles(List<List<int>> grid) {
  // your code
}`,
      hints: [
        "<code>dp[r][c]</code> = عدد الطرق للخانة. لو الخانة عائق فهي 0.",
        "البداية = 1 (لو مش عائق). كل خانة غير العائق: فوق + شمال (مع الحدود: 0 لو خارج الشبكة).",
      ],
      solution: `int uniquePathsWithObstacles(List<List<int>> grid) {
  if (grid.isEmpty || grid[0].isEmpty) return 0;
  final m = grid.length, n = grid[0].length;
  final dp = List.generate(m, (_) => List<int>.filled(n, 0));
  for (var r = 0; r < m; r++) {
    for (var c = 0; c < n; c++) {
      if (grid[r][c] == 1) {
        dp[r][c] = 0;
      } else if (r == 0 && c == 0) {
        dp[r][c] = 1;
      } else {
        final fromTop = r > 0 ? dp[r - 1][c] : 0;
        final fromLeft = c > 0 ? dp[r][c - 1] : 0;
        dp[r][c] = fromTop + fromLeft;
      }
    }
  }
  return dp[m - 1][n - 1];
}`,
      explain: "نفس Unique Paths بس العائق بيصفّر الخانة، فمفيش طرق بتعدي منها. الحدود (r > 0 / c > 0) بتغني عن تهيئة الصف الأول بالـ 1 (علشان عائق في الصف الأول يقطع كل اللي بعده). الزمن والمساحة O(m × n).",
    },
    {
      title: "أطول substring مشتركة",
      lang: "dart",
      prompt: "<p>اكتب <code>int longestCommonSubstring(String a, String b)</code> ترجع طول أطول substring (حروف <b>متجاورة</b>) موجودة في الاتنين.</p>",
      examples: [
        { in: "longestCommonSubstring('abcdxyz', 'xyzabcd')", out: "4" },
        { in: "longestCommonSubstring('abc', 'def')", out: "0" },
        { in: "longestCommonSubstring('zxabcdezy', 'yzabcdezx')", out: "6" },
      ],
      starter: `int longestCommonSubstring(String a, String b) {
  // your code
}`,
      hints: [
        "شبه LCS لكن <code>dp[i][j]</code> = طول أطول substring مشتركة <b>بتنتهي</b> عند a[i-1] و b[j-1].",
        "لو الحرفين متساويين <code>dp[i-1][j-1] + 1</code>، وغير كده <b>صفر</b> (الاتصال انقطع).",
        "الإجابة أكبر قيمة في الجدول كله مش آخر خانة.",
      ],
      solution: `int longestCommonSubstring(String a, String b) {
  final m = a.length, n = b.length;
  final dp = List.generate(m + 1, (_) => List<int>.filled(n + 1, 0));
  var best = 0;
  for (var i = 1; i <= m; i++) {
    for (var j = 1; j <= n; j++) {
      if (a[i - 1] == b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        if (dp[i][j] > best) best = dp[i][j];
      }
    }
  }
  return best;
}`,
      explain: "الفرق عن LCS: عند عدم التساوي بنسيب الخانة 0 لأن الـ substring لازم متصلة. وتعريف «بتنتهي عند» هو السبب إن الإجابة max مش dp[m][n] (زي LIS في a9). الزمن والمساحة O(m × n).",
    },
    {
      title: "عدد المجموعات الفرعية بمجموع معين",
      lang: "dart",
      prompt: "<p>اكتب <code>int countSubsets(List&lt;int&gt; nums, int target)</code> ترجع عدد المجموعات الفرعية (حسب المواضع، يعني نفس القيمة في مكانين تتعد مجموعتين مختلفتين) اللي مجموعها <code>target</code>. الأرقام موجبة. المجموعة الفاضية مجموعها 0.</p>",
      examples: [
        { in: "countSubsets([1, 2, 3, 3], 6)", out: "3" },
        { in: "countSubsets([1, 1, 1], 2)", out: "3" },
        { in: "countSubsets([2], 1)", out: "0" },
        { in: "countSubsets([], 0)", out: "1" },
      ],
      starter: `int countSubsets(List<int> nums, int target) {
  // your code
}`,
      hints: [
        "نفس subset sum لكن <code>dp[s]</code> = عدد الطرق بدل true/false.",
        "<code>dp[0] = 1</code>. لكل رقم x ولكل s من target لـ x بالعكس: <code>dp[s] += dp[s - x]</code>.",
      ],
      solution: `int countSubsets(List<int> nums, int target) {
  if (target < 0) return 0;
  final dp = List<int>.filled(target + 1, 0);
  dp[0] = 1;
  for (final x in nums) {
    for (var s = target; s >= x; s--) {
      dp[s] += dp[s - x];
    }
  }
  return dp[target];
}`,
      explain: "0/1 knapsack بعدّ بدل boolean: كل رقم إما داخل المجموعة (<code>dp[s - x]</code> طريقة) أو لأ (الخانة زي ما هي). اللف بالعكس علشان الرقم يتاخد مرة. [1,2,3,3] والهدف 6: {1,2,3} بالتلاتة الأولى، {1,2,3} بالتلاتة التانية، {3,3}. الزمن O(n × target).",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `int uniquePaths(int m, int n) {
  final dp = List.generate(m, (_) => List<int>.filled(n, 1));
  for (var r = 1; r < m; r++) {
    for (var c = 1; c < n; c++) {
      dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
    }
  }
  return dp[m - 1][n - 1];
}

void main() {
  print(uniquePaths(3, 4));
}` },
      answer: ["10"],
      why: "الصف الأول 1 1 1 1، التاني 1 2 3 4، التالت 1 3 6 10. الإجابة في آخر خانة: 10.",
    },
    {
      q: "إيه الفرق بين LCS (subsequence) وlongest common substring في الجدول؟",
      options: [
        "مفيش فرق، نفس الكود",
        "الـ substring بتستخدم جدول أكبر",
        "في الـ substring لما الحرفين يختلفوا الخانة بتتصفر (الاتصال انقطع) والإجابة max الجدول، وفي LCS بناخد max(فوق، شمال)",
        "في الـ substring بنستخدم recursion فقط",
      ],
      answer: 2,
      why: "الفرق في حالة عدم التساوي: LCS بتحتفظ بأحسن قيمة من الجيران لأن الحروف ممكن تتباعد، لكن الـ substring لازم تفضل متصلة فبتبدأ من صفر.",
    },
    {
      q: "أقل عدد عمليات (إدراج/حذف/استبدال) لتحويل <code>kitten</code> إلى <code>sitting</code>؟",
      answer: ["3"],
      why: "استبدل k بـ s، استبدل e بـ i، أضف g في الآخر = 3 عمليات.",
    },
    {
      q: "ليه 0/1 knapsack بصف واحد بيلف على السعة من الكبير للصغير؟",
      options: [
        "علشان <code>dp[c - w]</code> يفضل قيمته «قبل العنصر الحالي»، فالعنصر ميتاخدش أكتر من مرة",
        "علشان يلف أسرع",
        "علشان الجدول بيبدأ من آخر خانة",
        "مفيش سبب، الاتجاهين نفس النتيجة",
      ],
      answer: 0,
      why: "لو لفينا للأمام، <code>dp[c - w]</code> بيكون اتحدث بنفس العنصر فيتحسب مرتين (unbounded knapsack). مثلا عنصر (3، 4) وسعة 7 يطلع 8 بدل 4.",
    },
    {
      q: "أكبر قيمة في knapsack: الأوزان [2, 3, 4]، القيم [3, 4, 5]، السعة 5؟",
      answer: ["7"],
      why: "العنصر 1 والعنصر 2 (وزن 2 + 3 = 5، قيمة 3 + 4 = 7). العنصر 3 لوحده (وزن 4) قيمته 5 بس.",
    },
    {
      q: "في جدول LCS بين a وb، إيه معنى <code>dp[i][j]</code>؟",
      options: [
        "طول الـ LCS بين a[i] وb[j] بالحرف",
        "عدد الحروف المختلفة بين النصين",
        "عدد المرات اللي ظهر فيها الحرف i في b",
        "طول الـ LCS بين أول i حرف من a وأول j حرف من b",
      ],
      answer: 3,
      why: "الصف والعمود صفر يمثلوا النص الفاضي. الجدول (m+1) × (n+1) علشان كده. باقي الخيارات مش بتحقق transition سليم.",
    },
    {
      q: "في Edit Distance لما الحرفين مختلفين، التلات جيران (القطر، فوق، شمال) بيمثلوا إيه بالترتيب؟",
      options: [
        "إدراج، حذف، استبدال",
        "استبدال، حذف حرف من a، إدراج حرف في a",
        "حذف، حذف، استبدال",
        "كلهم استبدال",
      ],
      answer: 1,
      why: "القطر <code>dp[i-1][j-1]</code> استبدال، فوق <code>dp[i-1][j]</code> حذف حرف من a، شمال <code>dp[i][j-1]</code> إدراج حرف (يطابق b[j-1]). وبنضيف 1 على أقلهم.",
    },
    {
      q: "تعقيد الزمن والمساحة لـ LCS بجدول كامل لنصين طولهم m وn؟",
      options: [
        "O(m + n)",
        "O(m × n) زمن وO(m) مساحة دايما",
        "O(m × n) زمن ومساحة، وبتتقلل المساحة لصفين لو مش محتاج تبني الحل",
        "O(2^(m+n))",
      ],
      answer: 2,
      why: "عدد الخانات (m+1)(n+1) وكل خانة O(1). لو محتاج الطول بس تحتفظ بصفين. لو محتاج النص نفسه محتاج الجدول كله للمشي لورا.",
    },
    {
      q: "أي مسألة من دول مش مناسبة لـ DP؟",
      options: [
        "طباعة كل التركيبات الممكنة لتكوين مبلغ (كل الحلول)",
        "عدد التركيبات لتكوين مبلغ",
        "أقل عدد عملات لتكوين مبلغ",
        "هل ينفع تقسيم الأرقام نصين متساويين",
      ],
      answer: 0,
      why: "لما المطلوب كل الحلول نفسها، التكلفة أسية بطبيعة الناتج، والـ backtracking هو الأداة. الباقي بيسأل عن عدد أو أقل/أكبر قيمة أو نعم/لأ، وده شغل DP.",
    },
    {
      q: "هل <code>canPartition([1, 2, 5])</code> ترجع true ولا false؟",
      answer: ["false"],
      why: "المجموع 8 فالنصف 4. المجموعات الفرعية الممكنة مجموعها 0 أو 1 أو 2 أو 3 أو 5 أو 6 أو 7 أو 8، ومفيش ولا واحدة مجموعها 4.",
    },
  ],
};
