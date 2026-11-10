window.LEVELS = window.LEVELS || {};
window.LEVELS["dart/d3"] = {
  slides: [
    {
      kicker: "ليه القوايم والخرائط",
      title: "كل شاشة في Flutter هي List بتتحول لـ widgets",
      en: "Collections in everyday code",
      body: "<p>قائمة مكاتب، خريطة بيانات JSON، مجموعة اختيارات: كل ده collections. والفرق بين شخص بيكتب Dart بالعافية وشخص بيكتبها بسلاسة هو إنه يعرف يستخدم <code>map</code> و <code>where</code> و <code>fold</code> بدل ما يكتب <code>for</code> ومتغير مؤقت في كل مرة.</p><p>في المستوى ده: الأنواع التلاتة (<code>List</code> و <code>Map</code> و <code>Set</code>)، الـ spread والـ collection if/for، دوال الـ Iterable، الترتيب، الكسل (laziness)، والفرق بين النسخ والمشاركة.</p>",
      points: [
        "الإنترفيو بيحب: إيه الفرق بين <code>List</code> و <code>Set</code>؟ إيه الفرق بين <code>map</code> و <code>forEach</code>؟ ليه <code>map</code> بترجع Iterable مش List؟",
        "نصف مشاكل الـ state في Flutter هي في الحقيقة مشاكل «شاورت على نفس الـ List وعدلت فيها».",
      ],
    },
    {
      title: "List: القايمة المرتبة",
      en: "List core API",
      body: "<p><code>List&lt;T&gt;</code> قايمة مرتبة بتبدأ من index 0 وبتقبل التكرار. الحجم بيكبر ويصغر لوحده (الـ growable list هي الافتراضية).</p>",
      code: {
        lang: "dart",
        src: `void main() {
  final nums = <int>[3, 1, 2];
  nums.add(4);                  // [3, 1, 2, 4]
  nums.addAll([5, 6]);          // [3, 1, 2, 4, 5, 6]
  nums.insert(0, 9);            // [9, 3, 1, 2, 4, 5, 6]
  nums.remove(1);               // removes the first 1
  nums.removeAt(0);             // removes index 0 (the 9)

  print(nums);                  // [3, 2, 4, 5, 6]
  print(nums.length);           // 5
  print('\${nums.first} \${nums.last}');   // 3 6
  print(nums[1]);               // 2
  print(nums.contains(4));      // true
  print(nums.indexOf(4));       // 2
  print(nums.sublist(1, 3));    // [2, 4]
  print(nums.isEmpty);          // false
  print(<int>[].firstOrNull);   // null
}`,
        note: "<code>final</code> على الـ List معناها المتغير ثابت، مش المحتوى. تقدر تضيف وتحذف براحتك.",
      },
      pitfall: "<code>nums[10]</code> على قايمة حجمها 5 بترمي <code>RangeError</code>. و <code>first</code> على قايمة فاضية بترمي <code>StateError</code>. لو القايمة ممكن تكون فاضية استخدم <code>firstOrNull</code> وافحص النتيجة.",
    },
    {
      title: "Map: مفتاح وقيمة",
      en: "Map core API",
      body: "<p><code>Map&lt;K, V&gt;</code> بتربط مفتاح بقيمة. المفاتيح فريدة، والبحث بالمفتاح سريع. أهم نقطة: قراءة مفتاح مش موجود <b>مبترميش خطأ</b>، بترجع <code>null</code>، فنوع النتيجة دايما <code>V?</code>.</p>",
      code: {
        lang: "dart",
        src: `void main() {
  final prices = <String, int>{'tea': 10, 'coffee': 25};
  prices['milk'] = 15;                     // add
  print(prices['tea']);                    // 10
  print(prices['sugar']);                  // null  (type int?)
  print(prices['sugar'] ?? 0);             // 0

  prices.putIfAbsent('tea', () => 99);     // tea exists: unchanged
  prices.update('tea', (v) => v + 5);      // tea: 15
  prices.remove('milk');

  print(prices.containsKey('coffee'));     // true
  print(prices);                           // {tea: 15, coffee: 25}
  print(prices.keys.toList());             // [tea, coffee]
  print(prices.values.toList());           // [15, 25]

  for (final e in prices.entries) {
    print('\${e.key} -> \${e.value}');
  }
}`,
        note: "الـ Map العادي (literal) بيحافظ على ترتيب الإضافة لما بتلف عليه.",
      },
      terms: [
        ["entry", "زوج مفتاح وقيمة", "<code>prices.entries</code> بتدّيك objects فيها <code>key</code> و <code>value</code> للفّ عليها."],
      ],
      interview: [
        { q: "إيه اللي بيرجع من <code>map['key']</code> لو المفتاح مش موجود؟ وبنتعامل معاه إزاي؟", a: "بيرجع <code>null</code> ومبيرميش خطأ، ولذلك نوع النتيجة <code>V?</code> دايما حتى لو القيم نفسها non-nullable. بتعامل معاه بـ <code>??</code> لقيمة بديلة (<code>map['x'] ?? 0</code>)، أو بفحص <code>if (value != null)</code>. الـ <code>!</code> بتاخدها بس لو متأكد إن المفتاح موجود." },
      ],
    },
    {
      title: "Set: من غير تكرار",
      en: "Set core API",
      body: "<p><code>Set&lt;T&gt;</code> مجموعة عناصر <b>فريدة</b>، فحص «هل العنصر موجود؟» فيها سريع. بنستخدمها لإزالة التكرار، وللعمليات الرياضية: اتحاد (<code>union</code>)، تقاطع (<code>intersection</code>)، فرق (<code>difference</code>).</p>",
      code: {
        lang: "dart",
        src: `void main() {
  final tags = {'a', 'b', 'a'};            // Set<String>
  print(tags);                             // {a, b}
  print(tags.add('c'));                    // true  (it was new)
  print(tags.add('c'));                    // false (already there)

  final x = {1, 2, 3};
  final y = {3, 4};
  print(x.union(y));                       // {1, 2, 3, 4}
  print(x.intersection(y));                // {3}
  print(x.difference(y));                  // {1, 2}

  print(['a', 'b', 'a'].toSet().toList()); // [a, b]

  final empty = {};                        // careful: this is a Map!
  final emptySet = <int>{};                // this is an empty Set
  print('\${empty.runtimeType} \${emptySet.runtimeType}');
}`,
        note: "آخر سطر بيطبع <code>_Map&lt;dynamic, dynamic&gt; _Set&lt;int&gt;</code> (الاسم الداخلي ممكن يختلف حسب الإصدار).",
      },
      pitfall: "<code>{}</code> لوحدها في Dart هي <b>Map</b> مش Set. لو عايز Set فاضية اكتب <code>&lt;int&gt;{}</code> أو <code>Set&lt;int&gt;()</code>.",
      interview: [
        { q: "إمتى تستخدم <code>Set</code> بدل <code>List</code>؟", a: "لما التكرار ملوش معنى وعايز أتأكد إن العنصر مرة واحدة، زي IDs المختارة أو التاجات، ولما أكتر عملية عندي هي «هل العنصر موجود؟» لأن <code>contains</code> في الـ Set سريعة (hash) مقابل بحث خطي في الـ List. وكمان لما أحتاج عمليات المجموعات: union و intersection. لو الترتيب أو الـ index مهم، أستخدم List." },
      ],
    },
    {
      title: "Spread وcollection if/for",
      en: "Spread, collection if, collection for",
      body: "<p>جوه الـ literal نفسه تقدر تدمج قايمة تانية بـ <code>...</code>، وتضيف عنصر بشرط بـ <code>if</code>، وتولّد عناصر بـ <code>for</code>. ده بيخلي بناء القوايم تصريحي بدل سلسلة <code>add</code>.</p>",
      code: {
        lang: "dart",
        src: `void main() {
  final base = [1, 2];
  final more = [...base, 3, 4];             // [1, 2, 3, 4]

  List<int>? maybe;
  final safe = [0, ...?maybe];              // [0]  (...? skips null)

  final isAdmin = true;
  final menu = [
    'Home',
    if (isAdmin) 'Admin',
    for (final n in base) 'Item $n',
  ];
  print(menu);                              // [Home, Admin, Item 1, Item 2]

  final config = {
    'a': 1,
    ...{'b': 2},
    if (isAdmin) 'c': 3,
  };
  print(config);                            // {a: 1, b: 2, c: 3}
  print('$more $safe');                     // [1, 2, 3, 4] [0]
}`,
        note: "<code>...?</code> هي spread الآمنة من الـ null. شغالة على List و Set و Map.",
      },
      focus: [{ label: "في Flutter", text: "<code>children: [Header(), if (loading) Spinner(), ...items.map(ItemTile.new)]</code>: ده شكل الـ UI كله تقريبا. وكمان نمط تحديث الـ state: <code>items = [...items, newItem]</code> بيعمل قايمة جديدة بدل التعديل في القديمة." }],
    },
    {
      title: "دوال الـ Iterable: map وwhere وfold",
      en: "map, where, fold, reduce, any, every, firstWhere, expand",
      body: "<p>الدوال دي موجودة على أي <code>Iterable</code> (القايمة والمجموعة). كل واحدة بتاخد دالة. فهمها هو الفرق بين كود قصير ومقروء وكود فيه ٣ متغيرات مؤقتة.</p>",
      code: {
        lang: "dart",
        src: `void main() {
  final nums = [1, 2, 3, 4, 5];

  print(nums.map((n) => n * n).toList());       // [1, 4, 9, 16, 25]
  print(nums.where((n) => n.isOdd).toList());   // [1, 3, 5]
  final total = nums.fold(0, (sum, n) => sum + n);
  print(total);                                 // 15
  print(nums.reduce((a, b) => a > b ? a : b));  // 5
  print(nums.any((n) => n > 4));                // true
  print(nums.every((n) => n > 0));              // true
  print(nums.firstWhere((n) => n > 10, orElse: () => -1));  // -1
  print([[1, 2], [3]].expand((l) => l).toList());           // [1, 2, 3]
}`,
        note: "اكتب <code>final total = nums.fold(...)</code> في سطر لوحده. لو حطيتها جوه <code>print(...)</code> Dart بتستنتج النوع من السياق (<code>Object?</code>) فيطلع خطأ على <code>+</code>؛ والحل الصريح <code>fold&lt;int&gt;(0, ...)</code>.",
      },
      terms: [
        ["map", "حوّل كل عنصر", "بتطلع عنصر جديد لكل عنصر قديم، نفس العدد."],
        ["where", "فلتر", "بتخلي العناصر اللي الشرط فيها true."],
        ["fold", "اطوي لقيمة واحدة", "بتبدأ من قيمة ابتدائية وتجمّع عليها (ممكن نوع مختلف)."],
        ["expand", "فرد القوايم", "كل عنصر يتحول لعدة عناصر وتتفرد في قايمة واحدة."],
      ],
      pitfall: "<code>reduce</code> على قايمة فاضية بترمي <code>StateError</code>، و <code>firstWhere</code> من غير <code>orElse</code> بترمي لو مفيش عنصر مطابق. الأأمن: <code>fold</code> بقيمة ابتدائية، و <code>firstWhere(..., orElse: ...)</code> أو <code>where(...).firstOrNull</code>.",
      interview: [
        { q: "إيه الفرق بين <code>fold</code> و <code>reduce</code>؟", a: "<code>reduce</code> بتبدأ بأول عنصر وبتدمج الباقي، فنتيجتها بنفس نوع العناصر وبترمي خطأ على قايمة فاضية. <code>fold</code> بتاخد قيمة ابتدائية بتحددها، فنتيجتها ممكن تبقى نوع مختلف (جمع أسعار من قايمة objects مثلا)، وبتشتغل على الفاضية وترجع القيمة الابتدائية. لذلك بستخدم <code>fold</code> في أغلب الحالات." },
      ],
    },
    {
      title: "الترتيب بـ comparator",
      en: "sort with a comparator",
      body: "<p><code>sort</code> بتغير القايمة نفسها وبترجع <code>void</code>. من غير arguments بترتب الترتيب الطبيعي. ولو عايز ترتيب مخصص، ادّيها دالة بتقارن عنصرين <code>a</code> و <code>b</code> وترجع رقم سالب لو <code>a</code> قبل <code>b</code>، صفر لو متساويين، موجب لو بعده.</p>",
      code: {
        lang: "dart",
        src: `void main() {
  final names = ['Sara', 'ali', 'Omar'];
  names.sort();
  print(names);                 // [Omar, Sara, ali]  (uppercase first)

  names.sort((a, b) => a.toLowerCase().compareTo(b.toLowerCase()));
  print(names);                 // [ali, Omar, Sara]

  final nums = [3, 1, 2];
  nums.sort((a, b) => b.compareTo(a));       // descending
  print(nums);                  // [3, 2, 1]

  final words = ['pear', 'fig', 'apple', 'kiwi', 'date'];
  words.sort((a, b) {
    final byLength = a.length.compareTo(b.length);
    return byLength != 0 ? byLength : a.compareTo(b);   // tie-break
  });
  print(words);                 // [fig, date, kiwi, pear, apple]

  final copy = [...nums];       // sort a copy, keep the original
  copy.sort();
  print('$nums $copy');         // [3, 2, 1] [1, 2, 3]
}`,
      },
      pitfall: "<code>final sorted = list.sort();</code> غلط: <code>sort</code> بترجع <code>void</code> وبتعدّل الأصل. اعمل نسخة الأول (<code>[...list]</code>) وبعدين رتبها لو عايز تحافظ على الأصل.",
    },
    {
      title: "الكسل: Iterable مش List",
      en: "Iterable laziness and toList",
      body: "<p><code>map</code> و <code>where</code> مبترجعوش List، بيرجعوا <b>Iterable كسول</b>: مبيشتغلش ولا حاجة لحد ما حد يلف عليه. وكل مرة تلف عليه بيشتغل من الأول تاني. <code>toList()</code> هي اللي بتنفذ وتثبّت النتيجة.</p>",
      code: {
        lang: "dart",
        src: `void main() {
  final nums = [1, 2, 3];
  final big = nums.where((n) => n > 1);   // nothing runs yet

  nums.add(4);                            // changes the source
  print(big.toList());                    // [2, 3, 4]

  final doubled = nums.map((n) {
    print('map $n');
    return n * 2;
  });
  print('before');                        // runs before any "map"
  print(doubled.first);                   // prints "map 1" then 2

  final fixed = doubled.toList();         // runs the lambda for all 4
  print(fixed);                           // [2, 4, 6, 8]
  print(nums.map((n) => n * 2));          // (2, 4, 6, 8): parentheses = Iterable
}`,
        note: "الـ Iterable بيتطبع بين أقواس عادية <code>( )</code> والـ List بين <code>[ ]</code>، وده كاشف سريع لو نسيت <code>toList()</code>.",
      },
      pitfall: "لو خزنت نتيجة <code>map</code> من غير <code>toList()</code> وبعدين استخدمتها في أكتر من مكان، الدالة جواها هتتنفذ كل مرة من جديد (وممكن تكون تقيلة)، ولو القايمة الأصلية اتغيرت النتيجة هتتغير. ثبّتها بـ <code>toList()</code> لما تحتاج.",
      interview: [
        { q: "ليه <code>list.map(...)</code> بترجع Iterable مش List؟ وإيه المشكلة؟", a: "لأنها lazy: بتحسب العنصر وقت ما حد يطلبه، وده بيوفر شغل لو هتاخد أول كام عنصر بس. المشكلة إن كل مرة بتلف عليها بتنفذ الدالة من الأول، وإن النتيجة بتعكس أي تغيير في المصدر. فلو محتاج List ثابتة أو هتستخدمها أكتر من مرة أو هتبعتها لـ widget بيطلب List، اعمل <code>.toList()</code>." },
      ],
    },
    {
      title: "نسخة ولا نفس القايمة؟ و const",
      en: "Copying vs sharing, const and unmodifiable",
      body: "<p>في Dart الـ List object، والمتغير بيشاور عليه. <code>final b = a</code> مش بتعمل قايمة جديدة، بتخلّي المتغيرين يشاوروا على نفس القايمة. لعمل نسخة: <code>[...a]</code> أو <code>List.of(a)</code> أو <code>a.toList()</code>. وكلهم <b>shallow</b>: العناصر نفسها مش بتتنسخ.</p>",
      code: {
        lang: "dart",
        src: `void main() {
  final a = [1, 2, 3];
  final b = a;                 // same list, two names
  b.add(4);
  print(a);                    // [1, 2, 3, 4]

  final c = [...a];            // a real copy
  c.add(5);
  print(a.length);             // 4 (unchanged)

  final nested = [[1], [2]];
  final copy = [...nested];    // shallow: inner lists are shared
  copy[0].add(9);
  print(nested);               // [[1, 9], [2]]

  final k = const [1, 2];
  final u = List.unmodifiable(a);
  try {
    k.add(3);
  } on UnsupportedError {
    print('const list is unmodifiable');
  }
  try {
    u.add(3);
  } on UnsupportedError {
    print('unmodifiable copy');
  }
}`,
        note: "<code>const [1, 2]</code> ثابتة وقت الكومبايل. <code>List.unmodifiable(a)</code> بتعمل نسخة منها مينفعش تتعدل وقت التشغيل (الأصل <code>a</code> ممكن يتعدل ومبيأثرش فيها).",
      },
      interview: [
        { q: "لو عملت <code>final b = a;</code> على List وعدلت في <code>b</code>، إيه اللي بيحصل في <code>a</code>؟ وإزاي أعمل نسخة؟", a: "<code>a</code> هتتغير كمان لأن الاتنين بيشاوروا على نفس الـ object. لعمل نسخة: <code>[...a]</code> أو <code>List.of(a)</code> أو <code>a.toList()</code>. بس دي نسخة shallow: لو العناصر نفسها objects قابلة للتعديل (قوايم جوه قايمة)، النسخة بتشارك العناصر دي مع الأصل، ولعمل نسخة عميقة لازم أنسخ كل مستوى بنفسي." },
        { q: "إيه الفرق بين <code>final list = []</code> و <code>const list = []</code> و <code>List.unmodifiable(...)</code>؟", a: "<code>final</code> بتثبت المتغير بس، والقايمة تقدر تتعدل. <code>const</code> قايمة ثابتة معروفة وقت الكومبايل، ومحاولة تعديلها بترمي <code>UnsupportedError</code> وقت التشغيل. <code>List.unmodifiable(x)</code> بتعمل نسخة وقت التشغيل مينفعش تتعدل، وبستخدمها لما أرجّع قايمة من كلاس وعايز أحمي الداخلية بتاعتي من التعديل برا." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: List وsort",
      lang: "dart",
      code: `void main() {
  final nums = [3, 1, 2];
  nums.add(4);
  nums.sort((a, b) => b.compareTo(a));
  print(nums);
  print(nums.where((n) => n.isEven).toList());
  print(nums.map((n) => n * 10).toList());
}`,
    },
    {
      title: "اكتب: Map وfold",
      lang: "dart",
      code: `void main() {
  final prices = <String, int>{'tea': 10, 'coffee': 25};
  prices['milk'] = 15;
  prices.update('tea', (v) => v + 5);
  final total = prices.values.fold(0, (sum, v) => sum + v);
  print(total);
  for (final e in prices.entries) {
    print('\${e.key} = \${e.value}');
  }
}`,
      note: "خد بالك من <code>\${e.key}</code>: لما التعبير فيه نقطة لازم الأقواس المجعدة.",
    },
    {
      title: "اكتب: spread وcollection if/for",
      lang: "dart",
      code: `List<String> buildMenu(bool isAdmin, List<String> extra) {
  return [
    'Home',
    if (isAdmin) 'Admin',
    for (final e in extra) 'Item $e',
    ...extra.map((e) => e.toUpperCase()),
  ];
}

void main() {
  final menu = buildMenu(true, ['a', 'b']);
  print(menu);
  print(menu.length);
}`,
    },
  ],

  tasks: [
    {
      title: "عدّ الكلمات",
      lang: "dart",
      prompt: "<p>اكتب <code>Map&lt;String, int&gt; countWords(List&lt;String&gt; words)</code> بترجع كل كلمة وعدد مرات ظهورها.</p>",
      examples: [
        { in: "countWords(['a', 'b', 'a'])", out: "{a: 2, b: 1}" },
        { in: "countWords([])", out: "{}" },
      ],
      starter: `Map<String, int> countWords(List<String> words) {
  // your code
}`,
      hints: [
        "ابدأ بـ map فاضية <code>&lt;String, int&gt;{}</code> ولف على الكلمات.",
        "لكل كلمة: القيمة الحالية <code>counts[w] ?? 0</code> زائد واحد. فاكر إن قراءة مفتاح مش موجود بترجع null.",
      ],
      solution: `Map<String, int> countWords(List<String> words) {
  final counts = <String, int>{};
  for (final w in words) {
    counts[w] = (counts[w] ?? 0) + 1;
  }
  return counts;
}`,
      explain: "النمط <code>map[k] = (map[k] ?? 0) + 1</code> هو أكتر نمط تعدّ بيه في Dart. بديله <code>counts.update(w, (v) =&gt; v + 1, ifAbsent: () =&gt; 1)</code>. التعقيد O(n).",
    },
    {
      title: "أطول الكلمات من غير تكرار",
      lang: "dart",
      prompt: "<p>اكتب <code>List&lt;String&gt; topLongest(List&lt;String&gt; words, int n)</code>: بتشيل التكرار، وترتب الكلمات من الأطول للأقصر (ولو نفس الطول ترتيب أبجدي)، وترجع أول <code>n</code> كلمة. لو الكلمات أقل من <code>n</code> ترجع الموجود.</p>",
      examples: [
        { in: "topLongest(['pear', 'fig', 'apple', 'kiwi', 'fig', 'plum'], 3)", out: "[apple, kiwi, pear]" },
        { in: "topLongest(['a'], 5)", out: "[a]" },
      ],
      hints: [
        "<code>words.toSet().toList()</code> بتشيل التكرار.",
        "الـ comparator: قارن الأطوال بالعكس (<code>b.length.compareTo(a.length)</code>)، ولو النتيجة 0 قارن النصوص.",
        "<code>take(n)</code> آمنة لو العناصر أقل من n، بس افتكر <code>toList()</code> بعدها.",
      ],
      solution: `List<String> topLongest(List<String> words, int n) {
  final unique = words.toSet().toList();
  unique.sort((a, b) {
    final byLength = b.length.compareTo(a.length);
    return byLength != 0 ? byLength : a.compareTo(b);
  });
  return unique.take(n).toList();
}`,
      explain: "رتبنا نسخة (<code>unique</code>) فالقايمة الأصلية ما اتعدلتش. <code>take</code> بترجع Iterable كسول فبنحولها بـ <code>toList()</code>. التعقيد O(n log n) بسبب الترتيب.",
    },
    {
      title: "جمّع بالحرف الأول",
      lang: "dart",
      prompt: "<p>اكتب <code>Map&lt;String, List&lt;String&gt;&gt; groupByFirstLetter(List&lt;String&gt; words)</code>: المفتاح هو أول حرف من الكلمة، والقيمة قايمة الكلمات اللي بتبدأ بيه بنفس ترتيب ظهورها. (الكلمات مش فاضية.)</p>",
      examples: [
        { in: "groupByFirstLetter(['apple', 'avocado', 'banana'])", out: "{a: [apple, avocado], b: [banana]}" },
      ],
      hints: [
        "كل كلمة ليها حرف أول: <code>w[0]</code>.",
        "<code>putIfAbsent(key, () =&gt; [])</code> بترجع القايمة الموجودة أو بتعمل واحدة جديدة، وتقدر تعمل عليها <code>.add(w)</code> على طول.",
      ],
      solution: `Map<String, List<String>> groupByFirstLetter(List<String> words) {
  final groups = <String, List<String>>{};
  for (final w in words) {
    groups.putIfAbsent(w[0], () => []).add(w);
  }
  return groups;
}`,
      explain: "<code>putIfAbsent</code> بترجع القيمة (الموجودة أو الجديدة) فنقدر نسلسل <code>.add</code> عليها. ده نمط الـ grouping. بدون ما نفتكر نعمل القايمة الأول كنا هنحتاج if وفحص null.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print({1, 2, 2, 3, 3, 3}.length);` },
      answer: ["3"],
      why: "الـ Set بتشيل التكرار، فبتفضل 1 و 2 و 3 بس.",
    },
    {
      q: "إيه نوع المتغير <code>x</code>؟",
      code: { lang: "dart", src: `var x = {};` },
      options: ["<code>Set&lt;dynamic&gt;</code>", "<code>Map&lt;dynamic, dynamic&gt;</code>", "<code>List&lt;dynamic&gt;</code>", "خطأ، لازم نوع"],
      answer: 1,
      why: "<code>{}</code> فاضية من غير نوع بتتفسر Map مش Set. لو عايز Set فاضية اكتب <code>&lt;int&gt;{}</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final a = [1, 2];
final b = a;
b.add(3);
print(a.length);` },
      answer: ["3"],
      why: "<code>b = a</code> مش بتنسخ، الاتنين بيشاوروا على نفس القايمة. النسخة كانت هتبقى <code>[...a]</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print([1, 2, 3].map((n) => n * 2));` },
      options: ["<code>[2, 4, 6]</code>", "<code>(2, 4, 6)</code>", "<code>Instance of 'MappedListIterable'</code>", "<code>{2, 4, 6}</code>"],
      answer: 1,
      why: "<code>map</code> بترجع Iterable كسول، و toString بتاعه بيطبع العناصر بين أقواس عادية. لو عايز <code>[2, 4, 6]</code> لازم <code>.toList()</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final r = [1, 2, 3].fold(10, (s, n) => s + n);
print(r);` },
      answer: ["16"],
      why: "<code>fold</code> بتبدأ من القيمة الابتدائية 10 وتجمّع عليها: 10 + 1 + 2 + 3 = 16.",
    },
    {
      q: "أنهي سطر هيرمي خطأ وقت التشغيل؟",
      options: [
        "<code>[1, 2].firstWhere((n) => n > 5, orElse: () => 0);</code>",
        "<code>[1, 2].fold(0, (s, n) => s + n);</code>",
        "<code>&lt;int&gt;[].firstOrNull;</code>",
        "<code>&lt;int&gt;[].reduce((a, b) => a + b);</code>",
      ],
      answer: 3,
      why: "<code>reduce</code> محتاجة عنصر واحد على الأقل وإلا بترمي <code>StateError</code>. الباقي آمن: orElse بيدي بديل، و fold عندها قيمة ابتدائية، و firstOrNull بترجع null.",
    },
    {
      q: "إيه المشكلة في السطر ده؟",
      code: { lang: "dart", src: `final nums = [3, 1, 2];
final sorted = nums.sort();` },
      options: [
        "<code>sort</code> بترجع <code>void</code>، فـ <code>sorted</code> مفيهاش قايمة، والأصل اتعدل",
        "<code>sort</code> محتاجة comparator دايما",
        "<code>nums</code> final فمينفعش تترتب",
        "مفيش مشكلة، <code>sorted</code> قايمة مرتبة جديدة",
      ],
      answer: 0,
      why: "<code>sort</code> بترتب القايمة الأصلية في مكانها وبترجع <code>void</code>. <code>final</code> مبتمنعش تعديل المحتوى. الصح: <code>final sorted = [...nums]; sorted.sort();</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final nested = [[1], [2]];
final copy = [...nested];
copy[0].add(9);
print(nested);` },
      options: ["<code>[[1], [2]]</code>", "<code>[[1, 9], [2]]</code>", "<code>[[1], [2], 9]</code>", "خطأ وقت التشغيل"],
      answer: 1,
      why: "الـ spread بتعمل نسخة shallow: القايمة الخارجية جديدة، لكن القوايم الداخلية هي نفسها مشتركة. لو عدلت جوه واحدة، الأصل بيشوف التعديل.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `List<int>? extra;
final all = [0, ...?extra, if (extra == null) 9];
print(all);` },
      options: ["<code>[0]</code>", "<code>[0, null, 9]</code>", "خطأ وقت التشغيل", "<code>[0, 9]</code>"],
      answer: 3,
      why: "<code>...?extra</code> بتتخطى لما <code>extra</code> null فمبتضيفش حاجة، وبعدها شرط <code>if</code> صح فبيضيف 9.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final nums = [3, 1, 2];
nums.sort((a, b) => b.compareTo(a));
print(nums);` },
      options: ["<code>[1, 2, 3]</code>", "<code>[3, 2, 1]</code>", "<code>[3, 1, 2]</code>", "<code>[2, 1, 3]</code>"],
      answer: 1,
      why: "الـ comparator <code>b.compareTo(a)</code> بيعكس المقارنة فالترتيب تنازلي. <code>a.compareTo(b)</code> هو الترتيب التصاعدي.",
    },
  ],
};
