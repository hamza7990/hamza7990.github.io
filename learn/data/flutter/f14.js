window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f14"] = {
  slides: [
    {
      kicker: "ليه الثيم",
      title: "الشكل كله في مكان واحد: Theme",
      en: "Theming: one place for the look of the app",
      body: "<p>لو كتبت لون الزرار ومقاس الخط وشكل الكارت في كل شاشة بإيدك، أول ما العميل يقول «غيّر اللون الأساسي» هتفتح 40 ملف. الحل إن الشكل كله يتعرف <b>مرة واحدة</b> في <code>ThemeData</code> وتحطه في <code>MaterialApp</code>، وكل widget تحته يقراه بـ <code>Theme.of(context)</code>.</p><p>الـ widgets بتاعة Material (الزرار، الـ AppBar، الـ TextField) بتقرا الثيم لوحدها، فمعظم الشكل بيتظبط من غير ما تكتب سطر واحد في الشاشة. وده نفس الميكانيزم اللي شفته في <code>InheritedWidget</code>: الثيم بيتحط فوق والأولاد بيقروه.</p>",
      points: [
        "<code>MaterialApp(theme: ..., darkTheme: ..., themeMode: ...)</code>: التلاتة بيتحطوا مرة واحدة فوق.",
        "من Flutter 3.16 الـ Material 3 هو الافتراضي (<code>useMaterial3: true</code>)، فمتحتاجش تكتبها، بس ساعات بتتكتب عشان الوضوح.",
        "الـ Material 3 غيّر الشكل: ألوان من <code>ColorScheme</code> بدل <code>primarySwatch</code>، وأزرار جديدة زي <code>FilledButton</code>.",
      ],
      focus: [{ label: "احفظها", text: "ممنوع <code>Color(0xFF...)</code> و<code>fontSize: 22</code> جوه الشاشات. الشاشة بتسأل الثيم، والثيم بيرد." }],
    },
    {
      title: "ThemeData و ColorScheme.fromSeed",
      en: "ThemeData, ColorScheme.fromSeed, Material 3",
      body: "<p>في Material 3 اللون مش واحد، هو <b>نظام ألوان كامل</b> (<code>ColorScheme</code>): primary و onPrimary و secondary و surface و error وغيرهم، كل لون ليه لون «فوقه» يتقري عليه (<code>onPrimary</code> هو لون النص فوق <code>primary</code>). بدل ما تختار 30 لون، بتدي لون واحد <b>seed</b> و<code>ColorScheme.fromSeed</code> بتولد الباقي متناسق.</p>",
      code: {
        lang: "dart",
        title: "app_theme.dart",
        src: `import 'package:flutter/material.dart';

const seed = Color(0xFF1565C0);

final lightTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(seedColor: seed),
  textTheme: Typography.material2021().black.apply(
        fontFamily: 'Cairo',
      ),
);

final darkTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: seed,
    brightness: Brightness.dark,
  ),
);`,
        note: "نفس الـ seed بـ <code>brightness</code> مختلف بيطلع نظام ألوان غامق متناسق. الخط بيتحدد في <code>fontFamily</code> بعد ما تعلن الخط في <code>pubspec.yaml</code> (للعربي: Cairo أو Tajawal مثلا).",
      },
      terms: [
        ["ColorScheme", "نظام الألوان", "مجموعة ألوان Material 3: <code>primary</code> و<code>surface</code> و<code>error</code> إلخ، وكل واحد معاه <code>onXxx</code> للنص فوقه."],
        ["seed color", "اللون الأساس", "لون واحد بيتولد منه الـ ColorScheme كله."],
      ],
      interview: [
        { q: "إيه اللي اتغير في Material 3 بالنسبة للألوان؟ وإيه هو <code>ColorScheme.fromSeed</code>؟", a: "في Material 3 الألوان بتيجي من <code>ColorScheme</code> (primary و secondary و surface و error وكل واحد معاه on-color للنص فوقه) بدل <code>primarySwatch</code>. و<code>fromSeed</code> بتاخد لون واحد وتولد منه نظام ألوان كامل ومتناسق، وبتاخد <code>brightness</code> فنفس الـ seed يطلع light وdark. من Flutter 3.16 الـ Material 3 هو الافتراضي." },
      ],
    },
    {
      title: "اقرا الثيم بدل ما تكتب القيم",
      en: "Theme.of(context): never hard-code",
      body: "<p>الثيم بيتقري من <code>Theme.of(context)</code>: الألوان في <code>colorScheme</code> والخطوط في <code>textTheme</code> (displayLarge ... titleLarge ... bodyMedium ... labelSmall). كل style في <code>textTheme</code> ممكن يكون <code>null</code> فبنستخدم <code>?.copyWith</code> لو عايز تعدل عليه.</p>",
      codes: [
        {
          lang: "dart",
          title: "غلط: قيم مكتوبة بإيدك",
          src: `Container(
  color: const Color(0xFF1565C0),
  child: const Text(
    'Total',
    style: TextStyle(fontSize: 22, color: Colors.white),
  ),
)`,
        },
        {
          lang: "dart",
          title: "صح: من الثيم",
          src: `Builder(
  builder: (context) {
    final theme = Theme.of(context);
    return Container(
      color: theme.colorScheme.primary,
      child: Text(
        'Total',
        style: theme.textTheme.titleLarge?.copyWith(
          color: theme.colorScheme.onPrimary,
        ),
      ),
    );
  },
)`,
        },
      ],
      pitfall: "اللون الأبيض الثابت فوق خلفية بتيجي من الثيم: في الـ dark mode الخلفية بتتغير والنص يضيع. الصح إنك تاخد اللون المقابل <code>onPrimary</code> أو <code>onSurface</code> من نفس الـ <code>ColorScheme</code> عشان الاتنين دايما متناسقين.",
    },
    {
      title: "الـ Dark mode",
      en: "darkTheme and themeMode",
      body: "<p>الـ dark mode مش «اقلب الألوان». بتعرّف ثيمين (<code>theme</code> و<code>darkTheme</code>) و<code>themeMode</code> هو اللي بيختار: <code>ThemeMode.system</code> (الافتراضي، بيتبع إعدادات الموبايل) أو <code>light</code> أو <code>dark</code>. لو عايز المستخدم يختار من جوه التطبيق، <code>themeMode</code> بتبقى state (Riverpod مثلا) وبتتحفظ في <code>shared_preferences</code> زي ما اتعلمنا في التخزين المحلي.</p>",
      code: {
        lang: "dart",
        title: "theme_mode.dart",
        src: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ThemeModeNotifier extends Notifier<ThemeMode> {
  @override
  ThemeMode build() => ThemeMode.system;

  void set(ThemeMode mode) => state = mode;
}

final themeModeProvider =
    NotifierProvider<ThemeModeNotifier, ThemeMode>(
  ThemeModeNotifier.new,
);

class App extends ConsumerWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      theme: ThemeData(colorScheme: ColorScheme.fromSeed(
        seedColor: Colors.blue,
      )),
      darkTheme: ThemeData(colorScheme: ColorScheme.fromSeed(
        seedColor: Colors.blue,
        brightness: Brightness.dark,
      )),
      themeMode: ref.watch(themeModeProvider),
      home: const Scaffold(),
    );
  }
}`,
        note: "<code>MaterialApp</code> بتتبني من جديد لما الـ mode يتغير، والشجرة كلها بتاخد الثيم الجديد. بتقدر تعرف الوضع الحالي بـ <code>Theme.of(context).brightness</code>.",
      },
      interview: [
        { q: "إزاي تعمل dark mode وتخلي المستخدم يختار؟", a: "بعرّف <code>theme</code> و<code>darkTheme</code> من نفس الـ seed بـ <code>brightness</code> مختلف، وبحط <code>themeMode</code> في <code>MaterialApp</code>. الافتراضي <code>ThemeMode.system</code> بيتبع الموبايل. ولو المستخدم يختار من الإعدادات، الـ <code>themeMode</code> بتبقى state في Riverpod أو Bloc وبتتحفظ في <code>shared_preferences</code> عشان ترجع عند فتح التطبيق، والـ widgets مبتتغيرش لأنها بتقرا الألوان من الثيم." },
      ],
    },
    {
      title: "Component themes و ThemeExtension",
      en: "Component themes and ThemeExtension",
      body: "<p>بدل ما تظبط كل زرار لوحده، اظبط <b>شكل النوع كله</b> مرة: <code>filledButtonTheme</code> و<code>inputDecorationTheme</code> و<code>appBarTheme</code> و<code>cardTheme</code> وغيرهم جوه <code>ThemeData</code>. وبعد كده أي <code>FilledButton()</code> بياخد الشكل ده.</p><p>ولو محتاج ألوان خاصة بتطبيقك مش موجودة في <code>ColorScheme</code> (زي success و warning)، فيه <code>ThemeExtension</code>: كلاس بتوصل بيه حاجات إضافية للثيم وبيتقري بـ <code>Theme.of(context).extension&lt;T&gt;()</code>.</p>",
      codes: [
        {
          lang: "dart",
          title: "component themes",
          src: `final theme = ThemeData(
  colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
  appBarTheme: const AppBarTheme(centerTitle: true),
  filledButtonTheme: FilledButtonThemeData(
    style: FilledButton.styleFrom(
      minimumSize: const Size.fromHeight(48),
    ),
  ),
  inputDecorationTheme: InputDecorationTheme(
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
    ),
  ),
);`,
        },
        {
          lang: "dart",
          title: "ThemeExtension",
          src: `@immutable
