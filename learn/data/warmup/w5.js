window.LEVELS = window.LEVELS || {};
window.LEVELS["warmup/w5"] = {
  slides: [
    {
      kicker: "الطريقة قبل الكود",
      title: "إزاي تحول جملة مسألة لخطوات",
      en: "From statement to code",
      body: "<p>أغلب الناس بتفشل في مسائل الإنترفيو لأنهم بيبدأوا بالكود. المحترف بيمشي على 5 خطوات، وبينطقها بصوت عالي للمُقابِل:</p>",
      points: [
        "<b>افهم</b>: أعد صياغة المسألة بكلامك. إيه المدخل؟ إيه المطلوب؟ فيه قيود؟",
        "<b>أمثلة</b>: اكتب مثال أو اتنين بإيدك، وحالة حدية (صفر، فاضي، رقم واحد).",
        "<b>خطة</b>: اكتب الخطوات بالعربي أو pseudo-code، بدون syntax.",
        "<b>كود</b>: ترجم الخطة لـ Dart.",
        "<b>اختبر</b>: شغل الأمثلة على الكود، خصوصا الحالات الحدية.",
      ],
      focus: [{ label: "احفظها", text: "الأمثلة بتكشف سوء الفهم بدري، والخطة بتخلي الكود سطور قليلة. الكود مجرد ترجمة." }],
    },
    {
      title: "نمط المجمّع: مجموع وعدّ وأكبر قيمة",
      en: "Accumulator pattern",
      body: "<p>تلت أنماط بتتكرر في نص المسائل: اعمل متغير قبل اللوب، حدّثه جوا اللوب، واستخدمه بعد اللوب.</p>",
      code: {
        lang: "dart",
        src: `final nums = [4, -2, 9, 7, -5];

var sum = 0;
var countPositive = 0;
var max = nums[0];        // start from a real element, not 0

for (final n in nums) {
  sum += n;
  if (n > 0) countPositive++;
  if (n > max) max = n;
}
print('$sum $countPositive $max');   // 13 3 9`,
        note: "لو بدأت <code>max = 0</code> وكل الأرقام سالبة هتطلع النتيجة 0 غلط. ابدأ من أول عنصر.",
      },
      pitfall: "القايمة الفاضية: <code>nums[0]</code> بترمي خطأ. اسأل نفسك دايما: لو القايمة فاضية أرجع إيه؟",
      interview: [
        { q: "اكتب دالة ترجع أكبر رقم في قايمة، وإيه الغلطة الشائعة؟", a: "أبدأ <code>max</code> بأول عنصر وألف على الباقي وأحدّث لو لقيت أكبر. الغلطة الشائعة إني أبدأ بـ 0، فلو كل الأرقام سالبة هيرجع 0 وهو مش موجود في القايمة. وبفكر في القايمة الفاضية: إما أرمي خطأ أو أرجع <code>int?</code> بـ null." },
      ],
    },
    {
      title: "FizzBuzz وترتيب الشروط",
      en: "FizzBuzz",
      body: "<p>اطبع الأرقام من 1 لـ n، بس بدل مضاعفات 3 اطبع <code>Fizz</code> وبدل مضاعفات 5 اطبع <code>Buzz</code> وبدل مضاعفات الاتنين <code>FizzBuzz</code>. السؤال بيكشف هل بتفهم إن ترتيب الشروط معناه.</p>",
      codes: [
        {
          lang: "dart",
          title: "غلط",
          src: `for (var i = 1; i <= 15; i++) {
  if (i % 3 == 0) {
    print('Fizz');
  } else if (i % 5 == 0) {
    print('Buzz');
  } else if (i % 15 == 0) {
    print('FizzBuzz');   // never reached
  } else {
    print(i);
  }
}`,
        },
        {
          lang: "dart",
          title: "صح",
          src: `for (var i = 1; i <= 15; i++) {
  if (i % 15 == 0) {
    print('FizzBuzz');
  } else if (i % 3 == 0) {
    print('Fizz');
  } else if (i % 5 == 0) {
    print('Buzz');
  } else {
    print(i);
  }
}`,
        },
      ],
      pitfall: "مضاعف الـ 15 هو كمان مضاعف 3، فلو شرط 3 جه الأول مش هيوصل لشرط 15 أبدا. الشرط الأخص يتكتب الأول.",
    },
    {
      title: "أرقام الرقم: % 10 و ~/ 10",
      en: "Digits of a number",
      body: "<p>آخر رقم في عدد = <code>n % 10</code>. لو عايز تشيله = <code>n ~/ 10</code>. كرر لحد ما n تبقى 0. بنفس الطريقة نجمع الأرقام أو نعدّها أو نعكس الرقم.</p>",
      code: {
        lang: "dart",
        src: `int digitSum(int n) {
  var sum = 0;
  while (n > 0) {
    sum += n % 10;   // last digit
    n ~/= 10;        // drop it
  }
  return sum;
}

int reverseNumber(int n) {
  var rev = 0;
  while (n > 0) {
    rev = rev * 10 + n % 10;
    n ~/= 10;
  }
  return rev;
}

void main() {
  print(digitSum(4821));      // 15
  print(reverseNumber(1230)); // 321
}`,
        note: "عكس 1230 يطلع 321 مش 0321، لأن الأرقام مفيهاش أصفار في الأول.",
      },
      pitfall: "<code>countDigits(0)</code> بالـ while على <code>n &gt; 0</code> بترجع 0، والصح 1. دي حالة حدية لازم تتعامل معاها بشكل منفصل.",
      interview: [
        { q: "إزاي تجمع أرقام عدد أو تعكسه من غير ما تحوله لنص؟", a: "بكرر لحد ما العدد يبقى 0: آخر رقم هو <code>n % 10</code> وبشيله بـ <code>n ~/= 10</code>. للجمع بضيفه للمجموع، وللعكس بعمل <code>rev = rev * 10 + digit</code>. مثلا 4821: 1 ثم 2 ثم 8 ثم 4، فالمجموع 15 والعكس 1284. وبحط بالي من الصفر كمدخل." },
      ],
    },
    {
      title: "الأعداد الأولية",
      en: "Prime numbers",
      body: "<p>العدد الأولي هو أكبر من 1 ويقبل القسمة على نفسه وعلى 1 بس. نجرب القسمة على 2 ثم 3 ثم 4... ونوقف بدري لما نلاقي قاسم. والتحسين: القاسم الأصغر لعدد غير أولي لا يتعدى جذره التربيعي، فنوقف عند <code>i * i &lt;= n</code>.</p>",
      code: {
        lang: "dart",
        src: `bool isPrime(int n) {
  if (n < 2) return false;           // 0, 1 and negatives
  for (var i = 2; i * i <= n; i++) {
    if (n % i == 0) return false;
  }
  return true;
}

void main() {
  for (var n = 1; n <= 20; n++) {
    if (isPrime(n)) print(n);   // 2 3 5 7 11 13 17 19
  }
}`,
        note: "من غير سطر <code>n &lt; 2</code>، رقم 1 كان هيرجع true لأن اللوب مبيشتغلش.",
      },
      interview: [
        { q: "اكتب دالة تفحص هل رقم أولي، وإيه التحسين اللي ممكن تعمله؟", a: "أرجع false لو الرقم أقل من 2. بعدين أجرب القسمة على i من 2، ولو أي i يقسم الرقم بلا باقي أرجع false، وإلا true. التحسين إني أوقف عند <code>i * i &lt;= n</code> لأن لو n ليه قاسم أكبر من الجذر، فمقابله قاسم أصغر منه، فمش محتاج أفحص أكتر. ده بيقلل التعقيد من O(n) لـ O(√n)." },
      ],
    },
    {
      title: "رسم الأشكال بحلقات متداخلة",
      en: "Patterns with nested loops",
      body: "<p>الفكرة: اللوب الخارجي للصفوف، والداخلي للأعمدة. حدد لكل صف: كام مسافة وكام نجمة، كمعادلة في رقم الصف.</p>",
      code: {
        lang: "dart",
        src: `void main() {
  const n = 4;
  for (var row = 1; row <= n; row++) {
    var line = '';
    for (var col = 0; col < row; col++) {
      line += '*';
    }
    print(line);
  }
}
// *
// **
// ***
// ****

// Pyramid: row r has (n - r) spaces and (2r - 1) stars.
//    *
//   ***
//  *****`,
        note: "في Dart فيه اختصار <code>'*' * row</code> لتكرار نص، لكن اللوب الداخلي أوضح في التمرين.",
      },
      focus: [{ label: "نصيحة", text: "اكتب جدول: رقم الصف | المسافات | النجوم. بعدها اكتب المعادلة وبعدها الكود." }],
    },
    {
      title: "break و continue والحالات الحدية",
      en: "Early exit and edge cases",
      body: "<p>استخدم <code>break</code> لما تلاقي اللي بتدور عليه، و<code>continue</code> لتخطي حالة لا تهمك. وقبل ما تقول «خلصت» جرب الحالات الحدية دي:</p>",
      points: [
        "الصفر والرقم 1 والرقم السالب.",
        "القايمة الفاضية أو بعنصر واحد.",
        "كل الأرقام متساوية أو كلها سالبة.",
        "أكبر رقم ممكن وأصغر رقم ممكن في المدخل.",
      ],
      code: {
        lang: "dart",
        src: `final out = <int>[];
for (var i = 1; i <= 10; i++) {
  if (i % 3 == 0) continue;   // skip multiples of 3
  if (i > 7) break;           // stop after 7
  out.add(i);
}
print(out);   // [1, 2, 4, 5, 7]`,
        note: "الرقم 8 وصل لـ break قبل ما يتضاف. الأرقام 3 و6 اتخطوا بـ continue.",
      },
      interview: [
        { q: "إيه الفرق بين <code>break</code> و <code>continue</code>؟", a: "<code>break</code> بينهي اللوب كله وبيكمل الكود اللي بعده. <code>continue</code> بيتخطى باقي اللفة الحالية بس ويروح للفة اللي بعدها. في اللوب المتداخل، <code>break</code> بيخرج من اللوب الأقرب بس (الداخلي)، فلو عايز تخرج من الاتنين استخدم flag أو دالة وارجع منها." },
        { q: "اكتب FizzBuzz وفسر ترتيب الشروط.", a: "أعمل loop من 1 لـ n. أفحص الأول <code>i % 15 == 0</code> وأطبع FizzBuzz، وبعده <code>i % 3 == 0</code> لـ Fizz، وبعده <code>i % 5 == 0</code> لـ Buzz، وإلا أطبع i. الترتيب مهم لأن مضاعف 15 هو كمان مضاعف 3 و5، فلو بدأت بـ 3 مش هيوصل لشرط 15. بديل: <code>i % 3 == 0 &amp;&amp; i % 5 == 0</code> في الأول." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: مجموع أرقام عدد",
      lang: "dart",
      code: `int digitSum(int n) {
  var sum = 0;
  while (n > 0) {
    sum += n % 10;
    n ~/= 10;
  }
  return sum;
}

void main() {
  print(digitSum(4821));
}`,
      note: "الناتج 15.",
    },
    {
      title: "اكتب: عدد أولي",
      lang: "dart",
      code: `bool isPrime(int n) {
  if (n < 2) return false;
  for (var i = 2; i * i <= n; i++) {
    if (n % i == 0) return false;
  }
  return true;
}

void main() {
  for (var n = 1; n <= 20; n++) {
    if (isPrime(n)) print(n);
  }
}`,
      note: "بيطبع 2 3 5 7 11 13 17 19، كل واحد في سطر.",
    },
    {
      title: "اكتب: مثلث نجوم",
      lang: "dart",
      code: `void main() {
  for (var row = 1; row <= 4; row++) {
    var line = '';
    for (var col = 0; col < row; col++) {
      line += '*';
    }
    print(line);
  }
}`,
      note: "كل صف بيزود نجمة: 1 ثم 2 ثم 3 ثم 4.",
    },
  ],

  tasks: [
    {
      title: "FizzBuzz كقايمة",
      lang: "dart",
      prompt: "<p>اكتب <code>List&lt;String&gt; fizzBuzz(int n)</code> ترجع قايمة فيها عناصر من 1 إلى n: <code>'Fizz'</code> لمضاعفات 3، <code>'Buzz'</code> لمضاعفات 5، <code>'FizzBuzz'</code> لمضاعفات الاتنين، وغير كده الرقم كنص.</p>",
      examples: [
        { in: "fizzBuzz(5)", out: "[1, 2, Fizz, 4, Buzz]" },
        { in: "fizzBuzz(15).last", out: "FizzBuzz" },
      ],
      starter: `List<String> fizzBuzz(int n) {
  // your code
}`,
      hints: [
        "اعمل قايمة فاضية وضيف فيها جوا for من 1 لـ n.",
        "افحص مضاعف 15 (أو الاتنين معا) قبل 3 و5.",
      ],
      solution: `List<String> fizzBuzz(int n) {
  final out = <String>[];
  for (var i = 1; i <= n; i++) {
    if (i % 15 == 0) {
      out.add('FizzBuzz');
    } else if (i % 3 == 0) {
      out.add('Fizz');
    } else if (i % 5 == 0) {
      out.add('Buzz');
    } else {
      out.add('$i');
    }
  }
  return out;
}`,
      explain: "الإرجاع كقايمة بدل الطباعة بيخلي الدالة سهلة الاختبار. التعقيد O(n). لو n=0 بترجع قايمة فاضية وده سلوك منطقي.",
    },
    {
      title: "هرم من النجوم",
      lang: "dart",
      prompt: "<p>اكتب <code>List&lt;String&gt; pyramid(int n)</code> ترجع n سطر، السطر رقم r (من 1) فيه <code>n - r</code> مسافة ثم <code>2r - 1</code> نجمة (من غير مسافات في الآخر).</p>",
      examples: [
        { in: "pyramid(3)", out: "['  *', ' ***', '*****']" },
      ],
      starter: `List<String> pyramid(int n) {
  // your code
}`,
      hints: [
        "للصف r: مسافات = n - r، نجوم = 2 * r - 1. اكتب الجدول لـ n=3 الأول.",
        "ابني السطر بلوب داخلي أو بـ <code>' ' * (n - r)</code> و <code>'*' * (2 * r - 1)</code>.",
      ],
      solution: `List<String> pyramid(int n) {
  final rows = <String>[];
  for (var r = 1; r <= n; r++) {
    final spaces = ' ' * (n - r);
    final stars = '*' * (2 * r - 1);
    rows.add(spaces + stars);
  }
  return rows;
}`,
      explain: "جدول n=3: r=1: 2 مسافة و1 نجمة، r=2: 1 و3، r=3: 0 و5. الصيغتين هما اللي يتحولوا لكود. في Dart <code>String * int</code> بتكرر النص.",
    },
    {
      title: "رقم متماثل بدون نصوص",
      lang: "dart",
      prompt: "<p>اكتب <code>bool isPalindromeNumber(int n)</code> بترجع true لو الرقم بيتقرأ نفسه من الاتجاهين (121 و1331)، من غير ما تحوله لنص. الأرقام السالبة مش متماثلة.</p>",
      examples: [
        { in: "isPalindromeNumber(121)", out: "true" },
        { in: "isPalindromeNumber(123)", out: "false" },
        { in: "isPalindromeNumber(-121)", out: "false" },
      ],
      hints: [
        "اعكس الرقم بنفس طريقة <code>reverseNumber</code> وقارن مع الأصلي.",
        "خد نسخة من n قبل ما يتغير في اللوب.",
      ],
      solution: `bool isPalindromeNumber(int n) {
  if (n < 0) return false;
  var rest = n;
  var rev = 0;
  while (rest > 0) {
    rev = rev * 10 + rest % 10;
    rest ~/= 10;
  }
  return rev == n;
}`,
      explain: "بنعكس الرقم بالـ % و ~/ ونقارنه بالأصل. لازم نحتفظ بـ n الأصلي لأن اللوب بيستهلك <code>rest</code>. الأرقام اللي بتنتهي بصفر (زي 10) بتطلع false لأن عكسها 1.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `var n = 4821;
var sum = 0;
while (n > 0) {
  sum += n % 10;
  n ~/= 10;
}
print(sum);` },
      answer: ["15"],
      why: "الأرقام 1 ثم 2 ثم 8 ثم 4 وجمعهم 15.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `var n = 1230;
var rev = 0;
while (n > 0) {
  rev = rev * 10 + n % 10;
  n ~/= 10;
}
print(rev);` },
      answer: ["321"],
      why: "الأرقام بتتسحب من الآخر: 0 ثم 3 ثم 2 ثم 1. rev: 0 ثم 3 ثم 32 ثم 321. الصفر الأول بيختفي لأنه بيتضاف لرقم 0.",
    },
    {
      q: "أنهي واحدة صحيحة لطباعة FizzBuzz بشكل مضبوط؟",
      options: [
        "فحص <code>i % 3 == 0</code> الأول، بعدها <code>i % 5</code>، وبعدها <code>i % 15</code>",
        "فحص <code>i % 15 == 0</code> الأول، وبعدها 3 ثم 5",
        "فحص <code>i % 5 == 0</code> الأول، بعدها 15، بعدها 3",
        "ترتيب الشروط مش بيفرق",
      ],
      answer: 1,
      why: "مضاعف 15 هو كمان مضاعف 3 و5، فلازم يتفحص الأول. في الأول والتالت، الرقم 15 هيدخل أول فرع مطابق (Fizz أو Buzz) ومش هيوصل لـ FizzBuzz.",
    },
    {
      q: "كام نجمة (<code>*</code>) تتطبع إجمالا؟",
      code: { lang: "dart", src: `for (var row = 1; row <= 4; row++) {
  var line = '';
  for (var col = 0; col < row; col++) {
    line += '*';
  }
  print(line);
}` },
      answer: ["10"],
      why: "الصفوف فيها 1 و2 و3 و4 نجمة: 1+2+3+4 = 10.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final out = <int>[];
for (var i = 1; i <= 10; i++) {
  if (i % 3 == 0) continue;
  if (i > 7) break;
  out.add(i);
}
print(out);` },
      answer: ["[1, 2, 4, 5, 7]", "[1,2,4,5,7]"],
      why: "3 و6 اتخطوا بـ continue، وعند 8 الشرط i > 7 true فبيعمل break قبل ما يضيف 8.",
    },
    {
      q: "الدالة دي المفروض ترجع أكبر رقم في قايمة. الناتج هنا إيه؟",
      code: { lang: "dart", src: `int maxOf(List<int> nums) {
  var max = 0;
  for (final n in nums) {
    if (n > max) max = n;
  }
  return max;
}

void main() {
  print(maxOf([-5, -2, -9]));
}` },
      options: ["-2", "-5", "0", "خطأ وقت التشغيل"],
      answer: 2,
      why: "max بدأت 0 ولا رقم من القايمة أكبر منها، فبترجع 0 وهو غلط. الإصلاح: <code>var max = nums[0];</code> (مع التعامل مع القايمة الفاضية).",
    },
    {
      q: "اللوب ده بيتنفذ كام مرة؟",
      code: { lang: "dart", src: `var count = 0;
for (var i = 1; i < 100; i *= 2) {
  count++;
}
print(count);` },
      answer: ["7"],
      why: "قيم i: 1 و2 و4 و8 و16 و32 و64 (سبعة)، وبعدها 128 فالشرط false. اللوب اللي بيتضاعف عدّاده تعقيده O(log n).",
    },
    {
      q: "ليه بنوقف فحص الأولية عند <code>i * i &lt;= n</code>؟",
      options: [
        "لأن الأعداد الأولية لازم تبقى مربعات",
        "لأن Dart مبتسمحش بأكتر من كده",
        "عشان الكود يبقى أقصر بس",
        "لأن لو n ليه قاسم أكبر من √n فله قاسم مقابل أصغر منه اتفحص بالفعل",
      ],
      answer: 3,
      why: "لو <code>n = a × b</code> فأحدهم على الأقل ≤ √n. فلو مفيش قاسم لحد √n فمفيش قاسم أبدا. ده بيحول التعقيد من O(n) لـ O(√n).",
    },
    {
      q: "الدالة دي بتعد أرقام عدد. الناتج لـ <code>countDigits(0)</code> إيه؟",
      code: { lang: "dart", src: `int countDigits(int n) {
  var count = 0;
  while (n > 0) {
    count++;
    n ~/= 10;
  }
  return count;
}

void main() {
  print(countDigits(0));
}` },
      answer: ["0"],
      why: "الشرط <code>n &gt; 0</code> false من الأول فاللوب مبيشتغلش وبترجع 0، لكن 0 فيه رقم واحد. حالة حدية لازم تتعامل معاها: <code>if (n == 0) return 1;</code>.",
    },
    {
      q: "عايز تكتب خطة لمسألة «اطبع أول 10 أعداد أولية». إيه أنسب ترتيب للخطوات؟",
      options: [
        "فهم المطلوب، أمثلة، خطة بالكلام، كود، اختبار الحالات الحدية",
        "ابدأ بالكود وصلحه وانت ماشي",
        "اكتب دالة isPrime بس وخلاص",
        "حاول تحفظ الأعداد الأولية وتطبعها",
      ],
      answer: 0,
      why: "الترتيب: افهم، جرب أمثلة (2 و3 و5...)، اكتب خطة (عدّاد وعدد يتزايد وفحص أولية)، ثم الكود، ثم اختبار (مثلا الرقم 1 والرقم 2). البدء بالكود هو سبب أكتر الأخطاء.",
    },
  ],
};
