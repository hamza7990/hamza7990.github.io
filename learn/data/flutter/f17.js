window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f17"] = {
  slides: [
    {
      kicker: "ليه الأداء",
      title: "إزاي Flutter بيطلّع frame، ومعنى jank",
      en: "The frame pipeline: build, layout, paint, raster",
      body: "<p>الشاشة بتتحدث 60 مرة في الثانية (أو 90 و120 على أجهزة كتير)، يعني عندك <b>حوالي 16 ملّي ثانية</b> للـ frame الواحد (8 على 120Hz). لو الـ frame خد أكتر، المستخدم بيشوف تقطيع، وده اسمه <b>jank</b>. الـ frame بيعدي على مراحل:</p>",
      terms: [
        ["Build", "بناء الـ widgets", "دالة <code>build</code> بتتنادي وبترجع شجرة widgets جديدة. هنا بتحصل الـ rebuilds."],
        ["Layout", "حساب المقاسات", "كل render object يحسب مقاسه ومكانه (constraints تنزل ومقاسات تطلع)."],
        ["Paint", "تسجيل الرسم", "الـ render objects بتسجّل أوامر الرسم في layers."],
        ["Raster", "التحويل لبكسلات", "الـ layers بتتبعت لـ GPU (عن طريق Skia أو Impeller) وتتحول لصورة الشاشة."],
      ],
      points: [
        "<b>UI thread:</b> بينفذ كود Dart بتاعك: build و layout و paint. لو عملت حاجة تقيلة هنا (حساب، parse) الـ frame بيتأخر.",
        "<b>Raster thread:</b> بياخد الـ layers ويرسمها على GPU. بيتقل لو الرسم معقد (شفافية، blur، clipping، صور ضخمة).",
        "التشخيص أول خطوة: هل المشكلة في الـ UI thread (كودك) ولا الـ raster thread (تعقيد الرسم)؟ الـ DevTools بيوريك كل واحد لوحده.",
      ],
      focus: [{ label: "احفظها", text: "الـ frame budget حوالي 16ms. الـ UI thread = كود Dart بتاعك، الـ raster thread = الرسم على GPU. قبل ما تحسّن، قيس." }],
      interview: [
        { q: "إزاي Flutter بيرسم frame؟ وإيه الفرق بين الـ UI thread والـ raster thread؟", a: "الـ frame بيعدي على build (الـ widgets)، layout (المقاسات)، paint (تسجيل أوامر الرسم في layers)، وبعدين raster (تحويل الـ layers لبكسلات على GPU). أول تلات مراحل بتتنفذ على الـ UI thread وهو اللي بيشغل كود Dart بتاعي، والرابعة على الـ raster thread. الـ budget حوالي 16ms على 60Hz، ولو أي thread عدّى الوقت ده بيحصل jank. لو الـ UI thread بطيء يبقى المشكلة في كودي (build تقيل أو شغل زيادة)، ولو الـ raster بطيء يبقى الرسم نفسه معقد (شفافية كتير، clipping، صور كبيرة)." },
      ],
    },
    {
      title: "قلل الـ rebuilds: const وتقسيم الـ widgets",
      en: "const, splitting widgets, state low in the tree",
      body: "<p>الـ rebuild نفسه رخيص، لكن لو <code>setState</code> في widget كبير فإنت بتعيد بناء شجرة كبيرة كل مرة. القاعدة: <b>حط الـ state في أقل widget ممكن يحتاجها</b>، وخلّي الباقي <code>const</code> عشان Flutter يتخطاه.</p>",
      codes: [
        {
          lang: "dart",
          title: "غلط: الصفحة كلها بتتبني مع كل ضغطة",
          src: `class CounterPageBad extends StatefulWidget {
  const CounterPageBad({super.key});

  @override
  State<CounterPageBad> createState() => _CounterPageBadState();
}

class _CounterPageBadState extends State<CounterPageBad> {
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('$_count'),
        ElevatedButton(
          onPressed: () => setState(() => _count++),
          child: const Text('+'),
        ),
        const Expanded(child: HeavyList()),
      ],
    );
  }
}

class HeavyList extends StatelessWidget {
  const HeavyList({super.key});

  @override
  Widget build(BuildContext context) => const SizedBox();
}`,
        },
        {
          lang: "dart",
          title: "صح: الـ state في widget صغير",
          src: `class CounterPageGood extends StatelessWidget {
  const CounterPageGood({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        CounterButton(),
        Expanded(child: HeavyList()),
      ],
    );
  }
}

class CounterButton extends StatefulWidget {
  const CounterButton({super.key});

  @override
  State<CounterButton> createState() => _CounterButtonState();
}

class _CounterButtonState extends State<CounterButton> {
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () => setState(() => _count++),
      child: Text('$_count'),
    );
  }
}

class HeavyList extends StatelessWidget {
  const HeavyList({super.key});

  @override
  Widget build(BuildContext context) => const SizedBox();
}`,
          note: "دلوقتي الـ <code>setState</code> بتبني <code>CounterButton</code> بس. والصفحة <code>const</code> فمبتتبنيش تاني.",
        },
      ],
      points: [
        "دالة بترجع widget (<code>_buildHeader()</code>) مفيهاش حماية: بتتنفذ كل build. widget كلاس <code>const</code> بيتخطى (اتكلمنا عنها في أول مستوى).",
        "متحطش <code>setState</code> أو <code>watch</code> في أول widget في الشاشة لو المتغير بيأثر على حتة صغيرة.",
      ],
      interview: [
        { q: "إزاي بتقلل الـ rebuilds في شاشة تقيلة؟", a: "أولا بحط الـ state في أصغر widget بيحتاجها بدل الصفحة كلها، فالـ <code>setState</code> بيبني حتة صغيرة. تانيا بخلي الأجزاء الثابتة <code>const</code> عشان Flutter يتخطاها. تالتا بقسّم الواجهة لـ widgets كلاس بدل دوال. رابعا في state management بقرا الجزء اللي محتاجه بس بـ <code>select</code> في Riverpod أو <code>buildWhen</code> في Bloc. وببص على عداد الـ rebuilds في DevTools عشان أتأكد." },
      ],
    },
    {
      title: "select و buildWhen و ValueListenableBuilder",
      en: "Narrowing what a widget listens to",
      body: "<p>حتى لو الـ widget صغير، ممكن يتبني أكتر من اللازم لو بيسمع لـ state كبيرة والمتغير فيها حاجة تانية. قلل نطاق الاشتراك:</p>",
      codes: [
        {
          lang: "dart",
          title: "Riverpod: select",
          src: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class User {
  const User(this.name, this.unread);
  final String name;
  final int unread;
}

final userProvider = Provider<User>((ref) => const User('Ali', 0));

class NameLabel extends ConsumerWidget {
  const NameLabel({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final name = ref.watch(userProvider.select((u) => u.name));
    return Text(name);
  }
}`,
        },
        {
          lang: "dart",
          title: "Bloc: buildWhen",
          src: `import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CounterLabel extends StatelessWidget {
  const CounterLabel({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<Cubit<int>, int>(
      buildWhen: (previous, current) => current % 10 == 0,
      builder: (context, count) => Text('$count'),
    );
  }
}`,
        },
        {
          lang: "dart",
          title: "ValueListenableBuilder مع child",
          src: `import 'package:flutter/material.dart';

class Badge extends StatelessWidget {
  const Badge({super.key, required this.unread});

  final ValueNotifier<int> unread;

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<int>(
      valueListenable: unread,
      child: const Icon(Icons.notifications),
      builder: (context, value, child) {
        return Row(children: [child!, Text('$value')]);
      },
    );
  }
}`,
          note: "الـ <code>child</code> بيتبني مرة ويتمرر للـ builder، نفس فكرة <code>AnimatedBuilder</code>.",
        },
      ],
    },
    {
      title: "القوائم والشغل التقيل جوه build",
      en: "ListView.builder, itemExtent, expensive work in build",
      body: "<p>اتكلمنا إن <code>ListView.builder</code> بيبني العناصر الظاهرة بس. لو كل العناصر ارتفاعها واحد، قول لـ Flutter بـ <code>itemExtent</code> أو <code>prototypeItem</code> فيحسب الـ scroll من غير ما يقيس كل عنصر. وعمرك ما تعمل <code>shrinkWrap: true</code> لقايمة طويلة لأنه بيجبرها تبني كل العناصر.</p><p>والـ <code>build</code> ممكن يتنادى كل frame في أنيميشن، فمتحطش جواه شغل تقيل (sort، filter على آلاف العناصر، regex، parse). احسبه مرة وخزنه.</p>",
      codes: [
        {
          lang: "dart",
          title: "قايمة سريعة",
          src: `ListView.builder(
  itemCount: items.length,
  itemExtent: 72,
  itemBuilder: (context, index) {
    return ListTile(
      key: ValueKey(items[index].id),
      title: Text(items[index].title),
    );
  },
)`,
        },
        {
          lang: "dart",
          title: "غلط ثم صح: الحساب برا build",
          src: `class Item {
  const Item(this.id, this.title);
  final int id;
  final String title;
}

// wrong: sorts again on every rebuild
class BadList extends StatelessWidget {
  const BadList({super.key, required this.items});

  final List<Item> items;

  @override
  Widget build(BuildContext context) {
    final sorted = [...items]..sort((a, b) => a.title.compareTo(b.title));
    return Text('\${sorted.length}');
  }
}

// right: sort once when the data changes
class GoodList extends StatefulWidget {
  const GoodList({super.key, required this.items});

  final List<Item> items;

  @override
  State<GoodList> createState() => _GoodListState();
}

class _GoodListState extends State<GoodList> {
  late List<Item> _sorted = _sort(widget.items);

  static List<Item> _sort(List<Item> items) {
    return [...items]..sort((a, b) => a.title.compareTo(b.title));
  }

  @override
  void didUpdateWidget(GoodList old) {
    super.didUpdateWidget(old);
    if (old.items != widget.items) _sorted = _sort(widget.items);
  }

  @override
  Widget build(BuildContext context) => Text('\${_sorted.length}');
}`,
          note: "نفس الفكرة في Riverpod: اعمل <code>Provider</code> مشتق بيرتب، فيتحسب لما المصدر يتغير بس.",
        },
      ],
      pitfall: "<code>ListView(children: items.map(...).toList())</code> لقايمة كبيرة: بتبني كل العناصر مرة واحدة. استخدم <code>ListView.builder</code>.",
    },
    {
      title: "الصور",
      en: "Image sizes, cacheWidth, caching packages",
      body: "<p>الصور أكبر سبب لاستهلاك الذاكرة. صورة 4000x3000 بتتفك لـ 48MB في الذاكرة حتى لو معروضة في مربع 100x100. الحل إنك تقول لـ Flutter يفك الصورة بالمقاس المطلوب بـ <code>cacheWidth</code> أو <code>cacheHeight</code> (بالـ physical pixels). والأحسن أصلا إن السيرفر يبعت thumbnail بمقاس صغير.</p>",
      codes: [
        {
          lang: "dart",
          title: "فك الصورة بالمقاس المناسب",
          src: `class Thumb extends StatelessWidget {
  const Thumb({super.key, required this.url});

  final String url;

  @override
  Widget build(BuildContext context) {
    final dpr = MediaQuery.devicePixelRatioOf(context);
    return Image.network(
      url,
      width: 120,
      height: 120,
      fit: BoxFit.cover,
      cacheWidth: (120 * dpr).round(),
    );
  }
}`,
          note: "من غير <code>cacheWidth</code> الصورة بتتفك بمقاسها الأصلي. <code>Image.network</code> بيحتفظ بالصور في ذاكرة مؤقتة (ImageCache) بس مش على الديسك.",
        },
        {
          lang: "dart",
          title: "cached_network_image (حزمة)",
          src: `import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class CachedThumb extends StatelessWidget {
  const CachedThumb({super.key, required this.url});

  final String url;

  @override
  Widget build(BuildContext context) {
    return CachedNetworkImage(
      imageUrl: url,
      width: 120,
      height: 120,
      fit: BoxFit.cover,
      memCacheWidth: 240,
      placeholder: (context, url) => const ColoredBox(color: Colors.grey),
      errorWidget: (context, url, error) => const Icon(Icons.broken_image),
    );
  }
}`,
          note: "حزمة <b>cached_network_image</b> بتخزن الصور على الديسك، فمتتحملش تاني بعد قفل التطبيق، وبتدّيك placeholder و errorWidget. تضيفها بـ <code>flutter pub add cached_network_image</code>.",
        },
      ],
      interview: [
        { q: "التطبيق بيستهلك ذاكرة كبيرة وبيقع في شاشة فيها صور كتير. بتعمل إيه؟", a: "الصور غالبا هي السبب. أول حاجة بتأكد إن السيرفر بيبعت thumbnails بمقاس مناسب مش الصورة الأصلية. وبحدد <code>cacheWidth</code> أو <code>cacheHeight</code> (أو <code>memCacheWidth</code> في cached_network_image) عشان Flutter يفك الصورة بالمقاس المعروض مش بمقاسها الأصلي. وبستخدم <code>ListView.builder</code> عشان الصور بره الشاشة متتحملش، وبحزمة كاش على الديسك زي <code>cached_network_image</code>. وبراقب الذاكرة في DevTools Memory view." },
      ],
    },
    {
      title: "تكلفة الشفافية والـ clipping",
      en: "Opacity, clipping and saveLayer",
      body: "<p>بعض الـ widgets بتخلي الـ raster thread يرسم جزء الشجرة في layer منفصل ثم يدمجه (<code>saveLayer</code>)، وده غالي خصوصا لو بيتكرر كل frame أو على مساحة كبيرة. أشهر اتنين:</p>",
      points: [
        "<b>Opacity:</b> <code>Opacity(opacity: .5, child: big)</code> بيرسم الـ child في layer. الأرخص: لو ده نص أو لون بس، حط الشفافية في اللون نفسه (<code>color.withValues(alpha: .5)</code>). ولو بتحرك الشفافية استخدم <code>FadeTransition</code> أو <code>AnimatedOpacity</code> (مصممين للحالة دي).",
        "<b>Clipping:</b> <code>ClipRRect</code> و<code>ClipPath</code> و<code>Clip.antiAliasWithSaveLayer</code> أغلى من <code>Clip.hardEdge</code>. لو الـ child مش بيتجاوز الحدود، <code>BoxDecoration(borderRadius:)</code> بيكفي من غير clip.",
        "<b>الظلال الكبيرة (blur)</b> و<code>BackdropFilter</code> تقيلين على الـ raster thread، فاستخدمهم بحساب ومتحطهمش في عناصر القايمة.",
        "<b>RepaintBoundary</b> يعزل جزء بيتحرك عن الباقي (اتكلمنا عنه في الحركة والرسم)، لكن متحطوش في كل مكان.",
      ],
      codes: [
        {
          lang: "dart",
          title: "غلط ثم صح",
          src: `class OpacityExamples extends StatelessWidget {
  const OpacityExamples({super.key, required this.animation});

  final Animation<double> animation;

  @override
  Widget build(BuildContext context) {
    final primary = Theme.of(context).colorScheme.primary;
    return Column(
      children: [
        // costly: a saveLayer on a big subtree
        const Opacity(opacity: 0.5, child: HeavyCard()),
        // cheaper: alpha inside the colour
        ColoredBox(color: primary.withValues(alpha: 0.5)),
        // animating it: use the purpose-made widget
        FadeTransition(opacity: animation, child: const HeavyCard()),
      ],
    );
  }
}

class HeavyCard extends StatelessWidget {
  const HeavyCard({super.key});

  @override
  Widget build(BuildContext context) => const SizedBox();
}`,
        },
      ],
    },
    {
      title: "الـ Isolates للشغل التقيل",
      en: "Isolate.run and compute",
      body: "<p>Dart بتشتغل على thread واحد (الـ UI isolate)، فأي حساب تقيل (parse لـ JSON بحجم ميجابايتات، معالجة صورة، تشفير، ضغط) بيجمّد الواجهة. <code>Isolate.run</code> بيشغل الدالة في isolate تاني (thread منفصل بذاكرة منفصلة) ويرجعلك النتيجة، والـ UI تفضل سلسة.</p>",
      code: {
        lang: "dart",
        title: "parse_in_isolate.dart",
        src: `import 'dart:convert';
import 'dart:isolate';

class Property {
  const Property(this.id, this.title);

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(json['id'] as int, json['title'] as String);
  }

  final int id;
  final String title;
}

List<Property> _parse(String body) {
  final list = jsonDecode(body) as List<dynamic>;
  return [
    for (final e in list) Property.fromJson(e as Map<String, dynamic>),
  ];
}

Future<List<Property>> parseProperties(String body) {
  return Isolate.run(() => _parse(body));
}`,
        note: "في Flutter فيه كمان <code>compute(_parse, body)</code> من <code>flutter/foundation.dart</code> بنفس الفكرة، لكن <code>Isolate.run</code> هو الأحدث والأبسط.",
      },
      points: [
        "الـ isolates <b>مبتشاركش الذاكرة</b>: البيانات بتتنسخ في الإرسال والاستقبال، فالشغل الخفيف مش هيستاهل (التكلفة أكبر من الفايدة).",
        "الـ isolate التاني ميقدرش يلمس الـ UI ولا widgets. بيتعامل مع بيانات وبس.",
        "الـ closure اللي بتبعتها ماينفعش تمسك حاجة مش قابلة للإرسال (مثلا BuildContext).",
        "لو الشغل async بس (طلب شبكة) مش محتاج isolate: الـ await مبيجمّدش الـ UI.",
      ],
      interview: [
        { q: "إمتى تستخدم isolate في Flutter؟", a: "لما يكون عندي شغل CPU تقيل بياخد أكتر من ملّي ثواني معدودة على الـ UI thread، زي parse JSON كبير أو معالجة صور أو تشفير، لأنه بيمنع الـ frames. بستخدم <code>Isolate.run</code> (أو <code>compute</code>) وبمرر له البيانات وبياخد النتيجة. مبستخدمهوش للـ I/O العادي زي طلب شبكة لأن الـ async مبيجمدش الـ UI، ولا للشغل الصغير لأن نسخ البيانات بين الـ isolates له تكلفة." },
      ],
    },
    {
      title: "تسريبات الذاكرة",
      en: "Memory leaks: controllers, subscriptions, listeners",
      body: "<p>الـ leak هنا معناه object فاضل في الذاكرة لأن حاجة لسه ماسكاه. أشهر سبب في Flutter: حاجة <b>بدأتها في initState</b> وجوه الـ State ولسه شغالة بعد ما الـ widget اتقفل. كل حاجة بتتفتح لازم تتقفل في <code>dispose</code>:</p>",
      code: {
        lang: "dart",
        title: "no_leaks.dart",
        src: `import 'dart:async';
import 'package:flutter/material.dart';

class LivePage extends StatefulWidget {
  const LivePage({super.key, required this.stream});

  final Stream<int> stream;

  @override
  State<LivePage> createState() => _LivePageState();
}

class _LivePageState extends State<LivePage> {
  final _scroll = ScrollController();
  final _search = TextEditingController();
  final _focus = FocusNode();
  late final StreamSubscription<int> _sub;
  late final Timer _timer;

  @override
  void initState() {
    super.initState();
    _sub = widget.stream.listen((v) {
      if (mounted) setState(() {});
    });
    _timer = Timer.periodic(const Duration(seconds: 30), (_) {});
    _scroll.addListener(_onScroll);
  }

  void _onScroll() {}

  @override
  void dispose() {
    _scroll.removeListener(_onScroll);
    _scroll.dispose();
    _search.dispose();
    _focus.dispose();
    _sub.cancel();
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => const SizedBox();
}`,
        note: "المجموعة: controllers (<code>dispose</code>)، subscriptions و timers (<code>cancel</code>)، listeners (<code>removeListener</code>). و<code>mounted</code> قبل <code>setState</code> في callback async.",
      },
      points: [
        "الـ controller بيتقفل في الـ State اللي عملته. مفيش widget تاني يقفله.",
        "<code>ValueNotifier</code> و<code>ChangeNotifier</code> اللي عملتهم في State محتاجين <code>dispose()</code> كمان.",
        "متخزنش <code>BuildContext</code> في متغير static أو singleton: بيمسك الـ widget كله.",
        "الـ Memory view في DevTools بيوريك إذا الذاكرة بتزيد كل ما تدخل وتخرج من الشاشة (علامة leak).",
      ],
      interview: [
        { q: "إيه أشهر أسباب memory leaks في Flutter؟", a: "إني أفتح حاجة في <code>initState</code> وأنساها في <code>dispose</code>: <code>AnimationController</code> و<code>TextEditingController</code> و<code>ScrollController</code> و<code>FocusNode</code> محتاجين <code>dispose()</code>، و<code>StreamSubscription</code> و<code>Timer</code> محتاجين <code>cancel()</code>، وأي <code>addListener</code> محتاج <code>removeListener</code>. كمان تخزين <code>BuildContext</code> في singleton. بكتشفها في DevTools Memory لما أدخل وأخرج من الشاشة كذا مرة والذاكرة بتفضل تزيد." },
      ],
    },
    {
      title: "الـ DevTools: تقيس قبل ما تحسّن",
      en: "Widget inspector, performance view, CPU profiler, memory, network",
      body: "<p>الـ DevTools مجموعة أدوات بتفتحها من الـ IDE أو من الرابط اللي بيظهر لما تشغل التطبيق. مبتخمنش: بتقيس.</p>",
      terms: [
        ["Widget inspector", "فاحص الـ widgets", "بيوريك شجرة الـ widgets وخصائص كل واحد. فيه خيار <b>Track widget rebuilds</b> (عداد rebuilds) وخيار يدلك على overflow."],
        ["Performance view", "الأداء", "Frame chart: عمود لكل frame، جزء UI وجزء Raster. الأعمدة الحمرا هي الـ jank. اضغط على frame وشوف الـ timeline لتعرف أنهي دالة أخدت وقت."],
        ["CPU profiler", "محلل المعالج", "بيوريك أنهي دوال Dart بتاخد أطول وقت. بتسجّل وأنت بتعمل الحركة البطيئة."],
        ["Memory view", "الذاكرة", "رسم للذاكرة مع الوقت، وبتاخد snapshot وتشوف أنهي classes عددها بيزيد (لتكتشف leaks)."],
        ["Network view", "الشبكة", "كل طلب HTTP بوقته وحجمه وresponse. بتكتشف طلبات مكررة أو كبيرة."],
      ],
      points: [
        "فيه كمان <code>MaterialApp(showPerformanceOverlay: true)</code> بيرسم رسمين للـ UI والـ raster فوق التطبيق.",
        "الـ <b>Highlight repaints</b> في الـ inspector بيلون كل layer بيتعاد رسمه، فتشوف اللي بيرسم تاني ملوش لازمة.",
      ],
    },
    {
      title: "Debug و Profile و Release، وحجم التطبيق",
      en: "Build modes, app size analysis, debugging tools",
      body: "<p>أهم قاعدة: <b>متقيسش الأداء في debug mode</b>. الـ debug بيشتغل بـ JIT ومعاه assertions وأدوات كتير فهو بطيء بشكل مصطنع (jank في debug مش معناه jank حقيقي).</p>",
      terms: [
        ["Debug", "للتطوير", "JIT، hot reload، assertions شغالة. بطيء. <code>flutter run</code>."],
        ["Profile", "للقياس", "كومبايل AOT بسرعة قريبة من release ومعاه أدوات الـ profiling. <b>على جهاز حقيقي</b>. <code>flutter run --profile</code>."],
        ["Release", "للنشر", "AOT أسرع وأصغر ومن غير أدوات debugging. <code>flutter build apk --release</code>."],
      ],
      codes: [
        {
          lang: "bash",
          title: "حجم التطبيق",
          src: `# size breakdown by package and asset
flutter build apk --analyze-size
flutter build appbundle --analyze-size

# smaller per-device APKs
flutter build apk --split-per-abi`,
          note: "الأمر بيطلّع ملف JSON تفتحه في DevTools (App Size tool). غالبا الأكبر: الصور والخطوط والـ packages التقيلة. شيل اللي مش بتستخدمه وصغّر الصور.",
        },
        {
          lang: "dart",
          title: "أدوات تشخيص",
          src: `import 'package:flutter/widgets.dart';

void diagnostics() {
  debugPrint('loaded 42 items'); // throttled, safe for long text
  debugPrintRebuildDirtyWidgets = true; // log each rebuilt widget
  debugDumpApp(); // print the widget tree
}`,
          note: "<code>print</code> العادي ممكن يتقص لو طويل، و<code>debugPrint</code> بيقسمه. والـ breakpoints من الـ IDE أحسن من print: بتوقف وتشوف المتغيرات.",
        },
      ],
      interview: [
        { q: "ليه مينفعش نقيس الأداء في debug mode؟ وإيه البديل؟", a: "لأن الـ debug بيشتغل بـ JIT ومعاه assertions وأدوات debugging، فهو أبطأ بكتير من التطبيق الحقيقي، والـ jank اللي فيه ممكن ميكونش موجود في release. البديل <b>profile mode على جهاز حقيقي</b> (<code>flutter run --profile</code>): كومبايل AOT قريب من release ومعاه أدوات القياس، وبفتح عليه DevTools Performance view وأشوف الـ frame chart." },
        { q: "التطبيق بيتقطع وأنا بعمل scroll. بتشخّصه إزاي؟", a: "بشغله في profile mode على جهاز حقيقي وأفتح Performance view في DevTools. بشوف الـ frame chart: لو الأعمدة الحمرا في جزء الـ UI يبقى كودي بطيء، فبفتح الـ CPU profiler وأدور على الدوال التقيلة (parse أو sort جوه build مثلا) وأنقلها برا build أو في isolate. لو الـ Raster هو البطيء يبقى المشكلة في الرسم: شفافية، clipping، ظلال، صور كبيرة. وبتأكد إن القايمة <code>ListView.builder</code>، والصور بـ <code>cacheWidth</code>، ومفيش rebuilds زيادة من عداد الـ rebuilds." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: قايمة سريعة",
      lang: "dart",
      code: `ListView.builder(
  itemCount: items.length,
  itemExtent: 72,
  itemBuilder: (context, index) {
    final item = items[index];
    return ListTile(
      key: ValueKey(item.id),
      title: Text(item.title),
    );
  },
)`,
      note: "<code>itemExtent</code> بتوفر على Flutter قياس كل عنصر. والـ <code>key</code> بقيمة ثابتة.",
    },
    {
      title: "اكتب: dispose لكل حاجة اتفتحت",
      lang: "dart",
      code: `@override
void initState() {
  super.initState();
  _sub = stream.listen(_onData);
  _timer = Timer.periodic(const Duration(seconds: 5), _tick);
  _scroll.addListener(_onScroll);
}

@override
void dispose() {
  _scroll.removeListener(_onScroll);
  _scroll.dispose();
  _sub.cancel();
  _timer.cancel();
  super.dispose();
}`,
    },
    {
      title: "اكتب: Isolate.run",
      lang: "dart",
      code: `import 'dart:convert';
import 'dart:isolate';

int _countItems(String body) {
  final list = jsonDecode(body) as List<dynamic>;
  return list.length;
}

Future<int> countInIsolate(String body) {
  return Isolate.run(() => _countItems(body));
}`,
    },
  ],

  tasks: [
    {
      title: "قسّم الصفحة اللي بتتبني كلها",
      lang: "dart",
      prompt: "<p>الصفحة دي فيها عداد في الـ State وقايمة تقيلة <code>ExpensiveList</code>. كل ضغطة على الزرار بتبني القايمة كمان. عدّل الكود بحيث الضغطة تبني الزرار والنص بس: اعمل <code>CounterButton</code> (<code>StatefulWidget</code> فيه الـ state) وخلي <code>DashboardPage</code> يبقى <code>StatelessWidget</code> بـ <code>const</code> على اللي ينفع.</p>",
      starter: `class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  int _taps = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ElevatedButton(
          onPressed: () => setState(() => _taps++),
          child: Text('Taps: $_taps'),
        ),
        const Expanded(child: ExpensiveList()),
      ],
    );
  }
}`,
      hints: [
        "الـ state (<code>_taps</code> و<code>setState</code>) تنتقل للـ widget الجديد، والصفحة تفضل بس <code>Column</code> فيها <code>CounterButton()</code> و<code>ExpensiveList()</code>.",
        "لما الصفحة تبقى <code>StatelessWidget</code> وكل أولادها <code>const</code>، تقدر تكتب <code>const Column(...)</code>.",
      ],
      solution: `import 'package:flutter/material.dart';

class ExpensiveList extends StatelessWidget {
  const ExpensiveList({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: 1000,
      itemBuilder: (context, i) => ListTile(title: Text('Row $i')),
    );
  }
}

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        CounterButton(),
        Expanded(child: ExpensiveList()),
      ],
    );
  }
}

