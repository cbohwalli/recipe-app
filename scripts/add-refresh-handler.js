export function addRefreshHandler(){
    const header = document.getElementById('headerHeading');
    header.addEventListener('click', () => {
        location.reload();    
    })
}