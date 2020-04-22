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

  // associo l'evento click al button di invio ricerca. Cliccando il bottone parte la funzione ajaxPrint, una volta per richiamare i film e un'altra per le serietv
  $('#go').click(function () {  

    $('.container').html(''); // rimuovo l'html presente in container, perchè in questo modo i risultati della ricerca precedente vengono eliminati lasciando posto a quelli della nuova ricerca

    $('.not-found').remove(); // rimuovo gli eventuali messaggi di errore in modo che se la ricerca non trova nuovamente film o serie tv, il messaggio non si raddoppi

    ajaxPrint('title', 'original_title', 'Film', 'movie', 'La ricerca non ha prodotto risultati di Film'); // funzione che ritorna i film

    ajaxPrint('name', 'original_name', 'SerieTv', 'tv', 'La ricerca non ha prodotto risultati di SerieTv'); // funzione che ritorna le serieTv

  });

  // associo l'evento tastiera all'input di ricerca
  inputSearch.on('keypress', function (e) {

    
    if (e.keyCode == 13) {

      $('.container').html(''); // rimuovo l'html presente in container, perchè in questo modo i risultati della ricerca precedente vengono eliminati lasciando posto a quelli della nuova ricerca
      $('.not-found').remove(); // rimuovo gli eventuali messaggi di errore in modo che se la ricerca non trova nuovamente film o serie tv, il messaggio non si raddoppi

    // se l'utente preme il tasto invio parte la funzione ajaxPrint come per il click sul bottone
      ajaxPrint('title', 'original_title', 'Film', 'movie', 'La ricerca non ha prodotto risultati di Film');

      ajaxPrint('name', 'original_name', 'SerieTv', 'tv', 'La ricerca non ha prodotto risultati di SerieTv');

    }

  }
  );

  
  // al click sul logo boolflix l'eventuale scroll torna in alto
  $('h1').click(function () {
    $('main').animate({
      scrollTop: 0
    }, 600);
  });





  // funzione che esegue una chiamata ajax, elabora i risultati e li stampa in pagina 
  
  function ajaxPrint (proprietàTitolo, proprietàTitoloOriginale, type, endPoint, notFoundType) {
    

    var inputSearchVal;

    inputSearchVal = inputSearch.val(); // salvo il valore dell'input ogni volta che viene premuto il tasto invio

    $.ajax({ // chiamata ajax

      url: "https://api.themoviedb.org/3/search/" + endPoint, // url api con end-point

      method: "GET", // metodo

      dataType: 'json',

      data: { // parametri che vongono aggiunti all'url
        api_key: 'fab78916a45f752a410befc4f3336db2',
        language: 'it-IT',
        query: inputSearchVal // il valore inserito dall'utente 
      },

      success: function (result, stato) {

        var arrayResult = result.results; // salvo in una variabile l'array che mi ritorna dalla chiamata ajax
        console.log(arrayResult);

        // se l'array è vuoto, cioè non ha risultati, allora stampa il messaggio di errore
        if (arrayResult.length <= 0) {

          $('.container').after('<h2 class="not-found">' + notFoundType + '</h2>');

          // altrimenti esegui il ciclo e stampa le informazioni in pagina
        } else {

          // eseguo ciclo sull'array per estrapolare le informazioni che mi servono ad ogni item
          for (let i = 0; i < arrayResult.length; i++) {

            var arrayItem = arrayResult[i]; // salvo l'item dell'array
            console.log(arrayItem);

            var filmTitle = arrayItem[proprietàTitolo]; // salvo il titolo di ogni film o serieTv ritornato
            var filmOriginalTitle = arrayItem[proprietàTitoloOriginale]; // salvo il titolo originale di ogni film o serieTv ritornato
            var filmLanguage = arrayItem.original_language; // salvo la lingua di ogni film/serieTv ritornato
            var filmRank = arrayItem.vote_average; // salvo il voto di ogni film/serieTv ritornato


            // trasformo il voto in numero intero e lo divido per due 
            var rankConvert = Math.ceil(filmRank / 2);
            console.log(rankConvert);
            console.log(filmRank);

            // definisco una variabile che di default ha lo stesso valore della variabile della lingua
            var flagImg = filmLanguage;

            // ciclo for sull'array delle bandiere
            for (let j = 0; j < flags.length; j++) {

              // variabile che salva l'elemento dell'array ad ogni iterazione
              var flagsItem = flags[j];

              // se l'elemento dell'array contiene la lingua allora la variabile flagImg diventerà una stringa che conterrà l'immagine della bandiera di quella lingua, altrineti manterrà il valore impostato di default
              if (flagsItem.includes(filmLanguage)) {
                flagImg = '<img src=' + '"' + 'img/' + flagsItem + '.png' + '"' + 'alt=' + '"' + flagsItem + '"' + 'class=' + '"' + 'flag' + '"' + '>';
              }

            }

            // variabile che contiene le stelle del rank. Cambierà di valore in base al voto del film o serieTv
            var rankStar;

            var $iconStarEmpty = '<i class="far fa-star"></i>';
            var $iconStarFull = '<i class="fas fa-star"></i>';
            

            // se è uguale a 0 la variabile conterrà tutte stelle vuote
            if (rankConvert == 0) {

              rankStar = $iconStarEmpty + $iconStarEmpty + $iconStarEmpty + $iconStarEmpty + $iconStarEmpty;
              
              // se è uguale a 1 conterrà una stella piena e 4 vuote
            } else if (rankConvert == 1) { 

              rankStar = $iconStarFull + $iconStarEmpty + $iconStarEmpty + $iconStarEmpty + $iconStarEmpty;
              // se è uguale a 2 conterrà due stelle piene e 3 vuote
            } else if (rankConvert == 2) {

              rankStar = $iconStarFull + $iconStarFull + $iconStarEmpty + $iconStarEmpty + $iconStarEmpty;
              // se è uguale a 3 conterrà tre stelle piene e 2 vuote
            } else if (rankConvert == 3) {

              rankStar = $iconStarFull + $iconStarFull + $iconStarFull + $iconStarEmpty + $iconStarEmpty;
              // se è uguale a 4 conterrà quattro stelle piene e 1 vuota
            } else if (rankConvert == 4) {

              rankStar = $iconStarFull + $iconStarFull + $iconStarFull + $iconStarFull + $iconStarEmpty;
              // altrimenti conterrà tutte stelle piene
            } else {

              rankStar = $iconStarFull + $iconStarFull + $iconStarFull + $iconStarFull + $iconStarFull;

            }


            // se il titolo è uguale al titolo originale non stampo il titolo originale
            if (filmTitle == filmOriginalTitle) {

              // stampo valori nei segnaposto del template
              var context = {
                title: filmTitle, // titolo del film o serieTv
                language: flagImg, // bandiera o stringa con lingua del film o serieTv
                rank: rankStar, // stelle del rank
                type: type // se film o serieTv
              }

              // altrimenti stampo anche il titolo originale
            } else {

              // stampo valori nei segnaposto del template
              context = {
                title: filmTitle,
                strongOriginalTitle: 'Titolo originale: ',
                originalTitle: filmOriginalTitle,
                language: flagImg,
                rank: rankStar,
                type: type
              }

            }

            // aggiungo al container i risultati della chiamata ajax attraverso il template
            $('.container').append(template(context));

          }

        }

      },

      // nel caso la chiamata ajax non vada a buon fine appare un alert con l'errore
      error: function (richiesta, stato, errore) {

        alert(stato);

      }
    });

  }
  
  
});

