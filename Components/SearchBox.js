/* Creates a custom Element Tag Searchbox-, which can be used as a component.*/
class SearchBox extends HTMLElement {
    constructor() {
      super()
      this.shadow = this.attachShadow({ mode: 'open' })
    }
  
    get labeltext() {
      return this.getAttribute('labeltext')
    }
    set labeltext(labTxt) {
      this.setAttribute('labeltext', labTxt)
    }
    get optionlist() {
      return this.getAttribute('optionlist')
    }
    set optionlist(optLst) {
      this.setAttribute('optionlist', optLst)
    }
    get selectedvalue() {
      return this.getAttribute('selectedvalue')
    }
    set selectedvalue(selVal) {
      this.setAttribute('selectedvalue', selVal)
    }
    get theme() {
      return this.getAttribute('theme')
    }
    set theme(theme) {
      this.setAttribute('theme', theme)
    }
    static get observedAttributes() {
      return ['optionlist', 'labeltext', 'selectedvalue', 'theme']
    }
    attributeChangedCallback(prop, oldVal, newVal) {
      this.buildElements()
    }
    connectedCallback() {
      this.buildElements()
    }
  
    buildElements() {
      if (
        document.location.href.includes('form') ||
        document.location.href.includes('index.html')
      ) {
        if (!this.optionlist.startsWith('Keine Auswahl;   '))
          this.optionlist = 'Keine Auswahl;   ' + this.optionlist
        this.render()
        this.addOptions(this.shadow)
      }
    }
  
    addOptions(selected) {
      this.shadow.querySelector('.options').innerHTML = ''
      this.optionlist?.split(';   ').forEach(data => {
        let isSelected = data == selected ? 'selected' : ''
        const myLi = document.createElement('button')
        myLi.setAttribute('class', isSelected)
        myLi.innerHTML = data || 'Keine Auswahl'
        myLi.addEventListener('click', e => this.updateName(e))
        this.shadow.querySelector('.options').appendChild(myLi)
      })
    }
  
    updateName(selectedLi) {
      this.shadow.querySelector('input').value = ''
      this.addOptions(selectedLi.target?.innerHTML || selectedLi.innerHTML)
      this.shadow.querySelector('.wrapper').classList.remove('active')
      this.setAttribute(
        'selectedvalue',
        selectedLi.target?.innerHTML || selectedLi.innerHTML,
      )
      if (
        (selectedLi.target?.innerHTML || selectedLi.innerHTML) == 'Keine Auswahl'
      )
        this.setAttribute('selectedvalue', this.labeltext)
      if (this.parentElement.tagName == 'TD') saveTableValue()
    }
  
