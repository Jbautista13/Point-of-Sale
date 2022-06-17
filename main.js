import Sortable from 'sortablejs';

var removeButtons;
var editButtons;
var themeButtons;
var editButton;
var settingButton;
var screencastStates = { showKeys: false, keyPressedCurrently: false }
var dialogTimers = { hideKeyPressTimer: null, errorTimer: null };
var orderQuantities = { }
var settingModal;

var data = JSON.parse(localStorage.getItem('PoSData')) || {numOfItems: 0, names: [], prices: [], theme: 'system', settings: {'show_order_summary': true, 'change_calculator': true}};
var {numOfItems = 0, names = [], prices = [], theme = 'system', settings = {'show_order_summary': true, 'change_calculator': true}} = data;

var tempSettings;

updateNumberOfItemsStyle(numOfItems)

window.onload = function() {
    
    editButton = document.querySelector('.edit');
    let done = document.querySelector('.finished');
    let add = document.querySelector('.add');
    let list = document.querySelector('#order');
    let finishButton = document.querySelector('.complete');
    let cash = document.querySelector('#cash');
    let total = document.querySelector('#total');
    settingButton = document.getElementById('open-settings')
    themeButtons = document.querySelectorAll('.theme-button');
    settingModal = document.getElementById('settings-modal')

    cash.addEventListener('keydown', cashInput);
    done.addEventListener('click', finished);
    add.addEventListener('click', addHandler);
    total.addEventListener('input', blankOrderHandler)
    settingButton.addEventListener('click', settingHandler);
    finishButton.addEventListener('click', finishOrder);
    themeButtons.forEach(button => { button.addEventListener('click', changeTheme); });

    //set previously saved settings
    setSettings(true);

    //add previously saved items
    for (var i = 0; i < numOfItems; i++)
    {
        let item = document.createElement('li');
        item.tabIndex = 0;
        item.dataset.order = Number(i) + 1;
        item.innerHTML = createListItem(names[i], prices[i], i);
        orderQuantities[`${names[i]}_${prices[i]}`] = 0
        list.appendChild(item);
        addEventListenersItem(item);
    }
    console.log(orderQuantities)
    showElement(list);
    document.querySelector(`[data-theme-name="${theme}"`).disabled = true;
    updateThemeOrderAttr();


    removeButtons = document.querySelectorAll('.item-remove-button');
    editButtons = document.querySelectorAll('.item-edit-button')

    updateFooterOrder();

    editButton.addEventListener('click', event => {
        let controls = document.querySelector('.controls');
        let items = document.querySelectorAll('li');

        const currentlyEditing = document.body.dataset.inEdit;
        const finishingOrder = document.body.dataset.finishingOrder;
        const blankOrder = document.body.dataset.blankOrder;

        if (finishingOrder == "true") { // User doesn't want to finish/save order
            continueOrder(editButton);
        }
        else if (blankOrder == "false") {
            clearOrder();
        }
        else if (currentlyEditing == "true") { // User wants to exit edit mode
            hideElement(settingButton, 'margin-bottom');
            hideElement(controls);
            removeButtons.forEach( button => {
                hideElement(button);
                button.disabled = true;
            });
            editButtons.forEach( button => {
                hideElement(button);
                button.disabled = true;
            });
            items.forEach( item => item.tabIndex = "0");
            sortable.option('disabled', true);
            enableMenuItems();
            finishButton.disabled = false;
            document.body.dataset.inEdit = false;
            document.removeEventListener('dblclick', closeMenus);
        }
        else { // User wants to edit menu
            showElement(controls);
            showElement(settingButton);
            removeButtons.forEach( button => {
                showElement(button);
                button.disabled = false;
            });
            editButtons.forEach( button => {
                showElement(button);
                button.disabled = false;
            });
            items.forEach( item => item.tabIndex = "-1");     
            sortable.option("disabled", false);
            disableMenuItems();
            finishButton.disabled = true;
            document.body.dataset.inEdit = true;
            document.addEventListener('dblclick', closeMenus);
        }
    });

};

var formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function finishOrder(event) {
    let completeButton = event.target || event;
    let items = document.querySelectorAll('li');
    let totalValue = document.querySelector('#total').dataset.total;
    let itemSummaryContainer = document.getElementById('order-summary-container');
    let backButton = editButton;
    const finishingOrder = document.body.dataset.finishingOrder === "true";

    if (totalValue == "0") {
    }
    else if (!settings['show_order_summary'])
        clearOrder();
    else if (finishingOrder) {
        clearOrder();
        showElement(document.querySelector('#order'));
        hideElement(itemSummaryContainer, 'margin-top');
        if (settings['change_calculator'])
            hideElement(document.querySelector('.change-container'), 'margin-top');
        items.forEach( item => item.tabIndex = "0");
        items[0].focus();
        document.body.dataset.finishingOrder = "false";
        completeButton.firstElementChild.innerText = "Complete";
    }
    else {
        items.forEach( item => item.tabIndex = "-1");
        document.body.dataset.finishingOrder = "true";
        hideElement(document.querySelector('#order'), 'margin-top');

        while (itemSummaryContainer.firstChild) {itemSummaryContainer.removeChild(itemSummaryContainer.firstChild);}
        let itemQuantity = 0;
        for (const [item, quantity] of Object.entries(orderQuantities)) {
            if (quantity != 0)
            {
                itemSummaryContainer.appendChild(itemSummaryEntry(item, quantity))
                itemQuantity++
            }
        }
        updateCurrentOrderSize(itemQuantity)
        showElement(itemSummaryContainer)
        
        if (settings['change_calculator'] != false)
        {
            clearChangeDue();
            showElement(document.querySelector('.change-container'))
            document.querySelector('input#cash').focus()
            document.querySelector('input#cash').scrollIntoView();
        }

        backButton.firstElementChild.innerText = "Back";
        completeButton.firstElementChild.innerText = "Finish";
    }
}

