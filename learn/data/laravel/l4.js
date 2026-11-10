window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l4"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "شكل الداتابيز كود بيتعمل له commit",
      en: "Why migrations, seeders and factories",
      body: "<p>بدل ما كل مطور يعدّل الداتابيز بإيده من أداة (phpMyAdmin مثلا) وبعدين محدش يعرف مين غيّر إيه، الـ <b>migration</b> بتكتب التغيير كملف PHP بيتحفظ في git ويتنفذ بنفس الترتيب عند كل المطورين وعلى السيرفر. الـ <b>seeder</b> بيملا الداتابيز ببيانات ثابتة (قايمة مدن، مستخدم admin). والـ <b>factory</b> بتولّد بيانات عشوائية واقعية للتجربة والاختبارات.</p>",
      points: [
        "الـ migration = نسخة (version) للداتابيز: <code>up()</code> بتطبّق و<code>down()</code> بتعكس.",
        "Laravel بتسجّل الـ migrations اللي اتنفذت في جدول <code>migrations</code> فمبتنفذش نفس الملف مرتين.",
        "السؤال الكلاسيكي في الإنترفيو: «ليه مبنعدّلش migration اتنفذت؟» وإجابته في الشريحة 6.",
      ],
    },
    {
      title: "تشريح الـ migration",
      en: "Anatomy of a migration",
      body: "<p>الأمر <code>php artisan make:migration create_offices_table</code> بيولّد ملف في <code>database/migrations</code> اسمه بتاريخ ووقت. الاسم هو اللي بيحدد ترتيب التنفيذ، والكلمة <code>create_..._table</code> بتخلي Laravel تولّد لك الكود الأساسي بـ <code>Schema::create</code>.</p>",
      code: {
        lang: "php",
        title: "database/migrations/2026_01_01_000001_create_offices_table.php",
        src: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offices', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('city')->index();
            $table->string('license_no')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offices');
    }
};`,
        note: "الـ migration كلاس مجهول (<code>return new class</code>) فيه <code>up</code> و<code>down</code>. جدول المكاتب بيتعمل في <code>up</code> وبيتمسح في <code>down</code>. الـ <code>id()</code> بتعمل عمود <code>id</code> رقمي auto-increment ومفتاح أساسي. والـ <code>timestamps()</code> بتعمل <code>created_at</code> و<code>updated_at</code>.",
      },
      terms: [
        ["migration", "ملف تغيير الداتابيز", "كود PHP بيوصف تغيير في الـ schema وبيتنفذ بترتيب اسمه."],
        ["Blueprint", "وصف الجدول", "الـ object اللي بتضيف عليه الأعمدة والفهارس جوه closure الـ Schema."],
      ],
    },
    {
      title: "أنواع الأعمدة والمعدّلات",
      en: "Column types and modifiers",
      body: "<p>كل عمود = نوع + معدّلات (modifiers) بتتسلسل. أهم ما تحفظه:</p>",
      code: {
        lang: "php",
        title: "create_listings_table (up)",
        src: `<?php