class CounterButton extends StatefulWidget {
  const CounterButton({super.key});

  @override
  State<CounterButton> createState() => _CounterButtonState();
}

class _CounterButtonState extends State<CounterButton> {
  int _taps = 0;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () => setState(() => _taps++),
      child: Text('Taps: $_taps'),
    );
  }
}`,
      explain: "الـ <code>setState</code> دلوقتي بتتنفذ في <code>_CounterButtonState</code> فبتعيد بناء الزرار بس. الصفحة نفسها <code>const</code> ومش بتتبني أصلا. ده نفس الفكرة بالظبط: الـ state أقرب ما يمكن للمكان اللي بيستخدمها.",
    },
    {
      title: "صلّح التسريبات",
      lang: "dart",
      prompt: "<p>الـ State دي بتفتح أربع حاجات وبتنسى تقفلهم، وكمان بتنادي <code>setState</code> من callback async من غير حماية. صلّحها: اقفل الـ controller والـ subscription والـ timer والـ listener، وحمي <code>setState</code> بـ <code>mounted</code>.</p>",
      starter: `class _TickerPageState extends State<TickerPage> {
  final _controller = TextEditingController();
  late StreamSubscription<int> _sub;
  late Timer _timer;
  int _last = 0;

  @override
  void initState() {
    super.initState();
    _sub = widget.stream.listen((v) {
      setState(() => _last = v);
    });
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      debugPrint('tick');
    });
    _controller.addListener(_onText);
  }

  void _onText() {}

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(controller: _controller),
        Text('$_last'),
      ],
    );
  }
}`,
      hints: [
        "اكتب <code>dispose()</code> فيها <code>removeListener</code> و<code>dispose</code> و<code>cancel</code> للتلاتة، واستدعي <code>super.dispose()</code> في الآخر.",
        "جوه callback الـ stream: <code>if (!mounted) return;</code> قبل <code>setState</code>.",
      ],
      solution: `import 'dart:async';
