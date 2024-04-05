const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href
        })
    })
}

// form search 
const formSearch = document.querySelector("#form-search");
let url = new URL(window.location.href);
if (formSearch) {
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href
    });
}
//pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination) {
    let url = new URL(window.location.href);
    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page", page);
            window.location.href = url.href;
        })
    })
}

//end pagination

// checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]")
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']")
    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true
            })
        } else {
            inputsId.forEach(input => {
                input.checked = false
            })
        }
    });
    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked")
            if (countChecked.length == inputsId.length) {
                inputCheckAll.checked = true
            } else {
                inputCheckAll.checked = false
            }
        })
    })
}
// end checkbox multi

//form change multi
const formChangeMulti = document.querySelector("[form-change-multi]")
if(formChangeMulti){
    formChangeMulti.addEventListener("submit",(e)=>{
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        )
        const typeChange = e.target.elements.type.value;
        if(typeChange =="delete-all"){
            const isConfirm = confirm("Bạn có chắc muốn xoá sản phẩm này")
            if(!isConfirm){
                return;
            }

        }
        if(inputChecked.length > 0){
            let ids = []
            const inputsIds = formChangeMulti.querySelector("input[name='ids']")
            inputChecked.forEach(input =>{
                const id = input.value
                if(typeChange =="change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value
                    ids.push(`${id}-${position}`)
                }else{
                    ids.push(id)
                }
            })
            inputsIds.value= ids.join(", ")
            formChangeMulti.submit();
        }else{
            alert("vui lòng chọn một bản ghi")
        }
    })
}

// show alert
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

//upload-image
const uploadImage = document.querySelector("[upload-image]")
if(uploadImage){
    const uploadImageInput = document.querySelector("[upload-image-input]")
    const uploadImagePreview = document.querySelector("[upload-image-preview")
    uploadImageInput.addEventListener("change",(e)=>{
    const file = e.target.files[0];
    if(file){
        uploadImagePreview.src = URL.createObjectURL(file)
    } 
    })
}
//end upload-image

// remove upload-image
const removeButton = document.querySelector("[remove-button]")
if(removeButton){
    const uploadImagePreview = document.querySelector("[upload-image-preview]")
    removeButton.addEventListener("click", (e)=>{
        uploadImagePreview.src = ""
        uploadImagePreview.value=""
    })
}
// end remove upload-image