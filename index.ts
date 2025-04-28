import { Context, Markup, session, Telegraf } from "telegraf";

const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}

interface SessionData {
  currentNodeId: number;
}

interface MyContext extends Context {
  session: SessionData;
}

type Leaf = {
  text: string | string[];
  type: "button" | "text";
  children?: Leaf[];
  id?: number;
};

const GENERAL_TEXT =
  "Для облегчения вашей работы на пути к цели мы подготовили несколько чек-листов по теме секции, на которые удобно опираться при выполнении или контроле выполнения задач.\nПожалуйста, не стесняйтесь обратиться к модератору для персональной консультации!";
const ANALYTICS_LINK = process.env.ANALYTICS_LINK ?? "";
const COMPANY_LINK = process.env.COMPANY_LINK ?? "";
const LONG_LONG_TEXT =
  "Одним из способов налаживания регулярного притока молодых разработчиков в R&D является совместная с университетом образовательная программа по профильному направлению. Совместная ОП позволяет сформировать у будущих сотрудников необходимые навыки, оценить кандидатов из числа студентов в рамках стажировок, а также погрузить обучающихся в культуру компании на самых ранних этапах взаимодействия.";

const generalNoLeaf: Leaf = {
  type: "text",
  text: ["Какую пользу я бы хотел получить от секции?", GENERAL_TEXT],
  children: [
    {
      type: "text",
      text: [ANALYTICS_LINK, COMPANY_LINK],
    },
  ],
};
const adminMiddleLeaf: Leaf = {
  type: "text",
  text: LONG_LONG_TEXT,
  children: [
    {
      type: "text",
      text: "А есть ли у моей компании в контуре такие вузы, с которыми это (в т.ч. миссию) можно совместно реализовывать?",
      children: [
        {
          type: "button",
          text: "✅ Да",
          children: [
            {
              type: "text",
              text: [
                "В этом случае мы предлагаем поставить задачу установить с вузом первичный контакт, заранее подготовив ТЗ от компании на образовательную программу.",
                GENERAL_TEXT,
                COMPANY_LINK,
              ],
            },
          ],
        },
        {
          type: "button",
          text: "❌ Нет",
          children: [
            {
              type: "text",
              text: [
                "В этом случае мы предлагаем поставить аналитическую задачу для выявления многообещающих вузов для коллаборации.",
                GENERAL_TEXT,
                ANALYTICS_LINK,
              ],
            },
          ],
        },
      ],
    },
  ],
};

const UNIVER_SAMOOBS_LINK = process.env.UNIVER_SAMOOBS_LINK ?? "";
const UNIVER_START_LINK = process.env.UNIVER_START_LINK ?? "";
const UNIVER_CONTACT_LINK = process.env.UNIVER_CONTACT_LINK ?? "";
const univerNoLeaf: Leaf = {
  type: "text",
  text: ["Какую пользу я бы хотел получить от секции?", GENERAL_TEXT],
  children: [
    {
      type: "text",
      text: [UNIVER_SAMOOBS_LINK, UNIVER_START_LINK],
    },
  ],
};

