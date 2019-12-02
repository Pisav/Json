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

const keerTekstOm = (string) => {
    if ( string.indexOf(",") != -1 ) {
        let array = string.split(',');
        string = array[1] + " " + array[0];
    }
    return string;
};

let winkelwagenObj = {
    items: [],



    haalItemsOp: function () {
        let bestelling;
        if ( localStorage.getItem("besteldeBoeken") == null) {
            bestelling = [];
        } else {
            bestelling = JSON.parse(localStorage.getItem("besteldeBoeken"));
            document.getElementById("winkelwagen__aantal").innerHTML = bestelling.length;
        }
        bestelling.forEach( item => {
            this.items.push(item);
        });


        return bestelling;
    },

    verwijderItem: function(ean) {
         this.items.forEach((item, index) => {
             if ( item.ean == ean ) {
                 this.items.splice(index, 1);
                 ean = 4;
             }
         });
         localStorage.setItem('besteldeBoeken', JSON.stringify(this.items));
         if (this.items.length > 0) {
             document.getElementById("winkelwagen__aantal").innerHTML = this.items.length;
         } else {
             document.getElementById("winkelwagen__aantal").innerHTML = "";
         }
         this.uitvoeren();
    },

    totaalPrijsBerekenen: function() {
          let totaal = 0;
          this.items.forEach( boek => {
              totaal += boek.price;
            });
          return totaal;
    },

    verzendKosten: function() {
        let kosten = 9.99;
        if (this.totaalPrijsBerekenen() > 70) {
            kosten = 0;
        }
        return kosten;
    },

    totalenPrijs: function() {
        let totaalAlles = 0;
        totaalAlles = this.totaalPrijsBerekenen() + this.verzendKosten();
        return totaalAlles
        },

    uitvoeren: function() {
        let aantalBoeken = 0;
        document.getElementById("besteluitvoer").innerHTML = "";
        this.items.forEach( boek => {
            let sectie = document.createElement("section");
            sectie.className = "boekbesteld";

            let titel = document.createElement("h3");
            titel.className = "boekbesteld__titel";
            titel.textContent = boek.titel;

            let afbeelding = document.createElement("img");
            afbeelding.className = "boekbesteld__cover";
            afbeelding.setAttribute("src", boek.cover);
            afbeelding.setAttribute("alt", boek.titel);

            let aantal = document.createElement("input");
            let aantalBoek = boek.aantal;
            aantal.className = "boekbesteld__aantal";
            aantal.setAttribute("type", "number");
            aantal.setAttribute("value", aantalBoek);

            let prijs = document.createElement("div");
            prijs.className = "boekbesteld__prijs";
            prijs.textContent = boek.price.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

            let verwijder = document.createElement("div");
            verwijder.className = "boekbesteld__verwijder";
            verwijder.addEventListener('click', () => {
                this.verwijderItem(boek.ean);
            });

            sectie.appendChild(afbeelding);
            sectie.appendChild(titel);
            sectie.appendChild(aantal);
            sectie.appendChild(prijs);
            sectie.appendChild(verwijder);
            document.getElementById("besteluitvoer").appendChild(sectie);
            aantalBoeken++;
        });

       if (this.totalenPrijs() > 9.99) {
           let sectieTotaal = document.createElement("section");
           sectieTotaal.className = "boekbesteld";

           let totaalTekst = document.createElement("div");
           totaalTekst.className = "totaalTekst";
           totaalTekst.innerHTML = "Totaal Artikelen(" + aantalBoeken + "): ";

           let totaalPrijs = document.createElement("div");
           totaalPrijs.className = "totaalPrijs";
           totaalPrijs.innerHTML = this.totaalPrijsBerekenen().toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

           let sectieVerzend = document.createElement("section");
           sectieVerzend.className = "boekbesteld";

           let verzendTekst = document.createElement("div");
           verzendTekst.className = "totaalTekst";
           verzendTekst.innerHTML = "Verzendkosten: ";

           let verzendPrijs = document.createElement("div");
           verzendPrijs.className = "verzendPrijs";
           verzendPrijs.innerHTML = this.verzendKosten().toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

           let verzendInfo = document.createElement("div");
           verzendInfo.className = "verzendInfo";
           verzendInfo.setAttribute("onmouseover", "display()");
           verzendInfo.setAttribute("onmouseout", "hide()");

           let verzendModaal = document.createElement("div");
           verzendModaal.className = "verzendModaal";
           verzendModaal.id = "verzendModaal";
           verzendModaal.innerHTML = "Bij een bestelling boven de 50 euro hoeft u geen verzend kosten te betalen.";

           let sectieTotaal2 = document.createElement("section");
           sectieTotaal2.className = "boekbesteld";

           let totaalTekst2 = document.createElement("div");
           totaalTekst2.className = "totaalTekst";
           totaalTekst2.innerHTML = "Totaal: ";

           let totaalPrijs2 = document.createElement("div");
           totaalPrijs2.className = "totaalPrijs";
           totaalPrijs2.innerHTML = this.totalenPrijs().toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

           sectieTotaal.appendChild(totaalTekst);
           sectieTotaal.appendChild(totaalPrijs);
           document.getElementById("besteluitvoer").appendChild(sectieTotaal);

            sectieVerzend.appendChild(verzendModaal);
           sectieVerzend.appendChild(verzendTekst);
           sectieVerzend.appendChild(verzendPrijs);
           sectieVerzend.appendChild(verzendInfo);
           document.getElementById("besteluitvoer").appendChild(sectieVerzend);

           sectieTotaal2.appendChild(totaalTekst2);
           sectieTotaal2.appendChild(totaalPrijs2);
           document.getElementById("besteluitvoer").appendChild(sectieTotaal2);
       } else {
           let emptySectie = document.createElement("section");
           emptySectie.className = "emptySection";

           let emptyTitel = document.createElement("div");
           emptyTitel.className = "emptyTitel";
           emptyTitel.innerHTML = "Uw heeft geen items!";

           let emptyImage = document.createElement("div");
           emptyImage.className = "emptyImage";

           emptySectie.appendChild(emptyImage);
           emptySectie.appendChild(emptyTitel);
           document.getElementById("besteluitvoer").appendChild(emptySectie);
       }

        if (this.items.length > 0) {
            document.getElementById("winkelwagen__aantal").innerHTML = this.items.length;
        } else {
            document.getElementById("winkelwagen__aantal").innerHTML = "";
        }
    }


};

winkelwagenObj.haalItemsOp();
winkelwagenObj.uitvoeren();
let modaal = document.getElementById("verzendModaal");
function display() {
    modaal.style.display = "inherit";
}
function hide() {
    modaal.style.display = "none";
}