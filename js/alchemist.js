(function makeBoard() {

  let buttonGroup = document.getElementsByClassName('btn__group');
  function buttonMaker(sign, color, label) {
    let button = document.createElement('button');
    let text = document.createTextNode(label);
    button.appendChild(text);
    button.classList.add('btn__piramide');
    button.classList.add('btn__piramide-' + color);
    button.id = color + '-' + sign;
    buttonGroup[0].appendChild(button);
    button.onclick = (e) => {
      result[2] = color;
      result[3] = sign;
      e.target.classList.toggle('btn__piramide-active')
    };
  }

  // fetch('./../data.json').then(response => {
  //   if (response.ok) {
  //     return response.json();
  //   }
  fetch('https://krzysztofzielinskiwork.github.io/potion-checker/data.json').then(response => {
    if (response.ok) {
      return response.json();
    }

  }).then(data => {
    data.map(el => {
      buttonMaker(el.sign, el.color, el.label
      );
    })
  });

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

  function testResult(color, sign, firstIngridient, secondIngridient, rowId) {
    this.firstIngridient = ingridientNames[firstIngridient];
    this.secondIngridient = ingridientNames[secondIngridient];
    this.sign = sign;
    this.color = color;
    this.rowId = rowId;
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
    if (e.target.classList.value.includes('temporary-solution') && active.length < 2) {
      e.target.classList.toggle('piramid__elements-active');
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
  let counter = localStorage.length;

  function addToStorage() {
    localStorage.setItem('MixingCounter' + counter, ('color: ' + result[2] + ' sign: ' + result[3]) + ' first: ' + result[4] + ' second: ' + result[1] + ' rowId: ' + result[0]);
    counter += 1;
  }

  // load game from local storage
  function loadFromLocalStorage() {
    let arr = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      arr.push(localStorage.getItem('MixingCounter' + i).split(' '));
      drinkPotionResult(arr[i][1], arr[i][3], arr[i][5], arr[i][7], 'data-elm', alchemonsMatrix);
      arr[i][3] === 'neutral' ? neutralMemo.push(new testResult(arr[i][1], arr[i][3], arr[i][5], arr[i][7])) : null;
      neutralWatcher();
      marksOnPiramide(arr[i][9], arr[i][7], arr[i][3], arr[i][1])
    }
  }

  let button = document.getElementById('confirm');

  function marksOnPiramide(rowId, lowerRowId, sign, color) {
    let hitTargetRow = document.querySelectorAll("[data-row='" + (7 - rowId) + "']");
    let img = document.createElement("img");
    img.classList.add('sign');
    if (sign === 'neutral') {
      img.src = "./img/" + sign + ".png";
    } else {
      img.src = "./img/" + color + sign + ".png";
    }
    let hitElement = hitTargetRow[0].children[lowerRowId];
    hitElement.appendChild(img);
  }

  button.addEventListener('click', function () {
    marksOnPiramide(result[0], result[1], result[3], result[2]);
    drinkPotionResult(result[2], result[3], result[4], result[1], 'data-elm', alchemonsMatrix)
    gameMemo.push(new testResult(result[2], result[3], result[4], result[1], result[0]));
    result[3] === 'neutral' ? neutralMemo.push(new testResult(result[2], result[3], result[4], result[1], result[0])) : null;
    neutralWatcher();
    addToStorage();
    result = [null, null, null, null, null];
    classNameRemover('btn__piramide-active');
    classNameRemover('piramid__elements-active');
  });

  function classNameRemover(name) {
    let elm = document.getElementsByClassName(name);
    for (let i = (elm.length - 1); i >= 0; i -= 1) {
      elm[i].classList.remove(name);
    }
  }

  let clearButton = document.getElementById('clear');
  let loadFromLocalStorageButton = document.getElementById('load');

  clearButton.onclick = (e) => {
    localStorage.clear();
    counter = 0;
    location.reload();
  };

  loadFromLocalStorageButton.onclick = (e) => {
    let activeClass = document.getElementsByClassName('active');
   if (activeClass.length == 0) {
    loadFromLocalStorage();
    loadFromLocalStorageButton.disabled = true;
   }
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

  // click on div:row mark all div row and set background to white - marks horizontaly
  board[0].addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.parentElement.classList == 'answerDivBoard__row') {
      let target = e.target;
      let rowIndex = e.target.parentElement;
      target.classList.toggle('selected');
      for (let i = 0; i < rowIndex.childNodes.length; i += 1) {
        rowIndex.childNodes[i].classList.toggle('row');
      }; // eliminates other options for selected ingridient - marks verticaly
      let allMarkedDataElm = document.querySelectorAll("[data-elm='" + target.dataset.elm + "']");
      for (let j = 0; j < allMarkedDataElm.length; j += 1) {
        allMarkedDataElm[j].classList.toggle('row');
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