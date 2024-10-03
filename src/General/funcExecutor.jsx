import { differenceInMilliseconds, startOfToday, addMilliseconds } from "date-fns";
import { format } from "date-fns/esm";
import { getTZPrefix } from "./globals";
import moment from "moment-timezone";

export const DATEDIFF = "(datediff)", DATEDIFFNTZ = "(datediffntz)", DATEADD = "(dateadd)", DATESUB = "(datesub)", IFNULL = "(ifnull)", IFEMPTY = "(ifempty)",
    IFWHITESPACE = "(ifwhitespace)",
    FORMAT = "(dtformat)", FORMATNTZ = "(dtformatntz)", JOINSTR = "(joinstr)",
    EQUALS = "(eq)", NOTEQUALS = "(neq)", IFTRUE = "(iftrue)", IFFALSE = "(iffalse)", BOOL_NOT = "(not)",
    STRAFTER = "(strafter)", STRAFTER_END = "(strafterend)", STRBEFORE = "(strbefore)", STRBEFORE_END = "(strbeforeend)",
    STR_REPLACE = "(strreplace)", STR_REPLACE_ALL = "(strreplaceall)",
    TOSTRING = "(tostr)", JSON_PARSE = "(jsonparse)",VERIFY_JSON = "(verifyjson)", 
    MATH_ADD = "(+)", MATH_SUB = "(-)", MATH_MULTI = "(*)", MATH_DIV = "(/)", MATH_MOD = "(%)", MATH_POW = "(^)",
    LESS_THAN = "(<)", GREATER_THAN = "(>)", LESSTHAN_OR_EQUAL = "(<=)", GREATERTHAN_OR_EQUAL = "(>=)",
    LOGICAL_OR = "(or)", LOGICAL_AND = "(and)", VAL_ABS = "(abs)",
    IF_NAN = "(ifnan)", NUM_FORMAT = "(numformat)",
    LIST_REVERSE = "(listreverse)", LIST_SUM = "(listsum)", LIST_COUNT = "(listcount)", LIST_INDEX = "(listindex)",
    LIST_HAS = "(listhas)", LIST_FILTER = "(listfilter)", LIST_DISTINCT = "(listdistinct)",
     LIST_JOIN = "(listjoin)", LIST_SORT = "(listsort)",
    OBJ_TYPE = "(type)", OBJ_GET = "(get)", TO_INT = "(toint)";
export const funcs = [DATEDIFF, DATEDIFFNTZ, DATEADD, DATESUB, IFNULL, IFEMPTY, IFWHITESPACE, FORMAT, FORMATNTZ, JOINSTR,
    EQUALS, NOTEQUALS, IFTRUE, IFFALSE, BOOL_NOT, TOSTRING, STRAFTER, STRAFTER_END, STRBEFORE, STRBEFORE_END,
    STR_REPLACE, STR_REPLACE_ALL, JSON_PARSE,VERIFY_JSON,
    LESS_THAN, GREATER_THAN, LESSTHAN_OR_EQUAL, GREATERTHAN_OR_EQUAL, LOGICAL_OR, LOGICAL_AND, VAL_ABS,
    MATH_ADD, MATH_SUB, MATH_MULTI, MATH_DIV, MATH_MOD, MATH_POW, IF_NAN, NUM_FORMAT,
    LIST_REVERSE, LIST_COUNT, LIST_SUM, LIST_INDEX, LIST_HAS, LIST_FILTER, LIST_DISTINCT, LIST_JOIN, LIST_SORT,
    OBJ_TYPE, OBJ_GET, TO_INT];

