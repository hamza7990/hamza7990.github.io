window.LEVELS = window.LEVELS || {};
window.LEVELS["algo/ab"] = {
  boss: [
    {
      q: "قولّي تعقيد الكودين دول وإزاي حسبته: (1) لوب خارجي <code>i</code> من 0 لـ n، وجواه لوب <code>j</code> من i لـ n. (2) لوب <code>while (n &gt; 1) n ~/= 2</code>. وإيه الفرق عمليا بين O(n log n) و O(n^2) لما n = مليون؟",
      a: "الأول: عدد اللفات n + (n-1) + ... + 1 = n(n+1)/2، فده O(n^2) لأن الثابت 1/2 والحد الأقل بيتشالوا. التاني: كل لفة بتنصّف n، فعدد اللفات log2(n)، يعني O(log n). لما n = مليون: n log n حوالي 20 مليون عملية (ثانية أو أقل)، و n^2 يعني 10^12 عملية (ساعات). علشان كده الفرق بين الترتيب بـ merge sort (O(n log n)) وبـ bubble sort (O(n^2)) مش نظري.",
    },
    {
      q: "قارن بين merge sort وquick sort: التعقيد، المساحة، الـ stability، وامتى كل واحدة تفشل؟ وإيه اللي بتعمله <code>List.sort</code> في Dart؟",
      a: "الاتنين O(n log n) في المتوسط. merge sort ثابتة (O(n log n) دايما) ومستقرة (stable) لكن محتاجة O(n) مساحة إضافية. quick sort في المتوسط أسرع عمليا وبتشتغل في المكان (O(log n) stack)، لكن الأسوأ O(n^2) لو الـ pivot سيئ (مثلا الأول على قايمة مرتبة)، وهي مش stable. الحل عشوائية أو median-of-three في الـ pivot. <code>List.sort</code> في Dart مش مضمونة stable، فلو محتاج ثبات (ترتيب بعمودين) ترتب بمفتاح مركب أو استخدم مفتاح التعادل. وO(n log n) هو الحد الأدنى لأي ترتيب بالمقارنة.",
    },
    {
      q: "اختار الأسلوب المناسب لكل مسألة، واذكر السبب في جملة: (أ) أطول substring من غير تكرار. (ب) زوج في قايمة مرتبة مجموعهم = الهدف. (ج) أقل سعة شحن لتوصيل طرود في d أيام. (د) كام جزيرة في خريطة. (هـ) أقل عدد عملات لمبلغ بعملات عشوائية. (و) أقل عدد اجتماعات متداخلة نحتاج غرف ليها.",
      a: "(أ) sliding window: نافذة متغيرة بمؤشرين وmap بآخر ظهور، O(n). (ب) two pointers من الطرفين لأن القايمة مرتبة، O(n). (ج) binary search on the answer: لو سعة x تكفي فأي سعة أكبر تكفي (monotone) وفحص x سهل بـ O(n). (د) DFS أو BFS على grid، كل جزيرة مكوّن متصل. (هـ) DP، لأن الجشع بيغلط مع عملات عشوائية (مثال [1,3,4] والمبلغ 6). (و) greedy: ترتيب البدايات والنهايات لوحدهم وعدّ أقصى تداخل. الفكرة إني بقرا إشارات المسألة: «subarray/substring متصل» نافذة، «مرتبة» two pointers أو binary search، «أقل/أكبر + فحص سهل» binary search على الإجابة، «أقل خطوات» BFS، «كام طريقة / أحسن قيمة + حالات بتتكرر» DP.",
    },
    {
      q: "اكتب دالة <code>searchInsert(List&lt;int&gt; a, int target)</code> على قايمة مرتبة تصاعديا: ترجع index الهدف لو موجود، وإلا الـ index اللي يتحط فيه الهدف وتفضل مرتبة. في O(log n). وليه <code>hi = a.length</code> مش <code>a.length - 1</code>؟",
      a: `<p>ده lower bound: أول index فيه <code>a[i] &gt;= target</code>. بستخدم مدى نصف مفتوح <code>[lo, hi)</code> وبشيل نص المدى في كل لفة. <code>hi = a.length</code> لأن الإجابة ممكن تكون n (الهدف أكبر من الكل)، فلازم تكون جوه المدى المحتمل. لو الهدف موجود بتكرار بترجع أول واحد.</p><pre dir='ltr'><code>int searchInsert(List&lt;int&gt; a, int target) {
  var lo = 0, hi = a.length;        // answer is in [lo, hi]
  while (lo &lt; hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (a[mid] &lt; target) {
      lo = mid + 1;                  // mid is too small
    } else {
      hi = mid;                      // mid could be the answer
    }
  }
  return lo;
}</code></pre><p>الزمن O(log n) والمساحة O(1). حالات الحافة: قايمة فاضية ترجع 0، هدف أصغر من الكل يرجع 0، وأكبر من الكل يرجع n.</p>`,
    },
    {
      q: "إيه الـ data structure اللي ورا كل خوارزمية من دول، وإيه تكلفة العمليات الأساسية في Dart؟ BFS، DFS اليدوي، Dijkstra، sliding window لأطول substring، وcycle detection.",
      a: "BFS محتاج queue: <code>Queue</code> من <code>dart:collection</code>، والـ <code>add</code> و<code>removeFirst</code> بـ O(1) (أما <code>list.removeAt(0)</code> فـ O(n) فمتستخدمهاش كـ queue). DFS اليدوي محتاج stack: <code>List</code> بـ <code>add</code> و<code>removeLast</code> بـ O(1). Dijkstra محتاج priority queue (min-heap): <code>dart:collection</code> مفيهاش واحدة، فإما <code>PriorityQueue</code> من package:collection أو heap بإيدي، والـ push وpop بـ O(log n). Sliding window بيستخدم <code>Map</code> أو <code>Set</code> (hash، البحث والإضافة O(1) في المتوسط). وكشف cycle في graph غير موجه بيحتاج seen (<code>Set</code> أو list من bool) وparent. كل الـ visited هنا لازم تكون O(1) في الفحص وإلا الزمن بيبوظ.",
    },
    {
      q: "على الـ graph ده (القوايم هي الجيران بالترتيب): <code>0:[1,2]  1:[3]  2:[3,4]  3:[5]  4:[5]  5:[]</code>. اكتب ترتيب زيارة BFS وDFS (recursive) من العقدة 0. وإيه اللي بيتغير لو الـ DFS بـ stack يدوي؟",
      a: "BFS: <code>0, 1, 2, 3, 4, 5</code> (طبقة 0: العقدة 0. طبقة 1: 1 و2. طبقة 2: 3 و4. طبقة 3: 5). DFS الـ recursive: <code>0, 1, 3, 5, 2, 4</code> (نزل 0 ثم 1 ثم 3 ثم 5، رجع لـ 2 وبعدين 4 لأن 3 و5 اتزاروا). في الـ stack اليدوي أدفع الجيران بالعكس (<code>reversed</code>) علشان نفس الترتيب، وأفحص <code>seen</code> وقت الإخراج لأن العقدة ممكن تتدفع مرتين قبل ما تتزار (في graph زي الماسة لو اتدفعت من أكتر من أب). مع ترتيب مختلف للجيران، ترتيب الزيارة بيتغير لكن النتيجة (مين اتزار) لا.",
    },
    {
      q: "إيه الفرق بين BFS وDFS، وامتى بتختار كل واحدة؟ وإيه اللي يحصل لو نسيت الـ visited؟ وليه BFS بيلاقي أقصر مسار؟",
      a: "BFS بـ queue وبيزور بالأقرب الأول، فبيدّي أقصر مسار (بعدد الروابط) في graph من غير أوزان: أول مرة أوصل لعقدة هي بأقل مسافة لأن الـ queue بتخرج العقد بترتيب بعدها. DFS بـ stack أو recursion وبينزل لأبعد ما يمكن، فهو الأنسب لـ «هل موجود؟»، المكونات، الجزر، كشف الـ cycles، والـ backtracking. الزمن الاتنين O(V + E). من غير visited في graph فيه cycle الكود بيلف للأبد (stack overflow أو queue بتكبر)، وحتى من غير cycle نفس العقدة بتتعالج مرات. أعلّم العقدة وقت الإدخال في BFS وأول ما أزورها في DFS. وفي grid كبيرة DFS الـ recursive ممكن يرمي StackOverflowError فبستخدم BFS أو stack يدوي.",
    },
    {
      q: "اكتب <code>int lengthOfLongestSubstring(String s)</code>: طول أطول substring من غير حروف مكررة. اشرح الفكرة والتعقيد.",
      a: `<p>sliding window: مؤشر <code>right</code> بيتحرك وmap بتخزن آخر index ظهر فيه كل حرف. لو الحرف ظهر قبل كده <b>وجوه النافذة الحالية</b> (<code>prev &gt;= left</code>) بقفز بـ <code>left</code> لما بعد ظهوره القديم. كل حرف بيتزار مرة فمفيش رجوع.</p><pre dir='ltr'><code>int lengthOfLongestSubstring(String s) {
  final last = &lt;String, int&gt;{};
  var left = 0, best = 0;
  for (var right = 0; right &lt; s.length; right++) {
    final ch = s[right];
    final prev = last[ch];
    if (prev != null &amp;&amp; prev &gt;= left) left = prev + 1;
    last[ch] = right;
    if (right - left + 1 &gt; best) best = right - left + 1;
  }
  return best;
}</code></pre><p>الزمن O(n) والمساحة O(k) حيث k عدد الحروف المختلفة. الشرط <code>prev &gt;= left</code> مهم: حرف قديم برا النافذة مش تكرار. أمثلة: 'abcabcbb' ترجع 3، 'bbbbb' ترجع 1، '' ترجع 0.</p>`,
    },
    {
      q: "اكتب <code>int minSteps(List&lt;List&lt;int&gt;&gt; grid)</code>: <code>0</code> خانة فاضية و<code>1</code> حيطة، من (0,0) لآخر خانة بالحركة الأربعة، أقل عدد خطوات أو -1. اشرح ليه BFS، وإيه التعقيد؟",
      a: `<p>الخطوات كلها بنفس التكلفة، يبقى أقصر مسار في graph من غير أوزان = BFS. الـ state هو (صف، عمود). مصفوفة <code>dist</code> بتعمل شغلين: المسافة، وعلامة الـ visited (-1 يعني لسه). أول ما أوصل للهدف أرجع المسافة.</p><pre dir='ltr'><code>import 'dart:collection';

int minSteps(List&lt;List&lt;int&gt;&gt; grid) {
  final rows = grid.length;
  if (rows == 0) return -1;
  final cols = grid[0].length;
  if (grid[0][0] == 1 || grid[rows - 1][cols - 1] == 1) return -1;
  final dist = List.generate(rows, (_) =&gt; List&lt;int&gt;.filled(cols, -1));
  final q = Queue&lt;List&lt;int&gt;&gt;()..add([0, 0]);
  dist[0][0] = 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.isNotEmpty) {
    final cur = q.removeFirst();
    final r = cur[0], c = cur[1];
    if (r == rows - 1 &amp;&amp; c == cols - 1) return dist[r][c];
    for (final d in dirs) {
      final nr = r + d[0], nc = c + d[1];
      if (nr &lt; 0 || nc &lt; 0 || nr &gt;= rows || nc &gt;= cols) continue;
      if (grid[nr][nc] == 1 || dist[nr][nc] != -1) continue;
      dist[nr][nc] = dist[r][c] + 1;
      q.add([nr, nc]);
    }
  }
  return -1;
}</code></pre><p>الزمن والمساحة O(R × C): كل خانة بتدخل الـ queue مرة وبنفحص 4 جيران. الحالات الحدية: grid فاضية، بداية أو نهاية حيطة، خانة واحدة (ترجع 0).</p>`,
    },
    {
      q: "ليه BFS مش كفاية لأقصر مسار في graph موزون؟ اشرح Dijkstra وتعقيده، وليه بيفشل مع الأوزان السالبة، وإيه البديل؟",
      a: "BFS بيقيس عدد الروابط مش التكلفة، فرابط واحد بـ 10 بيكسب على تلات روابط بـ 1. Dijkstra بيحتفظ بأقل مسافة معروفة لكل عقدة وبيسحب من priority queue العقدة الأقرب، وده معناه إن مسافتها نهائية (أي طريق تاني بيعدي بعقدة أبعد ومفيش أوزان بتنزّل)، وبعدين بيحسّن جيرانها. بتجاهل العناصر القديمة من الـ heap (<code>d &gt; dist[u]</code>). الزمن O((V + E) log V). مع رابط سالب البرهان بيقع: عقدة اتسحبت كـ «نهائية» وبعدين طريق أطول بيوصلها أرخص، وcycle سالب معناه إن مفيش أقصر مسار. البديل Bellman-Ford: V-1 لفة بتحسّن كل الروابط، ولفة زيادة تكشف الـ cycle السالب، بزمن O(V × E).",
    },
    {
      q: "عندك 4 مواد والشروط <code>[[1,0],[2,0],[3,1],[3,2]]</code> (الزوج <code>[a,b]</code> يعني b قبل a). اكتب ترتيب Kahn، وإزاي تعرف إن مفيش ترتيب؟ وفين بتتطبق دي في الواقع؟",
      a: "الرابط من b لـ a. in-degrees: المادة 0 صفر، 1 و2 واحد، و3 اتنين. الـ queue تبدأ بـ [0]. أسحب 0 فيبقى in-degree لـ 1 و2 صفر فيدخلوا. أسحب 1 فيبقى in-degree لـ 3 واحد. أسحب 2 فيبقى صفر فيدخل 3. الترتيب: <code>[0, 1, 2, 3]</code> (أي ترتيب بيحترم الشروط صح، ده مجرد واحد). لو الناتج في الآخر أقل من n يبقى فيه cycle (زي <code>[[1,0],[0,1]]</code>) ومفيش ترتيب. الزمن O(V + E). البديل DFS بثلاث حالات (لسه، على المسار، خلصت): جار «على المسار» = cycle، وجار «خلصت» مش مشكلة. في الواقع: ترتيب بناء الحزم (npm و Gradle)، ترتيب الـ migrations، وحساب الخلايا في spreadsheet.",
    },
    {
      q: "Coin Change: ليه الجشع (خد أكبر عملة) بيغلط؟ ثبّت ده بمثال، وإزاي تختبر أي فكرة جشعة قبل ما تعتمد عليها؟",
      a: "الجشع بيشتغل بس مع أنظمة عملات معينة زي [25,10,5,1]. مع [1,3,4] والمبلغ 6 بياخد 4+1+1 = 3 عملات، والأمثل 3+3 = عملتين. وممكن يقول «مستحيل» وهو ممكن: [4,3] والمبلغ 6. مثال واحد صغير كفاية لإثبات إن الاستراتيجية غلط. الجشع الصح محتاج greedy choice property وبثبتها بـ exchange argument: أبدّل أول اختيار في أي حل أمثل باختياري وأوريه إنه لسه صالح. ولو معنديش وقت للإثبات: brute force بطيء ومضمون على مدخلات صغيرة عشوائية بـ seed ثابت، وأقارن، وأطبع أول مدخل بيختلفوا فيه. لو الجشع غلط الحل DP.",
    },
    {
      q: "اكتب <code>int eraseOverlapIntervals(List&lt;List&lt;int&gt;&gt; iv)</code>: أقل عدد فترات تتشال علشان الباقي ميتداخلش (اللمس مش تداخل). اشرح ليه الترتيب بوقت النهاية.",
      a: `<p>أكبر عدد فترات أقدر أحتفظ بيه هو Activity Selection، والإجابة n ناقص العدد ده. الجشع: رتب بوقت النهاية، خد الفترة اللي بتنتهي أبكر، وبعدها كل فترة بتبدأ عند أو بعد نهاية آخر مختارة. السبب (exchange argument): أي حل أمثل أول فترة فيه بتنتهي في أو بعد أبكر نهاية، فتبديلها بالأبكر مش بيتداخل مع الباقي وبنفس العدد. الترتيب بالبداية أو بالطول بيفشل بمثال زي [[0,5],[4,6],[5,10]].</p><pre dir='ltr'><code>int eraseOverlapIntervals(List&lt;List&lt;int&gt;&gt; iv) {
  if (iv.isEmpty) return 0;
  final a = [...iv]..sort((x, y) =&gt; x[1].compareTo(y[1]));
  var kept = 1, end = a[0][1];
  for (var i = 1; i &lt; a.length; i++) {
    if (a[i][0] &gt;= end) {      // starts when/after the last one ends
      kept++;
      end = a[i][1];
    }
  }
  return a.length - kept;
}</code></pre><p>الزمن O(n log n) للترتيب، والمساحة O(n) للنسخة. لو اللمس تداخل غيّر الشرط لـ <code>&gt;</code>.</p>`,
    },
    {
      q: "قولّي إزاي بتقرا جدول DP بإيدك: املا جدول Coin Change لعملات <code>[1,3,4]</code> والمبلغ 6، واشرح الـ state والـ transition والـ base case.",
      a: "الـ state: <code>dp[a]</code> أقل عدد عملات لتكوين المبلغ a. الـ transition: <code>dp[a] = 1 + min(dp[a - c])</code> على كل عملة c أقل من أو تساوي a (آخر عملة ممكن تكون أي واحدة). الـ base: <code>dp[0] = 0</code>، والباقي في الأول «مستحيل» (amount + 1). الجدول: <code>a=0..6</code> → <code>0, 1, 2, 1, 1, 2, 2</code>. تفاصيل: dp[2] = dp[1]+1 = 2، dp[3] = dp[0]+1 = 1 (عملة 3)، dp[4] = 1 (عملة 4)، dp[5] = min(dp[4]+1, dp[2]+1, dp[1]+1) = 2، dp[6] = min(dp[5]+1, dp[3]+1, dp[2]+1) = 2. الإجابة dp[6] = 2. الزمن O(amount × k) والمساحة O(amount).",
    },
    {
      q: "اكتب <code>int coinChange(List&lt;int&gt; coins, int amount)</code>: أقل عدد عملات لتكوين المبلغ، أو -1 لو مستحيل. وإيه الغلطة الشائعة في تهيئة الجدول؟",
      a: `<p>DP بجدول <code>dp[a]</code> = أقل عدد عملات للمبلغ a. الجدول بيبدأ بقيمة «مستحيل» = <code>amount + 1</code> (أكبر من أي إجابة ممكنة لأن أصغر عملة 1 بتحتاج amount عملة على الأكتر)، و<code>dp[0] = 0</code>. الغلطة الشائعة: تهيئة بـ 0، فـ <code>min</code> هتسيب كل حاجة 0 وتجاوب غلط.</p><pre dir='ltr'><code>int coinChange(List&lt;int&gt; coins, int amount) {
  final inf = amount + 1;                       // "impossible"
  final dp = List&lt;int&gt;.filled(amount + 1, inf);
  dp[0] = 0;
  for (var a = 1; a &lt;= amount; a++) {
    for (final c in coins) {
      if (c &lt;= a &amp;&amp; dp[a - c] + 1 &lt; dp[a]) dp[a] = dp[a - c] + 1;
    }
  }
  return dp[amount] &gt;= inf ? -1 : dp[amount];
}</code></pre><p>الزمن O(amount × k) والمساحة O(amount). أمثلة: ([1,2,5], 11) ترجع 3، ([2], 3) ترجع -1، ([1], 0) ترجع 0.</p>`,
    },
    {
      q: "امتى تستخدم backtracking وامتى DP؟ اكتب subsets (كل المجموعات الفرعية) وقول تعقيدها وأشهر bug فيها. وإيه الحالات اللي DP فيها هي الأداة الغلط؟",
      a: `<p>backtracking لما محتاج <b>كل</b> الحلول (التكلفة أسية بطبيعة الناتج: subsets بـ 2^n، permutations بـ n!). DP لما بسأل عن <b>عدد</b> الحلول أو أحسن قيمة وفيه حالات فرعية بتتكرر. القالب: choose، explore، un-choose. أشهر bug إني أحفظ المرجع بدل نسخة: لو كتبت <code>res.add(cur)</code> هتكون كل النتايج نفس القايمة وهتطلع فاضية في الآخر، والصح <code>List.of(cur)</code>.</p><pre dir='ltr'><code>List&lt;List&lt;int&gt;&gt; subsets(List&lt;int&gt; nums) {
  final res = &lt;List&lt;int&gt;&gt;[];
  final cur = &lt;int&gt;[];
  void go(int start) {
    res.add(List&lt;int&gt;.of(cur));     // a COPY
    for (var i = start; i &lt; nums.length; i++) {
      cur.add(nums[i]);               // choose
      go(i + 1);                      // explore
      cur.removeLast();               // un-choose
    }
  }
  go(0);
  return res;
}</code></pre><p>الزمن O(n × 2^n) (2^n مجموعة ونسخة O(n) لكل واحدة) والمساحة الإضافية O(n). DP هي الأداة الغلط لما: الجشع مثبت (Activity Selection)، مفيش حالات متكررة، المطلوب كل الحلول، أو الـ state ضخم (جدول n × n بـ n = 10^5).</p>`,
    },
  ],
};
