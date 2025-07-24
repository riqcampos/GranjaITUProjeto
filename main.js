document.addEventListener('DOMContentLoaded', function() {
    //------------------------------------------Sticky Menu Logic------------------------------------------------//
    const stickyMenu = document.getElementById('menuSticky');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset >= 200) {
            stickyMenu.classList.add('active');
        } else {
            stickyMenu.classList.remove('active');
        }
    });

    //------------------------------------------Coworkers Carousel Logic------------------------------------------------//
    const coworkersList = document.querySelector('.coworkersList');
    if (coworkersList) {
        const coworkers = Array.from(coworkersList.children);
        coworkers.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', true); 
            coworkersList.appendChild(clone);
        });
        coworkersList.style.animation = 'infiniteScroll 20s linear infinite';
    }

    //------------------------------------------Product Selection Logic------------------------------------------------//
    const productList = document.querySelector('.productList');
    const productImage = document.querySelector('.productSelected');

    if (productList && productImage) {
        productList.addEventListener('click', function(event) {
            const clickedItem = event.target.closest('li');

            if (!clickedItem || clickedItem.classList.contains('currentProduct')) {
                return;
            }
            productImage.classList.add('product-changing');

            // Espera a animação de saída terminar para trocar a imagem
            setTimeout(() => {
                // Atualiza a imagem e o texto alternativo
                const productId = clickedItem.id;
                productImage.src = `./images/products/${productId}-1.png`;
                productImage.alt = `Embalagem com ${productId} ovos`;
                productImage.id = `img${productId}`

                // Remove a classe para iniciar a animação de "entrada"
                productImage.classList.remove('product-changing');
            }, 500); // A duração deve ser a mesma da transição no CSS

            // Encontra o item atualmente ativo e o desativa
            const currentActive = productList.querySelector('.currentProduct');
            if (currentActive) {
                currentActive.classList.remove('currentProduct');
                currentActive.classList.add('productItem');
            }

            // Ativa o item clicado
            clickedItem.classList.add('currentProduct');
            clickedItem.classList.remove('productItem');

        });
    }

    //------------------------------------------Recipes Accordion Logic------------------------------------------------//
    const recipeBorders = document.querySelectorAll('.borderRecipe');

    recipeBorders.forEach(border => {
        border.addEventListener('click', function() {
            // Verifica se a receita clicada já está expandida
            const isExpanded = this.classList.contains('expanded');

            // Primeiro, recolhe qualquer receita que esteja atualmente expandida
            const currentlyExpanded = document.querySelector('.borderRecipe.expanded');
            if (currentlyExpanded) {
                currentlyExpanded.classList.remove('expanded');
            }

            // Se a receita clicada não era a que já estava expandida, expande-a.
            // Isso cria o efeito de "toggle" (clicar de novo para fechar).
            if (!isExpanded) {
                this.classList.add('expanded');
            }
        });
    });

    //------------------------------------------Fade-in on Scroll Logic------------------------------------------------//
    const observerOptions = {
        root: null, // Usa o viewport como área de observação
        rootMargin: '0px',
        threshold: 0.1 // A animação dispara quando 10% do elemento estiver visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Se o elemento está intersectando (visível)
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Para de observar o elemento para não re-animar
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Pega todos os elementos com a classe .fade-in-element e começa a observá-los
    document.querySelectorAll('.fade-in-element').forEach(el => observer.observe(el));

    //------------------------------------------Hamburger Menu Logic------------------------------------------------//
    // Corrigido para usar seletores de classe, que correspondem ao seu arquivo menu.css
    const hamburgerMain = document.querySelector('.hamburger');
    const menuItensList = document.querySelector('.menuItens');
    const hamburgerSticky = document.querySelector('.hamburger-sticky');

    // Função única para abrir/fechar o menu
    const toggleMenu = () => {
        // Adiciona ou remove a classe 'active' de todos os elementos de uma vez
        hamburgerMain.classList.toggle('active');
        hamburgerSticky.classList.toggle('active');
        menuItensList.classList.toggle('active');
    };
    
    // Função para fechar o menu ao clicar em um link
    const closeMenu = () => {
        hamburgerMain.classList.remove('active');
        hamburgerSticky.classList.remove('active');
        menuItensList.classList.remove('active');
    };
    
    // Adiciona os eventos de clique aos botões
    if (hamburgerMain && hamburgerSticky && menuItensList) {
        hamburgerMain.addEventListener('click', toggleMenu);
        hamburgerSticky.addEventListener('click', toggleMenu);
    
        // Adiciona evento para fechar o menu ao clicar em um item
        menuItensList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
});

//------------------------------------------Main Image Carousel Logic------------------------------------------------//
// Movido para fora do 'DOMContentLoaded' pois 'load' já espera o carregamento completo da página,
// incluindo imagens. Aninhar os dois é desnecessário.
window.addEventListener('load', function() {
    // Seleciona os elementos do carrossel
    const carousel = document.querySelector('.imagesCarrousel');
    const leftBtn = document.getElementById('LeftBtn');
    const rightBtn = document.getElementById('RightBtn');

    // Verifica se todos os elementos existem antes de continuar
    if (!carousel || !leftBtn || !rightBtn) {
        console.error("Um ou mais elementos do carrossel não foram encontrados.");
        return;
    }

    const images = document.querySelectorAll('.imageCarrousel');
    if (images.length === 0) return; // Evita erros se não houver imagens

    let currentIndex = 1; 
    let isTransitioning = false;

    // 1. Clonar a primeira e a última imagem
    const firstClone = images[0].cloneNode(true);
    const lastClone = images[images.length - 1].cloneNode(true);

    // Adiciona os clones ao carrossel
    carousel.appendChild(firstClone);
    carousel.insertBefore(lastClone, images[0]);

    // Atualiza a lista de imagens para incluir os clones
    const allImages = document.querySelectorAll('.imageCarrousel');
    let imageWidth = allImages[0].clientWidth; // 'let' para poder ser atualizado no resize

    // Função para atualizar a posição do carrossel sem animação
    const updatePosition = () => {
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(-${imageWidth * currentIndex}px)`;
    }

    // 2. Posicionar o carrossel na primeira imagem "real"
    updatePosition();

    // Função para mover o slide
    const moveSlide = (direction) => {
        if (isTransitioning) return; // Se já estiver animando, não faz nada

        isTransitioning = true;
        currentIndex += direction;

        carousel.style.transition = 'transform 0.5s ease-in-out';
        carousel.style.transform = `translateX(-${imageWidth * currentIndex}px)`;
    };

    // 3. Adicionar os eventos de clique nos botões
    rightBtn.addEventListener('click', () => moveSlide(1));
    leftBtn.addEventListener('click', () => moveSlide(-1));

    // 4. Lógica do "salto mágico" para criar o loop infinito
    carousel.addEventListener('transitionend', () => {
        if (currentIndex === 0) { // Chegou no clone da última imagem (à esquerda)
            currentIndex = allImages.length - 2;
            updatePosition();
        } else if (currentIndex === allImages.length - 1) { // Chegou no clone da primeira (à direita)
            currentIndex = 1;
            updatePosition();
        }
        isTransitioning = false;
    });

    window.addEventListener('resize', () => {
        imageWidth = allImages[0].clientWidth;
        updatePosition();
    });
});
