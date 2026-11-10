window.LEVELS = window.LEVELS || {};
window.LEVELS["core/c1"] = {
  slides: [
    {
      kicker: "ليه المستوى ده: أي إنترفيو بيسأل Git",
      title: "Git بيخزن snapshots مش فروقات",
      en: "Commits, snapshots and hashes",
      body: "<p>كل <b>commit</b> هو صورة كاملة لحالة المشروع في لحظة معينة، ومعاه: اسم اللي عمله، الوقت، الرسالة، ومؤشر للـ commit اللي قبله (الـ parent). كل commit له رقم هوية (hash) بيتحسب من محتواه، زي <code>b404795</code>. لو أي حاجة اتغيرت في commit، الـ hash بيتغير، وده بيخلي التاريخ مضمون ومينفعش يتعدل بصمت.</p><p>الـ commits مرتبطة ببعض بسلسلة: كل واحد بيشاور على اللي قبله. ده كله جوه فولدر <code>.git</code> في مشروعك. لو مسحته، فقدت التاريخ كله ولسه عندك الملفات.</p>",
      terms: [
        ["commit", "نقطة حفظ", "snapshot للمشروع + رسالة + مؤشر للـ parent."],
        ["hash", "رقم هوية الـ commit", "بيتحسب من المحتوى، فأي تعديل بيغيره."],
        ["repository", "المستودع", "فولدر <code>.git</code> اللي فيه التاريخ كله."],
      ],
      focus: [{ label: "احفظها", text: "الـ commit ثابت مبيتعدلش. لما «تعدّل» commit (amend أو rebase) Git بيعمل commit جديد بـ hash جديد ويسيب القديم." }],
      interview: [
        { q: "إيه اللي Git بيخزنه فعلا؟ فروقات ولا نسخ كاملة؟", a: "من وجهة نظر النموذج الذهني، كل commit هو snapshot كامل للمشروع، مش diff. (Git بيضغط وبيشارك الملفات اللي متغيرتش تحت الغطاء فمش بياخد مساحة زيادة، لكن ده تفصيل تخزين.) كل commit بيشاور على الـ parent بتاعه، والـ hash بيتحسب من المحتوى، فالتاريخ مترابط ومضمون." },
      ],
    },
    {
      title: "التلات مناطق: working tree و staging و repository",
      en: "Working tree, index (staging), repository",
      body: "<p>ده أهم رسم في Git. ملفاتك بتمر على تلات مناطق:</p>",
      points: [
        "<b>Working tree</b>: الملفات اللي قدامك على الديسك وبتعدل فيها.",
        "<b>Staging area</b> (اسمها كمان index): «العربية» اللي بتحط فيها بالظبط اللي هيدخل الـ commit الجاي. بتحط فيها بـ <code>git add</code>.",
        "<b>Repository</b>: التاريخ المحفوظ. <code>git commit</code> بياخد اللي في الـ staging ويحوله لـ commit.",
      ],
      code: {
        lang: "bash",
        title: "الرحلة كاملة",
        src: `echo "hello" >> a.txt     # working tree changed
git status                # a.txt: modified, not staged
git add a.txt             # now in staging
git status                # a.txt: changes to be committed
git commit -m "Update a"  # now in the repository
git status                # nothing to commit, working tree clean`,
        note: "لو عدّلت <code>a.txt</code> تاني بعد <code>git add</code> وقبل <code>git commit</code>، الـ commit بياخد النسخة اللي اتعملها add بس. التعديل الجديد يفضل في الـ working tree ويظهر في <code>git status</code> كـ modified تاني.",
      },
      pitfall: "تفتكر إن <code>git add</code> بتحفظ الملف. هي بتحطه في الـ staging بس. من غير <code>git commit</code> مفيش حاجة اتحفظت في التاريخ.",
      interview: [
        { q: "ليه فيه staging area أصلا؟ مش أسهل commit مباشرة؟", a: "عشان أتحكم في شكل الـ commit. ممكن أكون عدلت 5 ملفات في حاجتين مختلفتين، فأعمل <code>git add</code> لملفات الحاجة الأولى وأعمل commit، وبعدين التانية في commit تاني. كل commit بيبقى وحدة منطقية واحدة، وده بيخلي المراجعة والتراجع أسهل. وبـ <code>git add -p</code> أقدر أختار حتى أجزاء من ملف واحد." },
      ],
    },
    {
      title: "الشغل اليومي: status و add و commit و log و diff",
      en: "The daily commands",
      body: "<p>خمس أوامر هتكتبها كل يوم. والعادة الأهم: <code>git status</code> قبل وبعد أي حاجة.</p>",
      code: {
        lang: "bash",
        src: `git status -s             # short view: ' M a.txt', '?? new.txt'
git diff                  # working tree vs staging (not yet added)
git diff --staged         # staging vs last commit (what will be committed)
git add a.txt             # stage one file (git add . stages everything)
git commit -m "Fix price filter"
git log --oneline         # one line per commit, newest first
git log --oneline --graph # draw the branches`,
        note: "الـ <code>git diff</code> من غير فلاجات مبتورش اللي اتعمله add. عشان تشوف اللي هيدخل الـ commit استخدم <code>--staged</code>.",
      },
      terms: [
        ["HEAD", "المكان الحالي", "مؤشر على الـ commit (أو الـ branch) اللي إنت واقف عليه دلوقتي."],
        ["untracked", "ملف جديد", "Git شايفه بس مش متابعه لسه، بيظهر <code>??</code> في <code>status -s</code>."],
      ],
      pitfall: "<code>git add .</code> بتضيف كل حاجة، بما فيها ملفات مش عايزها (<code>.env</code>، ملفات مؤقتة). اقرا <code>git status</code> قبل الـ commit، أو استخدم <code>git add -p</code> أو سمّي الملفات.",
    },
    {
      title: "الـ branch مؤشر بس، و HEAD هو «إنت هنا»",
      en: "Branches and HEAD",
      body: "<p>الـ <b>branch</b> مش نسخة من المشروع. هو <b>ملف صغير فيه hash لآخر commit</b>، يعني اسم بيشاور على commit. عشان كده إنشاؤه لحظي ورخيص. لما تعمل commit على branch، المؤشر بيتحرك للـ commit الجديد.</p><p>و<b>HEAD</b> بيشاور على الـ branch اللي إنت عليه، يعني بيقول «أنا هنا». لما تعمل <code>switch</code> بتحرك HEAD وبتتغير ملفاتك لتطابق الـ branch التاني.</p>",
      code: {
        lang: "bash",
        src: `git branch                      # list local branches, * = current
git switch -c feature/filters   # create AND switch to it
git switch main                 # go back
git branch -d feature/filters   # delete (only if already merged)
git log --oneline --graph --all # see every branch`,
        note: "<code>git checkout</code> كانت بتعمل الحاجتين (تبديل branch واسترجاع ملفات). من Git 2.23 اتقسمت لـ <code>switch</code> و<code>restore</code> عشان أوضح. القديم لسه شغال.",
      },
      focus: [{ label: "احفظها", text: "branch = اسم يشاور على commit. HEAD = أنا واقف على أنهي branch. ومفيش حاجة اتنسخت." }],
      interview: [
        { q: "يعني إيه branch في Git، وليه رخيص؟", a: "الـ branch مؤشر (اسم) على commit معين، مش نسخة من الملفات. عشان كده إنشاؤه بيكتب ملف صغير فيه hash، ومبياخدش وقت ولا مساحة. لما أعمل commit على الـ branch المؤشر بيتحرك للـ commit الجديد. والـ HEAD مؤشر بيقول أنا واقف على أنهي branch دلوقتي." },
      ],
    },
    {
      title: "Merge: دمج branch في التاني",
      en: "Fast-forward vs merge commit",
      body: "<p>لما تخلص شغلك على <code>feature</code> وعايز تدخله في <code>main</code>، بتقف على <code>main</code> وتعمل <code>git merge feature</code>. فيه حالتين:</p><ul><li><b>Fast-forward</b>: لو <code>main</code> ما اتحركش من وقت ما أخدت منه الـ branch، Git بس بيحرك مؤشر <code>main</code> لقدام. مفيش commit جديد.</li><li><b>Merge commit</b>: لو الاتنين اتحركوا، Git بيعمل commit جديد له <b>أبّين</b> (parents اتنين) بيجمع الشغلين.</li></ul>",
      code: {
        lang: "bash",
        src: `git switch main
git merge feature
# Updating b404795..941c1bd
# Fast-forward

# when both moved:
# Merge made by the 'ort' strategy.
git log --oneline --graph`,
        note: "الرسم بيبان فيه خطين بيتقابلوا عند الـ merge commit. لو عايز تعمل merge commit حتى لو fast-forward ممكن: <code>git merge --no-ff feature</code>.",
      },
      pitfall: "تعمل <code>git merge main</code> وإنت واقف على <code>main</code> هو الغلط. الـ merge دايما بيدخل الـ branch المذكور في الـ branch اللي إنت عليه دلوقتي. اقرا <code>git status</code> الأول تعرف إنت فين.",
    },
    {
      title: "Rebase: أعيد بناء شغلي فوق آخر main",
      en: "Rebase and the golden rule",
      body: "<p>الـ <b>rebase</b> بياخد commits الـ branch بتاعك ويعيد تطبيقها واحد واحد فوق آخر commit في <code>main</code>. النتيجة تاريخ خطي من غير merge commit. لكن الـ commits دي <b>جديدة</b> (hashes مختلفة)، لأن الـ parent اتغير.</p>",
      code: {
        lang: "bash",
        src: `git switch feature
git rebase main
# Successfully rebased and updated refs/heads/feature.
git switch main
git merge feature        # now a clean fast-forward`,
        note: "لو حصل conflict في وسط الـ rebase: حله، وبعدين <code>git add</code> و<code>git rebase --continue</code>. وللتراجع: <code>git rebase --abort</code>.",
      },
      pitfall: "<b>القاعدة الذهبية: متعملش rebase لـ commits اتبعتت (pushed) واتشاركت مع ناس.</b> الـ rebase بيغير الـ hashes، فزمايلك اللي سحبوا النسخة القديمة هيتلخبط تاريخهم. rebase على branch بتاعك لوحدك قبل الـ PR تمام، لكن على <code>main</code> أو branch مشتركة لأ.",
      interview: [
        { q: "إيه الفرق بين merge و rebase، وإمتى تستخدم كل واحد؟", a: "الاتنين بيدمجوا شغل branch في التاني. <code>merge</code> بيحافظ على التاريخ زي ما حصل وبيعمل merge commit، وآمن على أي branch. <code>rebase</code> بيعيد تطبيق commits بتاعتي فوق آخر main فالتاريخ بيبقى خطي ونظيف، لكنه بيكتب commits جديدة (hashes جديدة). فبستخدم rebase على branch بتاعي لوحدي قبل الـ PR أحدثها بآخر main، ومبعملوش أبدا على commits اتشاركت مع الناس." },
      ],
    },
    {
      title: "حل الـ merge conflict خطوة بخطوة",
      en: "Resolving a conflict",
      body: "<p>الـ conflict بيحصل لما فرعين غيّروا <b>نفس السطر</b> بطريقتين مختلفتين، وGit مش عارف يختار. مش خطأ ولا حاجة تخوف، هو بس بيطلب منك القرار.</p>",
      code: {
        lang: "bash",
        title: "الخطوات",
        src: `git merge feature
# CONFLICT (content): Merge conflict in a.txt
# Automatic merge failed; fix conflicts and then commit the result.
git status -s             # 'UU a.txt' = both modified, unresolved
# open a.txt, choose the final text, delete the marker lines
git add a.txt             # tell Git it is resolved
git commit                # finish the merge (message is pre-filled)`,
        note: "لو غيرت رأيك قبل ما تخلص: <code>git merge --abort</code> بيرجع كل حاجة زي ما كانت قبل الـ merge.",
      },
      codes: [
        {
          lang: "text",
          title: "شكل الملف أثناء الـ conflict",
          src: `v1
<<<<<<< HEAD
from main
=======
from feature
>>>>>>> feature`,
          note: "فوق <code>=======</code> نسخة الـ branch اللي إنت عليه (HEAD)، وتحتها نسخة الـ branch الجاي. إنت بتكتب النص النهائي (ممكن واحد منهم أو خليط) وتمسح السطور الثلاثة اللي فيها <code>&lt;&lt;&lt;</code> و<code>===</code> و<code>&gt;&gt;&gt;</code>.",
        },
      ],
      pitfall: "تعمل commit والـ markers لسه في الملف. دوّر على <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> قبل <code>git add</code>، وشغّل التطبيق أو الـ tests بعد الحل. الـ conflict بيتحل نصيا، لكن النتيجة ممكن تبقى غلط منطقيا.",
      interview: [
        { q: "حصل merge conflict. تعمل إيه؟", a: "أقرا <code>git status</code> أعرف الملفات المتعارضة (<code>UU</code>). أفتح كل ملف وأدور على علامات <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>، وأفهم الشغلين وأكتب النص النهائي الصح وأمسح العلامات. بعدين <code>git add</code> للملف عشان أقول إنه اتحل، و<code>git commit</code> أكمل الـ merge. وبشغّل الـ tests قبل ما أدفع. لو الموضوع كبير وماعرفش أحله بأمان، <code>git merge --abort</code> وأسأل صاحب الكود التاني." },
      ],
    },
    {
      title: "الشغل مع remote: clone و fetch و pull و push",
      en: "Remotes and tracking branches",
      body: "<p>الـ <b>remote</b> نسخة تانية من الـ repository على سيرفر (GitHub مثلا)، اسمها الافتراضي <code>origin</code>. <code>git clone</code> بتنزل نسخة كاملة وبتظبط <code>origin</code> لوحدها. الفرع المحلي <code>main</code> بيبقى «بيتتبع» <code>origin/main</code> (tracking branch)، واللي بيقولك «أنت قدام بـ 2 commits» أو «ورا بـ 1».</p>",
      code: {
        lang: "bash",
        src: `git clone https://github.com/team/greb.git
git fetch                 # download new commits, change nothing locally
git status -sb            # '## main...origin/main [behind 1]'
git log --oneline origin/main
git pull                  # fetch + merge (or rebase if configured)
git push                  # upload my commits to the tracked branch
git push -u origin feature/filters   # first push: also sets tracking`,
        note: "الـ <code>-u</code> بتتعمل مرة واحدة لكل branch جديدة، وبعدها <code>git push</code> و<code>git pull</code> لوحدهم يعرفوا يروحوا فين.",
      },
      pitfall: "<code>git pull</code> = <code>fetch</code> + <code>merge</code>، فبتغير شغلك على طول. لو عايز تشوف الأول إيه الجديد من غير ما يتأثر شغلك، اعمل <code>fetch</code> وبعدين <code>git log origin/main</code> أو <code>git diff main origin/main</code>.",
      interview: [
        { q: "إيه الفرق بين <code>git fetch</code> و <code>git pull</code>؟", a: "<code>fetch</code> بينزل الـ commits الجديدة من الـ remote ويحدّث <code>origin/main</code> بس، من غير ما يلمس الـ branch المحلي أو ملفاتك. <code>pull</code> بيعمل fetch وبعدها merge (أو rebase لو متظبط كده) للجديد في الـ branch الحالي. فـ pull بيغير شغلك، و fetch آمن دايما." },
      ],
    },
    {
      title: "التراجع بأمان: restore و reset و revert و amend",
      en: "Undoing things",
      body: "<p>السؤال الأول دايما: <b>الشغل ده اتبعت للسيرفر ولا لسه عندي بس؟</b> لو لسه محلي، تقدر تعدل التاريخ. لو اتبعت وغيرك ممكن يكون سحبه، متعدلش التاريخ، اعمل commit جديد يعكسه.</p>",
      code: {
        lang: "bash",
        src: `git restore a.txt             # discard edits in working tree (lost!)
git restore --staged a.txt    # unstage, keep the edits
git commit --amend -m "Fix typo in message"   # rewrite LAST commit
git reset --soft HEAD~1       # undo commit, keep changes STAGED
git reset HEAD~1              # --mixed (default): keep changes, unstaged
git reset --hard HEAD~1       # undo commit AND throw the changes away
git revert HEAD               # new commit that cancels the last one`,
        note: "جربناها في repo تجريبي: بعد <code>reset --soft</code> الملف بيظهر <code>A</code> (staged). بعد <code>--mixed</code> بيظهر <code>??</code> (untracked) لو الملف جديد. بعد <code>--hard</code> الملف اختفى. و<code>revert</code> أضافت commit باسم <code>Revert \"...\"</code> والتاريخ القديم فضل زي ما هو.",
      },
      terms: [
        ["reset --soft", "رجّع الـ commit بس", "الـ HEAD يرجع، والتعديلات تفضل في staging."],
        ["reset --mixed", "رجّع commit وstaging", "الـ HEAD يرجع، والتعديلات تفضل في الملفات بس. ده الافتراضي."],
        ["reset --hard", "رجّع كل حاجة", "بيمسح التعديلات من الملفات كمان. خطير."],
        ["revert", "عكس commit", "بيعمل commit جديد بيلغي تأثير القديم، من غير ما يمس التاريخ."],
      ],
      pitfall: "<code>reset --hard</code> و<code>restore</code> على ملفات متعدلة بيمسحوا شغلك من غير رجعة (Git مفيهوش سلة مهملات للتعديلات اللي ما اتعملهاش commit). و<code>reset</code> و<code>amend</code> على commits اتبعتت معناها تحتاج force push وتبوظ على زمايلك. على branch مشتركة استخدم <code>revert</code> بس.",
      interview: [
        { q: "عملت commit غلط. تعمل إيه؟", a: "أشوف الأول هل اتعمله push. لو لسه محلي: لو غلط في الرسالة أو نسيت ملف، <code>git commit --amend</code>. لو عايز ألغيه وأعدل الشغل، <code>git reset --soft HEAD~1</code> (يرجع الـ commit والتعديلات تفضل staged)، أو <code>--hard</code> لو عايز أرميه كله. لو اتبعت لـ branch مشتركة، مبعدلش التاريخ: <code>git revert &lt;hash&gt;</code> بيعمل commit جديد بيعكسه، وده آمن لأن مفيش حد تاريخه هيتلخبط." },
      ],
    },
    {
      title: "stash و .gitignore و cherry-pick",
      en: "Stash, ignore files, cherry-pick",
      body: "<p>تلات أدوات صغيرة بتظهر كتير في الشغل الحقيقي:</p>",
      points: [
        "<b>stash</b>: بتحط تعديلاتك الحالية على جنب مؤقتا لما تحتاج تبدل branch بسرعة وإنت لسه مش جاهز تعمل commit.",
        "<b>.gitignore</b>: ملف فيه أنماط لملفات Git يتجاهلها (<code>build/</code>, <code>*.log</code>, <code>.env</code>). مهم: لو الملف اتتابع قبل كده، الإضافة في .gitignore مش كفاية، لازم <code>git rm --cached</code>.",
        "<b>cherry-pick</b>: بتاخد commit واحد من branch تانية وتعيد تطبيقه على الـ branch الحالي (commit جديد بـ hash مختلف). مفيدة لإصلاح عاجل.",
      ],
      code: {
        lang: "bash",
        src: `git stash                 # save edits, working tree becomes clean
git stash list            # stash@{0}: WIP on main: 7e8a0c1 ...
git stash pop             # bring the edits back and drop the stash

printf 'build/\\n*.log\\n.env\\n' > .gitignore

git switch main
git cherry-pick 3a9f2c1   # apply that one commit here`,
        note: "الـ <code>stash</code> مش بيحفظ الملفات الجديدة (untracked) إلا لو كتبت <code>git stash -u</code>.",
      },
      pitfall: "رفعت ملف <code>.env</code> فيه أسرار على GitHub. إضافته لـ .gitignore بعد كده مش بتشيله من التاريخ. لازم تعتبر الأسرار اتسربت وتغيّرها فورا.",
    },
    {
      title: "الـ pull request ورسالة commit نضيفة",
      en: "PR flow and commit messages",
      body: "<p>في الشغل مفيش حد بيدفع على <code>main</code> مباشرة. الدورة المعتادة:</p><ol><li>تسحب آخر <code>main</code> وتعمل branch من اسم واضح: <code>feature/office-filter</code>.</li><li>تشتغل وتعمل commits صغيرة.</li><li>تدفع الـ branch وتفتح <b>Pull Request</b> (PR).</li><li>زميلك يعمل code review ويعلّق. إنت تعدّل وتدفع commits جديدة على نفس الـ branch.</li><li>بعد الموافقة والـ CI أخضر، بيتدمج (merge أو squash).</li><li>تحذف الـ branch وتسحب <code>main</code> المحدّث.</li></ol>",
      code: {
        lang: "text",
        title: "رسالة commit كويسة",
        src: `Add office filter to the listings search

The search screen could only filter by city. Offices now appear
as a second filter, sent to the API as office_id.
Closes #42`,
        note: "السطر الأول: أمر قصير (حوالي 50 حرف) بصيغة الفعل «Add / Fix / Remove»، بيقول إيه اللي اتعمل. فراغ. وبعدين الشرح: ليه، مش إيه. «fix stuff» و«update» رسائل بتبوظ التاريخ.",
      },
      focus: [{ label: "احفظها", text: "PR صغير (شغل واحد) بيتراجع أسرع وبيتدمج أسرع من PR ضخم. وعنوان الـ commit بيجاوب على سؤال «ماذا يفعل ده؟»." }],
      interview: [
        { q: "إيه الـ code review وإيه اللي بتدور عليه؟", a: "زميل بيقرا تعديلاتي في الـ PR قبل الدمج. بدور على: هل الكود بيحل المطلوب فعلا؟ في bugs أو حالات حدية (null، قايمة فاضية)؟ هل مقروء ومتسق مع باقي المشروع؟ فيه tests؟ في أسرار أو ثغرات أمنية؟ وكصاحب الـ PR برد على كل تعليق، وببقيه صغير وبوصف واضح، ومبخدش التعليقات على إنها هجوم شخصي." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: الدورة الأساسية",
      lang: "bash",
      code: `git status -s
git add src/search.dart
git diff --staged
git commit -m "Add office filter"
git log --oneline
git push`,
      note: "كل سطر هنا بتكتبه كل يوم. لاحظ <code>diff --staged</code> قبل الـ commit.",
    },
    {
      title: "اكتب: branch جديدة وتحديثها",
      lang: "bash",
      code: `git switch main
git pull
git switch -c feature/office-filter
git add .
git commit -m "Add office filter"
git fetch origin
git rebase origin/main
git push -u origin feature/office-filter`,
    },
    {
      title: "اكتب: تراجع وحفظ مؤقت",
      lang: "bash",
      code: `git stash
git switch hotfix/login
git cherry-pick 3a9f2c1
git push
git switch feature/office-filter
git stash pop
git restore --staged notes.txt
git reset --soft HEAD~1
git revert HEAD`,
    },
  ],

  tasks: [
    {
      title: "فرع جديد وPR",
      lang: "bash",
      prompt: "<p>إنت على <code>main</code> ومحدّث. اكتب سلسلة الأوامر لتعمل branch اسمها <code>fix/price-format</code>، تضيف ملف <code>lib/price.dart</code> وتعمله commit برسالة <code>Fix price format</code>، وتدفعها لأول مرة للـ remote <code>origin</code> بحيث <code>git push</code> الجاية تشتغل من غير أسماء.</p>",
      hints: [
        "فيه أمر واحد بيعمل branch وينقلك عليها.",
        "الدفع الأول محتاج فلاج بيربط الـ branch المحلية بالبعيدة.",
      ],
      solution: `git switch -c fix/price-format
git add lib/price.dart
git commit -m "Fix price format"
git push -u origin fix/price-format`,
      explain: "<code>switch -c</code> بتعمل وتنقل. <code>-u</code> (--set-upstream) بتربط الـ branch بنظيرتها على origin، فبعدها <code>git push</code> و<code>git pull</code> مش محتاجين أسماء. بعد كده بتفتح الـ PR من GitHub.",
    },
    {
      title: "عملت commit على main بالغلط",
      lang: "bash",
      prompt: "<p>عملت commit واحد على <code>main</code> المحلي بالغلط، ولسه ما اتدفعش. المفروض يكون على branch اسمها <code>feature/search</code>، و<code>main</code> يرجع زي <code>origin/main</code>. اكتب الأوامر بالترتيب.</p>",
      hints: [
        "اعمل branch جديدة من مكانك الحالي، فالـ commit يبقى محفوظ عليها.",
        "بعدها ارجع بـ <code>main</code> لمكان <code>origin/main</code> بـ reset.",
      ],
      solution: `git branch feature/search
git reset --hard origin/main
git switch feature/search`,
      explain: "أول سطر بيحفظ الـ commit تحت اسم branch جديدة (بدون ما ننقل). بعدين <code>reset --hard origin/main</code> بيرجع <code>main</code> لمكان الـ remote، وده آمن هنا لأن الـ commit اتحفظ على branch تانية ولأن main ما اتدفعتش. جربناها في repo تجريبي والنتيجة صح.",
    },
    {
      title: "حل conflict وإنهاء الدمج",
      lang: "bash",
      prompt: "<p>إنت على <code>main</code>. عملت <code>git merge feature/login</code> وجاك conflict في ملف واحد <code>lib/auth.dart</code>. اكتب الأوامر من بعد الـ merge اللي فشل لحد ما الدمج ينتهي (افرض إنك عدّلت الملف بإيدك وحذفت الـ markers)، مع خطوة تتأكد بيها إن مفيش markers، وبعدها طريقة تلغي بيها كل ده لو غيرت رأيك.</p>",
      hints: [
        "<code>git status</code> بتقولك أنهي ملفات لسه unmerged.",
        "الإنهاء: add للملف وبعدين commit. والإلغاء له فلاج مع merge.",
      ],
      solution: `git status -s
git diff --check
git add lib/auth.dart
git commit
# to cancel instead of finishing:
git merge --abort`,
      explain: "<code>git diff --check</code> بتحذر من علامات conflict اللي لسه في الملفات (وكمان من مسافات زيادة في آخر السطور). <code>git add</code> بتعلّم الملف إنه اتحل، و<code>git commit</code> من غير <code>-m</code> بيفتح رسالة الـ merge الجاهزة. ملحوظة: <code>merge --abort</code> بتشتغل بس قبل ما تعمل commit الـ merge.",
    },
  ],

  quiz: [
    {
      q: "إيه هو الـ branch في Git؟",
      options: [
        "نسخة كاملة من ملفات المشروع في فولدر منفصل",
        "مؤشر (اسم) بيشاور على commit",
        "قايمة بالملفات اللي اتغيرت",
        "سيرفر بعيد",
      ],
      answer: 1,
      why: "الـ branch ملف صغير فيه hash لآخر commit. مفيش نسخ ملفات، وعشان كده إنشاؤه لحظي. النسخة البعيدة اسمها remote.",
    },
    {
      q: "عدّلت الملف <code>a.txt</code> وعملت <code>git add a.txt</code> وبعدين عدّلته تاني من غير add، وعملت <code>git commit</code>. إيه اللي دخل الـ commit؟",
      options: [
        "التعديل التاني بس",
        "التعديلين كلهم",
        "التعديل الأول بس (اللي اتعمله add)، والتاني فضل في الـ working tree",
        "مفيش حاجة، Git هيرفض",
      ],
      answer: 2,
      why: "الـ commit بياخد محتوى الـ staging بس، وهو النسخة وقت الـ add. التعديل التاني لسه modified في الـ working tree ويظهر في <code>git status</code>.",
    },
    {
      q: "أنهي أمر يمسح تعديلات ما اتعملهاش commit من غير رجعة؟",
      options: [
        "<code>git reset --soft HEAD~1</code>",
        "<code>git revert HEAD</code>",
        "<code>git stash</code>",
        "<code>git reset --hard</code>",
      ],
      answer: 3,
      why: "<code>--hard</code> بيرجع الـ working tree كمان فبيمسح تعديلاتك. <code>--soft</code> بيسيب التعديلات staged، و<code>stash</code> بتحفظها على جنب، و<code>revert</code> بيضيف commit ومبيمسحش حاجة.",
    },
    {
      q: "commit غلط اتدفع على <code>main</code> المشترك وزمايلك سحبوه. أنسب حل؟",
      options: [
        "<code>git reset --hard HEAD~1</code> وبعدين <code>git push --force</code>",
        "<code>git revert &lt;hash&gt;</code> وتدفع الـ commit الجديد",
        "<code>git rebase main</code>",
        "تمسح الـ repository وتعمل clone تاني",
      ],
      answer: 1,
      why: "<code>revert</code> بيضيف commit بيعكس الغلط من غير ما يكتب التاريخ من جديد، فزمايلك يسحبوه عادي. الـ reset مع force push بيبوظ تاريخهم. الـ rebase مش بيلغي حاجة.",
    },
    {
      q: "إيه اللي <code>git fetch</code> بتعمله؟",
      options: [
        "بتنزل الجديد وتدمجه في الـ branch الحالي",
        "بترفع commits بتاعتك للسيرفر",
        "بتنزل الجديد وتحدّث <code>origin/main</code> فقط، من غير ما تغير ملفاتك",
        "بتعمل stash تلقائي",
      ],
      answer: 2,
      why: "الـ fetch للقراءة بس من ناحية شغلك. اللي بيدمج هو <code>pull</code> (fetch + merge). اللي بيرفع هو <code>push</code>.",
    },
    {
      q: "بعد <code>git merge feature</code> الـ <code>git status -s</code> بيطلّع السطر ده. معناه إيه؟",
      code: { lang: "text", src: `UU a.txt` },
      options: [
        "الملف جديد ومش متابَع",
        "الملف اتمسح",
        "الملف في conflict لسه محلولش (الطرفين عدّلوه)",
        "الملف جاهز للـ commit",
      ],
      answer: 2,
      why: "<code>UU</code> يعني unmerged من الطرفين. بعد ما تحل الملف وتعمل <code>git add</code> بيتحول لـ <code>M</code>. الملف الجديد غير المتابع بيظهر <code>??</code>.",
    },
    {
      q: "عملت commit جديد لملف جديد <code>n.txt</code> وبعدين نفذت <code>git reset --soft HEAD~1</code>. الـ <code>git status -s</code> هيطلّع إيه؟",
      options: [
        "<code>A  n.txt</code> (الملف staged)",
        "<code>?? n.txt</code>",
        "مفيش حاجة، الملف اتمسح",
        "<code>UU n.txt</code>",
      ],
      answer: 0,
      why: "<code>--soft</code> بيرجع الـ HEAD بس، فالملف يفضل في الـ staging وبيظهر <code>A</code>. مع <code>--mixed</code> كان هيظهر <code>??</code>، ومع <code>--hard</code> كان هيتمسح.",
    },
    {
      q: "أنهي حالة rebase آمنة؟",
      options: [
        "على <code>main</code> بعد ما كل الفريق سحبوها",
        "على branch مشتركة اتدفعت وفيها شغل حد تاني",
        "على branch بتاعي لوحدي قبل ما أفتح الـ PR",
        "على commits اتدمجت فعلا في الـ release",
      ],
      answer: 2,
      why: "الـ rebase بيعيد كتابة الـ commits (hashes جديدة). آمن بس لو محدش بنى فوق القديمة، يعني branch ليا لوحدي. الباقي كلهم commits مشتركة.",
    },
    {
      q: "حطيت <code>.env</code> في <code>.gitignore</code> بس <code>git status</code> لسه بيعرضه كـ modified. السبب؟",
      options: [
        "Git ما بيقراش .gitignore إلا بعد restart",
        "الملف كان متتابع قبل كده، و.gitignore بتأثر على غير المتابَع بس. الحل <code>git rm --cached .env</code>",
        "لازم تكتب <code>*.env</code> بدل <code>.env</code> وبس",
        "ده bug في Git",
      ],
      answer: 1,
      why: "الـ .gitignore بيمنع إضافة ملفات جديدة. الملف اللي اتعمله commit قبل كده بيفضل متابَع لحد ما تشيله من الـ index بـ <code>git rm --cached</code> وتعمل commit.",
    },
  ],
};
