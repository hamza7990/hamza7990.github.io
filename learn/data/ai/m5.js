window.LEVELS = window.LEVELS || {};
window.LEVELS["ai/m5"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "على البيانات الجدولية، الأشجار والـ boosting هي الأقوى غالبا",
      en: "Why tree ensembles matter",
      body: "<p>أغلب الداتا في الشغل جداول: عملاء، معاملات، منتجات، قراءات حساسات. على النوع ده، تجميعة أشجار قرار (random forest أو gradient boosting) هي عادة أول اختيار قوي، وبتكسب في مسابقات وبيانات الشركات كتير. مش محتاجة scaling تقريبا، بتتعامل مع علاقات مش خطية وتفاعلات بين الأعمدة، وبتديك feature importance.</p><p>كمان دي أحسن مثال على فكرة مهمة في ML: <b>موديل ضعيف لوحده، لكن مجموعة منهم بطريقة ذكية قوية</b>.</p>",
      points: [
        "شجرة واحدة: بسيطة وسهل تفهمها، لكن بتحفظ بسهولة (variance عالي).",
        "Random forest: أشجار كتير مستقلة نتوسط إجاباتها.",
        "Gradient boosting: أشجار صغيرة ورا بعض، كل واحدة بتصلح أخطاء اللي قبلها.",
      ],
      interview: [
        { q: "ليه الأشجار والـ boosting بتكسب غالبا الشبكات العصبية على البيانات الجدولية؟", a: "مفيش قانون، لكن الملاحظة المتكررة (في مسابقات ودراسات مقارنة) إن الجداول فيها أعمدة بأنواع وأحجام مختلفة، وكتير منها فئات أو غير مهمة، وعلاقات مش ملساء. الأشجار بتتعامل مع ده طبيعيا (عتبات، تفاعلات، مش حساسة للمقاييس ولا لأعمدة ملهاش لازمة)، وبتحتاج بيانات أقل وضبط أقل. الشبكات بتتفوق لما البيانات صور أو صوت أو نص أو كمية ضخمة، وساعات بتفيد في الجداول كمان بس مش الاختيار الافتراضي." },
      ],
    },
    {
      kicker: "الفكرة",
      title: "شجرة القرار = مجموعة أسئلة نعم/لأ متداخلة",
      en: "A decision tree as a set of questions",
      body: "<p>الشجرة زي لعبة «20 سؤال». كل <b>node</b> داخلي بيسأل سؤال على feature واحد («هل <code>x &lt;= 7.5</code>؟»)، وكل إجابة بتودي لفرع. في الآخر <b>leaf</b> فيه التوقع (الفئة الأكتر تكرارا في الورقة، أو متوسط القيم لو regression). التدريب = إن الخوارزمية بتختار الأسئلة بنفسها من البيانات.</p>",
      code: {
        lang: "python",
        src: `import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text

x = np.array([1, 2, 3, 4, 5, 5.5, 6, 7, 8, 9]).reshape(-1, 1)
y = np.array([0, 0, 1, 0, 0, 0, 1, 0, 1, 1])

tree = DecisionTreeClassifier(max_depth=1, random_state=0).fit(x, y)
print(export_text(tree, feature_names=["x"], show_weights=True))
# |--- x <= 7.50
# |   |--- weights: [6.00, 2.00] class: 0
# |--- x >  7.50
# |   |--- weights: [0.00, 2.00] class: 1`,
        note: "<code>weights: [6, 2]</code> يعني في الورقة دي 6 حالات من الفئة 0 و2 من الفئة 1. الشجرة اختارت العتبة 7.5 (نص المسافة بين 7 و8) لوحدها.",
      },
      points: [
        "الشجرة بتقسم الفراغ لمستطيلات، وبتتوقع ثابت جوه كل مستطيل. عشان كده بتعمل حدود فاصلة بشكل سلالم.",
        "ميزتها الكبيرة: بتقدر تقراها وتشرحها لحد مش فني.",
      ],
    },
    {
      kicker: "الرياضة اللي تهم",
      title: "إزاي الشجرة بتختار السؤال؟ Gini و Entropy",
      en: "Gini impurity and entropy",
      body: "<p>الشجرة عايزة أسئلة بتخلي كل فرع «نضيف» قد ما يمكن، يعني أغلبه من فئة واحدة. بنقيس «عدم النظافة» بـ <b>impurity</b>:</p>",
      code: {
        lang: "text",
        src: `Gini    = 1 - sum(p_k^2)
Entropy = - sum(p_k * log2(p_k))      (p_k = share of class k)

node with 6 of class A and 4 of class B:  p = 0.6, 0.4
Gini    = 1 - (0.36 + 0.16)           = 0.48
Entropy = -(0.6*log2 0.6 + 0.4*log2 0.4) = 0.971

pure node [10, 0]:  Gini = 0, Entropy = 0
50/50 node [5, 5]:  Gini = 0.5, Entropy = 1.0   (worst case)

Candidate split 1: left [5 A, 1 B], right [1 A, 3 B]
  Gini left  = 1 - (25/36 + 1/36) = 0.278
  Gini right = 1 - (1/16 + 9/16)  = 0.375
  weighted   = 0.6*0.278 + 0.4*0.375 = 0.3167
  gain       = 0.48 - 0.3167         = 0.1633

Candidate split 2: left [6 A, 2 B], right [0 A, 2 B]
  weighted   = 0.8*0.375 + 0.2*0 = 0.30
  gain       = 0.48 - 0.30       = 0.18   <- better`,
        note: "الأرقام اتحسبت بالكود وتطابقت. الشجرة بتجرب كل feature وكل عتبة ممكنة، وبتاخد اللي بيدّي أكبر انخفاض في الـ impurity (gain). دي نفس الـ split اللي اختارته الشجرة في السلايد اللي فات (العتبة 7.5).",
      },
      terms: [
        ["impurity", "عدم النقاء", "قد إيه الـ node مخلوط من فئات مختلفة. صفر = فئة واحدة."],
        ["gain", "المكسب", "impurity الأب ناقص المتوسط الموزون لـ impurity الفرعين."],
      ],
      pitfall: "نسيان الوزن: الـ impurity بتاعة كل فرع بتتضرب في نسبة عدد العينات اللي راحت له. فرع صغير جدا نقي مبيصلحش split وحده.",
      interview: [
        { q: "إزاي شجرة القرار بتختار الـ split؟ احسب Gini لـ node فيه 6 و 4.", a: "بتجرب كل feature وكل عتبة، وبتحسب الـ impurity (Gini أو entropy) للفرعين، وبتاخد المتوسط الموزون بعدد العينات، وبتختار الـ split اللي بيقلل الـ impurity أكتر من الأب (أعلى gain). Gini للـ node (6 و4) = 1 - (0.6² + 0.4²) = 1 - 0.52 = 0.48، والـ entropy = 0.971. الاتنين بيدّوا غالبا شجر شبه بعض، والفرق العملي صغير." },
      ],
    },
    {
      kicker: "الخطر",
      title: "العمق والحفظ: شجرة من غير حدود بتحفظ البيانات",
      en: "Depth and overfitting",
      body: "<p>لو سبنا الشجرة تكبر لحد ما كل ورقة تبقى نقية، هتوصل لـ 100% على التدريب لأنها حفظت كل حالة. ده نفس overfitting اللي شفناه في m4. التحكم في العمق هو أهم hyperparameter.</p>",
      code: {
        lang: "python",
        src: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X, y = load_breast_cancer(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(
    X, y, test_size=0.25, random_state=0, stratify=y)

for d in (1, 2, 3, 5, None):
    t = DecisionTreeClassifier(max_depth=d, random_state=0).fit(Xtr, ytr)
    print(d, round(t.score(Xtr, ytr), 3), round(t.score(Xte, yte), 3),
          t.get_n_leaves())
# depth  train  test   leaves
# 1      0.93   0.888   2
# 2      0.932  0.888   4
# 3      0.977  0.916   8
# 5      1.0    0.902  18
# None   1.0    0.902  18   (the tree stopped growing at depth 5)`,
        note: "من عمق 3 لـ 5 التدريب وصل 1.0 والاختبار نزل من 0.916 لـ 0.902. الاختبار هنا 143 صف فقط، يعني الصف الواحد = 0.7%، فالفروق الصغيرة (زي 0.888 مقابل 0.888) تتحرك بتغيير الـ random_state. الاتجاه العام هو المهم مش الرقم.",
      },
      interview: [
        { q: "ليه شجرة القرار بتعمل overfitting بسهولة؟ وإزاي تتحكم فيها؟", a: "لأنها لو اتسابت من غير حدود هتكمل تقسيم لحد ما كل ورقة تبقى نقية، يعني تحفظ التدريب كله بما فيه noise (variance عالي، تدريب 100% واختبار أقل). بتحكم فيها بـ <code>max_depth</code> و<code>min_samples_leaf</code> و<code>min_samples_split</code> و<code>ccp_alpha</code> (pruning)، وبضبطهم بـ cross-validation. أو بستبدلها بـ random forest عشان تقلل الـ variance بالـ averaging." },
      ],
    },
    {
      kicker: "التحكم",
      title: "Pruning و min_samples: خلّي الشجرة تتوقف بدري",
      en: "Pre-pruning and cost-complexity pruning",
      points: [
        "<b>Pre-pruning</b> (إيقاف مبكر): <code>max_depth</code> أقصى عمق، <code>min_samples_split</code> أقل عدد عينات عشان node يتقسم، <code>min_samples_leaf</code> أقل عدد عينات في الورقة، <code>max_leaf_nodes</code>.",
        "<b>Post-pruning</b> (<code>ccp_alpha</code> في scikit-learn): بنكبّر الشجرة كاملة وبعدين نشيل الفروع اللي مكسبها أقل من عقوبة على عدد الأوراق. كل ما <code>ccp_alpha</code> أكبر، الشجرة أصغر.",
        "الاتنين هدفهم نفس الحاجة: تقليل التعقيد = تقليل variance.",
      ],
      code: {
        lang: "python",
        src: `for leaf in (1, 5, 20):
    t = DecisionTreeClassifier(min_samples_leaf=leaf, random_state=0)
    t.fit(Xtr, ytr)
    print("leaf", leaf, round(t.score(Xtr, ytr), 3),
          round(t.score(Xte, yte), 3), t.get_n_leaves())
for a in (0.0, 0.005, 0.02):
    t = DecisionTreeClassifier(ccp_alpha=a, random_state=0).fit(Xtr, ytr)
    print("ccp", a, round(t.score(Xtr, ytr), 3),
          round(t.score(Xte, yte), 3), t.get_n_leaves())
# leaf 1   1.0   0.902  18 leaves     ccp 0.0    1.0   0.902  18
# leaf 5   0.977 0.923  12            ccp 0.005  0.984 0.916   9
# leaf 20  0.93  0.881   6            ccp 0.02   0.932 0.888   4`,
        note: "قيمة معتدلة (leaf=5 أو ccp=0.005) نزّلت التدريب من 1.0 وحسّنت الاختبار شوية، والقيمة المفرطة (leaf=20) بقت تبسيط زيادة (underfitting). بنختار القيمة بالـ cross-validation، مش بالنظر لرقم test واحد.",
      },
    },
    {
      kicker: "Bagging",
      title: "Random Forest: مئات الأشجار بتصوت",
      en: "Random forest, bagging and out-of-bag",
      body: "<p>شجرة واحدة بتتغير كتير لو غيرت العينة شوية. الحل: ندرب <b>أشجار كتير</b> ونتوسط إجاباتها (تصويت في التصنيف، متوسط في الانحدار). التوسط بيقلل الـ variance لأن أخطاء الأشجار المختلفة بتلغي بعض لو مش مرتبطة. ولعمل أشجار مختلفة بنستخدم حيلتين:</p>",
      points: [
        "<b>Bootstrap (bagging)</b>: كل شجرة بتتدرب على عينة عشوائية بالتكرار من صفوف التدريب (بنفس الحجم). يعني كل شجرة بتشوف تقريبا 63% من الصفوف المميزة، والباقي (~37%) بيفضل برا.",
        "<b>Feature subsampling</b>: في كل split الشجرة بتختار من مجموعة عشوائية من الـ features (<code>max_features</code>، والافتراضي في التصنيف جذر عدد الأعمدة) بدل كل الأعمدة. ده بيمنع إن كل الأشجار تتشابه حوالين feature قوي واحد.",
        "<b>Out-of-bag (OOB) score</b>: كل صف ليه أشجار ماشافتوش وقت التدريب، فنقدر نقيّمه بيها. النتيجة تقدير للأداء من غير test set منفصل (<code>oob_score=True</code>).",
      ],
      code: {
        lang: "python",
        src: `from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=100, oob_score=True,
                            random_state=0, n_jobs=1)
rf.fit(Xtr, ytr)
print(round(rf.score(Xtr, ytr), 3), round(rf.score(Xte, yte), 3),
      round(rf.oob_score_, 3))
# 0.998 0.944 0.96   (single unpruned tree: 1.0 / 0.902)`,
        note: "نفس البيانات: شجرة واحدة جابت 0.902 والغابة 0.944. تقدير الـ OOB (0.96) قريب من أداء الاختبار (0.944)، لكن مش بالظبط، عينة صغيرة.",
      },
      interview: [
        { q: "ليه random forest أحسن من شجرة واحدة؟ وإيه دور الـ feature subsampling؟", a: "الشجرة الواحدة variance عالي. الغابة بتدرب أشجار على عينات bootstrap مختلفة وبتتوسط التوقعات، فأخطاؤها العشوائية بتلغي بعض وبيقل الـ variance من غير ما يزيد الـ bias كتير. لو كل الأشجار شافت نفس الـ feature القوي هتتشابه وأخطاؤها تبقى مترابطة والتوسط يفيد أقل، فبنختار في كل split مجموعة features عشوائية عشان نقلل الترابط. وكمان الـ OOB بيدّيني تقدير أداء مجاني." },
      ],
    },
    {
      kicker: "Boosting",
      title: "Gradient Boosting: كل شجرة تصلح أخطاء اللي قبلها",
      en: "Gradient boosting",
      body: "<p>العكس تماما من الغابة: الأشجار هنا <b>صغيرة وضعيفة</b> (عمق 2 أو 3) وبتتدرب <b>بالتتابع</b>. الفكرة بالخطوات:</p>",
      points: [
        "<b>1.</b> ابدأ بتوقع بسيط ثابت (متوسط الـ y في الانحدار).",
        "<b>2.</b> احسب الأخطاء (residuals) = الحقيقي - التوقع الحالي.",
        "<b>3.</b> درّب شجرة صغيرة <b>تتنبأ بالأخطاء دي</b>.",
        "<b>4.</b> ضيف توقع الشجرة للتوقع الحالي بس مضروب في <b>learning rate</b> صغير: <code>pred = pred + lr × tree(x)</code>.",
        "<b>5.</b> كرر. كل شجرة بتصلح اللي لسه غلط. (في التصنيف بتتنبأ بميل الـ log loss بدل الفرق المباشر، والفكرة نفسها: gradient descent بس في فراغ الدوال، ومن هنا الاسم.)",
      ],
      code: {
        lang: "text",
        src: `y = [3, 5, 7]       start: pred = mean = 5
residuals = y - pred = [-2, 0, 2]

tree 1 learns the residuals (suppose perfectly), lr = 0.5:
pred = 5 + 0.5 * [-2, 0, 2] = [4, 5, 6]
residuals = [-1, 0, 1]

tree 2 learns them:
pred = [4, 5, 6] + 0.5 * [-1, 0, 1] = [3.5, 5, 6.5]
residuals = [-0.5, 0, 0.5]       -> the error halves each round`,
        note: "الخطأ بيقل كل جولة بنسبة (1 - lr). الـ learning rate الصغير بيخلي كل شجرة تصلح جزء بس، فالموديل بيقرّب بالراحة وبيعمل overfitting أقل، بس محتاج أشجار أكتر.",
      },
      interview: [
        { q: "الفرق بين random forest و gradient boosting؟", a: "الغابة بتدرب أشجار عميقة نسبيا بالتوازي ومستقلة على عينات bootstrap وبتتوسط (بتقلل الـ variance). الـ boosting بيدرب أشجار صغيرة بالتتابع، كل واحدة بتتدرب على أخطاء المجموع اللي قبلها (بتقلل الـ bias)، وبيتجمعوا بوزن learning rate. الـ boosting غالبا أدق لما بنضبطه صح، لكنه أحساس للـ hyperparameters وللـ noise ويعمل overfitting لو أشجاره كتير، والغابة أسهل وأقل احتياجا للضبط." },
      ],
    },
    {
      kicker: "الضبط",
      title: "learning rate و عدد الأشجار، وأسماء هتسمعها",
      en: "Boosting knobs: learning_rate and n_estimators",
      body: "<p>في الـ boosting الاتنين دول بيتبادلوا: learning rate أصغر يحتاج أشجار أكتر. عدد الأشجار الكتير بيعمل overfitting، فبنوقف بدري (early stopping) أو بنختار العدد بالـ validation.</p>",
      code: {
        lang: "python",
        src: `from sklearn.ensemble import GradientBoostingClassifier

g = GradientBoostingClassifier(learning_rate=0.1, n_estimators=300,
                               max_depth=2, random_state=0)
g.fit(Xtr, ytr)
acc = [(p == yte).mean() for p in g.staged_predict(Xte)]
for n in (1, 10, 50, 100, 200, 300):
    print(n, round(acc[n - 1], 3))
# 1 0.629 | 10 0.923 | 50 0.93 | 100 0.937 | 200 0.937 | 300 0.93`,
        note: "<code>staged_predict</code> بيدّي التوقع بعد كل شجرة. شجرة واحدة = 0.629 (نفس نسبة الفئة الأكبر، يعني لسه ماتعلمتش حاجة مفيدة)، و10 أشجار = 0.923، وبعد ~100 بيستقر تقريبا. الفروق الصغيرة بعد كده noise في 143 صف.",
      },
      points: [
        "<b>XGBoost وLightGBM وCatBoost</b>: مكتبات boosting سريعة ومحسّنة (مكتبات خارجية، مش جزء من scikit-learn). نفس الفكرة بتحسينات في السرعة والذاكرة والتعامل مع الفئات والقيم الناقصة. هتسمعهم كتير في المقابلات، ومنفهمش حاجة جديدة من الفكرة اللي فوق. scikit-learn نفسها فيها <code>HistGradientBoostingClassifier</code> السريع.",
        "الـ hyperparameters الأهم: <code>learning_rate</code> و<code>n_estimators</code> و<code>max_depth</code> (أو عدد الأوراق) و<code>subsample</code>.",
        "ابدأ بـ learning rate صغير (0.05 - 0.1) وأشجار كتير مع early stopping، وده تقليد شائع مش قاعدة مطلقة.",
      ],
      pitfall: "ضبط عدد الأشجار على الـ test set. استخدم validation أو early stopping بـ validation fraction.",
    },
    {
      kicker: "الفخاخ",
      title: "Feature importance: مفيدة، لكن لها فخاخ",
      en: "Feature importance and its traps",
      body: "<p>الغابة بتديك <code>feature_importances_</code>: قد إيه كل feature قلّل الـ impurity في كل الأشجار. مفيدة كنظرة أولى، لكن فيها مشاكل معروفة:</p>",
      points: [
        "<b>انحياز للـ features اللي ليها قيم كتير مختلفة</b> (أعمدة متصلة أو IDs)، لأن فرصة إنها تلاقي split حظ كويس على التدريب أكبر.",
        "بتتحسب على <b>التدريب</b>، فبتدي أهمية لأعمدة بتساعد على الحفظ مش على التعميم.",
        "الأعمدة المترابطة بتقسم الأهمية بينها فكل واحد يبان أقل مما هو فعلا.",
        "الأهمية مش سببية ومش اتجاه (بتقول مهمة، مش بتقول بتزود ولا بتقلل).",
        "البديل الأحسن: <b>permutation importance</b> على بيانات test/validation: بتبعثر عمود واحد وبتشوف قد إيه الأداء بينزل.",
      ],
      code: {
        lang: "python",
        title: "عمود noise كله عشوائي ومع ذلك ليه أهمية",
        src: `# y depends on 'signal' only; 'noise' is a random float column
# column 0 = signal, 1 = random 0/1, 2 = random float (unique values)
print(rf.feature_importances_.round(3))
# [0.671 0.01  0.318]       <- noise column gets 32% of the importance!

pi = permutation_importance(rf, Xte, yte, n_repeats=10,
                            random_state=0, n_jobs=1)
print(pi.importances_mean.round(3))
# [ 0.161 -0.022 -0.047]    <- shuffling noise does not hurt (<= 0)`,
        note: "الغابة حفظت التدريب (1.0) وجابت 0.672 على الاختبار. الـ impurity importance أدّت للـ noise 0.318، أما permutation على الاختبار فبتقول إن بعثرته مش بتأثر (القيمة صفر أو سالبة حسب noise القياس). مثال مصطنع، لكن الانحياز ده موثق.",
      },
      interview: [
        { q: "إيه مشكلة feature_importances_ في random forest؟", a: "هي impurity-based: بتتحسب من التدريب فبتنحاز للأعمدة اللي ليها قيم كتير مختلفة (متصلة أو IDs) وممكن تدّي أهمية لعمود noise بحت، وبتقسم الأهمية بين الأعمدة المترابطة. بفضل permutation importance على test أو validation، وبفهمها كإشارة مش كسببية." },
      ],
    },
    {
      kicker: "الخلاصة العملية",
      title: "الأشجار من غير scaling، وإمتى تتفوق على الشبكات العصبية",
      en: "Trees need no scaling; trees vs neural networks",
      body: "<p>الشجرة بتقارن عمود واحد بعتبة (<code>x &lt;= 7.5</code>). لو غيرنا مقياس العمود بدالة تزايدية (standardization أو min-max)، ترتيب القيم مبيتغيرش، فنفس الـ splits هتتختار. فمفيش داعي للـ scaling، ولا للتعامل مع الأعمدة بمقاييس مختلفة (نتايج الأشجار متتأثرش بالقيم الشاذة في الـ features كمان، لأن العتبة مبتتأثرش بحجم القيمة الشاذة).</p>",
      code: {
        lang: "python",
        src: `from sklearn.preprocessing import StandardScaler

t1 = DecisionTreeClassifier(max_depth=3, random_state=0).fit(Xtr, ytr)
sc = StandardScaler().fit(Xtr)
t2 = DecisionTreeClassifier(max_depth=3, random_state=0)
t2.fit(sc.transform(Xtr), ytr)

same = (t1.predict(Xte) == t2.predict(sc.transform(Xte))).all()
print(same)   # True  (identical predictions with and without scaling)`,
        note: "اتحققنا على breast cancer: توقعات متطابقة. كمان بتتعامل مع الفئات المرمزة ordinal كويس (فهمها الأفضل في m2).",
      },
      points: [
        "<b>اختار الأشجار/boosting أولا</b> لو: بيانات جدولية، بين مئات وملايين الصفوف، أعمدة بأنواع مختلفة وقيم ناقصة، وعايز نتيجة قوية بسرعة وبضبط قليل.",
        "<b>الأشجار ضعيفة في</b>: الاستقراء خارج مدى التدريب (الشجرة بتتوقع ثابت، مش بتكمل خط)، والصور والصوت والنص الخام، وبتكبر الذاكرة لو غابة ضخمة.",
        "<b>الشبكات العصبية</b>: بتكسب لما البيانات غير منظمة (صور، صوت، نص) أو ضخمة جدا، وهنشوف ليه في m6 و m8.",
        "مفيش حكم نهائي: جرّب الموديلين بنفس الـ cross-validation وقارن، وابدأ بـ baseline خطي.",
      ],
      interview: [
        { q: "هل الأشجار محتاجة feature scaling؟ وليه؟", a: "لأ. كل split بيقارن عمود واحد بعتبة، والتسوية (standardization أو min-max) تحفظ ترتيب القيم، فنفس الـ splits بتتختار ونفس التوقعات بتطلع. بالعكس الموديلات اللي بتعتمد على مسافات أو gradient descent (kNN, SVM, الانحدار، الشبكات) محتاجاه. ده بيخلي الأشجار أسهل في التجهيز." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: Gini من العدّادات",
      lang: "python",
      code: `def gini(counts):
    total = sum(counts)
    return 1 - sum((c / total) ** 2 for c in counts)

def split_gain(parent, left, right):
    n = sum(left) + sum(right)
    w_l = sum(left) / n
    w_r = sum(right) / n
    child = w_l * gini(left) + w_r * gini(right)
    return gini(parent) - child

print(round(gini([6, 4]), 3))`,
    },
    {
      title: "اكتب: شجرة بعمق محدد",
      lang: "python",
      code: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X, y = load_breast_cancer(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.25, random_state=0, stratify=y)
tree = DecisionTreeClassifier(max_depth=3, random_state=0)
tree.fit(X_tr, y_tr)
print(round(tree.score(X_te, y_te), 3))`,
    },
    {
      title: "اكتب: random forest مع OOB",
      lang: "python",
      code: `from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
    n_estimators=100,
    oob_score=True,
    random_state=0,
    n_jobs=1,
)
rf.fit(X_tr, y_tr)
print(round(rf.oob_score_, 3))
print(round(rf.score(X_te, y_te), 3))
print(rf.feature_importances_.argmax())`,
      note: "<code>oob_score_</code> بتتحسب بعد <code>fit</code> فقط لو <code>oob_score=True</code>.",
    },
  ],

  tasks: [
    {
      title: "Gini و gain لـ split",
      lang: "python",
      prompt: "<p>اكتب دالتين:</p><ul><li><code>gini(counts)</code>: بتاخد قايمة عدد العينات لكل فئة في node (مثلا <code>[6, 4]</code>) وترجع Gini impurity.</li><li><code>split_gain(parent, left, right)</code>: بترجع <code>gini(parent)</code> ناقص المتوسط الموزون (بعدد العينات) لـ gini الفرع الشمال والفرع اليمين.</li></ul>",
      examples: [
        { in: "round(gini([6, 4]), 3)", out: "0.48" },
        { in: "round(split_gain([6, 4], [5, 1], [1, 3]), 4)", out: "0.1633" },
        { in: "round(split_gain([6, 4], [6, 2], [0, 2]), 4)", out: "0.18" },
      ],
      hints: [
        "<code>gini = 1 - sum(p**2)</code> حيث <code>p = count / total</code>.",
        "وزن الفرع = عدد عيناته / مجموع عينات الفرعين.",
      ],
      solution: `def gini(counts):
    total = sum(counts)
    return 1 - sum((c / total) ** 2 for c in counts)

def split_gain(parent, left, right):
    n = sum(left) + sum(right)
    child = (sum(left) / n) * gini(left) + (sum(right) / n) * gini(right)
    return gini(parent) - child

print(round(split_gain([6, 4], [5, 1], [1, 3]), 4))   # 0.1633
print(round(split_gain([6, 4], [6, 2], [0, 2]), 4))   # 0.18`,
      explain: "الـ split التاني أعلى gain (0.18 مقابل 0.1633) فالشجرة هتختاره، وده نفس اللي اختارته فعلا في مثال العتبة 7.5. الـ split اللي بيقسم [3,2] و[3,2] بيدّي gain صفر لأنه ما قللش الخليط. التعقيد لكل split: O(k) على عدد الفئات.",
    },
    {
      title: "اختار أحسن عمق بالـ CV",
      lang: "python",
      prompt: "<p>اكتب دالة <code>best_depth(X, y, depths)</code> بتقيّم <code>DecisionTreeClassifier(max_depth=d, random_state=0)</code> لكل عمق في <code>depths</code> بـ <code>StratifiedKFold(5, shuffle=True, random_state=0)</code> (دقة)، وترجع tuple <code>(أحسن عمق, متوسط دقته مقرّب لـ 3 أرقام)</code>. لو عمقين متعادلين رجّع الأصغر.</p>",
      examples: [{ in: "best_depth(X, y, range(1, 9))  # breast cancer", out: "(5, 0.938)" }],
      hints: [
        "لف على الأعماق بالترتيب، واستخدم <code>cross_val_score</code> وخد <code>.mean()</code>.",
        "حدّث الأحسن بس لو المتوسط <b>أكبر بصرامة</b> (<code>&gt;</code>) عشان الأصغر يكسب التعادل.",
      ],
      solution: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.tree import DecisionTreeClassifier

def best_depth(X, y, depths):
    cv = StratifiedKFold(5, shuffle=True, random_state=0)
    best_d, best_s = None, -1.0
    for d in depths:
        tree = DecisionTreeClassifier(max_depth=d, random_state=0)
        s = cross_val_score(tree, X, y, cv=cv).mean()
        if s > best_s:
            best_d, best_s = d, s
    return best_d, round(float(best_s), 3)

X, y = load_breast_cancer(return_X_y=True)
print(best_depth(X, y, range(1, 9)))   # (5, 0.938)`,
      explain: "على breast cancer الدقة بالـ CV بتطلع لحد عمق 5 (0.938) وبعدها بتتذبذب حوالين 0.923 - 0.926. ده نفس شكل منحنى التعقيد: بتحسن وبعدين تثبت أو تنزل. استخدمنا CV وليس test set لاختيار العمق.",
    },
    {
      title: "OOB مقابل Test",
      lang: "python",
      prompt: "<p>اكتب دالة <code>forest_report(X, y)</code> بتقسم 75/25 (<code>random_state=0</code>, <code>stratify=y</code>)، وتدرب <code>RandomForestClassifier(n_estimators=100, oob_score=True, random_state=0, n_jobs=1)</code> على التدريب، وترجع tuple <code>(oob_score, test_accuracy)</code> مقرّبين لـ 3 أرقام.</p>",
      examples: [{ in: "forest_report(X, y)  # breast cancer", out: "(0.96, 0.944)" }],
      hints: [
        "<code>oob_score=True</code> لازم تتحط في الـ constructor، والنتيجة في <code>rf.oob_score_</code> بعد <code>fit</code>.",
        "الـ test accuracy بـ <code>rf.score(X_te, y_te)</code>.",
      ],
      solution: `from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

def forest_report(X, y):
    X_tr, X_te, y_tr, y_te = train_test_split(
        X, y, test_size=0.25, random_state=0, stratify=y)
    rf = RandomForestClassifier(n_estimators=100, oob_score=True,
                                random_state=0, n_jobs=1)
    rf.fit(X_tr, y_tr)
    return round(float(rf.oob_score_), 3), round(float(rf.score(X_te, y_te)), 3)

X, y = load_breast_cancer(return_X_y=True)
print(forest_report(X, y))   # (0.96, 0.944)`,
      explain: "الـ OOB بتتحسب على بيانات التدريب بس لكن كل صف بيتقيم بالأشجار اللي ماشافتوش، فهي تقدير صادق تقريبا من غير test منفصل. الرقمين قريبين (0.96 و0.944) لكن مش لازم يتطابقوا، خصوصا مع test set صغير.",
    },
  ],

  quiz: [
    {
      q: "كام Gini لـ node فيه 5 من فئة و 5 من فئة تانية؟",
      answer: ["0.5", "0.50"],
      why: "p = 0.5 و0.5 فالـ Gini = 1 - (0.25 + 0.25) = 0.5. ده أسوأ قيمة في فئتين. و node نقي [10, 0] قيمته 0.",
    },
    {
      q: "node فيه 6 و 4. بعد split بقى [5, 1] و [1, 3]. الـ Gini الموزون للفرعين تقريبا 0.3167. كام الـ gain؟ (الأب Gini = 0.48)",
      answer: ["0.1633", "0.163", "0.16"],
      why: "gain = 0.48 - 0.3167 = 0.1633. الشجرة بتجرب كل الـ splits وبتختار أعلى gain.",
    },
    {
      q: "أنهي تعبير صح عن random forest؟",
      options: [
        "أشجار بتتدرب بالتتابع، كل واحدة بتصلح أخطاء اللي قبلها",
        "أشجار مستقلة على عينات bootstrap مع feature subsampling، والتوقع متوسط أو تصويت",
        "شجرة واحدة عميقة جدا",
        "شبكة عصبية بطبقات من أشجار",
      ],
      answer: 1,
      why: "الأولى وصف gradient boosting. الغابة أشجار مستقلة، والتنوع بين الأشجار هو اللي بيخلي التوسط يقلل الـ variance.",
    },
    {
      q: "شجرة بتحقق 100% تدريب و 90% اختبار على بيانات كبيرة بالقدر الكافي. أنهي إعداد غالبا يساعد؟",
      options: [
        "زيادة <code>max_depth</code>",
        "تقليل <code>min_samples_leaf</code> لـ 1",
        "زيادة <code>min_samples_leaf</code> أو تقليل <code>max_depth</code>",
        "إلغاء الـ random_state",
      ],
      answer: 2,
      why: "الفجوة معناها variance عالي، فبنقيد الشجرة بعمق أقل أو أوراق أكبر (أو pruning). الباقي بيزود الحفظ أو ملوش علاقة. وبنتأكد بالـ CV.",
    },
    {
      q: "في gradient boosting، كل شجرة جديدة بتتدرب على إيه؟",
      options: [
        "نفس الـ y الأصلي",
        "عينة bootstrap عشوائية",
        "أخطاء (residuals / gradient) المجموع الحالي",
        "الـ features الأقل أهمية",
      ],
      answer: 2,
      why: "الفكرة إن كل شجرة تصلح اللي لسه غلط. تدريبها على y الأصلي كل مرة كان هيطلع أشجار متشابهة، والـ bootstrap فكرة الغابة.",
    },
    {
      q: "أنهي موديل من دول <b>مش</b> محتاج feature scaling عادة؟",
      options: [
        "kNN",
        "SVM",
        "الشبكة العصبية",
        "Random Forest",
      ],
      answer: 3,
      why: "الأشجار بتقارن عمود بعتبة وتحفظ الترتيب بعد التسوية. kNN وSVM والشبكات بتتأثر بالمقياس.",
    },
    {
      q: "random forest بـ <code>oob_score=True</code>: الـ OOB score بتعبر عن إيه؟",
      options: [
        "دقة على بيانات التدريب بكل الأشجار",
        "دقة تقديرية، كل صف متقيم بالأشجار اللي ماشافتوش وقت التدريب",
        "دقة على الـ test set",
        "عدد الأشجار اللي اتحذفت",
      ],
      answer: 1,
      why: "كل شجرة بتشوف تقريبا 63% من الصفوف، والـ ~37% الباقية out-of-bag. التقييم بالأشجار اللي ماشافتهاش بيدّي تقدير للتعميم بدون test منفصل.",
    },
    {
      q: "عمود ID فريد لكل صف (قيم مختلفة كلها) وفي الغابة طلع في أعلى الـ <code>feature_importances_</code>. التفسير الأرجح؟",
      options: [
        "الـ ID بيحدد النتيجة فعلا",
        "انحياز impurity importance للأعمدة ذات القيم الكتيرة، وهي بتساعد على الحفظ فقط",
        "الغابة اتدربت على test set",
        "ده طبيعي ومفيد",
      ],
      answer: 1,
      why: "عمود بقيم فريدة بيسمح بـ splits بتعزل صفوف على التدريب فبيبان مهم. نتأكد بـ permutation importance على بيانات مش متدرب عليها ونشيل الـ ID.",
    },
    {
      q: "الـ learning rate في boosting أصغر (مثلا 0.01 بدل 0.1). ده معناه غالبا إيه؟",
      options: [
        "محتاج أشجار أكتر عشان توصل لنفس المستوى",
        "محتاج أشجار أقل",
        "الموديل بيبقى غير قادر يتعلم أبدا",
        "مفيش علاقة بعدد الأشجار",
      ],
      answer: 0,
      why: "الخطوة الأصغر بتصلح جزء أقل من الغلط كل جولة، فالتقارب أبطأ ومحتاج أشجار أكتر، مقابل overfitting أقل عادة.",
    },
    {
      q: "عندك جدول 50 ألف صف و30 عمود (رقمي وفئوي) وعايز أول موديل قوي. أنهي بداية أنسب؟",
      options: [
        "شبكة عصبية عميقة",
        "kNN من غير scaling",
        "Gradient boosting أو random forest مقارنة بـ baseline خطي",
        "Naive guess",
      ],
      answer: 2,
      why: "على الجداول الأشجار/boosting اختيار قوي بضبط قليل، ونقارنها بـ baseline بنفس الـ CV. الشبكات لسه ممكنة لكن مش البداية الافتراضية. kNN من غير scaling بيتأثر بالمقاييس.",
    },
  ],
};
