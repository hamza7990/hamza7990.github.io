window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f1"] = {
  slides: [
    {
      kicker: "الفكرة الأم",
      title: "الواجهة في Flutter هي كود، وكل حاجة فيها Widget",
      en: "Declarative UI: UI = f(state)",
      body: "<p>في Flutter مفيش ملفات تصميم منفصلة زي XML. الشاشة كلها شجرة من الـ <b>widgets</b> مكتوبة بـ Dart: النص widget، الزرار widget، والمسافة حوالين الزرار كمان widget.</p><p>وطريقة التفكير <b>declarative</b>: إنت مبتقولش «غيّر لون الزرار ده»، إنت بتوصف الشاشة شكلها إيه حسب البيانات الحالية، ولما البيانات تتغير Flutter بيعيد بناء الوصف ويحدّث اللي اتغير بس.</p>",
      focus: [{ label: "احفظها", text: "الواجهة = دالة في الحالة. <code>UI = f(state)</code>. تغيّر الـ state، فالـ <code>build</code> يشتغل تاني، فالشاشة تتحدث." }],
      interview: [
        { q: "يعني إيه إن Flutter بيستخدم declarative UI؟", a: "يعني أنا بوصف الواجهة المفروض تبقى عاملة إزاي عند حالة معينة، مش بكتب خطوات تعديلها. في الأسلوب الـ imperative بمسك عنصر وأغير خصائصه بإيدي، لكن في Flutter لما الـ state تتغير بنادي <code>setState</code> أو أي state management، فالـ <code>build</code> يتنادى تاني ويرجع شجرة widgets جديدة، والـ framework هو اللي يقارن ويحدّث الفرق. ده بيخلي الواجهة دايما متطابقة مع البيانات." },
      ],
    },
    {
      title: "أصغر تطبيق Flutter",
      en: "runApp, MaterialApp, Scaffold",
      code: {
        lang: "dart",
        title: "lib/main.dart",
        src: `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: Scaffold(
        body: Center(child: Text('Hello Flutter')),
      ),
    );
  }
}`,
        note: "<code>runApp</code> بتاخد الـ widget الجذر وتحطه على الشاشة. كل اللي تحته بيتبني من دالة <code>build</code>.",
      },
      terms: [
        ["runApp", "بداية التطبيق", "بتاخد الـ root widget وتربطه بالشاشة."],
        ["MaterialApp", "إطار التطبيق", "بيجهز الثيم والتنقل (Navigator) واللغات لكل اللي تحته."],
        ["Scaffold", "هيكل الصفحة", "بيدي الصفحة أماكن جاهزة: <code>appBar</code> و <code>body</code> و <code>floatingActionButton</code>."],
      ],
    },
    {
      title: "الـ Widget وصف خفيف مبيتغيرش",
      en: "Widgets are immutable configuration",
      body: "<p>الـ widget مش هو الحاجة المرسومة على الشاشة. هو <b>وصف</b> ليها: object صغير فيه إعدادات (النص إيه، اللون إيه)، وكل الـ fields بتاعته <code>final</code>.</p><p>عشان كده بناء الـ widgets رخيص جدا، و Flutter بيبني منهم آلاف في كل frame من غير مشكلة. لما حاجة تتغير مبنعدلش الـ widget القديم، بنبني واحد جديد مكانه.</p>",
      points: [
        "الواجهة بتتبني بالتركيب (composition): widgets صغيرة جوه بعض، مش وراثة من كلاسات كبيرة.",
        "عايز مسافة؟ لف العنصر بـ <code>Padding</code>. عايزه في النص؟ لفه بـ <code>Center</code>. كل وظيفة لها widget.",
      ],
      code: {
        lang: "dart",
        src: `const Padding(
  padding: EdgeInsets.all(16),
  child: Center(
    child: Text('Total: 250 SAR'),
  ),
)`,
        note: "تلات widgets كل واحد بيعمل حاجة واحدة: مسافة، توسيط، نص.",
      },
    },
    {
      title: "تعمل Widget بتاعك",
      en: "Writing a StatelessWidget",
      body: "<p>أي جزء بيتكرر أو له معنى لوحده، اعمله widget. الـ <code>StatelessWidget</code> بياخد بياناته من الـ constructor ويرجع شكله من <code>build</code>، ومفيش حاجة جواه بتتغير.</p>",
      code: {
        lang: "dart",
        src: `class PriceTag extends StatelessWidget {
  const PriceTag({
    super.key,
    required this.label,
    required this.price,
  });

  final String label;
  final double price;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [Text(label), Text(' $price SAR')],
    );
  }
}

// usage
const PriceTag(label: 'Rent', price: 2500)`,
        note: "الـ fields كلها <code>final</code> والـ constructor <code>const</code>، و <code>super.key</code> بتعدي الـ key للأب. ده الشكل الثابت لأي widget هتكتبه.",
      },
      pitfall: "إنك تحط field مش <code>final</code> جوه <code>StatelessWidget</code> وتغيره. الـ widget ممكن يتبني من جديد في أي لحظة والقيمة تضيع. أي حاجة بتتغير مكانها الـ <code>State</code> (المستوى الجاي).",
    },
    {
      title: "التلات شجرات",
      en: "Widget, Element and RenderObject trees",
      body: "<p>ده أشهر سؤال «عميق» في إنترفيو Flutter. الـ framework ماسك تلات شجرات مع بعض:</p>",
      terms: [
        ["Widget", "الوصف", "الإعدادات. خفيف، immutable، وبيتبني من جديد كتير."],
        ["Element", "النسخة الحية", "مكان الـ widget في الشجرة. بيعيش بين الـ rebuilds، وهو اللي ماسك الـ <code>State</code> وبيربط الـ widget بالـ render object."],
        ["RenderObject", "الرسّام", "بيحسب المقاس والمكان (layout) وبيرسم (paint). تقيل، فبيتعاد استخدامه."],
      ],
      points: [
        "لما <code>build</code> يرجع widget جديد، الـ element بيقارنه بالقديم: لو <b>نفس النوع ونفس الـ key</b> بيحدّث نفسه ويستخدم نفس الـ render object.",
        "لو النوع أو الـ key اتغير، الـ element القديم بيتشال ويتعمل واحد جديد (والـ state بتاعه بتضيع).",
      ],
      focus: [{ label: "ليه ده مهم", text: "ده السبب إن إعادة بناء الـ widgets رخيصة: الـ widgets بتترمي وتتبني، لكن الـ elements والـ render objects التقيلة بتفضل." }],
      interview: [
        { q: "اشرح التلات شجرات في Flutter.", a: "شجرة الـ widgets هي الوصف: objects خفيفة immutable بنبنيها في <code>build</code>. شجرة الـ elements هي النسخة الحية: كل element بيمثل مكان widget في الشجرة، بيعيش بين الـ rebuilds وماسك الـ state. شجرة الـ render objects هي اللي بتعمل الـ layout والرسم. لما الـ widget يتبني من جديد، الـ element بيقارن الجديد بالقديم، ولو نفس الـ <code>runtimeType</code> والـ <code>key</code> بيحدّث الـ render object الموجود بدل ما يعمل واحد جديد، وده اللي بيخلي الـ rebuild سريع." },
        { q: "Flutter بيعرف إزاي يحدّث widget ولا يعمله من جديد؟", a: "بدالة <code>Widget.canUpdate</code>: لو الـ widget الجديد والقديم في نفس المكان ليهم نفس الـ <code>runtimeType</code> ونفس الـ <code>key</code>، الـ element بيتحدث ويفضل بالـ state بتاعته. لو اختلفوا، الـ element القديم بيتشال ويتعمل جديد. عشان كده الـ keys مهمة في القوايم اللي عناصرها بتتحرك أو بتتمسح." },
      ],
    },
    {
      title: "الـ BuildContext هو مكانك في الشجرة",
      en: "BuildContext",
      body: "<p>الـ <code>context</code> اللي بييجي في <code>build</code> هو الـ <b>element</b> بتاع الـ widget ده، يعني عنوانه في الشجرة. بتستخدمه عشان تدور على حاجات <b>فوقك</b>: الثيم، مقاس الشاشة، الـ Navigator.</p>",
      code: {
        lang: "dart",
        src: `@override
Widget build(BuildContext context) {
  final theme = Theme.of(context);            // nearest Theme above
  final width = MediaQuery.sizeOf(context).width;

  return Text(
    'Width: $width',
    style: theme.textTheme.titleLarge,
  );
}`,
        note: "أي <code>Something.of(context)</code> معناها: اطلع في الشجرة من مكاني لحد أول <code>Something</code>.",
      },
      pitfall: "تستخدم <code>context</code> بتاع widget عشان توصل لحاجة هو نفسه اللي بناها. مثال: <code>Scaffold.of(context)</code> جوه نفس الـ <code>build</code> اللي فيه الـ <code>Scaffold</code> بيفشل، لأن الـ context ده <b>فوق</b> الـ Scaffold مش تحته. الحل: طلّع الجزء ده في widget لوحده، أو لفه بـ <code>Builder</code>.",
      interview: [
        { q: "إيه هو الـ <code>BuildContext</code>؟", a: "هو الـ element بتاع الـ widget، يعني مرجع لمكانه في الشجرة. بستخدمه عشان أوصل لحاجات الأجداد زي <code>Theme.of(context)</code> و <code>MediaQuery.of(context)</code> و <code>Navigator.of(context)</code>. كل widget له context مختلف، والبحث دايما بيطلع لفوق من مكان الـ context، فلو استخدمت context أعلى من الـ widget اللي بدور عليه مش هلاقيه." },
      ],
    },
    {
      title: "const قدام الـ widgets",
      en: "const constructors",
      body: "<p>لو الـ widget كل قيمه معروفة وقت الكومبايل، اكتب قدامه <code>const</code>. ساعتها بيتعمل منه نسخة واحدة بس، ولما الأب يتبني من جديد Flutter بيلاقي نفس النسخة بالظبط فمبيعيدش بناء الجزء ده.</p>",
      codes: [
        { lang: "dart", title: "بيتبني object جديد في كل build", src: `Padding(
  padding: EdgeInsets.all(16),
  child: Text('Welcome'),
)` },
        { lang: "dart", title: "نسخة واحدة ثابتة", src: `const Padding(
  padding: EdgeInsets.all(16),
  child: Text('Welcome'),
)` },
      ],
      points: ["<code>const</code> على الأب بتغطي كل اللي جواه، مش محتاج تكررها.", "لو فيه قيمة جاية من متغير وقت التشغيل، الـ widget ده مينفعش يبقى <code>const</code>، لكن ولاده الثابتين ينفع."],
    },
    {
      title: "كلاس ولا دالة؟",
      en: "Widget class vs helper method",
      body: "<p>لما الـ <code>build</code> يطول، فيه طريقتين تقسّمه: دالة زي <code>_buildHeader()</code>، أو widget كلاس زي <code>Header</code>. الأحسن غالبا الكلاس.</p>",
      points: [
        "الكلاس ينفع يبقى <code>const</code> فيتخطى الـ rebuild. الدالة بتتنفذ كلها في كل مرة الأب يتبني.",
        "الكلاس له element و <code>context</code> خاص بيه، فالـ rebuild بتاعه منفصل عن الأب.",
        "الكلاس بيظهر باسمه في الـ DevTools وتقدر تختبره لوحده.",
      ],
      interview: [
        { q: "إيه الفرق بين إني أطلّع جزء من الواجهة في دالة أو في widget كلاس؟", a: "الدالة مجرد تنظيم للكود: اللي بترجعه بيبقى جزء من <code>build</code> بتاع الأب وبيتبني معاه كل مرة. الـ widget الكلاس له element خاص بيه، فينفع يبقى <code>const</code> ويتخطى الـ rebuild، وله <code>context</code> خاص، ولو فيه state بيتبني لوحده من غير الأب. عشان كده للأجزاء اللي بتتكرر أو التقيلة بفضل كلاس." },
      ],
    },
    {
      title: "Hot reload و Hot restart",
      en: "Hot reload vs hot restart",
      terms: [
        ["hot reload", "تحديث سريع", "بيحقن الكود الجديد ويعيد تشغيل <code>build</code>، والـ <b>state بتفضل زي ما هي</b>."],
        ["hot restart", "إعادة تشغيل سريعة", "بيبدأ التطبيق من <code>main</code> تاني، والـ state كلها بتتصفر."],
        ["full restart", "إعادة كاملة", "وقف وتشغيل من جديد. لازم لما تغير كود native أو تضيف plugin أو تعدل <code>pubspec.yaml</code>."],
      ],
      pitfall: "تغير القيمة الابتدائية في <code>initState</code> أو في متغير global وتعمل hot reload وتستغرب إن مفيش حاجة اتغيرت. الـ hot reload مبيعيدش تشغيل <code>initState</code> ولا <code>main</code> لأن الـ state محفوظة. اعمل hot restart.",
      interview: [
        { q: "إيه الفرق بين hot reload و hot restart؟", a: "الـ hot reload بيحمّل الكود المتغير في الـ VM ويعيد بناء شجرة الـ widgets مع الاحتفاظ بالـ state، فبشوف تعديل الواجهة في ثانية وأنا في نفس الشاشة. الـ hot restart بيرمي الـ state ويشغل التطبيق من <code>main</code>. بحتاج الـ restart لما أغير حاجة بتتنفذ مرة واحدة زي <code>initState</code> أو <code>main</code> أو قيم المتغيرات الـ global والـ static، ولو غيرت كود native أو الـ dependencies بحتاج تشغيل كامل." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: أصغر تطبيق",
      lang: "dart",
      code: `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: Scaffold(
        body: Center(child: Text('Hello Flutter')),
      ),
    );
  }
}`,
      note: "ده الهيكل اللي هتكتبه في أول أي تاسك إنترفيو. خليه يطلع من إيدك من غير تفكير.",
    },
    {
      title: "اكتب: widget بـ parameters",
      lang: "dart",
      code: `class PriceTag extends StatelessWidget {
  const PriceTag({
    super.key,
    required this.label,
    required this.price,
  });

  final String label;
  final double price;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [Text(label), Text(' $price SAR')],
    );
  }
}`,
    },
    {
      title: "اكتب: استخدام الـ context",
      lang: "dart",
      code: `class Headline extends StatelessWidget {
  const Headline(this.text, {super.key});

  final String text;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final width = MediaQuery.sizeOf(context).width;
    return Text(
      text,
      style: theme.textTheme.headlineMedium,
      maxLines: width < 400 ? 2 : 1,
    );
  }
}`,
    },
  ],

  tasks: [
    {
      title: "كارت البروفايل",
      lang: "dart",
      prompt: "<p>اكتب <code>StatelessWidget</code> اسمه <code>ProfileCard</code> بياخد:</p><ul><li><code>name</code> و <code>role</code> من نوع <code>String</code> (مطلوبين).</li><li><code>verified</code> من نوع <code>bool</code> وقيمته الافتراضية <code>false</code>.</li></ul><p>ويرجع <code>Card</code> جواه <code>Padding</code> بـ 16 من كل ناحية، وجواه <code>Column</code> فيه: الاسم بستايل <code>titleLarge</code> من الثيم، تحته الـ role، ولو <code>verified</code> بـ <code>true</code> أيقونة <code>Icons.verified</code>.</p>",
      hints: [
        "الشكل الثابت: <code>const</code> constructor فيه <code>super.key</code>، و fields كلها <code>final</code>.",
        "جوه <code>children</code> تقدر تكتب <code>if (verified) const Icon(Icons.verified)</code> على طول (collection if).",
      ],
      solution: `class ProfileCard extends StatelessWidget {
  const ProfileCard({
    super.key,
    required this.name,
    required this.role,
    this.verified = false,
  });

  final String name;
  final String role;
  final bool verified;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(name, style: Theme.of(context).textTheme.titleLarge),
            Text(role),
            if (verified) const Icon(Icons.verified),
          ],
        ),
      ),
    );
  }
}`,
      explain: "خد بالك من تلات حاجات: الـ <code>Card</code> نفسه مش <code>const</code> لأن جواه قيم وقت التشغيل، لكن <code>EdgeInsets.all(16)</code> والأيقونة <code>const</code>. و <code>Theme.of(context)</code> بتجيب الستايل من الثيم بدل ما تكتب مقاس الخط بإيدك. و <code>mainAxisSize.min</code> بتخلي العمود على قد محتواه.",
    },
    {
      title: "من دالة لـ widget",
      lang: "dart",
      prompt: "<p>الصفحة دي بتبني تلات عناصر بدالة <code>_item</code>. حوّل الدالة لـ widget كلاس اسمه <code>MenuItem</code> بياخد <code>title</code>، واستخدمه بـ <code>const</code> في الصفحة.</p>",
      starter: `class MenuPage extends StatelessWidget {
  const MenuPage({super.key});

  Widget _item(String title) {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Text(title),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [_item('Home'), _item('Orders'), _item('Profile')],
    );
  }
}`,
      hints: [
        "الكلاس الجديد <code>StatelessWidget</code> عادي: <code>const</code> constructor و field واحد <code>final String title</code>.",
        "لما كل الـ children يبقوا <code>const</code>، تقدر تحط <code>const</code> قدام الـ <code>Column</code> كله.",
      ],
      solution: `class MenuItem extends StatelessWidget {
  const MenuItem(this.title, {super.key});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Text(title),
    );
  }
}

class MenuPage extends StatelessWidget {
  const MenuPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        MenuItem('Home'),
        MenuItem('Orders'),
        MenuItem('Profile'),
      ],
    );
  }
}`,
      explain: "بعد التحويل الـ <code>Column</code> كله بقى <code>const</code>: لو <code>MenuPage</code> اتبنت من جديد، العناصر التلاتة مش هتتبني تاني. بالدالة ده مكانش ممكن، لأن ناتج الدالة بيتحسب في كل build.",
    },
  ],

  quiz: [
    {
      q: "أدق وصف للـ widget في Flutter؟",
      options: [
        "العنصر المرسوم على الشاشة نفسه، وبنعدل خصائصه لما البيانات تتغير",
        "وصف immutable للواجهة، بيتبني منه نسخة جديدة لما حاجة تتغير",
        "كلاس بيحتفظ بالـ state بين الـ rebuilds",
        "الـ object المسؤول عن الـ layout والرسم",
      ],
      answer: 1,
      why: "الـ widget وصف خفيف وكل الـ fields فيه <code>final</code>. اللي ماسك الـ state هو الـ element، واللي بيرسم هو الـ render object.",
    },
    {
      q: "أنهي شجرة مسؤولة عن حساب المقاسات والرسم؟",
      options: ["Widget tree", "Element tree", "RenderObject tree", "State tree"],
      answer: 2,
      why: "الـ render objects هي اللي بتعمل layout و paint. الـ widgets وصف، والـ elements هي اللي بتربط بين الاتنين. ومفيش حاجة اسمها State tree.",
    },
    {
      q: "الـ <code>BuildContext</code> في الحقيقة هو:",
      options: [
        "نسخة من الـ widget نفسه",
        "الـ element بتاع الـ widget، يعني مكانه في الشجرة",
        "object global واحد للتطبيق كله",
        "الـ State بتاع أقرب StatefulWidget",
      ],
      answer: 1,
      why: "كل widget له element، والـ element هو اللي بينفذ <code>BuildContext</code>. عشان كده كل widget له context مختلف والبحث بيطلع لفوق من مكانه.",
    },
    {
      q: "الكود ده فيه خطأ كومبايل. السبب إيه؟",
      code: { lang: "dart", src: `class Counter extends StatelessWidget {
  const Counter({super.key});

  int count = 0;

  @override
  Widget build(BuildContext context) => Text('$count');
}` },
      options: [
        "<code>build</code> مينفعش تتكتب بـ <code>=&gt;</code>",
        "الـ constructor <code>const</code> والكلاس فيه field مش <code>final</code>",
        "<code>Text</code> لازم تاخد <code>const</code>",
        "ناقص <code>super.key</code>",
      ],
      answer: 1,
      why: "الـ <code>const</code> constructor بيتطلب إن كل الـ fields تبقى <code>final</code>. وأصلا مينفعش تحط قيمة بتتغير في <code>StatelessWidget</code>، مكانها الـ <code>State</code>.",
    },
    {
      q: "غيرت القيمة الابتدائية جوه <code>initState</code> وعملت hot reload، والشاشة لسه بالقيمة القديمة. ليه؟",
      options: [
        "الـ hot reload مبيحملش الكود الجديد",
        "لازم تمسح التطبيق وتنزله تاني",
        "الـ hot reload بيحتفظ بالـ state ومبيعيدش تشغيل <code>initState</code>",
        "<code>initState</code> بتشتغل بس في الـ release mode",
      ],
      answer: 2,
      why: "الكود الجديد اتحمل فعلا، لكن الـ state الموجودة فضلت زي ما هي و <code>initState</code> بتتنادى مرة واحدة عند إنشاء الـ state. الـ hot restart بيبدأ من <code>main</code> فالقيمة الجديدة تظهر.",
    },
    {
      q: "Flutter بيستخدم نفس الـ element مع الـ widget الجديد لما يكون:",
      options: [
        "نفس الـ <code>runtimeType</code> ونفس الـ <code>key</code>",
        "نفس النص المعروض",
        "نفس الـ <code>hashCode</code>",
        "الـ widget معمول بـ <code>const</code> بس",
      ],
      answer: 0,
      why: "دي دالة <code>Widget.canUpdate</code>: النوع والـ key. لو اتطابقوا الـ element بيتحدث ويحتفظ بالـ state، غير كده بيتعمل element جديد.",
    },
    {
      q: "أنهي واحدة بتجهز الـ Navigator والثيم لكل التطبيق؟",
      options: ["<code>Scaffold</code>", "<code>runApp</code>", "<code>Center</code>", "<code>MaterialApp</code>"],
      answer: 3,
      why: "<code>MaterialApp</code> بتحط فوق الشجرة الـ <code>Navigator</code> والـ <code>Theme</code> واللغات. <code>Scaffold</code> هيكل صفحة واحدة بس (appBar و body).",
    },
    {
      q: "اسم الدالة اللي بتاخد الـ root widget وتبدأ بيه التطبيق؟",
      answer: ["runApp", "runApp()"],
      why: "<code>runApp</code> بتتنادى في <code>main</code> وبتربط الـ widget الجذر بالشاشة.",
    },
    {
      q: "ليه الأفضل تطلّع جزء بيتكرر في widget كلاس بدل دالة بترجع widget؟",
      options: [
        "عشان الدوال ممنوعة جوه <code>build</code>",
        "عشان الكلاس ينفع يبقى <code>const</code> وله element و context خاص، فالـ rebuild بتاعه منفصل",
        "عشان الكلاس بيتكومبايل أسرع",
        "عشان الدالة مينفعش تاخد parameters",
      ],
      answer: 1,
      why: "ناتج الدالة جزء من <code>build</code> بتاع الأب وبيتحسب كل مرة. الكلاس الـ <code>const</code> بيتخطى الـ rebuild، وله context خاص بيه.",
    },
  ],
};
