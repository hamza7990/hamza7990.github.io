window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f8"] = {
  slides: [
    {
      kicker: "ليه Riverpod بعد provider",
      title: "Riverpod: provider من غير حدود الـ BuildContext",
      en: "Why Riverpod after provider",
      body: "<p><code>provider</code> اللي شفته في المستوى اللي فات مبني على <code>InheritedWidget</code>، يعني الـ state ما بتتقراش إلا عن طريق <code>BuildContext</code> وجوه الشجرة. ده بيعمل مشاكل حقيقية في التطبيقات الكبيرة. <b>Riverpod</b> كتبه نفس مؤلف provider (Remi Rousselet) عشان يحلها كلها: الـ providers بقت <b>متغيرات global ثابتة</b> بتعرّفها برا الـ widgets، والـ state نفسها بتعيش في <code>ProviderContainer</code> مش في الشجرة.</p><p>الكورس ده مبني على <b>flutter_riverpod 3.5.0</b> (Riverpod 3.x) والـ API المكتوب بإيدك من غير code generation. فيه مولّد كود اسمه <code>riverpod_generator</code> بيكتب نفس الـ providers بـ annotations، بس إحنا هنتعلم الأصل الأول.</p>",
      points: [
        "<b>مفيش BuildContext للقراءة:</b> أي provider يقدر يقرا provider تاني من خلال <code>ref</code>، حتى من غير widget (في كلاس logic أو test).",
        "<b>الأمان وقت الـ compile:</b> provider بيرمي <code>ProviderNotFoundException</code> وقت التشغيل لو نسيت تحط الـ provider فوق الـ widget. في Riverpod المتغير موجود يعني متاح، فالغلط ده مبيحصلش.",
        "<b>مفيش تعارض أنواع:</b> provider بيدور بالنوع (<code>Provider&lt;String&gt;</code> مرتين بيتلخبطوا). Riverpod كل provider ليه اسم متغير.",
        "<b>async أول-class:</b> <code>AsyncValue</code> بتمثل loading/error/data بدل ما تكتب <code>isLoading</code> و<code>error</code> بإيدك كل مرة.",
        "<b>الاختبار سهل:</b> بتعمل override لأي provider بـ fake في test أو في <code>ProviderScope</code> من غير ما تعدل الكود.",
      ],
      interview: [
        { q: "ليه تختار Riverpod بدل provider؟", a: "provider بيعتمد على الـ <code>BuildContext</code> والشجرة، فلو نسيت تحط الـ provider فوق الـ widget بتاخد <code>ProviderNotFoundException</code> وقت التشغيل، ولو عندي provider بنفس النوع مرتين بيتلخبطوا. Riverpod بيعرّف الـ providers كمتغيرات global ثابتة، يعني الـ compiler بيتأكد إنها موجودة، وأي provider يقرا التاني بـ <code>ref</code> من غير context، فالـ logic بيتختبر من غير widgets. كمان فيه دعم أول-class للـ async بـ <code>AsyncValue</code> و<code>autoDispose</code> و<code>family</code>." },
      ],
    },
    {
      title: "ProviderScope و Provider و ConsumerWidget",
      en: "ProviderScope, Provider, ConsumerWidget",
      body: "<p>تلات خطوات للبداية: (1) غلّف التطبيق في <code>ProviderScope</code> (ده اللي بيعمل الـ <code>ProviderContainer</code> وبيخزن فيه كل الـ state). (2) عرّف provider كمتغير <code>final</code> على مستوى الملف. (3) في الـ UI ورّث <code>ConsumerWidget</code> بدل <code>StatelessWidget</code>؛ الـ <code>build</code> بتاخد <code>WidgetRef ref</code> إضافية.</p><p>الـ <code>Provider</code> العادي بيعرض قيمة <b>للقراءة فقط</b> بتتحسب مرة وتتخزن (config، repository، قيمة محسوبة من provider تاني).</p>",
      code: {
        lang: "dart",
        title: "main.dart",
        src: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final greetingProvider = Provider<String>((ref) => 'Hello');

void main() {
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(home: HomePage());
  }
}

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final text = ref.watch(greetingProvider);
    return Scaffold(body: Center(child: Text(text)));
  }
}`,
        note: "الـ <code>ProviderScope</code> فوق كل حاجة. <code>ref.watch</code> بتقرا القيمة وبتعمل rebuild للـ widget لو اتغيرت.",
      },
      pitfall: "نسيان <code>ProviderScope</code> فوق <code>runApp</code>: التطبيق بيقع بخطأ إن مفيش ProviderScope. وكمان لازم الـ import يبقى <code>flutter_riverpod</code> (مش <code>riverpod</code> لوحده) عشان <code>ConsumerWidget</code> تظهر.",
    },
    {
      title: "Notifier و NotifierProvider",
      en: "Notifier and NotifierProvider",
      body: "<p>لما الـ state تتغير (عداد، سلة، فلتر) محتاج كلاس فيه الـ state والدوال اللي تغيرها. ده <code>Notifier&lt;T&gt;</code>: بترثه، وتكتب <code>build()</code> بترجع القيمة المبدئية، وبتقرا/تكتب <code>state</code>. وبعدين بتعرّف <code>NotifierProvider</code> بيعمله instance. الـ UI بتقرا القيمة بـ <code>watch</code> وبتنفذ الأوامر بـ <code>ref.read(provider.notifier).method()</code>.</p><p>الـ state لازم تفضل <b>immutable</b>: كل مرة بتحط <code>state</code> بقيمة <b>جديدة</b>. لو عدلت list موجودة في مكانها (<code>state.add(x)</code>) Riverpod مش هيحس لأن المرجع هو هو.</p>",
      code: {
        lang: "dart",
        title: "counter_provider.dart",
        src: `import 'package:flutter_riverpod/flutter_riverpod.dart';

