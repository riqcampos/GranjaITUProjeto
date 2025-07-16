document.addEventListener('DOMContentLoaded', function() {
    //------------------------------------------Sticky Menu Logic------------------------------------------------//
    const stickyMenu = document.getElementById('menuSticky');
    stickyMenu.style.marginTop = '-5%';
    stickyMenu.style.opacity = '0';

    window.addEventListener('scroll', function() {
        if (window.pageYOffset >= 200) {
            stickyMenu.style.marginTop = '0%';
            stickyMenu.style.opacity = '1';
        }else {
            stickyMenu.style.marginTop = '-5%';
            stickyMenu.style.opacity = '0';
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

            if (!clickedItem || clickedItem.classList.contains('curentProduct')) {
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
            const currentActive = productList.querySelector('.curentProduct');
            if (currentActive) {
                currentActive.classList.remove('curentProduct');
                currentActive.classList.add('productItem');
            }

            // Ativa o item clicado
            clickedItem.classList.add('curentProduct');
            clickedItem.classList.remove('productItem');

        });
    }

    //------------------------------------------Main Image Carousel Logic------------------------------------------------//

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
    const imageWidth = allImages[0].clientWidth;

    // 2. Posicionar o carrossel na primeira imagem "real"
    // Sem animação inicialmente, para que o usuário não veja o ajuste
    carousel.style.transform = `translateX(-${imageWidth * currentIndex}px)`;

    // Função para mover o slide
    const moveSlide = (direction) => {
        if (isTransitioning) return; // Se já estiver animando, não faz nada

        isTransitioning = true;
        // Move para a próxima imagem ou para a anterior
        currentIndex += direction;

        // Aplica a transição suave
        carousel.style.transition = 'transform 0.5s ease-in-out';
        carousel.style.transform = `translateX(-${imageWidth * currentIndex}px)`;
    };

    // 3. Adicionar os eventos de clique nos botões
    rightBtn.addEventListener('click', () => moveSlide(1)); // Move para a direita
    leftBtn.addEventListener('click', () => moveSlide(-1)); // Move para a esquerda

    // 4. Lógica do "salto mágico" para criar o loop infinito
    carousel.addEventListener('transitionend', () => {
        // Se chegamos no clone da primeira imagem (no final)
        if (currentIndex === allImages.length - 1) {
            // Remove a animação para o salto ser instantâneo
            carousel.style.transition = 'none';
            // Volta para a primeira imagem real
            currentIndex = 1;
            carousel.style.transform = `translateX(-${imageWidth * currentIndex}px)`;
        }

        // Se chegamos no clone da última imagem (no início)
        if (currentIndex === 0) {
            carousel.style.transition = 'none';
            // Vai para a última imagem real
            currentIndex = allImages.length - 2;
            carousel.style.transform = `translateX(-${imageWidth * currentIndex}px)`;
        }

        // Libera para o próximo clique após a transição terminar
        isTransitioning = false;
    });

    window.addEventListener('resize', () => {
        const newImageWidth = allImages[0].clientWidth;
        carousel.style.transition = 'none'; // Remove transição para o ajuste
        carousel.style.transform = `translateX(-${newImageWidth * currentIndex}px)`;
    });

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
    const hamburgerMain = document.getElementById('hamburger-main');
    const menuItensList = document.getElementById('menuItensList');
    const hamburgerSticky = document.getElementById('hamburger-sticky');

    const setupHamburgerMenu = (hamburger, menu) => {
        if (hamburger && menu) {
            hamburger.addEventListener('click', () => {
                // Alterna o estado ativo do hamburger e do menu
                hamburgerMain.classList.toggle('active', !hamburgerMain.classList.contains('active'));
                hamburgerSticky.classList.toggle('active', hamburgerMain.classList.contains('active'));
                menu.classList.toggle('active', hamburgerMain.classList.contains('active'));
            });

            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    // Fecha o menu ao clicar em um link
                    hamburgerMain.classList.remove('active');
                    hamburgerSticky.classList.remove('active');
                    menu.classList.remove('active');
                });
            });
        }
    };

    // Configura ambos os botões para controlar o mesmo menu mobile
    setupHamburgerMenu(hamburgerMain, menuItensList);
    setupHamburgerMenu(hamburgerSticky, menuItensList);
});

window.addEventListener('resize', function() {
   location.reload();
});
