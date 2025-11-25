// Sri Lanka location data: Provinces -> Districts -> Cities with Postal Codes
// Complete data source: https://nation.lk/postalcode/

export interface City {
  name: string;
  postalCode: string;
}

export interface District {
  name: string;
  value: string;
  cities: City[];
}

export interface Province {
  name: string;
  value: string;
  districts: District[];
}

export const sriLankaLocations: Province[] = [
  {
    name: "Western",
    value: "WESTERN",
    districts: [
      {
        name: "Colombo",
        value: "COLOMBO",
        cities: [
          { name: "Colombo 1", postalCode: "00100" },
          { name: "Colombo 2 (Slave Island)", postalCode: "00200" },
          { name: "Colombo 3", postalCode: "00300" },
          { name: "Colombo 4", postalCode: "00400" },
          { name: "Colombo 5", postalCode: "00500" },
          { name: "Colombo 6", postalCode: "00600" },
          { name: "Colombo 7", postalCode: "00700" },
          { name: "Colombo 8 (Borella)", postalCode: "00800" },
          { name: "Colombo 9", postalCode: "00900" },
          { name: "Colombo 10", postalCode: "01000" },
          { name: "Colombo 11", postalCode: "01100" },
          { name: "Colombo 12", postalCode: "01200" },
          { name: "Colombo 13", postalCode: "01300" },
          { name: "Colombo 14", postalCode: "01400" },
          { name: "Colombo 15", postalCode: "01500" },
          { name: "Akarawita", postalCode: "10732" },
          { name: "Angamuwa", postalCode: "10150" },
          { name: "Angoda", postalCode: "10620" },
          { name: "Athurugiriya", postalCode: "10150" },
          { name: "Avissawella", postalCode: "10700" },
          { name: "Batawala", postalCode: "10513" },
          { name: "Battaramulla", postalCode: "10120" },
          { name: "Batugampola", postalCode: "10526" },
          { name: "Bope", postalCode: "10522" },
          { name: "Boralesgamuwa", postalCode: "10290" },
          { name: "Dedigamuwa", postalCode: "10656" },
          { name: "Dehiwala", postalCode: "10350" },
          { name: "Deltara", postalCode: "10302" },
          { name: "Habarakada", postalCode: "10204" },
          { name: "Handapangoda", postalCode: "10524" },
          { name: "Hanwella", postalCode: "10650" },
          { name: "Hewainna", postalCode: "10714" },
          { name: "Hiripitya", postalCode: "10232" },
          { name: "Hokandara", postalCode: "10118" },
          { name: "Homagama", postalCode: "10200" },
          { name: "Horagala", postalCode: "10502" },
          { name: "Kaduwela", postalCode: "10640" },
          { name: "Kahawala", postalCode: "10508" },
          { name: "Kalatuwawa", postalCode: "10718" },
          { name: "Kesbewa", postalCode: "10260" },
          { name: "Kosgama", postalCode: "10730" },
          { name: "Kotte", postalCode: "10100" },
          { name: "Madapatha", postalCode: "10306" },
          { name: "Maharagama", postalCode: "10280" },
          { name: "Malabe", postalCode: "10115" },
          { name: "Meegoda", postalCode: "10504" },
          { name: "Mount Lavinia", postalCode: "10370" },
          { name: "Nugegoda", postalCode: "10250" },
          { name: "Padukka", postalCode: "10500" },
          { name: "Pannipitiya", postalCode: "10230" },
          { name: "Piliyandala", postalCode: "10300" },
          { name: "Pitipana Homagama", postalCode: "10206" },
          { name: "Polgasowita", postalCode: "10320" },
          { name: "Puwakpitiya", postalCode: "10712" },
          { name: "Rajagiriya", postalCode: "10107" },
          { name: "Ranala", postalCode: "10654" },
          { name: "Seethawaka", postalCode: "10730" },
          { name: "Siddamulla", postalCode: "10304" },
          { name: "Sri Jayawardenapura", postalCode: "10100" },
          { name: "Thalawathugoda", postalCode: "10116" },
          { name: "Tummodara", postalCode: "10682" },
          { name: "Waga", postalCode: "10680" },
          { name: "Watareka", postalCode: "10511" },
        ]
      },
      {
        name: "Gampaha",
        value: "GAMPAHA",
        cities: [
          { name: "Gampaha", postalCode: "11000" },
          { name: "Negombo", postalCode: "11500" },
          { name: "Katunayake", postalCode: "11450" },
          { name: "Ja-Ela", postalCode: "11350" },
          { name: "Wattala", postalCode: "11300" },
          { name: "Kelaniya", postalCode: "11600" },
          { name: "Peliyagoda", postalCode: "11830" },
          { name: "Minuwangoda", postalCode: "11130" },
          { name: "Kadawatha", postalCode: "11850" },
          { name: "Ragama", postalCode: "11010" },
          { name: "Veyangoda", postalCode: "11100" },
          { name: "Kiribathgoda", postalCode: "11600" },
          { name: "Mirigama", postalCode: "11200" },
          { name: "Divulapitiya", postalCode: "11250" },
          { name: "Nittambuwa", postalCode: "11880" },
          { name: "Attanagalla", postalCode: "11120" },
          { name: "Ganemulla", postalCode: "11020" },
          { name: "Dompe", postalCode: "11680" },
          { name: "Biyagama", postalCode: "11650" },
          { name: "Pugoda", postalCode: "10660" },
          { name: "Dankotuwa", postalCode: "11130" },
          { name: "Wennappuwa", postalCode: "11170" },
          { name: "Marawila", postalCode: "11210" },
        ]
      },
      {
        name: "Kalutara",
        value: "KALUTARA",
        cities: [
          { name: "Kalutara", postalCode: "12000" },
          { name: "Panadura", postalCode: "12500" },
          { name: "Horana", postalCode: "12400" },
          { name: "Beruwala", postalCode: "12070" },
          { name: "Aluthgama", postalCode: "12080" },
          { name: "Matugama", postalCode: "12100" },
          { name: "Bandaragama", postalCode: "12530" },
          { name: "Wadduwa", postalCode: "12560" },
          { name: "Ingiriya", postalCode: "12440" },
          { name: "Bulathsinhala", postalCode: "12300" },
          { name: "Palindanuwara", postalCode: "12030" },
          { name: "Agalawatta", postalCode: "12200" },
          { name: "Dodangoda", postalCode: "12070" },
          { name: "Millaniya", postalCode: "12530" },
          { name: "Moratuwa", postalCode: "10400" },
        ]
      }
    ]
  },
  {
    name: "Central",
    value: "CENTRAL",
    districts: [
      {
        name: "Kandy",
        value: "KANDY",
        cities: [
          { name: "Kandy", postalCode: "20000" },
          { name: "Peradeniya", postalCode: "20400" },
          { name: "Gampola", postalCode: "20500" },
          { name: "Katugastota", postalCode: "20800" },
          { name: "Akurana", postalCode: "20850" },
          { name: "Nawalapitiya", postalCode: "20650" },
          { name: "Wattegama", postalCode: "20810" },
          { name: "Harispattuwa", postalCode: "20270" },
          { name: "Kadugannawa", postalCode: "20300" },
          { name: "Galagedara", postalCode: "20200" },
          { name: "Teldeniya", postalCode: "20900" },
          { name: "Madawala Bazaar", postalCode: "20280" },
          { name: "Pilimathalawa", postalCode: "20450" },
          { name: "Daulagala", postalCode: "20532" },
          { name: "Gelioya", postalCode: "20676" },
          { name: "Ududumbara", postalCode: "20950" },
          { name: "Kundasale", postalCode: "20168" },
        ]
      },
      {
        name: "Matale",
        value: "MATALE",
        cities: [
          { name: "Matale", postalCode: "21000" },
          { name: "Dambulla", postalCode: "21100" },
          { name: "Galewela", postalCode: "21200" },
          { name: "Ukuwela", postalCode: "21300" },
          { name: "Rattota", postalCode: "21400" },
          { name: "Yatawatta", postalCode: "21500" },
          { name: "Naula", postalCode: "21060" },
          { name: "Pallepola", postalCode: "21020" },
          { name: "Laggala", postalCode: "21530" },
          { name: "Wilgamuwa", postalCode: "21550" },
        ]
      },
      {
        name: "Nuwara Eliya",
        value: "NUWARA_ELIYA",
        cities: [
          { name: "Nuwara Eliya", postalCode: "22200" },
          { name: "Hatton", postalCode: "22000" },
          { name: "Talawakelle", postalCode: "22100" },
          { name: "Nanu Oya", postalCode: "22150" },
          { name: "Ginigathena", postalCode: "22040" },
          { name: "Walapane", postalCode: "22296" },
          { name: "Kotmale", postalCode: "22350" },
          { name: "Bogawanthalawa", postalCode: "22010" },
          { name: "Agarapathana", postalCode: "22080" },
          { name: "Haggala", postalCode: "22220" },
          { name: "Ramboda", postalCode: "22165" },
          { name: "Lindula", postalCode: "22060" },
        ]
      }
    ]
  },
  {
    name: "Southern",
    value: "SOUTHERN",
    districts: [
      {
        name: "Galle",
        value: "GALLE",
        cities: [
          { name: "Galle", postalCode: "80000" },
          { name: "Hikkaduwa", postalCode: "80240" },
          { name: "Ambalangoda", postalCode: "80300" },
          { name: "Elpitiya", postalCode: "80400" },
          { name: "Bentota", postalCode: "80500" },
          { name: "Baddegama", postalCode: "80200" },
          { name: "Habaraduwa", postalCode: "80630" },
          { name: "Karapitiya", postalCode: "80100" },
          { name: "Unawatuna", postalCode: "80600" },
          { name: "Ahangama", postalCode: "80650" },
          { name: "Koggala", postalCode: "80630" },
          { name: "Balapitiya", postalCode: "80550" },
        ]
      },
      {
        name: "Matara",
        value: "MATARA",
        cities: [
          { name: "Matara", postalCode: "81000" },
          { name: "Weligama", postalCode: "81700" },
          { name: "Mirissa", postalCode: "81740" },
          { name: "Akuressa", postalCode: "81400" },
          { name: "Deniyaya", postalCode: "81500" },
          { name: "Hakmana", postalCode: "81200" },
          { name: "Kamburugamuwa", postalCode: "81100" },
          { name: "Dikwella", postalCode: "81200" },
          { name: "Kekanadura", postalCode: "81110" },
          { name: "Pitabeddara", postalCode: "81230" },
        ]
      },
      {
        name: "Hambantota",
        value: "HAMBANTOTA",
        cities: [
          { name: "Hambantota", postalCode: "82000" },
          { name: "Tangalle", postalCode: "82200" },
          { name: "Tissamaharama", postalCode: "82600" },
          { name: "Ambalantota", postalCode: "82100" },
          { name: "Beliatta", postalCode: "82400" },
          { name: "Weeraketiya", postalCode: "82500" },
          { name: "Katuwana", postalCode: "82550" },
          { name: "Middeniya", postalCode: "82650" },
          { name: "Kirinda", postalCode: "82610" },
        ]
      }
    ]
  },
  {
    name: "Northern",
    value: "NORTHERN",
    districts: [
      {
        name: "Jaffna",
        value: "JAFFNA",
        cities: [
          { name: "Jaffna", postalCode: "40000" },
          { name: "Nallur", postalCode: "40100" },
          { name: "Chavakachcheri", postalCode: "40300" },
          { name: "Point Pedro", postalCode: "40500" },
          { name: "Karainagar", postalCode: "40420" },
          { name: "Chankanai", postalCode: "40450" },
          { name: "Tellippalai", postalCode: "40200" },
          { name: "Kopay", postalCode: "40130" },
          { name: "Manipay", postalCode: "40170" },
          { name: "Valvettithurai", postalCode: "40260" },
        ]
      },
      {
        name: "Kilinochchi",
        value: "KILINOCHCHI",
        cities: [
          { name: "Kilinochchi", postalCode: "44000" },
          { name: "Pallai", postalCode: "44110" },
          { name: "Paranthan", postalCode: "44210" },
          { name: "Poonakary", postalCode: "44312" },
        ]
      },
      {
        name: "Mannar",
        value: "MANNAR",
        cities: [
          { name: "Mannar", postalCode: "41000" },
          { name: "Nanattan", postalCode: "41350" },
          { name: "Madhu", postalCode: "41313" },
          { name: "Murunkan", postalCode: "41322" },
        ]
      },
      {
        name: "Mullaitivu",
        value: "MULLAITIVU",
        cities: [
          { name: "Mullaitivu", postalCode: "42000" },
          { name: "Oddusuddan", postalCode: "42230" },
          { name: "Puthukkudiyiruppu", postalCode: "42260" },
          { name: "Maritimepattu", postalCode: "42150" },
        ]
      },
      {
        name: "Vavuniya",
        value: "VAVUNIYA",
        cities: [
          { name: "Vavuniya", postalCode: "43000" },
          { name: "Vavuniya South", postalCode: "43006" },
          { name: "Cheddikulam", postalCode: "43312" },
          { name: "Omanthai", postalCode: "43200" },
        ]
      }
    ]
  },
  {
    name: "Eastern",
    value: "EASTERN",
    districts: [
      {
        name: "Trincomalee",
        value: "TRINCOMALEE",
        cities: [
          { name: "Trincomalee", postalCode: "31000" },
          { name: "Kinniya", postalCode: "31100" },
          { name: "Mutur", postalCode: "31200" },
          { name: "Kantalai", postalCode: "31300" },
          { name: "Kuchchaveli", postalCode: "31014" },
          { name: "Nilaveli", postalCode: "31010" },
          { name: "Gomarankadawala", postalCode: "31026" },
        ]
      },
      {
        name: "Batticaloa",
        value: "BATTICALOA",
        cities: [
          { name: "Batticaloa", postalCode: "30000" },
          { name: "Kattankudy", postalCode: "30100" },
          { name: "Eravur", postalCode: "30350" },
          { name: "Kaluwanchikudy", postalCode: "30200" },
          { name: "Valachchenai", postalCode: "30400" },
          { name: "Chenkalady", postalCode: "30350" },
        ]
      },
      {
        name: "Ampara",
        value: "AMPARA",
        cities: [
          { name: "Ampara", postalCode: "32000" },
          { name: "Kalmunai", postalCode: "32300" },
          { name: "Akkaraipattu", postalCode: "32400" },
          { name: "Sainthamaruthu", postalCode: "32280" },
          { name: "Sammanthurai", postalCode: "32200" },
          { name: "Pottuvil", postalCode: "32500" },
          { name: "Uhana", postalCode: "32100" },
          { name: "Mahaoya", postalCode: "32060" },
        ]
      }
    ]
  },
  {
    name: "North Western",
    value: "NORTH_WESTERN",
    districts: [
      {
        name: "Kurunegala",
        value: "KURUNEGALA",
        cities: [
          { name: "Kurunegala", postalCode: "60000" },
          { name: "Kuliyapitiya", postalCode: "60200" },
          { name: "Narammala", postalCode: "60100" },
          { name: "Wariyapola", postalCode: "60400" },
          { name: "Pannala", postalCode: "61100" },
          { name: "Maho", postalCode: "60600" },
          { name: "Giriulla", postalCode: "60140" },
          { name: "Polgahawela", postalCode: "60300" },
          { name: "Nikaweratiya", postalCode: "60470" },
          { name: "Ibbagamuwa", postalCode: "60500" },
          { name: "Alawwa", postalCode: "60280" },
          { name: "Bingiriya", postalCode: "60450" },
          { name: "Ridigama", postalCode: "60030" },
        ]
      },
      {
        name: "Puttalam",
        value: "PUTTALAM",
        cities: [
          { name: "Puttalam", postalCode: "61300" },
          { name: "Chilaw", postalCode: "61000" },
          { name: "Wennappuwa", postalCode: "61170" },
          { name: "Dankotuwa", postalCode: "61130" },
          { name: "Marawila", postalCode: "61210" },
          { name: "Anamaduwa", postalCode: "61500" },
          { name: "Nattandiya", postalCode: "61190" },
          { name: "Madampe", postalCode: "61230" },
          { name: "Pallama", postalCode: "61040" },
          { name: "Mundel", postalCode: "61250" },
        ]
      }
    ]
  },
  {
    name: "North Central",
    value: "NORTH_CENTRAL",
    districts: [
      {
        name: "Anuradhapura",
        value: "ANURADHAPURA",
        cities: [
          { name: "Anuradhapura", postalCode: "50000" },
          { name: "Kekirawa", postalCode: "50100" },
          { name: "Medawachchiya", postalCode: "50500" },
          { name: "Tambuttegama", postalCode: "50240" },
          { name: "Eppawala", postalCode: "50150" },
          { name: "Mihintale", postalCode: "50300" },
          { name: "Nochchiyagama", postalCode: "50550" },
          { name: "Galenbindunuwewa", postalCode: "50600" },
          { name: "Talawa", postalCode: "50230" },
        ]
      },
      {
        name: "Polonnaruwa",
        value: "POLONNARUWA",
        cities: [
          { name: "Polonnaruwa", postalCode: "51000" },
          { name: "Hingurakgoda", postalCode: "51400" },
          { name: "Medirigiriya", postalCode: "51500" },
          { name: "Dimbulagala", postalCode: "51160" },
          { name: "Welikanda", postalCode: "51070" },
          { name: "Aralaganwila", postalCode: "51050" },
          { name: "Minneriya", postalCode: "51410" },
        ]
      }
    ]
  },
  {
    name: "Uva",
    value: "UVA",
    districts: [
      {
        name: "Badulla",
        value: "BADULLA",
        cities: [
          { name: "Badulla", postalCode: "90000" },
          { name: "Bandarawela", postalCode: "90100" },
          { name: "Haputale", postalCode: "90160" },
          { name: "Welimada", postalCode: "90200" },
          { name: "Mahiyanganaya", postalCode: "90700" },
          { name: "Hali Ela", postalCode: "90060" },
          { name: "Ella", postalCode: "90090" },
          { name: "Diyatalawa", postalCode: "90150" },
          { name: "Passara", postalCode: "90500" },
          { name: "Lunugala", postalCode: "90530" },
        ]
      },
      {
        name: "Monaragala",
        value: "MONARAGALA",
        cities: [
          { name: "Monaragala", postalCode: "91000" },
          { name: "Wellawaya", postalCode: "91200" },
          { name: "Bibile", postalCode: "91500" },
          { name: "Buttala", postalCode: "91100" },
          { name: "Kataragama", postalCode: "91400" },
          { name: "Siyambalanduwa", postalCode: "91580" },
          { name: "Thanamalwila", postalCode: "91300" },
        ]
      }
    ]
  },
  {
    name: "Sabaragamuwa",
    value: "SABARAGAMUWA",
    districts: [
      {
        name: "Ratnapura",
        value: "RATNAPURA",
        cities: [
          { name: "Ratnapura", postalCode: "70000" },
          { name: "Embilipitiya", postalCode: "70200" },
          { name: "Balangoda", postalCode: "70100" },
          { name: "Pelmadulla", postalCode: "70070" },
          { name: "Eheliyagoda", postalCode: "70600" },
          { name: "Kahawatta", postalCode: "70150" },
          { name: "Kuruwita", postalCode: "70650" },
          { name: "Kiriella", postalCode: "70480" },
          { name: "Godakawela", postalCode: "70160" },
          { name: "Kolonna", postalCode: "70620" },
        ]
      },
      {
        name: "Kegalle",
        value: "KEGALLE",
        cities: [
          { name: "Kegalle", postalCode: "71000" },
          { name: "Mawanella", postalCode: "71500" },
          { name: "Warakapola", postalCode: "71600" },
          { name: "Rambukkana", postalCode: "71100" },
          { name: "Galigamuwa", postalCode: "71350" },
          { name: "Dehiowita", postalCode: "71200" },
          { name: "Kitulgala", postalCode: "71720" },
          { name: "Aranayaka", postalCode: "71540" },
          { name: "Yatiyantota", postalCode: "71700" },
          { name: "Ruwanwella", postalCode: "71300" },
        ]
      }
    ]
  }
];
