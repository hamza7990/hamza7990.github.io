window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f10"] = {
  slides: [
    {
      kicker: "ليه وإزاي",
      title: "http ولا dio؟",
      en: "http vs dio",
      body: "<p>أي تطبيق حقيقي بيتكلم مع API (في حالتك Laravel REST). في Flutter فيه اختيارين شائعين، والمستوى ده مبني على <b>http 1.6.0</b> و<b>dio 5.11.1</b>.</p>",
      terms: [
        ["http", "الحزمة البسيطة", "خفيفة، من فريق Dart. بتعمل <code>get</code> و<code>post</code> وبترجع <code>Response</code> فيه <code>statusCode</code> و<code>body</code>. كل حاجة تانية (base URL، token، timeout، retry) بتكتبها بإيدك."],
        ["dio", "الحزمة الكاملة", "فيها <code>BaseOptions</code> (baseUrl وtimeouts وheaders ثابتة)، <b>interceptors</b>، الإلغاء بـ <code>CancelToken</code>، رفع الملفات <code>FormData</code>، تقدم الرفع، وبترمي <code>DioException</code> بنوع واضح."],
      ],
      points: [
        "<b>اختار http</b> لو التطبيق بيعمل كام طلب بسيط من غير token معقد.",
        "<b>اختار dio</b> لو محتاج token في كل طلب، تجديد token عند 401، رفع صور، إلغاء طلبات، أو logging. معظم تطبيقات الإنتاج بتختاره.",
        "الاتنين حزم خارجية: <code>flutter pub add dio</code> أو <code>flutter pub add http</code>.",
        "في الاتنين لازم تحط صلاحية الإنترنت في Android: <code>&lt;uses-permission android:name=\"android.permission.INTERNET\"/&gt;</code> في <code>AndroidManifest.xml</code> (الـ debug بيضيفها لوحده، الـ release لا).",
      ],
      interview: [
        { q: "إيه الفرق بين http و dio؟ وإمتى تختار كل واحدة؟", a: "<code>http</code> حزمة خفيفة: <code>get/post</code> وبترجع response، وكل حاجة تانية (base URL، token، timeout) بكتبها بنفسي. <code>dio</code> فيها <code>BaseOptions</code> و<b>interceptors</b> و<code>CancelToken</code> و<code>FormData</code> للرفع وأخطاء typed بـ <code>DioException</code>. لو تطبيق بسيط بكفيني http، ولو محتاج token في كل طلب وتجديده عند 401 ورفع ملفات وإلغاء، بختار dio." },
      ],
    },
    {
      title: "GET و POST بالـ http",
      en: "GET and POST with the http package",
      body: "<p>الخطوات ثابتة: ابني الـ <code>Uri</code>، ابعت الطلب مع headers، <b>اتأكد من statusCode قبل ما تفك الـ JSON</b>، وبعدين <code>jsonDecode</code>. الـ POST محتاج <code>jsonEncode</code> للـ body وheader <code>Content-Type: application/json</code> (من غيره Laravel مش هيفهم الـ body كـ JSON).</p>",
      code: {
        lang: "dart",
        title: "properties_api.dart",
        src: `import 'dart:convert';
import 'package:http/http.dart' as http;

const _host = 'api.example.com';

Future<List<dynamic>> fetchProperties(String token) async {
  final uri = Uri.https(_host, '/api/properties', {'page': '1'});
  final response = await http.get(
    uri,
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer $token',
    },
  );
  if (response.statusCode != 200) {
    throw Exception('Failed: \${response.statusCode}');
  }
  final body = jsonDecode(utf8.decode(response.bodyBytes));
  return (body as Map<String, dynamic>)['data'] as List<dynamic>;
}

Future<void> createProperty(String token, String title) async {
  final response = await http.post(
    Uri.https(_host, '/api/properties'),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: jsonEncode({'title': title}),
  );
  if (response.statusCode != 201) {
    throw Exception('Failed: \${response.statusCode}');
  }
}`,
        note: "<code>Uri.https(host, path, queryParameters)</code> بيعمل الـ query بشكل آمن. <code>utf8.decode(response.bodyBytes)</code> بيضمن إن العربي مش بيبوظ لو الـ server مبعتش charset.",
      },
      pitfall: "عمل <code>jsonDecode(response.body)</code> على 404/500 من غير ما تشيك الـ status: الـ body ساعات HTML وبيرمي <code>FormatException</code> بعيد عن السبب الحقيقي. وكمان نسيان <code>Accept: application/json</code> في Laravel بيخلي أخطاء الـ validation ترجع redirect/HTML بدل JSON.",
    },
    {
      title: "نماذج typed: fromJson و toJson",
      en: "Typed models with fromJson / toJson",
      body: "<p>الـ <code>jsonDecode</code> بترجع <code>Map&lt;String, dynamic&gt;</code>. لو بقيت تتعامل مع الـ Map في الـ UI هتغلط في اسم مفتاح ومحدش هيكتشف. الحل: <b>model class</b> بـ <code>factory fromJson</code> و<code>toJson</code>. وانتبه للـ null safety: الحقل اللي ممكن يجي null (أو ما يجيش) نوعه <code>?</code>، والـ list ممكن تيجي null فبنديها قيمة افتراضية.</p>",
      code: {
        lang: "dart",
        title: "property.dart",
        src: `class Property {
  const Property({
    required this.id,
    required this.title,
    required this.price,
    this.city,
    this.images = const [],
  });

  final int id;
  final String title;
  final double price;
  final String? city;
  final List<String> images;

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(
      id: json['id'] as int,
      title: json['title'] as String,
      price: (json['price'] as num).toDouble(),
      city: json['city'] as String?,
      images: (json['images'] as List<dynamic>? ?? [])
          .map((e) => e as String)
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'price': price,
        'city': city,
        'images': images,
      };
}

List<Property> parseProperties(List<dynamic> data) {
  return data
      .map((e) => Property.fromJson(e as Map<String, dynamic>))
      .toList();
}`,
        note: "الـ price بنعمله <code>as num</code> وبعدين <code>toDouble()</code> لأن الـ JSON ممكن يبعت <code>10</code> (int) أو <code>10.5</code> (double). والـ cast <code>as int</code> غلط ممكن يرمي <code>TypeError</code>، وده بيتصلح بالـ null-safe parsing.",
      },
      pitfall: "<code>json['price'] as double</code>: لو الـ server بعت <code>1500</code> من غير كسر الـ app بيقع بـ <code>type 'int' is not a subtype of type 'double'</code>. استخدم <code>as num</code> ثم <code>toDouble()</code>.",
      interview: [
        { q: "ليه تعمل model classes بدل ما تستخدم Map مباشرة؟ وإزاي تتعامل مع حقل ممكن يكون null؟", a: "الـ Map بتخلي الأخطاء (مفتاح مكتوب غلط، نوع غلط) تظهر وقت التشغيل ومن غير autocomplete. الـ model بيحول الـ JSON مرة واحدة في <code>fromJson</code> لنوع typed فالمترجم يمسك الأخطاء. الحقل اللي ممكن يبقى null بعمله nullable (<code>String? city</code>) وبعمل cast <code>as String?</code>، والـ lists بتتحول بـ <code>(json['images'] as List&lt;dynamic&gt;? ?? [])</code>." },
      ],
    },
    {
      title: "json_serializable: الفكرة",
      en: "json_serializable (concept)",
      body: "<p>كتابة <code>fromJson/toJson</code> بإيدك للـ models الكبيرة مملة وبتغلط. حزمة <code>json_serializable</code> (مع <code>json_annotation</code> و<code>build_runner</code>) بتولّد الكود ده من annotation <code>@JsonSerializable()</code> فبتكتب الحقول بس وبتشغل <code>dart run build_runner build</code>. تقدر كمان تستخدم <code>freezed</code> للـ immutable models.</p>",
      points: [
        "للمقابلة: لازم تعرف تكتبها بإيدك (وده اللي تدربت عليه)، وتعرف إن المولّد بيوفر الوقت في المشاريع الكبيرة.",
        "المولّد بيطلع ملف <code>*.g.dart</code> مبيتعدلش بإيدك. وبيحتاج تشغيل أمر build عند أي تغيير في الحقول.",
        "الـ models المكتوبة بإيدك كويسة لحد 10-20 model. بعدها المولّد أريح وأقل أخطاء.",
      ],
    },
    {
      title: "dio: BaseOptions و GET و POST",
      en: "dio, BaseOptions and requests",
      body: "<p>بتعمل instance واحدة من <code>Dio</code> للتطبيق كله (singleton أو provider) بـ <code>BaseOptions</code>: الـ <code>baseUrl</code> والـ timeouts والـ headers الثابتة. بعد كده كل طلب بيكتب المسار بس. وdio بترمي <code>DioException</code> تلقائي لأي status خارج 200-299، فمبتحتاجش تشيك الـ status بإيدك.</p>",
      code: {
        lang: "dart",
        title: "api_client.dart",
        src: `import 'package:dio/dio.dart';

final Dio dio = Dio(
  BaseOptions(
    baseUrl: 'https://api.example.com/api',
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 20),
    headers: {'Accept': 'application/json'},
  ),
);

Future<List<Property>> fetchPage(int page) async {
  final response = await dio.get<Map<String, dynamic>>(
    '/properties',
    queryParameters: {'page': page, 'per_page': 20},
  );
  final data = response.data!['data'] as List<dynamic>;
  return data
      .map((e) => Property.fromJson(e as Map<String, dynamic>))
      .toList();
}

Future<void> createProperty(String title, double price) async {
  await dio.post<void>(
    '/properties',
    data: {'title': title, 'price': price},
  );
}`,
        note: "الـ <code>data</code> لو Map بيتحول لـ JSON وheader الـ Content-Type بيتحط تلقائي. الـ <code>baseUrl</code> + المسار = الـ URL الكامل. الـ <code>queryParameters</code> بتتشفر لوحدها.",
      },
      points: [
        "<b>connectTimeout:</b> أقصى وقت لفتح الاتصال. <b>receiveTimeout:</b> أقصى وقت بين وصول أجزاء الرد. من غيرهم الطلب ممكن يعلق للأبد على شبكة ضعيفة.",
        "الـ pagination بتبعت <code>page</code> و<code>per_page</code> (أو <code>cursor</code>) كـ query parameters، وLaravel بيرجع <code>data</code> و<code>meta</code> فيها <code>current_page</code> و<code>last_page</code>.",
      ],
    },
    {
      title: "Interceptors: token و log و 401",
      en: "Interceptors: bearer token, logging, 401 refresh",
      body: "<p>الـ <b>interceptor</b> كلاس بيعدي عليه كل طلب ورد، فبتحط فيه الحاجات المشتركة مرة واحدة بدل ما تكررها: <code>onRequest</code> (ضيف الـ token)، <code>onResponse</code>، <code>onError</code> (عالج 401). لازم تنادي <code>handler.next(...)</code> (أو <code>resolve</code> / <code>reject</code>) وإلا الطلب يعلق.</p>",
      code: {
        lang: "dart",
        title: "auth_interceptor.dart",
        src: `import 'package:dio/dio.dart';

abstract class TokenStore {
  Future<String?> read();
  Future<bool> refresh(); // asks the server for a new token
  Future<void> clear();
}

class AuthInterceptor extends Interceptor {
  AuthInterceptor(this._tokens, this._dio);

  final TokenStore _tokens;
  final Dio _dio;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _tokens.read();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final isRetry = err.requestOptions.extra['retried'] == true;
    if (err.response?.statusCode == 401 && !isRetry) {
      if (await _tokens.refresh()) {
        err.requestOptions.extra['retried'] = true;
        final response = await _dio.fetch<dynamic>(err.requestOptions);
        return handler.resolve(response);
      }
      await _tokens.clear();
    }
    handler.next(err);
  }
}

// dio.interceptors.add(AuthInterceptor(tokens, dio));
// debug only: dio.interceptors.add(LogInterceptor());`,
        note: "الفكرة (concept): عند 401 جرّب تجدد الـ token مرة واحدة وأعد الطلب. العلامة <code>retried</code> بتمنع حلقة لا نهائية. لو أكتر من طلب فشل مع بعض استخدم <code>QueuedInterceptor</code> عشان التجديد يحصل مرة واحدة.",
      },
      pitfall: "نسيان <code>handler.next</code>: الطلب بيفضل معلق من غير خطأ. وكتابة <code>LogInterceptor</code> في الـ release بتسرب الـ tokens والبيانات الشخصية في الـ logs؛ شغله في debug بس ومتطبعش الـ Authorization header.",
      interview: [
        { q: "إيه هو الـ interceptor في dio؟ وإزاي تتعامل مع 401؟", a: "الـ interceptor بيعدي عليه كل طلب ورد وخطأ، فبحط فيه المنطق المشترك: <code>onRequest</code> بضيف <code>Authorization: Bearer token</code>، و<code>onError</code> بتعامل مع الأخطاء. عند 401 بنادي endpoint تجديد الـ token مرة واحدة، ولو نجح بعيد الطلب الأصلي بـ <code>dio.fetch(requestOptions)</code> وبنرجع النتيجة بـ <code>handler.resolve</code>، ولو فشل بمسح الـ token وبوجّه المستخدم لشاشة الدخول. بحط علامة عشان ما يحصلش loop، وبستخدم QueuedInterceptor عشان طلبات كتير ما تجددش الـ token مع بعض." },
      ],
    },
    {
      title: "تحويل الأخطاء لرسائل للمستخدم",
      en: "Mapping DioException and SocketException to failures",
      body: "<p>المستخدم مش عايز يشوف <code>DioException [bad response]</code>. الـ repository يمسك أي exception ويحولها لـ <b>Failure</b> typed (sealed) بمعنى مفهوم: مفيش إنترنت، انتهى الوقت، مش مصرح، خطأ من السيرفر. الـ UI بتعرض رسالة بحسب النوع، ومتعرفش حاجة عن dio.</p>",
      code: {
        lang: "dart",
        title: "failure.dart",
        src: `import 'dart:io';
import 'package:dio/dio.dart';

sealed class Failure {
  const Failure(this.message);
  final String message;
}

class NetworkFailure extends Failure {
  const NetworkFailure() : super('No internet connection');
}

class TimeoutFailure extends Failure {
  const TimeoutFailure() : super('The request took too long');
}

class UnauthorizedFailure extends Failure {
  const UnauthorizedFailure() : super('Please sign in again');
}

class ServerFailure extends Failure {
  const ServerFailure(this.statusCode, super.message);
  final int? statusCode;
}

class UnknownFailure extends Failure {
  const UnknownFailure() : super('Something went wrong');
}

Failure mapError(Object error) {
  if (error is DioException) {
    return switch (error.type) {
      DioExceptionType.connectionTimeout ||
      DioExceptionType.sendTimeout ||
      DioExceptionType.receiveTimeout ||
      DioExceptionType.transformTimeout =>
        const TimeoutFailure(),
      DioExceptionType.connectionError => const NetworkFailure(),
      DioExceptionType.badResponse => _fromStatus(error),
      DioExceptionType.cancel ||
      DioExceptionType.badCertificate ||
      DioExceptionType.unknown =>
        const UnknownFailure(),
    };
  }
  if (error is SocketException) return const NetworkFailure();
  return const UnknownFailure();
}

Failure _fromStatus(DioException error) {
  final status = error.response?.statusCode;
  if (status == 401) return const UnauthorizedFailure();
  return ServerFailure(status, 'Server error');
}`,
        note: "الـ <code>switch</code> expression على الـ enum بيجبرك تغطي كل الأنواع. مع http (بدل dio) بتمسك <code>SocketException</code> و<code>TimeoutException</code> و<code>FormatException</code> بنفس الأسلوب.",
      },
      points: [
        "<b>422</b> من Laravel معناها validation: الرد فيه <code>errors</code> لكل حقل. اعرضها جنب الحقل مش رسالة عامة.",
        "<b>الأخطاء اللي بنلاحظها:</b> فشل الاتصال، timeout، 401/403، 404، 5xx، JSON مش بالشكل المتوقع (<code>FormatException</code>/<code>TypeError</code> وقت الـ parsing).",
      ],
      interview: [
        { q: "إزاي بتعالج أخطاء الشبكة في Flutter وتعرضها للمستخدم؟", a: "بمسك الـ exceptions في الـ repository (<code>DioException</code> بأنواعه: connectionTimeout، connectionError، badResponse، cancel...، و<code>SocketException</code> مع http) وبحولها لـ sealed class اسمها Failure بأنواع مفهومة (NetworkFailure، TimeoutFailure، UnauthorizedFailure، ServerFailure). الـ UI تعرض رسالة مناسبة لكل نوع، مفيش رسائل خام من المكتبة، ولا الـ UI تعرف حاجة عن dio. للـ 422 بعرض أخطاء الحقول جنب الحقول." },
      ],
    },
    {
      title: "الإلغاء، الرفع، والأسرار",
      en: "CancelToken, multipart upload, secrets",
      body: "<p><b>الإلغاء:</b> لو المستخدم كتب بحث جديد، الطلب القديم ملوش لازمة. <code>CancelToken</code> بيلغيه (وبيرمي <code>DioException</code> نوعها cancel). <b>الرفع:</b> الصور بتتبعت <code>multipart/form-data</code> بـ <code>FormData</code>. <b>الأسرار:</b> أي حاجة جوه التطبيق تقدر تتفك، فعمرك ما تحط secret حقيقي فيه.</p>",
      codes: [
        {
          lang: "dart",
          title: "cancel",
          src: `class PropertySearch {
  PropertySearch(this._dio);

  final Dio _dio;
  CancelToken? _current;

  Future<List<Property>> search(String query) async {
    _current?.cancel('new search');
    final token = _current = CancelToken();
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        '/properties',
        queryParameters: {'q': query},
        cancelToken: token,
      );
      final data = response.data!['data'] as List<dynamic>;
      return data
          .map((e) => Property.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      if (CancelToken.isCancel(e)) return [];
      rethrow;
    }
  }
}`,
        },
        {
          lang: "dart",
          title: "multipart upload",
          src: `Future<void> uploadAvatar(String path) async {
  final form = FormData.fromMap({
    'name': 'avatar',
    'file': await MultipartFile.fromFile(path, filename: 'avatar.jpg'),
  });
  await dio.post<void>(
    '/profile/avatar',
    data: form,
    onSendProgress: (sent, total) {
      final percent = total <= 0 ? 0 : sent / total;
      print('Uploaded: $percent');
    },
  );
}`,
        },
        {
          lang: "dart",
          title: "base URL من الـ build مش من الكود",
          src: `// flutter run --dart-define=API_URL=https://api.example.com
const apiUrl = String.fromEnvironment('API_URL');

final Dio configured = Dio(BaseOptions(baseUrl: apiUrl));`,
        },
      ],
      points: [
        "<b>ممنوع</b> تحط في الكود: مفاتيح secret (Stripe secret، OpenAI، مفاتيح الـ admin)، باسوردات قاعدة البيانات. دي مكانها السيرفر، والتطبيق يكلم السيرفر بس. المفاتيح <b>العامة</b> (publishable) مسموحة.",
        "الإعدادات اللي بتختلف بين dev و prod (الـ base URL) بتيجي بـ <code>--dart-define</code>، ومتتكتبش في ملف بيتعمله commit.",
        "الـ tokens بتتخزن في <code>flutter_secure_storage</code> (المستوى بتاع التخزين المحلي)، مش في الكود ولا في shared_preferences.",
      ],
      interview: [
        { q: "إزاي ترفع صورة؟ وإزاي تلغي طلب؟ وفين تحط الـ API keys؟", a: "الرفع بـ <code>FormData.fromMap({'file': await MultipartFile.fromFile(path)})</code> وبعمله <code>post</code> ومعاه <code>onSendProgress</code> لشريط التقدم. الإلغاء بـ <code>CancelToken</code> بمرره للطلب وأنادي <code>cancel()</code> لما يبقى فيه طلب أحدث، وأمسك <code>DioException</code> وأفحص <code>CancelToken.isCancel</code>. الأسرار (secret keys) مبحطهاش في التطبيق أبدا لأن أي حاجة فيه تتفك؛ مكانها السيرفر. المفاتيح العامة والـ base URL بتيجي من <code>--dart-define</code> أو إعدادات build." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: model بـ fromJson",
      lang: "dart",
      code: `class Property {
  const Property({required this.id, required this.title, this.city});

  final int id;
  final String title;
  final String? city;

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(
      id: json['id'] as int,
      title: json['title'] as String,
      city: json['city'] as String?,
    );
  }
}`,
    },
    {
      title: "اكتب: Dio و GET",
      lang: "dart",
      code: `final dio = Dio(
  BaseOptions(
    baseUrl: 'https://api.example.com/api',
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 20),
  ),
);

Future<List<dynamic>> fetchPage(int page) async {
  final response = await dio.get<Map<String, dynamic>>(
    '/properties',
    queryParameters: {'page': page},
  );
  return response.data!['data'] as List<dynamic>;
}`,
    },
    {
      title: "اكتب: interceptor",
      lang: "dart",
      code: `class AuthInterceptor extends Interceptor {
  AuthInterceptor(this.readToken);

  final Future<String?> Function() readToken;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await readToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }
}`,
    },
  ],

  tasks: [
    {
      title: "model للعقار بـ parsing آمن",
      lang: "dart",
      prompt: "<p>اكتب <code>Property</code> فيه <code>id</code> (int) و<code>title</code> (String) و<code>price</code> (double) و<code>city</code> (String? ) و<code>images</code> (List&lt;String&gt;، بقيمة افتراضية فاضية). اكتب <code>factory Property.fromJson</code> (السعر ممكن يجي int أو double، والـ <code>images</code> ممكن تيجي null) و<code>toJson</code>. وبعدين <code>List&lt;Property&gt; parsePage(String body)</code> بتاخد النص الخام للرد <code>{\"data\": [...]}</code> وبترجع القايمة بـ <code>jsonDecode</code>.</p>",
      examples: [{ in: "parsePage('{\"data\":[{\"id\":1,\"title\":\"Villa\",\"price\":1500}]}')", out: "[Property(id: 1, price: 1500.0)]" }],
      hints: [
        "السعر: <code>(json['price'] as num).toDouble()</code>.",
        "الـ images: <code>(json['images'] as List&lt;dynamic&gt;? ?? []).map((e) =&gt; e as String).toList()</code>.",
      ],
      solution: `import 'dart:convert';

class Property {
  const Property({
    required this.id,
    required this.title,
    required this.price,
    this.city,
    this.images = const [],
  });

  final int id;
  final String title;
  final double price;
  final String? city;
  final List<String> images;

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(
      id: json['id'] as int,
      title: json['title'] as String,
      price: (json['price'] as num).toDouble(),
      city: json['city'] as String?,
      images: (json['images'] as List<dynamic>? ?? [])
          .map((e) => e as String)
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'price': price,
        'city': city,
        'images': images,
      };
}

List<Property> parsePage(String body) {
  final decoded = jsonDecode(body) as Map<String, dynamic>;
  final data = decoded['data'] as List<dynamic>;
  return data
      .map((e) => Property.fromJson(e as Map<String, dynamic>))
      .toList();
}`,
      explain: "<code>as num</code> بتقبل int و double. الـ nullable بنعمله cast لـ <code>String?</code>. وللقايمة بنحط <code>?? []</code> قبل <code>map</code>. الـ parsing كله في مكان واحد (الـ model) فباقي التطبيق typed.",
    },
    {
      title: "ApiClient بيرجع نتيجة أو Failure",
      lang: "dart",
      prompt: "<p>اكتب <code>sealed class Failure</code> بنوعين <code>NetworkFailure</code> و<code>ServerFailure(int? statusCode)</code> وواحد <code>UnknownFailure</code>. و<code>Failure mapError(Object e)</code>: <code>DioException</code> من نوع connectionError أو أي timeout تبقى NetworkFailure، و<code>badResponse</code> تبقى ServerFailure بالـ status، والباقي UnknownFailure. وبعدين <code>ApiClient</code> بياخد <code>Dio</code> في الـ constructor وفيه <code>Future&lt;List&lt;dynamic&gt;&gt; getPage(int page)</code> بترمي <code>Failure</code> (<code>throw mapError(e)</code>) بدل DioException.</p>",
      hints: [
        "استخدم <code>switch</code> expression على <code>e.type</code> وغطي كل قيم <code>DioExceptionType</code>.",
        "<code>try { ... } on DioException catch (e) { throw mapError(e); }</code>. الـ Failure مش Exception بس تقدر ترميها لأن Dart بيسمح برمي أي كائن.",
      ],
      solution: `import 'package:dio/dio.dart';

sealed class Failure {
  const Failure();
}

class NetworkFailure extends Failure {
  const NetworkFailure();
}

class ServerFailure extends Failure {
  const ServerFailure(this.statusCode);
  final int? statusCode;
}

class UnknownFailure extends Failure {
  const UnknownFailure();
}

Failure mapError(Object e) {
  if (e is DioException) {
    return switch (e.type) {
      DioExceptionType.connectionError ||
      DioExceptionType.connectionTimeout ||
      DioExceptionType.sendTimeout ||
      DioExceptionType.receiveTimeout ||
      DioExceptionType.transformTimeout =>
        const NetworkFailure(),
      DioExceptionType.badResponse =>
        ServerFailure(e.response?.statusCode),
      DioExceptionType.cancel ||
      DioExceptionType.badCertificate ||
      DioExceptionType.unknown =>
        const UnknownFailure(),
    };
  }
  return const UnknownFailure();
}

class ApiClient {
  ApiClient(this._dio);

  final Dio _dio;

  Future<List<dynamic>> getPage(int page) async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        '/properties',
        queryParameters: {'page': page},
      );
      return response.data!['data'] as List<dynamic>;
    } on DioException catch (e) {
      throw mapError(e);
    }
  }
}`,
      explain: "الـ client هو الوحيد اللي يعرف dio. باقي التطبيق بيمسك <code>Failure</code> typed. الـ <code>switch</code> الشامل بيضمن إنك مانسيتش نوع. (في Dart ممكن ترمي أي كائن، لكن الأحسن للـ Failure تبقى <code>implements Exception</code> لو هترميها.)",
    },
    {
      title: "AuthInterceptor يضيف token ويمسحه عند 401",
      lang: "dart",
      prompt: "<p>اكتب <code>abstract class TokenStore</code> فيه <code>Future&lt;String?&gt; read()</code> و<code>Future&lt;void&gt; clear()</code>. واكتب <code>AuthInterceptor extends Interceptor</code> بياخد <code>TokenStore</code>: في <code>onRequest</code> يضيف <code>Authorization: Bearer ...</code> لو فيه token، وفي <code>onError</code> لو الـ status 401 يمسح الـ token وبعدين يكمل الخطأ لأعلى. واكتب دالة <code>Dio createDio(TokenStore tokens)</code> بترجع Dio بـ baseUrl وtimeout وبتضيف الـ interceptor.</p>",
      hints: [
        "في الاتنين لازم تنادي <code>handler.next(...)</code>: <code>handler.next(options)</code> و<code>handler.next(err)</code>.",
        "<code>err.response?.statusCode == 401</code>.",
      ],
      solution: `import 'package:dio/dio.dart';

abstract class TokenStore {
  Future<String?> read();
  Future<void> clear();
}

class AuthInterceptor extends Interceptor {
  AuthInterceptor(this._tokens);

  final TokenStore _tokens;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _tokens.read();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      await _tokens.clear();
    }
    handler.next(err);
  }
}

Dio createDio(TokenStore tokens) {
  final dio = Dio(
    BaseOptions(
      baseUrl: 'https://api.example.com/api',
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 20),
    ),
  );
  dio.interceptors.add(AuthInterceptor(tokens));
  return dio;
}`,
      explain: "الـ token مكانه واحد (TokenStore) والـ interceptor هو اللي بيضيفه، فمفيش شاشة بتكتب header. في المنتج الحقيقي بتضيف خطوة تجديد الـ token قبل المسح وبتستخدم <code>QueuedInterceptor</code> للطلبات المتوازية.",
    },
  ],

  quiz: [
    {
      q: "أنهي حاجة dio بتديها وhttp لا (بدون كتابتها بإيدك)؟",
      options: [
        "إرسال GET",
        "تفكيك JSON",
        "interceptors و CancelToken و BaseOptions",
        "استخدام HTTPS",
      ],
      answer: 2,
      why: "http بتعمل الطلبات الأساسية. dio بتضيف البنية: base URL وtimeouts وinterceptors وإلغاء ورفع ملفات.",
    },
    {
      q: "ليه الـ POST بـ http محتاج <code>Content-Type: application/json</code>؟",
      options: [
        "عشان Laravel يفهم الـ body كـ JSON ويقراه",
        "عشان الطلب يبقى أسرع",
        "عشان ميتعملش cache",
        "ملهاش لازمة",
      ],
      answer: 0,
      why: "من غير الـ header السيرفر مش بيعرف إن الـ body JSON، فبيرجع body فاضي أو خطأ validation. وlaravel بيحتاج كمان <code>Accept: application/json</code> عشان يرد JSON على الأخطاء.",
    },
    {
      q: "الـ API بعتت <code>\"price\": 1500</code> والكود ده بيقع. ليه؟",
      code: { lang: "dart", src: `final price = json['price'] as double;` },
      options: [
        "الـ price لازم تتبعت String",
        "ناقص <code>await</code>",
        "الـ JSON نفسه غلط",
        "1500 بتتفك كـ <code>int</code> مش <code>double</code>، والـ cast بيرمي TypeError",
      ],
      answer: 3,
      why: "الصح <code>(json['price'] as num).toDouble()</code> لأنه بيقبل الاتنين.",
    },
    {
      q: "dio بترمي <code>DioException</code> من نوع إيه لما السيرفر يرد بـ 404؟",
      options: [
        "<code>connectionError</code>",
        "<code>badResponse</code>",
        "<code>cancel</code>",
        "مبترميش، بترجع Response عادي",
      ],
      answer: 1,
      why: "بشكل افتراضي أي status خارج 200-299 بيعمل <code>badResponse</code> وفيه <code>error.response</code> بالـ status والـ body.",
    },
    {
      q: "إيه الفرق بين connectTimeout و receiveTimeout؟",
      options: [
        "الاتنين نفس الشيء",
        "connect: أقصى وقت لفتح الاتصال، receive: أقصى وقت لوصول الرد",
        "connect للرفع، receive للتحميل",
        "connect للـ GET، receive للـ POST",
      ],
      answer: 1,
      why: "اللي بيفشل في الأولى سببه الوصول للسيرفر، والتانية بطء الرد. من غير timeouts الطلب ممكن يعلق.",
    },
    {
      q: "في interceptor الـ <code>onRequest</code>، نسيت تنادي <code>handler.next(options)</code>. إيه اللي هيحصل؟",
      options: [
        "الطلب يتبعت عادي",
        "الطلب يتبعت مرتين",
        "الطلب بيفضل معلق ومش هيكمل",
        "dio بتنادي next لوحدها",
      ],
      answer: 2,
      why: "الـ handler هو اللي بيكمل السلسلة، ومن غيره الطلب مبيمشيش لا لنجاح ولا لفشل.",
    },
    {
      q: "ازاي تتجنب الـ loop اللانهائي في refresh الـ token عند 401؟",
      options: [
        "تجدد الـ token في كل طلب",
        "تتجاهل 401 خالص",
        "تعمل timeout أطول",
        "تحط علامة على الطلب المعاد (retried) وتجدد مرة واحدة بس",
      ],
      answer: 3,
      why: "لو الطلب المعاد رجع 401 تاني، من غير علامة هتجدد وتعيد لا نهائي. بنجدد مرة، ولو فشل بنمسح الجلسة ونرجع لشاشة الدخول.",
    },
    {
      q: "فين تحط مفتاح Stripe الـ <b>secret</b>؟",
      options: [
        "في ثابت داخل كود Flutter",
        "في ملف .env داخل assets",
        "في السيرفر فقط، والتطبيق يكلم السيرفر",
        "في shared_preferences",
      ],
      answer: 2,
      why: "أي حاجة في التطبيق (حتى assets و dart-define) ممكن تتفك. الأسرار الحقيقية مكانها السيرفر.",
    },
    {
      q: "مين بيرمي <code>SocketException</code> مباشرة لما مفيش إنترنت؟",
      options: [
        "dio دايما",
        "حزمة http (و dio بتلفها جوه DioException)",
        "jsonDecode",
        "Uri.parse",
      ],
      answer: 1,
      why: "http بتسيب الاستثناء من dart:io يطلع كما هو. dio بتحوله لـ <code>DioException</code> نوع connectionError، والأصلي في <code>error.error</code>.",
    },
    {
      q: "اسم الـ header اللي بيتبعت فيه الـ bearer token:",
      answer: ["Authorization", "authorization"],
      why: "الشكل <code>Authorization: Bearer &lt;token&gt;</code>.",
    },
  ],
};
