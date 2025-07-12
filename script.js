let alarms = JSON.parse(localStorage.getItem('alarms') || '[]');

document.getElementById('alarmForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const time = document.getElementById('alarmTime').value;
  const date = document.getElementById('alarmDate').value;

  const fullDateTime = date ? `${date}T${time}` : `${new Date().toISOString().split('T')[0]}T${time}`;
  const id = Date.now();

  alarms.push({ id, date: date || 'Today', time, fullDateTime });
  saveAlarms();
  renderAlarms();
});

function saveAlarms() {
  localStorage.setItem('alarms', JSON.stringify(alarms));
}

function renderAlarms() {
  const tbody = document.querySelector('#alarmTable tbody');
  tbody.innerHTML = '';

  alarms.forEach(alarm => {
    const row = document.createElement('tr');

    const countdown = getCountdown(alarm.fullDateTime);

    row.innerHTML = `
      <td>${alarm.date}</td>
      <td>${alarm.time}</td>
      <td>${countdown}</td>
      <td>
        <button onclick="deleteAlarm(${alarm.id})">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function deleteAlarm(id) {
  alarms = alarms.filter(alarm => alarm.id !== id);
  saveAlarms();
  renderAlarms();
}

function getCountdown(targetTime) {
  const now = new Date();
  const then = new Date(targetTime);
  const diff = then - now;

  if (diff <= 0) return '⏰ Time up!';
  
  const hrs = Math.floor(diff / 1000 / 60 / 60);
  const mins = Math.floor((diff / 1000 / 60) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return `${hrs}h ${mins}m ${secs}s`;
}

// Update countdowns every second
setInterval(renderAlarms, 1000);

// Initial render
renderAlarms();
function renderAlarms() {
  const tbody = document.querySelector('#alarmTable tbody');
  tbody.innerHTML = '';

  const now = new Date();

  alarms.forEach((alarm, index) => {
    const row = document.createElement('tr');

    const then = new Date(alarm.fullDateTime);
    const diff = then - now;

    let countdown = '';
    if (diff <= 0) {
      countdown = '⏰ Time up!';
      playAlarmSound(); // <<< play sound here
    } else {
      const hrs = Math.floor(diff / 1000 / 60 / 60);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      countdown = `${hrs}h ${mins}m ${secs}s`;
    }

    row.innerHTML = `
      <td>${alarm.date}</td>
      <td>${alarm.time}</td>
      <td>${countdown}</td>
      <td>
        <button onclick="deleteAlarm(${alarm.id})">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function playAlarmSound() {
  const audio = document.getElementById('alarmSound');
  audio.play();
}