Schema::create('listings', function (Blueprint $table) {
    $table->id();
    $table->foreignId('office_id')->constrained()->cascadeOnDelete();
    $table->string('title');                          // VARCHAR(255)
    $table->text('description')->nullable();          // long text, may be NULL
    $table->unsignedBigInteger('price');              // never negative
    $table->string('status')->default('draft');
    $table->unsignedTinyInteger('bedrooms')->default(0);
    $table->boolean('is_featured')->default(false);
    $table->timestamp('published_at')->nullable();
    $table->json('amenities')->nullable();
    $table->softDeletes();                            // deleted_at, nullable
    $table->timestamps();

    $table->index(['status', 'price']);               // composite index
});`,
        note: "<code>nullable()</code> يسمح بـ NULL. <code>default(x)</code> قيمة لو ما اتبعتتش. <code>index()</code> يسرّع البحث على العمود لكن يبطّئ الكتابة شوية. <code>unique()</code> يمنع التكرار (وبيعمل index كمان). الفهرس المركب <code>['status','price']</code> مفيد للـ queries اللي بتفلتر بالاتنين.",
      },
      pitfall: "الأسعار والفلوس: استخدم أعداد صحيحة (هللات أو قروش) أو <code>decimal</code>، مش <code>float</code> عشان أخطاء التقريب. واحذر من الـ <code>string</code> للحاجات الطويلة: الـ <code>string</code> محدود بـ 255 حرف افتراضيا، والـ <code>text</code> للنصوص الطويلة.",
      interview: [
        { q: "إيه الفرق بين <code>nullable()</code> و <code>default()</code>؟ ومتى تستخدم <code>index()</code>؟", a: "<code>nullable()</code> بيسمح للعمود إنه يكون NULL، و<code>default('draft')</code> بيحدد القيمة اللي تتخزن لو الـ INSERT ما حددش قيمة. الاتنين ممكن يتجمعوا. الـ <code>index()</code> بحطه على الأعمدة اللي بتتفلتر أو بتترتب بيها كتير (<code>where</code> و<code>orderBy</code> و<code>join</code>)، مع ملاحظة إنه بيزود حجم الجدول ويبطّئ الكتابة، فمش بحطه على كل عمود." },
      ],
    },
    {
      title: "المفاتيح الأجنبية: constrained و cascadeOnDelete",
      en: "Foreign keys",
      body: "<p>الـ foreign key بيربط عمود في جدول بـ id في جدول تاني، والداتابيز نفسها بتمنع قيم مالهاش وجود. <code>foreignId('office_id')->constrained()</code> بتعمل عمود <code>unsignedBigInteger</code> + قيد مفتاح أجنبي على جدول <code>offices</code> (الاسم بيتخمّن من اسم العمود).</p>",
      code: {
        lang: "php",
        src: `<?php

// listings.office_id -> offices.id ; delete an office = delete its listings
$table->foreignId('office_id')->constrained()->cascadeOnDelete();

// inquiries.user_id may be NULL ; delete a user = keep the inquiry, user_id becomes NULL
$table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

// forbid deleting an office that still has listings
$table->foreignId('office_id')->constrained()->restrictOnDelete();

// the table name can't be guessed: say it
$table->foreignId('owner_id')->constrained('users');`,
        note: "جربت: مسح مكتب بيمسح إعلاناته معاه (cascade)، ومسح مستخدم بيخلي <code>office_id</code> في جدول المستخدمين NULL (nullOnDelete)، وإضافة إعلان بـ <code>office_id</code> مش موجود بيرمي <code>QueryException</code>.",
      },
      pitfall: "الـ <code>cascadeOnDelete</code> بتحصل في الداتابيز نفسها، يعني الـ model events والـ soft deletes مبتشتغلش: الإعلانات بتتمسح فعليا مش soft. وكمان الجدول الأب لازم يتعمل قبل الابن (ترتيب الملفات بالتاريخ)، وإلا الـ migration هتفشل.",
      interview: [
        { q: "إيه الفرق بين <code>cascadeOnDelete</code> و <code>nullOnDelete</code> و <code>restrictOnDelete</code>؟", a: "ده بيحدد اللي بيحصل للسجلات الأبناء لما الأب يتمسح. <code>cascadeOnDelete</code> بيمسح الأبناء معاه. <code>nullOnDelete</code> بيحط NULL في عمود المفتاح الأجنبي (فالعمود لازم يكون <code>nullable</code>). <code>restrictOnDelete</code> بيمنع مسح الأب لو له أبناء. الاختيار بيعتمد على المعنى: إعلان من غير مكتب ملوش معنى فبنعمل cascade، واستفسار من مستخدم اتمسح لسه مفيد فبنعمل null." },
      ],
    },
    {
      title: "تشغيل الـ migrations: migrate و rollback و fresh",
      en: "Running and reversing migrations",
      body: "<p>أوامر الـ migrations اللي لازم تعرف الفرق بينها بدقة:</p>",
      code: {
        lang: "bash",
        src: `php artisan migrate                 # run only the pending migrations
