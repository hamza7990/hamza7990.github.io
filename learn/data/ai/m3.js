window.LEVELS = window.LEVELS || {};
window.LEVELS["ai/m3"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "النماذج الخطية هي أساس كل حاجة بعدها",
      en: "Why linear models come first",
      body: "<p>الانحدار الخطي واللوجستي أبسط موديلين في ML، ومع ذلك هما بيعلّموك كل الأفكار اللي هتتكرر في الشبكات العصبية والـ LLMs: <b>دالة بأوزان</b>، <b>loss</b> بتقيس الغلط، <b>gradient descent</b> بيعدّل الأوزان، و<b>regularization</b> بيمنع الحفظ. اللي يفهمهم صح، باقي المسار هيبقى امتداد.</p><p>وكمان هما أول baseline محترم في أي مشروع: سريعين وبيدّوك أوزان تقدر تقراها.</p>",
      points: [
        "الانحدار الخطي: بيتنبأ برقم. الانحدار اللوجستي (رغم اسمه): بيتنبأ باحتمال لفئة، يعني classification.",
        "المعادلة بتتكرر: <code>مدخلات × أوزان + bias</code>. الفرق في اللي بييجي بعدها وفي الـ loss.",
      ],
      interview: [
        { q: "ليه الـ logistic regression اسمها regression وهي classification؟", a: "لأن جواها معادلة خطية زي الانحدار الخطي (<code>z = w·x + b</code>) بتطلع رقم مفتوح، وبعدين بتعدّيه على دالة sigmoid تحوله لاحتمال بين 0 و1. التسمية تاريخية: الموديل بيتنبأ بقيمة متصلة (الاحتمال)، وإحنا بنقارنها بعتبة (غالبا 0.5) عشان نطلع الفئة." },
      ],
    },
    {
      kicker: "الانحدار الخطي",
      title: "خط مستقيم بيقرّب البيانات: وزن و bias",
      en: "Linear regression: weights and bias",
      body: "<p>عندك مساحة شقة وسعرها. بترسم النقط وبتدوّر على أحسن خط يعدي بينهم: <code>price = w × area + b</code>. <code>w</code> (الوزن) هو الميل: كل متر زيادة بيزود السعر بقد إيه. <code>b</code> (الـ bias) هو نقطة البداية لما المساحة صفر.</p><p>لو عندك أكتر من feature، كل واحد ليه وزنه: <code>price = w1 × area + w2 × rooms + b</code>. الموديل كله مجرد قايمة أرقام (w1, w2, b).</p>",
      code: {
        lang: "text",
        src: `one feature:   y_hat = w * x + b
many features: y_hat = w1*x1 + w2*x2 + ... + wk*xk + b
               (a dot product plus a bias)

example: w = 2.75, b = 10.5, area = 100
y_hat = 2.75 * 100 + 10.5 = 285.5`,
        note: "الرقم 285.5 هو نفس التوقع اللي طلع في m1 لشقة 100 متر. <code>y_hat</code> معناها «التوقع» (الـ y الحقيقي هو <code>y</code>).",
      },
      terms: [
        ["weight", "وزن", "مقدار تأثير feature واحد على التوقع."],
        ["bias / intercept", "الثابت", "القيمة اللي بتتضاف حتى لو كل الـ features صفر."],
        ["residual", "الباقي", "الفرق بين الحقيقي والتوقع: <code>y - y_hat</code>."],
      ],
    },
    {
      kicker: "الـ loss",
      title: "إزاي نقيس إن الخط كويس؟ MSE",
      en: "Mean squared error",
      body: "<p>لازم رقم واحد يقول «الخط ده غلطه قد كده». بنحسب لكل نقطة الفرق بين التوقع والحقيقي (error)، بنربعه، وناخد المتوسط. ده <b>MSE</b>. التربيع بيخلي الأخطاء الكبيرة أغلى بكتير، وبيشيل الإشارة (غلط لفوق مش بيلغي غلط لتحت)، وبيخلي الدالة ملساء وسهل نحسب ميلها.</p>",
      code: {
        lang: "text",
        src: `MSE = (1/n) * sum( (y_hat_i - y_i)^2 )

data: x = [1, 2, 3, 4, 5]   y = [3, 5, 7, 9, 11]
try w = 1, b = 0:   y_hat = [1, 2, 3, 4, 5]
errors  = [-2, -3, -4, -5, -6]
squares = [ 4,  9, 16, 25, 36]  -> sum 90
MSE = 90 / 5 = 18

try w = 2, b = 1:   y_hat = y, all errors 0, MSE = 0`,
        note: "البيانات دي على خط <code>y = 2x + 1</code> بالظبط. شغل التدريب هو إنه يلاقي (2, 1) لوحده من غير ما نقوله.",
      },
      focus: [{ label: "الفكرة", text: "التدريب = دوّر على الأوزان اللي بتخلي الـ loss أقل ما يمكن." }],
    },
    {
      kicker: "الرياضة اللي تهم",
      title: "Gradient descent: انزل من الجبل بخطوات",
      en: "Gradient descent, step by step",
      body: "<p>تخيل إنك واقف على جبل في ضباب وعايز توصل لأوطى نقطة. مش شايف الوادي، لكن حاسس بميل الأرض تحت رجلك. فبتخطي خطوة في اتجاه النزول، وتعيد. الـ loss هو ارتفاع الأرض، والأوزان هي مكانك.</p><p>الخطوات بالكلام:</p>",
      points: [
        "<b>1.</b> ابدأ بأوزان أي حاجة (مثلا صفر).",
        "<b>2.</b> احسب التوقعات بالأوزان الحالية، وبعدين الـ loss.",
        "<b>3.</b> احسب <b>الـ gradient</b>: ميل الـ loss بالنسبة لكل وزن، يعني «لو زودت <code>w</code> شوية، الـ loss يزيد ولا يقل وبقد إيه؟».",
        "<b>4.</b> حرّك كل وزن في عكس الميل بخطوة: <code>w = w - lr × gradient</code>. الـ <code>lr</code> هو الـ learning rate.",
        "<b>5.</b> كرر لحد ما الـ loss يبطل ينزل.",
      ],
      code: {
        lang: "text",
        src: `loss  L = (1/n) * sum( (w*x + b - y)^2 )
let err = (w*x + b - y)

dL/dw = (2/n) * sum( err * x )     # slope w.r.t. w
dL/db = (2/n) * sum( err )         # slope w.r.t. b

update: w = w - lr * dL/dw
        b = b - lr * dL/db

first step on the data above, w = b = 0, lr = 0.01:
err = -y, sum(err*x) = -125, sum(err) = -35
dL/dw = 2/5 * -125 = -50     dL/db = 2/5 * -35 = -14
w = 0 + 0.01 * 50 = 0.5      b = 0 + 0.01 * 14 = 0.14`,
        note: "المشتقة اللي فوق جاية من قاعدة السلسلة على <code>(...)^2</code>: بتنزل الأس 2 قدام وبتضرب في مشتقة الداخل (<code>x</code> بالنسبة لـ w، و1 بالنسبة لـ b). الميل سالب يعني زيادة الوزن بتقلل الـ loss، فالخطوة بتزود الوزن.",
      },
      interview: [
        { q: "اشرح gradient descent بكلامك.", a: "هو طريقة لتقليل الـ loss بتعديل الأوزان على خطوات. في كل خطوة بحسب ميل الـ loss بالنسبة لكل وزن (الـ gradient) وبحرك الوزن في الاتجاه العكسي للميل بمقدار صغير يتحكم فيه الـ learning rate: <code>w = w - lr × grad</code>. بكرر لحد ما الـ loss يستقر. زي واحد نازل جبل في الضباب بيمشي في اتجاه الميل لتحت." },
      ],
    },
    {
      kicker: "الكود",
      title: "Gradient descent من الصفر بـ NumPy، والـ learning rate",
      en: "From scratch and the learning rate",
      code: {
        lang: "python",
        title: "gd_from_scratch.py",
        src: `import numpy as np

x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
y = np.array([3.0, 5.0, 7.0, 9.0, 11.0])    # y = 2x + 1

def fit(lr, steps):
    w, b = 0.0, 0.0
    n = len(x)
    for _ in range(steps):
        err = w * x + b - y
        w -= lr * (2 / n) * np.sum(err * x)
        b -= lr * (2 / n) * np.sum(err)
    mse = np.mean((w * x + b - y) ** 2)
    return w, b, mse

print(fit(0.01, 5000))   # w=2.0, b=1.0, mse ~ 6e-17
print(fit(0.001, 100))   # w=1.918, b=0.546, mse=0.503  (too small)
print(fit(0.2, 20))      # w ~ -5.8e11, mse ~ 4e24      (too large)`,
        note: "الأرقام من تشغيل فعلي. مع 0.01 وصل لـ (2, 1) تقريبا بالظبط. الـ lr الصغير جدا لسه ماوصلش بعد 100 خطوة. الـ lr الكبير (0.2) كل خطوة بتتخطى الوادي لفوق أكتر من اللي كانت عليه فالأوزان بتنفجر.",
      },
      points: [
        "<b>lr صغير جدا</b>: التدريب بطيء بشكل مؤلم، وممكن تفتكر إنه خلص وهو لسه في النص.",
        "<b>lr كبير جدا</b>: الخطوة بتعدّي الوادي، الـ loss بيطلع بدل ما ينزل، وممكن توصل لـ inf و nan.",
        "عملياً: اطبع الـ loss كل شوية. لو بيزيد قلل الـ lr، لو بينزل ببطء جدا زوده.",
        "الـ features بمقاييس مختلفة بتخلي الـ gradient descent أبطأ، وده سبب scaling في m2.",
      ],
      pitfall: "تحديث <code>w</code> وبعدين حساب <code>err</code> من جديد لتحديث <code>b</code>. الصح إن الاتنين يتحدثوا من نفس <code>err</code> المحسوب بالأوزان القديمة (تحديث متزامن)، زي ما الكود فوق عامل.",
    },
    {
      kicker: "الحل المباشر",
      title: "الحل المغلق (closed form) و scikit-learn",
      en: "Normal equation and LinearRegression",
      body: "<p>الانحدار الخطي من النوع النادر اللي ليه <b>معادلة جاهزة</b> للأوزان من غير تكرار (normal equation): <code>w = (XᵀX)⁻¹ Xᵀ y</code> (بعد إضافة عمود وحايد للـ bias). مع <code>np.linalg.lstsq</code> بتجيبه مباشرة. ليه لسه بنتعلم gradient descent؟ لأن الحل المغلق مبيشتغلش مع الموديلات الأعقد (اللوجستي، الشبكات العصبية)، وبيبقى تقيل لما الـ features تبقى آلاف.</p>",
      code: {
        lang: "python",
        src: `A = np.c_[x, np.ones_like(x)]        # column of ones for the bias
print(np.linalg.lstsq(A, y, rcond=None)[0])   # [2. 1.]

from sklearn.linear_model import LinearRegression
m = LinearRegression().fit(x.reshape(-1, 1), y)
print(m.coef_, m.intercept_)                  # [2.] 1.0`,
        note: "الطريقتين (والـ gradient descent) وصلوا لنفس (2, 1). <code>LinearRegression</code> في scikit-learn بتحل بطريقة least squares مباشرة مش gradient descent، أما <code>SGDRegressor</code> فهي اللي بتعمل descent.",
      },
      interview: [
        { q: "هل الانحدار الخطي لازم gradient descent؟", a: "لأ. ليه حل مغلق (normal equation: <code>w = (XᵀX)⁻¹Xᵀy</code>) بيجيب الأوزان مباشرة، وده اللي <code>LinearRegression</code> في scikit-learn بتعمله تقريبا. gradient descent بنستخدمه لما الحل المغلق مش ممكن (logistic regression، الشبكات العصبية) أو لما البيانات ضخمة جدا فالحل المباشر بيبقى تقيل." },
      ],
    },
    {
      kicker: "الانحدار اللوجستي",
      title: "Sigmoid: من أي رقم لاحتمال",
      en: "Logistic regression and the sigmoid",
      body: "<p>في classification عايزين الإجابة «احتمال إن الطالب ينجح» بين 0 و1، مش رقم زي 7.3. الحيلة: ناخد نفس المعادلة الخطية <code>z = w·x + b</code> ونمررها على <b>sigmoid</b> اللي بتضغط أي رقم في المدى (0, 1).</p>",
      code: {
        lang: "python",
        src: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

print([round(sigmoid(z), 3) for z in (-4, -1, 0, 1, 4)])
# [0.018, 0.269, 0.5, 0.731, 0.982]`,
        note: "<code>z = 0</code> يعني 50%. z موجب كبير يقرّب من 1، وسالب كبير يقرّب من 0. الشكل حرف S.",
      },
      points: [
        "الاحتمال <code>p = sigmoid(w·x + b)</code> هو «احتمال الفئة 1».",
        "<b>العتبة (threshold)</b>: بنقول فئة 1 لو <code>p ≥ 0.5</code> افتراضيا. الحد الفاصل بين الفئتين هو <code>w·x + b = 0</code>، وده خط مستقيم (أو مستوى)، عشان كده النموذج خطي.",
        "العتبة 0.5 مش مقدسة: غيّرها حسب تكلفة كل نوع غلط (m4).",
      ],
      interview: [
        { q: "إيه دور sigmoid في logistic regression؟", a: "بتحول ناتج المعادلة الخطية <code>z</code> (أي رقم من -∞ لـ +∞) إلى احتمال بين 0 و1 بالمعادلة <code>1 / (1 + e^-z)</code>. وبعدين بقارن الاحتمال بعتبة، افتراضيا 0.5، عشان أطلع الفئة. وعند z=0 الاحتمال بالظبط 0.5 وده الحد الفاصل بين الفئتين." },
      ],
    },
    {
      kicker: "الـ loss للتصنيف",
      title: "Log loss: غرامة كبيرة على الثقة الغلط",
      en: "Log loss / cross-entropy",
      body: "<p>مش هنستخدم MSE مع الاحتمالات. بنستخدم <b>log loss</b> (أو cross-entropy). الفكرة: لو الفئة الحقيقية 1 والموديل قال احتمال 0.9، الغرامة صغيرة (<code>-ln 0.9 = 0.105</code>). لو قال 0.01 وهي 1 فعلا، الغرامة كبيرة (<code>-ln 0.01 = 4.605</code>). يعني الموديل اللي واثق وغلطان بيتعاقب جامد.</p>",
      code: {
        lang: "text",
        src: `log loss = -(1/n) * sum( y*ln(p) + (1-y)*ln(1-p) )

y = [1, 0, 1, 0]      p = [0.9, 0.2, 0.6, 0.7]
per sample: -ln(0.9) = 0.105   (y=1, p=0.9)
            -ln(0.8) = 0.223   (y=0, 1-p=0.8)
            -ln(0.6) = 0.511   (y=1, p=0.6)
            -ln(0.3) = 1.204   (y=0, 1-p=0.3)
mean = (0.105 + 0.223 + 0.511 + 1.204) / 4 = 0.511`,
        note: "الحدّ y*ln(p) بيشتغل لما الفئة 1، و(1-y)*ln(1-p) بيشتغل لما تكون 0؛ دايما واحد بس منهم نشط.",
      },
      codes: [
        {
          lang: "python",
          title: "التدريب بنفس gradient descent",
          src: `from sklearn.linear_model import LogisticRegression

hours = np.array([[1], [2], [3], [4], [5], [6], [7], [8]])
passed = np.array([0, 0, 0, 1, 0, 1, 1, 1])
m = LogisticRegression(C=100).fit(hours, passed)
print(m.coef_.round(3), m.intercept_.round(3))   # [[1.273]] [-5.728]
for h in (3, 5, 7):
    print(h, m.predict_proba([[h]])[0, 1].round(3))
# 3 0.129 | 5 0.654 | 7 0.96`,
          note: "الموديل اتعلم إن كل ساعة مذاكرة بتزود الـ log-odds بـ 1.273. الحد الفاصل (p = 0.5) عند 4.5 ساعة. المشتقة هنا بتطلع بنفس الشكل: <code>(p - y) × x</code>.",
        },
      ],
      pitfall: "الاحتمال 0 أو 1 بالظبط بيخلي <code>ln(0)</code> يرجع لانهاية. الدوال الحقيقية بتقص الاحتمال (<code>clip</code>) بقيمة صغيرة جدا.",
      interview: [
        { q: "ليه بنستخدم log loss بدل MSE في classification؟", a: "لأن log loss بتعاقب الثقة الغلط بشكل تصاعدي: توقع 0.01 لفئة حقيقتها 1 بيدي غرامة 4.6 بينما 0.9 بيدي 0.1. وكمان مع sigmoid بتطلع دالة محدبة (convex) فـ gradient descent بيوصل لأحسن حل، بينما MSE مع sigmoid بتطلع دالة مش محدبة وإشارتها (gradient) بتضعف لما الموديل يكون غلطان بثقة." },
      ],
    },
    {
      kicker: "أكتر من فئتين",
      title: "Softmax: sigmoid للفئات المتعددة",
      en: "Multi-class with softmax",
      body: "<p>لو عندك 3 فئات (زي أنواع Iris)، الموديل بيحسب درجة <code>z</code> لكل فئة بأوزان خاصة بيها، وبعدين <b>softmax</b> بيحول الدرجات لاحتمالات مجموعها 1: كل درجة بتتحط أُس <code>e</code> وبنقسم على المجموع. الفئة الأعلى احتمال هي التوقع. والـ loss هو نفس cross-entropy.</p>",
      code: {
        lang: "python",
        src: `z = np.array([2.0, 1.0, 0.1])          # one score per class
s = np.exp(z) / np.exp(z).sum()
print(s.round(3), s.sum())             # [0.659 0.242 0.099] 1.0

# in scikit-learn it is automatic:
m = LogisticRegression(max_iter=200).fit(X_iris, y_iris)
print(m.coef_.shape)                   # (3, 4) -> a row per class`,
        note: "مع Iris: 3 فئات × 4 features = مصفوفة أوزان (3, 4) وزي ما طلع في m1.",
      },
    },
    {
      kicker: "ضبط التعقيد",
      title: "Regularization: L2 بتصغّر الأوزان و L1 بتصفّرها",
      en: "L1 vs L2 regularization",
      body: "<p>لما الـ features كتير أو مترابطة، الموديل بيعمل أوزان ضخمة عشان يلحق كل نقطة تدريب (overfitting). الـ regularization بتضيف للـ loss <b>عقوبة على حجم الأوزان</b>، فالموديل يوازن بين الدقة والبساطة.</p>",
      code: {
        lang: "text",
        src: `L2 (Ridge):  loss + alpha * sum(w^2)     shrinks all weights
L1 (Lasso):  loss + alpha * sum(|w|)     pushes some weights to exactly 0

sklearn: Ridge(alpha), Lasso(alpha): bigger alpha = stronger penalty
LogisticRegression(C): C is the INVERSE: smaller C = stronger penalty`,
      },
      codes: [
        {
          lang: "python",
          title: "5 features، اتنين بس ليهم تأثير",
          src: `# y = 3*x0 - 2*x1 + noise ; x2, x3, x4 are pure noise
# ols    [ 3.07 -1.98  0.06 -0.01  0.05]
# ridge  [ 2.36 -1.56  0.01 -0.17  0.06]   alpha=10
# lasso  [ 2.55 -1.57  0.    0.    0.  ]   alpha=0.3`,
          note: "Ridge صغّرت كل الأوزان (حتى الحقيقية) لكن مصفرتش. Lasso صفّرت الـ noise features تماما، فعملت feature selection تلقائي. (60 صف، <code>default_rng(0)</code>.)",
        },
        {
          lang: "python",
          title: "Features مترابطة جدا",
          src: `# x2 = x1 + tiny noise ; y depends on x1 only
# ols    [0.41 0.57]   unstable split between the twins
# ridge  [0.49 0.49]   shares the weight evenly
# lasso  [0.93 0.  ]   keeps one, drops the other`,
          note: "ده سلوك شائع، مش قاعدة رياضية ثابتة: L2 بتوزع الوزن، L1 بتختار واحد.",
        },
      ],
      points: [
        "الـ regularization hyperparameter (alpha أو C) بيتضبط على validation أو cross-validation (m4).",
        "محتاج scaling قبله، لأن العقوبة على حجم الوزن وحجمه بيتأثر بمقياس الـ feature.",
        "مثال حقيقي: على breast cancer بعد StandardScaler، اللوجستي مع L1 (<code>l1_ratio=1.0</code>, <code>solver=\"saga\"</code>, <code>C=0.1</code>) صفّر 24 من 30 وزن بدقة 0.937 على الاختبار، بينما L2 الافتراضي (C=1) مصفّرش وزن وجاب 0.958. يعني التبسيط له ثمن بسيط أحيانا.",
      ],
      interview: [
        { q: "الفرق بين L1 و L2 regularization؟", a: "الاتنين بيضيفوا عقوبة على الأوزان للـ loss عشان يقللوا الـ overfitting. L2 (Ridge) عقوبتها مجموع مربعات الأوزان فبتصغّر كل الأوزان من غير ما تصفّرها. L1 (Lasso) عقوبتها مجموع القيم المطلقة فبتدفع بعض الأوزان لصفر بالظبط، يعني feature selection تلقائي. ولو الـ features مترابطة L2 بتوزع الوزن بينهم وL1 بتميل تختار واحد." },
      ],
    },
    {
      kicker: "التفسير والاختيار",
      title: "إزاي تقرا الأوزان، وإمتى الموديل الخطي هو الاختيار الصح",
      en: "Interpreting coefficients",
      points: [
        "<b>انحدار خطي</b>: وزن feature = كام وحدة بيتغير التوقع لو الـ feature زاد وحدة وباقي الـ features ثابتة. <code>w=2.75</code> يعني كل متر زيادة بيزود التوقع 2.75 ألف.",
        "<b>لوجستي</b>: الوزن بيأثر على الـ log-odds. <code>exp(w)</code> هو مضاعف الـ odds (نسبة النجاح للفشل). في مثال المذاكرة <code>exp(1.273) = 3.57</code>: كل ساعة بتضرب الـ odds في حوالي 3.6.",
        "مقارنة تأثير feature بالتانية بالأوزان بتتطلب إن الـ features بنفس المقياس (بعد standardization)، وإلا الأوزان مش قابلة للمقارنة.",
        "الأوزان ارتباط مش سببية، ولو الـ features مترابطة الأوزان بتبقى غير مستقرة (زي مثال ols فوق).",
        "<b>الاختيار الصح لما</b>: البيانات صغيرة، العلاقة تقريبا خطية، محتاج تفسير يتقدم لمدير أو جهة تنظيمية، أو محتاج baseline سريع. <b>مش كفاية لما</b> العلاقات فيها تفاعلات وانحناءات معقدة، فساعتها أشجار أو شبكات.",
      ],
      pitfall: "قراءة الوزن الكبير كأنه «أهم feature» لما الـ features بمقاييس مختلفة (متر مقابل عدد غرف). الوزن بيعتمد على الوحدة، فقارن بعد التسوية.",
      interview: [
        { q: "إمتى تفضل موديل خطي على موديل أعقد؟", a: "لما أحتاج تفسير واضح (كل وزن ليه معنى أقدر أشرحه)، أو البيانات قليلة والموديل الأعقد هيحفظها، أو العلاقة فعلا قريبة من الخطية، أو كـ baseline سريع أقارن بيه. وكمان هو سريع في التدريب والتوقع. لو الأداء ناقص بوضوح مقارنة بأشجار مثلا، أنتقل لموديل أقوى، بس بعد ما أكون قست الفرق مش من غير قياس." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: sigmoid و log loss",
      lang: "python",
      code: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def log_loss(y, p):
    p = np.clip(p, 1e-12, 1 - 1e-12)
    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))

print(round(sigmoid(1.0), 3))`,
    },
    {
      title: "اكتب: خطوة gradient descent",
      lang: "python",
      code: `import numpy as np

x = np.array([1.0, 2.0, 3.0])
y = np.array([3.0, 5.0, 7.0])
w, b, lr = 0.0, 0.0, 0.01

for _ in range(1000):
    err = w * x + b - y
    w -= lr * (2 / len(x)) * np.sum(err * x)
    b -= lr * (2 / len(x)) * np.sum(err)
print(round(w, 2), round(b, 2))`,
    },
    {
      title: "اكتب: logistic وعتبة مخصصة",
      lang: "python",
      code: `import numpy as np
from sklearn.linear_model import LogisticRegression

hours = np.array([[1], [2], [3], [4], [5], [6], [7], [8]])
passed = np.array([0, 0, 0, 1, 0, 1, 1, 1])

model = LogisticRegression(C=100).fit(hours, passed)
proba = model.predict_proba([[5], [7]])[:, 1]
labels = (proba >= 0.8).astype(int)
print(proba.round(3), labels)`,
      note: "<code>predict_proba</code> بترجع عمود لكل فئة؛ <code>[:, 1]</code> بتاخد احتمال الفئة 1.",
    },
  ],

  tasks: [
    {
      title: "gradient descent لخط مستقيم",
      lang: "python",
      prompt: "<p>اكتب دالة <code>gradient_descent(x, y, lr=0.01, steps=5000)</code> بتدرّب <code>y = w*x + b</code> بالـ MSE وgradient descent (يبدأ <code>w = b = 0</code>)، وترجع tuple <code>(w, b)</code> مقرّبين لـ 3 أرقام عشرية.</p>",
      examples: [
        { in: "gradient_descent([1, 2, 3, 4, 5], [3, 5, 7, 9, 11])", out: "(2.0, 1.0)" },
        { in: "gradient_descent([1, 2, 3], [1, 2, 3], lr=0.01, steps=1)", out: "(0.093, 0.04)" },
      ],
      hints: [
        "حوّل المدخلات لـ <code>np.asarray(..., dtype=float)</code> عشان العمليات تتعمل على المصفوفة كلها.",
        "جوه الـ loop: <code>err = w*x + b - y</code> ثم <code>w -= lr * 2/n * sum(err*x)</code> و<code>b -= lr * 2/n * sum(err)</code>.",
      ],
      solution: `import numpy as np

def gradient_descent(x, y, lr=0.01, steps=5000):
    x = np.asarray(x, dtype=float)
    y = np.asarray(y, dtype=float)
    w, b = 0.0, 0.0
    n = len(x)
    for _ in range(steps):
        err = w * x + b - y
        w -= lr * (2 / n) * np.sum(err * x)
        b -= lr * (2 / n) * np.sum(err)
    return round(float(w), 3), round(float(b), 3)

print(gradient_descent([1, 2, 3, 4, 5], [3, 5, 7, 9, 11]))  # (2.0, 1.0)`,
      explain: "الخطوة الواحدة على x=y=[1,2,3]: الـ gradient لـ w هو 2/3 × (−14) = −9.33 فـ w = 0.0933، ولـ b هو 2/3 × (−6) = −4 فـ b = 0.04. حسبنا <code>err</code> مرة واحدة قبل تحديث الاتنين، وكلهم vectorized بدل loop على كل نقطة. التعقيد O(steps × n).",
    },
    {
      title: "sigmoid و log loss و العتبة",
      lang: "python",
      prompt: "<p>اكتب تلات دوال بـ NumPy:</p><ul><li><code>sigmoid(z)</code> بتشتغل على رقم أو قايمة.</li><li><code>log_loss(y, p)</code> بترجع متوسط الـ log loss كـ <code>float</code>، مع قص الاحتمالات بين <code>1e-12</code> و <code>1 - 1e-12</code> عشان ميطلعش <code>log(0)</code>.</li><li><code>predict_labels(probs, threshold=0.5)</code> بترجع قايمة 0/1 (الفئة 1 لو الاحتمال <b>أكبر من أو يساوي</b> العتبة).</li></ul>",
      examples: [
        { in: "round(log_loss([1, 0, 1, 0], [0.9, 0.2, 0.6, 0.7]), 4)", out: "0.5108" },
        { in: "predict_labels([0.2, 0.5, 0.8])", out: "[0, 1, 1]" },
        { in: "predict_labels([0.2, 0.5, 0.8], 0.7)", out: "[0, 0, 1]" },
      ],
      hints: [
        "<code>np.clip(p, 1e-12, 1 - 1e-12)</code> قبل اللوغاريتم.",
        "<code>(np.asarray(probs) &gt;= threshold).astype(int).tolist()</code>.",
      ],
      solution: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-np.asarray(z, dtype=float)))

