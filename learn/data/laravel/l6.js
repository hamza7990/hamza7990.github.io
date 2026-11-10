window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l6"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "العلاقات هي اللي بتحوّل الجداول لنموذج بيانات",
      en: "Why relationships matter",
      body: "<p>البيانات الحقيقية مترابطة: مكتب عنده إعلانات، وإعلان عنده صور ووسوم واستفسارات. في SQL بتربطهم بـ <code>JOIN</code>. في Eloquent بتعرّف العلاقة مرة واحدة كـ method في الموديل، وبعدها بتتنقل بينهم كأنهم objects: <code>$listing->office->name</code>.</p><p>في المستوى ده هنغطي الأنواع الأساسية على مثالنا: <b>Office</b> ← <b>Listing</b> ← (<b>Photo</b>, <b>Tag</b>, <b>Inquiry</b>) و<b>User</b>. الأداء والـ N+1 هو المستوى الجاي، هنا هنعمل مقدمة بس.</p>",
      points: [
        "كل علاقة = method في الموديل بترجّع object من نوع العلاقة (<code>HasMany</code>, <code>BelongsTo</code>...).",
        "في العلاقة دايما «أب» و«ابن»: الابن هو اللي عنده العمود (foreign key).",
        "تعرّف العلاقة من الجهتين عادة: <code>hasMany</code> في الأب و<code>belongsTo</code> في الابن.",
      ],
    },
    {
      title: "hasMany و belongsTo (واحد لكتير)",
      en: "One-to-many",
      body: "<p>أبسط علاقة: مكتب عنده إعلانات كتير، والإعلان تابع لمكتب واحد. جدول <code>listings</code> فيه عمود <code>office_id</code>. الاتفاقية: اسم الـ foreign key هو اسم الموديل الأب بـ snake_case + <code>_id</code>.</p>",
      code: {
        lang: "php",
        src: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Office extends Model
{
    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class);      // listings.office_id
    }
}

class Listing extends Model
{
    public function office(): BelongsTo
    {
        return $this->belongsTo(Office::class);     // listings.office_id
    }
}

