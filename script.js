// ===============================
// GROWTH WITH GRACE PARIVAR
// script.js
// ===============================


// Navbar shadow on scroll

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    if(window.scrollY > 40){
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});
