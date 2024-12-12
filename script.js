// Handle user name input
document.getElementById("user-info-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();

  // Save user name in localStorage and update greeting
  localStorage.setItem("userFirstName", firstName);
  localStorage.setItem("userLastName", lastName);

  // Display user's name and show BMR input section
  document.getElementById("user-name").textContent = `${firstName} ${lastName}`;
  document.getElementById("name-input-section").style.display = "none";
  document.getElementById("bmr-input-section").style.display = "block";
});

// Handle BMR calculation
document.getElementById("bmr-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const weightLbs = parseFloat(document.getElementById("weight").value); // Weight in lbs
  const heightFeet = parseInt(document.getElementById("height-feet").value); // Height in feet
  const heightInches = parseInt(document.getElementById("height-inches").value); // Height in inches
  const age = parseInt(document.getElementById("age").value);
  const activityLevel = parseFloat(document.getElementById("activity-level").value);

  // Convert weight to kilograms and height to centimeters
  const weightKg = weightLbs * 0.453592;
  const heightCm = (heightFeet * 12 + heightInches) * 2.54;

  // Calculate BMR using Mifflin-St Jeor Equation
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5; // Assuming male; subtract 161 for females
  const tdee = bmr * activityLevel;

  // Display results
  document.getElementById("bmr-result").textContent = bmr.toFixed(2);
  document.getElementById("tdee-result").textContent = tdee.toFixed(2);
  document.getElementById("bmr-input-section").style.display = "none";
  document.getElementById("results-section").style.display = "block";
});

// Load user info if available
window.addEventListener("load", function () {
  const firstName = localStorage.getItem("userFirstName");
  const lastName = localStorage.getItem("userLastName");

  if (firstName && lastName) {
    document.getElementById("user-name").textContent = `${firstName} ${lastName}`;
    document.getElementById("name-input-section").style.display = "none";
    document.getElementById("bmr-input-section").style.display = "block";
  }
});

// Array to store meal entries
let meals = JSON.parse(localStorage.getItem("meals")) || [];

// Handle meal form submission
document.getElementById("meal-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const mealName = document.getElementById("meal-name").value.trim();
  const calories = parseInt(document.getElementById("calories").value);
  const protein = parseInt(document.getElementById("protein").value);
  const carbs = parseInt(document.getElementById("carbs").value);
  const fats = parseInt(document.getElementById("fats").value);

  meals.push({ mealName, calories, protein, carbs, fats });
  localStorage.setItem("meals", JSON.stringify(meals));

  document.getElementById("meal-form").reset();
  alert("Meal added!");
  renderMealsTable();
});

// Render meals table
function renderMealsTable() {
  const mealsTable = document.getElementById("meals-table");
  mealsTable.innerHTML = "";

  meals.forEach((meal, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${meal.mealName}</td>
      <td>${meal.calories}</td>
      <td>${meal.protein}</td>
      <td>${meal.carbs}</td>
      <td>${meal.fats}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editMeal(${index})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteMeal(${index})">Delete</button>
      </td>
    `;
    mealsTable.appendChild(row);
  });
}

// Edit meal
function editMeal(index) {
  const meal = meals[index];
  document.getElementById("meal-name").value = meal.mealName;
  document.getElementById("calories").value = meal.calories;
  document.getElementById("protein").value = meal.protein;
  document.getElementById("carbs").value = meal.carbs;
  document.getElementById("fats").value = meal.fats;

  meals.splice(index, 1); // Remove meal temporarily for editing
  renderMealsTable();
}

// Delete meal
function deleteMeal(index) {
  meals.splice(index, 1);
  localStorage.setItem("meals", JSON.stringify(meals));
  renderMealsTable();
}

// Load table on page load
window.addEventListener("load", renderMealsTable);

// Handle goal submission
document.getElementById("goal-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const calorieGoal = parseInt(document.getElementById("goal-calories").value);
  const proteinGoal = parseInt(document.getElementById("goal-protein").value);
  const carbsGoal = parseInt(document.getElementById("goal-carbs").value);
  const fatsGoal = parseInt(document.getElementById("goal-fats").value);

  const goals = { calorieGoal, proteinGoal, carbsGoal, fatsGoal };
  localStorage.setItem("dailyGoals", JSON.stringify(goals));

  alert("Goals set successfully!");
  renderSummary();
});

// Render summary and progress bars
function renderSummary() {
  const meals = JSON.parse(localStorage.getItem("meals")) || [];
  const goals = JSON.parse(localStorage.getItem("dailyGoals")) || {
    calorieGoal: 0,
    proteinGoal: 0,
    carbsGoal: 0,
    fatsGoal: 0,
  };

  let totalCalories = 0,
    totalProtein = 0,
    totalCarbs = 0,
    totalFats = 0;

  meals.forEach((meal) => {
    totalCalories += meal.calories;
    totalProtein += meal.protein;
    totalCarbs += meal.carbs;
    totalFats += meal.fats;
  });

  updateProgress("calorie", totalCalories, goals.calorieGoal);
  updateProgress("protein", totalProtein, goals.proteinGoal);
  updateProgress("carbs", totalCarbs, goals.carbsGoal);
  updateProgress("fats", totalFats, goals.fatsGoal);
}

// Update individual progress bars
function updateProgress(type, consumed, goal) {
  const progress = Math.min((consumed / goal) * 100, 100).toFixed(2);

  // Update progress bar
  const progressBar = document.getElementById(`${type}-progress`);
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    progressBar.ariaValueNow = progress;
    progressBar.textContent = `${progress}%`;
  }

  // Update consumed and goal text
  const consumedElement = document.getElementById(`${type}-consumed`);
  const goalElement = document.getElementById(`${type}-goal`);
  if (consumedElement && goalElement) {
    consumedElement.textContent = consumed;
    goalElement.textContent = goal;
  }
}

// Load summary on page load
window.addEventListener("load", renderSummary);

// Populate history table
document.addEventListener("DOMContentLoaded", function () {
  const historyTable = document.getElementById("history-table");
  if (historyTable) {
    const meals = JSON.parse(localStorage.getItem("meals")) || [];
    meals.forEach((meal, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${meal.mealName}</td>
        <td>${meal.calories}</td>
        <td>${meal.protein}</td>
        <td>${meal.carbs}</td>
        <td>${meal.fats}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteMeal(${index})">Delete</button>
        </td>
      `;
      historyTable.appendChild(row);
    });
  }
});

// Delete meal from history
function deleteMeal(index) {
  let meals = JSON.parse(localStorage.getItem("meals")) || [];
  meals.splice(index, 1);
  localStorage.setItem("meals", JSON.stringify(meals));
  alert("Meal deleted!");
  location.reload(); // Refresh to update table
}
