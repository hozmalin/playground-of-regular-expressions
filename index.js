function clear(selector) {
    document.querySelector(selector).replaceChildren();
}
function generate(input) {
    const output = document.getElementById('error');
    const flags = Array.from(document.querySelectorAll('.flags > label > [id^="flag_"]:checked')).map(f => f.id.split('flag_')[1]).join('');
    let regex;
    try {
        regex = new RegExp(input, flags);
    } catch ({name, message}) {
        output.innerHTML = `${name}: ${message}`;
    }
    if (!(regex instanceof RegExp)) (regex = new RegExp('', flags));
    return regex;
}
function parse(str, bool) {
    clear('#error');
    if (!bool) return str
    else {
        const regex = new RegExp([
            '(?<=\x5Cx)[0-9a-f]{2}',
            '(?<=\x5Cu)[0-9a-f]{4}',
            '(?<=\x5Cu\{)[0-9a-f]{6}(?=\})',
            '(?<=(?<!\x5C)\x5C)[0btvnrf\'"`\x5C]'
        ].join('|'), 'giu');
        return str.match(regex, function (match) {
            if ((match.length - 1)) {
                switch (match) {
                    default: return match;
                    case '0': return '\0';
                    case 'b': return '\b';
                    case 't': return '\t';
                    case 'v': return '\v';
                    case 'n': return '\n';
                    case 'r': return '\r';
                    case 'f': return '\f';
                }
            } else return String.fromCodePoint('0x' + match);
        });
    }
}
function output(str='', {source, flags}) {
    clear('#results');
    const results = document.getElementById('results');
    results.innerHTML = str.match(new RegExp(source, flags));
}
function _scroll() {
    const regex = /[\u1100-\u115F\u231A\u231B\u2329\u232A\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3000-\u303E\u3041-\u3096\u3099-\u30FF\u3105-\u312F\u3131-\u318E\u3190-\u31E3\u31F0-\u321E\u3220-\u3247\u3250-\u4DBF\u4E00-\uA48C\uA490-\uA4C6\uA960-\uA97C\uAC00-\uD7A3\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF60\uFFE0-\uFFE6\u{16FE0}-\u{16FE4}\u{16FF0}\u{16FF1}\u{17000}-\u{187F7}\u{18800}-\u{18CD5}\u{18D00}-\u{18D08}\u{1AFF0}-\u{1AFF3}\u{1AFF5}-\u{1AFFB}\u{1AFFD}\u{1AFFE}\u{1B000}-\u{1B122}\u{1B132}\u{1B150}-\u{1B152}\u{1B155}\u{1B164}-\u{1B167}\u{1B170}-\u{1B2FB}\u{1F004}\u{1F0CF}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F200}-\u{1F202}\u{1F210}-\u{1F23B}\u{1F240}-\u{1F248}\u{1F250}\u{1F251}\u{1F260}-\u{1F265}\u{1F300}-\u{1F320}\u{1F32D}-\u{1F335}\u{1F337}-\u{1F37C}\u{1F37E}-\u{1F393}\u{1F3A0}-\u{1F3CA}\u{1F3CF}-\u{1F3D3}\u{1F3E0}-\u{1F3F0}\u{1F3F4}\u{1F3F8}-\u{1F43E}\u{1F440}\u{1F442}-\u{1F4FC}\u{1F4FF}-\u{1F53D}\u{1F54B}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F57A}\u{1F595}\u{1F596}\u{1F5A4}\u{1F5FB}-\u{1F64F}\u{1F680}-\u{1F6C5}\u{1F6CC}\u{1F6D0}-\u{1F6D2}\u{1F6D5}-\u{1F6D7}\u{1F6DC}-\u{1F6DF}\u{1F6EB}\u{1F6EC}\u{1F6F4}-\u{1F6FC}\u{1F7E0}-\u{1F7EB}\u{1F7F0}\u{1F90C}-\u{1F93A}\u{1F93C}-\u{1F945}\u{1F947}-\u{1F9FF}\u{1FA70}-\u{1FA7C}\u{1FA80}-\u{1FA88}\u{1FA90}-\u{1FAC5}\u{1FACE}-\u{1FADB}\u{1FAE0}-\u{1FAE8}\u{1FAF0}-\u{1FAF8}\u{20000}-\u{2FFFD}\u{30000}-\u{3FFFD}]/gu;
    const src = document.getElementById('regexp');
    const flw = src.textContent.match(regex)?.length ?? 0;
    const hfw = src.textContent.length - flw;
    src.scrollLeft = ((flw * 16) + (hfw * 8)) * (this.value / 100); // 1em = 16px
}
function update() {
    const selection = document.getSelection();
    const target = selection.focusNode?.parentElement;
    if (target?.id == 'regexp') {
        const bar = document.querySelector("body > div > form > div.visual > input[type=range]");
        bar.value = selection.focusOffset / selection.focusNode.nodeValue.length * 100;
    }
}
function copy() {
    document.getSelection().selectAllChildren(document.querySelector('.code'));
    navigator.clipboard.readText();
}
document.getElementById('regexp').addEventListener('input', update);
document.addEventListener('selectionchange', update);
