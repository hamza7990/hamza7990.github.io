window.LEVELS = window.LEVELS || {};
window.LEVELS["ai/m7"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "الشبكة العصبية هي الانحدار اللوجستي مكرر ومتراكب",
      en: "From a linear model to a neural network",
      body: "<p>في m3 شفت إن الانحدار اللوجستي = معادلة خطية <code>z = w·x + b</code> + دالة <code>sigmoid</code>. ده بالظبط <b>neuron</b> واحد. الشبكة العصبية هي إنك تحط كذا neuron جنب بعض (<b>layer</b>)، وطبقة تدّي مدخلاتها لطبقة بعدها، وكل الأوزان بتتدرب مع بعض بـ gradient descent (نفس الفكرة في m3 بس على مستوى أكبر).</p><p>الفايدة: الموديل الخطي مبيعرفش غير خط مستقيم يفصل. الطبقات المتراكبة بتخلي الموديل يتعلم <b>features بنفسه</b> بدل ما إنت تصمّمها، وده السبب اللي خلى Deep Learning يكسب في الصور والصوت والنص. وكل حاجة هتشوفها بعد كده (CNN، Transformer، LLM) هي نفس المكونات دي بترتيب مختلف.</p>",
      points: [
        "في المستوى ده هنبني شبكة صغيرة بإيدينا بـ NumPy، من الـ forward pass لحد الـ backpropagation، ونحلّ بيها XOR.",
        "على بيانات جدولية صغيرة الأشجار (m5) غالبا بتكسب أو بتساوي، فالشبكات مش حل لكل مشكلة. بتتألق مع الصور والصوت والنص وبيانات كبيرة.",
      ],
      interview: [
        { q: "إيه علاقة الـ logistic regression بالـ neural network؟", a: "الـ neuron الواحد بـ sigmoid هو logistic regression: مجموع موزون للمدخلات زائد bias، وبعدين sigmoid. الشبكة هي طبقات من neurons، كل طبقة بتاخد مخرجات اللي قبلها كمدخلات. الفرق إن الطبقات المخفية بتتعلم features وسيطة بدل ما أصمّمها بإيدي، والتدريب بيتم بنفس gradient descent بس بالـ backpropagation عشان نحسب gradient كل الأوزان." },
      ],
    },
    {
      kicker: "الوحدة الأساسية",
      title: "الـ neuron: مجموع موزون ثم activation",
      en: "The neuron",
      body: "<p>الـ neuron بيعمل خطوتين: <b>1)</b> مجموع موزون <code>z = w1·x1 + w2·x2 + ... + b</code>. <b>2)</b> بيمرر <code>z</code> على <b>activation function</b> <code>f</code> ويطلع <code>a = f(z)</code>. الأوزان والـ bias هم الـ parameters اللي بتتدرب. الـ activation هي اللي بتدّي الشبكة قدرة تتعلم حاجة أكتر من خط مستقيم (الشريحة الجاية).</p>",
      code: {
        lang: "python",
        title: "neuron واحد بالأرقام",
        src: `import numpy as np

x = np.array([2.0, -1.0, 0.5])      # three inputs
w = np.array([0.4, 0.3, -0.2])      # one weight per input
b = 0.1

z = w @ x + b                       # 0.8 - 0.3 - 0.1 + 0.1
a = 1 / (1 + np.exp(-z))            # sigmoid activation
print(round(z, 2), round(a, 3))     # 0.5 0.622
print(np.maximum(0, z), np.tanh(z).round(3))   # 0.5 0.462`,
        note: "نفس <code>z</code> ممكن يعدي على activations مختلفة والناتج بيتغير: sigmoid طلّعت 0.622، وReLU تساوي 0.5، وtanh 0.462.",
      },
      terms: [
        ["activation function", "دالة التنشيط", "دالة غير خطية بتتطبق على مجموع الـ neuron."],
        ["layer", "طبقة", "مجموعة neurons بتشتغل على نفس المدخلات بالتوازي."],
        ["hidden layer", "طبقة مخفية", "أي طبقة بين المدخلات والمخرجات. مبنشوفش قيمها في البيانات، الشبكة بتتعلمها."],
      ],
    },
    {
      kicker: "ليه non-linear",
      title: "من غير activation غير خطية، الطبقات كلها بتنهار لطبقة واحدة",
      en: "Why a non-linear activation is needed",
      body: "<p>لو كل layer مجرد ضرب في مصفوفة وزيادة bias (من غير activation)، فطبقتين ورا بعض = <code>W2 (W1 x + b1) + b2 = (W2 W1) x + (W2 b1 + b2)</code>. ودي برضه معادلة خطية واحدة بمصفوفة جديدة <code>W2 W1</code>. يعني ميهمش عندك 2 ولا 200 طبقة: الشبكة كلها بتساوي موديل خطي واحد. الطبقات الإضافية بتضيف تعقيد في الحساب من غير قدرة جديدة.</p>",
      code: {
        lang: "python",
        title: "الانهيار بالأرقام، وبيانات دائرة",
        src: `import numpy as np
from sklearn.datasets import make_circles
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier

W1 = np.array([[1.0, 2.0], [3.0, -1.0]]); b1 = np.array([0.5, -1.0])
W2 = np.array([[2.0, 1.0]]);              b2 = np.array([0.1])
x = np.array([1.0, 2.0])
print(W2 @ (W1 @ x + b1) + b2)         # [11.1]  two layers
Wc, bc = W2 @ W1, W2 @ b1 + b2
print(Wc, bc, Wc @ x + bc)             # [[5. 3.]] [0.1] [11.1]  one layer

X, y = make_circles(400, noise=0.1, factor=0.4, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(
    X, y, test_size=0.3, random_state=0, stratify=y)
for act in ("identity", "relu", "tanh"):
    m = MLPClassifier((8, 8), activation=act, max_iter=3000,
                      random_state=0).fit(Xtr, ytr)
    print(act, round(m.score(Xte, yte), 3))
# identity 0.417   relu 1.0   tanh 1.0`,
        note: "الطبقتين اديونا 11.1 والطبقة المدموجة (<code>[[5, 3]]</code> و bias 0.1) برضه 11.1. وعلى دائرة جوه دائرة (مفيش خط يفصلهم) شبكة بـ activation <code>identity</code> (يعني من غير non-linearity) جابت 0.417 على 120 نقطة اختبار، بينما نفس الحجم بـ relu أو tanh جاب 1.0.",
      },
      focus: [{ label: "احفظها", text: "من غير non-linearity: عدد الطبقات ملوش تأثير، والشبكة كلها = موديل خطي واحد. الـ activation هي اللي بتدّي العمق معناه." }],
      interview: [
        { q: "ليه محتاجين activation function غير خطية؟", a: "لأن تركيب دوال خطية دايما دالة خطية: <code>W2(W1 x + b1) + b2 = (W2 W1) x + (W2 b1 + b2)</code>. فشبكة من 100 طبقة خطية بتساوي طبقة واحدة وبتعجز عن مشاكل زي XOR أو دايرة جوه دايرة. الـ activation غير الخطية بين الطبقات هي اللي بتخلي الشبكة تمثل دوال منحنية معقدة." },
      ],
    },
    {
      kicker: "الـ activations",
      title: "Sigmoid و tanh و ReLU: كل واحدة وقصتها",
      en: "Activation functions",
      code: {
        lang: "text",
        src: `z          -4      -1       0       1       4
sigmoid   0.018   0.269   0.500   0.731   0.982     range (0, 1)
tanh     -0.999  -0.762   0.000   0.762   0.999     range (-1, 1)
relu      0       0       0       1       4         max(0, z)

slope (derivative) at the same z:
sigmoid' = s*(1-s)   0.018   0.197   0.250   0.197   0.018
tanh'    = 1-t^2     0.001   0.420   1.000   0.420   0.001
relu'                0       0       --      1       1`,
        note: "الأرقام من تشغيل فعلي. أكبر ميل لـ sigmoid هو 0.25 (عند صفر)، ولـ tanh هو 1. وReLU ميلها 0 أو 1.",
      },
      points: [
        "<b>Sigmoid</b>: بتحول لاحتمال (0 إلى 1). كويسة في طبقة المخرجات لتصنيف ثنائي، وقليلة الاستخدام في الطبقات المخفية.",
        "<b>tanh</b>: شكلها زي sigmoid بس متمركزة حوالين الصفر (-1 إلى 1)، وأحسن منها غالبا في الطبقات المخفية القديمة.",
        "<b>ReLU</b> = <code>max(0, z)</code>: أبسط وأسرع، وميلها 1 لما z موجب، فهي الاختيار الافتراضي في أغلب الشبكات اليوم.",
        "<b>vanishing gradient</b>: في backprop الـ gradient بيتضرب في ميل كل activation على الطريق. مع sigmoid الميل أقصاه 0.25، فعشر طبقات = <code>0.25^10</code> وده حوالي <code>0.000001</code>. الطبقات الأولى بتتحدّث بخطوات تافهة وتفضل تقريبا زي ما هي. ReLU بتخفف المشكلة لأن ميلها 1 في الجزء الموجب.",
        "<b>dying ReLU</b>: لو <code>z</code> بقت سالبة لكل المدخلات (مثلا الـ bias اتحرك لقيمة سالبة كبيرة بعد تحديث بخطوة ضخمة)، ناتج الـ neuron صفر دايما وميله صفر، فمفيش gradient يرجّعه والـ neuron «مات». الوقاية: learning rate معقول، initialisation سليم، أو بدائل زي Leaky ReLU (ميل صغير للجزء السالب).",
      ],
      pitfall: "ReLU في طبقة المخرجات لتصنيف احتمالي، أو sigmoid في كل الطبقات المخفية في شبكة عميقة. المخرجات لازم تناسب نوع المشكلة: sigmoid لاحتمال واحد، softmax لعدة فئات، وبدون activation (خطي) لانحدار برقم حر.",
      interview: [
        { q: "إيه مشكلة vanishing gradient، وإزاي ReLU بتساعد؟", a: "في backpropagation الـ gradient لأي طبقة بيتضرب في مشتقات الـ activations اللي بعدها. مع sigmoid المشتقة أقصاها 0.25، فبعد طبقات كتير الناتج بيقرب لصفر والطبقات الأولى بتتعلم ببطء شديد أو بتقف. ReLU مشتقتها 1 لما المدخل موجب فالـ gradient بيعدي من غير ما يصغر، وكمان أسرع في الحساب. مشكلتها dying ReLU لو neuron بقى ناتجه صفر لكل المدخلات." },
      ],
    },
    {
      kicker: "الأشكال",
      title: "الطبقات والـ shapes والـ forward pass",
      en: "Layers, shapes and the forward pass",
      body: "<p>الـ <b>forward pass</b> هو تمرير المدخلات من أول الشبكة لآخرها لحساب التوقع. بنشتغل على <b>batch</b> كامل في مرة واحدة بضرب المصفوفات: لو عندك <code>n</code> عينة و<code>d</code> feature، <code>X</code> شكلها <code>(n, d)</code>. طبقة فيها <code>h</code> neuron أوزانها <code>W</code> شكلها <code>(d, h)</code> و<code>b</code> شكلها <code>(h,)</code>، والناتج <code>X @ W + b</code> بشكل <code>(n, h)</code>. أغلب أخطاء الشبكات هي أخطاء shapes، فتعوّد تكتب الأشكال في تعليق جنب كل سطر.</p>",
      code: {
        lang: "python",
        title: "forward pass لشبكة 3 → 4 → 2",
        src: `import numpy as np

rng = np.random.default_rng(0)
X = rng.normal(size=(5, 3))            # 5 samples, 3 features
W1 = rng.normal(size=(3, 4)); b1 = np.zeros(4)
W2 = rng.normal(size=(4, 2)); b2 = np.zeros(2)

H = np.maximum(0, X @ W1 + b1)         # (5, 3) @ (3, 4) -> (5, 4)
O = H @ W2 + b2                        # (5, 4) @ (4, 2) -> (5, 2)
print(X.shape, H.shape, O.shape)       # (5, 3) (5, 4) (5, 2)

n_params = W1.size + b1.size + W2.size + b2.size
print(n_params)                        # 3*4+4 + 4*2+2 = 26`,
        note: "عدد الـ parameters لكل طبقة = <code>inputs × outputs + outputs</code>. شبكة 784 → 128 → 10 (صور MNIST بحجم 28×28) فيها <code>784×128+128 + 128×10+10 = 101,770</code> parameter، مع إن الشبكة صغيرة بالمقاييس الحديثة.",
      },
      points: [
        "الـ batch dimension (<code>n</code>) بتفضل أول بُعد طول الطريق، والأوزان مش بتعتمد عليه.",
        "الـ bias بيتضاف لكل صف في الـ batch (broadcasting).",
        "لتصنيف متعدد الفئات الطبقة الأخيرة بتطلع درجة لكل فئة وبعدها softmax (m3).",
      ],
    },
    {
      kicker: "الـ loss",
      title: "الـ loss: الرقم اللي بنقلله",
      en: "Loss functions",
      body: "<p>الـ forward pass بيطلع توقع <code>p</code>. الـ <b>loss</b> رقم واحد بيقيس بعده عن الحقيقة <code>y</code>. التدريب كله هدفه تقليل الـ loss بتعديل الأوزان. اختيار الـ loss بيتحدد بنوع المشكلة (m3):</p>",
      code: {
        lang: "text",
        src: `regression:                MSE = mean( (p - y)^2 )
binary classification:     BCE = -mean( y*ln(p) + (1-y)*ln(1-p) )
multi-class:               cross-entropy on softmax outputs

useful fact: with sigmoid (or softmax) output + cross-entropy,
the gradient of the loss w.r.t. the output score z is just (p - y).

example: y = 1, p = 0.8   BCE = -ln(0.8) = 0.223   gradient = -0.2
         y = 1, p = 0.1   BCE = -ln(0.1) = 2.303   gradient = -0.9`,
        note: "الغلط الواثق بيتعاقب أكتر (2.303 مقابل 0.223) والـ gradient بيبقى أكبر، فالشبكة بتتصلح أسرع لما تكون غلطانة بشدة. النسخة البسيطة <code>(p - y)</code> هي سبب إن sigmoid + cross-entropy هي الكومبو المعتاد في التصنيف.",
      },
      pitfall: "استخدام MSE مع sigmoid لتصنيف: الـ gradient بيضعف لما الموديل يكون غلطان بثقة (لأن مشتقة sigmoid قريبة من صفر هناك). cross-entropy بتلغي المشتقة دي من الحساب.",
    },
    {
      kicker: "الرياضة اللي تهم",
      title: "Backpropagation: قاعدة السلسلة على شبكة صغيرة بأرقام حقيقية",
      en: "Backpropagation as the chain rule",
      body: "<p>الـ backprop مش سحر: هو <b>قاعدة السلسلة</b> (chain rule) من الآخر للأول بنخزن فيها قيم الـ forward عشان منعيد حسابها. لو <code>L</code> بتعتمد على <code>p</code> وهي بتعتمد على <code>z2</code> وهي بتعتمد على <code>W2</code>، فـ <code>dL/dW2 = dL/dp × dp/dz2 × dz2/dW2</code>. نمشي على شبكة 2 → 2 → 1 (sigmoid في الطبقتين) وعينة واحدة، و<code>L = 0.5 × (p - y)^2</code>:</p>",
      code: {
        lang: "text",
        src: `x = (1.0, 0.5)   y = 1
W1 = [[0.1, 0.4], [-0.3, 0.2]]  b1 = (0, 0.1)   (a row per hidden unit)
W2 = (0.5, -0.6)                b2 = 0.2

FORWARD
z1 = W1 x + b1       = (0.3, -0.1)
h  = sigmoid(z1)     = (0.5744, 0.4750)
z2 = W2 . h + b2     = 0.2022
p  = sigmoid(z2)     = 0.5504
L  = 0.5*(p-y)^2     = 0.1011

BACKWARD (each line is one link of the chain)
dL/dp   = p - y                    = -0.4496
dL/dz2  = dL/dp * p*(1-p)          = -0.4496 * 0.2475 = -0.1113
dL/dW2  = dL/dz2 * h               = (-0.0639, -0.0529)
dL/db2  = dL/dz2                   = -0.1113
dL/dh   = dL/dz2 * W2              = (-0.0556,  0.0668)
dL/dz1  = dL/dh * h*(1-h)          = (-0.0136,  0.0167)
dL/dW1  = dL/dz1 (outer) x         = [[-0.0136, -0.0068],
                                      [ 0.0167,  0.0083]]
dL/db1  = dL/dz1                   = (-0.0136,  0.0167)

UPDATE with lr = 0.5:  W2 = W2 - 0.5*dL/dW2 = (0.5320, -0.5736)
new loss = 0.0912       (was 0.1011)`,
        note: "كل الأرقام من تشغيل فعلي بالكود اللي بعده، وقارناها بـ <b>numerical gradient</b> (نزوّد الوزن بـ 0.000001 ونشوف الـ loss اتغير قد إيه): <code>dL/dW1[0,1]</code> طلع -0.006800 و<code>dL/dW2[1]</code> طلع -0.052853، يطابقوا حساب السلسلة.",
      },
      codes: [
        {
          lang: "python",
          title: "نفس الحسبة + gradient check",
          src: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

x = np.array([1.0, 0.5]); y = 1.0
W1 = np.array([[0.1, 0.4], [-0.3, 0.2]]); b1 = np.array([0.0, 0.1])
W2 = np.array([0.5, -0.6]); b2 = 0.2

def loss(W1, b1, W2, b2):
    p = sigmoid(W2 @ sigmoid(W1 @ x + b1) + b2)
    return 0.5 * (p - y) ** 2

h = sigmoid(W1 @ x + b1)
p = sigmoid(W2 @ h + b2)
dz2 = (p - y) * p * (1 - p)
dW2 = dz2 * h
dz1 = dz2 * W2 * h * (1 - h)
dW1 = np.outer(dz1, x)
print(round(p, 4), dW2.round(4), dW1[0].round(4))
# 0.5504 [-0.0639 -0.0529] [-0.0136 -0.0068]

eps = 1e-6
W1p = W1.copy(); W1p[0, 1] += eps
print(round((loss(W1p, b1, W2, b2) - loss(W1, b1, W2, b2)) / eps, 5))
# -0.0068   (matches dW1[0, 1])`,
          note: "الـ gradient check بتستخدمه كل ما تكتب backprop بإيدك: لو الرقم التقريبي مش قريب من التحليلي، في bug.",
        },
      ],
      interview: [
        { q: "اشرح backpropagation.", a: "هو الطريقة اللي بنحسب بيها gradient الـ loss بالنسبة لكل وزن في الشبكة. بنعمل forward pass ونخزن القيم الوسيطة، وبعدين نمشي من الآخر للأول بقاعدة السلسلة: gradient أي طبقة = gradient اللي بعدها × مشتقة الـ activation × مدخلات الطبقة. وبعدين gradient descent بيحدّث كل وزن بـ <code>w = w - lr × grad</code>. الحساب بيتم في مرور واحد للخلف بتكلفة قريبة من تكلفة الـ forward." },
      ],
    },
    {
      kicker: "الكود",
      title: "تدريب شبكة من الصفر بـ NumPy: XOR",
      en: "Training a network from scratch on XOR",
      body: "<p>XOR: المخرج 1 لو المدخلين مختلفين. أشهر مثال لشيء <b>الموديل الخطي مش قادر عليه</b> (مفيش خط مستقيم يفصل الأربع نقط). هندرب شبكة 2 → 4 → 1: طبقة مخفية 4 neurons بـ tanh، ومخرج sigmoid، و loss = BCE، وgradient descent على الأربع عينات كلهم. الـ gradient هو نفس سلسلة الشريحة اللي فاتت، متجمعة في matrices.</p>",
      code: {
        lang: "python",
        title: "xor_from_scratch.py",
        src: `import numpy as np

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y = np.array([[0], [1], [1], [0]], dtype=float)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def train(seed, epochs=2000, lr=0.5):
    rng = np.random.default_rng(seed)
    W1 = rng.normal(0, 1, (2, 4)); b1 = np.zeros(4)
    W2 = rng.normal(0, 1, (4, 1)); b2 = np.zeros(1)
    for epoch in range(epochs + 1):
        h = np.tanh(X @ W1 + b1)                 # (4, 4)
        p = sigmoid(h @ W2 + b2)                 # (4, 1)
        loss = -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))
        dz2 = (p - y) / len(X)                   # BCE + sigmoid
        dW2 = h.T @ dz2
        db2 = dz2.sum(axis=0)
        dz1 = (dz2 @ W2.T) * (1 - h ** 2)        # tanh' = 1 - h^2
        dW1 = X.T @ dz1
        db1 = dz1.sum(axis=0)
        W1 -= lr * dW1; b1 -= lr * db1
        W2 -= lr * dW2; b2 -= lr * db2
    return loss, p.ravel(), h

loss, p, h = train(seed=1)
print(round(loss, 4), p.round(3))
# 0.0024 [0.    0.997 0.997 0.004]
print(sum(a.size for a in (np.zeros((2, 4)), np.zeros(4),
                           np.zeros((4, 1)), np.zeros(1))))   # 17

for seed in (0, 1, 2):
    loss, p, _ = train(seed)
    print(seed, round(loss, 4), (p > 0.5).astype(int))
# 0 0.3487 [0 0 1 1]    stuck: 3 of 4 right
# 1 0.0024 [0 1 1 0]
# 2 0.0015 [0 1 1 0]`,
        note: "بعد 2000 خطوة الـ loss نزل من 0.67 (أول خطوة) لـ 0.0024 والتوقعات [0, 1, 1, 0] تقريبا بالظبط. لاحظ <code>seed=0</code>: نفس الكود بوزن ابتدائي مختلف وقف عند loss 0.3487 بتوقع غلط في عينة. ده سلوك طبيعي: الـ loss مش محدبة والنتيجة تتأثر بالـ initialisation، فبنجرب كذا seed أو شبكة أعرض.",
      },
      points: [
        "قسمة <code>(p - y) / len(X)</code> علشان الـ loss المتوسط. من غيرها الـ gradient بيكبر مع حجم الـ batch ويحتاج lr أصغر.",
        "مع 8 neurons بدل 4، الأربع seeds الأولى كلهم وصلوا (loss بين 0.0013 و0.0016)، يعني الشبكة الأعرض أقل حساسية للبداية.",
        "الـ parameters: <code>2×4 + 4 + 4×1 + 1 = 17</code>.",
      ],
      pitfall: "نسيان إن <code>dz1</code> لازم يتحسب بـ <code>W2</code> القديمة قبل تحديثها. لو حدّثت <code>W2</code> الأول وبعدين حسبت <code>dz1</code> بالقيمة الجديدة، الـ gradient هيبقى غلط شوية ومش هتلاحظ إلا من gradient check.",
    },
    {
      kicker: "الفهم",
      title: "إيه اللي اتعلمته الشبكة؟ وتقدر تعمل إيه أصلا (universal approximation)",
      en: "What the network learned, and universal approximation",
      body: "<p>بنبص جوه الطبقة المخفية بعد التدريب (seed 1). كل neuron بيرسم <b>خط واحد</b> في مستوى المدخلات ويقسمه نصين، والطبقة التانية بتجمع النتايج. الـ activations على الأربع نقط:</p>",
      code: {
        lang: "text",
        src: `input    h0     h1     h2     h3     output
(0,0)  -0.00  -0.07  -0.66  -0.77     0.000
(0,1)   0.96   0.96  -1.00   0.94     0.997
(1,0)   0.97   0.97   0.93  -1.00     0.997
(1,1)   1.00   1.00  -0.97  -0.98     0.004

h0, h1 : fire when any input is 1   (roughly OR)
h2     : fires only for (1,0)      h3 : fires only for (0,1)
output : combines them with weights (2.66, 2.84, 6.15, 6.15), bias 0.95`,
        note: "الطبقة المخفية حولت المسألة لشكل يقدر الموديل الخطي يحلّه: في فضاء (h2, h3) النقطتين (1,0) و(0,1) بيطلعوا في ركنين مختلفين، و(0,0) و(1,1) الاتنين بيطلعوا في ركن تالت (الاتنين سالبين). ده معنى إن الشبكة بتتعلم <b>representation</b> جديدة للبيانات.",
      },
      points: [
        "<b>Universal approximation</b> (الصيغة الدقيقة): شبكة فيها <b>طبقة مخفية واحدة</b> بعدد كفاية من الـ neurons وactivation غير خطية مناسبة تقدر <b>تقرّب أي دالة متصلة على نطاق محدود</b> لأي دقة تطلبها.",
        "<b>اللي بتقوله</b>: الشبكة مش محدودة في الشكل الذي تقدر تمثله.",
        "<b>اللي ما بتقولوش</b>: مش بتقول كام neuron هتحتاج (ممكن كتير جدا)، ولا إن gradient descent هيلاقي الأوزان دي (شفنا seed 0 وقف)، ولا إن الموديل هيعمم على بيانات جديدة (ممكن يحفظ). ولا إن الشبكة العميقة مش أحسن عمليا من العريضة.",
        "عمليا، العمق بيعطي تمثيل أكفأ بكتير لكثير من المشاكل، وده سبب Deep Learning.",
      ],
      interview: [
        { q: "هل الـ universal approximation theorem معناه إن أي شبكة عصبية هتحل أي مشكلة؟", a: "لأ. النظرية بتقول إن شبكة بطبقة مخفية وعدد كفاية من الـ neurons تقدر تقرّب أي دالة متصلة على نطاق محدود. مش بتقول إن العدد ده معقول، ولا إن التدريب هيلاقي الأوزان، ولا إن الموديل هيعمم على بيانات ما اتدربش عليها. هي نظرية وجود مش وصفة تدريب، وحدود الواقع هي البيانات والـ optimization والـ overfitting." },
        { q: "كام parameter في شبكة 784 → 128 → 10؟", a: "كل طبقة: inputs × outputs + outputs. الأولى 784×128+128 = 100,480. التانية 128×10+10 = 1,290. المجموع 101,770." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: الـ activations",
      lang: "python",
      code: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def relu(z):
    return np.maximum(0, z)

z = np.array([-2.0, 0.0, 3.0])
print(sigmoid(z).round(3))
print(relu(z), np.tanh(z).round(3))`,
      note: "الناتج: <code>[0.119 0.5 0.953]</code> ثم <code>[0. 0. 3.]</code> <code>[-0.964 0. 0.995]</code>.",
    },
    {
      title: "اكتب: forward pass لطبقتين",
      lang: "python",
      code: `import numpy as np

rng = np.random.default_rng(0)
X = rng.normal(size=(5, 3))
W1 = rng.normal(size=(3, 4))
b1 = np.zeros(4)
W2 = rng.normal(size=(4, 1))
b2 = np.zeros(1)

H = np.maximum(0, X @ W1 + b1)
out = 1 / (1 + np.exp(-(H @ W2 + b2)))
print(H.shape, out.shape)`,
      note: "الناتج: <code>(5, 4) (5, 1)</code>. كل صف في <code>out</code> احتمال لعينة.",
    },
    {
      title: "اكتب: تدريب XOR كامل",
      lang: "python",
      code: `import numpy as np

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y = np.array([[0], [1], [1], [0]], dtype=float)
rng = np.random.default_rng(1)
W1, b1 = rng.normal(0, 1, (2, 4)), np.zeros(4)
W2, b2 = rng.normal(0, 1, (4, 1)), np.zeros(1)
for _ in range(2000):
    h = np.tanh(X @ W1 + b1)
    p = 1 / (1 + np.exp(-(h @ W2 + b2)))
    dz2 = (p - y) / len(X)
    dz1 = (dz2 @ W2.T) * (1 - h ** 2)
    W2 -= 0.5 * h.T @ dz2; b2 -= 0.5 * dz2.sum(0)
    W1 -= 0.5 * X.T @ dz1; b1 -= 0.5 * dz1.sum(0)
print(p.round(2).ravel())`,
      note: "الناتج: <code>[0.   1.   1.   0.]</code> تقريبا. ترتيب السطور مهم: <code>dz1</code> بيتحسب قبل تحديث <code>W2</code>.",
    },
  ],

  tasks: [
    {
      title: "عدد الـ parameters",
      lang: "python",
      prompt: "<p>اكتب دالة <code>count_params(layers)</code> بتاخد قايمة بأحجام الطبقات (من المدخلات للمخرجات) وترجع إجمالي عدد الأوزان والـ biases في شبكة fully connected.</p>",
      examples: [
        { in: "count_params([2, 4, 1])", out: "17" },
        { in: "count_params([784, 128, 10])", out: "101770" },
      ],
      hints: [
        "كل زوج متجاور <code>(a, b)</code> بيدّي <code>a × b + b</code>.",
        "<code>zip(layers, layers[1:])</code> بتعطيك الأزواج.",
      ],
      solution: `def count_params(layers):
    return sum(a * b + b for a, b in zip(layers, layers[1:]))

print(count_params([2, 4, 1]))         # 17
print(count_params([784, 128, 10]))    # 101770`,
      explain: "كل طبقة فيها مصفوفة أوزان <code>a × b</code> و bias بطول <code>b</code>. الحسبة O(عدد الطبقات). لاحظ إن أغلب الـ parameters عادة في الطبقة اللي بين أكبر عرضين.",
    },
    {
      title: "forward pass لشبكة 2-2-1",
      lang: "python",
      prompt: "<p>اكتب <code>forward(x, W1, b1, W2, b2)</code> بترجع مخرج شبكة فيها طبقة مخفية sigmoid ومخرج sigmoid لعينة واحدة. <code>W1</code> شكلها <code>(hidden, inputs)</code> و<code>W2</code> شكلها <code>(hidden,)</code> و<code>b2</code> رقم. ارجع <code>float</code> مقرّب لـ 4 أرقام عشرية.</p>",
      examples: [
        { in: "forward([1.0, 0.5], [[0.1, 0.4], [-0.3, 0.2]], [0.0, 0.1], [0.5, -0.6], 0.2)", out: "0.5504" },
      ],
      hints: [
        "<code>h = sigmoid(W1 @ x + b1)</code> بعد تحويل كله لـ <code>np.array</code>.",
        "المخرج <code>sigmoid(W2 @ h + b2)</code> ورقم واحد، فحوّله بـ <code>float</code> قبل التقريب.",
      ],
      solution: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def forward(x, W1, b1, W2, b2):
    x = np.asarray(x, dtype=float)
    W1 = np.asarray(W1, dtype=float)
    b1 = np.asarray(b1, dtype=float)
    W2 = np.asarray(W2, dtype=float)
    h = sigmoid(W1 @ x + b1)
    return round(float(sigmoid(W2 @ h + b2)), 4)

args = ([1.0, 0.5], [[0.1, 0.4], [-0.3, 0.2]], [0.0, 0.1], [0.5, -0.6], 0.2)
print(forward(*args))   # 0.5504`,
      explain: "نفس القيم اللي مشينا عليها في شريحة الـ backprop: <code>z1 = (0.3, -0.1)</code> و<code>h = (0.5744, 0.4750)</code> و<code>z2 = 0.2022</code> و<code>p = 0.5504</code>. الـ forward لعينة واحدة بيستخدم مصفوفة × متجه.",
    },
    {
      title: "تدريب XOR وإرجاع التوقعات",
      lang: "python",
      prompt: "<p>اكتب <code>train_xor(seed=1, epochs=2000, lr=0.5)</code> بتدرب شبكة 2 → 4 → 1 (tanh مخفية، sigmoid مخرج، BCE، gradient descent على الأربع عينات). الأوزان: <code>rng = np.random.default_rng(seed)</code> ثم <code>W1 = rng.normal(0, 1, (2, 4))</code> ثم <code>W2 = rng.normal(0, 1, (4, 1))</code>، والـ biases أصفار. ارجع قايمة التوقعات الأربعة مقرّبة لـ 3 أرقام عشرية.</p>",
      examples: [
        { in: "train_xor()", out: "[0.0, 0.997, 0.997, 0.004]" },
        { in: "[round(v) for v in train_xor()]", out: "[0, 1, 1, 0]" },
      ],
      hints: [
        "الـ forward: <code>h = np.tanh(X @ W1 + b1)</code> ثم <code>p = sigmoid(h @ W2 + b2)</code>.",
        "الـ backward: <code>dz2 = (p - y) / 4</code>، <code>dz1 = (dz2 @ W2.T) * (1 - h**2)</code>، وبعدين <code>dW2 = h.T @ dz2</code> و<code>dW1 = X.T @ dz1</code>.",
      ],
      solution: `import numpy as np

def train_xor(seed=1, epochs=2000, lr=0.5):
    X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
    y = np.array([[0], [1], [1], [0]], dtype=float)
    rng = np.random.default_rng(seed)
    W1 = rng.normal(0, 1, (2, 4)); b1 = np.zeros(4)
    W2 = rng.normal(0, 1, (4, 1)); b2 = np.zeros(1)
    for _ in range(epochs + 1):
        h = np.tanh(X @ W1 + b1)
        p = 1 / (1 + np.exp(-(h @ W2 + b2)))
        dz2 = (p - y) / len(X)
        dz1 = (dz2 @ W2.T) * (1 - h ** 2)
        W2 -= lr * (h.T @ dz2); b2 -= lr * dz2.sum(axis=0)
        W1 -= lr * (X.T @ dz1); b1 -= lr * dz1.sum(axis=0)
    return [round(float(v), 3) for v in p.ravel()]

print(train_xor())   # [0.0, 0.997, 0.997, 0.004]`,
      explain: "نفس الكود في الشريحة بدون طباعة الـ loss. التوقع بيتحسب قبل آخر تحديث للأوزان فهو بيعكس الأوزان بعد 2000 تحديث بالظبط. لو غيرت <code>seed=0</code> الشبكة بتقف عند حل ناقص، وده سلوك الـ non-convex optimisation.",
    },
  ],

  quiz: [
    {
      q: "شبكة من 3 طبقات، كل طبقة ضرب في مصفوفة وزيادة bias فقط، من غير activation. ده بيساوي إيه؟",
      options: [
        "شبكة عميقة بتتعلم features معقدة",
        "طبقة واحدة بالظبط من الموديل الخطي",
        "موديل غير خطي بسيط",
        "شجرة قرار",
      ],
      answer: 1,
      why: "تركيب دوال خطية دايما خطي: (W3 W2 W1) x + bias مجمّع. عدد الطبقات ملوش تأثير من غير non-linearity.",
    },
    {
      q: "<code>relu(-3) + relu(2)</code> كام؟",
      answer: ["2", "2.0"],
      why: "relu(z) = max(0, z): relu(-3) = 0 و relu(2) = 2، فالمجموع 2.",
    },
    {
      q: "أقصى قيمة لمشتقة sigmoid هي 0.25. لو gradient بيعدي على 10 طبقات sigmoid، إيه اللي بيحصل غالبا؟",
      options: [
        "بيكبر بشكل كبير (exploding)",
        "مفيش تأثير على حجمه",
        "بيتضرب في عدد صغير جدا (حوالي 10^-6 أو أقل) فيختفي تقريبا في الطبقات الأولى",
        "بيتحول لقيمة سالبة",
      ],
      answer: 2,
      why: "كل طبقة بتضرب في ميل <= 0.25، و0.25^10 حوالي 0.000001. ده اسمه vanishing gradient. الـ exploding يحصل لما الضرب في قيم أكبر من 1.",
    },
    {
      q: "شبكة بأحجام [10, 5, 1] (fully connected، مع bias). كام parameter؟",
      answer: ["61"],
      why: "الطبقة الأولى 10×5+5 = 55، التانية 5×1+1 = 6، المجموع 61.",
    },
    {
      q: "أنهي ده بيمثل dying ReLU؟",
      options: [
        "الـ gradient بيختفي لأن الـ activation sigmoid",
        "الـ loss بتتأرجح لأن learning rate كبير",
        "الشبكة بتحفظ بيانات التدريب",
        "neuron بقت z بتاعته سالبة لكل المدخلات، فناتجه وميله صفر ومبيتحدّثش",
      ],
      answer: 3,
      why: "مع ReLU لو z < 0 دايما، الناتج 0 والمشتقة 0، فمفيش إشارة تصلح الوزن. الخيارات التانية vanishing gradient وlearning rate عالي وoverfitting.",
    },
    {
      q: "في الـ backprop، لو <code>p = 0.8</code> و <code>y = 1</code> مع sigmoid + cross-entropy، كام <code>dL/dz</code> عند طبقة المخرجات؟",
      answer: ["-0.2", "−0.2"],
      why: "مع sigmoid + cross-entropy، الـ gradient بالنسبة لـ z هو p - y = 0.8 - 1 = -0.2. السالب معناه إن زيادة z هتقلل الـ loss.",
    },
    {
      q: "عملت gradient descent على XOR بـ seed واحد ووقف عند loss 0.35 بتوقع غلط في عينة، وبـ seed تاني وصل 0.002. التفسير الأقرب؟",
      options: [
        "كود الـ backprop فيه bug أكيد",
        "الـ loss مش محدبة والـ initialisation بيأثر على الحل اللي توصله",
        "XOR مستحيل على الشبكات",
        "محتاج activation خطية",
      ],
      answer: 1,
      why: "نفس الكود نجح بـ seeds تانية فالـ bug مستبعد. سطح الـ loss للشبكات مش محدب وفيه نقط وقوف، فالنتيجة بتتأثر بالبداية. الحل: seeds أو شبكة أعرض.",
    },
    {
      q: "أنهي صياغة سليمة لـ universal approximation theorem؟",
      options: [
        "أي شبكة عصبية بتحل أي مشكلة لو دربناها كفاية",
        "شبكة بطبقة مخفية واحدة وعدد كفاية من الـ neurons تقدر تقرّب أي دالة متصلة على نطاق محدود، من غير ضمان إن التدريب هيلاقي الأوزان أو إن الموديل هيعمم",
        "الشبكة العميقة دايما أحسن من العريضة",
        "الشبكة بتحتاج عدد صغير من الـ neurons لأي دالة",
      ],
      answer: 1,
      why: "النظرية عن القدرة التمثيلية فقط. لا بتحدد العدد المطلوب، ولا بتضمن gradient descent يوصل، ولا بتتكلم عن generalisation.",
    },
    {
      q: "<code>X</code> شكلها <code>(32, 10)</code> و <code>W</code> شكلها <code>(10, 6)</code> و <code>b</code> شكلها <code>(6,)</code>. شكل <code>X @ W + b</code>؟",
      options: ["(32, 6)", "(10, 6)", "(6, 32)", "(32, 10)"],
      answer: 0,
      why: "(32, 10) @ (10, 6) = (32, 6)، والـ bias بيتضاف لكل صف بالـ broadcasting. البُعد الأول هو حجم الـ batch ودايما بيتحافظ عليه.",
    },
    {
      q: "عشان تتأكد إن الـ backprop اللي كتبته بإيدك صح، أنهي أنسب فحص؟",
      options: [
        "تشوف إن الـ loss نزل مرة واحدة",
        "تقارن بـ numerical gradient: تزوّد وزن بـ epsilon صغير وتحسب فرق الـ loss ÷ epsilon",
        "تزود عدد الطبقات",
        "تغيّر الـ activation لـ ReLU",
      ],
      answer: 1,
      why: "الـ gradient check بيقارن الـ gradient التحليلي بتقريب عددي، لو متقاربين الـ backprop سليم. نزول الـ loss مرة واحدة ممكن يحصل مع gradient غلط شوية.",
    },
  ],
};
