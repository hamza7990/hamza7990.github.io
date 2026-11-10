window.LEVELS = window.LEVELS || {};
window.LEVELS["ds/s5"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "جدول الهاش: البحث بالمفتاح من غير بحث",
      en: "Why hash tables",
      body: "<p>أكتر هيكل بيحول حل بطيء O(n²) لحل سريع O(n) في الإنترفيو هو الـ hash table (<code>Map</code> و<code>Set</code> في Dart). بدل ما تدور في قايمة كل مرة، بتخزن البيانات بحيث تلاقيها في خطوة تقريبا. وفي الشغل بتستخدمه كل يوم: JSON، الـ cache، العدّ، الفهرسة بالـ id.</p><p>في المستوى ده هنفتح الصندوق: إزاي المفتاح بيتحول لمكان، إيه اللي بيحصل لما مفتاحين يروحوا لنفس المكان، ليه التكلفة O(1) في المتوسط وO(n) في أسوأ حالة، إيه شروط المفتاح الجيد، وأنواع الـ Map في Dart، ونبني hash map صغيرة بإيدينا ونحل أشهر المسائل عليها.</p>",
      points: [
        "<b>Map</b>: مفتاح ← قيمة. <b>Set</b>: مفاتيح بس (من غير قيم)، بتجاوب «موجود ولا لأ؟».",
        "الفكرة: <b>دالة hash</b> تحول المفتاح لرقم، والرقم يحدد خانة في array.",
        "الوعد: إضافة وبحث ومسح <code>O(1)</code> في المتوسط. الثمن: ذاكرة زيادة وترتيب مش مضمون (إلا في أنواع معينة).",
      ],
    },
    {
      title: "دالة الـ hash والخانات",
      en: "Hash function and buckets",
      body: "<p>جوه الـ hash table array فيها «خانات» اسمها <b>buckets</b>. لما تخزن مفتاح: (1) دالة الـ hash بتحوله لرقم صحيح كبير. (2) الرقم ده <code>% عدد الخانات</code> بيدي رقم الخانة. (3) بنكتب القيمة هناك. وعند البحث بنعيد نفس الحساب ونروح لنفس الخانة على طول، من غير ما نمر على باقي العناصر.</p>",
      code: {
        lang: "text",
        title: "8 buckets",
        src: `key 'ali'  --hash--> 49213  --% 8--> bucket 5
key 'sara' --hash--> 77034  --% 8--> bucket 2
key 'omar' --hash--> 11250  --% 8--> bucket 2    <- collision

bucket:  0   1   2          3   4   5       6   7
                [sara,omar]         [ali]

lookup 'omar': hash -> bucket 2 -> compare keys there with ==
(we never look at bucket 5 or any other bucket)`,
        note: "الأرقام هنا للتوضيح بس. دالة الـ hash الجيدة بتوزع المفاتيح بالتساوي تقريبا على الخانات، ولازم تدي نفس الرقم لنفس المفتاح كل مرة.",
      },
      points: [
        "بعد الوصول للخانة بنقارن المفتاح الفعلي بـ <code>==</code>، لأن مفاتيح مختلفة ممكن تروح لنفس الخانة.",
        "الحساب (hash + modulo + قراءة array) ثابت الوقت، وده سر الـ O(1).",
      ],
      interview: [
        { q: "إزاي بيشتغل الـ hash table من جوه؟", a: "array من الخانات (buckets). دالة hash بتحول المفتاح لرقم، والرقم modulo عدد الخانات بيحدد الخانة. الإضافة والبحث بيروحوا للخانة على طول وبيقارنوا المفتاح الفعلي بـ <code>==</code> لأن أكتر من مفتاح ممكن يوصلوا لنفس الخانة (collision). لما الجدول يمتلي بنكبّره ونعيد توزيع العناصر، فالمتوسط بيفضل O(1)." },
      ],
    },
    {
      title: "الـ Collisions: Chaining و Open Addressing",
      en: "Collisions: chaining vs open addressing",
      body: "<p>مفتاحين مختلفين ممكن يطلعوا نفس الخانة، وده <b>مش خطأ</b> بل طبيعي (عدد المفاتيح الممكنة أكبر بكتير من الخانات). فيه مدرستين لحله:</p>",
      code: {
        lang: "text",
        src: `1) Chaining: each bucket holds a small list (or linked list)

   bucket 2 -> [sara] -> [omar] -> [noor]
   lookup: go to bucket 2, scan its few entries with ==

2) Open addressing (linear probing): one entry per slot,
   on a collision walk to the next free slot

   slots:  0   1   2      3      4     5
               .  sara   omar   noor   .
   'omar' wanted slot 2 (taken) -> tried 3 -> stored at 3
   lookup 'omar': start at 2, keep walking until found or an empty slot`,
        note: "الـ chaining أبسط وأكتر انتشارا في الشرح. الـ open addressing أحسن للـ cache (كله في array واحدة) لكن المسح فيه معقد (لازم تعلّم الخانة «محذوفة» عشان البحث ميقفش بدري)، وأداءه بيقع بسرعة لما الجدول يمتلي.",
      },
      points: [
        "<b>Chaining</b>: كل خانة قايمة. مبتتعطلش لو الجدول زاد عن 100% لكن الأداء بيبطأ.",
        "<b>Open addressing</b>: تدور على خانة فاضية تانية (linear probing: الجاية، أو quadratic، أو double hashing). لازم الجدول يفضل ممتلئ أقل من حد معين.",
        "في الحالتين لو كل المفاتيح وقعت في خانة واحدة الجدول بيتحول فعليا لقايمة والبحث O(n).",
      ],
    },
    {
      title: "Load factor والتكبير، ومتوسط O(1) مقابل أسوأ O(n)",
      en: "Load factor, resizing, average vs worst case",
      body: "<p><b>Load factor</b> = عدد العناصر ÷ عدد الخانات. كل ما زاد، احتمال الـ collisions زاد والقوايم في الخانات طولت. لما يعدي حد (غالبا 0.75) الجدول بيعمل <b>resize</b>: يحجز array بضعف الخانات ويعيد حساب خانة كل عنصر (rehash). ده O(n) لكنه نادر، فالإضافة <b>amortized O(1)</b> (نفس منطق الـ dynamic array).</p>",
      code: {
        lang: "text",
        src: `Operation         Average   Worst      Why the worst case
get / containsKey O(1)      O(n)       all keys in one bucket
put / add         O(1)*     O(n)       same, or a resize (*amortized)
remove            O(1)      O(n)       same
iterate all       O(n + b)             visit every bucket (b = buckets)

load factor = size / buckets      resize when it passes ~0.75
resize = new array x2 + re-place every entry (O(n), rare)`,
        note: "الـ worst case بيحصل لو دالة hash سيئة (كل المفاتيح تطلع نفس الرقم) أو لو مهاجم اختار مفاتيح بتتصادم عمدا (hash flooding attack). الـ implementations الحديثة بتقاوم ده.",
      },
      focus: [{ label: "احفظها", text: "الـ hash table مبتديش <code>O(1)</code> مضمون، بتديه <b>في المتوسط</b> بشرطين: دالة hash موزعة كويس، والجدول بيكبر قبل ما يمتلي. وأنت بتدفع مساحة O(n) وترتيب مش مفيد." }],
      interview: [
        { q: "ليه الـ hash map بتديك O(1) في المتوسط ومش دايما؟ وإيه الـ load factor؟", a: "لأن البحث بيروح للخانة مباشرة، وجواها عادة عنصر أو اتنين. لكن لو كتير مفاتيح وقعت في نفس الخانة (hash سيء أو هجوم)، البحث بيتحول لمسح خطي O(n). الـ load factor هو عدد العناصر ÷ عدد الخانات، وبيتحكم في احتمال الـ collisions. لما يعدي حد (حوالي 0.75) الجدول بيكبر بالضعف ويعيد توزيع العناصر. ده O(n) نادر فمتوسط الإضافة لسه O(1) amortized." },
      ],
    },
    {
      title: "إيه اللي بيخلي المفتاح جيد",
      en: "Good keys: == and hashCode, immutability",
      body: "<p>الـ Map في Dart بتستخدم <code>hashCode</code> عشان تحدد الخانة وبعدين <code>==</code> عشان تأكد المفتاح. فيه قاعدة ذهبية: <b>لو a == b لازم a.hashCode == b.hashCode</b>. لو غيرت <code>==</code> من غير <code>hashCode</code>، object متساويين هيروحوا لخانات مختلفة والـ Map مش هتلاقيهم. والمفتاح كمان لازم يكون <b>immutable</b>: لو غيرت حقل بيدخل في الـ hash بعد التخزين، الـ entry هتبقى في الخانة القديمة ومحدش هيلاقيها.</p>",
      code: {
        lang: "dart",
        src: `class Point {
  final int x;
  final int y;
  const Point(this.x, this.y);

  @override
  bool operator ==(Object other) =>
      other is Point && other.x == x && other.y == y;

  @override
  int get hashCode => Object.hash(x, y);
}

class Plain {
  final int x;
  Plain(this.x);       // default == is identity, hashCode too
}

class Box {
  int n;               // mutable: dangerous inside a key
  Box(this.n);

  @override
  bool operator ==(Object other) => other is Box && other.n == n;

  @override
  int get hashCode => n.hashCode;
}

void main() {
  final points = {Point(1, 2)};
  print(points.contains(Point(1, 2)));    // true: value equality

  final plain = {Plain(1)};
  print(plain.contains(Plain(1)));        // false: different objects

  final b = Box(1);
  final m = {b: 'one'};
  b.n = 2;                                // key changed after storing
  print(m.containsKey(Box(1)));           // false: == no longer matches
  print(m.length);                        // 1: the entry is stuck in there
}`,
        note: "<code>Object.hash(x, y)</code> بتدمج حقول كتير في hash واحد. الأنواع الجاهزة (<code>int</code> و<code>String</code> و<code>bool</code>) مظبوطة. والـ records والـ enums كمان بتشتغل كمفاتيح صح. الـ <code>List</code> كمفتاح بتتقارن بالـ identity مش بالمحتوى، فمتستخدمهاش مفتاح.",
      },
      pitfall: "تعمل <code>==</code> بس وتنسى <code>hashCode</code> (أو العكس). الـ analyzer بيحذرك (<code>hash_and_equals</code> lint)، خلي بالك منه. وفي Flutter استخدم نفس الأسلوب أو الـ <code>equatable</code>/records لو بتحب.",
      interview: [
        { q: "إيه الشروط على المفتاح في Map؟ وإيه اللي بيحصل لو عدلت == من غير hashCode؟", a: "لازم <code>==</code> و<code>hashCode</code> متسقين: لو a == b يبقى نفس الـ hashCode. ولازم المفتاح immutable (على الأقل الحقول اللي داخلة في الـ hash). لو عدلت == من غير hashCode، object متساويين ليهم hashCode مختلف فبيروحوا لخانات مختلفة والـ Map/Set مش هتعتبرهم نفس المفتاح (contains بترجع false). ولو غيرت حقل في المفتاح بعد التخزين، الـ entry بتفضل في الخانة القديمة وبقت مش بتتلاقي." },
      ],
    },
    {
      title: "Map و Set في Dart",
      en: "Dart Map and Set: LinkedHashMap, HashMap, SplayTreeMap",
      body: "<p>الـ literal <code>{}</code> والـ constructor العادي بيدوك <code>LinkedHashMap</code> (و<code>LinkedHashSet</code> للـ Set): hash table مع <b>حفاظ على ترتيب الإضافة</b> في التكرار. النوع التاني <code>HashMap</code> من <code>dart:collection</code>: hash table عادية، ترتيب التكرار فيها <b>مش مضمون</b>. والتالت <code>SplayTreeMap</code>: شجرة متوازنة ذاتيا (مش hash) بتخلي المفاتيح <b>مرتبة</b> بتكلفة O(log n) للعملية.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

void main() {
  final m = {'b': 2, 'a': 1};          // LinkedHashMap
  m['c'] = 3;
  print(m.keys.toList());              // [b, a, c]
  m.remove('b');
  m['b'] = 9;                          // re-inserted: goes last
  print(m.keys.toList());              // [a, c, b]
  m['a'] = 100;                        // update keeps the position
  print(m.keys.toList());              // [a, c, b]

  final sorted = SplayTreeMap<String, int>.from(m);
  print(sorted.keys.toList());         // [a, b, c]
  print(sorted.firstKey());            // a
  print(sorted.lastKey());             // c
  print(sorted.firstKeyAfter('a'));    // b

  final h = HashMap<String, int>.from(m);
  print(h.length);                     // 3 (order not guaranteed)

  final s = {3, 1, 2};                 // LinkedHashSet
  print(s);                            // {3, 1, 2}
  print(SplayTreeSet<int>.from(s));    // {1, 2, 3}
  print(s.add(2));                     // false: already there
}`,
        note: "الـ <code>Map</code> بترجع <code>null</code> للمفتاح الناقص، فنوع <code>m['x']</code> هو <code>V?</code>. استخدم <code>??</code> أو <code>containsKey</code>.",
      },
      points: [
        "<b>الافتراضي</b> (literal) كفاية في 95% من الحالات: سريع ومرتب بالإضافة.",
        "<b>HashMap</b>: لما مش محتاج ترتيب وعايز أقل overhead. مش بتفرق كتير عمليا.",
        "<b>SplayTreeMap</b>: لما محتاج المفاتيح مرتبة دايما، أو أقرب مفتاح (<code>firstKeyAfter</code>)، أو نطاق. العملية O(log n) مش O(1).",
      ],
      interview: [
        { q: "إيه الفرق بين Map و HashMap و LinkedHashMap و SplayTreeMap في Dart؟", a: "الـ <code>Map</code> الافتراضي (literal أو <code>Map()</code>) هو <code>LinkedHashMap</code>: hash table بتفتكر ترتيب الإضافة، فالتكرار بيطلع بنفس ترتيب الإدخال. <code>HashMap</code> hash table من غير ضمان للترتيب. <code>SplayTreeMap</code> شجرة متوازنة بتخلي المفاتيح مرتبة، لكن العمليات فيها O(log n) مش O(1). أستخدم الافتراضي غالبا، والـ SplayTreeMap لما محتاج مفاتيح مرتبة دايما." },
      ],
    },
    {
      title: "نكتب hash map بالـ chaining",
      en: "Implementing a small hash map with chaining",
      code: {
        lang: "dart",
        src: `class _Entry<K, V> {
  final K key;
  V value;
  _Entry(this.key, this.value);
}

class MyHashMap<K, V> {
  List<List<_Entry<K, V>>> _buckets = _newBuckets(8);
  int _size = 0;

  int get length => _size;
  int get bucketCount => _buckets.length;

  static List<List<_Entry<K, V>>> _newBuckets<K, V>(int n) =>
      List.generate(n, (_) => <_Entry<K, V>>[]);

  int _indexOf(K key) => (key.hashCode & 0x7fffffff) % _buckets.length;

  V? operator [](K key) {
    for (final e in _buckets[_indexOf(key)]) {
      if (e.key == key) return e.value;
    }
    return null;
  }

  void operator []=(K key, V value) {
    final bucket = _buckets[_indexOf(key)];
    for (final e in bucket) {
      if (e.key == key) {
        e.value = value;       // overwrite, size unchanged
        return;
      }
    }
    bucket.add(_Entry(key, value));
    _size++;
    if (_size > _buckets.length * 0.75) _resize();
  }

  V? remove(K key) {
    final bucket = _buckets[_indexOf(key)];
    for (var i = 0; i < bucket.length; i++) {
      if (bucket[i].key == key) {
        final value = bucket[i].value;
        bucket.removeAt(i);
        _size--;
        return value;
      }
    }
    return null;
  }

  void _resize() {
    final old = _buckets;
    _buckets = _newBuckets(old.length * 2);
    for (final bucket in old) {
      for (final e in bucket) {
        _buckets[_indexOf(e.key)].add(e);   // rehash with the new length
      }
    }
  }
}

void main() {
  final m = MyHashMap<String, int>();
  for (var i = 0; i < 10; i++) {
    m['k$i'] = i;
  }
  print(m.length);        // 10
  print(m.bucketCount);   // 16 (resized once at the 7th entry)
  print(m['k3']);         // 3
  m['k3'] = 33;
  print(m['k3']);         // 33
  print(m.remove('k3'));  // 33
  print(m['k3']);         // null
  print(m.length);        // 9
}`,
        note: "<code>&amp; 0x7fffffff</code> بتخلي الـ hash موجب قبل الـ modulo. الـ resize لازم يعيد حساب الخانة (<code>_indexOf</code>) لكل عنصر لأن الـ modulo اتغير. ومن غير الـ resize الـ chains بتطول والأداء بيقع لـ O(n).",
      },
      interview: [
        { q: "اكتب hash map بسيطة بالـ chaining. إيه الأجزاء المهمة؟", a: "array من buckets، كل bucket قايمة entries (key, value). الخانة هي <code>hashCode % buckets.length</code> (مع التأكد إنه موجب). في <code>put</code> بمشي على الـ bucket وأقارن بـ ==: لو لقيت المفتاح أحدّث القيمة، غير كده أضيف entry وأزود الـ size. في <code>get</code> و<code>remove</code> نفس المشي. بعد كل إضافة لو <code>size &gt; 0.75 × buckets</code> أعمل resize: array بضعف الحجم وأعيد توزيع كل entry بحساب الخانة من جديد. ده بيخلي المتوسط O(1)." },
      ],
    },
    {
      title: "Two Sum و أول حرف غير مكرر",
      en: "Two sum and first non-repeating character",
      body: "<p>النمط الأول: <b>«شفت الشريك قبل كده؟»</b>. لكل عنصر <code>x</code> بنسأل الـ Map: هل <code>target - x</code> اتشاف؟ لو أيوه خلصنا، لو لأ نخزن <code>x</code> بمكانه. بنفحص <b>قبل</b> التخزين فالعنصر مش بيتجوز نفسه.</p><p>النمط التاني: <b>عدّ ثم مرور تاني</b>. أول حرف مش مكرر: نعد كل حرف، وبعدين نمشي على النص الأصلي بالترتيب ونرجع أول حرف عدّه 1.</p>",
      code: {
        lang: "dart",
        src: `List<int> twoSum(List<int> nums, int target) {
  final seen = <int, int>{};   // value -> index
  for (var i = 0; i < nums.length; i++) {
    final j = seen[target - nums[i]];
    if (j != null) return [j, i];
    seen[nums[i]] = i;
  }
  return [];
}

int firstUniqChar(String s) {
  final counts = <String, int>{};
  for (final ch in s.split('')) {
    counts[ch] = (counts[ch] ?? 0) + 1;
  }
  for (var i = 0; i < s.length; i++) {
    if (counts[s[i]] == 1) return i;
  }
  return -1;
}

void main() {
  print(twoSum([2, 7, 11, 15], 9));   // [0, 1]
  print(twoSum([3, 3], 6));           // [0, 1]
  print(twoSum([3, 2, 4], 6));        // [1, 2]
  print(twoSum([1, 2], 10));          // []
  print(firstUniqChar('leetcode'));   // 0
  print(firstUniqChar('aabb'));       // -1
  print(firstUniqChar('abcab'));      // 2
}`,
        note: "الاتنين O(n) زمن و O(n) مساحة (الغاشم كان O(n²)). في <code>twoSum([3, 3], 6)</code> الفحص قبل التخزين هو اللي بيخلي الزوج [0, 1] يطلع. <code>split('')</code> بتشتغل على وحدات UTF-16 وده كفاية للمسألة بحروف ASCII.",
      },
      interview: [
        { q: "حل Two Sum في O(n). وليه الفحص قبل التخزين؟", a: "بمشي على المصفوفة ومعايا Map من القيمة لـ index. لكل عنصر x بسأل: هل <code>target - x</code> موجود في الـ Map؟ لو أيوه برجع [index بتاعه، i]، لو لأ بخزن x → i. الفحص قبل التخزين عشان العنصر ميتحسبش شريك لنفسه (مثلا target 6 و x = 3 ومفيش 3 تانية). O(n) زمن و O(n) مساحة بدل O(n²) للحل الغاشم." },
      ],
    },
    {
      title: "Group Anagrams و أطول تتابع",
      en: "Group anagrams and longest consecutive sequence",
      body: "<p><b>Group Anagrams</b>: نصمم مفتاح بحيث الكلمات المتشابهة (نفس الحروف) تطلع نفس المفتاح. هنا المفتاح هو <b>عدّاد الحروف</b> (26 رقم) متحول لنص، بدل ترتيب الحروف: ده O(k) لكل كلمة بدل O(k log k).</p><p><b>Longest Consecutive Sequence</b>: أطول تتابع أرقام متتالية (مش لازم متجاورة في المصفوفة) في O(n) من غير ترتيب. نحط الأرقام في Set، ونبدأ العد <b>بس من أرقام بداية تتابع</b> (اللي مفيش <code>n - 1</code> قبلها). كده كل رقم بيتزار مرة واحدة تقريبا.</p>",
      code: {
        lang: "dart",
        src: `List<List<String>> groupAnagrams(List<String> words) {
  final groups = <String, List<String>>{};
  for (final w in words) {
    final counts = List.filled(26, 0);
    for (final unit in w.codeUnits) {
      counts[unit - 97]++;               // 'a' is 97
    }
    groups.putIfAbsent(counts.join(','), () => []).add(w);
  }
  return groups.values.toList();
}

int longestConsecutive(List<int> nums) {
  final set = nums.toSet();
  var best = 0;
  for (final n in set) {
    if (set.contains(n - 1)) continue;   // not the start of a run
    var length = 1;
    while (set.contains(n + length)) {
      length++;
    }
    if (length > best) best = length;
  }
  return best;
}

void main() {
  print(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']));
  // [[eat, tea, ate], [tan, nat], [bat]]
  print(groupAnagrams([]));                           // []
  print(longestConsecutive([100, 4, 200, 1, 3, 2]));  // 4
  print(longestConsecutive([1, 2, 0, 1]));            // 3
  print(longestConsecutive([]));                      // 0
}`,
        note: "المفتاح بيفترض حروف صغيرة a-z بس. لو الحروف أي حاجة استخدم ترتيب الحروف كمفتاح. في longestConsecutive الـ <code>while</code> مبتشتغلش غير من بداية كل تتابع، فمجموع الخطوات O(n) رغم اللوب الجوه لوب. الـ Set بتشيل التكرار (القيمة 1 مرتين).",
      },
      interview: [
        { q: "إزاي تحل Longest Consecutive Sequence في O(n)؟", a: "بحط الأرقام في Set. بلف على الـ Set، ولكل رقم n لو <code>n - 1</code> موجود في الـ Set يبقى n مش بداية تتابع فبتخطاه. لو مش موجود، n بداية تتابع، فبعد <code>n+1, n+2...</code> طالما موجودة وبحدث أطول طول. كل رقم بيتعد في تتابع واحد بس (من بدايته)، فالمجموع O(n). من غير شرط البداية كان هيبقى O(n²) على تتابع طويل." },
      ],
    },
    {
      title: "Subarray Sum Equals K: prefix sums + hash map",
      en: "Subarray sum equals k",
      body: "<p>اعرف كام subarray متصل مجموعه بالظبط <code>k</code> (والأرقام ممكن تكون سالبة، فمؤشرين متحركين مش هينفعوا). فكرة الـ prefix sums: لو مجموع أول i عنصر <code>P[i]</code>، فمجموع الـ subarray من j لـ i هو <code>P[i] - P[j]</code>. عايزينه = k، يعني <code>P[j] = P[i] - k</code>. فبنمشي ونحتفظ في Map <b>كام مرة شفنا كل prefix sum</b>، ولكل prefix جديد نضيف عدد مرات ظهور <code>prefix - k</code>.</p>",
      code: {
        lang: "dart",
        src: `int subarraySum(List<int> nums, int k) {
  final seen = <int, int>{0: 1};   // prefix sum -> how many times
  var sum = 0;
  var count = 0;
  for (final n in nums) {
    sum += n;
    count += seen[sum - k] ?? 0;
    seen[sum] = (seen[sum] ?? 0) + 1;
  }
  return count;
}

void main() {
  print(subarraySum([1, 1, 1], 2));     // 2
  print(subarraySum([1, 2, 3], 3));     // 2  ([1,2] and [3])
  print(subarraySum([1, -1, 0], 0));    // 3
  print(subarraySum([], 0));            // 0
  print(subarraySum([5], 5));           // 1
}`,
        note: "البداية <code>{0: 1}</code> معناها «prefix فاضي مجموعه 0 اتشاف مرة»، وبتغطي الـ subarrays اللي بتبدأ من أول المصفوفة. ترتيب الفحص (قبل ما نضيف <code>sum</code> الحالي) بيمنع عد subarray فاضية لما k = 0. الزمن O(n) والمساحة O(n).",
      },
      pitfall: "نسيان <code>{0: 1}</code> في البداية بيضيع كل subarray بتبدأ من index 0. والغلط التاني: تخزن الحالي قبل ما تفحص <code>sum - k</code>.",
      interview: [
        { q: "عدّ الـ subarrays اللي مجموعها k. ليه مؤشرين متحركين ميشتغلوش؟ وإزاي الحل بالـ hash map؟", a: "المؤشرين المتحركين (sliding window) بيشتغلوا لما الأرقام موجبة بس، لأن زيادة النافذة بتزود المجموع دايما. مع الأرقام السالبة المجموع بيتذبذب. الحل: prefix sums مع Map. مجموع subarray من j لـ i = P[i] - P[j]، فلكل prefix حالي أحتاج عدد الـ prefixes السابقة اللي قيمتها <code>P[i] - k</code>. باحتفظ بعدّاد لكل prefix ظهر (والبداية {0: 1})، وأجمع. O(n) زمن و O(n) مساحة." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: كلاس يصلح كمفتاح",
      lang: "dart",
      code: `class Point {
  final int x;
  final int y;
  const Point(this.x, this.y);

  @override
  bool operator ==(Object other) =>
      other is Point && other.x == x && other.y == y;

  @override
  int get hashCode => Object.hash(x, y);
}`,
      note: "نفس الحقول في == وفي hashCode.",
    },
    {
      title: "اكتب: Two Sum بالـ Map",
      lang: "dart",
      code: `List<int> twoSum(List<int> nums, int target) {
  final seen = <int, int>{};
  for (var i = 0; i < nums.length; i++) {
    final j = seen[target - nums[i]];
    if (j != null) return [j, i];
    seen[nums[i]] = i;
  }
  return [];
}`,
    },
    {
      title: "اكتب: subarray sum equals k",
      lang: "dart",
      code: `int subarraySum(List<int> nums, int k) {
  final seen = <int, int>{0: 1};
  var sum = 0;
  var count = 0;
  for (final n in nums) {
    sum += n;
    count += seen[sum - k] ?? 0;
    seen[sum] = (seen[sum] ?? 0) + 1;
  }
  return count;
}`,
    },
  ],

  tasks: [
    {
      title: "أول حرف غير مكرر",
      lang: "dart",
      prompt: "<p>اكتب <code>int firstUniqChar(String s)</code> بترجع index أول حرف ظهر مرة واحدة بس في النص، أو <code>-1</code> لو مفيش. حل في O(n).</p>",
      examples: [
        { in: "firstUniqChar('leetcode')", out: "0" },
        { in: "firstUniqChar('loveleetcode')", out: "2" },
        { in: "firstUniqChar('aabb')", out: "-1" },
      ],
      starter: `int firstUniqChar(String s) {
  // your code
}`,
      hints: [
        "مرور أول يعد كل حرف في <code>Map&lt;String, int&gt;</code>.",
        "مرور تاني على النص الأصلي بالترتيب، وارجع أول index عدّه 1.",
      ],
      solution: `int firstUniqChar(String s) {
  final counts = <String, int>{};
  for (final ch in s.split('')) {
    counts[ch] = (counts[ch] ?? 0) + 1;
  }
  for (var i = 0; i < s.length; i++) {
    if (counts[s[i]] == 1) return i;
  }
  return -1;
}`,
      explain: "مرورين على النص، O(n) زمن و O(k) مساحة (k عدد الحروف المختلفة). المرور التاني على <b>النص</b> مش على الـ Map عشان ترتيب الظهور هو المهم. النص الفاضي بيرجع -1.",
    },
    {
      title: "أطول تتابع متتالي",
      lang: "dart",
      prompt: "<p>اكتب <code>int longestConsecutive(List&lt;int&gt; nums)</code> بترجع طول أطول تتابع من أرقام متتالية (مثلا 1, 2, 3, 4) موجودة في المصفوفة بأي ترتيب. ممنوع الترتيب (sort): المطلوب O(n).</p>",
      examples: [
        { in: "[100, 4, 200, 1, 3, 2]", out: "4" },
        { in: "[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]", out: "9" },
        { in: "[]", out: "0" },
      ],
      starter: `int longestConsecutive(List<int> nums) {
  // your code
}`,
      hints: [
        "حط الأرقام في Set عشان البحث O(1) وتشيل التكرار.",
        "ابدأ العد بس من رقم n اللي <code>n - 1</code> مش موجود في الـ Set.",
      ],
      solution: `int longestConsecutive(List<int> nums) {
  final set = nums.toSet();
  var best = 0;
  for (final n in set) {
    if (set.contains(n - 1)) continue;
    var length = 1;
    while (set.contains(n + length)) {
      length++;
    }
    if (length > best) best = length;
  }
  return best;
}`,
      explain: "كل تتابع بيتعد من بدايته بس، فمجموع خطوات الـ while على كل الـ for هو O(n). من غير شرط <code>n - 1</code> كان هيعد التتابع من كل رقم فيه فيبقى O(n²). المصفوفة الفاضية بترجع 0 لأن اللوب مبتشتغلش.",
    },
    {
      title: "عدد الـ subarrays بمجموع k",
      lang: "dart",
      prompt: "<p>اكتب <code>int subarraySum(List&lt;int&gt; nums, int k)</code> بترجع عدد الـ subarrays المتصلة اللي مجموعها بالظبط <code>k</code>. الأرقام ممكن تكون سالبة أو صفر. المطلوب O(n).</p>",
      examples: [
        { in: "[1, 1, 1], k = 2", out: "2" },
        { in: "[1, 2, 3], k = 3", out: "2" },
        { in: "[1, -1, 0], k = 0", out: "3" },
      ],
      starter: `int subarraySum(List<int> nums, int k) {
  // your code
}`,
      hints: [
        "مجموع subarray = فرق بين prefix sumين. عايز <code>prefix - k</code> يكون اتشاف قبل كده.",
        "Map من prefix sum لعدد مرات ظهوره، وابدأها بـ <code>{0: 1}</code>. افحص قبل ما تخزن الـ prefix الحالي.",
      ],
      solution: `int subarraySum(List<int> nums, int k) {
  final seen = <int, int>{0: 1};
  var sum = 0;
  var count = 0;
  for (final n in nums) {
    sum += n;
    count += seen[sum - k] ?? 0;
    seen[sum] = (seen[sum] ?? 0) + 1;
  }
  return count;
}`,
      explain: "O(n) زمن و O(n) مساحة. العدّاد في الـ Map (مش Set) لأن نفس الـ prefix ممكن يظهر أكتر من مرة (بسبب السالب والأصفار)، وكل ظهور سابق بيعمل subarray مختلفة. في [1, -1, 0] مع k = 0 الـ subarrays هي [1,-1] و[0] و[1,-1,0].",
    },
  ],

  quiz: [
    {
      q: "ليه البحث في الـ hash map بيوصف بأنه O(1) في <b>المتوسط</b>؟",
      options: [
        "لأن Dart بتعمل cache للنتايج",
        "لأن المفاتيح بتتخزن مرتبة وبنعمل binary search",
        "لأن دالة الـ hash بتوديك للخانة مباشرة، وجواها عادة عنصر أو اتنين",
        "لأن كل مفتاح له خانة لوحده دايما",
      ],
      answer: 2,
      why: "الوصول للخانة بحساب ثابت. لكن مفتاحين ممكن يشاركوا خانة (collision)، ولو كتير شاركوا نفس الخانة البحث يتحول لمسح خطي O(n). الترتيب والـ binary search هو SplayTreeMap/tree مش hash.",
    },
    {
      q: "إيه معنى collision في hash table؟",
      options: [
        "مفتاحين مختلفين طلعوا نفس رقم الخانة",
        "المفتاح نفسه اتخزن مرتين",
        "الجدول امتلى ومفيش مكان",
        "دالة الـ hash رمت exception",
      ],
      answer: 0,
      why: "الـ collision طبيعي لأن المفاتيح الممكنة أكتر بكتير من الخانات. بيتحل بـ chaining أو open addressing، مش خطأ.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final m = {'b': 2, 'a': 1};
m['c'] = 3;
m.remove('b');
m['b'] = 9;
print(m.keys.toList());` },
      answer: ["[a, c, b]", "[a,c,b]"],
      why: "الـ Map الافتراضية (LinkedHashMap) بتحافظ على ترتيب الإضافة. b اتمسحت وأعيدت إضافتها فبقت آخر واحدة.",
    },
    {
      q: "جدول فيه 8 خانات وـ load factor الأقصى 0.75 (التكبير لما العدد يعدي 6 = 8 × 0.75). عند إضافة أنهي عنصر الجدول هيكبر؟ (اكتب رقم العنصر)",
      answer: ["7", "7th", "السابع"],
      why: "العدد بعد الإضافة السابعة هو 7 وده أكبر من 6 (8 × 0.75)، فالـ resize بيحصل عند السابع ويبقى الجدول 16 خانة.",
    },
    {
      q: "عملت override لـ <code>==</code> في class من غير <code>hashCode</code> واستخدمته مفتاح. المشكلة؟",
      options: [
        "الكود مش بيتكومبايل",
        "object المتساويين ممكن يطلعوا بـ hashCode مختلف فيروحوا لخانات مختلفة والـ Map مش هتلاقيهم",
        "الـ Map بتصير read-only",
        "مفيش مشكلة، == كفاية",
      ],
      answer: 1,
      why: "الـ Map بتستخدم hashCode الأول لتحديد الخانة. لازم a == b تضمن نفس الـ hashCode. من غيره contains بترجع false لـ object متساويين. الكود بيتكومبايل لكن الـ analyzer بيحذر.",
    },
    {
      q: "هل الـ <code>contains</code> هترجع true؟",
      code: { lang: "dart", src: `class P {
  final int x;
  P(this.x);
}

void main() {
  final s = {P(1)};
  print(s.contains(P(1)));
}` },
      options: ["true لأن الحقول متساوية", "true لأن الـ Set بتقارن بالقيم", "بيرمي exception", "false لأن == الافتراضية بتقارن الـ identity"],
      answer: 3,
      why: "من غير override للـ == و hashCode، كل object بيتساوى مع نفسه بس. P(1) الجديد object تاني فالنتيجة false.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print(twoSum([2, 7, 11, 15], 9));` },
      answer: ["[0, 1]", "[0,1]"],
      why: "عند 7 (index 1) الـ Map فيها 2 (index 0) و9 - 7 = 2 فبترجع [0, 1].",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print(longestConsecutive([100, 4, 200, 1, 3, 2]));` },
      answer: ["4"],
      why: "التتابع 1, 2, 3, 4 طوله 4. المصفوفة مش لازم تكون مرتبة، والـ Set بتخلي البحث عن n+1 في O(1).",
    },
    {
      q: "في <code>subarraySum</code> ليه بنبدأ الـ Map بـ <code>{0: 1}</code>؟",
      options: [
        "عشان منتعاملش مع null",
        "عشان الأرقام السالبة",
        "عشان تحسب الـ subarrays اللي بتبدأ من أول المصفوفة (prefix فاضي مجموعه صفر)",
        "عشان الـ Map متبقاش فاضية",
      ],
      answer: 2,
      why: "لو الـ prefix الحالي = k فالمطلوب <code>prefix - k = 0</code> يكون موجود. الـ prefix الفاضي (قبل أول عنصر) مجموعه 0 وبنحسبه مرة. من غيره subarray [1,1] مع k=2 مش هتتعد.",
    },
    {
      q: "عايز Map وتمشي على مفاتيحها بترتيب أبجدي دايما وعايز تلاقي أقرب مفتاح بعد مفتاح معين. أنسب نوع؟",
      options: ["<code>LinkedHashMap</code> الافتراضي", "<code>SplayTreeMap</code>", "<code>HashMap</code>", "<code>List&lt;String&gt;</code> وبحث خطي"],
      answer: 1,
      why: "<code>SplayTreeMap</code> مرتبة دايما وفيها <code>firstKeyAfter</code>، بتكلفة O(log n). الافتراضي بيحافظ على ترتيب الإضافة مش المفاتيح، و HashMap ترتيبها غير مضمون.",
    },
  ],
};
