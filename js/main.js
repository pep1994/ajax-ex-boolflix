/* Milestone 1:
 Creare un layout base con una searchbar(una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film.Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
 Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
 Titolo
 Titolo Originale
 Lingua
 Voto
*/

/* Milestone 2:
Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene
Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).

Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
*/

$(document).ready(function () {
  
  var inputSearch = $('#search'); // salvo in una variabile il riferimento all'input di ricerca
  

  // variabili Template Handlebars
  var source = $('#list-template').html();
  var template = Handlebars.compile(source);

  // array di bandiere
  var flags = ['en', 'es', 'it', 'pt', 'ja', 'de', 'fr', 'cn'];

  // imposto di default il valore dell'input vuoto
  inputSearch.val("");

  // associo l'evento click al button di invio ricerca. Cliccando il bottone parte la funzione ajaxPrint
  $('#go').click(function () {  
    $('.container').html(''); // rimuovo l'html presente in container, perchè in questo modo i risultati della ricerca precedente vengono eliminati lasciando posto a quelli della nuova ricerca
    ajaxPrint();

  });

  // associo l'evento tastiera all'input di ricerca
  inputSearch.on('keypress', function (e) {

    
    if (e.keyCode == 13) {

      $('.container').html(''); // rimuovo l'html presente in container, perchè in questo modo i risultati della ricerca precedente vengono eliminati lasciando posto a quelli della nuova ricerca
    // se l'utente preme il tasto invio parte la funzione ajaxPrint
      ajaxPrint();

    }

  }
  );

  
  // al click sul logo boolflix l'eventuale scroll torna in alto
  $('h1').click(function () {
    $('main').animate({
      scrollTop: 0
    }, 600);
  });


  // funzione che esegue una chiamata ajax e stampa in pagina i risultati
  function ajaxPrint() {

    var inputSearchVal;
    inputSearchVal = inputSearch.val(); // salvo il valore dell'input ogni volta che viene premuto il tasto invio

    $.ajax({ // chiamata ajax

      url: "https://api.themoviedb.org/3/search/movie", // url api con end-point

      method: "GET", // metodo

      dataType: 'json',

      data: { // parametri che vongono aggiunti all'url
        api_key: 'fab78916a45f752a410befc4f3336db2',
        language: 'it-IT',
        query: inputSearchVal
      },

      success: function (result, stato) {

        var arrayResult = result.results; // salvo in una variabile l'array che mi ritorna dalla chiamata ajax
        console.log(arrayResult);
        
          // se l'array è vuoto, cioè non ha risultati, allora stampa il messaggio di errore
          if (arrayResult.length <= 0) {

            $('.container').append('<h2 class="not-found">La ricerca non ha prodotto risultati di Film</h2>');

            // altrimenti esegui il ciclo e stampa le informazioni in pagina
          } else {

              // eseguo ciclo sull'array per estrapolare le informazioni che mi servono ad ogni item
              for (let i = 0; i < arrayResult.length; i++) {

                var arrayItem = arrayResult[i]; // salvo l'item dell'array
                console.log(arrayItem);
                
                var filmTitle = arrayItem.title; // salvo il titolo di ogni film ritornato
                var filmOriginalTitle = arrayItem.original_title; // salvo il titolo originale di ogni film ritornato
                var filmLanguage = arrayItem.original_language; // salvo la lingua di ogni film ritornato
                var filmRank = arrayItem.vote_average; // salvo il voto di ogni film ritornato

                console.log(flags.includes('en.png'));
                var flagImg = filmLanguage;
                
                
                for (let j = 0; j < flags.length; j++) {
                  var flagsItem = flags[j];

                  if (flagsItem.includes(filmLanguage)) {
                     flagImg = '<img src='  + 'img/'+ flagsItem + '.png' + '' + '>';
                  } 

                }

                // trasformo il voto in numero intero e lo divido per due 
                var rankConvert = Math.ceil(filmRank / 2);
                console.log(rankConvert);
                console.log(filmRank);
                var rankStar;

                if (rankConvert == 0) {
                  rankStar = '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>';
                } else if (rankConvert == 1) {
                   rankStar = '<i class="fas fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>';
                } else if (rankConvert == 2) {
                   rankStar = '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>';
                } else if (rankConvert == 3) {
                   rankStar = '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>';
                } else if (rankConvert == 4) {
                   rankStar = '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="far fa-star"></i>';
                } else {
                   rankStar = '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>';
                }
                


                // se il titolo è uguale al titolo originale non stampo il titolo originale
                if (filmTitle == filmOriginalTitle) {

                  var context = {
                    title: filmTitle,
                    language: flagImg,
                    rank: rankStar,
                    type: 'Film'
                  }

                // altrimenti stampo anche il titolo originale
                } else {

                  // creo il contenuto nei segnaposto del template per ogni iterazione
                  context = {
                    title: filmTitle,
                    strongOriginalTitle: 'Titolo originale: ',
                    originalTitle: filmOriginalTitle,
                    language: flagImg,
                    rank: rankStar,
                    type: 'Film'
                  }
              
                }

                // aggiungo al container i risultati della chiamata ajax attraverso il template
                $('.container').append(template(context));
            
              }
            
          }

      },

      error: function (richiesta, stato, errore) {
        
        console.log(errore);
        console.log(stato);
        console.log(richiesta);
 
      }
    });


    $.ajax({ // chiamata ajax

      url: "https://api.themoviedb.org/3/search/tv", // url api con end-point

      method: "GET", // metodo

      dataType: 'json',

      data: { // parametri che vongono aggiunti all'url
        api_key: 'fab78916a45f752a410befc4f3336db2',
        language: 'it-IT',
        query: inputSearchVal
      },

      success: function (result, stato) {

        var arrayResult = result.results; // salvo in una variabile l'array che mi ritorna dalla chiamata ajax
        console.log(arrayResult);

        // se l'array è vuoto, cioè non ha risultati, allora stampa il messaggio di errore
        if (arrayResult.length <= 0) {

          $('.container').append('<h2 class="not-found">La ricerca non ha prodotto risultati di SerieTv</h2>');

          // altrimenti esegui il ciclo e stampa le informazioni in pagina
        } else {

          // eseguo ciclo sull'array per estrapolare le informazioni che mi servono ad ogni item
          for (let i = 0; i < arrayResult.length; i++) {

            var arrayItem = arrayResult[i]; // salvo l'item dell'array
            console.log(arrayItem);

            var filmTitle = arrayItem.name; // salvo il titolo di ogni film ritornato
            var filmOriginalTitle = arrayItem.original_name; // salvo il titolo originale di ogni film ritornato
            var filmLanguage = arrayItem.original_language; // salvo la lingua di ogni film ritornato
            var filmRank = arrayItem.vote_average; // salvo il voto di ogni film ritornato


            // trasformo il voto in numero intero e lo divido per due 
            var rankConvert = Math.ceil(filmRank / 2);
            console.log(rankConvert);
            console.log(filmRank);

            var flagImg = filmLanguage;

            for (let j = 0; j < flags.length; j++) {
              var flagsItem = flags[j];

              if (flagsItem.includes(filmLanguage)) {
                 flagImg = '<img src=' + 'img/' + flagsItem + '.png' + '' + '>';
              } 

            }

            var rankStar;

            if (rankConvert == 0) {
               rankStar = '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>';
            } else if (rankConvert == 1) {
               rankStar = '<i class="fas fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>';
            } else if (rankConvert == 2) {
               rankStar = '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>';
            } else if (rankConvert == 3) {
               rankStar = '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="far fa-star"></i>' + '<i class="far fa-star"></i>';
            } else if (rankConvert == 4) {
               rankStar = '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="far fa-star"></i>';
            } else {
               rankStar = '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>' + '<i class="fas fa-star"></i>';
            }


            // se il titolo è uguale al titolo originale non stampo il titolo originale
            if (filmTitle == filmOriginalTitle) {

              var context = {
                title: filmTitle,
                language: flagImg,
                rank: rankStar,
                type: 'SerieTv'
              }

              // altrimenti stampo anche il titolo originale
            } else {

              // creo il contenuto nei segnaposto del template per ogni iterazione
              context = {
                title: filmTitle,
                strongOriginalTitle: 'Titolo originale: ',
                originalTitle: filmOriginalTitle,
                language: flagImg,
                rank: rankStar,
                type: 'SerieTv'
              }

            }

            // aggiungo al container i risultati della chiamata ajax attraverso il template
            $('.container').append(template(context));

          }

        }

      },

      error: function (richiesta, stato, errore) {

        console.log(errore);
        console.log(stato);
        console.log(richiesta);

      }
    });

  }
  
});

