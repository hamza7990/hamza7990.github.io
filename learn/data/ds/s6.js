window.LEVELS = window.LEVELS || {};
window.LEVELS["ds/s6"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "الشجرة: بيانات على شكل هرم",
      en: "Why trees",
      body: "<p>لحد دلوقتي كل هيكل شفناه خطي: عنصر ورا عنصر. بس كتير من البيانات الحقيقية <b>هرمية</b>: فولدر جواه فولدرات، عنصر HTML جواه عناصر، widget جواه widgets، تصنيف جواه تصنيفات فرعية. الشجرة (tree) هي الهيكل اللي بيمثل ده.</p><p>وعشان كده بتتسأل في كل إنترفيو: مسائل الأشجار بتختبر الـ recursion وفهم المؤشرات. وفوق كده الـ <b>binary search tree</b> بتدينا بحث وإدراج ومسح في O(log n) مع إن البيانات فضلت مرتبة، وده شيء الـ hash map مبتعملوش.</p><p>هنفهم المصطلحات، الـ traversals الأربعة، الـ BST بعملياته وحالات المسح، ليه ممكن تبقى بطيئة وإيه معنى الـ balancing، والـ <code>SplayTreeMap</code> في Dart، وبعدين المسائل الكلاسيك.</p>",
      points: [
        "الشجرة = nodes متوصلة بـ edges، من غير دايرة، وفيه node واحدة في القمة اسمها root.",
        "أغلب مسائل الأشجار حلها recursion: «حل المشكلة على الـ left والـ right وبعدين اجمع».",
        "الـ BST = شجرة ثنائية مرتبة بقاعدة بتخلي البحث فيها زي binary search على array، لكن الإدراج والمسح فيها رخيصين.",
      ],
    },
    {
      title: "المصطلحات: root و leaf و height و depth",
      en: "Tree vocabulary",
      body: "<p>الرسمة دي هنستخدمها في المستوى كله. كل node ليها <b>parent</b> واحد (ما عدا الـ root) وعدد من الـ <b>children</b>. في الـ <b>binary tree</b> كل node ليها 2 children على الأكتر: left و right.</p>",
      code: {
        lang: "text",
        title: "the tree we use in this level",
        src: `            8            <- root, depth 0
          /   \\
         3     10        <- siblings, depth 1
        / \\      \\
       1   6      14     <- depth 2
          / \\    /
         4   7  13       <- depth 3

leaves (no children): 1, 4, 7, 13
subtree of 6: the node 6 with 4 and 7 under it
height of the tree: 3 edges (8 -> 3 -> 6 -> 4)
depth of 4: 3 edges from the root`,
        note: "الـ height بنعده بعدد الـ edges (3 هنا). في LeetCode وكتير من الإنترفيوهات بيعدوا الـ nodes (يبقى 4)، فاسأل المحاور أو وضح اللي تقصده. في الكود بتاعنا الشجرة الفاضية ارتفاعها 0 والـ node الوحيدة ارتفاعها 1 (بالـ nodes).",
      },
      terms: [
        ["root", "الجذر", "الـ node الوحيدة اللي مالهاش parent. منها بتبدأ أي عملية."],
        ["leaf", "ورقة", "node مالهاش children."],
        ["depth", "العمق", "عدد الـ edges من الـ root لحد الـ node دي."],
        ["height", "الارتفاع", "عدد الـ edges في أطول طريق من الـ node لأبعد leaf تحتها."],
        ["subtree", "شجرة فرعية", "أي node مع كل اللي تحتها. وهي نفسها شجرة، وده سر الـ recursion."],
      ],
      interview: [
        { q: "إيه الفرق بين depth و height في الشجرة؟ وإيه معنى leaf و subtree؟", a: "الـ depth خاصة بالـ node: عدد الـ edges من الـ root ليها (الـ root عمقها 0). الـ height بتقيس لتحت: عدد الـ edges في أطول طريق من الـ node لأبعد leaf، وارتفاع الشجرة هو ارتفاع الـ root. الـ leaf node مالهاش children. الـ subtree هي أي node مع كل نسلها، وكل subtree هي شجرة كاملة بنفسها، عشان كده الحلول بالـ recursion بتشتغل: بحل على الـ left وعلى الـ right وبعدين أجمع." },
      ],
    },
    {
      title: "الـ binary tree في الذاكرة",
      en: "Binary tree nodes and the traversal problem",
      body: "<p>الـ node هنا زي node الـ linked list لكن بمؤشرين بدل واحد: <code>left</code> و<code>right</code>. الشجرة كلها بنمسكها من مؤشر الـ root. زي الـ linked list: العناصر مش متجاورة، ومفيش وصول بالرقم، والوصول لأي node بيبدأ من الـ root.</p>",
      code: {
        lang: "text",
        title: "memory view",
        src: `root
 |
 v
+----+------+-------+
|  8 | left | right |
+----+--+---+---+---+
         |       |
         v       v
   +----+--+--+  +----+--+--+
   |  3 | .  . |  | 10 | -  . |    '-' means null
   +----+--+--+  +----+--+--+
         ...          ...

Dart class:  TreeNode { int val; TreeNode? left, right; }`,
        note: "الـ edges فعليا مؤشرات (references). نفس القاعدة: لو فقدت الـ reference للـ root فقدت الشجرة كلها.",
      },
      points: [
        "<b>الاستخدام:</b> بنعرف الشجرة بإنها node واحدة (الـ root) أو null. الشجرة الفاضية = null.",
        "تكلفة المرور على الشجرة كلها O(n) لأننا بنزور كل node مرة. ومساحة الـ recursion O(h) حيث h الارتفاع.",
        "الارتفاع h بيتراوح بين log n (شجرة متوازنة) و n (شجرة على شكل سلسلة). كل التكاليف الجاية بتتقاس بـ h.",
      ],
    },
    {
      title: "المرور العميق: pre و in و post، وواحد iterative",
      en: "Depth-first traversals",
      body: "<p>التلات أنواع بيمشوا بنفس الطريق (يغوصوا لتحت الأول) ويختلفوا في <b>إمتى</b> نزور الـ node:</p><p><b>pre-order</b>: الـ node ثم left ثم right (تنسخ شجرة، تطبعها كهيكل). <b>in-order</b>: left ثم الـ node ثم right (في BST بيطلع مرتب). <b>post-order</b>: left ثم right ثم الـ node (تمسح أو تحسب من الأولاد للأب، زي حجم فولدر).</p>",
      code: {
        lang: "dart",
        src: `class TreeNode {
  int val;
  TreeNode? left;
  TreeNode? right;
  TreeNode(this.val, [this.left, this.right]);
}

void pre(TreeNode? n, List<int> out) {
  if (n == null) return;
  out.add(n.val);
  pre(n.left, out);
  pre(n.right, out);
}

void inorder(TreeNode? n, List<int> out) {
  if (n == null) return;
  inorder(n.left, out);
  out.add(n.val);
  inorder(n.right, out);
}

void post(TreeNode? n, List<int> out) {
  if (n == null) return;
  post(n.left, out);
  post(n.right, out);
  out.add(n.val);
}

// iterative in-order: an explicit stack instead of the call stack
List<int> inorderIter(TreeNode? root) {
  final out = <int>[];
  final stack = <TreeNode>[];
  var cur = root;
  while (cur != null || stack.isNotEmpty) {
    while (cur != null) {
      stack.add(cur);
      cur = cur.left;
    }
    cur = stack.removeLast();
    out.add(cur.val);
    cur = cur.right;
  }
  return out;
}

void main() {
  final root = TreeNode(
    8,
    TreeNode(3, TreeNode(1), TreeNode(6, TreeNode(4), TreeNode(7))),
    TreeNode(10, null, TreeNode(14, TreeNode(13))),
  );
  final a = <int>[], b = <int>[], c = <int>[];
  pre(root, a);
  inorder(root, b);
  post(root, c);
  print(a);                 // [8, 3, 1, 6, 4, 7, 10, 14, 13]
  print(b);                 // [1, 3, 4, 6, 7, 8, 10, 13, 14]
  print(c);                 // [1, 4, 7, 6, 3, 13, 14, 10, 8]
  print(inorderIter(root)); // [1, 3, 4, 6, 7, 8, 10, 13, 14]
  print(inorderIter(null)); // []
}`,
        note: "الـ in-order طلع مرتب لأن الشجرة دي BST (هنشوف ليه بعد شوية). الـ iterative: ننزل شمال على قد ما نقدر ونحط في الـ stack، نطلع واحدة ونزورها، وبعدين نروح لليمين. ده بيحل مشكلة الـ stack overflow في شجرة عميقة جدا.",
      },
      interview: [
        { q: "اشرح الـ pre-order و in-order و post-order. وإزاي تعمل in-order من غير recursion؟", a: "التلاتة depth-first. pre: الـ node قبل ولادها، in: بين الـ left والـ right، post: بعد الولاد. في الـ BST الـ in-order بيطلع القيم مرتبة. من غير recursion بستخدم stack بإيدي: أنزل على left كل ما أقدر وأحط كل node في الـ stack، وبعدين أطلع واحدة وأزورها وأروح لـ right بتاعها وأكرر. الزمن O(n) والمساحة O(h)." },
      ],
    },
    {
      title: "المرور بالمستويات: level-order بالـ queue",
      en: "Breadth-first (level-order) traversal",
      body: "<p>بدل ما نغوص، بنزور <b>مستوى مستوى</b>: الـ root، وبعدين أولادها، وبعدين أحفادها. الأداة الطبيعية هي <b>queue</b> (اللي في s4): ندخل الـ root، وكل ما نطلع node ندخل أولادها في الآخر. الحيلة لفصل المستويات: قبل ما نبدأ مستوى نسجل <code>q.length</code> الحالي (عدد nodes المستوى ده) ونعالج بالظبط العدد ده.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

class TreeNode {
  int val;
  TreeNode? left;
  TreeNode? right;
  TreeNode(this.val, [this.left, this.right]);
}

List<List<int>> levelOrder(TreeNode? root) {
  final result = <List<int>>[];
  if (root == null) return result;
  final q = Queue<TreeNode>()..add(root);
  while (q.isNotEmpty) {
    final level = <int>[];
    for (var i = q.length; i > 0; i--) {   // only this level's nodes
      final n = q.removeFirst();
      level.add(n.val);
      if (n.left != null) q.add(n.left!);
      if (n.right != null) q.add(n.right!);
    }
    result.add(level);
  }
  return result;
}

void main() {
  final root = TreeNode(
    8,
    TreeNode(3, TreeNode(1), TreeNode(6, TreeNode(4), TreeNode(7))),
    TreeNode(10, null, TreeNode(14, TreeNode(13))),
  );
  print(levelOrder(root));   // [[8], [3, 10], [1, 6, 14], [4, 7, 13]]
  print(levelOrder(null));   // []
  print(levelOrder(TreeNode(5)));  // [[5]]
}`,
        note: "الزمن O(n) والمساحة O(w) حيث w أعرض مستوى (ممكن يوصل n/2). استخدم <code>Queue</code> مش <code>List.removeAt(0)</code> لأنها O(n).",
      },
      pitfall: "كتابة <code>for (var i = 0; i &lt; q.length; i++)</code> بتغلط: <code>q.length</code> بيتغير وإنت بتضيف أولاد. سجل الطول في متغير قبل اللوب، أو استخدم الصيغة اللي فوق.",
    },
    {
      title: "الـ BST: القاعدة والبحث والإدراج",
      en: "Binary search tree: the property, search and insert",
      body: "<p><b>القاعدة:</b> لكل node، كل القيم في الـ subtree الشمال <b>أصغر</b> منها، وكل القيم في الـ subtree اليمين <b>أكبر</b>. (مش الأولاد المباشرين بس: كل النسل.) النتيجة: في كل خطوة بنستبعد نص الشجرة تقريبا، زي binary search.</p><p>البحث: قارن، واذهب شمال أو يمين. الإدراج: ابحث عن القيمة، وهتوصل لمكان فاضي (null)، حط node جديدة هناك. التكرار هنا بنتجاهله (نفس منطق الـ Set).</p>",
      code: {
        lang: "dart",
        src: `class TreeNode {
  int val;
  TreeNode? left;
  TreeNode? right;
  TreeNode(this.val, [this.left, this.right]);
}

bool contains(TreeNode? root, int v) {
  var cur = root;
  while (cur != null) {
    if (v == cur.val) return true;
    cur = v < cur.val ? cur.left : cur.right;
  }
  return false;
}

TreeNode insert(TreeNode? root, int v) {
  if (root == null) return TreeNode(v);
  if (v < root.val) {
    root.left = insert(root.left, v);
  } else if (v > root.val) {
    root.right = insert(root.right, v);
  }
  return root;
}

void inorder(TreeNode? n, List<int> out) {
  if (n == null) return;
  inorder(n.left, out);
  out.add(n.val);
  inorder(n.right, out);
}

void main() {
  TreeNode? root;
  for (final v in [8, 3, 10, 1, 6, 14, 4, 7, 13, 6]) {
    root = insert(root, v);   // the second 6 is ignored
  }
  print(contains(root, 7));    // true
  print(contains(root, 5));    // false
  print(contains(null, 1));    // false
  final out = <int>[];
  inorder(root, out);
  print(out);                  // [1, 3, 4, 6, 7, 8, 10, 13, 14]
}`,
        note: "<code>root = insert(root, v)</code>: الدالة بترجع الـ root عشان الإدراج في شجرة فاضية يشتغل بنفس الكود. كل خطوة بتنزل مستوى، فالتكلفة O(h).",
      },
      focus: [{ label: "احفظها", text: "كل عمليات الـ BST (بحث، إدراج، مسح) تكلفتها <b>O(h)</b>: الارتفاع. لو الشجرة متوازنة h = log n، ولو مش متوازنة ممكن h = n." }],
      interview: [
        { q: "إيه قاعدة الـ BST؟ وتكلفة البحث والإدراج؟", a: "لكل node: كل القيم في الـ subtree الشمال أصغر منها وكل القيم في اليمين أكبر (على كل النسل مش الأولاد المباشرين بس). البحث والإدراج بينزلوا مستوى في كل خطوة فتكلفتهم O(h). في شجرة متوازنة h حوالي log n، لكن في أسوأ حالة (إدراج بيانات مرتبة) الشجرة بتبقى سلسلة و h = n فالتكلفة O(n)." },
      ],
    },
    {
      title: "المسح من الـ BST: التلات حالات",
      en: "BST delete: three cases",
      body: "<p>المسح هو الجزء الصعب. بعد ما نلاقي الـ node نشوف عندها كام child:</p><p><b>1) leaf</b>: نشيلها (نرجع null). <b>2) child واحد</b>: نرفع الـ child مكانها (نرجعه للـ parent). <b>3) اتنين children</b>: منقدرش نشيلها لأن مفيش مكان لتلات حاجات. بنستبدل قيمتها بالـ <b>in-order successor</b> (أصغر قيمة في الـ subtree اليمين، يعني أقرب قيمة أكبر منها) ونمسح الـ successor من اليمين. الـ successor عمرها ما يكون عندها child شمال، فمسحها حالة 1 أو 2.</p>",
      code: {
        lang: "dart",
        src: `class TreeNode {
  int val;
  TreeNode? left;
  TreeNode? right;
  TreeNode(this.val, [this.left, this.right]);
}

TreeNode insert(TreeNode? root, int v) {
  if (root == null) return TreeNode(v);
  if (v < root.val) {
    root.left = insert(root.left, v);
  } else if (v > root.val) {
    root.right = insert(root.right, v);
  }
  return root;
}

TreeNode? deleteNode(TreeNode? root, int key) {
  if (root == null) return null;
  if (key < root.val) {
    root.left = deleteNode(root.left, key);
  } else if (key > root.val) {
    root.right = deleteNode(root.right, key);
  } else {
    if (root.left == null) return root.right;   // cases 1 and 2
    if (root.right == null) return root.left;   // case 2
    var succ = root.right!;                     // case 3
    while (succ.left != null) {
      succ = succ.left!;
    }
    root.val = succ.val;
    root.right = deleteNode(root.right, succ.val);
  }
  return root;
}

List<int> inorder(TreeNode? n) => n == null
    ? []
    : [...inorder(n.left), n.val, ...inorder(n.right)];

void main() {
  TreeNode? root;
  for (final v in [8, 3, 10, 1, 6, 14, 4, 7, 13]) {
    root = insert(root, v);
  }
  root = deleteNode(root, 1);    // leaf
  print(inorder(root));          // [3, 4, 6, 7, 8, 10, 13, 14]
  root = deleteNode(root, 14);   // one child (13)
  print(inorder(root));          // [3, 4, 6, 7, 8, 10, 13]
  root = deleteNode(root, 3);    // two children: successor is 4
  print(inorder(root));          // [4, 6, 7, 8, 10, 13]
  root = deleteNode(root, 8);    // the root itself, successor is 10
  print(root!.val);              // 10
  print(inorder(root));          // [4, 6, 7, 10, 13]
  root = deleteNode(root, 99);   // missing key: nothing changes
  print(inorder(root));          // [4, 6, 7, 10, 13]
}`,
        note: "لاحظ إن الـ in-order بعد كل مسح لسه مرتب: ده دليل إن القاعدة اتحافظ عليها. التماثل مقبول: ممكن نستخدم الـ predecessor (أكبر قيمة في الشمال) بنفس الطريقة.",
      },
      interview: [
        { q: "اشرح مسح node من BST. إيه الحالات؟", a: "بدور على الـ node أولا (O(h)). لو leaf بشيلها. لو عندها child واحد برفع الـ child مكانها. لو عندها اتنين: بلاقي الـ in-order successor (أصغر قيمة في الـ subtree اليمين)، بنقل قيمتها للـ node، وبمسح الـ successor من اليمين، وهي بالضرورة leaf أو بـ child واحد فبترجع لحالة من الأولى. الـ in-order predecessor بيشتغل بنفس الطريقة. التكلفة O(h)." },
      ],
    },
    {
      title: "ليه الـ BST ممكن تبقى بطيئة؟ والـ balancing",
      en: "Degenerate trees and balancing",
      body: "<p>شكل الـ BST بيعتمد على <b>ترتيب الإدراج</b>. لو أدخلت 1، 2، 3، 4، 5 بالترتيب، كل قيمة أكبر من اللي قبلها فتروح يمين على طول. النتيجة شجرة شكلها <b>linked list</b> ارتفاعها n، وكل عملية O(n). البيانات المرتبة (أو شبه المرتبة) شائعة جدا في الواقع، فده مش سيناريو نادر.</p>",
      codes: [
        {
        lang: "dart",
        src: `class TreeNode {
  int val;
  TreeNode? left;
  TreeNode? right;
  TreeNode(this.val, [this.left, this.right]);
}

TreeNode insert(TreeNode? root, int v) {
  if (root == null) return TreeNode(v);
  if (v < root.val) {
    root.left = insert(root.left, v);
  } else if (v > root.val) {
    root.right = insert(root.right, v);
  }
  return root;
}

int height(TreeNode? n) {
  if (n == null) return 0;
  final l = height(n.left);
  final r = height(n.right);
  return 1 + (l > r ? l : r);
}

TreeNode? build(List<int> xs) {
  TreeNode? root;
  for (final x in xs) {
    root = insert(root, x);
  }
  return root;
}

void main() {
  print(height(build([1, 2, 3, 4, 5])));   // 5  (a chain)
  print(height(build([3, 1, 5, 2, 4])));   // 3  (balanced)
  print(height(build([])));                // 0
}`,
        note: "نفس الخمس قيم، ارتفاعين مختلفين. الارتفاع هو اللي بيحدد التكلفة.",
        },
        {
          lang: "text",
          title: "chain vs balanced, and one rotation",
          src: `inserted 1,2,3,4,5:        inserted 3,1,5,2,4:
 1                               3
  \\                             / \\
   2                           1   5
    \\                           \\ /
     3                          2 4
      \\
       4          O(n)          O(log n)
        \\
         5

right rotation at 3 (the left side is too tall):
      3                2
     /                / \\
    2        ->      1   3
   /
  1
the in-order order 1,2,3 is unchanged, only the shape is.`,
          note: "الـ rotation بتغير شكل الشجرة من غير ما تبوظ القاعدة (ترتيب الـ in-order ثابت)، وهي O(1): تغيير كام مؤشر.",
        },
      ],
      points: [
        "<b>Self-balancing trees</b> بتصلح الشكل تلقائيا بعد كل إدراج أو مسح باستخدام rotations، فالارتفاع يفضل O(log n) دايما.",
        "<b>AVL tree</b>: متوازنة بصرامة (فرق الارتفاع بين الشمال واليمين لأي node مش أكتر من 1). بحث أسرع شوية، وإدراج أكتر rotations.",
        "<b>Red-black tree</b>: توازن مرن بتلوين الـ nodes. تكلفة تعديل أقل. هي اللي بتتستخدم في <code>TreeMap</code> في Java و <code>std::map</code> في C++.",
        "في الإنترفيو يكفي تعرف: ليه BST العادية بتتدهور، وإن AVL و red-black بيحلوها بـ rotations، وإن التكلفة بقت O(log n) مضمونة. نادرا هيطلبوا كود الـ rotations كامل.",
      ],
      interview: [
        { q: "إمتى الـ BST بتبقى O(n)؟ وإزاي تتحل؟", a: "لما الإدراج يكون مرتب أو شبه مرتب: كل node بتروح على جنب واحد وبتتحول الشجرة لسلسلة ارتفاعها n، فالبحث والإدراج والمسح كلها O(n). الحل شجرة متوازنة ذاتيا زي AVL أو red-black: بعد كل تعديل بتعمل rotations (تغيير كام مؤشر بدون كسر ترتيب الـ in-order) عشان الارتفاع يفضل O(log n) مضمون." },
      ],
    },
    {
      title: "الأشجار المرتبة في Dart: SplayTreeMap و SplayTreeSet",
      en: "Dart's ordered collections",
      body: "<p>Dart مفيهاش <code>TreeMap</code> بالاسم ده. اللي موجود في <code>dart:collection</code> هو <b>SplayTreeMap</b> و<b>SplayTreeSet</b>: شجرة بحث ثنائية <b>self-adjusting</b> (splay tree) بتعمل rotations بتجيب آخر عنصر اتلمس لفوق. التكلفة <b>O(log n) amortized</b> (يعني متوسط على سلسلة عمليات، وعملية واحدة ممكن تبقى أبطأ). وهي بتخلي المفاتيح <b>مرتبة دايما</b>.</p><p>بتاخد <code>compare</code> اختياري. وبتديك حاجات الـ hash map مش بتديها: أول وآخر مفتاح، وأقرب مفتاح قبل أو بعد قيمة.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:collection';

void main() {
  final scores = SplayTreeMap<String, int>();
  scores['omar'] = 70;
  scores['ali'] = 90;
  scores['sara'] = 85;
  print(scores.keys.toList());            // [ali, omar, sara]
  print(scores.firstKey());               // ali
  print(scores.lastKey());                // sara
  print(scores.firstKeyAfter('ali'));     // omar
  print(scores.lastKeyBefore('sara'));    // omar
  print(scores.firstKeyAfter('sara'));    // null

  final nums = SplayTreeSet<int>.from([5, 1, 9, 3, 5]);
  print(nums);                            // {1, 3, 5, 9}
  print(nums.first);                      // 1
  print(nums.last);                       // 9
  print(nums.contains(3));                // true

  // custom order: by length, then alphabetically
  final byLen = SplayTreeSet<String>((a, b) {
    final c = a.length.compareTo(b.length);
    return c != 0 ? c : a.compareTo(b);
  });
  byLen.addAll(['ccc', 'a', 'bb', 'dd']);
  print(byLen);                           // {a, bb, dd, ccc}
}`,
        note: "السيت (<code>SplayTreeSet</code>) فيها <code>first</code> و<code>last</code> بس، ومفيهاش «أقرب عنصر» (<code>firstAfter</code> موجودة في الـ Map بس). ولو الـ <code>compare</code> رجع 0 لعنصرين فالـ Set بتعتبرهم نفس العنصر وتتجاهل التاني، فخلي الـ comparator يفصل بين أي عنصرين مختلفين. كمان مفاتيح الـ Map لازم تكون Comparable أو تدي compare.",
      },
      points: [
        "<b>استخدمه لما:</b> محتاج المفاتيح مرتبة دايما، أو أقرب قيمة (تقويم مواعيد، أسعار، leaderboard)، أو أصغر وأكبر قيمة بسرعة.",
        "<b>متستخدمهوش لما:</b> مجرد lookup بالمفتاح. الـ <code>Map</code> العادية O(1) ومرتبة بالإضافة.",
      ],
      interview: [
        { q: "إيه الفرق بين Map العادية و SplayTreeMap؟ إمتى تستخدم التانية؟", a: "الـ Map العادية hash table: lookup وإدراج O(1) في المتوسط، وبتحافظ على ترتيب الإضافة. الـ SplayTreeMap شجرة بحث ثنائية بتخلي المفاتيح مرتبة، وكل عملية O(log n) amortized. أستخدمها لما محتاج الترتيب أو عمليات زي أول وآخر مفتاح، أو أقرب مفتاح بعد/قبل قيمة (<code>firstKeyAfter</code> و<code>lastKeyBefore</code>)، اللي الـ hash map مش بتقدر تعملها غير بمسح O(n)." },
      ],
    },
    {
      title: "مسائل كلاسيك (1): أقصى عمق، وعكس الشجرة، وترتيب الـ BST",
      en: "Classic problems: max depth, invert",
      body: "<p>أغلب مسائل الأشجار نفس القالب: <b>حالة الأساس</b> (null) + <b>حل الـ left والـ right</b> + <b>دمج النتيجتين</b>. فكر دايما: «لو الـ recursion حلت الـ subtrees صح، أعمل إيه في الـ node الحالية؟»</p>",
      code: {
        lang: "dart",
        src: `import 'dart:math';

class TreeNode {
  int val;
  TreeNode? left;
  TreeNode? right;
  TreeNode(this.val, [this.left, this.right]);
}

int maxDepth(TreeNode? n) {
  if (n == null) return 0;
  return 1 + max(maxDepth(n.left), maxDepth(n.right));
}

TreeNode? invert(TreeNode? n) {
  if (n == null) return null;
  final left = invert(n.left);
  n.left = invert(n.right);
  n.right = left;
  return n;
}

List<int> pre(TreeNode? n) =>
    n == null ? [] : [n.val, ...pre(n.left), ...pre(n.right)];

void main() {
  final t = TreeNode(4, TreeNode(2, TreeNode(1), TreeNode(3)),
      TreeNode(7, TreeNode(6), TreeNode(9)));
  print(maxDepth(t));         // 3
  print(maxDepth(null));      // 0
  print(pre(t));              // [4, 2, 1, 3, 7, 6, 9]
  print(pre(invert(t)));      // [4, 7, 9, 6, 2, 3, 1]
  print(pre(invert(null)));   // []
}`,
        note: "الاتنين O(n) زمن (كل node مرة) و O(h) مساحة للـ call stack. في الـ invert بعد العكس الـ in-order بيبقى تنازلي. وأقصى عمق هنا بعدد الـ nodes (مش الـ edges).",
      },
      interview: [
        { q: "احسب أقصى عمق لـ binary tree، واعكس الشجرة (invert).", a: "الاتنين recursion بنفس القالب. أقصى عمق: لو null يبقى 0، غير كده <code>1 + max(depth(left), depth(right))</code>. الـ invert: بعكس الـ subtrees الاتنين recursively وبعدين بيبدل بين left و right للـ node الحالية (محتاج متغير مؤقت). الاتنين O(n) زمن لأن كل node بتتزار مرة، و O(h) مساحة للـ call stack." },
      ],
    },
    {
      title: "مسائل كلاسيك (2): validate BST و LCA",
      en: "Classic problems: validate a BST, lowest common ancestor",
      body: "<p><b>Validate BST</b>: الغلط الشائع إنك تقارن كل node بالـ parent بتاعها بس. شجرة زي 5 ← (1، 6 ← (3، 7)) كل node أكبر من left child وأصغر من right child، لكن 3 في يمين 5 وهي أصغر منها، فالشجرة <b>مش BST</b>. الحل: ننزل بنطاق مسموح <code>(lo, hi)</code> ونضيقه: لما ننزل شمال الحد الأعلى بقى قيمة الـ node، ولما ننزل يمين الحد الأدنى بقى قيمتها.</p><p><b>LCA في BST</b>: أقل جد مشترك لقيمتين p و q. لو الاتنين أصغر من الـ node روح شمال، لو الاتنين أكبر روح يمين، غير كده (انفصلوا أو واحد منهم هي الـ node) يبقى دي الإجابة. من غير recursion: O(h) و O(1) مساحة.</p>",
      code: {
        lang: "dart",
        src: `class TreeNode {
  int val;
  TreeNode? left;
  TreeNode? right;
  TreeNode(this.val, [this.left, this.right]);
}

bool isValidBST(TreeNode? n, [int? lo, int? hi]) {
  if (n == null) return true;
  if (lo != null && n.val <= lo) return false;
  if (hi != null && n.val >= hi) return false;
  return isValidBST(n.left, lo, n.val) && isValidBST(n.right, n.val, hi);
}

// wrong: only compares with the direct children
bool naive(TreeNode? n) {
  if (n == null) return true;
  if (n.left != null && n.left!.val >= n.val) return false;
  if (n.right != null && n.right!.val <= n.val) return false;
  return naive(n.left) && naive(n.right);
}

// p and q are assumed to exist in the tree
TreeNode? lca(TreeNode? root, int p, int q) {
  var cur = root;
  while (cur != null) {
    if (p < cur.val && q < cur.val) {
      cur = cur.left;
    } else if (p > cur.val && q > cur.val) {
      cur = cur.right;
    } else {
      return cur;
    }
  }
  return null;
}

void main() {
  final good = TreeNode(8, TreeNode(3, TreeNode(1), TreeNode(6)),
      TreeNode(10, null, TreeNode(14)));
  final bad = TreeNode(5, TreeNode(1),
      TreeNode(6, TreeNode(3), TreeNode(7)));
  print(isValidBST(good));          // true
  print(isValidBST(bad));           // false
  print(naive(bad));                // true  (wrong answer)
  print(isValidBST(null));          // true
  print(isValidBST(TreeNode(2, TreeNode(2))));   // false (duplicate)
  print(lca(good, 1, 6)!.val);      // 3
  print(lca(good, 6, 14)!.val);     // 8
  print(lca(good, 3, 6)!.val);      // 3  (a node is its own ancestor)
}`,
        note: "الـ validate بتزور كل node مرة: O(n) زمن و O(h) مساحة. بديل: in-order traversal والتأكد إن الناتج متزايد بالضبط (من غير تكرار). استخدمنا <code>&lt;=</code> و<code>&gt;=</code> لأن الـ BST بتاعتنا مفيهاش تكرار.",
      },
      pitfall: "مقارنة الـ node بالـ children المباشرين بس. القاعدة على <b>كل</b> النسل. كمان بلاش تبدأ بـ <code>lo = -2147483648</code> كقيمة سحرية: ممكن قيمة في الشجرة تساويها.",
      interview: [
        { q: "إزاي تتأكد إن شجرة هي BST صح؟ وإيه الغلط الشائع؟", a: "بنزل في الـ recursion ومعايا نطاق مسموح (lo, hi): الـ root نطاقها مفتوح، ولما أنزل شمال الحد الأعلى يبقى قيمة الـ node، ولما أنزل يمين الحد الأدنى يبقى قيمتها. أي node برة النطاق يبقى مش BST. الغلط الشائع إني أقارن بالـ parent المباشر بس، فبتعدي شجرة فيها node في يمين جد أصغر منه. بديل: in-order والتأكد إنه متزايد بالضبط. O(n) زمن و O(h) مساحة." },
        { q: "إزاي تلاقي أقل جد مشترك (LCA) لقيمتين في BST؟", a: "بستفيد من الترتيب: من الـ root، لو p و q الاتنين أصغر من قيمة الـ node بروح شمال، لو الاتنين أكبر بروح يمين، وغير كده الـ node الحالية هي الـ LCA (القيمتين انفصلوا عندها، أو واحدة منهم هي نفسها). مفيش حاجة للـ recursion: O(h) زمن و O(1) مساحة. في شجرة عادية (مش BST) محتاج حل بـ recursion على الاتنين subtrees بـ O(n)." },
      ],
    },
    {
      title: "الشجرة في الواقع: Widget tree و DOM",
      en: "Trees in real systems",
      body: "<p>الـ Flutter app كلها شجرة. <code>MaterialApp</code> هي الـ root، جواها <code>Scaffold</code>، جواها <code>AppBar</code> و<code>Column</code>... وكل <code>Column</code> ليها قايمة <code>children</code>. دي شجرة <b>n-ary</b> (عدد الأولاد مش اتنين). والـ <b>DOM</b> في المتصفح نفس الشيء: <code>html</code> ← <code>body</code> ← <code>div</code>... وكلهم بيتعاملوا بنفس الأفكار: المرور depth-first، حساب العمق، والـ recursion.</p>",
      code: {
        lang: "dart",
        src: `import 'dart:math';

class Node {
  final String name;
  final List<Node> children;
  Node(this.name, [this.children = const []]);
}

void printTree(Node n, [int level = 0]) {
  print('  ' * level + n.name);
  for (final c in n.children) {
    printTree(c, level + 1);
  }
}

int depth(Node n) =>
    1 + (n.children.isEmpty ? 0 : n.children.map(depth).reduce(max));

int count(Node n) =>
    1 + n.children.fold(0, (sum, c) => sum + count(c));

void main() {
  final ui = Node('MaterialApp', [
    Node('Scaffold', [
      Node('AppBar', [Node('Text')]),
      Node('Column', [Node('Text'), Node('ElevatedButton')]),
    ]),
  ]);
  printTree(ui);
  print(depth(ui));   // 4
  print(count(ui));   // 7
}`,
        note: "الناتج بيطبع الشجرة بمسافات (pre-order). لما بتعمل <code>setState</code> أو بتحصل rebuild، Flutter بتمشي على الجزء ده من الشجرة. وعشان كده الـ widget اللي بتتبنى جوه بيتحط عميق، وبيتعمله rebuild مع أي أب بيتغير.",
      },
      points: [
        "Flutter فيها تلات أشجار: widget tree (الوصف)، element tree (النسخ الحية)، render tree (الرسم والـ layout). المرور عليهم كلهم depth-first.",
        "نظام الملفات: folder = node و files = leaves. حجم الفولدر = post-order (الأولاد الأول ثم الجمع).",
        "الـ JSON المتداخل شجرة: object/array = node داخلية، قيمة = leaf.",
      ],
      interview: [
        { q: "فين شفت الأشجار في الشغل؟", a: "الـ widget tree في Flutter والـ DOM في المتصفح، وكلاهما شجرة n-ary بتتمشى عليها depth-first. نظام الملفات والـ JSON المتداخل كمان. مثال بالكود: حجم فولدر = مجموع حجم الأولاد + حجمه، وده post-order (بحسب الأولاد الأول)." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: TreeNode وارتفاع الشجرة",
      lang: "dart",
      code: `import 'dart:math';

class TreeNode {
  int val;
  TreeNode? left;
  TreeNode? right;
  TreeNode(this.val, [this.left, this.right]);
}

int height(TreeNode? n) {
  if (n == null) return 0;
  return 1 + max(height(n.left), height(n.right));
}`,
    },
    {
      title: "اكتب: in-order بدون recursion",
      lang: "dart",
      code: `List<int> inorder(TreeNode? root) {
  final out = <int>[];
  final stack = <TreeNode>[];
  var cur = root;
  while (cur != null || stack.isNotEmpty) {
    while (cur != null) {
      stack.add(cur);
      cur = cur.left;
    }
    cur = stack.removeLast();
    out.add(cur.val);
    cur = cur.right;
  }
  return out;
}`,
      note: "محتاج كلاس TreeNode من الدريل اللي فات.",
    },
    {
      title: "اكتب: إدراج وبحث في BST",
      lang: "dart",
      code: `TreeNode insert(TreeNode? root, int v) {
  if (root == null) return TreeNode(v);
  if (v < root.val) {
    root.left = insert(root.left, v);
  } else if (v > root.val) {
    root.right = insert(root.right, v);
  }
  return root;
}

bool contains(TreeNode? root, int v) {
  var cur = root;
  while (cur != null) {
    if (v == cur.val) return true;
    cur = v < cur.val ? cur.left : cur.right;
  }
  return false;
}`,
    },
  ],

  tasks: [
    {
      title: "أقصى عمق",
      lang: "dart",
      prompt: "<p>معاك الكلاس <code>TreeNode</code> (<code>val</code> و<code>left</code> و<code>right</code>). اكتب <code>int maxDepth(TreeNode? root)</code> بترجع عدد الـ nodes على أطول طريق من الـ root لأبعد leaf. الشجرة الفاضية بترجع 0.</p>",
      examples: [
        { in: "[3, [9], [20, [15], [7]]]  (root 3 يسار 9 يمين 20 وتحته 15 و 7)", out: "3" },
        { in: "null", out: "0" },
        { in: "node واحدة", out: "1" },
      ],
      starter: `class TreeNode {
  int val;
  TreeNode? left;
  TreeNode? right;
  TreeNode(this.val, [this.left, this.right]);
}

int maxDepth(TreeNode? root) {
  // your code
}`,
      hints: [
        "حالة الأساس: <code>null</code> عمقها 0.",
        "عمق الـ node = 1 + أكبر عمق بين الـ left والـ right.",
      ],
      solution: `import 'dart:math';

int maxDepth(TreeNode? root) {
  if (root == null) return 0;
  return 1 + max(maxDepth(root.left), maxDepth(root.right));
}`,
      explain: "O(n) زمن لأن كل node بتتزار مرة، و O(h) مساحة للـ call stack. بديل iterative: level-order بالـ queue وعد المستويات.",
    },
    {
      title: "هل هي BST صح؟",
      lang: "dart",
      prompt: "<p>اكتب <code>bool isValidBST(TreeNode? root)</code> بترجع <code>true</code> لو الشجرة BST صحيحة: لكل node كل القيم في شمالها <b>أصغر</b> وكل القيم في يمينها <b>أكبر</b> (بدون تكرار). الشجرة الفاضية صحيحة. انتبه: مقارنة الـ parent المباشر مش كفاية.</p>",
      examples: [
        { in: "root 2، شمال 1، يمين 3", out: "true" },
        { in: "root 5، شمال 1، يمين 6 وتحته 3 و 7", out: "false" },
        { in: "root 2، شمال 2", out: "false" },
      ],
      starter: `bool isValidBST(TreeNode? root) {
  // your code
}`,
      hints: [
        "اعمل دالة مساعدة بتاخد الـ node ونطاق مسموح <code>lo</code> و<code>hi</code> (nullable).",
        "لما تنزل شمال حدّث <code>hi</code> بقيمة الـ node، ولما تنزل يمين حدّث <code>lo</code>. الـ node برة النطاق يعني false.",
      ],
      solution: `bool isValidBST(TreeNode? root) => _valid(root, null, null);

bool _valid(TreeNode? n, int? lo, int? hi) {
  if (n == null) return true;
  if (lo != null && n.val <= lo) return false;
  if (hi != null && n.val >= hi) return false;
  return _valid(n.left, lo, n.val) && _valid(n.right, n.val, hi);
}`,
      explain: "O(n) زمن و O(h) مساحة. الحدود nullable بدل قيمة سحرية عشان أي قيمة int ممكنة تكون في الشجرة. استخدمنا المقارنة الصارمة (<code>&lt;=</code> يرفض) فالتكرار مرفوض.",
    },
    {
      title: "أقل جد مشترك في BST",
      lang: "dart",
      prompt: "<p>اكتب <code>TreeNode? lowestCommonAncestor(TreeNode? root, int p, int q)</code> بترجع أقل node هي جد (أو نفسها) للقيمتين p و q في BST. القيمتين موجودتين في الشجرة. حل من غير recursion لو تقدر: O(h).</p>",
      examples: [
        { in: "BST (8: 3(1, 6), 10(-, 14)), p = 1, q = 6", out: "node 3" },
        { in: "نفس الشجرة، p = 6, q = 14", out: "node 8" },
        { in: "نفس الشجرة، p = 3, q = 6", out: "node 3" },
      ],
      starter: `TreeNode? lowestCommonAncestor(TreeNode? root, int p, int q) {
  // your code
}`,
      hints: [
        "لو p و q الاتنين أصغر من قيمة الـ node الحالية، الإجابة في الشمال.",
        "لو الاتنين أكبر روح يمين. غير كده الـ node الحالية هي الإجابة.",
      ],
      solution: `TreeNode? lowestCommonAncestor(TreeNode? root, int p, int q) {
  var cur = root;
  while (cur != null) {
    if (p < cur.val && q < cur.val) {
      cur = cur.left;
    } else if (p > cur.val && q > cur.val) {
      cur = cur.right;
    } else {
      return cur;
    }
  }
  return null;
}`,
      explain: "O(h) زمن و O(1) مساحة. أول node بتفصل بين p و q (أو تساوي واحد منهم) هي الـ LCA لأن مفيش node أعمق منها تشمل الاتنين. لو الشجرة متدهورة h = n.",
    },
  ],

  quiz: [
    {
      q: "في الشجرة اللي استخدمناها (الـ root 8 والأعمق 4 تحت 6)، ارتفاعها بعدد الـ edges كام؟",
      answer: ["3", "٣"],
      why: "أطول طريق: 8 ← 3 ← 6 ← 4 وده 3 edges (4 nodes). الـ depth بتاعة الـ root صفر.",
    },
    {
      q: "أي traversal بيرجع القيم <b>مرتبة تصاعديا</b> لما نطبقه على BST؟",
      options: ["pre-order", "post-order", "in-order", "level-order"],
      answer: 2,
      why: "الـ in-order بيزور الشمال (الأصغر) ثم الـ node ثم اليمين (الأكبر) على كل node، فالناتج مرتب. الـ pre-order بيزور الـ node قبل ولادها فمش مرتب.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final t = TreeNode(2, TreeNode(1), TreeNode(3));
final out = <int>[];
post(t, out);
print(out);` },
      answer: ["[1, 3, 2]", "[1,3,2]"],
      why: "الـ post-order بيزور الشمال (1) ثم اليمين (3) ثم الـ node (2). الـ in-order هيدي [1, 2, 3] والـ pre-order [2, 1, 3].",
    },
    {
      q: "BST فيها n node. تكلفة البحث في <b>أسوأ</b> حالة؟",
      options: ["O(log n) دايما", "O(n) لو الشجرة متدهورة لسلسلة", "O(1)", "O(n log n)"],
      answer: 1,
      why: "التكلفة O(h). لو أدخلت بيانات مرتبة الارتفاع بيبقى n والبحث بيمشي على كل الـ nodes. الـ O(log n) مضمونة بس في الأشجار المتوازنة ذاتيا (AVL و red-black).",
    },
    {
      q: "بتمسح node عندها child شمال وchild يمين من BST. إيه الصح؟",
      options: [
        "تشيلها وتوصل الـ parent بالـ child الشمال بس",
        "تمسح الـ subtree كله",
        "تعيد بناء الشجرة من الأول",
        "تحط مكان قيمتها الـ in-order successor (أصغر قيمة في اليمين) وتمسح الـ successor",
      ],
      answer: 3,
      why: "الـ successor أقرب قيمة أكبر منها، فالقاعدة بتفضل صحيحة. الـ successor مالهاش child شمال فمسحها سهل. خيار «توصل الـ parent بالشمال» بيضيع الـ subtree اليمين.",
    },
    {
      q: "الدالة دي بتقول إن الشجرة BST. المشكلة فين؟",
      code: { lang: "dart", src: `bool check(TreeNode? n) {
  if (n == null) return true;
  if (n.left != null && n.left!.val >= n.val) return false;
  if (n.right != null && n.right!.val <= n.val) return false;
  return check(n.left) && check(n.right);
}` },
      options: [
        "بتقارن الـ node بأولادها المباشرين بس، فمش بتكشف node في يمين جد وهي أصغر منه",
        "الـ recursion غلط ولازم iterative",
        "المفروض تستخدم &lt;= مكان &gt;=",
        "مفيش مشكلة، الكود صح",
      ],
      answer: 0,
      why: "القاعدة بتشمل كل النسل. شجرة 5 ← (1، 6 ← (3، 7)) بتعدي في الكود ده وهي مش BST لأن 3 في يمين 5. الحل: نطاق (lo, hi) يتنقل مع النزول.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "dart", src: `final m = SplayTreeMap<int, String>();
m[30] = 'c';
m[10] = 'a';
m[20] = 'b';
print(m.firstKeyAfter(10));` },
      answer: ["20"],
      why: "المفاتيح مرتبة (10، 20، 30)، وأقرب مفتاح أكبر من 10 هو 20. لو مفيش مفتاح أكبر بترجع null.",
    },
    {
      q: "أدخلنا 1، 2، 3، 4، 5 بالترتيب في BST عادية. ارتفاعها بعدد الـ nodes (شجرة node واحدة = 1)؟",
      answer: ["5", "٥"],
      why: "كل قيمة أكبر من اللي قبلها فبتروح يمين: سلسلة من 5 nodes. ده السبب في AVL و red-black.",
    },
    {
      q: "ليه الـ in-order الـ iterative بيحتاج stack؟",
      options: [
        "عشان يتجنب الـ sort",
        "عشان بيعمل نفس شغل الـ call stack في الـ recursion: يفتكر الـ nodes اللي لسه لازم نرجع لها بعد الشمال",
        "عشان الشجرة مفيهاش مؤشرات للـ parent بس هي مش مهمة",
        "عشان الـ queue أبطأ",
      ],
      answer: 1,
      why: "بعد ما ننزل شمال لازم نرجع للـ node ونزورها ونروح لليمين. الـ stack بتحفظ الطريق ده. الخيار التالت صح جزئيا (مفيش parent pointer) لكن مش ده السبب المباشر.",
    },
    {
      q: "الشجرة فيها مليون node على شكل سلسلة وبتعمل عليها DFS recursive. إيه الخطر؟",
      options: [
        "stack overflow لأن عمق الـ recursion = الارتفاع = مليون",
        "هتبقى O(log n) بس",
        "هتطلع النتيجة غلط",
        "مفيش خطر، الـ Dart بتحسن الـ recursion لـ loop",
      ],
      answer: 0,
      why: "عمق الـ call stack هو ارتفاع الشجرة، والـ Dart مبتحولش الـ recursion لـ loop. الحل: iterative بـ stack بإيدك، أو شجرة متوازنة.",
    },
  ],
};