function continueOrder(backButton) {
    let items = document.querySelectorAll('li');
    let completeButton = backButton.nextElementSibling;
    showElement(document.querySelector('#order'));
    hideElement(document.querySelector('.change-container'), 'margin-top');
    hideElement(document.getElementById('order-summary-container'), 'margin-top');
    items.forEach( item => item.tabIndex = "0");
    items[0].focus();
    document.body.dataset.finishingOrder = "false";
    backButton.firstElementChild.innerText = "Clear";
    completeButton.firstElementChild.innerText = "Complete";

}

function clearOrder() {
    let total = document.querySelector('#total');
    document.querySelectorAll('[name="Quantity"]').forEach(input => {
        input.classList.add('fadeout');
        total.classList.add('fadeout');
        setTimeout(function () {
            input.value = 0;
            input.classList.remove('fadeout');
            total.classList.remove('fadeout');
            input.dispatchEvent(new Event('input'));
        }, 125);
    });
}

function reOrder() {
    let items = document.querySelectorAll('li');
    
    for (var i = 1; i <= numOfItems; i++)
    {
        let item = items[i - 1];
        let removeButton = item.firstElementChild;
        let editButton = item.children[1];

        item.dataset.order = i;
        removeButton.dataset.order = i - .75;
        editButton.dataset.order = i - .25;
    }

    updateFooterOrder()

}

function removeItem(event) {
    let removeButton = event.target || event;
    let listItem = removeButton.parentElement;
    let item = removeButton.parentElement.querySelector('input');        
    let totalDisp = document.querySelector('#total');
    let { name , price, quantity} = item.dataset;
    let { total } = totalDisp.dataset;
    let orderTotal = Number(total) - (quantity * price);
    let itemOrder = listItem.dataset.order;

    // Remove Item name and price from Storage
    names.splice(itemOrder - 1, 1);
    prices.splice(itemOrder - 1, 1);

    totalDisp.value = formatter.format(orderTotal);
    totalDisp.dataset.total = orderTotal;
    numOfItems = Number(numOfItems) - 1;
    delete orderQuantities[`${name}_${price}`]
    console.log(orderQuantities);
    updateNumberOfItemsStyle(numOfItems)

    listItem.classList.add('remove')
    listItem.addEventListener('transitionend', function hide(event) {
        if ((event.propertyName == 'margin-top'))
        {
            listItem.outerHTML = "";
            reOrder();
        }
    });
    
    saveData();
    removeButtons = document.querySelectorAll('.item-remove-button');
    editButtons = document.querySelectorAll('.item-edit-button');
}

function inputChange(event)
{
    let item = event.target || event;
    let totalDisp = document.querySelector('#total');
    let newQuantity = item.value;
    let { name, price, quantity} = item.dataset;
    let { total } = totalDisp.dataset;

    orderQuantities[`${name}_${price}`] = newQuantity;
    let orderTotal = Number(total) + (newQuantity * price) - (quantity * price);

    totalDisp.value = formatter.format(orderTotal);
    totalDisp.dispatchEvent(new Event('input'));
    totalDisp.dataset.total = orderTotal;
    item.dataset.quantity = newQuantity;
}

function editItem(event) {
    event.stopPropagation();
    let form = document.querySelector('.modal-edit-item')

    disableInputsForModal();
    document.body.dataset.currentModal = "editing";
    showElement(form);

    let editItemButton = event.target || event;
    let infoElement = editItemButton.nextElementSibling;
    
    let exitButton = form.querySelector('.x-button')
    let cancel = document.querySelector('#cancel-edit-item');
    let confirm = document.querySelector('#confirm-edit-item');
    let name = document.querySelector('#edited-item-name');
    let price = document.querySelector('#edited-item-price');


    name.value = infoElement.innerText;
    price.value = infoElement.dataset.price;
    name.focus();

    exitButton.addEventListener('click', cancelModal)

    cancel.addEventListener('click', function () {
        
        hideElement(form);
        exitButton.removeEventListener('click', cancelModal)
        confirm.removeEventListener('click', confirmEditItem);
        name.value = "";
        price.value = "";
        enableDefaultControls();
        document.body.dataset.currentModal = "";

    }, {once: true});

    confirm.addEventListener('click', confirmEditItem);
    confirm.dataset.previousItemName = infoElement.innerText
    confirm.dataset.previousPrice = infoElement.dataset.price

}

function settingHandler(event) {
    event.stopPropagation();
    let form = settingModal;

    disableInputsForModal();
    document.body.dataset.currentModal = "settings";
    showElement(form);

    let exitButton = form.querySelector('.x-button')
    let cancel = form.querySelector('.cancel');
    let confirm = form.querySelector('.confirm');
    
    exitButton.addEventListener('click', cancelModal)

    cancel.addEventListener('click', function()
    {
        hideElement(form);
        exitButton.removeEventListener('click', cancelModal)
        confirm.removeEventListener('click', confirmSaveSettings);
        setSettings();
        tempSettings = {...settings};
        enableDefaultControls();
        document.body.dataset.currentModal = "";
    }, { once: true })

    confirm.addEventListener('click', confirmSaveSettings);

}

function addHandler(event) {
    event.stopPropagation();
    let form = document.querySelector('.modal-add-item');

    disableInputsForModal();
    document.body.dataset.currentModal = "adding";
    showElement(form);
    
    let exitButton = form.querySelector('.x-button')
    let cancel = form.querySelector('#cancel-add-item');
    let confirm = form.querySelector('#confirm-add-item');
    let name = form.querySelector('#add-item-name');
    let price = form.querySelector('#add-item-price');

    name.focus();

    exitButton.addEventListener('click', cancelModal)

    cancel.addEventListener('click', function ()
    {
        
        hideElement(form);
        exitButton.removeEventListener('click', cancelModal)
        confirm.removeEventListener('click', confirmAddItem);
        name.value = "";
        price.value = "";
        enableDefaultControls();
        document.body.dataset.currentModal = "";

    }, { once: true });

    confirm.addEventListener('click', confirmAddItem);
}

function changeTheme(event)
{
    document.querySelector(`[data-theme-name="${theme}"`).disabled = false;
    event.currentTarget.disabled = true;
    theme = event.currentTarget.dataset.themeName;
    document.documentElement.dataset.theme = theme;
    saveData();
    updateTheme();
    updateThemeOrderAttr();
}

