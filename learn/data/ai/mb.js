window.LEVELS = window.LEVELS || {};
window.LEVELS["ai/mb"] = {
  boss: [
    {
      q: "اشرح الـ bias والـ variance، وإزاي تعرف إن موديلك عنده واحدة منهم؟",
      a: "الـ bias هو الخطأ المنتظم لأن الموديل أبسط من إنه يلقط النمط (underfitting)، والـ variance هو حساسية الموديل لتفاصيل عينة التدريب فبيتغير كتير لو غيرتها (overfitting). بشخّص بمقارنة الأداء على التدريب والـ validation: الاتنين ضعاف يبقى bias عالي، التدريب ممتاز والـ validation أضعف بفرق كبير يبقى variance عالي. وكمان learning curve: لو المنحنيين قريبين وعند أداء ضعيف فبيانات أكتر مش هتفيد (محتاج موديل أقوى أو features أحسن)، ولو فيه فجوة كبيرة فبيانات أكتر أو regularization أو موديل أبسط بيفيدوا.",
    },
    {
      q: "إيه هو الـ data leakage؟ هات مثالين وقولي إزاي تتجنبه.",
      a: "هو إن معلومة من خارج اللي هيتاح وقت التنبؤ الفعلي تدخل التدريب، فالنتيجة بتبقى متفائلة وتنهار في الإنتاج. مثال أول: <code>fit</code> للـ scaler أو الـ imputer على كل البيانات قبل التقسيم فمتوسط الـ test دخل التدريب. مثال تاني: عمود بيكشف الإجابة (target leakage) زي «تم إلغاء الحساب» في موديل بيتنبأ بالإلغاء، أو تقسيم عشوائي لبيانات زمنية بدل ما نتدرب على الماضي ونختبر على المستقبل. بتجنبه بتقسيم الأول، وكل التحويلات جوه <code>Pipeline</code> بتتعلم من التدريب بس، وفحص الأعمدة المشكوك فيها، والتقسيم الزمني لو الزمن مهم.",
    },
    {
      q: "موديل بيكشف حالات احتيال، الاحتيال 1% من العمليات. الدقة طلعت 99%. هل ده كويس؟ اشرح precision و recall بالسيناريو ده.",
      a: "مش بالضرورة: موديل بيقول «مفيش احتيال» لكل عملية هياخد 99% وهو عديم القيمة (accuracy بتكدب مع الفئات النادرة). الـ recall هو من كل الاحتيال الحقيقي كام نسبة مسكناها، والـ precision هو من كل اللي أنذرنا بيه كام نسبة كان احتيال فعلا. الـ recall المنخفض معناه احتيال بيعدي، والـ precision المنخفض معناه عملاء سليمين بيتوقف حسابهم وفريق مراجعة غرقان. اختار المقياس والعتبة (threshold) حسب تكلفة كل نوع غلط، وبقارن بـ baseline (دايما «لا احتيال») وبـ PR curve أو F1.",
    },
    {
      q: "بياناتك imbalanced بشدة. إزاي تتعامل معاها؟",
      a: "أول حاجة اختار مقياس مناسب (precision وrecall وF1 أو PR-AUC، مش accuracy)، واستخدم stratified split علشان الفئة النادرة تظهر في كل جزء. بعدين خيارات للتدريب: <code>class_weight</code> بيزود غرامة الغلط على الفئة النادرة، أو oversampling للنادرة أو undersampling للشائعة (على التدريب بس، مش على الـ validation أو الـ test)، أو جمع بيانات أكتر من النادرة. وبعد التدريب بضبط عتبة القرار حسب تكلفة الأخطاء بدل 0.5 تلقائيا. وبتأكد إن أي resampling جوه الـ cross-validation مش قبله علشان ما يحصلش leakage.",
    },
    {
      q: "موديلك ممتاز offline على الـ test لكن أداؤه سيئ في الإنتاج. تشخّص إزاي؟",
      a: "بفحص الأسباب بالترتيب: leakage في التقييم (التقسيم أو feature بتتعرف متأخر في الواقع)، وdistribution shift (بيانات الإنتاج مختلفة عن التدريب: مستخدمين جدد، موسم، تغيير في المنتج)، وtraining-serving skew (الـ preprocessing أو الـ features بتتحسب بشكل مختلف في الإنتاج)، وإن المقياس offline مش هو اللي يهم الشغل فعلا. بقارن توزيعات الـ features بين التدريب والإنتاج، وبسجل الـ inputs والتنبؤات، وبشغل نفس الـ pipeline على عينة إنتاج وأقارن، وبعمل تقييم على بيانات حديثة (time-based). والحل بيعتمد على السبب: إعادة تدريب، إصلاح الـ pipeline، أو تغيير المقياس.",
    },
    {
      q: "اشرح الشبكة العصبية وإزاي بتتدرب بكلام بسيط، من غير معادلات.",
      a: "الشبكة سلسلة طبقات، كل طبقة بتاخد أرقام وتضربها في أوزان وتجمعها وتمرّرها من دالة غير خطية (زي ReLU)، والطبقات اللي ورا بعض بتبني تمثيلات أغنى من المدخل. في التدريب بنمرر مثال للأمام (forward) فتطلع توقع، ونحسب الـ loss اللي بيقيس الغلط، وبعدين الـ backpropagation بيحسب مساهمة كل وزن في الغلط بقاعدة السلسلة، وgradient descent بيعدّل كل وزن خطوة صغيرة (learning rate) في الاتجاه اللي بيقلل الغلط. بنكرر على batches صغيرة ونراقب الـ validation علشان ما نحفظش. من غير الدوال غير الخطية كل الطبقات تنهار لطبقة خطية واحدة.",
    },
    {
      q: "اشرح الـ attention والـ Transformer لمهندس مش في الـ ML.",
      a: "الفكرة إن كل كلمة (token) تبص على باقي الكلمات وتقرر أنهي واحدة مهمة لفهمها. تقنيا كل token بيطلع query وkey وvalue؛ الـ query بيتقارن بكل الـ keys (ضرب نقطي) فتطلع درجات، softmax بيحولها لأوزان مجموعها 1، والناتج الجديد للـ token هو مجموع الـ values بالأوزان دي. القسمة على الجذر التربيعي للبُعد بتمنع الـ softmax من التشبع. الـ Transformer بيكرر بلوك من multi-head attention وfeed-forward مع residual وlayer norm، ويضيف positional encoding علشان يعرف الترتيب، وفي الـ LLMs بيستخدم causal mask علشان كل token يشوف اللي قبله بس. ميزته إن الحساب كله مصفوفات بتتوازى على GPU، وعيبه إن تكلفة الـ attention تربيعية في طول السياق.",
    },
    {
      q: "ليه الـ LLMs بتعمل hallucination؟ وإزاي تقلله في تطبيقك؟",
      a: "لأنها متدربة على توقع النص الأكثر احتمالا، مش على التحقق من الحقيقة، فلما مبتعرفش بتولّد استمرار مقنع الشكل. وعندها knowledge cutoff فمعلومات حديثة أو خاصة مش في معرفتها. بقلل المشكلة بـ RAG: أحط المصادر في الـ prompt وأطلب الإجابة منها فقط مع استشهادات وإمكانية «مش موجود»، وأدوات للحساب والبحث، وفحص آلي للمخرجات (schema، استشهادات صحيحة)، ومراجعة بشرية للقرارات المهمة، وتقييم على golden set. ومقدرش أقول إنها بتتشال تماما.",
    },
    {
      q: "إيه هو prompt injection؟ إزاي تحمي مساعد بيقرا إيميلات العملاء ومعاه أدوات؟",
      a: "هو إن نص من مصدر غير موثوق (إيميل، صفحة، مستند) يحتوي تعليمات والموديل ينفذها لأنه مبيفرقش بين بيانات وأوامر، ومفيش حل واحد بيمنعه تماما. فبدافع بطبقات: أفصل المحتوى عن التعليمات بعلامات وأقول للموديل إنه data، وأدّي المساعد أقل أدوات ممكنة (قراءة بس لو كفاية)، وأتحقق في الكود من اسم الأداة ومعاملاتها قبل التنفيذ، وأطلب موافقة بشرية على أي إجراء خطر أو مفيهوش رجوع (إرسال، دفع، حذف)، وأسجل كل استدعاء وأحدد ميزانية وخطوات. الفكرة إني أفترض إن الموديل ممكن يتخدع وأخلي الضرر محدود.",
    },
    {
      q: "صمم مساعد أسئلة وأجوبة على مستندات شركة (سياسات وإجراءات داخلية). إيه الأجزاء؟ وإزاي تقيّمه؟",
      a: "Pipeline أوفلاين: تحميل المستندات مع metadata (القسم، التاريخ، الصلاحيات)، تقطيع على حدود طبيعية (عناوين وفقرات) مع overlap، embeddings لكل chunk، تخزينها في index (exact يكفي لو الحجم صغير، ANN أو vector DB لو كبير)، وجدولة تحديث لما المستندات تتغير. أونلاين: السؤال ← retrieval (ممكن hybrid مع BM25) مفلتر بصلاحيات المستخدم ← reranking لأحسن 3 لـ 5 ← prompt فيه الـ chunks مرقمة وتعليمة «جاوب منها فقط واذكر المصدر ولو مش موجود قول مش عارف» ← الموديل ← فحص الاستشهادات. التقييم: golden set من أسئلة حقيقية، retrieval recall@k منفصل عن faithfulness الإجابة، ومراجعة بشرية لعينة، وtracing وlogs محمية، وتتبع التكلفة والـ latency، وإضافة كل فشل حقيقي للـ golden set.",
    },
    {
      q: "عندك مهمة مع LLM. إمتى تستخدم prompting، وإمتى retrieval، وإمتى fine-tuning؟",
      a: "أبدأ بالـ prompting لأنه الأرخص والأسرع في التجربة: تعليمات واضحة وأمثلة few-shot وصيغة مخرجات. لو المشكلة نقص معلومة (خاصة، متغيرة، محتاجة citations) فالحل retrieval لأنه بيحدّث المعرفة من غير تدريب وبيدّي مصادر. لو المشكلة سلوك: أسلوب ثابت، صيغة مخرجات دقيقة، مهمة ضيقة بتتكرر، أو عايز موديل أصغر وأرخص يقوم بيها، وعندي أمثلة جيدة كتير، فالـ fine-tuning بيفيد. الـ fine-tuning مش وسيلة موثوقة لحقن معلومات متغيرة. وممكن أجمع بينهم، وكل قرار بيتأخد بقياس على مثال حقيقي.",
    },
    {
      q: "إمتى تستخدم agent بدل workflow؟ وإيه الضمانات اللي بتحطها قبل ما تشحنه؟",
      a: "الـ workflow لما الخطوات معروفة (أرخص وأسرع وأسهل في الاختبار)، والـ agent لما المسار مش معروف مسبقا والمرونة تستاهل التكلفة وعدم التوقع، لأن الأخطاء بتتراكم عبر الخطوات. الضمانات: حد أقصى للخطوات والـ tokens والوقت، allow-list للأدوات بأقل صلاحيات، تحقق من المعاملات، موافقة بشرية على الإجراءات الخطرة، كشف الاستدعاءات المتكررة، trace كامل، تحقق مستقل من النتيجة بدل تصديق «خلصت»، وتقييم على سيناريوهات حقيقية قبل الإطلاق. وبتحكم في التكلفة بميزانية لكل طلب، وموديل أصغر للخطوات البسيطة، وcaching.",
    },
    {
      q: "إزاي تقيّم تطبيق LLM وتتأكد إن تغيير في الـ prompt أو الموديل ما كسرش حاجة؟ وإيه مشاكل LLM-as-judge؟",
      a: "بعمل golden dataset من حالات حقيقية متنوعة فيها الصعب وحالات الرفض، وفحوص آلية على كل رد (schema، طول، استشهادات، أدوات)، وبشغّل كل نسخة جديدة على نفس المجموعة وأقارن بالسابقة بما فيها قائمة الحالات اللي اتكسرت، مش المتوسط بس. للمهام المفتوحة ممكن أستخدم LLM-as-judge لكنه عنده position bias وlength bias وself-preference ومبيتحققش من الحقائق، فبستخدم rubric واضح، وأقيّم بالترتيبين، وأقيس اتفاقه مع بشر على عينة. وبكمّل بـ tracing في الإنتاج ومراجعة بشرية.",
    },
    {
      q: "اكتب كود: قسّم بيانات تصنيف imbalanced لتدريب وvalidation، ابني pipeline فيه scaling وموديل، وقيس precision وrecall وF1.",
      a: "<pre dir='ltr'><code>from sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import precision_score, recall_score, f1_score\n\nX, y = make_classification(n_samples=1000, weights=[0.9], random_state=0)\nX_tr, X_val, y_tr, y_val = train_test_split(\n    X, y, test_size=0.2, stratify=y, random_state=0)\n\nmodel = make_pipeline(StandardScaler(),\n                      LogisticRegression(class_weight='balanced', max_iter=1000))\nmodel.fit(X_tr, y_tr)          # the scaler learns from training data only\npred = model.predict(X_val)\nprint(precision_score(y_val, pred), recall_score(y_val, pred), f1_score(y_val, pred))</code></pre> بقسّم الأول مع <code>stratify</code> علشان الفئة النادرة تظهر في الجزئين، والـ scaler جوه الـ pipeline فبيتعلم من التدريب بس (من غير leakage)، و<code>class_weight</code> للتعامل مع الـ imbalance، والمقاييس على الفئة النادرة بدل accuracy. وبعد ما أختار الإعدادات بالـ validation أو cross-validation، الـ test يتفتح مرة واحدة.",
    },
    {
      q: "اكتب كود: دالة تحسب cosine similarity بين سؤال ومصفوفة متجهات وترجّع أعلى k نتايج بـ NumPy.",
      a: "<pre dir='ltr'><code>import numpy as np\n\ndef top_k(query, matrix, k):\n    q = np.asarray(query, dtype=float)\n    M = np.asarray(matrix, dtype=float)\n    norms = np.linalg.norm(M, axis=1) * np.linalg.norm(q)\n    scores = np.divide(M @ q, norms, out=np.zeros(len(M)), where=norms &gt; 0)\n    idx = np.argsort(-scores, kind='stable')[:k]\n    return idx.tolist(), scores[idx].round(3).tolist()\n\nM = [[1, 0], [0, 1], [1, 1]]\nprint(top_k([1, 0], M, 2))   # ([0, 2], [1.0, 0.707])</code></pre> <code>M @ q</code> بيحسب كل الـ dot products مرة واحدة. بقسم على حاصل ضرب الأطوال لأن cosine بيقيس الاتجاه، وبحمي من القسمة على صفر. لو المتجهات normalised مسبقا الضرب النقطي وحده كفاية. ومع ملايين المتجهات أنتقل لـ ANN أو vector database.",
    },
    {
      q: "اكتب كود: هيكل loop لـ tool calling مع حد أقصى للخطوات ومعالجة أخطاء الأدوات.",
      a: "<pre dir='ltr'><code>def run(model, tools, question, max_steps=5):\n    messages = [{'role': 'user', 'content': question}]\n    for _ in range(max_steps):\n        reply = model(messages)            # {'final': ...} or {'tool': ..., 'args': {...}}\n        if 'final' in reply:\n            return reply['final']\n        name, args = reply['tool'], reply['args']\n        if name not in tools:\n            result = f'ERROR: unknown tool {name}'\n        else:\n            try:\n                result = tools[name](**args)\n            except Exception as e:\n                result = f'ERROR: {e}'\n        messages.append({'role': 'tool', 'content': str(result)})\n    return None                            # step limit reached\n\nscript = iter([{'tool': 'add', 'args': {'a': 2, 'b': 3}}, {'final': 'The sum is 5'}])\nprint(run(lambda m: next(script), {'add': lambda a, b: a + b}, 'sum?'))</code></pre> الموديل بيقترح وكودي هو اللي بينفذ، فبتحقق من اسم الأداة (allow-list)، وبحوّل الأخطاء لنص يرجع للموديل بدل ما البرنامج ينهار، والحد الأقصى بيمنع loop لانهائي. في الإنتاج بضيف تحقق من المعاملات وموافقة بشرية للأدوات الخطرة وميزانية tokens وtrace.",
    },
  ],
};
