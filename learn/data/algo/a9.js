window.LEVELS = window.LEVELS || {};
window.LEVELS["algo/a9"] = {
  slides: [
    {
      kicker: "ليه DP",
      title: "نفس الحسبة بتتعمل ألف مرة",
      en: "Overlapping subproblems and optimal substructure",
      body: "<p>الـ Dynamic Programming (DP) مش خوارزمية، هي <b>أسلوب</b>: تحل مسألة كبيرة بحل مسائل فرعية أصغر، وتحفظ نتيجة كل مسألة فرعية علشان متحسبهاش تاني. بتنفع لما المسألة فيها خاصيتين:</p><p><b>(1) Overlapping subproblems</b>: نفس المسألة الفرعية بتتطلب أكتر من مرة. <b>(2) Optimal substructure</b>: الحل الأمثل للمسألة الكبيرة بيتبني من حلول مثلى للأصغر. لو الخاصية الأولى مش موجودة، الـ divide and conquer (زي merge sort) كفاية. ولو الثانية مش موجودة، DP مش هتشتغل.</p><p>مثال الأوضح: <code>fib(n) = fib(n-1) + fib(n-2)</code>. الكود الساذج بينده <code>fib(18)</code> مرتين، و<code>fib(17)</code> تلات مرات، وهكذا. العدد بيكبر أسيا (≈ 1.6^n). تخزين النتيجة بيحوله لخطي.</p>",
      code: {
        lang: "dart",
        title: "عدّاد نداءات: الساذج مقابل memo",
        src: `int calls = 0;

int fib(int n) {
  calls++;
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

int fibMemo(int n, Map<int, int> memo) {
  calls++;
  if (n < 2) return n;
  final cached = memo[n];
  if (cached != null) return cached;
  return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
}

void main() {
  print(fib(10));        // 55
  print(calls);          // 177
  calls = 0;
  fib(20);
  print(calls);          // 21891
  calls = 0;
  print(fibMemo(20, {})); // 6765
  print(calls);          // 39
}`,
        note: "fib(20) محتاجة 21891 نداء بالطريقة الساذجة، و39 بالـ memo. وfib(40) الساذجة محتاجة أكتر من 300 مليون نداء.",
      },
      terms: [
        ["overlapping subproblems", "مسائل فرعية متكررة", "نفس الحالة الفرعية بتتحسب أكتر من مرة في الشجرة."],
        ["optimal substructure", "البنية المثلى", "الحل الأمثل للكبيرة مبني من حلول مثلى للأصغر."],
      ],
      interview: [
        { q: "إمتى DP تنفع؟", a: "لما المسألة فيها overlapping subproblems (نفس الحالة الفرعية بتتكرر) وoptimal substructure (الحل الأمثل مبني من حلول مثلى للأجزاء الأصغر). علامات عملية: بتسأل عن عدد الطرق أو أقل/أكبر قيمة، والحل الساذج بالـ recursion أسي لأن الحالات بتتكرر.",
        },
      ],
    },
    {
      kicker: "الرحلة",
      title: "من recursion ساذجة لـ memo لـ table لـ O(1) مساحة",
      en: "Naive, memoization, tabulation, space optimisation on Fibonacci",
      body: "<p>أربع نسخ لنفس المسألة، وكل واحدة خطوة:</p>",
      points: [
        "<b>الساذجة</b>: recursion مباشرة من العلاقة. بسيطة، أسية.",
        "<b>Memoization (top-down)</b>: نفس الـ recursion + <code>Map</code> أو list تخزن كل نتيجة. بنزود سطرين وبنكسب الخطي.",
        "<b>Tabulation (bottom-up)</b>: من غير recursion. نملا جدول <code>dp</code> من الأصغر للأكبر بلوب. أسهل في التحكم بالذاكرة ومفيش خطر stack overflow.",
        "<b>Space optimisation</b>: <code>dp[i]</code> بتعتمد على اللي قبلها بخطوتين بس، يبقى منحتفظش بالجدول كله، متغيرين بيكفوا.",
      ],
      code: {
        lang: "dart",
        src: `int fibNaive(int n) => n < 2 ? n : fibNaive(n - 1) + fibNaive(n - 2);

int fibMemo(int n) {
  final memo = <int, int>{};
  int go(int k) {
    if (k < 2) return k;
    return memo[k] ??= go(k - 1) + go(k - 2);
  }
  return go(n);
}

int fibTab(int n) {
  if (n < 2) return n;
  final dp = List<int>.filled(n + 1, 0);
  dp[1] = 1;
  for (var i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

int fibO1(int n) {
  var a = 0, b = 1;                  // fib(0), fib(1)
  for (var i = 0; i < n; i++) {
    final next = a + b;
    a = b;
    b = next;
  }
  return a;
}

void main() {
  print(fibNaive(15));   // 610
  print(fibMemo(15));    // 610
  print(fibTab(15));     // 610
  print(fibO1(15));      // 610
  print(fibO1(0));       // 0
  print(fibTab(50));     // 12586269025
}`,
        note: "الزمن: الساذجة أسي، والتلاتة التانيين O(n). المساحة: memo وtab هي O(n)، وfibO1 هي O(1). ملاحظة: الـ int في Dart على الجهاز 64 بت، فـ fib(93) بتطلع عن الحد.",
      },
      codes: [
        {
          lang: "text",
          title: "الجدول fibTab(7) سطر سطر",
          src: `i      0  1  2  3  4  5  6  7
dp[i]  0  1  1  2  3  5  8  13

dp[2] = dp[1] + dp[0] = 1
dp[3] = dp[2] + dp[1] = 2
...
dp[7] = dp[6] + dp[5] = 8 + 5 = 13`,
        },
      ],
      interview: [
        { q: "إيه الفرق بين memoization وtabulation؟", a: "الاتنين بيخزنوا نتايج الحالات الفرعية وبنفس التعقيد. memoization top-down: بكتب recursion وأخزن النتيجة (بتحسب بس الحالات اللي محتاجها فعلا). tabulation bottom-up: بملا جدول من الحالات الأصغر للأكبر بلوب، من غير recursion فمفيش خطر stack overflow وسهل أقلل المساحة. بتبدأ بالأولى لأن أسهل في التفكير، وتحول للتانية لو محتاج.",
        },
      ],
    },
    {
      kicker: "الوصفة",
      title: "عرّف الـ state بالكلام الأول: Climbing Stairs",
      en: "Define the state and transition in words",
      body: "<p>أهم نصيحة في DP: <b>قبل أي كود</b>، اكتب بكلام عادي معنى خانة الجدول. الوصفة اللي هنكررها في كل مسألة:</p>",
      points: [
        "<b>1. الـ state</b>: «<code>dp[i]</code> هو ___ بالنسبة لأول i عنصر / للمبلغ i / للنهاية اللي في i».",
        "<b>2. الـ transition</b>: إزاي بحسب <code>dp[i]</code> من خانات أصغر؟ (آخر قرار ممكن إيه؟)",
        "<b>3. الـ base cases</b>: الخانات اللي بعرف إجابتها من غير حساب.",
        "<b>4. الترتيب</b>: أمشي بأي اتجاه علشان اللي محتاجه يكون اتحسب.",
        "<b>5. مكان الإجابة</b>: <code>dp[n]</code> ولا أكبر قيمة في الجدول؟",
      ],
      code: {
        lang: "dart",
        title: "Climbing Stairs: تطلع سلم بـ 1 أو 2 خطوة، كام طريقة؟",
        src: `// dp[i] = number of ways to stand on step i
// dp[i] = dp[i - 1] + dp[i - 2]   (last move was 1 step or 2 steps)
// dp[0] = 1 (start), dp[1] = 1
int climbStairs(int n) {
  final dp = List<int>.filled(n + 2, 0);
  dp[0] = 1;
  dp[1] = 1;
  for (var i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

void main() {
  print(climbStairs(0));    // 1
  print(climbStairs(1));    // 1
  print(climbStairs(2));    // 2
  print(climbStairs(3));    // 3
  print(climbStairs(5));    // 8
  print(climbStairs(10));   // 89
}`,
        note: "نفس فيبوناتشي بإزاحة: آخر خطوة إما 1 (من i-1) أو 2 (من i-2) والاتنين مسارات مختلفة فبنجمع. الحجم <code>n + 2</code> علشان <code>dp[1]</code> موجود حتى لو n = 0.",
      },
      codes: [
        {
          lang: "text",
          title: "الجدول لـ n = 5",
          src: `step   0  1  2  3  4  5
dp     1  1  2  3  5  8      answer: dp[5] = 8`,
        },
      ],
      focus: [{ label: "احفظها", text: "اكتب جملة: «dp[i] = ...» بالكلام قبل الكود. لو معرفتش تكملها بجملة واضحة، الـ state غلط." }],
      interview: [
        { q: "إزاي بتبدأ تحل مسألة DP جديدة؟", a: "بحدد الـ state بجملة: dp[i] معناها إيه بالظبط. وبسأل: آخر قرار في الحل ممكن يكون إيه؟ ومن كل قرار حالة أصغر، وده بيديني الـ transition. بعدين الـ base cases واتجاه الحساب ومكان الإجابة. بجرب على مثال صغير بإيدي وبرسم الجدول قبل ما أكتب كود.",
        },
      ],
    },
    {
      kicker: "قرار: خد ولا سيب",
      title: "House Robber",
      en: "House robber",
      body: "<p>بيوت في صف، <code>nums[i]</code> فلوس البيت i، ومينفعش تسرق بيتين متجاورين. أكبر مبلغ؟ <b>State:</b> <code>dp[i]</code> = أكبر مبلغ من أول <code>i</code> بيت. <b>Transition:</b> بالنسبة للبيت رقم i (الأخير): أسيبه فـ<code>dp[i-1]</code>، أو آخده فمعاه <code>dp[i-2]</code> (لأن i-1 اتمنع) + فلوس البيت. بنختار الأكبر. دايما سؤال «خد ولا سيب؟».</p>",
      code: {
        lang: "dart",
        src: `import 'dart:math';

int rob(List<int> nums) {
  final n = nums.length;
  final dp = List<int>.filled(n + 1, 0);    // dp[i]: best using first i houses
  for (var i = 1; i <= n; i++) {
    final take = (i >= 2 ? dp[i - 2] : 0) + nums[i - 1];
    dp[i] = max(dp[i - 1], take);            // skip it, or take it
  }
  return dp[n];
}

void main() {
  print(rob([2, 7, 9, 3, 1]));   // 12
  print(rob([1, 2, 3, 1]));      // 4
  print(rob([5]));               // 5
  print(rob([]));                // 0
  print(rob([2, 1, 1, 2]));      // 4
}`,
        note: "الجواب 12 = 2 + 9 + 1. الزمن O(n) والمساحة O(n) وبتتحول لـ O(1) في شريحة المساحة.",
      },
      codes: [
        {
          lang: "text",
          title: "الجدول لـ [2, 7, 9, 3, 1]",
          src: `i        0  1  2   3   4   5
house       2  7   9   3   1
dp[i]    0  2  7   11  11  12

dp[1] = max(dp[0], 0 + 2)  = 2
dp[2] = max(dp[1], dp[0]+7) = 7
dp[3] = max(dp[2], dp[1]+9) = 11
dp[4] = max(dp[3], dp[2]+3) = 11      (10 < 11, skip)
dp[5] = max(dp[4], dp[3]+1) = 12`,
          note: "تقدر تقرا الجدول بإيدك: كل خانة تقارن «سيبته» (اللي فوقها) بـ «خدته» (من خانتين فاتوا + قيمته).",
        },
      ],
      interview: [
        { q: "حل House Robber واشرح الـ state والـ transition.", a: "<code>dp[i]</code> هو أكبر مبلغ من أول i بيت. للبيت i يا أسيبه فالمبلغ <code>dp[i-1]</code>، يا آخده فالمبلغ <code>dp[i-2] + nums[i-1]</code>. باخد الأكبر. الـ base: dp[0] = 0. الزمن O(n)، والمساحة O(n) وبتتحول لـ O(1) لأن بحتاج آخر خانتين بس.",
        },
      ],
    },
    {
      kicker: "الأقل",
      title: "Coin Change: أقل عدد عملات",
      en: "Coin change, minimum coins",
      body: "<p>في a8 شفت إن الجشع بيغلط. DP بتحلها. <b>State:</b> <code>dp[a]</code> = أقل عدد عملات لتكوين المبلغ <code>a</code>. <b>Transition:</b> آخر عملة ممكن تكون أي عملة <code>c</code> أصغر من أو تساوي a، فـ <code>dp[a] = 1 + min(dp[a - c])</code> على كل العملات. <b>Base:</b> <code>dp[0] = 0</code>. باقي الخانات بتبدأ بـ «مستحيل» (<code>amount + 1</code>، رقم أكبر من أي إجابة ممكنة). في الآخر لو الخانة لسه «مستحيل» نرجع -1.</p>",
      code: {
        lang: "dart",
        src: `int coinChange(List<int> coins, int amount) {
  final inf = amount + 1;                         // "impossible"
  final dp = List<int>.filled(amount + 1, inf);
  dp[0] = 0;
  for (var a = 1; a <= amount; a++) {
    for (final c in coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    }
  }
  return dp[amount] >= inf ? -1 : dp[amount];
}

void main() {
  print(coinChange([1, 2, 5], 11));   // 3  (5 + 5 + 1)
  print(coinChange([1, 3, 4], 6));    // 2  (3 + 3)
  print(coinChange([2], 3));          // -1
  print(coinChange([1], 0));          // 0
  print(coinChange([], 0));           // 0
}`,
        note: "الزمن O(amount × عدد العملات) والمساحة O(amount). السبب إن <code>inf = amount + 1</code> آمن إن مفيش حل يستخدم أكتر من amount عملة (أصغر عملة 1).",
      },
      codes: [
        {
          lang: "text",
          title: "الجدول لـ coins = [1, 3, 4] و amount = 6",
          src: `a      0  1  2  3  4  5  6
dp[a]  0  1  2  1  1  2  2

dp[2] = dp[1] + 1 = 2
dp[3] = min(dp[2]+1, dp[0]+1) = 1        coin 3
dp[4] = min(dp[3]+1, dp[1]+1, dp[0]+1) = 1   coin 4
dp[5] = min(dp[4]+1, dp[2]+1, dp[1]+1) = 2
dp[6] = min(dp[5]+1, dp[3]+1, dp[2]+1) = 2   coin 3 then dp[3]`,
          note: "الجشع كان رجّع 3 (4+1+1). الجدول بيجرب كل عملة لكل مبلغ فبيلاقي 3+3 = 2.",
        },
      ],
      pitfall: "تهيئة الجدول بـ 0 في مسألة «أقل» بتخلي كل شيء 0 (مفيش عملات!). لازم قيمة «مستحيل» كبيرة. وعكسها في مسائل «أكبر»: ابدأ بـ سالب كبير أو بـ 0 حسب المعنى.",
      interview: [
        { q: "حل Coin Change (أقل عدد عملات) بالـ DP.", a: "<code>dp[a]</code> أقل عدد عملات لتكوين a. الـ base <code>dp[0] = 0</code> والباقي مستحيل (amount + 1). لكل مبلغ a ولكل عملة c ≤ a: <code>dp[a] = min(dp[a], dp[a - c] + 1)</code>. لو dp[amount] لسه مستحيل أرجع -1. الزمن O(amount × k) والمساحة O(amount). الجشع بيغلط مع عملات زي [1,3,4] والمبلغ 6.",
        },
      ],
    },
    {
      kicker: "العدد",
      title: "Coin Change II: عدد الطرق، وترتيب اللوبين بيفرق",
      en: "Coin change, number of ways",
      body: "<p>هنا السؤال «كام طريقة» لتكوين المبلغ (التركيبة <code>[1,2]</code> و<code>[2,1]</code> بنفس الطريقة، يعني <b>combinations</b>). <b>State:</b> <code>dp[a]</code> = عدد طرق تكوين a. <b>Base:</b> <code>dp[0] = 1</code> (طريقة واحدة: متاخدش حاجة). اللف على <b>العملات في الخارج</b> والمبالغ جوه: كل عملة بتتضاف بعد اللي قبلها فمفيش ترتيب مختلف بيتحسب.</p><p>لو عكست اللوبين (المبالغ برا والعملات جوه) هتعد كمان <b>الترتيبات</b> (permutations) فبتتحول المسألة لـ «عدد التسلسلات»، وده مسألة تانية. غلطة شائعة جدا.</p>",
      code: {
        lang: "dart",
        src: `// combinations: coins outside
int change(int amount, List<int> coins) {
  final dp = List<int>.filled(amount + 1, 0);
  dp[0] = 1;
  for (final c in coins) {
    for (var a = c; a <= amount; a++) {
      dp[a] += dp[a - c];
    }
  }
  return dp[amount];
}

// permutations (ordered sequences): amounts outside
int countSequences(int amount, List<int> coins) {
  final dp = List<int>.filled(amount + 1, 0);
  dp[0] = 1;
  for (var a = 1; a <= amount; a++) {
    for (final c in coins) {
      if (c <= a) dp[a] += dp[a - c];
    }
  }
  return dp[amount];
}

void main() {
  print(change(5, [1, 2, 5]));           // 4
  print(countSequences(5, [1, 2, 5]));   // 9
  print(change(3, [2]));                 // 0
  print(change(0, [7]));                 // 1
}`,
        note: "الـ 4 طرق: 5، 2+2+1، 2+1+1+1، 1+1+1+1+1. الـ 9 تسلسلات بتعد 2+2+1 وترتيباتها (3)، و2+1+1+1 وترتيباتها (4)، و5 وواحد كله 1.",
      },
      codes: [
        {
          lang: "text",
          title: "الجدول لـ change(5, [1, 2, 5]) بعد كل عملة",
          src: `a                0  1  2  3  4  5
start            1  0  0  0  0  0
after coin 1     1  1  1  1  1  1
after coin 2     1  1  2  2  3  3
after coin 5     1  1  2  2  3  4      answer dp[5] = 4`,
        },
      ],
      interview: [
        { q: "ليه ترتيب اللوبين في Coin Change II مهم؟", a: "لو العملات في اللوب الخارجي فكل عملة بتتضاف في مرحلة واحدة بعد اللي قبلها، فكل تركيبة (combination) بتتعد مرة واحدة. لو المبالغ في الخارجي والعملات جوه فالتركيبة نفسها بترتيبات مختلفة بتتعد مرات (permutations). المسألة الأولى «كام تركيبة» والتانية «كام تسلسل»، وكل واحدة ليها سؤالها.",
        },
      ],
    },
    {
      kicker: "الأطول",
      title: "Longest Increasing Subsequence بـ O(n^2)",
      en: "Longest increasing subsequence",
      body: "<p>أطول subsequence (عناصر بالترتيب بس مش لازم متجاورة) متزايدة بشدة. <b>State:</b> <code>dp[i]</code> = طول أطول subsequence متزايدة <b>بتنتهي</b> عند العنصر i. (لازم «بتنتهي عند i»، مش «أطول لحد i»: الأخيرة مش بتديك طريقة تكمل.) <b>Transition:</b> أي <code>j &lt; i</code> قيمتها أصغر من <code>nums[i]</code> ممكن نكمل بعدها: <code>dp[i] = 1 + max(dp[j])</code>. أو 1 لو مفيش. <b>الإجابة:</b> أكبر قيمة في الجدول (مش آخر خانة).</p>",
      code: {
        lang: "dart",
        src: `int lengthOfLIS(List<int> nums) {
  if (nums.isEmpty) return 0;
  final dp = List<int>.filled(nums.length, 1);   // each element alone
  var best = 1;
  for (var i = 1; i < nums.length; i++) {
    for (var j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
    }
    if (dp[i] > best) best = dp[i];
  }
  return best;
}

void main() {
  print(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]));   // 4
  print(lengthOfLIS([0, 1, 0, 3, 2, 3]));             // 4
  print(lengthOfLIS([7, 7, 7]));                      // 1
  print(lengthOfLIS([]));                             // 0
}`,
        note: "الزمن O(n^2) والمساحة O(n). فيه نسخة O(n log n) بتحتفظ بأصغر ذيل لكل طول وبتستخدم binary search من a3، بس O(n^2) هي اللي بيتوقعوها كأول حل.",
      },
      codes: [
        {
          lang: "text",
          title: "الجدول لـ [10, 9, 2, 5, 3, 7, 101, 18]",
          src: `i       0   1   2   3   4   5   6    7
nums    10  9   2   5   3   7   101  18
dp      1   1   1   2   2   3   4    4

dp[3]: 5 > 2   -> dp[2]+1 = 2
dp[4]: 3 > 2   -> 2
dp[5]: 7 > 5, 3, 2 -> max(dp[3], dp[4], dp[2]) + 1 = 3
dp[6]: 101 > everything before -> max(...) + 1 = 4
dp[7]: 18 > 10,9,2,5,3,7 -> dp[5] + 1 = 4
answer = max(dp) = 4   (e.g. 2, 5, 7, 101)`,
        },
      ],
      pitfall: "رجوع <code>dp[n-1]</code> بدل <code>max(dp)</code> غلط: في <code>[1, 2, 3, 0]</code> آخر خانة <code>dp[3]</code> = 1 (العنصر 0 بيبدأ من جديد) لكن الجواب الصح 3.",
      interview: [
        { q: "حل Longest Increasing Subsequence وإيه تعريف الـ state؟", a: "<code>dp[i]</code> هو طول أطول subsequence متزايدة بتنتهي عند العنصر i. لكل j قبل i لو <code>nums[j] &lt; nums[i]</code> أحدّث <code>dp[i] = max(dp[i], dp[j] + 1)</code>. والإجابة هي أكبر قيمة في الجدول مش آخر خانة. الزمن O(n^2) والمساحة O(n)، ولو طلبوا أحسن فيه O(n log n) بالـ binary search.",
        },
      ],
    },
    {
      kicker: "تحسين",
      title: "تقليل المساحة وقراءة الجدول بإيدك",
      en: "Space optimisation and reading the table",
      body: "<p>قاعدة التحسين: لو <code>dp[i]</code> بتعتمد على آخر <code>k</code> خانات بس، احتفظ بـ <code>k</code> متغيرات بدل الجدول (House Robber و Climbing Stairs و Fibonacci). لو بتعتمد على خانات بعيدة (Coin Change بيرجع <code>c</code> خطوة لورا لكل عملة)، الجدول لازم يفضل كله.</p><p>وقبل ما تكتب كود، <b>املا الجدول بإيدك</b> على مثال صغير (5 أو 6 خانات). ده هو اللي بيكشف الـ base case الناقص والاتجاه الغلط. وهو برضه اللي بتعمله على الورقة أو السبورة في الإنترفيو.</p>",
      code: {
        lang: "dart",
        title: "House Robber بمتغيرين",
        src: `import 'dart:math';

int robO1(List<int> nums) {
  var prev2 = 0, prev1 = 0;          // best up to i-2 and up to i-1
  for (final x in nums) {
    final cur = max(prev1, prev2 + x);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}

void main() {
  print(robO1([2, 7, 9, 3, 1]));   // 12
  print(robO1([1, 2, 3, 1]));      // 4
  print(robO1([]));                // 0
}`,
        note: "نفس النتيجة بمساحة O(1). الترتيب مهم: نحسب <code>cur</code> الأول وبعدين ننقل المتغيرين.",
      },
      points: [
        "الجدول بيتقرا: كل خانة بتعتمد على مين؟ لو مفيش سهم رجوع للخانة المطلوبة، فيه base case ناقص.",
        "<b>Top-down vs bottom-up</b>: top-down بتحسب بس اللي محتاجه لكن عمق الـ recursion ممكن يوصل لـ n (خطر stack overflow لـ n كبير). bottom-up أسرع شوية ومفيهاش stack وسهل تقلل المساحة.",
        "كل خانة جدول = state. عدد الخانات × تكلفة الـ transition = التعقيد.",
      ],
    },
    {
      kicker: "إنترفيو",
      title: "الأخطاء الشائعة وإزاي تشرح الحل",
      en: "Common mistakes and how to present a DP solution",
      body: "<p>لما تحل DP قدام محاور، رتب كلامك بنفس الوصفة. ده بيوريه إنك فاهم مش حافظ:</p>",
      points: [
        "<b>1.</b> «المسألة فيها overlapping subproblems لأن...» ثم اكتب الـ recursion الساذجة وقول تعقيدها الأسي.",
        "<b>2.</b> عرّف الـ state بجملة، والـ transition بجملة، والـ base cases.",
        "<b>3.</b> اختار memo أو table وقول ليه، وارسم الجدول على مثال صغير.",
        "<b>4.</b> قول الزمن (عدد الحالات × تكلفة الـ transition) والمساحة، وهل ممكن تتقلل.",
        "<b>5.</b> اختبر حالات الحافة: فاضي، عنصر واحد، مستحيل.",
      ],
      codes: [
        {
          lang: "text",
          title: "أخطاء بتتكرر",
          src: `wrong init       min problem initialised with 0      -> use a big "impossible" value
wrong order      dp[i] read before it is computed    -> check loop direction
answer position  returning dp[n-1] for LIS           -> it is max(dp)
loop order       coin change II counted sequences    -> coins outside, amounts inside
no base case     dp[0] left as 0 for "ways"          -> dp[0] = 1
memo + mutable   key built from a List that changes  -> key must be immutable (int or String)`,
        },
      ],
      pitfall: "نسيان إن DP محتاجة <b>حالات متكررة</b>. لو كل حالة فرعية بتتحسب مرة واحدة أصلا (زي merge sort) فمفيش داعي للـ memo. وكمان لو الـ state فيه كذا بُعد (index، المتبقي، آخر اختيار) قدّر عدد الحالات: لو أكبر من 10^7 غالبا محتاج تفكر في state أصغر.",
      interview: [
        { q: "إزاي تحسب تعقيد حل DP؟", a: "عدد الحالات الفرعية (الخانات) × تكلفة حساب الخانة الواحدة. Coin Change: amount خانة × k عملة = O(amount × k). LIS: n خانة × n = O(n^2). House Robber: n خانة × O(1). والمساحة هي حجم الجدول، وبتتقلل لو الخانة بتعتمد على آخر k خانات بس.",
        },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: Fibonacci بجدول",
      lang: "dart",
      code: `int fibTab(int n) {
  if (n < 2) return n;
  final dp = List<int>.filled(n + 1, 0);
  dp[1] = 1;
  for (var i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
      note: "state ← transition ← base ← ترتيب ← إجابة.",
    },
    {
      title: "اكتب: Coin Change (أقل عدد)",
      lang: "dart",
      code: `int coinChange(List<int> coins, int amount) {
  final inf = amount + 1;
  final dp = List<int>.filled(amount + 1, inf);
  dp[0] = 0;
  for (var a = 1; a <= amount; a++) {
    for (final c in coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) {
        dp[a] = dp[a - c] + 1;
      }
    }
  }
  return dp[amount] >= inf ? -1 : dp[amount];
}`,
      note: "مستحيل = amount + 1، والـ base = 0.",
    },
    {
      title: "اكتب: Longest Increasing Subsequence",
      lang: "dart",
      code: `int lengthOfLIS(List<int> nums) {
  if (nums.isEmpty) return 0;
  final dp = List<int>.filled(nums.length, 1);
  var best = 1;
  for (var i = 1; i < nums.length; i++) {
    for (var j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
      }
    }
    if (dp[i] > best) best = dp[i];
  }
  return best;
}`,
      note: "الإجابة max(dp) مش dp.last.",
    },
  ],

  tasks: [
    {
      title: "أقل تكلفة لطلوع السلم",
      lang: "dart",
      prompt: "<p>القايمة <code>cost</code>: <code>cost[i]</code> هو ما تدفعه لو وقفت على الدرجة i وطلعت منها (بخطوة أو اتنين). تقدر تبدأ من الدرجة 0 أو 1. الهدف تعدّي آخر درجة (الموضع <code>cost.length</code>). اكتب <code>int minCostClimbingStairs(List&lt;int&gt; cost)</code> ترجع أقل تكلفة.</p>",
      examples: [
        { in: "minCostClimbingStairs([10, 15, 20])", out: "15" },
        { in: "minCostClimbingStairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1])", out: "6" },
        { in: "minCostClimbingStairs([5, 5])", out: "5" },
      ],
      starter: `int minCostClimbingStairs(List<int> cost) {
  // your code
}`,
      hints: [
        "<code>dp[i]</code> = أقل تكلفة للوصول للموضع i (من غير ما تدفع تكلفة i نفسها لسه).",
        "للوصول لـ i: إما من i-1 (ادفع <code>cost[i-1]</code>) أو من i-2 (ادفع <code>cost[i-2]</code>).",
        "dp[0] = dp[1] = 0 (البداية مجانية). الإجابة <code>dp[n]</code>.",
      ],
      solution: `import 'dart:math';

int minCostClimbingStairs(List<int> cost) {
  final n = cost.length;
  final dp = List<int>.filled(n + 1, 0);
  for (var i = 2; i <= n; i++) {
    dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
  }
  return dp[n];
}`,
      explain: "الموضع i معناه «واقف على الأرض قبل الدرجة i». الوصول له إما بخطوة من i-1 بتكلفة <code>cost[i-1]</code> أو بخطوتين من i-2. الزمن O(n)، وبيتقلل لـ O(1) بمتغيرين.",
    },
    {
      title: "فك التشفير (Decode Ways)",
      lang: "dart",
      prompt: "<p>الرسالة <code>s</code> أرقام فقط، و<code>'1'</code> معناها A و<code>'2'</code> B ... و<code>'26'</code> Z. اكتب <code>int numDecodings(String s)</code> ترجع بكام طريقة تتفك. الصفر لوحده أو في أول مجموعة (<code>'0'</code>, <code>'06'</code>) مش حرف صالح. (<code>s</code> غير فاضية.)</p>",
      examples: [
        { in: "numDecodings('12')", out: "2" },
        { in: "numDecodings('226')", out: "3" },
        { in: "numDecodings('06')", out: "0" },
        { in: "numDecodings('10')", out: "1" },
      ],
      starter: `int numDecodings(String s) {
  // your code
}`,
      hints: [
        "<code>dp[i]</code> = عدد طرق فك أول i حرف. <code>dp[0] = 1</code>.",
        "لو الحرف رقم i (الأخير) مش '0' يبقى ممكن يتفك لوحده: <code>dp[i] += dp[i-1]</code>.",
        "لو آخر حرفين رقم من 10 لـ 26 ممكن يتفكوا مع بعض: <code>dp[i] += dp[i-2]</code>.",
      ],
      solution: `int numDecodings(String s) {
  final n = s.length;
  final dp = List<int>.filled(n + 1, 0);
  dp[0] = 1;
  dp[1] = s[0] == '0' ? 0 : 1;
  for (var i = 2; i <= n; i++) {
    if (s[i - 1] != '0') dp[i] += dp[i - 1];
    final two = int.parse(s.substring(i - 2, i));
    if (two >= 10 && two <= 26) dp[i] += dp[i - 2];
  }
  return dp[n];
}`,
      explain: "نفس شكل Climbing Stairs بس كل خطوة (1 أو 2) ليها شرط صلاحية. '10' مثلا: الصفر مينفعش لوحده فنفكها كـ '10' (J) بس = 1. الزمن O(n) والمساحة O(n) وبتتقلل لـ O(1).",
    },
    {
      title: "عدد المربعات الكاملة",
      lang: "dart",
      prompt: "<p>اكتب <code>int numSquares(int n)</code> ترجع أقل عدد مربعات كاملة (1, 4, 9, 16, ...) مجموعها يساوي <code>n</code> (<code>n &gt;= 1</code>).</p>",
      examples: [
        { in: "numSquares(12)", out: "3" },
        { in: "numSquares(13)", out: "2" },
        { in: "numSquares(1)", out: "1" },
      ],
      starter: `int numSquares(int n) {
  // your code
}`,
      hints: [
        "شبه Coin Change: العملات هي المربعات الكاملة اللي ≤ n.",
        "<code>dp[i]</code> = أقل عدد مربعات مجموعها i. <code>dp[0] = 0</code>.",
        "<code>dp[i] = min(dp[i - k*k] + 1)</code> لكل k بحيث k*k ≤ i.",
      ],
      solution: `int numSquares(int n) {
  final dp = List<int>.filled(n + 1, n);     // n ones always works
  dp[0] = 0;
  for (var i = 1; i <= n; i++) {
    for (var k = 1; k * k <= i; k++) {
      if (dp[i - k * k] + 1 < dp[i]) dp[i] = dp[i - k * k] + 1;
    }
  }
  return dp[n];
}`,
      explain: "نفس Coin Change بعملات = المربعات. القيمة الابتدائية n آمنة لأن n مرة 1 دايما حل. الزمن O(n √n) والمساحة O(n). مثال 12 = 4 + 4 + 4 (3 مربعات) و13 = 4 + 9 (اتنين).",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `int climbStairs(int n) {
  final dp = List<int>.filled(n + 2, 0);
  dp[0] = 1;
  dp[1] = 1;
  for (var i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

void main() {
  print(climbStairs(6));
}` },
      answer: ["13"],
      why: "الجدول: 1 1 2 3 5 8 13. dp[6] = dp[5] + dp[4] = 8 + 5 = 13.",
    },
    {
      q: "إيه معنى «overlapping subproblems»؟",
      options: [
        "المسائل الفرعية مستقلة عن بعض تماما",
        "نفس المسألة الفرعية بتتحسب أكتر من مرة في الحل الساذج، فتخزينها بيوفر شغل",
        "الحل لازم يستخدم recursion",
        "الجدول لازم يبقى ثنائي الأبعاد",
      ],
      answer: 1,
      why: "التكرار هو اللي بيخلي الـ memo مفيدة. لو المسائل الفرعية مستقلة (merge sort) مفيش حاجة تتخزن. DP مش لازم recursion ولا جدول 2D.",
    },
    {
      q: "في House Robber، إيه تعريف الـ state الصح؟",
      options: [
        "<code>dp[i]</code> = فلوس البيت i",
        "<code>dp[i]</code> = عدد البيوت المسروقة لحد i",
        "<code>dp[i]</code> = أكبر مبلغ ممكن من أول i بيت",
        "<code>dp[i]</code> = true لو البيت i اتسرق",
      ],
      answer: 2,
      why: "الـ state لازم يكون القيمة اللي بتحسبها (الأمثل) لمسألة أصغر بنفس الشكل. فلوس البيت معطى مش state. ومعاه transition: dp[i] = max(dp[i-1], dp[i-2] + nums[i-1]).",
    },
    {
      q: "أقل عدد عملات لتكوين 6 من العملات [1, 3, 4]؟",
      answer: ["2"],
      why: "3 + 3 = 6 (عملتين). الجشع كان هيختار 4 + 1 + 1 = 3 عملات، لكن الجدول بيجرب كل العملات فبيلاقي الأقل.",
    },
    {
      q: "كام طريقة (تركيبة، الترتيب مش مهم) لتكوين 5 من العملات [1, 2, 5]؟",
      answer: ["4"],
      why: "5، و2+2+1، و2+1+1+1، و1+1+1+1+1. (التسلسلات المرتبة هي 9.)",
    },
    {
      q: "ليه في Coin Change (أقل عدد) بنهيّئ الجدول بـ <code>amount + 1</code> مش 0؟",
      options: [
        "لأن مفيش حل بيستخدم أكتر من amount عملة، فالقيمة دي معناها «مستحيل» وبتتغلب بأي حل حقيقي، بينما 0 كانت هتبان كأنها أحسن حل",
        "علشان نوفر ذاكرة",
        "لأن Dart مبتسمحش بـ 0 في الـ List.filled",
        "علشان الجدول يبدأ من 1",
      ],
      answer: 0,
      why: "min بتختار الأصغر، فلو بدأنا بـ 0 فهي دايما هتكسب ومنوصلش لأي إجابة حقيقية. قيمة كبيرة بتخسر قدام أي حل حقيقي، وتفضل لو مفيش حل.",
    },
    {
      q: "في LIS بـ DP، إيه معنى <code>dp[i]</code>؟",
      options: [
        "طول أطول subsequence متزايدة في أول i عنصر",
        "عدد العناصر الأصغر من nums[i]",
        "طول أطول subsequence متزايدة بتنتهي عند العنصر i",
        "قيمة أكبر عنصر لحد i",
      ],
      answer: 2,
      why: "لازم «بتنتهي عند i» علشان نعرف نكمل منها بعنصر أكبر. ولذلك الإجابة max(dp) مش dp.last.",
    },
    {
      q: "كام طول أطول subsequence متزايدة في [3, 1, 2, 1, 8, 5, 6]؟",
      answer: ["4"],
      why: "1, 2, 5, 6 طولها 4 (أو 1, 2, 8 طولها 3 بس). لازم تتخطى 3 والـ 1 التانية والـ 8.",
    },
    {
      q: "أي DP من دول ينفع تقلل مساحتها لـ O(1)؟",
      options: [
        "Coin Change (أقل عدد)",
        "House Robber (dp[i] بتعتمد على i-1 و i-2)",
        "LIS بـ O(n^2)",
        "Coin Change II",
      ],
      answer: 1,
      why: "House Robber بيحتاج آخر خانتين بس. Coin Change و LIS بيرجعوا لخانات بعيدة (a - c أو أي j < i) فمحتاجين الجدول كله.",
    },
    {
      q: "الكود ده المفروض يعد التركيبات (combinations) في Coin Change II. إيه الغلط؟",
      code: { lang: "dart", src: `int change(int amount, List<int> coins) {
  final dp = List<int>.filled(amount + 1, 0);
  dp[0] = 1;
  for (var a = 1; a <= amount; a++) {
    for (final c in coins) {
      if (c <= a) dp[a] += dp[a - c];
    }
  }
  return dp[amount];
}` },
      options: [
        "الـ dp[0] لازم 0",
        "لازم الشرط <code>c &lt; a</code>",
        "الجدول صغير بواحد",
        "ترتيب اللوبين: المبالغ برا والعملات جوه بتعد التسلسلات المختلفة الترتيب، المفروض العملات في الخارج",
      ],
      answer: 3,
      why: "بالترتيب ده التركيبة [1,2] و[2,1] بتتعد مرتين. نقل العملات للوب الخارجي بيخلي كل تركيبة تتعد مرة. dp[0] = 1 صح، والشرط c <= a صح.",
    },
  ],
};
