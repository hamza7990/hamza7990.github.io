window.LEVELS = window.LEVELS || {};
window.LEVELS["ai/m8"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "بناء الشبكة سهل، تدريبها هو الشغل الحقيقي",
      en: "Why training is the hard part",
      body: "<p>في m7 دربنا شبكة 17 parameter على 4 عينات. شبكة حقيقية فيها ملايين الـ parameters وبيانات في آلاف الـ batches، وبتتدرب ساعات. ساعتها أسئلة زي «ليه الـ loss مش بينزل؟» أو «ليه الـ validation بيسوء؟» بتبقى هي شغلك اليومي. المستوى ده بيجاوبها: إيه الـ knobs اللي بتتحرك، وكل واحد بيصلّح إيه.</p><p>القاعدة اللي بتتكرر: <b>كل أداة هنا موجودة علشان تصلّح مشكلة محددة</b>. لما تعرف المشكلة، الأداة بتبقى منطقية ومتحتاجش تحفظها.</p>",
      points: [
        "<b>الـ loss مش بينزل أو بينفجر</b>: learning rate، initialisation، normalisation، gradient clipping.",
        "<b>التدريب بطيء</b>: optimizer أحسن (momentum، Adam)، batch size، GPU.",
        "<b>التدريب كويس والـ validation سيئ</b>: regularization (dropout، weight decay، early stopping، augmentation) أو بيانات أكتر.",
        "<b>ما عندكش بيانات كفاية</b>: transfer learning.",
      ],
    },
    {
      kicker: "الأساسيات",
      title: "Batch و epoch و iteration، و mini-batch SGD",
      en: "Batches, epochs and iterations",
      body: "<p>بدل ما نحسب الـ gradient على كل البيانات في كل خطوة (بطيء ومحتاج ذاكرة)، بنقسمها لـ <b>mini-batches</b> وبنحدّث الأوزان بعد كل batch. المصطلحات:</p>",
      points: [
        "<b>epoch</b>: مرور واحد كامل على كل بيانات التدريب.",
        "<b>batch size</b>: عدد العينات في كل تحديث. <b>iteration</b> (أو step): تحديث واحد للأوزان.",
        "عدد الـ iterations في epoch = <code>عدد العينات ÷ batch size</code> (مقرّب لفوق). 1000 عينة و batch 100 = 10 iterations في الـ epoch، و3 epochs = 30 تحديث.",
        "<b>full-batch</b>: batch = كل البيانات. <b>SGD</b> الأصلي: عينة واحدة في كل خطوة. <b>mini-batch</b> (الأكثر استخداما): بين الاتنين، غالبا 32 إلى 256 أو أكبر حسب الذاكرة.",
        "لازم <b>shuffle</b> للبيانات كل epoch علشان الـ batches متبقاش بنفس الترتيب كل مرة.",
      ],
      code: {
        lang: "python",
        title: "نفس انحدار خطي بحجم batch مختلف (5 epochs)",
        src: `import numpy as np

rng = np.random.default_rng(0)
n = 1000
X = rng.normal(size=(n, 3))
y = X @ np.array([2.0, -1.0, 0.5]) + 3.0 + rng.normal(0, 0.5, n)

def train(batch_size, epochs=5, lr=0.05):
    r = np.random.default_rng(0)
    w, b, updates = np.zeros(3), 0.0, 0
    for _ in range(epochs):
        idx = r.permutation(n)                 # shuffle every epoch
        for s in range(0, n, batch_size):
            j = idx[s:s + batch_size]
            err = X[j] @ w + b - y[j]
            w -= lr * 2 * X[j].T @ err / len(j)
            b -= lr * 2 * err.mean()
            updates += 1
    mse = float(np.mean((X @ w + b - y) ** 2))
    return updates, w.round(2).tolist(), round(float(b), 2), round(mse, 3)

for bs in (1000, 100, 10, 1):
    print(bs, train(bs))
# 1000 (5, [0.7, -0.36, 0.19], 1.15, 5.232)     full batch: 5 updates
# 100  (50, [1.95, -0.96, 0.51], 3.0, 0.254)
# 10   (500, [1.94, -0.95, 0.55], 3.02, 0.255)
# 1    (5000, [1.87, -1.09, 0.58], 2.98, 0.281)`,
        note: "الحقيقي (2, -1, 0.5, 3.0) والـ MSE النهائي الأفضل حوالي 0.25 لأن الضجيج 0.5 (تربيعه 0.25). الـ full batch عمل 5 تحديثات بس فلسه بعيد. الـ batch الأصغر بيعمل تحديثات أكتر في نفس الـ epochs، لكن كل تحديث أضجّ (batch = 1 وصل لـ 0.281 وأوزانه مش مستقرة). الـ 100 كان توازن كويس.",
      },
      interview: [
        { q: "الفرق بين epoch و batch و iteration؟", a: "الـ batch مجموعة عينات بنحسب عليها gradient واحد ونحدّث بيه الأوزان مرة. الـ iteration هي تحديث واحد، يعني batch واحد. الـ epoch مرور كامل على كل بيانات التدريب، فيه <code>N / batch_size</code> iterations. مثلا 1000 عينة و batch 100 يدّوا 10 iterations في الـ epoch." },
        { q: "ليه بنستخدم mini-batch مش الداتا كاملة؟", a: "الـ gradient على الداتا كلها دقيق لكن تقيل وبياخد ذاكرة وبيحدّث الأوزان مرة قليلة. mini-batch بيدّي تقدير ضجّ شوية للـ gradient بس رخيص، فبنحدّث الأوزان كتير. الضجيج ده كمان بيساعد أحيانا في الهروب من نقاط سيئة. وبيناسب GPU لأنه بيشتغل على مصفوفات بالتوازي." },
      ],
    },
    {
      kicker: "أهم knob",
      title: "الـ learning rate: الإعداد الأهم في التدريب",
      en: "The learning rate",
      body: "<p>لو ضبطت حاجة واحدة بس، اضبط الـ learning rate. صغير جدا: التدريب بطيء لدرجة إنك تفتكره خلص. كبير جدا: الخطوة بتعدي الوادي فالـ loss يتأرجح أو ينفجر (شفنا في m3). المثال هنا سطح ضيق في اتجاه وعريض في التاني (بيحاكي الواقع): <code>loss = 0.5 × (x² + 25 y²)</code> من نقطة (4, 1).</p>",
      code: {
        lang: "python",
        title: "learning rate و momentum و Adam على سطح ضيق",
        src: `import numpy as np

H = np.array([1.0, 25.0])          # curvature: steep along y, flat along x

def descend(method, lr, steps=300, beta=0.9):
    w = np.array([4.0, 1.0])
    v = np.zeros(2); m = np.zeros(2); s = np.zeros(2)
    for t in range(1, steps + 1):
        g = H * w                  # gradient of 0.5*(x^2 + 25*y^2)
        if method == "gd":
            w = w - lr * g
        elif method == "momentum":
            v = beta * v + g
            w = w - lr * v
        else:                      # adam
            m = 0.9 * m + 0.1 * g
            s = 0.999 * s + 0.001 * g * g
            mh = m / (1 - 0.9 ** t)
            sh = s / (1 - 0.999 ** t)
            w = w - lr * mh / (np.sqrt(sh) + 1e-8)
        loss = 0.5 * np.sum(H * w ** 2)
        if loss > 1e6:
            return "diverged at step %d" % t
        if loss < 1e-3:
            return "loss < 0.001 after %d steps" % t
    return "loss %.3f after %d steps" % (loss, steps)

for lr in (0.001, 0.04, 0.09):
    print("gd      lr=%-5s" % lr, descend("gd", lr))
print("momentum lr=0.02", descend("momentum", 0.02))
print("adam     lr=0.3 ", descend("adam", 0.3))`,
        note: "الناتج الفعلي في الشريحة اللي بعد كده. الـ gd بـ 0.04 وصل في 111 خطوة، وبـ 0.09 اتفجر لأن حد الاستقرار هنا هو <code>2 ÷ 25 = 0.08</code> (القيمة الأكبر للانحناء)، وبـ 0.001 لسه بعيد بعد 300 خطوة.",
      },
      points: [
        "<b>القاعدة العملية</b>: جرّب قيم بالأسس (…، 1e-4، 1e-3، 1e-2، 1e-1) وراقب منحنى الـ loss، وخد أكبر قيمة لسه بتنزل بثبات.",
        "<b>Schedule</b>: تقليل الـ lr أثناء التدريب (step decay، cosine decay) بيخلي الخطوات الكبيرة في الأول والدقيقة في الآخر.",
        "<b>Warmup</b>: بدء بـ lr صغير جدا وزيادته تدريجيا في أول خطوات، شائع مع الـ Transformers (m9) علشان التدريب ميتهزش في البداية. بنذكره هنا بس.",
      ],
      interview: [
        { q: "إيه اللي بيحصل لو الـ learning rate كبير جدا أو صغير جدا؟ وإزاي تضبطه؟", a: "الكبير بيخلي الخطوة تتخطى الحد الأدنى فالـ loss يتأرجح أو يزيد ويوصل لـ NaN. الصغير بيخلي التدريب بطيء جدا ويقف عند حل محلي أو مرحلة مسطحة. بضبطه بتجربة قيم بالأسس ومراقبة منحنى الـ loss، وبعدين أستخدم schedule يقلله مع الوقت، وأحيانا warmup في الأول. وغالبا هو أول hyperparameter أضبطه." },
      ],
    },
    {
      kicker: "الـ optimizers",
      title: "Momentum و Adam: كل واحد بيصلّح إيه",
      en: "Momentum and Adam",
      body: "<p>الـ gradient descent العادي بيعاني على السطح الضيق: بيتأرجح عرضيا في الاتجاه الحاد (y) وبيتحرك ببطء في الاتجاه المسطح (x). لو صغّرت lr علشان يبطل يتأرجح، بيتحرك ببطء أكتر في x.</p>",
      points: [
        "<b>Momentum</b> بيحتفظ بـ «سرعة»: <code>v = β v + g</code> ثم <code>w = w - lr × v</code>. التأرجح بيتلغي لأن الإشارات المتعاكسة بتلغي بعضها، والاتجاه الثابت بيتراكم فيتسارع. بيصلّح: التأرجح والبطء في الأودية الضيقة. (β عادة 0.9)",
        "<b>Adam</b> بيحتفظ بمتوسط متحرك للـ gradient (<code>m</code>، زي momentum) ولمربعه (<code>s</code>)، وبيقسم الخطوة على <code>√s</code>. يعني كل parameter ليه خطوة متكيفة: اللي gradient بتاعه كبير باستمرار بياخد خطوة أصغر. بيصلّح: اختلاف مقياس الـ gradients بين الأوزان، وبيشتغل كويس بقيم افتراضية (<code>lr=1e-3</code> غالبا نقطة بداية).",
        "<b>AdamW</b>: Adam مع weight decay مفصول بشكل صحيح، والأكثر استخداما في تدريب الـ Transformers.",
        "مفيش optimizer «أحسن دايما». SGD مع momentum بيعمم أحيانا أحسن في الصور بعد ضبط، وAdam أسهل في الضبط ومناسب افتراضيا.",
      ],
      code: {
        lang: "text",
        src: `from the previous slide (same surface, same start point):
gd       lr=0.001   loss 4.389 after 300 steps  (far from done)
gd       lr=0.04    loss < 0.001 after 111 steps
gd       lr=0.09    diverged at step 26
momentum lr=0.02    loss < 0.001 after 61 steps
adam     lr=0.3     loss < 0.001 after 61 steps`,
        note: "المثال ده بسيط جدا (دالة تربيعية)، وأرقامه ماتتعمّمش على شبكات حقيقية، لكنه بيوضح الفكرة: نفس السطح ونفس نقطة البداية، وmomentum قلّل الخطوات للنص تقريبا مقارنة بـ gd المضبوط.",
      },
      interview: [
        { q: "إيه فايدة momentum؟ وإيه اللي بيضيفه Adam؟", a: "Momentum بيحتفظ بمتوسط متحرك للـ gradients السابقة فبيخفف التأرجح في الاتجاهات الحادة وبيسرّع في الاتجاه الثابت. Adam بيضيف إن لكل parameter خطوة متكيفة: بيقسم على جذر متوسط مربعات الـ gradient بتاعه، فالأوزان اللي gradients بتاعتها كبيرة بتتحرك بحذر والصغيرة بتتحرك أسرع. بيدّي تدريب سريع وثابت بقيم افتراضية، ودي سبب شهرته." },
      ],
    },
    {
      kicker: "البداية الصح",
      title: "Weight initialisation، والـ vanishing و exploding gradients",
      en: "Initialisation, vanishing and exploding gradients",
      body: "<p>لو الأوزان الابتدائية صغيرة جدا، الإشارة بتصغر طبقة بعد طبقة لحد ما تتلاشى. لو كبيرة، بتكبر لحد ما تنفجر. نفس الحكاية بتحصل للـ gradient رايح للخلف. الحل: ابدأ بأوزان بتحافظ على حجم الإشارة تقريبا ثابت. <b>Xavier/Glorot</b> للـ tanh (<code>تباين = 1/n</code>) و<b>He</b> للـ ReLU (<code>تباين = 2/n</code>) حيث <code>n</code> عدد المدخلات للطبقة. المكتبات بتعمل ده تلقائيا، لكن لازم تعرف ليه.</p>",
      code: {
        lang: "python",
        title: "الانحراف المعياري للـ activation بعد 10 طبقات ReLU عرضها 100",
        src: `import numpy as np

x = np.random.default_rng(0).normal(size=(1000, 100))

def last_std(scale, layers=10, seed=1):
    rng = np.random.default_rng(seed)
    a = x
    for _ in range(layers):
        W = rng.normal(0, scale, (100, 100))
        a = np.maximum(0, a @ W)                # ReLU layer
    return float(a.std())

print("std 0.01       ", last_std(0.01))
print("std 1.0        ", last_std(1.0))
print("std sqrt(1/n)  ", last_std(np.sqrt(1 / 100)))
print("He sqrt(2/n)   ", last_std(np.sqrt(2 / 100)))`,
        note: "الصغير جدا (0.01) بيطلع 2e-12 يعني صفر تقريبا، والكبير (1.0) بيطلع 2e8 يعني انفجر، و1/√n بيتلاشى لـ 0.022، أما He فبيفضل حوالين 0.7 بعد 10 طبقات (ثابت تقريبا).",
      },
      points: [
        "<b>vanishing gradients</b>: الـ gradient بيتضرب في أرقام أصغر من 1 طبقة بعد طبقة (sigmoid، أوزان صغيرة) فالطبقات الأولى مبتتعلمش. العلاج: ReLU، initialisation سليم، normalisation، residual connections (m9).",
        "<b>exploding gradients</b>: العكس، الـ gradient بيكبر ويوصل لـ inf أو NaN. شائع مع الشبكات المتكررة (RNN) والـ lr الكبير.",
        "<b>Gradient clipping</b>: لو طول متجه الـ gradient تعدى حد (مثلا 5)، صغّره لنفس الاتجاه بطول 5. مثال: gradient = (30, 40) طوله 50، بعد clipping لـ 5 يبقى (3, 4). خطوة واحدة بتمنع انفجار مفاجئ من تبويظ التدريب.",
        "<code>torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm)</code> هي الدالة المقابلة في PyTorch.",
      ],
      interview: [
        { q: "إزاي تتعامل مع exploding gradients؟", a: "أول حاجة أتأكد إن الـ learning rate مش كبير جدا والبيانات متسوّاة. بعدين initialisation مناسب (He مع ReLU)، وnormalisation layers، وgradient clipping: لو طول الـ gradient تخطى حد معين بصغره لنفس الاتجاه. ودي حلول شائعة مع الشبكات المتكررة والشبكات العميقة." },
      ],
    },
    {
      kicker: "التسوية جوه الشبكة",
      title: "Batch norm و layer norm: إيه وليه",
      en: "Batch normalisation and layer normalisation",
      body: "<p>زي ما بنسوّي الـ features قبل الموديل (m2)، ممكن نسوّي <b>مخرجات الطبقات الوسيطة</b>. بنطرح المتوسط ونقسم على الانحراف المعياري، وبعدين بنضرب في <code>γ</code> ونضيف <code>β</code> بيتدربوا. النتيجة: التدريب أثبت وبيقبل lr أكبر. الفرق بين النوعين هو <b>على أنهي محور بنحسب المتوسط</b>:</p>",
      code: {
        lang: "python",
        title: "batch norm مقابل layer norm على مصفوفة (batch, features)",
        src: `import numpy as np

A = np.array([[1.0, 2.0, 3.0],
              [4.0, 5.0, 9.0]])            # 2 samples, 3 features
eps = 1e-5

bn = (A - A.mean(0)) / np.sqrt(A.var(0) + eps)    # per feature, across the batch
ln = (A - A.mean(1, keepdims=True)) / np.sqrt(
    A.var(1, keepdims=True) + eps)                 # per sample, across features
print(bn.round(3).tolist())
# [[-1.0, -1.0, -1.0], [1.0, 1.0, 1.0]]
print(ln.round(3).tolist())
# [[-1.225, 0.0, 1.225], [-0.926, -0.463, 1.389]]`,
        note: "batch norm بيشوف عمود كل feature عبر العينات (فبيعتمد على باقي الـ batch). layer norm بيسوّي كل صف لوحده (من غير اعتماد على باقي الـ batch).",
      },
      points: [
        "<b>Batch norm</b>: مناسب للـ CNNs. بيتصرف مختلف وقت التدريب (إحصائيات الـ batch) ووقت التوقع (إحصائيات متوسطة متخزنة)، ولازم <code>model.eval()</code> وقت التوقع. ضعيف مع batch صغير جدا.",
        "<b>Layer norm</b>: مستقل عن حجم الـ batch ومتساوي في التدريب والتوقع، فهو الاختيار في الـ Transformers واللغة (m9).",
        "ليه بيشتغل؟ التفسير الأصلي «بيثبّت توزيع المدخلات لكل طبقة»، والأبحاث لاحقا بتقول إن الأسباب أعمق (سطح loss أنعم، يقبل lr أكبر). المؤكد عمليا: بيسرّع التدريب وبيخليه أقل حساسية للـ initialisation.",
      ],
      interview: [
        { q: "الفرق بين batch norm و layer norm؟", a: "الاتنين بيطبّعوا المخرجات بطرح المتوسط وقسمة الانحراف مع γ وβ قابلين للتعلم. batch norm بيحسب الإحصائيات لكل feature عبر عينات الـ batch، فبيعتمد على حجم الـ batch ويتصرف مختلف في التدريب والتوقع. layer norm بيحسبها لكل عينة عبر الـ features، فمستقل عن الـ batch. batch norm شائع في CNNs، وlayer norm في الـ Transformers." },
      ],
    },
    {
      kicker: "ضد الحفظ",
      title: "Regularization: dropout و weight decay و early stopping و augmentation",
      en: "Regularization in deep learning",
      body: "<p>الشبكات الكبيرة بتحفظ بسهولة. الأدوات:</p>",
      points: [
        "<b>Dropout</b>: أثناء التدريب بيصفّر نسبة عشوائية من الـ neurons في كل خطوة (مثلا 30%)، فالشبكة متعتمدش على neuron واحد. وقت التوقع بيتقفل (<code>model.eval()</code>).",
        "<b>Weight decay</b> (L2): عقوبة على حجم الأوزان زي m3، بتفضّل أوزان صغيرة.",
        "<b>Early stopping</b>: راقب الـ validation loss وقف التدريب (وخد الأوزان) عند أحسن epoch.",
        "<b>Data augmentation</b>: توليد عينات جديدة بتحويلات تحافظ على الـ label (قلب أو قص أو دوران صورة بسيط). بتزود تنوع التدريب من غير جمع بيانات.",
        "<b>بيانات أكتر</b> دايما أقوى علاج.",
      ],
      codes: [
        {
          lang: "python",
          title: "PyTorch: ده اتشغل فعلا (torch 2.10 على CPU) على 100 عينة تدريب",
          src: `import numpy as np, torch, torch.nn as nn
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split

X, y = make_moons(200, noise=0.35, random_state=0)
Xtr, Xva, ytr, yva = train_test_split(
    X, y, test_size=0.5, random_state=0, stratify=y)
Xtr, Xva = [torch.tensor(a, dtype=torch.float32) for a in (Xtr, Xva)]
ytr, yva = [torch.tensor(a, dtype=torch.float32).unsqueeze(1)
            for a in (ytr, yva)]

def fit(drop=0.0, wd=0.0, epochs=400):
    torch.manual_seed(0)
    model = nn.Sequential(
        nn.Linear(2, 128), nn.ReLU(), nn.Dropout(drop),
        nn.Linear(128, 128), nn.ReLU(), nn.Dropout(drop),
        nn.Linear(128, 1))
    opt = torch.optim.AdamW(model.parameters(), lr=0.01, weight_decay=wd)
    lossf = nn.BCEWithLogitsLoss()
    hist = []
    for epoch in range(1, epochs + 1):
        model.train()
        opt.zero_grad()
        loss = lossf(model(Xtr), ytr)
        loss.backward()
        opt.step()
        model.eval()
        with torch.no_grad():
            val = lossf(model(Xva), yva).item()
        hist.append((loss.item(), val))
    return hist

for name, kw in (("plain", {}), ("dropout+wd", dict(drop=0.3, wd=0.1))):
    h = fit(**kw)
    best = int(np.argmin([v for _, v in h]))
    print(name, [(e, round(h[e - 1][0], 3), round(h[e - 1][1], 3))
                 for e in (10, 50, 100, 200, 400)])
    print("  best val epoch", best + 1, round(h[best][1], 3))
# plain      (epoch, train, val): (10, 0.359, 0.318) (50, 0.183, 0.377)
#            (100, 0.109, 0.674) (200, 0.045, 1.182) (400, 0.013, 1.98)
#            best val epoch 19 (val loss 0.287)
# dropout+wd (10, 0.457, 0.344) (50, 0.261, 0.299) (100, 0.212, 0.362)
#            (200, 0.141, 0.478) (400, 0.171, 0.61)
#            best val epoch 42 (val loss 0.281)`,
          note: "ده بيوضح الـ overfitting بوضوح: في التدريب العادي الـ train loss بينزل لـ 0.013 بينما الـ validation loss بدأ يطلع بعد الـ epoch 19 ووصل 1.98. مع dropout وweight decay الـ val loss بقي أقل بكتير (0.61 في النهاية) لكنه لسه بيطلع بعد epoch 42، فالـ early stopping لسه مفيد. (الأرقام من تشغيل على CPU؛ ممكن تختلف شوية بين إصدارات torch. الأرقام دي لـ torch 2.10.)",
        },
      ],
      pitfall: "نسيان <code>model.eval()</code> وقت التقييم: الـ dropout يفضل شغال والنتايج تبقى عشوائية، وbatch norm يستخدم إحصائيات الـ batch. وعكسه: نسيان <code>model.train()</code> بعد التقييم فالتدريب يكمل من غير dropout.",
    },
    {
      kicker: "التشخيص",
      title: "إزاي تقرا منحنيات التدريب والـ validation",
      en: "Reading training and validation curves",
      body: "<p>أهم أداة تشخيص عندك: منحنى الـ loss للتدريب وللـ validation مقابل الـ epochs (زي المثال اللي فات). الجدول بيحول الشكل لقرار:</p>",
      code: {
        lang: "text",
        src: `what you see                          likely cause            try
train loss high and flat              lr too small, bad init, bigger lr, check
                                      or model too weak       data/labels, bigger model
train loss jumps up / NaN             lr too high, exploding  lower lr, clip gradients
train drops, val flat or rising       overfitting             more data, dropout, weight
  (gap grows)                                                 decay, early stopping,
                                                              smaller model, augmentation
both high and close                   underfitting            bigger model, train longer,
                                                              better features
val noisy, jumps around               small val set, big lr   larger val set, lower lr
val better than train (early)         dropout/augmentation    normal: they act on train only
                                      active in training`,
      },
      points: [
        "قبل ما تتعب في الضبط: <b>اختبر إن الكود نفسه سليم</b> بإنك تحاول تعمل overfit على 10 عينات بس. لو الشبكة معرفتش تحفظ 10 عينات، فيه bug (بيانات، label، loss، أو lr).",
        "قارن دايما بـ baseline (m4). لو شبكتك مش أحسن من logistic regression أو شجرة، المشكلة مش في الـ optimizer.",
        "سجّل الـ loss والـ metric وإعدادات التجربة. بدون سجل مش هتعرف إيه اللي اتحسن.",
      ],
      interview: [
        { q: "الـ train loss بينزل والـ validation loss بيطلع. تعمل إيه؟", a: "ده overfitting. أبدأ بالأرخص: early stopping عند أحسن epoch، وبعدين regularization (dropout، weight decay)، وaugmentation لو صور، وبيانات أكتر لو ممكن، أو موديل أصغر. وبراجع إن مفيش data leakage في الـ validation. وبقارن بـ baseline علشان أعرف الأداء الحقيقي." },
      ],
    },
    {
      kicker: "الصور",
      title: "الشبكات الالتفافية (CNN): ليه بتناسب الصور",
      en: "Convolutional networks at an intuition level",
      body: "<p>صورة 224×224×3 فيها 150,528 رقم. طبقة fully connected بـ 16 neuron بس عليها هتحتاج <code>150,528×16+16 = 2,408,464</code> parameter، ومبتفهمش إن البكسل المجاور ليه علاقة، ولا إن القطة ممكن تظهر في أي مكان. الـ <b>CNN</b> بتحل ده بثلاث أفكار:</p>",
      points: [
        "<b>Filter (kernel)</b>: نافذة صغيرة (مثلا 3×3) بأوزان قابلة للتعلم بتتحرك على الصورة، وفي كل مكان بتحسب مجموع موزون. نفس الأوزان بتتكرر في كل المواضع (<b>weight sharing</b>)، فاللي اتعلمه الـ filter في ركن بيشتغل في أي ركن.",
        "<b>Feature map</b>: ناتج تحريك filter واحد على الصورة = خريطة بتقول «الميزة دي موجودة فين». طبقة فيها 16 filter بتطلع 16 feature map.",
        "<b>Pooling</b>: تصغير الخريطة بأخد أكبر قيمة (max pooling) من كل نافذة 2×2 مثلا، فتقل الأبعاد وبتبقى النتيجة أقل حساسية لإزاحة صغيرة.",
        "الطبقات الأولى بتتعلم حواف وألوان، والأعمق بتجمعها لأشكال ثم أجزاء ثم أشياء. بالتراكيب دي الشبكة بتتعلم features بنفسها من البكسلات.",
      ],
      code: {
        lang: "python",
        title: "filter يدوي بيلقط حافة رأسية",
        src: `import numpy as np

img = np.array([[0, 0, 0, 9, 9, 9]] * 6, dtype=float)   # dark | bright
k = np.array([[-1, 0, 1]] * 3, dtype=float)             # vertical edge filter

fmap = np.array([[np.sum(img[i:i + 3, j:j + 3] * k) for j in range(4)]
                 for i in range(4)])                     # (6-3)/1 + 1 = 4
print(fmap[0])                               # [ 0. 27. 27.  0.]
pooled = fmap.reshape(2, 2, 2, 2).max(axis=(1, 3))
print(pooled)                                # [[27. 27.] [27. 27.]]

print(3 * 3 * 3 * 16 + 16)                   # 448  conv: 16 filters of 3x3x3
print(150528 * 16 + 16)                      # 2408464  dense layer, 16 units`,
        note: "الـ filter طلّع قيمة عالية (27) بس عند الأعمدة اللي فيها الحافة. 16 filter بحجم 3×3 على صورة ملونة = 448 parameter بس، مقابل 2.4 مليون لطبقة dense بنفس عدد الوحدات. حجم الخريطة بدون padding = <code>(n - k) ÷ stride + 1</code>. في الواقع الـ filters بتتعلم بالـ backprop، مش بتكتبها.",
      },
      interview: [
        { q: "ليه الـ CNN أحسن من fully connected للصور؟", a: "لأن فيها افتراضين مناسبين للصور: العلاقات محلية (البكسلات المجاورة مرتبطة) ونفس الميزة ممكن تظهر في أي مكان. فالـ filter الصغير بأوزان مشتركة بيتحرك على الصورة، وده بيقلل الـ parameters جدا (448 مقابل ملايين في المثال) وبيخلي الشبكة تلقط الميزة أينما ظهرت. ومع pooling وطبقات متتابعة بتبني features من حواف لأشياء." },
      ],
    },
    {
      kicker: "عمليا",
      title: "Transfer learning و fine-tuning، و GPU، والـ frameworks",
      en: "Transfer learning, GPUs and frameworks",
      body: "<p>تدريب CNN كبيرة من الصفر محتاج ملايين الصور وأيام GPU. الاختيار الافتراضي العملي: <b>transfer learning</b>. خد شبكة اتدربت على داتا ضخمة (زي ImageNet) فاتعلمت features عامة (حواف، ألوان، أشكال)، واستخدمها لمشكلتك. طريقتين:</p>",
      points: [
        "<b>Feature extraction</b>: جمّد (freeze) كل أوزان الشبكة المدربة، واستبدل الطبقة الأخيرة بطبقة جديدة لفئاتك، ودرب الطبقة الجديدة بس. سريع ومناسب لبيانات قليلة جدا.",
        "<b>Fine-tuning</b>: بعد كده فك تجميد جزء من الطبقات الأخيرة (أو كلها) ودربها بـ learning rate صغير جدا، علشان متبوّظش اللي اتعلمته.",
        "<b>ليه GPU؟</b> التدريب أغلبه ضرب مصفوفات كبيرة، وكل عنصر في الناتج حسابه مستقل عن التاني. الـ GPU فيه آلاف الأنوية الصغيرة بتحسبهم بالتوازي، فبيكسب بكتير على الـ CPU في الشغل ده. لازم الموديل والبيانات يكونوا على نفس الجهاز.",
        "<b>الـ frameworks</b>: PyTorch (الأشهر في الأبحاث ويستخدم في الصناعة كمان) وTensorFlow/Keras. بيعملوا لك automatic differentiation (الـ backprop اللي كتبناه بإيدينا) وتشغيل على GPU وتجميعات جاهزة. فهمك للأساسيات هو اللي بيخليك تعرف تصلّح لما التدريب يغلط.",
      ],
      code: {
        lang: "python",
        title: "نمط fine-tuning بـ PyTorch (مثال توضيحي، مش متشغّل في الدرس ده)",
        src: `# Illustrative pattern. NOT executed in this lesson:
# the pretrained weights have to be downloaded.
import torch
import torch.nn as nn
from torchvision import models

model = models.resnet18(weights="DEFAULT")      # pretrained on ImageNet
for p in model.parameters():
    p.requires_grad = False                     # freeze everything

model.fc = nn.Linear(model.fc.in_features, 5)   # new head for 5 classes
opt = torch.optim.AdamW(model.fc.parameters(), lr=1e-3)   # train the head

# the usual loop: model.train(); loss.backward(); opt.step()
# later (fine-tuning): unfreeze the last block and use lr ~ 1e-5`,
        note: "الكود ده توضيحي ومتجربش هنا لأنه بيحتاج تحميل أوزان. الحلقة المشغّلة فعلا في الدرس هي اللي في شريحة الـ regularization. افحص اسم الدالة (<code>weights=\"DEFAULT\"</code> في torchvision الحديث) من التوثيق لإصدارك.",
      },
      pitfall: "fine-tuning بـ learning rate كبير: الأوزان المدربة بتتدمر في أول خطوات وبتفقد الفايدة كلها. استخدم lr أصغر بكتير (1e-5 إلى 1e-4) للطبقات المدربة، وأكبر قليلا للرأس الجديد.",
      interview: [
        { q: "إيه transfer learning وإمتى تستخدمه؟", a: "إني آخد شبكة اتدربت على داتا ضخمة وأعدّلها لمشكلتي بدل ما أدرب من الصفر. بجمّد أغلب الطبقات وأدرب رأس جديد، وبعدين لو عندي بيانات كفاية أفك تجميد جزء وأعمل fine-tuning بـ lr صغير. بستخدمه لما عندي بيانات قليلة أو وقت وحسابات محدودة، وده الاختيار الافتراضي في الصور والنص." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: mini-batches",
      lang: "python",
      code: `import numpy as np

n, batch_size = 10, 4
rng = np.random.default_rng(0)
idx = rng.permutation(n)

for start in range(0, n, batch_size):
    batch = idx[start:start + batch_size]
    print(start, len(batch))

print(-(-n // batch_size))`,
      note: "الناتج: <code>0 4</code> ثم <code>4 4</code> ثم <code>8 2</code> وبعدين <code>3</code>. آخر batch أصغر. <code>-(-n // b)</code> هو القسمة لأعلى (ceil).",
    },
    {
      title: "اكتب: momentum خطوة بخطوة",
      lang: "python",
      code: `import numpy as np

w = np.array([4.0, 1.0])
H = np.array([1.0, 25.0])
v = np.zeros(2)
lr, beta = 0.02, 0.9

for step in range(3):
    g = H * w
    v = beta * v + g
    w = w - lr * v
    print(step, w.round(3))`,
    },
    {
      title: "اكتب: حلقة تدريب PyTorch",
      lang: "python",
      code: `import torch
import torch.nn as nn

torch.manual_seed(0)
X = torch.randn(64, 3)
y = (X.sum(dim=1, keepdim=True) > 0).float()
model = nn.Sequential(nn.Linear(3, 8), nn.ReLU(), nn.Linear(8, 1))
opt = torch.optim.Adam(model.parameters(), lr=0.05)
lossf = nn.BCEWithLogitsLoss()

for epoch in range(100):
    opt.zero_grad()
    loss = lossf(model(X), y)
    loss.backward()
    opt.step()
print(round(loss.item(), 3))`,
      note: "الأربع خطوات الأساسية: <code>zero_grad</code> ثم forward + loss ثم <code>backward</code> ثم <code>step</code>. من غير <code>zero_grad</code> الـ gradients بتتراكم.",
    },
  ],

  tasks: [
    {
      title: "عدد الـ iterations",
      lang: "python",
      prompt: "<p>اكتب <code>iterations(n_samples, batch_size, epochs)</code> بترجع إجمالي عدد خطوات تحديث الأوزان، علمًا إن آخر batch ناقصة بتتحسب برضه (مفيش drop).</p>",
      examples: [
        { in: "iterations(1000, 100, 3)", out: "30" },
        { in: "iterations(10, 4, 2)", out: "6" },
      ],
      hints: [
        "عدد الـ batches في epoch = السقف (ceil) لـ <code>n / batch</code>.",
        "بدون <code>math</code>: <code>-(-n // b)</code>.",
      ],
      solution: `import math

def iterations(n_samples, batch_size, epochs):
    per_epoch = math.ceil(n_samples / batch_size)
    return per_epoch * epochs

print(iterations(1000, 100, 3))   # 30
print(iterations(10, 4, 2))       # 6`,
      explain: "10 عينات في batches من 4 = 3 batches (4 و4 و2) في الـ epoch، و2 epoch = 6. بعض الـ data loaders بتسقط آخر batch الناقصة (<code>drop_last</code>)، ساعتها بتستخدم القسمة الصحيحة <code>//</code> بدل السقف.",
    },
    {
      title: "gradient clipping بالطول",
      lang: "python",
      prompt: "<p>اكتب <code>clip_by_norm(grad, max_norm)</code> بتاخد قايمة أرقام (gradient) وبترجع قايمة جديدة: لو طول المتجه (norm الإقليدي) أكبر من <code>max_norm</code> صغّره لنفس الاتجاه بحيث طوله <code>max_norm</code>، وإلا رجّعه زي ما هو. قرّب كل عنصر لـ 3 أرقام عشرية.</p>",
      examples: [
        { in: "clip_by_norm([30, 40], 5)", out: "[3.0, 4.0]" },
        { in: "clip_by_norm([0.3, 0.4], 5)", out: "[0.3, 0.4]" },
      ],
      hints: [
        "<code>norm = np.linalg.norm(grad)</code>.",
        "لو <code>norm &gt; max_norm</code> اضرب في <code>max_norm / norm</code>.",
      ],
      solution: `import numpy as np

def clip_by_norm(grad, max_norm):
    g = np.asarray(grad, dtype=float)
    norm = np.linalg.norm(g)
    if norm > max_norm:
        g = g * (max_norm / norm)
    return [round(float(v), 3) for v in g]

print(clip_by_norm([30, 40], 5))      # [3.0, 4.0]
print(clip_by_norm([0.3, 0.4], 5))    # [0.3, 0.4]`,
      explain: "التصغير بيحافظ على اتجاه الـ gradient ويحدد الخطوة فقط، وده الفرق عن قص كل عنصر لوحده (clip by value) اللي ممكن يغيّر الاتجاه. نفس الفكرة بتعملها <code>torch.nn.utils.clip_grad_norm_</code> على كل الـ parameters مجتمعين.",
    },
    {
      title: "Adam خطوة بخطوة",
      lang: "python",
      prompt: "<p>اكتب <code>adam_minimize(grad_fn, w0, lr, steps)</code> بتنفذ Adam (β1=0.9، β2=0.999، eps=1e-8 مع bias correction) من النقطة <code>w0</code> (قايمة) وترجع الأوزان بعد <code>steps</code> خطوة مقرّبة لـ 3 أرقام عشرية. <code>grad_fn(w)</code> بترجع الـ gradient كـ array.</p>",
      examples: [
        { in: "adam_minimize(lambda w: 2 * w, [1.0], 0.1, 1)", out: "[0.9]" },
        { in: "adam_minimize(lambda w: 2 * w, [1.0], 0.1, 100)", out: "[0.003]" },
      ],
      hints: [
        "<code>m = b1*m + (1-b1)*g</code> و<code>s = b2*s + (1-b2)*g*g</code>.",
        "التصحيح: <code>mh = m / (1 - b1**t)</code> و<code>sh = s / (1 - b2**t)</code> حيث t يبدأ من 1.",
        "التحديث: <code>w -= lr * mh / (sqrt(sh) + eps)</code>.",
      ],
      solution: `import numpy as np

def adam_minimize(grad_fn, w0, lr, steps,
                  b1=0.9, b2=0.999, eps=1e-8):
    w = np.asarray(w0, dtype=float)
    m = np.zeros_like(w)
    s = np.zeros_like(w)
    for t in range(1, steps + 1):
        g = grad_fn(w)
        m = b1 * m + (1 - b1) * g
        s = b2 * s + (1 - b2) * g * g
        mh = m / (1 - b1 ** t)
        sh = s / (1 - b2 ** t)
        w = w - lr * mh / (np.sqrt(sh) + eps)
    return [round(float(v), 3) for v in w]

print(adam_minimize(lambda w: 2 * w, [1.0], 0.1, 1))    # [0.9]
print(adam_minimize(lambda w: 2 * w, [1.0], 0.1, 100))  # [0.003]`,
      explain: "أول خطوة بعد التصحيح بتبقى <code>lr × sign(g)</code> تقريبا (لأن mh/√sh = 1)، فالوزن 1.0 نزل بالظبط 0.1. الـ bias correction ضرورية في أول خطوات لأن m وs بتبدأ من صفر فبتكون متحيزة لتحت. وبعد 100 خطوة الوزن وصل 0.003 (قريب من الصفر، أدنى نقطة للدالة <code>w²</code>).",
    },
  ],

  quiz: [
    {
      q: "1000 عينة، batch size = 50، 4 epochs. كام تحديث للأوزان بيحصل إجمالا؟",
      answer: ["80"],
      why: "الـ epoch الواحد 1000 ÷ 50 = 20 iteration، و4 epochs = 80.",
    },
    {
      q: "الـ train loss بينزل لقرب الصفر، والـ validation loss نزل ثم بدأ يطلع. التشخيص؟",
      options: [
        "Underfitting",
        "Overfitting",
        "Learning rate صغير جدا",
        "الموديل سليم تماما",
      ],
      answer: 1,
      why: "الفجوة المتسعة (التدريب بيتحسن والـ validation بيسوء) هي overfitting. الحل الأسرع early stopping عند أحسن epoch، ثم regularization.",
    },
    {
      q: "الـ loss فجأة بقى NaN في أول epochs. أنهي سبب أرجح؟",
      options: [
        "Dropout قليل",
        "عدد الـ epochs صغير",
        "learning rate كبير أو gradients بتنفجر",
        "الـ batch size كبير",
      ],
      answer: 2,
      why: "الخطوة الكبيرة أو الـ gradients المتفجرة بتخلي الأوزان تروح لـ inf ثم NaN. العلاج: lr أصغر وgradient clipping وinitialisation سليم.",
    },
    {
      q: "الـ gradient = (6, 8) وعملت clipping بـ <code>max_norm = 5</code>. كام العنصر الأول بعد الـ clipping؟",
      answer: ["3", "3.0"],
      why: "الطول = √(36+64) = 10 > 5، فنضرب في 5/10 = 0.5 فنحصل على (3, 4).",
    },
    {
      q: "أنهي واحد بيصلّح مشكلة «الـ gradient بيتضرب في أرقام صغيرة عبر الطبقات العميقة»؟",
      options: [
        "ReLU وinitialisation مناسب وnormalisation",
        "تقليل الـ learning rate",
        "استخدام sigmoid في كل الطبقات",
        "تقليل الـ batch size لـ 1",
      ],
      answer: 0,
      why: "ده vanishing gradient. ReLU مشتقتها 1 للموجب، وHe initialisation بيحافظ على حجم الإشارة، وnormalisation بيثبّت التوزيع. sigmoid في كل الطبقات بتزود المشكلة.",
    },
    {
      q: "batch norm و layer norm، أنهي جملة صحيحة؟",
      options: [
        "layer norm بيحسب الإحصائيات عبر عينات الـ batch",
        "batch norm بيحسب الإحصائيات لكل feature عبر عينات الـ batch، وlayer norm لكل عينة عبر الـ features",
        "الاتنين بيحسبوا الإحصائيات بنفس المحور",
        "batch norm مستقل عن حجم الـ batch",
      ],
      answer: 1,
      why: "ده الفرق الجوهري. عشان كده batch norm بيتأثر بحجم الـ batch وبيتصرف مختلف في التدريب والتوقع، وlayer norm لا.",
    },
    {
      q: "<code>model.eval()</code> بيعمل إيه مع شبكة فيها dropout؟",
      options: [
        "بيدرّب الشبكة أسرع",
        "بيزود الـ dropout",
        "بيوقف الـ dropout فالتوقع يبقى ثابت، وبيخلي batch norm يستخدم إحصائياته المخزنة",
        "بيمسح الأوزان",
      ],
      answer: 2,
      why: "dropout بيشتغل في التدريب بس. لو نسيت eval() وقت التقييم، هتدّي نتايج عشوائية ومتشائمة.",
    },
    {
      q: "طبقة conv فيها 16 filter حجم كل واحد 3×3 على صورة ملونة (3 قنوات) مع bias لكل filter. كام parameter؟",
      answer: ["448"],
      why: "كل filter فيه 3×3×3 = 27 وزن + 1 bias = 28. 16 × 28 = 448.",
    },
    {
      q: "عندك 300 صورة بس لتصنيف 5 أنواع. أنهي نهج الأنسب غالبا؟",
      options: [
        "تدريب ResNet كبيرة من الصفر",
        "شبكة fully connected على البكسلات الخام",
        "k-means على البكسلات",
        "transfer learning: شبكة مدربة مسبقا، تجمّد أغلبها وتدرب طبقة أخيرة جديدة",
      ],
      answer: 3,
      why: "بيانات قليلة تعني إن التدريب من الصفر هيحفظ. الـ pretrained features عامة ومفيدة، فنعيد استخدامها وندرب رأس صغير، وبعدين ممكن fine-tuning بـ lr صغير.",
    },
    {
      q: "في الـ fine-tuning، ليه بنستخدم learning rate أصغر بكتير من التدريب من الصفر؟",
      options: [
        "علشان التدريب يخلص أسرع",
        "علشان نحافظ على الـ features المفيدة اللي اتعلمتها الشبكة ومنبوظهاش بخطوات كبيرة",
        "علشان الـ GPU ما تسخنش",
        "مفيش سبب، ده اختياري تماما",
      ],
      answer: 1,
      why: "الأوزان المدربة مسبقا قريبة من حل كويس. خطوة كبيرة بتخرجها من المنطقة دي وتضيع الفايدة. الـ lr الصغير بيضبطها بنعومة.",
    },
  ],
};
