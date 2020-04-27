import _ from "lodash";
import { DateTime } from "luxon";


export interface Fact {
  sum(): number;
  multiply(other: Fact): Fact;
}

export interface ParameterizedFact<T extends Fact> {
  atParameter(fact: T): Fact;
}

export class ScalarFact<T> implements Fact {
  _value: T;

  constructor(val: T) {
    this._value = val;
  }

  get value(): T {
    return this._value;
  }

  multiply(other: Fact): Fact {
    if (other instanceof ScalarFact) {
      if (typeof this.value === 'number') {
        return new ScalarFact(other.value * this.value);
      } else {
        throw Error(`ScalarFact.multiply own scalar unknown ${typeof this.value}`);
      }
    } else {
      throw Error(`ScalarFact.multiply can't operate on ${typeof other}`);
    }
  }

  sum(): number {
    if (typeof this.value === 'number') {
      return this.value;
    } else {
      return 0;
    }
  }
}

type LUTMap = Record<string, number>;
export class LUTFact implements Fact {
  _lut: LUTMap;

  constructor(lut: LUTMap) {
    this._lut = lut;
  }

  get lut(): LUTMap {
    return this._lut;
  }

  sum(): number {
    return _(this.lut).values().sum();
  }

  multiply(other: Fact): Fact {
    if (!(other instanceof LUTFact)) {
      throw Error(`LUTFact.multiply can't operate on ${typeof other}`);
    }

    const newLUT = _(this.lut)
      .toPairs()
      .map(([key, value]) => [key, value * other.lut[key]])
      .fromPairs()
      .value();

    return new LUTFact(newLUT);
  }
}

export class Histogram extends LUTFact {
}

