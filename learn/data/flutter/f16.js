window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f16"] = {
  slides: [
    {
      kicker: "الصورة الكبيرة",
      title: "هرم الاختبارات في Flutter",
      en: "The testing pyramid: unit, widget, integration",
      body: "<p>الاختبار الآلي معناه كود بيشغّل كودك ويتأكد من النتيجة، فتغيّر في حتة وتعرف في ثواني إنك مكسرتش حتة تانية. فيه تلات أنواع وكل واحد أبطأ وأغلى من اللي قبله:</p>",
      terms: [
        ["Unit test", "اختبار وحدة", "بيختبر دالة أو كلاس لوحده (حسابات، validators، view model، mapper). من غير UI. بيشتغل في ملّي ثواني."],
        ["Widget test", "اختبار widget", "بيبني widget (أو شاشة) في بيئة اختبار من غير موبايل حقيقي، ويدوس ويكتب ويتأكد من اللي ظهر. أسرع بكتير من التطبيق الحقيقي."],
        ["Integration test", "اختبار تكاملي", "بيشغل التطبيق الحقيقي على موبايل أو emulator ويمشي في رحلة كاملة (login ثم فتح عقار). بطيء وهش، فقليل منه."],
      ],
      points: [
        "الهرم: <b>كتير</b> unit، <b>شوية</b> widget، <b>قليل</b> integration.",
        "الاختبارات الكويسة سريعة، ثابتة (نفس النتيجة كل مرة)، ومبتتصلش بشبكة حقيقية ولا ساعة حقيقية.",
        "اللي بيخلي الاختبار سهل هو الكود اللي اتعمل بمعمارية سليمة: logic في classes منفصلة والـ dependencies بتتحقن (repository abstract). ده اللي عملناه في مستوى المعمارية.",
      ],
      interview: [
        { q: "اشرح هرم الاختبارات في Flutter وإيه نسبة كل نوع.", a: "في القاعدة الـ unit tests: كتير وسريعة، بتختبر الـ logic (حسابات، validators، view models، repositories بـ fakes). في النص الـ widget tests: بتبني widget في بيئة اختبار وتتأكد من الواجهة والتفاعل من غير جهاز. في القمة الـ integration tests: بتشغل التطبيق الحقيقي في رحلات حرجة قليلة زي تسجيل الدخول والدفع، وهي بطيئة وهشة. كل ما نزلت في الهرم الاختبار أسرع وأرخص وأدق في تحديد مكان المشكلة." },
      ],
    },
    {
      title: "Unit tests: test و expect و group و setUp",
      en: "test, expect, group, setUp, matchers",
      body: "<p>الاختبار ملف في فولدر <code>test/</code> اسمه ينتهي بـ <code>_test.dart</code>، فيه <code>main()</code> جواه <code>test('وصف', () {...})</code>. الشكل الثابت: <b>Arrange</b> جهز البيانات، <b>Act</b> نفذ، <b>Assert</b> اتأكد بـ <code>expect(actual, matcher)</code>. <code>group</code> بيجمّع اختبارات، و<code>setUp</code> بيشتغل قبل كل اختبار فكل واحد يبدأ بحالة نضيفة.</p>",
      code: {
        lang: "dart",
        title: "test/price_calculator_test.dart",
        src: `import 'package:flutter_test/flutter_test.dart';

class PriceCalculator {
  const PriceCalculator({this.vatRate = 0.15});

  final double vatRate;

  double total(double price) {
    if (price < 0) throw ArgumentError.value(price, 'price');
    return price * (1 + vatRate);
  }
}

void main() {
  group('PriceCalculator', () {
    late PriceCalculator calc;

    setUp(() {
      calc = const PriceCalculator();
    });

    test('adds 15% VAT', () {
      expect(calc.total(100), closeTo(115, 0.001));
    });

    test('zero stays zero', () {
      expect(calc.total(0), 0);
    });

    test('negative price throws', () {
      expect(() => calc.total(-1), throwsArgumentError);
    });
  });
}`,
        note: "<code>closeTo</code> لأن الـ double فيه كسور عشرية (100 * 1.15 مش بالظبط 115). الـ throw بنتأكد منه بـ <b>closure</b> (<code>() => ...</code>) مش بنداء الدالة مباشرة.",
      },
      points: [
        "<b>Matchers الشائعة:</b> <code>equals</code> (الافتراضي لو كتبت قيمة)، <code>isTrue</code>، <code>isNull</code>، <code>isEmpty</code>، <code>hasLength(n)</code>، <code>contains(x)</code>، <code>isA&lt;T&gt;()</code>، <code>throwsA(...)</code>، <code>closeTo(x, delta)</code>.",
        "الاختبار بيتشغل بـ <code>flutter test</code> (كل الاختبارات) أو <code>flutter test test/price_calculator_test.dart</code>.",
      ],
    },
    {
      title: "اختبار الكود الـ async",
      en: "Testing Futures and Streams",
      body: "<p>اختبار async بيتكتب <code>async</code> وبتعمل <code>await</code> للنتيجة. الغلطة الأخطر: تنسى الـ <code>await</code> فالاختبار <b>بيخلص قبل ما الـ assertion تتنفذ</b> وينجح غلط. استخدم <code>await expectLater(...)</code> مع الـ Future والـ Stream.</p>",
      code: {
        lang: "dart",
        title: "async_test.dart",
        src: `import 'package:flutter_test/flutter_test.dart';

Future<int> loadCount() async => 3;
Future<int> failing() async => throw StateError('boom');
Stream<int> ticks() => Stream.fromIterable([1, 2, 3]);

void main() {
  test('future value', () async {
    expect(await loadCount(), 3);
  });

  test('future completes with 3', () async {
    await expectLater(loadCount(), completion(3));
  });

  test('future throws', () async {
    await expectLater(failing(), throwsA(isA<StateError>()));
  });

  test('stream emits in order', () async {
    await expectLater(ticks(), emitsInOrder([1, 2, 3, emitsDone]));
  });
}`,
        note: "الوقت الحقيقي (<code>Future.delayed</code> لثواني) بيبطّئ الاختبار. الأحسن تحقن الـ delay أو تستخدم fake، وفي widget tests تتحكم في الوقت بـ <code>tester.pump(duration)</code>.",
      },
      pitfall: "كتابة <code>expect(failing(), throwsA(...))</code> من غير <code>await</code> أو <code>expectLater</code> في اختبار <code>async</code>: ممكن الاختبار ينتهي قبل ما الـ Future تتفحص. اعمل <code>await expectLater</code> دايما مع الـ Futures والـ Streams.",
    },
    {
      title: "الـ fake أولا، وبعدين mocktail",
      en: "Hand-written fake, then mocktail",
      body: "<p>الـ logic اللي بيكلم repository أو API ميتختبرش بالشبكة الحقيقية. بتديه <b>بديل</b>. فيه نوعين: <b>Fake</b> كلاس بتكتبه بإيدك بيطبق نفس الـ interface وبيرجع بيانات ثابتة وفيه state بسيط. و<b>Mock</b> بيتولد من مكتبة وبتبرمجه (لما يتنادى كذا رجّع كذا) وتتأكد إنه اتنادى فعلا.</p>",
      codes: [
        {
          lang: "dart",
          title: "fake يدوي",
          src: `import 'package:flutter_test/flutter_test.dart';

abstract class PropertyRepository {
  Future<List<String>> fetch();
}

class FakePropertyRepository implements PropertyRepository {
  FakePropertyRepository({this.fail = false});

  final bool fail;

  @override
  Future<List<String>> fetch() async {
    if (fail) throw Exception('offline');
    return ['Villa', 'Apartment'];
  }
}

class PropertiesViewModel {
  PropertiesViewModel(this._repo);

  final PropertyRepository _repo;
  List<String> items = [];
  String? error;

  Future<void> load() async {
    try {
      items = await _repo.fetch();
      error = null;
    } catch (_) {
      error = 'Could not load';
    }
  }
}

void main() {
  test('load fills items', () async {
    final vm = PropertiesViewModel(FakePropertyRepository());
    await vm.load();
    expect(vm.items, ['Villa', 'Apartment']);
    expect(vm.error, isNull);
  });

  test('load failure sets error', () async {
    final vm = PropertiesViewModel(FakePropertyRepository(fail: true));
    await vm.load();
    expect(vm.items, isEmpty);
    expect(vm.error, 'Could not load');
  });
}`,
        },
        {
          lang: "dart",
          title: "mocktail",
          src: `import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

abstract class PropertyRepository {
  Future<List<String>> fetch();
  Future<void> add(String title);
}

class MockPropertyRepository extends Mock implements PropertyRepository {}

void main() {
  late MockPropertyRepository repo;

  setUp(() {
    repo = MockPropertyRepository();
  });

  test('fetch returns stubbed list', () async {
    when(() => repo.fetch()).thenAnswer((_) async => ['Villa']);

    final result = await repo.fetch();

    expect(result, ['Villa']);
    verify(() => repo.fetch()).called(1);
  });

  test('fetch can fail', () {
    when(() => repo.fetch()).thenThrow(Exception('offline'));
    expect(() => repo.fetch(), throwsException);
  });

  test('add is called with the title', () async {
    when(() => repo.add(any())).thenAnswer((_) async {});
    await repo.add('Villa');
    verify(() => repo.add('Villa')).called(1);
    verifyNoMoreInteractions(repo);
  });
}`,
          note: "<b>mocktail</b> حزمة خارجية (<code>flutter pub add dev:mocktail</code>)، من غير code generation. <code>when(() => ...)</code> بتبرمج، <code>verify(() => ...)</code> بتتأكد. لو استخدمت <code>any()</code> مع نوع مخصص (كلاس بتاعك) لازم <code>registerFallbackValue(...)</code> قبله.",
        },
      ],
      interview: [
        { q: "إيه الفرق بين fake و mock؟ وإمتى كل واحد؟", a: "الـ fake كلاس حقيقي صغير بطبق الـ interface بإيدي وفيه سلوك بسيط (بيرجع بيانات ثابتة أو بيخزن في list)، وبستخدمه لما أحتاج بديل يتصرف زي الأصلي، فالاختبار بيتأكد من <b>النتيجة</b>. الـ mock (مثلا mocktail) بيتبرمج بـ <code>when</code> وأتأكد بـ <code>verify</code> إن دالة اتنادت بـ parameters معينة، فبستخدمه لما المهم هو <b>التفاعل</b> (اتبعت طلب؟ اتنادى analytics مرة واحدة؟) أو لما الـ interface كبير ومش عايز أطبقه كله. أبدأ بالـ fake لأنه أسهل وأقل هشاشة." },
      ],
    },
    {
      title: "Widget tests: testWidgets و pump",
      en: "testWidgets, pumpWidget, pump vs pumpAndSettle",
      body: "<p>الـ <code>testWidgets</code> بياخد <code>WidgetTester</code>. بتبني الواجهة بـ <code>pumpWidget</code>، وتدور على widgets بـ <code>find</code>، وتتفاعل (<code>tap</code>, <code>enterText</code>)، وبعد كل تفاعل تنادي <code>pump</code> عشان الواجهة تتبني تاني، وبعدين <code>expect</code>. الـ finders بتتأكد بـ <code>findsOneWidget</code> و<code>findsNothing</code> و<code>findsNWidgets(n)</code>.</p>",
      code: {
        lang: "dart",
        title: "test/counter_test.dart",
        src: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

class CounterPage extends StatefulWidget {
  const CounterPage({super.key});

  @override
  State<CounterPage> createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: Text('$_count')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => setState(() => _count++),
        child: const Icon(Icons.add),
      ),
    );
  }
}

