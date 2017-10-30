(function makeBoard() {

  let red = ['minus', 'plus', 'plus', 'minus', 'minus', 'plus', 'minus', 'plus'];
  let green = ['plus', 'minus', 'minus', 'plus', 'minus', 'plus', 'minus', 'plus'];
  let blue = ['minus', 'plus', 'minus', 'plus', 'plus', 'minus', 'minus', 'plus'];
  let ingridientNames = ['mushroom', 'plant', 'froog', 'foot', 'flower', 'root', 'scorpion', 'feather']

  let gameMemo = [];
  let neutralMemo = [];
  let alchemonsMatrix = [];
  function alchemon(red, green, blue, id) {
    this.id = id;
    this.red = red;
    this.green = green;
    this.blue = blue;
  };
  for (let i = 0; i < red.length; i += 1) {
    alchemonsMatrix.push(new alchemon(red[i], green[i], blue[i], i))
  };

  function testResult(color, sign, firstIngridient, secondIngridient) {
    this.firstIngridient = ingridientNames[firstIngridient];
    this.secondIngridient = ingridientNames[secondIngridient];
    this.sign = sign;
    this.color = color;
  }

  // piramide board constructor
  let piramidBoard = document.getElementsByClassName('piramid__board');
  for (let i = 0; i < 8; i += 1) {
    let div = document.createElement("div");
    div.classList.add('piramid__row');
    div.dataset.row = i;
    piramidBoard[0].appendChild(div);
    for (let j = 0; j <= i; j += 1) {
      let field = document.createElement("div");
      field.classList.add(ingridientNames[j]);
      field.classList.add('piramid__elements');
      div.appendChild(field);
      if (i === 7) {
        field.style.height = '6rem';
        // let img = document.createElement("img");
        // img.src = './img/' + ingridientNames[j] + '.png';
        // img.alt = ingridientNames[j];
        // img.dataset.id = j;
        // field.appendChild(img);
        let divIngridient = document.createElement('div');
        divIngridient.dataset.id = j;        
        divIngridient.classList.add('temporary-solution');
        let text = document.createTextNode(ingridientNames[j]);
        divIngridient.appendChild(text);
        field.appendChild(divIngridient);
      }
    }
  };

  let result = []; // mixed potion sign => arr[hitRow,hitElement]

  let elm = document.querySelectorAll("[data-row='7']");
  elm[0].addEventListener('click', function (e) {
    let active = document.getElementsByClassName('piramid__elements-active');
    //if (e.target.nodeName === 'IMG' && active.length < 2) {
    if (e.target.classList.value.includes('temporary-solution') && active.length < 2) {
      e.target.classList.toggle('piramid__elements-active');
   // } else if (e.target.nodeName === 'IMG' && active.length > 1) {
    } else if (e.target.classList.value.includes('temporary-solution') && active.length > 1) {
      e.target.classList.remove('piramid__elements-active');
    }
    if (active.length > 1) {
      let rowId = active[0].dataset.id - active[1].dataset.id;
      let higherId = active[0].dataset.id > active[1].dataset.id ? active[0].dataset.id : active[1].dataset.id;
      result[4] = Number(higherId);
      let lowerRowId = active[0].dataset.id < active[1].dataset.id ? active[0].dataset.id : active[1].dataset.id;
      result[1] = Number(lowerRowId);
      if (rowId < 0) {
        result[0] = rowId * (-1);
      } else if (rowId >= 0) {
        result[0] = rowId;
      }
      return result;
    }
  });

  // local storage entries counter
  let counter = 0;

  function addToStorage() {
    localStorage.setItem('MixingCounter' + counter, ('color: ' + result[2] + ' sign: ' + result[3]) + ' first: ' + result[4] + ' second: ' + result[1]);
  //  console.log(localStorage.length);
    counter += 1;
  }

  let button = document.getElementById('confirm');

  button.addEventListener('click', function () {
    let rowId = result[0];
    let lowerRowId = result[1];
    let hitTargetRow = document.querySelectorAll("[data-row='" + (7 - rowId) + "']");
    let img = document.createElement("img");
    img.classList.add('sign');
    if (result[3] === 'neutral') {
      img.src = "./img/" + result[3] + ".png";
    } else {
      img.src = "./img/" + result[2] + result[3] + ".png";
    }
    let hitElement = hitTargetRow[0].children[lowerRowId];
    hitElement.appendChild(img);
    drinkPotionResult(result[2], result[3], result[4], result[1], 'data-elm', alchemonsMatrix)
    gameMemo.push(new testResult(result[2], result[3], result[4], result[1]));
    result[3] === 'neutral' ? neutralMemo.push(new testResult(result[2], result[3], result[4], result[1])) : null;
   // console.log(gameMemo);
   // console.log(neutralMemo);
    neutralWatcher();
    addToStorage();
    result = [null, null, null, null, null];
    let but = document.getElementsByClassName('btn__piramide-active');
    let activeIngridients = document.getElementsByClassName('piramid__elements-active');
    for (let i = (but.length - 1); i >= 0; i -= 1) {
      but[i].classList.remove('btn__piramide-active');
    }
    for (let i = (activeIngridients.length - 1); i >= 0; i -= 1) {
      activeIngridients[i].classList.remove('piramid__elements-active');
    }
  });

  let redPlusButton = document.getElementById('red-plus');
  let redMinusButton = document.getElementById('red-minus');
  let greenPlusButton = document.getElementById('green-plus');
  let greenMinusButton = document.getElementById('green-minus');
  let bluePlusButton = document.getElementById('blue-plus');
  let blueMinusButton = document.getElementById('blue-minus');
  let neutralButton = document.getElementById('neutral');
  let clearButton = document.getElementById('clear');

  clearButton.onclick = (e) => {
    localStorage.clear();
    e.target.classList.toggle('btn__piramide-active')
  };
  redPlusButton.onclick = (e) => {
    result[2] = 'red';
    result[3] = 'plus';
    e.target.classList.toggle('btn__piramide-active')
  };
  redMinusButton.onclick = (e) => {
    result[2] = 'red';
    result[3] = 'minus';
    e.target.classList.toggle('btn__piramide-active')
  };
  greenPlusButton.onclick = (e) => {
    result[2] = 'green';
    result[3] = 'plus';
    e.target.classList.toggle('btn__piramide-active')
  };
  greenMinusButton.onclick = (e) => {
    result[2] = 'green';
    result[3] = 'minus';
    e.target.classList.toggle('btn__piramide-active')
  };
  bluePlusButton.onclick = (e) => {
    result[2] = 'blue';
    result[3] = 'plus';
    e.target.classList.toggle('btn__piramide-active')
  };
  blueMinusButton.onclick = (e) => {
    result[2] = 'blue';
    result[3] = 'minus';
    e.target.classList.toggle('btn__piramide-active')
  };
  neutralButton.onclick = (e) => {
    result[3] = 'neutral';
    e.target.classList.toggle('btn__piramide-active')
  };


  //answer board constructor
  let board = document.getElementsByClassName('answerDivBoard');
  for (let i = 0; i < 8; i += 1) {
    let boardField = document.createElement("div");
    boardField.classList.add('answerDivBoard__row');
    board[0].appendChild(boardField);
    for (let j = 0; j < 8; j += 1) {
      let field = document.createElement("div");
      field.classList.add(ingridientNames[j]);
      field.classList.add('answerDivBoard__element');
      field.dataset.elm = ingridientNames[j];
      let imgR = document.createElement("img");
      let imgG = document.createElement("img");
      let imgB = document.createElement("img");
      imgR.src = "./img/red" + red[i] + ".png";
      imgG.src = "./img/green" + green[i] + ".png";
      imgB.src = "./img/blue" + blue[i] + ".png";
      field.appendChild(imgR);
      field.appendChild(imgG);
      field.appendChild(imgB);
      boardField.appendChild(field);
    }
  }

  // click on div:row mark all div row and set background to white;
  board[0].addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.parentElement.classList == 'answerDivBoard__row') {
      let target = e.target;
      let rowIndex = e.target.parentElement;
      target.classList.toggle('selected');
      for (let i = 0; i < rowIndex.childNodes.length; i += 1) {
        rowIndex.childNodes[i].classList.toggle('row');
      }
    }
  })


  // function to test potions
  function drinkPotionResult(color, sign, firstIngr, secondIngr, where, alchemonsMatrix) {
    let firstIngridient = document.querySelectorAll("[" + where + "='" + ingridientNames[firstIngr] + "']");
    let secondIngridient = document.querySelectorAll("[" + where + "='" + ingridientNames[secondIngr] + "']");
    alchemonsMatrix ? alchemonsMatrix.forEach(function (element) {
      if (element[color] && (element[color] !== sign && sign !== 'neutral')) {
        firstIngridient[element.id].classList.add(sign, color);
        secondIngridient[element.id].classList.add(color, sign);
      } else if (sign === 'neutral') {
        let divf = document.createElement('div');
        let divs = document.createElement('div');
        divf.classList.add(sign);
        divs.classList.add(sign);
        firstIngridient[element.id].appendChild(divf);
        secondIngridient[element.id].appendChild(divs);
      };
    }, this) : null;
  }

  function neutralWatcher() {
    if (neutralMemo.length > 0) {
      neutralMemo.filter(el => {
        let firstIngr = document.querySelectorAll("[data-elm='" + el.firstIngridient + "']");
        let secondIngr = document.querySelectorAll("[data-elm='" + el.secondIngridient + "']");
        for (let i = 0; i < firstIngr.length; i += 1) {
          if (
            (i % 2 === 0 && firstIngr[i].classList.value.includes('plus')) ||
            (i % 2 === 0 && firstIngr[i].classList.value.includes('minus'))
          ) {
            (secondIngr[i + 1].classList.value.includes('plus') || secondIngr[i + 1].classList.value.includes('minus')) ?
              null : secondIngr[i + 1].classList.value += ' minus';
          } else if (
            (i % 2 === 1 && firstIngr[i].classList.value.includes('plus')) ||
            (i % 2 === 1 && firstIngr[i].classList.value.includes('minus'))
          ) {
            (secondIngr[i - 1].classList.value.includes('plus') || secondIngr[i - 1].classList.value.includes('minus')) ?
              null : secondIngr[i - 1].classList.value += ' minus';
          }
        }
        for (let j = 0; j < secondIngr.length; j += 1) {
          if (
            (j % 2 === 0 && secondIngr[j].classList.value.includes('plus')) ||
            (j % 2 === 0 && secondIngr[j].classList.value.includes('minus'))
          ) {
            (firstIngr[j + 1].classList.value.includes('plus') || firstIngr[j + 1].classList.value.includes('minus')) ?
              null : firstIngr[j + 1].classList.value += ' minus';
          } else if (
            (j % 2 === 1 && secondIngr[j].classList.value.includes('plus')) ||
            (j % 2 === 1 && secondIngr[j].classList.value.includes('minus'))
          ) {
            (firstIngr[j - 1].classList.value.includes('plus') || firstIngr[j - 1].classList.value.includes('minus')) ?
              null : firstIngr[j - 1].classList.value += ' minus';
          }
        }
      });
    }
  }

})()