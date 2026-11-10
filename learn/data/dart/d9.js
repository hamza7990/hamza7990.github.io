window.LEVELS = window.LEVELS || {};
window.LEVELS["dart/d9"] = {
  slides: [
    {
      kicker: "ليه async",
      title: "الـ UI مينفعش يستنى",
      en: "Why asynchronous code",
      body: "<p>Dart بتشغّل كودك على <b>thread واحد</b>. في Flutter ده نفس الـ thread اللي بيرسم الشاشة، وعنده حوالي 16 ملي ثانية لكل frame عشان يفضل 60fps. لو نادينا طلب API بياخد ثانيتين بطريقة «استنى لحد ما يخلص»، الشاشة هتتجمد ثانيتين: المستخدم مش هيعرف يضغط ولا يسكرول.</p><p>الحل مش thread تاني. الحل إن الكود يقول «ابدأ الطلب، وناديني لما يرد»، والـ thread يكمل شغل حاجات تانية في الفترة دي. ده الـ <b>asynchronous programming</b>، والأداة الأساسية فيه <code>Future</code>.</p>",
      points: [
        "الانتظار على الشبكة أو الملفات أو الـ database ما بياخدش CPU، فمفيش داعي نحجز thread عشانه.",
        "ده من أكتر مواضيع إنترفيو Dart: event loop، ترتيب الطباعة، <code>await</code> ناسيها.",
      ],
    },
    {
      title: "Future: وعد بقيمة هتيجي",
      en: "Future and its states",
      body: "<p><code>Future&lt;T&gt;</code> object بيمثل نتيجة عملية لسه ماخلصتش. ليه تلات حالات: <b>uncompleted</b> (لسه شغال)، و<b>completed with a value</b> (خلص بقيمة من النوع <code>T</code>)، أو <b>completed with an error</b> (فشل). الـ Future بيتحول من الأولى للتانية أو التالتة مرة واحدة بس، وبعدها مبيتغيرش.</p>",
      code: {
        lang: "dart",
        src: `Future<String> fetchName() {
  return Future.delayed(const Duration(milliseconds: 100), () => 'Hamza');
}

void main() {
  print('start');
  final f = fetchName();          // returns right away: Future<String>
  print('got a future, no name yet');
  f.then((name) => print('name: $name'));
  print('end of main');
}`,
        note: "الطباعة: start، got a future، end of main، وبعد 100ms تطبع name: Hamza. <code>main</code> مستناش، وده المقصود.",
      },
      terms: [
        ["Future", "وعد بنتيجة", "object بيمثل قيمة هتوصل في المستقبل، أو خطأ."],
        ["completed", "اكتمل", "الـ Future خلص بقيمة أو خطأ ومبيرجعش تاني لحالة الانتظار."],
      ],
    },
    {
      title: "async و await",
      en: "async / await",
      body: "<p><code>await</code> بتخلي الدالة <b>تستنى</b> نتيجة الـ Future وتكمل من بعده، لكن <b>الدالة دي بس</b> هي اللي بتستنى، الـ thread نفسه حر يشتغل حاجات تانية. وأي دالة فيها <code>await</code> لازم تتعلّم <code>async</code>، وبترجع دايما <code>Future</code>: لو كتبت <code>return 5</code> جوه دالة <code>async</code> نوعها <code>Future&lt;int&gt;</code>، والقيمة بتتغلف تلقائي.</p>",
      code: {
        lang: "dart",
        src: `Future<int> fetchScore() async {
  await Future.delayed(const Duration(milliseconds: 50));
  return 42;                         // wrapped into Future<int>
}

Future<void> printScore() async {   // returns nothing useful: Future<void>
  try {
    final score = await fetchScore();
    print('score: $score');
  } catch (e) {
    print('failed: $e');
  }
}

Future<void> main() async {
  print('before');
  await printScore();
  print('after');
}`,
        note: "من غير <code>await printScore()</code> الـ <code>after</code> كانت هتتطبع قبل الـ score.",
      },
      focus: [{ label: "احفظها", text: "<code>async</code> بتخلي الدالة ترجّع <code>Future</code>. و<code>await</code> بتفك الـ Future وتديك القيمة، ومينفعش غير جوه دالة <code>async</code>." }],
      interview: [
        { q: "إيه اللي بيعمله <code>await</code>؟ وهل بيوقف الـ thread؟", a: "<code>await</code> بيوقف تنفيذ الدالة الحالية بس لحد ما الـ Future يخلص، وبيرجعلها القيمة أو يرمي الخطأ. لكن الـ thread مبيتوقفش: الـ event loop بيكمل يشغّل الكود التاني، ولما الـ Future يخلص الدالة بتكمل من نفس السطر. عشان كده الـ UI مبتتجمدش." },
      ],
    },
    {
      title: "then و catchError و whenComplete",
      en: "The callback style",
      body: "<p>قبل <code>await</code> كان الشغل كله بالـ callbacks. لسه بتشوفها في الكود وفي الإنترفيو: <code>.then()</code> بتاخد القيمة وبترجّع Future جديد، و<code>.catchError()</code> بتمسك الخطأ، و<code>.whenComplete()</code> بتشتغل في الحالتين زي <code>finally</code>.</p>",
      code: {
        lang: "dart",
        src: `Future<int> compute() =>
    Future.delayed(const Duration(milliseconds: 10), () => 21);

void main() {
  compute()
      .then((v) => v * 2)
      .then((v) => print('result $v'))
      .catchError((Object e) => print('error $e'))
      .whenComplete(() => print('cleanup'));
}`,
        note: "الناتج: result 42 ثم cleanup. لو أي حلقة رمت خطأ، السلسلة بتقفز لـ <code>catchError</code> وبعدها <code>cleanup</code> برضه.",
      },
      pitfall: "<code>catchError</code> اللي بترجّع قيمة لازم تطابق نوع الـ Future، وإلا خطأ وقت التشغيل. عشان كده في الكود الجديد <code>try/catch</code> مع <code>await</code> أوضح وأأمن.",
      interview: [
        { q: "إيه الفرق بين <code>then</code> و <code>await</code>؟", a: "الاتنين بيستنوا نفس الـ Future. <code>then</code> بتسجل callback بيشتغل لما يخلص، والكود اللي بعدها بيكمل فورا. <code>await</code> بتخلي الدالة تبان إنها بتستنى وتقرا من فوق لتحت، والأخطاء بتتمسك بـ try/catch العادي. في الكود الجديد بفضل <code>async/await</code> لأنه أقصر وأسهل في القراءة والـ debugging، وبستخدم <code>then</code> في حالات صغيرة زي fire-and-forget." },
      ],
    },
    {
      title: "الـ event loop: ترتيب الطباعة",
      en: "Event loop: microtask queue vs event queue",
      body: "<p>Dart عندها طابورين: <b>microtask queue</b> (شغل صغير لازم يخلص بسرعة، والـ async/await بتستخدمه) و<b>event queue</b> (الـ timers، الـ I/O، ضغطات المستخدم، <code>Future()</code> و<code>Future.delayed</code>). الترتيب ثابت:</p><ol><li>الكود العادي في <code>main</code> يخلص كله الأول.</li><li>بعدين الـ event loop يفضّي <b>كل</b> الـ microtask queue.</li><li>بعدين ياخد <b>event واحد</b> من الـ event queue، ويرجع يتأكد إن الـ microtask queue فاضية قبل اللي بعده.</li></ol>",
      code: {
        lang: "dart",
        src: `import 'dart:async';

void main() {
  print('1 main start');
  Future(() => print('5 event: Future()'));
  Future.delayed(Duration.zero, () => print('6 event: delayed zero'));
  scheduleMicrotask(() => print('3 microtask'));
  Future.microtask(() => print('4 Future.microtask'));
  print('2 main end');
}`,
        note: "الأرقام في النص هي الترتيب الحقيقي. الـ microtasks (3 و4) بتسبق أي event حتى لو اتسجلت بعدهم.",
      },
      focus: [{ label: "احفظها", text: "sync الأول، بعده كل الـ microtasks، بعده event واحد واحد. و<code>await</code> على Future جاهز بيكمل في microtask." }],
      interview: [
        { q: "اشرح الـ event loop في Dart. إيه الفرق بين microtask queue و event queue؟", a: "Dart بتشتغل بـ thread واحد وفيه طابورين. الـ microtask queue للشغل القصير اللي لازم يحصل قبل أي حاجة تانية، زي إكمال <code>await</code> أو <code>scheduleMicrotask</code>. والـ event queue للأحداث الخارجية: timers، I/O، ضغطات، <code>Future.delayed</code>. بعد ما <code>main</code> يخلص الـ loop يفضّي الـ microtask queue كلها، وبعدين ياخد event واحد، ويرجع يفضّي الـ microtasks تاني قبل اللي بعده. عشان كده microtask دايما بتسبق أي event." },
        { q: "إيه ترتيب الطباعة: <code>print('A'); Future(() =&gt; print('B')); Future.microtask(() =&gt; print('C')); print('D');</code>؟", a: "A ثم D ثم C ثم B. الكود العادي (A و D) الأول، بعده الـ microtask (C)، وآخر حاجة الـ event (B) لأن <code>Future()</code> بتتجدول في الـ event queue." },
      ],
    },
    {
      title: "Future.wait و any و timeout",
      en: "Combining futures",
      body: "<p><code>Future.wait([...])</code> بتشغّل مجموعة Futures مع بعض وبترجّع قايمة النتائج <b>بنفس ترتيب الإدخال</b> (مش ترتيب الانتهاء). لو واحد فشل: الافتراضي إنها بتستنى الباقي يخلص وبعدين ترمي أول خطأ. مع <code>eagerError: true</code> بترمي فور أول فشل (والباقي بيكمل لوحده). و<code>Future.any</code> بترجّع نتيجة <b>أول</b> واحد يخلص (قيمة أو خطأ). و<code>.timeout()</code> بترمي <code>TimeoutException</code> لو اتأخر، أو بتنفذ <code>onTimeout</code> وترجّع قيمة بديلة.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:async';

Future<int> after(int ms) async {
  await Future.delayed(Duration(milliseconds: ms));
  return ms;
}

Future<void> main() async {
  final all = await Future.wait([after(30), after(5)]);
  print(all);                                  // [30, 5]

  final (a, b) = await (after(5), after(1)).wait;   // Dart 3 records
  print('$a $b');                              // 5 1

  print(await Future.any([after(30), after(5)])); // 5

  try {
    await after(100).timeout(const Duration(milliseconds: 10));
  } on TimeoutException {
    print('too slow');
  }

  final v = await after(100)
      .timeout(const Duration(milliseconds: 10), onTimeout: () => -1);
  print(v);                                    // -1
}`,
        note: "الـ <code>(f1, f2).wait</code> بتحافظ على نوع كل نتيجة (مش <code>List&lt;Object&gt;</code>) وبتحتاج Dart 3.",
      },
      terms: [
        ["eagerError", "ارمي بدري", "<code>Future.wait(..., eagerError: true)</code> بترمي أول خطأ فورا بدل ما تستنى الباقي."],
      ],
      interview: [
        { q: "إيه الفرق بين <code>Future.wait</code> و <code>Future.any</code>؟ وإيه <code>eagerError</code>؟", a: "<code>Future.wait</code> بتستنى كل الـ Futures وبترجّع نتايجهم بترتيب الإدخال، وطول ما كلهم نجحوا مفيش مشكلة. <code>Future.any</code> بترجّع أول واحد يخلص فقط. الـ <code>eagerError</code> في <code>wait</code>: لو false (الافتراضي) بتستنى الباقي يخلص وبعدين ترمي أول خطأ، ولو true بترمي فور أول فشل. في الحالتين الـ Futures التانية مبتتلغيش وبتكمل شغلها." },
      ],
    },
    {
      title: "واحد ورا التاني ولا مع بعض؟",
      en: "Sequential vs parallel",
      body: "<p>غلطة أداء شائعة: تكتب <code>await</code> على طلبين مستقلين ورا بعض، فالتاني مبيبدأش غير لما الأول يخلص. وقتهم بيتجمع. لو الطلبين مش معتمدين على بعض، <b>ابدأهم الاتنين الأول</b> وبعدين استنى.</p>",
      codes: [
        {
          lang: "dart",
          title: "بالتسلسل: A ثم B",
          src: `Future<String> fetch(String name, int ms) async {
  await Future.delayed(Duration(milliseconds: ms));
  print('done $name');
  return name;
}

Future<void> sequential() async {
  final a = await fetch('A', 60);   // B starts only after A
  final b = await fetch('B', 10);
  print([a, b]);
}`,
          note: "الطباعة: done A, done B, [A, B]. الوقت حوالي 70ms.",
        },
        {
          lang: "dart",
          title: "مع بعض",
          src: `Future<void> parallel() async {
  final fa = fetch('A', 60);        // both started now
  final fb = fetch('B', 10);
  final results = await Future.wait([fa, fb]);
  print(results);
}

Future<void> main() async {
  await sequential();
  await parallel();
}`,
          note: "الطباعة: done B, done A, [A, B]. الوقت حوالي 60ms، والنتايج بنفس ترتيب الإدخال.",
        },
      ],
      focus: [{ label: "القاعدة", text: "اعتماد على بعض (محتاج نتيجة الأول) يبقى <code>await</code> واحد ورا التاني. مستقلين؟ ابدأهم مع بعض بـ <code>Future.wait</code>." }],
      interview: [
        { q: "عندك طلبين API مستقلين. إزاي تحمّلهم أسرع؟", a: "أبدأ الاتنين من غير await الأول، وبعدين <code>await Future.wait([a, b])</code> أو الـ record <code>(a, b).wait</code>. كده الوقت الكلي هو أطول واحد فيهم مش مجموعهم. لو التاني محتاج نتيجة الأول لازم تسلسل عادي." },
      ],
    },
    {
      title: "ناسي await",
      en: "Unawaited futures and the bugs they cause",
      body: "<p>لو نادّيت دالة بترجّع <code>Future</code> من غير <code>await</code>، الكود بيكمل قبل ما الشغل يخلص. من هنا بتيجي أنواع bugs: بتقرا بيانات لسه ماتحملتش، أو الخطأ بيطلع من غير ما حد يمسكه، أو الدالة بتخلص والـ UI بيتحدث بحالة قديمة. وفي <code>forEach</code> مع <code>async</code> نفس المشكلة: <code>forEach</code> مش بتستنى الـ Futures.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:async';

final data = <String>[];

Future<void> load() async {
  await Future.delayed(const Duration(milliseconds: 10));
  data.add('office');
}

Future<void> main() async {
  load();                              // forgot await
  print(data.length);                  // 0, not loaded yet

  await Future.delayed(const Duration(milliseconds: 50));
  print(data.length);                  // 1

  for (final i in [1, 2]) {
    await Future.delayed(const Duration(milliseconds: 10));
    print(i);                          // 1 then 2, in order
  }
  [3, 4].forEach((i) async {           // forEach does not wait
    await Future.delayed(const Duration(milliseconds: 10));
    print(i);
  });
  print('done');                       // before 3 and 4
  unawaited(load());                   // on purpose: fire and forget
}`,
        note: "الناتج: 0, 1, 1, 2, done, 3, 4. الأداة <code>unawaited()</code> من <code>dart:async</code> بتقول للقارئ والـ linter «أنا قاصد ماستناش».",
      },
      pitfall: "فعّل الـ lint <code>unawaited_futures</code> في <code>analysis_options.yaml</code>: بيحذرك لما تنادي دالة Future من غير await. لو بتلف على قايمة وعايز تستنى كل عنصر استخدم <code>for ... in</code> مع <code>await</code>، أو <code>Future.wait(list.map(...))</code> لو مستقلين.",
      interview: [
        { q: "إيه المشكلة لو نسيت <code>await</code> قدام دالة بترجّع Future؟", a: "الكود بيكمل فورا من غير ما يستنى النتيجة، فممكن أقرا بيانات لسه ماجتش، والأخطاء بتطلع من غير ما try/catch يمسكها، وممكن الدالة تخلص والعملية لسه شغالة. بكتشفها بالـ lint <code>unawaited_futures</code>. ولو القصد فعلا fire-and-forget بستخدم <code>unawaited(...)</code> عشان يبان إنها مقصودة." },
        { q: "ليه <code>list.forEach((x) async { await ... })</code> مش بتستنى؟", a: "لأن <code>forEach</code> بتنادي الـ callback وبتتجاهل الـ Future اللي بيرجعه، فمبتستناش. الحل <code>for (final x in list) { await ...; }</code> لو عايز بالترتيب، أو <code>await Future.wait(list.map((x) =&gt; ...))</code> لو عايزهم مع بعض." },
      ],
    },
    {
      title: "Completer: Future بإيدك",
      en: "Completer",
      body: "<p>أحيانا بتتعامل مع API قديم بيستخدم callbacks (plugin، SDK)، وعايز تلفه في <code>Future</code>. <code>Completer</code> بيديك Future وإنت اللي بتقرر إمتى تكمّله بقيمة (<code>complete</code>) أو خطأ (<code>completeError</code>). بتكمّله مرة واحدة بس.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:async';

Future<String> askUser() {
  final completer = Completer<String>();
  Timer(const Duration(milliseconds: 20), () {
    completer.complete('yes');      // old callback style finishes here
  });
  return completer.future;
}

Future<void> main() async {
  final answer = await askUser();
  print(answer);                    // yes
}`,
        note: "نادرا بتكتبه بإيدك، لكن ده اللي بتتبنى عليه كتير من الـ plugins، وسؤال إنترفيو معروف.",
      },
    },
  ],

  drills: [
    {
      title: "اكتب: async و try",
      lang: "dart",
      code: `Future<int> loadScore() async {
  await Future.delayed(const Duration(milliseconds: 20));
  return 42;
}

Future<void> main() async {
  try {
    final score = await loadScore();
    print('score $score');
  } catch (e) {
    print('failed: $e');
  }
}`,
    },
    {
      title: "اكتب: Future.wait",
      lang: "dart",
      code: `Future<String> fetch(String name) async {
  await Future.delayed(const Duration(milliseconds: 10));
  return name.toUpperCase();
}

Future<void> main() async {
  final fa = fetch('user');
  final fb = fetch('orders');
  final results = await Future.wait([fa, fb]);
  print(results);
}`,
    },
    {
      title: "اكتب: timeout و Completer",
      lang: "dart",
      code: `import 'dart:async';

Future<String> ask() {
  final c = Completer<String>();
  Timer(const Duration(milliseconds: 20), () => c.complete('yes'));
  return c.future;
}

Future<void> main() async {
  final answer = await ask().timeout(
    const Duration(seconds: 1),
    onTimeout: () => 'no',
  );
  print(answer);
}`,
      note: "<code>onTimeout</code> لازم ترجّع نفس النوع (String هنا).",
    },
  ],

  tasks: [
    {
      title: "حمّل البروفايل مع بعض",
      lang: "dart",
      prompt: "<p>عندك دالتين مستقلتين. اكتب <code>Future&lt;String&gt; loadProfile()</code> بتشغّلهم <b>مع بعض</b> (مش واحدة ورا واحدة) وترجّع نص بالشكل <code>Hamza has 3 orders</code>.</p>",
      examples: [{ in: "await loadProfile()", out: "Hamza has 3 orders" }],
      starter: `Future<String> fetchUser() async {
  await Future.delayed(const Duration(milliseconds: 50));
  return 'Hamza';
}

Future<int> fetchOrderCount() async {
  await Future.delayed(const Duration(milliseconds: 50));
  return 3;
}

// your code`,
      hints: [
        "نادي الدالتين من غير <code>await</code> وخزّن الـ Futures في متغيرين.",
        "<code>(userFuture, countFuture).wait</code> بتديك record فيه القيمتين بأنواعهم، أو استخدم <code>Future.wait</code> وبعدها <code>await</code> لكل واحد.",
      ],
      solution: `Future<String> loadProfile() async {
  final userFuture = fetchUser();
  final countFuture = fetchOrderCount();
  final (user, count) = await (userFuture, countFuture).wait;
  return '$user has $count orders';
}`,
      explain: "الوقت حوالي 50ms مش 100ms، لأن الاتنين بدأوا قبل أول <code>await</code>. الـ record <code>.wait</code> بتخلي <code>user</code> من نوع <code>String</code> و<code>count</code> من نوع <code>int</code> من غير cast، وده الأفضل من <code>Future.wait</code> اللي بترجّع <code>List&lt;Object&gt;</code>.",
    },
    {
      title: "قيمة بديلة لو فشل أو اتأخر",
      lang: "dart",
      prompt: "<p>اكتب <code>Future&lt;String&gt; withFallback(Future&lt;String&gt; Function() load, String fallback, {Duration timeout = const Duration(seconds: 2)})</code>: تنفّذ <code>load()</code>، لو خلص في الوقت ترجّع نتيجته، ولو رمى exception أو عدّى الـ timeout ترجّع <code>fallback</code>.</p>",
      examples: [
        { in: "load takes 10ms, returns 'data'", out: "data" },
        { in: "load throws Exception", out: "fallback value" },
      ],
      hints: [
        "<code>await load().timeout(timeout)</code> بترمي <code>TimeoutException</code> لو اتأخر (وهي Exception).",
        "غلّف ده في <code>try</code> و<code>on Exception</code>، وارجع الـ fallback من الـ catch.",
      ],
      solution: `import 'dart:async';

Future<String> withFallback(
  Future<String> Function() load,
  String fallback, {
  Duration timeout = const Duration(seconds: 2),
}) async {
  try {
    return await load().timeout(timeout);
  } on Exception {
    return fallback;
  }
}`,
      explain: "<code>return await</code> جوه try مهمة: لو كتبت <code>return load().timeout(...)</code> من غير await الدالة هتسلّم الـ Future قبل ما الخطأ يحصل والـ catch ميمسكوش. و<code>on Exception</code> بتمسك <code>TimeoutException</code> وأي exception بس، ومش الـ Errors.",
    },
    {
      title: "شغّلهم بالترتيب",
      lang: "dart",
      prompt: "<p>اكتب <code>Future&lt;List&lt;T&gt;&gt; runInOrder&lt;T&gt;(List&lt;Future&lt;T&gt; Function()&gt; jobs)</code>: تنفّذ كل job <b>بعد ما اللي قبله يخلص</b> (job منهم ميبدأش قبل اللي قبله)، وترجّع نتايجهم بنفس الترتيب.</p>",
      examples: [{ in: "runInOrder([() => a(), () => b()])", out: "[resultOfA, resultOfB]" }],
      hints: [
        "ابدأ بقايمة فاضية <code>final results = &lt;T&gt;[];</code>.",
        "لف بـ <code>for (final job in jobs)</code> و<code>results.add(await job());</code>.",
      ],
      solution: `Future<List<T>> runInOrder<T>(List<Future<T> Function()> jobs) async {
  final results = <T>[];
  for (final job in jobs) {
    results.add(await job());
  }
  return results;
}`,
      explain: "الـ jobs جاية كـ <b>دوال</b> مش Futures، لأن الـ Future بيبدأ يشتغل لما بتناديه. لو كانت Futures جاهزة كانت كلها بدأت قبل ما نوصل لها. الـ <code>await</code> داخل <code>for</code> هي اللي بتخلي كل واحد يستنى اللي قبله.",
    },
  ],

  quiz: [
    {
      q: "ليه Flutter ما بتحجزش الـ thread وتستنى رد الـ API؟",
      options: [
        "لأن Dart مبتدعمش الـ threads خالص",
        "لأن نفس الـ thread بيرسم الشاشة، ولو اتحجز الـ UI هيتجمد",
        "لأن الـ API دايما أسرع من frame واحد",
        "لأن <code>await</code> بتشغّل الكود على جهاز تاني",
      ],
      answer: 1,
      why: "الكود والرسم على نفس الـ thread، فأي انتظار بيحجزه بيمنع الرسم. الحل إن الدالة تتعلّق (<code>await</code>) والـ thread يكمل شغل تاني. Dart فيها isolates بس ده موضوع تاني.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `void main() {
  print('A');
  Future(() => print('B'));
  Future.microtask(() => print('C'));
  print('D');
}`,
      },
      options: ["A D C B", "A B C D", "A C D B", "A D B C"],
      answer: 0,
      why: "A و D كود عادي الأول. بعدها الـ microtask C. وآخر حاجة B لأن <code>Future()</code> بتتجدول في الـ event queue بعد ما الـ microtasks تخلص.",
    },
    {
      q: "الناتج إيه؟ (الترتيب)",
      code: {
        lang: "dart",
        src: `Future<void> task() async {
  print('2');
  await Future<void>.value();
  print('4');
}

void main() {
  print('1');
  task();
  print('3');
}`,
      },
      options: ["1 2 4 3", "1 4 2 3", "2 1 3 4", "1 2 3 4"],
      answer: 3,
      why: "<code>task()</code> بتشتغل لحد أول <code>await</code> بشكل عادي فتطبع <code>2</code>، وبعدها بترجّع الـ Future لـ <code>main</code> اللي بتطبع <code>3</code>. أما <code>4</code> فبتكمل في microtask بعد ما <code>main</code> يخلص.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `Future<void> main() async {
  [1, 2].forEach((i) async {
    await Future.delayed(const Duration(milliseconds: 10));
    print('item $i');
  });
  print('done');
}`,
      },
      options: [
        "item 1, item 2, done",
        "done بس",
        "done, item 1, item 2",
        "item 1, done, item 2",
      ],
      answer: 2,
      why: "<code>forEach</code> مبتستناش الـ Futures اللي بترجعها الـ callbacks، فـ <code>done</code> بتتطبع الأول. الـ event loop يفضل شغال لحد ما الـ timers تخلص، فالعنصرين بيطبعوا بعدها.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `Future<String> slow(String s, int ms) async {
  await Future.delayed(Duration(milliseconds: ms));
  return s;
}

Future<void> main() async {
  final r = await Future.wait([slow('a', 30), slow('b', 5)]);
  print(r);
}`,
      },
      answer: ["[a, b]"],
      why: "<code>Future.wait</code> بترجّع النتايج بترتيب الإدخال مش ترتيب الانتهاء، حتى لو <code>b</code> خلصت الأول.",
    },
    {
      q: "أنهي سطر فيه خطأ كومبايل؟",
      code: {
        lang: "dart",
        src: `Future<int> fetch() async => 42;        // 1
void a() { final x = fetch(); }          // 2
void b() { final y = await fetch(); }    // 3
Future<int> c() => fetch();              // 4`,
      },
      options: ["السطر 1", "السطر 2", "السطر 3", "السطر 4"],
      answer: 2,
      why: "<code>await</code> مينفعش غير جوه دالة معلّمة <code>async</code>، والدالة <code>b</code> مش كده. السطر 2 عادي: <code>x</code> هنا Future (مش متنفذ ولا متستني).",
    },
    {
      q: "الـ event loop في Dart بيعمل إيه بعد ما <code>main</code> يخلص؟",
      options: [
        "ياخد event واحد وبعدها microtask واحدة بالتبادل",
        "يفضّي كل الـ microtask queue الأول، وبعدين ياخد event واحد من الـ event queue",
        "يشغّل الـ event queue كلها وبعدها الـ microtasks",
        "يقفل البرنامج على طول",
      ],
      answer: 1,
      why: "الـ microtasks ليها أولوية: بتتفضى كلها قبل ما ياخد أي event. وبعد كل event بيرجع يتأكد إن مفيش microtasks جديدة. والبرنامج مبيقفلش لو لسه فيه events مستنية (زي timer).",
    },
    {
      q: "إيه اللي بيحصل لو <code>x.timeout(Duration(seconds: 1))</code> اتأخر أكتر من ثانية ومفيش <code>onTimeout</code>؟",
      options: [
        "بترجّع <code>null</code>",
        "بتلغي العملية الأصلية فورا",
        "بتستنى لحد ما تخلص",
        "بترمي <code>TimeoutException</code>",
      ],
      answer: 3,
      why: "من غير <code>onTimeout</code> الـ Future الناتج بيخلص بخطأ <code>TimeoutException</code>. العملية الأصلية نفسها مبتتلغيش وبتكمل في الخلفية.",
    },
    {
      q: "الكود ده بينفذ كام ثانية تقريبا؟",
      code: {
        lang: "dart",
        src: `Future<void> two() => Future.delayed(const Duration(seconds: 2));

Future<void> main() async {
  final a = two();
  final b = two();
  await a;
  await b;
}`,
      },
      options: ["ثانيتين", "4 ثواني", "ثانية واحدة", "صفر"],
      answer: 0,
      why: "الاتنين بدأوا قبل أول <code>await</code> فبيشتغلوا مع بعض، والوقت الكلي هو أطول واحد: ثانيتين. لو كتبت <code>await two(); await two();</code> كان هيبقى 4 ثواني.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `Future<void> main() async {
  try {
    await Future<int>.error('x').whenComplete(() => print('cleanup'));
  } catch (e) {
    print('caught $e');
  }
}`,
      },
      options: ["caught x ثم cleanup", "cleanup ثم caught x", "caught x بس", "cleanup بس والبرنامج يقع"],
      answer: 1,
      why: "<code>whenComplete</code> بتشتغل في النجاح والفشل زي <code>finally</code> وبتعدّي الخطأ لقدام، فـ <code>cleanup</code> الأول وبعدها الـ catch تمسك الخطأ.",
    },
  ],
};
