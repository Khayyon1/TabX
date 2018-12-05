html = ['settings', 'popup'];
img = ['logo256.png'];

html.forEach(() => require("./html/" + html + '.html'));
img.forEach(() => require("./img/" + img));
