window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f12"] = {
  slides: [
    {
      kicker: "قرار التخزين",
      title: "إيه تخزن وفين",
      en: "What to store where",
      body: "<p>مفيش «مكان تخزين واحد». كل نوع بيانات له مكان مناسب، والغلط هنا مشكلة أمان أو أداء. الحزم اللي هنشتغل بيها وقت التحقق: <b>shared_preferences 2.5.6</b> و<b>flutter_secure_storage 11.2.0</b> و<b>sqflite 2.4.6</b> و<b>path_provider 2.1.6</b> و<b>path 1.9.1</b> (كلها حزم خارجية بتضيفها بـ <code>flutter pub add</code>).</p>",
      terms: [
        ["shared_preferences", "إعدادات صغيرة", "key-value بسيط (String, int, bool, double, List&lt;String&gt;): الثيم، اللغة، «شفت الـ onboarding». مش آمن ومش لداتا كبيرة."],
        ["flutter_secure_storage", "أسرار", "بيخزن في Keychain (iOS) و Keystore (Android) مشفر: access/refresh tokens. للقيم الصغيرة بس."],
        ["sqflite / drift", "داتا منظمة", "قاعدة SQLite محلية: جداول، queries، علاقات، آلاف السجلات (رسائل، منتجات، cache). <code>drift</code> بديل typed فوق SQLite."],
        ["ملفات", "ملفات حقيقية", "صور، PDF، JSON كبير، تقارير: في مجلدات من <code>path_provider</code>."],
      ],
      points: [
        "<b>بدائل:</b> <code>hive</code> و<code>isar</code> قواعد NoSQL محلية سريعة بتتحط في نفس مكان sqflite، بس إحنا بنركز على SQLite لأنه الأشهر وبتتسأل عنه في المقابلات.",
        "القاعدة: <b>سر؟</b> secure storage. <b>إعداد صغير؟</b> shared_preferences. <b>قايمة أو جدول؟</b> قاعدة بيانات. <b>ملف؟</b> مجلد.",
        "التخزين المحلي مبيعوضش الـ backend: الداتا اللي تهم أكتر من جهاز لازم تفضل على السيرفر.",
      ],
      interview: [
        { q: "هتخزن الـ token وإعداد الثيم وقايمة منتجات محلية. كل واحد فين؟", a: "الـ token في <code>flutter_secure_storage</code> لأنه سر ومحتاج Keychain/Keystore المشفر. إعداد الثيم في <code>shared_preferences</code> لأنه key-value صغير مش حساس. قايمة المنتجات في قاعدة بيانات SQLite (sqflite أو drift) لأنها داتا منظمة بتتعمل لها queries وفلاتر. وأي ملفات (صور، PDF) في مجلدات path_provider." },
      ],
    },
    {
      title: "shared_preferences",
      en: "shared_preferences",
      body: "<p>الأبسط: بتجيب instance بـ <code>SharedPreferences.getInstance()</code> (async مرة واحدة) وبتقرا/تكتب بـ getters و setters. القراءة بترجع <code>null</code> لو المفتاح مش موجود فاستخدم <code>??</code> لقيمة افتراضية. اكتب المفاتيح كثوابت علشان ما تغلطش في الاسم. (في الإصدارات الجديدة فيه كمان <code>SharedPreferencesAsync</code> بـ API async كامل، لكن الأشهر لسه الـ getInstance.)</p>",
      code: {
        lang: "dart",
        title: "settings_store.dart",
        src: `import 'package:shared_preferences/shared_preferences.dart';

class SettingsStore {
  SettingsStore(this._prefs);

  final SharedPreferences _prefs;

  static const _darkKey = 'dark_mode';
  static const _langKey = 'language';

  bool get isDark => _prefs.getBool(_darkKey) ?? false;
  String get language => _prefs.getString(_langKey) ?? 'ar';

  Future<void> setDark(bool value) => _prefs.setBool(_darkKey, value);
  Future<void> setLanguage(String code) => _prefs.setString(_langKey, code);
}

Future<void> main() async {
  final prefs = await SharedPreferences.getInstance();
  final store = SettingsStore(prefs);
  await store.setDark(true);
  print(store.isDark); // true
}`,
        note: "تحميل الـ instance مرة في <code>main</code> وتمريره (أو عن طريق provider) أحسن من <code>getInstance()</code> في كل مكان. الـ setters بترجع Future<bool>، استناها لو محتاج التأكد إنها اتكتبت.",
      },
      pitfall: "تخزين الـ token أو الباسوورد في shared_preferences: الملف نص عادي (XML أو plist) وبيتقرا من نسخة احتياطية أو جهاز root. وكمان تخزين قوائم كبيرة JSON فيه: كل القيم بتتحمل للذاكرة مرة واحدة وبيبطئ بدء التطبيق.",
    },
    {
      title: "flutter_secure_storage للـ tokens",
      en: "flutter_secure_storage",
      body: "<p>نفس شكل key-value لكن القيم مشفرة بنظام التشغيل (Keychain على iOS، Keystore على Android). كل العمليات async. بتحط فيه الـ access token والـ refresh token، وبتقراهم في الـ interceptor اللي عملناه في مستوى الـ API.</p>",
      code: {
        lang: "dart",
        title: "token_storage.dart",
        src: `import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenStorage {
  TokenStorage([FlutterSecureStorage? storage])
      : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  static const _accessKey = 'access_token';
  static const _refreshKey = 'refresh_token';

  Future<String?> readAccess() => _storage.read(key: _accessKey);

  Future<void> save({
    required String access,
    required String refresh,
  }) async {
    await _storage.write(key: _accessKey, value: access);
    await _storage.write(key: _refreshKey, value: refresh);
  }

  Future<void> clear() async {
    await _storage.delete(key: _accessKey);
    await _storage.delete(key: _refreshKey);
  }
}`,
        note: "الـ constructor بياخد storage اختياري عشان تحط fake في الاختبار. بعد تسجيل الخروج <code>clear()</code> (أو <code>deleteAll()</code>).",
      },
      points: [
        "<b>iOS:</b> بيانات الـ Keychain ممكن تفضل بعد حذف التطبيق وإعادة تثبيته. لو مهم، امسح الـ tokens عند أول تشغيل بعد التثبيت.",
        "للقيم الصغيرة (tokens, مفاتيح) بس. مش لقوائم أو ملفات.",
        "ده تخزين <b>على الجهاز</b>: لو التطبيق نفسه اتخترق الـ token ممكن يتسرق. فالـ token له عمر قصير ويتجدد.",
      ],
      interview: [
        { q: "ليه secure storage للـ token بدل shared_preferences؟", a: "لأن shared_preferences بيخزن القيم في ملف عادي غير مشفر (XML على Android و plist على iOS) فبيتقرا من نسخة احتياطية أو جهاز root. <code>flutter_secure_storage</code> بيستخدم Keychain على iOS و Keystore على Android، فالقيم مشفرة ومربوطة بالجهاز. وبحط فيه القيم الصغيرة الحساسة بس (tokens)، والإعدادات العادية تفضل في shared_preferences." },
      ],
    },
    {
      title: "sqflite: فتح قاعدة وعمليات CRUD",
      en: "sqflite: open, onCreate, insert, query, update, delete",
      body: "<p>sqflite بتديك SQLite محلية. بتفتح القاعدة بـ <code>openDatabase(path, version:, onCreate:)</code>، والـ <code>onCreate</code> بتتنادى مرة واحدة أول ما الملف يتعمل وفيها بتعمل الجداول بـ SQL. وبعدين <code>insert</code> و<code>query</code> و<code>update</code> و<code>delete</code> بتشتغل على Maps. وفي <code>where</code> استخدم <b>دايما</b> <code>?</code> و <code>whereArgs</code> مش string interpolation (حماية من SQL injection). فتح القاعدة مرة واحدة وإعادة استخدامها.</p>",
      code: {
        lang: "dart",
        title: "notes_db.dart",
        src: `import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class Note {
  const Note({this.id, required this.title, this.done = false});

  final int? id;
  final String title;
  final bool done;

  Map<String, Object?> toMap() => {
        'id': id,
        'title': title,
        'done': done ? 1 : 0,
      };

  factory Note.fromMap(Map<String, Object?> map) => Note(
        id: map['id'] as int?,
        title: map['title'] as String,
        done: (map['done'] as int) == 1,
      );
}

class NotesDb {
  Database? _db;

  Future<Database> get _database async => _db ??= await _open();

  Future<Database> _open() async {
    final dir = await getDatabasesPath();
    return openDatabase(
      join(dir, 'notes.db'),
      version: 1,
      onCreate: (db, version) async {
        await db.execute(
          'CREATE TABLE notes ('
          'id INTEGER PRIMARY KEY AUTOINCREMENT, '
          'title TEXT NOT NULL, '
          'done INTEGER NOT NULL DEFAULT 0)',
        );
      },
    );
  }

  Future<int> insert(Note note) async {
    final db = await _database;
    return db.insert('notes', note.toMap()..remove('id'));
  }

  Future<List<Note>> all() async {
    final db = await _database;
    final rows = await db.query('notes', orderBy: 'id DESC');
    return rows.map(Note.fromMap).toList();
  }

  Future<int> update(Note note) async {
    final db = await _database;
    return db.update(
      'notes',
      note.toMap(),
      where: 'id = ?',
      whereArgs: [note.id],
    );
  }

  Future<int> delete(int id) async {
    final db = await _database;
    return db.delete('notes', where: 'id = ?', whereArgs: [id]);
  }
}`,
        note: "SQLite مفيهاش bool فبنخزنه 0/1. الـ model بيحول من وإلى Map بنفس فكرة fromJson/toJson. دوال الكتابة بترجع الـ id أو عدد الصفوف المتأثرة.",
      },
      pitfall: "كتابة <code>where: \"title = '$title'\"</code>: بتفتح باب SQL injection وبتتكسر لو الاسم فيه علامة اقتباس. الصح <code>where: 'title = ?', whereArgs: [title]</code>. وكمان sqflite للموبايل (Android/iOS/macOS)؛ للويب أو الويندوز بتحتاج حزمة ffi/web مختلفة.",
      interview: [
        { q: "إزاي بتفتح قاعدة بيانات محلية وتعمل CRUD في Flutter؟", a: "باستخدام sqflite: <code>openDatabase(join(await getDatabasesPath(), 'app.db'), version: 1, onCreate: ...)</code> وفي <code>onCreate</code> أعمل الجداول بـ <code>db.execute('CREATE TABLE ...')</code>. بعدين <code>db.insert</code> و<code>db.query</code> و<code>db.update(where: 'id = ?', whereArgs: [id])</code> و<code>db.delete</code>. باستخدم <code>?</code> و <code>whereArgs</code> بدل دمج النصوص عشان أمنع SQL injection، وبحوّل الصفوف لـ model بـ <code>fromMap</code>، وبفتح القاعدة مرة واحدة وأعيد استخدامها." },
      ],
    },
    {
      title: "الـ versions والـ migrations",
      en: "Schema versions and onUpgrade",
      body: "<p>بعد ما التطبيق ينزل عند المستخدمين، الجدول موجود على أجهزتهم. لو غيرت الـ schema (عمود جديد) ومعملتش migration، <code>onCreate</code> مش هتتنادى (القاعدة موجودة) والتطبيق هيقع. الحل: زود <code>version</code> واكتب <code>onUpgrade</code> اللي بتعدل القاعدة القديمة خطوة خطوة. و<code>onCreate</code> لازم تعمل الشكل الأحدث للمستخدمين الجدد.</p>",
      code: {
        lang: "dart",
        title: "migrations",
        src: `Future<Database> openNotesDb(String path) {
  return openDatabase(
    path,
    version: 3,
    onCreate: (db, version) async {
      await db.execute(
        'CREATE TABLE notes ('
        'id INTEGER PRIMARY KEY AUTOINCREMENT, '
        'title TEXT NOT NULL, '
        'done INTEGER NOT NULL DEFAULT 0, '
        'created_at INTEGER, '
        'tag TEXT)',
      );
    },
    onUpgrade: (db, oldVersion, newVersion) async {
      if (oldVersion < 2) {
        await db.execute('ALTER TABLE notes ADD COLUMN created_at INTEGER');
      }
      if (oldVersion < 3) {
        await db.execute('ALTER TABLE notes ADD COLUMN tag TEXT');
      }
    },
  );
}`,
        note: "كل شرط <code>oldVersion &lt; N</code> بيشتغل مرة واحدة لمن كان على نسخة أقدم، فمستخدم على v1 بيعدي على الاتنين. الجداول الجديدة بتتعمل في onCreate وكمان في onUpgrade.",
      },
      pitfall: "تغيير الـ schema من غير زيادة <code>version</code>، أو تعديل migration قديمة بعد ما اتنشرت. الـ migration القديمة ثابتة؛ أي تغيير جديد = version جديدة.",
    },
    {
      title: "Caching: cache-then-network",
      en: "Caching API responses, cache-then-network",
      body: "<p>الـ API بطيء ومفيش نت أحيانا. <b>Cache-then-network</b>: اعرض فورا اللي في الـ cache المحلي (لو موجود)، وبعدين اطلب من السيرفر وحدّث الـ cache والواجهة. المستخدم مبيشوفش شاشة فاضية، ولو النت وقع بيشوف آخر داتا. التنفيذ الطبيعي في الـ repository بـ <code>Stream</code> (<code>async*</code>) بيطلع قيمتين: القديمة ثم الجديدة.</p>",
      code: {
        lang: "dart",
        title: "property_repository.dart",
        src: `class Property {
  const Property(this.id, this.title);
  final int id;
  final String title;
}

abstract class RemoteSource {
  Future<List<Property>> fetchAll();
}

abstract class LocalSource {
  Future<List<Property>> readAll();
  Future<void> saveAll(List<Property> items);
}

class PropertyRepository {
  PropertyRepository(this._remote, this._local);

  final RemoteSource _remote;
  final LocalSource _local;

  Stream<List<Property>> watchAll() async* {
    final cached = await _local.readAll();
    if (cached.isNotEmpty) yield cached;
    try {
      final fresh = await _remote.fetchAll();
      await _local.saveAll(fresh);
      yield fresh;
    } catch (_) {
      if (cached.isEmpty) rethrow; // nothing to show, surface the error
    }
  }
}`,
        note: "الـ UI بتسمع بـ <code>StreamBuilder</code>: أول قيمة من الـ cache وتانيها من الشبكة. لو الشبكة فشلت والـ cache موجود، بنسكت ونعرض القديم (ممكن تعرض شريط «غير محدث»).",
      },
      points: [
        "<b>استراتيجيات تانية:</b> network-first (جرب الشبكة وارجع للـ cache عند الفشل)، و cache-only للداتا الثابتة. اختيارها حسب نوع الداتا.",
        "كل cache لازم له <b>صلاحية</b> (وقت التخزين) أو طريقة invalidate، وإلا المستخدم يشوف بيانات قديمة جدا.",
        "الـ cache مفتاحه بيشمل الـ parameters (page، filter) وبيتمسح عند تسجيل الخروج.",
      ],
      interview: [
        { q: "إيه هو cache-then-network؟ وإزاي تطبقه؟", a: "إني أعرض الداتا المخزنة محليا فورا، وأطلب النسخة الجديدة من السيرفر، وأحدّث الـ cache والواجهة لما توصل. في الـ repository بعمل دالة بترجع <code>Stream</code> بـ <code>async*</code>: أقرا الـ cache وأعمل <code>yield</code> لو موجود، وبعدين أجيب من الشبكة وأحفظ وأعمل <code>yield</code> للجديد. لو الشبكة فشلت والـ cache فاضي بعيد رمي الخطأ للـ UI. المميزة إن الشاشة مبتفضلش فاضية والتطبيق يشتغل بدون نت." },
      ],
    },
    {
      title: "offline-first: الفكرة",
      en: "Offline-first (concept)",
      body: "<p>في cache-then-network الشبكة هي المصدر الأساسي والـ cache مساعد. في <b>offline-first</b> العكس: <b>قاعدة البيانات المحلية هي مصدر الحقيقة (source of truth)</b>. الـ UI بتقرا من القاعدة المحلية بس، وأي تغيير بيتكتب محليا الأول، وبعدين طبقة <b>sync</b> في الخلفية بتبعت التغييرات للسيرفر وتجيب الجديد.</p>",
      points: [
        "<b>الكتابة:</b> المستخدم يضيف → يتخزن محليا بحالة «pending» → طابور (queue) يبعته للسيرفر لما النت يرجع → يتعلم «synced».",
        "<b>القراءة:</b> الـ UI تسمع للقاعدة المحلية (stream). أي sync يحدّث القاعدة والـ UI تتحدث لوحدها.",
        "<b>التعارض (conflict):</b> لو نفس السجل اتعدل على جهازين، لازم قاعدة: آخر تعديل يكسب (last write wins) أو دمج أو سؤال المستخدم.",
        "<b>التكلفة:</b> تعقيد حقيقي (sync، ids مؤقتة، تعارضات). مناسب لتطبيقات الملاحظات والمهام والميدان. مش لازم لكل تطبيق.",
      ],
      interview: [
        { q: "إيه الفرق بين cache وoffline-first؟ ومتى تحتاج الثاني؟", a: "في الـ cache الشبكة هي المصدر الأساسي والتخزين المحلي تحسين للسرعة. في offline-first القاعدة المحلية هي مصدر الحقيقة: الـ UI تقرا منها وتكتب فيها، وطبقة sync في الخلفية ترفع التغييرات (queue) وتجيب الجديد وتحل التعارضات. بحتاجه لما التطبيق لازم يشتغل كامل من غير نت (ملاحظات، مهام، تطبيقات ميدانية)، ومش لتطبيق بيعرض داتا لحظية زي أسعار." },
      ],
    },
    {
      title: "path_provider والملفات",
      en: "path_provider and files",
      body: "<p>للملفات الحقيقية بتحتاج تعرف المجلد الصح: <code>getApplicationDocumentsDirectory()</code> (ملفات المستخدم الدائمة، بتتخزن في النسخ الاحتياطي)، <code>getTemporaryDirectory()</code> (cache ممكن النظام يمسحه)، و<code>getApplicationSupportDirectory()</code> (ملفات التطبيق الداخلية). وبعد كده <code>File</code> من <code>dart:io</code>. اكتب المسارات بـ <code>join</code> من حزمة path بدل دمج نصوص.</p>",
      code: {
        lang: "dart",
        title: "file_store.dart",
        src: `import 'dart:io';

import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';

Future<File> saveReport(String name, String text) async {
  final dir = await getApplicationDocumentsDirectory();
  final file = File(join(dir.path, name));
  return file.writeAsString(text);
}

Future<String?> readReport(String name) async {
  final dir = await getApplicationDocumentsDirectory();
  final file = File(join(dir.path, name));
  if (!await file.exists()) return null;
  return file.readAsString();
}

Future<void> clearCache() async {
  final dir = await getTemporaryDirectory();
  if (await dir.exists()) {
    await dir.delete(recursive: true);
  }
}`,
        note: "الصور الكبيرة والـ PDF بتتحفظ كملفات وفي القاعدة بنخزن <b>المسار</b> بس، مش الـ bytes.",
      },
      pitfall: "تخزين الصور كـ base64 داخل SQLite أو shared_preferences: بيكبّر القاعدة ويبطئ كل query. خزّن الملف في مجلد، والمسار في القاعدة.",
    },
    {
      title: "مسح البيانات عند تسجيل الخروج",
      en: "Clearing data on logout",
      body: "<p>أخطر غلطة تخزين: مستخدم يسجل خروج وتفضل بياناته الحساسة على الجهاز، أو المستخدم اللي بعده يشوفها. تسجيل الخروج لازم يمسح <b>كل</b> مكان خزنت فيه بيانات المستخدم، وكمان يرجع الـ state اللي في الذاكرة (providers/blocs) لحالتها الأولى.</p>",
      code: {
        lang: "dart",
        title: "session_cleaner.dart",
        src: `class SessionCleaner {
  SessionCleaner(this._tokens, this._notes);

  final TokenStorage _tokens;
  final NotesDb _notes;

  Future<void> clearAll() async {
    await _tokens.clear(); // secure storage
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_id'); // keep device settings like theme
    await _notes.clear(); // database rows of the user
    final cache = await getTemporaryDirectory();
    if (await cache.exists()) {
      await cache.delete(recursive: true);
    }
  }
}`,
        note: "هنا امسحنا الإعدادات الخاصة بالمستخدم بس. إعدادات الجهاز (الثيم واللغة) تفضل. بعد المسح نرجع شاشة تسجيل الدخول ونعيد بناء الـ providers.",
      },
      points: [
        "<b>الأماكن:</b> secure storage (tokens)، shared_preferences (user_id، إعدادات المستخدم)، قاعدة البيانات (صفوف المستخدم)، ملفات (صور، تقارير)، cache الصور.",
        "<b>الذاكرة:</b> الـ state اللي في Riverpod/Bloc ممكن تفضل فيها بيانات المستخدم القديم؛ اعمل invalidate أو أعد إنشاء الـ scope.",
        "لازم تنادي endpoint تسجيل الخروج على السيرفر كمان عشان يبطل الـ token.",
      ],
      interview: [
        { q: "إيه اللي تمسحه لما المستخدم يسجل خروج؟", a: "كل مكان خزنت فيه بيانات المستخدم: الـ tokens في secure storage، والمفاتيح الخاصة بالمستخدم في shared_preferences، وصفوف قاعدة البيانات، والملفات والـ cache، وبرجّع الـ state في الذاكرة (providers/blocs) لحالتها الأولى. وبنادي endpoint logout على السيرفر عشان يبطل الـ token. إعدادات الجهاز زي الثيم واللغة ممكن تفضل. الهدف إن المستخدم اللي بعده ميشوفش حاجة من القديم." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: shared_preferences",
      lang: "dart",
      code: `class SettingsStore {
  SettingsStore(this._prefs);

  final SharedPreferences _prefs;

  static const _darkKey = 'dark_mode';

  bool get isDark => _prefs.getBool(_darkKey) ?? false;

  Future<void> setDark(bool value) {
    return _prefs.setBool(_darkKey, value);
  }
}`,
    },
    {
      title: "اكتب: sqflite insert و query",
      lang: "dart",
      code: `Future<int> insertNote(Database db, Note note) {
  return db.insert('notes', note.toMap()..remove('id'));
}

Future<List<Note>> allNotes(Database db) async {
  final rows = await db.query('notes', orderBy: 'id DESC');
  return rows.map(Note.fromMap).toList();
}

Future<int> deleteNote(Database db, int id) {
  return db.delete('notes', where: 'id = ?', whereArgs: [id]);
}`,
    },
    {
      title: "اكتب: فتح قاعدة مع migration",
      lang: "dart",
      code: `Future<Database> openNotesDb(String path) {
  return openDatabase(
    path,
    version: 2,
    onCreate: (db, version) async {
      await db.execute(
        'CREATE TABLE notes (id INTEGER PRIMARY KEY, title TEXT)',
      );
    },
    onUpgrade: (db, oldVersion, newVersion) async {
      if (oldVersion < 2) {
        await db.execute('ALTER TABLE notes ADD COLUMN tag TEXT');
      }
    },
  );
}`,
    },
  ],

  tasks: [
    {
      title: "SettingsStore بـ shared_preferences",
      lang: "dart",
      prompt: "<p>اكتب <code>SettingsStore</code> بياخد <code>SharedPreferences</code> في الـ constructor. فيه: <code>bool isDark</code> (الافتراضي false) و<code>String language</code> (الافتراضي <code>'ar'</code>) و<code>bool onboardingSeen</code> (الافتراضي false) كـ getters، و<code>setDark</code> و<code>setLanguage</code> و<code>markOnboardingSeen()</code> كدوال async. والمفاتيح ثوابت. وبعدين دالة <code>clear()</code> بتمسح الاتنين الأولين بس (مش onboardingSeen).</p>",
      hints: [
        "الـ getters: <code>_prefs.getBool(_darkKey) ?? false</code>.",
        "<code>clear()</code>: <code>await _prefs.remove(_darkKey); await _prefs.remove(_langKey);</code>",
      ],
      solution: `import 'package:shared_preferences/shared_preferences.dart';

class SettingsStore {
  SettingsStore(this._prefs);

  final SharedPreferences _prefs;

  static const _darkKey = 'dark_mode';
  static const _langKey = 'language';
  static const _onboardingKey = 'onboarding_seen';

  bool get isDark => _prefs.getBool(_darkKey) ?? false;
  String get language => _prefs.getString(_langKey) ?? 'ar';
  bool get onboardingSeen => _prefs.getBool(_onboardingKey) ?? false;

  Future<void> setDark(bool value) => _prefs.setBool(_darkKey, value);

  Future<void> setLanguage(String code) {
    return _prefs.setString(_langKey, code);
  }

  Future<void> markOnboardingSeen() {
    return _prefs.setBool(_onboardingKey, true);
  }

  Future<void> clear() async {
    await _prefs.remove(_darkKey);
    await _prefs.remove(_langKey);
  }
}`,
      explain: "المفاتيح ثوابت (من غير أخطاء كتابة)، والقراءة بقيمة افتراضية عشان null. <code>clear()</code> بتمسح الإعدادات الشخصية بس ومتلمسش <code>onboardingSeen</code> لأنه مرتبط بالجهاز مش بالمستخدم. وفي الاختبار تستخدم <code>SharedPreferences.setMockInitialValues({})</code>.",
    },
    {
      title: "NotesDb كامل",
      lang: "dart",
      prompt: "<p>اكتب <code>Note</code> (<code>int? id</code>, <code>String title</code>, <code>bool done</code>) مع <code>toMap/fromMap</code> (done كـ 0/1). و<code>NotesDb</code> بيفتح القاعدة <code>notes.db</code> مرة واحدة (version 1، onCreate بينشئ الجدول) وفيه: <code>insert(Note)</code> بيرجع الـ id، و<code>all()</code> مرتبة من الأحدث، و<code>setDone(int id, bool done)</code>، و<code>delete(int id)</code>، و<code>clear()</code> بيمسح كل الصفوف. كل الـ <code>where</code> بـ <code>?</code> و<code>whereArgs</code>.</p>",
      hints: [
        "فتح كسول: <code>Database? _db;</code> و<code>Future&lt;Database&gt; get _database async =&gt; _db ??= await _open();</code>.",
        "<code>setDone</code>: <code>db.update('notes', {'done': done ? 1 : 0}, where: 'id = ?', whereArgs: [id])</code>.",
      ],
      solution: `import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class Note {
  const Note({this.id, required this.title, this.done = false});

  final int? id;
  final String title;
  final bool done;

  Map<String, Object?> toMap() => {
        'id': id,
        'title': title,
        'done': done ? 1 : 0,
      };

  factory Note.fromMap(Map<String, Object?> map) => Note(
        id: map['id'] as int?,
        title: map['title'] as String,
        done: (map['done'] as int) == 1,
      );
}

class NotesDb {
  Database? _db;

  Future<Database> get _database async => _db ??= await _open();

  Future<Database> _open() async {
    final dir = await getDatabasesPath();
    return openDatabase(
      join(dir, 'notes.db'),
      version: 1,
      onCreate: (db, version) async {
        await db.execute(
          'CREATE TABLE notes ('
          'id INTEGER PRIMARY KEY AUTOINCREMENT, '
          'title TEXT NOT NULL, '
          'done INTEGER NOT NULL DEFAULT 0)',
        );
      },
    );
  }

  Future<int> insert(Note note) async {
    final db = await _database;
    return db.insert('notes', note.toMap()..remove('id'));
  }

  Future<List<Note>> all() async {
    final db = await _database;
    final rows = await db.query('notes', orderBy: 'id DESC');
    return rows.map(Note.fromMap).toList();
  }

  Future<void> setDone(int id, bool done) async {
    final db = await _database;
    await db.update(
      'notes',
      {'done': done ? 1 : 0},
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> delete(int id) async {
    final db = await _database;
    await db.delete('notes', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> clear() async {
    final db = await _database;
    await db.delete('notes');
  }
}`,
      explain: "فتح كسول (<code>??=</code>) عشان القاعدة تتفتح مرة واحدة. الـ id بنشيله من الـ map في الـ insert عشان AUTOINCREMENT يتولى. <code>db.delete('notes')</code> من غير where بيمسح كل الصفوف (بنستخدمه في تسجيل الخروج).",
    },
    {
      title: "Repository: cache-then-network",
      lang: "dart",
      prompt: "<p>عندك <code>abstract class RemoteSource { Future&lt;List&lt;String&gt;&gt; fetch(); }</code> و<code>abstract class LocalSource { Future&lt;List&lt;String&gt;&gt; read(); Future&lt;void&gt; save(List&lt;String&gt; items); }</code>. اكتب <code>ItemsRepository</code> بياخد الاتنين، وفيه <code>Stream&lt;List&lt;String&gt;&gt; watch()</code> بـ <code>async*</code>: لو الـ cache مش فاضي اطلعه، وبعدين اجيب من الشبكة واحفظ واطلع الجديد. لو الشبكة فشلت والـ cache كان فاضي أعد رمي الخطأ، وإلا اتجاهله. واكتب كمان <code>LocalSource</code> fake في الذاكرة (<code>MemoryLocalSource</code>).</p>",
      hints: [
        "<code>final cached = await _local.read(); if (cached.isNotEmpty) yield cached;</code>",
        "داخل <code>catch</code> في دالة <code>async*</code> تقدر تستخدم <code>rethrow</code>.",
      ],
      solution: `abstract class RemoteSource {
  Future<List<String>> fetch();
}

abstract class LocalSource {
  Future<List<String>> read();
  Future<void> save(List<String> items);
}

class MemoryLocalSource implements LocalSource {
  List<String> _items = [];

  @override
  Future<List<String>> read() async => List.of(_items);

  @override
  Future<void> save(List<String> items) async {
    _items = List.of(items);
  }
}

class ItemsRepository {
  ItemsRepository(this._remote, this._local);

  final RemoteSource _remote;
  final LocalSource _local;

  Stream<List<String>> watch() async* {
    final cached = await _local.read();
    if (cached.isNotEmpty) yield cached;
    try {
      final fresh = await _remote.fetch();
      await _local.save(fresh);
      yield fresh;
    } catch (_) {
      if (cached.isEmpty) rethrow;
    }
  }
}`,
      explain: "الـ repository بيخبي مصدر الداتا عن الـ UI. المصدرين abstract فتقدر تبدلهم بـ fakes في الاختبار. القاعدة: لو معندناش حاجة نعرضها، الخطأ يوصل للـ UI، وإلا نعرض القديم.",
    },
  ],

  quiz: [
    {
      q: "هتخزن access token. أنسب مكان:",
      options: [
        "shared_preferences",
        "ملف نصي في Documents",
        "<code>flutter_secure_storage</code>",
        "قاعدة SQLite عادية",
      ],
      answer: 2,
      why: "الـ token سر: Keychain/Keystore. الباقي مخزنة من غير تشفير مربوط بالجهاز.",
    },
    {
      q: "ليه shared_preferences مش مناسبة لقايمة 5000 منتج؟",
      options: [
        "مبتدعمش JSON",
        "كل القيم بتتحمل للذاكرة مرة واحدة وملهاش queries أو فهارس، فالقاعدة المحلية أنسب",
        "لأنها بتحتاج صلاحيات خاصة",
        "لأنها async",
      ],
      answer: 1,
      why: "هي للإعدادات الصغيرة. الداتا الكبيرة المنظمة تحتاج قاعدة بيانات.",
    },
    {
      q: "إيه اللي بيحصل لـ <code>onCreate</code> لو القاعدة موجودة بالفعل على جهاز المستخدم وزودت الـ version؟",
      options: [
        "بتتنادى من جديد وتمسح البيانات",
        "بتتنادى <code>onUpgrade</code> بدل onCreate",
        "بتتنادى الاتنين",
        "ولا واحدة منهم",
      ],
      answer: 1,
      why: "<code>onCreate</code> بس عند أول إنشاء. للقاعدة الموجودة بتتنادى <code>onUpgrade(db, oldVersion, newVersion)</code>.",
    },
    {
      q: "أنهي سطر بيحمي من SQL injection؟",
      options: [
        "<code>where: \"title = '$t'\"</code>",
        "<code>where: 'title = $t'</code>",
        "<code>db.rawQuery('... ' + t)</code>",
        "<code>where: 'title = ?', whereArgs: [t]</code>",
      ],
      answer: 3,
      why: "الـ placeholders بتفصل الأمر عن القيمة، فالقيمة عمرها ما تتفسر كـ SQL.",
    },
    {
      q: "الكود ده فيه إيه مشكلة؟",
      code: { lang: "dart", src: `final rows = await db.query('notes');
final done = rows.first['done'] as bool;` },
      options: [
        "ناقص where",
        "SQLite مفيهاش bool، بتخزنه 0/1، فالـ cast لـ bool بيرمي خطأ",
        "الـ query لازم rawQuery",
        "first لازم last",
      ],
      answer: 1,
      why: "حوّل: <code>(rows.first['done'] as int) == 1</code> كما في <code>fromMap</code>.",
    },
    {
      q: "استراتيجية cache-then-network بتعمل إيه؟",
      options: [
        "تعرض الداتا المخزنة فورا، وبعدين تحدثها من الشبكة",
        "تعرض الشبكة بس",
        "تمسح الـ cache قبل كل طلب",
        "ترفض العمل بدون إنترنت",
      ],
      answer: 0,
      why: "الشاشة مبتفضلش فاضية، وفي النهاية بتبقى محدثة. ده الأسلوب الأشهر لتحسين الإحساس بالسرعة.",
    },
    {
      q: "إيه المصدر الأساسي للحقيقة في تطبيق offline-first؟",
      options: [
        "السيرفر دايما",
        "الذاكرة",
        "الـ UI",
        "القاعدة المحلية، والـ sync بيوفق بينها وبين السيرفر",
      ],
      answer: 3,
      why: "الـ UI تقرا وتكتب في القاعدة المحلية فقط، وطبقة sync في الخلفية تتعامل مع السيرفر والتعارضات.",
    },
    {
      q: "فين تحفظ تقرير PDF بيعمله المستخدم ويفضل معاه؟",
      options: [
        "في <code>getTemporaryDirectory()</code>",
        "في <code>getApplicationDocumentsDirectory()</code> والمسار في القاعدة لو محتاج",
        "كـ base64 في shared_preferences",
        "في secure storage",
      ],
      answer: 1,
      why: "التمب ممكن النظام يمسحه. الملفات الدائمة في Documents، والمسار هو اللي يتخزن في القاعدة.",
    },
    {
      q: "عند تسجيل الخروج، إيه الأقل كفاية؟",
      options: [
        "مسح الـ token بس وترك قاعدة بيانات المستخدم",
        "تغيير لون الشاشة",
        "مسح الـ token من secure storage، وبيانات المستخدم من القاعدة والملفات والـ prefs، وإعادة تهيئة الـ state في الذاكرة",
        "إغلاق التطبيق",
      ],
      answer: 2,
      why: "أي مكان خزنت فيه بيانات المستخدم لازم يتمسح، والـ providers/blocs اللي فيها بيانات قديمة لازم ترجع لحالتها الأولى.",
    },
    {
      q: "اسم الدالة اللي بترجع مجلد قاعدة بيانات sqflite الافتراضي:",
      answer: ["getDatabasesPath", "getDatabasesPath()"],
      why: "<code>await getDatabasesPath()</code> وبعدين <code>join</code> مع اسم الملف.",
    },
  ],
};
