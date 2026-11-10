window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/fb"] = {
  boss: [
    {
      q: "اشرح الفرق بين Widget و Element و RenderObject. وإزاي Flutter بيقرر يحدّث widget ولا يبنيه من جديد؟",
      a: "الـ <b>Widget</b> وصف immutable خفيف بنبنيه في <code>build</code> ونرميه. الـ <b>Element</b> هو النسخة الحية: مكان الـ widget في الشجرة، بيعيش بين الـ rebuilds وماسك الـ <code>State</code> والـ <code>BuildContext</code>. الـ <b>RenderObject</b> هو اللي بيحسب الـ layout ويرسم، وهو التقيل. لما <code>build</code> يرجع widget جديد، الـ element بيقارنه بالقديم بـ <code>Widget.canUpdate</code>: لو نفس الـ <code>runtimeType</code> والـ <code>key</code> بيحدّث نفسه ويعيد استخدام الـ render object، غير كده بيشيل القديم ويبني جديد (والـ state بتضيع). ده سبب إن إعادة بناء الـ widgets رخيصة وسبب أهمية الـ keys.",
    },
    {
      q: "إيه معنى «constraints go down, sizes go up, parent sets position»؟ وإيه سبب خطأ «unbounded height» لما تحط <code>ListView</code> جوه <code>Column</code>؟",
      a: "الأب بيدّي الابن constraints (أقل وأكبر عرض وارتفاع)، والابن بيختار مقاسه جوه الحدود دي ويرجعه، والأب هو اللي يحدد مكانه. الـ <code>Column</code> بيدّي أولاده ارتفاع <b>غير محدود</b> على المحور الرئيسي، والـ <code>ListView</code> بيحاول ياخد كل الارتفاع المتاح فيطلع خطأ unbounded. الحل إني ألف الـ <code>ListView</code> في <code>Expanded</code> (أو <code>SizedBox</code> بارتفاع)، وأتجنب <code>shrinkWrap: true</code> مع القوايم الطويلة لأنه بيبني كل العناصر.",
    },
    {
      q: "إمتى تحتاج <code>Key</code>؟ وأنهي نوع تستخدم؟",
      a: "أحتاجه لما عناصر من نفس النوع (خصوصا فيها state) بتتحرك أو بتتمسح أو بتتبدل في قايمة، لأن Flutter بيطابق الـ elements بالموضع والنوع. من غير key لو مسحت العنصر الأول، الـ state بتاعته (checkbox مثلا) تفضل في العنصر التاني. بستخدم <code>ValueKey</code> بقيمة فريدة ثابتة زي id، و<code>ObjectKey</code> لو الكائن نفسه هو الهوية، و<code>GlobalKey</code> نادرا (مثل <code>Form</code>) لأنه تقيل. ومستخدمش index كـ key لو القايمة بتتغير ترتيبها.",
    },
    {
      q: "إزاي بتعمل التنقل في تطبيق كبير بـ go_router؟ وإيه الفرق بين <code>go</code> و<code>push</code>؟ وإزاي بتحمي صفحة لازم تسجيل دخول؟",
      a: "بعرّف الـ routes في <code>GoRouter</code> بمسارات زي <code>/property/:id</code> وباخد الـ id من <code>state.pathParameters</code>. <code>context.go('/path')</code> بيستبدل الـ stack كله بالمسار الجديد (زي فتح URL)، و<code>context.push</code> بيضيف صفحة فوق الحالية وترجع بـ <code>pop</code>. للحماية بستخدم <code>redirect</code> على الـ router: لو المستخدم مش مسجل ومسار مش public بيرجع <code>/login</code>، وبيتحدث لما حالة الـ auth تتغير بـ <code>refreshListenable</code>. وبنفس الآلية بتشتغل الـ deep links من الروابط والإشعارات.",
    },
    {
      q: "عندك شاشة بتجيب بيانات من API. إزاي بتبنيها صح؟ (الـ Future في build، الحالات، الأخطاء)",
      a: "الغلطة الكلاسيكية هي إني أنشئ الـ Future جوه <code>build</code> في <code>FutureBuilder</code>، فكل rebuild بيبعت طلب جديد. الصح إن الطلب يتبدأ مرة في <code>initState</code> أو في state management (Riverpod أو Bloc) والـ UI تقرا النتيجة. وبمثّل الحالات الأربعة صراحة: loading، error مع زرار retry، empty، data، وده بيتعمل سهل بـ <code>AsyncValue.when</code> في Riverpod. الطلب نفسه بيتكتب في repository بـ <code>dio</code>، بحول الـ JSON لموديل بـ <code>fromJson</code>، وأحول أخطاء الشبكة لرسائل مفهومة للمستخدم، وأعمل pagination وpull to refresh للقوايم.",
    },
    {
      q: "تطبيقك لازم يدعم العربي والإنجليزي ودارك مود. اشرح الإعداد والأخطاء المعتادة.",
      a: "للثيم بعرّف <code>theme</code> و<code>darkTheme</code> من <code>ColorScheme.fromSeed</code> (بـ <code>brightness</code> مختلف) و<code>themeMode</code> في <code>MaterialApp</code>، والـ widgets بتقرا الألوان والخطوط من <code>Theme.of(context)</code> مش قيم مكتوبة. للغات بستخدم <code>flutter_localizations</code> و<code>intl</code> وملفات ARB و<code>gen-l10n</code> فيتولد <code>AppLocalizations</code>، والـ plurals والـ placeholders بصيغة ICU، ولتغيير اللغة وقت التشغيل بخلي <code>locale</code> state. وللـ RTL، <code>Directionality</code> بتتظبط لوحدها، والأخطاء بتيجي من <code>left/right</code> الصريحة، فبستخدم <code>EdgeInsetsDirectional</code> و<code>AlignmentDirectional</code> و<code>start/end</code>، وبختبر كل شاشة بالعربي وبأكبر حجم خط.",
    },
    {
      q: "إزاي بتنظم تطبيق Flutter كبير؟ وإزاي بتخليه قابل للاختبار؟ وتختبر إيه الأول؟",
      a: "بقسمه لطبقات: UI ثم logic (view models/notifiers) ثم data (repositories و API/DB). الـ UI مبتكلمش الـ API مباشرة. الـ repository بيتعرف كـ <code>abstract class</code> وبيتحقن بـ DI (provider في Riverpod)، وبيحوّل الـ DTO لـ domain model. ده بيخلي الاختبار سهل: unit tests للـ logic بـ fake للـ repository، و widget tests للشاشات بـ <code>ProviderScope(overrides:)</code>، وعدد قليل من integration tests للرحلات الحرجة. وأبدأ بالأعلى قيمة والأرخص: الحسابات والـ validators والـ mappers، وأي bug بصلحه بكتبله regression test الأول.",
    },
    {
      q: "إيه الفرق بين implicit و explicit animations؟ وإمتى تستخدم CustomPainter؟",
      a: "الـ implicit زي <code>AnimatedContainer</code> و<code>AnimatedOpacity</code> و<code>TweenAnimationBuilder</code>: بغيّر القيمة والـ widget بيحرك الانتقال لوحده، من غير controller، وده اختياري الأول. الـ explicit بيحتاج <code>AnimationController</code> مع <code>vsync</code> (بإضافة <code>SingleTickerProviderStateMixin</code>) فأتحكم في play و reverse و repeat والأنيميشن المتتابع بـ <code>Interval</code>، ولازم أقفل الـ controller في <code>dispose</code>. أستخدم <code>CustomPainter</code> لما الشكل مش widget جاهز (دايرة تقدم، chart)، وأكتب <code>shouldRepaint</code> بدقة، وأحط <code>RepaintBoundary</code> لو الرسم بيتحرك والباقي ثابت.",
    },
    {
      q: "اشرح إزاي ظبطت push notifications بـ FCM في تطبيق حقيقي، وإزاي بتتعامل مع حالات التطبيق.",
      a: "عملت Firebase project وسجلت تطبيقات Android وiOS، وأضفت <code>firebase_core</code> و<code>firebase_messaging</code> (<code>flutterfire configure</code>). على iOS رفعت APNs authentication key في Firebase وفعلت capabilities (Push Notifications و Background Modes) في Xcode. في التطبيق بطلب الصلاحية (iOS وAndroid 13+)، وبجيب الـ token وببعته للـ backend مع المستخدم، وبسمع لتجديده، والسيرفر هو اللي بيبعت لـ FCM. في الـ foreground بسمع لـ <code>onMessage</code> وأعرض الإشعار بنفسي، في الـ background ألتقط الضغط بـ <code>onMessageOpenedApp</code>، وفي الـ terminated بنادي <code>getInitialMessage</code>، وأحول الـ data (مثلا id العقار) لمسار في go_router. الرسالة اللي فيها notification النظام بيعرضها، والـ data-only كودي اللي بيتحكم فيها.",
    },
    {
      q: "اشرح خطوات نشر تطبيق على Google Play وعلى App Store/TestFlight. وإزاي بتفصل dev عن prod؟",
      a: "على Android: بعمل keystore (مبرفعوش على git) و<code>key.properties</code> وأربط الـ signing في Gradle، وأزود <code>version: 1.4.0+23</code> في pubspec (الرقم بعد + هو versionCode ولازم يزيد)، وببني <code>flutter build appbundle --release</code> وأرفع الـ aab لـ Play Console. على iOS: Bundle ID وsigning في Xcode (شهادة Distribution وprovisioning profile، غالبا تلقائي)، وببني <code>flutter build ipa</code> أو Archive، وأرفعه لـ App Store Connect فيظهر في TestFlight، وبعد التجربة أقدمه للمراجعة. للبيئات بستخدم <code>--dart-define</code> لقيم زي رابط الـ API، وflavors لو محتاج تطبيقات منفصلة بـ applicationId وFirebase مختلفين. وبفعل obfuscation مع <code>--split-debug-info</code> وبحتفظ بالـ symbols، وCI بيشغل analyze والاختبارات.",
    },
    {
      q: "اكتب widget لمربع بحث: فيه <code>TextEditingController</code> وبينادي <code>onSearch</code> بعد ما المستخدم يوقف كتابة 400ms (debounce)، مع التنظيف الصح.",
      a: `<p>الفكرة: الـ controller والـ Timer بيتفتحوا في الـ State ولازم يتقفلوا في <code>dispose</code>. وكل كتابة بتلغي الـ Timer القديم وتبدأ واحد جديد.</p><pre dir='ltr'><code>import 'dart:async';
import 'package:flutter/material.dart';

class SearchBox extends StatefulWidget {
  const SearchBox({super.key, required this.onSearch});

  final ValueChanged&lt;String&gt; onSearch;

  @override
  State&lt;SearchBox&gt; createState() =&gt; _SearchBoxState();
}

class _SearchBoxState extends State&lt;SearchBox&gt; {
  final _controller = TextEditingController();
  Timer? _debounce;

  void _onChanged(String text) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), () {
      widget.onSearch(text.trim());
    });
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _controller,
      onChanged: _onChanged,
      decoration: const InputDecoration(prefixIcon: Icon(Icons.search)),
    );
  }
}</code></pre><p>لو من غير <code>_debounce?.cancel()</code> في dispose، الـ Timer ممكن يشتغل بعد ما الشاشة تتقفل وينادي <code>onSearch</code> على widget مات.</p>`,
    },
    {
      q: "اكتب Riverpod <code>AsyncNotifier</code> بيحمّل قايمة عقارات من repository ويعرض حالات loading و error و data في الـ UI، وفيه دالة refresh.",
      a: `<p>الـ <code>build</code> بترجع <code>Future</code> (التحميل الأول)، والـ repository بيتقرا من provider فيتبدل في الاختبار، و<code>AsyncValue.guard</code> بيحول الاستثناء لـ <code>AsyncError</code>.</p><pre dir='ltr'><code>import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

abstract class PropertyRepository {
  Future&lt;List&lt;String&gt;&gt; fetch();
}

final propertyRepositoryProvider = Provider&lt;PropertyRepository&gt;((ref) {
  throw UnimplementedError('override in main');
});

class PropertiesNotifier extends AsyncNotifier&lt;List&lt;String&gt;&gt; {
  @override
  Future&lt;List&lt;String&gt;&gt; build() {
    return ref.watch(propertyRepositoryProvider).fetch();
  }

  Future&lt;void&gt; refresh() async {
    final repo = ref.read(propertyRepositoryProvider);
    state = const AsyncLoading();
    state = await AsyncValue.guard(repo.fetch);
  }
}

final propertiesProvider =
    AsyncNotifierProvider&lt;PropertiesNotifier, List&lt;String&gt;&gt;(
  PropertiesNotifier.new,
);

class PropertiesView extends ConsumerWidget {
  const PropertiesView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final properties = ref.watch(propertiesProvider);
    return properties.when(
      loading: () =&gt; const Center(child: CircularProgressIndicator()),
      error: (e, st) =&gt; Center(child: Text('Error: $e')),
      data: (items) =&gt; ListView(
        children: [for (final p in items) ListTile(title: Text(p))],
      ),
    );
  }
}</code></pre><p>في <code>build</code> بستخدم <code>watch</code>، وفي الدوال <code>read</code>. وفي الاختبار بعمل override لـ <code>propertyRepositoryProvider</code> بـ fake.</p>`,
    },
    {
      q: "اكتب قايمة بـ <code>ListView.builder</code> فيها pull to refresh.",
      a: `<p>الـ <code>RefreshIndicator</code> محتاج <code>onRefresh</code> ترجع <code>Future</code> (الدايرة بتفضل لحد ما يخلص). و<code>AlwaysScrollableScrollPhysics</code> مهمة عشان السحب يشتغل حتى لو القايمة قصيرة.</p><pre dir='ltr'><code>import 'package:flutter/material.dart';

class RefreshableList extends StatelessWidget {
  const RefreshableList({
    super.key,
    required this.items,
    required this.onRefresh,
  });

  final List&lt;String&gt; items;
  final Future&lt;void&gt; Function() onRefresh;

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: onRefresh,
      child: ListView.builder(
        physics: const AlwaysScrollableScrollPhysics(),
        itemCount: items.length,
        itemBuilder: (context, index) {
          final item = items[index];
          return ListTile(key: ValueKey(item), title: Text(item));
        },
      ),
    );
  }
}</code></pre><p>الـ builder بيبني العناصر الظاهرة بس (lazy)، وفيه key ثابت لكل عنصر. ولو القايمة جاية من Riverpod فالـ <code>onRefresh</code> هي <code>() =&gt; ref.refresh(provider.future)</code>.</p>`,
    },
    {
      q: "سيناريو: شاشة قايمة بتتقطع (jank) لما تعمل scroll. إزاي تشخّص وتصلّح؟",
      a: "أول حاجة مبخمنش: بشغل التطبيق في <b>profile mode على جهاز حقيقي</b> (الـ debug بطيء مصطنع) وأفتح DevTools Performance وأشوف الـ frame chart. لو الأعمدة الحمرا في جزء الـ UI يبقى كودي: بفتح الـ CPU profiler وأدور على شغل تقيل في <code>build</code> (sort أو filter أو parse) وأنقله برا build أو في isolate (<code>Isolate.run</code>)، وأتأكد إن القايمة <code>ListView.builder</code> مش <code>Column</code> جوه scroll، ومفيش rebuilds زيادة (عداد الـ rebuilds، و<code>const</code>، و<code>select</code>). لو الـ Raster هو الأحمر يبقى الرسم: صور كبيرة من غير <code>cacheWidth</code>، أو <code>Opacity</code> و<code>ClipRRect</code> وظلال تقيلة في كل عنصر، فأبدلها وأستخدم <code>RepaintBoundary</code> لو يفيد. وبعد كل تعديل أقيس تاني عشان أتأكد إن فيه تحسن فعلي.",
    },
    {
      q: "سيناريو: بيظهر خطأ «setState() called after dispose()» في اللوج. إيه اللي بيحصل وإزاي تصلحه؟",
      a: "معناه إن State اتقفلت (الشاشة اتشالت من الشجرة) وبعدها حاجة ناديت منها <code>setState</code>، غالبا callback متأخر: <code>await</code> لطلب شبكة خلص بعد ما المستخدم خرج، أو <code>Timer</code> أو <code>StreamSubscription</code> لسه شغالين. الحل على مستويين. الأول أقفل كل حاجة بدأتها: <code>cancel</code> للـ Timer والـ subscription و<code>dispose</code> للـ controllers في <code>dispose()</code>. التاني أحمي الكود بعد الـ await بـ <code>if (!mounted) return;</code> قبل <code>setState</code> أو استخدام الـ context. والحل الأعمق إني أنقل الـ async logic لـ state management (Riverpod أو Bloc) فالـ UI بتسمع بس ومفيهاش callbacks معلقة.",
    },
    {
      q: "سيناريو: هتبدأ تطبيق جديد من الصفر. تختار أنهي state management؟ ودافع عن اختيارك.",
      a: "الإجابة الأمينة: ملهاش إجابة واحدة، بتتوقف على الفريق وحجم التطبيق. <code>setState</code> و<code>ValueNotifier</code> كفاية للـ state المحلية لشاشة واحدة (فورم، تبويب). لتطبيق متوسط أو كبير فيه API وcache وauth، أنا بختار <b>Riverpod</b>: الـ providers global ثابتة ومتحققة وقت الكومبايل، ومفيش اعتماد على الـ BuildContext، و<code>AsyncValue</code> بتمثل loading/error/data، والـ DI والاختبار بـ overrides سهل. <b>Bloc/Cubit</b> اختيار ممتاز لو الفريق كبير ومحتاجين تدفق events صريح وقابل للتتبع، بس بياخد boilerplate أكتر. <b>Provider</b> أبسط لكنه أقدم وحدوده في الـ context. وأيا كان الاختيار، الأهم الفصل الواضح بين UI و logic و data والـ repository abstract، فنقدر نغير الأداة من غير ما نعيد كتابة التطبيق.",
    },
  ],
};
