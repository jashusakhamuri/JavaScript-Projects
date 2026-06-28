let url = "https://gorest.co.in/public/v2/users";
let token = "daa84a7cc89c86ad9ec256f9320a4fa562964c3aca36c9e9caea83509d116fc6"; // 🔥 replace with your token

// ================= TOGGLE FORM =================
function toggleForm() {
  let method = document.getElementById("method").value;

  let fieldId = document.getElementById("field-id");
  let fieldName = document.getElementById("field-name");
  let fieldEmail = document.getElementById("field-email");
  let fieldGender = document.getElementById("field-gender");
  let fieldStatus = document.getElementById("field-status");

  // hide everything first, then show only what's needed
  [fieldId, fieldName, fieldEmail, fieldGender, fieldStatus].forEach(f => f.style.display = "none");

  if (method === "GET") {
    fieldName.style.display = "block"; // optional name search
  }
  else if (method === "DELETE") {
    fieldId.style.display = "block";
  }
  else if (method === "PUT") {
    fieldId.style.display = "block";
    fieldName.style.display = "block";
    fieldEmail.style.display = "block";
    fieldGender.style.display = "block";
    fieldStatus.style.display = "block";
  }
  else if (method === "POST") {
    fieldName.style.display = "block";
    fieldEmail.style.display = "block";
    fieldGender.style.display = "block";
    fieldStatus.style.display = "block";
  }
}

// ================= MAIN =================
function handleAction() {
  let method = document.getElementById("method").value;

  if (method === "GET") getUsers();
  if (method === "POST") createUser();
  if (method === "PUT") updateUser();
  if (method === "DELETE") deleteUser();
}

// ================= GET =================
async function getUsers() {
  let name = document.getElementById("name").value.trim();
  let list = document.getElementById("list");
  list.innerHTML = "";

  if (name) {
    // ---- search users by name, to verify create/update worked ----
    let res = await fetch(`${url}?name=${encodeURIComponent(name)}`, {
      headers: { Authorization: "Bearer " + token }
    });
    let data = await res.json();

    if (!res.ok || !data.length) {
      list.innerHTML = `<li style="border-left-color:red;">❌ No user found with name "${name}"</li>`;
      return;
    }

    data.forEach(u => {
      let li = document.createElement("li");
      li.innerHTML = `${u.id} | ${u.name} | ${u.email} | ${u.gender} | ${u.status}`;
      list.appendChild(li);
    });

  } else {
    // ---- fetch full list ----
    let res = await fetch(url, {
      headers: { Authorization: "Bearer " + token }
    });
    let data = await res.json();

    data.forEach(u => {
      let li = document.createElement("li");
      li.innerHTML = `${u.id} | ${u.name} | ${u.email} | ${u.status}`;
      list.appendChild(li);
    });
  }
}

// ================= POST =================
async function createUser() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value || ("user" + Date.now() + "@mail.com");
  let gender = document.querySelector('input[name="gender"]:checked')?.value;
  let status = document.getElementById("status").value;

  let res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, gender, status })
  });

  let data = await res.json();

  if (!res.ok) {
    alert("❌ Failed to create user: " + JSON.stringify(data));
    return;
  }

  alert("User Created ✅ — ID: " + data.id);

  // auto-fill the ID field so you can immediately check it via GET
  document.getElementById("id").value = data.id;

  getUsers();
}

// ================= PUT =================
async function updateUser() {
  let id = document.getElementById("id").value;
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let gender = document.querySelector('input[name="gender"]:checked')?.value;
  let status = document.getElementById("status").value;

  if (!id) {
    alert("⚠️ Please enter a User ID to update");
    return;
  }

  let res = await fetch(`${url}/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, gender, status })
  });

  let data = await res.json();

  if (!res.ok) {
    alert("❌ Failed to update user: " + JSON.stringify(data));
    return;
  }

  alert("User Updated ✅");
  getUsers();
}

// ================= DELETE =================
async function deleteUser() {
  let id = document.getElementById("id").value;

  if (!id) {
    alert("⚠️ Please enter a User ID to delete");
    return;
  }

  let res = await fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  if (!res.ok) {
    alert("❌ Failed to delete user (ID may not exist)");
    return;
  }

  alert("User Deleted ❌");
  document.getElementById("id").value = "";
  getUsers();
}

// ================= INIT =================
window.onload = () => {
  toggleForm();
  getUsers();
};