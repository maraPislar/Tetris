const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

function acumuleaza_puncte()
{
    let numara_pe_linie = 1;
    outer: for (let y = arena.length -1; y > 0; --y)
    {
        for (let x = 0; x < arena[y].length; ++x)
        {
            if (arena[y][x] === 0) //daca arena nu este inca plina
            {
                continue outer; //atunci se continua iar de la y pana cand se face un rand complet de 1
            }
        }

        const linie = arena.splice(y, 1)[0].fill(0); //linia devine 0 daca este plina de 1
        arena.unshift(linie);
        ++y;

        jucator.score += numara_pe_linie * 10;
        numara_pe_linie *= 2; //scorul pentru fiecare linie de 1 este dublata
    }
}

function ciocnire(arena, jucator) //verificare daca s-a "ciocnit" de alta piesa
{
    const m = jucator.tablou;
    const o = jucator.pozitie;
    for (let y = 0; y < m.length; ++y)
    {
        for (let x = 0; x < m[y].length; ++x)
        {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0)
            {
                return true;
            }
        }
    }
    return false;
}

function creeaza_tablou(latime, inaltime) //s-a facut un tablou de 0-uri
{
    const tablou = [];
    while (inaltime--)
    {
        tablou.push(new Array(latime).fill(0));
    }
    return tablou;
}

function creeaza_piesa(categorie)
{
    if (categorie === 'I')
    {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    }
    else if (categorie === 'L')
    {
        return [
            [0, 2, 0],
            [2, 2, 2],
            [0, 2, 0],
        ];
    }
    else if (categorie === 'J')
    {
        return [
            [0, 3, 3],
            [0, 3, 0],
            [3, 3, 0],
        ];
    }
    else if (categorie === 'O')
    {
        return [
            [4, 4],
            [4, 4],
        ];
    }
    else if (categorie === 'Z')
    {
        return [
            [0, 5, 0],
            [5, 5, 5],
            [5, 0, 5],
        ];
    }
    else if (categorie === 'S')
    {
        return [
            [6, 0, 6],
            [0, 6, 0],
            [6, 0, 6],
        ];
    }
    else if (categorie === 'T')
    {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}

function deseneaza_tablou(tablou, offset)
{
    tablou.forEach((linie, y) =>
    {
        linie.forEach((valoare, x) =>
        {
            if (valoare !== 0)
            {
                context.fillStyle = colors[valoare]; //foloseste culorile salvate pentru piese
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function delimiteaza() //realizeaza arena
{
    context.fillStyle = ' #000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    deseneaza_tablou(arena, {x: 0, y: 0});
    deseneaza_tablou(jucator.tablou, jucator.pozitie);
}

function imbinare(arena, jucator) //copiaza toate valorile jucatorului in arena (ex. pozitie)
{
    jucator.tablou.forEach((linie, y) =>
    {
        linie.forEach((valoare, x) =>
        {
            if (valoare !== 0)
            {
                arena[y + jucator.pozitie.y][x + jucator.pozitie.x] = valoare;
            }
        });
    });
}

function roteste(tablou, directie)  //se realizeaza prin tuples
{
    for (let y = 0; y < tablou.length; ++y)
    {
        for (let x = 0; x < y; ++x)
        {
            [
                tablou[x][y], //se face transpusa matricei
                tablou[y][x],
            ] = [
                tablou[y][x], //se face schimbul intre coloanele de pe margini
                tablou[x][y],
            ];
        }
    }

    if (directie > 0)
    {
        tablou.forEach(linie => linie.reverse());
    }
    else
    {
        tablou.reverse();
    }
}

function accelerare_jucator()
{
    jucator.pozitie.y++;
    if (ciocnire(arena, jucator))
    {
        jucator.pozitie.y--;
        imbinare(arena, jucator);
        reseteaza_jucator();
        acumuleaza_puncte();
        update_scor();
    }
    numarare_cadere = 0;
}

function mutare_jucator(offset)
{
    jucator.pozitie.x += offset;
    if (ciocnire(arena, jucator))
    {
        jucator.pozitie.x -= offset;
    }
}

function reseteaza_jucator()
{
    const pieces = 'TJLOSZI'; //"formele" pieselor
    jucator.tablou = creeaza_piesa(pieces[pieces.length * Math.random() | 0]); //alege o piesa random din cele memorate
    jucator.pozitie.y = 0;
    jucator.pozitie.x = (arena[0].length / 2 | 0) - (jucator.tablou[0].length / 2 | 0); //pozitioneaza piesa la mijloc
    if (ciocnire(arena, jucator)) //daca se atinge partea de sus a arenei
    {
        arena.forEach(linie => linie.fill(0)); //atunci se va sterge totul -> matricea se face 0
        jucator.score = 0; //scorul se face 0
        update_scor();
    }
}

function rotire_jucator(directie)
{
    const pozitie = jucator.pozitie.x;
    let offset = 1;
    roteste(jucator.tablou, directie); //roteste piesa
    while (ciocnire(arena, jucator)) //daca se roteste langa peretele arenei, fara sa treaza de margini
    {
        jucator.pozitie.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > jucator.tablou[0].length)
        {
            roteste(jucator.tablou, -directie); // se roteste inapoi
            jucator.pozitie.x = pozitie;
            return;
        }
    }
}

let numarare_cadere = 0;
let timp_cadere = 1000;

let timp2 = 0;
function update(timp1 = 0)
{
    const delta_t = timp1 - timp2;

    numarare_cadere += delta_t;
    if (numarare_cadere > timp_cadere)
    {
        accelerare_jucator();
    }

    timp2 = timp1;

    delimiteaza();
    requestAnimationFrame(update);
}

function update_scor()
{
    document.getElementById('scor').innerText = jucator.score;
}

document.addEventListener('keydown', event =>
{
    if (event.keyCode === 37)
    {
        mutare_jucator(-1);
    }
    else if (event.keyCode === 39)
    {
        mutare_jucator(1);
    }
    else if (event.keyCode === 40)
    {
        accelerare_jucator();
    }
    else if (event.keyCode === 81)
    {
        rotire_jucator(-1);
    }
    else if (event.keyCode === 87)
    {
        rotire_jucator(1);
    }
});

const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

const arena = creeaza_tablou(12, 20);

const jucator =
{
    pozitie: {x: 0, y: 0},
    tablou: null,
    score: 0,
};

reseteaza_jucator();
update_scor();
update();
