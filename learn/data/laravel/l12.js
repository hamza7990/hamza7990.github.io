window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l12"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "الشغل البطيء ميتعملش والمستخدم مستني",
      en: "Why queues",
      body: "<p>تخيل إن المستخدم رفع إعلان بـ 10 صور: لازم تصغّرها وتعمل thumbnails، تبعت إيميل لصاحب المكتب، وتنادي API خارجي. لو عملت ده كله جوه الريكويست، المستخدم هيستنى 15 ثانية، وأي فشل (الـ API واقع) يوقع الريكويست كله. الحل: تسجل \"شغلانة\" (<b>job</b>) في <b>queue</b> وترد على المستخدم فورا، وعملية تانية (<b>worker</b>) تسحب الـ jobs وتنفذها في الخلفية.</p>",
      points: [
        "الـ <b>queue</b>: طابور بيخزن الـ jobs (في الداتابيز أو Redis).",
        "الـ <b>job</b>: كلاس بيمثل شغلانة (البيانات + method <code>handle()</code>).",
        "الـ <b>worker</b>: process شغال طول الوقت (<code>php artisan queue:work</code>) بيسحب job وينفذها.",
        "الفايدة: رد سريع، وإعادة محاولة تلقائية لو فشل، وتحمّل الضغط (الـ jobs بتتراكم بدل ما السيرفر يقع).",
      ],
      interview: [
        { q: "ليه نستخدم الـ queues؟ وإيه اللي المفروض يتحط فيها؟", a: "علشان أنقل الشغل البطيء أو القابل للفشل برا دورة الريكويست: إيميلات، إشعارات، معالجة صور، تقارير، استدعاء API خارجي، webhooks. المستخدم بياخد رد سريع، والـ worker بينفذ في الخلفية مع retries وfailed jobs، والضغط بيتوزع على الوقت. اللي مبحطهوش: اللي المستخدم محتاج نتيجته في نفس الرد (مثلا فاليديشن أو حفظ بيانات الريكويست الأساسية)." },
      ],
    },
    {
      title: "الـ Job: كلاس وdispatch",
      en: "Writing and dispatching a job",
      body: "<p>بتعمل job بـ <code>php artisan make:job ResizePhotos</code>. الكلاس <code>implements ShouldQueue</code> (ده اللي بيقول \"ده يتنفذ في الـ queue\"). في Laravel 11 الأحدث الـ stub بيستخدم trait واحد <code>Queueable</code> (من <code>Illuminate\\Foundation\\Queue</code>) بيجمّع <code>Dispatchable</code> و<code>InteractsWithQueue</code> و<code>SerializesModels</code>؛ في الإصدارات الأقدم بتكتب التلاتة بنفسك.</p>",
      code: {
        lang: "php",
        title: "app/Jobs/ResizePhotos.php",
        src: `class ResizePhotos implements ShouldQueue
{
    use Queueable;

    public function __construct(public Listing $listing)
    {
    }

    public function handle(): void
    {
        foreach ($this->listing->photos as $photo) {
            // resize and store a thumbnail
        }
    }
}

// from a controller: returns immediately, work happens later
ResizePhotos::dispatch($listing);

ResizePhotos::dispatch($listing)->onQueue('photos');
ResizePhotos::dispatch($listing)->delay(now()->addMinutes(10));`,
        note: "اتجرب: الـ <code>dispatch</code> بيضيف صف في جدول <code>jobs</code> (الأعمدة: queue, payload, attempts, available_at...) والـ payload فيه الكلاس والـ object متسلسل. الـ delay بخلى <code>available_at</code> بعد 600 ثانية.",
      },
      pitfall: "الـ constructor بياخد موديل → بفضل <code>SerializesModels</code> بيتخزن الـ <b>id</b> بس وبيتجاب من الداتابيز من جديد وقت التنفيذ (بيانات طازجة، لكن لو السجل اتمسح الـ job بيفشل). ومتمرر objects كبيرة أو غير قابلة للتسلسل (connection، closure، ملف مفتوح).",
      interview: [
        { q: "إيه اللي بيحصل لما تعمل <code>dispatch</code> لـ job بياخد Eloquent model في الـ constructor؟", a: "الـ job بيتسلسل (serialize) ويتخزن في الـ queue، وبفضل <code>SerializesModels</code> الموديل بيتخزن كـ class + id مش كل بياناته. لما الـ worker يسحب الـ job بيعمل query يجيب الموديل من جديد، فالـ job بيشتغل على بيانات حديثة. الجانب التاني: لو السجل اتمسح قبل التنفيذ بيرمي <code>ModelNotFoundException</code> والـ job بيفشل (ويمكن نضبطه بـ <code>$deleteWhenMissingModels = true</code>)." },
      ],
    },
    {
      title: "الـ connections والـ drivers وتشغيل الـ worker",
      en: "Queue connections and workers",
      body: "<p>اتصال الـ queue بيتحدد في <code>.env</code> بـ <code>QUEUE_CONNECTION</code>، وتفاصيله في <code>config/queue.php</code>. أهم الـ drivers:</p>",
      points: [
        "<code>sync</code>: بينفذ الـ job فورا في نفس الريكويست (للتطوير والاختبار، مفيش queue فعلية).",
        "<code>database</code>: بيخزن الـ jobs في جدول <code>jobs</code>. بسيط ومفيش خدمة إضافية، مناسب لمشاريع صغيرة/متوسطة. (Laravel 11 migration الافتراضي بيعمله.)",
        "<code>redis</code>: أسرع وأكفأ، وهو اللي بتستخدمه في الإنتاج لما الحمل يزيد (وبيدعم Horizon).",
      ],
      code: {
        lang: "bash",
        src: `# .env
QUEUE_CONNECTION=database

# start a worker (stays alive, pulls jobs)
php artisan queue:work

# useful options
php artisan queue:work --queue=photos,default   # priority order
php artisan queue:work --tries=3 --timeout=60
php artisan queue:work --max-time=3600          # exit after an hour
php artisan queue:work --stop-when-empty        # exit when nothing left

# handle one job then exit (debugging)
php artisan queue:work --once`,
        note: "كله اتجرب على database queue. لاحظ إن الـ default للـ <code>--tries</code> في الـ worker هو <b>1</b> (يعني من غير ضبط، أول فشل = failed job).",
      },
      focus: [{ label: "work مقابل listen", text: "<code>queue:work</code> بيبوّت الـ framework مرة واحدة ويفضل شغال (سريع) لكن <b>مش بيشوف تعديلات الكود</b> بعد ما بدأ، فلازم <code>queue:restart</code> بعد كل deploy. <code>queue:listen</code> بيبوّت الـ framework لكل job (أبطأ) فبيلقط التعديلات تلقائي: مفيد في التطوير فقط." }],
      interview: [
        { q: "إيه الفرق بين <code>queue:work</code> و<code>queue:listen</code>؟", a: "<code>queue:work</code> بيحمّل التطبيق مرة واحدة ويفضل يسحب jobs في نفس الـ process، فهو سريع وهو المستخدم في الإنتاج، لكنه محتفظ بالكود القديم في الذاكرة فلازم أعمل <code>php artisan queue:restart</code> بعد كل deploy. <code>queue:listen</code> بيبدأ process جديد لكل job فبيشوف التعديلات تلقائي لكن أبطأ بكتير، فبحصره في التطوير." },
      ],
    },
    {
      kicker: "الأعطال",
      title: "الـ retries والـ backoff والـ timeout",
      en: "Retries, backoff and timeouts",
      body: "<p>الـ jobs بتفشل (API واقع، الداتابيز مشغولة). فبتضبط كام مرة يحاول وكام ثانية يستنى بين كل محاولة. الإعدادات بتتحط كـ properties على الـ job (وبتغلب أي إعداد على الـ worker):</p>",
      code: {
        lang: "php",
        src: `class FlakyJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;                 // total attempts
    public array $backoff = [10, 60];      // wait 10s, then 60s between attempts
    public int $timeout = 30;              // kill if it runs > 30s

    public function handle(): void
    {
        // $this->attempts() is 1, 2, 3...
        throw new RuntimeException('API is down');
    }
}`,
        note: "اتجرب: الـ job حاول 3 مرات (<code>attempt 1, 2, 3</code>) وبعدها راح لجدول <code>failed_jobs</code>. الـ <code>backoff</code> كـ array يعني فترة مختلفة لكل محاولة، وكـ int فترة ثابتة.",
      },
      pitfall: "قيمة <code>retry_after</code> في <code>config/queue.php</code> (للـ connection) لازم تكون <b>أكبر</b> من أطول timeout لأي job، وإلا الـ queue هتفتكر الـ job اتعلق وتديه لـ worker تاني وهيتنفذ مرتين. وإنفاذ الـ <code>timeout</code> نفسه محتاج إضافة <code>pcntl</code> في PHP.",
      interview: [
        { q: "إزاي تتعامل مع job بيفشل أحيانا بسبب API خارجي؟", a: "أضبط <code>$tries</code> و<code>$backoff</code> على الـ job (مثلا 3 محاولات بـ backoff متزايد <code>[10, 60]</code>) عشان يستنى بين المحاولات، و<code>$timeout</code> عشان ميعلقش. ولو استنفد المحاولات بيروح لـ <code>failed_jobs</code> وأقدر أرجّعه بـ <code>queue:retry</code>. ولازم الـ job يكون idempotent عشان إعادة المحاولة مضرش (مثلا مبعتش الإيميل مرتين)." },
      ],
    },
    {
      title: "الـ failed jobs",
      en: "Failed jobs",
      body: "<p>لما job يستنفد محاولاته، Laravel بيسجله في جدول <code>failed_jobs</code> (الـ migration الافتراضي في Laravel 11 بيعمله) مع الـ exception. وقبلها بينادي method اسمها <code>failed(Throwable $e)</code> في الـ job لو موجودة، وده مكانك تبعت alert أو ترجّع حالة سجل لـ \"failed\".</p>",
      codes: [
        {
          lang: "php",
          title: "في الـ job",
          src: `public function failed(?Throwable $e): void
{
    // all attempts are used: notify, mark the record, log
    Log::error('Photo resize failed', ['listing' => $this->listing->id]);
}`,
        },
        {
          lang: "bash",
          title: "من الـ terminal",
          src: `php artisan queue:failed                 # list failed jobs (uuid, queue, class)
php artisan queue:retry <uuid>           # push one back
php artisan queue:retry all              # push all back
php artisan queue:forget <uuid>          # delete one
php artisan queue:flush                  # delete all failed records
php artisan queue:prune-failed --hours=168   # keep only a week`,
          note: "اتجرب: بعد الفشل الجدول فيه الـ jobs، و<code>queue:retry all</code> رجّعتهم للـ queue (والجدول بقى فاضي).",
        },
      ],
      interview: [
        { q: "إيه اللي بيحصل لـ job فشل وإزاي تتابعه؟", a: "بعد ما يستنفد <code>tries</code> بيتنادى <code>failed(Throwable $e)</code> في الـ job لو موجودة، ويتسجل في جدول <code>failed_jobs</code> بالـ exception والـ payload. بشوفهم بـ <code>php artisan queue:failed</code> وبعد ما أصلح السبب بعيد تشغيلهم بـ <code>queue:retry all</code> (أو uuid محدد). وبنضف القديم بـ <code>queue:prune-failed</code>، وبراقب العدد بـ Horizon أو alert." },
      ],
    },
    {
      title: "تأجيل وسلاسل ودفعات (مفاهيم)",
      en: "Delay, chains and batches",
      body: "<p>تلات أدوات بترتب الـ jobs:</p>",
      points: [
        "<b>Delay</b>: <code>->delay(now()->addMinutes(10))</code> الـ job مش هيتنفذ قبل الوقت ده (اتجرب).",
        "<b>Chain</b>: jobs بالترتيب، التاني بيبدأ بعد ما الأول ينجح. لو واحد فشل الباقي <b>مش بيتنفذ</b>.",
        "<b>Batch</b>: مجموعة jobs بتشتغل بالتوازي مع تتبع للتقدم و<code>then</code> و<code>catch</code> و<code>finally</code>. محتاجة جدول <code>job_batches</code> (موجود في migration الافتراضي) وكل job لازم يستخدم trait <code>Batchable</code>.",
      ],
      code: {
        lang: "php",
        src: `use Illuminate\\Support\\Facades\\Bus;

// chain: A then B; if A fails, B never runs
Bus::chain([
    new ResizePhotos($listing),
    new NotifyOwner($listing),
])->dispatch();

// batch: many jobs in parallel, one result
$batch = Bus::batch([
    new ImportRow($row1),
    new ImportRow($row2),
])->name('csv-import')->allowFailures()->dispatch();

$batch->totalJobs;       // 2
$batch->finished();      // true when all are done`,
        note: "اتجرب الاتنين: السلسلة اللي أول job فيها فشلت ماوصلتش للتاني، والـ batch من 3 jobs خلصت (<code>finished()</code> = true). ولو نسيت <code>Batchable</code> بيرمي <code>Attempted to batch job ..., but it does not use the Batchable trait</code>.",
      },
      interview: [
        { q: "إيه الفرق بين job chain و job batch؟", a: "الـ chain تسلسل: كل job بيبدأ بعد نجاح اللي قبله، ولو واحد فشل باقي السلسلة بيتلغي (مناسب لخطوات تعتمد على بعض: صغّر الصور ثم انشر ثم ابعت إشعار). الـ batch مجموعة jobs مستقلة بتتنفذ بالتوازي، وبتتتبع كمجموعة (progress، then/catch/finally) فمناسبة للـ imports الكبيرة. الـ batch محتاجة جدول <code>job_batches</code> وtrait <code>Batchable</code> على الـ job." },
      ],
    },
    {
      title: "اكتب الـ job بحيث يتحمل التكرار: Idempotent",
      en: "Idempotent jobs",
      body: "<p>الـ queues بتضمن \"مرة على الأقل\" (at-least-once) مش \"مرة بالظبط\": ممكن job يتنفذ مرتين (retry بعد timeout، worker مات في نصه، retry_after قصير). لو الـ job بيبعت إيميل أو بيخصم فلوس، التكرار كارثة. فاكتبه <b>idempotent</b>: تنفيذه 5 مرات يساوي مرة.</p>",
      code: {
        lang: "php",
        src: `class SendInquiryNotice implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(public Inquiry $inquiry)
    {
    }

    public function handle(): void
    {
        $inquiry = $this->inquiry->fresh();

        // already done on a previous attempt? then do nothing
        if ($inquiry->notified_at !== null) {
            return;
        }

        Mail::to($inquiry->listing->office->owner)->send(new NewInquiry($inquiry));

        $inquiry->update(['notified_at' => now()]);
    }
}`,
        note: "الفكرة: تعلّم إن الشغل خلص (عمود <code>notified_at</code>) وتشيك عليه الأول. بدائل: unique constraint، أو <code>updateOrCreate</code> بدل <code>create</code>، أو مفتاح idempotency لاستدعاء الدفع الخارجي. وفي Laravel فيه <code>ShouldBeUnique</code> بيمنع إدخال نفس الـ job مرتين في الـ queue (بيحتاج cache يدعم الـ locks).",
      },
      interview: [
        { q: "إيه معنى إن الـ job لازم يكون idempotent؟ ومثال؟", a: "إن تنفيذه أكتر من مرة بنفس الداتا يديني نفس النتيجة النهائية، لأن الـ queue ممكن تنفذه مرتين (retry، timeout، worker وقع). مثال: job إرسال إشعار بيشيك عمود <code>notified_at</code> أول حاجة ويخرج لو موجود، وبعد الإرسال يعلّمه. للدفع بستخدم مفتاح idempotency مع مزود الدفع، وللإنشاء <code>updateOrCreate</code> أو unique constraint." },
      ],
    },
    {
      kicker: "باج مشهور",
      title: "الـ job اتنفذ قبل ما الـ transaction تعمل commit",
      en: "afterCommit",
      body: "<p>الحالة: جوه <code>DB::transaction</code> بتنشئ إعلان وبعدين بتعمل <code>dispatch</code> لـ job. لو الـ queue هي Redis (بره الداتابيز)، الـ job بيدخل الـ queue فورا، والـ worker بيسحبه في أجزاء من الثانية، <b>قبل</b> ما الـ transaction تعمل commit. فالـ job بيدور على الإعلان ومش لاقيه: <code>ModelNotFoundException</code>، أو الأسوأ بيقرا بيانات قديمة.</p>",
      code: {
        lang: "php",
        src: `DB::transaction(function () use ($data) {
    $listing = Listing::create($data);

    // BAD with a redis queue: may run before the commit
    ResizePhotos::dispatch($listing);

    // GOOD: pushed to the queue only after the commit
    ResizePhotos::dispatch($listing)->afterCommit();
});

// or on the job class
public bool $afterCommit = true;

// or for the whole connection (config/queue.php)
'redis' => [
    'driver' => 'redis',
    'after_commit' => true,
],`,
        note: "اتجرب مع database queue: الـ job بـ <code>afterCommit()</code> جوه transaction اتعمل لها rollback → <b>صفر jobs</b> في الـ queue. وجوه transaction ناجحة → الـ job مدخلش قبل الـ commit ودخل بعده. ومع Redis نفس المنطق لكن السباق الحقيقي بيحصل هناك (مجربتوش لأن Redis مش متاح عندي).",
      },
      interview: [
        { q: "job بيفشل بـ ModelNotFoundException أحيانا بعد ما تعمل dispatch جوه transaction. السبب؟", a: "الـ dispatch دخل الـ job في الـ queue (Redis مثلا) قبل ما الـ transaction تعمل commit، والـ worker سحبه بسرعة وحاول يجيب السجل اللي لسه مش ظاهر لأي connection تاني. الحل: <code>->afterCommit()</code> على الـ dispatch، أو <code>public bool $afterCommit = true</code> في الـ job، أو <code>'after_commit' => true</code> في config الـ connection، فالـ job بيتبعت للـ queue بعد الـ commit، وبيتلغي لو حصل rollback." },
      ],
    },
    {
      title: "في الإنتاج: restart و Supervisor و Horizon",
      en: "Running workers in production",
      body: "<p>الـ worker process طويل العمر، فبيحتاج ٣ حاجات:</p>",
      points: [
        "<b>Supervisor</b> (أو systemd): مراقب بيعيد تشغيل الـ worker لو وقع أو خرج، وبيشغّل كذا نسخة. من غيره أول crash = مفيش queue.",
        "<b>queue:restart</b> في سكريبت الـ deploy: بيطلب من الـ workers يخرجوا بعد الـ job الحالي، والـ Supervisor يشغلهم تاني بالكود الجديد. من غيرها الـ worker بيفضل بالكود القديم.",
        "<b>Horizon</b>: لو بتستخدم Redis، لوحة تحكم ومراقبة للـ queues والـ workers بتتظبط من ملف config (وبتشغلها بـ <code>php artisan horizon</code> بدل <code>queue:work</code>).",
      ],
      code: {
        lang: "text",
        title: "/etc/supervisor/conf.d/laravel-worker.conf",
        src: `[program:laravel-worker]
command=php /var/www/app/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
numprocs=2
process_name=%(program_name)s_%(process_num)02d
user=www-data
stopwaitsecs=3600`,
        note: "الإعداد ده من وثائق Laravel (عدّل المسارات بتاعتك). والـ deploy: <code>php artisan queue:restart</code> بعد ما تسحب الكود. الأمر اتجرب (بيبعت إشارة restart عبر الـ cache).",
      },
      pitfall: "نسيان <code>queue:restart</code> بعد deploy هو السبب رقم 1 لـ \"أنا عدلت الـ job ومبيتغيرش الـ behavior\". وكمان لو الـ <code>stopwaitsecs</code> أقل من أطول job، Supervisor هيقتل job في نصه.",
      interview: [
        { q: "إزاي تدير queue workers في الإنتاج؟", a: "بشغّلهم تحت Supervisor عشان يتعاد تشغيلهم لو وقعوا وأضبط عدد النسخ. في كل deploy بنفذ <code>php artisan queue:restart</code> عشان الـ workers تخرج بعد ما تخلص الـ job الحالي وSupervisor يطلعها تاني بالكود الجديد. ولو على Redis بستخدم Horizon للمراقبة والـ autoscaling. وبراقب failed_jobs وطول الـ queue." },
      ],
    },
    {
      kicker: "الجدولة",
      title: "Task Scheduling: cron entry واحد بس",
      en: "The scheduler",
      body: "<p>بدل ما تعمل cron entry لكل مهمة (تنضيف يومي، تقرير أسبوعي)، بتضيف <b>سطر cron واحد</b> بيشغّل <code>schedule:run</code> كل دقيقة، وLaravel يقرر إيه المستحق. المهام نفسها بتتعرّف في الكود. في Laravel 11 مفيش <code>Console/Kernel.php</code>: بتكتبها في <code>routes/console.php</code> بـ <code>Schedule</code> facade.</p>",
      code: {
        lang: "php",
        title: "routes/console.php",
        src: `use Illuminate\\Support\\Facades\\Schedule;

Schedule::command('queue:prune-failed --hours=168')->daily();

Schedule::command('reports:daily')
    ->everyFiveMinutes()
    ->withoutOverlapping()     // skip if the previous run is still going
    ->onOneServer();           // only one of several servers runs it

Schedule::call(function () {
    Listing::where('status', 'draft')
        ->where('created_at', '<', now()->subDays(30))
        ->delete();
})->dailyAt('03:00')->name('purge-old-drafts');

Schedule::job(new ResizePhotos($listing))->hourly();`,
        note: "اتجرب بـ <code>php artisan schedule:list</code> وطلعت المهام بتوقيتها (<code>0 3 * * *</code> وغيره). وللتجربة المحلية <code>php artisan schedule:work</code> بيشغّل الجدولة كل دقيقة من غير cron.",
      },
      codes: [
        {
          lang: "bash",
          title: "crontab -e (السطر الوحيد)",
          src: `* * * * * cd /var/www/app && php artisan schedule:run >> /dev/null 2>&1`,
          note: "<code>onOneServer()</code> محتاجة cache driver مشترك بين السيرفرات (redis أو database أو memcached)، و<code>withoutOverlapping()</code> بتستخدم cache lock برضه.",
        },
      ],
      interview: [
        { q: "إزاي تشتغل الـ scheduler في Laravel 11، وإيه <code>withoutOverlapping</code> و<code>onOneServer</code>؟", a: "بعرّف المهام في <code>routes/console.php</code> بـ <code>Schedule::command(...)->daily()</code> أو <code>Schedule::job()</code>، وفي السيرفر cron entry واحد كل دقيقة: <code>php artisan schedule:run</code>. <code>withoutOverlapping()</code> بيمنع بدء نسخة جديدة من المهمة لو اللي قبلها لسه شغالة (بـ cache lock). <code>onOneServer()</code> لما التطبيق على كذا سيرفر، بيضمن إن سيرفر واحد بس ينفذ المهمة (محتاج shared cache). وللمراقبة <code>schedule:list</code>." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: job بـ tries و backoff",
      lang: "php",
      code: `<?php
class ResizePhotos implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;
    public array $backoff = [10, 60];

    public function __construct(public Listing $listing)
    {
    }

    public function handle(): void
    {
        $this->listing->photos()->each->touch();
    }
}`,
    },
    {
      title: "اكتب: dispatch وchain وbatch",
      lang: "php",
      code: `<?php
ResizePhotos::dispatch($listing)
    ->onQueue('photos')
    ->delay(now()->addMinutes(5))
    ->afterCommit();

Bus::chain([
    new ResizePhotos($listing),
    new NotifyOwner($listing),
])->dispatch();

$batch = Bus::batch([new ImportRow($row)])
    ->name('csv-import')
    ->allowFailures()
    ->dispatch();`,
    },
    {
      title: "اكتب: مهام مجدولة",
      lang: "php",
      code: `<?php
use Illuminate\\Support\\Facades\\Schedule;

Schedule::command('queue:prune-failed --hours=168')->daily();

Schedule::command('reports:daily')
    ->everyFiveMinutes()
    ->withoutOverlapping()
    ->onOneServer();

Schedule::call(function () {
    Listing::where('status', 'draft')->delete();
})->dailyAt('03:00')->name('purge-drafts');`,
    },
  ],

  tasks: [
    {
      title: "Job آمن للتكرار",
      lang: "php",
      prompt: "<p>اكتب job اسمه <code>PublishListing</code> بياخد <code>Listing $listing</code>. الـ <code>handle</code>: لو الإعلان حالته <code>published</code> خلاص، يخرج من غير ما يعمل حاجة (idempotent). غير كده يعمل <code>update</code> للـ <code>status = 'published'</code> و<code>published_at = now()</code>، وبعدها <code>ListingPublished::dispatch($listing)</code>. الإعدادات: 4 محاولات، backoff <code>[5, 30, 120]</code>، timeout 20 ثانية. وفي <code>failed</code> سجّل في اللوج. واكتب سطر الـ dispatch من جوه transaction بحيث ميتنفذش قبل الـ commit.</p>",
      hints: [
        "الأول: <code>$listing = $this->listing->fresh();</code> وبعدين شيك على <code>status</code>.",
        "الخصائص: <code>public int $tries = 4; public array $backoff = [...]; public int $timeout = 20;</code>.",
        "السطر الأخير: <code>PublishListing::dispatch($listing)->afterCommit();</code>.",
      ],
      solution: `<?php
class PublishListing implements ShouldQueue
{
    use Queueable;

    public int $tries = 4;
    public array $backoff = [5, 30, 120];
    public int $timeout = 20;

    public function __construct(public Listing $listing)
    {
    }

    public function handle(): void
    {
        $listing = $this->listing->fresh();

        if ($listing->status === 'published') {
            return;                      // already done: safe to repeat
        }

        $listing->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        ListingPublished::dispatch($listing);
    }

    public function failed(?Throwable $e): void
    {
        Log::error('Publish failed', [
            'listing' => $this->listing->id,
            'error' => $e?->getMessage(),
        ]);
    }
}

// inside a DB::transaction(...)
PublishListing::dispatch($listing)->afterCommit();`,
      explain: "الشيك على الحالة في الأول بيخلي التنفيذ المتكرر مفيش ضرر منه، و<code>fresh()</code> بيقرا أحدث حالة من الداتابيز. الـ backoff المتزايد بيدي الخدمة الخارجية وقت تتعافى، و<code>afterCommit()</code> بيمنع الـ job من الجري قبل الـ commit.",
    },
    {
      title: "جدولة مهمة تنضيف",
      lang: "php",
      prompt: "<p>في <code>routes/console.php</code> اكتب جدولة: (1) كل يوم الساعة 02:30 تمسح الـ <code>Inquiry</code> الأقدم من 365 يوم (باستعلام واحد من غير تحميل الموديلات)، باسم <code>prune-inquiries</code>، من غير تداخل ومن سيرفر واحد بس. (2) كل ساعة أمر artisan اسمه <code>listings:expire</code>. (3) اكتب سطر الـ crontab الوحيد اللي لازم يتحط على السيرفر لمشروع في <code>/var/www/app</code>.</p>",
      hints: [
        "<code>Schedule::call(fn () => Inquiry::where('created_at', '<', now()->subDays(365))->delete())</code>.",
        "<code>->dailyAt('02:30')->name('prune-inquiries')->withoutOverlapping()->onOneServer()</code>.",
        "الـ cron: كل دقيقة <code>* * * * *</code> بيشغّل <code>schedule:run</code>.",
      ],
      solution: `<?php
use App\\Models\\Inquiry;
use Illuminate\\Support\\Facades\\Schedule;

Schedule::call(function () {
    Inquiry::where('created_at', '<', now()->subDays(365))->delete();
})
    ->dailyAt('02:30')
    ->name('prune-inquiries')
    ->withoutOverlapping()
    ->onOneServer();

Schedule::command('listings:expire')->hourly();

// crontab -e
// * * * * * cd /var/www/app && php artisan schedule:run >> /dev/null 2>&1`,
      explain: "الـ <code>name()</code> مطلوب مع <code>withoutOverlapping</code> و<code>onOneServer</code> لما المهمة closure (عشان يبني اسم للـ lock). الـ delete بالـ query مناسب هنا لأن مفيش observer مطلوب. والـ cron entry واحد بس بغض النظر عن عدد المهام.",
    },
    {
      title: "تقرير كبير بـ batch",
      lang: "php",
      prompt: "<p>عندك job <code>ExportOfficeReport</code> (بياخد <code>Office $office</code>) وعايز تشغله لكل المكاتب كـ batch اسمه <code>offices-report</code>: بيسمح بفشل بعض الـ jobs، وعند الانتهاء (<code>finally</code>) يسجل في اللوج <code>\"report done: N failed\"</code>. اكتب الـ dispatch (من غير تحميل كل المكاتب في الذاكرة)، وبعدين اكتب الـ trait اللي لازم الـ job يستخدمه عشان يشتغل في batch.</p>",
      hints: [
        "<code>Office::lazyById()->map(fn ($o) => new ExportOfficeReport($o))</code> بترجع LazyCollection، حوّلها بـ <code>->all()</code> لو الأعداد معقولة، أو ابني الـ array بـ <code>foreach</code>.",
        "<code>Bus::batch($jobs)->name(...)->allowFailures()->finally(function (Batch $batch) {...})->dispatch()</code>.",
        "<code>$batch->failedJobs</code> فيه عدد الفاشلين، والـ trait هو <code>Batchable</code> من <code>Illuminate\\Bus</code>.",
      ],
      solution: `<?php
use Illuminate\\Bus\\Batch;
use Illuminate\\Bus\\Batchable;
use Illuminate\\Support\\Facades\\Bus;

$jobs = [];

foreach (Office::lazyById(500) as $office) {
    $jobs[] = new ExportOfficeReport($office);
}

Bus::batch($jobs)
    ->name('offices-report')
    ->allowFailures()
    ->finally(function (Batch $batch) {
        Log::info("report done: {$batch->failedJobs} failed");
    })
    ->dispatch();

class ExportOfficeReport implements ShouldQueue
{
    use Batchable, Queueable;

    public function __construct(public Office $office)
    {
    }

    public function handle(): void
    {
        if ($this->batch()?->cancelled()) {
            return;
        }
        // build the report for $this->office
    }
}`,
      explain: "<code>lazyById</code> بيقرا المكاتب على دفعات فمش بنحمل الكل. الـ job لازم <code>Batchable</code> (من غيره بيرمي خطأ، اتجرب). <code>allowFailures()</code> بيخلي فشل job مايلغيش الـ batch، والـ <code>finally</code> بتشتغل في كل الحالات. وفحص <code>cancelled()</code> بيسمح بإيقاف الـ batch من بره.",
    },
  ],

  quiz: [
    {
      q: "الـ worker شغال من الصبح. عدّلت كود job وعملت deploy، والسلوك القديم لسه بيتنفذ. السبب والحل؟",
      options: [
        "الـ cache، امسحه بـ <code>cache:clear</code>",
        "الـ worker محتفظ بالكود القديم في الذاكرة، والحل <code>php artisan queue:restart</code>",
        "لازم <code>queue:listen</code> في الإنتاج",
        "لازم تمسح جدول jobs",
      ],
      answer: 1,
      why: "<code>queue:work</code> بيحمّل الكود مرة واحدة. <code>queue:restart</code> بيخلي الـ workers تخرج بعد الـ job الحالي وSupervisor يشغلهم بالكود الجديد. (listen أبطأ ومخصص للتطوير.)",
    },
    {
      q: "الـ job ده بيفشل دايما. كام مرة هتتنفذ <code>handle</code> قبل ما يروح لـ failed_jobs؟",
      code: { lang: "php", src: `class FlakyJob implements ShouldQueue
{
    use Queueable;
    public int $tries = 3;
    public function handle(): void
    {
        throw new RuntimeException('API is down');
    }
}` },
      answer: ["3"],
      why: "<code>$tries = 3</code> يعني 3 محاولات كلية (اتجرب: attempt 1 و2 و3 وبعدها <code>failed()</code> وفي failed_jobs). لاحظ إن بدون ضبط الـ default في الـ worker هو محاولة واحدة.",
    },
    {
      q: "لو الـ step الأول في <code>Bus::chain([new StepA, new StepB])</code> فشل نهائيا، إيه اللي بيحصل؟",
      options: [
        "StepB بيتنفذ برضه",
        "StepB بيتنفذ بعد دقيقة",
        "السلسلة بتتوقف وStepB مش بيتنفذ",
        "الـ chain بتبدأ من الأول",
      ],
      answer: 2,
      why: "في الـ chain كل job بيتنفذ بعد نجاح اللي قبله. اتجرب: StepA فشل وStepB ماظهرش في اللوج. للتوازي استخدم batch.",
    },
    {
      q: "جوه <code>DB::transaction</code> عملت <code>dispatch</code> لـ job على Redis وأحيانا بيفشل بـ ModelNotFoundException. أنسب حل؟",
      options: [
        "رفع عدد الـ tries",
        "تحويل الـ queue لـ sync",
        "<code>->afterCommit()</code> على الـ dispatch",
        "إضافة <code>sleep(5)</code> في الـ job",
      ],
      answer: 2,
      why: "المشكلة سباق: الـ job بيوصل الـ worker قبل الـ commit. <code>afterCommit</code> بيأجل الإرسال لبعد الـ commit (وبيلغيه لو rollback، اتجرب). الـ retries والـ sleep بيداووا العرض مش السبب.",
    },
    {
      q: "أنهي تعريف للـ job <b>مش</b> idempotent؟",
      options: [
        "بيعمل <code>$wallet->increment('balance', 100)</code> من غير أي شيك على إنه اتنفذ قبل كده",
        "بيشيك <code>notified_at</code> ويخرج لو موجود",
        "بيعمل <code>updateOrCreate</code> على صف بمفتاح فريد",
        "بيضبط <code>status = 'published'</code>",
      ],
      answer: 0,
      why: "الـ increment بيضيف 100 في كل تنفيذ، فلو الـ job اتكرر (retry) الرصيد بيزيد مرتين. الباقيين نتيجتهم نفسها لو اتكرروا.",
    },
    {
      q: "عايز jobs كتير بتشتغل بالتوازي ومعرفة إمتى خلصت كلها. إيه الأنسب؟",
      options: [
        "Bus::chain",
        "Bus::batch (والـ job فيه <code>Batchable</code>)",
        "dispatch في loop عادي",
        "schedule:run",
      ],
      answer: 1,
      why: "الـ batch مصمم للمجموعات المتوازية مع تتبع التقدم (<code>finished()</code>, then/finally). الـ chain متتالي. ولازم trait <code>Batchable</code> وإلا بيرمي خطأ.",
    },
    {
      q: "كام سطر cron محتاج على السيرفر عشان 20 مهمة مجدولة في <code>routes/console.php</code>؟",
      answer: ["1", "واحد", "سطر واحد"],
      why: "سطر واحد كل دقيقة: <code>* * * * * cd /path && php artisan schedule:run</code>. Laravel بيقرر إيه المهام المستحقة.",
    },
    {
      q: "التطبيق على 3 سيرفرات وكل سيرفر عنده cron entry. المهمة اللي بتبعت تقرير يومي اتبعتت 3 مرات. الحل؟",
      options: [
        "<code>->withoutOverlapping()</code>",
        "<code>->daily()</code> بدل <code>->dailyAt()</code>",
        "<code>->onOneServer()</code> مع cache مشترك",
        "تشيل الـ cron من سيرفرين يدوي ومفيش حل في الكود",
      ],
      answer: 2,
      why: "<code>onOneServer()</code> بتخلي سيرفر واحد بس ياخد lock المهمة (محتاج cache مشترك زي redis أو database). <code>withoutOverlapping</code> بتمنع تداخل نفس المهمة لكن مبتحلش تكرار السيرفرات.",
    },
    {
      q: "إيه الفرق بين <code>queue:work</code> و<code>queue:listen</code>؟",
      options: [
        "listen أسرع لأنه بيعمل cache للكود",
        "work بيبوّت التطبيق مرة ويفضل شغال (سريع وللإنتاج)، وlisten بيبوّت لكل job (أبطأ، بيلقط التعديلات)",
        "مفيش فرق",
        "work للـ redis وlisten للـ database",
      ],
      answer: 1,
      why: "ده تصميم مش الـ driver. work سريع لكنه محتاج restart بعد deploy، وlisten بيبدأ framework جديد لكل job.",
    },
  ],
};
