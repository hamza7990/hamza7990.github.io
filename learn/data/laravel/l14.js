window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l14"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "الـ Filesystem: disk واحد في الكود، أي مخزن في الـ config",
      en: "Filesystem disks",
      body: "<p>أي تطبيق عقارات فيه صور إعلانات وعقود PDF. الصور دي مش بتتخزن في الداتابيز، بتتخزن كملفات ومعاها <b>مسار (path)</b> في جدول <code>photos</code>. Laravel بتغلف التخزين في <code>Storage</code> facade فوق مكتبة Flysystem. الفكرة: كودك بيتكلم مع «disk» بالاسم، والـ config هو اللي بيقول الـ disk ده فين (فولدر على السيرفر ولا S3).</p>",
      points: [
        "<b>local</b>: <code>storage/app</code>. خاص: مفيش URL مباشر ليه. للعقود والمستندات.",
        "<b>public</b>: <code>storage/app/public</code>. للصور اللي المتصفح لازم يعرضها.",
        "<b>s3</b>: Amazon S3 أو أي مخزن متوافق (endpoint). محتاج <code>composer require league/flysystem-aws-s3-v3 \"^3.0\"</code> ومتغيرات <code>AWS_*</code>.",
        "الـ disks بتتعرف في <code>config/filesystems.php</code> وافتراضيها من <code>FILESYSTEM_DISK</code> في <code>.env</code>.",
        "الـ disk العام مش بيتشاف من الويب لحد ما تعمل <code>php artisan storage:link</code>: بيعمل رابط symlink من <code>public/storage</code> إلى <code>storage/app/public</code> (إعداده في مفتاح <code>links</code> في نفس ملف الـ config).",
      ],
      code: {
        lang: "php",
        src: `<?php

use Illuminate\\Support\\Facades\\Storage;

Storage::disk('public')->put('notes/a.txt', 'hello');   // write
Storage::disk('public')->get('notes/a.txt');            // read
Storage::disk('public')->exists('notes/a.txt');         // true
Storage::disk('public')->size('notes/a.txt');           // 5 (bytes)
Storage::disk('public')->url('notes/a.txt');            // /storage/notes/a.txt
Storage::disk('public')->delete('notes/a.txt');
Storage::disk('public')->deleteDirectory('notes');

Storage::put('x.txt', 'hi');     // no disk name = the default disk`,
        note: "جربتها على disk معمول له <code>Storage::fake('public')</code>: الـ <code>url()</code> رجّعت <code>/storage/notes/a.txt</code> (تتحول لرابط كامل لو <code>APP_URL</code> مضبوط).",
      },
      pitfall: "نسيان <code>storage:link</code> في السيرفر الجديد هو أشهر سبب لـ «الصور بتتحفظ بس مش بتظهر» (404 على <code>/storage/...</code>). وكمان <code>public/storage</code> رابط مش فولدر حقيقي: ما بيترفعش مع git وبتعمله على كل بيئة.",
      interview: [
        { q: "إيه الفرق بين الـ disks <code>local</code> و <code>public</code> و <code>s3</code>؟", a: "الـ <code>local</code> فولدر <code>storage/app</code> خاص ومالوش URL مباشر، مناسب للملفات الحساسة. الـ <code>public</code> فولدر <code>storage/app/public</code> بيتعرض عبر symlink من <code>storage:link</code> فينفع للصور. الـ <code>s3</code> تخزين سحابي مش مرتبط بسيرفر معين، وده بيحل مشكلة إن عندك أكتر من سيرفر أو إن السيرفر ممكن يتمسح. الكود واحد (<code>Storage::disk(...)</code>) والتبديل من الـ config." },
      ],
    },
    {
      title: "تخزين الـ uploads: store و storeAs و putFile",
      en: "Storing uploaded files",
      body: "<p>الملف اللي المستخدم بيرفعه بيوصل كـ <code>UploadedFile</code> من <code>$request->file('photo')</code>. بتخزنه بـ method واحدة وبترجعلك الـ <b>path النسبي</b> اللي تحطه في الداتابيز (مش الـ URL الكامل، عشان لو انتقلت من local لـ S3 ما تحتاجش تعدل البيانات).</p>",
      code: {
        lang: "php",
        src: `<?php

$file = $request->file('photo');

// random name (hash), keeps the real extension
$path = $file->store('listings', 'public');
// listings/lKR2T5xIDjtz0eeaGGeCAShSda4dd84nfefPq0zR.jpg

// your own name (careful: collisions)
$path = $file->storeAs('listings', 'cover.jpg', 'public');

// same as store(), from the Storage facade
$path = Storage::disk('public')->putFile('docs', $file);

$file->hashName();             // the random name store() would use
$file->extension();            // 'jpg' guessed from the real content
$file->getClientOriginalName();// 'villa.jpg' <- what the user claims

$photo = $listing->photos()->create(['path' => $path]);`,
        note: "جربتها بملف fake: الاسم الناتج 40 حرف عشوائي + الامتداد، والـ <code>storeAs</code> رجّعت <code>listings/cover.jpg</code>. الـ <code>extension()</code> بتخمنه من محتوى الملف، أما <code>getClientOriginalName()</code> فده اللي المستخدم بعته.",
      },
      pitfall: "متستخدمش <code>getClientOriginalName()</code> كاسم تخزين: المستخدم هو اللي بيحدده (ممكن <code>../../x.php</code>)، وممكن يتكرر فيكتب فوق ملف حد تاني. خلي <code>store()</code> تولّد الاسم الهاش، واحفظ الاسم الأصلي في عمود لو محتاجه للعرض فقط.",
      interview: [
        { q: "إزاي بتخزن صورة رفعها المستخدم وإيه اللي بتحفظه في الداتابيز؟", a: "برفع الملف كـ multipart، بفاليديت الأول، وبعدين <code>$request->file('photo')->store('listings', 'public')</code> بتخزن الملف باسم عشوائي (hash) وبترجّع الـ path النسبي. الـ path ده اللي بحفظه في جدول <code>photos</code>، مش الـ URL الكامل، وبولّد الـ URL وقت العرض بـ <code>Storage::url()</code>. كده لو غيرت الـ disk أو الدومين الداتا تفضل صح." },
      ],
    },
    {
      title: "فاليديشن الرفع وحدود الحجم",
      en: "Validating uploads",
      body: "<p>الملفات أخطر input في الـ API: ممكن تبقى ضخمة، أو سكريبت متنكر في شكل صورة. القاعدة: <b>افحص النوع والحجم والأبعاد قبل التخزين</b>، وافتكر إن في حدين يتفحصوا قبل ما كود Laravel يشتغل أصلا.</p>",
      code: {
        lang: "php",
        src: `<?php

$request->validate([
    'photo' => [
        'required',
        'image',                       // jpg, jpeg, png, gif, bmp, webp
        'mimes:jpg,jpeg,png',          // narrow it down
        'max:2048',                    // KILOBYTES: 2 MB
        'dimensions:max_width=4000,max_height=4000',
    ],
    'contract' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
]);

// php.ini limits apply BEFORE Laravel sees the request:
//   upload_max_filesize = 2M   (one file)
//   post_max_size       = 8M   (whole request)`,
        note: "جربت: ملف PDF مرفوع في حقل <code>image</code> رجّع خطأ validation على <code>photo</code>، وصورة 3000KB رجّعت نفس الخطأ بسبب <code>max:2048</code>، وصورة صغيرة صح اتخزنت. الـ <code>max</code> هنا بالكيلوبايت (مش بايت ولا ميجا).",
      },
      pitfall: "لو الملف أكبر من <code>upload_max_filesize</code> أو <code>post_max_size</code> في php.ini، PHP بيرمي الملف قبل الـ validation والـ <code>file('photo')</code> بيرجّع ملف غير صالح أو الريكويست يبان فاضي، وده بيحير: «الـ max بتاعي 10MB ولسه بيفشل». عدّل php.ini (وإعداد nginx <code>client_max_body_size</code>) بما يناسب.",
      focus: [{ label: "احفظها", text: "<b>الصور الكبيرة والذاكرة:</b> لما تفتح صورة لتصغيرها (GD أو Intervention Image)، الصورة بتتفك في الذاكرة بحجم تقريبي <code>العرض × الارتفاع × 4</code> بايت، فصورة 6000×4000 بتاخد حوالي 96MB وممكن تعدي <code>memory_limit</code>. حدد الأبعاد في الـ validation، وعالج الصور في job في الخلفية (المستوى 12) مش في الريكويست." }],
      interview: [
        { q: "إيه المخاطر في رفع الملفات وإزاي بتحمي نفسك؟", a: "ملف ضخم يملا الـ disk أو الذاكرة، وملف تنفيذي أو سكريبت متنكر كصورة، واسم ملف خبيث. بحميها بـ validation على النوع (<code>image</code> و <code>mimes</code>) والحجم (<code>max</code>) والأبعاد، وبحط حدود php.ini وnginx، وبخزن باسم هاش من <code>store()</code> مش اسم المستخدم، وبخزن برا مسار فيه تنفيذ كود. وأي عملية تقيلة على الصورة بتتعمل في queue." },
      ],
    },
    {
      title: "الملفات الخاصة: download و temporary URLs",
      en: "Serving private files",
      body: "<p>العقد PDF مش لازم أي حد معاه الرابط يفتحه. خزّنه على disk خاص (<code>local</code> أو S3 private) وقدّمه من خلال route بيعمل <b>authorization</b> الأول. ولو عايز تدي حد رابط مؤقت من غير تسجيل دخول: رابط موقّع (signed) بينتهي بعد وقت.</p>",
      code: {
        lang: "php",
        src: `<?php

use Illuminate\\Support\\Facades\\Storage;
use Illuminate\\Support\\Facades\\URL;

// 1) stream through your app after checking permission
Route::get('/contracts/{name}', function (string $name) {
    return Storage::disk('local')->download(
        "contracts/{$name}.pdf", 'contract.pdf'
    );
})->name('contracts.download')->middleware('signed');

// 2) a link that expires in 10 minutes
$url = URL::temporarySignedRoute(
    'contracts.download', now()->addMinutes(10), ['name' => 'c-1']
);

// 3) S3: a pre-signed URL straight to the bucket
$url = Storage::disk('s3')->temporaryUrl('contracts/c-1.pdf', now()->addMinutes(10));`,
        note: "جربت (1) و (2): الطلب من غير توقيع رجّع <code>403</code>، والرابط الموقّع اشتغل ورجّع header <code>Content-Disposition</code>، وبعد 6 دقايق رجّع <code>403</code> تاني. وكمان اتجرب إن الـ disk المحلي بيدعم <code>temporaryUrl</code> لما تضيف <code>'serve' =&gt; true</code> في إعداد الـ disk (Laravel 11.57)؛ وقبلها كان ده خاص بـ S3. (3) على S3 فعلا لم أشغّلها.",
      },
      pitfall: "الـ signed URL بيثبت إن الرابط ما اتعدّلش وما انتهاش، <b>مش</b> إن اللي بيفتحه مسموح له. أي حد معاه الرابط يفتحه. فلو الملف حساس جدا قصّر المدة، أو حط authorization داخل الـ route كمان.",
      interview: [
        { q: "إزاي تقدّم ملف خاص (عقد PDF) لمستخدم معين بس؟", a: "بخزنه على disk خاص مالوش URL عام، وبعمل route بيتأكد من الصلاحية (policy أو gate) وبعدين بيرجّع <code>Storage::download(...)</code> فتتبعت الملف stream. ولو عايز رابط ممكن أبعته: <code>URL::temporarySignedRoute</code> مع middleware <code>signed</code>، أو <code>temporaryUrl</code> على S3 اللي بيدي رابط مباشر للـ bucket وبينتهي بعد وقت. الفرق إن الرابط الموقّع مش بيتحقق من هوية المستخدم، بس من التوقيع." },
      ],
    },
    {
      title: "مسح الملف مع الموديل",
      en: "Deleting files with the model",
      body: "<p>مسح الصف من الداتابيز <b>مش</b> بيمسح الملف من الـ disk. لو سبته هتتراكم ملفات يتيمة (orphans) بتاكل مساحة. أنسب مكان: model event (<code>deleted</code>) أو observer (المستوى 11).</p>",
      code: {
        lang: "php",
        title: "app/Models/Photo.php",
        src: `<?php

use Illuminate\\Support\\Facades\\Storage;

class Photo extends Model
{
    protected static function booted(): void
    {
        static::deleted(function (Photo $photo) {
            Storage::disk('public')->delete($photo->path);
        });
    }
}

$listing->photos()->first()->delete();   // row + file gone

// bulk delete does NOT fire model events:
$listing->photos()->delete();   // runs "delete from photos", files stay!`,
        note: "جربت: بعد <code>$photo->delete()</code> الملف اختفى من الـ disk الـ fake. وكمان الـ cascade على مستوى الداتابيز (لما تمسح الإعلان وبتتمسح الصور بـ <code>cascadeOnDelete</code>) برضه بيتخطى الـ events والملفات تفضل.",
      },
      pitfall: "مع <code>SoftDeletes</code> الحدث <code>deleted</code> بيشتغل عند الـ soft delete، يعني الملف هيتمسح والمستخدم يقدر يعمل restore لصف بلا ملف. استخدم <code>forceDeleted</code> لمسح الملف. ولو مسحت الملف جوه transaction وبعدين عملت rollback الملف راح والصف رجع: امسح الملفات بعد الـ commit.",
      interview: [
        { q: "لو مسحت إعلان، الصور بتاعته بتروح فين؟", a: "الصفوف ممكن تتمسح بالـ cascade على الداتابيز، لكن الملفات على الـ disk لا. لازم أمسحها بنفسي: observer على الـ <code>Photo</code> يمسح الملف في <code>deleted</code> (أو <code>forceDeleted</code> لو SoftDeletes)، أو job بيدور على الملفات اليتيمة. وخد بالك إن الـ bulk delete والـ cascade بيتخطوا الـ model events." },
      ],
    },
    {
      title: "الـ Mail: Mailable ومعاه markdown",
      en: "Mailables",
      body: "<p>كل إيميل بيتعرف في كلاس <code>Mailable</code> (<code>php artisan make:mail InquiryReceived --markdown=mail.inquiry-received</code>). في Laravel 11 الكلاس فيه <code>envelope()</code> (الموضوع والمرسل) و<code>content()</code> (القالب والبيانات) و<code>attachments()</code>. والـ markdown mail قالب Blade بمكونات جاهزة (<code>x-mail::message</code> و<code>x-mail::button</code>) ويطلع HTML شيك ونسخة نصية.</p>",
      codes: [
        {
          lang: "php",
          title: "app/Mail/InquiryReceived.php",
          src: `<?php

namespace App\\Mail;

use App\\Models\\Inquiry;
use Illuminate\\Bus\\Queueable;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Mail\\Mailable;
use Illuminate\\Mail\\Mailables\\Content;
use Illuminate\\Mail\\Mailables\\Envelope;
use Illuminate\\Queue\\SerializesModels;

class InquiryReceived extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Inquiry $inquiry) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'New inquiry on your listing');
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.inquiry-received',
            with: ['title' => $this->inquiry->listing->title],
        );
    }
}`,
        },
        {
          lang: "blade",
          title: "resources/views/mail/inquiry-received.blade.php",
          src: `<x-mail::message>
# New inquiry

Someone asked about **{{ $title }}**:

> {{ $inquiry->message }}

<x-mail::button :url="url('/inquiries/'.$inquiry->id)">
View inquiry
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>`,
          note: "الـ <code>public</code> properties في الـ constructor بتبقى متاحة للقالب تلقائي (<code>$inquiry</code>)، و<code>with</code> للبيانات الإضافية.",
        },
      ],
      pitfall: "إرسال الإيميل بشكل متزامن جوه الريكويست بيخلي المستخدم يستنى SMTP (ثواني، وممكن يفشل). الحل: الكلاس <code>implements ShouldQueue</code> أو <code>Mail::to($x)-&gt;queue(new ...)</code> أو <code>-&gt;later(now()-&gt;addMinutes(10), ...)</code> (محتاجة worker من المستوى 12). وفي التطوير خلّي <code>MAIL_MAILER=log</code> فالإيميل يتكتب في <code>storage/logs</code> بدل ما يتبعت.",
      interview: [
        { q: "إزاي بتبعت إيميل في Laravel وليه بتحطه في queue؟", a: "بعمل Mailable (<code>make:mail</code>) فيه <code>envelope</code> للموضوع و<code>content</code> للقالب (غالبا markdown)، وبرسله بـ <code>Mail::to($email)-&gt;send(new X($data))</code>. بخليه <code>ShouldQueue</code> عشان الإرسال بيبقى في الخلفية: الـ API يرد بسرعة، والفشل المؤقت في SMTP يتعاد تلقائي بدل ما يطيّر الريكويست. وفي الاختبارات بستخدم <code>Mail::fake()</code>." },
      ],
    },
    {
      title: "Notifications: رسالة واحدة، قنوات كتير",
      en: "Notification channels",
      body: "<p>الـ Mailable لإيميل واحد. أما <b>Notification</b> فهي «حدث بتبلغ بيه مستخدم» وبتختار هي يوصله ازاي: إيميل، أو سجل في الداتابيز (يظهر في جرس التطبيق)، أو broadcast لحظي، أو قنوات تانية. الكلاس فيه <code>via()</code> بترجّع القنوات، وكل قناة ليها method: <code>toMail</code> و<code>toArray</code> (أو <code>toDatabase</code>) و<code>toBroadcast</code>. الموديل اللي بيستقبل (User) لازم يستخدم trait اسمه <code>Notifiable</code> (موجود في الـ User الافتراضي).</p>",
      code: {
        lang: "php",
        title: "app/Notifications/NewInquiry.php",
        src: `<?php

class NewInquiry extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Inquiry $inquiry) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New inquiry')
            ->greeting('Hello '.$notifiable->name)
            ->line($this->inquiry->message)
            ->action('Open', url('/inquiries/'.$this->inquiry->id));
    }

    public function toArray(object $notifiable): array
    {
        return ['inquiry_id' => $this->inquiry->id];
    }
}

$office->users->each->notify(new NewInquiry($inquiry));
Notification::send($users, new NewInquiry($inquiry));
Notification::route('mail', 'guest@example.com')->notify(new NewInquiry($inquiry));`,
        note: "الأخير اسمه <b>on-demand notification</b>: بتبعت لعنوان مش مستخدم عندك (زائر). جربت الثلاثة بـ <code>Notification::fake()</code> (<code>assertSentTo</code> و<code>assertSentOnDemand</code>)، وجربت القناة <code>database</code> فعليا: اتسجل صف في <code>notifications</code> بـ <code>data = ['inquiry_id' =&gt; ...]</code>.",
      },
      pitfall: "قناة <code>database</code> محتاجة جدول: <code>php artisan make:notifications-table</code> ثم <code>migrate</code> (الأمر دلوقتي اسمه كده في 11، والاسم القديم <code>notifications:table</code> لسه بيشتغل كـ alias). وطالما الـ Notification <code>implements ShouldQueue</code> فكل قناة بتتبعت كـ job منفصل، فلازم worker شغال.",
      interview: [
        { q: "إيه الفرق بين Mailable و Notification؟", a: "الـ Mailable مخصوص للإيميل: كلاس واحد يمثل إيميل. الـ Notification تمثل «تنبيه» ممكن يوصل بعدة قنوات (mail, database, broadcast, SMS...) من نفس الكلاس، وبتتبعت لـ notifiable (غالبا User) بـ <code>$user->notify()</code>. لو الإيميل هو القناة الوحيدة والمحتوى معقد بستخدم Mailable، ولو عايز المستخدم يتبلغ بأكتر من طريقة وفي إشعارات داخل التطبيق بستخدم Notification." },
      ],
    },
    {
      title: "إشعارات قاعدة البيانات: الجرس داخل التطبيق",
      en: "Database notifications",
      body: "<p>قناة <code>database</code> بتخزن الإشعار في جدول <code>notifications</code> (عمود <code>data</code> = JSON من <code>toArray</code>). التطبيق (Flutter مثلا) بيعرض قايمة الإشعارات من API بتقرا الجدول ده.</p>",
      code: {
        lang: "php",
        src: `<?php

$user = $request->user();

$user->notifications;                 // all (newest first)
$user->unreadNotifications;           // only where read_at is null
$user->unreadNotifications->count();  // for the bell badge

$user->unreadNotifications->markAsRead();          // all at once
$user->notifications()->find($id)?->markAsRead();  // one

// API: GET /api/notifications
return $user->notifications()->latest()->paginate(20);`,
        note: "جربتها: بعد <code>notify</code> اتسجل صف واحد، و<code>unreadNotifications</code> رجّعته، وبعد <code>markAsRead()</code> بقت 0. الـ <code>data</code> رجّعت <code>inquiry_id</code> اللي حطيته في <code>toArray</code>.",
      },
      pitfall: "متحطش في <code>toArray</code> بيانات كبيرة أو حساسة أو نسخة كاملة من الموديل: بتتخزن JSON وتفضل معاك. خزّن الـ id وكام حقل يكفوا للعرض، وجيب الباقي وقت اللزوم. وكمان بتحتاج job لتنضيف الإشعارات القديمة المقروءة.",
    },
    {
      title: "Push notifications عبر FCM: على مستوى الفكرة",
      en: "Push notifications with FCM",
      body: "<p>الإشعار اللي بيظهر على موبايل المستخدم والتطبيق مقفول بيتبعت عن طريق Firebase Cloud Messaging (FCM) لأندرويد وAPNs (عبر FCM) لـ iOS. الـ Laravel مش بتبعت للموبايل مباشرة، بتبعت لـ FCM وهو يوصل. الخطوات:</p>",
      points: [
        "<b>التطبيق</b> (Flutter بـ <code>firebase_messaging</code>) بيطلب الإذن ويجيب <b>device token</b> من FCM، وبيبعته لـ API بتاعك: <code>POST /api/devices</code>.",
        "<b>السيرفر</b> بيخزن التوكنز في جدول <code>device_tokens</code> (<code>user_id</code>, <code>token</code>, <code>platform</code>). المستخدم الواحد ممكن يبقى عنده أكتر من جهاز، والتوكن ممكن يتغير.",
        "عند الحدث، السيرفر يبعت طلب لـ FCM (واجهة HTTP v1 بتتوثق بـ service account من Firebase، وجوجل ألغت الواجهة القديمة legacy) بالتوكن والعنوان والنص.",
        "لو FCM رجّع إن التوكن غير صالح (التطبيق اتمسح) <b>امسح التوكن</b> من الجدول.",
        "في Laravel بتلف ده كله في <b>custom notification channel</b>: كلاس فيه <code>send($notifiable, Notification $notification)</code> وبتحطه في <code>via()</code>.",
      ],
      code: {
        lang: "php",
        title: "concept: a custom channel (FcmClient is YOUR wrapper)",
        src: `<?php

class PushChannel
{
    public function __construct(private FcmClient $fcm) {}

    public function send(object $notifiable, Notification $n): void
    {
        $msg = $n->toPush($notifiable);   // your own method

        foreach ($notifiable->deviceTokens as $device) {
            $this->fcm->send($device->token, $msg['title'], $msg['body']);
        }
    }
}

// in the notification class
public function via(object $notifiable): array
{
    return ['database', PushChannel::class];
}`,
        note: "الـ <code>FcmClient</code> هنا كلاس بتكتبه إنت (أو package بتختاره) وبيستدعي FCM؛ مش API من Laravel ومش اسم package حقيقي. اللي جربته هو آلية القناة نفسها (كلاس بـ <code>send</code> بيتحل من الـ container وبيتنادى من <code>notify</code>) بـ client وهمي. الاتصال الحقيقي بـ FCM لم أجربه.",
      },
      pitfall: "متبعتش push من جوه الريكويست مباشرة (الشبكة بطيئة وممكن تفشل). خلي الـ Notification <code>ShouldQueue</code>. وبرضه الـ push مش مضمون التسليم: ما تعتمدش عليه كمصدر وحيد، خزّن الإشعار في الداتابيز برضه.",
      interview: [
        { q: "إزاي تبعت push notification لتطبيق موبايل من Laravel؟", a: "التطبيق بيجيب device token من FCM وبيبعته لـ API بيخزنه في جدول مرتبط بالمستخدم. لما يحصل الحدث بعمل Notification فيها قناة push (custom channel أو package) بتبعت لـ FCM التوكنز بتاعة المستخدم بالعنوان والنص، وFCM بيوصلها للجهاز. بخلي الإرسال في queue، وبمسح التوكنز اللي FCM يقول إنها غير صالحة، وبحفظ الإشعار في الداتابيز كمان." },
      ],
    },
    {
      title: "Broadcasting: الأحداث اللحظية في شريحة",
      en: "Broadcasting",
      body: "<p>الـ API العادي: العميل يسأل والسيرفر يرد. لو عايز السيرفر <b>يدفع</b> حاجة للعميل لحظيا (استفسار جديد وصل، شات) محتاج WebSocket. الـ Broadcasting بيحول Laravel event لرسالة على WebSocket: الحدث <code>implements ShouldBroadcast</code>، وبيتبعت (عبر queue) لسيرفر WebSocket: <b>Laravel Reverb</b> (السيرفر الرسمي، تشغّله بنفسك) أو <b>Pusher</b> (خدمة مستضافة). والعميل بيسمع بمكتبة Laravel Echo.</p>",
      code: {
        lang: "php",
        src: `<?php

// php artisan install:broadcasting   (Laravel 11: sets up routes/channels.php)

class InquiryCreated implements ShouldBroadcast
{
    public function __construct(public Inquiry $inquiry) {}

    public function broadcastOn(): array
    {
        // private channel: only authorized users may listen
        return [new PrivateChannel('office.'.$this->inquiry->listing->office_id)];
    }
}

// routes/channels.php
Broadcast::channel('office.{officeId}', function (User $user, int $officeId) {
    return $user->office_id === $officeId;
});

InquiryCreated::dispatch($inquiry);`,
        note: "الكود ده لم أشغّله (محتاج سيرفر WebSocket وعميل)؛ تأكدت بس إن أمر <code>install:broadcasting</code> موجود في المشروع. القنوات: <code>Channel</code> عامة، <code>PrivateChannel</code> محتاجة authorization من <code>routes/channels.php</code>، <code>PresenceChannel</code> بتعرف مين متصل.",
      },
      interview: [
        { q: "إيه الـ broadcasting في Laravel ومتى تستخدمه؟", a: "إنك تبعت event من السيرفر للعميل لحظيا عبر WebSocket بدل ما العميل يعمل polling. الـ event بيعمل <code>ShouldBroadcast</code> ويحدد القناة في <code>broadcastOn</code>، وبيتنقل عبر Reverb أو Pusher، والعميل بيسمع بـ Echo. بستخدم <code>PrivateChannel</code> للبيانات الخاصة مع authorization في <code>routes/channels.php</code>. مناسب للشات والإشعارات اللحظية، وغير لازم لو التحديث كل دقيقة كفاية." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: رفع صورة وتخزينها",
      lang: "php",
      code: `<?php

$request->validate([
    'photo' => ['required', 'image', 'max:2048'],
]);

$path = $request->file('photo')->store('listings', 'public');

$photo = $listing->photos()->create(['path' => $path]);
$url = Storage::disk('public')->url($path);`,
    },
    {
      title: "اكتب: Mailable بـ envelope و content",
      lang: "php",
      code: `<?php

class InquiryReceived extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Inquiry $inquiry) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'New inquiry');
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.inquiry-received');
    }
}`,
    },
    {
      title: "اكتب: Notification بقناتين",
      lang: "php",
      code: `<?php

class NewInquiry extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Inquiry $inquiry) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toArray(object $notifiable): array
    {
        return ['inquiry_id' => $this->inquiry->id];
    }
}`,
    },
  ],

  tasks: [
    {
      title: "endpoint لرفع صورة إعلان",
      lang: "php",
      prompt: "<p>اكتب method <code>store(Request $request, Listing $listing): JsonResponse</code> في <code>ListingPhotoController</code>: تفاليديت الحقل <code>photo</code> (مطلوب، صورة jpg أو png، أقصى 2MB)، وتخزنه على disk <code>public</code> في فولدر <code>listings/{id}</code>، وتسجل صف في <code>photos</code> عن طريق علاقة الإعلان، وترجع <code>201</code> و JSON فيه <code>id</code> و<code>url</code>.</p>",
      examples: [{ in: "POST /listings/5/photos  (photo = villa.png)", out: "201 {\"id\": 1, \"url\": \"/storage/listings/5/ab12...png\"}" }],
      hints: [
        "قواعد: <code>required</code> و<code>image</code> و<code>mimes:jpg,jpeg,png</code> و<code>max:2048</code> (كيلوبايت).",
        "<code>$request-&gt;file('photo')-&gt;store(\"listings/{$listing-&gt;id}\", 'public')</code> بترجّع الـ path.",
        "<code>$listing-&gt;photos()-&gt;create(['path' =&gt; $path])</code> ثم <code>Storage::disk('public')-&gt;url($path)</code>.",
      ],
      solution: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Listing;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;

class ListingPhotoController extends Controller
{
    public function store(Request $request, Listing $listing): JsonResponse
    {
        $request->validate([
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        $path = $request->file('photo')->store("listings/{$listing->id}", 'public');
        $photo = $listing->photos()->create(['path' => $path]);

        return response()->json([
            'id' => $photo->id,
            'url' => Storage::disk('public')->url($path),
        ], 201);
    }
}`,
      explain: "بنخزن الـ <b>path</b> في الداتابيز ونولّد الـ URL وقت الرد. الـ validation بيحصل قبل التخزين فملف غلط ما بيوصلش للـ disk. والاسم بيتولّد هاش من <code>store</code> فمفيش تصادم أو path traversal. جربت نسخة مطابقة في اختبار: ملف صحيح رجّع 201، وريكويست من غير ملف رجّع خطأ validation على <code>photo</code>.",
    },
    {
      title: "رابط موقّع مؤقت لعقد PDF",
      lang: "php",
      prompt: "<p>العقود في <code>storage/app/contracts/{name}.pdf</code> (disk <code>local</code>). اكتب route باسم <code>contracts.download</code> بيرجّع الملف للتحميل باسم <code>contract.pdf</code> ومحمي بـ middleware <code>signed</code>، ثم سطر يولّد رابطا صالحا 15 دقيقة للعقد <code>c-1</code>.</p>",
      hints: [
        "<code>Storage::disk('local')-&gt;download($path, $downloadName)</code>.",
        "<code>URL::temporarySignedRoute($routeName, $expiration, $params)</code>.",
      ],
      solution: `<?php

use Illuminate\\Support\\Facades\\Route;
use Illuminate\\Support\\Facades\\Storage;
use Illuminate\\Support\\Facades\\URL;

Route::get('/contracts/{name}', function (string $name) {
    return Storage::disk('local')->download(
        "contracts/{$name}.pdf",
        'contract.pdf'
    );
})->name('contracts.download')->middleware('signed');

$url = URL::temporarySignedRoute(
    'contracts.download',
    now()->addMinutes(15),
    ['name' => 'c-1']
);`,
      explain: "الـ middleware <code>signed</code> بيرفض (403) أي رابط من غير توقيع صحيح أو منتهي. الملف على disk خاص فمفيش طريقة توصله إلا من خلال الـ route. ملحوظة: الرابط بيثبت صلاحية التوقيع بس، مش هوية اللي بيفتحه؛ لو محتاج هوية حط auth قبل ما تولّد الرابط. جربته: بدون توقيع 403، بالتوقيع 200، بعد انتهاء المدة 403.",
    },
    {
      title: "NewInquiry: إيميل وسجل داخل التطبيق",
      lang: "php",
      prompt: "<p>اكتب Notification اسمها <code>NewInquiry</code> بتتبعت في الخلفية (queued) على قناتين: <code>mail</code> (الموضوع «New inquiry»، تحية باسم المستلم، سطر برسالة الاستفسار، وزر «Open» لرابط <code>/inquiries/{id}</code>) و<code>database</code> (بتخزن <code>inquiry_id</code> و<code>listing_id</code>). وبعدين اسطر كود يبعتها لمكتب كامل (<code>$office->users</code>).</p>",
      hints: [
        "<code>implements ShouldQueue</code> مع <code>use Queueable</code>، و<code>via()</code> بترجّع <code>['mail', 'database']</code>.",
        "<code>toMail</code> بترجّع <code>MailMessage</code>: <code>subject</code> و<code>greeting</code> و<code>line</code> و<code>action</code>.",
        "<code>Notification::send($office-&gt;users, new NewInquiry($inquiry))</code>.",
      ],
      solution: `<?php

namespace App\\Notifications;

use App\\Models\\Inquiry;
use Illuminate\\Bus\\Queueable;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Notifications\\Messages\\MailMessage;
use Illuminate\\Notifications\\Notification;

class NewInquiry extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Inquiry $inquiry) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New inquiry')
            ->greeting('Hello '.$notifiable->name)
            ->line($this->inquiry->message)
            ->action('Open', url('/inquiries/'.$this->inquiry->id));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'inquiry_id' => $this->inquiry->id,
            'listing_id' => $this->inquiry->listing_id,
        ];
    }
}

// Notification::send($office->users, new NewInquiry($inquiry));`,
      explain: "نفس الكلاس ده جربته: <code>Notification::fake()</code> أكد الإرسال بقناة mail، والقناة database سجلت صف بـ <code>data</code> الصح. لو الـ User مفيهوش trait <code>Notifiable</code> هتحتاج تضيفه. وفي production لازم worker شغال عشان القنوات تتبعت (لأنها queued).",
    },
  ],

  quiz: [
    {
      q: "بعد deploy على سيرفر جديد، الصور بتتخزن (الملف موجود في <code>storage/app/public/listings</code>) لكن الرابط <code>/storage/listings/x.jpg</code> بيدي 404. إيه السبب الأرجح؟",
      options: [
        "الـ validation رفض الصورة",
        "ما اتعملش <code>php artisan storage:link</code> على السيرفر ده",
        "الـ disk اسمه <code>local</code> بدل <code>public</code> في الداتابيز",
        "الـ <code>max</code> أصغر من حجم الصورة",
      ],
      answer: 1,
      why: "<code>public/storage</code> رابط symlink بيتعمل بـ <code>storage:link</code> على كل بيئة (مش بيترفع مع git). من غيره الويب سيرفر مش شايف فولدر <code>storage/app/public</code>. لو الـ validation رفض الصورة مكانش هيكون فيه ملف أصلا.",
    },
    {
      q: "الرقم في <code>'max:2048'</code> على حقل ملف معناه إيه؟",
      options: [
        "2048 بايت",
        "2048 ميجابايت",
        "2048 كيلوبايت (2MB)",
        "2048 بكسل",
      ],
      answer: 2,
      why: "في ملفات الرفع الـ <code>max</code> بالكيلوبايت. وللأبعاد بالبكسل بتستخدم <code>dimensions:max_width=...</code> قاعدة تانية. جربت: صورة 3000KB رفضت.",
    },
    {
      q: "الكود ده بيخزن إيه في عمود <code>path</code>؟",
      code: { lang: "php", src: `<?php
$path = $request->file('photo')->store('listings', 'public');
$listing->photos()->create(['path' => $path]);` },
      options: [
        "الرابط الكامل <code>https://site.com/storage/listings/...</code>",
        "مسار نسبي بالشكل <code>listings/&lt;hash&gt;.jpg</code>",
        "الاسم الأصلي للملف زي <code>villa.jpg</code>",
        "محتوى الصورة نفسها",
      ],
      answer: 1,
      why: "<code>store()</code> بترجّع المسار النسبي جوه الـ disk باسم هاش عشوائي. بتخزنه هو، وتبني الـ URL بـ <code>Storage::url()</code> وقت العرض، فتبديل الدومين أو الـ disk ما يكسرش الداتا.",
    },
    {
      q: "عندك <code>$listing->photos()->delete()</code> وبعدها اكتشفت إن الملفات لسه على الـ disk رغم إن عندك <code>static::deleted(...)</code> في <code>Photo</code>. ليه؟",
      options: [
        "الـ observer لازم يتسجل في <code>AppServiceProvider</code> وإلا مبيشتغلش",
        "الملفات بتتمسح بعد ساعة",
        "<code>deleted</code> مبتشتغلش غير مع <code>forceDelete</code>",
        "الـ delete الجماعي على الـ query بينفذ DELETE واحد ومبيشغّلش model events",
      ],
      answer: 3,
      why: "الـ model events بتشتغل لما الموديل نفسه يتحمّل ويتمسح. <code>query->delete()</code> بينفذ SQL واحد ويتخطاها (نفس المبدأ زي <code>update</code> الجماعية في المستوى 5). الحل: امسح كل صورة على حدة أو امسح الملفات يدويا قبل الـ bulk delete.",
    },
    {
      q: "أي سطر بيخلي الإيميل يتبعت في الخلفية بدل ما يعطّل الريكويست؟",
      options: [
        "<code>Mail::to($u)-&gt;queue(new InquiryReceived($i));</code>",
        "<code>Mail::to($u)-&gt;send(new InquiryReceived($i));</code> من غير ShouldQueue",
        "<code>Mail::fake();</code>",
        "<code>Mail::to($u)-&gt;render(new InquiryReceived($i));</code>",
      ],
      answer: 0,
      why: "<code>queue()</code> (أو الـ Mailable <code>implements ShouldQueue</code>) بيحط الإرسال في الـ queue. <code>send</code> متزامنة. <code>Mail::fake</code> للاختبارات ومبتبعتش حاجة، و<code>render</code> مش موجودة على الـ facade بالشكل ده.",
    },
    {
      q: "إيه اللي بيحصل هنا؟",
      code: { lang: "php", src: `<?php
Notification::route('mail', 'guest@example.com')
    ->notify(new NewInquiry($inquiry));` },
      options: [
        "بترمي exception لأن مفيش User",
        "بتخزن الإشعار في جدول notifications لـ guest",
        "بتبعت على القناة mail للعنوان ده من غير ما يكون عندك User (on-demand notification)",
        "بتبعت لكل المستخدمين",
      ],
      answer: 2,
      why: "ده الـ on-demand notification: بتحدد العنوان بنفسك. قناة <code>database</code> مش هتنفع هنا لأن مفيش notifiable يتخزن له الصف، فاستخدمها لقنوات زي mail.",
    },
    {
      q: "عملت قناة <code>database</code> في <code>via()</code> وأول ما شغّلت <code>$user->notify(...)</code> ظهر خطأ إن جدول <code>notifications</code> مش موجود. الحل؟",
      options: [
        "<code>php artisan storage:link</code>",
        "<code>php artisan config:cache</code>",
        "<code>php artisan make:notifications-table</code> ثم <code>php artisan migrate</code>",
        "<code>php artisan queue:restart</code>",
      ],
      answer: 2,
      why: "الجدول مش بيتعمل تلقائي في مشروع جديد، فبتولّد migration بالأمر ده وتشغّلها. الأوامر التانية مالهاش علاقة بإنشاء الجداول.",
    },
    {
      q: "الإشعار بيوصل push للتطبيق عن طريق إيه؟",
      options: [
        "Laravel بتتصل بالموبايل مباشرة بالـ IP",
        "التطبيق بيبعت device token للسيرفر، والسيرفر بيبعت الرسالة لـ FCM اللي بيوصلها للجهاز",
        "المتصفح بيعمل polling كل ثانية",
        "الـ Eloquent بيبعت الإشعار تلقائي لما الصف يتحدث",
      ],
      answer: 1,
      why: "الـ push يمر عبر FCM: التطبيق يسجل التوكن، السيرفر يخزنه ويبعت لـ FCM بالتوكن. مفيش اتصال مباشر بالجهاز. والـ polling هو بالظبط اللي بنتجنبه بالـ push أو الـ broadcasting.",
    },
    {
      q: "أنهي قناة في Broadcasting محتاجة authorization في <code>routes/channels.php</code> قبل ما العميل يسمع عليها؟",
      options: [
        "<code>Channel</code> العامة",
        "<code>PrivateChannel</code>",
        "أي قناة اسمها فيه رقم",
        "مفيش قنوات محتاجة authorization",
      ],
      answer: 1,
      why: "الـ <code>PrivateChannel</code> (والـ <code>PresenceChannel</code>) بيتحقق منها Laravel عبر <code>Broadcast::channel(...)</code> اللي بترجّع true/false للمستخدم. القناة العامة أي حد يسمعها.",
    },
  ],
};
