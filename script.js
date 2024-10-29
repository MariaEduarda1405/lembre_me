const reminders = [];

// Verifica se o navegador suporta notificações
if ("Notification" in window && "serviceWorker" in navigator) {
    Notification.requestPermission().then(permission => {
        if (permission !== "granted") {
            alert("Para receber lembretes, ative as notificações do navegador.");
        }
    });
} else {
    alert("Seu navegador não suporta notificações.");
}

function addReminder() {
    const task = document.getElementById('task').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    if (task && date && time) {
        const reminder = {
            task,
            date,
            time,
            timestamp: new Date(`${date}T${time}`).getTime()
        };
        reminders.push(reminder);
        displayReminders();
        scheduleNotification(reminder);
        alert(`Lembrete para "${task}" adicionado com sucesso!`);
        saveReminders(); // Salva os lembretes após adicionar
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

function displayReminders() {
    const reminderList = document.getElementById('reminders');
    reminderList.innerHTML = '';

    reminders.sort((a, b) => a.timestamp - b.timestamp);

    reminders.forEach((reminder) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${reminder.task} - ${reminder.date} às ${reminder.time}`;
        reminderList.appendChild(listItem);
    });
}

function saveReminders() {
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

function loadReminders() {
    const storedReminders = localStorage.getItem('reminders');
    if (storedReminders) {
        reminders.push(...JSON.parse(storedReminders));
        displayReminders();
        reminders.forEach(scheduleNotification); // Agenda notificações para lembretes já existentes
    }
}

function scheduleNotification(reminder) {
    const now = new Date().getTime();
    const timeToReminder = reminder.timestamp - now;

    if (timeToReminder > 0) {
        setTimeout(() => {
            sendPushNotification(reminder);
        }, timeToReminder);
    }
}

function sendPushNotification(reminder) {
    const payload = {
        title: "Lembrete!",
        body: `Hora de ${reminder.task}`
    };

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(payload.title, {
                body: payload.body,
                icon: 'https://image.freepik.com/vetores-gratis/icone-de-vetor-de-sino-simbolo-de-notificacao-em-fundo-azul-ilustracao-vetorial-eps-10_532800-388.jpg'
            });
        });
    }
}

// Carrega os lembretes ao iniciar
loadReminders();

// Função para checar lembretes a cada minuto
setInterval(() => {
    const now = new Date().getTime();
    reminders.forEach((reminder, index) => {
        if (now >= reminder.timestamp) {
            alert(`Lembrete: Hora de ${reminder.task}`);
            reminders.splice(index, 1);
            displayReminders();
            saveReminders(); // Salva após a remoção
        }
    });
}, 60000); // Checa a cada 60 segundos
