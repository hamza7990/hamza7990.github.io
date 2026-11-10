window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f4"] = {
  slides: [
    {
      kicker: "ليه ListView.builder",
      title: "القوايم الطويلة بتتبني بالكسل (lazy)",
      en: "ListView vs ListView.builder vs ListView.separated",
      body: "<p>أي تطبيق حقيقي فيه قايمة: عقارات، طلبات، رسايل. وفيه ثلاث طرق تبنيها:</p>",
      terms: [
        ["ListView(children: [...])", "كل العناصر مرة واحدة", "بتبني كل الـ widgets حتى اللي برا الشاشة. تمام لـ 5 أو 10 عناصر ثابتة، سيئة لـ 1000."],
        ["ListView.builder", "lazy", "بتبني بس العناصر اللي ظاهرة (ومعاها هامش صغير) وبتنادي <code>itemBuilder</code> لما عنصر يقرب يظهر. الاختيار الافتراضي للقوايم الحقيقية."],
        ["ListView.separated", "builder + فواصل", "زي builder بس بتاخد <code>separatorBuilder</code> يرسم فاصل بين كل عنصرين."],
      ],
      code: {
        lang: "dart",
        src: `ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    final item = items[index];
    return ListTile(
      title: Text(item.title),
      subtitle: Text(item.city),
    );
  },
)`,
        note: "<code>items</code> قايمة objects فيها <code>title</code> و <code>city</code>. الـ <code>itemBuilder</code> بيتنادى بس للـ indexes القريبة من الشاشة.",
      },
      focus: [{ label: "احفظها", text: "قايمة بيانات جاية من سيرفر أو من list حجمها غير معروف؟ <code>ListView.builder</code>. دايما." }],
      interview: [
        { q: "إيه الفرق بين ListView و ListView.builder؟", a: "الـ <code>ListView</code> العادية بتاخد <code>children</code> جاهزة فكل الـ widgets بتتبني مرة واحدة حتى لو مش ظاهرة. الـ <code>ListView.builder</code> lazy: بتنادي <code>itemBuilder</code> للعناصر اللي ظاهرة أو قريبة من الظهور بس، وبتعيد استخدام الـ elements لما تتمرر، فالأداء والذاكرة أحسن بكتير مع القوايم الطويلة أو اللي حجمها مش معروف." },
      ],
    },
    {
      title: "separated و GridView",
      en: "ListView.separated, GridView.builder",
      codes: [
        {
          lang: "dart",
          title: "فاصل بين العناصر",
          src: `ListView.separated(
  itemCount: items.length,
  separatorBuilder: (_, _) => const Divider(height: 1),
  itemBuilder: (context, i) => ListTile(title: Text(items[i].title)),
)`,
          note: "الـ <code>separatorBuilder</code> بياخد (context, index) وبنكتب <code>_</code> للمتغيرات اللي مش بنستخدمها (من Dart 3.7 ينفع <code>_, _</code> مرتين).",
        },
        {
          lang: "dart",
          title: "شبكة lazy",
          src: `GridView.builder(
  padding: const EdgeInsets.all(12),
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
    mainAxisSpacing: 12,
    crossAxisSpacing: 12,
    childAspectRatio: 0.8,
  ),
  itemCount: items.length,
  itemBuilder: (context, i) => Card(child: Text(items[i].title)),
)`,
          note: "<code>SliverGridDelegateWithMaxCrossAxisExtent</code> بديل: بتحدد أكبر عرض للخلية والعدد بيتحسب حسب عرض الشاشة (مناسب للـ responsive).",
        },
      ],
      points: [
        "<code>itemExtent</code> (مقاس ثابت للعنصر) بيسرّع الـ layout لو كل العناصر نفس الارتفاع.",
        "<code>padding</code> بتاع الـ ListView نفسه أحسن من لف الـ ListView بـ Padding، لأن الهامش بيتمرر مع المحتوى.",
      ],
    },
    {
      title: "SingleChildScrollView و shrinkWrap",
      en: "SingleChildScrollView and shrinkWrap",
      body: "<p><code>SingleChildScrollView</code> بيخلي <b>widget واحد</b> (عادة Column) قابل للتمرير، بس بيبنيه كله مرة واحدة ومن غير lazy.</p>",
      points: [
        "<b>مناسب:</b> فورم أو صفحة تفاصيل فيها عناصر قليلة وثابتة، أو محتوى ممكن يزيد عن الشاشة لما الكيبورد يظهر.",
        "<b>غلط:</b> Column فيه عناصر من list طويلة (<code>for</code> على 500 عنصر). كلهم بيتبنوا ويترسموا. استخدم builder.",
        "<code>shrinkWrap: true</code> بيخلي الـ ListView ياخد ارتفاع محتواه كله، فبيحسب كل العناصر مرة واحدة ويلغي الـ lazy. استخدمه بس لقايمة صغيرة جوه scrollable تاني، ومعاه غالبا <code>physics: NeverScrollableScrollPhysics()</code>.",
        "الحل الأفضل لقايمة جوه صفحة بتتمرر: <code>CustomScrollView</code> مع slivers (الشريحة الجاية).",
      ],
      codes: [
        { lang: "dart", title: "غلط: كل العناصر بتتبني", src: `SingleChildScrollView(
  child: Column(
    children: [for (final i in items) ListTile(title: Text(i.title))],
  ),
)` },
        { lang: "dart", title: "صح: lazy", src: `ListView.builder(
  itemCount: items.length,
  itemBuilder: (_, i) => ListTile(title: Text(items[i].title)),
)` },
      ],
      interview: [
        { q: "إمتى SingleChildScrollView غلط؟ وإيه تكلفة shrinkWrap؟", a: "هو غلط لما المحتوى قايمة طويلة، لأنه بيبني كل الأولاد مرة واحدة من غير lazy. وfشrinkWrap بيخلي الـ ListView يقيس كل عناصره عشان يعرف ارتفاعه الكلي، فبيلغي الميزة الأساسية للـ builder. بستخدمهم بس للمحتوى القصير، وللمحتوى الطويل المركب بستخدم <code>CustomScrollView</code> مع slivers." },
      ],
    },
    {
      title: "ScrollController",
      en: "ScrollController: listen, jump, animate, dispose",
      body: "<p>الـ <code>ScrollController</code> بيخليك تعرف مكان التمرير وتتحكم فيه: تعرف وصلت لآخر القايمة (infinite scroll)، أو ترجع لأول القايمة بزرار. زي أي controller: بيتعمل في <code>initState</code> وبيتقفل في <code>dispose</code>.</p>",
      code: {
        lang: "dart",
        src: `class _FeedState extends State<Feed> {
  final ScrollController _scroll = ScrollController();

  @override
  void initState() {
    super.initState();
    _scroll.addListener(_onScroll);
  }

  void _onScroll() {
    final p = _scroll.position;
    if (p.pixels >= p.maxScrollExtent - 200) {
      debugPrint('near the end: load more');
    }
  }

  void _toTop() {
    _scroll.animateTo(
      0,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
    );
  }

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: _scroll,
      itemCount: 100,
      itemBuilder: (_, i) => ListTile(title: Text('Row $i')),
    );
  }
}`,
        note: "<code>animateTo</code> بحركة و<code>jumpTo</code> فورا. الـ listener بيتنادى مع كل pixel تمرير فخليه خفيف وماتنادش <code>setState</code> فيه إلا لما تحتاج.",
      },
      pitfall: "تنادي <code>_scroll.position</code> أو <code>animateTo</code> قبل ما الـ controller يتربط بـ scrollable (مثلا في <code>initState</code> مباشرة). بيطلع «ScrollController not attached to any scroll views». اتأكد من <code>_scroll.hasClients</code> أو استنى أول frame.",
    },
    {
      title: "CustomScrollView و Slivers",
      en: "CustomScrollView, SliverAppBar, SliverList",
      body: "<p>الـ <b>sliver</b> هو قطعة من منطقة تمرير. <code>CustomScrollView</code> بيجمع كذا sliver في scroll واحد: مثلا AppBar بيصغر مع التمرير، وتحته قايمة، وتحتها شبكة، كله lazy ومتناغم.</p>",
      code: {
        lang: "dart",
        src: `CustomScrollView(
  slivers: [
    const SliverAppBar(
      pinned: true,
      expandedHeight: 160,
      flexibleSpace: FlexibleSpaceBar(title: Text('Listings')),
    ),
    const SliverToBoxAdapter(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Text('Latest'),
      ),
    ),
    SliverList.builder(
      itemCount: items.length,
      itemBuilder: (context, i) => ListTile(title: Text(items[i].title)),
    ),
  ],
)`,
        note: "<code>SliverToBoxAdapter</code> بيحط widget عادي جوه الـ slivers. و <code>pinned: true</code> بيخلي الـ AppBar يفضل ثابت فوق بعد ما يصغر.",
      },
      points: [
        "اللي جوه <code>slivers</code> لازم يكون slivers: متحطش <code>ListView</code> العادية هناك، استخدم <code>SliverList</code>.",
        "<code>SliverGrid</code> للشبكة، و<code>SliverPadding</code> للهوامش، و<code>SliverFillRemaining</code> لحالة «مفيش نتايج».",
        "<code>ListView</code> و<code>GridView</code> نفسهم مبنيين فوق <code>CustomScrollView</code>.",
      ],
      interview: [
        { q: "إيه هي الـ slivers ولما أستخدمها؟", a: "الـ sliver جزء من منطقة تمرير بيتحكم في شكله وقت التمرير. بستخدم <code>CustomScrollView</code> لما أحتاج أخلط أكتر من نوع محتوى في scroll واحد (AppBar متغير الحجم، قايمة، شبكة) من غير ما أحط scrollable جوه scrollable، وكلهم lazy. أشهرهم <code>SliverAppBar</code> و<code>SliverList</code> و<code>SliverGrid</code> و<code>SliverToBoxAdapter</code>." },
      ],
    },
    {
      title: "الـ Keys: ليه موجودة",
      en: "Why keys exist",
      body: "<p>في المستوى الأول شفت إن الـ element بيقارن widget جديد بقديم في <b>نفس المكان</b>: لو نفس النوع ونفس الـ key بيحدّث نفسه ويحتفظ بالـ state. المشكلة: المقارنة بالمكان (الترتيب) مش بالهوية.</p><p>لما قايمة عناصرها <b>Stateful</b> ويتغير ترتيبها أو يتمسح منها عنصر من الأول، الـ elements بتفضل في مكانها والـ widgets الجديدة بتتوزع عليها حسب الترتيب، فالـ State بتاعت عنصر بتنتقل لعنصر تاني. الـ <code>Key</code> بيقول للـ framework: «ده نفس العنصر حتى لو مكانه اتغير».</p>",
      codes: [
        {
          lang: "dart",
          title: "غلط: من غير keys",
          src: `Column(
  children: [
    for (final t in todos) TodoTile(title: t.title),
  ],
)`,
          note: "امسح أول عنصر: علامة الصح المتعلمة هتفضل في أول مكان وتبقى على العنصر اللي بعده.",
        },
        {
          lang: "dart",
          title: "صح: key بقيمة فريدة ثابتة",
          src: `Column(
  children: [
    for (final t in todos)
      TodoTile(key: ValueKey(t.id), title: t.title),
  ],
)`,
          note: "دلوقتي كل element مربوط بعنصره، والـ State بتتحرك معاه.",
        },
      ],
      pitfall: "الـ Stateless widgets في القوايم مش بتتأثر (مفيش state تضيع). المشكلة تظهر بس لما العنصر عنده State: checkbox، animation، TextField بنص مكتوب.",
    },
    {
      title: "أنواع الـ Keys",
      en: "ValueKey, ObjectKey, UniqueKey, GlobalKey",
      terms: [
        ["ValueKey", "بقيمة", "<code>ValueKey(item.id)</code>. هو الأكثر استخدام: بتديله قيمة فريدة وثابتة للعنصر (id)."],
        ["ObjectKey", "بالـ object", "<code>ObjectKey(item)</code>. لما الهوية هي الـ object نفسه (مقارنة بـ identity) ومفيش id واحد فريد."],
        ["UniqueKey", "فريد دايما", "بيتعمل جديد كل مرة. لو حطيته في <code>build</code> هيتبني الـ element من جديد في كل rebuild: مفيد بس لما عايز <b>تصفّر</b> الـ state قصدا."],
        ["GlobalKey", "مفتاح عالمي", "فريد في التطبيق كله. بيخليك توصل لـ State أو RenderObject من برا (<code>formKey.currentState</code>) وينقل widget بين أماكن من غير ما يضيع. تقيل، فاستخدمه بحساب."],
      ],
      code: {
        lang: "dart",
        src: `class TodoTile extends StatefulWidget {
  const TodoTile({super.key, required this.title});

  final String title;

  @override
  State<TodoTile> createState() => _TodoTileState();
}

class _TodoTileState extends State<TodoTile> {
  bool _done = false;

  @override
  Widget build(BuildContext context) {
    return CheckboxListTile(
      title: Text(widget.title),
      value: _done,
      onChanged: (v) => setState(() => _done = v ?? false),
    );
  }
}`,
        note: "ده widget العنصر اللي فيه state (<code>_done</code>). في أي قايمة بتتغير فيها العناصر لازم تديه key.",
      },
      focus: [{ label: "احفظها", text: "الـ key لازم يكون <b>ثابت</b> و<b>فريد بين الإخوات</b>. مش index (لأن الـ index بيتغير بالترتيب) ومش UniqueKey في build." }],
      interview: [
        { q: "إيه فايدة الـ keys في Flutter؟ ومين أنواعها؟", a: "الـ key بيحدد هوية الـ widget لما الـ framework يقارنه بالقديم. من غيره المقارنة بالنوع والمكان بس، فلو قايمة عناصرها Stateful اتغير ترتيبها أو اتمسح منها عنصر، الـ State بتتنقل لعنصر غلط. <code>ValueKey</code> بقيمة زي id وهو الأشهر، <code>ObjectKey</code> بالـ object، <code>UniqueKey</code> بيتعمل جديد كل مرة فبيصفر الـ state، <code>GlobalKey</code> فريد في التطبيق وبيسمح بالوصول للـ State من برا زي <code>FormState</code>." },
        { q: "إيه المشكلة لو استخدمت index كـ key في قايمة بتتحرك عناصرها؟", a: "الـ index بيتغير لما العنصر يتحرك أو يتمسح اللي قبله، فالـ key مش بيمثل هوية العنصر وبنرجع لنفس المشكلة. لازم key مبني على قيمة ثابتة للعنصر زي id." },
      ],
    },
    {
      title: "Pull to refresh",
      en: "RefreshIndicator",
      body: "<p><code>RefreshIndicator</code> بيضيف السحب للتحديث لأي scrollable. بياخد <code>onRefresh</code> ترجع <code>Future</code>، والـ spinner بيفضل ظاهر لحد ما الـ Future يخلص.</p>",
      code: {
        lang: "dart",
        src: `RefreshIndicator(
  onRefresh: () async {
    await _reload();
  },
  child: ListView.builder(
    physics: const AlwaysScrollableScrollPhysics(),
    itemCount: items.length,
    itemBuilder: (_, i) => ListTile(title: Text(items[i].title)),
  ),
)`,
        note: "<code>AlwaysScrollableScrollPhysics</code> مهمة: لو القايمة أقصر من الشاشة مش هتتمرر، فمش هتقدر تسحب للتحديث من غيرها. و<code>_reload</code> دالة بتجيب الداتا وتنادي <code>setState</code>.",
      },
      pitfall: "تنسى تعمل <code>await</code> أو ترجع الـ Future: الـ spinner يختفي فورا قبل ما الداتا توصل. لازم الـ callback ترجع Future بيستنى الشغل فعلا.",
    },
  ],

  drills: [
    {
      title: "اكتب: ListView.builder",
      lang: "dart",
      code: `ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    final item = items[index];
    return ListTile(
      title: Text(item.title),
      subtitle: Text(item.city),
    );
  },
)`,
    },
    {
      title: "اكتب: items بـ keys",
      lang: "dart",
      code: `ListView(
  children: [
    for (final todo in todos)
      TodoTile(
        key: ValueKey(todo.id),
        title: todo.title,
      ),
  ],
)`,
      note: "الـ key من الـ <code>id</code> مش من الـ index.",
    },
    {
      title: "اكتب: ScrollController",
      lang: "dart",
      code: `class _FeedState extends State<Feed> {
  final ScrollController _scroll = ScrollController();

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: _scroll,
      itemCount: 50,
      itemBuilder: (_, i) => Text('Row $i'),
    );
  }
}`,
    },
  ],

  tasks: [
    {
      title: "قايمة بسحب للتحديث",
      lang: "dart",
      prompt: "<p>اكتب <code>StatefulWidget</code> اسمه <code>NamesPage</code> فيه <code>List&lt;String&gt; _names</code> مبدئيها <code>['Ali', 'Sara']</code>. اعرضها في <code>ListView.separated</code> جوه <code>RefreshIndicator</code>. لما المستخدم يسحب، استنى ثانية (<code>Future.delayed</code>) وبعدين ضيف اسم جديد <code>'User N'</code> (N = العدد الجديد) واعمل تحديث للواجهة. تأكد إن الـ State لسه موجود قبل التحديث.</p>",
      hints: [
        "الـ <code>onRefresh</code> دالة <code>async</code> بتعمل <code>await Future.delayed(...)</code> وبعدين <code>if (!mounted) return;</code> وبعدين <code>setState</code>.",
        "حط <code>physics: const AlwaysScrollableScrollPhysics()</code> على الـ ListView.",
      ],
      solution: `class NamesPage extends StatefulWidget {
  const NamesPage({super.key});

  @override
  State<NamesPage> createState() => _NamesPageState();
}

class _NamesPageState extends State<NamesPage> {
  final List<String> _names = ['Ali', 'Sara'];

  Future<void> _refresh() async {
    await Future.delayed(const Duration(seconds: 1));
    if (!mounted) return;
    setState(() => _names.add('User \${_names.length + 1}'));
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _refresh,
      child: ListView.separated(
        physics: const AlwaysScrollableScrollPhysics(),
        itemCount: _names.length,
        separatorBuilder: (_, _) => const Divider(height: 1),
        itemBuilder: (_, i) => ListTile(title: Text(_names[i])),
      ),
    );
  }
}`,
      explain: "الـ <code>_refresh</code> بترجع Future فالـ spinner بيستنى لحد ما يخلص. الـ await الأول، والـ <code>mounted</code> بعده، والتغيير جوه <code>setState</code>.",
    },
    {
      title: "إصلاح باج الـ checkbox",
      lang: "dart",
      prompt: "<p>الـ <code>TodoTile</code> عنده State (علامة صح). المستخدم بيمسح عنصر بزرار، وبعد المسح علامة الصح بتنتقل لعنصر غلط. صلح الصفحة دي من غير ما تغير <code>TodoTile</code>. العناصر ليها <code>id</code> فريد.</p>",
      starter: `class Todo {
  const Todo(this.id, this.title);
  final int id;
  final String title;
}

class TodoList extends StatefulWidget {
  const TodoList({super.key});

  @override
  State<TodoList> createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  final List<Todo> _todos = [Todo(1, 'Buy'), Todo(2, 'Call')];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final t in _todos)
          Row(
            children: [
              Expanded(child: TodoTile(title: t.title)),
              IconButton(
                icon: const Icon(Icons.delete),
                onPressed: () => setState(() => _todos.remove(t)),
              ),
            ],
          ),
      ],
    );
  }
}`,
      hints: [
        "الـ element بيقارن بالمكان والنوع. إيه اللي بيفرق بين عنصر وعنصر؟ الـ <code>id</code>.",
        "حط <code>key: ValueKey(t.id)</code> على أعلى widget في كل عنصر (الـ <code>Row</code>)، مش على الـ TodoTile الداخلي بس.",
      ],
      solution: `class Todo {
  const Todo(this.id, this.title);
  final int id;
  final String title;
}

class TodoList extends StatefulWidget {
  const TodoList({super.key});

  @override
  State<TodoList> createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  final List<Todo> _todos = [Todo(1, 'Buy'), Todo(2, 'Call')];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final t in _todos)
          Row(
            key: ValueKey(t.id),
            children: [
              Expanded(child: TodoTile(title: t.title)),
              IconButton(
                icon: const Icon(Icons.delete),
                onPressed: () => setState(() => _todos.remove(t)),
              ),
            ],
          ),
      ],
    );
  }
}`,
      explain: "الـ key لازم يتحط على الـ widget اللي بيتحرك في القايمة، يعني العنصر اللي هو ابن مباشر للـ Column (هنا الـ Row). لو اتحط على الـ TodoTile الداخلي بس، الـ Row نفسه من غير key فمقارنة الـ Column بتفضل بالمكان.",
    },
    {
      title: "تمرير للأعلى بزرار",
      lang: "dart",
      prompt: "<p>اكتب <code>StatefulWidget</code> اسمه <code>LongList</code> بيعرض <code>ListView.builder</code> بـ 100 عنصر. فوق الشاشة زرار «Top» بيرجع القايمة لأولها بحركة 300 ميلي ثانية، وبيظهر بس لما المستخدم يكون نزل أكتر من 400 بكسل (بيتحدد بـ listener). نظّف الـ controller.</p>",
      hints: [
        "ضيف listener في <code>initState</code> بيقرا <code>_scroll.offset</code> ويحدّث <code>bool _showTop</code> بـ <code>setState</code> بس لو القيمة اتغيرت.",
        "حط الزرار في <code>Stack</code> فوق القايمة أو استخدم <code>floatingActionButton</code> في Scaffold.",
      ],
      solution: `class LongList extends StatefulWidget {
  const LongList({super.key});

  @override
  State<LongList> createState() => _LongListState();
}

class _LongListState extends State<LongList> {
  final ScrollController _scroll = ScrollController();
  bool _showTop = false;

  @override
  void initState() {
    super.initState();
    _scroll.addListener(() {
      final show = _scroll.offset > 400;
      if (show != _showTop) {
        setState(() => _showTop = show);
      }
    });
  }

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: _showTop
          ? FloatingActionButton.extended(
              onPressed: () => _scroll.animateTo(
                0,
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeOut,
              ),
              label: const Text('Top'),
            )
          : null,
      body: ListView.builder(
        controller: _scroll,
        itemCount: 100,
        itemBuilder: (_, i) => ListTile(title: Text('Row $i')),
      ),
    );
  }
}`,
      explain: "الـ listener بيتنادى مع كل حركة، فبنعمل <code>setState</code> بس لما الحالة (ظاهر أو لأ) تتغير فعلا، عشان منعيدش بناء الصفحة مع كل pixel.",
    },
  ],

  quiz: [
    {
      q: "عندك 5000 عقار جايين من API. أنسب widget للعرض؟",
      options: [
        "<code>SingleChildScrollView</code> فيه Column",
        "<code>ListView(children: [...])</code> بـ map على الكل",
        "<code>Column</code> جوه <code>Expanded</code>",
        "<code>ListView.builder</code>",
      ],
      answer: 3,
      why: "الـ builder بيبني بس العناصر الظاهرة. الباقي بيبني الـ 5000 widget مرة واحدة.",
    },
    {
      q: "إيه اللي بيعمله <code>shrinkWrap: true</code> على ListView؟",
      options: [
        "بيسرّع التمرير",
        "بيخلي الـ ListView ياخد ارتفاع محتواه كله، فبيحسب كل العناصر ويلغي الـ lazy",
        "بيخلي العناصر أصغر",
        "بيشيل الـ padding",
      ],
      answer: 1,
      why: "عشان يعرف ارتفاعه لازم يقيس كل العناصر. مفيد لقايمة قصيرة جوه scrollable تاني، ومكلف للقوايم الطويلة.",
    },
    {
      q: "الأفضل لصفحة فيها AppBar بيصغر مع التمرير وتحته قايمة طويلة؟",
      options: [
        "<code>CustomScrollView</code> مع <code>SliverAppBar</code> و <code>SliverList</code>",
        "<code>Column</code> فيه AppBar و ListView",
        "<code>Stack</code> فيه ListView فوق AppBar",
        "<code>SingleChildScrollView</code> فيه ListView",
      ],
      answer: 0,
      why: "الـ slivers بتتمرر كلها كمنطقة واحدة ومتناغمة. Column فيه ListView بيدي unbounded height، و scrollable جوه scrollable مشاكل.",
    },
    {
      q: "المستخدم مسح أول عنصر من قايمة عناصرها Stateful من غير keys، وعلامة الصح انتقلت لعنصر غلط. ليه؟",
      options: [
        "الـ <code>setState</code> بتعدل عنصر غلط",
        "الـ elements بتتقارن بالمكان والنوع، فالـ State القديمة بقيت مع الـ widget اللي أخد مكانها",
        "الـ ListView بيخزن الـ state بالـ index بشكل غلط",
        "الـ Checkbox فيها باج",
      ],
      answer: 1,
      why: "من غير key، الـ widget الجديد في نفس الموضع والنوع بيستخدم نفس الـ element والـ State. الـ <code>ValueKey(id)</code> بيربط الـ State بهوية العنصر.",
    },
    {
      q: "أنهي key الأنسب لعناصر قايمة جاية من سيرفر وكل عنصر ليه id؟",
      options: [
        "<code>UniqueKey()</code>",
        "<code>ValueKey(index)</code>",
        "<code>ValueKey(item.id)</code>",
        "<code>GlobalKey()</code> جديد في كل build",
      ],
      answer: 2,
      why: "المطلوب key ثابت وفريد بين الإخوات. الـ <code>UniqueKey</code> وGlobalKey الجديد في build بيتعملوا من جديد في كل مرة فالـ State بتضيع، والـ index بيتغير بالترتيب.",
    },
    {
      q: "إيه اللي ممكن يحصل لو حطيت <code>key: UniqueKey()</code> على widget جوه <code>build</code>؟",
      options: [
        "الـ widget بيتبني من الأول في كل rebuild وبيفقد الـ State",
        "بيتحسن الأداء",
        "الـ key بيمنع الـ rebuild",
        "مفيش فرق",
      ],
      answer: 0,
      why: "كل <code>build</code> بيعمل UniqueKey جديد فالـ element القديم مبيتطابقش وبيتشال. بنستخدمه بس لما عايزين نصفر الـ state قصدا.",
    },
    {
      q: "السحب للتحديث بيفضل الـ spinner لحد ما إيه يحصل؟",
      options: [
        "5 ثواني ثابتة",
        "لحد ما المستخدم يرفع إيده",
        "لحد ما الـ Future اللي رجعها <code>onRefresh</code> يخلص",
        "لحد ما <code>setState</code> تتنادى",
      ],
      answer: 2,
      why: "الـ <code>RefreshIndicator</code> بيستنى الـ Future. لو رجعت Future خلصت فورا الـ spinner بيختفي فورا.",
    },
    {
      q: "إيه الخطأ؟",
      code: { lang: "dart", src: `class _S extends State<W> {
  final ScrollController _c = ScrollController();

  @override
  Widget build(BuildContext context) {
    return ListView(controller: _c, children: const []);
  }
}` },
      options: [
        "ناقص <code>dispose</code> للـ controller",
        "الـ controller لازم يتعمل في build",
        "<code>children</code> لازم تبقى مش const",
        "<code>ListView</code> مبتقبلش controller",
      ],
      answer: 0,
      why: "أي controller بنعمله لازم نقفله في <code>dispose</code> وإلا يتسرب. الإنشاء كـ field صح.",
    },
    {
      q: "ليه الكود ده مش بيشتغل صح؟",
      code: { lang: "dart", src: `CustomScrollView(
  slivers: [
    ListView.builder(
      itemCount: 3,
      itemBuilder: (_, i) => Text('\$i'),
    ),
  ],
)` },
      options: [
        "ناقص <code>shrinkWrap</code>",
        "الـ ListView مش sliver، المفروض <code>SliverList.builder</code>",
        "<code>itemCount</code> لازم تتشال",
        "<code>slivers</code> لازم تبقى const",
      ],
      answer: 1,
      why: "<code>slivers</code> بتقبل slivers بس. الـ ListView widget عادي بيتحط فيه جوه <code>SliverToBoxAdapter</code> أو يتبدل بـ <code>SliverList.builder</code>.",
    },
    {
      q: "اسم الـ widget اللي بيضيف السحب للتحديث؟",
      answer: ["RefreshIndicator", "refreshindicator"],
      why: "<code>RefreshIndicator(onRefresh: ..., child: ListView(...))</code>.",
    },
  ],
};