function settingButtonHandler(event)
{
    let setting = event.currentTarget;

    tempSettings[setting.id] = setting.checked;
}

function blankOrderHandler(event)
{
    console.log(event.target)
    let totalValue = event.target.value;

    if (totalValue == "$0.00")
    {
        document.body.dataset.blankOrder = "true";
        editButton.firstElementChild.innerText = "Edit";
    }
    else if (totalValue != "$0.00")
    {
        document.body.dataset.blankOrder = "false";
        editButton.firstElementChild.innerText = "Clear";
    }
}

function cashInput(event)
{
    let cashInput = event.target
    let changeInput = cashInput.parentElement.nextElementSibling.children[1]
    if (event.code == "Escape" || event.code == "Enter" || event.metaKey || event.ctrlKey) return;

    event.preventDefault();
    event.stopPropagation();

    if (!isFinite(event.key) && event.code != "Backspace" && event.code != "Period") return; // Invalid input

    if (isFinite(event.key))
        cashInput.value = formatter.format(Number(cashInput.value.replace(/[^0-9.-]+/g, '') * 10) + (event.key / 100));
    else if (event.altKey && event.code == "Backspace") {
        cashInput.value = formatter.format(0);
    }
    else if (event.code == "Backspace") {
        cashInput.value = formatter.format(Math.floor(Number(cashInput.value.replace(/[^0-9.-]+/g, '') * 10))  / 100);
    }
    else {
        cashInput.value = formatter.format((Number(cashInput.value.replace(/[^0-9.-]+/g, '') * 100)));
    }

    changeInput.value = formatter.format(Number(cashInput.value.replace(/[^0-9.-]+/g, '')) - document.querySelector('#total').dataset.total)
}



/* ---------------- */
/* ---------------- */
/* Helper Functions */
/* ---------------- */
/* ---------------- */



function incrementCounter(event) {
    let button = event.target || event;
    let item = button.previousElementSibling;
    item.stepUp();
    item.dispatchEvent(new Event('input'));
}

function decrementCounter(event) {
    let button = event.target || event;
    let item = button.nextElementSibling;
    item.stepDown();
    item.dispatchEvent(new Event('input'));
}

function cancelModal() {
    let modal = document.body.dataset.currentModal

    if (modal == "adding")
        document.querySelector('#cancel-add-item').click()
    else if (modal == "editing")
        document.querySelector('#cancel-edit-item').click()
    else if (modal == "settings")
        document.getElementById('cancel-settings-change').click()
}

function closeMenus(event) {
    if (document.body.dataset.currentModal)
    {
        if (!event.target.closest('.modal'))
            cancelModal();
    }
    else
    {
        if (!event.target.closest('.container') && !event.target.closest('#theme-picker') && !event.target.closest('.modal'))
            finished();
    }
}

function clearChangeDue() {
    document.querySelector('#change').value = "$0.00"
    document.querySelector('#cash').value = "$0.00"
}

function confirmEditItem(event)
{
    let form = document.querySelector('.modal-edit-item')
    let cancel = document.querySelector('#cancel-edit-item');
    let name = document.querySelector('#edited-item-name');
    let price = document.querySelector('#edited-item-price');

    if (!(name.value.trim().length) || !(price.value.length))
        cancel.dispatchEvent(new Event('click'));
    else // Edit old Item
    {

        let itemPos = names.indexOf(event.currentTarget.dataset.previousItemName);
        let menuItem = document.querySelector('[data-order="' + Number(itemPos + 1) + '"')

        // Format Price
        let fPrice = formatter.formatToParts(price.value);

        if (fPrice[1].type === "nan")
        {
            document.activeElement.blur();
            let errorDialog = document.querySelector('#alert-error')
            form.classList.add('modal-shake');
            confirm.disabled = true;
            errorDialog.textContent = "Enter a valid price for " + name.value
            errorDialog.classList.add('show')
            if (dialogTimers.errorTimer)
                clearTimeout(dialogTimers.errorTimer);
            dialogTimers.errorTimer = setTimeout(hideErrorDialog, 2500)
            form.addEventListener('animationend', function removeAnimation() {
                form.removeEventListener('animationend', removeAnimation);
                form.classList.remove('modal-shake');
                confirm.disabled = false;
                price.focus();
            });
            return;
        }

        fPrice[1].value = fPrice[1].value || '';

        let itemPrice = fPrice[1].value + fPrice[2].value + fPrice[3].value;

        if (document.getElementById(name.value.toLowerCase() + '_' + itemPrice))
        {
            document.activeElement.blur();
            let errorDialog = document.querySelector('#alert-error')
            form.classList.add('modal-shake');
            confirm.disabled = true;
            errorDialog.textContent = "Item already exists"
            errorDialog.classList.add('show')
            if (dialogTimers.errorTimer)
                clearTimeout(dialogTimers.errorTimer);
            dialogTimers.errorTimer = setTimeout(hideErrorDialog, 2500)
            form.addEventListener('animationend', function removeAnimation() {
                form.removeEventListener('animationend', removeAnimation);
                form.classList.remove('modal-shake');
                confirm.disabled = false;
                name.focus();
            });
            return;
        }

        // Edit old Item Element
        menuItem.children[0].ariaLabel = "Remove " + name.value + " Menu Item"
        menuItem.children[1].ariaLabel = "Edit " + name.value + " Menu Item"
        menuItem.children[2].dataset.price = itemPrice
        menuItem.children[2].innerText = name.value
        menuItem.children[3].children[0].ariaLabel = "Decrement " + name.value
        menuItem.children[3].children[1].ariaLabel = "Number of " + name.value
        menuItem.children[3].children[1].id = `${name.value.toLowerCase()}`
        menuItem.children[3].children[1].dataset.price = itemPrice
        menuItem.children[3].children[2].ariaLabel = "Increment " + name.value

        names[itemPos] = name.value;
        prices[itemPos] = itemPrice;
        setOrderQuantitiesObject();
        
        saveData();

        menuItem.children[3].children[1].dispatchEvent(new Event('input'));
        cancel.dispatchEvent(new Event('click'));
    }
}