export function dyadicFuncExecutor(funcName, firstValue, secondValue) {
    let firstValMath = 0;
    let secondValMath = 0;
    if ([MATH_ADD, MATH_SUB, MATH_MULTI, MATH_DIV, MATH_MOD, MATH_POW].includes(funcName)) {
        firstValMath = parseFloat(firstValue);
        secondValMath = parseFloat(secondValue);
        if (isNaN(firstValMath)) firstValMath = 0;
        if (isNaN(secondValMath)) secondValMath = 0;
    }
    switch (funcName) {

        case DATEDIFF:
            return _dateDiffExec(firstValue, secondValue);
        case DATEDIFFNTZ:
            return _dateDiffExec(firstValue, secondValue, true);
         case DATEADD:
            return _dateAdd(firstValue, secondValue);
        case DATESUB:
            return _dateSub(firstValue, secondValue);
        case IFNULL:
            return _ifNullExec(firstValue, secondValue);
        case IFEMPTY:
            return _ifNullOrEmptyExec((firstValue ?? ""), secondValue);
        case IFWHITESPACE:
            return _ifNullOrEmptyExec((firstValue ?? "").trim(), secondValue);
        case FORMAT:
            return _formatDateTime(firstValue, secondValue);
        case FORMATNTZ:
            return _formatDateTime(firstValue, secondValue, true);
        case JOINSTR:
            return (firstValue ?? "") + (secondValue ?? "");
        case STRAFTER:
            return firstValue.substr(firstValue.indexOf(secondValue) + 1);
        case STRAFTER_END:
            return firstValue.substr(firstValue.lastIndexOf(secondValue) + 1);
        case STRBEFORE:
            return firstValue.substr(0, firstValue.indexOf(secondValue));
        case STRBEFORE_END:
            return firstValue.substr(0, firstValue.lastIndexOf(secondValue));
        case STR_REPLACE:
            let replaceValues = secondValue.split("=>");
            return firstValue.replace(replaceValues[0], replaceValues[1]);
        case STR_REPLACE_ALL:
            let replaceValuesAll = secondValue.split("=>");
            return firstValue.replaceAll(replaceValuesAll[0], replaceValuesAll[1]);
        case EQUALS:
            if (secondValue == null) return secondValue == firstValue;
            return secondValue.split("||").some(el => el == firstValue); //No type checking
        case NOTEQUALS:
            if (secondValue == null) return secondValue != firstValue;
            return secondValue?.split("||").every(el => el != firstValue); //No type checking
        case LESS_THAN:
            return firstValue < secondValue;
        case LESSTHAN_OR_EQUAL:
            return firstValue <= secondValue;
        case GREATER_THAN:
            return firstValue > secondValue;
        case GREATERTHAN_OR_EQUAL:
            return firstValue >= secondValue;
        case LOGICAL_OR:
            return firstValue || secondValue;
        case LOGICAL_AND:
            return firstValue && secondValue;
        case TOSTRING:
            let indent = parseInt(secondValue);
            if(isNaN(indent)) indent = secondValue;
            return JSON.stringify(firstValue,null, indent);
        case JSON_PARSE:
            return JSON.parse(firstValue);
        case VERIFY_JSON:
            try{ 
                JSON.parse(firstValue)
                return true; 
            }catch{}
            return false; 
        case MATH_ADD:
            return ((firstValMath ?? 0) + (secondValMath ?? 0)).toFixed(6);
        case MATH_SUB:
            return (firstValMath ?? 0) - (secondValMath ?? 0).toFixed(6);
        case MATH_MULTI:
            return (firstValMath ?? 0) * (secondValMath ?? 0).toFixed(6);
        case MATH_DIV:
            return (firstValMath ?? 0) / (secondValMath ?? 0).toFixed(6);
        case MATH_MOD:
            return (firstValMath ?? 0) % (secondValMath ?? 0).toFixed(6);
        case MATH_POW:
            return Math.pow((firstValMath ?? 0), (secondValMath ?? 0)).toFixed(6);
        case TO_INT:
            return parseInt(firstValue);
        case IF_NAN:
            if (isNaN(firstValue)) return secondValue;
            else return firstValue;
        case NUM_FORMAT:
            return formatNumber(firstValue, secondValue);
        case VAL_ABS:
            return Math.abs(firstValue);
        case LIST_SUM:
            return calculateListSummary(firstValue, secondValue);
        case LIST_DISTINCT:
            let distinctKeys = firstValue.map(t => {
                let test = t[secondValue]
                return test;
            })
                .filter((value, index, self) => {
                    let truthy = self.findIndex(t => t === value) === index;
                    return truthy;
                }
                );
            return distinctKeys.map(t => { return { [secondValue]: t }; });
        case LIST_JOIN:
            return firstValue.join ? firstValue?.join(secondValue ?? "") : firstValue;
        case LIST_REVERSE:
            if (Array.isArray(firstValue)) {
                return firstValue?.slice()?.reverse();
            }
            return firstValue;
        case LIST_COUNT:
            return calculateListCount(firstValue);
        case LIST_SORT:
            return sortTheList(firstValue, secondValue);
        case LIST_HAS:
            let lisCount = calculateListCount(firstValue);
            return (secondValue > 0 && secondValue < lisCount); //For array only

        case LIST_INDEX:
            return getListIndexMatchingValue(firstValue, secondValue);
        case LIST_FILTER:
            return getFilteredList(firstValue, secondValue);
        case BOOL_NOT:
            return !firstValue;
        case OBJ_TYPE:
            if (firstValue === null || typeof firstValue === "undefined") return "null";
            let valType = typeof firstValue;
            if (valType === "object" && Array.isArray(firstValue)) valType = "array";
            return valType;
        case OBJ_GET:
            if (typeof firstValue === "object") {
                return firstValue[secondValue];
            }
            return firstValue;
        default:
            return null;
    }
}


