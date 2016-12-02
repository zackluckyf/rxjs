import {Observable } from "rxjs";

let output = document.getElementById('output');
let button = document.getElementById('button');
// observable.create method
let click = Observable.fromEvent(button, 'click');

function load(url: string){
  return Observable.create(observer => {
    let xhr = new XMLHttpRequest();

    let onLoad = () => {
      if(xhr.status === 200){
        let data = JSON.parse(xhr.responseText);
        observer.next(data);
        observer.complete();
      } else {
        observer.error(xhr.statusText);
      }
    };

    xhr.addEventListener("load", onLoad);

    xhr.open('GET',url);
    xhr.send();

    return () => {
      console.log('cleanup');
      xhr.removeEventListener("load", onload);
      xhr.abort();
    }

  }).retryWhen(retryStrategy({attempts: 4, delay: 1500}));
}

function retryStrategy({attempts, delay}){
  return function(errors){
    return errors
            .scan((acc, value) => {
              console.log(acc, value)
              return acc + 1;
            }, 1)
            .takeWhile(acc => acc < attempts)
            .delay(delay);
  }
}

// subscribe method
click.flatMap(e => load("movies.json"))
.subscribe(
  renderMovies,
  e => console.log(`error: ${e}`),
  () => console.log("complete")
);

// console.log(subscription);
// subscription.unsubscribe();
// console.log(subscription);

function renderMovies(movies){
  movies.forEach(m => {
      let div = document.createElement("div");
      div.innerText = m.title;
      output.appendChild(div);
  });
}
