// Run with: deno transskribilo.ts

import ssfst from "npm:ssfst";

// End of paragraph marker: \Ts\Tcenteredtilde or \Ts\Tcenteredlongtilde
// Names: slightly larger initial character / doubling stems

const consonants = {
  "b": "\\Tumbar",   // /b/  =  6(0/5)
  "c": "\\Tthuule",  // /ts/ =  9(0/8)
  "ĉ": "\\Tcalma",   // /ch/ =  3(0/2)
  "d": "\\Tando",    // /d/  =  5(0/4)
  "f": "\\Tformen",  // /f/  = 10(0/9)
  "g": "\\Tungwe",   // /g/  =  8(0/7)
  "ĝ": "\\Tanga",    // /j/  =  7(0/6)
  "h": "\\Thyarmen", // /h/  = 33(2/0)
  "ĥ": "\\Thwesta",  // /x/  = 12(0/B)
  "j": "\\Tanna",    // /h/  = 23(1/6)
  "ĵ": "\\Tanca",    // /x/  = 15(0/E)
  "k": "\\Tquesse",  // /k/  =  4(0/3)
  "l": "\\Tlambe",   // /l/  = 27(1/A)
  "m": "\\Tmalta",   // /m/  = 18(1/1)
  "n": "\\Tnuumen",  // /n/  = 17(1/0)
  "p": "\\Tparma",   // /p/  =  2(0/1)
  "r": "\\Troomen",  // /r/  = 25(1/8)
  "ŝ": "\\Taha",     // /sh/ = 11(0/A)
  "t": "\\Ttinco",   // /t/  =  1(0/0)
  "ŭ": "\\Tvala",    // /w/  = 22(1/5)
  "v": "\\Tampa",    // /v/  = 14(0/D)

  "cx": "\\Tcalma",
  "gx": "\\Tanga",
  "hx": "\\Thwesta",
  "jx": "\\Tanca",
  "sx": "\\Taha",
  "ux": "\\Tvala",
}

const fullVowels = {
  "a": "\\Tosse",       //
  "e": "\\Tyanta",      //
  "i": "\\Taara",       //
  "o": "\\tengwa{186}", // (2/7)
  "u": "\\Tuure",       //
}

// TODO: duodecimal system?
const numerals = {
  "0": "\\Tzero",
  "1": "\\Tone",
  "2": "\\Ttwo",
  "3": "\\Tthree",
  "4": "\\Tfour",
  "5": "\\Tfive",
  "6": "\\Tsix",
  "7": "\\Tseven",
  "8": "\\Teight",
  "9": "\\Tnine",
}

const other = {
  ",": "\\Tcentereddot", // REVIEW \Ts here...
  ".": "\\Tcolon",
  "!": "\\Texclamation",
  "?": "\\Tquestion", // ... to here??
  // "-": "\\Tcentereddot", // REVIEW hyphen?
  "“": "\\Tromanquoteleft", // TODO regular quotes?
  "”": "\\Tromanquoteright",
  " ": "\\Ts",
  "\t": "\\Ts",
  "\r": "\\\\",
  "\n": "\\\\",
  "\r\n": "\\\\",
}

// If preceded by a vowel, use the nuquerna form
const special = {
  "s": "\\Tsilme", // 29(1/C) & 30(1/D)
  "z": "\\Tesse", // 31(1/E) & 32(1/F)
}

const tehtaVowels = {
  "a": "\\TTthreedots", // (4/1)
  "e": "\\TTacute",     // (4/6)
  "i": "\\TTdot",       // (4/4)
  "o": "\\TTrightcurl", // (4/8)
  "u": "\\TTleftcurl",  // (4/A)
}

const followingW = tehtaVowels["u"];
const followingY = "\\TTtwodots";

const diphthongs = {
  "aj":  fullVowels["a"] + followingY,
  "ej":  fullVowels["e"] + followingY,
  "oj":  fullVowels["o"] + followingY,
  "uj":  fullVowels["u"] + followingY,
  "aŭ":  fullVowels["a"] + followingW,
  "eŭ":  fullVowels["e"] + followingW,
  "aux": fullVowels["a"] + followingW,
  "eux": fullVowels["e"] + followingW,
}

const fsmDict = []

function fsmAdd(input: string, output: string) {
  fsmDict.push({
    input: input,
    output: output
  });
}

for (const [vowelIn, vowelOut] of Object.entries(tehtaVowels)) {
  for (const [consonantIn, consonantOut] of Object.entries(consonants)) {
    fsmAdd(vowelIn + consonantIn, consonantOut + vowelOut);
  }

  for (const [specialIn, specialOut] of Object.entries(special)) {
    fsmAdd(vowelIn + specialIn, specialOut + "nuquerna" + vowelOut);
  }

  fsmAdd(vowelIn, "\\Ttelco" + vowelOut);
}

for (const [numeralIn, numeralOut] of Object.entries(numerals)) {
  fsmAdd(numeralIn, numeralOut + "\\TTdecimal");
}

for (const [input, output] of Object.entries({...consonants, ...other, ...diphthongs, ...special})) {
  fsmAdd(input, output);
}

// console.log(fsmDict);

const transducer = ssfst.init(fsmDict);
const symbols = [...'abcdefghijklmnoprstuvzĉĝĥĵŝŭ'.split(''),
                 ...'ajejojujaŭeŭ'.match(/.{2}/g)];

const decoder = new TextDecoder();
for await (const chunk of Deno.stdin.readable) {
  console.log(transducer.process(decoder.decode(chunk).toLowerCase()));
}
