const writeBtn = document.getElementById('writeBtn');
const writeForm = document.getElementById('writeForm');
const overlay = document.getElementById('overlay');
const btnCloseModal = document.getElementById('closeModal');
let editBtn = document.querySelectorAll('#editBtn');
const deleteBtn = document.querySelectorAll('#deleteBtn');
const saveBtn = document.getElementById('saveBtn');
const readForm = document.getElementById('readForm');
const btnCloseRead = document.getElementById('closeRead');
let check = -1;

/* open modal to write new post */
const openModal = () => {
    writeForm.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

const closeModal = () => {
    writeForm.classList.add('hidden');
    overlay.classList.add('hidden');
    readForm.classList.add('hidden');
    resetForm();
};

const openRead = () => {
    readForm.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

const closeRead = () => {
    overlay.classList.add('hidden');
    readForm.classList.add('hidden');
}

const createLi = (title, writer, text, i) => {
    const tr = document.createElement("tr");
    tr.setAttribute('tr', 'textItem');
    tr.setAttribute('class', "text-item");
    let time = new Date();

    tr.innerHTML = `<td class="title" onclick="readPost(this)">${title}</td>
                    <td class="writer">${writer}</td>
                    <td class="text" hidden>${text}</td>
                    <td>${time.getHours()}:${time.getMinutes()}</td>`;

    const btns = document.createElement("td");
    btns.innerHTML = `<button class="btn edit" id="editBtn" onClick="onEdit(this)">수정</button>
                      <button class="btn delete" id="deleteBtn" onClick="onDelete(this)">삭제</button>`;

    if (i != -1) {
        onDelete(i);
        check = -1;
    }
    tr.appendChild(btns);
    document.getElementById('textList').appendChild(tr);
};

const onDelete = (i) => {
    const rowIndex = i.parentElement.parentElement.rowIndex;

    // Remove the row from the UI
    document.getElementById('textList').removeChild(i.parentElement.parentElement);
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.splice(rowIndex, 1);
    localStorage.setItem('posts', JSON.stringify(posts));
};

const onEdit = (i) => {
    openModal();
    const tr = i.parentElement.parentElement;
    document.getElementById('postTitle').value = tr.children[0].textContent;
    document.getElementById('postWriter').value = tr.children[1].textContent;
    document.getElementById('postText').value = tr.children[2].textContent;

    check = i;
    onDelete(check);
    // openModal();
}

const savePost = () => {
    const title = document.getElementById('postTitle').value;
    const writer = document.getElementById('postWriter').value;
    const text = document.getElementById('postText').value;

    // Retrieve existing posts from local storage or initialize an empty array
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Create a new post object
    const newPost = {
        title: title,
        writer: writer,
        text: text,
        timestamp: new Date().toLocaleString(),
    };

    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    createLi(newPost.title, newPost.writer, newPost.text, -1);

    

    closeModal();
};


const readPost = (i) => {
    document.getElementById('readTitle').textContent = i.parentElement.children[0].textContent;
    document.getElementById('readWriter').textContent = i.parentElement.children[1].textContent;
    document.getElementById('readText').textContent = i.parentElement.children[2].textContent;
    openRead();
}

const resetForm = () => {
    document.getElementById('postTitle').value = "";
    document.getElementById('postWriter').value = "";
    document.getElementById('postText').value = "";
}

writeBtn.addEventListener('click', openModal);

const countLength = (cnt, i) =>{
    if(i.value.length>cnt){
        alert(`제목의 길이는 최대 ${cnt}자 입니다!`);
    }
}


/* close modal (X button/overlay) */
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

btnCloseRead.addEventListener('click', closeRead);

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});



const API_URL = 'http://localhost:5500/08_abandoned_pets/board/index.html';

const fetchPosts = () => {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Display each post on the page
    posts.forEach(post => {
        createLi(post.title, post.writer, post.text, -1);
    });
    // window.addEventListener('load', fetchPosts);
};

// Call fetchPosts when the page loads to get existing posts
// window.addEventListener('load', fetchPosts);


// Function to save a post to the server
const savePostDB = async () => {
  const title = document.getElementById('postTitle').value;
  const writer = document.getElementById('postWriter').value;
  const text = document.getElementById('postText').value;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, writer, text })
  });

  const savedPost = await response.json();
  // Handle the saved post, e.g., display it on the page
};

// Call fetchPosts when the page loads to get existing posts
window.addEventListener('load', fetchPosts);

//image 삽입