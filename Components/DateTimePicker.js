/* Creates a custom Element Tag DateTimePicker-, which can be used as a component.*/
class DateTimePicker extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  get starttime() {
    return this.getAttribute('starttime')
  }
  set starttime(starttimeVal) {
    this.setAttribute('starttime', starttimeVal)
  }
  get endtime() {
    return this.getAttribute('endtime')
  }
  set endtime(endtimeVal) {
    this.setAttribute('endtime', endtimeVal)
  }
  get date() {
    return this.getAttribute('date')
  }
  set date(dateVal) {
    this.setAttribute('date', dateVal)
  }
  get theme() {
    return this.getAttribute('theme')
  }
  set theme(theme) {
    this.setAttribute('theme', theme)
  }
  static get observedAttributes() {
    return ['endtime', 'starttime', 'date', 'theme']
  }
  attributeChangedCallback(prop, oldVal, newVal) {
    if (prop == 'theme') this.render()
    else {
      try {
        this.shadow.querySelector('.von').value = this.starttime
        this.shadow.querySelector('.bis').value = this.endtime
        this.shadow.querySelector('.date').value = this.date
        let hours = this.endtime?.split(':')[0] - this.starttime?.split(':')[0]
        let minutes =
          this.endtime?.split(':')[1] - this.starttime?.split(':')[1]
        if (minutes < 0) {
          hours = hours - 1
          minutes = 60 + minutes
        }
        if (Number(hours) < 0) {
          hours = '00'
          minutes = '00'
        }
        const sumspan = this.shadow.querySelector('.timeElapsedSpan')
        sumspan.value = `${hours}:${
          String(minutes).length == 2 ? minutes : '0' + minutes
        }`
        saveTableValue()
      } catch (ex) {}
    }
  }
  connectedCallback() {
    this.render()
  }

  render() {
    if (
      document.location.href.includes('form') ||
      document.location.href.includes('index.html')
    ) {
      const outerDiv = document.createElement('div')
      outerDiv.setAttribute('class', 'container')
      const valSpan = document.createElement('input')
      valSpan - this.setAttribute('type', 'time')
      valSpan.setAttribute('class', 'timeElapsedSpan')
      let hours = this.endtime.split(':')[0] - this.starttime.split(':')[0]
      let minutes = this.endtime.split(':')[1] - this.starttime.split(':')[1]
      if (minutes < 0) {
        hours = hours - 1
        minutes = 60 + minutes
      }
      valSpan.value = `${hours}:${
        String(minutes).length == 2 ? minutes : '0' + minutes
      }`
      valSpan.addEventListener('click', function (event) {
        const parent = event.target.parentElement.querySelector('.parent')
        if (parent.style.display === 'none' || parent.style.display === '') {
          parent.style.display = 'grid'
        } else {
          parent.style.display = 'none'
        }
      })
      const changeTimes = (starttime, endtime) => {
        this.starttime = starttime
        this.endtime = endtime
      }
      valSpan.addEventListener('change', function (event) {
        const val = event.target.value
        let mins = 0
        let hrs = 0
        if (val.includes(':'))
          [hrs, mins] = val
            .split(':')
            .map((d, i) =>
              i == 1 ? (String(d).padStart(2,'0')) : d,
            )
        else if (/[,.]/.test(val))
          [hrs, mins] = val
            .split(/[,.]/)
            .map((d, i) => (i == 1 ? Math.ceil(Number('0.' + d) * 60) : d))
        else [hrs, mins] = [val, 0]
        hrs = String(Number(hrs) + Math.floor(mins / 60))
        hrs = String(hrs).padStart(2,'0')
        mins = String(mins % 60).padStart(2,'0') % 60
        const time = `${hrs}:${mins}`
        changeTimes('00:00', time)
        event.target.value = time
      })

      const wrapperDiv = document.createElement('div')
      wrapperDiv.setAttribute('class', 'parent')
      const dateInput = document.createElement('input')
      dateInput.setAttribute('type', 'date')
      dateInput.setAttribute('id', 'date')
      dateInput.setAttribute('class', 'date')
      dateInput.setAttribute('name', 'date')
      dateInput.setAttribute('value', this.date)
      dateInput.addEventListener('input', e => (this.date = e.target.value))
      const vonInput = document.createElement('input')
      vonInput.setAttribute('type', 'time')
      vonInput.setAttribute('class', 'von')
      vonInput.setAttribute('name', 'von')
      vonInput.setAttribute('value', this.starttime)
      vonInput.addEventListener('input', e => (this.starttime = e.target.value))
      const bisInput = document.createElement('input')
      bisInput.setAttribute('type', 'time')
      bisInput.setAttribute('class', 'bis')
      bisInput.setAttribute('name', 'bis')
      bisInput.setAttribute('value', this.endtime)
      bisInput.addEventListener('input', e => (this.endtime = e.target.value))

      wrapperDiv.appendChild(dateInput)
      wrapperDiv.appendChild(vonInput)
      wrapperDiv.appendChild(bisInput)
      outerDiv.appendChild(valSpan)
      outerDiv.appendChild(wrapperDiv)
      this.shadow.replaceChildren(outerDiv)
      const myStyle = document.createElement('style')
      if (this.theme == 'dark')
        myStyle.innerText = `
        .container { display: inline-block; position: relative; }
        .timeElapsedSpan { height: 2.2rem; padding: 0 20px; font-size: 1rem; border-radius: 7px; justify-content: space-between; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); display: flex; align-items: center; cursor: pointer; background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 16px 12px; border: 1px solid #495057; width: 13.7rem; text-align: center; }
        .parent { margin-top: 0.5rem; display: none; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); grid-column-gap: 2rem; grid-row-gap: 1rem; border-radius: 16px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(5.6px); -webkit-backdrop-filter: blur(5.6px); border: 1px solid #ced4da; padding: 1rem; }
        input { color: #ced4da; background: #212529; line-height: 1.5; font-size: .875rem; font-weight: 400; margin-top: 0.5rem; border-radius: 0.5rem; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(5.6px); -webkit-backdrop-filter: blur(5.6px); border: 1px solid #ced4da; padding: 0.375rem 0.75rem; }
        .date { grid-area: 1 / 1 / 2 / 3; display: flex; justify-content: center; align-items: center;}
        .von { grid-area: 2 / 1 / 3 / 2; display: flex; justify-content: center; align-items: center;}
        .bis { grid-area: 2 / 2 / 3 / 3; display: flex; justify-content: center; align-items: center;}`
      else
        myStyle.innerText = `
        .container { display: inline-block; position: relative; }
        .timeElapsedSpan { height: 2.2rem; padding: 0 20px; font-size: 1rem; background: #fff; border-radius: 7px; justify-content: space-between; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); display: flex; align-items: center; cursor: pointer; background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 16px 12px; border: 1px solid #ced4da; width: 13.7rem; text-align: center; }
        .parent { margin-top: 0.5rem; display: none; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); grid-column-gap: 2rem; grid-row-gap: 1rem; border-radius: 16px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(5.6px); -webkit-backdrop-filter: blur(5.6px); border: 1px solid #ced4da; padding: 1rem; }
        input { line-height: 1.5; font-size: .875rem; font-weight: 400; margin-top: 0.5rem; border-radius: 0.5rem; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(5.6px); -webkit-backdrop-filter: blur(5.6px); border: 1px solid #ced4da; padding: 0.375rem 0.75rem; }
        .date { grid-area: 1 / 1 / 2 / 3; display: flex; justify-content: center; align-items: center;}
        .von { grid-area: 2 / 1 / 3 / 2; display: flex; justify-content: center; align-items: center;}
        .bis { grid-area: 2 / 2 / 3 / 3; display: flex; justify-content: center; align-items: center;}`
      this.shadow.appendChild(myStyle)
    }
  }
}
customElements.define('datetimepicker-', DateTimePicker)