    render() {
      if (
        document.location.href.includes('form') ||
        document.location.href.includes('index.html')
      ) {
        const outerDiv = document.createElement('div')
        outerDiv.setAttribute('class', 'mb-3')
        const wrapperDiv = document.createElement('div')
        wrapperDiv.setAttribute('class', 'wrapper')
  
        const selbtnDiv = document.createElement('div')
        selbtnDiv.setAttribute('class', 'select-btn')
        const selSpan = document.createElement('span')
        selSpan.innerHTML = this.selectedvalue || this.labeltext
        const selI = document.createElement('i')
        selI.setAttribute('class', 'fa-sharp fa-solid fa-caret-down')
        selbtnDiv.appendChild(selSpan)
        selbtnDiv.innerHTML +=
          '<span class="material-symbols-outlined" style="font-weight: bolder;">expand_circle_down</span>'
        wrapperDiv.appendChild(selbtnDiv)
  
        const contentDiv = document.createElement('div')
        contentDiv.setAttribute('class', 'content')
        const searchDiv = document.createElement('div')
        searchDiv.setAttribute('class', 'search')
        const searchI = document.createElement('i')
        searchI.innerHTML +=
          '<span class="material-symbols-outlined" style="font-weight: bolder;">search</span>'
        const searchInput = document.createElement('input')
        searchInput.setAttribute('spellcheck', false)
        searchInput.setAttribute('type', 'text')
        searchInput.setAttribute('placeholder', this.labeltext)
        const searchList = document.createElement('ul')
        searchList.setAttribute('class', 'options')
        searchDiv.appendChild(searchI)
        searchDiv.appendChild(searchInput)
        contentDiv.appendChild(searchDiv)
        contentDiv.appendChild(searchList)
        wrapperDiv.appendChild(contentDiv)
  
        outerDiv.appendChild(wrapperDiv)
        this.shadow.replaceChildren(outerDiv)
        this.addOptions()
        this.shadow
          .querySelector('input')
          .addEventListener('keydown', ev => keyPressHandler(ev))
        try {
          document
            .querySelector('input[id="Zeit"]')
            .addEventListener('keydown', ev => keyPressHandler(ev))
        } catch (ex) {}
        function keyPressHandler(ev) {
          if (actionsCooldown) return
          actionsCooldown = true
          const actElem = document.activeElement
          if (actElem.id == 'Zeit' && ev.code == 'Tab')
            document
              .querySelector('SearchBox-')
              .shadow.querySelector('.select-btn')
              .click()
          const actShaElem = actElem.shadow?.activeElement
          if (['ArrowDown', 'ArrowUp', 'Tab'].includes(ev.code)) {
            ev.preventDefault()
            ev.stopPropagation()
          }
          if (ev.code == 'ArrowDown') {
            if (document.activeElement.shadow.activeElement.tagName == 'INPUT') {
              const firstElement =
                document.activeElement.shadow.querySelectorAll('button')[0]
              firstElement.focus()
              firstElement.addEventListener('keydown', ev => keyPressHandler(ev))
            } else {
              const lis = actElem.shadow.querySelectorAll('button')
              let found = false
              for (let i = 0; found != -1 && i < lis.length; i++) {
                if (found) {
                  lis[i].focus()
                  lis[i].addEventListener('keydown', ev => keyPressHandler(ev))
                  found = -1
                } else if (lis[i] == actShaElem) found = true
              }
            }
          }
          if (ev.code == 'ArrowUp') {
            if (document.activeElement.shadow.activeElement.tagName == 'INPUT') {
              const elements =
                document.activeElement.shadow.querySelectorAll('button')
              elements[elements.length - 1].focus()
              elements[elements.length - 1].addEventListener('keydown', ev =>
                keyPressHandler(ev),
              )
            } else {
              const lis = actElem.shadow.querySelectorAll('button')
              let found = false
              for (let i = lis.length - 1; found != -1 && i >= 0; i--) {
                if (found) {
                  lis[i].focus()
                  lis[i].addEventListener('keydown', ev => keyPressHandler(ev))
                  found = -1
                } else if (lis[i] == actShaElem) found = true
              }
            }
          }
          if (ev.code == 'Enter')
            if (actShaElem.tagName == 'INPUT')
              document.activeElement.shadow.querySelectorAll('button')[0].click()
          if (actElem.id != 'Zeit' && ev.code == 'Tab') {
            if (actShaElem.tagName == 'INPUT')
              document.activeElement.shadow.querySelectorAll('button')[0].click()
            else document.activeElement.shadow.activeElement.click()
            const sbs = document.querySelectorAll('SearchBox-')
            let ind = -1
            for (let i = 0; i < sbs.length; i++) {
              if (actElem == sbs[i]) ind = i
            }
            if (ind >= 0) {
              if (ind < 2)
                sbs[ind + 1].shadow.querySelector('.select-btn').click()
              else document.querySelector('#Beschreibung').focus()
            }
          }
          if (ev.code == 'Escape')
            document.activeElement.shadow.querySelector('.select-btn').click()
          setTimeout(() => (actionsCooldown = false), 50)
        }
  
        this.shadow.querySelector('input').addEventListener('keyup', () => {
          let arr = []
          let searchWord = this.shadow.querySelector('input').value.toLowerCase()
          arr = this.optionlist
            .split(';   ')
            .filter(data => {
              return data.toLowerCase().includes(searchWord) || data == ''
            })
            .map(data => {
              let isSelected =
                data ==
                this.shadow.querySelector('.select-btn').firstElementChild
                  .innerText
                  ? 'selected'
                  : ''
              const myLi = document.createElement('button')
              myLi.setAttribute('class', isSelected)
              myLi.innerHTML = data || 'Keine Auswahl'
              myLi.addEventListener('click', e => this.updateName(e))
              return myLi
            })
          this.shadow.querySelector('.options').innerHTML = ''
          arr.forEach(d => this.shadow.querySelector('.options').appendChild(d))
        })
        this.shadow.querySelector('.select-btn').addEventListener('click', () => {
          this.shadow.querySelector('.wrapper').classList.toggle('active')
          this.shadow.querySelector('input').focus()
        })
        const myStyle = document.createElement('style')
        if (this.theme == 'dark')//212529
          myStyle.innerText = `
              button { background: none; border: none; padding: 0; font: inherit; width: 100%; color: #fff}
              button:focus, button:hover {   border-radius: 5px;   background: #2b3025; }
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
              * {   margin: 0;   padding: 0;   box-sizing: border-box;   font-family: 'Poppins', sans-serif; }
              ::selection {   color: #212529;   background: #4285f4; }
              .wrapper {   width: 370px;   margin: 85px auto 0; }
              .select-btn, button {   display: flex;   align-items: center;   cursor: pointer; }
              .select-btn {   height: 2.2rem;   padding: 0 20px;   font-size: 1rem;   background: #212529;   border-radius: 7px;   justify-content: space-between;
                  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
              .select-btn i {   font-size: 1rem;   transition: transform 0.3s linear; }
              .wrapper.active .select-btn i {   transform: rotate(-180deg); }
              .content {   display: none;   padding: 20px;   background: #212529;   border-radius: 7px;   box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
              .wrapper.active .content {   display: block; }
              .content .search {   position: relative; }
              .search i {   top: 60%;   left: 15px;   color: #fff;   font-size: 1rem;   pointer-events: none;   transform: translateY(-50%);   position: absolute; }
              .wrapper {   display: block;   width: 100%;   -moz-padding-start: calc(0.75rem - 3px);   font-size: 1rem;   font-weight: 400;   line-height: 1.5;   color: #fff;
                  background-color: #212529;   background-repeat: no-repeat;   background-position: right 0.75rem center;   background-size: 16px 12px;
                  border: 1px solid #ced4da;   border-radius: 0.375rem;   transition: border-color 0.15s ease-in-out,     box-shadow 0.15s ease-in-out;   -moz-appearance: none;
                  appearance: none;   margin: 0;   font-family: inherit;   box-sizing: border-box; }
              .form-label {   margin-bottom: 0.5rem;   display: inline-block;   box-sizing: border-box;   cursor: default; }
              .mb-3 {   margin-bottom: 1rem !important;   box-sizing: border-box;   display: block; }
              .search input {   height: 2rem; width: 100%;   outline: none;   font-size: 1rem;   border-radius: 5px;   padding: 0 20px 0 43px;   border: 1px solid #b3b3b3;  background: #212529; color: #fff }
              .search input:focus {   padding-left: 42px;   border: 2px solid #4285f4; }
              .search input::placeholder {   color: rgba(222,226,230,.5); }
              .content .options {   margin-top: 10px;   max-height: 250px;   overflow-y: auto;   padding-right: 7px; }
              .options button {   padding: 0 13px;   font-size: 1rem; }
              .options button:hover, .options button:focus, li.selected {   border-radius: 5px;   background: rgba(222,226,230,.5); }
              .options::-webkit-scrollbar {   width: 7px; }
              .options::-webkit-scrollbar-track {   background: #f1f1f1;   border-radius: 25px; }
              .options::-webkit-scrollbar-thumb {   background: #ccc;   border-radius: 25px; }
              .options::-webkit-scrollbar-thumb:hover {   background: #b3b3b3; }`
        else
          myStyle.innerText = `
              button { background: none; border: none; padding: 0; font: inherit; width: 100% }
              button:focus {   border-radius: 5px;   background: #f2f2f2; }
              button:hover {   border-radius: 5px;   background: #f2f2f2; }
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
              * {   margin: 0;   padding: 0;   box-sizing: border-box;   font-family: 'Poppins', sans-serif; }
              ::selection {   color: #fff;   background: #4285f4; }
              .wrapper {   width: 370px;   margin: 85px auto 0; }
              .select-btn, button {   display: flex;   align-items: center;   cursor: pointer; }
              .select-btn {   height: 2.2rem;   padding: 0 20px;   font-size: 1rem;   background: #fff;   border-radius: 7px;   justify-content: space-between;   box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
              .select-btn i {   font-size: 1rem;   transition: transform 0.3s linear; }
              .wrapper.active .select-btn i {   transform: rotate(-180deg); }
              .content {   display: none;   padding: 20px;   background: #fff;   border-radius: 7px;   box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
              .wrapper.active .content {   display: block; }
              .content .search {   position: relative; }
              .search i {   top: 60%;   left: 15px;   color: #999;   font-size: 1rem;   pointer-events: none;   transform: translateY(-50%);   position: absolute; }
              .wrapper {   display: block;   width: 100%;   -moz-padding-start: calc(0.75rem - 3px);   font-size: 1rem;   font-weight: 400;   line-height: 1.5;   color: #212529;   background-color: #fff;   background-image: url(     data:image/svg + xml;charset=utf-8,     %3Csvgxmlns='http://www.w3.org/2000/svg'viewBox='0 0 16 16'%3E%3Cfill='none'stroke='%23343a40'stroke-linecap='round'stroke-linejoin='round'stroke-width='2'd='m2 5 6 6 6-6'/%3E%3C/svg%3E   );   background-repeat: no-repeat;   background-position: right 0.75rem center;   background-size: 16px 12px;   border: 1px solid #ced4da;   border-radius: 0.375rem;   transition: border-color 0.15s ease-in-out,     box-shadow 0.15s ease-in-out;   -moz-appearance: none;   appearance: none;   margin: 0;   font-family: inherit;   box-sizing: border-box; }
              .form-label {   margin-bottom: 0.5rem;   display: inline-block;   box-sizing: border-box;   cursor: default; }
              .mb-3 {   margin-bottom: 1rem !important;   box-sizing: border-box;   display: block; }
              .search input {   height: 2rem; width: 100%;   outline: none;   font-size: 1rem;   border-radius: 5px;   padding: 0 20px 0 43px;   border: 1px solid #b3b3b3; }
              .search input:focus {   padding-left: 42px;   border: 2px solid #4285f4; }
              .search input::placeholder {   color: #bfbfbf; }
              .content .options {   margin-top: 10px;   max-height: 250px;   overflow-y: auto;   padding-right: 7px; }
              .options::-webkit-scrollbar {   width: 7px; }
              .options::-webkit-scrollbar-track {   background: #f1f1f1;   border-radius: 25px; }
              .options::-webkit-scrollbar-thumb {   background: #ccc;   border-radius: 25px; }
              .options::-webkit-scrollbar-thumb:hover {   background: #b3b3b3; }
              .options button {   padding: 0 13px;   font-size: 1rem; }
              .options button:hover, li.selected {   border-radius: 5px;   background: #f2f2f2; }`
        this.shadow.appendChild(myStyle)
        const materialSymbolsLink = document.createElement('link')
        materialSymbolsLink.setAttribute('rel', 'stylesheet')
        materialSymbolsLink.setAttribute(
          'href',
          'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@200',
        )
        this.shadow.appendChild(materialSymbolsLink)
      }
    }
  }
  customElements.define('searchbox-', SearchBox)
  