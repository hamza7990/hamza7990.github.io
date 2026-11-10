window.LEVELS = window.LEVELS || {};
window.LEVELS["dart/d6"] = {
  slides: [
    {
      kicker: "ليه Generics وenums وsealed",
      title: "نوع يتغير، وحالات محدودة، وcompiler يحرسك",
      en: "Generics, enums, sealed classes",
      body: "<p>التلات أدوات دول بيخلوا الـ compiler هو اللي يمسك أخطاءك بدل المستخدم. <b>Generics</b>: كلاس أو دالة تشتغل مع أي نوع وتفضل آمنة (<code>List&lt;int&gt;</code>، <code>Future&lt;User&gt;</code>). <b>Enums</b>: مجموعة قيم ثابتة (حالة الطلب، الدور). <b>Sealed classes</b>: مجموعة أنواع ثابتة، كل نوع بيشيل بياناته (Loading و Success و Failure).</p><p>في Flutter كل state بتبنيه بيعتمد عليهم: <code>Future&lt;List&lt;Office&gt;&gt;</code>، و <code>enum Role</code>، و <code>sealed class AuthState</code>.</p>",
      points: [
        "الإنترفيو: ليه <code>List&lt;int&gt;</code> أحسن من <code>List&lt;dynamic&gt;</code>؟ إيه الفرق بين enum و sealed؟ إيه فايدة exhaustive switch؟",
        "المستوى ده هو الأساس اللي بيمهّد لـ pattern matching في المستوى الجاي.",
      ],
    },
    {
      title: "كلاس generic",
      en: "Generic classes",
      body: "<p>بتحط <b>type parameter</b> بين <code>&lt; &gt;</code> زي <code>T</code>، وتستخدمه كأنه نوع. وقت الاستخدام بتحدد النوع الحقيقي، والـ compiler بيفرضه عليك في كل مكان.</p>",
      code: {
        lang: "dart",
        src: `class Stack<T> {
  final List<T> _items = [];

  void push(T item) => _items.add(item);
  T pop() => _items.removeLast();

  T? get top => _items.isEmpty ? null : _items.last;
  bool get isEmpty => _items.isEmpty;
}

class Box<T> {
  final T value;
  Box(this.value);
}

void main() {
  final s = Stack<int>();
  s.push(1);
  s.push(2);
  print(s.pop());              // 2
  print(s.top);                // 1
  // s.push('a');              // compile error: String is not int

  final b = Box('hi');         // inferred: Box<String>
  print(b.value.length);       // 2
}`,
        note: "من غير ما تكتب النوع، Dart بتستنتجه من الـ argument. وبتقدر دايما تكتبه صراحة: <code>Box&lt;String&gt;('hi')</code>.",
      },
      terms: [
        ["generic", "عام على نوع", "كلاس أو دالة مكتوبة مرة واحدة وبتشتغل مع أنواع مختلفة بأمان."],
        ["type parameter", "نوع بديل", "اسم زي <code>T</code> أو <code>K, V</code> بيتبدل بنوع حقيقي وقت الاستخدام."],
      ],
    },
    {
      title: "دوال generic",
      en: "Generic functions and inference",
      body: "<p>الدالة كمان ممكن يبقى لها type parameter بعد اسمها. غالبا مش بتكتبه عند الاستدعاء لأن Dart بتستنتجه من الـ arguments، وبتتأكد إن الأنواع متوافقة مع بعضها.</p>",
      code: {
        lang: "dart",
        src: `T firstOr<T>(List<T> items, T fallback) {
  return items.isEmpty ? fallback : items.first;
}

List<R> mapAll<T, R>(List<T> items, R Function(T) f) {
  final out = <R>[];
  for (final item in items) {
    out.add(f(item));
  }
  return out;
}

void main() {
  print(firstOr([1, 2], 0));                     // 1
  print(firstOr(<String>[], 'none'));            // none
  print(mapAll(['a', 'bb'], (s) => s.length));   // [1, 2]
  // firstOr([1, 2], 'x');   // T would need to be both int and String
}`,
        note: "في <code>mapAll</code> النوع <code>T</code> هو String (من القايمة) و <code>R</code> هو int (من نتيجة الـ lambda). وهي نفس طريقة تعريف <code>list.map</code> نفسها.",
      },
    },
    {
      title: "Bounded generics: T extends",
      en: "Bounded type parameters",
      body: "<p>لو الدالة محتاجة تستخدم حاجة من النوع (زي <code>&gt;</code> أو <code>.id</code>)، لازم تحدد حد أدنى بـ <code>T extends ...</code>. من غير الحد، <code>T</code> هو أي <code>Object?</code> ومعندهوش غير الحاجات العامة.</p>",
      code: {
        lang: "dart",
        src: `T maxOf<T extends num>(T a, T b) => a > b ? a : b;

abstract class Entity {
  int get id;
}

class User extends Entity {
  @override
  final int id;
  final String name;
  User(this.id, this.name);
}

class Cache<T extends Entity> {
  final Map<int, T> _items = {};

  void put(T item) => _items[item.id] = item;   // item.id is allowed
  T? get(int id) => _items[id];
}

void main() {
  print(maxOf(3, 7));              // 7
  print(maxOf(2.5, 1.5));          // 2.5
  // maxOf('a', 'b');              // error: String is not a num

  final cache = Cache<User>();
  cache.put(User(1, 'Ali'));
  print(cache.get(1)?.name);       // Ali
}`,
      },
      interview: [
        { q: "إيه معنى <code>T extends Entity</code>؟ ولو شلتها إيه المشكلة؟", a: "معناها إن <code>T</code> لازم يكون <code>Entity</code> أو ابن له، فجوه الكلاس أو الدالة أقدر أستخدم أي حاجة معرفة في <code>Entity</code> (<code>item.id</code>) والـ compiler بيضمنها. من غير الحد، <code>T</code> بيبقى مجرد <code>Object?</code> ومعنديش غير <code>toString</code> و <code>==</code> فـ <code>item.id</code> هتدي خطأ كومبايل. وكمان بتمنع استخدام أنواع ملهاش معنى (<code>Cache&lt;String&gt;</code>)." },
      ],
    },
    {
      title: "ليه List<int> أحسن من List<dynamic>",
      en: "Type safety and reified generics",
      body: "<p><code>dynamic</code> بتقول للـ compiler «متفحصش». النتيجة إن الخطأ بيظهر عند المستخدم بدل ما يظهر وإنت بتكتب، ومفيش autocomplete، ومفيش حماية. أما <code>List&lt;int&gt;</code> فالـ compiler بيرفض أي حاجة مش int، وبيعرف إن كل عنصر ليه <code>.isEven</code>.</p>",
      code: {
        lang: "dart",
        src: `void main() {
  List<dynamic> loose = [1, 2, 'x'];
  int first = loose[0];            // compiles: you promised it's an int
  print(first);                    // 1

  try {
    int bad = loose[2];            // compiles too, but...
    print(bad);
  } on TypeError {
    print('crash at run time');    // the user would see this
  }

  final safe = <int>[1, 2];
  // safe.add('x');                // caught while typing
  print(safe.first.isEven);        // false: the compiler knows it's an int

  Object o = <int>[1];
  print(o is List<int>);           // true
  print(o is List<String>);        // false
}`,
        note: "الأنواع الـ generic في Dart <b>بتفضل موجودة وقت التشغيل</b> (reified)، عكس Java اللي بتمسحها (erasure). عشان كده <code>o is List&lt;String&gt;</code> بتدّي false.",
      },
      pitfall: "<code>var x = [1, 'a']</code> بتستنتج <code>List&lt;Object&gt;</code> (مش dynamic) بس برضه بتفقد الدقة. اكتب النوع صراحة لما تبني قايمة مختلطة، واستخدم <code>dynamic</code> في أضيق حدود (JSON الخام قبل التحويل لموديل).",
      interview: [
        { q: "ليه <code>List&lt;int&gt;</code> أأمن من <code>List&lt;dynamic&gt;</code>؟", a: "لأن النوع بيتفحص وقت الكتابة: لو حاولت أضيف String للـ <code>List&lt;int&gt;</code> الـ compiler يرفض، وكل عنصر بقدر أستخدم عليه methods الـ int مع autocomplete. مع <code>List&lt;dynamic&gt;</code> الفحص بيتأجل لوقت التشغيل، فالخطأ (<code>TypeError</code>) بيظهر عند المستخدم. وكمان Dart بتحتفظ بالـ generics وقت التشغيل (reified)، يعني <code>[1] is List&lt;String&gt;</code> بتدّي false." },
        { q: "إيه الفرق بين <code>dynamic</code> و <code>Object</code> و <code>Object?</code>؟", a: "<code>Object</code> أب كل الأنواع غير الـ nullable، وفحص النوع شغال: مقدرش أنادي إلا الحاجات اللي في <code>Object</code>. <code>Object?</code> نفس الكلام لكن بتقبل null. <code>dynamic</code> بتوقف الفحص خالص: أي method بتتنادي وبتفشل وقت التشغيل لو مش موجودة. فلو مش عارف النوع فضّل <code>Object?</code> وافحصه بـ <code>is</code> على <code>dynamic</code>." },
      ],
    },
    {
      title: "Enums: قيم ثابتة بأسماء",
      en: "enum, values, name, switch",
      body: "<p>الـ <code>enum</code> مجموعة محدودة من القيم. أحسن من النصوص (<code>'active'</code>) لأن الغلط في الكتابة بيبان وقت الكومبايل. كل قيمة ليها <code>name</code> و <code>index</code>، والـ <code>values</code> بترجع قايمة بكل القيم.</p>",
      code: {
        lang: "dart",
        src: `enum Status { pending, active, closed }

String label(Status s) {
  return switch (s) {
    Status.pending => 'Waiting',
    Status.active => 'Live',
    Status.closed => 'Done',
  };
}

void main() {
  final s = Status.active;
  print(s);                            // Status.active
  print(s.name);                       // active
  print(s.index);                      // 1
  print(Status.values);                // [Status.pending, Status.active, Status.closed]
  print(Status.values.byName('closed'));   // Status.closed
  print(label(s));                     // Live
}`,
        note: "الـ <code>switch</code> على enum <b>exhaustive</b>: لو نسيت قيمة أو ضفت واحدة جديدة للـ enum ومعدلتش الـ switch، الكومبايل يرفض. (الـ switch expression مشروحة تفصيلا في المستوى ٧.)",
      },
      pitfall: "<code>values.byName('x')</code> بترمي <code>ArgumentError</code> لو الاسم مش موجود. لما الاسم جاي من الـ API دور بنفسك: <code>Status.values.where((v) =&gt; v.name == text).firstOrNull</code> وتعامل مع الـ null.",
    },
    {
      title: "Enhanced enums",
      en: "Enums with fields and methods",
      body: "<p>من Dart 2.17 الـ enum ممكن يشيل fields و methods و getters، وكل قيمة بتعدي arguments للـ constructor بتاعه. الشروط: الـ fields كلها <code>final</code>، والـ constructor بيتعامل كـ <code>const</code> (كتابة <code>const</code> قدامه اختيارية)، ومينفعش تنادي عليه برا القايمة.</p>",
      code: {
        lang: "dart",
        src: `enum Plan {
  free(price: 0, maxAds: 3),
  pro(price: 99, maxAds: 50),
  vip(price: 299, maxAds: 500);

  final int price;
  final int maxAds;
  const Plan({required this.price, required this.maxAds});

  bool get isPaid => price > 0;
  String label() => '\${name.toUpperCase()} (\$price SAR)';
}

void main() {
  print(Plan.pro.label());                 // PRO (99 SAR)
  print(Plan.free.isPaid);                 // false
  final paid = Plan.values.where((p) => p.isPaid);
  print(paid.map((p) => p.name).toList()); // [pro, vip]
}`,
        note: "القايمة بتنتهي بـ <code>;</code> قبل الـ fields. وفي الـ enum المحسّن بدل ما تحتفظ بـ <code>Map&lt;Plan, int&gt;</code> بره، البيانات جوه القيمة نفسها.",
      },
      interview: [
        { q: "إيه اللي بيقدر يعمله enhanced enum؟", a: "من Dart 2.17 الـ enum بيقدر يكون له fields (final) و constructor و methods و getters، ويعمل implements لـ interface ويستخدم mixin. بنستخدمه عشان نربط بيانات بكل قيمة: خطة اشتراك فيها سعر وحد إعلانات، أو حالة طلب فيها لون ونص. ده بيمنع القوايم المتفرقة (maps) اللي بتتنسى تتحدث لما تضيف قيمة جديدة." },
      ],
    },
    {
      title: "Sealed classes وexhaustive switch",
      en: "sealed classes",
      body: "<p>الـ enum: قيم ثابتة كلها بنفس الشكل. لو كل حالة محتاجة <b>بيانات مختلفة</b> (Success معاها data، Failure معاها رسالة، Loading مفيهاش حاجة) استخدم <code>sealed class</code>. الـ compiler بيعرف كل الأبناء، فالـ <code>switch</code> عليها لازم يغطيهم كلهم.</p>",
      code: {
        lang: "dart",
        src: `sealed class Result<T> {}

final class Success<T> extends Result<T> {
  final T data;
  Success(this.data);
}

final class Failure<T> extends Result<T> {
  final String message;
  Failure(this.message);
}

final class Loading<T> extends Result<T> {}

String render(Result<int> r) {
  return switch (r) {
    Success<int> s => 'Got \${s.data}',
    Failure<int> f => 'Error: \${f.message}',
    Loading<int>() => 'Loading...',
  };
}

void main() {
  print(render(Success(42)));       // Got 42
  print(render(Failure('no net'))); // Error: no net
  print(render(Loading()));         // Loading...
}`,
        note: "امسح سطر <code>Failure</code> من الـ switch: الكومبايل هيرفض بخطأ «not exhaustively matched». وده بالظبط اللي عايزينه: لو ضفت حالة جديدة، كل مكان بيتعامل معاها بيبان.",
      },
      focus: [{ label: "في Flutter", text: "<code>sealed class AuthState</code> مع <code>Authenticated</code> و <code>Unauthenticated</code> و <code>AuthLoading</code>، والـ UI بيعمل switch عليها. مفيش حالة بتتنسى، ومفيش <code>if (state.user != null)</code> غامضة." }],
      interview: [
        { q: "إمتى أستخدم enum وإمتى sealed class؟", a: "الـ enum لما الحالات قيم بسيطة ثابتة بنفس الشكل (Role، Status) ومعاها بيانات ثابتة محدودة. الـ sealed لما كل حالة نوع مختلف بيشيل بيانات مختلفة تتحدد وقت التشغيل (Success(data) و Failure(message)). في الاتنين الـ switch exhaustive، يعني لو ضفت حالة جديدة والـ compiler هيشاور على كل switch ناقص." },
        { q: "إيه فايدة الـ exhaustive switch في الحياة العملية؟", a: "إن الـ compiler هو اللي بيعمل الـ checklist. لو أضفت حالة جديدة لـ sealed class أو قيمة لـ enum، كل switch بيتعامل معاها من غير <code>default</code> بيطلع خطأ كومبايل، فأعرف كل الأماكن اللي محتاجة تتعدل. ده بيمنع bug من نوع «ضفت حالة جديدة ونسيت أتعامل معاها في شاشة». عشان كده مش بحط <code>default</code> على enum أو sealed غير لو فعلا عايز يغطي الباقي." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: كلاس generic",
      lang: "dart",
      code: `class Stack<T> {
  final List<T> _items = [];

  void push(T item) => _items.add(item);
  T pop() => _items.removeLast();

  T? get top => _items.isEmpty ? null : _items.last;
  bool get isEmpty => _items.isEmpty;
}

void main() {
  final s = Stack<int>()..push(1)..push(2);
  print(s.pop());
  print(s.top);
}`,
    },
    {
      title: "اكتب: enhanced enum",
      lang: "dart",
      code: `enum Plan {
  free(price: 0, maxAds: 3),
  pro(price: 99, maxAds: 50);

  final int price;
  final int maxAds;
  const Plan({required this.price, required this.maxAds});

  bool get isPaid => price > 0;
}

void main() {
  for (final p in Plan.values) {
    print('\${p.name} paid=\${p.isPaid}');
  }
}`,
    },
    {
      title: "اكتب: sealed وswitch",
      lang: "dart",
      code: `sealed class Result {}

final class Success extends Result {
  final String data;
  Success(this.data);
}

final class Failure extends Result {
  final String message;
  Failure(this.message);
}

String render(Result r) {
  return switch (r) {
    Success s => 'ok: \${s.data}',
    Failure f => 'error: \${f.message}',
  };
}`,
      note: "لاحظ إن مفيش <code>default</code>: الـ switch على sealed بيغطي كل الأبناء، والـ compiler هو اللي بيتأكد.",
    },
  ],

  tasks: [
    {
      title: "groupBy generic",
      lang: "dart",
      prompt: "<p>اكتب دالة generic <code>Map&lt;K, List&lt;T&gt;&gt; groupBy&lt;T, K&gt;(List&lt;T&gt; items, K Function(T) key)</code> بتجمع العناصر حسب المفتاح اللي بترجعه <code>key</code> لكل عنصر، وتحافظ على ترتيب ظهور العناصر.</p>",
      examples: [
        { in: "groupBy(['apple', 'avocado', 'banana'], (w) => w[0])", out: "{a: [apple, avocado], b: [banana]}" },
        { in: "groupBy([1, 2, 3, 4, 5], (n) => n.isEven)", out: "{false: [1, 3, 5], true: [2, 4]}" },
      ],
      starter: `Map<K, List<T>> groupBy<T, K>(List<T> items, K Function(T) key) {
  // your code
}`,
      hints: [
        "ابدأ بـ <code>final groups = &lt;K, List&lt;T&gt;&gt;{};</code>.",
        "لكل عنصر: <code>groups.putIfAbsent(key(item), () =&gt; []).add(item);</code>.",
      ],
      solution: `Map<K, List<T>> groupBy<T, K>(List<T> items, K Function(T) key) {
  final groups = <K, List<T>>{};
  for (final item in items) {
    groups.putIfAbsent(key(item), () => []).add(item);
  }
  return groups;
}`,
      explain: "النوعين <code>T</code> (نوع العنصر) و <code>K</code> (نوع المفتاح) بيتستنتجوا من الـ arguments: في المثال التاني <code>K</code> هو bool لأن الـ lambda بترجع <code>bool</code>. ده نفس شكل مكتبات الـ collection الجاهزة.",
    },
    {
      title: "enum الأولوية",
      lang: "dart",
      prompt: "<p>اكتب <code>enum Priority</code> بالقيم <code>low</code> و <code>medium</code> و <code>high</code> وكل قيمة فيها <code>int weight</code> (1 و 2 و 3) و <code>String label</code> (<code>Low</code> و <code>Medium</code> و <code>High</code>). ضيف <code>static Priority? tryParse(String text)</code> بترجع القيمة اللي اسمها <code>text</code> أو <code>null</code>. وبعدين دالة <code>Priority mostUrgent(List&lt;Priority&gt; items)</code> (القايمة مش فاضية) بترجع الأعلى وزنا.</p>",
      examples: [
        { in: "Priority.high.label", out: "High" },
        { in: "Priority.tryParse('medium')", out: "Priority.medium" },
        { in: "Priority.tryParse('x')", out: "null" },
        { in: "mostUrgent([Priority.low, Priority.high, Priority.medium])", out: "Priority.high" },
      ],
      hints: [
        "الـ constructor <code>const Priority(this.weight, this.label);</code> وقيم زي <code>low(1, 'Low')</code> وتنتهي القايمة بـ <code>;</code>.",
        "<code>tryParse</code>: لف على <code>values</code> وقارن <code>p.name == text</code>.",
        "<code>mostUrgent</code> ممكن تتحل بـ <code>reduce</code> بتقارن <code>weight</code>.",
      ],
      solution: `enum Priority {
  low(1, 'Low'),
  medium(2, 'Medium'),
  high(3, 'High');

  final int weight;
  final String label;
  const Priority(this.weight, this.label);

  static Priority? tryParse(String text) {
    for (final p in values) {
      if (p.name == text) return p;
    }
    return null;
  }
}

Priority mostUrgent(List<Priority> items) {
  return items.reduce((a, b) => a.weight >= b.weight ? a : b);
}`,
      explain: "الـ static method جوه الـ enum بتوصل لـ <code>values</code> مباشرة. <code>reduce</code> آمنة هنا لأن القايمة مضمون إنها مش فاضية. وبدل <code>weight</code> منفصل كان ممكن نعتمد على <code>index</code>، لكن الوزن الصريح أوضح ومبيتكسرش لو غيرنا الترتيب.",
    },
    {
      title: "Result generic",
      lang: "dart",
      prompt: "<p>اكتب <code>sealed class Result&lt;T&gt;</code> وابنين: <code>Success&lt;T&gt;</code> (فيه <code>T value</code>) و <code>Failure&lt;T&gt;</code> (فيه <code>String message</code>). وبعدين دالتين generic:</p><ul><li><code>T valueOr&lt;T&gt;(Result&lt;T&gt; r, T fallback)</code>: القيمة لو نجح، وإلا الـ fallback.</li><li><code>String describe&lt;T&gt;(Result&lt;T&gt; r)</code>: <code>ok: &lt;value&gt;</code> أو <code>failed: &lt;message&gt;</code>.</li></ul><p>من غير <code>default</code> في الـ switch.</p>",
      examples: [
        { in: "valueOr(Success(5), 0)", out: "5" },
        { in: "valueOr(Failure<int>('x'), 0)", out: "0" },
        { in: "describe(Failure<int>('no net'))", out: "failed: no net" },
      ],
      hints: [
        "الأبناء <code>final class Success&lt;T&gt; extends Result&lt;T&gt;</code>.",
        "<code>return switch (r) { Success&lt;T&gt; s =&gt; ..., Failure&lt;T&gt; f =&gt; ... };</code>",
      ],
      solution: `sealed class Result<T> {}

final class Success<T> extends Result<T> {
  final T value;
  Success(this.value);
}

final class Failure<T> extends Result<T> {
  final String message;
  Failure(this.message);
}

T valueOr<T>(Result<T> r, T fallback) {
  return switch (r) {
    Success<T> s => s.value,
    Failure<T>() => fallback,
  };
}

String describe<T>(Result<T> r) {
  return switch (r) {
    Success<T> s => 'ok: \${s.value}',
    Failure<T> f => 'failed: \${f.message}',
  };
}`,
      explain: "جمعنا التلات أدوات: generics (النوع <code>T</code>)، sealed (حالتين معروفتين)، و switch exhaustive. لو ضفنا <code>Loading&lt;T&gt;</code> للـ sealed، الدالتين هيبطلوا يتكومبايلوا لحد ما نتعامل مع الحالة الجديدة.",
    },
  ],

  quiz: [
    {
      q: "أنهي سطر فيه خطأ كومبايل؟",
      code: { lang: "dart", src: `class Stack<T> {
  final List<T> _items = [];
  void push(T item) => _items.add(item);
}

void main() {
  final s = Stack<int>();
  s.push(1);        // 1
  s.push(2 + 3);    // 2
  s.push('3');      // 3
  s.push(-4);       // 4
}` },
      options: ["السطر 1", "السطر 2", "السطر 3", "السطر 4"],
      answer: 2,
      why: "<code>Stack&lt;int&gt;</code> معناها <code>T</code> = int، فـ <code>push</code> مش بتقبل String. وده فايدة الـ generics: الخطأ بيبان وقت الكتابة.",
    },
    {
      q: "أنهي واحد بيتكومبايل لكن بيرمي <code>TypeError</code> وقت التشغيل؟",
      options: [
        "<code>final a = &lt;int&gt;[1]; a.add('x');</code>",
        "<code>List&lt;dynamic&gt; a = [1, 'x']; int n = a[1];</code>",
        "<code>List&lt;int&gt; a = ['x'];</code>",
        "<code>int n = 'x';</code>",
      ],
      answer: 1,
      why: "<code>dynamic</code> بتسمح بالتعيين من غير فحص وقت الكومبايل، فالغلط بيظهر وقت التشغيل لما الـ String تتحول لـ int. باقي الاختيارات كلها بتتمسك وقت الكومبايل.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `enum Color { red, green, blue }

void main() {
  print(Color.blue.index);
}` },
      answer: ["2"],
      why: "الـ index بيبدأ من 0: red=0 و green=1 و blue=2.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `enum Color { red, green, blue }

void main() {
  print(Color.green.name + ' ' + Color.values.length.toString());
}` },
      answer: ["green 3"],
      why: "<code>name</code> نص الاسم من غير اسم الـ enum (<code>green</code>)، و <code>values.length</code> عدد القيم (3). لو طبعت <code>Color.green</code> مباشرة كان هيطلع <code>Color.green</code>.",
    },
    {
      q: "أنهي استدعاء هيدي خطأ كومبايل؟",
      code: { lang: "dart", src: `T maxOf<T extends num>(T a, T b) => a > b ? a : b;` },
      options: [
        "<code>maxOf(3, 7)</code>",
        "<code>maxOf('a', 'b')</code>",
        "<code>maxOf(2.5, 1.5)</code>",
        "<code>maxOf&lt;int&gt;(1, 2)</code>",
      ],
      answer: 1,
      why: "<code>T extends num</code> بتقبل int و double بس. <code>String</code> مش num فالاستدعاء بيترفض. اللي بتقبل strings تكون <code>T extends Comparable</code>.",
    },
    {
      q: "عندك switch على sealed class من غير <code>default</code>، وضفت ابن جديد للكلاس. إيه اللي بيحصل؟",
      options: [
        "الـ switch بيتجاهل الابن الجديد",
        "بيرمي exception وقت التشغيل أول مرة يظهر فيها الابن",
        "بيروح لأول case تلقائيا",
        "خطأ كومبايل في الـ switch لحد ما تغطي الحالة الجديدة",
      ],
      answer: 3,
      why: "الـ compiler يعرف القايمة الكاملة للأبناء ويفرض إن الـ switch يغطيهم كلهم. بيخلي إضافة حالة جديدة مؤمّنة لأنك مش هتنسى مكان.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `void main() {
  Object o = <int>[1, 2];
  print(o is List<String>);
}` },
      answer: ["false"],
      why: "الـ generics في Dart reified: النوع <code>List&lt;int&gt;</code> بيفضل موجود وقت التشغيل، فالفحص بيقدر يفرّق بينها وبين <code>List&lt;String&gt;</code>. في Java مثلا كان هيرجع true بسبب الـ erasure.",
    },
    {
      q: "أنهي واحدة مش مسموحة في الـ enum؟",
      options: [
        "إنشاء قيمة جديدة وقت التشغيل: <code>final p = Plan(5);</code>",
        "<code>final int price;</code> مع constructor",
        "getter زي <code>bool get isPaid =&gt; price &gt; 0</code>",
        "<code>static</code> method",
      ],
      answer: 0,
      why: "قيم الـ enum معرّفة كلها جوه القايمة ومينفعش تتعمل قيم جديدة برا (الـ constructor للقيم دي بس). الـ fields الـ final و getters و static methods كلها مسموحة، بس field مش final بيدي خطأ.",
    },
    {
      q: "حالة الدفع: <code>Paid(amount, receiptId)</code> و <code>Pending</code> و <code>Failed(reason)</code>. أنهي أنسب؟",
      options: [
        "<code>enum PaymentState { paid, pending, failed }</code> مع maps بره للبيانات",
        "<code>sealed class PaymentState</code> وكل حالة كلاس بيشيل بياناته",
        "ثلاثة <code>bool</code> بتتعدل",
        "<code>dynamic</code> بتشيل أي حاجة",
      ],
      answer: 1,
      why: "كل حالة بتشيل بيانات مختلفة، وده بالظبط استخدام الـ sealed class. الـ enum مناسب لما القيم بسيطة ونفس الشكل، والـ booleans المنفصلة بتسمح بحالات مستحيلة (paid و failed مع بعض).",
    },
  ],
};