import 'package:flutter/material.dart';

class TickerPage extends StatefulWidget {
  const TickerPage({super.key, required this.stream});

  final Stream<int> stream;

  @override
  State<TickerPage> createState() => _TickerPageState();
}

class _TickerPageState extends State<TickerPage> {
  final _controller = TextEditingController();
  late final StreamSubscription<int> _sub;
  late final Timer _timer;
  int _last = 0;

  @override
  void initState() {
    super.initState();
    _sub = widget.stream.listen((v) {
      if (!mounted) return;
      setState(() => _last = v);
    });
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      debugPrint('tick');
    });
    _controller.addListener(_onText);
  }

  void _onText() {}

  @override
  void dispose() {
    _controller.removeListener(_onText);
    _controller.dispose();
    _sub.cancel();
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(controller: _controller),
        Text('$_last'),
      ],
    );
  }
}`,
      explain: "من غير <code>dispose</code> الـ subscription والـ timer يفضلوا شغالين بعد ما الشاشة تتقفل ويمسكوا الـ State في الذاكرة، والـ stream كمان ممكن ينادي <code>setState</code> على State مقفولة فيطلع الخطأ المشهور. القاعدة: كل <code>listen</code> و<code>Timer</code> و<code>addListener</code> ليهم مقابل في <code>dispose</code>.",
    },
    {
      title: "قايمة صور وparse في isolate",
      lang: "dart",
      prompt: "<p>اكتب <code>parsePhotos(String body)</code> بترجع <code>Future&lt;List&lt;Photo&gt;&gt;</code> وتعمل الـ parse جوه <code>Isolate.run</code> (الـ JSON عبارة عن list فيها <code>id</code> و<code>url</code>). واكتب <code>PhotoList</code> (<code>StatelessWidget</code>) بياخد <code>List&lt;Photo&gt;</code> ويعرضها بـ <code>ListView.builder</code> بـ <code>itemExtent: 96</code>، وكل عنصر <code>Image.network</code> بمقاس 80x80 و<code>fit: BoxFit.cover</code> و<code>cacheWidth</code> محسوب من <code>devicePixelRatio</code>، وبـ <code>key</code> من الـ id.</p>",
      hints: [
        "الدالة اللي بتتنفذ في الـ isolate تكون top-level (<code>_parse</code>) وبتاخد الـ String وبترجع الـ list.",
        "<code>cacheWidth: (80 * MediaQuery.devicePixelRatioOf(context)).round()</code>.",
      ],
      solution: `import 'dart:convert';
