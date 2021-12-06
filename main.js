import Sortable from 'sortablejs';

var el = document.querySelector('ul');
var sortable = Sortable.create(el, {
    onStart: function (evt) {
		document.querySelector('.price_footer').classList.add('dragging');
	},
    onEnd: function(evt) {
        document.querySelector('.price_footer').classList.remove('dragging');
        reOrderStorage(evt.oldIndex, evt.newIndex);
    },
    disabled: true,
    filter: '.remove'
});

var removeButtons;
var editButton;

var data = JSON.parse(localStorage.getItem('PoSData')) || {numOfItems: 0, names: [], prices: [], theme: "system"};
var {numOfItems, names, prices, theme} = data;

theme = theme || "system";

document.querySelector(':root').dataset.theme = theme;
document.querySelector(':root').style.setProperty('--num-of-items', Number(numOfItems));

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

window.onload = function() {
    
    editButton = document.querySelector('.edit');
    let done = document.querySelector('.finished');
    let add = document.querySelector('.add');
    let list = document.querySelector('.order');
    let finishButton = document.querySelector('.complete');
    let themeButtons = document.querySelectorAll('.theme-button');

    done.addEventListener('click', finished);
    add.addEventListener('click', addHandler);
    finishButton.addEventListener('click', finishOrder);
    themeButtons.forEach(button => { button.addEventListener('click', changeTheme); });

    //add previously saved items
    for (var i = 0; i < numOfItems; i++)
    {
        let item = document.createElement('li');
        item.tabIndex = 0;
        item.dataset.order = Number(i) + 1;
        item.innerHTML = createListItem(names[i], prices[i], i);
        list.appendChild(item);
        addEventListenersItem(item);
    }
    showElement(list);

    removeButtons = document.querySelectorAll('.remove');

    editButton.dataset.order = Number(numOfItems) + 1;
    editButton.nextElementSibling.dataset.order = Number(numOfItems) + 2;

    editButton.addEventListener('click', event => {
        let editButton = event.target;
        let controls = document.querySelector('.controls');
        let items = document.querySelectorAll('li');
        let themeControls = document.querySelector('.theme-picker');

        const currentlyEditing = editButton.dataset.inEdit;
        const finishingOrder = document.querySelector('.total').dataset.inTransition;

        if (finishingOrder == "true") { // User doesn't want to clear order
            continueOrder(editButton);
        }
        else if (currentlyEditing == "true") { // User wants to exit edit mode
            hideElement(controls, 'any');
            hideElement(themeControls, 'margin-top');
            removeButtons.forEach( button => {
                hideElement(button, 'any');
                button.disabled = true;
            });
            items.forEach( item => item.tabIndex = "0");
            sortable.option('disabled', true);
            enableMenuItems();
            finishButton.disabled = false;
            editButton.dataset.inEdit = false;
        }
        else { // User wants to edit menu
            showElement(controls);
            showElement(themeControls);
            removeButtons.forEach( button => {
                showElement(button);
                button.disabled = false;
            });
            items.forEach( item => item.tabIndex = "-1");     
            sortable.option("disabled", false);
            disableMenuItems();
            finishButton.disabled = true;
            editButton.dataset.inEdit = true;
        }
    });

};

var formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function finishOrder(event) {
    let completeButton = event.target || event;
    let items = document.querySelectorAll('li');
    let total = document.querySelector('.total');
    let totalValue = document.querySelector('#total').dataset.total;
    let container = document.querySelector('.container');
    let backButton = completeButton.previousElementSibling;
    const inTransition = total.dataset.inTransition;

    if (totalValue == "0") {
    }
    else if (inTransition == "true") {
        clearOrder();
        showElement(document.querySelector('.order'));
        items.forEach( item => item.tabIndex = "0");
        total.dataset.inTransition = "false";
        backButton.firstElementChild.innerText = "Edit";
        completeButton.firstElementChild.innerText = "Complete";
    }
    else {
        items.forEach( item => item.tabIndex = "-1");
        total.dataset.inTransition = "true";
        hideElement(document.querySelector('.order'), 'margin-top');
        backButton.firstElementChild.innerText = "Back";
        completeButton.firstElementChild.innerText = "Finish";
    }
}

