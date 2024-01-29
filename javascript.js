const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2311-FSA-ET-WEB-PT-SF/events`;

const events = {
  parties: [],
};

const partyList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getParty();
  renderParty();
}
render();

/**
 * Update state with parties from API
 */
async function getParty() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    events.parties = json.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Render parties from state
 */
function renderParty() {
  if (!events.parties.length) {
    partyList.innerHTML = "<li>No parties.</li>";
    return;
  }

  const partyCards = events.parties.map((party) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${party.name}</h2>
      <p> ${party.description}</p>
      <p>${new Date(party.date)}</p>
      <p> ${party.location}</p>
      <button onclick="deleteParty(${party.id})">Delete</button>
    `;
    return li;
  });

  partyList.replaceChildren(...partyCards);
  document.querySelectorAll(".delete-btn").forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", (event) => {
      const partyId = event.target.dataset.partyId;
      deleteParty(partyId);
    });
  });
}

//Function to delete party
async function deleteParty(partyID) {
  try {
    const response = await fetch(`${API_URL}/${partyID}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Sorry try again");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Ask the API to create a new artist based on form data
 * @param {Event} event
 */
async function addParty(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        description: addPartyForm.description.value,
        location: addPartyForm.location.value,
        date: new Date(addPartyForm.date.value),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create new party");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}
