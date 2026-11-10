window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f3"] = {
  slides: [
    {
      kicker: "القاعدة الوحيدة",
      title: "الـ constraints بتنزل، والمقاسات بتطلع، والأب بيحدد المكان",
      en: "Constraints go down, sizes go up, parent sets position",
      body: "<p>كل أخطاء الـ layout في Flutter بتتحل لو فهمت جملة واحدة:</p><p><b>الأب</b> بيبعت لولده حدود (constraints: أقل وأكتر عرض وطول مسموحين). <b>الولد</b> بيختار مقاسه جوه الحدود دي ويرجعه للأب. و<b>الأب</b> هو اللي يقرر يحط الولد فين.</p><p>ومن هنا النتيجة اللي بتحير الناس: الولد <b>مش بيقرر</b> مقاسه لوحده. لو كتبت <code>width: 200</code> والأب بعتله حدود تجبره على غير كده، الـ 200 هتتتجاهل.</p>",
      focus: [{ label: "احفظها", text: "Constraints go down. Sizes go up. Parent sets position. وأي widget لازم يكون مقاسه جوه الـ constraints اللي جتله من أبوه." }],
      interview: [
        { q: "اشرح قاعدة الـ layout في Flutter.", a: "الأب بيبعت للولد constraints (أدنى وأقصى للعرض والطول)، والولد بيحسب مقاسه جوه الحدود دي ويرجعه للأب، والأب بعد كده يحدد مكان الولد. فمقاس الولد بيتحدد بالـ constraints اللي جاية من فوق مش بس بالقيم اللي كتبتها، وعشان كده <code>width: 200</code> ممكن متشتغلش لو الأب بيجبر الولد على مقاس تاني." },
      ],
    },
    {
      title: "Tight و Loose",
      en: "Tight vs loose constraints",
      body: "<p>الـ constraints نوعين. <b>Tight</b> يعني الأدنى = الأقصى، فالولد مالوش اختيار. <b>Loose</b> يعني الأدنى صفر، فالولد يقدر يصغر لحد ما يحب (لحد الأقصى).</p>",
      terms: [
        ["tight", "ضيقة", "الأدنى = الأقصى. الولد لازم ياخد المقاس ده بالظبط. مثال: <code>SizedBox(width: 100, height: 100)</code> بتدي ولدها constraints من النوع ده."],
        ["loose", "مرنة", "من صفر لحد الأقصى. الولد يختار مقاسه الطبيعي. مثال: <code>Center</code> و <code>Align</code> بيدوا ولدهم constraints مرنة."],
        ["unbounded", "غير محدودة", "الأقصى = لانهائي. بتحصل جوه الـ scrollables (على محور التمرير). أي widget بيحاول يملا اللانهاية بيفشل (هنشوف الخطأ كمان شوية)."],
      ],
      codes: [
        { lang: "dart", title: "الـ 200 مبتشتغلش: الأب (الشاشة) بيجبره", src: `Container(
  width: 200,
  height: 200,
  color: Colors.blue,
)`, note: "تحت <code>Scaffold.body</code> الـ constraints tight على مقاس الشاشة، فالـ Container بيملا الشاشة." },
        { lang: "dart", title: "Center بيحول الحدود لـ loose", src: `Center(
  child: Container(
    width: 200,
    height: 200,
    color: Colors.blue,
  ),
)`, note: "<code>Center</code> بياخد المساحة كلها لكنه بيدي ولده حدود مرنة، فالـ 200 بتتحترم." },
      ],
      pitfall: "تكتب مقاس على widget وتشوفه ملاش تأثير. اسأل: أبوه بيدي constraints إيه؟ الحل غالبا إنك تلفه بـ <code>Center</code> أو <code>Align</code> (يحول لـ loose) أو <code>SizedBox</code> (يفرض مقاس).",
    },
    {
      title: "Row و Column والمحاور",
      en: "Row, Column, main axis and cross axis",
      body: "<p><code>Row</code> بيرص أولاده أفقيا و<code>Column</code> رأسيا. المحور اللي بيمتد عليه الصف اسمه <b>main axis</b> (في Row هو الأفقي، وفي Column هو الرأسي)، والعمودي عليه <b>cross axis</b>.</p>",
      points: [
        "<code>mainAxisAlignment</code>: توزيع الأولاد على المحور الرئيسي (<code>start</code>, <code>center</code>, <code>end</code>, <code>spaceBetween</code>, <code>spaceAround</code>, <code>spaceEvenly</code>).",
        "<code>crossAxisAlignment</code>: محاذاة الأولاد على المحور العكسي (<code>start</code>, <code>center</code>, <code>end</code>, <code>stretch</code>).",
        "<code>mainAxisSize</code>: <code>max</code> (الافتراضي، ياخد كل المساحة المتاحة) أو <code>min</code> (على قد المحتوى).",
        "الـ Row بيدي ولاده constraints مرنة على المحور الرئيسي، فعرض الأولاد الطبيعي لو زاد عن المتاح بيحصل overflow.",
      ],
      code: {
        lang: "dart",
        src: `Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    const Text('Apartment'),
    const SizedBox(height: 4),
    Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: const [
        Text('2 beds'),
        Text('1,800 SAR'),
      ],
    ),
  ],
)`,
        note: "الـ Column بيحاذي أولاده على اليسار (start) والـ Row بيبعد النصين عن بعض. مسافة بين عنصرين بنعملها بـ <code>SizedBox</code> مش بـ margin.",
      },
    },
    {
      title: "Expanded و Flexible و Spacer",
      en: "Expanded vs Flexible, Spacer, flex",
      body: "<p>جوه <code>Row</code> أو <code>Column</code>، الـ widgets اللي مش flexible بتاخد مقاسها الطبيعي الأول، والمساحة المتبقية بتتوزع على الـ flexible حسب <code>flex</code>.</p>",
      terms: [
        ["Expanded", "املا المساحة", "<code>Flexible(fit: FlexFit.tight)</code>. الولد <b>لازم</b> يملا نصيبه من المساحة المتبقية."],
        ["Flexible", "ممكن تصغر", "الولد <b>ممكن</b> يملا نصيبه (<code>loose</code> وهو الافتراضي)، لكن لو محتواه أصغر ياخد أصغر."],
        ["Spacer", "فراغ مرن", "<code>Expanded</code> فاضي. بياخد المساحة المتبقية ويزق اللي بعده."],
      ],
      code: {
        lang: "dart",
        src: `Row(
  children: [
    const Icon(Icons.home),
    const SizedBox(width: 8),
    const Expanded(
      child: Text(
        'A very long property title that must not overflow',
        overflow: TextOverflow.ellipsis,
      ),
    ),
    const Spacer(),
    TextButton(onPressed: () {}, child: const Text('Open')),
  ],
)`,
        note: "الـ Expanded بياخد كل اللي فاضل ويدي النص حدود محددة فيتقص بـ ellipsis بدل ما يعمل overflow. لو في Expanded اتنين، المساحة بتتقسم حسب <code>flex</code> (الافتراضي 1).",
      },
      pitfall: "تحط <code>Expanded</code> في أي مكان. لازم يكون ابن مباشر لـ <code>Row</code> أو <code>Column</code> أو <code>Flex</code>، وإلا بيطلع الخطأ «Incorrect use of ParentDataWidget».",
      interview: [
        { q: "إيه الفرق بين Expanded و Flexible؟", a: "كلاهما بياخد حصة من المساحة المتبقية في Row أو Column حسب <code>flex</code>. <code>Expanded</code> بيجبر الولد يملا الحصة كلها (fit tight)، أما <code>Flexible</code> بيسمح للولد يكون أصغر لو محتواه أصغر (fit loose). فـ <code>Expanded</code> هو <code>Flexible(fit: FlexFit.tight)</code>." },
      ],
    },
    {
      title: "Stack و Positioned و Align",
      en: "Stack, Positioned, Align",
      body: "<p><code>Stack</code> بيرص أولاده فوق بعض (آخر واحد في الأعلى). الأولاد العاديين بياخدوا constraints مرنة، أما اللي ملفوف بـ <code>Positioned</code> فبيتحدد مكانه بالنسبة لحواف الـ Stack. <code>Align</code> بيحط ولد واحد في نقطة (مثلا <code>Alignment.bottomRight</code>).</p>",
      code: {
        lang: "dart",
        src: `SizedBox(
  width: 200,
  height: 120,
  child: Stack(
    children: [
      Positioned.fill(
        child: Container(color: Colors.grey.shade300),
      ),
      const Positioned(
        top: 8,
        right: 8,
        child: Icon(Icons.favorite),
      ),
      const Align(
        alignment: Alignment.bottomLeft,
        child: Text('Riyadh'),
      ),
    ],
  ),
)`,
        note: "الـ Stack بياخد مقاس أكبر ولد غير مثبت، أو المساحة المتاحة لو ملهوش. هنا حددنا له مقاس بـ SizedBox.",
      },
      points: [
        "<code>Positioned</code> مينفعش يكون إلا ابن مباشر لـ <code>Stack</code>.",
        "الأولاد بالترتيب: اللي بيتكتب آخر بيتحط فوق.",
        "<code>clipBehavior</code> الافتراضي <code>hardEdge</code>: اللي بيطلع برا حدود الـ Stack بيتقص.",
      ],
    },
    {
      title: "Container وأجزاؤه",
      en: "Container vs SizedBox, Padding, Align, DecoratedBox",
      body: "<p><code>Container</code> مش widget سحري: هو اختصار بيجمع <code>Padding</code> و <code>Align</code> و <code>ConstrainedBox</code> و <code>DecoratedBox</code> و <code>Transform</code> في widget واحد. لو محتاج حاجة واحدة، استخدم الأصغر.</p>",
      terms: [
        ["SizedBox", "مقاس أو فراغ", "مقاس ثابت أو مسافة بين العناصر. const وخفيف."],
        ["Padding", "مسافة داخلية", "مسافة بين الحدود والمحتوى."],
        ["Align / Center", "محاذاة", "بيحط الولد في نقطة داخل الأب ويدي ولده constraints مرنة."],
        ["DecoratedBox", "زخرفة", "لون وحدود وزوايا مدورة وظل (<code>BoxDecoration</code>)."],
        ["Container", "كلهم مع بعض", "لما محتاج أكتر من حاجة (padding + لون + مقاس + محاذاة) بسهولة."],
      ],
      codes: [
        { lang: "dart", title: "Container لما محتاج أكتر من حاجة", src: `Container(
  padding: const EdgeInsets.all(12),
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(12),
  ),
  child: const Text('Card'),
)` },
        { lang: "dart", title: "مسافة بس؟ SizedBox أخف", src: `const SizedBox(height: 16)` },
      ],
      pitfall: "تكتب <code>Container(color: ..., decoration: BoxDecoration(...))</code> مع بعض. بيطلع assertion لأن <code>color</code> بيتحول لـ decoration داخليا. حط اللون جوه الـ <code>BoxDecoration</code>.",
      interview: [
        { q: "إمتى تستخدم Container وإمتى تستخدم Padding أو SizedBox؟", a: "الـ <code>Container</code> بيجمع أكتر من وظيفة (padding وديكور ومقاس ومحاذاة)، فبستخدمه لما أحتاج أكتر من حاجة. لو محتاج مسافة بس فـ <code>Padding</code>، ولو مسافة بين عنصرين أو مقاس ثابت فـ <code>SizedBox</code> لأنه const وأخف وبيعبر عن النية أوضح." },
      ],
    },
    {
      title: "خطأ الـ overflow",
      en: "RenderFlex overflowed",
      body: "<p>الخطأ الأشهر: شريط أصفر وأسود على الشاشة، ونص في الـ console: <b>A RenderFlex overflowed by N pixels on the right (or bottom)</b>.</p><p>معناه: ولاد الـ Row أو Column عايزين مساحة أكبر من اللي الأب مديهالهم على المحور الرئيسي. والـ Row مش بيحل ده لوحده.</p>",
      codes: [
        { lang: "dart", title: "بيعمل overflow", src: `Row(
  children: [
    const Icon(Icons.location_on),
    const Text(
      'A very long address that does not fit in one line at all',
    ),
  ],
)` },
        { lang: "dart", title: "الحل 1: Expanded + ellipsis", src: `Row(
  children: [
    const Icon(Icons.location_on),
    const Expanded(
      child: Text(
        'A very long address that does not fit in one line at all',
        overflow: TextOverflow.ellipsis,
      ),
    ),
  ],
)` },
      ],
      points: [
        "<b>Expanded / Flexible</b> على الولد اللي ممكن يصغر (نص طويل مثلا).",
        "<b>Wrap</b> بدل Row لو العناصر تنزل سطر جديد.",
        "<b>SingleChildScrollView</b> لو الـ Column فعلا أطول من الشاشة (مثلا مع الكيبورد).",
        "مش حل: تصغر الخط لحد ما يتساوى على جهازك. الشاشات بتختلف.",
      ],
    },
    {
      title: "خطأ الـ unbounded height",
      en: "Vertical viewport was given unbounded height",
      body: "<p>تاني أشهر خطأ: <b>Vertical viewport was given unbounded height</b>. بيحصل لما تحط <code>ListView</code> جوه <code>Column</code>. الـ Column بيدي أولاده ارتفاع غير محدود (لأن ده طبيعته: يمدد لحد ما الأولاد يخلصوا)، والـ ListView بيحاول ياخد كل الارتفاع المتاح، واللانهاية مش مقاس.</p>",
      codes: [
        { lang: "dart", title: "غلط", src: `Column(
  children: [
    const Text('Results'),
    ListView(
      children: const [Text('A'), Text('B')],
    ),
  ],
)` },
        { lang: "dart", title: "صح: Expanded يدي القايمة المساحة المتبقية", src: `Column(
  children: [
    const Text('Results'),
    Expanded(
      child: ListView(
        children: const [Text('A'), Text('B')],
      ),
    ),
  ],
)` },
      ],
      points: [
        "الحل الأساسي: <code>Expanded</code> (أو <code>Flexible</code>) حوالين القايمة، فتاخد الباقي من الارتفاع.",
        "بديل لو القايمة صغيرة ومحدودة: <code>shrinkWrap: true</code> مع <code>physics: NeverScrollableScrollPhysics()</code>. بس ده بيحسب كل العناصر فمش للقوايم الكبيرة.",
        "نفس الفكرة بتحصل أفقيا: <code>TextField</code> جوه <code>Row</code> من غير <code>Expanded</code> بيدي «unbounded width».",
      ],
      interview: [
        { q: "ليه ListView جوه Column بيرمي خطأ unbounded height؟ وإزاي تصلحه؟", a: "لأن الـ <code>Column</code> بيدي أولاده ارتفاع غير محدود، والـ <code>ListView</code> بيحتاج ارتفاع محدد يعرف منه منطقة التمرير، فبيرمي الخطأ. الحل إني ألف الـ ListView بـ <code>Expanded</code> عشان ياخد المساحة المتبقية من الـ Column. لو القايمة قصيرة أقدر أستخدم <code>shrinkWrap: true</code> لكنه بيحسب كل العناصر مرة واحدة فمش مناسب للقوايم الطويلة." },
        { q: "إيه سبب «RenderFlex overflowed» وإزاي تحله؟", a: "بيحصل لما أولاد Row أو Column طلبوا مساحة أكبر من الأب على المحور الرئيسي. بحله حسب الحالة: <code>Expanded</code> أو <code>Flexible</code> للولد اللي ممكن يصغر (زي نص مع ellipsis)، أو <code>Wrap</code> لو العناصر تنزل سطر، أو <code>SingleChildScrollView</code> لو المحتوى فعلا أطول من الشاشة." },
      ],
    },
    {
      title: "SafeArea و MediaQuery و LayoutBuilder",
      en: "SafeArea, MediaQuery, LayoutBuilder",
      body: "<p><code>SafeArea</code> بتبعد المحتوى عن الـ notch والـ status bar وشريط التنقل. <code>Scaffold</code> بيتعامل مع الـ AppBar لوحده، لكن لو بنيت شاشة من غير Scaffold أو بـ <code>body</code> ممتد، لفها بـ SafeArea.</p><p>وللقرارات الـ responsive فيه أداتين، والفرق بينهم هو الأهم:</p>",
      terms: [
        ["MediaQuery", "مقاس الشاشة كلها", "<code>MediaQuery.sizeOf(context)</code> مقاس الـ window، واتجاه الجهاز، والـ padding والكيبورد. استخدمه لقرارات على مستوى الصفحة."],
        ["LayoutBuilder", "المساحة المتاحة لـ widget ده", "بيديك الـ <code>constraints</code> اللي جاية من الأب. الأفضل لما الـ widget ممكن يتحط في مساحة أصغر من الشاشة (جنب sidebar مثلا)."],
      ],
      code: {
        lang: "dart",
        src: `SafeArea(
  child: LayoutBuilder(
    builder: (context, constraints) {
      if (constraints.maxWidth >= 600) {
        return const Row(
          children: [
            Expanded(child: Placeholder()),
            Expanded(child: Placeholder()),
          ],
        );
      }
      return const Column(
        children: [Expanded(child: Placeholder())],
      );
    },
  ),
)`,
        note: "من 600 بكسل فما فوق نعرض عمودين، وأقل من كده عمود واحد. القرار مبني على المساحة المتاحة فعلا مش على الشاشة.",
      },
      interview: [
        { q: "إيه الفرق بين MediaQuery و LayoutBuilder؟ وإمتى كل واحد؟", a: "<code>MediaQuery</code> بيديني معلومات الشاشة أو الـ window كلها (المقاس، الاتجاه، الـ padding، الكيبورد). <code>LayoutBuilder</code> بيديني الـ constraints اللي جاية من الأب مباشرة، يعني المساحة المتاحة للـ widget ده فعلا. بستخدم MediaQuery لقرارات الصفحة ككل، و LayoutBuilder للـ widgets القابلة لإعادة الاستخدام اللي لازم تتكيف مع المساحة اللي اتحطت فيها." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: Row بنص مرن",
      lang: "dart",
      code: `Row(
  children: [
    const Icon(Icons.location_on),
    const SizedBox(width: 8),
    const Expanded(
      child: Text(
        'Long address text',
        overflow: TextOverflow.ellipsis,
      ),
    ),
    TextButton(onPressed: () {}, child: const Text('Map')),
  ],
)`,
      note: "<code>Expanded</code> + <code>ellipsis</code> هو الحل الأول لأي overflow في نص جوه Row.",
    },
    {
      title: "اكتب: قايمة تحت عنوان",
      lang: "dart",
      code: `Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    const Padding(
      padding: EdgeInsets.all(16),
      child: Text('Listings'),
    ),
    Expanded(
      child: ListView(
        children: const [Text('One'), Text('Two')],
      ),
    ),
  ],
)`,
    },
    {
      title: "اكتب: كارت بـ Stack",
      lang: "dart",
      code: `SizedBox(
  width: 200,
  height: 120,
  child: Stack(
    children: [
      Positioned.fill(
        child: Container(color: Colors.grey.shade300),
      ),
      const Positioned(
        top: 8,
        right: 8,
        child: Icon(Icons.favorite),
      ),
    ],
  ),
)`,
    },
  ],

  tasks: [
    {
      title: "صف عقار",
      lang: "dart",
      prompt: "<p>اكتب <code>StatelessWidget</code> اسمه <code>PropertyRow</code> بياخد <code>title</code> و <code>city</code> و <code>price</code> (كلهم <code>String</code>). بيرسم <code>Row</code>: على الشمال مربع صورة بيمثل الصورة (<code>Container</code> 64x64 رمادي)، بعده <code>SizedBox</code> 12، بعده عمود فيه العنوان والمدينة (العمود ياخد المساحة المتبقية والعنوان لو طال يتقص بنقط)، وفي آخر الصف السعر.</p>",
      hints: [
        "العمود لازم يتلف بـ <code>Expanded</code> عشان ياخد المساحة اللي بين الصورة والسعر.",
        "العمود <code>crossAxisAlignment.start</code>، والعنوان <code>maxLines: 1</code> و <code>overflow: TextOverflow.ellipsis</code>.",
      ],
      solution: `class PropertyRow extends StatelessWidget {
  const PropertyRow({
    super.key,
    required this.title,
    required this.city,
    required this.price,
  });

  final String title;
  final String city;
  final String price;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(width: 64, height: 64, color: Colors.grey),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              Text(city),
            ],
          ),
        ),
        Text(price),
      ],
    );
  }
}`,
      explain: "الصورة والسعر بياخدوا مقاسهم الطبيعي، والـ <code>Expanded</code> بياخد الباقي، فمهما طال العنوان مفيش overflow. لاحظ إن <code>maxLines: 1</code> مع <code>ellipsis</code> مش هتشتغل من غير ما يكون النص عنده عرض محدد، وده اللي الـ Expanded بيوفره.",
    },
    {
      title: "إصلاح خطأ unbounded",
      lang: "dart",
      prompt: "<p>الصفحة دي بتطلع خطأ «Vertical viewport was given unbounded height». صلحها بحيث العنوان يفضل فوق والقايمة تاخد باقي الشاشة وتتمرر. بعدها عدّل الكود بحيث لو العرض المتاح 700 فأكتر تتعرض القايمة في عمودين جنب بعض (استخدم <code>LayoutBuilder</code> و <code>GridView.count</code>).</p>",
      starter: `class ResultsPage extends StatelessWidget {
  const ResultsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Text('Results'),
        ListView.builder(
          itemCount: 20,
          itemBuilder: (_, i) => ListTile(title: Text('Item $i')),
        ),
      ],
    );
  }
}`,
      hints: [
        "لف الـ <code>ListView</code> بـ <code>Expanded</code>.",
        "جوه <code>Expanded</code> حط <code>LayoutBuilder</code>: لو <code>constraints.maxWidth &gt;= 700</code> رجّع <code>GridView.count(crossAxisCount: 2, ...)</code> غير كده الـ ListView.",
      ],
      solution: `class ResultsPage extends StatelessWidget {
  const ResultsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Text('Results'),
        Expanded(
          child: LayoutBuilder(
            builder: (context, constraints) {
              Widget tile(int i) => ListTile(title: Text('Item $i'));
              if (constraints.maxWidth >= 700) {
                return GridView.count(
                  crossAxisCount: 2,
                  childAspectRatio: 6,
                  children: [for (var i = 0; i < 20; i++) tile(i)],
                );
              }
              return ListView.builder(
                itemCount: 20,
                itemBuilder: (_, i) => tile(i),
              );
            },
          ),
        ),
      ],
    );
  }
}`,
      explain: "الـ <code>Expanded</code> هو اللي بيحل الخطأ: بيدي الـ LayoutBuilder (وتحته القايمة) ارتفاع محدد. و<code>LayoutBuilder</code> بيشوف المساحة اللي <code>Expanded</code> أدتهالنا، فالقرار مبني على المساحة المتاحة مش على مقاس الجهاز.",
    },
    {
      title: "بادج على صورة",
      lang: "dart",
      prompt: "<p>اكتب <code>StatelessWidget</code> اسمه <code>BadgeBox</code> بياخد <code>count</code> من نوع <code>int</code>. بيرسم مربع 48x48 رمادي (<code>Container</code>) وفي أعلى يمينه دايرة حمرا صغيرة (حوالي 18x18) فيها الرقم، تطلع حبة برا حدود المربع (<code>top: -6, right: -6</code>). تأكد إنها مش بتتقص.</p>",
      hints: [
        "<code>Stack</code> مع <code>clipBehavior: Clip.none</code> عشان الأولاد اللي برا الحدود ميتقصوش.",
        "الدايرة: <code>Container</code> بـ <code>decoration: BoxDecoration(color: Colors.red, shape: BoxShape.circle)</code> وفي النص <code>Center</code>.",
      ],
      solution: `class BadgeBox extends StatelessWidget {
  const BadgeBox({super.key, required this.count});

  final int count;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 48,
      height: 48,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned.fill(child: Container(color: Colors.grey)),
          Positioned(
            top: -6,
            right: -6,
            child: Container(
              width: 18,
              height: 18,
              alignment: Alignment.center,
              decoration: const BoxDecoration(
                color: Colors.red,
                shape: BoxShape.circle,
              ),
              child: Text(
                '$count',
                style: const TextStyle(fontSize: 10),
              ),
            ),
          ),
        ],
      ),
    );
  }
}`,
      explain: "من غير <code>Clip.none</code> الـ Stack بيقص أي حاجة بتطلع برا حدوده، فالبادج كانت هتبان نصها. القيم السالبة في Positioned مسموحة.",
    },
  ],

  quiz: [
    {
      q: "حطيت <code>Container(width: 100, height: 100)</code> مباشرة جوه <code>Scaffold(body: ...)</code> وطلع بيملا الشاشة. ليه؟",
      options: [
        "الـ Container مبيقبلش مقاس أصغر من الشاشة",
        "الـ Scaffold بيدي الـ body constraints tight على مقاس المساحة، فمقاس الولد بيتجاهل",
        "ناقصه <code>alignment</code>",
        "لازم <code>const</code>",
      ],
      answer: 1,
      why: "الولد بيحترم الـ constraints اللي جاية من أبوه، ولما تكون tight مالوش اختيار. لفه بـ <code>Center</code> أو <code>Align</code> عشان تتحول لـ loose.",
    },
    {
      q: "أنهي widget بيدي ولده constraints <b>مرنة</b> (من صفر)؟",
      options: [
        "<code>SizedBox(width: 100, height: 100)</code>",
        "<code>Expanded</code>",
        "<code>Center</code>",
        "<code>Scaffold.body</code>",
      ],
      answer: 2,
      why: "<code>Center</code> (و <code>Align</code>) بيحول الحدود لمرنة. <code>SizedBox</code> و <code>Expanded</code> بيفرضوا مقاس على ولدهم.",
    },
    {
      q: "عندك <code>Row</code> فيه نص طويل بيطلع شريط overflow أصفر. أنسب إصلاح؟",
      options: [
        "تحط <code>mainAxisAlignment: MainAxisAlignment.end</code>",
        "تلف النص بـ <code>Expanded</code> وتضيف <code>overflow: TextOverflow.ellipsis</code>",
        "تغير الـ Row لـ Column دايما",
        "تضيف <code>mainAxisSize: MainAxisSize.min</code>",
      ],
      answer: 1,
      why: "المشكلة إن النص عايز عرض أكبر من المتاح. <code>Expanded</code> بيدي النص عرض محدد، والـ ellipsis بيقصه. الـ alignment والـ mainAxisSize مبيغيروش المساحة المطلوبة.",
    },
    {
      q: "إيه اللي هيحصل في الكود ده؟",
      code: { lang: "dart", src: `Column(
  children: [
    const Text('Title'),
    ListView(children: const [Text('A'), Text('B')]),
  ],
)` },
      options: [
        "يشتغل عادي والقايمة تتمرر",
        "خطأ: RenderFlex overflowed",
        "القايمة بتختفي من غير خطأ",
        "خطأ: Vertical viewport was given unbounded height",
      ],
      answer: 3,
      why: "الـ Column بيدي ولاده ارتفاع غير محدود والـ ListView بيحتاج ارتفاع محدد. الحل: <code>Expanded</code> حوالين الـ ListView.",
    },
    {
      q: "إيه الفرق بين <code>Expanded</code> و <code>Flexible</code> (بالإعدادات الافتراضية)؟",
      options: [
        "<code>Expanded</code> للـ Row بس و <code>Flexible</code> للـ Column بس",
        "<code>Expanded</code> بيجبر الولد يملا حصته، و <code>Flexible</code> بيسمح له يصغر",
        "مفيش فرق، اسمين لنفس الحاجة",
        "<code>Flexible</code> بيتجاهل <code>flex</code>",
      ],
      answer: 1,
      why: "<code>Expanded = Flexible(fit: FlexFit.tight)</code> والافتراضي في Flexible هو <code>loose</code>. الاتنين بيشتغلوا في Row و Column.",
    },
    {
      q: "عايز تحط أيقونة في ركن أعلى يمين صورة. أنهي widgets؟",
      options: [
        "<code>Stack</code> مع <code>Positioned(top: 8, right: 8, ...)</code>",
        "<code>Row</code> مع <code>Spacer</code>",
        "<code>Column</code> مع <code>mainAxisAlignment.end</code>",
        "<code>Padding</code> بس",
      ],
      answer: 0,
      why: "الـ Stack بيرص فوق بعض، و <code>Positioned</code> بيحدد المكان بالنسبة لحواف الـ Stack. باقي الاختيارات بترص جنب بعض أو تحت بعض.",
    },
    {
      q: "إيه الخطأ في الكود ده؟",
      code: { lang: "dart", src: `Container(
  color: Colors.blue,
  decoration: BoxDecoration(
    borderRadius: BorderRadius.circular(8),
  ),
)` },
      options: [
        "<code>borderRadius</code> مش مدعومة",
        "ناقص <code>child</code>",
        "<code>color</code> و <code>decoration</code> مع بعض بيطلعوا assertion، واللون يتحط جوه <code>BoxDecoration</code>",
        "<code>Colors.blue</code> لازم <code>const</code>",
      ],
      answer: 2,
      why: "الـ <code>color</code> بيتحول داخليا لـ decoration فمينفعش الاتنين مع بعض. حط <code>color</code> جوه الـ BoxDecoration.",
    },
    {
      q: "لو عايز Row يتحول لـ Column حسب المساحة اللي الـ widget اتحط فيها فعلا (مش مقاس الشاشة)، تستخدم إيه؟",
      options: [
        "<code>MediaQuery.sizeOf(context)</code>",
        "<code>SafeArea</code>",
        "<code>Spacer</code>",
        "<code>LayoutBuilder</code>",
      ],
      answer: 3,
      why: "<code>LayoutBuilder</code> بيدي الـ constraints اللي جاية من الأب، يعني المساحة المتاحة للـ widget ده. MediaQuery بيدي مقاس الـ window كله.",
    },
    {
      q: "مين اللي يقرر مكان الولد جوه الأب في الـ layout؟ (كلمة واحدة بالإنجليزي)",
      answer: ["parent", "the parent", "Parent"],
      why: "Constraints go down, sizes go up, parent sets position. الولد بيختار مقاسه بس، والأب هو اللي بيحط الولد.",
    },
    {
      q: "الخطأ «Incorrect use of ParentDataWidget» بيحصل في الغالب لما:",
      options: [
        "تحط <code>Expanded</code> أو <code>Positioned</code> في مكان مش ابن مباشر لـ Flex أو Stack",
        "تنسى <code>const</code>",
        "تستخدم أكتر من <code>Expanded</code> في نفس الـ Row",
        "تحط Row جوه Column",
      ],
      answer: 0,
      why: "<code>Expanded</code> لازم يكون ابن مباشر لـ Row أو Column، و <code>Positioned</code> لـ Stack. لو لفيته بـ widget تاني بينكسر.",
    },
  ],
};