php artisan migrate:status          # which ran, which are pending
php artisan migrate:rollback        # undo the LAST batch (calls down())
php artisan migrate:rollback --step=1   # undo just the last migration
php artisan migrate:reset           # undo ALL migrations (down() of each)
php artisan migrate:refresh         # reset, then migrate again
php artisan migrate:fresh           # DROP all tables, then migrate (no down())
php artisan migrate:fresh --seed    # same, then run the seeders`,
        note: "الـ \"batch\" هو مجموعة الـ migrations اللي اتنفذت في أمر <code>migrate</code> واحد. <code>rollback</code> بيرجع آخر batch. <code>fresh</code> بيمسح الجداول كلها مباشرة من غير ما ينفذ <code>down()</code>، وده أسرع وبيشتغل حتى لو <code>down()</code> ناقصة.",
      },
      pitfall: "<code>migrate:fresh</code> و<code>migrate:refresh</code> و<code>migrate:reset</code> بيمسحوا الداتا. في الـ production Laravel بتسألك تأكيد (أو تحتاج <code>--force</code>)، لكن الأحسن متشغّلهمش على داتابيز فيها بيانات حقيقية أبدا. على السيرفر الأمر الوحيد المقبول هو <code>php artisan migrate --force</code>.",
      interview: [
        { q: "إيه الفرق بين <code>migrate:rollback</code> و <code>migrate:refresh</code> و <code>migrate:fresh</code>؟", a: "<code>rollback</code> بيرجع آخر batch فقط عن طريق <code>down()</code>. <code>refresh</code> بيرجع كل الـ migrations (<code>down()</code> لكلهم) وبعدين يشغّلهم من جديد. <code>fresh</code> بيعمل drop لكل الجداول مباشرة من غير <code>down()</code> وبعدين يشغّل <code>migrate</code>. التلاتة بيمسحوا البيانات اللي في الجداول المتأثرة، فمنستخدمش <code>refresh</code>/<code>fresh</code> إلا في بيئة التطوير." },
      ],
    },
    {
      title: "ليه مبنعدّلش migration اتنفذت؟ وإزاي نضيف عمود؟",
      en: "Never edit a migration that already ran",
      body: "<p>الـ migration اللي اتنفذت على داتابيز مشتركة (staging أو production أو جهاز زميلك) Laravel سجّلتها خلاص في جدول <code>migrations</code> ومش هتنفذها تاني. لو عدّلت الملف بعد كده، التعديل ده مش هيوصل لأي داتابيز اتنفذ عليها الأصل، وهتبقى الأجهزة مختلفة عن بعض ومحدش يعرف ليه. الحل: <b>migration جديدة</b> بتعمل التغيير.</p>",
      code: {
        lang: "php",
        title: "php artisan make:migration add_area_to_listings_table --table=listings",
        src: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->unsignedInteger('area_sqm')->nullable()->after('bedrooms');
        });
    }

    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn('area_sqm');
        });
    }
};`,
        note: "جدول موجود → <code>Schema::table</code> مش <code>create</code>. العمود <code>nullable</code> لأن الجدول فيه صفوف حالية ومفيش قيمة ليها. الـ <code>down()</code> بتعكس بالظبط. لتغيير نوع عمود موجود بنستخدم <code>->change()</code>، وفي Laravel 11 لازم تكتب كل المعدّلات اللي عايز تحتفظ بيها (زي <code>nullable</code>) في تعريف التغيير وإلا اتشالت. جربت <code>string('city', 100)->nullable()->change()</code> وشغّلت.",
      },
      focus: [{ label: "القاعدة", text: "مفيش تعديل على migration اتنفذت على أي داتابيز مشتركة. لو لسه ما اتنفذتش إلا على جهازك وحدك: عادي تعدّلها وتعمل <code>migrate:fresh</code> في التطوير." }],
      interview: [
        { q: "ليه ممنوع تعدّل migration اتنفذت على داتابيز مشتركة؟ وتعمل إيه بدل كده؟", a: "لأن Laravel بتسجّل اسم الملف في جدول <code>migrations</code> وبتعتبره اتنفذ، فمش هتنفذه تاني. التعديل هيفضل في الكود بس ومش هيوصل للداتابيز اللي اتنفذ عليها، فيحصل drift بين البيئات والكود بيفترض أعمدة مش موجودة. بنعمل migration جديدة (مثلا <code>add_area_to_listings_table</code> بـ <code>Schema::table</code>) وبنكتب <code>down()</code> بتعكسها." },
      ],
    },
    {
      title: "الـ Seeders",
      en: "Seeders",
      body: "<p>الـ seeder كلاس فيه <code>run()</code> بيدخل بيانات. <code>DatabaseSeeder</code> هو نقطة الدخول وبينادي على الباقي بـ <code>$this->call</code>. بتشغّله بـ <code>php artisan db:seed</code> أو مع الـ migrate بـ <code>--seed</code>.</p>",
      code: {
        lang: "php",
        title: "database/seeders",
        src: `<?php

