window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f18"] = {
  slides: [
    {
      kicker: "الكود الأصلي",
      title: "Platform channels: تكلم Android وiOS من Dart",
      en: "MethodChannel",
      body: "<p>Flutter بيرسم الواجهة بنفسه، لكن حاجات كتير بتاعة النظام (البطارية، الكاميرا، الـ biometrics، SDK خارجي) متاحة بس من كود <b>Kotlin/Java</b> على Android و<b>Swift</b> على iOS. الجسر بينهم هو الـ <code>MethodChannel</code>: قناة باسم، Dart بتبعت عليها اسم دالة ومعاها arguments، والكود الأصلي بيرد بنتيجة (أو خطأ).</p><p><b>قاعدة عملية:</b> قبل ما تكتب channel بإيدك دور على plugin جاهز في pub.dev. 95% من الحالات فيها plugin (camera، geolocator، local_auth...). الـ plugins نفسها مبنية بنفس الـ MethodChannel.</p>",
      codes: [
        {
          lang: "dart",
          title: "جانب Dart",
          src: `import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

class BatteryService {
  static const _channel = MethodChannel('com.example.app/battery');

  Future<int?> level() async {
    try {
      return await _channel.invokeMethod<int>('getBatteryLevel');
    } on PlatformException catch (e) {
      debugPrint('battery failed: \${e.code} \${e.message}');
      return null;
    } on MissingPluginException {
      return null; // no native handler (tests, desktop)
    }
  }
}`,
          note: "اسم القناة لازم يتطابق حرفيا في الجهتين. بنقلب <code>PlatformException</code> (الكود الأصلي رد بخطأ) و<code>MissingPluginException</code> (مفيش handler).",
        },
        {
          lang: "text",
          title: "جانب Android: MainActivity.kt (غير مُحلَّل)",
          src: `class MainActivity : FlutterActivity() {
  override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
    super.configureFlutterEngine(flutterEngine)
    MethodChannel(
      flutterEngine.dartExecutor.binaryMessenger,
      "com.example.app/battery"
    ).setMethodCallHandler { call, result ->
      if (call.method == "getBatteryLevel") {
        val bm = getSystemService(BATTERY_SERVICE) as BatteryManager
        result.success(
          bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
        )
      } else {
        result.notImplemented()
      }
    }
  }
}`,
        },
        {
          lang: "text",
          title: "جانب iOS: AppDelegate.swift (غير مُحلَّل)",
          src: `let controller = window?.rootViewController as! FlutterViewController
let channel = FlutterMethodChannel(
  name: "com.example.app/battery",
  binaryMessenger: controller.binaryMessenger)

channel.setMethodCallHandler { call, result in
  if call.method == "getBatteryLevel" {
    UIDevice.current.isBatteryMonitoringEnabled = true
    result(Int(UIDevice.current.batteryLevel * 100))
  } else {
    result(FlutterMethodNotImplemented)
  }
}`,
          note: "الكود ده بيتحط جوه <code>didFinishLaunchingWithOptions</code>. شكل الـ AppDelegate بيتغير من إصدار Flutter لإصدار، لكن الفكرة ثابتة: اسم القناة، handler، <code>success</code> أو <code>notImplemented</code>.",
        },
      ],
      interview: [
        { q: "إيه هو الـ platform channel؟ وإمتى تكتبه بدل plugin؟", a: "الـ <code>MethodChannel</code> وسيلة رسائل بين Dart والكود الأصلي: Dart بتنادي <code>invokeMethod('name', args)</code> على قناة باسم معين، والـ Kotlin أو Swift عندهم handler بنفس الاسم بيرد بـ <code>success</code> أو error. بكتبه لما أحتاج ميزة نظام أو SDK خارجي مفيش له plugin جاهز أو الموجود مش مناسب. غير كده بستخدم plugin من pub.dev لأنه متصان وبيغطي الاتنين Android وiOS، والـ plugins نفسها مبنية على نفس الآلية." },
      ],
    },
    {
      title: "الصلاحيات (Permissions)",
      en: "Permission flow, AndroidManifest and Info.plist",
      body: "<p>الصلاحية فيها <b>خطوتين منفصلتين</b>: (1) تعلن عنها في ملفات المنصة، (2) تطلبها من المستخدم وقت التشغيل. من غير الإعلان التطبيق مش هيقدر يطلبها أصلا (وعلى iOS التطبيق بيقع).</p>",
      codes: [
        {
          lang: "text",
          title: "Android: android/app/src/main/AndroidManifest.xml (غير مُحلَّل)",
          src: `<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<!-- Android 13+: required to show notifications -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>`,
        },
        {
          lang: "text",
          title: "iOS: ios/Runner/Info.plist (غير مُحلَّل)",
          src: `<key>NSCameraUsageDescription</key>
<string>We use the camera to add photos to your listing.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>We use your location to show nearby properties.</string>`,
          note: "على iOS لازم نص بيشرح للمستخدم <b>ليه</b> محتاج الصلاحية، وApple بترفض التطبيق لو النص عام أو ناقص. الـ plugin <code>permission_handler</code> كمان محتاج إعداد في الـ Podfile لكل صلاحية، اقرا الـ README بتاعه.",
        },
        {
          lang: "dart",
          title: "الطلب وقت التشغيل: permission_handler",
          src: `import 'package:permission_handler/permission_handler.dart';

Future<bool> ensureCamera() async {
  var status = await Permission.camera.status;
  if (status.isGranted) return true;

  if (status.isPermanentlyDenied) {
    await openAppSettings(); // the system dialog will not show again
    return false;
  }

  status = await Permission.camera.request();
  return status.isGranted;
}`,
          note: "<b>permission_handler</b> حزمة خارجية. الحالات: granted و denied و permanentlyDenied (المستخدم رفض مع «don't ask again») و restricted (مقيدة من النظام) و limited (iOS). وفي permanentlyDenied الطريق الوحيد هو <code>openAppSettings()</code>.",
        },
      ],
      points: [
        "اطلب الصلاحية <b>وقت الحاجة</b> (لما يضغط على «صوّر») مش أول ما التطبيق يفتح، وقبلها اشرح بشاشة بسيطة ليه محتاجها.",
        "متفترضش إن الرفض نهائي: التطبيق لازم يشتغل (بوظائف أقل) من غير الصلاحية.",
      ],
      interview: [
        { q: "إزاي بتتعامل مع الصلاحيات في Flutter؟", a: "بعلن عنها في ملفات المنصة: <code>AndroidManifest.xml</code> و<code>Info.plist</code> (على iOS مع نص usage description واضح). ووقت التشغيل بستخدم plugin زي <code>permission_handler</code>: بشوف <code>status</code>، لو granted أكمل، لو denied أطلبها بـ <code>request()</code>، ولو permanentlyDenied بوري المستخدم رسالة وأفتح إعدادات التطبيق بـ <code>openAppSettings()</code>. وبطلبها في لحظة الاستخدام مش في أول تشغيل، ومضمنش إن التطبيق يشتغل من غيرها." },
      ],
    },
    {
      title: "Push notifications: القطع كلها",
      en: "FCM architecture: project, token, APNs, backend",
      body: "<p>الـ push في تطبيقك الحقيقي مبني على <b>Firebase Cloud Messaging (FCM)</b>. الفهم المهم هو القطع اللي بتتكلم مع بعض:</p>",
      points: [
        "<b>Firebase project:</b> بتسجل فيه تطبيق Android (<code>google-services.json</code>) وتطبيق iOS (<code>GoogleService-Info.plist</code>). الأداة <code>flutterfire configure</code> بتجهز ده وبتولد <code>firebase_options.dart</code>.",
        "<b>Device token:</b> رقم فريد للجهاز+التطبيق بيطلعه FCM (<code>getToken()</code>). ممكن يتغير (<code>onTokenRefresh</code>). في الإصدار 17 من الحزمة ظهرت بدايل (<code>register()</code> و<code>onRegistered</code>) والقديمين deprecated، وهنوضح ده في الشريحة الجاية.",
        "<b>الـ backend:</b> التطبيق يبعت الـ token لسيرفرك (Laravel) مع الـ user id وتحفظه. لما يحصل حدث (عقار جديد، رسالة) السيرفر يبعت طلب لـ FCM (عن طريق HTTP v1 API بحساب خدمة service account) للـ token ده. التطبيق نفسه مبيبعتش notifications لنفسه.",
        "<b>iOS خاصة:</b> FCM بيوصل لـ iOS عن طريق <b>APNs</b> (خدمة Apple). لازم ترفع <b>APNs Authentication Key</b> (ملف .p8 من Apple Developer) في إعدادات Firebase، وتفعل capability <b>Push Notifications</b> و<b>Background Modes → Remote notifications</b> في Xcode. الـ push مش بيشتغل على iOS simulator العادي بشكل موثوق: جرّب على جهاز حقيقي.",
        "<b>Android 13+:</b> لازم صلاحية <code>POST_NOTIFICATIONS</code> وقت التشغيل.",
      ],
      focus: [{ label: "التدفق", text: "التطبيق يطلب الصلاحية ثم يجيب الـ token ثم يبعته للـ backend. الـ backend يبعت رسالة لـ FCM بالـ token. FCM يوصلها للجهاز (عن طريق APNs على iOS)." }],
      interview: [
        { q: "اشرح إزاي بتعمل push notifications في تطبيق Flutter من الأول للآخر.", a: "بعمل Firebase project وبسجل تطبيقات Android وiOS وبضيف ملفات الإعداد (و<code>flutterfire configure</code>). في التطبيق بضيف <code>firebase_core</code> و<code>firebase_messaging</code>، وبعمل <code>Firebase.initializeApp</code>، وبطلب صلاحية الإشعارات، وبجيب الـ token بـ <code>getToken()</code> وببعته للـ backend مع المستخدم، وبسمع لـ <code>onTokenRefresh</code>. السيرفر لما يحتاج يبعت إشعار يطلب من FCM يبعت للـ token. على iOS محتاج APNs key مرفوع في Firebase وcapabilities في Xcode. وفي التطبيق بتعامل مع التلات حالات: foreground و background و terminated، وبفتح الشاشة الصح لما المستخدم يضغط على الإشعار." },
      ],
    },
    {
      title: "FCM في الكود: foreground و background و terminated",
      en: "firebase_messaging: onMessage, onMessageOpenedApp, getInitialMessage",
      body: "<p>الإشعار ممكن يوصل والتطبيق في تلات حالات، وكل حالة ليها مدخل مختلف في الكود:</p>",
      terms: [
        ["Foreground", "التطبيق مفتوح قدامك", "بيوصل في <code>FirebaseMessaging.onMessage</code>. النظام <b>مبيعرضش</b> إشعار تلقائي (على Android)، انت بتقرر: SnackBar أو إشعار محلي."],
        ["Background", "التطبيق شغال في الخلفية", "النظام بيعرض الإشعار. لو المستخدم ضغط عليه: <code>onMessageOpenedApp</code>."],
        ["Terminated", "التطبيق مقفول خالص", "النظام بيعرض الإشعار. لو ضغط عليه والتطبيق فتح: <code>getInitialMessage()</code> (مرة واحدة عند البداية)."],
      ],
      code: {
        lang: "dart",
        title: "push_service.dart",
        src: `import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';

import 'firebase_options.dart';

@pragma('vm:entry-point')
Future<void> firebaseBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  debugPrint('background message: \${message.messageId}');
}

class PushService {
  final _messaging = FirebaseMessaging.instance;

  Future<void> init({
    required Future<void> Function(String token) sendTokenToServer,
    required void Function(RemoteMessage message) onOpen,
  }) async {
    final settings = await _messaging.requestPermission();
    if (settings.authorizationStatus == AuthorizationStatus.denied) return;

    final token = await _messaging.getToken();
    if (token != null) await sendTokenToServer(token);
    _messaging.onTokenRefresh.listen(sendTokenToServer);

    FirebaseMessaging.onMessage.listen((message) {
      debugPrint('foreground: \${message.notification?.title}');
    });

    FirebaseMessaging.onMessageOpenedApp.listen(onOpen);

    final initial = await _messaging.getInitialMessage();
    if (initial != null) onOpen(initial);
  }
}

// main():
//   WidgetsFlutterBinding.ensureInitialized();
//   await Firebase.initializeApp(options: ...);
//   FirebaseMessaging.onBackgroundMessage(firebaseBackgroundHandler);`,
        note: "<b>ملاحظة إصدارات:</b> في <code>firebase_messaging</code> 17 الدالتين <code>getToken()</code> و<code>onTokenRefresh</code> اتعلّموا deprecated وبديلهم <code>register()</code> و<code>onRegistered</code> (بيدّوا Firebase Installation ID). لسه شغالين، وهما اللي هتلاقيهم في أغلب التطبيقات الموجودة، فراجع توثيق الإصدار اللي بتستخدمه. الـ background handler لازم يكون <b>دالة top-level</b> (مش method جوه كلاس) وعليها <code>@pragma('vm:entry-point')</code>، لأنها بتشتغل في isolate منفصل. خليها خفيفة. <code>requestPermission</code> مهمة على iOS وAndroid 13+.",
      },
      pitfall: "نسيان <code>getInitialMessage()</code>: المستخدم يضغط على إشعار والتطبيق مقفول، التطبيق يفتح على الشاشة الرئيسية بدل الشاشة المقصودة. وكمان استدعاؤه لازم يبقى بعد ما الـ router يجهز.",
      interview: [
        { q: "إزاي بتتعامل مع الإشعار في الحالات التلاتة؟", a: "في الـ <b>foreground</b> الرسالة بتيجي في <code>FirebaseMessaging.onMessage</code> والنظام مبيعرضهاش لوحده، فأنا أعرضها (SnackBar أو إشعار محلي). في الـ <b>background</b> النظام يعرضها، ولما المستخدم يضغط عليها بيتنادي <code>onMessageOpenedApp</code> وأنفذ الـ navigation. في الـ <b>terminated</b> النظام يعرضها، ولما المستخدم يضغط والتطبيق يفتح بنادي <code>getInitialMessage()</code> عند البداية عشان أعرف إنه اتفتح من إشعار. وفي الخلفية ومع data messages بسجل <code>onBackgroundMessage</code> بدالة top-level." },
      ],
    },
    {
      title: "Notification message ولا data message؟ و topics",
      en: "Notification vs data messages, topics, deep linking from a push",
      terms: [
        ["Notification message", "رسالة إشعار", "فيها <code>notification: {title, body}</code>. لما التطبيق background/terminated، النظام نفسه بيعرضها من غير ما كودك يشتغل. بسيطة، لكن تحكمك قليل."],
        ["Data message", "رسالة بيانات", "فيها <code>data: {...}</code> بس (مفاتيح وقيم نصية). مبتتعرضش لوحدها: بتوصل لكودك (handler) وانت بتقرر تعرض إيه. بتتحكم في كل حاجة، لكن شغل أكتر، وعلى iOS الـ background delivery مش مضمون."],
      ],
      points: [
        "<b>الأشهر في التطبيقات:</b> رسالة فيها notification (العنوان والنص) <b>و</b> data (مثلا <code>{\"propertyId\": \"42\"}</code>) عشان لما المستخدم يضغط تعرف تفتح العقار 42.",
        "<b>Topics:</b> <code>subscribeToTopic('riyadh_offers')</code> بتشترك الجهاز في مجموعة، والسيرفر يبعت للـ topic كله مرة واحدة من غير ما يمسك tokens. مناسب للإعلانات العامة. للإشعارات الشخصية استخدم الـ token.",
        "<b>الـ token بيتنضف:</b> السيرفر لازم يمسح الـ tokens اللي FCM بيقول عليها غير صالحة، ويمسح الـ token لما المستخدم يعمل logout.",
        "الصور الكبيرة والأصوات والأزرار في الإشعار بتحتاج ضبط على الجهتين (وغالبا <code>flutter_local_notifications</code> كحزمة خارجية للتحكم الكامل في الـ foreground).",
      ],
      code: {
        lang: "dart",
        title: "فتح الشاشة من الإشعار (go_router)",
        src: `import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final router = GoRouter(
  routes: [
    GoRoute(path: '/', builder: (context, state) => const Placeholder()),
    GoRoute(
      path: '/property/:id',
      builder: (context, state) {
        return Text('Property \${state.pathParameters['id']}');
      },
    ),
  ],
);

void openFromMessage(RemoteMessage message) {
  final id = message.data['propertyId'];
  if (id != null) router.go('/property/$id');
}

Future<void> subscribeOffers() {
  return FirebaseMessaging.instance.subscribeToTopic('riyadh_offers');
}`,
        note: "الـ <code>data</code> دايما <code>Map&lt;String, dynamic&gt;</code> وقيمها نصوص، فحول الأرقام بنفسك.",
      },
      interview: [
        { q: "إيه الفرق بين notification message و data message في FCM؟", a: "الـ notification message فيها title وbody والنظام بيعرضها لوحده لما التطبيق في الخلفية أو مقفول، فهي بسيطة ومضمونة العرض. الـ data message فيها بيانات بس وبتوصل لكود التطبيق فأنا اللي أقرر أعرض إيه وإزاي، وده مرن لكن محتاج كود، وتسليمها في الخلفية على iOS مش مضمون. عمليا بابعت الاتنين مع بعض: notification للعرض و data زي id العقار عشان أفتح الشاشة الصح عند الضغط." },
      ],
    },
    {
      title: "Deep links",
      en: "Deep links, App Links and Universal Links",
      body: "<p>الـ deep link رابط بيفتح شاشة <b>معينة جوه التطبيق</b> بدل ما يفتح الصفحة الرئيسية أو المتصفح. مثال: <code>https://example.com/property/42</code> لما تضغط عليه من واتساب، لو التطبيق منزل يفتح على العقار 42 مباشرة. في الإنترفيو اعرف التلات أنواع:</p>",
      terms: [
        ["Custom scheme", "بروتوكول مخصص", "<code>myapp://property/42</code>. سهل، لكن أي تطبيق ممكن يدّعيه، ومبيشتغلش لو التطبيق مش منزل."],
        ["Android App Links", "روابط https متحققة", "<code>https://example.com/...</code> مع <code>intent-filter</code> بـ <code>autoVerify</code> وملف <code>assetlinks.json</code> على موقعك. بيفتح التطبيق مباشرة من غير سؤال."],
        ["iOS Universal Links", "روابط https على iOS", "Associated Domains (<code>applinks:example.com</code>) في Xcode وملف <code>apple-app-site-association</code> على موقعك."],
      ],
      points: [
        "الرابط بيوصل لـ Flutter، و<b>go_router</b> بيطابق الـ path مع الـ routes (<code>/property/:id</code>) تلقائي، فمفيش كود زيادة لو الـ routes مصممة صح.",
        "الـ deep link من إشعار هو نفس الفكرة: الـ payload فيه المسار أو الـ id، وانت بتنادي <code>router.go(...)</code>.",
        "لازم تخطط للحالة اللي المستخدم مش مسجل دخول فيها: <code>redirect</code> في go_router يوديه لـ login ثم يرجعه للرابط.",
        "اختبر على جهاز حقيقي والتطبيق مقفول، مش بس مفتوح.",
      ],
    },
    {
      title: "Flavors والـ environments",
      en: "dev / staging / prod, --dart-define, Android flavors and iOS schemes",
      body: "<p>مش هتشغل التطبيق على سيرفر الإنتاج وانت بتجرب. محتاج <b>environments</b> (dev و staging و prod) بإعدادات مختلفة: رابط الـ API، مفاتيح Firebase، اسم التطبيق. فيه مستويين:</p>",
      points: [
        "<b>Dart-level:</b> <code>--dart-define</code> بيمرر قيم وقت البناء، وبتقراها في الكود بـ <code>String.fromEnvironment</code>. أبسط حل لو الفرق في الإعدادات بس.",
        "<b>Native-level (flavors):</b> لما تحتاج <b>تطبيقات منفصلة</b> على نفس الجهاز بـ applicationId مختلف وأيقونة واسم وملف Firebase مختلف (dev و prod جنب بعض). على Android: <code>productFlavors</code> في Gradle. على iOS: schemes وconfigurations بـ xcconfig. التشغيل: <code>flutter run --flavor dev</code>.",
        "<b>تحذير:</b> قيم <code>--dart-define</code> بتتحط جوه التطبيق المبني. مفيش سر (secret) في تطبيق موبايل مهما اخفيته. المفاتيح السرية مكانها السيرفر.",
      ],
      codes: [
        {
          lang: "dart",
          title: "app_config.dart",
          src: `enum Env { dev, staging, prod }

class AppConfig {
  const AppConfig._();

  static const _envName = String.fromEnvironment(
    'ENV',
    defaultValue: 'dev',
  );
  static const apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'https://dev.example.com/api',
  );
  static const logging = bool.fromEnvironment('LOGGING');

  static Env get env => Env.values.byName(_envName);
  static bool get isProd => env == Env.prod;
}`,
          note: "لازم <code>const</code>: <code>fromEnvironment</code> بتشتغل وقت الكومبايل.",
        },
        {
          lang: "bash",
          title: "التشغيل والبناء",
          src: `flutter run --dart-define=ENV=dev --dart-define=LOGGING=true

# many values: put them in a json file
flutter run --dart-define-from-file=env/dev.json

# production build
flutter build appbundle \\
  --dart-define=ENV=prod \\
  --dart-define=API_URL=https://api.example.com/api`,
        },
      ],
      interview: [
        { q: "إزاي بتفصل بين بيئة التطوير والإنتاج في Flutter؟", a: "لو الفرق إعدادات بس (رابط API، مستوى logging) بستخدم <code>--dart-define</code> أو <code>--dart-define-from-file</code> وأقراها بـ <code>String.fromEnvironment</code> في كلاس <code>AppConfig</code>. لو محتاج تطبيقات منفصلة بأسماء وأيقونات و Firebase projects مختلفة وتتنزل جنب بعض على الجهاز بستخدم flavors: <code>productFlavors</code> في Gradle على Android وschemes على iOS، وبشغلها بـ <code>--flavor</code>. وبفتكر إن القيم دي بتتحط في التطبيق فمفيهاش أسرار." },
      ],
    },
    {
      title: "نشر Android: التوقيع والـ App Bundle",
      en: "Keystore, signing, appbundle, version from pubspec",
      body: "<p>Google Play بتقبل ملف <b>App Bundle</b> (<code>.aab</code>) ممضي بمفتاح. الخطوات: تعمل <b>keystore</b> مرة واحدة، وتعرّف Gradle عليه، وتبني.</p>",
      codes: [
        {
          lang: "bash",
          title: "إنشاء الـ keystore وبناء الـ bundle",
          src: `keytool -genkey -v -keystore upload-keystore.jks \\
  -keyalg RSA -keysize 2048 -validity 10000 -alias upload

flutter build appbundle --release
# output: build/app/outputs/bundle/release/app-release.aab`,
        },
        {
          lang: "text",
          title: "android/key.properties (غير مُحلَّل، ممنوع يتعمله commit)",
          src: `storePassword=********
keyPassword=********
keyAlias=upload
storeFile=/Users/me/keys/upload-keystore.jks`,
          note: "وفي <code>android/app/build.gradle(.kts)</code> بتقرا الملف ده وتعرّف <code>signingConfigs.release</code> وتربطه بـ <code>buildTypes.release</code>. صيغة الـ Gradle بتختلف حسب إصدار Flutter (Groovy أو Kotlin DSL) فخدها من التوثيق الرسمي لنشر Android.",
        },
        {
          lang: "yaml",
          title: "pubspec.yaml",
          src: `# versionName = 1.4.0, versionCode (build number) = 23
version: 1.4.0+23`,
          note: "الجزء قبل الـ <code>+</code> هو <code>versionName</code> (ما يشوفه المستخدم) وبعده <code>versionCode</code> على Android و<code>CFBundleVersion</code> على iOS. لازم <b>يزيد في كل رفع</b> للمتجر. تقدر تعدله وقت البناء: <code>--build-name=1.4.0 --build-number=23</code>.",
        },
      ],
      points: [
        "<b>Play App Signing:</b> غالبا بترفع باستخدام <i>upload key</i> وجوجل بتحتفظ بمفتاح التوقيع الحقيقي. لو ضاع الـ upload key تقدر تطلب reset من جوجل، لكن لازم تحتفظ بنسخة احتياطية آمنة.",
        "الـ keystore وملف <code>key.properties</code> <b>ممنوع</b> يترفعوا على git. حطهم في <code>.gitignore</code> واحتفظ بنسخة في مكان آمن.",
        "في الـ release الـ R8 بيصغّر ويخفي كود Java/Kotlin. لو في plugin بيتكسر بعد التفعيل، السبب غالبا قواعد ProGuard.",
      ],
      interview: [
        { q: "إزاي بتجهز تطبيق Android للنشر على Google Play؟", a: "بعمل keystore بـ <code>keytool</code> (مرة واحدة وبحافظ عليه ومبرفعوش على git)، وبكتب <code>key.properties</code> وبربط Gradle بيه في <code>signingConfigs.release</code>. بزود رقم الإصدار في <code>pubspec.yaml</code> (<code>version: 1.4.0+23</code> حيث 1.4.0 هو versionName و23 هو versionCode ولازم يزيد في كل رفع). بعدين <code>flutter build appbundle --release</code> وبرفع الـ <code>.aab</code> في Play Console، ويفضل أفعل Play App Signing. وبجرب release build على جهاز قبل الرفع لأن الـ R8 ممكن يكسر حاجات." },
      ],
    },
    {
      title: "نشر iOS: الشهادات و TestFlight ومراجعة المتجر",
      en: "Certificates, provisioning, archive, TestFlight, store review",
      body: "<p>الـ iOS بيحتاج حساب <b>Apple Developer</b> مدفوع وجهاز <b>Mac</b> فيه Xcode. المفاهيم:</p>",
      terms: [
        ["App ID / Bundle ID", "هوية التطبيق", "اسم فريد زي <code>com.company.app</code> بتسجله، وبتفعّل عليه capabilities (Push, Associated Domains)."],
        ["Certificate", "شهادة التوقيع", "بتثبت إن الكود جاي منك. شهادة Development للتجربة وDistribution للنشر."],
        ["Provisioning profile", "ملف الربط", "بيربط App ID بالشهادة (وبالأجهزة في حالة التجربة). Xcode ممكن يديرهم تلقائي (<b>Automatically manage signing</b>)."],
        ["Archive", "حزمة البناء", "build للنشر بتعمله من Xcode (Product → Archive) أو <code>flutter build ipa --release</code>، وبترفعه لـ App Store Connect."],
        ["TestFlight", "اختبار قبل النشر", "تطبيق Apple لتوزيع نسخ على المختبرين: internal (فريقك، بدون مراجعة) وexternal (محتاج مراجعة بسيطة)."],
      ],
      points: [
        "الخطوات: ظبط الـ Bundle ID والـ signing في Xcode، زوّد الإصدار في pubspec (الـ build number لازم يزيد)، <code>flutter build ipa --release</code> أو Archive، ارفع (Xcode Organizer أو تطبيق Transporter)، استنى المعالجة، وزّع على TestFlight، وبعد التجربة قدّم للمراجعة.",
        "<b>مراجعة المتجر (App Review / Play Review):</b> سياسة خصوصية بلينك شغال، وصف صلاحيات واضح، لو التطبيق بيسجل مستخدمين لازم خيار <b>حذف الحساب</b> من جوه التطبيق، وحساب تجريبي للمراجعين، ولو فيه تسجيل بحسابات خارجية على iOS ممكن يتطلب Sign in with Apple. وعلى Google Play: صفحة <b>Data safety</b> ومستوى target API المطلوب.",
        "أشهر أسباب الرفض: crash عند التشغيل، ميزات مش شغالة، محتوى ناقص (placeholder)، أو صلاحية من غير سبب واضح.",
      ],
      interview: [
        { q: "اشرح خطوات رفع تطبيق Flutter على TestFlight.", a: "بسجل الـ Bundle ID في Apple Developer وبعمل التطبيق في App Store Connect. في Xcode بظبط الـ signing (تلقائي عادة) وبفعل الـ capabilities المطلوبة (Push مثلا). بزود الـ build number في <code>pubspec.yaml</code> وببني بـ <code>flutter build ipa --release</code> (أو Archive من Xcode)، وبرفع الملف بـ Xcode Organizer أو Transporter. بعد ما Apple تخلص المعالجة يظهر الـ build في TestFlight فأضيف مختبرين internal أو external، وبعد التجربة أقدمه للمراجعة. لازم الـ build number يكون أعلى من أي نسخة اترفعت قبل كده." },
      ],
    },
    {
      title: "Obfuscation و debug symbols وتتبع الأعطال",
      en: "--obfuscate, --split-debug-info, crash reporting",
      body: "<p>كود Dart المبني بيحتوي أسماء الكلاسات والدوال، فممكن حد يفك التطبيق ويقراها. الـ <b>obfuscation</b> بيستبدلها بأسماء مبهمة (ومعاه تصغير بسيط للحجم)، والـ <code>--split-debug-info</code> بيفصل رموز الـ debug في ملفات خارج التطبيق. مبتحميش سر، لكن بتصعب القراءة.</p>",
      codes: [
        {
          lang: "bash",
          title: "بناء مُعمّى",
          src: `flutter build appbundle --release \\
  --obfuscate \\
  --split-debug-info=build/symbols

# later: decode an obfuscated stack trace
flutter symbolize -i crash.txt -d build/symbols`,
          note: "<b>احتفظ بمجلد الـ symbols لكل إصدار</b> (ارفعه لأداة تتبع الأعطال). من غيره الـ stack traces في الإنتاج غير مفهومة.",
        },
        {
          lang: "dart",
          title: "التقاط الأخطاء (crash reporting)",
          src: `import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  FlutterError.onError = (details) {
    debugPrint('flutter error: \${details.exceptionAsString()}');
    // send to Crashlytics / Sentry here
  };

  PlatformDispatcher.instance.onError = (error, stack) {
    debugPrint('async error: $error');
    // send to Crashlytics / Sentry here
    return true;
  };

  runApp(const Placeholder());
}`,
          note: "الأول بيمسك أخطاء الـ framework (build/layout)، والتاني الأخطاء async اللي محدش مسكها. تكتب فيهم إرسال لخدمة زي <b>Firebase Crashlytics</b> (<code>firebase_crashlytics</code>) أو <b>Sentry</b> (<code>sentry_flutter</code>) عشان تعرف بالأعطال من المستخدمين الحقيقيين.",
        },
      ],
    },
    {
      title: "CI/CD في شريحة",
      en: "CI/CD: analyze, test, build, ship",
      body: "<p>الـ <b>CI</b> (التكامل المستمر) معناه إن كل push بيشغل تلقائي: <code>dart analyze</code> والاختبارات وبناء التطبيق، فمتدخلش كود مكسور. والـ <b>CD</b> (التسليم المستمر) معناه إن البناء والرفع للمتجر (TestFlight / Play internal testing) بيتم تلقائي كمان. الأدوات: GitHub Actions أو Codemagic أو Bitrise أو Fastlane للرفع.</p>",
      code: {
        lang: "yaml",
        title: ".github/workflows/ci.yml (غير مُحلَّل، راجع إصدارات الـ actions)",
        src: `name: ci
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          channel: stable
      - run: flutter pub get
      - run: dart analyze
      - run: flutter test --coverage
      - run: flutter build appbundle --release`,
        note: "بناء iOS محتاج runner بنظام macOS (أغلى) أو Mac خاص بيك. الـ keystore وشهادات Apple بتتحط كـ <b>secrets</b> مشفرة في الـ CI، مش في الريبو.",
      },
      points: [
        "ابدأ بـ CI بسيط (analyze + test) قبل ما تحاول تعمل CD كامل.",
        "الـ build number بيتزود تلقائي من رقم الـ run في الـ CI عشان ميتكررش.",
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: AppConfig بـ dart-define",
      lang: "dart",
      code: `class AppConfig {
  const AppConfig._();

  static const apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'https://dev.example.com/api',
  );
  static const logging = bool.fromEnvironment('LOGGING');
}`,
      note: "تشغيله: <code>flutter run --dart-define=API_URL=https://api.example.com</code>.",
    },
    {
      title: "اكتب: مستمعين FCM",
      lang: "dart",
      code: `Future<void> setupMessaging() async {
  final messaging = FirebaseMessaging.instance;
  await messaging.requestPermission();

  final token = await messaging.getToken();
  debugPrint('token: $token');

  FirebaseMessaging.onMessage.listen((message) {
    debugPrint('foreground: \${message.notification?.title}');
  });
  FirebaseMessaging.onMessageOpenedApp.listen((message) {
    debugPrint('opened: \${message.data}');
  });
}`,
    },
    {
      title: "اكتب: MethodChannel service",
      lang: "dart",
      code: `class BatteryService {
  static const _channel = MethodChannel('com.example.app/battery');

  Future<int?> level() async {
    try {
      return await _channel.invokeMethod<int>('getBatteryLevel');
    } on PlatformException {
      return null;
    } on MissingPluginException {
      return null;
    }
  }
}`,
    },
  ],

  tasks: [
    {
      title: "طلب صلاحية بكل الحالات",
      lang: "dart",
      prompt: "<p>اكتب <code>enum CameraAccess { granted, denied, blockedForever }</code> ودالة <code>Future&lt;CameraAccess&gt; requestCamera()</code> بـ <code>permission_handler</code>: لو الصلاحية موجودة ترجع <code>granted</code>. لو <code>permanentlyDenied</code> ترجع <code>blockedForever</code> (من غير ما تطلب). غير كده تطلب الصلاحية ثم ترجع <code>granted</code> أو <code>denied</code> أو <code>blockedForever</code> حسب النتيجة. وبعدها اكتب <code>onTakePhoto(BuildContext context)</code> تستدعيها، ولو <code>blockedForever</code> تفتح إعدادات التطبيق بـ <code>openAppSettings()</code>، ولو <code>denied</code> تعرض SnackBar فيه رسالة.</p>",
      hints: [
        "<code>final status = await Permission.camera.status;</code> وبعدين <code>status.isGranted</code> و<code>status.isPermanentlyDenied</code>.",
        "بعد <code>await</code> في <code>onTakePhoto</code> افحص <code>context.mounted</code> قبل ما تستخدم الـ context.",
      ],
      solution: `import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

enum CameraAccess { granted, denied, blockedForever }

CameraAccess _fromStatus(PermissionStatus status) {
  if (status.isGranted) return CameraAccess.granted;
  if (status.isPermanentlyDenied) return CameraAccess.blockedForever;
  return CameraAccess.denied;
}

Future<CameraAccess> requestCamera() async {
  final current = await Permission.camera.status;
  if (current.isGranted) return CameraAccess.granted;
  if (current.isPermanentlyDenied) return CameraAccess.blockedForever;

  final result = await Permission.camera.request();
  return _fromStatus(result);
}

Future<void> onTakePhoto(BuildContext context) async {
  final access = await requestCamera();
  if (!context.mounted) return;

  switch (access) {
    case CameraAccess.granted:
      // open the camera here
      break;
    case CameraAccess.denied:
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Camera permission is needed')),
      );
    case CameraAccess.blockedForever:
      await openAppSettings();
  }
}`,
      explain: "فصلنا تحويل حالة الـ plugin لـ enum بتاعنا: باقي التطبيق مبيعرفش حاجة عن <code>permission_handler</code> (سهل يتبدل ويتختبر). و<code>context.mounted</code> بعد الـ await بتحميك لو المستخدم خرج من الشاشة أثناء الطلب. الـ switch على enum في Dart 3 exhaustive ومفيش <code>break</code> مطلوب.",
    },
    {
      title: "NotificationService قابلة للاختبار",
      lang: "dart",
      prompt: "<p>اكتب <code>NotificationService</code> بتاخد في الـ constructor: <code>onToken(String)</code> (async) و<code>onOpenRoute(String route)</code>. الدالة <code>start()</code>: تطلب الصلاحية، ولو اترفضت ترجع، تجيب الـ token وتبعته لـ <code>onToken</code>، وتسمع لتجديد الـ token وتبعته برضه، وتسمع لـ <code>onMessageOpenedApp</code> وللـ <code>getInitialMessage()</code>، وفي الاتنين تستخرج المسار: لو الـ <code>data</code> فيها <code>propertyId</code> يبقى <code>/property/&lt;id&gt;</code> وإلا مفيش حاجة. اعمل دالة مستقلة <code>routeFromMessage(RemoteMessage)</code> بترجع <code>String?</code>.</p>",
      hints: [
        "<code>routeFromMessage</code>: <code>final id = message.data['propertyId']; return id == null ? null : '/property/$id';</code>",
        "كرر نفس الـ handler للـ opened والـ initial: دالة خاصة <code>_handle(RemoteMessage)</code>.",
      ],
      solution: `import 'package:firebase_messaging/firebase_messaging.dart';

String? routeFromMessage(RemoteMessage message) {
  final id = message.data['propertyId'];
  return id == null ? null : '/property/$id';
}

class NotificationService {
  NotificationService({
    required this.onToken,
    required this.onOpenRoute,
  });

  final Future<void> Function(String token) onToken;
  final void Function(String route) onOpenRoute;

  final _messaging = FirebaseMessaging.instance;

  Future<void> start() async {
    final settings = await _messaging.requestPermission();
    if (settings.authorizationStatus == AuthorizationStatus.denied) {
      return;
    }

    final token = await _messaging.getToken();
    if (token != null) await onToken(token);
    _messaging.onTokenRefresh.listen(onToken);

    FirebaseMessaging.onMessageOpenedApp.listen(_handle);

    final initial = await _messaging.getInitialMessage();
    if (initial != null) _handle(initial);
  }

  void _handle(RemoteMessage message) {
    final route = routeFromMessage(message);
    if (route != null) onOpenRoute(route);
  }
}`,
      explain: "الـ callbacks (token والـ route) بتتحقن، فالكلاس مش مربوط بـ Laravel ولا بـ go_router وتقدر تختبر <code>routeFromMessage</code> كـ unit test بسيط من غير Firebase. استدعاء <code>start()</code> بعد ما المستخدم يسجل دخول (عشان الـ token يتربط بيه) وبعد ما الـ router يجهز.",
    },
    {
      title: "AppConfig وmain ببيئات وcrash handlers",
      lang: "dart",
      prompt: "<p>اكتب <code>enum Env { dev, staging, prod }</code> و<code>AppConfig</code> فيها: <code>envName</code> من <code>--dart-define=ENV</code> (الافتراضي dev)، و<code>apiUrl</code> من <code>API_URL</code>، وgetter <code>env</code> بيحول الاسم لـ <code>Env</code>، و<code>isProd</code>. وبعدين <code>main()</code> يظبط <code>FlutterError.onError</code> و<code>PlatformDispatcher.instance.onError</code> (يسجلوا بـ <code>debugPrint</code> مع تعليق مكان الإرسال لـ Crashlytics)، ويطبع الـ environment في الـ debug، ويشغل التطبيق.</p>",
      hints: [
        "<code>Env.values.byName(envName)</code> بتحول String لـ enum وبترمي لو الاسم غلط.",
        "<code>PlatformDispatcher.instance.onError</code> لازم ترجع <code>true</code> عشان تقول إن الخطأ اتعالج.",
      ],
      solution: `import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

enum Env { dev, staging, prod }

class AppConfig {
  const AppConfig._();

  static const envName = String.fromEnvironment(
    'ENV',
    defaultValue: 'dev',
  );
  static const apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'https://dev.example.com/api',
  );

  static Env get env => Env.values.byName(envName);
  static bool get isProd => env == Env.prod;
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  FlutterError.onError = (details) {
    debugPrint('flutter error: \${details.exceptionAsString()}');
    // report to Crashlytics here
  };

  PlatformDispatcher.instance.onError = (error, stack) {
    debugPrint('async error: $error');
    // report to Crashlytics here
    return true;
  };

  if (kDebugMode) {
    debugPrint('env: \${AppConfig.env.name}, api: \${AppConfig.apiUrl}');
  }

  runApp(const MaterialApp(home: Scaffold()));
}`,
      explain: "كل الإعدادات في مكان واحد (<code>AppConfig</code>) فباقي الكود يقرا <code>AppConfig.apiUrl</code> ومبيعرفش منين جت. الـ handlers بتتظبط أول حاجة قبل <code>runApp</code> عشان تمسك أي خطأ بدري. وقيم <code>--dart-define</code> بتتحط في التطبيق المبني فمفيش فيها أسرار.",
    },
  ],

  quiz: [
    {
      q: "في <code>version: 2.1.0+37</code> إيه هو الـ build number اللي لازم يزيد مع كل رفع للمتجر؟ (رقم)",
      answer: ["37"],
      why: "الجزء قبل <code>+</code> هو versionName (2.1.0) والجزء بعده هو versionCode على Android وCFBundleVersion على iOS (37).",
    },
    {
      q: "التطبيق مقفول والسيرفر بعت رسالة فيها <code>notification</code> (title وbody). مين اللي بيعرض الإشعار؟",
      options: [
        "كود Dart بتاعك في <code>onMessage</code>",
        "الـ backend بتاعك",
        "نظام التشغيل نفسه من غير ما كودك يشتغل",
        "ممكن تتعرض بس لو التطبيق مفتوح",
      ],
      answer: 2,
      why: "الـ notification message بيعرضها النظام لما التطبيق في الخلفية أو مقفول. الـ onMessage بتشتغل في الـ foreground بس.",
    },
    {
      q: "التطبيق مفتوح قدامك ووصلت رسالة FCM. فين بتستقبلها في الكود؟",
      options: [
        "<code>FirebaseMessaging.onMessage</code>",
        "<code>FirebaseMessaging.onMessageOpenedApp</code>",
        "<code>getInitialMessage()</code>",
        "<code>onTokenRefresh</code>",
      ],
      answer: 0,
      why: "<code>onMessage</code> للـ foreground. <code>onMessageOpenedApp</code> لما المستخدم يضغط على إشعار والتطبيق في الخلفية، و<code>getInitialMessage</code> لو كان مقفول.",
    },
    {
      q: "المستخدم رفض صلاحية الكاميرا واختار «don't ask again». الحالة بتبقى <code>permanentlyDenied</code>. الصح؟",
      options: [
        "تنادي <code>request()</code> تاني لحد ما يوافق",
        "تعرض الـ dialog بتاع النظام كل دقيقة",
        "تعمل uninstall للتطبيق",
        "توضح له السبب وتوجهه لإعدادات التطبيق بـ <code>openAppSettings()</code>",
      ],
      answer: 3,
      why: "بعد permanentlyDenied النظام مش بيعرض الـ dialog تاني، فالطريق الوحيد إن المستخدم يفعلها بنفسه من الإعدادات.",
    },
    {
      q: "عشان إشعارات FCM توصل لأجهزة iPhone محتاج:",
      options: [
        "تسجيل التطبيق في Google Play",
        "رفع APNs authentication key في إعدادات Firebase وتفعيل Push Notifications capability في Xcode",
        "إضافة <code>POST_NOTIFICATIONS</code> في Info.plist",
        "مفيش حاجة، FCM بيتعامل مع iOS لوحده",
      ],
      answer: 1,
      why: "FCM بيوصل لـ iOS عن طريق APNs فمحتاج مفتاح APNs. الـ <code>POST_NOTIFICATIONS</code> خاصة بـ Android 13+.",
    },
    {
      q: "إيه الدالة اللي بتقرا قيمة <code>--dart-define=API_URL=...</code> في الكود؟ (اكتب الاسم الكامل)",
      answer: ["String.fromEnvironment", "String.fromEnvironment("],
      why: "<code>String.fromEnvironment('API_URL')</code> (وبنفس الفكرة <code>bool.fromEnvironment</code> و<code>int.fromEnvironment</code>) وبتتحط في متغير <code>const</code>.",
    },
    {
      q: "أنهي ملف ممنوع تعمله commit على git؟",
      options: [
        "<code>upload-keystore.jks</code> و<code>key.properties</code>",
        "<code>pubspec.yaml</code>",
        "<code>firebase_options.dart</code> المولّد",
        "<code>analysis_options.yaml</code>",
      ],
      answer: 0,
      why: "الـ keystore وكلمات سره هما مفتاح توقيع التطبيق. لو اتسربوا أي حد يقدر يوقع باسمك. حطهم في <code>.gitignore</code> وخد نسخة احتياطية آمنة.",
    },
    {
      q: "دالة الـ background handler بتاع <code>FirebaseMessaging.onBackgroundMessage</code> لازم تبقى:",
      options: [
        "method عادية جوه State",
        "closure جوه <code>main</code>",
        "دالة top-level وعليها <code>@pragma('vm:entry-point')</code> لأنها بتشتغل في isolate منفصل",
        "دالة async بتستخدم BuildContext",
      ],
      answer: 2,
      why: "الـ handler بيتنفذ في isolate منفصل، فمفيش UI ولا context ولازم تكون top-level عشان تتلاقى.",
    },
    {
      q: "بنيت release بـ <code>--obfuscate</code> وجاتلك stack trace أسماؤها غريبة. تقرأها إزاي؟",
      options: [
        "تبني بدون obfuscation وتتمنى نفس الخطأ",
        "تفك تشفير الـ aab يدويا",
        "مستحيل، الـ obfuscation بيمسح المعلومة",
        "بملفات <code>--split-debug-info</code> اللي احتفظت بيها مع <code>flutter symbolize</code>",
      ],
      answer: 3,
      why: "الـ symbols بتتحفظ في المجلد اللي حددته. من غيرها مفيش ترجمة، فلازم تحتفظ بيها لكل إصدار.",
    },
  ],
};
