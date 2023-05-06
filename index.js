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
                String.raw`(?<=(?<!\x5C)\x5Cx)[0-9a-fA-F]{2}`,
                String.raw`(?<=(?<!\x5C)\x5Cu)[0-9a-fA-F]{4}`,
                String.raw`(?<=(?<!\x5C)\x5Cu{)[0-9a-fA-F]{1,6}(?=})`,
                String.raw`(?<=(?<!\x5C)\x5C)[0btvnrf]`,
            ].join('|'), 'g'
        );
        return str.replace(regex, function (match) {
            switch (match) {
                case '0': return '\0';
                case 'b': return '\b';
                case 't': return '\t';
                case 'v': return '\v';
                case 'n': return '\n';
                case 'r': return '\r';
                case 'f': return '\f';
            }
            try {
                return String.fromCodePoint(parseInt(match, 16));
            }
            catch {
                return '\uFFFD';
            }
        }).replace(/(?<!\x5C)\x5C(x|u)?((?<=\x5Cu){|(?<=\x5Cu{.)})?/g, new String());
    }
}
function output(str='', {source, flags}) {
    clear('#results');
    const regex = new RegExp(source, flags);
    const results = str.match(regex);
    document.querySelector('#results').innerHTML = `<div class="items">${results?.join('<span style="color:red">,&nbsp;</span>') ?? 'null'}</div>`;
}
function copy() {
    document.getSelection().selectAllChildren(document.querySelector('.code'));
    navigator.clipboard.readText();
}

function update() {
    const display = document.getElementById('display');
    display.textContent = this.value;
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
}
document.getElementById('regexp').addEventListener('input', update);
document.getElementById('target').addEventListener('input', function () {
    this.style.height = this.value.split('\n').length + 'lh';
});
