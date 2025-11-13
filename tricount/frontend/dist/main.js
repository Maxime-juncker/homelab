document.getElementById("submit-btn").addEventListener('click', () => parseTextarea());
document.getElementById("new-usr-input").addEventListener('keypress', (e) => addNewUsr(e));
document.getElementById("clear-usr").addEventListener('click', () => clearUsr());
function clearUsr() {
    const parent = document.getElementById("usr-container");
    if (!parent)
        return;
    parent.innerHTML = "";
    const btn = document.createElement("button");
    btn.innerText = "commun";
    btn.addEventListener('click', () => processClick(btn.innerText));
    parent.append(btn);
    document.getElementById("res-container").innerHTML = "";
}
class Item {
    constructor(name, price) {
        this.m_id = Item.id;
        Item.id++;
        this.m_buyer = "";
        this.m_name = name;
        this.m_price = price;
        this.m_htmlContainer = document.createElement("div");
        this.m_htmlContainer.className = "list-container";
        this.m_htmlNameTxt = document.createElement("p");
        this.m_htmlNameTxt.innerText = name;
        this.m_htmlNameTxt.style.width = "60%";
        this.m_htmlPriceTxt = document.createElement("p");
        this.m_htmlPriceTxt.innerText = price.toString();
        this.m_htmlPriceTxt.style.width = "30%";
        this.m_htmlBuyerTxt = document.createElement("p");
        this.m_htmlBuyerTxt.innerText = "[]";
        this.m_htmlBuyerTxt.style.width = "10%";
        this.m_htmlContainer.append(this.m_htmlNameTxt);
        this.m_htmlContainer.append(this.m_htmlPriceTxt);
        this.m_htmlContainer.append(this.m_htmlBuyerTxt);
    }
    showItem(parent) {
        parent.append(this.m_htmlContainer);
    }
    focus() {
        this.m_htmlContainer.classList.add("list-container-focus");
    }
    unfocus() {
        this.m_htmlContainer.classList.remove("list-container-focus");
    }
    get id() { return this.m_id; }
    get name() { return this.m_name; }
    get price() { return this.m_price; }
    get html() { return this.m_htmlContainer; }
    get buyer() { return this.m_buyer; }
    set buyer(name) {
        this.m_buyer = name;
        this.m_htmlBuyerTxt.innerText = `[${name}]`;
        this.m_htmlBuyerTxt.style.color = "var(--red)";
    }
}
Item.id = 0;
;
var basket = new Array();
var remise = 0;
var index = 0;
clearUsr();
function updateList() {
    basket.forEach(item => item.unfocus());
    const item = basket[index];
    item.focus();
    const itemTxt = document.getElementById("curr-item");
    if (!itemTxt)
        return;
    itemTxt.textContent = `${item.name} -- ${item.price}`;
}
class User {
    constructor(name, parent) {
        this.m_name = name;
        this.m_items = [];
        this.m_nameTxt = document.createElement("p");
        this.m_nameTxt.innerText = name;
        parent.append(this.m_nameTxt);
    }
    calc() {
        var total = 0;
        this.m_items.forEach(item => { total += item.price; });
        total = Number(total.toFixed(2));
        this.m_nameTxt.innerText = `${this.m_name} -- ${total}e`;
    }
    get items() { return this.m_items; }
    get name() { return this.m_name; }
}
function findUsr(users, name) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].name == name)
            return i;
    }
    return -1;
}
function getTotalPrice() {
    var total = 0;
    basket.forEach(item => { total += item.price; });
    return total;
}
function updateTotalTxt(parent) {
    const priceTxt = document.createElement("p");
    const remiseTxt = document.createElement("p");
    parent.innerHTML = "";
    parent.append(priceTxt);
    parent.append(remiseTxt);
    priceTxt.textContent = `total: ${getTotalPrice()}`;
    remiseTxt.textContent = `remise: ${remise}`;
}
function updateRes() {
    var isFinish = 1;
    const parent = document.getElementById("res-container");
    if (!parent) {
        console.error("no res-container elt");
        return;
    }
    updateTotalTxt(parent);
    var res = new Array();
    basket.forEach(item => {
        if (item.buyer) {
            if (findUsr(res, item.buyer) == -1)
                res.push(new User(item.buyer, parent));
            res[findUsr(res, item.buyer)].items.push(item);
        }
        else
            isFinish = 0;
    });
    res.forEach(user => { user.calc(); });
    console.log(res);
}
function resetIndex(toFind) {
    for (var i = 0; i < basket.length; i++) {
        if (basket[i].id == toFind.id)
            break;
    }
    if (i != basket.length)
        index = i;
    updateList();
}
function processClick(value) {
    basket[index].buyer = value;
    if (index + 1 < basket.length)
        index++;
    updateList();
    updateRes();
}
function parseTextarea() {
    remise = 0;
    const textarea = document.getElementById("ticket-in");
    if (!textarea) {
        console.error("missing ticket-in elt");
        return;
    }
    const parent = document.getElementById("item-list");
    if (!parent) {
        console.error("missing item-list elt");
        return;
    }
    parent.innerHTML = "";
    basket = [];
    const lines = textarea.value.split("\n");
    lines.forEach(line => {
        const item = parseLine(line);
        if (item)
            item.showItem(parent);
    });
    updateTotalTxt(document.getElementById("res-container"));
    updateList();
}
function parseLine(input) {
    const regex = /[\d.]+%\s+(.*?)\s+\d+\s+x\s+[\d.]+\s+(.+)$/;
    var match = input.match(regex);
    if (match) {
        const price = match[2];
        const item = new Item(match[1], Number(price));
        item.html.addEventListener('click', () => resetIndex(item));
        basket.push(item);
        return item;
    }
    else if ((match = input.match(/-\d+\.?\d*/))) { // remise text
        remise += parseFloat(match[0]);
    }
    return null;
}
function addNewUsr(event) {
    const input = document.getElementById("new-usr-input");
    const parent = document.getElementById("usr-container");
    if (!input || !parent)
        return;
    if (event.key != 'Enter' || input.value == "")
        return;
    const btn = document.createElement("button");
    btn.innerText = input.value;
    btn.addEventListener('click', () => processClick(btn.innerText));
    parent.append(btn);
    input.value = "";
}
