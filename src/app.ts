document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO MENU INTERATIVO ---
    const header = document.getElementById('main-header') as HTMLElement;

    // Verifica se o header existe para evitar erros
    if (header) {
        window.addEventListener('scroll', () => {
            // Se a rolagem vertical for maior que 50 pixels
            if (window.scrollY > 50) {
                // Adiciona a classe 'scrolled' ao header
                header.classList.add('scrolled');
            } else {
                // Remove a classe 'scrolled' do header
                header.classList.remove('scrolled');
            }
        });
    }

    // --- LÓGICA DO SLIDER DE PRODUTOS ---
    const slider = document.querySelector('.slider') as HTMLElement;
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn') as HTMLButtonElement;
    const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement;
    
    // Verifica se os elementos do slider existem
    if (slider && slides.length > 0 && prevBtn && nextBtn) {
        let currentIndex = 0;
        const totalSlides = slides.length;

        // Função para atualizar a posição do slider
        const updateSlider = () => {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        // Evento do botão "Próximo"
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        });

        // Evento do botão "Anterior"
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
        
        // Inicia o slider na primeira imagem
        updateSlider();
    }

    // --- LÓGICA DO FORMULÁRIO DE CONTATO ---
    const form = document.getElementById('contact-form') as HTMLFormElement;
    
    // Verifica se o formulário existe
    if (form) {
        form.addEventListener('submit', (event) => {
            // Previne o comportamento padrão de recarregar a página
            event.preventDefault();
            
            // Captura os dados do formulário
            const name = (document.getElementById('name') as HTMLInputElement).value;
            const email = (document.getElementById('email') as HTMLInputElement).value;
            const message = (document.getElementById('message') as HTMLTextAreaElement).value;

            // Exibe um alerta com os dados (substitua isso pela lógica de envio real)
            alert(`Obrigado, ${name}! Recebemos sua mensagem.\n\nEm breve entraremos em contato.`);

            // Limpa o formulário após o envio
            form.reset();
        });
    }

});