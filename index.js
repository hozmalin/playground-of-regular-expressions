function clear(selector) {
    document.querySelector(selector).replaceChildren();
}
function generate(input) {
    clear('#error');
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
    if (!bool) return str
    else {
        const regex = new RegExp(
            [
                String.raw`(?<=\x5Cx)[0-9a-f]{2}`,
                String.raw`(?<=\x5Cu)[0-9a-f]{4}`,
                String.raw`(?<=\x5Cu\{)[0-9a-f]{5,6}(?=\})`,
                String.raw`(?<=(?<!\x5C)\x5C)[0btvnrf'"\`\x5C]`
            ].join('|'), 'gi'
        );
        return str.replace(regex, function (match) {
            if (match.length == 1) {
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
            } else return String.fromCodePoint(parseInt(match, 16) || 0xFFFD);
        }).replace(/(?<!\x5C)\x5C(x|u)?/gi, new String());
    }
}
function output(str='', {source, flags}) {
    clear('#results');
    const results = new RegExp(source, flags).exec(str);
    document.querySelector('#results').innerHTML = results;
}
function copy() {
    document.getSelection().selectAllChildren(document.querySelector('.code'));
    navigator.clipboard.readText();
}

document.getElementById('regexp').addEventListener('input', function () {
    const display = document.getElementById('display');
    display.innerHTML = this.value;
    const regexp = document.getElementById('regexp');
    const {maxWidth} = window.getComputedStyle(display);
    const {width: currentWidth} = window.getComputedStyle(regexp);
    if (currentWidth <= maxWidth) {
        display.style.setProperty('color', 'transparent');
        regexp.style.setProperty('color', 'revert');
    } else {
        display.style.setProperty('color', 'revert');
        regexp.style.setProperty('color', 'transparent');
    }
});
document.getElementById('target').addEventListener('input', function ({target}) {
    target.style.height = target.value.split('\n').length * 1.5 + 'em';
});
