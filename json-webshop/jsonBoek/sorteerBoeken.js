// JSON importeren
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        sorteerBoekObj.data = JSON.parse(this.responseText);
        sorteerBoekObj.sorteren();

        sorteerBoekObj.data.forEach( boek => {
            boek.titelUpper = boek.titel.toUpperCase();
            boek.sortAuteur = boek.auteur[0];
        });



        sorteerBoekObj.voegJSdatumIn();
    }
};
xmlhttp.open('GET', "boeken.json", true);
xmlhttp.send();

const geefMaandNummer = (maand) => {
    let nummer;
    switch (maand) {
        case "januari":
            nummer = 0;
            break;
        case "februari":
            nummer = 1;
            break;
        case "maart":
            nummer = 2;
            break;
        case "april":
            nummer = 3;
            break;
        case "mei":
            nummer = 4;
            break;
        case "juni":
            nummer = 5;
            break;
        case "july":
            nummer = 6;
            break;
        case "augustus":
            nummer = 7;
            break;
        case "september":
            nummer = 8;
            break;
        case "oktober":
            nummer = 9;
            break;
        case "november":
            nummer = 10;
            break;
        case "december":
            nummer = 11;
            break;
    }
};

const maakJSdatum = (maandJaar) => {
    let mjArray = maandJaar.split("");
    let datum = new Date(mjArray[1], geefMaandNummer(mjArray[0]));
    return datum;
};

const maakOpsomming = (array) => {
    let string = "";
    for (let i = 0; i < array.length; i ++) {
        switch (i) {
            case array.length-1 : string += array[i]; break;
            case array.length-2 : string += array[i] + " en "; break;
            default: string += array[i] + ", ";
        }
    }
    return string;
};

const keerTekstOm = (string) => {
    if ( string.indexOf(",") != -1 ) {
        let array = string.split(',');
        string = array[1] + " " + array[0];
    }
    return string;
};

const confirm = (alert) => {
    alert('Hallo');
}

let winkelwagenObj = {
    items: [],
    haalItemsOp: function () {
        let bestelling;
        if ( localStorage.getItem("besteldeBoeken") == null) {
            bestelling = [];
        } else {
            bestelling = JSON.parse(localStorage.getItem("besteldeBoeken"));
            bestelling.forEach( item => {
                this.items.push(item);
            });
            this.uitvoeren();
        }
        return bestelling;
    },
    toevoegen: function(el) {
        this.items = this.haalItemsOp();
        if (this.items.includes(el)) {
            el.aantal += 1;
        } else {
            this.items.push(el);
        }

        localStorage.setItem("besteldeBoeken", JSON.stringify(this.items));
        this.uitvoeren();
    },

    uitvoeren: function() {
        if (this.items.length > 0) {
            document.getElementById("winkelwagen__aantal").innerHTML = this.items.length;
        } else {
            document.getElementById("winkelwagen__aantal").innerHTML = "";
        }
    }

};

winkelwagenObj.haalItemsOp();

let sorteerBoekObj = {
    data: "",
    kenmerk: "titelUpper",
    oplopend: 1,
    voegJSdatumIn: function() {
        this.data.forEach((item) => {
            item.jsDatum = maakJSdatum(item.uitgave);
        });
    },
    sorteren: function () {
      this.data.sort((a,b) => a[this.kenmerk] > b[this.kenmerk] ? 1 * this.oplopend : -1 * this.oplopend);
      this.uitvoeren(this.data);
    },
    uitvoeren: function (data) {
        document.getElementById("uitvoer").innerHTML = "";
        data.forEach( boek => {
            let sectie = document.createElement("section");
            sectie.className = "boek";

         

            let main = document.createElement("main");
            main.className = "boek__main";

            let titel = document.createElement("h3");
            titel.className = "boek__titel";
            titel.textContent = boek.titel;

            let afbeelding = document.createElement("img");
            afbeelding.className = "boek__cover";
            afbeelding.setAttribute("src", boek.cover);
            afbeelding.setAttribute("alt", boek.titel);

            let auteur = document.createElement("p");
            auteur.className = "boek__auteur";
            boek.auteur[0] = keerTekstOm(boek.auteur[0]);
            auteur.textContent = maakOpsomming(boek.auteur);

            let overig = document.createElement("p");
            overig.className = "boek__overig";
            overig.textContent = boek.uitgave + " | " + "Paginas: " + boek.paginas + " | " + boek.taal + " | ean " + boek.ean ;

            let prijs = document.createElement("div");
            prijs.className = "boek__prijs";
            prijs.textContent = boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});



            let knop = document.createElement("button");
            let confirm = document.createElement('p');
            confirm.className = "bedankt";
            knop.className = "boek__knop";
            knop.innerHTML = "Bestel";
            knop.addEventListener('click', () => {
                winkelwagenObj.toevoegen(boek);
                knop.className = "besteld";
                knop.innerHTML = "Toegevoegd!";
                alert("Als u op 'OK' klikt word het item toegevoegd aan uw winkelmandje");
                //confirm.innerHTML = "Bedankt uw bestelling is in uw winkelmandje geplaatst";

                setTimeout(function() {
                    knop.className = "boek__knop";
                    knop.innerHTML = "Bestel";
                }, 2000);
            });


            sectie.appendChild(afbeelding);
            sectie.appendChild(main);
            main.appendChild(titel);
            main.appendChild(auteur);
            main.appendChild(overig);
            prijs.appendChild(knop);
            sectie.appendChild(prijs);

            document.getElementById("uitvoer").appendChild(sectie);
        });
    }
};

let kenmerk = document.getElementById('kenmerk');
kenmerk.addEventListener('change', (e) => {
    sorteerBoekObj.kenmerk = e.target.value;
    sorteerBoekObj.sorteren();
});

document.getElementsByName('oplopend').forEach((item) => {
    item.addEventListener('click', (e) => {
       sorteerBoekObj.oplopend = parseInt(e.target.value);
       sorteerBoekObj.sorteren();
    })
});