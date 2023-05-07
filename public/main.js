const socket = io();

let username = "";
let userList = [];

let loginPage = document.querySelector("#loginPage");
let chatPage = document.querySelector("#chatPage");

let loginInput = document.querySelector("#loginNameInput");
let textInput = document.querySelector("#chatTextInput");
let logoutBtn = document.querySelector("#leave");

loginPage.style.display = "flex";
chatPage.style.display = "none";

loginInput.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    let name = loginInput.value.trim();
    if (name != "") {
      username = name;
      document.title = `Chat (${username})`;
      socket.emit("join-request", username);
    }
  }
});

const leaveChat = () => {
  logoutBtn.addEventListener("click", () => {
    renderUserList();
    loginPage.style.display = "flex";
    chatPage.style.display = "none";
  });
};
const renderUserList = () => {
  let ul = document.querySelector(".userList");
  ul.innerHTML = " ";
  userList.forEach((item) => {
    ul.innerHTML += ` <li>${item}</li>`;
  });
};
const addMessage = (type, user, msg) => {
  let ul = document.querySelector(".chatList");

  switch (type) {
    case "status":
      ul.innerHTML += `<li class="m-status">${msg}</li>`;
      break;
    case "msg":
      ul.innerHTML += `<li class="m-txt"><span>${user}</span>${msg}</li>`;
  }
};

socket.on("user-ok", (list) => {
  loginPage.style.display = "none";
  chatPage.style.display = "flex";
  textInput.focus();
  addMessage("status", null, "Connected");

  userList = list;
  renderUserList();
});

socket.on("list-update", (data) => {
  if (data.joined) {
    addMessage("status", null, `${data.joined} enter in the chat`);
  }
  if (data.left) {
    addMessage("status", null, `${data.left} leaved the chat `);
  }
  userList = data.list;
  renderUserList();
});

socket.on("disconnect", () => {
  leaveChat();
});