function confirmSaveSettings(event)
{
    let form = event.currentTarget.parentElement.parentElement;
    let cancel = form.querySelector('.cancel');
    
    settings = {...tempSettings};
    saveData();

    cancel.dispatchEvent(new Event('click'));
}

function confirmAddItem(event)
{
    let form = document.querySelector('.modal-add-item');
    let list = document.querySelector('#order');
    let confirm = event.currentTarget;
    let cancel = document.querySelector('#cancel-add-item');
    let name = document.querySelector('#add-item-name');
    let price = document.querySelector('#add-item-price');

    if (!(name.value.trim().length) && !(price.value.length))
        cancel.dispatchEvent(new Event('click'));
    else if (!(name.value.trim().length))
    {
        document.activeElement.blur()
        let errorDialog = document.querySelector('#alert-error')
        form.classList.add('modal-shake');
        confirm.disabled = true;
        errorDialog.textContent = "Please enter an item name"
        errorDialog.classList.add('show')
        if (dialogTimers.errorTimer)
            clearTimeout(dialogTimers.errorTimer);
        dialogTimers.errorTimer = setTimeout(hideErrorDialog, 2500)
        form.addEventListener('animationend', function removeAnimation() {
            form.removeEventListener('animationend', removeAnimation);
            form.classList.remove('modal-shake');
            confirm.disabled = false;
            name.focus();
        });
        return;
    }
    else if (!(price.value.length))
    {
        document.activeElement.blur()
        let errorDialog = document.querySelector('#alert-error')
        form.classList.add('modal-shake');
        confirm.disabled = true;
        errorDialog.textContent = "Please enter a price for " + name.value
        errorDialog.classList.add('show')
        if (dialogTimers.errorTimer)
            clearTimeout(dialogTimers.errorTimer);
        dialogTimers.errorTimer = setTimeout(hideErrorDialog, 2500)
        form.addEventListener('animationend', function removeAnimation() {
            form.removeEventListener('animationend', removeAnimation);
            form.classList.remove('modal-shake');
            confirm.disabled = false;
            price.focus();
        });
        return;
    }
    else // Create and Add New Item
    {
        // Format Price
        let fPrice = formatter.formatToParts(price.value);

        if (fPrice[1].type === "nan")
        {
            document.activeElement.blur();
            let errorDialog = document.querySelector('#alert-error')
            form.classList.add('modal-shake');
            confirm.disabled = true;
            errorDialog.textContent = "Enter a valid price for " + name.value
            errorDialog.classList.add('show')
            if (dialogTimers.errorTimer)
                clearTimeout(dialogTimers.errorTimer);
            dialogTimers.errorTimer = setTimeout(hideErrorDialog, 2500)
            form.addEventListener('animationend', function removeAnimation() {
                form.removeEventListener('animationend', removeAnimation);
                form.classList.remove('modal-shake');
                confirm.disabled = false;
                price.focus();
            });
            return;
        }

        fPrice[1].value = fPrice[1].value || '';
        let itemPrice = fPrice[1].value + fPrice[2].value + fPrice[3].value;

        if (document.getElementById(name.value.toLowerCase()))
        {
            document.activeElement.blur()
            let errorDialog = document.querySelector('#alert-error')
            form.classList.add('modal-shake');
            confirm.disabled = true;
            errorDialog.textContent = "Item already exists"
            errorDialog.classList.add('show')
            if (dialogTimers.errorTimer)
                clearTimeout(dialogTimers.errorTimer);
            dialogTimers.errorTimer = setTimeout(hideErrorDialog, 2500)
            form.addEventListener('animationend', function removeAnimation() {
                form.removeEventListener('animationend', removeAnimation);
                form.classList.remove('modal-shake');
                confirm.disabled = false;
                name.focus();
            });
            return;
        }

        // Create Item Element
        let item = document.createElement('li');
        item.tabIndex = "-1";
        item.dataset.order = Number(numOfItems) + 1;
        item.innerHTML = createListItem(name.value, itemPrice, numOfItems);
        list.appendChild(item);

        names[numOfItems] = name.value;
        prices[numOfItems] = itemPrice;

        numOfItems = Number(numOfItems) + 1;
        orderQuantities[`${name.value}_${itemPrice}`] = 0;
        console.log(orderQuantities)
        updateNumberOfItemsStyle(numOfItems);
        saveData();

        name.value = "";
        price.value = "";
        updateFooterOrder();
        
        Array.from(list.lastChild.lastChild.children).forEach(input => {input.disabled = true;});
        addEventListenersItem(item);

        removeButtons = document.querySelectorAll('.item-remove-button');
        editButtons = document.querySelectorAll('.item-edit-button');
        
        name.focus();
    }
}

function itemSummaryEntry(name, quantity) {
    let itemEntry = document.createElement('div')
    let itemEntryName = document.createElement('h1')
    let itemEntryQuantity = document.createElement('h1')
    itemEntry.classList.add('summary-item-entry')
    itemEntryName.innerText = name.split('_')[0]
    itemEntryName.dataset.price = formatter.format(Number(name.split('_')[1])).split('$')[1]
    itemEntryQuantity.innerText = quantity
    itemEntry.appendChild(itemEntryName)
    itemEntry.appendChild(document.createElement('hr'))
    itemEntry.appendChild(itemEntryQuantity)
    return itemEntry;
}

function createListItem(nameInput, priceInput, orderInput)
{
    const name = escapeInput(nameInput)
    const price = escapeInput(priceInput)
    const order = escapeInput(orderInput)

    let listItem = `<button aria-label="Remove ${name} Menu Item" class="menu-item-control x-button item-remove-button hidden" data-order="${(Number(order) + .25)}" tabindex="0" disabled></button>
        <button aria-label="Edit ${name} Menu Item" class="menu-item-control item-edit-button hidden" data-order="${(Number(order) + .75)}" tabindex="0" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
            </svg>
        </button>
        <h2 data-price="${price}">${name}</h2>
        <div class="quantity">
            <button aria-label="Decrement ${name}" class="decrement" tabindex="-1"></button>
            <input aria-label="Number of ${name}" type="number" pattern="[0-9]*" inputmode="numeric" data-name="${name}" data-price="${price}" data-quantity="0" min="0" max="99" value="0" name="Quantity" id="${name.toLowerCase()}" tabindex="-1">
            <button aria-label="Increment ${name}" class="increment" tabindex="-1"></button>
        </div>`
    return listItem;
}

