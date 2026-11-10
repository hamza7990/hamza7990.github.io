window.LEVELS = window.LEVELS || {};
window.LEVELS["core/c2"] = {
  slides: [
    {
      kicker: "ليه المستوى ده",
      title: "الجداول والمفاتيح: أساس كل سؤال SQL",
      en: "Tables, primary keys and foreign keys",
      body: "<p>أي إنترفيو لمطور backend (وكتير من Flutter) فيه سؤال SQL. مش بيسألوا عن حاجات نادرة، بيسألوا: join، group by، index، transaction. وإنت أصلا بتستخدمهم من خلال Laravel/Eloquent، فهنا بنفتح الصندوق ونشوف الـ SQL اللي بيتكتب فعلا.</p><p>هنشتغل على schema حقيقي من مشروع العقارات: <code>users</code> و<code>offices</code> و<code>listings</code> و<code>inquiries</code> و<code>tags</code> و<code>listing_tag</code>. كل الأمثلة اتجربت فعلا على SQLite بداتا صغيرة، والسينتاكس اللي بنستخدمه standard يشتغل على MySQL 8 كمان. وأي اختلاف بنقوله.</p>",
      code: {
        lang: "sql",
        title: "schema.sql",
        src: `CREATE TABLE offices (
  id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  city VARCHAR(40) NOT NULL,
  owner_id INTEGER NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users (id)
);

CREATE TABLE listings (
  id INTEGER PRIMARY KEY,
  office_id INTEGER NOT NULL,
  title VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  city VARCHAR(40) NOT NULL,
  status VARCHAR(20) NOT NULL,
  FOREIGN KEY (office_id) REFERENCES offices (id)
);`,
        note: "في MySQL هتكتب <code>id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY</code>. وفي SQLite الـ foreign keys مقفولة افتراضيا لحد ما تكتب <code>PRAGMA foreign_keys = ON;</code>، أما MySQL (InnoDB) فمفعّلها.",
      },
      terms: [
        ["primary key", "المفتاح الأساسي", "عمود (أو أكتر) بيحدد الصف بشكل فريد، مينفعش يتكرر ولا يبقى NULL."],
        ["foreign key", "المفتاح الأجنبي", "عمود بيشاور على primary key في جدول تاني، وقاعدة البيانات بترفض قيمة مش موجودة هناك."],
      ],
      focus: [{ label: "احفظها", text: "الـ foreign key مش بس ربط: هو قيد. مينفعش تضيف إعلان لمكتب مش موجود، ولا تمسح مكتب لسه عليه إعلانات (من غير <code>ON DELETE CASCADE</code>)." }],
    },
    {
      title: "SELECT: اختار الأعمدة وفلتر ورتب وحدد العدد",
      en: "SELECT, WHERE, ORDER BY, LIMIT",
      body: "<p>الترتيب اللي بتكتب بيه: <code>SELECT</code> ثم <code>FROM</code> ثم <code>WHERE</code> ثم <code>ORDER BY</code> ثم <code>LIMIT</code>. والـ <code>WHERE</code> بيفلتر الصفوف <b>قبل</b> أي تجميع.</p>",
      code: {
        lang: "sql",
        src: `SELECT title, price
FROM listings
WHERE city = 'Riyadh' AND status = 'active'
ORDER BY price DESC
LIMIT 2;
-- Villa Yasmin | 1500000
-- Apartment Olaya | 600000

SELECT title FROM listings
WHERE city IN ('Riyadh') AND price BETWEEN 600000 AND 900000
ORDER BY id;     -- Apartment Olaya, Land North`,
        note: "<code>BETWEEN</code> شاملة الطرفين. و<code>LIKE 'S%'</code> بتدور على اللي بيبدأ بحرف S. من غير <code>ORDER BY</code> مفيش ضمان لترتيب النتيجة، حتى لو طلعت مرتبة معاك.",
      },
      pitfall: "تكتب <code>SELECT *</code> في كود الإنتاج. بتجيب أعمدة مش محتاجها (ولو زاد عمود جديد النتيجة بتتغير)، وبتمنع بعض تحسينات الـ index. اكتب الأعمدة اللي محتاجها.",
    },
    {
      title: "INSERT و UPDATE و DELETE",
      en: "Changing data",
      body: "<p>الأمر الأخطر في SQL كله هو <code>UPDATE</code> أو <code>DELETE</code> من غير <code>WHERE</code>: بيطبق على كل الجدول. عادة كويسة: اكتب <code>SELECT</code> بنفس الـ <code>WHERE</code> الأول وشوف الصفوف اللي هتتأثر.</p>",
      code: {
        lang: "sql",
        src: `INSERT INTO inquiries (listing_id, user_id, message)
VALUES (3, 4, 'Is it still available?');

UPDATE listings
SET price = price + 50000
WHERE id = 2;

UPDATE listings
SET status = 'sold'
WHERE id = 2 AND status = 'active';

DELETE FROM inquiries WHERE message IS NULL;`,
        note: "تاني <code>UPDATE ... WHERE id = 2 AND status = 'active'</code> بيغير 0 صفوف لأن الشرط مبقاش صح. ده بيبقى مفيد: عدد الصفوف المتأثرة بيقولك لو حد سبقك. جربت كمان: مسح مكتب عليه إعلانات، أو إضافة إعلان بـ <code>office_id</code> مش موجود، الاتنين فشلوا بـ foreign key error.",
      },
      pitfall: "<code>DELETE FROM listings;</code> بتمسح كل الصفوف. وفي MySQL ممكن تحمي نفسك في الـ client بـ <code>--safe-updates</code>. الأحسن دايما: <code>BEGIN</code> قبلها، وبعدين تتأكد من عدد الصفوف، وبعدين <code>COMMIT</code> أو <code>ROLLBACK</code>.",
    },
    {
      title: "Joins: ربط الجداول",
      en: "INNER JOIN vs LEFT JOIN",
      body: "<p>الداتا مقسمة على جداول، والـ <b>join</b> بيربط صفوفها بشرط في <code>ON</code> (عادة foreign key = primary key).</p><ul><li><b>INNER JOIN</b>: الصفوف اللي ليها مقابل في الجدولين بس.</li><li><b>LEFT JOIN</b>: كل صفوف الجدول اللي على الشمال، ولو مفيش مقابل في اليمين أعمدته بتبقى <code>NULL</code>.</li></ul>",
      code: {
        lang: "sql",
        src: `-- offices with their listings (Palm Estates has none)
SELECT o.name, l.title
FROM offices o
LEFT JOIN listings l ON l.office_id = o.id
ORDER BY o.id, l.id;
-- Nile Realty  | Villa Yasmin
-- Nile Realty  | Apartment Olaya
-- Nile Realty  | Land North
-- Gulf Homes   | Sea View Flat
-- Gulf Homes   | Office Floor
-- Gulf Homes   | Villa Corniche
-- Palm Estates | NULL`,
        note: "لو كتبت <code>INNER JOIN</code> بدل <code>LEFT JOIN</code>، آخر صف (Palm Estates) كان هيختفي لأنه ملوش إعلانات.",
      },
      pitfall: "الفخ الكلاسيكي: <code>LEFT JOIN ... WHERE l.status = 'active'</code>. الـ WHERE بتشتغل بعد الـ join، والصف اللي فيه <code>l.status</code> بـ NULL مش بيحقق الشرط فبيتشال، والـ LEFT JOIN اتحول فعليا لـ INNER. جربنا: الاستعلام بيرجع 5 صفوف من غير Palm Estates. لو عايز تحتفظ بالمكاتب الفاضية حط الشرط في <code>ON</code>: <code>ON l.office_id = o.id AND l.status = 'active'</code> ويرجع 6 صفوف.",
      interview: [
        { q: "إيه الفرق بين INNER JOIN و LEFT JOIN؟ ولما صف يرجع بـ NULL معناه إيه؟", a: "<code>INNER JOIN</code> بيرجع الصفوف اللي ليها مقابل في الجدولين بس. <code>LEFT JOIN</code> بيرجع كل صفوف الجدول الشمال، ولو مفيش مقابل في اليمين بيحط NULL في أعمدته. فالـ NULL في عمود الجدول اليمين معناه «مفيش صف مرتبط». ده بيتستخدم لإيجاد الحاجات اللي ملهاش مقابل: <code>LEFT JOIN listings l ON l.office_id = o.id WHERE l.id IS NULL</code> بترجع المكاتب اللي ملهاش إعلانات." },
      ],
    },
    {
      title: "علاقة many-to-many: جدول وسيط",
      en: "Many-to-many through a pivot table",
      body: "<p>الإعلان ممكن يبقى له tags كتير (garden، parking)، والـ tag الواحد على إعلانات كتير. ده many-to-many، وبيتمثل بجدول تالت (pivot) فيه foreign keys للجدولين، والـ primary key بتاعه هو الاتنين مع بعض عشان نفس الربط ميتكررش.</p>",
      code: {
        lang: "sql",
        src: `CREATE TABLE listing_tag (
  listing_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (listing_id, tag_id),
  FOREIGN KEY (listing_id) REFERENCES listings (id),
  FOREIGN KEY (tag_id) REFERENCES tags (id)
);

SELECT l.title
FROM listings l
JOIN listing_tag lt ON lt.listing_id = l.id
JOIN tags t ON t.id = lt.tag_id
WHERE t.name = 'parking'
ORDER BY l.id;
-- Villa Yasmin, Apartment Olaya, Sea View Flat`,
        note: "إضافة نفس الربط تاني (<code>INSERT INTO listing_tag VALUES (1, 1)</code> مرتين) بتفشل بسبب الـ composite primary key. ده الشكل اللي Laravel بيعمله لما تستخدم <code>belongsToMany</code> و<code>attach</code>.",
      },
      focus: [{ label: "احفظها", text: "one-to-many: foreign key في جدول الـ «كتير» (<code>listings.office_id</code>). many-to-many: جدول وسيط بمفتاحين." }],
    },
    {
      title: "NULL مش صفر ومش نص فاضي",
      en: "NULL and three-valued logic",
      body: "<p><code>NULL</code> معناها «مجهول». أي مقارنة معاها بـ <code>=</code> أو <code>&lt;&gt;</code> نتيجتها <code>NULL</code> (مش true ولا false)، و<code>WHERE</code> بتحتفظ بالصفوف اللي شرطها true بس. عشان كده بنستخدم <code>IS NULL</code>.</p>",
      code: {
        lang: "sql",
        title: "users.phone: Ahmed 0501, Mona NULL, Sara NULL, Omar 0504",
        src: `SELECT name FROM users WHERE phone = NULL;     -- no rows!
SELECT name FROM users WHERE phone IS NULL;    -- Mona, Sara
SELECT name FROM users WHERE phone <> '0501';  -- Omar only

SELECT name, COALESCE(phone, 'none') FROM users;
SELECT COUNT(*), COUNT(phone) FROM users;      -- 4 | 2`,
        note: "<code>phone &lt;&gt; '0501'</code> بتستبعد Mona و Sara رغم إن تليفونهم مش 0501، لأن المقارنة معاهم NULL. <code>COALESCE</code> بترجع أول قيمة مش NULL. و<code>COUNT(*)</code> بتعد الصفوف، أما <code>COUNT(phone)</code> فبتعد القيم اللي مش NULL بس.",
      },
      pitfall: "<code>NOT IN</code> مع subquery فيها NULL ممكن ترجع صفر صفوف (لأن المقارنة مع NULL مجهولة). استخدم <code>NOT EXISTS</code> أو تأكد إن العمود <code>NOT NULL</code>.",
    },
    {
      title: "GROUP BY والـ aggregates: WHERE مقابل HAVING",
      en: "GROUP BY, COUNT, AVG, HAVING",
      body: "<p><code>GROUP BY</code> بيجمع الصفوف في مجموعات، والدوال التجميعية (<code>COUNT</code>, <code>SUM</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code>) بتتحسب لكل مجموعة. الفرق المهم:</p><ul><li><code>WHERE</code> بيفلتر <b>الصفوف</b> قبل التجميع.</li><li><code>HAVING</code> بيفلتر <b>المجموعات</b> بعد التجميع (وينفع يستخدم aggregate).</li></ul>",
      code: {
        lang: "sql",
        src: `SELECT city, COUNT(*) AS n, AVG(price) AS avg_price
FROM listings
WHERE status = 'active'          -- rows first
GROUP BY city
HAVING COUNT(*) >= 2             -- then groups
ORDER BY city;
-- Jeddah | 3 | ...
-- Riyadh | 2 | ...

SELECT o.name, COUNT(l.id) AS listings_count
FROM offices o
LEFT JOIN listings l ON l.office_id = o.id
GROUP BY o.id, o.name;
-- Nile Realty 3, Gulf Homes 3, Palm Estates 0`,
        note: "لاحظ <code>COUNT(l.id)</code> مش <code>COUNT(*)</code>: مع LEFT JOIN المكتب الفاضي عنده صف واحد فيه NULL، فـ <code>COUNT(*)</code> هتديله 1 غلط، و<code>COUNT(l.id)</code> بتعد الإعلانات الحقيقية فقط (0). الـ AVG في MySQL بترجع decimal زي <code>1200000.0000</code>.",
      },
      pitfall: "كل عمود في SELECT مش جوه aggregate لازم يكون في GROUP BY. الـ SQL standard و MySQL 5.7 فما فوق (الوضع <code>ONLY_FULL_GROUP_BY</code> مفعّل افتراضيا) بيرفضوا غير كده، أما SQLite فبيسمح ويختار قيمة من صف عشوائي، فمتتعودش على ده.",
      interview: [
        { q: "إيه الفرق بين WHERE و HAVING؟", a: "<code>WHERE</code> بيفلتر الصفوف الفردية قبل ما GROUP BY يجمعها، فمينفعش يستخدم aggregate. <code>HAVING</code> بيفلتر المجموعات بعد التجميع فبيقدر يستخدم <code>COUNT(*)</code> و<code>AVG</code>. وللأداء: كل شرط ينفع يتحط في WHERE يتحط هناك عشان يقلل الصفوف قبل التجميع. مثال: المدن اللي فيها 3 إعلانات نشطة أو أكتر: <code>WHERE status = 'active' GROUP BY city HAVING COUNT(*) &gt;= 3</code>." },
      ],
    },
    {
      title: "Subquery مقابل join، وأسئلة الإنترفيو الكلاسيكية",
      en: "Subqueries and common interview queries",
      body: "<p>الـ <b>subquery</b> استعلام جوه استعلام. بيتعمل في <code>WHERE</code> (<code>IN</code>, <code>EXISTS</code>, مقارنة بقيمة واحدة) أو في <code>FROM</code>. كتير من الحالات ينفع تتحل بـ join أو بـ subquery، واختار الأوضح. المحرك الحديث غالبا بيحسن الاتنين.</p>",
      code: {
        lang: "sql",
        src: `-- listings priced above the average
SELECT title, price FROM listings
WHERE price > (SELECT AVG(price) FROM listings);   -- 2 rows

-- listings nobody asked about
SELECT title FROM listings l
WHERE NOT EXISTS (
  SELECT 1 FROM inquiries i WHERE i.listing_id = l.id
);   -- Land North, Office Floor, Villa Corniche

-- second highest price
SELECT MAX(price) FROM listings
WHERE price < (SELECT MAX(price) FROM listings);   -- 1500000

-- duplicate prices
SELECT price, COUNT(*) FROM listings
GROUP BY price HAVING COUNT(*) > 1;                -- 600000 | 2`,
        note: "الطريقة التانية للثاني الأعلى: <code>SELECT DISTINCT price FROM listings ORDER BY price DESC LIMIT 1 OFFSET 1</code> (بتطلع نفس القيمة). لو الجدول ممكن يبقى فيه أقل من سعرين مختلفين، النتيجة بتبقى فاضية (أو NULL في الأولى).",
      },
      codes: [
        {
          lang: "sql",
          title: "أعلى إعلانين في كل مدينة (top N per group)",
          src: `SELECT title, city, price FROM (
  SELECT title, city, price,
         ROW_NUMBER() OVER (
           PARTITION BY city ORDER BY price DESC
         ) AS rn
  FROM listings
) t
WHERE rn <= 2
ORDER BY city, price DESC;
-- Villa Corniche | Jeddah | 2200000
-- Sea View Flat  | Jeddah | 800000
-- Villa Yasmin   | Riyadh | 1500000
-- Land North     | Riyadh | 900000`,
          note: "الفكرة: <code>ROW_NUMBER()</code> بيرقم الصفوف جوه كل <code>PARTITION</code> بالترتيب، وبعدين بنفلتر الرقم. محتاج MySQL 8 أو SQLite 3.25 فما فوق. وبدائلها القديمة subquery مترابط (correlated).",
        },
      ],
      interview: [
        { q: "اكتب استعلام يجيب ثاني أعلى سعر. وإيه اللي ممكن يبوظه؟", a: "<code>SELECT MAX(price) FROM listings WHERE price &lt; (SELECT MAX(price) FROM listings)</code>. أو <code>SELECT DISTINCT price ... ORDER BY price DESC LIMIT 1 OFFSET 1</code>. الصيغة الأولى بتتعامل مع التكرار لوحدها، أما صيغة الـ <code>ORDER BY</code> فلازم <code>DISTINCT</code> فيها عشان لو أعلى سعرين متساويين مياخدش الثاني بالغلط. ولو عايز أي ترتيب N أو أعلى N لكل مجموعة، بستخدم <code>ROW_NUMBER()</code> أو <code>DENSE_RANK()</code> مع <code>PARTITION BY</code>." },
      ],
    },
    {
      title: "الـ index: ليه وإمتى وإمتى لأ",
      en: "Indexes and composite index order",
      body: "<p>من غير index، الداتابيز بتقرا الجدول كله صف صف (full scan) عشان تلاقي الصفوف المطلوبة. الـ <b>index</b> هيكل منفصل (غالبا B-tree) مرتب على عمود أو أكتر، بيخلي البحث بسرعة زي فهرس الكتاب. بيفيد في <code>WHERE</code> و<code>JOIN</code> و<code>ORDER BY</code>.</p>",
      code: {
        lang: "sql",
        src: `CREATE INDEX idx_listings_city_status
  ON listings (city, status);

-- uses the index (leftmost column city is present):
--   WHERE city = 'Riyadh' AND status = 'active'
--   WHERE city = 'Riyadh'
-- cannot use it well (city is skipped):
--   WHERE status = 'active'

EXPLAIN QUERY PLAN                    -- SQLite
SELECT * FROM listings WHERE status = 'active';
-- SCAN listings
-- (in MySQL: EXPLAIN SELECT ... and read type/key/rows)`,
        note: "جربناها على SQLite: <code>city AND status</code> طلعت <code>SEARCH ... USING INDEX</code>، و<code>city</code> لوحدها كمان، أما <code>status</code> لوحدها فطلعت <code>SCAN</code>. ده قاعدة «أقصى الشمال» (leftmost prefix).",
      },
      points: [
        "<b>ترتيب الأعمدة في composite index مهم</b>: الـ index على (city, status) بيخدم البحث بـ city، أو city+status، مش status لوحده. حط العمود اللي بتفلتر عليه دايما أولا.",
        "الـ index بيبطل لو لفيت العمود في دالة (<code>WHERE LOWER(city) = 'riyadh'</code>) أو دورت بـ <code>LIKE '%riyadh'</code> (مسبوقة بـ %).",
        "<b>تمن الـ index</b>: كل <code>INSERT</code> و<code>UPDATE</code> و<code>DELETE</code> لازم يحدّث كل index على الجدول، وكل index بياخد مساحة. عشان كده مش بنعمل index على كل عمود.",
        "الـ primary key و unique بيتعملهم index تلقائيا. و InnoDB في MySQL بيعمل index على الـ foreign keys.",
      ],
      interview: [
        { q: "إيه هو الـ index وإمتى يبطّئ بدل ما يسرّع؟ وإيه أهمية ترتيب الأعمدة في composite index؟", a: "الـ index هيكل مرتب (B-tree) بيخلي البحث والـ join والترتيب أسرع من قراءة الجدول كله. بيبطّئ الكتابة لأن كل insert/update/delete بيحدّث كل index، وبياخد مساحة، وعلى جدول صغير أو عمود قيمه قليلة (زي status فيه 3 قيم) فايدته ضعيفة. في composite index الترتيب مهم بسبب leftmost prefix: index على (city, status) بيخدم city أو city+status لكن مش status لوحده. فبحط العمود اللي بفلتر عليه بالمساواة وأكتر استخدام أولا. وبتأكد من الاستخدام بـ <code>EXPLAIN</code>." },
      ],
    },
    {
      title: "Normalization: كل معلومة في مكان واحد",
      en: "1NF, 2NF, 3NF and denormalization",
      body: "<p>الـ normalization تنظيم الجداول عشان معلومة واحدة ما تتخزنش في أكتر من مكان (وإلا لو اتغيرت هتتحدث في مكان وتفضل قديمة في التاني). بالبلدي:</p>",
      points: [
        "<b>1NF</b>: كل خلية فيها قيمة واحدة. يعني مفيش عمود <code>tags</code> فيه <code>'garden,parking'</code>، ولا أعمدة <code>tag1</code> و<code>tag2</code>. الحل: جدول tags وجدول وسيط.",
        "<b>2NF</b>: لو الـ primary key مركب، كل عمود يعتمد على المفتاح كله مش على جزء منه. مثال: في <code>listing_tag(listing_id, tag_id, tag_name)</code> الـ <code>tag_name</code> بيعتمد على <code>tag_id</code> بس، فمكانه جدول tags.",
        "<b>3NF</b>: العمود يعتمد على المفتاح مش على عمود تاني مش مفتاح. مثال: لو في <code>listings</code> حطينا <code>office_id</code> و<code>office_name</code>، فـ <code>office_name</code> بيعتمد على <code>office_id</code>. نخزنه في <code>offices</code> مرة واحدة.",
      ],
      focus: [{ label: "الجملة المختصرة", text: "الاعتماد على «المفتاح، والمفتاح كله، ولا حاجة غير المفتاح»." }],
      pitfall: "الـ normalization مش دين. أحيانا بنعمل <b>denormalization</b> عن قصد: نخزن عدد الاستفسارات في عمود <code>inquiries_count</code> في listings عشان قايمة الإعلانات متعملش join وcount في كل مرة. التمن: لازم نحدث العمود مع كل تغيير وإلا يبقى غلط. اعمله بس لما تقيس إن القراءة بطيئة، وخلي الـ transaction أو الـ trigger يحدثه.",
      interview: [
        { q: "اشرح الـ normalization بإيجاز. وإمتى تعمل denormalization؟", a: "هي تقسيم الداتا على جداول عشان مفيش معلومة تتكرر. 1NF: قيمة واحدة في كل خلية. 2NF: كل عمود يعتمد على المفتاح كله مش جزء منه. 3NF: مفيش عمود يعتمد على عمود تاني غير المفتاح، زي اسم المكتب جوه جدول الإعلانات. بتمنع تناقض الداتا وبتخلي التعديل في مكان واحد. بعمل denormalization لما القراءة تبقى هي عنق الزجاجة وبعد ما أقيس، زي تخزين عدّاد جاهز، وأقبل إني أحدّثه مع كل تعديل." },
      ],
    },
    {
      title: "Transactions و ACID وفخ الـ lost update",
      en: "Transactions, ACID and isolation",
      body: "<p>الـ <b>transaction</b> مجموعة عمليات بتتنفذ كوحدة واحدة: كلها تنجح (<code>COMMIT</code>) أو كلها تتلغي (<code>ROLLBACK</code>). مثال: تسجل الحجز وتغير حالة الإعلان، لو التانية فشلت الأولى تتلغي.</p>",
      code: {
        lang: "sql",
        src: `BEGIN;                       -- MySQL: START TRANSACTION or BEGIN
UPDATE listings SET status = 'hidden' WHERE city = 'Riyadh';
SELECT COUNT(*) FROM listings WHERE status = 'hidden';   -- 3
ROLLBACK;                    -- nothing was really changed
SELECT COUNT(*) FROM listings WHERE status = 'hidden';   -- 0`,
        note: "ده اتجرب فعلا. وفي MySQL الـ DDL زي <code>CREATE TABLE</code> بيعمل commit ضمني، فمش بيتلغي بـ rollback.",
      },
      terms: [
        ["Atomicity", "الكل أو لا شيء", "كل عمليات الـ transaction تنجح مع بعض أو تتلغي مع بعض."],
        ["Consistency", "الاتساق", "الداتا بتنتقل من حالة صالحة لحالة صالحة (القيود والـ foreign keys محترمة)."],
        ["Isolation", "العزل", "الـ transactions المتزامنة مبتشوفش نصف شغل بعض."],
        ["Durability", "الثبات", "بعد COMMIT الداتا بتفضل حتى لو السيرفر وقع."],
      ],
      pitfall: "<b>Lost update</b>: موظفين فتحوا نفس الإعلان (السعر 600000). الأول قرا السعر وزوّد 50000 وكتب 650000. التاني قرا 600000 (قبل ما الأول يكتب) وزوّد 40000 وكتب 640000. النتيجة 640000 والزيادة الأولى ضاعت. الحل: عملية ذرية في SQL <code>UPDATE listings SET price = price + 50000 WHERE id = 2</code> بدل ما تقرا وتحسب في التطبيق. أو تقفل الصف: <code>SELECT ... FOR UPDATE</code> جوه transaction (MySQL InnoDB، مش موجودة في SQLite). أو optimistic locking بعمود <code>version</code> وشرط <code>WHERE version = ?</code>.",
      interview: [
        { q: "إيه هي ACID؟ وإيه مستويات الـ isolation؟", a: "ACID خصائص الـ transaction: Atomicity (الكل أو لا شيء)، Consistency (القيود محترمة)، Isolation (العمليات المتزامنة معزولة)، Durability (بعد الـ commit الداتا باقية). مستويات العزل من الأضعف للأقوى: READ UNCOMMITTED (ممكن dirty read)، READ COMMITTED (بتشوف المتأكد بس، لكن القراءة نفسها ممكن تتغير بين مرتين)، REPEATABLE READ (الافتراضي في MySQL InnoDB، نفس القراءة بترجع نفس النتيجة)، SERIALIZABLE (كأنها بالدور). كل ما العزل زاد الأمان زاد وقل التزامن." },
        { q: "إزاي تتجنب lost update؟", a: "الأفضل أخلي قاعدة البيانات تعمل العملية ذريا: <code>UPDATE listings SET price = price + 50000 WHERE id = 2</code> بدل قراءة القيمة في التطبيق وكتابتها. لو لازم أقرا وأقرر، بقفل الصف جوه transaction بـ <code>SELECT ... FOR UPDATE</code>، أو بستعمل optimistic locking: عمود version والـ UPDATE فيه <code>WHERE version = ?</code> وأتحقق من عدد الصفوف المتأثرة، ولو صفر أعيد المحاولة." },
      ],
    },
  ],

  drills: [
    {
      title: "اكتب: SELECT بفلتر وترتيب",
      lang: "sql",
      code: `SELECT title, price
FROM listings
WHERE city = 'Riyadh'
  AND status = 'active'
ORDER BY price DESC
LIMIT 2;`,
      note: "اكتب الكلمات المفتاحية UPPER CASE زي ما هي عادة في الـ SQL.",
    },
    {
      title: "اكتب: LEFT JOIN مع GROUP BY",
      lang: "sql",
      code: `SELECT o.name, COUNT(l.id) AS listings_count
FROM offices o
LEFT JOIN listings l ON l.office_id = o.id
GROUP BY o.id, o.name
HAVING COUNT(l.id) >= 1
ORDER BY listings_count DESC;`,
    },
    {
      title: "اكتب: جدول وسيط وindex",
      lang: "sql",
      code: `CREATE TABLE listing_tag (
  listing_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (listing_id, tag_id),
  FOREIGN KEY (listing_id) REFERENCES listings (id),
  FOREIGN KEY (tag_id) REFERENCES tags (id)
);

CREATE INDEX idx_listings_city_status
  ON listings (city, status);`,
    },
  ],

  tasks: [
    {
      title: "المكاتب وعدد إعلاناتها (حتى اللي صفر)",
      lang: "sql",
      prompt: "<p>اكتب استعلام يرجع اسم كل مكتب وعدد إعلاناته في عمود اسمه <code>listings_count</code>، بما فيهم المكاتب اللي ملهاش إعلانات (يطلع لها 0). رتّب بـ <code>id</code> المكتب.</p>",
      examples: [{ in: "offices: Nile Realty, Gulf Homes, Palm Estates", out: "Nile Realty 3, Gulf Homes 3, Palm Estates 0" }],
      hints: [
        "محتاج join يحتفظ بالمكاتب اللي ملهاش إعلانات: أنهي نوع؟",
        "العد: <code>COUNT(*)</code> هيديك 1 للمكتب الفاضي. عد عمود من جدول الإعلانات.",
      ],
      solution: `SELECT o.name, COUNT(l.id) AS listings_count
FROM offices o
LEFT JOIN listings l ON l.office_id = o.id
GROUP BY o.id, o.name
ORDER BY o.id;`,
      explain: "الـ <code>LEFT JOIN</code> بيحتفظ بـ Palm Estates بصف فيه NULL، و<code>COUNT(l.id)</code> بتتجاهل الـ NULL فبتطلع 0. لو كتبت <code>COUNT(*)</code> كانت هتطلع 1. وجربنا الاستعلام فعلا: 3 و3 و0.",
    },
    {
      title: "ثاني أعلى سعر",
      lang: "sql",
      prompt: "<p>اكتب استعلام يرجع <b>ثاني أعلى سعر</b> (قيمة واحدة) من جدول <code>listings</code>. لو أعلى سعرين متساويين، المطلوب أعلى سعر مختلف عن الأول.</p>",
      examples: [{ in: "prices: 1500000, 600000, 900000, 800000, 600000, 2200000", out: "1500000" }],
      hints: [
        "عايز أكبر سعر من اللي أصغر من أكبر سعر.",
        "أو: الأسعار المختلفة مرتبة تنازليا وتتخطى الأول (<code>OFFSET</code>).",
      ],
      solution: `SELECT MAX(price)
FROM listings
WHERE price < (SELECT MAX(price) FROM listings);

-- alternative
SELECT DISTINCT price
FROM listings
ORDER BY price DESC
LIMIT 1 OFFSET 1;`,
      explain: "الـ subquery بتجيب أعلى سعر (2200000)، والاستعلام الخارجي بيجيب أكبر سعر أقل منه (1500000). الحل التاني بيرتب الأسعار المختلفة ويتخطى أول واحد. الاتنين اتجربوا وطلعوا 1500000. الفرق: الأول يرجع NULL والتاني صفر صفوف لو مفيش ثاني.",
    },
    {
      title: "الإعلانات اللي محدش سأل عنها",
      lang: "sql",
      prompt: "<p>اكتب استعلام يرجع عناوين الإعلانات اللي ملهاش أي استفسار في جدول <code>inquiries</code>، مرتبة بـ <code>id</code>. اكتبه مرة بـ <code>NOT EXISTS</code> ومرة بـ <code>LEFT JOIN</code>.</p>",
      examples: [{ in: "inquiries on listings 1, 1, 2, 4, 4", out: "Land North, Office Floor, Villa Corniche" }],
      hints: [
        "<code>NOT EXISTS (SELECT 1 FROM inquiries i WHERE i.listing_id = l.id)</code>",
        "في الـ LEFT JOIN: الإعلان اللي ملوش استفسار هيطلع عمود <code>i.id</code> بتاعه NULL.",
      ],
      solution: `SELECT l.title
FROM listings l
WHERE NOT EXISTS (
  SELECT 1 FROM inquiries i WHERE i.listing_id = l.id
)
ORDER BY l.id;

SELECT l.title
FROM listings l
LEFT JOIN inquiries i ON i.listing_id = l.id
WHERE i.id IS NULL
ORDER BY l.id;`,
      explain: "الاتنين بيطلعوا نفس النتيجة. <code>NOT EXISTS</code> أوضح في المعنى وبيتعامل صح مع NULL. الـ <code>LEFT JOIN ... IS NULL</code> نمط معروف (anti-join). متستخدمش <code>NOT IN</code> لو العمود ممكن فيه NULL.",
    },
  ],

  quiz: [
    {
      q: "الجدول <code>users</code> فيه 4 مستخدمين، اتنين منهم <code>phone</code> بتاعهم NULL (Mona و Sara). الاستعلام ده بيرجع مين؟",
      code: { lang: "sql", src: `SELECT name FROM users WHERE phone <> '0501';
-- phones: Ahmed 0501, Mona NULL, Sara NULL, Omar 0504` },
      options: ["Mona و Sara و Omar", "Omar بس", "Ahmed بس", "مفيش صفوف"],
      answer: 1,
      why: "المقارنة <code>NULL &lt;&gt; '0501'</code> نتيجتها NULL مش true، فالصفوف دي بتتشال. Omar بس تليفونه موجود ومختلف. لو عايز Mona و Sara كمان: <code>OR phone IS NULL</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "sql", src: `SELECT COUNT(phone) FROM users;
-- 4 users, 2 phones are NULL` },
      answer: ["2"],
      why: "<code>COUNT(column)</code> بتعد القيم اللي مش NULL بس، يعني 2. <code>COUNT(*)</code> كانت هتديك 4.",
    },
    {
      q: "الداتا: 3 مكاتب، و6 إعلانات (5 نشطة وواحد sold)، ومكتب واحد ملوش أي إعلانات. الاستعلام ده بيرجع كام صف؟",
      code: { lang: "sql", src: `SELECT o.name, l.title
FROM offices o
LEFT JOIN listings l ON l.office_id = o.id
WHERE l.status = 'active';` },
      options: ["3", "5", "6", "7"],
      answer: 1,
      why: "الـ WHERE بتشتغل بعد الـ join، والمكتب الفاضي صفه فيه <code>l.status</code> بـ NULL فبيتشال. الإعلان المباع (sold) كمان بيتشال. يبقى 5. لو حطينا الشرط في <code>ON</code> كان هيرجع 6 صفوف.",
    },
    {
      q: "أنهي استعلام صح لـ «المدن اللي فيها 3 إعلانات نشطة أو أكتر»؟",
      options: [
        "<code>SELECT city FROM listings WHERE COUNT(*) &gt;= 3 GROUP BY city</code>",
        "<code>SELECT city FROM listings GROUP BY city HAVING status = 'active' AND COUNT(*) &gt;= 3</code>",
        "<code>SELECT city FROM listings WHERE status = 'active' HAVING COUNT(*) &gt;= 3</code>",
        "<code>SELECT city FROM listings WHERE status = 'active' GROUP BY city HAVING COUNT(*) &gt;= 3</code>",
      ],
      answer: 3,
      why: "الشرط على الصفوف (<code>status</code>) في WHERE قبل التجميع، والشرط على العدد في HAVING بعد GROUP BY. الأول فيه aggregate في WHERE (غلط). التاني بيحط عمود غير مجمّع في HAVING. التالت من غير GROUP BY.",
    },
    {
      q: "عندنا index على <code>listings (city, status)</code>. أنهي استعلام مش هيقدر يستفيد منه كويس؟",
      options: [
        "<code>WHERE city = 'Riyadh'</code>",
        "<code>WHERE status = 'active'</code>",
        "<code>WHERE city = 'Riyadh' AND status = 'active'</code>",
        "<code>WHERE status = 'active' AND city = 'Riyadh'</code>",
      ],
      answer: 1,
      why: "الـ index مرتب بـ city الأول. البحث بـ status لوحده بيعمل full scan (اتجرب: SCAN). الباقي فيهم city، وترتيب الشروط في الـ WHERE مبيهمش لأن الـ optimizer بيرتبهم.",
    },
    {
      q: "الناتج إيه؟ (الأسعار: 1500000, 600000, 900000, 800000, 600000, 2200000)",
      code: { lang: "sql", src: `SELECT MAX(price) FROM listings
WHERE price < (SELECT MAX(price) FROM listings);` },
      answer: ["1500000", "1,500,000"],
      why: "الـ subquery بترجع 2200000، واللي أصغر منه أكبر واحد هو 1500000.",
    },
    {
      q: "موظفين قروا سعر الإعلان (600000) في نفس الوقت، الأول زوّد 50000 والتاني زوّد 40000، كل واحد كتب القيمة اللي حسبها في التطبيق. إيه المشكلة، وإيه أنسب حل؟",
      options: [
        "dirty read، والحل SERIALIZABLE بس",
        "مفيش مشكلة، آخر واحد بيكتب هو الصح",
        "deadlock، والحل ندخل index",
        "lost update، والحل <code>UPDATE ... SET price = price + x</code> أو قفل الصف",
      ],
      answer: 3,
      why: "الزيادة الأولى بتضيع لأن التاني كتب من قيمة قديمة. الحل إن الحساب يحصل جوه الداتابيز في عملية ذرية، أو نقفل الصف بـ <code>FOR UPDATE</code>، أو optimistic locking بـ version.",
    },
    {
      q: "أنهي جزء من ACID بيضمن إن لو الـ transaction فيها 3 updates والتالت فشل، التلاتة يتلغوا؟",
      options: ["Atomicity", "Isolation", "Durability", "Consistency"],
      answer: 0,
      why: "الـ Atomicity هي «الكل أو لا شيء». الـ Isolation عن التزامن بين transactions، والـ Durability عن بقاء الداتا بعد الـ commit، والـ Consistency عن احترام القيود.",
    },
    {
      q: "جدول <code>listings</code> فيه الأعمدة <code>office_id</code> و<code>office_name</code> مع بعض. ده بيكسر أنهي قاعدة؟",
      options: [
        "1NF، لأن العمود مش بقيمة واحدة",
        "2NF، لأن مفيش composite key",
        "3NF، لأن <code>office_name</code> بيعتمد على <code>office_id</code> مش على إعلان",
        "مفيش حاجة مكسورة",
      ],
      answer: 2,
      why: "اسم المكتب معلومة عن المكتب مش عن الإعلان (اعتماد غير مباشر عن طريق عمود تاني). لو اتغير الاسم لازم تحدثه في كل الإعلانات. مكانه جدول <code>offices</code>.",
    },
    {
      q: "الناتج إيه؟",
      code: { lang: "sql", src: `SELECT 1 = NULL;` },
      options: ["true", "false", "NULL", "خطأ في الـ syntax"],
      answer: 2,
      why: "أي مقارنة مع NULL بتدي NULL (مجهول). عشان كده بنستخدم <code>IS NULL</code>. جربناها: النتيجة NULL.",
    },
  ],
};
