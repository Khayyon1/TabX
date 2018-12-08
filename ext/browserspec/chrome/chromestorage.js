function get(key, f)
{
    chrome.storage.local.get(key, f);
}

function set(key, val, f)
{
    let data = {key : val};
    chrome.storage.local.set(data, f);
}



module.exports = {
    get: get,
    set: set
}
