window.LEVELS = window.LEVELS || {};
window.LEVELS["ai/m2"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "أغلب أخطاء ML بتحصل قبل الموديل، في تجهيز البيانات",
      en: "Why data preparation decides the result",
      body: "<p>الناس بتفتكر إن شغل ML هو اختيار الخوارزمية. الحقيقة إن أغلب المشاريع بتفشل أو بتدّي أرقام كدابة بسبب البيانات: قيم ناقصة، أعمدة نصية، أرقام بمقاييس مختلفة، وأخطر حاجة: <b>تسريب</b> معلومة من الاختبار للتدريب بيخلي الدقة عالية على الورق ومنهارة في الواقع.</p><p>في المستوى ده هنمشي بالترتيب: نقسم صح، نمنع التسريب، نتعامل مع الناقص والفئات والمقاييس والقيم الشاذة وعدم التوازن، وبعدين نجمع كل ده في <b>Pipeline</b> يحمينا بنفسه.</p>",
      points: [
        "قاعدة ذهبية: أي حاجة بتتعلمها من البيانات (متوسط، median، فئات، مقياس) تتعلمها من بيانات التدريب بس.",
        "قاعدة تانية: الـ test set تفضل مقفولة لحد آخر تقييم.",
      ],
      interview: [
        { q: "ليه بيقولوا إن 80% من شغل ML هو تجهيز البيانات؟", a: "لأن جودة الموديل محدودة بجودة البيانات. أغلب المشاريع الحقيقية بيانتها ناقصة ومتكررة ومفيهاش labels نضيفة، والقرارات بتاعت التنضيف والتقسيم بتأثر على النتيجة أكتر من اختيار الخوارزمية. والنسبة نفسها (80%) تقدير شائع مش رقم مقاس، لكن الفكرة صحيحة: وقتي بيروح في البيانات أكتر من الموديل." },
      ],
    },
    {
      kicker: "التقسيم",
      title: "ليه ثلاث مجموعات: train و validation و test",
      en: "Train / validation / test split",
      body: "<p>لو قسمنا لاتنين بس (تدريب واختبار)، هنجرب 10 موديلات و20 إعداد على الاختبار ونختار الأحسن. النتيجة: اخترنا الأحسن <b>على الاختبار</b>، فالرقم ده بقى متفائل ومبقاش اختبار حقيقي (زي طالب شاف الامتحان قبل ما يدخله).</p><p>الحل: ثلاث مجموعات بأدوار مختلفة:</p>",
      points: [
        "<b>Train</b> (مثلا 60%): الموديل بيتعلم منها.",
        "<b>Validation</b> (20%): بنقارن عليها الموديلات والـ hyperparameters ونختار.",
        "<b>Test</b> (20%): نستخدمها <b>مرة واحدة</b> في الآخر لنعرف الأداء المتوقع في الواقع.",
        "النسب مش مقدسة. مع بيانات قليلة بنستخدم cross-validation بدل validation ثابتة (m4)، لكن الـ test برضه بتتفصل.",
      ],
      code: {
        lang: "python",
        src: `import numpy as np
from sklearn.model_selection import train_test_split

X = np.arange(100).reshape(50, 2)
y = np.arange(50) % 2

# first cut the test set away: 20% of 50 = 10
X_tmp, X_test, y_tmp, y_test = train_test_split(
    X, y, test_size=0.2, random_state=0)
# then split the rest: 25% of 40 = 10 for validation
X_train, X_val, y_train, y_val = train_test_split(
    X_tmp, y_tmp, test_size=0.25, random_state=0)
print(len(X_train), len(X_val), len(X_test))   # 30 10 10`,
        note: "الفصل بيتم على مرحلتين: لاحظ إن 25% من الـ 40 الباقيين = 20% من الأصل.",
      },
      interview: [
        { q: "ليه محتاجين validation set لو عندنا test set؟", a: "الـ validation للقرارات: أي موديل، أي hyperparameters. لو استخدمت الـ test لده كل مرة، الـ test بيبقى جزء من عملية التدريب غير المباشرة وبيعطيني رقم متفائل. فبحجز test أقفله ومبصش عليه غير في الآخر مرة واحدة، وده الرقم اللي أقوله للعميل." },
      ],
    },
    {
      kicker: "أخطر مشكلة",
      title: "Data leakage: لما الموديل يشوف الإجابة من غير ما تاخد بالك",
      en: "Data leakage",
      body: "<p><b>Leakage</b> معناه إن معلومة مش هتكون متاحة وقت التوقع الحقيقي دخلت في التدريب. النتيجة: دقة رائعة في التجربة، وفشل في الواقع. تلات صور شائعة:</p>",
      points: [
        "<b>Preprocessing قبل التقسيم</b>: تعمل <code>StandardScaler().fit(X)</code> على كل البيانات وبعدين تقسم. المتوسط والانحراف اتحسبوا بصفوف الاختبار، فمعلومة منها دخلت التدريب. التسريب هنا خفيف عادة لكنه غلط منهجي.",
        "<b>Target leakage</b>: عمود هو نتيجة الـ label أو بيتسجل بعده. مثال: بتتنبأ هل العميل هيسيب الخدمة وفي الجدول عمود «تاريخ إلغاء الاشتراك». أو عمود «تم رد المبلغ» وإنت بتتنبأ بالاحتيال.",
        "<b>Time-based leakage</b>: بيانات فيها زمن (مبيعات، أسعار) وإنت بتقسم عشوائي، فالموديل بيتدرب على أيام بعد أيام الاختبار، يعني بيتنبأ بالماضي من المستقبل. في الواقع هو مش هيشوف المستقبل.",
      ],
      codes: [
        {
          lang: "python",
          title: "target leakage: عمود بيكشف الإجابة",
          src: `# 'leak' is created after the outcome, so it copies y
leak = y + rng.normal(scale=0.01, size=n)
# honest features only:    accuracy 0.71 (baseline 0.698)
# with the leaking column: accuracy 1.0`,
          note: "جربناها فعلا على بيانات عشوائية: من غير العمود المسرّب الموديل ما بيتفوقش على الـ baseline (0.71 مقابل 0.698)، ومعاه بيوصل 1.0. الدقة المثالية أول علامة تشك فيها.",
        },
        {
          lang: "python",
          title: "time split: الماضي للتدريب والمستقبل للاختبار",
          src: `df = df.sort_values("day")
cut = int(len(df) * 0.8)
train, test = df.iloc[:cut], df.iloc[cut:]
print(train["day"].max() < test["day"].min())   # True`,
          note: "مع البيانات الزمنية افصل بالترتيب، مش عشوائي.",
        },
      ],
      pitfall: "لو موديلك جاب دقة 99% من أول محاولة على مشكلة صعبة، متفرحش: ادوّر على leakage الأول. اسأل عن كل عمود: «هل هعرف القيمة دي وقت التوقع الفعلي؟»",
      interview: [
        { q: "إيه هو data leakage؟ اديني مثال.", a: "هو دخول معلومة في التدريب مش هتكون متاحة وقت التوقع الحقيقي، فالأداء المقاس بيبقى أحسن من الواقع. مثال target leakage: بتتنبأ هل العميل هيلغي الاشتراك وعندك عمود «تاريخ الإلغاء». ومثال preprocessing: أعمل scaling على كل الداتا قبل التقسيم فمتوسط الاختبار يدخل التدريب. العلاج: أقسم الأول، وأعمل كل الـ preprocessing جوه Pipeline يتعلم من التدريب بس، وأراجع كل عمود بسؤال «هعرفه وقت التوقع؟»." },
        { q: "عندك بيانات مبيعات يومية لسنتين. إزاي تقسمها؟", a: "بالزمن: أول 18 شهر مثلا للتدريب وآخر 6 للاختبار (وأحيانا time series split بنوافذ متتالية). التقسيم العشوائي هيحط أيام بعد أيام الاختبار في التدريب فالموديل يشوف المستقبل، ودقة الاختبار هتبقى مبالغ فيها." },
      ],
    },
    {
      kicker: "التقسيم",
      title: "Stratified split: نفس النسب في كل جزء",
      en: "Stratified sampling",
      body: "<p>لو 10% من بياناتك فئة نادرة، التقسيم العشوائي ممكن بالصدفة يحط عدد قليل (أو صفر) منها في الاختبار. <code>stratify=y</code> بتضمن إن نسبة كل فئة في التدريب والاختبار قريبة من نسبتها الأصلية.</p>",
      code: {
        lang: "python",
        src: `y = np.array([1] * 10 + [0] * 90)       # 10% positives
X = rng.normal(size=(100, 2))

for strat in (None, y):
    _, _, a, b = train_test_split(
        X, y, test_size=0.2, random_state=1, stratify=strat)
    print(strat is not None, a.mean(), b.mean(), b.sum())
# False 0.125 0.0 0    <- test set has no positives at all!
# True  0.1   0.1 2    <- both parts keep the 10%`,
        note: "من غير stratify، الاختبار مفيهوش ولا حالة موجبة فمفيش حاجة نقيسها. الأرقام طلعت من تشغيل فعلي بـ <code>random_state=1</code>.",
      },
      focus: [{ label: "احفظها", text: "في classification، خصوصا لو الفئات مش متساوية: استخدم <code>stratify=y</code> كعادة." }],
    },
    {
      kicker: "القيم الناقصة",
      title: "Missing values: احذف، املا، أو علّم",
      en: "Handling missing values",
      body: "<p>أول حاجة: افهم <b>ليه</b> القيمة ناقصة. «الدخل ناقص لأن العميل رفض يقوله» معلومة في حد ذاتها. استراتيجيات شائعة، ولكل واحدة ثمن:</p>",
      points: [
        "<b>حذف الصفوف</b> (<code>dropna</code>): بسيط لو الناقص قليل جدا. لو كتير هتخسر بيانات، ولو الناقص مش عشوائي هتخلي العينة منحازة.",
        "<b>حذف العمود</b>: لو أغلبه ناقص (مثلا فوق 60%) وملوش قيمة واضحة. الرقم ده قاعدة عملية مش قانون.",
        "<b>الملء بقيمة</b> (imputation): الرقمي بالـ median (أمتن من المتوسط مع القيم الشاذة)، والفئوي بالأكثر تكرارا أو بفئة «missing».",
        "<b>علامة الغياب</b>: عمود جديد 0/1 يقول «القيمة كانت ناقصة»، لأن الغياب نفسه ممكن يكون إشارة.",
      ],
      code: {
        lang: "python",
        src: `import numpy as np, pandas as pd
from sklearn.impute import SimpleImputer

df = pd.DataFrame({"age": [25, np.nan, 40, 31, np.nan]})
print(df.isna().sum().to_dict())          # {'age': 2}

imp = SimpleImputer(strategy="median", add_indicator=True)
print(imp.fit_transform(df[["age"]]))
# [[25.  0.]
#  [31.  1.]    <- median of 25, 40, 31 is 31, flag = 1
#  [40.  0.]
#  [31.  0.]
#  [31.  1.]]`,
        note: "الـ median اتحسب من القيم الموجودة (25 و40 و31) = 31. العمود التاني علامة الغياب. في الاستخدام الحقيقي بنعمل <code>fit</code> على التدريب بس.",
      },
      pitfall: "ملء القيم بالمتوسط على كل البيانات قبل التقسيم هو leakage. والـ <code>SimpleImputer</code> على عمود نصي لازم الناقص فيه <code>np.nan</code> (مش <code>None</code>) عشان يتعرف عليه.",
    },
    {
      kicker: "الفئات",
      title: "Encoding: تحويل النصوص لأرقام من غير ما نكذب على الموديل",
      en: "One-hot vs ordinal encoding",
      body: "<p>الموديلات بتفهم أرقام. لو عندك عمود «اللون»، لو رقمته (أحمر=0، أخضر=1، أزرق=2) الموديل هيفتكر إن أزرق ضعف أخضر وإن في ترتيب. فالاختيار حسب نوع الفئة:</p>",
      points: [
        "<b>One-hot</b> للفئات من غير ترتيب (لون، مدينة): عمود 0/1 لكل فئة.",
        "<b>Ordinal</b> للفئات اللي ليها ترتيب حقيقي (S < M < L، تعليم): رقم لكل فئة بالترتيب اللي تحدده إنت.",
        "<b>High cardinality</b> (آلاف الفئات زي معرف المنتج أو الرمز البريدي): one-hot هيعمل آلاف الأعمدة. بدائل: تجميع الفئات النادرة في «other»، أو target encoding (بحذر شديد لأنه سهل يعمل leakage)، أو hashing. وأشجار القرار بتتعامل مع ordinal للفئات أحسن من الموديلات الخطية.",
      ],
      code: {
        lang: "python",
        src: `colors = np.array([["red"], ["green"], ["red"], ["blue"]])
enc = OneHotEncoder(handle_unknown="ignore")
print(enc.fit_transform(colors).toarray())
# [[0. 0. 1.]   columns: blue, green, red
#  [0. 1. 0.]
#  [0. 0. 1.]
#  [1. 0. 0.]]
print(enc.transform([["yellow"]]).toarray())   # [[0. 0. 0.]]

sizes = np.array([["S"], ["L"], ["M"], ["S"]])
o = OrdinalEncoder(categories=[["S", "M", "L"]])
print(o.fit_transform(sizes).ravel())          # [0. 2. 1. 0.]`,
        note: "<code>handle_unknown=\"ignore\"</code> مهمة: فئة جديدة وقت التوقع (yellow) بتتحول لأصفار بدل ما البرنامج يقع.",
      },
      interview: [
        { q: "إمتى تستخدم one-hot ولا ordinal encoding؟", a: "One-hot للفئات اللي مفيهاش ترتيب زي المدينة أو اللون، عشان الموديل ميفتكرش إن رقم أكبر معناه قيمة أكبر. Ordinal لما فيه ترتيب حقيقي زي S وM وL، وبحدد الترتيب بإيدي. ولو الفئة ليها آلاف القيم بتجنب one-hot لأنه بيضخم عدد الأعمدة، وبجمع النادر في «other» أو بستخدم target encoding بحذر عشان ميبقاش leakage." },
      ],
    },
    {
      kicker: "المقاييس",
      title: "Feature scaling: standardization و min-max",
      en: "Scaling features",
      body: "<p>لو عمود «العمر» بين 20 و60 وعمود «الدخل» بين 3000 و30000، الخوارزميات اللي بتعتمد على مسافات أو على gradient descent هتتأثر بالدخل أكتر بس لأن أرقامه أكبر، مش لأنه أهم. التسوية بتحل ده:</p>",
      code: {
        lang: "text",
        src: `standardization:  z = (x - mean) / std       -> mean 0, std 1
min-max:          z = (x - min) / (max - min) -> range 0 to 1

x = [10, 20, 30, 100]   (mean 40, std 35.36, min 10, max 100)
standardized: [-0.849, -0.566, -0.283, 1.697]
min-max:      [ 0.000,  0.111,  0.222, 1.000]`,
        note: "الأرقام من <code>StandardScaler</code> و<code>MinMaxScaler</code> فعلا. لاحظ إن القيمة الشاذة 100 ضغطت الباقي في min-max (كلهم تحت 0.25).",
      },
      points: [
        "<b>محتاجة scaling</b>: kNN، SVM، الانحدار الخطي واللوجستي (خصوصا مع regularization)، الشبكات العصبية، PCA، وأي حاجة بتستخدم gradient descent.",
        "<b>مش محتاجة</b>: الأشجار والغابات والـ boosting، لأنها بتقسم بعتبة على عمود واحد وترتيب القيم مبيتغيرش بالتسوية.",
        "Standardization هي الافتراضي الشائع. Min-max مفيد لما تحتاج مدى ثابت (صور 0-255)، لكنه حساس للقيم الشاذة.",
        "بنعمل <code>fit</code> على التدريب بس و<code>transform</code> على الباقي.",
      ],
      interview: [
        { q: "أنهي موديلات محتاجة feature scaling وأنهي لأ؟ وليه؟", a: "المحتاجة هي اللي بتحسب مسافات أو بتتدرب بـ gradient descent أو بتعاقب الأوزان: kNN وSVM والانحدار (خصوصا مع regularization) والشبكات العصبية وPCA. من غير scaling العمود ذو الأرقام الكبيرة بيسيطر على المسافة، وبيبطّأ التدريب. الأشجار والغابات والـ boosting مش محتاجة لأنها بتقارن عمود واحد بعتبة وترتيب القيم مبيتغيرش." },
      ],
    },
    {
      kicker: "القيم الشاذة",
      title: "Outliers: اكتشفها بقاعدة IQR وقرر بعقلك",
      en: "Outliers and the IQR rule",
      body: "<p>القيمة الشاذة نقطة بعيدة جدا عن الباقي. ممكن تكون <b>غلطة</b> (عمر 999) فتتصلح أو تتشال، وممكن تكون <b>حقيقية ومهمة</b> (معاملة احتيال فعلا) فتشيلها تبقى بتمسح اللي بتدور عليه. القرار منطقي مش آلي.</p><p>قاعدة IQR الشائعة: Q1 و Q3 هما الربع الأول والتالت، والمدى بينهم IQR. أي قيمة تحت <code>Q1 - 1.5 * IQR</code> أو فوق <code>Q3 + 1.5 * IQR</code> نعتبرها مشبوهة.</p>",
      code: {
        lang: "python",
        src: `x = np.array([12, 14, 15, 15, 16, 18, 19, 20, 22, 95])
q1, q3 = np.percentile(x, [25, 75])      # 15.0 and 19.75
iqr = q3 - q1                            # 4.75
lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr  # 7.875 and 26.875
print(x[(x < lo) | (x > hi)])            # [95]
print(np.clip(x, lo, hi)[-1])            # 26.875  (capping)
print(np.mean(x), np.median(x))          # 24.6 17.0`,
        note: "قيمة واحدة (95) رفعت المتوسط لـ 24.6 بينما الـ median فضل 17. عشان كده الـ median أمتن.",
      },
      points: [
        "الخيارات: تسيبها (الأشجار مش حساسة ليها)، تعمل capping (clip) للحدود، تعمل log transform لو التوزيع مائل، أو تشيلها لو غلطة مؤكدة.",
        "الموديلات الحساسة: الانحدار الخطي (MSE بيضخم الخطأ الكبير)، kNN، min-max scaling.",
        "حدد الحدود من التدريب، وطبقها على الباقي.",
      ],
    },
    {
      kicker: "عدم التوازن",
      title: "Class imbalance: الدقة بتكدب لما فئة تكون نادرة",
      en: "Imbalanced classes",
      body: "<p>لو 5% بس من المعاملات احتيال، موديل بيرد «مش احتيال» دايما بيجيب 95% دقة وهو عمليا ملوش أي فايدة. جربنا ده على بيانات مصطنعة (4.5% موجب، 13 حالة موجبة في الاختبار): الـ baseline الغبي بيجيب 0.957.</p>",
      code: {
        lang: "python",
        src: `# synthetic data: 4.5% positives, logistic regression
for cw in (None, "balanced"):
    m = LogisticRegression(class_weight=cw).fit(X_train, y_train)
    p = m.predict(X_test)
    print(cw, accuracy_score(y_test, p),
          recall_score(y_test, p), precision_score(y_test, p))
# None      acc 0.967  recall 0.231  precision 1.0
# balanced  acc 0.84   recall 0.923  precision 0.203`,
        note: "بدون وزن الموديل دقته أعلى لكنه بيلقط 23% من الحالات النادرة بس. مع <code>class_weight=\"balanced\"</code> بيلقط 92% بس بيطلّع إنذارات كاذبة كتير. أي واحد أحسن ده قرار عمل مش دقة (m4).",
      },
      points: [
        "<b>Class weights</b>: <code>class_weight=\"balanced\"</code> بتخلي غلطة الفئة النادرة أغلى في الـ loss. مفيش بيانات بتتغير.",
        "<b>Oversampling</b> للفئة النادرة (تكرار أو توليد زي SMOTE من مكتبة imbalanced-learn) و<b>undersampling</b> للكبيرة. بنعملهم على التدريب <b>بس</b>، أبدا على الاختبار.",
        "غير الدقة: استخدم precision وrecall وPR-AUC (m4)، وغيّر الـ threshold.",
        "مفيش طريقة «أحسن دايما»: جرّب على validation.",
      ],
      pitfall: "عمل oversampling قبل تقسيم train/test: نسخ من نفس الحالة هتبقى في الاتنين، فالموديل بيشوف في الاختبار حالات حفظها. لازم التقسيم الأول.",
      interview: [
        { q: "عندك dataset فيه 1% احتيال. موديلك دقته 99%. إيه المشكلة وإزاي تتعامل؟", a: "99% هي دقة موديل بيرد «مش احتيال» دايما، فالرقم ملوش معنى. أقيس بـ recall وprecision وPR-AUC، وأقسم بـ stratify عشان الفئة النادرة تظهر في كل جزء. وللتدريب أجرب <code>class_weight=\"balanced\"</code> أو oversampling على التدريب بس، وأضبط الـ threshold حسب تكلفة الاحتيال الفايت مقابل تكلفة الإنذار الكاذب." },
      ],
    },
    {
      kicker: "الحل الجذري",
      title: "Pipeline و ColumnTransformer: الخطوات كلها في كائن واحد",
      en: "Pipelines as the cure for leakage",
      body: "<p>بدل ما تكتب كل خطوة بإيدك وتنسى مرة تعمل <code>fit</code> على التدريب بس، بتحط الخطوات في <code>Pipeline</code>: <code>pipe.fit(X_train, y_train)</code> بيعمل <code>fit_transform</code> لكل خطوة على التدريب بس، و<code>pipe.predict(X_test)</code> بيطبق <code>transform</code> بس. ومع cross-validation الـ preprocessing بيتعاد جوه كل fold، فمفيش تسريب.</p><p><code>ColumnTransformer</code> بتطبق معالجة مختلفة على أعمدة مختلفة (رقمي بشكل وفئوي بشكل).</p>",
      code: {
        lang: "python",
        src: `from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression

num = Pipeline([("imp", SimpleImputer(strategy="median")),
                ("sc", StandardScaler())])
pre = ColumnTransformer([
    ("num", num, ["age", "income"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["city"]),
])
pipe = Pipeline([("pre", pre), ("clf", LogisticRegression())])

pipe.fit(X_train, y_train)       # all steps learn from train only
print(pipe.score(X_test, y_test))
print(cross_val_score(pipe, X, y, cv=3))  # no leakage across folds`,
        note: "شغّلنا الكود على جدول صغير (12 صف: age وincome وcity). الأرقام هناك مش ذات معنى لأن العينة صغيرة جدا، المهم الشكل.",
      },
      pitfall: "الأعمدة اللي مذكورة في ColumnTransformer بس هي اللي بتتحول، والباقي بيتشال (<code>remainder=\"drop\"</code> افتراضيا). لو عندك عمود نسيته هيختفي من غير تنبيه.",
      interview: [
        { q: "ليه Pipeline بيمنع data leakage؟", a: "لأن كل خطوات الـ preprocessing (imputer وscaler وencoder) بتتعلم جوه <code>fit</code> على بيانات التدريب بس، وفي <code>predict</code> بتطبق اللي اتعلمته على بيانات جديدة. ومع <code>cross_val_score(pipe, ...)</code> الـ pipeline كله بيتعاد في كل fold، فالـ scaler مبيشوفش صفوف الـ fold اللي بيتقيم عليه. لو عملت scaling بإيدك قبل cross-validation، المتوسط اتحسب بكل الصفوف وده تسريب." },
      ],
    },
    {
      kicker: "الأدوات",
      title: "NumPy و pandas اللي هتستخدمهم كل يوم",
      en: "NumPy and pandas essentials",
      code: {
        lang: "python",
        src: `import numpy as np, pandas as pd

df = pd.DataFrame({
    "day": pd.date_range("2026-01-01", periods=10),
    "city": ["Cairo", "Giza"] * 5,
    "sales": [10, 12, 11, 15, 14, 18, 17, 21, 20, 24],
})
print(df.groupby("city")["sales"].mean().to_dict())
# {'Cairo': 14.4, 'Giza': 18.0}
print(df["city"].value_counts().to_dict())   # {'Cairo': 5, 'Giza': 5}
print(df[df["sales"] > 15].shape)            # (5, 3)  filter rows
X = df[["sales"]].to_numpy()                 # 2D: (10, 1)

a = np.array([[1.0, 2.0], [3.0, 6.0]])
print(a.mean(axis=0), a.shape)   # [2. 4.] (2, 2)  mean per column
print(a[a > 2])                  # [3. 6.]  boolean mask`,
        note: "<code>df[[\"sales\"]]</code> (قوسين مزدوجين) بترجع DataFrame 2D، و<code>df[\"sales\"]</code> بترجع Series 1D. وده نفس مشكلة الـ shape في m1.",
      },
      points: [
        "<code>axis=0</code> يعني «على طول الصفوف» فالنتيجة قيمة لكل عمود. <code>axis=1</code> قيمة لكل صف.",
        "<code>df.isna().sum()</code> أول سطر بتكتبه على أي dataset جديد، و<code>df.describe()</code> التاني.",
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: split على مرحلتين",
      lang: "python",
      code: `from sklearn.model_selection import train_test_split

X_tmp, X_test, y_tmp, y_test = train_test_split(
    X, y, test_size=0.2, random_state=0, stratify=y)
X_train, X_val, y_train, y_val = train_test_split(
    X_tmp, y_tmp, test_size=0.25, random_state=0,
    stratify=y_tmp)
print(len(X_train), len(X_val), len(X_test))`,
    },
    {
      title: "اكتب: IQR للقيم الشاذة",
      lang: "python",
      code: `import numpy as np

x = np.array([12, 14, 15, 15, 16, 18, 19, 20, 22, 95])
q1, q3 = np.percentile(x, [25, 75])
iqr = q3 - q1
lo = q1 - 1.5 * iqr
hi = q3 + 1.5 * iqr
mask = (x < lo) | (x > hi)
print(x[mask])`,
    },
    {
      title: "اكتب: Pipeline كامل",
      lang: "python",
      code: `from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression

num = Pipeline([("imp", SimpleImputer(strategy="median")),
                ("sc", StandardScaler())])
pre = ColumnTransformer([
    ("num", num, ["age", "income"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["city"]),
])
pipe = Pipeline([("pre", pre), ("clf", LogisticRegression())])`,
      note: "الـ imports طويلة، لكنها بتتكتب كل مرة. الأهم تحفظ شكل ColumnTransformer: (اسم، transformer، قايمة أعمدة).",
    },
  ],

  tasks: [
    {
      title: "تقسيم ثلاثي متوازن",
      lang: "python",
      prompt: "<p>اكتب دالة <code>three_way(X, y, seed=0)</code> بتقسم البيانات 60% تدريب و20% validation و20% test، مع <code>stratify</code> في الخطوتين، وترجع 6 قيم بالترتيب: <code>X_train, X_val, X_test, y_train, y_val, y_test</code>.</p>",
      examples: [{ in: "X من 100 صف، y فيه 20 واحد، [len(p) for p in three_way(X, y)]", out: "[60, 20, 20, 60, 20, 20]" }],
      hints: [
        "افصل الـ test الأول (<code>test_size=0.2</code>)، وبعدين اقسم الباقي.",
        "الباقي بعد فصل 20% هو 80%. عشان تاخد 20% من الأصل للـ validation محتاج <code>test_size=0.25</code> من الباقي.",
      ],
      solution: `from sklearn.model_selection import train_test_split

def three_way(X, y, seed=0):
    X_tmp, X_test, y_tmp, y_test = train_test_split(
        X, y, test_size=0.2, random_state=seed, stratify=y)
    X_train, X_val, y_train, y_val = train_test_split(
        X_tmp, y_tmp, test_size=0.25, random_state=seed,
        stratify=y_tmp)
    return X_train, X_val, X_test, y_train, y_val, y_test`,
      explain: "جربناها على 100 صف فيها 20 موجب: الأحجام 60/20/20 وعدد الموجب 12 و4 و4، يعني النسبة 20% محفوظة في كل جزء. نقطة الاختبار: 0.25 من 80 = 20. والـ stratify في الخطوة التانية مهمة عشان الـ validation كمان يحتفظ بالنسبة.",
    },
    {
      title: "القيم الشاذة بقاعدة IQR",
      lang: "python",
      prompt: "<p>اكتب دالة <code>iqr_outliers(values)</code> بتاخد قايمة أرقام وترجع <b>قايمة Python</b> بالقيم اللي خارج <code>[Q1 - 1.5*IQR, Q3 + 1.5*IQR]</code> بنفس ترتيبها الأصلي. استخدم <code>np.percentile</code>.</p>",
      examples: [
        { in: "iqr_outliers([12, 14, 15, 15, 16, 18, 19, 20, 22, 95])", out: "[95]" },
        { in: "iqr_outliers([1, 2, 3])", out: "[]" },
      ],
      hints: [
        "<code>np.percentile(values, [25, 75])</code> بترجع Q1 وQ3 مع بعض.",
        "حوّل القايمة لـ <code>np.asarray</code> واستخدم boolean mask: <code>(v &lt; lo) | (v &gt; hi)</code>.",
      ],
      solution: `import numpy as np

def iqr_outliers(values):
    v = np.asarray(values)
    q1, q3 = np.percentile(v, [25, 75])
    iqr = q3 - q1
    lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    return v[(v < lo) | (v > hi)].tolist()

print(iqr_outliers([12, 14, 15, 15, 16, 18, 19, 20, 22, 95]))  # [95]`,
      explain: "الحدود هنا 7.875 و26.875 والقيمة 95 بس خارجها. استخدمنا <code>|</code> مش <code>or</code> لأن الأخيرة مبتشتغلش مع مصفوفات NumPy. <code>.tolist()</code> بترجع أرقام Python عادية. التعقيد O(n log n) بسبب الـ percentile.",
    },
    {
      title: "موديل بيعالج الناقص والمقاييس",
      lang: "python",
      prompt: "<p>اكتب دالة <code>make_model()</code> بترجع <code>Pipeline</code> (استخدم <code>make_pipeline</code>) من تلات خطوات بالترتيب: <code>SimpleImputer(strategy=\"median\")</code> ثم <code>StandardScaler()</code> ثم <code>LogisticRegression()</code>. الموديل ده لازم يقبل بيانات فيها <code>np.nan</code> من غير ما يقع.</p>",
      examples: [{ in: "make_model().fit(Xn, yn).predict([[9.5], [1.5]])  # Xn فيه np.nan", out: "[1 0]" }],
      hints: [
        "<code>make_pipeline(step1, step2, step3)</code> بتديك أسماء تلقائية للخطوات.",
        "الترتيب مهم: الـ imputer الأول لأن <code>LogisticRegression</code> بترفض أي nan، فلازم الناقص يتملي قبلها.",
      ],
      solution: `import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

def make_model():
    return make_pipeline(
        SimpleImputer(strategy="median"),
        StandardScaler(),
        LogisticRegression(),
    )

Xn = np.array([[1.0], [2.0], [np.nan], [8.0],
               [9.0], [10.0], [3.0], [np.nan]])
yn = np.array([0, 0, 0, 1, 1, 1, 0, 1])
m = make_model().fit(Xn, yn)
print(m.predict([[9.5], [1.5]]))   # [1 0]`,
      explain: "شغّلناها وطلع <code>[1 0]</code>. الـ pipeline بيحسب الـ median والمتوسط من بيانات <code>fit</code> بس، ويطبقهم على أي بيانات جديدة. ولأن الخطوات في كائن واحد، تقدر تمرره لـ <code>cross_val_score</code> من غير تسريب.",
    },
  ],

  quiz: [
    {
      q: "قسمنا 50 صف: أول مرة test_size=0.2، وبعدين الباقي بـ test_size=0.25. كام صف في الـ validation؟",
      answer: ["10"],
      why: "الخطوة الأولى بتفصل 10 للـ test والباقي 40. 25% من الـ 40 = 10 للـ validation، والتدريب 30.",
    },
    {
      q: "أنهي واحد من دول تسريب (leakage)؟",
      options: [
        "تدريب الموديل على 80% من البيانات",
        "عمل <code>StandardScaler().fit(X)</code> على كل البيانات قبل التقسيم",
        "استخدام <code>random_state</code> ثابت",
        "استخدام <code>stratify=y</code>",
      ],
      answer: 1,
      why: "المتوسط والانحراف اتحسبوا بصفوف الاختبار فدخلت معلومة منها في التدريب. الباقي ممارسات سليمة.",
    },
    {
      q: "بتتنبأ هل العميل هيسدد القرض. أنهي عمود يعتبر target leakage؟",
      options: [
        "دخل العميل الشهري",
        "عدد القروض السابقة",
        "عدد مرات التأخر المسجلة <b>بعد</b> صرف القرض",
        "عمر العميل",
      ],
      answer: 2,
      why: "التأخر بعد الصرف معلومة مش هتكون عندك وقت اتخاذ قرار الإقراض، وهي نتيجة السلوك اللي بتتنبأ بيه. الباقي معروف قبل القرار.",
    },
    {
      q: "تعمل إيه لبيانات مبيعات يومية لسنتين لو عايز قياس صادق؟",
      options: [
        "تقسيم عشوائي 80/20",
        "تقسيم بالزمن: الأقدم للتدريب والأحدث للاختبار",
        "تقسيم عشوائي مع stratify",
        "تدريب واختبار على نفس البيانات",
      ],
      answer: 1,
      why: "الموديل في الواقع هيتنبأ بالمستقبل من الماضي بس. التقسيم العشوائي بيخليه يشوف أيام بعد أيام الاختبار.",
    },
    {
      q: "عمود «المدينة» فيه 3 قيم مختلفة (Cairo, Giza, Alex). بعد <code>OneHotEncoder</code> كام عمود يطلع؟",
      answer: ["3"],
      why: "عمود 0/1 لكل فئة، يعني 3 أعمدة (والصف الواحد فيه واحد بس بقيمة 1). ولو استخدمت <code>drop=\"first\"</code> هيبقوا 2، بس ده مش الافتراضي.",
    },
    {
      q: "أنهي موديل <b>مش</b> محتاج feature scaling عادة؟",
      options: [
        "kNN",
        "Logistic Regression مع regularization",
        "Random Forest",
        "SVM",
      ],
      answer: 2,
      why: "الأشجار بتقارن عمود واحد بعتبة، وترتيب القيم مبيتغيرش بالتسوية. الباقي بيحسبوا مسافات أو بيتأثروا بحجم الأوزان.",
    },
    {
      q: "القيم 12, 14, 15, 15, 16, 18, 19, 20, 22, 95: Q1 = 15 و Q3 = 19.75. كام الـ IQR؟",
      answer: ["4.75"],
      why: "IQR = Q3 - Q1 = 19.75 - 15 = 4.75. الحد الأعلى للقيم العادية = 19.75 + 1.5 × 4.75 = 26.875، فـ 95 شاذة.",
    },
    {
      q: "dataset فيه 98% من فئة. موديل دقته 98%. إيه الاستنتاج الأدق؟",
      options: [
        "الموديل ممتاز",
        "الرقم مساوٍ لموديل غبي بيرد بالفئة الكبيرة دايما، فمحتاج مقاييس تانية",
        "لازم نضيف oversampling على الاختبار",
        "لازم نحذف الفئة الكبيرة",
      ],
      answer: 1,
      why: "98% هي بالظبط دقة الـ baseline. الـ oversampling بيتعمل على التدريب بس، وحذف الفئة الكبيرة بيضيع بيانات. الحل: precision وrecall وPR-AUC.",
    },
    {
      q: "ليه الأفضل تحط الـ scaler جوه Pipeline وإنت بتعمل cross-validation؟",
      options: [
        "عشان الكود يبقى أقصر بس",
        "عشان الـ scaler يتعلم من التدريب بتاع كل fold بس ومشوفش الـ fold المقيَّم",
        "عشان الـ cross-validation مبتشتغلش من غيره",
        "عشان الـ scaler يبقى أسرع",
      ],
      answer: 1,
      why: "الـ pipeline بيتعاد في كل fold، فالمتوسط والانحراف بيتحسبوا من بيانات التدريب بس. لو سكّلت قبل الـ CV كل fold بيشوف إحصائيات الصفوف المقيَّمة.",
    },
    {
      q: "بتعمل oversampling للفئة النادرة. إمتى؟",
      options: [
        "على كل البيانات قبل التقسيم",
        "على الـ test set بعد التقسيم",
        "على التدريب بس، بعد التقسيم",
        "مبتتعملش أبدا",
      ],
      answer: 2,
      why: "لو عملته قبل التقسيم، نسخ من نفس الحالة تنزل في التدريب والاختبار فالموديل يشوف في الاختبار حالات حفظها. والاختبار لازم يفضل بتوزيع الواقع.",
    },
  ],
};
