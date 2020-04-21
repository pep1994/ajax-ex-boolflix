/* Milestone 1:
 Creare un layout base con una searchbar(una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film.Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
 Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
 Titolo
 Titolo Originale
 Lingua
 Voto
*/

var inputSearch = $('#search'); // salvo in una variabile il riferimento all'input di ricerca
var inputSearchVal;

// imposto di default il valore dell'input vuoto
inputSearch.val("");

// associo l'evento tastiera all'input di ricerca
inputSearch.on('keypress', function (e) {  

    // se l'utente preme il tasto invio parte la chiamata ajax
    if (e.keyCode == 13) {

      inputSearchVal = inputSearch.val(); // salvo il valore dell'input ogni volta che viene premuto il tasto invio

      $.ajax({ // chiamata ajax

        url: "https://api.themoviedb.org/3/search/movie", // url api con end-point

        method: "GET", // metodo

        data: { // parametri che vongono aggiunti all'url
          api_key: 'fab78916a45f752a410befc4f3336db2',
          language: 'it-IT',
          query: inputSearchVal
        },
  
        success: function (result, stato) {

          var arrayResult = result.results; // salvo in una variabile l'array che mi ritorna dalla chiamata ajax

          // eseguo ciclo sull'array per estrapolare le informazioni che mi servono ad ogni item
          for (let i = 0; i < arrayResult.length; i++) {
            var arrayItem = arrayResult[i];

            var filmTitle = arrayItem.title; // salvo il titolo di ogni film ritornato
            console.log(filmTitle);
            var filmOriginalTitle = arrayItem.original_title; // salvo il titolo originale di ogni film ritornato
            console.log(filmOriginalTitle);
            var filmLanguage = arrayItem.original_language; // salvo la lingua di ogni film ritornato
            console.log(filmLanguage);
            var filmRank = arrayItem.vote_average; // salvo il voto di ogni film ritornato
            console.log(filmRank);
            
          }

          console.log(result.results);

          
        },
        error: function () {  

        }
      });
      
    }
    
    


  }
);
