window.LEVELS = window.LEVELS || {};
window.LEVELS["algo/a4"] = {
  slides: [
    {
      kicker: "ليه",
      title: "من O(n²) لـ O(n) بمؤشرين",
      en: "Two pointers and sliding window: the idea",
      body: "<p>أبسط حل لمسائل الأزواج والـ subarrays هو لوب جوه لوب: O(n²). الأسلوبين دول بيستغلوا خاصية في الداتا (الترتيب، أو إن الأرقام موجبة) علشان <b>مؤشرين بيتحركوا في اتجاه واحد مرة واحدة</b> بدل ما يبدأوا من الأول في كل مرة. النتيجة O(n).</p>",
      points: [
        "<b>مؤشرين من الأطراف</b> (opposite): واحد من الأول وواحد من الآخر، وبيتقابلوا في النص. بيحتاج غالبا مصفوفة <b>مرتبة</b> أو تماثل (palindrome).",
        "<b>مؤشرين في نفس الاتجاه</b> (same direction): واحد بيقرأ وواحد بيكتب (حذف التكرارات)، أو واحد سريع وواحد بطيء.",
        "<b>نافذة ثابتة</b> (fixed window): حجمها k، بتتحرك خطوة خطوة بإضافة عنصر جديد وحذف قديم.",
        "<b>نافذة متغيرة</b> (variable window): بتتوسع من اليمين وتضيق من الشمال حسب شرط.",
      ],
      codes: [
        {
          lang: "text",
          title: "إزاي تعرف الأسلوب من نص المسألة",
          src: `"sorted array" + "pair/triple with sum"        -> opposite pointers
"palindrome", "reverse in place"                 -> opposite pointers
"in place", "remove", "partition", "merge"       -> same-direction (read/write)
"subarray/substring of size k"                   -> fixed window
"longest/shortest subarray/substring such that"  -> variable window
(all numbers must be positive for sum windows)`,
        },
      ],
      focus: [{ label: "احفظها", text: "السؤال اللي تسأله: «لو حركت المؤشر ده، هل أقدر أثبت إني مش بضيع إجابة؟». لو أيوه، مؤشرين بيكفوا." }],
    },
    {
      kicker: "من الأطراف",
      title: "Two Sum في مصفوفة مرتبة",
      en: "Opposite pointers: pair with target sum",
      body: "<p>مصفوفة مرتبة وعايز زوج مجموعه <code>target</code>. حط <code>l</code> في الأول و<code>r</code> في الآخر. احسب <code>s = a[l] + a[r]</code>. لو <code>s</code> أصغر من الهدف، نحتاج مجموع أكبر والطريقة الوحيدة إننا نحرك <code>l</code> يمين (لأن <code>r</code> ده أكبر عنصر ممكن يتجمع مع <code>a[l]</code> وده لسه صغير، يبقى <code>a[l]</code> مبينفعش مع أي حد). لو أكبر، نحرك <code>r</code> شمال بنفس المنطق. كل خطوة بتستبعد عنصر بالكامل، فعدد الخطوات حد أقصى n.</p>",
      code: {
        lang: "dart",
        src: `List<int> twoSumSorted(List<int> a, int target) {
  var l = 0, r = a.length - 1;
  while (l < r) {
    final s = a[l] + a[r];
    if (s == target) return [l, r];
    if (s < target) {
      l++;
    } else {
      r--;
    }
  }
  return [];
}

void main() {
  print(twoSumSorted([1, 2, 4, 7, 11, 15], 15));  // [2, 4]
  print(twoSumSorted([1, 2, 3], 10));             // []
  print(twoSumSorted([], 1));                     // []
  print(twoSumSorted([5], 5));                    // []
  print(twoSumSorted([3, 3], 6));                 // [0, 1]
}`,
        note: "الشرط <code>l &lt; r</code> (مش <code>&lt;=</code>) لأن الزوج لازم يكون عنصرين مختلفين.",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع [1, 2, 4, 7, 11, 15] والهدف 15",
          src: `l=0 r=5   1+15=16   too big   -> r--
l=0 r=4   1+11=12   too small -> l++
l=1 r=4   2+11=13   too small -> l++
l=2 r=4   4+11=15   found [2, 4]`,
        },
      ],
      interview: [
        { q: "مصفوفة مرتبة، لاقي زوج مجموعه target في O(n) ومساحة O(1). وليه الحل صح؟", a: "مؤشر في الأول ومؤشر في الآخر. لو المجموع أصغر من الهدف أحرك الشمال يمين، لو أكبر أحرك اليمين شمال. الحل صح لأن لو المجموع أصغر، العنصر الشمال مع أكبر شريك ممكن (a[r]) لسه أصغر من الهدف، فمفيش شريك ينفع له وأقدر أستبعده. كل خطوة بتستبعد عنصر فالزمن O(n). لو المصفوفة مش مرتبة بستخدم hash set بدل كده.",
        },
      ],
    },
    {
      kicker: "من الأطراف",
      title: "Container With Most Water",
      en: "Container with most water",
      body: "<p>أعمدة ارتفاعاتها <code>h</code>، اختار عمودين يكوّنوا حاوية أكبر مساحة ماء: <code>المساحة = (r - l) × min(h[l], h[r])</code>. ابدأ بأعرض حاوية (الطرفين). بعد كده الحاوية الأعرض لو كبرت المساحة لازم الارتفاع يزيد، والارتفاع محكوم بالعمود <b>الأقصر</b>. فلو حركت الأطول بتكسب عرض أقل وارتفاع مش هيزيد (لسه محكوم بالأقصر) يبقى مش هتكسب. يبقى الحركة الوحيدة المفيدة: حرك المؤشر عند العمود الأقصر.</p>",
      code: {
        lang: "dart",
        src: `int maxArea(List<int> h) {
  var l = 0, r = h.length - 1, best = 0;
  while (l < r) {
    final w = r - l;
    final hh = h[l] < h[r] ? h[l] : h[r];
    if (w * hh > best) best = w * hh;
    if (h[l] < h[r]) {
      l++;
    } else {
      r--;
    }
  }
  return best;
}

void main() {
  print(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));   // 49
  print(maxArea([1, 1]));                         // 1
  print(maxArea([5]));                            // 0
  print(maxArea([]));                             // 0
}`,
        note: "الأفضل 49 = عرض 7 (بين index 1 و 8) × ارتفاع 7.",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع [1, 8, 6, 2, 5, 4, 8, 3, 7]",
          src: `l=0 r=8 area=8    best=8    h[0]=1 is shorter -> l++
l=1 r=8 area=49   best=49   h[8]=7 is shorter -> r--
l=1 r=7 area=18   best=49   -> r--
l=1 r=6 area=40   best=49   -> r--
l=1 r=5 area=16   best=49   -> r--
l=1 r=4 area=15   best=49   -> r--
l=1 r=3 area=4    best=49   -> r--
l=1 r=2 area=6    best=49   done`,
        },
      ],
      pitfall: "تحريك الأطول هو الغلط الشائع. بالمنطق: الأقصر هو اللي بيحدد الارتفاع، فأي حاوية جديدة مع نفس العمود الأقصر أضيق ومفيش ارتفاع أكبر، يعني حاوية أسوأ بالتأكيد.",
      interview: [
        { q: "إزاي تحل Container With Most Water في O(n)؟ وليه تحرك الأقصر؟", a: "مؤشر في كل طرف، أحسب المساحة (العرض × الأقصر) وأحتفظ بالأكبر. بحرك المؤشر عند العمود الأقصر. السبب: أي حاوية بتنتهي عند العمود الأقصر ده وبعرض أقل ارتفاعها لسه محكوم بيه أو أقل، فمساحتها أصغر من الحالية، يعني أقدر أستبعد العمود ده تماما. كل خطوة بتستبعد عمود فالزمن O(n).",
        },
      ],
    },
    {
      kicker: "من الأطراف",
      title: "Palindrome بمؤشرين",
      en: "Palindrome check",
      body: "<p>مقارنة أول حرف بآخر حرف، وبعدين اللي بعدهم، لحد ما يتقابلوا. بتفضل O(n) زمن و O(1) مساحة (من غير ما تعمل نسخة معكوسة). لو المسألة تتجاهل الرموز والمسافات (زي «A man, a plan, a canal: Panama») نعدي الحروف الغير حرفية بتحريك المؤشر.</p>",
      code: {
        lang: "dart",
        src: `bool isPalindrome(String s) {
  var l = 0, r = s.length - 1;
  bool alnum(String c) => RegExp(r'[a-zA-Z0-9]').hasMatch(c);
  while (l < r) {
    if (!alnum(s[l])) {
      l++;
      continue;
    }
    if (!alnum(s[r])) {
      r--;
      continue;
    }
    if (s[l].toLowerCase() != s[r].toLowerCase()) return false;
    l++;
    r--;
  }
  return true;
}

void main() {
  print(isPalindrome('A man, a plan, a canal: Panama'));  // true
  print(isPalindrome('race a car'));                      // false
  print(isPalindrome(''));                                // true
  print(isPalindrome('a'));                               // true
}`,
        note: "الفاضي وحرف واحد palindrome. اللوب مبتدخلش لأن <code>l &lt; r</code> false.",
      },
    },
    {
      kicker: "نفس الاتجاه",
      title: "حذف التكرارات ودمج مرتبتين في المكان",
      en: "Same-direction pointers: read and write",
      body: "<p>مؤشر <code>r</code> بيقرأ كل عنصر، و<code>w</code> بيكتب فقط اللي يستاهل يتحفظ. <b>Remove Duplicates from Sorted Array</b>: كتابة العنصر لو مختلف عن آخر عنصر اتكتب. الدالة بترجع الطول الجديد، والباقي بعدها ميهمش.</p><p><b>دمج مصفوفتين مرتبتين في المكان</b>: لو <code>a</code> فيها مكان فاضي في الآخر بعدد عناصر <code>b</code>، ادمج من <b>الآخر</b> للأول: ضع الأكبر في آخر خانة. كده مفيش عنصر بيتكتب عليه قبل ما يتقرا.</p>",
      code: {
        lang: "dart",
        src: `int removeDuplicates(List<int> a) {
  if (a.isEmpty) return 0;
  var w = 1;                      // next write slot
  for (var r = 1; r < a.length; r++) {
    if (a[r] != a[w - 1]) {
      a[w] = a[r];
      w++;
    }
  }
  return w;
}

// a has m real items followed by n free slots
void mergeInPlace(List<int> a, int m, List<int> b, int n) {
  var i = m - 1, j = n - 1, k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && a[i] > b[j]) {
      a[k--] = a[i--];
    } else {
      a[k--] = b[j--];
    }
  }
}

void main() {
  final a = [1, 1, 2, 2, 2, 3];
  final k = removeDuplicates(a);
  print(k);                    // 3
  print(a.sublist(0, k));      // [1, 2, 3]

  final x = [1, 3, 5, 0, 0, 0];
  mergeInPlace(x, 3, [2, 4, 6], 3);
  print(x);                    // [1, 2, 3, 4, 5, 6]
  final y = [4, 5, 0, 0];
  mergeInPlace(y, 2, [1, 2], 2);
  print(y);                    // [1, 2, 4, 5]
}`,
        note: "لو b خلصت (j &lt; 0) الباقي من a في مكانه فعلا. لو a خلصت (i &lt; 0) بنكمل نكتب باقي b.",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع removeDuplicates على [1, 1, 2, 2, 2, 3]",
          src: `r=1  a[1]=1 equals a[w-1]=1  skip              w=1
r=2  a[2]=2 differs          a[1]=2    w=2
r=3  a[3]=2 equals a[1]=2    skip      w=2
r=4  a[4]=2 equals           skip      w=2
r=5  a[5]=3 differs          a[2]=3    w=3
result: 3, first three slots = [1, 2, 3]`,
        },
      ],
      interview: [
        { q: "ليه دمج مصفوفتين مرتبتين في المكان بيتعمل من الآخر؟", a: "لأن لو بدأت من الأول هضطر أزيح عناصر a لليمين علشان أفتح مكان لعنصر من b، وده O(n²). من الآخر المكان الفاضي موجود فعلا في آخر a، فبحط الأكبر من العنصرين في آخر خانة ومفيش عنصر بيتكتب عليه قبل ما يتقرا. الزمن O(m + n) ومساحة O(1).",
        },
      ],
    },
    {
      kicker: "نافذة ثابتة",
      title: "أكبر مجموع لـ k عناصر متتالية",
      en: "Fixed-size sliding window",
      body: "<p>الحل البدائي بيحسب مجموع كل نافذة من الصفر: O(n × k). الحل الذكي: مجموع النافذة اللي بعدها = اللي قبلها + العنصر الجديد - العنصر اللي خرج. كل خطوة O(1) فالإجمالي O(n).</p>",
      code: {
        lang: "dart",
        src: `int maxSumK(List<int> a, int k) {
  if (k <= 0 || k > a.length) return 0;
  var sum = 0;
  for (var i = 0; i < k; i++) {
    sum += a[i];                  // first window
  }
  var best = sum;
  for (var i = k; i < a.length; i++) {
    sum += a[i] - a[i - k];       // slide: add new, drop old
    if (sum > best) best = sum;
  }
  return best;
}

void main() {
  print(maxSumK([2, 1, 5, 1, 3, 2], 3));   // 9
  print(maxSumK([1, 2], 3));               // 0 (k too big)
  print(maxSumK([4], 1));                  // 4
  print(maxSumK([-1, -2, -3], 2));         // -3
}`,
        note: "الأرقام السالبة عادي هنا لأن حجم النافذة ثابت. قررنا إن k أكبر من الطول بترجع 0، وده اتفاق في المسألة مش قانون.",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع [2, 1, 5, 1, 3, 2] و k = 3",
          src: `window [2,1,5]  sum 8
window [1,5,1]  sum 8 + 1 - 2 = 7
window [5,1,3]  sum 7 + 3 - 1 = 9   <- best
window [1,3,2]  sum 9 + 2 - 5 = 6`,
        },
      ],
      interview: [
        { q: "إيه الفرق بين brute force وsliding window في أكبر مجموع k عناصر؟", a: "brute force بيحسب مجموع كل نافذة من الأول: O(n × k). sliding window بتحسب أول نافذة وبعدين لكل خطوة بتضيف العنصر الداخل وتشيل الخارج في O(1)، فالكل O(n) ومساحة O(1). الفكرة إن النوافذ المتتالية بتشترك في k-1 عنصر.",
        },
      ],
    },
    {
      kicker: "نافذة متغيرة",
      title: "أطول substring من غير تكرار",
      en: "Variable window: longest substring without repeating characters",
      body: "<p>القالب: <code>right</code> بتتحرك عنصر عنصر وتوسّع النافذة. لو الشرط اتكسر (ظهر حرف مكرر) نضيّق من الشمال (<code>left++</code>) لحد ما يرجع الشرط سليم. بعد كل توسيع (بعد ما النافذة تبقى سليمة) نسجل الأفضل. نحتفظ بـ <code>Set</code> للحروف الموجودة في النافذة.</p>",
      code: {
        lang: "dart",
        src: `int longestUnique(String s) {
  final seen = <String>{};
  var left = 0, best = 0;
  for (var right = 0; right < s.length; right++) {
    while (seen.contains(s[right])) {   // shrink until valid
      seen.remove(s[left]);
      left++;
    }
    seen.add(s[right]);
    if (right - left + 1 > best) best = right - left + 1;
  }
  return best;
}

void main() {
  print(longestUnique('abcabcbb'));   // 3
  print(longestUnique('bbbbb'));      // 1
  print(longestUnique('pwwkew'));     // 3
  print(longestUnique(''));           // 0
  print(longestUnique('abba'));       // 2
}`,
        note: "كل حرف بيدخل الـ Set مرة ويطلع مرة على الأكتر، فالإجمالي O(n) رغم الـ while جوه الـ for.",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع 'pwwkew'",
          src: `right=0  window "p"    len 1
right=1  window "pw"   len 2
right=2  'w' repeated: drop 'p', drop 'w' -> window "w"   len 1
right=3  window "wk"   len 2
right=4  window "wke"  len 3   <- best
right=5  'w' repeated: drop 'w' -> window "kew"  len 3`,
        },
      ],
      pitfall: "الغلط الشائع في 'abba': لو بدل الـ while استخدمت if ومعاها خريطة بآخر ظهور وحركت left لورا، النافذة بتتحرك لورا وتدّي نتيجة أكبر من الصحيحة. الـ while مع Set بيتفادى ده، أو لو بتستخدم Map لازم <code>left = max(left, last + 1)</code>.",
      interview: [
        { q: "اكتب Longest Substring Without Repeating Characters وقول التعقيد.", a: "نافذة [left, right] وSet للحروف اللي جواها. بحرك right، ولو الحرف الجديد موجود في الـ Set أشيل من left وأزود left لحد ما يختفي التكرار، وبعدين أضيف الحرف وأحدّث أكبر طول. كل حرف بيدخل ويخرج من النافذة مرة واحدة فالزمن O(n)، والمساحة O(min(n, حجم الأبجدية)).",
        },
      ],
    },
    {
      kicker: "نافذة متغيرة",
      title: "أقصر subarray مجموعه على الأقل S",
      en: "Variable window: minimum size subarray sum",
      body: "<p>أرقام <b>موجبة</b> وهدف <code>target</code>. وسّع النافذة باليمين وجمّع. طول ما المجموع <code>&gt;= target</code>: سجل الطول، وبعدين ضيّق من الشمال (اطرح <code>a[left]</code> وزوّد <code>left</code>) علشان تدور على نافذة أقصر. هنا الشرط هو «<b>المجموع كفاية</b>» وبنضيق طول ما هو متحقق، عكس المثال اللي فات اللي بنضيق فيه طول ما الشرط مكسور.</p>",
      code: {
        lang: "dart",
        src: `int minSubLen(List<int> a, int target) {
  var left = 0, sum = 0;
  var best = a.length + 1;           // impossible length = "not found"
  for (var right = 0; right < a.length; right++) {
    sum += a[right];
    while (sum >= target) {
      if (right - left + 1 < best) best = right - left + 1;
      sum -= a[left];
      left++;
    }
  }
  return best == a.length + 1 ? 0 : best;
}

void main() {
  print(minSubLen([2, 3, 1, 2, 4, 3], 7));   // 2  ([4, 3])
  print(minSubLen([1, 1, 1], 10));           // 0
  print(minSubLen([], 1));                   // 0
  print(minSubLen([10], 7));                 // 1
  print(minSubLen([1, 4, 4], 4));            // 1
}`,
        note: "لو مفيش نافذة مجموعها كفاية بنرجع 0.",
      },
      codes: [
        {
          lang: "text",
          title: "كل مرة المجموع >= 7 على [2, 3, 1, 2, 4, 3]",
          src: `right=3 left=0 sum=8 len=4
right=4 left=1 sum=10 len=4
right=4 left=2 sum=7 len=3
right=5 left=3 sum=9 len=3
right=5 left=4 sum=7 len=2   <- best ([4, 3])`,
        },
      ],
      interview: [
        { q: "ليه sliding window على مجموع بتشتغل بس لو الأرقام موجبة؟", a: "لأن الاعتماد على إن توسيع النافذة بيزود المجموع وتضييقها بينقصه. لو فيه أرقام سالبة، توسيع النافذة ممكن ينقص المجموع وتضييقها ممكن يزوده، فمقدرش أحكم إن تحريك left مش بيضيع إجابة. وقتها بستخدم prefix sums مع hash map (أو مع deque في بعض المسائل).",
        },
      ],
    },
    {
      kicker: "القرار",
      title: "امتى تضيّق؟ وإزاي بقت O(n)؟",
      en: "When to shrink, and why it is O(n)",
      body: "<p>في النافذة المتغيرة فيه سؤال واحد تسأله: <b>إيه الشرط اللي لو اتكسر النافذة تبقى «مش صالحة»؟</b></p>",
      points: [
        "لو المطلوب <b>أطول</b> نافذة صالحة (أطول substring من غير تكرار): ضيّق <b>طول ما النافذة مش صالحة</b>، وبعدها سجّل.",
        "لو المطلوب <b>أقصر</b> نافذة تحقق شرط (مجموع كفاية): سجّل وضيّق <b>طول ما النافذة بتحقق الشرط</b>.",
        "<b>ليه O(n)</b>: <code>right</code> بيعدي على كل عنصر مرة، و<code>left</code> بيعدي على كل عنصر مرة. مفيش واحد منهم بيرجع لورا. الـ while جوه الـ for مش بتضرب، هي بتتوزع (amortized): مجموع لفات الـ while على كل الـ for ≤ n.",
        "شرط النجاح: الخاصية «تضيّق النافذة تبقى أسهل» لازم تكون monotone (أرقام موجبة، أو حروف مكررة).",
        "لو الأرقام ممكن تبقى سالبة، أو بتدور على مجموع بالظبط، استخدم prefix sums + Map.",
      ],
      pitfall: "نسيان تسجيل الإجابة في المكان الصح: في 'الأطول' تسجّل بعد ما النافذة تتصلح، وفي 'الأقصر' تسجّل داخل الـ while. وكمان نسيان تحديث الحالة (المجموع أو الـ Set) لما left بتتحرك.",
      interview: [
        { q: "في sliding window فيه while جوه for. ليه مش O(n²)؟", a: "لأن المؤشرين بيتحركوا لقدام بس. <code>right</code> بيزيد n مرة، و<code>left</code> بيزيد على الأكتر n مرة في الإجمالي على كل لفات الـ for مش لكل لفة لوحدها. فمجموع شغل الـ while كله ≤ n، وإجمالي الزمن 2n = O(n). ده تحليل amortized.",
        },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: Two Sum على مرتبة",
      lang: "dart",
      code: `List<int> twoSumSorted(List<int> a, int target) {
  var l = 0, r = a.length - 1;
  while (l < r) {
    final s = a[l] + a[r];
    if (s == target) return [l, r];
    if (s < target) {
      l++;
    } else {
      r--;
    }
  }
  return [];
}`,
      note: "حرك الشمال لو المجموع صغير، واليمين لو كبير.",
    },
    {
      title: "اكتب: أكبر مجموع نافذة k",
      lang: "dart",
      code: `int maxSumK(List<int> a, int k) {
  if (k <= 0 || k > a.length) return 0;
  var sum = 0;
  for (var i = 0; i < k; i++) {
    sum += a[i];
  }
  var best = sum;
  for (var i = k; i < a.length; i++) {
    sum += a[i] - a[i - k];
    if (sum > best) best = sum;
  }
  return best;
}`,
      note: "أول نافذة تتحسب بلوب، وبعدين نزلق.",
    },
    {
      title: "اكتب: أطول substring بدون تكرار",
      lang: "dart",
      code: `int longestUnique(String s) {
  final seen = <String>{};
  var left = 0, best = 0;
  for (var right = 0; right < s.length; right++) {
    while (seen.contains(s[right])) {
      seen.remove(s[left]);
      left++;
    }
    seen.add(s[right]);
    if (right - left + 1 > best) best = right - left + 1;
  }
  return best;
}`,
      note: "اختبرها على 'pwwkew' (الناتج 3) و'abba' (الناتج 2).",
    },
  ],

  tasks: [
    {
      title: "حذف التكرارات في المكان",
      lang: "dart",
      prompt: "<p>اكتب <code>int removeDuplicates(List&lt;int&gt; a)</code> على قايمة <b>مرتبة</b>: تخلي كل قيمة تظهر مرة واحدة في بداية القايمة (في المكان، من غير قايمة جديدة)، وترجع عدد العناصر الفريدة <code>k</code>. أول k خانات هي الناتج.</p>",
      examples: [
        { in: "removeDuplicates([1, 1, 2, 2, 2, 3])", out: "3   (a starts with [1, 2, 3])" },
        { in: "removeDuplicates([])", out: "0" },
        { in: "removeDuplicates([1, 1, 1])", out: "1" },
      ],
      starter: `int removeDuplicates(List<int> a) {
  // your code
}`,
      hints: [
        "مؤشر <code>w</code> للكتابة يبدأ من 1، و<code>r</code> بيقرأ من 1.",
        "اكتب <code>a[r]</code> في <code>a[w]</code> لو مختلف عن <code>a[w - 1]</code>.",
      ],
      solution: `int removeDuplicates(List<int> a) {
  if (a.isEmpty) return 0;
  var w = 1;
  for (var r = 1; r < a.length; r++) {
    if (a[r] != a[w - 1]) {
      a[w] = a[r];
      w++;
    }
  }
  return w;
}`,
      explain: "O(n) زمن و O(1) مساحة. بنقارن بآخر عنصر اتكتب (<code>a[w-1]</code>) مش بالعنصر اللي قبل <code>r</code>، لأن ده بيشتغل مع أي عدد من التكرارات. القايمة الفاضية بنتعامل معاها قبل ما نقرأ a[0].",
    },
    {
      title: "أطول substring من غير تكرار",
      lang: "dart",
      prompt: "<p>اكتب <code>int lengthOfLongestSubstring(String s)</code> ترجع طول أطول substring (حروف متتالية) من غير حرف متكرر.</p>",
      examples: [
        { in: "lengthOfLongestSubstring('abcabcbb')", out: "3" },
        { in: "lengthOfLongestSubstring('pwwkew')", out: "3" },
        { in: "lengthOfLongestSubstring('abba')", out: "2" },
      ],
      starter: `int lengthOfLongestSubstring(String s) {
  // your code
}`,
      hints: [
        "نافذة <code>[left, right]</code> وSet للحروف اللي فيها.",
        "قبل إضافة <code>s[right]</code>: طول ما موجود في الـ Set، شيل <code>s[left]</code> وزوّد left.",
      ],
      solution: `int lengthOfLongestSubstring(String s) {
  final seen = <String>{};
  var left = 0, best = 0;
  for (var right = 0; right < s.length; right++) {
    while (seen.contains(s[right])) {
      seen.remove(s[left]);
      left++;
    }
    seen.add(s[right]);
    if (right - left + 1 > best) best = right - left + 1;
  }
  return best;
}`,
      explain: "O(n) لأن كل حرف بيدخل ويخرج من النافذة مرة. المساحة O(min(n, حجم الأبجدية)). الفاضي بيرجع 0 لأن اللوب مبتشتغلش.",
    },
    {
      title: "أقصر subarray بمجموع كفاية",
      lang: "dart",
      prompt: "<p>اكتب <code>int minSubLen(List&lt;int&gt; a, int target)</code> (كل الأرقام موجبة) ترجع طول أقصر subarray متتالي مجموعه <code>&gt;= target</code>، أو 0 لو مفيش.</p>",
      examples: [
        { in: "minSubLen([2, 3, 1, 2, 4, 3], 7)", out: "2" },
        { in: "minSubLen([1, 1, 1], 10)", out: "0" },
        { in: "minSubLen([10], 7)", out: "1" },
      ],
      starter: `int minSubLen(List<int> a, int target) {
  // your code
}`,
      hints: [
        "وسّع بـ <code>right</code> وزوّد المجموع.",
        "طول ما <code>sum &gt;= target</code>: سجّل الطول، اطرح <code>a[left]</code>، وزوّد left.",
      ],
      solution: `int minSubLen(List<int> a, int target) {
  var left = 0, sum = 0;
  var best = a.length + 1;
  for (var right = 0; right < a.length; right++) {
    sum += a[right];
    while (sum >= target) {
      if (right - left + 1 < best) best = right - left + 1;
      sum -= a[left];
      left++;
    }
  }
  return best == a.length + 1 ? 0 : best;
}`,
      explain: "O(n) زمن، O(1) مساحة. استخدمنا a.length + 1 كقيمة «مفيش» لأنها أكبر من أي طول ممكن. الحل ده صح بس للأرقام الموجبة.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `List<int> twoSumSorted(List<int> a, int target) {
  var l = 0, r = a.length - 1;
  while (l < r) {
    final s = a[l] + a[r];
    if (s == target) return [l, r];
    if (s < target) {
      l++;
    } else {
      r--;
    }
  }
  return [];
}

void main() {
  print(twoSumSorted([1, 2, 4, 7, 11, 15], 15));
}` },
      answer: ["[2, 4]", "2, 4"],
      why: "1+15=16 كبير (r--)، 1+11=12 صغير (l++)، 2+11=13 صغير (l++)، 4+11=15. الـ indexes هي 2 و4.",
    },
    {
      q: "في Two Sum على مصفوفة مرتبة، لو <code>a[l] + a[r] &lt; target</code>، ليه نحرك <code>l</code> يمين بأمان؟",
      options: [
        "لأن r أكبر من l دايما",
        "لأن a[l] مع أكبر شريك ممكن (a[r]) لسه أصغر من الهدف، فمفيش شريك ينفع له",
        "لأن تحريك r هيعمل out of range",
        "لأن التحريك لليمين أسرع",
      ],
      answer: 1,
      why: "كل العناصر اللي بين l و r أصغر من أو تساوي a[r]، فأي مجموع مع a[l] هيكون أصغر من الهدف. يبقى a[l] اتستبعد بالكامل.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `int maxArea(List<int> h) {
  var l = 0, r = h.length - 1, best = 0;
  while (l < r) {
    final w = r - l;
    final hh = h[l] < h[r] ? h[l] : h[r];
    if (w * hh > best) best = w * hh;
    if (h[l] < h[r]) {
      l++;
    } else {
      r--;
    }
  }
  return best;
}

void main() {
  print(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));
}` },
      answer: ["49"],
      why: "عند l=1 (الارتفاع 8) و r=8 (الارتفاع 7): العرض 7 والارتفاع الأقصر 7 يعني 49. باقي الحاويات أصغر.",
    },
    {
      q: "جوه الـ for فيه while بتحرك <code>left</code>. التعقيد الكلي لـ sliding window؟",
      options: [
        "O(n²) لأن فيه لوب جوه لوب",
        "O(n log n)",
        "O(n × k)",
        "O(n): كل مؤشر بيمشي لقدام بس، فالـ while موزعة (amortized) على كل اللفات",
      ],
      answer: 3,
      why: "left بيزيد على الأكتر n مرة في الإجمالي، مش n مرة لكل لفة. فالمجموع 2n.",
    },
    {
      q: "أنهي مسألة مينفعش تتحل بـ sliding window ذات الشرط (موجب/تضييق)؟",
      options: [
        "أقصر subarray مجموعه على الأقل S لو الأرقام ممكن تبقى سالبة",
        "أطول substring من غير تكرار",
        "أكبر مجموع لـ k عناصر متتالية",
        "أقصر subarray موجب مجموعه على الأقل S",
      ],
      answer: 0,
      why: "السالب بيكسر الخاصية: توسيع النافذة ممكن ينقص المجموع، فتحريك left ممكن يضيع إجابة. محتاج prefix sums.",
    },
    {
      q: "الناتج إيه؟ (طول أطول substring بدون تكرار)",
      code: { lang: "dart", src: `int longestUnique(String s) {
  final seen = <String>{};
  var left = 0, best = 0;
  for (var right = 0; right < s.length; right++) {
    while (seen.contains(s[right])) {
      seen.remove(s[left]);
      left++;
    }
    seen.add(s[right]);
    if (right - left + 1 > best) best = right - left + 1;
  }
  return best;
}