class AppColors extends ThemeExtension<AppColors> {
  const AppColors({required this.success, required this.warning});

  final Color success;
  final Color warning;

  @override
  AppColors copyWith({Color? success, Color? warning}) {
    return AppColors(
      success: success ?? this.success,
      warning: warning ?? this.warning,
    );
  }

  @override
  AppColors lerp(AppColors? other, double t) {
    if (other == null) return this;
    return AppColors(
      success: Color.lerp(success, other.success, t)!,
      warning: Color.lerp(warning, other.warning, t)!,
    );
  }
}

// register: ThemeData(extensions: [AppColors(...)])
// read: Theme.of(context).extension<AppColors>()!.success`,
          note: "<code>copyWith</code> و<code>lerp</code> إجباريين (الـ lerp بيتستخدم لما الثيم يتبدل بأنيميشن بين light وdark). سجّل نسخة مختلفة لكل ثيم.",
        },
      ],
    },
    {
      title: "Responsive: MediaQuery و LayoutBuilder",
      en: "Responsive UI: MediaQuery.sizeOf, LayoutBuilder, breakpoints",
      body: "<p>التطبيق هيشتغل على موبايل صغير وموبايل كبير وتابلت. فيه أداتين للقياس والفرق بينهم هو سؤال إنترفيو كلاسيك:</p>",
      terms: [
        ["MediaQuery.sizeOf(context)", "مقاس الشاشة كلها", "بيرجع مقاس نافذة التطبيق. استخدم <code>sizeOf</code> بدل <code>MediaQuery.of(context).size</code> لأنها بتشترك في المقاس بس، فالـ widget مبيتبنيش لما لوحة المفاتيح تظهر."],
        ["LayoutBuilder", "المساحة المتاحة للـ widget", "بيدّيك الـ <code>constraints</code> اللي أبوه ادّاهالك. لو الـ widget في panel عرضه 300 هتشوف 300 مش عرض الشاشة."],
      ],
      codes: [
        {
          lang: "dart",
          title: "breakpoints",
          src: `// Material 3 window size classes
// compact < 600, medium 600-839, expanded >= 840
int columnsFor(double width) {
  if (width >= 840) return 3;
  if (width >= 600) return 2;
  return 1;
}

class PropertyGrid extends StatelessWidget {
  const PropertyGrid({super.key, required this.titles});

  final List<String> titles;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return GridView.builder(
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: columnsFor(constraints.maxWidth),
            childAspectRatio: 3,
          ),
          itemCount: titles.length,
          itemBuilder: (context, i) => Card(child: Text(titles[i])),
        );
      },
    );
  }
}`,
        },
        {
          lang: "dart",
          title: "من غير breakpoints: العرض الأقصى للخلية",
          src: `GridView.builder(
  gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
    maxCrossAxisExtent: 320,
  ),
  itemCount: 20,
  itemBuilder: (context, i) => Card(child: Text('Item $i')),
)`,
          note: "لو الهدف بس تزود الأعمدة مع العرض، <code>MaxCrossAxisExtent</code> بيحسبها لوحده.",
        },
      ],
      points: [
        "<b>Flexible و Expanded</b> بدل عروض ثابتة: التخطيط بيتمدد ويتقلص حسب المتاح.",
        "<b>Text scaling:</b> المستخدم ممكن يكبّر الخط من إعدادات الموبايل. متحطش ارتفاع ثابت لحاجة فيها نص. لو لازم تحدد: <code>MediaQuery.withClampedTextScaling(minScaleFactor: 1, maxScaleFactor: 1.5, child: ...)</code>.",
        "اختبر على أصغر شاشة وعلى أكبر خط، مش بس على جهازك.",
      ],
      interview: [
        { q: "إيه الفرق بين <code>MediaQuery</code> و<code>LayoutBuilder</code>؟ وإمتى كل واحد؟", a: "<code>MediaQuery.sizeOf(context)</code> بيجيب مقاس النافذة كلها، وبستخدمه لقرارات على مستوى الشاشة زي اختيار navigation bar للموبايل ولا rail للتابلت. <code>LayoutBuilder</code> بيدّيني الـ constraints اللي أبوه ادّاها للـ widget ده تحديدا، فبستخدمه لما الـ widget لازم يتصرف حسب المساحة المتاحة له هو، زي كارت جوه panel جانبي. وبفضّل <code>sizeOf</code> على <code>of(context).size</code> عشان ميتبنيش من جديد لما تتغير حاجة تانية في MediaQuery." },
      ],
    },
    {
      title: "اللغات: إعداد flutter_localizations و ARB",
      en: "Localization: gen-l10n, l10n.yaml, ARB files",
      body: "<p>الـ localization في Flutter بتتعمل بالأدوات الرسمية: حزمة <code>flutter_localizations</code> (من الـ SDK) و<code>intl</code>. بتكتب النصوص في ملفات <b>ARB</b> (JSON بسيط، ملف لكل لغة) و<code>flutter gen-l10n</code> بيولّد كلاس <code>AppLocalizations</code> فيه getter أو دالة لكل نص. أي نص مكتوب بإيدك في الـ UI يبقى bug لما تضيف لغة.</p>",
      codes: [
        {
          lang: "yaml",
          title: "pubspec.yaml + l10n.yaml",
          src: `# pubspec.yaml
dependencies:
  flutter_localizations:
    sdk: flutter
  intl: ^0.20.3          # use the version flutter pub add gives you

flutter:
  generate: true

# l10n.yaml (project root)
arb-dir: lib/l10n
template-arb-file: app_en.arb
output-localization-file: app_localizations.dart`,
        },
        {
          lang: "json",
          title: "lib/l10n/app_en.arb",
          src: `{
  "@@locale": "en",
  "appTitle": "Greb",
  "welcome": "Welcome, {name}",
  "@welcome": {
    "placeholders": { "name": { "type": "String" } }
  },
  "propertyCount": "{count, plural, =0{No properties} =1{1 property} other{{count} properties}}",
  "@propertyCount": {
    "placeholders": { "count": { "type": "int" } }
  }
}`,
          note: "ملف الـ template هو المصدر. ملف <code>app_ar.arb</code> بنفس المفاتيح والنصوص بالعربي. الـ <code>@key</code> بيوصف الـ placeholders.",
        },
        {
          lang: "dart",
          title: "main.dart",
          src: `import 'package:flutter/material.dart';
import 'package:my_app/l10n/app_localizations.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      onGenerateTitle: (context) => AppLocalizations.of(context)!.appTitle,
      home: const Scaffold(),
    );
  }
}`,
          note: "الـ import ده للإصدارات الحديثة (الملف بيتولد في <code>lib/l10n</code>). في إصدارات أقدم كان بيتولد في <code>flutter_gen</code> والـ import مختلف. الـ delegates بتشمل كمان ترجمة نصوص Material نفسها (زي «Cancel»).",
        },
      ],
    },
    {
      title: "استخدام النصوص وتغيير اللغة وقت التشغيل",
      en: "AppLocalizations.of(context), placeholders, plurals, switching locale",
      body: "<p>بعد التوليد: <code>AppLocalizations.of(context)!.welcome('Hamza')</code>. الـ placeholder بيتحول لـ parameter في دالة، والـ plural بيتحول لدالة بتاخد رقم وبتختار الصيغة الصح. العربي عنده صيغ كتيرة (صفر، واحد، اتنين، قليل، كتير، آخر) والـ ICU plural بيدعمهم كلهم، فمتكتبش <code>if (n == 1)</code> بإيدك.</p>",
      code: {
        lang: "dart",
        title: "locale_switch.dart",
        src: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:my_app/l10n/app_localizations.dart';

extension L10nX on BuildContext {
  AppLocalizations get l10n => AppLocalizations.of(this)!;
}

class LocaleNotifier extends Notifier<Locale> {
  @override
  Locale build() => const Locale('ar');

  void set(Locale locale) => state = locale;
}

final localeProvider =
    NotifierProvider<LocaleNotifier, Locale>(LocaleNotifier.new);

class Header extends ConsumerWidget {
  const Header({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      children: [
        Text(context.l10n.welcome('Hamza')),
        Text(context.l10n.propertyCount(3)),
        TextButton(
          onPressed: () {
            ref.read(localeProvider.notifier).set(const Locale('en'));
          },
          child: const Text('English'),
        ),
      ],
    );
  }
}
// in MaterialApp: locale: ref.watch(localeProvider)`,
        note: "تغيير <code>locale</code> في <code>MaterialApp</code> بيعمل rebuild للتطبيق بلغة جديدة، و<code>Directionality</code> بتتبدل لوحدها (يمين لشمال للعربي). احفظ اللغة المختارة في <code>shared_preferences</code>.",
      },
      points: [
        "التواريخ والأرقام والعملة: استخدم <code>intl</code> مع الـ locale (<code>NumberFormat.currency(locale: 'ar', symbol: 'SAR')</code> و<code>DateFormat.yMMMd('ar')</code>) أو <code>format</code> جوه الـ ARB، متركبش string بإيدك.",
        "لو locale الجهاز مش مدعومة، Flutter بيختار أقرب واحدة وإلا أول لغة في <code>supportedLocales</code>.",
      ],
      interview: [
        { q: "إزاي بتعمل تطبيق بلغتين (عربي وإنجليزي) في Flutter؟", a: "بضيف <code>flutter_localizations</code> و<code>intl</code>، وبفعّل <code>generate: true</code> في pubspec، وبعمل <code>l10n.yaml</code> وملفين ARB (<code>app_en.arb</code> و<code>app_ar.arb</code>)، و<code>flutter gen-l10n</code> بيولّد <code>AppLocalizations</code>. في <code>MaterialApp</code> بحط <code>localizationsDelegates</code> و<code>supportedLocales</code>، وفي الـ UI بقرا النصوص بـ <code>AppLocalizations.of(context)</code>. للـ plural والـ placeholders بستخدم صيغة ICU في الـ ARB. وللتبديل وقت التشغيل بخلي <code>locale</code> في <code>MaterialApp</code> بتيجي من state وأحفظها." },
      ],
    },
    {
      title: "RTL: start و end مش left و right",
      en: "RTL, Directionality, EdgeInsetsDirectional",
      body: "<p>لما اللغة عربي، <code>MaterialApp</code> بتحط <code>Directionality</code> بـ <code>TextDirection.rtl</code> لوحدها. <code>Row</code> بيرتب أولاده من اليمين، والـ <code>Drawer</code> بيفتح من اليمين، والنص بيتحاذى على اليمين. المشكلة بتيجي من أي كود بيكتب <b>left</b> و<b>right</b> بشكل صريح: ده بيفضل left حتى في العربي.</p>",
      codes: [
        {
          lang: "dart",
          title: "غلط: left و right ثابتة",
          src: `Padding(
  padding: const EdgeInsets.only(left: 16),
  child: Align(
    alignment: Alignment.centerLeft,
    child: Text('Title'),
  ),
)`,
        },
        {
          lang: "dart",
          title: "صح: start و end",
          src: `Padding(
  padding: const EdgeInsetsDirectional.only(start: 16),
  child: Align(
    alignment: AlignmentDirectional.centerStart,
    child: Text('Title'),
  ),
)`,
        },
      ],
      terms: [
        ["EdgeInsetsDirectional", "مسافات start/end", "<code>start</code> هي اليسار في الإنجليزي واليمين في العربي."],
        ["AlignmentDirectional", "محاذاة start/end", "<code>centerStart</code> و<code>centerEnd</code> إلخ."],
        ["BorderRadiusDirectional / PositionedDirectional", "نفس الفكرة", "<code>topStart</code> للـ radius و<code>start</code> في الـ Positioned."],
      ],
      points: [
        "<b>الأيقونات الاتجاهية</b> (سهم رجوع، سهم next): أيقونات Material زي <code>Icons.arrow_back</code> بتتعكس لوحدها في RTL. صورك الخاصة: <code>Image.asset(..., matchTextDirection: true)</code>. أما الأيقونات غير الاتجاهية (بحث، قلب، موقع) متتعكسش.",
        "<code>TextAlign.start</code> بدل <code>TextAlign.left</code>. وللنص الإنجليزي جوه جملة عربي سيب الـ framework يتعامل معاه (bidi).",
        "اختبر كل شاشة بالعربي مرة قبل ما تقول خلصت: أي حاجة لازقة في الشمال هتبان.",
      ],
      interview: [
        { q: "إزاي بتدعم RTL في Flutter؟ وإيه الأخطاء الشائعة؟", a: "لما اللغة عربي الـ <code>MaterialApp</code> بتحط <code>Directionality</code> RTL لوحدها فالـ <code>Row</code> والـ drawer والنص بيتعكسوا. الأخطاء بتيجي من الكود اللي بيكتب left/right صريح، فبستخدم <code>EdgeInsetsDirectional</code> و<code>AlignmentDirectional</code> و<code>TextAlign.start</code> و<code>PositionedDirectional</code> بدلهم. وبخلي بالي من الأيقونات الاتجاهية (بتتعكس) والصور اللي محتاجة <code>matchTextDirection</code>، وبختبر الشاشات بالعربي." },
      ],
    },
    {
      title: "Accessibility: الأساسيات",
      en: "Semantics, contrast, tap target size",
      body: "<p>الـ accessibility مش رفاهية: فيه ناس بتستخدم قارئ الشاشة (TalkBack وVoiceOver)، وناس بتكبر الخط، وناس بصرها ضعيف. Flutter بيبني شجرة <code>Semantics</code> من الـ widgets (الـ <code>Text</code> والزراير بيعملوا semantics لوحدهم). شغلك إنك تكمّل الناقص.</p>",
      code: {
        lang: "dart",
        title: "semantics.dart",
        src: `class A11yExamples extends StatelessWidget {
  const A11yExamples({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        // an icon button needs a label
        IconButton(
          icon: const Icon(Icons.favorite_border),
          tooltip: 'Add to favorites',
          onPressed: () {},
        ),
        // a custom tappable widget
        Semantics(
          button: true,
          label: 'Open property details',
          child: GestureDetector(
            onTap: () {},
            child: const SizedBox(
              width: kMinInteractiveDimension,
              height: kMinInteractiveDimension,
              child: Icon(Icons.chevron_right),
            ),
          ),
        ),
        // decoration the reader should skip
        const ExcludeSemantics(child: Icon(Icons.circle, size: 4)),
      ],
    );
  }
}`,
        note: "<code>tooltip</code> في <code>IconButton</code> بيتحول لـ label لقارئ الشاشة. و<code>kMinInteractiveDimension</code> ثابت قيمته 48. و<code>Semantics(button: true)</code> بتعرّف قارئ الشاشة إن ده زرار.",
      },
      points: [
        "<b>Tap target:</b> أقل مساحة للمس 48x48 dp. الـ <code>IconButton</code> بيحقق ده لوحده، لكن <code>GestureDetector</code> حوالين أيقونة صغيرة لأ.",
        "<b>Contrast:</b> نسبة التباين بين النص والخلفية 4.5:1 على الأقل للنص العادي. استخدم أزواج <code>colorScheme</code> (primary و onPrimary) فهي متحسبة صح، ومتخليش النص رمادي فاتح على أبيض.",
        "<b>اللون وحده مش كفاية:</b> متعتمدش على أحمر/أخضر بس للحالة، حط أيقونة أو نص معاه.",
        "<b>تكبير الخط:</b> جرّب Text scale 1.5 و2 وتأكد مفيش overflow.",
      ],
      interview: [
        { q: "إيه أساسيات الـ accessibility اللي بتراعيها في تطبيق Flutter؟", a: "أولا الـ labels: أي أيقونة بتتضغط ليها <code>tooltip</code> أو <code>Semantics(label:)</code> عشان قارئ الشاشة. تانيا حجم منطقة اللمس 48x48 على الأقل. تالتا التباين: بستخدم أزواج الـ <code>ColorScheme</code> وبتأكد النص مقروء في الـ light والـ dark. رابعا إني مستخدمش اللون لوحده للدلالة. وخامسا إني أجرب تكبير الخط من إعدادات الموبايل وأتأكد إن الواجهة مبتكسرش." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: ThemeData بـ fromSeed",
      lang: "dart",
      code: `final lightTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFF1565C0),
  ),
  appBarTheme: const AppBarTheme(centerTitle: true),
  cardTheme: const CardThemeData(elevation: 1),
);`,
      note: "ثيم الـ light. الـ dark نفسه بس بـ <code>brightness: Brightness.dark</code> جوه <code>fromSeed</code>.",
    },
    {
      title: "اكتب: نص مترجم و start/end",
      lang: "dart",
      code: `class WelcomeTile extends StatelessWidget {
  const WelcomeTile({super.key, required this.name});

  final String name;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Padding(
      padding: const EdgeInsetsDirectional.only(start: 16, end: 8),
      child: Align(
        alignment: AlignmentDirectional.centerStart,
        child: Text(l10n.welcome(name)),
      ),
    );
  }
}`,
    },
    {
      title: "اكتب: LayoutBuilder وعدد الأعمدة",
      lang: "dart",
      code: `class AdaptiveGrid extends StatelessWidget {
  const AdaptiveGrid({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final wide = constraints.maxWidth >= 600;
        return GridView.count(
          crossAxisCount: wide ? 3 : 1,
          childAspectRatio: 3,
          children: const [Card(), Card(), Card()],
        );
      },
    );
  }
}`,
    },
  ],

  tasks: [
    {
      title: "كلاس AppTheme بـ light و dark",
      lang: "dart",
      prompt: "<p>اكتب كلاس <code>AppTheme</code> فيه دالتين static: <code>light()</code> و<code>dark()</code> بترجعوا <code>ThemeData</code>. الاتنين من نفس الـ seed (<code>Color(0xFF1565C0)</code>) بـ <code>fromSeed</code> وبيفرقوا في الـ <code>brightness</code>. استخدم دالة خاصة مشتركة <code>_build(ColorScheme)</code> تضيف: <code>centerTitle</code> للـ AppBar، وزرار <code>FilledButton</code> ارتفاعه 48، وحواف <code>InputDecoration</code> بنصف قطر 12. بعد كده اكتب <code>MaterialApp</code> بيستخدمهم مع <code>themeMode: ThemeMode.system</code>.</p>",
      hints: [
        "<code>static ThemeData _build(ColorScheme scheme)</code> بتاخد الـ scheme وبتحطه في <code>colorScheme:</code>.",
        "الزرار: <code>filledButtonTheme: FilledButtonThemeData(style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48)))</code>.",
      ],
      solution: `import 'package:flutter/material.dart';

class AppTheme {
  const AppTheme._();

  static const _seed = Color(0xFF1565C0);

  static ThemeData light() {
    return _build(ColorScheme.fromSeed(seedColor: _seed));
  }

  static ThemeData dark() {
    return _build(
      ColorScheme.fromSeed(
        seedColor: _seed,
        brightness: Brightness.dark,
      ),
    );
  }

  static ThemeData _build(ColorScheme scheme) {
    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      appBarTheme: const AppBarTheme(centerTitle: true),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size.fromHeight(48),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}

class ThemedApp extends StatelessWidget {
  const ThemedApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      themeMode: ThemeMode.system,
      home: const Scaffold(),
    );
  }
}`,
      explain: "الدالة المشتركة <code>_build</code> بتضمن إن الـ light والـ dark ليهم نفس الـ component themes ويفرقوا في الألوان بس. الـ constructor الخاص <code>AppTheme._()</code> بيمنع إنشاء object من الكلاس لأنه مجرد حاوية لدوال static.",
    },
    {
      title: "مفتاح تبديل الثيم",
      lang: "dart",
      prompt: "<p>اكتب <code>ThemeModeNotifier extends Notifier&lt;ThemeMode&gt;</code> (الافتراضي <code>system</code>) فيه <code>set(ThemeMode)</code> و<code>themeModeProvider</code>. بعد كده <code>ThemeModePicker</code> كـ <code>ConsumerWidget</code> بيعرض <code>SegmentedButton&lt;ThemeMode&gt;</code> فيه تلات اختيارات (system و light و dark) بيقرا القيمة الحالية بـ <code>watch</code> وبيغيرها بـ <code>read</code> لما المستخدم يختار.</p>",
      hints: [
        "<code>SegmentedButton</code> بياخد <code>segments</code> (قايمة <code>ButtonSegment</code> بـ <code>value</code> و<code>label</code>) و<code>selected</code> و<code>onSelectionChanged</code>.",
        "<code>selected</code> هي <code>Set</code> مش قيمة واحدة: <code>{mode}</code>. والـ callback بيرجع <code>Set</code> برضه فخد <code>.first</code>.",
      ],
      solution: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ThemeModeNotifier extends Notifier<ThemeMode> {
  @override
  ThemeMode build() => ThemeMode.system;

  void set(ThemeMode mode) => state = mode;
}

final themeModeProvider =
    NotifierProvider<ThemeModeNotifier, ThemeMode>(
  ThemeModeNotifier.new,
);

class ThemeModePicker extends ConsumerWidget {
  const ThemeModePicker({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mode = ref.watch(themeModeProvider);
    return SegmentedButton<ThemeMode>(
      segments: const [
        ButtonSegment(value: ThemeMode.system, label: Text('System')),
        ButtonSegment(value: ThemeMode.light, label: Text('Light')),
        ButtonSegment(value: ThemeMode.dark, label: Text('Dark')),
      ],
      selected: {mode},
      onSelectionChanged: (selection) {
        ref.read(themeModeProvider.notifier).set(selection.first);
      },
    );
  }
}`,
      explain: "نفس نمط Riverpod من مستوى Riverpod: state في Notifier، <code>watch</code> للعرض، <code>read(...notifier)</code> في الـ callback. لو عايز الاختيار يفضل بعد قفل التطبيق، احفظ القيمة في <code>shared_preferences</code> جوه <code>set</code>.",
    },
    {
      title: "كارت عقار يشتغل عربي وإنجليزي",
      lang: "dart",
      prompt: "<p>اكتب <code>PropertyCard</code> بياخد <code>title</code> و<code>price</code> (<code>double</code>). الكارت فيه <code>Row</code>: مربع صورة 72x72 في الأول (استخدم <code>Container</code> بلون <code>surfaceContainerHighest</code> من الثيم)، وبعده مسافة 12 في اتجاه الـ start، وبعدين العنوان (<code>Expanded</code>) والسعر <code>'$price SAR'</code> في الآخر بستايل <code>titleMedium</code> بلون <code>primary</code>. لازم يشتغل صح في RTL من غير ما تكتب كلمة left ولا right. بعد كده اكتب <code>PropertyList</code> بـ <code>LayoutBuilder</code>: لو العرض أقل من 600 يعرض <code>ListView</code> ولو أكتر يعرض <code>GridView</code> بـ <code>SliverGridDelegateWithMaxCrossAxisExtent(maxCrossAxisExtent: 420)</code>.</p>",
      hints: [
        "المسافة في الـ Row: <code>SizedBox(width: 12)</code> بتشتغل في الاتجاهين لأن الـ Row نفسه بيعكس الترتيب. مفيش داعي لـ left/right أصلا.",
        "الـ Grid محتاج <code>mainAxisExtent: 96</code> جوه الـ delegate عشان الكارت يبقى ارتفاعه ثابت معقول.",
      ],
      solution: `import 'package:flutter/material.dart';

class PropertyCard extends StatelessWidget {
  const PropertyCard({super.key, required this.title, required this.price});

  final String title;
  final double price;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      child: Padding(
        padding: const EdgeInsetsDirectional.all(12),
        child: Row(
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceContainerHighest,
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(child: Text(title, maxLines: 2)),
            Text(
              '$price SAR',
              style: theme.textTheme.titleMedium?.copyWith(
                color: theme.colorScheme.primary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class PropertyList extends StatelessWidget {
  const PropertyList({super.key, required this.titles});

  final List<String> titles;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth < 600) {
          return ListView.builder(
            itemCount: titles.length,
            itemBuilder: (context, i) {
              return PropertyCard(title: titles[i], price: 1000);
            },
          );
        }
        return GridView.builder(
          gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
            maxCrossAxisExtent: 420,
            mainAxisExtent: 96,
          ),
          itemCount: titles.length,
          itemBuilder: (context, i) {
            return PropertyCard(title: titles[i], price: 1000);
          },
        );
      },
    );
  }
}`,
      explain: "الـ <code>Row</code> بيعكس ترتيب أولاده في RTL لوحده، فالصورة بتبقى على اليمين في العربي من غير أي كود. الألوان من الثيم، والعنوان <code>Expanded</code> عشان العنوان الطويل ميعملش overflow. الـ <code>LayoutBuilder</code> بيقيس المساحة المتاحة للقايمة فتشتغل صح حتى لو جوه panel.",
    },
  ],

  quiz: [
    {
      q: "إيه اللي بتعمله <code>ColorScheme.fromSeed(seedColor: x)</code>؟",
      options: [
        "بتغيّر لون الـ AppBar بس",
        "بتحوّل اللون لـ Colors.blue",
        "بتولّد نظام ألوان Material 3 كامل ومتناسق من لون واحد",
        "بتعمل dark mode تلقائي",
      ],
      answer: 2,
      why: "الـ seed بيتولد منه primary و secondary و surface و error وكل ألوان on-xxx. الـ dark mode مش تلقائي: محتاج <code>brightness: Brightness.dark</code> وثيم تاني.",
    },
    {
      q: "المشكلة في الكود ده لما التطبيق يتحول لـ dark mode:",
      code: { lang: "dart", src: `Container(
  color: Theme.of(context).colorScheme.surface,
  child: const Text(
    'Hello',
    style: TextStyle(color: Colors.white),
  ),
)` },
      options: [
        "النص أبيض ثابت فوق surface، وفي الـ light mode هيضيع (والأحسن onSurface من الثيم)",
        "ممنوع تستخدم Container مع الثيم",
        "الـ const مينفعش مع TextStyle",
        "surface مش موجودة في ColorScheme",
      ],
      answer: 0,
      why: "اللون الثابت بيتخانق مع خلفية بتتغير. <code>onSurface</code> هو اللون المصمم يتقري فوق <code>surface</code> في الوضعين.",
    },
    {
      q: "المستخدم ضابط الموبايل على dark، والتطبيق فيه <code>theme</code> و<code>darkTheme</code> من غير ما تحدد <code>themeMode</code>. هيحصل إيه؟",
      options: [
        "يستخدم <code>theme</code> دايما",
        "خطأ وقت التشغيل",
        "يستخدم <code>darkTheme</code> بس لو أول مرة",
        "يستخدم <code>darkTheme</code> لأن الافتراضي <code>ThemeMode.system</code>",
      ],
      answer: 3,
      why: "الافتراضي <code>ThemeMode.system</code> بيتبع إعدادات الجهاز، فيختار <code>darkTheme</code>.",
    },
    {
      q: "أنهي كود الأحسن لمسافة من بداية السطر (الشمال في الإنجليزي واليمين في العربي)؟",
      options: [
        "<code>EdgeInsets.only(left: 16)</code>",
        "<code>EdgeInsetsDirectional.only(start: 16)</code>",
        "<code>EdgeInsets.only(right: 16)</code>",
        "<code>EdgeInsets.symmetric(horizontal: 16)</code>",
      ],
      answer: 1,
      why: "<code>left</code> و<code>right</code> ثابتين لا يتأثروا باتجاه اللغة. <code>start</code> بيتحول لوحده. الـ symmetric مسافتين مش واحدة.",
    },
    {
      q: "الـ <code>AppLocalizations</code> بتتولد من إيه؟",
      options: [
        "ملفات ARB (ملف لكل لغة) عن طريق <code>flutter gen-l10n</code>",
        "ملف Dart بتكتبه بإيدك فيه Map لكل لغة",
        "<code>MaterialApp</code> لوحدها وقت التشغيل",
        "حزمة <code>intl</code> من غير أي إعداد",
      ],
      answer: 0,
      why: "بتكتب ARB، والأداة بتولد الكلاس. محتاج كمان <code>generate: true</code> و<code>l10n.yaml</code> وإضافة الـ delegates في <code>MaterialApp</code>.",
    },
    {
      q: "widget جوه panel جانبي عرضه 300 على تابلت عرضه 1000. عايز الـ widget يختار شكله حسب الـ 300 مش الـ 1000. تستخدم:",
      options: [
        "<code>MediaQuery.sizeOf(context).width</code>",
        "<code>Platform.isAndroid</code>",
        "<code>Theme.of(context)</code>",
        "<code>LayoutBuilder</code> وتقرا <code>constraints.maxWidth</code>",
      ],
      answer: 3,
      why: "<code>MediaQuery</code> بيرجع مقاس النافذة كلها (1000). <code>LayoutBuilder</code> بيرجع اللي أبوه ادّاهاله (300).",
    },
    {
      q: "أقل مقاس موصى بيه (بالـ dp) لمنطقة اللمس في Material؟ (رقم واحد)",
      answer: ["48", "48x48", "48 dp", "48dp"],
      why: "ثابت <code>kMinInteractiveDimension</code> = 48. أي زرار أصغر منه صعب يتضغط خصوصا لكبار السن.",
    },
    {
      q: "ملف ARB ده بالإنجليزي. الناتج لـ <code>propertyCount(1)</code> إيه؟",
      code: { lang: "json", src: `"propertyCount": "{count, plural, =0{No properties} =1{1 property} other{{count} properties}}"` },
      answer: ["1 property", "1 Property"],
      why: "الصيغة <code>=1</code> بتتطابق مع الرقم 1. أي رقم تاني (غير 0) بيروح لـ <code>other</code> وبيتحط فيه الرقم.",
    },
    {
      q: "التطبيق شغال بالعربي (RTL). عندك <code>Row(children: [Icon(Icons.home), Text('Home')])</code>. الأيقونة بتظهر فين؟",
      options: [
        "على الشمال زي الإنجليزي",
        "عند الطرف اليمين، لأن الـ Row بيرتب من start وهو اليمين في RTL",
        "في النص بالظبط",
        "الـ Row بيرمي error في RTL",
      ],
      answer: 1,
      why: "الـ <code>Row</code> بيرتب أولاده حسب <code>Directionality</code> فأول child بيبقى على اليمين في العربي. مفيش كود إضافي مطلوب.",
    },
  ],
};
