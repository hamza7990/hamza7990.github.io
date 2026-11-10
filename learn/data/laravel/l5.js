window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l5"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "الموديل = جدول، والـ object = صف",
      en: "What Eloquent is",
      body: "<p>Eloquent هو الـ ORM بتاع Laravel. بيطبّق نمط <b>Active Record</b>: كل جدول ليه كلاس (model)، وكل صف في الجدول هو object من الكلاس ده، والـ object نفسه بيعرف يحفظ نفسه ويعدّل ويمسح. بدل ما تكتب SQL بإيدك: <code>Listing::where('price', '&lt;', 1000000)-&gt;get()</code>.</p><p>ده أكتر مستوى في الـ back-end بيتسأل عليه في الإنترفيو، لأنه فيه فخاخ كتير: mass assignment، وإيه بيتنفذ في SQL وإيه في PHP، والـ soft deletes.</p>",
      points: [
        "الموديل بيتولّد بـ <code>php artisan make:model Listing -mf</code> (معاه migration وfactory).",
        "الـ query بتتبني بسلسلة methods وبتتنفذ فعليا لما تنادي <code>get()</code> أو <code>first()</code> أو <code>count()</code>.",
        "ملحوظة: الأمثلة هنا اتجربت في مشروع Laravel 11.57 على SQLite.",
      ],
    },
    {
      title: "الموديل والاتفاقيات (conventions)",
      en: "Model conventions",
      body: "<p>Eloquent بتخمّن من اسم الكلاس: <code>Listing</code> ← جدول <code>listings</code> (الجمع snake_case)، و<code>Inquiry</code> ← <code>inquiries</code>. المفتاح الأساسي <code>id</code>، وبتفترض وجود <code>created_at</code> و<code>updated_at</code> وبتملاهم لوحدها. لو الاتفاقيات ما نفعتش بتعدّلها بـ properties.</p>",
      code: {
        lang: "php",
        title: "app/Models/Listing.php",
        src: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class Listing extends Model
{
    use HasFactory;

    // protected $table = 'properties';   // if the table name differs
    // protected $primaryKey = 'uuid';    // if the key is not 'id'
    // public $timestamps = false;        // if there is no created_at/updated_at

    protected $fillable = ['office_id', 'title', 'price', 'status'];
}`,
        note: "جربت: <code>(new Listing)->getTable()</code> رجعت <code>listings</code>، و<code>Tag</code> رجعت <code>tags</code>، و<code>Inquiry</code> رجعت <code>inquiries</code> (مش <code>inquirys</code>). لو عندك جدول بدون timestamps فلازم <code>$timestamps = false</code> وإلا Laravel هتحاول تكتب أعمدة مش موجودة.",
      },
      terms: [
        ["ORM", "ربط الكائنات بالجداول", "Object-Relational Mapping: تتعامل مع الصفوف ككائنات بدل SQL."],
        ["Active Record", "الكائن بيحفظ نفسه", "نمط تصميم: الموديل فيه بيانات الصف وكمان methods الحفظ والاستعلام."],
      ],
    },
    {
      title: "Mass assignment: $fillable و $guarded",
      en: "Mass assignment protection",
      body: "<p>لما تعمل <code>Listing::create([...])</code> أو <code>$listing->update([...])</code> بمصفوفة، ده اسمه mass assignment. لو الموديل سمح بأي عمود، حد يبعت <code>is_featured=1</code> أو <code>office_id</code> بتاع حد تاني ويتخزن. عشان كده Laravel بتحمي: لازم تعرّف الأعمدة المسموحة في <code>$fillable</code> (قايمة بيضاء)، أو الممنوعة في <code>$guarded</code> (قايمة سوداء).</p>",
      code: {
        lang: "php",
        src: `<?php

class Listing extends Model
{
    // allow list: ONLY these can be mass assigned (preferred)
    protected $fillable = ['office_id', 'title', 'price'];

    // deny list: everything except these (riskier)
    // protected $guarded = ['id'];

    // DANGER: nothing is protected
    // protected $guarded = [];
}

$l = Listing::create([
    'office_id' => 1,
    'title' => 'villa',
    'price' => 900000,
    'id' => 77,              // not fillable -> silently ignored
]);
echo $l->id;                 // 1, not 77`,
        note: "جربتها: الـ <code>id => 77</code> اتجاهل من غير أي خطأ أو تحذير، و<code>fill(['nope' => 1])</code> برضه بتتجاهل. السلوك ده الافتراضي، وفيه <code>Model::preventSilentlyDiscardingAttributes()</code> لو عايز تحصل exception بدل التجاهل الصامت.",
      },
      pitfall: "<code>$guarded = []</code> معناها كل الأعمدة متاحة، وده مقبول بس لو إنت 100% مش بتبعت <code>$request->all()</code> للموديل. الأمان الحقيقي: <code>$fillable</code> محدد + <code>validated()</code> (المستوى اللي فات). وكمان خد بالك إن الإسناد المباشر <code>$listing->is_featured = 1</code> مش بيتأثر بـ <code>$fillable</code>، الحماية على الإسناد الجماعي بس.",
      interview: [
        { q: "إيه هو الـ mass assignment وإيه الفرق بين <code>$fillable</code> و <code>$guarded</code>؟", a: "الـ mass assignment إنك تعيّن عدة أعمدة بمصفوفة في <code>create</code> أو <code>fill</code> أو <code>update</code>. المشكلة إن لو المصفوفة جاية من المستخدم ممكن يكتب أعمدة حساسة (is_admin). <code>$fillable</code> قايمة بيضاء بالأعمدة المسموحة (أفضل وأوضح)، <code>$guarded</code> قايمة سوداء بالممنوع والباقي مسموح. الأعمدة غير المسموحة بتتجاهل بصمت. مع <code>validated()</code> بتحمي نفسك من جهتين." },
      ],
    },
    {
      title: "CRUD: create و update و save و delete",
      en: "Creating, updating and deleting",
      body: "<p>في طريقتين للحفظ: <code>create()</code> بتعمل وتحفظ مرة واحدة. أو بتعمل object وتعدل خصائصه وبعدين <code>save()</code> (بتعمل INSERT لو جديد و UPDATE لو موجود وفيه تغيير).</p>",
      code: {
        lang: "php",
        src: `<?php

$l = Listing::create(['office_id' => 1, 'title' => 'villa', 'price' => 900000]);

$l = new Listing(['office_id' => 1, 'title' => 'flat']);
$l->price = 400000;
$l->save();                          // INSERT

$l->price = 450000;
$l->isDirty('price');                // true  (changed, not saved yet)
$l->getOriginal('price');            // 400000
$l->save();                          // UPDATE only if something changed
$l->wasChanged('price');             // true  (after the save)

$l->update(['price' => 460000]);     // fill + save
Listing::where('price', '<', 100)->update(['status' => 'sold']);   // many rows, 1 query
Listing::where('price', '<', 100)->delete();                       // many rows, 1 query

$l->delete();                        // one row
Listing::destroy(1);                 // by id, loads then deletes`,
        note: "الفرق بين <code>$model->update()</code> و <code>Model::where(...)->update()</code>: الأولى بتحمّل الموديل وبتشغّل الـ events (observers)، والتانية بتنفذ UPDATE واحد على الداتابيز وبتتخطى الـ model events.",
      },
      pitfall: "بعد <code>create()</code> الموديل في الذاكرة فيه اللي بعتّه بس، مش القيم الافتراضية اللي الداتابيز حطتها. جربت: <code>Listing::create([...])</code> من غير status وبعدها <code>$l->status</code> رجعت <code>null</code>، لحد ما عملت <code>$l->refresh()</code> فبقت <code>draft</code>. لو محتاج القيمة اجلبها بـ <code>refresh()</code> أو <code>fresh()</code>.",
    },
    {
      title: "جلب البيانات: find و where و firstOrCreate",
      en: "Retrieving models",
      body: "<p>أي query بتبدأ من الموديل نفسه (static) وبتكمل بسلسلة. الفرق المهم بين methods بترجع <code>null</code> وmethods بترمي exception:</p>",
      code: {
        lang: "php",
        src: `<?php

Listing::find(5);                      // Listing or null
Listing::findOrFail(5);                // Listing or ModelNotFoundException (-> 404)
Listing::find([1, 2, 3]);              // Collection of those that exist

Listing::where('price', '>', 500000)->first();       // first match or null
Listing::where('price', '>', 500000)->firstOrFail(); // or exception
Listing::firstWhere('status', 'draft');              // shortcut for where+first

Listing::where('status', 'draft')
    ->where('bedrooms', '>=', 3)
    ->orderByDesc('price')
    ->limit(10)
    ->get();                           // Collection (could be empty)

// find it, or create it (does NOT update if found)
Listing::firstOrCreate(
    ['office_id' => 1, 'title' => 'villa'],   // search by
    ['price' => 900000]                       // extra values only on create
);

// find it and UPDATE, or create it
Listing::updateOrCreate(
    ['office_id' => 1, 'title' => 'villa'],
    ['price' => 950000]
);`,
        note: "جربت: <code>firstOrCreate</code> التانية رجّعت نفس السجل بالسعر القديم (<code>wasRecentlyCreated = false</code>)، و<code>updateOrCreate</code> غيّرت السعر. وبـ <code>findOrFail</code> لو الريكويست JSON بيتحول لـ 404 تلقائي.",
      },
      interview: [
        { q: "إيه الفرق بين <code>find</code> و <code>findOrFail</code>، وبين <code>firstOrCreate</code> و <code>updateOrCreate</code>؟", a: "<code>find</code> بترجع <code>null</code> لو مفيش سجل، و<code>findOrFail</code> بترمي <code>ModelNotFoundException</code> اللي Laravel بتحوله 404. <code>firstOrCreate</code> بتدور بالشرط الأول: لو لقت السجل بترجعه زي ما هو من غير تعديل، ولو لأ بتنشئه بالشرط + القيم الإضافية. <code>updateOrCreate</code> نفس الفكرة لكن لو لقت السجل بتحدّثه بالقيم التانية." },
      ],
    },
    {
      title: "Casts: تحويل الأنواع تلقائي",
      en: "Attribute casting",
      body: "<p>الداتابيز بترجّع نصوص وأرقام خام. الـ casts بتحوّلها لأنواع PHP مفيدة وقت القراءة، وبتحوّلها لشكل التخزين وقت الكتابة. في Laravel 11 بتتعرّف في method اسمها <code>casts()</code> (في النسخ القديمة كانت property اسمها <code>$casts</code> وبرضه لسه بتشتغل).</p>",
      code: {
        lang: "php",
        src: `<?php

use App\\Enums\\ListingStatus;

class Listing extends Model
{
    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'status' => ListingStatus::class,     // backed enum
            'is_featured' => 'boolean',
            'published_at' => 'datetime',         // Carbon instance
            'amenities' => 'array',               // JSON column <-> PHP array
        ];
    }
}

// usage
$l = Listing::find(1);
$l->status === ListingStatus::Draft;          // true
$l->status->value;                            // 'draft'
$l->is_featured;                              // true / false (not 1 / 0)
$l->published_at->diffForHumans();            // Carbon methods
$l->amenities = ['pool', 'garden'];           // saved as JSON text
$l->status = 'published';                     // string is converted to the enum`,
        note: "جربت: الـ <code>status</code> رجعت enum case، و<code>is_featured = 1</code> بقت <code>true</code>، والـ <code>amenities</code> اتخزنت JSON. وإسناد <code>'bogus'</code> للـ status رمى <code>ValueError</code> من نفسه.",
      },
      pitfall: "الـ cast <code>array</code> يتخزن JSON، لكن لو عدّلت جوه الـ array مباشرة (<code>$l->amenities[] = 'x'</code>) هتاخد notice «Indirect modification of overloaded property» والتعديل مش بيتحفظ (جربتها). اقرأ الـ array في متغير، عدّله، وبعدين اسنده من جديد.",
    },
    {
      title: "Accessors و Mutators و Local Scopes",
      en: "Attribute accessors and scopes",
      body: "<p>الـ <b>accessor</b> بيغيّر القيمة وقت القراءة، والـ <b>mutator</b> وقت الكتابة. من Laravel 9 بنعرّفهم في method واحدة بتاخد اسم العمود camelCase وبترجّع <code>Attribute</code>. والـ <b>local scope</b> هو شرط query بتستخدمه كتير وبتديله اسم.</p>",
      code: {
        lang: "php",
        src: `<?php

use Illuminate\\Database\\Eloquent\\Builder;
use Illuminate\\Database\\Eloquent\\Casts\\Attribute;

class Listing extends Model
{
    // column title: trim on write, ucfirst on read
    protected function title(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),
            set: fn (string $value) => trim($value),
        );
    }

    // virtual attribute (no column): $listing->price_label
    protected $appends = ['price_label'];

    protected function priceLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => number_format($this->price) . ' SAR',
        );
    }

    // local scopes: scopeXxx -> Listing::xxx()
    public function scopePublished(Builder $query): void
    {
        $query->where('status', ListingStatus::Published);
    }

    public function scopeCheaperThan(Builder $query, int $price): void
    {
        $query->where('price', '<', $price);
    }
}

// Listing::published()->cheaperThan(500000)->get();`,
        note: "جربت: كتابة <code>'  villa  '</code> خزنت <code>villa</code> وقراءتها رجّعت <code>Villa</code>. والـ <code>price_label</code> رجّعت <code>1,250,000 SAR</code> وظهرت في الـ JSON بفضل <code>$appends</code>. والـ scope بيتسلسل مع غيره، وبيشتغل كمان على العلاقات: <code>$office->listings()->published()</code>.",
      },
      interview: [
        { q: "إيه هو الـ local scope ومتى تستخدمه؟", a: "method في الموديل بتبدأ بـ <code>scope</code> وبتاخد <code>Builder</code>، وبتغلف شرط query متكرر بإسم مقروء، فبدل <code>where('status','published')</code> في عشرة أماكن بكتب <code>Listing::published()</code>. بيتسلسل مع باقي الـ query وبياخد بارامترات (<code>cheaperThan(500000)</code>). فايدته توحيد الشرط وتغييره في مكان واحد، بخلاف الـ global scope اللي بيتطبق على كل query تلقائي (زي SoftDeletes)." },
      ],
    },
    {
      title: "Soft deletes",
      en: "Soft deletes",
      body: "<p>بدل ما الصف يتمسح فعلا، بيتحط في عمود <code>deleted_at</code> تاريخ المسح، وكل query تلقائي بتتجاهل الصفوف دي. مفيد لو عايز تسترجع أو تحتفظ بتاريخ. بتحتاج عمود <code>$table->softDeletes()</code> في المايجريشن و<code>use SoftDeletes;</code> في الموديل.</p>",
      code: {
        lang: "php",
        src: `<?php

use Illuminate\\Database\\Eloquent\\SoftDeletes;

class Listing extends Model
{
    use SoftDeletes;
}

$l->delete();                        // sets deleted_at, row stays
$l->trashed();                       // true
Listing::count();                    // excludes trashed rows
Listing::withTrashed()->count();     // includes them
Listing::onlyTrashed()->count();     // only trashed
$l->restore();                       // deleted_at = NULL
$l->forceDelete();                   // real DELETE`,
        note: "الـ SQL الفعلي لأي query: <code>... where \"listings\".\"deleted_at\" is null</code> (شفته في <code>toSql()</code>). وخد بالك: بعد <code>delete()</code> قيمة <code>$l->exists</code> بتفضل <code>true</code> لأن الصف لسه في الجدول.",
      },
      pitfall: "الـ <code>unique</code> في الداتابيز مبتفرقش بين المحذوف وغيره: لو مسحت سجل بإيميل معين (soft) وبعدين حاولت تضيف نفس الإيميل هيرفض. والـ cascade على مستوى الداتابيز بيمسح فعليا ويتخطى الـ soft deletes.",
      interview: [
        { q: "إيه هو الـ soft delete وإيه عيوبه؟", a: "بدل <code>DELETE</code> بيتحدث عمود <code>deleted_at</code> والـ queries العادية بتتجاهل الصفوف دي بـ global scope. مفيد للاسترجاع والتاريخ. العيوب: الجداول بتكبر، قيود الـ unique بتتعارض مع الصفوف المحذوفة، لازم تفتكر <code>withTrashed</code> في التقارير، والـ cascade على مستوى الداتابيز بيمسح فعليا ويتخطاه." },
      ],
    },
    {
      title: "Collection مقابل Query Builder: إيه بيتنفذ فين",
      en: "SQL side versus PHP side",
      body: "<p>أهم فكرة في الأداء: <code>Listing::where(...)</code> بتبني SQL والداتابيز هي اللي بتفلتر. أما <code>Listing::all()</code> أو <code>get()</code> فبترجّع <b>Collection</b> من الموديلات المحمّلة كلها في الذاكرة، وأي <code>filter</code> أو <code>where</code> بعد كده بتشتغل في PHP على كل الصفوف.</p>",
      codes: [
        {
          lang: "php",
          title: "slow: loads every row into PHP",
          src: `<?php

$n = Listing::all()
    ->filter(fn ($l) => $l->price > 1000000)
    ->count();
// SQL: select * from "listings" where deleted_at is null`,
          note: "هنا الداتابيز بترجع كل الصفوف وPHP هي اللي بتعد. مع مليون صف ده يوقّف السيرفر.",
        },
        {
          lang: "php",
          title: "fast: the database does the work",
          src: `<?php

$n = Listing::where('price', '>', 1000000)->count();
// SQL: select count(*) as aggregate from "listings"
//      where "price" > ? and deleted_at is null

Listing::where('status', 'draft')->exists();     // bool, stops at first row
Listing::pluck('price');                         // Collection of one column
Listing::pluck('price', 'id');                   // [id => price]
Listing::max('price');                           // aggregates run in SQL
Listing::where('price', '>', 1)->toSql();        // see the SQL without running it`,
          note: "<code>count()</code> و<code>exists()</code> و<code>pluck()</code> و<code>max()</code> كلهم بتتنفذ في SQL. شفت الـ queries الفعلية من <code>DB::getQueryLog()</code>.",
        },
      ],
      focus: [{ label: "القاعدة", text: "افلتر وعدّ وفرز في الـ query builder قبل <code>get()</code>. استخدم Collection methods بس على نتيجة صغيرة معروفة." }],
      interview: [
        { q: "إيه الفرق بين <code>Listing::where(...)->get()->count()</code> و <code>Listing::where(...)->count()</code>؟ وبين <code>all()->where()</code> و <code>where()->get()</code>؟", a: "الأولى بتجيب كل الصفوف المطابقة من الداتابيز كموديلات وبتعدها في PHP. التانية بتنفذ <code>SELECT COUNT(*)</code> وبترجّع رقم واحد، فأخف بكتير في الذاكرة والوقت. وبنفس المنطق <code>all()->where()</code> بيحمّل الجدول كله وبيفلتر في PHP، لكن <code>where()->get()</code> بتفلتر في SQL فبترجع الصفوف المطلوبة بس. استخدم Collection methods لما النتيجة صغيرة وجاهزة." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: موديل بـ fillable و casts",
      lang: "php",
      code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Listing extends Model
{
    protected $fillable = ['title', 'price', 'status'];

    protected function casts(): array
    {
        return ['price' => 'integer', 'published_at' => 'datetime'];
    }
}`,
    },
    {
      title: "اكتب: local scopes",
      lang: "php",
      code: `<?php

use Illuminate\\Database\\Eloquent\\Builder;

class Listing extends Model
{
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published');
    }

    public function scopeCheaperThan(Builder $query, int $max): void
    {
        $query->where('price', '<', $max);
    }
}`,
    },
    {
      title: "اكتب: CRUD كامل",
      lang: "php",
      code: `<?php

$listing = Listing::create(['title' => 'Villa', 'price' => 900000]);
$listing->update(['price' => 850000]);

$found = Listing::findOrFail($listing->id);

$cheap = Listing::where('price', '<', 1000000)
    ->orderBy('price')
    ->get();

$listing->delete();`,
    },
  ],

  tasks: [
    {
      title: "scope و accessor",
      lang: "php",
      prompt: "<p>في <code>Listing</code> أضف: (1) local scope اسمه <code>featured</code> بيفلتر <code>is_featured = true</code>. (2) accessor افتراضي اسمه <code>price_label</code> بيرجّع السعر مفصول بفواصل ومعاه <code>SAR</code> (مثلا <code>1,250,000 SAR</code>) باستخدام <code>number_format</code>. ثم اكتب سطر يجيب أرخص 5 إعلانات مميزة.</p>",
      examples: [{ in: "Listing::find(1)->price_label  // price = 1250000", out: "1,250,000 SAR" }],
      hints: [
        "الـ scope: <code>scopeFeatured(Builder $query): void</code>.",
        "الـ accessor: method اسمها <code>priceLabel()</code> بترجّع <code>Attribute::make(get: fn () =&gt; ...)</code> وبتتقرأ كـ <code>price_label</code>.",
      ],
      solution: `<?php

use Illuminate\\Database\\Eloquent\\Builder;
use Illuminate\\Database\\Eloquent\\Casts\\Attribute;

class Listing extends Model
{
    public function scopeFeatured(Builder $query): void
    {
        $query->where('is_featured', true);
    }

    protected function priceLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => number_format($this->price) . ' SAR',
        );
    }
}