function continueOrder(backButton) {
    let items = document.querySelectorAll('li');
    let total = document.querySelector('.total');
    let container = document.querySelector('.container');
    let completeButton = backButton.nextElementSibling;
    showElement(document.querySelector('.order'));
    items.forEach( item => item.tabIndex = "0");
    total.dataset.inTransition = "false";
    backButton.firstElementChild.innerText = "Edit";
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
    let editButton = document.querySelector('.edit');
    let confirmButton = document.querySelector('.complete');
    
    for (var i = 1; i <= numOfItems; i++)
    {
        let item = items[i - 1];
        let removeButton = item.firstElementChild;

        item.dataset.order = i;
        removeButton.dataset.order = i - .5;
    }

    editButton.dataset.order = Number(numOfItems) + 1;
    confirmButton.dataset.order = Number(numOfItems) + 2;

}

function remove(event) {
    let removeButton = event.target || event;
    let listItem = removeButton.parentElement;
    let item = removeButton.parentElement.querySelector('input');        
    let totalDisp = document.querySelector('#total');
    let { price, quantity} = item.dataset;
    let { total } = totalDisp.dataset;
    let orderTotal = Number(total) - (quantity * price);
    let itemOrder = listItem.dataset.order;

    // Remove Item name and price from Storage
    names.splice(itemOrder - 1, 1);
    prices.splice(itemOrder - 1, 1);

    totalDisp.value = formatter.format(orderTotal);
    totalDisp.dataset.total = orderTotal;
    numOfItems = Number(numOfItems) - 1;
    document.documentElement.style.setProperty('--num-of-items', Number(numOfItems));

    listItem.outerHTML = "";
    localStorage.setItem('PoSData', JSON.stringify({numOfItems, names, prices, theme}));
    reOrder();
    removeButtons = document.querySelectorAll('.remove');
}

function inputChange(event)
{
    let item = event.target || event;
    let totalDisp = document.querySelector('#total');
    let newQuantity = item.value;
    let { price, quantity} = item.dataset;
    let { total } = totalDisp.dataset;

    let orderTotal = Number(total) + (newQuantity * price) - (quantity * price);

    totalDisp.value = formatter.format(orderTotal);
    totalDisp.dataset.total = orderTotal;
    item.dataset.quantity = newQuantity;
}

function addHandler() {
    let form = document.querySelector('.addItem');
    let list = document.querySelector('.order');

    disableInputsAddHandler();
    form.dataset.adding = "true";
    showElement(form);
    
    let cancel = document.querySelector('#cancel-add-item');
    let confirm = document.querySelector('#confirm-add-item');
    let name = document.querySelector('#item');
    let price = document.querySelector('#price');

    name.focus();

    cancel.addEventListener('click', function () {
        
        hideElement(form, 'any');
        confirm.removeEventListener('click', confirmAddItem);
        name.value = "";
        price.value = "";
        enableInputsAddHandler();
        form.dataset.adding = "false";

    }, {once: true});

    confirm.addEventListener('click', confirmAddItem);   
}

function changeTheme(event)
{
    theme = event.currentTarget.dataset.themeName;
    document.querySelector(':root').dataset.theme = theme;
    localStorage.setItem('PoSData', JSON.stringify({numOfItems, names, prices, theme}));
    console.log(event.currentTarget); 
}


/* ---------------- */
/* ---------------- */
/* Helper Functions */
/* ---------------- */
/* ---------------- */

function confirmAddItem() {
    let form = document.querySelector('.addItem');
    let list = document.querySelector('.order');
    let cancel = document.querySelector('#cancel-add-item');
    let name = document.querySelector('#item');
    let price = document.querySelector('#price');

    if (!(name.value.trim().length) && !(price.value.length))
        cancel.dispatchEvent(new Event('click'));
    else if (!(name.value.trim().length) || !(price.value.length))
    {}
    else // Create and Add New Item
    {
        // Format Price
        let fPrice = formatter.formatToParts(price.value);
        fPrice[1].value = fPrice[1].value || '';

        // Create Item Element
        let item = document.createElement('li');
        item.tabIndex = "-1";
        item.dataset.order = Number(numOfItems) + 1;
        item.innerHTML = createListItem(name.value, fPrice[1].value + fPrice[2].value + fPrice[3].value, numOfItems);
        list.appendChild(item);

        names[numOfItems] = name.value;
        prices[numOfItems] = fPrice[1].value + fPrice[2].value + fPrice[3].value;

        numOfItems = Number(numOfItems) + 1;
        document.documentElement.style.setProperty('--num-of-items', Number(numOfItems));
        localStorage.setItem('PoSData', JSON.stringify({numOfItems, names, prices, theme}));

        name.value = "";
        price.value = "";
        editButton.dataset.order = Number(numOfItems) + 1;
        editButton.nextElementSibling.dataset.order = Number(numOfItems) + 2;
        
        Array.from(list.lastChild.lastChild.children).forEach(input => {input.disabled = true;});
        addEventListenersItem(item);

        removeButtons = document.querySelectorAll('.remove');
        
        name.focus();
    }
}

