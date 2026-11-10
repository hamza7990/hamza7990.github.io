window.LEVELS = window.LEVELS || {};
window.LEVELS["algo/a3"] = {
  slides: [
    {
      kicker: "الفكرة",
      title: "كل خطوة بتشيل نص الاحتمالات",
      en: "The idea and the invariant",
      body: "<p>في w9 شفت إن binary search بتدور في قايمة مرتبة بإنك تبص على اللي في النص وترمي نص. هنا هنتقن الكود بحيث ميبقاش فيه off-by-one. السر كله في <b>الـ invariant</b>: جملة بتفضل صح قبل وبعد كل لفة. في النسخة الكلاسيكية: «لو الهدف موجود، يبقى في المدى <code>[lo, hi]</code>». كل لفة بتصغّر المدى مع الحفاظ على الجملة دي، واللوب بيقف لما المدى يفضى (<code>lo &gt; hi</code>) يعني مش موجود.</p><p>الشرط الوحيد: الداتا <b>مرتبة</b> (أو أدق: فيه شرط بيكون false ثم true، شريحة binary search on the answer).</p>",
      points: [
        "1000 عنصر: 10 خطوات كحد أقصى. مليون: 20. مليار: 30.",
        "الزمن O(log n) والمساحة O(1) باللوب.",
        "لو الداتا مش مرتبة، الترتيب O(n log n) أغلى من بحث خطي واحد O(n). يبقى يستاهل بس لو هتبحث كتير.",
      ],
      focus: [{ label: "احفظها", text: "قبل أي binary search اكتب الـ invariant: المدى [lo, hi] (أو [lo, hi) ) فيه الإجابة لو موجودة. كل سطر بعد كده لازم يحافظ عليه." }],
    },
    {
      kicker: "القالب",
      title: "القالب الكلاسيكي من غير مشاكل",
      en: "The classic template",
      body: "<p>مدى مقفول من الاتنين <code>[lo, hi]</code> يبدأ بـ <code>0</code> و<code>n - 1</code>. شرط اللوب <code>lo &lt;= hi</code> (لأن المدى اللي فيه عنصر واحد <code>lo == hi</code> لسه لازم يتفحص). و<code>mid</code> بتتحسب <code>lo + (hi - lo) ~/ 2</code> بدل <code>(lo + hi) ~/ 2</code>: الاتنين ينفعوا في Dart على الجهاز (الـ int 64 بت)، لكن الأولى عادة آمنة من overflow في Java وC++، وبتتعود عليها. وبعد المقارنة <b>دايما</b> بنستبعد mid: <code>mid + 1</code> أو <code>mid - 1</code>، ده اللي بيضمن إن المدى بيصغر وإن مفيش لوب لا نهائي.</p>",
      code: {
        lang: "dart",
        src: `int binarySearch(List<int> a, int target) {
  var lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return -1;
}

void main() {
  final a = [1, 3, 5, 5, 5, 7, 9];
  print(binarySearch(a, 7));        // 5
  print(binarySearch(a, 4));        // -1
  print(binarySearch([], 1));       // -1
  print(binarySearch([4], 4));      // 0
  print(binarySearch([4], 5));      // -1
}`,
        note: "جرب دايما: قايمة فاضية، عنصر واحد (موجود وغير موجود)، أول عنصر، آخر عنصر.",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع البحث عن 11 في [1, 3, 5, 7, 9, 11, 13]",
          src: `lo=0 hi=6 mid=3 a[mid]=7    7 < 11  -> lo = 4
lo=4 hi=6 mid=5 a[mid]=11   found, return 5`,
        },
        {
          lang: "text",
          title: "تتبع البحث عن 4 (مش موجود)",
          src: `lo=0 hi=6 mid=3 a[mid]=7    7 > 4   -> hi = 2
lo=0 hi=2 mid=1 a[mid]=3    3 < 4   -> lo = 2
lo=2 hi=2 mid=2 a[mid]=5    5 > 4   -> hi = 1
lo=2 hi=1  -> lo > hi, stop, return -1`,
        },
      ],
      interview: [
        { q: "اكتب binary search وقول الـ invariant.", a: "لوب <code>while (lo &lt;= hi)</code>، mid = lo + (hi - lo) ~/ 2. لو a[mid] يساوي الهدف أرجع mid، لو أصغر يبقى <code>lo = mid + 1</code>، غير كده <code>hi = mid - 1</code>. الـ invariant: لو الهدف موجود فهو في المدى المقفول [lo, hi]. وبنخرج لما المدى يفضى فنرجع -1. الزمن O(log n) والمساحة O(1).",
        },
      ],
    },
    {
      kicker: "الأخطاء",
      title: "ثلاث أخطاء off-by-one بتتكرر",
      en: "Off-by-one mistakes",
      body: "<p>الأخطاء دي مش من قلة معرفة بالفكرة، دي من خلط بين نمطين: <b>مدى مقفول</b> <code>[lo, hi]</code> بيروح مع <code>lo &lt;= hi</code> و<code>hi = mid - 1</code>، ومدى <b>نصف مفتوح</b> <code>[lo, hi)</code> بيروح مع <code>lo &lt; hi</code> و<code>hi = mid</code>. اختار نمط وكمل بيه للآخر.</p>",
      codes: [
        {
          lang: "dart",
          title: "غلط 1: lo = mid (لوب لا نهائي)",
          src: `// a = [1, 3], target = 3
var lo = 0, hi = 1;
while (lo < hi) {
  final mid = (lo + hi) ~/ 2;     // mid = 0
  if (a[mid] < target) {
    lo = mid;                      // lo stays 0 forever
  } else {
    hi = mid;
  }
}`,
          note: "المدى مبيصغرش لأن mid == lo. الحل <code>lo = mid + 1</code>. (جربتها: بتلف للأبد، وقفتها بعداد بعد 20 لفة.)",
        },
        {
          lang: "dart",
          title: "غلط 2: lo < hi مع مدى مقفول (بيضيع آخر عنصر)",
          src: `int search(List<int> a, int t) {
  var lo = 0, hi = a.length - 1;
  while (lo < hi) {                // should be lo <= hi
    final mid = lo + (hi - lo) ~/ 2;
    if (a[mid] == t) return mid;
    if (a[mid] < t) { lo = mid + 1; } else { hi = mid - 1; }
  }
  return -1;
}
// search([1, 3, 5, 7], 7)  ->  -1  (wrong, should be 3)
// search([1, 3, 5, 7], 1)  ->  -1  (wrong, should be 0)`,
          note: "لما يفضل عنصر واحد (<code>lo == hi</code>) اللوب بيخرج من غير ما يفحصه.",
        },
        {
          lang: "dart",
          title: "غلط 3: hi = a.length مع مدى مقفول (RangeError)",
          src: `var lo = 0, hi = a.length;        // half-open range...
while (lo <= hi) {                 // ...but closed-range loop
  final mid = lo + (hi - lo) ~/ 2;
  if (a[mid] == t) return mid;     // a[a.length] -> RangeError
  ...
}`,
          note: "لو بتستخدم <code>hi = a.length</code> يبقى لازم <code>lo &lt; hi</code> و<code>hi = mid</code>.",
        },
      ],
      pitfall: "لو اتلخبطت في الإنترفيو، ارسم قايمة من عنصرين وتتبع لفة لفة. أغلب الأخطاء بتظهر على قايمة زي [1, 3].",
      interview: [
        { q: "إيه أشهر أخطاء binary search؟", a: "الأول <code>lo = mid</code> أو <code>hi = mid</code> في النمط المقفول فالمدى مبيصغرش وده لوب لا نهائي. الثاني <code>lo &lt; hi</code> بدل <code>lo &lt;= hi</code> فبنضيع العنصر الأخير. الثالث خلط حدود المدى (hi = n مع شرط مدى مقفول). ثم overflow في mid في اللغات اللي الـ int فيها 32 بت. بحلها باختيار نمط واحد وتجربة قايمة بعنصر وعنصرين.",
        },
      ],
    },
    {
      kicker: "الحدود",
      title: "Lower bound و upper bound",
      en: "Lower bound and upper bound",
      body: "<p>أقوى نسخة من binary search مش «هل موجود؟» لكن «أول مكان يتحط فيه الهدف من غير ما يكسر الترتيب». <b>Lower bound</b>: أول index فيه <code>a[i] &gt;= target</code>. <b>Upper bound</b>: أول index فيه <code>a[i] &gt; target</code>. الاتنين بيرجعوا رقم من 0 لـ n (n معناها «كلهم أصغر»). هنا بنستخدم المدى النصف مفتوح <code>[lo, hi)</code> وبنسيب mid لما يكون ممكن يكون هو الإجابة (<code>hi = mid</code>).</p>",
      code: {
        lang: "dart",
        src: `// first index with a[i] >= target
int lowerBound(List<int> a, int target) {
  var lo = 0, hi = a.length;
  while (lo < hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (a[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid;          // mid might be the answer
    }
  }
  return lo;
}

// first index with a[i] > target
int upperBound(List<int> a, int target) {
  var lo = 0, hi = a.length;
  while (lo < hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (a[mid] <= target) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}

void main() {
  final a = [1, 3, 5, 5, 5, 7, 9];
  print(lowerBound(a, 5));    // 2
  print(upperBound(a, 5));    // 5
  print(lowerBound(a, 4));    // 2
  print(lowerBound(a, 10));   // 7
  print(lowerBound(a, 0));    // 0
  print(lowerBound([], 3));   // 0
}`,
        note: "الفرق بين النسختين هو <code>&lt;</code> مقابل <code>&lt;=</code> وبس. <code>lowerBound(a, 4)</code> بترجع 2 يعني الـ 4 كان هيتحط قبل أول 5.",
      },
      focus: [{ label: "احفظها", text: "المدى [lo, hi): شرط lo < hi، والتحريك lo = mid + 1 أو hi = mid. النهاية دايما lo == hi وهو الإجابة." }],
      interview: [
        { q: "إزاي تعرف المكان اللي يتحط فيه عنصر جديد في قايمة مرتبة؟", a: "هو lower bound: أول index فيه عنصر أكبر من أو يساوي الهدف. لو الهدف أكبر من الكل بترجع n. وبكده تعمل insert في الـ index ده وتفضل القايمة مرتبة. الزمن لإيجاد المكان O(log n) (الـ insert نفسه O(n) في list).",
        },
      ],
    },
    {
      kicker: "التكرارات",
      title: "أول وآخر ظهور، وعدد التكرارات",
      en: "First and last occurrence",
      body: "<p>لو فيه تكرار، binary search الكلاسيكية بترجع أي واحد. للأول: <code>i = lowerBound(a, t)</code> وبعدين افحص <code>a[i] == t</code> (وإن i أصغر من n). للأخير: <code>upperBound(a, t) - 1</code>. وعدد التكرارات = <code>upperBound - lowerBound</code> من غير ما تعدّ واحد واحد.</p>",
      code: {
        lang: "dart",
        src: `int firstOcc(List<int> a, int t) {
  final i = lowerBound(a, t);
  return i < a.length && a[i] == t ? i : -1;
}

int lastOcc(List<int> a, int t) {
  final i = upperBound(a, t) - 1;
  return i >= 0 && a[i] == t ? i : -1;
}

int count(List<int> a, int t) => upperBound(a, t) - lowerBound(a, t);

void main() {
  final a = [1, 3, 5, 5, 5, 7, 9];
  print(firstOcc(a, 5));   // 2
  print(lastOcc(a, 5));    // 4
  print(firstOcc(a, 4));   // -1
  print(lastOcc(a, 1));    // 0
  print(count(a, 5));      // 3
}`,
        note: "(الدالتان <code>lowerBound</code> و <code>upperBound</code> من الشريحة اللي فاتت.) فحص الحدود <code>i &lt; a.length</code> ضروري، لأن lower bound ممكن ترجع n.",
      },
      pitfall: "نسيان الفحص بعد lower bound: ترجع index حتى لو الهدف مش موجود. ولو i == n هتعمل RangeError لو دخلت <code>a[i]</code> من غير فحص.",
      interview: [
        { q: "عندك قايمة مرتبة فيها تكرار. كام مرة ظهر الرقم x في O(log n)؟", a: "هحسب lower bound لـ x (أول index فيه قيمة أكبر من أو تساوي x) وupper bound (أول index فيه قيمة أكبر من x) والفرق بينهم هو العدد. لو x مش موجود بيطلعوا نفس الرقم فالعدد صفر. كل واحدة O(log n).",
        },
      ],
    },
    {
      kicker: "مصفوفة مدوّرة",
      title: "البحث في مصفوفة مرتبة اتدوّرت",
      en: "Search in a rotated sorted array",
      body: "<p>مصفوفة مرتبة اتقطعت ورجعت من النص زي <code>[4, 5, 6, 7, 0, 1, 2]</code> (من غير تكرار). مفيش ترتيب كلي، لكن <b>نص واحد على الأقل من أي مدى دايما مرتب</b>. اللعبة: حدد النص المرتب، شوف هل الهدف جواه، وإلا ارميه وروح للنص التاني.</p><p>لو <code>a[lo] &lt;= a[mid]</code> يبقى الشمال <code>[lo, mid]</code> مرتب. لو الهدف جواه (<code>a[lo] &lt;= t &lt; a[mid]</code>) روح شمال، وإلا يمين. والعكس لو اليمين هو المرتب.</p>",
      code: {
        lang: "dart",
        src: `int searchRotated(List<int> a, int target) {
  var lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (a[mid] == target) return mid;
    if (a[lo] <= a[mid]) {                     // left half is sorted
      if (a[lo] <= target && target < a[mid]) {
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    } else {                                   // right half is sorted
      if (a[mid] < target && target <= a[hi]) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
  }
  return -1;
}

int findMin(List<int> a) {
  var lo = 0, hi = a.length - 1;
  while (lo < hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (a[mid] > a[hi]) {
      lo = mid + 1;        // min is to the right of mid
    } else {
      hi = mid;
    }
  }
  return a[lo];
}

void main() {
  final r = [4, 5, 6, 7, 0, 1, 2];
  print(searchRotated(r, 0));     // 4
  print(searchRotated(r, 3));     // -1
  print(searchRotated(r, 4));     // 0
  print(searchRotated([3, 1], 1)); // 1
  print(findMin(r));              // 0
}`,
        note: "<code>a[lo] &lt;= a[mid]</code> (مع =) مهمة لما المدى عنصرين فـ lo == mid.",
      },
      codes: [
        {
          lang: "text",
          title: "تتبع البحث عن 0 في [4, 5, 6, 7, 0, 1, 2]",
          src: `lo=0 hi=6 mid=3 a[mid]=7    left [4..7] sorted, 0 not in it -> lo = 4
lo=4 hi=6 mid=5 a[mid]=1    left [0,1] sorted, 0 in it     -> hi = 4
lo=4 hi=4 mid=4 a[mid]=0    found, return 4`,
        },
      ],
      interview: [
        { q: "ابحث عن عنصر في مصفوفة مرتبة مدوّرة في O(log n).", a: "في كل لفة أحسب mid، وأشوف أي نص مرتب: لو <code>a[lo] &lt;= a[mid]</code> فالشمال مرتب، وإلا اليمين. لو الهدف في حدود النص المرتب أروح ليه، وإلا أروح للنص التاني. نص واحد دايما بيتشال فالتعقيد O(log n). ملاحظة: لو فيه تكرارات مش ممكن أحدد النص المرتب دايما والأسوأ بيرجع O(n).",
        },
      ],
    },
    {
      kicker: "على الإجابة",
      title: "Binary search on the answer",
      en: "Binary search on the answer",
      body: "<p>الفكرة اللي بتفرق المحترف: مش لازم يكون فيه مصفوفة. لو الإجابة رقم في مدى <code>[lo, hi]</code>، وعندك دالة <code>ok(x)</code> بترجع true/false وهي <b>monotone</b> (false false false true true true)، تقدر تلاقي أول true بـ binary search. بدل ما تدور في بيانات، بتدور في فضاء الإجابات.</p><p><b>مثال: الحد الأدنى لسعة شحنة.</b> طرود أوزانها بالترتيب، لازم تتشحن بنفس الترتيب في <code>days</code> أيام، وكل يوم لا يتجاوز السعة. إيه أقل سعة ممكنة؟ لو السعة x تكفي فأي سعة أكبر تكفي برضه (monotone). المدى: من أثقل طرد (أقل من كده مستحيل) لمجموع الأوزان (يوم واحد).</p>",
      code: {
        lang: "dart",
        src: `bool canShip(List<int> w, int days, int cap) {
  var d = 1, load = 0;
  for (final x in w) {
    if (x > cap) return false;
    if (load + x > cap) {
      d++;                 // start a new day
      load = 0;
    }
    load += x;
  }
  return d <= days;
}

int minCapacity(List<int> w, int days) {
  var lo = w.reduce((a, b) => a > b ? a : b);   // heaviest package
  var hi = w.reduce((a, b) => a + b);           // everything in one day
  while (lo < hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (canShip(w, days, mid)) {
      hi = mid;            // mid works, try smaller
    } else {
      lo = mid + 1;
    }
  }
  return lo;
}

void main() {
  print(minCapacity([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5));   // 15
  print(minCapacity([3, 2, 2, 4, 1, 4], 3));                // 6
  print(minCapacity([5], 1));                               // 5
  print(minCapacity([1, 2, 3], 1));                         // 6
}`,
        note: "الزمن O(n × log(مجموع الأوزان)): كل فحص <code>canShip</code> بيكلف O(n) وبنفحص log مرة.",
      },
      codes: [
        {
          lang: "text",
          title: "canShip لـ [1..10] في 5 أيام: السعة مقابل النتيجة",
          src: `cap 10  false
cap 14  false
cap 15  true     <- the first true is the answer
cap 20  true`,
        },
      ],
      focus: [{ label: "احفظها", text: "علامات المسألة: «أقل/أكبر قيمة بحيث ...» + سهل تفحص إن قيمة معينة تنفع + لو تنفع x تنفع كل الأكبر (أو الأصغر). ده binary search on the answer." }],
      interview: [
        { q: "إمتى تفكر في binary search on the answer؟", a: "لما المسألة بتطلب أصغر قيمة أو أكبر قيمة بتحقق شرط، ومن السهل أكتب دالة feasible(x) بتجاوب هل x تكفي في O(n)، وبتكون monotone: لو x تكفي يبقى أي قيمة أكبر منها تكفي. أحدد المدى المحتمل للإجابة وأبحث عن أول true. زي أقل سعة شحن، أقل سرعة أكل موز، أو الجذر التربيعي. الزمن O(cost(feasible) × log(range)).",
        },
      ],
    },
    {
      kicker: "مثال تاني",
      title: "الجذر التربيعي الصحيح",
      en: "Integer square root",
      body: "<p>الجذر الصحيح لـ <code>x</code> هو أكبر <code>m</code> بحيث <code>m × m &lt;= x</code>. الدالة <code>m*m &lt;= x</code> هي true ثم false (true للصغار). بنحتفظ بـ <code>ans</code> كل ما نلاقي مرشح صالح ونحاول ندور على أكبر منه.</p>",
      code: {
        lang: "dart",
        src: `int mySqrt(int x) {
  var lo = 0, hi = x;
  var ans = 0;
  while (lo <= hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (mid * mid <= x) {
      ans = mid;           // valid, try bigger
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}

void main() {
  print(mySqrt(0));          // 0
  print(mySqrt(1));          // 1
  print(mySqrt(8));          // 2
  print(mySqrt(16));         // 4
  print(mySqrt(99));         // 9
  print(mySqrt(1000000));    // 1000
}`,
        note: "الزمن O(log x) والمساحة O(1). حالات الحافة 0 و1 بتشتغل لأن المدى [0, x] بيضم الإجابة دايما.",
      },
      interview: [
        { q: "اكتب الجذر التربيعي الصحيح من غير ما تستخدم sqrt.", a: "binary search على الإجابة في المدى [0, x]. لو <code>mid*mid &lt;= x</code> فـ mid مرشح صالح، أحتفظ بيه وأدور في اليمين. وإلا أدور في الشمال. في الآخر ans هو أكبر مرشح صالح. الزمن O(log x) والمساحة O(1). حالات الحافة: x = 0 و x = 1.",
        },
      ],
    },
    {
      kicker: "في الواقع",
      title: "الـ binary search مستخبية في كود حقيقي",
      en: "Where it hides in real code",
      body: "<p>مش لازم يبقى فيه مصفوفة أرقام. أي حاجة فيها «ترتيب» أو «false ثم true» ممكن تتحل بيها:</p>",
      points: [
        "<b>git bisect</b>: أول commit بوّظ التست. الـ commits مرتبة زمنيا والـ build سليم ثم مكسور = أول true.",
        "<b>أول إصدار فيه bug</b> (First Bad Version) نفس الفكرة.",
        "<b>جدول زمني أو سجل مرتب بالتاريخ</b>: ابحث عن أول سجل بعد وقت معين (lower bound) بدل ما تلف على كله.",
        "<b>مكان إدراج عنصر</b> في list مرتبة، أو الـ autocomplete على قايمة كلمات مرتبة.",
        "<b>الـ database index</b> (B-tree) بتشتغل بنفس الروح، ومعها عامل الـ limit في الـ query بيبحث عن أول مفتاح.",
        "<b>ضبط قيمة</b> (أقل timeout، أقل عدد workers ينفع) لو عندك اختبار بيقول ينفع أو لا.",
      ],
      code: {
        lang: "dart",
        title: "أول نسخة سيئة (First Bad Version)",
        src: `int firstBad(int n, bool Function(int) isBad) {
  var lo = 1, hi = n;
  while (lo < hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (isBad(mid)) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return lo;
}

void main() {
  print(firstBad(10, (v) => v >= 7));   // 7
}`,
        note: "بتنادي <code>isBad</code> حوالي log₂(n) مرة بس، وده مهم لما كل نداء غالي (build أو network call).",
      },
      interview: [
        { q: "إزاي تلاقي أول commit بوّظ المشروع من بين 1000 commit؟", a: "binary search على الـ commits: أعمل checkout للـ commit اللي في النص وأشغل التست. لو فشل يبقى أول commit سيئ في النص الأول، وإلا في التاني. بعد حوالي 10 اختبارات (log₂ 1000) بلاقيه. ده بالظبط اللي بيعمله <code>git bisect</code>.",
        },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: binary search الكلاسيكي",
      lang: "dart",
      code: `int binarySearch(List<int> a, int target) {
  var lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return -1;
}`,
      note: "مدى مقفول: <code>lo &lt;= hi</code> مع <code>mid ± 1</code>.",
    },
    {
      title: "اكتب: lower bound",
      lang: "dart",
      code: `int lowerBound(List<int> a, int target) {
  var lo = 0, hi = a.length;
  while (lo < hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (a[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}`,
      note: "مدى نصف مفتوح: <code>lo &lt; hi</code> و<code>hi = mid</code>.",
    },
    {
      title: "اكتب: الجذر الصحيح",
      lang: "dart",
      code: `int mySqrt(int x) {
  var lo = 0, hi = x;
  var ans = 0;
  while (lo <= hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (mid * mid <= x) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}`,
      note: "binary search على الإجابة: احتفظ بآخر مرشح صالح.",
    },
  ],

  tasks: [
    {
      title: "عدد تكرارات رقم",
      lang: "dart",
      prompt: "<p>اكتب <code>int countOccurrences(List&lt;int&gt; a, int t)</code> على قايمة مرتبة تصاعديا، ترجع كام مرة ظهر <code>t</code>، في O(log n) (من غير ما تعدّ واحد واحد).</p>",
      examples: [
        { in: "countOccurrences([1, 3, 5, 5, 5, 7, 9], 5)", out: "3" },
        { in: "countOccurrences([1, 3, 5, 5, 5, 7, 9], 4)", out: "0" },
        { in: "countOccurrences([], 2)", out: "0" },
      ],
      starter: `int countOccurrences(List<int> a, int t) {
  // your code
}`,
      hints: [
        "اكتب دالة مساعدة بترجع أول index فيه <code>a[i] &gt;= t</code>، وواحدة بترجع أول index فيه <code>a[i] &gt; t</code>.",
        "العدد = الثانية - الأولى.",
      ],
      solution: `int countOccurrences(List<int> a, int t) {
  int bound(bool Function(int) goRight) {
    var lo = 0, hi = a.length;
    while (lo < hi) {
      final mid = lo + (hi - lo) ~/ 2;
      if (goRight(a[mid])) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    return lo;
  }

  final first = bound((v) => v < t);
  final after = bound((v) => v <= t);
  return after - first;
}`,
      explain: "الدالة الداخلية <code>bound</code> هي binary search واحدة بشرط بيتغير. شرط <code>v &lt; t</code> بيدّي lower bound، و<code>v &lt;= t</code> بيدّي upper bound. التعقيد O(log n).",
    },
    {
      title: "الجذر الصحيح",
      lang: "dart",
      prompt: "<p>اكتب <code>int mySqrt(int x)</code> ترجع أكبر عدد صحيح <code>m</code> بحيث <code>m * m &lt;= x</code> (<code>x &gt;= 0</code>)، من غير <code>sqrt</code>، في O(log x).</p>",
      examples: [
        { in: "mySqrt(8)", out: "2" },
        { in: "mySqrt(16)", out: "4" },
        { in: "mySqrt(0)", out: "0" },
      ],
      starter: `int mySqrt(int x) {
  // your code
}`,
      hints: [
        "المدى المحتمل للإجابة من 0 إلى x.",
        "لو <code>mid * mid &lt;= x</code> احتفظ بـ mid كإجابة وجرب أكبر، وإلا جرب أصغر.",
      ],
      solution: `int mySqrt(int x) {
  var lo = 0, hi = x;
  var ans = 0;
  while (lo <= hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (mid * mid <= x) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}`,
      explain: "الدالة <code>mid*mid &lt;= x</code> true للصغار ثم false، فنحتفظ بآخر true. التعقيد O(log x) ومساحة O(1). ولـ x = 0 المدى [0, 0] وmid = 0 صالحة فترجع 0.",
    },
    {
      title: "أقل سعة شحن",
      lang: "dart",
      prompt: "<p>طرود أوزانها <code>w</code> بالترتيب، لازم تتشحن بنفس الترتيب في <code>days</code> أيام (كل يوم مجموع وزنه لا يتجاوز السعة). اكتب <code>int minCapacity(List&lt;int&gt; w, int days)</code> ترجع أقل سعة ممكنة، باستخدام binary search على الإجابة.</p>",
      examples: [
        { in: "minCapacity([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5)", out: "15" },
        { in: "minCapacity([3, 2, 2, 4, 1, 4], 3)", out: "6" },
        { in: "minCapacity([5], 1)", out: "5" },
      ],
      starter: `int minCapacity(List<int> w, int days) {
  // your code
}`,
      hints: [
        "المدى: من أثقل طرد لمجموع كل الأوزان.",
        "اكتب دالة <code>canShip(cap)</code> بتلف على الطرود وتعدّ الأيام اللازمة بجشع: ابدأ يوم جديد لما الحمولة تعدي السعة.",
        "لو <code>canShip(mid)</code> حاول أصغر (<code>hi = mid</code>)، وإلا <code>lo = mid + 1</code>.",
      ],
      solution: `int minCapacity(List<int> w, int days) {
  bool canShip(int cap) {
    var d = 1, load = 0;
    for (final x in w) {
      if (load + x > cap) {
        d++;
        load = 0;
      }
      load += x;
    }
    return d <= days;
  }

  var lo = w.reduce((a, b) => a > b ? a : b);
  var hi = w.reduce((a, b) => a + b);
  while (lo < hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (canShip(mid)) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return lo;
}`,
      explain: "بما إن lo يبدأ من أثقل طرد، مفيش طرد أكبر من السعة فمش محتاجين فحصه داخل canShip. الزمن O(n log(sum)). الدالة monotone: لو السعة تكفي فأي سعة أكبر تكفي.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `int binarySearch(List<int> a, int target) {
  var lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return -1;
}

void main() {
  print(binarySearch([1, 3, 5, 5, 5, 7, 9], 7));
}` },
      answer: ["5"],
      why: "المدى 0..6: mid=3 (القيمة 5) أصغر من 7 فنروح lo=4. mid=5 والقيمة 7 فنرجع 5.",
    },
    {
      q: "ليه بنكتب <code>mid = lo + (hi - lo) ~/ 2</code> بدل <code>(lo + hi) ~/ 2</code>؟",
      options: [
        "لأنها أسرع بكتير",
        "لأن التانية بترجع رقم عشري",
        "لأنها بتتفادى overflow في اللغات اللي الـ int فيها 32 بت (Java وC++)، وبتحافظ على نفس النتيجة",
        "لأن التانية بتديّ نتيجة غلط دايما",
      ],
      answer: 2,
      why: "lo + hi ممكن يتخطى أكبر int في 32 بت. النتيجة واحدة. في Dart الـ int 64 بت فالتانية مش بتبوظ عمليا، لكن العادة الأولى آمنة.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `int lowerBound(List<int> a, int target) {
  var lo = 0, hi = a.length;
  while (lo < hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (a[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}

void main() {
  print(lowerBound([1, 3, 5, 5, 5, 7, 9], 5));
}` },
      answer: ["2"],
      why: "lower bound هو أول index فيه قيمة >= 5. أول 5 موجودة في index 2.",
    },
    {
      q: "إيه المشكلة في الكود ده؟",
      code: { lang: "dart", src: `// a = [1, 3], target = 3
var lo = 0, hi = a.length - 1;
while (lo < hi) {
  final mid = (lo + hi) ~/ 2;
  if (a[mid] < target) {
    lo = mid;
  } else {
    hi = mid;
  }
}` },
      options: [
        "ممكن يلف للأبد: لما mid == lo بيفضل lo = mid بدون ما المدى يصغر",
        "الشرط لازم يكون <code>lo &gt; hi</code>",
        "لازم الـ target يكون أول عنصر",
        "مفيش مشكلة، ده الشكل الصح للنمط المقفول",
      ],
      answer: 0,
      why: "mid = 0 دايما هنا، و<code>lo = mid</code> مبتغيرش lo. الحل <code>lo = mid + 1</code>.",
    },
    {
      q: "ليه lower bound بتبدأ بـ <code>hi = a.length</code> (مش <code>a.length - 1</code>)؟",
      options: [
        "علشان تتفادى RangeError",
        "علشان اللوب يشتغل مرة زيادة",
        "لأن القايمة 1-indexed",
        "لأن الإجابة ممكن تكون n (يعني كل العناصر أصغر من الهدف)، فلازم تكون ضمن المدى المحتمل",
      ],
      answer: 3,
      why: "في المدى نصف المفتوح [lo, hi) الـ hi نفسه مش بيتفحص بس هو إجابة ممكنة. لو hi = n-1 مش هنقدر نرجع n أبدا.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `int search(List<int> a, int t) {
  var lo = 0, hi = a.length - 1;
  while (lo < hi) {
    final mid = lo + (hi - lo) ~/ 2;
    if (a[mid] == t) return mid;
    if (a[mid] < t) { lo = mid + 1; } else { hi = mid - 1; }
  }
  return -1;
}

void main() {
  print(search([1, 3, 5, 7], 7));
}` },
      answer: ["-1"],
      why: "lo=0 hi=3 mid=1 (3 < 7) lo=2. lo=2 hi=3 mid=2 (5 < 7) lo=3. دلوقتي lo == hi فاللوب يخرج من غير ما يفحص a[3] اللي هي 7. الحل <code>lo &lt;= hi</code>.",
    },
    {
      q: "في مصفوفة مرتبة مدوّرة، إزاي تعرف أي نص مرتب في المدى [lo, hi]؟",
      options: [
        "بتقارن a[lo] مع a[hi] فقط",
        "لو a[lo] &lt;= a[mid] يبقى الشمال [lo, mid] مرتب، وإلا اليمين",
        "اليمين دايما مرتب",
        "لازم تدور على نقطة الدوران الأول بـ O(n)",
      ],
      answer: 1,
      why: "لو الشمال فيه نقطة الدوران فأول عنصر فيه أكبر من الأوسط، فالشرط a[lo] <= a[mid] معناه إنه مفيش دوران جواه. مفيش داعي لـ O(n).",
    },
    {
      q: "طرود أوزانها [3, 2, 2, 4, 1, 4] وعندك 3 أيام. أقل سعة؟",
      code: { lang: "dart", src: `// each day carries consecutive packages,
// total weight per day <= capacity
// answer = ?` },
      answer: ["6"],
      why: "سعة 6: [3,2] [2,4] [1,4] = 5 و6 و5. سعة 5 مش بتكفي: [3,2] [2] [4,1] [4] تحتاج 4 أيام. لاحظ إن أثقل طرد 4 فالسعة لازم تكون 4 على الأقل.",
    },
    {
      q: "أي مسألة من دول مناسبة لـ binary search on the answer؟",
      options: [
        "ترتيب قايمة أرقام",
        "جمع عناصر قايمة",
        "إيجاد أقل قيمة تحقق شرط، ولو تحققت قيمة تتحقق كل القيم الأكبر منها",
        "إيجاد العنصر الأكتر تكرارا",
      ],
      answer: 2,
      why: "الشرط monotone (false...false true...true) هو اللي بيسمح بالتخلص من نص المدى. الباقي مسائل مش بتعتمد على التوجه ده.",
    },
    {
      q: "عدد الفحوصات التقريبي لإيجاد أقل سعة لو مجموع الأوزان 10^9 وعدد الطرود n؟",
      options: [
        "حوالي 10^9 فحص، كل فحص O(n)",
        "حوالي n فحص، كل فحص O(log n)",
        "فحص واحد O(n)",
        "حوالي 30 فحص، كل فحص O(n)",
      ],
      answer: 3,
      why: "log₂(10^9) حوالي 30 لفة، وكل لفة بتنادي canShip اللي O(n). يعني الإجمالي حوالي 30n بدل 10^9 × n.",
    },
  ],
};