function updateFooterOrder()
{
    editButton.dataset.order = Number(numOfItems) + 1;
    editButton.nextElementSibling.dataset.order = Number(numOfItems) + 2;
}

function setSettings(init = false)
{
    if (init)
    {
        if (settings['show_order_summary'] == null)
            settings['show_order_summary'] = true;
        if (settings['change_calculator'] == null)
            settings['change_calculator'] = true;
        tempSettings = {...settings};
    }
    console.log(settings)
    for (const [setting, state] of Object.entries(settings)) {
        let settingCheckbox = document.getElementById(setting)
        settingCheckbox.checked = state;
        if (init) {
            settingCheckbox.addEventListener('click', settingButtonHandler)
        }
    }
}

function setOrderQuantitiesObject()
{
    clearOrderQuantities();
    for (var i = 0; i < numOfItems; i++)
    {
        orderQuantities[`${names[i]}_${prices[i]}`] = 0
    }
}

function clearOrderQuantities()
{
    for (var item in orderQuantities){
        if (orderQuantities.hasOwnProperty(item)){
            delete orderQuantities[item];
        }
    }
}

function addEventListenersItem(item)
{
    let removeButton = item.querySelector('.item-remove-button');
    let editItemButton = item.querySelector('.item-edit-button');
    let incrementButton = item.querySelector('.increment');
    let decrementButton = item.querySelector('.decrement');
    let totalTextArea = item.querySelector('input');

    // Add event listener for each button
    removeButton.addEventListener('click', removeItem);
    editItemButton.addEventListener('click', editItem);
    incrementButton.addEventListener('click', incrementCounter);
    decrementButton.addEventListener('click', decrementCounter);
    totalTextArea.addEventListener('input', inputChange);

}

function disableInputsForModal()
{
    let body = document.querySelector('body');
    let controls = document.querySelector('.controls').children;
    removeButtons.forEach( button => {
        hideElement(button);
        button.disabled = true;
    });
    editButtons.forEach( button => {
        hideElement(button);
        button.disabled = true;
    });
    body.classList.add('no-scroll');
    controls[0].disabled = true;
    controls[1].disabled = true;
    settingButton.disabled = true;
    editButton.disabled = true;
}

function enableDefaultControls()
{
    let body = document.querySelector('body');
    let controls = document.querySelector('.controls').children;
    removeButtons.forEach( button => {
        showElement(button);
        button.disabled = false;
    });
    editButtons.forEach( button => {
        showElement(button);
        button.disabled = false;
    });
    body.classList.remove('no-scroll');
    controls[0].disabled = false;
    controls[1].disabled = false;
    settingButton.disabled = false;
    editButton.disabled = false;
}

function showElement(element)
{
    element.classList.remove('hidden');
    element.offsetWidth;
    element.classList.add('show');
}

function hideElement(element, transition = 'any')
{
    element.classList.remove('show');
    element.addEventListener('transitionend', function hide(event) {
        if ((transition == "any" || event.propertyName == transition) && !element.matches('.show'))
        {
            element.classList.add('hidden');
            element.removeEventListener('transitionend', hide);
        }
    });
}

function disableMenuItems()
{
    Array.from(document.querySelectorAll('.quantity')).forEach( item => 
    {
        Array.from(item.children).forEach(input =>
        {
            input.disabled = true;
        }
        );
    } );
}

function enableMenuItems()
{
    Array.from(document.querySelectorAll('.quantity')).forEach( item => 
    {
        Array.from(item.children).forEach(input =>
        {
            input.disabled = false;
        }
        );
    } );
}

function moveItemUpList(item)
{
    let list = item.parentElement;
    list.insertBefore(item, item.previousElementSibling);
    item.focus();
}

function moveItemDownList(item)
{
    let list = item.parentElement;
    list.insertBefore(item.nextElementSibling, item);
    item.focus();
}

function reOrderStorage(oldIndex, newIndex)
{
    let itemName = names[oldIndex];
    let itemPrice = prices[oldIndex];
    names.splice(oldIndex, 1);
    prices.splice(oldIndex, 1);
    names.splice(newIndex, 0, itemName);
    prices.splice(newIndex, 0, itemPrice);
    saveData();
    setOrderQuantitiesObject();
    reOrder();
}

function outsideViewport(element) {
    var pos = element.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(pos.bottom > 0 && pos.bottom <= viewHeight - Number(getComputedStyle(document.body).getPropertyValue('--safe-area-bottom').split('px')[0]) && pos.top > 0 + Number(getComputedStyle(document.body).getPropertyValue('--safe-area-top').split('px')[0]) && pos.top <= viewHeight);
}

function updateTheme()
{
    switch(theme) {
        case 'light':
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff');
            break;
        case 'dark':
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#1c1c1c');
            break;
        case 'system':
            if (!window.matchMedia)
                document.querySelector('meta[name="theme-color"]').setAttribute('content', '#1c1c1c');
            else
            {
                if(window.matchMedia('(prefers-color-scheme: light').matches)
                    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff');
                else if (window.matchMedia('(prefers-color-scheme: dark').matches)
                    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#1c1c1c');
                else {
                    document.querySelector('meta[name="theme-color"]').setAttribute('content', window.getComputedStyle(document.body).getPropertyValue('background-color'));
                }
            }
            break;
    
    }
}

function updateThemeOrderAttr()
{
    let order = Number(settingModal.dataset.items) - 4;
    [ ...document.getElementById('theme-picker').children].forEach(theme => {
        theme.disabled ? (theme.dataset.settingOrder = "-1") : (theme.dataset.settingOrder = order++)
    })
}

