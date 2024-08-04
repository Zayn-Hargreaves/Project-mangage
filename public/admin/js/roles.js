const tablePermission = document.querySelector('[table-permissions')
if (tablePermission){
    const buttionSubmit = document.querySelector('[button-submit]');
    buttionSubmit.addEventListener("click", ()=>{
        let permissions = []
        const rows = document.querySelectorAll("[data-name]")
        rows.forEach(row=>{
            const name = row.getAttribute("data-name")
            // console.log(name)
            const inputs = row.querySelectorAll('input')
            // console.log(inputs)
            if(name == 'id'){
                // console.log(name)
                inputs.forEach( input =>{
                    const id = input.value
                    permissions.push({
                        id:id,
                        permissions:[]
                    })
                })
            }else{
                inputs.forEach((input, index) =>{
                    const checked = input.checked;
                    if(checked){
                        permissions[index].permissions.push(name)
                    }
                })
            }
        })
        if(permissions.length>0){
            const formChangePermissions = document.querySelector("#form-change-permissions");
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
            inputPermissions.value = JSON.stringify(permissions); // covert json beacuse present is array
            formChangePermissions.submit();
        }
    })
}

//permission data defautl

const dataRecord = document.querySelector('[data-records]')
if(dataRecord){
    const records = JSON.parse(dataRecord.getAttribute("data-records"));
    const tablePermissions = document.querySelector("[table-permissions]");

    records.forEach((records, index) => {
        const permissions = records.permissions;

        permissions.forEach(permissions => {
            const row = tablePermissions.querySelector(`[data-name=${permissions}]`);
            const input = row.querySelectorAll("input")[index];

            input.checked = true;
        })
    })
}