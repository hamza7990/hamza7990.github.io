window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f7"] = {
  slides: [
    {
      kicker: "السؤال الأساسي",
      title: "الـ state دي بتاعة widget واحد ولا بتاعة التطبيق؟",
      en: "Ephemeral state vs app state",
      body: "<p>مش كل state محتاجة state management. فيه نوعين:</p>",
      terms: [
        ["ephemeral state", "state مؤقتة محلية", "بتاعة widget واحد ومحدش تاني محتاجها: التاب المختار، قيمة animation، نص في TextField، هل الـ checkbox متعلم. مكانها <code>StatefulWidget</code> + <code>setState</code>. كفاية."],
        ["app state", "state مشتركة", "بتتشارك بين شاشات كتير أو لازم تعيش بعد ما الشاشة تتقفل: المستخدم الحالي، سلة المشتريات، اللغة والثيم، المفضلة. دي اللي محتاجة طريقة مركزية."],
      ],
      focus: [{ label: "قاعدة عملية", text: "ابدأ بـ <code>setState</code>. لما تلاقي نفسك بتمرر نفس الداتا عبر widgets كتير أو شاشتين محتاجين نفس القيمة، ارفعها لمكان مشترك أو استخدم state management." }],
      interview: [
        { q: "إيه الفرق بين ephemeral state و app state؟ وإمتى تحتاج state management؟", a: "الـ ephemeral state محلية لـ widget واحد (التاب المختار، نص حقل) فبكفيها <code>setState</code>. الـ app state بتتشارك بين شاشات أو بتعيش أطول من شاشة (المستخدم، السلة، الثيم). بحتاج state management لما أكتر من widget بعيدين عن بعض محتاجين نفس القيمة، أو لما تمرير القيمة بالـ constructors يبقى مرهق (prop drilling)، أو لما أحتاج أفصل منطق العمل عن الواجهة." },
      ],
    },
    {
      title: "Prop drilling",
      en: "Prop drilling",
      body: "<p>لو widget في عمق 5 مستويات محتاج اسم المستخدم، الطريقة الساذجة إنك تمرره كـ parameter عبر كل widget في الطريق، حتى اللي مش بيستخدمه. ده اسمه <b>prop drilling</b>: كود طويل، وأي تغيير في الداتا بيمس widgets كتير.</p>",
      code: {
        lang: "dart",
        src: `// every layer just forwards userName
class HomePage extends StatelessWidget {
  const HomePage({super.key, required this.userName});
  final String userName;

  @override
  Widget build(BuildContext context) =>
      Dashboard(userName: userName); // forwards
}`,
        note: "<code>HomePage</code> مش محتاجة الاسم، بتمرره بس. لو الطبقات 5، ده هيعمل ملل وأخطاء.",
      },
      points: [
        "الحل: مكان واحد بيمسك الداتا، وأي widget تحته ياخدها مباشرة من <code>context</code>.",
        "ده بالظبط اللي بيعمله <code>InheritedWidget</code>، والباقي (Provider, Riverpod) مبني على نفس الفكرة.",
      ],
    },
    {
      title: "InheritedWidget من جوه",
      en: "InheritedWidget, of(context), updateShouldNotify",
      body: "<p>الـ <code>InheritedWidget</code> widget بيقف فوق الشجرة ويمسك بيانات. أي widget تحته يقدر يجيبها بـ <code>context.dependOnInheritedWidgetOfExactType&lt;T&gt;()</code>، وده بيعمل حاجتين: <b>يلاقي</b> أقرب widget من النوع ده فوقه، و<b>يسجل</b> الـ widget ده كمعتمد عليه. لما الـ InheritedWidget يتبني من جديد وبيانات اتغيرت (<code>updateShouldNotify</code> رجعت true)، كل المعتمدين بيتعمل لهم rebuild.</p>",
      code: {
        lang: "dart",
        src: `class UserScope extends InheritedWidget {
  const UserScope({
    super.key,
    required this.name,
    required super.child,
  });

  final String name;

  static UserScope of(BuildContext context) {
    final scope =
        context.dependOnInheritedWidgetOfExactType<UserScope>();
    assert(scope != null, 'No UserScope above this context');
    return scope!;
  }

  @override
  bool updateShouldNotify(UserScope oldWidget) {
    return name != oldWidget.name;
  }
}

// anywhere below
// final name = UserScope.of(context).name;`,
        note: "الـ <code>of</code> static هو اللي بيخلي <code>Theme.of(context)</code> و<code>MediaQuery.of(context)</code> تشتغل بنفس الأسلوب بالظبط.",
      },
      points: [
        "<code>dependOnInheritedWidgetOfExactType</code> بتسجل اعتماد (rebuild عند التغيير). <code>getInheritedWidgetOfExactType</code> بتقرا بس من غير اشتراك.",
        "الـ InheritedWidget نفسه <b>immutable</b>. عشان البيانات تتغير لازم يتبني من جديد من <code>StatefulWidget</code> فوقه (أو يمسك ChangeNotifier).",
        "<code>updateShouldNotify</code> ترجع true بس لو القيمة اتغيرت فعلا، وإلا هتعمل rebuild من غير داعي.",
      ],
      interview: [
        { q: "إزاي بتشتغل Theme.of(context)؟ واشرح InheritedWidget.", a: "<code>Theme</code> هو InheritedWidget. الـ <code>of</code> بتنادي <code>context.dependOnInheritedWidgetOfExactType&lt;Theme&gt;()</code> اللي بتدور على أقرب Theme فوق الـ context، وبتسجل الـ widget الحالي كمعتمد عليه. لما الـ Theme يتبني بقيمة مختلفة و<code>updateShouldNotify</code> ترجع true، الـ framework بيعمل rebuild لكل widget اعتمد عليه. كده البيانات بتنزل في الشجرة من غير prop drilling والتحديث بيتم بس للمهتمين." },
        { q: "إيه الفرق بين dependOnInheritedWidgetOfExactType و getInheritedWidgetOfExactType؟", a: "الأولى بتجيب الـ widget وبتسجل اعتماد، فالـ widget بيتعمله rebuild لما الـ InheritedWidget يتغير. التانية بتجيبه بس من غير اشتراك، فمناسبة لما أحتاج القيمة مرة واحدة ومش عايز rebuild، مثلا في callback." },
      ],
    },
    {
      title: "ChangeNotifier و ListenableBuilder",
      en: "ChangeNotifier and ListenableBuilder",
      body: "<p>الـ <code>ChangeNotifier</code> كلاس عادي بيمسك state وينادي <code>notifyListeners()</code> لما حاجة تتغير. مفيش علاقة له بالـ widgets، فسهل تختبره. والـ <code>ListenableBuilder</code> بيسمعله ويعيد بناء الجزء بتاعه بس.</p>",
      code: {
        lang: "dart",
        src: `class CartModel extends ChangeNotifier {
  final List<String> _items = [];

  List<String> get items => List.unmodifiable(_items);
  int get count => _items.length;

  void add(String item) {
    _items.add(item);
    notifyListeners();
  }

  void clear() {
    _items.clear();
    notifyListeners();
  }
}

// inside a State
// final CartModel _cart = CartModel();   (dispose it in dispose)
// ListenableBuilder(
//   listenable: _cart,
//   builder: (context, child) => Text('Items: \${_cart.count}'),
// )`,
        note: "المنطق (add/clear) في الـ model، والواجهة بس بتسمع. الـ model يتقفل بـ <code>dispose()</code> لما صاحبه (State) يتقفل.",
      },
      pitfall: "تغير الـ state من غير <code>notifyListeners()</code>. الداتا اتغيرت لكن محدش اتبلغ، فالشاشة قديمة (نفس مشكلة نسيان setState).",
    },
    {
      title: "ValueNotifier و ValueListenableBuilder",
      en: "ValueNotifier and ValueListenableBuilder",
      body: "<p>لو الـ state قيمة واحدة بس (رقم، bool، نص)، <code>ValueNotifier&lt;T&gt;</code> أخف: بيمسك <code>value</code> وبينادي الـ listeners تلقائي لما تتغير. ومعاه <code>ValueListenableBuilder</code>.</p>",
      code: {
        lang: "dart",
        src: `class _CounterState extends State<Counter> {
  final ValueNotifier<int> _count = ValueNotifier<int>(0);

  @override
  void dispose() {
    _count.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<int>(
      valueListenable: _count,
      builder: (context, value, child) {
        return Column(
          children: [
            Text('Count: $value'),
            child!,
          ],
        );
      },
      child: TextButton(
        onPressed: () => _count.value++,
        child: const Text('Add'),
      ),
    );
  }
}`,
        note: "الـ <code>child</code> بيتبني مرة واحدة وبيتمرر للـ builder، فالزرار مبيتبناش من جديد مع كل تغيير. والتعديل بـ <code>_count.value++</code> من غير setState.",
      },
      interview: [
        { q: "إمتى تستخدم ValueNotifier بدل ChangeNotifier؟", a: "<code>ValueNotifier</code> لو الـ state قيمة واحدة بسيطة (counter، toggle، selected tab): بيمسك <code>value</code> وبينبه تلقائيا لما تتغير. <code>ChangeNotifier</code> لو عندي model فيه أكتر من field وعمليات (add, remove, load)، وأنادي <code>notifyListeners()</code> بإيدي. وفي الاتنين الواجهة بتسمع بـ <code>ListenableBuilder</code> أو <code>ValueListenableBuilder</code>، ولازم <code>dispose</code>." },
      ],
    },
    {
      title: "حزمة provider",
      en: "ChangeNotifierProvider, watch, read, select, Consumer",
      body: "<p><code>provider</code> <b>حزمة</b> (مش جزء من الـ SDK)، بتضيفها بـ <code>flutter pub add provider</code> وتعمل <code>import 'package:provider/provider.dart';</code>. هي غلاف رفيع حوالين <code>InheritedWidget</code>: بيعمل لك الـ model ويقفله (dispose) تلقائي، ويدّيك طرق سهلة تقراه.</p>",
      code: {
        lang: "dart",
        src: `void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => CartModel(),
      child: const MyApp(),
    ),
  );
}

class CartBadge extends StatelessWidget {
  const CartBadge({super.key});

  @override
  Widget build(BuildContext context) {
    final count = context.watch<CartModel>().count;
    return Text('Cart: $count');
  }
}

class AddButton extends StatelessWidget {
  const AddButton({super.key});

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: () => context.read<CartModel>().add('Villa'),
      child: const Text('Add'),
    );
  }
}`,
        note: "<code>CartBadge</code> بيستخدم <code>watch</code> (بيعمل rebuild لما الـ model يتغير). <code>AddButton</code> بيستخدم <code>read</code> (بينفذ أمر من غير اشتراك).",
      },
      terms: [
        ["context.watch&lt;T&gt;()", "اقرا واشترك", "بتجيب الـ model وبتعمل rebuild للـ widget عند أي <code>notifyListeners</code>. للاستخدام في <code>build</code>."],
        ["context.read&lt;T&gt;()", "اقرا من غير اشتراك", "بتجيب الـ model مرة واحدة. للاستخدام في callbacks (onPressed) لتنفيذ أوامر."],
        ["context.select&lt;T, R&gt;(...)", "اشترك في جزء", "بتعمل rebuild بس لو القيمة اللي اخترتها اتغيرت، مش لأي تغيير في الـ model."],
        ["Consumer&lt;T&gt;", "بناء موضعي", "widget بيدّيك الـ model في builder، فبتحدد بالظبط الجزء اللي هيتبني من جديد."],
      ],
    },
    {
      title: "select و Consumer وأماكن الـ providers",
      en: "select, Consumer, MultiProvider and where to place providers",
      body: "<p>الـ provider لازم يكون <b>فوق</b> كل widget هيستخدمه، وفي أضيق نطاق ممكن (لكن فوق كل المستخدمين). شاشة وحدة بتستخدمه؟ حطه فوق الشاشة دي. التطبيق كله (مستخدم، ثيم)؟ فوق <code>MaterialApp</code>. وأكتر من واحد يتجمعوا في <code>MultiProvider</code>.</p>",
      codes: [
        {
          lang: "dart",
          title: "select: rebuild بس لو count اتغير",
          src: `final count = context.select<CartModel, int>(
  (cart) => cart.count,
);`,
        },
        {
          lang: "dart",
          title: "Consumer: بناء الجزء المتغير بس",
          src: `Column(
  children: [
    const Text('Cart'),
    Consumer<CartModel>(
      builder: (context, cart, child) => Text('\${cart.count} items'),
    ),
  ],
)`,
        },
        {
          lang: "dart",
          title: "أكتر من provider",
          src: `MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => CartModel()),
    ChangeNotifierProvider(create: (_) => ThemeModel()),
  ],
  child: const MyApp(),
)`,
        },
      ],
      pitfall: "تحط الـ provider جوه الشاشة وبعدين تحاول تقراه من شاشة تانية (route تانية). الـ routes الجديدة بتتحط تحت <code>MaterialApp</code> مش تحت صفحتك، فالـ provider لازم يكون فوق <code>MaterialApp</code> لو بتشاركه بين شاشات.",
      interview: [
        { q: "إيه الفرق بين context.watch و context.read و context.select؟", a: "<code>watch</code> بتجيب الـ model وتعمل rebuild عند أي notify، فبتتستخدم في <code>build</code>. <code>read</code> بتجيبه من غير اشتراك فبتتستخدم في الـ callbacks زي onPressed لتنفيذ أوامر. <code>select</code> بتشترك في جزء محدد من الـ model وبتعمل rebuild بس لو القيمة اللي اخترتها اتغيرت، فبتقلل الـ rebuilds. و<code>Consumer</code> بيعمل نفس <code>watch</code> لكن بيحدد نطاق الـ rebuild في builder." },
      ],
    },
    {
      title: "أخطاء شائعة",
      en: "Common mistakes",
      codes: [
        {
          lang: "dart",
          title: "غلط: read جوه build",
          src: `@override
Widget build(BuildContext context) {
  // reads once, never rebuilds when the cart changes
  final count = context.read<CartModel>().count;
  return Text('$count');
}`,
          note: "الشاشة هتفضل على القيمة الأولى. استخدم <code>watch</code> هنا.",
        },
        {
          lang: "dart",
          title: "غلط: watch في callback",
          src: `onPressed: () {
  context.watch<CartModel>().clear();
}`,
          note: "<code>watch</code> مسموحة في <code>build</code> بس، وبترمي خطأ هنا. استخدم <code>read</code>.",
        },
        {
          lang: "dart",
          title: "حماية notifyListeners بعد dispose",
          src: `class SafeModel extends ChangeNotifier {
  bool _disposed = false;

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }

  @override
  void notifyListeners() {
    if (!_disposed) super.notifyListeners();
  }
}`,
          note: "لو model بينادي notify بعد await وهو اتقفل بتحصل «was used after being disposed». الأحسن تلغي الشغل، لكن ده حماية بسيطة.",
        },
      ],
      points: [
        "<b>rebuild أكتر من اللازم:</b> <code>watch</code> على model كبير في widget كبير. استخدم <code>select</code> أو <code>Consumer</code> على الجزء الصغير، أو قسّم الـ widget.",
        "<b>تعديل list من غير notify:</b> <code>_items.add(x)</code> من برا الـ model (لو الـ getter رجع الـ list نفسها). ارجع نسخة غير قابلة للتعديل وخلي التعديل في دوال الـ model اللي بتنادي <code>notifyListeners</code>.",
        "<b>إنشاء model جوه build:</b> <code>ChangeNotifierProvider(create: ...)</code> بيعمله مرة واحدة، لكن لو أنشأته بنفسك في <code>build</code> هتفقد الحالة مع كل rebuild.",
        "الـ Riverpod والـ Bloc مبنيين على نفس الفكرة بأسلوب مختلف. هنتعلمهم بعدين، وفهمك لـ InheritedWidget هنا هو الأساس.",
      ],
      interview: [
        { q: "إيه أشهر أخطاء Provider؟", a: "استخدام <code>context.read</code> جوه <code>build</code> فالـ widget مبيتحدثش، واستخدام <code>context.watch</code> جوه callback فبيرمي خطأ. كمان نسيان <code>notifyListeners()</code> بعد تغيير الـ state، وعمل <code>watch</code> على model كبير في widget كبير فكل تغيير بيعمل rebuild كتير (الحل <code>select</code> أو <code>Consumer</code>)، وتحديد الـ provider في مكان أدنى من الشاشات اللي هتستخدمه." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: ChangeNotifier",
      lang: "dart",
      code: `class CartModel extends ChangeNotifier {
  final List<String> _items = [];

  List<String> get items => List.unmodifiable(_items);
  int get count => _items.length;

  void add(String item) {
    _items.add(item);
    notifyListeners();
  }
}`,
    },
    {
      title: "اكتب: ValueListenableBuilder",
      lang: "dart",
      code: `final counter = ValueNotifier<int>(0);

Widget buildCounter() {
  return ValueListenableBuilder<int>(
    valueListenable: counter,
    builder: (context, value, child) {
      return TextButton(
        onPressed: () => counter.value++,
        child: Text('Taps: $value'),
      );
    },
  );
}`,
    },
    {
      title: "اكتب: provider في التطبيق",
      lang: "dart",
      code: `void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => CartModel(),
      child: const MaterialApp(home: CartPage()),
    ),
  );
}

class CartPage extends StatelessWidget {
  const CartPage({super.key});

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartModel>();
    return Text('Items: \${cart.count}');
  }
}`,
    },
  ],

  tasks: [
    {
      title: "اكتب InheritedWidget بتاعك",
      lang: "dart",
      prompt: "<p>اكتب <code>LocaleScope</code> وهو <code>InheritedWidget</code> بيمسك <code>String language</code>، مع <code>static LocaleScope of(BuildContext)</code> (بتسجل اعتماد وبتـ assert لو مفيش scope)، و<code>updateShouldNotify</code> صح. واكتب <code>LanguageLabel</code> (stateless) بيعرض <code>Language: &lt;القيمة&gt;</code> من الـ scope. وأخيرا <code>LanguageDemo</code> (stateful) فيها زرار بيبدل بين <code>en</code> و<code>ar</code> وتحته الـ label، بحيث الـ label تتحدث.</p>",
      hints: [
        "الـ InheritedWidget immutable، فالـ State بتاعة <code>LanguageDemo</code> هي اللي بتمسك القيمة وبتبني <code>LocaleScope(language: _lang, child: ...)</code> من جديد.",
        "<code>updateShouldNotify</code> ترجع <code>language != oldWidget.language</code>.",
      ],
      solution: `class LocaleScope extends InheritedWidget {
  const LocaleScope({
    super.key,
    required this.language,
    required super.child,
  });

  final String language;

  static LocaleScope of(BuildContext context) {
    final scope =
        context.dependOnInheritedWidgetOfExactType<LocaleScope>();
    assert(scope != null, 'No LocaleScope above this context');
    return scope!;
  }

  @override
  bool updateShouldNotify(LocaleScope oldWidget) {
    return language != oldWidget.language;
  }
}

class LanguageLabel extends StatelessWidget {
  const LanguageLabel({super.key});

  @override
  Widget build(BuildContext context) {
    return Text('Language: \${LocaleScope.of(context).language}');
  }
}

class LanguageDemo extends StatefulWidget {
  const LanguageDemo({super.key});

  @override
  State<LanguageDemo> createState() => _LanguageDemoState();
}

class _LanguageDemoState extends State<LanguageDemo> {
  String _lang = 'en';

  @override
  Widget build(BuildContext context) {
    return LocaleScope(
      language: _lang,
      child: Column(
        children: [
          TextButton(
            onPressed: () {
              setState(() => _lang = _lang == 'en' ? 'ar' : 'en');
            },
            child: const Text('Toggle'),
          ),
          const LanguageLabel(),
        ],
      ),
    );
  }
}`,
      explain: "لما الزرار يضغط، الـ State بتبني <code>LocaleScope</code> جديد بلغة مختلفة، <code>updateShouldNotify</code> ترجع true، فالـ <code>LanguageLabel</code> بس (اللي اعتمد عليه) بيتعمله rebuild. لاحظ إن الـ label <code>const</code> ومع ذلك اتحدثت، وده قوة الـ InheritedWidget.",
    },
    {
      title: "TodoModel و ListenableBuilder",
      lang: "dart",
      prompt: "<p>اكتب <code>TodoModel extends ChangeNotifier</code> فيه <code>add(String title)</code> (يتجاهل الفاضي)، <code>toggle(int index)</code>، <code>remaining</code> (عدد اللي لسه متعملش)، وقايمة <code>todos</code> للقراءة بس (كل عنصر فيه <code>title</code> و<code>done</code>). واكتب <code>TodoView</code> (stateful) بتمسك model واحد وتقفله، وبتعرض <code>Remaining: N</code> وتحتها قايمة <code>CheckboxListTile</code> وزرار «Add task» بيضيف <code>Task N</code>. استخدم <code>ListenableBuilder</code>.</p>",
      hints: [
        "عرّف كلاس صغير <code>Todo</code> بـ <code>title</code> و<code>bool done</code> (مش final) أو استخدم record. الـ model بينادي <code>notifyListeners()</code> في add و toggle.",
        "<code>ListenableBuilder(listenable: _model, builder: (context, child) {...})</code> يلف الـ Column كله.",
      ],
      solution: `class Todo {
  Todo(this.title);
  final String title;
  bool done = false;
}

class TodoModel extends ChangeNotifier {
  final List<Todo> _todos = [];

  List<Todo> get todos => List.unmodifiable(_todos);
  int get remaining => _todos.where((t) => !t.done).length;

  void add(String title) {
    if (title.trim().isEmpty) return;
    _todos.add(Todo(title.trim()));
    notifyListeners();
  }

  void toggle(int index) {
    _todos[index].done = !_todos[index].done;
    notifyListeners();
  }
}

class TodoView extends StatefulWidget {
  const TodoView({super.key});

  @override
  State<TodoView> createState() => _TodoViewState();
}

class _TodoViewState extends State<TodoView> {
  final TodoModel _model = TodoModel();

  @override
  void dispose() {
    _model.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _model,
      builder: (context, child) {
        return Column(
          children: [
            Text('Remaining: \${_model.remaining}'),
            for (var i = 0; i < _model.todos.length; i++)
              CheckboxListTile(
                title: Text(_model.todos[i].title),
                value: _model.todos[i].done,
                onChanged: (_) => _model.toggle(i),
              ),
            TextButton(
              onPressed: () {
                _model.add('Task \${_model.todos.length + 1}');
              },
              child: const Text('Add task'),
            ),
          ],
        );
      },
    );
  }
}`,
      explain: "المنطق كله في الـ model (يتختبر من غير widgets)، والـ State بتمسكه وتقفله، والواجهة بتسمع بـ ListenableBuilder. getter الـ <code>todos</code> بيرجع نسخة غير قابلة للتعديل فمحدش يعدل من برا من غير notify.",
    },
    {
      title: "ثيم بـ provider",
      lang: "dart",
      prompt: "<p>اكتب <code>ThemeModel extends ChangeNotifier</code> فيه <code>bool dark</code> (false مبدئيا) و<code>toggle()</code>. واكتب تطبيق: <code>ChangeNotifierProvider</code> فوق <code>MaterialApp</code> اللي <code>themeMode</code> بتاعه بيتحدد من الـ model (<code>watch</code> أو <code>Consumer</code>)، و<code>home</code> فيها <code>Switch</code> قيمته <code>dark</code> وبيغيرها بـ <code>read</code>. استخدم <code>Consumer</code> علشان يتبنى <code>MaterialApp</code> بس.</p>",
      hints: [
        "الـ <code>Consumer&lt;ThemeModel&gt;</code> يلف <code>MaterialApp</code>: <code>themeMode: model.dark ? ThemeMode.dark : ThemeMode.light</code> مع <code>theme</code> و<code>darkTheme</code>.",
        "الـ Switch: <code>onChanged: (_) =&gt; context.read&lt;ThemeModel&gt;().toggle()</code>. لاحظ إن الـ context لازم يكون تحت الـ provider (جوه home).",
      ],
      solution: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class ThemeModel extends ChangeNotifier {
  bool _dark = false;

  bool get dark => _dark;

  void toggle() {
    _dark = !_dark;
    notifyListeners();
  }
}

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => ThemeModel(),
      child: Consumer<ThemeModel>(
        builder: (context, theme, child) {
          return MaterialApp(
            theme: ThemeData.light(),
            darkTheme: ThemeData.dark(),
            themeMode: theme.dark ? ThemeMode.dark : ThemeMode.light,
            home: const SettingsPage(),
          );
        },
      ),
    ),
  );
}

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final dark = context.select<ThemeModel, bool>((t) => t.dark);
    return Scaffold(
      body: Switch(
        value: dark,
        onChanged: (_) => context.read<ThemeModel>().toggle(),
      ),
    );
  }
}`,
      explain: "الـ provider فوق MaterialApp عشان كل الشاشات الجاية تشوفه. الـ Consumer حوالين MaterialApp بيعيد بناءه عند تغير الثيم، والـ Switch بيستخدم <code>select</code> علشان يقرا <code>dark</code> بس، و<code>read</code> في الـ callback لتنفيذ الأمر.",
    },
  ],

  quiz: [
    {
      q: "التاب المختار في BottomNavigationBar داخل شاشة واحدة ومحدش تاني محتاجه. إيه نوعه؟",
      options: [
        "app state ومحتاج provider",
        "ephemeral state و<code>setState</code> كفاية",
        "لازم InheritedWidget",
        "لازم يتحط في ChangeNotifier عالمي",
      ],
      answer: 1,
      why: "state محلية لـ widget واحد ومفيش حد تاني محتاجها: ephemeral. إدارة الحالة المركزية هنا تعقيد من غير فايدة.",
    },
    {
      q: "إيه مشكلة prop drilling؟",
      options: [
        "بتبطئ التطبيق بشكل كبير",
        "بتمنع استخدام const",
        "widgets وسيطة كتير بتمرر بيانات مش محتاجاها، فالكود طويل وهش",
        "الـ InheritedWidget مبيشتغلش معاها",
      ],
      answer: 2,
      why: "المشكلة في صيانة الكود: كل طبقة لازم تعرف الداتا وتمررها. الـ InheritedWidget/Provider بيخلوا المستهلك ياخدها مباشرة.",
    },
    {
      q: "أنهي دالة بتخلي الـ widget يتعمله rebuild لما الـ InheritedWidget يتغير؟",
      options: [
        "<code>getInheritedWidgetOfExactType</code>",
        "<code>dependOnInheritedWidgetOfExactType</code>",
        "<code>findAncestorWidgetOfExactType</code>",
        "<code>visitChildElements</code>",
      ],
      answer: 1,
      why: "<code>dependOn...</code> بتسجل اعتماد. <code>get...</code> بتقرا من غير اشتراك.",
    },
    {
      q: "إيه وظيفة <code>updateShouldNotify</code>؟",
      options: [
        "تقرر هل المعتمدين على الـ InheritedWidget يتعملهم rebuild لما يتبني بقيمة جديدة",
        "تقفل الـ InheritedWidget",
        "تنادي <code>notifyListeners</code>",
        "تمنع الـ widget من الظهور",
      ],
      answer: 0,
      why: "بتتنادى لما InheritedWidget جديد بيحل محل القديم. ترجع true لو القيمة اتغيرت فعلا عشان المعتمدين يتبنوا، false عشان تتفادى rebuilds مش لازمة.",
    },
    {
      q: "الكود ده بيغير الـ state لكن الشاشة مبتتحدثش. إيه الناقص؟",
      code: { lang: "dart", src: `class CounterModel extends ChangeNotifier {
  int value = 0;

  void increment() {
    value++;
  }
}` },
      options: [
        "<code>notifyListeners()</code> بعد التغيير",
        "<code>value</code> لازم <code>late</code>",
        "الـ increment لازم <code>async</code>",
        "الكلاس لازم يورث <code>StatefulWidget</code>",
      ],
      answer: 0,
      why: "محدش بيتبلغ بالتغيير من غير <code>notifyListeners()</code>، زي نسيان setState.",
    },
    {
      q: "أنهي استخدام صح لـ provider؟",
      options: [
        "<code>build</code>: <code>context.read&lt;Cart&gt;().count</code> لعرض العدد",
        "<code>onPressed</code>: <code>context.watch&lt;Cart&gt;().clear()</code>",
        "<code>build</code>: <code>context.watch&lt;Cart&gt;().count</code>، و<code>onPressed</code>: <code>context.read&lt;Cart&gt;().clear()</code>",
        "<code>initState</code>: <code>context.watch&lt;Cart&gt;()</code>",
      ],
      answer: 2,
      why: "<code>watch</code> للعرض في build، <code>read</code> للأوامر في callbacks. الباقي إما مش بيتحدث أو بيرمي خطأ.",
    },
    {
      q: "عايز widget يتعمله rebuild بس لما <code>cart.count</code> يتغير (مش لأي تغيير تاني في الـ model). تستخدم:",
      options: [
        "<code>context.read</code>",
        "<code>context.select&lt;CartModel, int&gt;((c) =&gt; c.count)</code>",
        "<code>context.watch&lt;CartModel&gt;()</code> دايما",
        "<code>setState</code>",
      ],
      answer: 1,
      why: "<code>select</code> بتشترك في جزء من الـ model وبتعمل rebuild بس لو القيمة المختارة اتغيرت.",
    },
    {
      q: "ليه الـ <code>ChangeNotifierProvider</code> بتاع ثيم التطبيق لازم يكون فوق <code>MaterialApp</code>؟",
      options: [
        "عشان MaterialApp مبتقبلش غيره",
        "عشان الـ Navigator بيبني الصفحات الجديدة تحت MaterialApp، فمن غير كده الصفحات متشوفش الـ provider",
        "عشان Provider مبيشتغلش تحت Scaffold",
        "عشان الأداء",
      ],
      answer: 1,
      why: "الـ routes بتتبني تحت الـ Navigator اللي تحت MaterialApp. الـ provider اللي جوه صفحة واحدة مش هيبان لصفحة تانية.",
    },
    {
      q: "إيه الأنسب لـ state عبارة عن رقم واحد (عداد) في widget؟",
      options: [
        "<code>ValueNotifier&lt;int&gt;</code> مع <code>ValueListenableBuilder</code>",
        "<code>InheritedWidget</code> مخصص",
        "<code>GlobalKey</code>",
        "<code>Navigator</code>",
      ],
      answer: 0,
      why: "ValueNotifier أخف حل لقيمة واحدة. ChangeNotifier أنسب لـ model فيه أكتر من field وعمليات.",
    },
    {
      q: "اسم الـ widget اللي بيسمع لـ <code>ChangeNotifier</code> (أو أي Listenable) ويعيد بناء الجزء بتاعه، وهو جزء من الـ SDK من غير provider؟",
      answer: ["ListenableBuilder", "listenablebuilder"],
      why: "<code>ListenableBuilder(listenable: model, builder: ...)</code>. (والـ <code>AnimatedBuilder</code> بيعمل نفس الشغلانة تاريخيا لكنه مخصص للـ animations.)",
    },
  ],
};
