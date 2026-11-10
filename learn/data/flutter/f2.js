window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f2"] = {
  slides: [
    {
      kicker: "ليه محتاجين State",
      title: "الـ widget مبيتغيرش، فالحاجة المتغيرة تتحط في مكان تاني",
      en: "StatelessWidget vs StatefulWidget",
      body: "<p>في المستوى اللي فات شفت إن الـ widget وصف immutable بيتبني من جديد كتير. طيب لو عندك عداد، أو checkbox، أو نص بيتكتب؟ القيمة دي لازم <b>تعيش أطول من الـ widget</b>، وإلا هتتصفر في كل rebuild.</p><p>الحل: <code>StatefulWidget</code>. هو برضه widget immutable عادي، لكنه بيطلب من الـ framework يعمل له كائن تاني اسمه <code>State</code>، والكائن ده هو اللي بيحتفظ بالقيم المتغيرة ويعيش طول ما الـ widget موجود في الشجرة.</p>",
      points: [
        "<code>StatelessWidget</code>: الشكل بيتحدد من الـ constructor بس. لو الداتا اللي جاية من فوق اتغيرت، الأب هيبني نسخة جديدة منه.",
        "<code>StatefulWidget</code>: عنده بيانات بتتغير <b>من جواه</b> (ضغطة زرار، رد من السيرفر، تايمر، نص بيتكتب).",
      ],
      focus: [{ label: "احفظها", text: "لو الحاجة بتتغير من جوه الـ widget نفسه، محتاج <code>State</code>. لو كل داتاه جاية من الأب، <code>StatelessWidget</code> كفاية." }],
    },
    {
      title: "كلاسين مش كلاس واحد",
      en: "StatefulWidget + State",
      body: "<p>كل StatefulWidget بيتكتب في كلاسين: الـ widget (الوصف الـ immutable) والـ <code>State</code> (القيم والـ <code>build</code>). اللي بيربطهم دالة <code>createState</code>.</p>",
      code: {
        lang: "dart",
        title: "counter.dart",
        src: `class Counter extends StatefulWidget {
  const Counter({super.key, this.start = 0});

  final int start;

  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  late int _count = widget.start;

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: () => setState(() => _count++),
      child: Text('Taps: $_count'),
    );
  }
}`,
        note: "الـ field <code>_count</code> جوه الـ State. وبنقرأ إعدادات الـ widget من جوه الـ State بـ <code>widget.start</code>.",
      },
      points: [
        "ليه كلاسين؟ لأن الـ widget بيتبني من جديد في كل rebuild للأب، لكن الـ <b>State object بيتعمل مرة واحدة</b> وبيفضل ماسكه الـ element لحد ما الـ widget يتشال من الشجرة.",
        "الـ <code>State</code> ليه حق الوصول للـ widget الحالي من خلال <code>widget</code>، وده بيتحدث تلقائيا لما الأب يبعت إعدادات جديدة.",
        "اسم الـ State بيبدأ بـ <code>_</code> لأنه تفصيلة داخلية مش المفروض حد برا الملف يستخدمها.",
      ],
      interview: [
        { q: "ليه الـ StatefulWidget متقسم لكلاسين: widget و State؟", a: "عشان الـ widget immutable وبيتبني من جديد في كل rebuild للأب، فمينفعش يحتفظ بقيم متغيرة. الـ <code>State</code> object بيتعمل مرة واحدة والـ element هو اللي ماسكه، فبيعيش بين الـ rebuilds. الـ widget الجديد بيوصل للـ State عن طريق <code>widget</code>، وفي <code>didUpdateWidget</code> أقدر أقارن القديم بالجديد." },
      ],
    },
    {
      title: "setState: بتعمل إيه بالظبط",
      en: "What setState really does",
      body: "<p><code>setState</code> مش بتغير الشاشة. هي بتعمل حاجتين: تنفذ الـ callback اللي إنت مديهولها <b>فورا</b> (وده اللي بيغير القيمة)، وبعدين تعلّم الـ element إنه <b>dirty</b> فيتعمل له <code>build</code> في الـ frame الجاي.</p>",
      codes: [
        { lang: "dart", title: "غلط: القيمة اتغيرت والشاشة لا", src: `void _increment() {
  _count++; // build is never scheduled
}` },
        { lang: "dart", title: "صح: التغيير جوه setState", src: `void _increment() {
  setState(() {
    _count++;
  });
}` },
      ],
      points: [
        "جوه الـ callback حط <b>تغيير القيمة بس</b>. الحسابات التقيلة والـ I/O برا.",
        "الـ callback مينفعش يبقى <code>async</code>. لو عندك await، استنى الأول وبعدين نادي <code>setState</code> بالنتيجة.",
        "ممنوع تنادي <code>setState</code> من جوه <code>build</code>: بيطلع الخطأ <code>setState() called during build</code>.",
      ],
      code: {
        lang: "dart",
        title: "الـ await برا والتغيير جوه",
        src: `Future<void> _load() async {
  final data = await fetchTitles(); // outside setState
  if (!mounted) return;
  setState(() {
    _titles = data;
  });
}`,
        note: "<code>fetchTitles</code> دالة بتجيب قايمة عناوين من السيرفر. الـ <code>mounted</code> بنشرحها بعد شوية.",
      },
      interview: [
        { q: "setState بتعمل إيه جوه؟ وهل بتعيد بناء الشاشة كلها؟", a: "بتنفذ الـ callback مباشرة عشان تغير الـ state، وبعدين بتعلّم الـ element بتاع الـ State ده كـ dirty عشان <code>build</code> بتاعه يتنفذ في الـ frame الجاي. بتعيد بناء الـ widget ده وولاده بس، مش الشاشة كلها. والـ framework بعدين يقارن ويحدّث الأجزاء اللي اتغيرت بس. عشان كده بنحاول نخلي الـ State في أصغر widget ممكن." },
      ],
    },
    {
      title: "دورة الحياة بالترتيب",
      en: "State lifecycle",
      body: "<p>الـ State له رحلة ثابتة. احفظ الترتيب لأنه سؤال إنترفيو ثابت:</p>",
      terms: [
        ["createState", "إنشاء الـ State", "بتتنادى مرة واحدة لما الـ element يتعمل. بترجع object جديد بس."],
        ["initState", "تهيئة", "مرة واحدة بس. هنا بتنشئ الـ controllers والاشتراكات. اكتب <code>super.initState()</code> في أول سطر."],
        ["didChangeDependencies", "الاعتماديات اتغيرت", "بعد initState مباشرة، وكل مرة InheritedWidget زي Theme أو MediaQuery بتستخدمه من <code>build</code> يتغير."],
        ["build", "بناء الواجهة", "بتتنادى كتير: بعد initState، بعد كل setState، وكل ما الأب يتبني من جديد."],
        ["didUpdateWidget", "الـ widget اتبدل", "لما الأب يبني نسخة جديدة من الـ widget بإعدادات مختلفة. الـ State نفسه بيفضل، وبتاخد <code>oldWidget</code> تقارنه بـ <code>widget</code>."],
        ["deactivate", "اتشال من الشجرة", "الـ element اتشال (ممكن يتحط تاني في مكان تاني في نفس الـ frame)."],
        ["dispose", "التنضيف", "نهاية الرحلة، مرة واحدة. هنا بتقفل كل اللي فتحته في initState. اكتب <code>super.dispose()</code> في آخر سطر."],
      ],
      focus: [{ label: "الترتيب", text: "<code>createState</code> ← <code>initState</code> ← <code>didChangeDependencies</code> ← <code>build</code> ← (<code>didUpdateWidget</code> / <code>setState</code> ← <code>build</code>)* ← <code>deactivate</code> ← <code>dispose</code>" }],
    },
    {
      title: "الدورة في كود",
      en: "Lifecycle hooks in code",
      code: {
        lang: "dart",
        src: `class _PanelState extends State<Panel> {
  @override
  void initState() {
    super.initState();
    debugPrint('init: ready once');
  }

  @override
  void didUpdateWidget(covariant Panel oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.userId != widget.userId) {
      debugPrint('user changed, reload');
    }
  }

  @override
  void dispose() {
    debugPrint('dispose: clean up');
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Text('User \${widget.userId}');
  }
}`,
        note: "<code>didUpdateWidget</code> هي المكان الصح للتفاعل مع تغيير الإعدادات اللي جاية من الأب (مثلا <code>userId</code> اتغير فتعيد التحميل). <code>initState</code> لوحدها مش هتتنادى تاني.",
      },
      pitfall: "تعمل <code>Theme.of(context)</code> أو <code>MediaQuery.of(context)</code> جوه <code>initState</code>. الـ context لسه مش جاهز للـ inherited widgets هناك، وبيطلع assertion. استخدمهم في <code>build</code> أو <code>didChangeDependencies</code>.",
      interview: [
        { q: "رتّب دورة حياة الـ State واشرح إمتى كل دالة بتتنادى.", a: "<code>createState</code> مرة واحدة، بعدها <code>initState</code> مرة واحدة للتهيئة، بعدها <code>didChangeDependencies</code>، بعدها <code>build</code>. بعد كده كل <code>setState</code> أو تغيير من الأب بيعمل <code>build</code> تاني، ولو الأب بعت widget جديد بيتنادى <code>didUpdateWidget</code> قبل الـ build. لما الـ widget يتشال بيتنادى <code>deactivate</code> وبعدين <code>dispose</code> مرة واحدة للتنضيف." },
        { q: "إيه الفرق بين initState و didChangeDependencies؟ وأعمل fetch فين؟", a: "<code>initState</code> بتتنادى مرة واحدة ومفيهاش وصول للـ inherited widgets عن طريق context. <code>didChangeDependencies</code> بتتنادى بعدها، وكمان كل مرة inherited widget بعتمد عليه يتغير. الـ fetch الأولاني عادة في <code>initState</code>، ولو محتاج حاجة من الـ context زي لغة أو provider، يا إما <code>didChangeDependencies</code> بحرص (عشان بتتنادى أكتر من مرة) يا إما أبعتها كـ parameter." },
      ],
    },
    {
      title: "الـ controllers: افتح في initState وقفل في dispose",
      en: "Create in initState, release in dispose",
      body: "<p>أي object بيحتفظ بموارد أو بيسمع لحاجة (<code>TextEditingController</code>, <code>ScrollController</code>, <code>Timer</code>, <code>StreamSubscription</code>, <code>AnimationController</code>, <code>FocusNode</code>) لازم يتعمل مرة واحدة ويتقفل. لو منعملش <code>dispose</code> بيحصل memory leak وممكن callbacks تفضل شغالة بعد ما الشاشة اتقفلت.</p>",
      code: {
        lang: "dart",
        src: `class _SearchBoxState extends State<SearchBox> {
  late final TextEditingController _controller;
  Timer? _debounce;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(controller: _controller);
  }
}`,
        note: "الـ controller يتعمل مرة واحدة (مش في <code>build</code> لأنها هتعمل واحد جديد في كل rebuild). والـ <code>Timer</code> بيتلغي قبل <code>super.dispose()</code>. الـ <code>Timer</code> من <code>dart:async</code>.",
      },
      pitfall: "تعمل <code>TextEditingController()</code> جوه <code>build</code>. في كل rebuild هيتعمل واحد جديد، والنص اللي كتبه المستخدم يضيع، والقديم يتسرب.",
      interview: [
        { q: "ليه لازم أنادي dispose على الـ controllers؟ وأنشئها فين؟", a: "لأن الـ controller بيحتفظ بـ listeners وموارد، ولو الـ State اتشال من غير dispose الموارد دي بتفضل في الذاكرة (memory leak) وممكن تنادي callbacks على widget مات. بنشئها في <code>initState</code> (أو <code>late final</code> field) مرة واحدة، وبنقفلها في <code>dispose</code> قبل <code>super.dispose()</code>. وعمري ما أعملها جوه <code>build</code> لأنه بيتنادى كتير." },
      ],
    },
    {
      title: "mounted والـ context بعد await",
      en: "mounted, context.mounted and async gaps",
      body: "<p>بعد أي <code>await</code>، ممكن المستخدم يكون خرج من الصفحة. لو بعدها نادينا <code>setState</code> على State اتعمل له dispose بيطلع الخطأ <b>«setState() called after dispose()»</b>. ولو استخدمنا <code>context</code> (Navigator أو ScaffoldMessenger) بعد الـ await، الـ context ممكن يكون مبقاش في الشجرة.</p><p>الحل سطر واحد: اتأكد إن الـ widget لسه موجود قبل ما تكمل.</p>",
      codes: [
        { lang: "dart", title: "داخل الـ State", src: `Future<void> _save() async {
  await repo.save(_draft);
  if (!mounted) return;
  setState(() => _saved = true);
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(content: Text('Saved')),
  );
}`, note: "جوه الـ State استخدم <code>mounted</code>." },
        { lang: "dart", title: "دالة عادية معاها context", src: `Future<void> logout(BuildContext context) async {
  await api.logout();
  if (!context.mounted) return;
  Navigator.of(context).pop();
}`, note: "<code>context.mounted</code> موجودة من Flutter 3.7. الـ lint اسمه <code>use_build_context_synchronously</code> بينبهك لو نسيت الفحص." },
      ],
      pitfall: "تحط <code>if (mounted)</code> قبل الـ await مش بعده. الفحص لازم يبقى <b>بعد</b> الـ await لأن المشكلة بتحصل أثناء الانتظار.",
      interview: [
        { q: "إيه معنى «setState called after dispose» وإزاي تتجنبه؟ وإزاي تستخدم context بأمان بعد await؟", a: "معناه إني ناديت <code>setState</code> على State اتعمل له dispose، غالبا لأن future خلص بعد ما المستخدم خرج من الصفحة. بتجنبه بفحص <code>if (!mounted) return;</code> بعد كل await قبل ما ألمس الـ state أو الـ context. برا الـ State بستخدم <code>context.mounted</code>. وكمان لو في Timer أو stream بلغيهم في <code>dispose</code>." },
      ],
    },
    {
      title: "الـ State تعيش فين؟",
      en: "Lifting state up",
      body: "<p>القاعدة: خلي الـ state في <b>أقل widget</b> يحتاجها، لكن لو اتنين widgets إخوات محتاجين نفس القيمة، ارفعها لأقرب أب مشترك. الأب يمسك القيمة، ويبعتها لتحت كـ parameter، والولد بيبلغ الأب بالتغيير عن طريق callback.</p>",
      code: {
        lang: "dart",
        src: `class FilterPage extends StatefulWidget {
  const FilterPage({super.key});

  @override
  State<FilterPage> createState() => _FilterPageState();
}

class _FilterPageState extends State<FilterPage> {
  bool _onlyFree = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        FilterSwitch(
          value: _onlyFree,
          onChanged: (v) => setState(() => _onlyFree = v),
        ),
        Text(_onlyFree ? 'Free items' : 'All items'),
      ],
    );
  }
}

class FilterSwitch extends StatelessWidget {
  const FilterSwitch({
    super.key,
    required this.value,
    required this.onChanged,
  });

  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return Switch(value: value, onChanged: onChanged);
  }
}`,
        note: "الولد <code>FilterSwitch</code> stateless: بياخد القيمة والـ callback. الأب هو مصدر الحقيقة الوحيد. الشكل ده (value + onChanged) هو نفس شكل <code>Switch</code> و <code>Checkbox</code> و <code>TextField</code>.",
      },
      points: [
        "البيانات بتنزل لتحت (parameters)، والأحداث بتطلع لفوق (callbacks).",
        "لما الـ prop drilling يتعب (تمرير عبر 5 مستويات)، ده وقت <code>InheritedWidget</code> أو state management. هنوصله في المستوى f7.",
      ],
      interview: [
        { q: "إزاي تشارك state بين widgetين؟", a: "برفع الـ state لأقرب أب مشترك. الأب يمسك القيمة في State بتاعه ويبعتها للولدين كـ parameters، وكل ولد بيبلغه بالتغيير عن طريق callback زي <code>onChanged</code>، والأب ينادي <code>setState</code>. لو الشجرة عميقة ولا حد يقدر يمرر بسهولة، بستخدم InheritedWidget أو حل state management." },
      ],
    },
    {
      title: "أخطاء متكررة في الـ State",
      en: "Common mistakes",
      points: [
        "<b>بناء widgets جوه setState:</b> مفيش داعي، <code>setState</code> للقيم بس.",
        "<b>نسيان setState:</b> القيمة اتغيرت لكن الشاشة قديمة.",
        "<b>setState جوه build:</b> loop لانهائي أو assertion.",
        "<b>النسخ من widget لـ field مرة واحدة:</b> لو كتبت <code>_name = widget.name</code> في <code>initState</code> والأب غيّر الاسم، الـ State مش هيعرف. لو عايز تتفاعل مع التغيير استخدم <code>widget.name</code> مباشرة أو <code>didUpdateWidget</code>.",
        "<b>State كبيرة في أعلى الشجرة:</b> أي <code>setState</code> بتعيد بناء كل الشجرة تحتها. خلي الـ State قريبة من اللي بيستخدمها.",
      ],
      pitfall: "تفتكر إن <code>setState</code> مجانية. هي بترخص لما الـ State صغيرة وقريبة من الـ UI اللي بتتغير، وبتغلى لما تكون في آخر الشجرة تحت <code>MaterialApp</code> مباشرة.",
      interview: [
        { q: "هل لازم أنادي setState لو غيرت قيمة في الـ State؟ وإيه اللي يحصل لو منادتهاش؟", a: "لو القيمة بتظهر في الـ UI آه، لأن التغيير من غير <code>setState</code> بيغير الـ field بس ومبيجدولش <code>build</code>، فالشاشة بتفضل بالقيمة القديمة لحد ما حاجة تانية تعمل rebuild. لو القيمة مش بتتعرض (زي متغير داخلي) مش لازم." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: عداد StatefulWidget",
      lang: "dart",
      code: `class Counter extends StatefulWidget {
  const Counter({super.key});

  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: () => setState(() => _count++),
      child: Text('Taps: $_count'),
    );
  }
}`,
      note: "الشكل ده بتكتبه من غير تفكير: كلاسين، <code>createState</code>، والتغيير جوه <code>setState</code>.",
    },
    {
      title: "اكتب: controller بدورة حياة",
      lang: "dart",
      code: `class _NameFieldState extends State<NameField> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(controller: _controller);
  }
}`,
    },
    {
      title: "اكتب: حفظ آمن بعد await",
      lang: "dart",
      code: `Future<void> _save() async {
  setState(() => _busy = true);
  try {
    await repo.save(_draft);
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Saved')),
    );
  } finally {
    if (mounted) {
      setState(() => _busy = false);
    }
  }
}`,
      note: "<code>finally</code> بتشتغل في الحالتين، فلازم تفحص <code>mounted</code> فيها كمان.",
    },
  ],

  tasks: [
    {
      title: "زرار لايك",
      lang: "dart",
      prompt: "<p>اكتب <code>StatefulWidget</code> اسمه <code>LikeButton</code> بياخد <code>initialCount</code> من نوع <code>int</code> (مطلوب). بيعرض <code>IconButton</code> بأيقونة <code>Icons.favorite</code> لو اتعمله لايك أو <code>Icons.favorite_border</code> لو لا، وجنبه عدد اللايكات.</p><p>كل ضغطة تقلب الحالة: لو مش لايك يبقى لايك والعدد يزيد 1، ولو لايك يتلغي والعدد ينقص 1. العدد الابتدائي ييجي من الـ widget.</p>",
      hints: [
        "حط <code>_liked</code> و <code>_count</code> في الـ State. الـ <code>_count</code> تبدأ من <code>widget.initialCount</code> (استخدم <code>late int _count = widget.initialCount;</code>).",
        "ضغطة واحدة بتغير القيمتين مع بعض، فحطهم في <code>setState</code> واحدة.",
      ],
      solution: `class LikeButton extends StatefulWidget {
  const LikeButton({super.key, required this.initialCount});

  final int initialCount;

  @override
  State<LikeButton> createState() => _LikeButtonState();
}

class _LikeButtonState extends State<LikeButton> {
  bool _liked = false;
  late int _count = widget.initialCount;

  void _toggle() {
    setState(() {
      _liked = !_liked;
      _count += _liked ? 1 : -1;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(
          onPressed: _toggle,
          icon: Icon(_liked ? Icons.favorite : Icons.favorite_border),
        ),
        Text('$_count'),
      ],
    );
  }
}`,
      explain: "القيمتين اتغيروا في <code>setState</code> واحدة فبيحصل build واحد. و <code>late int _count = widget.initialCount</code> بتقرا الـ widget وقت أول استخدام، وده مسموح للـ <code>late</code> initializer.",
    },
    {
      title: "بحث بتأخير (debounce)",
      lang: "dart",
      prompt: "<p>اكتب State لصفحة <code>SearchPage</code> فيها <code>TextField</code> بـ <code>TextEditingController</code>. كل ما المستخدم يكتب، استنى 400 ميلي ثانية من غير كتابة جديدة وبعدين نادي <code>_runSearch(text)</code> (دالة موجودة عندك بتعمل <code>setState</code> بنتيجة البحث).</p><p>المطلوب: أنشئ الـ controller والـ <code>Timer</code> صح، ونظّفهم في <code>dispose</code>.</p>",
      starter: `import 'dart:async';
import 'package:flutter/material.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}`,
      hints: [
        "ضيف <code>Timer? _debounce;</code> في الـ State. كل مرة النص يتغير، الغي القديم بـ <code>_debounce?.cancel()</code> وابدأ واحد جديد.",
        "اربط الـ <code>onChanged</code> بتاع الـ <code>TextField</code> بالدالة، و <code>dispose</code> فيها <code>cancel</code> و <code>dispose</code> للـ controller.",
      ],
      solution: `import 'dart:async';
import 'package:flutter/material.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final TextEditingController _controller = TextEditingController();
  Timer? _debounce;
  String _result = '';

  void _onChanged(String text) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), () {
      _runSearch(text);
    });
  }

  void _runSearch(String text) {
    setState(() => _result = 'Results for "$text"');
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(controller: _controller, onChanged: _onChanged),
        Text(_result),
      ],
    );
  }
}`,
      explain: "الـ <code>Timer</code> الأخير بس هو اللي بيفضل شغال، لأن كل كتابة بتلغي اللي قبله. ولو الـ <code>dispose</code> منلغاش الـ Timer ممكن يتنفذ بعد ما الصفحة اتقفلت وينادي <code>setState</code> على State ميت.",
    },
    {
      title: "رفع الـ state: اختيار لون",
      lang: "dart",
      prompt: "<p>عندك widget اسمه <code>ColorChips</code> (stateless) بياخد <code>selected</code> من نوع <code>String</code> و <code>onSelected</code> من نوع <code>ValueChanged&lt;String&gt;</code> وبيعرض 3 <code>ChoiceChip</code> بأسماء <code>red</code> و <code>green</code> و <code>blue</code>. اكتبه، واكتب صفحة <code>ColorPage</code> (stateful) تمسك اللون المختار وتعرض تحت الـ chips نص <code>Selected: &lt;اللون&gt;</code>.</p>",
      hints: [
        "الـ chips بتبني من قايمة: <code>for (final name in colors) ChoiceChip(...)</code>. الـ <code>ChoiceChip</code> بياخد <code>label</code> و <code>selected</code> و <code>onSelected</code>.",
        "الـ <code>ColorPage</code> هو اللي فيه <code>setState</code>، والـ chips بتنادي <code>onSelected(name)</code>.",
      ],
      solution: `class ColorChips extends StatelessWidget {
  const ColorChips({
    super.key,
    required this.selected,
    required this.onSelected,
  });

  final String selected;
  final ValueChanged<String> onSelected;

  static const colors = ['red', 'green', 'blue'];

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      children: [
        for (final name in colors)
          ChoiceChip(
            label: Text(name),
            selected: name == selected,
            onSelected: (_) => onSelected(name),
          ),
      ],
    );
  }
}

class ColorPage extends StatefulWidget {
  const ColorPage({super.key});

  @override
  State<ColorPage> createState() => _ColorPageState();
}

class _ColorPageState extends State<ColorPage> {
  String _color = 'red';

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ColorChips(
          selected: _color,
          onSelected: (c) => setState(() => _color = c),
        ),
        Text('Selected: $_color'),
      ],
    );
  }
}`,
      explain: "الـ <code>ColorChips</code> مفيهوش state: بياخد القيمة ويبلغ بالتغيير. ده يخليه سهل الاختبار وإعادة الاستخدام. الأب هو مصدر الحقيقة.",
    },
  ],

  quiz: [
    {
      q: "ليه الـ <code>State</code> كلاس منفصل عن الـ <code>StatefulWidget</code>؟",
      options: [
        "عشان الـ widget بيتبني من جديد كتير، والـ State object بيعيش بين الـ rebuilds ويحتفظ بالقيم",
        "عشان Dart مبتسمحش بـ fields مش final في الـ widgets",
        "عشان الـ State بيتكومبايل أسرع",
        "عشان الـ build مينفعش تكون في الـ widget",
      ],
      answer: 0,
      why: "الـ widget immutable وبيتبدل بنسخة جديدة، أما الـ State فالـ element ماسكه ومبيتبدلش. السبب مش أداء كومبايل ولا قيود لغة، هو دورة حياة القيم.",
    },
    {
      q: "الزرار بيزود <code>_count</code> لكن الرقم على الشاشة مبيتغيرش. ليه؟",
      code: { lang: "dart", src: `onPressed: () {
  _count++;
},` },
      options: [
        "<code>_count</code> لازم تبقى <code>final</code>",
        "ناقص <code>async</code> على الـ callback",
        "التغيير مش جوه <code>setState</code> فمفيش build اتجدول",
        "الـ <code>onPressed</code> لازم تبقى <code>const</code>",
      ],
      answer: 2,
      why: "الـ field اتغير فعلا، لكن مفيش حد علّم الـ element إنه dirty. <code>setState(() => _count++)</code> هي اللي بتجدول الـ build.",
    },
    {
      q: "أنهي دالة من دول بتتنادى <b>مرة واحدة بس</b> في عمر الـ State؟",
      options: [
        "<code>build</code>",
        "<code>didChangeDependencies</code>",
        "<code>didUpdateWidget</code>",
        "<code>initState</code>",
      ],
      answer: 3,
      why: "<code>initState</code> مرة واحدة. الـ <code>build</code> بيتنادى كتير، و <code>didUpdateWidget</code> كل ما الأب يبعت widget جديد، و <code>didChangeDependencies</code> بتتنادى بعد initState وكمان لما inherited widget يتغير.",
    },
    {
      q: "الأب غيّر الـ <code>userId</code> اللي بيبعته للـ widget. أنهي دالة تتنادى عشان تعيد تحميل بيانات المستخدم؟",
      options: [
        "<code>initState</code>، لأنها بتتنادى مع كل widget جديد",
        "<code>didUpdateWidget</code>، وبتقارن <code>oldWidget.userId</code> بـ <code>widget.userId</code>",
        "<code>dispose</code>، لأن الـ widget القديم بيتشال",
        "<code>deactivate</code>",
      ],
      answer: 1,
      why: "الـ State نفسه بيفضل، فـ <code>initState</code> مش هتتنادى تاني. <code>didUpdateWidget</code> هي اللي بتديك القديم والجديد.",
    },
    {
      q: "إيه المشكلة في الكود ده؟",
      code: { lang: "dart", src: `Future<void> _load() async {
  final items = await api.fetchItems();
  setState(() => _items = items);
}` },
      options: [
        "<code>setState</code> مينفعش تتنادى بعد await",
        "لو المستخدم خرج من الصفحة أثناء الانتظار، <code>setState</code> هتتنادى بعد dispose",
        "ناقص <code>try/catch</code> وده سبب الخطأ الوحيد",
        "<code>_items</code> لازم تبقى <code>late</code>",
      ],
      answer: 1,
      why: "<code>setState</code> بعد await مسموحة، بشرط تتأكد إن الـ State لسه موجود: <code>if (!mounted) return;</code> قبلها.",
    },
    {
      q: "جوه دالة عادية بتاخد <code>BuildContext context</code> وفيها <code>await</code>. أنهي سطر يحمي استخدام الـ context بعده؟",
      options: [
        "<code>if (context.mounted) return;</code>",
        "<code>if (!context.mounted) return;</code>",
        "<code>if (context == null) return;</code>",
        "<code>context.dispose();</code>",
      ],
      answer: 1,
      why: "المطلوب إننا نخرج لو الـ context <b>مش</b> mounted. الاختيار الأول بيعكس الشرط. الـ context مبيبقاش null أصلا، ومفيش <code>context.dispose</code>.",
    },
    {
      q: "أنهي مكان صح لإنشاء <code>TextEditingController</code> في Stateful widget؟",
      options: [
        "جوه <code>build</code> عشان يتحدث مع كل rebuild",
        "جوه <code>dispose</code>",
        "في <code>initState</code> (أو <code>late final</code> field) ويتقفل في <code>dispose</code>",
        "في <code>didUpdateWidget</code>",
      ],
      answer: 2,
      why: "لو اتعمل في <code>build</code> هيتعمل واحد جديد كل rebuild والنص يضيع. بنعمله مرة واحدة ونقفله في <code>dispose</code>.",
    },
    {
      q: "جوه كلاس الـ <code>State</code>، إيه اسم الـ getter اللي بتوصل بيه لإعدادات الـ StatefulWidget (زي <code>userId</code>)؟",
      answer: ["widget", "widget.", "widget.userId"],
      why: "<code>widget</code> بيرجع الـ StatefulWidget الحالي، وبيتحدث تلقائيا لما الأب يبعت نسخة جديدة. مثلا <code>widget.userId</code>.",
    },
    {
      q: "اتنين widgets إخوات محتاجين يقروا ويغيروا نفس القيمة. إيه الأنسب كبداية؟",
      options: [
        "كل واحد يمسك نسخة ويزامنهم بـ Timer",
        "State عالمية static",
        "نرفع القيمة لأقرب أب مشترك ونمررها كـ parameter مع callback",
        "نخليهم StatelessWidget ونعدّل القيمة مباشرة",
      ],
      answer: 2,
      why: "Lifting state up: القيمة عند الأب، بتنزل كـ parameters، والتغيير بيطلع بـ callback. الباقي بيعقّد أو بيكسر مبدأ مصدر الحقيقة الواحد.",
    },
    {
      q: "إيه اللي هيحصل هنا؟",
      code: { lang: "dart", src: `@override
Widget build(BuildContext context) {
  setState(() => _n++);
  return Text('$_n');
}` },
      options: [
        "يشتغل عادي ويزود الرقم مرة واحدة",
        "assertion: setState called during build",
        "الرقم يزيد مع كل ضغطة زرار",
        "ميتكومبلش",
      ],
      answer: 1,
      why: "ممنوع تجدول build من جوه build. الكود بيتكومبل لكن بيطلع خطأ وقت التشغيل. التغييرات تتعمل في event handler مش في build.",
    },
  ],
};
