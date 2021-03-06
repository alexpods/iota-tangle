import { TRITS, TRYTES, trit } from "iota-ternary"
import { TransactionData, Transaction } from "../src/transaction"

const randomstring = require("randomstring")
const Curl = require("iota.lib.js/lib/crypto/curl/curl")

export function calculateHash(trits: trit[]): trit[] {
  const hash = new Array<trit>(243)
  const curl = new Curl()

  curl.initialize()
  curl.absorb(trits, 0, trits.length)
  curl.squeeze(hash, 0, hash.length)

  return hash
}

export function generateBytes(count = 1604): Buffer {
  const bytes = Buffer.alloc(count)

  for (let i = 0; i < count; ++i) {
    bytes.writeInt8(-121 + Math.floor(243*Math.random()), i)
  }

  return bytes
}

export function generateTrytes(count = 2673): string {
  const trytesArray = new Array(count)

  for (let i = 0; i < count; ++i) {
    trytesArray[i] = TRYTES[Math.floor(Math.random()*27)]
  }

  return trytesArray.join('')
}

export function generateTrits(count = 8019): trit[] {
  const trits = new Array(count)

  for (let i = 0; i < count; ++i) {
    trits[i] = TRITS[Math.floor(Math.random()*3)]
  }

  return trits
}

export function generateTransactionData(params = {}): TransactionData {
  return Object.assign({
    message:      randomstring.generate({ length: 100, charset: TRYTES }),
    address:      randomstring.generate({ length: 81, charset: TRYTES }),
    value:        Math.floor(Math.random()*(Transaction.SUPPLY + 1)),
    obsoleteTag:  randomstring.generate({ length: 27, charset: TRYTES }),
    timestamp:    Math.floor(Date.now()/1000),
    currentIndex: Math.floor(Math.random()*10),
    lastIndex:    10 + Math.floor(Math.random()*10),
    bundle:       randomstring.generate({ length: 81, charset: TRYTES }),
    trunk:        randomstring.generate({ length: 81, charset: TRYTES }),
    branch:       randomstring.generate({ length: 81, charset: TRYTES }),
    tag:          randomstring.generate({ length: 27, charset: TRYTES }),
    attachmentTimestamp:           Math.floor(Date.now()/1000),
    attachmentTimestampLowerBound: Math.floor(Date.now()/1000),
    attachmentTimestampUpperBound: Math.floor(Date.now()/1000),
    nonce: randomstring.generate({ length: 27, charset: TRYTES })
  }, params)
}


