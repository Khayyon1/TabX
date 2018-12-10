const Style = class
{
    table(element, input_bounds)
    {
        element.style.display = 'flex';
        element.style.position = 'absolute';
        element.style.backgroundColor = "lightblue";
        element.style.zIndex = 999;
        element.style.left = (input_bounds.left).toString() + "px";
        element.style.top = (input_bounds.top + input_bounds.height).toString() + "px";
    }
}

module.exports = Style;