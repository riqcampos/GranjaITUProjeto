// Espera o conteúdo da página carregar antes de executar o script
document.addEventListener('DOMContentLoaded', function () {
    // Seleciona o botão de CTA de forma segura
    var ctaButton = document.querySelector('.cta-button');
    // Verifica se o botão realmente existe na página
    if (ctaButton) {
        // Adiciona um evento de clique ao botão
        ctaButton.addEventListener('click', function () {
            console.log('Botão "Entre em contato" foi clicado!');
            // Aqui você poderia adicionar a lógica para abrir um formulário de contato,
            // rolar a página para a seção de contato, etc.
            alert('Página em construção! Em breve, um formulário de contato aparecerá aqui.');
        });
    }
    // Exemplo de como selecionar os links de navegação
    var navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Impede o comportamento padrão do link
            var targetId = link.getAttribute('href');
            console.log("Navegando para: ".concat(targetId));
            // Futuramente, adicione uma lógica de rolagem suave aqui
        });
    });
});
