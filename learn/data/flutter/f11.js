window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f11"] = {
  slides: [
    {
      kicker: "الأساس",
      title: "FutureBuilder: ConnectionState و snapshot",
      en: "FutureBuilder, ConnectionState, snapshot",
      body: "<p><code>FutureBuilder</code> widget من الـ SDK (من غير حزم) بياخد <code>Future</code> ويبني الشاشة حسب حالته. الـ <code>builder</code> بياخد <code>AsyncSnapshot</code> فيها: <code>connectionState</code> (<code>waiting</code> لسه بيحمل، <code>done</code> خلص)، و<code>hasData</code> / <code>data</code>، و<code>hasError</code> / <code>error</code>. الترتيب الصحيح للفحص: <b>loading، error، data</b>.</p>",
      code: {
        lang: "dart",
        title: "names_screen.dart",
        src: `class NamesScreen extends StatefulWidget {
  const NamesScreen({super.key});

  @override
  State<NamesScreen> createState() => _NamesScreenState();
}

class _NamesScreenState extends State<NamesScreen> {
  late final Future<List<String>> _future;

  @override
  void initState() {
    super.initState();
    _future = fetchItems(); // created once
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<String>>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          final error = snapshot.error;
          return Center(child: Text('Error: $error'));
        }
        final items = snapshot.data ?? [];
        return ListView(
          children: [for (final n in items) ListTile(title: Text(n))],
        );
      },
    );
  }
}`,
        note: "الـ future اتعمل <b>مرة واحدة</b> في <code>initState</code> وخزناه في field. الـ builder يتنادى عدد مرات كتير لكن الـ future نفسه ثابت.",
      },
      terms: [
        ["ConnectionState", "حالة الاتصال", "<code>none</code> (مفيش future)، <code>waiting</code> (في الانتظار)، <code>active</code> (stream بيبعت)، <code>done</code> (خلص). في FutureBuilder بتشوف waiting ثم done."],
        ["hasData", "فيه داتا", "true لما <code>data</code> مش null. لو النوع nullable وخلص بـ null بتبقى false رغم إنه نجح."],
      ],
    },
    {
      title: "الغلطة الكلاسيكية: الـ Future في build",
      en: "The classic bug: creating the Future inside build",
      body: "<p>الـ <code>build</code> بتتنادى كتير: لما الأب يتبني، لما الكيبورد يطلع، لما تلف الشاشة. لو كتبت <code>future: fetchItems()</code> جوه الـ build، <b>كل rebuild بيبعت طلب API جديد</b>، والـ FutureBuilder بيرجع لـ loading ويومّض الشاشة، وممكن يعمل حلقة rebuild لو الـ future نفسه بيسبب setState.</p>",
      codes: [
        {
          lang: "dart",
          title: "غلط: طلب جديد مع كل build",
          src: `@override
Widget build(BuildContext context) {
  return FutureBuilder<List<String>>(
    future: fetchItems(), // runs on every rebuild
    builder: (context, snapshot) {
      return Text('\${snapshot.data?.length ?? 0}');
    },
  );
}`,
        },
        {
          lang: "dart",
          title: "صح: الـ future في الـ State",
          src: `late Future<List<String>> _future = fetchItems();

Future<void> _reload() async {
  setState(() {
    _future = fetchItems(); // explicit, user-driven
  });
}

@override
Widget build(BuildContext context) {
  return FutureBuilder<List<String>>(
    future: _future,
    builder: (context, snapshot) {
      final count = snapshot.data?.length ?? 0;
      return Text('$count');
    },
  );
}`,
          note: "للتحديث بنعمل future جديد جوه <code>setState</code> بإيدنا. أو استخدم state management (provider / Riverpod / bloc) اللي بتحتفظ بالنتيجة برا الـ widget.",
        },
      ],
      pitfall: "كتابة <code>setState(() =&gt; _future = fetchItems())</code> بسهم: الـ callback بيرجع الـ Future، وFlutter بيرمي خطأ «setState() callback argument returned a Future». استخدم block <code>{ ... }</code> زي المثال.",
      interview: [
        { q: "إيه الغلطة الكلاسيكية مع FutureBuilder؟", a: "إني أنشئ الـ Future جوه <code>build</code> مباشرة (<code>future: fetchData()</code>). الـ build بتتنادى مرات كتير فكل مرة بيتبعت طلب جديد والواجهة بترجع لـ loading. الحل إني أنشئ الـ future مرة واحدة في <code>initState</code> وأخزنه في field، وأعمل future جديد صراحة عند الـ retry أو الـ refresh جوه <code>setState</code>، أو أنقل الـ logic لـ state management بيحتفظ بالنتيجة." },
      ],
    },
    {
      title: "StreamBuilder",
      en: "StreamBuilder and ConnectionState.active",
      body: "<p><code>StreamBuilder</code> زي <code>FutureBuilder</code> لكن للـ <code>Stream</code> (قيم متتالية: شات، موقع مباشر، عداد، تحديثات Firebase). الحالات: <code>waiting</code> قبل أول قيمة، <code>active</code> وكل قيمة جديدة بتبني من جديد، <code>done</code> لما الـ stream يخلص. نفس القاعدة: ماتعملش الـ stream جوه build عشان كل rebuild بيشترك من الأول.</p>",
      code: {
        lang: "dart",
        title: "countdown.dart",
        src: `Stream<int> countdown(int from) async* {
  for (var i = from; i >= 0; i--) {
    await Future<void>.delayed(const Duration(seconds: 1));
    yield i;
  }
}

class CountdownText extends StatefulWidget {
  const CountdownText({super.key});

  @override
  State<CountdownText> createState() => _CountdownTextState();
}

class _CountdownTextState extends State<CountdownText> {
  final Stream<int> _stream = countdown(5);

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<int>(
      stream: _stream,
      builder: (context, snapshot) {
        if (snapshot.hasError) return Text('Error: \${snapshot.error}');
        return switch (snapshot.connectionState) {
          ConnectionState.none => const Text('No stream'),
          ConnectionState.waiting => const Text('Starting...'),
          ConnectionState.active => Text('\${snapshot.data}'),
          ConnectionState.done => const Text('Done'),
        };
      },
    );
  }
}`,
        note: "الـ <code>switch</code> expression على الـ enum بيضمن تغطية كل الحالات. الـ <code>StreamBuilder</code> بيلغي الاشتراك لوحده لما يتشال.",
      },
    },
    {
      title: "عادة الحالات الأربع + retry + pull to refresh",
      en: "Loading, error, empty, data + retry + RefreshIndicator",
      body: "<p>أي شاشة بتحمل داتا بتعدي على <b>4 حالات</b> لازم تتعامل مع كل واحدة: <b>loading</b> (spinner)، <b>error</b> (رسالة + زرار «حاول تاني»)، <b>empty</b> (رسالة «مفيش نتائج»، مش شاشة بيضا)، <b>data</b>. المستخدم اللي يشوف شاشة بيضا بيفتكر التطبيق باظ. و<code>RefreshIndicator</code> بيدّي سحب للتحديث: الـ <code>onRefresh</code> لازم ترجع <code>Future</code> وهو بيفضل ظاهر لحد ما يخلص.</p>",
      code: {
        lang: "dart",
        title: "four_states.dart",
        src: `class ListScreen extends StatefulWidget {
  const ListScreen({super.key});

  @override
  State<ListScreen> createState() => _ListScreenState();
}

class _ListScreenState extends State<ListScreen> {
  late Future<List<String>> _future = fetchItems();

  Future<void> _reload() async {
    final next = fetchItems();
    setState(() {
      _future = next;
    });
    await next.catchError((Object _) => <String>[]);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<String>>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Could not load'),
                TextButton(onPressed: _reload, child: const Text('Retry')),
              ],
            ),
          );
        }
        final items = snapshot.data ?? [];
        if (items.isEmpty) {
          return const Center(child: Text('Nothing here yet'));
        }
        return RefreshIndicator(
          onRefresh: _reload,
          child: ListView.builder(
            itemCount: items.length,
            itemBuilder: (context, i) => ListTile(title: Text(items[i])),
          ),
        );
      },
    );
  }
}`,
        note: "الـ retry و pull-to-refresh بيعملوا future جديد. الـ <code>ListView</code> جوه <code>RefreshIndicator</code> لازم يكون قابل للسحب (لو فيه عناصر قليلة اضبط <code>physics: AlwaysScrollableScrollPhysics()</code>).",
      },
      interview: [
        { q: "إيه الحالات اللي أي شاشة بتحمل داتا من API لازم تتعامل معاها؟", a: "أربعة: <b>loading</b> (مؤشر تحميل)، <b>error</b> (رسالة مفهومة وزرار retry)، <b>empty</b> (رسالة إن مفيش نتائج مش شاشة فاضية)، و<b>data</b>. وكمان pull-to-refresh لو مناسب. في الكود بفحصهم بالترتيب: loading، error، empty، data، وبتجنب شاشة بيضا غامضة." },
      ],
    },
    {
      title: "Pagination: infinite scroll",
      en: "Infinite scroll with ScrollController",
      body: "<p>مش هتحمل 10,000 عنصر مرة واحدة. بتحمل صفحة صفحة وبتحمل التالية لما المستخدم يقرب من آخر القايمة. محتاج 3 متغيرات حماية: <code>_page</code> (الصفحة الجاية)، <code>_hasMore</code> (لسه فيه صفحات)، <code>_isLoading</code> (طلب شغال دلوقتي). من غيرها الـ scroll listener بينادي كذا طلب في نفس اللحظة والصفحة بتتكرر.</p>",
      code: {
        lang: "dart",
        title: "paged_list.dart",
        src: `class PagedList extends StatefulWidget {
  const PagedList({super.key});

  @override
  State<PagedList> createState() => _PagedListState();
}

class _PagedListState extends State<PagedList> {
  final ScrollController _controller = ScrollController();
  final List<String> _items = [];
  int _page = 1;
  bool _hasMore = true;
  bool _isLoading = false;
  Object? _error;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_onScroll);
    _loadMore();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onScroll() {
    final position = _controller.position;
    if (position.pixels >= position.maxScrollExtent - 200) {
      _loadMore();
    }
  }

  Future<void> _loadMore() async {
    if (_isLoading || !_hasMore) return;
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final next = await fetchPage(_page);
      if (!mounted) return;
      setState(() {
        _items.addAll(next);
        _page++;
        _hasMore = next.length == pageSize;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: _controller,
      itemCount: _items.length + (_hasMore ? 1 : 0),
      itemBuilder: (context, i) {
        if (i < _items.length) return ListTile(title: Text(_items[i]));
        if (_error != null) {
          return TextButton(onPressed: _loadMore, child: const Text('Retry'));
        }
        return const Center(child: CircularProgressIndicator());
      },
    );
  }
}`,
        note: "آخر عنصر في القايمة (الإضافي) بيعرض spinner أو زرار retry. الـ <code>_hasMore</code> بتبقى false لما الصفحة ترجع أقل من <code>pageSize</code>. الـ <code>dispose</code> للـ controller ضروري.",
      },
      pitfall: "نسيان <code>_isLoading</code>: الـ scroll بيطلع events كتير جوه نفس الـ 200 بكسل فتبعت نفس الصفحة 5 مرات والعناصر تتكرر. ونسيان <code>dispose</code> للـ <code>ScrollController</code> بيسرب ذاكرة. وفي Laravel خد <code>hasMore</code> من <code>meta.last_page</code> أو <code>links.next</code>.",
      interview: [
        { q: "إزاي بتعمل infinite scroll pagination؟", a: "بحط <code>ScrollController</code> على الـ ListView وبضيف listener يقارن <code>position.pixels</code> بـ <code>maxScrollExtent</code> ناقص هامش (مثلا 200). لما يقرب بنادي <code>_loadMore</code> اللي فيها حراسة: لو <code>_isLoading</code> أو <code>!_hasMore</code> ترجع، وإلا تعمل isLoading=true وتحمل الصفحة الجاية وتضيفها وتزود <code>_page</code> وتحدد <code>_hasMore</code> (لو رجع أقل من pageSize أو السيرفر قال مفيش). وبعرض spinner أو retry في آخر القايمة وبعمل dispose للـ controller." },
      ],
    },
    {
      title: "Debounce للبحث",
      en: "Debouncing a search field",
      body: "<p>لو كل حرف بيكتبه المستخدم بيبعت طلب بحث، يبقى 10 طلبات لكلمة واحدة، وممكن الرد القديم يوصل بعد الجديد ويعرض نتيجة غلط. الـ <b>debounce</b>: بتستنى المستخدم يوقف كتابة لفترة قصيرة (300-500ms) وبعدين تبعت طلب واحد. بتتنفذ بـ <code>Timer</code> من <code>dart:async</code>: كل حرف جديد بيلغي الـ timer القديم ويبدأ واحد جديد.</p>",
      code: {
        lang: "dart",
        title: "search_box.dart",
        src: `class SearchBox extends StatefulWidget {
  const SearchBox({super.key});

  @override
  State<SearchBox> createState() => _SearchBoxState();
}

class _SearchBoxState extends State<SearchBox> {
  Timer? _debounce;
  String _latest = '';
  List<String> _results = [];

  @override
  void dispose() {
    _debounce?.cancel();
    super.dispose();
  }

  void _onChanged(String text) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), () {
      _search(text.trim());
    });
  }

  Future<void> _search(String query) async {
    _latest = query;
    final found = await api.search(query);
    if (!mounted || query != _latest) return; // stale reply
    setState(() => _results = found);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(onChanged: _onChanged),
        for (final r in _results) Text(r),
      ],
    );
  }
}`,
        note: "تلات حماية: إلغاء الـ timer في <code>dispose</code>، <code>mounted</code> بعد الـ await، و<code>query != _latest</code> عشان نتجاهل رد قديم وصل متأخر.",
      },
      interview: [
        { q: "إيه هو الـ debounce؟ وإزاي بتعمله في حقل بحث؟", a: "هو إني أأجل تنفيذ الدالة لحد ما يعدي وقت محدد (مثلا 400ms) من غير ما تتنادى تاني. في حقل البحث بستخدم <code>Timer</code>: في <code>onChanged</code> ألغي الـ timer القديم (<code>_debounce?.cancel()</code>) وأبدأ واحد جديد بيبعت الطلب. بلغيه كمان في <code>dispose</code>، وبتجاهل الردود القديمة اللي توصل متأخرة (أقارن الـ query بآخر query) أو أستخدم CancelToken في dio." },
      ],
    },
    {
      title: "Optimistic update و rollback",
      en: "Optimistic updates and rollback",
      body: "<p>لما المستخدم يعمل Like، مش منطقي يستنى ثانية الـ API عشان القلب يتلون. الـ <b>optimistic update</b>: غيّر الواجهة فورا (متفائل إن الطلب هينجح)، وابعت الطلب، ولو فشل <b>ارجع للقيمة القديمة</b> (rollback) وقل للمستخدم. الخطوات: احفظ القديم، غيّر، ابعت، لو فشل رجّع.</p>",
      code: {
        lang: "dart",
        title: "like_button.dart",
        src: `class LikeButton extends StatefulWidget {
  const LikeButton({super.key, required this.id});

  final int id;

  @override
  State<LikeButton> createState() => _LikeButtonState();
}

class _LikeButtonState extends State<LikeButton> {
  bool _liked = false;

  Future<void> _toggle() async {
    final previous = _liked;
    setState(() => _liked = !previous); // optimistic
    try {
      await api.setLiked(widget.id, !previous);
    } catch (_) {
      if (!mounted) return;
      setState(() => _liked = previous); // rollback
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not update, try again')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
      onPressed: _toggle,
      icon: Icon(_liked ? Icons.favorite : Icons.favorite_border),
    );
  }
}`,
        note: "ملحوظة: لو المستخدم ضغط بسرعة كذا مرة، ممكن تحتاج تمنع الضغط أثناء الطلب أو تدمج الضغطات.",
      },
      pitfall: "نسيان الـ rollback: الواجهة تبين «Like» لكن السيرفر مسجلش، والمستخدم يفتكر إن الحاجة اتحفظت. الـ optimistic مناسب للعمليات الخفيفة (like، favorite، تعليم مقروء). مش مناسب للدفع.",
      interview: [
        { q: "إيه هو الـ optimistic update ومتى تتجنبه؟", a: "إني أحدّث الواجهة فورا كأن الطلب نجح، وأبعت الطلب في الخلفية، ولو فشل أرجع للحالة القديمة (rollback) وأوضح للمستخدم. بيخلي التطبيق يحس سريع. بستخدمه للعمليات الخفيفة والمتوقع نجاحها زي favorite و like. بتجنبه في العمليات الحساسة زي الدفع والتحويل، حيث لازم أنتظر تأكيد السيرفر." },
      ],
    },
    {
      title: "SnackBar بعد await: context.mounted",
      en: "Using context safely after an await",
      body: "<p>بعد أي <code>await</code> ممكن الشاشة تكون اتقفلت (المستخدم رجع). استخدام <code>BuildContext</code> بعدها (<code>ScaffoldMessenger.of(context)</code>، <code>Navigator.of(context)</code>) ممكن يرمي أخطاء أو يتعامل مع widget ميت. الـ lint بتاع Flutter اسمه <code>use_build_context_synchronously</code> بيحذرك. القاعدة: <b>اتأكد إن الـ widget لسه موجود قبل ما تستخدم context بعد await</b>.</p>",
      codes: [
        {
          lang: "dart",
          title: "داخل State: mounted",
          src: `Future<void> _save() async {
  await api.setLiked(1, true);
  if (!mounted) return;
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(content: Text('Saved')),
  );
}`,
        },
        {
          lang: "dart",
          title: "في callback أو StatelessWidget: context.mounted",
          src: `Widget saveButton(BuildContext context) {
  return TextButton(
    onPressed: () async {
      await api.setLiked(1, true);
      if (!context.mounted) return;
      Navigator.of(context).pop();
    },
    child: const Text('Save'),
  );
}`,
        },
      ],
      points: [
        "<code>mounted</code> خاصية على الـ <code>State</code>. <code>context.mounted</code> متاحة على أي <code>BuildContext</code> (Flutter 3.7+).",
        "الحل البديل: خد الـ <code>ScaffoldMessenger</code> أو <code>Navigator</code> <b>قبل</b> الـ await وخزنه في متغير محلي.",
        "نفس القاعدة مع <code>setState</code> بعد await: اتأكد من <code>mounted</code> وإلا خطأ «setState called after dispose».",
      ],
      interview: [
        { q: "ليه لازم تفحص mounted / context.mounted بعد await؟", a: "لأن الـ widget ممكن يتشال من الشجرة أثناء ما الـ await شغال (المستخدم خرج من الشاشة). استخدام <code>context</code> بعد كده أو <code>setState</code> بيرمي خطأ أو بيتعامل مع element ميت. فبكتب <code>if (!mounted) return;</code> داخل State أو <code>if (!context.mounted) return;</code> في أي مكان تاني قبل ما أعرض SnackBar أو أعمل navigation أو setState." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: FutureBuilder",
      lang: "dart",
      code: `FutureBuilder<List<String>>(
  future: _future,
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const CircularProgressIndicator();
    }
    if (snapshot.hasError) {
      return Text('Error: \${snapshot.error}');
    }
    final items = snapshot.data ?? [];
    return Text('Items: \${items.length}');
  },
)`,
    },
    {
      title: "اكتب: debounce",
      lang: "dart",
      code: `Timer? _debounce;

void _onChanged(String text) {
  _debounce?.cancel();
  _debounce = Timer(const Duration(milliseconds: 400), () {
    _search(text.trim());
  });
}

@override
void dispose() {
  _debounce?.cancel();
  super.dispose();
}`,
    },
    {
      title: "اكتب: حراسة تحميل المزيد",
      lang: "dart",
      code: `Future<void> _loadMore() async {
  if (_isLoading || !_hasMore) return;
  setState(() => _isLoading = true);
  final next = await fetchPage(_page);
  if (!mounted) return;
  setState(() {
    _items.addAll(next);
    _page++;
    _hasMore = next.length == pageSize;
    _isLoading = false;
  });
}`,
    },
  ],

  tasks: [
    {
      title: "شاشة بالحالات الأربع",
      lang: "dart",
      prompt: "<p>اكتب <code>NamesScreen</code> (StatefulWidget) بياخد <code>final Future&lt;List&lt;String&gt;&gt; Function() load</code>. بيحفظ الـ future في field (<code>late Future</code>) مرة واحدة في <code>initState</code> (مش في build). الـ <code>FutureBuilder</code> يعرض: spinner لو لسه بيحمل، <code>Text('Error')</code> وزرار <code>Retry</code> بيعمل future جديد لو حصل خطأ، <code>Text('Empty')</code> لو القايمة فاضية، وإلا <code>ListView</code> من <code>ListTile</code>.</p>",
      hints: [
        "الـ future: <code>late Future&lt;List&lt;String&gt;&gt; _future;</code> وفي <code>initState</code> <code>_future = widget.load();</code>.",
        "الـ retry: <code>setState(() { _future = widget.load(); });</code> بـ block.",
      ],
      solution: `import 'package:flutter/material.dart';

class NamesScreen extends StatefulWidget {
  const NamesScreen({super.key, required this.load});

  final Future<List<String>> Function() load;

  @override
  State<NamesScreen> createState() => _NamesScreenState();
}

class _NamesScreenState extends State<NamesScreen> {
  late Future<List<String>> _future;

  @override
  void initState() {
    super.initState();
    _future = widget.load();
  }

  void _retry() {
    setState(() {
      _future = widget.load();
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<String>>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Column(
            children: [
              const Text('Error'),
              TextButton(onPressed: _retry, child: const Text('Retry')),
            ],
          );
        }
        final names = snapshot.data ?? [];
        if (names.isEmpty) return const Text('Empty');
        return ListView(
          children: [for (final n in names) ListTile(title: Text(n))],
        );
      },
    );
  }
}`,
      explain: "الـ future بيتعمل مرة في initState وبيتعمل واحد جديد بس عند الـ retry جوه setState. ترتيب الفحص: loading، error، empty، data. تمرير <code>load</code> كـ function بيخلي الشاشة سهلة الاختبار.",
    },
    {
      title: "حقل بحث بـ debounce",
      lang: "dart",
      prompt: "<p>اكتب <code>DebouncedField</code> (StatefulWidget) بياخد <code>final void Function(String) onSearch</code> و<code>final Duration delay</code> (الافتراضي 400ms). فيه <code>TextField</code> وكل تغيير بيأجل <code>onSearch(text.trim())</code> لحد ما يعدي <code>delay</code> من غير تغيير تاني، مع إلغاء الـ timer القديم وعند الـ <code>dispose</code>. ولا تنادي <code>onSearch</code> لو النص فاضي.</p>",
      hints: [
        "<code>Timer? _timer;</code> وفي <code>onChanged</code> نادي <code>_timer?.cancel()</code> وبعدين <code>_timer = Timer(widget.delay, () {...})</code>.",
        "لا تنسى <code>import 'dart:async';</code>.",
      ],
      solution: `import 'dart:async';

import 'package:flutter/material.dart';

class DebouncedField extends StatefulWidget {
  const DebouncedField({
    super.key,
    required this.onSearch,
    this.delay = const Duration(milliseconds: 400),
  });

  final void Function(String) onSearch;
  final Duration delay;

  @override
  State<DebouncedField> createState() => _DebouncedFieldState();
}

class _DebouncedFieldState extends State<DebouncedField> {
  Timer? _timer;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _onChanged(String text) {
    _timer?.cancel();
    _timer = Timer(widget.delay, () {
      final query = text.trim();
      if (query.isNotEmpty) widget.onSearch(query);
    });
  }

  @override
  Widget build(BuildContext context) {
    return TextField(onChanged: _onChanged);
  }
}`,
      explain: "كل ضغطة بتلغي الـ timer القديم فالـ <code>onSearch</code> بتتنادى مرة بعد ما المستخدم يوقف. إلغاء الـ timer في <code>dispose</code> مهم عشان الـ callback ما يتنادش بعد ما الـ widget يموت.",
    },
    {
      title: "قايمة infinite scroll",
      lang: "dart",
      prompt: "<p>اكتب <code>InfiniteList</code> (StatefulWidget) بياخد <code>final Future&lt;List&lt;String&gt;&gt; Function(int page) fetchPage</code> و<code>final int pageSize</code>. يحمل الصفحة الأولى في <code>initState</code>، ولما المستخدم يقرب من آخر القايمة (200 بكسل) يحمل التالية. لازم الحماية: <code>_isLoading</code> و<code>_hasMore</code> (false لما الصفحة ترجع أقل من pageSize). اعرض آخر عنصر كـ spinner طالما <code>_hasMore</code>. اعمل dispose للـ controller واتأكد من <code>mounted</code> بعد await. تتجاهل الأخطاء بتحط <code>_hasMore = false</code> بس.</p>",
      hints: [
        "الـ <code>itemCount</code> = <code>_items.length + (_hasMore ? 1 : 0)</code>.",
        "الـ listener: <code>if (_controller.position.pixels &gt;= _controller.position.maxScrollExtent - 200) _loadMore();</code>",
      ],
      solution: `import 'package:flutter/material.dart';

class InfiniteList extends StatefulWidget {
  const InfiniteList({
    super.key,
    required this.fetchPage,
    required this.pageSize,
  });

  final Future<List<String>> Function(int page) fetchPage;
  final int pageSize;

  @override
  State<InfiniteList> createState() => _InfiniteListState();
}

class _InfiniteListState extends State<InfiniteList> {
  final ScrollController _controller = ScrollController();
  final List<String> _items = [];
  int _page = 1;
  bool _hasMore = true;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_onScroll);
    _loadMore();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onScroll() {
    final position = _controller.position;
    if (position.pixels >= position.maxScrollExtent - 200) {
      _loadMore();
    }
  }

  Future<void> _loadMore() async {
    if (_isLoading || !_hasMore) return;
    setState(() => _isLoading = true);
    try {
      final next = await widget.fetchPage(_page);
      if (!mounted) return;
      setState(() {
        _items.addAll(next);
        _page++;
        _hasMore = next.length == widget.pageSize;
        _isLoading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _hasMore = false;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: _controller,
      itemCount: _items.length + (_hasMore ? 1 : 0),
      itemBuilder: (context, i) {
        if (i < _items.length) return ListTile(title: Text(_items[i]));
        return const Center(child: CircularProgressIndicator());
      },
    );
  }
}`,
      explain: "الحراسة (<code>_isLoading</code> / <code>_hasMore</code>) هي اللب: من غيرها الـ listener يطلق طلبات كتير. في التطبيق الحقيقي بتعرض زرار retry عند الخطأ بدل ما توقف التحميل نهائي (زي الموجود في الشرح).",
    },
  ],

  quiz: [
    {
      q: "إيه المشكلة هنا؟",
      code: { lang: "dart", src: `@override
Widget build(BuildContext context) {
  return FutureBuilder<List<String>>(
    future: fetchItems(),
    builder: (context, snapshot) => const SizedBox(),
  );
}` },
      options: [
        "الـ builder لازم يكون async",
        "الـ FutureBuilder محتاج key",
        "كل rebuild بيبعت طلب جديد لأن الـ future اتعمل في build",
        "fetchItems لازم تبقى static",
      ],
      answer: 2,
      why: "الـ future يتعمل مرة في initState (أو من state management) ويتخزن في field.",
    },
    {
      q: "الـ <code>ConnectionState</code> اللي بتشوفه في <code>StreamBuilder</code> وبيعني إن الـ stream بيبعت قيم دلوقتي؟",
      options: [
        "<code>waiting</code>",
        "<code>none</code>",
        "<code>done</code>",
        "<code>active</code>",
      ],
      answer: 3,
      why: "waiting قبل أول قيمة، active وقت بعت القيم، done لما يخلص.",
    },
    {
      q: "أنسب ترتيب لفحص الـ snapshot في الـ builder؟",
      options: [
        "loading ثم error ثم data (مع فحص empty)",
        "data ثم loading ثم error",
        "error ثم data ثم loading فقط",
        "مفيش ترتيب",
      ],
      answer: 0,
      why: "لو فحصت data الأول وهو null هتحصل أخطاء. loading ثم error ثم empty ثم data هو الترتيب الآمن.",
    },
    {
      q: "ليه الكود ده بيرمي خطأ وقت التشغيل؟",
      code: { lang: "dart", src: `setState(() => _future = fetchItems());` },
      options: [
        "setState مبتقبلش arrow functions",
        "الـ callback بيرجع Future، و setState لازم يكون callback متزامن (من غير قيمة)",
        "لازم await",
        "مفيش خطأ",
      ],
      answer: 1,
      why: "التعبير <code>_future = fetchItems()</code> قيمته الـ Future، فالـ callback بيرجعه. استخدم block: <code>setState(() { _future = fetchItems(); })</code>.",
    },
    {
      q: "إيه الفايدة من <code>_isLoading</code> في الـ infinite scroll؟",
      options: [
        "بتمنع طلبات متكررة لنفس الصفحة وقت ما scroll events بتتنادى كتير",
        "بتخلي القايمة أسرع",
        "بتمسح العناصر القديمة",
        "بتحدد حجم الصفحة",
      ],
      answer: 0,
      why: "listener الـ scroll بيتنادى عشرات المرات. من غير الحراسة هتتبعت نفس الصفحة كذا مرة والعناصر تتكرر.",
    },
    {
      q: "الـ debounce للبحث معناه:",
      options: [
        "ابعت طلب مع كل حرف",
        "ابعت طلب كل ثانية ثابتة",
        "أجّل الطلب لحد ما المستخدم يوقف كتابة لفترة قصيرة، وكل حرف جديد يلغي الانتظار القديم",
        "امنع البحث بعد 3 حروف",
      ],
      answer: 2,
      why: "بنستخدم Timer: كل تغيير بيلغي القديم ويبدأ جديد، فبيتبعت طلب واحد بعد التوقف.",
    },
    {
      q: "في الـ optimistic update، لو الطلب فشل لازم:",
      options: [
        "تتجاهل الخطأ",
        "تمسح العنصر",
        "تعيد تشغيل التطبيق",
        "ترجع الواجهة للقيمة القديمة وتبلغ المستخدم",
      ],
      answer: 3,
      why: "الـ rollback جزء أساسي من الفكرة. من غيره الواجهة تكذب على المستخدم.",
    },
    {
      q: "تعرض SnackBar بعد <code>await</code> جوه callback في StatelessWidget. أنهي سطر تضيفه قبله؟",
      options: [
        "<code>if (!context.mounted) return;</code>",
        "<code>if (context.mounted) await;</code>",
        "<code>setState(() {});</code>",
        "مفيش حاجة مطلوبة",
      ],
      answer: 0,
      why: "الـ widget ممكن يكون اتقفل أثناء الـ await. <code>context.mounted</code> (Flutter 3.7+) بتتأكد قبل استخدام الـ context.",
    },
    {
      q: "ليه <code>StreamBuilder(stream: createStream(), ...)</code> جوه build غلط؟",
      options: [
        "StreamBuilder مبيقبلش stream كـ method",
        "الـ Stream لازم يكون broadcast",
        "createStream لازم تبقى async",
        "كل rebuild بيعمل stream جديد ويشترك من الأول، فبتضيع القيم وتتكرر الاتصالات",
      ],
      answer: 3,
      why: "نفس غلطة FutureBuilder: أنشئ الـ stream مرة (initState أو field) أو من state management.",
    },
    {
      q: "اسم الـ widget اللي بيدّي سحب للتحديث (pull to refresh) في Flutter:",
      answer: ["RefreshIndicator", "refreshindicator"],
      why: "<code>RefreshIndicator(onRefresh: ..., child: scrollable)</code>. الـ onRefresh لازم ترجع Future.",
    },
  ],
};
