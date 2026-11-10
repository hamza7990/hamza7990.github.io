window.LEVELS = window.LEVELS || {};
window.LEVELS["php/p4"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "من غير namespaces و Composer مفيش Laravel",
      en: "Why this matters",
      body: "<p>مشروع Laravel فيه مئات الكلاسات، وتحت منها (<code>vendor/</code>) آلاف الكلاسات من مكتبات تانية. اتنين مشاكل لازم تتحل: إزاي كلاسين بنفس الاسم (<code>User</code> بتاعك و<code>User</code> بتاع مكتبة) ميتخبطوش؟ وإزاي PHP تلاقي الملف بتاع الكلاس من غير ما تكتب <code>require</code> لكل ملف؟</p><p>الأولى بتحلها الـ <b>namespaces</b>، والتانية الـ <b>autoloading</b> اللي Composer بيجهزها.</p>",
      points: [
        "Composer هو الـ package manager بتاع PHP، زي pub في Dart و npm في JS.",
        "أي سؤال إنترفيو عن «إزاي Laravel بتلاقي الكلاس» إجابته: PSR-4 + Composer autoload.",
      ],
    },
    {
      title: "الـ namespace والـ use",
      en: "namespace and use",
      body: "<p>الـ namespace زي «مسار» للكلاس يمنع التصادم. بتعلنه في أول الملف بـ <code>namespace App\\Models;</code> والاسم الكامل للكلاس بيبقى <code>App\\Models\\User</code> (fully qualified). من ملف تاني بتستورده بـ <code>use</code> عشان تكتب الاسم القصير.</p>",
      codes: [
        {
          lang: "php",
          title: "app/Models/User.php",
          src: `<?php
declare(strict_types=1);

namespace App\\Models;

class User
{
    public function __construct(public string $name)
    {
    }
}`,
        },
        {
          lang: "php",
          title: "app/Services/Greeter.php",
          src: `<?php
declare(strict_types=1);

namespace App\\Services;

use App\\Models\\User;
use DateTimeImmutable as Date;

class Greeter
{
    public function greet(User $user): string
    {
        $year = (new Date('2026-05-01'))->format('Y');
        return "Hi {$user->name} ($year) " . \\strlen($user->name);
    }
}

// elsewhere: echo Greeter::class;  // App\\Services\\Greeter`,
          note: "جوه namespace، الأسماء بتتحل نسبة للـ namespace الحالي. الكلاسات الجاهزة زي <code>DateTimeImmutable</code> لازم تستوردها بـ <code>use</code> أو تكتب <code>\\DateTimeImmutable</code> (backslash في الأول = global). الدوال زي <code>strlen</code> بتتحل للـ global تلقائيا، والـ <code>\\</code> قدامها اختيارية (بتسرّع شوية).",
        },
      ],
      terms: [
        ["fully qualified name", "الاسم الكامل", "<code>\\App\\Models\\User</code>: الـ namespace والاسم، وبيبدأ بـ backslash."],
        ["use ... as", "alias", "بتسمي الكلاس باسم تاني لو فيه تصادم أو الاسم طويل."],
      ],
      pitfall: "نسيان <code>use</code> لكلاس زي <code>DateTime</code> جوه ملف فيه namespace بيطلّع <code>Class \"App\\Services\\DateTime\" not found</code>، لأن PHP بتدور عليه جوه الـ namespace الحالي مش في الـ global.",
    },
    {
      title: "الـ autoloading و PSR-4",
      en: "PSR-4 autoloading",
      body: "<p>الـ autoloader دالة PHP بتتنادى لما تستخدم كلاس لسه مش محمّل، وبتشيل الـ require اليدوي. معيار <b>PSR-4</b> بيربط prefix لـ namespace بمجلد: الباقي من الاسم الكامل بيتحول لمسار ملف. مثلا لو <code>App\\</code> ← <code>app/</code> يبقى <code>App\\Models\\User</code> ← <code>app/Models/User.php</code>.</p>",
      code: {
        lang: "php",
        title: "mini autoloader (what Composer generates, simplified)",
        src: `<?php
spl_autoload_register(function (string $class): void {
    $prefix = 'App\\\\';
    $baseDir = __DIR__ . '/app/';

    if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
        return;                       // not our namespace
    }
    $relative = substr($class, strlen($prefix));
    $file = $baseDir . str_replace('\\\\', '/', $relative) . '.php';

    if (is_file($file)) {
        require $file;
    }
});

$u = new App\\Models\\User('Hamza');   // loads app/Models/User.php`,
        note: "Composer بيولّد autoloader أقوى بكتير (بيدعم classmap و optimized)، لكن الفكرة هي هي. اسم الملف لازم يطابق اسم الكلاس بالحروف.",
      },
      focus: [{ label: "احفظها", text: "في Laravel: <code>App\\</code> ← <code>app/</code>، <code>Database\\Factories\\</code> ← <code>database/factories/</code>، و<code>Tests\\</code> ← <code>tests/</code>. كلاس في مكان غلط أو اسم ملف غلط = <code>Class not found</code>." }],
      interview: [
        { q: "إزاي PHP بتلاقي ملف الكلاس من غير require؟ اشرح PSR-4.", a: "بنسجّل دالة autoload بـ <code>spl_autoload_register</code>، وPHP بتناديها لما تلاقي كلاس مش معروف وتبعتلها اسمه الكامل. PSR-4 بيحدد القاعدة: prefix للـ namespace بيتربط بمجلد، والباقي من الاسم بيتحول لمسار (backslash لـ slash + <code>.php</code>). Composer بيولّد الـ autoloader ده في <code>vendor/autoload.php</code> من قسم <code>autoload</code> في composer.json، وLaravel بتعمله require في أول <code>public/index.php</code>." },
      ],
    },
    {
      title: "composer.json و composer.lock",
      en: "The two files",
      body: "<p><code>composer.json</code> بتكتبه إنت: بيقول المشروع محتاج إيه (الـ dependencies بنطاق إصدارات) وإزاي الـ autoload. <code>composer.lock</code> بيولّده Composer: بيسجّل <b>الإصدار الدقيق</b> اللي اتثبت لكل package (وكل dependencies بتاعتها) علشان أي جهاز يشتغل بنفس الإصدارات بالظبط.</p>",
      code: {
        lang: "json",
        title: "composer.json",
        src: `{
  "name": "acme/shop",
  "require": {
    "php": "^8.2",
    "laravel/framework": "^11.0"
  },
  "require-dev": {
    "phpunit/phpunit": "^11.0"
  },
  "autoload": {
    "psr-4": { "App\\\\": "app/" }
  },
  "autoload-dev": {
    "psr-4": { "Tests\\\\": "tests/" }
  }
}`,
        note: "<code>require</code> للي المشروع محتاجه وهو شغال (production). <code>require-dev</code> للأدوات اللي محتاجها وإنت بتطور أو بتختبر (PHPUnit، Pint) ومش بتتنزل في production. الـ backslash في JSON بيتكتب مرتين.",
      },
      interview: [
        { q: "إيه الفرق بين composer.json و composer.lock؟ وهل أعمل commit للـ lock؟", a: "<code>composer.json</code> بيحدد المطلوب بنطاقات (مثلا <code>^11.0</code>)، و<code>composer.lock</code> بيسجل الإصدارات الدقيقة اللي اتثبتت فعلا (مع hashes). في التطبيقات (زي Laravel) بعمل commit للـ lock عشان كل المطورين والسيرفر يشتغلوا على نفس الإصدارات بالظبط، وده بيخلي الـ deploy متوقع. في المكتبات اللي بتتوزع غالبا ما بنعملش commit للـ lock." },
      ],
    },
    {
      title: "رقم الإصدار والـ constraints",
      en: "Semantic versioning: ^ and ~",
      body: "<p>الإصدار بيبقى <code>MAJOR.MINOR.PATCH</code> (semver). MAJOR بيتغير لما فيه breaking change، MINOR لإضافات متوافقة، PATCH لإصلاح bugs. والـ constraints بتحدد النطاق المسموح:</p>",
      points: [
        "<code>^1.2.3</code> = <code>&gt;=1.2.3 &lt;2.0.0</code>: أي تحديث متوافق (الأشهر ومعظم الـ Laravel).",
        "<code>~1.2.3</code> = <code>&gt;=1.2.3 &lt;1.3.0</code>: تحديثات PATCH بس. و<code>~1.2</code> = <code>&gt;=1.2 &lt;2.0</code>.",
        "<code>^0.3.4</code> = <code>&gt;=0.3.4 &lt;0.4.0</code>: مع 0.x الـ MINOR بيتعامل كأنه MAJOR.",
        "<code>1.2.*</code> نطاق wildcard، و<code>1.5.0</code> إصدار ثابت، و<code>dev-main</code> فرع.",
      ],
      pitfall: "كتابة <code>\"*\"</code> أو <code>\"dev-master\"</code> في مشروع حقيقي بتخليه يتكسر فجأة لما يظهر إصدار جديد. استخدم <code>^</code> دايما واعتمد على الـ lock للثبات.",
    },
    {
      title: "install مقابل update",
      en: "Composer commands",
      code: {
        lang: "bash",
        src: `# a fresh clone: install exactly what composer.lock says
composer install

# add a package (updates composer.json and composer.lock)
composer require guzzlehttp/guzzle
composer require --dev phpunit/phpunit

# re-resolve versions within constraints and rewrite composer.lock
composer update
composer update vendor/package    # only one package

# production deploy
composer install --no-dev --optimize-autoloader

# after changing the "autoload" section or adding a class map
composer dump-autoload`,
        note: "<code>install</code> بيحترم الـ lock (لو مفيش lock بيحسب ويعمله). <code>update</code> بيتجاهل الإصدارات المثبتة ويحسب من جديد ضمن الـ constraints ويكتب lock جديد. الـ <code>vendor/</code> فولدر مولَّد: ما تعملش commit له (حطه في <code>.gitignore</code>).",
      },
      interview: [
        { q: "إيه الفرق بين <code>composer install</code> و <code>composer update</code>؟ وإمتى أستخدم كل واحد؟", a: "<code>install</code> بينزّل بالظبط الإصدارات اللي في <code>composer.lock</code> (ولو مفيش lock بيحل ويعمل واحد). بستخدمه في clone جديد وعلى السيرفر. <code>update</code> بيتجاهل الـ lock ويدوّر على أحدث إصدار يطابق الـ constraints في composer.json ويعدّل الـ lock. بستخدمه لما أقصد أحدّث الـ dependencies، وبعدها أختبر وأعمل commit للـ lock الجديد." },
        { q: "إيه وظيفة <code>composer dump-autoload</code>؟", a: "بيعيد توليد ملفات الـ autoload في <code>vendor/composer</code>. بنحتاجه لما نغيّر قسم autoload في composer.json أو نضيف ملفات في classmap أو helpers، أو لو الـ optimized autoloader (<code>-o</code>) في production. في PSR-4 العادي إضافة كلاس جديد في المسار الصح مبتحتاجش dump." },
      ],
    },
    {
      title: "Laravel بتستخدم ده كله إزاي",
      en: "How Laravel uses it",
      points: [
        "<code>public/index.php</code> بيعمل <code>require __DIR__.'/../vendor/autoload.php'</code>: ده الـ autoloader اللي Composer ولّده، ومن بعده أي كلاس يتلقى.",
        "<code>composer.json</code> في Laravel بيحط <code>\"App\\\\\": \"app/\"</code> فكل كلاس في <code>app/</code> بيتحمل تلقائي. الـ framework نفسه (<code>Illuminate\\...</code>) جاي من <code>laravel/framework</code> في vendor.",
        "<code>composer create-project laravel/laravel</code> بينزل الهيكل. الـ packages الإضافية (Sanctum, Livewire...) بتتثبت بـ <code>composer require</code> وبتتسجل تلقائي في Laravel بخاصية package auto-discovery.",
        "<code>php artisan make:model Post</code> بتعمل الملف <code>app/Models/Post.php</code> بـ <code>namespace App\\Models;</code> مطابق للمسار، ومتحتاجش dump-autoload.",
      ],
      code: {
        lang: "php",
        title: "app/Http/Controllers/PostController.php",
        src: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Post;
use Illuminate\\Http\\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        return Post::latest()->get();
    }
}`,
        note: "كل سطر <code>use</code> هنا بيتحل بالـ PSR-4: <code>App\\Models\\Post</code> من <code>app/</code> و<code>Illuminate\\Http\\Request</code> من <code>vendor/laravel/framework/</code>.",
      },
      interview: [
        { q: "في Laravel ظهر خطأ <code>Class \"App\\Models\\Poost\" not found</code>، تفكر إزاي؟", a: "أبدأ بالـ namespace والاسم: غالبا typo في الاسم في <code>use</code> أو الملف اسمه مش بيطابق اسم الكلاس بالحروف (PSR-4 حساس لحالة الحروف على Linux). بعدها أتأكد إن الملف في المسار اللي بيطابق الـ namespace، وإن الـ namespace مسجل في <code>autoload</code>. ولو ضفت قسم autoload جديد أو ملف في classmap أنادي <code>composer dump-autoload</code>." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: namespace و use",
      lang: "php",
      code: `<?php
