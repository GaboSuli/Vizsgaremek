GET

\- egy felhasználó összes vevési listája (kivéve ami csoporthoz van kötve)

(http://127.0.0.1:8000/api/felhasznalo/vevesiListak) 

\-- bearer: session token



\- egy felhasználó csoportjai

(http://127.0.0.1:8000/api/felhasznalo/csoportjai)

\-- bearer: session token

egy felhasználo minden csoport meghivása
(http://127.0.0.1:8000/api/csoportMeghivas/all) 
bearer: session token
-- Controllere: CsoportMeghivasController


\- egy csoport összes vevési listája

(http://127.0.0.1:8000/api/csoport/{id}/vevesiListak)

\-- bearer: session token



\- egy felhasználó összes költségei alkategoriák szerint

(http://127.0.0.1:8000/api/felhasznalo/osszKoltesei)

\-- bearer: session token



\- egy felhasználó összes költsége ebben a hónapban

(http://127.0.0.1:8000/api/felhasznalo/eHaviKoltesei)

\-- bearer: session token



\- egy felhasználó összes költsége ebben az évben

(http://127.0.0.1:8000/api/felhasznalo/eEviKoltesei)

\-- bearer: session token



\- összes alkategória átlag árának havi váltakozása

(http://127.0.0.1:8000/api/statisztika/all)



\- egy alkategória átlag árának havi váltakozása

(http://127.0.0.1:8000/api/statisztika/id/{id})



\- összes alkategória jelenlegi átlagára ebben az évben

(http://127.0.0.1:8000/api/statisztika/ev/{ev})



\- összes kupon

(http://127.0.0.1:8000/api/kuponok/get)


\- összes kategoria alkategoriákkal

(http://127.0.0.1:8000/api/alkategoriak)

\- felhasználo mennyiség

(http://127.0.0.1:8000/api/felhasznaloMennyiseg)

\- legtöbbet vett alkategoria

(http://127.0.0.1:8000/api/legtobbetVett)

\- felhasználó nyilvános adatai

(http://127.0.0.1:8000/api/felhasznalo)

\-- bearer: session token



\- csoport felhasználoi

(http://127.0.0.1:8000/api/csoport/{id}/felhasznalok)

\-- bearer: session token



\- összes kitöltött ürlap

(http://127.0.0.1:8000/api/contact)

\-- bearer: session token (csak nagyobb mint 1 jogosultsagu szintu tud)

ADMIN VÉGPONTOK:
\-- bearer: session token (csak nagyobb mint 2 jogosultsagu szintu tud)

\- legfrissebb aktivitás (csak vevesi listak)
(http://127.0.0.1:8000/vevesilistak/admin)

\- összes csoport
(http://127.0.0.1:8000/csoportok/admin)

\- összes felhasználo
(http://127.0.0.1:8000/felhasznalo/admin)


POST



\- felhasználó létrehozása

(http://127.0.0.1:8000/api/felhasznalo/register)

{

&#x20;"nev":"", ##Muszály

&#x20;"email":"", ##Muszály

&#x20;"password":"", ##Muszály

&#x20;"password\_confirmation":"" ##Muszály

}





\- felhasználó login

(http://127.0.0.1:8000/api/felhasznalo/login)

{

&#x20;"email":"", ##Muszály

&#x20;"password":"" ##Muszály

}





\- csoport létrehozása

(http://127.0.0.1:8000/api/csoport/create)

\-- bearer: session token

{

&#x20;"csoport\_tipus\_id":"", ##Muszály

&#x20;"megnevezes":"" ##Muszály

}



\- Kitöltött ürlap létrehozása

(http://127.0.0.1:8000/api/contact/create)

\-- bearer: session token

{ 

&#x20;"nev":"", ##Muszály 

&#x20;"email":"", ##Muszály

&#x20;"contactTipusId":"", ##Muszály

&#x20;"text":"" ##Muszály

}



Csoport meghivás létrehozása
(http://127.0.0.1:8000/api/csoportMeghivas/meghivas) 
bearer: session token (csak a csoport tulajdonosa tud meghivni)
{
 ”csoport_id”:””, ##Muszály, létezö csoport id
 ”felhasznalo_nev”:”” ##Muszály, létezö felhasználo név
}
-- Controllere: CsoportMeghivasController




\- kupon létrehozása

(http://127.0.0.1:8000/api/kuponok/create) 

\-- bearer: session token (csak olyan felhasználo tud aki nagyobb jogosultsag mint 0)

{

&#x20;   "kezdesi\_datum":"", ##Muszály

&#x20;   "lejarasi\_datum":"", ##Muszály

&#x20;   "kod":"", ##Muszály

&#x20;   "kedvezmeny":"", ##Muszály

&#x20;   "megjegyzes":"", 

&#x20;   "hasznalasi\_hely":"" ##Muszály

}



\- vevési objektum létrehozása

(http://127.0.0.1:8000/api/vevesiObjektum/create)

\-- bearer: session token (csoportnál csak az tud aki benne van a csoportba és nagyobb jogosultság szint mint 0)

{

&#x20;   "veves\_lista\_id":"", ##Muszály

&#x20;   "alKategoria\_id":"", ##Muszály

&#x20;   "megnevezes":"",

&#x20;   "ar":"", ##Muszály

&#x20;   "mennyiseg":"" ##Muszály

}



\- vevési lista létrehozása

(http://127.0.0.1:8000/api/vevesiLista/create)

\-- bearer: session token (csoportnál csak az tud aki benne van a csoportba és nagyobb jogosultság szint mint 0)

{

&#x20;   "felhasznalo\_id":"", ##Muszály

&#x20;   "csoport\_id":""

}



PUT

\- felhasználó módosítása

(http://127.0.0.1:8000/api/felhasznalo/modositas) (itt a json be ne adj meg olyan adatot amit nem akarsz változtatni, ha saját felhasználót akarsz módosítani akkor ne adj meg felhasználó id-t.)

\-- bearer: session token (más felhasználót csak 2 vagy nagyobb jogosultsági szinten lehet)

{

&#x20;   "felhasznalo\_id\_valtoztatni":"",

&#x20;   "nev":"",

&#x20;   "becenev":"",

&#x20;   "profilkep\_url":"",

&#x20;   "kuponok":"",

&#x20;   "termekArKovetes":"",

&#x20;   "brokerArKovetes":""

}

\- csoport módosítása

(http://127.0.0.1:8000/api/csoport/modositas/{csoportId})

\-- bearer: session token (csak saját csoportot tudsz ezzel változtatni)

{

&#x09;"megnevezes":"",

&#x09;"csoport\_tipus\_id":"",

&#x09;"keszito\_felhasznalo\_id":""

}

csoport meghivás eldöntése 
(http://127.0.0.1:8000/api/csoportMeghivas/decision/{csoport_id})
bearer: session token (csak olyat tudsz elfogadni vagy elutasitani ami a tied)
{
"":"", ##Muszály, 0 = elutasitás, 1 = elfogadás
}
-- Controllere: CsoportMeghivasController


\- csoport tagság modositása

(http://127.0.0.1:8000/api/csoportTagsag/modositas/{csoportId})

\-- bearer: session token (mást változtatni csak saját csoporton belül tudsz, becenevet bármilyen csoportba amibe vagy)

{

&#x09;"becenev":"",

&#x09;"mastValtoztatniId":"",

&#x09;"jogosultsag\_szint":""

}





\- vevési objektum modositása

(http://127.0.0.1:8000/api/vevesiObjektum/modositas/{objektumId})

\-- bearer: session token (csoporton kívül csak sajátodat tudod, csoporton belül csak ha nagyobb mint 1 jogosultsag szinted van, statisztika elfogadás után csak a megnevezést lehet változtatni, de akinek nagyobb a globális jogosultsagi szintje mint 1 az tud mindent)

{

&#x09;"alKategoria\_id":"",

&#x09;"megnevezes":"",

&#x09;"ar":"",

&#x09;"mennyiseg":"",

&#x09;"elfogadott\_statisztikara":""

}



\- kupon módosítása

(http://127.0.0.1:8000/api/kuponok/modositas/{id})

\-- bearer: session token (csak nagyobb mint 0 jogosultsagu szintu tud)

{

&#x09;"kezdesi\_datum":"",

&#x20;   "lejarasi\_datum":"",

&#x20;   "kod":"",

&#x20;   "kedvezmeny":"",

&#x20;   "megjegyzes":"", 

&#x20;   "hasznalasi\_hely":""

}



DELETE

\- felhasználó törlése

(http://127.0.0.1:8000/api/felhasznalo/torles/{id})

\-- bearer: session token (hogy ha a megadott id nem a sajátod akkor csak 2 vagy nagyobb jogosultsagi szinttel tudod azt torolni)



\- vevési objektum törlése

(http://127.0.0.1:8000/api/vevesiObjektum/torles/{id})

\-- bearer: session token (csak olyan vevesi listad tudsz torolni ami a tied vagy, ha csoporthoz tartozik akkor csak nagyobb vagy egyenlo mint 1 jogosultsággal lehet abba a csoportba)



\- vevési lista törlése

(http://127.0.0.1:8000/api/vevesiLista/torles/{id})

\-- bearer: session token (csak olyan vevesi listad tudsz torolni ami a tied vagy, ha csoporthoz tartozik akkor csak nagyobb vagy egyenlo mint 1 jogosultsággal lehet abba a csoportba)



\- csoport törlése

(http://127.0.0.1:8000/api/csoport/torles/{id})

\-- bearer: session token (csak olyan csoportot tudsz torolni ami a tied)



\- csoport tagság törlése

(http://127.0.0.1:8000/api/csoportTagsag/torles/{id})

\-- bearer: session token (csak olyan csoporttagsagot tudsz torolni ami a tied vagy olyan csoportba van ami a tied)



\- kupon törlése

(http://127.0.0.1:8000/api/kuponok/torles/{id})

\-- bearer: session token (csak nagyobb mint 0 jogosultsagu szintu tud)



\- Kitöltött ürlap törlése

(http://127.0.0.1:8000/api/contact/torles/{id})

\-- bearer: session token (csak nagyobb mint 1 jogosultsagu szintu tud)



