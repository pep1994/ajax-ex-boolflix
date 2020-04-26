$(document).ready(function () {
  
  var inputSearch = $('#search'); // salvo in una variabile il riferimento all'input di ricerca
  

  // variabili Template Handlebars
  var source = $('#list-template').html();
  var template = Handlebars.compile(source);
 
  
  // imposto di default il valore dell'input di ricerca vuoto
  inputSearch.val("");

  // imposto di default il valore dell'input select a "all"
  $('select').val('all')

  // associo l'evento click al button di invio ricerca. Cliccando il bottone parte la funzione ajaxPrint, una volta per richiamare i film e un'altra per le serietv
  $('#go').click(function () {  
    

    $('.container').html(''); // rimuovo l'html presente in container, perchè in questo modo i risultati della ricerca precedente vengono eliminati lasciando posto a quelli della nuova ricerca

    $('.not-found').remove(); // rimuovo gli eventuali messaggi di errore in modo che se la ricerca non trova nuovamente film o serie tv, il messaggio non si raddoppi
    
    ajaxPrint('title', 'original_title', 'Film', "https://api.themoviedb.org/3/search/movie", 'La ricerca non ha prodotto risultati di Film', '/movie/', 'film', 0); // funzione che ritorna i film
 
    ajaxPrint('name', 'original_name', 'SerieTv', "https://api.themoviedb.org/3/search/tv", 'La ricerca non ha prodotto risultati di SerieTv', '/tv/', 'serietv', 0); // funzione che ritorna le serieTv

  });

  // associo l'evento tastiera all'input di ricerca
  inputSearch.on('keypress', function (e) {

    
    if (e.keyCode == 13) {

      $('.container').html(''); // rimuovo l'html presente in container, perchè in questo modo i risultati della ricerca precedente vengono eliminati lasciando posto a quelli della nuova ricerca
      $('.not-found').remove(); // rimuovo gli eventuali messaggi di errore in modo che se la ricerca non trova nuovamente film o serie tv, il messaggio non si raddoppi

      // se l'utente preme il tasto invio parte la funzione ajaxPrint come per il click sul bottone
      
      ajaxPrint('title', 'original_title', 'Film', "https://api.themoviedb.org/3/search/movie", 'La ricerca non ha prodotto risultati di Film', '/movie/', 'film', 0);
  
  
      ajaxPrint('name', 'original_name', 'SerieTv', "https://api.themoviedb.org/3/search/tv", 'La ricerca non ha prodotto risultati di SerieTv', '/tv/', 'serietv', 0);

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
      $('header').css('background', '#000');
    } else {
      $('header').css('background', 'transparent');
    }
  });
  
  // evento change per il tag select tipi
  $('#filter').change(function () { 

    generaFiltri(); // richiamo funzione genera filtri

  });


  // evento change per il tag select generi
  $('#filter-generi').change(function () {

    generaFiltri(); // richiamo funzione genera filtri
    
  });

  

  // funzione che esegue una chiamata ajax, elabora i risultati e li stampa in pagina 
  
  function ajaxPrint(proprietàTitolo, proprietàTitoloOriginale, type, url, notFoundType, tipoAjaxCast, tipoDataAttribute, valore) {
    
    var selectVal = $('#filter').val();
    $('#filter-generi').val('all'); // imposto di default il valore 'all' per il select del filtro generi quando viene fatta una chiamata

    var inputSearchVal;

    inputSearchVal = inputSearch.val(); // salvo il valore dell'input ogni volta che viene premuto il tasto invio

    $.ajax({ // chiamata ajax

      url: url, // url api con end-point

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

          var indexType = valore; // variabile che rappresenta l'indice di ogni template stampato in pagina
          

          // eseguo ciclo sull'array per estrapolare le informazioni che mi servono ad ogni item
          for (var i = 0; i < arrayResult.length; i++) {
     
            var arrayItem = arrayResult[i]; // salvo l'item dell'array
            
            var filmTitle = arrayItem[proprietàTitolo]; // salvo il titolo di ogni film o serieTv ritornato
            var filmOriginalTitle = arrayItem[proprietàTitoloOriginale]; // salvo il titolo originale di ogni film o serieTv ritornato
            var filmLanguage = generaBandiere(arrayItem.original_language); // salvo la lingua di ogni film/serieTv ritornato dalla funzione
            var filmRank = generaVotoStelle(arrayItem.vote_average); // salvo il voto di ogni film/serieTv ritornato dalla funzione
            var cover = generaCover(arrayItem.poster_path); // salvo la copertina ritornata dalla funzione. 

            var overview = arrayItem.overview; // salvo la descrizione

            var filmId = arrayItem.id; // salvo l'id del film o serieTv

            var genereArray = arrayItem.genre_ids; // salvo l'id che corrisponde al genere

          
            // controllo se l'overview è più lungo di 400 caratteri
            if (overview.length > 400) {
             
              // se così fosse sostituisco tutti i caratteri dalla posizione 400 della stringa con la stringa "[...]"
              var over = overview.substring(400, overview.length);
               overview = overview.replace(over, '[...]');
              
            }


            // se il titolo è uguale al titolo originale non stampo il titolo originale
            if (filmTitle == filmOriginalTitle) {
              
              // stampo valori nei segnaposto del template
              var context = {
                title: filmTitle, // titolo del film o serieTv
                copertina: cover, 
                language: filmLanguage, // bandiera o stringa con lingua del film o serieTv
                rank: filmRank, // stelle del rank
                type: type, // se film o serieTv
                dataTipo: type.toLowerCase(), // salvo nel data-attribute se è un film o serieTv
                overview: overview,
                dataGenere: genereArray
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
                dataTipo: type.toLowerCase(),  // salvo nel data-attribute se è un film o serieTv
                overview: overview,
                dataGenere: genereArray

              }

            }

            
            // aggiungo al container i risultati della chiamata ajax attraverso il template
            $('.container').append(template(context));
            

            // faccio un controllo. Se il valore del select è impostato su film, verranno mostrati solo i film
            if (selectVal == 'film') {

              $('.film-result[data-tipo="serietv"').hide();
              // altrimenti se il valore è impostato su serietv, verranno mostrate solo le serietv
            } else if (selectVal == 'serietv') {

              $('.film-result[data-tipo="film"').hide();

              // altrimenti verranno mostrati tutti i risultati
            } else {

              $('.film-result').show();

            }

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

            // richiamo la funzione caricaAttori
            caricaAttori(tipoAjaxCast, filmId, tipoDataAttribute, indexType);
            
            // dopo l'esecuzione della funzione caricaAttori l'indice viene incrementato di uno
            indexType++;
            console.log(indexType);

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

      coverVal = '<img src="' + 'https://image.tmdb.org/t/p/w342' + coverPath + '" alt="cover" class="cover">'
      
    } else {

      coverVal = '<img src="img/imgnondisponibile.jpg" alt="img-non-disponibile" class="cover not-img">';

    }

    return coverVal;
    
  }


  function generaFiltri() {

    // salvo in una variabile il valore del filtro tipo 
    var selectVal = $('#filter').val();

    // salvo in una variabile il valore del filtro genere 
    var genereVal = $('#filter-generi').val();

    // salvo il riferimento ad ogni blocco di film o serieTv
    var result = document.getElementsByClassName('film-result');

    // ciclo per etrapolare il valore del data-attribute e fare i confronti 
    for (var i = 0; i < result.length; i++) {

      var item = result[i]; // item dell'array, cioè ogni singolo blocco

      // salvo in una variabile il valore del data-tipo del blocco
      var dataVal = item.getAttribute('data-tipo');

      // salvo in una variabile il valore del data-genere del blocco
      var dataItem = item.getAttribute('data-genere');

      // creo un array con i valori del data-genere in modo da potergli chiedere successivamente se all'interno dell'array è presente il valore del data-genere di ogni blocco
      var arrayData = dataItem.split(",");

      // se il il valore del filtro tipo è uguale al valore del data-tipo del blocco, e il valore del data-genere del blocco è contenuto nell'array di quel blocco, allora quel blocco viene mostrato
      if (selectVal == dataVal && arrayData.includes(genereVal)) {

        item.style.display = 'flex';

        // altrimenti se il valore del filtro tipo è su "all", e il valore del data-genere del blocco è contenuto nell'array di quel blocco, allora quel blocco viene mostrato
      } else if (selectVal == 'all' && arrayData.includes(genereVal)) {

        item.style.display = 'flex';

        // se così' non fosse il blocco viene nascosto
      } else {

        item.style.display = 'none';

      }

      // se il valore del filtro generi è su "all" e anche il valore del filtro tipo è su "all", verranno mostrati tutti i blocchi
      if (genereVal == 'all' && selectVal == 'all') {

        $('.film-result').show();

        // altrimenti se il valore del filtro genere è su "all", e il valore del filtro tipo è uguale al valore del data tipo del blocco, quel blocco verrà mostrato
      } else if (genereVal == 'all' && selectVal == dataVal) {

        item.style.display = 'flex';

      }

    }

  }

  function caricaAttori(tipoAjaxCast, filmId, tipoDataAttribute, indexType) {

    // chiamata attori
    $.ajax({

      url: "https://api.themoviedb.org/3" + tipoAjaxCast + filmId + "/credits?api_key=fab78916a45f752a410befc4f3336db2",

      method: "GET",

      dataType: "json",

      success: function (data, stato) {
        
        var arrayCast = data.cast; // salvo l'array contenente gli attori

        // eseguo ciclo sull'array ottenuto
        for (var j = 0; j < arrayCast.length; j++) {

          // eseguo il resto del codice se la variabile "j" è minore di 5
          if (j < 5) {

            var nomeAttore = arrayCast[j].name; // salvo il nome dei primi 5 attori del film o serieTv

            // salvo il valore html contenuto in ciascun list-item con la class "attori", in modo che non si sovrascriva 
            var back = $('[data-tipo="' + tipoDataAttribute + '"').eq(indexType).find('.attori').html();

            //  nell'html dell'elemento aggiungo i nomi degli attori, poi incremento l'indice in modo che alla prossima iterazione verrà considerato l'elemento successivo relativo 
            $('[data-tipo="' + tipoDataAttribute + '"').eq(indexType).find('.attori').html(back + " - " + nomeAttore);

          }

        }

      }, error: function () {

      }

    }); 
    
  }

});

