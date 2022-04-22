const dragBar = {
    container: document.getElementById('savedMealsContainer'),
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    addMouseHandlers: function() {
         addEventMouseDown(this);
         addEventMouseLeave(this);
         addEventMouseMove(this);
         addEventMouseUp(this); 
        }
}

function addEventMouseDown(dragBar) {
    dragBar.container.addEventListener('mousedown', (e) => {
        dragBar.isDown = true;
        dragBar.container.classList.add('active');
        dragBar.startX = e.pageX - dragBar.container.offsetLeft;
        dragBar.scrollLeft = dragBar.container.scrollLeft;
    });
}

function addEventMouseLeave(dragBar) {
    dragBar.container.addEventListener('mouseleave', () => {
        dragBar.isDown = false;
        dragBar.container.classList.remove('active');
    });
}

function addEventMouseMove(dragBar) {
    dragBar.container.addEventListener('mousemove', (e) => {
        if(!dragBar.isDown) return;
        e.preventDefault();
        const x = e.pageX - dragBar.container.offsetLeft;
        const walk = (x - dragBar.startX) * 3; //scroll-fast
        dragBar.container.scrollLeft = dragBar.scrollLeft - walk;
    });
}

function addEventMouseUp(dragBar) {
    dragBar.container.addEventListener('mouseup', () => {
        dragBar.isDown = false;
        dragBar.container.classList.remove('active');
    });
}

export default dragBar;