function createListItem(name, price, order)
{
    let listItem = `        <button class="remove hidden" data-order="` + (Number(order) + .5) + `" tabindex="0" disabled></button>
        <h2 data-price="` + price + `">` + name + `</h2>
        <div class="quantity">
            <button class="decrement" tabindex="-1"></button>
            <input type="number" pattern="[0-9]*" inputmode="numeric" data-price="` + price + `" data-quantity="0" min="0" max="99" value="0" name="Quantity" id="` + name.toLowerCase() + `" tabindex="-1">
            <button class="increment" tabindex="-1"></button>
        </div>`
    return listItem;
}

function addEventListenersItem(item)
{
    let removeButton = item.querySelector('.remove');
    let incrementButton = item.querySelector('.increment');
    let decrementButton = item.querySelector('.decrement');
    let totalTextArea = item.querySelector('input');

    // Add event listener for each button
    removeButton.addEventListener('click', remove);
    incrementButton.addEventListener('click', incrementCounter);
    decrementButton.addEventListener('click', decrementCounter);
    totalTextArea.addEventListener('input', inputChange);

}

function disableInputsAddHandler()
{
    let body = document.querySelector('body');
    let controls = document.querySelector('.controls').children;
    removeButtons.forEach( button => {
        hideElement(button, 'any');
        button.disabled = true;
    });
    body.classList.add('no-scroll');
    controls[0].disabled = true;
    controls[1].disabled = true;
    editButton.disabled = true;
}

function enableInputsAddHandler()
{
    let body = document.querySelector('body');
    let controls = document.querySelector('.controls').children;
    removeButtons.forEach( button => {
        showElement(button);
        button.disabled = false;
    });
    body.classList.remove('no-scroll');
    controls[0].disabled = false;
    controls[1].disabled = false;
    editButton.disabled = false;
}

function showElement(element)
{
    element.classList.remove('hidden');
    element.offsetWidth;
    element.classList.add('show');
}

function hideElement(element, transition)
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
    localStorage.setItem('PoSData', JSON.stringify({numOfItems, names, prices, theme}));
    reOrder();
}

function finished() { document.querySelector('.edit').dispatchEvent(new Event('click')); };


/* -------------- */
/* -------------- */
/* Keyboard Input */
/* -------------- */
/* -------------- */


