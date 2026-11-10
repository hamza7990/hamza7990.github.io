window.LEVELS = window.LEVELS || {};
window.LEVELS["php/p2"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "الدوال هي أساس كود Laravel الحديث",
      en: "Functions as values",
      body: "<p>Laravel مليان closures: <code>Route::get('/', function () {...})</code>، و<code>$users->map(fn ($u) => ...)</code>، و<code>Collection::filter</code>. لو فاهم إن الدالة ممكن تتخزن في متغير وتتبعت كـ argument، نص كود Laravel هيبقى مفهوم.</p>",
      points: [
        "الدالة العادية بتتعرف بـ <code>function</code> ولها اسم، وبتتنادى بالاسم.",
        "الـ closure دالة من غير اسم بتتخزن في متغير أو تتبعت لدالة تانية.",
        "دوال المصفوفات (<code>array_map</code> و<code>array_filter</code>...) بتاخد دالة كـ callback.",
      ],
    },
    {
      title: "الـ parameters: default و named",
      en: "Default and named arguments",
      body: "<p>الـ parameter ممكن ياخد قيمة افتراضية. ومن PHP 8.0 تقدر تبعت الـ arguments بالاسم (<b>named arguments</b>) وبأي ترتيب، وده بيفيد لما الدالة فيها parameters كتير أو boolean غامضة.</p>",
      code: {
        lang: "php",
        src: `<?php
declare(strict_types=1);

function makeUrl(
    string $path,
    bool $secure = true,
    int $port = 443,
): string {
    $scheme = $secure ? 'https' : 'http';
    return "$scheme://example.com:$port/$path";
}

echo makeUrl('home'), "\\n";
echo makeUrl('home', false, 80), "\\n";
echo makeUrl('home', port: 8080), "\\n";
echo makeUrl(port: 9000, path: 'api'), "\\n";`,
        note: "<code>makeUrl('home', port: 8080)</code> بتسيب <code>secure</code> على الافتراضي. الـ named arguments بتخلي الاستدعاء مقروء: <code>setActive(true)</code> غامضة، لكن <code>setActive(notify: true)</code> واضحة.",
      },
      pitfall: "حط الـ parameters اللي ليها default <b>بعد</b> اللي مالهاش. العكس (default وبعده parameter إجباري) بقى deprecated من PHP 8.0. والـ named arguments مرتبطة بأسماء الـ parameters، فتغيير اسم parameter في مكتبة ممكن يكسر اللي بيستخدموها بالاسم.",
    },
    {
      title: "Variadics و spread",
      en: "...$args and the spread operator",
      body: "<p>تلات نقط <code>...</code> ليها استخدامين: في تعريف الدالة بتجمّع باقي الـ arguments في array (variadic)، وفي الاستدعاء بتفرد array لـ arguments منفصلة (spread). كمان بتدمج arrays: <code>[...$a, ...$b]</code>.</p>",
      code: {
        lang: "php",
        src: `<?php
function sum(int ...$nums): int
{
    return array_sum($nums);
}

echo sum(1, 2, 3), "\\n";         // 6
$list = [4, 5, 6];
echo sum(...$list), "\\n";        // 15

$a = [1, 2];
$b = [3, 4];
$all = [...$a, ...$b, 5];
echo implode(",", $all), "\\n";   // 1,2,3,4,5

$defaults = ['color' => 'red', 'size' => 1];
$opts = [...$defaults, 'size' => 3];
echo $opts['color'], $opts['size'], "\\n";   // red3`,
        note: "الـ spread على arrays بمفاتيح نصية شغال من PHP 8.1 (قبلها كان للمفاتيح الرقمية بس). المفتاح اللي بييجي بعد بيكسب.",
      },
    },
    {
      title: "الـ reference: تعديل الأصل",
      en: "Passing by reference (&)",
      body: "<p>الأصل إن الـ arguments بتتبعت <b>by value</b>. لو حطيت <code>&amp;</code> قبل الـ parameter، الدالة بتشتغل على المتغير الأصلي نفسه. نادر في الكود الحديث، لكنه موجود في دوال زي <code>sort</code> و<code>preg_match</code> اللي بتعدل في مكانها.</p>",
      code: {
        lang: "php",
        src: `<?php
function addItem(array &$cart, string $item): void
{
    $cart[] = $item;
}

$cart = ['pen'];
addItem($cart, 'book');
echo count($cart), "\\n";     // 2

$nums = [3, 1, 2];
sort($nums);                 // sorts in place, returns true
echo implode(",", $nums), "\\n";   // 1,2,3`,
        note: "الأوضح غالبا إن الدالة ترجّع الـ array الجديدة بدل ما تعدل الأصل، عشان الكود يبقى أسهل في الفهم والاختبار.",
      },
      pitfall: "الـ <code>foreach ($arr as &$v)</code> بتسيب <code>$v</code> reference لآخر عنصر، وأي <code>foreach</code> بعدها بنفس الاسم هيبوّظ المصفوفة. لو استخدمتها اعمل <code>unset($v)</code> بعد اللوب.",
    },
    {
      title: "الـ closures والـ use",
      en: "Closures and arrow functions",
      body: "<p>الـ closure عادية مش بتشوف المتغيرات اللي برا، فلازم تقول لها أنهي متغيرات تلتقطها بـ <code>use</code> (by value). الـ <b>arrow function</b> <code>fn</code> أقصر: بتلتقط كل متغير بتستخدمه من النطاق الخارجي تلقائيا بالقيمة، وجسمها تعبير واحد بيترجع.</p>",
      code: {
        lang: "php",
        src: `<?php
$rate = 0.14;

$withTax = function (float $price) use ($rate): float {
    return $price * (1 + $rate);
};
echo $withTax(100), "\\n";            // 114

$withTax2 = fn (float $price): float => $price * (1 + $rate);
echo $withTax2(100), "\\n";           // 114

$count = 0;
$inc = function () use (&$count) {
    $count++;
};
$inc();
$inc();
echo $count, "\\n";                   // 2

$bad = fn () => $count++;             // changes a private copy
$bad();
echo $count, "\\n";                   // 2`,
        note: "الـ <code>use ($rate)</code> بتاخد نسخة وقت تعريف الـ closure. <code>use (&amp;$count)</code> بتاخد reference فالتعديل بيظهر برا. الـ arrow function مبتقدرش تعدل المتغير الخارجي.",
      },
      terms: [
        ["closure", "دالة بدون اسم بتلتقط متغيرات", "كائن من نوع <code>Closure</code> بيتخزن في متغير ويتبعت."],
        ["arrow function", "دالة سهمية", "<code>fn ($x) => تعبير</code> بتلتقط المتغيرات الخارجية by value تلقائيا."],
      ],
      interview: [
        { q: "إيه الفرق بين closure عادية و arrow function في PHP؟", a: "الـ closure العادية (<code>function () use ($x) {}</code>) لازم تحدد المتغيرات الملتقطة صراحة بـ <code>use</code>، وجسمها ممكن يكون كذا statement. الـ arrow function (<code>fn ($v) => $v * $x</code>) بتلتقط تلقائيا المتغيرات المستخدمة من النطاق الأب <b>by value</b>، وجسمها تعبير واحد بيترجع، فمينفعش تعدل بيها متغير برا. بستخدم <code>fn</code> للـ callbacks القصيرة والـ closure لما محتاج statements أو reference." },
      ],
    },
    {
      title: "الـ callable وتمرير الدوال",
      en: "Callables",
      body: "<p>أي مكان بيستنى <code>callable</code> تقدر تبعتله: closure، أو اسم دالة كنص <code>'strtoupper'</code>، أو method كـ array <code>[$obj, 'method']</code>، أو static <code>[Class::class, 'method']</code>. وبصيغة first-class callable (من PHP 8.1) تكتب <code>strtoupper(...)</code> وتاخد closure.</p>",
      code: {
        lang: "php",
        src: `<?php
function apply(callable $fn, array $items): array
{
    $out = [];
    foreach ($items as $item) {
        $out[] = $fn($item);
    }
    return $out;
}

echo implode(",", apply('strtoupper', ['a', 'b'])), "\\n";   // A,B
echo implode(",", apply(fn ($n) => $n * 2, [1, 2])), "\\n";  // 2,4

$upper = strtoupper(...);        // first-class callable (8.1)
echo $upper('php'), "\\n";        // PHP`,
      },
    },
    {
      title: "array_map و array_filter و array_reduce",
      en: "map, filter, reduce",
      body: "<p>التلاتة بياخدوا callback. <code>array_map</code> بتحول كل عنصر. <code>array_filter</code> بتسيب العناصر اللي الـ callback ترجع لها true، و<b>بتحافظ على المفاتيح الأصلية</b>. <code>array_reduce</code> بتختزل المصفوفة لقيمة واحدة.</p>",
      code: {
        lang: "php",
        src: `<?php
$nums = [1, 2, 3, 4, 5, 6];

$squares = array_map(fn ($n) => $n * $n, $nums);
echo implode(",", $squares), "\\n";           // 1,4,9,16,25,36

$even = array_filter($nums, fn ($n) => $n % 2 === 0);
print_r($even);                              // keys 1, 3, 5 kept
echo implode(",", array_values($even)), "\\n";   // 2,4,6

$sum = array_reduce($nums, fn ($carry, $n) => $carry + $n, 0);
echo $sum, "\\n";                              // 21

$users = [['n' => 'A', 'age' => 20], ['n' => 'B', 'age' => 30]];
echo implode(",", array_column($users, 'n')), "\\n";   // A,B
echo json_encode(array_keys(['x' => 1, 'y' => 2])), "\\n";  // ["x","y"]`,
        note: "نتيجة <code>array_filter</code> مفاتيحها <code>[1 =&gt; 2, 3 =&gt; 4, 5 =&gt; 6]</code> مش 0,1,2. لو طلعتها لـ JSON هتبقى object مش list، عشان كده بنلفها بـ <code>array_values</code>.",
      },
      pitfall: "نسيان <code>array_values</code> بعد <code>array_filter</code> هو من أشهر الـ bugs: الـ API بيرجع <code>{\"1\":2,\"3\":4}</code> بدل <code>[2,4]</code>. وكمان <code>array_filter($arr)</code> من غير callback بتشيل كل القيم الـ falsy (0 و'' و'0' و null و false).",
      interview: [
        { q: "إيه اللي لازم تاخد بالك منه في <code>array_filter</code>؟", a: "إنها بتحافظ على المفاتيح الأصلية، فبعد الفلترة ممكن تلاقي فجوات في الأرقام (1, 3, 5). لو محتاج list مرقمة من 0 (خصوصا قبل <code>json_encode</code>) تلف النتيجة بـ <code>array_values</code>. وكمان من غير callback بتشيل كل القيم الـ falsy زي 0 والنص الفاضي." },
      ],
    },
    {
      title: "الترتيب بـ usort وعامل المركبة",
      en: "usort and <=>",
      body: "<p><code>usort</code> بترتب array بدالة مقارنة بتكتبها إنت. الدالة لازم ترجع رقم سالب أو صفر أو موجب. العامل <code>&lt;=&gt;</code> (spaceship) بيعمل ده بالظبط: بيرجع <code>-1</code> أو <code>0</code> أو <code>1</code>. <code>usort</code> بتعدل الـ array في مكانها وبترجع true، وبتعيد ترقيم المفاتيح.</p>",
      code: {
        lang: "php",
        src: `<?php
echo 1 <=> 2, 2 <=> 2, 3 <=> 2, "\\n";   // -101

$users = [
    ['name' => 'Sara', 'age' => 30],
    ['name' => 'Ali', 'age' => 25],
    ['name' => 'Mona', 'age' => 30],
];

usort($users, fn ($a, $b) => $a['age'] <=> $b['age']);
echo implode(",", array_column($users, 'name')), "\\n";  // Ali,Sara,Mona

usort($users, fn ($a, $b) => [$b['age'], $a['name']]
    <=> [$a['age'], $b['name']]);
echo implode(",", array_column($users, 'name')), "\\n";  // Mona,Sara,Ali`,
        note: "مقارنة array بـ array بـ <code>&lt;=&gt;</code> بتقارن عنصر عنصر، وده حل أنيق لترتيب بأكتر من معيار. ترتيب <code>sort</code> في PHP 8.0+ مستقر (stable): العناصر المتساوية بتحافظ على ترتيبها الأصلي.",
      },
      interview: [
        { q: "إزاي ترتب array of arrays حسب حقل معين؟", a: "<code>usort($rows, fn ($a, $b) => $a['age'] &lt;=&gt; $b['age']);</code>. الـ <code>&lt;=&gt;</code> بترجع -1 أو 0 أو 1. للترتيب التنازلي بنبدّل الطرفين. وهي بتعدل الـ array نفسها. من PHP 8.0 الترتيب stable. في Laravel ده بيتعمل بـ <code>$collection->sortBy('age')</code>." },
      ],
    },
    {
      title: "array_merge و + و compact/extract",
      en: "Merging arrays and a warning",
      code: {
        lang: "php",
        src: `<?php
$a = ['x' => 1, 'y' => 2];
$b = ['y' => 9, 'z' => 3];

print_r(array_merge($a, $b));   // x=1, y=9, z=3  (later wins)
print_r($a + $b);               // x=1, y=2, z=3  (left wins)

print_r(array_merge([1, 2], [3]));   // 1, 2, 3  (renumbered)
print_r([1, 2] + [8, 9, 7]);         // 1, 2, 7  (same keys: left wins)

echo in_array('1e1', ['10']) ? 'yes' : 'no', "\\n";        // yes
echo in_array('1e1', ['10'], true) ? 'yes' : 'no', "\\n";  // no

$name = 'Hamza';
$age = 22;
$data = compact('name', 'age');   // ['name' => 'Hamza', 'age' => 22]
print_r($data);`,
        note: "<code>array_merge</code> بالمفاتيح النصية: القيمة الأخيرة بتكسب، وبالمفاتيح الرقمية بتعيد الترقيم. العامل <code>+</code> بيحتفظ بالمفتاح الأول ومبيعيدش ترقيم.",
      },
      pitfall: "<code>extract($_POST)</code> بيحوّل مفاتيح الـ input لمتغيرات، وده يخلي المستخدم يكتب فوق أي متغير في الكود (variable injection)، ويخلي الكود صعب التتبع. ما تستخدمهاش على بيانات جاية من برا. <code>compact</code> أقل خطورة (بتبني array من متغيرات موجودة عندك)، بس الـ IDE مش بتتتبع الأسماء اللي فيها لأنها نصوص.",
      interview: [
        { q: "إيه الفرق بين <code>array_merge($a, $b)</code> و <code>$a + $b</code>؟", a: "مع المفاتيح النصية المتكررة: <code>array_merge</code> بيكسب فيها الـ array التانية، و<code>+</code> بيحتفظ بقيمة الأولى. مع المفاتيح الرقمية: <code>array_merge</code> بيعيد ترقيمها وبيضم الكل، بينما <code>+</code> بياخد من التانية بس المفاتيح الرقمية اللي مش موجودة في الأولى. عشان كده مع defaults بنكتب <code>[...$defaults, ...$overrides]</code> أو <code>array_merge($defaults, $overrides)</code>." },
        { q: "ليه تمرر <code>true</code> كـ argument تالت لـ <code>in_array</code>؟", a: "من غيره المقارنة <code>==</code> المرنة، فـ <code>in_array('1e1', ['10'])</code> بترجع true لأن الاتنين رقمين متساويين. مع <code>true</code> المقارنة <code>===</code> بالنوع والقيمة. دايما بمررها إلا لو محتاج فعلا المرونة." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: default و named",
      lang: "php",
      code: `<?php
declare(strict_types=1);

function makeUrl(string $path, bool $secure = true): string
{
    $scheme = $secure ? 'https' : 'http';
    return "$scheme://example.com/$path";
}

echo makeUrl('home'), "\\n";
echo makeUrl(path: 'api', secure: false), "\\n";`,
    },
    {
      title: "اكتب: closure و arrow function",
      lang: "php",
      code: `<?php
$rate = 0.14;

$withTax = function (float $price) use ($rate): float {
    return $price * (1 + $rate);
};

$double = fn (int $n): int => $n * 2;

echo $withTax(100), "\\n";
echo $double(21), "\\n";`,
    },
    {
      title: "اكتب: map و filter و reduce",
      lang: "php",
      code: `<?php
$nums = [1, 2, 3, 4, 5, 6];

$even = array_filter($nums, fn ($n) => $n % 2 === 0);
$even = array_values($even);

$squares = array_map(fn ($n) => $n * $n, $even);

$total = array_reduce(
    $squares,
    fn ($carry, $n) => $carry + $n,
    0
);

echo implode(",", $squares), "\\n";
echo $total, "\\n";`,
    },
  ],

  tasks: [
    {
      title: "مجموع بـ variadic",
      lang: "php",
      prompt: "<p>اكتب دالة <code>average</code> بتاخد أي عدد من الأرقام عن طريق <code>float ...$nums</code> وترجع <code>float</code> هو المتوسط. لو مفيش أرقام ارجع <code>0.0</code>.</p>",
      examples: [
        { in: "average(2, 4, 6)", out: "4" },
        { in: "average()", out: "0" },
        { in: "average(...[1, 2])", out: "1.5" },
      ],
      starter: `<?php
declare(strict_types=1);

function average(float ...$nums): float
{
    // your code
}`,
      hints: [
        "جوه الدالة <code>$nums</code> هو array عادي. افحص لو فاضي بـ <code>count</code> أو <code>=== []</code>.",
        "<code>array_sum($nums) / count($nums)</code>.",
      ],
      solution: `<?php
declare(strict_types=1);

function average(float ...$nums): float
{
    if ($nums === []) {
        return 0.0;
    }
    return array_sum($nums) / count($nums);
}

echo average(2, 4, 6), "\\n";
echo average(), "\\n";
echo average(...[1, 2]), "\\n";`,
      explain: "الـ <code>...$nums</code> بتجمّع الـ arguments في array. بنحمي من القسمة على صفر بفحص الفاضي الأول (في PHP 8 القسمة على صفر بترمي <code>DivisionByZeroError</code>). حتى مع <code>strict_types</code> الـ <code>int</code> بيتقبل في parameter من نوع <code>float</code> (ده الاستثناء الوحيد المسموح).",
    },
    {
      title: "فلترة وترتيب منتجات",
      lang: "php",
      prompt: "<p>اكتب دالة <code>cheapNames</code> بتاخد <code>array $products</code> (كل عنصر <code>['name' => string, 'price' => int]</code>) و<code>int $max</code>. ترجع <b>list مرقمة من 0</b> بأسماء المنتجات اللي سعرها <code>&lt;= $max</code>، مرتبة من الأرخص للأغلى. استخدم <code>array_filter</code> و<code>usort</code> و<code>array_map</code>.</p>",
      examples: [
        { in: "cheapNames([['name'=>'A','price'=>50],['name'=>'B','price'=>10],['name'=>'C','price'=>99]], 60)", out: "['B', 'A']" },
      ],
      hints: [
        "فلتر الأول، وبعدها <code>array_values</code> لأن المفاتيح بتتحافظ.",
        "<code>usort($list, fn ($a, $b) => $a['price'] &lt;=&gt; $b['price'])</code> وبعدين <code>array_map</code> على الأسماء.",
      ],
      solution: `<?php
declare(strict_types=1);

function cheapNames(array $products, int $max): array
{
    $cheap = array_values(
        array_filter($products, fn ($p) => $p['price'] <= $max)
    );
    usort($cheap, fn ($a, $b) => $a['price'] <=> $b['price']);
    return array_map(fn ($p) => $p['name'], $cheap);
}

$items = [
    ['name' => 'A', 'price' => 50],
    ['name' => 'B', 'price' => 10],
    ['name' => 'C', 'price' => 99],
];
echo json_encode(cheapNames($items, 60)), "\\n";`,
      explain: "الترتيب: filter ثم usort ثم map. الـ <code>usort</code> بتعدل الـ array المحلية (النسخة) فمبتأثرش على الأصل. والنتيجة list مرقمة من 0 لأن <code>array_values</code> و<code>usort</code> بيعيدوا الترقيم، و<code>array_map</code> على array واحدة بتحافظ على المفاتيح اللي اتبعتتلها.",
    },
    {
      title: "عداد بـ closure",
      lang: "php",
      prompt: "<p>اكتب دالة <code>makeCounter</code> بتاخد <code>int $start = 0</code> وترجع closure. كل مرة تنادي الـ closure بترجع القيمة الحالية وتزودها بواحد. كل counter مستقل عن التاني.</p>",
      examples: [
        { in: "$c = makeCounter(5); $c(); $c();", out: "5 ثم 6" },
      ],
      hints: [
        "الـ closure محتاجة تعدل متغير برا نطاقها: يعني <code>use (&amp;$n)</code>.",
        "عرّف <code>$n = $start;</code> جوه <code>makeCounter</code> وارجع الـ closure.",
      ],
      solution: `<?php
declare(strict_types=1);

function makeCounter(int $start = 0): Closure
{
    $n = $start;
    return function () use (&$n): int {
        return $n++;
    };
}

$a = makeCounter(5);
$b = makeCounter();
echo $a(), $a(), $b(), "\\n";   // 560`,
      explain: "كل نداء لـ <code>makeCounter</code> بيعمل <code>$n</code> جديد، والـ closure بتحتفظ بـ reference ليه. <code>$n++</code> بترجع القيمة قبل الزيادة. الـ arrow function مكنتش هتنفع هنا لأنها بتلتقط by value.",
    },
  ],

  quiz: [
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
$r = array_filter([1, 2, 3, 4], fn ($n) => $n % 2 === 0);
echo json_encode($r);` },
      options: ["[2,4]", "{\"1\":2,\"3\":4}", "[1,3]", "{\"0\":2,\"1\":4}"],
      answer: 1,
      why: "<code>array_filter</code> بتحافظ على المفاتيح الأصلية (1 و3)، فالـ array مش list متتالية وبتتحول لـ JSON object. للحصول على <code>[2,4]</code> لف النتيجة بـ <code>array_values</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
$a = ['x' => 1, 'y' => 2];
$b = ['y' => 9];
echo ($a + $b)['y'], array_merge($a, $b)['y'];` },
      answer: ["29"],
      why: "<code>+</code> بتحتفظ بقيمة الـ array الأولى (2)، و<code>array_merge</code> القيمة التانية بتكسب (9).",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
$count = 0;
$bad = fn () => $count++;
$bad();
$bad();
echo $count;` },
      answer: ["0"],
      why: "الـ arrow function بتلتقط <code>$count</code> by value، فبتزوّد نسخة خاصة بيها وتتمسح. المتغير الأصلي يفضل 0. محتاج <code>function () use (&amp;$count)</code> لو عايز تعدله.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
echo 5 <=> 9, 9 <=> 9, 9 <=> 5;` },
      options: ["-101", "0-11", "-1-11", "1-10"],
      answer: 0,
      why: "<code>&lt;=&gt;</code> بترجع -1 لو الشمال أصغر، 0 لو متساويين، 1 لو أكبر. فيطلع <code>-1</code> ثم <code>0</code> ثم <code>1</code> متلزقين: <code>-101</code>.",
    },
    {
      q: "أنهي استدعاء صح لدالة <code>f(string $a, int $b = 1, bool $c = false)</code> لما تحب تغير <code>$c</code> بس؟",
      options: [
        "<code>f('x', , true)</code>",
        "<code>f('x', c: true)</code>",
        "<code>f('x', $c = true)</code>",
        "<code>f('x', null, true)</code>",
      ],
      answer: 1,
      why: "الـ named arguments (PHP 8.0+) بتخليك تتخطى الـ parameters الافتراضية. الأول صيغة غلط، والتالت بيعمل تعيين لمتغير ويبعته كـ <code>$b</code> (والنوع غلط)، والرابع <code>null</code> مش int.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
function sum(int ...$n): int { return array_sum($n); }
$list = [1, 2, 3];
echo sum(...$list, ...[10]);` },
      answer: ["16"],
      why: "الـ spread بيفرد القايمتين كـ arguments: 1 و2 و3 و10، والـ variadic بيجمّعهم والمجموع 16.",
    },
    {
      q: "ليه <code>extract($_POST)</code> فكرة سيئة؟",
      options: [
        "لأنها بطيئة جدا",
        "لأن المستخدم يقدر يخلق أو يكتب فوق أي متغير في الكود بمفاتيح الـ input",
        "لأنها بتشتغل مع الـ arrays الرقمية بس",
        "لأنها بتحذف الـ superglobal",
      ],
      answer: 1,
      why: "المفاتيح جاية من المستخدم، فهو يتحكم في أسماء المتغيرات (مثلا <code>isAdmin</code>) وده variable injection. السرعة مش المشكلة.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
$nums = [3, 1, 2];
usort($nums, fn ($a, $b) => $b <=> $a);
echo implode(",", $nums);` },
      options: ["1,2,3", "3,2,1", "3,1,2", "2,1,3"],
      answer: 1,
      why: "بدّلنا الطرفين في المقارنة (<code>$b &lt;=&gt; $a</code>) فالترتيب تنازلي: 3,2,1.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "php", src: `<?php
echo array_reduce([1, 2, 3], fn ($c, $n) => $c * $n, 10);` },
      answer: ["60"],
      why: "الـ initial value هو 10، والـ callback بتضرب: 10*1=10 ثم 10*2=20 ثم 20*3=60.",
    },
  ],
};