// custom key names when the convention doesn't fit:
// $this->hasMany(Listing::class, 'agency_id', 'id');
// $this->belongsTo(Office::class, 'agency_id');`,
        note: "الاستخدام: <code>$office->listings</code> (Collection) و<code>$listing->office</code> (Office أو null). جربت: <code>$user->office->is($office)</code> رجعت true، واستفسار من غير مستخدم (<code>user_id</code> فاضي) بيرجع <code>null</code> للـ belongsTo. (في مشروعنا ملفين منفصلين طبعا، جمعتهم للشرح.)",
      },
      terms: [
        ["foreign key", "المفتاح الأجنبي", "العمود في جدول الابن اللي بيشاور على id في جدول الأب."],
        ["inverse relation", "العلاقة المعاكسة", "الجهة التانية: hasMany في الأب مقابلها belongsTo في الابن."],
      ],
    },
    {
      title: "$office->listings مقابل $office->listings()",
      en: "Property vs method access",
      body: "<p>أكتر حاجة بتلخبط في الإنترفيو: الفرق بين الشكلين. <b>بدون أقواس</b> (<code>$office->listings</code>) بتنفذ الـ query وترجّع النتيجة جاهزة (Collection) وبتتخزن في الموديل فمبتتنفذش تاني. <b>بأقواس</b> (<code>$office->listings()</code>) بترجّع object العلاقة نفسه (query builder) تقدر تكمل عليه شروط وتنفذه إنت.</p>",
      code: {
        lang: "php",
        src: `<?php

$office->listings;                         // Collection (query runs once, then cached)
$office->listings->count();                // counts in PHP, after loading ALL listings

$office->listings();                       // HasMany (nothing queried yet)
$office->listings()->count();              // SELECT COUNT(*) only
$office->listings()->where('price', '>', 150)->pluck('title');   // filtered in SQL

$office->listings()->create(['title' => 'Flat', 'price' => 200]);   // sets office_id
$office->listings;                         // still the OLD cached Collection!
$office->load('listings');                 // reload the relation`,
        note: "جربت: <code>get_class($office->listings)</code> = <code>Illuminate\\Database\\Eloquent\\Collection</code> و<code>get_class($office->listings())</code> = <code>...Relations\\HasMany</code>.",
      },
      focus: [{ label: "احفظها", text: "من غير أقواس = بيانات جاهزة. بأقواس = query تكمل عليه (أضف where، count، create). لو عايز تعد أو تفلتر استخدم الأقواس." }],
      interview: [
        { q: "إيه الفرق بين <code>$user->posts</code> و <code>$user->posts()</code>؟", a: "بدون أقواس هو dynamic property: Eloquent بتنفذ الـ query وبتجيب كل السجلات المرتبطة كـ Collection وبتحتفظ بيها في الموديل (lazy loading)، فالنداء التاني مبيعملش query. بأقواس بترجّع object العلاقة (<code>HasMany</code>) اللي هو query builder، فأقدر أضيف عليه شروط أو أعد (<code>$user->posts()->where(...)->count()</code>) أو أنشئ سجلات جديدة (<code>->create()</code>). للعد والفلترة بستخدم الأقواس عشان أحمّل اللي محتاجه بس." },
      ],
    },
    {
      title: "الإنشاء عن طريق العلاقة",
      en: "Creating through relations",
      body: "<p>بدل ما تعمل الابن وتكتب <code>office_id</code> بإيدك، اعمله من العلاقة وLaravel بتملا الـ foreign key لوحدها.</p>",
      code: {
        lang: "php",
        src: `<?php

$office = Office::find(1);

// create from the parent: office_id is filled for you
$listing = $office->listings()->create([
    'title' => 'Villa A',
    'price' => 900000,
]);

$office->listings()->createMany([
    ['title' => 'Flat B', 'price' => 400000],
    ['title' => 'Land C', 'price' => 250000],
]);

// attach an existing child to a parent from the child side
$listing->office()->associate($otherOffice);
$listing->save();

// remove the link (needs a nullable foreign key)
$listing->office()->dissociate();`,
        note: "جربت <code>create</code> و<code>createMany</code> و<code>associate</code> وكلهم ملّوا <code>office_id</code> صح. <code>associate</code> بتحدد القيمة في الذاكرة بس، لازم <code>save()</code> بعدها.",
      },
      pitfall: "<code>create</code> على العلاقة بتمر على <code>$fillable</code> برضه، فالأعمدة اللي بتبعتها لازم تكون مسموحة. وأي حقل جاي من المستخدم يتبعت من <code>validated()</code>.",
    },
    {
      title: "belongsToMany: كتير لكتير مع جدول وسيط",
      en: "Many-to-many with a pivot table",
      body: "<p>الإعلان ممكن يكون له وسوم (tags) كتير، والوسم ممكن يتكرر في إعلانات كتير. ده محتاج جدول وسيط (pivot) اسمه بالاتفاقية: أسماء الجدولين المفردة بترتيب أبجدي: <code>listing_tag</code>، وفيه <code>listing_id</code> و<code>tag_id</code> (ومعاهم أعمدة إضافية لو حبيت، زي <code>is_primary</code>).</p>",
      code: {
        lang: "php",
        src: `<?php

// Listing.php
public function tags(): BelongsToMany
{
    return $this->belongsToMany(Tag::class)
        ->withPivot('is_primary')      // expose extra pivot column
        ->withTimestamps();            // fill created_at/updated_at on the pivot
}

// Tag.php
public function listings(): BelongsToMany
{
    return $this->belongsToMany(Listing::class);
}

$listing->tags()->attach($tagId);                        // add one
$listing->tags()->attach($sea->id, ['is_primary' => true]);
$listing->tags()->detach($tagId);                        // remove one
$listing->tags()->detach();                              // remove all
$listing->tags()->sync([2, 3]);                          // make the set EXACTLY [2, 3]
$listing->tags()->syncWithoutDetaching([4]);             // add 4, keep the rest
$listing->tags()->toggle([2, 5]);                        // flip each id
$listing->tags()->updateExistingPivot(2, ['is_primary' => false]);

$listing->tags->first()->pivot->is_primary;              // read the pivot column
$listing->tags()->wherePivot('is_primary', true)->get(); // filter by pivot`,
        note: "جربت <code>sync([sea, pool])</code> وكان عندي [villa, sea-view]: رجّعت <code>{attached:[3], detached:[1], updated:[]}</code> وبقى الإعلان فيه sea-view و pool بس. الـ pivot object من نوع <code>Pivot</code> و<code>withTimestamps</code> مليت <code>created_at</code>.",
      },
      pitfall: "<code>attach</code> مرتين لنفس الـ id بتحاول تعمل صف مكرر (وتفشل لو فيه primary key مركب على الجدول الوسيط). لو مش متأكد استخدم <code>syncWithoutDetaching</code>. و<code>sync</code> بتمسح أي وسم مش في القايمة، فاتأكد إنك مبعتش قايمة ناقصة.",
      interview: [
        { q: "إيه الفرق بين <code>attach</code> و <code>sync</code> و <code>syncWithoutDetaching</code>؟", a: "<code>attach</code> بيضيف صف في الجدول الوسيط من غير فحص (ممكن يكرر). <code>sync([...])</code> بتخلي الجدول الوسيط يحتوي القايمة دي بالظبط: بتضيف الجديد وبتمسح اللي مش في القايمة وبترجّع array فيها <code>attached</code> و <code>detached</code> و <code>updated</code>. <code>syncWithoutDetaching</code> بتضيف الجديد وبتسيب الباقي. بستخدم <code>sync</code> لما الـ client بيبعت القايمة الكاملة للوسوم." },
      ],
    },
    {
      title: "hasManyThrough: علاقة عبر وسيط",
      en: "Has-many-through",
      body: "<p>عايز كل استفسارات مكتب. الاستفسار تابع لإعلان، والإعلان تابع لمكتب. بدل ما تجيب الإعلانات وتلف عليها، <code>hasManyThrough</code> بتوصّل المكتب بالاستفسارات عبر <code>Listing</code> بـ JOIN واحد.</p>",
      code: {
        lang: "php",
        src: `<?php

// Office.php
public function inquiries(): HasManyThrough
{
    // Inquiry -> through Listing -> Office
    return $this->hasManyThrough(Inquiry::class, Listing::class);
}

// keys by convention:
//   listings.office_id        (Listing -> Office)
//   inquiries.listing_id      (Inquiry -> Listing)

$office->inquiries;                          // all inquiries of all its listings
$office->inquiries()->count();               // one SQL query with a join
Office::withCount('inquiries')->get();       // inquiries_count on each office`,
        note: "جربت: مكتب عنده 3 استفسارات عبر إعلاناته رجّع 3، ومكتب تاني رجّع استفسار واحد، وكان <code>withCount('inquiries')</code> بيرجع [3, 1, 0] لتلات مكاتب.",
      },
      terms: [
        ["through", "عبر وسيط", "علاقة بتتخطى جدول وسيط بدون ما تعرّفه كعلاقة منفصلة."],
      ],
    },
    {
      title: "Polymorphic: صور لأكتر من نوع",
      en: "Polymorphic relationships",
      body: "<p>الصور بتنتمي للإعلان وللمكتب (لوجو). بدل جدولين <code>listing_photos</code> و<code>office_photos</code>، جدول واحد <code>photos</code> فيه عمودين: <code>imageable_id</code> (الـ id) و<code>imageable_type</code> (اسم الكلاس: <code>App\\Models\\Listing</code> أو <code>App\\Models\\Office</code>). في الـ migration: <code>$table->morphs('imageable')</code> بتعملهم.</p>",
      code: {
        lang: "php",
        src: `<?php

// Photo.php  (the child: knows its parent could be several types)
public function imageable(): MorphTo
{
    return $this->morphTo();
}

// Listing.php and Office.php
public function photos(): MorphMany
{
    return $this->morphMany(Photo::class, 'imageable');
}

$listing->photos()->create(['path' => 'a.jpg', 'position' => 1]);
$office->photos()->create(['path' => 'logo.png']);

$photo = Photo::first();
$photo->imageable_type;          // 'App\\Models\\Listing'
$photo->imageable;               // a Listing (or an Office, depending on the row)`,
        note: "جربت: الـ photo بتاع لوجو المكتب رجّع <code>imageable</code> من نوع <code>Office</code> والتاني <code>Listing</code>. وفي الـ create من العلاقة، Laravel ملّت <code>imageable_type</code> و<code>imageable_id</code> لوحدها (إنما لو عملت <code>Photo::create</code> مباشرة هتحتاج تحط الاتنين بإيدك وتضيفهم لـ fillable).",
      },
      pitfall: "تخزين اسم الكلاس الكامل في الداتابيز بيربط البيانات بأسماء الـ namespaces: لو غيّرت اسم الكلاس تتكسر الصفوف القديمة. الحل: <code>Relation::enforceMorphMap(['listing' => Listing::class, 'office' => Office::class])</code> في <code>AppServiceProvider::boot</code> فيتخزن <code>listing</code> بدل الاسم الكامل.",
      interview: [
        { q: "إزاي تعمل علاقة polymorphic؟ ومثال حقيقي؟", a: "لما موديل (Photo أو Comment) ممكن يتبع أكتر من نوع موديل. الجدول بيحتاج عمودين: <code>xxx_id</code> و<code>xxx_type</code> (بنعملهم بـ <code>morphs('imageable')</code>). في الموديل الابن <code>morphTo()</code> وفي كل أب <code>morphMany(Photo::class, 'imageable')</code>. مثال: جدول <code>photos</code> مشترك بين الإعلانات والمكاتب. عيبه إن مفيش foreign key حقيقي في الداتابيز لأن العمود ممكن يشاور على أكتر من جدول." },
      ],
    },
    {
      title: "has و whereHas و withCount: الاستعلام عن طريق العلاقات",
      en: "Querying relationships",
      body: "<p>تقدر تفلتر الأب بناء على وجود أبناء أو شروط عليهم من غير ما تكتب JOIN، وتجيب عدد الأبناء كعمود إضافي.</p>",
      code: {
        lang: "php",
        src: `<?php

Listing::has('inquiries')->get();                    // listings with >= 1 inquiry
Listing::has('tags', '>=', 2)->get();                // with at least 2 tags
Listing::doesntHave('photos')->get();                // without any photo

Office::whereHas('listings', function ($query) {     // offices that have a listing
    $query->where('price', '>', 1000000);            // matching this condition
})->get();

Listing::whereRelation('office', 'city', 'Riyadh')->get();   // short form

$offices = Office::withCount('listings')->get();     // listings_count column
$offices->first()->listings_count;

Office::withCount(['listings as expensive_count' => fn ($q) => $q->where('price', '>', 150)])->get();
Office::withSum('listings', 'price')->get();         // listings_sum_price`,
        note: "كل سطر اتجرب. <code>withCount</code> بتضيف subquery فمبتحملش الأبناء. ملحوظة: جربت <code>having('listings_count', '>', 1)</code> على SQLite وفشلت، فاستخدم <code>has('listings', '>', 1)</code> بدلها وهي بتشتغل على كل قواعد البيانات.",
      },
      interview: [
        { q: "إيه الفرق بين <code>has</code> و <code>whereHas</code> و <code>withCount</code>؟", a: "<code>has('listings')</code> بتفلتر الآباء اللي عندهم أبناء (وتقدر تحدد عدد أدنى). <code>whereHas('listings', fn)</code> نفس الفكرة لكن بشرط إضافي على الأبناء. الاتنين بيفلتروا الآباء وماجبوش الأبناء. <code>withCount('listings')</code> مبتفلترش، بتضيف عمود <code>listings_count</code> لكل أب بـ subquery، وده أخف من تحميل الأبناء وعدهم في PHP." },
      ],
    },
    {
      title: "نظرة أولى على الـ eager loading بـ with()",
      en: "Eager loading preview",
      body: "<p>لما بتلف على مجموعة موديلات وبتقرأ علاقة كل واحد (<code>$listing->office</code>)، كل قراءة بتعمل query لوحدها: query أولى + واحدة لكل صف. دي مشكلة الـ <b>N+1</b> وهنتعمق فيها في المستوى الجاي. الحل الأساسي: <code>with()</code> بتجيب العلاقة كلها مقدما في query واحد إضافي.</p>",
      codes: [
        {
          lang: "php",
          title: "lazy loading: 1 + N queries",
          src: `<?php

$listings = Listing::all();                // 1 query
foreach ($listings as $listing) {
    echo $listing->office->name;           // +1 query per listing
}
// 4 queries for 3 listings (1 + 3)`,
        },
        {
          lang: "php",
          title: "eager loading: 2 queries",
          src: `<?php

$listings = Listing::with('office')->get();   // 2 queries total
foreach ($listings as $listing) {
    echo $listing->office->name;              // no query, already loaded
}

Listing::with(['office:id,name', 'tags'])->get();   // several relations, some columns
$listing->relationLoaded('office');                 // true`,
          note: "عدّيت الـ queries بـ <code>DB::getQueryLog()</code>: 4 من غير <code>with</code> و2 معاها لتلات إعلانات، و3 مع علاقتين.",
        },
      ],
      interview: [
        { q: "إيه هي مشكلة الـ N+1 وإزاي بتتحل أول حل؟", a: "لما أجيب N سجل بـ query واحدة وبعدين أقرأ علاقة كل سجل في loop، كل قراءة بتعمل query، فالمجموع 1 + N. الحل الأساسي <code>with('relation')</code> (eager loading) اللي بيجيب كل العلاقات المطلوبة بـ query واحد إضافي لكل علاقة باستخدام <code>WHERE id IN (...)</code>. مستوى الأداء الجاي هيتكلم عن اكتشافها ومنعها." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: hasMany و belongsTo",
      lang: "php",
      code: `<?php

use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Office extends Model
{
    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}`,
    },
    {
      title: "اكتب: belongsToMany مع pivot",
      lang: "php",
      code: `<?php

use Illuminate\\Database\\Eloquent\\Relations\\BelongsToMany;

class Listing extends Model
{
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)
            ->withPivot('is_primary')
            ->withTimestamps();
    }
}

$listing->tags()->sync([1, 2, 3]);`,
    },
    {
      title: "اكتب: polymorphic photos",
      lang: "php",
      code: `<?php

class Photo extends Model
{
    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }
}

class Listing extends Model
{
    public function photos(): MorphMany
    {
        return $this->morphMany(Photo::class, 'imageable');
    }
}`,
    },
  ],

  tasks: [
    {
      title: "علاقات Inquiry و Listing",
      lang: "php",
      prompt: "<p>اكتب العلاقات دي: في <code>Inquiry</code>: <code>listing()</code> (belongsTo) و<code>user()</code> (belongsTo، المستخدم ممكن يكون null). في <code>Listing</code>: <code>inquiries()</code> (hasMany). في <code>Office</code>: <code>inquiries()</code> عبر <code>Listing</code> (hasManyThrough). واكتب سطر يجيب كل الاستفسارات الغير مقروءة (<code>read_at</code> فاضي) لمكتب معين مرتبة من الأحدث.</p>",
      hints: [
        "<code>hasManyThrough(Inquiry::class, Listing::class)</code>.",
        "الاستفسارات الغير مقروءة: <code>$office->inquiries()->whereNull('read_at')->latest('inquiries.created_at')</code>. (اكتب اسم الجدول لأن العمود <code>created_at</code> موجود في الجدولين.)",
      ],
      solution: `<?php

class Inquiry extends Model
{
    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

class Listing extends Model
{
    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }
}

class Office extends Model
{
    public function inquiries(): HasManyThrough
    {
        return $this->hasManyThrough(Inquiry::class, Listing::class);
    }
}

$unread = $office->inquiries()
    ->whereNull('inquiries.read_at')
    ->latest('inquiries.created_at')
    ->get();`,
      explain: "الـ hasManyThrough بتعمل JOIN بين الجدولين، فأي عمود موجود في الاتنين (زي <code>created_at</code>) الأسلم تكتبه باسم الجدول عشان تتجنب «ambiguous column» (على MySQL بتطلع الغلطة دي، وأنا جربت على SQLite ومطلعتش، بس الكتابة باسم الجدول آمنة في الحالتين). <code>user()</code> بترجع null لو <code>user_id</code> فاضي.",
    },
    {
      title: "تحديث وسوم الإعلان",
      lang: "php",
      prompt: "<p>اكتب دالة <code>retag(Listing $listing, array $tagNames): array</code>: لكل اسم وسم لو مش موجود تنشئه، وبعدين تخلي وسوم الإعلان هي القايمة دي بالظبط، وترجّع نتيجة <code>sync</code> (attached/detached/updated).</p>",
      examples: [
        { in: "retag($listing, ['villa', 'pool'])", out: "{attached:[1,2], detached:[], updated:[]}" },
        { in: "retag($listing, ['pool', 'garden'])  // after the first call", out: "{attached:[3], detached:[1], updated:[]}" },
      ],
      hints: [
        "<code>Tag::firstOrCreate(['name' => $name])->id</code> لكل اسم.",
        "<code>$listing->tags()->sync($ids)</code> بترجع array النتيجة.",
      ],
      solution: `<?php

use App\\Models\\Listing;
use App\\Models\\Tag;

function retag(Listing $listing, array $tagNames): array
{
    $ids = collect($tagNames)
        ->map(fn (string $name) => Tag::firstOrCreate(['name' => $name])->id)
        ->all();

    return $listing->tags()->sync($ids);
}`,
      explain: "جربنا الدالة: أول نداء ربط وسمين، التاني شال <code>villa</code> وأضاف <code>garden</code> وسيب <code>pool</code>، وجدول tags فضل 3 صفوف (من غير تكرار) بفضل <code>firstOrCreate</code>. <code>sync</code> هي الأداة المناسبة لما الـ client يبعت القايمة النهائية.",
    },
    {
      title: "مكاتب بإعلانات غالية وعدد استفساراتها",
      lang: "php",
      prompt: "<p>اكتب query تجيب المكاتب اللي عندها على الأقل إعلان واحد سعره أكبر من 1,000,000، ومعاها عدد الاستفسارات المستلمة (من كل إعلانات المكتب) كعمود <code>inquiries_count</code>، مرتبة بالـ id. استخدم العلاقات (<code>whereHas</code> و<code>withCount</code>) من غير أي JOIN يدوي.</p>",
      hints: [
        "<code>Office::query()->whereHas('listings', fn ($q) => $q->where(...))</code>.",
        "كمّل بـ <code>->withCount('inquiries')->orderBy('id')->get()</code> (علاقة hasManyThrough اللي عرّفناها).",
      ],
      solution: `<?php

use App\\Models\\Office;

$offices = Office::query()
    ->whereHas('listings', function ($query) {
        $query->where('price', '>', 1000000);
    })
    ->withCount('inquiries')
    ->orderBy('id')
    ->get();

foreach ($offices as $office) {
    echo $office->id, ': ', $office->inquiries_count, "\\n";
}`,
      explain: "<code>whereHas</code> بتفلتر المكاتب بشرط على الأبناء، و<code>withCount('inquiries')</code> بتعدّ الاستفسارات عبر العلاقة المتوسطة بـ subquery. اتجرب على بيانات: مكتب 1 جاب 3 ومكتب 2 جاب 1، والمكتب التالت اتفلتر.",
    },
  ],

  quiz: [
    {
      q: "إيه اللي بيرجّعه <code>$office->listings()</code> (بالأقواس)؟",
      options: [
        "Collection من الإعلانات",
        "عدد الإعلانات",
        "object العلاقة (<code>HasMany</code>) اللي تقدر تكمل عليه query",
        "array من الـ ids",
      ],
      answer: 2,
      why: "بالأقواس بتاخد الـ relation/query builder من غير تنفيذ. من غير أقواس (<code>$office->listings</code>) بتاخد Collection جاهزة.",
    },
    {
      q: "أنهي سطر بيعد إعلانات المكتب بأكفأ طريقة؟",
      options: [
        "<code>$office->listings->count()</code>",
        "<code>count($office->listings->all())</code>",
        "<code>$office->listings()->get()->count()</code>",
        "<code>$office->listings()->count()</code>",
      ],
      answer: 3,
      why: "الأخير بينفذ <code>SELECT COUNT(*)</code> فقط. الباقي بيحمّل كل الإعلانات في الذاكرة ويعدها في PHP (أول واحد كمان بيعمل cache للـ Collection).",
    },
    {
      q: "الإعلان عنده وسوم [1, 2]. بعد <code>$listing->tags()->sync([2, 3])</code>، إيه اللي في جدول <code>listing_tag</code> لهذا الإعلان؟",
      options: [
        "[1, 2, 3]",
        "[2, 3]",
        "[3]",
        "[1, 3]",
      ],
      answer: 1,
      why: "<code>sync</code> بتخلي القايمة بالظبط [2, 3]: بتضيف 3 وبتشيل 1 وبتسيب 2. لو عايز [1, 2, 3] كان لازم <code>syncWithoutDetaching([3])</code>.",
    },
    {
      q: "جدول <code>photos</code> عليه <code>$table->morphs('imageable')</code>. أنهي أعمدة بتتعمل؟",
      options: [
        "<code>imageable</code> بس",
        "<code>imageable_type</code> و <code>imageable_id</code>",
        "<code>photo_id</code> و <code>listing_id</code>",
        "<code>parent_id</code> و <code>parent_type</code>",
      ],
      answer: 1,
      why: "<code>morphs('x')</code> بتعمل <code>x_type</code> و<code>x_id</code> (مع index). النوع بيحتفظ باسم الكلاس (أو الـ morph map alias) والـ id بيحتفظ برقم الصف.",
    },
    {
      q: "كام query بتتنفذ في الكود ده لو الجدول فيه 3 إعلانات؟",
      code: { lang: "php", src: `<?php
$listings = Listing::with('office')->get();
foreach ($listings as $l) {
    echo $l->office->name;
}` },
      answer: ["2"],
      why: "query للإعلانات و query واحدة للمكاتب كلها (<code>WHERE id IN (...)</code>). من غير <code>with</code> كانت هتبقى 4 (1 + 3). ده اللي عدّيته بـ <code>DB::getQueryLog()</code>.",
    },
    {
      q: "جدول وسيط لعلاقة كتير لكتير بين <code>Listing</code> و <code>Tag</code>، الاسم الافتراضي اللي Laravel بتفترضه؟",
      options: [
        "<code>listings_tags</code>",
        "<code>tag_listing</code>",
        "<code>listing_tag</code>",
        "<code>tags</code>",
      ],
      answer: 2,
      why: "أسماء الموديلين بالمفرد (snake_case) بترتيب أبجدي: <code>listing_tag</code>. جربت <code>(new Listing)->tags()->getTable()</code> ورجعت كده. لو الاسم مختلف تمرره كـ argument تاني لـ <code>belongsToMany</code>.",
    },
    {
      q: "ليه الكود ده مش بيظهر الإعلان الجديد؟",
      code: { lang: "php", src: `<?php
echo $office->listings->count();               // 2
$office->listings()->create(['title' => 'New', 'price' => 1]);
echo $office->listings->count();` },
      options: [
        "لأن <code>create</code> فشلت بصمت",
        "لأن الـ Collection الأولى اتخزنت في الموديل وما اتحدثتش، فبتطبع 2 تاني (لحد <code>load('listings')</code>)",
        "لأن الـ count بتتحسب مرة واحدة في الـ session",
        "لأن العلاقة لازم تتسمى بالمفرد",
      ],
      answer: 1,
      why: "أول قراءة للـ property حمّلت العلاقة وخزنتها في الموديل. أي إضافة بعد كده من الأقواس ما بتحدثهاش. الحل <code>$office->load('listings')</code> أو <code>refresh()</code> أو استخدام <code>listings()->count()</code>.",
    },
    {
      q: "أنهي استعلام بيرجّع المكاتب اللي ليها إعلان واحد على الأقل سعره فوق مليون؟",
      options: [
        "<code>Office::withCount('listings')->where('price', '&gt;', 1000000)</code>",
        "<code>Office::has('listings')->where('price', '&gt;', 1000000)</code>",
        "<code>Office::whereHas('listings', fn ($q) =&gt; $q->where('price', '&gt;', 1000000))</code>",
        "<code>Office::with('listings')->where('listings.price', '&gt;', 1000000)</code>",
      ],
      answer: 2,
      why: "الشرط على الأبناء لازم يتحط جوه <code>whereHas</code>. الباقي بيفترض إن <code>price</code> عمود في جدول <code>offices</code> وده مش موجود فهيفشل.",
    },
    {
      q: "عندك موديل Photo فيه <code>imageable_type = 'App\\Models\\Office'</code>. إيه نوع <code>$photo->imageable</code>؟",
      options: [
        "Listing دايما",
        "Office",
        "null لأن مفيش foreign key",
        "string باسم الكلاس",
      ],
      answer: 1,
      why: "<code>morphTo</code> بتقرأ <code>imageable_type</code> وبتجيب السجل من الكلاس ده بالـ <code>imageable_id</code>. فهترجع Office instance. جربتها بصورة لوجو مكتب.",
    },
  ],
};
