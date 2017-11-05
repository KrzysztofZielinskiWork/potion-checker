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
      result[0] = color;
      result[1] = sign;
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
      buttonMaker(el.sign, el.color, el.label);
    })
  });

  let red = ['minus', 'plus', 'plus', 'minus', 'minus', 'plus', 'minus', 'plus'];
  let green = ['plus', 'minus', 'minus', 'plus', 'minus', 'plus', 'minus', 'plus'];
  let blue = ['minus', 'plus', 'minus', 'plus', 'plus', 'minus', 'minus', 'plus'];
  let big = ['blue', 'blue', 'green', 'green', 'red', 'red', 'all', 'all'];
  let ingridientNames = ['mushroom', 'plant', 'froog', 'foot', 'flower', 'root', 'scorpion', 'feather'];

  let gameMemo = [];
  let neutralMemo = [];
  let alchemonsMatrix = [];
  function alchemon(red, green, blue, id, big) {
    this.id = id;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.big = big;
  };
  for (let i = 0; i < red.length; i += 1) {
    alchemonsMatrix.push(new alchemon(red[i], green[i], blue[i], i, big[i]))
  };

  function testResult(color, sign, firstIngridient, secondIngridient, piramidRowIndex) {
    this.firstIngridient = ingridientNames[firstIngridient];
    this.secondIngridient = ingridientNames[secondIngridient];
    this.sign = sign;
    this.color = color;
    this.piramidRowIndex = piramidRowIndex;
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
  // [color(str),sign(str),firstIngridient(int),secondIngridient(int),piramideRowIndex(int)]

  let elm = document.querySelectorAll("[data-row='7']");
  elm[0].addEventListener('click', function (e) {
    let active = document.getElementsByClassName('piramid__elements-active');
    if (e.target.classList.value.includes('temporary-solution') && active.length < 2) {
      e.target.classList.toggle('piramid__elements-active');
    } else if (e.target.classList.value.includes('temporary-solution') && active.length > 1) {
      e.target.classList.remove('piramid__elements-active');
    }
    if (active.length > 1) {
      let piramideRowId = active[0].dataset.id - active[1].dataset.id;
      let ingridientWithHigherId = active[0].dataset.id > active[1].dataset.id ? active[0].dataset.id : active[1].dataset.id;
      result[3] = Number(ingridientWithHigherId);
      let ingridnietWithLowerId = active[0].dataset.id < active[1].dataset.id ? active[0].dataset.id : active[1].dataset.id;
      result[2] = Number(ingridnietWithLowerId);
      if (piramideRowId < 0) {
        result[4] = piramideRowId * (-1);
      } else if (piramideRowId >= 0) {
        result[4] = piramideRowId;
      }
      return result;
    }
  });

  // local storage entries counter
  let counter = localStorage.length;

  function addToStorage(color, sign, firstIngridient, secondIngridient, piramideRowIndex) {
    localStorage.setItem('MixingCounter' + counter, ('color: ' + color + ' sign: ' + sign + ' first: ' + firstIngridient + ' second: ' + secondIngridient + ' rowId: ' + piramideRowIndex));
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
      marksOnPiramide(arr[i][1], arr[i][3], arr[i][5], arr[i][9])
    }
  }

  let button = document.getElementById('confirm');

  function marksOnPiramide(color, sign, ingridnietWithLowerId, piramideRowIndex) {
    let hitTargetRow = document.querySelectorAll("[data-row='" + (7 - piramideRowIndex) + "']");
    let img = document.createElement("img");
    img.classList.add('sign');
    if (sign === 'neutral') {
      img.src = "./img/" + sign + ".png";
    } else {
      img.src = "./img/" + color + sign + ".png";
    }
    let hitElement = hitTargetRow[0].children[ingridnietWithLowerId];
    hitElement.children.length !== 0 ? null :
      hitElement.appendChild(img);
  }

  // function to validate answers
  function validateAnswer(color, sign, firstIngridient, secondIngridient, piramideRowId) {
    let arr = [];
    let duplicate = 0;
    for (let i = 0; i < localStorage.length; i += 1) {
      arr.push(localStorage.getItem('MixingCounter' + i).split(' '));
    }
    arr.filter(el => {
      if ((firstIngridient == el[5] && secondIngridient == el[7]) ||
        (firstIngridient == el[7] && secondIngridient == el[5])) {
        console.log('duplikat');
        return duplicate += 1;
      }
    })
    if (duplicate < 1) {
      marksOnPiramide(result[0], result[1], result[2], result[4]);
      drinkPotionResult(result[0], result[1], result[2], result[3], 'data-elm', alchemonsMatrix)
      // gameMemo.push(new testResult(result[0], result[1], result[2], result[3, result[4]));
      result[1] === 'neutral' ? neutralMemo.push(new testResult(result[0], result[1], result[2], result[3], result[4])) : null;
      neutralWatcher();
      addToStorage(color, sign, firstIngridient, secondIngridient, piramideRowId)
    }
  }

  button.addEventListener('click', function () {
    validateAnswer(result[0], result[1], result[2], result[3], result[4]);
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

      if (big[i] === 'red') {
        imgR.classList.add('big');
      } else if (big[i] === 'green') {
        imgG.classList.add('big');
      } else if (big[i] === 'blue') {
        imgB.classList.add('big')
      } else {
        imgR.classList.add('big');
        imgG.classList.add('big');
        imgB.classList.add('big')
      }
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
        allMarkedDataElm[j].classList.toggle('column');
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