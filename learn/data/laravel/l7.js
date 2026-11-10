window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l7"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "الـ API البطيء غالبا بيبعت استعلامات كتير، مش استعلام تقيل",
      en: "Why query count matters",
      body: "<p>أغلب بطء الـ endpoints في Laravel مش من السيرفر نفسه، من <b>عدد الاستعلامات</b> اللي الكود بيطلقها من غير ما تاخد بالك. كل استعلام رحلة للداتابيز (شبكة + parse + execute). 200 استعلام صغير أبطأ بكتير من 3 استعلامات أكبر. والمشكلة إن Eloquent بيخلي الكود يبان بريء: <code>$listing->office->name</code> سطر واحد، لكنه ممكن يبقى استعلام كامل.</p><p>في المستوى ده بنشتغل على نفس الـ domain: <code>Listing</code> تابع لـ <code>Office</code>، وله <code>photos</code> و<code>tags</code> و<code>inquiries</code>. هدفنا: تعرف تعدّ الاستعلامات، تقللها، تحمي العمليات المهمة بـ transaction، وتمنع race condition.</p>",
      points: [
        "قاعدة أولى: قبل أي تحسين، <b>عدّ الاستعلامات</b> (query log أو Debugbar أو Telescope) بدل ما تخمّن.",
        "المشكلة التانية: تحميل بيانات كتير في الذاكرة مرة واحدة (<code>all()</code> على جدول ضخم).",
        "المشكلة التالتة: استعلام سليم لكن من غير index فبيقرا الجدول كله.",
        "والمشكلة الرابعة مش سرعة: عمليتين متزامنتين بيكسروا بعض (race condition) ومحتاجين transaction وقفل.",
      ],
      interview: [
        { q: "API بتاعك بطيء. بتبدأ منين؟", a: "مبخمنش. أقيس الأول: أعدّ عدد الاستعلامات للـ endpoint ووقت كل واحد (Debugbar أو Telescope أو <code>DB::listen</code>). غالبا ألاقي N+1 فأحلها بـ eager loading، أو استعلام تقيل من غير index فأقرا الـ <code>EXPLAIN</code> بتاعه. بعدها أبص على حجم البيانات اللي بترجع (select أعمدة محددة وpagination) قبل ما أفكر في cache أو سيرفر أكبر." },
      ],
    },
    {
      kicker: "المشكلة",
      title: "الـ N+1 بالأرقام",
      en: "The N+1 query problem",
      body: "<p>بتجيب قايمة (استعلام 1) وبعدين جوه الـ loop بتلمس relationship على كل عنصر، فـ Eloquent بيعمل <b>lazy load</b>: استعلام لكل عنصر (N استعلام). لو القايمة 20 إعلان: 1 + 20 = 21 استعلام. ولو 500: 501. شغّلنا ده فعلا على 20 إعلان في مشروع تجريبي والرقم 21.</p>",
      codes: [
        {
          lang: "php",
          title: "N+1: 21 استعلام",
          src: `$listings = Listing::all();            // 1 query

foreach ($listings as $listing) {
    echo $listing->office->name;       // +1 query each time
}
// 20 listings => 1 + 20 = 21 queries`,
          note: "كل <code>$listing->office</code> أول مرة بتتقرا بيعمل <code>select * from offices where id = ? limit 1</code>.",
        },
        {
          lang: "php",
          title: "الحل: استعلامين",
          src: `$listings = Listing::with('office')->get();

foreach ($listings as $listing) {
    echo $listing->office->name;       // already in memory
}
// 2 queries, whatever the number of listings`,
          note: "الاستعلام التاني: <code>select * from offices where id in (1, 2, 3, 4)</code>. العدد ثابت مهما زاد عدد الإعلانات.",
        },
      ],
      pitfall: "الـ N+1 بيستخبى: في <code>Resource</code> أو accessor أو Blade view، مش بس في الـ controller. وكمان <code>$listing->photos()->count()</code> (بالأقواس) بتعمل استعلام جديد في كل مرة حتى لو عملت eager load للـ photos.",
      interview: [
        { q: "إيه هو الـ N+1 problem وإزاي تحله؟", a: "بتجيب N سجل بإستعلام واحد وبعدين بتقرا relationship لكل سجل في loop، فبيتنفذ استعلام لكل سجل: يعني N+1 استعلام. بحله بـ eager loading: <code>Listing::with('office')->get()</code> بيجيب كل المكاتب في استعلام واحد بـ <code>where id in (...)</code>، فبيبقى 2 استعلام بدل 21 مثلا. وأكتشفه بعدّ الاستعلامات أو بـ <code>Model::preventLazyLoading()</code> في الـ development." },
      ],
    },
    {
      title: "Eager loading بالتفصيل: with و nested و constraints",
      en: "with, nested with, constrained with",
      body: "<p><code>with()</code> بتاخد اسم relationship أو أكتر، وبـ dot نزل مستويات: <code>office.owner</code> يعني المكتب وصاحبه. وتقدر تضيف شرط على الـ relationship بـ closure.</p>",
      code: {
        lang: "php",
        src: `// several relations + nested: 4 queries total
$listings = Listing::with('office.owner', 'photos')->get();

// constraint on the relation (still 1 extra query)
$listings = Listing::with(['photos' => function ($q) {
    $q->orderBy('id')->limit(2);
}])->get();

// only some columns of the relation (keep the key!)
$listings = Listing::with('office:id,name')->get();

// always eager load by default on the model
// protected $with = ['office'];`,
        note: "الأول: listings + offices + users + photos = 4. الـ <code>limit(2)</code> في Laravel 11 بتتطبق <b>لكل إعلان</b> (بتتحول لـ window function في الـ SQL، محتاجة MySQL 8 أو أحدث). في إصدارات أقدم كانت بتتطبق على المجموع كله، فاتأكد من إصدارك. ولاحظ في <code>office:id,name</code> إن لازم تضيف <code>id</code>، وإلا الربط يفشل.",
      },
      pitfall: "<code>protected $with</code> على الـ model بتحمّل الـ relation في كل استعلام حتى لما مش محتاجه. استخدمها بحذر. والأفضل تقول <code>with</code> صراحة في المكان اللي محتاجه.",
      interview: [
        { q: "إيه الفرق بين <code>with</code> و<code>load</code>؟", a: "<code>with</code> بتشتغل على الـ query قبل التنفيذ: <code>Listing::with('office')->get()</code>. <code>load</code> بتشتغل على موديل أو collection <b>موجود فعلا</b> في الذاكرة: <code>$listing->load('office')</code>، وبتفيد لما قرار التحميل بيتاخد بعد ما جبت الداتا (مثلا بعد route model binding). الاتنين بيعملوا نفس الاستعلام المجمّع وبيمنعوا الـ N+1." },
      ],
    },
    {
      title: "load و loadMissing و withCount",
      en: "load, loadMissing, withCount",
      body: "<p>مش كل مرة محتاج الـ relation كامل. لو محتاج العدد بس، استخدم <code>withCount</code>: بتضيف عمود <code>photos_count</code> بـ subquery في نفس الاستعلام (1 استعلام فقط بدل N). وبتقبل شرط. و<code>loadMissing</code> بتحمّل بس لو الـ relation مش متحمّل قبل كده.</p>",
      code: {
        lang: "php",
        src: `$listings = Listing::withCount('photos')->get();     // 1 query
echo $listings[0]->photos_count;                       // 3

$listings = Listing::withCount([
    'inquiries as long_inquiries_count' => function ($q) {
        $q->whereRaw('length(message) > 100');
    },
])->get();

$listing = Listing::first();
$listing->load('photos');          // query
$listing->load('photos');          // query again (reloads)
$listing->loadMissing('photos');   // no query: already loaded

$listings = Listing::all();
$listings->load('office');         // ONE query for all of them`,
        note: "<code>withExists('photos')</code> بتديك <code>photos_exists</code> boolean بنفس الفكرة. وفي Laravel الـ <code>load</code> على collection بتعمل استعلام واحد لكلهم.",
      },
      focus: [{ label: "احفظها", text: "محتاج العدد؟ <code>withCount</code>. محتاج البيانات؟ <code>with</code>. الـ model موجود وعايز تضيف؟ <code>load</code> أو <code>loadMissing</code>. ومتعملش <code>$x->relation()->count()</code> جوه loop." }],
      interview: [
        { q: "عايز أعرض عدد الصور لكل إعلان. إزاي من غير N+1؟", a: "<code>Listing::withCount('photos')->get()</code>، فكل إعلان يطلع عنده <code>photos_count</code> من subquery في نفس الاستعلام. مش محتاج أحمّل الصور نفسها. لو عايز عدد بشرط: <code>withCount(['inquiries as recent_inquiries_count' => fn ($q) => $q->where('created_at', '>', now()->subDay())])</code>." },
      ],
    },
    {
      title: "اكتشف الـ N+1 بدري: preventLazyLoading",
      en: "Model::preventLazyLoading",
      body: "<p>بدل ما تدوّر على الـ N+1 بإيدك، خلي Laravel يرمي exception أول ما حد يعمل lazy load. بتفعّلها في الـ <code>AppServiceProvider::boot</code> في الـ local/testing بس، وفي production تسيبها (عشان خطأ زي ده ميوقعش الموقع).</p>",
      codes: [
        {
          lang: "php",
          title: "app/Providers/AppServiceProvider.php",
          src: `use Illuminate\\Database\\Eloquent\\Model;

public function boot(): void
{
    Model::preventLazyLoading(! $this->app->isProduction());
}`,
        },
        {
          lang: "php",
          title: "في أي مكان بعد كده",
          src: `$listings = Listing::all();
echo $listings[0]->office->name;
// LazyLoadingViolationException: Attempted to lazy load [office]
// on model [App\\Models\\Listing] but lazy loading is disabled.`,
          note: "الرسالة اتجربت بالشكل ده. و<code>Model::shouldBeStrict()</code> بتفعّل ده مع حمايات تانية (زي منع قراءة attribute مش موجود) مرة واحدة.",
        },
      ],
      pitfall: "الـ exception مبتتفعلش لو جبت موديل واحد: <code>Listing::first()->office</code> أو <code>find(1)</code> هيعمل lazy load عادي من غير خطأ. الحماية بتشتغل على الموديلات اللي جت في collection من أكتر من عنصر، وده بالظبط الـ N+1.",
      interview: [
        { q: "إزاي تمنع فريقك من إدخال N+1 جديد في الكود؟", a: "بفعّل <code>Model::preventLazyLoading(! app()->isProduction())</code> في الـ AppServiceProvider، فأي lazy load على collection بيرمي <code>LazyLoadingViolationException</code> في الـ local والـ tests والـ CI. كده الـ feature tests نفسها بتكشفه قبل الـ merge. في production بسيبه مقفول عشان الـ lazy load ميبقاش خطأ للمستخدم، أو بسجّله بـ <code>handleLazyLoadingViolationUsing</code>." },
      ],
    },
    {
      title: "كمية البيانات: select و chunk و lazy و cursor",
      en: "select, chunk, chunkById, lazy, cursor",
      body: "<p>لو بتطلّع تقرير على 200 ألف إعلان بـ <code>Listing::all()</code>، الـ PHP هيحمّل 200 ألف موديل في الذاكرة ويقع. اختار حسب الحالة:</p>",
      points: [
        "<code>select('id', 'title')</code>: جيب الأعمدة اللي محتاجها بس (ومتجيبش <code>description</code> النص الطويل لو مش عايزه).",
        "<code>chunk(1000, fn)</code>: بيجيب 1000 كل مرة بـ limit/offset، وبيدّيك الدفعة. مناسب للقراءة.",
        "<code>chunkById(1000, fn)</code>: نفس الفكرة بس بـ <code>where id > last</code>. <b>ده اللي تستخدمه لو بتعدّل</b> أو بتحذف السجلات جوه الـ chunk.",
        "<code>lazy()</code> و<code>lazyById()</code>: نفس chunking تحت الغطاء لكن بتديك <code>LazyCollection</code> فتكتب <code>foreach</code> عادي.",
        "<code>cursor()</code>: استعلام واحد وبيقرا صف صف من الـ PDO. أقل ذاكرة، لكن الـ connection مفتوحة طول الـ loop، ومينفعش معاه eager loading.",
      ],
      code: {
        lang: "php",
        src: `// processes 20 rows, 8 at a time => 3 queries
Listing::chunkById(8, function ($chunk) {
    foreach ($chunk as $listing) {
        $listing->update(['status' => 'archived']);
    }
});

foreach (Listing::lazyById(1000) as $listing) {
    // one model at a time, memory stays flat
}`,
        note: "اتجرب: كل من <code>chunk(8)</code> و<code>chunkById(8)</code> و<code>lazy(8)</code> عملوا 3 استعلامات على 20 صف، و<code>cursor()</code> عمل استعلام واحد.",
      },
      pitfall: "لو عدّلت العمود اللي في شرط الـ query جوه <code>chunk</code> (مثلا فلترت <code>status = published</code> وبتخليه <code>archived</code>)، الصفحات بتتزحلق وبتتخطى سجلات. في التجربة عملنا كده على 20 إعلان وعالج <code>chunk</code> 12 بس، بينما <code>chunkById</code> عالج الـ 20.",
      interview: [
        { q: "إمتى تستخدم <code>chunkById</code> بدل <code>chunk</code>؟ وإيه الفرق بينهم وبين <code>cursor</code>؟", a: "<code>chunk</code> بتستخدم offset، فلو بعدّل أو بحذف صفوف مطابقة لشرط الاستعلام وأنا جوه الـ chunk، الصفحات بتتحرك وبتفوت سجلات. <code>chunkById</code> بتمشي بـ <code>where id > آخر id</code> فهي آمنة للتعديل. <code>cursor</code> بتعمل استعلام واحد وبتنتج موديل موديل (ذاكرة قليلة) لكن بتسيب الـ connection مفتوحة ومبتدعمش eager loading، فبستخدمها للقراءة السريعة فقط. و<code>lazy</code> هي chunking بشكل <code>foreach</code> مريح." },
      ],
    },
    {
      title: "الـ Index: إيه اللي نفهرسه وإزاي نقرا EXPLAIN",
      en: "Indexes and EXPLAIN",
      body: "<p>الـ index زي فهرس الكتاب: الداتابيز بتروح للصف مباشرة بدل ما تقرا الجدول كله (full table scan). نحط index على الأعمدة اللي بتظهر في <code>where</code> و<code>join</code> و<code>order by</code>. والـ foreign keys: MySQL (InnoDB) بيعمل لها index تلقائي، لكن PostgreSQL مبيعملش.</p><p><b>Composite index</b> ترتيبه مهم: <code>index(['status', 'city'])</code> بيخدم <code>where status</code> و<code>where status and city</code> لكن <b>مش</b> <code>where city</code> لوحده (قاعدة الـ leftmost prefix). حط أعمدة المساواة الأول وبعدها عمود الـ range أو الـ sort.</p>",
      code: {
        lang: "php",
        title: "migration + explain",
        src: `Schema::table('listings', function (Blueprint $table) {
    $table->index(['status', 'city']);
});

// in tinker: shows the plan, run it on the real database
Listing::where('status', 'published')
    ->where('city', 'Riyadh')
    ->explain();

// the same as a plain SQL statement (MySQL):
// EXPLAIN SELECT * FROM listings
//   WHERE status = 'published' AND city = 'Riyadh';`,
        note: "في MySQL بصّ على أعمدة: <code>type</code> (لو <code>ALL</code> يبقى full scan وده وحش، و<code>ref</code> أو <code>range</code> أحسن)، <code>key</code> (الـ index اللي اتستخدم، لو <code>NULL</code> يبقى مفيش)، <code>rows</code> (تقدير الصفوف اللي هيقراها)، و<code>Extra</code> (كلمة <code>Using filesort</code> معناها ترتيب مكلف).",
      },
      points: [
        "الـ index بيبطّئ الكتابة ويزوّد المساحة، فمتفهرسش كل عمود.",
        "عمود boolean لوحده (قيمتين بس) index ضعيف الفايدة. دايما فكر في selectivity.",
        "<code>where LOWER(city) = ?</code> أو <code>like '%riyadh'</code> بتكسر استخدام الـ index.",
        "عمود unique (زي البريد) خد unique index وده كمان بيمنع التكرار.",
      ],
      interview: [
        { q: "إزاي تعرف إن استعلام محتاج index؟ وإيه قاعدة الـ composite index؟", a: "أشغّل <code>EXPLAIN</code> على الاستعلام وأبص على <code>type</code> و<code>key</code> و<code>rows</code>: لو <code>type = ALL</code> و<code>key = NULL</code> والـ rows كبيرة يبقى full scan ومحتاج index. الـ composite index بيشتغل بقاعدة leftmost prefix: <code>(status, city)</code> يخدم <code>status</code> أو <code>status + city</code> لكن مش <code>city</code> لوحده. فبرتب الأعمدة بحيث اللي بتتفلتر بالمساواة غالبا تيجي الأول، وعمود الـ range أو الـ order by آخر." },
      ],
    },
    {
      title: "Query builder مقابل Eloquent، و pagination مقابل get",
      en: "Query builder vs Eloquent, paginate vs get",
      body: "<p><code>DB::table('listings')</code> بيرجع <code>stdClass</code> عاديين من غير موديل ولا casts ولا events: أخف وأسرع للتقارير والـ bulk. Eloquent بيبني موديل لكل صف (وزن أكبر) لكن بيدّيك relations وaccessors وcasts. القاعدة: Eloquent للتعامل اليومي مع الكيانات، والـ query builder للتقارير الكبيرة والـ aggregates وعمليات الـ bulk.</p><p>أما <code>get()</code> فبيرجع <b>كل</b> النتيجة. في أي endpoint بيرجع قايمة، استخدم pagination:</p>",
      points: [
        "<code>paginate(15)</code>: استعلامين (count + البيانات) وبيعرف عدد الصفحات الكلي. الـ count على جدول ضخم ممكن يبقى بطيء.",
        "<code>simplePaginate(15)</code>: استعلام واحد، بيعرف \"في صفحة تالية\" بس. مناسب للـ infinite scroll.",
        "<code>cursorPaginate(15)</code>: استعلام واحد وبيمشي بالـ cursor، ثابت مع الجداول الكبيرة والبيانات اللي بتتغير، لكن بترتيب ثابت لازم يكون unique.",
      ],
      code: {
        lang: "php",
        src: `$rows = DB::table('listings')
    ->where('city', 'Riyadh')
    ->get(['id', 'title']);            // Collection of stdClass

$page = Listing::paginate(5);          // 2 queries: count + data
echo $page->total(), ' ', $page->lastPage();   // 20 4

$page = Listing::simplePaginate(5);    // 1 query
$page = Listing::orderBy('id')->cursorPaginate(5);   // 1 query`,
        note: "الأرقام اتجربت على 20 إعلان: <code>paginate</code> استعلامين، و<code>simplePaginate</code> و<code>cursorPaginate</code> استعلام.",
      },
      interview: [
        { q: "ليه مينفعش endpoint يرجع <code>Listing::all()</code>؟", a: "لأنه بيحمّل الجدول كله في الذاكرة ويحوله لـ JSON، فمع نمو الداتا بيبطّأ ويستهلك ذاكرة ويقع، وكمان بيبعت للعميل أكتر مما يحتاج. بستخدم <code>paginate()</code> (أو <code>cursorPaginate()</code> للجداول الكبيرة) وبحدد أقصى <code>per_page</code> من السيرفر. وللتصدير الكبير بستخدم <code>chunkById</code> أو <code>lazy</code> في job مش في request." },
      ],
    },
    {
      title: "DB::transaction: كله أو مفيش",
      en: "Database transactions",
      body: "<p>لو عندك أكتر من كتابة لازم تنجح مع بعض (مثلا إنشاء إعلان + صوره + ربط الـ tags)، لفّها في transaction. لو حصل exception في أي مكان جوه الـ closure، Laravel بيعمل <b>rollback تلقائي</b> ويعيد رمي الـ exception. ولو خلصت بسلام بيعمل commit، والقيمة اللي رجعها الـ closure بتطلع من <code>DB::transaction</code>.</p>",
      code: {
        lang: "php",
        src: `$listing = DB::transaction(function () use ($data, $paths) {
    $listing = Listing::create($data);

    foreach ($paths as $path) {
        $listing->photos()->create(['path' => $path]);
    }

    $listing->tags()->sync($data['tag_ids']);

    return $listing;                  // becomes the return value
});

// retry up to 3 times if MySQL reports a deadlock
DB::transaction(fn () => $this->moveStock(), 3);

DB::transactionLevel();               // 0 outside, 1 inside`,
        note: "اتجرب: exception جوه الـ transaction بيرجّع التعديل (العنوان بيفضل زي ما كان). وآخر رقم في التجربة: <code>transactionLevel()</code> بيرجع 1 جوه و2 في nested.",
      },
      pitfall: "لو عملت <code>try/catch</code> جوه الـ closure وبلعت الـ exception، Laravel مش هيعرف إن في خطأ فهيعمل commit. خلي الـ exception يطلع. وكمان الـ transaction مبترجّعش حاجة غير الداتابيز: إيميل اتبعت أو API خارجي اتنادى أو ملف اتكتب مش هيرجع.",
      focus: [{ label: "Nested", text: "transaction جوه transaction بتتحول لـ savepoint. لو الداخلية فشلت واتمسكت برا، التعديلات بتاعتها بس بترجع (اتجربت: <code>OUTER</code> فضل و<code>INNER</code> اتلغى)، والخارجية تكمل. لو الخطأ طلع لبرا الخارجية كمان، كله بيترجع." }],
      interview: [
        { q: "إيه اللي بيحصل لو حصل exception جوه <code>DB::transaction</code>؟ وإيه عن الـ nested؟", a: "بيتعمل rollback لكل اللي اتكتب جوه الـ closure والـ exception بيتعاد رميه. لو في transaction جوه transaction، الداخلية بتتحول لـ savepoint، فلو فشلت بترجع تغييراتها هي بس، ولو الخطأ وصل للخارجية كلها بترجع. وبحط في بالي إن أي حاجة برا الداتابيز (إيميل، API) مبترجعش، فبعملها بعد الـ commit." },
      ],
    },
    {
      title: "lockForUpdate: آخر وحدة متاحة",
      en: "Pessimistic locking and race conditions",
      body: "<p>مكتب عنده وحدة واحدة متاحة، وعميلين ضغطوا \"احجز\" في نفس اللحظة. الاتنين قرأوا <code>units_left = 1</code>، الاتنين قالوا \"تمام\"، الاتنين نقصوا: النتيجة -1 وحجزين لنفس الوحدة. ده race condition.</p><p>الحل: <code>lockForUpdate()</code> جوه transaction. بيقفل الصف (<code>select ... for update</code>)، فالطلب التاني يستنى لحد ما الأول يعمل commit، وبعدين يقرا القيمة الجديدة (0) ويرفض.</p>",
      code: {
        lang: "php",
        src: `function reserve(int $id): string
{
    return DB::transaction(function () use ($id) {
        $listing = Listing::lockForUpdate()->findOrFail($id);

        if ($listing->units_left < 1) {
            return 'sold out';
        }

        $listing->decrement('units_left');
        return 'reserved';
    });
}
// first call: reserved, second call: sold out

// alternative without a lock: one atomic statement
$taken = Listing::where('id', $id)
    ->where('units_left', '>', 0)
    ->decrement('units_left');          // 1 if it worked, 0 if not`,
        note: "الاتنين اتجربوا: النتيجة <code>reserved</code> ثم <code>sold out</code>، والـ decrement الشرطي رجّع 1 ثم 0. القفل الفعلي بيحصل على MySQL أو PostgreSQL (SQLite مبيدعمش الـ row lock وبيتجاهله).",
      },
      pitfall: "<code>lockForUpdate</code> برا transaction مالوش أي أثر، لأن القفل بيتشال أول ما الاستعلام يخلص. ومتخليش الـ transaction طويلة (أي استدعاء شبكة جواها) لأنها بتوقف الباقيين.",
      interview: [
        { q: "عميلين حجزوا آخر وحدة في نفس اللحظة. إزاي تمنع الحجز المزدوج؟", a: "أفتح <code>DB::transaction</code> وأقرا الصف بـ <code>lockForUpdate()</code> فالطلب التاني يستنى، وبعد الـ commit يقرا القيمة المحدّثة ويرفض. أو بدون قفل، تحديث ذري في استعلام واحد: <code>where units_left > 0</code> مع <code>decrement</code> وأتأكد إن عدد الصفوف المتأثرة 1. وفي الحالتين بحط كمان unique أو constraint في الداتابيز كحماية أخيرة." },
        { q: "إمتى تستخدم optimistic locking مقابل pessimistic؟", a: "الـ pessimistic (<code>lockForUpdate</code>) بيقفل الصف من الأول فمناسب لما التضارب متوقع وكتير (مخزون، رصيد). الـ optimistic مبيقفلش، بتحط عمود version وتعمل update بشرط إن النسخة لسه زي ما قريتها وتشوف عدد الصفوف المتأثرة، ولو صفر تعيد المحاولة. مناسب لما التضارب نادر. Laravel مفيهوش optimistic locking جاهز، بتبنيه بإيدك." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: eager loading و withCount",
      lang: "php",
      code: `<?php
$listings = Listing::query()
    ->with(['office:id,name', 'photos'])
    ->withCount('inquiries')
    ->where('status', 'published')
    ->latest('published_at')
    ->get();

foreach ($listings as $listing) {
    echo $listing->office->name, ' ';
    echo $listing->inquiries_count, "\\n";
}`,
    },
    {
      title: "اكتب: transaction و lockForUpdate",
      lang: "php",
      code: `<?php
use Illuminate\\Support\\Facades\\DB;

function reserve(int $id): bool
{
    return DB::transaction(function () use ($id) {
        $item = Listing::lockForUpdate()->findOrFail($id);
        if ($item->units_left < 1) {
            return false;
        }
        $item->decrement('units_left');
        return true;
    });
}`,
    },
    {
      title: "اكتب: chunkById و index",
      lang: "php",
      code: `<?php
Schema::table('listings', function (Blueprint $table) {
    $table->index(['status', 'city']);
});

Listing::where('status', 'draft')
    ->chunkById(500, function ($chunk) {
        foreach ($chunk as $listing) {
            $listing->update(['status' => 'archived']);
        }
    });`,
    },
  ],

  tasks: [
    {
      title: "أصلح الـ N+1",
      lang: "php",
      prompt: "<p>الدالة <code>officeNames()</code> دي بتعمل N+1 (وعمود <code>photos</code> كمان). اكتبها تاني بحيث تعمل <b>استعلامين بالظبط</b> مهما كان عدد الإعلانات (واحد للإعلانات مع عدد الصور، وواحد للمكاتب)، وتجيب من الإعلان بس الأعمدة <code>id</code> و<code>title</code> و<code>office_id</code>. ترجع array من النصوص بالشكل <code>\"title (office, N photos)\"</code>.</p>",
      examples: [{ in: "officeNames()", out: "['Cozy flat (Alpha Office, 3 photos)', ...]" }],
      starter: `<?php
function officeNames(): array
{
    $out = [];
    foreach (Listing::all() as $l) {
        $out[] = $l->title . ' (' . $l->office->name . ', '
            . $l->photos()->count() . ' photos)';
    }
    return $out;
}`,
      hints: [
        "المكاتب بـ <code>with</code>، وعدد الصور بـ <code>withCount</code> (بتدخل كـ subquery في استعلام الإعلانات نفسه).",
        "ابدأ بـ <code>Listing::select(...)</code> وبعدين <code>->with('office:id,name')->withCount('photos')->get()</code>.",
        "متنساش تضيف <code>office_id</code> في الـ select، وإلا الـ with مش هيقدر يربط.",
      ],
      solution: `<?php
function officeNames(): array
{
    $listings = Listing::select('id', 'title', 'office_id')
        ->with('office:id,name')
        ->withCount('photos')
        ->get();

    return $listings->map(fn ($l) => $l->title . ' ('
        . $l->office->name . ', '
        . $l->photos_count . ' photos)')->all();
}`,
      explain: "الحل بيعمل <b>2 استعلام</b> (إعلانات مع subquery للعدد، ومكاتب)، وده أقل من الحد المطلوب. المهم الفكرة: <code>select</code> لازم يشمل المفتاح الأجنبي، و<code>withCount</code> بدل استعلام count لكل صف.",
    },
    {
      title: "حجز آمن من الـ race condition",
      lang: "php",
      prompt: "<p>اكتب <code>reserveUnit(int $listingId): bool</code>. جوه transaction: اقرا الإعلان بـ <code>lockForUpdate</code>، لو <code>units_left</code> أقل من 1 رجّع <code>false</code>، غير كده انقص واحد وسجّل inquiry جديدة (<code>user_id</code> بياخدها من <code>auth()->id()</code>، والرسالة <code>'reserved'</code>) ورجّع <code>true</code>. لو تسجيل الـ inquiry فشل، النقص لازم يترجع.</p>",
      examples: [
        { in: "units_left = 1: reserveUnit(5) ثم reserveUnit(5)", out: "true ثم false" },
      ],
      hints: [
        "كله جوه <code>DB::transaction(function () use ($listingId) { ... })</code> وبترجع القيمة منها.",
        "<code>Listing::lockForUpdate()->findOrFail($listingId)</code>.",
        "الـ inquiry بـ <code>$listing->inquiries()->create([...])</code>.",
      ],
      solution: `<?php
use Illuminate\\Support\\Facades\\DB;

function reserveUnit(int $listingId): bool
{
    return DB::transaction(function () use ($listingId) {
        $listing = Listing::lockForUpdate()->findOrFail($listingId);

        if ($listing->units_left < 1) {
            return false;
        }

        $listing->decrement('units_left');
        $listing->inquiries()->create([
            'user_id' => auth()->id(),
            'message' => 'reserved',
        ]);

        return true;
    });
}`,
      explain: "القفل بيخلي التاني يستنى، والـ transaction بتضمن إن النقص والـ inquiry ينجحوا مع بعض أو يترجعوا مع بعض. الـ exception من <code>create</code> بيطلع من الـ closure فيحصل rollback تلقائي.",
    },
    {
      title: "تعديل دفعات كبيرة بأمان",
      lang: "php",
      prompt: "<p>اكتب دالة <code>archiveOld(): int</code> بتأرشف (status = <code>archived</code>) كل الإعلانات اللي حالتها <code>published</code> و<code>published_at</code> أقدم من 90 يوم، وترجع عدد اللي اتأرشفوا. افترض الجدول ضخم، وعدّل كل إعلان بالموديل (علشان الـ events تشتغل). ما تستخدمش <code>all()</code> ولا <code>get()</code>، وما تستخدمش <code>chunk</code> العادي.</p>",
      examples: [{ in: "archiveOld()", out: "12" }],
      hints: [
        "دفعات بدون offset: <code>chunkById(500, function ($chunk) { ... })</code>.",
        "عدّاد خارجي بـ <code>use (&amp;$count)</code>.",
      ],
      solution: `<?php
function archiveOld(): int
{
    $count = 0;

    Listing::where('status', 'published')
        ->where('published_at', '<', now()->subDays(90))
        ->chunkById(500, function ($chunk) use (&$count) {
            foreach ($chunk as $listing) {
                $listing->update(['status' => 'archived']);
                $count++;
            }
        });

    return $count;
}`,
      explain: "بنعدّل عمود <code>status</code> اللي هو في شرط الـ query، فلازم <code>chunkById</code> (مع <code>chunk</code> كنا هنفوّت سجلات). لو مش محتاج الـ events كان الأسرع <code>Listing::where(...)->update([...])</code> في استعلام واحد.",
    },
  ],

  quiz: [
    {
      q: "عندك 50 إعلان. الكود ده كام استعلام بيعمل؟",
      code: { lang: "php", src: `$listings = Listing::all();
foreach ($listings as $l) {
    echo $l->office->name;
}` },
      answer: ["51"],
      why: "استعلام واحد للإعلانات + استعلام لكل إعلان للمكتب (lazy load) = 1 + 50 = 51. نفس الكود مع <code>with('office')</code> هيبقى 2.",
    },
    {
      q: "كام استعلام هنا (على 50 إعلان)؟",
      code: { lang: "php", src: `$listings = Listing::with('office.owner', 'photos')->get();
foreach ($listings as $l) {
    echo $l->office->owner->name, $l->photos->count();
}` },
      options: ["52", "151", "2", "4"],
      answer: 3,
      why: "استعلام لكل مستوى: listings، offices، users (owner)، photos = 4، ومهما كان عدد الإعلانات. الـ 52 و151 هي أرقام الـ N+1 لو مفيش eager loading.",
    },
    {
      q: "أنهي سطر بيعمل استعلام جديد حتى لو الـ photos عاملها eager load؟",
      options: [
        "<code>$l->photos->count()</code>",
        "<code>$l->photos()->count()</code>",
        "<code>$l->photos->first()</code>",
        "<code>$l->relationLoaded('photos')</code>",
      ],
      answer: 1,
      why: "الأقواس بترجّع الـ relation builder فبتبني استعلام <code>count</code> جديد في الداتابيز. من غير أقواس بتشتغل على الـ collection اللي في الذاكرة.",
    },
    {
      q: "إيه الأنسب لعرض <code>عدد</code> الاستفسارات لكل إعلان؟",
      options: [
        "<code>with('inquiries')</code> وبعدين <code>$l->inquiries->count()</code>",
        "<code>$l->inquiries()->count()</code> في الـ loop",
        "<code>withCount('inquiries')</code> وقراءة <code>inquiries_count</code>",
        "<code>cursor()</code>",
      ],
      answer: 2,
      why: "<code>withCount</code> بتجيب العدد كـ subquery في نفس الاستعلام من غير ما تحمّل الـ inquiries نفسها. الخيار الأول شغال (مفيهوش N+1) لكنه بيحمّل كل الاستفسارات في الذاكرة بس عشان تعدها.",
    },
    {
      q: "الـ <code>preventLazyLoading(true)</code> مفعّلة. الكود ده هيحصل فيه إيه؟",
      code: { lang: "php", src: `$listing = Listing::first();
echo $listing->office->name;` },
      options: [
        "بيرمي LazyLoadingViolationException",
        "بيشتغل عادي من غير exception",
        "بيرجع null",
        "بيعمل eager load تلقائي",
      ],
      answer: 1,
      why: "الحماية بتشتغل على الموديلات اللي جت في collection من أكتر من عنصر. موديل واحد من <code>first()</code> بيعمل lazy load عادي، فالـ N+1 الحقيقي (<code>all()</code> أو <code>get()</code> ثم loop) هو اللي بيتكشف.",
    },
    {
      q: "بتأرشف إعلانات جوه chunk وبتغيّر الـ status اللي في الـ where. إيه الصح؟",
      code: { lang: "php", src: `Listing::where('status', 'published')->chunk(500, function ($rows) {
    foreach ($rows as $r) {
        $r->update(['status' => 'archived']);
    }
});` },
      options: [
        "ده سليم تماما",
        "بيفوّت سجلات لأن الـ offset بيتزحلق، والمفروض <code>chunkById</code>",
        "الأفضل <code>cursor()</code> لأنه بيدعم التعديل",
        "لازم <code>all()</code> الأول",
      ],
      answer: 1,
      why: "كل ما الصفوف بتخرج من الشرط، الـ offset بيتخطى صفوف لسه ما اتعالجتش (في تجربتنا 12 من 20). <code>chunkById</code> بيمشي بـ <code>id &gt; آخر id</code> فبيتفادى المشكلة.",
    },
    {
      q: "عندك index على <code>(status, city)</code>. أنهي استعلام <b>مش</b> هيستفيد منه؟",
      options: [
        "<code>where status = 'published'</code>",
        "<code>where status = 'published' and city = 'Riyadh'</code>",
        "<code>where city = 'Riyadh'</code>",
        "<code>where status = 'published' order by city</code>",
      ],
      answer: 2,
      why: "قاعدة الـ leftmost prefix: الـ index بيبدأ بـ status، فاستعلام على city لوحده مبيقدرش يستخدمه. باقي الاستعلامات بتبدأ بـ status.",
    },
    {
      q: "بتلف كتابتين في <code>DB::transaction</code> والتانية رمت exception. الأولى حصلها إيه؟",
      code: { lang: "php", src: `DB::transaction(function () {
    Listing::first()->update(['title' => 'A']);
    throw new RuntimeException('boom');
});` },
      options: [
        "اتحفظت، لأن الـ update نجح",
        "اتحفظت لو فيه try/catch برا الـ closure",
        "اتحفظت بس بعد retry",
        "ترجعت (rollback) والـ exception اتعاد رميه",
      ],
      answer: 3,
      why: "أي exception يطلع من الـ closure بيعمل rollback كامل ويتعاد رميه. الـ try/catch برا مش بيغيّر ده. الاستثناء الوحيد لو بلعت الـ exception جوه الـ closure نفسه فهيحصل commit.",
    },
    {
      q: "الناتج إيه؟ (<code>units_left = 1</code> قبل الكود)",
      code: { lang: "php", src: `$a = Listing::where('id', 7)->where('units_left', '>', 0)
    ->decrement('units_left');
$b = Listing::where('id', 7)->where('units_left', '>', 0)
    ->decrement('units_left');
echo "$a / $b";` },
      answer: ["1 / 0", "1/0"],
      why: "<code>decrement</code> على query بيرجع عدد الصفوف المتأثرة. الأولى غيّرت صف واحد (1)، والتانية الشرط <code>units_left > 0</code> مبقاش متحقق فرجعت 0. ده حجز ذري من غير قفل.",
    },
    {
      q: "<code>lockForUpdate()</code> مش بتحمي من الـ race condition هنا. ليه؟",
      code: { lang: "php", src: `$l = Listing::lockForUpdate()->find($id);
if ($l->units_left > 0) {
    $l->decrement('units_left');
}` },
      options: [
        "لأن <code>find</code> مبتدعمش القفل",
        "لأن <code>decrement</code> مش آمنة أصلا",
        "لأن مفيش <code>DB::transaction</code>، فالقفل بيتشال أول ما الاستعلام يخلص",
        "لأن لازم <code>sharedLock</code> بدله",
      ],
      answer: 2,
      why: "القفل بيعيش لحد نهاية الـ transaction. من غير transaction، كل استعلام transaction لوحده والقفل بيتشال فورا، فالطلب التاني يقدر يقرا نفس القيمة. لازم تلف القراءة والتعديل في <code>DB::transaction</code>.",
    },
  ],
};