import 'dart:isolate';
import 'package:flutter/material.dart';

class Photo {
  const Photo(this.id, this.url);

  factory Photo.fromJson(Map<String, dynamic> json) {
    return Photo(json['id'] as int, json['url'] as String);
  }

  final int id;
  final String url;
}

List<Photo> _parse(String body) {
  final list = jsonDecode(body) as List<dynamic>;
  return [
    for (final e in list) Photo.fromJson(e as Map<String, dynamic>),
  ];
}

Future<List<Photo>> parsePhotos(String body) {
  return Isolate.run(() => _parse(body));
}

class PhotoList extends StatelessWidget {
  const PhotoList({super.key, required this.photos});

  final List<Photo> photos;

  @override
  Widget build(BuildContext context) {
    final dpr = MediaQuery.devicePixelRatioOf(context);
    return ListView.builder(
      itemCount: photos.length,
      itemExtent: 96,
      itemBuilder: (context, index) {
        final photo = photos[index];
        return Padding(
          key: ValueKey(photo.id),
          padding: const EdgeInsets.all(8),
          child: Image.network(
            photo.url,
            width: 80,
            height: 80,
            fit: BoxFit.cover,
            cacheWidth: (80 * dpr).round(),
          ),
        );
      },
    );
  }
}`,
      explain: "التلات تحسينات مع بعض: الـ parse بعيد عن الـ UI thread، القايمة lazy و<code>itemExtent</code> بتوفر القياس، والصورة بتتفك بمقاسها الحقيقي على الشاشة مش الأصلي. الـ <code>dpr</code> بيتحسب مرة برا الـ builder.",
    },
  ],

  quiz: [
    {
      q: "كام ملّي ثانية تقريبا الـ budget للـ frame الواحد على شاشة 60Hz؟ (رقم)",
      answer: ["16", "16ms", "16 ms", "16.6", "16.7", "16.67"],
      why: "الثانية 1000ms على 60 frame = حوالي 16.7ms. على 120Hz بيبقى حوالي 8ms.",
    },
    {
      q: "جزء من كودك بيعمل sort لقايمة ضخمة جوه <code>build</code> والـ frames حمرا في الـ UI. أنهي thread المتأثر؟",
      options: [
        "الـ raster thread لأن الرسم تقيل",
        "الـ UI thread لأن build وكود Dart بيتنفذوا عليه",
        "الـ platform thread بتاع Android",
        "الـ GPU بس",
      ],
      answer: 1,
      why: "كود Dart (build, layout, paint recording) على الـ UI thread. الـ raster thread بيتأخر لما الرسم نفسه معقد (شفافية، clipping).",
    },
    {
      q: "عايز تقيس الأداء بدقة. تشغل التطبيق إزاي؟",
      options: [
        "في debug mode على الـ emulator",
        "في debug mode مع hot reload",
        "في release mode من غير أي أدوات",
        "في profile mode على جهاز حقيقي",
      ],
      answer: 3,
      why: "الـ debug بطيء بشكل مصطنع. الـ profile بيشتغل بـ AOT قريب من release ومعاه أدوات القياس. الـ release مفيهوش DevTools. والجهاز الحقيقي لأن الـ emulator مش ممثل للـ GPU.",
    },
    {
      q: "المشكلة في الكود ده؟",
      code: { lang: "dart", src: `SingleChildScrollView(
  child: ListView.builder(
    shrinkWrap: true,
    itemCount: 5000,
    itemBuilder: (context, i) => ListTile(title: Text('$i')),
  ),
)` },
      options: [
        "بيبني كل الـ 5000 عنصر مرة واحدة (shrinkWrap) فبيضيع فايدة الـ lazy building",
        "ListView.builder مينفعش يتحط جوه أي widget",
        "الـ ListTile تقيل",
        "مفيش مشكلة",
      ],
      answer: 0,
      why: "الـ <code>shrinkWrap</code> جوه scroll تاني بيجبر القايمة تقيس كل العناصر. الحل: اشيل الـ <code>SingleChildScrollView</code> واستخدم <code>ListView.builder</code> لوحده (أو slivers لو فيه محتوى فوقها).",
    },
    {
      q: "عايز تعمل child شفاف 50% وبيتحرك بأنيميشن. الأنسب؟",
      options: [
        "<code>Opacity</code> جوه <code>setState</code> كل frame",
        "<code>ClipRRect</code> بـ <code>antiAliasWithSaveLayer</code>",
        "<code>FadeTransition</code> أو <code>AnimatedOpacity</code>",
        "<code>BackdropFilter</code>",
      ],
      answer: 2,
      why: "الاتنين مصممين لتحريك الشفافية بكفاءة. الباقي بيعمل saveLayer أو يعيد البناء كل frame.",
    },
    {
      q: "إيه اللي ميعملهوش <code>Isolate.run</code>؟",
      options: [
        "ينفذ دالة على thread تاني",
        "يشارك نفس الذاكرة مع الـ UI isolate ويعدّل widgets مباشرة",
        "يرجع نتيجة Future",
        "يشتغل مع كود Dart عادي",
      ],
      answer: 1,
      why: "كل isolate له ذاكرته، فالبيانات بتتنسخ. وميقدرش يعدل الـ UI. اللي بيرجع بس هو النتيجة.",
    },
    {
      q: "أنهي سطر ناقص عشان نتجنب leak؟",
      code: { lang: "dart", src: `@override
