// Get the modal
const getModal = (modalId) => document.getElementById(modalId);

const closeModal = (modalId) => {
  const modal = getModal(modalId);
  if (modal == null) {
    return;
  }
  modal.style.display = "none";
};

const showModal = (modalId) => {
  const modal = getModal(modalId);
  if (modal == null) {
    return;
  }
  modal.style.display = "block";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  const modalsNodes = document.querySelectorAll(".modal");
  const modals = Array.from(modalsNodes);
  modals.forEach((modal) => {
    if (event.target == modal) {
      closeModal(modal.id);
    }
  });
};

document.addEventListener("DOMContentLoaded", function () {
  const closeSpans = document.querySelectorAll(".close");
  closeSpans.forEach((span) => {
    const parentModal = span.closest(".modal");
    if (parentModal != null) {
      span.onclick = () => closeModal(parentModal.id);
    }
  });
});

function cycleCurrentRadio(event) {
  const target = event.target;
  const radios = Array.from(target.querySelectorAll('input[type="radio"]'));
  const selected = radios.find((radio) => radio.checked);
  const targetRadioMap = { update: "ignore", ignore: "noop", noop: "update" };
  const radioToSelect = radios.find(
    (radio) => radio.value == targetRadioMap[selected.value]
  );
  if(radioToSelect == null) {
    return;
  }
  radioToSelect.checked = true;
}

function changeUpdateFromLmsButtonVisibility(visible) {
  const updateButton = document.getElementById("update-from-lms-button");
  const allActionWrapper = document.getElementById("diff-all-actions-wrapper");
  if (updateButton == null) {
    return;
  }
  updateButton.classList.toggle("hidden", !visible);
  allActionWrapper.classList.toggle("hidden", !visible);
}

let diffDatatable = null;

const generateLocationActionRadio = (locationId) => `<div class="diff-radio"">
<label>
Update: <input type="radio" data-id="${locationId}" data-action="update" value="update" name="${locationId}-action" checked/>
</label>
<label>
Ignore: <input type="radio" data-id="${locationId}" data-action="ignore" value="ignore" name="${locationId}-action"/>
</label>
<label>
No action: <input type="radio" value="noop" name="${locationId}-action"/>
</label>
</div>`;

function renderDiffData(responseData) {
  const tableData = Object.entries(responseData).map(
    ([locationId, locationData]) => {
      const locationDiff = locationData["diff"];
      const diffsCell = Object.entries(locationDiff).reduce(
        (cell, diffKeyPair) => {
          const [property, diff] = diffKeyPair;
          const diffWP =
            property === "wpsl_hours"
              ? `<pre>${JSON.stringify(diff.wp, null, 2)}</pre> `
              : diff.wp;
          const diffLMS =
            property === "wpsl_hours"
              ? `<pre>${JSON.stringify(diff.lms, null, 2)}</pre> `
              : diff.lms;
          return `${cell}
      <div>
        <div class="diff-property-label">${property}</div>
        <div class="property-grid">
          <span class="wp-diff-side">${diffWP}</span><span class="lms-diff-side">${diffLMS}</span>
        </div>
      </div>`;
        },
        ""
      );
      return [
        `${locationId} - ${locationData["label"]}`,
        diffsCell,
        generateLocationActionRadio(locationId),
      ];
    },
    []
  );

  diffDatatable = new DataTable("#locations-diff-table", {
    data: tableData,
    paging: false,
    initComplete: function () {
      document.querySelectorAll(".diff-radio").forEach((node) => {
        node.parentElement.addEventListener("click", cycleCurrentRadio);
      });
      changeUpdateFromLmsButtonVisibility(true);
    },
  });
}

function changeLoaderVisibility(visible) {
  const diffLoader = document.getElementById("diff-loader");
  diffLoader.classList.toggle("hidden", !visible);
}

function replaceTbody(text) {
  const tBody = document.querySelector("tbody");
  tBody.innerHTML = `<tr><td colspan="3">${text}...</td></tr>`;
}

async function loadDiffData() {
  try {
    changeLoaderVisibility(true);
    if (diffDatatable != null) {
      diffDatatable.destroy();
      replaceTbody("Reloading");
    }
    const response = await fetch("/wp-json/locations/v1/diff");
    const responseObject = await response.json();
    const responseData = responseObject.data;
    renderDiffData(responseData);
    changeLoaderVisibility(false);
  } catch (error) {
    console.error(error);
    diffDatatable.destroy();
    changeUpdateFromLmsButtonVisibility(false);
    changeLoaderVisibility(false);
  }
}

async function generateDiff(event) {
  changeUpdateFromLmsButtonVisibility(false);
  const button = event.target;
  button.disabled = true;

  await loadDiffData();

  button.disabled = false;
}

function changeAllActions(event) {
  const targetValue = event.target.value;
  const actionRadios = document.querySelectorAll(
    `input[type="radio"][value="${targetValue}"]`
  );
  actionRadios.forEach((radio) => {
    radio.checked = true;
  });
}

async function updateSelectedFromLms(event) {
  const button = event.target;
  button.disabled = true;
  try {
    changeLoaderVisibility(true);
    const tableElement = document.getElementById("locations-diff-table");
    const radios = Array.from(
      tableElement.querySelectorAll("input[type='radio']")
    );
    const markedForAction = radios.filter(
      (radio) => radio.checked && radio.value !== "noop"
    );
    const actionMap = {
      update: "toUpdateIds",
      ignore: "toIgnoreIds",
    };
    const requestPayload = markedForAction.reduce(
      (payload, checkbox) => {
        const action = checkbox.getAttribute("data-action");
        const lmsId = checkbox.getAttribute("data-id");
        const arrayKey = actionMap[action];
        return { ...payload, [arrayKey]: [...payload[arrayKey], lmsId] };
      },
      {
        toIgnoreIds: [],
        toUpdateIds: [],
      }
    );
    replaceTbody("Updating");
    const response = await fetch("/wp-json/locations/v1/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });
    changeLoaderVisibility(false);
    const responseObject = await response.json();
    const responseData = responseObject.data;
    const resultContainer = document.getElementById("result-container");
    resultContainer.innerHTML = JSON.stringify(responseData, null, 2);
    showModal("resultModal");
    await loadDiffData();
  } catch (error) {
    changeLoaderVisibility(false);
    console.error(error);
  }
  button.disabled = false;
}

window.addEventListener("load", function () {
  const generateDiffButton = document.getElementById("generate-diff-button");
  generateDiffButton.click();
});
