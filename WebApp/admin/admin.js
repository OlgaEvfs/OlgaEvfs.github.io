document.addEventListener('DOMContentLoaded', () => {
    const addMenuItemForm = document.getElementById('add-menu-item-form');
    const logoutBtn = document.getElementById('logout-btn');
    const menuItemsContainer = document.querySelector('#menu-items-container');
    const editItemIdInput = document.getElementById('edit-item-id');
    const addBtn = document.getElementById(add-btn);
    const updateBtn = document.getElementById('update-btn');

    const fetchMenuItems = async () => {
        try {
            const response = await fetch('/menu');
            const menuItems = await response.json();
            renderMenuItems(menuItems);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const renderMenuItems = (menuItems) => {
        menuItemsContainer.innerHTML = '';
        menuItems.foreach(item => {
            const menuItemElement = document.createElement('div');
            menuItemElement.classList.add('menu__item');
            menuItemElement.innerHTML = `
                <img src="../${item.img}" alt="${item.alting}">
                <div class="menu__item-content>
                    <h3 class="menu__item-subtitle">${item.title}</h3>
                    <div class="menu__item-descr">${item.descr}</div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${item.price}</span> евро/день</div>
                    </div>
                </div>
                <div class="menu__item-actions">
                    <button class="btn btn-primary btn-sm edit-btn" data-id="${item._id}">Редактировать</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${item._id}">Удалить</button>
                </div>
            `;
            menuItemsContainer.appendChild(menuItemElement);
        });
    };

    addMenuItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(addMenuItemForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Menu item added successfully!');
                addMenuItemForm.reset();
                fetchMenuItems();
            } else {
                alert('Failed to add menu item. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    updateBtn.addEventListener('click', async () => {
        const itemId = editItemIdInput.value;
        const formData = new FormData(addMenuItemForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`/menu/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Menu item updated successfully!');
                addMenuItemForm.reset();
                fetchMenuItems();
                addBtn.style.display = 'block';
                updateBtn.style.display = 'none';
            } else {
                alert('Failed to update menu item. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST'
            });

            if (response.ok) {
                window.location.href = '/';
            } else {
                alert('Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    menuItemsContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const itemId = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this item?')) {
                try {
                    const response = await fetch(`/menu/${itemId}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        alert('Menu item deleted successfully!');
                        fetchMenuItems();
                    } else {
                        alert('Failed to delete menu item. Please try again.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                }
            }
        }

        if (e.target.classList.contains('edit-btn')) {
            const itemId = e.target.dataset.id;
            const response = await fetch('/menu');
            const menuItems = await response.json();
            const selectedItem = menuItems.find(item => item.id === itemId);

            if (selectedItem) {
                document.getElementById('img').value = selectedItem.img;
                document.getElementById('altimg').value = selectedItem.altimg;
                document.getElementById('title').value = selectedItem.title;
                document.getElementById('descr').value = selectedItem.descr;
                document.getElementById('price').value = selectedItem.price;
                editItemIdInput.value = selectedItem._id;

                addBtn.style.display = 'none';
                updateBtn.style.display = 'block';
            }
        }
    });

    fetchMenuItems();
});