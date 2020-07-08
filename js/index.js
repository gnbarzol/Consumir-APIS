let select = document.getElementById("inputGroupSelect");

const getAuthors = () => {
    fetch("https://dataserverdaw.herokuapp.com/libros/autor")
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            let authors = data.authors;       
            
            //Ordeno los autores por nombre
            authors.sort((a, b) => {
                if (a.author > b.author) {
                  return 1;
                }
                if (a.author < b.author) {
                  return -1;
                }
                // a = b
                return 0;
            });

            for(let index in authors){
                let author = authors[index].author;
                //Para no agregar autores vacios
                if(author !== '')
                    select.innerHTML += `<option value="${author}">${author}</option>`;
            }
        })
}

//Cada vez que se elija otro autor el select lanza el event change
select.addEventListener('change', (e) => {
    //Obtengo el contenedor donde se mostraran los resultados
    let response = document.getElementById("resultados");
    response.innerHTML = `<p class="text-muted">Loading...</p>`;

    fetch("https://dataserverdaw.herokuapp.com/libros/xml")
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(data,"text/xml");
            let books = xml.getElementsByTagName('book');

            //Obtengo el valor del select
            let value = e.target.value;

            response.innerHTML = "" ;

            for(let book of books){
                //Saco los autores del libro
                let authors = book.getElementsByTagName('authors');
                //Solo se escoje los libros con autores
                if(authors.length > 0){
                    //Obtiene los book que estan dentro de authores
                    let authorsBook = authors[0].getElementsByTagName('book');

                    //Recorre los book de cada authorsBook
                    for(let nameBook of authorsBook){
                        //Obtiene el texto del autor del libro
                        let bookText = nameBook.textContent;
                        //Si el texto del libro es igual al que escogio en el select
                        if(bookText == value){
                            //Obtiene el src de la img del libro
                            let urlImg = book.getElementsByTagName('thumbnailUrl')[0].textContent;
                            //Inyecta la img al html
                            response.innerHTML += `
                            <img class="img-thumbnail m-2" width="160px" height="197px" src="${urlImg}" />
                            `
                        }
                    }
                }
            }

            //Si no se encontraron resultados de busqueda se ejecuta la sentencia
            if(response.textContent === ""){
                response.innerHTML = `<p class="text-muted">No se encontraron libros de ${value}</p>`;
            }

            
        })
});

document.addEventListener('DOMContentLoaded', () => {
    getAuthors();
})