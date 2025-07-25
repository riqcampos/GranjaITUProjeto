/**
 * =================================================================================
 * PARCEIRO DE PROGRAMAÇÃO - CÓDIGO JAVASCRIPT OTIMIZADO
 * =================================================================================
 * Estrutura:
 * 1. Funções Utilitárias: Funções auxiliares como preloadImages e debounce.
 * 2. Funções de Inicialização (Setup): Cada funcionalidade do site é encapsulada
 * na sua própria função (ex: setupStickyMenu, setupMainCarousel).
 * 3. Ponto de Entrada Principal: Um evento 'DOMContentLoaded' que chama todas as
 * funções de inicialização de forma organizada.
 * =================================================================================
 */

//------------------------------------------ 1. FUNÇÕES UTILITÁRIAS ------------------------------------------------//

/**
 * Pré-carrega uma lista de URLs de imagem de forma assíncrona.
 * Retorna uma promessa que é resolvida quando todas as imagens são carregadas.
 * @param {string[]} urls - Um array de URLs de imagens a serem pré-carregadas.
 * @returns {Promise<void>}
 */
const preloadImages = async (urls) => {
    // Promise.all espera que todas as promessas dentro do array sejam resolvidas.
    await Promise.all(urls.map(url => {
        // Para cada URL, criamos uma nova promessa.
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            // A promessa é resolvida quando a imagem termina de carregar.
            img.onload = resolve;
            // A promessa é rejeitada se houver um erro no carregamento.
            img.onerror = reject;
        });
    }));
};

/**
 * Cria uma versão "debounced" de uma função.
 * A função debounced só será executada após um certo tempo de inatividade.
 * Útil para eventos como 'resize' ou 'scroll' para melhorar a performance.
 * @param {Function} func - A função a ser "debounced".
 * @param {number} delay - O tempo de espera em milissegundos.
 * @returns {Function} - A nova função com o comportamento de debounce.
 */
const debounce = (func, delay = 250) => {
    let timeoutId;
    return (...args) => {
        // Limpa o timeout anterior se a função for chamada novamente.
        clearTimeout(timeoutId);
        // Define um novo timeout.
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};


//------------------------------------------ 2. FUNÇÕES DE INICIALIZAÇÃO (SETUP) --------------------------------------//

/**
 * Configura a lógica do menu que fica fixo no topo após o scroll.
 */
const setupStickyMenu = () => {
    const stickyMenu = document.getElementById('menuSticky');
    if (!stickyMenu) return;

    window.addEventListener('scroll', () => {
        // Usar pageYOffset é uma forma moderna e performática de obter a posição do scroll.
        if (window.pageYOffset >= 200) {
            stickyMenu.classList.add('active');
        } else {
            stickyMenu.classList.remove('active');
        }
    });
};

/**
 * Configura o carrossel infinito de logotipos de parceiros.
 */
const setupCoworkersCarousel = () => {
    const coworkersList = document.querySelector('.coworkersList');
    if (!coworkersList) return;

    // Clona os itens para criar o efeito de scroll infinito com CSS.
    // Esta lógica é executada uma vez e depois controlada por CSS, o que é ótimo para performance.
    const coworkers = Array.from(coworkersList.children);
    coworkers.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', true);
        coworkersList.appendChild(clone);
    });
    // A animação em si é delegada ao CSS, o que é muito eficiente.
    coworkersList.style.animation = 'infiniteScroll 20s linear infinite';
};

/**
 * Configura a seleção de produtos e pré-carrega as imagens.
 */
const setupProductSelector = async () => {
    const productList = document.querySelector('.productList');
    const productImage = document.querySelector('.productSelected');
    if (!productList || !productImage) return;

    // --- Otimização de Pré-carregamento ---
    try {
        // 1. Coleta os IDs de todos os produtos da lista.
        const productItems = productList.querySelectorAll('li[id]');
        const imageUrls = Array.from(productItems).map(item => `./images/products/${item.id}-1.png`);
        
        // 2. Chama nossa função assíncrona para carregar as imagens em segundo plano.
        await preloadImages(imageUrls);
        console.log('Imagens dos produtos pré-carregadas com sucesso!');
    } catch (error) {
        console.error('Erro ao pré-carregar as imagens dos produtos:', error);
    }
    // ------------------------------------

    productList.addEventListener('click', (event) => {
        const clickedItem = event.target.closest('li');

        if (!clickedItem || clickedItem.classList.contains('currentProduct')) {
            return;
        }
        productImage.classList.add('product-changing');

        // setTimeout continua útil para sincronizar com a animação CSS.
        setTimeout(() => {
            const productId = clickedItem.id;
            // A imagem já está no cache, a troca será instantânea.
            productImage.src = `./images/products/${productId}-1.png`;
            productImage.alt = `Embalagem com ${productId} ovos`;
            productImage.id = `img${productId}`;

            productImage.classList.remove('product-changing');
        }, 500);

        const currentActive = productList.querySelector('.currentProduct');
        if (currentActive) {
            currentActive.classList.remove('currentProduct');
            currentActive.classList.add('productItem');
        }

        clickedItem.classList.add('currentProduct');
        clickedItem.classList.remove('productItem');
    });
};