void main() {
  print(longestUnique('pwwkew'));
}` },
      answer: ["3"],
      why: "النوافذ: p ثم pw ثم w ثم wk ثم wke (3) ثم kew (3). الأطول 3.",
    },
    {
      q: "في Container With Most Water، أي مؤشر نحركه في كل خطوة؟",
      options: [
        "اللي عند العمود الأطول",
        "الشمال دايما",
        "اللي عند العمود الأقصر",
        "العشوائي، كلهم بيدّوا نفس النتيجة",
      ],
      answer: 2,
      why: "الأقصر هو اللي بيحدد الارتفاع. أي حاوية جديدة بنفس العمود الأقصر أضيق وارتفاعها مش أكبر، فيبقى استبعاده آمن. تحريك الأطول ممكن يضيع الحل.",
    },
    {
      q: "الناتج إيه؟ (أقصر طول)",
      code: { lang: "dart", src: `int minSubLen(List<int> a, int target) {
  var left = 0, sum = 0;
  var best = a.length + 1;
  for (var right = 0; right < a.length; right++) {
    sum += a[right];
    while (sum >= target) {
      if (right - left + 1 < best) best = right - left + 1;
      sum -= a[left];
      left++;
    }
  }
  return best == a.length + 1 ? 0 : best;
}