class Counter extends Notifier<int> {
  @override
  int build() => 0;

  void increment() => state++;
  void reset() => state = 0;
}

final counterProvider = NotifierProvider<Counter, int>(Counter.new);

class TodoList extends Notifier<List<String>> {
  @override
  List<String> build() => [];

  void add(String title) {
    state = [...state, title]; // new list, not state.add
  }

  void remove(String title) {
    state = state.where((t) => t != title).toList();
  }
}

final todoListProvider =
    NotifierProvider<TodoList, List<String>>(TodoList.new);`,
        note: "<code>Counter.new</code> هو tear-off للـ constructor. القراءة: <code>ref.watch(counterProvider)</code> (القيمة). الأوامر: <code>ref.read(counterProvider.notifier).increment()</code>.",
      },
      terms: [
        ["StateProvider", "provider لقيمة بسيطة", "كان اختصار لقيمة واحدة (bool، رقم، فلتر). في Riverpod 3 اتنقل لـ <code>package:flutter_riverpod/legacy.dart</code> وبيتنصح بالـ <code>Notifier</code> بدله، فاعتبره قديم."],
      ],
      interview: [
        { q: "إيه الفرق بين Provider و NotifierProvider؟", a: "<code>Provider</code> بيعرض قيمة للقراءة فقط بتتحسب مرة (config، repository، قيمة مشتقة). <code>NotifierProvider</code> بيعرض state قابلة للتغيير ومعاها كلاس <code>Notifier</code> فيه الدوال اللي بتعدلها بـ <code>state = ...</code>. الـ UI بتشترك في القيمة بـ <code>ref.watch(p)</code> وبتنفذ التغيير بـ <code>ref.read(p.notifier).method()</code>." },
      ],
    },
    {
      title: "watch و read و listen: إمتى كل واحدة",
      en: "ref.watch vs ref.read vs ref.listen",
      body: "<p>أهم سؤال في Riverpod. التلات بيقروا provider، بس بيفرقوا في <b>الاشتراك</b> و<b>المكان المسموح</b>.</p>",
      terms: [
        ["ref.watch", "اقرا واشترك", "بترجع القيمة وبتعمل rebuild (للـ widget أو للـ provider التاني) لما تتغير. المكان: جوه <code>build</code> بتاع الـ widget، أو جوه <code>build</code> بتاع provider/notifier."],
        ["ref.read", "اقرا مرة واحدة", "بترجع القيمة الحالية من غير اشتراك. المكان: الـ callbacks (<code>onPressed</code>)، <code>initState</code>، ودوال الـ notifier. <b>مش</b> في <code>build</code>."],
        ["ref.listen", "نفذ أثر جانبي", "بتنادي callback كل ما القيمة تتغير من غير ما تعيد بناء الـ widget. للـ SnackBar والـ navigation ورسائل الخطأ. المكان: جوه <code>build</code>."],
      ],
      codes: [
        {
          lang: "dart",
          title: "الاستخدام الصح للتلاتة",
          src: `class CounterPage extends ConsumerWidget {
  const CounterPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.listen<int>(counterProvider, (previous, next) {
      if (next == 10) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Reached 10')),
        );
      }
    });

    final count = ref.watch(counterProvider);
    return ElevatedButton(
      onPressed: () => ref.read(counterProvider.notifier).increment(),
      child: Text('Count: $count'),
    );
  }
}`,
        },
      ],
      pitfall: "<code>ref.read</code> جوه <code>build</code> بتخلي الـ widget ما يتحدثش (نفس غلطة <code>context.read</code> في provider). و<code>ref.watch</code> جوه <code>onPressed</code> غلط ومش مسموح. القاعدة: <b>build = watch و listen، callback = read</b>.",
      interview: [
        { q: "إيه الفرق بين ref.watch و ref.read و ref.listen؟ وإمتى كل واحدة؟", a: "<code>watch</code> بتقرا وبتشترك فالـ widget بيتعمله rebuild لما القيمة تتغير، وبتتستخدم جوه <code>build</code>. <code>read</code> بتقرا مرة من غير اشتراك، فبتتستخدم في الـ callbacks زي <code>onPressed</code> وفي دوال الـ notifier لتنفيذ أوامر. <code>listen</code> بتنادي callback عند كل تغيير من غير rebuild، فبتتستخدم للأثر الجانبي زي SnackBar أو navigation. القاعدة إني مقراش بـ <code>read</code> جوه build وما استخدمش <code>watch</code> في callback." },
      ],
    },
    {
      title: "FutureProvider و AsyncValue",
      en: "FutureProvider, AsyncValue, when",
      body: "<p>لو القيمة جاية من <code>Future</code> (طلب API مثلا) استخدم <code>FutureProvider</code>. Riverpod بيشغل الـ future ويديك النتيجة داخل <code>AsyncValue&lt;T&gt;</code> اللي ليها تلات حالات: <b>data</b> و<b>loading</b> و<b>error</b>. و<code>when</code> بتجبرك تتعامل مع الحالات التلاتة، فمفيش شاشة بيضا مجهولة.</p>",
      code: {
        lang: "dart",
        title: "todos_screen.dart",
        src: `final todosProvider = FutureProvider<List<String>>((ref) async {
  await Future<void>.delayed(const Duration(seconds: 1));
  return ['Buy milk', 'Call agent'];
});

