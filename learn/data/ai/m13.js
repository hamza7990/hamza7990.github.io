window.LEVELS = window.LEVELS || {};
window.LEVELS["ai/m13"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "Agent = موديل في loop معاه أدوات وذاكرة وهدف، وده مش دايما الحل",
      en: "Single call vs workflow vs agent",
      body: "<p>الكلمة «agent» اتقالت على حاجات كتير جدا. تعريف عملي ثابت: <b>الـ agent هو نظام الموديل فيه هو اللي بيقرر الخطوة الجاية</b>، في loop: يختار أداة، ياخد نتيجتها، يقرر يكمل ولا يخلص، لحد ما يحقق الهدف أو يوقف. الفرق بينه وبين اللي قبله على سلم تصاعدي:</p>",
      points: [
        "<b>Single call</b>: طلب واحد للموديل ورد واحد (تلخيص، تصنيف، استخراج). الأبسط والأرخص والأسهل في الاختبار. أغلب حالات الاستخدام الحقيقية تقف هنا.",
        "<b>Workflow (سلسلة ثابتة)</b>: كودك بيحدد الخطوات بالترتيب (مثلا: استخرج ← تحقق ← لخّص ← ابعت)، والموديل بينفذ كل خطوة. قابل للتوقع والاختبار، والتكلفة والوقت معروفين تقريبا. كمان ممكن يكون فيه تفرعات بشروط تكتبها إنت.",
        "<b>Agent</b>: الموديل بيقرر عدد الخطوات والأدوات والترتيب وقت التشغيل. أقوى لما المسار مش معروف مسبقا (بحث في مصادر متعددة، حل مشكلة برمجية)، لكن أغلى وأبطأ وأقل توقعا وأصعب في التقييم.",
        "القاعدة: ابدأ بأبسط حاجة تحل المشكلة، واطلع لمستوى أعلى لما القياس يثبت إن الأبسط مش كفاية.",
      ],
      interview: [
        { q: "الفرق بين single call و workflow و agent؟ ومتى تختار كل واحد؟", a: "الـ single call طلب واحد، والـ workflow خطوات بترتيب ثابت كودي بيحدده، والـ agent الموديل نفسه بيقرر الخطوة الجاية في loop باستخدام أدوات. باختار الأبسط اللي يحل المشكلة: single call للمهام المحددة، workflow لما الخطوات معروفة، وagent لما المسار مش معروف مسبقا ومقبول التكلفة وعدم التوقع، مع guardrails وتقييم." },
      ],
    },
    {
      kicker: "أمانة هندسية",
      title: "إمتى ماتستخدمش agent",
      en: "When NOT to use an agent",
      body: "<p>أي خطوة بيقررها الموديل هي احتمال غلط جديد وتكلفة جديدة. فاسأل نفسك قبل ما تبني agent:</p>",
      points: [
        "<b>الخطوات معروفة ومتكررة؟</b> اكتبها workflow. هتبقى أسرع وأرخص وأضمن، وتقدر تعمل unit test لكل خطوة.",
        "<b>الأخطاء مكلفة ومفيش رجوع</b> (دفع، حذف، رسائل لعملاء)؟ ماتسيبش الموديل يقرر لوحده من غير موافقة بشرية.",
        "<b>محتاج latency منخفضة أو تكلفة ثابتة</b>؟ الـ agent بيعمل طلبات متعددة بعدد غير معروف.",
        "<b>مش قادر تقيّم النتيجة</b>؟ لو معندكش طريقة تعرف بيها الـ agent نجح ولا فشل، ماتشحنوش.",
        "<b>الأخطاء بتتراكم</b>: لو كل خطوة نجاحها 95%، فعشر خطوات متتالية نجاحها الكلي حوالي 60% (0.95 أس 10). كل ما الخطوات أكتر الاحتمال ينزل بسرعة.",
        "الكلام ده مش ضد الـ agents: هي مفيدة فعلا في مهام مفتوحة. الكلام إنها <b>أداة تتختار بحساب</b>، والموضة مش سبب.",
      ],
      interview: [
        { q: "ليه ممكن تفضّل workflow على agent؟", a: "لأن الـ workflow أرخص وأسرع وأسهل في الاختبار والمراقبة، والتكلفة والخطوات معروفة. الـ agent كل قرار فيه احتمال غلط، والأخطاء بتتراكم عبر الخطوات (10 خطوات بنجاح 95% لكل واحدة تدّي حوالي 60% بس)، ومدة التنفيذ والتكلفة مش متوقعة. فلو المسار معروف أكتبه خطوات ثابتة، وأستخدم agent بس لما المرونة ضرورية." },
      ],
    },
    {
      kicker: "الـ loop",
      title: "Think, Act, Observe: وذاكرة الـ agent",
      en: "The agent loop and memory",
      body: "<p>الدورة الأساسية (ReAct وأشباهها): الموديل <b>يفكر</b> في الخطوة الجاية، <b>يتصرف</b> باستدعاء أداة، <b>يلاحظ</b> النتيجة اللي بترجع في الرسايل، ويكرر. ده نفس loop الأدوات اللي كتبناه في m11 مع حد أقصى للخطوات ومعالجة الأخطاء، بس بهدف أكبر وخطوات أكتر. الجديد هنا: إزاي تخلي الدورة آمنة ومتتبعة (الشريحة الجاية)، والذاكرة.</p>",
      points: [
        "<b>ذاكرة قصيرة المدى (short-term)</b>: هي الـ context نفسه: الرسايل ونتايج الأدوات في المحادثة الجارية. محدودة بالـ window وبتكبر مع كل خطوة، فبتتقص أو بتتلخص (m10).",
        "<b>ذاكرة طويلة المدى (long-term)</b>: مخزن برا الموديل (قاعدة بيانات، ملفات، vector store) بيحتفظ بحقائق وتفضيلات وتجارب سابقة. بتسترجع منه وقت الحاجة بنفس أسلوب الـ RAG (m12) وبتكتب فيه معلومات جديدة بقرار واضح.",
        "الذاكرة الطويلة فيها مخاطر: معلومة غلط أو قديمة اتخزنت وهتتكرر، ومعلومات حساسة اتخزنت من غير إذن. حط قواعد: إيه اللي يتخزن، لحد إمتى، وإزاي المستخدم يشوفه ويمسحه.",
        "<b>Planning</b>: ساعات بنخلي الموديل يكتب خطة قبل التنفيذ ويراجعها. بيفيد في المهام الطويلة، لكنه مش ضمان: الخطة نفسها ممكن تبقى غلط.",
      ],
      terms: [
        ["agent loop", "دورة الـ agent", "الموديل يقرر ← أداة تتنفذ ← النتيجة ترجع ← يقرر تاني، لحد النهاية أو الحد الأقصى"],
        ["trace", "سجل التنفيذ", "تسجيل كل خطوة: القرار، الأداة، المعاملات، النتيجة، الوقت، التكلفة"],
        ["guardrail", "حاجز أمان", "قيد في الكود بيحدد اللي الـ agent ممكن يعمله حتى لو الموديل اتلخبط"],
      ],
      interview: [
        { q: "إيه أنواع ذاكرة الـ agent؟", a: "قصيرة المدى هي الـ context الحالي (الرسايل ونتايج الأدوات)، محدودة بالـ window فبتتقص أو بتتلخص. وطويلة المدى مخزن خارجي (قاعدة بيانات أو vector store) بيحتفظ بمعلومات عبر الجلسات وبنسترجع منه وقت الحاجة. لازم أحدد إيه اللي يتخزن ويتمسح ومين يقدر يشوفه، لأن المعلومة الغلط أو الحساسة المخزنة بتتكرر." },
      ],
    },
    {
      kicker: "كود كامل",
      title: "Agent صغير بـ guardrails و trace، أوفلاين",
      en: "A minimal agent with step limit, budget, approval and trace",
      body: "<p>الكود ده agent كامل بموديل وهمي مبرمج (في تطبيقك مكانه استدعاء موديل حقيقي). فيه كل الـ guardrails الأساسية: حد خطوات، ميزانية (بنعد كلمات كبديل بسيط للـ tokens)، كشف تكرار نفس الاستدعاء (علشان نكسر الـ loops)، قائمة أدوات مسموحة، موافقة بشرية على الأداة الخطرة، وسجل trace لكل خطوة:</p>",
      code: {
        lang: "python",
        title: "mini_agent.py",
        src: `import json

ORDERS = {"A1": {"status": "delivered", "total": 40.0}, "B2": {"status": "pending", "total": 15.5}}

def get_order(order_id):
    if order_id not in ORDERS:
        raise KeyError(f"no such order: {order_id}")
    return ORDERS[order_id]

def refund(order_id, amount):
    return f"refunded {amount} for {order_id}"

TOOLS = {"get_order": get_order, "refund": refund}
RISKY = {"refund"}                           # needs a human yes

def run_agent(model, goal, tools, max_steps=6, max_words=200, confirm=lambda c: False):
    messages = [{"role": "user", "content": goal}]
    trace, seen, words = [], set(), len(goal.split())
    for step in range(1, max_steps + 1):
        reply = model(messages)
        words += len(json.dumps(reply).split())
        if words > max_words:
            trace.append({"step": step, "event": "budget_exceeded"})
            return None, trace
        if "final" in reply:
            trace.append({"step": step, "event": "final"})
            return reply["final"], trace
        name, args = reply["tool"], reply["args"]
        key = (name, json.dumps(args, sort_keys=True))
        if key in seen:
            trace.append({"step": step, "event": "repeat_call", "tool": name})
            return None, trace
        seen.add(key)
        if name not in tools:
            result = f"ERROR: unknown tool {name}"
        elif name in RISKY and not confirm({"tool": name, "args": args}):
            result = "DENIED: a human did not approve this action"
        else:
            try:
                result = tools[name](**args)
            except Exception as e:
                result = f"ERROR: {e}"
        trace.append({"step": step, "tool": name, "args": args, "result": result})
        messages.append({"role": "tool", "content": json.dumps(result)})
    trace.append({"event": "step_limit"})
    return None, trace

def scripted(replies):                      # a real model call would replace this
    it = iter(replies)
    return lambda messages: next(it)

ok = scripted([
    {"tool": "get_order", "args": {"order_id": "B2"}},
    {"final": "Order B2 is pending."},
])
answer, trace = run_agent(ok, "Status of B2?", TOOLS)
print(answer)
for t in trace:
    print(t)
# Order B2 is pending.
# {'step': 1, 'tool': 'get_order', 'args': {'order_id': 'B2'}, 'result': {'status': 'pending', 'total': 15.5}}
# {'step': 2, 'event': 'final'}

stuck = scripted([{"tool": "get_order", "args": {"order_id": "Z9"}}] * 5)
print(run_agent(stuck, "Status of Z9?", TOOLS)[1][-1])
# {'step': 2, 'event': 'repeat_call', 'tool': 'get_order'}

risky = scripted([
    {"tool": "refund", "args": {"order_id": "A1", "amount": 40}},
    {"final": "I could not refund without approval."},
])
answer, trace = run_agent(risky, "Refund A1", TOOLS)
print(answer, "|", trace[0]["result"])
# I could not refund without approval. | DENIED: a human did not approve this action
approve = lambda c: True
risky2 = scripted([{"tool": "refund", "args": {"order_id": "A1", "amount": 40}}, {"final": "done"}])
print(run_agent(risky2, "Refund A1", TOOLS, confirm=approve)[1][0]["result"])
# refunded 40 for A1
print(run_agent(scripted([{"final": "word " * 300}]), "hi", TOOLS)[1])
# [{'step': 1, 'event': 'budget_exceeded'}]`,
        note: "الحالات الخمس: (1) تشغيل ناجح، trace فيه خطوتين. (2) موديل عالق بيكرر نفس الاستدعاء: الخطوة الأولى فشلت بـ KeyError (بتتحول لنص ERROR وترجع للموديل)، التانية نفس الاستدعاء فاتقفلت بـ <code>repeat_call</code> بدل ما يلف 5 مرات. (3) الـ refund اترفض لأن مفيش موافقة وبالتالي الموديل اتبلغ بالرفض وقدر يرد. (4) نفس الاستدعاء بموافقة اتنفذ. (5) رد طويل جدا كسر الميزانية. كل ده بيحصل <b>في كودك</b>، مش بالاعتماد إن الموديل «يتصرف صح».",
      },
      pitfall: "الاعتماد على التعليمات في الـ prompt فقط («ماتعملش refund من غير إذن»). دي بتقلل المخاطر لكن مبتضمنهاش. القيد الحقيقي لازم يكون في الكود: الأداة نفسها تتأكد من الصلاحية والموافقة.",
      interview: [
        { q: "إزاي تصمم agent آمن ومتحكم فيه؟", a: "الموديل بيقترح والكود بينفذ، فبحط guardrails في الكود: حد أقصى للخطوات وللميزانية (tokens ووقت)، قائمة أدوات مسموحة بأقل صلاحيات، تحقق من معاملات كل أداة، موافقة بشرية على الإجراءات الخطرة أو اللي مفيش رجوع فيها، كشف تكرار الاستدعاءات لكسر الـ loops، وتسجيل trace كامل لكل خطوة علشان أقدر أراجع وأعمل debug. والأخطاء بترجع للموديل كنص بدل ما تكسر البرنامج." },
      ],
    },
    {
      kicker: "ليه بتفشل",
      title: "Failure modes في الخطوات المتعددة، وإزاي كل guardrail بيقابلها",
      en: "Multi-step failure modes",
      body: "<p>الأعطال المتكررة في الـ agents، وكل واحد له علاج:</p>",
      points: [
        "<b>Loops</b>: يكرر نفس الاستدعاء أو يتنقل بين خطوتين. العلاج: حد خطوات، كشف التكرار (زي اللي كتبناه)، وميزانية.",
        "<b>تراكم الأخطاء (compounding)</b>: غلطة صغيرة في الخطوة 2 بتتبني عليها الخطوات التالية. العلاج: تحقق من النتايج الوسيطة، خطوات أقل، نقاط مراجعة بشرية.",
        "<b>إساءة استخدام الأدوات</b>: أداة غلط، معاملات غلط، أو استدعاء أداة خطرة بتأثير حقيقي. العلاج: validation للمعاملات، least privilege، allow-list، موافقة.",
        "<b>Context يتملى</b>: نتايج أدوات ضخمة بتزحم الـ window وبتتفوت معلومات مهمة. العلاج: قص نتايج الأدوات أو تلخيصها قبل ما ترجع للموديل.",
        "<b>Prompt injection من نتايج الأدوات</b>: صفحة ويب أو إيميل بيحتوي أوامر (m11). العلاج: اعتبرها data، وصلاحيات محدودة، وموافقة للأفعال الخطرة.",
        "<b>إعلان نجاح كاذب</b>: الـ agent يقول «خلصت» وهو ما خلصش. العلاج: تحقق مستقل من النتيجة (اختبار، فحص حالة النظام) مش بس كلام الموديل.",
        "<b>تكلفة وlatency مفتوحة</b>: العلاج: ميزانية tokens ووقت وحد خطوات، وتنبيهات.",
      ],
      interview: [
        { q: "إيه أشهر أسباب فشل الـ agents في الإنتاج؟", a: "loops بيكرر نفس الخطوة، وتراكم الأخطاء عبر الخطوات، وإساءة استخدام الأدوات أو معاملات غلط، وامتلاء الـ context بنتايج كبيرة، وprompt injection من محتوى بيقراه، وإعلان نجاح من غير تحقق. العلاجات: حدود خطوات وميزانية، تحقق من النتايج والمعاملات، أقل صلاحيات، موافقة بشرية، وtrace للمراجعة." },
      ],
    },
    {
      kicker: "التقييم",
      title: "تقييم تطبيقات LLM: unit checks و golden dataset و regression و tracing",
      en: "Evaluating LLM applications",
      body: "<p>تطبيق LLM من غير تقييم هو تطبيق مبتعرفش بيشتغل ولا لأ. الطبقات (من الأرخص للأغلى):</p>",
      points: [
        "<b>فحوص آلية صغيرة (unit-style)</b>: assertions على كل رد: JSON صالح؟ الحقول موجودة؟ الطول في الحد؟ مفيش إيميلات أو أرقام حساسة؟ الاستشهادات موجودة؟ الأداة الصح اتنادت؟ رخيصة وبتشتغل على كل رد.",
        "<b>Golden dataset</b>: أمثلة حقيقية (من المستخدمين، بعد إخفاء البيانات الحساسة) مع الإجابة أو المعيار المتوقع، تشمل الحالات الصعبة وحالات الرفض. بتتقيس عليها كل نسخة. ابدأ بـ 30 لـ 100 مثال، وزوّد كل ما يظهر فشل جديد في الإنتاج.",
        "<b>Regression testing</b>: كل تغيير (prompt، موديل، chunking، أداة) يتشغل عليه الـ golden dataset وتقارن بالنسخة السابقة. مش بس المتوسط: لازم تعرف <b>أنهي حالات اتكسرت</b> حتى لو الدقة الكلية ثابتة.",
        "<b>Human review</b> لعينة من الحالات، خصوصا للمهام المفتوحة، علشان تضبط عليها المقاييس الآلية.",
        "<b>Tracing وobservability</b>: سجل كل طلب في الإنتاج: المدخل، الـ prompt الفعلي، الأدوات، النتايج، الرد، الوقت، التكلفة. من غيره مستحيل تعمل debug لإجابة غلط جت من مستخدم. وتقدر تحول الحالات الفاشلة لحالات اختبار.",
        "<b>Online metrics</b>: معدل الرفض، تقييم المستخدم، نسبة التصعيد لبشر، التكلفة لكل طلب. بتكمّل الاختبار الأوفلاين مش بتحل محله.",
      ],
      code: {
        lang: "python",
        title: "regression: الدقة ثابتة بس فيه حالة اتكسرت",
        src: `CASES = [
    {"id": 1, "input": "charged twice", "expected": "billing"},
    {"id": 2, "input": "app crashes", "expected": "bug"},
    {"id": 3, "input": "where is your office", "expected": "other"},
    {"id": 4, "input": "invoice missing", "expected": "billing"},
]

old_outputs = {1: "billing", 2: "bug", 3: "other", 4: "other"}
new_outputs = {1: "billing", 2: "other", 3: "other", 4: "billing"}

def score(outputs):
    return {c["id"]: outputs[c["id"]] == c["expected"] for c in CASES}

def regression_report(old, new, max_drop=0.0):
    so, sn = score(old), score(new)
    acc_old = sum(so.values()) / len(so)
    acc_new = sum(sn.values()) / len(sn)
    broke = [i for i in so if so[i] and not sn[i]]
    fixed = [i for i in so if not so[i] and sn[i]]
    passed = acc_new >= acc_old - max_drop and not broke
    return {"old": acc_old, "new": acc_new, "broke": broke, "fixed": fixed, "pass": passed}

print(regression_report(old_outputs, new_outputs))
# {'old': 0.75, 'new': 0.75, 'broke': [2], 'fixed': [4], 'pass': False}`,
        note: "الدقة الكلية 0.75 في النسختين، وكنا هنقول «مفيش فرق». لكن الحالة 2 (كانت صح واتكسرت) والحالة 4 اتصلحت. لو الحالة 2 مهمة (مثلا bug في الإنتاج) فالتغيير ده مرفوض حتى لو المتوسط ثابت. عشان كده الـ regression report بيحتفظ بقوائم الحالات، مش بس الرقم.",
      },
      interview: [
        { q: "إزاي تعمل regression testing لـ prompt أو موديل؟", a: "عندي golden dataset من حالات حقيقية متنوعة. عند أي تغيير بشغّل النسخة الجديدة على نفس الأمثلة وأقارن بالنسخة السابقة: الدقة الكلية، وقائمة الحالات اللي اتكسرت واللي اتصلحت، لأن المتوسط ممكن يخبي كسر في حالة مهمة. بحط عتبة للقبول، وبضيف أي فشل جديد من الإنتاج للـ dataset. وبكمّلها بـ tracing ومراجعة بشرية لعينة." },
      ],
    },
    {
      kicker: "قاضي آلي",
      title: "LLM-as-judge: مفيد بس عنده انحيازاته",
      en: "LLM-as-judge and its biases",
      body: "<p>للمهام المفتوحة (تلخيص، شرح، رد دعم) مفيش exact match. الحل الشائع: موديل يقيّم الردود بمعيار مكتوب (rubric) أو يقارن ردين. رخيص وبيتوسع، لكن له عيوب معروفة لازم تتحسب:</p>",
      points: [
        "<b>Position bias</b>: بيميل للرد اللي ظهر الأول (أو التاني) بغض النظر عن الجودة.",
        "<b>Length/verbosity bias</b>: بيفضّل الردود الأطول والأكثر تفصيلا حتى لو أقل دقة.",
        "<b>Self-preference</b>: بعض الموديلات بتميل لردود مكتوبة بأسلوبها أو من نفس عائلتها.",
        "<b>مش بيتحقق من الحقائق</b> بشكل موثوق: رد واثق ومنسق ممكن ياخد درجة عالية وهو غلط.",
        "<b>العلاج</b>: rubric واضح بنقاط محددة، تقييم الاتنين بالترتيبين (اللي بيتغير حسب الترتيب يعتبر تعادل أو بيتراجع)، مراجعة بشرية لعينة وقياس اتفاق القاضي مع البشر، وماتعتمدش عليه وحده في قرارات مهمة.",
      ],
      code: {
        lang: "python",
        title: "قاضي وهمي بانحيازين، واختبار تبديل الترتيب",
        src: `def biased_judge(first, second):
    """Fake LLM judge with two known biases: position and length."""
    score_first = len(first.split()) + 3          # +3 = favours the first slot
    score_second = len(second.split())
    return "first" if score_first >= score_second else "second"

short_correct = "Refunds take 14 days."
long_vague = "Refunds may take a while depending on many factors and the method used."

def compare(a, b):
    r1 = biased_judge(a, b)                        # a shown first
    r2 = biased_judge(b, a)                        # swapped order
    w1 = a if r1 == "first" else b
    w2 = b if r2 == "first" else a
    return w1, w2

w1, w2 = compare(short_correct, long_vague)
print(w1 == w2, "| order 1 winner:", w1[:20], "| order 2 winner:", w2[:20])
# True | order 1 winner: Refunds may take a w | order 2 winner: Refunds may take a w

same = "Refunds take 14 days."
w1, w2 = compare(same, "Refunds take fourteen days.")
print(w1 == w2)
# False`,
        note: "الحالة الأولى: القاضي اختار الرد الطويل الغامض في الترتيبين (متسق) رغم إن القصير هو الصحيح: <b>انحياز الطول</b> مش بيتكشف بتبديل الترتيب. التانية: ردين بنفس الطول، القاضي اختار اللي في الخانة الأولى دايما، فالنتيجة اتغيرت بتبديل الترتيب: <b>انحياز الموضع</b> بيتكشف. فتبديل الترتيب بيمسك نوع واحد من الانحيازات، والمراجعة البشرية والـ rubric بيمسكوا الباقي.",
      },
      interview: [
        { q: "إيه عيوب LLM-as-judge؟ وإزاي تقللها؟", a: "عنده position bias (بيميل للرد الأول أو التاني)، وlength bias (بيحب الأطول)، وself-preference لردود بأسلوبه، وبيتخدع برد واثق وغلط لأنه مش بيتحقق من الحقائق. بقلل بـ rubric محدد، وتقييم الاتنين بالترتيبين وتجاهل النتايج اللي بتتغير، وبقيس اتفاقه مع تقييم بشر على عينة، وبستخدمه كإشارة مش كحكم نهائي." },
      ],
    },
    {
      kicker: "التكلفة والإنتاج",
      title: "التحكم في التكلفة، والشحن للإنتاج: fallbacks و monitoring و خصوصية",
      en: "Cost control and shipping",
      body: "<p>اللي بيقتل مشاريع LLM عادة هو التكلفة والموثوقية، مش الذكاء. أهم الأدوات:</p>",
      points: [
        "<b>تكلفة</b>: حد للـ tokens في كل مرحلة، موديل أصغر للمهام البسيطة (تصنيف، استخراج) وأكبر للصعبة، caching للطلبات المتكررة وللجزء الثابت من الـ prompt، batching للشغل غير العاجل، prompts أقصر وretrieval بدل مستندات كاملة (m11 وm12)، وميزانية لكل مستخدم أو طلب.",
        "<b>Latency</b>: streaming، تقليل عدد الخطوات المتسلسلة، تنفيذ طلبات مستقلة بالتوازي، موديلات أصغر، وتحديد مهلة (timeout) لكل استدعاء.",
        "<b>Fallbacks</b>: الخدمة الخارجية ممكن تقع أو تبطأ. retry على الأخطاء المؤقتة بس (timeout، rate limit) مع backoff، وبعدين موديل احتياطي أو رد مخزن أو رسالة واضحة للمستخدم. ماتعملش retry على أخطاء مفيش فايدة منها (طلب غلط).",
        "<b>Monitoring</b>: معدل الأخطاء، latency (percentiles مش المتوسط بس)، التكلفة لكل طلب، معدل الرفض والتصعيد، وانحراف الجودة مع الوقت، لأن مزود الموديل ممكن يحدّث الموديل أو يوقفه.",
        "<b>الخصوصية</b>: ماتبعتش بيانات شخصية للمزود أكتر من اللازم (احجب أو اختصر)، اقرا سياسة الاحتفاظ والتدريب عند المزود، شفّر وقيّد الوصول للـ logs والـ traces لأنها فيها كلام المستخدمين، حدد مدة الاحتفاظ، والتزم بالقوانين المطبقة عليك، واحترم طلبات الحذف.",
        "<b>اعتمد على إصدار موديل ثابت</b> لو المزود بيسمح، وشغّل regression قبل أي ترقية.",
      ],
      code: {
        lang: "python",
        title: "retry على الأخطاء المؤقتة + fallback + routing",
        src: `class TransientError(Exception):
    pass

def call_with_retry(fn, tries=3, sleep=lambda s: None):
    for attempt in range(tries):
        try:
            return fn()
        except TransientError:
            if attempt == tries - 1:
                raise
            sleep(2 ** attempt)                   # 1s, 2s, ... (exponential backoff)

def call_with_fallback(primary, backup, tries=2):
    try:
        return "primary", call_with_retry(primary, tries)
    except TransientError:
        return "backup", backup()

def route(task):
    cheap = {"classify", "extract", "rewrite"}
    return "small-model" if task in cheap else "large-model"

state = {"n": 0}
def flaky():
    state["n"] += 1
    if state["n"] < 3:
        raise TransientError("timeout")
    return "ok"
waits = []
print(call_with_retry(flaky, tries=3, sleep=waits.append), state["n"], waits)
# ok 3 [1, 2]

def always_down():
    raise TransientError("down")
print(call_with_fallback(always_down, lambda: "cached answer"))
# ('backup', 'cached answer')
print(route("classify"), route("plan_trip"))
# small-model large-model`,
        note: "الدالة flaky فشلت مرتين وطلعت ناجحة في الثالثة، والـ <code>waits</code> فيها [1, 2] (ثانية ثم ثانيتين) من غير ما فعلا ننام لأن <code>sleep</code> بتتمرر كمعامل (بنختبر من غير انتظار). الـ <code>route</code> مثال مبسط: في الواقع القرار بيتبني على قياس جودة الموديل الأصغر على مهمتك.",
      },
      interview: [
        { q: "إزاي تجهز تطبيق LLM للإنتاج؟", a: "أتحكم في التكلفة (حدود tokens، موديل مناسب لكل مهمة، caching)، وأضيف مهلات وretry على الأخطاء المؤقتة بس مع backoff وfallback لموديل احتياطي أو رد مخزن. بعمل tracing ومراقبة للأخطاء والـ latency والتكلفة والجودة، وregression قبل أي تغيير في الموديل أو الـ prompt. وأحمي الخصوصية: أقلل البيانات المبعوتة، وأراجع سياسة المزود، وأقيّد وأحدد مدة الاحتفاظ بالـ logs." },
      ],
    },
    {
      kicker: "الصورة الصادقة",
      title: "إيه الحقيقي وإيه الـ hype",
      en: "What is real and what is hype",
      body: "<p>مجال بيتحرك بسرعة وفيه كلام كتير. دي نظرة محافظة، والناس بتختلف في تفاصيلها:</p>",
      points: [
        "<b>حقيقي ومفيد دلوقتي</b>: تلخيص، استخراج بيانات، تصنيف، بحث في مستندات (RAG)، مساعدة في الكود، تحويل النص لصيغ منظمة، مساعدين بأدوات محدودة وواضحة.",
        "<b>اتقال أكتر من اللي اتحقق</b>: «agent مستقل بيدير شغلك كله من غير مراجعة». الأنظمة اللي بتنجح فعلا غالبا ضيقة، بأدوات محدودة، وبإنسان في الحلقة للقرارات المهمة.",
        "<b>أرقام الـ benchmarks</b> مفيدة للمقارنة العامة، لكنها مش بتتنبأ بأدائك على مهمتك. ساعات الموديلات بتتدرب قرب الاختبارات نفسها. قيّم على بياناتك.",
        "<b>«الموديل الأكبر هيحل كل حاجة»</b>: القدرات بتتحسن، لكن التصميم الهندسي (retrieval، تحقق، تقييم، حدود صلاحيات) هو اللي بيفرق بين demo يشتغل ومنتج يعتمد عليه.",
        "<b>اللي بيثبت</b>: فهم الأساسيات (tokens، context، decoding، embeddings)، التقييم الجاد، التصميم الدفاعي، التحكم في التكلفة، والخصوصية. أسماء الأدوات والمكتبات والموديلات بتتغير كل كام شهر، فاتعلم المبادئ.",
        "<b>في الإنترفيو</b>: الأقوى إنك تقول «ده اللي أعرفه، ودي حدوده، وده اللي كنت هقيسه»، مش ترد بمبالغة. المقابل بيسمع كتير buzzwords وبيقدّر الحس الهندسي.",
      ],
      interview: [
        { q: "إيه رأيك في الـ agents: حقيقة ولا hype؟", a: "الاتنين. الـ agents بأدوات محدودة وهدف واضح وguardrails وإنسان في الحلقة بتشتغل فعلا في مهام زي البحث والدعم والكود. لكن «agent مستقل بالكامل» لشغل حرج لسه مش موثوق: الأخطاء بتتراكم عبر الخطوات والتكلفة مش متوقعة. فأبدأ بأبسط تصميم (single call ثم workflow)، وأستخدم agent لما المرونة ضرورية، وأقيس بجد قبل ما أشحن." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: routing حسب المهمة",
      lang: "python",
      code: `def route(task, cheap=("classify", "extract")):
    if task in cheap:
        return "small"
    return "large"

for t in ("classify", "plan", "extract"):
    print(t, "->", route(t))`,
      note: "الناتج: <code>classify -> small</code> ثم <code>plan -> large</code> ثم <code>extract -> small</code>. الفكرة: المهمة البسيطة تروح لموديل أرخص.",
    },
    {
      title: "اكتب: كشف الاستدعاء المتكرر",
      lang: "python",
      code: `calls = [("search", "a"), ("calc", "1+1"), ("search", "a")]
seen = set()

for call in calls:
    if call in seen:
        print("repeat", call)
        break
    seen.add(call)
    print("run", call)`,
      note: "الناتج: <code>run ('search', 'a')</code> ثم <code>run ('calc', '1+1')</code> ثم <code>repeat ('search', 'a')</code>. ده نفس مبدأ <code>repeat_call</code> في الـ agent.",
    },
    {
      title: "اكتب: trace مع تنفيذ أداة",
      lang: "python",
      code: `def add(a, b):
    return a + b

TOOLS = {"add": add}
trace = []

def act(name, args):
    try:
        result = TOOLS[name](**args)
    except Exception as e:
        result = f"ERROR: {e}"
    trace.append({"tool": name, "result": result})
    return result

act("add", {"a": 2, "b": 3})
act("sub", {"a": 2, "b": 3})
print(trace)`,
      note: "الناتج: <code>[{'tool': 'add', 'result': 5}, {'tool': 'sub', 'result': \"ERROR: 'sub'\"}]</code>. الأداة المش موجودة بتطلع KeyError اتحول لنص بدل ما ينهار البرنامج.",
    },
  ],

  tasks: [
    {
      title: "لخّص trace",
      lang: "python",
      prompt: "<p>اكتب <code>summarize_trace(trace)</code>. <code>trace</code> قائمة dicts. السجلات اللي فيها مفتاح <code>\"tool\"</code> هي استدعاءات أدوات (وممكن يكون فيها <code>\"result\"</code>)، والسجلات التانية أحداث (<code>\"event\"</code>). رجّع dict فيه: <code>calls</code> (عدد الاستدعاءات لكل أداة)، <code>errors</code> (عدد النتايج اللي نصها بيبدأ بـ <code>\"ERROR\"</code>)، <code>finished</code> (<code>True</code> لو فيه حدث <code>\"final\"</code>).</p>",
      examples: [
        { in: "summarize_trace([{'tool': 'search', 'result': 'ERROR: timeout'}, {'tool': 'search', 'result': '3 hits'}, {'tool': 'calc', 'result': 7}, {'event': 'final'}])", out: "{'calls': {'search': 2, 'calc': 1}, 'errors': 1, 'finished': True}" },
        { in: "summarize_trace([{'event': 'step_limit'}])", out: "{'calls': {}, 'errors': 0, 'finished': False}" },
      ],
      starter: `def summarize_trace(trace):
    pass`,
      hints: [
        "<code>collections.Counter</code> بتعد الأدوات: <code>Counter(t['tool'] for t in trace if 'tool' in t)</code>.",
        "استخدم <code>str(t.get('result', ''))</code> علشان النتيجة ممكن تكون رقم.",
      ],
      solution: `from collections import Counter

def summarize_trace(trace):
    calls = Counter(t["tool"] for t in trace if "tool" in t)
    errors = sum(1 for t in trace if str(t.get("result", "")).startswith("ERROR"))
    finished = any(t.get("event") == "final" for t in trace)
    return {"calls": dict(calls), "errors": errors, "finished": finished}

trace = [
    {"step": 1, "tool": "search", "args": {}, "result": "ERROR: timeout"},
    {"step": 2, "tool": "search", "args": {}, "result": "3 hits"},
    {"step": 3, "tool": "calc", "args": {}, "result": 7},
    {"step": 4, "event": "final"},
]
print(summarize_trace(trace))
print(summarize_trace([{"event": "step_limit"}]))`,
      explain: "الـ trace لو كان structured (dicts) سهل تحلله بكود زي ده: عدد الاستدعاءات لكل أداة، معدل الأخطاء، هل خلص. ده أساس الـ observability. التحويل بـ <code>str()</code> بيمنع خطأ لو النتيجة رقم.",
    },
    {
      title: "retry مع exponential backoff",
      lang: "python",
      prompt: "<p>اكتب <code>call_with_retry(fn, tries=3, sleep=lambda s: None)</code>. بتستدعي <code>fn()</code>. لو رمت <code>TransientError</code> وفضل محاولات، استنى <code>2 ** attempt</code> ثواني (ابدأ attempt من 0) باستدعاء <code>sleep(...)</code> ثم حاول تاني. لو آخر محاولة فشلت ارمي نفس الاستثناء. أي استثناء تاني (غير <code>TransientError</code>) يطلع فورا من غير retry. استخدم <code>class TransientError(Exception): pass</code>.</p>",
      examples: [
        { in: "# fn fails twice then returns 'ok'; waits=[]\ncall_with_retry(fn, 3, waits.append)", out: "'ok'    waits == [1, 2]" },
        { in: "# fn always raises TransientError, tries=2\ncall_with_retry(fn, 2, waits.append)", out: "raises TransientError after 1 wait" },
      ],
      starter: `class TransientError(Exception):
    pass

def call_with_retry(fn, tries=3, sleep=lambda s: None):
    pass`,
      hints: [
        "<code>for attempt in range(tries):</code> وجواه <code>try: return fn()</code>.",
        "<code>except TransientError:</code> لو <code>attempt == tries - 1</code> اعمل <code>raise</code>، وإلا <code>sleep(2 ** attempt)</code>.",
      ],
      solution: `class TransientError(Exception):
    pass

def call_with_retry(fn, tries=3, sleep=lambda s: None):
    for attempt in range(tries):
        try:
            return fn()
        except TransientError:
            if attempt == tries - 1:
                raise
            sleep(2 ** attempt)

n = {"c": 0}
def flaky():
    n["c"] += 1
    if n["c"] < 3:
        raise TransientError("t")
    return "ok"

waits = []
print(call_with_retry(flaky, 3, waits.append), n["c"], waits)

def down():
    raise TransientError("down")

waits2 = []
try:
    call_with_retry(down, 2, waits2.append)
except TransientError as e:
    print("raised", e, waits2)

def bad():
    raise ValueError("not transient")

try:
    call_with_retry(bad)
except ValueError as e:
    print("raised", e)`,
      explain: "بنمرر <code>sleep</code> كمعامل علشان الاختبار ميستناش فعليا. الـ retry للأخطاء المؤقتة بس (timeout، rate limit)، وغير كده (مثلا طلب غلط) هتعيد نفس الفشل وتبذّر وقت وفلوس. في الإنتاج بيتضاف عادة jitter عشوائي صغير علشان آلاف العملاء ميعيدوش في نفس اللحظة.",
    },
    {
      title: "حكم القاضي بالترتيبين",
      lang: "python",
      prompt: "<p>اكتب <code>judge_pair(judge, a, b)</code>. <code>judge(x, y)</code> دالة بترجع <code>\"first\"</code> أو <code>\"second\"</code> (أي رد كسب لما x اتعرض الأول و y التاني). شغّل القاضي مرتين: <code>(a, b)</code> ثم <code>(b, a)</code>. لو اختار نفس الرد في الاتنين رجّع <code>\"a\"</code> أو <code>\"b\"</code>، ولو اختلف (يعني متأثر بالترتيب) رجّع <code>\"tie\"</code>.</p>",
      examples: [
        { in: "judge_pair(lambda x, y: 'first', 'x', 'yy')", out: "'tie'" },
        { in: "judge_pair(lambda x, y: 'first' if len(x) >= len(y) else 'second', 'x', 'yy')", out: "'b'" },
        { in: "judge_pair(lambda x, y: 'first' if len(x) >= len(y) else 'second', 'yyy', 'x')", out: "'a'" },
      ],
      starter: `def judge_pair(judge, a, b):
    pass`,
      hints: [
        "<code>r1 = judge(a, b)</code> و<code>r2 = judge(b, a)</code>.",
        "في الأولى: first يعني a. في التانية: first يعني b (لأن b اتعرض الأول). حوّل الاتنين لـ <code>'a'</code>/<code>'b'</code> وقارن.",
      ],
      solution: `def judge_pair(judge, a, b):
    r1 = judge(a, b)
    r2 = judge(b, a)
    win1 = "a" if r1 == "first" else "b"
    win2 = "b" if r2 == "first" else "a"
    return win1 if win1 == win2 else "tie"

pos_judge = lambda x, y: "first"
len_judge = lambda x, y: "first" if len(x) >= len(y) else "second"
print(judge_pair(pos_judge, "x", "yy"))
print(judge_pair(len_judge, "x", "yy"))
print(judge_pair(len_judge, "yyy", "x"))`,
      explain: "التبديل بيكشف انحياز الموضع: القاضي اللي بيختار الخانة الأولى دايما بيطلع tie. لاحظ إن len_judge متسق بس منحاز للطول، والتبديل مش هيكشفه، وده سبب إننا بنحتاج rubric ومراجعة بشرية كمان. في الإنتاج بنخلي القاضي موديل حقيقي، ونعد نسبة الـ ties كمؤشر على جودة القاضي.",
    },
  ],

  quiz: [
    {
      q: "أنهي وصف يميز الـ agent عن الـ workflow؟",
      options: [
        "الـ agent دايما بيستخدم موديل أكبر",
        "في الـ agent الموديل هو اللي بيقرر الخطوة الجاية والأدوات وقت التشغيل، وفي الـ workflow الكود هو اللي بيحدد الخطوات",
        "الـ workflow مفيهوش موديل أصلا",
        "الـ agent لازم يكون عنده GPU خاص",
      ],
      answer: 1,
      why: "الفرق في مين بيتحكم في المسار. الـ workflow ممكن يستخدم موديل في كل خطوة، لكن الترتيب بيحدده الكود. حجم الموديل أو العتاد ملوش علاقة بالتعريف.",
    },
    {
      q: "مهمة خطواتها معروفة ومتكررة (استخرج، تحقق، لخّص، ابعت) وبتتشغل ملايين المرات. إيه الأنسب؟",
      options: [
        "agent مستقل بأدوات كتيرة",
        "agent بذاكرة طويلة",
        "ماينفعش LLM أصلا",
        "workflow بخطوات ثابتة في الكود، كل خطوة بتتختبر لوحدها",
      ],
      answer: 3,
      why: "المسار معروف، فالـ workflow أرخص وأسرع وأسهل في الاختبار. الـ agent بيضيف عدم توقع وتكلفة من غير فايدة هنا.",
    },
    {
      q: "عدد سجلات الـ trace في أول تجربة ناجحة (get_order ثم final) في كود الـ agent؟",
      answer: ["2"],
      why: "سجل للاستدعاء (الخطوة 1)، وسجل لحدث final (الخطوة 2). كل خطوة بتتسجل.",
    },
    {
      q: "الـ agent طلب <code>refund</code> بـ 40 على طلب. إيه الحماية الصح لأداة زي دي؟",
      options: [
        "الأداة تحتاج موافقة بشرية صريحة، والكود يتحقق من الصلاحية والمعاملات قبل التنفيذ",
        "نكتب في الـ prompt «ماتعملش refund من غير إذن» وبس",
        "نزود الـ temperature",
        "نسيب الموديل يقرر لوحده لأنه ذكي",
      ],
      answer: 0,
      why: "التعليمات في الـ prompt بتقلل لكن مبتضمنش. القيد الحقيقي في الكود: allow-list وتحقق وموافقة للأفعال اللي مفيهاش رجوع.",
    },
    {
      q: "قاضي LLM اختار الرد اللي في الخانة الأولى في الحالتين لما بدّلنا الترتيب بين ردين بنفس الجودة. ده اسمه إيه؟",
      options: [
        "length bias",
        "overfitting",
        "position bias",
        "data leakage",
      ],
      answer: 2,
      why: "الاختيار تابع للمكان مش للجودة: position bias. length bias يعني بيحب الأطول. الباقي مفاهيم تانية.",
    },
    {
      q: "نسخة جديدة من الـ prompt دقتها 0.75 زي القديمة، لكن حالة كانت صح بقت غلط وحالة تانية اتصلحت. القرار الأفضل؟",
      options: [
        "نقبلها، لأن الدقة نفسها",
        "ندرس الحالة اللي اتكسرت قبل القبول، لأن المتوسط ممكن يخبي كسر في حالة مهمة",
        "نرفضها دايما لأي تغيير",
        "نقيس مرة تانية على نفس الأمثلة إلى أن تطلع نتيجة أحسن",
      ],
      answer: 1,
      why: "الـ regression report بيحتفظ بقوائم الحالات اللي اتكسرت واللي اتصلحت. القبول يعتمد على أهمية الحالات مش المتوسط فقط. إعادة القياس لحد ما تعجبك نتيجة هي overfitting على الاختبار.",
    },
    {
      q: "أنهي أخطاء الاستدعاء تستاهل retry مع backoff؟",
      options: [
        "طلب مكتوب غلط (معاملات ناقصة)",
        "الأخطاء كلها بدون تمييز",
        "الأخطاء اللي رسالتها غير واضحة",
        "الأخطاء المؤقتة زي timeout أو rate limit",
      ],
      answer: 3,
      why: "الخطأ المؤقت ممكن ينجح في المحاولة الجاية. الطلب الغلط هيفشل كل مرة فالـ retry تبذير. الـ backoff بيمنع إغراق الخدمة.",
    },
    {
      q: "<code>call_with_retry</code> مع <code>tries=3</code> والدالة بتفشل مرتين بـ TransientError وبعدها تنجح. قايمة الانتظارات (exponential backoff 2 أس attempt) اللي اتمررت لـ sleep؟",
      answer: ["[1, 2]", "1, 2", "1,2", "[1,2]"],
      why: "بعد الفشل الأول attempt=0 فنستنى 2^0=1، وبعد التاني attempt=1 فنستنى 2^1=2، والمحاولة التالتة تنجح فمفيش انتظار.",
    },
    {
      q: "تطبيقك بيعمل تصنيف تذاكر بسيط بملايين الطلبات وتكلفته عالية. أول حاجة تجربها؟",
      options: [
        "تحويله لـ agent بأدوات",
        "زيادة طول الـ prompt بأمثلة كتير",
        "تجربة موديل أصغر وأرخص على golden set، مع prompt أقصر وcaching، وقياس إن الجودة مقبولة",
        "إيقاف التقييم لتوفير الفلوس",
      ],
      answer: 2,
      why: "المهام البسيطة غالبا بتتحمل موديل أصغر، والقياس على golden set هو اللي بيأكد. الـ agent والأمثلة الأكتر بيزودوا التكلفة، وإيقاف التقييم بيخبي الجودة.",
    },
    {
      q: "أنهي ممارسة أنسب لخصوصية بيانات المستخدمين في الـ logs والـ traces؟",
      options: [
        "نقلل البيانات الشخصية المسجلة أو نحجبها، ونقيد الوصول، ونحدد مدة احتفاظ",
        "نسجل كل حاجة للأبد علشان نقدر نحلل",
        "نسيب الـ logs متاحة لكل المهندسين",
        "نبعت كل البيانات للمزود من غير مراجعة سياسته",
      ],
      answer: 0,
      why: "الـ traces فيها كلام المستخدمين، فلازم تقليل وحجب وصلاحيات ومدة احتفاظ. وسياسة المزود (الاحتفاظ والتدريب) لازم تتراجع قبل الإرسال.",
    },
  ],
};
