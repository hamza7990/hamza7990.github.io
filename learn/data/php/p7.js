window.LEVELS = window.LEVELS || {};
window.LEVELS["php/p7"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "PDO هو الأساس اللي Eloquent واقف عليه",
      en: "What PDO is",
      body: "<p>الـ <b>PDO</b> (PHP Data Objects) واجهة موحدة للتعامل مع الداتابيز: نفس الكود تقريبا مع MySQL أو PostgreSQL أو SQLite، بتغيّر الـ DSN بس. هو مش ORM: بتكتب SQL بإيدك وهو يبعتها ويرجعلك الصفوف.</p><p>ومهم لأن كل حاجة في Laravel (الـ Query Builder و Eloquent و migrations) بتنادي PDO من تحت. لو فاهم PDO وال prepared statements والـ transactions، هتفهم ليه Eloquent بتتصرف زي ما بتتصرف، وهتعرف تحل أي مشكلة في الـ queries.</p>",
      points: [
        "في أمثلة المستوى ده بنستخدم schema صغير: <code>users(id, name, email, balance_cents)</code> و<code>orders(id, user_id, total_cents, status)</code>.",
        "الأمثلة القابلة للتشغيل بتستخدم SQLite في الميموري (<code>sqlite::memory:</code>) عشان تجربها من غير سيرفر. الكود نفسه بيشتغل مع MySQL بتغيير الـ DSN (وفي MySQL تكتب <code>AUTO_INCREMENT</code> بدل <code>AUTOINCREMENT</code>).",
      ],
    },
    {
      title: "الاتصال بالداتابيز",
      en: "Connecting with PDO",
      body: "<p>الاتصال بيحتاج DSN (نوع الداتابيز + المضيف + الاسم + الـ charset)، واسم مستخدم وباسورد. الأهم هي الـ options: خلي الأخطاء <b>exceptions</b> (الافتراضي من PHP 8.0 بقى <code>ERRMODE_EXCEPTION</code> أصلا، بس بنكتبه صراحة)، وحدد الـ fetch mode الافتراضي.</p>",
      code: {
        lang: "php",
        title: "db.php (MySQL)",
        src: `<?php
declare(strict_types=1);

$dsn = 'mysql:host=127.0.0.1;dbname=shop;charset=utf8mb4';

$pdo = new PDO($dsn, getenv('DB_USER') ?: 'root', getenv('DB_PASS') ?: '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
]);

// for quick local experiments:
// $pdo = new PDO('sqlite::memory:', null, null, [...]);`,
        note: "الباسورد والـ user من environment variables مش مكتوبين في الكود (في Laravel ده ملف <code>.env</code>). <code>EMULATE_PREPARES => false</code> بيخلي الداتابيز نفسها تعمل الـ prepare (حماية أقوى وأنواع صح). <code>charset=utf8mb4</code> عشان العربي والإيموجي.",
      },
      terms: [
        ["DSN", "سلسلة الاتصال", "Data Source Name: <code>driver:host=...;dbname=...</code>."],
        ["ERRMODE_EXCEPTION", "الأخطاء exceptions", "أي خطأ SQL بيرمي <code>PDOException</code> بدل ما يسكت."],
      ],
    },
    {
      title: "Prepared statements: الأمان والـ parameters",
      en: "Prepared statements and bound parameters",
      body: "<p>بدل ما تدمج القيم في نص SQL، بتكتب الاستعلام بـ placeholders (<code>?</code> أو <code>:name</code>)، وتعمل <code>prepare</code> مرة، وبعدها <code>execute</code> بالقيم. الداتابيز بتحلل الاستعلام <b>قبل</b> ما تشوف القيم، فالقيم بتتعامل كبيانات بس، عمرها ما تتفسر كأوامر SQL. ده اللي بيمنع الـ SQL injection.</p>",
      code: {
        lang: "php",
        src: `<?php
declare(strict_types=1);

$pdo = new PDO('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
$pdo->exec('CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    balance_cents INTEGER NOT NULL DEFAULT 0
)');
$pdo->exec("INSERT INTO users (name, email) VALUES
    ('Ali', 'ali@test.com'), ('Sara', 'sara@test.com')");

$evil = "x' OR '1'='1";

$stmt = $pdo->prepare('SELECT id, name FROM users WHERE email = :email');
$stmt->execute(['email' => $evil]);
var_dump($stmt->fetch());                // bool(false): no such email

$stmt->execute(['email' => 'ali@test.com']);
print_r($stmt->fetch());                 // id 1, name Ali

// positional placeholders
$stmt = $pdo->prepare('SELECT name FROM users WHERE id = ? AND name = ?');
$stmt->execute([2, 'Sara']);
echo $stmt->fetchColumn(), "\\n";         // Sara`,
        note: "النص الخبيث اتعامل كإيميل عادي مش كجزء من الاستعلام. نفس الـ statement ينفع يتنفذ كذا مرة بقيم مختلفة. بنستخدم <code>exec</code> بس للأوامر الثابتة اللي مفيهاش input.",
      },
      pitfall: "الـ placeholders بتحل محل <b>القيم</b> بس، مش أسماء الجداول أو الأعمدة أو <code>ORDER BY</code> أو كلمات SQL. لو الاسم جاي من المستخدم، قارنه بـ allowlist ثابتة في الكود (<code>in_array($col, ['name', 'email'], true)</code>) قبل ما تدمجه. وللـ <code>IN</code> ابنِ علامات الاستفهام بعدد العناصر.",
      interview: [
        { q: "ليه الـ prepared statements بتمنع SQL injection؟", a: "لأن الاستعلام (الهيكل) والقيم بيتبعتوا للداتابيز منفصلين: أولا بتحلل الاستعلام وتحدد مكان الـ placeholders، وبعدين بتستلم القيم كبيانات بس. فمهما كان فيها (quotes أو <code>OR 1=1</code> أو <code>; DROP TABLE</code>) مش هتتفسر كـ SQL. على العكس، لو دمجت النص في الاستعلام بيبقى المهاجم هو اللي بيكتب جزء منه. وفي Laravel الـ Query Builder و Eloquent بيستخدموا bindings دايما." },
        { q: "إيه الفرق بين <code>bindValue</code> و <code>bindParam</code> و <code>execute([...])</code>؟", a: "<code>execute([...])</code> أبسطها وبتبعت كل القيم كنصوص، وهي اللي بستخدمها في أغلب الأحيان. <code>bindValue</code> بتربط قيمة معينة ونوعها (<code>PDO::PARAM_INT</code> مثلا). <code>bindParam</code> بتربط <b>متغير by reference</b> فقيمته بتتقرا وقت <code>execute</code>، مفيدة في لوب بنغيّر فيه المتغير، لكنها بتلخبط كتير فبتجنبها." },
      ],
    },
    {
      title: "قراءة النتائج: fetch modes",
      en: "Fetching rows",
      body: "<p>بعد <code>execute</code> على <code>SELECT</code> بتسحب الصفوف بدوال الـ statement. شكل الصف بيتحدد بالـ fetch mode: <code>FETCH_ASSOC</code> array بأسماء الأعمدة (الأشهر)، <code>FETCH_OBJ</code> object، <code>FETCH_NUM</code> أرقام، <code>FETCH_COLUMN</code> عمود واحد، و<code>FETCH_CLASS</code> بيعبّي object من كلاس.</p>",
      code: {
        lang: "php",
        src: `<?php
declare(strict_types=1);

$pdo = new PDO('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);
$pdo->exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)');
$pdo->exec("INSERT INTO users (name) VALUES ('Ali'), ('Sara'), ('Mona')");

$stmt = $pdo->query('SELECT id, name FROM users ORDER BY id');
$first = $stmt->fetch(PDO::FETCH_ASSOC);      // one row, then moves on
echo $first['name'], "\\n";                    // Ali

$rest = $stmt->fetchAll(PDO::FETCH_OBJ);       // all remaining rows
echo count($rest), " ", $rest[0]->name, "\\n"; // 2 Sara

$names = $pdo->query('SELECT name FROM users')->fetchAll(PDO::FETCH_COLUMN);
echo implode(",", $names), "\\n";              // Ali,Sara,Mona

$count = $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
echo $count, "\\n";                            // 3

$byId = $pdo->query('SELECT id, name FROM users')
    ->fetchAll(PDO::FETCH_KEY_PAIR);           // [1 => 'Ali', ...]
echo $byId[2], "\\n";                           // Sara

foreach ($pdo->query('SELECT name FROM users') as $row) {
    echo $row['name'] ?? $row[0], " ";
}
echo "\\n";`,
        note: "<code>fetch()</code> بترجع صف واحد ثم <code>false</code> لما الصفوف تخلص. <code>fetchAll()</code> بتحمّل كل النتيجة في الميموري، فمع جداول كبيرة استخدم <code>foreach</code> على الـ statement أو pagination. الـ <code>query()</code> بدون placeholders فقط، ولو فيه input استخدم <code>prepare</code>.",
      },
    },
    {
      title: "insert و update و delete و lastInsertId",
      en: "Writing data",
      body: "<p>الكتابة نفس الفكرة: <code>prepare</code> ثم <code>execute</code>. بعد <code>INSERT</code> بتجيب الـ id الجديد بـ <code>$pdo->lastInsertId()</code> (بترجع <code>string</code>). وبعد <code>UPDATE</code>/<code>DELETE</code> بتعرف عدد الصفوف المتأثرة بـ <code>$stmt->rowCount()</code>.</p>",
      code: {
        lang: "php",
        src: `<?php
declare(strict_types=1);

$pdo = new PDO('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
$pdo->exec('CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    balance_cents INTEGER NOT NULL DEFAULT 0
)');

$insert = $pdo->prepare(
    'INSERT INTO users (name, email) VALUES (:name, :email)'
);
$insert->execute(['name' => 'Ali', 'email' => 'ali@test.com']);
$id = (int) $pdo->lastInsertId();
echo "new id: $id\\n";                           // new id: 1

$update = $pdo->prepare(
    'UPDATE users SET balance_cents = balance_cents + :amt WHERE id = :id'
);
$update->execute(['amt' => 500, 'id' => $id]);
echo "updated: ", $update->rowCount(), "\\n";     // updated: 1

$delete = $pdo->prepare('DELETE FROM users WHERE id = ?');
$delete->execute([99]);
echo "deleted: ", $delete->rowCount(), "\\n";     // deleted: 0

try {
    $insert->execute(['name' => 'Copy', 'email' => 'ali@test.com']);
} catch (PDOException $e) {
    echo "duplicate email rejected\\n";
}`,
        note: "الـ <code>UNIQUE</code> على الإيميل بيرمي <code>PDOException</code> عند التكرار (بفضل <code>ERRMODE_EXCEPTION</code>). والـ update بيحسب على الداتابيز (<code>balance_cents + :amt</code>) مش بنقرا القيمة ونكتبها تاني، عشان نتجنب race conditions.",
      },
      interview: [
        { q: "إزاي تجيب الـ id بتاع آخر صف اتضاف؟", a: "<code>$pdo->lastInsertId()</code> بعد الـ <code>execute</code> مباشرة، وبترجع string فبحوّلها لـ int. بتشتغل على نفس الاتصال (connection)، فآمنة مع الريكويستات المتزامنة لأن كل ريكويست له اتصاله. ومع PostgreSQL بنمرر اسم الـ sequence. وفي Eloquent بعد <code>save()</code> أو <code>create()</code> الـ id بيتحط على الـ model لوحده." },
      ],
    },
    {
      title: "الـ Transactions",
      en: "begin, commit, rollBack",
      body: "<p>الـ transaction بتخلي مجموعة عمليات <b>كلها تنجح أو كلها تتلغي</b> (atomicity). تفتح بـ <code>beginTransaction()</code>، لو كله تمام <code>commit()</code>، ولو حصل أي خطأ <code>rollBack()</code> وتعيد رمي الخطأ. المثال: إنشاء طلب وخصم الرصيد لازم يحصلوا مع بعض.</p>",
      code: {
        lang: "php",
        src: `<?php
declare(strict_types=1);

function placeOrder(PDO $pdo, int $userId, int $totalCents): int
{
    $pdo->beginTransaction();
    try {
        $debit = $pdo->prepare(
            'UPDATE users SET balance_cents = balance_cents - :t
             WHERE id = :id AND balance_cents >= :t2'
        );
        $debit->execute(['t' => $totalCents, 'id' => $userId, 't2' => $totalCents]);
        if ($debit->rowCount() !== 1) {
            throw new RuntimeException('Insufficient balance');
        }

        $order = $pdo->prepare(
            'INSERT INTO orders (user_id, total_cents, status)
             VALUES (?, ?, ?)'
        );
        $order->execute([$userId, $totalCents, 'paid']);
        $orderId = (int) $pdo->lastInsertId();

        $pdo->commit();
        return $orderId;
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
}`,
        note: "لو الخصم نجح والـ INSERT فشل، الـ <code>rollBack()</code> بيرجّع الرصيد. بنعيد رمي الخطأ بعد الـ rollback عشان اللي ناداك يعرف. الشرط <code>balance_cents >= :t2</code> بيمنع الرصيد السالب حتى لو ريكويستين اشتغلوا مع بعض. (الـ placeholder المسمى بيتكرر بنفس الاسم مش مسموح مع native prepares، فسميناه <code>t</code> و<code>t2</code>.)",
      },
      focus: [{ label: "في Laravel", text: "<code>DB::transaction(function () { ... });</code> بتعمل نفس الشيء: begin، وcommit لو الـ closure خلصت، وrollBack ثم إعادة رمي الاستثناء لو رمت." }],
      interview: [
        { q: "إيه الـ transaction وإمتى بتحتاجها؟ وإيه اللي بيحصل لو نسيت rollBack؟", a: "هي وحدة عمل ذرية (ACID): مجموعة عمليات إما كلها تتحفظ أو ولا واحدة. بحتاجها لما كذا كتابة مرتبطين ببعض زي الطلب والمخزون والمحفظة. بفتحها بـ <code>beginTransaction</code>، وبعمل <code>commit</code> في النجاح و<code>rollBack</code> في الـ catch وأعيد رمي الاستثناء. لو نسيت، الاتصال بيقفل من غير commit فالداتابيز بتتجاهل التغييرات (أو تفضل locks شغالة لو الاتصال طويل)، فالنتيجة بيانات ناقصة أو locks معلقة. في Laravel <code>DB::transaction()</code> بيعمل ده تلقائي." },
      ],
    },
    {
      title: "Eloquent فوق PDO",
      en: "How Eloquent sits on top",
      body: "<p>Laravel بتفتح اتصال PDO واحد (حسب <code>config/database.php</code> و<code>.env</code>) بنفس الـ options اللي شفناها: exceptions وfetch mode ثابت. الـ Query Builder بيبني SQL وbindings، وبيبعتها لـ <code>PDO::prepare/execute</code>. و Eloquent فوقه بيحوّل الصفوف لـ objects (models).</p>",
      codes: [
        {
          lang: "php",
          title: "PDO",
          src: `$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();`,
        },
        {
          lang: "php",
          title: "Eloquent (Laravel)",
          src: `$user = User::where('email', $email)->first();

// what really runs (you can see it with ->toSql() / DB::listen):
// select * from \`users\` where \`email\` = ? limit 1   [binding: $email]

DB::transaction(function () use ($userId, $total) {
    $user = User::findOrFail($userId);
    $user->decrement('balance_cents', $total);
    Order::create(['user_id' => $userId, 'total_cents' => $total]);
});`,
          note: "الـ <code>?</code> binding هي نفسها placeholders الـ PDO، عشان كده Eloquent محمية من SQL injection طالما ما استخدمتش <code>DB::raw</code> أو <code>whereRaw</code> بدمج نص المستخدم. وللاتصال الخام: <code>DB::connection()->getPdo()</code>.",
        },
      ],
      pitfall: "<code>whereRaw(\"name = '$name'\")</code> و<code>DB::raw</code> مع input بيرجعوا لمشكلة الدمج. لو لازم raw، استخدم bindings: <code>whereRaw('name = ?', [$name])</code>.",
      interview: [
        { q: "إزاي Eloquent بتتعامل مع الداتابيز من تحت؟ وهل محمية من SQL injection؟", a: "Eloquent بتبني الاستعلام عن طريق الـ Query Builder اللي بيجهز SQL فيه placeholders وarray من الـ bindings، وبيبعتهم لـ PDO عن طريق prepare وexecute، والنتيجة بتتحول لـ models. فالقيم دايما bound مش مدموجة، وده بيحمي من SQL injection. الاستثناء هو الـ raw expressions (<code>DB::raw</code>، <code>whereRaw</code>) لو دمجت فيها input من غير bindings." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: اتصال PDO بالـ options",
      lang: "php",
      code: `<?php
declare(strict_types=1);

$dsn = 'mysql:host=127.0.0.1;dbname=shop;charset=utf8mb4';

$pdo = new PDO($dsn, 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
]);`,
    },
    {
      title: "اكتب: prepare و execute و fetch",
      lang: "php",
      code: `<?php
declare(strict_types=1);

function findUser(PDO $pdo, string $email): ?array
{
    $stmt = $pdo->prepare(
        'SELECT id, name FROM users WHERE email = :email'
    );
    $stmt->execute(['email' => $email]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row === false ? null : $row;
}`,
    },
    {
      title: "اكتب: transaction كاملة",
      lang: "php",
      code: `<?php
declare(strict_types=1);

function transfer(PDO $pdo, int $from, int $to, int $cents): void
{
    $sql = 'UPDATE users SET balance_cents = balance_cents + ? '
        . 'WHERE id = ?';
    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([-$cents, $from]);
        $stmt->execute([$cents, $to]);
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
}`,
    },
  ],

  tasks: [
    {
      title: "إضافة مستخدم وإرجاع الـ id",
      lang: "php",
      prompt: "<p>اكتب دالة <code>createUser(PDO $pdo, string $name, string $email): int</code> بتضيف صف في <code>users</code> (الأعمدة <code>name</code> و<code>email</code>) باستخدام prepared statement وترجع الـ id الجديد كـ <code>int</code>.</p>",
      examples: [
        { in: "createUser($pdo, 'Ali', 'ali@test.com')", out: "1" },
        { in: "createUser($pdo, 'Sara', 'sara@test.com')", out: "2" },
      ],
      starter: `<?php
declare(strict_types=1);

function createUser(PDO $pdo, string $name, string $email): int
{
    // your code
}`,
      hints: [
        "<code>INSERT INTO users (name, email) VALUES (:name, :email)</code> مع <code>prepare</code>.",
        "بعد الـ <code>execute</code>: <code>(int) $pdo->lastInsertId()</code>.",
      ],
      solution: `<?php
declare(strict_types=1);

function createUser(PDO $pdo, string $name, string $email): int
{
    $stmt = $pdo->prepare(
        'INSERT INTO users (name, email) VALUES (:name, :email)'
    );
    $stmt->execute(['name' => $name, 'email' => $email]);
    return (int) $pdo->lastInsertId();
}

$pdo = new PDO('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);
$pdo->exec('CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    balance_cents INTEGER NOT NULL DEFAULT 0
)');
echo createUser($pdo, 'Ali', 'ali@test.com'), "\\n";
echo createUser($pdo, 'Sara', 'sara@test.com'), "\\n";`,
      explain: "القيم بتتبعت عن طريق placeholders فمفيش injection حتى لو الاسم فيه quotes. <code>lastInsertId</code> بترجع string فبنعمل cast. لاحظ إن الدالة بتاخد الـ <code>PDO</code> كـ parameter (dependency injection) فتقدر تختبرها بـ SQLite.",
    },
    {
      title: "بحث بـ IN آمن",
      lang: "php",
      prompt: "<p>اكتب دالة <code>namesByIds(PDO $pdo, array $ids): array</code> بترجع list بأسماء المستخدمين اللي ids بتاعتهم في المصفوفة، مرتبة بالاسم. لو المصفوفة فاضية ارجع <code>[]</code> من غير ما تبعت استعلام. لازم تستخدم placeholders (متدمجش الأرقام في النص).</p>",
      examples: [
        { in: "namesByIds($pdo, [1, 3])", out: "['Ali', 'Mona']" },
        { in: "namesByIds($pdo, [])", out: "[]" },
      ],
      hints: [
        "ابنِ نص الـ placeholders: <code>implode(',', array_fill(0, count($ids), '?'))</code>.",
        "بعدها <code>execute(array_values($ids))</code> و<code>fetchAll(PDO::FETCH_COLUMN)</code>.",
      ],
      solution: `<?php
declare(strict_types=1);

function namesByIds(PDO $pdo, array $ids): array
{
    if ($ids === []) {
        return [];
    }
    $marks = implode(',', array_fill(0, count($ids), '?'));
    $stmt = $pdo->prepare(
        "SELECT name FROM users WHERE id IN ($marks) ORDER BY name"
    );
    $stmt->execute(array_values($ids));
    return $stmt->fetchAll(PDO::FETCH_COLUMN);
}

$pdo = new PDO('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);
$pdo->exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)');
$pdo->exec("INSERT INTO users (name) VALUES ('Ali'), ('Sara'), ('Mona')");
echo json_encode(namesByIds($pdo, [1, 3])), "\\n";
echo json_encode(namesByIds($pdo, [])), "\\n";`,
      explain: "الـ placeholders مش ممكن تتحط لقايمة كاملة، فبنولّد <code>?,?,?</code> بعدد العناصر. اللي بندمجه في النص هو علامات الاستفهام بس (من عندنا) مش القيم. الفاضية لازم تتفحص لأن <code>IN ()</code> خطأ SQL. في Laravel: <code>whereIn('id', $ids)</code> بتعمل ده.",
    },
    {
      title: "تحويل رصيد داخل transaction",
      lang: "php",
      prompt: "<p>اكتب <code>transfer(PDO $pdo, int $from, int $to, int $cents): void</code>. لازم تخصم من <code>$from</code> وتضيف لـ <code>$to</code> في <code>users.balance_cents</code> داخل transaction. لو رصيد <code>$from</code> أقل من المبلغ ارمي <code>RuntimeException</code> ومتسيبش أي تغيير في الداتابيز. حافظ على الخطأ لما ترميه (rollback ثم rethrow).</p>",
      examples: [
        { in: "transfer($pdo, 1, 2, 300) // الرصيد 1000 و 0", out: "1: 700 ، 2: 300" },
        { in: "transfer($pdo, 1, 2, 5000)", out: "RuntimeException، والأرصدة زي ما هي" },
      ],
      hints: [
        "الخصم بـ <code>UPDATE ... WHERE id = ? AND balance_cents >= ?</code> وافحص <code>rowCount()</code>.",
        "حط كل حاجة جوه <code>try</code>، وفي <code>catch (Throwable $e)</code> اعمل <code>rollBack()</code> وبعدها <code>throw $e</code>.",
      ],
      solution: `<?php
declare(strict_types=1);

function transfer(PDO $pdo, int $from, int $to, int $cents): void
{
    $pdo->beginTransaction();
    try {
        $debit = $pdo->prepare(
            'UPDATE users SET balance_cents = balance_cents - ?
             WHERE id = ? AND balance_cents >= ?'
        );
        $debit->execute([$cents, $from, $cents]);
        if ($debit->rowCount() !== 1) {
            throw new RuntimeException('Insufficient balance');
        }
        $credit = $pdo->prepare(
            'UPDATE users SET balance_cents = balance_cents + ?
             WHERE id = ?'
        );
        $credit->execute([$cents, $to]);
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
}

$pdo = new PDO('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);
$pdo->exec('CREATE TABLE users (id INTEGER PRIMARY KEY,
    balance_cents INTEGER NOT NULL)');
$pdo->exec('INSERT INTO users VALUES (1, 1000), (2, 0)');
transfer($pdo, 1, 2, 300);
try {
    transfer($pdo, 1, 2, 5000);
} catch (RuntimeException $e) {
    echo $e->getMessage(), "\\n";
}
$rows = $pdo->query('SELECT id, balance_cents FROM users')
    ->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows), "\\n";`,
      explain: "الشرط <code>balance_cents >= ?</code> في الـ UPDATE نفسه بيخلي الفحص والخصم عملية واحدة ذرية، فمفيش race condition بين «اقرا الرصيد» و«اخصم». والـ rollback + rethrow بيضمنوا إن مفيش تغيير نص-نص. في Laravel: <code>DB::transaction()</code> مع <code>lockForUpdate()</code> لو محتاج تقرا الأول.",
    },
  ],

  quiz: [
    {
      q: "إيه اللي بيحصل في السطرين دول؟",
      code: { lang: "php", src: `<?php
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
$stmt->execute(["x' OR '1'='1"]);` },
      options: [
        "بيرجع كل المستخدمين",
        "بيرمي PDOException بسبب الـ quote",
        "بيدور على مستخدم إيميله هو النص بالظبط، ومش هيلاقي",
        "بيحذف الجدول",
      ],
      answer: 2,
      why: "القيمة بتتبعت كبيانات مفصولة عن الاستعلام، فالـ quote مجرد حرف في الإيميل. دي فايدة الـ prepared statements.",
    },
    {
      q: "أنهي واحدة من دول <b>مينفعش</b> تتحط كـ placeholder (<code>?</code>)؟",
      options: [
        "اسم عمود في ORDER BY",
        "قيمة في WHERE",
        "قيمة في INSERT",
        "قيمة في UPDATE SET",
      ],
      answer: 0,
      why: "الـ placeholders للقيم بس. أسماء الأعمدة والجداول بتتحقق منها بـ allowlist وبتتدمج في النص.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
$pdo = new PDO('sqlite::memory:');
$pdo->exec('CREATE TABLE t (id INTEGER PRIMARY KEY AUTOINCREMENT, v TEXT)');
$s = $pdo->prepare('INSERT INTO t (v) VALUES (?)');
$s->execute(['a']);
$s->execute(['b']);
var_dump($pdo->lastInsertId());` },
      options: [
        "int(2)",
        "bool(false)",
        "string(1) \"1\"",
        "string(1) \"2\"",
      ],
      answer: 3,
      why: "<code>lastInsertId()</code> بترجع <code>string</code> دايما وبتدي id آخر INSERT فيطلع <code>\"2\"</code>. لو محتاجه رقم اعمل <code>(int)</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
$pdo = new PDO('sqlite::memory:');
$pdo->exec('CREATE TABLE t (id INTEGER PRIMARY KEY)');
$pdo->exec('INSERT INTO t VALUES (1), (2), (3)');
$s = $pdo->prepare('DELETE FROM t WHERE id > ?');
$s->execute([1]);
echo $s->rowCount();` },
      answer: ["2"],
      why: "<code>rowCount()</code> بترجع عدد الصفوف المتأثرة: الصفين 2 و3 اتحذفوا.",
    },
    {
      q: "إيه اللي بيحصل للبيانات بعد الكود ده؟",
      code: { lang: "php", src: `<?php
$pdo->beginTransaction();
$pdo->exec("INSERT INTO t (v) VALUES ('x')");
$pdo->rollBack();
$n = $pdo->query('SELECT COUNT(*) FROM t')->fetchColumn();` },
      options: [
        "الصف x بيتحفظ",
        "الصف x بيتلغي، و<code>$n</code> زي ما كان قبل الإضافة",
        "بيحصل PDOException",
        "الجدول بيتمسح",
      ],
      answer: 1,
      why: "الـ <code>rollBack()</code> بترجّع كل التغييرات من بعد <code>beginTransaction()</code>، فالإضافة بتتلغي.",
    },
    {
      q: "لو الـ DSN مضبوط وعايز أي خطأ SQL يظهر كـ exception، تحط أنهي option؟",
      options: [
        "<code>PDO::ATTR_AUTOCOMMIT => false</code>",
        "<code>PDO::ATTR_ERRMODE => PDO::ERRMODE_SILENT</code>",
        "<code>PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION</code>",
        "<code>PDO::ATTR_PERSISTENT => true</code>",
      ],
      answer: 2,
      why: "<code>ERRMODE_EXCEPTION</code> بترمي <code>PDOException</code>. SILENT بيسكت (وتضطر تفحص كل نتيجة بإيدك). الباقي مالوش علاقة بنوع الإبلاغ عن الخطأ.",
    },
    {
      q: "أنهي طريقة بتجيب كل أسماء المستخدمين كـ list بسيطة <code>['Ali','Sara']</code>؟",
      options: [
        "<code>$s->fetch(PDO::FETCH_COLUMN)</code>",
        "<code>$s->fetchAll(PDO::FETCH_ASSOC)</code>",
        "<code>$s->fetchColumn()</code>",
        "<code>$s->fetchAll(PDO::FETCH_COLUMN)</code>",
      ],
      answer: 3,
      why: "<code>fetchAll(PDO::FETCH_COLUMN)</code> بترجع العمود الأول من كل الصفوف كـ list. <code>fetchColumn()</code> بترجع قيمة واحدة بس، و<code>FETCH_ASSOC</code> بترجع arrays لكل صف.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
$pdo = new PDO('sqlite::memory:');
$pdo->exec('CREATE TABLE t (id INTEGER PRIMARY KEY, n TEXT)');
$s = $pdo->prepare('SELECT * FROM t WHERE id = ?');
$s->execute([5]);
var_dump($s->fetch());` },
      options: [
        "bool(false)",
        "NULL",
        "array(0) {}",
        "PDOException",
      ],
      answer: 0,
      why: "<code>fetch()</code> بترجع <code>false</code> لو مفيش صف (مش null ومش array فاضية). عشان كده بنفحص <code>=== false</code>. وفي Eloquent <code>first()</code> بترجع null.",
    },
    {
      q: "إيه أول حاجة تتأكد منها لو Eloquent query مدموج فيها input من المستخدم بـ <code>whereRaw</code>؟",
      options: [
        "إن الـ query بتتعمل cache",
        "إنها بتستخدم bindings: <code>whereRaw('x = ?', [$v])</code>",
        "إن الجدول فيه index",
        "إن الاتصال persistent",
      ],
      answer: 1,
      why: "الـ raw من غير bindings بيدمج النص في الاستعلام فيفتح باب SQL injection. مع bindings الـ PDO بيتولى الحماية. الباقي (cache وindex) متعلق بالأداء مش الأمان.",
    },
  ],
};