class TodosScreen extends ConsumerWidget {
  const TodosScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final todos = ref.watch(todosProvider);
    return todos.when(
      data: (items) => ListView(
        children: [for (final t in items) ListTile(title: Text(t))],
      ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stack) => Center(child: Text('Error: $error')),
    );
  }
}`,
        note: "الـ future بيتنفذ <b>مرة واحدة</b> وقت أول <code>watch</code>، وبعدين النتيجة بتتخزن. مش بيتنفذ تاني مع كل rebuild (عكس الغلطة الشهيرة في FutureBuilder).",
      },
      points: [
        "<code>AsyncValue</code> sealed: <code>AsyncData</code> و<code>AsyncLoading</code> و<code>AsyncError</code>. تقدر تستخدم <code>switch</code> pattern matching عليها برضه.",
        "<code>when</code> بتحتاج الـ 3 callbacks. وفيه <code>maybeWhen</code> و<code>whenOrNull</code> لو عايز تهتم بحالة واحدة.",
        "لو حصل refresh، <code>when</code> بتعرض loading بشكل افتراضي رغم إن عندك داتا قديمة. ضيف <code>skipLoadingOnRefresh: true</code> لو عايز تفضل تعرض القديمة. وفي Riverpod 3 الـ provider اللي بيفشل بيتعاد تلقائي بعد تأخير (retry)، تقدر تعدّله أو تقفله.",
        "<code>asyncValue.value</code> بترجع الداتا لو موجودة وإلا null (كانت <code>valueOrNull</code> في الإصدار 2).",
      ],
    },
    {
      title: "AsyncNotifier: async + دوال تغيّر",
      en: "AsyncNotifier and AsyncNotifierProvider",
      body: "<p><code>FutureProvider</code> للقراءة بس. لو الـ state جاية من API <b>وكمان</b> عايز دوال تضيف وتحذف، استخدم <code>AsyncNotifier&lt;T&gt;</code>. الـ <code>build()</code> بترجع <code>Future&lt;T&gt;</code> (التحميل الأول)، والدوال بتعدل <code>state</code> اللي نوعها <code>AsyncValue&lt;T&gt;</code>. الأداة الأساسية <code>AsyncValue.guard</code> بتنفذ future وبتمسك الاستثناء وتحوله لـ <code>AsyncError</code> بدل <code>try/catch</code> يدوي.</p>",
      code: {
        lang: "dart",
        title: "todos_notifier.dart",
        src: `abstract class TodoRepository {
  Future<List<String>> fetch();
  Future<void> add(String title);
}

final todoRepositoryProvider = Provider<TodoRepository>((ref) {
  throw UnimplementedError('override in main');
});

class TodosNotifier extends AsyncNotifier<List<String>> {
  @override
  Future<List<String>> build() {
    return ref.watch(todoRepositoryProvider).fetch();
  }

