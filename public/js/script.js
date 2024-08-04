const showAlert = document.querySelector("[show-alert]")
if(showAlert){
    const closeAlert = document.querySelector("[close-alert]")
    const time = parseInt(showAlert.getAttribute("data-time"))
    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time);
    closeAlert.addEventListener("click", () =>{
        showAlert.classList.add("alert-hidden")
    })
}

const Backbutton = document.querySelector("[button-go-back]")
if(Backbutton){
    let url = new URL(window.location.href);
    Backbutton.addEventListener("click", (e)=>{
        window.history.back()    
    })
}
//detect browser or web closing
// window.addEventListener("beforeunload", function (e) {
//     socket.emit("CLIENT_CLOSE_WEB", "test")
// })