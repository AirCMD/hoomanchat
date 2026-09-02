/**
 * Гуменчат — дані для авто-статусів і сімейки
 * Редагуй тільки пули та правила нижче.
 */
(function () {
  "use strict";

  window.HoomenStatusData = {

    /* ========== ГРУПА 1: взаємна пара ========== */
    vira_yang: {
      gender: "female",
      file: "vira-yangol.html",
      statusTimesPerDay: 2,          // день + вечір
      familyPeriod: "day",           // раз на день
      statusPool: [
        "Вірянка, шаную Повітряного Тигра.",
        "Медитую Повітряному Тигру",
        "Вірую",
        "Дякую Тигрові за їжу, шана",
        "Працюю на городі",
        "Консервую їжу, роблю закрутки.",
        "Погодувала свиней та курей"
      ],
      schedule: [
        { time: "09:01", status: "online" },
        { time: "09:15", status: "away" },
        { time: "14:12", status: "online" },
        { time: "14:25", status: "away" },
        { time: "14:52", status: "online" },
        { time: "15:02", status: "away" },
        { time: "15:13", status: "online" },
        { time: "17:01", status: "away" },
        { time: "17:12", status: "online" },
        { time: "22:00", status: "offline" }
      ],
      familyGroup: "pair_vira_oleg"
    },

    oleg_chub: {
      gender: "male",
      file: "oleg-chubrenko.html",
      statusTimesPerDay: 2,
      familyPeriod: "day",
      statusPool: [
        "У пошуках музи!",
        "Шлюбна повинна слідувати мімічним заповідям",
        "Кохна повинна коритися чоловіку",
        "Вірянин, сімейник"
      ],
      schedule: [
        { time: "09:00", status: "online" },
        { time: "10:30", status: "away" },
        { time: "12:12", status: "online" },
        { time: "14:25", status: "away" },
        { time: "14:52", status: "online" },
        { time: "16:02", status: "away" },
        { time: "16:13", status: "online" },
        { time: "17:01", status: "away" },
        { time: "17:12", status: "online" },
        { time: "01:00", status: "offline" }
      ],
      familyGroup: "pair_vira_oleg"
    },

    /* ========== ГРУПА 2: пул 4♀ + 4♂ ========== */
    alina_may: {
      gender: "female",
      file: "alina-may.html",
      statusTimesPerDay: 1,
      familyPeriod: "week",
      statusPool: [
        "Алінка",
        "В салоні краси",
        "В кафе з друменками",
        "На роботі",
        "Роблю манікюр",
        "В перукарні",
        "Робимо селфі",
        "Приймаю ванну, відпочиваю від вас."
      ],
      schedule: [
        { time: "09:01", status: "online" },
        { time: "09:15", status: "away" },
        { time: "14:12", status: "online" },
        { time: "14:25", status: "away" },
        { time: "14:52", status: "online" },
        { time: "15:02", status: "away" },
        { time: "15:13", status: "online" },
        { time: "17:01", status: "away" },
        { time: "17:12", status: "online" },
        { time: "22:00", status: "offline" }
      ],
      familyGroup: "pool_4x4"
    },

    tonya_crzy: {
      gender: "female",
      file: "antonina-crazy.html",
      statusTimesPerDay: 1,
      familyPeriod: "week",
      statusPool: [
        "Вірянка Повітряного Тигра, стюардеса.",
        "В польоті",
        "Відпочиваю, п'ю каву",
        "Нарешті вдома",
        "Невеличка турбулентність"
      ],
      schedule: [
        { time: "09:01", status: "online" },
        { time: "09:15", status: "away" },
        { time: "14:12", status: "online" },
        { time: "14:25", status: "away" },
        { time: "15:02", status: "online" },
        { time: "15:15", status: "away" },
        { time: "16:57", status: "online" },
        { time: "17:01", status: "away" },
        { time: "21:12", status: "online" },
        { time: "22:00", status: "offline" }
      ],
      familyGroup: "pool_4x4"
    },

    maru_candy: {
      gender: "female",
      file: "maruna-candy.html",
      statusTimesPerDay: 1,
      familyPeriod: "week",
      statusPool: [
        "Марина мореплавиця",
        "В морі, далеко від дому",
        "В морі, близько біля дома",
        "В морі, майже вдома",
        "Сьогодні бачили величезного кита",
        "Помітили справжню мордіву!",
        "Корабель потрапив в шторм",
        "Тікаємо від піратів"
      ],
      schedule: [
        { time: "09:01", status: "online" },
        { time: "09:15", status: "away" },
        { time: "14:12", status: "online" },
        { time: "14:25", status: "away" },
        { time: "15:02", status: "online" },
        { time: "15:15", status: "away" },
        { time: "16:57", status: "online" },
        { time: "17:01", status: "away" },
        { time: "21:12", status: "online" },
        { time: "22:00", status: "offline" }
      ],
      familyGroup: "pool_4x4"
    },

    tany_enrg: {
      gender: "female",
      file: "tanya-energy.html",
      statusTimesPerDay: 1,
      familyPeriod: "week",
      statusPool: [
        "Перегони частина мого життя!",
        "На перегонах",
        "Чищу байк",
        "Люблю драйв",
        "П'ю каву"
      ],
      schedule: [
        { time: "09:01", status: "online" },
        { time: "09:15", status: "away" },
        { time: "14:12", status: "online" },
        { time: "14:25", status: "away" },
        { time: "15:02", status: "online" },
        { time: "15:15", status: "away" },
        { time: "16:57", status: "online" },
        { time: "17:01", status: "away" },
        { time: "21:12", status: "online" },
        { time: "22:00", status: "offline" }
      ],
      familyGroup: "pool_4x4"
    },

    nazar_dai: {
      gender: "male",
      file: "nazar-daineka.html",
      statusTimesPerDay: 1,
      familyPeriod: "week",
      statusPool: [
        "Власник цілої бібліотеки книжок, частина з них мені дісталися від пращурів.",
        "Книжки я не продаю",
        "Повертайте книжки після читання",
        "Маю власну бібліотеку книжок"
      ],
      schedule: [
        { time: "09:00", status: "online" },
        { time: "09:30", status: "away" },
        { time: "12:34", status: "online" },
        { time: "15:01", status: "away" },
        { time: "15:32", status: "online" },
        { time: "16:02", status: "away" },
        { time: "16:13", status: "online" },
        { time: "17:01", status: "away" },
        { time: "17:12", status: "online" },
        { time: "01:00", status: "offline" }
      ],
      familyGroup: "pool_4x4"
    },

    borya_den: {
      gender: "male",
      file: "boris-danishenko.html",
      statusTimesPerDay: 1,
      familyPeriod: "week",
      statusPool: [
        "Йо, мала. Що як?",
        "На мутках",
        "З парубчиками за півком",
        "Відваліть",
        "Норм рух",
        "На мутках з малою"
      ],
      schedule: [
        { time: "09:00", status: "online" },
        { time: "10:30", status: "away" },
        { time: "12:12", status: "online" },
        { time: "14:25", status: "away" },
        { time: "14:52", status: "online" },
        { time: "16:02", status: "away" },
        { time: "16:13", status: "online" },
        { time: "17:01", status: "away" },
        { time: "17:12", status: "online" },
        { time: "01:00", status: "offline" }
      ],
      familyGroup: "pool_4x4"
    },

    dmytro_pinchuk: {
      gender: "male",
      file: "dmytro-pinchuk.html",
      statusTimesPerDay: 1,
      familyPeriod: "week",
      statusPool: [
        "Простий, щирий хлопчина.",
        "Працюю",
        "Дуже зайнятий",
        "Не турбуйте!",
        "Зайнято п'ю чай"
      ],
      schedule: [
        { time: "09:01", status: "online" },
        { time: "10:10", status: "away" },
        { time: "13:12", status: "online" },
        { time: "13:35", status: "away" },
        { time: "16:32", status: "online" },
        { time: "16:59", status: "away" },
        { time: "18:50", status: "online" },
        { time: "19:01", status: "away" },
        { time: "20:12", status: "online" },
        { time: "00:00", status: "offline" }
      ],
      familyGroup: "pool_4x4"
    },

    zakhar_gak: {
      gender: "male",
      file: "zakhar-gak.html",
      statusTimesPerDay: 1,
      familyPeriod: "week",
      statusPool: [
        "Дівки, ви тут?",
        "Шукаю себе",
        "Тимчасово не у відпустці",
        "Все ще на роботі, а міг би відпочивати",
        "На прогулянці з собакою Фраєю"
      ],
      schedule: [
        { time: "09:00", status: "online" },
        { time: "12:02", status: "away" },
        { time: "12:34", status: "online" },
        { time: "15:01", status: "away" },
        { time: "15:32", status: "online" },
        { time: "16:02", status: "away" },
        { time: "16:13", status: "online" },
        { time: "17:01", status: "away" },
        { time: "17:12", status: "online" },
        { time: "01:00", status: "offline" }
      ],
      familyGroup: "pool_4x4"
    },

    /* ========== ГРУПА 3: jane_dust ========== */
    jane_dust: {
      gender: "female",
      file: "jane-dust.html",
      statusTimesPerDay: 2,
      familyPeriod: "day",
      statusPool: [
        "Джейн з міста Сумне.",
        "Граю в тама-чі",
        "Поїхала на пошту",
        "Приїхала з пошти додому",
        "На роботі в бібліотеці",
        "П'ю каву в кав'ярні Signal",
        "Годую піцюків",
        "Прогулююсь в закинутій місцині",
        "На вечірці",
        "Сьогодні вдома, у кімнаті під ковдрою граю в тама-чі",
        "Знайшла тама-чі в кущах",
        "Знайшла тама-чі біля мистецької школи"
      ],
      schedule: [
        { time: "12:01", status: "online" },
        { time: "12:15", status: "away" },
        { time: "14:12", status: "online" },
        { time: "14:25", status: "away" },
        { time: "15:02", status: "online" },
        { time: "15:15", status: "away" },
        { time: "16:57", status: "online" },
        { time: "17:01", status: "away" },
        { time: "21:12", status: "online" },
        { time: "07:00", status: "offline" }
      ],
      familyGroup: "jane_solo"
    }
  };

  /* Базовий URL профілів (для partnerUrl) */
  window.HoomenStatusData.profileBaseUrl = "https://aircmd.github.io/hoomanchat/profiles/";

  /* Списки для групової логіки */
  window.HoomenStatusData.poolWomen = ["alina_may", "tonya_crzy", "maru_candy", "tany_enrg"];
  window.HoomenStatusData.poolMen   = ["nazar_dai", "borya_den", "dmytro_pinchuk", "zakhar_gak"];

})();