declare(strict_types=1);

namespace App\\Services;

use DateTimeImmutable as Date;

class Clock
{
    public function year(): string
    {
        return (new Date('2026-05-01'))->format('Y');
    }
}

echo Clock::class, "\\n";
echo (new Clock())->year(), "\\n";`,
    },
    {
      title: "اكتب: autoloader مبسط",
      lang: "php",
      code: `<?php
spl_autoload_register(function (string $class): void {
    $prefix = 'App\\\\';
    $base = __DIR__ . '/app/';

    if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
        return;
    }
    $rel = substr($class, strlen($prefix));
    $file = $base . str_replace('\\\\', '/', $rel) . '.php';

    if (is_file($file)) {
        require $file;
    }
});`,
    },
    {
      title: "اكتب: composer.json",
      lang: "json",
      code: `{
  "name": "acme/shop",
  "require": {
    "php": "^8.2",
    "laravel/framework": "^11.0"
  },
  "require-dev": {
    "phpunit/phpunit": "^11.0"
  },
  "autoload": {
    "psr-4": { "App\\\\": "app/" }
  }
}`,
      note: "الـ backslash في JSON بيتكتب مرتين: <code>\"App\\\\\"</code> عشان الـ namespace هو <code>App\\</code>.",
    },
  ],

  tasks: [
    {
      title: "إيه نطاق الإصدارات؟",
      lang: "json",
      prompt: "<p>اكتب قسم <code>require</code> و<code>require-dev</code> في composer.json بحيث: PHP لا يقل عن 8.2 ويقبل أي 8.x، <code>laravel/framework</code> يقبل أي 11.x لكن مش 12، <code>monolog/monolog</code> يقبل patch updates بس من 3.5.0 (مش 3.6)، و<code>phpunit/phpunit</code> في require-dev ويقبل أي 11.x.</p>",
      examples: [
        { in: "monolog 3.5.0 constraint", out: "~3.5.0 (>=3.5.0 <3.6.0)" },
      ],
      hints: [
        "<code>^</code> للتحديثات المتوافقة، و<code>~</code> لما عايز تثبت الـ minor.",
        "<code>^8.2</code> = <code>&gt;=8.2 &lt;9.0</code>.",
      ],
      solution: `{
  "require": {
    "php": "^8.2",
    "laravel/framework": "^11.0",
    "monolog/monolog": "~3.5.0"
  },
  "require-dev": {
    "phpunit/phpunit": "^11.0"
  }
}`,
      explain: "<code>^11.0</code> = <code>&gt;=11.0.0 &lt;12.0.0</code>. <code>~3.5.0</code> = <code>&gt;=3.5.0 &lt;3.6.0</code> (patch بس). PHPUnit في <code>require-dev</code> لأنه مش محتاج في production، فبيتشال بـ <code>composer install --no-dev</code>.",
    },
    {
      title: "PSR-4 resolver",
      lang: "php",
      prompt: "<p>اكتب دالة <code>classToPath(string $class, string $prefix, string $baseDir): ?string</code>. لو اسم الكلاس مش بيبدأ بالـ <code>$prefix</code> ترجع <code>null</code>. غير كده ترجع مسار الملف: <code>$baseDir</code> + الباقي من الاسم (بعد الـ prefix) بعد استبدال <code>\\</code> بـ <code>/</code> + <code>.php</code>. ما تلمسش الـ file system.</p>",
      examples: [
        { in: "classToPath('App\\\\Models\\\\User', 'App\\\\', 'app/')", out: "app/Models/User.php" },
        { in: "classToPath('Other\\\\Thing', 'App\\\\', 'app/')", out: "null" },
      ],
      starter: `<?php
