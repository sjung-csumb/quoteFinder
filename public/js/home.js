document.querySelector("#searchByKeywordForm").addEventListener("submit",validateKeyword)

function validateKeyword(){
    let keyword = document.querySelector("input[name=keyword]").value;
    //alert(keyword);
    if(keyword.length < 3){
        alert("Keyword must be longer than 2 characters");
        event.preventDefault(); //prevents the submission of the form.
    }
}