export const BUNDLE_TRANSACTIONS = {
  "TDFXQNGTLMCZLJZDCZAQTTCUONZ9MBVWCECZPQHOYMLMLNPQZGZGTOJGQVWHCI9YRVJCEMQAXNFVA9999": {
    message: "GACDZCTCEAADTCGDGDPCVCTCGA9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999",
    address: "FKIXXQEHPUMCAXEKPUERAYTZBFLNT9FBSZGKZSIYLMSFVLAJRFLPFPWOTCZYCMM9NFLZKISDEUFMSTNDZ",
    value:    1,
    obsoleteTag: "CCTCBDBDBDEASCTCEAHDPCVCGA9",
    timestamp:   1513808981,
    currentIndex: 0,
    lastIndex: 2,
    bundle: "B9EVNFDKAUNZCXYFSBVKWPDYVKIKFFXKBGZLOHIBUZNPVQQLQVKAUFKWMEEAZKHTHJ9WKWAC9YECHDTEC",
    trunk: "CQDPNDQOOZEZUZXTQBUISEYWDIHYRQQEFEFTBDDSUJUIKDDYRUZQLXGYRCLCVJCWDK9EQOUBUL9X99999",
    branch: "XIWXXIUQ9DYTWDAELVPGNYNKTHOSFFUHBIZ9RRQWPZCAZETAHXIWYPSEGZGABCMPOHLUVIXZJMXTZ9999",
    tag: "GATCBDBDBDEASCTCEAHDPCVCGA9",
    attachmentTimestamp: 0,
    attachmentTimestampLowerBound: 0,
    attachmentTimestampUpperBound: 0,
    nonce: "BA99999999XFB99999999999999",
  },
  "CQDPNDQOOZEZUZXTQBUISEYWDIHYRQQEFEFTBDDSUJUIKDDYRUZQLXGYRCLCVJCWDK9EQOUBUL9X99999": {
    message: "RHAZUQLZEU9XTWQVTCXFBR9RJYEIIEOEEUGLZKIBDJESEWEJMGJKYVYOPCSJCEBIGHGVXWNYFDCOYYTADIRX9BJOCTYGLYACDZHHMVFO9WCA99WMMLLPHBFGNQ9KS9RSRZOJOGDTVCPACNF9LEXZVGMOYJPADNZTZZDFMDIJQNAWKAIEJWWDHMLWJMNUIWAHFVBKGKE9BEQCFWM9KZWCODSNTNELDBHJYHCOG9PXBTODG9SAOYALTGVKQEVMCJRMNRHLSOAGJEKMIREAPDYACKCJSGUZ9DKGHCYFZHNIOZJDGYBYETJIVXCQ9TR9WRQHPFRZNBBNUKSGHSJOZWXLOIZEXQAXCHSRUQS9QSKNVCJUIOYDZGRZVZSTSICKPUPBYJUPAJESHMRTJYYMSDJR9ZSDQPZCLUHHTJXZEPFTKX9GSLBJM9HARBRYB9DIZDGBE99GLTGFGFWWZINNXMUOWETNYTO9KODBIKDQUDVAWBQUIJQXAZEGCMYTHJCUGFJNJWXZPSUVAYDFREGQSGMZMAVRIXRQOWNBDMMVQMQUPLEALAMVPYY9BUCUTZACJWAXWOLLCA9QDHIMDNNPPCVTXE9LUFKVSPCMABFTPQGPLZZDLEGKWCIENKNRFVFCWSFXKHOWXUZWOOYKVXELALOQUSSPSDRFELZY9GYH9O9VGBMGSFUPTOVSSPINGSOQRUQIVYNFQRZLE9IGYQHPW9GDIQPYCTRN9CJKAGMWVUAXMDRYPHGBECT9HUXWLSCJTXYUZPMSUIUFFP9BQLQOGCXPHJQTBWTBAIBCRNHQUHIKWCOHTVUKVDLMVJQDFDJLLTEMNDQVDVBYHRLWCJBWCBFBDLEHZYAZKO9IQWTHKHHPOCGMSQVNTSQQVXBEA9AQVOVCQFO9WOOPIVAAOSMVJPSHRFHBYJVIJYTBJRQRQFCLOCDCRNDDLTKCXZSGEMSHNQTNNUGHV9YETFFBVVFSFNQJDAZEUSVKRRCELCOUBG9WPXXMOBGNENNTZJGFAFCFLH9EZPYPEGPAY9YHRETOZNSPSWVAMNBA9GZRSYEWVIRLCP9NLQNAWJGTIXA9SVKNGERFPCOXHBAOCGJUYVMJOVOPXUHAUQM9EBH9VWDJHRCYLSX9DWJIIK9AUXVRBXULDNOYQQYK9KFFAFJFNJ9EDSPFJFKJLETPQJTQKZZPQEYZGAXYJGRYIIBZIQZAU9HFZHWEXKYYWMVCQJNYEJGCMVLYOXNDDMVKPWYMJCOYFDXRJMCJSWZKDRBBKHFWUBVQWLLBALXNA99RJYNNNJCYDZRGWGLVVEQGJNDJQLPHJWUCJSZUDPRQ9SQXANMAYAYHSVXYWCOGTMUOWQGQHFPOLGPBQOWEUMTPKWXWZ9EGVGWCJ9JWGLLIWWWPKN9GOGJDWTMFZCLHPLGILXUHHMAYKJLMQCXHKFSESTTYGVBYNJMTQHXNG9YYWYYJEJPXFUYS9UXJALFOLQTORENKYVTZVKUZ9GBESIQIV9PBMEXOVARLVDKWBAQN9FBBHAWEDREFWFCA9XAZONVVKEUIPKLLDEKYXIXFPOESUINSYYD9HNADIKREVMSXCIHUX9UFAVUUOXQNVPPAMVUC9OGRURTSYMXWTINFAAWXGLLWHKGDCVFL9AXBJSVOMBYBMXTBMAAFDHFUVJGMKHJHRRELJVOGO9DFYHNPCN9JLRISWQXCY9YOUUFCACJJJXEVMLWUBOBCDIKMRYCBXEPQFGVTGH9IPREIXGJ9HAFYHKNMNUPHLRFDFRHKQZNXVLCNPDYS9VJUUJFOAXJWKOO9KDWKCRDGQRUABNJAEEZDYGPBMCRIUOFSZZG9GGEOXJGJCJFIKOOSAAZPAMWGMBXXHEBOTCYQXR9NLXAZTO9VDXTVECQTJQWRDSWJKFXKWRZMDTZVVFVUSQSKZAEAWIXGYPGTPOHDUZFRARF9KKCMIHYUWPHEHTGVYTTYJFKIMLTBTYQAJHBCCEJHFEVVK9IXOGRW99SEBTAFCUIPVDYORHPXTKLTEMSIWBCFNAOJY9SPPLIAGXAWIXNBDLZCXN9KDLS9ZWFYPNALMHDFDU9EHGA9FASFMVKDEZEGIFNUYATOXUDPGYWONINYYZAUXFZWGGZNODUEDLTYJYJKNPDYOIAOZVCISKHJVATGBSWP9VAXRTVACJBWDOOBQSHDBY9BO9D",
    address: "GDHPTALLKXGXOQXOFNWFYTDTGW9QFWZLSEH9SPZISBSQ99QJOXDVHDRJKVQD9PBDOFFDTYYZLOGUTFAN9",
    value:    -1,
    obsoleteTag: "GATCBDBDBDEASCTCEAHDPCVCGA9",
    timestamp:   1513808981,
    currentIndex: 1,
    lastIndex: 2,
    bundle: "B9EVNFDKAUNZCXYFSBVKWPDYVKIKFFXKBGZLOHIBUZNPVQQLQVKAUFKWMEEAZKHTHJ9WKWAC9YECHDTEC",
    trunk: "BHEWKNEXOUCUKQUQATMUHLLMNCCCKOGPUN9GZTD9SWBYNZVBXBFKLKYAUFYLCRVUBIWPVNLNZYQCZ9999",
    branch: "XIWXXIUQ9DYTWDAELVPGNYNKTHOSFFUHBIZ9RRQWPZCAZETAHXIWYPSEGZGABCMPOHLUVIXZJMXTZ9999",
    tag: "GATCBDBDBDEASCTCEAHDPCVCGA9",
    attachmentTimestamp: 0,
    attachmentTimestampLowerBound: 0,
    attachmentTimestampUpperBound: 0,
    nonce: "HJB99999999SA99999999999999",
  },
  "BHEWKNEXOUCUKQUQATMUHLLMNCCCKOGPUN9GZTD9SWBYNZVBXBFKLKYAUFYLCRVUBIWPVNLNZYQCZ9999": {
    message: "ERXAQOQAWCTFBGKMGHQRGVFYIAZNBMJCIEQYNQVKVPICMSOGEMFMFJTPCBFXEMOMBWC9NRZEQMYNNNYWAGKKQZNAUULKQCSSWZLGJIWHXJESLPYHQPFEISMJEL9XDDXYT9OECKKZWHUMACVXTLSPWUHQFFRYLEPQMDNCDDHQ9RUOQVFILOUOIEWDHE9RNDXPVDMATQBMCYHTNLEEBQJYMZJBFIVRZTQDYUIDVAIYXZBROVBYQDBUVTFXEWSRQCXDKNAYVGSQIXHKGIKYWUTWRWGNDBCGFMTUF9HB9FPFQFFYNJIVALYBSLFOURPNALLLHZCZJS9X99ULPKJWLJEUUHZOCQNIZGASPWEPEXXE9SSVXVAAMAZL9SYTPQUVRLCXLJGEIVP9AKVIEZCBZJFWWOWYEKGZ9MAFZMAHWTOZV9EJBCMXKSUCVNSZIWHSZKCBVNIIERBMT9WGMCJSOGQDJHN9TBRHLQUSLHHTEWTEKBCLSEARDRVB9MBNTQDRZKOOMFBHNXMMHOTRQZKUSPVYZIEMRPMORSOOYDZDXKAUYCBHOYTSAJYSBUWKEECQITKSRDRNOCQUMJQRLOXWOCXXZBRKO9DKIX9AZNEBPJGEPAR9DKYJNSHGZDGJRQVLDUJJJPRKXISXOFHHRVETKBQCPOZRCO9BIAMAKYHIGA9KRHTJPOMW9VAVJAVCNJXEBQANGYOMOKNSIPUPXIBUZXYHTIYDCLMNCTGKNKXDOMEIBSRYSGGUVCGFBHAZTUKDARVSBF9KFPGBXWWKXMTCPPLIXGHUEMAHDLKVFPSTQXDFYCNHMQDBIBVBJ9HDYWWNLVBSCGUOJI9JPWNGHAINIKWRYVJNGQEYPI9ZYFJNNYNDQVX9LINZG9RAAITGUSDPVQRSXCHOUDHHBXKPLTUTLZURYOHFV9MZOQHBYHDECVPPWDYUCZQ9EPWMTUCUCBKNBVVTTLNREOWLCEQWFAMVYCPJVKMHZWKUZMFT9WQGPFZDHQYNNJJZDTMXUOCHTWQHQOLQ9TJLGESEACTYIPEN9TCYDTILDHXH9WQHENYWRCKMP9EJRZKODXJSCG9CYGNQVXTBDXKFYPBKIXBCBJLZOOEFLQPKGFYUVDDVQTUIRJRMSQQIW9SFGZUKOYPMGW9XPSGFLXJSPSMWDRDKUOWCCRY9XKSZEEZHURSHLNMLKYMCUJCQKMBA9FZSSGBDCWCLFAX99O9QPYYDEEFTMRCQMSACAIRNEPVWOCVCLKPPPAIJFZTPFVSBWTEIHVOW99YMDTZQDTROMBTWEVGQZNTCJKWNGYNYZVCIMVEOWMACNXJI9TSENJDTMHJVOYAGBLIJFY9EWLWKOJTSYXSSGMTSBFSJQK9RIFYARWEFXRMJWCZUCZFWAMAJSMZMYZFRALIZMHBCJLIEKUVHESOAYZQZBCTGJJER9XCQMBFOLYKKUTIMCMBYCUOJXZVOJBKUP9XQICKGLCAKFL9AIRREGHXHBOZCOOZCZAFVBKXRWZMTHKW9KLIZBCHUXMPJBG9ZUJHDHCNF9AYW9XOTOFRBFWXVLBYOJWEBFJTDVOOIGP9ZJGTT9SOVFVESJOIIXQIAMFMQABRIJMTPXMOJTRDJJTFTPXYDWBCGYGIQHLLBVSXADJIWVOBPJFLVWS9YBYPSSGCIRAIXJKJWBXEVSVB9VNUCSBMBTZWKLPNUYUBBEQBLDPNHFQEQ9R9T9DCYQQXKCLTFLKZGUNEFQNLCDAPASNRLKOHZNESMDHFFHNC9ACPLDLHZJIOWE9CDFQO9GAGKFATXWWBBWPVTHLRIWFC9UN9DWJSQGSV9HHZPMUFBHEUYZTUSTANVJCPBQDRDNRJVGZDS9ITRKHQXXRZVPISTIRIIHUS99BIFDCIABIUHVIGFXXAKZNMYJOAYVTXBMEZMURYBERGEVQPLYCUPUSDYNLCXKCKXEVVDUYKYKDIZHM9QGBUBCPZVSNKAFAGW9DTULALMCJXGLIXQFZQWJ9LKHEN9JGEE9POPJX9TSVMZ9ZUPMQSWBGLXLZLMMEGTDLIACBQHIDYGOXGOOGZY99DMQJXMXUYEBUEYUGVCDKOFZDMJUYQ9WHFDFPXVHZGKXNHZKZRISBUDRIJSEESAQOCHOLMK9IGWS9MREVYFFYLECINPU9MD9POLPXGHLPFACVDSGHVK9UTFJPFGWOJRPY9",
    address: "GDHPTALLKXGXOQXOFNWFYTDTGW9QFWZLSEH9SPZISBSQ99QJOXDVHDRJKVQD9PBDOFFDTYYZLOGUTFAN9",
    value:    0,
    obsoleteTag: "GATCBDBDBDEASCTCEAHDPCVCGA9",
    timestamp:   1513808981,
    currentIndex: 2,
    lastIndex: 2,
    bundle: "B9EVNFDKAUNZCXYFSBVKWPDYVKIKFFXKBGZLOHIBUZNPVQQLQVKAUFKWMEEAZKHTHJ9WKWAC9YECHDTEC",
    trunk: "XIWXXIUQ9DYTWDAELVPGNYNKTHOSFFUHBIZ9RRQWPZCAZETAHXIWYPSEGZGABCMPOHLUVIXZJMXTZ9999",
    branch: "XAUKTLYOVWWARZZTVSXIQSUGNDNJQKIMAGSFNJQURDZUHSWJJMOSUJT9UYXCMQTJ9MDVZBRXRVBD99999",
    tag: "GATCBDBDBDEASCTCEAHDPCVCGA9",
    attachmentTimestamp: 0,
    attachmentTimestampLowerBound: 0,
    attachmentTimestampUpperBound: 0,
    nonce: "CAD9999999XXH99999999999999",
  }
}