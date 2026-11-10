window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f9"] = {
  slides: [
    {
      kicker: "الفكرة",
      title: "Bloc: events داخلة، states خارجة، اتجاه واحد",
      en: "The idea of Bloc",
      body: "<p>Bloc (اختصار Business Logic Component) أسلوب بيفصل الـ UI عن الـ logic بقاعدة صارمة: الـ UI <b>بتبعت</b> events (أو بتنادي دوال) للـ bloc، والـ bloc <b>بيطلع</b> states جديدة، والـ UI <b>بترسم</b> الـ state بس. الداتا بتمشي في اتجاه واحد، والـ UI عمرها ما بتعدل الـ state بنفسها.</p><p>الشرح هنا على حزمة <b>flutter_bloc 9.1.1</b> (فوقها <code>bloc</code>) ومعاها حزمة <b>equatable 3.0.0</b>. التلاتة حزم خارجية بتضيفها بـ <code>flutter pub add flutter_bloc equatable</code>.</p>",
      points: [
        "<b>UI → event → Bloc → state → UI.</b> مفيش طريق تاني. ده بيخلي أي شاشة تقدر تتتبع: لو الـ state غلط، بتبص على الـ event اللي سببها.",
        "الـ bloc كلاس Dart عادي من غير widgets، فبتختبره بسهولة (<code>bloc_test</code> حزمة اختبار مخصوصة).",
        "جوه الـ bloc فيه <code>Stream</code> من الـ states. الـ <code>BlocBuilder</code> بيسمعه ويرسم آخر state.",
        "فيه نوعين: <b>Cubit</b> (بسيط، دوال + <code>emit</code>) و<b>Bloc</b> (events + <code>on&lt;Event&gt;</code>). كلاهما بيطلع states.",
      ],
      interview: [
        { q: "اشرح فكرة Bloc في جملتين.", a: "Bloc بيفصل الـ UI عن الـ business logic بتدفق في اتجاه واحد: الـ UI بتبعت events للـ bloc، والـ bloc بيحولها لـ states جديدة (immutable) بيطلعها في Stream، والـ UI بترسم آخر state بـ <code>BlocBuilder</code>. الـ UI مبتعدلش الـ state بنفسها، فالسلوك متوقع وسهل الاختبار والتتبع." },
      ],
    },
    {
      title: "Cubit: دوال و emit",
      en: "Cubit and emit",
      body: "<p>الـ <code>Cubit&lt;State&gt;</code> أبسط شكل: كلاس بتورثه وبتمرر الـ state المبدئية لـ <code>super</code>، وبتكتب دوال عادية بتنادي <code>emit(newState)</code>. كل <code>emit</code> بيطلع state جديدة للـ UI. تقدر تقرا الـ state الحالية بـ <code>state</code>.</p>",
      code: {
        lang: "dart",
        title: "counter_cubit.dart",
        src: `import 'package:flutter_bloc/flutter_bloc.dart';

class CounterCubit extends Cubit<int> {
  CounterCubit() : super(0);

  void increment() => emit(state + 1);

  void decrement() {
    if (state == 0) return;
    emit(state - 1);
  }

  void reset() => emit(0);
}

// UI side:
// context.read<CounterCubit>().increment();`,
        note: "الـ state هنا <code>int</code>. لو الـ state معقدة تحولها لكلاس (الشريحة اللي جاية). الـ UI بتنادي دوال بس، ومتلمسش الرقم.",
      },
      pitfall: "نسيان إن الـ state لازم تتغير بـ <code>emit</code>. تعديل حقل جوه الـ state الحالية (<code>state.items.add(x)</code>) من غير emit state جديدة مش هيحدّث الشاشة، ولو emit نفس الكائن ما يتعملش rebuild.",
    },
    {
      title: "Bloc: events و on",
      en: "Bloc with events and on<Event>",
      body: "<p>الـ <code>Bloc&lt;Event, State&gt;</code> زي Cubit بس بدل ما تنادي دالة، بتبعت <b>event</b> كائن بـ <code>bloc.add(event)</code>. جوه الـ constructor بتسجل handler لكل نوع event بـ <code>on&lt;EventType&gt;((event, emit) { ... })</code>. الميزة: كل حاجة حصلت مسجلة كـ events (سهل تتبعها وتعمل logging)، وتقدر تتحكم في طريقة معالجتها (<code>transformer</code>) زي debounce أو restartable (من حزمة <code>bloc_concurrency</code>).</p>",
      code: {
        lang: "dart",
        title: "counter_bloc.dart",
        src: `import 'package:flutter_bloc/flutter_bloc.dart';

sealed class CounterEvent {}

class Incremented extends CounterEvent {}

class Decremented extends CounterEvent {}

class Reset extends CounterEvent {
  Reset({this.to = 0});
  final int to;
}

class CounterBloc extends Bloc<CounterEvent, int> {
  CounterBloc() : super(0) {
    on<Incremented>((event, emit) => emit(state + 1));
    on<Decremented>((event, emit) => emit(state - 1));
    on<Reset>((event, emit) => emit(event.to));
  }
}

// UI side:
// context.read<CounterBloc>().add(Incremented());`,
        note: "الـ events <code>sealed</code> فالمترجم يعرف كل الأنواع. الـ handler ممكن يكون <code>async</code> ويعمل <code>await</code> وبعدين emit.",
      },
      terms: [
        ["Cubit", "الشكل البسيط", "دوال + <code>emit</code>. مفيش events. الأنسب لمعظم الحالات (فورم، عداد، فلتر)."],
        ["Bloc", "الشكل بالـ events", "<code>add(event)</code> + <code>on&lt;E&gt;</code>. الأنسب لما محتاج تتبع الأحداث أو تحكم في المعالجة (search بـ debounce، منع الضغط المتكرر)."],
      ],
      interview: [
        { q: "إيه الفرق بين Cubit و Bloc؟ وإمتى تختار كل واحد؟", a: "Cubit بتنادي دوال عليه مباشرة وهو بيعمل <code>emit</code> للـ state، فهو أبسط وأقل boilerplate. Bloc بتبعت له events بـ <code>add</code> وهو بيحولها لـ states عبر <code>on&lt;Event&gt;</code>، فبيدّيك سجل بالأحداث ويقدر يطبق transformers زي debounce أو restartable. أبدأ بـ Cubit، وأروح لـ Bloc لما أحتاج تتبع الأحداث أو التحكم في تزامن معالجتها." },
      ],
    },
    {
      title: "الـ states: immutable مع Equatable",
      en: "Immutable states, copyWith, sealed classes, Equatable",
      body: "<p>الـ state لازم <b>immutable</b>: كل حقل <code>final</code>، وكل تغيير بيعمل كائن جديد. فيه شكلين: (1) كلاس واحد فيه حقول و<code>copyWith</code> (الشاشة فيها داتا + loading + error مع بعض). (2) <code>sealed class</code> بأنواع فرعية (Initial / Loading / Success / Failure) وده أنضف لما الحالات بتستبعد بعضها.</p><p><b>Equatable</b> حزمة صغيرة بتخلي <code>==</code> و<code>hashCode</code> يتحسبوا من <code>props</code> بدل المرجع. ليه مهم؟ الـ bloc بيتجاهل <code>emit</code> لو الـ state الجديدة <code>==</code> القديمة، فمن غير Equatable كل كائن جديد بنفس القيم هيعمل rebuild، ومعاها لو القيم متغيرتش مفيش rebuild.</p>",
      codes: [
        {
          lang: "dart",
          title: "كلاس واحد + copyWith",
          src: `import 'package:equatable/equatable.dart';

class ProfileState extends Equatable {
  const ProfileState({this.name = '', this.loading = false});

  final String name;
  final bool loading;

  ProfileState copyWith({String? name, bool? loading}) {
    return ProfileState(
      name: name ?? this.name,
      loading: loading ?? this.loading,
    );
  }

  @override
  List<Object?> get props => [name, loading];
}`,
        },
        {
          lang: "dart",
          title: "sealed states",
          src: `import 'package:equatable/equatable.dart';

sealed class LoginState extends Equatable {
  const LoginState();

  @override
  List<Object?> get props => [];
}

class LoginInitial extends LoginState {
  const LoginInitial();
}

class LoginLoading extends LoginState {
  const LoginLoading();
}

class LoginSuccess extends LoginState {
  const LoginSuccess(this.token);
  final String token;

  @override
  List<Object?> get props => [token];
}

class LoginFailure extends LoginState {
  const LoginFailure(this.message);
  final String message;

  @override
  List<Object?> get props => [message];
}`,
        },
      ],
      pitfall: "نسيان حقل في <code>props</code>: الـ state اتغير لكن Equatable شايفها نفس القديمة، فالشاشة مش بتتحدث. كل حقل بيأثر على الرسم لازم يكون في <code>props</code>.",
      interview: [
        { q: "ليه بنستخدم Equatable في الـ states؟ وإيه بيحصل لو emit الـ bloc نفس الـ state مرتين؟", a: "Equatable بتخلي المقارنة بـ <code>==</code> على القيم (props) مش على المرجع. الـ bloc بيتجاهل الـ emit لو الـ state الجديدة <code>==</code> الحالية، فمن غير Equatable كل كائن جديد بنفس القيم هيعمل rebuild من غير داعي، ومعاها لا. لازم أحط كل الحقول في <code>props</code> وإلا التغيير مش هيتحس." },
      ],
    },
    {
      title: "BlocProvider و BlocBuilder و read / watch",
      en: "BlocProvider, BlocBuilder, context.read, context.watch",
      body: "<p><code>BlocProvider</code> بيعمل الـ bloc ويحطه في الشجرة (نفس فكرة <code>provider</code> اللي عرفتها) وبيعمل له <code>close()</code> تلقائي. <code>BlocBuilder</code> بيسمع الـ state ويعيد بناء الجزء بتاعه. <code>context.read&lt;B&gt;()</code> بتجيب الـ bloc من غير اشتراك (للأوامر في callbacks)، و<code>context.watch&lt;B&gt;()</code> بتجيبه وتعمل rebuild لما الـ state تتغير (جوه build بس).</p>",
      code: {
        lang: "dart",
        title: "counter_page.dart",
        src: `class CounterPage extends StatelessWidget {
  const CounterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => CounterCubit(),
      child: const CounterView(),
    );
  }
}

class CounterView extends StatelessWidget {
  const CounterView({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        BlocBuilder<CounterCubit, int>(
          builder: (context, count) => Text('Count: $count'),
        ),
        TextButton(
          onPressed: () => context.read<CounterCubit>().increment(),
          child: const Text('Add'),
        ),
      ],
    );
  }
}`,
        note: "الـ <code>CounterView</code> لازم يكون تحت الـ <code>BlocProvider</code> (widget منفصل) عشان الـ <code>context</code> بتاعه يشوف الـ bloc.",
      },
      points: [
        "<b>الإغلاق:</b> <code>BlocProvider(create: ...)</code> بيقفل الـ bloc لما يتشال من الشجرة. <code>BlocProvider.value(value: bloc, ...)</code> بيستخدم bloc موجود <b>ومبيقفلوش</b>، يستخدم لما تمرر نفس الـ bloc لشاشة جديدة.",
        "<code>BlocBuilder</code> يتحط على أصغر جزء ممكن. <code>context.watch</code> في widget كبير بيبني كله من جديد.",
        "لو الـ bloc اتقفل (<code>close()</code>) وحاولت <code>emit</code>/<code>add</code> هيرمي <code>StateError</code>؛ اتأكد بـ <code>if (isClosed) return;</code> بعد أي <code>await</code>.",
      ],
      interview: [
        { q: "إيه الفرق بين context.read و context.watch في flutter_bloc؟ ومين بيقفل الـ bloc؟", a: "<code>read</code> بتجيب الـ bloc من غير اشتراك وبتتستخدم في الـ callbacks زي <code>onPressed</code> لتنفيذ أوامر. <code>watch</code> بتجيبه وبتشترك فالـ widget بيتبني من جديد مع كل state جديدة، وبتتستخدم في build بس. الـ <code>BlocProvider(create:)</code> بيقفل الـ bloc تلقائي لما يتشال من الشجرة، أما <code>BlocProvider.value</code> مبيقفلوش لأن صاحبه مكان تاني." },
      ],
    },
    {
      title: "BlocListener و BlocConsumer و buildWhen",
      en: "BlocListener, BlocConsumer, buildWhen, listenWhen",
      body: "<p>الـ <code>BlocBuilder</code> للرسم بس (ممنوع جواه أي أثر جانبي زي SnackBar أو navigation لأن الـ builder ممكن يتنادى كتير). للأثر الجانبي استخدم <code>BlocListener</code> (بينفذ callback مرة لكل state جديدة من غير ما يبني UI). و<code>BlocConsumer</code> بيجمع الاتنين في widget واحد.</p><p>والفلترة: <code>buildWhen</code> بتقرر هل الـ builder يتنادى (بتاخد <code>previous</code> و<code>current</code>)، و<code>listenWhen</code> نفس الفكرة للـ listener.</p>",
      code: {
        lang: "dart",
        title: "login_button.dart",
        src: `class LoginButton extends StatelessWidget {
  const LoginButton({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<LoginCubit, LoginState>(
      listenWhen: (previous, current) => current is LoginFailure,
      listener: (context, state) {
        if (state is LoginFailure) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.message)),
          );
        }
      },
      buildWhen: (previous, current) => previous != current,
      builder: (context, state) {
        final loading = state is LoginLoading;
        return ElevatedButton(
          onPressed: loading
              ? null
              : () => context.read<LoginCubit>().login('a@b.c', '123'),
          child: loading
              ? const CircularProgressIndicator()
              : const Text('Login'),
        );
      },
    );
  }
}`,
        note: "الـ SnackBar في <code>listener</code> (مرة لكل فشل)، والزرار في <code>builder</code>. الـ <code>listenWhen</code> بيتجاهل باقي الـ states.",
      },
      interview: [
        { q: "إيه الفرق بين BlocBuilder و BlocListener و BlocConsumer؟", a: "<code>BlocBuilder</code> بيعيد بناء UI حسب الـ state، ومينفعش فيه أثر جانبي. <code>BlocListener</code> بينفذ callback عند كل state جديدة (SnackBar، navigation، dialog) من غير ما يرجع widget، والـ callback بيتنادى مرة واحدة لكل state. <code>BlocConsumer</code> بيجمع الاتنين. الاتنين بياخدوا شرط (<code>buildWhen</code> / <code>listenWhen</code>) بيقارن previous بـ current عشان نحدد إمتى نبني أو نسمع." },
      ],
    },
    {
      title: "flow كامل: تسجيل دخول",
      en: "Login flow: loading, success, failure",
      body: "<p>أشهر مثال في المقابلات. الـ cubit بياخد repository (dependency injection بالـ constructor)، وبيطلع state <code>Loading</code> قبل الطلب، وبعدين <code>Success</code> أو <code>Failure</code>. لاحظ إن الاستثناء المتوقع (<code>AuthException</code>) بيتحول لرسالة مفهومة، وأي استثناء تاني بيتحول لرسالة عامة.</p>",
      code: {
        lang: "dart",
        title: "login_cubit.dart",
        src: `class AuthException implements Exception {
  const AuthException(this.message);
  final String message;
}

abstract class AuthRepository {
  Future<String> login(String email, String password);
}

class LoginCubit extends Cubit<LoginState> {
  LoginCubit(this._repo) : super(const LoginInitial());

  final AuthRepository _repo;

  Future<void> login(String email, String password) async {
    emit(const LoginLoading());
    try {
      final token = await _repo.login(email, password);
      if (isClosed) return;
      emit(LoginSuccess(token));
    } on AuthException catch (e) {
      if (isClosed) return;
      emit(LoginFailure(e.message));
    } catch (_) {
      if (isClosed) return;
      emit(const LoginFailure('Something went wrong'));
    }
  }
}`,
        note: "الـ states هي الـ sealed classes اللي فاتت. الـ UI بتعمل <code>switch</code> على الـ state، والـ cubit هو الوحيد اللي بيعرف إزاي نعمل login.",
      },
      pitfall: "بعد <code>await</code> الـ cubit ممكن يكون اتقفل (المستخدم خرج من الشاشة)، و<code>emit</code> بعد <code>close</code> بيرمي <code>StateError</code>. اتأكد بـ <code>isClosed</code> زي المثال. وأي حقل مش في <code>props</code> بيخلي الـ rebuild يتجاهل التغيير.",
    },
    {
      title: "أخطاء شائعة في Bloc",
      en: "Common mistakes",
      points: [
        "<b>تعديل الـ state في مكانها:</b> <code>state.items.add(x); emit(state);</code> نفس المرجع فبيتجاهل. اعمل <code>emit(state.copyWith(items: [...state.items, x]))</code>.",
        "<b>إنشاء الـ bloc في build:</b> <code>BlocProvider(create: ...)</code> بيعمله مرة واحدة. لو عملته في <code>build</code> بإيدك هتفقد الـ state كل rebuild.",
        "<b>BlocProvider.of بـ context غلط:</b> الـ context اللي بتستخدمه لازم يكون <b>تحت</b> الـ provider. لو بتنادي في نفس الـ widget اللي عمل الـ provider هتاخد <code>ProviderNotFoundException</code>؛ افصل الـ view في widget تاني أو استخدم <code>Builder</code>.",
        "<b>أثر جانبي جوه BlocBuilder:</b> SnackBar أو <code>Navigator.push</code> جوه builder بتتكرر مع كل rebuild. مكانها <code>BlocListener</code>.",
        "<b>نسيان close للـ bloc اللي عملته بنفسك:</b> لو عملته من غير <code>BlocProvider</code> نادي <code>close()</code> في <code>dispose</code> وإلا يسرّب streams.",
        "<b>Bloc فيه كل حاجة:</b> حط الـ API في repository والـ bloc ينادي عليه، مش <code>http.get</code> داخل الـ bloc.",
      ],
      interview: [
        { q: "إيه أشهر أخطاء الـ Bloc؟", a: "تعديل الـ state في مكانها بدل ما أعمل copy جديدة (فمفيش rebuild)، وعدم وضع الحقول كلها في <code>props</code> بتاع Equatable، وعمل SnackBar أو navigation جوه <code>BlocBuilder</code> بدل <code>BlocListener</code>، والـ emit بعد ما الـ bloc يتقفل لازم يتتحمى بـ <code>isClosed</code>، واستخدام context فوق الـ <code>BlocProvider</code> فبيرمي ProviderNotFoundException." },
      ],
    },
    {
      title: "Bloc ولا Riverpod ولا Provider؟",
      en: "Bloc vs Riverpod vs Provider: which would you choose",
      body: "<p>سؤال مقابلة متكرر، والإجابة الصادقة مفيهاش «الأفضل دايما». المهم تقول المعايير:</p>",
      terms: [
        ["Provider", "الأبسط", "قريب من Flutter الأساسي (InheritedWidget + ChangeNotifier). كفاية لتطبيقات صغيرة، لكن مرتبط بـ BuildContext ومشاكل الـ runtime. المؤلف نفسه بقى يوصي بـ Riverpod للمشاريع الجديدة."],
        ["Riverpod", "الأقل boilerplate", "providers global آمنة وقت الـ compile، async أول-class، autoDispose، وDI مدمجة وتنفع للاختبار. الحرية فيه أكتر، فالفريق لازم يتفق على قواعد."],
        ["Bloc", "الأكتر صرامة", "فصل واضح وevents مسجلة (traceability)، وأدوات اختبار ممتازة، ومعروف في الشركات الكبيرة والفرق الكبيرة. الثمن boilerplate أكتر ومنحنى تعلم للـ streams."],
      ],
      points: [
        "<b>الأداء:</b> الثلاثة كويسين لو استخدمت rebuild مضبوط (select / buildWhen / widgets صغيرة). مش سبب الاختيار.",
        "<b>الاختبار:</b> الثلاثة قابلين للاختبار. Bloc عنده <code>bloc_test</code>، وRiverpod بيعمل override، وProvider محتاج شوية أكتر.",
        "<b>الاختيار الحقيقي:</b> حجم الفريق، قواعد الشركة، وخبرتكم. تطبيق جديد وفريق صغير: Riverpod. فريق كبير بيحتاج بنية صارمة أو مشروع قديم عليه Bloc: Bloc.",
        "الأهم في المقابلة إنك تشرح المبدأ المشترك (الـ state بره الـ widgets، الـ UI بترسمها، الأوامر في اتجاه واحد) وتبرر اختيارك.",
      ],
      interview: [
        { q: "لو بتبدأ مشروع جديد، تختار Bloc ولا Riverpod ولا Provider؟ وليه؟", a: "حسب الفريق والمشروع. تطبيق جديد وفريق صغير: Riverpod، لأن أقل boilerplate، آمن وقت الـ compile، وبيتعامل مع async و DI و autoDispose، وكمان Provider نفسه بقى يتوصى بالانتقال منه. فريق كبير أو شركة عندها قواعد صارمة: Bloc، لأن البنية events/states واضحة ومسجلة وسهل المراجعة والاختبار بـ <code>bloc_test</code>. Provider لتطبيق صغير أو مشروع قديم. وفي كل الأحوال بفصل الـ logic عن الـ UI بـ repository، والمبدأ واحد." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: Cubit",
      lang: "dart",
      code: `class CounterCubit extends Cubit<int> {
  CounterCubit() : super(0);

  void increment() => emit(state + 1);

  void decrement() {
    if (state == 0) return;
    emit(state - 1);
  }
}`,
    },
    {
      title: "اكتب: Bloc بالـ events",
      lang: "dart",
      code: `sealed class CounterEvent {}

class Incremented extends CounterEvent {}

class Decremented extends CounterEvent {}

class CounterBloc extends Bloc<CounterEvent, int> {
  CounterBloc() : super(0) {
    on<Incremented>((event, emit) => emit(state + 1));
    on<Decremented>((event, emit) => emit(state - 1));
  }
}`,
    },
    {
      title: "اكتب: state بـ Equatable",
      lang: "dart",
      code: `class ProfileState extends Equatable {
  const ProfileState({this.name = '', this.loading = false});

  final String name;
  final bool loading;

  ProfileState copyWith({String? name, bool? loading}) {
    return ProfileState(
      name: name ?? this.name,
      loading: loading ?? this.loading,
    );
  }

  @override
  List<Object?> get props => [name, loading];
}`,
    },
  ],

  tasks: [
    {
      title: "عداد بـ Cubit وواجهته",
      lang: "dart",
      prompt: "<p>اكتب <code>CounterCubit extends Cubit&lt;int&gt;</code> فيه <code>increment</code> و<code>decrement</code> (الحد الأدنى 0) و<code>reset</code>. واكتب <code>CounterPage</code> بـ <code>BlocProvider</code> بيبني <code>CounterView</code>، وفي الـ view: <code>BlocBuilder</code> بيعرض <code>Count: N</code> وزرارين <code>+</code> و<code>-</code> بيستخدموا <code>context.read</code>.</p>",
      hints: [
        "الـ <code>BlocProvider(create: (_) =&gt; CounterCubit(), child: const CounterView())</code>. لازم الـ view widget منفصل.",
        "<code>BlocBuilder&lt;CounterCubit, int&gt;(builder: (context, count) =&gt; Text('Count: $count'))</code>.",
      ],
      solution: `import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CounterCubit extends Cubit<int> {
  CounterCubit() : super(0);

  void increment() => emit(state + 1);

  void decrement() {
    if (state == 0) return;
    emit(state - 1);
  }

  void reset() => emit(0);
}

class CounterPage extends StatelessWidget {
  const CounterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => CounterCubit(),
      child: const CounterView(),
    );
  }
}

class CounterView extends StatelessWidget {
  const CounterView({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        BlocBuilder<CounterCubit, int>(
          builder: (context, count) => Text('Count: $count'),
        ),
        Row(
          children: [
            TextButton(
              onPressed: () => context.read<CounterCubit>().increment(),
              child: const Text('+'),
            ),
            TextButton(
              onPressed: () => context.read<CounterCubit>().decrement(),
              child: const Text('-'),
            ),
          ],
        ),
      ],
    );
  }
}`,
      explain: "الـ logic (الحد الأدنى) في الـ cubit. الـ view منفصل عشان الـ context بتاعه تحت الـ provider. <code>read</code> في الـ callbacks و<code>BlocBuilder</code> للرسم.",
    },
    {
      title: "CartBloc بالـ events",
      lang: "dart",
      prompt: "<p>اكتب <code>CartState extends Equatable</code> فيه <code>List&lt;String&gt; items</code> (فاضية مبدئيا). وأحداث <code>sealed class CartEvent</code> فيها <code>ItemAdded(String name)</code> و<code>ItemRemoved(String name)</code> و<code>CartCleared</code>. و<code>CartBloc</code> بيسجل handler لكل event: الإضافة بتتجاهل الاسم الفاضي، والحذف بيشيل الاسم، والـ state بتتغير دايما بقايمة جديدة.</p>",
      hints: [
        "الـ state الجديدة: <code>CartState([...state.items, event.name])</code> للإضافة، و<code>state.items.where(...).toList()</code> للحذف.",
        "حط <code>items</code> في <code>props</code> عشان Equatable.",
      ],
      solution: `import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CartState extends Equatable {
  const CartState([this.items = const []]);

  final List<String> items;

  @override
  List<Object?> get props => [items];
}

sealed class CartEvent {}

class ItemAdded extends CartEvent {
  ItemAdded(this.name);
  final String name;
}

class ItemRemoved extends CartEvent {
  ItemRemoved(this.name);
  final String name;
}

class CartCleared extends CartEvent {}

class CartBloc extends Bloc<CartEvent, CartState> {
  CartBloc() : super(const CartState()) {
    on<ItemAdded>((event, emit) {
      final name = event.name.trim();
      if (name.isEmpty) return;
      emit(CartState([...state.items, name]));
    });
    on<ItemRemoved>((event, emit) {
      final next = state.items.where((i) => i != event.name).toList();
      emit(CartState(next));
    });
    on<CartCleared>((event, emit) => emit(const CartState()));
  }
}`,
      explain: "كل handler بيطلع <b>قايمة جديدة</b> (مش <code>state.items.add</code>) فالـ Equatable يقدر يقارن. الـ events <code>sealed</code> عشان المترجم يتأكد من الأنواع.",
    },
    {
      title: "login كامل بـ Cubit وBlocConsumer",
      lang: "dart",
      prompt: "<p>اكتب sealed <code>LoginState</code> بأنواع <code>LoginInitial</code> و<code>LoginLoading</code> و<code>LoginSuccess(token)</code> و<code>LoginFailure(message)</code>، و<code>abstract class AuthRepository</code> فيه <code>Future&lt;String&gt; login(String email, String password)</code> يرمي <code>AuthException</code>. و<code>LoginCubit(this._repo)</code> بتطلع Loading ثم Success أو Failure (رسالة الـ <code>AuthException</code> أو رسالة عامة للباقي، مع التأكد من <code>isClosed</code>). وأخيرا <code>LoginForm</code> بـ <code>BlocConsumer</code>: الـ listener بيعرض SnackBar عند الفشل، والـ builder بيعطل الزرار وقت الـ loading.</p>",
      hints: [
        "ابدأ بالـ states (ورث <code>Equatable</code> وحط <code>props</code>) وبعدين الـ cubit: <code>emit(const LoginLoading())</code> قبل الطلب.",
        "استخدم <code>on AuthException catch (e)</code> قبل الـ <code>catch (_)</code> العام.",
      ],
      solution: `import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AuthException implements Exception {
  const AuthException(this.message);
  final String message;
}

abstract class AuthRepository {
  Future<String> login(String email, String password);
}

sealed class LoginState extends Equatable {
  const LoginState();

  @override
  List<Object?> get props => [];
}

class LoginInitial extends LoginState {
  const LoginInitial();
}

class LoginLoading extends LoginState {
  const LoginLoading();
}

class LoginSuccess extends LoginState {
  const LoginSuccess(this.token);
  final String token;

  @override
  List<Object?> get props => [token];
}

class LoginFailure extends LoginState {
  const LoginFailure(this.message);
  final String message;

  @override
  List<Object?> get props => [message];
}

class LoginCubit extends Cubit<LoginState> {
  LoginCubit(this._repo) : super(const LoginInitial());

  final AuthRepository _repo;

  Future<void> login(String email, String password) async {
    emit(const LoginLoading());
    try {
      final token = await _repo.login(email, password);
      if (isClosed) return;
      emit(LoginSuccess(token));
    } on AuthException catch (e) {
      if (isClosed) return;
      emit(LoginFailure(e.message));
    } catch (_) {
      if (isClosed) return;
      emit(const LoginFailure('Something went wrong'));
    }
  }
}

class LoginForm extends StatelessWidget {
  const LoginForm({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<LoginCubit, LoginState>(
      listenWhen: (previous, current) => current is LoginFailure,
      listener: (context, state) {
        if (state is LoginFailure) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.message)),
          );
        }
      },
      builder: (context, state) {
        final loading = state is LoginLoading;
        return ElevatedButton(
          onPressed: loading
              ? null
              : () => context.read<LoginCubit>().login('a@b.c', '123'),
          child: Text(loading ? 'Loading...' : 'Login'),
        );
      },
    );
  }
}`,
      explain: "الـ states sealed و Equatable، الـ cubit بياخد repository من الـ constructor (سهل تبدله بـ fake)، والاستثناءات متحولة لرسائل. الأثر الجانبي (SnackBar) في الـ listener والرسم في الـ builder.",
    },
  ],

  quiz: [
    {
      q: "إيه اتجاه تدفق الداتا في Bloc؟",
      options: [
        "الـ UI تعدل الـ state مباشرة وتبلغ الـ bloc",
        "UI تبعت event أو تنادي دالة، الـ bloc يطلع state جديدة، الـ UI ترسمها",
        "الـ bloc يرسم الـ UI بنفسه",
        "في اتجاهين مباشرين بين الـ UI والـ state",
      ],
      answer: 1,
      why: "اتجاه واحد: UI → event → bloc → state → UI. الـ UI عمرها ما بتعدل الـ state بنفسها.",
    },
    {
      q: "إيه الفرق الأساسي بين Cubit و Bloc؟",
      options: [
        "Cubit بيستخدم دوال و <code>emit</code>، و Bloc بيستخدم events و <code>on&lt;Event&gt;</code>",
        "Cubit بيدعم async و Bloc لا",
        "Bloc أسرع دايما",
        "Cubit مبيحتاجش BlocProvider",
      ],
      answer: 0,
      why: "الاتنين بيطلعوا states ويشتغلوا بنفس الـ widgets. الفرق في طريقة الإدخال: دوال في Cubit، events في Bloc.",
    },
    {
      q: "الكود ده مبيحدثش الشاشة. ليه؟",
      code: { lang: "dart", src: `class ListCubit extends Cubit<List<String>> {
  ListCubit() : super([]);

  void add(String s) {
    state.add(s);
    emit(state);
  }
}` },
      options: [
        "emit لازم تتنادى مرتين",
        "الـ state لازم تكون int",
        "ناقص <code>super.close()</code>",
        "بيعمل emit لنفس الكائن، والـ bloc بيتجاهل state مساوية للحالية",
      ],
      answer: 3,
      why: "لازم <code>emit([...state, s])</code> قايمة جديدة. الـ bloc بيتجاهل الـ emit لو الـ state الجديدة == القديمة.",
    },
    {
      q: "ليه بنضيف Equatable للـ states؟",
      options: [
        "عشان تبقى const تلقائي",
        "عشان المقارنة بالقيم (props) مش بالمرجع، فمفيش rebuild لو القيم متغيرتش",
        "عشان تتحول لـ JSON",
        "عشان تتخزن في الذاكرة المؤقتة",
      ],
      answer: 1,
      why: "Equatable بيحسب <code>==</code> و <code>hashCode</code> من props. والـ bloc يتجاهل state مساوية للحالية.",
    },
    {
      q: "عايز تعرض SnackBar لما login يفشل. أنسب widget:",
      options: [
        "<code>BlocBuilder</code>",
        "<code>BlocSelector</code> بس",
        "<code>BlocListener</code> (أو listener في BlocConsumer)",
        "<code>BlocProvider</code>",
      ],
      answer: 2,
      why: "الأثر الجانبي في listener اللي بيتنادى مرة لكل state. الـ builder ممكن يتنادى كتير فالـ SnackBar هيتكرر.",
    },
    {
      q: "إيه وظيفة <code>buildWhen</code>؟",
      options: [
        "بتحدد إمتى الـ bloc يتقفل",
        "بتعمل emit تلقائي",
        "بتقرر هل الـ builder يتنادى بالـ state الجديدة بناء على previous و current",
        "بتحمل الداتا من API",
      ],
      answer: 2,
      why: "<code>buildWhen: (previous, current) =&gt; bool</code>. بترجع false فالـ UI مبتتبنيش لو التغيير مش مهم ليها.",
    },
    {
      q: "تستخدم أنهي واحد في <code>onPressed</code>؟",
      options: [
        "<code>context.watch&lt;CounterCubit&gt;().increment()</code>",
        "<code>BlocBuilder</code> جوه onPressed",
        "<code>context.read&lt;CounterCubit&gt;().increment()</code>",
        "<code>BlocProvider.of&lt;CounterCubit&gt;(context, listen: true)</code>",
      ],
      answer: 2,
      why: "<code>read</code> للأوامر من غير اشتراك. <code>watch</code> بتشترك وبتتستخدم في build بس.",
    },
    {
      q: "إيه الفرق بين <code>BlocProvider(create: ...)</code> و <code>BlocProvider.value(value: ...)</code>؟",
      options: [
        "الاتنين بيقفلوا الـ bloc",
        "value للـ Cubit فقط",
        "create بيقفل الـ bloc تلقائي. value بيستخدم bloc موجود ومبيقفلوش",
        "مفيش فرق",
      ],
      answer: 2,
      why: "<code>.value</code> لتمرير bloc موجود لشاشة جديدة، صاحبه الأصلي هو اللي بيقفله.",
    },
    {
      q: "في الـ cubit ده، إيه الخطر؟",
      code: { lang: "dart", src: `Future<void> load() async {
  emit(const Loading());
  final data = await repo.fetch();
  emit(Loaded(data));
}` },
      options: [
        "ممكن الـ cubit يتقفل أثناء <code>await</code> فـ <code>emit</code> يرمي StateError، ومفيش try/catch للفشل",
        "لازم الـ emit يكون قبل الـ await فقط",
        "مفيش خطر",
        "الـ states لازم تكون int",
      ],
      answer: 0,
      why: "اتأكد من <code>isClosed</code> بعد الـ await، واتعامل مع الاستثناء (try/catch) وطلع Failure.",
    },
    {
      q: "أنسب نوع للـ states لما الحالات بتستبعد بعضها (Initial/Loading/Success/Failure):",
      answer: ["sealed class", "sealed"],
      why: "<code>sealed class</code> بأنواع فرعية بتخلي المترجم يتأكد إنك غطيت كل الحالات في <code>switch</code>.",
    },
  ],
};
