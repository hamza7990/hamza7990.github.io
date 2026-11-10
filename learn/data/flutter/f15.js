window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f15"] = {
  slides: [
    {
      kicker: "الخريطة",
      title: "إمتى implicit وإمتى explicit؟",
      en: "Implicit vs explicit animations",
      body: "<p>الأنيميشن في Flutter مش حاجة واحدة، هي <b>تلات مستويات</b> وبتختار الأبسط اللي يكفي:</p>",
      terms: [
        ["Implicit animation", "أنيميشن ضمني", "widgets اسمها <code>AnimatedXxx</code> (و<code>TweenAnimationBuilder</code>). انت بس بتغيّر القيمة والـ widget بيتحرك من القديمة للجديدة لوحده. مفيش controller."],
        ["Explicit animation", "أنيميشن صريح", "انت بتعمل <code>AnimationController</code> وبتتحكم: play و reverse و repeat. بتحتاجه لو الحركة بتتكرر أو مرتبطة بأكتر من حاجة أو محتاج تتحكم فيها."],
        ["Custom painting", "رسم مخصص", "<code>CustomPaint</code> لما الشكل نفسه مش widget جاهز (دايرة تقدم، chart)."],
      ],
      points: [
        "لو عايز «لما القيمة دي تتغير، اتحرك للجديدة»: <b>implicit</b>. ده 80% من الحالات.",
        "لو عايز «شغّل وقف كرر اعكس» أو أنيميشن متتابع: <b>explicit</b>.",
        "كل حاجة بتتحرك بتعمل rebuild كل frame (60 مرة في الثانية)، فبنحصر الحركة في أصغر widget ممكن.",
      ],
      interview: [
        { q: "إيه الفرق بين implicit و explicit animations؟ وإمتى كل واحد؟", a: "الـ implicit زي <code>AnimatedContainer</code> و<code>AnimatedOpacity</code> و<code>TweenAnimationBuilder</code>: بغيّر الخاصية في <code>setState</code> والـ widget بيحرك الانتقال لوحده بـ duration و curve، من غير controller، فبستخدمه لأي انتقال بين حالتين. الـ explicit بعمل فيه <code>AnimationController</code> بإيدي (مع vsync) وبتحكم في play و reverse و repeat، وبستخدمه لحركة متكررة أو متتابعة أو مربوطة بـ gesture. البدء دايما بالـ implicit، وأنزل للـ explicit لما أحتاج تحكم." },
      ],
    },
    {
      title: "الـ Implicit: AnimatedContainer و AnimatedOpacity",
      en: "AnimatedContainer, AnimatedOpacity, AnimatedSize",
      body: "<p>الفكرة: بدل <code>Container</code> استخدم <code>AnimatedContainer</code> وادّيله <code>duration</code>. أي خاصية فيه تتغير بين build و build (الارتفاع، اللون، الـ radius) بتتحرك بنعومة. نفس الكلام مع <code>AnimatedOpacity</code> و<code>AnimatedAlign</code> و<code>AnimatedPadding</code> و<code>AnimatedRotation</code>.</p>",
      code: {
        lang: "dart",
        title: "expandable_card.dart",
        src: `class ExpandableCard extends StatefulWidget {
  const ExpandableCard({super.key});

  @override
  State<ExpandableCard> createState() => _ExpandableCardState();
}

class _ExpandableCardState extends State<ExpandableCard> {
  bool _open = false;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Column(
      children: [
        AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
          height: _open ? 160 : 80,
          decoration: BoxDecoration(
            color: _open ? scheme.primaryContainer : scheme.surfaceContainer,
            borderRadius: BorderRadius.circular(_open ? 24 : 8),
          ),
        ),
        AnimatedOpacity(
          opacity: _open ? 1 : 0,
          duration: const Duration(milliseconds: 300),
          child: const Text('Details'),
        ),
        TextButton(
          onPressed: () => setState(() => _open = !_open),
          child: const Text('Toggle'),
        ),
      ],
    );
  }
}`,
        note: "مفيش controller ولا dispose. الـ <code>setState</code> بيغيّر <code>_open</code> والـ widgets بتتحرك من القيمة القديمة للجديدة. جرّب <code>AnimatedSize</code> لو عايز حجم الـ child نفسه يتحرك لما يتغير محتواه.",
      },
      pitfall: "نسيان الـ <code>duration</code> (إجباري) مش الغلطة، الغلطة هي إنك تبدّل widget بتاني <b>من نوع مختلف</b> وتستنى انتقال: <code>AnimatedContainer</code> بتحرك الخصائص بس. لو الـ child نفسه بيتبدل، محتاج <code>AnimatedSwitcher</code>.",
    },
    {
      title: "AnimatedSwitcher و TweenAnimationBuilder",
      en: "AnimatedSwitcher and TweenAnimationBuilder",
      body: "<p><code>AnimatedSwitcher</code> بيعمل انتقال (fade افتراضي) بين child قديم وجديد. هو بيعرف إن child اتبدل من الـ <b>key</b> أو النوع، فلو الاتنين نفس النوع (Text و Text) لازم تدّيهم <code>key</code> مختلف. و<code>TweenAnimationBuilder</code> بيحرك أي قيمة (رقم، لون، Offset) من begin لـ end من غير controller، وكل ما الـ end يتغير بيكمل من المكان الحالي.</p>",
      codes: [
        {
          lang: "dart",
          title: "AnimatedSwitcher",
          src: `AnimatedSwitcher(
  duration: const Duration(milliseconds: 250),
  transitionBuilder: (child, animation) {
    return ScaleTransition(scale: animation, child: child);
  },
  child: Text(
    '$count',
    key: ValueKey(count),
    style: Theme.of(context).textTheme.headlineMedium,
  ),
)`,
          note: "من غير <code>ValueKey(count)</code> الـ Text القديم والجديد يعتبروا نفس الـ widget ومفيش انتقال.",
        },
        {
          lang: "dart",
          title: "TweenAnimationBuilder",
          src: `TweenAnimationBuilder<double>(
  tween: Tween<double>(begin: 0, end: value),
  duration: const Duration(milliseconds: 600),
  curve: Curves.easeOutCubic,
  builder: (context, animated, child) {
    return Text(animated.toStringAsFixed(0));
  },
)`,
          note: "عداد بيعد من القيمة السابقة للجديدة لما <code>value</code> يتغير. الـ <code>child</code> parameter ينفع تحط فيه جزء ثابت ميتبنيش كل frame.",
        },
      ],
      interview: [
        { q: "ليه AnimatedSwitcher مبيحركش لما أبدّل Text بـ Text؟", a: "لأنه بيحدد إن الـ child اتغير بمقارنة النوع والـ <code>key</code> (نفس مبدأ <code>Widget.canUpdate</code>). لو الاتنين <code>Text</code> من غير key، يعتبرهم نفس الـ widget اتحدثت خصائصه فمفيش انتقال. الحل إني أدّي كل واحد <code>ValueKey</code> بالقيمة اللي بتميزه." },
      ],
    },
    {
      title: "الـ Explicit: AnimationController",
      en: "AnimationController, vsync, SingleTickerProviderStateMixin",
      body: "<p>الـ <code>AnimationController</code> هو اللي بيطلّع رقم من 0 لـ 1 على مدة <code>duration</code>. محتاج <code>vsync</code>: كائن <code>TickerProvider</code> بيربط الأنيميشن بإشارة الـ frame من الشاشة فيتحدث مرة كل frame ويقف لما الشاشة مش ظاهرة. بنحصل عليه بإننا نضيف <code>SingleTickerProviderStateMixin</code> للـ State ونكتب <code>vsync: this</code>.</p><p>وبعدين بنربطه بالواجهة بـ <code>AnimatedBuilder</code>: بيعيد بناء الجزء اللي جواه بس مع كل tick.</p>",
      code: {
        lang: "dart",
        title: "spinner.dart",
        src: `class Spinner extends StatefulWidget {
  const Spinner({super.key});

  @override
  State<Spinner> createState() => _SpinnerState();
}

class _SpinnerState extends State<Spinner>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 2),
  )..repeat();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      child: const Icon(Icons.sync, size: 48),
      builder: (context, child) {
        return Transform.rotate(
          angle: _controller.value * 2 * 3.14159,
          child: child,
        );
      },
    );
  }
}`,
        note: "<code>child</code> بيتبني مرة واحدة والـ builder بيلفه بس. الـ <code>dispose</code> إجباري: من غيره الـ ticker يفضل شغال والتطبيق يرمي خطأ.",
      },
      pitfall: "نسيان <code>_controller.dispose()</code>. الـ controller بيحجز ticker، ولو الـ State اتقفلت وهو شغال بتاخد خطأ «Ticker was active when disposed» وبيحصل leak. وكمان لو عندك أكتر من controller في نفس الـ State استخدم <code>TickerProviderStateMixin</code> (من غير Single).",
      interview: [
        { q: "إيه هو <code>vsync</code> ولازمته إيه؟ وليه SingleTickerProviderStateMixin؟", a: "الـ <code>vsync</code> هو <code>TickerProvider</code> اللي بيدّي الـ controller ticker بيشتغل مع كل frame من الشاشة، فالأنيميشن بيتزامن مع الـ refresh rate وبيقف لما الشاشة مش ظاهرة فمبيصرفش بطارية. بنحط <code>SingleTickerProviderStateMixin</code> على الـ State وبنكتب <code>vsync: this</code>. لو عندي أكتر من controller بستخدم <code>TickerProviderStateMixin</code>. وبقفل الـ controller في <code>dispose</code> عشان ميعملش leak." },
        { q: "ليه AnimatedBuilder وفيه <code>child</code> parameter؟", a: "<code>AnimatedBuilder</code> بيعيد بناء الـ builder مع كل tick من الأنيميشن. الجزء اللي مبيتغيرش (الأيقونة مثلا) بحطه في <code>child</code> فبيتبني مرة واحدة ويتمرر للـ builder بدل ما يتبني 60 مرة في الثانية. ده تحسين أداء بسيط وعملي." },
      ],
    },
    {
      title: "Tween و CurvedAnimation والـ Curves",
      en: "Tween, CurvedAnimation, Curves and durations",
      body: "<p>الـ controller بيطلّع 0..1 بس. الـ <code>Tween</code> بيحول الرقم ده لنطاق تاني (من Offset لـ Offset، من لون للون). و<code>CurvedAnimation</code> بيغيّر <b>إيقاع</b> الحركة (تبدأ بطيء وتخلص سريع...) بـ <code>Curve</code>. والـ widgets الجاهزة زي <code>FadeTransition</code> و<code>SlideTransition</code> و<code>ScaleTransition</code> و<code>RotationTransition</code> بتاخد Animation مباشرة، فمحتاجش AnimatedBuilder.</p>",
      code: {
        lang: "dart",
        title: "slide_in.dart",
        src: `class SlideIn extends StatefulWidget {
  const SlideIn({super.key, required this.child});

  final Widget child;

  @override
  State<SlideIn> createState() => _SlideInState();
}

class _SlideInState extends State<SlideIn>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 400),
  );

  late final Animation<Offset> _offset = Tween<Offset>(
    begin: const Offset(0, 0.3),
    end: Offset.zero,
  ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));

  @override
  void initState() {
    super.initState();
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SlideTransition(
      position: _offset,
      child: FadeTransition(opacity: _controller, child: widget.child),
    );
  }
}`,
        note: "<code>forward()</code> يشغّل، <code>reverse()</code> يعكس، <code>repeat(reverse: true)</code> يروح ويجي، <code>stop()</code> يوقف. الـ <code>Offset(0, 0.3)</code> معناه 30% من ارتفاع الـ child لتحت.",
      },
      points: [
        "<b>Curves شائعة:</b> <code>easeOut</code> (دخول عنصر)، <code>easeIn</code> (خروج)، <code>easeInOut</code> (تحرك بين مكانين)، <code>bounceOut</code> و<code>elasticOut</code> (للمرح بس).",
        "<b>Durations:</b> 150 لـ 300ms للانتقالات الصغيرة، 300 لـ 500ms للانتقالات الكبيرة. أطول من نص ثانية بتحسسه بطيء.",
      ],
    },
    {
      title: "Hero وانتقالات الصفحات",
      en: "Hero and page transitions",
      body: "<p><code>Hero</code> بيطيّر widget من صفحة لصفحة: حط نفس الـ <code>tag</code> على widget في الصفحة الأولى وwidget في الصفحة التانية، والـ Navigator بيحرك الأول لمكان التاني أثناء الانتقال. أما انتقال الصفحة نفسها فبتغيره بـ <code>PageRouteBuilder</code> (أو <code>CustomTransitionPage</code> لو بتستخدم go_router).</p>",
      codes: [
        {
          lang: "dart",
          title: "Hero",
          src: `class PropertyTile extends StatelessWidget {
  const PropertyTile({super.key, required this.id});

  final int id;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.of(context).push(
        MaterialPageRoute<void>(builder: (_) => DetailsPage(id: id)),
      ),
      child: Hero(
        tag: 'property-$id',
        child: Container(width: 80, height: 80, color: Colors.teal),
      ),
    );
  }
}

class DetailsPage extends StatelessWidget {
  const DetailsPage({super.key, required this.id});

  final int id;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Hero(
        tag: 'property-$id',
        child: Container(height: 240, color: Colors.teal),
      ),
    );
  }
}`,
          note: "الـ <code>tag</code> لازم يكون <b>فريد</b> ومتطابق في الصفحتين. لو اتكرر في نفس الصفحة بتاخد خطأ «multiple heroes share the same tag».",
        },
        {
          lang: "dart",
          title: "انتقال صفحة مخصص",
          src: `Route<void> fadeRoute(Widget page) {
  return PageRouteBuilder<void>(
    transitionDuration: const Duration(milliseconds: 250),
    pageBuilder: (context, animation, secondary) => page,
    transitionsBuilder: (context, animation, secondary, child) {
      return FadeTransition(opacity: animation, child: child);
    },
  );
}`,
          note: "في go_router: <code>CustomTransitionPage(key: state.pageKey, child: page, transitionsBuilder: ...)</code> جوه <code>pageBuilder</code> بتاع الـ route.",
        },
      ],
      interview: [
        { q: "إزاي بيشتغل الـ Hero؟", a: "بحط widget عليه <code>Hero(tag: x)</code> في الصفحة الأولى، وفي الصفحة التانية widget عليه <code>Hero</code> بنفس الـ tag. لما الـ Navigator يعمل push، بيلاقي الـ heroes المتطابقة في الـ tag، وبيطيّر الأول فوق الـ overlay لحد مكان التاني ومقاسه خلال مدة الانتقال. الـ tag لازم يكون فريد في الصفحة الواحدة، وبيشتغل مع <code>pop</code> برضه بالعكس." },
      ],
    },
    {
      title: "المتتابع (Staggered) واختيار الأداة",
      en: "Staggered animations and choosing the tool",
      body: "<p>الـ staggered معناها عناصر بتتحرك <b>بالتتابع</b> (العنوان يظهر الأول، وبعده الصورة، وبعده الزراير). مفيش widget جاهز: بتستخدم <b>controller واحد</b> وكل عنصر ليه Animation مربوطة بجزء من الوقت عن طريق <code>Interval(start, end)</code> (قيم من 0 لـ 1).</p>",
      code: {
        lang: "dart",
        title: "staggered.dart",
        src: `class StaggerAnimations {
  StaggerAnimations(AnimationController controller)
      : title = CurvedAnimation(
          parent: controller,
          curve: const Interval(0.0, 0.5, curve: Curves.easeOut),
        ),
        button = CurvedAnimation(
          parent: controller,
          curve: const Interval(0.4, 1.0, curve: Curves.easeOut),
        );

  final Animation<double> title;
  final Animation<double> button;
}
// title:  FadeTransition(opacity: anims.title, ...)
// button: FadeTransition(opacity: anims.button, ...)`,
        note: "الـ title بيتحرك في أول نص المدة، والزرار يبدأ عند 40% ويخلص مع النهاية. controller واحد، فتحكم واحد (play, reverse).",
      },
      points: [
        "<b>قرار سريع:</b> انتقال بين حالتين؟ <code>AnimatedXxx</code>. قيمة رقم/لون بتتحرك؟ <code>TweenAnimationBuilder</code>. تكرار أو تحكم أو تتابع؟ <code>AnimationController</code>. شكل مخصص؟ <code>CustomPainter</code>. أنيميشن ديزاينر جاهز؟ Lottie أو Rive.",
        "لو الحركة معقدة أوي (شخصيات، تأثيرات) متكتبهاش بإيدك: ملف Lottie أو Rive أسرع وأحسن.",
      ],
    },
    {
      title: "CustomPaint و CustomPainter",
      en: "Canvas, Paint, a progress ring",
      body: "<p>لما الشكل مش widget جاهز، بترسمه بنفسك. <code>CustomPaint</code> widget بياخد <code>painter</code>، وانت بتكتب كلاس يرث <code>CustomPainter</code> وتنفذ دالة <code>paint(Canvas canvas, Size size)</code>. الـ <code>Canvas</code> فيه أوامر الرسم (<code>drawCircle</code> و<code>drawArc</code> و<code>drawLine</code> و<code>drawPath</code>) وكل أمر بياخد <code>Paint</code> بيحدد اللون والسمك ونوع الرسم (fill ولا stroke).</p>",
      code: {
        lang: "dart",
        title: "progress_ring.dart",
        src: `import 'dart:math';
import 'package:flutter/material.dart';

class ProgressRingPainter extends CustomPainter {
  ProgressRingPainter({
    required this.progress,
    required this.color,
    required this.trackColor,
  });

  final double progress; // 0.0 to 1.0
  final Color color;
  final Color trackColor;

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final radius = size.shortestSide / 2 - 6;
    final rect = Rect.fromCircle(center: center, radius: radius);

    final track = Paint()
      ..color = trackColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 12;
    canvas.drawCircle(center, radius, track);

    final arc = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 12
      ..strokeCap = StrokeCap.round;
    canvas.drawArc(rect, -pi / 2, 2 * pi * progress, false, arc);
  }

  @override
  bool shouldRepaint(ProgressRingPainter old) {
    return old.progress != progress ||
        old.color != color ||
        old.trackColor != trackColor;
  }
}

// usage
// CustomPaint(
//   size: const Size.square(120),
//   painter: ProgressRingPainter(
//     progress: 0.7, color: Colors.blue, trackColor: Colors.grey),
// )`,
        note: "الزاوية بالـ radians: البداية <code>-pi / 2</code> (الساعة 12) والمسح <code>2 * pi * progress</code>. و<code>shouldRepaint</code> بتقول للـ framework إمتى يرسم تاني.",
      },
      pitfall: "كتابة <code>shouldRepaint</code> بتاعت <code>return true</code> دايما: بيرسم كل frame حتى لو مفيش حاجة اتغيرت. وكتابتها <code>return false</code> وفيه حقل اتغير: الرسم القديم يفضل ظاهر. قارن الحقول اللي بيعتمد عليها الرسم بالظبط.",
      interview: [
        { q: "إزاي بترسم دايرة تقدم مخصصة؟ وإيه شغلة <code>shouldRepaint</code>؟", a: "بكتب كلاس يرث <code>CustomPainter</code> وفي <code>paint(canvas, size)</code> برسم الدايرة الرمادية بـ <code>drawCircle</code> بـ <code>Paint</code> نوعه stroke، وبعدين القوس الملون بـ <code>drawArc</code> بزاوية بداية <code>-pi/2</code> ومسح <code>2*pi*progress</code>. وبحط الـ painter في <code>CustomPaint</code>. و<code>shouldRepaint(oldDelegate)</code> الـ framework بينادي عليها لما الـ widget يتبني من جديد عشان يعرف هل يرسم تاني، فبقارن الحقول (progress واللون) وبرجع true لو اتغير أي حاجة بس." },
      ],
    },
    {
      title: "Chart بسيط و RepaintBoundary",
      en: "A simple bar chart and RepaintBoundary",
      body: "<p>نفس الفكرة لأي chart: احسب مقياس (أكبر قيمة = أعلى ارتفاع) وارسم مستطيل لكل قيمة. والـ <code>RepaintBoundary</code> بيعزل الرسم في layer مستقل: لو حاجة تانية في الشاشة بتتحرك كل frame، الـ chart مش هيتعاد رسمه معاها، والعكس.</p>",
      code: {
        lang: "dart",
        title: "bar_chart.dart",
        src: `import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class BarChartPainter extends CustomPainter {
  const BarChartPainter({required this.values, required this.color});

  final List<double> values;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    if (values.isEmpty) return;
    final maxValue = values.reduce(max);
    final slot = size.width / values.length;
    final paint = Paint()..color = color;

    for (var i = 0; i < values.length; i++) {
      final h = size.height * values[i] / maxValue;
      final rect = Rect.fromLTWH(
        i * slot + slot * 0.15,
        size.height - h,
        slot * 0.7,
        h,
      );
      canvas.drawRRect(
        RRect.fromRectAndRadius(rect, const Radius.circular(4)),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(BarChartPainter old) {
    return !listEquals(old.values, values) || old.color != color;
  }
}

class BarChart extends StatelessWidget {
  const BarChart({super.key, required this.values});

  final List<double> values;

  @override
  Widget build(BuildContext context) {
    return RepaintBoundary(
      child: CustomPaint(
        size: const Size(double.infinity, 160),
        painter: BarChartPainter(
          values: values,
          color: Theme.of(context).colorScheme.primary,
        ),
      ),
    );
  }
}`,
        note: "الـ <code>shouldRepaint</code> بتقارن محتوى الـ list بـ <code>listEquals</code> مش المرجع. اللون من الثيم عشان الـ dark mode يشتغل.",
      },
      interview: [
        { q: "إيه هو <code>RepaintBoundary</code> وإمتى تستخدمه؟", a: "بيعمل layer رسم مستقل لجزء من الشجرة، فلما حاجة بره الجزء ده تتعاد رسمها (أو هو نفسه) الجزء التاني مش بيتعاد رسمه. بستخدمه حوالين حاجة بتتحرك باستمرار (أنيميشن، chart) أو حاجة تقيلة في الرسم وجنبها أجزاء بتتحدث كتير. مش بحطه في كل مكان لأن كل layer ليه تكلفة ذاكرة، وببص على <b>Highlight repaints</b> في DevTools قبل ما أقرر." },
      ],
    },
    {
      title: "Lottie و Rive وأخطاء الأنيميشن",
      en: "Lottie, Rive and common animation mistakes",
      body: "<p>الأنيميشن المعقد اللي المصمم بيعمله (أيقونات متحركة، onboarding، تأثيرات احتفال) مش بنكتبه بالكود: حزمة <code>lottie</code> بتشغل ملفات JSON من After Effects، وحزمة <code>rive</code> بتشغل ملفات Rive التفاعلية. دي حزم خارجية، تضيفها بـ <code>flutter pub add</code> وتقرا توثيقها لإنها بتتحدث.</p>",
      points: [
        "<b>dispose:</b> كل <code>AnimationController</code> لازم يتقفل. نفس القاعدة بتاعة الـ <code>TextEditingController</code>.",
        "<b>setState مع كل tick:</b> متعملش <code>controller.addListener(() => setState(() {}))</code> على widget كبير. استخدم <code>AnimatedBuilder</code> عشان يتبني الجزء المتحرك بس.",
        "<b>ابدأ بالأبسط:</b> لو <code>AnimatedContainer</code> بيحل المشكلة، متعملش controller.",
        "<b>احترم المستخدم:</b> لو الإعدادات فيها «تقليل الحركة» (<code>MediaQuery.disableAnimationsOf(context)</code>) قلل أو اقفل الأنيميشن الزيادة.",
        "أنيميشن في قايمة طويلة أو شاشة تقيلة: اتأكد من DevTools إنه مش بيسقط frames (المستوى الجاي).",
      ],
      interview: [
        { q: "عملت AnimationController وبعد ما خرجت من الشاشة ظهرلك خطأ ticker. إيه السبب والحل؟", a: "السبب إني معملتش <code>dispose</code> للـ controller، فالـ State اتقفلت والـ ticker لسه شغال. الحل إني أكتب <code>_controller.dispose()</code> في <code>dispose()</code> قبل <code>super.dispose()</code>. ولو الأنيميشن مجرد انتقال بسيط كنت أستخدم implicit animation وأتفادى المشكلة من الأساس." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: AnimatedContainer",
      lang: "dart",
      code: `AnimatedContainer(
  duration: const Duration(milliseconds: 300),
  curve: Curves.easeOut,
  width: selected ? 200 : 100,
  height: 56,
  decoration: BoxDecoration(
    color: selected ? Colors.blue : Colors.grey,
    borderRadius: BorderRadius.circular(selected ? 28 : 8),
  ),
)`,
      note: "اتأكد إن <code>selected</code> متغير في الـ State والتغيير جوه <code>setState</code>.",
    },
    {
      title: "اكتب: controller مع dispose",
      lang: "dart",
      code: `class _PulseState extends State<Pulse>
    with SingleTickerProviderStateMixin {
  late final _controller = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 1),
  )..repeat(reverse: true);

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(scale: _controller, child: widget.child);
  }
}`,
      note: "الشكل ده بتكتبه في أي State فيها أنيميشن: controller بـ <code>vsync: this</code> ثم <code>dispose</code>.",
    },
    {
      title: "اكتب: CustomPainter",
      lang: "dart",
      code: `class DotPainter extends CustomPainter {
  const DotPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color;
    canvas.drawCircle(size.center(Offset.zero), 8, paint);
  }

  @override
  bool shouldRepaint(DotPainter old) => old.color != color;
}`,
    },
  ],

  tasks: [
    {
      title: "Panel بيتفتح ويتقفل بأنيميشن",
      lang: "dart",
      prompt: "<p>اكتب <code>ExpandablePanel</code> (<code>StatefulWidget</code>) بياخد <code>title</code> و<code>child</code>. عبارة عن <code>Card</code> فيه <code>ListTile</code> بالعنوان وأيقونة <code>Icons.expand_more</code> في الـ <code>trailing</code> بتلف نص لفة (<code>AnimatedRotation</code>) لما يتفتح. تحت الـ ListTile الـ <code>child</code> بيظهر بـ <code>AnimatedSize</code> (مدة 250ms) لما <code>_open</code> بـ true، ولما يتقفل يبقى <code>SizedBox</code> عرضه <code>double.infinity</code> وارتفاعه 0. الضغط على الـ ListTile يقلب الحالة.</p>",
      hints: [
        "<code>AnimatedRotation(turns: _open ? 0.5 : 0, duration: ..., child: Icon(...))</code>: الدوران بوحدة اللفّة، يعني 0.5 = 180 درجة.",
        "<code>AnimatedSize</code> بيحرك حجمه لما الـ child يتبدل من widget لـ widget تاني بحجم مختلف. حط <code>alignment: Alignment.topCenter</code>.",
      ],
      solution: `import 'package:flutter/material.dart';

class ExpandablePanel extends StatefulWidget {
  const ExpandablePanel({
    super.key,
    required this.title,
    required this.child,
  });

  final String title;
  final Widget child;

  @override
  State<ExpandablePanel> createState() => _ExpandablePanelState();
}

class _ExpandablePanelState extends State<ExpandablePanel> {
  bool _open = false;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        children: [
          ListTile(
            title: Text(widget.title),
            trailing: AnimatedRotation(
              turns: _open ? 0.5 : 0,
              duration: const Duration(milliseconds: 250),
              child: const Icon(Icons.expand_more),
            ),
            onTap: () => setState(() => _open = !_open),
          ),
          AnimatedSize(
            duration: const Duration(milliseconds: 250),
            alignment: Alignment.topCenter,
            child: _open
                ? Padding(
                    padding: const EdgeInsets.all(16),
                    child: widget.child,
                  )
                : const SizedBox(width: double.infinity, height: 0),
          ),
        ],
      ),
    );
  }
}`,
      explain: "كله implicit: مفيش controller ولا dispose. الأيقونة بتتحرك بـ <code>AnimatedRotation</code> والمحتوى بـ <code>AnimatedSize</code>. الـ State فيها <code>bool</code> واحد بس، وده الأسلوب الصح لأي انتقال بين حالتين.",
    },
    {
      title: "دخول بـ fade و slide متتابع",
      lang: "dart",
      prompt: "<p>اكتب <code>FadeSlideIn</code> (<code>StatefulWidget</code>) بياخد <code>child</code> و<code>delay</code> (<code>Duration</code> افتراضيه <code>Duration.zero</code>). أول ما يتبني يستنى <code>delay</code> وبعدين يشغل أنيميشن 500ms: الـ child يظهر بـ <code>FadeTransition</code> ويطلع من تحت (<code>Offset(0, 0.2)</code> لـ <code>Offset.zero</code>) بـ <code>SlideTransition</code> و<code>Curves.easeOut</code>. استخدم <code>AnimationController</code> بالـ vsync وقفله صح، وانتبه إن الـ widget ممكن يتقفل أثناء الانتظار.</p>",
      hints: [
        "في <code>initState</code>: <code>Future.delayed(widget.delay, () { if (mounted) _controller.forward(); })</code>.",
        "الـ <code>CurvedAnimation</code> واحدة تتشارك بين الـ fade والـ slide: <code>late final _curve = CurvedAnimation(parent: _controller, curve: Curves.easeOut)</code>.",
      ],
      solution: `import 'package:flutter/material.dart';

class FadeSlideIn extends StatefulWidget {
  const FadeSlideIn({
    super.key,
    required this.child,
    this.delay = Duration.zero,
  });

  final Widget child;
  final Duration delay;

  @override
  State<FadeSlideIn> createState() => _FadeSlideInState();
}

class _FadeSlideInState extends State<FadeSlideIn>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 500),
  );

  late final Animation<double> _curve = CurvedAnimation(
    parent: _controller,
    curve: Curves.easeOut,
  );

  late final Animation<Offset> _offset = Tween<Offset>(
    begin: const Offset(0, 0.2),
    end: Offset.zero,
  ).animate(_curve);

  @override
  void initState() {
    super.initState();
    Future<void>.delayed(widget.delay, () {
      if (mounted) _controller.forward();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _curve,
      child: SlideTransition(position: _offset, child: widget.child),
    );
  }
}`,
      explain: "الـ controller واحد والـ curve واحدة بتتشارك. الـ <code>mounted</code> بتحميك لو المستخدم خرج من الشاشة قبل ما الـ delay يخلص (وإلا <code>forward</code> على controller مقفول يرمي خطأ). لو استخدمتها في قايمة بتدّي كل عنصر delay أكبر شوية فيطلعوا بالتتابع.",
    },
    {
      title: "دايرة تقدم متحركة بنسبة",
      lang: "dart",
      prompt: "<p>اكتب <code>AnimatedProgressRing</code> (<code>StatelessWidget</code>) بياخد <code>progress</code> (0 لـ 1). يرسم دايرة بـ <code>CustomPaint</code> و<code>CustomPainter</code> اسمه <code>RingPainter</code> (مسار رمادي <code>surfaceContainerHighest</code> وقوس لون <code>primary</code> سمك 10 بأطراف مدورة، يبدأ من فوق). لما <code>progress</code> يتغير، الحركة تتم من القيمة القديمة للجديدة خلال 600ms من غير controller، وفي نص الدايرة نص بالنسبة المئوية مثل <code>70%</code>. والـ painter يعيد الرسم بس لو القيمة أو اللون اتغيروا.</p>",
      hints: [
        "من غير controller يعني <code>TweenAnimationBuilder&lt;double&gt;(tween: Tween(begin: 0, end: progress), ...)</code>.",
        "حط <code>Stack</code> فيه <code>CustomPaint</code> و<code>Center(child: Text(...))</code>. النسبة: <code>'${(value * 100).round()}%'</code>.",
      ],
      solution: `import 'dart:math';
import 'package:flutter/material.dart';

class RingPainter extends CustomPainter {
  const RingPainter({
    required this.value,
    required this.color,
    required this.trackColor,
  });

  final double value;
  final Color color;
  final Color trackColor;

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final radius = size.shortestSide / 2 - 5;
    final rect = Rect.fromCircle(center: center, radius: radius);

    final base = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 10
      ..color = trackColor;
    canvas.drawCircle(center, radius, base);

    final arc = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 10
      ..strokeCap = StrokeCap.round
      ..color = color;
    canvas.drawArc(rect, -pi / 2, 2 * pi * value, false, arc);
  }

  @override
  bool shouldRepaint(RingPainter old) {
    return old.value != value ||
        old.color != color ||
        old.trackColor != trackColor;
  }
}

class AnimatedProgressRing extends StatelessWidget {
  const AnimatedProgressRing({super.key, required this.progress});

  final double progress;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: progress),
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeOut,
      builder: (context, value, child) {
        return SizedBox.square(
          dimension: 120,
          child: Stack(
            alignment: Alignment.center,
            children: [
              CustomPaint(
                size: const Size.square(120),
                painter: RingPainter(
                  value: value,
                  color: scheme.primary,
                  trackColor: scheme.surfaceContainerHighest,
                ),
              ),
              Text('\${(value * 100).round()}%'),
            ],
          ),
        );
      },
    );
  }
}`,
      explain: "التقدم المتحرك جاي من <code>TweenAnimationBuilder</code> (implicit) فمحتاجناش controller. الـ painter غبي: بياخد <code>value</code> ويرسم. والألوان من الثيم. لو الـ <code>end</code> اتغير تاني، الـ tween بيكمل من القيمة الحالية مش من الصفر.",
    },
  ],

  quiz: [
    {
      q: "عايز النص يتبدل من «3» لـ «4» بانتقال fade. أنهي widget؟",
      options: [
        "<code>AnimatedContainer</code>",
        "<code>AnimatedSwitcher</code> مع <code>key</code> مختلف لكل قيمة",
        "<code>AnimatedAlign</code>",
        "<code>Hero</code>",
      ],
      answer: 1,
      why: "<code>AnimatedSwitcher</code> هو اللي بيحرك استبدال child بـ child تاني، بشرط إن الـ key يتغير. <code>AnimatedContainer</code> بتحرك خصائص مش بتبدّل widgets.",
    },
    {
      q: "الكود ده مش هيتكومبايل. السبب؟",
      code: { lang: "dart", src: `class _BoxState extends State<Box> {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 1),
  );

  @override
  Widget build(BuildContext context) => const SizedBox();
}` },
      options: [
        "<code>late final</code> مينفعش مع controller",
        "الـ duration لازم تتكتب بالـ milliseconds",
        "<code>build</code> لازم ترجع widget مش const",
        "الـ State مش بتعمل <code>with SingleTickerProviderStateMixin</code> فالـ <code>this</code> مش TickerProvider",
      ],
      answer: 3,
      why: "<code>vsync: this</code> بتتطلب إن الـ State تكون <code>TickerProvider</code>، وده بيجي من <code>SingleTickerProviderStateMixin</code>.",
    },
    {
      q: "State فيها <code>AnimationController</code> بيعمل <code>repeat()</code> ومفيش <code>dispose</code>. بعد ما تقفل الشاشة إيه بيحصل؟",
      options: [
        "خطأ ticker ما اتقفلش وleak في الذاكرة",
        "مفيش حاجة، Flutter بيقفله لوحده",
        "الأنيميشن بيتوقف بس من غير مشاكل",
        "التطبيق بيقفل فورا",
      ],
      answer: 0,
      why: "الـ controller بيحجز ticker. لازم <code>dispose</code> وإلا بتاخد خطأ في debug وleak. Flutter مش بيقفله عنك.",
    },
    {
      q: "عايز عداد يتحرك من رقم لرقم جديد لما القيمة تتغير، وعايز أقل كود (من غير controller). أنهي أنسب؟",
      options: [
        "<code>AnimationController</code> مع <code>AnimatedBuilder</code>",
        "<code>Hero</code>",
        "<code>TweenAnimationBuilder&lt;double&gt;</code>",
        "<code>CustomPaint</code>",
      ],
      answer: 2,
      why: "<code>TweenAnimationBuilder</code> هو implicit animation لأي قيمة: بتدّيه begin/end و duration والباقي عليه.",
    },
    {
      q: "الـ painter بيرجع <code>false</code> دايما من <code>shouldRepaint</code> رغم إن حقل <code>progress</code> بيتغير. النتيجة؟",
      options: [
        "بيرسم كل frame",
        "التطبيق بيقع",
        "بيرمي خطأ compile",
        "الرسم القديم بيفضل ظاهر ومبيتحدثش",
      ],
      answer: 3,
      why: "الـ framework بيسأل <code>shouldRepaint</code> قبل ما يعيد الرسم. لو false مع تغيير فعلي، الرسم بيتجاهل التحديث. ولو true دايما يرسم من غير داعي (بيأثر على الأداء مش الصحة).",
    },
    {
      q: "اسم الـ mixin اللي بتحطه على الـ State لما يكون فيها controller واحد بس؟",
      answer: ["SingleTickerProviderStateMixin", "singletickerproviderstatemixin"],
      why: "لو فيه أكتر من controller بتستخدم <code>TickerProviderStateMixin</code>.",
    },
    {
      q: "عشان الـ Hero يشتغل بين صفحتين، لازم:",
      options: [
        "الـ widget الاتنين يكونوا من نفس النوع",
        "الصفحتين يكونوا في نفس الملف",
        "الـ widget في الصفحتين يكون عليهم <code>Hero</code> بنفس الـ <code>tag</code>",
        "الـ Navigator يكون named routes",
      ],
      answer: 2,
      why: "الـ tag هو اللي بيربط الـ hero بتاع الصفحة الأولى بالتاني. النوع والملف مش شرط.",
    },
    {
      q: "عندك chart مرسوم بـ CustomPaint، وفي نفس الشاشة عنصر تاني بيتحرك طول الوقت وبيخلي الـ chart يتعاد رسمه. الحل؟",
      options: [
        "لف الـ chart بـ <code>RepaintBoundary</code>",
        "خلي <code>shouldRepaint</code> ترجع true",
        "احذف الـ CustomPaint",
        "استخدم <code>setState</code> أكتر",
      ],
      answer: 0,
      why: "<code>RepaintBoundary</code> بيحط الـ chart في layer مستقل فمبيتعادش رسمه لما حاجة تانية تتحرك. الخيار التاني هيزود الرسم مش يقلله.",
    },
    {
      q: "قيمة <code>_controller.value</code> في أول لحظة قبل ما تنادي <code>forward()</code> (من غير <code>lowerBound</code> مخصص)؟",
      answer: ["0", "0.0"],
      why: "الـ controller بيتحرك افتراضيا من <code>lowerBound</code> = 0 لـ <code>upperBound</code> = 1.",
    },
  ],
};