export class PopulationByTimezone extends LUTFact implements ParameterizedFact<ScalarFact<DateTime>> {
  constructor() {
    super({
      "Africa/Abidjan": 32550661,
      "Africa/Accra": 38501336,
      "Africa/Addis_Ababa": 111058544,
      "Africa/Algiers": 47496229,
      "Africa/Asmara": 5653808,
      "Africa/Bamako": 27534075,
      "Africa/Bangui": 8779062,
      "Africa/Banjul": 4349139,
      "Africa/Bissau": 3586579,
      "Africa/Blantyre": 28133577,
      "Africa/Brazzaville": 15152486,
      "Africa/Bujumbura": 19255838,
      "Africa/Cairo": 98398913,
      "Africa/Casablanca": 34890568,
      "Africa/Conakry": 11955022,
      "Africa/Dakar": 12746436,
      "Africa/Dar_es_Salaam": 62731038,
      "Africa/Djibouti": 594789,
      "Africa/Douala": 43653477,
      "Africa/El_Aaiun": 735724,
      "Africa/Freetown": 5516849,
      "Africa/Gaborone": 3667755,
      "Africa/Harare": 17245585,
      "Africa/Johannesburg": 65670520,
      "Africa/Juba": 20396074,
      "Africa/Kampala": 58579298,
      "Africa/Khartoum": 39120526,
      "Africa/Kigali": 7412461,
      "Africa/Kinshasa": 23054967,
      "Africa/Lagos": 220407631,
      "Africa/Libreville": 3539617,
      "Africa/Lome": 5761079,
      "Africa/Luanda": 38121364,
      "Africa/Lubumbashi": 65885745,
      "Africa/Lusaka": 10976919,
      "Africa/Malabo": 1586027,
      "Africa/Maputo": 21931643,
      "Africa/Mogadishu": 11630654,
      "Africa/Monrovia": 2954927,
      "Africa/Nairobi": 41672058,
      "Africa/Ndjamena": 10340893,
      "Africa/Niamey": 17879747,
      "Africa/Nouakchott": 2776450,
      "Africa/Ouagadougou": 17837683,
      "Africa/Porto-Novo": 803061,
      "Africa/Sao_Tome": 216441,
      "Africa/Tripoli": 6930183,
      "Africa/Tunis": 10337351,
      "Africa/Windhoek": 1873044,
      "America/Adak": 595,
      "America/Anchorage": 710615,
      "America/Anguilla": 92162,
      "America/Antigua": 110345,
      "America/Araguaina": 2943996,
      "America/Argentina/Buenos_Aires": 20962721,
      "America/Argentina/Catamarca": 2996064,
      "America/Argentina/Cordoba": 21430177,
      "America/Argentina/Jujuy": 1557281,
      "America/Argentina/La_Rioja": 292812,
      "America/Argentina/Mendoza": 7579946,
      "America/Argentina/Rio_Gallegos": 401207,
      "America/Argentina/Salta": 2736365,
      "America/Argentina/San_Juan": 804567,
      "America/Argentina/San_Luis": 86897,
      "America/Argentina/Ushuaia": 162904,
      "America/Aruba": 154143,
      "America/Asuncion": 4301986,
      "America/Atikokan": 126163,
      "America/Bahia": 19581424,
      "America/Bahia_Banderas": 1249851,
      "America/Barbados": 289431,
      "America/Belem": 9435361,
      "America/Belize": 3035930,
      "America/Blanc-Sablon": 8408,
      "America/Boa_Vista": 745244,
      "America/Bogota": 66674752,
      "America/Boise": 1856063,
      "America/Cambridge_Bay": 7388,
      "America/Campo_Grande": 3972751,
      "America/Cancun": 1976931,
      "America/Caracas": 48638597,
      "America/Cayenne": 404959,
      "America/Cayman": 76392,
      "America/Chicago": 106228574,
      "America/Chihuahua": 2783960,
      "America/Costa_Rica": 5772437,
      "America/Creston": 106784,
      "America/Cuiaba": 4251360,
      "America/Curacao": 182755,
      "America/Danmarkshavn": 0,
      "America/Dawson": 1708,
      "America/Dawson_Creek": 66890,
      "America/Denver": 16492681,
      "America/Detroit": 11105879,
      "America/Dominica": 105073,
      "America/Edmonton": 4511542,
      "America/Eirunepe": 762183,
      "America/El_Salvador": 9092120,
      "America/Fort_Nelson": 5276,
      "America/Fortaleza": 31146623,
      "America/Glace_Bay": 103815,
      "America/Godthab": 56911,
      "America/Goose_Bay": 29302,
      "America/Grand_Turk": 46189,
      "America/Grenada": 112520,
      "America/Guadeloupe": 399050,
      "America/Guatemala": 19849880,
      "America/Guayaquil": 17914600,
      "America/Guyana": 695132,
      "America/Halifax": 1279147,
      "America/Havana": 11192117,
      "America/Hermosillo": 3304941,
      "America/Indiana/Indianapolis": 8690513,
      "America/Indiana/Vevay": 296840,
      "America/Inuvik": 3461,
      "America/Iqaluit": 42815,
      "America/Jamaica": 2783568,
      "America/Juneau": 37428,
      "America/Kentucky/Louisville": 234778,
      "America/Kralendijk": 67923,
      "America/La_Paz": 12889637,
      "America/Lima": 34313625,
      "America/Los_Angeles": 63023859,
      "America/Maceio": 4621629,
      "America/Managua": 7385075,
      "America/Manaus": 4650953,
      "America/Martinique": 474720,
      "America/Matamoros": 429725,
      "America/Mazatlan": 4952473,
      "America/Merida": 3805701,
      "America/Metlakatla": 14204,
      "America/Mexico_City": 97644245,
      "America/Miquelon": 24346,
      "America/Moncton": 666717,
      "America/Monterrey": 14709665,
      "America/Montevideo": 3228693,
      "America/Nassau": 410033,
      "America/New_York": 146495281,
      "America/Nipigon": 5009,
      "America/Nome": 35462,
      "America/Noronha": 3369,
      "America/Panama": 3404803,
      "America/Pangnirtung": 3196,
      "America/Paramaribo": 544626,
      "America/Phoenix": 7170989,
      "America/Port-au-Prince": 16143958,
      "America/Port_of_Spain": 74820,
      "America/Porto_Velho": 847317,
      "America/Puerto_Rico": 3883839,
      "America/Punta_Arenas": 160520,
      "America/Rankin_Inlet": 10584,
      "America/Recife": 4122652,
      "America/Regina": 1132729,
      "America/Rio_Branco": 120810,
      "America/Santarem": 1007262,
      "America/Santiago": 14137150,
      "America/Santo_Domingo": 10579880,
      "America/Sao_Paulo": 126185756,
      "America/Scoresbysund": 0,
      "America/Sitka": 20310,
      "America/St_Johns": 482403,
      "America/St_Lucia": 121670,
      "America/St_Thomas": 149565,
      "America/St_Vincent": 101984,
      "America/Tegucigalpa": 5969552,
      "America/Thule": 830,
      "America/Tijuana": 1822178,
      "America/Toronto": 11553468,
      "America/Vancouver": 1082331,
      "America/Whitehorse": 35474,
      "America/Winnipeg": 1247831,
      "America/Yakutat": 10,
      "America/Yellowknife": 35830,
      "Antarctica/Macquarie": 0,
      "Arctic/Longyearbyen": 3136,
      "Asia/Aden": 31199284,
      "Asia/Almaty": 22784428,
      "Asia/Amman": 16038748,
      "Asia/Anadyr": 48891,
      "Asia/Aqtau": 922970,
      "Asia/Aqtobe": 1505355,
      "Asia/Ashgabat": 17208519,
      "Asia/Atyrau": 1027707,
      "Asia/Baghdad": 49832507,
      "Asia/Bahrain": 3237116,
      "Asia/Baku": 12799088,
      "Asia/Bangkok": 136622222,
      "Asia/Barnaul": 2946238,
      "Asia/Beirut": 19275066,
      "Asia/Bishkek": 9691543,
      "Asia/Brunei": 1006383,
      "Asia/Chita": 1405419,
      "Asia/Choibalsan": 197358,
      "Asia/Colombo": 23151096,
      "Asia/Damascus": 19262777,
      "Asia/Dhaka": 231572690,
      "Asia/Dili": 2682319,
      "Asia/Dubai": 14357584,
      "Asia/Dushanbe": 13284087,
      "Asia/Famagusta": 125460,
      "Asia/Gaza": 2336448,
      "Asia/Hebron": 3100894,
      "Asia/Ho_Chi_Minh": 61997864,
      "Asia/Hong_Kong": 44325305,
      "Asia/Hovd": 455746,
      "Asia/Irkutsk": 3252891,
      "Asia/Jakarta": 228071270,
      "Asia/Jayapura": 12846679,
      "Asia/Kabul": 40869961,
      "Asia/Kamchatka": 281184,
      "Asia/Karachi": 239638111,
      "Asia/Kathmandu": 98387310,
      "Asia/Khandyga": 48026,
      "Asia/Kolkata": 1264712469,
      "Asia/Krasnoyarsk": 3615433,
      "Asia/Kuala_Lumpur": 18699207,
      "Asia/Kuching": 8260270,
      "Asia/Kuwait": 3429677,
      "Asia/Magadan": 132764,
      "Asia/Makassar": 45881365,
      "Asia/Manila": 109993679,
      "Asia/Muscat": 3388009,
      "Asia/Nicosia": 1264463,
      "Asia/Novokuznetsk": 2150154,
      "Asia/Novosibirsk": 2442960,
      "Asia/Omsk": 1647680,
      "Asia/Oral": 799298,
      "Asia/Phnom_Penh": 11604856,
      "Asia/Pontianak": 5755111,
      "Asia/Pyongyang": 34330370,
      "Asia/Qatar": 14661244,
      "Asia/Qostanay": 1001356,
      "Asia/Qyzylorda": 865189,
      "Asia/Riyadh": 34027924,
      "Asia/Sakhalin": 432377,
      "Asia/Samarkand": 9582537,
      "Asia/Seoul": 45962402,
      "Asia/Shanghai": 1400857919,
      "Asia/Srednekolymsk": 31313,
      "Asia/Taipei": 24063352,
      "Asia/Tashkent": 6350444,
      "Asia/Tbilisi": 6169748,
      "Asia/Tehran": 72936566,
      "Asia/Thimphu": 97247,
      "Asia/Tokyo": 128847107,
      "Asia/Tomsk": 797665,
      "Asia/Ulaanbaatar": 2645549,
      "Asia/Ust-Nera": 18292,
      "Asia/Vientiane": 2499025,
      "Asia/Vladivostok": 2422138,
      "Asia/Yakutsk": 1227678,
      "Asia/Yangon": 42979503,
      "Asia/Yekaterinburg": 20448231,
      "Asia/Yerevan": 2741782,
      "Atlantic/Azores": 251500,
      "Atlantic/Bermuda": 66846,
      "Atlantic/Canary": 2474373,
      "Atlantic/Cape_Verde": 577007,
      "Atlantic/Faroe": 53552,
      "Atlantic/Madeira": 275163,
      "Atlantic/Reykjavik": 366695,
      "Atlantic/St_Helena": 4032,
      "Atlantic/Stanley": 2632,
      "Australia/Adelaide": 1615465,
      "Australia/Brisbane": 4416917,
      "Australia/Broken_Hill": 578,
      "Australia/Currie": 1621,
      "Australia/Darwin": 209097,
      "Australia/Eucla": 206,
      "Australia/Hobart": 492539,
      "Australia/Lindeman": 4922,
      "Australia/Lord_Howe": 360,
      "Australia/Melbourne": 5459724,
      "Australia/Perth": 2231407,
      "Australia/Sydney": 7023298,
      "Europe/Amsterdam": 31071280,
      "Europe/Andorra": 306733,
      "Europe/Astrakhan": 624659,
      "Europe/Athens": 14436810,
      "Europe/Belgrade": 12952427,
      "Europe/Berlin": 80499946,
      "Europe/Bratislava": 14174593,
      "Europe/Brussels": 10083499,
      "Europe/Bucharest": 38018060,
      "Europe/Budapest": 7870859,
      "Europe/Chisinau": 2958236,
      "Europe/Copenhagen": 6622590,
      "Europe/Dublin": 6303560,
      "Europe/Guernsey": 175496,
      "Europe/Helsinki": 5993256,
      "Europe/Isle_of_Man": 1471327,
      "Europe/Istanbul": 73278344,
      "Europe/Jersey": 673120,
      "Europe/Kaliningrad": 1754541,
      "Europe/Kiev": 40978412,
      "Europe/Kirov": 2085225,
      "Europe/Lisbon": 12179169,
      "Europe/Ljubljana": 5073408,
      "Europe/London": 65739989,
      "Europe/Madrid": 48152671,
      "Europe/Malta": 441379,
      "Europe/Mariehamn": 32374,
      "Europe/Minsk": 10008490,
      "Europe/Monaco": 1141614,
      "Europe/Moscow": 79030833,
      "Europe/Oslo": 5460865,
      "Europe/Paris": 65274390,
      "Europe/Podgorica": 1589516,
      "Europe/Prague": 10852327,
      "Europe/Riga": 2625811,
      "Europe/Rome": 56811492,
      "Europe/Samara": 3353006,
      "Europe/Sarajevo": 2873268,
      "Europe/Saratov": 2077486,
      "Europe/Simferopol": 1821234,
      "Europe/Skopje": 1361840,
      "Europe/Sofia": 5024855,
      "Europe/Stockholm": 8964330,
      "Europe/Tallinn": 1015841,
      "Europe/Tirane": 1672457,
      "Europe/Ulyanovsk": 859132,
      "Europe/Vienna": 2279126,
      "Europe/Vilnius": 1519163,
      "Europe/Volgograd": 2025302,
      "Europe/Warsaw": 30207127,
      "Europe/Zagreb": 1074239,
      "Europe/Zaporozhye": 1363142,
      "Europe/Zurich": 5418419,
      "Indian/Antananarivo": 27900941,
      "Indian/Christmas": 2069,
      "Indian/Cocos": 554,
      "Indian/Comoro": 892912,
      "Indian/Mahe": 105185,
      "Indian/Maldives": 553504,
      "Indian/Mauritius": 1291247,
      "Indian/Mayotte": 270400,
      "Indian/Reunion": 963133,
      "Pacific/Apia": 200327,
      "Pacific/Auckland": 4465537,
      "Pacific/Bougainville": 334325,
      "Pacific/Chatham": 591,
      "Pacific/Chuuk": 59525,
      "Pacific/Easter": 6702,
      "Pacific/Efate": 304083,
      "Pacific/Enderbury": 17,
      "Pacific/Fakaofo": 1316,
      "Pacific/Fiji": 929571,
      "Pacific/Funafuti": 12235,
      "Pacific/Galapagos": 35006,
      "Pacific/Gambier": 2094,
      "Pacific/Guadalcanal": 650974,
      "Pacific/Guam": 165479,
      "Pacific/Honolulu": 1531406,
      "Pacific/Kiritimati": 11449,
      "Pacific/Kosrae": 5703,
      "Pacific/Kwajalein": 12170,
      "Pacific/Majuro": 43705,
      "Pacific/Marquesas": 8567,
      "Pacific/Midway": 0,
      "Pacific/Nauru": 10242,
      "Pacific/Niue": 1390,
      "Pacific/Norfolk": 2062,
      "Pacific/Noumea": 299295,
      "Pacific/Pago_Pago": 56435,
      "Pacific/Palau": 28446,
      "Pacific/Pitcairn": 90,
      "Pacific/Pohnpei": 38363,
      "Pacific/Port_Moresby": 8663117,
      "Pacific/Rarotonga": 18048,
      "Pacific/Saipan": 41990,
      "Pacific/Tahiti": 300698,
      "Pacific/Tarawa": 123910,
      "Pacific/Tongatapu": 106496,
      "Pacific/Wallis": 10494,
    });
  }

  atParameter(time: ScalarFact<DateTime>): Fact {
    const lutByHour: any = {};
    _.each(this.lut, ((population, timezone) => {
      const hour = time.value.setZone(timezone).hour;
      if (!lutByHour[hour]) {
        lutByHour[hour] = 0;
      }

      lutByHour[hour] += population;
    }));

    return new LUTFact(lutByHour);
  }
}
