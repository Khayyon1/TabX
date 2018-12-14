function retrieve(key, f)
{
    chrome.storage.local.get(key, f);
}

function store(data, f)
{
    chrome.storage.local.set(data, f);
}

module.exports = {
    retrieve: retrieve,
    store: store,
}
