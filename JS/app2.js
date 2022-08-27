// emad js
const body = document.querySelector("body"),
	nav = document.querySelector("nav"),
	modeToggle = document.querySelector(".dark-light"),
	sidebarOpen = document.querySelector(".sidebarOpen"),
	siderbarClose = document.querySelector(".siderbarClose");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark-mode") {
	body.classList.add("dark");
}

// js code to toggle dark and light mode
modeToggle.addEventListener("click", () => {
	modeToggle.classList.toggle("active");
	body.classList.toggle("dark");

	// js code to keep user selected mode even page refresh or file reopen
	if (!body.classList.contains("dark")) {
		localStorage.setItem("mode", "light-mode");
	} else {
		localStorage.setItem("mode", "dark-mode");
	}
});

//   js code to toggle sidebar
sidebarOpen.addEventListener("click", () => {
	nav.classList.add("active");
});

body.addEventListener("click", (e) => {
	let clickedElm = e.target;

	if (
		!clickedElm.classList.contains("sidebarOpen") &&
		!clickedElm.classList.contains("menu")
	) {
		nav.classList.remove("active");
	}
});
// end emad js //

// logout button --------------------------

let logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", (e) => {
	window.location = "./index.html";

	localStorage.removeItem("currentloggedin");
});

// laith
// add tasks by form--------------------------------------

function Task(title, description, priority) {
	this.title = title;
	this.description = description;
	this.priority = priority;
	this.status = "incomplete";
	this.id = new Date().getTime();
	this.id2 = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
}

let allTasks = [];
let allCards = [];

let form = document.getElementById("newTaskForm");

function render(event) {
	event.preventDefault();

	let title = event.target.Title.value;
	let description = event.target.Description.value;
	let priority = event.target.Radio.value;

	let taskCard = new Task(title, description, priority);
	allTasks.push(taskCard);
	saveToLocal();

	addCard(taskCard);
	document.getElementById("newTaskForm").reset();
}

form.addEventListener("submit", render);

//   let userName = "laith"; // example for testing, actual username is from manar
let userName =
	JSON.parse(localStorage.getItem("currentloggedin")).fName +
	" " +
	JSON.parse(localStorage.getItem("currentloggedin")).lName;

function saveToLocal() {
	let stringArr = JSON.stringify(allTasks);
	localStorage.setItem(userName, stringArr);
}
function getFromLocal() {
	let jsonArr = localStorage.getItem(userName);
	let objArr = JSON.parse(jsonArr);

	if (objArr !== null) {
		objArr.forEach((element) => {
			allTasks = objArr;
			addCard(element);
		});
	}
}
getFromLocal();

//display the user name in nav bar
let navName = document.getElementById("navName");
navName.textContent = `Welcome ${userName}`;

// duaa
// display cards ---------------------------------------------------

let cardRow = document.getElementById("card-row");

// addCard function to add cards from form
let cardContainer = document.getElementById("card-container");

function addCard(task) {
	const taskCard = document.createElement("div");
	taskCard.classList.add("col-sm-4");
	let x = "";

	if (task.status == "completed") {
		x = "checked";
	}
	taskCard.innerHTML = `
    <div class="box ${colorClass(task.priority)}" >
    <a href="" class="delete-btn" style="color: black" 
    >
    <img src="./images/trash-outline.svg" id= "${task.id}" name="id">
     </a>
    <h2>${task.title}</h2>
    <p>${task.description}</p>
	<input type="checkbox" name="checkbox" class="check-btn" id="${task.id2}" ${x}>
    </div>
  
    `;

	document.getElementById("card-row").appendChild(taskCard);
	task.element = taskCard;
	allCards.push(task);

	// function to delete each element
	let deleteBtn = document.querySelectorAll(".delete-btn");
	deleteBtn.forEach((ele) => {
		ele.addEventListener("click", (e) => {
			e.preventDefault();
			console.log(e);
			let deleteId = e.target.id;
			console.log(deleteId);
			console.log(allTasks);
			allTasks = allTasks.filter((ele) => {
				return ele.id == deleteId ? false : true;
			});
			console.log(allTasks);
			saveToLocal();
			cardRow.innerHTML = "";
			getFromLocal();
		});
	});

	// function to delete all cards
	let deleteAllBtn = document.getElementById("delete-all");

	deleteAllBtn.addEventListener("click", deleteAll);
	function deleteAll() {
		cardRow.innerHTML = "";
		allTasks = [];
		saveToLocal();
	}

	// function to switch between completed and incomplete
	const checkbox = document.querySelectorAll(".check-btn");
	checkbox.forEach((ele) => {
		ele.addEventListener("change", (e) => {
			let checkId = e.target.id;
			if (e.target.checked) {
				console.log("Checkbox is checked..");
				// ele.setAttribute("checked", "");

				allTasks.forEach((element) => {
					if (element.id2 == checkId) {
						element.status = "completed";
						saveToLocal();
					}
				});
			} else {
				console.log("Checkbox is not checked..");
			}
		});
	});

	// function to delete completed cards
	let deleteCompleted = document.getElementById("delete-all-com");

	deleteCompleted.addEventListener("click", deleteCom);
	function deleteCom() {
		allTasks = allTasks.filter((ele) => {
			return ele.status == "completed" ? false : true;
		});
		saveToLocal();
		cardRow.innerHTML = "";
		getFromLocal();
	}
}

// function to change top border color of cards based on priority
function colorClass(priority) {
	switch (priority) {
		case "Critical":
			return "red";
		case "Normal":
			return "orange";
		case "Low priority":
			return "blue";
	}
}

// jafar
// filter cards --------------------------------------------------

console.log(allCards);

let statusCondition = null;
let priorityCondition = null;
function getStatus(sel) {
	statusCondition = sel.options[sel.selectedIndex].text;
	let filtered =
		statusCondition && priorityCondition
			? allCards.filter(
					(card) =>
						card.priority == priorityCondition && card.status == statusCondition
			  )
			: statusCondition
			? allCards.filter((card) => card.status == statusCondition)
			: priorityCondition
			? allCards.filter((card) => card.priority == priorityCondition)
			: [allCards];

	displayCards(filtered);
}
function getPriority(sel) {
	priorityCondition = sel.options[sel.selectedIndex].text;
	let filtered =
		statusCondition && priorityCondition
			? allCards.filter(
					(card) =>
						card.priority == priorityCondition && card.status == statusCondition
			  )
			: statusCondition
			? allCards.filter((card) => card.priority == statusCondition)
			: priorityCondition
			? allCards.filter((card) => card.priority == priorityCondition)
			: allCards;

	displayCards(filtered);
}
function displayCards(filteredArray) {
	allCards.forEach((ele) => {
		ele.element.style.display = "none";
	});
	filteredArray.forEach((ele) => {
		ele.element.style.display = "block";
	});
	console.log(filteredArray);
}

function ShowAllCards() {
	allCards.forEach((ele) => {
		location.reload();
		// ele.element.style.display = 'block';
		// document.getElementById("StatusID").value="Filter by Status...";
		// document.getElementById("PriorityID").value="Filter by Priority...";
	});
}
