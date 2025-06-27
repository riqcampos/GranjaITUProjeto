document.addEventListener('DOMContentLoaded', function() {

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


    //------------------------------------------Main Image Carousel Logic------------------------------------------------//

    const leftBtn = document.getElementById('LeftBtn');
    const rightBtn = document.getElementById('RightBtn');
    const imageContainer = document.querySelector('.imagesCarrousel');

    if (leftBtn && rightBtn && imageContainer) {
        const scrollAmount = () => {
            const firstImage = imageContainer.querySelector('.imageCarrousel');
            return firstImage ? firstImage.clientWidth : 0;
        };

        rightBtn.addEventListener('click', () => {
            // Rola para a direita
            imageContainer.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
        });

        leftBtn.addEventListener('click', () => {
            // Rola para a esquerda
            imageContainer.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
        });
    }

});