function updateNumberOfItemsStyle(itemCount)
{
    document.querySelector(':root').style.setProperty('--num-of-items', Number(itemCount));
}

function updateCurrentOrderSize(itemCount)
{
    document.querySelector(':root').style.setProperty('--order-num-of-items', Number(itemCount));
}

function finished() { editButton.dispatchEvent(new Event('click')); };

function hideKeyPress() {
    screencastStates.keyPressedCurrently = false
    if (screencastStates.keyPressedCurrently == false) {
        let alertDialog = document.querySelector('#alert-default');

        alertDialog.classList.remove('show');

        alertDialog.addEventListener('transitionend', function hide(event) {
            if (event.propertyName === 'opacity' && !alertDialog.matches('.show'))
            {
                alertDialog.textContent = '';
                alertDialog.removeEventListener('transitionend', hide);
            }
        });
        
    }
}

function hideErrorDialog() {
    let alertDialog = document.querySelector('#alert-error');

    alertDialog.classList.remove('show');

    alertDialog.addEventListener('transitionend', function hide(event) {
        if (event.propertyName === 'opacity' && !alertDialog.matches('.show'))
        {
            alertDialog.textContent = '';
            alertDialog.removeEventListener('transitionend', hide);
        }
    });
}

function saveData() {
    localStorage.setItem('PoSData', JSON.stringify({numOfItems, names, prices, theme, settings}));
}

function escapeInput(input)
{
    return String(input)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
 }


/* -------------- */
/* -------------- */
/* Keyboard Input */
/* -------------- */
/* -------------- */

function keyboardMoveUp(currentPosition, decrement)
{
    let item = document.querySelector('[data-order="' + (Number(currentPosition) - decrement) + '"]');
    item.focus();
    if (outsideViewport(item))
        item.scrollIntoView();
}

function keyboardMoveDown(currentPosition, increment)
{
    let item = document.querySelector('[data-order="' + (Number(currentPosition) + increment) + '"]');
    item.focus();
    if (outsideViewport(item))
        item.scrollIntoView();
}

function focusSettingModal(position = 1)
{
    let item = document.querySelector(`[data-setting-order="${position}"]`);
    item.focus();
    if (outsideViewport(item))
        item.scrollIntoView();
}