namespace Database\\Seeders;

use App\\Models\\Office;
use App\\Models\\Tag;
use App\\Models\\User;
use Illuminate\\Database\\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call(TagSeeder::class);

        Office::factory()
            ->count(3)
            ->hasListings(4)
            ->create();
    }
}

class TagSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['villa', 'apartment', 'sea-view'] as $name) {
            Tag::firstOrCreate(['name' => $name]);
        }
    }
}`,
        note: "الـ <code>firstOrCreate</code> بتخلي الـ seeder آمن لو اتشغّل مرتين (مفيش تكرار). جربت <code>php artisan db:seed --class=TagSeeder</code> بعد ما كانوا موجودين والعدد فضل 3. كل seeder في ملف لوحده (جمعتهم هنا للشرح بس).",
      },
      pitfall: "الـ seeder اللي بيعمل <code>create</code> عادي هيكرر الصفوف كل ما تشغّله. للبيانات المرجعية (مدن، أدوار) استخدم <code>firstOrCreate</code>/<code>updateOrCreate</code>. وبيانات التجربة العشوائية متتحطش في الـ production.",
      interview: [
        { q: "إيه الفرق بين الـ seeder والـ factory؟", a: "الـ factory بتعرّف إزاي تولّد موديل واحد ببيانات عشوائية (مع states وعلاقات)، وبتتستخدم في الـ seeders والاختبارات. الـ seeder هو اللي بينفذ فعليا إدخال البيانات في الداتابيز، وممكن يستخدم factories (بيانات تجريبية) أو إدخال ثابت (بيانات مرجعية زي الأدوار والمدن)." },
      ],
    },
    {
      title: "الـ Factories: بيانات واقعية بسطر",
      en: "Model factories and states",
      body: "<p>الـ factory كلاس فيه <code>definition()</code> بيرجّع القيم الافتراضية للموديل (بـ <code>fake()</code> اللي بتولّد أسماء وجمل وأرقام). الموديل لازم يستخدم trait اسمه <code>HasFactory</code>. الـ <b>state</b> هو method بتغيّر جزء من القيم لحالة معينة (زي «منشور»).</p>",
      code: {
        lang: "php",
        title: "database/factories/ListingFactory.php",
        src: `<?php

namespace Database\\Factories;

use App\\Enums\\ListingStatus;
use App\\Models\\Office;
use Illuminate\\Database\\Eloquent\\Factories\\Factory;

class ListingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'office_id' => Office::factory(),
            'title' => fake()->sentence(3),
            'price' => fake()->numberBetween(300_000, 3_000_000),
            'status' => ListingStatus::Draft,
            'bedrooms' => fake()->numberBetween(1, 6),
            'is_featured' => false,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ListingStatus::Published,
            'published_at' => now(),
        ]);
    }

    public function featured(): static
    {
        return $this->state(['is_featured' => true]);
    }
}`,
        note: "<code>'office_id' => Office::factory()</code> معناها: لو ما حددتش مكتب، اعمل مكتب جديد. وكل state بيتسلسل: <code>Listing::factory()->published()->featured()->create()</code>.",
      },
      terms: [
        ["factory", "مصنع موديل", "كلاس بيولّد instances من موديل ببيانات عشوائية."],
        ["state", "حالة", "method في الـ factory بتغيّر قيم معينة لتمثيل حالة (published, featured)."],
      ],
    },
    {
      title: "علاقات في الـ factories واستخدامها في الاختبارات",
      en: "Factory relationships and tests",
      body: "<p>الـ factory بتبني علاقات كاملة بسطر: <code>count()</code> لعدد، و<code>for()</code> بتربطه بأب موجود، و<code>has</code> بتولّد الأبناء، و<code>hasAttached</code> لعلاقات many-to-many. والفرق بين <code>make()</code> و<code>create()</code>: الأولى بتبني object من غير حفظ، والتانية بتحفظ.</p>",
      pitfall: "<code>count(3)->create(['price' => 123])</code> بتطبّق القيمة على التلاتة. ولو عايز قيم مختلفة استخدم <code>sequence</code>. ومتنساش <code>HasFactory</code> في الموديل، وإلا <code>Model::factory()</code> مش هتتلاقي.",
      interview: [
        { q: "إزاي تستخدم الـ factories في الاختبارات؟ وإيه فايدة <code>RefreshDatabase</code>؟", a: "بجهز البيانات في الاختبار بـ <code>Listing::factory()->count(2)->published()->for($office)->create()</code> وبعدين أستدعي الـ endpoint وأتحقق من النتيجة. الـ trait <code>RefreshDatabase</code> بيعمل migrate للداتابيز التجريبية وبيلف كل اختبار في transaction ويرجّعها، فكل اختبار بيبدأ من داتابيز نضيفة ومفيش اختبار بيأثر على التاني. فبقدر أكتب الاختبارات من غير ما أعتمد على بيانات مكتوبة بإيدي." },
      ],
      codes: [
        {
          lang: "php",
          title: "factory relationships",
          src: `<?php

$office = Office::factory()->create();

Listing::factory()->count(3)->for($office)->create();          // 3 listings of $office
Listing::factory()->for($office)->hasPhotos(2)->create();      // + 2 photos (morphMany)
Office::factory()->hasListings(4)->create();                   // office with 4 listings
Listing::factory()->hasAttached(Tag::factory()->count(2), ['is_primary' => true])->create();
Listing::factory()->count(4)->sequence(['bedrooms' => 1], ['bedrooms' => 2])->create();
Listing::factory()->create(['price' => 123]);                  // override a value