declare(strict_types=1);

function classToPath(
    string $class,
    string $prefix,
    string $baseDir
): ?string {
    // your code
}`,
      hints: [
        "<code>str_starts_with($class, $prefix)</code> بتفحص البداية (PHP 8).",
        "<code>substr($class, strlen($prefix))</code> بتاخد الباقي، و<code>str_replace('\\\\', '/', ...)</code> بتحوّل الفواصل.",
      ],
      solution: `<?php
declare(strict_types=1);

function classToPath(
    string $class,
    string $prefix,
    string $baseDir
): ?string {
    if (!str_starts_with($class, $prefix)) {
        return null;
    }
    $relative = substr($class, strlen($prefix));
    return $baseDir . str_replace('\\\\', '/', $relative) . '.php';
}

echo classToPath('App\\\\Models\\\\User', 'App\\\\', 'app/'), "\\n";
var_dump(classToPath('Other\\\\Thing', 'App\\\\', 'app/'));`,
      explain: "ده قلب PSR-4 بالظبط: prefix يتشال، backslash يبقى slash، و<code>.php</code> في الآخر. الـ autoloader الحقيقي بيعمل <code>require</code> للملف لو موجود. لاحظ إن النص <code>'\\\\'</code> في الكود هو backslash واحد.",
    },
  ],

  quiz: [
    {
      q: "لو <code>composer.json</code> فيه <code>\"App\\\\\": \"app/\"</code>، فين ملف الكلاس <code>App\\Services\\Pay</code>؟",
      options: [
        "<code>app/App/Services/Pay.php</code>",
        "<code>app/services/pay.php</code>",
        "<code>app/Services/Pay.php</code>",
        "<code>src/Services/Pay.php</code>",
      ],
      answer: 2,
      why: "الـ prefix <code>App\\</code> بيتشال، والباقي <code>Services\\Pay</code> بيتحول لـ <code>Services/Pay.php</code> تحت <code>app/</code>. والحروف الكبيرة والصغيرة مهمة على Linux.",
    },
    {
      q: "<code>^1.2.3</code> بتقبل أنهي إصدار؟",
      options: [
        "1.9.0",
        "1.1.9",
        "2.0.0",
        "1.2.2",
      ],
      answer: 0,
      why: "<code>^1.2.3</code> = <code>&gt;=1.2.3 &lt;2.0.0</code> فبتقبل 1.9.0. 2.0.0 خارج النطاق، و1.1.9 و1.2.2 أقدم من الحد الأدنى.",
    },
    {
      q: "<code>~1.2.3</code> بتقبل أنهي إصدار؟",
      options: [
        "1.3.0",
        "2.0.0",
        "1.9.0",
        "1.2.9",
      ],
      answer: 3,
      why: "<code>~1.2.3</code> = <code>&gt;=1.2.3 &lt;1.3.0</code> (patch بس). 1.2.9 جوه النطاق، و1.3.0 بره.",
    },
    {
      q: "عملت clone لمشروع Laravel وعايز نفس الإصدارات اللي الفريق شغال بيها بالظبط. تشغّل إيه؟",
      options: [
        "<code>composer update</code>",
        "<code>composer install</code>",
        "<code>composer dump-autoload</code>",
        "<code>composer require laravel/framework</code>",
      ],
      answer: 1,
      why: "<code>install</code> بيقرا <code>composer.lock</code> وبينزل الإصدارات المثبتة بالظبط. <code>update</code> هيحدّثهم ويغيّر الـ lock فتفقد التطابق مع الفريق.",
    },
    {
      q: "أنهي package المفروض يتحط في <code>require-dev</code>؟",
      options: ["laravel/framework", "guzzlehttp/guzzle (بتكلم بيها API في الكود)", "phpunit/phpunit", "monolog/monolog (الـ logging في production)"],
      answer: 2,
      why: "PHPUnit أداة اختبار بتتستخدم وقت التطوير بس، فبتتشال في production بـ <code>--no-dev</code>. الباقي بيتستخدم في الكود وهو شغال.",
    },
    {
      q: "الكود ده جوه ملف فيه <code>namespace App\\Services;</code> بيفشل بخطأ Class not found. ليه؟",
      code: { lang: "php", src: `<?php