void main() {
  print(minSubLen([2, 3, 1, 2, 4, 3], 7));
}` },
      answer: ["2"],
      why: "أقصر نافذة مجموعها 7 أو أكتر هي [4, 3] (طولها 2).",
    },
    {
      q: "في <code>removeDuplicates</code> على مصفوفة مرتبة، ليه نقارن <code>a[r]</code> بـ <code>a[w - 1]</code> مش بـ <code>a[r - 1]</code>؟",
      options: [
        "لأن a[r - 1] ممكن يطلع out of range",
        "لأنه أسرع",
        "الاتنين نفس الحاجة دايما",
        "لأن a[w-1] هو آخر قيمة اتكتبت فعلا في الناتج، وa[r-1] ممكن يكون اتكتب عليه",
      ],
      answer: 3,
      why: "بعد ما نكتب فوق خانات قديمة، a[r-1] ممكن يتغير. آخر قيمة في الناتج هي دايما a[w-1].",
    },
    {
      q: "مصفوفة أرقام فيها سالب وعايز أقصر subarray مجموعه بالظبط K. إيه الأنسب؟",
      options: [
        "Prefix sums مع Map (من غير sliding window)",
        "Sliding window ذات الحجم المتغير",
        "Two pointers من الأطراف",
        "Binary search على المصفوفة",
      ],
      answer: 0,
      why: "السالب بيكسر الـ monotonicity اللي sliding window بتعتمد عليها. بنخزن في Map كل prefix sum وأخر index له، ونبحث عن prefix - K.",
    },
  ],
};
