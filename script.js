let localUsers = [];
let localPosts = [];
let nextUserId = 1001;

function showTab(tabName, event) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');

    const tabButtons = document.querySelectorAll('.tab');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function loadData() {
    const dataType = document.getElementById('dataSelector').value;
    const tableBody = document.querySelector('#dataTable tbody');

    tableBody.innerHTML = '<tr><td colspan="5" class="loading">Cargando datos...</td></tr>';

    if (dataType === 'users') {
        displayLocalUsers();
    } else if (dataType === 'posts') {
        displayLocalPosts();
        fetch(`https://jsonplaceholder.typicode.com/${dataType}`)
            .then(response => response.json())
            .then(data => {
                displayData(data, dataType);
            })
            .catch(error => {
                console.error('Error:', error);
                if (localPosts.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="5" class="loading">Error al cargar los datos</td></tr>';
                }
            });
    } else {
        fetch(`https://jsonplaceholder.typicode.com/${dataType}`)
            .then(response => response.json())
            .then(data => {
                displayData(data, dataType);
            })
            .catch(error => {
                console.error('Error:', error);
                tableBody.innerHTML = '<tr><td colspan="5" class="loading">Error al cargar los datos</td></tr>';
            });
    }
}

function displayLocalUsers() {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    if (localUsers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="loading">No hay usuarios locales. Crea uno en la pestaña "Gestión Usuarios"</td></tr>';
        return;
    }

    localUsers.forEach(user => {
        const row = document.createElement('tr');
        row.classList.add('local-data');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.website || '-'}</td>
        `;
        tableBody.appendChild(row);
    });
}

function displayLocalPosts() {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    localPosts.forEach(post => {
        const row = document.createElement('tr');
        row.classList.add('local-data');
        row.innerHTML = `
            <td>${post.id}</td>
            <td>${post.title.substring(0, 30)}...</td>
            <td>User ${post.userId}</td>
            <td>${post.body.substring(0, 50)}...</td>
            <td>-</td>
        `;
        tableBody.appendChild(row);
    });
}

function displayData(data, dataType) {
    const tableBody = document.querySelector('#dataTable tbody');

    if (tableBody.querySelector('.local-data') === null) {
        tableBody.innerHTML = '';
    }

    data.slice(0, 10).forEach(item => {
        const row = document.createElement('tr');

        if (dataType === 'users') {
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.username}</td>
                <td>${item.email}</td>
                <td>${item.website}</td>
            `;
        } else if (dataType === 'posts') {
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.title.substring(0, 30)}...</td>
                <td>User ${item.userId}</td>
                <td>${item.body.substring(0, 50)}...</td>
                <td>-</td>
            `;
        } else if (dataType === 'comments') {
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>Post ${item.postId}</td>
                <td>${item.email}</td>
                <td>${item.body.substring(0, 30)}...</td>
            `;
        }

        tableBody.appendChild(row);
    });
}

document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newUser = {
        id: nextUserId++,
        name: document.getElementById('nombre').value,
        username: document.getElementById('usuario').value,
        email: document.getElementById('email').value,
        website: document.getElementById('sitioWeb').value,
        fechaIngreso: document.getElementById('fechaIngreso').value
    };

    localUsers.push(newUser);

    console.log('Datos del usuario:', newUser);
    alert('Usuario guardado exitosamente');

    this.reset();
});

document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newPost = {
        id: nextUserId++,
        title: document.getElementById('titulo').value,
        body: document.getElementById('contenido').value,
        userId: document.getElementById('userId').value
    };

    localPosts.push(newPost);

    console.log('Datos de la publicación:', newPost);
    alert('Publicación guardada exitosamente');

    this.reset();
});

function cancelarForm() {
    document.getElementById('userForm').reset();
}

function cancelarPost() {
    document.getElementById('postForm').reset();
}