// the five cheapest featured listings
$top = Listing::featured()->orderBy('price')->limit(5)->get();`,
      explain: "الـ accessor بدون عمود حقيقي بنسميه virtual attribute، وبيتحسب وقت القراءة. لو عايزه يظهر في JSON ضيف <code>protected $appends = ['price_label'];</code>. الـ scope والترتيب والـ limit كلها في SQL واحد.",
    },
    {
      title: "حوّل الكود البطيء لـ query سريع",
      lang: "php",
      prompt: "<p>الكود ده بيجيب عدد الإعلانات المنشورة الأقل من مليون وأسعارهم. اكتب نسخة فعّالة (من غير تحميل الجدول كله): (1) العدد بـ query واحد. (2) أسعارهم مرتبة تصاعديا كـ Collection من أرقام فقط.</p><pre dir='ltr'><code>$all = Listing::all();\n$count = $all-&gt;where('status', 'published')\n    -&gt;where('price', '&lt;', 1000000)-&gt;count();\n$prices = $all-&gt;where('status', 'published')\n    -&gt;where('price', '&lt;', 1000000)-&gt;pluck('price')-&gt;sort();</code></pre>",
      hints: [
        "ابني الـ query الأساسي مرة واحدة: <code>Listing::where(...)->where(...)</code> وبعدين كمّل بـ <code>count()</code> أو <code>pluck()</code>.",
        "الترتيب في SQL بـ <code>orderBy('price')</code> قبل <code>pluck</code>.",
      ],
      solution: `<?php

