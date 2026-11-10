window.LEVELS = window.LEVELS || {};
window.LEVELS["flutter/f6"] = {
  slides: [
    {
      kicker: "الأساس",
      title: "TextField و TextFormField",
      en: "TextField vs TextFormField",
      body: "<p><code>TextField</code> حقل إدخال لوحده: بتقرا قيمته بـ <code>onChanged</code> أو بـ controller. <code>TextFormField</code> هو نفس الـ TextField لكن ملفوف جوه <code>FormField</code>، فيقدر يشتغل مع <code>Form</code> ويتحقق من صحته ويحفظ قيمته (<code>validator</code> و <code>onSaved</code>).</p>",
      points: [
        "حقل واحد بسيط (بحث مثلا) ← <code>TextField</code>.",
        "فورم فيه أكتر من حقل ومحتاج validation ← <code>TextFormField</code> جوه <code>Form</code>.",
        "الشكل بيتحدد بـ <code>InputDecoration</code> (label, hint, icon, errorText, border).",
      ],
      code: {
        lang: "dart",
        src: `TextField(
  decoration: const InputDecoration(
    labelText: 'Search',
    hintText: 'villa in Riyadh',
    prefixIcon: Icon(Icons.search),
    border: OutlineInputBorder(),
  ),
  onChanged: (value) => debugPrint('typed: $value'),
  onSubmitted: (value) => debugPrint('submitted: $value'),
)`,
        note: "<code>onChanged</code> مع كل حرف، و<code>onSubmitted</code> لما المستخدم يضغط زرار الإدخال في الكيبورد.",
      },
    },
    {
      title: "TextEditingController",
      en: "Create, read, dispose",
      body: "<p>الـ controller بيخليك تقرا النص وتغيره من الكود. القواعد نفسها اللي عرفتها في f2: بيتعمل مرة واحدة (field أو <code>initState</code>)، وبيتقفل في <code>dispose</code>، ومش جوه <code>build</code>.</p>",
      code: {
        lang: "dart",
        src: `class _SearchBarState extends State<SearchBar> {
  final TextEditingController _controller = TextEditingController();

  void _clear() {
    _controller.clear();
  }

  void _search() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    debugPrint('search for $text');
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _controller,
      onSubmitted: (_) => _search(),
    );
  }
}`,
        note: "اقرا <code>_controller.text</code> وقت ما تحتاجه (عند الضغط على زرار) بدل ما تعمل <code>setState</code> مع كل حرف.",
      },
      pitfall: "تدي <code>TextFormField</code> الاتنين: <code>controller</code> و <code>initialValue</code>. بيطلع assertion. لو عايز قيمة ابتدائية مع controller اكتبها في الـ constructor: <code>TextEditingController(text: 'abc')</code>.",
      interview: [
        { q: "إمتى تستخدم controller ولما تستخدم onChanged؟", a: "<code>onChanged</code> مناسب لما محتاج تتفاعل مع كل تغيير (بحث لحظي، تفعيل زرار). الـ controller مناسب لما أحتاج أقرا القيمة وقت معين (عند submit)، أو أغيرها من الكود (clear أو ملء قيمة)، أو أسمع لتغييرها. والـ controller لازم يتعمل مرة واحدة ويتقفل في <code>dispose</code>." },
      ],
    },
    {
      title: "Form و GlobalKey و validate",
      en: "Form, GlobalKey<FormState>, validate, save",
      body: "<p>الـ <code>Form</code> بيجمع الحقول اللي جواه. بتديه <code>GlobalKey&lt;FormState&gt;</code> عشان توصل لـ <code>FormState</code> من برا وتنادي عليه:</p>",
      terms: [
        ["validate()", "تحقق", "بتنادي <code>validator</code> بتاع كل حقل. بترجع <code>true</code> لو كله سليم، وبتعرض رسايل الأخطاء تحت الحقول."],
        ["save()", "حفظ", "بتنادي <code>onSaved</code> لكل حقل (بتستلم القيمة)."],
        ["reset()", "رجّع", "بترجع الحقول لقيمتها المبدئية."],
      ],
      code: {
        lang: "dart",
        src: `// in the State: final _formKey = GlobalKey<FormState>();
Form(
  key: _formKey,
  child: Column(
    children: [
      TextFormField(
        decoration: const InputDecoration(labelText: 'Name'),
        validator: (value) {
          if (value == null || value.trim().isEmpty) {
            return 'Name is required';
          }
          return null;
        },
      ),
      ElevatedButton(
        onPressed: () {
          if (_formKey.currentState!.validate()) {
            debugPrint('valid');
          }
        },
        child: const Text('Save'),
      ),
    ],
  ),
)`,
        note: "الـ <code>validator</code> بيرجع <code>String?</code>: نص الخطأ لو فيه مشكلة، أو <code>null</code> لو القيمة سليمة.",
      },
      focus: [{ label: "احفظها", text: "validator يرجع <b>رسالة الخطأ</b> لو غلط و<code>null</code> لو صح. والـ GlobalKey بتتعمل مرة واحدة كـ field في الـ State." }],
      interview: [
        { q: "إزاي تعمل validation لفورم في Flutter؟", a: "بلف الحقول بـ <code>Form</code> وبديله <code>GlobalKey&lt;FormState&gt;</code>، وبستخدم <code>TextFormField</code> وبكتب <code>validator</code> لكل حقل بيرجع نص الخطأ أو null. عند الضغط على الزرار بنادي <code>_formKey.currentState!.validate()</code> فلو رجعت true أكمل، وغير كده بتظهر الرسايل تحت الحقول. ممكن أضيف <code>autovalidateMode: AutovalidateMode.onUserInteraction</code> عشان الأخطاء تظهر بعد ما المستخدم يلمس الحقل." },
      ],
    },
    {
      title: "Validators عملية",
      en: "Writing validators",
      body: "<p>الـ validator دالة عادية: خليها صغيرة ومنفصلة عشان تتعاد استخدامها وتتختبر.</p>",
      code: {
        lang: "dart",
        src: `String? requiredField(String? v) {
  if (v == null || v.trim().isEmpty) return 'Required';
  return null;
}

String? emailValidator(String? v) {
  final text = v?.trim() ?? '';
  if (text.isEmpty) return 'Email is required';
  final ok = RegExp(r'^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$').hasMatch(text);
  return ok ? null : 'Enter a valid email';
}

String? passwordValidator(String? v) {
  if (v == null || v.length < 8) return 'At least 8 characters';
  return null;
}

// usage
// TextFormField(validator: emailValidator)`,
        note: "مفيش regex مثالي للإيميل. الـ regex البسيطة كفاية للفحص الأولي والسيرفر هو المرجع النهائي.",
      },
      points: [
        "<code>autovalidateMode: AutovalidateMode.onUserInteraction</code>: الخطأ يظهر بعد ما المستخدم يلمس الحقل، مش من أول ما الفورم يفتح.",
        "للتأكيد على نفس كلمة السر: validator الحقل التاني بيقارن بـ <code>_password.text</code> (من controller الحقل الأول).",
      ],
    },
    {
      title: "الـ Focus ولوحة المفاتيح",
      en: "FocusNode, textInputAction, keyboardType",
      body: "<p>عشان المستخدم ينتقل من حقل لحقل من الكيبورد من غير ما يلمس الشاشة، بتظبط <code>textInputAction</code> (زرار الإدخال شكله إيه) و<code>FocusNode</code> (مين ياخد الفوكس بعده).</p>",
      code: {
        lang: "dart",
        src: `class _TwoFieldsState extends State<TwoFields> {
  final FocusNode _passwordFocus = FocusNode();

  @override
  void dispose() {
    _passwordFocus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextFormField(
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.next,
          onFieldSubmitted: (_) => _passwordFocus.requestFocus(),
        ),
        TextFormField(
          focusNode: _passwordFocus,
          obscureText: true,
          textInputAction: TextInputAction.done,
          onFieldSubmitted: (_) => FocusScope.of(context).unfocus(),
        ),
      ],
    );
  }
}`,
        note: "الـ <code>FocusNode</code> زي أي controller: بيتقفل في <code>dispose</code>. <code>unfocus()</code> بيقفل الكيبورد.",
      },
      points: [
        "<code>keyboardType</code>: <code>emailAddress</code>, <code>phone</code>, <code>number</code>, <code>multiline</code>, <code>url</code>. بيغير شكل الكيبورد بس، مبيفلترش اللي بيتكتب.",
        "<code>textInputAction</code>: <code>next</code>, <code>done</code>, <code>search</code>, <code>send</code>.",
        "تنقل فوكس تلقائي من غير FocusNode: <code>FocusScope.of(context).nextFocus()</code>.",
      ],
    },
    {
      title: "إخفاء الباسورد والـ formatters",
      en: "obscureText, inputFormatters, maxLength",
      codes: [
        {
          lang: "dart",
          title: "باسورد مع زرار إظهار",
          src: `TextFormField(
  obscureText: _obscure,
  decoration: InputDecoration(
    labelText: 'Password',
    suffixIcon: IconButton(
      icon: Icon(
        _obscure ? Icons.visibility : Icons.visibility_off,
      ),
      onPressed: () => setState(() => _obscure = !_obscure),
    ),
  ),
)`,
          note: "<code>_obscure</code> متغير <code>bool</code> في الـ State.",
        },
        {
          lang: "dart",
          title: "أرقام بس وحد أقصى",
          src: `TextFormField(
  keyboardType: TextInputType.number,
  inputFormatters: [
    FilteringTextInputFormatter.digitsOnly,
    LengthLimitingTextInputFormatter(10),
  ],
  decoration: const InputDecoration(labelText: 'Phone'),
)`,
          note: "الـ formatters بتفلتر اللي بيتكتب (محتاجة <code>import 'package:flutter/services.dart';</code> فوق الملف). مبتغنيش عن الـ validator لأن الصق/autofill ممكن يتخطى بعض الحالات.",
        },
      ],
      pitfall: "تعتمد على <code>keyboardType: number</code> بس عشان تمنع الحروف. الكيبورد بس بيتغير شكله، لكن الصق أو كيبورد خارجي يدخل أي نص. استخدم <code>inputFormatters</code> فعلا.",
    },
    {
      title: "أخطاء السيرفر ومنع الضغط المزدوج",
      en: "Server-side errors and submitting state",
      body: "<p>الـ validator بيشوف الشكل بس. إن الإيميل مستخدم أو الباسورد غلط لا يعرفه إلا السيرفر. الأسلوب العملي: متغير <code>String? _serverError</code> في الـ State يتعرض كـ <code>errorText</code> أو نص أحمر، ومتغير <code>bool _submitting</code> يعطل الزرار ويعرض loading أثناء الطلب.</p>",
      code: {
        lang: "dart",
        src: `Future<void> _submit() async {
  if (!_formKey.currentState!.validate()) return;
  setState(() {
    _submitting = true;
    _serverError = null;
  });
  try {
    await api.login(_email.text.trim(), _password.text);
    if (!mounted) return;
    context.go('/home');
  } on Exception {
    if (!mounted) return;
    setState(() => _serverError = 'Wrong email or password');
  } finally {
    if (mounted) setState(() => _submitting = false);
  }
}

// in build:
// onPressed: _submitting ? null : _submit,`,
        note: "<code>onPressed: null</code> بيعطل الزرار بصريا ووظيفيا. وفي <code>finally</code> بنرجع <code>_submitting</code> لـ false في كل الحالات. (<code>context.go</code> من go_router).",
      },
      interview: [
        { q: "إزاي تمنع المستخدم يضغط الزرار مرتين وهو بيبعت الطلب؟ وتعرض خطأ جاي من السيرفر؟", a: "بخزن <code>_submitting</code> في الـ State: أول ما الطلب يبدأ <code>setState</code> بـ true، والزرار <code>onPressed: _submitting ? null : _submit</code> فبيتعطل. بلف الطلب بـ <code>try/catch/finally</code> وفي <code>finally</code> برجعها false مع فحص <code>mounted</code>. وخطأ السيرفر بخزنه في <code>_serverError</code> وبعرضه كـ errorText أو نص تحت الفورم." },
      ],
    },
    {
      title: "فورم login كامل",
      en: "A complete login form",
      code: {
        lang: "dart",
        title: "login_form.dart",
        src: `class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final _formKey = GlobalKey<FormState>();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _passwordFocus = FocusNode();
  bool _obscure = true;
  bool _submitting = false;
  String? _serverError;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    _passwordFocus.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _submitting = true;
      _serverError = null;
    });
    try {
      await api.login(_email.text.trim(), _password.text);
    } on Exception {
      if (mounted) setState(() => _serverError = 'Login failed');
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      child: Column(
        children: [
          TextFormField(
            controller: _email,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
            decoration: const InputDecoration(labelText: 'Email'),
            validator: (v) =>
                (v == null || !v.contains('@')) ? 'Invalid email' : null,
            onFieldSubmitted: (_) => _passwordFocus.requestFocus(),
          ),
          TextFormField(
            controller: _password,
            focusNode: _passwordFocus,
            obscureText: _obscure,
            textInputAction: TextInputAction.done,
            decoration: InputDecoration(
              labelText: 'Password',
              suffixIcon: IconButton(
                icon: Icon(
                  _obscure ? Icons.visibility : Icons.visibility_off,
                ),
                onPressed: () => setState(() => _obscure = !_obscure),
              ),
            ),
            validator: (v) =>
                (v == null || v.length < 8) ? 'Min 8 characters' : null,
            onFieldSubmitted: (_) => _submit(),
          ),
          if (_serverError != null)
            Text(
              _serverError!,
              style: TextStyle(color: Theme.of(context).colorScheme.error),
            ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: _submitting ? null : _submit,
            child: _submitting
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Text('Login'),
          ),
        ],
      ),
    );
  }
}`,
        note: "كل اللي اتعلمناه في ملف واحد: controllers و focus و dispose، validators، الباسورد المخفي، حالة الإرسال، وخطأ السيرفر. <code>api.login</code> هنا طلب شبكة افتراضي بيرمي <code>Exception</code> لو فشل. لو اتأكدت الدخول بتنقل المستخدم (<code>context.go</code>) بعد فحص <code>mounted</code>.",
      },
      pitfall: "تنسى <code>dispose</code> لواحد من الـ controllers أو الـ focus nodes. في فورم كبير دي أسهل غلطة، فاعمل dispose لكل حاجة عملتها في نفس الوقت اللي بتعملها.",
      interview: [
        { q: "TextField ولا TextFormField؟ وإمتى؟", a: "<code>TextFormField</code> هو TextField ملفوف في FormField، فبيشتغل مع <code>Form</code> ويدعم <code>validator</code> و<code>onSaved</code> والـ <code>validate()</code> الجماعي. بستخدمه في أي فورم، وبستخدم <code>TextField</code> العادي للحقول المستقلة زي البحث. الاتنين بيدعموا نفس الـ controller والـ decoration والـ formatters." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: TextFormField بـ validator",
      lang: "dart",
      code: `TextFormField(
  controller: _controller,
  keyboardType: TextInputType.emailAddress,
  textInputAction: TextInputAction.next,
  decoration: const InputDecoration(labelText: 'Email'),
  validator: (value) {
    if (value == null || !value.contains('@')) {
      return 'Enter a valid email';
    }
    return null;
  },
)`,
    },
    {
      title: "اكتب: Form وزرار الحفظ",
      lang: "dart",
      code: `Form(
  key: _formKey,
  child: Column(
    children: [
      TextFormField(validator: requiredField),
      FilledButton(
        onPressed: () {
          if (_formKey.currentState!.validate()) {
            debugPrint('ok');
          }
        },
        child: const Text('Save'),
      ),
    ],
  ),
)`,
    },
    {
      title: "اكتب: إرسال مع loading",
      lang: "dart",
      code: `Future<void> _submit() async {
  if (!_form.currentState!.validate()) return;
  setState(() => _busy = true);
  try {
    await repo.save(_draft);
  } finally {
    if (mounted) {
      setState(() => _busy = false);
    }
  }
}`,
    },
  ],

  tasks: [
    {
      title: "حقل رقم الجوال",
      lang: "dart",
      prompt: "<p>اكتب دالة <code>String? phoneValidator(String? v)</code> ترجع <code>null</code> لو الرقم 10 أرقام وبيبدأ بـ <code>05</code>، وإلا رسالة مناسبة (فاضي: <code>Phone is required</code>، غير كده: <code>Use 05xxxxxxxx</code>). واكتب <code>PhoneField</code> (stateless) فيه <code>TextFormField</code> لوحة أرقام، بيقبل أرقام بس وبحد أقصى 10، ومعاه الـ validator.</p>",
      examples: [{ in: "phoneValidator('0551234567')", out: "null" }, { in: "phoneValidator('123')", out: "Use 05xxxxxxxx" }],
      hints: [
        "الفحص: <code>RegExp(r'^05\\d{8}$').hasMatch(v)</code>.",
        "الـ formatters: <code>FilteringTextInputFormatter.digitsOnly</code> و<code>LengthLimitingTextInputFormatter(10)</code>.",
      ],
      solution: `String? phoneValidator(String? v) {
  final text = v?.trim() ?? '';
  if (text.isEmpty) return 'Phone is required';
  if (!RegExp(r'^05\\d{8}$').hasMatch(text)) return 'Use 05xxxxxxxx';
  return null;
}

class PhoneField extends StatelessWidget {
  const PhoneField({super.key});

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      keyboardType: TextInputType.phone,
      inputFormatters: [
        FilteringTextInputFormatter.digitsOnly,
        LengthLimitingTextInputFormatter(10),
      ],
      decoration: const InputDecoration(labelText: 'Phone'),
      validator: phoneValidator,
    );
  }
}`,
      explain: "الـ formatters بتمنع الإدخال الغلط، والـ validator بيتأكد من القواعد (بيبدأ بـ 05). الاتنين مع بعض: مفيش واحد بيغني عن التاني. والـ validator دالة top-level فتتختبر لوحدها. ولا تنسى <code>import 'package:flutter/services.dart';</code> للـ formatters.",
    },
    {
      title: "فورم تسجيل بـ confirm password",
      lang: "dart",
      prompt: "<p>اكتب <code>RegisterForm</code> (stateful) فيه: الاسم (مطلوب)، الإيميل (لازم فيه <code>@</code>)، الباسورد (8 أحرف على الأقل)، تأكيد الباسورد (لازم يساوي الباسورد). زرار «Register» لو الفورم سليم يطبع <code>registered</code> بـ <code>debugPrint</code>. الأخطاء تظهر بعد ما المستخدم يلمس الحقل. نظّف الـ controller اللازم.</p>",
      hints: [
        "محتاج <code>TextEditingController _password</code> عشان حقل التأكيد يقارن بـ <code>_password.text</code>.",
        "على الـ <code>Form</code> حط <code>autovalidateMode: AutovalidateMode.onUserInteraction</code>.",
      ],
      solution: `class RegisterForm extends StatefulWidget {
  const RegisterForm({super.key});

  @override
  State<RegisterForm> createState() => _RegisterFormState();
}

class _RegisterFormState extends State<RegisterForm> {
  final _formKey = GlobalKey<FormState>();
  final _password = TextEditingController();

  @override
  void dispose() {
    _password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      child: Column(
        children: [
          TextFormField(
            decoration: const InputDecoration(labelText: 'Name'),
            validator: (v) =>
                (v == null || v.trim().isEmpty) ? 'Required' : null,
          ),
          TextFormField(
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(labelText: 'Email'),
            validator: (v) =>
                (v == null || !v.contains('@')) ? 'Invalid email' : null,
          ),
          TextFormField(
            controller: _password,
            obscureText: true,
            decoration: const InputDecoration(labelText: 'Password'),
            validator: (v) =>
                (v == null || v.length < 8) ? 'Min 8 characters' : null,
          ),
          TextFormField(
            obscureText: true,
            decoration: const InputDecoration(labelText: 'Confirm'),
            validator: (v) =>
                v == _password.text ? null : 'Passwords do not match',
          ),
          FilledButton(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                debugPrint('registered');
              }
            },
            child: const Text('Register'),
          ),
        ],
      ),
    );
  }
}`,
      explain: "حقل التأكيد بيقارن بـ controller الباسورد. الـ controller الوحيد اللي محتاجينه هو ده، وباقي الحقول بيقراها الـ Form نفسه عند الحفظ. لاحظ <code>dispose</code> للـ controller.",
    },
    {
      title: "إرسال مع خطأ من السيرفر",
      lang: "dart",
      prompt: "<p>اكتب <code>CodeForm</code> (stateful): حقل واحد للكود وزرار «Verify». عندك دالة <code>Future&lt;bool&gt; verifyCode(String code)</code> (ارجع بيها كأنها موجودة). الزرار: لو الحقل فاضي ميعملش حاجة. أثناء الطلب الزرار معطل ويكتب «Checking...». لو الدالة رجعت false أو رمت exception، اعرض تحت الحقل <code>Invalid code</code> بلون الخطأ. لو true اطبع <code>ok</code>. تأكد من <code>mounted</code>.</p>",
      hints: [
        "متغيرات الـ State: <code>_checking</code> و<code>_error</code> (<code>String?</code>) و<code>TextEditingController</code>.",
        "الخطأ ممكن يكون <code>errorText</code> في الـ <code>InputDecoration</code>.",
      ],
      solution: `Future<bool> verifyCode(String code) async => code == '1234';

class CodeForm extends StatefulWidget {
  const CodeForm({super.key});

  @override
  State<CodeForm> createState() => _CodeFormState();
}

class _CodeFormState extends State<CodeForm> {
  final _code = TextEditingController();
  bool _checking = false;
  String? _error;

  @override
  void dispose() {
    _code.dispose();
    super.dispose();
  }

  Future<void> _verify() async {
    final code = _code.text.trim();
    if (code.isEmpty) return;
    setState(() {
      _checking = true;
      _error = null;
    });
    var ok = false;
    try {
      ok = await verifyCode(code);
    } on Exception {
      ok = false;
    }
    if (!mounted) return;
    setState(() {
      _checking = false;
      _error = ok ? null : 'Invalid code';
    });
    if (ok) debugPrint('ok');
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          controller: _code,
          decoration: InputDecoration(
            labelText: 'Code',
            errorText: _error,
          ),
        ),
        FilledButton(
          onPressed: _checking ? null : _verify,
          child: Text(_checking ? 'Checking...' : 'Verify'),
        ),
      ],
    );
  }
}`,
      explain: "الـ <code>errorText</code> هو الطريقة الأبسط لعرض خطأ السيرفر تحت الحقل. وكل حالة (checking وerror) متغير في الـ State، والـ <code>mounted</code> بعد الـ await قبل أي <code>setState</code>.",
    },
  ],

  quiz: [
    {
      q: "أنهي widget بيدعم <code>validator</code> جوه <code>Form</code>؟",
      options: [
        "<code>TextField</code>",
        "<code>TextFormField</code>",
        "<code>Text</code>",
        "<code>InputDecorator</code>",
      ],
      answer: 1,
      why: "<code>TextFormField</code> هو الـ TextField ملفوف في FormField. الـ TextField العادي مفيهوش validator.",
    },
    {
      q: "الـ validator بيرجع إيه لو القيمة سليمة؟",
      options: [
        "<code>true</code>",
        "string فاضي <code>''</code>",
        "<code>null</code>",
        "<code>false</code>",
      ],
      answer: 2,
      why: "النوع <code>String?</code>: أي نص يعتبر رسالة خطأ (حتى الفاضي بيعتبر خطأ)، و<code>null</code> معناه سليم.",
    },
    {
      q: "عشان تعمل validation للفورم كله من زرار، تحتاج:",
      options: [
        "تنادي <code>validator</code> بتاع كل حقل بإيدك",
        "<code>GlobalKey&lt;FormState&gt;</code> على الـ Form وتنادي <code>currentState!.validate()</code>",
        "<code>setState</code> بس",
        "<code>Navigator.validate</code>",
      ],
      answer: 1,
      why: "الـ GlobalKey بتدي وصول لـ FormState، و<code>validate()</code> بتنادي كل الـ validators وبترجع bool.",
    },
    {
      q: "إيه المشكلة؟",
      code: { lang: "dart", src: `@override
Widget build(BuildContext context) {
  final controller = TextEditingController();
  return TextField(controller: controller);
}` },
      options: [
        "ناقص <code>const</code>",
        "الـ controller بيتعمل من جديد كل rebuild (والنص بيضيع) ومبيتقفلش",
        "<code>TextField</code> مبتقبلش controller",
        "لازم <code>late</code>",
      ],
      answer: 1,
      why: "الـ controller مكانه field في الـ State: يتعمل مرة واحدة ويتقفل في dispose.",
    },
    {
      q: "حطيت <code>keyboardType: TextInputType.number</code> والمستخدم لسه قدر يلصق حروف. الحل؟",
      options: [
        "<code>obscureText: true</code>",
        "<code>keyboardType</code> بتتعامل مع الحروف تلقائيا",
        "<code>inputFormatters: [FilteringTextInputFormatter.digitsOnly]</code>",
        "<code>maxLength</code> بس",
      ],
      answer: 2,
      why: "<code>keyboardType</code> بيغير شكل الكيبورد فقط. الفلترة الفعلية بتتم بالـ <code>inputFormatters</code>.",
    },
    {
      q: "عايز لما المستخدم يضغط Next في حقل الإيميل ينتقل الفوكس لحقل الباسورد. تعمل إيه؟",
      options: [
        "<code>textInputAction: next</code> و<code>onFieldSubmitted: (_) =&gt; _passwordFocus.requestFocus()</code> وحقل الباسورد له <code>focusNode</code>",
        "<code>Navigator.push</code>",
        "<code>validate()</code>",
        "<code>setState</code> بـ index",
      ],
      answer: 0,
      why: "<code>textInputAction</code> يغير زرار الكيبورد، و<code>requestFocus</code> على الـ FocusNode هو اللي ينقل الفوكس. وأنهي node تتقفل في dispose.",
    },
    {
      q: "السيرفر رجع «email already used». أنسب مكان تعرضه؟",
      options: [
        "داخل الـ validator قبل الإرسال",
        "في <code>print</code>",
        "متغير <code>String? _serverError</code> في الـ State وتعرضه كـ errorText أو نص تحت الحقل بعد <code>setState</code>",
        "<code>Navigator.pop</code>",
      ],
      answer: 2,
      why: "الـ validator متزامن ومبيعرفش حاجة عن السيرفر. الخطأ بيجي بعد الطلب فبنخزنه في state ونعرضه.",
    },
    {
      q: "إزاي تعطل زرار الإرسال أثناء الطلب؟",
      options: [
        "<code>onPressed: _submitting ? null : _submit</code>",
        "<code>enabled: false</code> على الـ Form",
        "<code>Future.delayed</code>",
        "<code>dispose</code> الزرار",
      ],
      answer: 0,
      why: "<code>onPressed: null</code> بيعطل الزرار. والـ <code>_submitting</code> متغير state بيتغير بـ setState وبيرجع false في finally.",
    },
    {
      q: "جوه <code>dispose</code> لازم تقفل إيه من دول؟",
      options: [
        "<code>GlobalKey&lt;FormState&gt;</code> بس",
        "<code>TextEditingController</code> و<code>FocusNode</code>",
        "الـ validators",
        "الـ <code>InputDecoration</code>",
      ],
      answer: 1,
      why: "الـ controllers والـ focus nodes بتحتفظ بـ listeners وموارد. الـ GlobalKey والـ validators و decoration مفيهمش dispose.",
    },
    {
      q: "اسم الخاصية على <code>Form</code> اللي بتخلي الأخطاء تظهر بعد ما المستخدم يلمس الحقل؟ (اكتب اسم الخاصية)",
      answer: ["autovalidateMode", "autovalidateMode:"],
      why: "<code>autovalidateMode: AutovalidateMode.onUserInteraction</code>. القيمة الافتراضية <code>disabled</code> بتعرض الأخطاء بس عند <code>validate()</code>.",
    },
  ],
};
