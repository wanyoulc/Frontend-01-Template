// Numeric Literals
const HexDigit = /[0-9a-fA-F]/;

const HexIntergerLiteral = /((0x[0-9a-fA-F])|(0X[0-9a-fA-F]))[0-9a-fA-F]*/;

const DecimalDigit = /\d/;

const NonZeroDigit = /[1-9]/;

const DecimalDigits = /\d+/;

const DecimalIntegerLiteral = /0|[1-9](\d+)?/;

const ExponentIndicator = /[eE]/;

const SignedInteger = /(\d+)|(\+\d+)|(\-\d+)/;

const ExponentPart = /[eE](\d+)|(\+\d+)|(-\d+)/;

const DecimalLiteral = /(0|[1-9](\d+)?(\.\d+)?([eE]((\d+)|(\+\d+)|(\-\d+)))?)|(\.\d+([eE]((\d+)|(\+\d+)|(\-\d+))?)?)|(0|[1-9](\d+)?([eE]((\d+)|(\+\d+)|(\-\d+)))?)/

const NumericLiteral = /^((0|[1-9](\d+)?(\.\d+)?([eE]((\d+)|(\+\d+)|(\-\d+)))?)|(\.\d+([eE]((\d+)|(\+\d+)|(\-\d+))?)?)|(0|[1-9](\d+)?([eE]((\d+)|(\+\d+)|(\-\d+)))?))$|^(((0x[0-9a-fA-F])|(0X[0-9a-fA-F]))[0-9a-fA-F]*)$/

// String Literals

const UnicodeEscapeSequence = /u[0-9a-fA-F]{4}/

const HexEscapeSequence = /u[0-9a-fA-F]{2}/

const SingleEscapeCharacte = /['"\\bfnrtv]/

const EscapeCharacter = /x|u|['"\\bfnrtv]|\d/

const SourceCharacter = /[\u0000-\u10FFFF]/

const NonEscapeCharacte = /(?=[\u0000-\u10FFFF])[^(x|u|['"\\bfnrtv]|\d|\r|\n)]/

const CharacterEscapeSequence = /(['"\\bfnrtv]) | ((?=[\u0000-\u10FFFF])[^(x|u|['"\\bfnrtv]|\d|\r|\n)])/

// 按着ECMA写实在写不下去了，再写也只是拼凑……