self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker ativado');
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'Lembrete!', body: 'Você recebeu um lembrete!' };

    const options = {
        body: data.body,
        icon: 'https://static.vecteezy.com/ti/vetor-gratis/p2/4733968-icone-de-linha-de-notificacao-de-e-mail-em-branco-vetor.jpg'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
