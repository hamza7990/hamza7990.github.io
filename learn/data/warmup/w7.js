window.LEVELS = window.LEVELS || {};
window.LEVELS["warmup/w7"] = {
  slides: [
    {
      kicker: "ليه القوائم",
      title: "القايمة هي أكتر هيكل بيتسأل عنه في الإنترفيو",
      en: "List problems",
      body: "<p>أي داتا حقيقية في Flutter أو Laravel بتيجي قايمة: منتجات، رسايل، نتايج بحث. ومسائل القوائم هي الجزء الأكبر من أي مقابلة تقنية أولى، لأنها بتختبر loops والفهرسة والحالات الحدية في مسألة صغيرة.</p><p>القايمة في Dart اسمها <code>List</code>، وعناصرها ليها index بيبدأ من 0، وآخر index هو <code>length - 1</code>.</p>",
      code: {
        lang: "dart",
        src: `final nums = [5, 3, 8];
print(nums.length);            // 3
print(nums.first);             // 5
print(nums.last);              // 8
nums.add(1);                   // [5, 3, 8, 1]
nums.insert(0, 9);             // [9, 5, 3, 8, 1]
nums.removeAt(1);              // [9, 3, 8, 1]
print(nums.sublist(1, 3));     // [3, 8]  (end is excluded)
print(nums.contains(8));       // true
print(nums.indexOf(8));        // 2
nums.sort();                   // changes the list itself
print(nums.reversed.toList()); // [9, 8, 3, 1]  a new list
print(nums);                   // [1, 3, 8, 9]`,
        note: "<code>sort()</code> بيغير القايمة نفسها. <code>reversed</code> مبيغيرش حاجة، بيدي Iterable جديد. الفرق ده هو موضوع الشريحة الرابعة.",
      },
      focus: [{ label: "احفظها", text: "كل مسألة قوائم فيها سؤالين: أنا بعدّي على كل العناصر ولا لأ؟ وبعدّل القايمة نفسها ولا برجع قايمة جديدة؟" }],
    },
    {
      kicker: "نمط المجمّع",
      title: "أكبر وأصغر وتاني أكبر",
      en: "Max, min and second largest",
      body: "<p>أكبر رقم هو نفس نمط w5: ابدأ من أول عنصر ولف على الباقي. تاني أكبر محتاج متغيرين: <code>first</code> و<code>second</code>. كل رقم جديد يا إما يكسر الأول (فالأول القديم يبقى تاني)، يا إما يكسر التاني بس. السؤال المخفي هو التكرار: في <code>[9, 9, 7]</code> تاني أكبر قيمة مختلفة هو 7 مش 9.</p>",
      code: {
        lang: "dart",
        src: `int? secondLargest(List<int> nums) {
  int? first;
  int? second;
  for (final n in nums) {
    if (first == null || n > first) {
      second = first;
      first = n;
    } else if (n != first && (second == null || n > second)) {
      second = n;
    }
  }
  return second;
}

void main() {
  print(secondLargest([4, 9, 2, 9, 7])); // 7
  print(secondLargest([5, 5]));          // null
  print(secondLargest([]));              // null
}`,
        note: "بنرجع <code>int?</code> لأن ساعات مفيش تاني أكبر. تتبع <code>[4, 9, 2, 9, 7]</code>: (4,-) ثم (9,4) ثم (9,4) ثم 9 مكرر يتجاهل ثم (9,7).",
      },
      pitfall: "الحل «رتّب القايمة وخد قبل الأخير» بيفشل مع التكرار (<code>[9, 9, 7]</code>) وبياخد O(n log n) بدل O(n). اسأل المُقابِل: التكرار يتحسب ولا لأ؟",
      interview: [
        { q: "إزاي تجيب تاني أكبر رقم في قايمة من غير ما ترتبها؟", a: "بلف مرة واحدة وبحتفظ بمتغيرين: <code>first</code> و<code>second</code>. لو الرقم أكبر من first، first القديم بيبقى second والرقم الجديد بيبقى first. لو مش أكبر من first لكن أكبر من second ومش بيساوي first، بيبقى second. التعقيد O(n) ومساحة O(1). بسأل الأول التكرار يتحسب ولا لأ، وبتعامل مع القايمة اللي أقل من رقمين مختلفين برجوع null.",
        },
      ],
    },
    {
      title: "عكس القايمة في مكانها",
      en: "Reverse in place with two pointers",
      body: "<p>بدل ما نعمل قايمة جديدة معكوسة، نبدل العناصر جوا القايمة نفسها. مؤشر <code>i</code> من الأول و<code>j</code> من الآخر، نبدل ونقرّبهم لحد ما يتقابلوا. محتاجين متغير مؤقت <code>tmp</code> عشان التبديل مايضيعش قيمة.</p>",
      code: {
        lang: "dart",
        src: `void reverseInPlace(List<int> a) {
  var i = 0;
  var j = a.length - 1;
  while (i < j) {
    final tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
    i++;
    j--;
  }
}

void main() {
  final xs = [1, 2, 3, 4, 5];
  reverseInPlace(xs);
  print(xs);        // [5, 4, 3, 2, 1]
  final empty = <int>[];
  reverseInPlace(empty);
  print(empty);     // []
}`,
        note: "الشرط <code>i &lt; j</code> مش <code>i &lt;= j</code>: لو العنصر في النص، تبديله مع نفسه ملوش لازمة. والقايمة الفاضية: <code>j = -1</code> فاللوب مبيشتغلش وده صح.",
      },
      interview: [
        { q: "اكتب دالة تعكس قايمة في مكانها من غير قايمة إضافية.", a: "بحط مؤشر <code>i</code> في أول القايمة و<code>j</code> في آخرها، وطول ما <code>i &lt; j</code> بدّل <code>a[i]</code> مع <code>a[j]</code> بمتغير مؤقت وبحرك i لقدام وj لورا. كده كل عنصر اتحرك مرة واحدة، التعقيد O(n) والمساحة الإضافية O(1). القايمة الفاضية والعنصر الواحد بيشتغلوا لوحدهم لأن اللوب مش بيدخل.",
        },
      ],
    },
    {
      title: "في مكانها ولا قايمة جديدة؟",
      en: "In place vs a new list",
      body: "<p>Dart بتمرر القايمة للدالة كـ <b>مرجع</b> (reference): الدالة بتشوف نفس القايمة، مش نسخة. يعني دالة بتعدّل <code>a</code> بتغيّر القايمة عند اللي نادى عليها. ده مفيد (مفيش نسخة) وخطر (تأثير جانبي مخفي). لازم تقرر وتقول للمُقابِل.</p>",
      codes: [
        {
          lang: "dart",
          title: "مرجع مش نسخة",
          src: `final a = [1, 2, 3];
final b = a;          // same list, two names
b.add(4);
print(a);             // [1, 2, 3, 4]

final c = [...a];     // a real copy
c.add(5);
print(a);             // [1, 2, 3, 4]
print(c);             // [1, 2, 3, 4, 5]`,
        },
        {
          lang: "dart",
          title: "اللي بيغير واللي بيرجع جديد",
          src: `final xs = [3, 1, 2];
xs.sort();                       // in place, returns nothing
print(xs);                       // [1, 2, 3]
xs.reversed;                     // does nothing visible
print(xs);                       // [1, 2, 3]
final r = xs.reversed.toList();  // new list
print(r);                        // [3, 2, 1]
print(xs.map((n) => n * 2).toList()); // [2, 4, 6]  new list`,
        },
      ],
      pitfall: "كتير بيكتب <code>final sorted = nums.sort();</code> وبيستغرب إن <code>sorted</code> فاضي. <code>sort()</code> بترجع <code>void</code>. لو عايز الأصل يفضل زي ما هو: <code>final sorted = [...nums]..sort();</code>.",
      interview: [
        { q: "إيه الفرق بين حل in-place وحل بيرجع قايمة جديدة؟ ومتى تختار كل واحد؟", a: "الـ in-place بيعدل القايمة اللي جت كمدخل ومساحته الإضافية O(1)، لكنه بيغير الداتا الأصلية فممكن يعمل تأثير جانبي عند اللي ناداه. اللي بيرجع قايمة جديدة أأمن وأسهل في الاختبار لكنه بيستهلك O(n) مساحة. في الإنترفيو بسأل: مسموح أغير المدخل ولا لأ؟ وفي كود التطبيق بميل للجديدة إلا لو الحجم كبير فعلا.",
        },
      ],
    },
    {
      title: "تدوير القايمة",
      en: "Rotate a list",
      body: "<p>تدوير لليمين بـ k: آخر k عناصر يروحوا الأول. أول حاجة نعملها <code>k %= length</code> لأن التدوير بطول القايمة يرجّعها زي ما هي (والقايمة الفاضية حالة منفصلة عشان القسمة على صفر). الحل السهل بيبني قايمة جديدة، والحل الذكي in-place بيعكس 3 مرات.</p>",
      code: {
        lang: "dart",
        src: `List<int> rotateRight(List<int> a, int k) {
  if (a.isEmpty) return [];
  final s = k % a.length;
  return [...a.sublist(a.length - s), ...a.sublist(0, a.length - s)];
}

void reverseRange(List<int> a, int i, int j) {
  while (i < j) {
    final tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
    i++;
    j--;
  }
}

void rotateInPlace(List<int> a, int k) {
  if (a.isEmpty) return;
  final s = k % a.length;
  reverseRange(a, 0, a.length - 1);  // [5, 4, 3, 2, 1]
  reverseRange(a, 0, s - 1);         // [4, 5, 3, 2, 1]
  reverseRange(a, s, a.length - 1);  // [4, 5, 1, 2, 3]
}

void main() {
  print(rotateRight([1, 2, 3, 4, 5], 2)); // [4, 5, 1, 2, 3]
  print(rotateRight([1, 2, 3, 4, 5], 7)); // [4, 5, 1, 2, 3]
  final xs = [1, 2, 3, 4, 5];
  rotateInPlace(xs, 2);
  print(xs);                              // [4, 5, 1, 2, 3]
}`,
        note: "الأول عكس القايمة كلها، بعدها عكس أول s عنصر، بعدها عكس الباقي. كل عنصر اتحرك مرتين، التعقيد O(n) والمساحة O(1).",
      },
      interview: [
        { q: "إزاي تدوّر قايمة k خانة لليمين، وإيه أول حاجة بتعملها؟", a: "بحسب <code>k %= length</code> الأول لأن التدوير بطول القايمة بيرجعها زي ما هي، وبتأكد إن القايمة مش فاضية. الحل السهل: <code>[...a.sublist(n - k), ...a.sublist(0, n - k)]</code> بمساحة O(n). الحل in-place: أعكس القايمة كلها، وبعدين أعكس أول k عنصر، وبعدين أعكس الباقي. التعقيد O(n) والمساحة O(1).",
        },
      ],
    },
    {
      title: "حذف المكرر مع الحفاظ على الترتيب",
      en: "Remove duplicates, keep order",
      body: "<p>الخطة: <code>Set</code> اسمه <code>seen</code> بيفتكر اللي شفناه. ندخل على كل عنصر: لو مش في seen نضيفه للنتيجة. دالة <code>Set.add</code> بترجع <code>true</code> لو العنصر كان جديد و<code>false</code> لو موجود، فبتعمل الفحص والإضافة في خطوة واحدة.</p>",
      code: {
        lang: "dart",
        src: `List<int> unique(List<int> a) {
  final seen = <int>{};
  final out = <int>[];
  for (final n in a) {
    if (seen.add(n)) out.add(n);
  }
  return out;
}

// Sorted list, in place: w is where the next unique value goes
int dedupeSorted(List<int> a) {
  if (a.isEmpty) return 0;
  var w = 1;
  for (var r = 1; r < a.length; r++) {
    if (a[r] != a[w - 1]) {
      a[w] = a[r];
      w++;
    }
  }
  return w;
}

void main() {
  print(unique([3, 1, 3, 2, 1]));        // [3, 1, 2]
  print([3, 1, 3, 2, 1].toSet().toList()); // [3, 1, 2]
  final s = [1, 1, 2, 2, 2, 3];
  final len = dedupeSorted(s);
  print(s.sublist(0, len));              // [1, 2, 3]
}`,
        note: "<code>toSet().toList()</code> بيحافظ على ترتيب أول ظهور في Dart (الـ Set الافتراضي ملتزم بترتيب الإدخال)، لكن اكتب الحل اليدوي في الإنترفيو لأنهم عايزين يشوفوا تفكيرك.",
      },
      interview: [
        { q: "إزاي تحذف العناصر المكررة من قايمة وتحافظ على الترتيب؟ وإيه لو القايمة مرتبة؟", a: "بعمل Set اسمه seen وقايمة نتيجة، وبلف على العناصر: لو <code>seen.add(x)</code> رجعت true أضيف x للنتيجة. التعقيد O(n) ومساحة O(n). لو القايمة مرتبة فالمكررات جنب بعض، فبستخدم مؤشرين (قراءة وكتابة) وبكتب العنصر لما يختلف عن آخر عنصر اتكتب، وده in-place بمساحة O(1).",
        },
      ],
    },
    {
      title: "فكرة المؤشرين ودمج قايمتين مرتبتين",
      en: "Two pointers and merging",
      body: "<p>المؤشرين (two pointers) هي إنك تمشي بمؤشرين على القايمة بدل لوب جوه لوب. نوعين: <b>من الطرفين لنص</b> (زي reverse و palindrome) و<b>الاتنين من الأول</b> (زي merge وحذف المكرر). في دمج قايمتين مرتبتين: مؤشر على كل قايمة، نختار الأصغر من الاتنين، وبعد ما واحدة تخلص نضيف باقي التانية.</p>",
      code: {
        lang: "dart",
        src: `List<int> mergeSorted(List<int> a, List<int> b) {
  final out = <int>[];
  var i = 0;
  var j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      out.add(a[i]);
      i++;
    } else {
      out.add(b[j]);
      j++;
    }
  }
  out.addAll(a.sublist(i));  // whatever is left in a
  out.addAll(b.sublist(j));  // or in b
  return out;
}

void main() {
  print(mergeSorted([1, 4, 9], [2, 3, 10, 11])); // [1, 2, 3, 4, 9, 10, 11]
  print(mergeSorted([], [5]));                    // [5]
}`,
        note: "التعقيد O(n + m): كل عنصر بيتقرا مرة واحدة. لو دمجت وعملت <code>sort()</code> هتدفع O((n+m) log(n+m)) وده بيضيّع الاستفادة من إن القوايم مرتبة.",
      },
      interview: [
        { q: "ادمج قايمتين مرتبتين في قايمة واحدة مرتبة. إيه التعقيد؟", a: "بحط مؤشر على بداية كل قايمة، وطول ما الاتنين لسه فيهم عناصر أقارن الاتنين وأضيف الأصغر وأحرك مؤشره. لما واحدة تخلص بضيف باقي التانية كله. كل عنصر بيتزار مرة واحدة فالتعقيد O(n + m) ومساحة النتيجة O(n + m). ودي نفس خطوة الدمج في merge sort.",
        },
      ],
    },
    {
      title: "Two Sum: من القوة الغاشمة للـ Map",
      en: "Two sum",
      body: "<p>المسألة: ارجع index العنصرين اللي مجموعهم <code>target</code>. الحل الغاشم يجرب كل زوج (لوب جوه لوب). الحل الأذكى يسأل لكل عنصر: «هل شفت قبل كده الرقم اللي ناقصه <code>target - n</code>؟» ويخزن اللي شافه في <code>Map</code> من القيمة للـ index. الـ Map هنتعمق فيها في w8، هنا بنستخدمها كمفكرة.</p>",
      codes: [
        {
          lang: "dart",
          title: "غاشم: O(n²)",
          src: `List<int> twoSumBrute(List<int> nums, int target) {
  for (var i = 0; i < nums.length; i++) {
    for (var j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] == target) return [i, j];
    }
  }
  return [];
}`,
        },
        {
          lang: "dart",
          title: "بـ Map: O(n)",
          src: `List<int> twoSumMap(List<int> nums, int target) {
  final seen = <int, int>{};   // value -> index
  for (var i = 0; i < nums.length; i++) {
    final need = target - nums[i];
    final j = seen[need];
    if (j != null) return [j, i];
    seen[nums[i]] = i;
  }
  return [];
}

void main() {
  print(twoSumMap([2, 7, 11, 15], 9)); // [0, 1]
  print(twoSumMap([3, 3], 6));         // [0, 1]
  print(twoSumMap([1, 2], 10));        // []
}`,
        },
      ],
      pitfall: "لاحظ إن الفحص <code>seen[need]</code> بيحصل <b>قبل</b> تخزين العنصر الحالي. لو خزنته الأول، <code>[3]</code> مع target 6 هيلاقي نفسه ويرجع نفس العنصر مرتين.",
      interview: [
        { q: "حل مسألة Two Sum وقل لي إزاي حسّنتها.", a: "الحل الأول لوب جوه لوب يجرب كل الأزواج: O(n²) زمن و O(1) مساحة. التحسين: ألف مرة واحدة وأخزن في Map كل قيمة شفتها مع الـ index. لكل عنصر أحسب <code>need = target - n</code> وأشوف هي في الـ Map؟ لو أيوه ارجع الـ index بتاعها وindex الحالي. لو لأ أخزن العنصر. بكده بقت O(n) زمن مقابل O(n) مساحة، وده تبادل زمن مقابل مساحة.",
        },
      ],
    },
    {
      title: "تحريك الأصفار وحاصل الجمع التراكمي",
      en: "Move zeros and prefix sums",
      body: "<p><b>تحريك الأصفار</b> للآخر مع الحفاظ على ترتيب الباقي: مؤشر قراءة <code>r</code> يلف على كل شيء، ومؤشر كتابة <code>w</code> يشاور على مكان العنصر غير الصفر الجاي. في الآخر نكمل الباقي أصفار.</p><p><b>Prefix sums</b>: قايمة <code>p</code> فيها مجموع أول k عناصر. بعد ما بنبنيها مرة (O(n))، مجموع أي مدى من <code>i</code> إلى <code>j</code> بيجي بطرح واحد: <code>p[j + 1] - p[i]</code>.</p>",
      code: {
        lang: "dart",
        src: `void moveZeros(List<int> a) {
  var w = 0;
  for (var r = 0; r < a.length; r++) {
    if (a[r] != 0) {
      a[w] = a[r];
      w++;
    }
  }
  while (w < a.length) {
    a[w] = 0;
    w++;
  }
}

List<int> prefixSums(List<int> a) {
  final p = <int>[0];
  for (final n in a) {
    p.add(p.last + n);
  }
  return p;
}

void main() {
  final xs = [0, 1, 0, 3, 12];
  moveZeros(xs);
  print(xs);                          // [1, 3, 12, 0, 0]
  final p = prefixSums([2, 4, 1, 3, 5]);
  print(p);                           // [0, 2, 6, 7, 10, 15]
  print(p[4] - p[1]);                 // 8  (= 4 + 1 + 3, indexes 1..3)
}`,
        note: "الـ prefix sums مفيدة لما بتسأل عن مجموع مدى مرات كتير: كل سؤال O(1) بدل O(n).",
      },
      interview: [
        { q: "إزاي تنقل كل الأصفار لآخر القايمة مع الحفاظ على ترتيب الباقي؟", a: "بستخدم مؤشرين: <code>r</code> بيمر على كل العناصر، و<code>w</code> مكان الكتابة. كل ما <code>a[r]</code> مش صفر، أكتبه في <code>a[w]</code> وأزود w. لما r يخلص، أملى من w لآخر القايمة أصفار. O(n) زمن ومساحة O(1)، وترتيب العناصر غير الصفرية محفوظ.",
        },
      ],
    },
    {
      title: "أخطاء الواحد الزايد أو الناقص",
      en: "Off-by-one errors",
      body: "<p>الـ off-by-one هو أكتر باج في مسائل القوائم: لوب بيعدي واحد زيادة أو بيوقف واحد بدري. عادة يتكشف في الحالات الحدية. القواعد اللي تحميك:</p>",
      points: [
        "قايمة طولها n: الـ indexes من <code>0</code> إلى <code>n - 1</code>. شرط اللوب <code>i &lt; n</code> مش <code>i &lt;= n</code>.",
        "<code>sublist(start, end)</code>: الـ end <b>مستبعد</b>. طول الناتج <code>end - start</code>.",
        "مقارنة كل زوج: <code>j</code> يبدأ من <code>i + 1</code> عشان متقارنش العنصر بنفسه ولا تقارن الزوج مرتين.",
        "اتحقق دايما بقايمة فاضية وعنصر واحد وعنصرين.",
      ],
      codes: [
        {
          lang: "dart",
          title: "غلط: RangeError",
          src: `final a = [1, 2, 3];
for (var i = 0; i <= a.length; i++) {
  print(a[i]);   // i == 3 throws RangeError
}`,
        },
        {
          lang: "dart",
          title: "صح",
          src: `final a = [1, 2, 3];
for (var i = 0; i < a.length; i++) {
  print(a[i]);   // 1 2 3
}`,
        },
      ],
      pitfall: "ممنوع تحذف من قايمة وانت بتلف عليها بـ <code>for (final x in a)</code>: Dart بترمي <code>ConcurrentModificationError</code>. استخدم <code>a.removeWhere((x) =&gt; x.isEven)</code> أو ابني قايمة جديدة.",
      interview: [
        { q: "إيه هو الـ off-by-one error وإزاي بتتجنبه؟", a: "هو لما اللوب بيعدي أو بيوقف بواحد غلط، زي <code>i &lt;= a.length</code> بدل <code>i &lt; a.length</code> فبيطلع RangeError، أو <code>sublist</code> بتنسى إن الـ end مستبعد. بتجنبه بإني أكتب مثال صغير (قايمة من 3 عناصر) وأتتبع أول لفة وآخر لفة بإيدي، وأجرب القايمة الفاضية والعنصر الواحد قبل ما أقول «خلصت».",
        },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: عكس قايمة في مكانها",
      lang: "dart",
      code: `void reverseInPlace(List<int> a) {
  var i = 0;
  var j = a.length - 1;
  while (i < j) {
    final tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
    i++;
    j--;
  }
}

void main() {
  final xs = [1, 2, 3, 4, 5];
  reverseInPlace(xs);
  print(xs);
}`,
      note: "الناتج [5, 4, 3, 2, 1].",
    },
    {
      title: "اكتب: حذف المكرر بـ Set",
      lang: "dart",
      code: `List<int> unique(List<int> a) {
  final seen = <int>{};
  final out = <int>[];
  for (final n in a) {
    if (seen.add(n)) out.add(n);
  }
  return out;
}

void main() {
  print(unique([3, 1, 3, 2, 1]));
}`,
      note: "الناتج [3, 1, 2].",
    },
    {
      title: "اكتب: دمج قايمتين مرتبتين",
      lang: "dart",
      code: `List<int> mergeSorted(List<int> a, List<int> b) {
  final out = <int>[];
  var i = 0;
  var j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      out.add(a[i++]);
    } else {
      out.add(b[j++]);
    }
  }
  out.addAll(a.sublist(i));
  out.addAll(b.sublist(j));
  return out;
}`,
      note: "<code>a[i++]</code> بتقرأ العنصر وبعدين تزود i، اختصار للسطرين.",
    },
  ],

  tasks: [
    {
      title: "تاني أكبر قيمة مختلفة",
      lang: "dart",
      prompt: "<p>اكتب <code>int? secondLargestDistinct(List&lt;int&gt; nums)</code> ترجع تاني أكبر قيمة <b>مختلفة</b> في القايمة، أو <code>null</code> لو مفيش (قايمة فاضية أو كل العناصر متساوية). من غير ترتيب القايمة.</p>",
      examples: [
        { in: "secondLargestDistinct([4, 9, 2, 9, 7])", out: "7" },
        { in: "secondLargestDistinct([5, 5])", out: "null" },
        { in: "secondLargestDistinct([-3, -1, -2])", out: "-2" },
      ],
      starter: `int? secondLargestDistinct(List<int> nums) {
  // your code
}`,
      hints: [
        "محتاج متغيرين nullable: <code>first</code> و<code>second</code>، ولفة واحدة.",
        "لو الرقم أكبر من first: second = first ثم first = n. غير كده لو n != first وأكبر من second: second = n.",
      ],
      solution: `int? secondLargestDistinct(List<int> nums) {
  int? first;
  int? second;
  for (final n in nums) {
    if (first == null || n > first) {
      second = first;
      first = n;
    } else if (n != first && (second == null || n > second)) {
      second = n;
    }
  }
  return second;
}`,
      explain: "استخدمنا null بدل 0 كقيمة ابتدائية عشان الأرقام السالبة تشتغل. التعقيد O(n) ومساحة O(1). حالة <code>[5, 5]</code> بترجع null لأن التاني مبيتحدّثش إلا لو n != first.",
    },
    {
      title: "نقل الأصفار للآخر",
      lang: "dart",
      prompt: "<p>اكتب <code>void moveZeros(List&lt;int&gt; nums)</code> تنقل كل الأصفار لآخر القايمة <b>في مكانها</b> (من غير قايمة جديدة) وتحافظ على ترتيب العناصر غير الصفرية.</p>",
      examples: [
        { in: "[0, 1, 0, 3, 12]", out: "[1, 3, 12, 0, 0]" },
        { in: "[0, 0]", out: "[0, 0]" },
        { in: "[4, 5]", out: "[4, 5]" },
      ],
      starter: `void moveZeros(List<int> nums) {
  // your code
}`,
      hints: [
        "مؤشر قراءة <code>r</code> ومؤشر كتابة <code>w</code> يبدأ من 0.",
        "كل غير صفر: اكتبه في <code>nums[w]</code> وزود w. في الآخر املى من w لحد النهاية أصفار.",
      ],
      solution: `void moveZeros(List<int> nums) {
  var w = 0;
  for (var r = 0; r < nums.length; r++) {
    if (nums[r] != 0) {
      nums[w] = nums[r];
      w++;
    }
  }
  while (w < nums.length) {
    nums[w] = 0;
    w++;
  }
}`,
      explain: "مرور واحد بمؤشرين: O(n) زمن و O(1) مساحة. القايمة الفاضية والقايمة اللي كلها أصفار أو من غير أصفار شغالين من غير حالات خاصة.",
    },
    {
      title: "Two Sum بـ Map",
      lang: "dart",
      prompt: "<p>اكتب <code>List&lt;int&gt; twoSum(List&lt;int&gt; nums, int target)</code> ترجع index العنصرين (بالترتيب الأصغر الأول) اللي مجموعهم <code>target</code>، أو قايمة فاضية لو مفيش. استخدم <code>Map</code> عشان تخلي الحل O(n). نفس العنصر ميتحسبش مرتين.</p>",
      examples: [
        { in: "twoSum([2, 7, 11, 15], 9)", out: "[0, 1]" },
        { in: "twoSum([3, 2, 4], 6)", out: "[1, 2]" },
        { in: "twoSum([3], 6)", out: "[]" },
      ],
      starter: `List<int> twoSum(List<int> nums, int target) {
  // your code
}`,
      hints: [
        "<code>Map&lt;int, int&gt;</code> من القيمة للـ index لكل اللي شفته لحد دلوقتي.",
        "لكل <code>nums[i]</code> دور على <code>target - nums[i]</code> في الـ Map قبل ما تخزن <code>nums[i]</code>.",
      ],
      solution: `List<int> twoSum(List<int> nums, int target) {
  final seen = <int, int>{};
  for (var i = 0; i < nums.length; i++) {
    final j = seen[target - nums[i]];
    if (j != null) return [j, i];
    seen[nums[i]] = i;
  }
  return [];
}`,
      explain: "O(n) زمن و O(n) مساحة. الفحص قبل التخزين بيمنع استخدام نفس العنصر مرتين. بنرجع <code>[j, i]</code> فالأصغر هو الأول دايما لأن j اتخزن قبل i. لو فيه قيمة مكررة، آخر ظهور هو اللي في الـ Map، وده مش مشكلة هنا لأن الفحص بيحصل قبل التخزين.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final a = [1, 2, 3];
final b = a;
b.add(4);
print(a.length);` },
      answer: ["4"],
      why: "<code>final b = a</code> مبتعملش نسخة، الاتنين أسماء لنفس القايمة. للنسخة الحقيقية استخدم <code>[...a]</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final xs = [1, 2, 3];
xs.reversed;
print(xs);` },
      answer: ["[1, 2, 3]", "[1,2,3]"],
      why: "<code>reversed</code> بيرجع Iterable جديد ومبيغيرش القايمة. عشان تعكس في مكانها لازم تبدل بإيدك، أو تاخد <code>xs.reversed.toList()</code> كقايمة جديدة.",
    },
    {
      q: "أنهي سطر فيه الغلط؟ الدالة المفروض تطبع كل أزواج العناصر.",
      code: { lang: "dart", src: `void pairs(List<int> a) {
  for (var i = 0; i < a.length; i++) {            // line 1
    for (var j = i; j < a.length; j++) {          // line 2
      print('\${a[i]} \${a[j]}');                 // line 3
    }
  }
}` },
      options: [
        "السطر 1: الشرط لازم يكون <code>i &lt;= a.length</code>",
        "السطر 3: لازم <code>print</code> تاخد قايمة",
        "السطر 2: <code>j</code> لازم يبدأ من <code>i + 1</code> عشان العنصر ميتقارنش بنفسه",
        "مفيش غلط",
      ],
      answer: 2,
      why: "لو j بدأ من i، كل عنصر هيتجوّز مع نفسه. <code>j = i + 1</code> كمان بيمنع تكرار نفس الزوج بترتيب معكوس. السطر 1 شرطه صح، وتغييره لـ <code>&lt;=</code> هو اللي هيعمل RangeError.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final nums = [10, 20, 30, 40];
print(nums.sublist(1, 3));` },
      answer: ["[20, 30]", "[20,30]"],
      why: "<code>sublist(1, 3)</code> بتبدأ من index 1 وبتقف قبل index 3. الناتج [20, 30] والـ end مستبعد.",
    },
    {
      q: "عايز تحذف المكرر من قايمة وتحافظ على ترتيب أول ظهور. أنسب حل إيه؟",
      options: [
        "لف على العناصر وخزن اللي اتشاف في Set، وأضف للنتيجة اللي <code>seen.add(x)</code> ترجع true له",
        "رتّب القايمة الأول وبعدين احذف",
        "استخدم لوب جوه لوب وقارن كل عنصر بكل اللي قبله، وده الأسرع",
        "احذف من القايمة وانت بتلف عليها بـ for-in",
      ],
      answer: 0,
      why: "الـ Set بيفحص ويضيف في O(1) تقريبا فالكل O(n) والترتيب محفوظ. الترتيب بيغير ترتيب الأصل. اللوب جوه لوب شغال لكنه O(n²). والحذف أثناء for-in بيرمي ConcurrentModificationError.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `List<int> merge(List<int> a, List<int> b) {
  final out = <int>[];
  var i = 0;
  var j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      out.add(a[i++]);
    } else {
      out.add(b[j++]);
    }
  }
  out.addAll(a.sublist(i));
  out.addAll(b.sublist(j));
  return out;
}

void main() {
  print(merge([1, 5], [2, 3]));
}` },
      answer: ["[1, 2, 3, 5]", "[1,2,3,5]"],
      why: "المقارنات: 1 مقابل 2 فنضيف 1. 5 مقابل 2 فنضيف 2. 5 مقابل 3 فنضيف 3. b خلصت فنضيف الباقي من a وهو 5.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final p = <int>[0];
for (final n in [3, 1, 2]) {
  p.add(p.last + n);
}
print(p);` },
      answer: ["[0, 3, 4, 6]", "[0,3,4,6]"],
      why: "كل عنصر جديد = آخر مجموع + الرقم: 0 ثم 0+3=3 ثم 3+1=4 ثم 4+2=6.",
    },
    {
      q: "في Two Sum بالـ Map، ليه بنفحص الـ Map <b>قبل</b> ما نخزن العنصر الحالي؟",
      options: [
        "عشان الـ Map بتبقى فاضية في أول لفة وقراءتها وقتها بتعمل مشكلة",
        "عشان الترتيب مش مهم أصلا",
        "عشان نستخدم نفس العنصر مرتين",
        "عشان العنصر ميطابقش نفسه: <code>[3]</code> مع target 6 مكانش هيرجع زوج صحيح",
      ],
      answer: 3,
      why: "لو خزنت الأول، العنصر 3 هيلاقي 3 في الـ Map (نفسه) ويرجع زوج بنفس الـ index مرتين. الفحص الأول بيضمن إن اللي بنلاقيه عنصر سابق مختلف.",
    },
    {
      q: "الدالة دي المفروض تحذف الأرقام الزوجية. الناتج إيه؟",
      code: { lang: "dart", src: `final a = [1, 2, 3, 4];
for (final x in a) {
  if (x.isEven) a.remove(x);
}
print(a);` },
      options: [
        "[1, 3]",
        "ConcurrentModificationError",
        "[1, 3, 4]",
        "[1, 2, 3, 4]",
      ],
      answer: 1,
      why: "تعديل طول القايمة أثناء for-in بيرمي <code>ConcurrentModificationError</code> (الـ error بيظهر بعد حذف 2 وانت بتكمل). الصح: <code>a.removeWhere((x) =&gt; x.isEven)</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `List<int> rotateRight(List<int> a, int k) {
  if (a.isEmpty) return [];
  final s = k % a.length;
  return [...a.sublist(a.length - s), ...a.sublist(0, a.length - s)];
}

void main() {
  print(rotateRight([1, 2, 3, 4], 5));
}` },
      answer: ["[4, 1, 2, 3]", "[4,1,2,3]"],
      why: "<code>5 % 4 = 1</code> فبندور خانة واحدة: آخر عنصر (4) يروح الأول. النتيجة [4, 1, 2, 3].",
    },
  ],
};
