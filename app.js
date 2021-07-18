var removeButtons;
var editButton;

var numItems = localStorage.getItem('numOfItems');

if(numItems == null)
    numItems = 0;

function incrementCounter(button) {
    let item = button.previousElementSibling;
    item.stepUp();
    item.dispatchEvent(new Event('input'));
}

function decrementCounter(button) {
    let item = button.nextElementSibling;
    item.stepDown();
    item.dispatchEvent(new Event('input'));
}

window.onload = function() {
    
    var items = document.querySelectorAll('[name="Quantity"]');
    editButton = document.querySelector('.edit');
    let done = document.querySelector('.finished');
    let add = document.querySelector('.add');
    let list = document.querySelector('.order');
    let finishButton = document.querySelector('.complete');

    done.addEventListener('click', finished);
    add.addEventListener('click', addHandler);

    //add previously saved items
    for (var i = 0; i < numItems; i++)
    {
        let item = document.createElement('li');
        item.tabIndex = 0;
        item.dataset.order = Number(i) + 1;
        item.innerHTML = createListItem(localStorage.getItem('itemName' + i), localStorage.getItem('itemPrice' + i), i);
        list.appendChild(item);
        list.lastChild.querySelector('input').addEventListener('input', event => {
            let totalDisp = document.querySelector('#total');
            let item = event.target;
            let newQuantity = item.value;
            let { price, quantity} = item.dataset;
            let { total } = totalDisp.dataset;
        
            let orderTotal = Number(total) + (newQuantity * price) - (quantity * price);
        
            totalDisp.value = formatter.format(orderTotal);
            totalDisp.dataset.total = orderTotal;
            item.dataset.quantity = newQuantity;
        })
    }

    removeButtons = document.querySelectorAll('.remove');

    editButton.dataset.order = Number(numItems) + 1;
    editButton.nextElementSibling.dataset.order = Number(numItems) + 2;

    editButton.addEventListener('click', event => {
        let editButton = event.target;
        let controls = document.querySelector('.controls');

        const currentlyEditing = editButton.dataset.inEdit;

        if (currentlyEditing == "true") {
            controls.classList.remove('show');
            removeButtons.forEach( button => {
                button.classList.remove('show');
                button.disabled = true;
            });
            finishButton.disabled = false;
            editButton.dataset.inEdit = false;
        }
        else {
            controls.classList.add('show');
            removeButtons.forEach( button => {
                button.classList.add('show');
                button.disabled = false;
            });
            finishButton.disabled = true;
            editButton.dataset.inEdit = true;
        }
    });

};

var formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function finishOrder() {
    let total = document.querySelector('#total');
    const inTransition = total.dataset.inTransition;

    if (inTransition == "true" || total.dataset.total == "0"){
    }
    else {
        total.dataset.inTransition = "true";
        document.querySelectorAll('[name="Quantity"]').forEach(input => {
            input.classList.add('hidden');
            total.classList.add('hidden');
            setTimeout(function () {
                input.value = 0;
                input.classList.remove('hidden');
                total.classList.remove('hidden');
                input.dispatchEvent(new Event('input'));            
                total.dataset.inTransition = "false";
            }, 125);
        });
    }
}

function changeValue(element, value) {
    
}

function reOrder() {
    let items = document.querySelectorAll('li');
    let editButton = document.querySelector('.edit');
    let confirmButton = document.querySelector('.complete');
    
    for (var i = 1; i <= numItems; i++)
    {
        let item = items[i - 1];
        let removeButton = item.firstElementChild;

        item.dataset.order = i;
        removeButton.dataset.order = i - .5;
    }

    editButton.dataset.order = Number(numItems) + 1;
    confirmButton.dataset.order = Number(numItems) + 2;

}

function remove(removeButton) {
    let listItem = removeButton.parentElement;
    let item = removeButton.parentElement.querySelector('input');        
    let totalDisp = document.querySelector('#total');
    let { price, quantity} = item.dataset;
    let { total } = totalDisp.dataset;
    let orderTotal = Number(total) - (quantity * price);
    let itemOrder = listItem.dataset.order;

    console.log(itemOrder);

    for (var i = itemOrder; i < numItems; i++)
    {
        //Next item and price
        let nextItem = localStorage.getItem('itemName' + i);
        let nextPrice = localStorage.getItem('itemPrice' + i);

        localStorage.setItem('itemName' + (Number(i) - 1), nextItem);
        localStorage.setItem('itemPrice' + (Number(i) - 1), nextPrice);
    }

    totalDisp.value = formatter.format(orderTotal);
    totalDisp.dataset.total = orderTotal;
    numItems = Number(numItems) - 1;

    localStorage.removeItem('itemName' + numItems);
    localStorage.removeItem('itemPrice' + numItems);

    listItem.outerHTML = "";
    localStorage.setItem('numOfItems', numItems);
    items = document.querySelectorAll('[name="Quantity"]');
    console.log(items);
    reOrder();
    removeButtons = document.querySelectorAll('.remove');
}

function finished(event) {
    document.querySelector('.edit').dispatchEvent(new Event('click'));
};