$base = Listing::where('status', 'published')
    ->where('price', '<', 1000000);

$count = (clone $base)->count();                    // select count(*)
$prices = (clone $base)->orderBy('price')->pluck('price');   // one column

// or with the scope from the previous task:
// Listing::published()->cheaperThan(1000000)->count();`,
      explain: "الكود الأصلي بيحمل كل الجدول كموديلات ويفلتر مرتين في PHP. الحل بيبعت query واحد للعدد وquery واحد لعمود السعر بس. بنعمل <code>clone</code> للـ builder لأن <code>count()</code> و<code>pluck()</code> بيستهلكوه ومش عايزين نكرر كتابة الشروط (أو بنستخدم scopes).",
    },
    {
      title: "markAsSold مع firstOrFail و update",
      lang: "php",
      prompt: "<p>اكتب دالة <code>markAsSold(int $officeId, string $title): Listing</code>: تدوّر على إعلان بالمكتب والعنوان ده (لو مش موجود ترمي exception)، تغيّر <code>status</code> لـ <code>sold</code> (استخدم enum <code>ListingStatus::Sold</code>)، وترجّع الإعلان بعد الحفظ.</p>",
      examples: [{ in: "markAsSold(1, 'villa')->status->value", out: "sold" }],
      hints: [
        "<code>Listing::where(...)->where(...)->firstOrFail()</code>.",
        "الـ <code>update(['status' => ListingStatus::Sold])</code> بتقبل الـ enum لأن الـ cast معرّف.",
      ],
      solution: `<?php

use App\\Enums\\ListingStatus;
use App\\Models\\Listing;

function markAsSold(int $officeId, string $title): Listing
{
    $listing = Listing::where('office_id', $officeId)
        ->where('title', $title)
        ->firstOrFail();

    $listing->update(['status' => ListingStatus::Sold]);

    return $listing;
}`,
      explain: "<code>firstOrFail</code> بترمي <code>ModelNotFoundException</code> لو مفيش سجل، فمبنكتبش شرط <code>null</code>. <code>update</code> بتعمل fill وsave، والـ <code>status</code> لازم يكون في <code>$fillable</code> (وإلا اتجاهل بصمت!). والكاست بيحوّل الـ enum لقيمته النصية وقت الحفظ.",
    },
  ],

  quiz: [
    {
      q: "الكود ده بيطبع إيه؟ (الموديل <code>Listing</code> فيه <code>$fillable = ['office_id', 'title', 'price']</code> والجدول فاضي)",
      code: { lang: "php", src: `<?php
$l = Listing::create([
    'office_id' => 1,
    'title' => 'villa',
    'price' => 900000,
    'id' => 77,
]);
echo $l->id;` },
      options: [
        "77",
        "1، لأن الـ id بيتجاهل بصمت والداتابيز هي اللي بتولّده",
        "خطأ MassAssignmentException",
        "null",
      ],
      answer: 1,
      why: "الـ <code>id</code> مش في <code>$fillable</code> فبيتجاهل من غير أي رسالة، والداتابيز هي اللي بتولّد الـ id. الـ exception بتحصل بس لو فعّلت <code>preventSilentlyDiscardingAttributes</code>.",
    },
    {
      q: "إيه الفرق بين السطرين؟",
      code: { lang: "php", src: `<?php
$a = Listing::where('price', '>', 500000)->get()->count();
$b = Listing::where('price', '>', 500000)->count();` },
      options: [
        "ولا فرق في الأداء، كلاهما SQL واحد",
        "الأول أسرع لأن <code>get()</code> بتعمل كاش",
        "الأول بيجيب الصفوف المطابقة كلها لـ PHP ويعدها، والتاني بينفذ <code>SELECT COUNT(*)</code> بس",
        "التاني بيرمي exception لأن <code>count()</code> مش على الـ builder",
      ],
      answer: 2,
      why: "الاتنين بيرجعوا نفس الرقم، لكن الأول بيحمل كل الموديلات في الذاكرة. استخدم دايما aggregate (<code>count</code>, <code>exists</code>, <code>max</code>) على الـ builder.",
    },
    {
      q: "إيه اللي بيرجع من <code>$l->status</code> مباشرة بعد <code>$l = Listing::create(['title' => 'x', 'price' => 1, 'office_id' => 1]);</code> لو عمود <code>status</code> ليه default في الداتابيز <code>'draft'</code>؟",
      options: [
        "enum case <code>Draft</code>",
        "النص <code>'draft'</code>",
        "<code>null</code> لحد ما تعمل <code>refresh()</code>",
        "exception لأن status مش في fillable",
      ],
      answer: 2,
      why: "الـ default بتحطه الداتابيز، والموديل في الذاكرة ما بيعرفوش إلا لو جلبته تاني. بعد <code>$l->refresh()</code> هتبقى enum case. جربتها بنفسي وطلعت null.",
    },
    {
      q: "الفرق بين <code>firstOrCreate</code> و <code>updateOrCreate</code> لو السجل موجود؟",
      options: [
        "الاتنين بيحدّثوا السجل",
        "الاتنين بيرجعوه كما هو",
        "<code>firstOrCreate</code> بترجعه كما هو، و<code>updateOrCreate</code> بتحدّثه بالقيم التانية",
        "<code>firstOrCreate</code> بتحدّثه و<code>updateOrCreate</code> بتنشئ نسخة تانية",
      ],
      answer: 2,
      why: "<code>firstOrCreate</code> بتضيف فقط لو مش موجود. <code>updateOrCreate</code> بتحدّث الموجود. جربت: بعد firstOrCreate التانية السعر فضل 1، وبعد updateOrCreate بقى 999.",
    },
    {
      q: "عندك موديل بـ <code>SoftDeletes</code> وعملت <code>$l->delete();</code>. إيه الصح؟",
      options: [
        "الصف اتمسح من الجدول",
        "<code>Listing::count()</code> بتقل واحد، والصف لسه موجود في الجدول و<code>withTrashed()</code> بيشوفه",
        "<code>$l->exists</code> بقت false",
        "لازم <code>forceDelete()</code> عشان الـ count تقل",
      ],
      answer: 1,
      why: "الـ soft delete بيحدّث <code>deleted_at</code> والـ global scope بيخبي الصف من الـ queries العادية. الـ <code>exists</code> فضلت true (جربتها). <code>forceDelete</code> للمسح الحقيقي.",
    },
    {
      q: "أنهي طريقة تعريف cast صحيحة في Laravel 11 (الأسلوب الجديد)؟",
      options: [
        "<code>protected function casts(): array { return ['is_featured' => 'boolean']; }</code>",
        "<code>public function getCasts()</code> بتتعدل في الـ controller",
        "<code>protected $casts = ...</code> هي الطريقة الوحيدة",
        "<code>Attribute::cast('is_featured', 'boolean')</code>",
      ],
      answer: 0,
      why: "من Laravel 11 الأسلوب المفضل method اسمها <code>casts()</code>. الـ property <code>$casts</code> لسه بتشتغل لكن مش الوحيدة. <code>Attribute::cast</code> مش موجودة.",
    },
    {
      q: "عايز كل مرة تقرأ <code>$l->title</code> ترجع بحرف أول كبير، وعند الحفظ تتشال المسافات. أنهي كود؟",
      options: [
        "<code>protected function title(): Attribute { return Attribute::make(get: fn ($v) =&gt; ucfirst($v), set: fn ($v) =&gt; trim($v)); }</code>",
        "<code>public function getTitle()</code> بس",
        "<code>protected $casts = ['title' => 'ucfirst'];</code>",
        "<code>scopeTitle(Builder $q)</code>",
      ],
      answer: 0,
      why: "الـ <code>Attribute::make(get:, set:)</code> هو الأسلوب الحديث للـ accessor والـ mutator. الـ scope لفلترة الـ queries مش لتحويل القيم، و<code>ucfirst</code> مش cast مدمج.",
    },
    {
      q: "إيه الناتج؟ (<code>Listing::published()</code> تعرّف: <code>$query->where('status', 'published')</code>)",
      code: { lang: "php", src: `<?php
echo Listing::published()->toSql();` },
      options: [
        "<code>select * from \"listings\" where \"status\" = ? and \"listings\".\"deleted_at\" is null</code>",
        "<code>select * from \"listings\" where \"status\" = 'published'</code>",
        "<code>select * from \"listings\"</code>",
        "<code>published</code>",
      ],
      answer: 0,
      why: "<code>toSql()</code> بترجّع النص بعلامات <code>?</code> للقيم (الـ bindings منفصلة)، ولو الموديل فيه SoftDeletes بيتضاف شرط <code>deleted_at is null</code> تلقائي. بالظبط ده اللي طلع عندي.",
    },
    {
      q: "أنهي method بترجع <code>null</code> بدل ما ترمي exception لو السجل مش موجود؟",
      answer: ["find", "find()", "first", "first()"],
      why: "<code>find</code> و<code>first</code> بيرجعوا <code>null</code>، أما <code>findOrFail</code> و<code>firstOrFail</code> فبيرموا <code>ModelNotFoundException</code> (404 في الـ API).",
    },
  ],
};
