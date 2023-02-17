"use strict"

let inpItem, divList, txtNotify, txtTotal;
let btnAdd, btnDel;
let chxSelectAll;
let numTaskChecked;
let listDataItem = [], listChxItem = [], listHTMLItem = [];
let $ = document.querySelector.bind(document);

let localStorage = window.localStorage;
const prefix = 'to-do-purejs-';

window.onload = function() {
  inpItem = $('#item');
  txtTotal = $('#total');
  txtNotify = $('#notify');
  
  divList = $('#list');
  divList.addEventListener('click', onTaskSelectChange);

  chxSelectAll = $('#select-all');
  chxSelectAll.addEventListener('click', onChxSelectAllChange);
  chxSelectAll.disabled = true;

  btnDel = $('#delete');
  btnDel.style.visibility = 'hidden';
  btnDel.addEventListener('click', deleteTasks);

  btnAdd = $('#add');
  btnAdd.addEventListener('click', addItem);

  for(var key in localStorage) {
    if(key.indexOf(prefix) >= 0) {
      let item = {
        id: listDataItem.length,
        title: localStorage[key],
        done: 'false'
      }
      listDataItem.push(item);
      let newItem = addHTMLItem(item);
      listHTMLItem.push(newItem);
    }
  }
  txtTotal.textContent = '' + listDataItem.length;
}

function deleteTasks() {
  let i = listChxItem.length;
  while (i--) {
    if (listChxItem[i].checked) { 
      listDataItem.splice(i, 1);
      listChxItem.splice(i, 1);

      deleteHTMLItem(listHTMLItem[i]);
      listHTMLItem.splice(i, 1);
    } 
  }

  for(var key in localStorage) {
    if(key.indexOf(prefix) >= 0) {
      localStorage.removeItem(key);
    }
  }
  for (i = 0; i < listDataItem.length; i++) {
    localStorage.setItem(prefix + i, listDataItem[i].title);
  }

  numTaskChecked = 0;
  unselectAll();
  txtTotal.textContent = '' + listDataItem.length;
}

function onTaskSelectChange() {
  numTaskChecked = 0;
  for(let i = 0; i < listChxItem.length; i++) {
    if(listChxItem[i].checked) numTaskChecked++;
  }
  if(numTaskChecked == 0) {
    unselectAll();
  }
  else if(numTaskChecked == listDataItem.length) {
    selectAll();
  }
  else {
    btnDel.style.visibility = 'visible';
    chxSelectAll.checked = false;
  }
}

function onChxSelectAllChange() {
  if(chxSelectAll.checked && listDataItem.length > 0) selectAll();
  else unselectAll();
}

function selectAll() {
  btnDel.style.visibility = 'visible';
  numTaskChecked = listDataItem.length;
  for(let i = 0; i < listChxItem.length; i++) {
    listChxItem[i].checked = true;
  }
  chxSelectAll.checked = true;
}

function unselectAll() {
  btnDel.style.visibility = 'hidden';
  numTaskChecked = 0;
  for(let i = 0; i < listChxItem.length; i++) {
    listChxItem[i].checked = false;
  }
  chxSelectAll.checked = false;
}

function addItem() {
  if(inpItem.value == '') {
    txtNotify.textContent = 'Tekstboks er tom!';
    return;
  }

  if(isExist(inpItem.value)) {
    txtNotify.textContent = 'Varen eksisterer allerede!';
    return;
  }

  let item = {
    id: listDataItem.length,
    title: inpItem.value,
    done: 'false'
  }
  listDataItem.push(item);
  let newItem = addHTMLItem(item);
  listHTMLItem.push(newItem);
  localStorage.setItem(prefix + item.id, inpItem.value);

  txtNotify.textContent = '';
  inpItem.value = '';
  txtTotal.textContent = '' + listDataItem.length;
  chxSelectAll.disabled = false;
} 

function isExist(itemTitle) {
  for(var i = 0; i < listDataItem.length; i++){
    if(listDataItem[i].title == itemTitle) return true;
  }
  return false;
}


function addHTMLItem(item) {
  let divElement = document.createElement('div');
  divElement.setAttribute('class', 'list-item');
  
  let inputElement = document.createElement('input');
  inputElement.setAttribute('type', 'checkbox');
  inputElement.setAttribute('name', 'item');
  inputElement.setAttribute('value', 'Item 1');

  let spanElement = document.createElement('span');
  spanElement.setAttribute('class', 'list-item-title');

  let txtTitle = document.createTextNode(item.title);

  spanElement.appendChild(txtTitle);
  divElement.appendChild(inputElement);
  divElement.appendChild(spanElement);
  divList.appendChild(divElement);

  listChxItem.push(inputElement);
  return divElement;
}

function deleteHTMLItem(htmlItem) {
  while (htmlItem.firstChild) {
    htmlItem.removeChild(htmlItem.firstChild);
  }
  divList.removeChild(htmlItem);
}