document.addEventListener('keydown', press => {
    const UP = "ArrowUp";
    const LEFT = "ArrowLeft";
    const DOWN = "ArrowDown";
    const RIGHT = "ArrowRight";
    const W = "KeyW";
    const A = "KeyA";
    const S = "KeyS";
    const D = "KeyD";
    const ENTER = "Enter";
    const BACK = "Backspace";
    const EXIT = "Escape";

    const SPACEBETWEENMENUITEMS = 1.0
    const SPACEBETWEENITEMCONTROLS = 0.5
    const EDITBUTTONORDER = (Number(numOfItems) + 1)

    const currentElement = document.activeElement;
    const currentlyEditing = document.body.dataset.inEdit;
    const finishingOrder = document.body.dataset.finishingOrder;
    const currentModal = document.body.dataset.currentModal;

    let keyPressed = press.code;

    if (!keyPressed || keyPressed.indexOf('Numpad') != -1 || keyPressed.indexOf('Digit') != -1) {
        keyPressed = press.key;
        switch(press.key) {
            case 'w':
            case 'W':
                keyPressed = W;
                break;
            case 'a':
            case 'A':
                keyPressed = A;
                break;
            case 's':
            case 'S':
                keyPressed = S;
                break;
            case 'd':
            case 'D':
                keyPressed = D;
                break;
        }
    }

    if (currentElement instanceof HTMLInputElement && keyPressed != EXIT)
    {
        // Pass through only to known modal sources, avoid messing with extensions/scripts
        if (!currentElement.parentElement.matches('.modal-content') && !currentElement.parentElement.matches('.setting-entry') &&  !currentElement.matches('input#cash')) return;
    }

    if (screencastStates.showKeys)
    {
        let metaKey = ""
        let displayKey = press.key
        if (keyPressed.indexOf('Key') != -1)
            displayKey = displayKey.toUpperCase()
        else if (keyPressed == "ArrowUp")           { displayKey = "↑"}
        else if (keyPressed == "ArrowLeft")         { displayKey = "←"}
        else if (keyPressed == "ArrowRight")        { displayKey = "→"}
        else if (keyPressed == "ArrowDown")         { displayKey = "↓"}

        console.log("press.key: " + press.key + ", press.code: " + press.code + ", displayKey: " + displayKey)

        if (press.ctrlKey)
        {
            metaKey = metaKeys["control"]
            if (press.shiftKey)
                metaKey += " " + metaKeys["shift"]
            if (press.altKey)
                metaKey += " " + metaKeys["alt"]
            if (press.metaKey)
                metaKey += " " + metaKeys["meta"]

            if (press.key != "Control" && press.key != "Meta" && press.key != "Alt" && press.key != "Shift")
                displayKey = metaKey + " + " + displayKey
            else
                displayKey = metaKey
        }
        else if (press.metaKey)
        {
            metaKey = metaKeys["meta"]
            if (press.shiftKey)
                metaKey += " " + metaKeys["shift"]
            if (press.altKey)
                metaKey += " " + metaKeys["alt"]
            
            if (press.key != "Control" && press.key != "Meta" && press.key != "Alt" && press.key != "Shift")
                displayKey = metaKey + " + " + displayKey
            else
                displayKey = metaKey
        }
        else if (press.altKey)
        {
            metaKey = metaKeys["alt"]
            if (press.shiftKey)
                metaKey += " " + metaKeys["shift"]

            if (press.key != "Control" && press.key != "Meta" && press.key != "Alt" && press.key != "Shift")
                displayKey = metaKey + " + " + displayKey
            else
                displayKey = metaKey
        }

        document.querySelector("#alert-default").textContent = displayKey;
        if (screencastStates.keyPressedCurrently == true)
        {
            clearTimeout(dialogTimers.hideKeyPressTimer);
        }
        else
        {
            document.querySelector('#alert-default').classList.add('show');
            screencastStates.keyPressedCurrently = true;
        }

        dialogTimers.hideKeyPressTimer = setTimeout(hideKeyPress, 2500)

    }

    if (press.altKey && keyPressed == "KeyK")
    {
        screencastStates.showKeys = !screencastStates.showKeys;
        return;
    }

    if (finishingOrder == "true") // Order Total Shown, Menu Hidden
    {
        if (document.activeElement.isContentEditable) {
        }
        if (currentElement.parentElement.matches('.footer'))
        {
            const position = currentElement.dataset.order;

            switch(keyPressed) {
                case LEFT:
                case A:
                    if (position != Number(numOfItems) + 1)
                        keyboardMoveUp(position, SPACEBETWEENMENUITEMS)
                    break;
                case RIGHT:
                case D:
                    if (position != Number(numOfItems) + 2)
                        keyboardMoveDown(position, SPACEBETWEENMENUITEMS);
                    break;
                case EXIT:
                case BACK:
                    editButton.click();
            }
        }
        else
        {

            switch(keyPressed) {
                case LEFT:
                case A:
                case RIGHT:
                case D:
                    editButton.focus();
                    break;
                case EXIT:
                case BACK:
                    editButton.click();
                    break;
                case ENTER:
                    document.querySelector('.complete').click();
            }
        }
    }
    else if(currentlyEditing != "true") // Creating Order, setting item quantities
    {

        if (keyPressed == EXIT) {
            editButton.click();
            return;
        }

        if (currentElement.matches('li'))
        {
            const position = currentElement.dataset.order;

            if (isFinite(keyPressed)) {
                let numOfItems = currentElement.querySelector('input');
                numOfItems.value = (numOfItems.value == "0" ? keyPressed : numOfItems.value.slice(0, -1) + keyPressed)
                numOfItems.dispatchEvent(new Event('input'));
            }
            else
            {
                switch(keyPressed) {
                    case UP:
                    case W:
                        if (position != 1)
                            keyboardMoveUp(position, SPACEBETWEENMENUITEMS)
                        press.preventDefault();
                        break;
                    case DOWN:
                    case S:
                        keyboardMoveDown(position, SPACEBETWEENMENUITEMS)
                        press.preventDefault();
                        break;
                    case LEFT:
                    case A:
                        decrementCounter(currentElement.querySelector('.decrement'));
                        break;
                    case RIGHT:
                    case D:
                        incrementCounter(currentElement.querySelector('.increment'));
                        break;
                    case ENTER:
                        document.querySelector('.complete').click();
                        break;
                    case BACK:
                        let numOfItems = currentElement.querySelector('input');
                        numOfItems.value = (numOfItems.value.length == 1 ? 0 : numOfItems.value.slice(0, -1));
                        numOfItems.dispatchEvent(new Event('input'));
                        break;
                }
            }
        }
        else if (currentElement.parentElement.matches('.footer'))
        {
            const position = currentElement.dataset.order;

            switch(keyPressed) {
                case UP:
                case W:
                    document.querySelector('[data-order="' + numOfItems + '"]').focus();
                    press.preventDefault();
                    break;
                case LEFT:
                case A:
                    if (position != Number(numOfItems) + 1)
                        keyboardMoveUp(position, SPACEBETWEENMENUITEMS)
                    break;
                case RIGHT:
                case D:
                    if (position != Number(numOfItems) + 2)
                    keyboardMoveDown(position, SPACEBETWEENMENUITEMS)
                    break;
            }
        }
        else {
            if (keyPressed == UP || keyPressed == DOWN || keyPressed == LEFT || keyPressed == RIGHT || keyPressed == W || keyPressed == S || keyPressed == A || keyPressed == D) {
                document.querySelector('[data-order="1"]').focus();
                press.preventDefault();
            }
            else if (keyPressed == ENTER)
                document.querySelector('.complete').click();
        }
    }
    else if (currentModal == "settings")
    {
        
        let position = currentElement.dataset.settingOrder;
        let maxPosition = Number(settingModal.dataset.items) - 1;

        if (position == null)
        {

            switch (keyPressed)
            {
                case ENTER:
                    document.getElementById('confirm-settings-change').click();
                    break;
                case EXIT:
                    document.getElementById('cancel-settings-change').click();
                    break;
            }

            focusSettingModal();
            return;
        }

        console.log(position);

        switch (keyPressed)
        {
            case UP:
            case W:
                if (position == "0") return;
                focusSettingModal(Number(position) - 1);
                break;
            case DOWN:
            case S:
                if (position == maxPosition) return;
                focusSettingModal(Number(position) + 1);
                break;
            case LEFT:
            case A:
                if (currentElement.matches('input[type="checkbox"]'))
                    currentElement.checked == true && currentElement.click();
                else if (position != "0")
                    focusSettingModal(Number(position) - 1);
                break;
            case RIGHT:
            case D:
                if (currentElement.matches('input[type="checkbox"]'))
                    currentElement.checked == false && currentElement.click();
                else if (position != maxPosition)
                    focusSettingModal(Number(position) + 1);
                break;
            case ENTER:
                if (currentElement.matches('input[type="checkbox"]'))
                    document.getElementById('confirm-settings-change').click();
                else if (currentElement.disabled == true)
                    document.getElementById('confirm-settings-change').click();
                break;
            case EXIT:
                document.getElementById('cancel-settings-change').click();
                break;
        }
    }
    else if (currentModal == "adding" || currentModal == "editing") // Adding new menu item
    {
        switch(keyPressed)
        {
            case UP:
                if (currentElement.matches('#add-item-name') || currentElement.matches('#edited-item-name'))
                    currentElement.parentElement.previousElementSibling.focus();
                else if (currentElement.matches('#add-item-price') || currentElement.matches('#edited-item-price'))
                    currentElement.previousElementSibling.previousElementSibling.focus();
                else if (currentElement.matches('.cancel') || currentElement.matches('.confirm'))
                    currentElement.parentElement.previousElementSibling.children[3].focus();
                break;
            case LEFT:
                if (currentElement.matches('.cancel')) {
                    currentElement.parentElement.previousElementSibling.children[3].focus();
                    press.preventDefault();
                }
                else if (currentElement.matches('.confirm')) {
                    currentElement.previousElementSibling.focus();
                    press.preventDefault();
                }
                break;
            case DOWN:
                if (currentElement.matches('.x-button'))
                    currentElement.nextElementSibling.children[1].focus();
                else if (currentElement.matches('#add-item-name') || currentElement.matches('#edited-item-name'))
                    currentElement.nextElementSibling.nextElementSibling.focus();
                else if (currentElement.matches('#add-item-price') || currentElement.matches('#edited-item-price'))
                    currentElement.parentElement.nextElementSibling.children[0].focus();
                else if (currentElement.matches('.cancel'))
                    currentElement.nextElementSibling.focus();
                break;
            case RIGHT:
                if (currentElement.matches('.x-button')) {
                    currentElement.nextElementSibling.children[1].focus();
                    press.preventDefault();
                }
                else if (currentElement.matches('.cancel')) {
                    currentElement.nextElementSibling.focus();
                    press.preventDefault();
                }
                break;
            case ENTER:
                if (currentElement.matches('#add-item-name') || currentElement.matches('#edited-item-name'))
                    currentElement.nextElementSibling.nextElementSibling.focus();
                else if (currentElement.matches('#add-item-price') || currentElement.matches('#edited-item-price')) {
                    if (currentModal == "adding")
                        document.querySelector('#confirm-add-item').click();
                    else if (currentModal == "editing")
                        document.querySelector('#confirm-edit-item').click();
                }
                break;
            case EXIT:
                if (currentModal == "adding")
                    document.querySelector('#cancel-add-item').click();
                else if (currentModal == "editing")
                    document.querySelector('#cancel-edit-item').click();
                break;
        }
    }
    else if (currentlyEditing == "true") // Editing items, remove buttons and add item visible
    { 
        if (currentElement.matches('.item-remove-button'))
        {
            const position = currentElement.dataset.order;

            switch(keyPressed) {
                case UP:
                case W:
                    keyboardMoveUp(position, SPACEBETWEENMENUITEMS)
                    press.preventDefault();
                    break;
                case DOWN:
                case S:
                    if (position != Number(numOfItems) - .75)
                        keyboardMoveDown(position, SPACEBETWEENMENUITEMS)
                    else
                        editButton.focus();
                    press.preventDefault();
                    break;
                case RIGHT:
                case D:
                    keyboardMoveDown(position, SPACEBETWEENITEMCONTROLS)
                    press.preventDefault();
                    break;
                case LEFT:
                    press.preventDefault();
                    break;
                case EXIT:
                    finished();
                    break;
            }
        }
        else if (currentElement.matches('.item-edit-button'))
        {
            const position = currentElement.dataset.order;

            switch(keyPressed) {
                case UP:
                case W:
                    keyboardMoveUp(position, SPACEBETWEENMENUITEMS)
                    press.preventDefault();
                    break;
                case DOWN:
                case S:
                    if (position != Number(numOfItems) - .25)
                        keyboardMoveDown(position, SPACEBETWEENMENUITEMS)
                    else
                        editButton.focus();
                    press.preventDefault();
                    break;
                case LEFT:
                case A:
                    keyboardMoveUp(position, SPACEBETWEENITEMCONTROLS)
                    press.preventDefault();
                    break;
                case RIGHT:
                    press.preventDefault();
                    break;
                case EXIT:
                    finished();
                    break;
            }
        }
        else if (currentElement.parentElement.matches('.controls'))
        {
            const position = currentElement.dataset.order;
            switch(keyPressed) {
                case UP:
                case W:
                    keyboardMoveUp(-0.75, SPACEBETWEENITEMCONTROLS)
                    press.preventDefault();
                    break;
                case DOWN:
                case S:
                    keyboardMoveDown(position, SPACEBETWEENMENUITEMS)
                    press.preventDefault();
                    break;
                case LEFT:
                case A:
                    if (position != -0.75)
                        keyboardMoveUp(position, SPACEBETWEENITEMCONTROLS)
                    break;
                case RIGHT:
                case D:
                    if (position != -0.25)
                        keyboardMoveDown(position, SPACEBETWEENITEMCONTROLS)
                    break;
                case EXIT:
                    finished();
                    break;
            }
        }
        else if (currentElement.matches('.setting-svg-container'))
        {
            const position = currentElement.dataset.order;
            switch(keyPressed) {
                case DOWN:
                case S:
                    keyboardMoveDown(position, SPACEBETWEENMENUITEMS)
                    press.preventDefault();
                    break;
                case EXIT:
                    finished();
                    break;
            }
        }
        else if (currentElement.matches('.edit'))
        {
            if (keyPressed == UP || keyPressed == W) {
                document.querySelector('[data-order="' + (Number(numOfItems) - .75) + '"]').focus();
                press.preventDefault();
            }
            else if (keyPressed == EXIT)
                finished();
        }
        else {
            if (keyPressed == UP || keyPressed == DOWN || keyPressed == LEFT || keyPressed == RIGHT || keyPressed == W || keyPressed == S || keyPressed == A || keyPressed == D) {
                document.querySelector('[data-order="0.25"]').focus();
                press.preventDefault();
            }
            else if (keyPressed == EXIT)
                finished();
        }
    }
})

var metaKeys = {"meta": "Meta", "alt": "Alt", "control": "Ctrl", "shift": "Shift"}

if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent))
{
    metaKeys["meta"] = "⌘"
    metaKeys["alt"] = "⌥"
    metaKeys["control"] = "⌃"
    metaKeys["shift"] = "⇧"
}

var sortable = Sortable.create(document.querySelector('ul'), {
    onStart: function () {
		document.querySelector('.price_footer').classList.add('dragging');
	},
    onEnd: function(event) {
        document.querySelector('.price_footer').classList.remove('dragging');
        reOrderStorage(event.oldIndex, event.newIndex);
    },
    disabled: true,
    filter: '.menu-item-control, .menu-item-control svg',
    preventOnFilter: false,
    animation: 250,
});