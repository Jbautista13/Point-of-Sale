window.onload = function() {
    
    var items = document.querySelectorAll('[name="Quantity"]');
    var incrementCounters = document.querySelectorAll('.increment');
    var decrementCounters = document.querySelectorAll('.decrement');
    var editButton = document.querySelector('.edit');
    var removeButtons = document.querySelectorAll('.remove');

    items.forEach( item => item.addEventListener('input', event => {
        let totalDisp = document.querySelector('#total');
        let item = event.target;
        
        let newQuantity = item.value;
        let { price, quantity} = item.dataset;
        let { total } = totalDisp.dataset;

        let orderTotal = Number(total) + (newQuantity * price) - (quantity * price);

        totalDisp.value = formatter.format(orderTotal);
        totalDisp.dataset.total = orderTotal;
        item.dataset.quantity = newQuantity;
    }));

    incrementCounters.forEach( counter => counter.addEventListener('click', event => {
        let item = event.target.previousElementSibling;

        item.stepUp();
        item.dispatchEvent(new Event('input'));
    }));

    decrementCounters.forEach( counter => counter.addEventListener('click', event => {
        let item = event.target.nextElementSibling;

        item.stepDown();
        item.dispatchEvent(new Event('input'));
    }));

    editButton.addEventListener('click', event => {
        let editButton = event.target;
        let controls = document.querySelector('.controls');
        let done = document.querySelector('.finished');
        let add = document.querySelector('.add');

        const currentlyEditing = editButton.dataset.inEdit;

        if (currentlyEditing == "true") {
            controls.classList.remove('show');
            removeButtons.forEach( button => button.classList.remove('show'));
            editButton.dataset.inEdit = false;
            done.removeEventListener('click', finished);
            add.removeEventListener('click', add);
            removeButtons.forEach( button => button.removeEventListener('click', remove));
        }
        else {

            removeButtons.forEach( button => button.addEventListener('click', function remove(event) {
                let listItem = event.target.parentElement;
                let item = event.target.parentElement.querySelector('input');        
                let totalDisp = document.querySelector('#total');
        
                let { price, quantity} = item.dataset;
                let { total } = totalDisp.dataset;
        
                let orderTotal = Number(total) - (quantity * price);
        
                totalDisp.value = formatter.format(orderTotal);
                totalDisp.dataset.total = orderTotal;
        
                listItem.outerHTML = "";
                items = document.querySelectorAll('[name="Quantity"]');
                console.log(items);        
            }))

            controls.classList.add('show');
            removeButtons.forEach( button => button.classList.add('show'));
            editButton.dataset.inEdit = true;

            done.addEventListener('click', function finished(event) {
                editButton.dispatchEvent(new Event('click'));
            });

            add.addEventListener('click', function add(event) {
                let form = document.querySelector('.addItem');
                let list = document.querySelector('.order');

                form.classList.add('show');

                let cancel = document.querySelector('.cancel');
                let confirm = document.querySelector('.confirm');
                let name = document.querySelector('#item');
                let price = document.querySelector('#price');

                cancel.addEventListener('click', function cancel(event) {
                    form.classList.remove('show');
                    confirm.removeEventListener('click', confirm);
                });

                confirm.addEventListener('click', function confirm(event) {
                    if ( !(name.value.trim().length) || !(price.value.length)) {
                    }
                    else {
                        let item = document.createElement('li');
                        item.innerHTML = createListItem(name.value, price.value);
                        list.appendChild(item);
                        name.value = "";
                        price.value = "";

                        let incrementCounter = list.lastChild.querySelector('.increment');
                        let decrementCounter = list.lastChild.querySelector('.decrement');

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

                        incrementCounter.addEventListener('click', event => {
                            let item = event.target.previousElementSibling;
                    
                            item.stepUp();
                            item.dispatchEvent(new Event('input'));
                        });

                        decrementCounter.addEventListener('click', event => {
                            let item = event.target.nextElementSibling;
                    
                            item.stepDown();
                            item.dispatchEvent(new Event('input'));
                        });

                        removeButtons = document.querySelectorAll('.remove');

                    }
                });
            });

        }
    });

};

var formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function createListItem(name, price)
{
    let listItem = `        <button class="remove"></button>
        <h2 data-price="` + price + `">` + name + `</h2>
        <div class="quantity">
            <button class="decrement"></button>
            <input type="number" pattern="[0-9]*" inputmode="numeric" data-price="` + price + `" data-quantity="0" min="0" max="99" value="0" name="Quantity" id="` + name.toLowerCase() + `">
            <button class="increment"></button>
        </div>`
    return listItem;
}