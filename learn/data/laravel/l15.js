window.LEVELS = window.LEVELS || {};
window.LEVELS["laravel/l15"] = {
  slides: [
    {
      kicker: "ليه نبدأ من هنا",
      title: "تلات طرق تعرض بيها واجهة من Laravel",
      en: "Server-rendered vs SPA vs Inertia",
      body: "<p>لحد دلوقتي بنينا API بيرجّع JSON. بس لوحة تحكم المكاتب في مشروع عقارات (admin panel) غالبا بتتبني بأحد تلات أساليب، وإنترفيو الـ Laravel بيسأل عن الفرق:</p>",
      points: [
        "<b>Server-rendered (Blade):</b> السيرفر بيرجّع HTML جاهز لكل صفحة. بسيط، سريع في أول تحميل، SEO ممتاز. كل تفاعل = ريكويست وصفحة جديدة، وأي تفاعل ديناميكي بتحتاج JavaScript لوحده.",
        "<b>SPA (Vue/React + API):</b> تطبيق JavaScript منفصل بيكلم الـ API بـ JSON. تجربة سلسة، وبيخدم موبايل وويب بنفس الـ API. بس بتبني وتصون طبقتين: API كاملة + routing وauth وstate في الـ frontend.",
        "<b>Inertia:</b> نمط وسط: بتكتب الصفحات بـ Vue، لكن الـ routing والـ controllers والـ auth والـ validation كلها في Laravel كالعادة. مفيش API منفصلة للصفحات: الـ controller بيرجّع اسم الصفحة وبياناتها.",
        "في مشروع زي اللي بنينا: الـ API (Sanctum) بيخدم تطبيق Flutter، ولوحة المكاتب بـ Inertia + Vue عشان فريق Laravel صغير ميبنيش API تانية للوحة.",
      ],
      focus: [{ label: "احفظها", text: "اختار Blade لو الصفحات في الأغلب محتوى وفورمز. اختار SPA لو الـ API لازم تخدم عملاء كتير أو الفريق frontend منفصل. اختار Inertia لما تحب تجربة SPA من غير تكلفة API منفصلة." }],
      interview: [
        { q: "إيه الفرق بين Blade و SPA و Inertia ومتى تختار كل واحد؟", a: "Blade بيرندر HTML على السيرفر: بسيط وSEO كويس لكن التفاعل محدود. الـ SPA تطبيق JS بيكلم API: تجربة غنية وبيخدم عملاء متعددين لكن بتصون طبقتين. Inertia بيسمحلي أكتب صفحات Vue وأفضل أستخدم routes وcontrollers وauth وvalidation بتاعة Laravel، فمفيش API ثانية لنفس الصفحات. بختار Inertia للوحات التحكم لما فريقي Laravel، وSPA لما الـ API هتخدم موبايل وويب وأطراف تانية." },
      ],
    },
    {
      title: "Blade: القالب والـ escaping",
      en: "Blade templates and escaping",
      body: "<p>Blade هو template engine بتاع Laravel. ملفاته <code>*.blade.php</code> في <code>resources/views</code>، وبتتحول (compile) لـ PHP عادي وتتخزن في <code>storage/framework/views</code> (ده ملف <code>view:cache</code>). بتعرض القيم بـ <code>{{ }}</code> وده بيعمل <b>escape تلقائي</b> (<code>htmlspecialchars</code>)، فأي نص جاي من المستخدم بيتحول لنص مش كود.</p>",
      code: {
        lang: "blade",
        src: `{{-- a Blade comment, not sent to the browser --}}

{{ $title }}           {{-- escaped: safe --}}
{!! $html !!}          {{-- RAW: only for HTML you trust --}}
{{ $n ?? 'none' }}     {{-- any PHP expression works --}}

@{{ vueVar }}          {{-- the @ keeps the braces for Vue/JS --}}

<script>
  const titles = @json($listings->pluck('title'));
</script>`,
        note: "جربت <code>Blade::render('{{ $x }}|{!! $x !!}', ['x' => '&lt;script&gt;alert(1)&lt;/script&gt;'])</code>: الأولى طلعت <code>&amp;lt;script&amp;gt;alert(1)&amp;lt;/script&amp;gt;</code> (نص عادي)، والتانية طلعت السكريبت زي ما هو. و<code>@{{ vueVar }}</code> طلعت <code>{{ vueVar }}</code> حرفيا. و<code>@json</code> بتطلع JSON آمن لتمريره لـ JavaScript.",
      },
      pitfall: "<code>{!! !!}</code> على أي بيانات من مستخدم = ثغرة XSS (حد يكتب سكريبت في وصف الإعلان وينفذ عند كل زائر). استخدمها فقط على HTML إنت اللي ولّدته أو نضّفته. الـ escape بيحميك في HTML، لكن داخل attribute أو سكريبت لازم تفضل مع <code>{{ }}</code> أو <code>@json</code> ومتلزقش القيمة في JavaScript كنص.",
      interview: [
        { q: "إيه الفرق بين <code>{{ $x }}</code> و <code>{!! $x !!}</code>؟", a: "الأولى بتعمل escape للـ HTML (بتحول &lt; لـ &amp;lt; وهكذا) فالنص يتعرض كنص حتى لو فيه tags، وده بيحميك من XSS. التانية بتطبع القيمة خام. بستخدم الثانية بس لـ HTML موثوق ولّدته أنا، مش لأي حاجة من input المستخدم." },
      ],
    },
    {
      title: "التحكم والتكرار في Blade",
      en: "Blade control structures",
      body: "<p>الـ directives (اللي بتبدأ بـ <code>@</code>) بتتحول لـ PHP. الأهم: الشروط والـ loops، ومعاها متغير <code>$loop</code> جوه أي <code>@foreach</code>.</p>",
      code: {
        lang: "blade",
        src: `@if ($listings->isEmpty())
    <p>No listings yet.</p>
@endif

<ul>
    @forelse ($listings as $listing)
        <li class="{{ $loop->first ? 'first' : '' }}">
            {{ $loop->iteration }}. {{ $listing->title }}
            @unless ($listing->is_featured) (regular) @endunless
        </li>
    @empty
        <li>nothing here</li>
    @endforelse
</ul>

@auth  welcome back  @endauth
@guest please log in @endguest
@isset($flash) {{ $flash }} @endisset`,
        note: "الـ <code>$loop</code> فيها <code>first</code> و<code>last</code> و<code>index</code> (من 0) و<code>iteration</code> (من 1) و<code>count</code>. جربت الصفحة دي برندر فعلي لإعلانين ورجّعت <code>first</code> للأول بس. <code>@forelse</code> = foreach + حالة القايمة الفاضية.",
      },
      pitfall: "لا تحط query أو منطق ثقيل في القالب (<code>@foreach (Listing::all() as ...)</code>). اجلب الداتا في الـ controller (مع eager loading من المستوى 7) ومرّرها. القالب لازم يكون عرض بس، وإلا بترجع N+1 من جوه الـ view.",
    },
    {
      title: "Layouts و components و forms",
      en: "Layouts, components and forms",
      body: "<p>في Laravel الحديثة بنعمل الـ layout كـ <b>component</b>: ملف في <code>resources/views/components</code> بيتنادى بـ <code>&lt;x-اسم&gt;</code>. المحتوى اللي بين الـ tags بيوصل في <code>{{ $slot }}</code>، والـ named slots بـ <code>&lt;x-slot:nav&gt;</code>. (الأسلوب القديم <code>@extends</code> و<code>@section</code> و<code>@yield</code> لسه شغال). وفي الفورمز لازم <code>@csrf</code>.</p>",
      codes: [
        {
          lang: "blade",
          title: "resources/views/components/layout.blade.php",
          src: `@props(['title' => 'Listings'])
<!doctype html>
<html lang="en">
<head>
    <title>{{ $title }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <nav>{{ $nav ?? '' }}</nav>
    <main>{{ $slot }}</main>
</body>
</html>`,
        },
        {
          lang: "blade",
          title: "resources/views/listings/edit.blade.php",
          src: `<x-layout title="Edit listing">
    <x-slot:nav>Home</x-slot:nav>

    <form method="POST" action="/listings/{{ $listing->id }}">
        @csrf
        @method('PUT')
        <input name="title" value="{{ old('title', $listing->title) }}">
        @error('title')
            <span class="err">{{ $message }}</span>
        @enderror
        <button>Save</button>
    </form>
</x-layout>`,
          note: "جربت الصفحة (من غير سطر <code>@vite</code> لأنه محتاج build): ظهر <code>&lt;input type=\"hidden\" name=\"_token\" ...&gt;</code> من <code>@csrf</code> و<code>&lt;input type=\"hidden\" name=\"_method\" value=\"PUT\"&gt;</code> من <code>@method</code>، والـ nav اتحط في مكانه. المتصفح بيبعت POST بس، و<code>@method</code> بيخلي Laravel تعاملها PUT.",
        },
      ],
      pitfall: "نسيان <code>@csrf</code> في فورم web بيرجّع <b>419 Page Expired</b>. الـ CSRF token بيتحقق منه middleware في group الـ web (مش في الـ api). و<code>old('title')</code> بتجيب القيمة القديمة بعد فشل validation (Laravel بتعمل redirect back ومعاه الـ errors والـ input في الـ session)، و<code>@error</code> بتعرض رسالة الحقل.",
      interview: [
        { q: "ليه الفورم محتاجة <code>@csrf</code>؟", a: "الـ CSRF هجوم إن موقع خبيث يخلي متصفح المستخدم المسجل عندي يبعت POST لموقعي بالـ cookie بتاعته. <code>@csrf</code> بيضيف token عشوائي مربوط بالـ session، وmiddleware <code>VerifyCsrfToken</code> بيرفض أي ريكويست غير آمن من غيره بـ 419. الموقع الخبيث ما يعرفش التوكن. الـ API بـ token (Bearer) مش بتحتاجه لأنه مبيعتمدش على cookie." },
      ],
    },
    {
      title: "Inertia: إزاي بتشتغل",
      en: "How Inertia works",
      body: "<p>Inertia مش framework، هي بروتوكول بين Laravel وـ Vue (أو React أو Svelte). تركيبها: package في Laravel (<code>inertiajs/inertia-laravel</code>) + package في الـ frontend (<code>@inertiajs/vue3</code>). الـ flow:</p>",
      points: [
        "<b>أول زيارة:</b> المتصفح يطلب URL عادي، Laravel بترجّع صفحة HTML كاملة فيها div عليه <code>data-page</code> (JSON فيه <code>component</code> و<code>props</code> و<code>url</code> و<code>version</code>)، وVue بتشتغل وبتعرض الصفحة.",
        "<b>أي تنقل بعد كده:</b> الضغط على <code>&lt;Link&gt;</code> بيعمل ريكويست XHR (fetch) فيه header <code>X-Inertia: true</code>. Laravel بترجّع JSON بنفس الشكل (<code>component</code> + <code>props</code>) بدل HTML، وInertia بتبدّل الـ component من غير reload كامل.",
        "الـ controller بيرجّع <code>Inertia::render('Listings/Index', [...props])</code>. اسم الـ component بيطابق ملف في <code>resources/js/Pages/Listings/Index.vue</code>.",
        "مفيش JSON API لازمة: الـ props هي الداتا. والـ routes والـ middleware والـ authorization والـ validation بتشتغل زي أي web route.",
        "لو الـ assets اتغيرت (deploy جديد) الـ <code>version</code> بيختلف، فـ Laravel بترد بـ <code>409</code> ومعاه <code>X-Inertia-Location</code> والمتصفح يعمل reload كامل.",
      ],
      pitfall: "كل اللي بتمرره كـ props <b>بيتحط في JSON ويظهر للمتصفح</b> (في الـ page source وفي الـ network). لو مررت موديل User كامل هيشوف المستخدم حقول مش المفروض يشوفها (الـ <code>$hidden</code> بتتخفى، لكن أي حاجة تانية لأ). مرّر بس الحقول اللي الصفحة محتاجاها (<code>only()</code> أو API Resource).",
      interview: [
        { q: "إيه هو Inertia.js وإزاي بيشتغل بدون API؟", a: "بروتوكول بيربط Laravel بـ Vue/React. الـ controller بيرجّع <code>Inertia::render('Page', $props)</code>. أول مرة بيجي HTML كامل فيه الـ props في <code>data-page</code>، وبعد كده التنقل بيتم بـ XHR فيه header <code>X-Inertia</code> وLaravel بترد بـ JSON فيه اسم الـ component والـ props فقط، فبيتبدل الـ component من غير reload. لأن الـ props جاية من نفس الـ controller، مفيش حاجة اسمها API منفصلة وصفحاتي بتستخدم الـ auth والـ validation بتاعة Laravel كما هي." },
      ],
    },
    {
      title: "Inertia في Laravel: controller و shared data",
      en: "Inertia controllers and shared props",
      body: "<p>بعد <code>composer require inertiajs/inertia-laravel</code> وعمل <code>php artisan inertia:middleware</code> (بيولّد <code>HandleInertiaRequests</code>؛ لو النسخة ما سجّلتوش لوحدها في <code>bootstrap/app.php</code> ضيفه بإيدك: <code>$middleware-&gt;web(append: [HandleInertiaRequests::class])</code>)، بتبقى جاهز. الـ root template (<code>resources/views/app.blade.php</code>) فيه <code>@inertia</code> و<code>@inertiaHead</code> وسطر <code>@vite</code>.</p>",
      codes: [
        {
          lang: "php",
          title: "app/Http/Controllers/ListingPageController.php",
          src: `<?php

use Inertia\\Inertia;
use Inertia\\Response;

public function index(Request $request): Response
{
    return Inertia::render('Listings/Index', [
        'filters' => $request->only('city'),
        'listings' => Listing::published()
            ->latest()
            ->paginate(12)
            ->withQueryString(),
    ]);
}

public function store(StoreListingRequest $request): RedirectResponse
{
    $listing = Listing::create($request->validated());

    return redirect()->route('listings.index')
        ->with('success', 'Listing created.');
}`,
        },
        {
          lang: "php",
          title: "app/Http/Middleware/HandleInertiaRequests.php",
          src: `<?php

protected $rootView = 'app';

public function version(Request $request): ?string
{
    return parent::version($request);   // hash of the built assets
}

public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => ['user' => $request->user()?->only('id', 'name')],
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
        ],
    ]);
}`,
          note: "الـ <code>share()</code> بتضيف props لكل الصفحات (المستخدم الحالي، رسائل flash). الـ closure بيتنفذ وقت الرد. وأي Validation error بيتحط تلقائي في prop اسمه <code>errors</code>. الكود ده من توثيق Inertia ومن معرفتي بيه، ولم أشغّله لأن Inertia مش منزّلة عندي.",
        },
      ],
      pitfall: "بعد <code>store</code> ارجع <code>redirect()</code> (مش Inertia::render) عشان لو المستخدم عمل refresh ما يعيدش الـ POST. وللـ PUT و PATCH و DELETE، Inertia middleware بيحوّل الـ 302 لـ 303 تلقائي. وحاجة تانية: الداتا في <code>share()</code> بتتبعت في كل ريكويست، فخليها خفيفة.",
    },
    {
      title: "الفورمز والـ validation errors وال partial reloads",
      en: "useForm, errors and partial reloads",
      body: "<p>الـ <code>useForm</code> من <code>@inertiajs/vue3</code> بيدير حالة الفورم: القيم، <code>processing</code>، <code>errors</code>. لما الـ validation في Laravel تفشل، بتعمل redirect back بـ errors (زي أي فورم)، وInertia بتحط الأخطاء في <code>form.errors</code> تلقائي من غير أي كود زيادة.</p>",
      code: {
        lang: "html",
        title: "resources/js/Pages/Listings/Create.vue",
        src: `<script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({ title: '', price: '' })

function submit() {
  form.post('/listings', { onSuccess: () => form.reset() })
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="form.title" />
    <p v-if="form.errors.title">{{ form.errors.title }}</p>

    <input v-model="form.price" type="number" />
    <p v-if="form.errors.price">{{ form.errors.price }}</p>

    <button :disabled="form.processing">Save</button>
  </form>
</template>`,
        note: "لم أشغّل Inertia/Vue هنا. الـ API (<code>useForm</code> و<code>form.post</code> و<code>form.errors</code> و<code>form.processing</code> و<code>form.reset</code>) من توثيق Inertia. الـ validation نفسه هو <code>StoreListingRequest</code> بتاع المستوى 3 بدون تغيير.",
      },
      focus: [{ label: "Partial reloads", text: "<code>router.reload({ only: ['listings'] })</code> بتطلب نفس الصفحة بس بتجيب prop واحد (header <code>X-Inertia-Partial-Data</code>)، والسيرفر ما بيحسبش باقي الـ props لو كانت closures. والـ <b>lazy/optional props</b> بتتحسب بس لما تتطلب بالاسم (الاسم في Inertia v1 <code>Inertia::lazy(fn () =&gt; ...)</code> وفي v2 <code>Inertia::optional(...)</code>، راجع docs نسختك)." }],
      interview: [
        { q: "إزاي بتتعامل مع الـ validation errors في Inertia؟", a: "نفس الـ Form Request اللي في Laravel. لما يفشل، Laravel بتعمل redirect back ومعاه الأخطاء في الـ session، وInertia بتحولهم تلقائيا لـ prop اسمه <code>errors</code> وبيتعرضوا في <code>form.errors.title</code> من <code>useForm</code>. مفيش كود validation في الـ Vue، ومفيش API response بـ 422 لازم أقرأه يدوي." },
      ],
    },
    {
      title: "Vue 3 اللي لازم تعرفه كـ back-end",
      en: "Vue 3 essentials",
      body: "<p>في إنترفيو Laravel مش هتتسأل عن Vue بعمق، بس لازم تقرا component وتفهمه. الـ Vue 3 الحديثة بتستخدم <code>&lt;script setup&gt;</code>: كل اللي بتعرفه فوق بيبقى متاح في الـ template.</p>",
      code: {
        lang: "html",
        title: "ListingCard.vue",
        src: `<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({ listing: Object })       // from parent
const emit = defineEmits(['favorite'])               // to parent

const open = ref(false)                              // primitive state
const form = reactive({ note: '' })                  // object state
const label = computed(() => props.listing.price + ' SAR')

function toggle() {
  open.value = !open.value                           // .value in script
}
</script>

<template>
  <div>
    <h3>{{ listing.title }} - {{ label }}</h3>      <!-- no .value here -->
    <button @click="toggle">Details</button>
    <button @click="emit('favorite', listing.id)">Save</button>
    <textarea v-if="open" v-model="form.note" />
    <span v-for="t in listing.tags" :key="t.id">{{ t.name }}</span>
  </div>
</template>`,
        note: "لم أشغّل Vue هنا. القواعد: <code>ref</code> للقيم البسيطة وبتتقرا بـ <code>.value</code> في السكريبت (مش في الـ template)، <code>reactive</code> للكائنات، <code>computed</code> قيمة محسوبة بتتحدث لوحدها، <code>defineProps</code> بيانات داخلة من الأب، <code>defineEmits</code> أحداث خارجة للأب، <code>v-model</code> ربط ثنائي الاتجاه، <code>v-for</code> مع <code>:key</code> دايما.",
      },
      pitfall: "نسيان <code>.value</code> في السكريبت (<code>open = true</code> بدل <code>open.value = true</code>) هو أشهر خطأ في Vue 3. ومتعدّلش الـ props مباشرة: هي للقراءة فقط، لو الابن عايز يغيّر حاجة يبعت <code>emit</code> والأب يعدل.",
    },
    {
      title: "Vite: بناء الـ assets",
      en: "Vite",
      body: "<p>Vite هو أداة الـ build في مشاريع Laravel الجديدة (بدل Laravel Mix). ليه وضعين: <b>التطوير</b> (<code>npm run dev</code>): سيرفر محلي بيعمل HMR (التعديل يظهر فورا من غير reload)، وبيكتب ملف <code>public/hot</code> يعرّف Laravel إن السيرفر شغال. و<b>الإنتاج</b> (<code>npm run build</code>): بيجمّع ويصغّر الملفات في <code>public/build</code> بأسماء فيها hash (<code>app-3f2a9c.js</code>) ويكتب <code>manifest.json</code> بيربط الاسم الأصلي بالاسم المهشّر.</p>",
      code: {
        lang: "js",
        title: "vite.config.js",
        src: `import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      refresh: true,
    }),
    vue(),
  ],
})

// Blade: @vite(['resources/css/app.css', 'resources/js/app.js'])
// dev  -> tags pointing to the dev server (read from public/hot)
// prod -> tags with hashed file names (read from the manifest)`,
        note: "الـ <code>@vite</code> هي اللي بتقرر: لو <code>public/hot</code> موجود بتطلع روابط السيرفر، ولو لا بتقرا الـ manifest. الاسم المهشّر بيخلي المتصفح يكاشّي الملف للأبد، ولما الكود يتغير الاسم يتغير فيتحمّل الجديد. الـ vite.config.js والـ @vite من معرفتي ومن الـ source، لم أنفذ build لأن Node packages مش منزّلة عندي؛ لكن تأكدت من الـ source إن الـ exception اسمه <code>ViteManifestNotFoundException</code> برسالة «Vite manifest not found at: ...».",
      },
      pitfall: "على السيرفر لو ما عملتش <code>npm run build</code> (أو اتمسح <code>public/build</code>) هتشوف الخطأ «Vite manifest not found». الـ build بيتعمل في الـ CI أو على السيرفر مرة وقت النشر، و<code>public/build</code> مش بيتحط في git. ولو سبت ملف <code>public/hot</code> على السيرفر بالغلط، الصفحة هتحاول تحمّل الـ assets من localhost.",
      interview: [
        { q: "إيه دور Vite في Laravel وإيه الفرق بين <code>npm run dev</code> و <code>npm run build</code>؟", a: "Vite بيجمّع ويحوّل ملفات الـ frontend (JS, CSS, Vue). <code>npm run dev</code> بيشغّل dev server بـ HMR وبيكتب <code>public/hot</code> فتشير <code>@vite</code> للسيرفر ده. <code>npm run build</code> بيطلع ملفات مصغّرة بأسماء فيها hash في <code>public/build</code> مع <code>manifest.json</code>، و<code>@vite</code> بتقراه وبتطلع الأسماء الصح. الـ hash بيخلي الكاش ممتاز (يتحدث لما الملف يتغير)، ولازم أعمل build في الـ deploy." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: قايمة في Blade",
      lang: "blade",
      code: `<x-layout title="Listings">
    <ul>
        @forelse ($listings as $listing)
            <li>
                {{ $loop->iteration }}. {{ $listing->title }}
            </li>
        @empty
            <li>No listings yet.</li>
        @endforelse
    </ul>
</x-layout>`,
    },
    {
      title: "اكتب: controller بـ Inertia::render",
      lang: "php",
      code: `<?php

use Inertia\\Inertia;

public function index(Request $request)
{
    return Inertia::render('Listings/Index', [
        'filters' => $request->only('city'),
        'listings' => Listing::published()->latest()->paginate(12),
    ]);
}`,
    },
    {
      title: "اكتب: فورم بـ useForm",
      lang: "html",
      code: `<script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({ title: '', price: '' })

function submit() {
  form.post('/listings')
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="form.title" />
    <p v-if="form.errors.title">{{ form.errors.title }}</p>
    <button :disabled="form.processing">Save</button>
  </form>
</template>`,
    },
  ],

  tasks: [
    {
      title: "صفحة Blade لقايمة الإعلانات",
      lang: "blade",
      prompt: "<p>اكتب <code>resources/views/listings/index.blade.php</code> بتستخدم component الـ layout <code>&lt;x-layout&gt;</code>. تعرض الإعلانات (<code>$listings</code>) في <code>&lt;ul&gt;</code>: رقم الترتيب والعنوان والسعر (<code>price_label</code>). لو القايمة فاضية تعرض «No listings yet». ولو الإعلان مميز (<code>is_featured</code>) تضيف كلمة <code>Featured</code>. ومعاها فورم بحث صغير بـ GET على <code>/listings</code> فيه حقل <code>city</code> بقيمته القديمة.</p>",
      hints: [
        "<code>@forelse ... @empty ... @endforelse</code> بتحل حالة الفاضي.",
        "<code>{{ $loop-&gt;iteration }}</code> للترتيب، و<code>@if ($listing-&gt;is_featured)</code>.",
        "فورم GET ما بيحتاجش <code>@csrf</code>. القيمة القديمة: <code>{{ request('city') }}</code> أو <code>old()</code>.",
      ],
      solution: `<x-layout title="Listings">
    <form method="GET" action="/listings">
        <input name="city" value="{{ request('city') }}">
        <button>Search</button>
    </form>

    <ul>
        @forelse ($listings as $listing)
            <li>
                {{ $loop->iteration }}. {{ $listing->title }}
                - {{ $listing->price_label }}
                @if ($listing->is_featured)
                    <strong>Featured</strong>
                @endif
            </li>
        @empty
            <li>No listings yet.</li>
        @endforelse
    </ul>
</x-layout>`,
      explain: "كل القيم بتتطبع بـ <code>{{ }}</code> فمعمولها escape. فورم الـ GET مبيحتاجش <code>@csrf</code> لأنه بيقرا بس ومبيغيّرش حاجة. جربت صفحة مشابهة (إعلانين) برندر فعلي وطلعت الصح، بما فيها <code>$loop->first</code> و<code>@csrf</code>.",
    },
    {
      title: "Controller بتاع Inertia: قايمة وإنشاء",
      lang: "php",
      prompt: "<p>اكتب <code>ListingPageController</code> بـ method <code>index</code> بترجّع صفحة <code>Listings/Index</code> بـ prop اسمه <code>listings</code> (المنشورة، الأحدث الأول، 12 في الصفحة وتحافظ على query string) و prop اسمه <code>filters</code>. وmethod <code>store</code> بتستخدم <code>StoreListingRequest</code> وتعمل redirect لـ <code>listings.index</code> ومعاه رسالة flash اسمها <code>success</code>. واشرح في تعليق إزاي الرسالة توصل للـ Vue.</p>",
      hints: [
        "<code>Inertia::render('Listings/Index', [...])</code>.",
        "<code>paginate(12)-&gt;withQueryString()</code>.",
        "الـ flash بيتشاف في <code>HandleInertiaRequests::share</code> كـ prop تاني.",
      ],
      solution: `<?php

namespace App\\Http\\Controllers;

use App\\Http\\Requests\\StoreListingRequest;
use App\\Models\\Listing;
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\Http\\Request;
use Inertia\\Inertia;
use Inertia\\Response;

class ListingPageController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Listings/Index', [
            'filters' => $request->only('city'),
            'listings' => Listing::published()
                ->latest()
                ->paginate(12)
                ->withQueryString(),
        ]);
    }

    public function store(StoreListingRequest $request): RedirectResponse
    {
        Listing::create($request->validated());

        // share() in HandleInertiaRequests exposes it as flash.success
        return redirect()->route('listings.index')
            ->with('success', 'Listing created.');
    }
}`,
      explain: "الـ validation بيحصل في الـ Form Request، ولو فشل بيرجع الأخطاء للصفحة تلقائي. الـ redirect بعد الحفظ (Post/Redirect/Get). الرسالة flash في الـ session، و<code>share()</code> بتقراها وبتبعتها كـ prop لكل صفحة (انظر الشريحة 6). الكود ده لم يتم تشغيله لأن Inertia مش منزّلة.",
    },
    {
      title: "Component بـ props و emit و computed",
      lang: "html",
      prompt: "<p>اكتب component Vue 3 (<code>&lt;script setup&gt;</code>) اسمه <code>PriceFilter</code>: بياخد prop اسمه <code>max</code> (رقم). فيه <code>input type=number</code> مربوط بـ <code>v-model</code> على <code>ref</code> محلي بيبدأ بقيمة الـ prop. فيه <code>computed</code> اسمه <code>label</code> بيرجّع <code>Up to X SAR</code>. وزرار «Apply» يبعت حدث <code>apply</code> للأب مع القيمة الحالية.</p>",
      hints: [
        "<code>defineProps({ max: Number })</code> و<code>defineEmits(['apply'])</code>.",
        "<code>const value = ref(props.max)</code> — وفي الـ script بتقرأ <code>value.value</code>.",
      ],
      solution: `<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ max: Number })
const emit = defineEmits(['apply'])

const value = ref(props.max)
const label = computed(() => 'Up to ' + value.value + ' SAR')
</script>

<template>
  <div>
    <input v-model="value" type="number" />
    <p>{{ label }}</p>
    <button @click="emit('apply', value)">Apply</button>
  </div>
</template>`,
      explain: "الـ <code>ref</code> بيتقرا بـ <code>.value</code> في الـ script وبدونها في الـ template. الـ <code>computed</code> بيتحدث لوحده لما <code>value</code> تتغير. الـ prop للقراءة فقط، فبنسخ قيمته في <code>ref</code> محلي ونرسل التغيير للأب بـ emit. لم يتم تشغيله هنا لأن Vue مش منزّلة.",
    },
  ],

  quiz: [
    {
      q: "الكود ده بيطبع إيه في الصفحة؟ (<code>$bio</code> = <code>&lt;b&gt;hi&lt;/b&gt;</code>)",
      code: { lang: "blade", src: `<p>{{ $bio }}</p>
<p>{!! $bio !!}</p>` },
      options: [
        "الأولى نص <code>&lt;b&gt;hi&lt;/b&gt;</code> ظاهر كما هو، والتانية كلمة hi بخط عريض",
        "الاتنين كلمة hi بخط عريض",
        "الاتنين نص <code>&lt;b&gt;hi&lt;/b&gt;</code> ظاهر كما هو",
        "الأولى hi بخط عريض والتانية نص ظاهر",
      ],
      answer: 0,
      why: "<code>{{ }}</code> بتعمل escape فالمتصفح يعرض الـ tags كنص. <code>{!! !!}</code> بتطبعها خام فالمتصفح ينفذها. جربت نفس الفكرة بـ script tag وكانت النتيجة <code>&amp;lt;script&amp;gt;</code> في الأولى وسكريبت فعلي في التانية.",
    },
    {
      q: "فورم POST في صفحة web رجّعت <b>419 Page Expired</b> عند الإرسال. أرجح سبب؟",
      options: [
        "الـ route مش موجود",
        "ملف الـ view فيه خطأ syntax",
        "الـ validation فشل",
        "نسيت <code>@csrf</code> جوه الفورم",
      ],
      answer: 3,
      why: "الـ 419 معناها فشل التحقق من CSRF token (غايب أو منتهي). الـ route الناقص يدي 404، وفشل الـ validation يدي redirect (أو 422 للـ JSON)، وخطأ الـ syntax يدي 500.",
    },
    {
      q: "إيه اللي بيميز ريكويست Inertia (بعد أول زيارة) عن ريكويست عادي؟",
      answer: ["X-Inertia", "x-inertia", "X-Inertia: true", "X-Inertia header"],
      why: "الـ header <code>X-Inertia: true</code> بيقول للسيرفر يرجّع JSON (component + props) بدل صفحة HTML كاملة.",
    },
    {
      q: "المستخدم فتح صفحة الإنشاء وبعت الفورم وفشل الـ validation. أين تظهر رسالة الخطأ في Inertia + Vue؟",
      options: [
        "لازم تقرأ الـ response بـ 422 بـ try/catch",
        "في <code>form.errors.title</code> تلقائي من <code>useForm</code>، من نفس الـ Form Request",
        "في <code>localStorage</code>",
        "مش بتظهر إلا لو عملت route للأخطاء",
      ],
      answer: 1,
      why: "Laravel بتعمل redirect back ومعاه errors، وInertia بتحولهم لـ prop <code>errors</code> وبتوزعهم على <code>form.errors</code>. مفيش try/catch ولا API منفصلة.",
    },
    {
      q: "عايز تحدّث prop واحد (<code>listings</code>) من غير ما تعيد حساب باقي الـ props ولا تعمل reload كامل. تستخدم إيه؟",
      options: [
        "<code>window.location.reload()</code>",
        "<code>form.reset()</code>",
        "<code>router.reload({ only: ['listings'] })</code> (partial reload)",
        "<code>Inertia::share('listings')</code> في الـ controller",
      ],
      answer: 2,
      why: "الـ partial reload بيطلب نفس الصفحة وبيحدد الـ props المطلوبة بـ <code>only</code>. الـ <code>reload()</code> العادية بتعيد تحميل كل شيء، والـ <code>reset()</code> بتصفّر الفورم.",
    },
    {
      q: "إيه الغلط هنا؟ (Vue 3 جوه <code>&lt;script setup&gt;</code>)",
      code: { lang: "js", src: `const open = ref(false)

function toggle() {
  open = !open
}` },
      options: [
        "لازم <code>reactive</code> بدل <code>ref</code> للـ boolean",
        "الدالة لازم تكون async",
        "<code>open.value = !open.value</code> — الـ ref بيتعدل عن طريق <code>.value</code> في السكريبت",
        "مفيش غلط، الكود سليم",
      ],
      answer: 2,
      why: "الـ <code>ref</code> بيلف القيمة في object، ولازم <code>.value</code> في السكريبت (في الـ template Vue بتفكها لوحدها). الإسناد المباشر بيكسر الربط (أو يرمي خطأ لأنه const).",
    },
    {
      q: "على سيرفر production ظهر خطأ «Vite manifest not found at: .../public/build/manifest.json». الحل؟",
      options: [
        "<code>php artisan config:clear</code>",
        "تشغيل <code>npm run build</code> وقت النشر (وعدم الاعتماد على git للـ public/build)",
        "تشغيل <code>npm run dev</code> على السيرفر وتركه شغال",
        "تعديل <code>.env</code> لـ APP_DEBUG=true",
      ],
      answer: 1,
      why: "الـ manifest بيتولّد من <code>npm run build</code>. من غيره <code>@vite</code> مش لاقية الأسماء المهشّرة. <code>npm run dev</code> للتطوير فقط وبيكتب <code>public/hot</code>. وتغيير config مالوش علاقة.",
    },
    {
      q: "في Inertia، ليه ممنوع تمرر موديل User كامل كـ prop بدون تصفية؟",
      options: [
        "لأن Vue مبتقبلش objects",
        "لأن الـ props كلها بتتحول JSON وتظهر للمتصفح (في page source)، فأي حقل بتمرره المستخدم يقدر يشوفه",
        "لأن Inertia بتبطّئ لو الموديل كبير",
        "لأن الـ User محمي بـ policy تلقائي",
      ],
      answer: 1,
      why: "الـ props ليست بيانات سيرفر داخلية، دي JSON بتتبعت للمتصفح. فاختر الحقول بـ <code>only()</code> أو API Resource. الـ <code>$hidden</code> بتخبي بس اللي معرّفه فيها.",
    },
    {
      q: "مشروعك فيه تطبيق Flutter و لوحة ويب للمكاتب، وفريقك صغير. أنسب تقسيم؟",
      options: [
        "كل حاجة Blade، ويتجاهل Flutter",
        "API منفصلة للويب وAPI تانية لـ Flutter",
        "الـ API (Sanctum) لـ Flutter، ولوحة الويب بـ Inertia أو Blade على نفس الـ models والـ policies",
        "Flutter يقرا HTML من Blade",
      ],
      answer: 2,
      why: "الـ API بتخدم الموبايل، واللوحة الداخلية بتستفيد من routes وauth وvalidation بتاعة Laravel مباشرة بـ Inertia (أو Blade)، فمتبنيش API تانية لنفس الصفحات. الـ policies والـ models بتتشارك بين الاتنين.",
    },
  ],
};
