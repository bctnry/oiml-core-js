// the spirit of Cleword lives on.

import { Block, SimpleValue } from "./ast";

const assert = (x: any, msg: string) => {
    if (!!!x) { throw Error(`assert failed: ${msg}`); }
}

function _toLines(x: string): string[] {
    return x.split('\n').map((v) => {
        let i = v.length - 1;
        while (i > 0 && v[i] === '\r') { i++; }
        return v.substring(0, i+1);
    });
}

const REGEX_BOOLEAN = /^\s*(#(?:true|false))/;
const REGEX_NUMBER = /^\s*((?:0(?:x[0-9a-fA-F]+|b[01]+|o[0-7]+))|-?(?:(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?))(?:\s|:|=|$)/;
const REGEX_QUOTED_STRING = /^\s*((?:"(?:[^"\\\x00-\x1f\x7f]|\\["\\/bfnrt]|\\u[0-9a-fA-F]{4})*"))(?:\s|:|=|$)/;
const REGEX_SIMPLE_STRING = /^\s*((?:[^:\\\s=]|\\.|\\=)+)(?:\s|:|=|$)/;
// note to self: make unsupported escape sequence in quoted strings a warning.
function _takeStringOrNumber(x: string, line: number = -1): [string|number|boolean|null, string] {
    let matchres = REGEX_NUMBER.exec(x);
    if (matchres) {
        let rest = x.substring(matchres[1].length);
        let val = null;
        switch (true) {
            case matchres[1].startsWith('0x'): { val = parseInt(matchres[1].substring(2), 16); break; }
            case matchres[1].startsWith('0b'): { val = parseInt(matchres[1].substring(2), 2); break; }
            case matchres[1].startsWith('0o'): { val = parseInt(matchres[1].substring(2), 8); break; }
            case matchres[1].includes('.') || matchres[1].includes('e') || matchres[1].includes('E'): {
                val = parseFloat(matchres[1]);
                break;
            }
            default: {
                val = parseInt(matchres[1], 10);
                break;
            }
        }
        return [val!, rest];
    }
    matchres = REGEX_QUOTED_STRING.exec(x);
    if (matchres) {
        // NOTE: quoted string in oiml is exactly the same as json string.
        return [JSON.parse(matchres[1]), x.substring(matchres[1].length)];
    }
    matchres = REGEX_BOOLEAN.exec(x);
    if (matchres) {
        return [(
            matchres[1] === '#true'? true
            : matchres[1] === '#false'? false
            : false
            ), x.substring(matchres[1].length)];
    }
    // NOTE: simple string here.
    matchres = REGEX_SIMPLE_STRING.exec(x);
    if (matchres) {
        let str = matchres[1];
        if (str[0] == '"' && str[str.length-1] == '"') {
            console.warn(`Line ${line}: Possible quote string treated as simple string; may contain invalid escape sequence?`);
        }
        return [str.replace(/\\(.)/g, '$1'), x.substring(str.length)];
    }
    return [null, x];
}

function _takeSimpleValue(x: string, line: number = -1): [SimpleValue|null, string] {
    let first: [string|number|boolean|null, string] = _takeStringOrNumber(x, line);
    if (first[0] === null) { return [null, x]; }
    if (!first[1].startsWith('=')) { return first; }
    let second: [string|number|boolean|null, string] = _takeStringOrNumber(first[1].substring(1), line);
    if (second[0] === null) { return first; }
    return [[first[0], second[0]], second[1]];
}

const REGEX_INDENT = /^( *)(.*)?$/;
function _parseHead(requiredIndent: number, currentLine: number, x: string): Block {
    assert(x.trim() && !x.trim().startsWith('//'), 'comment and empty line should not reach _parseHead');
    let res: Block = { };
    let matchres = REGEX_INDENT.exec(x);
    if (matchres![1].length !== requiredIndent) { throw new Error(`Line ${currentLine+1}: invalid indent`); }
    let command: SimpleValue[] = [];
    let subj = matchres![2];
    while (subj) {
        let val = _takeSimpleValue(subj, currentLine);
        if (val[0] != null) {
            command.push(val[0]);
            subj = val[1].trim();
            continue;
        }
        subj = subj.trim();
        if (!subj) {
            res.B = undefined;
            break;
        }
        assert(subj[0] && subj[0] === ':', `non separator should already be parsed as simple value, but ${subj} found`);
        if (subj[0] && subj[0] === ':') {
            res.B = subj.substring(1).trim();
            break;
        }
    }
    res.A = command;
    return res;
}
function _parseBlocks(requiredIndent: number, currentLine: number, lines: string[]): [Block[], number] {
    let res: Block[] = [];
    let i = currentLine;
    while (i < lines.length) {
        while (i < lines.length && (!lines[i].trim() || lines[i].trim().startsWith('//'))) { i++; }
        if (i >= lines.length) { break; }
        let line = lines[i];
        let matchres = REGEX_INDENT.exec(line);
        if (!matchres || matchres[1].length < requiredIndent) {
            break;
        }
        let head = _parseHead(requiredIndent, currentLine, line);
        if (head.B === undefined) { res.push(head); i++; continue; }
        let j = i+1; while (j < lines.length && (!lines[j].trim() || lines[j].trim().startsWith('//'))) { j++; }
        if (j >= lines.length) {
            res.push(head); i = j; break;
        }
        let nextLine = lines[j];
        matchres = REGEX_INDENT.exec(nextLine);
        if (!matchres || matchres[1].length <= requiredIndent) {
            res.push(head); i = j; break;
        }
        let children = _parseBlocks(matchres[1].length, j, lines);
        head.C = children[0]||null;
        res.push(head);
        i = children[1];
    }
    return [res, i];
}

export function parse(x: string): Block[] {
    return _parseBlocks(0, 0, _toLines(x))[0];
}
