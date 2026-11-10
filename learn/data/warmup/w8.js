window.LEVELS = window.LEVELS || {};
window.LEVELS["warmup/w8"] = {
  slides: [
    {
      kicker: "ليه الخرائط",
      title: "Map و Set: أداة بتحول لوب جوه لوب لمرور واحد",
      en: "Maps and sets as tools",
      body: "<p>أغلب حلول «بطيئة» في الإنترفيو بتتحول لحلول سريعة بحاجة واحدة: بدل ما أدور على عنصر في قايمة كل مرة (O(n))، أخزنه في <code>Map</code> أو <code>Set</code> وألاقيه في خطوة تقريبا (O(1)).</p><p><code>Map</code> بتربط <b>مفتاح</b> بـ <b>قيمة</b>. <code>Set</code> مجموعة من غير تكرار. الاتنين بيجاوبوا على سؤال «هل شفت ده قبل كده؟» بسرعة.</p>",
      code: {
        lang: "dart",
        src: `void main() {
  final ages = {'Ali': 30, 'Sara': 25};
  ages['Omar'] = 41;                 // add
  ages['Ali'] = 31;                  // overwrite
  print(ages['Ali']);                // 31
  print(ages['Zed']);                // null: missing key
  print(ages.containsKey('Sara'));   // true
  print(ages.length);                // 3
  ages.remove('Sara');
  print(ages.keys.toList());         // [Ali, Omar]
  for (final e in ages.entries) {
    print(e.key + ': ' + e.value.toString());
  }
}`,
        note: "القراءة بمفتاح مش موجود بترجع <code>null</code> مش error. عشان كده نوع <code>ages['Ali']</code> هو <code>int?</code> ولازم تتعامل مع الـ null.",
      },
      focus: [{ label: "احفظها", text: "لو سؤالك «هل ده موجود؟» أو «كام مرة ظهر؟» أو «إيه اللي يتماشى مع ده؟»، فكر Map أو Set قبل أي لوب تاني." }],
    },
    {
      title: "عدّ التكرار",
      en: "Frequency counting",
      body: "<p>أشهر نمط مع الـ Map: <code>Map&lt;T, int&gt;</code> بيعد كام مرة ظهر كل عنصر. الخطوة: اقرا العدد الحالي (<code>?? 0</code> لو أول مرة)، زوّد واحد، وخزنه. ده بيشتغل مع الحروف والكلمات والأرقام.</p>",
      code: {
        lang: "dart",
        src: `Map<String, int> countChars(String s) {
  final counts = <String, int>{};
  for (var i = 0; i < s.length; i++) {
    final ch = s[i];
    counts[ch] = (counts[ch] ?? 0) + 1;
  }
  return counts;
}

void main() {
  print(countChars('banana'));  // {b: 1, a: 3, n: 2}

  // Same thing with update()
  final c = <String, int>{};
  for (final w in ['x', 'y', 'x']) {
    c.update(w, (v) => v + 1, ifAbsent: () => 1);
  }
  print(c);                     // {x: 2, y: 1}
}`,
        note: "الـ Map بتحافظ على ترتيب الإدخال: b ثم a ثم n. التعقيد O(n) لأن كل عملية على الـ Map تقريبا O(1).",
      },
      interview: [
        { q: "إزاي تعد كام مرة ظهر كل حرف في نص؟", a: "بعمل <code>Map&lt;String, int&gt;</code> وبلف على حروف النص مرة واحدة. لكل حرف بقرا العدد الحالي بـ <code>counts[ch] ?? 0</code> وبزود واحد وبخزنه. التعقيد O(n) ومساحة O(k) حيث k عدد الحروف المختلفة. لو الحروف a-z بس، ممكن مصفوفة من 26 خانة تكفي، لكن الـ Map أعم وتشتغل مع أي حرف.",
        },
      ],
    },
    {
      title: "العنصر الأكتر تكرارا",
      en: "Most frequent element",
      body: "<p>مرحلتين: (1) عدّ التكرار بـ Map. (2) لف على الـ Map وخد المفتاح اللي قيمته أكبر، بنفس نمط «أكبر قيمة». اسأل المُقابِل: لو فيه تعادل نرجع أنهي واحد؟ الكود هنا بيرجع أول واحد وصل للعدد الأكبر.</p>",
      code: {
        lang: "dart",
        src: `int? mostFrequent(List<int> nums) {
  if (nums.isEmpty) return null;
  final counts = <int, int>{};
  for (final n in nums) {
    counts[n] = (counts[n] ?? 0) + 1;
  }
  int? best;
  var bestCount = 0;
  for (final e in counts.entries) {
    if (e.value > bestCount) {
      best = e.key;
      bestCount = e.value;
    }
  }
  return best;
}

void main() {
  print(mostFrequent([1, 3, 3, 2, 2, 3])); // 3
  print(mostFrequent([1, 3, 3, 2, 2]));    // 3  (tie: first one reached)
  print(mostFrequent([]));                 // null
}`,
        note: "المقارنة <code>&gt;</code> مش <code>&gt;=</code> هي اللي بتحافظ على أول واحد في حالة التعادل.",
      },
      interview: [
        { q: "إزاي تلاقي العنصر الأكتر تكرارا في قايمة، وإيه التعقيد؟", a: "أعد التكرار بـ Map في لفة واحدة، وبعدين ألف على الـ Map وأحتفظ بالمفتاح اللي عدده أكبر. التعقيد O(n) زمن وO(k) مساحة. بسأل عن التعادل والقايمة الفاضية. لو ترتيب القايمة مرتب، ممكن أمشي عليها مرة وأعد المتتالي من غير Map وبمساحة O(1).",
        },
      ],
    },
    {
      title: "Set: التكرار والتواجد",
      en: "Set for duplicates and membership",
      body: "<p>الـ Set بيخزن القيم من غير تكرار، و<code>add</code> بترجع <code>false</code> لو القيمة كانت موجودة. فمسألة «فيه عنصر مكرر؟» بتتحل في سطر واحد جوه اللوب.</p>",
      code: {
        lang: "dart",
        src: `bool hasDuplicate(List<int> nums) {
  final seen = <int>{};
  for (final n in nums) {
    if (!seen.add(n)) return true;   // add() is false if already there
  }
  return false;
}

void main() {
  print(hasDuplicate([1, 2, 3, 1]));  // true
  print(hasDuplicate([1, 2, 3]));     // false
  print(hasDuplicate([]));            // false

  // One-liner: a Set drops duplicates, so the length shrinks
  final xs = [4, 4, 5];
  print(xs.length != xs.toSet().length); // true

  final empty1 = <int>{};   // an empty Set
  var empty2 = {};          // careful: this is a Map!
  print(empty1.runtimeType); // _Set<int>
  print(empty2.runtimeType); // _Map<dynamic, dynamic>
}`,
        note: "الحل بالـ Set بيقف بدري أول ما يلاقي مكرر. والاختصار <code>toSet().length</code> أقصر لكن بيبني Set كامل دايما.",
      },
      pitfall: "<code>var s = {};</code> بتعمل <b>Map</b> مش Set. لإنشاء Set فاضي اكتب نوعه: <code>&lt;int&gt;{}</code> أو <code>Set&lt;int&gt;()</code>.",
      interview: [
        { q: "إزاي تعرف إن قايمة فيها عناصر مكررة؟ وإيه الفرق في الأداء بين الحلول؟", a: "الحل الغاشم يقارن كل عنصر بكل اللي بعده: O(n²). حل التاني يرتب القايمة وبعدين يقارن الجيران: O(n log n). الحل الأسرع بـ Set: ألف وأحاول أضيف كل عنصر، ولو <code>add</code> رجعت false يبقى مكرر. ده O(n) متوسط، بمساحة O(n) للـ Set. التبادل هنا زمن مقابل مساحة.",
        },
      ],
    },
    {
      title: "التقاطع والاتحاد والفرق",
      en: "Intersection, union, difference",
      body: "<p>الـ Set في Dart جاهزة بعمليات المجموعات: <code>intersection</code> (المشترك)، <code>union</code> (الكل من غير تكرار)، <code>difference</code> (اللي في الأولى بس). لو معاك قوائم، حولها بـ <code>toSet()</code> الأول.</p>",
      code: {
        lang: "dart",
        src: `List<int> commonElements(List<int> a, List<int> b) {
  return a.toSet().intersection(b.toSet()).toList();
}

void main() {
  final a = {1, 2, 3, 4};
  final b = {3, 4, 5};
  print(a.intersection(b));      // {3, 4}
  print(a.union(b));             // {1, 2, 3, 4, 5}
  print(a.difference(b));        // {1, 2}
  print(a.containsAll({1, 2}));  // true

  print(commonElements([1, 2, 2, 3], [2, 3, 3, 4])); // [2, 3]
}`,
        note: "حتى لو العنصر مكرر في القوايم، النتيجة من غير تكرار. لو عايز التكرار يتحسب (min للعددين) استخدم Map بدل Set.",
      },
      interview: [
        { q: "إزاي تجيب العناصر المشتركة بين قايمتين؟", a: "أحول واحدة (الأقصر لو أقدر) لـ Set، وبعدين ألف على التانية وأشوف كل عنصر موجود في الـ Set. ده O(n + m) بدل O(n × m) للحل الغاشم. في Dart مباشرة: <code>a.toSet().intersection(b.toSet())</code>. وبسأل: التكرار يتحسب ولا لأ؟ لو أيوه أستخدم Map عدّاد.",
        },
      ],
    },
    {
      title: "التجميع: Group Anagrams",
      en: "Grouping with a key",
      body: "<p>التجميع (grouping) معناه: لكل عنصر احسب <b>مفتاح</b>، وحطه في قايمة تحت المفتاح ده. الكلمات اللي هي anagram لبعض لها نفس الحروف، فلو رتبت حروفها هتطلع نفس الكلمة. الكلمة المرتبة هي المفتاح. <code>putIfAbsent</code> بتنشئ القايمة لو المفتاح جديد وبترجعها، فتقدر تعمل <code>.add</code> عليها على طول.</p>",
      code: {
        lang: "dart",
        src: `List<List<String>> groupAnagrams(List<String> words) {
  final groups = <String, List<String>>{};
  for (final w in words) {
    final key = (w.split('')..sort()).join();   // 'tea' -> 'aet'
    groups.putIfAbsent(key, () => []).add(w);
  }
  return groups.values.toList();
}

void main() {
  print(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']));
  // [[eat, tea, ate], [tan, nat], [bat]]
  print(groupAnagrams([]));   // []
}`,
        note: "التعقيد O(n × k log k) حيث k طول الكلمة (بنرتب حروف كل كلمة). المقارنة الغاشمة لكل زوج كلمات كانت O(n² × k).",
      },
      focus: [{ label: "النمط", text: "ركز على سؤال واحد: «إيه اللي لو اتساوى في عنصرين، يبقوا من نفس المجموعة؟» ده هو المفتاح." }],
      interview: [
        { q: "اكتب Group Anagrams وقولي ليه اخترت المفتاح ده.", a: "الكلمتين anagram لو حروفهم نفسها بنفس العدد، فلو رتبت حروف كل كلمة هتطلع نفس الكلمة المرتبة، وبستخدمها كمفتاح في <code>Map&lt;String, List&lt;String&gt;&gt;</code>. لكل كلمة بحسب المفتاح وبضيفها للقايمة بـ <code>putIfAbsent</code>. في الآخر برجع <code>values</code>. التعقيد O(n × k log k). بديل: مفتاح من عدّاد 26 حرف وده O(n × k).",
        },
      ],
    },
    {
      title: "أول عنصر غير مكرر",
      en: "First unique element",
      body: "<p>مرحلتين لازم يكونوا منفصلين: (1) لفة تعد كل عنصر. (2) لفة تانية على القايمة <b>الأصلية</b> (مش الـ Map) وترجع أول عنصر عدده 1. السبب: الأصل هو اللي بيحافظ على ترتيب الظهور اللي المسألة بتسأل عنه.</p>",
      code: {
        lang: "dart",
        src: `int? firstUnique(List<int> nums) {
  final counts = <int, int>{};
  for (final n in nums) {
    counts[n] = (counts[n] ?? 0) + 1;
  }
  for (final n in nums) {
    if (counts[n] == 1) return n;
  }
  return null;
}

void main() {
  print(firstUnique([4, 5, 4, 6, 5]));  // 6
  print(firstUnique([2, 2]));           // null
  print(firstUnique([7]));              // 7
}`,
        note: "نفس الفكرة اللي استخدمناها في w6 لأول حرف غير مكرر، لكن بالـ Map بدل مصفوفة 26 خانة. التعقيد O(n).",
      },
      interview: [
        { q: "ازاي تلاقي أول عنصر مش مكرر في قايمة بمرورين؟", a: "المرور الأول بيبني Map بالعدّ. المرور التاني بيلف على القايمة الأصلية بالترتيب وبيرجع أول عنصر عدده في الـ Map يساوي 1. لو مفيش بنرجع null. بنلف على الأصل مش على الـ Map عشان ترتيب الظهور هو اللي مهم. O(n) زمن وO(k) مساحة.",
        },
      ],
    },
    {
      title: "Two Sum تاني، وعدّ الأزواج",
      en: "Two sum revisited",
      body: "<p>في w7 استخدمنا Map لـ Two Sum. دلوقتي نفهم الفكرة: لكل عنصر <code>n</code> أنا بدور على «شريكه» <code>target - n</code> في اللي فات. لو السؤال «فيه زوج؟» يكفي <code>Set</code>. لو «كام زوج؟» نحتاج Map بعدّ كل قيمة.</p>",
      code: {
        lang: "dart",
        src: `bool hasPairWithSum(List<int> nums, int target) {
  final seen = <int>{};
  for (final n in nums) {
    if (seen.contains(target - n)) return true;
    seen.add(n);
  }
  return false;
}

int countPairs(List<int> nums, int target) {
  final seen = <int, int>{};   // value -> how many times seen so far
  var pairs = 0;
  for (final n in nums) {
    pairs += seen[target - n] ?? 0;
    seen[n] = (seen[n] ?? 0) + 1;
  }
  return pairs;
}

void main() {
  print(hasPairWithSum([8, 3, 5], 11));   // true
  print(hasPairWithSum([5], 10));         // false
  print(countPairs([2, 2, 2], 4));        // 3
  print(countPairs([1, 1, 1, 2, 2], 3));  // 6
}`,
        note: "<code>[5]</code> مع target 10 بترجع false: العنصر مبيتجوزش نفسه. بس <code>[5, 5]</code> بترجع true. الفحص بيحصل قبل الإضافة.",
      },
      points: [
        "<b>غاشم</b>: كل الأزواج، O(n²) زمن وO(1) مساحة.",
        "<b>ترتيب + مؤشرين</b>: O(n log n) زمن، ومناسب لو القايمة مرتبة أصلا.",
        "<b>Set أو Map</b>: O(n) زمن وO(n) مساحة.",
      ],
      interview: [
        { q: "إيه الحلول الممكنة لمسألة «فيه زوجين مجموعهم target» وإيه الفرق؟", a: "الغاشم يجرب كل زوج: O(n²) ومساحة ثابتة. لو رتبت القايمة أقدر أستخدم مؤشرين من الطرفين: O(n log n) بسبب الترتيب. وبـ Set ألف مرة وأسأل لكل عنصر هل شريكه شفته قبل كده: O(n) لكن بمساحة O(n). أختار حسب القيود: لو الذاكرة مهمة أو القايمة مرتبة فالمؤشرين، غير كده الـ Set أسرع.",
        },
      ],
    },
    {
      title: "ليه البحث في الـ Map هو O(1)",
      en: "Hashing, average O(1)",
      body: "<p>الـ Map ورا الستار هي <b>جدول تجزئة</b> (hash table): مصفوفة من «سلات» (buckets). لما نخزن مفتاح، دالة <code>hash</code> بتحوله لرقم، والرقم % عدد السلات بيقول أنهي سلة. لما نبحث، بنحسب نفس الرقم ونروح لنفس السلة على طول من غير ما نمر على باقي العناصر. لو مفتاحين وقعوا في نفس السلة (collision)، بنقارن بالـ <code>==</code> جواها وهي عادة صغيرة جدا.</p>",
      code: {
        lang: "dart",
        src: `// A toy hash: not what Dart uses, just to show the idea
int toyHash(String key, int size) {
  var sum = 0;
  for (var i = 0; i < key.length; i++) {
    sum += key.codeUnitAt(i);
  }
  return sum % size;
}

void main() {
  final buckets = List.generate(4, (_) => <String>[]);
  for (final k in ['ali', 'sara', 'omar', 'nour']) {
    buckets[toyHash(k, buckets.length)].add(k);
  }
  print(buckets);
  // [[nour], [], [ali], [sara, omar]]
}`,
        note: "<code>sara</code> و <code>omar</code> وقعوا في نفس السلة (collision). البحث عن <code>omar</code> بيروح للسلة 3 بس ويقارن اتنين مش كل العناصر.",
      },
      points: [
        "<b>O(1) متوسط</b> مش مضمون: لو كل المفاتيح وقعت في سلة واحدة، البحث بيبقى O(n) في أسوأ حالة. الجدول الحقيقي بيكبر ويعيد التوزيع عشان يمنع ده.",
        "المفتاح لازم يكون ليه <code>==</code> و<code>hashCode</code> متوافقين: الأنواع الجاهزة (int, String) تمام.",
        "ممنوع تغير قيمة مفتاح بعد التخزين: السلة اتحسبت بالقيمة القديمة.",
      ],
      interview: [
        { q: "ليه البحث في Map أو Set بياخد O(1) في المتوسط؟ ومتى ممكن يبقى O(n)؟", a: "لأنها hash table: بحسب hash للمفتاح وأروح للسلة المناسبة مباشرة من غير ما أمر على العناصر. المقارنة بتحصل جوه السلة بس وهي عادة فيها عنصر أو اتنين. لو كتير مفاتيح وقعت في نفس السلة (collisions كتير بسبب hash سيء) البحث بيتحول لمسح خطي، يعني O(n) في أسوأ حالة. عشان كده نقول «O(1) متوسط».",
        },
      ],
    },
    {
      title: "ترتيب المفاتيح: امتى يفرق",
      en: "When key order matters",
      body: "<p>الـ Map و Set العاديين في Dart (literal أو constructor) بيحافظوا على <b>ترتيب الإدخال</b>. ده كويس بس مش ترتيب أبجدي ولا حسب القيمة. لو احتجت ترتيب تاني: ترتب المفاتيح في قايمة، أو تستخدم <code>SplayTreeMap</code> من <code>dart:collection</code> وهي بتحافظ على المفاتيح مرتبة (لكن العمليات فيها O(log n) مش O(1)).</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

void main() {
  final m = {'b': 2, 'c': 3, 'a': 1};
  print(m);                         // {b: 2, c: 3, a: 1}  insertion order
  print(m.keys.toList()..sort());   // [a, b, c]

  final sorted = SplayTreeMap<String, int>.from(m);
  print(sorted);                    // {a: 1, b: 2, c: 3}

  // Sort by value, biggest first
  final byValue = m.entries.toList()
    ..sort((x, y) => y.value.compareTo(x.value));
  print(byValue.first.key);         // c
}`,
        note: "مسائل «الأكتر تكرارا» و«top k» دايما محتاجة ترتيب بالقيمة: حول الـ entries لقايمة ورتبها.",
      },
      interview: [
        { q: "هل الـ Map في Dart بتحافظ على ترتيب الإدخال؟ ولو عايز المفاتيح مرتبة؟", a: "أيوه، الـ Map الافتراضي (<code>LinkedHashMap</code>) بيرجع المفاتيح بترتيب إدخالها. لو عايزها مرتبة أبجديا أخد <code>keys.toList()</code> وأرتبها، أو أستخدم <code>SplayTreeMap</code> اللي بتبقي المفاتيح مرتبة دايما بس العمليات فيها O(log n). ومينفعش أعتمد على ترتيب Map في لغة تانية من غير ما أتأكد من وثائقها.",
        },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: عدّ الحروف",
      lang: "dart",
      code: `Map<String, int> countChars(String s) {
  final counts = <String, int>{};
  for (var i = 0; i < s.length; i++) {
    final ch = s[i];
    counts[ch] = (counts[ch] ?? 0) + 1;
  }
  return counts;
}

void main() {
  print(countChars('banana'));
}`,
      note: "الناتج {b: 1, a: 3, n: 2}.",
    },
    {
      title: "اكتب: فيه مكرر؟",
      lang: "dart",
      code: `bool hasDuplicate(List<int> nums) {
  final seen = <int>{};
  for (final n in nums) {
    if (!seen.add(n)) return true;
  }
  return false;
}

void main() {
  print(hasDuplicate([1, 2, 3, 1]));
  print(hasDuplicate([1, 2, 3]));
}`,
      note: "true ثم false.",
    },
    {
      title: "اكتب: Group Anagrams",
      lang: "dart",
      code: `List<List<String>> groupAnagrams(List<String> words) {
  final groups = <String, List<String>>{};
  for (final w in words) {
    final key = (w.split('')..sort()).join();
    groups.putIfAbsent(key, () => []).add(w);
  }
  return groups.values.toList();
}

void main() {
  print(groupAnagrams(['eat', 'tea', 'tan', 'nat']));
}`,
      note: "الناتج [[eat, tea], [tan, nat]].",
    },
  ],

  tasks: [
    {
      title: "هل الكلمتين Anagram؟",
      lang: "dart",
      prompt: "<p>اكتب <code>bool isAnagram(String a, String b)</code> ترجع true لو الكلمتين فيهم نفس الحروف بنفس العدد (من غير اعتبار لحالة الحروف). استخدم Map عدّاد، من غير ترتيب.</p>",
      examples: [
        { in: "isAnagram('Listen', 'Silent')", out: "true" },
        { in: "isAnagram('abc', 'abd')", out: "false" },
        { in: "isAnagram('aab', 'ab')", out: "false" },
      ],
      starter: `bool isAnagram(String a, String b) {
  // your code
}`,
      hints: [
        "لو الطولين مختلفين ارجع false فورا.",
        "اعمل Map عدّاد: زوّد لحروف a وانقص لحروف b. لو أي عدد نزل تحت الصفر، أو أي قيمة مش صفر في الآخر، فمش anagram.",
      ],
      solution: `bool isAnagram(String a, String b) {
  final x = a.toLowerCase();
  final y = b.toLowerCase();
  if (x.length != y.length) return false;
  final counts = <String, int>{};
  for (var i = 0; i < x.length; i++) {
    counts[x[i]] = (counts[x[i]] ?? 0) + 1;
  }
  for (var i = 0; i < y.length; i++) {
    final left = counts[y[i]] ?? 0;
    if (left == 0) return false;
    counts[y[i]] = left - 1;
  }
  return true;
}`,
      explain: "بما إن الطولين متساويين، لو كل حرف من y لقى رصيد في العدّاد، يبقى كل الأرصدة اتصفرت. التعقيد O(n) بدل O(n log n) للترتيب.",
    },
    {
      title: "التقاطع من غير تكرار وبالترتيب",
      lang: "dart",
      prompt: "<p>اكتب <code>List&lt;int&gt; intersect(List&lt;int&gt; a, List&lt;int&gt; b)</code> ترجع العناصر الموجودة في القايمتين، من غير تكرار، بنفس ترتيب أول ظهورها في <code>a</code>.</p>",
      examples: [
        { in: "intersect([4, 9, 5, 4], [9, 4, 9, 8, 4])", out: "[4, 9]" },
        { in: "intersect([1, 2], [3])", out: "[]" },
      ],
      starter: `List<int> intersect(List<int> a, List<int> b) {
  // your code
}`,
      hints: [
        "حول b لـ Set عشان البحث يبقى O(1).",
        "لف على a، واستخدم Set تانية للي اتضاف عشان متكررش.",
      ],
      solution: `List<int> intersect(List<int> a, List<int> b) {
  final inB = b.toSet();
  final added = <int>{};
  final out = <int>[];
  for (final n in a) {
    if (inB.contains(n) && added.add(n)) {
      out.add(n);
    }
  }
  return out;
}`,
      explain: "O(n + m) زمن وO(n + m) مساحة. <code>intersection</code> الجاهزة كانت هتحل نفس المسألة لكن مش مضمون إن ترتيب النتيجة يتبع ترتيب a، فكتبناها بإيدينا للتحكم في الترتيب.",
    },
    {
      title: "أكتر الكلمات تكرارا",
      lang: "dart",
      prompt: "<p>اكتب <code>List&lt;String&gt; topWords(String text, int k)</code> ترجع أكتر <code>k</code> كلمات تكرارا في النص (الكلمات مفصولة بمسافة، تجاهل حالة الحروف والكلمات الفاضية). عند التعادل رتب أبجديا.</p>",
      examples: [
        { in: "topWords('b a b c a b', 2)", out: "[b, a]" },
        { in: "topWords('x y z', 2)", out: "[x, y]" },
      ],
      starter: `List<String> topWords(String text, int k) {
  // your code
}`,
      hints: [
        "عُد الكلمات في Map بعد <code>toLowerCase().split(' ')</code> وتجاهل الفاضي.",
        "رتب قايمة المفاتيح بمقارنة: العدد تنازلي، ولو متساوي فالكلمة أبجديا. بعدين <code>take(k)</code>.",
      ],
      solution: `List<String> topWords(String text, int k) {
  final counts = <String, int>{};
  for (final w in text.toLowerCase().split(' ')) {
    if (w.isEmpty) continue;
    counts[w] = (counts[w] ?? 0) + 1;
  }
  final words = counts.keys.toList();
  words.sort((a, b) {
    final byCount = counts[b]!.compareTo(counts[a]!);
    return byCount != 0 ? byCount : a.compareTo(b);
  });
  return words.take(k).toList();
}`,
      explain: "العدّ O(n)، والترتيب O(d log d) حيث d عدد الكلمات المختلفة. <code>counts[b]!</code> آمن لأن المفاتيح كلها من الـ Map نفسها. <code>take(k)</code> بتشتغل كويس حتى لو k أكبر من عدد الكلمات.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final counts = <String, int>{};
for (final ch in ['a', 'a', 'b']) {
  counts[ch] = (counts[ch] ?? 0) + 1;
}
print(counts);` },
      answer: ["{a: 2, b: 1}", "{a:2,b:1}"],
      why: "a ظهرت مرتين وb مرة. والـ Map بتحافظ على ترتيب الإدخال فa الأول.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final s = {1, 2, 2, 3, 3, 3};
print(s.length);` },
      answer: ["3"],
      why: "الـ Set بتشيل التكرار فالعناصر 1 و2 و3 بس.",
    },
    {
      q: "ليه البحث في <code>Map</code> بيوصف بأنه O(1) في المتوسط وليس مضمون؟",
      options: [
        "لأن الـ Map بتفحص نصف العناصر في المتوسط",
        "لأن الـ hash بيودي المفتاح لسلة معينة مباشرة، لكن لو collisions كتير ممكن يتحول لمسح خطي",
        "لأن الـ Map بتتخزن مرتبة وبتستخدم binary search",
        "لأن Dart بتحسب الـ hash مرة في اليوم",
      ],
      answer: 1,
      why: "الجدول الحقيقي بيوزع المفاتيح على سلات فالبحث مباشر. وجود collisions كتير في سلة واحدة بيخلي المقارنة على كل عناصرها (O(n) في أسوأ حالة). الـ Map العادية مش مرتبة ومش binary search، ده SplayTreeMap وبتكلف O(log n).",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final a = {1, 2, 3};
final b = {2, 3, 4};
print(a.intersection(b));` },
      answer: ["{2, 3}", "{2,3}"],
      why: "المشترك بين المجموعتين هو 2 و3. الـ Set بتتطبع بين أقواس معقوصة زي الـ Map.",
    },
    {
      q: "نوع <code>x</code> هنا إيه؟",
      code: { lang: "dart", src: `var x = {};` },
      options: [
        "<code>Set&lt;dynamic&gt;</code>",
        "<code>List&lt;dynamic&gt;</code>",
        "<code>Set&lt;int&gt;</code>",
        "<code>Map&lt;dynamic, dynamic&gt;</code>",
      ],
      answer: 3,
      why: "الأقواس المعقوصة الفاضية في Dart معناها Map. لعمل Set فاضي لازم تحدد النوع: <code>&lt;int&gt;{}</code>.",
    },
    {
      q: "الناتج إيه؟ (الكود بيبني المفتاح اللي بنجمع بيه الـ anagrams)",
      code: { lang: "dart", src: `print(('tea'.split('')..sort()).join());` },
      answer: ["aet"],
      why: "<code>'tea'.split('')</code> بتدي [t, e, a]. <code>..sort()</code> بترتبها [a, e, t] وبترجع القايمة نفسها. و<code>join()</code> بتجمعها aet. eat و ate و tea كلهم ليهم نفس المفتاح.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final m = {'a': 1};
print(m['b'] ?? -1);` },
      answer: ["-1"],
      why: "المفتاح b مش موجود فالقراءة بترجع null، و<code>??</code> بتدي القيمة البديلة -1. الـ Map مبترميش error لما المفتاح ناقص.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `int? firstUnique(List<int> nums) {
  final counts = <int, int>{};
  for (final n in nums) {
    counts[n] = (counts[n] ?? 0) + 1;
  }
  for (final n in nums) {
    if (counts[n] == 1) return n;
  }
  return null;
}

void main() {
  print(firstUnique([4, 5, 4, 6, 5]));
}` },
      answer: ["6"],
      why: "العدّ: 4 مرتين و5 مرتين و6 مرة. أول عنصر في القايمة عدده 1 هو 6.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `int countPairs(List<int> nums, int target) {
  final seen = <int, int>{};
  var pairs = 0;
  for (final n in nums) {
    pairs += seen[target - n] ?? 0;
    seen[n] = (seen[n] ?? 0) + 1;
  }
  return pairs;
}

void main() {
  print(countPairs([2, 2, 2], 4));
}` },
      answer: ["3"],
      why: "اللفة الأولى: لسه مفيش حد. التانية: شافت 2 واحدة فبتزود 1. التالتة: شافت 2 اتنين فبتزود 2. المجموع 3، وده عدد طرق اختيار زوج من تلاتة.",
    },
    {
      q: "عايز المفاتيح مرتبة أبجديا طول الوقت، مش بس مرة واحدة. أنسب إيه؟",
      options: [
        "<code>Map</code> عادية لأنها بترتب أوتوماتيك",
        "<code>Set</code> بدل Map",
        "<code>SplayTreeMap</code> من <code>dart:collection</code>",
        "<code>List</code> وبحث خطي",
      ],
      answer: 2,
      why: "الـ Map العادية بتحافظ على ترتيب الإدخال مش ترتيب المفاتيح. <code>SplayTreeMap</code> بتخلي المفاتيح مرتبة دايما بتكلفة O(log n) للعملية. ولو محتاج الترتيب مرة واحدة بس، ترتب <code>keys.toList()</code> وخلاص.",
    },
  ],
};