  Future<void> add(String title) async {
    final repo = ref.read(todoRepositoryProvider);
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      await repo.add(title);
      return repo.fetch();
    });
  }
}

final todosNotifierProvider =
    AsyncNotifierProvider<TodosNotifier, List<String>>(
  TodosNotifier.new,
);`,
        note: "الـ repository جاي من provider تاني (dependency injection). في <code>build</code> بنستخدم <code>watch</code>، وفي الدوال بنستخدم <code>read</code>.",
      },
      pitfall: "كتابة <code>state = AsyncData(...)</code> بعد <code>await</code> من غير <code>guard</code> بيسيب الـ error من غير معالجة، فالتطبيق يقع بدل ما تظهر رسالة. استخدم <code>guard</code>. ومتحتفظش بـ <code>ref</code> من widget داخل future طويل بعد ما الـ widget اتقفل.",
      interview: [
        { q: "إمتى تستخدم FutureProvider وإمتى AsyncNotifier؟ وإيه AsyncValue.guard؟", a: "<code>FutureProvider</code> لما بس بقرا داتا async (تحميل، من غير تغيير). <code>AsyncNotifier</code> لما الـ state async وكمان عندي عمليات تغيّرها (add, delete, refresh) فأكتبها كدوال على الـ notifier. <code>AsyncValue.guard(() => ...)</code> بتنفذ الـ future وبترجع <code>AsyncData</code> لو نجح أو <code>AsyncError</code> لو رمى، فمحتاجش try/catch، والـ UI بتتعامل معاها بـ <code>when</code>." },
      ],
    },
    {
      title: "ConsumerStatefulWidget و Consumer و select",
      en: "ConsumerStatefulWidget, Consumer, select",
      body: "<p>لو محتاج <code>initState</code> أو controllers استخدم <code>ConsumerStatefulWidget</code> مع <code>ConsumerState</code>؛ الـ <code>ref</code> متاح كخاصية في الـ State كلها (جوه <code>initState</code> استخدم <code>read</code> مش <code>watch</code>). ولو عايز تضيّق نطاق الـ rebuild على جزء صغير من الشاشة من غير ما تعمل widget جديد، لف الجزء في <code>Consumer</code>.</p><p>وعشان تتجنب rebuild لما بس حقل واحد في كائن كبير يتغير، استخدم <code>select</code>: الـ widget بيتبني من جديد فقط لو القيمة اللي اخترتها اتغيرت.</p>",
      codes: [
        {
          lang: "dart",
          title: "ConsumerStatefulWidget",
          src: `class SearchPage extends ConsumerStatefulWidget {
  const SearchPage({super.key});

  @override
  ConsumerState<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends ConsumerState<SearchPage> {
  final _controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    _controller.text = ref.read(queryProvider);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _controller,
      onChanged: (v) => ref.read(queryProvider.notifier).set(v),
    );
  }
}`,
        },
        {
          lang: "dart",
          title: "Consumer و select",
          src: `Column(
  children: [
    const Text('Static header'),
    Consumer(
      builder: (context, ref, child) {
        final name = ref.watch(
          userProvider.select((user) => user.name),
        );
        return Text('Hi $name');
      },
    ),
  ],
)`,
        },
      ],
      interview: [
        { q: "إزاي تقلل الـ rebuilds في Riverpod؟", a: "بـ <code>select</code>: <code>ref.watch(userProvider.select((u) => u.name))</code> فالـ widget مبيتبنيش من جديد إلا لو الاسم تحديدا اتغير مش أي حقل تاني. وكمان بـ <code>Consumer</code> حوالين الجزء الصغير المتغير بدل ما أحط <code>watch</code> في widget كبير، وبتقسيم الـ widgets، وبـ <code>const</code> للأجزاء الثابتة." },
      ],
    },
    {
      title: "family و autoDispose و invalidate",
      en: "family, autoDispose, invalidate, refresh",
      body: "<p><b>family</b>: provider بيستقبل parameter، فكل قيمة (id مثلا) ليها state مستقلة. <b>autoDispose</b>: الـ provider بيتقفل وبيتمسح لما محدش بيسمعله (بتخرج من الشاشة)، فمتفضلش داتا قديمة في الذاكرة. الاتنين بيتجمعوا بـ <code>.autoDispose.family</code>. والـ providers اللي بتتعمل من النوع ده مفيش لها state دائمة، فكل مرة بتفتح الشاشة بتحمل من جديد.</p><p>لتحديث الداتا: <code>ref.invalidate(p)</code> بتخلي الـ provider يتمسح ويتحسب من جديد عند أول قراءة جاية (من غير ما ترجع قيمة)، و<code>ref.refresh(p)</code> بتعمل نفس الشيء وبترجع القيمة الجديدة فورا.</p>",
      code: {
        lang: "dart",
        title: "family + autoDispose",
        src: `class Property {
  const Property(this.id, this.title);
  final int id;
  final String title;
}