namespace App\\Services;

class Clock
{
    public function now(): DateTime
    {
        return new DateTime();
    }
}

echo (new Clock())->now()->format('Y');` },
      options: [
        "لأن DateTime مش موجودة في PHP 8",
        "لأن الـ method لازم تكون static",
        "لأن الـ namespace لازم يكون في سطر بعد الـ class",
        "لأن PHP بتدور على App\\Services\\DateTime، والصح use DateTime أو \\DateTime",
      ],
      answer: 3,
      why: "جوه namespace، الاسم من غير backslash بيتحل نسبة للـ namespace الحالي. الكلاسات الـ global لازم تتستورد بـ <code>use DateTime;</code> أو تتكتب <code>\\DateTime</code>.",
    },
    {
      q: "إيه اللي بيعمل الـ require التلقائي للكلاسات في تطبيق Laravel؟",
      options: [
        "الـ autoloader اللي Composer ولّده في <code>vendor/autoload.php</code>",
        "كل كلاس بيعمل require لنفسه",
        "الـ artisan بيحمّل كل الملفات وقت الـ deploy",
        "الـ web server (Nginx)",
      ],
      answer: 0,
      why: "<code>public/index.php</code> بيعمل require لـ <code>vendor/autoload.php</code>، وده بيسجل autoloader PSR-4 مبني من قسم <code>autoload</code> في composer.json.",
    },
    {
      q: "أنهي ملف تعمل له commit في git عادة؟",
      options: [
        "<code>vendor/</code> بس",
        "<code>composer.lock</code> و <code>composer.json</code> من غير <code>vendor/</code>",
        "<code>vendor/</code> و <code>composer.json</code> من غير الـ lock",
        "ولا واحد منهم",
      ],
      answer: 1,
      why: "الـ lock بيثبّت الإصدارات للفريق، و<code>vendor/</code> بيتولد بـ <code>composer install</code> فبيتحط في <code>.gitignore</code>.",
    },
    {
      q: "إيه الفرق في المعنى بين <code>^0.3.4</code> و <code>^1.3.4</code>؟",
      options: [
        "مفيش فرق",
        "<code>^1.3.4</code> بتقبل 1.x و2.x",
        "<code>^0.3.4</code> بتقبل أي 0.x",
        "<code>^0.3.4</code> بتقبل لحد <code>&lt;0.4.0</code> فقط، و<code>^1.3.4</code> لحد <code>&lt;2.0.0</code>",
      ],
      answer: 3,
      why: "مع الإصدارات 0.x الـ MINOR بيتعامل كإنه breaking، فـ <code>^0.3.4</code> = <code>&gt;=0.3.4 &lt;0.4.0</code>. بينما <code>^1.3.4</code> = <code>&gt;=1.3.4 &lt;2.0.0</code>.",
    },
  ],
};
