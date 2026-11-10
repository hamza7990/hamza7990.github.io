window.LEVELS = window.LEVELS || {};
window.LEVELS["warmup/w9"] = {
  slides: [
    {
      kicker: "ليه التكرار الذاتي",
      title: "دالة بتنادي نفسها على مسألة أصغر",
      en: "Recursion",
      body: "<p>التكرار الذاتي (recursion) معناه إن الدالة تحل المسألة بإنها تنادي نفسها على نسخة <b>أصغر</b> من نفس المسألة، لحد ما توصل لحالة بسيطة جدا تعرف إجابتها. هو مش سحر، هو بس طريقة تانية لعمل لوب، لكنه بيخلي مسائل معينة (الفولدرات، الـ JSON المتداخل، الـ widget tree في Flutter، الأشجار) أسهل بكتير.</p><p>أي دالة recursive لازم يكون فيها حاجتين:</p>",
      points: [
        "<b>Base case</b> (الحالة الأساسية): الحالة اللي بترجع إجابة مباشرة من غير ما تنادي نفسها. من غيرها الدالة بتنادي نفسها للأبد.",
        "<b>Recursive case</b>: بتنادي نفسها على مدخل أقرب للـ base case (أصغر أو أقصر).",
      ],
      code: {
        lang: "dart",
        src: `int factorial(int n) {
  if (n <= 1) return 1;          // base case
  return n * factorial(n - 1);   // recursive case: smaller problem
}

void main() {
  print(factorial(5));   // 120
  print(factorial(0));   // 1
}`,
        note: "<code>5! = 5 × 4 × 3 × 2 × 1</code>. وده نفسه <code>5 × 4!</code>. فالمسألة الكبيرة اتحولت لأصغر منها بواحد.",
      },
      focus: [{ label: "احفظها", text: "قبل ما تكتب أي سطر: (1) إيه الـ base case؟ (2) كل نداء بيقرّب من الـ base case إزاي؟" }],
    },
    {
      title: "الـ call stack خطوة بخطوة",
      en: "The call stack",
      body: "<p>لما دالة تنادي دالة، Dart بتحط «إطار» (frame) جديد على <b>stack</b> فيه قيم المتغيرات المحلية. الدالة المنادية بتستنى. لما الدالة اللي فوق ترجع، الإطار بتاعها بيتشال والتي تحتها تكمل من مكانها. تتبع <code>factorial(4)</code>:</p>",
      codes: [
        {
          lang: "text",
          title: "push ثم pop",
          src: `push  factorial(4)   n=4  needs 4 * factorial(3)
push  factorial(3)   n=3  needs 3 * factorial(2)
push  factorial(2)   n=2  needs 2 * factorial(1)
push  factorial(1)   n=1  base case: returns 1
pop   factorial(2)   returns 2 * 1 = 2
pop   factorial(3)   returns 3 * 2 = 6
pop   factorial(4)   returns 4 * 6 = 24`,
        },
        {
          lang: "text",
          title: "شكل الـ stack (الأعلى هو اللي بيشتغل)",
          src: `after push 3     after push 4     after first pop
                 |  f(1) n=1  |
                 |  f(2) n=2  |   |  f(2) n=2  |
|  f(3) n=3  |   |  f(3) n=3  |   |  f(3) n=3  |
|  f(4) n=4  |   |  f(4) n=4  |   |  f(4) n=4  |
+------------+   +------------+   +------------+`,
        },
      ],
      pitfall: "المبتدئ بيتخيل إن الحساب بيحصل وهو نازل. الحقيقة إن الضرب بيحصل وهو <b>طالع</b> (عند الـ pop). على طريق النزول بس بنجهز الأطفال. ده بيفسر ليه ترتيب الطباعة قبل وبعد النداء الذاتي مختلف.",
      interview: [
        { q: "اشرح إزاي الـ call stack بيشتغل مع دالة recursive.", a: "كل نداء بيضيف frame جديد فوق الـ stack فيه المتغيرات المحلية والمكان اللي هيرجع له. الدالة اللي نادت بتستنى. لما نوصل للـ base case الدالة بترجع قيمة والـ frame بيتشال، والدالة اللي تحته تكمل وتحسب باستخدام القيمة اللي رجعت. عشان كده عمق الـ recursion بياخد مساحة على الـ stack بحجم العمق.",
        },
      ],
    },
    {
      title: "مجموع قايمة وأس رقم",
      en: "Sum of a list and power",
      body: "<p>الفكرة في القوائم: مجموع القايمة = أول عنصر + مجموع الباقي. بدل ما نعمل نسخ جديدة من القايمة، بنمرر <b>index</b> بيتحرك. الـ base case هو إن الـ index وصل للآخر. وفي الأس: <code>b^e = b × b^(e-1)</code>، وتحسين ذكي: <code>b^e = (b^(e/2))²</code> وده بيقلل عدد النداءات من e لـ log e.</p>",
      code: {
        lang: "dart",
        src: `int sumList(List<int> a, [int i = 0]) {
  if (i == a.length) return 0;      // base: nothing left
  return a[i] + sumList(a, i + 1);
}

int power(int base, int exp) {
  if (exp == 0) return 1;
  return base * power(base, exp - 1);
}

int fastPower(int base, int exp) {
  if (exp == 0) return 1;
  final half = fastPower(base, exp ~/ 2);
  return exp.isEven ? half * half : half * half * base;
}

void main() {
  print(sumList([3, 4, 5]));   // 12
  print(sumList([]));          // 0
  print(power(2, 10));         // 1024
  print(fastPower(2, 10));     // 1024
  print(fastPower(3, 5));      // 243
}`,
        note: "<code>fastPower(2, 10)</code> بتنادي نفسها على 5 ثم 2 ثم 1 ثم 0: أربع نداءات بس، بدل عشرة.",
      },
      interview: [
        { q: "اكتب دالة recursive لحساب مجموع عناصر قايمة وقولي إيه الـ base case.", a: "الـ base case هو إن الـ index وصل لطول القايمة، فالمجموع 0. غير كده بيرجع <code>a[i] + sumList(a, i + 1)</code>. بمرر الـ index بدل ما أعمل <code>sublist</code> جديدة في كل نداء لأن النسخ كان هيخلي الحل O(n²). التعقيد O(n) زمن، ومساحة O(n) على الـ stack. وبصراحة اللوب هنا أبسط وأأمن.",
        },
      ],
    },
    {
      title: "Fibonacci الساذج وليه بطيء",
      en: "Naive fibonacci",
      body: "<p>تسلسل فيبوناتشي: كل رقم هو مجموع اللي قبله بواحد واتنين: <code>0, 1, 1, 2, 3, 5, 8...</code>. التعريف recursive طبيعي، لكن لو كتبته مباشرة بتحصل مصيبة: <code>fib(5)</code> بينادي <code>fib(4)</code> و <code>fib(3)</code>، و<code>fib(4)</code> برضه بينادي <code>fib(3)</code>. نفس الحسبة بتتعاد مرات كتير.</p>",
      code: {
        lang: "dart",
        src: `int calls = 0;

int fib(int n) {
  calls++;
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

void main() {
  print(fib(10));   // 55
  print(calls);     // 177 calls just for fib(10)
  calls = 0;
  print(fib(30));   // 832040
  print(calls);     // 2692537 calls for fib(30)
}`,
        note: "كل ما n يزيد بواحد، عدد النداءات تقريبا بيتضاعف: التعقيد حوالي O(2ⁿ). <code>fib(50)</code> بالطريقة دي ممكن ياخد دقايق.",
      },
      codes: [
        {
          lang: "text",
          title: "شجرة النداءات لـ fib(5): fib(3) اتحسبت مرتين و fib(2) تلات مرات",
          src: `                  fib(5)
             /            \\
         fib(4)            fib(3)
        /      \\          /      \\
    fib(3)    fib(2)   fib(2)    fib(1)
    /   \\     /   \\    /   \\
 fib(2) fib(1) f(1) f(0) f(1) f(0)
 /   \\
f(1) f(0)`,
        },
      ],
      interview: [
        { q: "ليه fibonacci الـ recursive العادي بطيء؟", a: "لأن كل نداء بيطلع نداءين، ونفس القيم (زي <code>fib(3)</code>) بتتحسب من الأول عشرات المرات. عدد النداءات بيتضاعف تقريبا مع كل زيادة في n فالتعقيد حوالي O(2ⁿ) أسي. الحل إني أخزن النتائج اللي حسبتها (memoization) أو أحسبها من تحت لفوق بلوب، فيبقى O(n).",
        },
      ],
    },
    {
      title: "Memoization: متحسبش مرتين",
      en: "Memoization",
      body: "<p>Memoization معناها: قبل ما تحسب، شوف هل حسبتها قبل كده في <code>Map</code>. لو أيوه ارجع النتيجة المخزنة. لو لأ، احسب وخزن وارجع. نفس الدالة بنفس المنطق، بس كل قيمة بتتحسب مرة واحدة فقط.</p>",
      code: {
        lang: "dart",
        src: `final memo = <int, int>{};

int fibMemo(int n) {
  if (n < 2) return n;
  final cached = memo[n];
  if (cached != null) return cached;
  final result = fibMemo(n - 1) + fibMemo(n - 2);
  memo[n] = result;
  return result;
}

// Bottom-up: no recursion, no stack
int fibLoop(int n) {
  var a = 0;
  var b = 1;
  for (var i = 0; i < n; i++) {
    final next = a + b;
    a = b;
    b = next;
  }
  return a;
}

void main() {
  print(fibMemo(50));   // 12586269025
  print(fibLoop(50));   // 12586269025
  print(fibLoop(0));    // 0
}`,
        note: "بقت O(n) زمن (كل قيمة من 2 إلى n بتتحسب مرة) ومساحة O(n) للـ Map والـ stack. الـ loop بنفس السرعة ومساحته O(1).",
      },
      focus: [{ label: "احفظها", text: "Memoization = recursion + Map. بتنفع لما نفس المدخلات بتتكرر في النداءات (overlapping subproblems)." }],
      interview: [
        { q: "إيه هو memoization وإزاي بتحسّن fibonacci؟", a: "هو إني أخزن نتيجة كل نداء في Map بمفتاح المدخل. قبل أي حساب أشوف الـ Map: لو لقيت النتيجة أرجعها فورا. كده كل قيمة من 0 إلى n بتتحسب مرة واحدة فالتعقيد يتحول من O(2ⁿ) لـ O(n) زمن مقابل O(n) مساحة. وبديل من غير recursion هو الحل bottom-up بلوب ومتغيرين، O(n) زمن و O(1) مساحة.",
        },
      ],
    },
    {
      title: "عكس نص وبحث ثنائي بالتكرار الذاتي",
      en: "Reverse a string and binary search",
      body: "<p><b>عكس نص</b>: عكس النص = عكس الباقي (من الحرف التاني) + الحرف الأول. الـ base case: نص طوله 0 أو 1 هو نفسه.</p><p><b>البحث الثنائي</b> في قايمة مرتبة: قارن مع العنصر اللي في النص. لو أصغر من المطلوب، دور في النص اليمين. لو أكبر، النص الشمال. كل نداء بيقلل المدى للنص. الـ base case: المدى فاضي (<code>lo &gt; hi</code>) يعني مش موجود.</p>",
      code: {
        lang: "dart",
        src: `String reverse(String s) {
  if (s.length <= 1) return s;
  return reverse(s.substring(1)) + s[0];
}

int binarySearch(List<int> a, int target, [int lo = 0, int? hi]) {
  final high = hi ?? a.length - 1;
  if (lo > high) return -1;                 // empty range: not found
  final mid = (lo + high) ~/ 2;
  if (a[mid] == target) return mid;
  if (a[mid] < target) {
    return binarySearch(a, target, mid + 1, high);
  }
  return binarySearch(a, target, lo, mid - 1);
}

void main() {
  print(reverse('abc'));                       // cba
  print(reverse(''));                          // (empty line)
  print(binarySearch([1, 3, 5, 7, 9], 7));     // 3
  print(binarySearch([1, 3, 5, 7, 9], 4));     // -1
  print(binarySearch([], 4));                  // -1
}`,
        note: "البحث الثنائي O(log n) لأن المدى بيتقسم على اتنين. عكس النص recursive هنا O(n²) بسبب نسخ <code>substring</code>، فاللوب أفضل في الأداء.",
      },
      interview: [
        { q: "اكتب binary search بالـ recursion. ولازم القايمة تبقى إيه؟", a: "لازم القايمة تبقى <b>مرتبة</b>. بحسب <code>mid</code>، لو العنصر اللي فيه يساوي المطلوب أرجع index. لو أصغر أدور في النص اليمين (<code>mid + 1</code> لـ hi)، ولو أكبر أدور في الشمال (lo لـ <code>mid - 1</code>). لو <code>lo &gt; hi</code> يبقى مش موجود وأرجع -1. كل نداء بيقسم المدى للنص فالتعقيد O(log n). ملاحظة: بشيل mid من المدى الجديد (±1)، ولو نسيت ده بيحصل recursion للأبد.",
        },
      ],
    },
    {
      title: "امتى الـ loop أحسن؟ و Stack Overflow",
      en: "Loop vs recursion, stack overflow",
      body: "<p>كل نداء بياخد frame من الـ stack، والـ stack حجمه محدود. لو العمق كبير جدا أو نسيت الـ base case، Dart بترمي <code>StackOverflowError</code>. Dart مبتحسنش recursion الذيل (tail recursion) أوتوماتيك، فمتعتمدش عليه.</p>",
      code: {
        lang: "dart",
        src: `int countDown(int n) => n == 0 ? 0 : 1 + countDown(n - 1);

int noBase(int n) => noBase(n - 1) + 1;   // no base case

int countLoop(int n) {
  var c = 0;
  for (var i = 0; i < n; i++) {
    c++;
  }
  return c;
}

void main() {
  print(countDown(1000));      // 1000
  try {
    print(countDown(100000000));
  } on StackOverflowError {
    print('stack overflow');   // too deep
  }
  try {
    print(noBase(5));
  } on StackOverflowError {
    print('no base case');     // never stops
  }
  print(countLoop(100000000)); // 100000000, no problem
}`,
        note: "عمق الـ recursion الآمن بيتحدد بحجم الـ stack، لكن مئات الألوف قريبة من الخطر. اللوب مفيهوش المشكلة دي.",
      },
      points: [
        "<b>الـ loop أحسن</b> لما المسألة خطية وبسيطة (مجموع، عدّ، factorial) أو العمق ممكن يكون كبير.",
        "<b>الـ recursion أحسن</b> لما الداتا شجرية أو متداخلة (فولدرات، JSON، widget tree)، أو المسألة بتتقسم لمسائل أصغر (binary search، merge sort).",
        "كل recursion ممكن يتحول لـ loop (أحيانا بـ stack يدوي)، والعكس صحيح.",
      ],
      interview: [
        { q: "إيه هو Stack Overflow وإزاي تتجنبه؟", a: "هو إن الـ call stack يمتلي لأن الـ recursion عمقها أكبر من حجم الـ stack المتاح، عادة بسبب نسيان الـ base case أو مدخل كبير جدا. في Dart بيرمي <code>StackOverflowError</code>. بتجنبه بإني أتأكد إن كل نداء بيقرب من الـ base case، وأحول الحل للوب لو العمق ممكن يكون كبير، أو أستخدم stack يدوي.",
        },
        { q: "امتى تفضل recursion على loop؟", a: "لما الداتا نفسها متداخلة زي الفولدرات أو الـ JSON أو الأشجار، لأن الكود recursive بيطابق شكل الداتا وبيبقى أقصر وأوضح. ولما المسألة بتتقسم لأجزاء أصغر زي binary search. ولما العمق صغير ومضمون. لو الحل خطي وبسيط أو العمق كبير بستخدم loop.",
        },
      ],
    },
    {
      title: "مثال يستاهل: تسطيح قايمة متداخلة",
      en: "Recursion on nested data",
      body: "<p>هنا الـ recursion بيبان بجد: قايمة فيها أرقام أو قوايم تانية، وجوه القوايم قوايم تانية بعمق مجهول. مفيش عدد ثابت من اللوبات يحل ده. الخطة: لف على العناصر، لو العنصر قايمة نادي نفس الدالة عليه، ولو رقم ضيفه.</p>",
      code: {
        lang: "dart",
        src: `List<int> flatten(List<dynamic> items) {
  final out = <int>[];
  for (final x in items) {
    if (x is List) {
      out.addAll(flatten(x));    // recursive case
    } else {
      out.add(x as int);         // base case: a plain number
    }
  }
  return out;
}

void main() {
  print(flatten([1, [2, [3, 4]], 5]));  // [1, 2, 3, 4, 5]
  print(flatten([]));                   // []
  print(flatten([[], [[]]]));           // []
}`,
        note: "نفس الفكرة اللي بتتعمل في Flutter لما تعدي على شجرة widgets، أو في Laravel لما تعدي على فولدر وفولدراته الفرعية.",
      },
      interview: [
        { q: "اكتب دالة تسطّح قايمة متداخلة، وليه recursion هنا مناسبة؟", a: "بلف على العناصر: لو العنصر <code>List</code> بنادي الدالة عليه وأضيف النتيجة، ولو رقم أضيفه. recursion مناسبة لأن عمق التداخل مجهول ومفيش عدد ثابت من اللوبات يغطيه، والكود بيطابق شكل الداتا. التعقيد O(n) على إجمالي العناصر، ومساحة الـ stack بقدر أقصى عمق تداخل.",
        },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: factorial",
      lang: "dart",
      code: `int factorial(int n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

void main() {
  print(factorial(5));
  print(factorial(0));
}`,
      note: "120 ثم 1.",
    },
    {
      title: "اكتب: fibonacci بـ memo",
      lang: "dart",
      code: `final memo = <int, int>{};

int fibMemo(int n) {
  if (n < 2) return n;
  final cached = memo[n];
  if (cached != null) return cached;
  final result = fibMemo(n - 1) + fibMemo(n - 2);
  memo[n] = result;
  return result;
}

void main() {
  print(fibMemo(50));
}`,
      note: "الناتج 12586269025.",
    },
    {
      title: "اكتب: binary search recursive",
      lang: "dart",
      code: `int search(List<int> a, int t, int lo, int hi) {
  if (lo > hi) return -1;
  final mid = (lo + hi) ~/ 2;
  if (a[mid] == t) return mid;
  if (a[mid] < t) return search(a, t, mid + 1, hi);
  return search(a, t, lo, mid - 1);
}

void main() {
  final xs = [1, 3, 5, 7, 9];
  print(search(xs, 7, 0, xs.length - 1));
}`,
      note: "الناتج 3. نسخة بدون الـ parameters الاختيارية، أبسط في الكتابة.",
    },
  ],

  tasks: [
    {
      title: "الأس بالـ recursion",
      lang: "dart",
      prompt: "<p>اكتب <code>int power(int base, int exp)</code> بالـ recursion (<code>exp &gt;= 0</code>). حاول تخليها تستخدم تقسيم الأس على 2 بدل النقص بواحد، عشان عدد النداءات يبقى حوالي log(exp).</p>",
      examples: [
        { in: "power(2, 10)", out: "1024" },
        { in: "power(5, 0)", out: "1" },
        { in: "power(3, 5)", out: "243" },
      ],
      starter: `int power(int base, int exp) {
  // your code
}`,
      hints: [
        "الـ base case: أي رقم أس 0 يساوي 1.",
        "احسب <code>half = power(base, exp ~/ 2)</code>. لو exp زوجي النتيجة <code>half * half</code>، ولو فردي ضرب فيها <code>base</code> كمان مرة.",
      ],
      solution: `int power(int base, int exp) {
  if (exp == 0) return 1;
  final half = power(base, exp ~/ 2);
  if (exp.isEven) return half * half;
  return half * half * base;
}`,
      explain: "كل نداء بيقسم الأس على 2 فعدد النداءات حوالي log₂(exp): O(log exp). لاحظ إننا نادينا <code>power</code> مرة واحدة وخزنّا الناتج في <code>half</code>. لو كتبت <code>power(...) * power(...)</code> كنت هتحسب النصف مرتين وتضيع الفايدة.",
    },
    {
      title: "Palindrome بالـ recursion",
      lang: "dart",
      prompt: "<p>اكتب <code>bool isPalindrome(String s)</code> بالـ recursion من غير لوب: قارن أول حرف بآخر حرف، وبعدين نادي نفسك على اللي بينهم. (مفيش اعتبار للمسافات أو حالة الحروف.)</p>",
      examples: [
        { in: "isPalindrome('level')", out: "true" },
        { in: "isPalindrome('abca')", out: "false" },
        { in: "isPalindrome('')", out: "true" },
      ],
      starter: `bool isPalindrome(String s) {
  // your code
}`,
      hints: [
        "الـ base case: نص طوله 0 أو 1 هو palindrome.",
        "لو <code>s[0] != s[s.length - 1]</code> ارجع false. غير كده نادي على <code>s.substring(1, s.length - 1)</code>.",
      ],
      solution: `bool isPalindrome(String s) {
  if (s.length <= 1) return true;
  if (s[0] != s[s.length - 1]) return false;
  return isPalindrome(s.substring(1, s.length - 1));
}`,
      explain: "كل نداء بيشيل حرفين فعدد النداءات n/2. الـ base case بيغطي النص الفاضي والحرف الواحد (النص الفردي بيوصل لحرف واحد في النص). التعقيد O(n²) بسبب نسخ substring، واللوب بمؤشرين أحسن (O(n)).",
    },
    {
      title: "Binary search بالـ recursion",
      lang: "dart",
      prompt: "<p>اكتب <code>int binarySearch(List&lt;int&gt; a, int target)</code> ترجع index العنصر في قايمة مرتبة، أو -1 لو مش موجود. استخدم دالة مساعدة recursive جواها (<code>lo</code> و<code>hi</code>).</p>",
      examples: [
        { in: "binarySearch([1, 3, 5, 7, 9], 9)", out: "4" },
        { in: "binarySearch([1, 3, 5, 7, 9], 2)", out: "-1" },
        { in: "binarySearch([], 1)", out: "-1" },
      ],
      starter: `int binarySearch(List<int> a, int target) {
  int search(int lo, int hi) {
    // your code
  }
  return search(0, a.length - 1);
}`,
      hints: [
        "الـ base case: <code>lo &gt; hi</code> معناها مفيش مدى، يعني -1.",
        "<code>mid = (lo + hi) ~/ 2</code>. لو أصغر من target ابحث في <code>mid + 1</code> إلى hi، وإلا في lo إلى <code>mid - 1</code>.",
      ],
      solution: `int binarySearch(List<int> a, int target) {
  int search(int lo, int hi) {
    if (lo > hi) return -1;
    final mid = (lo + hi) ~/ 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) return search(mid + 1, hi);
    return search(lo, mid - 1);
  }
  return search(0, a.length - 1);
}`,
      explain: "دالة داخلية بتشوف <code>a</code> و<code>target</code> من الدالة الأم فمش محتاجين نمررهم. O(log n) زمن ومساحة stack O(log n). كان ممكن بلوب while وبمساحة O(1).",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `int factorial(int n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

void main() {
  print(factorial(5));
}` },
      answer: ["120"],
      why: "5 × 4 × 3 × 2 × 1 = 120. الضرب بيحصل وهو طالع من الـ base case: 1 ثم 2 ثم 6 ثم 24 ثم 120.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `String f(int n) {
  if (n == 0) return '';
  return f(n - 1) + n.toString();
}

void main() {
  print(f(4));
}` },
      answer: ["1234"],
      why: "النداء الذاتي بيرجع الأول: f(0) فاضي، f(1) = '1'، f(2) = '12'، f(3) = '123'، f(4) = '1234'. لو كتبنا <code>n.toString() + f(n - 1)</code> كان الناتج 4321.",
    },
    {
      q: "إيه الغلط في الدالة دي؟",
      code: { lang: "dart", src: `int total(int n) => total(n - 1) + n;` },
      options: [
        "لازم تكون <code>void</code>",
        "الـ recursion ممنوعة في Dart",
        "مفيش base case فهتنادي نفسها لحد ما يحصل <code>StackOverflowError</code>",
        "لازم تضرب مش تجمع",
      ],
      answer: 2,
      why: "من غير <code>if (n == 0) return 0;</code> مفيش حالة بترجع من غير نداء، فالـ stack بيمتلي. الـ recursion مسموحة، والجمع صح لمجموع 1..n.",
    },
    {
      q: "الدالة دي بتعد كام نداء للـ <code>fib</code> (كل النداءات اللي بتتعمل بما فيها الأولى)؟",
      code: { lang: "dart", src: `int calls = 0;

int fib(int n) {
  calls++;
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

void main() {
  fib(4);
  print(calls);
}` },
      answer: ["9"],
      why: "fib(4) ينادي fib(3) و fib(2). fib(3) ينادي fib(2) و fib(1). fib(2) كل مرة ينادي fib(1) و fib(0). العدد الكلي: 9 نداءات، وfib(2) اتحسبت مرتين.",
    },
    {
      q: "ليه fibonacci الـ recursive العادي بطيء جدا لـ <code>n = 40</code>؟",
      options: [
        "لأن الـ recursion دايما أبطأ من الـ loop بعشرة أضعاف",
        "لأن نفس القيم الفرعية بتتحسب من الصفر مرات كتير، وعدد النداءات بيتضاعف تقريبا مع كل زيادة",
        "لأن Dart بتفحص الـ base case ببطء",
        "لأن الأرقام كبيرة جدا على الـ int",
      ],
      answer: 1,
      why: "المشكلة في التكرار المهدور (overlapping subproblems): fib(38) مثلا بتتحسب مئات المرات. حل ده بالـ memoization أو بلوب. الـ recursion عموما أبطأ بقدر بسيط بس، مش بالأسس.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `int power(int base, int exp) {
  if (exp == 0) return 1;
  final half = power(base, exp ~/ 2);
  return exp.isEven ? half * half : half * half * base;
}

void main() {
  print(power(2, 5));
}` },
      answer: ["32"],
      why: "power(2,5) بتحسب half = power(2,2). وpower(2,2) بتحسب half = power(2,1) = 2 (لأن power(2,1): half = 1 والأس فردي فالنتيجة 1*1*2). يبقى power(2,2) = 2*2 = 4، والأس 5 فردي فالنتيجة 4*4*2 = 32.",
    },
    {
      q: "أنهي مسألة recursion فيها أنسب من loop؟",
      options: [
        "عدّ كل الملفات داخل فولدر فيه فولدرات فرعية بعمق غير معروف",
        "جمع الأرقام من 1 لـ 1,000,000",
        "طباعة الأرقام من 1 لـ 10",
        "إيجاد أكبر رقم في قايمة",
      ],
      answer: 0,
      why: "الفولدرات متداخلة بعمق مجهول فالـ recursion بتطابق شكل الداتا. الباقي مسائل خطية بسيطة، واللوب فيها أبسط وأأمن (مليون نداء ممكن يوصل لـ stack overflow).",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `int binarySearch(List<int> a, int target, [int lo = 0, int? hi]) {
  final high = hi ?? a.length - 1;
  if (lo > high) return -1;
  final mid = (lo + high) ~/ 2;
  if (a[mid] == target) return mid;
  if (a[mid] < target) {
    return binarySearch(a, target, mid + 1, high);
  }
  return binarySearch(a, target, lo, mid - 1);
}

void main() {
  print(binarySearch([1, 3, 5, 7, 9], 7));
}` },
      answer: ["3"],
      why: "المدى 0..4: mid=2 (القيمة 5 أصغر من 7) فبندور في 3..4. mid=3 والقيمة 7 فنرجع index 3.",
    },
    {
      q: "إيه اللي بيحصل لما تنادي دالة recursive بعمق 100 مليون في Dart؟",
      options: [
        "بيشتغل عادي لأن Dart بتحول الـ recursion لـ loop",
        "بيرمي <code>RangeError</code>",
        "بيوقف الحلقة من غير أي خطأ",
        "بيرمي <code>StackOverflowError</code> لأن الـ stack اتملى",
      ],
      answer: 3,
      why: "كل نداء بياخد frame ومحدود بحجم الـ stack. Dart مبتعملش tail-call optimization. الحل: loop أو stack يدوي.",
    },
    {
      q: "كام مفتاح هيبقى في الـ Map بعد النداء ده؟",
      code: { lang: "dart", src: `final memo = <int, int>{};

int fibMemo(int n) {
  if (n < 2) return n;
  final cached = memo[n];
  if (cached != null) return cached;
  final result = fibMemo(n - 1) + fibMemo(n - 2);
  memo[n] = result;
  return result;
}

void main() {
  fibMemo(6);
  print(memo.length);
}` },
      answer: ["5"],
      why: "الـ base cases (0 و1) بترجع من غير تخزين. بيتخزن 2 و3 و4 و5 و6: خمس مفاتيح. وكل واحد اتحسب مرة واحدة.",
    },
  ],
};
