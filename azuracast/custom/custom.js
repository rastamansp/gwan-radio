/**
 * Custom JavaScript para AzuraCast - GWAN Radio
 * 
 * Este arquivo permite adicionar funcionalidades customizadas ao AzuraCast.
 * O código será executado em todas as páginas após o carregamento.
 * 
 * Documentação: https://www.azuracast.com/docs/administration/using-custom-javascript/
 */

(function() {
    'use strict';

    // Aguardar carregamento completo da página
    document.addEventListener('DOMContentLoaded', function() {
        console.log('GWAN Radio - Custom JavaScript carregado');

        // Exemplo: Adicionar evento personalizado ao player
        const audioPlayer = document.querySelector('audio');
        if (audioPlayer) {
            audioPlayer.addEventListener('play', function() {
                console.log('Reprodução iniciada');
                // Adicione sua lógica aqui
            });

            audioPlayer.addEventListener('pause', function() {
                console.log('Reprodução pausada');
                // Adicione sua lógica aqui
            });
        }

        // Exemplo: Personalizar comportamento de botões
        const customButtons = document.querySelectorAll('.custom-button');
        customButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                // Adicione sua lógica aqui
            });
        });

        // Exemplo: Adicionar analytics ou tracking
        // gtag('event', 'page_view', {
        //     'page_title': document.title,
        //     'page_location': window.location.href
        // });

        // Adicione suas funcionalidades customizadas abaixo
    });

    // Exemplo: Função utilitária personalizada
    window.gwanRadio = {
        // Função para exibir notificações customizadas
        showNotification: function(message, type) {
            // Implemente sua lógica de notificação aqui
            console.log('Notification:', message, type);
        },

        // Adicione outras funções utilitárias aqui
    };
})();
