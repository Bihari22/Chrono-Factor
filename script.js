// Clock Functionality
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const amPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  hours = String(hours).padStart(2, '0');

  document.getElementById('time').textContent = `${hours}:${minutes}:${seconds} ${amPm}`;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  document.getElementById('day').textContent = days[now.getDay()];

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById('date').textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

setInterval(updateClock, 1000);
updateClock();

// Factorial Functions
function factorialIterative(n) {
  let result = 1;
  let steps = `${n}! = `;
  for (let i = 2; i <= n; i++) {
    result *= i;
    steps += i + (i < n ? ' × ' : '');
  }
  steps += ` = ${result}`;
  return { result, steps };
}

function factorialRecursive(n, acc = []) {
  if (n === 0 || n === 1) {
    acc.push('1');
    return { result: 1, steps: acc.join(' × ') + ' = 1' };
  }
  acc.push(n);
  const sub = factorialRecursive(n - 1, acc);
  return {
    result: n * sub.result,
    steps: acc.join(' × ') + ' = ' + (n * sub.result)
  };
}

function calculateFactorial() {
  const input = document.getElementById('numberInput').value;
  const method = document.getElementById('methodSelect').value;
  const resultDiv = document.getElementById('result');

  const num = parseInt(input);

  if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
    resultDiv.innerHTML = '<span class="error">Please enter a valid positive integer.</span>';
    return;
  }

  let resultObj;
  try {
    resultObj = method === 'iterative' ? factorialIterative(num) : factorialRecursive(num);
  } catch (err) {
    resultDiv.innerHTML = '<span class="error">Error: ' + err.message + '</span>';
    return;
  }

  resultDiv.innerHTML = `Factorial of ${num} is <strong>${resultObj.result}</strong><br>(Using <em>${method}</em> method)`;

  const record = {
    number: num,
    result: resultObj.result,
    method: method,
    time: new Date().toLocaleString(),
    steps: resultObj.steps
  };

  saveToHistory(record);
}

function saveToHistory(record) {
  let history = JSON.parse(localStorage.getItem('factorialHistory')) || [];
  history.unshift(record);
  localStorage.setItem('factorialHistory', JSON.stringify(history));
  updateHistoryList();
}

function updateHistoryList() {
  const list = document.getElementById('historyList');
  const history = JSON.parse(localStorage.getItem('factorialHistory')) || [];
  list.innerHTML = '';

  if (history.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No history yet.';
    li.style.textAlign = 'center';
    li.style.color = '#999';
    list.appendChild(li);
    return;
  }

  history.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${item.number}!</strong> = ${item.result}        
      <span class="toggle-steps" onclick="toggleSteps(this)">[Show Steps]</span>       
      <div class="steps" style="display:none">${item.steps}</div>       
      <br><small>${item.method} | ${item.time}</small>
    `;
    list.appendChild(li);
  });
}


function toggleSteps(button) {
  const stepsDiv = button.nextElementSibling;
  stepsDiv.style.display = stepsDiv.style.display === 'block' ? 'none' : 'block';
  button.textContent = stepsDiv.style.display === 'block' ? 'Hide Steps' : 'Show Steps';
}
function Clear() {
  document.getElementById('numberInput').value = '';
  document.getElementById('result').innerHTML = '';
}

function clearHistory() {
  const history = JSON.parse(localStorage.getItem('factorialHistory')) || [];

  if (history.length === 0) {
    updateHistoryList(); 
    return;
  }

  localStorage.removeItem('factorialHistory');
  updateHistoryList();
  document.getElementById('result').innerHTML = '';
  alert("✅ All history has been cleared.");
}

function toggleHistory() {
  const historyPanel = document.getElementById('historyPanel');
  historyPanel.classList.toggle('open');
}
updateHistoryList();