final propertyProvider =
    FutureProvider.autoDispose.family<Property, int>((ref, id) async {
  await Future<void>.delayed(const Duration(milliseconds: 300));
  return Property(id, 'Property $id');
});

class PropertyPage extends ConsumerWidget {
  const PropertyPage({super.key, required this.id});
  final int id;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final property = ref.watch(propertyProvider(id));
    return RefreshIndicator(
      onRefresh: () => ref.refresh(propertyProvider(id).future),
      child: ListView(
        children: [
          property.when(
            data: (p) => ListTile(title: Text(p.title)),
            loading: () => const LinearProgressIndicator(),
            error: (e, s) => Text('$e'),
          ),
        ],
      ),
    );
  }
}`,
        note: "<code>propertyProvider(1)</code> و<code>propertyProvider(2)</code> state منفصلين. الـ <code>.future</code> بتديك Future تستناه في <code>RefreshIndicator</code>.",
      },
      pitfall: "عمل <code>family</code> بـ parameter كائن عادي من غير <code>==</code> و<code>hashCode</code>: كل rebuild بيعمل instance جديد فالـ provider بيتبني من جديد لا نهائيا. استخدم أنواع بسيطة (int, String) أو record أو كلاس بـ equality.",
      interview: [
        { q: "إيه الفرق بين ref.invalidate و ref.refresh؟ وإيه autoDispose و family؟", a: "<code>invalidate</code> بتعلّم الـ provider إنه قديم وهو بيتحسب من جديد عند القراءة الجاية ومبترجعش قيمة. <code>refresh</code> بتعمل invalidate وبترجع القيمة الجديدة فورا (مفيدة في <code>RefreshIndicator</code> بـ <code>.future</code>). الـ <code>autoDispose</code> بيمسح state الـ provider لما مفيش حد بيسمعله، والـ <code>family</code> بيخلي الـ provider ياخد parameter فكل قيمة ليها state منفصلة، زي تفاصيل عقار برقم." },
      ],
    },
    {
      title: "الاختبار بالـ overrides",
      en: "Overriding providers in tests",
      body: "<p>أكبر ميزة لـ Riverpod في الاختبار: كل حاجة بتتقرا بـ provider، فتقدر تستبدل أي provider بنسخة وهمية من غير ما تلمس الكود. في اختبار Dart عادي بتعمل <code>ProviderContainer</code> بـ <code>overrides</code> (من غير widgets)، وفي اختبار widget بتحط <code>overrides</code> في <code>ProviderScope</code>.</p>",
      code: {
        lang: "dart",
        title: "todos_test.dart",
        src: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

class FakeRepo implements TodoRepository {
  final List<String> _items = ['A'];

  @override
  Future<List<String>> fetch() async => List.of(_items);

  @override
  Future<void> add(String title) async => _items.add(title);
}

void main() {
  test('add appends a todo', () async {
    final container = ProviderContainer.test(
      overrides: [
        todoRepositoryProvider.overrideWithValue(FakeRepo()),
      ],
    );

    await container.read(todosNotifierProvider.future);
    await container.read(todosNotifierProvider.notifier).add('B');

    expect(container.read(todosNotifierProvider).value, ['A', 'B']);
  });
}`,
        note: "<code>ProviderContainer.test</code> بيقفل الـ container تلقائي بعد الاختبار. في اختبار widget: <code>ProviderScope(overrides: [...], child: MyApp())</code>.",
      },
      points: [
        "<code>overrideWithValue</code> للـ <code>Provider</code> العادي. للـ Notifier: <code>provider.overrideWith(() =&gt; FakeNotifier())</code>.",
        "مفيش mocking library ضروري: كلاس fake صغير بيطبق الـ <code>abstract class</code> كفاية. ده سبب إن الـ repository لازم يبقى abstract.",
      ],
      interview: [
        { q: "إزاي بتختبر logic فيه API call في Riverpod؟", a: "بخلي الـ repository يتقرا من provider، وفي الاختبار بعمل <code>ProviderContainer</code> بـ <code>overrides</code> بتبدّل provider الـ repository بـ fake بيرجع بيانات ثابتة، وبقرا الـ notifier وأنادي دوالها وأتأكد من الـ state من غير أي widget أو شبكة. في اختبار الـ widget بحط نفس الـ overrides في <code>ProviderScope</code>." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: Notifier و provider",
      lang: "dart",
      code: `class Counter extends Notifier<int> {
  @override
  int build() => 0;

  void increment() => state++;
  void reset() => state = 0;
}

final counterProvider =
    NotifierProvider<Counter, int>(Counter.new);`,
    },
    {
      title: "اكتب: ConsumerWidget",
      lang: "dart",
      code: `class CounterPage extends ConsumerWidget {
  const CounterPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    return ElevatedButton(
      onPressed: () {
        ref.read(counterProvider.notifier).increment();
      },
      child: Text('Count: $count'),
    );
  }
}`,
    },
    {
      title: "اكتب: FutureProvider و when",
      lang: "dart",
      code: `final namesProvider = FutureProvider<List<String>>((ref) async {
  return ['Ali', 'Sara'];
});

Widget namesView(AsyncValue<List<String>> names) {
  return names.when(
    data: (items) => Text(items.join(', ')),
    loading: () => const CircularProgressIndicator(),
    error: (e, s) => Text('Error: $e'),
  );
}`,
    },
  ],

  tasks: [
    {
      title: "عداد بـ Notifier",
      lang: "dart",
      prompt: "<p>اكتب <code>Counter extends Notifier&lt;int&gt;</code> فيه <code>increment()</code> و<code>decrement()</code> (الأدنى 0، متنزلش تحته) و<code>reset()</code>. عرّف <code>counterProvider</code>. واكتب <code>CounterPage</code> كـ <code>ConsumerWidget</code> بتعرض <code>Count: N</code> وتلات أزرار. ولو العداد وصل 5 اعرض SnackBar فيه <code>Five!</code> باستخدام <code>ref.listen</code>.</p>",
      hints: [
        "<code>decrement</code>: <code>if (state &gt; 0) state--;</code>",
        "الـ <code>ref.listen</code> بتتحط جوه <code>build</code> قبل أو بعد الـ <code>watch</code>، والأزرار بتستخدم <code>ref.read(counterProvider.notifier)</code>.",
      ],
      solution: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class Counter extends Notifier<int> {
  @override
  int build() => 0;

  void increment() => state++;

  void decrement() {
    if (state > 0) state--;
  }

  void reset() => state = 0;
}

final counterProvider = NotifierProvider<Counter, int>(Counter.new);

class CounterPage extends ConsumerWidget {
  const CounterPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.listen<int>(counterProvider, (previous, next) {
      if (next == 5) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Five!')),
        );
      }
    });

    final count = ref.watch(counterProvider);
    final counter = ref.read(counterProvider.notifier);
    return Column(
      children: [
        Text('Count: $count'),
        TextButton(onPressed: counter.increment, child: const Text('+')),
        TextButton(onPressed: counter.decrement, child: const Text('-')),
        TextButton(onPressed: counter.reset, child: const Text('Reset')),
      ],
    );
  }
}`,
      explain: "المنطق (الحد الأدنى) في الـ Notifier مش في الـ UI. <code>listen</code> للأثر الجانبي (SnackBar) و<code>watch</code> للعرض. أخدنا <code>counter</code> بـ <code>read(...notifier)</code> مرة لأنه مجرد reference ثابت للـ notifier، مش قيمة بتتغير، فمفيش مشكلة منه في build (القراءة المحظورة هي قراءة <b>القيمة</b>).",
    },
    {
      title: "قايمة مهام من API وهمي",
      lang: "dart",
      prompt: "<p>اكتب <code>abstract class TodoRepository</code> فيه <code>Future&lt;List&lt;String&gt;&gt; fetch()</code> و<code>Future&lt;void&gt; add(String)</code>. و<code>todoRepositoryProvider</code> بيرجع implementation في الذاكرة (<code>InMemoryTodoRepository</code>). واكتب <code>TodosNotifier extends AsyncNotifier&lt;List&lt;String&gt;&gt;</code>: <code>build</code> بتحمل من الـ repo، و<code>add</code> بتستخدم <code>AsyncValue.guard</code> وتحمل القايمة تاني. وأخيرا <code>TodosView</code> (ConsumerWidget) بـ <code>when</code>: loading و error و data فيها قايمة وزرار «Add» بيضيف <code>Task</code>.</p>",
      hints: [
        "الـ repo في الذاكرة: <code>final List&lt;String&gt; _items = ['First'];</code> و<code>fetch</code> ترجع <code>List.of(_items)</code>.",
        "<code>add</code> في الـ notifier: <code>state = const AsyncLoading(); state = await AsyncValue.guard(() async { await repo.add(t); return repo.fetch(); });</code>",
      ],
      solution: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

abstract class TodoRepository {
  Future<List<String>> fetch();
  Future<void> add(String title);
}

class InMemoryTodoRepository implements TodoRepository {
  final List<String> _items = ['First'];

  @override
  Future<List<String>> fetch() async => List.of(_items);

  @override
  Future<void> add(String title) async => _items.add(title);
}

final todoRepositoryProvider = Provider<TodoRepository>((ref) {
  return InMemoryTodoRepository();
});

class TodosNotifier extends AsyncNotifier<List<String>> {
  @override
  Future<List<String>> build() {
    return ref.watch(todoRepositoryProvider).fetch();
  }

  Future<void> add(String title) async {
    final repo = ref.read(todoRepositoryProvider);
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      await repo.add(title);
      return repo.fetch();
    });
  }
}

final todosProvider =
    AsyncNotifierProvider<TodosNotifier, List<String>>(TodosNotifier.new);

class TodosView extends ConsumerWidget {
  const TodosView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final todos = ref.watch(todosProvider);
    return todos.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, s) => Center(child: Text('Error: $e')),
      data: (items) => Column(
        children: [
          for (final t in items) Text(t),
          TextButton(
            onPressed: () {
              ref.read(todosProvider.notifier).add('Task');
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }
}`,
      explain: "الـ repo abstract فنقدر نبدله في الاختبار. الـ Notifier بيمسك الـ state async، و<code>guard</code> بيحول أي استثناء لـ <code>AsyncError</code> والـ UI بتعرضه بـ <code>when</code>. لاحظ إن <code>watch</code> في <code>build</code> بتاع الـ notifier و<code>read</code> في الدالة.",
    },
    {
      title: "اختبار بـ override",
      lang: "dart",
      prompt: "<p>عندك <code>TodoRepository</code> و<code>todoRepositoryProvider</code> و<code>todosProvider</code> (من المهمة اللي فاتت). اكتب اختبار <code>test</code> باسم <code>add appends</code> يستخدم <code>FakeRepository</code> (بتبدأ بقايمة <code>['A']</code>) عن طريق <code>ProviderContainer.test</code> و<code>overrides</code>، ويستنى التحميل الأول، وينادي <code>add('B')</code>، ويتأكد إن القيمة <code>['A', 'B']</code>.</p>",
      hints: [
        "<code>todoRepositoryProvider.overrideWithValue(FakeRepository())</code> جوه <code>overrides</code>.",
        "استنى التحميل الأول بـ <code>await container.read(todosProvider.future)</code> وبعدين <code>container.read(todosProvider.notifier).add('B')</code>.",
      ],
      solution: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

class FakeRepository implements TodoRepository {
  final List<String> _items = ['A'];

  @override
  Future<List<String>> fetch() async => List.of(_items);

  @override
  Future<void> add(String title) async => _items.add(title);
}

void main() {
  test('add appends', () async {
    final container = ProviderContainer.test(
      overrides: [
        todoRepositoryProvider.overrideWithValue(FakeRepository()),
      ],
    );

    await container.read(todosProvider.future);
    await container.read(todosProvider.notifier).add('B');

    expect(container.read(todosProvider).value, ['A', 'B']);
  });
}`,
      explain: "مفيش widgets ولا شبكة: الـ override بيبدل الـ repository، والـ <code>ProviderContainer.test</code> بيقفل نفسه بعد الاختبار. ده الفرق العملي مع provider القديم اللي محتاج context.",
    },
  ],

  quiz: [
    {
      q: "إيه المشكلة الأساسية في <code>provider</code> اللي Riverpod بتحلها؟",
      options: [
        "provider أبطأ بكتير",
        "provider بيعتمد على BuildContext وعلى الشجرة، فالغلط (نسيان الـ provider) بيظهر وقت التشغيل",
        "provider مبيدعمش ChangeNotifier",
        "provider مبيشتغلش مع Material",
      ],
      answer: 1,
      why: "الاختلاف الجوهري إن Riverpod بيعرّف الـ providers كمتغيرات global ثابتة، فالمترجم يتأكد منها وتقدر تقراها بـ ref من غير context.",
    },
    {
      q: "أنهي سطر لازم يتحط فوق <code>runApp</code> عشان Riverpod تشتغل؟",
      options: [
        "<code>runApp(ProviderContainer(child: MyApp()))</code>",
        "<code>runApp(RiverpodApp(child: MyApp()))</code>",
        "<code>runApp(MultiProvider(child: MyApp()))</code>",
        "<code>runApp(ProviderScope(child: MyApp()))</code>",
      ],
      answer: 3,
      why: "<code>ProviderScope</code> بيعمل الـ container اللي بيخزن كل الـ state.",
    },
    {
      q: "الكود ده بيضيف عنصر بس الشاشة مبتتحدثش. إيه السبب؟",
      code: { lang: "dart", src: `class Items extends Notifier<List<String>> {
  @override
  List<String> build() => [];

  void add(String s) {
    state.add(s);
  }
}` },
      options: [
        "الـ Notifier لازم يكون async",
        "<code>state.add</code> بتعدل نفس الـ list من غير ما تعمل state جديدة، فـ Riverpod مبيحسش بتغيير",
        "ناقص <code>notifyListeners()</code>",
        "الـ build لازم ترجع const",
      ],
      answer: 1,
      why: "Riverpod بيقارن المرجع القديم بالجديد. لازم <code>state = [...state, s]</code>. ومفيش <code>notifyListeners</code> في Notifier (الإسناد هو اللي بينبه).",
    },
    {
      q: "إيه الأنسب لتنفيذ <code>onPressed</code> يزود العداد؟",
      options: [
        "<code>ref.watch(counterProvider.notifier).increment()</code>",
        "<code>ref.read(counterProvider.notifier).increment()</code>",
        "<code>ref.listen(counterProvider, ...)</code>",
        "<code>ref.read(counterProvider).increment()</code>",
      ],
      answer: 1,
      why: "الأوامر في الـ callbacks بـ <code>read(...notifier)</code>. <code>watch</code> هناك غلط، و<code>read(counterProvider)</code> بترجع الرقم مش الـ notifier.",
    },
    {
      q: "عايز تعرض SnackBar لما provider يتحول لحالة error من غير ما تعيد بناء الشاشة. تستخدم:",
      options: [
        "<code>ref.listen</code> جوه build",
        "<code>ref.watch</code> وتعرض SnackBar جوه build",
        "<code>ref.read</code> جوه build",
        "<code>ref.invalidate</code>",
      ],
      answer: 0,
      why: "الأثر الجانبي مكانه <code>ref.listen</code>. عرض SnackBar مباشرة جوه build مع watch بيتكرر مع كل rebuild.",
    },
    {
      q: "حالات <code>AsyncValue</code> اللي لازم <code>when</code> تتعامل معاها:",
      options: [
        "success و failure بس",
        "loading و data بس",
        "data و loading و error",
        "initial و loaded و empty و error",
      ],
      answer: 2,
      why: "<code>when</code> بتطلب data و loading و error. فيه <code>maybeWhen</code> لو عايز تتجاهل بعضهم.",
    },
    {
      q: "وظيفة <code>AsyncValue.guard</code>:",
      options: [
        "بتنفذ future وبترجع <code>AsyncData</code> لو نجح أو <code>AsyncError</code> لو رمى استثناء",
        "بتمنع الـ provider من إعادة التحميل",
        "بتعمل cache للنتيجة للأبد",
        "بتقفل الـ provider",
      ],
      answer: 0,
      why: "هي بديل try/catch بتحط النتيجة جوه AsyncValue جاهزة للـ UI.",
    },
    {
      q: "عندك <code>FutureProvider.autoDispose.family&lt;Property, int&gt;</code>. إيه بيحصل لما تخرج من صفحة العقار؟",
      options: [
        "الـ state بتفضل للأبد",
        "الـ provider بيتحذف من الكود",
        "بيتعمل refresh تلقائي كل ثانية",
        "الـ state بتاعة العقار ده بتتمسح لما محدش يسمعله، ولما تفتح تاني بيحمل من جديد",
      ],
      answer: 3,
      why: "<code>autoDispose</code> بيمسح الـ state عند آخر مستمع. و<code>family</code> بيخلي لكل id state مستقلة.",
    },
    {
      q: "ايه الفرق بين <code>ref.invalidate(p)</code> و <code>ref.refresh(p)</code>؟",
      options: [
        "invalidate تعيد حساب القيمة وترجعها، و refresh تمسحها بس",
        "refresh تعيد الحساب وترجع القيمة فورا، و invalidate تعلّم إنها قديمة وتتحسب عند القراءة الجاية",
        "هما نفس الشيء",
        "invalidate للـ Provider بس، و refresh للـ FutureProvider بس",
      ],
      answer: 1,
      why: "الاتنين بيعيدوا الحساب، لكن <code>refresh</code> بترجع القيمة الجديدة، و<code>invalidate</code> كسولة. الاختيار حسب لو محتاج القيمة أو ال Future فورا.",
    },
    {
      q: "عايز widget يتبني من جديد بس لما اسم المستخدم يتغير (مش باقي حقول <code>User</code>). تكتب:",
      code: { lang: "dart", src: `final name = ref.watch(
  userProvider.______((u) => u.name),
);` },
      answer: ["select", "select("],
      why: "<code>select</code> بتشترك في جزء من القيمة وبتتجاهل التغييرات الباقية.",
    },
  ],
};
