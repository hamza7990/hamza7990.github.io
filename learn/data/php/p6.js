window.LEVELS = window.LEVELS || {};
window.LEVELS["php/p6"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "الويب كله ريكويست ورد، والأمان أول سؤال في الإنترفيو",
      en: "The request/response cycle",
      body: "<p>المتصفح بيبعت <b>HTTP request</b>: method (GET, POST...) + مسار + headers + body أحيانا. الـ server بيرد بـ <b>response</b>: status code + headers + body. PHP بتشتغل بين الاتنين: بتقرا الريكويست من superglobals وبتبني الرد.</p><p>وكل مقابلة back-end فيها سؤال أمان: XSS و CSRF و SQL injection وتخزين الباسوردات. لازم تفهم كل واحدة وإيه اللي Laravel بتعمله عنك.</p>",
      code: {
        lang: "text",
        title: "raw HTTP",
        src: `POST /orders HTTP/1.1
Host: shop.test
Content-Type: application/x-www-form-urlencoded
Cookie: PHPSESSID=abc123

item=book&qty=2

HTTP/1.1 302 Found
Location: /orders/17
Set-Cookie: PHPSESSID=abc123; HttpOnly`,
        note: "الجزء الأول ريكويست والتاني رد. الـ cookie بتتبعت مع كل ريكويست تلقائي، وده اللي بيربط الريكويستات ببعض (الـ HTTP نفسه stateless).",
      },
      terms: [
        ["stateless", "من غير ذاكرة", "كل ريكويست مستقل، والسيرفر مبيفتكرش اللي قبله غير عن طريق session/cookie."],
        ["idempotent", "تكرار آمن", "نفس الريكويست مرة أو 10 مرات ليه نفس الأثر: GET و PUT و DELETE كده، لكن POST لأ."],
      ],
    },
    {
      title: "الـ methods وأكواد الحالة",
      en: "Methods and status codes at a glance",
      points: [
        "<code>GET</code> قراءة (من غير تغيير بيانات). <code>POST</code> إنشاء أو فعل. <code>PUT</code>/<code>PATCH</code> تعديل كامل/جزئي. <code>DELETE</code> حذف.",
        "<b>2xx</b> نجاح: <code>200</code> OK، <code>201</code> Created، <code>204</code> No Content.",
        "<b>3xx</b> تحويل: <code>301</code> دائم، <code>302</code> مؤقت.",
        "<b>4xx</b> غلط من العميل: <code>400</code> ريكويست مشوّه، <code>401</code> مش مسجل دخول، <code>403</code> مسجل بس مش مسموح، <code>404</code> مش موجود، <code>422</code> الفاليديشن فشلت، <code>429</code> ريكويستات كتير.",
        "<b>5xx</b> غلط من السيرفر: <code>500</code> خطأ في الكود، <code>503</code> الخدمة مش متاحة.",
        "Laravel بترجع <code>419</code> لما الـ CSRF token ناقص أو منتهي (مش كود معياري، خاص بـ Laravel).",
      ],
      interview: [
        { q: "إيه الفرق بين 401 و 403؟", a: "<code>401 Unauthorized</code> معناها «إنت مش معروف»: مفيش تسجيل دخول أو الـ token غلط. <code>403 Forbidden</code> معناها «أنا عارفك بس مش مسموحلك». يعني لو مستخدم عادي حاول يفتح لوحة الأدمن بعد ما سجل دخول، ده 403. وفي Laravel الـ middleware <code>auth</code> بيرجع 401 والـ policies والـ gates بترجع 403." },
        { q: "إيه الفرق بين GET و POST؟", a: "GET للقراءة، والبيانات في الـ URL (query string) فبتبقى في الـ history والـ logs، وهو idempotent وينفع يتعمل له cache. POST للإنشاء أو الأفعال اللي بتغيّر حاجة، والبيانات في الـ body، ومش idempotent. وماينفعش نحط باسورد أو بيانات حساسة في GET." },
      ],
    },
    {
      title: "الـ superglobals: وإزاي تقرا الريكويست",
      en: "$_GET, $_POST, $_SERVER",
      body: "<p>PHP بتجهزلك arrays عامة في كل ريكويست: <code>$_GET</code> (الـ query string)، <code>$_POST</code> (الـ form body)، <code>$_SERVER</code> (معلومات الريكويست والسيرفر)، <code>$_COOKIE</code>، <code>$_FILES</code>، <code>$_SESSION</code>. كلها <b>بيانات جاية من برا</b>، يعني مش موثوقة.</p>",
      code: {
        lang: "php",
        src: `<?php
declare(strict_types=1);

// simulate a request: GET /search?q=php&page=2
$_SERVER['REQUEST_METHOD'] = 'GET';
$_GET = ['q' => 'php', 'page' => '2'];

$method = $_SERVER['REQUEST_METHOD'];
$q = trim((string) ($_GET['q'] ?? ''));
$page = filter_var(
    $_GET['page'] ?? 1,
    FILTER_VALIDATE_INT,
    ['options' => ['min_range' => 1, 'default' => 1]]
);

http_response_code(200);                      // headers first
header('Content-Type: application/json');     // then the body
echo json_encode(['m' => $method, 'q' => $q, 'page' => $page]);`,
        note: "الـ headers (<code>header()</code> و<code>http_response_code</code>) لازم تتبعت قبل أي output. كل قيمة جاية من برا بتتعامل كنص: <code>$_GET['page']</code> هي <code>\"2\"</code> مش <code>2</code>. فبنتحقق ونحوّل. الـ <code>filter_var</code> مع <code>FILTER_VALIDATE_INT</code> بترجع الرقم أو الـ default. ملاحظة: في Laravel بتقرا بـ <code>$request->input('page', 1)</code> بدل الـ superglobals.",
      },
      pitfall: "<code>$_REQUEST</code> بتخلط GET وPOST والـ cookies، فمتستخدمهاش. وماتثقش في <code>$_SERVER['HTTP_*']</code> (زي <code>HTTP_HOST</code> و<code>HTTP_X_FORWARDED_FOR</code>) لأن العميل هو اللي بيبعتها.",
    },
    {
      title: "الـ Session والـ Cookies",
      en: "Sessions and cookies",
      body: "<p>الـ <b>cookie</b> نص صغير السيرفر بيطلب من المتصفح يحفظه ويبعته مع كل ريكويست. الـ <b>session</b> بيانات بتتخزن على السيرفر (ملف أو داتابيز أو Redis)، والمتصفح بيحمل بس <b>session id</b> في cookie. عشان كده الـ session ينفع تشيل بيانات حساسة (معرّف المستخدم) والـ cookie لأ.</p>",
      code: {
        lang: "php",
        src: `<?php
declare(strict_types=1);

session_set_cookie_params([
    'httponly' => true,       // JS cannot read it (limits XSS damage)
    'secure' => true,         // only over HTTPS
    'samesite' => 'Lax',      // not sent on cross-site POST (helps CSRF)
]);
session_start();

// after a successful login:
session_regenerate_id(true);  // stop session fixation
$_SESSION['user_id'] = 42;

$id = $_SESSION['user_id'] ?? null;   // read on later requests

// logout
$_SESSION = [];
session_destroy();

setcookie('theme', 'dark', [
    'expires' => time() + 3600,
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Lax',
]);`,
        note: "<code>session_start()</code> و<code>setcookie</code> لازم يتنادوا قبل أي output (headers). الـ <code>session_regenerate_id(true)</code> بعد تسجيل الدخول بتمنع session fixation. الشكل ده (array options في setcookie) من PHP 7.3.",
      },
      interview: [
        { q: "إيه الفرق بين الـ session والـ cookie؟ وإزاي الـ session بتشتغل؟", a: "الـ cookie بتتخزن عند المتصفح (ومحتواها ممكن يتعدل أو يتقرا)، والـ session بتتخزن على السيرفر والمتصفح بيحمل id بس في cookie. أول ريكويست PHP بتعمل session id وبتبعته في <code>Set-Cookie</code>، وفي الريكويستات اللي بعد كده بتقرا الـ id من الـ cookie وتجيب الـ <code>$_SESSION</code> المرتبط بيه. وبسبب إن PHP بتبدأ من الصفر كل ريكويست، الـ session هي الطريقة اللي بنفتكر بيها المستخدم. وبأضيف <code>HttpOnly</code> و<code>Secure</code> و<code>SameSite</code> للـ cookie." },
      ],
    },
    {
      title: "XSS: لا تطبع input من غير escape",
      en: "Cross-Site Scripting and output escaping",
      body: "<p>الـ XSS هو إن مهاجم يحقن كود JavaScript في صفحة بيشوفها مستخدم تاني (تعليق، اسم، بحث)، فينفذ في متصفح الضحية ويسرق الـ session أو يتصرف باسمه. العلاج الأساسي: <b>escape عند الطباعة</b> حسب السياق، مش تنضيف الـ input.</p>",
      code: {
        lang: "php",
        src: `<?php
declare(strict_types=1);

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

$comment = '<script>alert(1)</script>';
echo "<p>" . $comment . "</p>\\n";      // dangerous: script runs
echo "<p>" . e($comment) . "</p>\\n";   // safe: shown as text

$name = 'O\\'Neil "Admin"';
echo '<input value="' . e($name) . '">', "\\n";`,
        note: "الناتج الآمن: <code>&amp;lt;script&amp;gt;alert(1)&amp;lt;/script&amp;gt;</code>. الـ <code>htmlspecialchars</code> بتحول <code>&lt; &gt; &amp; \" '</code> لـ entities. من PHP 8.1 الـ default flags بقت <code>ENT_QUOTES | ENT_SUBSTITUTE</code> بس بنكتبها صراحة.",
      },
      focus: [{ label: "في Laravel", text: "<code>{{ $x }}</code> في Blade بتعمل escape تلقائي. <code>{!! $x !!}</code> بتطبع خام: ما تستخدمهاش على input من مستخدم أبدا." }],
      interview: [
        { q: "إيه الـ XSS وإزاي تمنعه؟", a: "إن مهاجم يخلي صفحتك تنفذ JavaScript بتاعه في متصفح مستخدم تاني، عادة لأننا طبعنا input من غير escape. بمنعه بـ <b>output escaping</b> حسب السياق (<code>htmlspecialchars</code> للـ HTML)، وبـ <b>Content-Security-Policy</b> كطبقة تانية، وبـ <code>HttpOnly</code> على الـ session cookie عشان JS مايقراش. في Laravel، Blade بتعمل escape تلقائي بـ <code>{{ }}</code>. وبتجنب <code>{!! !!}</code> و<code>innerHTML</code> على بيانات المستخدم." },
      ],
    },
    {
      title: "CSRF: ريكويست مزوّر باسمك",
      en: "Cross-Site Request Forgery",
      body: "<p>لو إنت مسجل دخول في موقع البنك، وفتحت صفحة خبيثة فيها form بيبعت POST لموقع البنك، المتصفح هيبعت الـ cookie تلقائي والبنك هيفتكر إنك إنت اللي طلبت. الحل: <b>CSRF token</b> عشوائي مربوط بالـ session، موجود في الـ form، والسيرفر بيقارنه. الصفحة الخبيثة مش بتعرف قيمته.</p>",
      code: {
        lang: "php",
        src: `<?php
declare(strict_types=1);

session_start();

function csrfToken(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function verifyCsrf(?string $sent): bool
{
    $real = $_SESSION['csrf'] ?? '';
    return $sent !== null && hash_equals($real, $sent);
}

// the form carries a hidden field _token = csrfToken()
// on POST:
if (!verifyCsrf($_POST['_token'] ?? null)) {
    http_response_code(419);
    exit('Invalid CSRF token');
}`,
        note: "بنستخدم <code>random_bytes</code> (عشوائي آمن) مش <code>rand</code>، و<code>hash_equals</code> للمقارنة (ثابتة الزمن) مش <code>==</code>. و<code>SameSite=Lax</code> على الـ cookie بيقلل الخطر كمان.",
      },
      focus: [{ label: "في Laravel", text: "حط <code>@csrf</code> جوه كل form بتغيّر بيانات، وmiddleware الـ CSRF بيتحقق تلقائي ويرجع 419 لو الـ token غلط. الـ API اللي بتستخدم tokens في الـ header (Sanctum bearer) مش بتحتاجه." }],
      interview: [
        { q: "إيه الـ CSRF وإزاي تحمي منه؟", a: "الهجوم بيستغل إن المتصفح بيبعت الـ cookies تلقائي مع أي ريكويست للموقع، فصفحة خبيثة تخليك تبعت POST وإنت مسجل دخول. الحماية: token عشوائي لكل session بيتحط في الـ form (hidden field) أو header ويتقارن على السيرفر، وSameSite cookies، وإن العمليات اللي بتغيّر بيانات تبقى POST/PUT/DELETE مش GET. في Laravel: <code>@csrf</code> والـ middleware بيتولى باقي الشغل." },
      ],
    },
    {
      title: "SQL injection والباسوردات",
      en: "SQL injection and password hashing",
      body: "<p><b>SQL injection</b>: لو ركّبت الـ SQL بدمج نص المستخدم، المهاجم يكتب <code>' OR '1'='1</code> ويغيّر معنى الاستعلام. العلاج هو <b>prepared statements</b>: الاستعلام والبيانات بيتبعتوا منفصلين فالبيانات عمرها ما تتفسر كـ SQL (بنشرحها بالتفصيل في p7).</p><p>والباسورد عمره ما يتخزن نص خام ولا بـ <code>md5</code>/<code>sha1</code> (سريعة ومكسورة). بنستخدم <code>password_hash</code> اللي بتعمل salt وتكلفة تلقائي.</p>",
      codes: [
        {
          lang: "php",
          title: "injection",
          src: `<?php
$email = "x' OR '1'='1";

// BAD: user text becomes part of the SQL
$sql = "SELECT * FROM users WHERE email = '$email'";
echo $sql, "\\n";
// SELECT * FROM users WHERE email = 'x' OR '1'='1'   (matches every row)

// GOOD: placeholders, data travels separately
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);`,
        },
        {
          lang: "php",
          title: "passwords",
          src: `<?php
declare(strict_types=1);

$hash = password_hash('s3cret-pass', PASSWORD_DEFAULT);
// store $hash (about 60 chars, includes salt and cost)

var_dump(password_verify('s3cret-pass', $hash));   // true
var_dump(password_verify('wrong', $hash));         // false

if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
    // re-hash after a successful login and save the new hash
}`,
          note: "ما تقارنش الـ hash بـ <code>==</code>: استخدم <code>password_verify</code>. الـ hash بيتغير كل مرة (salt عشوائي) فمتقارنش اتنين بإيدك. في Laravel: <code>Hash::make()</code> و<code>Hash::check()</code>.",
        },
      ],
      interview: [
        { q: "إزاي بتخزن الباسوردات؟ وليه مش md5؟", a: "بعمل hash بـ <code>password_hash($pw, PASSWORD_DEFAULT)</code> (bcrypt حاليا) وبتحفظ الناتج بس، وأتحقق بـ <code>password_verify</code>. الدالة بتضيف salt عشوائي وبتكون بطيئة عن قصد عشان تصعّب brute force. md5 و sha1 سريعة جدا والـ GPU بتجرب مليارات الاحتمالات في الثانية، ومن غير salt بيتكسروا بـ rainbow tables. في Laravel: <code>Hash::make</code> و<code>Hash::check</code> والـ model بيعمل cast <code>hashed</code>." },
      ],
    },
    {
      title: "ما تثقش في أي input، ورفع الملفات",
      en: "Never trust input; file uploads",
      body: "<p>القاعدة: <b>كل حاجة جاية من المستخدم مشبوهة</b>: الحقول، الـ headers، الـ cookies، أسماء الملفات، حتى الـ MIME type اللي المتصفح بيبعته. بنتحقق من الشكل (validation) في الدخول، وبنعمل escape في الخروج، وبنستخدم prepared statements مع الداتابيز. الملفات المرفوعة من أخطر الأبواب: ممكن حد يرفع <code>shell.php</code> وينفذه.</p>",
      code: {
        lang: "php",
        src: `<?php
declare(strict_types=1);

function storeImage(array $file, string $dir): string
{
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Upload failed');
    }
    if ($file['size'] > 2 * 1024 * 1024) {
        throw new RuntimeException('File too large');
    }

    // detect type from the real content, not from $file['type']
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png'];
    if (!isset($allowed[$mime])) {
        throw new RuntimeException('Type not allowed');
    }

    // new random name, extension from the allowlist
    $name = bin2hex(random_bytes(16)) . '.' . $allowed[$mime];
    if (!move_uploaded_file($file['tmp_name'], "$dir/$name")) {
        throw new RuntimeException('Could not save file');
    }
    return $name;
}`,
        note: "الفحوصات: كود الخطأ، الحجم، النوع الحقيقي من المحتوى (<code>finfo</code>) مقابل allowlist، واسم عشوائي (ما تستخدمش الاسم الأصلي)، و<code>move_uploaded_file</code>. والأفضل تخزن برا الـ web root أو على storage مش بينفذ PHP.",
      },
      pitfall: "الاعتماد على <code>$_FILES['f']['type']</code> أو امتداد الاسم بس: الاتنين العميل هو اللي بيبعتهم. تحقق من المحتوى، وخلي فولدر الرفع مايشغّلش PHP أبدا.",
      focus: [{ label: "في Laravel", text: "الفاليديشن: <code>'photo' => 'required|image|mimes:jpg,png|max:2048'</code>، والتخزين بـ <code>$request->file('photo')->store('photos')</code> بيولّد اسم عشوائي. والـ query builder والـ Eloquent بيستخدموا prepared statements دايما، وباقي الحماية (escape وCSRF وhash) اتكلمنا عليها فوق." }],
      interview: [
        { q: "إزاي تأمّن رفع ملف؟", a: "أتحقق من كود الخطأ والحجم، وأحدد النوع من محتوى الملف الفعلي (<code>finfo</code>) مقابل allowlist مش من الامتداد أو الـ type اللي العميل بعته، وأغيّر الاسم لاسم عشوائي بامتداد من الـ allowlist، وأخزنه برا الـ web root أو في مكان مبيتنفذش فيه PHP، وأحط حد أقصى للحجم. ولو صور ممكن أعيد معالجتها. وفي Laravel بستخدم قواعد <code>image</code> و<code>mimes</code> و<code>max</code> و<code>store()</code>." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: دالة escape",
      lang: "php",
      code: `<?php
declare(strict_types=1);

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

$comment = '<script>alert(1)</script>';
echo "<p>" . e($comment) . "</p>\\n";`,
    },
    {
      title: "اكتب: باسورد hash و verify",
      lang: "php",
      code: `<?php
declare(strict_types=1);

$hash = password_hash('s3cret-pass', PASSWORD_DEFAULT);

if (password_verify('s3cret-pass', $hash)) {
    echo "login ok\\n";
} else {
    echo "wrong password\\n";
}

var_dump(password_verify('wrong', $hash));`,
    },
    {
      title: "اكتب: CSRF token",
      lang: "php",
      code: `<?php
declare(strict_types=1);

session_start();

function csrfToken(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function verifyCsrf(?string $sent): bool
{
    $real = $_SESSION['csrf'] ?? '';
    return $sent !== null && hash_equals($real, $sent);
}`,
    },
  ],

  tasks: [
    {
      title: "تنضيف رقم الصفحة",
      lang: "php",
      prompt: "<p>اكتب دالة <code>pageFrom(array $query): int</code> بتقرا <code>$query['page']</code> (نص جاي من الـ URL) وترجع رقم الصفحة. لو مش موجود أو مش رقم صحيح أو أقل من 1 ترجع 1، ولو أكبر من 1000 ترجع 1000.</p>",
      examples: [
        { in: "pageFrom(['page' => '3'])", out: "3" },
        { in: "pageFrom(['page' => 'abc'])", out: "1" },
        { in: "pageFrom(['page' => '99999'])", out: "1000" },
        { in: "pageFrom([])", out: "1" },
      ],
      hints: [
        "<code>filter_var($v, FILTER_VALIDATE_INT)</code> بترجع <code>false</code> لو مش رقم صحيح.",
        "بعد التحقق استخدم <code>max(1, min(1000, $n))</code>.",
      ],
      solution: `<?php
declare(strict_types=1);

function pageFrom(array $query): int
{
    $n = filter_var($query['page'] ?? null, FILTER_VALIDATE_INT);
    if ($n === false) {
        return 1;
    }
    return max(1, min(1000, $n));
}

echo pageFrom(['page' => '3']), "\\n";
echo pageFrom(['page' => 'abc']), "\\n";
echo pageFrom(['page' => '99999']), "\\n";
echo pageFrom([]), "\\n";`,
      explain: "القيمة جاية من برا فبنعاملها كنص ونتحقق. <code>filter_var(null, FILTER_VALIDATE_INT)</code> بترجع <code>false</code> فالحالة الناقصة بتتغطى بنفس الفحص. <code>max/min</code> بتحبس الرقم في نطاق آمن.",
    },
    {
      title: "عرض آمن لقائمة تعليقات",
      lang: "php",
      prompt: "<p>اكتب دالة <code>renderComments(array $comments): string</code>. كل عنصر <code>['author' =&gt; string, 'text' =&gt; string]</code>. ترجع HTML: <code>&lt;li&gt;&lt;b&gt;AUTHOR&lt;/b&gt;: TEXT&lt;/li&gt;</code> لكل تعليق، ملفوفة في <code>&lt;ul&gt;...&lt;/ul&gt;</code>، مع escape صحيح للمؤلف والنص بدون استخدام أي مكتبة.</p>",
      examples: [
        { in: "renderComments([['author'=>'Ali','text'=>'<hi>']])", out: "<ul><li><b>Ali</b>: &lt;hi&gt;</li></ul>" },
      ],
      hints: [
        "اعمل دالة <code>e()</code> صغيرة حوالين <code>htmlspecialchars</code> مع <code>ENT_QUOTES</code> و<code>'UTF-8'</code>.",
        "ابني النص بـ <code>array_map</code> و<code>implode</code>، أو foreach.",
      ],
      solution: `<?php
declare(strict_types=1);

function e(string $v): string
{
    return htmlspecialchars($v, ENT_QUOTES, 'UTF-8');
}

function renderComments(array $comments): string
{
    $items = '';
    foreach ($comments as $c) {
        $items .= '<li><b>' . e($c['author']) . '</b>: '
            . e($c['text']) . '</li>';
    }
    return '<ul>' . $items . '</ul>';
}

echo renderComments([
    ['author' => 'Ali', 'text' => '<script>x()</script>'],
]), "\\n";`,
      explain: "الـ escape بيتعمل عند الطباعة على كل قيمة جاية من المستخدم، حتى اسم المؤلف. الوسوم اللي إحنا كتبناها (<code>&lt;li&gt;</code>) تفضل خام. ده بالظبط اللي Blade بيعمله مع <code>{{ }}</code>.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
echo htmlspecialchars('<b>"x"</b>');` },
      options: [
        "<code>&amp;lt;b&amp;gt;&amp;quot;x&amp;quot;&amp;lt;/b&amp;gt;</code>",
        "<code>&amp;lt;b&amp;gt;\"x\"&amp;lt;/b&amp;gt;</code>",
        "<code>&lt;b&gt;\"x\"&lt;/b&gt;</code>",
        "<code>&amp;amp;lt;b&amp;amp;gt;&amp;amp;quot;x&amp;amp;quot;&amp;amp;lt;/b&amp;amp;gt;</code>",
      ],
      answer: 0,
      why: "الـ default flags من PHP 8.1 بتشمل <code>ENT_QUOTES</code> فالـ double quote بتتحول لـ <code>&amp;quot;</code> كمان (والـ single لـ <code>&amp;#039;</code>). في الإصدارات القديمة الـ single quote كانت بتفضل زي ما هي.",
    },
    {
      q: "مستخدم مسجل دخول حاول يفتح صفحة الأدمن ومعندوش صلاحية. الكود الصح؟",
      options: ["401", "403", "404", "500"],
      answer: 1,
      why: "403 معناها «معروف بس غير مسموح». 401 لما مفيش تسجيل دخول أصلا. بعض التطبيقات بتستخدم 404 عشان تخبي وجود الصفحة، لكن 403 هو المعنى المعياري.",
    },
    {
      q: "أنهي استعلام آمن من SQL injection؟",
      options: [
        "<code>$pdo-&gt;query(\"SELECT * FROM users WHERE id = $id\")</code>",
        "<code>$pdo-&gt;query(\"SELECT * FROM users WHERE name = '\" . trim($name) . \"'\")</code>",
        "<code>$pdo-&gt;prepare('SELECT * FROM users WHERE id = ?')-&gt;execute([$id])</code>",
        "<code>$pdo-&gt;query(\"SELECT * FROM users WHERE id = '\" . addslashes($id) . \"'\")</code>",
      ],
      answer: 2,
      why: "الـ prepared statement بيفصل الاستعلام عن البيانات. التاني فيه <code>OR 1</code> ثابت. الرابع <code>addslashes</code> مش حماية كافية (مشاكل encodings) والأول فيه دمج مباشر.",
    },
    {
      q: "ليه بنستخدم <code>hash_equals</code> بدل <code>==</code> لمقارنة الـ CSRF token؟",
      options: [
        "لأن <code>==</code> مبتشتغلش مع النصوص",
        "لأن <code>hash_equals</code> مقارنتها ثابتة الزمن (تمنع timing attacks) ومش بتتأثر بـ type juggling",
        "لأن <code>hash_equals</code> بتشفر القيمة",
        "لأن <code>==</code> بتقارن الطول بس",
      ],
      answer: 1,
      why: "<code>==</code> ممكن تقف عند أول حرف مختلف (فبتسرّب معلومة عن طريق الزمن) وبتحول الأنواع. <code>hash_equals</code> بتاخد نفس الزمن مهما كان الاختلاف.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
$h = password_hash('abc', PASSWORD_DEFAULT);
var_dump(password_verify('abc', $h));
var_dump($h === password_hash('abc', PASSWORD_DEFAULT));` },
      options: [
        "bool(true) ثم bool(true)",
        "bool(true) ثم bool(false)",
        "bool(false) ثم bool(false)",
        "bool(false) ثم bool(true)",
      ],
      answer: 1,
      why: "كل <code>password_hash</code> بتولّد salt جديد فالـ hash بيختلف كل مرة، عشان كده المقارنة بـ <code>===</code> false. والتحقق لازم يتم بـ <code>password_verify</code> اللي بترجع true.",
    },
    {
      q: "أنهي إعداد للـ session cookie بيمنع JavaScript من قراءتها؟",
      options: ["Secure", "HttpOnly", "SameSite", "Path"],
      answer: 1,
      why: "<code>HttpOnly</code> بتخفي الـ cookie من <code>document.cookie</code> فتحد ضرر الـ XSS. <code>Secure</code> بتخليها تتبعت على HTTPS بس، و<code>SameSite</code> بتتحكم في الإرسال من مواقع تانية (CSRF).",
    },
    {
      q: "رفعت ملف اسمه <code>photo.jpg</code> بس محتواه سكريبت PHP. أنهي فحص هو الأضمن لرفضه؟",
      options: [
        "فحص امتداد الاسم",
        "فحص <code>$_FILES['f']['type']</code>",
        "فحص المحتوى الفعلي بـ <code>finfo</code> مقابل allowlist مع اسم عشوائي",
        "فحص الحجم",
      ],
      answer: 2,
      why: "الاسم والـ type الاتنين العميل هو اللي بيحددهم. فحص المحتوى الفعلي بيكشف الكذب. والاسم العشوائي بامتداد من الـ allowlist بيمنع اسم زي <code>shell.php</code>.",
    },
    {
      q: "هجوم الـ CSRF بيعتمد على إيه؟",
      options: [
        "إن المتصفح بيبعت الـ cookies تلقائي مع الريكويست لأي موقع مسجل فيه",
        "إن السيرفر بيعرض input من غير escape",
        "إن الباسورد متخزن بـ md5",
        "إن الاستعلام بيدمج نص المستخدم",
      ],
      answer: 0,
      why: "ده معنى CSRF. التاني هو XSS، والتالت ضعف في تخزين الباسوردات، والرابع SQL injection.",
    },
    {
      q: "في Blade، أنهي سطر بيطبع <code>$comment</code> من غير escape (خطر لو جاي من مستخدم)؟",
      options: ["<code>{{ $comment }}</code>", "<code>{!! $comment !!}</code>", "<code>@csrf</code>", "<code>{{-- $comment --}}</code>"],
      answer: 1,
      why: "<code>{!! !!}</code> بتطبع خام. <code>{{ }}</code> بتعمل <code>htmlspecialchars</code> تلقائي. <code>@csrf</code> بتحط حقل الـ token، و<code>{{-- --}}</code> comment.",
    },
  ],
};
