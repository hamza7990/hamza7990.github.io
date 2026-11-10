window.LEVELS = window.LEVELS || {};
window.LEVELS["ai/m12"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "RAG: الموديل يجاوب وهو فاتح الكتاب، مش من الذاكرة",
      en: "Why retrieval-augmented generation",
      body: "<p>الموديل مبيعرفش مستندات شركتك، ولا اللي حصل بعد الـ cutoff بتاعه، ولو مش عارف ممكن يألف (m10). والـ fine-tuning مش وسيلة موثوقة لحقن معلومات متغيرة. الحل الأشهر: <b>RAG</b> (Retrieval-Augmented Generation). زي امتحان open-book: بدل ما تسأل الموديل من ذاكرته، بتدوّر الأول على الفقرات المناسبة من مستنداتك، وبتحطها في الـ prompt، وبتقوله «جاوب من الفقرات دي بس».</p>",
      points: [
        "<b>معرفة حديثة وخاصة</b>: تحدّث المستندات من غير ما تدرّب حاجة. الموظف الجديد، السياسة المعدّلة، منتج اتضاف النهارده.",
        "<b>Citations</b>: تقدر تقول للمستخدم الإجابة جاية من أنهي مستند وأنهي فقرة، فيراجعها.",
        "<b>hallucination أقل</b> (مش صفر): لأن الإجابة مبنية على نص قدامه، ولأنك تقدر تطلب منه «لو مش موجود قول مش عارف».",
        "<b>تحكم في الصلاحيات</b>: تقدر تفلتر المستندات حسب اللي المستخدم مسموح له يشوفه قبل ما تدخل الـ prompt.",
        "<b>التمن</b>: الإجابة بقت بتعتمد على جودة البحث. لو البحث جاب فقرة غلط، الموديل هيجاوب غلط بثقة. معظم شغل RAG هو تحسين الـ retrieval مش الموديل.",
      ],
      code: {
        lang: "text",
        title: "الـ pipeline في سطور",
        src: `OFFLINE (once, and again when documents change)
  load documents -> split into chunks -> embed each chunk -> store in an index

ONLINE (every question)
  embed the question -> retrieve top-k chunks -> (rerank) -> build prompt
  with the chunks + "answer only from these, cite them" -> LLM -> answer + citations`,
        note: "الشريحتين الجايين بيشرحوا كل خطوة، وبعدين هنبني النسخة الكاملة الصغيرة بالكود.",
      },
      interview: [
        { q: "إيه هو RAG وليه نستخدمه بدل ما نسأل الموديل مباشرة؟", a: "هو إني بدور الأول في مستنداتي على الفقرات المناسبة للسؤال (retrieval)، وبحطها في الـ prompt وبطلب من الموديل يجاوب منها بس ويذكر المصدر. بيحل مشكلة المعرفة الخاصة والمتغيرة وما بعد الـ cutoff، وبيدّي citations، وبيقلل الـ hallucination. تمنه إن الجودة بقت بتعتمد على جودة الـ retrieval." },
      ],
    },
    {
      kicker: "الخطوة الأولى",
      title: "Chunking: تقطيع المستندات هو أكتر قرار بيأثر في الجودة",
      en: "Chunking strategies and trade-offs",
      body: "<p>مينفعش تدخل كتاب كامل في الـ embedding ولا في الـ prompt. بنقطّعه لـ <b>chunks</b> ونبحث فيها. القرار هنا بيعمل trade-off مباشر:</p>",
      points: [
        "<b>chunk صغير</b> (جملتين مثلا): البحث دقيق ورخيص في الـ prompt، لكن الفقرة ممكن تفقد سياقها («ده» بتشاور على إيه؟) والإجابة تتوزع على كذا chunk.",
        "<b>chunk كبير</b> (صفحة): السياق كامل، لكن المتجه بيبقى «خليط» من مواضيع فالبحث أقل دقة، وبتملى الـ context بكلام مش مهم.",
        "<b>Overlap</b>: تكرار جزء من نهاية chunk في بداية اللي بعده، علشان جملة ما تتقطعش من نصها وتضيع. تمنه: تكرار وحجم index أكبر.",
        "<b>Structure-aware</b>: قطّع على حدود طبيعية: عناوين، فقرات، بنود، أسئلة وأجوبة، صفوف جدول، دوال في كود. بيحافظ على المعنى أحسن من القص بعدد كلمات ثابت، وساعات بتحط عنوان القسم مع كل chunk.",
        "مفيش حجم سحري. الحجم بيتحدد بنوع المستند والأسئلة والموديل، وبتجرب وتقيس (retrieval hit rate، آخر شرايح المستوى).",
      ],
      codes: [
        {
          lang: "python",
          title: "حجم ثابت مع overlap",
          src: `def chunk_fixed(text, size, overlap):
    words = text.split()
    step = size - overlap
    return [" ".join(words[i:i + size]) for i in range(0, max(len(words) - overlap, 1), step)]

text = ("Refunds. Customers can request a refund within 14 days of purchase. "
        "Refunds go back to the original payment method. "
        "Shipping. Orders ship within 2 business days. Express shipping costs extra.")
for c in chunk_fixed(text, 12, 4):
    print(repr(c))
print(len(chunk_fixed(text, 12, 4)), len(chunk_fixed(text, 12, 0)))
# 'Refunds. Customers can request a refund within 14 days of purchase. Refunds'
# 'days of purchase. Refunds go back to the original payment method. Shipping.'
# 'original payment method. Shipping. Orders ship within 2 business days. Express shipping'
# 'business days. Express shipping costs extra.'
# 4 3`,
          note: "بالـ overlap = 4 اتعملوا 4 chunks بدل 3. لاحظ إن الـ chunk التاني بيبدأ بـ «days of purchase» (كلمات من آخر اللي قبله)، لكن القص بعدد كلمات ثابت فصل العنوان «Shipping» عن محتواه: العنوان وقع في آخر chunk 2 ومحتواه بدأ في chunk 3. ده عيب القص الأعمى.",
        },
        {
          lang: "python",
          title: "على حدود العناوين (structure-aware)",
          src: `def chunk_by_heading(text):
    chunks, current = [], []
    for line in text.splitlines():
        if line.startswith("# ") and current:
            chunks.append("\\n".join(current).strip())
            current = []
        current.append(line)
    if current:
        chunks.append("\\n".join(current).strip())
    return chunks

doc = "# Refunds\\nWithin 14 days.\\nOriginal payment method.\\n# Shipping\\nWithin 2 days."
for c in chunk_by_heading(doc):
    print(repr(c))
# '# Refunds\\nWithin 14 days.\\nOriginal payment method.'
# '# Shipping\\nWithin 2 days.'`,
          note: "كل chunk قسم كامل ومعاه عنوانه، فمعناه سليم. لو القسم نفسه طويل جدا بنقسمه تاني (بالفقرات أو بحجم ثابت) وبنكرر العنوان في كل جزء.",
        },
      ],
      interview: [
        { q: "إزاي تختار حجم الـ chunk؟ وإيه فايدة الـ overlap؟", a: "فيه trade-off: الصغير بيدّي بحث دقيق لكن بيفقد السياق، والكبير بيحافظ على السياق لكن بيخلّط المواضيع ويملا الـ prompt. باختار حسب نوع المستند والأسئلة، وبفضّل التقطيع على حدود طبيعية (عناوين وفقرات). الـ overlap بيمنع إن معلومة تتقسم بين chunkين وتضيع، بتمن تكرار وindex أكبر. وبقرر بالقياس على golden set مش بالتخمين." },
      ],
    },
    {
      kicker: "التمثيل والتشابه",
      title: "Embeddings و cosine: نص ← متجه، والأقرب معنى هو الأقرب زاوية",
      en: "Embeddings and cosine similarity for retrieval",
      body: "<p>من m9 وm10: موديل الـ embeddings بيحول كل chunk لمتجه، وبيحول السؤال لمتجه بنفس الموديل، والـ chunks الأقرب (بـ cosine) للسؤال هي المرشحة. لو كل المتجهات اتعملها <b>normalise</b> (طولها 1) فـ cosine بيبقى ضرب نقطي عادي، وده اللي بيخلي البحث سريع: ضرب مصفوفة × متجه.</p>",
      points: [
        "<b>نفس الموديل</b> للمستندات والأسئلة. لو غيرته لازم تعيد حساب كل المتجهات.",
        "الـ embeddings الحقيقية (من موديل) بتقدر تربط معاني مختلفة اللفظ («laptop» و«computer»)، وهي نقطة قوتها على البحث بالكلمات.",
        "في الكود الجاي هنستخدم <b>TF-IDF</b> بدل موديل embeddings علشان يشتغل أوفلاين ومن غير تحميل أي حاجة. هو متجه برضه (بعد = كلمة، قيمته بتعبر عن أهمية الكلمة في الـ chunk مقارنة ببقية المستندات)، لكنه <b>لفظي</b>: بيطابق كلمات مش معاني. فهنشوف حدوده بنفسنا.",
        "للعربي: التطابق اللفظي حساس للتصريفات والهمزات والتشكيل («المكتب» و«مكتب» و«مكاتب»). موديلات embeddings متعددة اللغات بتتعامل أحسن، ولو هتستخدم بحث لفظي لازم تعمل normalisation للنص (إزالة التشكيل، توحيد الألف والياء والتاء المربوطة).",
      ],
      terms: [
        ["embedding", "متجه المعنى", "متجه أرقام ثابت الطول بيمثل نص، والنصوص المتقاربة المعنى متجهاتها قريبة"],
        ["TF-IDF", "تكرار الكلمة × ندرتها", "وزن بيرفع الكلمات المميزة للـ chunk ويقلل الكلمات الشائعة في كل المستندات"],
        ["normalise", "توحيد الطول", "قسمة المتجه على طوله علشان يبقى طوله 1 فيبقى cosine = ضرب نقطي"],
      ],
    },
    {
      kicker: "البحث السريع",
      title: "Vector search: exact مقابل approximate، وإيه اللي بتضيفه vector database",
      en: "Exact vs approximate search, and what a vector database adds",
      body: "<p><b>Exact (brute force)</b>: قارن السؤال بكل المتجهات. بسيط ودقيق 100%، وسريع جدا لحد عشرات أو مئات الآلاف من المتجهات (ضرب مصفوفة)، لكنه بيبطأ مع ملايين. <b>Approximate nearest neighbours (ANN)</b>: بنبني هيكل يخلينا نبص على جزء صغير بس من المتجهات، ونقبل إننا ممكن نفوّت أحيانا الجار الأقرب فعلا. مفيش اسم منتج لازم تحفظه: المبدأ واحد. الأمثلة الشائعة للهياكل: تقسيم لمجموعات (clusters) وبحث في الأقرب منها، أو رسم بياني بنمشي فيه من جار لجار. دي نسخة مبسطة بالنوع الأول، على 2000 متجه (الأرقام مقاسة فعلا):</p>",
      code: {
        lang: "python",
        title: "IVF مبسط: نبحث في cluster أو اتنين بس",
        src: `import numpy as np
from sklearn.cluster import KMeans

rng = np.random.default_rng(0)
centers = rng.normal(size=(20, 16)) * 1.0
X = np.vstack([c + rng.normal(size=(100, 16)) for c in centers])     # 2000 vectors
X /= np.linalg.norm(X, axis=1, keepdims=True)
queries = X[rng.choice(len(X), 50, replace=False)] + rng.normal(scale=0.05, size=(50, 16))
queries /= np.linalg.norm(queries, axis=1, keepdims=True)

def exact_top(q, k):
    return np.argsort(-(X @ q))[:k]

km = KMeans(n_clusters=20, n_init=1, random_state=0).fit(X)
members = {c: np.where(km.labels_ == c)[0] for c in range(20)}
C = km.cluster_centers_ / np.linalg.norm(km.cluster_centers_, axis=1, keepdims=True)

def approx_top(q, k, n_probe):
    near = np.argsort(-(C @ q))[:n_probe]               # only look inside these clusters
    cand = np.concatenate([members[c] for c in near])
    return cand[np.argsort(-(X[cand] @ q))[:k]], len(cand)

for n_probe in (1, 2, 4):
    rec, scanned = 0.0, 0
    for q in queries:
        truth = set(exact_top(q, 5))
        got, n = approx_top(q, 5, n_probe)
        rec += len(truth & set(got)) / 5
        scanned += n
    print(n_probe, round(rec / len(queries), 3), scanned // len(queries), "of", len(X))
# 1 0.876 102 of 2000
# 2 0.976 197 of 2000
# 4 0.992 396 of 2000`,
        note: "لو بصينا في cluster واحد بس (حوالي 5% من البيانات) لقينا 87.6% من الجيران الحقيقيين، وبـ 4 clusters (حوالي 20%) وصلنا 99.2%. ده الـ trade-off: <b>recall مقابل سرعة</b>. الـ ANN الحقيقي بيتحكم فيه بإعدادات (عدد المجموعات اللي بنبحث فيها وغيرها) وبتضبطها بالقياس. الأرقام بتتغير حسب البيانات (بياناتنا مصطنعة ومجمّعة بشكل ممتاز).",
      },
      points: [
        "<b>الـ vector database</b> بتضيف حوالين البحث: تخزين دائم، فهارس ANN جاهزة، <b>فلترة بالـ metadata</b> (القسم، التاريخ، صلاحيات المستخدم)، تحديث وحذف مستندات، توسع وأداء وتوفر. لو بياناتك صغيرة، ملف NumPy أو إضافة vectors لقاعدة بياناتك الحالية ممكن يكفي. اختار حسب الحجم ومتطلبات التشغيل، مش حسب الموضة.",
        "الـ exact هو <b>baseline</b> الصح: قارن بيه الـ ANN علشان تعرف قد إيه بتخسر recall.",
      ],
      interview: [
        { q: "الفرق بين exact و approximate vector search؟ وإيه اللي بتضيفه vector database؟", a: "الـ exact بيقارن السؤال بكل المتجهات: دقيق وبسيط وسريع لحد حجم معين. الـ approximate بيبني هيكل (clusters أو graph) يخلي البحث يبص على جزء صغير بس، فأسرع بكتير على ملايين المتجهات بس ممكن يفوّت جار أقرب، فبقيس الـ recall مقابل الـ exact. الـ vector database بتضيف التخزين الدائم والـ indexing والفلترة بالـ metadata والتحديثات والتوسع، وده مفيد لما تكبر أو محتاج صلاحيات وفلاتر." },
      ],
    },
    {
      kicker: "بحث أحسن",
      title: "Lexical (BM25) و hybrid و reranking",
      en: "Lexical search, hybrid search and reranking",
      body: "<p>البحث بالـ embeddings بيمسك المعنى لكن ممكن يفوّت <b>كلمات محددة</b>: أسماء منتجات، أكواد أخطاء، أرقام فواتير، مصطلحات نادرة. البحث <b>اللفظي</b> (lexical) بيتفوق فيها. أشهر خوارزمية اسمها <b>BM25</b>: بتدّي الـ chunk درجة أعلى لما الكلمات النادرة (IDF) من السؤال تظهر فيه كتير، مع تخفيف تأثير التكرار الزايد (k1) ومراعاة طول الـ chunk (b). <b>Hybrid</b> يعني تجمع الاتنين: شغّل الطريقتين وادمج الترتيبين، وأشهر دمج بسيط اسمه <b>Reciprocal Rank Fusion</b> (RRF): كل عنصر ياخد <code>1/(k + rank)</code> من كل قائمة ويتجمعوا.</p>",
      code: {
        lang: "python",
        title: "BM25 من الصفر + RRF",
        src: `import math
from collections import Counter

chunks = [
    "Employees get 21 days of annual leave per year.",
    "Remote work is allowed up to 3 days per week.",
    "Passwords must be changed every 90 days.",
    "Report a lost laptop to the security team within 24 hours.",
    "Customer tickets are answered within 4 working hours.",
]
tok = lambda s: [w.strip(".,?").lower() for w in s.split()]
docs = [tok(c) for c in chunks]
N = len(docs)
avgdl = sum(len(d) for d in docs) / N
df = Counter(w for d in docs for w in set(d))

def bm25(query, k1=1.5, b=0.75):
    scores = []
    for d in docs:
        tf = Counter(d)
        s = 0.0
        for w in tok(query):
            if w not in tf:
                continue
            idf = math.log(1 + (N - df[w] + 0.5) / (df[w] + 0.5))
            s += idf * tf[w] * (k1 + 1) / (tf[w] + k1 * (1 - b + b * len(d) / avgdl))
        scores.append(s)
    return scores

sc = bm25("lost laptop hours")
print([round(s, 2) for s in sc])
print(chunks[max(range(N), key=lambda i: sc[i])])
# [0.0, 0.0, 0.0, 3.32, 0.92]
# Report a lost laptop to the security team within 24 hours.

def rrf(rankings, k=60):
    """Reciprocal rank fusion of several ranked lists of ids."""
    fused = Counter()
    for r in rankings:
        for pos, item in enumerate(r, start=1):
            fused[item] += 1 / (k + pos)
    return [i for i, _ in fused.most_common()]

lexical = ["c3", "c1", "c7"]
dense = ["c1", "c5", "c3"]
print(rrf([lexical, dense]))
# ['c1', 'c3', 'c5', 'c7']`,
        note: "الـ chunk اللي فيه «lost» و«laptop» خد 3.32 لأن الكلمتين نادرتين، و«hours» ظهرت في chunk تاني (0.92). في الـ RRF: <code>c1</code> جاء تاني في الأولى وأول في الثانية، فطلع الأول، وهو أنسب من <code>c3</code> اللي أول في واحدة وتالت في التانية. المهم إن الـ RRF بيعتمد على الترتيب مش على الدرجات (اللي مقاييسها مختلفة بين الطريقتين).",
      },
      points: [
        "<b>Reranking</b>: مرحلة تانية. الأول بنجيب مرشحين كتير (مثلا 20 لـ 50) بطريقة سريعة، وبعدين موديل أبطأ وأدق (cross-encoder بيقرا السؤال والـ chunk مع بعض، أو LLM) بيعيد ترتيبهم وناخد أحسن 3 لـ 5. الأدق مكلف فمينفعش تطبقه على كل الـ index، لكن على قايمة صغيرة ممكن.",
        "<b>Query rewriting</b> مفيد: إعادة صياغة سؤال المستخدم أو توسيعه («كمبيوتر» ← «لابتوب») قبل البحث.",
        "ابدأ بسيط: embeddings (أو BM25) + قياس. زوّد hybrid أو reranking لما القياس يثبت إن فيه فرق، مش لأنها اتقالت في مقال.",
      ],
      interview: [
        { q: "ليه تستخدم hybrid search؟ وإيه هو الـ reranking؟", a: "البحث بالـ embeddings بيمسك المعنى لكن ممكن يفوّت كلمات نادرة محددة (أكواد، أسماء)، والبحث اللفظي BM25 بيمسكها لكن بيفوّت المرادفات. الـ hybrid بيجمعهم، غالبا بدمج الترتيبين بـ RRF. الـ reranking مرحلة تانية بتاخد المرشحين وبتعيد ترتيبهم بموديل أدق وأبطأ بيقرا السؤال والـ chunk مع بعض، وناخد أحسن عدد صغير للـ prompt." },
      ],
    },
    {
      kicker: "الجزء اللي الموديل بيشوفه",
      title: "بناء الـ prompt: السياق + «جاوب منه بس» + citations",
      en: "Assembling the prompt with retrieved context",
      body: "<p>الـ chunks اللي رجعت بتتحط في الـ prompt مع تعليمات واضحة. اللي بيفرق جودة الإجابة هنا:</p>",
      points: [
        "<b>رقّم كل chunk</b> وحط مصدره، وقول للموديل يذكر الرقم بين أقواس [1] جنب كل معلومة. ده بيدّيك citations تقدر تتحقق منها بكود.",
        "<b>«جاوب من السياق بس. لو الإجابة مش موجودة قول مش عارف.»</b>: أهم سطر. من غيره الموديل بيكمّل من ذاكرته.",
        "<b>افصل السياق عن التعليمات</b> بعلامات، وفكّر في prompt injection: المستندات المسترجعة ممكن تحتوي نصوص خبيثة (m11).",
        "<b>رتّب</b> الأهم في أول أو آخر السياق لو بتحط كتير، لأن الموديلات ساعات بتفوّت اللي في النص الوسط.",
        "<b>ماتملاش الـ context</b>: chunk زيادة غير ذي صلة بيشتت الموديل ويزود التكلفة. ابعت العدد اللي القياس بيقول إنه كفاية.",
        "<b>حل التعارض</b>: لو chunkين بيقولوا حاجتين مختلفتين، حط تاريخ أو إصدار المستند معاهم وقول للموديل يختار الأحدث أو ينبّه المستخدم.",
      ],
      interview: [
        { q: "إزاي تصمم prompt الـ RAG علشان تقلل الـ hallucination؟", a: "بحط الـ chunks مرقمة ومعاها مصدرها في الـ prompt، وبطلب «جاوب من السياق ده فقط، ولو مش موجود قول مش عارف، واذكر رقم المصدر [n]». بفصل السياق بعلامات، وبحد عدد الـ chunks، وبحط التواريخ لو فيه تعارض. وبعدين بتحقق بكود إن الاستشهادات موجودة فعلا، وبأقيس faithfulness على golden set." },
      ],
    },
    {
      kicker: "كله مع بعض",
      title: "RAG صغير كامل أوفلاين، ونقيس الـ retrieval",
      en: "A complete tiny RAG: chunk, embed, retrieve, prompt, evaluate",
      body: "<p>6 مستندات قصيرة لسياسات شركة، TF-IDF من scikit-learn بدل موديل embeddings، وخطوة التوليد <b>stub</b> مكتوب عليها بوضوح (هنا يتحط استدعاء موديل حقيقي في تطبيقك). في الآخر golden set من 8 أسئلة، كل واحد معاه المستند اللي فيه الإجابة، ونحسب الـ recall@k:</p>",
      code: {
        lang: "python",
        title: "tiny_rag.py",
        src: `import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

DOCS = {
    "leave": "Employees get 21 days of annual leave per year. Unused leave carries over up to 5 days. Leave requests need manager approval.",
    "remote": "Remote work is allowed up to 3 days per week. Remote days must be agreed with the team lead in advance.",
    "expenses": "Travel expenses are refunded within 30 days after the receipts are submitted. Meals are capped at 40 per day.",
    "security": "Passwords must be changed every 90 days. Report a lost laptop to the security team within 24 hours.",
    "onboarding": "New hires receive a laptop on the first day. The IT team creates the email account before the start date.",
    "support": "Customer tickets are answered within 4 working hours. Urgent tickets are escalated to the on-call engineer.",
}

# 1) chunk: one sentence per chunk (docs are tiny)
chunks, meta = [], []
for doc_id, text in DOCS.items():
    for s in text.split(". "):
        s = s.strip().rstrip(".")
        if s:
            chunks.append(s + ".")
            meta.append(doc_id)
print(len(chunks), "chunks")                       # 13 chunks

# 2) embed (TF-IDF here; a real system would use an embedding model)
vec = TfidfVectorizer(stop_words="english")
M = vec.fit_transform(chunks).toarray()            # rows are L2-normalised

# 3) retrieve: cosine = dot product of normalised vectors
def retrieve(question, k=3):
    q = vec.transform([question]).toarray()[0]
    scores = M @ q
    top = np.argsort(-scores)[:k]
    return [(meta[i], chunks[i], round(float(scores[i]), 3)) for i in top]

# 4) assemble the prompt
def build_prompt(question, hits):
    ctx = "\\n".join(f"[{i + 1}] ({d}) {t}" for i, (d, t, _) in enumerate(hits))
    return ("Answer using ONLY the context below. If the answer is not there, "
            "say you don't know. Cite sources like [1].\\n\\n"
            f"Context:\\n{ctx}\\n\\nQuestion: {question}\\nAnswer:")

# 5) generate: STUB, a real LLM call would go here
def generate(prompt):
    return "(stub) the model would answer here, citing [1]"

q = "How many days of annual leave do I get?"
hits = retrieve(q)
print(hits[0])
print(build_prompt(q, hits))
print(generate(build_prompt(q, hits)))

# 6) evaluate retrieval with a golden set: question -> doc that holds the answer
GOLDEN = [
    ("How many days of annual leave do I get?", "leave"),
    ("How often must passwords be changed?", "security"),
    ("When are travel expenses refunded?", "expenses"),
    ("How many remote days per week?", "remote"),
    ("What happens with a lost laptop?", "security"),
    ("How many vacation days do I have?", "leave"),
    ("Can I work from home?", "remote"),
    ("Who do I tell if my computer is stolen?", "security"),
]
def recall_at_k(k):
    hit = 0
    for question, doc in GOLDEN:
        docs = [d for d, _, _ in retrieve(question, k)]
        hit += doc in docs
    return round(hit / len(GOLDEN), 2)
print({k: recall_at_k(k) for k in (1, 3, 5)})
for question, doc in GOLDEN:
    got = [d for d, _, _ in retrieve(question, 1)]
    if doc not in got:
        print("MISS:", question, "->", got)
# ('leave', 'Employees get 21 days of annual leave per year.', 0.624)
# {1: 0.88, 3: 0.88, 5: 0.88}
# MISS: Who do I tell if my computer is stolen? -> ['leave']`,
        note: "الـ retrieval لقى 7 من 8 حتى بـ k=1، والسؤال الوحيد اللي فشل «computer is stolen» رغم إن المستند بيقول «lost laptop»: مفيش ولا كلمة مشتركة غير كلمات شائعة، فالبحث اللفظي مش هيربط «computer» بـ «laptop». والـ recall ثابت 0.88 مهما زوّدنا k (حتى 5)، لأن المشكلة إن الـ chunk الصح مش بيطلع في الترتيب أصلا. <b>ده بالظبط الفرق بين TF-IDF وموديل embeddings حقيقي</b>، وبيوضح ليه بنقيس على golden set بدل ما نثق في حاسة.",
      },
      pitfall: "قياس الـ retrieval على أسئلة أنت كتبتها وإنت شايف المستند (نفس الكلمات). هتطلع النتيجة 100% وتضللك. اجمع أسئلة حقيقية من المستخدمين بصياغتهم، فيها مرادفات وأخطاء.",
      interview: [
        { q: "إزاي تقيس إن الـ retrieval في RAG شغال؟ وإيه هو recall@k؟", a: "بعمل golden set: أسئلة حقيقية مع الـ chunk أو المستند اللي فيه الإجابة. recall@k (أو hit rate@k) هو نسبة الأسئلة اللي الـ chunk الصح ظهر في أول k نتيجة. لو منخفض فالمشكلة في الـ chunking أو الـ embeddings أو البحث، وتحسين الـ prompt مش هيفيد. وبعدها بأقيس الإجابة نفسها: هل مبنية فعلا على السياق (faithfulness) وهل بتجاوب السؤال." },
      ],
    },
    {
      kicker: "لما RAG يغلط",
      title: "Failure modes: الـ chunk الغلط، الناقص، القديم، والزحمة",
      en: "RAG failure modes and evaluating the answer",
      body: "<p>لما إجابة RAG غلط، شخّص <b>أنهي مرحلة</b> فشلت قبل ما تلمس الـ prompt:</p>",
      points: [
        "<b>جاب chunk غلط</b> (wrong chunk): الكلمات متشابهة والمعنى مختلف. العلاج: hybrid، reranking، chunking أحسن، فلتر metadata.",
        "<b>الـ chunk الصح مش موجود في النتايج</b> (missing chunk): زي مثالنا computer/laptop. أو المعلومة اتقطعت بين chunkين. العلاج: embeddings أحسن، overlap، query rewriting، k أكبر مع reranking.",
        "<b>الـ index قديم</b> (stale): المستند اتعدّل والمتجهات لسه القديمة. العلاج: pipeline تحديث (إعادة تضمين المتغير بس)، وتاريخ لكل chunk، وحذف النسخ القديمة.",
        "<b>Context stuffing</b>: حطيت 30 chunk «احتياطي». الموديل اتشتت أو أخد معلومة من chunk مش ذي صلة، والتكلفة زادت. العلاج: عدد أقل بعد reranking.",
        "<b>الموديل تجاهل السياق</b> أو أضاف من عنده. العلاج: تعليمات أوضح، فحص الاستشهادات، قياس faithfulness.",
        "<b>السؤال محتاج أكتر من chunk</b> (مقارنة، تجميع أرقام): الـ top-k البسيط مش كفاية، وممكن تحتاج أدوات أو خطوات متعددة (m13).",
      ],
      code: {
        lang: "python",
        title: "فحص آلي بسيط للاستشهادات",
        src: `import re

def check_citations(answer, n_sources):
    problems = []
    for sent in re.split(r"(?<=[.!?])\\s+", answer.strip()):
        cites = [int(c) for c in re.findall(r"\\[(\\d+)\\]", sent)]
        if not cites:
            problems.append("no citation: " + sent)
        elif any(c < 1 or c > n_sources for c in cites):
            problems.append("bad citation: " + sent)
    return problems

print(check_citations("You get 21 days [1]. Carry-over is 5 days [2].", 3))
print(check_citations("You get 21 days [1]. Bonus is paid in May. Remote is 3 days [7].", 3))
# []
# ['no citation: Bonus is paid in May.', 'bad citation: Remote is 3 days [7].']`,
        note: "الفحص ده بيمسك جمل من غير مصدر واستشهادات لمصدر مش موجود. مش بيثبت إن الجملة مدعومة فعلا بالنص (ده أصعب: بيحتاج مقارنة المعنى، وساعات LLM-as-judge أو مراجعة بشرية، m13)، لكنه فحص رخيص بيشتغل على كل رد.",
      },
      focus: [{ label: "قياس RAG على مستويين", text: "<b>Retrieval</b>: هل الـ chunk الصح طلع؟ (recall@k، hit rate). <b>Generation</b>: هل الإجابة مبنية على السياق (faithfulness) وبتجاوب السؤال (relevance) وبتقول «مش عارف» لما مفيش إجابة؟ افصل المستويين علشان تعرف تصلّح الصح." }],
      interview: [
        { q: "RAG بيطلّع إجابات غلط. إزاي تشخّص؟", a: "بفصل المراحل. أبص على الـ chunks اللي رجعت للسؤال ده: لو الصح مش فيها فالمشكلة في الـ retrieval (chunking، embeddings، البحث، k) أو إن المستند مش في الـ index أو قديم. لو الصح فيها والإجابة غلط فالمشكلة في الـ prompt أو الموديل أو في زحمة السياق. وبقيس retrieval وgeneration كل واحد لوحده على golden set، وبسجل الأسئلة الفاشلة وأضيفها للـ golden set." },
        { q: "إمتى تستخدم RAG وإمتى fine-tuning؟", a: "RAG للمعرفة الخاصة أو المتغيرة أو اللي محتاجة citations وصلاحيات، لأنك بتحدّث المستندات من غير تدريب. الـ fine-tuning لتغيير الأسلوب أو الصيغة أو لمهمة ضيقة متكررة. والاتنين ممكن يشتغلوا مع بعض. ببدأ غالبا بـ prompting ثم RAG، وأضيف fine-tuning لما القياس يبين إن فيه فجوة سلوك مش فجوة معلومات." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: cosine similarity",
      lang: "python",
      code: `import numpy as np

def cosine(a, b):
    a = np.asarray(a, dtype=float)
    b = np.asarray(b, dtype=float)
    return float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b)))

print(round(cosine([1, 2], [2, 4]), 3))
print(round(cosine([1, 0], [0, 1]), 3))`,
      note: "الناتج: <code>1.0</code> ثم <code>0.0</code>. نفس الاتجاه بيدّي 1 مهما اختلف الطول، والمتعامدين 0.",
    },
    {
      title: "اكتب: بناء prompt بسياق مرقم",
      lang: "python",
      code: `def make_prompt(question, chunks):
    lines = []
    for i, c in enumerate(chunks, start=1):
        lines.append(f"[{i}] {c}")
    ctx = "\\n".join(lines)
    return (
        "Answer only from the context. Cite like [1].\\n"
        f"Context:\\n{ctx}\\n"
        f"Question: {question}"
    )

print(make_prompt("Why?", ["One.", "Two."]))`,
      note: "الناتج 5 سطور: التعليمة، <code>Context:</code>، <code>[1] One.</code>، <code>[2] Two.</code>، ثم <code>Question: Why?</code>.",
    },
    {
      title: "اكتب: chunking بـ overlap",
      lang: "python",
      code: `def chunk_words(text, size, overlap):
    if overlap >= size:
        raise ValueError("overlap must be smaller than size")
    words = text.split()
    step = size - overlap
    chunks = []
    for start in range(0, len(words), step):
        chunks.append(" ".join(words[start:start + size]))
        if start + size >= len(words):
            break
    return chunks

print(chunk_words("a b c d e f g", 3, 1))`,
      note: "الناتج: <code>['a b c', 'c d e', 'e f g']</code>. الـ <code>break</code> بيمنع chunk أخير مكرر بالكامل.",
    },
  ],

  tasks: [
    {
      title: "chunk_words مع overlap",
      lang: "python",
      prompt: "<p>اكتب <code>chunk_words(text, size, overlap)</code> بترجع قائمة chunks، كل واحد <code>size</code> كلمة، والتالي بيبدأ بعد <code>size - overlap</code> كلمة من بداية اللي قبله (يعني بيتكرر <code>overlap</code> كلمة). آخر chunk ممكن يكون أقصر. اقف أول ما chunk يوصل لآخر كلمة (من غير chunk أخير مكرر بالكامل). لو <code>overlap &gt;= size</code> ارمي <code>ValueError</code>. نص فاضي يرجّع قائمة فاضية.</p>",
      examples: [
        { in: "chunk_words('a b c d e f g', 3, 1)", out: "['a b c', 'c d e', 'e f g']" },
        { in: "chunk_words('a b c', 5, 2)", out: "['a b c']" },
        { in: "chunk_words('a b c d', 2, 0)", out: "['a b', 'c d']" },
      ],
      starter: `def chunk_words(text, size, overlap):
    pass`,
      hints: [
        "<code>words = text.split()</code> و<code>step = size - overlap</code>، ولف بـ <code>range(0, len(words), step)</code>.",
        "كل chunk هو <code>' '.join(words[start:start + size])</code>.",
        "بعد ما تضيف chunk، لو <code>start + size &gt;= len(words)</code> اعمل <code>break</code>.",
      ],
      solution: `def chunk_words(text, size, overlap):
    if overlap >= size:
        raise ValueError("overlap must be smaller than size")
    words = text.split()
    step = size - overlap
    chunks = []
    for start in range(0, len(words), step):
        chunks.append(" ".join(words[start:start + size]))
        if start + size >= len(words):
            break
    return chunks

print(chunk_words("a b c d e f g", 3, 1))
print(chunk_words("a b c", 5, 2))
print(chunk_words("a b c d", 2, 0))
print(chunk_words("", 3, 1))`,
      explain: "من غير الـ <code>break</code> كان هيطلع chunk زيادة بيتكون كله من كلمات اتغطت قبل كده (مثلا <code>'e f g'</code> بعدها <code>'g'</code>). شرط <code>overlap &lt; size</code> ضروري، وإلا <code>step</code> صفر أو سالب والـ range هتفشل أو تتكرر. التعقيد O(n).",
    },
    {
      title: "cosine top-k في NumPy",
      lang: "python",
      prompt: "<p>اكتب <code>top_k(query, matrix, k)</code>: <code>matrix</code> فيها متجه في كل صف. رجّع <code>(indices, scores)</code> لأعلى <code>k</code> صفوف بالـ cosine similarity مع <code>query</code>، مرتبة من الأعلى للأقل، والـ scores مقرّبة لـ 3 أرقام. صف كله أصفار درجته 0 (من غير قسمة على صفر). التعادل يترتب بترتيب الصفوف الأصلي.</p>",
      examples: [
        { in: "top_k([1, 0], [[1, 0], [0, 1], [1, 1], [0, 0]], 2)", out: "([0, 2], [1.0, 0.707])" },
        { in: "top_k([1, 1], [[1, 0], [0, 1], [1, 1], [0, 0]], 3)", out: "([2, 0, 1], [1.0, 0.707, 0.707])" },
      ],
      starter: `import numpy as np

def top_k(query, matrix, k):
    pass`,
      hints: [
        "الأطوال: <code>np.linalg.norm(M, axis=1) * np.linalg.norm(q)</code>.",
        "القسمة الآمنة: <code>np.divide(M @ q, norms, out=np.zeros(len(M)), where=norms &gt; 0)</code>.",
        "الترتيب: <code>np.argsort(-scores, kind='stable')[:k]</code> علشان التعادل يحافظ على الترتيب.",
      ],
      solution: `import numpy as np

def top_k(query, matrix, k):
    q = np.asarray(query, dtype=float)
    M = np.asarray(matrix, dtype=float)
    norms = np.linalg.norm(M, axis=1) * np.linalg.norm(q)
    scores = np.divide(M @ q, norms, out=np.zeros(len(M)), where=norms > 0)
    idx = np.argsort(-scores, kind="stable")[:k]
    return idx.tolist(), scores[idx].round(3).tolist()

M = [[1, 0], [0, 1], [1, 1], [0, 0]]
print(top_k([1, 0], M, 2))
print(top_k([1, 1], M, 3))`,
      explain: "ضرب <code>M @ q</code> بيحسب كل الـ dot products مرة واحدة (ده سر السرعة). لو المتجهات normalised مسبقا بتوفر حساب الأطوال كل مرة. <code>kind='stable'</code> مهم لأن الـ quicksort الافتراضي مش مضمون ترتيب المتعادلين. التعقيد O(n·d) للضرب + O(n log n) للترتيب، ومع <code>np.argpartition</code> ممكن تقلل الترتيب لو k صغير.",
    },
    {
      title: "hit rate@k على golden set",
      lang: "python",
      prompt: "<p>اكتب <code>hit_rate_at_k(retrieve, golden, k)</code>. <code>retrieve(question)</code> بترجع قائمة ids مرتبة من الأفضل للأسوأ. <code>golden</code> قائمة <code>(question, relevant_ids)</code>. السؤال يعتبر hit لو أي واحد من <code>relevant_ids</code> ظهر في أول <code>k</code> نتيجة. رجّع نسبة الـ hits من كل الأسئلة مقرّبة لـ 3 أرقام.</p>",
      examples: [
        { in: "# retrieve(q1)=['a','b','c'], q2=['x','a','b'], q3=['y','z','w']\n# golden=[(q1,['a']),(q2,['a','b']),(q3,['a'])]\nhit_rate_at_k(retrieve, golden, 1)", out: "0.333" },
        { in: "hit_rate_at_k(retrieve, golden, 2)", out: "0.667" },
      ],
      hints: [
        "<code>got = retrieve(question)[:k]</code>.",
        "التقاطع: <code>set(got) &amp; set(relevant)</code>، لو مش فاضي يبقى hit.",
      ],
      solution: `def hit_rate_at_k(retrieve, golden, k):
    hits = 0
    for question, relevant in golden:
        got = retrieve(question)[:k]
        if set(got) & set(relevant):
            hits += 1
    return round(hits / len(golden), 3)

ranked = {"q1": ["a", "b", "c"], "q2": ["x", "a", "b"], "q3": ["y", "z", "w"]}
golden = [("q1", ["a"]), ("q2", ["a", "b"]), ("q3", ["a"])]
for k in (1, 2, 3):
    print(k, hit_rate_at_k(lambda q: ranked[q], golden, k))`,
      explain: "الـ hit rate@k بيزيد أو يثبت مع زيادة k (مفيش نزول). q3 مبيظهرش أبدا فبيحدد السقف 0.667. لو الـ relevant لكل سؤال أكتر من واحد ممكن تحسب recall@k الحقيقي (كام نسبة من الـ relevant ظهرت) أو مقاييس بتراعي الترتيب زي MRR، لكن hit rate هو الأبسط والأكتر استخداما للبداية.",
    },
  ],

  quiz: [
    {
      q: "أهم سبب لاستخدام RAG بدل الاعتماد على ذاكرة الموديل لمستندات شركة بتتحدث كل أسبوع؟",
      options: [
        "RAG بيخلي الموديل أصغر في الحجم",
        "نقدر نحدّث المستندات والـ index من غير تدريب، ونذكر مصدر كل معلومة",
        "RAG بيمنع الـ hallucination تماما",
        "RAG أرخص من أي prompt عادي دايما",
      ],
      answer: 1,
      why: "الميزة الأساسية: معرفة حديثة وخاصة وcitations من غير إعادة تدريب. RAG بيقلل الـ hallucination لكن مش بيمنعها، وبيزود tokens المدخل فمش دايما أرخص.",
    },
    {
      q: "<code>chunk_words('a b c d e f g', 3, 1)</code> بترجع كام chunk؟",
      answer: ["3"],
      why: "الخطوة 2: البدايات 0 و2 و4: <code>'a b c'</code> و<code>'c d e'</code> و<code>'e f g'</code>. الأخير وصل لآخر كلمة فنقف.",
    },
    {
      q: "chunks صغيرة جدا (جملة واحدة) بتسبب إيه غالبا؟",
      options: [
        "الإجابة بتتوزع على كذا chunk والكلمات بتفقد سياقها (مثل «ده» أو «هو»)",
        "الـ index مبيشتغلش",
        "الـ embedding بيطلع بعدد أبعاد أقل",
        "الموديل بيرفض المدخل",
      ],
      answer: 0,
      why: "الصغير دقيق في البحث لكن بيفقد السياق وبيفرّق المعلومة. الكبير العكس. الأبعاد ثابتة بموديل الـ embeddings ومفيش علاقة بحجم الـ chunk.",
    },
    {
      q: "ليه cosine هو المقياس الأشهر في البحث الدلالي؟",
      options: [
        "لأنه بيقيس الطول مش المعنى",
        "لأنه دايما بيدّي 1",
        "لأنه بيقيس الاتجاه (المعنى) بغض النظر عن الطول، وبيبقى ضرب نقطي بعد الـ normalise فسريع",
        "لأنه بيحتاج إعادة تدريب الموديل",
      ],
      answer: 2,
      why: "cosine بيتجاهل طول المتجه ويقيس الزاوية. بعد توحيد الطول هو dot product عادي، وده يتحسب لكل الـ chunks بضرب مصفوفة.",
    },
    {
      q: "في تجربة ANN المبسطة، بحثنا في cluster واحد بس (حوالي 5% من البيانات) وطلع recall = 0.876. إيه معنى الرقم؟",
      options: [
        "إن 12.4% من الجيران الحقيقيين الأقرب فاتوا البحث التقريبي",
        "إن البحث التقريبي أبطأ من الـ exact",
        "إن الموديل غلط بنسبة 87.6%",
        "إن الـ index فيه 876 متجه",
      ],
      answer: 0,
      why: "recall 0.876 = لقينا 87.6% من الجيران الصح (مقارنة بالـ exact) وفاتنا 12.4%. المقابل إننا مسحنا جزء صغير بس من البيانات فهو أسرع.",
    },
    {
      q: "عندك سؤال عن كود الخطأ <code>ERR-4417</code> بالظبط. أنهي بحث غالبا هيمسكه أحسن؟",
      options: [
        "embeddings بس، لأنها بتفهم المعنى دايما",
        "حاجة عشوائية",
        "كل الطرق نفس الشيء",
        "lexical مثل BM25 (أو hybrid)، لأن الكود كلمة محددة نادرة",
      ],
      answer: 3,
      why: "الأكواد والأسماء المحددة هي نقطة قوة البحث اللفظي. الـ embeddings ممكن تفوّتها لأنها بتمثل المعنى العام. الـ hybrid بيجمع الاتنين.",
    },
    {
      q: "<code>rrf([['c3','c1','c7'], ['c1','c5','c3']])</code> بترجع أول عنصر مين؟ (اعتبر k = 60)",
      answer: ["c1"],
      why: "c1: 1/62 + 1/61 = 0.0325، وc3: 1/61 + 1/63 = 0.0323. c1 جه تاني ثم أول، وc3 جه أول ثم تالت، فc1 كسب بفرق صغير.",
    },
    {
      q: "الـ retrieval رجّع chunks مش فيها الإجابة، والموديل جاوب غلط بثقة. أول حاجة تصلحها؟",
      options: [
        "اضغط على الموديل بتعليمة أقوى «ماتغلطش»",
        "زوّد الـ temperature",
        "حسّن الـ retrieval (chunking، embeddings، hybrid، reranking) وقيسه بـ golden set",
        "زوّد عدد الـ chunks لـ 50 من غير قياس",
      ],
      answer: 2,
      why: "لو الـ chunk الصح مش في السياق فالموديل مفيش قدامه إجابة، وأي prompt مش هيعوّض. زيادة k من غير قياس بتزود التشتت والتكلفة (context stuffing).",
    },
    {
      q: "أنهي مجموعة من دول بتقيس جودة RAG على مستويين منفصلين؟",
      options: [
        "عدد الـ chunks وحجم الـ index",
        "الـ temperature والـ top-p",
        "سرعة الـ embedding وسرعة الـ GPU",
        "recall@k للـ retrieval، وfaithfulness (الإجابة مبنية على السياق) للتوليد",
      ],
      answer: 3,
      why: "الفصل بين الـ retrieval والـ generation هو اللي يخليك تعرف المرحلة اللي بتفشل. الباقي إعدادات أو أداء مش جودة.",
    },
    {
      q: "المستند اتعدّل امبارح، والمستخدم لسه بياخد الإجابة القديمة. إيه السبب الأرجح؟",
      options: [
        "الـ index لسه فيه المتجهات القديمة (stale index) ومحتاج pipeline تحديث",
        "الـ temperature عالية",
        "الـ context window صغيرة",
        "الموديل بيرفض البيانات الجديدة",
      ],
      answer: 0,
      why: "الـ retrieval بيرجّع من الـ index. لو متحدّثش، هيرجّع النص القديم. العلاج: إعادة تضمين المستند المتغير وحذف القديم، وتسجيل تاريخ كل chunk.",
    },
  ],
};
