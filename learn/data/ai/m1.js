window.LEVELS = window.LEVELS || {};
window.LEVELS["ai/m1"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "ML يعني الكمبيوتر يطلّع القواعد من الأمثلة بدل ما إنت تكتبها",
      en: "Rules versus learning from examples",
      body: "<p>تخيل إنك عايز تفلتر الرسايل المزعجة (spam). الطريقة التقليدية: تقعد تكتب قواعد: لو الرسالة فيها كلمة «ربح مضمون» يبقى spam، لو فيها أكتر من 3 روابط يبقى spam. بعد أسبوع المرسلين يغيروا الصياغة والقواعد تبوظ، وإنت تضيف قواعد جديدة وتفضل تجري وراهم.</p><p>الطريقة التانية: تديله <b>آلاف الرسايل</b> وكل واحدة مكتوب جنبها «spam» أو «مش spam»، والبرنامج هو اللي يطلّع النمط بنفسه. ده <b>Machine Learning</b>: بدل ما تدي البرنامج القواعد والبيانات وتاخد الإجابة، بتدي البرنامج <b>البيانات والإجابات</b> وبياخد منهم القواعد.</p>",
      codes: [
        {
          lang: "python",
          title: "البرمجة التقليدية: القاعدة بإيدك",
          src: `def is_spam(text):
    # a rule written by a human
    return "free money" in text.lower()`,
          note: "القاعدة ثابتة. أي صياغة جديدة بتعدي من غير ما تتمسك.",
        },
        {
          lang: "python",
          title: "ML: القاعدة بتطلع من الأمثلة",
          src: `# model = learn(texts, labels)   # pseudo code
# model.predict("win a prize now")  # -> "spam"`,
          note: "ده pseudo code بس. الشكل الحقيقي (<code>fit</code> ثم <code>predict</code>) هنكتبه بعد شوية.",
        },
      ],
      points: [
        "ML مش سحر ومش «ذكاء»: هو إيجاد دالة بتقرّب العلاقة بين المدخلات والمخرجات من أمثلة.",
        "بنستخدمه لما القواعد صعب نكتبها بإيدينا (صورة قطة، نبرة تعليق، احتمال إن عميل يسيب الخدمة).",
        "لو المشكلة ليها قاعدة واضحة (احسب الضريبة 14%)، اكتب القاعدة. ML هنا تعقيد من غير داعي.",
      ],
      interview: [
        { q: "إيه الفرق بين البرمجة التقليدية و Machine Learning؟", a: "في البرمجة التقليدية أنا بكتب القواعد وبدخل البيانات والبرنامج يطلّع الإجابة. في ML بدّي الخوارزمية البيانات <b>والإجابات الصح</b> (labels) وهي اللي بتطلّع القواعد، واللي بيطلع في الآخر موديل أستخدمه على بيانات جديدة. بستخدم ML لما القواعد صعب أكتبها أو بتتغير، زي spam أو التعرف على الصور، ومبستخدمهوش لما القاعدة معروفة ومحددة." },
      ],
    },
    {
      kicker: "المفردات",
      title: "Features و Labels: المدخلات والإجابة",
      en: "Features, labels and samples",
      body: "<p>أي مشكلة ML بتتحط في جدول. كل <b>صف</b> هو مثال (sample) واحد، والأعمدة نوعين: <b>features</b> (اللي إنت عارفه وقت التوقع) و<b>label</b> أو target (اللي عايز تتنبأ بيه).</p><p>مثال: عايز تتنبأ بسعر شقة. الـ features: المساحة، عدد الغرف، الدور، المنطقة. الـ label: السعر. وبالعرف بنسمي مصفوفة الـ features <code>X</code> (حرف كبير لأنها 2D: صفوف × أعمدة) والـ label <code>y</code> (حرف صغير لأنها عمود واحد).</p>",
      code: {
        lang: "python",
        title: "الشكل ده بيتكرر في كل المستويات",
        src: `import numpy as np

# 3 apartments, 2 features each: area (m2), rooms
X = np.array([[50, 1],
              [90, 2],
              [130, 3]])
# label: price in thousands
y = np.array([150, 260, 370])

print(X.shape)   # (3, 2)  -> 3 samples, 2 features
print(y.shape)   # (3,)    -> one label per sample`,
        note: "أهم قاعدة شكل: عدد صفوف <code>X</code> = عدد عناصر <code>y</code>. غلطة الـ shape هي أكتر error هتقابله في البداية.",
      },
      terms: [
        ["feature", "خاصية / عمود مدخل", "قيمة بنعرفها عن المثال وبنستخدمها في التوقع."],
        ["label / target", "المطلوب توقعه", "الإجابة الصحيحة لكل مثال في بيانات التدريب."],
        ["sample", "مثال", "صف واحد في الجدول."],
      ],
      pitfall: "إنك تحط في الـ features عمود مش هتعرفه وقت التوقع الحقيقي (زي «هل العميل دفع» وإنت بتتنبأ هل هيدفع). ده اسمه leakage وهنتكلم عنه في المستوى الجاي.",
    },
    {
      kicker: "الأنواع",
      title: "Supervised و Unsupervised و Reinforcement",
      en: "Three families of learning",
      body: "<p>الفرق في نوع الإشارة اللي الموديل بيتعلم منها:</p>",
      points: [
        "<b>Supervised</b> (بإشراف): عندك features وlabels. تتعلم الربط بينهم. أمثلة: توقع سعر شقة، تصنيف رسالة spam، توقع هل العميل هيسيب الخدمة. ده أكتر نوع بتقابله في الشغل.",
        "<b>Unsupervised</b> (من غير إشراف): features بس، من غير labels. بتدوّر على بنية في البيانات. أمثلة: تقسيم العملاء لمجموعات متشابهة (clustering)، تقليل عدد الأعمدة (PCA)، اكتشاف قيم شاذة.",
        "<b>Reinforcement</b> (بالمكافأة): وكيل (agent) بيتصرف في بيئة وبياخد مكافأة أو عقاب. مفيش بيانات جاهزة، هو اللي بيجرب. أمثلة: لعبة شطرنج، روبوت بيتعلم يمشي. أقل استخدام في الشغل العادي.",
        "فيه نوع بين الاتنين اسمه <b>self-supervised</b>: الـ labels بتطلع من البيانات نفسها (إخفاء كلمة وتوقعها). ده أساس تدريب الـ LLMs.",
      ],
      interview: [
        { q: "اشرح الفرق بين supervised و unsupervised بمثال.", a: "Supervised: عندي بيانات مع الإجابة، زي 10 آلاف رسالة كل واحدة متعلّم عليها spam أو لأ، والموديل يتعلم يتوقع الإجابة لرسالة جديدة. Unsupervised: عندي بيانات من غير إجابة، زي سجل مشتريات عملاء، وبطلب من الخوارزمية (k-means مثلا) تقسمهم لمجموعات متشابهة من غير ما أقولها المجموعات إيه. الفرق هو وجود الـ label." },
      ],
    },
    {
      kicker: "نوع المشكلة",
      title: "Regression ولا Classification؟",
      en: "Regression vs classification",
      body: "<p>جوه الـ supervised بنقسم حسب شكل الـ label:</p>",
      points: [
        "<b>Regression</b>: الـ label رقم متصل. سعر الشقة، درجة الحرارة، عدد الطلبات بكرة. الموديل بيرجع رقم (285.5 مثلا).",
        "<b>Classification</b>: الـ label فئة من قايمة محدودة. spam أو لأ (binary)، نوع الزهرة من 3 أنواع (multi-class). الموديل بيرجع فئة، وغالبا كمان احتمال لكل فئة.",
        "السؤال العملي: «لو الموديل قال 285.5 هل ده معنى؟» لو آه، regression. لو الإجابة لازم تكون «قطة» أو «كلب»، classification.",
        "خد بالك: رقم الفئة مش معناه regression. «كود المحافظة» رقم لكنه فئة. وكمان توقع «عمر العميل» ممكن يتحول لفئات (شاب/كبير) لو ده اللي القرار محتاجه.",
      ],
      pitfall: "إنك تعامل الفئات المرقمة (1 = قطة، 2 = كلب، 3 = حصان) كأنها أرقام عادية في موديل. الموديل هيفتكر إن كلب «في النص» بين قطة وحصان. الحل في المستوى الجاي (encoding).",
    },
    {
      kicker: "الصورة الكاملة",
      title: "دورة حياة مشروع ML",
      en: "The ML workflow",
      body: "<p>الموديل جزء صغير من الشغل. الدورة الحقيقية:</p>",
      points: [
        "<b>1. Data</b>: تجمع البيانات وتفهمها وتنضفها. ده عادة أغلب الوقت.",
        "<b>2. Split</b>: تفصل جزء للاختبار <b>قبل أي حاجة تانية</b> وماتلمسوش لحد الآخر.",
        "<b>3. Train</b>: الموديل يتعلم من بيانات التدريب (<code>fit</code>).",
        "<b>4. Evaluate</b>: تقيس الأداء على بيانات الاختبار اللي الموديل ماشافهاش، وتقارنه بـ baseline بسيط.",
        "<b>5. Deploy</b>: تحطه في تطبيق أو API يتنادى عليه.",
        "<b>6. Monitor</b>: تراقب الأداء بعد الإطلاق، لأن العالم بيتغير والموديل بيبوظ مع الوقت (data drift).",
      ],
      focus: [{ label: "احفظها", text: "الموديل بيتقيّم على بيانات ماشافهاش وقت التدريب. أداء الموديل على بيانات التدريب لوحده مبيثبتش حاجة." }],
      interview: [
        { q: "إيه مراحل مشروع ML من الأول للآخر؟", a: "بجمع وأفهم البيانات وأنضفها، بفصل test set على جنب، بدرّب الموديل على الباقي، بقيّمه على الـ test وأقارنه بـ baseline، لو كويس بنشره (API أو داخل التطبيق)، وبعد كده براقبه لأن توزيع البيانات بيتغير مع الوقت والأداء ممكن ينزل من غير ما حد ياخد باله. وبرجع للمراحل دي أكتر من مرة، مش خط مستقيم." },
      ],
    },
    {
      kicker: "أول موديل",
      title: "موديل كامل في 10 سطور بـ scikit-learn",
      en: "A first model end to end",
      body: "<p>بنستخدم dataset <b>Iris</b> الجاهز جوه scikit-learn: 150 زهرة، 4 قياسات لكل واحدة (features)، ونوعها من 3 أنواع (label). المطلوب: نتنبأ بالنوع من القياسات.</p>",
      code: {
        lang: "python",
        title: "iris_first_model.py",
        src: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

X, y = load_iris(return_X_y=True)
print(X.shape, y.shape)          # (150, 4) (150,)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)
print(X_train.shape, X_test.shape)   # (120, 4) (30, 4)

model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)          # learning happens here
pred = model.predict(X_test)         # predictions on unseen rows
print("accuracy:", round(accuracy_score(y_test, pred), 3))  # 0.967`,
        note: "شغّلنا الكود ده فعلا والناتج 0.967، يعني 29 من 30 صح. <code>random_state=42</code> بيثبت التقسيم عشان نفس الرقم يطلع كل مرة.",
      },
      points: [
        "نفس الشكل في كل موديل في scikit-learn: <code>model = Algo(...)</code> ثم <code>model.fit(X_train, y_train)</code> ثم <code>model.predict(X_new)</code>.",
        "<code>stratify=y</code> بتحافظ على نسبة الأنواع في التدريب والاختبار (هنشرحها في m2).",
        "الدقة العالية هنا طبيعية: Iris dataset سهل جدا. متفتكرش إن كل مشكلة بتوصل 97% بسهولة.",
      ],
      pitfall: "إنك تحسب الدقة على <code>X_train</code> وتفرح. الموديل شاف البيانات دي وهو بيتعلم، فالرقم متفائل. القياس الصادق على <code>X_test</code> بس.",
    },
    {
      kicker: "جوه الموديل",
      title: "Parameters اللي بيتعلمها و Hyperparameters اللي بتحطها",
      en: "Parameters vs hyperparameters",
      body: "<p>الموديل في أبسط صوره دالة بقيم قابلة للتعديل. مثال: توقع سعر الشقة بخط مستقيم: <code>price = w * area + b</code>. القيمتين <code>w</code> (الوزن) و<code>b</code> (الـ bias) هما الـ <b>parameters</b>: التدريب بيدوّر على أحسن قيمة ليهم من البيانات.</p><p>أما الحاجات اللي إنت بتحطها قبل التدريب ومش بتتعلم (عدد الجيران في kNN، أقصى عمق شجرة، learning rate) فهي <b>hyperparameters</b>.</p>",
      codes: [
        {
          lang: "python",
          title: "parameters: التدريب بيحسبها",
          src: `import numpy as np
from sklearn.linear_model import LinearRegression

area = np.array([[50], [70], [90], [110], [130]])
price = np.array([150, 200, 260, 310, 370])
model = LinearRegression().fit(area, price)
print("weight:", round(model.coef_[0], 3))   # 2.75
print("bias:", round(model.intercept_, 3))   # 10.5
print(round(model.predict([[100]])[0], 1))   # 285.5`,
          note: "الموديل تعلّم إن كل متر بيزود حوالي 2.75 ألف، والـ 10.5 نقطة البداية. شقة 100 متر = 2.75 × 100 + 10.5 = 285.5.",
        },
        {
          lang: "python",
          title: "hyperparameter: إنت بتحدده",
          src: `from sklearn.neighbors import KNeighborsClassifier

for k in (1, 5, 50):
    m = KNeighborsClassifier(n_neighbors=k)
    m.fit(X_train, y_train)
    print(k, round(m.score(X_train, y_train), 3),
          round(m.score(X_test, y_test), 3))
# 1  1.0   0.967
# 5  0.967 1.0
# 50 0.9   0.9`,
          note: "<code>n_neighbors</code> مش بيتعلم من البيانات، إنت بتجربه. (الأرقام من نفس تقسيم Iris اللي فوق.)",
        },
      ],
      terms: [
        ["parameter", "معامل بيتعلمه الموديل", "بيتحسب في <code>fit</code> (الأوزان)."],
        ["hyperparameter", "إعداد بتحدده قبل التدريب", "بيتغير بالتجربة مش بالتدريب، وبيتضبط على validation مش على test."],
      ],
      interview: [
        { q: "إيه الفرق بين parameter و hyperparameter؟", a: "الـ parameters قيم الموديل نفسه اللي بتتحسب من البيانات وقت <code>fit</code>، زي أوزان الانحدار الخطي. الـ hyperparameters إعدادات أنا بحددها قبل التدريب ومبتتعلمش منه، زي عدد الجيران في kNN أو أقصى عمق شجرة. بضبط الـ hyperparameters بتجربة قيم ومقارنتها على بيانات validation، مش على الـ test." },
      ],
    },
    {
      kicker: "الخريطة",
      title: "فين Deep Learning و الـ LLMs من كل ده؟",
      en: "Where deep learning and LLMs sit",
      body: "<p>الخريطة من الأكبر للأصغر:</p>",
      points: [
        "<b>AI</b>: أي نظام بيعمل حاجة بتتطلب ذكاء، بما فيها القواعد المكتوبة بإيدك.",
        "<b>Machine Learning</b>: جزء من AI، بيتعلم من البيانات. كل اللي في المستوى ده والـ 4 اللي بعده.",
        "<b>Deep Learning</b>: جزء من ML، موديلاته شبكات عصبية بطبقات كتير. بيتفوق في الصور والصوت والنص (هنوصله في m6 وm8).",
        "<b>LLM</b> (زي GPT وClaude): شبكة عصبية ضخمة من نوع Transformer متدربة على كمية نصوص هائلة، بتتنبأ بالكلمة (token) الجاية. يعني هي في الأساس مشكلة classification: اختار الـ token الجاي من قايمة المفردات.",
        "الاستنتاج المهم: الأساسيات اللي في المسار ده (split, loss, overfitting, metrics) هي هي نفسها تحت الـ LLMs. اللي يفهمها يفهم الباقي.",
        "على البيانات الجدولية (tabular) غالبا الأشجار (m5) بتكسب الشبكات العصبية، وده هنفصله هناك.",
      ],
      interview: [
        { q: "العلاقة بين AI و ML و Deep Learning؟", a: "AI المجال الأوسع. ML فرع منه بيتعلم القواعد من البيانات بدل ما تتكتب يدويا. Deep Learning فرع من ML بيستخدم شبكات عصبية بطبقات كتيرة. والـ LLMs نوع من الـ deep learning (Transformers) متدرب على نصوص بكميات ضخمة. كل مستوى جوه اللي قبله." },
      ],
    },
    {
      kicker: "بصراحة",
      title: "حدود ML: الأخطاء اللي بتخلي الموديل يبان شاطر وهو مش كده",
      en: "Garbage in, garbage out; correlation is not causation",
      body: "<p><b>Garbage in, garbage out</b>: الموديل مش بيصلح بيانات وحشة. لو الـ labels غلط، أو العينة مش بتمثل الواقع (بيانات من القاهرة وبتتنبأ لأسوان)، أو فيها تحيز، الموديل هيتعلم الغلط بثقة ويتنبأ بيه.</p><p><b>Correlation is not causation</b>: الموديل بيلاقي إن حاجتين بيحصلوا مع بعض، مش إن واحدة بتسبب التانية. مثلا لو لقى إن المستشفيات اللي فيها عربيات إسعاف أكتر فيها وفيات أكتر، ده لا يعني إن الإسعاف بيقتل الناس. السبب المخفي إن المستشفيات دي بتستقبل حالات أخطر.</p>",
      code: {
        lang: "python",
        title: "الـ baseline: أبسط موديل ممكن",
        src: `from sklearn.dummy import DummyClassifier

dummy = DummyClassifier(strategy="most_frequent")
dummy.fit(X_train, y_train)
print(round(dummy.score(X_test, y_test), 3))   # 0.333`,
        note: "على Iris الأنواع الثلاثة متساوية، فالموديل الغبي اللي بيرد دايما بنفس النوع بيجيب 33%. أي موديل لازم يتفوق على الرقم ده بوضوح، وإلا هو ملوش لازمة.",
      },
      pitfall: "إنك تقول «الموديل 95% دقة» من غير ما تقول مقابل إيه. لو 95% من البيانات من فئة واحدة، موديل غبي بيجيب 95%. دايما قارن بـ baseline.",
      interview: [
        { q: "موديل بيحقق دقة 98% على الـ test set. إزاي تتأكد إنه فعلا كويس؟", a: "أول حاجة أقارنه بـ baseline: لو الفئة الأكبر 97% من البيانات يبقى 98% شبه ولا حاجة. بعدين أتأكد إن مفيش leakage (عمود بيكشف الإجابة) وإن الـ test set متلمسش وقت الضبط، وإن بيانات الاختبار شبه بيانات الواقع اللي هيتشغل عليها. وأبص على مقاييس غير الدقة لو الفئات مش متوازنة." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: تحميل وتقسيم",
      lang: "python",
      code: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)
print(X_train.shape, X_test.shape)`,
    },
    {
      title: "اكتب: fit و predict و score",
      lang: "python",
      code: `from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)
pred = model.predict(X_test)
acc = accuracy_score(y_test, pred)
print("accuracy:", round(acc, 3))`,
      note: "الشكل ده (<code>fit</code> ثم <code>predict</code>) هتكتبه مئات المرات. خليه في إيدك.",
    },
    {
      title: "اكتب: خط مستقيم وبارامتراته",
      lang: "python",
      code: `import numpy as np
from sklearn.linear_model import LinearRegression

area = np.array([[50], [70], [90], [110], [130]])
price = np.array([150, 200, 260, 310, 370])

model = LinearRegression().fit(area, price)
print("weight:", round(model.coef_[0], 3))
print("bias:", round(model.intercept_, 3))
print(round(model.predict([[100]])[0], 1))`,
    },
  ],

  tasks: [
    {
      title: "توقع بخط مستقيم",
      lang: "python",
      prompt: "<p>اكتب دالة <code>fit_and_predict(x, y, new_x)</code> بتاخد قايمتين أرقام <code>x</code> و<code>y</code> بنفس الطول، وقيمة <code>new_x</code>، وترجع توقع <code>LinearRegression</code> لـ <code>new_x</code> كـ <code>float</code>.</p><p>لاحظ إن <code>fit</code> محتاجة <code>X</code> بشكل 2D.</p>",
      examples: [{ in: "fit_and_predict([1, 2, 3, 4], [3, 5, 7, 9], 10)", out: "21.0" }],
      starter: `import numpy as np
from sklearn.linear_model import LinearRegression

def fit_and_predict(x, y, new_x):
    # your code
    pass`,
      hints: [
        "حوّل <code>x</code> لمصفوفة وغيّر شكلها لعمود: <code>np.array(x).reshape(-1, 1)</code>.",
        "<code>predict</code> برضه بتاخد 2D: <code>[[new_x]]</code>، وبترجع مصفوفة، خد أول عنصر.",
      ],
      solution: `import numpy as np
from sklearn.linear_model import LinearRegression

def fit_and_predict(x, y, new_x):
    model = LinearRegression()
    model.fit(np.array(x).reshape(-1, 1), y)
    return float(model.predict([[new_x]])[0])

print(fit_and_predict([1, 2, 3, 4], [3, 5, 7, 9], 10))  # 21.0`,
      explain: "البيانات هنا على خط <code>y = 2x + 1</code> بالظبط، فالموديل بيتعلم w=2 وb=1 والتوقع لـ 10 هو 21. <code>reshape(-1, 1)</code> بتحول القايمة لعمود واحد (n صفوف × feature واحد)، لأن scikit-learn دايما بتتوقع X بشكل (samples, features).",
    },
    {
      title: "الموديل قدام الـ baseline",
      lang: "python",
      prompt: "<p>اكتب دالة <code>compare(X, y)</code> بتقسم البيانات 75% تدريب و25% اختبار (<code>random_state=0</code> و<code>stratify=y</code>)، وتدرب <code>DummyClassifier(strategy=\"most_frequent\")</code> و<code>DecisionTreeClassifier(max_depth=3, random_state=0)</code>، وترجع tuple فيه دقة الاتنين على الاختبار بالترتيب (dummy ثم tree).</p><p>جرّبها على <code>load_breast_cancer</code>.</p>",
      examples: [{ in: "compare(X, y)  # breast cancer", out: "(0.629, 0.916) تقريبا" }],
      hints: [
        "<code>train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)</code>.",
        "<code>model.score(X_te, y_te)</code> بترجع الدقة للـ classifiers.",
      ],
      solution: `from sklearn.datasets import load_breast_cancer
from sklearn.dummy import DummyClassifier
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

def compare(X, y):
    X_tr, X_te, y_tr, y_te = train_test_split(
        X, y, test_size=0.25, random_state=0, stratify=y)
    base = DummyClassifier(strategy="most_frequent").fit(X_tr, y_tr)
    tree = DecisionTreeClassifier(max_depth=3, random_state=0)
    tree.fit(X_tr, y_tr)
    return base.score(X_te, y_te), tree.score(X_te, y_te)

X, y = load_breast_cancer(return_X_y=True)
b, t = compare(X, y)
print(round(b, 3), round(t, 3))   # 0.629 0.916`,
      explain: "الـ dataset فيه 212 حالة من فئة و357 من التانية، يعني 62.8% للأكبر، فالـ baseline بيجيب 0.629 من غير ما يتعلم حاجة. الشجرة بتوصل 0.916، وده الرقم اللي يستاهل نحتفل بيه فعلا لأنه فوق الـ baseline بفرق واضح، مش 0.916 لوحده.",
    },
  ],

  quiz: [
    {
      q: "أنهي واحدة دي مشكلة <b>regression</b>؟",
      options: [
        "تحديد هل الإيميل spam",
        "توقع درجة الحرارة بكرة بالدرجات",
        "تحديد نوع الزهرة من 3 أنواع",
        "تصنيف صورة لقطة أو كلب",
      ],
      answer: 1,
      why: "الدرجة رقم متصل فده regression. الباقي كلهم فئات محدودة يعني classification.",
    },
    {
      q: "عندنا 150 صف في <code>X</code> والتقسيم <code>test_size=0.2</code>. كام صف في <code>X_train</code>؟",
      code: { lang: "python", src: `X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)` },
      answer: ["120"],
      why: "20% من 150 = 30 للاختبار، يبقى الباقي 120 للتدريب.",
    },
    {
      q: "شركة عندها سجل عملاء بتواريخ مشترياتهم من غير أي عمود «بيسيب ولا لأ». عايزة تقسمهم لشرايح متشابهة للتسويق. ده نوع التعلم المناسب؟",
      options: [
        "Supervised classification",
        "Supervised regression",
        "Unsupervised (clustering)",
        "Reinforcement learning",
      ],
      answer: 2,
      why: "مفيش label، والمطلوب إيجاد مجموعات في البيانات، يعني unsupervised clustering. الـ supervised محتاج label، والـ reinforcement محتاج وكيل بيتصرف وبياخد مكافأة.",
    },
    {
      q: "إيه اللي هيحصل في الكود ده؟",
      code: { lang: "python", src: `import numpy as np
from sklearn.linear_model import LinearRegression

x = np.array([1, 2, 3, 4])
y = np.array([2, 4, 6, 8])
LinearRegression().fit(x, y)` },
      options: [
        "بيشتغل وبيتعلم w=2",
        "بيرمي ValueError لأن <code>x</code> لازم تكون 2D",
        "بيرمي ValueError لأن الطولين مختلفين",
        "بيشتغل بس بيرجع bias فقط",
      ],
      answer: 1,
      why: "scikit-learn بتتوقع X بشكل (samples, features). المصفوفة 1D بترمي ValueError بتقول «Expected 2D array». الحل <code>x.reshape(-1, 1)</code>. الطولين متساويين، فمش دي المشكلة.",
    },
    {
      q: "أنهي واحد من دول <b>hyperparameter</b> مش parameter؟",
      options: [
        "وزن <code>w</code> في <code>price = w * area + b</code>",
        "الـ bias <code>b</code>",
        "عدد الجيران <code>n_neighbors</code> في kNN",
        "قيم <code>model.coef_</code> بعد <code>fit</code>",
      ],
      answer: 2,
      why: "<code>n_neighbors</code> بتحطه إنت قبل التدريب ومبيتعلمش. الباقي (الأوزان والـ bias والـ coef_) بتتحسب في <code>fit</code> فهي parameters.",
    },
    {
      q: "dataset فيه 95% من الإيميلات مش spam. موديل دايما بيرد «مش spam». دقته تقريبا كام؟",
      answer: ["95", "95%", "0.95"],
      why: "بيصيب في كل الإيميلات العادية (95%) وبيغلط في الـ spam كله. دقة عالية من غير فايدة، وعشان كده بنقارن دايما بـ baseline وبنستخدم مقاييس تانية (m4).",
    },
    {
      q: "موديل بيحقق 100% على بيانات التدريب و70% على الاختبار. أنهي تفسير الأقرب؟",
      options: [
        "الموديل ممتاز، الفرق عادي",
        "الموديل حفظ بيانات التدريب بدل ما يتعلم نمط عام",
        "بيانات الاختبار فيها مشكلة أكيد",
        "لازم نشيل الـ test set ونحسب على التدريب",
      ],
      answer: 1,
      why: "فرق كبير بين التدريب والاختبار علامة الحفظ (overfitting): هنفصله في m4. مش بنحسب على التدريب أبدا، لأنه متفائل بطبيعته.",
    },
    {
      q: "لقينا إن أيام ارتفاع مبيعات الآيس كريم هي نفسها أيام زيادة حوادث الغرق. أنهي استنتاج صح؟",
      options: [
        "الآيس كريم بيسبب الغرق",
        "لازم نوقف بيع الآيس كريم",
        "فيه ارتباط (correlation) وغالبا سبب تالت مشترك هو الصيف",
        "الغرق بيزود الطلب على الآيس كريم",
      ],
      answer: 2,
      why: "الارتباط مش سببية. الصيف بيزود الاتنين. الموديل ممكن يستخدم الارتباط للتوقع، لكن مينفعش نقول من الأرقام لوحدها إن حاجة بتسبب التانية.",
    },
    {
      q: "أنهي ترتيب صح لمراحل المشروع؟",
      options: [
        "train، split، evaluate، data",
        "data، split، train، evaluate، deploy، monitor",
        "data، train، deploy، split",
        "split، deploy، train، monitor",
      ],
      answer: 1,
      why: "التقسيم بيتم قبل التدريب عشان الـ test set يفضل بعيد عن الموديل، والمراقبة بعد النشر عشان الأداء ممكن ينزل مع الوقت.",
    },
  ],
};
