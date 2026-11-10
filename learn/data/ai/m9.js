window.LEVELS = window.LEVELS || {};
window.LEVELS["ai/m9"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "النص تسلسل: الترتيب والسياق هما المعنى",
      en: "Sequences and why order matters",
      body: "<p>الشبكات اللي شفناها بتاخد متجه ثابت الطول. لكن النص والصوت والـ time series <b>تسلسلات</b> بأطوال مختلفة، والترتيب فيها بيغيّر المعنى: «الكلب عض الراجل» غير «الراجل عض الكلب» بنفس الكلمات بالظبط. كمان معنى الكلمة بيعتمد على اللي حواليها: «عين» في «عين الماء» غير «عين الإنسان». الموديل المناسب لازم يتعامل مع: طول متغير، ترتيب، وسياق.</p><p>الـ <b>Transformer</b> (من ورقة «Attention Is All You Need»، 2017) هو الحل اللي بنيت عليه كل الـ LLMs (m10). فكرته الأساسية بسيطة: كل عنصر في التسلسل يبص على باقي العناصر ويقرر أنهي واحد منهم مهم له، وده اسمه <b>attention</b>. هنبنيه خطوة خطوة بأرقام صغيرة.</p>",
      points: [
        "الطريق: كلمات ← أرقام (embeddings) ← attention (مين مهم لمين) ← block يتكرر ← موديل كامل.",
        "كل الأمثلة هنا بأرقام صغيرة تتحسب بالإيد، علشان الفكرة توضح قبل ما نكبر الحجم.",
      ],
      interview: [
        { q: "ليه الـ fully connected العادي مش مناسب للنص؟", a: "لأنه بياخد مدخل بحجم ثابت، والنص أطواله مختلفة. وهو كمان مبيعرفش ترتيب، ولا بيشارك الأوزان بين المواضع (نفس الكلمة في موضع مختلف هتعدي على أوزان مختلفة). فمحتاجين معمارية بتتعامل مع طول متغير وبتأخد السياق في الاعتبار: RNN في الأول، وبعدين Transformer." },
      ],
    },
    {
      kicker: "الكلمات كأرقام",
      title: "Embeddings: المعنى كمتجه، والتشابه بـ cosine",
      en: "Word embeddings and cosine similarity",
      body: "<p>الشبكة بتشتغل على أرقام، فكل كلمة (أو token) بتتحول لمتجه من أرقام اسمه <b>embedding</b>. الفكرة: الكلمات اللي معانيها قريبة يبقى متجهاتها قريبة. الـ embeddings مش بتتحدد بإيد حد: هي <b>صفوف في جدول أوزان</b> (حجمه عدد الكلمات × طول المتجه) بيتدرب مع باقي الموديل.</p><p>التشابه بيتقاس بـ <b>cosine similarity</b>: الزاوية بين متجهين، من -1 (عكس) لـ 1 (نفس الاتجاه)، 0 يعني متعامدين (مفيش علاقة). مثال بـ 4 أبعاد اخترناها بإيدنا (royal, male, female, food) علشان الحسبة تتشاف بالإيد. <b>الأرقام دي لعبة توضيحية</b> مش embeddings حقيقية:</p>",
      code: {
        lang: "python",
        title: "toy embeddings: royal, male, female, food",
        src: `import numpy as np

E = {
    "king":  np.array([1.0, 1.0, 0.0, 0.0]),
    "queen": np.array([1.0, 0.0, 1.0, 0.0]),
    "man":   np.array([0.0, 1.0, 0.0, 0.0]),
    "woman": np.array([0.0, 0.0, 1.0, 0.0]),
    "apple": np.array([0.0, 0.0, 0.0, 1.0]),
}

def cosine(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

print(round(cosine(E["king"], E["queen"]), 3))   # 0.5
print(round(cosine(E["king"], E["man"]), 3))     # 0.707
print(round(cosine(E["king"], E["apple"]), 3))   # 0.0

v = E["king"] - E["man"] + E["woman"]            # the famous analogy
print(v)                                         # [1. 0. 1. 0.] = queen
print({k: round(float(cosine(v, x)), 3) for k, x in E.items()})
# {'king': 0.5, 'queen': 1.0, 'man': 0.0, 'woman': 0.707, 'apple': 0.0}`,
        note: "الحسبة اليدوية لأول سطر: <code>king·queen = 1×1 + 1×0 + 0×1 = 1</code>، وطول كل واحد <code>√2</code>، فالنتيجة <code>1 / (√2 × √2) = 0.5</code>. تشبيه «king - man + woman ≈ queen» ظهر في embeddings حقيقية بتتعلم من نصوص ضخمة (word2vec، GloVe) لكن بشكل تقريبي مش بالظبط كده. هنا بنوضح الفكرة بأرقام مصطنعة.",
      },
      points: [
        "الـ embeddings الحقيقية بيتدربوا من النص نفسه ومتجهاتها عادة عشرات أو مئات أو آلاف الأبعاد، وماحدش بيكتب معنى كل بُعد.",
        "الـ embedding في الـ Transformer هو <b>lookup بسيط</b> في جدول: كل token له صف. السياق (معنى الكلمة حسب اللي حواليها) بتضيفه طبقات الـ attention بعد كده.",
        "cosine بيتجاهل طول المتجه ويقيس الاتجاه، وده الأنسب لمقارنة المعاني.",
      ],
      interview: [
        { q: "إيه هو embedding وإزاي بنقيس التشابه بين اتنين؟", a: "الـ embedding هو متجه أرقام بيمثل كلمة أو token، وبيتعلم أثناء التدريب بحيث الكلمات المتشابهة المعنى تبقى قريبة. بنقيس التشابه بـ cosine similarity وهو حاصل الضرب النقطي مقسوم على حاصل ضرب الطولين: قريب من 1 يعني نفس الاتجاه، 0 يعني مفيش علاقة. مثلا بين (1,1,0,0) و(1,0,1,0) بيطلع 1 على (√2 × √2) يعني 0.5." },
      ],
    },
    {
      kicker: "قبل الـ Transformer",
      title: "حدود الـ RNN: ليه احتجنا حاجة أحسن",
      en: "The limits of RNNs",
      body: "<p>الـ <b>RNN</b> بيقرا الجملة كلمة كلمة ومعاه «ذاكرة» (hidden state) بتتحدّث مع كل كلمة. الـ LSTM والـ GRU نسخ أحسن منه. اتستخدموا كتير في الترجمة والكلام. المشكلتين الأساسيتين:</p>",
      points: [
        "<b>تبعية خطوات بعضها على بعض</b>: الخطوة <code>t</code> محتاجة ناتج <code>t-1</code>، فمش ممكن تحسب كل الكلمات بالتوازي. ده بيبطّأ التدريب على GPU اللي أساسها التوازي.",
        "<b>الاعتماديات البعيدة</b> (long-range dependencies): المعلومة من أول جملة طويلة لازم تعدي على عشرات الخطوات علشان توصل لآخرها، وفي الطريق بتتخفف أو بتتحرف (نفس مشكلة الـ vanishing gradient في m8). LSTM بيخفف ده لكن مبيشيلوش تماما.",
        "الفكرة اللي غيرت اللعبة: بدل ما المعلومة تعدي خطوة خطوة، <b>خلي كل كلمة تبص على كل الكلمات مباشرة</b> في خطوة واحدة. ده هو الـ attention.",
      ],
      interview: [
        { q: "إيه عيوب الـ RNN اللي حلها الـ Transformer؟", a: "عيبين: الأول إن الحساب تسلسلي (كل خطوة محتاجة اللي قبلها) فمش بيتوازى فالتدريب بطيء على GPU. التاني إن المعلومات البعيدة بتعدي على خطوات كتير فبتتخفف والـ gradient بيتلاشى. الـ Transformer بيخلي أي موضع يوصل لأي موضع تاني مباشرة بـ attention، وبيحسب كل المواضع في نفس الوقت." },
      ],
    },
    {
      kicker: "قلب الفكرة",
      title: "Attention كـ lookup بأوزان: Query و Key و Value",
      en: "Attention as a weighted lookup: query, key, value",
      body: "<p>تخيل قاموس عادي: بتدّي <b>key</b> بالظبط وبتاخد <b>value</b>. Attention هو قاموس «ناعم»: عندك <b>query</b> (السؤال: أنا بدور على إيه؟)، وعندك مجموعة <b>keys</b> (كل عنصر بيقول: أنا بتاع إيه؟) ومعاها <b>values</b> (المحتوى اللي هيتنقل). الخطوات:</p>",
      points: [
        "<b>1. Scores</b>: قيّم تطابق الـ query مع كل key بالضرب النقطي. كل ما اتشابهوا أكتر، الدرجة أعلى.",
        "<b>2. Scale</b>: اقسم على <code>√d</code> (طول الـ key) لسبب هنشوفه الشريحة الجاية.",
        "<b>3. Softmax</b>: حوّل الدرجات لأوزان موجبة مجموعها 1.",
        "<b>4. Weighted sum</b>: الناتج = مجموع الـ values مضروبة في أوزانها. يعني الناتج «خليط» من الـ values، والنسبة الأكبر من الـ values اللي keys بتاعتها أنسب للـ query.",
      ],
      code: {
        lang: "python",
        title: "attention لـ query واحد على 3 عناصر",
        src: `import numpy as np

def softmax(s):
    e = np.exp(s - s.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

q = np.array([1.0, 0.0])                       # what I look for
K = np.array([[1.0, 0.0], [0.0, 1.0], [0.5, 0.5]])   # what each item offers
V = np.array([[1.0, 2.0], [3.0, 4.0], [7.0, 8.0]])   # the content

scores = K @ q                                 # dot products
print(scores)                                  # [1.  0.  0.5]
scaled = scores / np.sqrt(2)                   # d = 2
print(scaled.round(3))                         # [0.707 0.    0.354]
w = softmax(scaled)
print(w.round(3), w.sum())                     # [0.456 0.225 0.32 ] 1.0
print((w @ V).round(3))                        # [3.368 4.368]`,
        note: "الـ key الأول (1,0) هو الأقرب للـ query (1,0) فخد أعلى وزن 0.456، والتاني (0,1) متعامد فخد أقل وزن 0.225. الناتج <code>0.456×(1,2) + 0.225×(3,4) + 0.32×(7,8) = (3.368, 4.368)</code>. الـ softmax بيطرح الـ max قبل الأس علشان الأرقام الكبيرة متفيضش (نفس الناتج رياضيا).",
      },
      focus: [{ label: "احفظها", text: "Attention(Q, K, V) = softmax( Q Kᵀ / √d ) V. الـ Q والـ K للمقارنة (مين مهم لمين)، والـ V للمحتوى اللي بيتجمع." }],
    },
    {
      kicker: "تفصيلة مهمة",
      title: "Scaled dot-product: ليه √d، والتأكد بـ PyTorch",
      en: "Why scaled dot-product attention",
      body: "<p>لو مكونات الـ query والـ key أرقام عادية بتباين 1، فالضرب النقطي بين متجهين طولهم <code>d</code> بيبقى مجموع <code>d</code> حد، وانحرافه المعياري بيكبر مع <code>√d</code>. لو <code>d = 64</code> الدرجات هتبقى حوالي ±8، والـ softmax مع فروق كبيرة كده بيدّي وزن قريب من 1 لواحد وصفر للباقي (saturated)، والـ gradient في الباقي بيتلاشى. القسمة على <code>√d</code> بترجّع الانحراف المعياري لـ 1 تقريبا.</p>",
      code: {
        lang: "python",
        src: `import numpy as np
import torch

def softmax(s):
    e = np.exp(s - s.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

rng = np.random.default_rng(0)
for d in (4, 64, 512):
    q = rng.normal(size=(5000, d))
    k = rng.normal(size=(5000, d))
    dots = (q * k).sum(axis=1)
    print(d, round(float(dots.std()), 2), round(float((dots / np.sqrt(d)).std()), 2))
# 4   2.0   1.0
# 64  8.03  1.0
# 512 22.98 1.02

s = np.array([8.0, 4.0, 0.0])                  # raw scores at d = 64
print(softmax(s).round(3))                     # [0.982 0.018 0.   ]
print(softmax(s / np.sqrt(64)).round(3))       # [0.506 0.307 0.186]

# check my attention against PyTorch's built-in version
Q = rng.normal(size=(1, 3, 4))
K = rng.normal(size=(1, 3, 4))
V = rng.normal(size=(1, 3, 4))
mine = softmax(Q @ K.transpose(0, 2, 1) / np.sqrt(4)) @ V
ref = torch.nn.functional.scaled_dot_product_attention(
    torch.tensor(Q), torch.tensor(K), torch.tensor(V)).numpy()
print(np.allclose(mine, ref))                  # True`,
        note: "اتشغّل فعلا (torch 2.10 على CPU). من غير القسمة، الـ softmax حط 98% على عنصر واحد. معاها الوزن موزّع بشكل أنعم (0.506، 0.307، 0.186). وكود NumPy بتاعنا طابق دالة PyTorch الجاهزة <code>scaled_dot_product_attention</code>.",
      },
      interview: [
        { q: "ليه بنقسم على √d_k في الـ attention؟", a: "لأن الضرب النقطي بين متجهين بطول d بيكبر انحرافه المعياري مع √d (مثلا حوالي 8 لما d=64). القيم الكبيرة بتدخل الـ softmax في منطقة مشبعة: وزن قريب من 1 لعنصر واحد وgradient قريب من صفر للباقي، فالتدريب بيبقى صعب. القسمة على √d_k بتخلي التباين حوالي 1 فالـ softmax يفضل في منطقة لينة." },
      ],
    },
    {
      kicker: "Self-attention",
      title: "Self-attention: كل token بيعمل Q و K و V من نفس الكلام",
      en: "Self-attention",
      body: "<p>في <b>self-attention</b> الـ Q وK وV كلهم بيتحسبوا من <b>نفس التسلسل</b>: لو <code>X</code> مصفوفة الـ embeddings (token في كل صف)، فـ <code>Q = X Wq</code> و<code>K = X Wk</code> و<code>V = X Wv</code> حيث الثلاث مصفوفات أوزان بيتدربوا. وكل token بيبص على كل الـ tokens (بما فيهم نفسه) ويطلع نسخة جديدة منه «واعية بالسياق». مثال بـ 3 tokens وأبعاد صغيرة:</p>",
      code: {
        lang: "python",
        title: "self-attention لـ 3 tokens",
        src: `import numpy as np

def softmax(s):
    e = np.exp(s - s.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

X = np.array([[1, 0, 1, 0], [0, 1, 0, 1], [1, 1, 0, 0]], dtype=float)
Wq = np.array([[1, 0], [0, 1], [1, 0], [0, 1]], dtype=float)
Wk = np.array([[0, 1], [1, 0], [0, 1], [1, 0]], dtype=float)
Wv = np.array([[1, 2], [0, 1], [1, 0], [2, 1]], dtype=float)

Q, K, V = X @ Wq, X @ Wk, X @ Wv
print(Q.tolist())   # [[2.0, 0.0], [0.0, 2.0], [1.0, 1.0]]
print(K.tolist())   # [[0.0, 2.0], [2.0, 0.0], [1.0, 1.0]]
S = Q @ K.T                                  # (3, 3) raw scores
print(S.tolist())   # [[0.0, 4.0, 2.0], [4.0, 0.0, 2.0], [2.0, 2.0, 2.0]]
W = softmax(S / np.sqrt(2))                  # each ROW sums to 1
print(W.round(3).tolist())
# [[0.045, 0.768, 0.187], [0.768, 0.045, 0.187], [0.333, 0.333, 0.333]]
print((W @ V).round(3).tolist())
# [[1.813, 2.187], [1.813, 2.187], [1.667, 2.333]]`,
        note: "الصف الأول من <code>W</code> بيقول: token 1 بيدّي 77% اهتمام لـ token 2 و19% لـ token 3 وتقريبا 4.5% لنفسه. token 3 درجاته كلها 2 فبيوزع الاهتمام بالتساوي (0.333 لكل واحد). الـ <code>W</code> مصفوفة (n × n)، وده سبب إن تكلفة الـ attention بتزيد مع <b>مربع</b> طول التسلسل.",
      },
      points: [
        "الناتج لكل token هو خليط من values كل الـ tokens، فالمعلومة بتنتقل بين أي موضعين في خطوة واحدة (ده اللي حل مشكلة الاعتماديات البعيدة).",
        "كل الصفوف بتتحسب في نفس الوقت بضرب مصفوفات، فمفيش انتظار خطوة قبل خطوة.",
      ],
      interview: [
        { q: "اشرح self-attention.", a: "كل token بيتحول لـ query وkey وvalue بثلاث مصفوفات أوزان متدربة. بحسب درجة التطابق بين query الـ token وkeys كل الـ tokens بالضرب النقطي، أقسم على √d_k، وبطبق softmax فتطلع أوزان مجموعها 1، وبعدين الناتج الجديد للـ token هو مجموع الـ values بالأوزان دي. فكل token بيجمع معلومات من اللي مهم له من التسلسل كله، والحساب كله مصفوفات (Q Kᵀ) فبيتوازى." },
      ],
    },
    {
      kicker: "الترتيب والـ heads",
      title: "Positional encoding و multi-head attention",
      en: "Positional encoding and multi-head attention",
      body: "<p><b>مشكلة:</b> الـ self-attention مبيعرفش الترتيب. لو غيّرت ترتيب الـ tokens، النتيجة نفس الصفوف بنفس الترتيب الجديد بالظبط (permutation equivariant). يعني «الكلب عض الراجل» و«الراجل عض الكلب» نفس الحاجة بالنسبة له. الحل: <b>positional encoding</b> يتجمع على الـ embedding قبل أول طبقة ويدّي كل موضع بصمة مختلفة. الورقة الأصلية استخدمت دوال sin وcos بترددات مختلفة، والموديلات الحديثة كتير منها بيتعلم الموضع أو بيستخدم طرق تانية، لكن لازم يدخل الترتيب بطريقة ما.</p>",
      code: {
        lang: "python",
        title: "الـ positional encoding الأصلي (sinusoidal) و permutation test",
        src: `import numpy as np

def pos_encoding(n, d):
    P = np.zeros((n, d))
    pos = np.arange(n)[:, None]
    i = np.arange(0, d, 2)[None, :]
    angle = pos / 10000 ** (i / d)
    P[:, 0::2] = np.sin(angle)
    P[:, 1::2] = np.cos(angle)
    return P

print(pos_encoding(4, 4).round(3).tolist())
# [[0.0, 1.0, 0.0, 1.0],
#  [0.841, 0.54, 0.01, 1.0],
#  [0.909, -0.416, 0.02, 1.0],
#  [0.141, -0.99, 0.03, 1.0]]

# self-attention without positions: reorder tokens -> same reordered output
def softmax(s):
    e = np.exp(s - s.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

X = np.array([[1, 0, 1, 0], [0, 1, 0, 1], [1, 1, 0, 0]], dtype=float)
Wq = np.array([[1, 0], [0, 1], [1, 0], [0, 1]], dtype=float)
Wk = np.array([[0, 1], [1, 0], [0, 1], [1, 0]], dtype=float)
Wv = np.array([[1, 2], [0, 1], [1, 0], [2, 1]], dtype=float)

def self_att(X):
    Q, K, V = X @ Wq, X @ Wk, X @ Wv
    return softmax(Q @ K.T / np.sqrt(2)) @ V

perm = [2, 0, 1]
print(np.allclose(self_att(X[perm]), self_att(X)[perm]))   # True`,
        note: "الصف الأول (الموضع 0) دايما <code>[0, 1, 0, 1]</code>، وكل موضع له نمط مختلف، فالموديل يقدر يميّز «مين قبل مين». التجربة الأخيرة بتثبت إن من غير positional encoding إعادة ترتيب الـ tokens مجرد بتعيد ترتيب الناتج.",
      },
      points: [
        "<b>Multi-head attention</b>: بدل attention واحد، بنقسم الأبعاد على <code>h</code> رؤوس (heads)، كل رأس بمصفوفات Wq/Wk/Wv خاصة بيه وبيعمل attention لوحده على بُعد أصغر (<code>d_k = d_model / h</code>)، وبعدين بنلزق النتايج ونضربها في مصفوفة <code>Wo</code>.",
        "<b>ليه كذا رأس؟</b> رأس واحد بيطلع نمط اهتمام واحد لكل token (وزن واحد لكل موضع). عدة رؤوس تقدر تبص على علاقات مختلفة في نفس الوقت (مثلا رأس للكلمة السابقة ورأس للفعل المرتبط بالفاعل). ده شرح حدسي؛ في الواقع الرؤوس بتتخصص بدرجات مختلفة وبعضها مش واضح الدور.",
        "الورقة الأصلية (النسخة الأساسية): <code>d_model = 512</code> و<code>8 heads</code>، يعني <code>d_k = 64</code> لكل رأس. تكلفة الحساب شبه نفس رأس واحد كبير، لأن كل رأس بُعده أصغر.",
      ],
      interview: [
        { q: "ليه الـ Transformer محتاج positional encoding؟", a: "لأن الـ attention بيتعامل مع الـ tokens كمجموعة: لو بدّلت ترتيبهم الناتج بيتبدل بنفس الترتيب بس، يعني مفيش إحساس بالموضع. فبنضيف للـ embedding متجه بيمثل الموضع (sin/cos في الورقة الأصلية، أو أوزان متعلمة)، فيعرف الموديل إن الكلمة دي في الموضع كذا ومين قبلها ومين بعدها." },
        { q: "ليه multi-head attention بدل attention واحد؟", a: "رأس واحد بيطلع توزيع اهتمام واحد لكل token، فلو عايز تبص على أكتر من علاقة (قريب، بعيد، نحوي، معنوي) هتتلخبط. الرؤوس المتعددة كل واحد بيشتغل على جزء من الأبعاد بمصفوفات مختلفة فتقدر تتعلم أنماط اهتمام مختلفة بالتوازي، وبعدين النتايج بتتجمع وتتضرب في Wo. تكلفتها قريبة من رأس واحد بنفس الإجمالي." },
      ],
    },
    {
      kicker: "الوحدة المتكررة",
      title: "الـ Transformer block: attention + residual + layer norm + feed-forward",
      en: "The transformer block",
      body: "<p>الـ Transformer هو نفس الـ block متكرر عدة مرات (6 في النسخة الأصلية). الـ block فيه جزئين، وكل جزء ملفوف بـ <b>residual connection</b> (نجمع المدخل على الناتج: <code>x + f(x)</code>) وبعده <b>layer norm</b> (m8):</p>",
      code: {
        lang: "text",
        src: `x                                  # (n, d_model)
a  = MultiHeadAttention(x)         # tokens exchange information
x1 = LayerNorm(x + a)              # residual + normalise
f  = FeedForward(x1)               # applied to every token on its own:
                                   #   relu(x1 W1 + b1) W2 + b2
x2 = LayerNorm(x1 + f)             # residual + normalise
output: (n, d_model)  -> same shape, so blocks can be stacked`,
        note: "الـ feed-forward network (FFN) هي شبكة من طبقتين بتتطبق على كل token لوحده، وعادة بتوسع البُعد (مثلا 4 أضعاف) وترجعه. الـ attention هو اللي بيخلط معلومات بين المواضع، والـ FFN هي اللي بتعالج كل موضع. بعض الموديلات الحديثة بتحط الـ layer norm قبل كل جزء بدل بعده (pre-norm) لتدريب أثبت، والفكرة الباقية نفسها.",
      },
      codes: [
        {
          lang: "python",
          title: "block كامل بـ NumPy (2 heads، d_model = 8)",
          src: `import numpy as np

def softmax(s):
    e = np.exp(s - s.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

def layernorm(x, eps=1e-5):
    return (x - x.mean(-1, keepdims=True)) / np.sqrt(
        x.var(-1, keepdims=True) + eps)

def mha(X, Wq, Wk, Wv, Wo, h):
    n, d = X.shape
    dk = d // h
    split = lambda M: (X @ M).reshape(n, h, dk).transpose(1, 0, 2)
    Q, K, V = split(Wq), split(Wk), split(Wv)        # (h, n, dk)
    A = softmax(Q @ K.transpose(0, 2, 1) / np.sqrt(dk))   # (h, n, n)
    O = (A @ V).transpose(1, 0, 2).reshape(n, d)     # concat heads
    return O @ Wo, A

rng = np.random.default_rng(0)
n, d, h, dff = 5, 8, 2, 16
X = rng.normal(size=(n, d))
Wq, Wk, Wv, Wo = [rng.normal(0, 0.3, (d, d)) for _ in range(4)]
W1 = rng.normal(0, 0.3, (d, dff))
W2 = rng.normal(0, 0.3, (dff, d))

att, A = mha(X, Wq, Wk, Wv, Wo, h)
x1 = layernorm(X + att)
x2 = layernorm(x1 + np.maximum(0, x1 @ W1) @ W2)
print(att.shape, A.shape, x2.shape)    # (5, 8) (2, 5, 5) (5, 8)
print(round(float(A.sum(axis=-1).min()), 3))   # 1.0, rows sum to 1
print(4 * d * d + d * dff + dff * d)   # 512 weights (no biases)`,
          note: "الأشكال (5, 8) داخل وخارج: ده اللي بيخلي تكديس الـ blocks ممكن. الـ <code>A</code> فيها خريطة attention لكل رأس (2 × 5 × 5). الـ residual بيخلي الـ gradient يعدي مباشرة للخلف فيساعد في تدريب شبكات عميقة (مشكلة vanishing في m8).",
        },
      ],
      interview: [
        { q: "إيه مكونات الـ Transformer block ولكل واحد وظيفة إيه؟", a: "multi-head self-attention بيخلط المعلومات بين المواضع. feed-forward network بتعالج كل موضع لوحده وتزود القدرة الحسابية. residual connection (x + f(x)) بيسهّل مرور الـ gradient ويخلي تدريب شبكة عميقة ممكن. layer norm بيثبّت حجم القيم. وكلهم بيحافظوا على نفس الشكل (n, d_model) فنقدر نكدس بلوكات كتير." },
      ],
    },
    {
      kicker: "العائلات",
      title: "Encoder و decoder والـ causal mask",
      en: "Encoder, decoder, encoder-decoder and the causal mask",
      body: "<p>الورقة الأصلية بنت نموذج ترجمة من جزئين: <b>encoder</b> بيقرا الجملة المصدر، و<b>decoder</b> بيولّد الترجمة كلمة كلمة. من الفكرة دي طلعت ثلاث عائلات:</p>",
      points: [
        "<b>Encoder فقط</b> (زي عائلة BERT): كل token بيشوف اليمين والشمال (bidirectional). مناسب لفهم النص: تصنيف، استخراج معلومات، embeddings للجمل. مش بيولّد نص حر بالشكل المعتاد.",
        "<b>Decoder فقط</b> (زي عائلة GPT، ومعظم الـ LLMs اليوم): كل token بيشوف اللي قبله بس، والموديل بيتدرب على توقع الـ token التالي ويولّد نص. هي اللي هنكمل بيها في m10.",
        "<b>Encoder-decoder</b> (زي الترجمة في الورقة الأصلية، وعائلة T5): الـ encoder بيفهم المدخل، والـ decoder بيولّد المخرج وهو بيبص على مخرجات الـ encoder بـ <b>cross-attention</b> (الـ queries من الـ decoder والـ keys/values من الـ encoder). مناسب للترجمة والتلخيص.",
        "<b>الـ causal mask</b>: في الـ decoder، لازم token رقم <code>i</code> ميشوفش tokens بعده (وإلا هيغش في توقع التالي). بنحط <code>-∞</code> في الدرجات اللي فوق القطر قبل الـ softmax، فوزنها يبقى صفر.",
      ],
      code: {
        lang: "python",
        title: "الـ causal mask على مثال الـ 3 tokens",
        src: `import numpy as np

def softmax(s):
    e = np.exp(s - s.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

X = np.array([[1, 0, 1, 0], [0, 1, 0, 1], [1, 1, 0, 0]], dtype=float)
Wq = np.array([[1, 0], [0, 1], [1, 0], [0, 1]], dtype=float)
Wk = np.array([[0, 1], [1, 0], [0, 1], [1, 0]], dtype=float)
Wv = np.array([[1, 2], [0, 1], [1, 0], [2, 1]], dtype=float)
Q, K, V = X @ Wq, X @ Wk, X @ Wv

S = Q @ K.T / np.sqrt(2)
mask = np.triu(np.ones((3, 3)), 1).astype(bool)   # True above the diagonal
W = softmax(np.where(mask, -np.inf, S))
print(W.round(3).tolist())
# [[1.0, 0.0, 0.0], [0.944, 0.056, 0.0], [0.333, 0.333, 0.333]]
print((W @ V).round(3).tolist())
# [[2.0, 2.0], [2.0, 2.0], [1.667, 2.333]]`,
        note: "الـ token الأول مش بيشوف غير نفسه (وزن 1.0)، والتاني بيشوف الأول والتاني، والتالت بيشوف التلاتة. الأوزان فوق القطر صفر بالظبط. وفي التدريب ده بيسمح بحساب توقع كل المواضع في مرور واحد بالتوازي من غير غش.",
      },
      pitfall: "الخلط بين «الـ decoder بيولّد نص» و«الـ encoder مفيد»: الاتنين مجرد طريقة وصول (mask). decoder-only بقى الاختيار الشائع للـ LLMs، لكن encoder (زي BERT-style) لسه ممتاز لتصنيف وبحث وفهم.",
      interview: [
        { q: "الفرق بين encoder و decoder في الـ Transformer، ومعنى causal mask؟", a: "الـ encoder بيخلي كل token يبص على كل التسلسل (يمين وشمال) فبيعطي تمثيلات غنية للفهم، وعائلة BERT encoder فقط. الـ decoder بيولّد خطوة خطوة فبنحط causal mask: بنحط -∞ للدرجات اللي بتبص على tokens مستقبلية قبل الـ softmax فأوزانها صفر. عائلة GPT decoder فقط. وفي الترجمة encoder-decoder فالـ decoder بيبص على الـ encoder بـ cross-attention." },
      ],
    },
    {
      kicker: "الخلاصة",
      title: "ليه الـ Transformers بتكبر (scale)، وإيه تمنها",
      en: "Why transformers scale",
      body: "<p>أسباب إن الـ Transformer بقى أساس الـ LLMs:</p>",
      points: [
        "<b>التوازي</b>: كل المواضع بتتحسب في نفس الوقت بضرب مصفوفات، وده بيناسب GPU اللي بتحسب آلاف العمليات المستقلة (m8). RNN كان لازم ينتظر كل خطوة.",
        "<b>مسار قصير بين أي موضعين</b>: أي token بيوصل لأي token في طبقة attention واحدة، فمشكلة المعلومات البعيدة أخف.",
        "<b>تكرار بلوك بسيط</b>: زيادة الحجم (طبقات أكتر، أبعاد أكبر) سهلة لأن البلوك نفسه بيحافظ على الشكل. الأبحاث بعد كده لاحظت إن الأداء بيتحسن بشكل منتظم مع زيادة الحجم والبيانات والحساب (من غير ما نحط هنا أرقام).",
        "<b>تمنه</b>: تكلفة الـ attention بتزيد مع <b>مربع</b> طول التسلسل (مصفوفة n × n)، فالسياق الطويل غالي في الذاكرة والوقت. وكمان محتاج بيانات وحسابات كتير، وبيحتاج positional information علشان يعرف الترتيب.",
      ],
      pitfall: "اعتبار الـ attention weights «تفسير» كامل لقرار الموديل. هي معلومة مفيدة للنظر لكن مش دليل قاطع على سبب القرار؛ الأبحاث مختلفة في ده.",
      interview: [
        { q: "ليه الـ Transformers اتفوقت على الـ RNNs وبقت أساس الـ LLMs؟", a: "لأن الـ attention بيتحسب كله بضرب مصفوفات بالتوازي فبيستغل GPU وبيتدرب على بيانات أكبر بكتير في وقت معقول، بينما RNN تسلسلي. كمان أي موضعين متصلين مباشرة فالاعتماديات البعيدة أسهل. والبلوك المتكرر بيسهّل تكبير الموديل. التمن إن الـ attention تكلفته تربيعية في طول التسلسل." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: softmax و cosine",
      lang: "python",
      code: `import numpy as np

def softmax(s):
    e = np.exp(s - s.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

def cosine(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

print(softmax(np.array([2.0, 1.0, 0.1])).round(3))
print(round(cosine(np.array([1, 0]), np.array([1, 1])), 3))`,
      note: "الناتج: <code>[0.659 0.242 0.099]</code> ثم <code>0.707</code>.",
    },
    {
      title: "اكتب: scaled dot-product attention",
      lang: "python",
      code: `import numpy as np

def softmax(s):
    e = np.exp(s - s.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

def attention(Q, K, V):
    d = K.shape[-1]
    scores = Q @ K.T / np.sqrt(d)
    return softmax(scores) @ V

Q = np.array([[1.0, 0.0]])
K = np.array([[1.0, 0.0], [0.0, 1.0], [0.5, 0.5]])
V = np.array([[1.0, 2.0], [3.0, 4.0], [7.0, 8.0]])
print(attention(Q, K, V).round(3))`,
      note: "الناتج: <code>[[3.368 4.368]]</code>. الشكل: (1, 2) @ (2, 3) ثم (1, 3) @ (3, 2).",
    },
    {
      title: "اكتب: causal mask",
      lang: "python",
      code: `import numpy as np

def softmax(s):
    e = np.exp(s - s.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

scores = np.zeros((4, 4))
mask = np.triu(np.ones((4, 4)), 1).astype(bool)
scores[mask] = -np.inf
W = softmax(scores)
print(W.round(3))
print(W.sum(axis=1))`,
      note: "الصف <code>i</code> فيه أوزان متساوية على الأعمدة 0..i وصفر بعد كده، يعني <code>1/(i+1)</code> للعناصر المسموحة.",
    },
  ],

  tasks: [
    {
      title: "cosine similarity",
      lang: "python",
      prompt: "<p>اكتب <code>cosine(a, b)</code> بترجع الـ cosine similarity بين متجهين (قوائم أرقام) مقرّبة لـ 3 أرقام عشرية. لو أحد المتجهين كله أصفار رجّع <code>0.0</code>.</p>",
      examples: [
        { in: "cosine([1, 1, 0, 0], [1, 0, 1, 0])", out: "0.5" },
        { in: "cosine([1, 2, 3], [2, 4, 6])", out: "1.0" },
        { in: "cosine([0, 0], [1, 1])", out: "0.0" },
      ],
      hints: [
        "الصيغة: <code>a·b / (|a| × |b|)</code>. <code>np.dot</code> و<code>np.linalg.norm</code>.",
        "افحص الطول صفر قبل القسمة.",
      ],
      solution: `import numpy as np

def cosine(a, b):
    a = np.asarray(a, dtype=float)
    b = np.asarray(b, dtype=float)
    na, nb = np.linalg.norm(a), np.linalg.norm(b)
    if na == 0 or nb == 0:
        return 0.0
    return round(float(a @ b / (na * nb)), 3)

print(cosine([1, 1, 0, 0], [1, 0, 1, 0]))   # 0.5
print(cosine([1, 2, 3], [2, 4, 6]))         # 1.0
print(cosine([0, 0], [1, 1]))               # 0.0`,
      explain: "[1,2,3] و[2,4,6] في نفس الاتجاه بالظبط، فـ cosine = 1 رغم اختلاف الطول، وده الفرق عن المسافة الإقليدية. الحماية من القسمة على صفر مهمة لأن متجه كله أصفار ملوش اتجاه.",
    },
    {
      title: "scaled dot-product attention مع mask اختياري",
      lang: "python",
      prompt: "<p>اكتب <code>attention(Q, K, V, causal=False)</code> بتاخد مصفوفات <code>Q</code> <code>(n, d)</code> و<code>K</code> <code>(m, d)</code> و<code>V</code> <code>(m, dv)</code>، وترجع <code>(output, weights)</code> كمصفوفات NumPy. الدرجات = <code>Q Kᵀ / √d</code> ثم softmax على كل صف. لو <code>causal=True</code> (وn = m) امنع كل token من رؤية اللي بعده بوضع <code>-inf</code> فوق القطر قبل الـ softmax.</p>",
      examples: [
        { in: "Q=[[1,0]]; K=[[1,0],[0,1],[0.5,0.5]]; V=[[1,2],[3,4],[7,8]]\nout, w = attention(Q, K, V)\nout.round(3), w.round(3)", out: "[[3.368 4.368]]  [[0.456 0.225 0.32 ]]" },
        { in: "# 3 identical tokens with causal=True\nones = np.ones((3, 2))\nattention(ones, ones, ones, True)[1].round(3)", out: "[[1. 0. 0.] [0.5 0.5 0.] [0.333 0.333 0.333]]" },
      ],
      hints: [
        "<code>scores = Q @ K.T / np.sqrt(Q.shape[-1])</code>.",
        "الـ mask: <code>np.triu(np.ones(scores.shape), 1).astype(bool)</code> ثم <code>scores[mask] = -np.inf</code>.",
        "softmax ثابت رقميا: اطرح أكبر قيمة في الصف قبل <code>np.exp</code>. <code>-inf</code> بتدّي <code>exp = 0</code> من غير مشاكل.",
      ],
      solution: `import numpy as np

def attention(Q, K, V, causal=False):
    Q, K, V = (np.asarray(a, dtype=float) for a in (Q, K, V))
    scores = Q @ K.T / np.sqrt(Q.shape[-1])
    if causal:
        mask = np.triu(np.ones(scores.shape), 1).astype(bool)
        scores = np.where(mask, -np.inf, scores)
    e = np.exp(scores - scores.max(axis=-1, keepdims=True))
    w = e / e.sum(axis=-1, keepdims=True)
    return w @ V, w

out, w = attention([[1, 0]], [[1, 0], [0, 1], [0.5, 0.5]],
                   [[1, 2], [3, 4], [7, 8]])
print(out.round(3), w.round(3))
ones = np.ones((3, 2))
print(attention(ones, ones, ones, True)[1].round(3))`,
      explain: "الـ <code>np.ones</code> بتدّي 3 tokens متطابقين، فالدرجات متساوية في المواضع المسموحة، والـ causal بيطلع <code>1/(i+1)</code> في الصف i. بنطرح الـ max قبل الأس للثبات الرقمي، و<code>-inf</code> بتتحول لصفر بعد الأس. التعقيد: O(n·m·d) للدرجات، والذاكرة O(n·m) وده سبب مشكلة السياق الطويل.",
    },
    {
      title: "sinusoidal positional encoding",
      lang: "python",
      prompt: "<p>اكتب <code>pos_encoding(n, d)</code> (d زوجي) بترجع مصفوفة <code>(n, d)</code> حيث <code>PE[pos, 2i] = sin(pos / 10000^(2i/d))</code> و<code>PE[pos, 2i+1] = cos(pos / 10000^(2i/d))</code>. جرّب الإخراج بتقريب 3 أرقام.</p>",
      examples: [
        { in: "pos_encoding(2, 4).round(3).tolist()", out: "[[0.0, 1.0, 0.0, 1.0], [0.841, 0.54, 0.01, 1.0]]" },
      ],
      hints: [
        "<code>pos = np.arange(n)[:, None]</code> و<code>i2 = np.arange(0, d, 2)[None, :]</code> (قيم 2i).",
        "<code>angle = pos / 10000 ** (i2 / d)</code> وتتملى الأعمدة الزوجية <code>P[:, 0::2]</code> بـ sin والفردية <code>P[:, 1::2]</code> بـ cos.",
      ],
      solution: `import numpy as np

def pos_encoding(n, d):
    P = np.zeros((n, d))
    pos = np.arange(n)[:, None]
    i2 = np.arange(0, d, 2)[None, :]
    angle = pos / 10000 ** (i2 / d)
    P[:, 0::2] = np.sin(angle)
    P[:, 1::2] = np.cos(angle)
    return P

print(pos_encoding(2, 4).round(3).tolist())
# [[0.0, 1.0, 0.0, 1.0], [0.841, 0.54, 0.01, 1.0]]`,
      explain: "الموضع 0 بيطلع [0, 1, 0, 1] دايما (sin(0) = 0 وcos(0) = 1). الأبعاد الأولى بترددات سريعة (بتتغير بسرعة مع الموضع) والأخيرة بطيئة، فكل موضع له بصمة مميزة. بيتجمع على الـ embedding مش بيتضرب فيه.",
    },
  ],

  quiz: [
    {
      q: "cosine similarity بين <code>(1, 0)</code> و <code>(1, 1)</code>؟ (قرّب لـ 3 أرقام)",
      answer: ["0.707", "0.71", "1/sqrt(2)"],
      why: "الضرب النقطي = 1، والأطوال 1 و√2، فالناتج 1/√2 = 0.707.",
    },
    {
      q: "أنهي مشكلة في الـ RNN حلها الـ attention؟",
      options: [
        "كل خطوة محتاجة نتيجة اللي قبلها فمش بتتوازى، والمعلومات البعيدة بتتخفف",
        "الـ RNN مش بيستخدم أوزان",
        "الـ RNN بيدعم جمل قصيرة فقط لأن الـ embedding ثابت",
        "الـ RNN مبيحتاش GPU",
      ],
      answer: 0,
      why: "عيب الـ RNN الأساسي التسلسلية (مفيش توازي) وصعوبة الاعتماديات البعيدة. الـ attention بيوصل أي موضعين مباشرة وبيتحسب بالتوازي.",
    },
    {
      q: "في attention: ثلاث scores بعد القسمة على √d كلهم متساويين. كام وزن كل واحد بعد الـ softmax؟ (قرّب لـ 3 أرقام)",
      answer: ["0.333", "0.33", "1/3"],
      why: "softmax على قيم متساوية بيدّي توزيع متساوي: 1/3 لكل واحد، لأن الأس بيطلع نفس القيمة وبنقسم على مجموعهم.",
    },
    {
      q: "ليه بنقسم الدرجات على √d_k قبل الـ softmax؟",
      options: [
        "علشان نخلي الأوزان تجمع صفر",
        "علشان نوفر ذاكرة",
        "علشان الـ softmax يطلع أعداد صحيحة",
        "علشان الضرب النقطي بيكبر مع d فيدخل الـ softmax في منطقة مشبعة بـ gradient ضعيف",
      ],
      answer: 3,
      why: "تباين الضرب النقطي يزيد مع d (انحراف حوالي 8 لما d=64). القيم الكبيرة بتخلي الـ softmax شبه one-hot والـ gradient بيتلاشى. القسمة بترجع التباين لـ 1 تقريبا.",
    },
    {
      q: "من غير positional encoding، لو بدّلت ترتيب الـ tokens في الجملة، إيه اللي بيحصل لناتج self-attention؟",
      options: [
        "النتيجة تتغير تماما وبشكل غير متوقع",
        "نفس الناتج لكن الصفوف بنفس الترتيب الجديد، يعني الموديل مبيحسش بالترتيب",
        "بيطلع error",
        "الأوزان بتبقى كلها صفر",
      ],
      answer: 1,
      why: "self-attention permutation equivariant: إعادة الترتيب بتعيد ترتيب الصفوف بس. ومن هنا الحاجة لـ positional encoding. تجربتنا بـ allclose أثبتت ده.",
    },
    {
      q: "<code>d_model = 512</code> و <code>8 heads</code>. كام <code>d_k</code> لكل رأس؟",
      answer: ["64"],
      why: "d_k = d_model ÷ h = 512 ÷ 8 = 64. الإجمالي بعد لصق الرؤوس يرجع 512.",
    },
    {
      q: "أنهي موديل أنسب لتصنيف مشاعر جملة (فهم نص مش توليد) بمعمارية encoder فقط؟",
      options: [
        "decoder فقط من عائلة GPT بالضرورة",
        "encoder فقط من عائلة BERT: كل token بيشوف السياق من الاتجاهين",
        "RNN فقط",
        "k-means",
      ],
      answer: 1,
      why: "الـ encoder bidirectional بيعطي تمثيلات غنية للفهم، فهو مناسب للتصنيف. الـ decoder ممكن برضه يتستخدم، لكن السؤال عن الأنسب بمعمارية encoder.",
    },
    {
      q: "الـ causal mask في decoder بيمنع إيه؟",
      options: [
        "الـ token من رؤية نفسه",
        "الـ token من رؤية الـ tokens اللي قبله",
        "الـ token من رؤية الـ tokens اللي بعده في التسلسل",
        "تعدد الرؤوس",
      ],
      answer: 2,
      why: "عشان وقت توقع الـ token التالي الموديل ميشوفش الإجابة (الـ tokens المستقبلية). بنحط -∞ فوق القطر فأوزانها صفر.",
    },
    {
      q: "<code>X</code> شكلها <code>(n, d)</code>. شكل مصفوفة أوزان الـ attention <code>softmax(Q Kᵀ / √d)</code> في self-attention؟",
      options: ["(n, d)", "(d, d)", "(n, n)", "(n, 1)"],
      answer: 2,
      why: "Q وK شكلهم (n, d_k)، فـ Q Kᵀ شكلها (n, n): وزن لكل زوج tokens. ودي سبب إن التكلفة تربيعية في طول التسلسل.",
    },
    {
      q: "أنهي واحد بيضمن إن الـ gradient يمشي بسهولة في Transformer عميق ويخلي الـ block يحافظ على الشكل؟",
      options: [
        "الـ residual connection (x + f(x)) مع layer norm",
        "الـ softmax",
        "الـ positional encoding",
        "الـ causal mask",
      ],
      answer: 0,
      why: "الـ residual بيدّي مسار مباشر للـ gradient، والـ layer norm بيثبّت القيم. الـ softmax والـ positional encoding والـ mask لهم وظايف تانية.",
    },
  ],
};