const _tree: Leaf = {
  type: "text",
  text: "Я работаю в ВУЗе?",
  children: [
    {
      type: "button",
      text: "✅ Да",
      children: [
        {
          type: "text",
          text: "Какую позицию я занимаю в вузе?",
          children: [
            {
              type: "button",
              text: "Руководитель вуза (ректор, проректор)",
              children: [
                {
                  type: "text",
                  text: "Есть ли у меня в программе развития совместные с бизнесом программы?",
                  children: [
                    {
                      type: "button",
                      text: "✅ Да",
                      children: [
                        {
                          type: "text",
                          text: "В каждом университете существуют подразделения, призванные обеспечивать сервисный функционал для содействия научно-образовательным подразделениям в реализации тех базовых процессов (образование, исследование, инновации), которые на них возложены. Важно удостовериться в том, что обеспечиваемый функционал действительно является сервисным, а не рамочным. Рамочный функционал, который также можно назвать контроль-надзорным, подразумевает организацию деятельности университета таким образом, чтобы факультеты, реализующие базовые процессы, “ничего не нарушили”. Например, чтобы были соблюдены требования налогового и миграционного законодательства. Рамочный функционал необходим, но недостаточен. Рамочный функционал гласит: “как бы чего не случилось”. Сервисный функционал же  гласит: “как, с учётом рамок, придумать самое лучшее решение”. Часто рамочный функционал лишь называют сервисным. Отвечать за сервисный функционал должны те, кто не понаслышке знают “боли” научно-образовательных подразделений и искренне замотивированы “облегчить их ношу”.",
                          children: [
                            {
                              type: "text",
                              text: [
                                "В этом случае мы предлагаем поручить профильному декану или директору института инициировать проект по запуску ОП.",
                                "При этом важно поручить соответствующим сервисно-рамочным подразделениям оказывать выпускающим подразделениям содействие.",
                                GENERAL_TEXT,
                              ],
                              children: [
                                {
                                  type: "text",
                                  text: [
                                    UNIVER_SAMOOBS_LINK,
                                    UNIVER_START_LINK,
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "button",
                      text: "❌ Нет",
                      children: [univerNoLeaf],
                    },
                  ],
                },
              ],
            },
            {
              type: "button",
              text: "Непосредственно отвечаю за реализацию ОП (декан, РОП, директор института)",
              children: [
                {
                  type: "text",
                  text: "Реализуются ли у меня <b><u>уже</u></b> ОП с бизнесом?",
                  children: [
                    {
                      type: "button",
                      text: "✅ Да",
                      children: [
                        {
                          type: "text",
                          text: "Удовлетворен ли я результатами?",
                          children: [
                            {
                              type: "button",
                              text: "✅ Да",
                              children: [univerNoLeaf],
                            },
                            {
                              type: "button",
                              text: "❌ Нет",
                              children: [
                                {
                                  type: "text",
                                  text: "В этом случае мы предлагаем вам отрефлексировать свой опыт через самообследование. Для облегчения вашей работы на пути к цели мы подготовили чек-лист, на который удобно опираться. Пожалуйста, не стесняйтесь обратиться к модератору для персональной консультации!",
                                  children: [
                                    {
                                      type: "text",
                                      text: UNIVER_SAMOOBS_LINK,
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "button",
                      text: "❌ Нет",
                      children: [
                        {
                          type: "text",
                          text: "Есть ли у меня тёплый выход на фармкомпании?",
                          children: [
                            {
                              type: "button",
                              text: "✅ Да",
                              children: [
                                {
                                  type: "text",
                                  text: "В этом случае мы предлагаем вам провести с партнёром встречу по со-настройке, с целью перехода к проектированию совместной ОП. Для облегчения вашей работы на пути к цели мы подготовили чек-лист, на который удобно опираться.Пожалуйста, не стесняйтесь обратиться к модератору для персональной консультации!",
                                  children: [
                                    {
                                      type: "text",
                                      text: UNIVER_START_LINK,
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              type: "button",
                              text: "❌ Нет",
                              children: [
                                {
                                  type: "text",
                                  text: "В этом случае мы предлагаем вам чек-лист действий, который поможет вам выйти на тёплый контакт с бизнесом. Для облегчения вашей работы на пути к цели мы подготовили чек-лист, на который удобно опираться. Пожалуйста, не стесняйтесь обратиться к модератору для персональной консультации!",
                                  children: [
                                    {
                                      type: "text",
                                      text: UNIVER_CONTACT_LINK,
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "button",
      text: "❌ Нет",
      children: [
        {
          type: "text",
          text: "В каком направлении я работаю?",
          children: [
            {
              type: "button",
              text: "Я имею непосредственное отношение к разработкам и инновациям (R&D, R&I)",
              children: [
                {
                  type: "text",
                  text: [
                    "<b>Senior</b>\n(например, директор научно-исследовательского центра, заместитель генерального директора по R&D/R&I)",
                    "<b>Middle</b>\n(например, директор департамента)",
                    "<b>Junior</b>\n(например, руководитель лаборатории)",
                  ],
                  children: [
                    {
                      type: "button",
                      text: "Senior",
                      children: [
                        {
                          type: "text",
                          text: "Необходимо ли в долгосрочной перспективе наращивать потенциал разработок нашей компании?",
                          children: [
                            {
                              type: "button",
                              text: "✅ Да",
                              children: [
                                {
                                  type: "text",
                                  text: "Каждая компания, R&D в которой играет одну из ключевых ролей, стремится к технологическому лидерству. Прорывные технологии основываются на научных исследованиях. Научно-исследовательский подход требует пытливого ума, усердия, мечты получить Нобелевскую премию. Нет никого, кто сравнится в таком подходе со студентами и аспирантами. Именно они в силу своего возраста и жизненной позиции могут “придумать то, чего нет”. Уильям Лоренс Брэгг получил Нобелевскую премию по физике в возрасте 25 лет. Таким образом, вкладываться в обучающихся на ранних этапах их развития означает делать долгосрочный вклад в стратегическое обеспечение технологического лидерства компании. Будучи вовлечёнными в R&D, обучающиеся пропитываются культурой и ценностями компании и становятся агентами изменений.",
                                  children: [
                                    {
                                      type: "text",
                                      text: [
                                        "В этом случае мы предлагаем вам поручить соответствующим подразделениям инициировать проект по запуску ОП.",
                                        GENERAL_TEXT,
                                      ],
                                      children: [
                                        {
                                          type: "text",
                                          text: [ANALYTICS_LINK, COMPANY_LINK],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              type: "button",
                              text: "❌ Нет",
                              children: [
                                {
                                  type: "text",
                                  text: [
                                    "Для чего мне ОП с университетом? Важно понимать собственные цели и задачи для запуска образовательного проекта.",
                                    GENERAL_TEXT,
                                  ],
                                  children: [
                                    {
                                      type: "text",
                                      text: [ANALYTICS_LINK, COMPANY_LINK],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "button",
                      text: "Middle",
                      children: [
                        {
                          type: "text",
                          text: "Нужен ли мне регулярный приток молодых разработчиков?",
                          children: [
                            {
                              type: "button",
                              text: "✅ Да",
                              children: [
                                {
                                  type: "text",
                                  text: [
                                    LONG_LONG_TEXT,
                                    "Зачастую студенты обладают хорошей теоретической базой, при этом лабораторные навыки они получают в учебных условиях в уменьшенных масштабах. Приходя в компанию, они погружаются в мир настоящих разработок. Обучающимся требуется адаптация, знакомство с оборудованием, бизнес-процессами компании в целом и лаборатории в частности. Помощь эмпатичного наставника, готового подставить плечо, оказывает положительный эффект при адаптации и повышает лояльность стажёра к потенциальному рабочему месту.",
                                  ],
                                  children: [
                                    {
                                      type: "text",
                                      text: "А есть ли в моём подразделении ресурс для того, чтобы брать молодые кадры под крыло и взращивать их?",
                                      children: [
                                        {
                                          type: "button",
                                          text: "✅ Да",
                                          children: [
                                            {
                                              type: "text",
                                              text: [
                                                "В этом случае мы предлагаем вам заручиться поддержкой соответствующего административного подразделения (HR, управление по работе с образовательными организациями) и инициировать проект по запуску новой ОП.",
                                                GENERAL_TEXT,
                                              ],
                                              children: [
                                                {
                                                  type: "text",
                                                  text: [
                                                    ANALYTICS_LINK,
                                                    COMPANY_LINK,
                                                  ],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                        {
                                          type: "button",
                                          text: "❌ Нет",
                                          children: [
                                            {
                                              type: "text",
                                              text: "В этом случае мы предлагаем вам обратиться к руководителю senior позиции и обсудить с ним ресурсы, необходимые для взращивания новых молодых кадров.",
                                              children: [
                                                {
                                                  type: "text",
                                                  text: GENERAL_TEXT,
                                                  children: [
                                                    {
                                                      type: "text",
                                                      text: [
                                                        ANALYTICS_LINK,
                                                        COMPANY_LINK,
                                                      ],
                                                    },
                                                  ],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              type: "button",
                              text: "❌ Нет",
                              children: [generalNoLeaf],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "button",
                      text: "Junior",
                      children: [
                        {
                          type: "text",
                          text: "Ощущаю ли я, что в моём отделе не хватает людей?",
                          children: [
                            {
                              type: "button",
                              text: "✅ Да",
                              children: [
                                {
                                  type: "text",
                                  text: [
                                    "В этом случае мы предлагаем вам обратиться к руководителю отдела и обсудить с ним ресурсы, необходимые для появления новых молодых кадров.",
                                    LONG_LONG_TEXT,
                                    GENERAL_TEXT,
                                  ],
                                  children: [
                                    {
                                      type: "text",
                                      text: COMPANY_LINK,
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              type: "button",
                              text: "❌ Нет",
                              children: [generalNoLeaf],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: "button",
              text: "Я управляю / администрирую",
              children: [
                {
                  type: "text",
                  text: [
                    "<b>Лицо, принимающее решения</b>\n(CEO, директор, управляющий партнёр, учредитель)",
                    "<b>Middle</b>\n(например, бизнес-партнер по управлению персоналом, руководитель группы по образовательным программам, руководитель группы операционной поддержки)",
                    "<b>Junior</b>\n(например, менеджер образовательных программ, специалист по адаптации и работе с вузами, менеджер группы по образовательным проектам)",
                  ],
                  children: [
                    {
                      type: "button",
                      text: "Лицо, принимающее решения",
                      children: [
                        {
                          type: "text",
                          text: "Считаю ли я необходимым, чтобы в миссии/стратегии компании имелся образовательный и/или социальный фокус?",
                          children: [
                            {
                              type: "button",
                              text: "✅ Да",
                              children: [
                                {
                                  type: "text",
                                  text: [
                                    "В этом случае мы предлагаем вам поручить соответствующим подразделениям запустить проект по запуску ОП.",
                                    GENERAL_TEXT,
                                  ],
                                  children: [
                                    {
                                      type: "text",
                                      text: [ANALYTICS_LINK, COMPANY_LINK],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              type: "button",
                              text: "❌ Нет",
                              children: [generalNoLeaf],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "button",
                      text: "Middle",
                      children: [
                        {
                          type: "text",
                          text: "Выберете тему, в логике которой для вас наиболее актуально развить обсуждение",
                          children: [
                            {
                              type: "button",
                              text: "Об образовательном/социальном фокусе в компании",
                              children: [
                                {
                                  type: "text",
                                  text: "Есть ли в миссии/стратегии компании образовательный и/или социальный фокус?",
                                  children: [
                                    {
                                      type: "button",
                                      text: "✅ Да",
                                      children: [adminMiddleLeaf],
                                    },
                                    {
                                      type: "button",
                                      text: "❌ Нет",
                                      children: [generalNoLeaf],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              type: "button",
                              text: "О необходимости привлечения конкретного числа кадров",
                              children: [
                                {
                                  type: "text",
                                  text: "Имеются ли у меня необходимость привлечения конкретного числа молодых кадров в конкретные сроки?",
                                  children: [
                                    {
                                      type: "button",
                                      text: "✅ Да",
                                      children: [adminMiddleLeaf],
                                    },
                                    {
                                      type: "button",
                                      text: "❌ Нет",
                                      children: [generalNoLeaf],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "button",
                      text: "Junior",
                      children: [
                        {
                          type: "text",
                          text: "Необходимо ли мне вовлечь новых молодых людей в контур компании?",
                          children: [
                            {
                              type: "button",
                              text: "✅ Да",
                              children: [
                                {
                                  type: "text",
                                  text: [
                                    "В этом случае мы предлагаем направиться в ВУЗ для установления первого контакта, опираясь на составленное в компании ТЗ.",
                                    GENERAL_TEXT,
                                  ],
                                  children: [
                                    {
                                      type: "text",
                                      text: COMPANY_LINK,
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              type: "button",
                              text: "❌ Нет",
                              children: [generalNoLeaf],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

function assignSequentialIds(tree: Leaf): Leaf {
  // Counter for sequential IDs
  let counter = 0;

  // Recursive function to traverse and assign IDs
  const traverse = (node: Leaf): Leaf => {
    // Create a new node with the current ID
    const newNode = {
      ...node,
      id: counter++,
    };

    // If the node has children, recursively assign IDs to them
    if (node.children?.length) {
      newNode.children = node.children.map((child) => traverse(child));
    }

    return newNode;
  };

  return traverse(tree);
}

const tree = assignSequentialIds(_tree);

// Вспомогательная функция для поиска узла
function findNodeById(tree: Leaf, targetId: number): Leaf | null {
  if (tree.id === targetId) return tree;

  if (tree.children) {
    for (const child of tree.children) {
      const result = findNodeById(child, targetId);
      if (result) return result;
    }
  }

  return null;
}

const bot = new Telegraf<MyContext>(token);

bot.use(session({ defaultSession: () => ({ currentNodeId: 0 }) }));

bot.start(async (ctx) => {
  ctx.session.currentNodeId = tree.id!;
  await handleNode(ctx, tree);
});

// Функция обработки узла
async function handleNode(ctx: MyContext, node: Leaf) {
  let text: string | null = null;

  if (node.text)
    text = Array.isArray(node.text) ? node.text.join("\n\n") : node.text;

  if (!node.children?.length) {
    await ctx.reply(text || "Диалог завершён", Markup.removeKeyboard());
    return;
  }

  ctx.session.currentNodeId = node.id!;

  if (node.children[0].type === "text") {
    node.type === "text" && (await ctx.replyWithHTML(text || ""));
    return handleNode(ctx, node.children[0]);
  }

  if (node.children[0].type === "button") {
    await ctx.replyWithHTML(
      text || "",
      Markup.keyboard(
        node.children.map((b) => (Array.isArray(b.text) ? b.text[0] : b.text))
      ).oneTime()
    );
  }
}

// Обработчик текстовых сообщений
bot.on("text", async (ctx) => {
  const currentNode = findNodeById(tree, ctx.session.currentNodeId);

  if (!currentNode?.children) {
    await ctx.reply("Диалог завершён", Markup.removeKeyboard());
    return;
  }

  // Ищем выбранную кнопку среди детей текущего узла
  const selected = currentNode.children.find(
    (child) =>
      child.type === "button" &&
      (Array.isArray(child.text)
        ? child.text.includes(ctx.message.text)
        : child.text === ctx.message.text)
  );

  if (!selected) {
    await ctx.reply("Пожалуйста, используйте кнопки для выбора");
    return;
  }

  // Переходим к выбранному узлу
  await handleNode(ctx, selected);
});

bot.launch(() => console.log("Bot started!"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
