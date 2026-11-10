window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f5"] = {
  slides: [
    {
      kicker: "الفكرة",
      title: "التنقل = stack من الصفحات",
      en: "Navigator 1.0: the route stack",
      body: "<p>الـ <code>Navigator</code> (اللي بتجهزه <code>MaterialApp</code>) ماسك <b>stack</b> من الـ routes. الصفحة اللي فوق هي اللي بتظهر. <code>push</code> بتحط صفحة جديدة فوق، و<code>pop</code> بتشيل اللي فوق وترجعك للي تحتها (ده نفس زرار الرجوع).</p>",
      code: {
        lang: "dart",
        src: `// open details
Navigator.of(context).push(
  MaterialPageRoute(builder: (_) => const DetailsPage()),
);

// go back
Navigator.of(context).pop();`,
        note: "الـ <code>MaterialPageRoute</code> بيعمل الحركة المناسبة للمنصة (slide في iOS، fade/zoom في Android). و <code>builder</code> بيبني الصفحة الجديدة.",
      },
      focus: [{ label: "احفظها", text: "<code>Navigator.of(context)</code> بتطلع في الشجرة لأقرب Navigator. عشان كده لازم الـ context يكون تحت <code>MaterialApp</code>." }],
    },
    {
      title: "بعت داتا وارجع بنتيجة",
      en: "Passing data forward and returning a result",
      body: "<p>الداتا اللي رايحة للصفحة الجديدة: <b>parameters في الـ constructor</b> (مضمونة النوع). والنتيجة الراجعة: <code>pop(value)</code> والـ <code>push</code> بترجع <code>Future</code> بالقيمة دي، فتستناها بـ <code>await</code>.</p>",
      codes: [{
        lang: "dart",
        title: "الصفحة اللي بتفتح",
        src: `Future<void> _pickCity() async {
  final city = await Navigator.of(context).push<String>(
    MaterialPageRoute(builder: (_) => const CityPage(current: 'Riyadh')),
  );
  if (!mounted) return;
  if (city != null) {
    setState(() => _city = city);
  }
}`,
        note: "النتيجة <code>String?</code>: لو المستخدم رجع بزرار الرجوع من غير ما يختار، القيمة <code>null</code>. وبعد الـ await لازم <code>mounted</code> (مستوى f2).",
      }, {
        lang: "dart",
        title: "جوه CityPage: بيرجع قيمة",
        src: `Navigator.of(context).pop('Jeddah');`,
      }],
      pitfall: "تفترض إن النتيجة مش null. المستخدم ممكن يرجع بالسحب أو زرار الرجوع من غير <code>pop(value)</code>، فاتعامل مع <code>null</code> دايما.",
    },
    {
      title: "pushReplacement و pushAndRemoveUntil",
      en: "Replacing and clearing the stack",
      terms: [
        ["push / pop", "فتح ورجوع", "إضافة صفحة فوق / شيل اللي فوق."],
        ["pushReplacement", "بدّل الحالية", "بتشيل الصفحة الحالية وتحط الجديدة مكانها. مثال: Splash ← Home (مينفعش يرجع للـ Splash)."],
        ["pushAndRemoveUntil", "امسح لحد شرط", "بتحط صفحة جديدة وتمسح من تحتها لحد ما الشرط يتحقق. <code>(route) =&gt; false</code> يعني امسح كل حاجة."],
        ["popUntil / maybePop", "ارجع لحد / ارجع لو ينفع", "<code>popUntil((r) =&gt; r.isFirst)</code> ترجع للأولى. <code>maybePop</code> بتحترم <code>PopScope</code>."],
      ],
      code: {
        lang: "dart",
        src: `// after a successful login: Home becomes the only page
Navigator.of(context).pushAndRemoveUntil(
  MaterialPageRoute(builder: (_) => const HomePage()),
  (route) => false,
);`,
        note: "بعد تسجيل الدخول أو الخروج بنمسح الـ stack كله عشان زرار الرجوع ميرجعش لصفحة الـ login.",
      },
      interview: [
        { q: "إيه الفرق بين push و pushReplacement و pushAndRemoveUntil؟", a: "<code>push</code> بتضيف صفحة فوق الـ stack وتفضل اللي تحتها. <code>pushReplacement</code> بتشيل الحالية وتحط الجديدة مكانها (Splash إلى Home). <code>pushAndRemoveUntil</code> بتحط الجديدة وتمسح من تحتها لحد ما predicate يرجع true، وبـ <code>(r) =&gt; false</code> بتمسح الكل، وده الاستخدام الشائع بعد login أو logout." },
      ],
    },
    {
      title: "Named routes: ليه الفرق موجود",
      en: "Named routes and why teams moved on",
      body: "<p>الأسلوب القديم: تسجل routes بأسماء نصية وتنتقل بـ <code>pushNamed</code>.</p>",
      codes: [{
        lang: "dart",
        src: `MaterialApp(
  initialRoute: '/',
  routes: {
    '/': (_) => const HomePage(),
    '/details': (_) => const DetailsPage(),
  },
)`,
      }, {
        lang: "dart",
        src: `Navigator.of(context).pushNamed('/details', arguments: 42);`,
        note: "الـ <code>arguments</code> بتتقرا بـ <code>ModalRoute.of(context)!.settings.arguments</code> وهي من نوع <code>Object?</code>.",
      }],
      points: [
        "<b>النصوص:</b> غلطة إملائية في الاسم مبتتكشفش وقت الكومبايل.",
        "<b>arguments من غير نوع:</b> لازم cast يدوي.",
        "<b>الويب والـ deep links:</b> مفيش مسار URL حقيقي بيتحلل لـ stack من صفحات، ولا back/forward في المتصفح.",
        "عشان كده الفرق اتجهت لـ <code>go_router</code> (حزمة رسمية من فريق Flutter) بتدي URLs حقيقية ومسارات typed نسبيا.",
      ],
      interview: [
        { q: "ليه الفرق بطلت تستخدم named routes العادية؟", a: "لأن الأسماء نصوص من غير فحص وقت الكومبايل، والـ arguments بتتمرر كـ <code>Object?</code> وبتحتاج cast، ومفيش دعم قوي للـ deep links والـ URLs في الويب ولا لتغيير الـ stack ككل من رابط. الحزم الـ declarative زي <code>go_router</code> بتعرف المسارات في مكان واحد بـ path parameters وquery parameters وredirects وبتتعامل مع المتصفح." },
      ],
    },
    {
      title: "go_router: الأساس",
      en: "go_router: routes and MaterialApp.router",
      body: "<p><code>go_router</code> <b>حزمة</b> مش جزء من الـ SDK. تضيفها بـ <code>flutter pub add go_router</code> (بتتحط في <code>pubspec.yaml</code>) وتعمل <code>import 'package:go_router/go_router.dart';</code>. بتعرّف شجرة المسارات مرة واحدة وبتديها لـ <code>MaterialApp.router</code>.</p>",
      code: {
        lang: "dart",
        title: "lib/router.dart",
        src: `import 'package:go_router/go_router.dart';

final GoRouter router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
      routes: [
        GoRoute(
          path: 'property/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return PropertyPage(id: id);
          },
        ),
      ],
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginPage(),
    ),
  ],
);

// main.dart
// MaterialApp.router(routerConfig: router)`,
        note: "المسار الابن (<code>property/:id</code>) من غير <code>/</code> في الأول لأنه تحت <code>/</code>، فعنوانه الكامل <code>/property/42</code>. الـ <code>:id</code> هو path parameter.",
      },
      points: [
        "المسارات المتداخلة (<code>routes:</code> جوه route) بتبني stack: فتح <code>/property/42</code> يخلي زرار الرجوع يروح <code>/</code>.",
        "الـ <code>pathParameters</code> دايما <code>String</code> فحوّلها (<code>int.parse</code>) لو محتاج رقم.",
      ],
    },
    {
      title: "path و query parameters",
      en: "Path parameters vs query parameters",
      terms: [
        ["path parameter", "جزء من المسار", "<code>/property/42</code>: بيحدد <b>مين</b> المورد. مطلوب. بتقراه من <code>state.pathParameters['id']</code>."],
        ["query parameter", "بعد علامة الاستفهام", "<code>/search?q=villa&amp;city=riyadh</code>: فلاتر اختيارية. بتقراه من <code>state.uri.queryParameters['q']</code>."],
      ],
      code: {
        lang: "dart",
        src: `final searchRoute = GoRoute(
  path: '/search',
  builder: (context, state) {
    final q = state.uri.queryParameters['q'] ?? '';
    final city = state.uri.queryParameters['city'];
    return SearchResults(query: q, city: city);
  },
);`,
        note: "للتنقل: <code>context.go('/search?q=villa&amp;city=riyadh')</code>. القاعدة: الهوية في الـ path (id)، والاختياري (فلاتر، ترتيب، صفحة) في الـ query. كده الرابط ينفع يتشارك ويرجع نفس الشاشة.",
      },
      pitfall: "تمرر object كبير عن طريق <code>extra</code> وتعتمد عليه. الـ <code>extra</code> مبتتحفظش في الرابط، فبعد refresh في الويب أو deep link هيبقى <code>null</code>. مرر id وهات الداتا في الصفحة.",
    },
    {
      title: "go ولا push؟",
      en: "context.go vs context.push",
      points: [
        "<code>context.go('/property/42')</code>: <b>بتستبدل</b> الـ stack كله بالمسار ده (وبتبني الآباء من شجرة المسارات). زي ما تكتب رابط في المتصفح. مناسبة للتنقل الأساسي (تابات، بعد login).",
        "<code>context.push('/property/42')</code>: <b>بتضيف</b> فوق الـ stack زي <code>Navigator.push</code>. وبترجع <code>Future</code> بنتيجة لو الصفحة عملت <code>pop(value)</code>. مناسبة لصفحات مؤقتة (اختيار مدينة، فورم).",
        "<code>context.pop()</code> للرجوع (وبتقبل نتيجة)، و<code>context.replace</code> لاستبدال الأعلى.",
      ],
      code: {
        lang: "dart",
        src: `// permanent navigation: replaces what was below
context.go('/login');

// temporary page that returns a value
final city = await context.push<String>('/pick-city');
if (!context.mounted) return;`,
        note: "تعامل مع <code>await</code> بنفس الحذر: فحص <code>context.mounted</code> بعدها.",
      },
      interview: [
        { q: "إيه الفرق بين context.go و context.push في go_router؟", a: "<code>go</code> بتروح للمسار وتستبدل الـ stack بما يناسبه من شجرة المسارات، زي كتابة رابط جديد، فمناسبة للتنقل الأساسي. <code>push</code> بتضيف الصفحة فوق الـ stack الحالي وترجع Future بالنتيجة، فمناسبة للصفحات المؤقتة اللي بترجع بقيمة." },
      ],
    },
    {
      title: "redirect: حماية الصفحات",
      en: "redirect and refreshListenable (auth guard)",
      body: "<p>الـ <code>redirect</code> دالة بتتنادى قبل أي انتقال. ترجع مسار تاني لو لازم تحوّل المستخدم، أو <code>null</code> لو كله تمام. هي المكان الصح لحماية الصفحات اللي محتاجة تسجيل دخول.</p>",
      code: {
        lang: "dart",
        src: `final GoRouter router = GoRouter(
  refreshListenable: auth,
  redirect: (context, state) {
    final loggedIn = auth.isLoggedIn;
    final atLogin = state.matchedLocation == '/login';

    if (!loggedIn && !atLogin) return '/login';
    if (loggedIn && atLogin) return '/';
    return null;
  },
  routes: [
    GoRoute(path: '/', builder: (_, _) => const HomePage()),
    GoRoute(path: '/login', builder: (_, _) => const LoginPage()),
  ],
);`,
        note: "<code>auth</code> هو <code>ChangeNotifier</code> (هنتعلمه في f7) بيعمل <code>notifyListeners()</code> لما حالة الدخول تتغير. بـ <code>refreshListenable</code> الـ router بيعيد تقييم الـ redirect تلقائيا لما المستخدم يسجل دخول أو يخرج.",
      },
      pitfall: "redirect بيرجع نفس المسار الحالي أو يعمل loop (A ← B ← A). دايما اشرط على المكان الحالي (<code>atLogin</code>) وارجع <code>null</code> في الحالة الطبيعية.",
      interview: [
        { q: "إزاي تعمل auth guard في go_router؟", a: "بحط <code>redirect</code> على الـ GoRouter: بتقرا حالة الدخول وبترجع <code>/login</code> لو المستخدم مش داخل وبيحاول يفتح صفحة محمية، وبترجع <code>/</code> لو داخل وفتح صفحة login، وغير كده <code>null</code>. وبحط <code>refreshListenable</code> على object بيعمل notify لما حالة الدخول تتغير عشان الـ router يعيد التقييم لوحده بعد login أو logout." },
      ],
    },
    {
      title: "ShellRoute و Deep links",
      en: "ShellRoute, StatefulShellRoute and deep links",
      body: "<p><b>ShellRoute:</b> لما عندك هيكل ثابت حوالين صفحات متغيرة (bottom navigation مثلا). الـ shell بيرسم الـ Scaffold بالتابات، والصفحة الداخلية بتتغير جواه. و<code>StatefulShellRoute.indexedStack</code> بتحافظ على حالة كل تاب لوحده.</p><p><b>Deep link:</b> رابط من برا التطبيق (إشعار، رسالة، موقع) بيفتح شاشة معينة جوه التطبيق، مثلا <code>https://example.com/property/42</code> يفتح صفحة العقار 42. على المستوى المفاهيمي:</p>",
      points: [
        "النظام (Android/iOS) لازم يعرف إن الرابط ده بتاع تطبيقك (إعدادات native: intent filter في Android، associated domains في iOS).",
        "التطبيق بيستلم الرابط، و<code>go_router</code> بيحلله لمسار ويبني الـ stack المناسب.",
        "عشان كده تصميم المسارات كـ URLs نضيفة (<code>/property/:id</code>) مهم من البداية، وبدون state مخفي في <code>extra</code>.",
      ],
      interview: [
        { q: "يعني إيه deep link وإزاي go_router بيساعد فيه؟", a: "الـ deep link رابط بيفتح شاشة محددة جوه التطبيق مباشرة. النظام بيسلم الرابط للتطبيق (بعد إعداد native)، و<code>go_router</code> بيطابق الرابط على شجرة المسارات ويبني الـ stack المناسب ويطلع الـ path و query parameters للصفحة، وكمان الـ redirect بيقدر يحوله لـ login لو محتاج. دعم الويب والـ back/forward بيجي بنفس الآلية." },
      ],
    },
    {
      title: "التحكم في زرار الرجوع: PopScope",
      en: "PopScope (WillPopScope is deprecated)",
      body: "<p>لو عايز تمنع الرجوع أو تسأل المستخدم الأول (فورم فيه تعديلات غير محفوظة)، استخدم <code>PopScope</code>. الـ <code>WillPopScope</code> القديم <b>deprecated</b> من Flutter 3.12 وبطل يشتغل صح مع back الجديد في Android، فمتستخدمهوش في كود جديد.</p>",
      code: {
        lang: "dart",
        src: `PopScope(
  canPop: !_dirty,
  onPopInvokedWithResult: (didPop, result) async {
    if (didPop) return;
    final leave = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Discard changes?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Stay'),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Leave'),
          ),
        ],
      ),
    );
    if (leave == true && mounted) {
      Navigator.of(context).pop();
    }
  },
  child: const Placeholder(),
)`,
        note: "<code>canPop: false</code> بيمنع الرجوع، و<code>onPopInvokedWithResult</code> بتتنادى في الحالتين (<code>didPop</code> بتقولك الرجوع حصل ولا اتمنع). هنا <code>_dirty</code> متغير في الـ State معناه «فيه تعديلات».",
      },
      interview: [
        { q: "إزاي تتحكم في زرار الرجوع؟ وإيه بديل WillPopScope؟", a: "بلف الصفحة بـ <code>PopScope</code> وبحط <code>canPop</code> حسب الحالة (false لو فيه تعديلات غير محفوظة)، وفي <code>onPopInvokedWithResult</code> لو <code>didPop</code> false بعرض dialog تأكيد وبعدها أنادي pop يدويا لو المستخدم وافق. <code>WillPopScope</code> deprecated لأنه كان بيحدد الرجوع بشكل async بعد ما حدث، ومش بيتوافق مع predictive back في Android." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: فتح صفحة وإرجاع نتيجة",
      lang: "dart",
      code: `Future<void> _pickCity() async {
  final city = await Navigator.of(context).push<String>(
    MaterialPageRoute(builder: (_) => const CityPage()),
  );
  if (!mounted) return;
  if (city != null) {
    setState(() => _city = city);
  }
}`,
    },
    {
      title: "اكتب: GoRoute بـ path parameter",
      lang: "dart",
      code: `final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: '/property/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return PropertyPage(id: id);
      },
    ),
  ],
);`,
    },
    {
      title: "اكتب: auth redirect",
      lang: "dart",
      code: `String? guard(BuildContext context, GoRouterState state) {
  final loggedIn = auth.isLoggedIn;
  final atLogin = state.matchedLocation == '/login';

  if (!loggedIn && !atLogin) return '/login';
  if (loggedIn && atLogin) return '/';
  return null;
}`,
      note: "ارجع <code>null</code> في الحالة الطبيعية، ودايما اتأكد إنك مش على صفحة الـ login قبل ما تحول ليها.",
    },
  ],

  tasks: [
    {
      title: "اختيار قيمة من صفحة تانية",
      lang: "dart",
      prompt: "<p>اكتب <code>ColorPickerPage</code> (stateless) فيها 3 أزرار <code>red</code> و<code>green</code> و<code>blue</code>، كل زرار بيرجع اسمه بـ <code>Navigator.pop</code>. واكتب <code>HomePage</code> (stateful) فيها زرار «Choose»، بيفتح الصفحة، وبيعرض تحته <code>Color: &lt;الاسم&gt;</code> بعد الرجوع (<code>none</code> مبدئيا). تعامل مع الرجوع من غير اختيار.</p>",
      hints: [
        "<code>final c = await Navigator.of(context).push&lt;String&gt;(...)</code>، وبعدها <code>if (!mounted) return;</code> و<code>if (c != null) setState(...)</code>.",
        "جوه الأزرار: <code>onPressed: () =&gt; Navigator.of(context).pop('red')</code>.",
      ],
      solution: `class ColorPickerPage extends StatelessWidget {
  const ColorPickerPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pick')),
      body: Column(
        children: [
          for (final name in ['red', 'green', 'blue'])
            TextButton(
              onPressed: () => Navigator.of(context).pop(name),
              child: Text(name),
            ),
        ],
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String _color = 'none';

  Future<void> _choose() async {
    final c = await Navigator.of(context).push<String>(
      MaterialPageRoute(builder: (_) => const ColorPickerPage()),
    );
    if (!mounted) return;
    if (c != null) {
      setState(() => _color = c);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextButton(onPressed: _choose, child: const Text('Choose')),
        Text('Color: $_color'),
      ],
    );
  }
}`,
      explain: "النمط الكامل: <code>await push&lt;T&gt;</code> ← فحص <code>mounted</code> ← فحص <code>null</code> ← <code>setState</code>. لو المستخدم رجع بزرار الرجوع النتيجة <code>null</code> والقيمة القديمة بتفضل.",
    },
    {
      title: "router بـ redirect",
      lang: "dart",
      prompt: "<p>اكتب <code>GoRouter</code> فيه ثلاث مسارات: <code>/</code> (Home)، <code>/login</code>، و<code>/item/:id</code> (بيعرض <code>ItemPage(id: ...)</code> وبيقرا <code>from</code> اختياري من الـ query). عندك <code>final auth = ValueNotifier&lt;bool&gt;(false);</code> (true = داخل). اعمل redirect: غير الداخل يتحول لـ <code>/login</code>، والداخل اللي يفتح <code>/login</code> يتحول لـ <code>/</code>، والـ router يعيد التقييم لما <code>auth</code> يتغير.</p>",
      starter: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final auth = ValueNotifier<bool>(false);`,
      hints: [
        "<code>refreshListenable: auth</code> (الـ <code>ValueNotifier</code> هو <code>Listenable</code>). وفي redirect اقرا <code>auth.value</code>.",
        "الـ query بتتقرا من <code>state.uri.queryParameters['from']</code> وهي <code>String?</code>.",
      ],
      solution: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final auth = ValueNotifier<bool>(false);

class ItemPage extends StatelessWidget {
  const ItemPage({super.key, required this.id, this.from});

  final String id;
  final String? from;

  @override
  Widget build(BuildContext context) {
    return Text('Item $id from \${from ?? 'direct'}');
  }
}

final GoRouter router = GoRouter(
  refreshListenable: auth,
  redirect: (context, state) {
    final atLogin = state.matchedLocation == '/login';
    if (!auth.value && !atLogin) return '/login';
    if (auth.value && atLogin) return '/';
    return null;
  },
  routes: [
    GoRoute(path: '/', builder: (_, _) => const Text('Home')),
    GoRoute(path: '/login', builder: (_, _) => const Text('Login')),
    GoRoute(
      path: '/item/:id',
      builder: (context, state) => ItemPage(
        id: state.pathParameters['id']!,
        from: state.uri.queryParameters['from'],
      ),
    ),
  ],
);`,
      explain: "الـ id في الـ path لأنه هوية الصفحة، والـ <code>from</code> اختياري فهو query. من غير <code>refreshListenable</code> الـ redirect مش هيتعاد بعد ما <code>auth</code> يتغير.",
    },
    {
      title: "منع الرجوع مع تعديلات",
      lang: "dart",
      prompt: "<p>اكتب <code>EditPage</code> (stateful) فيها <code>TextField</code>. أول ما المستخدم يكتب أي حاجة تتعلم الصفحة «dirty». لو dirty والمستخدم ضغط رجوع، اعرض <code>AlertDialog</code> فيه «Stay» و«Leave». «Leave» تقفل الصفحة. استخدم <code>PopScope</code>.</p>",
      hints: [
        "<code>PopScope(canPop: !_dirty, onPopInvokedWithResult: (didPop, result) async {...})</code>. لو <code>didPop</code> يبقى خلاص.",
        "في <code>onChanged</code> بتاع الـ TextField: لو مش dirty اعمل <code>setState(() => _dirty = true)</code>.",
      ],
      solution: `class EditPage extends StatefulWidget {
  const EditPage({super.key});

  @override
  State<EditPage> createState() => _EditPageState();
}

class _EditPageState extends State<EditPage> {
  bool _dirty = false;

  Future<void> _confirmLeave() async {
    final leave = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Discard changes?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Stay'),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Leave'),
          ),
        ],
      ),
    );
    if (leave == true && mounted) {
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: !_dirty,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        _confirmLeave();
      },
      child: Scaffold(
        body: TextField(
          onChanged: (_) {
            if (!_dirty) setState(() => _dirty = true);
          },
        ),
      ),
    );
  }
}`,
      explain: "لما <code>canPop</code> بـ false وضغط المستخدم رجوع، الـ pop اتمنع و<code>didPop</code> بـ false، فبنعرض الـ dialog. لو وافق بننادي <code>Navigator.pop()</code> يدويا، وده pop برمجي مش حدث رجوع من المستخدم فمبيتمنعش بـ <code>canPop</code> (اللي بيمنع زرار الرجوع والـ gesture و<code>maybePop</code>).",
    },
  ],

  quiz: [
    {
      q: "تعمل إيه عشان ترجع قيمة للصفحة اللي فتحت الصفحة دي؟",
      options: [
        "<code>Navigator.pop(context, value)</code> والصفحة الأولى تستنى <code>await push</code>",
        "تحط القيمة في <code>static</code> variable",
        "<code>pushReplacement</code> مع القيمة",
        "<code>Navigator.of(context).value = x</code>",
      ],
      answer: 0,
      why: "الـ <code>push</code> بترجع Future بالنتيجة اللي اتبعتت لـ <code>pop</code>. الباقي مش آلية تنقل بين الصفحات.",
    },
    {
      q: "بعد تسجيل الدخول عايز Home تكون الصفحة الوحيدة في الـ stack. أنهي؟",
      options: [
        "<code>push</code>",
        "<code>pop</code>",
        "<code>pushAndRemoveUntil(route, (r) =&gt; false)</code>",
        "<code>popUntil</code>",
      ],
      answer: 2,
      why: "الـ predicate اللي بيرجع دايما false بيمسح كل اللي تحت الصفحة الجديدة، فزرار الرجوع مش هيرجع للـ login.",
    },
    {
      q: "إيه اللي بيرجع من <code>await Navigator.of(context).push&lt;String&gt;(...)</code> لو المستخدم رجع بزرار الرجوع؟",
      answer: ["null", "Null"],
      why: "من غير <code>pop(value)</code> النتيجة <code>null</code>. عشان كده النوع <code>String?</code> ولازم تفحص.",
    },
    {
      q: "في go_router، المسار <code>/property/42?tab=photos</code>. إيه الصح؟",
      options: [
        "<code>42</code> و<code>tab</code> الاتنين path parameters",
        "<code>42</code> query و<code>tab</code> path",
        "<code>42</code> بيتقرا من <code>pathParameters['id']</code> (لو المسار <code>:id</code>) و<code>tab</code> من <code>uri.queryParameters</code>",
        "الاتنين بيتقروا من <code>extra</code>",
      ],
      answer: 2,
      why: "الجزء من المسار path parameter، وبعد <code>?</code> query parameters. الـ <code>extra</code> حاجة تانية مبتتكتبش في الرابط.",
    },
    {
      q: "إيه الفرق بين <code>context.go('/a')</code> و<code>context.push('/a')</code>؟",
      options: [
        "مفيش فرق",
        "<code>go</code> بتستبدل الـ stack بالمسار، و<code>push</code> بتضيف فوق الحالي وبترجع Future",
        "<code>push</code> للويب بس",
        "<code>go</code> بتمسح الـ router",
      ],
      answer: 1,
      why: "go = زي كتابة رابط جديد (بتبني الـ stack من شجرة المسارات)، push = زي Navigator.push (بتضيف وبترجع نتيجة).",
    },
    {
      q: "عايز تحمي <code>/orders</code> من غير الداخلين. المكان الصح؟",
      options: [
        "تفحص في <code>initState</code> بتاع كل صفحة وتنادي Navigator.pop",
        "<code>redirect</code> على الـ GoRouter ترجع <code>/login</code> لو مش داخل",
        "تخفي زرار الصفحة بس",
        "تحط الصفحة في <code>try/catch</code>",
      ],
      answer: 1,
      why: "الـ redirect بيشتغل قبل أي انتقال، حتى لو جه من deep link. إخفاء الزرار بس مبيمنعش فتح الرابط.",
    },
    {
      q: "ليه تمرير object كامل في <code>extra</code> فكرة سيئة غالبا؟",
      options: [
        "عشان <code>extra</code> مبتقبلش objects",
        "عشان بيبطئ التطبيق جدا",
        "عشان الـ type بيتغير",
        "عشان مبيتحفظش في الـ URL، فبيضيع بعد refresh أو deep link",
      ],
      answer: 3,
      why: "الـ <code>extra</code> in-memory بس. الرابط ميعرفش عنه حاجة، فمرر الـ id وهات الداتا في الصفحة.",
    },
    {
      q: "أنهي بديل حديث لـ <code>WillPopScope</code>؟",
      options: [
        "<code>BackButtonListener</code> فقط",
        "<code>Navigator.canPop</code>",
        "<code>PopScope</code>",
        "<code>RouteObserver</code>",
      ],
      answer: 2,
      why: "<code>WillPopScope</code> deprecated والبديل الرسمي <code>PopScope</code> (مع <code>canPop</code> و<code>onPopInvokedWithResult</code>).",
    },
    {
      q: "الخطأ إيه؟",
      code: { lang: "dart", src: `Future<void> _go() async {
  final ok = await Navigator.of(context).push<bool>(
    MaterialPageRoute(builder: (_) => const ConfirmPage()),
  );
  setState(() => _ok = ok!);
}` },
      options: [
        "<code>push</code> مينفعش تكتب معاها نوع",
        "ناقص فحص <code>mounted</code>، وبيفترض إن النتيجة مش null بـ <code>!</code>",
        "<code>setState</code> مينفعش بعد push",
        "<code>MaterialPageRoute</code> لازم <code>const</code>",
      ],
      answer: 1,
      why: "بعد await لازم <code>if (!mounted) return;</code>. والمستخدم ممكن يرجع من غير نتيجة فـ <code>ok</code> هتبقى null و<code>!</code> هترمي خطأ.",
    },
  ],
};