document.addEventListener('keydown', press => {
    const UP = "ArrowUp";
    const LEFT = "ArrowLeft";
    const DOWN = "ArrowDown";
    const RIGHT = "ArrowRight";
    const W = "KeyW";
    const A = "KeyA";
    const S = "KeyS";
    const D = "KeyD";
    const SPACE = "Space";
    const ENTER = "Enter";
    const BACK = "Backspace";
    const EXIT = "Escape";
    const currentElement = document.activeElement;
    const currentlyEditing = editButton.dataset.inEdit;
    const finishingOrder = document.querySelector('.total').dataset.inTransition;
    const addingItem = document.querySelector('.addItem').dataset.adding;

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

    if (finishingOrder == "true")
    {
        if (currentElement.parentElement.matches('.footer'))
        {
            const position = currentElement.dataset.order;

            switch(keyPressed) {
                case LEFT:
                case A:
                    if (position != Number(numOfItems) + 1)
                        document.querySelector('[data-order="' + (Number(position) - 1) + '"]').focus();
                    break;
                case RIGHT:
                case D:
                    if (position != Number(numOfItems) + 2)
                        document.querySelector('[data-order="' + (Number(position) + 1) + '"]').focus();
                    break;
                case BACK:
                    document.querySelector('.edit').click();
            }
        }
        else
        {

            switch(keyPressed) {
                case LEFT:
                case A:
                case RIGHT:
                case D:
                    document.querySelector('[data-order="' + (Number(numOfItems) + 1) + '"]').focus();
                    break;
                case BACK:
                    document.querySelector('.edit').click();
                    break;
                case ENTER:
                    document.querySelector('.complete').click();
            }
        }
    }
    else if(currentlyEditing != "true")
    {
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
                            document.querySelector('[data-order="' + (Number(position) - 1) + '"]').focus();
                        break;
                    case DOWN:
                    case S:
                        document.querySelector('[data-order="' + (Number(position) + 1) + '"]').focus();
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
                    break;
                case LEFT:
                case A:
                    if (position != Number(numOfItems) + 1)
                        document.querySelector('[data-order="' + (Number(position) - 1) + '"]').focus();
                    break;
                case RIGHT:
                case D:
                    if (position != Number(numOfItems) + 2)
                        document.querySelector('[data-order="' + (Number(position) + 1) + '"]').focus();
                    break;
            }
        }
        else {
            if (keyPressed == UP || keyPressed == DOWN || keyPressed == LEFT || keyPressed == RIGHT || keyPressed == W || keyPressed == S || keyPressed == A || keyPressed == D)
                document.querySelector('[data-order="1"]').focus();
            else if (keyPressed == ENTER)
                document.querySelector('.complete').click();
        }
    }
    else if (addingItem == "true") {
        if (keyPressed == ENTER) {
            if (currentElement.matches('#item'))
                document.querySelector('#price').focus();
            else if (currentElement.matches('#price'))
                document.querySelector('#confirm-add-item').click();
        }
        else if (keyPressed == EXIT)
            document.querySelector('#cancel-add-item').click();
    }
    else {
        if (currentElement.matches('.remove'))
        {
            const position = currentElement.dataset.order;

            switch(keyPressed) {
                case UP:
                case W:
                    if (position != 0.5)
                        document.querySelector('[data-order="' + (Number(position) - 1) + '"]').focus();
                    else
                        document.querySelector('.finished').focus();
                    break;
                case DOWN:
                case S:
                    if (position != Number(numOfItems) - .5)
                        document.querySelector('[data-order="' + (Number(position) + 1) + '"]').focus();
                    else
                        document.querySelector('.edit').focus();
                    break;
                case LEFT:
                case A:
                    document.querySelector('[data-order="' + (Number(position) + .5) + '"]').focus();
                    break;
                case EXIT:
                    finished();
                    break;
            }
        }
        else if (currentElement.matches('li'))
        {
            const position = currentElement.dataset.order;

            switch(keyPressed) {
                case UP:
                case W:
                    if (position != 1)
                    {
                        moveItemUpList(currentElement);
                        reOrderStorage(position - 1, position - 2);
                    }
                    else
                        document.querySelector('[data-order="' + (Number(position) - .5) + '"]').focus();
                    break;
                case DOWN:
                case S:
                    if (position != Number(numOfItems))
                    {
                        moveItemDownList(currentElement);
                        reOrderStorage(position - 1, position);
                    }
                    else
                        document.querySelector('.edit').focus();
                    break;
                case RIGHT:
                case D:
                    document.querySelector('[data-order="' + (Number(position) - .5) + '"]').focus();
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
                case DOWN:
                case S:
                    document.querySelector('[data-order="0.5"]').focus();
                    break;
                case LEFT:
                case A:
                    if (position != -0.5)
                        document.querySelector('[data-order="' + (Number(position) - .5) + '"]').focus();
                    break;
                case RIGHT:
                case D:
                    if (position != 0)
                        document.querySelector('[data-order="' + (Number(position) + .5) + '"]').focus();
                    break;
                case EXIT:
                    finished();
                    break;
            }
        }
        else if (currentElement.matches('.edit'))
        {
            if (keyPressed == UP)
                document.querySelector('[data-order="' + (Number(numOfItems) - .5) + '"]').focus();
            else if (keyPressed == EXIT)
                finished();
        }
        else {
            if (keyPressed == UP || keyPressed == DOWN || keyPressed == LEFT || keyPressed == RIGHT || keyPressed == W || keyPressed == S || keyPressed == A || keyPressed == D)
                document.querySelector('[data-order="0.5"]').focus();
            else if (keyPressed == EXIT)
                finished();
        }
    }
})