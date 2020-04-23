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

/* Milestone 3:
In questo milestone come prima cosa aggiungiamo la copertina del film o della serie al nostro elenco. Ci viene passata dall’API solo la parte finale dell’URL, questo perché poi potremo generare da quella porzione di URL tante dimensioni diverse. Dovremo prendere quindi l’URL base delle immagini di TMDB: https://image.tmdb.org/t/p/ per poi aggiungere la dimensione che vogliamo generare (troviamo tutte le dimensioni possibili a questo link: https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400) per poi aggiungere la parte finale dell’URL passata dall’API.
Esempio di URL che torna la copertina di BORIS:
https://image.tmdb.org/t/p/w185/s2VDcsMh9ZhjFUxw77uCFDpTuXp.jpg
*/


$(document).ready(function () {
  
  var inputSearch = $('#search'); // salvo in una variabile il riferimento all'input di ricerca
  

  // variabili Template Handlebars
  var source = $('#list-template').html();
  var template = Handlebars.compile(source);

  
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
    $('html').animate({
      scrollTop: 0
    }, 600);
  });

  // aggancio evento scroll al documento
  $(document).scroll(function () {
    
    // se la pagina ha scrollato per più dell'altezza dell'header allora questo diventerà trasparente
    if ($(document).scrollTop() > $('header').height()) {
      $('header').css('background', 'transparent');
    } else {
      $('header').css('background', '#000');
    }
  });
  
  // evento change per il tag select
  $('select').change(function () { 

    // salvo in una variabile il valore di select ogni volta che cambia
    var selectVal = $(this).val();
    
    // nascondo tutti i risultati
    $('.film-result').hide();

    // ciclo per etrapolare il valore del data-attribute 
    $('.film-result').each(function () {

      // salvo in una variabile il valore del data-attribute
      var dataVal = $(this).data('tipo');
      console.log(dataVal);

      // se il valore di select è uguale al valore del data-attribute di quell'elemento, allora mostralo
      if (selectVal == dataVal) {
        $(this).show();

      } 

    });

    // se il valore di select è uguale a "all" allora mostra sia film che serieTv
    if (selectVal == 'all') {
      $('.film-result').show();
    }
    
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
        

        // se l'array è vuoto, cioè non ha risultati, allora stampa il messaggio di errore
        if (arrayResult.length <= 0) {

          $('.container').after('<h2 class="not-found">' + notFoundType + '</h2>');

          // altrimenti esegui il ciclo e stampa le informazioni in pagina
        } else {

          // eseguo ciclo sull'array per estrapolare le informazioni che mi servono ad ogni item
          for (let i = 0; i < arrayResult.length; i++) {

            var arrayItem = arrayResult[i]; // salvo l'item dell'array
            

            var filmTitle = arrayItem[proprietàTitolo]; // salvo il titolo di ogni film o serieTv ritornato
            var filmOriginalTitle = arrayItem[proprietàTitoloOriginale]; // salvo il titolo originale di ogni film o serieTv ritornato
            var filmLanguage = generaBandiere(arrayItem.original_language); // salvo la lingua di ogni film/serieTv ritornato dalla funzione
            var filmRank = generaVotoStelle(arrayItem.vote_average); // salvo il voto di ogni film/serieTv ritornato dalla funzione
            var cover = generaCover(arrayItem.poster_path); // salvo la copertina ritornata dalla funzione. 

            
  
            // se il titolo è uguale al titolo originale non stampo il titolo originale
            if (filmTitle == filmOriginalTitle) {
              
              // stampo valori nei segnaposto del template
              var context = {
                title: filmTitle, // titolo del film o serieTv
                copertina: cover, 
                language:filmLanguage, // bandiera o stringa con lingua del film o serieTv
                rank: filmRank, // stelle del rank
                type: type, // se film o serieTv
                dataTipo: type.toLowerCase() // salvo nel data-attribute se è un film o serieTv
              }

              // altrimenti stampo anche il titolo originale
            } else {

              // stampo valori nei segnaposto del template
              context = {
                title: filmTitle,
                copertina: cover,
                strongOriginalTitle: 'Titolo originale: ',
                originalTitle: filmOriginalTitle,
                language: filmLanguage,
                rank: filmRank,
                type: type,
                dataTipo: type.toLowerCase()  // salvo nel data-attribute se è un film o serieTv
              }

            }

            

            // aggiungo al container i risultati della chiamata ajax attraverso il template
            $('.container').append(template(context));

            // applico uno stile css ai div che contengono le info di film e serie tv per dargli un'animazione
            $('.film-result').css({
              'position': 'relative',
              'top': '-300px',
              'opacity': 0
              
            });

            // animazione
            $('.film-result').animate({
              top: 0,
              opacity: 1
            }, 1000);
            
          }

        }

      },

      // nel caso la chiamata ajax non vada a buon fine appare un alert con l'errore
      error: function (richiesta, stato, errore) {

        alert(stato);

      }
    });

  }


  // funzione che genera le stelle in base al voto del film o serieTv
  function generaVotoStelle(voto) {
    
    // divido il voto per due in modo che vada da 0 a 5 e poi lo arrotondo per eccesso
    var rankConvert = Math.ceil(voto / 2); 
    var starImg = "";
    
    // ciclo che stampa 5 stelle
    for (let i = 1; i <= 5; i++) {
      
      // se la var i è minore del voto òa variabile conterrà tante stelle piene quanto è il voto
      if (i <= rankConvert) {
        
        starImg += '<i class="fas fa-star"></i>';

        // altrimenti conterrà stelle vuote 
      } else {

        starImg += '<i class="far fa-star"></i>';
        
      }
      
    }

    return starImg; // ritorno la variabile che contiene 5 stelle
  }


  // funzione che stampa le bandiere della lingua appropriata. Nel caso le bandiere di quella lingua del film o serieTv non fosse presente, verrà stampato direttamente il codice di lingua ritornato dalla chiamata ajax
  function generaBandiere(lingua) {
    
    // array di bandiere
    var flags = ['en', 'es', 'it', 'pt', 'ja', 'de', 'fr', 'cn', 'pl', 'ru', 'nl'];

    // se l'elemento dell'array contiene la lingua allora la variabile flagImg diventerà una stringa che conterrà l'immagine della bandiera di quella lingua, altrineti manterrà il valore impostato di default
    if (flags.includes(lingua)) {
      flagImg = '<img src=' + '"' + 'img/' + lingua + '.png' + '"' + 'alt=' + '"' + lingua + '"' + 'class=' + '"' + 'flag' + '"' + '>';

      return flagImg; // ritorno la variabile che contiene l'immagine della bandiera se è presente nell'array
    }
  
    return lingua; // se no ritorno il valore che mi ritorna la chiamata ajax

  }

  // funzione che genera la cover del film o della serieTv. In caso fosse presente il path dell'immagine nella chiamata ajax allora la cover sarà composta dall'immagine, altrimenti verrà comunicato all'utenete che l'immagine non è disponibile
  function generaCover(coverPath) {

    var coverVal;

    if (coverPath !== null) {

      coverVal = '<img src="' + 'https://image.tmdb.org/t/p/w185' + coverPath + '" alt="cover">'

    } else {

      coverVal = 'Immagine di copertina non disponibile';

    }

    return coverVal;
    
  }
  
  
});

