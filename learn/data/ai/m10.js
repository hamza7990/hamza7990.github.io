window.LEVELS = window.LEVELS || {};
window.LEVELS["ai/m10"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "الـ LLM هو موديل بيتوقع الـ token اللي جاي، ومنها بتطلع كل حاجة",
      en: "A language model predicts the next token",
      body: "<p>تخيل الـ autocomplete في موبايلك: بتكتب «صباح» فيقترح «الخير». الـ <b>LLM</b> (Large Language Model) هو نفس الفكرة بحجم ضخم: موديل بياخد نص، ويحسب <b>احتمال كل token ممكن يجي بعده</b>، ويختار واحد، ويضيفه للنص، ويكرر. الإجابة اللي بتشوفها في أي شات اتكتبت كده، token ورا token.</p><p>الفرق بين الـ autocomplete العادي والـ LLM هو <b>الحجم والمعمارية</b>: الأول بيبص على آخر كلمتين، والتاني (Transformer من m9) بيبص على آلاف الـ tokens اللي قبله وبيفهم السياق. لكن المبدأ واحد: توقع التالي. لازم تفهم ده كويس لأن كل سلوك غريب (hallucination، عشوائية الإجابات، حدود السياق) بيتشرح منه.</p><p>أصغر نسخة من الفكرة: جدول عدّ. بنعد كل كلمة بيجي بعدها إيه في نص صغير، ونحول العدّ لاحتمالات، ونولّد منها:</p>",
      code: {
        lang: "python",
        title: "bigram: أصغر موديل لغة ممكن",
        src: `import numpy as np
from collections import Counter, defaultdict

text = "the cat sat on the mat . the cat ate the fish . the dog sat on the rug ."
words = text.split()
nxt = defaultdict(Counter)
for a, b in zip(words, words[1:]):
    nxt[a][b] += 1

for w in ("the", "sat", "cat"):
    c = nxt[w]
    total = sum(c.values())
    print(w, {k: round(v / total, 2) for k, v in c.items()})
# the {'cat': 0.33, 'mat': 0.17, 'fish': 0.17, 'dog': 0.17, 'rug': 0.17}
# sat {'on': 1.0}
# cat {'sat': 0.5, 'ate': 0.5}

rng = np.random.default_rng(0)
out = ["the"]
for _ in range(8):
    c = nxt[out[-1]]
    toks = list(c)
    p = np.array([c[t] for t in toks], dtype=float)
    out.append(str(rng.choice(toks, p=p / p.sum())))
print(" ".join(out))
# the fish . the cat ate the fish .`,
        note: "الموديل ده بيبص على كلمة واحدة بس قبل اللي هيتوقعها. الـ LLM الحقيقي بيحسب الاحتمالات دي بشبكة عصبية (Transformer) بدل جدول، وبيبص على السياق كله، لكن الناتج برضه <b>توزيع احتمالات على الـ token التالي</b>. لاحظ إن الجملة المتولدة «سليمة الشكل» بس مفيهاش أي ضمان إنها حقيقية، وده بذرة موضوع الـ hallucination.",
      },
      points: [
        "الموديل بيطلّع <b>توزيع احتمالات</b> على كل الـ tokens الممكنة، مش إجابة واحدة. طريقة اختيار الواحد من التوزيع اسمها decoding (شريحة جاية).",
        "التدريب نفسه (pretraining) هو: خد نص ضخم، خبّي الـ token التالي، خلّي الموديل يتوقعه، قيس الغلط بـ cross-entropy (m3 وm7)، وعدّل الأوزان بـ gradient descent.",
      ],
      interview: [
        { q: "اشرح بكلمات بسيطة إزاي الـ LLM بيولّد نص.", a: "بياخد النص اللي قدامه كـ tokens، ويحسب بشبكة Transformer توزيع احتمالات على الـ token التالي، وبعدين بنختار token من التوزيع ده (greedy أو بـ sampling)، نضيفه للنص ونكرر لحد ما يخلص أو يوصل لحد معين. يعني التوليد هو توقع التالي مكرر. والتدريب الأساسي كان توقع التالي على كمية ضخمة من النصوص." },
      ],
    },
    {
      kicker: "المدخل الحقيقي",
      title: "Tokens و Tokenization: الموديل مبيشوفش كلمات ولا حروف",
      en: "Tokens and subword tokenization (BPE)",
      body: "<p>الموديل بياخد أرقام. الـ <b>tokenizer</b> بيقطّع النص لقطع اسمها tokens ويحول كل قطعة لرقم (id). القطع دي مش كلمات كاملة ولا حروف: هي <b>أجزاء كلمات</b> (subwords). السبب: لو كل كلمة token، المعجم هيبقى ضخم ومش هيعرف كلمة جديدة. ولو كل حرف token، النص هيبقى طويل جدا. الحل الوسط: القطع اللي بتتكرر كتير (زي «ing» أو « the») تبقى token واحد، والكلمة النادرة تتقسم لقطع أصغر.</p><p>أشهر طريقة اسمها <b>BPE</b> (Byte Pair Encoding): ابدأ بالحروف، وكرر: دوّر على أكتر زوج متجاور بيتكرر، وادمجهم في token جديد. ده مثال صغير بالإيد:</p>",
      code: {
        lang: "python",
        title: "BPE صغير: 4 دمجات",
        src: `from collections import Counter

def pair_counts(seqs):
    c = Counter()
    for s in seqs:
        for a, b in zip(s, s[1:]):
            c[(a, b)] += 1
    return c

def merge(seqs, pair):
    new = pair[0] + pair[1]
    out = []
    for s in seqs:
        r, i = [], 0
        while i < len(s):
            if i + 1 < len(s) and (s[i], s[i + 1]) == pair:
                r.append(new)
                i += 2
            else:
                r.append(s[i])
                i += 1
        out.append(r)
    return out

corpus = ["low", "low", "lower", "newest", "newest", "widest"]
seqs = [list(w) for w in corpus]
for step in range(4):
    counts = pair_counts(seqs)
    best = max(counts, key=lambda p: (counts[p], p))
    seqs = merge(seqs, best)
    print(step + 1, best, counts[best])
print(seqs)
# 1 ('w', 'e') 3
# 2 ('s', 't') 3
# 3 ('l', 'o') 3
# 4 ('we', 'st') 2
# [['lo', 'w'], ['lo', 'w'], ['lo', 'we', 'r'], ['n', 'e', 'west'], ['n', 'e', 'west'], ['w', 'i', 'd', 'e', 'st']]`,
        note: "بعد 4 دمجات: «low» بقت قطعتين <code>lo + w</code>، و«newest» بقت <code>n e west</code>. الدمجات اللي اتعملت بالترتيب هي \"الـ tokenizer\" نفسه: لما يجي نص جديد بنطبق نفس الدمجات بنفس الترتيب. (لما فيه تعادل في العدد بنكسره بترتيب الزوج، ده قرار تنفيذ مش قاعدة ثابتة.) الـ tokenizers الحقيقية بتشتغل غالبا على bytes مش حروف، وبتتدرب على نص ضخم، ومعجمها عشرات الآلاف من الـ tokens.",
      },
      points: [
        "<b>ليه العربي والكود أغلى؟</b> الـ tokenizer بيتدرب على نص، والقطع اللي بتتكرر في بياناته بتبقى tokens طويلة. لو أغلب البيانات إنجليزي، الإنجليزي بيتقطّع لقطع كبيرة والعربي بيتقطّع لقطع أصغر وأكتر. الحروف العربية كمان 2 bytes في UTF-8. النتيجة: نفس المعنى ممكن ياخد tokens أكتر، يعني تكلفة أعلى وسياق بيتملى أسرع. المقدار بيختلف من tokenizer لتاني فقيسه على الـ tokenizer اللي هتستخدمه.",
        "الكود بيتكلف أكتر لأن فيه رموز ومسافات وأسماء متغيرات غير مألوفة، وبعض الـ tokenizers بتتعامل معاها أحسن من غيرها.",
        "الـ tokenization هي سبب أخطاء غريبة زي «عد الحروف في كلمة» أو «اعكس الكلمة»: الموديل مبيشوفش الحروف، بيشوف قطع.",
      ],
      pitfall: "الاعتماد على عدد الكلمات لتقدير التكلفة. التكلفة والحد الأقصى بيتحسبوا بالـ tokens، وعدد الـ tokens للنص نفسه بيختلف بين اللغات وبين الموديلات. قيس بالـ tokenizer الفعلي مش بالتخمين.",
      interview: [
        { q: "إيه هو الـ tokenization وليه subword؟ وإيه هو BPE؟", a: "الـ tokenizer بيقطّع النص لـ tokens وبيحولها لأرقام. الكلمات الكاملة كـ tokens معناها معجم ضخم وكلمات مجهولة، والحروف معناها نصوص طويلة جدا، فبنستخدم subwords. BPE بيبدأ بالحروف وبيدمج في كل خطوة أكتر زوج متجاور بيتكرر في بيانات التدريب لحد ما يوصل لحجم المعجم المطلوب. مثلا «low» ممكن تبقى lo + w بعد كام دمجة." },
        { q: "ليه نفس الجملة بالعربي ممكن تكلف tokens أكتر من الإنجليزي؟", a: "لأن الـ tokenizer اتدرب على بيانات أغلبها إنجليزي في كتير من الحالات، فالقطع الطويلة المتكررة بتبقى إنجليزية، والعربي بيتقطع لقطع أصغر وأكتر. ده بيزود التكلفة، وبياخد من الـ context window، وممكن يبطّأ التوليد. بيختلف بين tokenizer وتاني، فلازم تقيس على اللي هتستخدمه." },
      ],
    },
    {
      kicker: "الذاكرة المؤقتة",
      title: "الـ Context window: كل اللي الموديل شايفه في الطلب ده",
      en: "The context window",
      body: "<p>الـ <b>context window</b> هو الحد الأقصى لعدد الـ tokens اللي الموديل بيقدر يبص عليها في طلب واحد، والمدخل <b>والمخرج</b> بيتحسبوا مع بعض. الموديل <b>مفيهوش ذاكرة بين الطلبات</b>: الشات اللي بيفتكر اللي قلته من 10 رسايل مش بيفتكر، التطبيق هو اللي بيبعت المحادثة كلها مرة تانية مع كل رسالة جديدة. فلما المحادثة تطول لازم حد يقص أو يلخص.</p>",
      code: {
        lang: "python",
        title: "قص المحادثة: خلّي الـ system والأحدث بس",
        src: `def fit_context(messages, budget, count):
    """Keep the system message and the newest turns that fit."""
    system, rest = messages[0], messages[1:]
    used = count(system)
    kept = []
    for m in reversed(rest):
        c = count(m)
        if used + c > budget:
            break
        kept.append(m)
        used += c
    return [system] + kept[::-1], used

count = lambda m: len(m.split())      # crude stand-in for a tokenizer
msgs = ["SYSTEM be brief", "u1 hello there", "a1 hi",
        "u2 what is rag in short", "a2 retrieval then generate",
        "u3 and fine tuning"]
kept, used = fit_context(msgs, 14, count)
print(used, kept)
# 11 ['SYSTEM be brief', 'a2 retrieval then generate', 'u3 and fine tuning']`,
        note: "بنمشي من الأحدث للأقدم ونوقف لما الميزانية تخلص. لاحظ إن <code>u2</code> اتشال بس <code>a2</code> فضل، يعني القص الأعمى ممكن يفصل سؤال عن إجابته. في الواقع بتحتاج تقص بالـ tokens الفعلية، وساعات بتلخص الأقدم بدل ما ترميه. (<code>count</code> هنا مجرد عدّ كلمات لتبسيط الفكرة.)",
      },
      points: [
        "<b>تطويل السياق مش مجاني</b>: تكلفة الـ attention بتزيد مع مربع الطول (m9)، وكل token في المدخل بيتحاسب عليك وبيزود الـ latency.",
        "حتى لو المعلومة داخل الـ window، الموديل مش بيستخدمها دايما بنفس الكفاءة. الأبحاث لاحظت إن المعلومات اللي في النص الطويل بتتفوّت أحيانا، خصوصا في النص الوسط، وده بيختلف بين الموديلات. اختبر على حالتك.",
        "حجم الـ window بيتغير بسرعة بين الموديلات، فاقرأ الرقم من وثائق الموديل اللي بتستخدمه وماتحفظوش.",
      ],
    },
    {
      kicker: "إزاي الموديل اتعمل",
      title: "Pretraining ثم Fine-tuning ثم Instruction tuning",
      en: "Pretraining, fine-tuning and instruction tuning",
      body: "<p>الموديل اللي بتكلمه اتدرب على مراحل، وفهم الفرق بينهم هو سؤال إنترفيو متكرر:</p>",
      points: [
        "<b>Pretraining</b>: توقع الـ token التالي على كمية نصوص ضخمة جدا (كتب، مواقع، كود). ده أغلى مرحلة بفارق كبير، وبتتعمل مرة في الشركات الكبيرة بس. الناتج <b>base model</b>: بيكمل النص بشكل متقن لكنه <b>مش بيجاوب</b> بالضرورة. لو كتبت له سؤال ممكن يكمل بأسئلة تانية، لأن ده اللي بيحصل في النصوص.",
        "<b>Instruction tuning</b> (نوع من الـ supervised fine-tuning): تدريب إضافي أصغر بكتير على أمثلة «تعليمة ← رد كويس» كتبها بشر أو اتولدت واتراجعت. هنا الموديل يتعلم شكل المحادثة وإنه يتبع الأوامر.",
        "<b>Preference tuning</b> (زي RLHF وأخواته): بنخلّي بشر (أو موديل) يقارنوا ردين ويقولوا الأحسن، وبنعدّل الموديل ناحية الردود المفضلة. بيحسّن الأسلوب والأمان والمساعدة. الطرق التفصيلية بتتغير وفيها اختلاف بين الباحثين، فكفاية تفهم الفكرة.",
        "<b>Fine-tuning لتطبيقك</b>: تدريب إضافي على أمثلة مجالك (أسلوب رد معين، صيغة مخرجات ثابتة، تصنيف). بيغيّر <b>سلوك وأسلوب</b> الموديل أكتر ما بيحقن معلومات جديدة بشكل موثوق. لو عايز الموديل يعرف مستندات شركتك، الأنسب غالبا الـ retrieval (m12) مش الـ fine-tuning.",
      ],
      terms: [
        ["base model", "الموديل الأساسي", "اتدرب على توقع التالي بس، من غير تدريب على اتباع التعليمات"],
        ["chat / instruct model", "موديل المحادثة", "base model اتعمله instruction tuning وpreference tuning"],
        ["embedding model", "موديل الـ embeddings", "بيحول نص لمتجه ثابت الطول للمقارنة والبحث، مش بيولّد نص"],
      ],
      focus: [{ label: "احفظها", text: "Pretraining بيدّي <b>اللغة والمعرفة العامة</b>، instruction tuning بيدّي <b>السلوك</b> (يجاوب ويتبع أوامر)، fine-tuning لتطبيقك بيدّي <b>أسلوب ومخرجات ثابتة</b>. المعرفة الخاصة والمتغيرة الأفضل تتجاب وقت السؤال (retrieval)." }],
      interview: [
        { q: "الفرق بين pretraining و fine-tuning و instruction tuning؟", a: "Pretraining هو توقع التالي على نصوص ضخمة وبيدّي معرفة عامة ولغة، والناتج base model بيكمل نص. Instruction tuning تدريب إضافي على أمثلة تعليمة ورد فبيتعلم يجاوب ويتبع الأوامر. Fine-tuning لحالة معينة هو تدريب إضافي على أمثلتك علشان أسلوب أو صيغة أو مهمة محددة. الاتنين الأخيرين أرخص بكتير من الأول." },
        { q: "إمتى تعمل fine-tuning وإمتى تستخدم retrieval أو prompting؟", a: "أبدأ بالـ prompting لأنه أسرع وأرخص. لو الموديل محتاج معلومات خاصة أو متغيرة أو محتاج citations، أستخدم retrieval. أعمل fine-tuning لما أحتاج أسلوب أو صيغة مخرجات ثابتة أو مهمة ضيقة بتتكرر وعندي أمثلة كتير جيدة، أو عايز موديل أصغر وأرخص يعمل المهمة. وممكن أجمع بينهم." },
      ],
    },
    {
      kicker: "فهم مقابل توليد",
      title: "Embeddings مقابل Generation: موديلين لشغلتين مختلفتين",
      en: "Embedding models vs generative models",
      body: "<p>في m9 شفنا إن الكلمة بتتحول لمتجه. موديل الـ <b>embeddings</b> بياخد نص كامل ويطلّع <b>متجه واحد ثابت الطول</b> يمثل معناه: النصوص المتقاربة في المعنى متجهاتها قريبة (cosine). مبيولّدش نص. بيتستخدم في البحث الدلالي، التجميع، التصنيف، وده أساس الـ RAG.</p><p>الموديل <b>التوليدي</b> (generative) بياخد نص ويطلّع توزيع على الـ token التالي. هو اللي بتكلمه في الشات.</p><p>الاتنين غالبا موديلين مختلفين بأحجام وتكاليف مختلفة: embedding واحد لنص طويل أرخص بكتير من توليد إجابة. لما تعمل تطبيق بتستخدم الاتنين: embeddings علشان تلاقي المعلومات، وتوليدي علشان يكتب الإجابة.</p>",
      points: [
        "<b>embedding</b>: نص ← متجه (فهم/بحث). <b>generation</b>: نص ← نص (كتابة).",
        "متجهات من موديلين مختلفين <b>مش قابلة للمقارنة</b> ببعض، ولا لازم يكون ليهم نفس الطول. لو غيّرت موديل الـ embeddings لازم تعيد حساب كل المتجهات المخزنة.",
      ],
    },
    {
      kicker: "من الاحتمالات للـ token",
      title: "Decoding: greedy و temperature و top-k و top-p",
      en: "Decoding strategies",
      body: "<p>الشبكة بتطلّع لكل token درجة خام اسمها <b>logit</b>. الـ softmax (m3) بيحولها لاحتمالات. بعد كده لازم نختار token، وطريقة الاختيار بتغيّر شخصية الإجابة. هنجرب على توزيع صغير لعواصم محتملة بعد «عاصمة فرنسا هي». الأرقام اتحسبت فعلا بالكود ده:</p>",
      code: {
        lang: "python",
        title: "decoding على توزيع صغير",
        src: `import numpy as np

tokens = ["Paris", "Lyon", "Rome", "Cairo", "banana"]
logits = np.array([4.0, 2.5, 2.0, 1.0, -1.0])

def softmax(z, t=1.0):
    z = z / t
    e = np.exp(z - z.max())
    return e / e.sum()

def top_k(p, k):
    q = np.zeros_like(p)
    idx = np.argsort(p)[::-1][:k]
    q[idx] = p[idx]
    return q / q.sum()

def top_p(p, thr):
    order = np.argsort(p)[::-1]
    cum = np.cumsum(p[order])
    keep = order[: int(np.searchsorted(cum, thr)) + 1]
    q = np.zeros_like(p)
    q[keep] = p[keep]
    return q / q.sum()

def show(name, p):
    print(f"{name:12}", p.round(3))

show("t=1", softmax(logits))
show("t=0.5", softmax(logits, 0.5))
show("t=2", softmax(logits, 2.0))
show("t=1 top_k2", top_k(softmax(logits), 2))
show("t=1 top_p.9", top_p(softmax(logits), 0.9))
print("greedy:", tokens[int(np.argmax(logits))])
# t=1          [0.707 0.158 0.096 0.035 0.005]
# t=0.5        [0.934 0.047 0.017 0.002 0.   ]
# t=2          [0.466 0.22  0.171 0.104 0.038]
# t=1 top_k2   [0.818 0.182 0.    0.    0.   ]
# t=1 top_p.9  [0.736 0.164 0.1   0.    0.   ]
# greedy: Paris

rng = np.random.default_rng(0)
for t in (0.2, 1.0, 3.0):
    p = softmax(logits, t)
    draws = rng.choice(len(tokens), size=1000, p=p)
    print(t, np.bincount(draws, minlength=5))
# 0.2 [999   1   0   0   0]
# 1.0 [724 146  86  39   5]
# 3.0 [374 238 181 148  59]`,
        note: "درجة الحرارة (temperature) بتقسم الـ logits قبل الـ softmax: أقل من 1 بتحدّ التوزيع (Paris بقت 0.934)، وأعلى من 1 بتسطّحه (banana بقت 3.8% بدل 0.5%). الـ top-k بيشيل كل حاجة برا أعلى k وبيعيد التطبيع. الـ top-p (nucleus) بيحتفظ بأصغر مجموعة مجموع احتمالاتها يوصل لـ p: هنا Paris وLyon وRome. آخر 3 سطور: 1000 سحبة عند كل temperature.",
      },
      points: [
        "<b>Greedy</b>: دايما الأعلى احتمالا. ثابت، لكن ممكن يعلق في تكرار ويطلع كلام ممل.",
        "<b>Temperature</b>: قريبة من 0 تقرّب من greedy، وعالية تدّي تنوع أكتر وأخطاء أكتر. مش مقياس «إبداع» بالمعنى السحري.",
        "<b>Top-k</b>: اختار من أعلى k بس. <b>Top-p</b>: اختار من أصغر مجموعة مجموعها p، وعددها بيتكيف مع التوزيع (لو الموديل واثق تبقى صغيرة).",
        "حتى مع temperature صفر النتيجة مش دايما متطابقة 100% بين تشغيلتين في بعض الأنظمة المستضافة (تفاصيل حسابية وتجميع طلبات)، فماتبنيش اختبارات تعتمد على تطابق حرفي.",
      ],
      interview: [
        { q: "إيه تأثير الـ temperature والـ top-p؟ وإمتى تستخدم كل واحد؟", a: "الـ temperature بتقسم الـ logits قبل softmax: القيمة المنخفضة بتخلي التوزيع حاد فالإجابة أثبت وأكتر توقعا، والعالية بتسطّحه فالتنوع بيزيد وبتزيد الأخطاء. الـ top-p بيقطع الذيل: بيختار من أصغر مجموعة tokens احتمالاتها تجمع p. للاستخراج والتصنيف والكود بنفضل قيم منخفضة، وللكتابة الحرة والعصف الذهني قيم أعلى. وبيتنصح بتغيير واحد منهم مش الاتنين مع بعض." },
      ],
    },
    {
      kicker: "أهم نقطة تفهمها",
      title: "الـ Hallucination والـ knowledge cutoff",
      en: "Hallucination and knowledge cutoff",
      body: "<p>الموديل متدرب على إنه <b>يطلّع النص الأكثر احتمالا</b>، مش النص الصحيح. مفيش جواه قاعدة بيانات حقائق ولا خطوة «اتأكد قبل ما تقول». لو سألته عن حاجة نادرة أو مش عارفها، أنسب استمرار لغويا هو جملة واثقة بتشبه الإجابات الصح، فبيألف تفاصيل مقنعة: مراجع مش موجودة، دوال في مكتبة مش موجودة، أرقام مظبوطة الشكل. ده <b>hallucination</b>. ده مش «عطل» بيتصلح بالكامل، ده نتيجة طبيعية لطريقة العمل، والتدريب بيقلله بس مبيشيلوش.</p>",
      points: [
        "<b>الأخطر</b>: الإجابة الغلط بنفس نبرة الواثق، فمفيش علامة ظاهرة. ثقة اللهجة مش دليل صحة.",
        "<b>Knowledge cutoff</b>: الموديل اتدرب على بيانات لحد تاريخ معين. اللي حصل بعدها مش في معرفته الأساسية، وهيجاوب عنه بتخمين أو بمعلومة قديمة. بتحله بإنك تدّيه المعلومة الحديثة في الطلب (بحث، retrieval، أداة).",
        "<b>اللي بيقلل المشكلة</b> (بدرجات، مش بيمنعها): إدخال المصدر في الـ prompt وطلب الإجابة منه فقط (m12)، السماح له بـ «معرفش»، أدوات حقيقية للحساب والبحث، التحقق الآلي من المخرجات (m11)، ومراجعة بشرية في القرارات المهمة.",
        "<b>الأخطاء المتوقعة أكتر</b>: أرقام وتواريخ دقيقة، أسماء ومراجع، حسابات متعددة الخطوات من غير أداة، وأي حاجة بعد الـ cutoff أو نادرة في بيانات التدريب.",
      ],
      pitfall: "تصدق إن temperature صفر معناها «إجابات حقيقية». الـ temperature بتتحكم في العشوائية مش في الصحة: الموديل ممكن يكرر نفس الإجابة الغلط بثبات.",
      interview: [
        { q: "ليه الـ LLMs بتعمل hallucination؟ وإزاي تقللها؟", a: "لأنها متدربة على توقع النص الأكثر احتمالا مش الأكثر صحة، ومفيهاش خطوة تحقق من الحقائق، فلما مبتعرفش بتولّد استمرار مقنع الشكل. بقلل المشكلة بإني أدّي الموديل المصدر وقت السؤال (RAG) وأطلب منه يجاوب منه فقط ويقول «مش موجود»، وبأدوات للحساب والبحث، وبـ validation للمخرجات، وبمراجعة بشرية للقرارات المهمة. مبتتشالش تماما." },
      ],
    },
    {
      kicker: "لما تختار موديل",
      title: "Parameters و context length، و open-weight مقابل hosted",
      en: "Comparing models: size, context, open weights vs hosted",
      body: "<p><b>Parameters</b> هي الأوزان المتدربة (m7). عددهم بيعبّر تقريبا عن «سعة» الموديل، وبيحدد الذاكرة اللي هو محتاجها لما تشغّله: كل parameter بياخد بايتات حسب الدقة المستخدمة (مثلا 2 bytes في 16-bit). ده بيخليك تحسب بسرعة هل موديل هيشتغل على جهازك. <b>Context length</b> هو حجم الـ window. الاتنين رقمين مختلفين: موديل ممكن يكون كبير وسياقه قصير أو العكس.</p><p>مبتقارنش موديلات بالـ parameters لوحدها: جودة بيانات التدريب والـ tuning بيفرقوا جدا، وموديل أصغر متدرب كويس ممكن يتفوق على أكبر منه في مهمة معينة. القرار بيتاخد بتجربة على <b>مهمتك أنت</b> (شريحة التقييم في m13).</p>",
      code: {
        lang: "python",
        title: "حساب تقريبي لذاكرة الأوزان",
        src: `def weights_gb(n_params, bytes_per_param):
    return n_params * bytes_per_param / 1e9

for name, n in (("small", 1e9), ("medium", 7e9), ("large", 70e9)):
    print(name, weights_gb(n, 2), weights_gb(n, 0.5))
# small 2.0 0.5
# medium 14.0 3.5
# large 140.0 35.0`,
        note: "الحساب ده للأوزان بس: الـ 7 مليار parameter بدقة 16-bit محتاجة حوالي 14GB، وبعد ضغطها لـ 4-bit (quantization، حوالي نص بايت لكل parameter) حوالي 3.5GB. التشغيل الفعلي بيحتاج زيادة للـ activations والـ KV cache اللي بيكبر مع طول السياق. الأرقام (1 و7 و70 مليار) أمثلة للحساب مش أسماء موديلات.",
      },
      points: [
        "<b>Hosted (API)</b>: بتبعت الطلب لمزود وتدفع بالـ token. مميزاته: أقوى الموديلات متاحة، من غير بنية تحتية، تتوسع بسهولة. عيوبه: بياناتك بتغادر شبكتك (راجع سياسة المزود وعقوده)، تكلفة متغيرة، المزود بيغير أو يوقف الموديلات، وتعتمد على خدمة خارجية.",
        "<b>Open-weight</b>: الأوزان متاحة تنزلها وتشغلها بنفسك. مميزاته: خصوصية أعلى لأن البيانات بتفضل عندك، تحكم كامل في النسخة والـ fine-tuning، ومفيش تكلفة لكل token بعد ما تجهز الأجهزة. عيوبه: محتاج GPU وخبرة تشغيل، والموديلات المتاحة أحيانا أضعف من الأحدث والأقوى المستضافة (والفجوة بتتغير)، والمسؤولية عليك (أمان، تحديثات، مراقبة).",
        "«open-weight» مش دايما «open-source» بالمعنى الكامل: الترخيص ممكن يحدد استخدامات، وبيانات التدريب غالبا مش متاحة. اقرأ الترخيص.",
        "القرار العملي بيتأثر بحجم الاستخدام، حساسية البيانات، متطلبات الـ latency، وقدرة الفريق على التشغيل. ناس كتير بتبدأ hosted للتجربة وبتنقل لاحقا لو الخصوصية أو التكلفة فرضت.",
      ],
      interview: [
        { q: "قارن بين موديل hosted و open-weight لتطبيق بيتعامل مع بيانات حساسة.", a: "الـ hosted أسهل وأقوى غالبا لكن البيانات بتتبعت لطرف تاني، فأحتاج مراجعة قانونية وعقود وسياسة الاحتفاظ بالبيانات. الـ open-weight بيخلي البيانات جوه بنيتي وبيدّيني تحكم في النسخة، لكن بتحمّل تكلفة GPU وصيانة وأمان، وممكن يكون أضعف في بعض المهام. بقرر بعد تجربة الاتنين على مهمتي بمقاييس واضحة ونظرة للتكلفة الكلية." },
      ],
    },
    {
      kicker: "الصورة الصادقة",
      title: "إيه اللي الـ LLM مش بيعمله، وإيه اللي بيتقال عنه غلط",
      en: "Honest limits",
      body: "<p>الـ LLM أداة قوية جدا في اللغة، لكن لازم تعرف حدودها علشان تبني عليها صح وتجاوب في الإنترفيو من غير مبالغة:</p>",
      points: [
        "<b>مفيش «فهم» مضمون</b>: بيتصرف كأنه فاهم في مهام كتير، وفيه نقاش علمي مفتوح عن معنى «الفهم». كمهندس، اللي يهمك السلوك المقاس: بيصيب قد إيه في مهمتي، وبيفشل إزاي.",
        "<b>الحساب والمنطق الدقيق</b> ضعيف من غير أدوات: الأفضل تدّيه calculator أو كود (m11).",
        "<b>عدم الثبات</b>: تغيير صياغة بسيط أو ترتيب المعلومات ممكن يغير الإجابة. وبالتالي لازم تختبر بمجموعة أسئلة مش بتجربة واحدة.",
        "<b>مفيش ذاكرة ولا تعلم من المحادثة</b>: الموديل مبيتغيرش من كلامك معاه. اللي بيتغير هو الـ prompt اللي بتبعته.",
        "<b>التحيز والأمان</b>: بيورث انحيازات بيانات التدريب ومحتاج حماية من الاستخدام الضار ومن الـ prompt injection (m11).",
        "<b>الأرقام بتتغير بسرعة</b> (أحجام السياق، الأسعار، ترتيب الموديلات). اللي بيثبت هو المفاهيم: tokens، السياق، decoding، retrieval، التقييم. ركز عليهم.",
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: softmax بـ temperature",
      lang: "python",
      code: `import numpy as np

def softmax(z, t=1.0):
    z = np.asarray(z, dtype=float) / t
    e = np.exp(z - z.max())
    return e / e.sum()

print(softmax([2.0, 1.0, 0.1]).round(3))
print(softmax([2.0, 1.0, 0.1], 0.5).round(3))`,
      note: "الناتج: <code>[0.659 0.242 0.099]</code> ثم <code>[0.864 0.117 0.019]</code>. الـ temperature الأقل جعلت التوزيع أحد.",
    },
    {
      title: "اكتب: top-k",
      lang: "python",
      code: `import numpy as np

def top_k(p, k):
    p = np.asarray(p, dtype=float)
    q = np.zeros_like(p)
    idx = np.argsort(p)[::-1][:k]
    q[idx] = p[idx]
    return q / q.sum()

print(top_k([0.5, 0.3, 0.15, 0.05], 2).round(3))`,
      note: "الناتج: <code>[0.625 0.375 0.    0.   ]</code>. بنصفّر الباقي ونعيد التطبيع علشان المجموع يرجع 1.",
    },
    {
      title: "اكتب: bigram counts",
      lang: "python",
      code: `from collections import Counter, defaultdict

words = "a b a c a b".split()
nxt = defaultdict(Counter)
for x, y in zip(words, words[1:]):
    nxt[x][y] += 1

def probs(w):
    c = nxt[w]
    total = sum(c.values())
    return {k: round(v / total, 2) for k, v in c.items()}

print(probs("a"))
print(probs("b"))`,
      note: "الناتج: <code>{'b': 0.67, 'c': 0.33}</code> ثم <code>{'a': 1.0}</code>. ده نفس جدول الـ bigram اللي ولّدنا منه نص.",
    },
  ],

  tasks: [
    {
      title: "قص المحادثة على ميزانية tokens",
      lang: "python",
      prompt: "<p>اكتب <code>fit_context(messages, budget, count)</code>. <code>messages</code> قائمة نصوص أولها رسالة الـ system، و<code>count(m)</code> دالة بترجّع عدد tokens الرسالة. رجّع <code>(kept, used)</code>: رسالة الـ system دايما موجودة، وبعدها أحدث رسايل ممكن تتحط من غير ما مجموع الـ tokens يعدّي <code>budget</code>، بنفس ترتيبهم الأصلي. أوقف عند أول رسالة (من الأحدث) مش بتكفي.</p>",
      examples: [
        { in: "fit_context(['S x', 'a b c', 'd e', 'f'], 5, lambda m: len(m.split()))", out: "(['S x', 'd e', 'f'], 5)" },
      ],
      starter: `def fit_context(messages, budget, count):
    pass`,
      hints: [
        "افصل <code>system = messages[0]</code> والباقي <code>rest</code>، وابدأ <code>used = count(system)</code>.",
        "لف على <code>reversed(rest)</code> وكمّل لحد ما <code>used + count(m) > budget</code> ثم <code>break</code>.",
        "الرسايل اللي جمعتها بترتيب معكوس، فاعكسها في الآخر: <code>kept[::-1]</code>.",
      ],
      solution: `def fit_context(messages, budget, count):
    system, rest = messages[0], messages[1:]
    used = count(system)
    kept = []
    for m in reversed(rest):
        c = count(m)
        if used + c > budget:
            break
        kept.append(m)
        used += c
    return [system] + kept[::-1], used

words = lambda m: len(m.split())
print(fit_context(["S x", "a b c", "d e", "f"], 5, words))
# (['S x', 'd e', 'f'], 5)`,
      explain: "بنستخدم <code>break</code> مش <code>continue</code> علشان ميحصلش إننا نتخطى رسالة كبيرة ونحط أقدم منها (ده كان هيخلي المحادثة مفككة). في الإنتاج بدل الرمي ممكن تلخص الرسايل اللي برا الميزانية. التعقيد O(عدد الرسايل).",
    },
    {
      title: "top-p (nucleus) sampling",
      lang: "python",
      prompt: "<p>اكتب <code>top_p(p, thr)</code> بتاخد احتمالات (قائمة أو array مجموعها 1) وعتبة <code>thr</code>، وترجّع array جديدة: بتحتفظ بأصغر مجموعة من أعلى الاحتمالات مجموعها <b>على الأقل</b> <code>thr</code>، وتصفّر الباقي، وتعيد التطبيع بحيث المجموع 1. الترتيب الأصلي للعناصر يفضل زي ما هو.</p>",
      examples: [
        { in: "top_p([0.5, 0.3, 0.15, 0.05], 0.9).round(3)", out: "[0.526 0.316 0.158 0.   ]" },
        { in: "top_p([0.5, 0.3, 0.15, 0.05], 0.4).round(3)", out: "[1. 0. 0. 0.]" },
        { in: "top_p([0.05, 0.5, 0.15, 0.3], 0.9).round(3)", out: "[0.    0.526 0.158 0.316]" },
      ],
      hints: [
        "رتّب الفهارس تنازليا: <code>order = np.argsort(p)[::-1]</code> وخد <code>np.cumsum(p[order])</code>.",
        "عدد العناصر اللي هتتحتفظ بيها = أول موضع التراكمي فيه يوصل <code>thr</code>، زائد 1. <code>np.searchsorted(cum, thr)</code> بتدّيك الموضع ده.",
        "املا array أصفار في الفهارس <code>order[:n]</code> وقسم على مجموعها.",
      ],
      solution: `import numpy as np

def top_p(p, thr):
    p = np.asarray(p, dtype=float)
    order = np.argsort(p)[::-1]
    cum = np.cumsum(p[order])
    n = int(np.searchsorted(cum, thr)) + 1
    q = np.zeros_like(p)
    q[order[:n]] = p[order[:n]]
    return q / q.sum()

print(top_p([0.5, 0.3, 0.15, 0.05], 0.9).round(3))
print(top_p([0.5, 0.3, 0.15, 0.05], 0.4).round(3))
print(top_p([0.05, 0.5, 0.15, 0.3], 0.9).round(3))`,
      explain: "التراكمي في المثال الأول 0.5 ثم 0.8 ثم 0.95، فأول موضع يوصل 0.9 هو الثالث (index 2) فبنحتفظ بـ 3. الميزة على top-k إن عدد العناصر بيتكيف: لو العنصر الأول لوحده بيوصل العتبة بنختار واحد بس (المثال الثاني). الـ searchsorted على التراكمي بيدّي الحل في O(n log n) بسبب الترتيب.",
    },
    {
      title: "تعلّم دمجات BPE",
      lang: "python",
      prompt: "<p>اكتب <code>learn_merges(words, n)</code> بتبدأ بكل كلمة كقائمة حروف، وبتكرر <code>n</code> مرة: تعد الأزواج المتجاورة في كل الكلمات (كل ظهور بيتحسب، والكلمة المتكررة بتتعد بتكرارها)، تختار الزوج الأكتر عدّا (عند التعادل الأكبر كـ tuple)، وتدمجه في كل مكان من اليسار لليمين. رجّع <code>(merges, seqs)</code>: قائمة الدمجات بالترتيب والكلمات بعد الدمج. لو مفيش أزواج اقف بدري.</p>",
      examples: [
        { in: "learn_merges(['low', 'low', 'lower', 'newest', 'newest', 'widest'], 4)[0]", out: "[('w', 'e'), ('s', 't'), ('l', 'o'), ('we', 'st')]" },
        { in: "learn_merges(['aaab', 'aaab'], 3)", out: "([('a', 'a'), ('aa', 'a'), ('aaa', 'b')], [['aaab'], ['aaab']])" },
      ],
      hints: [
        "<code>Counter().update(zip(s, s[1:]))</code> بتعد الأزواج لكلمة واحدة.",
        "اختيار الزوج: <code>max(counts, key=lambda p: (counts[p], p))</code>.",
        "الدمج: لف بـ <code>while i &lt; len(s)</code> وإذا <code>(s[i], s[i+1]) == best</code> ضيف الاتنين مدموجين وزوّد i بـ 2، غير كده ضيف الحرف وزوّد i بـ 1.",
      ],
      solution: `from collections import Counter

def learn_merges(words, n):
    seqs = [list(w) for w in words]
    merges = []
    for _ in range(n):
        counts = Counter()
        for s in seqs:
            counts.update(zip(s, s[1:]))
        if not counts:
            break
        best = max(counts, key=lambda p: (counts[p], p))
        merges.append(best)
        new = best[0] + best[1]
        out = []
        for s in seqs:
            r, i = [], 0
            while i < len(s):
                if i + 1 < len(s) and (s[i], s[i + 1]) == best:
                    r.append(new)
                    i += 2
                else:
                    r.append(s[i])
                    i += 1
            out.append(r)
        seqs = out
    return merges, seqs

m, s = learn_merges(["low", "low", "lower", "newest", "newest", "widest"], 4)
print(m)
print(learn_merges(["aaab", "aaab"], 3))`,
      explain: "في المثال التاني الزوج (a,a) ظهر 4 مرات (مرتين في كل كلمة)، فاتدمج الأول، وبعدها (aa,a) وبعدها (aaa,b)، والنتيجة كل كلمة بقت token واحد. الـ tokenizers الحقيقية بتشتغل على bytes وبتحسب العد على tokens مرجّحة بتكرار الكلمات، لكن الخوارزمية نفسها.",
    },
  ],

  quiz: [
    {
      q: "إيه اللي الـ LLM بيتدرب عليه في مرحلة الـ pretraining؟",
      options: [
        "تصنيف الأسئلة لفئات معروفة مسبقا",
        "التحقق من صحة الحقائق قبل الرد",
        "توقع الـ token التالي في كمية نصوص ضخمة",
        "حفظ المحادثات السابقة مع كل مستخدم",
      ],
      answer: 2,
      why: "الـ pretraining هو توقع الـ token التالي على نصوص ضخمة. مفيش مرحلة تحقق من الحقائق، ومفيش حفظ لمحادثات المستخدمين في الأوزان، والتصنيف مهمة تانية.",
    },
    {
      q: "في الـ bigram اللي في الشريحة الأولى (<code>the cat sat on the mat . the cat ate the fish . the dog sat on the rug .</code>)، ما هو احتمال <code>cat</code> بعد <code>the</code>؟ (قرّب لرقمين عشريين)",
      answer: ["0.33", "1/3", "0.333"],
      why: "الكلمة the ظهرت 6 مرات وبعدها (cat, mat, cat, fish, dog, rug)، فـ cat جت مرتين: 2 ÷ 6 = 0.33.",
    },
    {
      q: "ليه نفس المعنى بالعربي ممكن ياخد tokens أكتر من الإنجليزي؟",
      options: [
        "الـ tokenizer اتدرب على بيانات أغلبها إنجليزي فبيقطّع العربي لقطع أصغر وأكتر، والحروف العربية 2 bytes في UTF-8",
        "لأن الموديل مش بيفهم العربي أصلا",
        "لأن العربي بيتكتب من اليمين لليسار فبيتعد مرتين",
        "لأن كل كلمة عربية دايما بتتحسب 10 tokens",
      ],
      answer: 0,
      why: "القطع الطويلة المتكررة بتتعلمها الـ tokenizer من بياناتها. اللي مش مألوف ليها بيتقطّع أصغر. اتجاه الكتابة ملوش علاقة بالعد، ومفيش رقم ثابت لكل كلمة، والمقدار بيختلف من tokenizer لتاني.",
    },
    {
      q: "قللت الـ temperature من 1.0 لـ 0.2. إيه اللي حصل للتوزيع؟",
      options: [
        "بقى أكتر تسطحا، فالـ tokens النادرة بتتختار أكتر",
        "الاحتمالات كلها بقت متساوية",
        "الـ top-p اتلغى تلقائيا",
        "بقى أحد: الـ token الأعلى أخد احتمال أكبر وعمليا بيتقرب من greedy",
      ],
      answer: 3,
      why: "القسمة على رقم أصغر من 1 بتكبّر الفروق بين الـ logits قبل الـ softmax، فالأعلى بيسيطر (في المثال: 999 من 1000 سحبة). العكس يحصل لما تزود الـ temperature.",
    },
    {
      q: "<code>top_k([0.5, 0.3, 0.15, 0.05], 2)</code> بعد إعادة التطبيع. أول عنصر في الناتج؟",
      answer: ["0.625", "0.62", "5/8"],
      why: "بنحتفظ بـ 0.5 و0.3 (مجموعهم 0.8) ونقسم: 0.5 ÷ 0.8 = 0.625، والتاني 0.375.",
    },
    {
      q: "السبب الأساسي لإن الـ LLM بيألف معلومة مقنعة ومش موجودة (hallucination)؟",
      options: [
        "عشان الـ temperature دايما أعلى من 1",
        "لأنه متدرب على إنتاج النص الأكثر احتمالا، ومفيش جواه خطوة تتأكد من الحقيقة",
        "لأن الـ context window صغيرة دايما",
        "لأن المستخدم كتب السؤال بصيغة غلط",
      ],
      answer: 1,
      why: "الموديل بيتوقع استمرار مقنع لغويا، مش بيراجع حقائق. temperature صفر مش بتمنعها، وحتى مع سياق كبير ممكن تحصل، والصياغة ممكن تأثر لكنها مش السبب الجذري.",
    },
    {
      q: "طلبت من base model (من غير instruction tuning) سؤال «إيه عاصمة فرنسا؟». إيه اللي غالبا هيحصل؟",
      options: [
        "هيرد بإجابة دايما صح لأنه اتدرب على كل المعرفة",
        "هيرفض لأنه مفيهوش قاعدة بيانات",
        "ممكن يكمل النص بأسئلة تانية أو بشكل غير متوقع، لأنه اتدرب على إكمال النص مش على اتباع التعليمات",
        "هيطلع error لأن السؤال ناقص",
      ],
      answer: 2,
      why: "الـ base model بيكمل النص. في نصوص التدريب السؤال ممكن يجي بعده أسئلة تانية. الـ instruction tuning هو اللي بيعلّمه يجاوب.",
    },
    {
      q: "شركة بتعالج بيانات عملاء حساسة ومش عايزة تبعتها لمزود خارجي. إيه الأنسب كبداية؟",
      options: [
        "hosted API من غير أي مراجعة لأنه الأقوى",
        "موديل open-weight بتشغله على بنيتها، مع قبول إنها هتتحمل التشغيل والتكلفة والجودة الأقل أحيانا",
        "مفيش حل، لازم يتوقف المشروع",
        "تقليل الـ temperature لصفر",
      ],
      answer: 1,
      why: "الـ open-weight بيخلي البيانات عندك لكن بتحمّل التشغيل. ممكن برضه hosted بعقود وسياسات احتفاظ مقبولة، لكن السؤال عن عدم الإرسال لخارج. الـ temperature ملهاش علاقة بالخصوصية.",
    },
    {
      q: "المستخدم قال في الرسالة 1 اسمه، وفي الرسالة 10 سأل «إيه اسمي؟». الموديل جاوب صح. إيه اللي حصل غالبا؟",
      options: [
        "الموديل عدّل أوزانه وحفظ الاسم",
        "الموديل خزّن الاسم في ذاكرة دائمة جواه",
        "الموديل ماتعلمش حاجة، ومكنش محتاج لأنه بيدور في ملفات",
        "التطبيق بعت المحادثة كلها (أو ملخصها) مع الرسالة الجديدة، فالاسم كان في الـ context",
      ],
      answer: 3,
      why: "الموديل مبيحتفظش بحاجة بين الطلبات. الـ context هو اللي بيحمل المحادثة، وده سبب إن لما المحادثة تعدي حد السياق بتتقص أو تتلخص ويضيع منها.",
    },
    {
      q: "temperature قريبة جدا من 0 بتقرّب سلوك الـ sampling من أنهي استراتيجية؟ (كلمة واحدة)",
      answer: ["greedy", "greedy decoding", "Greedy"],
      why: "مع temperature صغيرة جدا الـ token الأعلى احتمالا بياخد تقريبا كل الاحتمال، فده شبه اختيار الأعلى دايما، وهو greedy.",
    },
  ],
};