export function formatNumber(number, format) {
    let numSplit = number?.toString().split(".");
    if (format?.startsWith("N") && numSplit) {
        let prec = parseInt(format.replace("N", ""));
        // let reg = new RegExp("", "g"); 
        let whole = numSplit[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        let decim = (numSplit.length > 1 && prec > 0 ? "0." + numSplit[1] : "0.0");
        decim = parseFloat(decim).toFixed(prec);
        let returnVal = whole + (decim.length > 1 ? "." + decim.split(".")[1] : "");

        return returnVal;
    }
    else {
        let toFix = parseInt(format);
        let valNumber = parseFloat(number);
        if (isNaN(valNumber)) return number;
        if (isNaN(toFix)) toFix = 2;
        return valNumber.toFixed(toFix);
    }
}

function calculateListSummary(dsetArray, fieldName) {
    let total = 0;
    if (Array.isArray(dsetArray)) {
        for (let di of dsetArray) {
            let currentItem = di[fieldName];
            if (typeof currentItem !== 'undefined') {
                let ciValue = parseFloat(currentItem);
                if (!isNaN(ciValue)) {
                    total += ciValue;
                }
            }
        }
    }
    return total;
}

function getListIndexMatchingValue(dsetArray, fieldNameAndValue) {
    if (Array.isArray(dsetArray)) {
        let fieldArray = fieldNameAndValue.split("||");
        return dsetArray.findIndex(t => {
            let assertedMatches = [];
            for (let fa of fieldArray) {
                if (fa.includes("=>")) {
                    let keyfa = fa.split("=>");
                    assertedMatches.push(t[keyfa[0]] == keyfa[1]);
                }
                else {
                    assertedMatches.push(t == fa);
                }
            }
            return assertedMatches.every(t => t === true);
        });

    }
    return -1;
}

function sortTheList(dsetArray, sortKey) {
    let sortedArray = dsetArray ; 
    if (Array.isArray(dsetArray) && sortKey) {
        sortedArray = dsetArray.sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return -1;
            if (a[sortKey] > b[sortKey]) return 1;
            return 0;
        })
    }
    return sortedArray; 
}

function getFilteredList(dsetArray, fieldNameAndValue) {
    if (Array.isArray(dsetArray)) {
        let fieldArray = fieldNameAndValue.split("||");
        return dsetArray.filter(t => {
            let assertedMatches = [];
            for (let fa of fieldArray) {

                if(fa.includes("<=>")){
                    let keyfa = fa.split("<=>");
                    assertedMatches.push(t[keyfa[0]] != keyfa[1]);
                    continue;
                }

                if(fa.includes("=>")){
                    let keyfa = fa.split("=>");
                    assertedMatches.push(t[keyfa[0]] == keyfa[1]);
                }
                
            }
            return assertedMatches.every(t => t === true);
        });

    }
    return [];
}
function calculateListCount(dsetArray) {
    let count = 0;
    if (Array.isArray(dsetArray)) {
        count = dsetArray.length;
    }
    return count;
}
function _dateDiffExec(firstValue, secondValue, noTimeZone = false) {
    if (!noTimeZone) {
        if (typeof firstValue === "string") firstValue += getTZPrefix();
        if (typeof secondValue === "string") secondValue += getTZPrefix();
    }
    let firstDateValue = Date.parse(firstValue),
        secondDateValue = Date.parse(secondValue);
    if (!firstDateValue) firstDateValue = new Date();
    if (!secondDateValue) secondDateValue = new Date();
    let millis = differenceInMilliseconds(secondDateValue, firstDateValue);
    return addMilliseconds(startOfToday(), millis);
}

function _dateAdd(firstValue, secondValue) {
    // var result = firstValue.addDays(secondValue);
    var result = moment(firstValue).add(secondValue, "days");
    return result.toDate();
}

function _dateSub(firstValue, secondValue) {
  // var result = firstValue.addDays(secondValue);
  var result = moment(firstValue).subtract(secondValue, "days");
  return result.toDate();
}

const _ifNullExec = (firstValue, secondValue) => firstValue ?? secondValue;  //Return second value if first value is null

const _ifNullOrEmptyExec = (firstValue, secondValue) => {
    if ( firstValue === "") return secondValue;
    else return firstValue;
};  //Return second value if first value is null or empty


export function _formatDateTime(firstValue, formatString, noTimeZonePrefix = false) {
    try {
        if (typeof firstValue === "string" && !noTimeZonePrefix) firstValue += getTZPrefix();
        let dateValue = Date.parse(firstValue);

        if (!dateValue) return null; // dateValue = new Date();
        if (!formatString) formatString = "dd-MMM-yyyy";
        return format(dateValue, formatString);
    }
    catch {
        return firstValue;
    }
}