void initState() {
  super.initState();
  _controller.addListener(_onChange);
}

@override
void dispose() {
  _controller.dispose();
  super.dispose();
}` },
      options: [
        "<code>_controller.reset()</code>",
        "<code>_controller.cancel()</code>",
        "<code>setState(() {})</code>",
        "<code>_controller.removeListener(_onChange);</code> قبل الـ dispose (كل <code>addListener</code> ليها <code>removeListener</code>)",
      ],
      answer: 3,
      why: "الـ dispose بيتخلص من الـ controller، لكن القاعدة الآمنة إنك تشيل الـ listener اللي ضفته. لو الـ controller أطول عمرا من الـ State (مرر من برا) سيبه يمسك الـ State ويعمل leak.",
    },
    {
      q: "إيه تأثير <code>cacheWidth: 200</code> على <code>Image.network</code>؟",
      options: [
        "Flutter يفك الصورة بعرض 200 بكسل بدل مقاسها الأصلي، فالذاكرة تقل",
        "بيخزن الصورة على الديسك",
        "بيغير عرض الـ widget على الشاشة",
        "بيحمّل الصورة مرتين",
      ],
      answer: 0,
      why: "<code>cacheWidth</code> بيأثر على مقاس الصورة المفكوكة في الذاكرة مش على عرض الـ widget. التخزين على الديسك بيحتاج حزمة زي cached_network_image.",
    },
    {
      q: "صفحة كبيرة فيها <code>setState</code> بتزود عداد صغير في الزرار، وكل الصفحة بتتبني. الحل الأنسب؟",
      options: [
        "تقفل الأنيميشن",
        "تحط <code>RepaintBoundary</code> حوالين الصفحة",
        "تنقل الـ state لـ widget صغير حوالين الزرار والنص، وتخلي الباقي <code>const</code>",
        "تستبدل الـ widgets بدوال",
      ],
      answer: 2,
      why: "الـ rebuild بيتبع مكان الـ <code>setState</code>. تصغير الـ widget اللي فيه الـ state هو الحل. الـ RepaintBoundary للرسم مش للـ rebuild، والدوال أسوأ.",
    },
  ],
};
