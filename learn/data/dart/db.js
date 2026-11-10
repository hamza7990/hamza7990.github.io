window.LEVELS = window.LEVELS || {};
window.LEVELS["dart/db"] = {
  boss: [
    {
      q: "إيه الفرق بين <code>var</code> و <code>final</code> و <code>const</code>؟",
      a: `<p><code>var</code> متغير بيتحدد نوعه من أول قيمة وينفع تتغير قيمته بعد كده. <code>final</code> بتتعيّن مرة واحدة وقت التشغيل، زي <code>final now = DateTime.now()</code>. <code>const</code> لازم قيمتها تكون معروفة وقت الكومبايل، وبتبقى ثابتة بعمق: <code>const [1, 2]</code> مينفعش تعمل عليها <code>add</code>. وكمان القيم الـ const المتطابقة بتتشارك نسخة واحدة في الميموري، وده سبب إننا بنحط <code>const</code> قدام الـ widgets في Flutter. الخطأ الشائع إن <code>final list</code> مش معناها إن القايمة ثابتة، معناها بس إن المتغير مبيشاورش على قايمة تانية.</p>`,
    },
    {
      q: "اشرح <code>?</code> و <code>??</code> و <code>?.</code> و <code>!</code> و <code>late</code> في Dart.",
      a: `<p>Dart فيها sound null safety: النوع العادي مش بيقبل null، و<code>String?</code> بيقبل. <code>?.</code> بتوقف لو اللي قبلها null وبترجّع null. <code>??</code> بتديك قيمة بديلة لو الشمال null. <code>!</code> بتقول للـ compiler «أنا متأكد إنها مش null»، ولو طلعت null فعلا البرنامج هيرمي exception، فبستخدمها في أضيق الحدود. <code>late</code> بتقول إن المتغير مش nullable وهتتحط قيمته قبل أول استخدام، ولو اتقرا قبل كده بيرمي <code>LateInitializationError</code> وقت التشغيل. وأفضل من <code>!</code> إني أفحص <code>if (x != null)</code> عشان الـ type promotion يشتغل على المتغير المحلي.</p>`,
    },
    {
      q: "اكتب دالة <code>greet</code> بتاخد اسم إجباري، وتحية اختيارية قيمتها الافتراضية <code>Hello</code>، وعدد مرات اختياري قيمته الافتراضية 1، كلهم named parameters، وترجّع التحية متكررة بعدد المرات.",
      a: `<p>الاسم بيتعمله <code>required</code> لأنه non-nullable ومن غير default، والباقي بيخدوا default في الـ signature:</p><pre dir='ltr'><code>String greet({
  required String name,
  String greeting = 'Hello',
  int times = 1,
}) {
  return List.filled(times, '$greeting, $name!').join(' ');
}

// greet(name: 'Hamza')                           -> Hello, Hamza!
// greet(name: 'Ali', greeting: 'Hi', times: 2)   -> Hi, Ali! Hi, Ali!</code></pre><p>الـ named parameters بتخلي النداء مقروء ومبتعتمدش على الترتيب، وده الشكل المستخدم في constructors الـ widgets.</p>`,
    },
    {
      q: "عندك قايمة فيها عناصر متكررة وعايز تشيل التكرار وتحافظ على الترتيب الأصلي. وإيه الفرق بين <code>List</code> و <code>Set</code> و <code>Map</code>؟",
      a: `<p><code>List</code> مرتبة وتقبل التكرار وبتتوصل لعناصرها بالـ index. <code>Set</code> من غير تكرار والبحث فيها سريع. <code>Map</code> أزواج مفتاح وقيمة والمفاتيح مش بتتكرر. لإزالة التكرار: <code>list.toSet().toList()</code>. وده بيحافظ على الترتيب لأن الـ Set الافتراضي في Dart (LinkedHashSet) بيفتكر ترتيب الإدخال. وبعدين فيه الـ spread <code>[...a, ...b]</code> والـ collection if/for لبناء القوايم، والـ <code>map/where</code> بيرجّعوا Iterable كسول فبنحتاج <code>toList()</code> عشان نثبت النتيجة.</p>`,
    },
    {
      q: "إيه هو الـ closure؟ وإيه المشكلة في عدّاد بيستخدم متغير برا الدالة؟",
      a: `<p>الـ closure دالة بتفتكر المتغيرات اللي حواليها وقت ما اتعرّفت، حتى لو اتنادت بعدين من مكان تاني. مثال: دالة <code>makeCounter()</code> بتعرّف <code>var n = 0</code> وبترجّع دالة بتزود <code>n</code> وترجّعه. كل استدعاء لـ <code>makeCounter</code> بيعمل <code>n</code> خاص بيه فالعدّادات مستقلة. والتنبيه: الـ closure بتشوف <b>آخر قيمة</b> للمتغير مش القيمة وقت التعريف، لأنها بتمسك المتغير نفسه. وفي Flutter ده بيظهر في الـ callbacks زي <code>onPressed</code> اللي بتقرا متغيرات الـ State.</p>`,
    },
    {
      q: "إيه الفرق بين generative constructor و named constructor و factory constructor؟ ومتى تستخدم const constructor؟",
      a: `<p>الـ generative العادي بيبني object جديد دايما. Dart مفيهاش overloading فبنعمل <b>named constructors</b> زي <code>User.fromJson</code> عشان ندي أكتر من طريقة بناء. الـ <b>factory</b> مش لازم يبني object جديد: ممكن يرجّع واحد من cache أو subtype، ومفيهوش <code>this</code>. الـ <b>const constructor</b> بيشتغل لما كل الـ fields <code>final</code>، وبيخلي الـ object ثابت وقت الكومبايل وتتشارك نسخته، وده اللي بيخلي الـ const widgets أخف لأن Flutter مبيعيدش بناءها. وفي الـ initializer list (بعد <code>:</code>) بحط قيم الـ final fields المحسوبة والـ <code>assert</code>.</p>`,
    },
    {
      q: "إيه الفرق بين <code>extends</code> و <code>with</code> و <code>implements</code>؟ إمتى تستخدم كل واحدة؟",
      a: `<p><code>extends</code> وراثة من كلاس واحد بس: بتاخد كوده وحالته. <code>with</code> بتضيف mixin: كود مشترك بتاخده من غير ما يبقى أب، وينفع أكتر من واحد. <code>implements</code> بتاخد الـ interface بس: كل كلاس في Dart هو interface، فبتلتزم تكتب كل الميثودات بنفسك من غير ما ترث كود. بستخدم <code>extends</code> لعلاقة «هو نوع من»، و<code>with</code> لسلوك مشترك زي logging، و<code>implements</code> لما أعمل fake أو بديل لكلاس في الاختبارات. والأفضل غالبا composition (كلاس يحتوي على كلاس تاني) على الوراثة العميقة.</p>`,
    },
    {
      q: "إيه هو الـ sealed class؟ وإزاي بيفيد مع الـ switch؟",
      a: `<p>الـ <code>sealed class</code> بتحدد إن كل الكلاسات اللي بترثها لازم تكون في نفس الـ library، فالـ compiler عارف الاحتمالات كلها. ولما أعمل <code>switch</code> على object من النوع ده، لازم أغطي كل الأنواع الفرعية، ولو نسيت واحدة بيدي خطأ كومبايل من غير <code>default</code>. وكمان لو ضفت نوع جديد بعدين الـ compiler بيورّيني كل switch محتاج تحديث. بستخدمها لتمثيل حالات الـ state زي <code>Loading / Loaded / Error</code> أو نتيجة <code>Success / Failure</code>، مع patterns زي <code>Success(:final value) =&gt; ...</code>.</p>`,
    },
    {
      q: "إيه هي الـ records في Dart 3؟ وإمتى تفضّلها على كلاس صغير؟",
      a: `<p>الـ record قيمة مركبة خفيفة: <code>(int, String)</code> أو بأسماء <code>({int id, String name})</code>. من غير تعريف كلاس، وليها <code>==</code> و<code>hashCode</code> بالقيمة جاهزين. بستخدمها لإرجاع أكتر من قيمة من دالة وفكها بـ pattern: <code>final (min, max) = range(list);</code>. وبفضّل كلاس لما الـ object ليه معنى في الدومين، ومحتاج ميثودات أو validation أو اسم واضح. الـ record للحاجات المحلية والمؤقتة.</p>`,
    },
    {
      q: "إيه الفرق بين <code>Exception</code> و <code>Error</code>؟ وإزاي بتتعامل مع الاتنين؟",
      a: `<p><code>Exception</code> حالة متوقعة ممكن تحصل في برنامج سليم (نت قطع، input غلط)، فبمسكها وبتعامل معاها بـ <code>on FormatException catch (e)</code>. <code>Error</code> bug برمجي زي <code>RangeError</code> أو <code>StateError</code>، فمبمسكوش، بصلّح الكود. ببني exceptions خاصة بـ <code>implements Exception</code> فيها بيانات مفيدة وبـ <code>toString</code>. وبكتب <code>rethrow</code> (مش <code>throw e</code>) لو سجّلت الخطأ وعايز أكمل رميه عشان الـ stack trace يفضل أصلي. ومعنديش catch فاضي أبدا. وللفشل المتوقع ممكن أرجّع <code>sealed Result</code> بدل الـ throw.</p>`,
    },
    {
      q: `الناتج إيه؟ اشرح ليه.<pre dir='ltr'><code>import 'dart:async';

void main() {
  print('1');
  Future(() =&gt; print('2'));
  scheduleMicrotask(() =&gt; print('3'));
  Future.delayed(Duration.zero, () =&gt; print('4'));
  Future.microtask(() =&gt; print('5'));
  print('6');
}</code></pre>`,
      a: `<p>الناتج: <code>1 6 3 5 2 4</code> (كل رقم في سطر). الكود العادي في <code>main</code> بيخلص الأول، فـ 1 و 6. بعدين الـ event loop يفضّي الـ microtask queue كلها بترتيب التسجيل: <code>scheduleMicrotask</code> (3) و<code>Future.microtask</code> (5). وبعدين بياخد الـ events واحد واحد: <code>Future()</code> (2) وبعدها <code>Future.delayed(Duration.zero)</code> (4) لأنها اتسجلت بعدها. القاعدة: sync، بعدين كل الـ microtasks، بعدين event واحد واحد.</p>`,
    },
    {
      q: `الناتج إيه بالترتيب؟ وليه <code>b2</code> بتيجي قبل <code>e1</code>؟<pre dir='ltr'><code>import 'dart:async';

Future&lt;void&gt; a() async {
  print('a1');
  await b();
  print('a2');
}

Future&lt;void&gt; b() async {
  print('b1');
  await Future&lt;void&gt;.delayed(Duration.zero);
  print('b2');
}

void main() {
  print('m1');
  a();
  Future(() =&gt; print('e1'));
  Future.microtask(() =&gt; print('mt'));
  print('m2');
}</code></pre>`,
      a: `<p>الناتج: <code>m1 a1 b1 m2 mt b2 a2 e1</code>. الدالة <code>async</code> بتشتغل بشكل عادي لحد أول <code>await</code> حقيقي، فبعد m1 بتطبع a1 وبتنادي b فتطبع b1، وبعدين b بتسجل timer صفري في الـ event queue وبترجّع Future فـ a بتتعلّق، و<code>main</code> يكمل: يسجل <code>Future(...)</code> في الـ event queue بعد الـ timer، ويسجل الـ microtask ويطبع m2. بعد <code>main</code> الـ microtask (mt) بتشتغل. وبعدين الـ events بترتيب تسجيلها: timer بتاع b الأول فتطبع b2، ولما b تخلص بتكمل a في microtask فتطبع a2 قبل ما ياخد event e1 التالي. خلاصة: الـ microtask بتتفضّى كلها بعد كل event.</p>`,
    },
    {
      q: "عندك طلبين API مستقلين: <code>fetchUser()</code> و <code>fetchOrders()</code>. اكتب دالة <code>loadDashboard</code> بتشغّلهم مع بعض، بتستنى 5 ثواني بالكتير، وبترجّع رسالة مناسبة لو حصل timeout أو فشل.",
      a: `<p>ببدأ الاتنين قبل أي <code>await</code> عشان يشتغلوا بالتوازي، وبستخدم <code>Future.wait</code> مع <code>timeout</code>، وبمسك <code>TimeoutException</code> الأول وبعدين أي <code>Exception</code>:</p><pre dir='ltr'><code>import 'dart:async';

Future&lt;String&gt; loadDashboard() async {
  final userFuture = fetchUser();
  final ordersFuture = fetchOrders();
  try {
    await Future.wait([userFuture, ordersFuture])
        .timeout(const Duration(seconds: 5));
    final user = await userFuture;
    final orders = await ordersFuture;
    return '$user has \${orders.length} orders';
  } on TimeoutException {
    return 'Server is slow, try again';
  } on Exception catch (e) {
    return 'Failed: $e';
  }
}</code></pre><p>الوقت هو أطول طلب مش مجموع الاتنين. بعد الـ <code>Future.wait</code> الـ <code>await userFuture</code> بترجّع فورا لأنه خلص. ولو واحد فشل، <code>Future.wait</code> بترمي أول خطأ بعد ما تستنى الباقي، أو فورا مع <code>eagerError: true</code>.</p>`,
    },
    {
      q: "إيه الفرق بين <code>Future</code> و <code>Stream</code>؟ وإيه الفرق بين single-subscription و broadcast؟ وإزاي بيحصل leak؟",
      a: `<p>الـ <code>Future</code> نتيجة واحدة هتوصل، والـ <code>Stream</code> سلسلة events على مدار الوقت (قيم وأخطاء) وممكن تتقفل. الـ stream العادي له مستمع واحد وبيخزّن events لحد ما حد يسمع، ولو سمعته مرتين بيرمي StateError. الـ broadcast ليه أكتر من مستمع في نفس الوقت من غير تخزين، فاللي بيسمع متأخر بيفوّت اللي فات. الـ leak بيحصل لما أعمل <code>listen</code> وأنسى <code>cancel()</code> على الـ <code>StreamSubscription</code> فالـ callback بيفضل ماسك الـ State، وكمان لازم أقفل أي <code>StreamController</code> بـ <code>close()</code>. بنعمل ده في <code>dispose()</code>، و<code>StreamBuilder</code> بيعمله لوحده.</p>`,
    },
    {
      q: "اكتب كلاس <code>User</code> (فيه <code>id</code> و <code>name</code>) immutable، فيه <code>copyWith</code> و <code>==</code> و <code>hashCode</code> صح. وليه لازم الاتنين سوا؟",
      a: `<p>الحقول <code>final</code>، والـ <code>copyWith</code> بـ nullable parameters و<code>??</code>، والـ <code>==</code> و<code>hashCode</code> بنفس الحقول:</p><pre dir='ltr'><code>class User {
  final int id;
  final String name;
  const User({required this.id, required this.name});

  User copyWith({int? id, String? name}) =&gt;
      User(id: id ?? this.id, name: name ?? this.name);

  @override
  bool operator ==(Object other) =&gt;
      identical(this, other) ||
      other is User &amp;&amp; other.id == id &amp;&amp; other.name == name;

  @override
  int get hashCode =&gt; Object.hash(id, name);
}</code></pre><p>العقد: لو <code>a == b</code> لازم نفس الـ <code>hashCode</code>. الـ Set والـ Map بيبدأوا بالـ hash، فلو عملت <code>==</code> بس هتلاقي نفس المستخدم مرتين في Set والبحث بالمفتاح في Map مبيلاقيش. وبالـ immutable + <code>==</code> الـ Bloc والـ Provider يقدروا يقارنوا القديم بالجديد صح. (حدود <code>copyWith</code> دي: مينفعش تعيّن بيها field nullable لـ null، لأن <code>null</code> معناها «سيب القديم».)</p>`,
    },
    {
      q: "لما بنقول state لازم يبقى immutable في Bloc أو Riverpod، إيه اللي بيحصل لو عدّلت القايمة اللي جواه بدل ما أبني state جديد؟",
      a: `<p>أدوات الـ state management بتقارن الـ state القديم بالجديد (بـ <code>==</code> أو identity) عشان تقرر تعيد بناء الـ UI. لو عملت <code>state.items.add(x)</code> وبعتّ نفس الـ object، المقارنة بتلاقيه هو هو فمفيش rebuild والـ UI بتفضل قديمة، وده bug صعب في التتبع لأن البيانات اتغيرت فعلا. الصح: <code>emit(state.copyWith(items: [...state.items, x]))</code> يعني state جديد وقايمة جديدة. وبحط القايمة جوه الـ state كـ <code>List.unmodifiable</code> عشان محدش يعدلها بالغلط. وبعرّف <code>==</code> بالقيمة (يدوي أو Equatable) عشان الـ states المتساوية فعلا مبيعيدوش البناء من غير داعي.</p>`,
    },
    {
      q: "إمتى تستخدم isolate في تطبيق Flutter؟ وإيه اللي بيحصل للبيانات اللي بتتبعت له؟",
      a: `<p>أستخدمه للشغل اللي بيأكل CPU وممكن يجمّد الـ UI، زي parse لـ JSON كبير أو تشفير أو معالجة صور. الـ <code>async/await</code> مش كفاية لده لأنها بتحل الانتظار على I/O مش الحسابات اللي بتحجز نفس الـ thread. الـ isolate ليه ميموري وevent loop خاصين بيه، وبيتواصل برسايل بتتنسخ، فمفيش race conditions. أبسط استخدام <code>await Isolate.run(() =&gt; parse(raw))</code>، وفي Flutter <code>compute</code>. البيانات لازم تكون قابلة للإرسال (أنواع بسيطة، قوايم، records، objects عادية)، ومينفعش أبعت حاجات مربوطة بموارد النظام زي <code>ReceivePort</code>. وليه تكلفة تشغيل ونسخ بيانات، فمبستخدمهوش للشغل الخفيف.</p>`,
    },
  ],
};
