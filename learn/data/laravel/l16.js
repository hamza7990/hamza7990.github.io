window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l16"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "الاختبارات: شبكة الأمان اللي بتخليك تغيّر الكود بجرأة",
      en: "Why tests",
      body: "<p>مشروعك اتبنى بمساعدة وكل يوم بتضيف feature. من غير اختبارات، كل تعديل = «يا رب ما أكسرش حاجة تانية». الاختبار كود بيشغّل التطبيق بسيناريو ويتأكد من النتيجة، وبتشغّله بأمر واحد في ثواني. وده بالظبط اللي بتتسأل عنه في الإنترفيو: مش «هل بتكتب tests» لكن «إيه اللي بتختبره وإزاي».</p>",
      points: [
        "<b>Feature test:</b> بيشغّل جزء كبير من التطبيق (ريكويست HTTP كامل: route + middleware + controller + داتابيز) ويتأكد من الرد. ده اللي هتكتب منه الأكتر في Laravel.",
        "<b>Unit test:</b> بيختبر class أو method صغيرة معزولة، من غير داتابيز أو HTTP (مثلا حسبة السعر). سريع جدا.",
        "المجلدين الجاهزين: <code>tests/Feature</code> و<code>tests/Unit</code>. الإطار الافتراضي <b>PHPUnit</b>، وفيه بديل بصياغة أقصر اسمه <b>Pest</b> (بتختاره وقت إنشاء المشروع). المبادئ واحدة؛ أمثلتنا بصيغة PHPUnit.",
        "التست الجيد: سريع، مستقل (مش بيعتمد على تست تاني)، وبيفشل لسبب واحد واضح.",
      ],
      interview: [
        { q: "إيه الفرق بين feature test و unit test في Laravel؟", a: "الـ unit test بيختبر وحدة صغيرة معزولة (class أو method) من غير ما يبوت التطبيق أو يلمس الداتابيز، فهو سريع وبيحدد المشكلة بدقة. الـ feature test بيشغّل التطبيق فعلا: بيبعت ريكويست HTTP لـ route حقيقي ويعدي على middleware وcontroller وvalidation والداتابيز ويتأكد من الرد والأثر. في Laravel أغلب القيمة في الـ feature tests لأن الأخطاء بتبقى غالبا في الربط بين الأجزاء." },
      ],
    },
    {
      title: "تشريح تست وتشغيله",
      en: "Anatomy of a test and running it",
      body: "<p>الكلاس بيمتد من <code>Tests\\TestCase</code> (اللي بيبوت التطبيق). كل method اسمها بتبدأ بـ <code>test_</code> (أو عليها attribute <code>#[Test]</code>) هي تست. والشكل المقروء: <b>Arrange</b> جهّز البيانات، <b>Act</b> نفّذ الفعل، <b>Assert</b> اتأكد من النتيجة.</p>",
      codes: [
        {
          lang: "php",
          title: "tests/Feature/ListingApiTest.php",
          src: `<?php

namespace Tests\\Feature;

use App\\Models\\Listing;
use App\\Models\\Office;
use Illuminate\\Foundation\\Testing\\RefreshDatabase;
use Tests\\TestCase;

class ListingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_only_published_listings(): void
    {
        // arrange
        $office = Office::factory()->create();
        Listing::factory()->published()->count(2)->for($office)->create();
        Listing::factory()->for($office)->create();   // a draft

        // act
        $response = $this->getJson('/api/listings');

        // assert
        $response->assertOk()->assertJsonCount(2);
    }
}`,
          note: "اتشغّل بنجاح على Laravel 11.57. اسم التست جملة بتقول إيه المتوقع.",
        },
        {
          lang: "bash",
          title: "تشغيل",
          src: `php artisan make:test ListingApiTest          # tests/Feature
php artisan make:test ListingPriceTest --unit  # tests/Unit

php artisan test                               # everything
php artisan test tests/Feature/ListingApiTest.php   # one file
php artisan test --filter=test_store_creates_a_listing   # by name
php artisan test --filter=ListingApiTest::test_index    # class::method
php artisan test --stop-on-failure             # stop at the first red
php artisan test --compact                     # dots instead of lines`,
          note: "الـ <code>--filter</code> بتطابق جزء من اسم الـ method أو الكلاس، فبتشغّل تست واحد بسرعة وإنت بتشتغل على bug. جربت كلها. و<code>--parallel</code> موجودة بس محتاجة package اسمه paratest.",
        },
      ],
      focus: [{ label: "احفظها", text: "ابدأ التست <b>أحمر</b>: لما تصلّح bug، اكتب تست بيفشل بسببه الأول، وبعدين صلّح الكود لحد ما يعدي. كده متأكد إن التست بيختبر الحاجة فعلا وإن البق ما يرجعش." }],
    },
    {
      title: "الداتابيز في الاختبارات: RefreshDatabase و factories",
      en: "RefreshDatabase and factories",
      body: "<p>الاختبار لازم يبدأ من حالة نضيفة، ومينفعش يلمس داتابيز التطوير بتاعتك. الـ trait <code>RefreshDatabase</code> بيشغّل الـ migrations مرة واحدة، وبعد كده بيلف كل تست في transaction ويعمل لها rollback في الآخر، فكل تست بيبدأ بجداول فاضية وسريع. الـ factories (المستوى 4) بتبني البيانات اللي التست محتاجها في سطر.</p>",
      code: {
        lang: "php",
        src: `<?php

use Illuminate\\Foundation\\Testing\\RefreshDatabase;

class ListingApiTest extends TestCase
{
    use RefreshDatabase;     // clean DB for every test

    public function test_example(): void
    {
        $office = Office::factory()->create();            // saved row

        Listing::factory()->published()->for($office)->count(3)->create();

        $draft = Listing::factory()->make();              // NOT saved
        $featured = Listing::factory()->featured()->create(['price' => 500000]);

        $this->assertDatabaseCount('listings', 4);
    }
}`,
        note: "<code>create()</code> بتحفظ، <code>make()</code> بتبني object من غير حفظ. الـ states (<code>published()</code> و<code>featured()</code>) بتخلي التست يقول المعنى. والـ <code>for($office)</code> بتربط العلاقة. الاختبارات بتستخدم إعدادات <code>phpunit.xml</code> (<code>APP_ENV=testing</code> و<code>CACHE_STORE=array</code> و<code>QUEUE_CONNECTION=sync</code> و<code>MAIL_MAILER=array</code>) فمفيش كاش أو إيميل حقيقي. في مشروع Laravel 11 جديد الـ phpunit.xml بيستخدم SQLite في الذاكرة، وده أسرع طريقة.",
      },
      pitfall: "من غير <code>RefreshDatabase</code> البيانات بتتراكم بين التستات، فتست بينجح لوحده وبيفشل مع غيره (أو العكس) بسبب ترتيب التشغيل، وده أصعب نوع bugs في الاختبارات. وكمان لو <code>phpunit.xml</code> مش بيحدد داتابيز اختبار ممكن تمسح داتابيز التطوير بالغلط: اتأكد قبل أول تشغيل.",
      interview: [
        { q: "إزاي بتتعامل مع الداتابيز في الاختبارات؟", a: "بستخدم trait <code>RefreshDatabase</code> اللي بيشغّل الـ migrations مرة وبيلف كل تست في transaction بتتلغي في الآخر، فكل تست بيبدأ نضيف وسريع. بجهّز البيانات بالـ factories بدل SQL يدوي، وبظبط الداتابيز في <code>phpunit.xml</code> لقاعدة بيانات اختبار منفصلة (غالبا SQLite في الذاكرة) عشان ما ألمسش داتا التطوير. وبتأكد من الأثر بـ <code>assertDatabaseHas</code> و<code>assertDatabaseMissing</code>." },
      ],
    },
    {
      title: "اختبار الـ HTTP: getJson و postJson والـ assertions",
      en: "HTTP tests",
      body: "<p>بتبعت ريكويست لـ app بتاعك من غير سيرفر حقيقي: <code>$this->getJson($uri)</code> و<code>postJson($uri, $data)</code> و<code>putJson</code> و<code>patchJson</code> و<code>deleteJson</code>. بتضيف header <code>Accept: application/json</code> فالأخطاء ترجع JSON (مش redirect). وبترجع <code>TestResponse</code> عليها assertions متسلسلة.</p>",
      code: {
        lang: "php",
        src: `<?php

public function test_store_creates_a_listing(): void
{
    $office = Office::factory()->create();

    $this->postJson('/api/listings', [
        'office_id' => $office->id,
        'title' => 'Sea villa',
        'price' => 900000,
        'bedrooms' => 4,
    ])
        ->assertCreated()                                   // 201
        ->assertJsonPath('title', 'Sea villa')              // nested path
        ->assertJsonPath('price', 900000)
        ->assertJsonStructure(['id', 'title', 'price']);    // keys exist

    $this->assertDatabaseHas('listings', [
        'title' => 'Sea villa',
        'office_id' => $office->id,
    ]);
}`,
        note: "اتشغّل ونجح. أهم الـ assertions: الحالة <code>assertOk</code> (200) و<code>assertCreated</code> (201) و<code>assertNoContent</code> (204) و<code>assertNotFound</code> و<code>assertUnauthorized</code> (401) و<code>assertForbidden</code> (403) و<code>assertUnprocessable</code> (422) أو <code>assertStatus(n)</code>. الـ JSON: <code>assertJson([...])</code> (يحتوي على) و<code>assertExactJson</code> و<code>assertJsonPath</code> و<code>assertJsonCount</code> و<code>assertJsonMissing</code>. الداتابيز: <code>assertDatabaseHas</code> و<code>assertDatabaseMissing</code> و<code>assertDatabaseCount</code> و<code>assertSoftDeleted</code>.",
      },
      pitfall: "لازم تتأكد من <b>الأثر</b> مش بس الرد: <code>assertCreated()</code> لوحده ممكن ينجح حتى لو الكود نسي يحفظ في الداتابيز. دايما اربط الـ status بـ <code>assertDatabaseHas</code> (أو العكس <code>assertDatabaseMissing</code> في الحالات السلبية). وتجنب مقارنة JSON كامل بـ <code>assertExactJson</code> لما فيه timestamps وids متغيرة؛ استخدم <code>assertJsonPath</code>.",
    },
    {
      title: "اختبار الـ validation",
      en: "Testing validation",
      body: "<p>الـ validation أرخص حاجة تختبرها وأكتر حاجة بتتكسر. اختبر إن بيانات غلط بترجع <code>422</code> بالخطأ على الحقل الصح <b>ومن غير ما تتحفظ</b>. ولو عندك أكتر من قيمة غلط لنفس الحقل استخدم <b>data provider</b> بدل ما تكرر التست.</p>",
      code: {
        lang: "php",
        src: `<?php

use PHPUnit\\Framework\\Attributes\\DataProvider;

public function test_store_rejects_an_empty_payload(): void
{
    $this->postJson('/api/listings', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['office_id', 'title', 'price', 'bedrooms']);

    $this->assertDatabaseCount('listings', 0);
}

#[DataProvider('badPrices')]
public function test_price_must_be_a_positive_integer(mixed $price): void
{
    $office = Office::factory()->create();

    $this->postJson('/api/listings', [
        'office_id' => $office->id, 'title' => 'Flat',
        'price' => $price, 'bedrooms' => 2,
    ])->assertJsonValidationErrors('price');
}

public static function badPrices(): array
{
    return ['zero' => [0], 'negative' => [-5], 'text' => ['cheap']];
}`,
        note: "اتشغّل: التست الأول وثلاث تستات من الـ provider (zero و negative و text) نجحوا. في PHPUnit 11 (اللي مع Laravel 11) الـ provider لازم تكون method <code>static</code> وبتتربط بـ attribute <code>#[DataProvider('اسم')]</code> (الـ annotation القديم <code>@dataProvider</code> اتشال). <code>assertJsonValidationErrors</code> بتتأكد إن الحقل في <code>errors</code>.",
      },
      interview: [
        { q: "إزاي بتختبر إن الـ validation شغال؟", a: "بابعت payload غلط بـ <code>postJson</code> وأتأكد من <code>assertUnprocessable()</code> (422) و<code>assertJsonValidationErrors(['title'])</code> على الحقول المتوقعة، وبعدها <code>assertDatabaseCount</code> أو <code>assertDatabaseMissing</code> إن مفيش حاجة اتحفظت. ولو في قيم غلط كتير لنفس الحقل بستخدم data provider. وببعت payload صحيح كمان عشان أتأكد إن القاعدة مش بترفض الصح." },
      ],
    },
    {
      title: "المصادقة والصلاحيات: actingAs و Sanctum::actingAs",
      en: "Authentication and policy tests",
      body: "<p>مش لازم تعمل login حقيقي في التست. <code>$this->actingAs($user)</code> بيخلي الريكويست كأن المستخدم ده مسجل (session guard). وللـ API بـ Sanctum استخدم <code>Sanctum::actingAs($user)</code> (لازم الـ User يستخدم <code>HasApiTokens</code>). وللـ policies اختبر التلات حالات: من غير تسجيل (401)، مسجل بس مش مسموح له (403)، ومسموح (200).</p>",
      code: {
        lang: "php",
        title: "route: POST /api/listings/{listing}/publish  ->  auth:sanctum + can:update,listing",
        src: `<?php

use Laravel\\Sanctum\\Sanctum;

public function test_guest_cannot_publish(): void
{
    $listing = Listing::factory()->create();

    $this->postJson("/api/listings/{$listing->id}/publish")
        ->assertUnauthorized();                               // 401
}

public function test_another_office_cannot_publish(): void
{
    $listing = Listing::factory()->create();
    $stranger = User::factory()->create([
        'office_id' => Office::factory()->create()->id,
    ]);

    Sanctum::actingAs($stranger);

    $this->postJson("/api/listings/{$listing->id}/publish")
        ->assertForbidden();                                  // 403

    $this->assertDatabaseHas('listings', ['id' => $listing->id, 'status' => 'draft']);
}`,
        note: "اتشغّلوا ونجحوا مع policy بسيطة: <code>update(User $user, Listing $listing)</code> بترجّع <code>$user->office_id === $listing->office_id</code>. (الـ policies نفسها مشروحة في المستوى 9.) لاحظ الـ <code>assertDatabaseHas</code> الأخير: بيثبت إن الرفض فعلا منع التغيير.",
      },
      pitfall: "اختبار الـ «happy path» بس هو أشهر ثغرة أمان تتفوت: اختبر دايما مستخدم <b>من مكتب تاني</b> (IDOR) وزائر غير مسجل. تست واحد من النوع ده بيمسك أخطر bugs. وللتوضيح: جربت إن <code>$this->actingAs($user)</code> العادية كمان بتعدي على <code>auth:sanctum</code>، لكن <code>Sanctum::actingAs($user, ['listings:write'])</code> هي اللي بتخليك تختبر الـ token abilities.",
      interview: [
        { q: "إزاي بتختبر endpoint محمي بـ Sanctum وبـ policy؟", a: "بـ <code>Sanctum::actingAs($user)</code> بدل login حقيقي. وبكتب ثلاث حالات: زائر من غير تسجيل بيرجع 401، مستخدم مسجل لكن مش صاحب المورد (من مكتب تاني) بيرجع 403 ومفيش تغيير في الداتابيز، وصاحب المورد بينجح. الحالة التانية هي اللي بتمسك ثغرات الـ IDOR." },
      ],
    },
    {
      title: "الـ fakes (1): Event و Queue",
      en: "Event::fake and Queue::fake",
      body: "<p>لما الكود بيعمل side effect (إيميل، job، event)، مش عايز التست يبعت إيميل فعلي أو يشغّل job تقيل. الـ <b>fake</b> بيستبدل الخدمة الحقيقية بنسخة تسجّل اللي حصل، وبعدها بتتأكد بـ assertion. بتنادي الـ fake <b>قبل</b> الفعل، والـ assert بعده.</p>",
      code: {
        lang: "php",
        src: `<?php

use App\\Events\\ListingPublished;
use App\\Jobs\\SyncListingToSearch;
use Illuminate\\Support\\Facades\\Event;
use Illuminate\\Support\\Facades\\Queue;

public function test_owner_publishes_and_side_effects_run(): void
{
    Event::fake([ListingPublished::class]);     // only this event
    Queue::fake();

    $listing = Listing::factory()->create();
    $owner = User::factory()->create(['office_id' => $listing->office_id]);
    Sanctum::actingAs($owner);

    $this->postJson("/api/listings/{$listing->id}/publish")
        ->assertOk()
        ->assertJsonPath('status', 'published');

    Event::assertDispatched(ListingPublished::class, fn ($e) => $e->listing->is($listing));
    Queue::assertPushed(SyncListingToSearch::class, 1);   // exactly once
    // Queue::assertNothingPushed();  Event::assertNotDispatched(...)
}`,
        note: "اتشغّل ونجح. الـ closure في <code>assertDispatched</code> بتفلتر: «حصل event من النوع ده <b>وبالشروط دي</b>». ولاحظ إن الـ job ما اتنفذش، اتسجل بس. اختبار الـ job نفسه (<code>handle</code>) تست منفصل.",
      },
      pitfall: "<code>Event::fake()</code> من غير قايمة بتبلع <b>كل</b> الأحداث ومعاها model events (<code>creating</code> و<code>saved</code>...) فالـ observers والـ hooks ما بتشتغلش في التست وبتبان أخطاء غريبة (جربت: hook على <code>creating</code> ما اتنفذش بعد <code>Event::fake()</code>). مرّر القايمة <code>Event::fake([MyEvent::class])</code> دايما.",
    },
    {
      title: "الـ fakes (2): Notification و Mail و Storage و Http",
      en: "More fakes",
      codes: [
        {
          lang: "php",
          title: "Notification::fake() and Mail::fake()",
          src: `<?php

public function test_inquiry_notifies_the_office_users(): void
{
    Notification::fake();

    $listing = Listing::factory()->published()->create();
    $agent = User::factory()->create(['office_id' => $listing->office_id]);
    $outsider = User::factory()->create();

    $this->postJson('/api/inquiries', [
        'listing_id' => $listing->id,
        'message' => 'Is it still available?',
    ])->assertCreated();

    Notification::assertSentTo($agent, NewInquiry::class);
    Notification::assertNotSentTo($outsider, NewInquiry::class);
    // Notification::assertNothingSent();  Notification::assertCount(1);
}

// Mail: a queued mailable counts as queued, not sent
Mail::fake();
Mail::to('owner@example.com')->send(new InquiryReceived($inquiry));
Mail::assertQueued(InquiryReceived::class);
Mail::assertNotSent(InquiryReceived::class);`,
        },
        {
          lang: "php",
          title: "Storage::fake() and Http::fake()",
          src: `<?php

public function test_photo_upload_is_stored(): void
{
    Storage::fake('public');
    $listing = Listing::factory()->create();

    $this->postJson("/api/listings/{$listing->id}/photos", [
        'photo' => UploadedFile::fake()->image('villa.jpg', 800, 600),
    ])->assertCreated();

    Storage::disk('public')->assertExists($listing->photos()->first()->path);
}

public function test_geocoder_reads_coordinates(): void
{
    Http::fake([
        'maps.example.com/*' => Http::response(['lat' => 24.71, 'lng' => 46.67]),
    ]);

    $result = app(Geocoder::class)->lookup('Riyadh');

    $this->assertSame(['lat' => 24.71, 'lng' => 46.67], $result);
    Http::assertSent(fn (Request $r) => str_contains($r->url(), 'q=Riyadh'));
}`,
          note: "كل ده اتشغّل ونجح. الـ <code>Storage::fake('public')</code> بيستخدم فولدر مؤقت فمفيش ملفات حقيقية. و<code>UploadedFile::fake()-&gt;image()</code> بتعمل صورة وهمية. و<code>Http::fake</code> بيمنع الاتصال الفعلي: لو عايز تضمن إن مفيش ريكويست خارجي خارج الـ fake استخدم <code>Http::preventStrayRequests()</code> (جربتها ورمت exception لريكويست غير مغطى). والـ <code>Http::response([], 500)</code> بتختبر فرع الفشل.",
        },
      ],
      pitfall: "الـ fake بيمنع الفعل الحقيقي، فمش بيثبت إن الإيميل شكله صح أو وصل. شكل القالب نفسه اختبره بـ <code>(new InquiryReceived($i))-&gt;render()</code> أو <code>assertSeeInHtml</code>. والفكرة العامة: اختبر كودك، مش مكتبة Laravel ولا خدمة الطرف الثالث.",
      interview: [
        { q: "إزاي بتختبر كود بيبعت إيميل أو بينادي API خارجي؟", a: "بستخدم الـ fakes بدل التنفيذ الحقيقي: <code>Mail::fake()</code> و<code>Notification::fake()</code> و<code>Queue::fake()</code> و<code>Http::fake([...])</code> مع ردود جاهزة، وبعدها بتأكد بـ <code>assertSent</code> أو <code>assertSentTo</code> أو <code>Http::assertSent</code> إن الكود عمل المطلوب بالبيانات الصح. كده التست سريع وثابت (مش بيعتمد على نت ولا SMTP)، وبقدر أختبر حالة فشل الخدمة بـ <code>Http::response([], 500)</code>." },
      ],
    },
    {
      title: "الوقت والـ unit tests",
      en: "Time travel and unit tests",
      body: "<p>الكود اللي بيعتمد على الوقت (انتهاء، 30 يوم) ما تنتظرش فيه. <code>$this->travel(31)->days()</code> بتحرك <code>now()</code> قدام، و<code>travelTo($date)</code> لتاريخ محدد، و<code>freezeTime()</code> بتثبته (مفيد لمقارنة timestamps)، و<code>travelBack()</code> ترجّعه. والـ unit test بيمتد من <code>PHPUnit\\Framework\\TestCase</code> (من غير boot للتطبيق ولا داتابيز) لما الكلاس ما بيحتاجش الـ framework.</p>",
      codes: [
        {
          lang: "php",
          title: "tests/Feature (needs now())",
          src: `<?php

public function test_a_listing_becomes_stale_after_30_days(): void
{
    $listing = Listing::factory()->published()->create();
    $this->assertFalse($listing->isStale());

    $this->travel(31)->days();

    $this->assertTrue($listing->isStale());
}`,
        },
        {
          lang: "php",
          title: "tests/Unit/ListingPriceTest.php",
          src: `<?php

namespace Tests\\Unit;

use App\\Models\\Listing;
use PHPUnit\\Framework\\TestCase;

class ListingPriceTest extends TestCase
{
    public function test_price_label_is_formatted(): void
    {
        $listing = new Listing(['price' => 1250000]);

        $this->assertSame('1,250,000 SAR', $listing->price_label);
    }
}`,
          note: "الاتنين اتشغّلوا ونجحوا. الـ unit بتاع <code>price_label</code> اشتغل حتى من غير boot للتطبيق لأنه حسبة صرفة على الموديل. لو الكلاس محتاج facade أو config أو داتابيز يبقى هتمد من <code>Tests\\TestCase</code> وتبقى عمليا feature test.",
        },
      ],
      interview: [
        { q: "إزاي بتختبر كود بيعتمد على الوقت (زي انتهاء بعد 30 يوم)؟", a: "ما بستناش ولا بعدّل الداتا يدوي: بحرّك الساعة بـ <code>$this->travel(31)->days()</code> أو <code>travelTo()</code> وبتأكد من النتيجة، وبثبتها بـ <code>freezeTime()</code> لما أقارن timestamps. وده بيشتغل على <code>now()</code> وCarbon وكمان بيأثر على الـ rate limiter والكاش الـ array لأنهم بيعتمدوا على نفس الساعة." },
      ],
    },
    {
      title: "إيه اللي تختبره الأول في مشروع موجود؟",
      en: "What to test first",
      body: "<p>مشروع كبير من غير tests: متحاولش تغطي كل حاجة. ابدأ بالأعلى قيمة والأقل تكلفة:</p>",
      points: [
        "<b>الـ happy path لكل endpoint رئيسي</b> (smoke tests): بيرد 200/201 بالشكل الصح. أرخص طريقة تكتشف إنك كسرت route.",
        "<b>الأمان:</b> مستخدم من مكتب تاني ومستخدم غير مسجل على كل endpoint بيعدّل أو بيعرض داتا خاصة (policies).",
        "<b>الـ validation:</b> الحقول المطلوبة والقيم الغلط على أي endpoint بيكتب.",
        "<b>اللي فلوس أو حالة:</b> الدفع، تغيير الحالة، أي حاجة لو غلطت تعمل خسارة.",
        "<b>أي bug بتصلحه:</b> اكتب له تست الأول (regression test).",
        "اترك الـ getters والـ boilerplate. وما تختبرش إن Laravel شغالة.",
      ],
      pitfall: "اختبار التفاصيل الداخلية (هل نادى method معينة؟) بيخلي التستات هشة: أي refactor يكسرها حتى لو السلوك سليم. اختبر <b>السلوك الظاهر</b> (الرد والأثر في الداتابيز)، مش طريقة التنفيذ.",
      code: {
        lang: "php",
        title: "Pest (same idea, shorter syntax): shown, not executed",
        src: `<?php

use App\\Models\\Listing;

uses(Illuminate\\Foundation\\Testing\\RefreshDatabase::class);

it('lists only published listings', function () {
    Listing::factory()->published()->count(2)->create();
    Listing::factory()->create();

    $this->getJson('/api/listings')->assertOk()->assertJsonCount(2);
});`,
        note: "Pest غير منزلة في مشروع التجربة، فالمثال ده من معرفتي بصياغتها ولم أشغّله. بتتعامل مع نفس الـ assertions والـ fakes.",
      },
      interview: [
        { q: "عندك مشروع Laravel كبير من غير اختبارات. تبدأ بإيه؟", a: "مش بحاول أغطي كل حاجة. ببدأ بـ feature tests للـ endpoints الأهم (smoke tests للـ happy path)، وبعدين الأمان (مستخدم من مكتب تاني وزائر غير مسجل على كل endpoint حساس)، وبعدين الـ validation، وأي منطق فيه فلوس أو حالات. وكل bug بصلحه بكتب له تست الأول. وبشغّلهم في الـ CI على كل push، لأن تستات مش بتشتغل أوتوماتيك بتتنسى." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: تست HTTP بسيط",
      lang: "php",
      code: `<?php

public function test_index_returns_published(): void
{
    Listing::factory()->published()->count(2)->create();
    Listing::factory()->create();

    $this->getJson('/api/listings')
        ->assertOk()
        ->assertJsonCount(2);
}`,
    },
    {
      title: "اكتب: تست auth و403",
      lang: "php",
      code: `<?php

public function test_stranger_cannot_publish(): void
{
    $listing = Listing::factory()->create();
    $stranger = User::factory()->create();

    Sanctum::actingAs($stranger);

    $this->postJson("/api/listings/{$listing->id}/publish")
        ->assertForbidden();

    $this->assertDatabaseHas('listings', ['status' => 'draft']);
}`,
    },
    {
      title: "اكتب: تست بـ Notification::fake",
      lang: "php",
      code: `<?php

public function test_inquiry_notifies_agent(): void
{
    Notification::fake();
    $listing = Listing::factory()->published()->create();
    $agent = User::factory()->create([
        'office_id' => $listing->office_id,
    ]);

    $this->postJson('/api/inquiries', [
        'listing_id' => $listing->id,
        'message' => 'Is it still available?',
    ])->assertCreated();

    Notification::assertSentTo($agent, NewInquiry::class);
}`,
    },
  ],

  tasks: [
    {
      title: "تست فلتر السعر",
      lang: "php",
      prompt: "<p>الـ endpoint <code>GET /api/listings?max_price=1000000</code> بيرجّع الإعلانات <b>المنشورة</b> اللي سعرها أقل من أو يساوي القيمة. اكتب feature test باسم <code>test_max_price_filters_the_index</code> بيعمل 3 إعلانات منشورة بأسعار 500000 و900000 و2000000، ويتأكد إن الرد 200 وفيه إعلانين، وإن إعلان الـ 2000000 مش موجود.</p>",
      hints: [
        "الـ factory: <code>Listing::factory()-&gt;published()-&gt;for($office)-&gt;create(['price' =&gt; 500000])</code>.",
        "<code>assertJsonCount(2)</code> ثم <code>assertJsonMissing(['price' =&gt; 2000000])</code>.",
      ],
      solution: `<?php

public function test_max_price_filters_the_index(): void
{
    $office = Office::factory()->create();
    Listing::factory()->published()->for($office)->create(['price' => 500000]);
    Listing::factory()->published()->for($office)->create(['price' => 900000]);
    Listing::factory()->published()->for($office)->create(['price' => 2000000]);

    $this->getJson('/api/listings?max_price=1000000')
        ->assertOk()
        ->assertJsonCount(2)
        ->assertJsonMissing(['price' => 2000000]);
}`,
      explain: "التست بيجهّز (arrange) 3 صفوف، بيبعت ريكويست (act)، وبيأكد (assert) على العدد وعلى غياب الإعلان الغالي. لاحظ إننا مش بنعتمد على ترتيب النتائج لأن الـ index بيرتب بـ <code>latest()</code> والصفوف اتعملت في نفس الثانية. اتشغّل ونجح.",
    },
    {
      title: "تست إرسال استفسار: ناجح وفاشل",
      lang: "php",
      prompt: "<p><code>POST /api/inquiries</code> بياخد <code>listing_id</code> (لازم موجود) و<code>message</code> (10 حروف على الأقل). اكتب تستين: (1) استفسار صحيح بيرجّع 201، وبيتسجل في جدول <code>inquiries</code>، وبيبعت <code>NewInquiry</code> لمستخدم من مكتب الإعلان. (2) استفسار بـ <code>listing_id</code> غير موجود ورسالة قصيرة بيرجّع خطأ validation على الحقلين، ومفيش صف اتحفظ ولا إشعار اتبعت.</p>",
      hints: [
        "<code>Notification::fake()</code> قبل الريكويست، و<code>assertSentTo($agent, NewInquiry::class)</code>.",
        "<code>assertDatabaseHas('inquiries', [...])</code> و<code>assertDatabaseCount('inquiries', 0)</code>.",
        "<code>Notification::assertNothingSent()</code> في الحالة الفاشلة.",
      ],
      solution: `<?php

public function test_inquiry_is_saved_and_the_office_is_told(): void
{
    Notification::fake();
    $listing = Listing::factory()->published()->create();
    $agent = User::factory()->create(['office_id' => $listing->office_id]);

    $this->postJson('/api/inquiries', [
        'listing_id' => $listing->id,
        'message' => 'Can I visit tomorrow?',
    ])
        ->assertCreated()
        ->assertJsonPath('listing_id', $listing->id);

    $this->assertDatabaseHas('inquiries', [
        'listing_id' => $listing->id,
        'message' => 'Can I visit tomorrow?',
    ]);
    Notification::assertSentTo($agent, NewInquiry::class);
}

public function test_inquiry_validation_failures(): void
{
    Notification::fake();

    $this->postJson('/api/inquiries', [
        'listing_id' => 9999,
        'message' => 'short',
    ])->assertJsonValidationErrors(['listing_id', 'message']);

    $this->assertDatabaseCount('inquiries', 0);
    Notification::assertNothingSent();
}`,
      explain: "التست الأول بيثبت الرد والأثر والـ side effect. التاني بيثبت إن الفشل ما بيسبش أثر: لا صف ولا إشعار. الاتنين اتشغّلوا ونجحوا على المشروع التجريبي (الـ controller بيبعت <code>NewInquiry</code> لـ <code>$listing->office->users</code>).",
    },
    {
      title: "تست الحذف و404",
      lang: "php",
      prompt: "<p>اكتب تستين: (1) <code>DELETE /api/listings/{id}</code> بيرجّع 204، والإعلان بقى soft deleted، وبعدها <code>GET</code> لنفس الـ id بيرجّع 404. (2) <code>GET /api/listings/99999</code> بيرجّع 404 بجسم JSON بالضبط <code>{\"message\": \"Not found\"}</code>.</p>",
      hints: [
        "<code>deleteJson(...)-&gt;assertNoContent()</code> و<code>$this-&gt;assertSoftDeleted($listing)</code>.",
        "<code>assertNotFound()</code> و<code>assertExactJson([...])</code>.",
      ],
      solution: `<?php

public function test_deleting_a_listing_hides_it(): void
{
    $listing = Listing::factory()->published()->create();

    $this->deleteJson("/api/listings/{$listing->id}")->assertNoContent();

    $this->assertSoftDeleted($listing);
    $this->getJson("/api/listings/{$listing->id}")->assertNotFound();
}

public function test_unknown_listing_is_404(): void
{
    $this->getJson('/api/listings/99999')
        ->assertNotFound()
        ->assertExactJson(['message' => 'Not found']);
}`,
      explain: "<code>assertSoftDeleted</code> بتتأكد إن الصف لسه في الجدول و<code>deleted_at</code> مش null (مش نفس <code>assertDatabaseMissing</code> اللي كانت هتفشل). ورد الـ 404 المخصص جاي من <code>withExceptions</code> في <code>bootstrap/app.php</code> (المستوى 1). اتشغّل ونجح.",
    },
  ],

  quiz: [
    {
      q: "تست بينجح لوحده لكن بيفشل لما بتشغّل كل التستات. أرجح سبب؟",
      options: [
        "الـ PHPUnit قديم",
        "التستات بتشارك بيانات في الداتابيز لأن مفيش <code>RefreshDatabase</code> (أو تست بيعتمد على نتيجة تست تاني)",
        "الـ <code>assertOk</code> لا تعمل في الـ suite الكاملة",
        "الـ factories مش بتشتغل مع أكتر من تست",
      ],
      answer: 1,
      why: "التست لازم يبدأ من حالة نضيفة ويكون مستقل. من غير <code>RefreshDatabase</code> بيانات تست بتفضل وتأثر على اللي بعده. الباقي أسباب مش واقعية.",
    },
    {
      q: "إيه الفرق بين السطرين؟",
      code: { lang: "php", src: `<?php
$a = Listing::factory()->create();
$b = Listing::factory()->make();` },
      options: [
        "ولا فرق",
        "<code>create</code> بتبني object بس، و<code>make</code> بتحفظه",
        "<code>make</code> بتحفظ في الكاش",
        "<code>create</code> بتحفظ في الداتابيز، و<code>make</code> بتبني object من غير حفظ",
      ],
      answer: 3,
      why: "<code>make()</code> للـ unit tests أو لما محتاج بيانات فقط من غير داتابيز. <code>create()</code> لما التست محتاج الصف موجود فعلا (علاقات، استعلامات).",
    },
    {
      q: "أنهي assertion الصح لتتأكد إن إنشاء الإعلان رجّع 201 <b>وكمان</b> اتحفظ؟",
      options: [
        "<code>assertCreated()</code> بس",
        "<code>assertCreated()</code> ثم <code>assertDatabaseHas('listings', [...])</code>",
        "<code>assertOk()</code> ثم <code>assertDatabaseMissing(...)</code>",
        "<code>assertJsonCount(1)</code> بس",
      ],
      answer: 1,
      why: "الـ status بيثبت الرد، والـ <code>assertDatabaseHas</code> بيثبت الأثر. الكود ممكن يرد 201 وينسى الحفظ. و<code>assertOk</code> هي 200 مش 201.",
    },
    {
      q: "التست ده بيرجّع 403 للمستخدم من مكتب تاني. أنهي جزء ناقص يخلّي التست كامل؟",
      code: { lang: "php", src: `<?php
Sanctum::actingAs($stranger);

$this->postJson("/api/listings/{$listing->id}/publish")
    ->assertForbidden();` },
      options: [
        "<code>$this->assertDatabaseHas('listings', ['id' => $listing->id, 'status' => 'draft']);</code> عشان نتأكد إن التغيير ما حصلش",
        "<code>Event::fake();</code> بعد الريكويست",
        "<code>$this->travel(1)->day();</code>",
        "<code>Storage::fake();</code>",
      ],
      answer: 0,
      why: "رفض الصلاحية لازم يتأكد إنه منع التغيير فعلا. الباقي مالوش علاقة، والـ fake لازم يتنادى قبل الفعل مش بعده.",
    },
    {
      q: "عملت <code>Event::fake();</code> في أول تست، وفجأة الـ observer اللي بيولّد slug عند <code>creating</code> مبقاش بيشتغل في التست ده. ليه؟",
      options: [
        "الـ observer اتمسح من المشروع",
        "الـ factory بتتجاهل الـ observers دايما",
        "<code>Event::fake()</code> من غير قايمة بتبلع كل الأحداث ومعاها model events، فالحل <code>Event::fake([MyEvent::class])</code>",
        "الـ <code>RefreshDatabase</code> بتعطل الـ observers",
      ],
      answer: 2,
      why: "الـ fake بيستبدل الـ dispatcher كله. لما تحدد الأحداث اللي عايز تراقبها بس، الباقي (ومنها eloquent.creating) بيفضل شغال. جربت ده بنفسي.",
    },
    {
      q: "عندك كلاس بيبعت Mailable بـ <code>ShouldQueue</code>. بعد <code>Mail::fake()</code> وتنفيذ الكود، أنهي assertion هتنجح؟",
      options: [
        "<code>Mail::assertSent(InquiryReceived::class)</code>",
        "<code>Mail::assertQueued(InquiryReceived::class)</code>",
        "<code>Mail::assertNothingQueued()</code>",
        "<code>Mail::assertQueued(OtherMail::class)</code>",
      ],
      answer: 1,
      why: "الـ Mailable اللي <code>implements ShouldQueue</code> بيتسجل كـ <b>queued</b> مش sent، فـ <code>assertSent</code> هتفشل. (جربت: <code>assertQueued</code> نجحت و<code>assertNotSent</code> نجحت.)",
    },
    {
      q: "كود بيعمل <code>Http::get(...)</code> لـ API خارجي. إزاي تختبره من غير نت ولضمان إنه ميتصلش بحاجة ما اتوقعتهاش؟",
      options: [
        "<code>Http::fake([...])</code> + <code>Http::preventStrayRequests()</code>",
        "<code>Storage::fake()</code>",
        "<code>Queue::fake()</code>",
        "تسيب التست يتصل فعلا بالـ API",
      ],
      answer: 0,
      why: "<code>Http::fake</code> بيحط ردود جاهزة، و<code>preventStrayRequests</code> بترمي exception لأي ريكويست لعنوان ما اتغطاش. باقي الـ fakes بتخص حاجات تانية، والاتصال الحقيقي بيخلي التست بطيء وغير ثابت.",
    },
    {
      q: "بتشغّل تست واحد بس بالاسم <code>test_store_creates_a_listing</code> بإيه؟",
      answer: ["php artisan test --filter=test_store_creates_a_listing", "php artisan test --filter test_store_creates_a_listing", "artisan test --filter=test_store_creates_a_listing"],
      why: "الأمر <code>php artisan test --filter=الاسم</code> بيشغّل التستات اللي اسمها (أو اسم الكلاس) بيطابق الجزء ده. تقدر كمان تديله مسار الملف.",
    },
    {
      q: "عايز تتأكد إن الإعلان بقى «قديم» بعد 30 يوم من النشر من غير ما تستنى. أنهي سطر؟",
      options: [
        "<code>sleep(2592000);</code>",
        "<code>$listing->published_at = null;</code> وخلاص",
        "<code>$this->travel(31)->days();</code>",
        "<code>Carbon::setLocale('ar');</code>",
      ],
      answer: 2,
      why: "<code>travel</code> بتحرك <code>now()</code> في التست من غير انتظار. الـ sleep هيعلق الأمر شهر، وتعديل التاريخ يدويا مش بيختبر المنطق المرتبط بـ now().",
    },
  ],
};