def log_loss(y, p):
    y = np.asarray(y, dtype=float)
    p = np.clip(np.asarray(p, dtype=float), 1e-12, 1 - 1e-12)
    return float(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p)))

def predict_labels(probs, threshold=0.5):
    return (np.asarray(probs) >= threshold).astype(int).tolist()

print(round(log_loss([1, 0, 1, 0], [0.9, 0.2, 0.6, 0.7]), 4))  # 0.5108`,
      explain: "الحسبة اليدوية للمثال: (0.105 + 0.223 + 0.511 + 1.204) / 4 = 0.511. وتأثير الـ clip: <code>log_loss([1], [0.01])</code> = 4.605، أما احتمال 0.0 لفئة حقيقتها 1 فبيطلع حوالي 27.6 بدل لانهاية. والعتبة الأعلى (0.7) بتخلي الموديل «أحرص» فبيقول 1 في حالات أقل.",
    },
  ],

  quiz: [
    {
      q: "موديل <code>y_hat = 2.75 * area + 10.5</code>. كام التوقع لشقة 60 متر؟",
      answer: ["175.5"],
      why: "2.75 × 60 = 165 ثم + 10.5 = 175.5.",
    },
    {
      q: "بيانات x=[1,2,3] و y=[2,4,6]، وإحنا بنجرب w=1 و b=0. كام الـ MSE؟",
      answer: ["4.67", "4.6667", "14/3", "4.667"],
      why: "التوقعات [1, 2, 3] والأخطاء (توقع ناقص حقيقي) [-1, -2, -3] ومربعاتها 1 و4 و9، مجموعها 14، والمتوسط 14 / 3 = 4.67.",
    },
    {
      q: "لو الـ learning rate كبير جدا في gradient descent، إيه اللي بيحصل غالبا؟",
      options: [
        "التدريب بيبقى أبطأ لكنه بيوصل لنفس النتيجة",
        "الموديل بيعمل underfitting بس",
        "مفيش تأثير",
        "الـ loss ممكن يزيد بدل ما ينزل والأوزان تنفجر",
      ],
      answer: 3,
      why: "الخطوة الكبيرة بتعدي الوادي لفوق، فالـ loss بيرتفع وبيتكرر لحد ما الأوزان تنفجر (شفناها: w ≈ -5.8e11 مع lr=0.2). البطء هو أثر الـ lr الصغير جدا.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "python", src: `import numpy as np
z = 0
print(1 / (1 + np.exp(-z)))` },
      answer: ["0.5", "0.50"],
      why: "sigmoid(0) = 1 / (1 + e^0) = 1 / 2 = 0.5. عند z=0 الموديل مش متأكد من أي فئة.",
    },
    {
      q: "أنهي واحد بيعاقب الموديل الواثق والغلطان بأكبر غرامة؟",
      options: [
        "اللي قال 0.9 والحقيقة 1",
        "اللي قال 0.5 والحقيقة 1",
        "اللي قال 0.01 والحقيقة 1",
        "اللي قال 0.6 والحقيقة 1",
      ],
      answer: 2,
      why: "الغرامة = -ln(p للفئة الحقيقية): 0.105 و0.693 و4.605 و0.511 على الترتيب. كل ما الاحتمال المنسوب للفئة الصح يقرب من صفر الغرامة بتنفجر.",
    },
    {
      q: "بتعمل Lasso (L1) على 100 feature ولقيت 70 وزن بقوا صفر. التفسير؟",
      options: [
        "الموديل فشل",
        "L1 عملت feature selection: 70 feature اتشالوا من الموديل فعليا",
        "لازم نزود alpha لحد ما يرجعوا",
        "ده معناه إن الـ 70 دول أهم feature",
      ],
      answer: 1,
      why: "L1 بتدفع الأوزان الضعيفة لصفر بالظبط، فالـ features دي مبتأثرش في التوقع. الوزن الصفر معناه إن الـ feature ملهاش تأثير في التوقع، مش إنها الأهم.",
    },
    {
      q: "في <code>LogisticRegression(C=0.01)</code>، ده معناه إيه بالنسبة لـ regularization؟",
      options: [
        "ضعيفة جدا",
        "مفيش regularization",
        "قوية جدا، لأن C هي معكوس القوة",
        "تعتمد على الـ solver بس",
      ],
      answer: 2,
      why: "في scikit-learn الـ C هي معكوس قوة الـ regularization: C أصغر = عقوبة أقوى = أوزان أصغر. عكس <code>alpha</code> في Ridge وLasso.",
    },
    {
      q: "موديل لوجستي أعطى الوزن 1.273 لـ «ساعات المذاكرة». تقريبا إيه معنى exp(1.273) = 3.57؟",
      options: [
        "كل ساعة بتضرب odds النجاح في حوالي 3.57",
        "احتمال النجاح بيزيد 3.57% كل ساعة",
        "كل ساعة بتزود احتمال النجاح 3.57 نقطة",
        "الـ feature أهم 3.57 مرة من غيره",
      ],
      answer: 0,
      why: "الوزن في الـ log-odds، فـ exp(الوزن) مضاعف الـ odds. الاحتمال نفسه مش بيزيد بثبات لأن sigmoid مش خطية. والمقارنة بين features محتاجة نفس المقياس.",
    },
    {
      q: "لوجستي على 3 فئات و 4 features. شكل <code>model.coef_</code> إيه؟",
      options: ["(4, 3)", "(3, 4)", "(1, 4)", "(12,)"],
      answer: 1,
      why: "كل فئة ليها صف أوزان بطول عدد الـ features، يعني (3, 4). الـ bias ليه <code>intercept_</code> بشكل (3,).",
    },
    {
      q: "أنهي حالة الموديل الخطي فيها اختيار مناسب؟",
      options: [
        "صور بكسلات للتعرف على الأشياء",
        "علاقة معقدة بتفاعلات كتير بين الأعمدة",
        "بيانات نصوص طويلة",
        "بيانات صغيرة وعلاقة تقريبا خطية ومطلوب تفسير الأوزان لإدارة",
      ],
      answer: 3,
      why: "الخطي بيتميز بالبساطة والتفسير والسرعة على بيانات قليلة. الباقي (صور، تفاعلات معقدة، نصوص) غالبا محتاج موديلات أقوى.",
    },
  ],
};
