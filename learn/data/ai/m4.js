window.LEVELS = window.LEVELS || {};
window.LEVELS["ai/m4"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "موديل بدقة 99% ممكن يكون عديم القيمة، والتقييم هو اللي يقول",
      en: "Why evaluation is the core skill",
      body: "<p>أي حد يقدر يدرّب موديل بـ <code>fit</code>. اللي بيفرّق المهندس الكويس هو إنه <b>يعرف الموديل ده شغال فعلا ولا لأ</b> قبل ما يتنشر. وده معناه: يقيس على بيانات جديدة، يختار المقياس اللي يناسب المشكلة، يقارن بـ baseline، ويضبط الـ hyperparameters من غير ما يغش نفسه.</p><p>الأسئلة دي هي أكتر حاجة بتتسأل في مقابلات الـ ML للمبتدئين، لأنها بتكشف هل فاهم ولا حافظ كود.</p>",
      points: [
        "أول سؤال: الموديل بيحفظ ولا بيتعلم؟ (overfitting).",
        "تاني سؤال: بنقيس بإيه؟ الدقة ممكن تكدب (confusion matrix وprecision وrecall).",
        "تالت سؤال: بنقارن بإيه؟ (baseline).",
      ],
    },
    {
      kicker: "المشكلة الأساسية",
      title: "Underfitting و Overfitting",
      en: "Underfitting vs overfitting",
      body: "<p><b>Underfitting</b>: الموديل أبسط من إنه يلقط النمط، فبيغلط حتى على بيانات التدريب. <b>Overfitting</b>: الموديل معقد زيادة وحفظ التدريب بما فيه من noise، فبيبقى ممتاز على التدريب وضعيف على بيانات جديدة. التشخيص بيتم بمقارنة خطأ التدريب بخطأ الاختبار.</p>",
      code: {
        lang: "python",
        title: "نفس البيانات: كثيرة حدود بدرجات مختلفة",
        src: `import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

rng = np.random.default_rng(0)
x = np.sort(rng.uniform(0, 1, 30)).reshape(-1, 1)
y = np.sin(2 * np.pi * x).ravel() + rng.normal(scale=0.2, size=30)
Xtr, Xte, ytr, yte = train_test_split(
    x, y, test_size=0.4, random_state=1)

for d in (1, 4, 15):      # degree = model complexity
    m = make_pipeline(PolynomialFeatures(d), LinearRegression())
    m.fit(Xtr, ytr)
    print(d, round(mean_squared_error(ytr, m.predict(Xtr)), 3),
          round(mean_squared_error(yte, m.predict(Xte)), 3))
# 1   0.238 0.283   both high        -> underfitting
# 4   0.022 0.046   both low         -> good
# 15  0.007 0.073   train tiny, test worse -> overfitting`,
        note: "الدرجة 15 بتنزّل خطأ التدريب لـ 0.007 لكن خطأ الاختبار أعلى من الدرجة 4. كل ما زودنا التعقيد خطأ التدريب بيقل دايما، أما الاختبار فبيقل وبعدين يزيد. (عينة صغيرة: الأرقام بتتغير حسب التقسيم، شفنا تقسيمات خطأ درجة 15 فيها وصل لعشرات.)",
      },
      interview: [
        { q: "إزاي تعرف إن الموديل بيعمل overfitting؟", a: "بقارن الأداء على التدريب بالأداء على validation أو test. لو التدريب ممتاز والاختبار أضعف بفرق كبير (مثلا 100% مقابل 70%)، ده overfitting. لو الاتنين ضعاف، ده underfitting. العلاج للأول: بيانات أكتر، موديل أبسط، regularization، cross-validation، early stopping. وللتاني: موديل أقوى أو features أحسن." },
      ],
    },
    {
      kicker: "الفكرة وراها",
      title: "Bias و Variance بكلام بسيط",
      en: "Bias and variance",
      body: "<p>تخيل رامي سهام. الـ <b>bias</b> هو الخطأ المنتظم: كل سهامه بتروح ناحية شمال الهدف (افتراضات الموديل غلط أو بسيطة جدا). الـ <b>variance</b> هو التشتت: سهامه كل مرة في مكان مختلف لأنه حساس جدا لتفاصيل بيانات التدريب اللي اتدرب عليها.</p>",
      points: [
        "<b>Bias عالي</b> = underfitting: موديل بسيط (خط مستقيم لبيانات منحنية). نفس الغلط على أي عينة.",
        "<b>Variance عالي</b> = overfitting: موديل معقد، لو غيرت بيانات التدريب شوية يتغير تماما.",
        "فيه <b>trade-off</b>: زيادة التعقيد بتقلل الـ bias وتزود الـ variance. الهدف النقطة اللي مجموع الخطأ فيها أقل.",
        "الـ noise (العشوائية الأصلية في البيانات) خطأ مفيش موديل يقدر يشيله.",
      ],
      interview: [
        { q: "اشرح bias-variance trade-off.", a: "الخطأ على بيانات جديدة بيتقسم تقريبا لـ bias (افتراضات الموديل بسيطة فبيغلط بشكل منتظم)، وvariance (الموديل حساس لعينة التدريب فبيتغير كتير لو غيرتها)، وnoise ملوش حل. الموديل البسيط bias عالي variance قليل، والمعقد العكس. بنختار التعقيد المناسب بالـ validation، وبنقلل الـ variance بـ regularization أو بيانات أكتر أو averaging (زي random forest)." },
      ],
    },
    {
      kicker: "التشخيص",
      title: "Learning curves: هل أجيب بيانات أكتر ولا موديل أقوى؟",
      en: "Learning curves",
      body: "<p>منحنى التعلم بيرسم الأداء على التدريب وعلى validation مقابل <b>حجم بيانات التدريب</b>. شكله بيقولك العلاج.</p>",
      code: {
        lang: "python",
        src: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import learning_curve
from sklearn.tree import DecisionTreeClassifier

X, y = load_breast_cancer(return_X_y=True)
for d in (1, None):
    t = DecisionTreeClassifier(max_depth=d, random_state=0)
    sizes, tr, va = learning_curve(
        t, X, y, train_sizes=[0.2, 0.5, 1.0], cv=5,
        shuffle=True, random_state=0)
    print(d, sizes, tr.mean(1).round(3), va.mean(1).round(3))
# 1    [ 91 227 455] train [0.96  0.93  0.924] val [0.919 0.91  0.9]
# None [ 91 227 455] train [1.    1.    1.   ] val [0.905 0.91  0.917]`,
        note: "الشجرة بعمق 1: التدريب والاختبار قريبين وعاليين شوية (0.924 و0.9) ومبيتحسنوش بزيادة البيانات، يعني bias، محتاج موديل أقوى. الشجرة بعمق مفتوح: التدريب 1.0 والاختبار 0.917 والفجوة كبيرة، يعني variance، وزيادة البيانات أو تبسيط الموديل بتفيد.",
      },
      points: [
        "فجوة كبيرة بين المنحنيين = variance: بيانات أكتر أو regularization أو موديل أبسط.",
        "المنحنيين قريبين وعند أداء ضعيف = bias: موديل أقوى أو features أحسن، وبيانات أكتر مش هتفيد.",
      ],
    },
    {
      kicker: "التقييم الصح",
      title: "Cross-validation: تقييم أثبت من تقسيم واحد",
      en: "k-fold and stratified k-fold",
      body: "<p>تقسيم validation واحد ممكن يطلع حظ كويس أو وحش. <b>k-fold</b>: بنقسم بيانات التدريب لـ k أجزاء (folds)، وندرب k مرة، كل مرة جزء مختلف هو الـ validation والباقي تدريب، وناخد متوسط النتايج (والانحراف المعياري كمقياس ثبات). <b>Stratified</b> بتحافظ على نسب الفئات في كل fold.</p>",
      code: {
        lang: "python",
        src: `from sklearn.model_selection import (cross_val_score,
                                     StratifiedKFold, train_test_split)
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.dummy import DummyClassifier

X, y = load_breast_cancer(return_X_y=True)
X_tmp, X_test, y_tmp, y_test = train_test_split(
    X, y, test_size=0.2, random_state=0, stratify=y)   # test locked away

pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
cv = StratifiedKFold(5, shuffle=True, random_state=0)
sc = cross_val_score(pipe, X_tmp, y_tmp, cv=cv)
print(sc.round(3), round(sc.mean(), 3), round(sc.std(), 3))
# [0.989 0.967 0.978 0.967 0.989] 0.978 0.01
base = DummyClassifier(strategy="most_frequent")
print(cross_val_score(base, X_tmp, y_tmp, cv=cv).mean().round(3))  # 0.626`,
        note: "المتوسط 0.978 والانحراف 0.01، والـ baseline 0.626. الـ CV هنا على جزء التدريب بس (X_tmp)؛ الـ test اتحجز قبلها ومحدش لمسه.",
      },
      pitfall: "ضبط الـ hyperparameters (أو اختيار الموديل) بالنظر لنتيجة الـ test، حتى لو \"مرة واحدة بس\" ومرة تانية. كل قرار بتاخده بناء على الـ test بيسرّب منه معلومة. الـ test بتشوفه مرة واحدة في الآخر.",
      interview: [
        { q: "إيه فايدة cross-validation، وإمتى stratified؟", a: "بتدّي تقدير أثبت للأداء من تقسيم واحد: بدرب k مرة على أجزاء مختلفة وباخد المتوسط والانحراف. بستخدم stratified في classification خصوصا لو الفئات مش متوازنة عشان كل fold يحتفظ بنسب الفئات. وبحط الـ preprocessing جوه pipeline عشان يتعاد في كل fold. والـ CV بتتعمل على بيانات التدريب بس، والـ test set بتفضل مقفولة للتقييم النهائي." },
      ],
    },
    {
      kicker: "التصنيف",
      title: "Confusion matrix و Accuracy و Precision و Recall و F1",
      en: "The confusion matrix and its metrics",
      body: "<p>الدقة لوحدها بتخبي الأخطاء. الـ <b>confusion matrix</b> بتقسم كل التوقعات لأربع خانات. تخيل فلتر spam على 1000 إيميل، منهم 60 spam فعلا:</p>",
      code: {
        lang: "text",
        src: `                 predicted spam   predicted ok
actual spam            TP = 40         FN = 20     (60)
actual ok              FP = 10         TN = 930    (940)

accuracy  = (TP + TN) / total = (40 + 930) / 1000 = 0.970
precision = TP / (TP + FP)    = 40 / 50           = 0.800
recall    = TP / (TP + FN)    = 40 / 60           = 0.667
F1        = 2*P*R / (P + R)   = 2*0.8*0.667/1.467 = 0.727

baseline (always "ok"): accuracy = 940 / 1000 = 0.94`,
        note: "تحققنا منها بـ scikit-learn (<code>confusion_matrix</code> ثم الدوال الأربعة) والأرقام نفسها. الدقة 97% شكلها ممتاز، لكن الموديل فوّت ثلث الـ spam (recall 0.667)، والـ baseline الغبي جاب 94%.",
      },
      terms: [
        ["precision", "الدقة الإيجابية", "من اللي قلت عنه «spam»، كام فعلا spam؟ بيجاوب على: ثقتي في الإنذار."],
        ["recall", "الاسترجاع / الحساسية", "من الـ spam الحقيقي، كام لقطت؟ بيجاوب على: كام فاتني."],
        ["F1", "المتوسط التوافقي", "رقم واحد بيوازن precision وrecall، وبيقع جامد لو واحد فيهم ضعيف."],
      ],
      focus: [{ label: "احفظها", text: "Precision = TP/(TP+FP) (إنذارات صح من الإنذارات). Recall = TP/(TP+FN) (الحالات الحقيقية اللي لقطتها)." }],
      interview: [
        { q: "اشرح precision و recall بمثال، وإمتى بتفضل واحد على التاني؟", a: "Precision: من اللي الموديل قال عنه «موجب»، كام فعلا موجب. Recall: من الموجبين الحقيقيين، كام الموديل لقط. في فلتر spam لو بخاف أضيّع إيميل مهم فبفضل precision عالي (قليل من الإنذارات الكاذبة). في فحص طبي لمرض خطير بفضل recall عالي (مفوتش مريض) وأتحمل إنذارات كاذبة. وF1 بيجمعهم لو الاتنين مهمين." },
        { q: "ليه الدقة (accuracy) مقياس مضلل مع بيانات غير متوازنة؟", a: "لأن الفئة الكبيرة بتسيطر عليها. لو 99% من المعاملات سليمة، موديل بيقول «سليمة» دايما دقته 99% وهو ملقطش ولا احتيال. فبستخدم precision وrecall وF1 وPR-AUC، وبقارن دايما بـ baseline." },
      ],
    },
    {
      kicker: "القرار",
      title: "أنهي مقياس يهم؟ حسب تكلفة الغلط",
      en: "Choosing the metric",
      body: "<p>مفيش مقياس «أحسن». السؤال: <b>أنهي غلط أغلى؟</b></p>",
      points: [
        "<b>Spam filter</b>: الإنذار الكاذب (إيميل مهم راح للـ spam) مؤلم، فبنهتم بـ <b>precision</b>.",
        "<b>فحص طبي لمرض خطير (screening)</b>: تفويت مريض أخطر من فحص زيادة، فبنهتم بـ <b>recall</b> (وبعدين فحص تاني يصفي الإنذارات الكاذبة).",
        "<b>اكتشاف احتيال</b>: الاحتيال نادر (قد يكون 0.1%)، فالدقة بلا معنى. بنهتم بـ recall بحد أدنى للـ precision عشان فريق المراجعة ميتغرقش، ونقيس بـ PR-AUC.",
        "لو الاتنين مهمين ومفيش تفضيل واضح: <b>F1</b>.",
        "ومرات الأحسن ترجمة الغلط لفلوس: تكلفة تفويت احتيال × عدد الفايت + تكلفة المراجعة × عدد الإنذارات.",
      ],
      pitfall: "اختيار المقياس بعد ما تشوف النتايج اللي تعجبك. حدد المقياس قبل التجربة، من مشكلة العمل.",
    },
    {
      kicker: "منحنيات",
      title: "ROC و AUC و Precision-Recall curve",
      en: "ROC AUC and PR curves",
      body: "<p>الموديل بيطلع احتمالات، والعتبة اللي بتحولها لقرار بتتغير. <b>ROC curve</b> بيرسم لكل عتبة: الـ recall (TPR) مقابل نسبة الإنذارات الكاذبة من السالبين (FPR). <b>AUC</b> هي المساحة تحت المنحنى: 0.5 يعني تخمين عشوائي و1.0 فصل مثالي. ومعناها العملي: احتمال إن الموديل يدّي درجة أعلى لحالة موجبة عشوائية من حالة سالبة عشوائية.</p><p>مع البيانات غير المتوازنة الـ ROC ممكن يبان متفائل لأن FPR بيتقسم على عدد سالبين ضخم. الـ <b>Precision-Recall curve</b> و<b>average precision</b> بتركز على الفئة النادرة وأصدق.</p>",
      code: {
        lang: "python",
        src: `# synthetic data: 3.7% positives (22 positives in the test set)
p = model.predict_proba(X_test)[:, 1]
print(roc_auc_score(y_test, p))            # 0.943
print(average_precision_score(y_test, p))  # 0.677
print(y_test.mean())                       # 0.037  <- what random scores AP`,
        note: "الـ AUC بتقول 0.943 شكلها ممتاز، بينما average precision (ملخص PR curve) 0.677 وأقل بكتير. والـ AP لموديل عشوائي بيقرب من نسبة الفئة النادرة (0.037). قارن به مش بـ 0.5.",
      },
      interview: [
        { q: "إيه معنى AUC = 0.9؟ ولو الداتا غير متوازنة؟", a: "معناها إن لو اخترت حالة موجبة وحالة سالبة عشوائيا، فاحتمال إن الموديل يدّي الموجبة درجة أعلى هو 90%. وهي مستقلة عن العتبة. لكن مع فئة نادرة جدا الـ ROC-AUC ممكن تبان عالية حتى لو الـ precision ضعيفة، فبفضل PR curve وaverage precision لأنهم بيعكسوا الأداء على الفئة اللي تهمني." },
      ],
    },
    {
      kicker: "قرار عمل",
      title: "العتبة (threshold) مش 0.5 بالضرورة",
      en: "The threshold is a business decision",
      body: "<p>الموديل بيدّي احتمال، وإنت اللي بتختار فوق أنهي رقم تتصرف. تخفيض العتبة بيلقط أكتر (recall أعلى) بس بيزود الإنذارات الكاذبة (precision أقل). مفيش عتبة صح، في عتبة مناسبة للتكلفة.</p>",
      code: {
        lang: "python",
        src: `for t in (0.5, 0.3, 0.15, 0.1, 0.05):
    pred = (p >= t).astype(int)
    print(t, precision_score(y_test, pred), recall_score(y_test, pred),
          pred.sum())
# t     precision recall  alerts
# 0.5   0.833     0.455   12
# 0.3   0.667     0.727   24
# 0.15  0.4       0.727   40
# 0.1   0.333     0.773   51
# 0.05  0.224     0.773   76`,
        note: "من تشغيل فعلي على نفس بيانات الـ 22 حالة موجبة. من 0.5 لـ 0.3 الـ recall قفز من 0.455 لـ 0.727 مقابل نزول الـ precision، أما من 0.15 لـ 0.05 بنزود الإنذارات من 40 لـ 76 وكسبنا recall ضعيف جدا. النقطة المناسبة بتتحدد من فريق المراجعة: لو يقدر يراجع 25 حالة، عتبة 0.3 معقولة.",
      },
      pitfall: "ضبط العتبة على الـ test set. اختارها على validation أو بالـ cross-validation، وبعدين اختبرها مرة على الـ test.",
    },
    {
      kicker: "الانحدار",
      title: "مقاييس الانحدار: MAE و MSE و RMSE و R²",
      en: "Regression metrics",
      body: "<p>الأخطاء هنا أرقام مش صح/غلط. القيم الحقيقية [100, 150, 200, 250, 300] والتوقعات [110, 140, 210, 240, 400]، يعني آخر نقطة غلطانة بـ 100 والباقي بـ 10:</p>",
      code: {
        lang: "text",
        src: `errors:  +10, -10, +10, -10, +100
MAE  = mean(|error|)         = (10+10+10+10+100)/5 = 28.0
MSE  = mean(error^2)         = (100*4 + 10000)/5   = 2080.0
RMSE = sqrt(MSE)             = 45.607
R2   = 1 - SS_res / SS_tot   = 1 - 10400 / 25000   = 0.584
       (SS_tot = sum((y - mean_y)^2), mean_y = 200)
R2 of "always predict the mean" = 0`,
        note: "الأرقام اتأكدت بـ scikit-learn. لاحظ إن الخطأ الواحد الكبير (100) رفع الـ RMSE لـ 45.6 بينما الـ MAE 28. التربيع بيضخم الأخطاء الكبيرة.",
      },
      points: [
        "<b>MAE</b>: متوسط الغلط بوحدة البيانات نفسها («غلطان 28 جنيه في المتوسط»). أمتن مع القيم الشاذة.",
        "<b>RMSE</b>: بنفس الوحدة، لكن بيعاقب الأخطاء الكبيرة أكتر. استخدمه لو الغلطة الكبيرة غالية.",
        "<b>R²</b>: نسبة التباين اللي الموديل فسّرها مقارنة بالتوقع بالمتوسط. 1 مثالي، 0 زي ما تتنبأ بالمتوسط دايما، وممكن يكون سالب لو الموديل أسوأ من المتوسط.",
        "<b>MSE</b> بوحدة مربعة فمش سهل يتقرا، بنستخدمه في التدريب وبنعرض RMSE.",
      ],
      interview: [
        { q: "MAE ولا RMSE؟ إمتى؟", a: "الاتنين بنفس وحدة البيانات. MAE بيعامل كل الأخطاء بنفس الوزن وأقل تأثرا بالقيم الشاذة، فمناسب لو الغلط الكبير مش كارثي. RMSE بيربع الأخطاء فبيعاقب الغلطات الكبيرة أكتر، فمناسب لما الغلطة الكبيرة غالية (توقع حمل كهرباء مثلا). ولو RMSE أكبر بكتير من MAE يبقى فيه أخطاء كبيرة قليلة." },
      ],
    },
    {
      kicker: "الانضباط",
      title: "Baselines وضبط الـ hyperparameters بالطريقة الصح",
      en: "Dummy baselines and grid / random search",
      body: "<p>قبل أي موديل معقد: <b>baseline</b>. للتصنيف <code>DummyClassifier</code> (أكتر فئة تكرارا)، وللانحدار <code>DummyRegressor</code> (المتوسط). أي موديل مش بيتفوق عليه بفرق واضح ملوش لازمة.</p><p>بعدين الضبط: <b>Grid search</b> بيجرب كل التوليفات في شبكة محددة، و<b>random search</b> بيجرب عدد ثابت من توليفات عشوائية وغالبا بيغطي مساحة أكبر بنفس الوقت لما hyperparameters كتير. الاتنين بيتعملوا مع cross-validation وجوه pipeline، على بيانات التدريب بس.</p>",
      code: {
        lang: "python",
        src: `from sklearn.model_selection import GridSearchCV

grid = {"logisticregression__C": [0.01, 0.1, 1, 10, 100]}
gs = GridSearchCV(pipe, grid, cv=cv, scoring="roc_auc")
gs.fit(X_tmp, y_tmp)                 # search on training data only
print(gs.best_params_, round(gs.best_score_, 4))
# {'logisticregression__C': 0.1} 0.9953

print(roc_auc_score(y_test, gs.predict_proba(X_test)[:, 1]))  # 0.994
# the test set is used once, after the choice is made

# random search needs scipy distributions (installed with scikit-learn)
# from sklearn.model_selection import RandomizedSearchCV
# RandomizedSearchCV(model, {"max_depth": randint(2, 10)}, n_iter=5, cv=cv)`,
        note: "اسم الـ hyperparameter جوه pipeline بيبقى <code>اسم_الخطوة__اسم_المعامل</code>. اختار 0.1 بـ AUC بالـ CV = 0.9953 وعلى الـ test طلعت 0.994، قريب، وده الطبيعي لما نضبط صح.",
      },
      points: [
        "الـ scoring لازم يناسب المشكلة: <code>\"roc_auc\"</code> أو <code>\"f1\"</code> أو <code>\"average_precision\"</code> للتصنيف غير المتوازن، مش الدقة الافتراضية.",
        "مساحة بحث أكبر = فرصة أكبر للضبط على noise الـ validation. لو الفرق بين توليفتين أصغر من الانحراف المعياري بين الـ folds، اختار الأبسط.",
        "بعد البحث، <code>GridSearchCV</code> بيعيد التدريب بأحسن إعداد (<code>refit=True</code>) وبتقدر تستخدم <code>gs.predict</code>.",
      ],
      interview: [
        { q: "إزاي تضبط hyperparameters من غير ما تسرّب من الـ test؟", a: "بفصل الـ test set الأول ومبلمسوش. على باقي البيانات بعمل GridSearchCV أو RandomizedSearchCV مع cross-validation جوه pipeline، فبتقيّم كل توليفة على folds، وبختار الأحسن بالمقياس المناسب. بعد الاختيار بقيّم الموديل النهائي مرة واحدة على الـ test وده الرقم اللي أقوله. Random search غالبا أفضل لما الـ hyperparameters كتير لأنه بيغطي كل واحد بقيم أكتر." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: مقاييس من الأعداد",
      lang: "python",
      code: `tp, fp, fn, tn = 40, 10, 20, 930

accuracy = (tp + tn) / (tp + fp + fn + tn)
precision = tp / (tp + fp)
recall = tp / (tp + fn)
f1 = 2 * precision * recall / (precision + recall)

print(round(accuracy, 3), round(precision, 3))
print(round(recall, 3), round(f1, 3))`,
    },
    {
      title: "اكتب: cross-validation",
      lang: "python",
      code: `from sklearn.model_selection import StratifiedKFold
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = make_pipeline(StandardScaler(), LogisticRegression())
cv = StratifiedKFold(5, shuffle=True, random_state=0)
scores = cross_val_score(pipe, X_tmp, y_tmp, cv=cv)
print(scores.mean().round(3), scores.std().round(3))`,
    },
    {
      title: "اكتب: grid search كامل",
      lang: "python",
      code: `from sklearn.model_selection import GridSearchCV
from sklearn.metrics import roc_auc_score

grid = {"logisticregression__C": [0.01, 0.1, 1, 10]}
gs = GridSearchCV(pipe, grid, cv=cv, scoring="roc_auc")
gs.fit(X_tmp, y_tmp)
print(gs.best_params_, round(gs.best_score_, 4))

proba = gs.predict_proba(X_test)[:, 1]
print(round(roc_auc_score(y_test, proba), 4))`,
      note: "بيفترض إن <code>pipe</code> و<code>cv</code> معرّفين من التمرين اللي قبله. أهم نقطة: <code>fit</code> على <code>X_tmp</code> (التدريب)، والـ test بيدخل بس في آخر سطرين.",
    },
  ],

  tasks: [
    {
      title: "مقاييس التصنيف من العدّادات",
      lang: "python",
      prompt: "<p>اكتب دالة <code>metrics_from_counts(tp, fp, fn, tn)</code> بترجع <code>dict</code> فيه المفاتيح <code>accuracy</code> و<code>precision</code> و<code>recall</code> و<code>f1</code>، كل قيمة مقرّبة لـ 3 أرقام عشرية. لو المقام صفر (مفيش توقعات موجبة مثلا) رجّع <code>0.0</code> للمقياس ده بدل ما الكود يقع.</p>",
      examples: [
        { in: "metrics_from_counts(40, 10, 20, 930)", out: "{'accuracy': 0.97, 'precision': 0.8, 'recall': 0.667, 'f1': 0.727}" },
        { in: "metrics_from_counts(0, 0, 5, 95)", out: "{'accuracy': 0.95, 'precision': 0.0, 'recall': 0.0, 'f1': 0.0}" },
      ],
      hints: [
        "precision = tp / (tp + fp) بس لو <code>tp + fp</code> مش صفر.",
        "f1 = 2 × p × r / (p + r)، وفكر في الحالة اللي فيها p + r = 0.",
      ],
      solution: `def metrics_from_counts(tp, fp, fn, tn):
    total = tp + fp + fn + tn
    precision = tp / (tp + fp) if tp + fp else 0.0
    recall = tp / (tp + fn) if tp + fn else 0.0
    f1 = (2 * precision * recall / (precision + recall)
          if precision + recall else 0.0)
    return {
        "accuracy": round((tp + tn) / total, 3),
        "precision": round(precision, 3),
        "recall": round(recall, 3),
        "f1": round(f1, 3),
    }

print(metrics_from_counts(40, 10, 20, 930))`,
      explain: "المثال التاني (موديل مبيقولش «موجب» أبدا) بيوضح ليه الدقة مضللة: 0.95 دقة و0 recall. وحماية القسمة على صفر مهمة لأن الحالة دي بتحصل فعلا مع موديل بيرد بفئة واحدة.",
    },
    {
      title: "تقرير cross-validation",
      lang: "python",
      prompt: "<p>اكتب دالة <code>cv_report(model, X, y)</code> بتعمل <code>StratifiedKFold(n_splits=5, shuffle=True, random_state=0)</code> وترجع tuple <code>(mean, std)</code> للدقة بين الـ folds، كل واحد مقرّب لـ 3 أرقام عشرية. جربها على <code>load_breast_cancer</code> مع pipeline من <code>StandardScaler</code> و<code>LogisticRegression(max_iter=1000)</code>.</p>",
      examples: [{ in: "cv_report(pipe, X, y)  # كل البيانات، 5 folds", out: "(0.979, 0.014)" }],
      hints: [
        "<code>cross_val_score(model, X, y, cv=cv)</code> بترجع مصفوفة فيها درجة لكل fold.",
        "حوّل النتيجة لـ <code>float</code> عند الرجوع عشان تطلع أرقام Python عادية: <code>round(scores.mean(), 3)</code>.",
      ],
      solution: `from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

def cv_report(model, X, y):
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
    scores = cross_val_score(model, X, y, cv=cv)
    return round(float(scores.mean()), 3), round(float(scores.std()), 3)

X, y = load_breast_cancer(return_X_y=True)
pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
print(cv_report(pipe, X, y))   # (0.979, 0.014)`,
      explain: "الـ scaler جوه الـ pipeline فبيتعلم من كل fold تدريب لوحده. مفيش تسريب. الانحراف 0.014 بيقول إن النتيجة ثابتة نسبيا بين الـ folds. وحط في بالك إن دي كل البيانات؛ في مشروع حقيقي كنت هتحجز test قبلها.",
    },
    {
      title: "اختار العتبة بحد أدنى recall",
      lang: "python",
      prompt: "<p>اكتب دالة <code>pick_threshold(y_true, probs, min_recall)</code> بترجع <b>أعلى precision</b> عتبة من العتبات الممكنة (القيم الموجودة في <code>probs</code> نفسها)، بشرط إن الـ recall عندها <b>على الأقل</b> <code>min_recall</code>. التوقع موجب لو <code>prob &gt;= threshold</code>. لو أكتر من عتبة بنفس الـ precision، رجّع الأصغر.</p>",
      examples: [
        { in: "y=[0,0,0,0,1,0,1,1,0,1]\nprobs=[.1,.2,.3,.35,.4,.5,.6,.7,.75,.9]\npick_threshold(y, probs, 1.0)", out: "0.4" },
        { in: "pick_threshold(y, probs, 0.75)", out: "0.6" },
      ],
      hints: [
        "لف على <code>sorted(set(probs))</code> كعتبات، وحسب TP وFP وFN لكل واحدة.",
        "احتفظ بأحسن precision لحد دلوقتي، وحدّثها بس لو الـ precision أكبر <b>بصرامة</b> (عشان تفضل الأصغر عند التعادل).",
      ],
      solution: `import numpy as np

def pick_threshold(y_true, probs, min_recall):
    y_true = np.asarray(y_true)
    probs = np.asarray(probs)
    best_t, best_p = None, -1.0
    for t in sorted(set(probs.tolist())):
        pred = probs >= t
        tp = int(np.sum(pred & (y_true == 1)))
        fn = int(np.sum(~pred & (y_true == 1)))
        fp = int(np.sum(pred & (y_true == 0)))
        recall = tp / (tp + fn)
        precision = tp / (tp + fp) if tp + fp else 0.0
        if recall >= min_recall and precision > best_p:
            best_t, best_p = t, precision
    return best_t

y = [0, 0, 0, 0, 1, 0, 1, 1, 0, 1]
probs = [.1, .2, .3, .35, .4, .5, .6, .7, .75, .9]
print(pick_threshold(y, probs, 1.0))    # 0.4
print(pick_threshold(y, probs, 0.75))   # 0.6`,
      explain: "عند 0.4 بنلقط الأربع موجبين (recall 1.0) بـ precision 4/6. عند 0.6 بنلقط 3 من 4 (recall 0.75) بـ precision 3/4 = 0.75، فبنختارها لما الحد الأدنى 0.75. ده بالظبط شغل تحديد العتبة من متطلبات العمل. على بيانات حقيقية بنضبطها على validation مش test.",
    },
  ],

  quiz: [
    {
      q: "TP=40 و FP=10 و FN=20. كام الـ recall؟ (قرّب لـ 3 أرقام عشرية)",
      answer: ["0.667", "0.67", "2/3"],
      why: "Recall = TP / (TP + FN) = 40 / 60 = 0.667. الـ precision هي اللي بتستخدم FP: 40 / 50 = 0.8.",
    },
    {
      q: "موديل دقته 100% على التدريب و 72% على الاختبار. الأقرب تشخيص إيه؟",
      options: [
        "Underfitting",
        "Overfitting (variance عالي)",
        "Bias عالي",
        "الموديل مثالي",
      ],
      answer: 1,
      why: "فجوة كبيرة بين التدريب والاختبار علامة حفظ، يعني variance عالي. Underfitting كان هيظهر أداء ضعيف على الاتنين.",
    },
    {
      q: "فحص طبي لمرض خطير، وفحص ثاني هيأكد أي حالة إيجابية. أنهي مقياس تهتم بيه أكتر؟",
      options: [
        "Precision",
        "Accuracy",
        "Recall",
        "R²",
      ],
      answer: 2,
      why: "تفويت مريض (FN) أخطر من إنذار كاذب هيتصفى بالفحص التاني، فبنرفع الـ recall. الدقة بتتخدع لو المرض نادر، والـ R² للانحدار.",
    },
    {
      q: "AUC = 0.5 معناها إيه؟",
      options: [
        "الموديل مثالي",
        "الموديل دايما غلط",
        "الموديل بيرتب الحالات زي التخمين العشوائي",
        "الدقة 50% بالظبط",
      ],
      answer: 2,
      why: "0.5 يعني إن احتمال إن الموجبة تاخد درجة أعلى من السالبة نصف نصف، يعني ملوش قدرة تمييز. (لو اتعكس الترتيب كله هتطلع AUC قريبة من 0، مش 0.5.)",
    },
    {
      q: "قيم حقيقية [100, 200] وتوقعات [110, 180]. كام الـ MAE؟",
      answer: ["15", "15.0"],
      why: "الأخطاء المطلقة 10 و20 والمتوسط 15. الـ MSE كان هيبقى (100 + 400) / 2 = 250.",
    },
    {
      q: "عندك 2% احتيال فقط. أنهي مقياس تقييم أنسب كملخص؟",
      options: [
        "Accuracy",
        "Average precision أو PR-AUC مع recall عند precision مقبولة",
        "MAE",
        "R²",
      ],
      answer: 1,
      why: "الدقة هتبقى 98% لموديل ميعملش حاجة. PR-AUC بتركز على الفئة النادرة. MAE وR² للانحدار.",
    },
    {
      q: "أنهي طريقة صح لضبط hyperparameters؟",
      options: [
        "جرّب على الـ test set وخد الأحسن",
        "اضبط على بيانات التدريب بدون validation",
        "اضبط على test ثم ادرب مرة تانية على test",
        "GridSearchCV على بيانات التدريب بس، وبعدين تقييم واحد على الـ test",
      ],
      answer: 3,
      why: "الاختيار على بيانات تدريب بـ CV، والـ test مرة واحدة بعد اختيار الإعداد. الباقي كله بيدخل الـ test في عملية الاختيار فيسرّب منه.",
    },
    {
      q: "منحنى التعلم: التدريب 0.99 والـ validation 0.78 والفجوة ثابتة حتى مع بيانات أكتر. أنهي علاج منطقي؟",
      options: [
        "Regularization أو موديل أبسط أو features أقل",
        "موديل أعقد بكتير",
        "نشيل الـ validation set",
        "نقلل البيانات",
      ],
      answer: 0,
      why: "فجوة كبيرة = variance، فنبسط الموديل أو نضيف regularization. موديل أعقد هيزود الحفظ. تقليل البيانات بيوسّع الفجوة عادة.",
    },
    {
      q: "أنهي مقياس بيعاقب الغلطة الكبيرة الواحدة أكتر؟",
      options: ["MAE", "الاتنين بالتساوي", "R²", "RMSE"],
      answer: 3,
      why: "RMSE بيربع الأخطاء قبل المتوسط فخطأ 100 بيدخل كـ 10000. MAE بيحسبه 100 بس.",
    },
    {
      q: "في classification غير متوازن، ليه تستخدم StratifiedKFold؟",
      options: [
        "عشان يخلي الـ CV أسرع",
        "عشان كل fold يحتفظ بنسب الفئات فمتفضلش fold بدون حالات من الفئة النادرة",
        "عشان يلغي الحاجة لـ test set",
        "عشان الدقة تعلى",
      ],
      answer: 1,
      why: "التقسيم العشوائي ممكن يحط الفئة النادرة بعدد صغير جدا في fold فتتقيس بشكل مش مستقر. الـ stratified بيحافظ على النسب. ولا بيغني عن الـ test ولا بيحسن الدقة.",
    },
  ],
};
