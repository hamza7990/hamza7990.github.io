window.LEVELS = window.LEVELS || {};
window.LEVELS["dart/d10"] = {
  slides: [
    {
      kicker: "ليه Streams",
      title: "Future بيرد مرة، لكن فيه حاجات بتفضل تبعت",
      en: "Future vs Stream",
      body: "<p><code>Future</code> بيرجّع <b>قيمة واحدة</b> في المستقبل. لكن فيه مصادر بتبعت بيانات على فترات: رسايل شات، موقع GPS بيتغير، تحديثات Firebase، ضغطات المستخدم، عدّاد تنازلي. ده شغل <code>Stream&lt;T&gt;</code>: <b>سلسلة events</b> بتوصل واحد ورا التاني على مدار الوقت، وفي الآخر ممكن تتقفل (done) أو تفضل مفتوحة.</p>",
      points: [
        "<code>Future&lt;int&gt;</code>: «هيجيلك رقم واحد». <code>Stream&lt;int&gt;</code>: «هيجيلك أرقام كتير، وممكن أي وحدة تبقى خطأ».",
        "في Flutter الـ Streams بتظهر في <code>StreamBuilder</code> و Bloc و Firebase، فهمها ضروري للإنترفيو.",
      ],
    },
    {
      title: "listen و await for",
      en: "Consuming a stream",
      body: "<p>في طريقتين تستهلك بيهم الـ stream. <b><code>listen</code></b>: بتسجل callbacks (<code>onData</code>, <code>onError</code>, <code>onDone</code>) وبترجّع <code>StreamSubscription</code>، والكود اللي بعدها بيكمل فورا. <b><code>await for</code></b>: لفة بتستنى كل event، جوه دالة <code>async</code>، والكود اللي بعدها مبيشتغلش غير لما الـ stream يخلص.</p>",
      code: {
        lang: "dart",
        src: `Stream<int> countdown(int from) async* {
  for (var i = from; i > 0; i--) {
    await Future.delayed(const Duration(milliseconds: 5));
    yield i;
  }
}

Future<void> main() async {
  countdown(2).listen(
    (v) => print('listen $v'),
    onDone: () => print('listen done'),
  );
  print('after listen');            // runs first

  await for (final v in countdown(2)) {
    print('await for $v');
  }
  print('after await for');          // runs when the stream is done
}`,
        note: "الاتنين شغالين مع بعض. الفرق إن <code>after listen</code> اتطبعت فورا، و<code>after await for</code> استنت لحد ما الـ stream خلص.",
      },
      focus: [{ label: "احفظها", text: "<code>await for</code> أبسط وبتمسك الأخطاء بـ try/catch العادي. <code>listen</code> لما تحتاج تتحكم (pause، cancel) أو تكمل شغل تاني." }],
      interview: [
        { q: "إيه الفرق بين <code>Future</code> و <code>Stream</code>؟", a: "الـ <code>Future</code> بيمثّل نتيجة واحدة هتوصل (قيمة أو خطأ) في المستقبل. الـ <code>Stream</code> بيمثّل سلسلة events بتوصل على مدار الوقت: كل واحد ممكن يكون قيمة أو خطأ، وفي الآخر ممكن يقفل. مثال: طلب API = Future، رسايل WebSocket أو تحديثات Firestore = Stream." },
      ],
    },
    {
      title: "Single-subscription مقابل broadcast",
      en: "Single-subscription vs broadcast",
      body: "<p>الـ stream العادي (<b>single-subscription</b>) ليه مستمع واحد بس طول عمره، وبيحتفظ بالـ events لحد ما يتسمع (buffering). لو حاولت تسمع تاني بيرمي <code>StateError</code>. الـ <b>broadcast</b> stream ليه أكتر من مستمع في نفس الوقت، لكن مفيش buffering: اللي بيسمع متأخر بيفوّت اللي فات.</p>",
      codes: [
        {
          lang: "dart",
          title: "single-subscription",
          src: `Stream<int> gen() async* {
  yield 1;
  yield 2;
}

void main() {
  final s = gen();
  s.listen((v) => print('first $v'));
  try {
    s.listen(print);
  } on StateError catch (e) {
    print(e.message);
  }
}`,
          note: "الناتج: Stream has already been listened to. وبعدها first 1 و first 2.",
        },
        {
          lang: "dart",
          title: "broadcast",
          src: `import 'dart:async';

Future<void> main() async {
  final b = StreamController<int>.broadcast();
  b.add(0);                                  // nobody listens: lost
  b.stream.listen((v) => print('A $v'));
  b.stream.listen((v) => print('B $v'));
  b.add(1);
  b.add(2);
  await Future.delayed(Duration.zero);
  b.stream.listen((v) => print('late $v'));
  b.add(3);
  await Future.delayed(Duration.zero);
  await b.close();
}`,
          note: "الناتج: A 1, B 1, A 2, B 2, A 3, B 3, late 3. الـ <code>0</code> ضاع، والـ late معرفش 1 و 2.",
        },
      ],
      pitfall: "<code>Stream.fromIterable</code> بتتسمع أكتر من مرة (كل مرة بتبدأ من الأول)، بس ده استثناء. الـ streams اللي بتجي من <code>async*</code> و <code>StreamController()</code> مستمع واحد بس. وتقدر تحول أي stream لـ broadcast بـ <code>asBroadcastStream()</code>.",
      interview: [
        { q: "إيه الفرق بين single-subscription و broadcast stream؟", a: "الـ single-subscription ليه مستمع واحد بس، وبيخزّن الـ events لحد ما حد يسمعها، ولو سمعته مرتين بيرمي StateError. الـ broadcast بيسمح بأكتر من مستمع في نفس الوقت (زي event bus أو حالة عامة)، بس مبيخزّنش: أي event بيتبعت قبل ما تسمع بيضيع. بستخدم الأول لتدفق بيانات لمستهلك واحد، والتاني لما أكتر من widget يسمعوا نفس الأحداث." },
      ],
    },
    {
      title: "StreamController: إنت اللي بتبعت",
      en: "StreamController",
      body: "<p>الـ <code>StreamController</code> هو الباب اللي بتبعت منه events بإيدك: <code>add(value)</code>، <code>addError(e)</code>، <code>close()</code>. بيطلع لبرا <code>.stream</code> للمستمعين و<code>.sink</code> للي بيبعت (نفس <code>add</code>). وفيه hooks: <code>onListen</code> لما أول مستمع يدخل، و<code>onCancel</code> لما آخر مستمع يمشي (مكان كويس تفتح فيه المصدر وتقفله).</p>",
      code: {
        lang: "dart",
        src: `import 'dart:async';

Future<void> main() async {
  final controller = StreamController<int>(
    onListen: () => print('someone listens'),
    onCancel: () => print('last listener left'),
  );

  controller.stream.listen(
    (v) => print('got $v'),
    onError: (Object e) => print('error $e'),
    onDone: () => print('closed'),
  );

  controller.add(1);
  controller.sink.add(2);
  controller.addError(Exception('oops'));
  controller.add(3);
  await controller.close();
}`,
        note: "الخطأ مش بيوقف الـ stream: 3 اتبعتت بعد الخطأ ووصلت. الناتج بالترتيب: someone listens, got 1, got 2, error, got 3, last listener left, closed.",
      },
      pitfall: "لازم <code>close()</code> للـ controller لما تخلص، وإلا الـ listeners هتفضل مستنية ومش هيتنادى <code>onDone</code> أبدا. وفي Flutter اعملها في <code>dispose()</code>.",
      interview: [
        { q: "إيه هو <code>StreamController</code> وإمتى بتحتاجه؟", a: "هو object بيمثل الجهتين: بتدخل فيه events بـ <code>add</code> و<code>addError</code> و<code>close</code>، وبيطلّع <code>stream</code> للي عايز يسمع. بحتاجه لما أنا اللي بولّد الأحداث (state في Bloc بسيط، event bus، ربط callback قديم بـ stream). بيجي في نسختين: العادي (مستمع واحد) و <code>.broadcast()</code>. ولازم أقفله في <code>dispose</code> عشان ميبقاش فيه leak." },
      ],
    },
    {
      title: "StreamSubscription والتسريب",
      en: "pause, resume, cancel and leaks",
      body: "<p><code>listen</code> بترجّع <code>StreamSubscription</code> فيه: <code>pause()</code> بتوقف التوصيل (والـ single-subscription بيخزّن اللي جاي)، <code>resume()</code> بتكمل، و<code>cancel()</code> بتقفل الاشتراك للأبد. لو مسلمتش <code>cancel</code>، الـ listener بيفضل متسجل والـ stream بيفضل ماسك reference ليه: ده <b>memory leak</b> و callbacks بتشتغل بعد ما الشاشة اتقفلت.</p>",
      codes: [
        {
          lang: "dart",
          title: "pause و resume و cancel",
          src: `import 'dart:async';

Future<void> main() async {
  final c = StreamController<int>();
  final sub = c.stream.listen((v) => print('got $v'));
  c.add(1);
  await Future.delayed(Duration.zero);

  sub.pause();
  c.add(2);                         // buffered while paused
  await Future.delayed(Duration.zero);
  print('paused, 2 waits');

  sub.resume();
  await Future.delayed(Duration.zero);
  await sub.cancel();
  print('cancelled');
}`,
          note: "الناتج: got 1, paused 2 waits, got 2, cancelled.",
        },
        {
          lang: "dart",
          title: "الشكل الصح في كلاس له lifecycle",
          src: `import 'dart:async';

class ScoreWatcher {
  StreamSubscription<int>? _sub;

  void start(Stream<int> scores) {
    _sub = scores.listen((s) => print('score $s'));
  }

  void dispose() {
    _sub?.cancel();       // like State.dispose() in Flutter
    _sub = null;
  }
}

void main() {
  final w = ScoreWatcher();
  w.start(Stream.fromIterable([1, 2]));
  w.dispose();
}`,
          note: "الـ events بتتسلّم async، فـ <code>dispose()</code> هنا ألغت الاشتراك قبل ما أي event يوصل ومفيش حاجة بتتطبع. في Flutter: <code>listen</code> في <code>initState</code> و<code>cancel</code> في <code>dispose</code>.",
        },
      ],
      focus: [{ label: "القاعدة", text: "كل <code>listen</code> يتقابلها <code>cancel</code>. وكل <code>StreamController</code> يتقابله <code>close</code>. <code>StreamBuilder</code> و<code>await for</code> بيعملوها لوحدهم." }],
      interview: [
        { q: "إزاي بيحصل memory leak مع الـ streams؟ وإزاي تتجنبه؟", a: "لما أعمل <code>listen</code> وأنسى <code>cancel()</code>، الـ subscription بيفضل متسجل على الـ stream والـ callback بتاعي (وكل اللي ماسكه، زي الـ State) بيفضل في الميموري ويشتغل حتى بعد ما الـ widget اتشال. بتجنبه بإني أحتفظ بالـ <code>StreamSubscription</code> في field وأنادي <code>cancel()</code> في <code>dispose()</code>، وأقفل أي <code>StreamController</code> بتاعي بـ <code>close()</code>. واستخدام <code>StreamBuilder</code> بيريحني من ده." },
      ],
    },
    {
      title: "async* و yield",
      en: "Generators: async*, yield, yield*",
      body: "<p>أسهل طريقة تعمل stream: دالة <code>async*</code> ونوعها <code>Stream&lt;T&gt;</code>. جواها <code>yield value</code> بتبعت event وبتكمل، و<code>yield* otherStream</code> بتحوّل كل events من stream تاني. الدالة <b>كسولة</b>: جسمها مبيبدأش غير لما حد يسمع الـ stream، ولو المستمع عمل cancel الدالة بتقف. وأي <code>throw</code> جواها بيطلع كخطأ في الـ stream وبيقفله.</p>",
      code: {
        lang: "dart",
        src: `Stream<int> countdown(int from) async* {
  print('countdown starts');
  for (var i = from; i > 0; i--) {
    await Future.delayed(const Duration(milliseconds: 5));
    yield i;
  }
}

Stream<int> both() async* {
  yield* countdown(2);          // forwards every event
  yield* countdown(1);
}

Stream<int> oops() async* {
  yield 1;
  throw Exception('boom');
}

Future<void> main() async {
  final s = countdown(2);
  print('created');             // body has not started
  await for (final v in s) {
    print(v);
  }
  print(await both().toList());   // [2, 1, 1]

  try {
    await for (final v in oops()) {
      print('v $v');
    }
  } catch (e) {
    print('caught $e');
  }
}`,
        note: "الناتج: created, countdown starts, 2, 1, ثم countdown starts مرتين وبعدهم [2, 1, 1]، وآخرها v 1 و caught Exception: boom.",
      },
      terms: [
        ["yield", "ابعت event", "جوه <code>async*</code> بتبعت قيمة للـ stream وبتكمل الدالة."],
        ["yield*", "حوّل stream تاني", "بتبعت كل events من stream أو iterable تاني كأنها بتاعتك."],
      ],
      interview: [
        { q: "إيه الفرق بين <code>async</code> و <code>async*</code>؟", a: "<code>async</code> دالة بترجّع <code>Future</code> بقيمة واحدة بـ <code>return</code>. <code>async*</code> دالة بترجّع <code>Stream</code> وبتبعت قيم كتير بـ <code>yield</code> واحدة ورا التانية، وممكن تستخدم <code>await</code> جواها بين القيم. جسمها كسول: مبيشتغلش غير لما حد يسمع الـ stream. و<code>yield*</code> بتوصّل stream تاني جواها." },
      ],
    },
    {
      title: "التحويلات على الـ stream",
      en: "Stream operators",
      body: "<p>زي الـ Iterable بالظبط، الـ stream ليه دوال بتبني stream جديد: <code>map</code>, <code>where</code>, <code>take</code>, <code>skip</code>, <code>distinct</code> (بيشيل التكرار المتتالي). و<code>expand</code> بتحوّل event لعدة events. و<code>asyncMap</code> لما التحويل نفسه async (بتنفّذ الـ Future وتبعت نتيجته بالترتيب). وفي الآخر بتستهلك بـ <code>toList()</code> أو <code>first</code> أو <code>length</code> أو <code>await for</code>.</p>",
      code: {
        lang: "dart",
        src: `Stream<int> source() => Stream.fromIterable([1, 2, 2, 3, 4, 4, 5]);

Future<void> main() async {
  print(await source().distinct().toList());
  print(await source().where((n) => n.isEven).map((n) => n * 10).toList());
  print(await source().take(3).toList());
  print(await source().expand((n) => [n, n]).take(4).toList());
  print(await source().asyncMap((n) async => 'id$n').take(2).toList());
  print(await source().length);
}`,
        note: "الناتج بالترتيب: [1, 2, 3, 4, 5] ثم [20, 20, 40, 40] ثم [1, 2, 2] ثم [1, 1, 2, 2] ثم [id1, id2] ثم 7.",
      },
      pitfall: "<code>map((x) async =&gt; ...)</code> بتدّيك <code>Stream&lt;Future&lt;T&gt;&gt;</code> مش <code>Stream&lt;T&gt;</code>، وغالبا مش اللي عايزه. لما التحويل بيرجّع Future استخدم <code>asyncMap</code>.",
    },
    {
      title: "periodic والأخطاء",
      en: "Stream.periodic and error handling",
      body: "<p><code>Stream.periodic(duration, fn)</code> بتبعت event كل فترة (للعدّادات والـ polling) ومبتخلصش لوحدها، فاستخدم <code>take</code> أو <code>cancel</code>. وعن الأخطاء: في <code>listen</code> الخطأ بيروح لـ <code>onError</code> وبعدها الـ stream <b>بيكمل</b> (إلا لو حطيت <code>cancelOnError: true</code>). في <code>await for</code> الخطأ بيتحول لـ exception جوه اللفة، وبتمسكه بـ try/catch، واللفة بتقف.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:async';

Future<void> main() async {
  final ticks = Stream.periodic(
    const Duration(milliseconds: 5),
    (i) => i,
  ).take(3);
  print(await ticks.toList());            // [0, 1, 2]

  final c = StreamController<int>();
  c.stream.listen(print, onError: (Object e) => print('error: $e'));
  c.add(1);
  c.addError('bad');                      // listen keeps going
  c.add(2);
  await c.close();

  final c2 = StreamController<int>();
  c2.add(1);
  c2.addError('bad');
  c2.add(2);
  c2.close();
  try {
    await for (final v in c2.stream) {
      print('c2 $v');
    }
  } catch (e) {
    print('c2 caught $e');                // the loop stops here
  }
}`,
        note: "الناتج: [0, 1, 2] ثم 1, error: bad, 2 ثم c2 1, c2 caught bad. الـ 2 الأخيرة في c2 مبتتقراش.",
      },
      interview: [
        { q: "إيه اللي بيحصل لما stream يبعت error؟", a: "الخطأ بيتبعت كـ event عادي. مع <code>listen</code> بيروح للـ <code>onError</code> والـ stream بيكمل ويبعت اللي بعده (إلا لو <code>cancelOnError: true</code>). مع <code>await for</code> بيتحول لـ exception جوه اللفة، فبمسكه بـ try/catch واللفة بتقف. ولو الـ stream جاي من <code>async*</code> وحصل <code>throw</code> جواه، الخطأ بيتبعت والـ stream بيتقفل." },
      ],
    },
    {
      title: "فين بتشوف الـ Streams في Flutter",
      en: "Streams in Flutter",
      body: "<p>مش هتكتب <code>StreamController</code> كل يوم، لكن هتستخدم Streams جاهزة في كل مكان:</p>",
      points: [
        "<b>StreamBuilder</b>: widget بيسمع stream ويعيد البناء مع كل event، وبيعمل cancel لوحده في dispose.",
        "<b>Bloc / Cubit</b>: الـ state عبارة عن <code>Stream&lt;State&gt;</code>، و<code>BlocBuilder</code> بيسمعه.",
        "<b>Firebase</b>: <code>collection.snapshots()</code> بترجّع stream بيتحدث لحظيا مع أي تغيير في الداتا.",
        "<b>WebSocket</b> و<b>GPS location</b> و<b>connectivity</b>: كلها Streams من plugins.",
        "<b>Riverpod</b> <code>StreamProvider</code> بيحوّل stream لـ <code>AsyncValue</code>.",
      ],
      interview: [
        { q: "فين بتستخدم الـ Streams في تطبيق Flutter؟", a: "في <code>StreamBuilder</code> لعرض بيانات لحظية، وفي Bloc لأن الـ state بيطلع كـ stream، وفي Firebase <code>snapshots()</code> للتحديثات المباشرة، وفي WebSocket وlocation وconnectivity. أنا بسمع بـ <code>StreamBuilder</code> أو الـ state management عشان الـ cancel يتعمل أوتوماتيك، ولو بعمل <code>listen</code> بإيدي ببقى متأكد إني بعمل cancel في <code>dispose</code>." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: async* و await for",
      lang: "dart",
      code: `Stream<int> evens(int max) async* {
  for (var i = 2; i <= max; i += 2) {
    yield i;
  }
}

Future<void> main() async {
  await for (final n in evens(6)) {
    print(n);
  }
}`,
    },
    {
      title: "اكتب: StreamController",
      lang: "dart",
      code: `import 'dart:async';

Future<void> main() async {
  final c = StreamController<String>();
  c.stream.listen(
    (v) => print('got $v'),
    onDone: () => print('done'),
  );
  c.add('a');
  c.add('b');
  await c.close();
}`,
    },
    {
      title: "اكتب: كلاس بيسمع وبيقفل",
      lang: "dart",
      code: `import 'dart:async';

class Watcher {
  StreamSubscription<int>? _sub;

  void start(Stream<int> source) {
    _sub = source.listen((v) => print('value $v'));
  }

  Future<void> dispose() async {
    await _sub?.cancel();
    _sub = null;
  }
}`,
    },
  ],

  tasks: [
    {
      title: "الأرقام الزوجية",
      lang: "dart",
      prompt: "<p>اكتب <code>Stream&lt;int&gt; evensUpTo(int max)</code> بـ <code>async*</code>: تبعت الأرقام الزوجية من 2 لحد <code>max</code> (شاملة)، وبعد كل رقم تستنى 5 ملي ثانية. ولو <code>max</code> أقل من 2 الـ stream بيخلص من غير ما يبعت حاجة.</p>",
      examples: [
        { in: "await evensUpTo(7).toList()", out: "[2, 4, 6]" },
        { in: "await evensUpTo(1).toList()", out: "[]" },
      ],
      hints: [
        "ابدأ <code>for (var i = 2; i &lt;= max; i += 2)</code>.",
        "جوه اللفة: <code>yield i;</code> وبعدها <code>await Future.delayed(...)</code>.",
      ],
      solution: `Stream<int> evensUpTo(int max) async* {
  for (var i = 2; i <= max; i += 2) {
    yield i;
    await Future.delayed(const Duration(milliseconds: 5));
  }
}`,
      explain: "لو <code>max &lt; 2</code> الشرط يفشل من أول مرة واللفة متشتغلش. الدالة كسولة: مفيش حاجة بتحصل غير لما حد يسمع الـ stream.",
    },
    {
      title: "مجموع الأرقام الفردية",
      lang: "dart",
      prompt: "<p>اكتب <code>Future&lt;int&gt; sumOfOdds(Stream&lt;int&gt; source)</code> بـ <code>await for</code>: تجمع الأرقام الفردية بس. لو الـ stream رمى خطأ في النص ترجّع <code>-1</code>.</p>",
      examples: [
        { in: "sumOfOdds(Stream.fromIterable([1, 2, 3, 4, 5]))", out: "9" },
      ],
      hints: [
        "ابدأ بمتغير <code>total = 0</code> وجوه <code>await for</code> افحص <code>n.isOdd</code>.",
        "غلّف اللفة كلها في <code>try/catch</code> وارجع <code>-1</code> من الـ catch.",
      ],
      solution: `Future<int> sumOfOdds(Stream<int> source) async {
  var total = 0;
  try {
    await for (final n in source) {
      if (n.isOdd) total += n;
    }
  } catch (_) {
    return -1;
  }
  return total;
}`,
      explain: "<code>await for</code> بتحول خطأ الـ stream لـ exception عادي فـ try/catch بتمسكه. اللفة بتوقف عند الخطأ، فمفيش داعي نكمل.",
    },
    {
      title: "عدّاد بيبعت state",
      lang: "dart",
      prompt: "<p>اكتب كلاس <code>Counter</code> فيه: <code>Stream&lt;int&gt; get stream</code> (broadcast، عشان أكتر من widget يسمعوه)، و<code>void increment()</code> بتزود القيمة 1 وتبعتها على الـ stream (تبدأ من 0 فأول increment يبعت 1)، و<code>void dispose()</code> بتقفل الـ controller.</p>",
      examples: [{ in: "c.increment(); c.increment();", out: "stream emits 1, then 2" }],
      hints: [
        "محتاج field خاص <code>StreamController&lt;int&gt;.broadcast()</code> و<code>int _value = 0</code>.",
        "<code>stream</code> getter بيرجّع <code>_controller.stream</code>، و<code>dispose</code> بتنادي <code>close()</code>.",
      ],
      solution: `import 'dart:async';

class Counter {
  final _controller = StreamController<int>.broadcast();
  int _value = 0;

  Stream<int> get stream => _controller.stream;

  void increment() {
    _value++;
    _controller.add(_value);
  }

  void dispose() {
    _controller.close();
  }
}`,
      explain: "الـ controller خاص (<code>_</code>) والكلاس بيكشف <code>stream</code> بس، فمحدش برا يقدر يبعت events. ده نفس تصميم Cubit. الـ broadcast عشان مستمع ثاني ميطلعش بـ StateError.",
    },
  ],

  quiz: [
    {
      q: "أنهي واحدة أنسب لـ <code>Stream</code> مش <code>Future</code>؟",
      options: [
        "تحميل بروفايل المستخدم من API مرة واحدة",
        "قراءة ملف إعدادات صغير عند فتح التطبيق",
        "رسايل شات بتوصل طول ما المحادثة مفتوحة",
        "حفظ طلب جديد في الـ database",
      ],
      answer: 2,
      why: "الشات بيبعت قيم كتير على مدار الوقت، ده شغل Stream. الباقي عملية واحدة بنتيجة واحدة: Future.",
    },
    {
      q: "إيه اللي بيحصل في الكود ده؟",
      code: {
        lang: "dart",
        src: `Stream<int> gen() async* {
  yield 1;
  yield 2;
}

void main() {
  final s = gen();
  s.listen(print);
  s.listen(print);
}`,
      },
      options: [
        "الاتنين يطبعوا 1 و 2",
        "الـ listen التانية بترمي <code>StateError</code> لأن الـ stream single-subscription",
        "التانية تتجاهل بصمت",
        "خطأ كومبايل",
      ],
      answer: 1,
      why: "الـ stream اللي بيطلع من <code>async*</code> ليه مستمع واحد بس. للاستماع المتعدد حوّله بـ <code>asBroadcastStream()</code> أو استخدم <code>StreamController.broadcast</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `import 'dart:async';

void main() {
  final b = StreamController<int>.broadcast();
  b.add(1);
  b.stream.listen(print);
  b.add(2);
}`,
      },
      answer: ["2"],
      why: "الـ broadcast مبيخزّنش events. <code>1</code> اتبعتت قبل ما حد يسمع فضاعت، و<code>2</code> اتبعتت بعد الاستماع فوصلت.",
    },
    {
      q: "الناتج إيه؟ (الترتيب)",
      code: {
        lang: "dart",
        src: `Stream<int> numbers() async* {
  print('body');
  yield 1;
}

void main() {
  final s = numbers();
  print('created');
  s.listen(print);
}`,
      },
      options: ["body, created, 1", "created, 1, body", "body, 1, created", "created, body, 1"],
      answer: 3,
      why: "دالة <code>async*</code> كسولة: جسمها مبيبدأش غير لما حد يعمل <code>listen</code>. فـ <code>created</code> الأول وبعدها <code>body</code> ثم <code>1</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `Future<void> main() async {
  final list = await Stream.fromIterable([1, 2, 3])
      .map((x) => x * 2)
      .toList();
  print(list);
}`,
      },
      answer: ["[2, 4, 6]"],
      why: "<code>map</code> بتبني stream جديد بالقيم المضروبة، و<code>toList()</code> بتجمعها في Future بقايمة.",
    },
    {
      q: "في الكلاس ده فيه leak. إيه الإصلاح؟",
      code: {
        lang: "dart",
        src: `import 'dart:async';

class Tracker {
  late final StreamSubscription<int> _sub;

  void start(Stream<int> s) {
    _sub = s.listen((v) => print(v));
  }

  void dispose() {}
}`,
      },
      options: [
        "نكتب <code>_sub.cancel();</code> جوه <code>dispose</code>",
        "نغيّر <code>listen</code> لـ <code>await for</code>",
        "نشيل <code>late</code>",
        "نحط <code>print</code> جوه <code>dispose</code>",
      ],
      answer: 0,
      why: "من غير <code>cancel</code> الاشتراك بيفضل شغال بعد ما الكلاس اتخلص منه. الصح إن <code>dispose</code> تنادي <code>_sub.cancel()</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `Stream<int> a() async* {
  yield 1;
  yield 2;
}

Stream<int> b() async* {
  yield 0;
  yield* a();
  yield 3;
}

Future<void> main() async {
  print(await b().toList());
}`,
      },
      options: ["[0, 3]", "[0, 1, 3]", "[0, 1, 2, 3]", "[0, [1, 2], 3]"],
      answer: 2,
      why: "<code>yield*</code> بتمرّر كل events الـ stream التاني واحد واحد، فبيتفرد بينهم مش بيتحط كـ list جوه list.",
    },
    {
      q: "الناتج إيه؟",
      code: {
        lang: "dart",
        src: `import 'dart:async';

Future<void> main() async {
  final c = StreamController<int>();
  c.stream.listen(
    (v) => print('v $v'),
    onError: (Object e) => print('e $e'),
  );
  c.add(1);
  c.addError('bad');
  c.add(2);
  await c.close();
}`,
      },
      options: [
        "v 1 ثم e bad وبيقف",
        "v 1, e bad, v 2",
        "e bad ثم v 1 ثم v 2",
        "v 1, v 2 بس",
      ],
      answer: 1,
      why: "مع <code>listen</code> الخطأ بيروح لـ <code>onError</code> والـ stream بيكمل (الافتراضي <code>cancelOnError: false</code>)، فبتوصل <code>v 2</code> كمان.",
    },
    {
      q: "عايز تحوّل كل رقم في stream بدالة <code>Future&lt;String&gt; fetchName(int id)</code> وتاخد <code>Stream&lt;String&gt;</code>. تستخدم إيه؟",
      options: [
        "<code>map(fetchName)</code>: بترجّع <code>Stream&lt;String&gt;</code>",
        "<code>asyncMap(fetchName)</code>",
        "<code>where(fetchName)</code>",
        "<code>expand(fetchName)</code>",
      ],
      answer: 1,
      why: "<code>asyncMap</code> بتستنى الـ Future وتبعت نتيجته. <code>map</code> هتديك <code>Stream&lt;Future&lt;String&gt;&gt;</code>، و<code>where</code> محتاجة bool، و<code>expand</code> محتاجة Iterable.",
    },
    {
      q: "تلات widgets مختلفة عايزين يسمعوا نفس stream أحداث التطبيق. إيه المناسب؟",
      options: [
        "<code>StreamController.broadcast()</code>",
        "<code>StreamController()</code> العادي",
        "<code>Future</code> واحد",
        "<code>async*</code> منفصل لكل widget من غير مشاركة",
      ],
      answer: 0,
      why: "الـ broadcast بيسمح بأكتر من مستمع في نفس الوقت. العادي هيرمي StateError عند المستمع التاني.",
    },
  ],
};