$listing = Listing::factory()->make();    // NOT saved: $listing->exists === false`,
          note: "الاسم <code>hasListings</code> و<code>hasPhotos</code> بيتبنوا من اسم العلاقة في الموديل. جربت كل السطور دي وطلعت نتائجها صح، بس خد بالك: حتى <code>make()</code> بيعمل مكتب فعلي في الداتابيز لأن <code>'office_id' => Office::factory()</code> في الـ definition بتتنفذ. لو عايز make من غير أي حفظ مرر <code>office_id</code> بنفسك.",
        },
        {
          lang: "php",
          title: "tests/Feature/ListingIndexTest.php",
          src: `<?php

namespace Tests\\Feature;

use App\\Models\\Listing;
use App\\Models\\Office;
use Illuminate\\Foundation\\Testing\\RefreshDatabase;
use Tests\\TestCase;

class ListingIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_published_listings_are_listed(): void
    {
        $office = Office::factory()->create();
        Listing::factory()->count(2)->published()->for($office)->create();
        Listing::factory()->for($office)->create();

        $this->getJson('/api/listings')
            ->assertOk()
            ->assertJsonCount(2);
    }
}`,
          note: "اتشغل بـ <code>php artisan test</code> ونجح. الإعلان التالت draft فمش ظاهر في القايمة.",
        },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: Schema::create لجدول tags",
      lang: "php",
      code: `<?php

use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

Schema::create('tags', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique();
    $table->timestamps();
});`,
    },
    {
      title: "اكتب: seeder بينادي على seeder وfactory",
      lang: "php",
      code: `<?php

use Illuminate\\Database\\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(TagSeeder::class);

        Office::factory()->count(3)->hasListings(4)->create();
    }
}`,
    },
    {
      title: "اكتب: factory بـ state",
      lang: "php",
      code: `<?php

use Illuminate\\Database\\Eloquent\\Factories\\Factory;

class ListingFactory extends Factory
{
    public function definition(): array
    {
        return ['title' => fake()->sentence(3), 'price' => 500000];
    }

    public function published(): static
    {
        return $this->state(['status' => 'published']);
    }
}`,
    },
  ],

  tasks: [
    {
      title: "migration لجدول inquiries",
      lang: "php",
      prompt: "<p>اكتب migration كاملة (<code>up</code> و<code>down</code>) لجدول <code>inquiries</code>: <code>id</code>، <code>listing_id</code> (مفتاح أجنبي على <code>listings</code>، لو الإعلان اتمسح الاستفسارات تتمسح)، <code>user_id</code> (اختياري، لو المستخدم اتمسح يبقى NULL)، <code>message</code> نص طويل، <code>read_at</code> timestamp اختياري، و<code>timestamps</code>.</p>",
      hints: [
        "<code>foreignId('listing_id')->constrained()->cascadeOnDelete()</code>.",
        "<code>foreignId('user_id')->nullable()->constrained()->nullOnDelete()</code> — لازم <code>nullable</code> قبل <code>constrained</code>.",
      ],
      solution: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->text('message');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};`,
      explain: "الكود ده نفسه اتشغّل في <code>migrate:fresh</code> ونجح. <code>nullOnDelete</code> محتاجة العمود <code>nullable</code> وإلا الداتابيز مش هتقدر تحط NULL. الجدول بيعتمد على <code>listings</code> و<code>users</code> فلازم تتأكد إن اسم ملفه بتاريخ بعدهم.",
    },
    {
      title: "migration لإضافة عمود لجدول موجود",
      lang: "php",
      prompt: "<p>الجدول <code>listings</code> اتنفذ في الـ production. عايز تضيف عمود <code>area_sqm</code> (رقم صحيح موجب، اختياري) بعد عمود <code>bedrooms</code>. اكتب الـ migration الجديدة كاملة مع <code>down</code> صح، واشرح في سطر ليه مش بنعدّل migration إنشاء الجدول.</p>",
      hints: [
        "جدول موجود يعني <code>Schema::table</code>.",
        "الـ <code>down</code> لازم تعكس اللي <code>up</code> عملته: <code>dropColumn</code>.",
      ],
      solution: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->unsignedInteger('area_sqm')->nullable()->after('bedrooms');
        });
    }

    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn('area_sqm');
        });
    }
};

// Why not edit create_listings_table? It already ran in production, so
// Laravel will never run that file again and the column would never exist.`,
      explain: "اتجرب: <code>migrate</code> ثم <code>migrate:rollback</code> رجّعوا العمود وشالوه. <code>nullable</code> لازم لأن الصفوف الموجودة مفيهاش قيمة. و<code>after()</code> بتشتغل على MySQL، وفي SQLite بتتجاهل (العمود بيتضاف في الآخر) من غير ما تضر.",
    },
    {
      title: "factory و اختبار للإعلانات المميزة",
      lang: "php",
      prompt: "<p>اكتب في <code>ListingFactory</code> state اسمها <code>featured()</code> بتضبط <code>is_featured</code> على true. وبعدها اكتب اختبار feature بـ <code>RefreshDatabase</code>: ينشئ مكتب، و3 إعلانات featured وإعلان واحد عادي لنفس المكتب، وبعدين يطلب <code>GET /api/listings/featured</code> ويتأكد إن عدد النتايج 3.</p>",
      hints: [
        "<code>return $this->state(['is_featured' => true]);</code>.",
        "<code>Listing::factory()->count(3)->featured()->for($office)->create()</code> ثم <code>assertJsonCount(3)</code>.",
      ],
      solution: `<?php

// 1) inside ListingFactory.php add:
//    public function featured(): static
//    {
//        return $this->state(['is_featured' => true]);
//    }

// 2) tests/Feature/FeaturedListingsTest.php
namespace Tests\\Feature;

use App\\Models\\Listing;
use App\\Models\\Office;
use Illuminate\\Foundation\\Testing\\RefreshDatabase;
use Tests\\TestCase;

class FeaturedListingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_returns_only_featured_listings(): void
    {
        $office = Office::factory()->create();
        Listing::factory()->count(3)->featured()->for($office)->create();
        Listing::factory()->for($office)->create();

        $this->getJson('/api/listings/featured')
            ->assertOk()
            ->assertJsonCount(3);
    }
}`,
      explain: "الـ state بتخلي الاختبار مقروء: «featured» بدل ما نكتب <code>['is_featured' => true]</code> في كل اختبار. <code>RefreshDatabase</code> بتضمن إن الإعلان العادي مش بيتسرب لاختبار تاني.",
    },
  ],

  quiz: [
    {
      q: "migration <code>create_listings_table</code> اتنفذت على السيرفر، وعايز تضيف عمود <code>area_sqm</code>. أنهي حل صح؟",
      options: [
        "تعدّل ملف <code>create_listings_table</code> وتضيف العمود وتشغّل <code>migrate</code>",
        "تشغّل <code>migrate:fresh</code> على السيرفر",
        "تعمل migration جديدة بـ <code>Schema::table</code> وتضيف العمود",
        "تضيف العمود من أداة الداتابيز بإيدك وخلاص",
      ],
      answer: 2,
      why: "الملف القديم اتسجّل كمنفّذ فمش هيتشغل تاني. <code>migrate:fresh</code> هيمسح داتا الـ production. والتعديل اليدوي بيكسر مبدأ إن كل التغييرات في كود بيتعمل له commit. الحل الصح migration جديدة.",
    },
    {
      q: "إيه الفرق الجوهري بين <code>migrate:fresh</code> و <code>migrate:refresh</code>؟",
      options: [
        "<code>fresh</code> بيعمل drop لكل الجداول من غير <code>down()</code>، و<code>refresh</code> بينفذ <code>down()</code> لكل migration وبعدين <code>up()</code>",
        "<code>fresh</code> بيحافظ على البيانات و<code>refresh</code> بيمسحها",
        "ولا فرق، اسمين لنفس الأمر",
        "<code>refresh</code> بيرجع آخر batch بس",
      ],
      answer: 0,
      why: "التلاتة (reset/refresh/fresh) بيمسحوا الداتا. <code>fresh</code> بيعمل DROP للجداول مباشرة، فبيشتغل حتى لو <code>down()</code> ناقصة. <code>refresh</code> بيعتمد على <code>down()</code>. وآخر batch بس هو <code>rollback</code>.",
    },
    {
      q: "إيه اللي بيحصل للإعلانات لما نمسح المكتب بتاعها (مع <code>foreignId('office_id')->constrained()->cascadeOnDelete()</code>)؟",
      options: [
        "الإعلانات بتتحول soft delete تلقائيا",
        "المسح بيفشل لو فيه إعلانات",
        "الـ <code>office_id</code> بتبقى NULL",
        "الإعلانات بتتمسح فعليا من الداتابيز",
      ],
      answer: 3,
      why: "الـ cascade بتتم في الداتابيز نفسها فالصفوف بتتمسح فعليا (حتى لو الموديل عنده SoftDeletes). الاختيار التاني هو <code>restrictOnDelete</code> والتالت <code>nullOnDelete</code>. جربت: عدد الإعلانات بعد مسح المكتب كان صفر حتى مع <code>withTrashed</code>.",
    },
    {
      q: "عندك <code>$table->foreignId('user_id')->constrained()->nullOnDelete();</code> والمايجريشن بتفشل أو بتضرب وقت مسح المستخدم. السبب الأرجح؟",
      options: [
        "ناقص <code>unique()</code>",
        "ناقص <code>nullable()</code> على العمود",
        "الأفضل استخدام <code>cascadeOnDelete()</code> دايما",
        "لازم يكون العمود <code>string</code>",
      ],
      answer: 1,
      why: "<code>nullOnDelete</code> بتحاول تحط NULL في العمود، فلازم يكون <code>nullable()</code> قبل <code>constrained()</code>. الـ unique مالوش علاقة، و cascade مش بديل لأنها بتمسح الاستفسارات.",
    },
    {
      q: "اللي بيحصل بعد السطر ده؟ (الـ definition فيها <code>'office_id' => Office::factory()</code>)",
      code: { lang: "php", src: `<?php
$listing = Listing::factory()->make();` },
      options: [
        "ولا صف اتضاف في أي جدول",
        "الإعلان اتحفظ لكن المكتب لأ",
        "الإعلان مش محفوظ، لكن المكتب المرتبط بيه اتحفظ في الداتابيز فعلا",
        "الاتنين اتحفظوا",
      ],
      answer: 2,
      why: "<code>make()</code> بيبني الإعلان من غير حفظ، لكن الـ factory المتداخلة في الـ definition (<code>Office::factory()</code>) بتتنفذ وبتحفظ المكتب. جربتها: بعد <code>make()</code> كان فيه مكتب في الجدول.",
    },
    {
      q: "أنهي أمر بيشغّل seeder واحد بالاسم؟",
      options: [
        "<code>php artisan seed TagSeeder</code>",
        "<code>php artisan db:seed --class=TagSeeder</code>",
        "<code>php artisan migrate --seeder=TagSeeder</code>",
        "<code>php artisan make:seed TagSeeder</code>",
      ],
      answer: 1,
      why: "الأمر الصحيح <code>db:seed --class=...</code>. الأمر الأخير مش موجود (التوليد بـ <code>make:seeder</code>)، و<code>migrate --seed</code> بتشغّل DatabaseSeeder مش seeder محدد.",
    },
    {
      q: "إيه فايدة <code>down()</code> في الـ migration؟",
      options: [
        "بتتنفذ تلقائيا بعد <code>up()</code> للتأكد",
        "بتعكس اللي عملته <code>up()</code> وتتنفذ عند <code>rollback</code>",
        "بتمسح الـ migration من git",
        "مفيش لازمة ليها في Laravel 11",
      ],
      answer: 1,
      why: "<code>down()</code> بتتنفذ في <code>rollback</code>/<code>reset</code>/<code>refresh</code> وبتعكس التغيير. ولسه مهمة في Laravel 11 (الـ stubs الجديدة بتبقيها). الكتابة الصحيحة بتخلي التراجع آمن.",
    },
    {
      q: "المايجريشن دي بتفشل. الخطأ في إيه؟",
      code: { lang: "php", src: `<?php
// 2026_01_01_000001_create_listings_table.php
$table->foreignId('office_id')->constrained();   // references offices

// 2026_01_01_000002_create_offices_table.php
Schema::create('offices', function (Blueprint $table) { /* ... */ });` },
      options: [
        "<code>constrained()</code> مش بتشتغل مع جدول offices",
        "الـ listings اتنفذت قبل offices (ترتيب أسماء الملفات)، فالجدول الأب مش موجود وقتها",
        "لازم <code>cascadeOnDelete()</code> دايما",
        "مفيش خطأ، Laravel بترتبهم حسب العلاقات",
      ],
      answer: 1,
      why: "Laravel بتنفذ الملفات بترتيب اسمها (التاريخ)، مبتفهمش العلاقات. لازم الأب يتعمل قبل الابن، وإلا فشل إنشاء المفتاح الأجنبي أو على الأقل فشل الاستخدام بعد كده.",
    },
    {
      q: "أنهي trait في الاختبار بيعمل migrate للداتابيز التجريبية ويعزل كل اختبار عن التاني؟",
      answer: ["RefreshDatabase", "Illuminate\\Foundation\\Testing\\RefreshDatabase"],
      why: "<code>RefreshDatabase</code> بتشغّل الـ migrations مرة وبتلف كل اختبار في transaction تترجع بعده. فالبيانات اللي بتعملها بالـ factories ما بتتسربش للاختبار اللي بعده.",
    },
  ],
};
