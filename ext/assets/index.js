html = ['settings', 'popup'];
img = ['logo256.png'];
js = ['activated', 'button', 'form', 'settings'];
css = ['popup'];

html.forEach((html) => require("./html/" + html + '.html'));
img.forEach((img) => require("./img/" + img));
css.forEach((css) => require("./css/" + css + '.css'));
