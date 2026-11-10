window.LEVELS = window.LEVELS || {};
window.LEVELS["dart/d8"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "التطبيق الحقيقي بيفشل كل يوم",
      en: "Why error handling matters",
      body: "<p>النت بيقطع، السيرفر بيرد بـ 500، المستخدم بيكتب «abc» في خانة الرقم، الملف مش موجود. ده مش استثناء نادر، ده الشغل اليومي. الفرق بين تطبيق محترف وتطبيق هاوي إن الأول <b>بيتوقع</b> الفشل ويعرض رسالة مفهومة، والتاني بيقفل في وش المستخدم.</p><p>في المستوى ده هتتعلم تفرّق بين نوعين من المشاكل، تمسك اللي يستاهل يتمسك، وتصمم أخطاءك بنفسك.</p>",
      points: [
        "إنترفيو Flutter بيسأل: <code>Exception</code> ولا <code>Error</code>؟ وإيه بيحصل لو الـ <code>Future</code> فشل؟",
        "كل طبقة data في تطبيقك (repository, API) هتحتاج الحاجات دي.",
      ],
    },
    {
      title: "Exception مقابل Error",
      en: "Exception vs Error",
      body: "<p>Dart بتقسم المشاكل لنوعين. <b><code>Exception</code></b>: حاجة <b>متوقعة</b> ممكن تحصل في برنامج سليم (نت قطع، نص مش رقم)، وإنت المفروض تتعامل معاها. <b><code>Error</code></b>: <b>غلطة برمجية</b> (bug): قيمة null غلط، index برا القايمة، ميثود مش موجودة. الـ Error معناه «الكود ده غلط»، مش «الظروف سيئة».</p>",
      code: {
        lang: "dart",
        src: `void main() {
  try {
    int.parse('abc');
  } on FormatException catch (e) {
    print('Exception: \${e.runtimeType}');
  }

  final list = [1, 2, 3];
  try {
    print(list[5]);
  } on RangeError catch (e) {
    print('Error: \${e.runtimeType}');   // a bug in our code
  }
}`,
        note: "<code>FormatException</code> بتنفّذ <code>Exception</code>. <code>RangeError</code> بتمد <code>Error</code>: الحل مش إنك تمسكها، الحل إنك تصلّح الـ index.",
      },
      terms: [
        ["Exception", "استثناء متوقع", "ظرف خارجي ممكن يحصل: IO، شبكة، input غلط. تتمسك وتتعالج."],
        ["Error", "خطأ برمجي", "bug في الكود (StateError, RangeError, TypeError). تصلّحه، متمسكوش."],
      ],
      focus: [{ label: "احفظها", text: "ماسك <code>Exception</code> عشان تتعامل معاه، وسايب <code>Error</code> يوقع التطبيق في التطوير عشان تشوف الـ bug وتصلحه." }],
      pitfall: "<code>catch (e)</code> من غير <code>on</code> بتمسك أي حاجة، حتى الـ Error. ولو دفنت bug برمجي جوه catch هتفضل تدور عليه ساعات. امسك النوع اللي بتتوقعه: <code>on FormatException</code>.",
      interview: [
        { q: "إيه الفرق بين <code>Exception</code> و <code>Error</code> في Dart؟ وليه مبنمسكش الـ Error؟", a: "<code>Exception</code> بيمثّل حالة متوقعة ممكن تحصل في برنامج سليم زي فشل شبكة أو input غلط، فبنمسكه ونتعامل معاه. <code>Error</code> بيمثّل bug برمجي زي <code>RangeError</code> أو <code>StateError</code> أو استخدام null غلط. مبنمسكوش لأن المطلوب تصلّح الكود مش تخبي المشكلة، ولو مسكته غالبا البرنامج في حالة مش سليمة وكمّل شغل ممكن يبوظ بيانات." },
      ],
    },
    {
      title: "throw و try / on / catch",
      en: "throw, try, on, catch",
      body: "<p><code>throw</code> بيرمي الاستثناء ويوقف الدالة فورا ويطلع لحد أول <code>catch</code> مناسب. <code>on Type</code> بتحدد النوع، و<code>catch (e)</code> بتديك الـ object. الـ <code>on</code> بترتيب: أول واحدة تطابق هي اللي بتشتغل، فحط الأخص الأول والأعم بعده.</p>",
      code: {
        lang: "dart",
        src: `int parseAge(String text) {
  final age = int.tryParse(text);
  if (age == null) throw FormatException('Not a number', text);
  if (age < 0) throw Exception('age must be positive');
  return age;
}

void main() {
  for (final input in ['22', 'abc', '-5']) {
    try {
      print(parseAge(input));
    } on FormatException catch (e) {
      print('bad format: \${e.message}');
    } on Exception catch (e) {
      print('other: $e');
    }
  }
}`,
        note: "<code>on Exception</code> الأعم بتيجي بعد <code>FormatException</code> الأخص. لو عكستهم الأولى كانت هتبلع الاتنين.",
      },
      pitfall: "Dart بتسمحلك ترمي أي object (<code>throw 'oops'</code> بتتكومبايل). متعملش كده: ارمي <code>Exception</code> أو subclass منها، عشان الـ catch يقدر يفرّق ويطبع stack trace مفهوم.",
    },
    {
      title: "finally: بتشتغل في كل الأحوال",
      en: "finally",
      body: "<p>جوه <code>finally</code> بتحط التنضيف اللي لازم يحصل سواء نجح الكود أو رمى أو رجع قيمة بـ <code>return</code>: قفل ملف، إخفاء loading indicator، تحرير connection.</p>",
      code: {
        lang: "dart",
        src: `String load(bool fail) {
  print('open');
  try {
    if (fail) throw Exception('disk error');
    return 'data';
  } catch (e) {
    print('caught $e');
    return 'fallback';
  } finally {
    print('close');
  }
}

void main() {
  print(load(false));
  print(load(true));
}`,
        note: "حتى مع <code>return</code> جوه الـ try، الـ <code>finally</code> بتشتغل قبل ما الدالة تسلّم القيمة. الناتج: open, close, data ثم open, caught, close, fallback.",
      },
      interview: [
        { q: "إمتى بتشتغل <code>finally</code>؟ وهل بتشتغل لو فيه <code>return</code> جوه الـ try؟", a: "بتشتغل دايما بعد ما ينتهي الـ try أو الـ catch: سواء نجح، أو رمى واتمسك، أو عمل return. في حالة الـ return بتشتغل قبل ما القيمة تتسلّم للمنادي. بنستخدمها للتنضيف زي قفل ملف أو إخفاء الـ loading في Flutter، عشان نضمن إنه يحصل في كل المسارات." },
      ],
    },
    {
      title: "Stack trace و rethrow",
      en: "Stack trace and rethrow",
      body: "<p>الـ <code>catch</code> بتقبل parameter تاني: <code>catch (e, st)</code>. التاني هو الـ <b>stack trace</b>: سلسلة الدوال اللي وصلت للنقطة اللي رمت. ده أهم حاجة تسجلها (log) عشان تعرف الـ bug جه منين. و<code>rethrow</code> بتعيد رمي نفس الاستثناء بنفس الـ stack trace الأصلي بعد ما تعمل اللي عايزه (log مثلا).</p>",
      code: {
        lang: "dart",
        src: `void level3() => throw StateError('boom');
void level2() => level3();

void level1() {
  try {
    level2();
  } catch (e, st) {
    print('log: $e');
    print(st.toString().contains('level3'));
    rethrow;
  }
}

void main() {
  try {
    level1();
  } catch (e) {
    print('main got: $e');
  }
}`,
        note: "الـ stack trace فيه اسم <code>level3</code> لأنه المكان الأصلي. لو كتبت <code>throw e;</code> بدل <code>rethrow;</code> الـ trace بيبدأ من هنا ويضيع الأصل.",
      },
      focus: [{ label: "احفظها", text: "جوه catch: لو عايز تكمّل الرمي استخدم <code>rethrow</code> مش <code>throw e</code>." }],
      interview: [
        { q: "إيه الفرق بين <code>rethrow</code> و <code>throw e</code> جوه catch؟", a: "<code>rethrow</code> بيعيد رمي نفس الاستثناء محافظ على الـ stack trace الأصلي، فتعرف الخطأ حصل فين بالظبط. <code>throw e</code> بيرمي الـ object كأنه استثناء جديد، والـ stack trace بيبدأ من سطر الـ throw الجديد فتضيع المعلومة المهمة. فبعد اللوج دايما <code>rethrow</code>." },
      ],
    },
    {
      title: "Custom exceptions",
      en: "Custom exception classes",
      body: "<p>الـ <code>Exception</code> العادي مفيهوش غير رسالة. في تطبيق حقيقي عايز تعرف: كود الحالة، هل ينفع أعيد المحاولة، أعرض إيه للمستخدم. فبتعمل كلاس بتاعك بـ <code>implements Exception</code> (مش <code>extends</code>: <code>Exception</code> interface). وكمان hierarchy: كلاس أب لكل أخطاء الـ API، وأولاد للحالات.</p>",
      code: {
        lang: "dart",
        src: `class ApiException implements Exception {
  final int statusCode;
  final String message;
  const ApiException(this.statusCode, this.message);

  @override
  String toString() => 'ApiException(\$statusCode): $message';
}

class UnauthorizedException extends ApiException {
  const UnauthorizedException() : super(401, 'Please log in again');
}

void fetchOffice(int id) {
  if (id == 0) throw const UnauthorizedException();
  if (id < 0) throw ApiException(404, 'Office not found');
  print('office $id');
}

void main() {
  for (final id in [1, 0, -1]) {
    try {
      fetchOffice(id);
    } on UnauthorizedException {
      print('go to login');
    } on ApiException catch (e) {
      print(e);
    }
  }
}`,
        note: "<code>on UnauthorizedException</code> من غير <code>catch</code> لما مش محتاج الـ object. والأخص قبل الأعم برضه.",
      },
      pitfall: "من غير <code>toString</code>، الـ print بيطلع <code>Instance of 'ApiException'</code> وده ملوش أي فايدة في الـ log. اكتب <code>toString</code> دايما.",
      interview: [
        { q: "إزاي بتعمل custom exception؟", a: "بعمل كلاس <code>implements Exception</code> وأحط فيه البيانات اللي محتاجها (status code، رسالة)، وبكتب <code>toString</code> عشان اللوج يبقى مفهوم، وغالبا بعمل hierarchy: كلاس أب مثل <code>ApiException</code> وتحته أنواع محددة مثل <code>UnauthorizedException</code> فأقدر أمسك الأب أو الابن حسب احتياجي. الأفضل <code>implements</code> لأن <code>Exception</code> مجرد interface." },
      ],
    },
    {
      title: "لو محدش مسك الاستثناء",
      en: "Uncaught exceptions",
      body: "<p>الاستثناء اللي مفيش <code>catch</code> يمسكه بيطلع لفوق في سلسلة النداءات لحد ما يوصل لـ <code>main</code>. هناك Dart بتطبع <code>Unhandled exception</code> مع الـ stack trace وبتوقف البرنامج. في Flutter الوضع أنعم: الـ framework بيمسك الأخطاء اللي بتحصل وقت بناء الـ widget ويعرضها كشاشة حمرا في الـ debug، وبيبلّغ <code>FlutterError.onError</code>. والأخطاء async اللي محدش مسكها بتروح لـ <code>PlatformDispatcher.instance.onError</code>.</p>",
      points: [
        "في تطبيق production بتسجّل الأخطاء دي عند خدمة زي Crashlytics أو Sentry من الـ hooks دي.",
        "الشاشة الحمرا مش حل: المستخدم الحقيقي مفروض يشوف رسالة لطيفة، وده بيجي من الـ try/catch بتاعك.",
      ],
      focus: [{ label: "القاعدة", text: "امسك الاستثناء في المكان اللي <b>تعرف تعمل فيه حاجة مفيدة</b>: تعرض رسالة، تعيد المحاولة، ترجع قيمة بديلة. غير كده سيبه يطلع لفوق." }],
      interview: [
        { q: "إيه اللي بيحصل لاستثناء محدش مسكه؟", a: "بيطلع في سلسلة النداءات لحد <code>main</code>، وهناك Dart بتطبع <code>Unhandled exception</code> مع الـ stack trace وبتوقف البرنامج. في Flutter الـ framework بيمسك أخطاء الـ build ويبلّغ <code>FlutterError.onError</code>، والأخطاء async اللي محدش مسكها بتروح لـ <code>PlatformDispatcher.instance.onError</code>. وفي production بنربط الـ hooks دي بـ Crashlytics أو Sentry." },
      ],
    },
    {
      title: "الأخطاء في الكود async",
      en: "Errors in async code",
      body: "<p>الـ <code>Future</code> اللي بيفشل بيشيل الخطأ جواه. عشان تمسكه عندك طريقتين: <b><code>try/catch</code> مع <code>await</code></b> (الأوضح، بتقرأه زي كود عادي)، أو <b><code>.catchError()</code></b> على الـ Future نفسه. الشرط في الأولى: لازم <code>await</code>، من غيرها الـ catch بيخلص قبل ما الخطأ يحصل.</p>",
      codes: [
        {
          lang: "dart",
          title: "الاتنين شغالين",
          src: `Future<String> fetchName() async {
  await Future.delayed(const Duration(milliseconds: 10));
  throw Exception('network down');
}

Future<void> main() async {
  try {
    final name = await fetchName();
    print(name);
  } catch (e) {
    print('await style: $e');
  }

  final value = await fetchName().catchError((Object e) {
    print('catchError style: $e');
    return 'fallback';
  });
  print(value);
}`,
          note: "<code>catchError</code> لازم يرجّع نفس نوع الـ Future (هنا String)، وإلا خطأ وقت التشغيل.",
        },
        {
          lang: "dart",
          title: "غلط: من غير await",
          src: `Future<void> broken() async {
  try {
    fetchName();            // no await: the catch never sees the error
  } catch (e) {
    print('never printed');
  }
}`,
          note: "الخطأ هيطلع بعدين كـ unhandled error ويقفل البرنامج، والـ catch بتاعك عدّى فاضي.",
        },
      ],
      pitfall: "نسيان <code>await</code> جوه <code>try</code> هو أشهر سبب لـ «أنا حاطط try/catch ومع ذلك التطبيق بيقع». لو الدالة بترجع Future، يا إما <code>await</code> يا إما <code>.catchError</code>.",
      interview: [
        { q: "إزاي بتمسك خطأ جاي من Future؟", a: "الطريقة الأولى والأوضح: <code>try { await f(); } catch (e) { ... }</code> لأن الـ await بيرمي الخطأ في مكانه وقدام الـ catch. التانية <code>f().catchError((e) { ... })</code> أو <code>.then(..., onError: ...)</code>. والغلطة الشائعة إني أنادي الدالة من غير await جوه try، وساعتها الـ catch مبيشوفش الخطأ لأنه بيحصل بعد ما الكتلة خلصت." },
      ],
    },
    {
      title: "بديل للـ throw: Result",
      en: "Result type with sealed classes",
      body: "<p>الـ exception مناسب للحاجات الاستثنائية فعلا. لكن «المستخدم كتب إيميل غلط» أو «مفيش نتايج» مش استثناء، دي حالة عادية متوقعة. المشكلة في <code>throw</code> إن اللي بينادي الدالة <b>ممكن ينسى</b> يمسكه والـ compiler مش هيفكره. الحل: الدالة ترجّع <b>نتيجة</b> فيها النجاح أو الفشل، وبـ <code>sealed class</code> الـ compiler يجبرك تتعامل مع الحالتين.</p>",
      code: {
        lang: "dart",
        src: `sealed class Result<T> {
  const Result();
}

class Success<T> extends Result<T> {
  final T value;
  const Success(this.value);
}

class Failure<T> extends Result<T> {
  final String message;
  const Failure(this.message);
}

Result<int> parseAge(String text) {
  final age = int.tryParse(text);
  if (age == null) return Failure('Not a number: $text');
  if (age < 0) return const Failure('Age cannot be negative');
  return Success(age);
}

void main() {
  for (final input in ['22', 'abc', '-5']) {
    final text = switch (parseAge(input)) {
      Success(:final value) => 'age $value',
      Failure(:final message) => 'error: $message',
    };
    print(text);
  }
}`,
        note: "لو ضفت كلاس ثالث ورثه من <code>Result</code> الـ switch هيدي خطأ كومبايل لحد ما تتعامل معاه. ده ضمان الـ exception مبيدهوش.",
      },
      focus: [{ label: "إمتى أستخدمه", text: "<b>Exception</b> للحاجة الاستثنائية فعلا. <b>Result</b> للفشل المتوقع اللي المنادي لازم يتعامل معاه (validation، login غلط)." }],
      interview: [
        { q: "إمتى تستخدم Result بدل ما ترمي exception؟", a: "لما الفشل حالة طبيعية متوقعة زي validation أو بيانات مش موجودة أو login غلط، وعايز الـ compiler يجبر المنادي يتعامل معاها. بعمل <code>sealed class Result</code> بنوعين <code>Success</code> و <code>Failure</code> والـ switch الـ exhaustive بيضمن إني متعاملتش مع واحدة بس. الـ exceptions أحتفظ بيها للمشاكل الحقيقية زي انقطاع النت أو ملف تالف." },
      ],
    },
    {
      title: "assert وعدم ابتلاع الأخطاء",
      en: "assert and never swallowing errors",
      body: "<p><code>assert(condition, 'message')</code> فحص بيشتغل في وضع الـ debug بس، وفي الـ release بيتشال خالص. بنستخدمه لافتراضات المبرمج: «total لازم يكون أكبر من صفر»، مش للتحقق من input المستخدم (ده بيتحقق منه بكود حقيقي). لو فشل بيرمي <code>AssertionError</code>.</p><p>والأهم: <b>الـ catch الفاضي</b> أخطر سطر ممكن تكتبه. بيبلع الخطأ، التطبيق يكمل بحالة غلط، ومحدش يعرف ليه.</p>",
      codes: [
        {
          lang: "dart",
          title: "غلط",
          src: `void saveWrong() {
  try {
    saveOrder();
  } catch (e) {}         // swallowed: nobody will ever know
}`,
        },
        {
          lang: "dart",
          title: "صح",
          src: `import 'dart:io';

void saveRight() {
  try {
    saveOrder();
  } on SocketException catch (e, st) {
    logError(e, st);
    showMessage('Check your connection');
  }
}`,
          note: "<code>saveOrder</code> و <code>logError</code> و <code>showMessage</code> أسماء افتراضية للتوضيح. نوع محدد، تسجيل مع الـ stack trace، ورد فعل واضح للمستخدم.",
        },
      ],
      pitfall: "لو مضطر تتجاهل خطأ فعلا، اكتب تعليق يشرح ليه، وأضعف الإيمان لوج. الـ catch الفاضي من غير سبب هو أصل الـ bugs اللي بتتحل في أسبوع.",
      interview: [
        { q: "إيه الـ <code>assert</code> وإمتى بنستخدمه؟ وهل بيشتغل في release؟", a: "<code>assert</code> بيفحص شرط ويرمي <code>AssertionError</code> لو فشل، لكن في وضع الـ debug بس. في الـ release الكومبايلر بيشيله. فبنستخدمه لافتراضات المبرمج الداخلية (parameter لازم يكون موجب)، ومينفعش أعتمد عليه في التحقق من input المستخدم أو في حاجة لازم تحصل في production." },
        { q: "ليه الـ catch الفاضي فكرة وحشة؟", a: "لأنه بيبلع الخطأ فالتطبيق يكمل بحالة غلط ومحدش يعرف إن حاجة فشلت، وبعدين الـ bug يظهر في مكان تاني بعيد ويبقى صعب تتبعه. الصح إني أمسك نوع محدد، أسجّل الخطأ مع الـ stack trace، وأتعامل معاه فعلا (رسالة، retry، قيمة بديلة)، أو أسيبه يطلع لفوق." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: try و on و finally",
      lang: "dart",
      code: `int toInt(String text) {
  try {
    return int.parse(text);
  } on FormatException {
    return 0;
  } finally {
    print('parsed $text');
  }
}

void main() {
  print(toInt('42'));
  print(toInt('x'));
}`,
    },
    {
      title: "اكتب: custom exception",
      lang: "dart",
      code: `class OutOfStock implements Exception {
  final String item;
  const OutOfStock(this.item);

  @override
  String toString() => 'OutOfStock: $item';
}

void order(String item, int stock) {
  if (stock == 0) throw OutOfStock(item);
  print('ordered $item');
}`,
    },
    {
      title: "اكتب: Result و switch",
      lang: "dart",
      code: `sealed class Result<T> {
  const Result();
}

class Ok<T> extends Result<T> {
  final T value;
  const Ok(this.value);
}

class Err<T> extends Result<T> {
  final String message;
  const Err(this.message);
}

String show(Result<int> r) => switch (r) {
  Ok(:final value) => 'value $value',
  Err(:final message) => 'error $message',
};`,
      note: "<code>:final value</code> بتسحب الـ field من الـ object مباشرة (object pattern).",
    },
  ],

  tasks: [
    {
      title: "كمية الطلب",
      lang: "dart",
      prompt: "<p>اكتب كلاس <code>InvalidQuantityException</code> بـ <code>implements Exception</code> فيه field <code>int value</code> و <code>toString</code> بترجع <code>Invalid quantity: &lt;value&gt;</code>.</p><p>وبعدين دالة <code>int parseQuantity(String text)</code>: لو النص مش رقم ترمي <code>FormatException</code>، ولو الرقم أقل من 1 ترمي <code>InvalidQuantityException</code>، غير كده ترجّع الرقم.</p>",
      examples: [
        { in: "parseQuantity('3')", out: "3" },
        { in: "parseQuantity('0')", out: "InvalidQuantityException: Invalid quantity: 0" },
      ],
      hints: [
        "<code>int.tryParse</code> بترجع <code>null</code> بدل ما ترمي، فاستخدمها وافحص الـ null.",
        "<code>throw FormatException('Not a number', text)</code> وبعدها فحص <code>qty &lt; 1</code>.",
      ],
      solution: `class InvalidQuantityException implements Exception {
  final int value;
  const InvalidQuantityException(this.value);

  @override
  String toString() => 'Invalid quantity: $value';
}

int parseQuantity(String text) {
  final qty = int.tryParse(text);
  if (qty == null) throw FormatException('Not a number', text);
  if (qty < 1) throw InvalidQuantityException(qty);
  return qty;
}`,
      explain: "استخدمنا <code>tryParse</code> عشان نتحكم في نوع الخطأ بنفسنا بدل <code>int.parse</code> اللي بترمي <code>FormatException</code> برسالتها. الكلاس <code>implements Exception</code> وفيه <code>toString</code> فاللوج بيبقى مفهوم.",
    },
    {
      title: "إعادة المحاولة",
      lang: "dart",
      prompt: "<p>اكتب دالة generic <code>T retry&lt;T&gt;(T Function() action, {int times = 3})</code> بتنفّذ <code>action</code>. لو رمت exception تحاول تاني، لحد <code>times</code> محاولات في المجموع. لو آخر محاولة فشلت، تعيد رمي نفس الاستثناء بـ <code>rethrow</code>. لو نجحت في أي محاولة ترجّع القيمة.</p>",
      examples: [
        { in: "retry(() => flaky())  // fails twice, then returns 'ok'", out: "ok" },
      ],
      hints: [
        "لف بـ <code>for (var attempt = 1; attempt &lt;= times; attempt++)</code> وجوه كل لفة <code>try</code>.",
        "في الـ catch: لو <code>attempt == times</code> اعمل <code>rethrow</code>، غير كده كمّل اللفة.",
        "بعد اللفة Dart هتطلب return، استخدم <code>throw StateError(...)</code> لأن الكود مش المفروض يوصل هناك.",
      ],
      solution: `T retry<T>(T Function() action, {int times = 3}) {
  for (var attempt = 1; attempt <= times; attempt++) {
    try {
      return action();
    } catch (e) {
      print('attempt $attempt failed: $e');
      if (attempt == times) rethrow;
    }
  }
  throw StateError('times must be at least 1');
}`,
      explain: "<code>rethrow</code> بتحافظ على الـ stack trace الأصلي. السطر الأخير بيغطي حالة <code>times &lt; 1</code> (اللفة مش بتشتغل أصلا) والـ compiler محتاجه عشان الدالة لازم ترجّع قيمة في كل مسار.",
    },
    {
      title: "قسمة بـ Result",
      lang: "dart",
      prompt: "<p>عندك الـ <code>sealed class Result&lt;T&gt;</code> مع <code>Success&lt;T&gt;(value)</code> و <code>Failure&lt;T&gt;(message)</code>. اكتب دالة <code>Result&lt;double&gt; divide(int a, int b)</code> ترجّع <code>Failure</code> بالرسالة <code>Division by zero</code> لو <code>b</code> صفر، وإلا <code>Success</code> بالناتج. وبعدين دالة <code>String describe(Result&lt;double&gt; r)</code> بـ switch expression ترجّع <code>Result: &lt;value&gt;</code> أو <code>Error: &lt;message&gt;</code>.</p>",
      examples: [
        { in: "describe(divide(7, 2))", out: "Result: 3.5" },
        { in: "describe(divide(1, 0))", out: "Error: Division by zero" },
      ],
      starter: `sealed class Result<T> {
  const Result();
}

class Success<T> extends Result<T> {
  final T value;
  const Success(this.value);
}

class Failure<T> extends Result<T> {
  final String message;
  const Failure(this.message);
}

// your code`,
      hints: [
        "<code>divide</code>: <code>if (b == 0) return const Failure('Division by zero');</code>",
        "الـ switch بتاعك لازم يغطي <code>Success</code> و <code>Failure</code> بدون default.",
      ],
      solution: `Result<double> divide(int a, int b) {
  if (b == 0) return const Failure('Division by zero');
  return Success(a / b);
}

String describe(Result<double> r) => switch (r) {
  Success(:final value) => 'Result: $value',
  Failure(:final message) => 'Error: $message',
};`,
      explain: "مفيش default في الـ switch: لأن <code>Result</code> sealed، الـ compiler عارف إن الحالتين هما الاحتمالات الكاملة، ولو ضفت حالة جديدة هيجبرك تتعامل معاها.",
    },
  ],

  quiz: [
    {
      q: "أنهي واحدة منهم المفروض تتمسك وتتعالج في تطبيق سليم؟",
      options: [
        "<code>RangeError</code> لأن الـ index برا القايمة",
        "<code>StateError</code> لأن الكود في حالة غلط",
        "<code>SocketException</code> لأن النت قطع",
        "<code>TypeError</code> لأن النوع مش مطابق",
      ],
      answer: 2,
      why: "انقطاع النت ظرف خارجي متوقع (Exception) ينفع تتعامل معاه. الباقي <code>Error</code> يعني bug برمجي: صلّح الكود بدل ما تمسكه.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `void risky() => throw FormatException('bad');

void main() {
  try {
    print('1');
    risky();
    print('2');
  } on FormatException {
    print('3');
  } finally {
    print('4');
  }
  print('5');
}`,
      },
      options: ["1 3 4 5", "1 2 3 4 5", "1 3 5", "1 4 3 5"],
      answer: 0,
      why: "بعد <code>1</code> الدالة بترمي فبيتخطى <code>print('2')</code>، الـ <code>on</code> بتطبع <code>3</code>، والـ <code>finally</code> بتطبع <code>4</code> دايما، وبعدها الكود العادي يكمل <code>5</code>.",
    },
    {
      q: "إيه بيحصل هنا؟",
      code: {
        lang: "dart",
        src: `String f() {
  try {
    return 'try';
  } finally {
    print('finally');
  }
}

void main() {
  print(f());
}`,
      },
      options: [
        "بيطبع <code>try</code> بس",
        "بيطبع <code>finally</code> وبعدها <code>try</code>",
        "بيطبع <code>try</code> وبعدها <code>finally</code>",
        "خطأ كومبايل: مينفعش return جوه try",
      ],
      answer: 1,
      why: "الـ <code>finally</code> بتشتغل قبل ما القيمة تتسلّم للمنادي، فطباعة <code>finally</code> بتحصل جوه <code>f()</code> وبعدها <code>print</code> في <code>main</code> تطبع <code>try</code>.",
    },
    {
      q: "جوه catch عايز تسجل الخطأ وتكمّل رميه للمستوى اللي فوق. الأحسن إيه؟",
      options: [
        "<code>throw e;</code>",
        "<code>return;</code>",
        "<code>throw Exception(e.toString());</code>",
        "<code>rethrow;</code>",
      ],
      answer: 3,
      why: "<code>rethrow</code> بتحافظ على الـ stack trace الأصلي ونوع الاستثناء. <code>throw e</code> بتبدأ trace جديد، والرابعة بتحوّل النوع لـ Exception عام وبتضيع المعلومة.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `Future<void> fail() async {
  throw Exception('x');
}

Future<void> main() async {
  fail().catchError((e) {
    print('handled');
  });
  print('after');
}`,
      },
      options: ["handled ثم after", "after ثم handled", "after بس والبرنامج يقع", "handled بس"],
      answer: 1,
      why: "<code>catchError</code> بتسجّل callback بس، وبيشتغل بعد ما الكود الحالي يخلص، فـ <code>after</code> بتتطبع الأول وبعدها <code>handled</code>. الخطأ اتمسك فالبرنامج مبيقعش.",
    },
    {
      q: "ليه الـ catch دي مش بتمسك الخطأ؟",
      code: {
        lang: "dart",
        src: `Future<void> save() async {
  throw Exception('disk full');
}

Future<void> run() async {
  try {
    save();
  } catch (e) {
    print('caught');
  }
}`,
      },
      options: [
        "لأن <code>catch</code> من غير <code>on</code> مبتمسكش Exception",
        "لأن Future مبترميش أخطاء أصلا",
        "لأن <code>run</code> لازم تكون <code>sync</code>",
        "لأن <code>save()</code> مش متعمل لها <code>await</code> فالخطأ بيطلع بعد ما الكتلة تخلص",
      ],
      answer: 3,
      why: "من غير <code>await</code> الـ try بينتهي قبل ما الـ Future يفشل، فالخطأ بيطلع بعدين كخطأ مش ممسوك. الحل: <code>await save();</code>.",
    },
    {
      q: "فايدة <code>sealed class Result</code> مع switch بدل ما ترمي exception؟",
      options: [
        "إنها أسرع في الأداء من الـ exceptions",
        "إنها بتمنع أي bug برمجي",
        "إن الـ compiler بيجبر المنادي يتعامل مع حالتي النجاح والفشل",
        "إنها بتخليك مش محتاج تكتب try أبدا في التطبيق",
      ],
      answer: 2,
      why: "الميزة هي الإجبار وقت الكومبايل. ممكن تحتاج try/catch لمشاكل حقيقية زي النت، والـ Result مناسب للفشل المتوقع بس.",
    },
    {
      q: "أنهي تعريف صح لـ custom exception؟",
      options: [
        "<code>class AppError extends Exception {}</code>",
        "<code>class AppException implements Exception {}</code>",
        "<code>class AppException with Exception {}</code>",
        "<code>class AppException : Exception {}</code>",
      ],
      answer: 1,
      why: "<code>Exception</code> interface فبنعمل <code>implements</code>. <code>extends Error</code> كان ممكن لو bug برمجي، والباقي مش syntax صحيح في Dart.",
    },
    {
      q: "عندك <code>assert(total > 0, 'total must be positive');</code> في دالة في تطبيق Flutter. إيه بيحصل في نسخة الـ release لو <code>total</code> بصفر؟",
      options: [
        "بيتجاهل الـ assert خالص والكود بيكمل",
        "بيرمي <code>AssertionError</code> وبيقفل التطبيق",
        "بيرجّع <code>null</code>",
        "خطأ كومبايل",
      ],
      answer: 0,
      why: "الـ assert بيشتغل في الـ debug بس وبيتشال في الـ release. عشان كده مينفعش نعتمد عليه للتحقق من input المستخدم.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `void main() {
  final n = int.tryParse('x1') ?? -1;
  print(n);
}`,
      },
      answer: ["-1"],
      why: "<code>tryParse</code> بترجع <code>null</code> لما النص مش رقم بدل ما ترمي exception، و<code>??</code> بتحط القيمة البديلة.",
    },
  ],
};