function addHandler(event) {
    let form = document.querySelector('.addItem');
    let list = document.querySelector('.order');
    let controls = document.querySelector('.controls').children;
    let items = document.querySelectorAll('li');

    removeButtons.forEach( button => {
        button.classList.remove('show');
        button.disabled = true;
    });

    items.forEach( item => item.tabIndex = "-1");

    controls[0].disabled = true;
    controls[1].disabled = true;

    form.dataset.adding = "true";
    editButton.disabled = true;

    form.classList.add('show');
    let cancel = document.querySelector('.cancel');
    let confirm = document.querySelector('.confirm');
    let name = document.querySelector('#item');
    let price = document.querySelector('#price');
    name.focus();
    cancel.addEventListener('click', function cancel(event) {
        form.classList.remove('show');
        confirm.removeEventListener('click', confirm);

        name.value = "";
        price.value = "";

        removeButtons.forEach( button => {
            button.classList.add('show');
            button.disabled = false;
        });
        items.forEach( item => item.tabIndex = "0");
        controls[0].disabled = false;
        controls[1].disabled = false;
        form.dataset.adding = "false";
        editButton.disabled = false;
    });
    confirm.addEventListener('click', function confirm(event) {
        if (!(name.value.trim().length) && !(price.value.length)) {
            cancel.dispatchEvent(new Event('click'));
        }
        else if (!(name.value.trim().length) || !(price.value.length)) {
        }
        else {
            let fPrice = formatter.formatToParts(price.value);
            if (fPrice[1].value == 0)
                fPrice[1].value = '';
            let item = document.createElement('li');
            item.tabIndex = 0;
            item.dataset.order = Number(numItems) + 1;
            item.innerHTML = createListItem(name.value, fPrice[1].value + fPrice[2].value + fPrice[3].value, numItems);
            list.appendChild(item);
            localStorage.setItem('itemName' + numItems, name.value);
            localStorage.setItem('itemPrice' + numItems, fPrice[1].value + fPrice[2].value + fPrice[3].value);
            name.value = "";
            price.value = "";
            numItems = Number(numItems) + 1;
            localStorage.setItem('numOfItems', numItems);
            editButton.dataset.order = Number(numItems) + 1;
            editButton.nextElementSibling.dataset.order = Number(numItems) + 2;
            list.lastChild.querySelector('input').addEventListener('input', event => {
                let totalDisp = document.querySelector('#total');
                let item = event.target;
                let newQuantity = item.value;
                let { price, quantity} = item.dataset;
                let { total } = totalDisp.dataset;
            
                let orderTotal = Number(total) + (newQuantity * price) - (quantity * price);
            
                totalDisp.value = formatter.format(orderTotal);
                totalDisp.dataset.total = orderTotal;
                item.dataset.quantity = newQuantity;
            })
            removeButtons = document.querySelectorAll('.remove');
        }
    });
    
}

function createListItem(name, price, order)
{
    let listItem = `        <button onclick="remove(this)" class="remove" data-order="` + (Number(order) + .5) + `" tabindex="0" disabled></button>
        <h2 data-price="` + price + `">` + name + `</h2>
        <div class="quantity">
            <button onclick="decrementCounter(this)" class="decrement" tabindex="-1"></button>
            <input type="number" pattern="[0-9]*" inputmode="numeric" data-price="` + price + `" data-quantity="0" min="0" max="99" value="0" name="Quantity" id="` + name.toLowerCase() + `" tabindex="-1">
            <button onclick="incrementCounter(this)" class="increment" tabindex="-1"></button>
        </div>`
    return listItem;
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
    const SPACE = "Space";
    const ENTER = "Enter";
    const currentElement = document.activeElement;
    const currentlyEditing = editButton.dataset.inEdit;
    const addingItem = document.querySelector('.addItem').dataset.adding;

    let keyPressed = press.code;

    if (!keyPressed || keyPressed.indexOf('Numpad') != -1) {
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

    if(currentlyEditing != "true")
    {
        if (currentElement.matches('li'))
        {
            const position = currentElement.dataset.order;

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
            }
        }
        else if (currentElement.parentElement.matches('.footer'))
        {
            const position = currentElement.dataset.order;

            switch(keyPressed) {
                case UP:
                case W:
                    document.querySelector('[data-order="' + numItems + '"]').focus();
                    break;
                case DOWN:
                case S:
                    break;
                case LEFT:
                case A:
                    if (position != Number(numItems) + 1)
                        document.querySelector('[data-order="' + (Number(position) - 1) + '"]').focus();
                    break;
                case RIGHT:
                case D:
                    if (position != Number(numItems) + 2)
                        document.querySelector('[data-order="' + (Number(position) + 1) + '"]').focus();
                    break;
            }
        }
        else {
            if (keyPressed == UP || keyPressed == DOWN || keyPressed == LEFT || keyPressed == RIGHT || keyPressed == W || keyPressed == S || keyPressed == A || keyPressed == D)
                document.querySelector('[data-order="1"]').focus();
        }
    }
    else if (addingItem == "true") {
        if (keyPressed == ENTER) {
            if (currentElement.matches('#item'))
                document.querySelector('#price').focus();
            else if (currentElement.matches('#price'))
                document.querySelector('.confirm').click();
        }
    }
    else {
        if (currentElement.matches('li') || currentElement.matches('.remove'))
        {
            const position = currentElement.dataset.order;

            switch(keyPressed) {
                case UP:
                case W:
                    document.querySelector('[data-order="' + (Number(position) - .5) + '"]').focus();
                    break;
                case DOWN:
                case S:
                    if (position != (numItems))
                        document.querySelector('[data-order="' + (Number(position) + .5) + '"]').focus();
                    break;
                case LEFT:
                case A:
                    decrementCounter(currentElement.querySelector('.decrement'));
                    break;
                case RIGHT:
                case D:
                    incrementCounter(currentElement.querySelector('.increment'));
                    break;
            }
        }
        else if (currentElement.parentElement.matches('.controls'))
        {
            const position = currentElement.dataset.order;
            switch(keyPressed) {
                case UP:
                case W:
                    break;
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
            }
        }
        else {
            if (keyPressed == UP || keyPressed == DOWN || keyPressed == LEFT || keyPressed == RIGHT || keyPressed == W || keyPressed == S || keyPressed == A || keyPressed == D)
                document.querySelector('[data-order="1"]').focus();
        }
    }
})