void main() {
  testWidgets('tapping + increments the counter', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: CounterPage()));
    expect(find.text('0'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();

    expect(find.text('1'), findsOneWidget);
    expect(find.text('0'), findsNothing);
  });
}`,
        note: "من غير <code>pump()</code> بعد الـ <code>tap</code> الـ <code>setState</code> اتنادت بس مفيش frame اتبني، فالنص لسه «0».",
      },
      terms: [
        ["tester.pump()", "frame واحد", "بيبني frame واحد. <code>pump(Duration(seconds: 1))</code> بيقدّم الوقت الوهمي كمان."],
        ["tester.pumpAndSettle()", "لحد ما يهدا", "بيكرر <code>pump</code> لحد ما مفيش frames مجدولة (الأنيميشن خلصت). بيستنى الانتقالات والأنيميشن."],
      ],
      pitfall: "<code>pumpAndSettle()</code> مع أنيميشن لا نهائي (<code>CircularProgressIndicator</code> شغال أو <code>repeat()</code>) بيفضل يستنى لحد timeout ويفشل الاختبار. في الحالة دي استخدم <code>pump()</code> أو <code>pump(Duration(milliseconds: 100))</code>.",
      interview: [
        { q: "إيه الفرق بين <code>pump</code> و<code>pumpAndSettle</code>؟", a: "<code>pump()</code> بيبني frame واحد (وممكن أديله duration يقدّم الساعة الوهمية)، فبستخدمه بعد كل تفاعل أو للتحكم الدقيق في الأنيميشن. <code>pumpAndSettle()</code> بيكرر pump لحد ما مفيش أنيميشن ولا frames مجدولة، فمناسب بعد التنقل أو انتقال بينتهي. مشكلته مع الأنيميشن اللي مبيخلصش (loading spinner) لإنه بيفضل يستنى لحد timeout، فهناك بستخدم <code>pump</code> بمدة." },
      ],
    },
    {
      title: "Finders و enterText وتغليف الـ widget",
      en: "Finders, enterText, and wrapping with MaterialApp and providers",
      body: "<p>أغلب الـ widgets محتاجة حاجات من فوق: <code>Theme</code> و<code>MediaQuery</code> و<code>Directionality</code> و<code>Navigator</code>، والـ <code>MaterialApp</code> بيوفرهم. فاغلف الـ widget اللي بتختبره دايما في <code>MaterialApp</code> (وفي <code>ProviderScope</code> لو بيستخدم Riverpod، وفي delegates اللغة لو بيستخدم <code>AppLocalizations</code>). وخلّي لـ widgets الإدخال <code>Key</code> عشان تلاقيها.</p>",
      code: {
        lang: "dart",
        title: "test/login_form_test.dart",
        src: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

class LoginForm extends StatefulWidget {
  const LoginForm({super.key, required this.onSubmit});

  final void Function(String email) onSubmit;

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final _formKey = GlobalKey<FormState>();
  final _email = TextEditingController();

  @override
  void dispose() {
    _email.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            key: const Key('email'),
            controller: _email,
            validator: (v) =>
                (v ?? '').contains('@') ? null : 'Invalid email',
          ),
          ElevatedButton(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                widget.onSubmit(_email.text);
              }
            },
            child: const Text('Login'),
          ),
        ],
      ),
    );
  }
}

Widget wrap(Widget child) {
  return ProviderScope(
    child: MaterialApp(home: Scaffold(body: child)),
  );
}

void main() {
  testWidgets('invalid email shows an error', (tester) async {
    String? sent;
    await tester.pumpWidget(wrap(LoginForm(onSubmit: (e) => sent = e)));

    await tester.enterText(find.byKey(const Key('email')), 'nope');
    await tester.tap(find.text('Login'));
    await tester.pump();

    expect(find.text('Invalid email'), findsOneWidget);
    expect(sent, isNull);
  });

  testWidgets('valid email calls onSubmit', (tester) async {
    String? sent;
    await tester.pumpWidget(wrap(LoginForm(onSubmit: (e) => sent = e)));

    await tester.enterText(find.byKey(const Key('email')), 'a@b.com');
    await tester.tap(find.byType(ElevatedButton));
    await tester.pump();

    expect(sent, 'a@b.com');
    expect(find.text('Invalid email'), findsNothing);
  });
}`,
        note: "الـ finders: <code>find.text</code> و<code>find.byType</code> و<code>find.byKey</code> و<code>find.byIcon</code> و<code>find.widgetWithText</code>. الـ <code>wrap</code> helper بيتكرر في كل ملف اختبار فبتطلعه في ملف مشترك.",
      },
      pitfall: "رسالة «No MediaQuery widget ancestor found» أو «No Material widget found» معناها إنك عملت <code>pumpWidget(MyWidget())</code> من غير <code>MaterialApp</code>/<code>Scaffold</code> حواليه. وأي <code>find.text</code> بتتأثر بالترجمة: ثبّت اللغة في الاختبار (<code>locale: Locale('en')</code>) عشان النصوص تبقى متوقعة.",
    },
    {
      title: "اختبار provider و Cubit",
      en: "ProviderContainer with overrides, Cubit and bloc_test",
      body: "<p>في Riverpod بتختبر الـ logic من غير widgets بـ <code>ProviderContainer</code>: بتديله <code>overrides</code> تبدّل الـ repository بـ fake، وبتقرا وتنادي الـ notifier (ده اللي شفناه في مستوى Riverpod). وفي Bloc الـ Cubit كلاس عادي: بتنادي دوالها وبتراقب الـ <code>stream</code> بتاعها.</p>",
      codes: [
        {
          lang: "dart",
          title: "Riverpod",
          src: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

abstract class NameRepository {
  Future<List<String>> names();
}

class FakeNameRepository implements NameRepository {
  @override
  Future<List<String>> names() async => ['Ali', 'Sara'];
}

final nameRepositoryProvider = Provider<NameRepository>((ref) {
  throw UnimplementedError('override me');
});

final namesProvider = FutureProvider<List<String>>((ref) {
  return ref.watch(nameRepositoryProvider).names();
});

void main() {
  test('namesProvider loads from the fake', () async {
    final container = ProviderContainer.test(
      overrides: [
        nameRepositoryProvider.overrideWithValue(FakeNameRepository()),
      ],
    );

    final names = await container.read(namesProvider.future);

    expect(names, ['Ali', 'Sara']);
  });
}`,
          note: "في اختبار widget نفس الـ <code>overrides</code> بتتحط في <code>ProviderScope(overrides: [...], child: ...)</code>.",
        },
        {
          lang: "dart",
          title: "Cubit",
          src: `import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';

class CounterCubit extends Cubit<int> {
  CounterCubit() : super(0);

  void increment() => emit(state + 1);
}

void main() {
  test('increment emits 1 then 2', () async {
    final cubit = CounterCubit();
    final expectation = expectLater(cubit.stream, emitsInOrder([1, 2]));

    cubit.increment();
    cubit.increment();

    await expectation;
    await cubit.close();
  });

  blocTest<CounterCubit, int>(
    'increment emits [1]',
    build: CounterCubit.new,
    act: (cubit) => cubit.increment(),
    expect: () => [1],
  );
}`,
          note: "<code>blocTest</code> من حزمة <b>bloc_test</b> (<code>flutter pub add dev:bloc_test</code>) بتختصر الشكل ده: <code>build</code> و<code>act</code> و<code>expect</code> (قايمة الـ states اللي اتبعتت).",
        },
      ],
      interview: [
        { q: "إزاي بتختبر Riverpod provider بيعتمد على repository؟", a: "بعمل <code>ProviderContainer.test</code> (أو <code>ProviderContainer</code> وأقفله في <code>tearDown</code>) وبديله <code>overrides</code> بتبدّل <code>repositoryProvider</code> بـ fake بيرجع بيانات ثابتة. بقرا الـ provider أو الـ notifier وأنادي دوالها وأتأكد من الـ state، من غير widgets ولا شبكة. ولو بختبر widget بحط نفس الـ overrides في <code>ProviderScope</code>." },
      ],
    },
    {
      title: "Golden tests",
      en: "Golden tests: matchesGoldenFile",
      body: "<p>الـ golden test بياخد «صورة» للـ widget ويقارنها بصورة محفوظة في المشروع (golden file). لو الواجهة اتغيرت بالغلط بيفشل. بتسجل الصور أول مرة بـ <code>flutter test --update-goldens</code> وبتراجعها بعينك وتعمل commit.</p>",
      code: {
        lang: "dart",
        title: "test/price_tag_golden_test.dart",
        src: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

class PriceTag extends StatelessWidget {
  const PriceTag({super.key});

  @override
  Widget build(BuildContext context) => const Text('2500 SAR');
}

void main() {
  testWidgets('PriceTag looks right', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: Scaffold(body: Center(child: PriceTag()))),
    );

    await expectLater(
      find.byType(PriceTag),
      matchesGoldenFile('goldens/price_tag.png'),
    );
  });
}`,
        note: "حدّث الصور بعد تغيير مقصود: <code>flutter test --update-goldens</code>.",
      },
      points: [
        "الـ rendering بيختلف شوية بين Windows وmacOS وLinux (الخطوط)، فالـ goldens بتتولد وتتقارن على نفس نظام التشغيل (الـ CI عادة).",
        "استخدمها لمكونات الـ design system المستقرة، مش لكل شاشة: بتتكسر بسهولة وبتملا الريبو بصور.",
      ],
    },
    {
      title: "Integration tests",
      en: "integration_test package",
      body: "<p>الـ integration test بيشغل <b>التطبيق الحقيقي</b> على emulator أو جهاز. الحزمة <code>integration_test</code> جاية مع الـ SDK (تضيفها كـ dev dependency من <code>sdk: flutter</code>)، والكود بنفس أسلوب widget test، بس على التطبيق كله وبشبكة وplugins حقيقيين. بتحطه في فولدر <code>integration_test/</code>.</p>",
      code: {
        lang: "dart",
        title: "integration_test/app_test.dart",
        src: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:my_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('user can open the app and see the home screen',
      (tester) async {
    app.main();
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsWidgets);
  });
}

// run on a device or emulator:
// flutter test integration_test`,
        note: "الاختبار ده بيحتاج جهاز، فمش بيشتغل بنفس سرعة unit tests. اربطه بالـ CI بخطوة منفصلة (emulator أو خدمة زي Firebase Test Lab).",
      },
      points: [
        "<b>يستاهل لما:</b> رحلة حرجة (تسجيل دخول، دفع، أول تشغيل) أو تكامل بين plugins وشبكة حقيقية.",
        "<b>مايستاهلش:</b> اختبار كل شاشة أو حالة حدودية: widget test أسرع وأثبت.",
        "الاختبارات دي هشة (توقيتات، شبكة، بيانات)، فاستخدم backend تجريبي وبيانات ثابتة وقلل عددها.",
      ],
      interview: [
        { q: "إمتى تكتب integration test بدل widget test؟", a: "الـ widget test بيبني شاشة معزولة بدون جهاز وبـ fakes، فهو الأسرع والأثبت، وبستخدمه لمعظم سلوك الواجهة. الـ integration test (حزمة <code>integration_test</code>) بشغل فيه التطبيق الحقيقي على جهاز، فبكتبه لعدد قليل من الرحلات الحرجة اللي فيها تكامل حقيقي بين الشاشات والشبكة والـ plugins، زي تسجيل الدخول ثم فتح عقار. وبقلل عددها لأنها بطيئة وبتتكسر بسبب الشبكة والتوقيتات." },
      ],
    },
    {
      title: "أختبر إيه الأول؟ والـ coverage",
      en: "What to test first in an existing app, and coverage",
      body: "<p>تطبيق موجود من غير اختبارات؟ متحاولش تغطي كل حاجة. ابدأ بالأعلى قيمة والأرخص تكلفة:</p>",
      points: [
        "<b>1. الـ logic النقي:</b> حسابات الأسعار، الـ validators، تحويل JSON لموديل (الـ mappers)، تنسيق التواريخ. unit tests سريعة جدا.",
        "<b>2. الـ view models / notifiers / cubits:</b> الـ state بتتغير صح للنجاح والفشل (بـ fake للـ repository).",
        "<b>3. اللي اتكسر قبل كده:</b> كل bug حقيقي تصلحه، اكتب اختبار بيفشل بيه الأول ثم صلحه. ده regression test.",
        "<b>4. الـ widgets الحرجة:</b> فورم تسجيل الدخول والدفع بـ widget test.",
        "<b>5. أخيرا:</b> واحد أو اتنين integration tests للرحلات الأساسية.",
        "<b>Coverage:</b> <code>flutter test --coverage</code> بيطلّع ملف <code>coverage/lcov.info</code> (وتحوله لتقرير HTML بأداة <code>genhtml</code>). الرقم بيقولك إيه اللي <b>مجربتوش</b>، مش إن الباقي سليم. هدف 100% بيدفعك تكتب اختبارات ملهاش قيمة.",
      ],
      focus: [{ label: "احفظها", text: "اختبار واحد بيفشل قبل الإصلاح وبينجح بعده أحسن من عشرة اختبارات بتغطي سطور وخلاص." }],
      interview: [
        { q: "ورّثوك تطبيق من غير ولا اختبار. تبدأ منين؟", a: "مش هبدأ بتغطية شاملة. هبدأ بالـ logic النقي اللي سهل يتختبر وتكلفة غلطه عالية: الحسابات والـ validators والـ mappers، ثم الـ view models/notifiers بـ fakes للـ repositories. وأي bug بصلحه بكتب له regression test الأول. بعد كده widget tests للشاشات الحرجة زي login والدفع، وفي الآخر اتنين تلاتة integration tests للرحلات الأساسية. واستخدم الـ coverage عشان أشوف المناطق المنسية مش كهدف رقمي." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: group و setUp و expect",
      lang: "dart",
      code: `void main() {
  group('Cart', () {
    late Cart cart;

    setUp(() {
      cart = Cart();
    });

    test('starts empty', () {
      expect(cart.items, isEmpty);
    });

    test('add increases the count', () {
      cart.add('Villa');
      expect(cart.items, hasLength(1));
    });
  });
}`,
      note: "كل <code>test</code> بياخد <code>Cart</code> جديدة من <code>setUp</code>، فمفيش اختبار بيأثر على التاني.",
    },
    {
      title: "اكتب: widget test بسيط",
      lang: "dart",
      code: `void main() {
  testWidgets('tap + increments', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: CounterPage()),
    );
    expect(find.text('0'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();

    expect(find.text('1'), findsOneWidget);
  });
}`,
    },
    {
      title: "اكتب: mock بـ mocktail",
      lang: "dart",
      code: `abstract class Api {
  Future<List<String>> names();
}

class MockApi extends Mock implements Api {}

void main() {
  test('names returns the stub', () async {
    final api = MockApi();
    when(() => api.names()).thenAnswer((_) async => ['Ali']);

    final result = await api.names();

    expect(result, ['Ali']);
    verify(() => api.names()).called(1);
  });
}`,
    },
  ],

  tasks: [
    {
      title: "اختبارات للـ validators",
      lang: "dart",
      prompt: "<p>عندك كلاس <code>Validators</code> فيه دالتين static: <code>email(String?)</code> و<code>password(String?)</code>، كل واحدة بترجع <code>null</code> لو سليمة أو رسالة خطأ <code>String</code>. اكتب ملف اختبار بـ <code>group</code> لكل دالة: الإيميل (فاضي / من غير @ / سليم) والباسورد (أقل من 8 / 8 أو أكتر / null). كل اختبار بيوصف السلوك في اسمه.</p>",
      starter: `class Validators {
  static String? email(String? v) {
    if (v == null || v.trim().isEmpty) return 'Email is required';
    if (!v.contains('@')) return 'Invalid email';
    return null;
  }

  static String? password(String? v) {
    if (v == null || v.length < 8) return 'At least 8 characters';
    return null;
  }
}`,
      hints: [
        "اتأكد من النتيجة بـ <code>expect(Validators.email(''), 'Email is required')</code> وللسليم <code>isNull</code>.",
        "جوه <code>main()</code> اعمل <code>group('Validators.email', () {...})</code> و<code>group('Validators.password', () {...})</code>.",
      ],
      solution: `import 'package:flutter_test/flutter_test.dart';

class Validators {
  static String? email(String? v) {
    if (v == null || v.trim().isEmpty) return 'Email is required';
    if (!v.contains('@')) return 'Invalid email';
    return null;
  }

  static String? password(String? v) {
    if (v == null || v.length < 8) return 'At least 8 characters';
    return null;
  }
}

void main() {
  group('Validators.email', () {
    test('empty email is required', () {
      expect(Validators.email(''), 'Email is required');
    });

    test('whitespace only is required', () {
      expect(Validators.email('   '), 'Email is required');
    });

    test('missing @ is invalid', () {
      expect(Validators.email('nope'), 'Invalid email');
    });

    test('valid email returns null', () {
      expect(Validators.email('a@b.com'), isNull);
    });
  });

  group('Validators.password', () {
    test('null is rejected', () {
      expect(Validators.password(null), 'At least 8 characters');
    });

    test('7 characters is rejected', () {
      expect(Validators.password('1234567'), isNotNull);
    });

    test('8 characters is accepted', () {
      expect(Validators.password('12345678'), isNull);
    });
  });
}`,
      explain: "الحدود (boundary) هي أهم حاجة: 7 مرفوض و8 مقبول، وnull، والمسافات بس. اسم الاختبار بيوصف السلوك فلما يفشل تعرف من الاسم إيه اللي اتكسر. ده أرخص نوع اختبار وأعلى فايدة.",
    },
    {
      title: "اختبار widget لزرار المفضلة",
      lang: "dart",
      prompt: "<p>عندك <code>FavoriteButton</code> (<code>StatefulWidget</code>) بيعرض <code>IconButton</code> بأيقونة <code>Icons.favorite_border</code> وبعد الضغط بتبقى <code>Icons.favorite</code>، وبيستدعي <code>onChanged(bool)</code> بالقيمة الجديدة. اكتب <code>testWidgets</code> يتأكد من التلات حاجات: الأيقونة الابتدائية، الأيقونة بعد الضغط، والقيمة اللي وصلت للـ <code>onChanged</code>. واغلف الـ widget في <code>MaterialApp</code>.</p>",
      starter: `class FavoriteButton extends StatefulWidget {
  const FavoriteButton({super.key, required this.onChanged});

  final ValueChanged<bool> onChanged;

  @override
  State<FavoriteButton> createState() => _FavoriteButtonState();
}

class _FavoriteButtonState extends State<FavoriteButton> {
  bool _on = false;

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Icon(_on ? Icons.favorite : Icons.favorite_border),
      onPressed: () {
        setState(() => _on = !_on);
        widget.onChanged(_on);
      },
    );
  }
}`,
      hints: [
        "حط متغير <code>bool? last;</code> قبل الـ pump واعمل <code>onChanged: (v) => last = v</code>.",
        "بعد <code>tester.tap(find.byType(IconButton))</code> لازم <code>await tester.pump()</code> قبل ما تدور على الأيقونة الجديدة.",
      ],
      solution: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

class FavoriteButton extends StatefulWidget {
  const FavoriteButton({super.key, required this.onChanged});

  final ValueChanged<bool> onChanged;

  @override
  State<FavoriteButton> createState() => _FavoriteButtonState();
}

class _FavoriteButtonState extends State<FavoriteButton> {
  bool _on = false;

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Icon(_on ? Icons.favorite : Icons.favorite_border),
      onPressed: () {
        setState(() => _on = !_on);
        widget.onChanged(_on);
      },
    );
  }
}

void main() {
  testWidgets('tap toggles the icon and reports the value', (tester) async {
    bool? last;
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: FavoriteButton(onChanged: (v) => last = v),
        ),
      ),
    );

    expect(find.byIcon(Icons.favorite_border), findsOneWidget);
    expect(find.byIcon(Icons.favorite), findsNothing);

    await tester.tap(find.byType(IconButton));
    await tester.pump();

    expect(find.byIcon(Icons.favorite), findsOneWidget);
    expect(find.byIcon(Icons.favorite_border), findsNothing);
    expect(last, isTrue);
  });
}`,
      explain: "اختبار واحد بيغطي: الحالة الأولى، التفاعل، النتيجة المرئية، والـ callback. الـ <code>pump()</code> بعد <code>tap</code> ضرورية. وبنتأكد من الاتنين: ظهور الأيقونة الجديدة واختفاء القديمة (<code>findsNothing</code>).",
    },
    {
      title: "اختبار view model بـ mocktail",
      lang: "dart",
      prompt: "<p>عندك <code>UserRepository</code> (abstract) فيه <code>Future&lt;String&gt; name(int id)</code>، و<code>ProfileViewModel</code> بياخد الـ repo وفيه <code>title</code> (<code>String?</code>) و<code>error</code> (<code>String?</code>) و<code>load(int id)</code>. اكتب اختبارين بـ <code>mocktail</code>: النجاح (يضبط <code>title</code> ويتأكد إن الـ repo اتنادى مرة واحدة بالـ id الصح) والفشل (الـ repo يرمي Exception فيبقى <code>error</code> غير null و<code>title</code> بـ null).</p>",
      starter: `abstract class UserRepository {
  Future<String> name(int id);
}

