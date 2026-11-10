window.LEVELS = window.LEVELS || {};
window.LEVELS["php/p1"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "PHP بتشتغل من الأول للآخر مع كل ريكويست",
      en: "The per-request model",
      body: "<p>PHP مش برنامج بيفضل شغال في الميموري زي Node أو تطبيق Flutter. مع كل HTTP request، الـ web server (Nginx أو Apache) بيشغّل سكريبت PHP، السكريبت بيرد، وبعدها <b>كل حاجة في الميموري بتتمسح</b>: المتغيرات، الـ objects، الاتصال بالداتابيز.</p><p>ده بيفسر حاجات كتير في Laravel: ليه الـ session محتاجة تتخزن في ملف أو داتابيز، وليه الـ cache محتاج Redis، وليه الـ queue شغالة في process منفصل.</p>",
      points: [
        "كل ريكويست بيبدأ نضيف: مفيش متغير بيعدّي من ريكويست للتاني غير عن طريق session أو داتابيز أو cache.",
        "Laravel كله (الـ container والـ routes والـ config) بيتبني من الصفر مع كل ريكويست. عشان كده فيه <code>php artisan config:cache</code> و OPcache.",
        "سؤال إنترفيو شائع: «إزاي PHP بتتعامل مع الريكويست؟». الإجابة في الشريحة دي.",
      ],
      interview: [
        { q: "إزاي PHP بتشتغل مع الـ web server، وإيه معنى إنها «share-nothing»؟", a: "الـ web server بيسلّم الريكويست لـ PHP (عن طريق PHP-FPM غالبا)، PHP بتشغّل السكريبت وبترجع الـ response، وبعدين الـ state بتاع الريكويست بيتمسح. «Share-nothing» معناها إن كل ريكويست مستقل عن اللي قبله، فأي حاجة عايز تفضل (مستخدم مسجل دخول، سلة مشتريات) لازم تتخزن برا الـ process: session أو داتابيز أو Redis." },
      ],
    },
    {
      title: "علامة البداية و strict_types",
      en: "<?php and declare(strict_types=1)",
      body: "<p>أي ملف PHP بيبدأ بـ <code>&lt;?php</code>. وفي ملفات الكلاسات بنسيب الـ closing tag <code>?&gt;</code> (بنشيلها) عشان مسافة زيادة بعدها متتبعتش للمتصفح.</p><p>السطر المهم بعدها: <code>declare(strict_types=1);</code>. من غيره PHP بتحاول «تصلّح» النوع بنفسها (coercion): لو الدالة عايزة <code>int</code> وإنت بعتّ النص <code>\"5\"</code> هتتحول لـ 5 بصمت. معاه، النوع الغلط بيرمي <code>TypeError</code>.</p>",
      code: {
        lang: "php",
        title: "strict.php",
        src: `<?php
declare(strict_types=1);

function double(int $n): int
{
    return $n * 2;
}

echo double(4), "\\n";      // 8
echo double("5");          // TypeError: must be of type int, string given`,
        note: "الـ <code>strict_types</code> بتأثر على الملف اللي اتكتبت فيه (على الاستدعاءات اللي في الملف ده)، ومش على الكود كله. لازم تكون أول statement في الملف.",
      },
      focus: [{ label: "احفظها", text: "اكتب <code>declare(strict_types=1);</code> في أول كل ملف جديد من كودك. ده بيمسك أخطاء الأنواع بدري بدل ما تتحول بصمت." }],
    },
    {
      title: "المتغيرات والأنواع الأساسية",
      en: "Variables and scalar types",
      body: "<p>المتغير في PHP بيبدأ بـ <code>$</code> وميتعرّفش بنوع: النوع بيتحدد من القيمة. الأنواع الأساسية (scalar): <code>int</code> و <code>float</code> و <code>string</code> و <code>bool</code>، وكمان <code>null</code> و <code>array</code>.</p>",
      code: {
        lang: "php",
        src: `<?php
$count = 3;          // int
$price = 99.5;       // float
$name = "Hamza";     // string
$ready = true;       // bool
$nothing = null;     // null

var_dump($count, $price, $ready);
echo gettype($name), "\\n";   // string
echo 7 / 2, "\\n";            // 3.5
echo intdiv(7, 2), "\\n";     // 3
echo 7 % 2, "\\n";            // 1`,
        note: "<code>var_dump</code> بتطبع النوع والقيمة (<code>int(3)</code> و <code>float(99.5)</code> و <code>bool(true)</code>) وهي أهم أداة debugging. القسمة <code>/</code> بترجع <code>int</code> لو القسمة بالظبط (<code>6 / 3</code> = 2) وإلا <code>float</code>؛ والقسمة الصحيحة بـ <code>intdiv</code>.",
      },
      terms: [
        ["scalar", "نوع بسيط", "int و float و string و bool: قيمة واحدة مش مجموعة."],
        ["type juggling", "تحويل الأنواع التلقائي", "PHP بتحول النوع لوحدها حسب السياق، وده مصدر مقارنات غريبة (هنشوفها في p5)."],
      ],
      pitfall: "الاسم حساس لحالة الحروف: <code>$name</code> غير <code>$Name</code>. لكن أسماء الدوال مش حساسة، وده مصدر لخبطة. التزم بنفس الكتابة دايما.",
    },
    {
      title: "تعريف الأنواع على الدوال",
      en: "Type declarations",
      body: "<p>PHP الحديثة بتخليك تحدد نوع كل parameter ونوع الإرجاع. ده بيخلي الكود يوثّق نفسه، والـ IDE يكمّل لك، والأخطاء تظهر مبكر.</p>",
      code: {
        lang: "php",
        src: `<?php
declare(strict_types=1);

function greet(string $name, ?string $title = null): string
{
    return $title === null ? "Hi $name" : "Hi $title $name";
}

function parseId(int|string $id): int
{
    return (int) $id;
}

function log_it(string $msg): void
{
    echo $msg, "\\n";
}

echo greet("Hamza"), "\\n";          // Hi Hamza
echo greet("Hamza", "Eng."), "\\n";  // Hi Eng. Hamza
echo parseId("42") + 1, "\\n";       // 43`,
        note: "<code>?string</code> معناها <code>string</code> أو <code>null</code> (اختصار <code>string|null</code>). <code>int|string</code> union type: أي واحد من النوعين. <code>void</code> يعني الدالة مبترجعش قيمة.",
      },
      points: [
        "الـ union types (<code>int|string</code>) موجودة من PHP 8.0.",
        "<code>mixed</code> معناها أي نوع، استخدمها في أضيق الحدود زي <code>dynamic</code> في Dart.",
        "<code>?int</code> مش معناها «اختياري»: لسه لازم تبعت قيمة، ممكن تكون <code>null</code>. الاختياري هو اللي ليه default.",
      ],
      interview: [
        { q: "إيه الفرق بين <code>?string $x</code> و <code>string $x = null</code>؟", a: "<code>?string $x</code> بيقبل string أو null بس لازم تبعت الـ argument. <code>string $x = null</code> (في الأنواع القديمة) كانت بتخلي الـ parameter nullable ضمنيا واختياري، وده <b>deprecated من PHP 8.4</b>. الصح: <code>?string $x = null</code> لو عايزه nullable واختياري مع بعض." },
      ],
    },
    {
      title: "النصوص: الفرق بين العلامتين",
      en: "Strings",
      body: "<p>الـ single quote <code>'...'</code> نص حرفي: مفيش interpolation ولا escape غير <code>\\'</code> و <code>\\\\</code>. الـ double quote <code>\"...\"</code> بيفسّر المتغيرات وأحرف زي <code>\\n</code>. الربط بنقطة <code>.</code> (مش <code>+</code>).</p>",
      code: {
        lang: "php",
        src: `<?php
$name = "Hamza";
$user = ['city' => 'Cairo'];

echo 'Hi $name\\n', "\\n";            // Hi $name\\n  (literal)
echo "Hi $name\\n";                  // Hi Hamza
echo "City: {$user['city']}\\n";     // City: Cairo
echo "Hi " . $name . "\\n";          // concatenation

echo strlen("hello"), "\\n";                  // 5
echo strtoupper("abc"), "\\n";                // ABC
echo str_contains("laravel", "ave"), "\\n";   // 1
echo substr("framework", 0, 5), "\\n";        // frame
echo str_replace("a", "o", "banana"), "\\n";  // bonono
echo trim("  hi  "), "|\\n";                  // hi|
echo implode(", ", ['a', 'b']), "\\n";        // a, b
print_r(explode(",", "x,y,z"));              // Array of 3`,
        note: "الـ <code>str_contains</code> و <code>str_starts_with</code> و <code>str_ends_with</code> دخلوا في PHP 8.0. لو النص فيه عربي استخدم <code>mb_strlen</code> و <code>mb_substr</code> بدل <code>strlen</code> و <code>substr</code>، لأن الأخيرة بتعد bytes.",
      },
      pitfall: "<code>strlen('مرحبا')</code> مش بترجع 5 لأن كل حرف عربي بياخد byte-ين (UTF-8). استخدم <code>mb_strlen</code> مع أي نص ممكن يبقى فيه عربي.",
    },
    {
      title: "المصفوفات: قايمة وماب في نفس النوع",
      en: "Arrays",
      body: "<p>الـ <code>array</code> في PHP نوع واحد بيشتغل كـ list وكـ map: ordered map من key لـ value. الـ key إما integer أو string. بنكتبها بالأقواس المربعة <code>[]</code> (الطريقة القديمة <code>array()</code> مبقتش لازمة).</p>",
      code: {
        lang: "php",
        src: `<?php
$nums = [10, 20, 30];            // keys 0, 1, 2
$user = ['name' => 'Hamza', 'age' => 22];

$nums[] = 40;                    // append
$user['city'] = 'Cairo';         // add a key

echo $nums[0], " ", $user['name'], "\\n";   // 10 Hamza
echo count($nums), "\\n";                  // 4
echo isset($user['email']) ? "yes" : "no", "\\n";  // no
echo $user['email'] ?? 'none', "\\n";      // none

foreach ($nums as $n) {
    echo $n, " ";
}
echo "\\n";

foreach ($user as $key => $value) {
    echo "$key=$value\\n";
}`,
        note: "قراءة مفتاح مش موجود (<code>$user['email']</code>) بتطلّع Warning: Undefined array key. استخدم <code>??</code> أو <code>isset</code> قبلها.",
      },
      terms: [
        ["indexed array", "مصفوفة بأرقام", "المفاتيح 0 و1 و2... بالترتيب."],
        ["associative array", "مصفوفة بمفاتيح نصية", "زي الـ map أو الـ JSON object: <code>['name' => 'Hamza']</code>."],
      ],
      interview: [
        { q: "إيه الفرق بين indexed و associative array في PHP؟", a: "الاتنين نفس النوع <code>array</code>. الـ indexed مفاتيحها أرقام تلقائية من 0، والـ associative مفاتيحها نصوص بنحددها بنفسنا زي <code>['id' => 5]</code>. ويقدروا يتخلطوا في نفس المصفوفة. وPHP بتحافظ على ترتيب الإدخال. وده السبب إن بيانات JSON بتتحول لـ associative arrays بسهولة بـ <code>json_decode($json, true)</code>." },
      ],
    },
    {
      title: "المصفوفات بتتنسخ مع التعيين",
      en: "Arrays have value semantics",
      body: "<p>عكس Dart وJS، في PHP لما تعمل <code>$b = $a</code> وإنت بتتعامل مع array، بتاخد <b>نسخة مستقلة</b> (value semantics). تعديل <code>$b</code> مبيأثرش في <code>$a</code>. (من جوه PHP بتأجل النسخ الفعلي لحد أول تعديل، copy-on-write، فمفيش تكلفة وانت بتقرا بس.) أما الـ objects فبتتعدّى بالـ handle: النسختين يشاوروا على نفس الأوبجكت.</p>",
      code: {
        lang: "php",
        src: `<?php
$a = [1, 2, 3];
$b = $a;
$b[] = 4;
echo count($a), " ", count($b), "\\n";   // 3 4

function addOne(array $list): array
{
    $list[] = 1;
    return $list;
}
$c = addOne($a);
echo count($a), " ", count($c), "\\n";   // 3 4

$o1 = new stdClass();
$o1->v = 1;
$o2 = $o1;
$o2->v = 2;
echo $o1->v, "\\n";                       // 2`,
        note: "الدالة اللي بتاخد array بتشتغل على نسخة، فلازم ترجّعها (أو تاخدها بـ reference، وده في p2). الـ <code>stdClass</code> بيتصرف زي أي object: النسخة بتشاور على نفسه.",
      },
      focus: [{ label: "الفرق المهم", text: "array = قيمة تتنسخ. object = handle بيتشارك. لو عايز نسخة من object استخدم <code>clone</code>." }],
      interview: [
        { q: "لو بعتّ array لدالة وعدلتها جوه الدالة، هل الأصل بيتغير؟", a: "لأ. الـ arrays بتتبعت by value، فالدالة بتشتغل على نسخة (بتتنسخ فعليا عند أول تعديل بس، copy-on-write). لو عايز الأصل يتغير تاخده بـ reference <code>array &amp;$list</code>، أو الأفضل ترجّع الـ array الجديدة. الـ objects بالعكس: بتتبعت كـ handle فتعديلها جوه الدالة بيظهر برا." },
      ],
    },
    {
      title: "دوال المصفوفات والنصوص الأكتر استخدامًا",
      en: "Everyday helpers",
      code: {
        lang: "php",
        src: `<?php
$tags = ['php', 'laravel', 'sql'];

echo count($tags), "\\n";                        // 3
echo implode('|', $tags), "\\n";                 // php|laravel|sql
echo in_array('sql', $tags, true) ? 'y' : 'n', "\\n";  // y
array_push($tags, 'redis');
$last = array_pop($tags);                       // redis
echo $last, " ", count($tags), "\\n";            // redis 3

$user = ['name' => 'Hamza', 'role' => 'dev'];
print_r(array_keys($user));                     // name, role
echo array_key_exists('role', $user) ? 'y' : 'n', "\\n";  // y
echo json_encode($user), "\\n";    // {"name":"Hamza","role":"dev"}

echo sprintf("%05.1f|%s|%d", 3.14159, "ok", 42), "\\n";  // 003.1|ok|42`,
        note: "الـ <code>json_encode</code> و <code>json_decode</code> هما الجسر بين المصفوفات والـ JSON. الـ <code>sprintf</code> بتنسّق النص زي <code>printf</code> بس بترجعه بدل ما تطبعه.",
      },
      pitfall: "<code>in_array('1e1', ['10'])</code> من غير الـ flag الثالث قد ترجع <code>true</code> بسبب المقارنة المرنة. دايما مرر <code>true</code> كـ argument تالت (هنشرحها في p2 و p5).",
      interview: [
        { q: "إيه الفرق بين <code>isset</code> و <code>array_key_exists</code>؟", a: "<code>isset($a['k'])</code> بترجع <code>false</code> لو المفتاح مش موجود <b>أو</b> قيمته <code>null</code>. <code>array_key_exists('k', $a)</code> بترجع <code>true</code> لو المفتاح موجود حتى لو قيمته <code>null</code>. استخدم <code>isset</code> أو <code>??</code> في الغالب، و<code>array_key_exists</code> لما الفرق بين «مش موجود» و«null» مهم." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: دالة بأنواع",
      lang: "php",
      code: `<?php
declare(strict_types=1);

function greet(string $name, ?string $title = null): string
{
    return $title === null ? "Hi $name" : "Hi $title $name";
}

echo greet("Hamza"), "\\n";
echo greet("Hamza", "Eng."), "\\n";`,
    },
    {
      title: "اكتب: مصفوفات و foreach",
      lang: "php",
      code: `<?php
$user = ['name' => 'Hamza', 'age' => 22];
$nums = [10, 20, 30];

$nums[] = 40;
$user['city'] = 'Cairo';

foreach ($user as $key => $value) {
    echo "$key=$value\\n";
}

echo count($nums), "\\n";
echo $user['email'] ?? 'none', "\\n";`,
    },
    {
      title: "اكتب: دالة تجمع وتنسق",
      lang: "php",
      code: `<?php
declare(strict_types=1);

function total(array $prices): float
{
    $sum = 0.0;
    foreach ($prices as $price) {
        $sum += $price;
    }
    return $sum;
}

$cart = ['pen' => 2.5, 'book' => 10.0];
$sum = total($cart);
echo sprintf("Total: %.2f", $sum), "\\n";
echo count($cart), " items\\n";`,
      note: "خد بالك من <code>\\n</code> جوه الـ double quotes: بتتفسّر لسطر جديد. الـ <code>sprintf</code> بتنسق الرقم لخانتين عشريتين.",
    },
  ],

  tasks: [
    {
      title: "تحية بنوع صريح",
      lang: "php",
      prompt: "<p>اكتب دالة <code>fullName</code> بتاخد <code>string $first</code> و <code>?string $last = null</code> وترجع <code>string</code>. لو <code>$last</code> موجود (مش null ومش فاضي) ترجع الاسمين بمسافة بينهم، وإلا ترجع الاسم الأول لوحده. استخدم <code>declare(strict_types=1)</code>.</p>",
      examples: [
        { in: "fullName('Hamza', 'Saied')", out: "Hamza Saied" },
        { in: "fullName('Hamza')", out: "Hamza" },
        { in: "fullName('Hamza', '')", out: "Hamza" },
      ],
      starter: `<?php
declare(strict_types=1);

function fullName(string $first, ?string $last = null): string
{
    // your code
}`,
      hints: [
        "الحالة اللي فيها <code>$last</code> قيمته null أو نص فاضي هي نفسها: ارجع <code>$first</code>.",
        "فيه اختصار: <code>$last === null || $last === ''</code>.",
      ],
      solution: `<?php
declare(strict_types=1);

function fullName(string $first, ?string $last = null): string
{
    if ($last === null || $last === '') {
        return $first;
    }
    return "$first $last";
}

echo fullName('Hamza', 'Saied'), "\\n";
echo fullName('Hamza'), "\\n";
echo fullName('Hamza', ''), "\\n";`,
      explain: "بنفحص <code>null</code> و<code>''</code> صراحة بـ <code>===</code> بدل <code>empty()</code>، لأن <code>empty('0')</code> بترجع true وده هيعمل bug لو الاسم الأخير <code>'0'</code> (هنوضحها في p5). الـ interpolation <code>\"$first $last\"</code> بتبني النص.",
    },
    {
      title: "إحصائيات من مصفوفة أرقام",
      lang: "php",
      prompt: "<p>اكتب دالة <code>stats</code> بتاخد <code>array $nums</code> (أرقام) وترجع associative array فيها المفاتيح <code>count</code> و <code>sum</code> و <code>max</code>. لو المصفوفة فاضية ارجع <code>['count' => 0, 'sum' => 0, 'max' => null]</code>. اكتبها بـ <code>foreach</code> من غير <code>array_sum</code> و <code>max</code>.</p>",
      examples: [
        { in: "stats([4, 9, 2])", out: "['count' => 3, 'sum' => 15, 'max' => 9]" },
        { in: "stats([])", out: "['count' => 0, 'sum' => 0, 'max' => null]" },
      ],
      hints: [
        "عالج المصفوفة الفاضية الأول وارجع منها بدري.",
        "ابدأ بـ <code>$max = $nums[0]</code> بعد ما تتأكد إنها مش فاضية، وقارن كل رقم بيه جوه الـ loop.",
      ],
      solution: `<?php
declare(strict_types=1);

function stats(array $nums): array
{
    if ($nums === []) {
        return ['count' => 0, 'sum' => 0, 'max' => null];
    }
    $sum = 0;
    $max = $nums[array_key_first($nums)];
    foreach ($nums as $n) {
        $sum += $n;
        if ($n > $max) {
            $max = $n;
        }
    }
    return ['count' => count($nums), 'sum' => $sum, 'max' => $max];
}

print_r(stats([4, 9, 2]));`,
      explain: "استخدمنا <code>array_key_first</code> بدل <code>$nums[0]</code> عشان لو المصفوفة مفاتيحها مش بتبدأ من صفر الكود يفضل صح. التعقيد O(n). والمصفوفة اتبعتت by value فمفيش خطر إننا نعدل الأصل.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
$a = [1, 2, 3];
$b = $a;
$b[] = 4;
echo count($a);` },
      answer: ["3"],
      why: "الـ arrays بتتنسخ مع التعيين (value semantics). <code>$b</code> نسخة مستقلة، فإضافة عنصر ليها مبتأثرش في <code>$a</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
$name = "Hamza";
echo 'Hi $name';` },
      options: [
        "Hi Hamza",
        "Hi",
        "Hi $name",
        "خطأ",
      ],
      answer: 2,
      why: "الـ single quote نص حرفي ومبيفسّرش المتغيرات. بالـ double quotes كان هيطبع <code>Hi Hamza</code>.",
    },
    {
      q: "إيه اللي بيحصل هنا؟",
      code: { lang: "php", src: `<?php
declare(strict_types=1);

function half(int $n): int
{
    return intdiv($n, 2);
}

echo half("8");` },
      options: [
        "TypeError",
        "بيطبع 0",
        "بيطبع 4",
        "Warning وبيكمل",
      ],
      answer: 0,
      why: "مع <code>strict_types=1</code> النص <code>\"8\"</code> مش بيتحول تلقائي لـ int فبيترمي <code>TypeError</code>. من غير الـ declare كانت هتتحول وتطبع 4.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
$user = ['name' => 'Hamza'];
echo $user['email'] ?? 'none';` },
      answer: ["none"],
      why: "المفتاح <code>email</code> مش موجود فالـ <code>??</code> بترجع القيمة البديلة من غير ما تطلّع Warning.",
    },
    {
      q: "إيه معنى <code>?int $x</code> في الـ parameter؟",
      options: [
        "الـ argument اختياري ومش لازم تبعته",
        "الـ argument ممكن يكون أي نوع",
        "الـ argument بيتحول لـ int تلقائي دايما",
        "الـ argument لازم يتبعت، وقيمته int أو null",
      ],
      answer: 3,
      why: "<code>?int</code> اختصار <code>int|null</code>. اختياري معناه ليه default (<code>= null</code>)، وده شيء تاني.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
echo 7 / 2, "|", intdiv(7, 2), "|", 7 % 2;` },
      options: ["3|3|1", "3.5|3|1", "3.5|3.5|1", "3|3.5|1"],
      answer: 1,
      why: "<code>/</code> قسمة عادية بترجع <code>3.5</code>، <code>intdiv</code> قسمة صحيحة <code>3</code>، و<code>%</code> الباقي <code>1</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
$o1 = new stdClass();
$o1->v = 1;
$o2 = $o1;
$o2->v = 2;
echo $o1->v;` },
      answer: ["2"],
      why: "الـ objects بتتعيّن كـ handle: <code>$o1</code> و <code>$o2</code> يشاوروا على نفس الأوبجكت. عكس الـ arrays اللي بتتنسخ.",
    },
    {
      q: "أنهي سطر بيطبع <code>City: Cairo</code> صح؟ (<code>$user = ['city' => 'Cairo'];</code>)",
      options: [
        "<code>echo \"City: $user['city']\";</code>",
        "<code>echo 'City: {$user[\"city\"]}';</code>",
        "<code>echo \"City: {$user['city']}\";</code>",
        "<code>echo \"City: \" + $user['city'];</code>",
      ],
      answer: 2,
      why: "الأقواس المعقوصة <code>{$...}</code> بتخلي PHP تفسّر التعبير كله جوه الـ double quotes. الـ single quote مبيفسّرش، و<code>+</code> مش للنصوص (الربط بنقطة <code>.</code>)، والاختيار الأول بيدّي parse error لأن <code>'city'</code> بين quotes جوه النص.",
    },
    {
      q: "ليه نستخدم <code>mb_strlen</code> بدل <code>strlen</code> مع نص عربي؟",
      options: [
        "<code>strlen</code> أبطأ",
        "<code>mb_strlen</code> بتشيل المسافات",
        "<code>strlen</code> مش بتشتغل مع النصوص الطويلة",
        "<code>strlen</code> بتعد الـ bytes، والحرف العربي في UTF-8 أكتر من byte",
      ],
      answer: 3,
      why: "<code>strlen</code> بتعد bytes مش حروف. الحرف العربي بياخد 2 bytes في UTF-8 فالرقم يطلع أكبر من عدد الحروف. <code>mb_strlen</code> بتعد الحروف الحقيقية.",
    },
  ],
};
