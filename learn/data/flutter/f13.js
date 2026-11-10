window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f13"] = {
  slides: [
    {
      kicker: "ليه",
      title: "ليه نقسم التطبيق لطبقات",
      en: "Why layers",
      body: "<p>أغلب التطبيقات اللي بتبدأ بسرعة بتوصل للشكل ده: widget واحد فيه <code>dio.get</code> وفك الـ JSON وتحويله وحالة التحميل وشكل الشاشة كله. بيشتغل، لحد ما:</p>",
      points: [
        "السيرفر يغير اسم حقل: تعدل في 15 شاشة، لأن الـ parsing متكرر في كل مكان.",
        "تحب تختبر منطق الحساب: مش هتقدر، لأنه جوه <code>build</code> ومحتاج widget وشبكة.",
        "تحب تضيف cache محلي أو تبدل http بـ dio: تلمس كل الشاشات.",
        "فريق من تلاتة: كل واحد بيعدل في نفس الملف الكبير وبيحصل conflicts.",
      ],
      focus: [{ label: "المبدأ", text: "<b>separation of concerns</b>: كل جزء ليه مسؤولية واحدة وبيعرف عن اللي تحته بس. الـ UI ترسم، الـ logic تقرر، الـ data تجيب وتخزن. تغيير جزء مبيكسرش الباقي، وكل جزء ينفع يتختبر لوحده." }],
      interview: [
        { q: "ليه بنقسم تطبيق Flutter لطبقات؟", a: "علشان نفصل المسؤوليات: الـ UI ترسم الـ state، والـ logic (state holders) تقرر، والـ data تجيب وتخزن. فتغيير الـ API أو إضافة cache يمس طبقة واحدة، والـ logic يتختبر من غير widgets أو شبكة (بـ fakes)، والفريق يشتغل بالتوازي، والكود يفضل قابل للصيانة لما يكبر. من غيره بنقع في widgets ضخمة فيها كل حاجة." },
      ],
    },
    {
      title: "المعمارية اللي فريق Flutter بيوصي بيها",
      en: "UI / logic / data layers",
      body: "<p>الدليل الرسمي لـ Flutter بيقسم التطبيق لـ <b>UI layer</b> و<b>data layer</b> وطبقة <b>domain</b> اختيارية بينهم، والداتا بتتدفق في اتجاه واحد: من الـ data لأعلى، والأحداث من الـ UI لتحت.</p>",
      terms: [
        ["View", "الواجهة", "widgets بترسم الـ state وبتبعت الأحداث (ضغطة زرار). فيها منطق UI بس (animation، navigation)."],
        ["ViewModel", "حامل الـ state", "كلاس (<code>ChangeNotifier</code> أو Riverpod <code>Notifier</code> أو <code>Cubit</code>) بيحوّل بيانات الـ repository لـ state جاهزة للشاشة، وبيستقبل الأوامر من الـ View. ده الـ state holder."],
        ["Repository", "مصدر الحقيقة للداتا", "بيجمع data sources، وبيعمل caching ومعالجة أخطاء وتحويل. الـ ViewModel بتتكلم معاه مش مع API."],
        ["Service / Data source", "بوابة لمصدر خارجي", "كلاس رفيع بيغلف مصدر واحد: REST API، قاعدة محلية، secure storage. من غير منطق عمل."],
      ],
      points: [
        "<b>اتجاه التبعية:</b> View ← ViewModel ← Repository ← Service. كل طبقة تعرف اللي تحتها بس، ومعرفتش اللي فوقها.",
        "ده MVVM تقريبا: Model (الداتا)، View، ViewModel. الفرق في التسمية، الفكرة واحدة.",
      ],
      interview: [
        { q: "اشرح الطبقات في معمارية Flutter الموصى بيها.", a: "UI layer فيها الـ Views (widgets) والـ ViewModels (state holders زي Notifier أو Cubit)، والـ data layer فيها الـ Repositories (مصدر الحقيقة، caching، معالجة أخطاء) والـ Services (بوابات رفيعة لـ API أو قاعدة محلية). وفيه طبقة domain اختيارية للمنطق المعقد. الداتا بتتدفق لفوق والأحداث لتحت، وكل طبقة بتعتمد على اللي تحتها بس عن طريق abstractions." },
      ],
    },
    {
      title: "Repository pattern",
      en: "Repository: abstract class + implementation",
      body: "<p>الـ repository <b>abstract class</b> بيعرّف إيه المطلوب (مثلا <code>getProperties</code>) من غير ما يقول إزاي، و<b>implementation</b> بتجمع الـ remote والـ local data sources. الـ ViewModel بتعتمد على الـ abstract بس، فتقدر تبدل الـ implementation (API حقيقي، fake للاختبار، mock للتجربة) من غير ما تلمسها.</p>",
      code: {
        lang: "dart",
        title: "property_repository.dart",
        src: `abstract class PropertyRemoteSource {
  Future<List<PropertyDto>> fetchPage(int page);
}

abstract class PropertyLocalSource {
  Future<List<PropertyDto>> readCached();
  Future<void> saveCache(List<PropertyDto> items);
}

abstract class PropertyRepository {
  Future<Result<List<Property>>> getProperties({int page = 1});
}

class PropertyRepositoryImpl implements PropertyRepository {
  PropertyRepositoryImpl(this._remote, this._local);

  final PropertyRemoteSource _remote;
  final PropertyLocalSource _local;

  @override
  Future<Result<List<Property>>> getProperties({int page = 1}) async {
    try {
      final dtos = await _remote.fetchPage(page);
      if (page == 1) await _local.saveCache(dtos);
      return Ok(dtos.map((d) => d.toDomain()).toList());
    } catch (_) {
      final cached = await _local.readCached();
      if (cached.isNotEmpty) {
        return Ok(cached.map((d) => d.toDomain()).toList());
      }
      return const Err(Failure('Could not load properties'));
    }
  }
}`,
        note: "الـ repository بيرجع الـ <b>domain model</b> (<code>Property</code>) مش الـ DTO. الشبكة أولا، ولو فشلت يرجع للـ cache، وكل ده مخفي عن الـ ViewModel.",
      },
      pitfall: "الـ repository اللي بيرجع <code>Response</code> أو <code>Map</code> من dio، أو بيعرض <code>DioException</code> لفوق: كده الطبقات اللي فوق متعلقة بالمكتبة وخسرنا الفايدة. الـ repository هو اللي يحول كل ده لـ domain models و Failures.",
      interview: [
        { q: "إيه هو الـ Repository pattern ولماذا نستخدمه؟", a: "الـ repository طبقة وسيطة بين الـ logic ومصادر الداتا. بعرّفه كـ abstract class بدوال بلغة الدومين (<code>getProperties</code>) وimplementation بتتكلم مع remote وlocal data sources وبتدير الـ cache ومعالجة الأخطاء. فوائده: الـ UI والـ ViewModel مبيعرفوش dio ولا SQLite، أقدر أبدل المصدر أو أضيف cache من غير ما أغير الشاشات، وأبدله بـ fake في الاختبار." },
      ],
    },
    {
      title: "DTO مقابل domain model",
      en: "DTO vs domain model",
      body: "<p><b>DTO</b> (Data Transfer Object) شكل الداتا <b>زي ما السيرفر بيبعتها</b>: أسماء الحقول (<code>city_name</code>)، الأنواع، القيم الناقصة. <b>Domain model</b> شكل الداتا <b>زي ما التطبيق محتاجها</b>: أسماء نضيفة، أنواع مناسبة، قيم افتراضية. الـ mapper (<code>toDomain</code>) هو الجسر. لو السيرفر غير اسم حقل، بتعدل الـ DTO والـ mapper بس وباقي التطبيق مبيحسش.</p>",
      code: {
        lang: "dart",
        title: "mapping",
        src: `// data layer: mirrors the JSON
class PropertyDto {
  const PropertyDto({
    required this.id,
    required this.title,
    required this.price,
    this.cityName,
  });

  final int id;
  final String title;
  final double price;
  final String? cityName;

  factory PropertyDto.fromJson(Map<String, dynamic> json) {
    return PropertyDto(
      id: json['id'] as int,
      title: json['title'] as String,
      price: (json['price'] as num).toDouble(),
      cityName: json['city_name'] as String?,
    );
  }

  Property toDomain() {
    return Property(
      id: id,
      title: title.trim(),
      price: price,
      city: cityName ?? 'Unknown',
    );
  }
}

// domain layer: what the app uses, no JSON knowledge
class Property {
  const Property({
    required this.id,
    required this.title,
    required this.price,
    required this.city,
  });

  final int id;
  final String title;
  final double price;
  final String city;
}`,
        note: "الـ <code>Property</code> مفيهاش <code>fromJson</code> ولا أي حاجة عن الـ API. ولو الداتا بتتحفظ في SQLite، بتعمل <code>PropertyEntity</code> أو <code>toMap</code> في الـ data layer برضه.",
      },
      points: [
        "في المشاريع الصغيرة ممكن تستخدم نفس الكلاس للاتنين. الفصل بيستاهل لما الـ API متغير أو بيرجع شكل غير مناسب للـ UI.",
        "الأسماء والـ nullability والتحويلات (تاريخ نصي → <code>DateTime</code>) بتحصل في الـ mapper مرة واحدة.",
      ],
      interview: [
        { q: "إيه الفرق بين DTO و domain model؟", a: "الـ DTO بيمثل شكل الداتا زي ما بتيجي من السيرفر أو بتتخزن (أسماء الحقول، الأنواع، القيم الناقصة) وفيه <code>fromJson</code>. الـ domain model بيمثل الداتا بالشكل اللي التطبيق محتاجه، من غير أي معرفة بالـ JSON. الـ mapper بيحول بينهم. الفايدة إن تغيير الـ API يمس الـ DTO والـ mapper بس، وباقي التطبيق (الـ UI والـ logic) ثابت." },
      ],
    },
    {
      title: "Dependency Injection و Riverpod",
      en: "Dependency injection, constructor injection, providers as DI",
      body: "<p>الـ <b>dependency injection</b> معناها إن الكلاس مبيعملش dependencies بنفسه (<code>PropertyRepositoryImpl(HttpApi())</code> جوه الـ ViewModel)، بل <b>بتتسلم له</b> من برا. أبسط شكل: <b>constructor injection</b> (الكلاس بياخد اللي محتاجه كـ parameters من نوع abstract). ده بيخلي الاختبار سهل لأنك بتسلمه fakes. و<b>Riverpod نفسه DI container</b>: كل provider بيبني كائنه وبياخد dependencies من providers تانية بـ <code>ref.watch</code>. (فيه كمان <code>get_it</code> service locator لو مش بتستخدم state management فيه DI.)</p>",
      code: {
        lang: "dart",
        title: "providers.dart",
        src: `final propertyApiProvider = Provider<PropertyApi>((ref) {
  return HttpPropertyApi();
});

final propertyRepositoryProvider = Provider<PropertyRepository>((ref) {
  return PropertyRepositoryImpl(ref.watch(propertyApiProvider));
});

class PropertiesViewModel extends AsyncNotifier<List<Property>> {
  @override
  Future<List<Property>> build() async {
    final repo = ref.watch(propertyRepositoryProvider);
    final result = await repo.getProperties();
    return switch (result) {
      Ok(:final value) => value,
      Err(:final failure) => throw failure,
    };
  }
}

final propertiesProvider =
    AsyncNotifierProvider<PropertiesViewModel, List<Property>>(
  PropertiesViewModel.new,
);

class HttpPropertyApi implements PropertyApi {
  @override
  Future<List<PropertyDto>> fetchPage(int page) async => [];
}

class PropertyRepositoryImpl implements PropertyRepository {
  PropertyRepositoryImpl(this._api);

  final PropertyApi _api;

  @override
  Future<Result<List<Property>>> getProperties({int page = 1}) async {
    final dtos = await _api.fetchPage(page);
    return Ok(dtos.map((d) => d.toDomain()).toList());
  }
}`,
        note: "السلسلة: <code>api</code> ← <code>repository</code> ← <code>ViewModel</code> ← <code>UI</code>. في الاختبار: <code>propertyRepositoryProvider.overrideWithValue(FakeRepo())</code> ويبقى كل اللي فوقه شغال على fake.",
      },
      terms: [
        ["constructor injection", "حقن بالـ constructor", "الكلاس بياخد dependencies كـ parameters. الأبسط والأوضح، وبيخلي أي كلاس تقدر تعمله بإيدك في test."],
        ["service locator", "مُحدد الخدمات", "كائن global (زي <code>GetIt.I</code>) بتسجل فيه الكائنات وتطلبها. بيشتغل من غير BuildContext، لكن الـ dependency مخفية جوه الكلاس، فأقل وضوحا."],
      ],
      pitfall: "عمل <code>new</code> لـ dependency جوه الكلاس (<code>final api = HttpPropertyApi();</code> كحقل): مش هتقدر تبدله في الاختبار أبدا. دايما اتسلمه من برا بنوع abstract.",
      interview: [
        { q: "إيه هو الـ dependency injection؟ وإزاي بتطبقه في Flutter؟", a: "إن الكلاس ياخد dependencies من برا بدل ما يعملها بنفسه. بالـ constructor injection: الـ ViewModel بتاخد <code>PropertyRepository</code> (abstract) في الـ constructor. في Riverpod كل provider بيبني كائنه وياخد dependencies من providers تانية بـ <code>ref.watch</code>، فالـ providers نفسها هي الـ DI container، ولو عايز اختبار بعمل override لـ provider الـ repository بـ fake. بديل: <code>get_it</code> كـ service locator." },
      ],
    },
    {
      title: "Feature-first مقابل layer-first",
      en: "Folder structure",
      body: "<p>تنظيم الفولدرات قرار بيأثر على سرعة الشغل. فيه أسلوبين:</p>",
      codes: [
        {
          lang: "text",
          title: "layer-first: الفولدر الأعلى هو الطبقة",
          src: `lib/
  data/
    property_repository.dart
    auth_repository.dart
  models/
    property.dart
    user.dart
  providers/
  screens/
    property_list_screen.dart
    login_screen.dart`,
          note: "سهل في تطبيق صغير. لما يكبر، لو بتشتغل على feature واحدة بتقفز بين 4 فولدرات، والمشاريع الكبيرة بتبقى فيها مئات الملفات في فولدر واحد.",
        },
        {
          lang: "text",
          title: "feature-first: الفولدر الأعلى هو الميزة",
          src: `lib/
  core/
    network/
    errors/
  features/
    properties/
      data/
      domain/
      presentation/
    auth/
      data/
      domain/
      presentation/`,
          note: "كل ميزة فيها طبقاتها. بتشتغل على الميزة في مكان واحد، وسهل تحذفها أو تنقلها لفريق. المشترك (network، errors، theme) في <code>core</code>.",
        },
      ],
      points: [
        "الأشهر في المشاريع المتوسطة والكبيرة: <b>feature-first</b>، والطبقات جوه كل feature.",
        "قاعدة: feature متعتمدش على feature تانية مباشرة؛ الحاجات المشتركة تروح لـ <code>core</code>.",
      ],

    },
    {
      title: "MVVM و Clean Architecture ببساطة",
      en: "MVVM and Clean Architecture in plain words",
      body: "<p><b>MVVM</b>: Model (الداتا والـ repositories)، View (الـ widgets)، ViewModel (الـ state holder اللي بين الاتنين). ده اللي عملناه فوق. <b>Clean Architecture</b> نسخة أكبر: طبقات متداخلة، والقاعدة الذهبية <b>dependency rule</b>: التبعيات بتشاور للداخل بس.</p>",
      terms: [
        ["Entity", "كيان الدومين", "الـ domain model: كلاس بيمثل مفهوم في العمل (Property, User) وقواعده، من غير أي معرفة بـ Flutter أو الشبكة."],
        ["Use case", "حالة استخدام", "كلاس صغير ليه مهمة واحدة (<code>GetFeaturedProperties</code>, <code>Login</code>) بينفذ قاعدة عمل فوق repository. بيتنادى بـ <code>call()</code>."],
        ["Data layer", "طبقة الداتا", "تنفيذ الـ repositories والـ DTOs والـ data sources. بتعتمد على الـ domain (بتنفذ interfaces بتاعته)، مش العكس."],
      ],
      code: {
        lang: "dart",
        title: "use case",
        src: `class GetFeaturedProperties {
  GetFeaturedProperties(this._repo);

  final PropertyRepository _repo;

  Future<Result<List<Property>>> call() async {
    final result = await _repo.getProperties();
    return switch (result) {
      Ok(:final value) => Ok(value.where((p) => p.featured).toList()),
      Err(:final failure) => Err(failure),
    };
  }
}`,
        note: "الـ use case بيحط قاعدة العمل (المميزة بس) في مكان واحد قابل للاختبار. بدونه القاعدة هتتكرر في كل ViewModel.",
      },
      pitfall: "تطبيق Clean Architecture كامل على تطبيق صغير: use case لكل حاجة (<code>GetUser</code> بتنادي <code>repo.getUser</code> وبس)، وmapper لكل كلاس، وأربع طبقات. ده <b>over-engineering</b>: ملفات كتير من غير قيمة. ابدأ بـ UI / ViewModel / Repository، وضيف domain و use cases لما فيه منطق عمل حقيقي بيتكرر أو بيتغير.",
      interview: [
        { q: "إيه الـ Clean Architecture؟ ومتى تكون over-engineering؟", a: "طبقات متداخلة: domain (entities و use cases و interfaces للـ repositories) في المنتصف، والـ data (تنفيذ الـ repositories والـ DTOs) والـ presentation حواليها، والـ dependency rule إن التبعيات بتشاور للداخل بس، فالـ domain مبيعرفش Flutter ولا الشبكة. مفيدة في تطبيق كبير بمنطق عمل معقد وفريق كبير. لكنها over-engineering في تطبيق CRUD صغير حيث الـ use cases بتكون مجرد تمرير لـ repository؛ هناك أكتفي بـ UI / ViewModel / Repository." },
      ],
    },
    {
      title: "معالجة الأخطاء عبر الطبقات",
      en: "Error handling across layers: Result and Failure",
      body: "<p>كل طبقة تعرف نوع خطأ مختلف: الـ service بيعرف <code>DioException</code>، الـ UI عايزة رسالة. الحل: الـ <b>repository</b> يمسك أخطاء المكتبات ويحولها لـ <code>Failure</code> بمعنى دومين، وإما يرميها (exception مفهومة)، أو يرجعها داخل <code>Result</code> (<code>Ok</code> أو <code>Err</code>) وده الأوضح لأن المترجم بيجبرك تتعامل مع الخطأ في الـ <code>switch</code>.</p>",
      code: {
        lang: "dart",
        title: "result.dart",
        src: `class Failure {
  const Failure(this.message);
  final String message;
}

sealed class Result<T> {
  const Result();
}

class Ok<T> extends Result<T> {
  const Ok(this.value);
  final T value;
}

class Err<T> extends Result<T> {
  const Err(this.failure);
  final Failure failure;
}

String describe(Result<List<String>> result) {
  return switch (result) {
    Ok(:final value) => 'Loaded \${value.length} items',
    Err(:final failure) => 'Error: \${failure.message}',
  };
}`,
        note: "الـ <code>sealed</code> بيخلي <code>switch</code> يتأكد إنك غطيت <code>Ok</code> و<code>Err</code>. نسيان حالة الخطأ يبقى compile error. (فيه حزم زي <code>fpdart</code> بتدي <code>Either</code> بنفس الفكرة.)",
      },
      points: [
        "<b>exceptions:</b> أبسط وبتناسب Riverpod (<code>AsyncValue</code> بيحول الاستثناء لـ error تلقائي). المهم يتحولوا لنوع دومين في الـ repository.",
        "<b>Result:</b> أوضح في الـ signature (الدالة قد تفشل)، لكن كود أطول. اتفق مع الفريق على واحد وطبقه في كل مكان.",
        "في الـ UI: اعرض رسالة مفهومة حسب نوع الـ Failure مش <code>e.toString()</code>.",
      ],
      interview: [
        { q: "إزاي بتعالج الأخطاء عبر طبقات التطبيق؟", a: "الـ data sources بتسيب الأخطاء الخام (DioException, SocketException)، والـ repository هو اللي بيمسكها ويحولها لـ <code>Failure</code> typed بمعنى دومين (لا إنترنت، غير مصرح، خطأ سيرفر). بعدين إما يرميها أو يرجعها في <code>Result&lt;T&gt;</code> (sealed: Ok / Err) فالـ ViewModel تعرف تتعامل بـ switch شامل، والـ UI تعرض رسالة مناسبة. كده مفيش طبقة فوق الـ repository تعرف أي حاجة عن dio." },
      ],
    },
    {
      title: "إزاي تشرح معمارية تطبيقك في مقابلة",
      en: "How to describe your app's architecture in an interview",
      body: "<p>المحاور مش عايز اسم باترن، عايز يشوف إنك فاهم <b>ليه</b>. اتبع ترتيب ثابت: الصورة الكبيرة، وبعدين الطبقات، وبعدين مثال لتدفق طلب واحد، وبعدين قرار واتبرر بيه، وبعدين اللي كنت هتغيره.</p>",
      points: [
        "<b>1. الصورة (جملة):</b> «تطبيق عقارات بـ Flutter و Riverpod وAPI Laravel، مقسم لـ feature-first وجوه كل feature طبقات UI و data.»",
        "<b>2. الطبقات:</b> Views بتقرا state من Notifiers، الـ Notifier بتنادي repository (abstract)، الـ repository بيجمع remote بـ dio وlocal cache، وبيرجع domain models و Failures.",
        "<b>3. تدفق طلب واحد:</b> «لما المستخدم يفتح قايمة العقارات: الشاشة بتعمل watch للـ provider، الـ Notifier بتنادي <code>repo.getProperties</code>، الـ repo بيجيب DTOs من API ويحولها لـ domain ويخزن cache، والشاشة بتعرض loading / error / data.»",
        "<b>4. القرارات:</b> «اخترت Riverpod لأنه بدون BuildContext وبيدي DI واختبار بسهولة، وفصلت الـ DTO عن الـ domain علشان تغييرات الـ API متمسش الـ UI.»",
        "<b>5. الاختبار:</b> «الـ repository abstract فبعمل override بـ fake في اختبار الـ Notifier.»",
        "<b>6. بصراحة:</b> أي حاجة كنت هتعملها بشكل مختلف (مثلا ضفت use cases بعد ما المنطق كبر)، ومتبالغش في ادعاء معمارية مكنتش مطبقها فعلا.",
      ],
      interview: [
        { q: "اشرح معمارية آخر تطبيق اشتغلت عليه.", a: "التطبيق Flutter بـ Riverpod وبيتكلم مع Laravel REST API. مقسم feature-first، وكل feature فيها data و presentation (وdomain لما احتاجه). الـ Views widgets بتعمل watch لـ provider. الـ state holder (Notifier) بتنادي repository معرف كـ abstract، والـ implementation بتجمع remote source بـ dio وlocal cache، وبتحول الـ DTOs لـ domain models وبتحول الأخطاء لـ Failures. الـ DI بالـ Riverpod providers فبعمل override بـ fakes في الاختبار. اخترت الفصل ده علشان تغييرات الـ API متكسرش الشاشات وعلشان الاختبار." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: Result",
      lang: "dart",
      code: `sealed class Result<T> {
  const Result();
}

class Ok<T> extends Result<T> {
  const Ok(this.value);
  final T value;
}

class Err<T> extends Result<T> {
  const Err(this.failure);
  final Failure failure;
}`,
    },
    {
      title: "اكتب: abstract repository",
      lang: "dart",
      code: `abstract class PropertyRepository {
  Future<Result<List<Property>>> getProperties({int page = 1});
}

class PropertyRepositoryImpl implements PropertyRepository {
  PropertyRepositoryImpl(this._api);

  final PropertyApi _api;

  @override
  Future<Result<List<Property>>> getProperties({int page = 1}) async {
    final dtos = await _api.fetchPage(page);
    return Ok(dtos.map((d) => d.toDomain()).toList());
  }
}`,
    },
    {
      title: "اكتب: providers كـ DI",
      lang: "dart",
      code: `final propertyApiProvider = Provider<PropertyApi>((ref) {
  return HttpPropertyApi();
});

final propertyRepositoryProvider = Provider<PropertyRepository>((ref) {
  final api = ref.watch(propertyApiProvider);
  return PropertyRepositoryImpl(api);
});`,
    },
  ],

  tasks: [
    {
      title: "DTO و domain model و mapper",
      lang: "dart",
      prompt: "<p>اكتب <code>UserDto</code> (<code>int id</code>, <code>String fullName</code> من المفتاح <code>full_name</code>, <code>String? avatarUrl</code> من <code>avatar_url</code>, <code>String createdAt</code> نص ISO) مع <code>factory UserDto.fromJson</code>. واكتب <code>User</code> (domain): <code>id</code>, <code>name</code>, <code>avatarUrl</code> (<code>String?</code>), <code>joinedAt</code> (<code>DateTime</code>). وفي الـ DTO دالة <code>User toDomain()</code> بتحول النص لـ <code>DateTime</code> بـ <code>DateTime.parse</code> وبتـ trim للاسم.</p>",
      hints: [
        "الـ DTO بيحمل أسماء السيرفر (<code>fullName</code>)، والـ domain بيحمل أسماء التطبيق (<code>name</code>).",
        "<code>DateTime.parse(createdAt)</code> في الـ mapper مش في الـ UI.",
      ],
      solution: `class UserDto {
  const UserDto({
    required this.id,
    required this.fullName,
    required this.createdAt,
    this.avatarUrl,
  });

  final int id;
  final String fullName;
  final String? avatarUrl;
  final String createdAt;

  factory UserDto.fromJson(Map<String, dynamic> json) {
    return UserDto(
      id: json['id'] as int,
      fullName: json['full_name'] as String,
      avatarUrl: json['avatar_url'] as String?,
      createdAt: json['created_at'] as String,
    );
  }

  User toDomain() {
    return User(
      id: id,
      name: fullName.trim(),
      avatarUrl: avatarUrl,
      joinedAt: DateTime.parse(createdAt),
    );
  }
}

class User {
  const User({
    required this.id,
    required this.name,
    required this.joinedAt,
    this.avatarUrl,
  });

  final int id;
  final String name;
  final String? avatarUrl;
  final DateTime joinedAt;
}`,
      explain: "الـ DTO بيعكس الـ JSON بالظبط والـ domain بيعكس احتياج التطبيق (DateTime مش نص). لو السيرفر غير <code>full_name</code> بتعدل سطر واحد في الـ DTO.",
    },
    {
      title: "Repository بيحول الأخطاء لـ Result",
      lang: "dart",
      prompt: "<p>عندك <code>Failure</code> و<code>Result</code> sealed (<code>Ok</code> / <code>Err</code>) و<code>abstract class UserApi { Future&lt;List&lt;UserDto&gt;&gt; fetchUsers(); }</code> و<code>UserDto.toDomain()</code>. اكتب <code>abstract class UserRepository</code> بدالة <code>Future&lt;Result&lt;List&lt;User&gt;&gt;&gt; getUsers()</code> و<code>UserRepositoryImpl</code> بياخد <code>UserApi</code> في الـ constructor: لو نجح يحول لـ domain ويرجع <code>Ok</code>، وللأخطاء: <code>SocketException</code> يرجع <code>Err(Failure('No internet'))</code>، وأي خطأ تاني <code>Err(Failure('Something went wrong'))</code>.</p>",
      hints: [
        "<code>on SocketException catch (_)</code> قبل <code>catch (_)</code> العام. استورد <code>dart:io</code>.",
        "الـ repository ميعرفش dio: الـ <code>UserApi</code> هو اللي بيعرفها.",
      ],
      solution: `import 'dart:io';

abstract class UserRepository {
  Future<Result<List<User>>> getUsers();
}

class UserRepositoryImpl implements UserRepository {
  UserRepositoryImpl(this._api);

  final UserApi _api;

  @override
  Future<Result<List<User>>> getUsers() async {
    try {
      final dtos = await _api.fetchUsers();
      return Ok(dtos.map((d) => d.toDomain()).toList());
    } on SocketException catch (_) {
      return const Err(Failure('No internet'));
    } catch (_) {
      return const Err(Failure('Something went wrong'));
    }
  }
}`,
      explain: "كل أخطاء المكتبات بتتحول هنا لـ Failure دومين. الـ ViewModel بتتعامل مع <code>Result</code> بس. والـ <code>UserApi</code> abstract فاختبار الـ repository بيبقى بـ fake بيرمي <code>SocketException</code> مثلا.",
    },
    {
      title: "ربط الطبقات بـ Riverpod",
      lang: "dart",
      prompt: "<p>اكتب providers: <code>userApiProvider</code> (بيرجع <code>FakeUserApi</code>) و<code>userRepositoryProvider</code> (بيبني <code>UserRepositoryImpl</code> من الـ api). و<code>UsersViewModel extends AsyncNotifier&lt;List&lt;User&gt;&gt;</code> بتحمل في <code>build</code> من الـ repository: <code>Ok</code> ترجع القايمة و<code>Err</code> ترمي الـ failure. و<code>UsersView</code> (ConsumerWidget) بـ <code>when</code>: loading / error / data (عدد المستخدمين كنص). استخدم switch pattern على <code>Result</code>.</p>",
      hints: [
        "<code>return switch (result) { Ok(:final value) =&gt; value, Err(:final failure) =&gt; throw failure };</code>",
        "الـ <code>build</code> بتستخدم <code>ref.watch(userRepositoryProvider)</code>.",
      ],
      solution: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class FakeUserApi implements UserApi {
  @override
  Future<List<UserDto>> fetchUsers() async => [];
}

final userApiProvider = Provider<UserApi>((ref) => FakeUserApi());

final userRepositoryProvider = Provider<UserRepository>((ref) {
  return UserRepositoryImpl(ref.watch(userApiProvider));
});

class UsersViewModel extends AsyncNotifier<List<User>> {
  @override
  Future<List<User>> build() async {
    final repo = ref.watch(userRepositoryProvider);
    final result = await repo.getUsers();
    return switch (result) {
      Ok(:final value) => value,
      Err(:final failure) => throw failure,
    };
  }
}

final usersProvider =
    AsyncNotifierProvider<UsersViewModel, List<User>>(UsersViewModel.new);

class UsersView extends ConsumerWidget {
  const UsersView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final users = ref.watch(usersProvider);
    return users.when(
      loading: () => const CircularProgressIndicator(),
      error: (e, s) => const Text('Could not load users'),
      data: (items) => Text('Users: \${items.length}'),
    );
  }
}`,
      explain: "السلسلة api ← repository ← ViewModel ← View كلها providers. في الاختبار بتعمل override لـ <code>userApiProvider</code> أو <code>userRepositoryProvider</code> بـ fake. الـ View معندهاش أي معرفة بالـ API أو الـ DTO.",
    },
  ],

  quiz: [
    {
      q: "أنهي دي أوضح علامة إن التطبيق محتاج فصل طبقات؟",
      options: [
        "الـ widgets قليلة",
        "التطبيق بيشتغل على iOS بس",
        "عندك provider واحد",
        "كل شاشة بتعمل طلب dio وبتفك الـ JSON بنفسها، وتغيير حقل في الـ API بيتطلب تعديل شاشات كتير",
      ],
      answer: 3,
      why: "التكرار والاعتماد المباشر على المكتبة في كل مكان معناه إن أي تغيير بيمس كل حاجة، ومفيش حاجة تتختبر لوحدها.",
    },
    {
      q: "في معمارية Flutter الموصى بيها، مين المسؤول عن caching ومعالجة الأخطاء وجمع data sources؟",
      options: [
        "الـ View",
        "الـ Repository",
        "الـ Service فقط",
        "الـ main()",
      ],
      answer: 1,
      why: "الـ repository هو مصدر الحقيقة للداتا. الـ service بوابة رفيعة لمصدر واحد من غير منطق عمل.",
    },
    {
      q: "ليه الـ repository بيتعرّف كـ <code>abstract class</code>؟",
      options: [
        "عشان يبقى أسرع",
        "عشان الـ ViewModel تعتمد على العقد وتقدر تبدل الـ implementation بـ fake أو مصدر تاني",
        "عشان Dart بتطلب كده",
        "عشان يقدر يستخدم const",
      ],
      answer: 1,
      why: "الاعتماد على abstraction يخلي الاختبار والتبديل سهل من غير ما تغير الكود اللي فوق.",
    },
    {
      q: "السيرفر غير اسم الحقل من <code>city</code> لـ <code>city_name</code>. لو عندك DTO منفصل وmapper، إيه اللي بتعدله؟",
      options: [
        "كل الشاشات اللي بتعرض المدينة",
        "الـ ViewModels",
        "الـ DTO (و mapper لو لازم) بس",
        "ولا حاجة، التطبيق هيتأقلم",
      ],
      answer: 2,
      why: "ده مبرر الفصل: الـ domain model مفيهوش أي معرفة بأسماء الـ JSON.",
    },
    {
      q: "أنهي كود فيه مشكلة DI؟",
      code: { lang: "dart", src: `class PropertiesViewModel {
  final PropertyRepository _repo =
      PropertyRepositoryImpl(HttpPropertyApi());

  Future<void> load() async {
    await _repo.getProperties();
  }
}` },
      options: [
        "الكلاس بيعمل dependencies بنفسه، فمش هتقدر تبدلها بـ fake في الاختبار",
        "الـ load لازم تكون sync",
        "الـ repository لازم يكون static",
        "مفيش مشكلة",
      ],
      answer: 0,
      why: "الحل: <code>PropertiesViewModel(this._repo)</code> بـ constructor injection، أو توفيره من provider.",
    },
    {
      q: "في Riverpod، إزاي تبدل الـ repository الحقيقي بـ fake في اختبار؟",
      options: [
        "تعدل الكود الأصلي مؤقتا",
        "تستخدم <code>setState</code>",
        "تعمل <code>propertyRepositoryProvider.overrideWithValue(FakeRepo())</code> في <code>ProviderScope</code> أو <code>ProviderContainer</code>",
        "مش ممكن",
      ],
      answer: 2,
      why: "كل dependency جاية من provider، فالـ override بيبدل الكائن لكل اللي بيعتمد عليه.",
    },
    {
      q: "إيه الفرق بين layer-first و feature-first؟",
      options: [
        "layer-first بيقسم الفولدرات بالميزة، و feature-first بالطبقة",
        "feature-first بيقسم بالميزة (auth, properties) وجواها طبقاتها، و layer-first بيقسم بالطبقة (screens, data)",
        "مفيش فرق",
        "feature-first بيمنع استخدام state management",
      ],
      answer: 1,
      why: "feature-first أنسب لما التطبيق يكبر: كل ميزة في مكان واحد.",
    },
    {
      q: "إيه المميز في استخدام <code>Result</code> sealed بدل exceptions؟",
      options: [
        "أسرع في التنفيذ دايما",
        "بيمنع الأخطاء نهائيا",
        "مفيش فرق",
        "المترجم بيجبر <code>switch</code> يتعامل مع حالتي Ok و Err، فمفيش خطأ منسي",
      ],
      answer: 3,
      why: "الـ exceptions ممكن تتنسى من غير ما المترجم يعترض. الـ Result بيخلي احتمال الفشل جزء من الـ signature.",
    },
    {
      q: "تطبيق CRUD صغير: كل use case بينادي <code>repo.method()</code> وبس. ده مثال على:",
      options: [
        "معمارية مثالية",
        "over-engineering: ملفات إضافية من غير قيمة",
        "ضروري دايما",
        "MVVM",
      ],
      answer: 1,
      why: "الـ use case بيستاهل لما فيه قاعدة عمل حقيقية. التمرير الفاضي بيزود التعقيد بس.",
    },
    {
      q: "اسم الباترن اللي بيحول DTO لـ domain model في مكان واحد ويخلي باقي التطبيق مش عارف شكل الـ JSON (كلمة واحدة بالإنجليزي):",
      answer: ["mapper", "Mapper", "mapping"],
      why: "الـ mapper (<code>toDomain</code>) هو الجسر بين شكل السيرفر وشكل التطبيق.",
    },
  ],
};
