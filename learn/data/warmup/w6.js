window.LEVELS = window.LEVELS || {};
window.LEVELS["warmup/w6"] = {
  slides: [
    {
      kicker: "ليه النصوص",
      title: "نص يعني قايمة حروف، ومسائل النصوص هي نص الإنترفيو",
      en: "String problems",
      body: "<p>مسائل النصوص هي أكتر حاجة بتتسأل في المقابلات الأولى: reverse و palindrome و anagram وعدّ الحروف. السبب إنها بتختبر loops وشروط وتجميع القيم في وقت واحد، من غير ما تحتاج مكتبات.</p><p>في Dart كل <code>String</code> قيمة <b>immutable</b>: أي تعديل بيعمل نص جديد ومبيغيرش القديم.</p>",
      points: [
        "الحرف الواحد في Dart هو نفسه <code>String</code> طوله 1 (مفيش نوع <code>char</code>).",
        "هنستخدم نفس خطوات w5: افهم، أمثلة، خطة، كود، اختبار.",
        "الحالات الحدية للنصوص: نص فاضي، حرف واحد، حروف كبيرة وصغيرة، مسافات.",
      ],
    },
    {
      title: "الأساسيات: length و [] و substring",
      en: "Basic String API",
      code: {
        lang: "dart",
        src: `final s = 'Hello';
print(s.length);            // 5
print(s[0]);                // H
print(s[s.length - 1]);     // o
print(s.substring(1, 3));   // el   (end index is excluded)
print(s.substring(2));      // llo
print(s.indexOf('l'));      // 2
print(s.lastIndexOf('l'));  // 3
print(s.contains('ell'));   // true
print(s.startsWith('He'));  // true
print(s == 'Hello');        // true  (compares content)`,
        note: "الفهرسة بتبدأ من 0. <code>s[5]</code> هنا بترمي <code>RangeError</code> لأن آخر index هو 4.",
      },
      pitfall: "<code>substring(start, end)</code>: الـ end <b>مستبعد</b>. و <code>'abc'[3]</code> بتعدي الكومبايل وبتقع وقت التشغيل.",
    },
    {
      title: "تقسيم وتجميع وتنظيف",
      en: "split, join, trim, case",
      body: "<p><code>split</code> بتقطع النص على فاصل وبترجع قايمة. <code>join</code> بتعمل العكس. <code>trim</code> بتشيل المسافات من الأطراف. <code>toLowerCase</code> و <code>toUpperCase</code> بيوحدوا الحروف قبل المقارنة.</p>",
      code: {
        lang: "dart",
        src: `final words = 'a-b-c'.split('-');       // [a, b, c]
print(words.join('+'));                 // a+b+c
print('  hi  '.trim().length);          // 2
print('Dart'.toLowerCase());            // dart
print('a  b'.split(' ').length);        // 3  (['a', '', 'b'])
print('abc'.split('').reversed.join()); // cba
print('a b'.replaceAll(' ', '_'));      // a_b`,
        note: "<code>'a  b'.split(' ')</code> مسافتين ورا بعض بتدي عنصر فاضي في النص. لعدّ الكلمات تجاهل العناصر الفاضية.",
      },
      pitfall: "<code>split('')</code> بتقسم لحروف، وعلى ده بنبني reverse: <code>split('').reversed.join()</code>. <code>reversed</code> بترجع Iterable مش List، فلازم <code>join</code> أو <code>toList</code>.",
    },
    {
      title: "الحروف كأرقام: codeUnitAt",
      en: "Character codes",
      body: "<p>كل حرف ليه رقم كود. <code>'a'.codeUnitAt(0)</code> = 97 و<code>'A'</code> = 65 و<code>'0'</code> = 48. الحروف الصغيرة <code>a</code> إلى <code>z</code> متتالية (97 إلى 122)، فنقدر نحسب موضع الحرف في الأبجدية، أو نفحص هل الحرف حرف ولا رقم.</p>",
      code: {
        lang: "dart",
        src: `final c = 'd'.codeUnitAt(0);        // 100
print(c - 'a'.codeUnitAt(0));         // 3  (position in the alphabet)
print(String.fromCharCode(c + 1));    // e

bool isLowerLetter(String ch) {
  final code = ch.codeUnitAt(0);
  return code >= 97 && code <= 122;
}

print(isLowerLetter('q'));            // true
print(isLowerLetter('7'));            // false`,
        note: "نفس الفكرة بتتعمل في Caesar cipher وعدّ تكرار الحروف بمصفوفة من 26 خانة.",
      },
      terms: [
        ["code unit", "وحدة الكود", "رقم 16-bit بيمثل جزء من حرف في UTF-16. الإيموجي مثلا بياخد وحدتين."],
      ],
    },
    {
      title: "Reverse و Palindrome",
      en: "Reverse and palindrome",
      body: "<p>الـ palindrome نص بيتقرأ نفسه من الاتجاهين (<code>level</code>). الخطة: وحد الحروف (lowercase) وشيل الرموز والمسافات، بعدين قارنه بعكسه. اللي بتقارنه لازم تكون نظفته الأول.</p>",
      code: {
        lang: "dart",
        src: `bool isPalindrome(String s) {
  final clean = s.toLowerCase();
  final rev = clean.split('').reversed.join();
  return clean == rev;
}

// Two pointers: no extra string, stops early
bool isPalindrome2(String s) {
  var left = 0;
  var right = s.length - 1;
  while (left < right) {
    if (s[left] != s[right]) return false;
    left++;
    right--;
  }
  return true;
}

void main() {
  print(isPalindrome('Level'));    // true
  print(isPalindrome2('abca'));    // false
}`,
        note: "طريقة المؤشرين بتخرج من أول عدم تطابق، وبتحتاج مساحة O(1) بدل نسخة معكوسة.",
      },
      interview: [
        { q: "اكتب دالة تفحص هل نص palindrome وإزاي تتعامل مع الحروف الكبيرة والمسافات؟", a: "الخطة: أحول النص lowercase وأشيل أي حاجة مش حرف أو رقم، بعدين أقارنه بعكسه أو أستخدم مؤشرين: واحد من الأول وواحد من الآخر، وأقارن وأقرّبهم لحد ما يتقابلوا. لو أي زوج مختلف أرجع false. التعقيد O(n) وبالمؤشرين المساحة O(1). والنص الفاضي وحرف واحد palindrome." },
      ],
    },
    {
      title: "عدّ الحروف والكلمات",
      en: "Counting",
      code: {
        lang: "dart",
        src: `int countVowels(String text) {
  const vowels = 'aeiou';
  var count = 0;
  for (var i = 0; i < text.length; i++) {
    if (vowels.contains(text[i].toLowerCase())) count++;
  }
  return count;
}

int countWords(String text) {
  var count = 0;
  for (final w in text.trim().split(' ')) {
    if (w.isNotEmpty) count++;
  }
  return count;
}

void main() {
  print(countVowels('Hello World'));      // 3
  print(countWords('  the  quick fox '));  // 3
}`,
        note: "<code>'aeiou'.contains(ch)</code> فحص انتماء في سطر. وتجاهل الكلمات الفاضية (<code>isNotEmpty</code>) بيحل مشكلة المسافات المتكررة.",
      },
      pitfall: "<code>''.split(' ')</code> بترجع قايمة فيها عنصر فاضي واحد (طول 1 مش 0). عشان كده counting words من غير فحص <code>isNotEmpty</code> غلط للنص الفاضي.",
    },
    {
      title: "Anagram وأول حرف غير مكرر",
      en: "Anagram and first unique character",
      body: "<p><b>Anagram</b>: كلمتين بنفس الحروف بنفس العدد (<code>listen</code> و<code>silent</code>). طريقتين: رتب حروف الاتنين وقارن، أو عدّ كل حرف في Map وقارن العدّات.</p><p><b>أول حرف غير مكرر</b>: مرّة أولى عدّ تكرار كل حرف في Map، ومرة تانية امشي على النص بالترتيب وارجع أول حرف عدّه 1.</p>",
      code: {
        lang: "dart",
        src: `bool isAnagram(String a, String b) {
  if (a.length != b.length) return false;
  final x = a.toLowerCase().split('');
  final y = b.toLowerCase().split('');
  x.sort();
  y.sort();
  return x.join() == y.join();
}

String? firstUnique(String s) {
  final counts = <String, int>{};
  for (final ch in s.split('')) {
    counts[ch] = (counts[ch] ?? 0) + 1;
  }
  for (final ch in s.split('')) {
    if (counts[ch] == 1) return ch;
  }
  return null;
}

void main() {
  print(isAnagram('Listen', 'Silent'));  // true
  print(firstUnique('swiss'));           // w
}`,
        note: "الـ Map <code>counts</code> بيخلي الحل O(n) بدل لوب داخلي O(n²). والنتيجة <code>String?</code> لأن ممكن ميبقاش فيه حرف غير مكرر.",
      },
      focus: [{ label: "الفكرة", text: "أي مسألة «كام مرة» أو «هل اتكرر» الحل غالبا Map من الحرف لعدده." }],
    },
    {
      title: "StringBuffer وحدود الأداء",
      en: "StringBuffer",
      body: "<p>بما إن <code>String</code> immutable، كل <code>result += x</code> جوا لوب بتعمل نص جديد وبتنسخ القديم، يعني لوب من n خطوة ممكن يكلف O(n²). <code>StringBuffer</code> بيجمع القطع ويبني النص مرة واحدة في الآخر.</p>",
      code: {
        lang: "dart",
        src: `String compress(String s) {
  if (s.isEmpty) return '';
  final out = StringBuffer();
  var run = 1;
  for (var i = 1; i <= s.length; i++) {
    if (i < s.length && s[i] == s[i - 1]) {
      run++;
    } else {
      out.write(s[i - 1]);
      out.write(run);
      run = 1;
    }
  }
  return out.toString();
}

void main() {
  print(compress('aaabbc'));  // a3b2c1
}`,
        note: "<code>write</code> بتضيف قطعة (نص أو رقم)، و<code>toString()</code> بتطلع النتيجة. الشرط <code>i &lt; s.length</code> بيعالج آخر مجموعة.",
      },
      interview: [
        { q: "ليه <code>StringBuffer</code> أحسن من <code>+=</code> في لوب؟", a: "لأن <code>String</code> في Dart immutable، فكل <code>+=</code> بتنشئ نص جديد وتنسخ كل اللي قبله، فاللوب الطويل بيبقى تربيعي تقريبا. <code>StringBuffer</code> بيحتفظ بالقطع ويدمجها مرة واحدة في <code>toString()</code>. لو التكرارات قليلة الفرق مش ملحوظ، لكن في نصوص كبيرة هو الاختيار الصح." },
        { q: "إزاي تحل مسألة «أول حرف غير مكرر في نص» بتعقيد خطي؟", a: "بمر على النص مرة وأبني Map من الحرف لعدد مرات ظهوره، وبعدين بمر تاني بالترتيب وأرجع أول حرف عدّه 1، أو null لو مفيش. مرتين على النص يعني O(n) زمن، وO(k) مساحة حيث k عدد الحروف المختلفة." },
        { q: "إزاي تفحص إن كلمتين anagram؟", a: "أول حاجة أتأكد إن طولهم نفس الطول، بعد توحيد الحروف lowercase. بعدين إما أرتب حروف الاتنين وأقارن (O(n log n))، أو أعد تكرار كل حرف في Map وأقارن العدّات (O(n)). المقارنة بمجموعة الحروف المختلفة بس (Set) غلط لأنها بتتجاهل عدد التكرار." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: palindrome",
      lang: "dart",
      code: `bool isPalindrome(String s) {
  final clean = s.toLowerCase();
  final rev = clean.split('').reversed.join();
  return clean == rev;
}

void main() {
  print(isPalindrome('Level'));
  print(isPalindrome('Dart'));
}`,
      note: "الأولى true والتانية false.",
    },
    {
      title: "اكتب: عدّ حروف العلة",
      lang: "dart",
      code: `int countVowels(String text) {
  const vowels = 'aeiou';
  var count = 0;
  for (var i = 0; i < text.length; i++) {
    if (vowels.contains(text[i].toLowerCase())) count++;
  }
  return count;
}

void main() {
  print(countVowels('Hello World'));
}`,
      note: "الناتج 3 (e و o و o).",
    },
    {
      title: "اكتب: أول حرف غير مكرر",
      lang: "dart",
      code: `String? firstUnique(String s) {
  final counts = <String, int>{};
  for (final ch in s.split('')) {
    counts[ch] = (counts[ch] ?? 0) + 1;
  }
  for (final ch in s.split('')) {
    if (counts[ch] == 1) return ch;
  }
  return null;
}

void main() {
  print(firstUnique('swiss'));
}`,
      note: "بيطبع <code>w</code>. المرور الأول للعدّ والتاني للبحث بالترتيب.",
    },
  ],

  tasks: [
    {
      title: "Palindrome بتجاهل الرموز",
      lang: "dart",
      prompt: "<p>اكتب <code>bool isCleanPalindrome(String s)</code> ترجع true لو النص palindrome بعد تجاهل الحروف الكبيرة والصغيرة وأي حاجة غير الحروف الإنجليزية والأرقام (مسافات ورموز). النص الفاضي palindrome.</p>",
      examples: [
        { in: "isCleanPalindrome('A man, a plan, a canal: Panama')", out: "true" },
        { in: "isCleanPalindrome('race a car')", out: "false" },
      ],
      starter: `bool isCleanPalindrome(String s) {
  // your code
}`,
      hints: [
        "ابني نص نظيف: لف على حروف النص lowercase واحتفظ بالحرف لو بين a-z أو 0-9 (بالـ codeUnitAt).",
        "بعد التنظيف قارن بعكسه، أو استخدم مؤشرين.",
      ],
      solution: `bool isCleanPalindrome(String s) {
  final clean = StringBuffer();
  for (final ch in s.toLowerCase().split('')) {
    final code = ch.codeUnitAt(0);
    final isLetter = code >= 97 && code <= 122;
    final isDigit = code >= 48 && code <= 57;
    if (isLetter || isDigit) clean.write(ch);
  }
  final text = clean.toString();
  var left = 0;
  var right = text.length - 1;
  while (left < right) {
    if (text[left] != text[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
      explain: "خطوتين: تنظيف (StringBuffer عشان نبني النص) ثم مقارنة بمؤشرين. النص الفاضي طوله 0 فاللوب مبيشتغلش وترجع true. التعقيد O(n) زمن و O(n) مساحة للنص النظيف.",
    },
    {
      title: "Anagram",
      lang: "dart",
      prompt: "<p>اكتب <code>bool isAnagram(String a, String b)</code>: true لو النصين بنفس الحروف بنفس العدد، بتجاهل حالة الحروف والمسافات.</p>",
      examples: [
        { in: "isAnagram('Dormitory', 'Dirty room')", out: "true" },
        { in: "isAnagram('aab', 'abb')", out: "false" },
      ],
      starter: `bool isAnagram(String a, String b) {
  // your code
}`,
      hints: [
        "الأول نظّف الاتنين: <code>toLowerCase()</code> و <code>replaceAll(' ', '')</code>.",
        "الطريقة الأسهل: حوّل لقايمة حروف، رتبها بـ <code>sort()</code>، وقارن <code>join()</code>.",
      ],
      solution: `bool isAnagram(String a, String b) {
  final x = a.toLowerCase().replaceAll(' ', '').split('');
  final y = b.toLowerCase().replaceAll(' ', '').split('');
  if (x.length != y.length) return false;
  x.sort();
  y.sort();
  return x.join() == y.join();
}

// Alternative with counts (O(n)):
bool isAnagramCounts(String a, String b) {
  final counts = <String, int>{};
  for (final ch in a.toLowerCase().replaceAll(' ', '').split('')) {
    counts[ch] = (counts[ch] ?? 0) + 1;
  }
  for (final ch in b.toLowerCase().replaceAll(' ', '').split('')) {
    counts[ch] = (counts[ch] ?? 0) - 1;
  }
  return counts.values.every((v) => v == 0);
}`,
      explain: "الترتيب O(n log n)، والعدّ O(n). في النسخة التانية نزود للأول وننقص للتاني، ولو كل القيم صفر يبقى نفس الحروف بنفس العدد.",
    },
    {
      title: "ضغط النص",
      lang: "dart",
      prompt: "<p>اكتب <code>String compress(String s)</code> بتضغط الحروف المتكررة المتتالية: <code>'aaabbc'</code> تبقى <code>'a3b2c1'</code>. النص الفاضي يرجع فاضي. استخدم <code>StringBuffer</code>.</p>",
      examples: [
        { in: "compress('aaabbc')", out: "a3b2c1" },
        { in: "compress('abc')", out: "a1b1c1" },
        { in: "compress('')", out: "(empty)" },
      ],
      starter: `String compress(String s) {
  // your code
}`,
      hints: [
        "امشي على النص وعدّ طول المجموعة الحالية من نفس الحرف.",
        "لما الحرف يتغير (أو النص يخلص) اكتب الحرف وعدده في الـ buffer وصفّر العدّاد.",
      ],
      solution: `String compress(String s) {
  if (s.isEmpty) return '';
  final out = StringBuffer();
  var run = 1;
  for (var i = 1; i <= s.length; i++) {
    if (i < s.length && s[i] == s[i - 1]) {
      run++;
    } else {
      out.write(s[i - 1]);
      out.write(run);
      run = 1;
    }
  }
  return out.toString();
}`,
      explain: "اللوب بيمشي لحد <code>s.length</code> (شامل) عشان نكتب آخر مجموعة. المقارنة دايما مع الحرف اللي قبله. التعقيد O(n) والـ StringBuffer بيمنع النسخ المتكرر.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print('hello'.substring(1, 3));` },
      answer: ["el"],
      why: "<code>substring(1, 3)</code> بتاخد الحروف من index 1 لحد قبل 3: <code>e</code> و <code>l</code>. الـ end مستبعد.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print('a  b'.split(' ').length);` },
      answer: ["3"],
      why: "مسافتين ورا بعض بتدي عنصر فاضي بينهم: <code>['a', '', 'b']</code>، يعني 3 عناصر. عشان كده عدّ الكلمات محتاج تجاهل الفاضي.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print('Dart'.codeUnitAt(0));` },
      answer: ["68"],
      why: "<code>'D'</code> كودها 68 (حرف <code>A</code> = 65 يعني D بعدها بـ 3). الحروف الصغيرة تبدأ من 97.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print('banana'.lastIndexOf('an'));` },
      answer: ["3"],
      why: "<code>an</code> موجودة عند index 1 و 3، و <code>lastIndexOf</code> بترجع آخر ظهور وهو 3.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `print('abc'.split('').reversed.join());` },
      answer: ["cba"],
      why: "<code>split('')</code> بتدي <code>[a, b, c]</code>، <code>reversed</code> بتعكسها، و <code>join()</code> بتجمعها من غير فاصل: <code>cba</code>.",
    },
    {
      q: "إيه اللي بيحصل لما تنفذ الكود ده؟",
      code: { lang: "dart", src: `final s = 'abc';
print(s[3]);` },
      options: [
        "بيطبع <code>null</code>",
        "بيطبع نص فاضي",
        "<code>RangeError</code> وقت التشغيل",
        "خطأ وقت الكومبايل",
      ],
      answer: 2,
      why: "الـ indices الصالحة 0 و 1 و 2. الكومبايلر مش بيعرف قيمة الـ index فالخطأ بيظهر وقت التشغيل كـ <code>RangeError</code>. مفيش null ولا نص فاضي.",
    },
    {
      q: "أول حرف غير مكرر في النص <code>swiss</code> هو؟",
      answer: ["w"],
      why: "تكرارات الحروف: <code>s</code>=3 و <code>w</code>=1 و <code>i</code>=1. بالترتيب أول حرف تكراره 1 هو <code>w</code> (الأول <code>s</code> متكرر).",
    },
    {
      q: "أنهي طريقة <b>غلط</b> لفحص anagram؟",
      options: [
        "رتب حروف الكلمتين وقارن",
        "عدّ كل حرف في Map لكل كلمة وقارن الـ Maps",
        "تأكد إن الطولين متساويين وبعدين أي طريقة من الأولى",
        "قارن مجموعة الحروف المختلفة (Set) من غير عدد التكرار",
      ],
      answer: 3,
      why: "Set بتتجاهل التكرار: <code>aab</code> و <code>abb</code> نفس الـ Set <code>{a, b}</code> لكنهم مش anagram. باقي الطرق بتحافظ على عدد كل حرف.",
    },
    {
      q: "عايز تفحص palindrome للجملة <code>A man, a plan</code> بشكل سليم. أنهي خطوة تحضير ضرورية؟",
      options: [
        "فحص الطول فردي أو زوجي",
        "تحويل لـ lowercase وشيل المسافات والرموز قبل المقارنة",
        "عمل sort للحروف",
        "استخدام <code>==</code> بين النص الأصلي وعكسه مباشرة",
      ],
      answer: 1,
      why: "المسافات والفاصلة والحروف الكبيرة هتخلي المقارنة تفشل رغم إن الجملة palindrome فعليا في الحروف. الـ sort بيختبر anagram مش palindrome.",
    },
    {
      q: "ليه <code>StringBuffer</code> أنسب من <code>result += ch</code> لبناء نص طويل في لوب؟",
      options: [
        "لأنه بيجمع القطع وبيبني النص مرة واحدة بدل ما ينسخ النص في كل لفة",
        "لأن <code>+=</code> مش مسموحة على النصوص في Dart",
        "لأن StringBuffer بيرتب الحروف تلقائيا",
        "لأن النص بيبقى mutable في الاتنين",
      ],
      answer: 0,
      why: "<code>String</code> immutable فكل <code>+=</code> نص جديد ونسخ للقديم. <code>+=</code> مسموحة (الخيار التاني غلط) و StringBuffer مبيرتبش حاجة.",
    },
  ],
};
