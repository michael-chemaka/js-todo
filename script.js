document.addEventListener('DOMContentLoaded', () => {

})

const greeting = document.getElementById('greeting');
const currentDate = document.getElementById('currentDate');
const currentTime = document.getElementById('currentTime');

const profileModal = document.getElementById("profileModal");
const overlay = document.querySelector(".overlay");
const openModalButton = document.getElementById("openButton");
const closeModalButton = document.getElementById("closeButton");

const displayUsername = document.getElementById('displayUsername'); // Span to show current username in modal
const editUsernameInput = document.getElementById('editUsername');   // Input field to change username
const saveUsernameButton = document.getElementById('saveUsernameButton'); // Button to save new username

const toggleInputButton = document.getElementById('toggleInputButton')
const addTaskButton = document.getElementById('addTaskButton');
const container = document.querySelector('.button-input-container');
const taskInput = document.getElementById('taskInput');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let username = localStorage.getItem('username') || 'Guest';


// 1. Current date and Time
function updateDateTime() {
  const now = new Date();

  //options for formatting the date and time string
  const optionsDate = {weekday: 'long', day: 'numeric', month:'long', year:'numeric'};
  const optionsTime = {hour:'2-digit', minute:'2-digit', second:'2-digit'};

  // Update the text content of the date/time spans
  currentDate.textContent = now.toLocaleDateString(undefined,optionsDate);
  currentTime.textContent = now.toLocaleTimeString(undefined,optionsTime)
}
//Call updateDateTime every 1 second
setInterval(updateDateTime, 1000);
updateDateTime(); // Call it once immediately so it doesn't wait 1 second to show up


//2. Getting user name

function updateGreeting () {
  //Update the h2 element with the current username
  greeting.textContent = `Hey, ${username}!` // Uses template literals (backticks) for easy string insertion
}

function saveUsername(newUsername) {
  username = newUsername; // Update the username variable
  localStorage.setItem('username', username); //save to browser's local storage

  updateGreeting();
  displayUsername.textContent = username; // Update username in the modal
  editUsernameInput.value = username; // Update the input field in the modal
}

// Initialize username display when the page loads
updateGreeting();
displayUsername.textContent = username;
editUsernameInput.value = username;


// 3. Access a popup profile of the user
const closeModal = function () {
  profileModal.classList.add("hidden");
  overlay.classList.add("hidden");
};
// close the modal when the close button and overlay is clicked
closeModalButton.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !profileModal.classList.contains("hidden")) {
    closeModal();
  }
});

// open modal function
const openModal = function () {
  profileModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
// open modal event
openModalButton.addEventListener("click", openModal);











//4. Todo Add Tasks
toggleInputButton.addEventListener('click', () => {
    container.classList.add('active');
    setTimeout(() => taskInput.focus(), 300);
  });

// Hide input if blurred and empty
taskInput.addEventListener('blur', () => {
    setTimeout(() => {
      if (taskInput.value.trim() === "" && !document.activeElement.isSameNode(addTaskButton)) {
        container.classList.remove('active');
      }
    }, 120);
  });

  // Add task logic (customize as needed)
  addTaskButton.addEventListener('click', () => {
    if (taskInput.value.trim() === "") {
      alert("Please enter a task");
    } else {
      // Avoid innerHTML += as it recreates DOM nodes and loses event listeners
      const taskContainer = document.querySelector('.task-container');
  
      // Create a new task li element
      const li = document.createElement('li');
      li.classList.add('checked');
  
      // Set innerHTML with class names instead of IDs to avoid duplicates
      li.innerHTML = `
        <div class="task-content">
        <span class="material-symbols-outlined check-circle" style="cursor:pointer;">radio_button_unchecked</span>
        <p class="task">${taskInput.value}</p>
        </div>
        <div class="control">
          <span class="material-symbols-outlined edit" style="cursor:pointer;">edit</span>
          <span class="material-symbols-outlined delete" style="cursor:pointer;">delete</span>
        </div>
      `;
  
      taskContainer.appendChild(li);
      taskInput.value = "";
    }
  });
  
  // Event delegation - listen on container for clicks on edit, delete, or check-circle
  document.querySelector('.task-container').addEventListener('click', (e) => {
    const target = e.target;
  
    // Delete button click
    if (target.classList.contains('delete')) {
      target.closest('li').remove();
    }
  
    // Edit button click
    else if (target.classList.contains('edit')) {
      const taskParagraph = target.closest('li').querySelector('.task');
      const newTask = prompt("Edit your task:", taskParagraph.textContent);
      if (newTask && newTask.trim() !== "") {
        taskParagraph.textContent = newTask.trim();
        showSuccessMessage(target.closest('li'), "Successfully updated your task");
      }
    }
  
    // Circle check click - toggle completion
    else if (target.classList.contains('check-circle')) {
      const li = target.closest('li');
      li.classList.toggle('completed');
  
      // Change material symbol to checked or unchecked
      target.textContent = li.classList.contains('completed') ? 'check_circle' : 'radio_button_unchecked';
    }
  });
  
  // Function to show a green success message on top of the <li>
  function showSuccessMessage(parentLi, message) {
    // Create message div
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.style.color = 'green';
    msgDiv.style.fontWeight = 'bold';
    msgDiv.style.marginBottom = '5px';
  
    // Insert message before the content
    parentLi.insertBefore(msgDiv, parentLi.firstChild);
  
    // Remove after 2 seconds
    setTimeout(() => {
      if (msgDiv.parentNode) {
        msgDiv.parentNode.removeChild(msgDiv);
      }
    }, 2000);
  }