class ProfileViewModel {
  ProfileViewModel(this._repo);

  final UserRepository _repo;
  String? title;
  String? error;

  Future<void> load(int id) async {
    try {
      title = await _repo.name(id);
      error = null;
    } catch (e) {
      title = null;
      error = 'Failed';
    }
  }
}`,
      hints: [
        "<code>class MockUserRepository extends Mock implements UserRepository {}</code> وبرمج بـ <code>when(() =&gt; repo.name(7)).thenAnswer((_) async =&gt; 'Hamza')</code>.",
        "للفشل: <code>thenThrow(Exception('boom'))</code> (لدالة async ممكن كمان <code>thenAnswer((_) async =&gt; throw Exception())</code>).",
      ],
      solution: `import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

abstract class UserRepository {
  Future<String> name(int id);
}

class ProfileViewModel {
  ProfileViewModel(this._repo);

  final UserRepository _repo;
  String? title;
  String? error;

  Future<void> load(int id) async {
    try {
      title = await _repo.name(id);
      error = null;
    } catch (e) {
      title = null;
      error = 'Failed';
    }
  }
}

class MockUserRepository extends Mock implements UserRepository {}

void main() {
  late MockUserRepository repo;
  late ProfileViewModel vm;

  setUp(() {
    repo = MockUserRepository();
    vm = ProfileViewModel(repo);
  });

  test('load success sets the title', () async {
    when(() => repo.name(7)).thenAnswer((_) async => 'Hamza');

    await vm.load(7);

    expect(vm.title, 'Hamza');
    expect(vm.error, isNull);
    verify(() => repo.name(7)).called(1);
  });

  test('load failure sets the error', () async {
    when(() => repo.name(any())).thenAnswer(
      (_) async => throw Exception('boom'),
    );

    await vm.load(7);

    expect(vm.title, isNull);
    expect(vm.error, 'Failed');
  });
}`,
      explain: "الـ <code>setUp</code> بيعمل mock و view model جداد لكل اختبار. <code>verify(...).called(1)</code> بتثبت إن الـ view model كلّم الـ repo بالـ id الصح. وللأخطاء في دالة async الأضمن <code>thenAnswer((_) async =&gt; throw ...)</code> عشان الـ Future نفسها هي اللي ترمي.",
    },
  ],

  quiz: [
    {
      q: "أنهي نوع المفروض يبقى هو الأكتر عددا في مشروع سليم؟",
      options: [
        "Integration tests لأنها بتختبر التطبيق الحقيقي",
        "Golden tests لأنها بتغطي الشكل",
        "Unit tests لأنها سريعة ودقيقة في تحديد المشكلة",
        "Manual QA",
      ],
      answer: 2,
      why: "الهرم: قاعدته unit tests (كتير وسريعة)، فوقها widget tests، وفي القمة integration tests قليلة لأنها بطيئة وهشة.",
    },
    {
      q: "اختبار widget فيه <code>CircularProgressIndicator</code> شغال، وبعد <code>pumpAndSettle()</code> بيفشل بـ timeout. ليه؟",
      options: [
        "الـ spinner أنيميشن بيفضل متجدد، فالـ pumpAndSettle مبتهداش أبدا، والأنسب <code>pump(Duration)</code>",
        "pumpAndSettle مينفعش في widget tests",
        "لازم تنادي pumpWidget مرتين",
        "المشكلة في الـ MaterialApp",
      ],
      answer: 0,
      why: "<code>pumpAndSettle</code> بتكرر pump لحد ما مفيش frames مجدولة. الـ spinner بيجدول frame في كل مرة، فمبتخلصش.",
    },
    {
      q: "الاختبار ده بينجح دايما حتى لو الدالة مش بترمي. المشكلة فين؟",
      code: { lang: "dart", src: `test('throws', () async {
  expect(failing(), throwsA(isA<StateError>()));
});` },
      options: [
        "<code>isA</code> مينفعش مع <code>throwsA</code>",
        "الاختبار لازم يكون من غير <code>async</code>",
        "<code>failing()</code> لازم تتنادى جوه closure",
        "مفيش <code>await</code> أو <code>expectLater</code> فالاختبار ممكن يخلص قبل ما الـ Future تتفحص",
      ],
      answer: 3,
      why: "الـ matcher للـ Future بيشتغل بشكل غير متزامن. من غير <code>await expectLater(...)</code> الاختبار بيخلص قبل التحقق.",
    },
    {
      q: "في <code>expect(find.text('Save'), findsOneWidget)</code> الشاشة فيها زرارين مكتوب عليهم «Save». النتيجة؟",
      options: [
        "ينجح لأن فيه widget واحد على الأقل",
        "يفشل لأن <code>findsOneWidget</code> بتطلب واحد بالظبط",
        "يرمي خطأ compile",
        "يرجع أول واحد منهم",
      ],
      answer: 1,
      why: "<code>findsOneWidget</code> = واحد بالظبط. للأكتر استخدم <code>findsNWidgets(2)</code> أو <code>findsWidgets</code> (واحد أو أكتر).",
    },
    {
      q: "إيه الفرق الأساسي بين fake يدوي و mock من mocktail؟",
      options: [
        "الـ fake بطبق الـ interface بسلوك بسيط والاختبار بيتأكد من النتيجة، والـ mock بيتبرمج بـ when وبيتأكد من التفاعلات بـ verify",
        "الـ fake أسرع في التنفيذ دايما",
        "الـ mock مينفعش يرمي exceptions",
        "مفيش فرق، دي أسماء لنفس الشيء",
      ],
      answer: 0,
      why: "الاتنين بديل للـ dependency، بس الـ fake له سلوك حقيقي مبسط، والـ mock بيسجل النداءات وتبرمجه لكل اختبار.",
    },
    {
      q: "أمر تحديث صور الـ golden tests؟ (اكتب الـ flag)",
      answer: ["--update-goldens", "flutter test --update-goldens"],
      why: "<code>flutter test --update-goldens</code> بيعيد توليد الصور. راجعها بعينك قبل الـ commit.",
    },
    {
      q: "اختبار widget بيفشل بـ «No MediaQuery widget ancestor found». الحل؟",
      options: [
        "إضافة <code>await tester.pumpAndSettle()</code>",
        "استخدام <code>find.byType</code> بدل <code>find.text</code>",
        "تغليف الـ widget في <code>MaterialApp</code> (و<code>Scaffold</code> لو لازم)",
        "تحويل الاختبار لـ unit test",
      ],
      answer: 2,
      why: "الـ MediaQuery والـ Theme والـ Directionality بييجوا من <code>MaterialApp</code>. من غيره الـ widget بيدور عليهم فوقه ومبيلاقيش.",
    },
    {
      q: "إزاي تبدّل الـ repository بـ fake في اختبار notifier بـ Riverpod من غير ما تغير الكود؟",
      options: [
        "بتعدل ملف الـ provider وتحط الـ fake",
        "بتستخدم <code>setState</code>",
        "بتمسح الـ provider وتكتب واحد جديد",
        "بتديه <code>overrides</code> في <code>ProviderContainer</code> (أو <code>ProviderScope</code>)",
      ],
      answer: 3,
      why: "الـ overrides بتستبدل أي provider وقت الاختبار بس، وده سبب إن الـ repository لازم يتقرا من provider.",
    },
    {
      q: "اسم الملف اللي <code>flutter test --coverage</code> بيطلّعه في فولدر <code>coverage/</code>؟",
      answer: ["lcov.info", "coverage/lcov.info"],
      why: "ملف <code>lcov.info</code> هو اللي بتحوله لتقرير HTML بـ <code>genhtml</code> أو بتبعته لخدمة coverage.",
    },
  ],
};
