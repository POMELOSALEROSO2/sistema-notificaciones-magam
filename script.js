document.addEventListener('DOMContentLoaded', function() {
    const absenceForm = document.getElementById('absenceForm');
    const notificationList = document.getElementById('notificationList');
    
    // Cargar notificaciones guardadas
    loadNotifications();

    absenceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const studentName = document.getElementById('studentName').value;
        const date = document.getElementById('date').value;
        const timeSlot = document.getElementById('timeSlot').value;
        const reason = document.getElementById('reason').value;

        // Crear notificación para el almacenamiento local
        const notification = {
            studentName,
            date,
            timeSlot,
            reason,
            timestamp: new Date().toISOString()
        };

        // Preparar template params para EmailJS
        const templateParams = {
            to_email: 'manugentrenamiento@gmail.com',
            student_name: studentName,
            date: new Date(date).toLocaleDateString('es-AR'),
            time_slot: timeSlot,
            reason: reason || 'No especificado'
        };

        // Mostrar mensaje de envío
        const submitButton = absenceForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        // Enviar email usando EmailJS
        emailjs.send('service_qxpo4ad', 'template_45i204r', templateParams)
            .then(function() {
                // Guardar notificación localmente
                saveNotification(notification);
                
                // Mostrar notificación en la página
                displayNotification(notification);
                
                // Limpiar formulario
                absenceForm.reset();
                
                // Mostrar mensaje de éxito
                alert('¡Notificación enviada con éxito!');
            })
            .catch(function(error) {
                console.error('Error al enviar el email:', error);
                alert('Error al enviar la notificación. Por favor, intenta nuevamente.');
            })
            .finally(function() {
                // Restaurar botón
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
    });

    function saveNotification(notification) {
        let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    function loadNotifications() {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.forEach(notification => displayNotification(notification));
    }

    function displayNotification(notification) {
        const li = document.createElement('li');
        const formattedDate = new Date(notification.date).toLocaleDateString('es-AR');
        
        li.innerHTML = `
            <strong>${notification.studentName}</strong> no asistirá a la clase del 
            ${formattedDate} a las ${notification.timeSlot}
        `;
        
        notificationList.insertBefore(li, notificationList.firstChild);
    }

    // Configurar fecha mínima como hoy
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
});
