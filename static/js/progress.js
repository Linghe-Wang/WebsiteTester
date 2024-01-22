$('#slider').slider({
  formatter: function(value) {
    return value;
  }
});

let currentIndex = 0;

function reconstructPrev() {
  const changesInput = document.getElementById('changes');
  const changesText = changesInput.value.trim();

  if (changesText === "") {
    alert("Please provide text changes.");
    return;
  }

  try {
    const changesArray = JSON.parse(changesText);
    if (currentIndex < changesArray.length) {
      const reconstructedText = reconstructFromChanges(changesArray.slice(0, currentIndex + 1));
      document.getElementById('output').innerHTML = reconstructedText;
      currentIndex++;
    } else {
      alert("All changes have been applied.");
    }
  } catch (error) {
    alert("Invalid input. Please provide a valid JSON array.");
  }
}

function reconstructNext() {
  const changesInput = document.getElementById('changes');
  const changesText = changesInput.value.trim();

  if (changesText === "") {
    alert("Please provide text changes.");
    return;
  }

  try {
    const changesArray = JSON.parse(changesText);
    if (currentIndex < changesArray.length) {
      const reconstructedText = reconstructFromChanges(changesArray.slice(0, currentIndex + 1));
      document.getElementById('output').innerHTML = reconstructedText;
      currentIndex++;
    } else {
      alert("All changes have been applied.");
    }
  } catch (error) {
    alert("Invalid input. Please provide a valid JSON array.");
  }
}

function reconstructFromChanges(operations) {
  let reconstructedText = "";

  operations.forEach(operation => {
    const [code, text] = operation;

    if (code === -1) {
      // Delete
      reconstructedText += `<span class="delete">${text}</span>`;
    } else if (code === 1) {
      // Insert
      reconstructedText += `<span class="insert">${text}</span>`;
    } else if (code === 0) {
      // No change
      reconstructedText += text;
    }
  });

  return reconstructedText;
}
