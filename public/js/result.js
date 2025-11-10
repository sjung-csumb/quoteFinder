$("#closeModel").addEventListener("click", () => {
            $("#authorModal").close()
        });

        //Same functions as $(selector)
        function $(selector){
            return document.querySelector(selector);
        }
        //To apply every author links, Use querySelectorAll and use as array in FOR condition.
        const allAuthors = document.querySelectorAll(".authors");
        for (let i of allAuthors){
            i.addEventListener("click", getAuthorInfo);
        }
        // for (let i=0; i<allAuthors.length; i++){
        //     allAuthors[i].addEventListener("click", getAuthorInfo);
        // }
        

        async function getAuthorInfo(){
            console.log(this);
            let authorId = this.getAttribute("authorId");
            let url = "api/authors/" + authorId;
            let response = await fetch(url);
            let data = await response.json();
            console.log(data);
            $("#authorName").textContent = data[0].firstName + " "+ data[0].lastName;

            $("#authorBio").textContent = data[0].biography;

            $("#authorImage").src = data[0].portrait;
            $("#authorModal").showModal();
        }