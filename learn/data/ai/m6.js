window.LEVELS = window.LEVELS || {};
window.LEVELS["ai/m6"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "من غير labels: الموديل يدوّر على شكل البيانات لوحده",
      en: "Unsupervised learning: finding structure",
      body: "<p>كل اللي فات كان <b>supervised</b>: عندك features وعندك إجابة صح (label) لكل صف. في الواقع كتير من البيانات جاية من غير إجابات. عندك 50 ألف عميل ومحدش قالك مين «عميل VIP» ومين «عميل نايم». هنا الـ <b>unsupervised learning</b> بيدوّر على <b>structure</b> جوه البيانات من غير ما حد يقوله إيه المطلوب.</p><p>الـ structure ممكن يكون: مجموعات من الصفوف المتشابهة (<b>clustering</b>)، أو إن الـ 64 عمود في الحقيقة بيتحركوا مع بعض في 10 اتجاهات بس (<b>dimensionality reduction</b>)، أو إن فيه صفوف شاذة عن الباقي (<b>anomaly detection</b>).</p>",
      points: [
        "مفيش «نسبة دقة» جاهزة، لأن مفيش إجابة تتقارن بيها. ده بيخلي التقييم أصعب وبنتكلم عنه في آخر المستوى.",
        "النتيجة بتتأثر جامد بقرارات إنت بتاخدها: عدد المجموعات، مقياس الـ features، مقياس «التشابه». يعني مفيش «الإجابة الصح» الوحيدة.",
        "الاستخدامات الشائعة: تقسيم العملاء (segmentation)، ضغط الداخل قبل موديل، رسم بيانات كبيرة في 2D، كشف الأعطال والاحتيال، واستكشاف بيانات جديدة قبل ما تقرر تعمل إيه.",
      ],
      interview: [
        { q: "الفرق بين supervised و unsupervised learning بمثال؟", a: "في supervised عندي label لكل صف وبدرب الموديل يتنبأ بيه (توقع سعر شقة، أو هل الإيميل spam). في unsupervised مفيش label، والموديل بيدوّر على structure في الـ features نفسها: زي تقسيم عملاء لمجموعات متشابهة بـ k-means، أو تقليل الأعمدة بـ PCA. الفرق العملي إن في الأول أقيس بدقة على إجابات معروفة، وفي التاني التقييم أصعب ومحتاج حكم وقياسات غير مباشرة." },
      ],
    },
    {
      kicker: "الخوارزمية الأشهر",
      title: "k-means خطوة بخطوة: assign ثم update",
      en: "k-means: assign and update",
      body: "<p>الفكرة: اختار <code>k</code> مراكز (centroids). كل نقطة تروح لأقرب مركز، وبعدين كل مركز بيتنقل لمتوسط النقط اللي اتجمعت عنده. كرر الاتنين لحد ما مفيش نقطة تغير مجموعتها. الخطوتين بتقلل رقم واحد اسمه <b>inertia</b>: مجموع مربعات المسافة بين كل نقطة ومركزها.</p><p>مثال صغير بـ 6 نقط في 2D: تلات نقط حوالين (1,1) وتلات حوالين (8,8)، والمركزين الابتدائيين اتحطوا على <code>(1,1)</code> و<code>(9,9.5)</code>:</p>",
      code: {
        lang: "text",
        src: `points: A(1,1) B(1.5,2) C(2,1)   D(8,8) E(9,9.5) F(8.5,8)
start:  c0 = (1, 1)      c1 = (9, 9.5)

assign (distance to c0 / to c1):
A 0.00 / 11.67 -> 0      D  9.90 /  1.80 -> 1
B 1.12 / 10.61 -> 0      E 11.67 /  0.00 -> 1
C 1.00 / 11.01 -> 0      F 10.26 /  1.58 -> 1

update (mean of each group):
c0 = ((1+1.5+2)/3, (1+2+1)/3) = (1.5, 1.333)
c1 = ((8+9+8.5)/3, (8+9.5+8)/3) = (8.5, 8.5)

assign again: nobody moves -> converged
inertia = 1.167 + 2.000 = 3.167`,
        note: "الأرقام من تشغيل فعلي. جولة واحدة كفت لأن المراكز الابتدائية كانت قريبة من الحل. في بيانات حقيقية بتاخد من 5 لـ 50 جولة غالبا. inertia للمجموعة الأولى: 0.361 + 0.444 + 0.361 = 1.167.",
      },
      terms: [
        ["centroid", "المركز", "متوسط نقط المجموعة. ممكن ميكونش نقطة فعلية من البيانات."],
        ["inertia", "الـ inertia", "مجموع مربعات المسافات بين كل نقطة ومركز مجموعتها. كل ما قل كانت المجموعات أضيق."],
        ["convergence", "التقارب", "الخوارزمية بتقف لما التخصيص يبطل يتغير. مضمون إنها تقف، لكن مش مضمون إنها تلاقي أحسن حل (بتقف عند حل محلي)."],
      ],
      interview: [
        { q: "اشرح k-means في جملتين.", a: "بختار k مراكز وبكرر خطوتين: أوزع كل نقطة على أقرب مركز، وبعدين أنقل كل مركز لمتوسط نقطه. كل جولة بتقلل (أو بتساوي) مجموع مربعات المسافات للمراكز، فبيتقارب لحل محلي. مش بيضمن أحسن حل عالمي، فبنشغله كذا مرة بابتداءات مختلفة ونختار الأقل inertia." },
      ],
    },
    {
      kicker: "الكود",
      title: "k-means من الصفر بـ NumPy ثم scikit-learn",
      en: "k-means in code",
      code: {
        lang: "python",
        title: "kmeans_scratch.py",
        src: `import numpy as np
from sklearn.cluster import KMeans

X = np.array([[1.0, 1.0], [1.5, 2.0], [2.0, 1.0],
              [8.0, 8.0], [9.0, 9.5], [8.5, 8.0]])
C = np.array([[1.0, 1.0], [9.0, 9.5]])      # starting centroids

for step in range(10):
    # assign: distance of every point to every centroid
    d = np.linalg.norm(X[:, None, :] - C[None, :, :], axis=2)
    labels = d.argmin(axis=1)
    # update: each centroid moves to the mean of its points
    newC = np.array([X[labels == j].mean(axis=0) for j in range(2)])
    if np.allclose(newC, C):
        break
    C = newC

inertia = sum(((X[labels == j] - C[j]) ** 2).sum() for j in range(2))
print(labels, C.round(3).tolist(), round(inertia, 3))
# [0 0 0 1 1 1] [[1.5, 1.333], [8.5, 8.5]] 3.167

km = KMeans(n_clusters=2, n_init=10, random_state=0).fit(X)
print(km.labels_, km.cluster_centers_.round(3).tolist(),
      round(km.inertia_, 3))
# same split; here the labels came out swapped ([1 1 1 0 0 0]),
# with the same two centres and inertia 3.167`,
        note: "الشكل <code>X[:, None, :] - C[None, :, :]</code> بيعمل broadcasting: مصفوفة (6, 2, 2) فيها فرق كل نقطة بكل مركز. <code>axis=2</code> بتحسب الطول. ترقيم المجموعات (0 أو 1) اعتباطي، فمتعتمدش عليه: جوه scikit-learn ممكن يتبدلوا.",
      },
      pitfall: "افتراض إن رقم المجموعة ليه معنى ثابت. <code>cluster 0</code> في تشغيل مش بالضرورة هي <code>cluster 0</code> في تشغيل تاني. لو محتاج تقارن تشغيلين استخدم مقياس مش بيعتمد على الأرقام زي <code>adjusted_rand_score</code>.",
    },
    {
      kicker: "اختيار k",
      title: "الـ elbow والـ silhouette: إزاي تقرر عدد المجموعات",
      en: "Choosing k: elbow and silhouette",
      body: "<p>k-means محتاج منك <code>k</code> مقدما. مفيش رقم صح من الداتا نفسها، لكن فيه أدوات تساعدك. <b>Elbow</b>: شغّل k من 1 لـ 8 وارسم الـ inertia. هي بتنزل دايما كل ما زودت k (في الحد الأقصى كل نقطة مجموعة لوحدها وinertia = 0)، فبندوّر على «الكوع»: النقطة اللي بعدها النزول يبقى بطيء. <b>Silhouette</b> أدق شوية لأنها بتقيس جودة كل نقطة.</p>",
      code: {
        lang: "text",
        src: `silhouette of one point i:
  a = average distance to the other points in its own cluster
  b = average distance to the points of the nearest OTHER cluster
  s = (b - a) / max(a, b)          # between -1 and 1

  s near  1: the point sits well inside its cluster
  s near  0: it is on the border between two clusters
  s below 0: probably in the wrong cluster

example (point A of the tiny dataset): a = 1.059, b = 10.61
  s = (10.61 - 1.059) / 10.61 = 0.90`,
        note: "silhouette الكلية = متوسط s لكل النقط. الأرقام من تشغيل فعلي على الداتا الصغيرة.",
      },
      codes: [
        {
          lang: "python",
          title: "elbow و silhouette على 4 مجموعات حقيقية",
          src: `from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

X, _ = make_blobs(n_samples=300, centers=4, cluster_std=1.0,
                  random_state=0)
for k in range(2, 9):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)
    s = silhouette_score(X, km.labels_)
    print(k, round(km.inertia_, 1), round(s, 3))
# k  inertia  silhouette
# 2  1515.5   0.448
# 3   887.2   0.457
# 4   541.1   0.501   <- elbow, and the best silhouette
# 5   478.8   0.453
# 6   419.2   0.412
# 7   366.5   0.381
# 8   320.0   0.345`,
          note: "من 3 لـ 4 الـ inertia نزلت 346، ومن 4 لـ 5 نزلت 62 بس. يعني الكوع عند 4. والـ silhouette أعلى عند 4 (0.501). ده داتا اتولدت بـ 4 مراكز واضحة. في بيانات حقيقية الكوع غالبا مش واضح كده، وساعتها القرار بيبقى معاه حكم المجال.",
        },
      ],
      interview: [
        { q: "إزاي تختار k في k-means؟", a: "بجرب كذا k وأقارن. الـ elbow: برسم الـ inertia مقابل k وبدوّر على النقطة اللي بعدها التحسن بيقل. الـ silhouette: بدوّر على k اللي متوسط silhouette عنده أعلى (قريب من 1 أحسن). وبرضه بتأكد إن المجموعات مستقرة لو غيرت العينة، وإنها منطقية للغرض (مثلا فريق التسويق يقدر يتعامل مع 4 شرايح مش 40). مفيش اختيار صح حسابيا لوحده." },
      ],
    },
    {
      kicker: "الحساسية",
      title: "الـ scaling والـ initialisation وحدود k-means",
      en: "Scale, initialisation and k-means++",
      body: "<p>k-means بيعتمد على <b>المسافة</b>. فلو عمود بالآلاف (الدخل) وعمود بالعشرات (العمر)، الدخل هو اللي هيحدد كل حاجة والعمر هيتجاهل تقريبا. عشان كده <code>StandardScaler</code> قبل k-means شبه إجباري (m2).</p><p>التاني: النقط الابتدائية. لو اتحطت مراكزين في نفس المجموعة الحقيقية، k-means ممكن يقف عند حل وحش. الحل الأول: <code>n_init=10</code> (شغّله 10 مرات وخد الأقل inertia). الحل التاني: <b>k-means++</b> (الافتراضي في scikit-learn): بيختار أول مركز عشوائي، وكل مركز بعده بيختاره باحتمال أكبر كل ما كانت النقطة أبعد عن المراكز اللي اتختارت، فالمراكز بتتوزع بدل ما تتزاحم.</p>",
      code: {
        lang: "python",
        title: "الـ scale يغيّر النتيجة، وk-means++ يقلل الحظ",
        src: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import adjusted_rand_score
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(0)
age = np.r_[rng.normal(25, 3, 100), rng.normal(50, 3, 100)]
income = rng.normal(8000, 3000, 200)           # same for both groups
X = np.c_[age, income]
y = np.r_[np.zeros(100), np.ones(100)]         # true groups = age only

raw = KMeans(2, n_init=10, random_state=0).fit_predict(X)
Xs = StandardScaler().fit_transform(X)
sc = KMeans(2, n_init=10, random_state=0).fit_predict(Xs)
print(round(adjusted_rand_score(y, raw), 3))   # 0.007
print(round(adjusted_rand_score(y, sc), 3))    # 1.0

Xb, _ = make_blobs(n_samples=600, centers=6, cluster_std=0.8,
                   random_state=3)
for init in ("random", "k-means++"):
    r = [KMeans(6, init=init, n_init=1, random_state=s).fit(Xb).inertia_
         for s in range(10)]
    print(init, round(min(r), 1), round(max(r), 1), round(np.mean(r), 1))
# random    688.7 753.6 730.4
# k-means++ 688.8 743.6 707.8`,
        note: "الـ ARI (adjusted Rand index) بيقارن تقسيمين: 1 يعني متطابقين، حوالين 0 يعني عشوائي. من غير scaling k-means قسم على الدخل (ضجيج) وطلعت ARI حوالي صفر (0.007)، ومعاه بقت 1.0. وفي الابتداء: الأسوأ والمتوسط أحسن مع k-means++ لكن مفيش ضمان في تشغيلة واحدة (الأفضل 688.7 و688.8 تقريبا نفس الحل)، فـ <code>n_init</code> بيفضل مفيد.",
      },
      points: [
        "k-means بيفترض مجموعات <b>كروية تقريبا وبأحجام قريبة</b>. مع شكل هلالين متداخلين (moons) أو مجموعات مستطيلة طويلة هيقطّعها غلط. ده وقت تفكر في DBSCAN (الشريحة الجاية).",
        "حساس للقيم الشاذة لأن المتوسط بيتشد ناحيتها.",
        "بيحط كل نقطة في مجموعة، حتى الضجيج. مفيش «مش تابع لأي مجموعة».",
      ],
      pitfall: "تشغيل k-means على أعمدة مختلفة المقياس أو على أعمدة ID أو أعمدة مشفّرة one-hot كتير من غير تفكير. المسافة بين صفين بتبقى بلا معنى. اعمل scaling، وفكّر هل كل عمود فعلا يدخل في تعريف «التشابه».",
      interview: [
        { q: "ليه لازم scaling قبل k-means؟ وإيه k-means++؟", a: "لأن k-means بيعتمد على المسافة الإقليدية، فالعمود بالمقياس الكبير (دخل بالآلاف) بيطغى على العمود الصغير (عمر)، والمجموعات بتتحدد بعمود واحد تقريبا. أما k-means++ فهو طريقة اختيار المراكز الابتدائية: أول مركز عشوائي والباقي باحتمال أكبر للنقط البعيدة عن المراكز المختارة، فالمراكز بتتوزع ويقل احتمال حل محلي وحش. وبيتعمل معاه n_init لعدة تشغيلات." },
      ],
    },
    {
      kicker: "طرق تانية",
      title: "Hierarchical و DBSCAN: لما k-means مش مناسب",
      en: "Hierarchical clustering and DBSCAN",
      body: "<p><b>Hierarchical (agglomerative)</b>: كل نقطة تبدأ مجموعة لوحدها، وفي كل خطوة بتدمج أقرب مجموعتين، لحد ما تبقى مجموعة واحدة. اللي بيطلع شجرة اسمها <b>dendrogram</b>، وإنت بتقص الشجرة عند الارتفاع اللي يدّيك العدد المناسب من المجموعات، فمش محتاج تحدد k من الأول. بتحتاج مسافات بين كل الأزواج فمش مناسبة لعشرات الآلاف من الصفوف. وطريقة قياس البعد بين مجموعتين (<code>linkage</code>: ward أو single أو average) بتغيّر الشكل.</p><p><b>DBSCAN</b> بيمشي على فكرة الكثافة: النقطة «أساسية» (core) لو فيه على الأقل <code>min_samples</code> نقط جوه دايرة نصف قطرها <code>eps</code> حواليها. المجموعة هي سلسلة نقط أساسية متصلة بالدوائر. النقطة اللي مش تابعة لحد بتتحط في فئة <b>noise</b> برقم <code>-1</code>.</p>",
      code: {
        lang: "python",
        src: `import numpy as np
from sklearn.cluster import DBSCAN, KMeans
from sklearn.datasets import make_moons, make_blobs
from sklearn.metrics import adjusted_rand_score

Xm, ym = make_moons(300, noise=0.07, random_state=0)
km = KMeans(2, n_init=10, random_state=0).fit_predict(Xm)
db = DBSCAN(eps=0.2, min_samples=5).fit_predict(Xm)
print(round(adjusted_rand_score(ym, km), 3))   # 0.234
print(round(adjusted_rand_score(ym, db), 3))   # 1.0

X, _ = make_blobs(n_samples=200, centers=2, cluster_std=0.6,
                  random_state=1)
Xo = np.vstack([X, [[10, 10], [-10, 8]]])      # two far outliers
for eps in (0.3, 0.6, 1.0):
    lab = DBSCAN(eps=eps, min_samples=5).fit_predict(Xo)
    print(eps, sorted(set(lab.tolist())), (lab == -1).sum())
# 0.3 [-1, 0, 1, 2] 35   eps too small: real points become noise
# 0.6 [-1, 0, 1]     7
# 1.0 [-1, 0, 1]     2   the two outliers only`,
        note: "على الهلالين k-means بيقطع النص (ARI 0.234) وDBSCAN بيلقطهم صح (1.0). الـ <code>eps</code> هو أهم معامل: صغير = كل حاجة noise، كبير = كل حاجة تلزق في مجموعة واحدة. ومعاه صعوبة لو كثافة المجموعات مختلفة.",
      },
      points: [
        "DBSCAN مش محتاج k، ويلقط أشكال غير كروية، ويطلع noise. لكن لازم تضبط <code>eps</code> (والبيانات متسوّاة)، وبيعاني لما الكثافات مختلفة.",
        "اختيار سريع: مجموعات كروية وعدد معروف تقريبا: k-means. أشكال غريبة أو ضجيج: DBSCAN. عايز تفهم التسلسل أو عدد صغير من الصفوف: hierarchical.",
      ],
    },
    {
      kicker: "تقليل الأبعاد",
      title: "PCA: الاتجاهات اللي فيها أكبر تباين",
      en: "PCA as directions of maximum variance",
      body: "<p>ليه نقلل الأعمدة؟ لأن أعمدة كتير بتتحرك مع بعض (مثلا طول ووزن ومقاس القميص). بيانات الأعداد الكبيرة بتتعب الرسم، وبتبطّأ الموديلات، وبتزود الضجيج. <b>PCA</b> بيلاقي محاور جديدة (<b>principal components</b>) كل واحد مركب خطي من الأعمدة الأصلية، مرتبين بحيث الأول هو الاتجاه اللي <b>البيانات منتشرة فيه أكتر حاجة</b> (أكبر تباين)، والتاني متعامد عليه وفيه أكبر تباين متبقي، وهكذا. بعدين بتحتفظ بأول كام واحد وتسيب الباقي.</p><p>تخيل سحابة نقط بيضاوية مايلة: المحور الطويل للبيضاوي هو PC1، والمحور القصير PC2. لو العرض ضئيل، PC1 لوحده كفاية تقريبا ورميت بُعد من غير خسارة كبيرة.</p>",
      code: {
        lang: "python",
        title: "PCA بالإيد: eigen decomposition للـ covariance",
        src: `import numpy as np
from sklearn.decomposition import PCA

rng = np.random.default_rng(0)
x = rng.normal(0, 2, 200)
X = np.c_[x, 0.5 * x + rng.normal(0, 0.5, 200)]   # correlated pair

Xc = X - X.mean(axis=0)                 # 1) centre the data
cov = np.cov(Xc.T)                      # 2) covariance matrix (2x2)
vals, vecs = np.linalg.eigh(cov)        # 3) eigenvalues ascending
print(vals[::-1].round(3))              # [4.631 0.211] variance per PC
print((vals[::-1] / vals.sum()).round(3))   # [0.956 0.044]

p = PCA(n_components=2).fit(X)
print(p.explained_variance_.round(3))        # [4.631 0.211]
print(p.explained_variance_ratio_.round(3))  # [0.956 0.044]
print(p.components_[0].round(3))             # [0.89  0.456]`,
        note: "الـ eigenvector الأول <code>[0.89, 0.456]</code> هو اتجاه الميل (تقريبا 1 : 0.5 زي ما ولّدنا البيانات). الـ eigenvalue هو التباين على المحور ده. PC1 لوحده بيشرح 95.6% من التباين الكلي. الإشارة (+/-) للـ component اعتباطية، ممكن تتعكس.",
      },
      focus: [{ label: "احفظها", text: "PCA = center، covariance، eigenvectors. الـ eigenvectors هي الاتجاهات والـ eigenvalues هي التباين على كل اتجاه. <code>explained_variance_ratio_</code> = كل eigenvalue ÷ مجموعهم." }],
      interview: [
        { q: "إيه هو PCA وإمتى تستخدمه؟", a: "PCA بيحول الـ features لمحاور جديدة متعامدة مرتبة بالتباين اللي بتشرحه: الأول فيه أكبر تباين وهكذا. باحتفظ بأول كام component وأرمي الباقي، فبقلل الأبعاد مع أقل خسارة معلومات (من ناحية التباين). بستخدمه للرسم في 2D، ولضغط features مترابطة جدا، ولتقليل الضجيج، وأحيانا قبل موديل يتأثر بالأبعاد العالية. لازم أعمل scaling قبله لأنه بيعتمد على التباين." },
      ],
    },
    {
      kicker: "PCA عمليا",
      title: "كام component أحتفظ بيه؟ ومتى PCA يفيد ومتى لأ",
      en: "Explained variance ratio, PCA before a model, t-SNE and UMAP",
      body: "<p>صور الأرقام <code>load_digits</code> فيها 64 بكسل (8×8) لكل صورة. بنحسب النسبة التراكمية للتباين ونشوف كام component يغطوا 90% و95%:</p>",
      code: {
        lang: "python",
        src: `import numpy as np
from sklearn.datasets import load_digits, load_wine
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_digits(return_X_y=True)
cs = PCA().fit(X).explained_variance_ratio_.cumsum()
print(X.shape, int(np.searchsorted(cs, 0.90)) + 1,
      int(np.searchsorted(cs, 0.95)) + 1)    # (1797, 64) 21 29

cv = StratifiedKFold(5, shuffle=True, random_state=0)
full = LogisticRegression(max_iter=3000)
small = make_pipeline(PCA(0.95), LogisticRegression(max_iter=3000))
print(cross_val_score(full, X, y, cv=cv).mean().round(3))    # 0.964
print(cross_val_score(small, X, y, cv=cv).mean().round(3))   # 0.954
print(small.fit(X, y)[0].n_components_)                      # 29

Xw, _ = load_wine(return_X_y=True)
print(PCA().fit(Xw).explained_variance_ratio_[:2].round(3))  # [0.998 0.002]
Xs = StandardScaler().fit_transform(Xw)
print(PCA().fit(Xs).explained_variance_ratio_[:2].round(3))  # [0.362 0.192]`,
        note: "29 component بدل 64 بدقة 0.954 مقابل 0.964: ضغطنا للنص تقريبا وخسرنا نقطة. <code>PCA(0.95)</code> معناها «احتفظ بالعدد اللي يغطي 95% من التباين». في wine من غير scaling عمود <code>proline</code> (قيمه بالمئات) أخد 99.8% من التباين لوحده، لأن PCA بيعتمد على التباين المطلق. بعد StandardScaler الصورة اتغيرت.",
      },
      points: [
        "<b>PCA جوه الـ Pipeline</b> بعد الـ scaler وقبل الموديل، علشان يتعلم من التدريب بس (نفس قاعدة الـ leakage).",
        "<b>مش دايما بيحسن الدقة</b>: في المثال الأرقام نزلت شوية. بنستخدمه لما نحتاج سرعة أو ضغط أو نقلل overfitting، ونقيس.",
        "الـ components صعبة التفسير: كل واحد خليط من أعمدة. لو التفسير مهم، اختيار أعمدة أحسن من PCA.",
        "<b>t-SNE و UMAP</b>: أدوات لرسم بيانات عالية الأبعاد في 2D بحيث الجيران يفضلوا قريبين. مفيدة <b>للنظر والاستكشاف فقط</b>: المسافات بين المجموعات وأحجامها في الرسمة مش بالضرورة حقيقية، والنتيجة بتتغير مع المعاملات، فمتبنيش عليها استنتاجات رقمية ولا بتستخدمهم كـ features لموديل في العادة.",
      ],
      pitfall: "عمل PCA على كل البيانات (بما فيها الـ test) قبل التقسيم. ده leakage خفيف: الـ components اتحسبت من بيانات الاختبار. حطه في pipeline مع fit على التدريب بس.",
      interview: [
        { q: "إزاي تحدد عدد الـ components في PCA؟", a: "بحسب <code>explained_variance_ratio_</code> التراكمية وبختار أقل عدد يغطي نسبة مقبولة (90 أو 95%)، أو بستخدم <code>PCA(0.95)</code> مباشرة. لو PCA قبل موديل بعتبر عدد الـ components hyperparameter وبضبطه بالـ cross-validation على الأداء الفعلي. ولو للرسم أخد 2 أو 3 وبشوف نسبة التباين اللي ظهرت." },
        { q: "ليه ما بنستخدمش t-SNE كخطوة تحضير للموديل؟", a: "لأنه مصمم للرسم: بيحافظ على الجيران القريبين لكن مش على المسافات الكبيرة ولا الأحجام، والنتيجة بتتغير مع المعاملات والـ seed، ومبيطبقش بسهولة على بيانات جديدة بنفس التحويل. فبستخدمه استكشافيا، وللتحضير بستخدم PCA مثلا." },
      ],
    },
    {
      kicker: "بدون labels",
      title: "كشف الشذوذ، وإزاي تقيّم من غير إجابات بصدق",
      en: "Anomaly detection and honest evaluation",
      body: "<p><b>Anomaly detection</b>: ندوّر على صفوف مختلفة جدا عن الباقي (معاملة غريبة، حساس بيقرا غلط). أبسط طريقة: z-score. أحسن لما الأعمدة كتير: <code>IsolationForest</code>، بيعزل النقط بقطع عشوائية، والنقطة الشاذة بتتعزل في قطعات أقل من العادية. تقيس «الشذوذ» بدرجة، وإنت اللي بتحدد النسبة (<code>contamination</code>) أو العتبة.</p>",
      code: {
        lang: "python",
        src: `import numpy as np
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(0)
normal = rng.normal(0, 1, (500, 2))
odd = np.array([[6, 6], [-7, 5], [5, -6]])
D = np.vstack([normal, odd])

z = np.abs((D - D.mean(0)) / D.std(0)).max(axis=1)
print(np.where(z > 4)[0])                 # [500 501 502]

iso = IsolationForest(n_estimators=100, contamination=3 / 503,
                      random_state=0).fit(D)
print(np.where(iso.predict(D) == -1)[0])  # [500 501 502]`,
        note: "الاتنين لقطوا التلات نقط المزروعة. ده مثال سهل (شذوذ واضح جدا). في الواقع الشذوذ مش واضح، ومفيش labels تقول لك لقطت كام، فبنراجع يدويا عينة من اللي الموديل علّم عليه.",
      },
      points: [
        "<b>التقييم بدون labels محتاج صراحة</b>: رقم زي silhouette أو inertia بيقيس «شكل» التقسيم، مش «فايدته». على الهلالين، k-means غلطان لكن silhouette بتاعه 0.487 أعلى من silhouette التقسيم الصح (0.326)، لأن silhouette بتحب المجموعات الكروية المنفصلة.",
        "<b>الاستقرار</b>: لو فصلت عينات فرعية من الداتا وعملت k-means عليهم، هل بيطلع نفس التقسيم؟ على 4 مجموعات حقيقية متوسط ARI بين تشغيلات k=4 كان 0.958، ومع k=7 نزل لـ 0.578. تقسيم مش مستقر غالبا ضجيج.",
        "<b>الفايدة</b>: هل المجموعات بتدّي قرار؟ تقدر تسمي كل شريحة وتتصرف مع كل واحدة بشكل مختلف؟ لو الإجابة لأ، التقسيم مش مفيد مهما كان رقمه.",
        "<b>لو فيه labels قليلة</b> (حتى لو مش للتدريب) قارن بيها بـ ARI. ولو ممكن، قيّم بنتيجة لاحقة: هل استخدام الشرايح حسّن حملة أو موديل تاني على test؟",
      ],
      interview: [
        { q: "إزاي تقيّم clustering من غير labels؟", a: "بقياسات داخلية زي silhouette (قريب من 1 أحسن) و inertia مع elbow، وبفحص الاستقرار: لو غيرت العينة أو الـ seed هل بيطلع نفس التقسيم تقريبا. وبراجع المجموعات يدويا وبشوف هل فيها معنى للمجال وهل بتدّي قرار مختلف. وبكون حذر إن المقاييس الداخلية بتفضل شكل معين (silhouette بتحب الكروي)، فمقدرش أعتمد على رقم واحد." },
        { q: "إزاي تكتشف شذوذ في بيانات من غير labels؟", a: "ببدأ بحاجة بسيطة زي z-score أو IQR على الأعمدة المهمة. ولما الأعمدة كتير بستخدم IsolationForest اللي بيدّي درجة شذوذ لكل صف، وبحدد العتبة حسب قدرة فريق المراجعة. ومفيش طريقة تثبت صحتها من غير مراجعة بشرية لعينة من النتايج، وبتتحسن لما ييجي labels بالتدريج." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: خطوة assign في k-means",
      lang: "python",
      code: `import numpy as np

X = np.array([[1.0, 1.0], [2.0, 1.0], [8.0, 8.0]])
C = np.array([[1.0, 1.0], [9.0, 9.0]])

d = np.linalg.norm(X[:, None, :] - C[None, :, :], axis=2)
labels = d.argmin(axis=1)
print(d.round(2))
print(labels)`,
      note: "الناتج: <code>[0 0 1]</code>. شكل <code>d</code> هو (3, 2): صف لكل نقطة وعمود لكل مركز.",
    },
    {
      title: "اكتب: حلقة elbow و silhouette",
      lang: "python",
      code: `from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import silhouette_score

X, _ = make_blobs(n_samples=300, centers=4, random_state=0)
for k in range(2, 7):
    km = KMeans(n_clusters=k, n_init=10, random_state=0)
    km.fit(X)
    s = silhouette_score(X, km.labels_)
    print(k, round(km.inertia_, 1), round(s, 3))`,
    },
    {
      title: "اكتب: scaler و PCA و موديل في pipeline",
      lang: "python",
      code: `from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_digits(return_X_y=True)
pipe = make_pipeline(
    StandardScaler(),
    PCA(n_components=0.95),
    LogisticRegression(max_iter=3000),
)
print(cross_val_score(pipe, X, y, cv=5).mean().round(3))`,
      note: "<code>PCA(n_components=0.95)</code>: رقم عشري بين 0 و1 معناه «نسبة التباين المطلوب تغطيتها». على الأرقام ده بيطلع 40 component بعد التسوية.",
    },
  ],

  tasks: [
    {
      title: "k-means من الصفر",
      lang: "python",
      prompt: "<p>اكتب دالة <code>kmeans(X, k, steps=10)</code> بـ NumPy فقط. المراكز الابتدائية هي <b>أول k صفوف</b> من <code>X</code>. كرر assign ثم update حتى <code>steps</code> مرات أو لحد ما المراكز متتحركش. لو مجموعة فضيت سيب مركزها زي ما هو. ارجع tuple من (قايمة labels، قايمة المراكز مقرّبة لـ 3 أرقام عشرية).</p>",
      examples: [
        { in: "kmeans([[1,1],[8,8],[1.5,2],[2,1],[9,9.5],[8.5,8]], 2)", out: "([0, 1, 0, 0, 1, 1], [[1.5, 1.333], [8.5, 8.5]])" },
      ],
      hints: [
        "المسافات: <code>np.linalg.norm(X[:, None, :] - C[None, :, :], axis=2)</code> وبعدين <code>argmin(axis=1)</code>.",
        "المركز الجديد لمجموعة j هو <code>X[labels == j].mean(axis=0)</code>، بشرط إن المجموعة مش فاضية (<code>np.any(labels == j)</code>).",
      ],
      solution: `import numpy as np

def kmeans(X, k, steps=10):
    X = np.asarray(X, dtype=float)
    C = X[:k].copy()
    for _ in range(steps):
        d = np.linalg.norm(X[:, None, :] - C[None, :, :], axis=2)
        labels = d.argmin(axis=1)
        newC = C.copy()
        for j in range(k):
            if np.any(labels == j):
                newC[j] = X[labels == j].mean(axis=0)
        if np.allclose(newC, C):
            break
        C = newC
    return labels.tolist(), C.round(3).tolist()

pts = [[1, 1], [8, 8], [1.5, 2], [2, 1], [9, 9.5], [8.5, 8]]
print(kmeans(pts, 2))`,
      explain: "كل جولة assign ثم update بتقلل الـ inertia أو بتساويها، فمضمون التقارب. الشرط على المجموعة الفاضية بيمنع متوسط مصفوفة فاضية (NaN). التعقيد في الجولة O(n × k × d). ولاحظ إن الابتداء بأول k صفوف مش ذكي، لأن ممكن يقعوا في نفس المجموعة، وده سبب k-means++ و<code>n_init</code>.",
    },
    {
      title: "silhouette لنقطة واحدة",
      lang: "python",
      prompt: "<p>اكتب <code>silhouette_point(X, labels, i)</code> بترجع silhouette للنقطة رقم <code>i</code> مقرّبة لـ 3 أرقام عشرية: <code>a</code> = متوسط المسافة الإقليدية لباقي نقط نفس مجموعتها، و<code>b</code> = أقل متوسط مسافة لنقط أي مجموعة تانية، والنتيجة <code>(b - a) / max(a, b)</code>. لو النقطة لوحدها في مجموعتها رجّع <code>0.0</code>.</p>",
      examples: [
        { in: "X=[[1,1],[1.5,2],[2,1],[8,8],[9,9.5],[8.5,8]]\nlabels=[0,0,0,1,1,1]\nsilhouette_point(X, labels, 0)", out: "0.9" },
        { in: "silhouette_point(X, labels, 4)", out: "0.848" },
      ],
      hints: [
        "<code>d = np.linalg.norm(X - X[i], axis=1)</code> بتدّيك المسافة من النقطة i لكل النقط.",
        "قناع نفس المجموعة من غير النقطة نفسها: <code>same = labels == labels[i]; same[i] = False</code>. وبعدين لف على كل مجموعة تانية.",
      ],
      solution: `import numpy as np

def silhouette_point(X, labels, i):
    X = np.asarray(X, dtype=float)
    labels = np.asarray(labels)
    d = np.linalg.norm(X - X[i], axis=1)
    same = labels == labels[i]
    same[i] = False
    if not same.any():
        return 0.0
    a = d[same].mean()
    b = min(d[labels == c].mean()
            for c in set(labels.tolist()) if c != labels[i])
    return round(float((b - a) / max(a, b)), 3)

X = [[1, 1], [1.5, 2], [2, 1], [8, 8], [9, 9.5], [8.5, 8]]
labels = [0, 0, 0, 1, 1, 1]
print(silhouette_point(X, labels, 0))   # 0.9`,
      explain: "بنستبعد النقطة من حساب <code>a</code> لأن مسافتها لنفسها صفر وتضلل المتوسط. <code>b</code> بياخد أقرب مجموعة تانية مش كلها. النتيجة بين -1 و1. السالب معناه إن المجموعة التانية أقرب في المتوسط. نفس القيم بتطلع من <code>silhouette_samples</code> في scikit-learn.",
    },
    {
      title: "نسب التباين في PCA بالإيد",
      lang: "python",
      prompt: "<p>اكتب <code>pca_ratio(X)</code> بتحسب <code>explained_variance_ratio</code> بدون استخدام <code>sklearn.decomposition</code>: اطرح المتوسط، احسب covariance matrix بـ <code>np.cov</code>، خد الـ eigenvalues بـ <code>np.linalg.eigvalsh</code>، رتّبهم من الأكبر للأصغر، اقسمهم على مجموعهم، وارجع قايمة مقرّبة لـ 3 أرقام عشرية.</p>",
      examples: [
        { in: "pca_ratio([[0, 0], [2, 0], [0, 2], [2, 2]])", out: "[0.5, 0.5]" },
        { in: "pca_ratio([[1, 2], [2, 4], [3, 6.5], [4, 8]])", out: "[0.999, 0.001]" },
      ],
      hints: [
        "<code>np.cov(Xc.T)</code>: بتحتاج transpose لأن <code>np.cov</code> بتتعامل مع كل صف كمتغير.",
        "<code>eigvalsh</code> بترجع الترتيب من الأصغر للأكبر، فاقلبها بـ <code>[::-1]</code>.",
      ],
      solution: `import numpy as np

def pca_ratio(X):
    X = np.asarray(X, dtype=float)
    Xc = X - X.mean(axis=0)
    vals = np.linalg.eigvalsh(np.cov(Xc.T))[::-1]
    return (vals / vals.sum()).round(3).tolist()

print(pca_ratio([[0, 0], [2, 0], [0, 2], [2, 2]]))     # [0.5, 0.5]
print(pca_ratio([[1, 2], [2, 4], [3, 6.5], [4, 8]]))   # [0.999, 0.001]`,
      explain: "المربع المتساوي الأضلاع تباينه متساوي في الاتجاهين، فكل واحد 0.5. النقط الأربعة تقريبا على خط ففي اتجاه واحد (نسبة 0.999). مجموع الـ eigenvalues يساوي مجموع تباين الأعمدة الأصلية، عشان كده النسبة بتجمع 1. دي بالظبط الحسبة اللي <code>PCA</code> بتعملها (جوه بتستخدم SVD لأنها أثبت رقميا).",
    },
  ],

  quiz: [
    {
      q: "أنهي واحد من دول مثال على unsupervised learning؟",
      options: [
        "توقع سعر شقة من مساحتها",
        "تقسيم عملاء متجر لشرايح من غير ما حد حدد الشرايح",
        "تصنيف إيميل spam أو لأ",
        "توقع هل العميل هيلغي الاشتراك بناء على سجل قديم فيه الإجابة",
      ],
      answer: 1,
      why: "التقسيم لشرايح من غير labels هو clustering. الباقي كله فيه label معروف في بيانات التدريب (سعر، spam، إلغاء)، يعني supervised.",
    },
    {
      q: "تلات نقط على خط: 0 و2 و4. لو مركز المجموعة هو متوسطهم، كام الـ inertia (مجموع مربعات المسافة للمركز)؟",
      answer: ["8", "8.0"],
      why: "المتوسط 2. المسافات -2 و0 و2 ومربعاتها 4 و0 و4، والمجموع 8.",
    },
    {
      q: "أي حاجة بتحصل للـ inertia لما تزود k في k-means (وتجيب أحسن نتيجة)؟",
      options: [
        "بتنزل أو تفضل زي ما هي، فمينفعش نختار k بأقل inertia",
        "بتزيد، فبنختار k اللي inertia عنده أعلى",
        "مفيش علاقة بين k والـ inertia",
        "بتنزل لحد k معين وبعدها ترجع تزيد",
      ],
      answer: 0,
      why: "كل مركز زيادة بيقدر يقرب نقط أكتر، فالـ inertia بتنزل (لحد صفر لما k = عدد النقط). عشان كده بندوّر على الكوع، مش على أقل قيمة.",
    },
    {
      q: "نقطة فيها <code>a = 1</code> (متوسط مسافتها لمجموعتها) و <code>b = 3</code> (لأقرب مجموعة تانية). كام الـ silhouette بتاعتها؟ (قرّب لـ 3 أرقام عشرية)",
      answer: ["0.667", "0.67", "2/3"],
      why: "(b - a) / max(a, b) = (3 - 1) / 3 = 0.667. قريبة من 1 يعني النقطة جوه مجموعتها بوضوح.",
    },
    {
      q: "عندك عمر (20-60) ودخل (2000-20000) وبتشغل k-means من غير scaling. إيه اللي هيحصل غالبا؟",
      options: [
        "العمر هيسيطر لأن قيمه أصغر",
        "k-means بيعمل scaling تلقائي جواه",
        "الدخل هيسيطر على المسافات والعمر هيتجاهل تقريبا",
        "مفيش فرق، k-means بيتجاهل الوحدات",
      ],
      answer: 2,
      why: "المسافة الإقليدية بتتأثر بالمقياس المطلق: فروق الدخل بالآلاف وفروق العمر بالعشرات. k-means ما بيعملش scaling بنفسه، فلازم StandardScaler قبله.",
    },
    {
      q: "بيانات على شكل هلالين متداخلين، وعايز تفصلهم صح. أنهي أنسب؟",
      options: [
        "k-means بـ k=2",
        "PCA",
        "silhouette",
        "DBSCAN",
      ],
      answer: 3,
      why: "DBSCAN بيمشي على الكثافة والاتصال فبيتبع شكل الهلال. k-means بيفترض مجموعات كروية وبيقطع النص (ARI 0.234 في مثالنا). PCA وsilhouette مش خوارزميات clustering.",
    },
    {
      q: "في DBSCAN، النقطة اللي ليها label = <code>-1</code> معناها إيه؟",
      options: [
        "المجموعة الأولى",
        "noise: مش تابعة لأي مجموعة",
        "خطأ في الخوارزمية",
        "مركز المجموعة",
      ],
      answer: 1,
      why: "-1 هي فئة الضجيج. من مميزات DBSCAN إنه ما بيجبرش كل نقطة تروح لمجموعة، عكس k-means.",
    },
    {
      q: "PCA على بيانات: eigenvalues للـ covariance هي 8 و 2. كام <code>explained_variance_ratio_</code> للـ component الأول؟",
      answer: ["0.8", "0.80", "80%", "4/5"],
      why: "النسبة = 8 / (8 + 2) = 0.8. يعني الـ component الأول لوحده بيشرح 80% من التباين الكلي.",
    },
    {
      q: "عملت PCA على كل الداتا (تدريب واختبار) ثم قسمتها ودربت الموديل. إيه المشكلة؟",
      options: [
        "مفيش مشكلة، PCA مش بيستخدم labels",
        "PCA لازم يتعمل بعد الموديل",
        "الدقة هتبقى أقل دايما",
        "leakage: الـ components اتحسبت باستخدام بيانات الاختبار",
      ],
      answer: 3,
      why: "حتى من غير labels، PCA اتعلم من بيانات الاختبار، فالموديل شاف معلومة عنها. الصح pipeline: fit على التدريب بس ويطبق بعدين على الاختبار. التأثير ممكن يبقى صغير، لكن المبدأ مهم.",
    },
    {
      q: "رسمت t-SNE ولقيت مجموعتين بعيدين عن بعض جدا ومجموعة صغيرة وواحدة كبيرة. أنهي استنتاج سليم؟",
      options: [
        "الفجوة بين المجموعتين تساوي حقيقية المسافة بينهم في البيانات",
        "المجموعات موجودة على الأرجح كجيران متقاربين، لكن المسافات والأحجام في الرسمة متتاخدش حرفيا",
        "المجموعة الأكبر فيها تباين أكبر بالتأكيد",
        "نقدر نستخدم الإحداثيات كـ features للـ test مباشرة",
      ],
      answer: 1,
      why: "t-SNE بيحافظ على الجيران القريبين، لكن المسافات الكبيرة والأحجام في الرسمة غير موثوقة وبتتغير مع المعاملات. هو أداة نظر واستكشاف مش قياس.",
    },
  ],
};
