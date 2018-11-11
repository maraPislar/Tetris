const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20,20);

const tablou = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];

function creeaza_tablou(latime, inaltime) //s-a creeat un tablou de 0-uri
{
  const tablou = [];

  while( inaltime -- )
    tablou.push(new Array(latime).fill(0));

  return tablou;
}

function design_tablou(tablou, pornire)
{
tablou.forEach((linie, y) => {
  linie.forEach((val, x) =>
  {
      if ( val !== 0 )
    {
    context.fillStyle = 'red';
    context.fillRect(x + pornire.x, y + pornire.y, 1, 1);
  }
  });
});
}

function

function creeaza()
{
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  design_tablou(jucator.tablou, jucator.pozitie);
}

const arena = creeaza_tablou(12,20); // in constanta s-a inregistrat matricea

const jucator =
{
  pozitie:
  {
    x: 4.5, y: -1
  },
  tablou: tablou,
};

let nr = 0;
let interval = 1000 ; //milisecunde
let timp2 = 0 ;

function update( timp1 = 0 )
{
  const delta_timp = timp1 - timp2;
  timp2 = timp1;
  nr = nr + delta_timp;
  if( nr > interval )
  {
    jucator.pozitie.y ++ ;
    nr = 0 ;
  }

  creeaza();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', eveniment =>
{
  if( eveniment.keyCode == 37 )
  jucator.pozitie.x -- ;
  else if( eveniment.keyCode == 39 )
  jucator.pozitie.x ++ ;
  else if( eveniment.keyCode == 40 ) //jucatorul accelereaza piesa
  {
    jucator.pozitie.y ++ ;
    nr = 0 ; //nu va mai aparea intarzierea in milisecunde cand se accelereaza
  }
});

update();