/**
 * Configura o accordion de receitas.
 */
const setupRecipesAccordion = () => {
    const recipeBorders = document.querySelectorAll('.borderRecipe');
    if (recipeBorders.length === 0) return;

    recipeBorders.forEach(border => {
        border.addEventListener('click', function() {
            const isExpanded = this.classList.contains('expanded');
            const currentlyExpanded = document.querySelector('.borderRecipe.expanded');

            if (currentlyExpanded) {
                currentlyExpanded.classList.remove('expanded');
            }

            if (!isExpanded) {
                this.classList.add('expanded');
            }
        });
    });
};

/**
 * Configura a animação de fade-in dos elementos ao rolar a página.
 * O uso de IntersectionObserver já é uma técnica assíncrona e altamente performática.
 */
const setupFadeInObserver = () => {
    const elementsToFadeIn = document.querySelectorAll('.fade-in-element');
    if (elementsToFadeIn.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementsToFadeIn.forEach(el => observer.observe(el));
};

/**
 * Configura a lógica de abrir e fechar o menu hamburger.
 */
const setupHamburgerMenu = () => {
    const hamburgerMain = document.querySelector('.hamburger');
    const menuItensList = document.querySelector('.menuItens');
    const hamburgerSticky = document.querySelector('.hamburger-sticky');
    if (!hamburgerMain || !menuItensList || !hamburgerSticky) return;

    const toggleMenu = () => {
        hamburgerMain.classList.toggle('active');
        hamburgerSticky.classList.toggle('active');
        menuItensList.classList.toggle('active');
    };
    
    const closeMenu = () => {
        hamburgerMain.classList.remove('active');
        hamburgerSticky.classList.remove('active');
        menuItensList.classList.remove('active');
    };
    
    hamburgerMain.addEventListener('click', toggleMenu);
    hamburgerSticky.addEventListener('click', toggleMenu);
    
    menuItensList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
};

/**
 * Configura o carrossel de imagens principal.
 */
const setupMainCarousel = () => {
    const carousel = document.querySelector('.imagesCarrousel');
    const leftBtn = document.getElementById('LeftBtn');
    const rightBtn = document.getElementById('RightBtn');
    if (!carousel || !leftBtn || !rightBtn) return;

    const images = Array.from(carousel.children);
    if (images.length === 0) return;

    // Clona o primeiro e o último item para o efeito de loop infinito.
    const firstClone = images[0].cloneNode(true);
    const lastClone = images[images.length - 1].cloneNode(true);
    carousel.appendChild(firstClone);
    carousel.insertBefore(lastClone, images[0]);
    const allImages = carousel.querySelectorAll('.imageCarrousel');

    let currentIndex = 1;
    let isTransitioning = false;
    let imageWidth = allImages[0].clientWidth;

    const updatePosition = (transition = 'none') => {
        carousel.style.transition = transition;
        carousel.style.transform = `translateX(-${imageWidth * currentIndex}px)`;
    };

    const moveSlide = (direction) => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex += direction;
        updatePosition('transform 0.5s ease-in-out');
    };
    
    // Posiciona o carrossel na primeira imagem "real" ao carregar.
    updatePosition();
    
    rightBtn.addEventListener('click', () => moveSlide(1));
    leftBtn.addEventListener('click', () => moveSlide(-1));

    carousel.addEventListener('transitionend', () => {
        if (currentIndex === 0) {
            currentIndex = allImages.length - 2;
            updatePosition();
        } else if (currentIndex === allImages.length - 1) {
            currentIndex = 1;
            updatePosition();
        }
        isTransitioning = false;
    });

    // --- Otimização do Evento de Redimensionamento ---
    const handleResize = () => {
        // Recalcula a largura da imagem e reposiciona o carrossel sem animação.
        imageWidth = allImages[0].clientWidth;
        updatePosition();
    };

    // Usa a função "debounce" para evitar cálculos excessivos durante o resize.
    window.addEventListener('resize', debounce(handleResize, 250));
};


//------------------------------------------ 3. PONTO DE ENTRADA PRINCIPAL ------------------------------------------//

/**
 * O evento 'DOMContentLoaded' é disparado assim que o HTML da página foi completamente
 * carregado e analisado, sem esperar por folhas de estilo e imagens.
 * É o ponto de partida ideal para a maioria das manipulações de script.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Estas funções não dependem de imagens externas e podem ser executadas imediatamente.
    setupStickyMenu();
    setupCoworkersCarousel();
    setupRecipesAccordion();
    setupFadeInObserver();
    setupHamburgerMenu();
    
    // A função de seleção de produto agora é assíncrona para pré-carregar as imagens.
    setupProductSelector();
});

/**
 * O evento 'load' é disparado após todo o conteúdo da página, incluindo imagens
 * e folhas de estilo, ter sido carregado. É o melhor momento para configurar
 * funcionalidades que dependem das dimensões corretas das imagens, como o carrossel.
 */
window.addEventListener('load', () => {
    setupMainCarousel();
});