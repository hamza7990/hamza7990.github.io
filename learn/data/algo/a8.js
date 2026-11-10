window.LEVELS = window.LEVELS || {};
window.LEVELS["algo/a8"] = {
  slides: [
    {
      kicker: "الفكرة",
      title: "الجشع: اختار الأحسن دلوقتي ومترجعش",
      en: "The greedy idea and the proof obligation",
      body: "<p>الخوارزمية الجشعة (greedy) بتحل المسألة على خطوات، وفي كل خطوة بتاخد <b>القرار الأحسن في اللحظة دي</b> وبتلتزم بيه، من غير ما ترجع تغيّره ولا تجرب البدائل. سريعة وبسيطة (غالبا ترتيب O(n log n) وبعدها لف واحد)، بس <b>مش دايما صح</b>. الفرق بينها وبين DP إن DP بتجرب كل الاحتمالات وبتحتفظ بالأحسن، والجشعة بتراهن على إن الاختيار المحلي الأحسن هو جزء من الحل الأمثل.</p><p>علشان الرهان ده يبقى مضمون لازم تثبت حاجتين: <b>(1) greedy choice</b>: فيه حل أمثل بيحتوي على اختيارنا الأول. <b>(2) optimal substructure</b>: بعد الاختيار ده، اللي فاضل مسألة أصغر من نفس النوع، وحلها الأمثل مع اختيارنا بيدّي حل أمثل للمسألة الكبيرة.</p><p>الإثبات الشائع بيتسمى <b>exchange argument</b> (حجة التبديل) وبالكلام العادي: «خد أي حل أمثل. لو مش بيبدأ باختياري، بدّل أول اختيار فيه باختياري. الحل لسه صالح وبنفس الجودة أو أحسن، يبقى فيه حل أمثل بيبدأ باختياري». لو قدرت تعمل التبديل ده من غير ما تكسر حاجة، الجشع صح.</p>",
      points: [
        "مسألة بتطلب أقل/أكبر قيمة وفيها قرارات متتالية ← فكر في greedy، بس <b>اثبت</b> أو جرّب على brute force.",
        "غالبا أول خطوة هي <b>ترتيب</b> (sort) بمعيار معين. المعيار الصح هو كل الحكاية (النهاية؟ البداية؟ الطول؟).",
        "greedy مش بترجع: لو الاختيار الأول غلط، ملهوش علاج. وده سبب إنها بتفشل في مسائل كتير (coin change العام).",
      ],
      focus: [{ label: "احفظها", text: "greedy = قرار محلي نهائي. صحتها محتاجة إثبات (exchange argument) أو اختبار قدام brute force. لو مفيش، افترض إنها ممكن تكون غلط." }],
      interview: [
        { q: "إيه الفرق بين greedy وdynamic programming؟ وإزاي تعرف إن greedy صح؟", a: "greedy بتاخد القرار الأحسن محليا وتلتزم بيه، بسرعة وبدون تجربة بدائل. DP بتجرب كل الاحتمالات (بتخزن نتايج الحالات الفرعية) فبتضمن الأحسن. greedy صح بس لو فيه greedy choice property وoptimal substructure، وبثبتها بـ exchange argument: ببدّل أول اختيار في أي حل أمثل باختياري وأوريه إنه لسه صالح وبنفس الجودة. ولو مش قادر أثبت، بقارنها بـ brute force على مدخلات صغيرة.",
        },
      ],
    },
    {
      kicker: "الكلاسيكية",
      title: "Activity Selection: رتب بوقت النهاية",
      en: "Activity selection / interval scheduling",
      body: "<p>عندك أنشطة كل واحد ليه <code>[start, end]</code>، ومينفعش تحضر نشاطين متداخلين. عايز أكتر عدد أنشطة. الاستراتيجيات المغرية: الأقصر الأول؟ اللي بيبدأ الأول؟ كلهم <b>غلط</b>. الصح: <b>اللي بينتهي أبكر</b>. بعد ما تختاره، اختار أول نشاط بيبدأ بعد نهايته (أو معاه بالظبط: <code>start &gt;= end</code>) وبينتهي بدري، وهكذا.</p><p><b>ليه (exchange argument):</b> خد أي حل أمثل. أول نشاط فيه <code>f</code> بينتهي في أو بعد أبكر نهاية <code>g</code>. استبدل <code>f</code> بـ <code>g</code>: <code>g</code> بينتهي أبكر أو معاه، فمش هيتداخل مع الباقي. الحل لسه صالح وبنفس العدد. يبقى فيه حل أمثل بيبدأ بـ g. كرر على الباقي.</p>",
      code: {
        lang: "dart",
        src: `int maxNonOverlapping(List<List<int>> iv) {
  if (iv.isEmpty) return 0;
  final a = [...iv]..sort((x, y) => x[1].compareTo(y[1]));   // by end
  var count = 1, end = a[0][1];
  for (var i = 1; i < a.length; i++) {
    if (a[i][0] >= end) {          // starts after (or when) the last ends
      count++;
      end = a[i][1];
    }
  }
  return count;
}

void main() {
  final iv = [[1, 3], [2, 4], [3, 5], [0, 6], [5, 7], [8, 9], [5, 9]];
  print(maxNonOverlapping(iv));                          // 4
  print(maxNonOverlapping([[1, 2], [2, 3], [3, 4], [1, 3]])); // 3
  print(maxNonOverlapping([]));                          // 0
  print(maxNonOverlapping([[0, 5], [4, 6], [5, 10]]));   // 2
}`,
        note: "الزمن O(n log n) للترتيب، واللف O(n). المساحة O(n) لنسخة القايمة. <code>[...iv]</code> بيعمل نسخة علشان منرتبش الأصل.",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع على المثال الأول (بعد الترتيب بوقت النهاية)",
          src: `sorted: [1,3] [2,4] [3,5] [0,6] [5,7] [8,9] [5,9]

take [1,3]   end = 3
[2,4]  starts 2 < 3   skip
take [3,5]   start 3 >= 3   end = 5
[0,6]  starts 0 < 5   skip
take [5,7]   start 5 >= 5   end = 7
take [8,9]   start 8 >= 7   end = 9
[5,9]  starts 5 < 9   skip
count = 4`,
        },
        {
          lang: "text",
          title: "ليه الأقصر الأول غلط: [0,5] [4,6] [5,10]",
          src: `shortest first:  take [4,6] (length 2), then [0,5] and [5,10] both overlap it
                 -> 1 activity
earliest end:    take [0,5], then [5,10]
                 -> 2 activities`,
        },
      ],
      interview: [
        { q: "اكتب Activity Selection وقول ليه بترتب بوقت النهاية.", a: "بسّورت الأنشطة بوقت النهاية، وبختار أول نشاط، وبعدين كل نشاط بيبدأ بعد (أو عند) نهاية آخر نشاط مختار. السبب: النشاط اللي بينتهي أبكر بيسيب أكبر مساحة للباقي، وبقدر أثبتها: أي حل أمثل ممكن أبدّل أول نشاط فيه بالنشاط اللي بينتهي أبكر وهو لسه صالح. الترتيب بالبداية أو بالطول بيفشل بأمثلة بسيطة. الزمن O(n log n).",
        },
      ],
    },
    {
      kicker: "تطبيق",
      title: "Non-overlapping Intervals: أقل عدد يتشال",
      en: "Minimum removals so intervals do not overlap",
      body: "<p>نفس المسألة بالمقلوب: «أقل عدد فترات أشيلها علشان الباقي ميتداخلش». أقصى عدد ممكن أحتفظ بيه هو Activity Selection. يبقى <code>الإجابة = n - maxNonOverlapping</code>. أنا مش محتاج حل جديد، حولت المسألة لواحدة أعرفها. ده كتير في الإنترفيو: «ده نفس ...».</p><p>انتبه لتعريف التداخل: <code>[1,2]</code> و<code>[2,3]</code> <b>مش متداخلين</b> (واحد بينتهي والتاني بيبدأ في نفس اللحظة) إلا لو المسألة قالت غير كده. اسأل المحاور.</p>",
      code: {
        lang: "dart",
        src: `// uses maxNonOverlapping from the previous slide
int eraseOverlapIntervals(List<List<int>> iv) =>
    iv.length - maxNonOverlapping(iv);

void main() {
  print(eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]));  // 1
  print(eraseOverlapIntervals([[1, 2], [1, 2], [1, 2]]));          // 2
  print(eraseOverlapIntervals([[1, 2], [2, 3]]));                  // 0
  print(eraseOverlapIntervals([]));                                // 0
}`,
        note: "في المثال الأول بنشيل <code>[1,3]</code> وبكده الباقي [1,2] [2,3] [3,4] مفيهمش تداخل.",
      },
    },
    {
      kicker: "دمج",
      title: "Merge Intervals: رتب بالبداية",
      en: "Merge intervals",
      body: "<p>هنا المطلوب دمج الفترات المتداخلة في فترات أكبر. المعيار المختلف: <b>ترتيب بوقت البداية</b>. بعدها كل فترة إما بتتداخل مع آخر فترة في الناتج (<code>start &lt;= last.end</code>) فبنمدد نهاية الأخيرة لـ <code>max(last.end, end)</code>، أو بتبدأ بعدها فبنضيفها جديدة. استخدام <code>max</code> مهم لأن فترة ممكن تكون جوه التانية بالكامل.</p>",
      code: {
        lang: "dart",
        src: `List<List<int>> mergeIntervals(List<List<int>> iv) {
  if (iv.isEmpty) return [];
  final a = [for (final x in iv) [...x]]
    ..sort((p, q) => p[0].compareTo(q[0]));       // by start
  final res = <List<int>>[a[0]];
  for (var i = 1; i < a.length; i++) {
    final last = res.last;
    if (a[i][0] <= last[1]) {                      // overlaps
      if (a[i][1] > last[1]) last[1] = a[i][1];    // extend, never shrink
    } else {
      res.add(a[i]);
    }
  }
  return res;
}

void main() {
  print(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]));
  // [[1, 6], [8, 10], [15, 18]]
  print(mergeIntervals([[1, 4], [4, 5]]));       // [[1, 5]]
  print(mergeIntervals([[1, 4], [2, 3]]));       // [[1, 4]]
  print(mergeIntervals([[5, 6], [1, 2]]));       // [[1, 2], [5, 6]]
  print(mergeIntervals([]));                     // []
}`,
        note: "نسخنا الفترات الداخلية (<code>[...x]</code>) لأننا بنعدّل <code>last[1]</code> ومش عايزين نبوّظ المدخل. الزمن O(n log n).",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع [[1,3],[2,6],[8,10],[15,18]]",
          src: `res = [[1,3]]
[2,6]    2 <= 3 overlaps      -> last becomes [1,6]
[8,10]   8 > 6   new          -> res = [[1,6],[8,10]]
[15,18]  15 > 10 new          -> res = [[1,6],[8,10],[15,18]]`,
        },
      ],
      pitfall: "نسيان <code>max</code> عند التمديد: لو كتبت <code>last[1] = a[i][1]</code> دايما، المثال <code>[[1,4],[2,3]]</code> بيطلع <code>[1,3]</code> غلط. ونسيان الترتيب الأول بيخلي الدمج بيفوّت تداخلات.",
      interview: [
        { q: "اكتب Merge Intervals وإيه تعقيده؟", a: "برتب الفترات بالبداية، وبمسك آخر فترة في الناتج. لو فترة جديدة بدايتها أقل من أو تساوي نهاية الأخيرة فبمدد النهاية لـ max للاتنين، وإلا بضيفها جديدة. الزمن O(n log n) للترتيب واللف O(n). المساحة O(n) للناتج.",
        },
      ],
    },
    {
      kicker: "الغرف",
      title: "Meeting Rooms II وأقل عدد platforms",
      en: "Minimum rooms or platforms",
      body: "<p>اجتماعات <code>[start, end]</code>، أقل عدد غرف لازم يتحجز علشان محدش يستنى؟ هي نفسها «أقل عدد رصيف لمحطة قطر» (platforms) بمواعيد الوصول والمغادرة. الجواب هو <b>أقصى عدد اجتماعات شغالة في نفس اللحظة</b>.</p><p>حيلة: رتب <b>بدايات الكل لوحدها</b> و<b>نهايات الكل لوحدها</b> (من غير ما تحافظ على أي بداية مع أي نهاية، مش مهم). بنمشي على البدايات: لو الاجتماع الجاي بدأ قبل أبكر نهاية لسه ماخلصتش، محتاجين غرفة جديدة. غير كده، غرفة فضيت فنعيد استخدامها (ننقل مؤشر النهايات). اللمس (النهاية = البداية) بنعتبره إن الغرفة فضيت.</p>",
      code: {
        lang: "dart",
        src: `int minMeetingRooms(List<List<int>> iv) {
  final starts = [for (final x in iv) x[0]]..sort();
  final ends = [for (final x in iv) x[1]]..sort();
  var rooms = 0, e = 0;
  for (var s = 0; s < starts.length; s++) {
    if (starts[s] < ends[e]) {
      rooms++;              // nobody has left yet: new room
    } else {
      e++;                  // the earliest finished room is reused
    }
  }
  return rooms;
}

void main() {
  print(minMeetingRooms([[0, 30], [5, 10], [15, 20]]));     // 2
  print(minMeetingRooms([[7, 10], [2, 4]]));                // 1
  print(minMeetingRooms([[1, 2], [2, 3]]));                 // 1
  print(minMeetingRooms([[1, 5], [1, 5], [1, 5]]));         // 3
  print(minMeetingRooms([]));                               // 0
}`,
        note: "الزمن O(n log n) والمساحة O(n). لو في مسألة platforms وصول القطر عند نفس لحظة مغادرة قطر تاني بيحتاج رصيف تاني، غيّر الشرط لـ <code>&lt;=</code>.",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع [[0,30],[5,10],[15,20]]",
          src: `starts: [0, 5, 15]     ends: [10, 20, 30]

s=0   0 < 10   rooms = 1
s=5   5 < 10   rooms = 2        (two meetings overlap)
s=15  15 >= 10 reuse: e moves to 20
rooms = 2`,
        },
      ],
      interview: [
        { q: "حل أقل عدد غرف اجتماعات.", a: "الإجابة هي أقصى تداخل في نفس اللحظة. برتب البدايات لوحدها والنهايات لوحدها، وبمشي على البدايات: لو الاجتماع بدأ قبل أبكر نهاية لسه ما خلصتش فأزود غرفة، وإلا أعيد استخدام غرفة (أحرك مؤشر النهايات). الزمن O(n log n). بديل بـ min-heap على أوقات النهاية: نفس التعقيد.",
        },
      ],
    },
    {
      kicker: "الفخ",
      title: "Coin Change: امتى الجشع يشتغل وامتى يخون",
      en: "Coin change: greedy works, and a counterexample",
      body: "<p>أقل عدد عملات لتكوين مبلغ. الجشع: خد أكبر عملة تقدر عليها وكرر. مع عملات زي <code>[25, 10, 5, 1]</code> (الأمريكية، وكتير من العملات الحقيقية) ده صح. بس ده <b>خاصية للعملات دي</b> مش للمسألة. مع <code>[1, 3, 4]</code> والمبلغ 6: الجشع يختار 4 ثم 1 ثم 1 = 3 عملات، بينما الأمثل 3 + 3 = عملتين. وممكن الجشع يقول «مستحيل» وهو ممكن: <code>[4, 3]</code> والمبلغ 6.</p><p>القاعدة: مع عملات اعتباطية استخدم DP (المستوى الجاي). وده مثال قوي للإنترفيو: «ليه الجشع مش صح هنا؟» وإجابتك counterexample صغير.</p>",
      code: {
        lang: "dart",
        src: `int greedyCoins(List<int> coins, int amount) {
  final cs = [...coins]..sort((a, b) => b.compareTo(a));   // biggest first
  var count = 0;
  for (final c in cs) {
    count += amount ~/ c;
    amount %= c;
  }
  return amount == 0 ? count : -1;
}

// preview of a9: try every coin for every amount
int minCoins(List<int> coins, int amount) {
  final dp = List<int>.filled(amount + 1, amount + 1);   // amount + 1 = "impossible"
  dp[0] = 0;
  for (var a = 1; a <= amount; a++) {
    for (final c in coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
}

void main() {
  print(greedyCoins([25, 10, 5, 1], 63));   // 6
  print(minCoins([25, 10, 5, 1], 63));      // 6
  print(greedyCoins([1, 3, 4], 6));         // 3  (4 + 1 + 1)
  print(minCoins([1, 3, 4], 6));            // 2  (3 + 3)
  print(greedyCoins([4, 3], 6));            // -1 (greedy gives up)
  print(minCoins([4, 3], 6));               // 2
}`,
        note: "63 = 25 + 25 + 10 + 1 + 1 + 1 = 6 عملات. شغّل الاتنين على نفس المدخل وقارن: ده بالظبط أسلوب اكتشاف إن الجشع غلط.",
      },
      pitfall: "متفترضش إن greedy صح لأنها «طلعت صح» على مثالين. المثال الصح (counterexample) بيكسرها بسهولة. ابحث دايما عن مثال بيكسرها قبل ما تعتمد عليها.",
      interview: [
        { q: "هل الجشع بيحل Coin Change دايما؟ إيه المثال؟", a: "لأ. مع عملات زي [25, 10, 5, 1] بيشتغل، لكن مع [1, 3, 4] والمبلغ 6 الجشع بياخد 4 + 1 + 1 = 3 عملات والأمثل 3 + 3 = عملتين. فالحل العام DP، والجشع بيصلح بس لـ coin systems خاصة (canonical). الإثبات في الإنترفيو هو مثال واحد صغير بيكسر الاستراتيجية.",
        },
      ],
    },
    {
      kicker: "قفز",
      title: "Jump Game: أبعد نقطة توصلها",
      en: "Jump game, reach and minimum jumps",
      body: "<p><code>nums[i]</code> هو أقصى قفزة من الموضع i. <b>Jump Game</b>: هل توصل لآخر index؟ الجشع: امشي من الأول وفضل محتفظ بـ <code>reach</code> (أبعد موضع تقدر توصله لحد دلوقتي). لو وصلت لـ i أكبر من reach يبقى اتقفل الطريق. من غير ما نجرب كل القفزات.</p><p><b>Jump Game II</b> (أقل عدد قفزات، بافتراض إن الآخر قابل للوصول): نشتغل «بنطاقات» زي BFS: <code>curEnd</code> نهاية نطاق القفزة الحالية، و<code>far</code> أبعد ما نقدر نوصله من أي حاجة في النطاق ده. لما نوصل لنهاية النطاق، لازم نقفز (زوّد jumps) والنطاق الجديد يوصل لـ far.</p>",
      code: {
        lang: "dart",
        src: `bool canJump(List<int> nums) {
  var reach = 0;
  for (var i = 0; i < nums.length; i++) {
    if (i > reach) return false;             // cannot even stand on i
    if (i + nums[i] > reach) reach = i + nums[i];
  }
  return true;
}

// assumes the last index is reachable
int minJumps(List<int> nums) {
  var jumps = 0, curEnd = 0, far = 0;
  for (var i = 0; i < nums.length - 1; i++) {
    if (i + nums[i] > far) far = i + nums[i];
    if (i == curEnd) {                       // must jump now
      jumps++;
      curEnd = far;
    }
  }
  return jumps;
}

void main() {
  print(canJump([2, 3, 1, 1, 4]));    // true
  print(canJump([3, 2, 1, 0, 4]));    // false
  print(canJump([0]));                // true
  print(minJumps([2, 3, 1, 1, 4]));   // 2
  print(minJumps([1, 1, 1, 1]));      // 3
  print(minJumps([0]));               // 0
}`,
        note: "في <code>[3,2,1,0,4]</code> كل الطرق بتوصل للـ index 3 (القيمة 0) وتقف: reach ما بيعديش 3 فلما نوصل i = 4 بيفشل. الزمن O(n) والمساحة O(1).",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع minJumps على [2, 3, 1, 1, 4]",
          src: `i=0  far = max(0, 0+2) = 2    i == curEnd(0): jumps = 1, curEnd = 2
i=1  far = max(2, 1+3) = 4
i=2  far = 4                  i == curEnd(2): jumps = 2, curEnd = 4
i=3  far = 4                  (loop stops before the last index)
jumps = 2`,
        },
      ],
      interview: [
        { q: "حل Jump Game بالجشع.", a: "بمشي من اليسار وبحتفظ بـ reach: أبعد index أقدر أوصله لحد دلوقتي (max لـ i + nums[i]). لو وصلت لـ i أكبر من reach يبقى مقدرش أوصله فأرجع false، وإلا بكمل. لو خلصت اللف يبقى true. الزمن O(n) والمساحة O(1). الجشع هنا مضمون لأن أي موضع أصغر من reach أقدر أوصله فعلا.",
        },
      ],
    },
    {
      kicker: "التوزيع",
      title: "توزيع المهام والموارد: رتب الاتنين",
      en: "Assigning tasks: sort both sides",
      body: "<p>مسائل «وزع س على ص بأكبر عدد تطابق» غالبا بتتحل بترتيب الجانبين ومؤشرين. مثال <b>Assign Cookies</b>: أطفال كل واحد ليه جوع <code>g[i]</code> (أقل حجم بسكوتة يرضيه)، وبسكويت أحجامه <code>s[j]</code>، كل طفل ياخد بسكوتة واحدة بالكتير. أكبر عدد أطفال نرضيهم؟ نرتب الاتنين. نمشي على البسكويت من الأصغر: لو البسكوتة دي تكفي أصغر طفل لسه ما اترضاش، نرضيه. غير كده نجرب بسكوتة أكبر. ليه صح: أصغر بسكوتة تكفي أصغر طفل متضيعش بسكوتة كبيرة على جوع صغير (مبدأ التبديل برضه).</p><p>نفس الشكل: مهام بأوزان وعمال بقدرات، أو طلبات وسيارات بحمولات.</p>",
      code: {
        lang: "dart",
        src: `int assignCookies(List<int> greed, List<int> cookies) {
  final g = [...greed]..sort();
  final s = [...cookies]..sort();
  var child = 0;
  for (final c in s) {
    if (child < g.length && c >= g[child]) child++;   // this cookie fits
  }
  return child;
}

void main() {
  print(assignCookies([1, 2, 3], [1, 1]));       // 1
  print(assignCookies([1, 2], [1, 2, 3]));       // 2
  print(assignCookies([10, 9, 8], [5, 6, 7]));   // 0
  print(assignCookies([], [1]));                 // 0
}`,
        note: "الزمن O(n log n + m log m) للترتيب، واللف O(n + m).",
      },
      interview: [
        { q: "إزاي تحل مسألة توزيع زي Assign Cookies؟ وليه الترتيب ينفع؟", a: "برتب الجوع وأحجام البسكويت، وبمشي على البسكويت من الأصغر للأكبر، ولو البسكوتة تكفي أصغر طفل لسه ما اترضاش بديهاله. بكده بسكوتة صغيرة ماتضيعش على شخص جوعه أكبر منها، وبسكوتة كبيرة ماتضيعش على جوع صغير ممكن بسكوتة أصغر ترضيه. لو بدّلت أي توزيع أمثل لتوزيع الأصغر مع الأصغر مش بيقل العدد. الزمن O(n log n).",
        },
      ],
    },
    {
      kicker: "الاختبار",
      title: "إزاي تختبر فكرة جشعة قدام brute force",
      en: "Testing a greedy idea against brute force",
      body: "<p>مش دايما معاك وقت إثبات. الطريقة العملية: اكتب حل <b>بطيء بس مضمون</b> (يجرب كل المجموعات الفرعية، O(2^n)، لـ n صغير ≤ 6) وقارنه بالجشع على آلاف المدخلات العشوائية بـ seed ثابت. أول اختلاف بتلاقيه هو الـ counterexample اللي تشوفه بعينك وتفهم ليه الجشع غلط. في المثال: الجشع الصح (بوقت النهاية) مبيغلطش، والجشع الغلط (بوقت البداية) بيغلط في 80 من 1000.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:math';

int greedy(List<List<int>> iv, int sortBy) {
  if (iv.isEmpty) return 0;
  final a = [...iv]..sort((x, y) => x[sortBy].compareTo(y[sortBy]));
  var count = 1, end = a[0][1];
  for (var i = 1; i < a.length; i++) {
    if (a[i][0] >= end) {
      count++;
      end = a[i][1];
    }
  }
  return count;
}

int brute(List<List<int>> iv) {
  var best = 0;
  for (var mask = 0; mask < (1 << iv.length); mask++) {
    final pick = [
      for (var i = 0; i < iv.length; i++)
        if (mask & (1 << i) != 0) iv[i]
    ]..sort((a, b) => a[0].compareTo(b[0]));
    var ok = true;
    for (var i = 1; i < pick.length; i++) {
      if (pick[i][0] < pick[i - 1][1]) ok = false;
    }
    if (ok && pick.length > best) best = pick.length;
  }
  return best;
}

void main() {
  final rnd = Random(1);
  var wrongByEnd = 0, wrongByStart = 0;
  List<List<int>>? example;
  for (var t = 0; t < 1000; t++) {
    final n = 1 + rnd.nextInt(6);
    final iv = <List<int>>[];
    for (var i = 0; i < n; i++) {
      final s = rnd.nextInt(10);
      iv.add([s, s + 1 + rnd.nextInt(5)]);
    }
    final want = brute(iv);
    if (greedy(iv, 1) != want) wrongByEnd++;
    if (greedy(iv, 0) != want) {
      wrongByStart++;
      example ??= iv;
    }
  }
  print('sort by end wrong: $wrongByEnd');       // 0
  print('sort by start wrong: $wrongByStart');   // 80
  print(example);   // [[1, 2], [0, 5], [6, 9], [7, 8], [8, 12], [0, 5]]
}`,
        note: "المثال: الجشع بالبداية يختار [0,5] ثم [6,9] فقط (2)، والأمثل [1,2] و[7,8] و[8,12] = 3. اختبار بـ seed ثابت يتكرر بنفس النتيجة.",
      },
      points: [
        "الـ brute force بيكون قصير ومضمون؛ متحسبش وقته لأنه للاختبار بس.",
        "ركز على الحالات الحدية: قايمة فاضية، عنصر واحد، تكرارات، تعادل (ties).",
        "لو الجشع نجح على آلاف الحالات الصغيرة ده مش إثبات، لكنه ثقة عملية كبيرة. الإثبات الحقيقي هو الـ exchange argument.",
      ],
      interview: [
        { q: "إزاي تتأكد إن حل جشع صح لو معندكش إثبات؟", a: "بكتب brute force بطيء لكن واضح (يجرب كل الاحتمالات) وأقارنه بالجشع على آلاف المدخلات الصغيرة العشوائية بـ seed ثابت، وأطبع أول مدخل بيختلفوا فيه. ده بيكشف الاستراتيجيات الغلط بسرعة (زي الترتيب بالبداية في Activity Selection). وبعدها بحاول أثبتها بـ exchange argument.",
        },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: Activity Selection",
      lang: "dart",
      code: `int maxNonOverlapping(List<List<int>> iv) {
  if (iv.isEmpty) return 0;
  final a = [...iv]..sort((x, y) => x[1].compareTo(y[1]));
  var count = 1, end = a[0][1];
  for (var i = 1; i < a.length; i++) {
    if (a[i][0] >= end) {
      count++;
      end = a[i][1];
    }
  }
  return count;
}`,
      note: "رتب بوقت النهاية، واختار لما <code>start &gt;= end</code>.",
    },
    {
      title: "اكتب: Jump Game",
      lang: "dart",
      code: `bool canJump(List<int> nums) {
  var reach = 0;
  for (var i = 0; i < nums.length; i++) {
    if (i > reach) return false;
    if (i + nums[i] > reach) reach = i + nums[i];
  }
  return true;
}`,
      note: "reach = أبعد موضع ممكن. لو i عدّت reach يبقى مقفول.",
    },
    {
      title: "اكتب: Merge Intervals",
      lang: "dart",
      code: `List<List<int>> mergeIntervals(List<List<int>> iv) {
  if (iv.isEmpty) return [];
  final a = [for (final x in iv) [...x]]
    ..sort((p, q) => p[0].compareTo(q[0]));
  final res = <List<int>>[a[0]];
  for (var i = 1; i < a.length; i++) {
    final last = res.last;
    if (a[i][0] <= last[1]) {
      if (a[i][1] > last[1]) last[1] = a[i][1];
    } else {
      res.add(a[i]);
    }
  }
  return res;
}`,
      note: "رتب بالبداية. مدّد النهاية بـ max، ما تقلّلهاش.",
    },
  ],

  tasks: [
    {
      title: "أرباح الأسهم (بيع وشراء كتير)",
      lang: "dart",
      prompt: "<p>القايمة <code>prices</code> هي سعر سهم في كل يوم. تقدر تشتري وتبيع كام مرة تحب، بس تحمل سهم واحد في اللحظة (لازم تبيع قبل ما تشتري تاني). اكتب <code>int maxProfit(List&lt;int&gt; prices)</code> ترجع أكبر ربح ممكن (0 لو مفيش).</p>",
      examples: [
        { in: "maxProfit([7, 1, 5, 3, 6, 4])", out: "7" },
        { in: "maxProfit([1, 2, 3, 4, 5])", out: "4" },
        { in: "maxProfit([7, 6, 4, 3, 1])", out: "0" },
      ],
      starter: `int maxProfit(List<int> prices) {
  // your code
}`,
      hints: [
        "كل يوم فيه ارتفاع عن اللي قبله هو فرصة ربح.",
        "اجمع كل الفروق الموجبة بين يومين متتاليين.",
      ],
      solution: `int maxProfit(List<int> prices) {
  var profit = 0;
  for (var i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1];
    }
  }
  return profit;
}`,
      explain: "أي صفقة طويلة (من قاع لقمة) هي مجموع الفروق اليومية بين القاع والقمة، فتجميع كل الفروق الموجبة بيلقط كل الصعودات. exchange argument بسيط: مفيش حل أفضل من إنك تاخد كل صعود. الزمن O(n) والمساحة O(1).",
    },
    {
      title: "أقل عدد سهام للبالونات",
      lang: "dart",
      prompt: "<p>كل بالونة هي مدى على محور x: <code>[xStart, xEnd]</code> (شامل الطرفين). سهم عند x بيفجر كل بالونة <code>xStart &lt;= x &lt;= xEnd</code>. اكتب <code>int findMinArrowShots(List&lt;List&lt;int&gt;&gt; points)</code> ترجع أقل عدد سهام لتفجير الكل.</p>",
      examples: [
        { in: "findMinArrowShots([[10, 16], [2, 8], [1, 6], [7, 12]])", out: "2" },
        { in: "findMinArrowShots([[1, 2], [3, 4], [5, 6], [7, 8]])", out: "4" },
        { in: "findMinArrowShots([[1, 2], [2, 3], [3, 4], [4, 5]])", out: "2" },
      ],
      starter: `int findMinArrowShots(List<List<int>> points) {
  // your code
}`,
      hints: [
        "شبه Activity Selection: رتب بوقت النهاية.",
        "اضرب أول سهم عند نهاية أول بالونة (أبعد نقطة تفجرها وتفضل في أكبر عدد بالونات). كل بالونة بتبدأ <b>بعد</b> السهم مش اتفجرت.",
        "لما تلاقي بالونة start بتاعها أكبر من آخر سهم، اضرب سهم جديد عند نهايتها.",
      ],
      solution: `int findMinArrowShots(List<List<int>> points) {
  if (points.isEmpty) return 0;
  final a = [...points]..sort((x, y) => x[1].compareTo(y[1]));
  var arrows = 1, shot = a[0][1];
  for (var i = 1; i < a.length; i++) {
    if (a[i][0] > shot) {        // missed by the last arrow
      arrows++;
      shot = a[i][1];
    }
  }
  return arrows;
}`,
      explain: "الفرق عن Activity Selection إن اللمس (البداية = السهم) بيتفجر، فالشرط <code>&gt;</code> مش <code>&gt;=</code>. السهم عند نهاية أبكر بالونة هو الأحسن: بيفجرها وبيفضل ممكن يفجر أكتر بالونات ممكنة (exchange argument). الزمن O(n log n).",
    },
    {
      title: "محطة البنزين الدايرية",
      lang: "dart",
      prompt: "<p>فيه محطات بنزين على دايرة. <code>gas[i]</code> كمية البنزين اللي بتاخدها من المحطة i، و<code>cost[i]</code> اللي بتصرفها للوصول من i للمحطة اللي بعدها (والدايرة تلف). تبدأ بتانك فاضي. اكتب <code>int canCompleteCircuit(List&lt;int&gt; gas, List&lt;int&gt; cost)</code> ترجع index المحطة اللي لو بدأت منها تقدر تلف دايرة كاملة (متوقع إنه وحيد لو موجود)، أو <code>-1</code>.</p>",
      examples: [
        { in: "canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2])", out: "3" },
        { in: "canCompleteCircuit([2, 3, 4], [3, 4, 3])", out: "-1" },
        { in: "canCompleteCircuit([5], [4])", out: "0" },
      ],
      starter: `int canCompleteCircuit(List<int> gas, List<int> cost) {
  // your code
}`,
      hints: [
        "لو مجموع البنزين أقل من مجموع التكاليف مستحيل أصلا.",
        "امشي بتانك افتراضي. لو بقى سالب عند محطة i، مفيش محطة من البداية لحد i تنفع كبداية. ابدأ من i + 1 وصفّر التانك.",
        "في الآخر لو المجموع الكلي >= 0 فالبداية الأخيرة هي الجواب.",
      ],
      solution: `int canCompleteCircuit(List<int> gas, List<int> cost) {
  var total = 0, tank = 0, start = 0;
  for (var i = 0; i < gas.length; i++) {
    final diff = gas[i] - cost[i];
    total += diff;
    tank += diff;
    if (tank < 0) {          // cannot reach i + 1 from any start so far
      start = i + 1;
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;
}`,
      explain: "لو البداية s وقفنا عند i (التانك سالب)، فأي بداية بين s و i هتوصل لـ i بتانك أقل أو يساوي (لأنها هتبدأ بعد ما شالت جزء موجب)، يعني برضه هتفشل. فبنتخطى لـ i + 1. لو المجموع الكلي >= 0 فالبداية الأخيرة مضمونة. الزمن O(n) والمساحة O(1).",
    },
  ],

  quiz: [
    {
      q: "كام أكبر عدد أنشطة مش متداخلة هنا؟ (اللمس مسموح: النهاية = البداية)",
      code: { lang: "text", src: `[1, 2]  [2, 3]  [3, 4]  [1, 3]` },
      answer: ["3"],
      why: "بالترتيب بوقت النهاية: [1,2] [2,3] ثم [1,3] تتداخل مع [2,3] فتتخطى، وبعدين [3,4]. يطلع [1,2] [2,3] [3,4] = 3.",
    },
    {
      q: "في Activity Selection، ليه الاختيار بوقت النهاية الأبكر صح؟",
      options: [
        "لأنه الأسرع في التنفيذ",
        "لأن النشاط اللي بينتهي أبكر بيسيب أكبر مساحة للباقي، وأي حل أمثل ممكن نبدّل أول نشاط فيه بيه من غير ما نكسره",
        "لأن النشاط الأقصر هو دايما اللي بينتهي أبكر",
        "لأنها بتجرب كل الاحتمالات",
      ],
      answer: 1,
      why: "ده الـ exchange argument. والأقصر مش لازم ينتهي أبكر (والاستراتيجية بالأقصر بتفشل بمثال [0,5] [4,6] [5,10]). وهي جشعة مش بتجرب كل الاحتمالات.",
    },
    {
      q: "greedy لـ Coin Change بعملات [1, 3, 4] والمبلغ 6 بترجع كام عملة؟",
      answer: ["3"],
      why: "الجشع بياخد 4 ثم 1 ثم 1 = 3 عملات. الأمثل 3 + 3 = عملتين، فالجشع غلط هنا.",
    },
    {
      q: "إيه أداة إثبات صحة greedy الأشهر؟",
      options: [
        "إنها طلعت صح على كام مثال",
        "إنها بتشتغل في O(n log n)",
        "إن الـ recursion بتنتهي",
        "exchange argument: أبدّل أول اختيار في أي حل أمثل باختياري ويفضل صالح وبنفس الجودة",
      ],
      answer: 3,
      why: "الأمثلة والسرعة مش إثبات. الـ exchange argument هو اللي بيضمن إن الاختيار الجشع جزء من حل أمثل.",
    },
    {
      q: "ناتج <code>mergeIntervals([[1, 4], [2, 3], [6, 8]])</code>؟",
      answer: ["[[1, 4], [6, 8]]", "[[1,4],[6,8]]"],
      why: "[2,3] جوه [1,4] بالكامل فنمدد النهاية بـ max(4, 3) = 4 مش 3. [6,8] بدايتها 6 بعد 4 فتتضاف لوحدها.",
    },
    {
      q: "أقل عدد غرف لاجتماعات <code>[[0,30],[5,10],[15,20]]</code>؟",
      answer: ["2"],
      why: "الاجتماع [0,30] شغال طول الوقت، و[5,10] و[15,20] مش متداخلين مع بعض، فأقصى تداخل في نفس اللحظة اتنين.",
    },
    {
      q: "إيه الغلط في ده؟ (المفروض يرجع هل نوصل لآخر index)",
      code: { lang: "dart", src: `bool canJump(List<int> nums) {
  var reach = 0;
  for (var i = 0; i < nums.length; i++) {
    if (i > reach) return false;
    reach = nums[i];
  }
  return true;
}` },
      options: [
        "<code>reach = nums[i]</code> بتنسى الموضع الحالي ومبتاخدش الأكبر، المفروض <code>reach = max(reach, i + nums[i])</code>",
        "الشرط <code>i &gt; reach</code> لازم يكون <code>i &gt;= reach</code>",
        "لازم نبدأ اللف من آخر index",
        "مفيش غلط",
      ],
      answer: 0,
      why: "reach لازم يكون أبعد موضع بالمطلق (i + nums[i]) وبياخد max مع اللي قبله. مثلا [2,0,0]: الكود الغلط يخلي reach = 0 عند i=1 ويرجع false رغم إن الإجابة true.",
    },
    {
      q: "كل اللي نجح معاك مع greedy على 3 أمثلة. إيه أحسن خطوة تالية؟",
      options: [
        "أسلّم الحل، الأمثلة كفاية",
        "أحوّله لـ DP من غير تفكير",
        "أقارنه بحل brute force على آلاف مدخلات صغيرة عشوائية وأحاول أثبته بـ exchange argument",
        "أزود الأمثلة لحد ما أحس إنه صح",
      ],
      answer: 2,
      why: "الاختبار العشوائي قدام حل مضمون بيكشف الـ counterexamples اللي مش بتخطر على بالك. الأمثلة اليدوية القليلة بتفوّت حالات كتير.",
    },
    {
      q: "الترتيب بالأقصر الأول في Activity Selection بيفشل على أي مدخل؟",
      options: [
        "[[1, 2], [3, 4]]",
        "[[1, 5], [6, 10]]",
        "[[0, 5], [4, 6], [5, 10]]",
        "[[0, 1], [0, 1]]",
      ],
      answer: 2,
      why: "الأقصر [4,6] (طول 2) بيتداخل مع [0,5] وبيتداخل مع [5,10] فهو يعمل 1 فقط. الأمثل [0,5] و[5,10] = 2. الباقي الأقصر أول فيها بيدّي الإجابة الصح.",
    },
    {
      q: "تعقيد Merge Intervals؟",
      options: [
        "O(n)",
        "O(n^2)",
        "O(n log n) بسبب الترتيب، واللف بعده O(n)",
        "O(log n)",
      ],
      answer: 2,
      why: "الترتيب هو الجزء الأغلى O(n log n). اللف الواحد على الفترات المرتبة O(n). مفيش طريقة لتفادي الترتيب بشكل عام.",
    },
  ],
};
